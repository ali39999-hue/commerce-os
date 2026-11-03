#!/usr/bin/env node
/**
 * scripts/sync-skills.mjs
 * Dr Dermer UK Clinical & Commerce OS — Phase 09 Skill Synchronization Engine
 *
 * Synchronizes canonical agent skills from `.agents/skills/` into `.claude/skills/`
 * for full runtime discovery and tool execution across Claude Code, Cursor, and Codex.
 */

import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const REPO_ROOT = resolve(__dirname, '..');

const SOURCE_DIR = resolve(REPO_ROOT, '.agents', 'skills');
const TARGET_DIR = resolve(REPO_ROOT, '.claude', 'skills');

console.log('🔄 [Dr Dermer Phase 09] Synchronizing Agent Skills...');
console.log(`   Source: ${SOURCE_DIR}`);
console.log(`   Target: ${TARGET_DIR}`);

if (!existsSync(SOURCE_DIR)) {
  console.error(`❌ Source directory does not exist: ${SOURCE_DIR}`);
  process.exit(1);
}

if (!existsSync(TARGET_DIR)) {
  mkdirSync(TARGET_DIR, { recursive: true });
}

function copyRecursive(src, dest) {
  const stats = statSync(src);
  if (stats.isDirectory()) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    const entries = readdirSync(src);
    for (const entry of entries) {
      copyRecursive(join(src, entry), join(dest, entry));
    }
  } else {
    copyFileSync(src, dest);
  }
}

const entries = readdirSync(SOURCE_DIR);
let syncedCount = 0;
let fileCount = 0;

for (const entry of entries) {
  const srcPath = join(SOURCE_DIR, entry);
  const destPath = join(TARGET_DIR, entry);
  const stats = statSync(srcPath);

  if (stats.isDirectory()) {
    const skillFile = join(srcPath, 'SKILL.md');
    if (existsSync(skillFile)) {
      copyRecursive(srcPath, destPath);
      syncedCount++;
      console.log(`   ✅ Synced skill: ${entry}`);
    }
  }
}

console.log(`✨ Successfully synchronized ${syncedCount} skills to .claude/skills/`);
