---
source: https://docs.molt.bot/experiments/onboarding-config-protocol
title: Onboarding config protocol - Moltbot
---

[Skip to main content](https://docs.molt.bot/experiments/onboarding-config-protocol#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Onboarding + Config Protocol](https://docs.molt.bot/experiments/onboarding-config-protocol#onboarding-%2B-config-protocol)
- [Components](https://docs.molt.bot/experiments/onboarding-config-protocol#components)
- [Gateway RPC](https://docs.molt.bot/experiments/onboarding-config-protocol#gateway-rpc)
- [UI Hints](https://docs.molt.bot/experiments/onboarding-config-protocol#ui-hints)
- [Notes](https://docs.molt.bot/experiments/onboarding-config-protocol#notes)

# [​](https://docs.molt.bot/experiments/onboarding-config-protocol\#onboarding-+-config-protocol)  Onboarding + Config Protocol

Purpose: shared onboarding + config surfaces across CLI, macOS app, and Web UI.

## [​](https://docs.molt.bot/experiments/onboarding-config-protocol\#components)  Components

- Wizard engine (shared session + prompts + onboarding state).
- CLI onboarding uses the same wizard flow as the UI clients.
- Gateway RPC exposes wizard + config schema endpoints.
- macOS onboarding uses the wizard step model.
- Web UI renders config forms from JSON Schema + UI hints.

## [​](https://docs.molt.bot/experiments/onboarding-config-protocol\#gateway-rpc)  Gateway RPC

- `wizard.start` params: `{ mode?: "local"|"remote", workspace?: string }`
- `wizard.next` params: `{ sessionId, answer?: { stepId, value? } }`
- `wizard.cancel` params: `{ sessionId }`
- `wizard.status` params: `{ sessionId }`
- `config.schema` params: `{}`

Responses (shape)

- Wizard: `{ sessionId, done, step?, status?, error? }`
- Config schema: `{ schema, uiHints, version, generatedAt }`

## [​](https://docs.molt.bot/experiments/onboarding-config-protocol\#ui-hints)  UI Hints

- `uiHints` keyed by path; optional metadata (label/help/group/order/advanced/sensitive/placeholder).
- Sensitive fields render as password inputs; no redaction layer.
- Unsupported schema nodes fall back to the raw JSON editor.

## [​](https://docs.molt.bot/experiments/onboarding-config-protocol\#notes)  Notes

- This doc is the single place to track protocol refactors for onboarding/config.

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.