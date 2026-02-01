---
source: https://docs.molt.bot/gateway/authentication
title: Authentication - Moltbot
---

[Skip to main content](https://docs.molt.bot/gateway/authentication#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Authentication](https://docs.molt.bot/gateway/authentication#authentication)
- [Recommended Anthropic setup (API key)](https://docs.molt.bot/gateway/authentication#recommended-anthropic-setup-api-key)
- [Anthropic: setup-token (subscription auth)](https://docs.molt.bot/gateway/authentication#anthropic%3A-setup-token-subscription-auth)
- [Checking model auth status](https://docs.molt.bot/gateway/authentication#checking-model-auth-status)
- [Controlling which credential is used](https://docs.molt.bot/gateway/authentication#controlling-which-credential-is-used)
- [Per-session (chat command)](https://docs.molt.bot/gateway/authentication#per-session-chat-command)
- [Per-agent (CLI override)](https://docs.molt.bot/gateway/authentication#per-agent-cli-override)
- [Troubleshooting](https://docs.molt.bot/gateway/authentication#troubleshooting)
- [“No credentials found”](https://docs.molt.bot/gateway/authentication#%E2%80%9Cno-credentials-found%E2%80%9D)
- [Token expiring/expired](https://docs.molt.bot/gateway/authentication#token-expiring%2Fexpired)
- [Requirements](https://docs.molt.bot/gateway/authentication#requirements)

# [​](https://docs.molt.bot/gateway/authentication\#authentication)  Authentication

Moltbot supports OAuth and API keys for model providers. For Anthropic
accounts, we recommend using an **API key**. For Claude subscription access,
use the long‑lived token created by `claude setup-token`.See [/concepts/oauth](https://docs.molt.bot/concepts/oauth) for the full OAuth flow and storage
layout.

## [​](https://docs.molt.bot/gateway/authentication\#recommended-anthropic-setup-api-key)  Recommended Anthropic setup (API key)

If you’re using Anthropic directly, use an API key.

1. Create an API key in the Anthropic Console.
2. Put it on the **gateway host** (the machine running `moltbot gateway`).

Copy

```
export ANTHROPIC_API_KEY="..."
moltbot models status
```

3. If the Gateway runs under systemd/launchd, prefer putting the key in
`~/.clawdbot/.env` so the daemon can read it:

Copy

```
cat >> ~/.clawdbot/.env <<'EOF'
ANTHROPIC_API_KEY=...
EOF
```

Then restart the daemon (or restart your Gateway process) and re-check:

Copy

```
moltbot models status
moltbot doctor
```

If you’d rather not manage env vars yourself, the onboarding wizard can store
API keys for daemon use: `moltbot onboard`.See [Help](https://docs.molt.bot/help) for details on env inheritance (`env.shellEnv`,
`~/.clawdbot/.env`, systemd/launchd).

## [​](https://docs.molt.bot/gateway/authentication\#anthropic:-setup-token-subscription-auth)  Anthropic: setup-token (subscription auth)

For Anthropic, the recommended path is an **API key**. If you’re using a Claude
subscription, the setup-token flow is also supported. Run it on the **gateway host**:

Copy

```
claude setup-token
```

Then paste it into Moltbot:

Copy

```
moltbot models auth setup-token --provider anthropic
```

If the token was created on another machine, paste it manually:

Copy

```
moltbot models auth paste-token --provider anthropic
```

If you see an Anthropic error like:

Copy

```
This credential is only authorized for use with Claude Code and cannot be used for other API requests.
```

…use an Anthropic API key instead.Manual token entry (any provider; writes `auth-profiles.json` \+ updates config):

Copy

```
moltbot models auth paste-token --provider anthropic
moltbot models auth paste-token --provider openrouter
```

Automation-friendly check (exit `1` when expired/missing, `2` when expiring):

Copy

```
moltbot models status --check
```

Optional ops scripts (systemd/Termux) are documented here:
[/automation/auth-monitoring](https://docs.molt.bot/automation/auth-monitoring)

> `claude setup-token` requires an interactive TTY.

## [​](https://docs.molt.bot/gateway/authentication\#checking-model-auth-status)  Checking model auth status

Copy

```
moltbot models status
moltbot doctor
```

## [​](https://docs.molt.bot/gateway/authentication\#controlling-which-credential-is-used)  Controlling which credential is used

### [​](https://docs.molt.bot/gateway/authentication\#per-session-chat-command)  Per-session (chat command)

Use `/model <alias-or-id>@<profileId>` to pin a specific provider credential for the current session (example profile ids: `anthropic:default`, `anthropic:work`).Use `/model` (or `/model list`) for a compact picker; use `/model status` for the full view (candidates + next auth profile, plus provider endpoint details when configured).

### [​](https://docs.molt.bot/gateway/authentication\#per-agent-cli-override)  Per-agent (CLI override)

Set an explicit auth profile order override for an agent (stored in that agent’s `auth-profiles.json`):

Copy

```
moltbot models auth order get --provider anthropic
moltbot models auth order set --provider anthropic anthropic:default
moltbot models auth order clear --provider anthropic
```

Use `--agent <id>` to target a specific agent; omit it to use the configured default agent.

## [​](https://docs.molt.bot/gateway/authentication\#troubleshooting)  Troubleshooting

### [​](https://docs.molt.bot/gateway/authentication\#%E2%80%9Cno-credentials-found%E2%80%9D)  “No credentials found”

If the Anthropic token profile is missing, run `claude setup-token` on the
**gateway host**, then re-check:

Copy

```
moltbot models status
```

### [​](https://docs.molt.bot/gateway/authentication\#token-expiring/expired)  Token expiring/expired

Run `moltbot models status` to confirm which profile is expiring. If the profile
is missing, rerun `claude setup-token` and paste the token again.

## [​](https://docs.molt.bot/gateway/authentication\#requirements)  Requirements

- Claude Max or Pro subscription (for `claude setup-token`)
- Claude Code CLI installed (`claude` command available)

[Configuration examples](https://docs.molt.bot/gateway/configuration-examples) [Openai http api](https://docs.molt.bot/gateway/openai-http-api)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.