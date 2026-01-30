---
source: https://docs.molt.bot/cli/channels
title: Channels - Moltbot
---

[Skip to main content](https://docs.molt.bot/cli/channels#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [moltbot channels](https://docs.molt.bot/cli/channels#moltbot-channels)
- [Common commands](https://docs.molt.bot/cli/channels#common-commands)
- [Add / remove accounts](https://docs.molt.bot/cli/channels#add-%2F-remove-accounts)
- [Login / logout (interactive)](https://docs.molt.bot/cli/channels#login-%2F-logout-interactive)
- [Troubleshooting](https://docs.molt.bot/cli/channels#troubleshooting)
- [Capabilities probe](https://docs.molt.bot/cli/channels#capabilities-probe)
- [Resolve names to IDs](https://docs.molt.bot/cli/channels#resolve-names-to-ids)

# [​](https://docs.molt.bot/cli/channels\#moltbot-channels)  `moltbot channels`

Manage chat channel accounts and their runtime status on the Gateway.Related docs:

- Channel guides: [Channels](https://docs.molt.bot/channels/index)
- Gateway configuration: [Configuration](https://docs.molt.bot/gateway/configuration)

## [​](https://docs.molt.bot/cli/channels\#common-commands)  Common commands

Copy

```
moltbot channels list
moltbot channels status
moltbot channels capabilities
moltbot channels capabilities --channel discord --target channel:123
moltbot channels resolve --channel slack "#general" "@jane"
moltbot channels logs --channel all
```

## [​](https://docs.molt.bot/cli/channels\#add-/-remove-accounts)  Add / remove accounts

Copy

```
moltbot channels add --channel telegram --token <bot-token>
moltbot channels remove --channel telegram --delete
```

Tip: `moltbot channels add --help` shows per-channel flags (token, app token, signal-cli paths, etc).

## [​](https://docs.molt.bot/cli/channels\#login-/-logout-interactive)  Login / logout (interactive)

Copy

```
moltbot channels login --channel whatsapp
moltbot channels logout --channel whatsapp
```

## [​](https://docs.molt.bot/cli/channels\#troubleshooting)  Troubleshooting

- Run `moltbot status --deep` for a broad probe.
- Use `moltbot doctor` for guided fixes.
- `moltbot channels list` prints `Claude: HTTP 403 ... user:profile` → usage snapshot needs the `user:profile` scope. Use `--no-usage`, or provide a claude.ai session key (`CLAUDE_WEB_SESSION_KEY` / `CLAUDE_WEB_COOKIE`), or re-auth via Claude Code CLI.

## [​](https://docs.molt.bot/cli/channels\#capabilities-probe)  Capabilities probe

Fetch provider capability hints (intents/scopes where available) plus static feature support:

Copy

```
moltbot channels capabilities
moltbot channels capabilities --channel discord --target channel:123
```

Notes:

- `--channel` is optional; omit it to list every channel (including extensions).
- `--target` accepts `channel:<id>` or a raw numeric channel id and only applies to Discord.
- Probes are provider-specific: Discord intents + optional channel permissions; Slack bot + user scopes; Telegram bot flags + webhook; Signal daemon version; MS Teams app token + Graph roles/scopes (annotated where known). Channels without probes report `Probe: unavailable`.

## [​](https://docs.molt.bot/cli/channels\#resolve-names-to-ids)  Resolve names to IDs

Resolve channel/user names to IDs using the provider directory:

Copy

```
moltbot channels resolve --channel slack "#general" "@jane"
moltbot channels resolve --channel discord "My Server/#support" "@someone"
moltbot channels resolve --channel matrix "Project Room"
```

Notes:

- Use `--kind user|group|auto` to force the target type.
- Resolution prefers active matches when multiple entries share the same name.

[Sessions](https://docs.molt.bot/cli/sessions) [Directory](https://docs.molt.bot/cli/directory)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.