---
source: https://docs.molt.bot/platforms/linux
title: Linux - Moltbot
---

[Skip to main content](https://docs.molt.bot/platforms/linux#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Linux App](https://docs.molt.bot/platforms/linux#linux-app)
- [Beginner quick path (VPS)](https://docs.molt.bot/platforms/linux#beginner-quick-path-vps)
- [Install](https://docs.molt.bot/platforms/linux#install)
- [Gateway](https://docs.molt.bot/platforms/linux#gateway)
- [Gateway service install (CLI)](https://docs.molt.bot/platforms/linux#gateway-service-install-cli)
- [System control (systemd user unit)](https://docs.molt.bot/platforms/linux#system-control-systemd-user-unit)

# [​](https://docs.molt.bot/platforms/linux\#linux-app)  Linux App

The Gateway is fully supported on Linux. **Node is the recommended runtime**.
Bun is not recommended for the Gateway (WhatsApp/Telegram bugs).Native Linux companion apps are planned. Contributions are welcome if you want to help build one.

## [​](https://docs.molt.bot/platforms/linux\#beginner-quick-path-vps)  Beginner quick path (VPS)

1. Install Node 22+
2. `npm i -g moltbot@latest`
3. `moltbot onboard --install-daemon`
4. From your laptop: `ssh -N -L 18789:127.0.0.1:18789 <user>@<host>`
5. Open `http://127.0.0.1:18789/` and paste your token

Step-by-step VPS guide: [exe.dev](https://docs.molt.bot/platforms/exe-dev)

## [​](https://docs.molt.bot/platforms/linux\#install)  Install

- [Getting Started](https://docs.molt.bot/start/getting-started)
- [Install & updates](https://docs.molt.bot/install/updating)
- Optional flows: [Bun (experimental)](https://docs.molt.bot/install/bun), [Nix](https://docs.molt.bot/install/nix), [Docker](https://docs.molt.bot/install/docker)

## [​](https://docs.molt.bot/platforms/linux\#gateway)  Gateway

- [Gateway runbook](https://docs.molt.bot/gateway)
- [Configuration](https://docs.molt.bot/gateway/configuration)

## [​](https://docs.molt.bot/platforms/linux\#gateway-service-install-cli)  Gateway service install (CLI)

Use one of these:

Copy

```
moltbot onboard --install-daemon
```

Or:

Copy

```
moltbot gateway install
```

Or:

Copy

```
moltbot configure
```

Select **Gateway service** when prompted.Repair/migrate:

Copy

```
moltbot doctor
```

## [​](https://docs.molt.bot/platforms/linux\#system-control-systemd-user-unit)  System control (systemd user unit)

Moltbot installs a systemd **user** service by default. Use a **system**
service for shared or always-on servers. The full unit example and guidance
live in the [Gateway runbook](https://docs.molt.bot/gateway).Minimal setup:Create `~/.config/systemd/user/moltbot-gateway[-<profile>].service`:

Copy

```
[Unit]
Description=Moltbot Gateway (profile: <profile>, v<version>)
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/moltbot gateway --port 18789
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

Enable it:

Copy

```
systemctl --user enable --now moltbot-gateway[-<profile>].service
```

[Windows](https://docs.molt.bot/platforms/windows) [Fly.io](https://docs.molt.bot/platforms/fly)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.