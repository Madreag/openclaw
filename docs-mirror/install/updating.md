---
source: https://docs.molt.bot/install/updating
title: Updating - Moltbot
---

[Skip to main content](https://docs.molt.bot/install/updating#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Updating](https://docs.molt.bot/install/updating#updating)
- [Recommended: re-run the website installer (upgrade in place)](https://docs.molt.bot/install/updating#recommended%3A-re-run-the-website-installer-upgrade-in-place)
- [Before you update](https://docs.molt.bot/install/updating#before-you-update)
- [Update (global install)](https://docs.molt.bot/install/updating#update-global-install)
- [Update (moltbot update)](https://docs.molt.bot/install/updating#update-moltbot-update)
- [Update (Control UI / RPC)](https://docs.molt.bot/install/updating#update-control-ui-%2F-rpc)
- [Update (from source)](https://docs.molt.bot/install/updating#update-from-source)
- [Always Run: moltbot doctor](https://docs.molt.bot/install/updating#always-run%3A-moltbot-doctor)
- [Start / stop / restart the Gateway](https://docs.molt.bot/install/updating#start-%2F-stop-%2F-restart-the-gateway)
- [Rollback / pinning (when something breaks)](https://docs.molt.bot/install/updating#rollback-%2F-pinning-when-something-breaks)
- [Pin (global install)](https://docs.molt.bot/install/updating#pin-global-install)
- [Pin (source) by date](https://docs.molt.bot/install/updating#pin-source-by-date)
- [If you’re stuck](https://docs.molt.bot/install/updating#if-you%E2%80%99re-stuck)

# [​](https://docs.molt.bot/install/updating\#updating)  Updating

Moltbot is moving fast (pre “1.0”). Treat updates like shipping infra: update → run checks → restart (or use `moltbot update`, which restarts) → verify.

## [​](https://docs.molt.bot/install/updating\#recommended:-re-run-the-website-installer-upgrade-in-place)  Recommended: re-run the website installer (upgrade in place)

The **preferred** update path is to re-run the installer from the website. It
detects existing installs, upgrades in place, and runs `moltbot doctor` when
needed.

Copy

```
curl -fsSL https://molt.bot/install.sh | bash
```

Notes:

- Add `--no-onboard` if you don’t want the onboarding wizard to run again.
- For **source installs**, use:







Copy











```
curl -fsSL https://molt.bot/install.sh | bash -s -- --install-method git --no-onboard
```











The installer will `git pull --rebase` **only** if the repo is clean.
- For **global installs**, the script uses `npm install -g moltbot@latest` under the hood.
- Legacy note: `moltbot` remains available as a compatibility shim.

## [​](https://docs.molt.bot/install/updating\#before-you-update)  Before you update

- Know how you installed: **global** (npm/pnpm) vs **from source** (git clone).
- Know how your Gateway is running: **foreground terminal** vs **supervised service** (launchd/systemd).
- Snapshot your tailoring:
  - Config: `~/.clawdbot/moltbot.json`
  - Credentials: `~/.clawdbot/credentials/`
  - Workspace: `~/clawd`

## [​](https://docs.molt.bot/install/updating\#update-global-install)  Update (global install)

Global install (pick one):

Copy

```
npm i -g moltbot@latest
```

Copy

```
pnpm add -g moltbot@latest
```

We do **not** recommend Bun for the Gateway runtime (WhatsApp/Telegram bugs).To switch update channels (git + npm installs):

Copy

```
moltbot update --channel beta
moltbot update --channel dev
moltbot update --channel stable
```

Use `--tag <dist-tag|version>` for a one-off install tag/version.See [Development channels](https://docs.molt.bot/install/development-channels) for channel semantics and release notes.Note: on npm installs, the gateway logs an update hint on startup (checks the current channel tag). Disable via `update.checkOnStart: false`.Then:

Copy

```
moltbot doctor
moltbot gateway restart
moltbot health
```

Notes:

- If your Gateway runs as a service, `moltbot gateway restart` is preferred over killing PIDs.
- If you’re pinned to a specific version, see “Rollback / pinning” below.

## [​](https://docs.molt.bot/install/updating\#update-moltbot-update)  Update (`moltbot update`)

For **source installs** (git checkout), prefer:

Copy

```
moltbot update
```

It runs a safe-ish update flow:

- Requires a clean worktree.
- Switches to the selected channel (tag or branch).
- Fetches + rebases against the configured upstream (dev channel).
- Installs deps, builds, builds the Control UI, and runs `moltbot doctor`.
- Restarts the gateway by default (use `--no-restart` to skip).

If you installed via **npm/pnpm** (no git metadata), `moltbot update` will try to update via your package manager. If it can’t detect the install, use “Update (global install)” instead.

## [​](https://docs.molt.bot/install/updating\#update-control-ui-/-rpc)  Update (Control UI / RPC)

The Control UI has **Update & Restart** (RPC: `update.run`). It:

1. Runs the same source-update flow as `moltbot update` (git checkout only).
2. Writes a restart sentinel with a structured report (stdout/stderr tail).
3. Restarts the gateway and pings the last active session with the report.

If the rebase fails, the gateway aborts and restarts without applying the update.

## [​](https://docs.molt.bot/install/updating\#update-from-source)  Update (from source)

From the repo checkout:Preferred:

Copy

```
moltbot update
```

Manual (equivalent-ish):

Copy

```
git pull
pnpm install
pnpm build
pnpm ui:build # auto-installs UI deps on first run
moltbot doctor
moltbot health
```

Notes:

- `pnpm build` matters when you run the packaged `moltbot` binary ( [`moltbot.mjs`](https://github.com/moltbot/moltbot/blob/main/moltbot.mjs)) or use Node to run `dist/`.
- If you run from a repo checkout without a global install, use `pnpm moltbot ...` for CLI commands.
- If you run directly from TypeScript (`pnpm moltbot ...`), a rebuild is usually unnecessary, but **config migrations still apply** → run doctor.
- Switching between global and git installs is easy: install the other flavor, then run `moltbot doctor` so the gateway service entrypoint is rewritten to the current install.

## [​](https://docs.molt.bot/install/updating\#always-run:-moltbot-doctor)  Always Run: `moltbot doctor`

Doctor is the “safe update” command. It’s intentionally boring: repair + migrate + warn.Note: if you’re on a **source install** (git checkout), `moltbot doctor` will offer to run `moltbot update` first.Typical things it does:

- Migrate deprecated config keys / legacy config file locations.
- Audit DM policies and warn on risky “open” settings.
- Check Gateway health and can offer to restart.
- Detect and migrate older gateway services (launchd/systemd; legacy schtasks) to current Moltbot services.
- On Linux, ensure systemd user lingering (so the Gateway survives logout).

Details: [Doctor](https://docs.molt.bot/gateway/doctor)

## [​](https://docs.molt.bot/install/updating\#start-/-stop-/-restart-the-gateway)  Start / stop / restart the Gateway

CLI (works regardless of OS):

Copy

```
moltbot gateway status
moltbot gateway stop
moltbot gateway restart
moltbot gateway --port 18789
moltbot logs --follow
```

If you’re supervised:

- macOS launchd (app-bundled LaunchAgent): `launchctl kickstart -k gui/$UID/bot.molt.gateway` (use `bot.molt.<profile>`; legacy `com.clawdbot.*` still works)
- Linux systemd user service: `systemctl --user restart moltbot-gateway[-<profile>].service`
- Windows (WSL2): `systemctl --user restart moltbot-gateway[-<profile>].service`
  - `launchctl`/`systemctl` only work if the service is installed; otherwise run `moltbot gateway install`.

Runbook + exact service labels: [Gateway runbook](https://docs.molt.bot/gateway)

## [​](https://docs.molt.bot/install/updating\#rollback-/-pinning-when-something-breaks)  Rollback / pinning (when something breaks)

### [​](https://docs.molt.bot/install/updating\#pin-global-install)  Pin (global install)

Install a known-good version (replace `<version>` with the last working one):

Copy

```
npm i -g moltbot@<version>
```

Copy

```
pnpm add -g moltbot@<version>
```

Tip: to see the current published version, run `npm view moltbot version`.Then restart + re-run doctor:

Copy

```
moltbot doctor
moltbot gateway restart
```

### [​](https://docs.molt.bot/install/updating\#pin-source-by-date)  Pin (source) by date

Pick a commit from a date (example: “state of main as of 2026-01-01”):

Copy

```
git fetch origin
git checkout "$(git rev-list -n 1 --before=\"2026-01-01\" origin/main)"
```

Then reinstall deps + restart:

Copy

```
pnpm install
pnpm build
moltbot gateway restart
```

If you want to go back to latest later:

Copy

```
git checkout main
git pull
```

## [​](https://docs.molt.bot/install/updating\#if-you%E2%80%99re-stuck)  If you’re stuck

- Run `moltbot doctor` again and read the output carefully (it often tells you the fix).
- Check: [Troubleshooting](https://docs.molt.bot/gateway/troubleshooting)
- Ask in Discord: [https://channels.discord.gg/clawd](https://channels.discord.gg/clawd)

[Installer](https://docs.molt.bot/install/installer) [Development channels](https://docs.molt.bot/install/development-channels)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.