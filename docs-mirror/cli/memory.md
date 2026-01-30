---
source: https://docs.molt.bot/cli/memory
title: Memory - Moltbot
---

[Skip to main content](https://docs.molt.bot/cli/memory#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [moltbot memory](https://docs.molt.bot/cli/memory#moltbot-memory)
- [Examples](https://docs.molt.bot/cli/memory#examples)
- [Options](https://docs.molt.bot/cli/memory#options)

# [​](https://docs.molt.bot/cli/memory\#moltbot-memory)  `moltbot memory`

Manage semantic memory indexing and search.
Provided by the active memory plugin (default: `memory-core`; set `plugins.slots.memory = "none"` to disable).Related:

- Memory concept: [Memory](https://docs.molt.bot/concepts/memory)
- Plugins: [Plugins](https://docs.molt.bot/plugins)

## [​](https://docs.molt.bot/cli/memory\#examples)  Examples

Copy

```
moltbot memory status
moltbot memory status --deep
moltbot memory status --deep --index
moltbot memory status --deep --index --verbose
moltbot memory index
moltbot memory index --verbose
moltbot memory search "release checklist"
moltbot memory status --agent main
moltbot memory index --agent main --verbose
```

## [​](https://docs.molt.bot/cli/memory\#options)  Options

Common:

- `--agent <id>`: scope to a single agent (default: all configured agents).
- `--verbose`: emit detailed logs during probes and indexing.

Notes:

- `memory status --deep` probes vector + embedding availability.
- `memory status --deep --index` runs a reindex if the store is dirty.
- `memory index --verbose` prints per-phase details (provider, model, sources, batch activity).
- `memory status` includes any extra paths configured via `memorySearch.extraPaths`.

[Plugins](https://docs.molt.bot/cli/plugins) [Models](https://docs.molt.bot/cli/models)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.