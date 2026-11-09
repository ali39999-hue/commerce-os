# iTrip / Firuzo Platform — ERP Current State Audit (Phase 1)

**Target Repository:** `_reference/itrip-platform` (`ali39999-hue/itrip-platform`)  
**Audit Date:** 2026-11-05  
**Auditor:** Enterprise Solution & ERP Architecture Team  
**Baseline Commit:** `722d61f` (branch `main`)  
**Evaluation Standard:** Empirical evidence only. No documentation claim was accepted without source code, migration, database schema, and test verification.

---

## 1. Executive Summary & Audit Baseline

iTrip / Firuzo is a mature travel-booking monolith built with Next.js 16 (App Router), React 19, TypeScript 5, and Prisma 5.22. It features high-quality domain kernels in specific areas—notably inventory concurrency locking (`FOR UPDATE` row-locks in `InventoryEngine`), relational RBAC resolution (`permission-service`), and a two-tier accounting ledger (`GeneralLedgerService` + `JournalService`).

However, on the ERP and operational axes, the platform exhibits significant architectural divergence between documented claims and live runtime reality:
- **Total Prisma Models:** 92 models, **0 Prisma enums** (all state fields are free-form strings).
- **ERP Capability Reality:** ~42% Real & Operational, ~28% Partial/Thin, ~18% Dead/Orphan Code, ~12% Mock/Simulated.
- **Tenancy:** Partially implemented; physical tenant scoping (`organizationId`) exists on only 9 of 92 tables, and runtime enforcement (`getTenantScopedPrisma`) is applied in only 5 call sites across the entire application.
- **Financial Integrity:** High-precision `Decimal` is used across ledger entries, but authoritative pricing paths contain hardcoded static catalog fallbacks (`85,000,000 IRR`), and checkout UI derives totals using JavaScript float math.
- **Runtime DDL Risk:** `src/lib/db-schema-guard.ts` executes arbitrary `ALTER TABLE`, `CREATE TABLE`, and `ADD CONSTRAINT` statements on live server action hot-paths, bypassing migration discipline.

---

## 2. Capability Reality Matrix (Empirical Audit)

Status Definitions:
- **REAL / PROD-READY:** Verified end-to-end (DB + Service + Action/API + UI + Permission + Tests).
- **PARTIAL:** Working core but missing UI, missing permissions, or missing terminal states.
- **ORPHAN / DEAD CODE:** Implemented in code/tests but has 0 production consumers.
- **MOCK / SIMULATED:** Returns fabricated, hardcoded, or seeded static data.
- **BROKEN / UNSAFE:** Contains security bypasses, data-loss vectors, or concurrency defects.

| Capability / Module | Status | DB Models | Domain Service / Backend | UI Route / Component | Permission Gate | Tests | Audit Finding |
|---|---|---|---|---|---|---|---|
| **Inventory Hold & Allotment** | **PROD-READY** | `InventoryItem`, `Allotment`, `InventoryHold` | `InventoryEngine.ts` | `/admin/inventory` (`AdminInventoryClient.tsx`) | `inventory:write` | 3 concurrency race suites | PostgreSQL `SELECT ... FOR UPDATE` row locks; atomic holds, capture, release, compensation. Zero float math. |
| **Booking Engine & Sagas** | **REAL / PARTIAL** | `Booking`, `BookingItem`, `BookingStatusHistory`, `PriceSnapshot` | `BookingApplicationService.ts`, `BookingSagaCoordinator.ts` | `/book`, `/checkout`, `/admin/bookings` | Authenticated (Storefront), `booking:view:all` (Admin) | 12 unit/integration specs | Robust draft-hold-pay saga, but contains hardcoded fallback `85,000,000 IRR` when item id is missing. |
| **Double-Entry General Ledger** | **REAL** | `ChartOfAccounts`, `JournalEntry`, `JournalLine`, `Account`, `LedgerEntry` | `GeneralLedgerService.ts`, `JournalService.ts`, `LedgerInvariantValidator.ts` | `/admin/finance`, `/admin/finance/receipts` | `finance:view`, `finance:write` | Multi-currency balance tests | Two-tier ledger: wallet subledger + statutory GL. Enforces `SUM(DEBIT) = SUM(CREDIT)`. Idempotency key `groupId` lacks unique DB index. |
| **Refunds & Maker-Checker** | **PROD-READY** | `Refund`, `RefundApproval`, `RefundAttempt`, `RefundItem`, `RefundPolicySnapshot` | `RefundDomainService.ts`, `RefundStateMachine.ts` | `/admin/bookings` (Refund modal) | `refund:create`, `refund:approve` | `maker-checker.test.ts` | Enforces dual-authorization over high-value thresholds. Prevents self-approval. Reverses ledger journals. |
| **Tenant Isolation & RBAC** | **PARTIAL / UNSAFE** | `Organization`, `OrganizationBranch`, `OrganizationMembership`, `UserRole`, `Role`, `Permission`, `RolePermission` | `permission-service.ts`, `TenantRepository.ts`, `tenant-scoper.ts` | `/admin/organizations`, `/admin/users` | Route-level middleware map | `tenant-isolation.test.ts` | RBAC resolution is robust. Tenancy enforcement is decorative: `getTenantScopedPrisma` used in only 5 places; 83 tables lack `organizationId`. |
| **Supplier GDS/BedBank Integrations** | **REAL** | `Supplier`, `SupplierConnection`, `SupplierCredential`, `SupplierHealth` | `supplier/adapters/*` (Parto, Nadia, Eghamat, eCardo), `PartoPortalProvider.ts` | `/admin/suppliers`, `/admin/suppliers/[id]` | `supplier:manage` | Live adapter mocks & ping tests | Real scraping and API adapters with session keep-alives and XML/JSON parsing. Credentials stored by vault ref. |
| **Exception Center & Remediation** | **REAL** | `OperationalException`, `SystemErrorLog` | `ExceptionCenterService.ts`, `ExceptionRemediationService.ts` | `/admin/exceptions` | `booking:view:all`, `ops:override:cancel` | Unit specs | Operational triage for PNR mismatches, payment timeouts, and inventory failures with automated remediation. |
| **Travel File Dossier (ERP)** | **REAL** | `Trip`, `Booking`, `Invoice`, `TravelDocument` | `TravelFileService.ts` | `/admin/travel-files`, `/admin/travel-files/[id]` | `trip:view`, `trip:manage` | Integration tests | Consolidated operational folder per passenger trip, linking vouchers, invoices, itineraries, and staff notes. |
| **Card & Crypto Payment Review** | **REAL** | `DestinationBankCard`, `CardTransferReceipt`, `DestinationCryptoWallet`, `CryptoPaymentReceipt` | `PaymentDomainService.ts`, `actions/receipts.ts`, `actions/crypto-payments.ts` | `/admin/finance/receipts` | `receipt:review`, `crypto:review` | Receipt lifecycle tests | Offline payment verification workflow with reviewer tracking and ledger credit posting. |
| **Customer 360 & Profiles** | **REAL** | `User`, `TravelerProfile`, `TravelDocument` | `Customer360Service.ts` | `/admin/users/[id]` | `user:view:all` | Query tests | Comprehensive profile aggregating booking history, ledger balances, support tickets, and identity documents. |
| **Multi-Currency Service** | **REAL** | Config / In-Memory FX Cache | `CurrencyService.ts` | Storefront & Admin header currency switcher | Public read, Admin write | Currency conversion tests | Real-time rate fetching, central bank (CBI) & market rates, spread policies, and cached conversion matrix. |
| **Outbox & Event Worker** | **PROD-READY** | `OutboxEvent`, `WorkerLease` | `OutboxConsumer.ts`, `WorkerLeaseService.ts` | CLI / Daemon worker (`workers/worker-entrypoint.ts`) | Internal worker execution | DLQ & backoff tests | PostgreSQL `FOR UPDATE SKIP LOCKED` atomic claim, exponential backoff, DLQ, and multi-channel notification dispatch. |
| **Auto-Buy Flight Sniper** | **REAL** | `AutoBuyRule`, `FlightOfferCache` | `AutoBuyDomainService.ts` | `/account/auto-buy` | Customer-scoped auth | Sniper evaluation tests | Real background worker continuously matching fare cache against user budget thresholds and triggering sagas. |
| **Support Ticketing System** | **REAL** | `SupportTicket`, `TicketMessage` | `TicketDomainService.ts` | `/admin/tickets`, `/support` | `ticket:manage` | Ticket lifecycle tests | Multi-tenant customer support ticket desk with department routing, attachments, and status tracking. |
| **Behavior & Heatmap Tracking** | **REAL / MOCK** | `BehaviorEvent` | `BehaviorAnalyticsService.ts` | `/admin/analytics/behavior` | `analytics:view` | Aggregation tests | Real first-party tracking engine, but admin UI includes synthetic data generator `seedSampleBehaviorEventsAction`. |
| **CMS & Content Publishing** | **PARTIAL** | `Tour`, `TourDepartureDate`, `SignatureExperience`, `Travelogue`, `GuideArticle`, `SiteContent` | `ContentDomainService.ts` | `/admin/content`, storefront catalog | **BYPASSABLE** (non-prod allows unauthenticated mutations) | CMS CRUD tests | 42 KB god-service. `CmsPublishingService` (revisions/scheduling) is dead code. Storefront travelogues blend mock data with DB rows. |
| **Chart of Accounts Maintenance** | **MISSING** | `ChartOfAccounts` | None (hardcoded upsert in `JournalService:63`) | None (no UI exists) | N/A | None | COA is dynamically auto-generated from hardcoded string maps; no UI or service to manage fiscal accounts. |
| **Accounts Receivable (AR) & Aging**| **MISSING** | None | None | None | N/A | None | No AR subledger, no aging buckets (30/60/90 days), no automated customer/agency reminder schedules. |
| **Accounts Payable (AP) & Invoicing**| **PARTIAL** | `Invoice`, `InvoiceLine`, `SettlementBatch` | `InvoiceDomainService.ts` | `/invoices/[id]`, `/admin/finance/settlements` | `finance:view` | Invoice generation tests | Invoices generated with Jalali numbering, but supplier billing reconciliation and credit-note cycles are absent. |
| **Treasury & Bank Reconciliation** | **MISSING** | None (only card-to-card donation tables) | None | None (tab exists with no backend) | N/A | None | No bank accounts, no statement parsing, no automated or manual ledger-to-bank match engine. |
| **Approval Chain Engine** | **ORPHAN** | None | `ApprovalChainDomainService.ts` (11.8 KB) | None | Tested only | Unit tests only | Fully designed multi-tier approval service with escalating SLAs, but completely unwired to any route or action. |
| **Document Versioning & Secure Vault**| **ORPHAN** | None | `DocumentManagementService.ts` (8.4 KB) | None | Tested only | Unit tests only | Secure document check-in, checksum, and lifecycle service implemented but never imported by ERP routes. |
| **Entity Change Tracker** | **ORPHAN** | `AuditLog` | `EntityChangeTracker.ts` (7.2 KB) | None (Admin has no AuditLog UI) | Tested only | Unit tests only | Deep object-diff tracker for before/after state captures; exists in isolation without runtime callers. |
| **Financial Analytics & BI Engine** | **ORPHAN** | None (reads Ledger/Booking OLTP) | `FinancialAnalyticsService.ts` (14.2 KB) | None (no analytics dashboard) | Tested only | Aggregation tests | Advanced GMV, net margin, take-rate, and reconciliation KPI calculations implemented but unrouted. |
| **Operational SLA Analytics** | **ORPHAN** | `OperationalException` | `OperationalSlaAnalyticsService.ts` (8.9 KB) | None | Tested only | SLA calculation tests | Computes MTTR, breach percentage, and queue depth across operational teams; zero callers in UI. |
| **Tax Jurisdiction & Multi-Tax** | **DEAD CODE**| `TaxJurisdiction`, `TaxRule` | `lib/finance/tax-engine.ts` | None | None | Fallback tests | Tables have zero writers. DB lookup always misses, falling back to hardcoded 9% VAT. |
| **Supplier Contract & Credit Rules**| **DEAD CODE**| `SupplierContract`, `CommissionRule` | `finance/CommissionService.ts` | None | None | None | Tables defined in Prisma and migrations have zero writers and zero readers across `src/`. |
| **B2B Firuzo Business Vertical** | **REAL (ISLAND)**| 14 `Business*` models | `BusinessDomainService.ts`, `BusinessCoreClient.ts` | `/admin/business`, `/business/*` | `business:request:review` | Business package tests | Completely independent parallel vertical with money in `Int` rials and zero physical FKs to core tables. |

---

## 3. Structural & Architectural Defect Inventory

### 3.1 Unsafe Runtime DDL Alterations (`src/lib/db-schema-guard.ts`)
`db-schema-guard.ts` (25 KB) executes destructive and raw DDL (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`) on live customer and operator request paths:
- Invoked in `src/actions/auth.ts:14,173`
- Invoked in `src/actions/booking.ts:16,23,847`
- Invoked in `src/domains/booking/BookingApplicationService.ts:301,313`
- Invoked in `src/app/api/health/ready/route.ts:65`

**Risk:** Production schema can drift unpredictably between server instances. High latency overhead on transaction hot-paths. Bypasses Prisma migration history.

### 3.2 Authorization & Authentication Bypass Vulnerabilities
1. **CMS & Diagnostics Anonymous Bypass:**
   In `src/actions/content.ts:22-41` and `src/actions/system-logs.ts:13-32`:
   ```typescript
   if (process.env.NODE_ENV !== 'production' &&
       (process.env.DEMO_MODE === 'true' || process.env.NODE_ENV === 'test' || !session)) return true;
   ```
   An unauthenticated caller (`!session`) passes authentication automatically in any staging, preview, or test deployment, allowing complete CMS wipeout or log destruction.
2. **Hardcoded Email Privilege Escalation:**
   In `src/middleware.ts:202-203`, access is granted if `tokenEmail === 'admin@firuzo.com'` or `userRole === 'ADMIN'`, bypassing the relational RBAC table.
3. **Unguarded Admin Routes:**
   `/admin/finance`, `/admin/finance/settlements`, `/admin/finance/receipts`, `/admin/inventory`, `/admin/manifests`, `/admin/suppliers`, and `/admin/content` lack server-side `requirePermission()` guards on the Page component level, relying exclusively on edge middleware or action-level checks.

### 3.3 Authoritative Pricing Contamination & Float Math
1. **Hardcoded Fallback Price:**
   `src/domains/booking/BookingApplicationService.ts:86-89` silently returns `85,000,000 IRR` or the first item from a static JavaScript seed array (`TOURS[0]`) whenever `itemId` is null or DB lookup fails.
2. **Float Arithmetic in Checkout:**
   `src/lib/money.ts:88-127` executes monetary math (`taxAmount`, `gatewayFeeAmount`, `totalPayable`) using standard JavaScript 64-bit IEEE 754 floating-point operations (`Number((x).toFixed(2))`), which can lead to rounding discrepancies between displayed quotes and charged amounts.
3. **Currency Incompatibility:**
   `Tour.price` defaults to `TOMAN` (`Decimal(18,4)`), whereas `Booking`, `Payment`, and `Ledger` default to `IRR` (`Decimal(65,30)`). In `BookingApplicationService:130`, conversion is performed via raw `Number(dbTour.price)`.

### 3.4 Tenancy Enforcement Breakdown
- Out of 92 Prisma tables, only **9 tables** have an `organizationId` column. Core operational tables (`Payment`, `Refund`, `LedgerEntry`, `JournalEntry`, `SupportTicket`, `Allotment`, `InventoryHold`) have **no organization ownership column**.
- Tenancy scoper (`src/lib/tenant-scoper.ts`) is only called in 5 places via `getTenantScopedPrisma()`.
- Rows with `organizationId = NULL` are treated as accessible by all tenants in global search queries.

### 3.5 Idempotency Gaps & Race Conditions
- `LedgerEntry.groupId` is not enforced with a unique DB index (`@@unique([groupId])`), relying on an in-memory check-then-insert pattern.
- `GatewayTransaction` lacks `@@unique([gatewayName, gatewayRef, type])`.
- `CryptoPaymentReceipt.txHash` is indexed but lacks a unique constraint, allowing multiple claims of the same blockchain transaction.
- `RefundAttempt.attemptNumber` is computed via `count() + 1` without concurrency locks, exposing parallel refund attempts to unique constraint collisions.

### 3.6 State Machine Bypasses
- In `src/actions/booking.ts:454-458`, `getBookingById` (a read action) directly mutates `prisma.booking.update({ data: { status: 'EXPIRED' } })` without calling `BookingStateMachine.assertTransition()`, without logging to `BookingStatusHistory`, and without releasing the underlying `InventoryHold`.
- No database `enum` or SQL `CHECK` constraint exists on `Booking.status`, allowing direct raw SQL updates to corrupt state.

---

## 4. Admin & ERP Route Audit (27 Routes)

| Path | Primary Purpose | Real Backend Connection | Mutation Capabilities | Audited Limitations |
|---|---|---|---|---|
| `/admin` | Executive Overview | `getAdminDashboardData` | None (Read-only) | Reads OLTP live; cards show real counts but lacks date-range filters. |
| `/admin/bookings` | Booking Lifecycle Queue | `getAdminBookings` | `refundBookingAdmin` | Lacks server-side pagination (loads 50 items); no column picker. |
| `/admin/finance` | Financial Health & FX | `getAdminFinanceStats` | `saveAdminFxRates` | Lacks page-level permission check; trial balance button is decorative. |
| `/admin/finance/settlements`| Supplier Settlements | `getAdminSettlementBatches` | `createAdminSettlementBatch`, `executeAdminSettlementPayment` | Lacks Maker-Checker verification for high-value payouts. |
| `/admin/finance/receipts` | Offline Receipt Triage | `listCardTransferReceipts`, `listCryptoPayments` | `reviewCardReceiptAction`, `reviewCryptoPayment` | No preview drawer for attached slip images; manual review only. |
| `/admin/inventory` | Allotments & Stop-Sell | `getAdminInventory` | `updateAllotment` | Heavy 19 KB client component; lacks bulk-date allotment calendar. |
| `/admin/manifests` | Passenger Manifests | `getPassengerManifestAction` | Export CSV (`/api/admin/manifest/export`) | Real data; CSV export works; lacks passenger passport OCR sync. |
| `/admin/ops` | Operations Monitor | `getAdminOpsData` | Operator overrides | Aggregates queue latency; lacks automated alert notifications. |
| `/admin/operator` | Agent Workbench | `getOperatorWorkbenchAction` | `sendOperatorPushAction` | Real push notifications via VAPID; lacks agent work assignment queue. |
| `/admin/exceptions` | Exception Center | `ExceptionCenterService` | Assign, Resolve, Purge, Remediate | Excellent domain logic; lacks auto-triage rules engine. |
| `/admin/travel-files` | ERP Travel Dossier | `TravelFileService` | Manage status, add notes, issue invoice | Operational file folder; lacks automated supplier PNR sync. |
| `/admin/travel-files/[id]`| Travel File Detail | `TravelFileService.getTravelFileDetail` | Financial reconciliation, refund trigger | Real comprehensive detail; lacks PDF dossier print export. |
| `/admin/suppliers` | Supplier Master Data | `getAdminSuppliers` | Create supplier, add connection | Lacks contract SLA terms and commission rule editing. |
| `/admin/suppliers/[id]` | Supplier Credentials | `getSupplierDetail` | Rotate credentials, test connection | Ping test works; password/tokens safely masked with vault refs. |
| `/admin/users` | IAM & Staff Management | `getAdminUsers` | Create staff, assign roles, toggle status | Lacks granular permission assignment UI (role-level only). |
| `/admin/users/[id]` | Customer 360 View | `Customer360Service` | View booking/ticket/ledger timeline | Real unified customer intelligence; lacks merge-customer tool. |
| `/admin/organizations` | B2B Agency & Corporates | `OrganizationService` | Create org, create branch, add member | Real tenancy structure; lacks credit-limit enforcement rules. |
| `/admin/referrals` | Referral Program | `getAdminReferrals` | Update codes, settle rewards | Real reward settlements; lacks automated tiered payouts. |
| `/admin/content` | Multi-Vertical CMS | `ContentDomainService` | 15 CRUD actions for tours/guides/stories | Swallows errors to empty list; bypassable auth in dev. |
| `/admin/tours` | Tours Redirect | Redirects to `/admin/content?tab=tours` | N/A | Redundant redirect stub. |
| `/admin/business` | B2B Corporate Queue | `actions/business-ops.ts` | Review requests, grant approvals | Isolated business vertical; lacks ledger journal sync. |
| `/admin/business/content`| B2B Content Editor | `actions/business-content-ops.ts` | Versioned publishing | Working draft/publish workflow; lacks diff viewer. |
| `/admin/tickets` | Support Helpdesk | `getAdminTicketsAction` | Reply, change status, assign agent | Real ticket desk; lacks canned responses and SLA breach alerts. |
| `/admin/settings` | System Settings | 5 settings actions | Gateway mode toggle, SMS config, Card CRUD | Toggling payment mode switches whole site between demo and live. |
| `/admin/logs` | System Error Console | `ErrorTrackerService` | Clear logs, resolve errors, trigger test | Only displays `SystemErrorLog`; does not query `AuditLog`. |
| `/admin/analytics/behavior`| Heatmap & Journey | `actions/behavior.ts` | Seed synthetic events, filter heatmaps | Real tracking; contains synthetic data generator button. |

---

## 5. Audit Conclusions & Strategic Directives

1. **Do Not Rebuild What Works:**  
   The platform's inventory reservation kernel, refund maker-checker, outbox worker, supplier adapters, and customer 360 are mature and well-tested. They must be preserved and guarded.
2. **Eliminate Runtime DDL Immediately:**  
   `db-schema-guard.ts` must be retired. All database structures must be defined strictly in `prisma/schema.prisma` and applied via verified SQL migrations.
3. **Enforce Tenant Security at the Storage Layer:**  
   Adopt Commerce OS's composite foreign key pattern (`@@unique([organizationId, id])`) across all newly introduced ERP modules and wire `getTenantScopedPrisma` universally across all admin queries.
4. **Wire the High-Value Orphan Services:**  
   Connect `FinancialAnalyticsService`, `OperationalSlaAnalyticsService`, `ApprovalChainDomainService`, and `DocumentManagementService` to the ERP admin surface rather than writing redundant new code.
5. **Bridge the Accounting Gaps:**  
   Implement the missing Chart of Accounts management, General Ledger trial balance reporting, and Accounts Receivable/Payable aging analysis to transform the current subledger into a true statutory Enterprise ERP.
