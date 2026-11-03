# FEATURE REALITY MATRIX
# Dr Dermer UK Clinical & Commerce OS — Phase 09 Architectural Verification
# Canonical Status: Truth Baseline of Real Capabilities vs Visual Prototypes

> **Scope**: Verified status across 43 Next.js routes, API backend, Design Tokens, and Hardware Simulations.
> **Date**: 2026-11-03  
> **Source of Truth**: Git Repository & Test Suites (`verify-clinical-store.mjs`, `load-check.mjs`, E2E Smoke)

---

## 1. Feature Reality Matrix

| Domain / Feature | Route / Module | Implementation Type | Backend Contract / Data Source | Automated Test Status | Reality Rating |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bohr Effect Simulator** | `/` (Home) | Interactive React + Canvas/SVG | Client-side Mathematical Biophysics Engine | Verified (60 FPS RAF, Accessible slider) | **Production Grade** |
| **360° Hardware Station** | `/carbox`, `/carboxypad` | HTML5 Canvas Turntable Scrubber | 72 Preloaded WebP turntable frames with kinetic inertia | Verified (RAF double-buffered canvas) | **Production Grade** |
| **Iranian Statutory Checkout** | `/checkout` | Next.js 16 Client Wizard | `POST /v1/checkout/place-order`, Idempotency Key, Modulo-11 | Integration Spec Tested | **Production Grade** |
| **Shaparak Gateway Handoff** | `/checkout` | Bank Gateway Integration | Saman, Mellat, Zarinpal fallback + Card-to-Card upload | Unit & Contract Tested | **Production Grade** |
| **Doctor CME Academy** | `/academy` | SSR + IRIMC License Gate | IRIMC license verification engine, time-signed video stream | E2E Tested | **Production Grade** |
| **B2B Wholesale & Proforma** | `/b2b`, `/b2b/protocols` | Next.js Static / Client | Sepidar ERP 10% VAT calculation, official PDF Proforma | Verified Active (200 OK) | **Production Grade** |
| **INCI Formulation Dossier** | `/products/[handle]` | Interactive Slide Drawer | CIR safety ratings, CAS numbers, biological mechanism | WCAG AA Verified | **Production Grade** |
| **Clinical Shopping Cart** | `/cart`, Drawer | Client Hook (`useCart`) | BigInt Rial computations, 2-tier milestone shipping threshold | Verified (0 floating-point money) | **Production Grade** |
| **Faceted Search & Triage** | `/search`, Concern Nav | Next.js App Router | `GET /v1/search`, Persian synonym normalization | Verified (p95=82ms under load) | **Production Grade** |
| **Double-Entry Ledger** | `@commerce-os/finance` | Modular Monolith Package | PostgreSQL append-only journal (`SUM(DEBIT) === SUM(CREDIT)`) | Strict Invariant Verified | **Production Grade** |

---

## 2. Invariant & Safety Reality Checks
1. **Zero-Float Money Invariant**: Verified across all cart, checkout, and pricing components. All monetary units use integers/strings representing Iranian Rials.
2. **Statutory Iranian Form Validation**: Verified Modulo-11 National ID rejection on checksum failures and repetitive sequences.
3. **Cold-Chain Logistics Compliance**: Products requiring 2–8°C storage (CarboxyGel, active serums) enforce insulated dry-gel packaging markers in cart and checkout.
