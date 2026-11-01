# IMPLEMENTATION_RULES.md — The 8-Step Engineering Execution Cycle
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Mandatory Agent Execution Workflow & Quality Loop

> **Core Standard**: Every modification, refactoring, or feature addition to Dr Dermer UK must execute strictly through the 8-Step Quality Cycle.
> **Anti-Slop Invariant**: No blind edits, no speculative code generation without inspection, and no undocumented changes. Every step produces verifiable evidence before progressing.

---

## 1. Overview of the 8-Step Quality Cycle

```
  (1) UNDERSTAND  -->  (2) INSPECT  -->  (3) COMPARE  -->  (4) PLAN
         ^                                                   |
         |                                                   v
     (8) REVIEW   <--  (7) DOCUMENT <--  (6) VALIDATE <--  (5) IMPLEMENT
```

---

## 2. Granular Step Protocol & Execution Gates

### Step 1: Understand (Context & Clinical Purpose)
- **Objective**: Internalize the clinical, commercial, and technical requirements before writing a single line of code.
- **Mandatory Actions**:
  1. Read the assigned task specification and related user stories.
  2. Consult `AGENTS.md`, `DESIGN.md`, `antislop.md`, and relevant ADRs (`ADR-001` to `ADR-012`).
  3. Identify user archetype (Patient Home Care, Clinic B2B, or Doctor CME).
  4. Note relevant physiological concepts (e.g. Bohr effect, transcutaneous CO2 diffusion, Fitzpatrick skin types).
- **Exit Gate 1**: Clear mental or written summary of what must be built and why.

### Step 2: Inspect (Repository & Environment Baseline)
- **Objective**: Examine existing implementations, dependencies, and runtime state.
- **Mandatory Actions**:
  1. Search codebase for existing components that can be reused (`grep`, `find`, or file search).
  2. Inspect the current route files, layout wrappers, and API route handlers.
  3. Verify current git status and ensure working tree is clean.
  4. Check runtime errors or warnings in terminal logs.
- **Exit Gate 2**: Documented list of existing files, reusable components, and potential blast radius.

### Step 3: Compare (Anti-Slop & Design System Audit)
- **Objective**: Benchmark current state against the single source of truth in `DESIGN.md`.
- **Mandatory Actions**:
  1. Compare existing color tokens against the standardized palette (Obsidian, Cyan, Plasma, Emerald, Amber).
  2. Check typography against Vazirmatn scale and tabular numerals requirement.
  3. Identify any layout shifts, non-semantic HTML tags, or missing ARIA roles.
  4. Scan for UI slop: placeholder images, fake reviews, decorative filler text.
- **Exit Gate 3**: Precise delta list of discrepancies to eliminate.

### Step 4: Plan (Architectural Blueprint & Task Breakdown)
- **Objective**: Construct a granular, step-by-step technical plan before mutating files.
- **Mandatory Actions**:
  1. Define component interface contracts (TypeScript types, props, events).
  2. Detail state management strategy (Server vs. Client components, Suspense boundaries).
  3. Specify responsive layout adaptation (Mobile 375px to Desktop 1440px).
  4. Draft exact test cases for validation.
- **Exit Gate 4**: Approved plan with explicit files to modify and sequential execution steps.

### Step 5: Implement (Precision Engineering)
- **Objective**: Execute code changes adhering to zero-slop and clinical rigor.
- **Mandatory Actions**:
  1. Use existing components from `@commerce-os/ui` whenever possible.
  2. Write clean, idiomatic TypeScript with strict type safety.
  3. Enforce RTL logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline`).
  4. Implement keyboard traps, focus rings, and accessible names.
  5. Never delete functional logic to replace it with superficial mock visuals.
- **Exit Gate 5**: Completed code implementation across all targeted files.

### Step 6: Validate (Automated Testing & Build Verification)
- **Objective**: Verify that code compiles cleanly and passes all test suites.
- **Mandatory Actions**:
  1. Run TypeScript typecheck: `pnpm --filter @commerce-os/storefront run type-check` or `pnpm tsc`.
  2. Run production build: `pnpm --filter @commerce-os/storefront run build` (must exit with code `0`).
  3. Run component unit tests: `pnpm test`.
  4. Execute Playwright E2E tests for affected user journeys.
  5. Inspect rendered output across 375px mobile and 1440px desktop viewports.
- **Exit Gate 6**: Zero build errors, zero test failures, zero console warnings.

### Step 7: Document (Knowledge Capture & Inventory Sync)
- **Objective**: Update platform documentation to reflect the new state.
- **Mandatory Actions**:
  1. Update relevant page contract in `docs/ui-ux/pages/`.
  2. Update interaction matrices or form validation documentation if new primitives were added.
  3. Log progress in `docs/ui-ux/roadmap/PROGRESS.md` and mark backlog items in `TASKS.md`.
  4. Document any new design tokens or component props.
- **Exit Gate 7**: Synchronized documentation reflecting exact codebase state.

### Step 8: Review (Peer Audit & Architectural Sign-Off)
- **Objective**: Final sanity check by the Lead Architect / QA Agent.
- **Mandatory Actions**:
  1. Run `git diff` to ensure no accidental debug logs, comments, or temporary files remain.
  2. Validate against `REVIEW_PROTOCOL.md` and `DEFINITION_OF_DONE.md`.
  3. Verify Persian typography rendering and numbers formatting.
  4. Sign off on release gate readiness.
- **Exit Gate 8**: Signed-off release candidate ready for commit and deployment.

---

## 3. Strict Prohibitions (Zero Tolerance)

1. **No Gold-Plating**: Do not add speculative features or unrequested animations outside the task contract.
2. **No Half-Done Work**: Never leave `// TODO: implement later` comments in production pathways.
3. **No Decorative Placeholders**: Every visual asset must be an authentic clinical diagram, real product image, or validated 3D turntable frame.
4. **No Financial Float Operations**: Always compute financial totals in BigInt Rials; never use floating point arithmetic for prices or discounts.
