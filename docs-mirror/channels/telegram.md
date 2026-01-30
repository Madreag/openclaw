---
source: https://docs.molt.bot/channels/telegram
title: Telegram - Moltbot
---

[Skip to main content](https://docs.molt.bot/channels/telegram#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Telegram (Bot API)](https://docs.molt.bot/channels/telegram#telegram-bot-api)
- [Quick setup (beginner)](https://docs.molt.bot/channels/telegram#quick-setup-beginner)
- [What it is](https://docs.molt.bot/channels/telegram#what-it-is)
- [Setup (fast path)](https://docs.molt.bot/channels/telegram#setup-fast-path)
- [1) Create a bot token (BotFather)](https://docs.molt.bot/channels/telegram#1-create-a-bot-token-botfather)
- [2) Configure the token (env or config)](https://docs.molt.bot/channels/telegram#2-configure-the-token-env-or-config)
- [Token + privacy + permissions (Telegram side)](https://docs.molt.bot/channels/telegram#token-%2B-privacy-%2B-permissions-telegram-side)
- [Token creation (BotFather)](https://docs.molt.bot/channels/telegram#token-creation-botfather)
- [Group message visibility (Privacy Mode)](https://docs.molt.bot/channels/telegram#group-message-visibility-privacy-mode)
- [Group permissions (admin rights)](https://docs.molt.bot/channels/telegram#group-permissions-admin-rights)
- [How it works (behavior)](https://docs.molt.bot/channels/telegram#how-it-works-behavior)
- [Formatting (Telegram HTML)](https://docs.molt.bot/channels/telegram#formatting-telegram-html)
- [Commands (native + custom)](https://docs.molt.bot/channels/telegram#commands-native-%2B-custom)
- [Troubleshooting](https://docs.molt.bot/channels/telegram#troubleshooting)
- [Limits](https://docs.molt.bot/channels/telegram#limits)
- [Group activation modes](https://docs.molt.bot/channels/telegram#group-activation-modes)
- [Via config (recommended)](https://docs.molt.bot/channels/telegram#via-config-recommended)
- [Via command (session-level)](https://docs.molt.bot/channels/telegram#via-command-session-level)
- [Getting the group chat ID](https://docs.molt.bot/channels/telegram#getting-the-group-chat-id)
- [Config writes](https://docs.molt.bot/channels/telegram#config-writes)
- [Topics (forum supergroups)](https://docs.molt.bot/channels/telegram#topics-forum-supergroups)
- [Inline Buttons](https://docs.molt.bot/channels/telegram#inline-buttons)
- [Sending buttons](https://docs.molt.bot/channels/telegram#sending-buttons)
- [Configuration options](https://docs.molt.bot/channels/telegram#configuration-options)
- [Access control (DMs + groups)](https://docs.molt.bot/channels/telegram#access-control-dms-%2B-groups)
- [DM access](https://docs.molt.bot/channels/telegram#dm-access)
- [Finding your Telegram user ID](https://docs.molt.bot/channels/telegram#finding-your-telegram-user-id)
- [Group access](https://docs.molt.bot/channels/telegram#group-access)
- [Long-polling vs webhook](https://docs.molt.bot/channels/telegram#long-polling-vs-webhook)
- [Reply threading](https://docs.molt.bot/channels/telegram#reply-threading)
- [Audio messages (voice vs file)](https://docs.molt.bot/channels/telegram#audio-messages-voice-vs-file)
- [Stickers](https://docs.molt.bot/channels/telegram#stickers)
- [Receiving stickers](https://docs.molt.bot/channels/telegram#receiving-stickers)
- [Sticker cache](https://docs.molt.bot/channels/telegram#sticker-cache)
- [Sending stickers](https://docs.molt.bot/channels/telegram#sending-stickers)
- [Streaming (drafts)](https://docs.molt.bot/channels/telegram#streaming-drafts)
- [Retry policy](https://docs.molt.bot/channels/telegram#retry-policy)
- [Agent tool (messages + reactions)](https://docs.molt.bot/channels/telegram#agent-tool-messages-%2B-reactions)
- [Reaction notifications](https://docs.molt.bot/channels/telegram#reaction-notifications)
- [Delivery targets (CLI/cron)](https://docs.molt.bot/channels/telegram#delivery-targets-cli%2Fcron)
- [Troubleshooting](https://docs.molt.bot/channels/telegram#troubleshooting-2)
- [Configuration reference (Telegram)](https://docs.molt.bot/channels/telegram#configuration-reference-telegram)

# [​](https://docs.molt.bot/channels/telegram\#telegram-bot-api)  Telegram (Bot API)

Status: production-ready for bot DMs + groups via grammY. Long-polling by default; webhook optional.

## [​](https://docs.molt.bot/channels/telegram\#quick-setup-beginner)  Quick setup (beginner)

1. Create a bot with **@BotFather** and copy the token.
2. Set the token:
   - Env: `TELEGRAM_BOT_TOKEN=...`
   - Or config: `channels.telegram.botToken: "..."`.
   - If both are set, config takes precedence (env fallback is default-account only).
3. Start the gateway.
4. DM access is pairing by default; approve the pairing code on first contact.

Minimal config:

Copy

```
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "123:abc",
      dmPolicy: "pairing"
    }
  }
}
```

## [​](https://docs.molt.bot/channels/telegram\#what-it-is)  What it is

- A Telegram Bot API channel owned by the Gateway.
- Deterministic routing: replies go back to Telegram; the model never chooses channels.
- DMs share the agent’s main session; groups stay isolated (`agent:<agentId>:telegram:group:<chatId>`).

## [​](https://docs.molt.bot/channels/telegram\#setup-fast-path)  Setup (fast path)

### [​](https://docs.molt.bot/channels/telegram\#1-create-a-bot-token-botfather)  1) Create a bot token (BotFather)

1. Open Telegram and chat with **@BotFather**.
2. Run `/newbot`, then follow the prompts (name + username ending in `bot`).
3. Copy the token and store it safely.

Optional BotFather settings:

- `/setjoingroups` — allow/deny adding the bot to groups.
- `/setprivacy` — control whether the bot sees all group messages.

### [​](https://docs.molt.bot/channels/telegram\#2-configure-the-token-env-or-config)  2) Configure the token (env or config)

Example:

Copy

```
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "123:abc",
      dmPolicy: "pairing",
      groups: { "*": { requireMention: true } }
    }
  }
}
```

Env option: `TELEGRAM_BOT_TOKEN=...` (works for the default account).
If both env and config are set, config takes precedence.Multi-account support: use `channels.telegram.accounts` with per-account tokens and optional `name`. See [`gateway/configuration`](https://docs.molt.bot/gateway/configuration#telegramaccounts--discordaccounts--slackaccounts--signalaccounts--imessageaccounts) for the shared pattern.

3. Start the gateway. Telegram starts when a token is resolved (config first, env fallback).
4. DM access defaults to pairing. Approve the code when the bot is first contacted.
5. For groups: add the bot, decide privacy/admin behavior (below), then set `channels.telegram.groups` to control mention gating + allowlists.

## [​](https://docs.molt.bot/channels/telegram\#token-+-privacy-+-permissions-telegram-side)  Token + privacy + permissions (Telegram side)

### [​](https://docs.molt.bot/channels/telegram\#token-creation-botfather)  Token creation (BotFather)

- `/newbot` creates the bot and returns the token (keep it secret).
- If a token leaks, revoke/regenerate it via @BotFather and update your config.

### [​](https://docs.molt.bot/channels/telegram\#group-message-visibility-privacy-mode)  Group message visibility (Privacy Mode)

Telegram bots default to **Privacy Mode**, which limits which group messages they receive.
If your bot must see _all_ group messages, you have two options:

- Disable privacy mode with `/setprivacy` **or**
- Add the bot as a group **admin** (admin bots receive all messages).

**Note:** When you toggle privacy mode, Telegram requires removing + re‑adding the bot
to each group for the change to take effect.

### [​](https://docs.molt.bot/channels/telegram\#group-permissions-admin-rights)  Group permissions (admin rights)

Admin status is set inside the group (Telegram UI). Admin bots always receive all
group messages, so use admin if you need full visibility.

## [​](https://docs.molt.bot/channels/telegram\#how-it-works-behavior)  How it works (behavior)

- Inbound messages are normalized into the shared channel envelope with reply context and media placeholders.
- Group replies require a mention by default (native @mention or `agents.list[].groupChat.mentionPatterns` / `messages.groupChat.mentionPatterns`).
- Multi-agent override: set per-agent patterns on `agents.list[].groupChat.mentionPatterns`.
- Replies always route back to the same Telegram chat.
- Long-polling uses grammY runner with per-chat sequencing; overall concurrency is capped by `agents.defaults.maxConcurrent`.
- Telegram Bot API does not support read receipts; there is no `sendReadReceipts` option.

## [​](https://docs.molt.bot/channels/telegram\#formatting-telegram-html)  Formatting (Telegram HTML)

- Outbound Telegram text uses `parse_mode: "HTML"` (Telegram’s supported tag subset).
- Markdown-ish input is rendered into **Telegram-safe HTML** (bold/italic/strike/code/links); block elements are flattened to text with newlines/bullets.
- Raw HTML from models is escaped to avoid Telegram parse errors.
- If Telegram rejects the HTML payload, Moltbot retries the same message as plain text.

## [​](https://docs.molt.bot/channels/telegram\#commands-native-+-custom)  Commands (native + custom)

Moltbot registers native commands (like `/status`, `/reset`, `/model`) with Telegram’s bot menu on startup.
You can add custom commands to the menu via config:

Copy

```
{
  channels: {
    telegram: {
      customCommands: [\
        { command: "backup", description: "Git backup" },\
        { command: "generate", description: "Create an image" }\
      ]
    }
  }
}
```

## [​](https://docs.molt.bot/channels/telegram\#troubleshooting)  Troubleshooting

- `setMyCommands failed` in logs usually means outbound HTTPS/DNS is blocked to `api.telegram.org`.
- If you see `sendMessage` or `sendChatAction` failures, check IPv6 routing and DNS.

More help: [Channel troubleshooting](https://docs.molt.bot/channels/troubleshooting).Notes:

- Custom commands are **menu entries only**; Moltbot does not implement them unless you handle them elsewhere.
- Command names are normalized (leading `/` stripped, lowercased) and must match `a-z`, `0-9`, `_` (1–32 chars).
- Custom commands **cannot override native commands**. Conflicts are ignored and logged.
- If `commands.native` is disabled, only custom commands are registered (or cleared if none).

## [​](https://docs.molt.bot/channels/telegram\#limits)  Limits

- Outbound text is chunked to `channels.telegram.textChunkLimit` (default 4000).
- Optional newline chunking: set `channels.telegram.chunkMode="newline"` to split on blank lines (paragraph boundaries) before length chunking.
- Media downloads/uploads are capped by `channels.telegram.mediaMaxMb` (default 5).
- Telegram Bot API requests time out after `channels.telegram.timeoutSeconds` (default 500 via grammY). Set lower to avoid long hangs.
- Group history context uses `channels.telegram.historyLimit` (or `channels.telegram.accounts.*.historyLimit`), falling back to `messages.groupChat.historyLimit`. Set `0` to disable (default 50).
- DM history can be limited with `channels.telegram.dmHistoryLimit` (user turns). Per-user overrides: `channels.telegram.dms["<user_id>"].historyLimit`.

## [​](https://docs.molt.bot/channels/telegram\#group-activation-modes)  Group activation modes

By default, the bot only responds to mentions in groups (`@botname` or patterns in `agents.list[].groupChat.mentionPatterns`). To change this behavior:

### [​](https://docs.molt.bot/channels/telegram\#via-config-recommended)  Via config (recommended)

Copy

```
{
  channels: {
    telegram: {
      groups: {
        "-1001234567890": { requireMention: false }  // always respond in this group
      }
    }
  }
}
```

**Important:** Setting `channels.telegram.groups` creates an **allowlist** \- only listed groups (or `"*"`) will be accepted.
Forum topics inherit their parent group config (allowFrom, requireMention, skills, prompts) unless you add per-topic overrides under `channels.telegram.groups.<groupId>.topics.<topicId>`.To allow all groups with always-respond:

Copy

```
{
  channels: {
    telegram: {
      groups: {
        "*": { requireMention: false }  // all groups, always respond
      }
    }
  }
}
```

To keep mention-only for all groups (default behavior):

Copy

```
{
  channels: {
    telegram: {
      groups: {
        "*": { requireMention: true }  // or omit groups entirely
      }
    }
  }
}
```

### [​](https://docs.molt.bot/channels/telegram\#via-command-session-level)  Via command (session-level)

Send in the group:

- `/activation always` \- respond to all messages
- `/activation mention` \- require mentions (default)

**Note:** Commands update session state only. For persistent behavior across restarts, use config.

### [​](https://docs.molt.bot/channels/telegram\#getting-the-group-chat-id)  Getting the group chat ID

Forward any message from the group to `@userinfobot` or `@getidsbot` on Telegram to see the chat ID (negative number like `-1001234567890`).**Tip:** For your own user ID, DM the bot and it will reply with your user ID (pairing message), or use `/whoami` once commands are enabled.**Privacy note:**`@userinfobot` is a third-party bot. If you prefer, add the bot to the group, send a message, and use `moltbot logs --follow` to read `chat.id`, or use the Bot API `getUpdates`.

## [​](https://docs.molt.bot/channels/telegram\#config-writes)  Config writes

By default, Telegram is allowed to write config updates triggered by channel events or `/config set|unset`.This happens when:

- A group is upgraded to a supergroup and Telegram emits `migrate_to_chat_id` (chat ID changes). Moltbot can migrate `channels.telegram.groups` automatically.
- You run `/config set` or `/config unset` in a Telegram chat (requires `commands.config: true`).

Disable with:

Copy

```
{
  channels: { telegram: { configWrites: false } }
}
```

## [​](https://docs.molt.bot/channels/telegram\#topics-forum-supergroups)  Topics (forum supergroups)

Telegram forum topics include a `message_thread_id` per message. Moltbot:

- Appends `:topic:<threadId>` to the Telegram group session key so each topic is isolated.
- Sends typing indicators and replies with `message_thread_id` so responses stay in the topic.
- General topic (thread id `1`) is special: message sends omit `message_thread_id` (Telegram rejects it), but typing indicators still include it.
- Exposes `MessageThreadId` \+ `IsForum` in template context for routing/templating.
- Topic-specific configuration is available under `channels.telegram.groups.<chatId>.topics.<threadId>` (skills, allowlists, auto-reply, system prompts, disable).
- Topic configs inherit group settings (requireMention, allowlists, skills, prompts, enabled) unless overridden per topic.

Private chats can include `message_thread_id` in some edge cases. Moltbot keeps the DM session key unchanged, but still uses the thread id for replies/draft streaming when it is present.

## [​](https://docs.molt.bot/channels/telegram\#inline-buttons)  Inline Buttons

Telegram supports inline keyboards with callback buttons.

Copy

```
{
  "channels": {
    "telegram": {
      "capabilities": {
        "inlineButtons": "allowlist"
      }
    }
  }
}
```

For per-account configuration:

Copy

```
{
  "channels": {
    "telegram": {
      "accounts": {
        "main": {
          "capabilities": {
            "inlineButtons": "allowlist"
          }
        }
      }
    }
  }
}
```

Scopes:

- `off` — inline buttons disabled
- `dm` — only DMs (group targets blocked)
- `group` — only groups (DM targets blocked)
- `all` — DMs + groups
- `allowlist` — DMs + groups, but only senders allowed by `allowFrom`/`groupAllowFrom` (same rules as control commands)

Default: `allowlist`.
Legacy: `capabilities: ["inlineButtons"]` = `inlineButtons: "all"`.

### [​](https://docs.molt.bot/channels/telegram\#sending-buttons)  Sending buttons

Use the message tool with the `buttons` parameter:

Copy

```
{
  "action": "send",
  "channel": "telegram",
  "to": "123456789",
  "message": "Choose an option:",
  "buttons": [\
    [\
      {"text": "Yes", "callback_data": "yes"},\
      {"text": "No", "callback_data": "no"}\
    ],\
    [\
      {"text": "Cancel", "callback_data": "cancel"}\
    ]\
  ]
}
```

When a user clicks a button, the callback data is sent back to the agent as a message with the format:
`callback_data: value`

### [​](https://docs.molt.bot/channels/telegram\#configuration-options)  Configuration options

Telegram capabilities can be configured at two levels (object form shown above; legacy string arrays still supported):

- `channels.telegram.capabilities`: Global default capability config applied to all Telegram accounts unless overridden.
- `channels.telegram.accounts.<account>.capabilities`: Per-account capabilities that override the global defaults for that specific account.

Use the global setting when all Telegram bots/accounts should behave the same. Use per-account configuration when different bots need different behaviors (for example, one account only handles DMs while another is allowed in groups).

## [​](https://docs.molt.bot/channels/telegram\#access-control-dms-+-groups)  Access control (DMs + groups)

### [​](https://docs.molt.bot/channels/telegram\#dm-access)  DM access

- Default: `channels.telegram.dmPolicy = "pairing"`. Unknown senders receive a pairing code; messages are ignored until approved (codes expire after 1 hour).
- Approve via:
  - `moltbot pairing list telegram`
  - `moltbot pairing approve telegram <CODE>`
- Pairing is the default token exchange used for Telegram DMs. Details: [Pairing](https://docs.molt.bot/start/pairing)
- `channels.telegram.allowFrom` accepts numeric user IDs (recommended) or `@username` entries. It is **not** the bot username; use the human sender’s ID. The wizard accepts `@username` and resolves it to the numeric ID when possible.

#### [​](https://docs.molt.bot/channels/telegram\#finding-your-telegram-user-id)  Finding your Telegram user ID

Safer (no third-party bot):

1. Start the gateway and DM your bot.
2. Run `moltbot logs --follow` and look for `from.id`.

Alternate (official Bot API):

1. DM your bot.
2. Fetch updates with your bot token and read `message.from.id`:







Copy











```
curl "https://api.telegram.org/bot<bot_token>/getUpdates"
```


Third-party (less private):

- DM `@userinfobot` or `@getidsbot` and use the returned user id.

### [​](https://docs.molt.bot/channels/telegram\#group-access)  Group access

Two independent controls:**1\. Which groups are allowed** (group allowlist via `channels.telegram.groups`):

- No `groups` config = all groups allowed
- With `groups` config = only listed groups or `"*"` are allowed
- Example: `"groups": { "-1001234567890": {}, "*": {} }` allows all groups

**2\. Which senders are allowed** (sender filtering via `channels.telegram.groupPolicy`):

- `"open"` = all senders in allowed groups can message
- `"allowlist"` = only senders in `channels.telegram.groupAllowFrom` can message
- `"disabled"` = no group messages accepted at all
Default is `groupPolicy: "allowlist"` (blocked unless you add `groupAllowFrom`).

Most users want: `groupPolicy: "allowlist"` \+ `groupAllowFrom` \+ specific groups listed in `channels.telegram.groups`

## [​](https://docs.molt.bot/channels/telegram\#long-polling-vs-webhook)  Long-polling vs webhook

- Default: long-polling (no public URL required).
- Webhook mode: set `channels.telegram.webhookUrl` (optionally `channels.telegram.webhookSecret` \+ `channels.telegram.webhookPath`).

  - The local listener binds to `0.0.0.0:8787` and serves `POST /telegram-webhook` by default.
  - If your public URL is different, use a reverse proxy and point `channels.telegram.webhookUrl` at the public endpoint.

## [​](https://docs.molt.bot/channels/telegram\#reply-threading)  Reply threading

Telegram supports optional threaded replies via tags:

- `[[reply_to_current]]` — reply to the triggering message.
- `[[reply_to:<id>]]` — reply to a specific message id.

Controlled by `channels.telegram.replyToMode`:

- `first` (default), `all`, `off`.

## [​](https://docs.molt.bot/channels/telegram\#audio-messages-voice-vs-file)  Audio messages (voice vs file)

Telegram distinguishes **voice notes** (round bubble) from **audio files** (metadata card).
Moltbot defaults to audio files for backward compatibility.To force a voice note bubble in agent replies, include this tag anywhere in the reply:

- `[[audio_as_voice]]` — send audio as a voice note instead of a file.

The tag is stripped from the delivered text. Other channels ignore this tag.For message tool sends, set `asVoice: true` with a voice-compatible audio `media` URL
(`message` is optional when media is present):

Copy

```
{
  "action": "send",
  "channel": "telegram",
  "to": "123456789",
  "media": "https://example.com/voice.ogg",
  "asVoice": true
}
```

## [​](https://docs.molt.bot/channels/telegram\#stickers)  Stickers

Moltbot supports receiving and sending Telegram stickers with intelligent caching.

### [​](https://docs.molt.bot/channels/telegram\#receiving-stickers)  Receiving stickers

When a user sends a sticker, Moltbot handles it based on the sticker type:

- **Static stickers (WEBP):** Downloaded and processed through vision. The sticker appears as a `<media:sticker>` placeholder in the message content.
- **Animated stickers (TGS):** Skipped (Lottie format not supported for processing).
- **Video stickers (WEBM):** Skipped (video format not supported for processing).

Template context field available when receiving stickers:

- `Sticker`— object with:

  - `emoji` — emoji associated with the sticker
  - `setName` — name of the sticker set
  - `fileId` — Telegram file ID (send the same sticker back)
  - `fileUniqueId` — stable ID for cache lookup
  - `cachedDescription` — cached vision description when available

### [​](https://docs.molt.bot/channels/telegram\#sticker-cache)  Sticker cache

Stickers are processed through the AI’s vision capabilities to generate descriptions. Since the same stickers are often sent repeatedly, Moltbot caches these descriptions to avoid redundant API calls.**How it works:**

1. **First encounter:** The sticker image is sent to the AI for vision analysis. The AI generates a description (e.g., “A cartoon cat waving enthusiastically”).
2. **Cache storage:** The description is saved along with the sticker’s file ID, emoji, and set name.
3. **Subsequent encounters:** When the same sticker is seen again, the cached description is used directly. The image is not sent to the AI.

**Cache location:**`~/.clawdbot/telegram/sticker-cache.json`**Cache entry format:**

Copy

```
{
  "fileId": "CAACAgIAAxkBAAI...",
  "fileUniqueId": "AgADBAADb6cxG2Y",
  "emoji": "👋",
  "setName": "CoolCats",
  "description": "A cartoon cat waving enthusiastically",
  "cachedAt": "2026-01-15T10:30:00.000Z"
}
```

**Benefits:**

- Reduces API costs by avoiding repeated vision calls for the same sticker
- Faster response times for cached stickers (no vision processing delay)
- Enables sticker search functionality based on cached descriptions

The cache is populated automatically as stickers are received. There is no manual cache management required.

### [​](https://docs.molt.bot/channels/telegram\#sending-stickers)  Sending stickers

The agent can send and search stickers using the `sticker` and `sticker-search` actions. These are disabled by default and must be enabled in config:

Copy

```
{
  channels: {
    telegram: {
      actions: {
        sticker: true
      }
    }
  }
}
```

**Send a sticker:**

Copy

```
{
  "action": "sticker",
  "channel": "telegram",
  "to": "123456789",
  "fileId": "CAACAgIAAxkBAAI..."
}
```

Parameters:

- `fileId` (required) — the Telegram file ID of the sticker. Obtain this from `Sticker.fileId` when receiving a sticker, or from a `sticker-search` result.
- `replyTo` (optional) — message ID to reply to.
- `threadId` (optional) — message thread ID for forum topics.

**Search for stickers:**The agent can search cached stickers by description, emoji, or set name:

Copy

```
{
  "action": "sticker-search",
  "channel": "telegram",
  "query": "cat waving",
  "limit": 5
}
```

Returns matching stickers from the cache:

Copy

```
{
  "ok": true,
  "count": 2,
  "stickers": [\
    {\
      "fileId": "CAACAgIAAxkBAAI...",\
      "emoji": "👋",\
      "description": "A cartoon cat waving enthusiastically",\
      "setName": "CoolCats"\
    }\
  ]
}
```

The search uses fuzzy matching across description text, emoji characters, and set names.**Example with threading:**

Copy

```
{
  "action": "sticker",
  "channel": "telegram",
  "to": "-1001234567890",
  "fileId": "CAACAgIAAxkBAAI...",
  "replyTo": 42,
  "threadId": 123
}
```

## [​](https://docs.molt.bot/channels/telegram\#streaming-drafts)  Streaming (drafts)

Telegram can stream **draft bubbles** while the agent is generating a response.
Moltbot uses Bot API `sendMessageDraft` (not real messages) and then sends the
final reply as a normal message.Requirements (Telegram Bot API 9.3+):

- **Private chats with topics enabled** (forum topic mode for the bot).
- Incoming messages must include `message_thread_id` (private topic thread).
- Streaming is ignored for groups/supergroups/channels.

Config:

- `channels.telegram.streamMode: "off" | "partial" | "block"` (default: `partial`)

  - `partial`: update the draft bubble with the latest streaming text.
  - `block`: update the draft bubble in larger blocks (chunked).
  - `off`: disable draft streaming.
- Optional (only for `streamMode: "block"`):

  - `channels.telegram.draftChunk: { minChars?, maxChars?, breakPreference? }`
    - defaults: `minChars: 200`, `maxChars: 800`, `breakPreference: "paragraph"` (clamped to `channels.telegram.textChunkLimit`).

Note: draft streaming is separate from **block streaming** (channel messages).
Block streaming is off by default and requires `channels.telegram.blockStreaming: true`
if you want early Telegram messages instead of draft updates.Reasoning stream (Telegram only):

- `/reasoning stream` streams reasoning into the draft bubble while the reply is
generating, then sends the final answer without reasoning.
- If `channels.telegram.streamMode` is `off`, reasoning stream is disabled.
More context: [Streaming + chunking](https://docs.molt.bot/concepts/streaming).

## [​](https://docs.molt.bot/channels/telegram\#retry-policy)  Retry policy

Outbound Telegram API calls retry on transient network/429 errors with exponential backoff and jitter. Configure via `channels.telegram.retry`. See [Retry policy](https://docs.molt.bot/concepts/retry).

## [​](https://docs.molt.bot/channels/telegram\#agent-tool-messages-+-reactions)  Agent tool (messages + reactions)

- Tool: `telegram` with `sendMessage` action (`to`, `content`, optional `mediaUrl`, `replyToMessageId`, `messageThreadId`).
- Tool: `telegram` with `react` action (`chatId`, `messageId`, `emoji`).
- Tool: `telegram` with `deleteMessage` action (`chatId`, `messageId`).
- Reaction removal semantics: see [/tools/reactions](https://docs.molt.bot/tools/reactions).
- Tool gating: `channels.telegram.actions.reactions`, `channels.telegram.actions.sendMessage`, `channels.telegram.actions.deleteMessage` (default: enabled), and `channels.telegram.actions.sticker` (default: disabled).

## [​](https://docs.molt.bot/channels/telegram\#reaction-notifications)  Reaction notifications

**How reactions work:**
Telegram reactions arrive as **separate `message_reaction` events**, not as properties in message payloads. When a user adds a reaction, Moltbot:

1. Receives the `message_reaction` update from Telegram API
2. Converts it to a **system event** with format: `"Telegram reaction added: {emoji} by {user} on msg {id}"`
3. Enqueues the system event using the **same session key** as regular messages
4. When the next message arrives in that conversation, system events are drained and prepended to the agent’s context

The agent sees reactions as **system notifications** in the conversation history, not as message metadata.**Configuration:**

- `channels.telegram.reactionNotifications`: Controls which reactions trigger notifications  - `"off"` — ignore all reactions
  - `"own"` — notify when users react to bot messages (best-effort; in-memory) (default)
  - `"all"` — notify for all reactions
- `channels.telegram.reactionLevel`: Controls agent’s reaction capability  - `"off"` — agent cannot react to messages
  - `"ack"` — bot sends acknowledgment reactions (👀 while processing) (default)
  - `"minimal"` — agent can react sparingly (guideline: 1 per 5-10 exchanges)
  - `"extensive"` — agent can react liberally when appropriate

**Forum groups:** Reactions in forum groups include `message_thread_id` and use session keys like `agent:main:telegram:group:{chatId}:topic:{threadId}`. This ensures reactions and messages in the same topic stay together.**Example config:**

Copy

```
{
  channels: {
    telegram: {
      reactionNotifications: "all",  // See all reactions
      reactionLevel: "minimal"        // Agent can react sparingly
    }
  }
}
```

**Requirements:**

- Telegram bots must explicitly request `message_reaction` in `allowed_updates` (configured automatically by Moltbot)
- For webhook mode, reactions are included in the webhook `allowed_updates`
- For polling mode, reactions are included in the `getUpdates``allowed_updates`

## [​](https://docs.molt.bot/channels/telegram\#delivery-targets-cli/cron)  Delivery targets (CLI/cron)

- Use a chat id (`123456789`) or a username (`@name`) as the target.
- Example: `moltbot message send --channel telegram --target 123456789 --message "hi"`.

## [​](https://docs.molt.bot/channels/telegram\#troubleshooting-2)  Troubleshooting

**Bot doesn’t respond to non-mention messages in a group:**

- If you set `channels.telegram.groups.*.requireMention=false`, Telegram’s Bot API **privacy mode** must be disabled.

  - BotFather: `/setprivacy` → **Disable** (then remove + re-add the bot to the group)
- `moltbot channels status` shows a warning when config expects unmentioned group messages.
- `moltbot channels status --probe` can additionally check membership for explicit numeric group IDs (it can’t audit wildcard `"*"` rules).
- Quick test: `/activation always` (session-only; use config for persistence)

**Bot not seeing group messages at all:**

- If `channels.telegram.groups` is set, the group must be listed or use `"*"`
- Check Privacy Settings in @BotFather → “Group Privacy” should be **OFF**
- Verify bot is actually a member (not just an admin with no read access)
- Check gateway logs: `moltbot logs --follow` (look for “skipping group message”)

**Bot responds to mentions but not `/activation always`:**

- The `/activation` command updates session state but doesn’t persist to config
- For persistent behavior, add group to `channels.telegram.groups` with `requireMention: false`

**Commands like `/status` don’t work:**

- Make sure your Telegram user ID is authorized (via pairing or `channels.telegram.allowFrom`)
- Commands require authorization even in groups with `groupPolicy: "open"`

**Long-polling aborts immediately on Node 22+ (often with proxies/custom fetch):**

- Node 22+ is stricter about `AbortSignal` instances; foreign signals can abort `fetch` calls right away.
- Upgrade to a Moltbot build that normalizes abort signals, or run the gateway on Node 20 until you can upgrade.

**Bot starts, then silently stops responding (or logs `HttpError: Network request ... failed`):**

- Some hosts resolve `api.telegram.org` to IPv6 first. If your server does not have working IPv6 egress, grammY can get stuck on IPv6-only requests.
- Fix by enabling IPv6 egress **or** forcing IPv4 resolution for `api.telegram.org` (for example, add an `/etc/hosts` entry using the IPv4 A record, or prefer IPv4 in your OS DNS stack), then restart the gateway.
- Quick check: `dig +short api.telegram.org A` and `dig +short api.telegram.org AAAA` to confirm what DNS returns.

## [​](https://docs.molt.bot/channels/telegram\#configuration-reference-telegram)  Configuration reference (Telegram)

Full configuration: [Configuration](https://docs.molt.bot/gateway/configuration)Provider options:

- `channels.telegram.enabled`: enable/disable channel startup.
- `channels.telegram.botToken`: bot token (BotFather).
- `channels.telegram.tokenFile`: read token from file path.
- `channels.telegram.dmPolicy`: `pairing | allowlist | open | disabled` (default: pairing).
- `channels.telegram.allowFrom`: DM allowlist (ids/usernames). `open` requires `"*"`.
- `channels.telegram.groupPolicy`: `open | allowlist | disabled` (default: allowlist).
- `channels.telegram.groupAllowFrom`: group sender allowlist (ids/usernames).
- `channels.telegram.groups`: per-group defaults + allowlist (use `"*"` for global defaults).

  - `channels.telegram.groups.<id>.requireMention`: mention gating default.
  - `channels.telegram.groups.<id>.skills`: skill filter (omit = all skills, empty = none).
  - `channels.telegram.groups.<id>.allowFrom`: per-group sender allowlist override.
  - `channels.telegram.groups.<id>.systemPrompt`: extra system prompt for the group.
  - `channels.telegram.groups.<id>.enabled`: disable the group when `false`.
  - `channels.telegram.groups.<id>.topics.<threadId>.*`: per-topic overrides (same fields as group).
  - `channels.telegram.groups.<id>.topics.<threadId>.requireMention`: per-topic mention gating override.
- `channels.telegram.capabilities.inlineButtons`: `off | dm | group | all | allowlist` (default: allowlist).
- `channels.telegram.accounts.<account>.capabilities.inlineButtons`: per-account override.
- `channels.telegram.replyToMode`: `off | first | all` (default: `first`).
- `channels.telegram.textChunkLimit`: outbound chunk size (chars).
- `channels.telegram.chunkMode`: `length` (default) or `newline` to split on blank lines (paragraph boundaries) before length chunking.
- `channels.telegram.linkPreview`: toggle link previews for outbound messages (default: true).
- `channels.telegram.streamMode`: `off | partial | block` (draft streaming).
- `channels.telegram.mediaMaxMb`: inbound/outbound media cap (MB).
- `channels.telegram.retry`: retry policy for outbound Telegram API calls (attempts, minDelayMs, maxDelayMs, jitter).
- `channels.telegram.network.autoSelectFamily`: override Node autoSelectFamily (true=enable, false=disable). Defaults to disabled on Node 22 to avoid Happy Eyeballs timeouts.
- `channels.telegram.proxy`: proxy URL for Bot API calls (SOCKS/HTTP).
- `channels.telegram.webhookUrl`: enable webhook mode.
- `channels.telegram.webhookSecret`: webhook secret (optional).
- `channels.telegram.webhookPath`: local webhook path (default `/telegram-webhook`).
- `channels.telegram.actions.reactions`: gate Telegram tool reactions.
- `channels.telegram.actions.sendMessage`: gate Telegram tool message sends.
- `channels.telegram.actions.deleteMessage`: gate Telegram tool message deletes.
- `channels.telegram.actions.sticker`: gate Telegram sticker actions — send and search (default: false).
- `channels.telegram.reactionNotifications`: `off | own | all` — control which reactions trigger system events (default: `own` when not set).
- `channels.telegram.reactionLevel`: `off | ack | minimal | extensive` — control agent’s reaction capability (default: `minimal` when not set).

Related global options:

- `agents.list[].groupChat.mentionPatterns` (mention gating patterns).
- `messages.groupChat.mentionPatterns` (global fallback).
- `commands.native` (defaults to `"auto"` → on for Telegram/Discord, off for Slack), `commands.text`, `commands.useAccessGroups` (command behavior). Override with `channels.telegram.commands.native`.
- `messages.responsePrefix`, `messages.ackReaction`, `messages.ackReactionScope`, `messages.removeAckAfterReply`.

[Whatsapp](https://docs.molt.bot/channels/whatsapp) [Grammy](https://docs.molt.bot/channels/grammy)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.