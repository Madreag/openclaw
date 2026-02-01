---
source: https://docs.molt.bot/cli/configure
title: Configure - Moltbot
---

[Skip to main content](https://docs.molt.bot/cli/configure#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [moltbot configure](https://docs.molt.bot/cli/configure#moltbot-configure)
- [Examples](https://docs.molt.bot/cli/configure#examples)

# [​](https://docs.molt.bot/cli/configure\#moltbot-configure)  `moltbot configure`

Interactive prompt to set up credentials, devices, and agent defaults.Note: The **Model** section now includes a multi-select for the
`agents.defaults.models` allowlist (what shows up in `/model` and the model picker).Tip: `moltbot config` without a subcommand opens the same wizard. Use
`moltbot config get|set|unset` for non-interactive edits.Related:

- Gateway configuration reference: [Configuration](https://docs.molt.bot/gateway/configuration)
- Config CLI: [Config](https://docs.molt.bot/cli/config)

Notes:

- Choosing where the Gateway runs always updates `gateway.mode`. You can select “Continue” without other sections if that is all you need.
- Channel-oriented services (Slack/Discord/Matrix/Microsoft Teams) prompt for channel/room allowlists during setup. You can enter names or IDs; the wizard resolves names to IDs when possible.

## [​](https://docs.molt.bot/cli/configure\#examples)  Examples

Copy

```
moltbot configure
moltbot configure --section models --section channels
```

[Onboard](https://docs.molt.bot/cli/onboard) [Doctor](https://docs.molt.bot/cli/doctor)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.