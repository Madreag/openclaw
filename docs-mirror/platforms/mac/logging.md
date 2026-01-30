---
source: https://docs.molt.bot/platforms/mac/logging
title: Logging - Moltbot
---

[Skip to main content](https://docs.molt.bot/platforms/mac/logging#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Logging (macOS)](https://docs.molt.bot/platforms/mac/logging#logging-macos)
- [Rolling diagnostics file log (Debug pane)](https://docs.molt.bot/platforms/mac/logging#rolling-diagnostics-file-log-debug-pane)
- [Unified logging private data on macOS](https://docs.molt.bot/platforms/mac/logging#unified-logging-private-data-on-macos)
- [Enable for Moltbot (bot.molt)](https://docs.molt.bot/platforms/mac/logging#enable-for-moltbot-bot-molt)
- [Disable after debugging](https://docs.molt.bot/platforms/mac/logging#disable-after-debugging)

# [​](https://docs.molt.bot/platforms/mac/logging\#logging-macos)  Logging (macOS)

## [​](https://docs.molt.bot/platforms/mac/logging\#rolling-diagnostics-file-log-debug-pane)  Rolling diagnostics file log (Debug pane)

Moltbot routes macOS app logs through swift-log (unified logging by default) and can write a local, rotating file log to disk when you need a durable capture.

- Verbosity: **Debug pane → Logs → App logging → Verbosity**
- Enable: **Debug pane → Logs → App logging → “Write rolling diagnostics log (JSONL)”**
- Location: `~/Library/Logs/Moltbot/diagnostics.jsonl` (rotates automatically; old files are suffixed with `.1`, `.2`, …)
- Clear: **Debug pane → Logs → App logging → “Clear”**

Notes:

- This is **off by default**. Enable only while actively debugging.
- Treat the file as sensitive; don’t share it without review.

## [​](https://docs.molt.bot/platforms/mac/logging\#unified-logging-private-data-on-macos)  Unified logging private data on macOS

Unified logging redacts most payloads unless a subsystem opts into `privacy -off`. Per Peter’s write-up on macOS [logging privacy shenanigans](https://steipete.me/posts/2025/logging-privacy-shenanigans) (2025) this is controlled by a plist in `/Library/Preferences/Logging/Subsystems/` keyed by the subsystem name. Only new log entries pick up the flag, so enable it before reproducing an issue.

## [​](https://docs.molt.bot/platforms/mac/logging\#enable-for-moltbot-bot-molt)  Enable for Moltbot (`bot.molt`)

- Write the plist to a temp file first, then install it atomically as root:

Copy

```
cat <<'EOF' >/tmp/bot.molt.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>DEFAULT-OPTIONS</key>
    <dict>
        <key>Enable-Private-Data</key>
        <true/>
    </dict>
</dict>
</plist>
EOF
sudo install -m 644 -o root -g wheel /tmp/bot.molt.plist /Library/Preferences/Logging/Subsystems/bot.molt.plist
```

- No reboot is required; logd notices the file quickly, but only new log lines will include private payloads.
- View the richer output with the existing helper, e.g. `./scripts/clawlog.sh --category WebChat --last 5m`.

## [​](https://docs.molt.bot/platforms/mac/logging\#disable-after-debugging)  Disable after debugging

- Remove the override: `sudo rm /Library/Preferences/Logging/Subsystems/bot.molt.plist`.
- Optionally run `sudo log config --reload` to force logd to drop the override immediately.
- Remember this surface can include phone numbers and message bodies; keep the plist in place only while you actively need the extra detail.

[Icon](https://docs.molt.bot/platforms/mac/icon) [Permissions](https://docs.molt.bot/platforms/mac/permissions)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.