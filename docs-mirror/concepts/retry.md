---
source: https://docs.molt.bot/concepts/retry
title: Retry - Moltbot
---

[Skip to main content](https://docs.molt.bot/concepts/retry#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Retry policy](https://docs.molt.bot/concepts/retry#retry-policy)
- [Goals](https://docs.molt.bot/concepts/retry#goals)
- [Defaults](https://docs.molt.bot/concepts/retry#defaults)
- [Behavior](https://docs.molt.bot/concepts/retry#behavior)
- [Discord](https://docs.molt.bot/concepts/retry#discord)
- [Telegram](https://docs.molt.bot/concepts/retry#telegram)
- [Configuration](https://docs.molt.bot/concepts/retry#configuration)
- [Notes](https://docs.molt.bot/concepts/retry#notes)

# [​](https://docs.molt.bot/concepts/retry\#retry-policy)  Retry policy

## [​](https://docs.molt.bot/concepts/retry\#goals)  Goals

- Retry per HTTP request, not per multi-step flow.
- Preserve ordering by retrying only the current step.
- Avoid duplicating non-idempotent operations.

## [​](https://docs.molt.bot/concepts/retry\#defaults)  Defaults

- Attempts: 3
- Max delay cap: 30000 ms
- Jitter: 0.1 (10 percent)
- Provider defaults:
  - Telegram min delay: 400 ms
  - Discord min delay: 500 ms

## [​](https://docs.molt.bot/concepts/retry\#behavior)  Behavior

### [​](https://docs.molt.bot/concepts/retry\#discord)  Discord

- Retries only on rate-limit errors (HTTP 429).
- Uses Discord `retry_after` when available, otherwise exponential backoff.

### [​](https://docs.molt.bot/concepts/retry\#telegram)  Telegram

- Retries on transient errors (429, timeout, connect/reset/closed, temporarily unavailable).
- Uses `retry_after` when available, otherwise exponential backoff.
- Markdown parse errors are not retried; they fall back to plain text.

## [​](https://docs.molt.bot/concepts/retry\#configuration)  Configuration

Set retry policy per provider in `~/.clawdbot/moltbot.json`:

Copy

```
{
  channels: {
    telegram: {
      retry: {
        attempts: 3,
        minDelayMs: 400,
        maxDelayMs: 30000,
        jitter: 0.1
      }
    },
    discord: {
      retry: {
        attempts: 3,
        minDelayMs: 500,
        maxDelayMs: 30000,
        jitter: 0.1
      }
    }
  }
}
```

## [​](https://docs.molt.bot/concepts/retry\#notes)  Notes

- Retries apply per request (message send, media upload, reaction, poll, sticker).
- Composite flows do not retry completed steps.

[Queue](https://docs.molt.bot/concepts/queue) [Model providers](https://docs.molt.bot/concepts/model-providers)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.