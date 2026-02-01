---
source: https://docs.molt.bot/cli/agents
title: Agents - Moltbot
---

[Skip to main content](https://docs.molt.bot/cli/agents#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [moltbot agents](https://docs.molt.bot/cli/agents#moltbot-agents)
- [Examples](https://docs.molt.bot/cli/agents#examples)
- [Identity files](https://docs.molt.bot/cli/agents#identity-files)
- [Set identity](https://docs.molt.bot/cli/agents#set-identity)

# [​](https://docs.molt.bot/cli/agents\#moltbot-agents)  `moltbot agents`

Manage isolated agents (workspaces + auth + routing).Related:

- Multi-agent routing: [Multi-Agent Routing](https://docs.molt.bot/concepts/multi-agent)
- Agent workspace: [Agent workspace](https://docs.molt.bot/concepts/agent-workspace)

## [​](https://docs.molt.bot/cli/agents\#examples)  Examples

Copy

```
moltbot agents list
moltbot agents add work --workspace ~/clawd-work
moltbot agents set-identity --workspace ~/clawd --from-identity
moltbot agents set-identity --agent main --avatar avatars/clawd.png
moltbot agents delete work
```

## [​](https://docs.molt.bot/cli/agents\#identity-files)  Identity files

Each agent workspace can include an `IDENTITY.md` at the workspace root:

- Example path: `~/clawd/IDENTITY.md`
- `set-identity --from-identity` reads from the workspace root (or an explicit `--identity-file`)

Avatar paths resolve relative to the workspace root.

## [​](https://docs.molt.bot/cli/agents\#set-identity)  Set identity

`set-identity` writes fields into `agents.list[].identity`:

- `name`
- `theme`
- `emoji`
- `avatar` (workspace-relative path, http(s) URL, or data URI)

Load from `IDENTITY.md`:

Copy

```
moltbot agents set-identity --workspace ~/clawd --from-identity
```

Override fields explicitly:

Copy

```
moltbot agents set-identity --agent main --name "Clawd" --emoji "🦞" --avatar avatars/clawd.png
```

Config sample:

Copy

```
{
  agents: {
    list: [\
      {\
        id: "main",\
        identity: {\
          name: "Clawd",\
          theme: "space lobster",\
          emoji: "🦞",\
          avatar: "avatars/clawd.png"\
        }\
      }\
    ]
  }
}
```

[Agent](https://docs.molt.bot/cli/agent) [Status](https://docs.molt.bot/cli/status)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.