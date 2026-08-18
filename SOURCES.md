# Sources — Repo Library

20 repos integrated into Ponytail Pro Max AGENTS.md. Each contributed patterns, rules, or reference material.

## 1. Competition Real (Candle Collection Log)
- **Repo**: `ferlin070/sbkmb4j8`
- **What it taught**: a11y is #1 score-killer. Error handling must be user-facing. Modular architecture + TypeScript strict + unit tests = Technical Craft 90. Byte budget is a hard constraint.
- **Score achieved**: Completeness 94, Problem Solving & Design 62, Technical Craft 90
- **Key lesson**: Missing aria-labels on star radios, no landmark regions, no modal focus management = P&D dropped from 88→62.

## 2. claude-code-templates
- **Repo**: `davila7/claude-code-templates`
- **URL**: https://github.com/davila7/claude-code-templates
- **What it contributed**: Agents (frontend-developer, component-reviewer, build-checker, command-expert, deployer, cli-ui-designer). Commands (test, lint). Rules (dashboard, CLI tool, cloudflare).
- **Key patterns**: Component-first thinking, terminal aesthetics, self-review before commit, build verification before push.

## 3. Camoufox
- **Repo**: `daijro/camoufox`
- **URL**: https://github.com/daijro/camoufox
- **What it contributed**: Security & fingerprint hardening, build & patch workflow, testing discipline, config validation.
- **Key patterns**: Sensitive logic in isolated scope not injectable JS. Source tree regenerated — persist as patches. Two test layers: binary + service. Config validated on load, fail fast.

## 4. i-have-adhd
- **Repo**: `ayghri/i-have-adhd`
- **URL**: https://github.com/ayghri/i-have-adhd
- **What it contributed**: 10 ADHD-friendly output rules + pre-send check + override conditions.
- **Key patterns**: Lead with next action. Number steps. Restate state every turn. Specific time estimates. No preamble/recap/pleasantries. Cap lists at 5.

## 5. TencentDB Agent Memory
- **Repo**: `TencentCloud/TencentDB-Agent-Memory`
- **URL**: https://github.com/TencentCloud/TencentDB-Agent-Memory
- **What it contributed**: Layered memory, symbolic compression, traceability, white-box debugging, recall strategy, session pipeline.
- **Key patterns**: Never flat-store — layer it (raw→summary→canvas). Symbolic memory = Mermaid not prose. Full traceability: symbol→index→raw text. Hybrid recall: BM25+vector+RRF.

## 6. Caveman
- **Repo**: `JuliusBrussee/caveman`
- **URL**: https://github.com/JuliusBrussee/caveman
- **What it contributed**: Output token compression (skill) + input token compression (proxy) + auto-clarity + boundaries.
- **Key patterns**: Drop articles/filler/hedging. Never invent abbreviations (zero token saved). Originals cached before lossy transform. Measure before compressing. Drop compression for security/ambiguity.

## 7. RTK (Rust Token Killer)
- **Repo**: `rtk-ai/rtk`
- **URL**: https://github.com/rtk-ai/rtk
- **What it contributed**: Shell output compression, per-command targets, failure recovery, context budget awareness.
- **Key patterns**: Smart filtering + grouping + truncation + dedup. Per-command: git→compact, test→failures only, lint→grouped by rule. On failure: save full output, show summary+pointer.

## 8. Headroom
- **Repo**: `headroomlabs-ai/headroom`
- **URL**: https://github.com/headroomlabs-ai/headroom
- **What it contributed**: Content-aware compression, reversible CCR, cache alignment, output token reduction, failure learning, cross-agent memory.
- **Key patterns**: Detect content type → route to right compressor. CCR: originals always cached. CacheAligner: never rewrite prompts. Output shaping: trim model write-back. Failure learning: mine sessions, consent-gated corrections.

## 9. Clone Wars
- **Repo**: `GorvGoyl/Clone-Wars`
- **URL**: https://github.com/GorvGoyl/Clone-Wars
- **What it contributed**: UI/UX pattern reference library (100+ open-source clones).
- **Key patterns**: Before designing from scratch, check if a popular app already solved the UX. Categories: CRUD/dashboard, media/social, e-commerce, productivity, search.

## 10. Agent Reach
- **Repo**: `Panniantong/Agent-Reach`
- **URL**: https://github.com/Panniantong/Agent-Reach
- **What it contributed**: Multi-backend routing, default-safe installation, diagnostic command pattern, capability layer.
- **Key patterns**: Fallback chains (primary+backup, switch by reorder). Default read-only, --system for changes. Doctor command: test every channel, report current backend + fix. Don't wrap tools — select/install/diagnose/route.

## 11. Refine
- **Repo**: `refinedev/refine`
- **URL**: https://github.com/refinedev/refine
- **What it contributed**: Headless CRUD architecture, provider pattern, auto-gen UI, mutation invalidation.
- **Key patterns**: Decouple logic from UI/routing. Data/auth/access/i18n/router = swappable providers. Auto-generate list views from data shape. Mutations invalidate+refetch. Check permission before rendering action buttons.

## 12. OmniGet
- **Repo**: `tonhowtf/omniget`
- **URL**: https://github.com/tonhowtf/omniget
- **What it contributed**: Plugin architecture, queue reliability, portable mode, bundled deps, one-action UX, settings design.
- **Key patterns**: Plugins bundled, self-installing, self-updating. Resume interrupted work with backoff. SHA256 verify before execution. Global hotkey = one keystroke to result. Settings: grouped, searchable, hint under every control.

## 13. Awesome LLM Apps
- **Repo**: `Shubhamsaboo/awesome-llm-apps`
- **URL**: https://github.com/Shubhamsaboo/awesome-llm-apps
- **What it contributed**: 100+ AI agent templates — agent skills, multi-agent teams, RAG patterns, memory, generative UI, always-on agents.
- **Key patterns**: Self-improving skills. Advisor/Orchestrator/Worker teams. Corrective RAG (CRAG). Hybrid search+RRF. Chat-driven kanban. Scheduled scouts. Single-file starter: ship in 30 seconds.

## 14. CAI (Cybersecurity AI)
- **Repo**: `aliasrobotics/cai`
- **URL**: https://github.com/aliasrobotics/cai
- **What it contributed**: Agent-based security architecture, guardrails, kill-chain phases, ReACT model.
- **Key patterns**: Agents per kill-chain phase (recon, exploit, privesc, lateral, exfil, C2). Handoffs between agents. Agent-as-tool. Guardrails against prompt injection. Tool call limits per agent type.

## 15. Strix
- **Repo**: `usestrix/strix`
- **URL**: https://github.com/usestrix/strix
- **What it contributed**: Exploit validation, auto-fix PRs, compliance reporting, multi-agent pentesting.
- **Key patterns**: Every finding = working PoC, not false positive. SAST+DAST combined. AI-generated patches as PRs. Compliance reports (SOC 2, ISO 27001). Re-scan after fix to verify.

## 16. PentAGI
- **Repo**: `vxcontrol/pentagi`
- **URL**: https://github.com/vxcontrol/pentagi
- **What it contributed**: Multi-agent supervision, chain summarization, memory systems, knowledge graph.
- **Key patterns**: Execution monitoring: loop detection, auto-invoke mentor. Task planning: decompose into 3-7 steps. Chain summarization: preserve last section, QA pair compression. Memory: long-term/working/episodic + vector + graph.

## 17. PentestGPT
- **Repo**: `GreyDGL/PentestGPT`
- **URL**: https://github.com/GreyDGL/PentestGPT
- **What it contributed**: Multi-stage pipeline, session persistence, ReACT model, Pentesting Task Tree.
- **Key patterns**: Staged phases: recon→exploit→walkthrough (CTF) or discovery→vuln ID→report (pentest). Feed each stage's findings into next. Session save/resume. Three cooperating LLM sessions: reasoning/generation/parsing.

## 18. Vibe Kanban
- **Repo**: `BloopAI/vibe-kanban`
- **URL**: https://github.com/BloopAI/vibe-kanban
- **What it contributed**: Plan→Execute→Review workflow, workspace isolation, feedback loop, multi-agent orchestration.
- **Key patterns**: Kanban issues before code. Each workspace = worktree+terminal+dev server (isolated). Inline diff comments → agent iterates. Switch 10+ coding agents per workspace. Auto-cleanup worktree on merge.

## 19. Awesome DESIGN.md
- **Repo**: `VoltAgent/awesome-design-md`
- **URL**: https://github.com/VoltAgent/awesome-design-md
- **What it contributed**: DESIGN.md pattern (9 sections) + 73 real-world design language references.
- **Key patterns**: Plain-text design system AI agents read. 9 sections: theme, colors, typography, components, layout, depth, do's/don'ts, responsive, prompts. Markdown = free bytes (doesn't count toward size). AGENTS.md = how to BUILD, DESIGN.md = how it LOOKS.

## 20. OpenConnector
- **Repo**: `ConductionNL/openconnector`
- **URL**: https://github.com/ConductionNL/openconnector
- **What it contributed**: Source-target sync, data transformation, reverse proxy endpoints, event-driven architecture, rate limit handling, config portability.
- **Key patterns**: Hash-based change detection for incremental sync. Field mapping + template transforms + conditional logic. Reverse proxy with rule chaining. CloudEvents emit/consume. Rate limit detection + backoff. Config groups + OpenAPI JSON export/import.

---

## Summary by Category

| Category | Sources |
|---|---|
| Accessibility & Error Handling | #1 (Competition), #2 (claude-code-templates) |
| ADHD Output Formatting | #4 (i-have-adhd) |
| Token Compression | #5 (TencentDB), #6 (Caveman), #7 (RTK), #8 (Headroom) |
| Memory & Context | #5 (TencentDB), #8 (Headroom), #16 (PentAGI) |
| System Design | #10 (Agent Reach), #11 (Refine), #12 (OmniGet), #20 (OpenConnector) |
| UI/UX Reference | #9 (Clone Wars), #19 (Awesome DESIGN.md) |
| AI Agents & RAG | #13 (Awesome LLM Apps), #5 (TencentDB) |
| Security & Pentesting | #3 (Camoufox), #14 (CAI), #15 (Strix), #16 (PentAGI), #17 (PentestGPT) |
| Workflow & Orchestration | #18 (Vibe Kanban), #2 (claude-code-templates) |
| Data Integration | #20 (OpenConnector), #11 (Refine) |
