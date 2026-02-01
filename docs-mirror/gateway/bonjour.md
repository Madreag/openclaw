---
source: https://docs.molt.bot/gateway/bonjour
title: Bonjour - Moltbot
---

[Skip to main content](https://docs.molt.bot/gateway/bonjour#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Bonjour / mDNS discovery](https://docs.molt.bot/gateway/bonjour#bonjour-%2F-mdns-discovery)
- [Wide‑area Bonjour (Unicast DNS‑SD) over Tailscale](https://docs.molt.bot/gateway/bonjour#wide%E2%80%91area-bonjour-unicast-dns%E2%80%91sd-over-tailscale)
- [Gateway config (recommended)](https://docs.molt.bot/gateway/bonjour#gateway-config-recommended)
- [One‑time DNS server setup (gateway host)](https://docs.molt.bot/gateway/bonjour#one%E2%80%91time-dns-server-setup-gateway-host)
- [Tailscale DNS settings](https://docs.molt.bot/gateway/bonjour#tailscale-dns-settings)
- [Gateway listener security (recommended)](https://docs.molt.bot/gateway/bonjour#gateway-listener-security-recommended)
- [What advertises](https://docs.molt.bot/gateway/bonjour#what-advertises)
- [Service types](https://docs.molt.bot/gateway/bonjour#service-types)
- [TXT keys (non‑secret hints)](https://docs.molt.bot/gateway/bonjour#txt-keys-non%E2%80%91secret-hints)
- [Debugging on macOS](https://docs.molt.bot/gateway/bonjour#debugging-on-macos)
- [Debugging in Gateway logs](https://docs.molt.bot/gateway/bonjour#debugging-in-gateway-logs)
- [Debugging on iOS node](https://docs.molt.bot/gateway/bonjour#debugging-on-ios-node)
- [Common failure modes](https://docs.molt.bot/gateway/bonjour#common-failure-modes)
- [Escaped instance names (\\032)](https://docs.molt.bot/gateway/bonjour#escaped-instance-names-%5C032)
- [Disabling / configuration](https://docs.molt.bot/gateway/bonjour#disabling-%2F-configuration)
- [Related docs](https://docs.molt.bot/gateway/bonjour#related-docs)

# [​](https://docs.molt.bot/gateway/bonjour\#bonjour-/-mdns-discovery)  Bonjour / mDNS discovery

Moltbot uses Bonjour (mDNS / DNS‑SD) as a **LAN‑only convenience** to discover
an active Gateway (WebSocket endpoint). It is best‑effort and does **not** replace SSH or
Tailnet-based connectivity.

## [​](https://docs.molt.bot/gateway/bonjour\#wide%E2%80%91area-bonjour-unicast-dns%E2%80%91sd-over-tailscale)  Wide‑area Bonjour (Unicast DNS‑SD) over Tailscale

If the node and gateway are on different networks, multicast mDNS won’t cross the
boundary. You can keep the same discovery UX by switching to **unicast DNS‑SD**
(“Wide‑Area Bonjour”) over Tailscale.High‑level steps:

1. Run a DNS server on the gateway host (reachable over Tailnet).
2. Publish DNS‑SD records for `_moltbot-gw._tcp` under a dedicated zone
(example: `moltbot.internal.`).
3. Configure Tailscale **split DNS** so `moltbot.internal` resolves via that
DNS server for clients (including iOS).

Moltbot standardizes on `moltbot.internal.` for this mode. iOS/Android nodes
browse both `local.` and `moltbot.internal.` automatically.

### [​](https://docs.molt.bot/gateway/bonjour\#gateway-config-recommended)  Gateway config (recommended)

Copy

```
{
  gateway: { bind: "tailnet" }, // tailnet-only (recommended)
  discovery: { wideArea: { enabled: true } } // enables moltbot.internal DNS-SD publishing
}
```

### [​](https://docs.molt.bot/gateway/bonjour\#one%E2%80%91time-dns-server-setup-gateway-host)  One‑time DNS server setup (gateway host)

Copy

```
moltbot dns setup --apply
```

This installs CoreDNS and configures it to:

- listen on port 53 only on the gateway’s Tailscale interfaces
- serve `moltbot.internal.` from `~/.clawdbot/dns/moltbot.internal.db`

Validate from a tailnet‑connected machine:

Copy

```
dns-sd -B _moltbot-gw._tcp moltbot.internal.
dig @<TAILNET_IPV4> -p 53 _moltbot-gw._tcp.clawdbot.internal PTR +short
```

### [​](https://docs.molt.bot/gateway/bonjour\#tailscale-dns-settings)  Tailscale DNS settings

In the Tailscale admin console:

- Add a nameserver pointing at the gateway’s tailnet IP (UDP/TCP 53).
- Add split DNS so the domain `moltbot.internal` uses that nameserver.

Once clients accept tailnet DNS, iOS nodes can browse
`_moltbot-gw._tcp` in `moltbot.internal.` without multicast.

### [​](https://docs.molt.bot/gateway/bonjour\#gateway-listener-security-recommended)  Gateway listener security (recommended)

The Gateway WS port (default `18789`) binds to loopback by default. For LAN/tailnet
access, bind explicitly and keep auth enabled.For tailnet‑only setups:

- Set `gateway.bind: "tailnet"` in `~/.clawdbot/moltbot.json`.
- Restart the Gateway (or restart the macOS menubar app).

## [​](https://docs.molt.bot/gateway/bonjour\#what-advertises)  What advertises

Only the Gateway advertises `_moltbot-gw._tcp`.

## [​](https://docs.molt.bot/gateway/bonjour\#service-types)  Service types

- `_moltbot-gw._tcp` — gateway transport beacon (used by macOS/iOS/Android nodes).

## [​](https://docs.molt.bot/gateway/bonjour\#txt-keys-non%E2%80%91secret-hints)  TXT keys (non‑secret hints)

The Gateway advertises small non‑secret hints to make UI flows convenient:

- `role=gateway`
- `displayName=<friendly name>`
- `lanHost=<hostname>.local`
- `gatewayPort=<port>` (Gateway WS + HTTP)
- `gatewayTls=1` (only when TLS is enabled)
- `gatewayTlsSha256=<sha256>` (only when TLS is enabled and fingerprint is available)
- `canvasPort=<port>` (only when the canvas host is enabled; default `18793`)
- `sshPort=<port>` (defaults to 22 when not overridden)
- `transport=gateway`
- `cliPath=<path>` (optional; absolute path to a runnable `moltbot` entrypoint)
- `tailnetDns=<magicdns>` (optional hint when Tailnet is available)

## [​](https://docs.molt.bot/gateway/bonjour\#debugging-on-macos)  Debugging on macOS

Useful built‑in tools:

- Browse instances:







Copy











```
dns-sd -B _moltbot-gw._tcp local.
```

- Resolve one instance (replace `<instance>`):







Copy











```
dns-sd -L "<instance>" _moltbot-gw._tcp local.
```


If browsing works but resolving fails, you’re usually hitting a LAN policy or
mDNS resolver issue.

## [​](https://docs.molt.bot/gateway/bonjour\#debugging-in-gateway-logs)  Debugging in Gateway logs

The Gateway writes a rolling log file (printed on startup as
`gateway log file: ...`). Look for `bonjour:` lines, especially:

- `bonjour: advertise failed ...`
- `bonjour: ... name conflict resolved` / `hostname conflict resolved`
- `bonjour: watchdog detected non-announced service ...`

## [​](https://docs.molt.bot/gateway/bonjour\#debugging-on-ios-node)  Debugging on iOS node

The iOS node uses `NWBrowser` to discover `_moltbot-gw._tcp`.To capture logs:

- Settings → Gateway → Advanced → **Discovery Debug Logs**
- Settings → Gateway → Advanced → **Discovery Logs** → reproduce → **Copy**

The log includes browser state transitions and result‑set changes.

## [​](https://docs.molt.bot/gateway/bonjour\#common-failure-modes)  Common failure modes

- **Bonjour doesn’t cross networks**: use Tailnet or SSH.
- **Multicast blocked**: some Wi‑Fi networks disable mDNS.
- **Sleep / interface churn**: macOS may temporarily drop mDNS results; retry.
- **Browse works but resolve fails**: keep machine names simple (avoid emojis or
punctuation), then restart the Gateway. The service instance name derives from
the host name, so overly complex names can confuse some resolvers.

## [​](https://docs.molt.bot/gateway/bonjour\#escaped-instance-names-\032)  Escaped instance names (`\032`)

Bonjour/DNS‑SD often escapes bytes in service instance names as decimal `\DDD`
sequences (e.g. spaces become `\032`).

- This is normal at the protocol level.
- UIs should decode for display (iOS uses `BonjourEscapes.decode`).

## [​](https://docs.molt.bot/gateway/bonjour\#disabling-/-configuration)  Disabling / configuration

- `CLAWDBOT_DISABLE_BONJOUR=1` disables advertising.
- `gateway.bind` in `~/.clawdbot/moltbot.json` controls the Gateway bind mode.
- `CLAWDBOT_SSH_PORT` overrides the SSH port advertised in TXT.
- `CLAWDBOT_TAILNET_DNS` publishes a MagicDNS hint in TXT.
- `CLAWDBOT_CLI_PATH` overrides the advertised CLI path.

## [​](https://docs.molt.bot/gateway/bonjour\#related-docs)  Related docs

- Discovery policy and transport selection: [Discovery](https://docs.molt.bot/gateway/discovery)
- Node pairing + approvals: [Gateway pairing](https://docs.molt.bot/gateway/pairing)

[Discovery](https://docs.molt.bot/gateway/discovery) [Tailscale](https://docs.molt.bot/gateway/tailscale)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.