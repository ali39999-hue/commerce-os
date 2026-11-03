# Dr Dermer UK Clinical & Commerce OS — Claude Code Runtime Protocol

You are operating within the official **Dr Dermer UK Clinical & Commerce OS** platform.

## Mandatory Architectural Directives
1. **Always read `AGENTS.md` before executing any task.**
   - All rules in `AGENTS.md`, `DESIGN.md`, and `antislop.md` are binding and strict.
2. **Phase 09 Multi-Agent Protocol**:
   - Figma is the canonical visual canvas (`https://mcp.figma.com/mcp`).
   - Git repository is the absolute code source of truth.
   - Storybook & `@commerce-os/ui` define canonical implemented components.
   - MCP tools grant external capabilities, but work must follow rigorous Skill specifications.
3. **Execution Pipeline (Gates 0 to 8)**:
   - Gate 0: Intake & Audit (Route, Component, and API verification)
   - Gate 1: Clinical UX Brief
   - Gate 2: Canvas Draft (Variables, Auto-layout, RTL, and Dark Clinical tokens)
   - Gate 3: Human Design Approval (Mandatory check before deep frontend implementation)
   - Gate 4: Contract & Component Mapping
   - Gate 5: Vertical Slice Implementation
   - Gate 6: QA, Playwright verification, and A11y
   - Gate 7: PR Review & Acceptance
   - Gate 8: Controlled Release
4. **Skills Location**:
   - Canonical skills live in `.agents/skills/`.
   - Synchronized for Claude Code in `.claude/skills/`.
   - Run `node scripts/sync-skills.mjs` whenever skills are updated.
