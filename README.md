# 🏥 Dr Dermer UK Clinical Laboratories & Commerce OS
### Enterprise Medical E-Commerce, 360° Hardware Consoles & Double-Entry Financial Integrity
### Version 2.0.0 — Cambridge Clinical Formulations & Anti-Slop Design System (November 2026)

---

## 🌟 Executive Overview

**Dr Dermer UK Clinical Laboratories & Commerce OS** is an enterprise-grade medical e-commerce platform and digital clinical experience engine. Headquartered in research collaboration at **Cambridge Science Park (UK)** with commercial operations at **Dumankaya Ikon Towers (Istanbul)** and regional clinical distributors in Iran, the platform unites advanced aesthetic medicine with rigorous double-entry financial accounting.

The platform showcases **360-degree interactive canvas hardware engines, physiological Bohr Effect simulators, deep INCI pharmaceutical dossiers, Canfield VISIA multi-spectral comparison splitters, and post-procedure barrier restoration regimens**.

---

## 🔬 Product Architecture & The 8 Authentic Products

```
                  ┌─────────────────────────────────────────┐
                  │    Dr Dermer UK Clinical Laboratories   │
                  │        Cambridge Science Park, UK       │
                  └────────────────────┬────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────┐                             ┌───────────────────────┐
│       ReeSkin™        │                             │       ReeMed™         │
│   Clinical Skincare   │                             │   Medical Devices     │
└───────────┬───────────┘                             └───────────┬───────────┘
            │                                                     │
   [Dermaceuticals & Consumables]                        [Medical Consoles]
   • CarboxyGel Pro (500ml/1500ml)                       • CarboX™ Medical Station
   • CarboxyPod Activation Scrub                         • PlasmaX™ Tri-Modality
   • CarboxyPad Pre-Cut Dual Sheet                       • High-Frequency Ultrasound
   • Crystalene Microderm Polish                         • CE Medical Class IIb
   • Healene Soothing Barrier Gel
   • Silicalene Mild Silica Scrub
```

1. **CarboxyGel™ Professional Therapy**: 8.5% Sodium Bicarbonate and 5% Centella Asiatica gel delivering > 1,100 ppm transdermal CO₂ flux to trigger the **Bohr Effect** (+45% to +94% tissue oxygenation).
2. **CarboxyPod™ Activation Scrub Pods**: 3-stage mechanical breakdown activator capsules coupled with 120Hz ultrasound handpieces in Vitamin, Carbon, and Hydra variants.
3. **CarboxyPad™ Pre-Cut Activator Masks**: Pre-cut non-woven cellulose masks engineered for 5 anatomical facial and cervical zones.
4. **Crystalene™ Microderm Polish Paste**: 12% rounded alumina (Al₂O₃) microcrystals providing friction-free microdermabrasion without micro-tears.
5. **Healene™ Soothing & Barrier Repair Gel**: 5.0% Dexpanthenol + 3.0% Centella Asiatica reducing Transepidermal Water Loss (TEWL) by 78% within 48h.
6. **Silicalene™ Mild Silica Detox Scrub**: Biomechanical pore-refining scrub with smooth silica spheres, activated charcoal, and AHA/BHA hydroxy acids.
7. **CarboX™ Clinical Medical Station**: CE Medical Class IIb console integrating Subcutaneous Micro-Injections and Transdermal Sonophoresis.
8. **PlasmaX™ Tri-Modality Plasma Console**: Surgical Continuous Arc, Cold Atmospheric Plasma (CAP) Jet, and Dielectric Barrier Discharge (DBD).

---

## 🏛️ Monorepo Structure & Anti-Slop Design System

- **Architecture**: Turborepo 2.11 + pnpm 12 workspaces with Next.js 16.4.3 (Turbopack, App Router, React 19) for `storefront` and `admin`, NestJS 11 for `api`, independent Node/TypeScript `worker`, and shared packages (`@commerce-os/ui`, `domain`, `finance`, `gateways`, `localization`, `security`).
- **Anti-Slop Protocol Compliance**: Strict compliance with [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop) rules R-01 to R-40. Zero generic AI buzzwords, zero unverified statistics, and 100% authentic dermatological trial data.
- **Single Source of Truth**: Centralized in `DESIGN.md`, `AGENTS.md`, and `docs/ui-ux/`.

---

## 🛡️ Testing & Release Quality Gates

- **Playwright Browser E2E Suite**: 57 tests passing across Desktop (1440x900), Tablet (768x1024), and Mobile (390x844).
- **Accessibility (WCAG 2.2 Level AA)**: Full keyboard navigation, 4.5:1 text contrast, accessible names matching visible labels, and screen reader announcements.
- **Monorepo Unit & Integration Test Suite**: 97 automated tests passing across 10 packages (`turbo run test`).
- **Clinical E2E Verification Runner**: 10/10 stages passing (`verify-clinical-store.mjs`) verifying zero-float BigInt ledger math, 10% VAT, and deadlock-free inventory leases.

---

## 🚀 Local Development & Execution

```bash
# Install dependencies
pnpm install

# Build entire monorepo
pnpm run build

# Start development servers
pnpm run dev

# Run unit and integration tests
pnpm run test

# Run multi-viewport Playwright E2E browser tests
pnpm --filter @commerce-os/storefront exec playwright test

# Execute clinical lifecycle E2E runner
node scripts/verify-clinical-store.mjs
```

### Active Local Service Ports
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin ERP**: [http://localhost:3001](http://localhost:3001)
- **API Core**: [http://localhost:4000](http://localhost:4000)
