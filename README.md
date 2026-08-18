# Ponytail Pro Max 🐴⚡

> Battle-tested starter template for code competitions.
> Accessibility, testing, error handling, modular architecture — built-in from line 1.

## What this gives you

Every time a competition brief lands, you waste 30+ minutes setting up:
TypeScript, Vitest, accessibility patterns, error handling, CSS tokens.
This template has all of that pre-wired. Clone it, build your app, ship.

## The 7 weapons

| File | What it does | Competition value |
|---|---|---|
| `lib/a11y.ts` | Focus trap, modal management, screen reader announcements | Fixes the #1 score-killer: missing accessibility |
| `lib/storage.ts` | Typed localStorage with error-safe load/save | "Errors silently swallowed" → never again |
| `lib/state.ts` | 1KB reactive state manager | State out of the DOM, testable |
| `lib/render.ts` | escapeHtml, formatDate, stars, debounce | XSS prevention + DRY helpers |
| `lib/validate.ts` | Composable validators (isString, isOneOf, validateObject) | Schema validation without a library |
| `lib/dom.ts` | $, $$, delegate, html builder | Less boilerplate, cleaner event wiring |
| `lib/style.css` | Design tokens, component primitives, a11y utilities | Consistent design, `.sr-only`, focus-visible |

## Quick start

```bash
# Clone into a new competition repo
npx degit your-username/ponytail-pro-max my-competition

cd my-competition
npm install
npm run dev       # start coding
```

## Scripts

| Command | What |
|---|---|
| `npm run dev` | Vite dev server |
| `npm test` | Unit tests (Vitest + jsdom) |
| `npm run test:a11y` | Accessibility tests (axe patterns) |
| `npm run typecheck` | Strict TypeScript check |
| `npm run build` | Type-check + production build |
| `npm run size` | Check if source is under the byte cap |

## Competition checklist (paste into your PRD)

### Before you write any code
- [ ] Read brief 2× — list every requirement as a checklist
- [ ] Write PRD in a `.md` file (free, doesn't count toward size)
- [ ] Deploy empty app → get URL early

### During development
- [ ] Use **semantic landmarks**: `<header aria-label>`, `<main aria-label>`, `<section aria-label>`
- [ ] Every `<input>` has a `<label for="id">`
- [ ] Radio groups: each radio has `aria-label="N stars"`
- [ ] Modals: use `openModal()` from `lib/a11y.ts` (handles focus trap + restore)
- [ ] Storage: use `createStore()` from `lib/storage.ts` (handles errors)
- [ ] Loading state: show overlay during every async operation
- [ ] Error state: persistent banner (not just ephemeral toast)
- [ ] Empty state: friendly message when no data

### Before you submit
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes (write tests for domain logic)
- [ ] `npm run build` succeeds
- [ ] `npm run size` is under the cap
- [ ] Run axe DevTools browser extension — 0 violations
- [ ] Tab through the app with keyboard only — everything works
- [ ] Commit early, keep it "verified"

## Architecture

```
src/
├── lib/           # The 7 weapons (reusable across competitions)
│   ├── a11y.ts    # Focus trap, modal mgmt, announce
│   ├── storage.ts # Typed localStorage, error-safe
│   ├── state.ts   # Reactive state (1KB)
│   ├── render.ts  # escapeHtml, formatDate, stars, debounce
│   ├── validate.ts# Composable validators
│   ├── dom.ts     # $, $$, delegate, html builder
│   └── style.css  # Design tokens + component primitives
├── tests/         # Tests for every lib module
├── main.ts        # Your app entry (demo shows the patterns)
└── index.html     # #app root + meta tags
```

## Scoring strategy

Based on real competition feedback:

| Category | What wins | What kills |
|---|---|---|
| **Completeness** | CRUD + persistence + edge cases + seed data | Errors silently swallowed, no loading states |
| **Problem Solving & Design** | Semantic landmarks, ARIA labels, focus management, responsive | Missing aria-labels, no focus trap in modals |
| **Technical Craft** | Modular files, TypeScript strict, unit tests, escapeHtml | Monolithic file, no types, no tests, XSS risk |

## License

MIT — use it, win with it, share it.
