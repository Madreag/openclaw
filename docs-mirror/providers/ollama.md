---
source: https://docs.molt.bot/providers/ollama
title: Ollama - Moltbot
---

[Skip to main content](https://docs.molt.bot/providers/ollama#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Ollama](https://docs.molt.bot/providers/ollama#ollama)
- [Quick start](https://docs.molt.bot/providers/ollama#quick-start)
- [Model discovery (implicit provider)](https://docs.molt.bot/providers/ollama#model-discovery-implicit-provider)
- [Configuration](https://docs.molt.bot/providers/ollama#configuration)
- [Basic setup (implicit discovery)](https://docs.molt.bot/providers/ollama#basic-setup-implicit-discovery)
- [Explicit setup (manual models)](https://docs.molt.bot/providers/ollama#explicit-setup-manual-models)
- [Custom base URL (explicit config)](https://docs.molt.bot/providers/ollama#custom-base-url-explicit-config)
- [Model selection](https://docs.molt.bot/providers/ollama#model-selection)
- [Advanced](https://docs.molt.bot/providers/ollama#advanced)
- [Reasoning models](https://docs.molt.bot/providers/ollama#reasoning-models)
- [Model Costs](https://docs.molt.bot/providers/ollama#model-costs)
- [Context windows](https://docs.molt.bot/providers/ollama#context-windows)
- [Troubleshooting](https://docs.molt.bot/providers/ollama#troubleshooting)
- [Ollama not detected](https://docs.molt.bot/providers/ollama#ollama-not-detected)
- [No models available](https://docs.molt.bot/providers/ollama#no-models-available)
- [Connection refused](https://docs.molt.bot/providers/ollama#connection-refused)
- [See Also](https://docs.molt.bot/providers/ollama#see-also)

# [​](https://docs.molt.bot/providers/ollama\#ollama)  Ollama

Ollama is a local LLM runtime that makes it easy to run open-source models on your machine. Moltbot integrates with Ollama’s OpenAI-compatible API and can **auto-discover tool-capable models** when you opt in with `OLLAMA_API_KEY` (or an auth profile) and do not define an explicit `models.providers.ollama` entry.

## [​](https://docs.molt.bot/providers/ollama\#quick-start)  Quick start

1. Install Ollama: [https://ollama.ai](https://ollama.ai/)
2. Pull a model:

Copy

```
ollama pull llama3.3
# or
ollama pull qwen2.5-coder:32b
# or
ollama pull deepseek-r1:32b
```

3. Enable Ollama for Moltbot (any value works; Ollama doesn’t require a real key):

Copy

```
# Set environment variable
export OLLAMA_API_KEY="ollama-local"

# Or configure in your config file
moltbot config set models.providers.ollama.apiKey "ollama-local"
```

4. Use Ollama models:

Copy

```
{
  agents: {
    defaults: {
      model: { primary: "ollama/llama3.3" }
    }
  }
}
```

## [​](https://docs.molt.bot/providers/ollama\#model-discovery-implicit-provider)  Model discovery (implicit provider)

When you set `OLLAMA_API_KEY` (or an auth profile) and **do not** define `models.providers.ollama`, Moltbot discovers models from the local Ollama instance at `http://127.0.0.1:11434`:

- Queries `/api/tags` and `/api/show`
- Keeps only models that report `tools` capability
- Marks `reasoning` when the model reports `thinking`
- Reads `contextWindow` from `model_info["<arch>.context_length"]` when available
- Sets `maxTokens` to 10× the context window
- Sets all costs to `0`

This avoids manual model entries while keeping the catalog aligned with Ollama’s capabilities.To see what models are available:

Copy

```
ollama list
moltbot models list
```

To add a new model, simply pull it with Ollama:

Copy

```
ollama pull mistral
```

The new model will be automatically discovered and available to use.If you set `models.providers.ollama` explicitly, auto-discovery is skipped and you must define models manually (see below).

## [​](https://docs.molt.bot/providers/ollama\#configuration)  Configuration

### [​](https://docs.molt.bot/providers/ollama\#basic-setup-implicit-discovery)  Basic setup (implicit discovery)

The simplest way to enable Ollama is via environment variable:

Copy

```
export OLLAMA_API_KEY="ollama-local"
```

### [​](https://docs.molt.bot/providers/ollama\#explicit-setup-manual-models)  Explicit setup (manual models)

Use explicit config when:

- Ollama runs on another host/port.
- You want to force specific context windows or model lists.
- You want to include models that do not report tool support.

Copy

```
{
  models: {
    providers: {
      ollama: {
        // Use a host that includes /v1 for OpenAI-compatible APIs
        baseUrl: "http://ollama-host:11434/v1",
        apiKey: "ollama-local",
        api: "openai-completions",
        models: [\
          {\
            id: "llama3.3",\
            name: "Llama 3.3",\
            reasoning: false,\
            input: ["text"],\
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },\
            contextWindow: 8192,\
            maxTokens: 8192 * 10\
          }\
        ]
      }
    }
  }
}
```

If `OLLAMA_API_KEY` is set, you can omit `apiKey` in the provider entry and Moltbot will fill it for availability checks.

### [​](https://docs.molt.bot/providers/ollama\#custom-base-url-explicit-config)  Custom base URL (explicit config)

If Ollama is running on a different host or port (explicit config disables auto-discovery, so define models manually):

Copy

```
{
  models: {
    providers: {
      ollama: {
        apiKey: "ollama-local",
        baseUrl: "http://ollama-host:11434/v1"
      }
    }
  }
}
```

### [​](https://docs.molt.bot/providers/ollama\#model-selection)  Model selection

Once configured, all your Ollama models are available:

Copy

```
{
  agents: {
    defaults: {
      model: {
        primary: "ollama/llama3.3",
        fallback: ["ollama/qwen2.5-coder:32b"]
      }
    }
  }
}
```

## [​](https://docs.molt.bot/providers/ollama\#advanced)  Advanced

### [​](https://docs.molt.bot/providers/ollama\#reasoning-models)  Reasoning models

Moltbot marks models as reasoning-capable when Ollama reports `thinking` in `/api/show`:

Copy

```
ollama pull deepseek-r1:32b
```

### [​](https://docs.molt.bot/providers/ollama\#model-costs)  Model Costs

Ollama is free and runs locally, so all model costs are set to $0.

### [​](https://docs.molt.bot/providers/ollama\#context-windows)  Context windows

For auto-discovered models, Moltbot uses the context window reported by Ollama when available, otherwise it defaults to `8192`. You can override `contextWindow` and `maxTokens` in explicit provider config.

## [​](https://docs.molt.bot/providers/ollama\#troubleshooting)  Troubleshooting

### [​](https://docs.molt.bot/providers/ollama\#ollama-not-detected)  Ollama not detected

Make sure Ollama is running and that you set `OLLAMA_API_KEY` (or an auth profile), and that you did **not** define an explicit `models.providers.ollama` entry:

Copy

```
ollama serve
```

And that the API is accessible:

Copy

```
curl http://localhost:11434/api/tags
```

### [​](https://docs.molt.bot/providers/ollama\#no-models-available)  No models available

Moltbot only auto-discovers models that report tool support. If your model isn’t listed, either:

- Pull a tool-capable model, or
- Define the model explicitly in `models.providers.ollama`.

To add models:

Copy

```
ollama list  # See what's installed
ollama pull llama3.3  # Pull a model
```

### [​](https://docs.molt.bot/providers/ollama\#connection-refused)  Connection refused

Check that Ollama is running on the correct port:

Copy

```
# Check if Ollama is running
ps aux | grep ollama

# Or restart Ollama
ollama serve
```

## [​](https://docs.molt.bot/providers/ollama\#see-also)  See Also

- [Model Providers](https://docs.molt.bot/concepts/model-providers) \- Overview of all providers
- [Model Selection](https://docs.molt.bot/concepts/models) \- How to choose models
- [Configuration](https://docs.molt.bot/gateway/configuration) \- Full config reference

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.