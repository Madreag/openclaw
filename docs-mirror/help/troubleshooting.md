---
source: https://docs.molt.bot/help/troubleshooting
title: Troubleshooting - Moltbot
---

[Skip to main content](https://docs.molt.bot/help/troubleshooting#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Troubleshooting](https://docs.molt.bot/help/troubleshooting#troubleshooting)
- [First 60 seconds](https://docs.molt.bot/help/troubleshooting#first-60-seconds)
- [Common “it broke” cases](https://docs.molt.bot/help/troubleshooting#common-%E2%80%9Cit-broke%E2%80%9D-cases)
- [moltbot: command not found](https://docs.molt.bot/help/troubleshooting#moltbot%3A-command-not-found)
- [Installer fails (or you need full logs)](https://docs.molt.bot/help/troubleshooting#installer-fails-or-you-need-full-logs)
- [Gateway “unauthorized”, can’t connect, or keeps reconnecting](https://docs.molt.bot/help/troubleshooting#gateway-%E2%80%9Cunauthorized%E2%80%9D%2C-can%E2%80%99t-connect%2C-or-keeps-reconnecting)
- [Control UI fails on HTTP (device identity required)](https://docs.molt.bot/help/troubleshooting#control-ui-fails-on-http-device-identity-required)
- [docs.molt.bot shows an SSL error (Comcast/Xfinity)](https://docs.molt.bot/help/troubleshooting#docs-molt-bot-shows-an-ssl-error-comcast%2Fxfinity)
- [Service says running, but RPC probe fails](https://docs.molt.bot/help/troubleshooting#service-says-running%2C-but-rpc-probe-fails)
- [Model/auth failures (rate limit, billing, “all models failed”)](https://docs.molt.bot/help/troubleshooting#model%2Fauth-failures-rate-limit%2C-billing%2C-%E2%80%9Call-models-failed%E2%80%9D)
- [/model says model not allowed](https://docs.molt.bot/help/troubleshooting#%2Fmodel-says-model-not-allowed)
- [When filing an issue](https://docs.molt.bot/help/troubleshooting#when-filing-an-issue)

# [​](https://docs.molt.bot/help/troubleshooting\#troubleshooting)  Troubleshooting

## [​](https://docs.molt.bot/help/troubleshooting\#first-60-seconds)  First 60 seconds

Run these in order:

Copy

```
moltbot status
moltbot status --all
moltbot gateway probe
moltbot logs --follow
moltbot doctor
```

If the gateway is reachable, deep probes:

Copy

```
moltbot status --deep
```

## [​](https://docs.molt.bot/help/troubleshooting\#common-%E2%80%9Cit-broke%E2%80%9D-cases)  Common “it broke” cases

### [​](https://docs.molt.bot/help/troubleshooting\#moltbot:-command-not-found)  `moltbot: command not found`

Almost always a Node/npm PATH issue. Start here:

- [Install (Node/npm PATH sanity)](https://docs.molt.bot/install#nodejs--npm-path-sanity)

### [​](https://docs.molt.bot/help/troubleshooting\#installer-fails-or-you-need-full-logs)  Installer fails (or you need full logs)

Re-run the installer in verbose mode to see the full trace and npm output:

Copy

```
curl -fsSL https://molt.bot/install.sh | bash -s -- --verbose
```

For beta installs:

Copy

```
curl -fsSL https://molt.bot/install.sh | bash -s -- --beta --verbose
```

You can also set `CLAWDBOT_VERBOSE=1` instead of the flag.

### [​](https://docs.molt.bot/help/troubleshooting\#gateway-%E2%80%9Cunauthorized%E2%80%9D,-can%E2%80%99t-connect,-or-keeps-reconnecting)  Gateway “unauthorized”, can’t connect, or keeps reconnecting

- [Gateway troubleshooting](https://docs.molt.bot/gateway/troubleshooting)
- [Gateway authentication](https://docs.molt.bot/gateway/authentication)

### [​](https://docs.molt.bot/help/troubleshooting\#control-ui-fails-on-http-device-identity-required)  Control UI fails on HTTP (device identity required)

- [Gateway troubleshooting](https://docs.molt.bot/gateway/troubleshooting)
- [Control UI](https://docs.molt.bot/web/control-ui#insecure-http)

### [​](https://docs.molt.bot/help/troubleshooting\#docs-molt-bot-shows-an-ssl-error-comcast/xfinity)  `docs.molt.bot` shows an SSL error (Comcast/Xfinity)

Some Comcast/Xfinity connections block `docs.molt.bot` via Xfinity Advanced Security.
Disable Advanced Security or add `docs.molt.bot` to the allowlist, then retry.

- Xfinity Advanced Security help: [https://www.xfinity.com/support/articles/using-xfinity-xfi-advanced-security](https://www.xfinity.com/support/articles/using-xfinity-xfi-advanced-security)
- Quick sanity checks: try a mobile hotspot or VPN to confirm it’s ISP-level filtering

### [​](https://docs.molt.bot/help/troubleshooting\#service-says-running,-but-rpc-probe-fails)  Service says running, but RPC probe fails

- [Gateway troubleshooting](https://docs.molt.bot/gateway/troubleshooting)
- [Background process / service](https://docs.molt.bot/gateway/background-process)

### [​](https://docs.molt.bot/help/troubleshooting\#model/auth-failures-rate-limit,-billing,-%E2%80%9Call-models-failed%E2%80%9D)  Model/auth failures (rate limit, billing, “all models failed”)

- [Models](https://docs.molt.bot/cli/models)
- [OAuth / auth concepts](https://docs.molt.bot/concepts/oauth)

### [​](https://docs.molt.bot/help/troubleshooting\#/model-says-model-not-allowed)  `/model` says `model not allowed`

This usually means `agents.defaults.models` is configured as an allowlist. When it’s non-empty,
only those provider/model keys can be selected.

- Check the allowlist: `moltbot config get agents.defaults.models`
- Add the model you want (or clear the allowlist) and retry `/model`
- Use `/models` to browse the allowed providers/models

### [​](https://docs.molt.bot/help/troubleshooting\#when-filing-an-issue)  When filing an issue

Paste a safe report:

Copy

```
moltbot status --all
```

If you can, include the relevant log tail from `moltbot logs --follow`.

[Help](https://docs.molt.bot/help) [Faq](https://docs.molt.bot/help/faq)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.