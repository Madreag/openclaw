---
source: https://docs.molt.bot/concepts/oauth
title: Oauth - Moltbot
---

[Skip to main content](https://docs.molt.bot/concepts/oauth#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [OAuth](https://docs.molt.bot/concepts/oauth#oauth)
- [The token sink (why it exists)](https://docs.molt.bot/concepts/oauth#the-token-sink-why-it-exists)
- [Storage (where tokens live)](https://docs.molt.bot/concepts/oauth#storage-where-tokens-live)
- [Anthropic setup-token (subscription auth)](https://docs.molt.bot/concepts/oauth#anthropic-setup-token-subscription-auth)
- [OAuth exchange (how login works)](https://docs.molt.bot/concepts/oauth#oauth-exchange-how-login-works)
- [Anthropic (Claude Pro/Max) setup-token](https://docs.molt.bot/concepts/oauth#anthropic-claude-pro%2Fmax-setup-token)
- [OpenAI Codex (ChatGPT OAuth)](https://docs.molt.bot/concepts/oauth#openai-codex-chatgpt-oauth)
- [Refresh + expiry](https://docs.molt.bot/concepts/oauth#refresh-%2B-expiry)
- [Multiple accounts (profiles) + routing](https://docs.molt.bot/concepts/oauth#multiple-accounts-profiles-%2B-routing)
- [1) Preferred: separate agents](https://docs.molt.bot/concepts/oauth#1-preferred%3A-separate-agents)
- [2) Advanced: multiple profiles in one agent](https://docs.molt.bot/concepts/oauth#2-advanced%3A-multiple-profiles-in-one-agent)

# [​](https://docs.molt.bot/concepts/oauth\#oauth)  OAuth

Moltbot supports “subscription auth” via OAuth for providers that offer it (notably **OpenAI Codex (ChatGPT OAuth)**). For Anthropic subscriptions, use the **setup-token** flow. This page explains:

- how the OAuth **token exchange** works (PKCE)
- where tokens are **stored** (and why)
- how to handle **multiple accounts** (profiles + per-session overrides)

Moltbot also supports **provider plugins** that ship their own OAuth or API‑key
flows. Run them via:

Copy

```
moltbot models auth login --provider <id>
```

## [​](https://docs.molt.bot/concepts/oauth\#the-token-sink-why-it-exists)  The token sink (why it exists)

OAuth providers commonly mint a **new refresh token** during login/refresh flows. Some providers (or OAuth clients) can invalidate older refresh tokens when a new one is issued for the same user/app.Practical symptom:

- you log in via Moltbot _and_ via Claude Code / Codex CLI → one of them randomly gets “logged out” later

To reduce that, Moltbot treats `auth-profiles.json` as a **token sink**:

- the runtime reads credentials from **one place**
- we can keep multiple profiles and route them deterministically

## [​](https://docs.molt.bot/concepts/oauth\#storage-where-tokens-live)  Storage (where tokens live)

Secrets are stored **per-agent**:

- Auth profiles (OAuth + API keys): `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`
- Runtime cache (managed automatically; don’t edit): `~/.clawdbot/agents/<agentId>/agent/auth.json`

Legacy import-only file (still supported, but not the main store):

- `~/.clawdbot/credentials/oauth.json` (imported into `auth-profiles.json` on first use)

All of the above also respect `$CLAWDBOT_STATE_DIR` (state dir override). Full reference: [/gateway/configuration](https://docs.molt.bot/gateway/configuration#auth-storage-oauth--api-keys)

## [​](https://docs.molt.bot/concepts/oauth\#anthropic-setup-token-subscription-auth)  Anthropic setup-token (subscription auth)

Run `claude setup-token` on any machine, then paste it into Moltbot:

Copy

```
moltbot models auth setup-token --provider anthropic
```

If you generated the token elsewhere, paste it manually:

Copy

```
moltbot models auth paste-token --provider anthropic
```

Verify:

Copy

```
moltbot models status
```

## [​](https://docs.molt.bot/concepts/oauth\#oauth-exchange-how-login-works)  OAuth exchange (how login works)

Moltbot’s interactive login flows are implemented in `@mariozechner/pi-ai` and wired into the wizards/commands.

### [​](https://docs.molt.bot/concepts/oauth\#anthropic-claude-pro/max-setup-token)  Anthropic (Claude Pro/Max) setup-token

Flow shape:

1. run `claude setup-token`
2. paste the token into Moltbot
3. store as a token auth profile (no refresh)

The wizard path is `moltbot onboard` → auth choice `setup-token` (Anthropic).

### [​](https://docs.molt.bot/concepts/oauth\#openai-codex-chatgpt-oauth)  OpenAI Codex (ChatGPT OAuth)

Flow shape (PKCE):

1. generate PKCE verifier/challenge + random `state`
2. open `https://auth.openai.com/oauth/authorize?...`
3. try to capture callback on `http://127.0.0.1:1455/auth/callback`
4. if callback can’t bind (or you’re remote/headless), paste the redirect URL/code
5. exchange at `https://auth.openai.com/oauth/token`
6. extract `accountId` from the access token and store `{ access, refresh, expires, accountId }`

Wizard path is `moltbot onboard` → auth choice `openai-codex`.

## [​](https://docs.molt.bot/concepts/oauth\#refresh-+-expiry)  Refresh + expiry

Profiles store an `expires` timestamp.At runtime:

- if `expires` is in the future → use the stored access token
- if expired → refresh (under a file lock) and overwrite the stored credentials

The refresh flow is automatic; you generally don’t need to manage tokens manually.

## [​](https://docs.molt.bot/concepts/oauth\#multiple-accounts-profiles-+-routing)  Multiple accounts (profiles) + routing

Two patterns:

### [​](https://docs.molt.bot/concepts/oauth\#1-preferred:-separate-agents)  1) Preferred: separate agents

If you want “personal” and “work” to never interact, use isolated agents (separate sessions + credentials + workspace):

Copy

```
moltbot agents add work
moltbot agents add personal
```

Then configure auth per-agent (wizard) and route chats to the right agent.

### [​](https://docs.molt.bot/concepts/oauth\#2-advanced:-multiple-profiles-in-one-agent)  2) Advanced: multiple profiles in one agent

`auth-profiles.json` supports multiple profile IDs for the same provider.Pick which profile is used:

- globally via config ordering (`auth.order`)
- per-session via `/model ...@<profileId>`

Example (session override):

- `/model Opus@anthropic:work`

How to see what profile IDs exist:

- `moltbot channels list --json` (shows `auth[]`)

Related docs:

- [/concepts/model-failover](https://docs.molt.bot/concepts/model-failover) (rotation + cooldown rules)
- [/tools/slash-commands](https://docs.molt.bot/tools/slash-commands) (command surface)

[Token use](https://docs.molt.bot/token-use) [Agent workspace](https://docs.molt.bot/concepts/agent-workspace)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.