# USER_FLOWS.md — End-to-End Clinical & Commercial User Journeys
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Interaction Design & User Journey Mapping

> **Core Standard**: Every user journey across Dr Dermer UK must balance strict clinical rigor, physiological credibility, frictionless commercial conversion, and Iranian e-commerce regulatory compliance.
> **Anti-Slop Invariant**: No generic "happy path only" diagrams. Every journey documents input states, validations, edge cases, financial atomicity, and clinical handoffs.

---

## 1. Journey Overview & Archetype Mapping

Dr Dermer UK serves retail consumers across 31 page routes (B2B/clinic, vendor and academy journeys were retired with the 2026-11-07 business pivot):
1. **Patient / Home-Care Consumer**: Seeking professional dermatological regimens (ReeSkin مصرفی خانگی — CarboxyGel, CarboxyPod, CarboxyPad, Healene) for post-procedure or home maintenance, requiring diagnostic validation and skin-type verification.
2. **Advanced Regimen / Clinical Solutions Consumer**: Purchasing ReeMed محلول‌های کلینیکی and multi-unit consumable supplies with tiered volume discounts, optional auto-replenishment subscriptions, and formal tax invoicing backed by the double-entry ledger.

```
+----------------------------------------------------------------------------------------------------+
|                                    DR DERMER UK PLATFORM ROUTING                                   |
+----------------------------------------------------------------------------------------------------+
                                                  |
         +----------------------------------------+---------------------------------------+
         |                                        |
         v                                        v
[ 1. PATIENT HOME CARE ]               [ 2. CLINICAL SOLUTIONS & KNOWLEDGE ]
- Diagnostic Regimen Finder            - ReeMed محلول‌های کلینیکی rails (/reemed)
- INCI Dossier & Bohr Simulator        - Tiered multi-unit volume discounts
- Cart Drawer -> Checkout Flow         - Auto-Replenishment Subscriptions
- Shetab Gateway / Card-to-Card        - Knowledge & Research Guides (Blog) + INCI Encyclopedia
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
| **1. Concern Discovery** | Clicks "Barrier Repair & Erythema" in `CategoryConcernNav` | Smooth scroll, URL query filter `/search?concern=barrier`, cards filter with zero layout shift | Network drop while fetching product cards | Stale-while-revalidate cached cards rendered with warning badge |
| **2. Physiological PDP** | Interacts with `BohrSimulator` on `/products/reeskin-kit` to observe O2 release curve | Canvas re-renders transcutaneous tissue diffusion graph; active ingredients update | Slider dragged past maximum | Clamped to physiological limits (pH 5.2 - 5.8) |
| **3. INCI Inspection** | Expands `InciExplorer` accordion for Centella Asiatica & Sodium Bicarbonate | Modal renders chemical CAS numbers, biological concentration, and UK cosmetic safety dossier | Rapid double tap on mobile | Touch throttled at 250ms; modal backdrop prevents multiple instances |
| **4. Add to Cart** | Selects 150ml clinical dispenser and taps `station-btn-primary` | Outbox event created; drawer slides from right (RTL left) displaying updated Subtotal in Rials | Out of stock during session | Dynamic badge switches to "Pre-order with 48h Cold-Chain" |
| **5. Checkout Form** | Enters National ID (`0012345678`) and Mobile (`09121234567`) | Real-time Modulo-11 check and regex verification; city auto-populated via 10-digit Postal Code lookup | Invalid National ID check digit | Inline red error text under input: "کد ملی نامعتبر است" |
| **6. Gateway Transition** | Selects "درگاه شتابی شاپرک (سامان / ملت)" and submits | POST `/api/payments/intent` with Idempotency Key; creates payment lock; redirects to Shaparak portal | Gateway timeout (> 8000ms) | Automatic fallback to secondary gateway (Zarinpal / Zibal) |
| **7. Order Settlement** | Shaparak redirects back to `/pay/[intentId]` with `RefId` | Double-entry journal written (`DEBIT: Gateway, CREDIT: Inventory/Revenue`); ledger balanced | Payment declined by card issuer | Clear error alert; user options: "Retry Card" or "Pay with Card-to-Card" |

---

## 3. User Flow 2: Clinical Solutions & Replenishment Journey

### 3.1 Persona & Context
- **User**: Sahar (41), long-term Bohr-therapy consumer building an advanced home routine with ReeMed محلول‌های کلینیکی and bulk CarboxyPod refills.
- **Goal**: Purchase a multi-unit supply with the tiered volume discount, set up auto-replenishment, and receive a formal tax invoice settled through the double-entry ledger.

### 3.2 Step-by-Step State Flow

```
+---------------------------+     +---------------------------+     +---------------------------+
| Line Landing (/reemed)    | --> | Multi-Unit Cart Builder   | --> | Subscription Plan Select  |
| Clinical Solutions rails  |     | Tiered discount preview   |     | /subscriptions (optional) |
+---------------------------+     +---------------------------+     +---------------------------+
              |                                                        |
              v                                                        v
+---------------------------+     +---------------------------+     +---------------------------+
| Iranian Checkout          | --> | Payment Gateway           | --> | Order Success & Invoice   |
| Modulo-11 / 09xx SMS      |     | Zarinpal / Card-to-Card   |     | VAT invoice + ledger entry|
+---------------------------+     +---------------------------+     +---------------------------+
```

### 3.3 Pricing & Replenishment Invariants
- **Volume Tiers**: tiered volume discounts are computed server-side in the pricing quote (e.g. 5% for 3+ identical items) — never client-side; the quote is immutable with a fingerprint and 15-minute TTL.
- **Tax Protocol**: 10% Iranian Official VAT applied to the taxable base; every paid order writes a balanced double-entry journal (`SUM(DEBIT) === SUM(CREDIT)`).
- **Subscriptions**: auto-replenishment binds a plan to the phone number with `nextRunAt` scheduling; pause/resume/cancel are guarded state-machine transitions (`ACTIVE → PAUSED → CANCELLED`).

---

## 4. Global Navigation & Cross-Device Transitions

### 4.1 Responsive Transitions (Breakpoints: 375px, 768px, 1280px, 1440px)
- **Mobile (< 640px)**:
  - Header collapses to sticky glassmorphic navigation bar with hamburger drawer trigger and bag counter.
  - Active sticky bottom bar on PDP (`StickyCartBar`) with price, quantity adjuster, and single-tap checkout.
  - Touch gestures on `CanvasSequencePlayer`: 1:1 finger swipe translation with 0.92 friction deceleration factor.
- **Desktop (>= 1024px)**:
  - Mega-menu with the 6-product retail catalog (CarboxyGel, CarboxyPod, CarboxyPad, Crystalene, Healene, Silicalene), line pages (`/reeskin`, `/reemed`) and knowledge links (Blog, INCI encyclopedia).
  - Side-by-side sticky layout on PDP: left column media gallery with interactive simulators (protocol timer, INCI explorer), right column clinical indications, INCI breakdown, and purchase controls.

---

## 5. Verification & Accessibility Acceptance Criteria
1. **RTL Directional Fidelity**: All chevron icons, drawer entrances, progress bars, and tab navigation must flip logically (`transform: scaleX(-1)` or native logical CSS properties).
2. **Keyboard Navigation**: Entire journey operable via `Tab`, `Shift+Tab`, `Space`, and `Enter`. Trap focus in modal sheets and drawers.
3. **Screen Reader Landmarks**: Every journey step announces state changes via `aria-live="polite"` (e.g., "محصول به سبد خرید اضافه شد").
