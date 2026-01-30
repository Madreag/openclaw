---
source: https://docs.molt.bot/concepts/context#/context-detail
title: Context - Moltbot
---

[Skip to main content](https://docs.molt.bot/concepts/context#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Context](https://docs.molt.bot/concepts/context#context)
- [Quick start (inspect context)](https://docs.molt.bot/concepts/context#quick-start-inspect-context)
- [Example output](https://docs.molt.bot/concepts/context#example-output)
- [/context list](https://docs.molt.bot/concepts/context#%2Fcontext-list)
- [/context detail](https://docs.molt.bot/concepts/context#%2Fcontext-detail)
- [What counts toward the context window](https://docs.molt.bot/concepts/context#what-counts-toward-the-context-window)
- [How Moltbot builds the system prompt](https://docs.molt.bot/concepts/context#how-moltbot-builds-the-system-prompt)
- [Injected workspace files (Project Context)](https://docs.molt.bot/concepts/context#injected-workspace-files-project-context)
- [Skills: what’s injected vs loaded on-demand](https://docs.molt.bot/concepts/context#skills%3A-what%E2%80%99s-injected-vs-loaded-on-demand)
- [Tools: there are two costs](https://docs.molt.bot/concepts/context#tools%3A-there-are-two-costs)
- [Commands, directives, and “inline shortcuts”](https://docs.molt.bot/concepts/context#commands%2C-directives%2C-and-%E2%80%9Cinline-shortcuts%E2%80%9D)
- [Sessions, compaction, and pruning (what persists)](https://docs.molt.bot/concepts/context#sessions%2C-compaction%2C-and-pruning-what-persists)
- [What /context actually reports](https://docs.molt.bot/concepts/context#what-%2Fcontext-actually-reports)

# [​](https://docs.molt.bot/concepts/context\#context)  Context

“Context” is **everything Moltbot sends to the model for a run**. It is bounded by the model’s **context window** (token limit).Beginner mental model:

- **System prompt** (Moltbot-built): rules, tools, skills list, time/runtime, and injected workspace files.
- **Conversation history**: your messages + the assistant’s messages for this session.
- **Tool calls/results + attachments**: command output, file reads, images/audio, etc.

Context is _not the same thing_ as “memory”: memory can be stored on disk and reloaded later; context is what’s inside the model’s current window.

## [​](https://docs.molt.bot/concepts/context\#quick-start-inspect-context)  Quick start (inspect context)

- `/status` → quick “how full is my window?” view + session settings.
- `/context list` → what’s injected + rough sizes (per file + totals).
- `/context detail` → deeper breakdown: per-file, per-tool schema sizes, per-skill entry sizes, and system prompt size.
- `/usage tokens` → append per-reply usage footer to normal replies.
- `/compact` → summarize older history into a compact entry to free window space.

See also: [Slash commands](https://docs.molt.bot/tools/slash-commands), [Token use & costs](https://docs.molt.bot/token-use), [Compaction](https://docs.molt.bot/concepts/compaction).

## [​](https://docs.molt.bot/concepts/context\#example-output)  Example output

Values vary by model, provider, tool policy, and what’s in your workspace.

### [​](https://docs.molt.bot/concepts/context\#/context-list)  `/context list`

Copy

```
🧠 Context breakdown
Workspace: <workspaceDir>
Bootstrap max/file: 20,000 chars
Sandbox: mode=non-main sandboxed=false
System prompt (run): 38,412 chars (~9,603 tok) (Project Context 23,901 chars (~5,976 tok))

Injected workspace files:
- AGENTS.md: OK | raw 1,742 chars (~436 tok) | injected 1,742 chars (~436 tok)
- SOUL.md: OK | raw 912 chars (~228 tok) | injected 912 chars (~228 tok)
- TOOLS.md: TRUNCATED | raw 54,210 chars (~13,553 tok) | injected 20,962 chars (~5,241 tok)
- IDENTITY.md: OK | raw 211 chars (~53 tok) | injected 211 chars (~53 tok)
- USER.md: OK | raw 388 chars (~97 tok) | injected 388 chars (~97 tok)
- HEARTBEAT.md: MISSING | raw 0 | injected 0
- BOOTSTRAP.md: OK | raw 0 chars (~0 tok) | injected 0 chars (~0 tok)

Skills list (system prompt text): 2,184 chars (~546 tok) (12 skills)
Tools: read, edit, write, exec, process, browser, message, sessions_send, …
Tool list (system prompt text): 1,032 chars (~258 tok)
Tool schemas (JSON): 31,988 chars (~7,997 tok) (counts toward context; not shown as text)
Tools: (same as above)

Session tokens (cached): 14,250 total / ctx=32,000
```

### [​](https://docs.molt.bot/concepts/context\#/context-detail)  `/context detail`

Copy

```
🧠 Context breakdown (detailed)
…
Top skills (prompt entry size):
- frontend-design: 412 chars (~103 tok)
- oracle: 401 chars (~101 tok)
… (+10 more skills)

Top tools (schema size):
- browser: 9,812 chars (~2,453 tok)
- exec: 6,240 chars (~1,560 tok)
… (+N more tools)
```

## [​](https://docs.molt.bot/concepts/context\#what-counts-toward-the-context-window)  What counts toward the context window

Everything the model receives counts, including:

- System prompt (all sections).
- Conversation history.
- Tool calls + tool results.
- Attachments/transcripts (images/audio/files).
- Compaction summaries and pruning artifacts.
- Provider “wrappers” or hidden headers (not visible, still counted).

## [​](https://docs.molt.bot/concepts/context\#how-moltbot-builds-the-system-prompt)  How Moltbot builds the system prompt

The system prompt is **Moltbot-owned** and rebuilt each run. It includes:

- Tool list + short descriptions.
- Skills list (metadata only; see below).
- Workspace location.
- Time (UTC + converted user time if configured).
- Runtime metadata (host/OS/model/thinking).
- Injected workspace bootstrap files under **Project Context**.

Full breakdown: [System Prompt](https://docs.molt.bot/concepts/system-prompt).

## [​](https://docs.molt.bot/concepts/context\#injected-workspace-files-project-context)  Injected workspace files (Project Context)

By default, Moltbot injects a fixed set of workspace files (if present):

- `AGENTS.md`
- `SOUL.md`
- `TOOLS.md`
- `IDENTITY.md`
- `USER.md`
- `HEARTBEAT.md`
- `BOOTSTRAP.md` (first-run only)

Large files are truncated per-file using `agents.defaults.bootstrapMaxChars` (default `20000` chars). `/context` shows **raw vs injected** sizes and whether truncation happened.

## [​](https://docs.molt.bot/concepts/context\#skills:-what%E2%80%99s-injected-vs-loaded-on-demand)  Skills: what’s injected vs loaded on-demand

The system prompt includes a compact **skills list** (name + description + location). This list has real overhead.Skill instructions are _not_ included by default. The model is expected to `read` the skill’s `SKILL.md` **only when needed**.

## [​](https://docs.molt.bot/concepts/context\#tools:-there-are-two-costs)  Tools: there are two costs

Tools affect context in two ways:

1. **Tool list text** in the system prompt (what you see as “Tooling”).
2. **Tool schemas** (JSON). These are sent to the model so it can call tools. They count toward context even though you don’t see them as plain text.

`/context detail` breaks down the biggest tool schemas so you can see what dominates.

## [​](https://docs.molt.bot/concepts/context\#commands,-directives,-and-%E2%80%9Cinline-shortcuts%E2%80%9D)  Commands, directives, and “inline shortcuts”

Slash commands are handled by the Gateway. There are a few different behaviors:

- **Standalone commands**: a message that is only `/...` runs as a command.
- **Directives**: `/think`, `/verbose`, `/reasoning`, `/elevated`, `/model`, `/queue` are stripped before the model sees the message.

  - Directive-only messages persist session settings.
  - Inline directives in a normal message act as per-message hints.
- **Inline shortcuts** (allowlisted senders only): certain `/...` tokens inside a normal message can run immediately (example: “hey /status”), and are stripped before the model sees the remaining text.

Details: [Slash commands](https://docs.molt.bot/tools/slash-commands).

## [​](https://docs.molt.bot/concepts/context\#sessions,-compaction,-and-pruning-what-persists)  Sessions, compaction, and pruning (what persists)

What persists across messages depends on the mechanism:

- **Normal history** persists in the session transcript until compacted/pruned by policy.
- **Compaction** persists a summary into the transcript and keeps recent messages intact.
- **Pruning** removes old tool results from the _in-memory_ prompt for a run, but does not rewrite the transcript.

Docs: [Session](https://docs.molt.bot/concepts/session), [Compaction](https://docs.molt.bot/concepts/compaction), [Session pruning](https://docs.molt.bot/concepts/session-pruning).

## [​](https://docs.molt.bot/concepts/context\#what-/context-actually-reports)  What `/context` actually reports

`/context` prefers the latest **run-built** system prompt report when available:

- `System prompt (run)` = captured from the last embedded (tool-capable) run and persisted in the session store.
- `System prompt (estimate)` = computed on the fly when no run report exists (or when running via a CLI backend that doesn’t generate the report).

Either way, it reports sizes and top contributors; it does **not** dump the full system prompt or tool schemas.

[System prompt](https://docs.molt.bot/concepts/system-prompt) [Token use](https://docs.molt.bot/token-use)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.