---
source: https://docs.molt.bot/tui
title: Tui - Moltbot
---

[Skip to main content](https://docs.molt.bot/tui#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [TUI (Terminal UI)](https://docs.molt.bot/tui#tui-terminal-ui)
- [Quick start](https://docs.molt.bot/tui#quick-start)
- [What you see](https://docs.molt.bot/tui#what-you-see)
- [Mental model: agents + sessions](https://docs.molt.bot/tui#mental-model%3A-agents-%2B-sessions)
- [Sending + delivery](https://docs.molt.bot/tui#sending-%2B-delivery)
- [Pickers + overlays](https://docs.molt.bot/tui#pickers-%2B-overlays)
- [Keyboard shortcuts](https://docs.molt.bot/tui#keyboard-shortcuts)
- [Slash commands](https://docs.molt.bot/tui#slash-commands)
- [Local shell commands](https://docs.molt.bot/tui#local-shell-commands)
- [Tool output](https://docs.molt.bot/tui#tool-output)
- [History + streaming](https://docs.molt.bot/tui#history-%2B-streaming)
- [Connection details](https://docs.molt.bot/tui#connection-details)
- [Options](https://docs.molt.bot/tui#options)
- [Troubleshooting](https://docs.molt.bot/tui#troubleshooting)
- [Troubleshooting](https://docs.molt.bot/tui#troubleshooting-2)

# [​](https://docs.molt.bot/tui\#tui-terminal-ui)  TUI (Terminal UI)

## [​](https://docs.molt.bot/tui\#quick-start)  Quick start

1. Start the Gateway.

Copy

```
moltbot gateway
```

2. Open the TUI.

Copy

```
moltbot tui
```

3. Type a message and press Enter.

Remote Gateway:

Copy

```
moltbot tui --url ws://<host>:<port> --token <gateway-token>
```

Use `--password` if your Gateway uses password auth.

## [​](https://docs.molt.bot/tui\#what-you-see)  What you see

- Header: connection URL, current agent, current session.
- Chat log: user messages, assistant replies, system notices, tool cards.
- Status line: connection/run state (connecting, running, streaming, idle, error).
- Footer: connection state + agent + session + model + think/verbose/reasoning + token counts + deliver.
- Input: text editor with autocomplete.

## [​](https://docs.molt.bot/tui\#mental-model:-agents-+-sessions)  Mental model: agents + sessions

- Agents are unique slugs (e.g. `main`, `research`). The Gateway exposes the list.
- Sessions belong to the current agent.
- Session keys are stored as `agent:<agentId>:<sessionKey>`.

  - If you type `/session main`, the TUI expands it to `agent:<currentAgent>:main`.
  - If you type `/session agent:other:main`, you switch to that agent session explicitly.
- Session scope:
  - `per-sender` (default): each agent has many sessions.
  - `global`: the TUI always uses the `global` session (the picker may be empty).
- The current agent + session are always visible in the footer.

## [​](https://docs.molt.bot/tui\#sending-+-delivery)  Sending + delivery

- Messages are sent to the Gateway; delivery to providers is off by default.
- Turn delivery on:
  - `/deliver on`
  - or the Settings panel
  - or start with `moltbot tui --deliver`

## [​](https://docs.molt.bot/tui\#pickers-+-overlays)  Pickers + overlays

- Model picker: list available models and set the session override.
- Agent picker: choose a different agent.
- Session picker: shows only sessions for the current agent.
- Settings: toggle deliver, tool output expansion, and thinking visibility.

## [​](https://docs.molt.bot/tui\#keyboard-shortcuts)  Keyboard shortcuts

- Enter: send message
- Esc: abort active run
- Ctrl+C: clear input (press twice to exit)
- Ctrl+D: exit
- Ctrl+L: model picker
- Ctrl+G: agent picker
- Ctrl+P: session picker
- Ctrl+O: toggle tool output expansion
- Ctrl+T: toggle thinking visibility (reloads history)

## [​](https://docs.molt.bot/tui\#slash-commands)  Slash commands

Core:

- `/help`
- `/status`
- `/agent <id>` (or `/agents`)
- `/session <key>` (or `/sessions`)
- `/model <provider/model>` (or `/models`)

Session controls:

- `/think <off|minimal|low|medium|high>`
- `/verbose <on|full|off>`
- `/reasoning <on|off|stream>`
- `/usage <off|tokens|full>`
- `/elevated <on|off|ask|full>` (alias: `/elev`)
- `/activation <mention|always>`
- `/deliver <on|off>`

Session lifecycle:

- `/new` or `/reset` (reset the session)
- `/abort` (abort the active run)
- `/settings`
- `/exit`

Other Gateway slash commands (for example, `/context`) are forwarded to the Gateway and shown as system output. See [Slash commands](https://docs.molt.bot/tools/slash-commands).

## [​](https://docs.molt.bot/tui\#local-shell-commands)  Local shell commands

- Prefix a line with `!` to run a local shell command on the TUI host.
- The TUI prompts once per session to allow local execution; declining keeps `!` disabled for the session.
- Commands run in a fresh, non-interactive shell in the TUI working directory (no persistent `cd`/env).
- A lone `!` is sent as a normal message; leading spaces do not trigger local exec.

## [​](https://docs.molt.bot/tui\#tool-output)  Tool output

- Tool calls show as cards with args + results.
- Ctrl+O toggles between collapsed/expanded views.
- While tools run, partial updates stream into the same card.

## [​](https://docs.molt.bot/tui\#history-+-streaming)  History + streaming

- On connect, the TUI loads the latest history (default 200 messages).
- Streaming responses update in place until finalized.
- The TUI also listens to agent tool events for richer tool cards.

## [​](https://docs.molt.bot/tui\#connection-details)  Connection details

- The TUI registers with the Gateway as `mode: "tui"`.
- Reconnects show a system message; event gaps are surfaced in the log.

## [​](https://docs.molt.bot/tui\#options)  Options

- `--url <url>`: Gateway WebSocket URL (defaults to config or `ws://127.0.0.1:<port>`)
- `--token <token>`: Gateway token (if required)
- `--password <password>`: Gateway password (if required)
- `--session <key>`: Session key (default: `main`, or `global` when scope is global)
- `--deliver`: Deliver assistant replies to the provider (default off)
- `--thinking <level>`: Override thinking level for sends
- `--timeout-ms <ms>`: Agent timeout in ms (defaults to `agents.defaults.timeoutSeconds`)

## [​](https://docs.molt.bot/tui\#troubleshooting)  Troubleshooting

No output after sending a message:

- Run `/status` in the TUI to confirm the Gateway is connected and idle/busy.
- Check the Gateway logs: `moltbot logs --follow`.
- Confirm the agent can run: `moltbot status` and `moltbot models status`.
- If you expect messages in a chat channel, enable delivery (`/deliver on` or `--deliver`).
- `--history-limit <n>`: History entries to load (default 200)

## [​](https://docs.molt.bot/tui\#troubleshooting-2)  Troubleshooting

- `disconnected`: ensure the Gateway is running and your `--url/--token/--password` are correct.
- No agents in picker: check `moltbot agents list` and your routing config.
- Empty session picker: you might be in global scope or have no sessions yet.

[Webchat](https://docs.molt.bot/web/webchat) [Channels](https://docs.molt.bot/channels)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.