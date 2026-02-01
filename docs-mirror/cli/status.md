---
source: https://docs.molt.bot/cli/status
title: Status - Moltbot
---

[Skip to main content](https://docs.molt.bot/cli/status#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [moltbot status](https://docs.molt.bot/cli/status#moltbot-status)

# [​](https://docs.molt.bot/cli/status\#moltbot-status)  `moltbot status`

Diagnostics for channels + sessions.

Copy

```
moltbot status
moltbot status --all
moltbot status --deep
moltbot status --usage
```

Notes:

- `--deep` runs live probes (WhatsApp Web + Telegram + Discord + Google Chat + Slack + Signal).
- Output includes per-agent session stores when multiple agents are configured.
- Overview includes Gateway + node host service install/runtime status when available.
- Overview includes update channel + git SHA (for source checkouts).
- Update info surfaces in the Overview; if an update is available, status prints a hint to run `moltbot update` (see [Updating](https://docs.molt.bot/install/updating)).

[Agents](https://docs.molt.bot/cli/agents) [Health](https://docs.molt.bot/cli/health)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.