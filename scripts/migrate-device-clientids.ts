#!/usr/bin/env bun
/**
 * One-time migration script: Updates paired device clientIds from
 * legacy names (moltbot-control-ui) to new names (openclaw-control-ui).
 *
 * Run with: bun scripts/migrate-device-clientids.ts
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const LEGACY_CLIENT_ID_MAP: Record<string, string> = {
  "moltbot-control-ui": "openclaw-control-ui",
  "clawdbot-control-ui": "openclaw-control-ui",
};

interface PairedDevice {
  deviceId: string;
  clientId: string;
  [key: string]: unknown;
}

type PairedDevices = Record<string, PairedDevice>;

function getOpenClawDir(): string {
  return path.join(os.homedir(), ".openclaw");
}

function migrate() {
  const openclawDir = getOpenClawDir();
  const pairedPath = path.join(openclawDir, "devices", "paired.json");
  const backupPath = path.join(openclawDir, "devices", "paired.json.pre-migration");

  if (!fs.existsSync(pairedPath)) {
    console.log("No paired.json found at", pairedPath);
    return;
  }

  // Read current data
  const rawData = fs.readFileSync(pairedPath, "utf-8");
  const devices: PairedDevices = JSON.parse(rawData);

  // Create backup
  fs.writeFileSync(backupPath, rawData, "utf-8");
  console.log(`✓ Created backup at ${backupPath}`);

  // Track changes
  let updatedCount = 0;
  const changes: { deviceId: string; platform: string; from: string; to: string }[] = [];

  // Update legacy clientIds
  for (const [key, device] of Object.entries(devices)) {
    const oldClientId = device.clientId;
    const newClientId = LEGACY_CLIENT_ID_MAP[oldClientId];

    if (newClientId) {
      device.clientId = newClientId;
      updatedCount++;
      changes.push({
        deviceId: device.deviceId.slice(0, 12) + "...",
        platform: String(device.platform ?? "unknown"),
        from: oldClientId,
        to: newClientId,
      });
    }
  }

  if (updatedCount === 0) {
    console.log("✓ No devices needed migration - all clientIds are already current");
    return;
  }

  // Write updated data
  fs.writeFileSync(pairedPath, JSON.stringify(devices, null, 2), "utf-8");

  console.log(`\n✓ Migrated ${updatedCount} device(s):\n`);
  console.log("  Device ID       | Platform        | Old → New");
  console.log("  ----------------|-----------------|----------------------------------");
  for (const c of changes) {
    console.log(`  ${c.deviceId.padEnd(14)} | ${c.platform.padEnd(15)} | ${c.from} → ${c.to}`);
  }

  console.log(`\n✓ Updated ${pairedPath}`);
  console.log("\nNote: Restart the gateway for changes to take effect.");
}

migrate();
