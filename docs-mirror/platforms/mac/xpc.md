---
source: https://docs.molt.bot/platforms/mac/xpc
title: Xpc - Moltbot
---

[Skip to main content](https://docs.molt.bot/platforms/mac/xpc#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Moltbot macOS IPC architecture](https://docs.molt.bot/platforms/mac/xpc#moltbot-macos-ipc-architecture)
- [Goals](https://docs.molt.bot/platforms/mac/xpc#goals)
- [How it works](https://docs.molt.bot/platforms/mac/xpc#how-it-works)
- [Gateway + node transport](https://docs.molt.bot/platforms/mac/xpc#gateway-%2B-node-transport)
- [Node service + app IPC](https://docs.molt.bot/platforms/mac/xpc#node-service-%2B-app-ipc)
- [PeekabooBridge (UI automation)](https://docs.molt.bot/platforms/mac/xpc#peekaboobridge-ui-automation)
- [Operational flows](https://docs.molt.bot/platforms/mac/xpc#operational-flows)
- [Hardening notes](https://docs.molt.bot/platforms/mac/xpc#hardening-notes)

# [​](https://docs.molt.bot/platforms/mac/xpc\#moltbot-macos-ipc-architecture)  Moltbot macOS IPC architecture

**Current model:** a local Unix socket connects the **node host service** to the **macOS app** for exec approvals + `system.run`. A `moltbot-mac` debug CLI exists for discovery/connect checks; agent actions still flow through the Gateway WebSocket and `node.invoke`. UI automation uses PeekabooBridge.

## [​](https://docs.molt.bot/platforms/mac/xpc\#goals)  Goals

- Single GUI app instance that owns all TCC-facing work (notifications, screen recording, mic, speech, AppleScript).
- A small surface for automation: Gateway + node commands, plus PeekabooBridge for UI automation.
- Predictable permissions: always the same signed bundle ID, launched by launchd, so TCC grants stick.

## [​](https://docs.molt.bot/platforms/mac/xpc\#how-it-works)  How it works

### [​](https://docs.molt.bot/platforms/mac/xpc\#gateway-+-node-transport)  Gateway + node transport

- The app runs the Gateway (local mode) and connects to it as a node.
- Agent actions are performed via `node.invoke` (e.g. `system.run`, `system.notify`, `canvas.*`).

### [​](https://docs.molt.bot/platforms/mac/xpc\#node-service-+-app-ipc)  Node service + app IPC

- A headless node host service connects to the Gateway WebSocket.
- `system.run` requests are forwarded to the macOS app over a local Unix socket.
- The app performs the exec in UI context, prompts if needed, and returns output.

Diagram (SCI):

Copy

```
Agent -> Gateway -> Node Service (WS)
                      |  IPC (UDS + token + HMAC + TTL)
                      v
                  Mac App (UI + TCC + system.run)
```

### [​](https://docs.molt.bot/platforms/mac/xpc\#peekaboobridge-ui-automation)  PeekabooBridge (UI automation)

- UI automation uses a separate UNIX socket named `bridge.sock` and the PeekabooBridge JSON protocol.
- Host preference order (client-side): Peekaboo.app → Claude.app → Moltbot.app → local execution.
- Security: bridge hosts require an allowed TeamID; DEBUG-only same-UID escape hatch is guarded by `PEEKABOO_ALLOW_UNSIGNED_SOCKET_CLIENTS=1` (Peekaboo convention).
- See: [PeekabooBridge usage](https://docs.molt.bot/platforms/mac/peekaboo) for details.

## [​](https://docs.molt.bot/platforms/mac/xpc\#operational-flows)  Operational flows

- Restart/rebuild: `SIGN_IDENTITY="Apple Development: <Developer Name> (<TEAMID>)" scripts/restart-mac.sh`
  - Kills existing instances
  - Swift build + package
  - Writes/bootstraps/kickstarts the LaunchAgent
- Single instance: app exits early if another instance with the same bundle ID is running.

## [​](https://docs.molt.bot/platforms/mac/xpc\#hardening-notes)  Hardening notes

- Prefer requiring a TeamID match for all privileged surfaces.
- PeekabooBridge: `PEEKABOO_ALLOW_UNSIGNED_SOCKET_CLIENTS=1` (DEBUG-only) may allow same-UID callers for local development.
- All communication remains local-only; no network sockets are exposed.
- TCC prompts originate only from the GUI app bundle; keep the signed bundle ID stable across rebuilds.
- IPC hardening: socket mode `0600`, token, peer-UID checks, HMAC challenge/response, short TTL.

[Bundled gateway](https://docs.molt.bot/platforms/mac/bundled-gateway) [Skills](https://docs.molt.bot/platforms/mac/skills)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.