---
source: https://docs.molt.bot/web/webchat
title: Webchat - Moltbot
---

[Skip to main content](https://docs.molt.bot/web/webchat#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [WebChat (Gateway WebSocket UI)](https://docs.molt.bot/web/webchat#webchat-gateway-websocket-ui)
- [What it is](https://docs.molt.bot/web/webchat#what-it-is)
- [Quick start](https://docs.molt.bot/web/webchat#quick-start)
- [How it works (behavior)](https://docs.molt.bot/web/webchat#how-it-works-behavior)
- [Remote use](https://docs.molt.bot/web/webchat#remote-use)
- [Configuration reference (WebChat)](https://docs.molt.bot/web/webchat#configuration-reference-webchat)

# [​](https://docs.molt.bot/web/webchat\#webchat-gateway-websocket-ui)  WebChat (Gateway WebSocket UI)

Status: the macOS/iOS SwiftUI chat UI talks directly to the Gateway WebSocket.

## [​](https://docs.molt.bot/web/webchat\#what-it-is)  What it is

- A native chat UI for the gateway (no embedded browser and no local static server).
- Uses the same sessions and routing rules as other channels.
- Deterministic routing: replies always go back to WebChat.

## [​](https://docs.molt.bot/web/webchat\#quick-start)  Quick start

1. Start the gateway.
2. Open the WebChat UI (macOS/iOS app) or the Control UI chat tab.
3. Ensure gateway auth is configured (required by default, even on loopback).

## [​](https://docs.molt.bot/web/webchat\#how-it-works-behavior)  How it works (behavior)

- The UI connects to the Gateway WebSocket and uses `chat.history`, `chat.send`, and `chat.inject`.
- `chat.inject` appends an assistant note directly to the transcript and broadcasts it to the UI (no agent run).
- History is always fetched from the gateway (no local file watching).
- If the gateway is unreachable, WebChat is read-only.

## [​](https://docs.molt.bot/web/webchat\#remote-use)  Remote use

- Remote mode tunnels the gateway WebSocket over SSH/Tailscale.
- You do not need to run a separate WebChat server.

## [​](https://docs.molt.bot/web/webchat\#configuration-reference-webchat)  Configuration reference (WebChat)

Full configuration: [Configuration](https://docs.molt.bot/gateway/configuration)Channel options:

- No dedicated `webchat.*` block. WebChat uses the gateway endpoint + auth settings below.

Related global options:

- `gateway.port`, `gateway.bind`: WebSocket host/port.
- `gateway.auth.mode`, `gateway.auth.token`, `gateway.auth.password`: WebSocket auth.
- `gateway.remote.url`, `gateway.remote.token`, `gateway.remote.password`: remote gateway target.
- `session.*`: session storage and main key defaults.

[Dashboard](https://docs.molt.bot/web/dashboard) [Tui](https://docs.molt.bot/tui)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.