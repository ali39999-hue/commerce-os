# DEPENDENCY & LIBRARY ARCHITECTURE AUDIT (LIB-001 TO LIB-015)
## Dr Dermer UK Clinical & Commerce OS
**Date:** November 2, 2026  
**Standard:** Warm Clinical Minimalism Technology Stack (§16 & §17)

---

## 1. Executive Summary & Inventory Matrix (LIB-001)

An exhaustive audit of the workspace packages reveals the following dependency footprint:

| Workspace | Runtime Dependencies | Dev Dependencies & Tooling | Framework / Engine | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Root Monorepo** | None (Zero bloat) | `@types/node`, `turbo@2.5`, `typescript@5.7`, `@electric-sql/pglite` | Turbo Monorepo | **STABLE** |
| `packages/ui` | None (Pure React Primitives) | `@types/react@19`, `@types/react-dom@19`, `react@19.3.1`, `vitest@5.0` | React 19.3 + TypeScript | **PASS** |
| `apps/storefront` | `next@16.4.3`, `react@19.3.1`, `@commerce-os/domain`, `@commerce-os/localization` | `@axe-core/playwright`, `@playwright/test`, `@types/react@19`, `typescript` | Next.js 16 (Turbopack) | **PASS** |
| `apps/admin` | `next@16.4.3`, `react@19.3.1`, `@commerce-os/domain`, `@commerce-os/finance`, `@commerce-os/localization` | `@types/react@19`, `typescript` | Next.js 16 (Turbopack) | **PASS** |
| `packages/domain` | None | `vitest@3.2`, `typescript` | Pure TS Domain & Money | **PASS** |
| `packages/finance`| `@commerce-os/domain` | `vitest@3.2`, `typescript` | Pure TS Double-Entry | **PASS** |
| `packages/gateways`| `@commerce-os/domain` | `vitest@3.2`, `typescript` | Pure TS Gateway Adapters | **PASS** |

---

## 2. Technology Stack Selection & Decisions (LIB-002 to LIB-010)

Following the 23-section Blueprint (§16.1 & §16.21), the official technology decisions for Dr Dermer are locked as follows:

### A. UI Primitives & Assembly (LIB-002)
- **Decision:** Source-owned atomic primitives inside `@commerce-os/ui` (conforming to the shadcn/Base UI architectural philosophy).
- **Rule:** Do NOT mix Radix, Base UI, and React Aria simultaneously. Maintain pure, zero-runtime, highly accessible primitives with keyboard trap, focus-visible rings, and full WCAG 2.2 AA conformance.

### B. Iconography System (LIB-003)
- **Decision:** `lucide-react` is established as the single canonical icon system.
- **Rule:** Eliminate inconsistent emojis and fragmented inline SVG paths. Every clinical indicator, delivery cold-chain marker, certification checkmark, and navigation item must utilize unified Lucide icons with consistent 1.5px/2px stroke weight.

### C. Interaction, Motion & Physical Polish (LIB-007 & LIB-008)
- **Decision:** 
  1. `motion` (Motion for React 19) for smooth modal transitions, drawer animations, and layout flows.
  2. `embla-carousel-react` for responsive, touch-friendly product galleries and hardware 360-degree thumbnail reels.
- **Rule:** Respect `prefers-reduced-motion` across all routes. Avoid heavy parallax or scroll hijacking.

### D. Form Validation & Data Integrity (LIB-004 & LIB-005)
- **Decision:** `react-hook-form` + `zod` for all transactional and administrative forms (Checkout, B2B Quote, Contact, Receipts).
- **Rule:** Strict dual validation: client-side for immediate user feedback and server-side in domain contracts with Iranian National ID (Modulo-11) checksums.

### E. Admin ERP Tables & Telemetry (LIB-006)
- **Decision:** High-density, accessible tabular views using pure CSS Grid / flex and tabular numerals (`font-variant-numeric: tabular-nums`). For complex datasets, TanStack Table patterns are maintained.

---

## 3. Implementation Phasing
1. Install approved packages into `@commerce-os/ui` and `apps/storefront` while ensuring zero peer-dependency conflicts with React 19.
2. Standardize `@commerce-os/ui` components:
   - `Button` with Lucide icon slots and loading states.
   - `ProductGalleryCarousel` utilizing Embla Carousel.
   - `Modal` and `Drawer` powered by Motion.
3. Update storefront and admin screens to consume standard primitives.
4. Verify complete build and test suite passes.
