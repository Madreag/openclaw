---
source: https://docs.molt.bot/platforms/macos-vm
title: Macos vm - Moltbot
---

[Skip to main content](https://docs.molt.bot/platforms/macos-vm#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Moltbot on macOS VMs (Sandboxing)](https://docs.molt.bot/platforms/macos-vm#moltbot-on-macos-vms-sandboxing)
- [Recommended default (most users)](https://docs.molt.bot/platforms/macos-vm#recommended-default-most-users)
- [macOS VM options](https://docs.molt.bot/platforms/macos-vm#macos-vm-options)
- [Local VM on your Apple Silicon Mac (Lume)](https://docs.molt.bot/platforms/macos-vm#local-vm-on-your-apple-silicon-mac-lume)
- [Hosted Mac providers (cloud)](https://docs.molt.bot/platforms/macos-vm#hosted-mac-providers-cloud)
- [Quick path (Lume, experienced users)](https://docs.molt.bot/platforms/macos-vm#quick-path-lume%2C-experienced-users)
- [What you need (Lume)](https://docs.molt.bot/platforms/macos-vm#what-you-need-lume)
- [1) Install Lume](https://docs.molt.bot/platforms/macos-vm#1-install-lume)
- [2) Create the macOS VM](https://docs.molt.bot/platforms/macos-vm#2-create-the-macos-vm)
- [3) Complete Setup Assistant](https://docs.molt.bot/platforms/macos-vm#3-complete-setup-assistant)
- [4) Get the VM’s IP address](https://docs.molt.bot/platforms/macos-vm#4-get-the-vm%E2%80%99s-ip-address)
- [5) SSH into the VM](https://docs.molt.bot/platforms/macos-vm#5-ssh-into-the-vm)
- [6) Install Moltbot](https://docs.molt.bot/platforms/macos-vm#6-install-moltbot)
- [7) Configure channels](https://docs.molt.bot/platforms/macos-vm#7-configure-channels)
- [8) Run the VM headlessly](https://docs.molt.bot/platforms/macos-vm#8-run-the-vm-headlessly)
- [Bonus: iMessage integration](https://docs.molt.bot/platforms/macos-vm#bonus%3A-imessage-integration)
- [Save a golden image](https://docs.molt.bot/platforms/macos-vm#save-a-golden-image)
- [Running 24/7](https://docs.molt.bot/platforms/macos-vm#running-24%2F7)
- [Troubleshooting](https://docs.molt.bot/platforms/macos-vm#troubleshooting)
- [Related docs](https://docs.molt.bot/platforms/macos-vm#related-docs)

# [​](https://docs.molt.bot/platforms/macos-vm\#moltbot-on-macos-vms-sandboxing)  Moltbot on macOS VMs (Sandboxing)

## [​](https://docs.molt.bot/platforms/macos-vm\#recommended-default-most-users)  Recommended default (most users)

- **Small Linux VPS** for an always-on Gateway and low cost. See [VPS hosting](https://docs.molt.bot/vps).
- **Dedicated hardware** (Mac mini or Linux box) if you want full control and a **residential IP** for browser automation. Many sites block data center IPs, so local browsing often works better.
- **Hybrid:** keep the Gateway on a cheap VPS, and connect your Mac as a **node** when you need browser/UI automation. See [Nodes](https://docs.molt.bot/nodes) and [Gateway remote](https://docs.molt.bot/gateway/remote).

Use a macOS VM when you specifically need macOS-only capabilities (iMessage/BlueBubbles) or want strict isolation from your daily Mac.

## [​](https://docs.molt.bot/platforms/macos-vm\#macos-vm-options)  macOS VM options

### [​](https://docs.molt.bot/platforms/macos-vm\#local-vm-on-your-apple-silicon-mac-lume)  Local VM on your Apple Silicon Mac (Lume)

Run Moltbot in a sandboxed macOS VM on your existing Apple Silicon Mac using [Lume](https://cua.ai/docs/lume).This gives you:

- Full macOS environment in isolation (your host stays clean)
- iMessage support via BlueBubbles (impossible on Linux/Windows)
- Instant reset by cloning VMs
- No extra hardware or cloud costs

### [​](https://docs.molt.bot/platforms/macos-vm\#hosted-mac-providers-cloud)  Hosted Mac providers (cloud)

If you want macOS in the cloud, hosted Mac providers work too:

- [MacStadium](https://www.macstadium.com/) (hosted Macs)
- Other hosted Mac vendors also work; follow their VM + SSH docs

Once you have SSH access to a macOS VM, continue at step 6 below.

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#quick-path-lume,-experienced-users)  Quick path (Lume, experienced users)

1. Install Lume
2. `lume create moltbot --os macos --ipsw latest`
3. Complete Setup Assistant, enable Remote Login (SSH)
4. `lume run moltbot --no-display`
5. SSH in, install Moltbot, configure channels
6. Done

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#what-you-need-lume)  What you need (Lume)

- Apple Silicon Mac (M1/M2/M3/M4)
- macOS Sequoia or later on the host
- ~60 GB free disk space per VM
- ~20 minutes

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#1-install-lume)  1) Install Lume

Copy

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/trycua/cua/main/libs/lume/scripts/install.sh)"
```

If `~/.local/bin` isn’t in your PATH:

Copy

```
echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.zshrc && source ~/.zshrc
```

Verify:

Copy

```
lume --version
```

Docs: [Lume Installation](https://cua.ai/docs/lume/guide/getting-started/installation)

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#2-create-the-macos-vm)  2) Create the macOS VM

Copy

```
lume create moltbot --os macos --ipsw latest
```

This downloads macOS and creates the VM. A VNC window opens automatically.Note: The download can take a while depending on your connection.

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#3-complete-setup-assistant)  3) Complete Setup Assistant

In the VNC window:

1. Select language and region
2. Skip Apple ID (or sign in if you want iMessage later)
3. Create a user account (remember the username and password)
4. Skip all optional features

After setup completes, enable SSH:

1. Open System Settings → General → Sharing
2. Enable “Remote Login”

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#4-get-the-vm%E2%80%99s-ip-address)  4) Get the VM’s IP address

Copy

```
lume get moltbot
```

Look for the IP address (usually `192.168.64.x`).

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#5-ssh-into-the-vm)  5) SSH into the VM

Copy

```
ssh youruser@192.168.64.X
```

Replace `youruser` with the account you created, and the IP with your VM’s IP.

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#6-install-moltbot)  6) Install Moltbot

Inside the VM:

Copy

```
npm install -g moltbot@latest
moltbot onboard --install-daemon
```

Follow the onboarding prompts to set up your model provider (Anthropic, OpenAI, etc.).

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#7-configure-channels)  7) Configure channels

Edit the config file:

Copy

```
nano ~/.clawdbot/moltbot.json
```

Add your channels:

Copy

```
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "allowlist",
      "allowFrom": ["+15551234567"]
    },
    "telegram": {
      "botToken": "YOUR_BOT_TOKEN"
    }
  }
}
```

Then login to WhatsApp (scan QR):

Copy

```
moltbot channels login
```

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#8-run-the-vm-headlessly)  8) Run the VM headlessly

Stop the VM and restart without display:

Copy

```
lume stop moltbot
lume run moltbot --no-display
```

The VM runs in the background. Moltbot’s daemon keeps the gateway running.To check status:

Copy

```
ssh youruser@192.168.64.X "moltbot status"
```

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#bonus:-imessage-integration)  Bonus: iMessage integration

This is the killer feature of running on macOS. Use [BlueBubbles](https://bluebubbles.app/) to add iMessage to Moltbot.Inside the VM:

1. Download BlueBubbles from bluebubbles.app
2. Sign in with your Apple ID
3. Enable the Web API and set a password
4. Point BlueBubbles webhooks at your gateway (example: `https://your-gateway-host:3000/bluebubbles-webhook?password=<password>`)

Add to your Moltbot config:

Copy

```
{
  "channels": {
    "bluebubbles": {
      "serverUrl": "http://localhost:1234",
      "password": "your-api-password",
      "webhookPath": "/bluebubbles-webhook"
    }
  }
}
```

Restart the gateway. Now your agent can send and receive iMessages.Full setup details: [BlueBubbles channel](https://docs.molt.bot/channels/bluebubbles)

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#save-a-golden-image)  Save a golden image

Before customizing further, snapshot your clean state:

Copy

```
lume stop moltbot
lume clone moltbot moltbot-golden
```

Reset anytime:

Copy

```
lume stop moltbot && lume delete moltbot
lume clone moltbot-golden moltbot
lume run moltbot --no-display
```

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#running-24/7)  Running 24/7

Keep the VM running by:

- Keeping your Mac plugged in
- Disabling sleep in System Settings → Energy Saver
- Using `caffeinate` if needed

For true always-on, consider a dedicated Mac mini or a small VPS. See [VPS hosting](https://docs.molt.bot/vps).

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#troubleshooting)  Troubleshooting

| Problem | Solution |
| --- | --- |
| Can’t SSH into VM | Check “Remote Login” is enabled in VM’s System Settings |
| VM IP not showing | Wait for VM to fully boot, run `lume get moltbot` again |
| Lume command not found | Add `~/.local/bin` to your PATH |
| WhatsApp QR not scanning | Ensure you’re logged into the VM (not host) when running `moltbot channels login` |

* * *

## [​](https://docs.molt.bot/platforms/macos-vm\#related-docs)  Related docs

- [VPS hosting](https://docs.molt.bot/vps)
- [Nodes](https://docs.molt.bot/nodes)
- [Gateway remote](https://docs.molt.bot/gateway/remote)
- [BlueBubbles channel](https://docs.molt.bot/channels/bluebubbles)
- [Lume Quickstart](https://cua.ai/docs/lume/guide/getting-started/quickstart)
- [Lume CLI Reference](https://cua.ai/docs/lume/reference/cli-reference)
- [Unattended VM Setup](https://cua.ai/docs/lume/guide/fundamentals/unattended-setup) (advanced)
- [Docker Sandboxing](https://docs.molt.bot/install/docker) (alternative isolation approach)

[Macos](https://docs.molt.bot/platforms/macos) [Ios](https://docs.molt.bot/platforms/ios)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.