---
source: https://docs.molt.bot/gateway/tools-invoke-http-api
title: Tools invoke http api - Moltbot
---

[Skip to main content](https://docs.molt.bot/gateway/tools-invoke-http-api#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Tools Invoke (HTTP)](https://docs.molt.bot/gateway/tools-invoke-http-api#tools-invoke-http)
- [Authentication](https://docs.molt.bot/gateway/tools-invoke-http-api#authentication)
- [Request body](https://docs.molt.bot/gateway/tools-invoke-http-api#request-body)
- [Policy + routing behavior](https://docs.molt.bot/gateway/tools-invoke-http-api#policy-%2B-routing-behavior)
- [Responses](https://docs.molt.bot/gateway/tools-invoke-http-api#responses)
- [Example](https://docs.molt.bot/gateway/tools-invoke-http-api#example)

# [​](https://docs.molt.bot/gateway/tools-invoke-http-api\#tools-invoke-http)  Tools Invoke (HTTP)

Moltbot’s Gateway exposes a simple HTTP endpoint for invoking a single tool directly. It is always enabled, but gated by Gateway auth and tool policy.

- `POST /tools/invoke`
- Same port as the Gateway (WS + HTTP multiplex): `http://<gateway-host>:<port>/tools/invoke`

Default max payload size is 2 MB.

## [​](https://docs.molt.bot/gateway/tools-invoke-http-api\#authentication)  Authentication

Uses the Gateway auth configuration. Send a bearer token:

- `Authorization: Bearer <token>`

Notes:

- When `gateway.auth.mode="token"`, use `gateway.auth.token` (or `CLAWDBOT_GATEWAY_TOKEN`).
- When `gateway.auth.mode="password"`, use `gateway.auth.password` (or `CLAWDBOT_GATEWAY_PASSWORD`).

## [​](https://docs.molt.bot/gateway/tools-invoke-http-api\#request-body)  Request body

Copy

```
{
  "tool": "sessions_list",
  "action": "json",
  "args": {},
  "sessionKey": "main",
  "dryRun": false
}
```

Fields:

- `tool` (string, required): tool name to invoke.
- `action` (string, optional): mapped into args if the tool schema supports `action` and the args payload omitted it.
- `args` (object, optional): tool-specific arguments.
- `sessionKey` (string, optional): target session key. If omitted or `"main"`, the Gateway uses the configured main session key (honors `session.mainKey` and default agent, or `global` in global scope).
- `dryRun` (boolean, optional): reserved for future use; currently ignored.

## [​](https://docs.molt.bot/gateway/tools-invoke-http-api\#policy-+-routing-behavior)  Policy + routing behavior

Tool availability is filtered through the same policy chain used by Gateway agents:

- `tools.profile` / `tools.byProvider.profile`
- `tools.allow` / `tools.byProvider.allow`
- `agents.<id>.tools.allow` / `agents.<id>.tools.byProvider.allow`
- group policies (if the session key maps to a group or channel)
- subagent policy (when invoking with a subagent session key)

If a tool is not allowed by policy, the endpoint returns **404**.To help group policies resolve context, you can optionally set:

- `x-moltbot-message-channel: <channel>` (example: `slack`, `telegram`)
- `x-moltbot-account-id: <accountId>` (when multiple accounts exist)

## [​](https://docs.molt.bot/gateway/tools-invoke-http-api\#responses)  Responses

- `200` → `{ ok: true, result }`
- `400` → `{ ok: false, error: { type, message } }` (invalid request or tool error)
- `401` → unauthorized
- `404` → tool not available (not found or not allowlisted)
- `405` → method not allowed

## [​](https://docs.molt.bot/gateway/tools-invoke-http-api\#example)  Example

Copy

```
curl -sS http://127.0.0.1:18789/tools/invoke \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "tool": "sessions_list",
    "action": "json",
    "args": {}
  }'
```

[Openai http api](https://docs.molt.bot/gateway/openai-http-api) [Cli backends](https://docs.molt.bot/gateway/cli-backends)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.