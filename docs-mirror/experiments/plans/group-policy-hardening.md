---
source: https://docs.molt.bot/experiments/plans/group-policy-hardening
title: Group policy hardening - Moltbot
---

[Skip to main content](https://docs.molt.bot/experiments/plans/group-policy-hardening#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Telegram Allowlist Hardening](https://docs.molt.bot/experiments/plans/group-policy-hardening#telegram-allowlist-hardening)
- [Summary](https://docs.molt.bot/experiments/plans/group-policy-hardening#summary)
- [What changed](https://docs.molt.bot/experiments/plans/group-policy-hardening#what-changed)
- [Examples](https://docs.molt.bot/experiments/plans/group-policy-hardening#examples)
- [Why it matters](https://docs.molt.bot/experiments/plans/group-policy-hardening#why-it-matters)
- [Related docs](https://docs.molt.bot/experiments/plans/group-policy-hardening#related-docs)

# [​](https://docs.molt.bot/experiments/plans/group-policy-hardening\#telegram-allowlist-hardening)  Telegram Allowlist Hardening

**Date**: 2026-01-05

**Status**: Complete

**PR**: #216

## [​](https://docs.molt.bot/experiments/plans/group-policy-hardening\#summary)  Summary

Telegram allowlists now accept `telegram:` and `tg:` prefixes case-insensitively, and tolerate
accidental whitespace. This aligns inbound allowlist checks with outbound send normalization.

## [​](https://docs.molt.bot/experiments/plans/group-policy-hardening\#what-changed)  What changed

- Prefixes `telegram:` and `tg:` are treated the same (case-insensitive).
- Allowlist entries are trimmed; empty entries are ignored.

## [​](https://docs.molt.bot/experiments/plans/group-policy-hardening\#examples)  Examples

All of these are accepted for the same ID:

- `telegram:123456`
- `TG:123456`
- `tg:123456`

## [​](https://docs.molt.bot/experiments/plans/group-policy-hardening\#why-it-matters)  Why it matters

Copy/paste from logs or chat IDs often includes prefixes and whitespace. Normalizing avoids
false negatives when deciding whether to respond in DMs or groups.

## [​](https://docs.molt.bot/experiments/plans/group-policy-hardening\#related-docs)  Related docs

- [Group Chats](https://docs.molt.bot/concepts/groups)
- [Telegram Provider](https://docs.molt.bot/channels/telegram)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.