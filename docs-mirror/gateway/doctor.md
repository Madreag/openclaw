---
source: https://docs.molt.bot/gateway/doctor
title: Doctor - Moltbot
---

[Skip to main content](https://docs.molt.bot/gateway/doctor#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Doctor](https://docs.molt.bot/gateway/doctor#doctor)
- [Quick start](https://docs.molt.bot/gateway/doctor#quick-start)
- [Headless / automation](https://docs.molt.bot/gateway/doctor#headless-%2F-automation)
- [What it does (summary)](https://docs.molt.bot/gateway/doctor#what-it-does-summary)
- [Detailed behavior and rationale](https://docs.molt.bot/gateway/doctor#detailed-behavior-and-rationale)
- [0) Optional update (git installs)](https://docs.molt.bot/gateway/doctor#0-optional-update-git-installs)
- [1) Config normalization](https://docs.molt.bot/gateway/doctor#1-config-normalization)
- [2) Legacy config key migrations](https://docs.molt.bot/gateway/doctor#2-legacy-config-key-migrations)
- [2b) OpenCode Zen provider overrides](https://docs.molt.bot/gateway/doctor#2b-opencode-zen-provider-overrides)
- [3) Legacy state migrations (disk layout)](https://docs.molt.bot/gateway/doctor#3-legacy-state-migrations-disk-layout)
- [4) State integrity checks (session persistence, routing, and safety)](https://docs.molt.bot/gateway/doctor#4-state-integrity-checks-session-persistence%2C-routing%2C-and-safety)
- [5) Model auth health (OAuth expiry)](https://docs.molt.bot/gateway/doctor#5-model-auth-health-oauth-expiry)
- [6) Hooks model validation](https://docs.molt.bot/gateway/doctor#6-hooks-model-validation)
- [7) Sandbox image repair](https://docs.molt.bot/gateway/doctor#7-sandbox-image-repair)
- [8) Gateway service migrations and cleanup hints](https://docs.molt.bot/gateway/doctor#8-gateway-service-migrations-and-cleanup-hints)
- [9) Security warnings](https://docs.molt.bot/gateway/doctor#9-security-warnings)
- [10) systemd linger (Linux)](https://docs.molt.bot/gateway/doctor#10-systemd-linger-linux)
- [11) Skills status](https://docs.molt.bot/gateway/doctor#11-skills-status)
- [12) Gateway auth checks (local token)](https://docs.molt.bot/gateway/doctor#12-gateway-auth-checks-local-token)
- [13) Gateway health check + restart](https://docs.molt.bot/gateway/doctor#13-gateway-health-check-%2B-restart)
- [14) Channel status warnings](https://docs.molt.bot/gateway/doctor#14-channel-status-warnings)
- [15) Supervisor config audit + repair](https://docs.molt.bot/gateway/doctor#15-supervisor-config-audit-%2B-repair)
- [16) Gateway runtime + port diagnostics](https://docs.molt.bot/gateway/doctor#16-gateway-runtime-%2B-port-diagnostics)
- [17) Gateway runtime best practices](https://docs.molt.bot/gateway/doctor#17-gateway-runtime-best-practices)
- [18) Config write + wizard metadata](https://docs.molt.bot/gateway/doctor#18-config-write-%2B-wizard-metadata)
- [19) Workspace tips (backup + memory system)](https://docs.molt.bot/gateway/doctor#19-workspace-tips-backup-%2B-memory-system)

# [​](https://docs.molt.bot/gateway/doctor\#doctor)  Doctor

`moltbot doctor` is the repair + migration tool for Moltbot. It fixes stale
config/state, checks health, and provides actionable repair steps.

## [​](https://docs.molt.bot/gateway/doctor\#quick-start)  Quick start

Copy

```
moltbot doctor
```

### [​](https://docs.molt.bot/gateway/doctor\#headless-/-automation)  Headless / automation

Copy

```
moltbot doctor --yes
```

Accept defaults without prompting (including restart/service/sandbox repair steps when applicable).

Copy

```
moltbot doctor --repair
```

Apply recommended repairs without prompting (repairs + restarts where safe).

Copy

```
moltbot doctor --repair --force
```

Apply aggressive repairs too (overwrites custom supervisor configs).

Copy

```
moltbot doctor --non-interactive
```

Run without prompts and only apply safe migrations (config normalization + on-disk state moves). Skips restart/service/sandbox actions that require human confirmation.
Legacy state migrations run automatically when detected.

Copy

```
moltbot doctor --deep
```

Scan system services for extra gateway installs (launchd/systemd/schtasks).If you want to review changes before writing, open the config file first:

Copy

```
cat ~/.clawdbot/moltbot.json
```

## [​](https://docs.molt.bot/gateway/doctor\#what-it-does-summary)  What it does (summary)

- Optional pre-flight update for git installs (interactive only).
- UI protocol freshness check (rebuilds Control UI when the protocol schema is newer).
- Health check + restart prompt.
- Skills status summary (eligible/missing/blocked).
- Config normalization for legacy values.
- OpenCode Zen provider override warnings (`models.providers.opencode`).
- Legacy on-disk state migration (sessions/agent dir/WhatsApp auth).
- State integrity and permissions checks (sessions, transcripts, state dir).
- Config file permission checks (chmod 600) when running locally.
- Model auth health: checks OAuth expiry, can refresh expiring tokens, and reports auth-profile cooldown/disabled states.
- Extra workspace dir detection (`~/moltbot`).
- Sandbox image repair when sandboxing is enabled.
- Legacy service migration and extra gateway detection.
- Gateway runtime checks (service installed but not running; cached launchd label).
- Channel status warnings (probed from the running gateway).
- Supervisor config audit (launchd/systemd/schtasks) with optional repair.
- Gateway runtime best-practice checks (Node vs Bun, version-manager paths).
- Gateway port collision diagnostics (default `18789`).
- Security warnings for open DM policies.
- Gateway auth warnings when no `gateway.auth.token` is set (local mode; offers token generation).
- systemd linger check on Linux.
- Source install checks (pnpm workspace mismatch, missing UI assets, missing tsx binary).
- Writes updated config + wizard metadata.

## [​](https://docs.molt.bot/gateway/doctor\#detailed-behavior-and-rationale)  Detailed behavior and rationale

### [​](https://docs.molt.bot/gateway/doctor\#0-optional-update-git-installs)  0) Optional update (git installs)

If this is a git checkout and doctor is running interactively, it offers to
update (fetch/rebase/build) before running doctor.

### [​](https://docs.molt.bot/gateway/doctor\#1-config-normalization)  1) Config normalization

If the config contains legacy value shapes (for example `messages.ackReaction`
without a channel-specific override), doctor normalizes them into the current
schema.

### [​](https://docs.molt.bot/gateway/doctor\#2-legacy-config-key-migrations)  2) Legacy config key migrations

When the config contains deprecated keys, other commands refuse to run and ask
you to run `moltbot doctor`.Doctor will:

- Explain which legacy keys were found.
- Show the migration it applied.
- Rewrite `~/.clawdbot/moltbot.json` with the updated schema.

The Gateway also auto-runs doctor migrations on startup when it detects a
legacy config format, so stale configs are repaired without manual intervention.Current migrations:

- `routing.allowFrom` → `channels.whatsapp.allowFrom`
- `routing.groupChat.requireMention` → `channels.whatsapp/telegram/imessage.groups."*".requireMention`
- `routing.groupChat.historyLimit` → `messages.groupChat.historyLimit`
- `routing.groupChat.mentionPatterns` → `messages.groupChat.mentionPatterns`
- `routing.queue` → `messages.queue`
- `routing.bindings` → top-level `bindings`
- `routing.agents`/`routing.defaultAgentId` → `agents.list` \+ `agents.list[].default`
- `routing.agentToAgent` → `tools.agentToAgent`
- `routing.transcribeAudio` → `tools.media.audio.models`
- `bindings[].match.accountID` → `bindings[].match.accountId`
- `identity` → `agents.list[].identity`
- `agent.*` → `agents.defaults` \+ `tools.*` (tools/elevated/exec/sandbox/subagents)
- `agent.model`/`allowedModels`/`modelAliases`/`modelFallbacks`/`imageModelFallbacks`
→ `agents.defaults.models` \+ `agents.defaults.model.primary/fallbacks` \+ `agents.defaults.imageModel.primary/fallbacks`

### [​](https://docs.molt.bot/gateway/doctor\#2b-opencode-zen-provider-overrides)  2b) OpenCode Zen provider overrides

If you’ve added `models.providers.opencode` (or `opencode-zen`) manually, it
overrides the built-in OpenCode Zen catalog from `@mariozechner/pi-ai`. That can
force every model onto a single API or zero out costs. Doctor warns so you can
remove the override and restore per-model API routing + costs.

### [​](https://docs.molt.bot/gateway/doctor\#3-legacy-state-migrations-disk-layout)  3) Legacy state migrations (disk layout)

Doctor can migrate older on-disk layouts into the current structure:

- Sessions store + transcripts:
  - from `~/.clawdbot/sessions/` to `~/.clawdbot/agents/<agentId>/sessions/`
- Agent dir:
  - from `~/.clawdbot/agent/` to `~/.clawdbot/agents/<agentId>/agent/`
- WhatsApp auth state (Baileys):
  - from legacy `~/.clawdbot/credentials/*.json` (except `oauth.json`)
  - to `~/.clawdbot/credentials/whatsapp/<accountId>/...` (default account id: `default`)

These migrations are best-effort and idempotent; doctor will emit warnings when
it leaves any legacy folders behind as backups. The Gateway/CLI also auto-migrates
the legacy sessions + agent dir on startup so history/auth/models land in the
per-agent path without a manual doctor run. WhatsApp auth is intentionally only
migrated via `moltbot doctor`.

### [​](https://docs.molt.bot/gateway/doctor\#4-state-integrity-checks-session-persistence,-routing,-and-safety)  4) State integrity checks (session persistence, routing, and safety)

The state directory is the operational brainstem. If it vanishes, you lose
sessions, credentials, logs, and config (unless you have backups elsewhere).Doctor checks:

- **State dir missing**: warns about catastrophic state loss, prompts to recreate
the directory, and reminds you that it cannot recover missing data.
- **State dir permissions**: verifies writability; offers to repair permissions
(and emits a `chown` hint when owner/group mismatch is detected).
- **Session dirs missing**: `sessions/` and the session store directory are
required to persist history and avoid `ENOENT` crashes.
- **Transcript mismatch**: warns when recent session entries have missing
transcript files.
- **Main session “1-line JSONL”**: flags when the main transcript has only one
line (history is not accumulating).
- **Multiple state dirs**: warns when multiple `~/.clawdbot` folders exist across
home directories or when `CLAWDBOT_STATE_DIR` points elsewhere (history can
split between installs).
- **Remote mode reminder**: if `gateway.mode=remote`, doctor reminds you to run
it on the remote host (the state lives there).
- **Config file permissions**: warns if `~/.clawdbot/moltbot.json` is
group/world readable and offers to tighten to `600`.

### [​](https://docs.molt.bot/gateway/doctor\#5-model-auth-health-oauth-expiry)  5) Model auth health (OAuth expiry)

Doctor inspects OAuth profiles in the auth store, warns when tokens are
expiring/expired, and can refresh them when safe. If the Anthropic Claude Code
profile is stale, it suggests running `claude setup-token` (or pasting a setup-token).
Refresh prompts only appear when running interactively (TTY); `--non-interactive`
skips refresh attempts.Doctor also reports auth profiles that are temporarily unusable due to:

- short cooldowns (rate limits/timeouts/auth failures)
- longer disables (billing/credit failures)

### [​](https://docs.molt.bot/gateway/doctor\#6-hooks-model-validation)  6) Hooks model validation

If `hooks.gmail.model` is set, doctor validates the model reference against the
catalog and allowlist and warns when it won’t resolve or is disallowed.

### [​](https://docs.molt.bot/gateway/doctor\#7-sandbox-image-repair)  7) Sandbox image repair

When sandboxing is enabled, doctor checks Docker images and offers to build or
switch to legacy names if the current image is missing.

### [​](https://docs.molt.bot/gateway/doctor\#8-gateway-service-migrations-and-cleanup-hints)  8) Gateway service migrations and cleanup hints

Doctor detects legacy gateway services (launchd/systemd/schtasks) and
offers to remove them and install the Moltbot service using the current gateway
port. It can also scan for extra gateway-like services and print cleanup hints.
Profile-named Moltbot gateway services are considered first-class and are not
flagged as “extra.”

### [​](https://docs.molt.bot/gateway/doctor\#9-security-warnings)  9) Security warnings

Doctor emits warnings when a provider is open to DMs without an allowlist, or
when a policy is configured in a dangerous way.

### [​](https://docs.molt.bot/gateway/doctor\#10-systemd-linger-linux)  10) systemd linger (Linux)

If running as a systemd user service, doctor ensures lingering is enabled so the
gateway stays alive after logout.

### [​](https://docs.molt.bot/gateway/doctor\#11-skills-status)  11) Skills status

Doctor prints a quick summary of eligible/missing/blocked skills for the current
workspace.

### [​](https://docs.molt.bot/gateway/doctor\#12-gateway-auth-checks-local-token)  12) Gateway auth checks (local token)

Doctor warns when `gateway.auth` is missing on a local gateway and offers to
generate a token. Use `moltbot doctor --generate-gateway-token` to force token
creation in automation.

### [​](https://docs.molt.bot/gateway/doctor\#13-gateway-health-check-+-restart)  13) Gateway health check + restart

Doctor runs a health check and offers to restart the gateway when it looks
unhealthy.

### [​](https://docs.molt.bot/gateway/doctor\#14-channel-status-warnings)  14) Channel status warnings

If the gateway is healthy, doctor runs a channel status probe and reports
warnings with suggested fixes.

### [​](https://docs.molt.bot/gateway/doctor\#15-supervisor-config-audit-+-repair)  15) Supervisor config audit + repair

Doctor checks the installed supervisor config (launchd/systemd/schtasks) for
missing or outdated defaults (e.g., systemd network-online dependencies and
restart delay). When it finds a mismatch, it recommends an update and can
rewrite the service file/task to the current defaults.Notes:

- `moltbot doctor` prompts before rewriting supervisor config.
- `moltbot doctor --yes` accepts the default repair prompts.
- `moltbot doctor --repair` applies recommended fixes without prompts.
- `moltbot doctor --repair --force` overwrites custom supervisor configs.
- You can always force a full rewrite via `moltbot gateway install --force`.

### [​](https://docs.molt.bot/gateway/doctor\#16-gateway-runtime-+-port-diagnostics)  16) Gateway runtime + port diagnostics

Doctor inspects the service runtime (PID, last exit status) and warns when the
service is installed but not actually running. It also checks for port collisions
on the gateway port (default `18789`) and reports likely causes (gateway already
running, SSH tunnel).

### [​](https://docs.molt.bot/gateway/doctor\#17-gateway-runtime-best-practices)  17) Gateway runtime best practices

Doctor warns when the gateway service runs on Bun or a version-managed Node path
(`nvm`, `fnm`, `volta`, `asdf`, etc.). WhatsApp + Telegram channels require Node,
and version-manager paths can break after upgrades because the service does not
load your shell init. Doctor offers to migrate to a system Node install when
available (Homebrew/apt/choco).

### [​](https://docs.molt.bot/gateway/doctor\#18-config-write-+-wizard-metadata)  18) Config write + wizard metadata

Doctor persists any config changes and stamps wizard metadata to record the
doctor run.

### [​](https://docs.molt.bot/gateway/doctor\#19-workspace-tips-backup-+-memory-system)  19) Workspace tips (backup + memory system)

Doctor suggests a workspace memory system when missing and prints a backup tip
if the workspace is not already under git.See [/concepts/agent-workspace](https://docs.molt.bot/concepts/agent-workspace) for a full guide to
workspace structure and git backup (recommended private GitHub or GitLab).

[Heartbeat](https://docs.molt.bot/gateway/heartbeat) [Logging](https://docs.molt.bot/gateway/logging)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.