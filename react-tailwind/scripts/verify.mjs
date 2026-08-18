#!/usr/bin/env node
/**
 * Verify gate for the React variant.
 * Usage: node scripts/verify.mjs [limit-kb]   (npm run verify)
 */
import { execSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
// Windows resolves npm as npm.cmd — shell:true makes spawnSync portable.
const IS_WIN = process.platform === 'win32';

function run(cmd) {
  process.stdout.write(`\n> ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit', cwd: ROOT, shell: IS_WIN });
}

run('npm run typecheck');
run('npm test');
run('npm run build');

console.log('\n✓ React variant passed all gates.');