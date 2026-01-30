---
source: https://docs.molt.bot/index
title: Index - Moltbot
---

[Skip to main content](https://docs.molt.bot/index#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Moltbot 🦞](https://docs.molt.bot/index#moltbot-%F0%9F%A6%9E)
- [Start here](https://docs.molt.bot/index#start-here)
- [Dashboard (browser Control UI)](https://docs.molt.bot/index#dashboard-browser-control-ui)
- [How it works](https://docs.molt.bot/index#how-it-works)
- [Network model](https://docs.molt.bot/index#network-model)
- [Features (high level)](https://docs.molt.bot/index#features-high-level)
- [Quick start](https://docs.molt.bot/index#quick-start)
- [Configuration (optional)](https://docs.molt.bot/index#configuration-optional)
- [Docs](https://docs.molt.bot/index#docs)
- [The name](https://docs.molt.bot/index#the-name)
- [Credits](https://docs.molt.bot/index#credits)
- [Core Contributors](https://docs.molt.bot/index#core-contributors)
- [License](https://docs.molt.bot/index#license)

# [​](https://docs.molt.bot/index\#moltbot-%F0%9F%A6%9E)  Moltbot 🦞

> _“EXFOLIATE! EXFOLIATE!”_ — A space lobster, probably

![Moltbot](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/whatsapp-clawd.jpg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=e7eabb1f3c0de346273c608fa218698b)

**Any OS + WhatsApp/Telegram/Discord/iMessage gateway for AI agents (Pi).**

Plugins add Mattermost and more.
Send a message, get an agent response — from your pocket.

[GitHub](https://github.com/moltbot/moltbot) ·
[Releases](https://github.com/moltbot/moltbot/releases) ·
[Docs](https://docs.molt.bot/) ·
[Moltbot assistant setup](https://docs.molt.bot/start/clawd)

Moltbot bridges WhatsApp (via WhatsApp Web / Baileys), Telegram (Bot API / grammY), Discord (Bot API / channels.discord.js), and iMessage (imsg CLI) to coding agents like [Pi](https://github.com/badlogic/pi-mono). Plugins add Mattermost (Bot API + WebSocket) and more.
Moltbot also powers [Clawd](https://clawd.me/), the space‑lobster assistant.

## [​](https://docs.molt.bot/index\#start-here)  Start here

- **New install from zero:** [Getting Started](https://docs.molt.bot/start/getting-started)
- **Guided setup (recommended):** [Wizard](https://docs.molt.bot/start/wizard) (`moltbot onboard`)
- **Open the dashboard (local Gateway):** [http://127.0.0.1:18789/](http://127.0.0.1:18789/) (or [http://localhost:18789/](http://localhost:18789/))

If the Gateway is running on the same computer, that link opens the browser Control UI
immediately. If it fails, start the Gateway first: `moltbot gateway`.

## [​](https://docs.molt.bot/index\#dashboard-browser-control-ui)  Dashboard (browser Control UI)

The dashboard is the browser Control UI for chat, config, nodes, sessions, and more.
Local default: [http://127.0.0.1:18789/](http://127.0.0.1:18789/)
Remote access: [Web surfaces](https://docs.molt.bot/web) and [Tailscale](https://docs.molt.bot/gateway/tailscale)

## [​](https://docs.molt.bot/index\#how-it-works)  How it works

Copy

```
WhatsApp / Telegram / Discord / iMessage (+ plugins)
        │
        ▼
  ┌───────────────────────────┐
  │          Gateway          │  ws://127.0.0.1:18789 (loopback-only)
  │     (single source)       │
  │                           │  http://<gateway-host>:18793
  │                           │    /__moltbot__/canvas/ (Canvas host)
  └───────────┬───────────────┘
              │
              ├─ Pi agent (RPC)
              ├─ CLI (moltbot …)
              ├─ Chat UI (SwiftUI)
              ├─ macOS app (Moltbot.app)
              ├─ iOS node via Gateway WS + pairing
              └─ Android node via Gateway WS + pairing
```

Most operations flow through the **Gateway** (`moltbot gateway`), a single long-running process that owns channel connections and the WebSocket control plane.

## [​](https://docs.molt.bot/index\#network-model)  Network model

- **One Gateway per host (recommended)**: it is the only process allowed to own the WhatsApp Web session. If you need a rescue bot or strict isolation, run multiple gateways with isolated profiles and ports; see [Multiple gateways](https://docs.molt.bot/gateway/multiple-gateways).
- **Loopback-first**: Gateway WS defaults to `ws://127.0.0.1:18789`.

  - The wizard now generates a gateway token by default (even for loopback).
  - For Tailnet access, run `moltbot gateway --bind tailnet --token ...` (token is required for non-loopback binds).
- **Nodes**: connect to the Gateway WebSocket (LAN/tailnet/SSH as needed); legacy TCP bridge is deprecated/removed.
- **Canvas host**: HTTP file server on `canvasHost.port` (default `18793`), serving `/__moltbot__/canvas/` for node WebViews; see [Gateway configuration](https://docs.molt.bot/gateway/configuration) (`canvasHost`).
- **Remote use**: SSH tunnel or tailnet/VPN; see [Remote access](https://docs.molt.bot/gateway/remote) and [Discovery](https://docs.molt.bot/gateway/discovery).

## [​](https://docs.molt.bot/index\#features-high-level)  Features (high level)

- 📱 **WhatsApp Integration** — Uses Baileys for WhatsApp Web protocol
- ✈️ **Telegram Bot** — DMs + groups via grammY
- 🎮 **Discord Bot** — DMs + guild channels via channels.discord.js
- 🧩 **Mattermost Bot (plugin)** — Bot token + WebSocket events
- 💬 **iMessage** — Local imsg CLI integration (macOS)
- 🤖 **Agent bridge** — Pi (RPC mode) with tool streaming
- ⏱️ **Streaming + chunking** — Block streaming + Telegram draft streaming details ( [/concepts/streaming](https://docs.molt.bot/concepts/streaming))
- 🧠 **Multi-agent routing** — Route provider accounts/peers to isolated agents (workspace + per-agent sessions)
- 🔐 **Subscription auth** — Anthropic (Claude Pro/Max) + OpenAI (ChatGPT/Codex) via OAuth
- 💬 **Sessions** — Direct chats collapse into shared `main` (default); groups are isolated
- 👥 **Group Chat Support** — Mention-based by default; owner can toggle `/activation always|mention`
- 📎 **Media Support** — Send and receive images, audio, documents
- 🎤 **Voice notes** — Optional transcription hook
- 🖥️ **WebChat + macOS app** — Local UI + menu bar companion for ops and voice wake
- 📱 **iOS node** — Pairs as a node and exposes a Canvas surface
- 📱 **Android node** — Pairs as a node and exposes Canvas + Chat + Camera

Note: legacy Claude/Codex/Gemini/Opencode paths have been removed; Pi is the only coding-agent path.

## [​](https://docs.molt.bot/index\#quick-start)  Quick start

Runtime requirement: **Node ≥ 22**.

Copy

```
# Recommended: global install (npm/pnpm)
npm install -g moltbot@latest
# or: pnpm add -g moltbot@latest

# Onboard + install the service (launchd/systemd user service)
moltbot onboard --install-daemon

# Pair WhatsApp Web (shows QR)
moltbot channels login

# Gateway runs via the service after onboarding; manual run is still possible:
moltbot gateway --port 18789
```

Switching between npm and git installs later is easy: install the other flavor and run `moltbot doctor` to update the gateway service entrypoint.From source (development):

Copy

```
git clone https://github.com/moltbot/moltbot.git
cd moltbot
pnpm install
pnpm ui:build # auto-installs UI deps on first run
pnpm build
moltbot onboard --install-daemon
```

If you don’t have a global install yet, run the onboarding step via `pnpm moltbot ...` from the repo.Multi-instance quickstart (optional):

Copy

```
CLAWDBOT_CONFIG_PATH=~/.clawdbot/a.json \
CLAWDBOT_STATE_DIR=~/.clawdbot-a \
moltbot gateway --port 19001
```

Send a test message (requires a running Gateway):

Copy

```
moltbot message send --target +15555550123 --message "Hello from Moltbot"
```

## [​](https://docs.molt.bot/index\#configuration-optional)  Configuration (optional)

Config lives at `~/.clawdbot/moltbot.json`.

- If you **do nothing**, Moltbot uses the bundled Pi binary in RPC mode with per-sender sessions.
- If you want to lock it down, start with `channels.whatsapp.allowFrom` and (for groups) mention rules.

Example:

Copy

```
{
  channels: {
    whatsapp: {
      allowFrom: ["+15555550123"],
      groups: { "*": { requireMention: true } }
    }
  },
  messages: { groupChat: { mentionPatterns: ["@clawd"] } }
}
```

## [​](https://docs.molt.bot/index\#docs)  Docs

- Start here:
  - [Docs hubs (all pages linked)](https://docs.molt.bot/start/hubs)
  - [Help](https://docs.molt.bot/help) ← _common fixes + troubleshooting_
  - [Configuration](https://docs.molt.bot/gateway/configuration)
  - [Configuration examples](https://docs.molt.bot/gateway/configuration-examples)
  - [Slash commands](https://docs.molt.bot/tools/slash-commands)
  - [Multi-agent routing](https://docs.molt.bot/concepts/multi-agent)
  - [Updating / rollback](https://docs.molt.bot/install/updating)
  - [Pairing (DM + nodes)](https://docs.molt.bot/start/pairing)
  - [Nix mode](https://docs.molt.bot/install/nix)
  - [Moltbot assistant setup (Clawd)](https://docs.molt.bot/start/clawd)
  - [Skills](https://docs.molt.bot/tools/skills)
  - [Skills config](https://docs.molt.bot/tools/skills-config)
  - [Workspace templates](https://docs.molt.bot/reference/templates/AGENTS)
  - [RPC adapters](https://docs.molt.bot/reference/rpc)
  - [Gateway runbook](https://docs.molt.bot/gateway)
  - [Nodes (iOS/Android)](https://docs.molt.bot/nodes)
  - [Web surfaces (Control UI)](https://docs.molt.bot/web)
  - [Discovery + transports](https://docs.molt.bot/gateway/discovery)
  - [Remote access](https://docs.molt.bot/gateway/remote)
- Providers and UX:
  - [WebChat](https://docs.molt.bot/web/webchat)
  - [Control UI (browser)](https://docs.molt.bot/web/control-ui)
  - [Telegram](https://docs.molt.bot/channels/telegram)
  - [Discord](https://docs.molt.bot/channels/discord)
  - [Mattermost (plugin)](https://docs.molt.bot/channels/mattermost)
  - [iMessage](https://docs.molt.bot/channels/imessage)
  - [Groups](https://docs.molt.bot/concepts/groups)
  - [WhatsApp group messages](https://docs.molt.bot/concepts/group-messages)
  - [Media: images](https://docs.molt.bot/nodes/images)
  - [Media: audio](https://docs.molt.bot/nodes/audio)
- Companion apps:
  - [macOS app](https://docs.molt.bot/platforms/macos)
  - [iOS app](https://docs.molt.bot/platforms/ios)
  - [Android app](https://docs.molt.bot/platforms/android)
  - [Windows (WSL2)](https://docs.molt.bot/platforms/windows)
  - [Linux app](https://docs.molt.bot/platforms/linux)
- Ops and safety:
  - [Sessions](https://docs.molt.bot/concepts/session)
  - [Cron jobs](https://docs.molt.bot/automation/cron-jobs)
  - [Webhooks](https://docs.molt.bot/automation/webhook)
  - [Gmail hooks (Pub/Sub)](https://docs.molt.bot/automation/gmail-pubsub)
  - [Security](https://docs.molt.bot/gateway/security)
  - [Troubleshooting](https://docs.molt.bot/gateway/troubleshooting)

## [​](https://docs.molt.bot/index\#the-name)  The name

**Moltbot = CLAW + TARDIS** — because every space lobster needs a time-and-space machine.

* * *

_“We’re all just playing with our own prompts.”_ — an AI, probably high on tokens

## [​](https://docs.molt.bot/index\#credits)  Credits

- **Peter Steinberger** ( [@steipete](https://twitter.com/steipete)) — Creator, lobster whisperer
- **Mario Zechner** ( [@badlogicc](https://twitter.com/badlogicgames)) — Pi creator, security pen-tester
- **Clawd** — The space lobster who demanded a better name

## [​](https://docs.molt.bot/index\#core-contributors)  Core Contributors

- **Maxim Vovshin** (@Hyaxia, [36747317+Hyaxia@users.noreply.github.com](mailto:36747317+Hyaxia@users.noreply.github.com)) — Blogwatcher skill
- **Nacho Iacovino** (@nachoiacovino, [nacho.iacovino@gmail.com](mailto:nacho.iacovino@gmail.com)) — Location parsing (Telegram + WhatsApp)

## [​](https://docs.molt.bot/index\#license)  License

MIT — Free as a lobster in the ocean 🦞

* * *

_“We’re all just playing with our own prompts.”_ — An AI, probably high on tokens

[Getting started](https://docs.molt.bot/start/getting-started)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.

![Moltbot](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/whatsapp-clawd.jpg?w=1100&fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=95f2363cb9375bd4b0d0248ec2efb585)