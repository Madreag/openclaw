---
source: https://docs.molt.bot/platforms/mac/skills
title: Skills - Moltbot
---

[Skip to main content](https://docs.molt.bot/platforms/mac/skills#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Skills (macOS)](https://docs.molt.bot/platforms/mac/skills#skills-macos)
- [Data source](https://docs.molt.bot/platforms/mac/skills#data-source)
- [Install actions](https://docs.molt.bot/platforms/mac/skills#install-actions)
- [Env/API keys](https://docs.molt.bot/platforms/mac/skills#env%2Fapi-keys)
- [Remote mode](https://docs.molt.bot/platforms/mac/skills#remote-mode)

# [​](https://docs.molt.bot/platforms/mac/skills\#skills-macos)  Skills (macOS)

The macOS app surfaces Moltbot skills via the gateway; it does not parse skills locally.

## [​](https://docs.molt.bot/platforms/mac/skills\#data-source)  Data source

- `skills.status` (gateway) returns all skills plus eligibility and missing requirements
(including allowlist blocks for bundled skills).
- Requirements are derived from `metadata.moltbot.requires` in each `SKILL.md`.

## [​](https://docs.molt.bot/platforms/mac/skills\#install-actions)  Install actions

- `metadata.moltbot.install` defines install options (brew/node/go/uv).
- The app calls `skills.install` to run installers on the gateway host.
- The gateway surfaces only one preferred installer when multiple are provided
(brew when available, otherwise node manager from `skills.install`, default npm).

## [​](https://docs.molt.bot/platforms/mac/skills\#env/api-keys)  Env/API keys

- The app stores keys in `~/.clawdbot/moltbot.json` under `skills.entries.<skillKey>`.
- `skills.update` patches `enabled`, `apiKey`, and `env`.

## [​](https://docs.molt.bot/platforms/mac/skills\#remote-mode)  Remote mode

- Install + config updates happen on the gateway host (not the local Mac).

[Xpc](https://docs.molt.bot/platforms/mac/xpc) [Peekaboo](https://docs.molt.bot/platforms/mac/peekaboo)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.