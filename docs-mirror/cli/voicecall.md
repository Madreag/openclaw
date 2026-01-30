---
source: https://docs.molt.bot/cli/voicecall
title: Voicecall - Moltbot
---

[Skip to main content](https://docs.molt.bot/cli/voicecall#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [moltbot voicecall](https://docs.molt.bot/cli/voicecall#moltbot-voicecall)
- [Common commands](https://docs.molt.bot/cli/voicecall#common-commands)
- [Exposing webhooks (Tailscale)](https://docs.molt.bot/cli/voicecall#exposing-webhooks-tailscale)

# [​](https://docs.molt.bot/cli/voicecall\#moltbot-voicecall)  `moltbot voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.Primary doc:

- Voice-call plugin: [Voice Call](https://docs.molt.bot/plugins/voice-call)

## [​](https://docs.molt.bot/cli/voicecall\#common-commands)  Common commands

Copy

```
moltbot voicecall status --call-id <id>
moltbot voicecall call --to "+15555550123" --message "Hello" --mode notify
moltbot voicecall continue --call-id <id> --message "Any questions?"
moltbot voicecall end --call-id <id>
```

## [​](https://docs.molt.bot/cli/voicecall\#exposing-webhooks-tailscale)  Exposing webhooks (Tailscale)

Copy

```
moltbot voicecall expose --mode serve
moltbot voicecall expose --mode funnel
moltbot voicecall unexpose
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.

[Tui](https://docs.molt.bot/cli/tui) [Cron](https://docs.molt.bot/cli/cron)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.