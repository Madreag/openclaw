---
source: https://docs.molt.bot/cli/onboard
title: Onboard - Moltbot
---

[Skip to main content](https://docs.molt.bot/cli/onboard#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [moltbot onboard](https://docs.molt.bot/cli/onboard#moltbot-onboard)
- [Examples](https://docs.molt.bot/cli/onboard#examples)

# [​](https://docs.molt.bot/cli/onboard\#moltbot-onboard)  `moltbot onboard`

Interactive onboarding wizard (local or remote Gateway setup).Related:

- Wizard guide: [Onboarding](https://docs.molt.bot/start/onboarding)

## [​](https://docs.molt.bot/cli/onboard\#examples)  Examples

Copy

```
moltbot onboard
moltbot onboard --flow quickstart
moltbot onboard --flow manual
moltbot onboard --mode remote --remote-url ws://gateway-host:18789
```

Flow notes:

- `quickstart`: minimal prompts, auto-generates a gateway token.
- `manual`: full prompts for port/bind/auth (alias of `advanced`).
- Fastest first chat: `moltbot dashboard` (Control UI, no channel setup).

[Setup](https://docs.molt.bot/cli/setup) [Configure](https://docs.molt.bot/cli/configure)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.