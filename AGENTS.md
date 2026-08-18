# AGENTS.md — Ponytail Pro Max
# Opencode auto-reads this file on every session in this project.
# All rules below are ALWAYS ACTIVE — they apply to every instruction you give.

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

## AUTO-APPLY RULES (use when context matches)

### When building UI / frontend
- Component-first thinking — reusable, composable pieces.
- Mobile-first responsive design with `clamp()`, `grid auto-fit`.
- Semantic HTML and proper ARIA attributes on EVERY element.
- Type safety with TypeScript strict mode.
- Output: working component + accessibility checklist.

### When designing terminal/dashboard UI
- Monospace typography with fallbacks.
- Terminal color schemes via CSS custom properties.
- Command-line visual patterns: prompts ($, >), status dots, ASCII headers.
- High contrast, keyboard navigation, focus indicators.

### Before committing — self-review
- Check: valid structure, no hardcoded secrets, no absolute paths.
- Check: all required fields present, documentation complete.
- Output: ✅ APPROVED / ⚠️ WARNINGS / ❌ CRITICAL with fixes.

### Before pushing — verify build
- Run: `npm run typecheck && npm test && npm run build`.
- Check for common build errors (regex in JSX, missing imports, type errors).
- If any check fails, STOP and fix before pushing.

### When creating CLI commands or automation
- Design commands with clear argument parsing and error handling.
- Include validation, error recovery, and structured output.
- Document all parameters and options.

### Before deploying
- Ensure changes are committed and pushed to main.
- Verify deploy status after push.
- NEVER hardcode project IDs, org IDs, or tokens.

---

## PRE-SUBMIT CHECKLIST (run when asked to "check" or "submit")

1. Run typecheck: `npm run typecheck`
2. Run tests: `npm test`
3. Run build: `npm run build`
4. Run size check: `npm run size`
5. Run accessibility audit (mental checklist below)
6. Check git status for uncommitted changes
7. Verify latest commit is pushed: `git log --oneline -3`

## ACCESSIBILITY AUDIT (run when asked to "check a11y" or "audit")

1. **Landmarks**: `<header aria-label>`, `<main aria-label>`, `<section aria-label>` present.
2. **Labels**: Every input/select/textarea has `<label for>` or `aria-label`.
3. **Radio groups**: Each radio has individual `aria-label` (e.g. "3 stars").
4. **Modal focus**: Focus moves into dialog on open, Tab trapped, restored on close.
5. **Live regions**: `aria-live="polite"` on toast container, `role="alert"` on errors.
6. **Keyboard**: Tab through entire app — all interactive elements reachable.
7. **Reduced motion**: `@media (prefers-reduced-motion: reduce)` collapses animations.
8. **Semantic HTML**: `<button>` not `<div onclick>`, `<nav>` not `<div class="nav">`.
9. **Hidden text**: `.sr-only` for screen-reader-only content.
10. **Color contrast**: 4.5:1 for normal text, 3:1 for large.

---

## SIZE GUARDIAN (auto-apply when committing or when size is mentioned)

1. Run `npm run size` to check total source bytes.
2. If under cap: report "✅ Under cap by N bytes."
3. If over cap: identify largest files and suggest specific trims:
   - Remove CSS comments and redundant whitespace.
   - Compact HTML template literals (remove indentation).
   - Shorten placeholder/descriptive text strings.
   - Remove dead code and unused imports.
4. NEVER suggest removing tests, accessibility attributes, or error handling.

## SIZE CAP REFERENCE

| Format | Rookie | Veteran | Elite | Legend |
|--------|--------|---------|-------|--------|
| Duel   | 25 KB  | 50 KB   | 70 KB | 90 KB  |
| Brawl  | 40 KB  | 90 KB   | 130KB | 160KB  |
| Squad  | 80 KB  | 150 KB  | 200KB | 260KB  |

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
