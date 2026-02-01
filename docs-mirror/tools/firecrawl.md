---
source: https://docs.molt.bot/tools/firecrawl
title: Firecrawl - Moltbot
---

[Skip to main content](https://docs.molt.bot/tools/firecrawl#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Firecrawl](https://docs.molt.bot/tools/firecrawl#firecrawl)
- [Get an API key](https://docs.molt.bot/tools/firecrawl#get-an-api-key)
- [Configure Firecrawl](https://docs.molt.bot/tools/firecrawl#configure-firecrawl)
- [Stealth / bot circumvention](https://docs.molt.bot/tools/firecrawl#stealth-%2F-bot-circumvention)
- [How web\_fetch uses Firecrawl](https://docs.molt.bot/tools/firecrawl#how-web_fetch-uses-firecrawl)

# [​](https://docs.molt.bot/tools/firecrawl\#firecrawl)  Firecrawl

Moltbot can use **Firecrawl** as a fallback extractor for `web_fetch`. It is a hosted
content extraction service that supports bot circumvention and caching, which helps
with JS-heavy sites or pages that block plain HTTP fetches.

## [​](https://docs.molt.bot/tools/firecrawl\#get-an-api-key)  Get an API key

1. Create a Firecrawl account and generate an API key.
2. Store it in config or set `FIRECRAWL_API_KEY` in the gateway environment.

## [​](https://docs.molt.bot/tools/firecrawl\#configure-firecrawl)  Configure Firecrawl

Copy

```
{
  tools: {
    web: {
      fetch: {
        firecrawl: {
          apiKey: "FIRECRAWL_API_KEY_HERE",
          baseUrl: "https://api.firecrawl.dev",
          onlyMainContent: true,
          maxAgeMs: 172800000,
          timeoutSeconds: 60
        }
      }
    }
  }
}
```

Notes:

- `firecrawl.enabled` defaults to true when an API key is present.
- `maxAgeMs` controls how old cached results can be (ms). Default is 2 days.

## [​](https://docs.molt.bot/tools/firecrawl\#stealth-/-bot-circumvention)  Stealth / bot circumvention

Firecrawl exposes a **proxy mode** parameter for bot circumvention (`basic`, `stealth`, or `auto`).
Moltbot always uses `proxy: "auto"` plus `storeInCache: true` for Firecrawl requests.
If proxy is omitted, Firecrawl defaults to `auto`. `auto` retries with stealth proxies if a basic attempt fails, which may use more credits
than basic-only scraping.

## [​](https://docs.molt.bot/tools/firecrawl\#how-web_fetch-uses-firecrawl)  How `web_fetch` uses Firecrawl

`web_fetch` extraction order:

1. Readability (local)
2. Firecrawl (if configured)
3. Basic HTML cleanup (last fallback)

See [Web tools](https://docs.molt.bot/tools/web) for the full web tool setup.

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.