#!/usr/bin/env bun
/**
 * Session Index Repair Script
 *
 * This script repairs the sessions.json index by:
 * 1. Adding sessionFile paths to entries that are missing them
 * 2. Creating entries for orphaned session files (files on disk not in index)
 * 3. Fixing legacy directory paths
 *
 * Run with: pnpm exec tsx scripts/repair-sessions-index.ts
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import readline from "node:readline";

const LEGACY_DIR_PATTERNS = [
  /\/\.clawdbot\//g,
  /\/\.moltbot\//g,
  /\/\.moldbot\//g,
];
const CANONICAL_DIR = "/.openclaw/";

interface SessionEntry {
  sessionId?: string;
  sessionFile?: string;
  updatedAt?: number;
  chatType?: string;
  origin?: {
    label?: string;
    provider?: string;
    surface?: string;
    chatType?: string;
  };
  [key: string]: unknown;
}

type SessionStore = Record<string, SessionEntry>;

function getSessionsDir(): string {
  const stateDir = path.join(os.homedir(), ".openclaw");
  return path.join(stateDir, "agents", "main", "sessions");
}

function canonicalizePath(filePath: string): string {
  let result = filePath;
  for (const pattern of LEGACY_DIR_PATTERNS) {
    result = result.replace(pattern, CANONICAL_DIR);
  }
  return result;
}

async function extractSessionMetadata(filePath: string): Promise<{
  firstTimestamp?: number;
  lastTimestamp?: number;
  chatType?: string;
  origin?: SessionEntry["origin"];
  messageCount: number;
}> {
  const result: ReturnType<typeof extractSessionMetadata> extends Promise<infer T> ? T : never = {
    messageCount: 0,
  };

  try {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineCount = 0;
    let firstLine: string | undefined;
    let lastLine: string | undefined;

    for await (const line of rl) {
      if (!line.trim()) continue;
      lineCount++;
      if (!firstLine) firstLine = line;
      lastLine = line;
    }

    result.messageCount = lineCount;

    if (firstLine) {
      try {
        const first = JSON.parse(firstLine);
        if (first.timestamp) {
          result.firstTimestamp = new Date(first.timestamp).getTime();
        }
      } catch {}
    }

    if (lastLine) {
      try {
        const last = JSON.parse(lastLine);
        if (last.timestamp) {
          result.lastTimestamp = new Date(last.timestamp).getTime();
        }
      } catch {}
    }
  } catch (err) {
    console.error(`  Warning: Could not read ${path.basename(filePath)}: ${err}`);
  }

  return result;
}

async function repair() {
  const sessionsDir = getSessionsDir();
  const storePath = path.join(sessionsDir, "sessions.json");
  const backupPath = storePath.replace(".json", ".json.pre-repair-" + Date.now());

  if (!fs.existsSync(storePath)) {
    console.log("No sessions.json found at", storePath);
    return;
  }

  // Read current store
  const rawData = fs.readFileSync(storePath, "utf-8");
  const store: SessionStore = JSON.parse(rawData);

  // Create backup
  fs.writeFileSync(backupPath, rawData, "utf-8");
  console.log(`✓ Created backup at ${backupPath}\n`);

  // Get all session files on disk
  const sessionFiles = fs.readdirSync(sessionsDir)
    .filter(f => f.endsWith(".jsonl") && !f.includes("deleted") && f !== "sessions.json");

  console.log(`Found ${sessionFiles.length} session files on disk`);
  console.log(`Found ${Object.keys(store).length} entries in sessions.json\n`);

  // Build sessionId -> key map from existing store
  const sessionIdToKey = new Map<string, string>();
  const sessionIdToEntry = new Map<string, SessionEntry>();
  for (const [key, entry] of Object.entries(store)) {
    if (entry.sessionId) {
      sessionIdToKey.set(entry.sessionId, key);
      sessionIdToEntry.set(entry.sessionId, entry);
    }
  }

  let fixedPaths = 0;
  let addedOrphans = 0;
  let errors = 0;

  // Phase 1: Fix existing entries with missing or legacy sessionFile paths
  console.log("Phase 1: Fixing existing entries...");
  for (const [key, entry] of Object.entries(store)) {
    if (!entry.sessionId) continue;

    const expectedFile = path.join(sessionsDir, `${entry.sessionId}.jsonl`);
    const expectedPath = expectedFile;

    // Check if sessionFile is missing or has legacy path
    if (!entry.sessionFile) {
      if (fs.existsSync(expectedFile)) {
        entry.sessionFile = expectedPath;
        fixedPaths++;
        console.log(`  Added sessionFile for: ${key.slice(0, 50)}...`);
      }
    } else {
      // Fix legacy paths
      const canonicalized = canonicalizePath(entry.sessionFile);
      if (canonicalized !== entry.sessionFile) {
        entry.sessionFile = canonicalized;
        fixedPaths++;
        console.log(`  Fixed legacy path for: ${key.slice(0, 50)}...`);
      }
    }
  }

  // Phase 2: Find orphaned session files (on disk but not indexed)
  console.log("\nPhase 2: Finding orphaned session files...");
  const indexedSessionIds = new Set(sessionIdToKey.keys());

  for (const filename of sessionFiles) {
    const sessionId = filename.replace(".jsonl", "");

    if (indexedSessionIds.has(sessionId)) {
      // Already indexed, but check if entry has sessionFile
      const key = sessionIdToKey.get(sessionId)!;
      const entry = store[key];
      if (entry && !entry.sessionFile) {
        entry.sessionFile = path.join(sessionsDir, filename);
        fixedPaths++;
      }
      continue;
    }

    // Orphaned file - create new entry
    const filePath = path.join(sessionsDir, filename);
    console.log(`  Processing orphan: ${sessionId}`);

    try {
      const metadata = await extractSessionMetadata(filePath);

      if (metadata.messageCount === 0) {
        console.log(`    Skipping empty session: ${sessionId}`);
        continue;
      }

      // Create a new entry
      const newKey = `agent:main:orphan:${sessionId.slice(0, 8)}`;
      const now = Date.now();

      store[newKey] = {
        sessionId,
        sessionFile: filePath,
        updatedAt: metadata.lastTimestamp ?? now,
        chatType: "direct",
        origin: {
          label: `Recovered session (${new Date(metadata.firstTimestamp ?? now).toLocaleDateString()})`,
          provider: "unknown",
          surface: "unknown",
          chatType: "direct",
        },
      };

      addedOrphans++;
      console.log(`    Added as: ${newKey}`);
    } catch (err) {
      console.error(`    Error processing ${sessionId}: ${err}`);
      errors++;
    }
  }

  // Save updated store
  if (fixedPaths > 0 || addedOrphans > 0) {
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf-8");
    console.log(`\n✓ Saved updated sessions.json`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("Summary:");
  console.log(`  Fixed sessionFile paths: ${fixedPaths}`);
  console.log(`  Recovered orphan sessions: ${addedOrphans}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Total entries now: ${Object.keys(store).length}`);

  if (addedOrphans > 0) {
    console.log("\nNote: Orphaned sessions were recovered with 'orphan:' prefix.");
    console.log("You may want to label or delete them from the dashboard.");
  }

  console.log("\n⚠️  Restart the gateway for changes to take effect:");
  console.log("   systemctl --user restart openclaw-gateway");
}

repair().catch(console.error);
