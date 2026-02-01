---
source: https://docs.molt.bot/install/index
title: Index - Moltbot
---

[Skip to main content](https://docs.molt.bot/install/index#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Install](https://docs.molt.bot/install/index#install)
- [Quick install (recommended)](https://docs.molt.bot/install/index#quick-install-recommended)
- [System requirements](https://docs.molt.bot/install/index#system-requirements)
- [Choose your install path](https://docs.molt.bot/install/index#choose-your-install-path)
- [1) Installer script (recommended)](https://docs.molt.bot/install/index#1-installer-script-recommended)
- [2) Global install (manual)](https://docs.molt.bot/install/index#2-global-install-manual)
- [3) From source (contributors/dev)](https://docs.molt.bot/install/index#3-from-source-contributors%2Fdev)
- [4) Other install options](https://docs.molt.bot/install/index#4-other-install-options)
- [After install](https://docs.molt.bot/install/index#after-install)
- [Install method: npm vs git (installer)](https://docs.molt.bot/install/index#install-method%3A-npm-vs-git-installer)
- [CLI flags](https://docs.molt.bot/install/index#cli-flags)
- [Environment variables](https://docs.molt.bot/install/index#environment-variables)
- [Troubleshooting: moltbot not found (PATH)](https://docs.molt.bot/install/index#troubleshooting%3A-moltbot-not-found-path)
- [Update / uninstall](https://docs.molt.bot/install/index#update-%2F-uninstall)

# [​](https://docs.molt.bot/install/index\#install)  Install

Use the installer unless you have a reason not to. It sets up the CLI and runs onboarding.

## [​](https://docs.molt.bot/install/index\#quick-install-recommended)  Quick install (recommended)

Copy

```
curl -fsSL https://molt.bot/install.sh | bash
```

Windows (PowerShell):

Copy

```
iwr -useb https://molt.bot/install.ps1 | iex
```

Next step (if you skipped onboarding):

Copy

```
moltbot onboard --install-daemon
```

## [​](https://docs.molt.bot/install/index\#system-requirements)  System requirements

- **Node >=22**
- macOS, Linux, or Windows via WSL2
- `pnpm` only if you build from source

## [​](https://docs.molt.bot/install/index\#choose-your-install-path)  Choose your install path

### [​](https://docs.molt.bot/install/index\#1-installer-script-recommended)  1) Installer script (recommended)

Installs `moltbot` globally via npm and runs onboarding.

Copy

```
curl -fsSL https://molt.bot/install.sh | bash
```

Installer flags:

Copy

```
curl -fsSL https://molt.bot/install.sh | bash -s -- --help
```

Details: [Installer internals](https://docs.molt.bot/install/installer).Non-interactive (skip onboarding):

Copy

```
curl -fsSL https://molt.bot/install.sh | bash -s -- --no-onboard
```

### [​](https://docs.molt.bot/install/index\#2-global-install-manual)  2) Global install (manual)

If you already have Node:

Copy

```
npm install -g moltbot@latest
```

If you have libvips installed globally (common on macOS via Homebrew) and `sharp` fails to install, force prebuilt binaries:

Copy

```
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g moltbot@latest
```

If you see `sharp: Please add node-gyp to your dependencies`, either install build tooling (macOS: Xcode CLT + `npm install -g node-gyp`) or use the `SHARP_IGNORE_GLOBAL_LIBVIPS=1` workaround above to skip the native build.Or:

Copy

```
pnpm add -g moltbot@latest
```

Then:

Copy

```
moltbot onboard --install-daemon
```

### [​](https://docs.molt.bot/install/index\#3-from-source-contributors/dev)  3) From source (contributors/dev)

Copy

```
git clone https://github.com/moltbot/moltbot.git
cd moltbot
pnpm install
pnpm ui:build # auto-installs UI deps on first run
pnpm build
moltbot onboard --install-daemon
```

Tip: if you don’t have a global install yet, run repo commands via `pnpm moltbot ...`.

### [​](https://docs.molt.bot/install/index\#4-other-install-options)  4) Other install options

- Docker: [Docker](https://docs.molt.bot/install/docker)
- Nix: [Nix](https://docs.molt.bot/install/nix)
- Ansible: [Ansible](https://docs.molt.bot/install/ansible)
- Bun (CLI only): [Bun](https://docs.molt.bot/install/bun)

## [​](https://docs.molt.bot/install/index\#after-install)  After install

- Run onboarding: `moltbot onboard --install-daemon`
- Quick check: `moltbot doctor`
- Check gateway health: `moltbot status` \+ `moltbot health`
- Open the dashboard: `moltbot dashboard`

## [​](https://docs.molt.bot/install/index\#install-method:-npm-vs-git-installer)  Install method: npm vs git (installer)

The installer supports two methods:

- `npm` (default): `npm install -g moltbot@latest`
- `git`: clone/build from GitHub and run from a source checkout

### [​](https://docs.molt.bot/install/index\#cli-flags)  CLI flags

Copy

```
# Explicit npm
curl -fsSL https://molt.bot/install.sh | bash -s -- --install-method npm

# Install from GitHub (source checkout)
curl -fsSL https://molt.bot/install.sh | bash -s -- --install-method git
```

Common flags:

- `--install-method npm|git`
- `--git-dir <path>` (default: `~/moltbot`)
- `--no-git-update` (skip `git pull` when using an existing checkout)
- `--no-prompt` (disable prompts; required in CI/automation)
- `--dry-run` (print what would happen; make no changes)
- `--no-onboard` (skip onboarding)

### [​](https://docs.molt.bot/install/index\#environment-variables)  Environment variables

Equivalent env vars (useful for automation):

- `CLAWDBOT_INSTALL_METHOD=git|npm`
- `CLAWDBOT_GIT_DIR=...`
- `CLAWDBOT_GIT_UPDATE=0|1`
- `CLAWDBOT_NO_PROMPT=1`
- `CLAWDBOT_DRY_RUN=1`
- `CLAWDBOT_NO_ONBOARD=1`
- `SHARP_IGNORE_GLOBAL_LIBVIPS=0|1` (default: `1`; avoids `sharp` building against system libvips)

## [​](https://docs.molt.bot/install/index\#troubleshooting:-moltbot-not-found-path)  Troubleshooting: `moltbot` not found (PATH)

Quick diagnosis:

Copy

```
node -v
npm -v
npm prefix -g
echo "$PATH"
```

If `$(npm prefix -g)/bin` (macOS/Linux) or `$(npm prefix -g)` (Windows) is **not** present inside `echo "$PATH"`, your shell can’t find global npm binaries (including `moltbot`).Fix: add it to your shell startup file (zsh: `~/.zshrc`, bash: `~/.bashrc`):

Copy

```
# macOS / Linux
export PATH="$(npm prefix -g)/bin:$PATH"
```

On Windows, add the output of `npm prefix -g` to your PATH.Then open a new terminal (or `rehash` in zsh / `hash -r` in bash).

## [​](https://docs.molt.bot/install/index\#update-/-uninstall)  Update / uninstall

- Updates: [Updating](https://docs.molt.bot/install/updating)
- Migrate to a new machine: [Migrating](https://docs.molt.bot/install/migrating)
- Uninstall: [Uninstall](https://docs.molt.bot/install/uninstall)

[Faq](https://docs.molt.bot/help/faq) [Installer](https://docs.molt.bot/install/installer)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.