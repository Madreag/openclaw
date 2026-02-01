---
source: https://docs.molt.bot/render
title: Deploy on Render - Moltbot
---

[Skip to main content](https://docs.molt.bot/render#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

Install & Updates

Deploy on Render

On this page

- [Prerequisites](https://docs.molt.bot/render#prerequisites)
- [Deploy with a Render Blueprint](https://docs.molt.bot/render#deploy-with-a-render-blueprint)
- [Understanding the Blueprint](https://docs.molt.bot/render#understanding-the-blueprint)
- [Choosing a plan](https://docs.molt.bot/render#choosing-a-plan)
- [After deployment](https://docs.molt.bot/render#after-deployment)
- [Complete the setup wizard](https://docs.molt.bot/render#complete-the-setup-wizard)
- [Access the Control UI](https://docs.molt.bot/render#access-the-control-ui)
- [Render Dashboard features](https://docs.molt.bot/render#render-dashboard-features)
- [Logs](https://docs.molt.bot/render#logs)
- [Shell access](https://docs.molt.bot/render#shell-access)
- [Environment variables](https://docs.molt.bot/render#environment-variables)
- [Auto-deploy](https://docs.molt.bot/render#auto-deploy)
- [Custom domain](https://docs.molt.bot/render#custom-domain)
- [Scaling](https://docs.molt.bot/render#scaling)
- [Backups and migration](https://docs.molt.bot/render#backups-and-migration)
- [Troubleshooting](https://docs.molt.bot/render#troubleshooting)
- [Service won’t start](https://docs.molt.bot/render#service-won%E2%80%99t-start)
- [Slow cold starts (free tier)](https://docs.molt.bot/render#slow-cold-starts-free-tier)
- [Data loss after redeploy](https://docs.molt.bot/render#data-loss-after-redeploy)
- [Health check failures](https://docs.molt.bot/render#health-check-failures)

Deploy Moltbot on Render using Infrastructure as Code. The included `render.yaml` Blueprint defines your entire stack declaratively, service, disk, environment variables, so you can deploy with a single click and version your infrastructure alongside your code.

## [​](https://docs.molt.bot/render\#prerequisites)  Prerequisites

- A [Render account](https://render.com/) (free tier available)
- An API key from your preferred [model provider](https://docs.molt.bot/providers)

## [​](https://docs.molt.bot/render\#deploy-with-a-render-blueprint)  Deploy with a Render Blueprint

[Deploy to Render](https://render.com/deploy?repo=https://github.com/moltbot/moltbot) Clicking this link will:

1. Create a new Render service from the `render.yaml` Blueprint at the root of this repo.
2. Prompt you to set `SETUP_PASSWORD`
3. Build the Docker image and deploy

Once deployed, your service URL follows the pattern `https://<service-name>.onrender.com`.

## [​](https://docs.molt.bot/render\#understanding-the-blueprint)  Understanding the Blueprint

Render Blueprints are YAML files that define your infrastructure. The `render.yaml` in this
repository configures everything needed to run Moltbot:

Copy

```
services:
  - type: web
    name: moltbot
    runtime: docker
    plan: starter
    healthCheckPath: /health
    envVars:
      - key: PORT
        value: "8080"
      - key: SETUP_PASSWORD
        sync: false          # prompts during deploy
      - key: CLAWDBOT_STATE_DIR
        value: /data/.clawdbot
      - key: CLAWDBOT_WORKSPACE_DIR
        value: /data/workspace
      - key: CLAWDBOT_GATEWAY_TOKEN
        generateValue: true  # auto-generates a secure token
    disk:
      name: moltbot-data
      mountPath: /data
      sizeGB: 1
```

Key Blueprint features used:

| Feature | Purpose |
| --- | --- |
| `runtime: docker` | Builds from the repo’s Dockerfile |
| `healthCheckPath` | Render monitors `/health` and restarts unhealthy instances |
| `sync: false` | Prompts for value during deploy (secrets) |
| `generateValue: true` | Auto-generates a cryptographically secure value |
| `disk` | Persistent storage that survives redeploys |

## [​](https://docs.molt.bot/render\#choosing-a-plan)  Choosing a plan

| Plan | Spin-down | Disk | Best for |
| --- | --- | --- | --- |
| Free | After 15 min idle | Not available | Testing, demos |
| Starter | Never | 1GB+ | Personal use, small teams |
| Standard+ | Never | 1GB+ | Production, multiple channels |

The Blueprint defaults to `starter`. To use free tier, change `plan: free` in your fork’s
`render.yaml` (but note: no persistent disk means config resets on each deploy).

## [​](https://docs.molt.bot/render\#after-deployment)  After deployment

### [​](https://docs.molt.bot/render\#complete-the-setup-wizard)  Complete the setup wizard

1. Navigate to `https://<your-service>.onrender.com/setup`
2. Enter your `SETUP_PASSWORD`
3. Select a model provider and paste your API key
4. Optionally configure messaging channels (Telegram, Discord, Slack)
5. Click **Run setup**

### [​](https://docs.molt.bot/render\#access-the-control-ui)  Access the Control UI

The web dashboard is available at `https://<your-service>.onrender.com/moltbot`.

## [​](https://docs.molt.bot/render\#render-dashboard-features)  Render Dashboard features

### [​](https://docs.molt.bot/render\#logs)  Logs

View real-time logs in **Dashboard → your service → Logs**. Filter by:

- Build logs (Docker image creation)
- Deploy logs (service startup)
- Runtime logs (application output)

### [​](https://docs.molt.bot/render\#shell-access)  Shell access

For debugging, open a shell session via **Dashboard → your service → Shell**. The persistent disk is mounted at `/data`.

### [​](https://docs.molt.bot/render\#environment-variables)  Environment variables

Modify variables in **Dashboard → your service → Environment**. Changes trigger an automatic redeploy.

### [​](https://docs.molt.bot/render\#auto-deploy)  Auto-deploy

If you use the original Moltbot repository, Render will not auto-deploy your Moltbot. To update it, run a manual Blueprint sync from the dashboard.

## [​](https://docs.molt.bot/render\#custom-domain)  Custom domain

1. Go to **Dashboard → your service → Settings → Custom Domains**
2. Add your domain
3. Configure DNS as instructed (CNAME to `*.onrender.com`)
4. Render provisions a TLS certificate automatically

## [​](https://docs.molt.bot/render\#scaling)  Scaling

Render supports horizontal and vertical scaling:

- **Vertical**: Change the plan to get more CPU/RAM
- **Horizontal**: Increase instance count (Standard plan and above)

For Moltbot, vertical scaling is usually sufficient. Horizontal scaling requires sticky sessions or external state management.

## [​](https://docs.molt.bot/render\#backups-and-migration)  Backups and migration

Export your configuration and workspace at any time:

Copy

```
https://<your-service>.onrender.com/setup/export
```

This downloads a portable backup you can restore on any Moltbot host.

## [​](https://docs.molt.bot/render\#troubleshooting)  Troubleshooting

### [​](https://docs.molt.bot/render\#service-won%E2%80%99t-start)  Service won’t start

Check the deploy logs in the Render Dashboard. Common issues:

- Missing `SETUP_PASSWORD` — the Blueprint prompts for this, but verify it’s set
- Port mismatch — ensure `PORT=8080` matches the Dockerfile’s exposed port

### [​](https://docs.molt.bot/render\#slow-cold-starts-free-tier)  Slow cold starts (free tier)

Free tier services spin down after 15 minutes of inactivity. The first request after spin-down takes a few seconds while the container starts. Upgrade to Starter plan for always-on.

### [​](https://docs.molt.bot/render\#data-loss-after-redeploy)  Data loss after redeploy

This happens on free tier (no persistent disk). Upgrade to a paid plan, or
regularly export your config via `/setup/export`.

### [​](https://docs.molt.bot/render\#health-check-failures)  Health check failures

Render expects a 200 response from `/health` within 30 seconds. If builds succeed but deploys fail, the service may be taking too long to start. Check:

- Build logs for errors
- Whether the container runs locally with `docker build && docker run`

[Deploy on Railway](https://docs.molt.bot/railway) [Deploy on Northflank](https://docs.molt.bot/northflank)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.