---
source: https://docs.molt.bot/platforms/gcp
title: Gcp - Moltbot
---

[Skip to main content](https://docs.molt.bot/platforms/gcp#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Moltbot on GCP Compute Engine (Docker, Production VPS Guide)](https://docs.molt.bot/platforms/gcp#moltbot-on-gcp-compute-engine-docker%2C-production-vps-guide)
- [Goal](https://docs.molt.bot/platforms/gcp#goal)
- [What are we doing (simple terms)?](https://docs.molt.bot/platforms/gcp#what-are-we-doing-simple-terms-)
- [Quick path (experienced operators)](https://docs.molt.bot/platforms/gcp#quick-path-experienced-operators)
- [What you need](https://docs.molt.bot/platforms/gcp#what-you-need)
- [1) Install gcloud CLI (or use Console)](https://docs.molt.bot/platforms/gcp#1-install-gcloud-cli-or-use-console)
- [2) Create a GCP project](https://docs.molt.bot/platforms/gcp#2-create-a-gcp-project)
- [3) Create the VM](https://docs.molt.bot/platforms/gcp#3-create-the-vm)
- [4) SSH into the VM](https://docs.molt.bot/platforms/gcp#4-ssh-into-the-vm)
- [5) Install Docker (on the VM)](https://docs.molt.bot/platforms/gcp#5-install-docker-on-the-vm)
- [6) Clone the Moltbot repository](https://docs.molt.bot/platforms/gcp#6-clone-the-moltbot-repository)
- [7) Create persistent host directories](https://docs.molt.bot/platforms/gcp#7-create-persistent-host-directories)
- [8) Configure environment variables](https://docs.molt.bot/platforms/gcp#8-configure-environment-variables)
- [9) Docker Compose configuration](https://docs.molt.bot/platforms/gcp#9-docker-compose-configuration)
- [10) Bake required binaries into the image (critical)](https://docs.molt.bot/platforms/gcp#10-bake-required-binaries-into-the-image-critical)
- [11) Build and launch](https://docs.molt.bot/platforms/gcp#11-build-and-launch)
- [12) Verify Gateway](https://docs.molt.bot/platforms/gcp#12-verify-gateway)
- [13) Access from your laptop](https://docs.molt.bot/platforms/gcp#13-access-from-your-laptop)
- [What persists where (source of truth)](https://docs.molt.bot/platforms/gcp#what-persists-where-source-of-truth)
- [Updates](https://docs.molt.bot/platforms/gcp#updates)
- [Troubleshooting](https://docs.molt.bot/platforms/gcp#troubleshooting)
- [Service accounts (security best practice)](https://docs.molt.bot/platforms/gcp#service-accounts-security-best-practice)
- [Next steps](https://docs.molt.bot/platforms/gcp#next-steps)

# [​](https://docs.molt.bot/platforms/gcp\#moltbot-on-gcp-compute-engine-docker,-production-vps-guide)  Moltbot on GCP Compute Engine (Docker, Production VPS Guide)

## [​](https://docs.molt.bot/platforms/gcp\#goal)  Goal

Run a persistent Moltbot Gateway on a GCP Compute Engine VM using Docker, with durable state, baked-in binaries, and safe restart behavior.If you want “Moltbot 24/7 for ~$5-12/mo”, this is a reliable setup on Google Cloud.
Pricing varies by machine type and region; pick the smallest VM that fits your workload and scale up if you hit OOMs.

## [​](https://docs.molt.bot/platforms/gcp\#what-are-we-doing-simple-terms-)  What are we doing (simple terms)?

- Create a GCP project and enable billing
- Create a Compute Engine VM
- Install Docker (isolated app runtime)
- Start the Moltbot Gateway in Docker
- Persist `~/.clawdbot` \+ `~/clawd` on the host (survives restarts/rebuilds)
- Access the Control UI from your laptop via an SSH tunnel

The Gateway can be accessed via:

- SSH port forwarding from your laptop
- Direct port exposure if you manage firewalling and tokens yourself

This guide uses Debian on GCP Compute Engine.
Ubuntu also works; map packages accordingly.
For the generic Docker flow, see [Docker](https://docs.molt.bot/install/docker).

* * *

## [​](https://docs.molt.bot/platforms/gcp\#quick-path-experienced-operators)  Quick path (experienced operators)

1. Create GCP project + enable Compute Engine API
2. Create Compute Engine VM (e2-small, Debian 12, 20GB)
3. SSH into the VM
4. Install Docker
5. Clone Moltbot repository
6. Create persistent host directories
7. Configure `.env` and `docker-compose.yml`
8. Bake required binaries, build, and launch

* * *

## [​](https://docs.molt.bot/platforms/gcp\#what-you-need)  What you need

- GCP account (free tier eligible for e2-micro)
- gcloud CLI installed (or use Cloud Console)
- SSH access from your laptop
- Basic comfort with SSH + copy/paste
- ~20-30 minutes
- Docker and Docker Compose
- Model auth credentials
- Optional provider credentials
  - WhatsApp QR
  - Telegram bot token
  - Gmail OAuth

* * *

## [​](https://docs.molt.bot/platforms/gcp\#1-install-gcloud-cli-or-use-console)  1) Install gcloud CLI (or use Console)

**Option A: gcloud CLI** (recommended for automation)Install from [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)Initialize and authenticate:

Copy

```
gcloud init
gcloud auth login
```

**Option B: Cloud Console**All steps can be done via the web UI at [https://console.cloud.google.com](https://console.cloud.google.com/)

* * *

## [​](https://docs.molt.bot/platforms/gcp\#2-create-a-gcp-project)  2) Create a GCP project

**CLI:**

Copy

```
gcloud projects create my-moltbot-project --name="Moltbot Gateway"
gcloud config set project my-moltbot-project
```

Enable billing at [https://console.cloud.google.com/billing](https://console.cloud.google.com/billing) (required for Compute Engine).Enable the Compute Engine API:

Copy

```
gcloud services enable compute.googleapis.com
```

**Console:**

1. Go to IAM & Admin > Create Project
2. Name it and create
3. Enable billing for the project
4. Navigate to APIs & Services > Enable APIs > search “Compute Engine API” > Enable

* * *

## [​](https://docs.molt.bot/platforms/gcp\#3-create-the-vm)  3) Create the VM

**Machine types:**

| Type | Specs | Cost | Notes |
| --- | --- | --- | --- |
| e2-small | 2 vCPU, 2GB RAM | ~$12/mo | Recommended |
| e2-micro | 2 vCPU (shared), 1GB RAM | Free tier eligible | May OOM under load |

**CLI:**

Copy

```
gcloud compute instances create moltbot-gateway \
  --zone=us-central1-a \
  --machine-type=e2-small \
  --boot-disk-size=20GB \
  --image-family=debian-12 \
  --image-project=debian-cloud
```

**Console:**

1. Go to Compute Engine > VM instances > Create instance
2. Name: `moltbot-gateway`
3. Region: `us-central1`, Zone: `us-central1-a`
4. Machine type: `e2-small`
5. Boot disk: Debian 12, 20GB
6. Create

* * *

## [​](https://docs.molt.bot/platforms/gcp\#4-ssh-into-the-vm)  4) SSH into the VM

**CLI:**

Copy

```
gcloud compute ssh moltbot-gateway --zone=us-central1-a
```

**Console:**Click the “SSH” button next to your VM in the Compute Engine dashboard.Note: SSH key propagation can take 1-2 minutes after VM creation. If connection is refused, wait and retry.

* * *

## [​](https://docs.molt.bot/platforms/gcp\#5-install-docker-on-the-vm)  5) Install Docker (on the VM)

Copy

```
sudo apt-get update
sudo apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Log out and back in for the group change to take effect:

Copy

```
exit
```

Then SSH back in:

Copy

```
gcloud compute ssh moltbot-gateway --zone=us-central1-a
```

Verify:

Copy

```
docker --version
docker compose version
```

* * *

## [​](https://docs.molt.bot/platforms/gcp\#6-clone-the-moltbot-repository)  6) Clone the Moltbot repository

Copy

```
git clone https://github.com/moltbot/moltbot.git
cd moltbot
```

This guide assumes you will build a custom image to guarantee binary persistence.

* * *

## [​](https://docs.molt.bot/platforms/gcp\#7-create-persistent-host-directories)  7) Create persistent host directories

Docker containers are ephemeral.
All long-lived state must live on the host.

Copy

```
mkdir -p ~/.clawdbot
mkdir -p ~/clawd
```

* * *

## [​](https://docs.molt.bot/platforms/gcp\#8-configure-environment-variables)  8) Configure environment variables

Create `.env` in the repository root.

Copy

```
CLAWDBOT_IMAGE=moltbot:latest
CLAWDBOT_GATEWAY_TOKEN=change-me-now
CLAWDBOT_GATEWAY_BIND=lan
CLAWDBOT_GATEWAY_PORT=18789

CLAWDBOT_CONFIG_DIR=/home/$USER/.clawdbot
CLAWDBOT_WORKSPACE_DIR=/home/$USER/clawd

GOG_KEYRING_PASSWORD=change-me-now
XDG_CONFIG_HOME=/home/node/.clawdbot
```

Generate strong secrets:

Copy

```
openssl rand -hex 32
```

**Do not commit this file.**

* * *

## [​](https://docs.molt.bot/platforms/gcp\#9-docker-compose-configuration)  9) Docker Compose configuration

Create or update `docker-compose.yml`.

Copy

```
services:
  moltbot-gateway:
    image: ${CLAWDBOT_IMAGE}
    build: .
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - HOME=/home/node
      - NODE_ENV=production
      - TERM=xterm-256color
      - CLAWDBOT_GATEWAY_BIND=${CLAWDBOT_GATEWAY_BIND}
      - CLAWDBOT_GATEWAY_PORT=${CLAWDBOT_GATEWAY_PORT}
      - CLAWDBOT_GATEWAY_TOKEN=${CLAWDBOT_GATEWAY_TOKEN}
      - GOG_KEYRING_PASSWORD=${GOG_KEYRING_PASSWORD}
      - XDG_CONFIG_HOME=${XDG_CONFIG_HOME}
      - PATH=/home/linuxbrew/.linuxbrew/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    volumes:
      - ${CLAWDBOT_CONFIG_DIR}:/home/node/.clawdbot
      - ${CLAWDBOT_WORKSPACE_DIR}:/home/node/clawd
    ports:
      # Recommended: keep the Gateway loopback-only on the VM; access via SSH tunnel.
      # To expose it publicly, remove the `127.0.0.1:` prefix and firewall accordingly.
      - "127.0.0.1:${CLAWDBOT_GATEWAY_PORT}:18789"

      # Optional: only if you run iOS/Android nodes against this VM and need Canvas host.
      # If you expose this publicly, read /gateway/security and firewall accordingly.
      # - "18793:18793"
    command:
      [\
        "node",\
        "dist/index.js",\
        "gateway",\
        "--bind",\
        "${CLAWDBOT_GATEWAY_BIND}",\
        "--port",\
        "${CLAWDBOT_GATEWAY_PORT}"\
      ]
```

* * *

## [​](https://docs.molt.bot/platforms/gcp\#10-bake-required-binaries-into-the-image-critical)  10) Bake required binaries into the image (critical)

Installing binaries inside a running container is a trap.
Anything installed at runtime will be lost on restart.All external binaries required by skills must be installed at image build time.The examples below show three common binaries only:

- `gog` for Gmail access
- `goplaces` for Google Places
- `wacli` for WhatsApp

These are examples, not a complete list.
You may install as many binaries as needed using the same pattern.If you add new skills later that depend on additional binaries, you must:

1. Update the Dockerfile
2. Rebuild the image
3. Restart the containers

**Example Dockerfile**

Copy

```
FROM node:22-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# Example binary 1: Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/gog

# Example binary 2: Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/goplaces

# Example binary 3: WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/wacli

# Add more binaries below using the same pattern

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts

RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build

ENV NODE_ENV=production

CMD ["node","dist/index.js"]
```

* * *

## [​](https://docs.molt.bot/platforms/gcp\#11-build-and-launch)  11) Build and launch

Copy

```
docker compose build
docker compose up -d moltbot-gateway
```

Verify binaries:

Copy

```
docker compose exec moltbot-gateway which gog
docker compose exec moltbot-gateway which goplaces
docker compose exec moltbot-gateway which wacli
```

Expected output:

Copy

```
/usr/local/bin/gog
/usr/local/bin/goplaces
/usr/local/bin/wacli
```

* * *

## [​](https://docs.molt.bot/platforms/gcp\#12-verify-gateway)  12) Verify Gateway

Copy

```
docker compose logs -f moltbot-gateway
```

Success:

Copy

```
[gateway] listening on ws://0.0.0.0:18789
```

* * *

## [​](https://docs.molt.bot/platforms/gcp\#13-access-from-your-laptop)  13) Access from your laptop

Create an SSH tunnel to forward the Gateway port:

Copy

```
gcloud compute ssh moltbot-gateway --zone=us-central1-a -- -L 18789:127.0.0.1:18789
```

Open in your browser:`http://127.0.0.1:18789/`Paste your gateway token.

* * *

## [​](https://docs.molt.bot/platforms/gcp\#what-persists-where-source-of-truth)  What persists where (source of truth)

Moltbot runs in Docker, but Docker is not the source of truth.
All long-lived state must survive restarts, rebuilds, and reboots.

| Component | Location | Persistence mechanism | Notes |
| --- | --- | --- | --- |
| Gateway config | `/home/node/.clawdbot/` | Host volume mount | Includes `moltbot.json`, tokens |
| Model auth profiles | `/home/node/.clawdbot/` | Host volume mount | OAuth tokens, API keys |
| Skill configs | `/home/node/.clawdbot/skills/` | Host volume mount | Skill-level state |
| Agent workspace | `/home/node/clawd/` | Host volume mount | Code and agent artifacts |
| WhatsApp session | `/home/node/.clawdbot/` | Host volume mount | Preserves QR login |
| Gmail keyring | `/home/node/.clawdbot/` | Host volume + password | Requires `GOG_KEYRING_PASSWORD` |
| External binaries | `/usr/local/bin/` | Docker image | Must be baked at build time |
| Node runtime | Container filesystem | Docker image | Rebuilt every image build |
| OS packages | Container filesystem | Docker image | Do not install at runtime |
| Docker container | Ephemeral | Restartable | Safe to destroy |

* * *

## [​](https://docs.molt.bot/platforms/gcp\#updates)  Updates

To update Moltbot on the VM:

Copy

```
cd ~/moltbot
git pull
docker compose build
docker compose up -d
```

* * *

## [​](https://docs.molt.bot/platforms/gcp\#troubleshooting)  Troubleshooting

**SSH connection refused**SSH key propagation can take 1-2 minutes after VM creation. Wait and retry.**OS Login issues**Check your OS Login profile:

Copy

```
gcloud compute os-login describe-profile
```

Ensure your account has the required IAM permissions (Compute OS Login or Compute OS Admin Login).**Out of memory (OOM)**If using e2-micro and hitting OOM, upgrade to e2-small or e2-medium:

Copy

```
# Stop the VM first
gcloud compute instances stop moltbot-gateway --zone=us-central1-a

# Change machine type
gcloud compute instances set-machine-type moltbot-gateway \
  --zone=us-central1-a \
  --machine-type=e2-small

# Start the VM
gcloud compute instances start moltbot-gateway --zone=us-central1-a
```

* * *

## [​](https://docs.molt.bot/platforms/gcp\#service-accounts-security-best-practice)  Service accounts (security best practice)

For personal use, your default user account works fine.For automation or CI/CD pipelines, create a dedicated service account with minimal permissions:

1. Create a service account:






Copy











```
gcloud iam service-accounts create moltbot-deploy \
     --display-name="Moltbot Deployment"
```

2. Grant Compute Instance Admin role (or narrower custom role):






Copy











```
gcloud projects add-iam-policy-binding my-moltbot-project \
     --member="serviceAccount:moltbot-deploy@my-moltbot-project.iam.gserviceaccount.com" \
     --role="roles/compute.instanceAdmin.v1"
```


Avoid using the Owner role for automation. Use the principle of least privilege.See [https://cloud.google.com/iam/docs/understanding-roles](https://cloud.google.com/iam/docs/understanding-roles) for IAM role details.

* * *

## [​](https://docs.molt.bot/platforms/gcp\#next-steps)  Next steps

- Set up messaging channels: [Channels](https://docs.molt.bot/channels)
- Pair local devices as nodes: [Nodes](https://docs.molt.bot/nodes)
- Configure the Gateway: [Gateway configuration](https://docs.molt.bot/gateway/configuration)

[Hetzner](https://docs.molt.bot/platforms/hetzner) [Exe dev](https://docs.molt.bot/platforms/exe-dev)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.