---
source: https://docs.molt.bot/channels/signal
title: Signal - Moltbot
---

[Skip to main content](https://docs.molt.bot/channels/signal#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Signal (signal-cli)](https://docs.molt.bot/channels/signal#signal-signal-cli)
- [Quick setup (beginner)](https://docs.molt.bot/channels/signal#quick-setup-beginner)
- [What it is](https://docs.molt.bot/channels/signal#what-it-is)
- [Config writes](https://docs.molt.bot/channels/signal#config-writes)
- [The number model (important)](https://docs.molt.bot/channels/signal#the-number-model-important)
- [Setup (fast path)](https://docs.molt.bot/channels/signal#setup-fast-path)
- [External daemon mode (httpUrl)](https://docs.molt.bot/channels/signal#external-daemon-mode-httpurl)
- [Access control (DMs + groups)](https://docs.molt.bot/channels/signal#access-control-dms-%2B-groups)
- [How it works (behavior)](https://docs.molt.bot/channels/signal#how-it-works-behavior)
- [Media + limits](https://docs.molt.bot/channels/signal#media-%2B-limits)
- [Typing + read receipts](https://docs.molt.bot/channels/signal#typing-%2B-read-receipts)
- [Reactions (message tool)](https://docs.molt.bot/channels/signal#reactions-message-tool)
- [Delivery targets (CLI/cron)](https://docs.molt.bot/channels/signal#delivery-targets-cli%2Fcron)
- [Configuration reference (Signal)](https://docs.molt.bot/channels/signal#configuration-reference-signal)

# [​](https://docs.molt.bot/channels/signal\#signal-signal-cli)  Signal (signal-cli)

Status: external CLI integration. Gateway talks to `signal-cli` over HTTP JSON-RPC + SSE.

## [​](https://docs.molt.bot/channels/signal\#quick-setup-beginner)  Quick setup (beginner)

1. Use a **separate Signal number** for the bot (recommended).
2. Install `signal-cli` (Java required).
3. Link the bot device and start the daemon:
   - `signal-cli link -n "Moltbot"`
4. Configure Moltbot and start the gateway.

Minimal config:

Copy

```
{
  channels: {
    signal: {
      enabled: true,
      account: "+15551234567",
      cliPath: "signal-cli",
      dmPolicy: "pairing",
      allowFrom: ["+15557654321"]
    }
  }
}
```

## [​](https://docs.molt.bot/channels/signal\#what-it-is)  What it is

- Signal channel via `signal-cli` (not embedded libsignal).
- Deterministic routing: replies always go back to Signal.
- DMs share the agent’s main session; groups are isolated (`agent:<agentId>:signal:group:<groupId>`).

## [​](https://docs.molt.bot/channels/signal\#config-writes)  Config writes

By default, Signal is allowed to write config updates triggered by `/config set|unset` (requires `commands.config: true`).Disable with:

Copy

```
{
  channels: { signal: { configWrites: false } }
}
```

## [​](https://docs.molt.bot/channels/signal\#the-number-model-important)  The number model (important)

- The gateway connects to a **Signal device** (the `signal-cli` account).
- If you run the bot on **your personal Signal account**, it will ignore your own messages (loop protection).
- For “I text the bot and it replies,” use a **separate bot number**.

## [​](https://docs.molt.bot/channels/signal\#setup-fast-path)  Setup (fast path)

1. Install `signal-cli` (Java required).
2. Link a bot account:
   - `signal-cli link -n "Moltbot"` then scan the QR in Signal.
3. Configure Signal and start the gateway.

Example:

Copy

```
{
  channels: {
    signal: {
      enabled: true,
      account: "+15551234567",
      cliPath: "signal-cli",
      dmPolicy: "pairing",
      allowFrom: ["+15557654321"]
    }
  }
}
```

Multi-account support: use `channels.signal.accounts` with per-account config and optional `name`. See [`gateway/configuration`](https://docs.molt.bot/gateway/configuration#telegramaccounts--discordaccounts--slackaccounts--signalaccounts--imessageaccounts) for the shared pattern.

## [​](https://docs.molt.bot/channels/signal\#external-daemon-mode-httpurl)  External daemon mode (httpUrl)

If you want to manage `signal-cli` yourself (slow JVM cold starts, container init, or shared CPUs), run the daemon separately and point Moltbot at it:

Copy

```
{
  channels: {
    signal: {
      httpUrl: "http://127.0.0.1:8080",
      autoStart: false
    }
  }
}
```

This skips auto-spawn and the startup wait inside Moltbot. For slow starts when auto-spawning, set `channels.signal.startupTimeoutMs`.

## [​](https://docs.molt.bot/channels/signal\#access-control-dms-+-groups)  Access control (DMs + groups)

DMs:

- Default: `channels.signal.dmPolicy = "pairing"`.
- Unknown senders receive a pairing code; messages are ignored until approved (codes expire after 1 hour).
- Approve via:
  - `moltbot pairing list signal`
  - `moltbot pairing approve signal <CODE>`
- Pairing is the default token exchange for Signal DMs. Details: [Pairing](https://docs.molt.bot/start/pairing)
- UUID-only senders (from `sourceUuid`) are stored as `uuid:<id>` in `channels.signal.allowFrom`.

Groups:

- `channels.signal.groupPolicy = open | allowlist | disabled`.
- `channels.signal.groupAllowFrom` controls who can trigger in groups when `allowlist` is set.

## [​](https://docs.molt.bot/channels/signal\#how-it-works-behavior)  How it works (behavior)

- `signal-cli` runs as a daemon; the gateway reads events via SSE.
- Inbound messages are normalized into the shared channel envelope.
- Replies always route back to the same number or group.

## [​](https://docs.molt.bot/channels/signal\#media-+-limits)  Media + limits

- Outbound text is chunked to `channels.signal.textChunkLimit` (default 4000).
- Optional newline chunking: set `channels.signal.chunkMode="newline"` to split on blank lines (paragraph boundaries) before length chunking.
- Attachments supported (base64 fetched from `signal-cli`).
- Default media cap: `channels.signal.mediaMaxMb` (default 8).
- Use `channels.signal.ignoreAttachments` to skip downloading media.
- Group history context uses `channels.signal.historyLimit` (or `channels.signal.accounts.*.historyLimit`), falling back to `messages.groupChat.historyLimit`. Set `0` to disable (default 50).

## [​](https://docs.molt.bot/channels/signal\#typing-+-read-receipts)  Typing + read receipts

- **Typing indicators**: Moltbot sends typing signals via `signal-cli sendTyping` and refreshes them while a reply is running.
- **Read receipts**: when `channels.signal.sendReadReceipts` is true, Moltbot forwards read receipts for allowed DMs.
- Signal-cli does not expose read receipts for groups.

## [​](https://docs.molt.bot/channels/signal\#reactions-message-tool)  Reactions (message tool)

- Use `message action=react` with `channel=signal`.
- Targets: sender E.164 or UUID (use `uuid:<id>` from pairing output; bare UUID works too).
- `messageId` is the Signal timestamp for the message you’re reacting to.
- Group reactions require `targetAuthor` or `targetAuthorUuid`.

Examples:

Copy

```
message action=react channel=signal target=uuid:123e4567-e89b-12d3-a456-426614174000 messageId=1737630212345 emoji=🔥
message action=react channel=signal target=+15551234567 messageId=1737630212345 emoji=🔥 remove=true
message action=react channel=signal target=signal:group:<groupId> targetAuthor=uuid:<sender-uuid> messageId=1737630212345 emoji=✅
```

Config:

- `channels.signal.actions.reactions`: enable/disable reaction actions (default true).
- `channels.signal.reactionLevel`: `off | ack | minimal | extensive`.

  - `off`/`ack` disables agent reactions (message tool `react` will error).
  - `minimal`/`extensive` enables agent reactions and sets the guidance level.
- Per-account overrides: `channels.signal.accounts.<id>.actions.reactions`, `channels.signal.accounts.<id>.reactionLevel`.

## [​](https://docs.molt.bot/channels/signal\#delivery-targets-cli/cron)  Delivery targets (CLI/cron)

- DMs: `signal:+15551234567` (or plain E.164).
- UUID DMs: `uuid:<id>` (or bare UUID).
- Groups: `signal:group:<groupId>`.
- Usernames: `username:<name>` (if supported by your Signal account).

## [​](https://docs.molt.bot/channels/signal\#configuration-reference-signal)  Configuration reference (Signal)

Full configuration: [Configuration](https://docs.molt.bot/gateway/configuration)Provider options:

- `channels.signal.enabled`: enable/disable channel startup.
- `channels.signal.account`: E.164 for the bot account.
- `channels.signal.cliPath`: path to `signal-cli`.
- `channels.signal.httpUrl`: full daemon URL (overrides host/port).
- `channels.signal.httpHost`, `channels.signal.httpPort`: daemon bind (default 127.0.0.1:8080).
- `channels.signal.autoStart`: auto-spawn daemon (default true if `httpUrl` unset).
- `channels.signal.startupTimeoutMs`: startup wait timeout in ms (cap 120000).
- `channels.signal.receiveMode`: `on-start | manual`.
- `channels.signal.ignoreAttachments`: skip attachment downloads.
- `channels.signal.ignoreStories`: ignore stories from the daemon.
- `channels.signal.sendReadReceipts`: forward read receipts.
- `channels.signal.dmPolicy`: `pairing | allowlist | open | disabled` (default: pairing).
- `channels.signal.allowFrom`: DM allowlist (E.164 or `uuid:<id>`). `open` requires `"*"`. Signal has no usernames; use phone/UUID ids.
- `channels.signal.groupPolicy`: `open | allowlist | disabled` (default: allowlist).
- `channels.signal.groupAllowFrom`: group sender allowlist.
- `channels.signal.historyLimit`: max group messages to include as context (0 disables).
- `channels.signal.dmHistoryLimit`: DM history limit in user turns. Per-user overrides: `channels.signal.dms["<phone_or_uuid>"].historyLimit`.
- `channels.signal.textChunkLimit`: outbound chunk size (chars).
- `channels.signal.chunkMode`: `length` (default) or `newline` to split on blank lines (paragraph boundaries) before length chunking.
- `channels.signal.mediaMaxMb`: inbound/outbound media cap (MB).

Related global options:

- `agents.list[].groupChat.mentionPatterns` (Signal does not support native mentions).
- `messages.groupChat.mentionPatterns` (global fallback).
- `messages.responsePrefix`.

[Mattermost](https://docs.molt.bot/channels/mattermost) [Imessage](https://docs.molt.bot/channels/imessage)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.