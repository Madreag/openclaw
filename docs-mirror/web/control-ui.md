---
source: https://docs.molt.bot/web/control-ui
title: Control ui - Moltbot
---

[Skip to main content](https://docs.molt.bot/web/control-ui#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Control UI (browser)](https://docs.molt.bot/web/control-ui#control-ui-browser)
- [Quick open (local)](https://docs.molt.bot/web/control-ui#quick-open-local)
- [What it can do (today)](https://docs.molt.bot/web/control-ui#what-it-can-do-today)
- [Chat behavior](https://docs.molt.bot/web/control-ui#chat-behavior)
- [Tailnet access (recommended)](https://docs.molt.bot/web/control-ui#tailnet-access-recommended)
- [Integrated Tailscale Serve (preferred)](https://docs.molt.bot/web/control-ui#integrated-tailscale-serve-preferred)
- [Bind to tailnet + token](https://docs.molt.bot/web/control-ui#bind-to-tailnet-%2B-token)
- [Insecure HTTP](https://docs.molt.bot/web/control-ui#insecure-http)
- [Building the UI](https://docs.molt.bot/web/control-ui#building-the-ui)
- [Debugging/testing: dev server + remote Gateway](https://docs.molt.bot/web/control-ui#debugging%2Ftesting%3A-dev-server-%2B-remote-gateway)

# [​](https://docs.molt.bot/web/control-ui\#control-ui-browser)  Control UI (browser)

The Control UI is a small **Vite + Lit** single-page app served by the Gateway:

- default: `http://<host>:18789/`
- optional prefix: set `gateway.controlUi.basePath` (e.g. `/moltbot`)

It speaks **directly to the Gateway WebSocket** on the same port.

## [​](https://docs.molt.bot/web/control-ui\#quick-open-local)  Quick open (local)

If the Gateway is running on the same computer, open:

- [http://127.0.0.1:18789/](http://127.0.0.1:18789/) (or [http://localhost:18789/](http://localhost:18789/))

If the page fails to load, start the Gateway first: `moltbot gateway`.Auth is supplied during the WebSocket handshake via:

- `connect.params.auth.token`
- `connect.params.auth.password`
The dashboard settings panel lets you store a token; passwords are not persisted.
The onboarding wizard generates a gateway token by default, so paste it here on first connect.

## [​](https://docs.molt.bot/web/control-ui\#what-it-can-do-today)  What it can do (today)

- Chat with the model via Gateway WS (`chat.history`, `chat.send`, `chat.abort`, `chat.inject`)
- Stream tool calls + live tool output cards in Chat (agent events)
- Channels: WhatsApp/Telegram/Discord/Slack + plugin channels (Mattermost, etc.) status + QR login + per-channel config (`channels.status`, `web.login.*`, `config.patch`)
- Instances: presence list + refresh (`system-presence`)
- Sessions: list + per-session thinking/verbose overrides (`sessions.list`, `sessions.patch`)
- Cron jobs: list/add/run/enable/disable + run history (`cron.*`)
- Skills: status, enable/disable, install, API key updates (`skills.*`)
- Nodes: list + caps (`node.list`)
- Exec approvals: edit gateway or node allowlists + ask policy for `exec host=gateway/node` (`exec.approvals.*`)
- Config: view/edit `~/.clawdbot/moltbot.json` (`config.get`, `config.set`)
- Config: apply + restart with validation (`config.apply`) and wake the last active session
- Config writes include a base-hash guard to prevent clobbering concurrent edits
- Config schema + form rendering (`config.schema`, including plugin + channel schemas); Raw JSON editor remains available
- Debug: status/health/models snapshots + event log + manual RPC calls (`status`, `health`, `models.list`)
- Logs: live tail of gateway file logs with filter/export (`logs.tail`)
- Update: run a package/git update + restart (`update.run`) with a restart report

## [​](https://docs.molt.bot/web/control-ui\#chat-behavior)  Chat behavior

- `chat.send` is **non-blocking**: it acks immediately with `{ runId, status: "started" }` and the response streams via `chat` events.
- Re-sending with the same `idempotencyKey` returns `{ status: "in_flight" }` while running, and `{ status: "ok" }` after completion.
- `chat.inject` appends an assistant note to the session transcript and broadcasts a `chat` event for UI-only updates (no agent run, no channel delivery).
- Stop:
  - Click **Stop** (calls `chat.abort`)
  - Type `/stop` (or `stop|esc|abort|wait|exit|interrupt`) to abort out-of-band
  - `chat.abort` supports `{ sessionKey }` (no `runId`) to abort all active runs for that session

## [​](https://docs.molt.bot/web/control-ui\#tailnet-access-recommended)  Tailnet access (recommended)

### [​](https://docs.molt.bot/web/control-ui\#integrated-tailscale-serve-preferred)  Integrated Tailscale Serve (preferred)

Keep the Gateway on loopback and let Tailscale Serve proxy it with HTTPS:

Copy

```
moltbot gateway --tailscale serve
```

Open:

- `https://<magicdns>/` (or your configured `gateway.controlUi.basePath`)

By default, Serve requests can authenticate via Tailscale identity headers
(`tailscale-user-login`) when `gateway.auth.allowTailscale` is `true`. Moltbot
verifies the identity by resolving the `x-forwarded-for` address with
`tailscale whois` and matching it to the header, and only accepts these when the
request hits loopback with Tailscale’s `x-forwarded-*` headers. Set
`gateway.auth.allowTailscale: false` (or force `gateway.auth.mode: "password"`)
if you want to require a token/password even for Serve traffic.

### [​](https://docs.molt.bot/web/control-ui\#bind-to-tailnet-+-token)  Bind to tailnet + token

Copy

```
moltbot gateway --bind tailnet --token "$(openssl rand -hex 32)"
```

Then open:

- `http://<tailscale-ip>:18789/` (or your configured `gateway.controlUi.basePath`)

Paste the token into the UI settings (sent as `connect.params.auth.token`).

## [​](https://docs.molt.bot/web/control-ui\#insecure-http)  Insecure HTTP

If you open the dashboard over plain HTTP (`http://<lan-ip>` or `http://<tailscale-ip>`),
the browser runs in a **non-secure context** and blocks WebCrypto. By default,
Moltbot **blocks** Control UI connections without device identity.**Recommended fix:** use HTTPS (Tailscale Serve) or open the UI locally:

- `https://<magicdns>/` (Serve)
- `http://127.0.0.1:18789/` (on the gateway host)

**Downgrade example (token-only over HTTP):**

Copy

```
{
  gateway: {
    controlUi: { allowInsecureAuth: true },
    bind: "tailnet",
    auth: { mode: "token", token: "replace-me" }
  }
}
```

This disables device identity + pairing for the Control UI (even on HTTPS). Use
only if you trust the network.See [Tailscale](https://docs.molt.bot/gateway/tailscale) for HTTPS setup guidance.

## [​](https://docs.molt.bot/web/control-ui\#building-the-ui)  Building the UI

The Gateway serves static files from `dist/control-ui`. Build them with:

Copy

```
pnpm ui:build # auto-installs UI deps on first run
```

Optional absolute base (when you want fixed asset URLs):

Copy

```
CLAWDBOT_CONTROL_UI_BASE_PATH=/moltbot/ pnpm ui:build
```

For local development (separate dev server):

Copy

```
pnpm ui:dev # auto-installs UI deps on first run
```

Then point the UI at your Gateway WS URL (e.g. `ws://127.0.0.1:18789`).

## [​](https://docs.molt.bot/web/control-ui\#debugging/testing:-dev-server-+-remote-gateway)  Debugging/testing: dev server + remote Gateway

The Control UI is static files; the WebSocket target is configurable and can be
different from the HTTP origin. This is handy when you want the Vite dev server
locally but the Gateway runs elsewhere.

1. Start the UI dev server: `pnpm ui:dev`
2. Open a URL like:

Copy

```
http://localhost:5173/?gatewayUrl=ws://<gateway-host>:18789
```

Optional one-time auth (if needed):

Copy

```
http://localhost:5173/?gatewayUrl=wss://<gateway-host>:18789&token=<gateway-token>
```

Notes:

- `gatewayUrl` is stored in localStorage after load and removed from the URL.
- `token` is stored in localStorage; `password` is kept in memory only.
- Use `wss://` when the Gateway is behind TLS (Tailscale Serve, HTTPS proxy, etc.).

Remote access setup details: [Remote access](https://docs.molt.bot/gateway/remote).

[Web](https://docs.molt.bot/web) [Dashboard](https://docs.molt.bot/web/dashboard)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.