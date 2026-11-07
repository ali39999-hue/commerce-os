# AGENT_CONTEXT_PACK.md — Single Source of Truth for Engineering Agents (LIB-015)
## Dr Dermer UK Clinical & Commerce OS
**Standard:** Warm Clinical Minimalism (§16.17, §16.22, §17)

> **Mandatory Rule for All Agents**: Before reading, creating, or modifying any code in this repository, all agents must adhere to the rules, tokens, and architectural boundaries locked in this document.

---

## 1. Visual & Aesthetic Invariants (Warm Clinical Minimalism)

| Dimension | Specification | Locked Implementation |
| :--- | :--- | :--- |
| **Canvas Substrate** | 70%–80% light, warm, sterile stone | `--canvas: #f7f6f2`, `--surface: #ffffff` |
| **Typography** | Persian Vazirmatn with tabular numerals | `font-variant-numeric: tabular-nums` for all prices, doses, and timestamps |
| **Brand Identity** | Deep Clinical Teal & Forest Slate | `--brand: #24594f`, `--brand-deep: #17463e` |
| **Biological Accents**| Pale Sage & Warm Sand | `--sage: #dce8df`, `--sand: #ede5da` |
| **Luxury Accent** | Dermal Amber & Gold | `--accent: #c69c70` (Restricted to badges & VIP actions) |
| **Alerts & Warnings** | Clinical Red | `--danger: #b84d4d` (Real contraindications only) |
| **Dark Stages** | Restricted to Interactive Educational Simulators | Bohr-effect canvas, product sequence scrubbers (Obsidian stage `#172421` to `#0d1413`) |

---

## 2. Approved Libraries & Technology Matrix (§16)

| Layer | Canonical Selection | Prohibited Patterns |
| :--- | :--- | :--- |
| **Primitives** | Source-owned primitives in `@commerce-os/ui` | Mixing Base UI, Radix, and React Aria simultaneously |
| **Iconography** | `lucide-react` | Inconsistent emojis, arbitrary inline SVGs, mixed icon sets |
| **Carousel / Gallery**| `embla-carousel-react` | Installing Swiper alongside Embla |
| **Forms** | `react-hook-form` + `zod` | Unvalidated inputs, text-only national IDs without Mod-11 |
| **State** | TanStack Query (server), Zustand (client UI) | Duplicating server entities into multiple client stores |
| **Testing** | Vitest, Playwright, `@axe-core/playwright` | Skipping accessibility or responsive tests |

---

## 3. Mandatory Page & Route Contracts

1. **Homepage (`/`)**:
   - Single clear H1, Hero with 1 primary CTA, Path Selector (Home Care/ReeSkin vs Clinical Solutions/ReeMed).
2. **Product Detail Pages (PDP)**:
   - Above-the-fold purchase configurator with volume toggle (5x Home vs 500ml Pro).
   - Progressive disclosure for indications, step-by-step usage, active ingredients, full INCI, and contraindications.
   - Never delete scientific formulation data.
3. **Canonical Routing**:
   - Dedicated clinical routes (`/carboxygel`, `/carboxypod`, `/carboxypad`, `/crystalene`, `/healene`, `/silicalene`) must always resolve via `getCanonicalProductHref(slug)`.
4. **Admin ERP (`/admin`)**:
   - Operational groups including API-backed catalog authoring (`CatalogPimManager`) and server-backed section control (`StorefrontSectionsManager`), tabular numerals, live Outbox telemetry, and double-entry balanced ledger (`SUM(DEBIT) === SUM(CREDIT)`).

> **Note (2026-11-07)**: The B2B portal (`/b2b`), Partner Directory (`/vendors`) and Academy contracts were retired with the business pivot (ADR-013); legacy URLs redirect permanently.

---

## 4. Definition of Done (DoD) Verification Gates
- [x] Zero horizontal overflow on mobile viewports (`360px` and `390px`).
- [x] WCAG 2.2 AA compliance (text contrast >= 4.5:1, visible focus rings).
- [x] Monetary amounts strictly represented as `bigint` (zero floating-point float).
- [x] Monorepo clean build passes with 0 errors (`turbo run build`).
- [x] Complete test suite passes (`turbo run test` & `verify-clinical-store.mjs`).
