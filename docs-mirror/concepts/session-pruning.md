---
source: https://docs.molt.bot/concepts/session-pruning
title: Session pruning - Moltbot
---

[Skip to main content](https://docs.molt.bot/concepts/session-pruning#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Session Pruning](https://docs.molt.bot/concepts/session-pruning#session-pruning)
- [When it runs](https://docs.molt.bot/concepts/session-pruning#when-it-runs)
- [Smart defaults (Anthropic)](https://docs.molt.bot/concepts/session-pruning#smart-defaults-anthropic)
- [What this improves (cost + cache behavior)](https://docs.molt.bot/concepts/session-pruning#what-this-improves-cost-%2B-cache-behavior)
- [What can be pruned](https://docs.molt.bot/concepts/session-pruning#what-can-be-pruned)
- [Context window estimation](https://docs.molt.bot/concepts/session-pruning#context-window-estimation)
- [Mode](https://docs.molt.bot/concepts/session-pruning#mode)
- [cache-ttl](https://docs.molt.bot/concepts/session-pruning#cache-ttl)
- [Soft vs hard pruning](https://docs.molt.bot/concepts/session-pruning#soft-vs-hard-pruning)
- [Tool selection](https://docs.molt.bot/concepts/session-pruning#tool-selection)
- [Interaction with other limits](https://docs.molt.bot/concepts/session-pruning#interaction-with-other-limits)
- [Defaults (when enabled)](https://docs.molt.bot/concepts/session-pruning#defaults-when-enabled)
- [Examples](https://docs.molt.bot/concepts/session-pruning#examples)

# [​](https://docs.molt.bot/concepts/session-pruning\#session-pruning)  Session Pruning

Session pruning trims **old tool results** from the in-memory context right before each LLM call. It does **not** rewrite the on-disk session history (`*.jsonl`).

## [​](https://docs.molt.bot/concepts/session-pruning\#when-it-runs)  When it runs

- When `mode: "cache-ttl"` is enabled and the last Anthropic call for the session is older than `ttl`.
- Only affects the messages sent to the model for that request.
- Only active for Anthropic API calls (and OpenRouter Anthropic models).
- For best results, match `ttl` to your model `cacheControlTtl`.
- After a prune, the TTL window resets so subsequent requests keep cache until `ttl` expires again.

## [​](https://docs.molt.bot/concepts/session-pruning\#smart-defaults-anthropic)  Smart defaults (Anthropic)

- **OAuth or setup-token** profiles: enable `cache-ttl` pruning and set heartbeat to `1h`.
- **API key** profiles: enable `cache-ttl` pruning, set heartbeat to `30m`, and default `cacheControlTtl` to `1h` on Anthropic models.
- If you set any of these values explicitly, Moltbot does **not** override them.

## [​](https://docs.molt.bot/concepts/session-pruning\#what-this-improves-cost-+-cache-behavior)  What this improves (cost + cache behavior)

- **Why prune:** Anthropic prompt caching only applies within the TTL. If a session goes idle past the TTL, the next request re-caches the full prompt unless you trim it first.
- **What gets cheaper:** pruning reduces the **cacheWrite** size for that first request after the TTL expires.
- **Why the TTL reset matters:** once pruning runs, the cache window resets, so follow‑up requests can reuse the freshly cached prompt instead of re-caching the full history again.
- **What it does not do:** pruning doesn’t add tokens or “double” costs; it only changes what gets cached on that first post‑TTL request.

## [​](https://docs.molt.bot/concepts/session-pruning\#what-can-be-pruned)  What can be pruned

- Only `toolResult` messages.
- User + assistant messages are **never** modified.
- The last `keepLastAssistants` assistant messages are protected; tool results after that cutoff are not pruned.
- If there aren’t enough assistant messages to establish the cutoff, pruning is skipped.
- Tool results containing **image blocks** are skipped (never trimmed/cleared).

## [​](https://docs.molt.bot/concepts/session-pruning\#context-window-estimation)  Context window estimation

Pruning uses an estimated context window (chars ≈ tokens × 4). The window size is resolved in this order:

1. Model definition `contextWindow` (from the model registry).
2. `models.providers.*.models[].contextWindow` override.
3. `agents.defaults.contextTokens`.
4. Default `200000` tokens.

## [​](https://docs.molt.bot/concepts/session-pruning\#mode)  Mode

### [​](https://docs.molt.bot/concepts/session-pruning\#cache-ttl)  cache-ttl

- Pruning only runs if the last Anthropic call is older than `ttl` (default `5m`).
- When it runs: same soft-trim + hard-clear behavior as before.

## [​](https://docs.molt.bot/concepts/session-pruning\#soft-vs-hard-pruning)  Soft vs hard pruning

- **Soft-trim**: only for oversized tool results.

  - Keeps head + tail, inserts `...`, and appends a note with the original size.
  - Skips results with image blocks.
- **Hard-clear**: replaces the entire tool result with `hardClear.placeholder`.

## [​](https://docs.molt.bot/concepts/session-pruning\#tool-selection)  Tool selection

- `tools.allow` / `tools.deny` support `*` wildcards.
- Deny wins.
- Matching is case-insensitive.
- Empty allow list => all tools allowed.

## [​](https://docs.molt.bot/concepts/session-pruning\#interaction-with-other-limits)  Interaction with other limits

- Built-in tools already truncate their own output; session pruning is an extra layer that prevents long-running chats from accumulating too much tool output in the model context.
- Compaction is separate: compaction summarizes and persists, pruning is transient per request. See [/concepts/compaction](https://docs.molt.bot/concepts/compaction).

## [​](https://docs.molt.bot/concepts/session-pruning\#defaults-when-enabled)  Defaults (when enabled)

- `ttl`: `"5m"`
- `keepLastAssistants`: `3`
- `softTrimRatio`: `0.3`
- `hardClearRatio`: `0.5`
- `minPrunableToolChars`: `50000`
- `softTrim`: `{ maxChars: 4000, headChars: 1500, tailChars: 1500 }`
- `hardClear`: `{ enabled: true, placeholder: "[Old tool result content cleared]" }`

## [​](https://docs.molt.bot/concepts/session-pruning\#examples)  Examples

Default (off):

Copy

```
{
  agent: {
    contextPruning: { mode: "off" }
  }
}
```

Enable TTL-aware pruning:

Copy

```
{
  agent: {
    contextPruning: { mode: "cache-ttl", ttl: "5m" }
  }
}
```

Restrict pruning to specific tools:

Copy

```
{
  agent: {
    contextPruning: {
      mode: "cache-ttl",
      tools: { allow: ["exec", "read"], deny: ["*image*"] }
    }
  }
}
```

See config reference: [Gateway Configuration](https://docs.molt.bot/gateway/configuration)

[Session](https://docs.molt.bot/concepts/session) [Sessions](https://docs.molt.bot/concepts/sessions)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.