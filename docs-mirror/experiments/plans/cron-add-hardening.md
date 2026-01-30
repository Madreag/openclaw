---
source: https://docs.molt.bot/experiments/plans/cron-add-hardening
title: Cron add hardening - Moltbot
---

[Skip to main content](https://docs.molt.bot/experiments/plans/cron-add-hardening#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Cron Add Hardening & Schema Alignment](https://docs.molt.bot/experiments/plans/cron-add-hardening#cron-add-hardening-%26-schema-alignment)
- [Context](https://docs.molt.bot/experiments/plans/cron-add-hardening#context)
- [Goals](https://docs.molt.bot/experiments/plans/cron-add-hardening#goals)
- [Non-goals](https://docs.molt.bot/experiments/plans/cron-add-hardening#non-goals)
- [Findings (current gaps)](https://docs.molt.bot/experiments/plans/cron-add-hardening#findings-current-gaps)
- [What changed](https://docs.molt.bot/experiments/plans/cron-add-hardening#what-changed)
- [Current behavior](https://docs.molt.bot/experiments/plans/cron-add-hardening#current-behavior)
- [Verification](https://docs.molt.bot/experiments/plans/cron-add-hardening#verification)
- [Optional Follow-ups](https://docs.molt.bot/experiments/plans/cron-add-hardening#optional-follow-ups)
- [Open Questions](https://docs.molt.bot/experiments/plans/cron-add-hardening#open-questions)

# [​](https://docs.molt.bot/experiments/plans/cron-add-hardening\#cron-add-hardening-&-schema-alignment)  Cron Add Hardening & Schema Alignment

## [​](https://docs.molt.bot/experiments/plans/cron-add-hardening\#context)  Context

Recent gateway logs show repeated `cron.add` failures with invalid parameters (missing `sessionTarget`, `wakeMode`, `payload`, and malformed `schedule`). This indicates that at least one client (likely the agent tool call path) is sending wrapped or partially specified job payloads. Separately, there is drift between cron provider enums in TypeScript, gateway schema, CLI flags, and UI form types, plus a UI mismatch for `cron.status` (expects `jobCount` while gateway returns `jobs`).

## [​](https://docs.molt.bot/experiments/plans/cron-add-hardening\#goals)  Goals

- Stop `cron.add` INVALID\_REQUEST spam by normalizing common wrapper payloads and inferring missing `kind` fields.
- Align cron provider lists across gateway schema, cron types, CLI docs, and UI forms.
- Make agent cron tool schema explicit so the LLM produces correct job payloads.
- Fix the Control UI cron status job count display.
- Add tests to cover normalization and tool behavior.

## [​](https://docs.molt.bot/experiments/plans/cron-add-hardening\#non-goals)  Non-goals

- Change cron scheduling semantics or job execution behavior.
- Add new schedule kinds or cron expression parsing.
- Overhaul the UI/UX for cron beyond the necessary field fixes.

## [​](https://docs.molt.bot/experiments/plans/cron-add-hardening\#findings-current-gaps)  Findings (current gaps)

- `CronPayloadSchema` in gateway excludes `signal` \+ `imessage`, while TS types include them.
- Control UI CronStatus expects `jobCount`, but gateway returns `jobs`.
- Agent cron tool schema allows arbitrary `job` objects, enabling malformed inputs.
- Gateway strictly validates `cron.add` with no normalization, so wrapped payloads fail.

## [​](https://docs.molt.bot/experiments/plans/cron-add-hardening\#what-changed)  What changed

- `cron.add` and `cron.update` now normalize common wrapper shapes and infer missing `kind` fields.
- Agent cron tool schema matches the gateway schema, which reduces invalid payloads.
- Provider enums are aligned across gateway, CLI, UI, and macOS picker.
- Control UI uses the gateway’s `jobs` count field for status.

## [​](https://docs.molt.bot/experiments/plans/cron-add-hardening\#current-behavior)  Current behavior

- **Normalization:** wrapped `data`/`job` payloads are unwrapped; `schedule.kind` and `payload.kind` are inferred when safe.
- **Defaults:** safe defaults are applied for `wakeMode` and `sessionTarget` when missing.
- **Providers:** Discord/Slack/Signal/iMessage are now consistently surfaced across CLI/UI.

See [Cron jobs](https://docs.molt.bot/automation/cron-jobs) for the normalized shape and examples.

## [​](https://docs.molt.bot/experiments/plans/cron-add-hardening\#verification)  Verification

- Watch gateway logs for reduced `cron.add` INVALID\_REQUEST errors.
- Confirm Control UI cron status shows job count after refresh.

## [​](https://docs.molt.bot/experiments/plans/cron-add-hardening\#optional-follow-ups)  Optional Follow-ups

- Manual Control UI smoke: add a cron job per provider + verify status job count.

## [​](https://docs.molt.bot/experiments/plans/cron-add-hardening\#open-questions)  Open Questions

- Should `cron.add` accept explicit `state` from clients (currently disallowed by schema)?
- Should we allow `webchat` as an explicit delivery provider (currently filtered in delivery resolution)?

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.