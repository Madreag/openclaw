---
source: https://docs.molt.bot/channels
title: Index - Moltbot
---

[Skip to main content](https://docs.molt.bot/channels#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Chat Channels](https://docs.molt.bot/channels#chat-channels)
- [Supported channels](https://docs.molt.bot/channels#supported-channels)
- [Notes](https://docs.molt.bot/channels#notes)

# [​](https://docs.molt.bot/channels\#chat-channels)  Chat Channels

Moltbot can talk to you on any chat app you already use. Each channel connects via the Gateway.
Text is supported everywhere; media and reactions vary by channel.

## [​](https://docs.molt.bot/channels\#supported-channels)  Supported channels

- [WhatsApp](https://docs.molt.bot/channels/whatsapp) — Most popular; uses Baileys and requires QR pairing.
- [Telegram](https://docs.molt.bot/channels/telegram) — Bot API via grammY; supports groups.
- [Discord](https://docs.molt.bot/channels/discord) — Discord Bot API + Gateway; supports servers, channels, and DMs.
- [Slack](https://docs.molt.bot/channels/slack) — Bolt SDK; workspace apps.
- [Google Chat](https://docs.molt.bot/channels/googlechat) — Google Chat API app via HTTP webhook.
- [Mattermost](https://docs.molt.bot/channels/mattermost) — Bot API + WebSocket; channels, groups, DMs (plugin, installed separately).
- [Signal](https://docs.molt.bot/channels/signal) — signal-cli; privacy-focused.
- [BlueBubbles](https://docs.molt.bot/channels/bluebubbles) — **Recommended for iMessage**; uses the BlueBubbles macOS server REST API with full feature support (edit, unsend, effects, reactions, group management — edit currently broken on macOS 26 Tahoe).
- [iMessage](https://docs.molt.bot/channels/imessage) — macOS only; native integration via imsg (legacy, consider BlueBubbles for new setups).
- [Microsoft Teams](https://docs.molt.bot/channels/msteams) — Bot Framework; enterprise support (plugin, installed separately).
- [LINE](https://docs.molt.bot/channels/line) — LINE Messaging API bot (plugin, installed separately).
- [Nextcloud Talk](https://docs.molt.bot/channels/nextcloud-talk) — Self-hosted chat via Nextcloud Talk (plugin, installed separately).
- [Matrix](https://docs.molt.bot/channels/matrix) — Matrix protocol (plugin, installed separately).
- [Nostr](https://docs.molt.bot/channels/nostr) — Decentralized DMs via NIP-04 (plugin, installed separately).
- [Tlon](https://docs.molt.bot/channels/tlon) — Urbit-based messenger (plugin, installed separately).
- [Twitch](https://docs.molt.bot/channels/twitch) — Twitch chat via IRC connection (plugin, installed separately).
- [Zalo](https://docs.molt.bot/channels/zalo) — Zalo Bot API; Vietnam’s popular messenger (plugin, installed separately).
- [Zalo Personal](https://docs.molt.bot/channels/zalouser) — Zalo personal account via QR login (plugin, installed separately).
- [WebChat](https://docs.molt.bot/web/webchat) — Gateway WebChat UI over WebSocket.

## [​](https://docs.molt.bot/channels\#notes)  Notes

- Channels can run simultaneously; configure multiple and Moltbot will route per chat.
- Fastest setup is usually **Telegram** (simple bot token). WhatsApp requires QR pairing and
stores more state on disk.
- Group behavior varies by channel; see [Groups](https://docs.molt.bot/concepts/groups).
- DM pairing and allowlists are enforced for safety; see [Security](https://docs.molt.bot/gateway/security).
- Telegram internals: [grammY notes](https://docs.molt.bot/channels/grammy).
- Troubleshooting: [Channel troubleshooting](https://docs.molt.bot/channels/troubleshooting).
- Model providers are documented separately; see [Model Providers](https://docs.molt.bot/providers/models).

[Tui](https://docs.molt.bot/tui) [Whatsapp](https://docs.molt.bot/channels/whatsapp)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.