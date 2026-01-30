---
source: https://docs.molt.bot/gateway/openresponses-http-api
title: Openresponses http api - Moltbot
---

[Skip to main content](https://docs.molt.bot/gateway/openresponses-http-api#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [OpenResponses API (HTTP)](https://docs.molt.bot/gateway/openresponses-http-api#openresponses-api-http)
- [Authentication](https://docs.molt.bot/gateway/openresponses-http-api#authentication)
- [Choosing an agent](https://docs.molt.bot/gateway/openresponses-http-api#choosing-an-agent)
- [Enabling the endpoint](https://docs.molt.bot/gateway/openresponses-http-api#enabling-the-endpoint)
- [Disabling the endpoint](https://docs.molt.bot/gateway/openresponses-http-api#disabling-the-endpoint)
- [Session behavior](https://docs.molt.bot/gateway/openresponses-http-api#session-behavior)
- [Request shape (supported)](https://docs.molt.bot/gateway/openresponses-http-api#request-shape-supported)
- [Items (input)](https://docs.molt.bot/gateway/openresponses-http-api#items-input)
- [message](https://docs.molt.bot/gateway/openresponses-http-api#message)
- [function\_call\_output (turn-based tools)](https://docs.molt.bot/gateway/openresponses-http-api#function_call_output-turn-based-tools)
- [reasoning and item\_reference](https://docs.molt.bot/gateway/openresponses-http-api#reasoning-and-item_reference)
- [Tools (client-side function tools)](https://docs.molt.bot/gateway/openresponses-http-api#tools-client-side-function-tools)
- [Images (input\_image)](https://docs.molt.bot/gateway/openresponses-http-api#images-input_image)
- [Files (input\_file)](https://docs.molt.bot/gateway/openresponses-http-api#files-input_file)
- [File + image limits (config)](https://docs.molt.bot/gateway/openresponses-http-api#file-%2B-image-limits-config)
- [Streaming (SSE)](https://docs.molt.bot/gateway/openresponses-http-api#streaming-sse)
- [Usage](https://docs.molt.bot/gateway/openresponses-http-api#usage)
- [Errors](https://docs.molt.bot/gateway/openresponses-http-api#errors)
- [Examples](https://docs.molt.bot/gateway/openresponses-http-api#examples)

# [​](https://docs.molt.bot/gateway/openresponses-http-api\#openresponses-api-http)  OpenResponses API (HTTP)

Moltbot’s Gateway can serve an OpenResponses-compatible `POST /v1/responses` endpoint.This endpoint is **disabled by default**. Enable it in config first.

- `POST /v1/responses`
- Same port as the Gateway (WS + HTTP multiplex): `http://<gateway-host>:<port>/v1/responses`

Under the hood, requests are executed as a normal Gateway agent run (same codepath as
`moltbot agent`), so routing/permissions/config match your Gateway.

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#authentication)  Authentication

Uses the Gateway auth configuration. Send a bearer token:

- `Authorization: Bearer <token>`

Notes:

- When `gateway.auth.mode="token"`, use `gateway.auth.token` (or `CLAWDBOT_GATEWAY_TOKEN`).
- When `gateway.auth.mode="password"`, use `gateway.auth.password` (or `CLAWDBOT_GATEWAY_PASSWORD`).

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#choosing-an-agent)  Choosing an agent

No custom headers required: encode the agent id in the OpenResponses `model` field:

- `model: "moltbot:<agentId>"` (example: `"moltbot:main"`, `"moltbot:beta"`)
- `model: "agent:<agentId>"` (alias)

Or target a specific Moltbot agent by header:

- `x-moltbot-agent-id: <agentId>` (default: `main`)

Advanced:

- `x-moltbot-session-key: <sessionKey>` to fully control session routing.

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#enabling-the-endpoint)  Enabling the endpoint

Set `gateway.http.endpoints.responses.enabled` to `true`:

Copy

```
{
  gateway: {
    http: {
      endpoints: {
        responses: { enabled: true }
      }
    }
  }
}
```

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#disabling-the-endpoint)  Disabling the endpoint

Set `gateway.http.endpoints.responses.enabled` to `false`:

Copy

```
{
  gateway: {
    http: {
      endpoints: {
        responses: { enabled: false }
      }
    }
  }
}
```

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#session-behavior)  Session behavior

By default the endpoint is **stateless per request** (a new session key is generated each call).If the request includes an OpenResponses `user` string, the Gateway derives a stable session key
from it, so repeated calls can share an agent session.

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#request-shape-supported)  Request shape (supported)

The request follows the OpenResponses API with item-based input. Current support:

- `input`: string or array of item objects.
- `instructions`: merged into the system prompt.
- `tools`: client tool definitions (function tools).
- `tool_choice`: filter or require client tools.
- `stream`: enables SSE streaming.
- `max_output_tokens`: best-effort output limit (provider dependent).
- `user`: stable session routing.

Accepted but **currently ignored**:

- `max_tool_calls`
- `reasoning`
- `metadata`
- `store`
- `previous_response_id`
- `truncation`

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#items-input)  Items (input)

### [​](https://docs.molt.bot/gateway/openresponses-http-api\#message)  `message`

Roles: `system`, `developer`, `user`, `assistant`.

- `system` and `developer` are appended to the system prompt.
- The most recent `user` or `function_call_output` item becomes the “current message.”
- Earlier user/assistant messages are included as history for context.

### [​](https://docs.molt.bot/gateway/openresponses-http-api\#function_call_output-turn-based-tools)  `function_call_output` (turn-based tools)

Send tool results back to the model:

Copy

```
{
  "type": "function_call_output",
  "call_id": "call_123",
  "output": "{\"temperature\": \"72F\"}"
}
```

### [​](https://docs.molt.bot/gateway/openresponses-http-api\#reasoning-and-item_reference)  `reasoning` and `item_reference`

Accepted for schema compatibility but ignored when building the prompt.

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#tools-client-side-function-tools)  Tools (client-side function tools)

Provide tools with `tools: [{ type: "function", function: { name, description?, parameters? } }]`.If the agent decides to call a tool, the response returns a `function_call` output item.
You then send a follow-up request with `function_call_output` to continue the turn.

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#images-input_image)  Images (`input_image`)

Supports base64 or URL sources:

Copy

```
{
  "type": "input_image",
  "source": { "type": "url", "url": "https://example.com/image.png" }
}
```

Allowed MIME types (current): `image/jpeg`, `image/png`, `image/gif`, `image/webp`.
Max size (current): 10MB.

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#files-input_file)  Files (`input_file`)

Supports base64 or URL sources:

Copy

```
{
  "type": "input_file",
  "source": {
    "type": "base64",
    "media_type": "text/plain",
    "data": "SGVsbG8gV29ybGQh",
    "filename": "hello.txt"
  }
}
```

Allowed MIME types (current): `text/plain`, `text/markdown`, `text/html`, `text/csv`,
`application/json`, `application/pdf`.Max size (current): 5MB.Current behavior:

- File content is decoded and added to the **system prompt**, not the user message,
so it stays ephemeral (not persisted in session history).
- PDFs are parsed for text. If little text is found, the first pages are rasterized
into images and passed to the model.

PDF parsing uses the Node-friendly `pdfjs-dist` legacy build (no worker). The modern
PDF.js build expects browser workers/DOM globals, so it is not used in the Gateway.URL fetch defaults:

- `files.allowUrl`: `true`
- `images.allowUrl`: `true`
- Requests are guarded (DNS resolution, private IP blocking, redirect caps, timeouts).

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#file-+-image-limits-config)  File + image limits (config)

Defaults can be tuned under `gateway.http.endpoints.responses`:

Copy

```
{
  gateway: {
    http: {
      endpoints: {
        responses: {
          enabled: true,
          maxBodyBytes: 20000000,
          files: {
            allowUrl: true,
            allowedMimes: ["text/plain", "text/markdown", "text/html", "text/csv", "application/json", "application/pdf"],
            maxBytes: 5242880,
            maxChars: 200000,
            maxRedirects: 3,
            timeoutMs: 10000,
            pdf: {
              maxPages: 4,
              maxPixels: 4000000,
              minTextChars: 200
            }
          },
          images: {
            allowUrl: true,
            allowedMimes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
            maxBytes: 10485760,
            maxRedirects: 3,
            timeoutMs: 10000
          }
        }
      }
    }
  }
}
```

Defaults when omitted:

- `maxBodyBytes`: 20MB
- `files.maxBytes`: 5MB
- `files.maxChars`: 200k
- `files.maxRedirects`: 3
- `files.timeoutMs`: 10s
- `files.pdf.maxPages`: 4
- `files.pdf.maxPixels`: 4,000,000
- `files.pdf.minTextChars`: 200
- `images.maxBytes`: 10MB
- `images.maxRedirects`: 3
- `images.timeoutMs`: 10s

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#streaming-sse)  Streaming (SSE)

Set `stream: true` to receive Server-Sent Events (SSE):

- `Content-Type: text/event-stream`
- Each event line is `event: <type>` and `data: <json>`
- Stream ends with `data: [DONE]`

Event types currently emitted:

- `response.created`
- `response.in_progress`
- `response.output_item.added`
- `response.content_part.added`
- `response.output_text.delta`
- `response.output_text.done`
- `response.content_part.done`
- `response.output_item.done`
- `response.completed`
- `response.failed` (on error)

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#usage)  Usage

`usage` is populated when the underlying provider reports token counts.

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#errors)  Errors

Errors use a JSON object like:

Copy

```
{ "error": { "message": "...", "type": "invalid_request_error" } }
```

Common cases:

- `401` missing/invalid auth
- `400` invalid request body
- `405` wrong method

## [​](https://docs.molt.bot/gateway/openresponses-http-api\#examples)  Examples

Non-streaming:

Copy

```
curl -sS http://127.0.0.1:18789/v1/responses \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'x-moltbot-agent-id: main' \
  -d '{
    "model": "moltbot",
    "input": "hi"
  }'
```

Streaming:

Copy

```
curl -N http://127.0.0.1:18789/v1/responses \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'x-moltbot-agent-id: main' \
  -d '{
    "model": "moltbot",
    "stream": true,
    "input": "hi"
  }'
```

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.