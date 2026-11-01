# AI-Driven Design System & UI/UX Consistency Engineering
# Dr Dermer UK Clinical Laboratories & Commerce OS Architecture

> **System Standard**: Enterprise Medical-Grade UI/UX Consistency & Clinical Design Engineering  
> **Target Monorepo**: `apps/storefront`, `apps/admin`, `apps/api`, `packages/ui`, `packages/domain`, `packages/localization`, `packages/finance`  
> **Governing Standards**: WCAG 2.2 Level AA, Anti-Slop System (Rules R-01 to R-40), Strict RTL-first Bi-directionality, Next.js 16 App Router & Turbopack.

---

## 1. Executive Mission & System Purpose

This directory serves as the **authoritative, single source of truth for UI/UX consistency engineering, clinical design system standards, component specifications, and agent execution governance** across the Dr Dermer UK Clinical & Commerce OS ecosystem.

### The Problem This Solves
In complex multi-agent engineering environments, independent agents frequently implement features that function in isolation but introduce subtle architectural and visual drift:
1. **Visual Fragmentation**: Inconsistent border radiuses, differing glassmorphic blur strengths, rogue hex values bypassing design tokens, and unstandardized elevation.
2. **Typography & Tabular Inconsistency**: Unaligned line-heights, improper font fallbacks, lack of Persian ligature support, and omission of `tabular-nums` leading to layout jitter during price, cart, and timer updates.
3. **Component Duplication**: Creating isolated inline components instead of reusing certified primitives from `packages/ui` or `components/interactive/`.
4. **Behavioral Divergence**: Divergent modal paradigms, mismatched mobile drawer animations, inconsistent keyboard trap mechanics, and broken focus rings.
5. **Anti-Slop Failures**: Inclusion of generic filler text, ungrounded marketing buzzwords, fake statistical indicators, decorative non-functional artifacts, and missing clinical data backing.

By formalizing this design system, all engineers and autonomous AI agents operate under **one unified design language and rigorous quality gates (`DESIGN.md`, `antislop.md`, and `AGENTS.md`)**.

---

## 2. Directory Architecture & Knowledge Map

The documentation hierarchy under `docs/ui-ux/` is organized into focused, modular domains:

```
docs/ui-ux/
├── README.md                      # This file: global system overview, governance, and operating manual
├── PRODUCT_CONTEXT.md             # Scientific foundation, brands (ReeSkin/ReeMed), dual-audience & regulatory specs
├── ARCHITECTURE.md                # Monorepo topology, Next.js 16 Turbopack, React 19 RSC/Client split, and data pipelines
│
├── audit/                         # Continuous repository inspection & inventory
│   ├── ROUTE_INVENTORY.md         # Exhaustive register of all 43 storefront routes, rendering modes, and active status
│   ├── COMPONENT_INVENTORY.md     # Atomic component catalog across storefront and @commerce-os/ui
│   ├── UI_INCONSISTENCIES.md      # Documented audit of potential UI discrepancies and how they are resolved
│   ├── RESPONSIVE_AUDIT.md        # Multi-viewport telemetry (375px, 768px, 1280px, 1440px), touch targets & canvas physics
│   └── ACCESSIBILITY_AUDIT.md     # WCAG 2.2 AA audit, contrast ratios, keyboard navigation, and RTL assertions
│
├── design-system/                 # The single source of truth for visual tokens
│   ├── DESIGN_PRINCIPLES.md       # Clinical authority, zero slop, bio-precision, and luxury British craft
│   ├── DESIGN_TOKENS.md           # CSS custom properties, variables, and z-index layers
│   ├── TYPOGRAPHY.md              # Vazirmatn scale, tabular figures, scientific notation, and RTL line-heights
│   ├── COLORS.md                  # Deep clinical obsidian, teal, violet, emerald palette & family semantics
│   ├── SPACING.md                 # 4px baseline grid, container widths, margins, and layout geometry
│   ├── MOTION.md                  # Easing curves, canvas 360 physics, dampening inertia, and reduced-motion queries
│   ├── RESPONSIVE_RULES.md        # Breakpoints, mobile sticky bottom bars, and tap target ergonomics
│   └── COMPONENT_STANDARDS.md     # Architectural contract for Button, Input, Card, Modal, Slider primitives
│
├── pages/                         # Formal contract per page and module
│   ├── HOME.md                    # Landing page specification & interactive modules
│   ├── LISTING.md                 # Search, facets, brand rails, empty states
│   ├── PRODUCT_DETAIL.md          # Clinical PDPs, VISIA before/after, INCI dossiers, dynamic regimen builder
│   ├── CART.md                    # 2-tier milestone progress, cross-sells, coupons, and cart drawer
│   ├── CHECKOUT.md                # 3-step checkout, National ID Modulo-11, Iranian mobile regex, payment methods
│   ├── CUSTOMER_DASHBOARD.md      # Account, digital grants, subscriptions, and order tracking timeline
│   └── MEDICAL_STATIONS.md        # Carbox & PlasmaX 360 hardware consoles
│
├── interactions/                  # Behavioral state machines & user flows
│   ├── USER_FLOWS.md              # B2C Patient, B2B Clinic, and Physician CME journeys
│   ├── INTERACTION_MATRIX.md      # Component states (hover, focus, active, disabled, loading)
│   ├── FORM_STATES.md             # Validation algorithms (Modulo-11, mobile 09xx, postal code)
│   ├── LOADING_STATES.md          # Skeletons, radial spinners, canvas progress bars
│   └── ERROR_STATES.md            # 404, network offline, API fallback, tax invoice failure
│
├── agents/                        # Multi-agent governance & collaboration rules
│   ├── AGENT_ROLES.md             # Division of labor across specialized agent profiles
│   ├── IMPLEMENTATION_RULES.md    # 8-step execution loop (Understand -> Inspect -> Review)
│   ├── REVIEW_PROTOCOL.md         # Peer QA audit checklist & verification gates
│   └── DEFINITION_OF_DONE.md      # Strict exit criteria (zero slop, build exit code 0)
│
├── testing/                       # Quality assurance, automated tests & visual baselines
│   ├── VISUAL_BASELINES.md        # Baseline screenshots, visual regression criteria
│   ├── PLAYWRIGHT_PLAN.md         # Automated browser testing across devices
│   ├── STORYBOOK_PLAN.md          # Component isolation testing roadmap
│   └── RELEASE_CHECKLIST.md       # Pre-deployment verification gates
│
└── roadmap/                       # Strategic roadmap & progress tracking
    ├── MASTER_ROADMAP.md          # 8-phase transformation plan
    ├── PHASES.md                  # In-depth phase breakdown
    ├── TASKS.md                   # Granular engineering task backlog
    └── PROGRESS.md                # Current live execution status
```

---

## 3. Operational Instructions for All Agents

Every engineer and AI agent operating within this repository must strictly adhere to the **Mandatory Execution Pipeline** defined in `AGENTS.md`:

```
   +-------------------------------------------------------------------------------+
   |                             MANDATORY AGENT WORKFLOW                          |
   +-------------------------------------------------------------------------------+
                                          |
                                          v
   [ 1. UNDERSTAND ] -> Read AGENTS.md, DESIGN.md, antislop.md, and docs/ui-ux/
                                          |
                                          v
   [ 2. INSPECT ]    -> Audit live routes, DOM hierarchies, styles, and terminal logs
                                          |
                                          v
   [ 3. COMPARE ]    -> Evaluate existing patterns against design tokens and anti-slop rules
                                          |
                                          v
   [ 4. PLAN ]       -> Establish atomic, test-backed execution stages
                                          |
                                          v
   [ 5. IMPLEMENT ]  -> Reuse shared design tokens (@commerce-os/ui) with clean RSC/Client split
                                          |
                                          v
   [ 6. VALIDATE ]   -> Run TypeScript typecheck, unit tests, and production build
                                          |
                                          v
   [ 7. DOCUMENT ]   -> Synchronize route/component registries and audit records
```

### Core Invariants & Rules of Engagement
1. **Never Reinvent Primitives**: Always inspect `packages/ui/src/` and `apps/storefront/components/` before creating a new component. If an accordion, slider, modal, or badge exists, compose or extend it.
2. **Never Mock Functional Business Logic**: Do not replace live cart dispatchers, atomic quote calculations (`calculateQuote`), or currency formatters with cosmetic placeholders.
3. **Preserve Tabular Numerical Alignment**: All prices in Iranian Rials / Tomans, inventory counters, percentage telemetry, and countdown timers must specify `font-variant-numeric: tabular-nums` to eliminate optical jitter.
4. **Enforce Touch Target Ergonomics**: Interactive targets must be at least 44x44 CSS pixels on desktop and 48x48 CSS pixels on mobile viewports (< 640px).
5. **Strict Anti-Slop Enforcement**: Zero ungrounded marketing hype. Every claim must correspond to clinical trial data, physiological literature (Bohr Effect, carbon dioxide transcutaneous partial pressure, microplasma ionization), or verifiable technical specifications.
6. **Absolute Path Rules**: When executing tools, inspections, and scripts, use absolute filesystem paths.
7. **No Colon Before Tool Calls**: Never output explanatory text ending with a colon before invoking a tool. Always terminate pre-tool commentary with a period.

---

## 4. Key Metrics & Health Indicators

| Metric Category | Target Standard | Current System State | Verification Mechanism |
| :--- | :--- | :--- | :--- |
| **Route Coverage** | 43 Prerendered & Dynamic Routes | 43 Routes Active & Verified | Next.js Build Prerender Manifest |
| **Accessibility** | WCAG 2.2 Level AA | 100% Core Contrast & Semantic Match | `axe-core`, automated contrast test |
| **Localization** | Dual Persian (fa-IR) + En-GB | Full bidirectional RTL support | `@commerce-os/localization` |
| **Typography** | Vazirmatn + Tabular Figures | Vazirmatn variable with tabular numerals | CSS font stack inspection |
| **Financial State** | Double-Entry Balanced Ledger | $\sum \text{Debit} \equiv \sum \text{Credit}$ | `scripts/verify-clinical-store.mjs` |
| **Build Integrity** | Zero TypeScript & Next.js Errors | Clean compilation across monorepo | `turbo run build` |

---

## 5. System Ownership & References

- **Organization**: Dr Dermer UK Clinical Laboratories (Software Engineering & UX Systems).
- **Core Platform**: Commerce OS Enterprise Multi-Tenant Monolith.
- **Reference Documentation**: `DESIGN.md`, `antislop.md`, `AGENTS.md`.