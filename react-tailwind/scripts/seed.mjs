#!/usr/bin/env node
/**
 * seed (React variant) — starter data for the current app.
 *
 * Writes src/seedData.ts + a test using src/lib/seed.ts makeSeed. Never
 * overwrites existing files — you fill the factory with your real fields.
 *
 * Usage: node scripts/seed.mjs [count]
 */
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const count = Number(process.argv[2] ?? 8);

const seedPath = join(ROOT, 'src/seedData.ts');
const testPath = join(ROOT, 'src/tests/seedData.test.ts');

if (!existsSync(seedPath)) {
  writeFileSync(seedPath, `// Starter data for this app. Fill the factory with your real fields.
// The record shape here MUST match the type guard exported from src/store.ts.
import { makeSeed } from './lib/seed';

export interface SeedItem {
  id: string;
  createdAt: number;
  // TODO: add the fields your Item type needs
}

export function isSeedItem(v: unknown): v is SeedItem {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.createdAt === 'number';
}

export function seedItems(count: number = ${count}): SeedItem[] {
  return makeSeed<SeedItem>(count, (i) => ({
    // TODO: e.g. name: NAMES[i % NAMES.length], amount: (i + 1) * 10,
    ...(i === 0 ? {} : {}),
  }));
}
`);
  console.log(`  [seed] ✅ src/seedData.ts written (${count} records).`);
}

if (!existsSync(testPath)) {
  writeFileSync(testPath, `// Seed data test — every record validates against its own guard.
import { describe, it, expect } from 'vitest';
import { seedItems, isSeedItem } from '../seedData';

describe('seed data', () => {
  it('generates the requested count with unique ids', () => {
    const items = seedItems(6);
    expect(items).toHaveLength(6);
    expect(new Set(items.map((i) => i.id)).size).toBe(6);
  });

  it('every record passes its own type guard', () => {
    for (const item of seedItems(10)) expect(isSeedItem(item)).toBe(true);
  });
});
`);
  console.log('  [seed] ✅ src/tests/seedData.test.ts written.');
}

console.log('\n  [seed] Next:');
console.log('      1. Fill src/seedData.ts factory with your real fields');
console.log('      2. Mirror the fields into the type guard in src/store.ts');
console.log('      3. Seed on first run: if (items.length === 0) setItems(seedItems())');