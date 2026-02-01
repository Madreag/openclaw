---
source: https://docs.molt.bot/tools/skills
title: Skills - Moltbot
---

[Skip to main content](https://docs.molt.bot/tools/skills#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Skills (Moltbot)](https://docs.molt.bot/tools/skills#skills-moltbot)
- [Locations and precedence](https://docs.molt.bot/tools/skills#locations-and-precedence)
- [Per-agent vs shared skills](https://docs.molt.bot/tools/skills#per-agent-vs-shared-skills)
- [Plugins + skills](https://docs.molt.bot/tools/skills#plugins-%2B-skills)
- [ClawdHub (install + sync)](https://docs.molt.bot/tools/skills#clawdhub-install-%2B-sync)
- [Security notes](https://docs.molt.bot/tools/skills#security-notes)
- [Format (AgentSkills + Pi-compatible)](https://docs.molt.bot/tools/skills#format-agentskills-%2B-pi-compatible)
- [Gating (load-time filters)](https://docs.molt.bot/tools/skills#gating-load-time-filters)
- [Config overrides (~/.clawdbot/moltbot.json)](https://docs.molt.bot/tools/skills#config-overrides-%2F-clawdbot%2Fmoltbot-json)
- [Environment injection (per agent run)](https://docs.molt.bot/tools/skills#environment-injection-per-agent-run)
- [Session snapshot (performance)](https://docs.molt.bot/tools/skills#session-snapshot-performance)
- [Remote macOS nodes (Linux gateway)](https://docs.molt.bot/tools/skills#remote-macos-nodes-linux-gateway)
- [Skills watcher (auto-refresh)](https://docs.molt.bot/tools/skills#skills-watcher-auto-refresh)
- [Token impact (skills list)](https://docs.molt.bot/tools/skills#token-impact-skills-list)
- [Managed skills lifecycle](https://docs.molt.bot/tools/skills#managed-skills-lifecycle)
- [Config reference](https://docs.molt.bot/tools/skills#config-reference)
- [Looking for more skills?](https://docs.molt.bot/tools/skills#looking-for-more-skills)

# [​](https://docs.molt.bot/tools/skills\#skills-moltbot)  Skills (Moltbot)

Moltbot uses **[AgentSkills](https://agentskills.io/)-compatible** skill folders to teach the agent how to use tools. Each skill is a directory containing a `SKILL.md` with YAML frontmatter and instructions. Moltbot loads **bundled skills** plus optional local overrides, and filters them at load time based on environment, config, and binary presence.

## [​](https://docs.molt.bot/tools/skills\#locations-and-precedence)  Locations and precedence

Skills are loaded from **three** places:

1. **Bundled skills**: shipped with the install (npm package or Moltbot.app)
2. **Managed/local skills**: `~/.clawdbot/skills`
3. **Workspace skills**: `<workspace>/skills`

If a skill name conflicts, precedence is:`<workspace>/skills` (highest) → `~/.clawdbot/skills` → bundled skills (lowest)Additionally, you can configure extra skill folders (lowest precedence) via
`skills.load.extraDirs` in `~/.clawdbot/moltbot.json`.

## [​](https://docs.molt.bot/tools/skills\#per-agent-vs-shared-skills)  Per-agent vs shared skills

In **multi-agent** setups, each agent has its own workspace. That means:

- **Per-agent skills** live in `<workspace>/skills` for that agent only.
- **Shared skills** live in `~/.clawdbot/skills` (managed/local) and are visible
to **all agents** on the same machine.
- **Shared folders** can also be added via `skills.load.extraDirs` (lowest
precedence) if you want a common skills pack used by multiple agents.

If the same skill name exists in more than one place, the usual precedence
applies: workspace wins, then managed/local, then bundled.

## [​](https://docs.molt.bot/tools/skills\#plugins-+-skills)  Plugins + skills

Plugins can ship their own skills by listing `skills` directories in
`moltbot.plugin.json` (paths relative to the plugin root). Plugin skills load
when the plugin is enabled and participate in the normal skill precedence rules.
You can gate them via `metadata.moltbot.requires.config` on the plugin’s config
entry. See [Plugins](https://docs.molt.bot/plugin) for discovery/config and [Tools](https://docs.molt.bot/tools) for the
tool surface those skills teach.

## [​](https://docs.molt.bot/tools/skills\#clawdhub-install-+-sync)  ClawdHub (install + sync)

ClawdHub is the public skills registry for Moltbot. Browse at
[https://clawdhub.com](https://clawdhub.com/). Use it to discover, install, update, and back up skills.
Full guide: [ClawdHub](https://docs.molt.bot/tools/clawdhub).Common flows:

- Install a skill into your workspace:
  - `clawdhub install <skill-slug>`
- Update all installed skills:
  - `clawdhub update --all`
- Sync (scan + publish updates):
  - `clawdhub sync --all`

By default, `clawdhub` installs into `./skills` under your current working
directory (or falls back to the configured Moltbot workspace). Moltbot picks
that up as `<workspace>/skills` on the next session.

## [​](https://docs.molt.bot/tools/skills\#security-notes)  Security notes

- Treat third-party skills as **trusted code**. Read them before enabling.
- Prefer sandboxed runs for untrusted inputs and risky tools. See [Sandboxing](https://docs.molt.bot/gateway/sandboxing).
- `skills.entries.*.env` and `skills.entries.*.apiKey` inject secrets into the **host** process
for that agent turn (not the sandbox). Keep secrets out of prompts and logs.
- For a broader threat model and checklists, see [Security](https://docs.molt.bot/gateway/security).

## [​](https://docs.molt.bot/tools/skills\#format-agentskills-+-pi-compatible)  Format (AgentSkills + Pi-compatible)

`SKILL.md` must include at least:

Copy

```
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
---
```

Notes:

- We follow the AgentSkills spec for layout/intent.
- The parser used by the embedded agent supports **single-line** frontmatter keys only.
- `metadata` should be a **single-line JSON object**.
- Use `{baseDir}` in instructions to reference the skill folder path.
- Optional frontmatter keys:
  - `homepage` — URL surfaced as “Website” in the macOS Skills UI (also supported via `metadata.moltbot.homepage`).
  - `user-invocable` — `true|false` (default: `true`). When `true`, the skill is exposed as a user slash command.
  - `disable-model-invocation` — `true|false` (default: `false`). When `true`, the skill is excluded from the model prompt (still available via user invocation).
  - `command-dispatch` — `tool` (optional). When set to `tool`, the slash command bypasses the model and dispatches directly to a tool.
  - `command-tool` — tool name to invoke when `command-dispatch: tool` is set.
  - `command-arg-mode` — `raw` (default). For tool dispatch, forwards the raw args string to the tool (no core parsing).The tool is invoked with params:
    `{ command: "<raw args>", commandName: "<slash command>", skillName: "<skill name>" }`.

## [​](https://docs.molt.bot/tools/skills\#gating-load-time-filters)  Gating (load-time filters)

Moltbot **filters skills at load time** using `metadata` (single-line JSON):

Copy

```
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
metadata: {"moltbot":{"requires":{"bins":["uv"],"env":["GEMINI_API_KEY"],"config":["browser.enabled"]},"primaryEnv":"GEMINI_API_KEY"}}
---
```

Fields under `metadata.moltbot`:

- `always: true` — always include the skill (skip other gates).
- `emoji` — optional emoji used by the macOS Skills UI.
- `homepage` — optional URL shown as “Website” in the macOS Skills UI.
- `os` — optional list of platforms (`darwin`, `linux`, `win32`). If set, the skill is only eligible on those OSes.
- `requires.bins` — list; each must exist on `PATH`.
- `requires.anyBins` — list; at least one must exist on `PATH`.
- `requires.env` — list; env var must exist **or** be provided in config.
- `requires.config` — list of `moltbot.json` paths that must be truthy.
- `primaryEnv` — env var name associated with `skills.entries.<name>.apiKey`.
- `install` — optional array of installer specs used by the macOS Skills UI (brew/node/go/uv/download).

Note on sandboxing:

- `requires.bins` is checked on the **host** at skill load time.
- If an agent is sandboxed, the binary must also exist **inside the container**.
Install it via `agents.defaults.sandbox.docker.setupCommand` (or a custom image).
`setupCommand` runs once after the container is created.
Package installs also require network egress, a writable root FS, and a root user in the sandbox.
Example: the `summarize` skill (`skills/summarize/SKILL.md`) needs the `summarize` CLI
in the sandbox container to run there.

Installer example:

Copy

```
---
name: gemini
description: Use Gemini CLI for coding assistance and Google search lookups.
metadata: {"moltbot":{"emoji":"♊️","requires":{"bins":["gemini"]},"install":[{"id":"brew","kind":"brew","formula":"gemini-cli","bins":["gemini"],"label":"Install Gemini CLI (brew)"}]}}
---
```

Notes:

- If multiple installers are listed, the gateway picks a **single** preferred option (brew when available, otherwise node).
- If all installers are `download`, Moltbot lists each entry so you can see the available artifacts.
- Installer specs can include `os: ["darwin"|"linux"|"win32"]` to filter options by platform.
- Node installs honor `skills.install.nodeManager` in `moltbot.json` (default: npm; options: npm/pnpm/yarn/bun).
This only affects **skill installs**; the Gateway runtime should still be Node
(Bun is not recommended for WhatsApp/Telegram).
- Go installs: if `go` is missing and `brew` is available, the gateway installs Go via Homebrew first and sets `GOBIN` to Homebrew’s `bin` when possible.
- Download installs: `url` (required), `archive` (`tar.gz` \| `tar.bz2` \| `zip`), `extract` (default: auto when archive detected), `stripComponents`, `targetDir` (default: `~/.clawdbot/tools/<skillKey>`).

If no `metadata.moltbot` is present, the skill is always eligible (unless
disabled in config or blocked by `skills.allowBundled` for bundled skills).

## [​](https://docs.molt.bot/tools/skills\#config-overrides-/-clawdbot/moltbot-json)  Config overrides (`~/.clawdbot/moltbot.json`)

Bundled/managed skills can be toggled and supplied with env values:

Copy

```
{
  skills: {
    entries: {
      "nano-banana-pro": {
        enabled: true,
        apiKey: "GEMINI_KEY_HERE",
        env: {
          GEMINI_API_KEY: "GEMINI_KEY_HERE"
        },
        config: {
          endpoint: "https://example.invalid",
          model: "nano-pro"
        }
      },
      peekaboo: { enabled: true },
      sag: { enabled: false }
    }
  }
}
```

Note: if the skill name contains hyphens, quote the key (JSON5 allows quoted keys).Config keys match the **skill name** by default. If a skill defines
`metadata.moltbot.skillKey`, use that key under `skills.entries`.Rules:

- `enabled: false` disables the skill even if it’s bundled/installed.
- `env`: injected **only if** the variable isn’t already set in the process.
- `apiKey`: convenience for skills that declare `metadata.moltbot.primaryEnv`.
- `config`: optional bag for custom per-skill fields; custom keys must live here.
- `allowBundled`: optional allowlist for **bundled** skills only. If set, only
bundled skills in the list are eligible (managed/workspace skills unaffected).

## [​](https://docs.molt.bot/tools/skills\#environment-injection-per-agent-run)  Environment injection (per agent run)

When an agent run starts, Moltbot:

1. Reads skill metadata.
2. Applies any `skills.entries.<key>.env` or `skills.entries.<key>.apiKey` to
`process.env`.
3. Builds the system prompt with **eligible** skills.
4. Restores the original environment after the run ends.

This is **scoped to the agent run**, not a global shell environment.

## [​](https://docs.molt.bot/tools/skills\#session-snapshot-performance)  Session snapshot (performance)

Moltbot snapshots the eligible skills **when a session starts** and reuses that list for subsequent turns in the same session. Changes to skills or config take effect on the next new session.Skills can also refresh mid-session when the skills watcher is enabled or when a new eligible remote node appears (see below). Think of this as a **hot reload**: the refreshed list is picked up on the next agent turn.

## [​](https://docs.molt.bot/tools/skills\#remote-macos-nodes-linux-gateway)  Remote macOS nodes (Linux gateway)

If the Gateway is running on Linux but a **macOS node** is connected **with `system.run` allowed** (Exec approvals security not set to `deny`), Moltbot can treat macOS-only skills as eligible when the required binaries are present on that node. The agent should execute those skills via the `nodes` tool (typically `nodes.run`).This relies on the node reporting its command support and on a bin probe via `system.run`. If the macOS node goes offline later, the skills remain visible; invocations may fail until the node reconnects.

## [​](https://docs.molt.bot/tools/skills\#skills-watcher-auto-refresh)  Skills watcher (auto-refresh)

By default, Moltbot watches skill folders and bumps the skills snapshot when `SKILL.md` files change. Configure this under `skills.load`:

Copy

```
{
  skills: {
    load: {
      watch: true,
      watchDebounceMs: 250
    }
  }
}
```

## [​](https://docs.molt.bot/tools/skills\#token-impact-skills-list)  Token impact (skills list)

When skills are eligible, Moltbot injects a compact XML list of available skills into the system prompt (via `formatSkillsForPrompt` in `pi-coding-agent`). The cost is deterministic:

- **Base overhead (only when ≥1 skill):** 195 characters.
- **Per skill:** 97 characters + the length of the XML-escaped `<name>`, `<description>`, and `<location>` values.

Formula (characters):

Copy

```
total = 195 + Σ (97 + len(name_escaped) + len(description_escaped) + len(location_escaped))
```

Notes:

- XML escaping expands `& < > " '` into entities (`&amp;`, `&lt;`, etc.), increasing length.
- Token counts vary by model tokenizer. A rough OpenAI-style estimate is ~4 chars/token, so **97 chars ≈ 24 tokens** per skill plus your actual field lengths.

## [​](https://docs.molt.bot/tools/skills\#managed-skills-lifecycle)  Managed skills lifecycle

Moltbot ships a baseline set of skills as **bundled skills** as part of the
install (npm package or Moltbot.app). `~/.clawdbot/skills` exists for local
overrides (for example, pinning/patching a skill without changing the bundled
copy). Workspace skills are user-owned and override both on name conflicts.

## [​](https://docs.molt.bot/tools/skills\#config-reference)  Config reference

See [Skills config](https://docs.molt.bot/tools/skills-config) for the full configuration schema.

## [​](https://docs.molt.bot/tools/skills\#looking-for-more-skills)  Looking for more skills?

Browse [https://clawdhub.com](https://clawdhub.com/).

* * *

[Reactions](https://docs.molt.bot/tools/reactions) [Skills config](https://docs.molt.bot/tools/skills-config)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.