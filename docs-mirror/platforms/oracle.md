---
source: https://docs.molt.bot/platforms/oracle
title: Oracle - Moltbot
---

[Skip to main content](https://docs.molt.bot/platforms/oracle#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Moltbot on Oracle Cloud (OCI)](https://docs.molt.bot/platforms/oracle#moltbot-on-oracle-cloud-oci)
- [Goal](https://docs.molt.bot/platforms/oracle#goal)
- [Cost Comparison (2026)](https://docs.molt.bot/platforms/oracle#cost-comparison-2026)
- [Prerequisites](https://docs.molt.bot/platforms/oracle#prerequisites)
- [1) Create an OCI Instance](https://docs.molt.bot/platforms/oracle#1-create-an-oci-instance)
- [2) Connect and Update](https://docs.molt.bot/platforms/oracle#2-connect-and-update)
- [3) Configure User and Hostname](https://docs.molt.bot/platforms/oracle#3-configure-user-and-hostname)
- [4) Install Tailscale](https://docs.molt.bot/platforms/oracle#4-install-tailscale)
- [5) Install Moltbot](https://docs.molt.bot/platforms/oracle#5-install-moltbot)
- [6) Configure Gateway (loopback + token auth) and enable Tailscale Serve](https://docs.molt.bot/platforms/oracle#6-configure-gateway-loopback-%2B-token-auth-and-enable-tailscale-serve)
- [7) Verify](https://docs.molt.bot/platforms/oracle#7-verify)
- [8) Lock Down VCN Security](https://docs.molt.bot/platforms/oracle#8-lock-down-vcn-security)
- [Access the Control UI](https://docs.molt.bot/platforms/oracle#access-the-control-ui)
- [Security: VCN + Tailscale (recommended baseline)](https://docs.molt.bot/platforms/oracle#security%3A-vcn-%2B-tailscale-recommended-baseline)
- [What’s Already Protected](https://docs.molt.bot/platforms/oracle#what%E2%80%99s-already-protected)
- [Still Recommended](https://docs.molt.bot/platforms/oracle#still-recommended)
- [Verify Security Posture](https://docs.molt.bot/platforms/oracle#verify-security-posture)
- [Fallback: SSH Tunnel](https://docs.molt.bot/platforms/oracle#fallback%3A-ssh-tunnel)
- [Troubleshooting](https://docs.molt.bot/platforms/oracle#troubleshooting)
- [Instance creation fails (“Out of capacity”)](https://docs.molt.bot/platforms/oracle#instance-creation-fails-%E2%80%9Cout-of-capacity%E2%80%9D)
- [Tailscale won’t connect](https://docs.molt.bot/platforms/oracle#tailscale-won%E2%80%99t-connect)
- [Gateway won’t start](https://docs.molt.bot/platforms/oracle#gateway-won%E2%80%99t-start)
- [Can’t reach Control UI](https://docs.molt.bot/platforms/oracle#can%E2%80%99t-reach-control-ui)
- [ARM binary issues](https://docs.molt.bot/platforms/oracle#arm-binary-issues)
- [Persistence](https://docs.molt.bot/platforms/oracle#persistence)
- [See Also](https://docs.molt.bot/platforms/oracle#see-also)

# [​](https://docs.molt.bot/platforms/oracle\#moltbot-on-oracle-cloud-oci)  Moltbot on Oracle Cloud (OCI)

## [​](https://docs.molt.bot/platforms/oracle\#goal)  Goal

Run a persistent Moltbot Gateway on Oracle Cloud’s **Always Free** ARM tier.Oracle’s free tier can be a great fit for Moltbot (especially if you already have an OCI account), but it comes with tradeoffs:

- ARM architecture (most things work, but some binaries may be x86-only)
- Capacity and signup can be finicky

## [​](https://docs.molt.bot/platforms/oracle\#cost-comparison-2026)  Cost Comparison (2026)

| Provider | Plan | Specs | Price/mo | Notes |
| --- | --- | --- | --- | --- |
| Oracle Cloud | Always Free ARM | up to 4 OCPU, 24GB RAM | $0 | ARM, limited capacity |
| Hetzner | CX22 | 2 vCPU, 4GB RAM | ~ $4 | Cheapest paid option |
| DigitalOcean | Basic | 1 vCPU, 1GB RAM | $6 | Easy UI, good docs |
| Vultr | Cloud Compute | 1 vCPU, 1GB RAM | $6 | Many locations |
| Linode | Nanode | 1 vCPU, 1GB RAM | $5 | Now part of Akamai |

* * *

## [​](https://docs.molt.bot/platforms/oracle\#prerequisites)  Prerequisites

- Oracle Cloud account ( [signup](https://www.oracle.com/cloud/free/)) — see [community signup guide](https://gist.github.com/rssnyder/51e3cfedd730e7dd5f4a816143b25dbd) if you hit issues
- Tailscale account (free at [tailscale.com](https://tailscale.com/))
- ~30 minutes

## [​](https://docs.molt.bot/platforms/oracle\#1-create-an-oci-instance)  1) Create an OCI Instance

1. Log into [Oracle Cloud Console](https://cloud.oracle.com/)
2. Navigate to **Compute → Instances → Create Instance**
3. Configure:
   - **Name:**`moltbot`
   - **Image:** Ubuntu 24.04 (aarch64)
   - **Shape:**`VM.Standard.A1.Flex` (Ampere ARM)
   - **OCPUs:** 2 (or up to 4)
   - **Memory:** 12 GB (or up to 24 GB)
   - **Boot volume:** 50 GB (up to 200 GB free)
   - **SSH key:** Add your public key
4. Click **Create**
5. Note the public IP address

**Tip:** If instance creation fails with “Out of capacity”, try a different availability domain or retry later. Free tier capacity is limited.

## [​](https://docs.molt.bot/platforms/oracle\#2-connect-and-update)  2) Connect and Update

Copy

```
# Connect via public IP
ssh ubuntu@YOUR_PUBLIC_IP

# Update system
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential
```

**Note:**`build-essential` is required for ARM compilation of some dependencies.

## [​](https://docs.molt.bot/platforms/oracle\#3-configure-user-and-hostname)  3) Configure User and Hostname

Copy

```
# Set hostname
sudo hostnamectl set-hostname moltbot

# Set password for ubuntu user
sudo passwd ubuntu

# Enable lingering (keeps user services running after logout)
sudo loginctl enable-linger ubuntu
```

## [​](https://docs.molt.bot/platforms/oracle\#4-install-tailscale)  4) Install Tailscale

Copy

```
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --ssh --hostname=moltbot
```

This enables Tailscale SSH, so you can connect via `ssh moltbot` from any device on your tailnet — no public IP needed.Verify:

Copy

```
tailscale status
```

**From now on, connect via Tailscale:**`ssh ubuntu@moltbot` (or use the Tailscale IP).

## [​](https://docs.molt.bot/platforms/oracle\#5-install-moltbot)  5) Install Moltbot

Copy

```
curl -fsSL https://molt.bot/install.sh | bash
source ~/.bashrc
```

When prompted “How do you want to hatch your bot?”, select **“Do this later”**.

> Note: If you hit ARM-native build issues, start with system packages (e.g. `sudo apt install -y build-essential`) before reaching for Homebrew.

## [​](https://docs.molt.bot/platforms/oracle\#6-configure-gateway-loopback-+-token-auth-and-enable-tailscale-serve)  6) Configure Gateway (loopback + token auth) and enable Tailscale Serve

Use token auth as the default. It’s predictable and avoids needing any “insecure auth” Control UI flags.

Copy

```
# Keep the Gateway private on the VM
moltbot config set gateway.bind loopback

# Require auth for the Gateway + Control UI
moltbot config set gateway.auth.mode token
moltbot doctor --generate-gateway-token

# Expose over Tailscale Serve (HTTPS + tailnet access)
moltbot config set gateway.tailscale.mode serve
moltbot config set gateway.trustedProxies '["127.0.0.1"]'

systemctl --user restart moltbot-gateway
```

## [​](https://docs.molt.bot/platforms/oracle\#7-verify)  7) Verify

Copy

```
# Check version
moltbot --version

# Check daemon status
systemctl --user status moltbot-gateway

# Check Tailscale Serve
tailscale serve status

# Test local response
curl http://localhost:18789
```

## [​](https://docs.molt.bot/platforms/oracle\#8-lock-down-vcn-security)  8) Lock Down VCN Security

Now that everything is working, lock down the VCN to block all traffic except Tailscale. OCI’s Virtual Cloud Network acts as a firewall at the network edge — traffic is blocked before it reaches your instance.

1. Go to **Networking → Virtual Cloud Networks** in the OCI Console
2. Click your VCN → **Security Lists** → Default Security List
3. **Remove**all ingress rules except:

   - `0.0.0.0/0 UDP 41641` (Tailscale)
4. Keep default egress rules (allow all outbound)

This blocks SSH on port 22, HTTP, HTTPS, and everything else at the network edge. From now on, you can only connect via Tailscale.

* * *

## [​](https://docs.molt.bot/platforms/oracle\#access-the-control-ui)  Access the Control UI

From any device on your Tailscale network:

Copy

```
https://moltbot.<tailnet-name>.ts.net/
```

Replace `<tailnet-name>` with your tailnet name (visible in `tailscale status`).No SSH tunnel needed. Tailscale provides:

- HTTPS encryption (automatic certs)
- Authentication via Tailscale identity
- Access from any device on your tailnet (laptop, phone, etc.)

* * *

## [​](https://docs.molt.bot/platforms/oracle\#security:-vcn-+-tailscale-recommended-baseline)  Security: VCN + Tailscale (recommended baseline)

With the VCN locked down (only UDP 41641 open) and the Gateway bound to loopback, you get strong defense-in-depth: public traffic is blocked at the network edge, and admin access happens over your tailnet.This setup often removes the _need_ for extra host-based firewall rules purely to stop Internet-wide SSH brute force — but you should still keep the OS updated, run `moltbot security audit`, and verify you aren’t accidentally listening on public interfaces.

### [​](https://docs.molt.bot/platforms/oracle\#what%E2%80%99s-already-protected)  What’s Already Protected

| Traditional Step | Needed? | Why |
| --- | --- | --- |
| UFW firewall | No | VCN blocks before traffic reaches instance |
| fail2ban | No | No brute force if port 22 blocked at VCN |
| sshd hardening | No | Tailscale SSH doesn’t use sshd |
| Disable root login | No | Tailscale uses Tailscale identity, not system users |
| SSH key-only auth | No | Tailscale authenticates via your tailnet |
| IPv6 hardening | Usually not | Depends on your VCN/subnet settings; verify what’s actually assigned/exposed |

### [​](https://docs.molt.bot/platforms/oracle\#still-recommended)  Still Recommended

- **Credential permissions:**`chmod 700 ~/.clawdbot`
- **Security audit:**`moltbot security audit`
- **System updates:**`sudo apt update && sudo apt upgrade` regularly
- **Monitor Tailscale:** Review devices in [Tailscale admin console](https://login.tailscale.com/admin)

### [​](https://docs.molt.bot/platforms/oracle\#verify-security-posture)  Verify Security Posture

Copy

```
# Confirm no public ports listening
sudo ss -tlnp | grep -v '127.0.0.1\|::1'

# Verify Tailscale SSH is active
tailscale status | grep -q 'offers: ssh' && echo "Tailscale SSH active"

# Optional: disable sshd entirely
sudo systemctl disable --now ssh
```

* * *

## [​](https://docs.molt.bot/platforms/oracle\#fallback:-ssh-tunnel)  Fallback: SSH Tunnel

If Tailscale Serve isn’t working, use an SSH tunnel:

Copy

```
# From your local machine (via Tailscale)
ssh -L 18789:127.0.0.1:18789 ubuntu@moltbot
```

Then open `http://localhost:18789`.

* * *

## [​](https://docs.molt.bot/platforms/oracle\#troubleshooting)  Troubleshooting

### [​](https://docs.molt.bot/platforms/oracle\#instance-creation-fails-%E2%80%9Cout-of-capacity%E2%80%9D)  Instance creation fails (“Out of capacity”)

Free tier ARM instances are popular. Try:

- Different availability domain
- Retry during off-peak hours (early morning)
- Use the “Always Free” filter when selecting shape

### [​](https://docs.molt.bot/platforms/oracle\#tailscale-won%E2%80%99t-connect)  Tailscale won’t connect

Copy

```
# Check status
sudo tailscale status

# Re-authenticate
sudo tailscale up --ssh --hostname=moltbot --reset
```

### [​](https://docs.molt.bot/platforms/oracle\#gateway-won%E2%80%99t-start)  Gateway won’t start

Copy

```
moltbot gateway status
moltbot doctor --non-interactive
journalctl --user -u moltbot-gateway -n 50
```

### [​](https://docs.molt.bot/platforms/oracle\#can%E2%80%99t-reach-control-ui)  Can’t reach Control UI

Copy

```
# Verify Tailscale Serve is running
tailscale serve status

# Check gateway is listening
curl http://localhost:18789

# Restart if needed
systemctl --user restart moltbot-gateway
```

### [​](https://docs.molt.bot/platforms/oracle\#arm-binary-issues)  ARM binary issues

Some tools may not have ARM builds. Check:

Copy

```
uname -m  # Should show aarch64
```

Most npm packages work fine. For binaries, look for `linux-arm64` or `aarch64` releases.

* * *

## [​](https://docs.molt.bot/platforms/oracle\#persistence)  Persistence

All state lives in:

- `~/.clawdbot/` — config, credentials, session data
- `~/clawd/` — workspace (SOUL.md, memory, artifacts)

Back up periodically:

Copy

```
tar -czvf moltbot-backup.tar.gz ~/.clawdbot ~/clawd
```

* * *

## [​](https://docs.molt.bot/platforms/oracle\#see-also)  See Also

- [Gateway remote access](https://docs.molt.bot/gateway/remote) — other remote access patterns
- [Tailscale integration](https://docs.molt.bot/gateway/tailscale) — full Tailscale docs
- [Gateway configuration](https://docs.molt.bot/gateway/configuration) — all config options
- [DigitalOcean guide](https://docs.molt.bot/platforms/digitalocean) — if you want paid + easier signup
- [Hetzner guide](https://docs.molt.bot/platforms/hetzner) — Docker-based alternative

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.