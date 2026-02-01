---
source: https://docs.molt.bot/tools/browser-linux-troubleshooting
title: Browser linux troubleshooting - Moltbot
---

[Skip to main content](https://docs.molt.bot/tools/browser-linux-troubleshooting#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Browser Troubleshooting (Linux)](https://docs.molt.bot/tools/browser-linux-troubleshooting#browser-troubleshooting-linux)
- [Problem: “Failed to start Chrome CDP on port 18800”](https://docs.molt.bot/tools/browser-linux-troubleshooting#problem%3A-%E2%80%9Cfailed-to-start-chrome-cdp-on-port-18800%E2%80%9D)
- [Root Cause](https://docs.molt.bot/tools/browser-linux-troubleshooting#root-cause)
- [Solution 1: Install Google Chrome (Recommended)](https://docs.molt.bot/tools/browser-linux-troubleshooting#solution-1%3A-install-google-chrome-recommended)
- [Solution 2: Use Snap Chromium with Attach-Only Mode](https://docs.molt.bot/tools/browser-linux-troubleshooting#solution-2%3A-use-snap-chromium-with-attach-only-mode)
- [Verifying the Browser Works](https://docs.molt.bot/tools/browser-linux-troubleshooting#verifying-the-browser-works)
- [Config Reference](https://docs.molt.bot/tools/browser-linux-troubleshooting#config-reference)
- [Problem: “Chrome extension relay is running, but no tab is connected”](https://docs.molt.bot/tools/browser-linux-troubleshooting#problem%3A-%E2%80%9Cchrome-extension-relay-is-running%2C-but-no-tab-is-connected%E2%80%9D)

# [​](https://docs.molt.bot/tools/browser-linux-troubleshooting\#browser-troubleshooting-linux)  Browser Troubleshooting (Linux)

## [​](https://docs.molt.bot/tools/browser-linux-troubleshooting\#problem:-%E2%80%9Cfailed-to-start-chrome-cdp-on-port-18800%E2%80%9D)  Problem: “Failed to start Chrome CDP on port 18800”

Moltbot’s browser control server fails to launch Chrome/Brave/Edge/Chromium with the error:

Copy

```
{"error":"Error: Failed to start Chrome CDP on port 18800 for profile \"clawd\"."}
```

### [​](https://docs.molt.bot/tools/browser-linux-troubleshooting\#root-cause)  Root Cause

On Ubuntu (and many Linux distros), the default Chromium installation is a **snap package**. Snap’s AppArmor confinement interferes with how Moltbot spawns and monitors the browser process.The `apt install chromium` command installs a stub package that redirects to snap:

Copy

```
Note, selecting 'chromium-browser' instead of 'chromium'
chromium-browser is already the newest version (2:1snap1-0ubuntu2).
```

This is NOT a real browser — it’s just a wrapper.

### [​](https://docs.molt.bot/tools/browser-linux-troubleshooting\#solution-1:-install-google-chrome-recommended)  Solution 1: Install Google Chrome (Recommended)

Install the official Google Chrome `.deb` package, which is not sandboxed by snap:

Copy

```
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt --fix-broken install -y  # if there are dependency errors
```

Then update your Moltbot config (`~/.clawdbot/moltbot.json`):

Copy

```
{
  "browser": {
    "enabled": true,
    "executablePath": "/usr/bin/google-chrome-stable",
    "headless": true,
    "noSandbox": true
  }
}
```

### [​](https://docs.molt.bot/tools/browser-linux-troubleshooting\#solution-2:-use-snap-chromium-with-attach-only-mode)  Solution 2: Use Snap Chromium with Attach-Only Mode

If you must use snap Chromium, configure Moltbot to attach to a manually-started browser:

1. Update config:

Copy

```
{
  "browser": {
    "enabled": true,
    "attachOnly": true,
    "headless": true,
    "noSandbox": true
  }
}
```

2. Start Chromium manually:

Copy

```
chromium-browser --headless --no-sandbox --disable-gpu \
  --remote-debugging-port=18800 \
  --user-data-dir=$HOME/.clawdbot/browser/clawd/user-data \
  about:blank &
```

3. Optionally create a systemd user service to auto-start Chrome:

Copy

```
# ~/.config/systemd/user/clawd-browser.service
[Unit]
Description=Clawd Browser (Chrome CDP)
After=network.target

[Service]
ExecStart=/snap/bin/chromium --headless --no-sandbox --disable-gpu --remote-debugging-port=18800 --user-data-dir=%h/.clawdbot/browser/clawd/user-data about:blank
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

Enable with: `systemctl --user enable --now clawd-browser.service`

### [​](https://docs.molt.bot/tools/browser-linux-troubleshooting\#verifying-the-browser-works)  Verifying the Browser Works

Check status:

Copy

```
curl -s http://127.0.0.1:18791/ | jq '{running, pid, chosenBrowser}'
```

Test browsing:

Copy

```
curl -s -X POST http://127.0.0.1:18791/start
curl -s http://127.0.0.1:18791/tabs
```

### [​](https://docs.molt.bot/tools/browser-linux-troubleshooting\#config-reference)  Config Reference

| Option | Description | Default |
| --- | --- | --- |
| `browser.enabled` | Enable browser control | `true` |
| `browser.executablePath` | Path to a Chromium-based browser binary (Chrome/Brave/Edge/Chromium) | auto-detected (prefers default browser when Chromium-based) |
| `browser.headless` | Run without GUI | `false` |
| `browser.noSandbox` | Add `--no-sandbox` flag (needed for some Linux setups) | `false` |
| `browser.attachOnly` | Don’t launch browser, only attach to existing | `false` |
| `browser.cdpPort` | Chrome DevTools Protocol port | `18800` |

### [​](https://docs.molt.bot/tools/browser-linux-troubleshooting\#problem:-%E2%80%9Cchrome-extension-relay-is-running,-but-no-tab-is-connected%E2%80%9D)  Problem: “Chrome extension relay is running, but no tab is connected”

You’re using the `chrome` profile (extension relay). It expects the Moltbot
browser extension to be attached to a live tab.Fix options:

1. **Use the managed browser:**`moltbot browser start --browser-profile clawd`
(or set `browser.defaultProfile: "clawd"`).
2. **Use the extension relay:** install the extension, open a tab, and click the
Moltbot extension icon to attach it.

Notes:

- The `chrome` profile uses your **system default Chromium browser** when possible.
- Local `clawd` profiles auto-assign `cdpPort`/`cdpUrl`; only set those for remote CDP.

[Chrome extension](https://docs.molt.bot/tools/chrome-extension) [Slash commands](https://docs.molt.bot/tools/slash-commands)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.