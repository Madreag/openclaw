---
source: https://docs.molt.bot/tools/skills-config
title: Skills config - Moltbot
---

[Skip to main content](https://docs.molt.bot/tools/skills-config#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Skills Config](https://docs.molt.bot/tools/skills-config#skills-config)
- [Fields](https://docs.molt.bot/tools/skills-config#fields)
- [Notes](https://docs.molt.bot/tools/skills-config#notes)
- [Sandboxed skills + env vars](https://docs.molt.bot/tools/skills-config#sandboxed-skills-%2B-env-vars)

# [​](https://docs.molt.bot/tools/skills-config\#skills-config)  Skills Config

All skills-related configuration lives under `skills` in `~/.clawdbot/moltbot.json`.

Copy

```
{
  skills: {
    allowBundled: ["gemini", "peekaboo"],
    load: {
      extraDirs: [\
        "~/Projects/agent-scripts/skills",\
        "~/Projects/oss/some-skill-pack/skills"\
      ],
      watch: true,
      watchDebounceMs: 250
    },
    install: {
      preferBrew: true,
      nodeManager: "npm" // npm | pnpm | yarn | bun (Gateway runtime still Node; bun not recommended)
    },
    entries: {
      "nano-banana-pro": {
        enabled: true,
        apiKey: "GEMINI_KEY_HERE",
        env: {
          GEMINI_API_KEY: "GEMINI_KEY_HERE"
        }
      },
      peekaboo: { enabled: true },
      sag: { enabled: false }
    }
  }
}
```

## [​](https://docs.molt.bot/tools/skills-config\#fields)  Fields

- `allowBundled`: optional allowlist for **bundled** skills only. When set, only
bundled skills in the list are eligible (managed/workspace skills unaffected).
- `load.extraDirs`: additional skill directories to scan (lowest precedence).
- `load.watch`: watch skill folders and refresh the skills snapshot (default: true).
- `load.watchDebounceMs`: debounce for skill watcher events in milliseconds (default: 250).
- `install.preferBrew`: prefer brew installers when available (default: true).
- `install.nodeManager`: node installer preference (`npm` \| `pnpm` \| `yarn` \| `bun`, default: npm).
This only affects **skill installs**; the Gateway runtime should still be Node
(Bun not recommended for WhatsApp/Telegram).
- `entries.<skillKey>`: per-skill overrides.

Per-skill fields:

- `enabled`: set `false` to disable a skill even if it’s bundled/installed.
- `env`: environment variables injected for the agent run (only if not already set).
- `apiKey`: optional convenience for skills that declare a primary env var.

## [​](https://docs.molt.bot/tools/skills-config\#notes)  Notes

- Keys under `entries` map to the skill name by default. If a skill defines
`metadata.moltbot.skillKey`, use that key instead.
- Changes to skills are picked up on the next agent turn when the watcher is enabled.

### [​](https://docs.molt.bot/tools/skills-config\#sandboxed-skills-+-env-vars)  Sandboxed skills + env vars

When a session is **sandboxed**, skill processes run inside Docker. The sandbox
does **not** inherit the host `process.env`.Use one of:

- `agents.defaults.sandbox.docker.env` (or per-agent `agents.list[].sandbox.docker.env`)
- bake the env into your custom sandbox image

Global `env` and `skills.entries.<skill>.env/apiKey` apply to **host** runs only.

[Skills](https://docs.molt.bot/tools/skills) [Clawdhub](https://docs.molt.bot/tools/clawdhub)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.