---
source: https://docs.molt.bot/concepts/typing-indicators
title: Typing indicators - Moltbot
---

[Skip to main content](https://docs.molt.bot/concepts/typing-indicators#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Typing indicators](https://docs.molt.bot/concepts/typing-indicators#typing-indicators)
- [Defaults](https://docs.molt.bot/concepts/typing-indicators#defaults)
- [Modes](https://docs.molt.bot/concepts/typing-indicators#modes)
- [Configuration](https://docs.molt.bot/concepts/typing-indicators#configuration)
- [Notes](https://docs.molt.bot/concepts/typing-indicators#notes)

# [​](https://docs.molt.bot/concepts/typing-indicators\#typing-indicators)  Typing indicators

Typing indicators are sent to the chat channel while a run is active. Use
`agents.defaults.typingMode` to control **when** typing starts and `typingIntervalSeconds`
to control **how often** it refreshes.

## [​](https://docs.molt.bot/concepts/typing-indicators\#defaults)  Defaults

When `agents.defaults.typingMode` is **unset**, Moltbot keeps the legacy behavior:

- **Direct chats**: typing starts immediately once the model loop begins.
- **Group chats with a mention**: typing starts immediately.
- **Group chats without a mention**: typing starts only when message text begins streaming.
- **Heartbeat runs**: typing is disabled.

## [​](https://docs.molt.bot/concepts/typing-indicators\#modes)  Modes

Set `agents.defaults.typingMode` to one of:

- `never` — no typing indicator, ever.
- `instant` — start typing **as soon as the model loop begins**, even if the run
later returns only the silent reply token.
- `thinking` — start typing on the **first reasoning delta** (requires
`reasoningLevel: "stream"` for the run).
- `message` — start typing on the **first non-silent text delta** (ignores
the `NO_REPLY` silent token).

Order of “how early it fires”:
`never` → `message` → `thinking` → `instant`

## [​](https://docs.molt.bot/concepts/typing-indicators\#configuration)  Configuration

Copy

```
{
  agent: {
    typingMode: "thinking",
    typingIntervalSeconds: 6
  }
}
```

You can override mode or cadence per session:

Copy

```
{
  session: {
    typingMode: "message",
    typingIntervalSeconds: 4
  }
}
```

## [​](https://docs.molt.bot/concepts/typing-indicators\#notes)  Notes

- `message` mode won’t show typing for silent-only replies (e.g. the `NO_REPLY`
token used to suppress output).
- `thinking` only fires if the run streams reasoning (`reasoningLevel: "stream"`).
If the model doesn’t emit reasoning deltas, typing won’t start.
- Heartbeats never show typing, regardless of mode.
- `typingIntervalSeconds` controls the **refresh cadence**, not the start time.
The default is 6 seconds.

[Group messages](https://docs.molt.bot/concepts/group-messages) [Queue](https://docs.molt.bot/concepts/queue)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.