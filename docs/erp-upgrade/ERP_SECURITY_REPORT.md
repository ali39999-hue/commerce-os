# iTrip Enterprise ERP — Security & Threat Model Report (Phase 5)

**Platform:** iTrip / Firuzo Unified Travel & Commerce Operating System  
**Document:** Security Audit, Vulnerability Remediation & Enterprise Threat Model  
**Version:** 2.0.0-ENTERPRISE  
**Date:** 2026-11-05  
**Compliance Standard:** OWASP Top 10 Enterprise & Multi-Tenant Isolation Safeguards

---

## 1. Executive Security Posture

| Threat Category | Pre-Upgrade Vulnerability | Remediation Status | Verification Method |
|---|---|---|---|
| **Runtime DDL Injection** | `db-schema-guard.ts` altering production tables dynamically | **RETIRED (P0)** | All runtime DDL excised; migrations governed by Prisma |
| **Authentication Bypass** | Anonymous `!session` shortcut in non-prod CMS/Logs | **CLOSED (P0)** | Fail-closed `requirePermission()` across all environments |
| **Privilege Escalation** | Hardcoded email `admin@firuzo.com` in middleware | **REMOVED (P0)** | Relational RBAC resolution exclusively |
| **Cross-Tenant IDOR** | Agency queries relying on optional application filters | **STRENGTHENED (P0)** | Composite unique constraints (`organizationId, id`) |
| **Financial Fraud** | Single operator self-approving high-value payouts | **BLOCKED (P1)** | Programmatic Maker-Checker dual authorization |
| **PII Data Exposure** | Passports & customer phones unmasked in diagnostics | **MASKED (P1)** | PII sanitization in logs and encrypted document storage |

---

## 2. Detailed Threat Analysis & Remediations

### 2.1 Threat 1: Runtime Schema Mutation & DDL Vulnerabilities
- **Vulnerability:** `db-schema-guard.ts` (25 KB) ran unparameterized raw SQL (`ALTER TABLE`, `CREATE TABLE`) from user-facing action routes.
- **Risk:** High latency overhead on request hot-paths, risk of accidental column drops, and uncontrolled schema drift between containers.
- **Remediation:** Removed runtime DDL invocations. Replaced with strict deployment-time migrations (`prisma migrate deploy`).

### 2.2 Threat 2: Hardcoded Email & Role Escalation Bypasses
- **Vulnerability:** `src/middleware.ts:202-203` granted admin access if `tokenEmail === 'admin@firuzo.com'` or `userRole === 'ADMIN'`.
- **Risk:** An attacker spoofing an OAuth email token could gain full superadmin privileges, bypassing the database permission matrix.
- **Remediation:** Removed hardcoded email matching in middleware. All administrative routes now query the tenant authentication context and relational `UserRole` table.

### 2.3 Threat 3: Maker-Checker Dual-Authorization Enforcement
- **Vulnerability:** High-value refunds and supplier payouts previously depended on advisory client-side checks.
- **Risk:** Malicious or compromised operator account could initiate and immediately approve unauthorized payouts.
- **Remediation:** Enforced cryptographic assertion `assert(makerId !== checkerId)` in `ApprovalRequestService`. Every decision records an immutable before/after diff in `AuditLog`.
