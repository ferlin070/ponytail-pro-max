#!/usr/bin/env node
/**
 * brief — brief to scaffold in one command.
 *
 * Writes PRD.md (requirements checklist), DESIGN.md (picked from designs/ by
 * keyword), and domain stubs (types/schema/storage + a test plan). If the repo
 * isn't scaffolded yet it also runs init.mjs (fresh CRUD shell, package name,
 * .ponytail-ready). Never overwrites files you already wrote.
 *
 * Usage: node scripts/brief.mjs "<your brief>" [design-name]
 * Example: node scripts/brief.mjs "Expense tracker in Malay with CSV export" fintech
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const raw = process.argv[2] ?? '';
const designArg = process.argv[3] ?? '';
const name = process.env.npm_package_name ?? 'my-app';

if (!raw.trim()) {
  console.error('  [brief] Usage: npm run brief "your brief text" [design-name]');
  console.error('  [brief] Example: npm run brief "Expense tracker in Malay with CSV export" fintech');
  process.exit(1);
}

// ---- pick a design blueprint by keyword ----
const DESIGNS = {
  fintech: 'fintech.md', dashboard: 'dashboard.md', ecommerce: 'ecommerce.md',
  mobile: 'mobile-first.md', minimal: 'minimal.md',
};
function pickDesign(text) {
  const lower = text.toLowerCase();
  if (/(money|expense|budget|wallet|finance|bank|invest|pay|currency|cost)/.test(lower)) return DESIGNS.fintech;
  if (/(dashboard|admin|analytics|stat|chart|report|metric|monitor|table)/.test(lower)) return DESIGNS.dashboard;
  if (/(store|shop|ecommerce|product|cart|order|catalog|checkout|inventory)/.test(lower)) return DESIGNS.ecommerce;
  if (/(app|mobile|ios|android|touch|swipe|phone|thumb)/.test(lower)) return DESIGNS.mobile;
  return DESIGNS.minimal;
}
const designFile = designArg ? (DESIGNS[designArg] ?? designArg) : pickDesign(raw);
const designSrc = join(ROOT, 'designs', designFile.endsWith('.md') ? designFile : designFile + '.md');

// ---- scaffold the shell first if needed ----
if (!existsSync(join(ROOT, '.ponytail-ready'))) {
  const r = spawnSync('node', ['scripts/init.mjs', name], { stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) process.exit(1);
}

// ---- PRD.md ----
const sentences = raw.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
const feature = (kw) => (new RegExp(kw, 'i').test(raw));
const features = [
  ['auth / login', 'auth|login|sign|account'],
  ['search', 'search|filter|find'],
  ['export', 'export|csv|json|pdf'],
  ['theming', 'theme|dark|light'],
  ['notifications', 'notif|alert|remind'],
  ['sharing', 'share|link|social'],
].filter(([label, kw]) => feature(kw)).map(([label]) => label);

const prd = `# PRD — ${name}

## Brief
${raw}

## Requirements checklist
${sentences.map((s) => `- [ ] ${s}`).join('\n') || '- [ ] (tulis semula keperluan dari brief sebagai item boleh semak)'}

## Detected feature candidates
${features.length ? features.map((f) => `- [ ] ${f}`).join('\n') : '- (tiada ciri jelas dikesan — senarai dari brief)'}

## Non-negotiables (from AGENTS.md)
- [ ] Landmark regions: header/main/section with aria-label
- [ ] Every input has a label (for= or aria-label)
- [ ] Modal focus trap + restore; Escape closes
- [ ] .sr-only for hidden text; prefers-reduced-motion collapses animation
- [ ] Error handling: persistent role="alert" banner, never swallow
- [ ] Storage: error-safe createStore; validate every record on load
- [ ] escapeHtml before innerHTML
- [ ] Seed data present (src/lib/seed.ts → makeSeed)
- [ ] Domain logic pure + unit-tested
- [ ] Empty state + loading state

## Before you submit
- [ ] npm run typecheck && npm test && npm run build
- [ ] npm run size under cap (pass your cap: npm run size -- 40)
- [ ] npm run audit (self-score)
- [ ] axe scan: npm run test:a11y:scan — 0 violations
`;

writeFileSync(join(ROOT, 'PRD.md'), prd);

// ---- DESIGN.md (never overwrite) ----
if (!existsSync(join(ROOT, 'DESIGN.md'))) {
  if (existsSync(designSrc)) {
    writeFileSync(join(ROOT, 'DESIGN.md'), readFileSync(designSrc, 'utf8'));
    console.log(`  [brief] ✅ DESIGN.md written (from designs/${designFile}).`);
  } else {
    console.log(`  [brief] ⚠️ design file not found (${designFile}); DESIGN.md skipped.`);
  }
}

// ---- domain stubs (never overwrite) ----
mkdirSync(join(ROOT, 'src'), { recursive: true });
const stub = (file, body) => {
  const p = join(ROOT, 'src', file);
  if (!existsSync(p)) { writeFileSync(p, body); return true; }
  return false;
};
const wroteTypes = stub('types.ts', `// Domain types — edit for this app. Brief: ${raw}\nexport interface Item {\n  id: string;\n  createdAt: number;\n  // TODO: add your fields\n}\n`);
const wroteSchema = stub('schema.ts', `// Pure domain logic: validation, stats, formatting. Side-effect free + unit-tested.\n// Brief: ${raw}\n`);
const wroteStorage = stub('storage.ts', `// Persistence: createStore from ./lib/storage + your type guard.\n`);
const wroteTest = stub('tests/schema.test.ts', `// Test plan for domain logic. Example:\n// describe('validate', () => { it('rejects invalid input', ...) })\n`);

console.log(`  [brief] ✅ PRD.md written (${sentences.length} requirement lines).`);
for (const [f, did] of [['src/types.ts', wroteTypes], ['src/schema.ts', wroteSchema], ['src/storage.ts', wroteStorage], ['src/tests/schema.test.ts', wroteTest]]) {
  console.log(`  [brief] ${did ? '✅' : '⏭  keep'} ${f}`);
}

console.log('\n  [brief] Next:');
console.log('      1. Edit src/types.ts + src/schema.ts (domain model + logic)');
console.log('      2. Wire createStore in src/storage.ts');
console.log('      3. Fill src/main.ts render()/events to the checklist');
console.log('      4. npm run seed   (seed data via makeSeed)');
console.log('      5. npm run audit  (self-score)  →  npm run verify  →  push');