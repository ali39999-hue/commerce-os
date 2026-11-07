# ENGINEERING TASK BACKLOG
## Detailed Tasks Across 8 Transformation Phases

---

## Phase 0: Project Discovery & Audits
- [x] **T-001**: Audit all 43 active Next.js routes and compile `ROUTE_INVENTORY.md`.
- [x] **T-002**: Inventory all shared UI components in `COMPONENT_INVENTORY.md`.
- [x] **T-003**: Identify and resolve historical styling discrepancies in `UI_INCONSISTENCIES.md`.
- [x] **T-004**: Conduct viewport benchmarks across 375px, 768px, 1280px, and 1440px in `RESPONSIVE_AUDIT.md`.
- [x] **T-005**: Perform accessibility evaluation against WCAG 2.2 AA standards in `ACCESSIBILITY_AUDIT.md`.

## Phase 1: Knowledge Architecture & Multi-Agent Guidelines
- [x] **T-010**: Install Anti-Slop skills (R-01 to R-40) under `.agents/skills/` and write root `antislop.md`.
- [x] **T-011**: Create central multi-agent execution protocol in root `AGENTS.md`.
- [x] **T-012**: Define agent specialization boundaries in `docs/ui-ux/agents/AGENT_ROLES.md`.
- [x] **T-013**: Establish the 8-step mandatory cycle in `docs/ui-ux/agents/IMPLEMENTATION_RULES.md`.
- [x] **T-014**: Formalize Definition of Done criteria in `docs/ui-ux/agents/DEFINITION_OF_DONE.md`.

## Phase 2: Design System Unification
- [x] **T-020**: Formulate Single Source of Truth in root `DESIGN.md`.
- [x] **T-021**: Document CSS custom properties dictionary in `docs/ui-ux/design-system/DESIGN_TOKENS.md`.
- [x] **T-022**: Standardize Persian Vazirmatn and tabular numerals in `TYPOGRAPHY.md`.
- [x] **T-023**: Define deep clinical palette and WCAG contrast tables in `COLORS.md`.
- [x] **T-024**: Lock 4px spatial baseline grid in `SPACING.md`.
- [x] **T-025**: Document physics easing curves and canvas double-buffering in `MOTION.md`.
- [x] **T-026**: Specify 10 core component primitives in `COMPONENT_STANDARDS.md`.

## Phase 3: Component Architecture Consolidation
- [x] **T-030**: Standardize `CanvasSequencePlayer` with pointer capture and URI path encoding.
- [x] **T-031**: Integrate `CartDrawer` with 2-tier milestone progress and cross-sell protocols.
- [x] **T-032**: Centralize direct order actions in `DirectProductOrder` with thumbnail synchronization.
- [x] **T-033**: Build `InciExplorer` interactive ingredient drawer for all 8 products.
- [x] **T-034**: Build `IngredientsInteractiveRegistry` live search component on `/ingredients`.

## Phase 4: Reference Page Perfection
- [x] **T-040**: Perfect Homepage (`/`) with Hero, Bohr Simulator, Visia Slider, and Regimen Quiz.
- [x] **T-041**: Perfect CarboX Station (`/carbox`) with 82-frame canvas and B2B quotation. **[RETIRED 2026-11-07 — device station removed; route redirects to `/carboxygel`]**
- [x] **T-042**: Perfect PlasmaX Station (`/plasmax`) with 110-frame canvas and 3 plasma arc modes. **[RETIRED 2026-11-07 — device station removed; route redirects to `/carboxygel`]**
- [x] **T-043**: Perfect CarboxyGel (`/carboxygel`) with physiological Bohr effect calculations.
- [x] **T-044**: Perfect CarboxyPod (`/carboxypod`) with 3-stage mechanical sequences.
- [x] **T-045**: Perfect Cart (`/cart`) and Checkout (`/checkout`) with Modulo-11 National ID validation.

## Phase 5: Complete Page Ecosystem Unification
- [x] **T-050**: Unify Crystalene (`/crystalene`), Healene (`/healene`), and Silicalene (`/silicalene`).
- [x] **T-051**: Unify brand showcases ReeSkin (`/reeskin`) and ReeMed (`/reemed`).
- [x] **T-052**: Unify B2B portal (`/b2b`, `/b2b/protocols`, `/b2b/workshops`). **[RETIRED 2026-11-07 — B2B/clinics portal removed; routes redirect to `/#products` (ADR-013)]**
- [x] **T-053**: Unify Academy (`/academy`) with 4 clinical tracks and certified practitioner roadmap. **[RETIRED 2026-11-07 — Academy removed; route redirects to `/blog` (دانش و پژوهش)]**
- [x] **T-054**: Unify Blog (`/blog` and `/blog/[slug]`) with DOI/PubMed references.
- [x] **T-055**: Unify legal and customer contact pages (`/about`, `/contact`, `/faq`, `/legal`).

## Phase 6: Comprehensive Testing & Verification
- [x] **T-060**: Formulate automated Playwright E2E test plan in `PLAYWRIGHT_PLAN.md`.
- [x] **T-061**: Execute standalone clinical E2E verification suite (`verify-clinical-store.mjs` 10/10 PASS).
- [x] **T-062**: Run complete monorepo unit and integration tests (`turbo run test` 91/91 PASS).
- [x] **T-063**: Run Next.js Turbopack production build with 0 errors across all 43 routes.

## Phase 7: Continuous Governance & Release Gates
- [x] **T-070**: Enforce pre-release quality checklist in `RELEASE_CHECKLIST.md`.
- [x] **T-071**: Maintain live execution progress table in `PROGRESS.md`.

## Phase 8: Library Architecture & Dependency Governance (LIB-001 to LIB-015)
- [x] **LIB-001**: Comprehensive `package.json` and lockfile audit; compile `DEPENDENCY_ARCHITECTURE.md`.
- [x] **LIB-002**: Select unified UI primitive foundation in `@commerce-os/ui` (avoid multi-primitive clutter).
- [x] **LIB-003**: Establish `lucide-react` as the single canonical icon system across all workspaces.
- [x] **LIB-004**: Adopt `react-hook-form` and `zod` for client-server clinical validation and Modulo-11 national ID.
- [x] **LIB-005**: Formalize Server/Client/URL state boundaries (TanStack Query / Zustand / native URL).
- [x] **LIB-006**: Define ERP table standards with high data density, tabular numerals, and status badges.
- [x] **LIB-007**: Integrate `embla-carousel-react` in `ClinicalProductGallery` for responsive touch galleries.
- [x] **LIB-008**: Enforce `motion` transition curves with universal `prefers-reduced-motion` compliance.
- [x] **LIB-009**: Document rich-text, INCI dossier, and clinical protocol publishing models.
- [x] **LIB-010**: Validate multi-currency (Rial/Toman) and bilingual RTL/LTR typography isolation.
- [x] **LIB-011**: Standardize testing stack: Vitest (unit), Playwright (E2E), and axe-core (accessibility).
- [x] **LIB-012**: Enforce visual baseline consistency across 360px, 390px, 768px, 1280px, and 1440px viewports.
- [x] **LIB-013**: Enforce privacy-first telemetry with strict masking of PII and zero banking leaks.
- [x] **LIB-014**: Formalize dependency governance policy prohibiting unauthorized third-party libraries.
- [x] **LIB-015**: Synchronize agent context pack (`DESIGN_TOKENS.md`, `COLORS.md`, `TASKS.md`, `PROGRESS.md`).


## Phase 9: Security & Access Control (AUTH-001 to AUTH-004)
- [x] **AUTH-001**: AdminGuard on admin-internal endpoints (`/v1/ops/*`, `/v1/ledger/*`) — OTP session with staff role or timing-safe `x-admin-api-key`; OTP login gate wired into the admin console; runtime-verified 401/200 matrix in `docs/security/SECURITY_BASELINE.md`.
- [x] **AUTH-002**: Resource identity/tenancy bound to the authenticated session — Step 1: guarded routes resolve tenant server-side via `@CurrentTenant()` (session → `DEFAULT_TENANT_ID`, service key → trusted header). Step 2: storefront `CustomerSessionProvider` with OTP login; `GET /v1/subscriptions/me` derives the userId from the session, never the URL. Step 3: `GET /v1/digital/my-grants` closes the grants-by-phone IDOR (phone from session only); account hub greeting + identity bar wired to the live session. Step 4: signed-in checkout binds `order.customerPhone/Name` to the session identity (guest checkout unchanged; delivery receiver stays a shipping detail on the address snapshot). Final: legacy enumeration routes (`users/:userId`, `grants?phone=`) locked behind AdminGuard; storefront guest view no longer impersonates the demo user via API. Step 5: financial reads session-bound (`/wallet/my-balance`, `/loyalty/my-balance`; legacy `wallet/:userId` and `loyalty/users/:userId` AdminGuard-locked); account wallet/loyalty tabs show real session data. Step 6: `GET /v1/orders/my` session-bound order history wired into the account hub; the store-wide orders listing locked behind AdminGuard. Step 7: checkout contact form prefilled from active session with PII masked identity banner. Step 8: global SiteHeader session indicator across all 46 routes + session-bound review submissions with automatic `isVerifiedPurchase` detection.
- [x] **AUTH-003**: AdminGuard extended to every mutating admin route — orders transition, coupon create/toggle, C2C receipt approval, digital license revoke, loyalty adjust, review moderation, wallet credit/debit, subscription pause/resume/cancel + admin list, B2B status change (storefront flows stay public); verification scripts act as service-key clients; IdentityModule is @Global for guard DI.
- [x] **AUTH-004**: Per-endpoint class-validator DTOs on every resource write (checkout session/place-order, coupons, wallet ops, loyalty adjust, order transition, payment initiate/receipt/approve, subscription signup, review create, B2B lead/status) — the global whitelist/forbidNonWhitelisted ValidationPipe is now effective; runtime-verified 400 on unknown keys, invalid enums and out-of-range values.

---

## Phase 10: Business Pivot — Retail-Only Clinical Skincare (2026-11-07)
- [x] **PIVOT-001**: Domain purge completed — medical device stations (CarboX/PlasmaX), B2B/clinics portal (متخصصان و کلینیک‌ها), vendors and Academy removed from storefront routes, home components and admin tabs; permanent redirects preserved in `next.config.ts`; storefront is retail-only across 31 page routes (27 static + 4 parameterized families).
- [x] **PIVOT-002**: Storefront sections CMS server-backed — `StorefrontSetting` single-row overrides, public `GET /v1/settings/storefront` (DB-down resilient 200 with `source:"DEFAULT"`) and AdminGuard `PUT`/`DELETE /v1/settings/storefront/home-sections` (ADR-013), replacing the broken cross-origin localStorage sync between admin:3001 and storefront:3000.
- [x] **PIVOT-003**: ERP catalog authoring API — `GET/POST /v1/stores/admin/products`, `PATCH /:id` and flag-only `POST bulk-update` with the DRAFT/PUBLISHED/ARCHIVED lifecycle, default variant `<slug>-STD` + InventoryLevel, `isFeatured` and first-publish `publishedAt` (ADR-013).
- [x] **PIVOT-004**: Scripts & E2E updated — `capture-all-pages.mjs` route lists (storefront 42 pages, admin 10 tabs), `e2e-golden-path.mjs` steps 17/18 (settings round-trip + product authoring), `verify-clinical-store.mjs` Stage 9 (ERP Product Authoring & Storefront Section Control).
- [x] **PIVOT-005**: Documentation synchronized — API contracts (b2b/vendors sections removed, 7 new endpoints documented), ADR-010 superseded + ADR-013 created, ui-ux inventories/pages/flows/pilot refreshed, SECURITY_BASELINE, README_FA and CHANGELOG 1.3.0.
