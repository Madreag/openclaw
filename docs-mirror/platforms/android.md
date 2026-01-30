---
source: https://docs.molt.bot/platforms/android
title: Android - Moltbot
---

[Skip to main content](https://docs.molt.bot/platforms/android#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Android App (Node)](https://docs.molt.bot/platforms/android#android-app-node)
- [Support snapshot](https://docs.molt.bot/platforms/android#support-snapshot)
- [System control](https://docs.molt.bot/platforms/android#system-control)
- [Connection Runbook](https://docs.molt.bot/platforms/android#connection-runbook)
- [Prerequisites](https://docs.molt.bot/platforms/android#prerequisites)
- [1) Start the Gateway](https://docs.molt.bot/platforms/android#1-start-the-gateway)
- [2) Verify discovery (optional)](https://docs.molt.bot/platforms/android#2-verify-discovery-optional)
- [Tailnet (Vienna ⇄ London) discovery via unicast DNS-SD](https://docs.molt.bot/platforms/android#tailnet-vienna-%E2%87%84-london-discovery-via-unicast-dns-sd)
- [3) Connect from Android](https://docs.molt.bot/platforms/android#3-connect-from-android)
- [4) Approve pairing (CLI)](https://docs.molt.bot/platforms/android#4-approve-pairing-cli)
- [5) Verify the node is connected](https://docs.molt.bot/platforms/android#5-verify-the-node-is-connected)
- [6) Chat + history](https://docs.molt.bot/platforms/android#6-chat-%2B-history)
- [7) Canvas + camera](https://docs.molt.bot/platforms/android#7-canvas-%2B-camera)
- [Gateway Canvas Host (recommended for web content)](https://docs.molt.bot/platforms/android#gateway-canvas-host-recommended-for-web-content)

# [​](https://docs.molt.bot/platforms/android\#android-app-node)  Android App (Node)

## [​](https://docs.molt.bot/platforms/android\#support-snapshot)  Support snapshot

- Role: companion node app (Android does not host the Gateway).
- Gateway required: yes (run it on macOS, Linux, or Windows via WSL2).
- Install: [Getting Started](https://docs.molt.bot/start/getting-started) \+ [Pairing](https://docs.molt.bot/gateway/pairing).
- Gateway: [Runbook](https://docs.molt.bot/gateway) \+ [Configuration](https://docs.molt.bot/gateway/configuration).

  - Protocols: [Gateway protocol](https://docs.molt.bot/gateway/protocol) (nodes + control plane).

## [​](https://docs.molt.bot/platforms/android\#system-control)  System control

System control (launchd/systemd) lives on the Gateway host. See [Gateway](https://docs.molt.bot/gateway).

## [​](https://docs.molt.bot/platforms/android\#connection-runbook)  Connection Runbook

Android node app ⇄ (mDNS/NSD + WebSocket) ⇄ **Gateway**Android connects directly to the Gateway WebSocket (default `ws://<host>:18789`) and uses Gateway-owned pairing.

### [​](https://docs.molt.bot/platforms/android\#prerequisites)  Prerequisites

- You can run the Gateway on the “master” machine.
- Android device/emulator can reach the gateway WebSocket:
  - Same LAN with mDNS/NSD, **or**
  - Same Tailscale tailnet using Wide-Area Bonjour / unicast DNS-SD (see below), **or**
  - Manual gateway host/port (fallback)
- You can run the CLI (`moltbot`) on the gateway machine (or via SSH).

### [​](https://docs.molt.bot/platforms/android\#1-start-the-gateway)  1) Start the Gateway

Copy

```
moltbot gateway --port 18789 --verbose
```

Confirm in logs you see something like:

- `listening on ws://0.0.0.0:18789`

For tailnet-only setups (recommended for Vienna ⇄ London), bind the gateway to the tailnet IP:

- Set `gateway.bind: "tailnet"` in `~/.clawdbot/moltbot.json` on the gateway host.
- Restart the Gateway / macOS menubar app.

### [​](https://docs.molt.bot/platforms/android\#2-verify-discovery-optional)  2) Verify discovery (optional)

From the gateway machine:

Copy

```
dns-sd -B _moltbot-gw._tcp local.
```

More debugging notes: [Bonjour](https://docs.molt.bot/gateway/bonjour).

#### [​](https://docs.molt.bot/platforms/android\#tailnet-vienna-%E2%87%84-london-discovery-via-unicast-dns-sd)  Tailnet (Vienna ⇄ London) discovery via unicast DNS-SD

Android NSD/mDNS discovery won’t cross networks. If your Android node and the gateway are on different networks but connected via Tailscale, use Wide-Area Bonjour / unicast DNS-SD instead:

1. Set up a DNS-SD zone (example `moltbot.internal.`) on the gateway host and publish `_moltbot-gw._tcp` records.
2. Configure Tailscale split DNS for `moltbot.internal` pointing at that DNS server.

Details and example CoreDNS config: [Bonjour](https://docs.molt.bot/gateway/bonjour).

### [​](https://docs.molt.bot/platforms/android\#3-connect-from-android)  3) Connect from Android

In the Android app:

- The app keeps its gateway connection alive via a **foreground service** (persistent notification).
- Open **Settings**.
- Under **Discovered Gateways**, select your gateway and hit **Connect**.
- If mDNS is blocked, use **Advanced → Manual Gateway** (host + port) and **Connect (Manual)**.

After the first successful pairing, Android auto-reconnects on launch:

- Manual endpoint (if enabled), otherwise
- The last discovered gateway (best-effort).

### [​](https://docs.molt.bot/platforms/android\#4-approve-pairing-cli)  4) Approve pairing (CLI)

On the gateway machine:

Copy

```
moltbot nodes pending
moltbot nodes approve <requestId>
```

Pairing details: [Gateway pairing](https://docs.molt.bot/gateway/pairing).

### [​](https://docs.molt.bot/platforms/android\#5-verify-the-node-is-connected)  5) Verify the node is connected

- Via nodes status:







Copy











```
moltbot nodes status
```

- Via Gateway:







Copy











```
moltbot gateway call node.list --params "{}"
```


### [​](https://docs.molt.bot/platforms/android\#6-chat-+-history)  6) Chat + history

The Android node’s Chat sheet uses the gateway’s **primary session key** (`main`), so history and replies are shared with WebChat and other clients:

- History: `chat.history`
- Send: `chat.send`
- Push updates (best-effort): `chat.subscribe` → `event:"chat"`

### [​](https://docs.molt.bot/platforms/android\#7-canvas-+-camera)  7) Canvas + camera

#### [​](https://docs.molt.bot/platforms/android\#gateway-canvas-host-recommended-for-web-content)  Gateway Canvas Host (recommended for web content)

If you want the node to show real HTML/CSS/JS that the agent can edit on disk, point the node at the Gateway canvas host.Note: nodes use the standalone canvas host on `canvasHost.port` (default `18793`).

1. Create `~/clawd/canvas/index.html` on the gateway host.
2. Navigate the node to it (LAN):

Copy

```
moltbot nodes invoke --node "<Android Node>" --command canvas.navigate --params '{"url":"http://<gateway-hostname>.local:18793/__moltbot__/canvas/"}'
```

Tailnet (optional): if both devices are on Tailscale, use a MagicDNS name or tailnet IP instead of `.local`, e.g. `http://<gateway-magicdns>:18793/__moltbot__/canvas/`.This server injects a live-reload client into HTML and reloads on file changes.
The A2UI host lives at `http://<gateway-host>:18793/__moltbot__/a2ui/`.Canvas commands (foreground only):

- `canvas.eval`, `canvas.snapshot`, `canvas.navigate` (use `{"url":""}` or `{"url":"/"}` to return to the default scaffold). `canvas.snapshot` returns `{ format, base64 }` (default `format="jpeg"`).
- A2UI: `canvas.a2ui.push`, `canvas.a2ui.reset` (`canvas.a2ui.pushJSONL` legacy alias)

Camera commands (foreground only; permission-gated):

- `camera.snap` (jpg)
- `camera.clip` (mp4)

See [Camera node](https://docs.molt.bot/nodes/camera) for parameters and CLI helpers.

[Ios](https://docs.molt.bot/platforms/ios) [Windows](https://docs.molt.bot/platforms/windows)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.