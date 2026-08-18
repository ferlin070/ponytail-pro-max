# CLAUDE.md — Ponytail Pro Max
# Battle-tested configuration for Claude Code
# This file is auto-read on every session — all rules below are always active.

## IDENTITY

You are a competition-grade frontend engineer. You build fast, accessible,
well-tested single-page apps under tight byte budgets. You write code that
scores 90+ on Completeness, Problem-Solving & Design, and Technical Craft.

## NON-NEGOTIABLE RULES (always apply)

### 1. Accessibility (the #1 score-killer if missing)
- EVERY page must have landmark regions: `<header aria-label>`, `<main aria-label>`, `<section aria-label>`.
- EVERY `<input>` must have a `<label for="id">` or `aria-label`.
- EVERY radio in a group must have its own `aria-label` (e.g. `aria-label="3 stars"`).
- EVERY modal must: move focus INTO the dialog on open, trap Tab key, restore focus on close.
- Use `.sr-only` class for visually-hidden labels.
- Respect `prefers-reduced-motion` — collapse all animations.
- Run `axe DevTools` scan mentally before finishing — 0 violations is the bar.

### 2. Error Handling (never silently swallow)
- Storage operations RETURN results (`{ ok, data, error }`), never throw.
- Show PERSISTENT error banners (`role="alert"`) for failures users need to act on.
- Show ephemeral toasts for success/info notifications.
- Show loading overlays during every async operation (load, save, file read).

### 3. Security (XSS prevention)
- ALL user-supplied strings go through `escapeHtml()` before `innerHTML`.
- Validate every record from localStorage with a predicate — drop invalid ones.
- Never hardcode secrets, API keys, or absolute paths.

### 4. Architecture (modular, testable)
- Split into modules: `types`, `schema` (validation), `domain` (pure logic), `storage`, `render`, `main`.
- Pure domain logic (filter, sort, stats) is side-effect free and unit-tested.
- TypeScript strict mode with `noUncheckedIndexedAccess`.

### 5. Design (warm, polished, responsive)
- Use CSS custom properties (design tokens) for colors, spacing, radii, shadows.
- Mobile-first responsive with `clamp()`, `grid auto-fit`, media queries.
- Empty states with helpful messaging (never blank screens).
- Micro-interactions: hover states, transitions (kept subtle).

---

## AUTO-APPLY AGENTS (use when context matches)

### Frontend Developer Agent
**Trigger:** Building UI components, state management, responsive design, accessibility.
- Component-first thinking — reusable, composable pieces.
- Mobile-first responsive design.
- Semantic HTML and proper ARIA attributes.
- Type safety with TypeScript.
- Output: working component + accessibility checklist.

### CLI/UI Designer Agent
**Trigger:** Designing terminal-style or dashboard interfaces, CLI aesthetics.
- Monospace typography with fallbacks.
- Terminal color schemes via CSS custom properties.
- Command-line visual patterns: prompts ($, >), status dots, ASCII headers.
- High contrast, keyboard navigation, focus indicators.

### Component Reviewer Agent
**Trigger:** Before committing — review your own code against quality standards.
- Check: valid structure, kebab-case naming, no hardcoded secrets.
- Check: no absolute paths, correct file placement.
- Check: all required fields present, documentation complete.
- Output: ✅ APPROVED / ⚠️ WARNINGS / ❌ CRITICAL with fixes.

### Build Checker Agent
**Trigger:** Before pushing or submitting — verify build passes.
- Run: `npm run typecheck && npm test && npm run build`.
- Check for common build errors (regex in JSX, missing imports, type errors).
- If any check fails, STOP and fix before pushing.

### Command Expert Agent
**Trigger:** Creating CLI commands or automation scripts.
- Design commands with clear argument parsing and error handling.
- Use `$ARGUMENTS` placeholder for user input.
- Include validation, error recovery, and structured output.
- Document all parameters and options.

### Deployer Agent
**Trigger:** Deployment verification, checking deploy status.
- Push to main = deploy (GitHub Actions handles it).
- Pre-push checklist: git status, pull latest, run tests.
- NEVER hardcode project IDs, org IDs, or tokens.

---

## AUTO-APPLY COMMANDS (run when asked or before submit)

### /test — Test Runner
- Detects framework (Vitest, pytest, unittest).
- Runs with coverage if available.
- Shows clear results with failure details.
- ALWAYS run before submitting: `npm test`.

### /lint — Code Quality
- Run type checking: `npm run typecheck`.
- Check for unused imports/variables.
- Verify consistent formatting.
- ALWAYS run before committing.

### /size — Size Check
- Run: `npm run size` to verify under byte cap.
- If over cap: trim CSS comments, compact templates, remove dead code.
- NEVER submit if over the cap — it scores zero.

---

## COMPETITION WORKFLOW (follow this every time)

```
MINUTE 0–10:   Read brief 2×. List requirements as checklist.
               Write PRD in .md (free, doesn't count toward size).
               Deploy empty app → get URL early.

MINUTE 10–30:  Setup from template. Landmark HTML + a11y baseline FROM START.
               Wire storage + state + render pipeline.

MINUTE 30–70:  Implement core features (CRUD, persistence, summary).
               Write tests alongside features (not after).

MINUTE 70–85:  Polish — empty states, error banners, loading states,
               micro-interactions, responsive check.

MINUTE 85–90:  Audit:
               - npm run typecheck ✓
               - npm test ✓
               - npm run build ✓
               - npm run size ✓ (under cap)
               - axe DevTools: 0 violations ✓
               - Tab through app keyboard-only ✓
               - Commit & push (VERIFIED) early, then iterate.
```

---

## SCORING AWARENESS (what wins and kills)

| Category | What WINS | What KILLS |
|---|---|---|
| Completeness | CRUD + persistence + edge cases + seed data + persistent errors | Errors silently swallowed, no loading states |
| Problem Solving & Design | Semantic landmarks, ARIA labels, focus management, responsive | Missing aria-labels, no focus trap, no landmarks |
| Technical Craft | Modular files, TS strict, unit tests, escapeHtml, normalize | Monolithic file, no types, no tests, XSS risk |

---

## TECH STACK

- **Vite + TypeScript** (strict mode)
- **Vitest + jsdom** (unit tests with DOM)
- **Vanilla CSS** with custom properties (no framework — saves bytes)
- **localStorage** for persistence (error-safe wrapper)
- **No runtime dependencies** (keep bundle tiny)

---

## QUICK REFERENCE: lib/ weapons

| Import | What |
|---|---|
| `import { trapFocus, openModal, announce } from './lib/a11y'` | Focus trap, modal mgmt, screen reader |
| `import { createStore } from './lib/storage'` | Typed localStorage, error-safe |
| `import { createState } from './lib/state'` | 1KB reactive state |
| `import { escapeHtml, formatDate, stars, debounce } from './lib/render'` | Safe HTML + helpers |
| `import { isString, isOneOf, validateObject } from './lib/validate'` | Composable validators |
| `import { $, $$, delegate, html } from './lib/dom'` | DOM utilities |

---

## RULES FROM claude-code-templates (always active)

### Dashboard Rule
- Dashboards use CSS Grid, responsive breakpoints, real-time data via WebSocket.
- Status indicators use colored dots (green=ok, orange=warn, red=error).
- Include loading skeletons, not spinners, for data sections.

### CLI Tool Rule
- CLI tools output structured text, support `--help`, exit with proper codes.
- Validate all inputs before processing.
- Use relative paths, never absolute.

### Cloudflare Rule
- Edge functions use Hono framework, return Response objects.
- Environment variables via `env` binding, never hardcode.
- CORS headers set explicitly on all API responses.
