# iTrip Enterprise ERP — Module Specifications (Phase 3)

**Platform:** iTrip / Firuzo Unified Travel & Commerce Operating System  
**Document:** Detailed Functional & Technical Specifications per ERP Module  
**Version:** 2.0.0-ENTERPRISE  
**Scope:** Core Enterprise Back-Office & Operational Modules

---

## 1. Organization & Multi-Tenancy Hierarchy (`org-core`)

### 1.1 Purpose & Business Context
Manages the corporate structure of iTrip, partner travel agencies, corporate client accounts, and internal branch offices. Ensures strict data segregation across independent commercial entities.

### 1.2 Data Model & Structural Invariants
- **Entities:** `Organization`, `OrganizationBranch`, `OrganizationMembership`, `AgencyCreditAgreement`.
- **Invariants:**
  - Every agency branch belongs to exactly one parent organization: `OrganizationBranch(organizationId)`.
  - An organization must possess a non-negative credit limit: `creditLimit >= 0` and `availableCredit <= creditLimit`.
  - User memberships within an organization enforce uniqueness: `@@unique([organizationId, userId])`.

### 1.3 Service API Contract (`OrganizationService`)
```typescript
interface IOrganizationService {
  createOrganization(input: CreateOrgDto): Promise<Organization>;
  createBranch(orgId: string, input: CreateBranchDto): Promise<OrganizationBranch>;
  updateCreditLimit(orgId: string, newLimit: Decimal, actorId: string): Promise<CreditUpdateResult>;
  verifyCreditAvailability(orgId: string, requestedAmount: Decimal): Promise<boolean>;
  listMembers(orgId: string, options: PaginationOptions): Promise<PaginatedMembers>;
}
```

---

## 2. General Ledger & Statutory Accounting (`gl-core`)

### 2.1 Purpose & Business Context
Serves as the financial source of truth for the enterprise. Complies with Iranian accounting standards and International Financial Reporting Standards (IFRS).

### 2.2 Account Taxonomy (Chart of Accounts)
- `1000 - Assets`
  - `1010 - Cash on Hand (Petty Cash)`
  - `1020 - Bank Accounts (Mellat, Saman, Pasargad)`
  - `1030 - Payment Gateway Clearing (Zarinpal, Ecardo)`
  - `1040 - Accounts Receivable (Agencies & B2B)`
- `2000 - Liabilities`
  - `2010 - Accounts Payable (GDS Suppliers & Airlines)`
  - `2020 - Unearned Customer Revenue (Escrow)`
  - `2030 - VAT / Value Added Tax Payable (10%)`
- `3000 - Equity`
  - `3010 - Retained Earnings`
- `4000 - Operating Revenue`
  - `4010 - Flight Booking Revenue`
  - `4020 - Hotel & Accommodation Margin`
  - `4030 - Tour Package Revenue`
- `5000 - Cost of Goods Sold (COGS)`
  - `5010 - GDS Ticket Procurement Costs`
  - `5020 - Payment Gateway Surcharges`

### 2.3 Mathematical Invariants & Journal Assertion
$$\forall \text{ JournalEntry } j: \sum_{l \in j.\text{lines}} l.\text{debit} = \sum_{l \in j.\text{lines}} l.\text{credit}$$
Any imbalance triggers immediate rollback and logs a fatal `FinancialImbalanceException`.

---

## 3. Accounts Receivable & Accounts Payable (`ar-ap-core`)

### 3.1 Accounts Receivable (AR) Workflow
1. Agency creates a booking on credit terms.
2. System checks `availableCredit >= bookingTotal`.
3. An invoice is issued with statutory Jalali numbering and Net 15 terms.
4. If payment is not received within 15 days, status transitions to `PAST_DUE`.
5. Upon reaching 30 days overdue, agency booking privileges are automatically suspended via `AgencyLockoutWorker`.

### 3.2 Accounts Payable (AP) Three-Way Match Workflow
1. Local `BookingItem.netCost` is recorded upon ticket issuance.
2. At month-end, the supplier GDS billing statement (Parto/Nadia) is imported.
3. Automated reconciliation engine matches PNR, Date, and Amount:
   - Match: Scheduled for batch payment.
   - Mismatch $> 1\%$: Routed to `ExceptionCenter` for manual triage.

---

## 4. Travel File Operations Dossier (`travel-ops`)

### 4.1 Purpose & Business Context
Consolidates all fragmented operational data (PNRs, hotel vouchers, payments, refunds, customer passport copies, and internal operator notes) into a single unified workspace per traveler or group.

### 4.2 Key Capabilities
- **Timeline Activity Stream:** Chronological log of every customer interaction and status transition.
- **Automated PNR & Voucher Generation:** Real-time generation of encrypted, verifiable travel vouchers with QR codes.
- **Task Assignment:** Operational staff assignment with automated deadline tracking.

---

## 5. Central Maker-Checker Approval Center (`workflow-core`)

### 5.1 Purpose & Business Context
Guarantees separation of duties across sensitive financial and operational procedures.

### 5.2 Mandatory Dual-Approval Thresholds
| Operation Type | Threshold Limit | Maker | Checker |
|---|---|---|---|
| **Customer Refund** | $> 50,000,000\text{ IRR}$ | Support Agent | Finance Supervisor |
| **High-Value Refund** | $> 250,000,000\text{ IRR}$ | Finance Supervisor | Chief Financial Officer |
| **Supplier Settlement** | $> 500,000,000\text{ IRR}$ | Operations Accountant | General Manager |
| **Agency Credit Increase** | Any amount | Agency Account Rep | Risk & Finance Director |
| **Financial Journal Reversal**| Any amount | Accountant | Financial Controller |

### 5.3 System Rules
- The user submitting the request is cryptographically recorded as `makerId`.
- The approving user (`checkerId`) cannot match `makerId`: `assert(makerId !== checkerId)`.
- Approval requests carry an automated 48-hour SLA expiry, after which they auto-escalate.
