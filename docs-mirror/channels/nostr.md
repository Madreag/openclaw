---
source: https://docs.molt.bot/channels/nostr
title: Nostr - Moltbot
---

[Skip to main content](https://docs.molt.bot/channels/nostr#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Nostr](https://docs.molt.bot/channels/nostr#nostr)
- [Install (on demand)](https://docs.molt.bot/channels/nostr#install-on-demand)
- [Onboarding (recommended)](https://docs.molt.bot/channels/nostr#onboarding-recommended)
- [Manual install](https://docs.molt.bot/channels/nostr#manual-install)
- [Quick setup](https://docs.molt.bot/channels/nostr#quick-setup)
- [Configuration reference](https://docs.molt.bot/channels/nostr#configuration-reference)
- [Profile metadata](https://docs.molt.bot/channels/nostr#profile-metadata)
- [Access control](https://docs.molt.bot/channels/nostr#access-control)
- [DM policies](https://docs.molt.bot/channels/nostr#dm-policies)
- [Allowlist example](https://docs.molt.bot/channels/nostr#allowlist-example)
- [Key formats](https://docs.molt.bot/channels/nostr#key-formats)
- [Relays](https://docs.molt.bot/channels/nostr#relays)
- [Protocol support](https://docs.molt.bot/channels/nostr#protocol-support)
- [Testing](https://docs.molt.bot/channels/nostr#testing)
- [Local relay](https://docs.molt.bot/channels/nostr#local-relay)
- [Manual test](https://docs.molt.bot/channels/nostr#manual-test)
- [Troubleshooting](https://docs.molt.bot/channels/nostr#troubleshooting)
- [Not receiving messages](https://docs.molt.bot/channels/nostr#not-receiving-messages)
- [Not sending responses](https://docs.molt.bot/channels/nostr#not-sending-responses)
- [Duplicate responses](https://docs.molt.bot/channels/nostr#duplicate-responses)
- [Security](https://docs.molt.bot/channels/nostr#security)
- [Limitations (MVP)](https://docs.molt.bot/channels/nostr#limitations-mvp)

# [​](https://docs.molt.bot/channels/nostr\#nostr)  Nostr

**Status:** Optional plugin (disabled by default).Nostr is a decentralized protocol for social networking. This channel enables Moltbot to receive and respond to encrypted direct messages (DMs) via NIP-04.

## [​](https://docs.molt.bot/channels/nostr\#install-on-demand)  Install (on demand)

### [​](https://docs.molt.bot/channels/nostr\#onboarding-recommended)  Onboarding (recommended)

- The onboarding wizard (`moltbot onboard`) and `moltbot channels add` list optional channel plugins.
- Selecting Nostr prompts you to install the plugin on demand.

Install defaults:

- **Dev channel + git checkout available:** uses the local plugin path.
- **Stable/Beta:** downloads from npm.

You can always override the choice in the prompt.

### [​](https://docs.molt.bot/channels/nostr\#manual-install)  Manual install

Copy

```
moltbot plugins install @moltbot/nostr
```

Use a local checkout (dev workflows):

Copy

```
moltbot plugins install --link <path-to-moltbot>/extensions/nostr
```

Restart the Gateway after installing or enabling plugins.

## [​](https://docs.molt.bot/channels/nostr\#quick-setup)  Quick setup

1. Generate a Nostr keypair (if needed):

Copy

```
# Using nak
nak key generate
```

2. Add to config:

Copy

```
{
  "channels": {
    "nostr": {
      "privateKey": "${NOSTR_PRIVATE_KEY}"
    }
  }
}
```

3. Export the key:

Copy

```
export NOSTR_PRIVATE_KEY="nsec1..."
```

4. Restart the Gateway.

## [​](https://docs.molt.bot/channels/nostr\#configuration-reference)  Configuration reference

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `privateKey` | string | required | Private key in `nsec` or hex format |
| `relays` | string\[\] | `['wss://relay.damus.io', 'wss://nos.lol']` | Relay URLs (WebSocket) |
| `dmPolicy` | string | `pairing` | DM access policy |
| `allowFrom` | string\[\] | `[]` | Allowed sender pubkeys |
| `enabled` | boolean | `true` | Enable/disable channel |
| `name` | string | - | Display name |
| `profile` | object | - | NIP-01 profile metadata |

## [​](https://docs.molt.bot/channels/nostr\#profile-metadata)  Profile metadata

Profile data is published as a NIP-01 `kind:0` event. You can manage it from the Control UI (Channels -> Nostr -> Profile) or set it directly in config.Example:

Copy

```
{
  "channels": {
    "nostr": {
      "privateKey": "${NOSTR_PRIVATE_KEY}",
      "profile": {
        "name": "moltbot",
        "displayName": "Moltbot",
        "about": "Personal assistant DM bot",
        "picture": "https://example.com/avatar.png",
        "banner": "https://example.com/banner.png",
        "website": "https://example.com",
        "nip05": "moltbot@example.com",
        "lud16": "moltbot@example.com"
      }
    }
  }
}
```

Notes:

- Profile URLs must use `https://`.
- Importing from relays merges fields and preserves local overrides.

## [​](https://docs.molt.bot/channels/nostr\#access-control)  Access control

### [​](https://docs.molt.bot/channels/nostr\#dm-policies)  DM policies

- **pairing** (default): unknown senders get a pairing code.
- **allowlist**: only pubkeys in `allowFrom` can DM.
- **open**: public inbound DMs (requires `allowFrom: ["*"]`).
- **disabled**: ignore inbound DMs.

### [​](https://docs.molt.bot/channels/nostr\#allowlist-example)  Allowlist example

Copy

```
{
  "channels": {
    "nostr": {
      "privateKey": "${NOSTR_PRIVATE_KEY}",
      "dmPolicy": "allowlist",
      "allowFrom": ["npub1abc...", "npub1xyz..."]
    }
  }
}
```

## [​](https://docs.molt.bot/channels/nostr\#key-formats)  Key formats

Accepted formats:

- **Private key:**`nsec...` or 64-char hex
- **Pubkeys (`allowFrom`):**`npub...` or hex

## [​](https://docs.molt.bot/channels/nostr\#relays)  Relays

Defaults: `relay.damus.io` and `nos.lol`.

Copy

```
{
  "channels": {
    "nostr": {
      "privateKey": "${NOSTR_PRIVATE_KEY}",
      "relays": [\
        "wss://relay.damus.io",\
        "wss://relay.primal.net",\
        "wss://nostr.wine"\
      ]
    }
  }
}
```

Tips:

- Use 2-3 relays for redundancy.
- Avoid too many relays (latency, duplication).
- Paid relays can improve reliability.
- Local relays are fine for testing (`ws://localhost:7777`).

## [​](https://docs.molt.bot/channels/nostr\#protocol-support)  Protocol support

| NIP | Status | Description |
| --- | --- | --- |
| NIP-01 | Supported | Basic event format + profile metadata |
| NIP-04 | Supported | Encrypted DMs (`kind:4`) |
| NIP-17 | Planned | Gift-wrapped DMs |
| NIP-44 | Planned | Versioned encryption |

## [​](https://docs.molt.bot/channels/nostr\#testing)  Testing

### [​](https://docs.molt.bot/channels/nostr\#local-relay)  Local relay

Copy

```
# Start strfry
docker run -p 7777:7777 ghcr.io/hoytech/strfry
```

Copy

```
{
  "channels": {
    "nostr": {
      "privateKey": "${NOSTR_PRIVATE_KEY}",
      "relays": ["ws://localhost:7777"]
    }
  }
}
```

### [​](https://docs.molt.bot/channels/nostr\#manual-test)  Manual test

1. Note the bot pubkey (npub) from logs.
2. Open a Nostr client (Damus, Amethyst, etc.).
3. DM the bot pubkey.
4. Verify the response.

## [​](https://docs.molt.bot/channels/nostr\#troubleshooting)  Troubleshooting

### [​](https://docs.molt.bot/channels/nostr\#not-receiving-messages)  Not receiving messages

- Verify the private key is valid.
- Ensure relay URLs are reachable and use `wss://` (or `ws://` for local).
- Confirm `enabled` is not `false`.
- Check Gateway logs for relay connection errors.

### [​](https://docs.molt.bot/channels/nostr\#not-sending-responses)  Not sending responses

- Check relay accepts writes.
- Verify outbound connectivity.
- Watch for relay rate limits.

### [​](https://docs.molt.bot/channels/nostr\#duplicate-responses)  Duplicate responses

- Expected when using multiple relays.
- Messages are deduplicated by event ID; only the first delivery triggers a response.

## [​](https://docs.molt.bot/channels/nostr\#security)  Security

- Never commit private keys.
- Use environment variables for keys.
- Consider `allowlist` for production bots.

## [​](https://docs.molt.bot/channels/nostr\#limitations-mvp)  Limitations (MVP)

- Direct messages only (no group chats).
- No media attachments.
- NIP-04 only (NIP-17 gift-wrap planned).

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.