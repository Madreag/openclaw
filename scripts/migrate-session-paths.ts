#!/usr/bin/env bun
/**
 * One-time migration script: Updates sessionFile paths in sessions.json
 * from legacy directory names (.clawdbot, .moltbot) to the canonical (.openclaw).
 *
 * Run with: bun scripts/migrate-session-paths.ts
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const LEGACY_DIR_PATTERNS = [
  /\/\.clawdbot\//g,
  /\/\.moltbot\//g,
  /\/\.moldbot\//g,
];
const CANONICAL_DIR = "/.openclaw/";

interface SessionEntry {
  sessionFile?: string;
  [key: string]: unknown;
}

type SessionStore = Record<string, SessionEntry>;

function getSessionStorePath(): string {
  const stateDir = path.join(os.homedir(), ".openclaw");
  return path.join(stateDir, "agents", "main", "sessions", "sessions.json");
}

function migrate() {
  const storePath = getSessionStorePath();
  const backupPath = storePath.replace(".json", ".json.pre-path-migration");

  if (!fs.existsSync(storePath)) {
    console.log("No sessions.json found at", storePath);
    return;
  }

  // Read current data
  const rawData = fs.readFileSync(storePath, "utf-8");
  const store: SessionStore = JSON.parse(rawData);

  // Create backup
  fs.writeFileSync(backupPath, rawData, "utf-8");
  console.log(`✓ Created backup at ${backupPath}`);

  // Track changes
  let updatedCount = 0;
  const changes: { key: string; from: string; to: string }[] = [];

  // Update legacy paths
  for (const [key, entry] of Object.entries(store)) {
    if (!entry.sessionFile) {
      continue;
    }

    const oldPath = entry.sessionFile;
    let newPath = oldPath;

    for (const pattern of LEGACY_DIR_PATTERNS) {
      newPath = newPath.replace(pattern, CANONICAL_DIR);
    }

    if (newPath !== oldPath) {
      entry.sessionFile = newPath;
      updatedCount++;
      changes.push({
        key: key.length > 40 ? key.slice(0, 37) + "..." : key,
        from: oldPath.replace(os.homedir(), "~"),
        to: newPath.replace(os.homedir(), "~"),
      });
    }
  }

  if (updatedCount === 0) {
    console.log("✓ No session paths needed migration - all paths are already canonical");
    return;
  }

  // Write updated data
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf-8");

  console.log(`\n✓ Migrated ${updatedCount} session path(s):\n`);
  for (const c of changes) {
    console.log(`  ${c.key}`);
    console.log(`    ${c.from}`);
    console.log(`    → ${c.to}\n`);
  }

  console.log(`✓ Updated ${storePath}`);
  console.log("\nNote: Sessions should now be visible in the UI.");
}

migrate();
