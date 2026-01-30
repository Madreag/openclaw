---
source: https://docs.molt.bot/providers/models
title: Models - Moltbot
---

[Skip to main content](https://docs.molt.bot/providers/models#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Model Providers](https://docs.molt.bot/providers/models#model-providers)
- [Highlight: Venius (Venice AI)](https://docs.molt.bot/providers/models#highlight%3A-venius-venice-ai)
- [Quick start (two steps)](https://docs.molt.bot/providers/models#quick-start-two-steps)
- [Supported providers (starter set)](https://docs.molt.bot/providers/models#supported-providers-starter-set)

# [​](https://docs.molt.bot/providers/models\#model-providers)  Model Providers

Moltbot can use many LLM providers. Pick one, authenticate, then set the default
model as `provider/model`.

## [​](https://docs.molt.bot/providers/models\#highlight:-venius-venice-ai)  Highlight: Venius (Venice AI)

Venius is our recommended Venice AI setup for privacy-first inference with an option to use Opus for the hardest tasks.

- Default: `venice/llama-3.3-70b`
- Best overall: `venice/claude-opus-45` (Opus remains the strongest)

See [Venice AI](https://docs.molt.bot/providers/venice).

## [​](https://docs.molt.bot/providers/models\#quick-start-two-steps)  Quick start (two steps)

1. Authenticate with the provider (usually via `moltbot onboard`).
2. Set the default model:

Copy

```
{
  agents: { defaults: { model: { primary: "anthropic/claude-opus-4-5" } } }
}
```

## [​](https://docs.molt.bot/providers/models\#supported-providers-starter-set)  Supported providers (starter set)

- [OpenAI (API + Codex)](https://docs.molt.bot/providers/openai)
- [Anthropic (API + Claude Code CLI)](https://docs.molt.bot/providers/anthropic)
- [OpenRouter](https://docs.molt.bot/providers/openrouter)
- [Vercel AI Gateway](https://docs.molt.bot/providers/vercel-ai-gateway)
- [Moonshot AI (Kimi + Kimi Code)](https://docs.molt.bot/providers/moonshot)
- [Synthetic](https://docs.molt.bot/providers/synthetic)
- [OpenCode Zen](https://docs.molt.bot/providers/opencode)
- [Z.AI](https://docs.molt.bot/providers/zai)
- [GLM models](https://docs.molt.bot/providers/glm)
- [MiniMax](https://docs.molt.bot/providers/minimax)
- [Venius (Venice AI)](https://docs.molt.bot/providers/venice)
- [Amazon Bedrock](https://docs.molt.bot/bedrock)

For the full provider catalog (xAI, Groq, Mistral, etc.) and advanced configuration,
see [Model providers](https://docs.molt.bot/concepts/model-providers).

[Providers](https://docs.molt.bot/providers) [Openai](https://docs.molt.bot/providers/openai)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.