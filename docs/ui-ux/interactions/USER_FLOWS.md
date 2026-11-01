# USER_FLOWS.md — End-to-End Clinical & Commercial User Journeys
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Interaction Design & User Journey Mapping

> **Core Standard**: Every user journey across Dr Dermer UK must balance strict clinical rigor, physiological credibility, frictionless commercial conversion, and Iranian e-commerce regulatory compliance.
> **Anti-Slop Invariant**: No generic "happy path only" diagrams. Every journey documents input states, validations, edge cases, financial atomicity, and clinical handoffs.

---

## 1. Journey Overview & Archetype Mapping

Dr Dermer UK serves three distinct personas across 43 web routes:
1. **Patient / Home Care Consumer**: Seeking professional dermatological regimens (ReeSkin, CarboxyGel, Healene) for post-procedure or home maintenance, requiring diagnostic validation and skin-type verification.
2. **Clinic / B2B Purchasing Manager**: Dermatological clinics and med-spas purchasing capital medical devices (Carbox, PlasmaX) and bulk consumable packs (CarboxyPod, Crystalene, Silicalene) via formal proforma quotes and tax invoicing.
3. **Doctor / Practitioner CME Candidate**: Certified dermatologists acquiring accredited Continuing Medical Education (CME), surgical protocols, and medical device operating certifications via digital grant mechanics.

```
+----------------------------------------------------------------------------------------------------+
|                                    DR DERMER UK PLATFORM ROUTING                                   |
+----------------------------------------------------------------------------------------------------+
                                                  |
         +----------------------------------------+---------------------------------------+
         |                                        |                                       |
         v                                        v                                       v
[ 1. PATIENT HOME CARE ]               [ 2. CLINIC B2B HARDWARE ]             [ 3. DOCTOR CME GRANTS ]
- Diagnostic Regimen Finder            - 360 Hardware Stage (Carbox/PlasmaX)  - Academy Certification Route
- INCI Dossier & Bohr Simulator        - Tiered Consumable Volume Matrix      - Medical License Modulo-11
- Cart Drawer -> Checkout Flow         - Proforma Quote Request Flow          - LMS & Digital Entitlement
- Shetab Gateway / Card-to-Card        - Double-Entry Proforma Approval       - Clinical Protocol Engine
```

---

## 2. User Flow 1: Patient Home Care Journey

### 2.1 Persona & Context
- **User**: Golnar (34), post-laser resurfacing patient looking for an occlusive healing balm and cellular oxygenation kit.
- **Goal**: Verify active ingredients, ensure contraindication safety, purchase ReeSkin Post-Procedure Kit, and pay via Shetab gateway.

### 2.2 Step-by-Step State Flow

```
+-----------------------+     +-----------------------+     +-----------------------+
|  Discovery & Concern  | --> | Interactive PDP & INCI| --> |  Diagnostic Drawer    |
|  / (Home) / c/reeskin |     | /products/reeskin-kit |     |  Skin Regimen Finder  |
+-----------------------+     +-----------------------+     +-----------------------+
            |                                                           |
            v                                                           v
+-----------------------+     +-----------------------+     +-----------------------+
| Dynamic Cart Drawer   | <-- | Regimen Validation    | <-- | Fitzpatrick Scale     |
| Real-time BigInt calc |     | Bundle Optimization   |     | Selection & Check     |
+-----------------------+     +-----------------------+     +-----------------------+
            |
            v
+-----------------------+     +-----------------------+     +-----------------------+
| Iranian Checkout      | --> | Payment Port Gateway  | --> | Order Success & PDF   |
| Modulo-11 / 09xx SMS  |     | Zarinpal / Mellat / C2C|    | Tracking & Regimen SMS|
+-----------------------+     +-----------------------+     +-----------------------+
```

### 2.3 Interaction Breakdown & Step Matrix

| Step | User Action | System Reaction | Error / Edge State | Recovery Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **1. Concern Discovery** | Clicks "Barrier Repair & Erythema" in `CategoryConcernNav` | Smooth scroll, URL query filter `/c/reeskin?concern=barrier`, cards filter with zero layout shift | Network drop while fetching product cards | Stale-while-revalidate cached cards rendered with warning badge |
| **2. Physiological PDP** | Interacts with `BohrSimulator` on `/products/reeskin-kit` to observe O2 release curve | Canvas re-renders transcutaneous tissue diffusion graph; active ingredients update | Slider dragged past maximum | Clamped to physiological limits (pH 5.2 - 5.8) |
| **3. INCI Inspection** | Expands `InciExplorer` accordion for Centella Asiatica & Sodium Bicarbonate | Modal renders chemical CAS numbers, biological concentration, and UK cosmetic safety dossier | Rapid double tap on mobile | Touch throttled at 250ms; modal backdrop prevents multiple instances |
| **4. Add to Cart** | Selects 150ml clinical dispenser and taps `station-btn-primary` | Outbox event created; drawer slides from right (RTL left) displaying updated Subtotal in Rials | Out of stock during session | Dynamic badge switches to "Pre-order with 48h Cold-Chain" |
| **5. Checkout Form** | Enters National ID (`0012345678`) and Mobile (`09121234567`) | Real-time Modulo-11 check and regex verification; city auto-populated via 10-digit Postal Code lookup | Invalid National ID check digit | Inline red error text under input: "کد ملی نامعتبر است" |
| **6. Gateway Transition** | Selects "درگاه شتابی شاپرک (سامان / ملت)" and submits | POST `/api/payments/intent` with Idempotency Key; creates payment lock; redirects to Shaparak portal | Gateway timeout (> 8000ms) | Automatic fallback to secondary gateway (Zarinpal / Zibal) |
| **7. Order Settlement** | Shaparak redirects back to `/pay/[intentId]` with `RefId` | Double-entry journal written (`DEBIT: Gateway, CREDIT: Inventory/Revenue`); ledger balanced | Payment declined by card issuer | Clear error alert; user options: "Retry Card" or "Pay with Card-to-Card" |

---

## 3. User Flow 2: Clinic B2B Capital Purchasing Journey

### 3.1 Persona & Context
- **User**: Dr. Kaveh (Clinic Director, Tehran Aesthetic Medical Center).
- **Goal**: Evaluate the **Carbox System** and **PlasmaX Surgical Station**, inspect 360-degree internal hardware architecture, request an official Proforma Invoice with Sepidar ERP tax breakdown, and secure lease terms.

### 3.2 Step-by-Step State Flow

```
+---------------------------+     +---------------------------+     +---------------------------+
| B2B Landing & Hardware    | --> | 360 Canvas Hardware Stage | --> | Consumables Volume Matrix |
| /b2b or /carbox           |     | Double-buffered scrub     |     | Tiered discount algorithm |
+---------------------------+     +---------------------------+     +---------------------------+
              |                                                                   |
              v                                                                   v
+---------------------------+     +---------------------------+     +---------------------------+
| Double-Entry Proforma Gen | <-- | Iranian Legal Entity Form | <-- | Request Quote / Cart      |
| Official Sepidar VAT sync |     | National Tax ID & Sheba   |     | /b2b/quote                |
+---------------------------+     +---------------------------+     +---------------------------+
              |
              v
+---------------------------+     +---------------------------+
| Clinical Rep Consultation | --> | Scheduled White-Glove     |
| Video briefing booking    |     | Installation & Training   |
+---------------------------+     +---------------------------+
```

### 3.3 B2B Quote & Pricing Logic Invariants
- **Volume Tiers**:
  - 1–4 Units: Base Price (List Price).
  - 5–19 Units: 12% Volume Discount (`1200 bps`).
  - 20+ Units: 22% Clinic Partner Rate (`2200 bps`).
- **Tax & Proforma Protocol**:
  - 10% Iranian Official VAT (`Value Added Tax`) dynamically added to taxable items.
  - Generates downloadable PDF proforma formatted to Sepidar / Moadian legal standard.
  - Quote valid for 72 hours with fixed Rial-to-FX hedging window.

---

## 4. User Flow 3: Doctor CME Certification & Digital Protocol Journey

### 4.1 Persona & Context
- **User**: Dr. Sanaz (Board-Certified Dermatologist, License # 148920).
- **Goal**: Complete the "Advanced Microplasma Dermal Resurfacing & Transcutaneous CO2" Masterclass, verify medical credentials, stream high-bitrate surgical videos, and receive verifiable CME certification.

### 4.2 Step-by-Step State Flow

```
+---------------------------+     +---------------------------+     +---------------------------+
| Academy Catalog           | --> | Medical Credential Gate   | --> | Digital Grant Checkout    |
| /academy                  |     | Iranian Medical Council   |     | Zero-price or Paid Token  |
+---------------------------+     +---------------------------+     +---------------------------+
                                                |                                 |
                                                v                                 v
+---------------------------+     +---------------------------+     +---------------------------+
| Verifiable CME PDF Cert   | <-- | Knowledge Assessment      | <-- | Surgical Video Stream     |
| Cryptographic Hash & QR   |     | Passing grade >= 85%      |     | Protocol Step Simulation  |
+---------------------------+     +---------------------------+     +---------------------------+
```

### 4.3 Credential Verification Rules
- **Medical Council ID Validation**: Checked against national registry format (1 to 6 numerical digits with prefix specialization).
- **Grant Token Entitlement**: Stored in `DigitalGrant` record with SHA-256 fingerprint; stream URLs generated with time-limited signed tokens (TTL: 120 minutes) preventing direct URL leakage.
- **Certificate Cryptography**: Output PDF contains embedded digital signature and URL QR code pointing to `/academy/verify/[certId]`.

---

## 5. Global Navigation & Cross-Device Transitions

### 5.1 Responsive Transitions (Breakpoints: 375px, 768px, 1280px, 1440px)
- **Mobile (< 640px)**:
  - Header collapses to sticky glassmorphic navigation bar with hamburger drawer trigger and bag counter.
  - Active sticky bottom bar on PDP (`StickyCartBar`) with price, quantity adjuster, and single-tap checkout.
  - Touch gestures on `CanvasSequencePlayer`: 1:1 finger swipe translation with 0.92 friction deceleration factor.
- **Desktop (>= 1024px)**:
  - Mega-menu with clinical brand families (`ReeSkin`, `CarboxyGel`, `PlasmaX`, `Academy`, `B2B`).
  - Side-by-side sticky layout on PDP: left column hardware 360 viewer, right column clinical indications, INCI breakdown, and purchase controls.

---

## 6. Verification & Accessibility Acceptance Criteria
1. **RTL Directional Fidelity**: All chevron icons, drawer entrances, progress bars, and tab navigation must flip logically (`transform: scaleX(-1)` or native logical CSS properties).
2. **Keyboard Navigation**: Entire journey operable via `Tab`, `Shift+Tab`, `Space`, and `Enter`. Trap focus in modal sheets and drawers.
3. **Screen Reader Landmarks**: Every journey step announces state changes via `aria-live="polite"` (e.g., "محصول به سبد خرید اضافه شد").
