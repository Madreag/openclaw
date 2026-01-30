---
source: https://docs.molt.bot/gateway/remote-gateway-readme
title: Remote gateway readme - Moltbot
---

[Skip to main content](https://docs.molt.bot/gateway/remote-gateway-readme#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Running Moltbot.app with a Remote Gateway](https://docs.molt.bot/gateway/remote-gateway-readme#running-moltbot-app-with-a-remote-gateway)
- [Overview](https://docs.molt.bot/gateway/remote-gateway-readme#overview)
- [Quick Setup](https://docs.molt.bot/gateway/remote-gateway-readme#quick-setup)
- [Step 1: Add SSH Config](https://docs.molt.bot/gateway/remote-gateway-readme#step-1%3A-add-ssh-config)
- [Step 2: Copy SSH Key](https://docs.molt.bot/gateway/remote-gateway-readme#step-2%3A-copy-ssh-key)
- [Step 3: Set Gateway Token](https://docs.molt.bot/gateway/remote-gateway-readme#step-3%3A-set-gateway-token)
- [Step 4: Start SSH Tunnel](https://docs.molt.bot/gateway/remote-gateway-readme#step-4%3A-start-ssh-tunnel)
- [Step 5: Restart Moltbot.app](https://docs.molt.bot/gateway/remote-gateway-readme#step-5%3A-restart-moltbot-app)
- [Auto-Start Tunnel on Login](https://docs.molt.bot/gateway/remote-gateway-readme#auto-start-tunnel-on-login)
- [Create the PLIST file](https://docs.molt.bot/gateway/remote-gateway-readme#create-the-plist-file)
- [Load the Launch Agent](https://docs.molt.bot/gateway/remote-gateway-readme#load-the-launch-agent)
- [Troubleshooting](https://docs.molt.bot/gateway/remote-gateway-readme#troubleshooting)
- [How It Works](https://docs.molt.bot/gateway/remote-gateway-readme#how-it-works)

# [​](https://docs.molt.bot/gateway/remote-gateway-readme\#running-moltbot-app-with-a-remote-gateway)  Running Moltbot.app with a Remote Gateway

Moltbot.app uses SSH tunneling to connect to a remote gateway. This guide shows you how to set it up.

## [​](https://docs.molt.bot/gateway/remote-gateway-readme\#overview)  Overview

Copy

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Machine                          │
│                                                              │
│  Moltbot.app ──► ws://127.0.0.1:18789 (local port)           │
│                     │                                        │
│                     ▼                                        │
│  SSH Tunnel ────────────────────────────────────────────────│
│                     │                                        │
└─────────────────────┼──────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                         Remote Machine                        │
│                                                              │
│  Gateway WebSocket ──► ws://127.0.0.1:18789 ──►              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## [​](https://docs.molt.bot/gateway/remote-gateway-readme\#quick-setup)  Quick Setup

### [​](https://docs.molt.bot/gateway/remote-gateway-readme\#step-1:-add-ssh-config)  Step 1: Add SSH Config

Edit `~/.ssh/config` and add:

Copy

```
Host remote-gateway
    HostName <REMOTE_IP>          # e.g., 172.27.187.184
    User <REMOTE_USER>            # e.g., jefferson
    LocalForward 18789 127.0.0.1:18789
    IdentityFile ~/.ssh/id_rsa
```

Replace `<REMOTE_IP>` and `<REMOTE_USER>` with your values.

### [​](https://docs.molt.bot/gateway/remote-gateway-readme\#step-2:-copy-ssh-key)  Step 2: Copy SSH Key

Copy your public key to the remote machine (enter password once):

Copy

```
ssh-copy-id -i ~/.ssh/id_rsa <REMOTE_USER>@<REMOTE_IP>
```

### [​](https://docs.molt.bot/gateway/remote-gateway-readme\#step-3:-set-gateway-token)  Step 3: Set Gateway Token

Copy

```
launchctl setenv CLAWDBOT_GATEWAY_TOKEN "<your-token>"
```

### [​](https://docs.molt.bot/gateway/remote-gateway-readme\#step-4:-start-ssh-tunnel)  Step 4: Start SSH Tunnel

Copy

```
ssh -N remote-gateway &
```

### [​](https://docs.molt.bot/gateway/remote-gateway-readme\#step-5:-restart-moltbot-app)  Step 5: Restart Moltbot.app

Copy

```
# Quit Moltbot.app (⌘Q), then reopen:
open /path/to/Moltbot.app
```

The app will now connect to the remote gateway through the SSH tunnel.

* * *

## [​](https://docs.molt.bot/gateway/remote-gateway-readme\#auto-start-tunnel-on-login)  Auto-Start Tunnel on Login

To have the SSH tunnel start automatically when you log in, create a Launch Agent.

### [​](https://docs.molt.bot/gateway/remote-gateway-readme\#create-the-plist-file)  Create the PLIST file

Save this as `~/Library/LaunchAgents/bot.molt.ssh-tunnel.plist`:

Copy

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>bot.molt.ssh-tunnel</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/ssh</string>
        <string>-N</string>
        <string>remote-gateway</string>
    </array>
    <key>KeepAlive</key>
    <true/>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

### [​](https://docs.molt.bot/gateway/remote-gateway-readme\#load-the-launch-agent)  Load the Launch Agent

Copy

```
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/bot.molt.ssh-tunnel.plist
```

The tunnel will now:

- Start automatically when you log in
- Restart if it crashes
- Keep running in the background

Legacy note: remove any leftover `com.clawdbot.ssh-tunnel` LaunchAgent if present.

* * *

## [​](https://docs.molt.bot/gateway/remote-gateway-readme\#troubleshooting)  Troubleshooting

**Check if tunnel is running:**

Copy

```
ps aux | grep "ssh -N remote-gateway" | grep -v grep
lsof -i :18789
```

**Restart the tunnel:**

Copy

```
launchctl kickstart -k gui/$UID/bot.molt.ssh-tunnel
```

**Stop the tunnel:**

Copy

```
launchctl bootout gui/$UID/bot.molt.ssh-tunnel
```

* * *

## [​](https://docs.molt.bot/gateway/remote-gateway-readme\#how-it-works)  How It Works

| Component | What It Does |
| --- | --- |
| `LocalForward 18789 127.0.0.1:18789` | Forwards local port 18789 to remote port 18789 |
| `ssh -N` | SSH without executing remote commands (just port forwarding) |
| `KeepAlive` | Automatically restarts tunnel if it crashes |
| `RunAtLoad` | Starts tunnel when the agent loads |

Moltbot.app connects to `ws://127.0.0.1:18789` on your client machine. The SSH tunnel forwards that connection to port 18789 on the remote machine where the Gateway is running.

[Remote](https://docs.molt.bot/gateway/remote) [Discovery](https://docs.molt.bot/gateway/discovery)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.