---
source: https://docs.molt.bot/concepts/presence
title: Presence - Moltbot
---

[Skip to main content](https://docs.molt.bot/concepts/presence#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Presence](https://docs.molt.bot/concepts/presence#presence)
- [Presence fields (what shows up)](https://docs.molt.bot/concepts/presence#presence-fields-what-shows-up)
- [Producers (where presence comes from)](https://docs.molt.bot/concepts/presence#producers-where-presence-comes-from)
- [1) Gateway self entry](https://docs.molt.bot/concepts/presence#1-gateway-self-entry)
- [2) WebSocket connect](https://docs.molt.bot/concepts/presence#2-websocket-connect)
- [Why one‑off CLI commands don’t show up](https://docs.molt.bot/concepts/presence#why-one%E2%80%91off-cli-commands-don%E2%80%99t-show-up)
- [3) system-event beacons](https://docs.molt.bot/concepts/presence#3-system-event-beacons)
- [4) Node connects (role: node)](https://docs.molt.bot/concepts/presence#4-node-connects-role%3A-node)
- [Merge + dedupe rules (why instanceId matters)](https://docs.molt.bot/concepts/presence#merge-%2B-dedupe-rules-why-instanceid-matters)
- [TTL and bounded size](https://docs.molt.bot/concepts/presence#ttl-and-bounded-size)
- [Remote/tunnel caveat (loopback IPs)](https://docs.molt.bot/concepts/presence#remote%2Ftunnel-caveat-loopback-ips)
- [Consumers](https://docs.molt.bot/concepts/presence#consumers)
- [macOS Instances tab](https://docs.molt.bot/concepts/presence#macos-instances-tab)
- [Debugging tips](https://docs.molt.bot/concepts/presence#debugging-tips)

# [​](https://docs.molt.bot/concepts/presence\#presence)  Presence

Moltbot “presence” is a lightweight, best‑effort view of:

- the **Gateway** itself, and
- **clients connected to the Gateway** (mac app, WebChat, CLI, etc.)

Presence is used primarily to render the macOS app’s **Instances** tab and to
provide quick operator visibility.

## [​](https://docs.molt.bot/concepts/presence\#presence-fields-what-shows-up)  Presence fields (what shows up)

Presence entries are structured objects with fields like:

- `instanceId` (optional but strongly recommended): stable client identity (usually `connect.client.instanceId`)
- `host`: human‑friendly host name
- `ip`: best‑effort IP address
- `version`: client version string
- `deviceFamily` / `modelIdentifier`: hardware hints
- `mode`: `ui`, `webchat`, `cli`, `backend`, `probe`, `test`, `node`, …
- `lastInputSeconds`: “seconds since last user input” (if known)
- `reason`: `self`, `connect`, `node-connected`, `periodic`, …
- `ts`: last update timestamp (ms since epoch)

## [​](https://docs.molt.bot/concepts/presence\#producers-where-presence-comes-from)  Producers (where presence comes from)

Presence entries are produced by multiple sources and **merged**.

### [​](https://docs.molt.bot/concepts/presence\#1-gateway-self-entry)  1) Gateway self entry

The Gateway always seeds a “self” entry at startup so UIs show the gateway host
even before any clients connect.

### [​](https://docs.molt.bot/concepts/presence\#2-websocket-connect)  2) WebSocket connect

Every WS client begins with a `connect` request. On successful handshake the
Gateway upserts a presence entry for that connection.

#### [​](https://docs.molt.bot/concepts/presence\#why-one%E2%80%91off-cli-commands-don%E2%80%99t-show-up)  Why one‑off CLI commands don’t show up

The CLI often connects for short, one‑off commands. To avoid spamming the
Instances list, `client.mode === "cli"` is **not** turned into a presence entry.

### [​](https://docs.molt.bot/concepts/presence\#3-system-event-beacons)  3) `system-event` beacons

Clients can send richer periodic beacons via the `system-event` method. The mac
app uses this to report host name, IP, and `lastInputSeconds`.

### [​](https://docs.molt.bot/concepts/presence\#4-node-connects-role:-node)  4) Node connects (role: node)

When a node connects over the Gateway WebSocket with `role: node`, the Gateway
upserts a presence entry for that node (same flow as other WS clients).

## [​](https://docs.molt.bot/concepts/presence\#merge-+-dedupe-rules-why-instanceid-matters)  Merge + dedupe rules (why `instanceId` matters)

Presence entries are stored in a single in‑memory map:

- Entries are keyed by a **presence key**.
- The best key is a stable `instanceId` (from `connect.client.instanceId`) that survives restarts.
- Keys are case‑insensitive.

If a client reconnects without a stable `instanceId`, it may show up as a
**duplicate** row.

## [​](https://docs.molt.bot/concepts/presence\#ttl-and-bounded-size)  TTL and bounded size

Presence is intentionally ephemeral:

- **TTL:** entries older than 5 minutes are pruned
- **Max entries:** 200 (oldest dropped first)

This keeps the list fresh and avoids unbounded memory growth.

## [​](https://docs.molt.bot/concepts/presence\#remote/tunnel-caveat-loopback-ips)  Remote/tunnel caveat (loopback IPs)

When a client connects over an SSH tunnel / local port forward, the Gateway may
see the remote address as `127.0.0.1`. To avoid overwriting a good client‑reported
IP, loopback remote addresses are ignored.

## [​](https://docs.molt.bot/concepts/presence\#consumers)  Consumers

### [​](https://docs.molt.bot/concepts/presence\#macos-instances-tab)  macOS Instances tab

The macOS app renders the output of `system-presence` and applies a small status
indicator (Active/Idle/Stale) based on the age of the last update.

## [​](https://docs.molt.bot/concepts/presence\#debugging-tips)  Debugging tips

- To see the raw list, call `system-presence` against the Gateway.
- If you see duplicates:
  - confirm clients send a stable `client.instanceId` in the handshake
  - confirm periodic beacons use the same `instanceId`
  - check whether the connection‑derived entry is missing `instanceId` (duplicates are expected)

[Session tool](https://docs.molt.bot/concepts/session-tool) [Channel routing](https://docs.molt.bot/concepts/channel-routing)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.