---
source: https://docs.molt.bot/cli/devices
title: Devices - Moltbot
---

[Skip to main content](https://docs.molt.bot/cli/devices#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [moltbot devices](https://docs.molt.bot/cli/devices#moltbot-devices)
- [Commands](https://docs.molt.bot/cli/devices#commands)
- [moltbot devices list](https://docs.molt.bot/cli/devices#moltbot-devices-list)
- [moltbot devices approve <requestId>](https://docs.molt.bot/cli/devices#moltbot-devices-approve-%3Crequestid%3E)
- [moltbot devices reject <requestId>](https://docs.molt.bot/cli/devices#moltbot-devices-reject-%3Crequestid%3E)
- [moltbot devices rotate --device <id> --role <role> \[--scope <scope...>\]](https://docs.molt.bot/cli/devices#moltbot-devices-rotate-device-%3Cid%3E-role-%3Crole%3E-%5B-scope-%3Cscope-%3E%5D)
- [moltbot devices revoke --device <id> --role <role>](https://docs.molt.bot/cli/devices#moltbot-devices-revoke-device-%3Cid%3E-role-%3Crole%3E)
- [Common options](https://docs.molt.bot/cli/devices#common-options)
- [Notes](https://docs.molt.bot/cli/devices#notes)

# [​](https://docs.molt.bot/cli/devices\#moltbot-devices)  `moltbot devices`

Manage device pairing requests and device-scoped tokens.

## [​](https://docs.molt.bot/cli/devices\#commands)  Commands

### [​](https://docs.molt.bot/cli/devices\#moltbot-devices-list)  `moltbot devices list`

List pending pairing requests and paired devices.

Copy

```
moltbot devices list
moltbot devices list --json
```

### [​](https://docs.molt.bot/cli/devices\#moltbot-devices-approve-%3Crequestid%3E)  `moltbot devices approve <requestId>`

Approve a pending device pairing request.

Copy

```
moltbot devices approve <requestId>
```

### [​](https://docs.molt.bot/cli/devices\#moltbot-devices-reject-%3Crequestid%3E)  `moltbot devices reject <requestId>`

Reject a pending device pairing request.

Copy

```
moltbot devices reject <requestId>
```

### [​](https://docs.molt.bot/cli/devices\#moltbot-devices-rotate-device-%3Cid%3E-role-%3Crole%3E-[-scope-%3Cscope-%3E])  `moltbot devices rotate --device <id> --role <role> [--scope <scope...>]`

Rotate a device token for a specific role (optionally updating scopes).

Copy

```
moltbot devices rotate --device <deviceId> --role operator --scope operator.read --scope operator.write
```

### [​](https://docs.molt.bot/cli/devices\#moltbot-devices-revoke-device-%3Cid%3E-role-%3Crole%3E)  `moltbot devices revoke --device <id> --role <role>`

Revoke a device token for a specific role.

Copy

```
moltbot devices revoke --device <deviceId> --role node
```

## [​](https://docs.molt.bot/cli/devices\#common-options)  Common options

- `--url <url>`: Gateway WebSocket URL (defaults to `gateway.remote.url` when configured).
- `--token <token>`: Gateway token (if required).
- `--password <password>`: Gateway password (password auth).
- `--timeout <ms>`: RPC timeout.
- `--json`: JSON output (recommended for scripting).

## [​](https://docs.molt.bot/cli/devices\#notes)  Notes

- Token rotation returns a new token (sensitive). Treat it like a secret.
- These commands require `operator.pairing` (or `operator.admin`) scope.

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.