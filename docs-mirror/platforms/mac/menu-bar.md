---
source: https://docs.molt.bot/platforms/mac/menu-bar
title: Menu bar - Moltbot
---

[Skip to main content](https://docs.molt.bot/platforms/mac/menu-bar#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Menu Bar Status Logic](https://docs.molt.bot/platforms/mac/menu-bar#menu-bar-status-logic)
- [What is shown](https://docs.molt.bot/platforms/mac/menu-bar#what-is-shown)
- [State model](https://docs.molt.bot/platforms/mac/menu-bar#state-model)
- [IconState enum (Swift)](https://docs.molt.bot/platforms/mac/menu-bar#iconstate-enum-swift)
- [ActivityKind → glyph](https://docs.molt.bot/platforms/mac/menu-bar#activitykind-%E2%86%92-glyph)
- [Visual mapping](https://docs.molt.bot/platforms/mac/menu-bar#visual-mapping)
- [Status row text (menu)](https://docs.molt.bot/platforms/mac/menu-bar#status-row-text-menu)
- [Event ingestion](https://docs.molt.bot/platforms/mac/menu-bar#event-ingestion)
- [Debug override](https://docs.molt.bot/platforms/mac/menu-bar#debug-override)
- [Testing checklist](https://docs.molt.bot/platforms/mac/menu-bar#testing-checklist)

# [​](https://docs.molt.bot/platforms/mac/menu-bar\#menu-bar-status-logic)  Menu Bar Status Logic

## [​](https://docs.molt.bot/platforms/mac/menu-bar\#what-is-shown)  What is shown

- We surface the current agent work state in the menu bar icon and in the first status row of the menu.
- Health status is hidden while work is active; it returns when all sessions are idle.
- The “Nodes” block in the menu lists **devices** only (paired nodes via `node.list`), not client/presence entries.
- A “Usage” section appears under Context when provider usage snapshots are available.

## [​](https://docs.molt.bot/platforms/mac/menu-bar\#state-model)  State model

- Sessions: events arrive with `runId` (per-run) plus `sessionKey` in the payload. The “main” session is the key `main`; if absent, we fall back to the most recently updated session.
- Priority: main always wins. If main is active, its state is shown immediately. If main is idle, the most recently active non‑main session is shown. We do not flip‑flop mid‑activity; we only switch when the current session goes idle or main becomes active.
- Activity kinds:
  - `job`: high‑level command execution (`state: started|streaming|done|error`).
  - `tool`: `phase: start|result` with `toolName` and `meta/args`.

## [​](https://docs.molt.bot/platforms/mac/menu-bar\#iconstate-enum-swift)  IconState enum (Swift)

- `idle`
- `workingMain(ActivityKind)`
- `workingOther(ActivityKind)`
- `overridden(ActivityKind)` (debug override)

### [​](https://docs.molt.bot/platforms/mac/menu-bar\#activitykind-%E2%86%92-glyph)  ActivityKind → glyph

- `exec` → 💻
- `read` → 📄
- `write` → ✍️
- `edit` → 📝
- `attach` → 📎
- default → 🛠️

### [​](https://docs.molt.bot/platforms/mac/menu-bar\#visual-mapping)  Visual mapping

- `idle`: normal critter.
- `workingMain`: badge with glyph, full tint, leg “working” animation.
- `workingOther`: badge with glyph, muted tint, no scurry.
- `overridden`: uses the chosen glyph/tint regardless of activity.

## [​](https://docs.molt.bot/platforms/mac/menu-bar\#status-row-text-menu)  Status row text (menu)

- While work is active: `<Session role> · <activity label>`
  - Examples: `Main · exec: pnpm test`, `Other · read: apps/macos/Sources/Moltbot/AppState.swift`.
- When idle: falls back to the health summary.

## [​](https://docs.molt.bot/platforms/mac/menu-bar\#event-ingestion)  Event ingestion

- Source: control‑channel `agent` events (`ControlChannel.handleAgentEvent`).
- Parsed fields:
  - `stream: "job"` with `data.state` for start/stop.
  - `stream: "tool"` with `data.phase`, `name`, optional `meta`/`args`.
- Labels:
  - `exec`: first line of `args.command`.
  - `read`/`write`: shortened path.
  - `edit`: path plus inferred change kind from `meta`/diff counts.
  - fallback: tool name.

## [​](https://docs.molt.bot/platforms/mac/menu-bar\#debug-override)  Debug override

- Settings ▸ Debug ▸ “Icon override” picker:
  - `System (auto)` (default)
  - `Working: main` (per tool kind)
  - `Working: other` (per tool kind)
  - `Idle`
- Stored via `@AppStorage("iconOverride")`; mapped to `IconState.overridden`.

## [​](https://docs.molt.bot/platforms/mac/menu-bar\#testing-checklist)  Testing checklist

- Trigger main session job: verify icon switches immediately and status row shows main label.
- Trigger non‑main session job while main idle: icon/status shows non‑main; stays stable until it finishes.
- Start main while other active: icon flips to main instantly.
- Rapid tool bursts: ensure badge does not flicker (TTL grace on tool results).
- Health row reappears once all sessions idle.

[Dev setup](https://docs.molt.bot/platforms/mac/dev-setup) [Voicewake](https://docs.molt.bot/platforms/mac/voicewake)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.