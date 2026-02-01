---
source: https://docs.molt.bot/providers/deepgram
title: Deepgram - Moltbot
---

[Skip to main content](https://docs.molt.bot/providers/deepgram#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Deepgram (Audio Transcription)](https://docs.molt.bot/providers/deepgram#deepgram-audio-transcription)
- [Quick start](https://docs.molt.bot/providers/deepgram#quick-start)
- [Options](https://docs.molt.bot/providers/deepgram#options)
- [Notes](https://docs.molt.bot/providers/deepgram#notes)

# [​](https://docs.molt.bot/providers/deepgram\#deepgram-audio-transcription)  Deepgram (Audio Transcription)

Deepgram is a speech-to-text API. In Moltbot it is used for **inbound audio/voice note**
**transcription** via `tools.media.audio`.When enabled, Moltbot uploads the audio file to Deepgram and injects the transcript
into the reply pipeline (`{{Transcript}}` \+ `[Audio]` block). This is **not streaming**;
it uses the pre-recorded transcription endpoint.Website: [https://deepgram.com](https://deepgram.com/)

Docs: [https://developers.deepgram.com](https://developers.deepgram.com/)

## [​](https://docs.molt.bot/providers/deepgram\#quick-start)  Quick start

1. Set your API key:

Copy

```
DEEPGRAM_API_KEY=dg_...
```

2. Enable the provider:

Copy

```
{
  tools: {
    media: {
      audio: {
        enabled: true,
        models: [{ provider: "deepgram", model: "nova-3" }]
      }
    }
  }
}
```

## [​](https://docs.molt.bot/providers/deepgram\#options)  Options

- `model`: Deepgram model id (default: `nova-3`)
- `language`: language hint (optional)
- `tools.media.audio.providerOptions.deepgram.detect_language`: enable language detection (optional)
- `tools.media.audio.providerOptions.deepgram.punctuate`: enable punctuation (optional)
- `tools.media.audio.providerOptions.deepgram.smart_format`: enable smart formatting (optional)

Example with language:

Copy

```
{
  tools: {
    media: {
      audio: {
        enabled: true,
        models: [\
          { provider: "deepgram", model: "nova-3", language: "en" }\
        ]
      }
    }
  }
}
```

Example with Deepgram options:

Copy

```
{
  tools: {
    media: {
      audio: {
        enabled: true,
        providerOptions: {
          deepgram: {
            detect_language: true,
            punctuate: true,
            smart_format: true
          }
        },
        models: [{ provider: "deepgram", model: "nova-3" }]
      }
    }
  }
}
```

## [​](https://docs.molt.bot/providers/deepgram\#notes)  Notes

- Authentication follows the standard provider auth order; `DEEPGRAM_API_KEY` is the simplest path.
- Override endpoints or headers with `tools.media.audio.baseUrl` and `tools.media.audio.headers` when using a proxy.
- Output follows the same audio rules as other providers (size caps, timeouts, transcript injection).

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.