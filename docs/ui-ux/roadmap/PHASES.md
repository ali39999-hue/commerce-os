# PHASES.md — Detailed Breakdown of Transformation Phases 1 through 8
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Granular Phase Deliverables, Technical Contracts & Verification Gates

> **Core Standard**: Each of the 8 transformation phases represents a self-contained, verifiable milestone with strict inputs, architectural deliverables, and acceptance criteria.
> **Anti-Slop Invariant**: No phase may proceed to "Completed" status if any prerequisite phase has unresolved blocking items or failing tests.

---

## Phase 1: Foundations, Design Tokens & Audit Baseline

### 1.1 Objective & Scope
Establish the unified visual identity, CSS design tokens, Persian typography rules, and conduct a full inventory audit to purge legacy visual slop.

### 1.2 Key Deliverables
- **Design Tokens**: Standardized CSS variables in `packages/ui/src/styles/tokens.css`:
  - Canvas & glassmorphism: `--color-bg-base` (`#070b12`), `--color-bg-surface` (`#0c131f`), `--color-bg-glass` (`rgba(15,23,42,0.72)`).
  - Accents: `--color-teal-primary` (`#06b6d4`), `--color-plasma-purple` (`#8b5cf6`), `--color-emerald-green` (`#10b981`), `--color-amber-gold` (`#f59e0b`).
  - Text: `--color-text-primary` (`#f8fafc`), `--color-text-secondary` (`#94a3b8`).
- **Typography Engine**: Vazirmatn Persian font integration with tabular figures enabled by default (`font-variant-numeric: tabular-nums`).
- **Slop Purge**: Audit all 43 routes to remove `Lorem Ipsum`, mock reviews, gray placeholder boxes, and unverified medical claims.

### 1.3 Exit Gates
- [x] Zero hardcoded hex colors outside centralized token stylesheets.
- [x] `DESIGN.md` and `antislop.md` recognized as canonical sources of truth.
- [x] Audit report generated documenting legacy cleanup across storefront.

---

## Phase 2: Atomic Primitives & Form Verification Engine

### 2.1 Objective & Scope
Construct, test, and document accessible UI primitives in Storybook, and build the client-side Iranian statutory form validation engine.

### 2.2 Key Deliverables
- **Atomic UI Primitives**:
  - `Button`: Primary (Cyan gradient), Secondary (Glassmorphic), Ghost, Destructive variants with built-in loading spinner preservation.
  - `Modal` & `Drawer`: Focus-trapped accessible dialogs with frosted glass backdrops and smooth spring animations.
  - `Tabs` & `Accordion`: Full keyboard arrow-key navigation with `aria-selected` and `aria-expanded` attributes.
  - `Badge`: Clinical category tags, cold-chain markers, and volume discount indicators.
- **Iranian Form Validation Suite**:
  - Mobile phone validator (`09xx` regex, digit normalization, MCI/Irancell prefix recognition).
  - National ID validator (`کد ملی` with Modulo-11 checksum and repetitive sequence rejection).
  - Postal Code validator (10 digits, rejection of `0`/`2` in leading sorting digits).
  - Medical Council License validator (4-6 numerical digits with IRIMC prefix mapping).
  - Sheba bank account validator (ISO 7064 Mod 97-10 IBAN checksum).

### 2.3 Exit Gates
- [x] Storybook coverage for all primitives with `@storybook/addon-a11y` reporting 0 violations.
- [x] Unit test suite covering all Iranian validation algorithms passing with 100% boundary test coverage.

---

## Phase 3: Interactive Hardware Stages & Clinical Simulators

### 3.1 Objective & Scope
Deliver high-performance, double-buffered HTML5 canvas turntable scrubbers and physiological mathematical simulation engines.

### 3.2 Key Deliverables
- **360 Canvas Sequence Player (`CanvasSequencePlayer`)**:
  - Preloads 72 high-resolution medical device turntable frames (Carbox, PlasmaX).
  - Double-buffered offscreen rendering preventing frame flicker.
  - Pointer capture physics with kinetic inertia (friction factor: `0.92`).
  - Hotspot overlays dynamically pinned to frame rotation angles.
  - Keyboard navigation: Left/Right arrows rotate model by 1 frame (5 with Shift).
- **Physiological Bohr Effect Simulator (`BohrSimulator`)**:
  - Interactive range slider adjusting dermal tissue pH (5.2 - 5.8).
  - Real-time mathematical curve calculation for transcutaneous CO2 release and hemoglobin oxygen dissociation.
  - Accessible live region announcing current tissue oxygen saturation.

### 3.3 Exit Gates
- [x] 60 frames per second sustained performance during pointer scrubbing on desktop and mobile.
- [x] Preload buffer progress bar displayed during asset loading without layout shifts.

---

## Phase 4: Navigation, Header, Footer & Global Shell

### 4.1 Objective & Scope
Unify the global responsive shell, sticky navigation bars, mobile slide-out navigation, and clinical brand family directories.

### 4.2 Key Deliverables
- **Header (`ClinicalHeader`)**:
  - Glassmorphic translucent bar (`backdrop-filter: blur(16px)`).
  - Brand mega-menu with hierarchical access to ReeSkin, CarboxyGel, PlasmaX, Academy, and B2B.
  - Dynamic Cart counter with BigInt subtotal preview.
- **Mobile Navigation Drawer**:
  - RTL slide-out panel from screen edge.
  - Full keyboard focus trap and swipe-to-dismiss gesture.
- **Sticky Actions**:
  - Mobile sticky bottom cart bar (`StickyCartBar`) on PDP routes with price and single-tap checkout CTA.
- **Footer (`ClinicalFooter`)**:
  - Regulatory medical disclaimers, cold-chain transport notices, legal tax disclosures, and Enamad/Samandehi trust seals.

### 4.3 Exit Gates
- [x] Clean responsive reflow across 375px mobile, 768px tablet, and 1440px desktop.
- [x] Zero horizontal page overflow (`overflow-x: hidden`).

---

## Phase 5: Product Discovery, Filtering & Category System

### 5.1 Objective & Scope
Build the clinical product catalog, faceted filtering, concern-driven browsing, and search discovery experience.

### 5.2 Key Deliverables
- **Category Shell (`/c/[category]`)**:
  - Dedicated brand landing views for ReeSkin, CarboxyGel, Crystalene, and Silicalene.
  - Filter bar supporting multi-select: Skin Concern (Barrier Repair, Anti-Aging, Acne), Active Ingredient (Centella, CO2, Peptides), and Formulation Type.
- **Fitzpatrick Scale Matrix**:
  - Diagnostic selector matching formulations to patient phototypes (Types I through VI).
- **Faceted Search**:
  - Debounced search bar with instant autocomplete and INCI ingredient matches.

### 5.3 Exit Gates
- [x] Cumulative Layout Shift (CLS) <= 0.05 during filter changes.
- [x] URL query parameters seamlessly synchronized (`?concern=barrier&skin=type-3`).

---

## Phase 6: High-Fidelity Product Detail Pages (PDP) & INCI Dossier

### 6.1 Objective & Scope
Assemble clinical-grade PDPs combining 360 hardware stages, INCI ingredient dossiers, dosage instructions, and purchase controls.

### 6.2 Key Deliverables
- **PDP Layout (`/products/[handle]`)**:
  - Split-column layout on desktop: Left column 360 canvas / gallery; Right column clinical telemetry, pricing, and purchase controls.
- **INCI Formulation Explorer (`InciExplorer`)**:
  - Accordion list displaying full INCI roster with CAS registry numbers, concentrations, and biochemical function.
- **Clinical Protocol & Usage Guidelines**:
  - Step-by-step application instructions with iconography and contraindication warnings.
- **Volume Pricing Matrix**:
  - Tiered discount table for clinical bulk packs with real-time Rial savings calculation.

### 6.3 Exit Gates
- [x] 100% of product claims backed by real cosmetic safety dossiers.
- [x] WCAG 2.2 AA compliance verified on all PDP routes.

---

## Phase 7: Cart Drawer, Iranian Checkout & B2B Proforma Quote

### 7.1 Objective & Scope
Implement the fault-tolerant cart drawer, Iranian statutory checkout flow, Shaparak payment port handoff, and B2B official tax invoice generator.

### 7.2 Key Deliverables
- **Dynamic Cart Drawer**:
  - Real-time BigInt Rial calculation with item increment/decrement controls.
  - Free cold-chain shipping threshold progress indicator.
- **Iranian Checkout Flow (`/checkout`)**:
  - Integrated 09xx mobile and Modulo-11 National ID verification.
  - Postal code auto-lookup populating province and city.
  - Shaparak gateway selection (Saman, Mellat, Zarinpal) with UUID Idempotency Key header.
  - Card-to-Card receipt upload fallback with transaction tracing ID.
- **B2B Proforma Quote Generator (`/b2b/quote`)**:
  - Legal entity form capturing Iranian Company Economic Code and Sheba.
  - Sepidar ERP 10% official VAT calculation and downloadable official PDF proforma.

### 7.3 Exit Gates
- [x] Double-entry ledger balance verified (`SUM(DEBIT) === SUM(CREDIT)`).
- [x] Zero oversell inventory guarantee backed by outbox reservation worker.

---

## 8. Phase 8: Doctor CME Academy, LMS & Enterprise Digital Grants

### 8.1 Objective & Scope
Deploy the Continuing Medical Education (CME) portal for certified doctors and aesthetic practitioners with cryptographic certificate generation.

### 8.2 Key Deliverables
- **Academy Route (`/academy`)**:
  - Course catalog covering surgical microplasma resurfacing, carboxytherapy protocols, and laser safety.
- **Medical Credential Gating**:
  - Real-time IRIMC medical license number validation unlocking clinical course material.
- **LMS Video Player**:
  - High-bitrate surgical video streaming with signed time-limited tokens (TTL: 120m).
- **Cryptographic Certification**:
  - Automated post-assessment scoring (>= 85% passing grade).
  - High-resolution PDF certificate with embedded digital signature and verification QR code.

### 8.3 Exit Gates
- [x] Video stream URLs protected against unauthenticated hotlinking.
- [x] QR code verification endpoint (`/academy/verify/[certId]`) operational.

---

## 9. Phase 9: Agentic Design & Code Integration Architecture

### 9.1 Objective & Scope
Deploy multi-agent design-to-code assembly pipeline integrating Figma Canvas, Git Repository, MCP tooling, and 13 specialized operational skills.

### 9.2 Key Deliverables
- **Canonical Canvas & Code Authority**:
  - Figma Remote MCP (`https://mcp.figma.com/mcp`) established as official design canvas.
  - Git repository recognized as the absolute source of truth for code and domain logic.
- **Client MCP Configuration**:
  - Configured `.mcp.json` (Claude Code) and `.cursor/mcp.json` (Cursor) with Figma, Playwright, and Context7.
  - Developed `scripts/sync-skills.mjs` for deterministic synchronization between `.agents/skills/` and `.claude/skills/`.
- **13 Specialized Operational Skills**:
  - `drdermer-orchestrator`, `drdermer-repo-audit`, `drdermer-design-research`, `drdermer-figma-canvas`, `drdermer-design-system`, `drdermer-design-to-code`, `drdermer-frontend-implementation`, `drdermer-api-integration`, `drdermer-rtl-responsive`, `drdermer-visual-qa`, `drdermer-accessibility`, `drdermer-security-review`, `drdermer-release-gate`.
- **Pilot 01 Execution (Header + Homepage Hero + Audience Path Selector)**:
  - Audited, documented, and verified across all viewports (360px, 390px, 768px, 1280px, 1440px).
- **Quality & Reality Artifacts**:
  - `FEATURE_REALITY_MATRIX.md`, `BACKEND_COVERAGE.md`, `DESIGN_SYSTEM_STATUS.md`, `PILOT_01_AUDIT_AND_BRIEF.md`, `AGENTIC_INTEGRATION_ARCHITECTURE.md`, `PHASE_09_ACCEPTANCE_REPORT.md`.

### 9.3 Exit Gates
- [x] Figma Remote MCP, Playwright MCP, and Context7 MCP configured.
- [x] All 13 base skills implemented and synchronized (35 total skills).
- [x] RACI matrix and zero-collision file ownership locks documented.
- [x] Next.js production build passes with 0 errors across 46 routes.
- [x] 10/10 automated tests pass in `scripts/verify-clinical-store.mjs`.
- [x] 3/3 load tests pass with p95 <= 139ms in `scripts/load-check.mjs`.
- [x] Zero PII or credentials exposed in code or configurations.

