---
source: https://docs.molt.bot/tools/llm-task
title: Llm task - Moltbot
---

[Skip to main content](https://docs.molt.bot/tools/llm-task#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [LLM Task](https://docs.molt.bot/tools/llm-task#llm-task)
- [Enable the plugin](https://docs.molt.bot/tools/llm-task#enable-the-plugin)
- [Config (optional)](https://docs.molt.bot/tools/llm-task#config-optional)
- [Tool parameters](https://docs.molt.bot/tools/llm-task#tool-parameters)
- [Output](https://docs.molt.bot/tools/llm-task#output)
- [Example: Lobster workflow step](https://docs.molt.bot/tools/llm-task#example%3A-lobster-workflow-step)
- [Safety notes](https://docs.molt.bot/tools/llm-task#safety-notes)

# [​](https://docs.molt.bot/tools/llm-task\#llm-task)  LLM Task

`llm-task` is an **optional plugin tool** that runs a JSON-only LLM task and
returns structured output (optionally validated against JSON Schema).This is ideal for workflow engines like Lobster: you can add a single LLM step
without writing custom Moltbot code for each workflow.

## [​](https://docs.molt.bot/tools/llm-task\#enable-the-plugin)  Enable the plugin

1. Enable the plugin:

Copy

```
{
  "plugins": {
    "entries": {
      "llm-task": { "enabled": true }
    }
  }
}
```

2. Allowlist the tool (it is registered with `optional: true`):

Copy

```
{
  "agents": {
    "list": [\
      {\
        "id": "main",\
        "tools": { "allow": ["llm-task"] }\
      }\
    ]
  }
}
```

## [​](https://docs.molt.bot/tools/llm-task\#config-optional)  Config (optional)

Copy

```
{
  "plugins": {
    "entries": {
      "llm-task": {
        "enabled": true,
        "config": {
          "defaultProvider": "openai-codex",
          "defaultModel": "gpt-5.2",
          "defaultAuthProfileId": "main",
          "allowedModels": ["openai-codex/gpt-5.2"],
          "maxTokens": 800,
          "timeoutMs": 30000
        }
      }
    }
  }
}
```

`allowedModels` is an allowlist of `provider/model` strings. If set, any request
outside the list is rejected.

## [​](https://docs.molt.bot/tools/llm-task\#tool-parameters)  Tool parameters

- `prompt` (string, required)
- `input` (any, optional)
- `schema` (object, optional JSON Schema)
- `provider` (string, optional)
- `model` (string, optional)
- `authProfileId` (string, optional)
- `temperature` (number, optional)
- `maxTokens` (number, optional)
- `timeoutMs` (number, optional)

## [​](https://docs.molt.bot/tools/llm-task\#output)  Output

Returns `details.json` containing the parsed JSON (and validates against
`schema` when provided).

## [​](https://docs.molt.bot/tools/llm-task\#example:-lobster-workflow-step)  Example: Lobster workflow step

Copy

```
clawd.invoke --tool llm-task --action json --args-json '{
  "prompt": "Given the input email, return intent and draft.",
  "input": {
    "subject": "Hello",
    "body": "Can you help?"
  },
  "schema": {
    "type": "object",
    "properties": {
      "intent": { "type": "string" },
      "draft": { "type": "string" }
    },
    "required": ["intent", "draft"],
    "additionalProperties": false
  }
}'
```

## [​](https://docs.molt.bot/tools/llm-task\#safety-notes)  Safety notes

- The tool is **JSON-only** and instructs the model to output only JSON (no
code fences, no commentary).
- No tools are exposed to the model for this run.
- Treat output as untrusted unless you validate with `schema`.
- Put approvals before any side-effecting step (send, post, exec).

[Lobster](https://docs.molt.bot/tools/lobster) [Plugin](https://docs.molt.bot/plugin)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.