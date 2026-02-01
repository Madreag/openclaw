---
source: https://docs.molt.bot/channels/location
title: Location - Moltbot
---

[Skip to main content](https://docs.molt.bot/channels/location#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Channel location parsing](https://docs.molt.bot/channels/location#channel-location-parsing)
- [Text formatting](https://docs.molt.bot/channels/location#text-formatting)
- [Context fields](https://docs.molt.bot/channels/location#context-fields)
- [Channel notes](https://docs.molt.bot/channels/location#channel-notes)

# [​](https://docs.molt.bot/channels/location\#channel-location-parsing)  Channel location parsing

Moltbot normalizes shared locations from chat channels into:

- human-readable text appended to the inbound body, and
- structured fields in the auto-reply context payload.

Currently supported:

- **Telegram** (location pins + venues + live locations)
- **WhatsApp** (locationMessage + liveLocationMessage)
- **Matrix** (`m.location` with `geo_uri`)

## [​](https://docs.molt.bot/channels/location\#text-formatting)  Text formatting

Locations are rendered as friendly lines without brackets:

- Pin:
  - `📍 48.858844, 2.294351 ±12m`
- Named place:
  - `📍 Eiffel Tower — Champ de Mars, Paris (48.858844, 2.294351 ±12m)`
- Live share:
  - `🛰 Live location: 48.858844, 2.294351 ±12m`

If the channel includes a caption/comment, it is appended on the next line:

Copy

```
📍 48.858844, 2.294351 ±12m
Meet here
```

## [​](https://docs.molt.bot/channels/location\#context-fields)  Context fields

When a location is present, these fields are added to `ctx`:

- `LocationLat` (number)
- `LocationLon` (number)
- `LocationAccuracy` (number, meters; optional)
- `LocationName` (string; optional)
- `LocationAddress` (string; optional)
- `LocationSource` (`pin | place | live`)
- `LocationIsLive` (boolean)

## [​](https://docs.molt.bot/channels/location\#channel-notes)  Channel notes

- **Telegram**: venues map to `LocationName/LocationAddress`; live locations use `live_period`.
- **WhatsApp**: `locationMessage.comment` and `liveLocationMessage.caption` are appended as the caption line.
- **Matrix**: `geo_uri` is parsed as a pin location; altitude is ignored and `LocationIsLive` is always false.

[Troubleshooting](https://docs.molt.bot/channels/troubleshooting) [Providers](https://docs.molt.bot/providers)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.