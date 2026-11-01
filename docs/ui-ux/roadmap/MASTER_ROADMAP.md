# MASTER_ROADMAP.md — 8-Phase Storefront UI/UX Transformation Overview
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Strategic UI/UX Master Transformation Roadmap

> **Core Standard**: This master roadmap governs the complete aesthetic, functional, and clinical transformation of the Dr Dermer UK storefront and Commerce OS frontend layer.
> **Anti-Slop Invariant**: No phase is considered complete without meeting the 6 Definition of Done (DoD) gates, visual diff approvals, and passing Playwright E2E suites.

---

## 1. Executive Summary & Transformation Vision

The Dr Dermer UK transformation elevates a traditional multi-tenant commerce engine into a luxury clinical-grade digital flagship. Across 43 web routes, the platform unites:
1. **Clinical Physiological Rigor**: Interactive transcutaneous CO2/O2 Bohr effect simulators, high-precision histology visualizers, and validated INCI ingredient dossiers.
2. **Interactive Medical Hardware Stages**: Double-buffered HTML5 canvas 360-degree rotation scrubbers for Carbox and PlasmaX surgical stations with frame-accurate hotspot telemetry.
3. **Frictionless Iranian E-Commerce**: Modulo-11 National ID checks, 09xx mobile phone normalization, Sheba validation, Shaparak payment port handoffs, and Sepidar B2B tax compliance.
4. **Luxury British Clinical Aesthetics**: Deep dark obsidian canvas (`#070b12`), frosted glassmorphic panels (`backdrop-filter: blur(16px)`), cyan/plasma energy accents, and typography tailored for Persian Vazirmatn and Latin scientific notation.

---

## 2. The 8 Transformation Phases

```
+----------------------------------------------------------------------------------------------------+
|                                      THE 8 TRANSFORMATION PHASES                                    |
+----------------------------------------------------------------------------------------------------+
  [PHASE 1] Foundations, Design Tokens & Audit Baseline
            --> Theme tokens, CSS variables, anti-slop rules, Vazirmatn typography, baseline audit
  [PHASE 2] Atomic Primitives & Form Verification Engine
            --> Button, Input, Modal, Drawer, Tabs, Iranian 09xx, National ID Modulo-11, Sheba
  [PHASE 3] Interactive Hardware Stages & Clinical Simulators
            --> 360 CanvasSequencePlayer, Bohr effect tissue oxygenation canvas, kinetic physics
  [PHASE 4] Navigation, Header, Footer & Global Shell
            --> Glassmorphic header, mega-menu brand families, RTL mobile drawer, sticky bars
  [PHASE 5] Product Discovery, Filtering & Category System
            --> Concern-based filtering, Fitzpatrick skin type matrix, faceted search, zero CLS
  [PHASE 6] High-Fidelity Product Detail Pages (PDP) & INCI Dossier
            --> Split stage PDP, interactive INCI accordion, clinical indications, volume matrix
  [PHASE 7] Cart Drawer, Iranian Checkout & B2B Proforma Quote
            --> Outbox inventory lock, Shaparak gateway handoff, double-entry ledger, Sepidar VAT
  [PHASE 8] Doctor CME Academy, LMS & Enterprise Digital Grants
            --> Medical license check, high-bitrate surgical video player, cryptographic certificate
```

---

## 3. High-Level Phase Timeline & Dependency Graph

```
Phase 1: Foundations ───► Phase 2: Atomic Primitives ───► Phase 3: Interactive Simulators
                                   │                                  │
                                   ▼                                  ▼
Phase 4: Global Shell ───► Phase 5: Catalog & Search ───► Phase 6: High-Fidelity PDP
                                                                      │
                                                                      ▼
Phase 8: Doctor CME Academy ◄─────────────────────────── Phase 7: Cart, Checkout & B2B
```

---

## 4. Phase Objectives, Scope & Deliverables

| Phase | Strategic Objective | Key Routes & Components | Quality & Verification Gates |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Establish design system invariants and eliminate legacy visual slop | `DESIGN.md`, `antislop.md`, CSS Variables, Tailwind config | Zero hardcoded hex colors, 100% token coverage |
| **Phase 2** | Deliver robust, accessible, Iranian-validated UI primitives | `@commerce-os/ui`, Button, Input, Modal, Drawer, PhoneMask | Modulo-11 unit tests, Storybook A11y 0 violations |
| **Phase 3** | Implement 60fps kinetic canvas scrubbers and physiological engines | `CanvasSequencePlayer`, `BohrSimulator`, `DoseSlider` | 60fps scrub performance, accurate blood pH math |
| **Phase 4** | Build responsive, glassmorphic global navigation and layout shell | Global `Header`, `Footer`, `MobileNavDrawer`, `Breadcrumbs` | Keyboard trap in drawer, sticky top/bottom fluidity |
| **Phase 5** | Create diagnostic, concern-driven product discovery and catalog | `/c/[category]`, `CategoryFilterBar`, `SkinConcernGrid` | Zero layout shift (CLS < 0.05), instant URL query sync |
| **Phase 6** | Assemble high-converting, clinical PDPs with INCI dossiers | `/products/[handle]`, `InciAccordion`, `StickyCartBar` | 4.5:1 text contrast, verified CAS ingredient specs |
| **Phase 7** | Execute fault-tolerant cart, Iranian checkout, and B2B proformas | `/cart`, `/checkout`, `/b2b/quote`, Shaparak handoff | BigInt Rial math, Idempotency keys, VAT breakdown |
| **Phase 8** | Launch accredited Doctor CME portal with verifiable digital grants | `/academy`, `/academy/[course]`, `CertVerifier` | IRIMC license check, signed streaming URLs, QR cert |

---

## 5. Architectural Quality Standards

1. **Accessibility (WCAG 2.2 AA)**: Every phase must pass automated Axe Core audits and maintain 4.5:1 text contrast against obsidian surfaces.
2. **Performance (Core Web Vitals)**: Target LCP < 2.0s, CLS < 0.05, and INP < 150ms across simulated 4G mobile networks.
3. **Financial Precision**: Rial monetary amounts must remain strictly typed as `bigint`, eliminating floating-point rounding errors.
4. **RTL First**: All components authored with CSS logical properties, supporting bidirectional layout without horizontal overflow.
