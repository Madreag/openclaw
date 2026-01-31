/**
 * Discord Voice Connection Manager
 * Handles joining, leaving, listening, and speaking in voice channels
 * 
 * Features:
 * - Barge-in: Stops speaking when user starts talking
 * - Auto-reconnect heartbeat: Keeps connection alive
 * - Streaming STT: Real-time transcription with Deepgram
 */

import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  getVoiceConnection,
  EndBehaviorType,
  StreamType,
  type VoiceConnection,
  type AudioPlayer,
  type AudioReceiveStream,
} from "@discordjs/voice";
import type {
  VoiceChannel,
  StageChannel,
  GuildMember,
  VoiceBasedChannel,
} from "discord.js";
import { Readable, PassThrough } from "stream";
import { pipeline } from "stream/promises";
import * as prism from "prism-media";

import type { DiscordVoiceConfig } from "./config.js";
import { getVadThreshold } from "./config.js";

/**
 * Split text into sentence chunks for lower perceived TTS latency.
 * Returns chunks at sentence boundaries (. ! ?) so TTS can start
 * playing the first sentence while subsequent ones are synthesized.
 */
function chunkBySentence(text: string): string[] {
  // Match sentences ending with . ! ? (including trailing quotes/parens)
  // Handle common abbreviations to avoid false splits
  const abbreviations = /(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|i\.e|e\.g)\.\s*/gi;
  const protectedText = text.replace(abbreviations, (match) => match.replace('.', '\u0000'));
  
  // Split on sentence boundaries
  const matches = protectedText.match(/[^.!?]+[.!?]+["'\)]*\s*/g);
  
  if (!matches || matches.length === 0) {
    return [text.trim()].filter(Boolean);
  }
  
  // Restore protected periods and clean up
  return matches
    .map(chunk => chunk.replace(/\u0000/g, '.').trim())
    .filter(chunk => chunk.length > 0);
}

/**
 * Merge very short chunks with their neighbors for better TTS flow.
 * Very short sentences sound choppy when synthesized separately.
 */
function mergeShortChunks(chunks: string[], minLength = 30): string[] {
  if (chunks.length <= 1) return chunks;
  
  const merged: string[] = [];
  let buffer = '';
  
  for (const chunk of chunks) {
    if (buffer.length === 0) {
      buffer = chunk;
    } else if (buffer.length < minLength) {
      // Buffer is too short, append this chunk
      buffer = buffer + ' ' + chunk;
    } else {
      // Buffer is long enough, push it and start new
      merged.push(buffer);
      buffer = chunk;
    }
  }
  
  // Don't forget the last buffer
  if (buffer.length > 0) {
    merged.push(buffer);
  }
  
  return merged;
}

/**
 * Get RMS threshold based on VAD sensitivity
 * Higher = less sensitive (filters more noise)
 */
function getRmsThreshold(sensitivity: "low" | "medium" | "high"): number {
  switch (sensitivity) {
    case "low":
      return 400;   // More sensitive - picks up quieter speech
    case "high":
      return 1200;  // Less sensitive - requires louder speech, filters more noise
    case "medium":
    default:
      return 800;   // Balanced default
  }
}
import { createSTTProvider, type STTProvider } from "./stt.js";
import { createTTSProvider, type TTSProvider } from "./tts.js";
import { StreamingSTTManager, createStreamingSTTProvider } from "./streaming-stt.js";
import { createStreamingTTSProvider, type StreamingTTSProvider } from "./streaming-tts.js";

interface Logger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  debug?(msg: string): void;
}

interface UserAudioState {
  chunks: Buffer[];
  lastActivityMs: number;
  isRecording: boolean;
  silenceTimer?: ReturnType<typeof setTimeout>;
  opusStream?: AudioReceiveStream;
  decoder?: prism.opus.Decoder;
}

export interface VoiceSession {
  guildId: string;
  channelId: string;
  channelName?: string;
  connection: VoiceConnection;
  player: AudioPlayer;
  userAudioStates: Map<string, UserAudioState>;
  speaking: boolean;
  processing: boolean;           // Lock to prevent concurrent processing
  lastSpokeAt?: number;          // Timestamp when bot finished speaking (for cooldown)
  startedSpeakingAt?: number;    // Timestamp when bot started speaking (for echo suppression)
  thinkingPlayer?: AudioPlayer;  // Separate player for thinking sound
  heartbeatInterval?: ReturnType<typeof setInterval>;
  lastHeartbeat?: number;
  reconnecting?: boolean;
}

/**
 * Track "always listen" mode per user
 * After wake word detection, user can speak freely without wake word for a period
 */
interface AlwaysListenState {
  userId: string;
  expiresAt: number;  // Timestamp when always-listen mode expires
  timer?: ReturnType<typeof setTimeout>;
}

export class VoiceConnectionManager {
  private sessions: Map<string, VoiceSession> = new Map();
  private config: DiscordVoiceConfig;
  private sttProvider: STTProvider | null = null;
  private streamingSTT: StreamingSTTManager | null = null;
  private ttsProvider: TTSProvider | null = null;
  private streamingTTS: StreamingTTSProvider | null = null;
  private logger: Logger;
  private onTranscript: (userId: string, guildId: string, channelId: string, text: string) => Promise<string>;
  private botUserId: string | null = null;
  
  // Wake word: track users in "always listen" mode
  private alwaysListenUsers: Map<string, AlwaysListenState> = new Map();

  // Heartbeat configuration (can be overridden via config.heartbeatIntervalMs)
  private readonly DEFAULT_HEARTBEAT_INTERVAL_MS = 30_000;  // 30 seconds
  private readonly HEARTBEAT_TIMEOUT_MS = 60_000;   // 60 seconds before reconnect
  private readonly MAX_RECONNECT_ATTEMPTS = 3;
  
  private get HEARTBEAT_INTERVAL_MS(): number {
    return this.config.heartbeatIntervalMs ?? this.DEFAULT_HEARTBEAT_INTERVAL_MS;
  }

  constructor(
    config: DiscordVoiceConfig,
    logger: Logger,
    onTranscript: (userId: string, guildId: string, channelId: string, text: string) => Promise<string>,
    botUserId?: string
  ) {
    this.config = config;
    this.logger = logger;
    this.onTranscript = onTranscript;
    this.botUserId = botUserId || null;
  }
  
  /**
   * Set the bot's user ID (for filtering out echo)
   */
  setBotUserId(userId: string): void {
    this.botUserId = userId;
    this.logger.info(`[discord-voice] Bot user ID set to ${userId}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WAKE WORD DETECTION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Check if wake word detection is enabled
   */
  private isWakeWordEnabled(): boolean {
    return !!(this.config.wakeWordEnabled && (this.config.wakeWord || this.config.wakeWordAliases?.length));
  }

  /**
   * Get all wake word patterns (main + aliases)
   */
  private getWakeWordPatterns(): string[] {
    const patterns: string[] = [];
    if (this.config.wakeWord) {
      patterns.push(this.config.wakeWord.toLowerCase());
    }
    if (this.config.wakeWordAliases) {
      patterns.push(...this.config.wakeWordAliases.map(w => w.toLowerCase()));
    }
    return patterns;
  }

  /**
   * Check if transcript contains wake word
   * Returns the matched pattern or null if no match
   */
  private findWakeWord(transcript: string): string | null {
    const lowerTranscript = transcript.toLowerCase();
    const patterns = this.getWakeWordPatterns();
    
    for (const pattern of patterns) {
      if (lowerTranscript.includes(pattern)) {
        return pattern;
      }
    }
    return null;
  }

  /**
   * Strip wake word from transcript
   */
  private stripWakeWord(transcript: string, pattern: string): string {
    // Create regex to match the pattern (case-insensitive)
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return transcript.replace(regex, '').trim();
  }

  /**
   * Check if transcript contains an end phrase
   */
  private containsEndPhrase(transcript: string): boolean {
    const lowerTranscript = transcript.toLowerCase();
    const endPhrases = this.config.endPhrases || [];
    
    for (const phrase of endPhrases) {
      if (lowerTranscript.includes(phrase.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if user is in "always listen" mode
   */
  private isAlwaysListening(userId: string): boolean {
    const state = this.alwaysListenUsers.get(userId);
    if (!state) return false;
    
    // Check if expired
    if (Date.now() > state.expiresAt) {
      this.exitAlwaysListenMode(userId);
      return false;
    }
    return true;
  }

  /**
   * Enter "always listen" mode for a user
   */
  private enterAlwaysListenMode(userId: string): void {
    // Clear existing timer if any
    const existing = this.alwaysListenUsers.get(userId);
    if (existing?.timer) {
      clearTimeout(existing.timer);
    }

    const durationMs = this.config.alwaysListenMs || 30000;
    const expiresAt = Date.now() + durationMs;

    const timer = setTimeout(() => {
      this.logger.info(`[discord-voice] Always-listen mode expired for user ${userId}`);
      this.alwaysListenUsers.delete(userId);
    }, durationMs);

    this.alwaysListenUsers.set(userId, { userId, expiresAt, timer });
    this.logger.info(`[discord-voice] Entered always-listen mode for user ${userId} (${durationMs / 1000}s)`);
  }

  /**
   * Extend "always listen" mode (called on each valid interaction)
   */
  private extendAlwaysListenMode(userId: string): void {
    if (this.isAlwaysListening(userId)) {
      this.enterAlwaysListenMode(userId);  // Re-enter to reset timer
    }
  }

  /**
   * Exit "always listen" mode for a user
   */
  private exitAlwaysListenMode(userId: string): void {
    const state = this.alwaysListenUsers.get(userId);
    if (state?.timer) {
      clearTimeout(state.timer);
    }
    this.alwaysListenUsers.delete(userId);
    this.logger.info(`[discord-voice] Exited always-listen mode for user ${userId}`);
  }

  /**
   * Process transcript through wake word filter
   * Returns processed transcript or null if should be ignored
   */
  private processWakeWord(userId: string, transcript: string): { text: string; shouldRespond: boolean } {
    // If wake word detection is disabled, always respond
    if (!this.isWakeWordEnabled()) {
      return { text: transcript, shouldRespond: true };
    }

    const lowerTranscript = transcript.toLowerCase();

    // Check for end phrases first
    if (this.isAlwaysListening(userId) && this.containsEndPhrase(transcript)) {
      this.exitAlwaysListenMode(userId);
      // Still process the message (might be "goodbye, thanks for your help")
      return { text: transcript, shouldRespond: true };
    }

    // Check if user is in "always listen" mode
    if (this.isAlwaysListening(userId)) {
      // Extend the timer on valid interaction
      this.extendAlwaysListenMode(userId);
      return { text: transcript, shouldRespond: true };
    }

    // Check for wake word
    const matchedPattern = this.findWakeWord(transcript);
    if (matchedPattern) {
      // Enter always-listen mode
      this.enterAlwaysListenMode(userId);
      
      // Strip wake word from transcript
      const strippedText = this.stripWakeWord(transcript, matchedPattern);
      
      // If there's nothing left after stripping wake word, just acknowledge
      if (!strippedText || strippedText.trim().length === 0) {
        // Return a prompt acknowledgment - the bot should respond naturally
        return { text: "I'm listening.", shouldRespond: true };
      }
      
      return { text: strippedText, shouldRespond: true };
    }

    // No wake word and not in always-listen mode - ignore
    this.logger.debug?.(`[discord-voice] Ignoring transcript (no wake word): "${transcript.substring(0, 50)}..."`);
    return { text: transcript, shouldRespond: false };
  }

  /**
   * Initialize providers lazily
   */
  private ensureProviders(): void {
    if (!this.sttProvider) {
      this.sttProvider = createSTTProvider(this.config);
    }
    if (!this.ttsProvider) {
      this.ttsProvider = createTTSProvider(this.config);
    }
    // Initialize streaming TTS (always, for lower latency)
    if (!this.streamingTTS) {
      this.streamingTTS = createStreamingTTSProvider(this.config);
    }
    // Initialize streaming STT if using Deepgram with streaming enabled
    if (!this.streamingSTT && this.config.sttProvider === "deepgram" && this.config.streamingSTT) {
      this.streamingSTT = createStreamingSTTProvider(this.config);
    }
  }

  /**
   * Join a voice channel
   */
  async join(channel: VoiceBasedChannel): Promise<VoiceSession> {
    const existingSession = this.sessions.get(channel.guildId);
    if (existingSession) {
      if (existingSession.channelId === channel.id) {
        return existingSession;
      }
      // Leave current channel first
      await this.leave(channel.guildId);
    }

    this.ensureProviders();

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guildId,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false, // We need to hear users
      selfMute: false,
    });

    const player = createAudioPlayer();
    connection.subscribe(player);

    const session: VoiceSession = {
      guildId: channel.guildId,
      channelId: channel.id,
      channelName: channel.name,
      connection,
      player,
      userAudioStates: new Map(),
      speaking: false,
      processing: false,
      lastHeartbeat: Date.now(),
    };

    this.sessions.set(channel.guildId, session);

    // Wait for the connection to be ready
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
      this.logger.info(`[discord-voice] Joined voice channel ${channel.name} in ${channel.guild.name}`);
    } catch (error) {
      connection.destroy();
      this.sessions.delete(channel.guildId);
      throw new Error(`Failed to join voice channel: ${error}`);
    }

    // Start listening to users
    this.startListening(session);

    // Start heartbeat for connection health monitoring
    this.startHeartbeat(session);

    // Handle connection state changes
    this.setupConnectionHandlers(session, channel);

    return session;
  }

  /**
   * Setup connection event handlers for auto-reconnect
   */
  private setupConnectionHandlers(session: VoiceSession, channel: VoiceBasedChannel): void {
    const connection = session.connection;

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      if (session.reconnecting) return;
      
      this.logger.warn(`[discord-voice] Disconnected from voice channel in ${channel.guild.name}`);
      
      try {
        // Try to reconnect within 5 seconds
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
        this.logger.info(`[discord-voice] Reconnecting to voice channel...`);
      } catch {
        // Connection is not recovering, attempt manual reconnect
        await this.attemptReconnect(session, channel);
      }
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      session.lastHeartbeat = Date.now();
      session.reconnecting = false;
      this.logger.info(`[discord-voice] Connection ready for ${channel.name}`);
    });

    connection.on("error", (error) => {
      this.logger.error(`[discord-voice] Connection error: ${error.message}`);
    });
  }

  /**
   * Attempt to reconnect to voice channel
   */
  private async attemptReconnect(session: VoiceSession, channel: VoiceBasedChannel, attempt = 1): Promise<void> {
    if (attempt > this.MAX_RECONNECT_ATTEMPTS) {
      this.logger.error(`[discord-voice] Max reconnection attempts reached, giving up`);
      await this.leave(session.guildId);
      return;
    }

    session.reconnecting = true;
    this.logger.info(`[discord-voice] Reconnection attempt ${attempt}/${this.MAX_RECONNECT_ATTEMPTS}`);

    try {
      // Destroy old connection
      session.connection.destroy();

      // Wait before reconnecting (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));

      // Create new connection
      const newConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      });

      const newPlayer = createAudioPlayer();
      newConnection.subscribe(newPlayer);

      // Update session
      session.connection = newConnection;
      session.player = newPlayer;

      // Wait for ready
      await entersState(newConnection, VoiceConnectionStatus.Ready, 20_000);
      
      session.reconnecting = false;
      session.lastHeartbeat = Date.now();
      
      // Restart listening
      this.startListening(session);
      
      // Setup handlers for new connection
      this.setupConnectionHandlers(session, channel);
      
      this.logger.info(`[discord-voice] Reconnected successfully`);
    } catch (error) {
      this.logger.error(`[discord-voice] Reconnection failed: ${error instanceof Error ? error.message : String(error)}`);
      await this.attemptReconnect(session, channel, attempt + 1);
    }
  }

  /**
   * Start heartbeat monitoring for session
   */
  private startHeartbeat(session: VoiceSession): void {
    // Clear any existing heartbeat
    if (session.heartbeatInterval) {
      clearInterval(session.heartbeatInterval);
    }

    session.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      const connectionState = session.connection.state.status;
      
      // Update heartbeat if connection is healthy
      if (connectionState === VoiceConnectionStatus.Ready) {
        session.lastHeartbeat = now;
        this.logger.debug?.(`[discord-voice] Heartbeat OK for guild ${session.guildId}`);
      } else if (session.lastHeartbeat && (now - session.lastHeartbeat > this.HEARTBEAT_TIMEOUT_MS)) {
        // Connection has been unhealthy for too long
        this.logger.warn(`[discord-voice] Heartbeat timeout, connection state: ${connectionState}`);
        
        // Don't attempt reconnect if already doing so
        if (!session.reconnecting) {
          // Trigger reconnection by destroying and rejoining
          this.logger.info(`[discord-voice] Triggering reconnection due to heartbeat timeout`);
          session.connection.destroy();
        }
      }
    }, this.HEARTBEAT_INTERVAL_MS);
  }

  /**
   * Leave a voice channel
   */
  async leave(guildId: string): Promise<boolean> {
    const session = this.sessions.get(guildId);
    if (!session) {
      return false;
    }

    // Clear heartbeat
    if (session.heartbeatInterval) {
      clearInterval(session.heartbeatInterval);
    }

    // Clear all user timers and streams
    for (const state of session.userAudioStates.values()) {
      if (state.silenceTimer) {
        clearTimeout(state.silenceTimer);
      }
      if (state.opusStream) {
        state.opusStream.destroy();
      }
      if (state.decoder) {
        state.decoder.destroy();
      }
    }

    // Close streaming STT sessions
    if (this.streamingSTT) {
      for (const userId of session.userAudioStates.keys()) {
        this.streamingSTT.closeSession(userId);
      }
    }

    session.connection.destroy();
    this.sessions.delete(guildId);
    this.logger.info(`[discord-voice] Left voice channel in guild ${guildId}`);
    return true;
  }

  /**
   * Start listening to voice in the channel
   */
  private startListening(session: VoiceSession): void {
    const receiver = session.connection.receiver;

    receiver.speaking.on("start", (userId: string) => {
      // ═══════════════════════════════════════════════════════════════
      // ECHO FILTER: Ignore speech events from the bot itself
      // This is the primary defense against echo-triggered barge-in
      // ═══════════════════════════════════════════════════════════════
      if (this.botUserId && userId === this.botUserId) {
        this.logger.debug?.(`[discord-voice] Ignoring speech from bot itself (echo filter)`);
        return;
      }
      
      if (!this.isUserAllowed(userId)) {
        return;
      }

      // Ignore audio during cooldown period (prevents residual echo)
      const SPEAK_COOLDOWN_MS = 500;
      if (session.lastSpokeAt && (Date.now() - session.lastSpokeAt) < SPEAK_COOLDOWN_MS) {
        this.logger.debug?.(`[discord-voice] Ignoring speech during cooldown (likely residual echo)`);
        return;
      }

      this.logger.debug?.(`[discord-voice] User ${userId} started speaking`);
      
      // ═══════════════════════════════════════════════════════════════
      // BARGE-IN: If we're speaking and a REAL user starts talking, stop
      // Now that we filter out bot's own userId, we can safely do barge-in
      // ═══════════════════════════════════════════════════════════════
      if (session.speaking) {
        if (this.config.bargeIn) {
          this.logger.info(`[discord-voice] Barge-in detected from user ${userId}! Stopping speech.`);
          this.stopSpeaking(session);
          session.lastSpokeAt = Date.now();
        }
        // Clear streaming transcripts and wait for next speech event
        if (this.streamingSTT) {
          this.streamingSTT.closeSession(userId);
        }
        return;
      }
      
      if (session.processing) {
        // While processing a request, don't start new recordings
        if (this.streamingSTT) {
          this.streamingSTT.closeSession(userId);
        }
        this.logger.debug?.(`[discord-voice] Ignoring speech while processing`);
        return;
      }

      let state = session.userAudioStates.get(userId);
      if (!state) {
        state = {
          chunks: [],
          lastActivityMs: Date.now(),
          isRecording: false,
        };
        session.userAudioStates.set(userId, state);
      }

      // Clear any existing silence timer
      if (state.silenceTimer) {
        clearTimeout(state.silenceTimer);
        state.silenceTimer = undefined;
      }

      if (!state.isRecording) {
        state.isRecording = true;
        state.chunks = [];
        this.startRecording(session, userId);
      }

      state.lastActivityMs = Date.now();
    });

    receiver.speaking.on("end", (userId: string) => {
      if (!this.isUserAllowed(userId)) {
        return;
      }

      this.logger.debug?.(`[discord-voice] User ${userId} stopped speaking`);
      
      const state = session.userAudioStates.get(userId);
      if (!state || !state.isRecording) {
        return;
      }

      state.lastActivityMs = Date.now();

      // Set silence timer to process the recording
      state.silenceTimer = setTimeout(async () => {
        if (state.isRecording && state.chunks.length > 0) {
          state.isRecording = false;
          
          // Clean up streams
          if (state.opusStream) {
            state.opusStream.destroy();
            state.opusStream = undefined;
          }
          if (state.decoder) {
            state.decoder.destroy();
            state.decoder = undefined;
          }
          
          await this.processRecording(session, userId, state.chunks);
          state.chunks = [];
        }
      }, this.config.silenceThresholdMs);
    });
  }

  /**
   * Stop any current speech output (for barge-in)
   */
  private stopSpeaking(session: VoiceSession): void {
    // Stop main player
    if (session.player.state.status !== AudioPlayerStatus.Idle) {
      session.player.stop(true);
    }
    
    // Stop thinking player if active
    if (session.thinkingPlayer && session.thinkingPlayer.state.status !== AudioPlayerStatus.Idle) {
      session.thinkingPlayer.stop(true);
      session.thinkingPlayer.removeAllListeners();
      session.thinkingPlayer = undefined;
    }

    session.speaking = false;
  }

  /**
   * Start recording audio from a user
   */
  private startRecording(session: VoiceSession, userId: string): void {
    const state = session.userAudioStates.get(userId);
    if (!state) return;

    const opusStream = session.connection.receiver.subscribe(userId, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: this.config.silenceThresholdMs,
      },
    });

    state.opusStream = opusStream;

    // Decode Opus to PCM
    const decoder = new prism.opus.Decoder({
      rate: 48000,
      channels: 1,
      frameSize: 960,
    });

    state.decoder = decoder;
    opusStream.pipe(decoder);

    // If streaming STT is available and enabled, use it
    const useStreaming = this.streamingSTT && this.config.sttProvider === "deepgram" && this.config.streamingSTT;
    
    if (useStreaming && this.streamingSTT) {
      // Create streaming session for this user
      const streamingSession = this.streamingSTT.getOrCreateSession(userId, (text, isFinal) => {
        if (isFinal) {
          this.logger.debug?.(`[discord-voice] Streaming transcript (final): "${text}"`);
        } else {
          this.logger.debug?.(`[discord-voice] Streaming transcript (interim): "${text}"`);
        }
      });

      decoder.on("data", (chunk: Buffer) => {
        if (state.isRecording) {
          // Send to streaming STT
          this.streamingSTT?.sendAudio(userId, chunk);
          
          // Also buffer for fallback/debugging
          state.chunks.push(chunk);
          state.lastActivityMs = Date.now();

          // Check max recording length
          const totalSize = state.chunks.reduce((sum, c) => sum + c.length, 0);
          const durationMs = (totalSize / 2) / 48; // 16-bit samples at 48kHz
          if (durationMs >= this.config.maxRecordingMs) {
            this.logger.debug?.(`[discord-voice] Max recording length reached for user ${userId}`);
            state.isRecording = false;
            this.processRecording(session, userId, state.chunks);
            state.chunks = [];
          }
        }
      });
    } else {
      // Batch mode - just buffer audio
      decoder.on("data", (chunk: Buffer) => {
        if (state.isRecording) {
          state.chunks.push(chunk);
          state.lastActivityMs = Date.now();

          // Check max recording length
          const totalSize = state.chunks.reduce((sum, c) => sum + c.length, 0);
          const durationMs = (totalSize / 2) / 48; // 16-bit samples at 48kHz
          if (durationMs >= this.config.maxRecordingMs) {
            this.logger.debug?.(`[discord-voice] Max recording length reached for user ${userId}`);
            state.isRecording = false;
            this.processRecording(session, userId, state.chunks);
            state.chunks = [];
          }
        }
      });
    }

    decoder.on("end", () => {
      this.logger.debug?.(`[discord-voice] Decoder stream ended for user ${userId}`);
    });

    decoder.on("error", (error: Error) => {
      this.logger.error(`[discord-voice] Decoder error for user ${userId}: ${error.message}`);
    });
  }

  /**
   * Process recorded audio through STT and get response
   */
  private async processRecording(session: VoiceSession, userId: string, chunks: Buffer[]): Promise<void> {
    if (!this.sttProvider || !this.ttsProvider) {
      return;
    }

    // Skip if already speaking (prevents overlapping responses)
    if (session.speaking) {
      this.logger.debug?.(`[discord-voice] Skipping processing - already speaking`);
      return;
    }

    // Skip if already processing another request (prevents duplicate responses)
    if (session.processing) {
      this.logger.debug?.(`[discord-voice] Skipping processing - already processing another request`);
      return;
    }

    // Cooldown after speaking to prevent echo/accidental triggers (500ms)
    const SPEAK_COOLDOWN_MS = 500;
    if (session.lastSpokeAt && (Date.now() - session.lastSpokeAt) < SPEAK_COOLDOWN_MS) {
      this.logger.debug?.(`[discord-voice] Skipping processing - in cooldown period after speaking`);
      return;
    }

    const audioBuffer = Buffer.concat(chunks);
    
    // Skip very short recordings (likely noise) - check BEFORE setting processing lock
    const durationMs = (audioBuffer.length / 2) / 48; // 16-bit samples at 48kHz
    if (durationMs < this.config.minAudioMs) {
      this.logger.debug?.(`[discord-voice] Skipping short recording (${Math.round(durationMs)}ms < ${this.config.minAudioMs}ms) for user ${userId}`);
      return;
    }

    // Calculate RMS amplitude to filter out quiet sounds (keystrokes, background noise)
    const rms = this.calculateRMS(audioBuffer);
    const minRMS = getRmsThreshold(this.config.vadSensitivity);
    if (rms < minRMS) {
      this.logger.debug?.(`[discord-voice] Skipping quiet audio (RMS ${Math.round(rms)} < ${minRMS}) for user ${userId}`);
      return;
    }

    // Set processing lock AFTER passing all filters
    session.processing = true;

    this.logger.info(`[discord-voice] Processing ${Math.round(durationMs)}ms of audio (RMS: ${Math.round(rms)}) from user ${userId}`);

    try {
      let transcribedText: string;

      // Check if we have streaming transcript available
      if (this.streamingSTT && this.config.sttProvider === "deepgram" && this.config.streamingSTT) {
        // Get accumulated transcript from streaming session
        transcribedText = this.streamingSTT.finalizeSession(userId);
        
        // Fallback to batch if streaming didn't capture anything
        if (!transcribedText || transcribedText.trim().length === 0) {
          this.logger.debug?.(`[discord-voice] Streaming empty, falling back to batch STT`);
          const sttResult = await this.sttProvider.transcribe(audioBuffer, 48000);
          transcribedText = sttResult.text;
        }
      } else {
        // Batch transcription
        const sttResult = await this.sttProvider.transcribe(audioBuffer, 48000);
        transcribedText = sttResult.text;
      }
      
      if (!transcribedText || transcribedText.trim().length === 0) {
        this.logger.debug?.(`[discord-voice] Empty transcription for user ${userId}`);
        session.processing = false;
        return;
      }

      this.logger.info(`[discord-voice] Transcribed: "${transcribedText}"`);

      // Play looping thinking sound while processing
      const stopThinking = await this.startThinkingLoop(session);

      let response: string;
      try {
        // Get response from agent
        response = await this.onTranscript(userId, session.guildId, session.channelId, transcribedText);
      } finally {
        // Always stop thinking sound, even on error
        stopThinking();
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!response || response.trim().length === 0) {
        session.processing = false;
        return;
      }

      // Ensure main player is subscribed before speaking
      session.connection.subscribe(session.player);
      
      // Synthesize and play response
      await this.speak(session.guildId, response);
    } catch (error) {
      this.logger.error(`[discord-voice] Error processing audio: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      session.processing = false;
    }
  }

  /**
   * Speak text in the voice channel
   * If chunked mode is enabled (default), splits response into sentences
   * and starts TTS on the first sentence immediately for lower perceived latency.
   */
  async speak(guildId: string, text: string, options: { chunked?: boolean } = {}): Promise<void> {
    const session = this.sessions.get(guildId);
    if (!session) {
      throw new Error("Not connected to voice channel");
    }

    this.ensureProviders();

    if (!this.streamingTTS && !this.ttsProvider) {
      throw new Error("TTS provider not initialized");
    }

    // Default to chunked mode for better perceived latency
    const useChunked = options.chunked ?? this.config.responseChunking ?? true;
    
    if (useChunked) {
      return this.speakChunked(session, text);
    }
    
    return this.speakSingle(session, text);
  }

  /**
   * Speak text using sentence chunking for lower perceived latency.
   * Splits the response into sentences and plays them sequentially,
   * starting TTS on the first sentence immediately.
   */
  private async speakChunked(session: VoiceSession, text: string): Promise<void> {
    // Split into sentence chunks
    const rawChunks = chunkBySentence(text);
    // Merge very short chunks for better flow
    const chunks = mergeShortChunks(rawChunks, 30);
    
    if (chunks.length === 0) {
      return;
    }
    
    // If only one chunk or very short text, just use single mode
    if (chunks.length === 1 || text.length < 50) {
      return this.speakSingle(session, text);
    }
    
    this.logger.info(`[discord-voice] Speaking ${chunks.length} chunks: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`);
    this.logger.debug?.(`[discord-voice] Chunks: ${JSON.stringify(chunks)}`);

    session.speaking = true;
    session.startedSpeakingAt = Date.now();

    try {
      // Play chunks sequentially
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        // Check for barge-in between chunks
        if (!session.speaking) {
          this.logger.info(`[discord-voice] Barge-in detected between chunks, stopping`);
          break;
        }
        
        this.logger.debug?.(`[discord-voice] Playing chunk ${i + 1}/${chunks.length}: "${chunk.substring(0, 40)}..."`);
        
        await this.speakSingleChunk(session, chunk);
      }
    } finally {
      session.speaking = false;
      session.lastSpokeAt = Date.now();
    }
  }

  /**
   * Speak a single chunk of text (internal helper for chunked mode)
   */
  private async speakSingleChunk(session: VoiceSession, text: string): Promise<void> {
    let resource;

    // Try streaming TTS first (lower latency)
    if (this.streamingTTS) {
      try {
        const streamResult = await this.streamingTTS.synthesizeStream(text);
        
        if (streamResult.format === "opus") {
          resource = createAudioResource(streamResult.stream, {
            inputType: StreamType.OggOpus,
          });
        } else {
          resource = createAudioResource(streamResult.stream);
        }
      } catch (streamError) {
        this.logger.warn(`[discord-voice] Streaming TTS failed for chunk, falling back: ${streamError instanceof Error ? streamError.message : String(streamError)}`);
      }
    }

    // Fallback to buffered TTS
    if (!resource && this.ttsProvider) {
      const ttsResult = await this.ttsProvider.synthesize(text);
      
      if (ttsResult.format === "opus") {
        resource = createAudioResource(Readable.from(ttsResult.audioBuffer), {
          inputType: StreamType.OggOpus,
        });
      } else {
        resource = createAudioResource(Readable.from(ttsResult.audioBuffer));
      }
    }

    if (!resource) {
      throw new Error("Failed to create audio resource for chunk");
    }

    session.player.play(resource);

    // Wait for this chunk to finish
    await new Promise<void>((resolve) => {
      const onIdle = () => {
        session.player.off(AudioPlayerStatus.Idle, onIdle);
        session.player.off("error", onError);
        resolve();
      };
      
      const onError = (error: Error) => {
        this.logger.error(`[discord-voice] Chunk playback error: ${error.message}`);
        session.player.off(AudioPlayerStatus.Idle, onIdle);
        session.player.off("error", onError);
        resolve();
      };

      session.player.on(AudioPlayerStatus.Idle, onIdle);
      session.player.on("error", onError);
    });
  }

  /**
   * Speak text as a single unit (original behavior)
   */
  private async speakSingle(session: VoiceSession, text: string): Promise<void> {
    session.speaking = true;
    session.startedSpeakingAt = Date.now();

    try {
      this.logger.info(`[discord-voice] Speaking (single): "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`);
      
      let resource;

      // Try streaming TTS first (lower latency)
      if (this.streamingTTS) {
        try {
          const streamResult = await this.streamingTTS.synthesizeStream(text);
          
          // Create audio resource from stream
          if (streamResult.format === "opus") {
            resource = createAudioResource(streamResult.stream, {
              inputType: StreamType.OggOpus,
            });
          } else {
            // For mp3, the audio player will transcode
            resource = createAudioResource(streamResult.stream);
          }
          
          this.logger.debug?.(`[discord-voice] Using streaming TTS`);
        } catch (streamError) {
          this.logger.warn(`[discord-voice] Streaming TTS failed, falling back to buffered: ${streamError instanceof Error ? streamError.message : String(streamError)}`);
          // Fall through to buffered TTS
        }
      }

      // Fallback to buffered TTS
      if (!resource && this.ttsProvider) {
        const ttsResult = await this.ttsProvider.synthesize(text);
        
        if (ttsResult.format === "opus") {
          resource = createAudioResource(Readable.from(ttsResult.audioBuffer), {
            inputType: StreamType.OggOpus,
          });
        } else {
          resource = createAudioResource(Readable.from(ttsResult.audioBuffer));
        }
        
        this.logger.debug?.(`[discord-voice] Using buffered TTS`);
      }

      if (!resource) {
        throw new Error("Failed to create audio resource");
      }

      session.player.play(resource);

      // Wait for playback to finish
      await new Promise<void>((resolve) => {
        const onIdle = () => {
          session.speaking = false;
          session.lastSpokeAt = Date.now(); // Set cooldown timestamp
          session.player.off(AudioPlayerStatus.Idle, onIdle);
          session.player.off("error", onError);
          resolve();
        };
        
        const onError = (error: Error) => {
          this.logger.error(`[discord-voice] Playback error: ${error.message}`);
          session.speaking = false;
          session.lastSpokeAt = Date.now(); // Set cooldown timestamp
          session.player.off(AudioPlayerStatus.Idle, onIdle);
          session.player.off("error", onError);
          resolve();
        };

        session.player.on(AudioPlayerStatus.Idle, onIdle);
        session.player.on("error", onError);
      });
    } catch (error) {
      session.speaking = false;
      session.lastSpokeAt = Date.now(); // Set cooldown timestamp
      throw error;
    }
  }

  /**
   * Start looping thinking sound, returns stop function
   */
  private async startThinkingLoop(session: VoiceSession): Promise<() => void> {
    let stopped = false;
    
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const { fileURLToPath } = await import("node:url");
      
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const thinkingPath = path.join(__dirname, "..", "assets", "thinking.mp3");
      
      if (!fs.existsSync(thinkingPath)) {
        return () => {};
      }

      const audioData = fs.readFileSync(thinkingPath);
      
      // Create separate player for thinking sound
      const thinkingPlayer = createAudioPlayer();
      session.thinkingPlayer = thinkingPlayer;
      session.connection.subscribe(thinkingPlayer);

      const playLoop = () => {
        if (stopped || !thinkingPlayer) return;
        const resource = createAudioResource(Readable.from(Buffer.from(audioData)), {
          inlineVolume: true,
        });
        resource.volume?.setVolume(0.7);
        thinkingPlayer.play(resource);
      };

      thinkingPlayer.on(AudioPlayerStatus.Idle, playLoop);
      playLoop(); // Start first play

      return () => {
        stopped = true;
        if (thinkingPlayer) {
          thinkingPlayer.removeAllListeners();
          thinkingPlayer.stop(true);
        }
        session.thinkingPlayer = undefined;
        // Re-subscribe main player immediately
        session.connection.subscribe(session.player);
      };
    } catch (error) {
      this.logger.debug?.(`[discord-voice] Error starting thinking loop: ${error instanceof Error ? error.message : String(error)}`);
      return () => {
        session.thinkingPlayer = undefined;
        session.connection.subscribe(session.player);
      };
    }
  }

  /**
   * Play thinking sound once (simple version - uses main player, no loop)
   */
  private async playThinkingSoundSimple(session: VoiceSession): Promise<void> {
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const { fileURLToPath } = await import("node:url");
      
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const thinkingPath = path.join(__dirname, "..", "assets", "thinking.mp3");
      
      if (!fs.existsSync(thinkingPath)) {
        return;
      }

      const audioBuffer = fs.readFileSync(thinkingPath);
      const resource = createAudioResource(Readable.from(audioBuffer), {
        inlineVolume: true,
      });
      resource.volume?.setVolume(0.5);
      
      session.player.play(resource);
      
      // Don't wait for it to finish - let it play while processing
      // The response TTS will interrupt it naturally
    } catch (error) {
      this.logger.debug?.(`[discord-voice] Error playing thinking sound: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Calculate RMS (Root Mean Square) amplitude of audio buffer
   * Used to filter out quiet sounds like keystrokes and background noise
   */
  private calculateRMS(audioBuffer: Buffer): number {
    // Audio is 16-bit signed PCM
    const samples = audioBuffer.length / 2;
    if (samples === 0) return 0;

    let sumSquares = 0;
    for (let i = 0; i < audioBuffer.length; i += 2) {
      const sample = audioBuffer.readInt16LE(i);
      sumSquares += sample * sample;
    }

    return Math.sqrt(sumSquares / samples);
  }

  /**
   * Check if a user is allowed to use voice
   */
  private isUserAllowed(userId: string): boolean {
    if (this.config.allowedUsers.length === 0) {
      return true;
    }
    return this.config.allowedUsers.includes(userId);
  }

  /**
   * Get session for a guild
   */
  getSession(guildId: string): VoiceSession | undefined {
    return this.sessions.get(guildId);
  }

  /**
   * Get all active sessions
   */
  getAllSessions(): VoiceSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Destroy all connections
   */
  async destroy(): Promise<void> {
    // Close streaming STT
    if (this.streamingSTT) {
      this.streamingSTT.closeAll();
    }

    const guildIds = Array.from(this.sessions.keys());
    for (const guildId of guildIds) {
      await this.leave(guildId);
    }
  }
}
