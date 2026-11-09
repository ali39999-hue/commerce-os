# iTrip Enterprise ERP — Comprehensive Gap Analysis (Phase 3)

**Platform:** iTrip / Firuzo Unified Travel & Commerce Operating System  
**Document:** Dimensional Gap Analysis & Capability Comparison  
**Version:** 2.0.0-ENTERPRISE  
**Comparison Dimensions:** Current Monolith Baseline vs. Enterprise Target State

---

## 1. High-Level Dimensional Scorecard

| # | Architecture Dimension | Current Baseline | Target Enterprise State | Severity / Gap Size | Strategic Resolution |
|---|---|---|---|---|---|
| 1 | **Software Architecture** | Monolith with 19 unwired orphan domain services; runtime DDL mutation (`db-schema-guard.ts`). | Modular Monolith (DDD); strictly governed migrations; zero runtime DDL; unified domain service layer. | **CRITICAL** | Eliminate runtime DDL; wire orphan domain services into production actions and routes. |
| 2 | **Financial Integrity** | Two-tier subledger + GL present, but no Chart of Accounts UI, no Trial Balance report, and float math in checkout. | Full statutory General Ledger with real-time Trial Balance ($\sum \text{Dr} = \sum \text{Cr}$), AR/AP aging subledgers, 100% Decimal math. | **CRITICAL** | Build COA maintenance UI, Trial Balance SQL aggregator, and eliminate float math in `src/lib/money.ts`. |
| 3 | **Multi-Tenancy** | Decorative in 83 of 92 tables; application-level scoper called in only 5 sites; `NULL` orgs leak globally. | Storage-enforced multi-tenancy via composite foreign keys (`organizationId, id`); fail-closed tenant scoping. | **CRITICAL** | Add composite FKs to newly introduced ERP tables and universally apply `getTenantScopedPrisma`. |
| 4 | **Identity & Access (IAM)**| Relational RBAC exists, but bypassable via hardcoded emails and non-prod `!session` shortcuts. | Fail-closed authentication; strict Maker-Checker for high-value operations; fine-grained permission assignments. | **HIGH** | Delete hardcoded email checks in middleware; require session + permissions across all admin routes. |
| 5 | **Travel Operations** | Strong booking sagas, but authoritative pricing falls back to static `85,000,000 IRR` or `TOURS[0]`. | Fail-closed dynamic pricing engine; mandatory item verification; seamless Travel File dossier integration. | **HIGH** | Remove hardcoded fallback price in `BookingApplicationService`; require server-verified item quotes. |
| 6 | **Inventory & Allotment** | Best-in-class PostgreSQL `SELECT FOR UPDATE` row locks; but admin UI lacks batch calendar editing. | Real-time allotment visual calendar with multi-day quota adjustments, stop-sell toggles, and auto-release. | **MEDIUM** | Modernize `/admin/inventory` with server-side pagination and batch monthly quota updates. |
| 7 | **Supplier Integrations** | Real Parto, Nadia, Eghamat, eCardo adapters; but lacks automated billing reconciliation against GDS. | Automated 3-way reconciliation comparing local booking costs with GDS clearing statements; SLA tracking. | **MEDIUM** | Wire `three-way-reconciliation.ts` into settlement payout pipelines. |
| 8 | **Workflow & Automation** | Refund maker-checker exists; `ApprovalChainDomainService` (11.8 KB) is completely unwired. | Centralized Approval Center routing refunds, credit adjustments, and supplier payouts with escalation rules. | **MEDIUM** | Connect `ApprovalChainDomainService` to Server Actions and create `/admin/approvals`. |
| 9 | **Document Management** | `DocumentManagementService` is an unwired orphan; sensitive passports stored without versioned vault. | Encrypted document repository with SHA-256 checksums, signed URLs, and access audit logging. | **MEDIUM** | Wire `DocumentManagementService` into Travel Files and Customer 360 profiles. |
| 10 | **BI & Reporting** | Advanced analytics services (`FinancialAnalyticsService`) are unwired; admin relies on OLTP queries. | Executive BI dashboard computing real GMV, take-rate, reconciliation ratios, and operational SLA telemetry. | **MEDIUM** | Wire existing analytics services into new `/admin/analytics` dashboard. |
| 11 | **User Experience (UI/UX)**| 27 admin pages; lacks server-side pagination, sorting, and bulk actions; heavy client bundles (>45 KB). | Enterprise Data Tables with cursor pagination, advanced filter drawers, Jalali dual calendar, WCAG 2.2 AA. | **MEDIUM** | Standardize admin pages on `EnterpriseDataTable` and `AdminShell` components. |
| 12 | **Testing & Quality** | 190 test files, but 59 DB-backed suites fail without running Postgres; 0 Playwright admin tests. | 100% reproducible test suite with embedded Postgres in CI/CD; automated E2E for golden paths. | **HIGH** | Fix test database harness; add Playwright E2E coverage for financial and operational journeys. |

---

## 2. Granular Gap Catalog

### GAP-FIN-01: Absence of Statutory Chart of Accounts (COA) Management
- **Audit Evidence:** `JournalService.ts:63` implicitly upserts accounts on demand using hardcoded code strings (`1020`, `2020`, `4010`).
- **Target Spec:** A dedicated administrative interface allowing the Chief Financial Officer (CFO) to configure account hierarchies, set parent-child groupings, define currency constraints, and freeze deprecated accounts.
- **Remediation:** Introduce `ChartOfAccountsService` and administrative view at `/admin/finance/accounts`.

### GAP-FIN-02: Lack of General Ledger Trial Balance Aggregation
- **Audit Evidence:** `/admin/finance` displays static KPI cards; clicking trial balance executes a dummy export or fails silently.
- **Target Spec:** Real-time SQL aggregation running `SELECT account_code, SUM(debit) as debits, SUM(credit) as credits FROM journal_lines WHERE created_at BETWEEN :start AND :end GROUP BY account_code`.
- **Remediation:** Implement `GeneralLedgerService.getTrialBalance()` and render at `/admin/finance/trial-balance`.

### GAP-FIN-03: Floating-Point Math in Storefront Checkout
- **Audit Evidence:** `src/lib/money.ts:88-127` calculates VAT and gateway fees via `Number((x).toFixed(2))`.
- **Target Spec:** Strictly typed `Prisma.Decimal` calculations across all quotation and checkout pipelines.
- **Remediation:** Refactor `src/lib/money.ts` to utilize arbitrary-precision Decimal operations exclusively.

### GAP-SEC-01: Runtime DDL Execution (`src/lib/db-schema-guard.ts`)
- **Audit Evidence:** 25 KB file running `ALTER TABLE` and `CREATE TABLE IF NOT EXISTS` invoked from `actions/auth.ts`, `actions/booking.ts`, and `BookingApplicationService.ts`.
- **Target Spec:** Zero DDL execution in application runtime code. Complete reliance on `prisma/migrations`.
- **Remediation:** Remove all calls to `ensureDatabaseSchemaHealed()` and delete runtime DDL functions.

### GAP-SEC-02: Non-Production Authentication Bypass
- **Audit Evidence:** `src/actions/content.ts:22-41` allows `!session` callers when `NODE_ENV !== 'production'`.
- **Target Spec:** All mutations must fail-closed if a valid authenticated session with proper permissions is absent.
- **Remediation:** Replace bypass branches with standard `requirePermission()` guards.

### GAP-OPS-01: Hardcoded Pricing Fallback in Booking Domain
- **Audit Evidence:** `BookingApplicationService.ts:86-89` returns `85,000,000 IRR` when an item id cannot be resolved.
- **Target Spec:** Booking creation must fail with an explicit `UnpricedItemError` if the catalog item or supplier quote is missing.
- **Remediation:** Delete fallback logic and enforce strict quotation validation before booking draft creation.

### GAP-OPS-02: Unwired High-Value Domain Services
- **Audit Evidence:** `FinancialAnalyticsService.ts`, `OperationalSlaAnalyticsService.ts`, `ApprovalChainDomainService.ts`, `DocumentManagementService.ts`, and `EntityChangeTracker.ts` have 0 production callers.
- **Target Spec:** All developed services must either be mounted to operational admin routes and actions or safely retired.
- **Remediation:** Mount `ApprovalChainDomainService` to `/admin/approvals`, `DocumentManagementService` to Travel Files, and analytics services to `/admin/analytics`.
