---
source: https://docs.molt.bot/platforms/mac/peekaboo
title: Peekaboo - Moltbot
---

[Skip to main content](https://docs.molt.bot/platforms/mac/peekaboo#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Peekaboo Bridge (macOS UI automation)](https://docs.molt.bot/platforms/mac/peekaboo#peekaboo-bridge-macos-ui-automation)
- [What this is (and isn’t)](https://docs.molt.bot/platforms/mac/peekaboo#what-this-is-and-isn%E2%80%99t)
- [Enable the bridge](https://docs.molt.bot/platforms/mac/peekaboo#enable-the-bridge)
- [Client discovery order](https://docs.molt.bot/platforms/mac/peekaboo#client-discovery-order)
- [Security & permissions](https://docs.molt.bot/platforms/mac/peekaboo#security-%26-permissions)
- [Snapshot behavior (automation)](https://docs.molt.bot/platforms/mac/peekaboo#snapshot-behavior-automation)
- [Troubleshooting](https://docs.molt.bot/platforms/mac/peekaboo#troubleshooting)

# [​](https://docs.molt.bot/platforms/mac/peekaboo\#peekaboo-bridge-macos-ui-automation)  Peekaboo Bridge (macOS UI automation)

Moltbot can host **PeekabooBridge** as a local, permission‑aware UI automation
broker. This lets the `peekaboo` CLI drive UI automation while reusing the
macOS app’s TCC permissions.

## [​](https://docs.molt.bot/platforms/mac/peekaboo\#what-this-is-and-isn%E2%80%99t)  What this is (and isn’t)

- **Host**: Moltbot.app can act as a PeekabooBridge host.
- **Client**: use the `peekaboo` CLI (no separate `moltbot ui ...` surface).
- **UI**: visual overlays stay in Peekaboo.app; Moltbot is a thin broker host.

## [​](https://docs.molt.bot/platforms/mac/peekaboo\#enable-the-bridge)  Enable the bridge

In the macOS app:

- Settings → **Enable Peekaboo Bridge**

When enabled, Moltbot starts a local UNIX socket server. If disabled, the host
is stopped and `peekaboo` will fall back to other available hosts.

## [​](https://docs.molt.bot/platforms/mac/peekaboo\#client-discovery-order)  Client discovery order

Peekaboo clients typically try hosts in this order:

1. Peekaboo.app (full UX)
2. Claude.app (if installed)
3. Moltbot.app (thin broker)

Use `peekaboo bridge status --verbose` to see which host is active and which
socket path is in use. You can override with:

Copy

```
export PEEKABOO_BRIDGE_SOCKET=/path/to/bridge.sock
```

## [​](https://docs.molt.bot/platforms/mac/peekaboo\#security-&-permissions)  Security & permissions

- The bridge validates **caller code signatures**; an allowlist of TeamIDs is
enforced (Peekaboo host TeamID + Moltbot app TeamID).
- Requests time out after ~10 seconds.
- If required permissions are missing, the bridge returns a clear error message
rather than launching System Settings.

## [​](https://docs.molt.bot/platforms/mac/peekaboo\#snapshot-behavior-automation)  Snapshot behavior (automation)

Snapshots are stored in memory and expire automatically after a short window.
If you need longer retention, re‑capture from the client.

## [​](https://docs.molt.bot/platforms/mac/peekaboo\#troubleshooting)  Troubleshooting

- If `peekaboo` reports “bridge client is not authorized”, ensure the client is
properly signed or run the host with `PEEKABOO_ALLOW_UNSIGNED_SOCKET_CLIENTS=1`
in **debug** mode only.
- If no hosts are found, open one of the host apps (Peekaboo.app or Moltbot.app)
and confirm permissions are granted.

[Skills](https://docs.molt.bot/platforms/mac/skills) [Testing](https://docs.molt.bot/testing)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.