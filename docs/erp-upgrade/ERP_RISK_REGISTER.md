# iTrip Enterprise ERP — Enterprise Risk Register (Phase 3)

**Platform:** iTrip / Firuzo Unified Travel & Commerce Operating System  
**Document:** Enterprise Architectural & Operational Risk Register  
**Version:** 2.0.0-ENTERPRISE  
**Risk Scoring Formula:** $\text{Severity} = \text{Likelihood (1–5)} \times \text{Impact (1–5)}$  
- **Critical (20–25):** Immediate architectural blocker; must be mitigated before any production deployment.
- **High (12–19):** Significant operational hazard; requires automated defensive guards.
- **Medium (6–11):** Manageable risk; monitored via telemetry.
- **Low (1–5):** Minor procedural variance.

---

## 1. Enterprise Risk Log

| Risk ID | Category | Risk Description | Likelihood | Impact | Severity Score | Mitigation Strategy & Architectural Safeguards | Owner | Status | Contingency Plan |
|---|---|---|---|---|---|---|---|---|---|
| **RSK-FIN-01** | **Financial** | **Ledger Imbalance Drift:** Concurrency race or partial commit causing $\sum \text{Debit} \neq \sum \text{Credit}$. | 3 | 5 | **15 (High)** | Atomic Prisma interactive transactions; domain-level `LedgerInvariantValidator` throws on imbalance; automated nightly trial balance reconcile job. | Financial Architect | **MITIGATED IN DESIGN** | Automatic ledger freeze and supervisor alert on unbalance detection. |
| **RSK-SEC-01** | **Security** | **Runtime DDL Corruption:** `db-schema-guard.ts` mutating live production tables concurrently across server clusters. | 4 | 5 | **20 (Critical)** | Completely retire `db-schema-guard.ts`; enforce read-only runtime database credentials; all schema changes via `prisma migrate deploy`. | Security Engineer | **IN PROGRESS (P0)** | Roll back deployment to last verified migration baseline. |
| **RSK-SEC-02** | **Security** | **Non-Production Auth Bypass:** Anonymous callers accessing CMS actions and log deletion via `!session` shortcut. | 4 | 4 | **16 (High)** | Delete `!session` bypass branches in `content.ts` and `system-logs.ts`; enforce universal `requirePermission()` in all environments. | Security Engineer | **IN PROGRESS (P0)** | Edge proxy block on administrative URL patterns. |
| **RSK-TEN-01** | **Tenancy** | **Cross-Tenant Agency Leakage:** B2B Agency A viewing bookings, invoices, or customer data belonging to Agency B. | 3 | 5 | **15 (High)** | Implement storage-enforced composite foreign keys (`@@unique([organizationId, id])`); universally wrap queries in `getTenantScopedPrisma`. | Solution Architect | **IN PROGRESS (P0)** | Immediate agency API key revocation and audit log inspection. |
| **RSK-OPS-01** | **Operations** | **Authoritative Pricing Fallback:** System issuing tickets at arbitrary default `85,000,000 IRR` when live quote fails. | 3 | 5 | **15 (High)** | Eliminate static fallbacks in `BookingApplicationService`; enforce mandatory dynamic supplier quote validation before draft creation. | Senior Backend Engineer | **IN PROGRESS (P0)** | Booking creation rejected with clear `QuoteExpiredError`. |
| **RSK-OPS-02** | **Operations** | **Overselling Inventory Race:** Parallel requests booking the same hotel room or flight seat simultaneously. | 3 | 5 | **15 (High)** | Maintain `SELECT FOR UPDATE` row locks in `InventoryEngine`; atomic decrements of available quotas within database transactions. | Backend Lead | **VERIFIED (P0)** | Release orphaned holds via automated background sweeper. |
| **RSK-FIN-02** | **Financial** | **Float Money Rounding Discrepancy:** JavaScript float math in `src/lib/money.ts` leading to quote vs charge mismatches. | 4 | 3 | **12 (High)** | Refactor all pricing and tax routines to use arbitrary-precision `Prisma.Decimal` exclusively. | Financial Systems Engineer | **IN PROGRESS (P0)** | Discrepancies logged to `SystemErrorLog` for accounting reconciliation. |
| **RSK-SUP-01** | **Supplier** | **GDS Gateway Timeout & Ambiguity:** Parto/Nadia timing out during ticket issuance, leaving PNR state uncertain. | 4 | 4 | **16 (High)** | Adopt `UNKNOWN` state in booking/payment FSM; route uncertain bookings to `ExceptionCenter` for automated polling. | DevOps / Integration | **IN PROGRESS (P1)** | Manual operator resolution via GDS portal check. |
| **RSK-WF-01** | **Governance** | **Maker-Checker Self-Approval:** Operator approving their own high-value refund or supplier settlement. | 2 | 5 | **10 (Medium)** | Strict programmatic assertion `assert(makerId !== checkerId)` enforced in database transaction and API guard. | Product Manager | **VERIFIED (P1)** | Transaction aborted and logged to `AuditLog`. |
| **RSK-PERF-01**| **Performance** | **Unbounded Ledger Query Latency:** Trial balance calculation timing out on high-volume journal line tables. | 3 | 3 | **9 (Medium)** | Composite index on `(chart_of_account_id, created_at) INCLUDE (debit, credit)`; pre-aggregated fiscal period summaries. | Database Architect | **PLANNED (P1)** | Query asynchronous background reporting worker. |
