---
source: https://docs.molt.bot/start/getting-started
title: Getting started - Moltbot
---

[Skip to main content](https://docs.molt.bot/start/getting-started#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Getting Started](https://docs.molt.bot/start/getting-started#getting-started)
- [0) Prereqs](https://docs.molt.bot/start/getting-started#0-prereqs)
- [1) Install the CLI (recommended)](https://docs.molt.bot/start/getting-started#1-install-the-cli-recommended)
- [2) Run the onboarding wizard (and install the service)](https://docs.molt.bot/start/getting-started#2-run-the-onboarding-wizard-and-install-the-service)
- [Auth: where it lives (important)](https://docs.molt.bot/start/getting-started#auth%3A-where-it-lives-important)
- [3) Start the Gateway](https://docs.molt.bot/start/getting-started#3-start-the-gateway)
- [3.5) Quick verify (2 min)](https://docs.molt.bot/start/getting-started#3-5-quick-verify-2-min)
- [4) Pair + connect your first chat surface](https://docs.molt.bot/start/getting-started#4-pair-%2B-connect-your-first-chat-surface)
- [WhatsApp (QR login)](https://docs.molt.bot/start/getting-started#whatsapp-qr-login)
- [Telegram / Discord / others](https://docs.molt.bot/start/getting-started#telegram-%2F-discord-%2F-others)
- [5) DM safety (pairing approvals)](https://docs.molt.bot/start/getting-started#5-dm-safety-pairing-approvals)
- [From source (development)](https://docs.molt.bot/start/getting-started#from-source-development)
- [7) Verify end-to-end](https://docs.molt.bot/start/getting-started#7-verify-end-to-end)
- [Next steps (optional, but great)](https://docs.molt.bot/start/getting-started#next-steps-optional%2C-but-great)

# [​](https://docs.molt.bot/start/getting-started\#getting-started)  Getting Started

Goal: go from **zero** → **first working chat** (with sane defaults) as quickly as possible.Fastest chat: open the Control UI (no channel setup needed). Run `moltbot dashboard`
and chat in the browser, or open `http://127.0.0.1:18789/` on the gateway host.
Docs: [Dashboard](https://docs.molt.bot/web/dashboard) and [Control UI](https://docs.molt.bot/web/control-ui).Recommended path: use the **CLI onboarding wizard** (`moltbot onboard`). It sets up:

- model/auth (OAuth recommended)
- gateway settings
- channels (WhatsApp/Telegram/Discord/Mattermost (plugin)/…)
- pairing defaults (secure DMs)
- workspace bootstrap + skills
- optional background service

If you want the deeper reference pages, jump to: [Wizard](https://docs.molt.bot/start/wizard), [Setup](https://docs.molt.bot/start/setup), [Pairing](https://docs.molt.bot/start/pairing), [Security](https://docs.molt.bot/gateway/security).Sandboxing note: `agents.defaults.sandbox.mode: "non-main"` uses `session.mainKey` (default `"main"`),
so group/channel sessions are sandboxed. If you want the main agent to always
run on host, set an explicit per-agent override:

Copy

```
{
  "routing": {
    "agents": {
      "main": {
        "workspace": "~/clawd",
        "sandbox": { "mode": "off" }
      }
    }
  }
}
```

## [​](https://docs.molt.bot/start/getting-started\#0-prereqs)  0) Prereqs

- Node `>=22`
- `pnpm` (optional; recommended if you build from source)
- **Recommended:** Brave Search API key for web search. Easiest path:
`moltbot configure --section web` (stores `tools.web.search.apiKey`).
See [Web tools](https://docs.molt.bot/tools/web).

macOS: if you plan to build the apps, install Xcode / CLT. For the CLI + gateway only, Node is enough.
Windows: use **WSL2** (Ubuntu recommended). WSL2 is strongly recommended; native Windows is untested, more problematic, and has poorer tool compatibility. Install WSL2 first, then run the Linux steps inside WSL. See [Windows (WSL2)](https://docs.molt.bot/platforms/windows).

## [​](https://docs.molt.bot/start/getting-started\#1-install-the-cli-recommended)  1) Install the CLI (recommended)

Copy

```
curl -fsSL https://molt.bot/install.sh | bash
```

Installer options (install method, non-interactive, from GitHub): [Install](https://docs.molt.bot/install).Windows (PowerShell):

Copy

```
iwr -useb https://molt.bot/install.ps1 | iex
```

Alternative (global install):

Copy

```
npm install -g moltbot@latest
```

Copy

```
pnpm add -g moltbot@latest
```

## [​](https://docs.molt.bot/start/getting-started\#2-run-the-onboarding-wizard-and-install-the-service)  2) Run the onboarding wizard (and install the service)

Copy

```
moltbot onboard --install-daemon
```

What you’ll choose:

- **Local vs Remote** gateway
- **Auth**: OpenAI Code (Codex) subscription (OAuth) or API keys. For Anthropic we recommend an API key; `claude setup-token` is also supported.
- **Providers**: WhatsApp QR login, Telegram/Discord bot tokens, Mattermost plugin tokens, etc.
- **Daemon**: background install (launchd/systemd; WSL2 uses systemd)

  - **Runtime**: Node (recommended; required for WhatsApp/Telegram). Bun is **not recommended**.
- **Gateway token**: the wizard generates one by default (even on loopback) and stores it in `gateway.auth.token`.

Wizard doc: [Wizard](https://docs.molt.bot/start/wizard)

### [​](https://docs.molt.bot/start/getting-started\#auth:-where-it-lives-important)  Auth: where it lives (important)

- **Recommended Anthropic path:** set an API key (wizard can store it for service use). `claude setup-token` is also supported if you want to reuse Claude Code credentials.
- OAuth credentials (legacy import): `~/.clawdbot/credentials/oauth.json`
- Auth profiles (OAuth + API keys): `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`

Headless/server tip: do OAuth on a normal machine first, then copy `oauth.json` to the gateway host.

## [​](https://docs.molt.bot/start/getting-started\#3-start-the-gateway)  3) Start the Gateway

If you installed the service during onboarding, the Gateway should already be running:

Copy

```
moltbot gateway status
```

Manual run (foreground):

Copy

```
moltbot gateway --port 18789 --verbose
```

Dashboard (local loopback): `http://127.0.0.1:18789/`
If a token is configured, paste it into the Control UI settings (stored as `connect.params.auth.token`).⚠️ **Bun warning (WhatsApp + Telegram):** Bun has known issues with these
channels. If you use WhatsApp or Telegram, run the Gateway with **Node**.

## [​](https://docs.molt.bot/start/getting-started\#3-5-quick-verify-2-min)  3.5) Quick verify (2 min)

Copy

```
moltbot status
moltbot health
moltbot security audit --deep
```

## [​](https://docs.molt.bot/start/getting-started\#4-pair-+-connect-your-first-chat-surface)  4) Pair + connect your first chat surface

### [​](https://docs.molt.bot/start/getting-started\#whatsapp-qr-login)  WhatsApp (QR login)

Copy

```
moltbot channels login
```

Scan via WhatsApp → Settings → Linked Devices.WhatsApp doc: [WhatsApp](https://docs.molt.bot/channels/whatsapp)

### [​](https://docs.molt.bot/start/getting-started\#telegram-/-discord-/-others)  Telegram / Discord / others

The wizard can write tokens/config for you. If you prefer manual config, start with:

- Telegram: [Telegram](https://docs.molt.bot/channels/telegram)
- Discord: [Discord](https://docs.molt.bot/channels/discord)
- Mattermost (plugin): [Mattermost](https://docs.molt.bot/channels/mattermost)

**Telegram DM tip:** your first DM returns a pairing code. Approve it (see next step) or the bot won’t respond.

## [​](https://docs.molt.bot/start/getting-started\#5-dm-safety-pairing-approvals)  5) DM safety (pairing approvals)

Default posture: unknown DMs get a short code and messages are not processed until approved.
If your first DM gets no reply, approve the pairing:

Copy

```
moltbot pairing list whatsapp
moltbot pairing approve whatsapp <code>
```

Pairing doc: [Pairing](https://docs.molt.bot/start/pairing)

## [​](https://docs.molt.bot/start/getting-started\#from-source-development)  From source (development)

If you’re hacking on Moltbot itself, run from source:

Copy

```
git clone https://github.com/moltbot/moltbot.git
cd moltbot
pnpm install
pnpm ui:build # auto-installs UI deps on first run
pnpm build
moltbot onboard --install-daemon
```

If you don’t have a global install yet, run the onboarding step via `pnpm moltbot ...` from the repo.
`pnpm build` also bundles A2UI assets; if you need to run just that step, use `pnpm canvas:a2ui:bundle`.Gateway (from this repo):

Copy

```
node moltbot.mjs gateway --port 18789 --verbose
```

## [​](https://docs.molt.bot/start/getting-started\#7-verify-end-to-end)  7) Verify end-to-end

In a new terminal, send a test message:

Copy

```
moltbot message send --target +15555550123 --message "Hello from Moltbot"
```

If `moltbot health` shows “no auth configured”, go back to the wizard and set OAuth/key auth — the agent won’t be able to respond without it.Tip: `moltbot status --all` is the best pasteable, read-only debug report.
Health probes: `moltbot health` (or `moltbot status --deep`) asks the running gateway for a health snapshot.

## [​](https://docs.molt.bot/start/getting-started\#next-steps-optional,-but-great)  Next steps (optional, but great)

- macOS menu bar app + voice wake: [macOS app](https://docs.molt.bot/platforms/macos)
- iOS/Android nodes (Canvas/camera/voice): [Nodes](https://docs.molt.bot/nodes)
- Remote access (SSH tunnel / Tailscale Serve): [Remote access](https://docs.molt.bot/gateway/remote) and [Tailscale](https://docs.molt.bot/gateway/tailscale)
- Always-on / VPN setups: [Remote access](https://docs.molt.bot/gateway/remote), [exe.dev](https://docs.molt.bot/platforms/exe-dev), [Hetzner](https://docs.molt.bot/platforms/hetzner), [macOS remote](https://docs.molt.bot/platforms/mac/remote)

[Wizard](https://docs.molt.bot/start/wizard)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.