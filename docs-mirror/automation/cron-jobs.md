---
source: https://docs.molt.bot/automation/cron-jobs
title: Cron jobs - Moltbot
---

[Skip to main content](https://docs.molt.bot/automation/cron-jobs#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Cron jobs (Gateway scheduler)](https://docs.molt.bot/automation/cron-jobs#cron-jobs-gateway-scheduler)
- [TL;DR](https://docs.molt.bot/automation/cron-jobs#tl%3Bdr)
- [Beginner-friendly overview](https://docs.molt.bot/automation/cron-jobs#beginner-friendly-overview)
- [Concepts](https://docs.molt.bot/automation/cron-jobs#concepts)
- [Jobs](https://docs.molt.bot/automation/cron-jobs#jobs)
- [Schedules](https://docs.molt.bot/automation/cron-jobs#schedules)
- [Main vs isolated execution](https://docs.molt.bot/automation/cron-jobs#main-vs-isolated-execution)
- [Main session jobs (system events)](https://docs.molt.bot/automation/cron-jobs#main-session-jobs-system-events)
- [Isolated jobs (dedicated cron sessions)](https://docs.molt.bot/automation/cron-jobs#isolated-jobs-dedicated-cron-sessions)
- [Payload shapes (what runs)](https://docs.molt.bot/automation/cron-jobs#payload-shapes-what-runs)
- [Model and thinking overrides](https://docs.molt.bot/automation/cron-jobs#model-and-thinking-overrides)
- [Delivery (channel + target)](https://docs.molt.bot/automation/cron-jobs#delivery-channel-%2B-target)
- [Telegram delivery targets (topics / forum threads)](https://docs.molt.bot/automation/cron-jobs#telegram-delivery-targets-topics-%2F-forum-threads)
- [Storage & history](https://docs.molt.bot/automation/cron-jobs#storage-%26-history)
- [Configuration](https://docs.molt.bot/automation/cron-jobs#configuration)
- [CLI quickstart](https://docs.molt.bot/automation/cron-jobs#cli-quickstart)
- [Gateway API surface](https://docs.molt.bot/automation/cron-jobs#gateway-api-surface)
- [Troubleshooting](https://docs.molt.bot/automation/cron-jobs#troubleshooting)
- [“Nothing runs”](https://docs.molt.bot/automation/cron-jobs#%E2%80%9Cnothing-runs%E2%80%9D)
- [Telegram delivers to the wrong place](https://docs.molt.bot/automation/cron-jobs#telegram-delivers-to-the-wrong-place)

# [​](https://docs.molt.bot/automation/cron-jobs\#cron-jobs-gateway-scheduler)  Cron jobs (Gateway scheduler)

> **Cron vs Heartbeat?** See [Cron vs Heartbeat](https://docs.molt.bot/automation/cron-vs-heartbeat) for guidance on when to use each.

Cron is the Gateway’s built-in scheduler. It persists jobs, wakes the agent at
the right time, and can optionally deliver output back to a chat.If you want _“run this every morning”_ or _“poke the agent in 20 minutes”_,
cron is the mechanism.

## [​](https://docs.molt.bot/automation/cron-jobs\#tl;dr)  TL;DR

- Cron runs **inside the Gateway** (not inside the model).
- Jobs persist under `~/.clawdbot/cron/` so restarts don’t lose schedules.
- Two execution styles:
  - **Main session**: enqueue a system event, then run on the next heartbeat.
  - **Isolated**: run a dedicated agent turn in `cron:<jobId>`, optionally deliver output.
- Wakeups are first-class: a job can request “wake now” vs “next heartbeat”.

## [​](https://docs.molt.bot/automation/cron-jobs\#beginner-friendly-overview)  Beginner-friendly overview

Think of a cron job as: **when** to run + **what** to do.

1. **Choose a schedule**   - One-shot reminder → `schedule.kind = "at"` (CLI: `--at`)
   - Repeating job → `schedule.kind = "every"` or `schedule.kind = "cron"`
   - If your ISO timestamp omits a timezone, it is treated as **UTC**.
2. **Choose where it runs**   - `sessionTarget: "main"` → run during the next heartbeat with main context.
   - `sessionTarget: "isolated"` → run a dedicated agent turn in `cron:<jobId>`.
3. **Choose the payload**   - Main session → `payload.kind = "systemEvent"`
   - Isolated session → `payload.kind = "agentTurn"`

Optional: `deleteAfterRun: true` removes successful one-shot jobs from the store.

## [​](https://docs.molt.bot/automation/cron-jobs\#concepts)  Concepts

### [​](https://docs.molt.bot/automation/cron-jobs\#jobs)  Jobs

A cron job is a stored record with:

- a **schedule** (when it should run),
- a **payload** (what it should do),
- optional **delivery** (where output should be sent).
- optional **agent binding** (`agentId`): run the job under a specific agent; if
missing or unknown, the gateway falls back to the default agent.

Jobs are identified by a stable `jobId` (used by CLI/Gateway APIs).
In agent tool calls, `jobId` is canonical; legacy `id` is accepted for compatibility.
Jobs can optionally auto-delete after a successful one-shot run via `deleteAfterRun: true`.

### [​](https://docs.molt.bot/automation/cron-jobs\#schedules)  Schedules

Cron supports three schedule kinds:

- `at`: one-shot timestamp (ms since epoch). Gateway accepts ISO 8601 and coerces to UTC.
- `every`: fixed interval (ms).
- `cron`: 5-field cron expression with optional IANA timezone.

Cron expressions use `croner`. If a timezone is omitted, the Gateway host’s
local timezone is used.

### [​](https://docs.molt.bot/automation/cron-jobs\#main-vs-isolated-execution)  Main vs isolated execution

#### [​](https://docs.molt.bot/automation/cron-jobs\#main-session-jobs-system-events)  Main session jobs (system events)

Main jobs enqueue a system event and optionally wake the heartbeat runner.
They must use `payload.kind = "systemEvent"`.

- `wakeMode: "next-heartbeat"` (default): event waits for the next scheduled heartbeat.
- `wakeMode: "now"`: event triggers an immediate heartbeat run.

This is the best fit when you want the normal heartbeat prompt + main-session context.
See [Heartbeat](https://docs.molt.bot/gateway/heartbeat).

#### [​](https://docs.molt.bot/automation/cron-jobs\#isolated-jobs-dedicated-cron-sessions)  Isolated jobs (dedicated cron sessions)

Isolated jobs run a dedicated agent turn in session `cron:<jobId>`.Key behaviors:

- Prompt is prefixed with `[cron:<jobId> <job name>]` for traceability.
- Each run starts a **fresh session id** (no prior conversation carry-over).
- A summary is posted to the main session (prefix `Cron`, configurable).
- `wakeMode: "now"` triggers an immediate heartbeat after posting the summary.
- If `payload.deliver: true`, output is delivered to a channel; otherwise it stays internal.

Use isolated jobs for noisy, frequent, or “background chores” that shouldn’t spam
your main chat history.

### [​](https://docs.molt.bot/automation/cron-jobs\#payload-shapes-what-runs)  Payload shapes (what runs)

Two payload kinds are supported:

- `systemEvent`: main-session only, routed through the heartbeat prompt.
- `agentTurn`: isolated-session only, runs a dedicated agent turn.

Common `agentTurn` fields:

- `message`: required text prompt.
- `model` / `thinking`: optional overrides (see below).
- `timeoutSeconds`: optional timeout override.
- `deliver`: `true` to send output to a channel target.
- `channel`: `last` or a specific channel.
- `to`: channel-specific target (phone/chat/channel id).
- `bestEffortDeliver`: avoid failing the job if delivery fails.

Isolation options (only for `session=isolated`):

- `postToMainPrefix` (CLI: `--post-prefix`): prefix for the system event in main.
- `postToMainMode`: `summary` (default) or `full`.
- `postToMainMaxChars`: max chars when `postToMainMode=full` (default 8000).

### [​](https://docs.molt.bot/automation/cron-jobs\#model-and-thinking-overrides)  Model and thinking overrides

Isolated jobs (`agentTurn`) can override the model and thinking level:

- `model`: Provider/model string (e.g., `anthropic/claude-sonnet-4-20250514`) or alias (e.g., `opus`)
- `thinking`: Thinking level (`off`, `minimal`, `low`, `medium`, `high`, `xhigh`; GPT-5.2 + Codex models only)

Note: You can set `model` on main-session jobs too, but it changes the shared main
session model. We recommend model overrides only for isolated jobs to avoid
unexpected context shifts.Resolution priority:

1. Job payload override (highest)
2. Hook-specific defaults (e.g., `hooks.gmail.model`)
3. Agent config default

### [​](https://docs.molt.bot/automation/cron-jobs\#delivery-channel-+-target)  Delivery (channel + target)

Isolated jobs can deliver output to a channel. The job payload can specify:

- `channel`: `whatsapp` / `telegram` / `discord` / `slack` / `mattermost` (plugin) / `signal` / `imessage` / `last`
- `to`: channel-specific recipient target

If `channel` or `to` is omitted, cron can fall back to the main session’s “last route”
(the last place the agent replied).Delivery notes:

- If `to` is set, cron auto-delivers the agent’s final output even if `deliver` is omitted.
- Use `deliver: true` when you want last-route delivery without an explicit `to`.
- Use `deliver: false` to keep output internal even if a `to` is present.

Target format reminders:

- Slack/Discord/Mattermost (plugin) targets should use explicit prefixes (e.g. `channel:<id>`, `user:<id>`) to avoid ambiguity.
- Telegram topics should use the `:topic:` form (see below).

#### [​](https://docs.molt.bot/automation/cron-jobs\#telegram-delivery-targets-topics-/-forum-threads)  Telegram delivery targets (topics / forum threads)

Telegram supports forum topics via `message_thread_id`. For cron delivery, you can encode
the topic/thread into the `to` field:

- `-1001234567890` (chat id only)
- `-1001234567890:topic:123` (preferred: explicit topic marker)
- `-1001234567890:123` (shorthand: numeric suffix)

Prefixed targets like `telegram:...` / `telegram:group:...` are also accepted:

- `telegram:group:-1001234567890:topic:123`

## [​](https://docs.molt.bot/automation/cron-jobs\#storage-&-history)  Storage & history

- Job store: `~/.clawdbot/cron/jobs.json` (Gateway-managed JSON).
- Run history: `~/.clawdbot/cron/runs/<jobId>.jsonl` (JSONL, auto-pruned).
- Override store path: `cron.store` in config.

## [​](https://docs.molt.bot/automation/cron-jobs\#configuration)  Configuration

Copy

```
{
  cron: {
    enabled: true, // default true
    store: "~/.clawdbot/cron/jobs.json",
    maxConcurrentRuns: 1 // default 1
  }
}
```

Disable cron entirely:

- `cron.enabled: false` (config)
- `CLAWDBOT_SKIP_CRON=1` (env)

## [​](https://docs.molt.bot/automation/cron-jobs\#cli-quickstart)  CLI quickstart

One-shot reminder (UTC ISO, auto-delete after success):

Copy

```
moltbot cron add \
  --name "Send reminder" \
  --at "2026-01-12T18:00:00Z" \
  --session main \
  --system-event "Reminder: submit expense report." \
  --wake now \
  --delete-after-run
```

One-shot reminder (main session, wake immediately):

Copy

```
moltbot cron add \
  --name "Calendar check" \
  --at "20m" \
  --session main \
  --system-event "Next heartbeat: check calendar." \
  --wake now
```

Recurring isolated job (deliver to WhatsApp):

Copy

```
moltbot cron add \
  --name "Morning status" \
  --cron "0 7 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Summarize inbox + calendar for today." \
  --deliver \
  --channel whatsapp \
  --to "+15551234567"
```

Recurring isolated job (deliver to a Telegram topic):

Copy

```
moltbot cron add \
  --name "Nightly summary (topic)" \
  --cron "0 22 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Summarize today; send to the nightly topic." \
  --deliver \
  --channel telegram \
  --to "-1001234567890:topic:123"
```

Isolated job with model and thinking override:

Copy

````
moltbot cron add \
  --name "Deep analysis" \
  --cron "0 6 * * 1" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Weekly deep analysis of project progress." \
  --model "opus" \
  --thinking high \
  --deliver \
  --channel whatsapp \
  --to "+15551234567"

Agent selection (multi-agent setups):
```bash
# Pin a job to agent "ops" (falls back to default if that agent is missing)
moltbot cron add --name "Ops sweep" --cron "0 6 * * *" --session isolated --message "Check ops queue" --agent ops

# Switch or clear the agent on an existing job
moltbot cron edit <jobId> --agent ops
moltbot cron edit <jobId> --clear-agent
````

Copy

````

Manual run (debug):
```bash
moltbot cron run <jobId> --force
````

Edit an existing job (patch fields):

Copy

```
moltbot cron edit <jobId> \
  --message "Updated prompt" \
  --model "opus" \
  --thinking low
```

Run history:

Copy

```
moltbot cron runs --id <jobId> --limit 50
```

Immediate system event without creating a job:

Copy

```
moltbot system event --mode now --text "Next heartbeat: check battery."
```

## [​](https://docs.molt.bot/automation/cron-jobs\#gateway-api-surface)  Gateway API surface

- `cron.list`, `cron.status`, `cron.add`, `cron.update`, `cron.remove`
- `cron.run` (force or due), `cron.runs`
For immediate system events without a job, use [`moltbot system event`](https://docs.molt.bot/cli/system).

## [​](https://docs.molt.bot/automation/cron-jobs\#troubleshooting)  Troubleshooting

### [​](https://docs.molt.bot/automation/cron-jobs\#%E2%80%9Cnothing-runs%E2%80%9D)  “Nothing runs”

- Check cron is enabled: `cron.enabled` and `CLAWDBOT_SKIP_CRON`.
- Check the Gateway is running continuously (cron runs inside the Gateway process).
- For `cron` schedules: confirm timezone (`--tz`) vs the host timezone.

### [​](https://docs.molt.bot/automation/cron-jobs\#telegram-delivers-to-the-wrong-place)  Telegram delivers to the wrong place

- For forum topics, use `-100…:topic:<id>` so it’s explicit and unambiguous.
- If you see `telegram:...` prefixes in logs or stored “last route” targets, that’s normal;
cron delivery accepts them and still parses topic IDs correctly.

[Gmail pubsub](https://docs.molt.bot/automation/gmail-pubsub) [Cron vs heartbeat](https://docs.molt.bot/automation/cron-vs-heartbeat)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.