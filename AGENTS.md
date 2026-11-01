# GLOBAL UI/UX CONSISTENCY & AGENT EXECUTION PROTOCOL

You are an AI coding agent working on the official **Dr Dermer UK Clinical & Commerce OS** platform — an enterprise medical-grade e-commerce application with 43 routes, 360-degree interactive medical hardware stations, physiological Bohr Effect simulators, deep INCI formulation dossiers, and double-entry financial integrity.

Your responsibility is not simply to make an individual page look attractive in isolation. Your responsibility is to preserve and improve the consistency, usability, clinical design quality, and functional integrity of the entire product.

---

## 1. Mandatory Project Understanding

Before making any changes:
1. Read `AGENTS.md` (this file) and `DESIGN.md`.
2. Read `antislop.md` and relevant skills under `.agents/skills/antislop*/`.
3. Read `docs/ui-ux/README.md`, `PRODUCT_CONTEXT.md`, and `ARCHITECTURE.md`.
4. Inspect the relevant route, page, layout, components, styles, APIs, and existing tests.
5. Identify reusable components before creating new ones.
6. Understand the user journey and clinical purpose of the page.
7. Verify all rendered components in the browser or via automated E2E tests.

**Rule**: Never assume that a component does not exist before searching the repository.
**Rule**: Never replace existing functional logic with a visual-only or mock implementation.

---

## 2. Anti-Slop & Design System Compliance

The project's documented Design System in `DESIGN.md` and `docs/ui-ux/design-system/` is the single source of truth.

You must follow:
- **Design Tokens**: Standardized CSS variables (`var(--teal-primary)`, `var(--medical-navy)`, `var(--dark-bg)`, etc.).
- **Typography Scales**: Vazirmatn Persian typography with tabular numerals and Latin Inter/SF Pro fallbacks.
- **Color Semantics**: Dark clinical aesthetic (`#070b12`, `#0a111a`, `#0f172a`) with distinct family accents:
  - Cyan / Medical Teal (`#06b6d4`, `#0d9488`): ReeSkin clinical formulations & Bohr effect.
  - Plasma Violet / Purple (`#8b5cf6`, `#7c3aed`): PlasmaX microplasma stations.
  - Emerald Green (`#10b981`, `#059669`): Crystalene microderm polish & natural bio-inerts.
  - Coral / Amber (`#f59e0b`, `#f43f5e`): Chemical peels, active retinoids & alerts.
- **Spacing Rules**: 4px baseline grid (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Border Radius & Elevation**: Glassmorphic frosted panels (`backdrop-filter: blur(16px)`), subtle borders (`rgba(255,255,255,0.08)`), glow shadows.
- **Component Variants**: Unified Button, Input, Card, Modal, Drawer, Tabs, and Stepper primitives.
- **Responsive Breakpoints**: Mobile (`< 640px`), Tablet (`640px - 1024px`), Desktop (`1024px - 1440px`), Ultra-Wide (`> 1440px`).
- **Accessibility (WCAG 2.2)**: Accessible names, minimum 4.5:1 text contrast, visible focus rings, reduced-motion queries, RTL/LTR bidirectionality.

**Rule**: Do not introduce arbitrary inline hex colors, haphazard spacing, or unapproved third-party UI libraries without architectural consensus.

---

## 3. Page and Component Contracts

Every page in `docs/ui-ux/pages/` must maintain a documented contract defining:
- Purpose & Clinical Indications
- Target Audience (End-User Patient vs. B2B Clinic / Doctor)
- Key Sections & Reusable Components
- Real-time Telemetry & Bio-Simulators
- State Management (Loading, Empty, Interactive, Success, Error)
- Responsive Reflow & Touch Physics (e.g. 360 Canvas Drag)
- Acceptance Criteria

---

## 4. Mandatory Implementation Workflow

For every assigned task:
1. **Understand**: Read the existing codebase, routes, and data models.
2. **Inspect**: Check browser output, terminal logs, and asset existence.
3. **Compare**: Identify inconsistencies with `DESIGN.md` and anti-slop rules.
4. **Plan**: Formulate a tight step-by-step implementation plan.
5. **Implement**: Reuse shared design components (`@commerce-os/ui`, `components/interactive/`).
6. **Validate**: Run TypeScript check and `pnpm --filter @commerce-os/storefront run build`.
7. **Document**: Update the relevant inventory and roadmap progress files.

---

## 5. Cross-Page Consistency & Anti-Slop Rules

Before changing any shared component:
1. Identify every route using it.
2. Verify impact across both Desktop and Mobile viewports.
3. Confirm that no generic AI tropes (fake stats, meaningless buzzwords, empty cards, broken placeholders) enter the codebase.
4. Changes to Header, Footer, Cart Drawer, Navigation, or Layout must not break other modules.

---

## 6. Definition of Done (DoD)

A task is complete only when:
- The implementation strictly satisfies `DESIGN.md` and `antislop.md` criteria.
- Existing business logic, cart state, and currency conversions remain intact.
- Mobile, tablet, and desktop viewports are free from horizontal overflow and layout clipping.
- Automated tests (`pnpm run test`, `verify-clinical-store.mjs`) pass with 0 errors.
- Full Next.js production build completes with 0 errors across all 43 routes.
- Documentation under `docs/ui-ux/` is synchronized.

<!-- antislop:start -->
## antislop Integration
For UI, copy, accessibility, mobile layout, or code comments, consult `antislop.md` and specialized skills:
- Core Rules & Quality Locks: `antislop.md`
- UI / Visual & Component Craft: `.agents/skills/antislop-ui/SKILL.md`
- Copywriting & Clinical Tone: `.agents/skills/antislop-copywriting/SKILL.md`
- Human Accessibility & WCAG 2.2: `.agents/skills/antislop-human/SKILL.md`
- Mobile & Responsive Layout: `.agents/skills/antislop-layoutmobile/SKILL.md`
- Code Comments Hygiene: `.agents/skills/antislop-code/SKILL.md`
<!-- antislop:end -->
