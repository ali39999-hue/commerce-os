# ARCHITECTURE.md
# Technical Design & Monorepo Architecture
# Dr Dermer UK Clinical Laboratories & Commerce OS Platform

> **System Scope**: Full-Stack Monorepo Topology, Next.js 16 App Router, React 19 RSC/Client Split, Shared Packages, and Data Pipelines  
> **Repository Root**: `C:\Users\talas\OneDrive\Desktop\shop`  
> **Key Architecture Invariants**: Zero-Float Monetary Math (`BigInt` Rials), Double-Entry Accounting ($\sum \text{Debit} \equiv \sum \text{Credit}$), Deterministic Inventory Leasing, Strict Client/Server Component Boundary Isolation.

---

## 1. Monorepo Topology & Package Ecosystem

The Commerce OS codebase is orchestrated as a high-performance **Turborepo 2.5+ / pnpm 12** workspace, decoupling presentation apps from domain and infrastructure packages:

```
shop/
├── apps/
│   ├── storefront/             # Next.js 16.4.3 (Turbopack, App Router, React 19)
│   ├── admin/                  # Next.js 16.4.3 Admin ERP & Order Desk
│   ├── api/                    # NestJS 11 Core API + Prisma ORM 7.10.1 (PostgreSQL / PGlite)
│   └── worker/                 # Standalone Node/TypeScript asynchronous job & outbox worker
│
├── packages/
│   ├── domain/                 # Core domain models: Money, PricingQuote, Cart, Order, Discounts
│   ├── finance/                # Double-entry ledger engine, Chart of Accounts, Sepidar/Moadian tax rules
│   ├── gateways/               # Payment gateways (Saman SEP, Parsian TOP, ZarinPal, Card-to-Card)
│   ├── localization/           # Persian typography, Jalali calendar, Toman/Rial math, Modulo-11 validators
│   ├── security/               # SSRF protection, CORS allowlist, Helmet headers, PII masking, token crypto
│   └── ui/                     # Design tokens, atomic UI primitives, accessible dialogs, sliders
│
├── docs/                       # Architectural decisions (ADRs), UI/UX specifications, API contracts
├── scripts/                    # Clinical verification test runners, DB seeding, migration tools
└── .agents/skills/             # Curated agent skills: anti-slop, WCAG, domain analysis, performance
```

### Shared Package Dependencies Matrix

```
                     ┌──────────────────────────────────────────────┐
                     │            apps/storefront (Next 16)         │
                     └───────┬──────────────┬─────────────┬─────────┘
                             │              │             │
                             ▼              ▼             ▼
                     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
                     │ @packages/ui │ │@packages/doma│ │@packages/loca│
                     └──────────────┘ └──────┬───────┘ └──────────────┘
                                             │
                             ┌───────────────┴───────────────┐
                             ▼                               ▼
                     ┌──────────────┐                ┌──────────────┐
                     │@packages/fina│                │@packages/secu│
                     └──────────────┘                └──────────────┘
```

1. **`@commerce-os/domain`**:
   - `Money`: Immutable value object wrapping integer Rials using `BigInt`. Guaranteed zero-float rounding errors.
   - `calculateQuote()`: Central calculation engine handling tiered volume discounts, coupon constraints, VAT (10%), and shipping fees.
   - `Cart & Order Models`: State machines for checkout sessions, line items, and fulfillment states.
2. **`@commerce-os/finance`**:
   - `CHART_OF_ACCOUNTS`: Strict Persian accounting chart (1001 Cash, 1101 Accounts Receivable, 2101 Output VAT, 4101 Sales Revenue).
   - `createOrderSaleJournal()`: Generates balanced multi-leg double-entry transactions.
   - `validateBalancedJournal()`: Hard invariant: $\sum \text{Debit} \equiv \sum \text{Credit}$.
3. **`@commerce-os/localization`**:
   - Bi-directional formatting for Iranian Rials and Tomans (`formatRialsAsTomans`).
   - Phone regex validation (`validateIranianMobile`: `09[0-9]{9}`).
   - National Identification Modulo-11 checksum validation (`validateIranianNationalId`).
   - Persian text normalization and Arabic-to-Persian character unification.
4. **`@commerce-os/security`**:
   - Real-time PII sanitization for application logs.
   - Strict Content Security Policy (CSP), anti-clickjacking headers, and cryptographic signature validation.
5. **`@commerce-os/ui`**:
   - Component library engineered with clinical glassmorphism and WCAG 2.2 Level AA accessibility (`Button`, `Input`, `Card`, `Modal`, `Drawer`, `Tabs`, `BeforeAfterSlider`, `InteractiveHotspot`).

---

## 2. Storefront App Architecture (Next.js 16 App Router & Turbopack)

The storefront application (`apps/storefront`) leverages Next.js 16 with the Turbopack engine and React 19, maximizing initial page delivery speed while isolating stateful interactivity.

### 2.1 Server Component vs. Client Component Architecture
To ensure optimal Core Web Vitals (Largest Contentful Paint < 1.2s, Cumulative Layout Shift < 0.05), all routes default to **React Server Components (RSC)**:

```
[ HTTP Request: /products/carboxygel ]
                 │
                 ▼
+─────────────────────────────────────────────────────────────+
| React Server Component (app/products/[slug]/page.tsx)       |
| • Asynchronously reads catalog & PIM metadata               |
| • Injects MedicalScholarlyArticle & Product JSON-LD         |
| • Renders static semantic HTML (<main>, <article>, <header>)|
+──────────────────────────────┬──────────────────────────────+
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
+──────────────────────────────+    +──────────────────────────────+
| Client Boundary: 360 Viewer  |    | Client Boundary: Cart & PDP  |
| ('use client' in interactive)|    | ('use client' in pdp-interact|
| • CanvasSequencePlayer       |    | • VariantSelector & Pricing  |
| • Double-buffered RAF loop   |    | • InciExplorer Drawer        |
| • Touch / Mouse drag physics |    | • BohrOxygenationSimulator   |
| • Hotspot coordinate mapping |    | • StickyCartBar & Add-to-Cart|
+──────────────────────────────+    +──────────────────────────────+
```

### 2.2 Hydration Boundary Invariants
1. **Zero Layout Shift Hydration**: Client components must maintain identical server-rendered fallback dimensions (`min-height` and aspect ratio locks) before client hydration completes.
2. **No Data Refetching on Mount**: Props passed from Server Components to Client Components serve as the initial state. Client hooks (`useState`, `useReducer`) synchronize with local storage or optimistic UI without triggering redundant HTTP waterfalls.
3. **Lazy Subsystem Loading**: Complex 3D canvas renderers and modal drawers are code-split and loaded on demand or upon viewport entry.

---

## 3. Data Flow & PIM/DAM Metadata Integration

The product catalog unifies pharmaceutical PIM (Product Information Management) with high-resolution DAM (Digital Asset Management) media streams:

```
+─────────────────────────────────────────────────────────────────────────────+
|                           CENTRAL PIM / DAM CATALOG                         |
+─────────────────────────────────────────────────────────────────────────────+
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     ▼                                 ▼                                 ▼
[ Pharmacological Dossier ]    [ Clinical Trial Telemetry ]    [ 360 DAM Asset Arrays ]
• INCI Ingredient Registry     • VISIA Skin Analysis           • 72-frame turntable renders
• CAS Numbers & Purity         • Tewameter TEWL data           • WebP / AVIF compressed
• pH & Osmolality range        • Transcutaneous pO2 metrics    • Hotspot normalized vectors
• Batch & Cold-Chain Rules     • Scientific reviewer metadata  • Retinal 2x density fallbacks
```

### 3.1 PIM Schema & INCI Taxonomy
Every clinical product entry within the database (`apps/api/src/catalog/`) exposes:
- `titleFa` / `titleEn`: Official bilingual medical labeling.
- `ingredients`: Array of `ProductIngredient` records including INCI nomenclature, concentration percentages, biological function (e.g. "Keratolytic", "Effervescent Carbon Source", "Lamellar Restorative"), and safety dossiers.
- `clinicalClaims`: Certified physiological efficacy indicators with review stamps (e.g. "افزایش ۴۵ درصدی اکسیژن‌رسانی پوستی").
- `variants`: Granular SKU packages (e.g., 500ml Clinic Dispenser vs. 1500ml Salon Refill vs. 5-pod Home Kit).

---

## 4. Transactional Cart & Financial Integrity Pipelines

The Commerce OS architecture implements enterprise-grade transactional safeguards across pricing, reservation, checkout, and general ledger settlement:

```
+───────────────────────────────────────────────────────────────────────────────────+
|                           ORDER & FINANCIAL PIPELINE                              |
+───────────────────────────────────────────────────────────────────────────────────+

  [ 1. User Cart ] ──> LocalStorage persistence with optimistic state sync
          │
          ▼
  [ 2. Pricing Quote ] ──> POST /v1/checkout/quote (Atomic BigInt Rial computation)
          │                - Tiered volume discount (5% - 22%)
          │                - Coupon validation & cap limits (DERMER20)
          │                - Iranian VAT 10% calculation
          │                - Cryptographic quote fingerprint (TTL: 15 min)
          ▼
  [ 3. Inventory Lease ] ──> POST /v1/checkout/session
          │                  - Deterministic row-level locking (FOR UPDATE)
          │                  - Deadlock-free sorted variant keys
          │                  - 15-minute lease expiration TTL
          ▼
  [ 4. Order Placement ] ──> POST /v1/checkout/place-order
          │                  - x-idempotency-key header enforcement
          │                  - Replay-safe duplicate submission prevention
          ▼
  [ 5. Payment Port ] ──> Shetab Gateway (Saman/Mellat) or Card-to-Card Receipt
          │               - Shaparak redirect with payment lock
          │               - C2C receipt upload & admin review workflow
          ▼
  [ 6. Ledger Posting ] ──> Double-Entry Journal Creation
                            - DEBIT: 1001 / 1002 Cash & Gateway Settlement
                            - DEBIT: 4201 Sales Discounts & Allowances
                            - CREDIT: 4101 Gross Medical Product Sales
                            - CREDIT: 2101 Output VAT Payable (10%)
                            - INVARIANT: SUM(DEBIT) === SUM(CREDIT) (Imbalance = 0)
```

### 4.1 Zero-Float Financial Standard
- Stored values: Minor unit Rials represented as `BigInt` or non-floating strings in database schemas.
- Calculations:
  $$\text{Taxable Base} = \text{Subtotal} - \text{Discounts}$$
  $$\text{VAT} = \lfloor \text{Taxable Base} \times 0.10 \rfloor$$
  $$\text{Total Payable} = \text{Taxable Base} + \text{VAT} + \text{Shipping}$$
- Under no circumstances does the application use JavaScript `Number` floating-point math for commercial balances.

### 4.2 Cart State Synchronization & Persistence
- Storage Engine: Client-side `window.localStorage` synchronized via cross-tab `StorageEvent` listeners.
- Hydration Safety: The `CartDrawer` mounts with an empty optimistic skeleton, immediately hydrating with stored lines to prevent React 19 hydration mismatches.
- Mutation Atomicity: Line additions, quantity decrements, and coupon applications trigger atomic quote re-verifications against `/v1/checkout/quote`. If stock levels shift during checkout, the interface alerts the user with an explicit warning badge.

---

## 5. Security Architecture & Threat Defense

1. **Idempotency Locks**: All mutating financial endpoints require unique `x-idempotency-key` UUIDs. Duplicate submissions return the original order payload without re-charging or re-allocating inventory.
2. **SSRF Mitigation**: Outgoing webhooks and image fetchers pass through `@commerce-os/security` URL validation, preventing local subnet traversal (`127.0.0.1`, `169.254.169.254`, private RFC 1918 ranges).
3. **PII Masking**: Customer Iranian Mobile numbers and National IDs are masked in server logs (`0912***4567`, `001****678`).
4. **Rate Limiting**: Sliding-window rate limiters defend sensitive endpoints (OTP authentication, coupon verification, order placement).

---

## 6. Build & CI/CD Verification Gates

To ensure uninterrupted deployment health, the repository enforces strict verification checks before code release:
- `turbo run build`: Complete static compilation across all monorepo apps and packages.
- `scripts/verify-clinical-store.mjs`: Complete 10-stage end-to-end clinical lifecycle verification suite.
- `pnpm run test`: Jest and Node test runner execution across domain, finance, gateways, and security suites.