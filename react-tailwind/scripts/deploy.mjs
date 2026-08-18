#!/usr/bin/env node
/**
 * deploy — get a public URL early (competition workflow: deploy empty → URL first).
 *
 * Builds the app, then deploys with whichever CLI is available:
 *   - Netlify  (netlify.toml provided) → `npx netlify-cli deploy --prod --dir=dist`
 *   - Vercel   (vercel.json provided)  → `npx vercel --prod`
 * If no CLI is installed, prints the drag-and-drop path instead.
 *
 * Usage: node scripts/deploy.mjs [netlify|vercel]
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const target = process.argv[2] ?? 'netlify';
const dist = 'dist';
// Windows resolves npm/npx as .cmd — shell:true makes spawnSync portable (Linux works either way).
const IS_WIN = process.platform === 'win32';
const shell = { stdio: 'inherit', shell: IS_WIN };

console.log(`  [deploy] Building production bundle...`);
const build = spawnSync('npm', ['run', 'build'], shell);
if (build.status !== 0) {
  console.error('  [deploy] ❌ build failed.');
  process.exit(1);
}

if (!existsSync(dist)) {
  console.error(`  [deploy] ❌ no ${dist}/ directory after build.`);
  process.exit(1);
}

if (target === 'netlify') {
  const r = spawnSync('npx', ['netlify-cli', 'deploy', '--prod', '--dir=' + dist], shell);
  if (r.status !== 0) {
    console.log('\n  [deploy] Netlify CLI not ready. Either:');
    console.log('      npx netlify-cli login');
    console.log('      npx netlify-cli deploy --prod --dir=' + dist);
    console.log('  Or drag the ' + dist + '/ folder onto https://app.netlify.com/drop\n');
  }
} else if (target === 'vercel') {
  const r = spawnSync('npx', ['vercel', '--prod'], shell);
  if (r.status !== 0) {
    console.log('\n  [deploy] Vercel CLI not ready. Run: npx vercel --prod\n');
  }
} else {
  console.error('  [deploy] Unknown target "' + target + '". Use netlify or vercel.');
  process.exit(1);
}