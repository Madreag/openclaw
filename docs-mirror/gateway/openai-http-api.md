---
source: https://docs.molt.bot/gateway/openai-http-api
title: Openai http api - Moltbot
---

[Skip to main content](https://docs.molt.bot/gateway/openai-http-api#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [OpenAI Chat Completions (HTTP)](https://docs.molt.bot/gateway/openai-http-api#openai-chat-completions-http)
- [Authentication](https://docs.molt.bot/gateway/openai-http-api#authentication)
- [Choosing an agent](https://docs.molt.bot/gateway/openai-http-api#choosing-an-agent)
- [Enabling the endpoint](https://docs.molt.bot/gateway/openai-http-api#enabling-the-endpoint)
- [Disabling the endpoint](https://docs.molt.bot/gateway/openai-http-api#disabling-the-endpoint)
- [Session behavior](https://docs.molt.bot/gateway/openai-http-api#session-behavior)
- [Streaming (SSE)](https://docs.molt.bot/gateway/openai-http-api#streaming-sse)
- [Examples](https://docs.molt.bot/gateway/openai-http-api#examples)

# [​](https://docs.molt.bot/gateway/openai-http-api\#openai-chat-completions-http)  OpenAI Chat Completions (HTTP)

Moltbot’s Gateway can serve a small OpenAI-compatible Chat Completions endpoint.This endpoint is **disabled by default**. Enable it in config first.

- `POST /v1/chat/completions`
- Same port as the Gateway (WS + HTTP multiplex): `http://<gateway-host>:<port>/v1/chat/completions`

Under the hood, requests are executed as a normal Gateway agent run (same codepath as `moltbot agent`), so routing/permissions/config match your Gateway.

## [​](https://docs.molt.bot/gateway/openai-http-api\#authentication)  Authentication

Uses the Gateway auth configuration. Send a bearer token:

- `Authorization: Bearer <token>`

Notes:

- When `gateway.auth.mode="token"`, use `gateway.auth.token` (or `CLAWDBOT_GATEWAY_TOKEN`).
- When `gateway.auth.mode="password"`, use `gateway.auth.password` (or `CLAWDBOT_GATEWAY_PASSWORD`).

## [​](https://docs.molt.bot/gateway/openai-http-api\#choosing-an-agent)  Choosing an agent

No custom headers required: encode the agent id in the OpenAI `model` field:

- `model: "moltbot:<agentId>"` (example: `"moltbot:main"`, `"moltbot:beta"`)
- `model: "agent:<agentId>"` (alias)

Or target a specific Moltbot agent by header:

- `x-moltbot-agent-id: <agentId>` (default: `main`)

Advanced:

- `x-moltbot-session-key: <sessionKey>` to fully control session routing.

## [​](https://docs.molt.bot/gateway/openai-http-api\#enabling-the-endpoint)  Enabling the endpoint

Set `gateway.http.endpoints.chatCompletions.enabled` to `true`:

Copy

```
{
  gateway: {
    http: {
      endpoints: {
        chatCompletions: { enabled: true }
      }
    }
  }
}
```

## [​](https://docs.molt.bot/gateway/openai-http-api\#disabling-the-endpoint)  Disabling the endpoint

Set `gateway.http.endpoints.chatCompletions.enabled` to `false`:

Copy

```
{
  gateway: {
    http: {
      endpoints: {
        chatCompletions: { enabled: false }
      }
    }
  }
}
```

## [​](https://docs.molt.bot/gateway/openai-http-api\#session-behavior)  Session behavior

By default the endpoint is **stateless per request** (a new session key is generated each call).If the request includes an OpenAI `user` string, the Gateway derives a stable session key from it, so repeated calls can share an agent session.

## [​](https://docs.molt.bot/gateway/openai-http-api\#streaming-sse)  Streaming (SSE)

Set `stream: true` to receive Server-Sent Events (SSE):

- `Content-Type: text/event-stream`
- Each event line is `data: <json>`
- Stream ends with `data: [DONE]`

## [​](https://docs.molt.bot/gateway/openai-http-api\#examples)  Examples

Non-streaming:

Copy

```
curl -sS http://127.0.0.1:18789/v1/chat/completions \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'x-moltbot-agent-id: main' \
  -d '{
    "model": "moltbot",
    "messages": [{"role":"user","content":"hi"}]
  }'
```

Streaming:

Copy

```
curl -N http://127.0.0.1:18789/v1/chat/completions \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'x-moltbot-agent-id: main' \
  -d '{
    "model": "moltbot",
    "stream": true,
    "messages": [{"role":"user","content":"hi"}]
  }'
```

[Authentication](https://docs.molt.bot/gateway/authentication) [Tools invoke http api](https://docs.molt.bot/gateway/tools-invoke-http-api)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.