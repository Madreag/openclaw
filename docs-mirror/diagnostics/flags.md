---
source: https://docs.molt.bot/diagnostics/flags
title: Flags - Moltbot
---

[Skip to main content](https://docs.molt.bot/diagnostics/flags#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Diagnostics Flags](https://docs.molt.bot/diagnostics/flags#diagnostics-flags)
- [How it works](https://docs.molt.bot/diagnostics/flags#how-it-works)
- [Enable via config](https://docs.molt.bot/diagnostics/flags#enable-via-config)
- [Env override (one-off)](https://docs.molt.bot/diagnostics/flags#env-override-one-off)
- [Where logs go](https://docs.molt.bot/diagnostics/flags#where-logs-go)
- [Extract logs](https://docs.molt.bot/diagnostics/flags#extract-logs)
- [Notes](https://docs.molt.bot/diagnostics/flags#notes)

# [​](https://docs.molt.bot/diagnostics/flags\#diagnostics-flags)  Diagnostics Flags

Diagnostics flags let you enable targeted debug logs without turning on verbose logging everywhere. Flags are opt-in and have no effect unless a subsystem checks them.

## [​](https://docs.molt.bot/diagnostics/flags\#how-it-works)  How it works

- Flags are strings (case-insensitive).
- You can enable flags in config or via an env override.
- Wildcards are supported:
  - `telegram.*` matches `telegram.http`
  - `*` enables all flags

## [​](https://docs.molt.bot/diagnostics/flags\#enable-via-config)  Enable via config

Copy

```
{
  "diagnostics": {
    "flags": ["telegram.http"]
  }
}
```

Multiple flags:

Copy

```
{
  "diagnostics": {
    "flags": ["telegram.http", "gateway.*"]
  }
}
```

Restart the gateway after changing flags.

## [​](https://docs.molt.bot/diagnostics/flags\#env-override-one-off)  Env override (one-off)

Copy

```
CLAWDBOT_DIAGNOSTICS=telegram.http,telegram.payload
```

Disable all flags:

Copy

```
CLAWDBOT_DIAGNOSTICS=0
```

## [​](https://docs.molt.bot/diagnostics/flags\#where-logs-go)  Where logs go

Flags emit logs into the standard diagnostics log file. By default:

Copy

```
/tmp/moltbot/moltbot-YYYY-MM-DD.log
```

If you set `logging.file`, use that path instead. Logs are JSONL (one JSON object per line). Redaction still applies based on `logging.redactSensitive`.

## [​](https://docs.molt.bot/diagnostics/flags\#extract-logs)  Extract logs

Pick the latest log file:

Copy

```
ls -t /tmp/moltbot/moltbot-*.log | head -n 1
```

Filter for Telegram HTTP diagnostics:

Copy

```
rg "telegram http error" /tmp/moltbot/moltbot-*.log
```

Or tail while reproducing:

Copy

```
tail -f /tmp/moltbot/moltbot-$(date +%F).log | rg "telegram http error"
```

For remote gateways, you can also use `moltbot logs --follow` (see [/cli/logs](https://docs.molt.bot/cli/logs)).

## [​](https://docs.molt.bot/diagnostics/flags\#notes)  Notes

- If `logging.level` is set higher than `warn`, these logs may be suppressed. Default `info` is fine.
- Flags are safe to leave enabled; they only affect log volume for the specific subsystem.
- Use [/logging](https://docs.molt.bot/logging) to change log destinations, levels, and redaction.

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.