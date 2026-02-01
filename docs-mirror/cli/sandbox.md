---
source: https://docs.molt.bot/cli/sandbox
title: Sandbox CLI - Moltbot
---

[Skip to main content](https://docs.molt.bot/cli/sandbox#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

CLI

Sandbox CLI

On this page

- [Sandbox CLI](https://docs.molt.bot/cli/sandbox#sandbox-cli)
- [Overview](https://docs.molt.bot/cli/sandbox#overview)
- [Commands](https://docs.molt.bot/cli/sandbox#commands)
- [moltbot sandbox explain](https://docs.molt.bot/cli/sandbox#moltbot-sandbox-explain)
- [moltbot sandbox list](https://docs.molt.bot/cli/sandbox#moltbot-sandbox-list)
- [moltbot sandbox recreate](https://docs.molt.bot/cli/sandbox#moltbot-sandbox-recreate)
- [Use Cases](https://docs.molt.bot/cli/sandbox#use-cases)
- [After updating Docker images](https://docs.molt.bot/cli/sandbox#after-updating-docker-images)
- [After changing sandbox configuration](https://docs.molt.bot/cli/sandbox#after-changing-sandbox-configuration)
- [After changing setupCommand](https://docs.molt.bot/cli/sandbox#after-changing-setupcommand)
- [For a specific agent only](https://docs.molt.bot/cli/sandbox#for-a-specific-agent-only)
- [Why is this needed?](https://docs.molt.bot/cli/sandbox#why-is-this-needed)
- [Configuration](https://docs.molt.bot/cli/sandbox#configuration)
- [See Also](https://docs.molt.bot/cli/sandbox#see-also)

# [​](https://docs.molt.bot/cli/sandbox\#sandbox-cli)  Sandbox CLI

Manage Docker-based sandbox containers for isolated agent execution.

## [​](https://docs.molt.bot/cli/sandbox\#overview)  Overview

Moltbot can run agents in isolated Docker containers for security. The `sandbox` commands help you manage these containers, especially after updates or configuration changes.

## [​](https://docs.molt.bot/cli/sandbox\#commands)  Commands

### [​](https://docs.molt.bot/cli/sandbox\#moltbot-sandbox-explain)  `moltbot sandbox explain`

Inspect the **effective** sandbox mode/scope/workspace access, sandbox tool policy, and elevated gates (with fix-it config key paths).

Copy

```
moltbot sandbox explain
moltbot sandbox explain --session agent:main:main
moltbot sandbox explain --agent work
moltbot sandbox explain --json
```

### [​](https://docs.molt.bot/cli/sandbox\#moltbot-sandbox-list)  `moltbot sandbox list`

List all sandbox containers with their status and configuration.

Copy

```
moltbot sandbox list
moltbot sandbox list --browser  # List only browser containers
moltbot sandbox list --json     # JSON output
```

**Output includes:**

- Container name and status (running/stopped)
- Docker image and whether it matches config
- Age (time since creation)
- Idle time (time since last use)
- Associated session/agent

### [​](https://docs.molt.bot/cli/sandbox\#moltbot-sandbox-recreate)  `moltbot sandbox recreate`

Remove sandbox containers to force recreation with updated images/config.

Copy

```
moltbot sandbox recreate --all                # Recreate all containers
moltbot sandbox recreate --session main       # Specific session
moltbot sandbox recreate --agent mybot        # Specific agent
moltbot sandbox recreate --browser            # Only browser containers
moltbot sandbox recreate --all --force        # Skip confirmation
```

**Options:**

- `--all`: Recreate all sandbox containers
- `--session <key>`: Recreate container for specific session
- `--agent <id>`: Recreate containers for specific agent
- `--browser`: Only recreate browser containers
- `--force`: Skip confirmation prompt

**Important:** Containers are automatically recreated when the agent is next used.

## [​](https://docs.molt.bot/cli/sandbox\#use-cases)  Use Cases

### [​](https://docs.molt.bot/cli/sandbox\#after-updating-docker-images)  After updating Docker images

Copy

```
# Pull new image
docker pull moltbot-sandbox:latest
docker tag moltbot-sandbox:latest moltbot-sandbox:bookworm-slim

# Update config to use new image
# Edit config: agents.defaults.sandbox.docker.image (or agents.list[].sandbox.docker.image)

# Recreate containers
moltbot sandbox recreate --all
```

### [​](https://docs.molt.bot/cli/sandbox\#after-changing-sandbox-configuration)  After changing sandbox configuration

Copy

```
# Edit config: agents.defaults.sandbox.* (or agents.list[].sandbox.*)

# Recreate to apply new config
moltbot sandbox recreate --all
```

### [​](https://docs.molt.bot/cli/sandbox\#after-changing-setupcommand)  After changing setupCommand

Copy

```
moltbot sandbox recreate --all
# or just one agent:
moltbot sandbox recreate --agent family
```

### [​](https://docs.molt.bot/cli/sandbox\#for-a-specific-agent-only)  For a specific agent only

Copy

```
# Update only one agent's containers
moltbot sandbox recreate --agent alfred
```

## [​](https://docs.molt.bot/cli/sandbox\#why-is-this-needed)  Why is this needed?

**Problem:** When you update sandbox Docker images or configuration:

- Existing containers continue running with old settings
- Containers are only pruned after 24h of inactivity
- Regularly-used agents keep old containers running indefinitely

**Solution:** Use `moltbot sandbox recreate` to force removal of old containers. They’ll be recreated automatically with current settings when next needed.Tip: prefer `moltbot sandbox recreate` over manual `docker rm`. It uses the
Gateway’s container naming and avoids mismatches when scope/session keys change.

## [​](https://docs.molt.bot/cli/sandbox\#configuration)  Configuration

Sandbox settings live in `~/.clawdbot/moltbot.json` under `agents.defaults.sandbox` (per-agent overrides go in `agents.list[].sandbox`):

Copy

```
{
  "agents": {
    "defaults": {
      "sandbox": {
        "mode": "all",                    // off, non-main, all
        "scope": "agent",                 // session, agent, shared
        "docker": {
          "image": "moltbot-sandbox:bookworm-slim",
          "containerPrefix": "moltbot-sbx-"
          // ... more Docker options
        },
        "prune": {
          "idleHours": 24,               // Auto-prune after 24h idle
          "maxAgeDays": 7                // Auto-prune after 7 days
        }
      }
    }
  }
}
```

## [​](https://docs.molt.bot/cli/sandbox\#see-also)  See Also

- [Sandbox Documentation](https://docs.molt.bot/gateway/sandboxing)
- [Agent Configuration](https://docs.molt.bot/concepts/agent-workspace)
- [Doctor Command](https://docs.molt.bot/gateway/doctor) \- Check sandbox setup

[Update](https://docs.molt.bot/cli/update) [Architecture](https://docs.molt.bot/concepts/architecture)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.