---
source: https://docs.molt.bot/cli/doctor
title: Doctor - Moltbot
---

[Skip to main content](https://docs.molt.bot/cli/doctor#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [moltbot doctor](https://docs.molt.bot/cli/doctor#moltbot-doctor)
- [Examples](https://docs.molt.bot/cli/doctor#examples)
- [macOS: launchctl env overrides](https://docs.molt.bot/cli/doctor#macos%3A-launchctl-env-overrides)

# [​](https://docs.molt.bot/cli/doctor\#moltbot-doctor)  `moltbot doctor`

Health checks + quick fixes for the gateway and channels.Related:

- Troubleshooting: [Troubleshooting](https://docs.molt.bot/gateway/troubleshooting)
- Security audit: [Security](https://docs.molt.bot/gateway/security)

## [​](https://docs.molt.bot/cli/doctor\#examples)  Examples

Copy

```
moltbot doctor
moltbot doctor --repair
moltbot doctor --deep
```

Notes:

- Interactive prompts (like keychain/OAuth fixes) only run when stdin is a TTY and `--non-interactive` is **not** set. Headless runs (cron, Telegram, no terminal) will skip prompts.
- `--fix` (alias for `--repair`) writes a backup to `~/.clawdbot/moltbot.json.bak` and drops unknown config keys, listing each removal.

## [​](https://docs.molt.bot/cli/doctor\#macos:-launchctl-env-overrides)  macOS: `launchctl` env overrides

If you previously ran `launchctl setenv CLAWDBOT_GATEWAY_TOKEN ...` (or `...PASSWORD`), that value overrides your config file and can cause persistent “unauthorized” errors.

Copy

```
launchctl getenv CLAWDBOT_GATEWAY_TOKEN
launchctl getenv CLAWDBOT_GATEWAY_PASSWORD

launchctl unsetenv CLAWDBOT_GATEWAY_TOKEN
launchctl unsetenv CLAWDBOT_GATEWAY_PASSWORD
```

[Configure](https://docs.molt.bot/cli/configure) [Dashboard](https://docs.molt.bot/cli/dashboard)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.