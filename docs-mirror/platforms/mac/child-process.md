---
source: https://docs.molt.bot/platforms/mac/child-process
title: Child process - Moltbot
---

[Skip to main content](https://docs.molt.bot/platforms/mac/child-process#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Gateway lifecycle on macOS](https://docs.molt.bot/platforms/mac/child-process#gateway-lifecycle-on-macos)
- [Default behavior (launchd)](https://docs.molt.bot/platforms/mac/child-process#default-behavior-launchd)
- [Unsigned dev builds](https://docs.molt.bot/platforms/mac/child-process#unsigned-dev-builds)
- [Attach-only mode](https://docs.molt.bot/platforms/mac/child-process#attach-only-mode)
- [Remote mode](https://docs.molt.bot/platforms/mac/child-process#remote-mode)
- [Why we prefer launchd](https://docs.molt.bot/platforms/mac/child-process#why-we-prefer-launchd)

# [​](https://docs.molt.bot/platforms/mac/child-process\#gateway-lifecycle-on-macos)  Gateway lifecycle on macOS

The macOS app **manages the Gateway via launchd** by default and does not spawn
the Gateway as a child process. It first tries to attach to an already‑running
Gateway on the configured port; if none is reachable, it enables the launchd
service via the external `moltbot` CLI (no embedded runtime). This gives you
reliable auto‑start at login and restart on crashes.Child‑process mode (Gateway spawned directly by the app) is **not in use** today.
If you need tighter coupling to the UI, run the Gateway manually in a terminal.

## [​](https://docs.molt.bot/platforms/mac/child-process\#default-behavior-launchd)  Default behavior (launchd)

- The app installs a per‑user LaunchAgent labeled `bot.molt.gateway`
(or `bot.molt.<profile>` when using `--profile`/`CLAWDBOT_PROFILE`; legacy `com.clawdbot.*` is supported).
- When Local mode is enabled, the app ensures the LaunchAgent is loaded and
starts the Gateway if needed.
- Logs are written to the launchd gateway log path (visible in Debug Settings).

Common commands:

Copy

```
launchctl kickstart -k gui/$UID/bot.molt.gateway
launchctl bootout gui/$UID/bot.molt.gateway
```

Replace the label with `bot.molt.<profile>` when running a named profile.

## [​](https://docs.molt.bot/platforms/mac/child-process\#unsigned-dev-builds)  Unsigned dev builds

`scripts/restart-mac.sh --no-sign` is for fast local builds when you don’t have
signing keys. To prevent launchd from pointing at an unsigned relay binary, it:

- Writes `~/.clawdbot/disable-launchagent`.

Signed runs of `scripts/restart-mac.sh` clear this override if the marker is
present. To reset manually:

Copy

```
rm ~/.clawdbot/disable-launchagent
```

## [​](https://docs.molt.bot/platforms/mac/child-process\#attach-only-mode)  Attach-only mode

To force the macOS app to **never install or manage launchd**, launch it with
`--attach-only` (or `--no-launchd`). This sets `~/.clawdbot/disable-launchagent`,
so the app only attaches to an already running Gateway. You can toggle the same
behavior in Debug Settings.

## [​](https://docs.molt.bot/platforms/mac/child-process\#remote-mode)  Remote mode

Remote mode never starts a local Gateway. The app uses an SSH tunnel to the
remote host and connects over that tunnel.

## [​](https://docs.molt.bot/platforms/mac/child-process\#why-we-prefer-launchd)  Why we prefer launchd

- Auto‑start at login.
- Built‑in restart/KeepAlive semantics.
- Predictable logs and supervision.

If a true child‑process mode is ever needed again, it should be documented as a
separate, explicit dev‑only mode.

[Canvas](https://docs.molt.bot/platforms/mac/canvas) [Health](https://docs.molt.bot/platforms/mac/health)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.