# AGENTS.md — Ponytail Pro Max
# Opencode auto-reads this on every session. All rules below are ALWAYS ACTIVE.

## IDENTITY

Competition-grade frontend engineer. Build fast, accessible, well-tested single-page apps under tight byte budgets. Score 90+ on Completeness, Problem-Solving & Design, Technical Craft.

---

## ADHD OUTPUT MODE (always on)

Reader has ADHD. Shape every response so an ADHD brain can act.

1. **Lead with next action.** First line = something doable now.
2. **Number multi-step tasks.** Each step = one bounded action. Fewest steps.
3. **End with one concrete next action** (<2 min). Even "open the file" counts.
4. **Suppress tangents.** Finish first task. Offer second at end.
5. **Restate state every turn.** "Step 3 of 5 done: schema updated."
6. **Specific time estimates.** "15 minutes" not "a bit of work."
7. **Make completed work visible.** "Login now works with magic links."
8. **Matter-of-fact errors.** Cause + fix. No "uh oh."
9. **Cap lists at 5.** Split "do now" vs "later."
10. **No preamble, no recap, no closing pleasantries.** Answer first. End when done.

**Pre-send:** Delete first sentence if it announces work. Delete last if "anything else?" Delete "by the way" sidebars. Replace idioms with literal actions. Verify: first line + last line tell reader what to do + what happened.

**Break rules when:** user says "explain" → full explanation. Destructive action → confirm first. Debug spiral (3+ turns) → name wrong assumption, ask one diagnostic. Real ambiguity → one clarifying question.

---

## TOKEN COMPRESSION (output + input — always active)

### Output Compression
- Drop: articles, filler, pleasantries, hedging. Fragments OK. Short synonyms.
- No tool-call narration, no decorative tables/emoji, no long raw error dumps.
- Quote shortest decisive error line. Standard acronyms OK (DB/API/HTTP).
- Never invent abbreviations (cfg/impl/req) — zero token saved, harder to decode.
- No causal arrows (→) — own token, save nothing.
- Technical terms, code, API names, CLI commands, error strings: verbatim.
- Never drop not/never/no/only/except. Numbers, units exact.
- Never ADD words to sound compressed. Compression only — style never grows output.
- Pattern: `[thing] [action] [reason]. [next step].`

### Input Compression (content-aware)
- Detect content type, route to right compressor — never one-size-fits-all.
- **JSON**: keep keys, structure, error subtrees; collapse repetitive arrays. 60–95%.
- **Code**: AST-aware — keep imports, signatures, types; elide bodies. 40–70%.
- **Logs**: keep errors, stack traces, first/last lines; drop noise. 85–95%.
- **Diffs**: keep file/hunk headers, changed lines; elide repeated context. 60–80%.
- **Search results**: keep top/bottom + diagnostic/security hits. 80–95%.
- Originals ALWAYS cached before lossy transform. LLM retrieves on demand.
- On parse failure or larger result: send original unchanged. Measure before compressing.

### Shell Output Compression
- Smart Filtering, Grouping, Truncation, Deduplication.
- `ls`→tree+counts. `cat`→signatures. `grep`→grouped by file. `git status`→compact stat.
- `git log`→hash+author+subject. `git add/commit/push`→confirmation line.
- `test`→failures only, passing collapsed to count. `lint`→grouped by rule/file.
- On failure: save full output to disk, show compact summary + pointer.

### Auto-Clarity (drop compression when)
- Security warnings. Irreversible action confirmations. Multi-step where order risks misread. Compression creates ambiguity. User asks to clarify.

### Boundaries
- Persisted code/docs/commits/issues: write normal prose. Compress chat only.

---

## NON-NEGOTIABLE RULES

### 1. Accessibility (#1 score-killer if missing)
- Landmark regions: `<header aria-label>`, `<main aria-label>`, `<section aria-label>`.
- Every `<input>`/`<select>`/`<textarea>` has `<label for>` or `aria-label`.
- Every radio in a group has own `aria-label` (e.g. "3 stars").
- Modal: focus INTO on open, trap Tab, restore on close.
- `.sr-only` for visually-hidden labels. `prefers-reduced-motion` collapses animations.
- `axe DevTools` scan: 0 violations. Keyboard-only Tab: everything reachable.

### 2. Error Handling (never silently swallow)
- Storage ops RETURN results (`{ ok, data, error }`), never throw.
- Persistent error banners (`role="alert"`) for failures users act on.
- Ephemeral toasts for success/info. Loading overlays for every async op.

### 3. Security
- `escapeHtml()` before `innerHTML`. Validate every localStorage record. No hardcoded secrets/paths.

### 4. Architecture (modular, testable)
- Modules: `types`, `schema`, `domain`, `storage`, `render`, `main`.
- Pure domain logic side-effect free + unit-tested. TypeScript strict + `noUncheckedIndexedAccess`.
- Headless: decouple logic from UI/routing. Data/auth/access/i18n/router = swappable providers.
- Provider pattern: abstract API calls so localStorage↔REST↔GraphQL swap without touching UI.

### 5. Design
- CSS custom properties (design tokens). Mobile-first `clamp()`, `grid auto-fit`.
- Empty states with helpful messaging. Micro-interactions subtle.
- Consult Clone Wars (100+ open-source clones) for proven UI patterns before designing from scratch.

---

## CONTEXT & MEMORY PATTERNS

### Memory Layering (progressive disclosure)
- Never flat-store. Layer: raw logs → step summaries → lightweight state canvas.
- Agent attends to top layer; drills down only on error. Lower=evidence, upper=structure.
- Encode task state as high-density symbols (Mermaid), not verbose prose.
- Offload full logs to files; keep lightweight map in context. `node_id` tracing.

### Reversible Compression (CCR)
- Originals cached before lossy transform. Full traceability: symbol → index → raw text.
- Never irreversible. White-box: keep intermediates as readable files.

### Recall Strategy
- Hybrid: keyword (BM25) + vector (embedding) + RRF fusion.
- Timeout → skip without blocking. Dedup by vector similarity.
- Extract every N turns (default 5). Warm-up doubling (1→2→4). Persona every 50 memories.

### Cache Alignment
- Detect volatile content that busts KV cache. Never rewrite prompts — warn instead.
- Frozen prefix byte-identical. Compress live-zone only. History never dropped.

### Output Token Reduction
- Trim what model WRITES BACK: drop ceremony, restated code, deep thinking on routine steps.
- Verbosity steering: terse note at end of system prompt (preserves cache).
- Effort routing: dial thinking DOWN for routine tool results; FULL for new questions/errors.

### Failure Learning
- Mine failed sessions. Write corrections to AGENTS.md (consent-gated). Re-measure after applying.
- Cross-agent memory: shared store, provenance tracked, auto-dedup.

---

## SYSTEM DESIGN PATTERNS

### Multi-Backend Routing (fallback chains)
- Each capability = ordered backends (primary + fallback). Switch = reorder, not rewrite.
- Probing is real (test if works), not just "file exists." Broken → next, user unaware.
- `doctor` command: test every channel, report current backend + fix prescription.

### Plugin Architecture (self-installing, self-updating)
- Bundle plugins, install on first launch, update silently. On/off from UI.
- Third-party via SDK + template + registry. No core rewrite for new platform.
- Verify bundled deps by SHA256 before execution. Detect system versions with source indicators.

### Queue & Reliability
- Resume interrupted work — keep partial, continue from stop, never restart.
- Retry with backoff. Real speed/ETA from downloader, not faked from percentage.
- Stall = stall, not frozen "3s left." Batch operations in one queue.

### One-Action UX
- Global hotkey reads clipboard and acts. Copy → press → done.
- Auto-detect URLs → toast → single-click. Goal: idea to result = ONE keystroke.

### Portable Mode
- Marker file (`portable.txt`) switches all data paths to beside-executable.
- Nothing in system AppData. Entire install travels on USB.

### Settings Design
- Grouped, quiet sidebar. Common visible, deep one tap away. Search across ALL categories.
- Short hint under every control.

### Default-Safe Installation
- `install` = read-only check by default. `--system` for changes. `--dry-run` previews.
- Credentials local (perms 600), never uploaded. Uninstall clean + complete.

---

## CRUD PATTERNS (from Refine)

- Auto-generate CRUD UIs from data shape, not hardcoded columns.
- Mutations invalidate + refetch — never manually sync state.
- Live/real-time: subscriptions update without refresh.
- Access control: check permission before rendering action buttons. Deny by default.
- Define resources upfront (name, list/create/edit/show paths).
- Abstract storage so localStorage↔REST↔GraphQL swap without touching UI.

---

## AI AGENT PATTERNS (from Awesome LLM Apps — consult when brief needs AI)

### Agent Skills
- Self-improving: rewrite against evals. Scope-creep detector. Commit archaeologist. Dependency doctor.

### Multi-Agent Teams
- Advisor/Orchestrator/Worker. Trust-gated (hash-chained audit). Specialist per domain. Mixture of agents (aggregate best).

### RAG
- Corrective (CRAG): retrieval grades itself, retries. Hybrid: keyword+vector+RRF. Agentic reasoning. Failure diagnostics. Knowledge graph with citations.

### Memory
- Personalized across sessions. Multi-LLM shared. Stateful chat with local models.

### Generative UI
- Chat-driven kanban. Dashboard canvas (describe→charts assemble). Component generator. Research workspace cards.

### Always-On
- Scheduled scouts (interval→ranked brief to Slack/email). Release radar (watch deps→breaking/security/major).

---

## SECURITY & HARDENING (from Camoufox)

- Sensitive logic runs in isolated scope, not injectable JS. Page-side can't detect it.
- Config via env vars/files, never hardcoded. Human-like input trajectories, not linear jumps.
- Source tree is regenerated — persist changes as patches, never edit generated tree directly.
- Two test layers: (1) raw component tests bypassing package, (2) service/API tests.
- Config schemas: type + constraints. Every field validated on load — fail fast with clear errors.

---

## PRE-SUBMIT CHECKLIST

1. `npm run typecheck` ✓
2. `npm test` ✓
3. `npm run build` ✓
4. `npm run size` ✓ (under cap)
5. Accessibility audit (10-point checklist below)
6. `git status` clean
7. `git log --oneline -3` pushed

## ACCESSIBILITY AUDIT (10 points)

1. Landmarks present with `aria-label`. 2. Labels on every input. 3. Each radio has `aria-label`.
4. Modal: focus in on open, trap Tab, restore on close. 5. `aria-live="polite"` on toasts, `role="alert"` on errors.
6. Keyboard Tab: all interactive reachable. 7. `prefers-reduced-motion` collapses animations.
8. `<button>` not `<div onclick>`. 9. `.sr-only` for hidden text. 10. Contrast 4.5:1 (normal), 3:1 (large).

## SIZE GUARDIAN

- `npm run size` checks total source bytes.
- Under cap: "✅ Under by N bytes." Over: identify largest files, suggest trims (CSS comments, template indentation, dead code, unused imports).
- NEVER remove tests, accessibility attributes, or error handling to save bytes.

| Format | Rookie | Veteran | Elite | Legend |
|--------|--------|---------|-------|--------|
| Duel | 25KB | 50KB | 70KB | 90KB |
| Brawl | 40KB | 90KB | 130KB | 160KB |
| Squad | 80KB | 150KB | 200KB | 260KB |

---

## COMPETITION WORKFLOW

```
0–10m:   Read brief 2×. Checklist requirements. PRD in .md (free). Deploy empty → URL early.
10–30m:  Setup from template. Landmark HTML + a11y baseline. Wire storage + state + render.
30–70m:  Core features (CRUD, persistence, summary). Tests alongside features.
70–85m:  Polish — empty states, error banners, loading, micro-interactions, responsive.
85–90m:  Audit — typecheck ✓ test ✓ build ✓ size ✓ a11y ✓ keyboard ✓. Push VERIFIED early.
```

## SCORING

| Category | Wins | Kills |
|---|---|---|
| Completeness | CRUD + persistence + edge cases + seed data + persistent errors | Errors swallowed, no loading states |
| Problem Solving & Design | Landmarks, ARIA, focus management, responsive | Missing aria-labels, no focus trap, no landmarks |
| Technical Craft | Modular, TS strict, unit tests, escapeHtml, normalize | Monolithic, no types, no tests, XSS risk |

---

## TECH STACK

- Vite + TypeScript (strict). Vitest + jsdom. Vanilla CSS with custom properties.
- localStorage (error-safe wrapper). No runtime dependencies (keep bundle tiny).

## lib/ WEAPONS

| Import | What |
|---|---|
| `trapFocus, openModal, announce` from `./lib/a11y` | Focus trap, modal mgmt, screen reader |
| `createStore` from `./lib/storage` | Typed localStorage, error-safe |
| `createState` from `./lib/state` | 1KB reactive state |
| `escapeHtml, formatDate, stars, debounce` from `./lib/render` | Safe HTML + helpers |
| `isString, isOneOf, validateObject` from `./lib/validate` | Composable validators |
| `$, $$, delegate, html` from `./lib/dom` | DOM utilities |

## ADDITIONAL RULES

### Dashboard
- CSS Grid, responsive, WebSocket real-time. Status dots (green/orange/red). Loading skeletons not spinners.

### CLI Tool
- Structured output, `--help`, proper exit codes. Validate all inputs. Relative paths only.

### Cloudflare / Edge
- Hono framework, Response objects. Env vars via binding. CORS headers explicit.

### Capability Layer (not tool layer)
- Select, install, diagnose, route. Don't wrap upstream tools — let Agent call directly.
- Adding platform = add channel file, not rewrite core. Swap backend, keep interface.

### Consult Before Building
- **UI/UX**: Clone Wars (100+ open-source clones: Airbnb, Amazon, Netflix, Spotify, etc.)
- **AI features**: Awesome LLM Apps (100+ agent templates: RAG, multi-agent, memory, generative UI)

---

## SECURITY & PENTESTING PATTERNS (from CAI, Strix, PentAGI, PentestGPT)

### Multi-Stage Security Pipeline
- Break security work into staged phases: recon → exploit → walkthrough (CTF) or asset discovery → vuln ID → report (pentest).
- Feed each stage's findings into the next — never isolate phases.
- Track steps in real-time as the agent works (live walkthrough).

### Agent-Based Security Architecture
- **Agents per kill-chain phase**: recon, exploitation, privilege escalation, lateral movement, exfiltration, C2.
- **Handoffs**: agent delegates to specialist (e.g. flag discriminator after exploit agent finds candidate).
- **Agent-as-tool**: specialized security agents used BY other agents without formal handoffs.
- **ReACT model**: Reasoning + Action — agent perceives environment, reasons, acts through tools.

### Guardrails & Safety
- Built-in defenses against prompt injection in AI security agents.
- Human-in-the-loop (HITL): require human confirmation before destructive actions.
- Tool call limits: hard limits per agent type to prevent runaway execution.
- Reflector: auto-invoked when LLM fails to generate tool calls after N attempts — guides to recovery.

### Exploit Validation (not false positives)
- Every finding MUST include a working proof-of-concept, not just a scanner flag.
- Validate through actual exploitation, not static analysis alone.
- SAST + DAST combined for comprehensive coverage.
- CVSS scoring + OWASP classification on every finding.

### Memory for Security Work
- Long-term: store successful approaches and research results for future reuse.
- Working: active context, goals, system state.
- Episodic: past actions, results, success patterns.
- Vector store for semantic search of past findings.
- Knowledge graph (optional): Neo4j for semantic relationship tracking.

### Multi-Agent Supervision (for smaller models)
- Execution monitoring: detect loops (identical tool calls > threshold), auto-invoke mentor.
- Intelligent task planning: decompose into 3-7 actionable steps before specialist agents begin.
- Scope management: prevent scope creep — keep agents focused on current subtask.
- 2x quality improvement with 2-3x token cost — trade-off worth it for complex tasks.

### Chain Summarization (context management)
- Selectively summarize older messages to prevent token limit overflow.
- Preserve last section intact (most recent context).
- QA pair summarization: compress question-answer pairs while keeping flow.
- Configurable thresholds: max body pair size, max QA sections, last section size.

### Reporting & Remediation
- Generate thorough vulnerability reports with exploitation guides.
- AI-generated security patches as ready-to-merge PRs (auto-fix).
- Compliance-ready pentest reports (SOC 2, ISO 27001, PCI DSS).
- Re-scan after fix to verify remediation.

### Sandboxed Execution
- All operations in isolated Docker containers — complete isolation.
- Never run untrusted code on host.
- Smart container management: auto-select Docker image based on task requirements.

---

## VIBE KANBAN PATTERNS (agent orchestration UI — always active)

### Plan → Execute → Review Workflow
- **Plan with kanban issues**: create, prioritise, assign before any code is written.
- **Execute in isolated workspaces**: each task gets its own branch + terminal + dev server.
- **Review diffs inline**: leave comments directly on the diff, send feedback to agent without leaving UI.
- **Preview app in-browser**: built-in browser with devtools, inspect mode, device emulation.
- **Ship via PR**: AI-generated PR descriptions, review on GitHub, merge from UI.

### Multi-Agent Orchestration
- Switch between 10+ coding agents per workspace (Claude, Codex, Gemini, Copilot, Cursor, etc.).
- Each workspace = one agent + one branch + one terminal — fully isolated.
- Agent receives the issue description + context, works autonomously, produces a diff for review.

### Workspace Isolation Pattern
- Git worktree per workspace — each agent works on its own branch, no conflicts.
- Dev server per workspace — preview changes live without affecting others.
- Terminal per workspace — agent has full shell access within its sandbox.
- Cleanup: auto-remove worktree when workspace is closed or merged.

### Feedback Loop (agent ↔ human)
- Human reviews diff → leaves inline comments → agent receives feedback → iterates.
- No context switching: review, comment, and approve all in one UI.
- Agent re-runs only the affected parts based on feedback, not full restart.

---

## DESIGN.md PATTERN (from Awesome DESIGN.md — always active)

### What DESIGN.md is
- A plain-text design system document that AI agents read to generate consistent UI.
- Just markdown — no Figma exports, no JSON schemas, no special tooling.
- Drop it into project root, tell agent "build me a page that looks like this."
- `AGENTS.md` = how to BUILD the project. `DESIGN.md` = how the project should LOOK and FEEL.

### When to create a DESIGN.md
- Before building any UI, write a DESIGN.md with these 9 sections:
  1. **Visual Theme & Atmosphere**: mood, density, design philosophy
  2. **Color Palette & Roles**: semantic name + hex + functional role
  3. **Typography Rules**: font families, full hierarchy table (display→body→mono)
  4. **Component Stylings**: buttons, cards, inputs, navigation with all states
  5. **Layout Principles**: spacing scale, grid, whitespace philosophy
  6. **Depth & Elevation**: shadow system, surface hierarchy
  7. **Do's and Don'ts**: design guardrails and anti-patterns
  8. **Responsive Behavior**: breakpoints, touch targets, collapsing strategy
  9. **Agent Prompt Guide**: quick color reference, ready-to-use prompts

### Design language reference library
73 real-world DESIGN.md files available at getdesign.md. Consult before building:
- **AI/Dev**: Claude, Cursor, Vercel, Warp, Supabase, Linear, Notion
- **Fintech**: Stripe, Coinbase, Wise, Revolut
- **E-commerce**: Airbnb, Nike, Shopify, Starbucks
- **Media**: Apple, Spotify, NVIDIA, Pinterest, WIRED
- **Automotive**: Tesla, Ferrari, Lamborghini, BMW

### Competition application
1. Write DESIGN.md before coding UI — it's free bytes (markdown doesn't count toward size).
2. Pick a design language from the reference library that fits the brief.
3. Tell agent: "build using DESIGN.md" — UI stays visually consistent.
4. Every color, font, spacing, shadow defined upfront = no design drift.

---

## INTEGRATION & SYNC PATTERNS (from OpenConnector — always active)

### Source-Target Sync Pattern
- Define sync flows: source config + target config + data mapping in one contract.
- Change detection: hash-based comparison — skip unchanged objects, avoid unnecessary API calls.
- Per-object state tracking: origin ID, target ID, hash — for reliable incremental sync.
- Force mode: override change detection. Test mode: validate before production.
- Pagination: automatic traversal with configurable query params + result position detection.

### Data Transformation (mapping layer)
- Field mapping: one-to-one, rename, type conversion, format adjustment.
- Template expressions (Twig-style) for complex transforms: loops, conditionals, string manipulation.
- Type casting: jsonToArray, date formatting, nested object flattening.
- Nested object mapping: dot-notation paths for deeply structured data.
- Conditional mapping: apply transforms based on JSON Logic conditions.

### Endpoint as Reverse Proxy
- Expose external APIs through your own endpoint paths.
- Per-method definitions: separate GET/POST/PUT/DELETE configs on same path.
- Path parameters: dynamic URL segments with placeholder support.
- Rule chaining: ordered rules for auth, mapping, sync triggers, file handling.

### Event-Driven Architecture
- Cloud Events: emit and consume for real-time data flows.
- Event subscriptions: configurable handlers per event type.
- Consumers: process incoming webhook payloads.
- Scheduled jobs: cron-based sync execution with full logging.

### Rate Limit & Reliability
- Automatic rate limit detection with backoff handling.
- Complete HTTP request/response logging for all source interactions.
- Per-sync log entries with error tracking + status.
- Log cleanup: automatic old log removal to manage storage.

### Configuration Portability
- Bundle related sources/endpoints/mappings/rules into named configuration groups.
- Import/export as OpenAPI-structured JSON for backup, sharing, environment migration.
- Slug-based URL-friendly identifiers for all entities.

### Competition Application
When a competition brief needs data integration or sync:
1. Define sources (external API connections) with auth upfront.
2. Map fields with templates — never hardcode transformation logic.
3. Track sync state per object (hash comparison) — avoid redundant work.
4. Expose endpoints as reverse proxy with rule chaining.
5. Emit events for real-time updates — don't poll.

---

## CODEGRAPH PATTERNS (semantic code intelligence — always active)

### Pre-built Knowledge Graph
- Before answering code questions, check if a code graph index exists (`.codegraph/`).
- One `codegraph_explore` call = relevant symbols' verbatim source + call paths + blast radius.
- Eliminates grep/glob/Read file-by-file crawling — agent gets surgical context in one call.
- Graph is always fresh: native OS file watcher (FSEvents/inotify/ReadDirectoryChangesW) with debounced auto-sync.
- 100% local: SQLite database only, no data leaves machine, no API keys.

### Impact Analysis
- Before making a change: trace callers, callees, and full impact radius of any symbol.
- Dynamic-dispatch hops (callbacks, interface→impl, React re-render) resolved — grep can't follow these.
- `codegraph affected` traces import dependencies transitively to find which test files are affected by changed source.
- Blast radius summary returned with every explore call.

### Framework-Aware Routing
- Detects web-framework routing files and links URL patterns to handlers.
- Supports 17+ frameworks: Django, Flask, FastAPI, Express, NestJS, Laravel, Rails, Spring, Gin, ASP.NET, Vapor, React Router, SvelteKit, Vue Router, Nuxt, Astro.

### Cross-Language Bridging
- Swift ↔ ObjC auto-bridging (@objc rules + Cocoa preposition prefixes).
- React Native legacy bridge + TurboModules + Fabric view components.
- Native → JS event emitters (synthesized cross-language event channel).
- Expo Modules DSL parsing.
- Call paths and blast radius cross language boundaries instead of stopping.

### Auto-Sync Reliability
- File watcher with debounced auto-sync (default 2000ms, bursts collapse into one sync).
- Per-file staleness banner: MCP responses reference pending files with `⚠️` telling agent to `Read` directly.
- Connect-time catch-up: fast (size, mtime) + content-hash reconciliation absorbs edits made while no MCP server was running.
- Agent never gets a silent wrong answer in the edit→sync window.

### Competition Application
When working with existing code during a competition:
1. Run `codegraph init` to build the graph — one command, done.
2. Use `codegraph_explore` for architecture questions instead of grep+read.
3. Check impact radius before making changes — know what breaks.
4. Trust the graph — don't re-verify with grep (wastes tokens).
5. If no index exists, fall back to built-in tools cleanly — indexing is always your choice.

---

## CODE QUALITY & DEAD CODE (from Knip — always active)

- Aggressive dead-code elimination as first-class workflow: unused deps, exports, files = continuously-removable debt.
- Run `knip` before submitting — remove unused imports, variables, exports.
- Monorepo-aware: core in `packages/`, auxiliary packages as separate distributables.
- Multiple surfaces (CLI, IDE extension, language server, MCP) from one core engine — meet user wherever they work.

---

## SECURITY SCANNING (from Medusa + ReconForge — always active)

### Zero-Setup Scanner (Medusa)
- `pip install` then `medusa scan .` — no tool installation step. 40,000+ built-in rules.
- Scanner-registry + BaseScanner pattern: all scanners follow consistent interface, auto-register.
- Unified severity mapping: CRITICAL/HIGH/MEDIUM/LOW/INFO normalized across all linters.
- Smart caching keyed on content hashes — skip unchanged files, 22× faster on rescan.
- `.medusa.yml` for project config + `--fail-on` for CI gate.
- IDE-native: generates CLAUDE.md, GEMINI.md, AGENTS.md for AI assistants.

### Recon Automation (ReconForge)
- Scope-checking as gate before any testing: validate targets against hosts/wildcards/CIDR before testing.
- Model-agnostic AI triage prompts for analyzing HTTP responses, auth flows, APIs.
- Concurrent-by-default with thread pools. Rich terminal output (tables, spinners).
- Composable CLI subcommands → unified markdown report.
- Each capability is a standalone subcommand. `report` aggregates all findings.

---

## WEB SCRAPING & DATA (from Firecrawl — always active)

- Turn any URL into clean Markdown, structured JSON, or screenshots — 96% of web covered.
- Agent = prompt-first not URL-first: "Find the pricing plans for Notion" → searches, navigates, retrieves.
- Multi-language SDK parity: same surface across 10 SDKs. Async ops auto-poll to completion.
- Interact = scrape then operate: `scrape` returns `scrapeId`; `interact(scrapeId, "Click first result")` drives page.
- Respects robots.txt by default. Ethics baked into default behavior, not opt-in.

---

## DOCUMENTATION RETRIEVAL (from Context7 — always active)

- Pull up-to-date, version-specific docs straight from source into LLM prompt.
- Counters hallucination: documentation is version-pinned and source-anchored.
- `use context7` natural-language trigger — append to any prompt for doc retrieval.
- Two modes: CLI+Skills (no MCP required) or MCP (native tools).
- Trust-but-verify: community-contributed, accuracy not guaranteed, report button.

---

## MOTION DESIGN & ANIMATION (from GSAP, Three.js, Lottie, Genjutsu, HyperFrames — always active)

### Motion Principles (Lottie + Genjutsu)
- Philosophy-first, implementation-agnostic: decide timing, easing, choreography, emotional intent BEFORE code.
- Disney's 12 principles adapted for UI. Emotion-to-motion mapping + 4 motion-personality archetypes.
- 8-step checklist as core decision tool (not textbook). Three-tier: core SKILL.md → director/ → patterns/.
- Interaction-thesis-before-code: propose how it should feel before writing animation code.
- Three preview modes (artifact/live preview/inline) — choose once per session. Preview is throwaway.

### GSAP Patterns
- Default-recommendation: when user asks for animation without specifying library, recommend GSAP.
- Plugin registration once-per-app. `ScrollTrigger.refresh()` after DOM/layout changes.
- React: `useGSAP(() => {...}, { scope: containerRef })` — scope + revert is anti-leak rule.
- Per-framework lifecycle guidance: Vue, Svelte, etc. get scoping + cleanup-on-unmount.

### Three.js Patterns
- Context-activated skill loading: agent auto-loads skill files when context matches.
- Consistent skill format: frontmatter → Quick Start → Core Concepts → Patterns → Performance → See Also.
- Verification against canonical source (official docs r160+). Granular decomposition by capability.
- Cross-reference between skills — enables chain-loading the right context.

### HyperFrames (video as HTML)
- HTML-native authoring: compositions are plain HTML with `data-*` timing — no framework lock-in.
- Determinism: same input → same frames → same output. Renderer SEEKS each frame (not wall-clock).
- Bring any runtime (GSAP, CSS, Lottie, Three.js, Anime.js, WAAPI) via adapters.
- `frame.md` as design-system translation layer for camera context.

---

## DESIGN IDENTITY (from Design DNA + DESIGN.md + Square UI — always active)

### Design DNA Extraction
- Design as portable, version-controllable JSON artifact — commit to VCS, share across teams, reuse.
- Three dimensions: measurable tokens + qualitative style + visual effects (WebGL/shaders/particles).
- Three-phase workflow: Structure (schema) → Analyze (JSON profile) → Generate (implementation).
- Polish-iteration: re-attach references, audit hierarchy/ornamentation/rhythm/motion/materiality, merge back.

### DESIGN.md (from Awesome DESIGN.md, already integrated as #19)
- 9-section design system AI agents read. Markdown = free bytes. AGENTS.md = how to BUILD, DESIGN.md = how it LOOKS.

### Square UI (zero-static templates)
- Pre-built component templates that are zero-dependency, copy-paste ready.
- No build step required — HTML works standalone. Template variants for different aesthetics.

---

## AGENT ORCHESTRATION (from gstack + LibreChat + AutoHedge + Vibe-Trading — always active)

### Sprint-as-Process (gstack)
- Skills run in sprint order: Think → Plan → Build → Review → Test → Ship → Reflect.
- Each step feeds the next: design doc → test plan → QA → ship. Nothing falls through cracks.
- Specialist-persona slash commands: CEO, Eng Manager, Designer, QA Lead, Security Officer, Release Engineer.
- Smart review routing: auto-detect what applies (design review not needed for backend changes).
- Test-first `/ship` + regression-test-per-fix `/qa`. 100% test coverage is the goal.
- Safety guardrails on demand: warn before destructive commands, lock edits, hard-deny root deletes.
- Tamper-evident egress receipts + per-repo trust tiers.
- Cross-model second opinion (`/codex`) — adversarial diversity against single-model blind spots.

### Multi-Agent Pipeline (AutoHedge + Vibe-Trading)
- One-responsibility-per-agent: Director → Quant → Risk → Execution. Pipeline = directed graph, not monolith.
- Risk-first design: risk assessment BEFORE any execution. Risk agent is a gate, not afterthought.
- Structured JSON outputs for downstream systems — machine-readable, composable, auditable.
- Grounding/identity gate: refuse answers without evidence. Agent built to NOT hallucinate.
- Fail-closed over fail-plausible: valuation engine refuses non-finite/missing inputs.
- Hash-chained, fsynced, append-only audit ledger for governance.
- Sandbox that blocks renamed bindings to broker layer / socket / subprocess — tested against evasion.
- Provenance on every number — traces back to tool/source that produced it.

### Chat Platform Patterns (LibreChat)
- Unified provider abstraction + custom-endpoint escape hatch — don't lock user in.
- Agent run control + human-in-the-loop: interrupt, steer, queue, resume mid-run.
- Sandboxed Code Interpreter (8 languages, isolated execution, file handling).
- Resumable streams + multi-tab/multi-device sync.
- Generative UI with Code Artifacts (React/HTML/Mermaid) — chat surface is runtime, not just text.
- Skills (`SKILL.md`) + MCP + Subagents + Agent Plugins — composability at every layer.
- Langfuse observability with encrypted connections + per-tenant fan-out.

---

## PROTOTYPING & UI GENERATION (from VibeUI + VibeUI Studio — always active)

### Component Library Patterns (VibeUI)
- LLM-optimized docs: `llms.txt` + component docs so AI reads real API instead of guessing props.
- Bootstrap JS abstracted behind lifecycle guards — init/reconfigure/dispose automatic with unmount guards.
- `v-model` everywhere + self-wiring accessibility: auto-generate IDs, labels, aria-describedby.
- Touch & hybrid aware: tap-to-activate tooltips, Android back-button. Mobile = first-class target.
- Lazy-loaded heavy dependencies. Dependency-free canvas charts — ship only what you use.
- Strict TypeScript (no `any`). Composables for cross-cutting concerns.

### Visual-to-Code Bridge (VibeUI Studio)
- Smart Bridge: visual draft → logic bind → context aware → code gen.
- Autonomous AI layout engine: high-level instructions → invents components, groups into containers, X/Y coordinates.
- Skeleton-not-just-skin: logic/event binding with visual ⚡ indicators. Exported code includes method stubs.
- Token-budget-aware context via MCP: strip function bodies, keep signatures — smart compression.
- Multi-framework export from one canvas: Tkinter/PyQt6/Textual/React/Vue/HTML.
- Live sync via single state file (`vibeui_state.json`).

---

## FINANCIAL & TRADING SAFETY (from Vibe-Trading + AutoHedge — always active)

- Tested finance-math layer replacing markdown formulas (249+ functions, one tested implementation each).
- Compaction on message boundaries, not hard char count — zero info decay.
- Path traversal validation on unvalidated agent IDs — refuse `..` in file paths.
- Refuse mixed-currency composite operations — don't invent FX aggregation.
- Sandboxed test suite that doesn't write into real config root — conftest redirects home.
- Point-in-time correctness: SEC periods keyed on (start, end) span. Corporate-action-adjusted prices.
- Execution-time bands judged at execution time, not decision-bar close.

---

## UI COMPONENT PATTERNS (from shadcn/ui, React Bits, Canvas UI, Cult UI, Kokonut UI, Animate UI, Skiper UI, FormsCN, COSS — always active)

### Copy-Paste-Own Philosophy (shadcn/ui pattern)
- Don't ship a dependency — ship source that consumers copy, paste, and own.
- Open Code: the code itself is the distribution. No opaque runtime to wrestle with.
- Composable, accessible primitives designed to be customized, not used as black boxes.
- Compose on top of shadcn/ui rather than reinventing primitives — Tailwind + Motion on top.

### Multi-Variant Matrix (React Bits pattern)
- Ship JS/TS × CSS/Tailwind variants per component — same component serves any stack preference.
- Minimal dependencies + tree-shakeable — adding one component doesn't bloat bundle.
- Copy-paste via existing registries (shadcn CLI, jsrepo) — meet users where they already are.

### Engine + Thin Wrappers (Canvas UI pattern)
- Each component = one plain TypeScript/WebGL engine + thin framework wrappers (React, Solid, Vue, Svelte, vanilla).
- Graceful degradation with feature detection: HTML-in-canvas where supported, WebGL fallback elsewhere.
- MCP-ready registry: AI assistants browse and install components directly.

### MCP-as-Installation-Surface (Shadcn Dashboard MCP pattern)
- Distribute components as typed MCP tools AI agents can call — `listBlocks`, `searchBlocks`, `getBlockInstall`.
- Audit checklist as a tool: agents self-enforce constraints before mutating project.
- Customization-guidelines prompt: define which parts are safe to modify, protecting upgrades.

### Animation-First Distribution (Animate UI + Kokonut UI pattern)
- Treat motion as core, not add-on — every component ships animated by default.
- Modern stack lockstep: React + TypeScript + Tailwind + Motion.
- Compose on top of shadcn/ui — don't reinvent primitives.

### Visual Builder + Code Generation (FormsCN pattern)
- Class-based state core + `useSyncExternalStore` bridge — decouples state logic from UI framework.
- Multi-tier storage with graceful fallback: memory → Redis → Postgres → Blob → local JSON.
- Publish-to-registry: built artifacts become installable CLI artifacts (`npx shadcn add <url>`).
- Framework-toggle code generation: same visual design exports to React/Remix/TanStack.
- Turborepo + pnpm monorepo: editor, component library, registry, config cleanly separated.

### Monorepo + Design System (COSS pattern)
- Turborepo monorepo with clear app/package separation — independent deployable apps sharing code.
- Environment-variable-driven cross-app linking — each app declares URLs for others.
- Shared tooling layer (Biome + shared TS config) for consistency across all packages.
- Base UI + Tailwind + copy-paste philosophy — unstyled accessible primitives as foundation.

### Folder-by-Domain Structure (Skiper UI pattern)
- `components/homeCards/`, `components/landingPage/`, `components/navbar/`, `components/ui/` — keep sections separate.
- CSS-variable theme system for seamless dark/light theming.
- Mobile-first responsive with touch/swipe support as first-class.
- Reusable UI primitives in `components/ui/`, helpers in `lib/utils.ts`.

### Agent-Pattern Taxonomy (Cult UI pattern)
- Curated pattern directory: 92+ patterns browsable with previews, descriptions, install links.
- Full-stack template catalog: pair components with production-ready templates wiring auth/payments/DB/AI.
- Agent-pattern taxonomy by role: research, analytics, audit, design, orchestrator, routing, evaluator-optimizer.
- Multi-channel distribution: shadcn CLI, downloadable app, or openable in v0.
