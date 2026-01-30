---
source: https://docs.molt.bot/concepts/agent-loop
title: Agent loop - Moltbot
---

[Skip to main content](https://docs.molt.bot/concepts/agent-loop#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Agent Loop (Moltbot)](https://docs.molt.bot/concepts/agent-loop#agent-loop-moltbot)
- [Entry points](https://docs.molt.bot/concepts/agent-loop#entry-points)
- [How it works (high-level)](https://docs.molt.bot/concepts/agent-loop#how-it-works-high-level)
- [Queueing + concurrency](https://docs.molt.bot/concepts/agent-loop#queueing-%2B-concurrency)
- [Session + workspace preparation](https://docs.molt.bot/concepts/agent-loop#session-%2B-workspace-preparation)
- [Prompt assembly + system prompt](https://docs.molt.bot/concepts/agent-loop#prompt-assembly-%2B-system-prompt)
- [Hook points (where you can intercept)](https://docs.molt.bot/concepts/agent-loop#hook-points-where-you-can-intercept)
- [Internal hooks (Gateway hooks)](https://docs.molt.bot/concepts/agent-loop#internal-hooks-gateway-hooks)
- [Plugin hooks (agent + gateway lifecycle)](https://docs.molt.bot/concepts/agent-loop#plugin-hooks-agent-%2B-gateway-lifecycle)
- [Streaming + partial replies](https://docs.molt.bot/concepts/agent-loop#streaming-%2B-partial-replies)
- [Tool execution + messaging tools](https://docs.molt.bot/concepts/agent-loop#tool-execution-%2B-messaging-tools)
- [Reply shaping + suppression](https://docs.molt.bot/concepts/agent-loop#reply-shaping-%2B-suppression)
- [Compaction + retries](https://docs.molt.bot/concepts/agent-loop#compaction-%2B-retries)
- [Event streams (today)](https://docs.molt.bot/concepts/agent-loop#event-streams-today)
- [Chat channel handling](https://docs.molt.bot/concepts/agent-loop#chat-channel-handling)
- [Timeouts](https://docs.molt.bot/concepts/agent-loop#timeouts)
- [Where things can end early](https://docs.molt.bot/concepts/agent-loop#where-things-can-end-early)

# [​](https://docs.molt.bot/concepts/agent-loop\#agent-loop-moltbot)  Agent Loop (Moltbot)

An agentic loop is the full “real” run of an agent: intake → context assembly → model inference →
tool execution → streaming replies → persistence. It’s the authoritative path that turns a message
into actions and a final reply, while keeping session state consistent.In Moltbot, a loop is a single, serialized run per session that emits lifecycle and stream events
as the model thinks, calls tools, and streams output. This doc explains how that authentic loop is
wired end-to-end.

## [​](https://docs.molt.bot/concepts/agent-loop\#entry-points)  Entry points

- Gateway RPC: `agent` and `agent.wait`.
- CLI: `agent` command.

## [​](https://docs.molt.bot/concepts/agent-loop\#how-it-works-high-level)  How it works (high-level)

1. `agent` RPC validates params, resolves session (sessionKey/sessionId), persists session metadata, returns `{ runId, acceptedAt }` immediately.
2. `agentCommand`runs the agent:

   - resolves model + thinking/verbose defaults
   - loads skills snapshot
   - calls `runEmbeddedPiAgent` (pi-agent-core runtime)
   - emits **lifecycle end/error** if the embedded loop does not emit one
3. `runEmbeddedPiAgent`:

   - serializes runs via per-session + global queues
   - resolves model + auth profile and builds the pi session
   - subscribes to pi events and streams assistant/tool deltas
   - enforces timeout -> aborts run if exceeded
   - returns payloads + usage metadata
4. `subscribeEmbeddedPiSession` bridges pi-agent-core events to Moltbot `agent` stream:

   - tool events => `stream: "tool"`
   - assistant deltas => `stream: "assistant"`
   - lifecycle events => `stream: "lifecycle"` (`phase: "start" | "end" | "error"`)
5. `agent.wait` uses `waitForAgentJob`:

   - waits for **lifecycle end/error** for `runId`
   - returns `{ status: ok|error|timeout, startedAt, endedAt, error? }`

## [​](https://docs.molt.bot/concepts/agent-loop\#queueing-+-concurrency)  Queueing + concurrency

- Runs are serialized per session key (session lane) and optionally through a global lane.
- This prevents tool/session races and keeps session history consistent.
- Messaging channels can choose queue modes (collect/steer/followup) that feed this lane system.
See [Command Queue](https://docs.molt.bot/concepts/queue).

## [​](https://docs.molt.bot/concepts/agent-loop\#session-+-workspace-preparation)  Session + workspace preparation

- Workspace is resolved and created; sandboxed runs may redirect to a sandbox workspace root.
- Skills are loaded (or reused from a snapshot) and injected into env and prompt.
- Bootstrap/context files are resolved and injected into the system prompt report.
- A session write lock is acquired; `SessionManager` is opened and prepared before streaming.

## [​](https://docs.molt.bot/concepts/agent-loop\#prompt-assembly-+-system-prompt)  Prompt assembly + system prompt

- System prompt is built from Moltbot’s base prompt, skills prompt, bootstrap context, and per-run overrides.
- Model-specific limits and compaction reserve tokens are enforced.
- See [System prompt](https://docs.molt.bot/concepts/system-prompt) for what the model sees.

## [​](https://docs.molt.bot/concepts/agent-loop\#hook-points-where-you-can-intercept)  Hook points (where you can intercept)

Moltbot has two hook systems:

- **Internal hooks** (Gateway hooks): event-driven scripts for commands and lifecycle events.
- **Plugin hooks**: extension points inside the agent/tool lifecycle and gateway pipeline.

### [​](https://docs.molt.bot/concepts/agent-loop\#internal-hooks-gateway-hooks)  Internal hooks (Gateway hooks)

- **`agent:bootstrap`**: runs while building bootstrap files before the system prompt is finalized.
Use this to add/remove bootstrap context files.
- **Command hooks**: `/new`, `/reset`, `/stop`, and other command events (see Hooks doc).

See [Hooks](https://docs.molt.bot/hooks) for setup and examples.

### [​](https://docs.molt.bot/concepts/agent-loop\#plugin-hooks-agent-+-gateway-lifecycle)  Plugin hooks (agent + gateway lifecycle)

These run inside the agent loop or gateway pipeline:

- **`before_agent_start`**: inject context or override system prompt before the run starts.
- **`agent_end`**: inspect the final message list and run metadata after completion.
- **`before_compaction` / `after_compaction`**: observe or annotate compaction cycles.
- **`before_tool_call` / `after_tool_call`**: intercept tool params/results.
- **`tool_result_persist`**: synchronously transform tool results before they are written to the session transcript.
- **`message_received` / `message_sending` / `message_sent`**: inbound + outbound message hooks.
- **`session_start` / `session_end`**: session lifecycle boundaries.
- **`gateway_start` / `gateway_stop`**: gateway lifecycle events.

See [Plugins](https://docs.molt.bot/plugin#plugin-hooks) for the hook API and registration details.

## [​](https://docs.molt.bot/concepts/agent-loop\#streaming-+-partial-replies)  Streaming + partial replies

- Assistant deltas are streamed from pi-agent-core and emitted as `assistant` events.
- Block streaming can emit partial replies either on `text_end` or `message_end`.
- Reasoning streaming can be emitted as a separate stream or as block replies.
- See [Streaming](https://docs.molt.bot/concepts/streaming) for chunking and block reply behavior.

## [​](https://docs.molt.bot/concepts/agent-loop\#tool-execution-+-messaging-tools)  Tool execution + messaging tools

- Tool start/update/end events are emitted on the `tool` stream.
- Tool results are sanitized for size and image payloads before logging/emitting.
- Messaging tool sends are tracked to suppress duplicate assistant confirmations.

## [​](https://docs.molt.bot/concepts/agent-loop\#reply-shaping-+-suppression)  Reply shaping + suppression

- Final payloads are assembled from:
  - assistant text (and optional reasoning)
  - inline tool summaries (when verbose + allowed)
  - assistant error text when the model errors
- `NO_REPLY` is treated as a silent token and filtered from outgoing payloads.
- Messaging tool duplicates are removed from the final payload list.
- If no renderable payloads remain and a tool errored, a fallback tool error reply is emitted
(unless a messaging tool already sent a user-visible reply).

## [​](https://docs.molt.bot/concepts/agent-loop\#compaction-+-retries)  Compaction + retries

- Auto-compaction emits `compaction` stream events and can trigger a retry.
- On retry, in-memory buffers and tool summaries are reset to avoid duplicate output.
- See [Compaction](https://docs.molt.bot/concepts/compaction) for the compaction pipeline.

## [​](https://docs.molt.bot/concepts/agent-loop\#event-streams-today)  Event streams (today)

- `lifecycle`: emitted by `subscribeEmbeddedPiSession` (and as a fallback by `agentCommand`)
- `assistant`: streamed deltas from pi-agent-core
- `tool`: streamed tool events from pi-agent-core

## [​](https://docs.molt.bot/concepts/agent-loop\#chat-channel-handling)  Chat channel handling

- Assistant deltas are buffered into chat `delta` messages.
- A chat `final` is emitted on **lifecycle end/error**.

## [​](https://docs.molt.bot/concepts/agent-loop\#timeouts)  Timeouts

- `agent.wait` default: 30s (just the wait). `timeoutMs` param overrides.
- Agent runtime: `agents.defaults.timeoutSeconds` default 600s; enforced in `runEmbeddedPiAgent` abort timer.

## [​](https://docs.molt.bot/concepts/agent-loop\#where-things-can-end-early)  Where things can end early

- Agent timeout (abort)
- AbortSignal (cancel)
- Gateway disconnect or RPC timeout
- `agent.wait` timeout (wait-only, does not stop agent)

[Agent](https://docs.molt.bot/concepts/agent) [System prompt](https://docs.molt.bot/concepts/system-prompt)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.