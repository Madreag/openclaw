---
source: https://docs.molt.bot/web
title: Index - Moltbot
---

[Skip to main content](https://docs.molt.bot/web#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Web (Gateway)](https://docs.molt.bot/web#web-gateway)
- [Webhooks](https://docs.molt.bot/web#webhooks)
- [Config (default-on)](https://docs.molt.bot/web#config-default-on)
- [Tailscale access](https://docs.molt.bot/web#tailscale-access)
- [Integrated Serve (recommended)](https://docs.molt.bot/web#integrated-serve-recommended)
- [Tailnet bind + token](https://docs.molt.bot/web#tailnet-bind-%2B-token)
- [Public internet (Funnel)](https://docs.molt.bot/web#public-internet-funnel)
- [Security notes](https://docs.molt.bot/web#security-notes)
- [Building the UI](https://docs.molt.bot/web#building-the-ui)

# [​](https://docs.molt.bot/web\#web-gateway)  Web (Gateway)

The Gateway serves a small **browser Control UI** (Vite + Lit) from the same port as the Gateway WebSocket:

- default: `http://<host>:18789/`
- optional prefix: set `gateway.controlUi.basePath` (e.g. `/moltbot`)

Capabilities live in [Control UI](https://docs.molt.bot/web/control-ui).
This page focuses on bind modes, security, and web-facing surfaces.

## [​](https://docs.molt.bot/web\#webhooks)  Webhooks

When `hooks.enabled=true`, the Gateway also exposes a small webhook endpoint on the same HTTP server.
See [Gateway configuration](https://docs.molt.bot/gateway/configuration) → `hooks` for auth + payloads.

## [​](https://docs.molt.bot/web\#config-default-on)  Config (default-on)

The Control UI is **enabled by default** when assets are present (`dist/control-ui`).
You can control it via config:

Copy

```
{
  gateway: {
    controlUi: { enabled: true, basePath: "/moltbot" } // basePath optional
  }
}
```

## [​](https://docs.molt.bot/web\#tailscale-access)  Tailscale access

### [​](https://docs.molt.bot/web\#integrated-serve-recommended)  Integrated Serve (recommended)

Keep the Gateway on loopback and let Tailscale Serve proxy it:

Copy

```
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "serve" }
  }
}
```

Then start the gateway:

Copy

```
moltbot gateway
```

Open:

- `https://<magicdns>/` (or your configured `gateway.controlUi.basePath`)

### [​](https://docs.molt.bot/web\#tailnet-bind-+-token)  Tailnet bind + token

Copy

```
{
  gateway: {
    bind: "tailnet",
    controlUi: { enabled: true },
    auth: { mode: "token", token: "your-token" }
  }
}
```

Then start the gateway (token required for non-loopback binds):

Copy

```
moltbot gateway
```

Open:

- `http://<tailscale-ip>:18789/` (or your configured `gateway.controlUi.basePath`)

### [​](https://docs.molt.bot/web\#public-internet-funnel)  Public internet (Funnel)

Copy

```
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "funnel" },
    auth: { mode: "password" } // or CLAWDBOT_GATEWAY_PASSWORD
  }
}
```

## [​](https://docs.molt.bot/web\#security-notes)  Security notes

- Gateway auth is required by default (token/password or Tailscale identity headers).
- Non-loopback binds still **require** a shared token/password (`gateway.auth` or env).
- The wizard generates a gateway token by default (even on loopback).
- The UI sends `connect.params.auth.token` or `connect.params.auth.password`.
- With Serve, Tailscale identity headers can satisfy auth when
`gateway.auth.allowTailscale` is `true` (no token/password required). Set
`gateway.auth.allowTailscale: false` to require explicit credentials. See
[Tailscale](https://docs.molt.bot/gateway/tailscale) and [Security](https://docs.molt.bot/gateway/security).
- `gateway.tailscale.mode: "funnel"` requires `gateway.auth.mode: "password"` (shared password).

## [​](https://docs.molt.bot/web\#building-the-ui)  Building the UI

The Gateway serves static files from `dist/control-ui`. Build them with:

Copy

```
pnpm ui:build # auto-installs UI deps on first run
```

[Tailscale](https://docs.molt.bot/gateway/tailscale) [Control ui](https://docs.molt.bot/web/control-ui)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.