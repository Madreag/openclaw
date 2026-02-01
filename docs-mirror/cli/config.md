---
source: https://docs.molt.bot/cli/config
title: Config - Moltbot
---

[Skip to main content](https://docs.molt.bot/cli/config#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [moltbot config](https://docs.molt.bot/cli/config#moltbot-config)
- [Examples](https://docs.molt.bot/cli/config#examples)
- [Paths](https://docs.molt.bot/cli/config#paths)
- [Values](https://docs.molt.bot/cli/config#values)

# [​](https://docs.molt.bot/cli/config\#moltbot-config)  `moltbot config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `moltbot configure`).

## [​](https://docs.molt.bot/cli/config\#examples)  Examples

Copy

```
moltbot config get browser.executablePath
moltbot config set browser.executablePath "/usr/bin/google-chrome"
moltbot config set agents.defaults.heartbeat.every "2h"
moltbot config set agents.list[0].tools.exec.node "node-id-or-name"
moltbot config unset tools.web.search.apiKey
```

## [​](https://docs.molt.bot/cli/config\#paths)  Paths

Paths use dot or bracket notation:

Copy

```
moltbot config get agents.defaults.workspace
moltbot config get agents.list[0].id
```

Use the agent list index to target a specific agent:

Copy

```
moltbot config get agents.list
moltbot config set agents.list[1].tools.exec.node "node-id-or-name"
```

## [​](https://docs.molt.bot/cli/config\#values)  Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--json` to require JSON5 parsing.

Copy

```
moltbot config set agents.defaults.heartbeat.every "0m"
moltbot config set gateway.port 19001 --json
moltbot config set channels.whatsapp.groups '["*"]' --json
```

Restart the gateway after edits.

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.