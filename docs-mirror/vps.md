---
source: https://docs.molt.bot/vps
title: Vps - Moltbot
---

[Skip to main content](https://docs.molt.bot/vps#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [VPS hosting](https://docs.molt.bot/vps#vps-hosting)
- [Pick a provider](https://docs.molt.bot/vps#pick-a-provider)
- [How cloud setups work](https://docs.molt.bot/vps#how-cloud-setups-work)
- [Using nodes with a VPS](https://docs.molt.bot/vps#using-nodes-with-a-vps)

# [​](https://docs.molt.bot/vps\#vps-hosting)  VPS hosting

This hub links to the supported VPS/hosting guides and explains how cloud
deployments work at a high level.

## [​](https://docs.molt.bot/vps\#pick-a-provider)  Pick a provider

- **Railway** (one‑click + browser setup): [Railway](https://docs.molt.bot/railway)
- **Northflank** (one‑click + browser setup): [Northflank](https://docs.molt.bot/northflank)
- **Oracle Cloud (Always Free)**: [Oracle](https://docs.molt.bot/platforms/oracle) — $0/month (Always Free, ARM; capacity/signup can be finicky)
- **Fly.io**: [Fly.io](https://docs.molt.bot/platforms/fly)
- **Hetzner (Docker)**: [Hetzner](https://docs.molt.bot/platforms/hetzner)
- **GCP (Compute Engine)**: [GCP](https://docs.molt.bot/platforms/gcp)
- **exe.dev** (VM + HTTPS proxy): [exe.dev](https://docs.molt.bot/platforms/exe-dev)
- **AWS (EC2/Lightsail/free tier)**: works well too. Video guide:
[https://x.com/techfrenAJ/status/2014934471095812547](https://x.com/techfrenAJ/status/2014934471095812547)

## [​](https://docs.molt.bot/vps\#how-cloud-setups-work)  How cloud setups work

- The **Gateway runs on the VPS** and owns state + workspace.
- You connect from your laptop/phone via the **Control UI** or **Tailscale/SSH**.
- Treat the VPS as the source of truth and **back up** the state + workspace.
- Secure default: keep the Gateway on loopback and access it via SSH tunnel or Tailscale Serve.
If you bind to `lan`/`tailnet`, require `gateway.auth.token` or `gateway.auth.password`.

Remote access: [Gateway remote](https://docs.molt.bot/gateway/remote)

Platforms hub: [Platforms](https://docs.molt.bot/platforms)

## [​](https://docs.molt.bot/vps\#using-nodes-with-a-vps)  Using nodes with a VPS

You can keep the Gateway in the cloud and pair **nodes** on your local devices
(Mac/iOS/Android/headless). Nodes provide local screen/camera/canvas and `system.run`
capabilities while the Gateway stays in the cloud.Docs: [Nodes](https://docs.molt.bot/nodes), [Nodes CLI](https://docs.molt.bot/cli/nodes)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.