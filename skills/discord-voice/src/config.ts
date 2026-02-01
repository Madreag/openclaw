/**
 * Discord Voice Plugin Configuration
 */

// Placeholder for core TTS config compatibility
export interface VoiceCallTtsConfig {
  enabled?: boolean;
  voice?: string;
  [key: string]: unknown;
}

export interface DiscordVoiceConfig {
  enabled: boolean;
  sttProvider: "whisper" | "deepgram";
  streamingSTT: boolean;  // Use streaming STT (Deepgram only) for lower latency
  ttsProvider: "openai" | "elevenlabs";
  ttsVoice: string;
  vadSensitivity: "low" | "medium" | "high";
  bargeIn: boolean;       // Stop speaking when user starts talking
  responseChunking: boolean;  // Split response into sentences for lower perceived latency
  allowedUsers: string[];
  silenceThresholdMs: number;
  minAudioMs: number;
  maxRecordingMs: number;
  autoJoinChannel?: string; // Channel ID to auto-join on startup
  heartbeatIntervalMs?: number;  // Connection health check interval
  
  // Wake word detection - bot only responds when wake word is detected
  wakeWordEnabled?: boolean;  // Enable wake word detection
  wakeWord?: string;          // e.g. "hey veronica", "veronica"
  wakeWordAliases?: string[]; // Alternative spellings: ["hey veronica", "hey veronika", "a veronica"]
  alwaysListenMs?: number;    // Stay active for this many ms after wake word (default: 30000)
  endPhrases?: string[];      // Phrases that end "always listen" mode: ["goodbye", "that's all", "bye"]
  
  // LLM settings for voice responses (use fast models for low latency)
  model?: string;         // e.g. "anthropic/claude-3-5-haiku-latest" or "openai/gpt-4o-mini"
  thinkLevel?: string;    // "off", "low", "medium", "high" - lower = faster
  
  openai?: {
    apiKey?: string;
    whisperModel?: string;
    ttsModel?: string;
  };
  elevenlabs?: {
    apiKey?: string;
    voiceId?: string;
    modelId?: string;
  };
  deepgram?: {
    apiKey?: string;
    model?: string;
  };
}

export const DEFAULT_CONFIG: DiscordVoiceConfig = {
  enabled: true,
  sttProvider: "whisper",
  streamingSTT: true,       // Enable streaming by default when using Deepgram
  ttsProvider: "openai",
  ttsVoice: "nova",
  vadSensitivity: "medium",
  bargeIn: true,            // Enable barge-in by default
  responseChunking: true,   // Enable response chunking for lower perceived latency
  allowedUsers: [],
  silenceThresholdMs: 500, // 500ms - faster response after speech ends
  minAudioMs: 300,          // 300ms minimum - filter very short noise
  maxRecordingMs: 30000,
  heartbeatIntervalMs: 30000,
  // Wake word settings
  wakeWordEnabled: false,   // Disabled by default - responds to all speech
  // wakeWord: undefined    // e.g. "hey veronica"
  // wakeWordAliases: undefined  // e.g. ["hey veronica", "hey veronika"]
  alwaysListenMs: 30000,    // 30 seconds of always-listen after wake word
  endPhrases: ["goodbye", "that's all", "bye", "bye bye", "see you", "later"],
  // model: undefined - uses system default, recommend "anthropic/claude-3-5-haiku-latest" for speed
  // thinkLevel: undefined - defaults to "off" for voice (fastest)
};

export function parseConfig(raw: unknown): DiscordVoiceConfig {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_CONFIG;
  }

  const obj = raw as Record<string, unknown>;

  return {
    enabled: typeof obj.enabled === "boolean" ? obj.enabled : DEFAULT_CONFIG.enabled,
    sttProvider: obj.sttProvider === "deepgram" ? "deepgram" : "whisper",
    streamingSTT: typeof obj.streamingSTT === "boolean" ? obj.streamingSTT : DEFAULT_CONFIG.streamingSTT,
    ttsProvider: obj.ttsProvider === "elevenlabs" ? "elevenlabs" : "openai",
    ttsVoice: typeof obj.ttsVoice === "string" ? obj.ttsVoice : DEFAULT_CONFIG.ttsVoice,
    vadSensitivity: ["low", "medium", "high"].includes(obj.vadSensitivity as string)
      ? (obj.vadSensitivity as "low" | "medium" | "high")
      : DEFAULT_CONFIG.vadSensitivity,
    bargeIn: typeof obj.bargeIn === "boolean" ? obj.bargeIn : DEFAULT_CONFIG.bargeIn,
    responseChunking: typeof obj.responseChunking === "boolean" ? obj.responseChunking : DEFAULT_CONFIG.responseChunking,
    allowedUsers: Array.isArray(obj.allowedUsers)
      ? obj.allowedUsers.filter((u): u is string => typeof u === "string")
      : [],
    silenceThresholdMs:
      typeof obj.silenceThresholdMs === "number"
        ? obj.silenceThresholdMs
        : DEFAULT_CONFIG.silenceThresholdMs,
    minAudioMs:
      typeof obj.minAudioMs === "number"
        ? obj.minAudioMs
        : DEFAULT_CONFIG.minAudioMs,
    maxRecordingMs:
      typeof obj.maxRecordingMs === "number"
        ? obj.maxRecordingMs
        : DEFAULT_CONFIG.maxRecordingMs,
    autoJoinChannel:
      typeof obj.autoJoinChannel === "string" && obj.autoJoinChannel.trim()
        ? obj.autoJoinChannel.trim()
        : undefined,
    heartbeatIntervalMs:
      typeof obj.heartbeatIntervalMs === "number"
        ? obj.heartbeatIntervalMs
        : DEFAULT_CONFIG.heartbeatIntervalMs,
    // Wake word settings
    wakeWordEnabled:
      typeof obj.wakeWordEnabled === "boolean"
        ? obj.wakeWordEnabled
        : DEFAULT_CONFIG.wakeWordEnabled,
    wakeWord:
      typeof obj.wakeWord === "string" && obj.wakeWord.trim()
        ? obj.wakeWord.trim().toLowerCase()
        : undefined,
    wakeWordAliases: Array.isArray(obj.wakeWordAliases)
      ? obj.wakeWordAliases
          .filter((w): w is string => typeof w === "string")
          .map((w) => w.trim().toLowerCase())
      : undefined,
    alwaysListenMs:
      typeof obj.alwaysListenMs === "number"
        ? obj.alwaysListenMs
        : DEFAULT_CONFIG.alwaysListenMs,
    endPhrases: Array.isArray(obj.endPhrases)
      ? obj.endPhrases
          .filter((p): p is string => typeof p === "string")
          .map((p) => p.trim().toLowerCase())
      : DEFAULT_CONFIG.endPhrases,
    model: typeof obj.model === "string" ? obj.model : undefined,
    thinkLevel: typeof obj.thinkLevel === "string" ? obj.thinkLevel : undefined,
    openai: obj.openai && typeof obj.openai === "object"
      ? {
          apiKey: (obj.openai as Record<string, unknown>).apiKey as string | undefined,
          whisperModel: ((obj.openai as Record<string, unknown>).whisperModel as string) || "whisper-1",
          ttsModel: ((obj.openai as Record<string, unknown>).ttsModel as string) || "tts-1",
        }
      : undefined,
    elevenlabs: obj.elevenlabs && typeof obj.elevenlabs === "object"
      ? {
          apiKey: (obj.elevenlabs as Record<string, unknown>).apiKey as string | undefined,
          voiceId: (obj.elevenlabs as Record<string, unknown>).voiceId as string | undefined,
          modelId: ((obj.elevenlabs as Record<string, unknown>).modelId as string) || "eleven_multilingual_v2",
        }
      : undefined,
    deepgram: obj.deepgram && typeof obj.deepgram === "object"
      ? {
          apiKey: (obj.deepgram as Record<string, unknown>).apiKey as string | undefined,
          model: ((obj.deepgram as Record<string, unknown>).model as string) || "nova-2",
        }
      : undefined,
  };
}

/**
 * Get VAD threshold based on sensitivity setting
 */
export function getVadThreshold(sensitivity: "low" | "medium" | "high"): number {
  switch (sensitivity) {
    case "low":
      return 0.01; // Very sensitive - picks up quiet speech
    case "high":
      return 0.05; // Less sensitive - requires louder speech
    case "medium":
    default:
      return 0.02;
  }
}
