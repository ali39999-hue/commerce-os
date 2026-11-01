# REVIEW_PROTOCOL.md — QA Review Checklist & Peer Verification Protocol
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Code Review Protocol, QA Gates & Visual Verification

> **Core Standard**: Every pull request, subagent commit, or architectural modification must undergo formal review across six distinct verification pillars before landing on the main branch.
> **Anti-Slop Invariant**: Code review is not a rubber-stamp exercise. Every reviewer must verify physical rendering, accessibility trees, financial precision, and RTL bi-directional layouts.

---

## 1. Six-Pillar Review Matrix

```
+----------------------------------------------------------------------------------------------------+
|                                    SIX-PILLAR REVIEW CHECKLIST                                     |
+----------------------------------------------------------------------------------------------------+
  [1] Clinical & Physiological Rigor  --> Valid claims, real INCI, accurate Bohr physics
  [2] Anti-Slop & Visual Fidelity     --> Zero placeholder tropes, pixel-perfect glassmorphism
  [3] Architectural & Type Integrity  --> Strict TS, zero float money, no duplicate primitives
  [4] RTL & Internationalization       --> Logical CSS properties, Vazirmatn typography, Persian nums
  [5] Accessibility (WCAG 2.2 AA)     --> 4.5:1 contrast, visible focus rings, keyboard traps
  [6] Performance & Core Web Vitals   --> LCP < 2.0s, CLS < 0.05, 60fps canvas interaction
```

---

## 2. Granular Review Checklists

### Pillar 1: Clinical & Physiological Rigor
- [ ] Are all active ingredient claims backed by real CAS registries or UK cosmetic dossiers?
- [ ] Does the `BohrSimulator` adhere to physiological blood pH boundaries (pH 5.2 - 5.8)?
- [ ] Are contraindications clearly visible for chemical peels and retinoid regimens?
- [ ] Are medical device technical specifications (e.g. PlasmaX voltage, Carbox flow rate) medically authentic?

### Pillar 2: Anti-Slop & Visual Aesthetics
- [ ] Are there any generic placeholder images, gray rectangles, or `Lorem Ipsum` paragraphs? (Must be ZERO).
- [ ] Are color tokens sourced strictly from CSS variables (`var(--color-bg-base)`, `var(--color-teal-primary)`, etc.)?
- [ ] Is glassmorphism applied consistently with standard blur filters (`backdrop-filter: blur(16px)`) and subtle borders?
- [ ] Are animations functional micro-interactions rather than gratuitous visual distractions?
- [ ] Do all interactive elements have defined hover, active, focus, disabled, and loading states?

### Pillar 3: Architectural & Type Integrity
- [ ] Does the code compile with zero TypeScript warnings (`strict: true`) and zero `any` types?
- [ ] Are financial calculations (prices, VAT, discounts) strictly performed using `bigint` (Rials)?
- [ ] Is inventory management routed through the transactional reservation outbox pattern?
- [ ] Are reusable components imported from `@commerce-os/ui` rather than duplicated locally?
- [ ] Are client components marked with `'use client'` only where interactive state or browser APIs are required?

### Pillar 4: RTL & Internationalization (`fa-IR`)
- [ ] Is the document layout fully operable in RTL mode with `dir="rtl"`?
- [ ] Are layout margins, paddings, and absolute positions expressed with CSS Logical Properties (`margin-inline`, `padding-inline`, `inset-inline-start`)?
- [ ] Do directional icons (chevrons, back arrows, navigation progress) flip appropriately in RTL?
- [ ] Is the Vazirmatn font family applied with correct line-height (`1.7` to `1.85`) for Persian text readability?
- [ ] Are numbers in prices, tracking IDs, and countdown timers formatted using tabular figures (`font-variant-numeric: tabular-nums`)?

### Pillar 5: Accessibility & Assistive Tech (WCAG 2.2 Level AA)
- [ ] Does every interactive button and link have an accessible name (`aria-label` or visible text)?
- [ ] Is the color contrast ratio at least `4.5:1` for normal text and `3:1` for large text against dark obsidian surfaces?
- [ ] Are focus-visible indicators clearly noticeable (minimum 2px solid cyan/blue ring with 2px offset)?
- [ ] Do modal dialogs and slide-out drawers properly trap keyboard focus?
- [ ] Can the entire user journey be completed using only the keyboard (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`)?
- [ ] Do loading and dynamic status changes announce via `aria-live="polite"`?

### Pillar 6: Performance & Core Web Vitals
- [ ] Is Largest Contentful Paint (LCP) under `2.0 seconds` on standard 4G throttled connections?
- [ ] Is Cumulative Layout Shift (CLS) under `0.05` across all route transitions?
- [ ] Does the 360-degree interactive canvas maintain 60 frames per second during pointer scrubbing?
- [ ] Are product images properly sized with Next.js `<Image />`, using modern WebP/AVIF formats?
- [ ] Does `prefers-reduced-motion` disable non-essential animations and transitions?

---

## 3. Peer Review & Automated Gate Workflow

```
Developer / Subagent creates PR / commit
   |
   v
Automated CI Pipeline:
   - TypeScript Check (tsc --noEmit)
   - ESLint & Anti-Slop Rule Linter
   - Playwright E2E Suite Execution
   - Axe Core Accessibility Scans
   - Production Build (exit code 0)
   |
   +--> If CI Fails: Automatic Rejection, logs returned to subagent
   |
   v
Peer Reviewer / QA Agent:
   - Physical viewport inspection (Mobile 375px, Tablet 768px, Desktop 1440px)
   - Verification against Six-Pillar Checklist
   - Written sign-off in PR description
   |
   v
Lead Architect: Final merge approval
```

---

## 4. Review Comment Taxonomy

Reviewers must prefix review feedback with standardized severity tags:
- `[BLOCKER]`: Critical issue preventing release (e.g. TypeScript error, broken RTL layout, financial float calculation).
- `[SLOP]`: AI-generated fluff, fake claims, placeholder images, or broken design system tokens. Must be eliminated.
- `[A11Y]`: Accessibility violation violating WCAG 2.2 AA standards.
- `[PERF]`: Performance regression (e.g. unoptimized image, heavy re-render loop, CLS spike).
- `[NIT]`: Minor styling polish or code style suggestion (non-blocking).
