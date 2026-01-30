---
source: https://docs.molt.bot/channels/tlon
title: Tlon - Moltbot
---

[Skip to main content](https://docs.molt.bot/channels/tlon#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Tlon (plugin)](https://docs.molt.bot/channels/tlon#tlon-plugin)
- [Plugin required](https://docs.molt.bot/channels/tlon#plugin-required)
- [Setup](https://docs.molt.bot/channels/tlon#setup)
- [Group channels](https://docs.molt.bot/channels/tlon#group-channels)
- [Access control](https://docs.molt.bot/channels/tlon#access-control)
- [Delivery targets (CLI/cron)](https://docs.molt.bot/channels/tlon#delivery-targets-cli%2Fcron)
- [Notes](https://docs.molt.bot/channels/tlon#notes)

# [​](https://docs.molt.bot/channels/tlon\#tlon-plugin)  Tlon (plugin)

Tlon is a decentralized messenger built on Urbit. Moltbot connects to your Urbit ship and can
respond to DMs and group chat messages. Group replies require an @ mention by default and can
be further restricted via allowlists.Status: supported via plugin. DMs, group mentions, thread replies, and text-only media fallback
(URL appended to caption). Reactions, polls, and native media uploads are not supported.

## [​](https://docs.molt.bot/channels/tlon\#plugin-required)  Plugin required

Tlon ships as a plugin and is not bundled with the core install.Install via CLI (npm registry):

Copy

```
moltbot plugins install @moltbot/tlon
```

Local checkout (when running from a git repo):

Copy

```
moltbot plugins install ./extensions/tlon
```

Details: [Plugins](https://docs.molt.bot/plugin)

## [​](https://docs.molt.bot/channels/tlon\#setup)  Setup

1. Install the Tlon plugin.
2. Gather your ship URL and login code.
3. Configure `channels.tlon`.
4. Restart the gateway.
5. DM the bot or mention it in a group channel.

Minimal config (single account):

Copy

```
{
  channels: {
    tlon: {
      enabled: true,
      ship: "~sampel-palnet",
      url: "https://your-ship-host",
      code: "lidlut-tabwed-pillex-ridrup"
    }
  }
}
```

## [​](https://docs.molt.bot/channels/tlon\#group-channels)  Group channels

Auto-discovery is enabled by default. You can also pin channels manually:

Copy

```
{
  channels: {
    tlon: {
      groupChannels: [\
        "chat/~host-ship/general",\
        "chat/~host-ship/support"\
      ]
    }
  }
}
```

Disable auto-discovery:

Copy

```
{
  channels: {
    tlon: {
      autoDiscoverChannels: false
    }
  }
}
```

## [​](https://docs.molt.bot/channels/tlon\#access-control)  Access control

DM allowlist (empty = allow all):

Copy

```
{
  channels: {
    tlon: {
      dmAllowlist: ["~zod", "~nec"]
    }
  }
}
```

Group authorization (restricted by default):

Copy

```
{
  channels: {
    tlon: {
      defaultAuthorizedShips: ["~zod"],
      authorization: {
        channelRules: {
          "chat/~host-ship/general": {
            mode: "restricted",
            allowedShips: ["~zod", "~nec"]
          },
          "chat/~host-ship/announcements": {
            mode: "open"
          }
        }
      }
    }
  }
}
```

## [​](https://docs.molt.bot/channels/tlon\#delivery-targets-cli/cron)  Delivery targets (CLI/cron)

Use these with `moltbot message send` or cron delivery:

- DM: `~sampel-palnet` or `dm/~sampel-palnet`
- Group: `chat/~host-ship/channel` or `group:~host-ship/channel`

## [​](https://docs.molt.bot/channels/tlon\#notes)  Notes

- Group replies require a mention (e.g. `~your-bot-ship`) to respond.
- Thread replies: if the inbound message is in a thread, Moltbot replies in-thread.
- Media: `sendMedia` falls back to text + URL (no native upload).

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.