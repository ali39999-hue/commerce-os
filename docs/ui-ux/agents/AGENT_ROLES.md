# AGENT_ROLES.md — Multi-Agent Engineering Architecture & Specializations
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Agent Responsibilities, Boundaries & Operational Runbooks

> **Core Standard**: To ensure zero regression across 43 web routes, interactive 360-degree hardware stages, physiological simulators, and double-entry commerce ledgers, development tasks are partitioned into 7 specialized agent roles.
> **Anti-Slop Invariant**: Every agent operates within defined boundaries, with strict verification protocols, code ownership limits, and structured handoff artifacts.

---

## 1. Architectural Agent Taxonomy

```
+----------------------------------------------------------------------------------------------------+
|                                    LEAD ARCHITECT (COORDINATOR)                                    |
|                   Enforces System Invariants, Design Contracts & Release Approvals                  |
+----------------------------------------------------------------------------------------------------+
                                                  |
         +----------------------------------------+---------------------------------------+
         |                                        |                                       |
         v                                        v                                       v
[ 1. AUDIT AGENT ]                      [ 2. DESIGN SYSTEM AGENT ]              [ 3. COMPONENT AGENT ]
- Route inventory inspection             - Token architecture                    - UI primitive creation
- Visual regression checks               - CSS Variables & Glassmorphism         - React / Next.js implementation
- Slop & placeholder detection           - RTL bidirectionality                  - Zero layout shift enforcement
         |                                        |                                       |
         +----------------------------------------+---------------------------------------+
                                                  |
         +----------------------------------------+---------------------------------------+
         |                                        |                                       |
         v                                        v                                       v
[ 4. PAGE ARCHITECT AGENT ]             [ 5. INTERACTION & PHYSICS ]            [ 6. QA & VERIFICATION ]
- 43 Page contracts & layout             - 360 CanvasSequencePlayer              - Playwright E2E suites
- Next.js App Router orchestration       - Bohr Effect & range physics           - Lighthouse & Core Web Vitals
- Data fetching & Suspense               - Persian form validation & Modulo-11   - WCAG 2.2 AA accessibility audit
```

---

## 2. Granular Role Specifications

### 2.1 Lead Architect (Coordinator)
- **Primary Mission**: Maintains system coherence, guards architectural invariants (ADR-001 through ADR-012), arbitrates conflict between aesthetics and performance, and approves release readiness.
- **Key Responsibilities**:
  - Review all proposed changes against `DESIGN.md` and `antislop.md`.
  - Ensure zero financial float representation (BigInt Rial standard).
  - Verify that no duplicate components are introduced.
- **Handoff Artifacts**: Master Roadmap updates, Phase checklists, Architectural Decision Records.

### 2.2 Audit Agent (Codebase & Asset Inspector)
- **Primary Mission**: Deep inspection of existing code, unused assets, broken route links, hardcoded strings, and UI slop.
- **Key Responsibilities**:
  - Run static analysis scans across `apps/storefront` and `packages/ui`.
  - Scan for mock data leaks, `Lorem Ipsum`, placeholder images, and generic AI buzzwords.
  - Audit Persian typography usage, ensuring standard Vazirmatn ligature rendering.
- **Handoff Artifacts**: `AUDIT_REPORT.md`, route health matrix, asset inventory.

### 2.3 Design System Agent (Tokens & Foundations)
- **Primary Mission**: Owns the design tokens, CSS variables, typography scales, spacing grids, and glassmorphic elevation layers.
- **Key Responsibilities**:
  - Maintain `packages/ui/src/styles/` and Tailwind configuration.
  - Ensure RTL logical property consistency across all containers (`dir="rtl"`).
  - Manage color harmonies: Deep Obsidian (`#070b12`), Cyan (`#06b6d4`), Plasma Violet (`#8b5cf6`), Emerald (`#10b981`), Amber (`#f59e0b`).
- **Handoff Artifacts**: Design token updates, Storybook token previews, CSS utility classes.

### 2.4 Component Agent (Atomic Primitives)
- **Primary Mission**: Builds, tests, and documents atomic and molecular UI components (`@commerce-os/ui`).
- **Key Responsibilities**:
  - Implement accessible Button, Input, Modal, Drawer, Tabs, Badge, and Card primitives.
  - Ensure strict TypeScript typing and zero `any` declarations.
  - Implement focus-visible rings, touch targets (>= 44px), and keyboard trap logic.
- **Handoff Artifacts**: Storybook component stories, component unit tests (`.test.tsx`), TypeScript exports.

### 2.5 Page Architect Agent (Route Orchestrator)
- **Primary Mission**: Assembles full-page layouts, Server Components, client boundaries, metadata, and OpenGraph clinical tags across all 43 routes.
- **Key Responsibilities**:
  - Maintain page contracts in `docs/ui-ux/pages/`.
  - Implement Next.js App Router patterns with streaming Suspense.
  - Connect presentation components to backend microservices, Cart state, and B2B quote engines.
- **Handoff Artifacts**: Page route files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`), route verification logs.

### 2.6 Interaction & Physics Agent (Sensory & Telemetry Architect)
- **Primary Mission**: Crafts high-fidelity interactive experiences: double-buffered 360-degree canvas scrubbers, physiological Bohr Effect simulators, and Iranian input validation.
- **Key Responsibilities**:
  - Develop `CanvasSequencePlayer` with frame interpolation and kinetic inertia.
  - Build real-time dermal penetration and transcutaneous CO2 simulators.
  - Implement Iranian National ID (Modulo-11), Mobile (`09xx`), and Sheba bank validators.
- **Handoff Artifacts**: Math/physics hooks (`useInertiaScrubber`, `useBohrEffect`), input mask utilities.

### 2.7 QA & Verification Agent (The Gatekeeper)
- **Primary Mission**: Validates that every commit meets the Definition of Done (DoD), passes automated tests, and achieves visual perfection.
- **Key Responsibilities**:
  - Write and maintain Playwright E2E browser tests across Mobile (375px), Tablet (768px), and Desktop (1440px).
  - Run accessibility audits via Axe Core / WCAG 2.2 AA.
  - Audit Core Web Vitals (LCP < 2.0s, CLS < 0.05, INP < 150ms).
- **Handoff Artifacts**: Playwright test reports, visual regression diffs, automated audit certifications.

---

## 3. Inter-Agent Collaboration & Handoff Protocol

```
+---------------------------------------------------------------------------------------+
|                                    AGENT HANDOFF PIPELINE                             |
+---------------------------------------------------------------------------------------+
Audit Agent: Discovers issue / requirement -> Documents in Task Backlog
   |
   v
Design System / Lead Architect: Approves tokens & architectural contract
   |
   v
Component Agent: Builds reusable primitive -> Adds Storybook story & unit test
   |
   v
Interaction Agent: Implements physics / canvas / mathematical calculation hooks
   |
   v
Page Architect: Assembles full route, integrates Suspense & metadata
   |
   v
QA Agent: Executes Playwright E2E, Axe a11y, and Visual Diff -> Signs off for Release
```

---

## 4. Conflict Resolution & Authority Hierarchy

1. **Design vs. Performance**: If an elaborate glassmorphic or 3D visual causes frame drops below 60fps on mobile or LCP > 2.5s, **Performance wins**. The visual must be downgraded or progressively enhanced.
2. **Clinical Accuracy vs. Marketing**: If marketing copy conflicts with dermatological science or UK cosmetic safety dossiers, **Clinical Accuracy wins**.
3. **Speed vs. Financial Integrity**: Ledger balances, inventory reservation outboxes, and tax invoice calculations must **never** be mocked or shortcutted for visual expediency.
