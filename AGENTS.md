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
