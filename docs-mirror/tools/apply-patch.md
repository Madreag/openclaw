---
source: https://docs.molt.bot/tools/apply-patch
title: Apply patch - Moltbot
---

[Skip to main content](https://docs.molt.bot/tools/apply-patch#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [apply\_patch tool](https://docs.molt.bot/tools/apply-patch#apply_patch-tool)
- [Parameters](https://docs.molt.bot/tools/apply-patch#parameters)
- [Notes](https://docs.molt.bot/tools/apply-patch#notes)
- [Example](https://docs.molt.bot/tools/apply-patch#example)

# [​](https://docs.molt.bot/tools/apply-patch\#apply_patch-tool)  apply\_patch tool

Apply file changes using a structured patch format. This is ideal for multi-file
or multi-hunk edits where a single `edit` call would be brittle.The tool accepts a single `input` string that wraps one or more file operations:

Copy

```
*** Begin Patch
*** Add File: path/to/file.txt
+line 1
+line 2
*** Update File: src/app.ts
@@
-old line
+new line
*** Delete File: obsolete.txt
*** End Patch
```

## [​](https://docs.molt.bot/tools/apply-patch\#parameters)  Parameters

- `input` (required): Full patch contents including `*** Begin Patch` and `*** End Patch`.

## [​](https://docs.molt.bot/tools/apply-patch\#notes)  Notes

- Paths are resolved relative to the workspace root.
- Use `*** Move to:` within an `*** Update File:` hunk to rename files.
- `*** End of File` marks an EOF-only insert when needed.
- Experimental and disabled by default. Enable with `tools.exec.applyPatch.enabled`.
- OpenAI-only (including OpenAI Codex). Optionally gate by model via
`tools.exec.applyPatch.allowModels`.
- Config is only under `tools.exec`.

## [​](https://docs.molt.bot/tools/apply-patch\#example)  Example

Copy

```
{
  "tool": "apply_patch",
  "input": "*** Begin Patch\n*** Update File: src/index.ts\n@@\n-const foo = 1\n+const foo = 2\n*** End Patch"
}
```

[Web](https://docs.molt.bot/tools/web) [Elevated](https://docs.molt.bot/tools/elevated)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.