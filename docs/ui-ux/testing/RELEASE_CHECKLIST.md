# RELEASE_CHECKLIST.md — Pre-Release UI/UX Quality & Audit Gates
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Storefront UI/UX Pre-Release Verification Protocol

> **Core Standard**: Before any frontend release, version tag, or staging-to-production promotion, every UI/UX gate must be certified with objective evidence. A single red item halts the deployment (**No-Go**).
> **Anti-Slop Invariant**: "Looks good on my machine" is unacceptable. All checks require automated logs, visual diff certifications, or reproducible Playwright test outputs.

---

## 1. Pre-Release Quality Gates Matrix

```
+----------------------------------------------------------------------------------------------------+
|                                    UI/UX PRE-RELEASE AUDIT GATES                                   |
+----------------------------------------------------------------------------------------------------+
  Gate U1: Anti-Slop & Asset Authenticity       --> Zero placeholders, zero fake claims, real INCI
  Gate U2: Design Token & Theme Compliance      --> Obsidian, Cyan, Plasma, Emerald palette adherence
  Gate U3: RTL & Persian Typography (Vazirmatn)  --> Tabular numerals, logical CSS properties, no leak
  Gate U4: Viewport Fluidity & Breakpoints      --> Pixel-perfect on 375px, 768px, 1440px
  Gate U5: Interaction Physics & Hardware 360   --> 60fps canvas, Bohr slider, inertial scrubber
  Gate U6: Form Validation & Iranian Standards  --> 09xx mobile, National ID Modulo-11, Sheba Mod-97
  Gate U7: Accessibility (WCAG 2.2 Level AA)    --> 4.5:1 contrast, visible focus rings, keyboard traps
  Gate U8: Core Web Vitals & Bundle Budget      --> LCP < 2.0s, CLS < 0.05, INP < 150ms, JS < 120KB
```

---

## 2. Detailed Gate Verification Checklists

### Gate U1: Anti-Slop & Asset Authenticity
- [ ] **No Placeholders**: Zero `Lorem Ipsum`, zero placeholder gray rectangles, zero unverified stock images.
- [ ] **Authentic Clinical Formulas**: ReeSkin, CarboxyGel, and PlasmaX technical dossiers include verified CAS numbers and medical concentrations.
- [ ] **No Dead Routes or 404s**: All internal links across all 43 routes resolve to live, functional pages.
- [ ] **Clinical Claim Safety**: All cosmetic and dermal efficacy claims comply with UK cosmetic safety regulations and Iranian FDA standards.

### Gate U2: Design Token & Theme Compliance
- [ ] **CSS Variable Usage**: Zero hardcoded hex colors outside standardized variables (`DESIGN.md`).
- [ ] **Surface Consistency**: Dark obsidian canvas (`#070b12` to `#0a111a`) maintained across all routes.
- [ ] **Glassmorphism Spec**: Translucent panels use standardized `rgba(15, 23, 42, 0.72)` with `backdrop-filter: blur(16px)` and subtle border lines `rgba(255, 255, 255, 0.08)`.
- [ ] **Brand Color Semantics**:
  - Cyan (`#06b6d4`): ReeSkin clinical formulations & Bohr effect.
  - Plasma Violet (`#8b5cf6`): PlasmaX surgical energy stations.
  - Emerald Green (`#10b981`): Crystalene microderm & natural bio-inerts.
  - Amber (`#f59e0b`): Retinoids, peels, and alert warnings.

### Gate U3: RTL & Persian Typography (Vazirmatn)
- [ ] **Directionality**: Document root sets `dir="rtl"` with full Persian language declaration `lang="fa-IR"`.
- [ ] **Font Rendering**: Vazirmatn font family loaded with correct line-height (`1.7` to `1.85`) for Persian text.
- [ ] **Tabular Numerals**: All monetary amounts, phone numbers, quantities, and timer countdowns use `font-variant-numeric: tabular-nums`.
- [ ] **Directional Iconography**: Chevrons, back arrows, drawer transitions, and timeline arrows flip logically in RTL mode.
- [ ] **CSS Logical Properties**: Layout spacing uses `margin-inline`, `padding-inline`, and `inset-inline` rather than hardcoded `left`/`right`.

### Gate U4: Viewport Fluidity & Responsive Breakpoints
- [ ] **Mobile (375px - 639px)**:
  - Sticky bottom action bar (`StickyCartBar`) present on all PDPs.
  - Cart drawer and navigation menu open smoothly without horizontal page overflow (`overflow-x: hidden`).
  - Tap targets minimum 48px x 48px with at least 8px spacing between adjacent touch elements.
- [ ] **Tablet (640px - 1023px)**:
  - 2-column card grid reflow without awkward line breaks.
  - Bohr effect range slider easily draggable on touchscreens.
- [ ] **Desktop High-Res (1024px - 1440px+)**:
  - Sticky side-by-side hardware stage and clinical spec columns.
  - Mega-menu navigation operational via both hover and keyboard navigation.

### Gate U5: Interaction Physics & Hardware 360
- [ ] **Double-Buffered Canvas**: 360-degree turntable scrubber (`CanvasSequencePlayer`) decodes frames into memory without frame flicker.
- [ ] **Touch Inertia**: Release of canvas scrubber continues smooth inertial rotation with friction dampening (`0.92`).
- [ ] **Buffer Loading State**: Incomplete turntable frame sequence displays radial buffer percentage gauge instead of broken images.
- [ ] **Bohr Effect Simulator**: Range slider operates smoothly, updating transcutaneous CO2/O2 diffusion graphs in real-time.

### Gate U6: Form Validation & Iranian Statutory Rules
- [ ] **Iranian Mobile (`09xx`)**: Validates 11-digit syntax, normalizes Persian numerals to ASCII, and formats with pattern `09## ### ####`.
- [ ] **Iranian National ID (`کد ملی`)**: Strict Modulo-11 checksum validation; rejects repetitive sequences (`1111111111`).
- [ ] **Postal Code (`کد پستی`)**: 10-digit validation ensuring no `0` or `2` in first 5 digits.
- [ ] **Medical License**: 4-6 digit numeric validation for Doctor CME masterclasses and B2B clinic quote requests.
- [ ] **Sheba Number**: ISO 7064 Mod 97-10 IBAN validation for bank settlement.

### Gate U7: Accessibility (WCAG 2.2 Level AA)
- [ ] **Automated Scan**: Zero Axe Core violations across all 43 routes (`e2e/a11y/accessibility.spec.ts`).
- [ ] **Color Contrast**: Minimum 4.5:1 text contrast for body copy; 3:1 for large headings and interactive icons.
- [ ] **Keyboard Navigation**: Complete user flow operable via `Tab`, `Shift+Tab`, `Space`, `Enter`, and `Escape`.
- [ ] **Focus Rings**: High-visibility 2px cyan outline with 2px offset visible on all focused elements.
- [ ] **Focus Trapping**: Modals and slide-out drawers trap keyboard focus within their bounds.
- [ ] **Reduced Motion**: All animations immediately collapse when `prefers-reduced-motion: reduce` is active.

### Gate U8: Performance, Core Web Vitals & Build Cleanliness
- [ ] **Largest Contentful Paint (LCP)**: Under `2.0 seconds` on simulated 4G mobile.
- [ ] **Cumulative Layout Shift (CLS)**: Under `0.05` across all route transitions.
- [ ] **Interaction to Next Paint (INP)**: Under `150ms`.
- [ ] **Production Build**: `pnpm --filter @commerce-os/storefront run build` exits with code `0`.
- [ ] **TypeScript Check**: `pnpm tsc --noEmit` returns zero errors and zero warnings.

---

## 3. Go / No-Go Sign-Off Form

| Gate | Category | Evaluator | Status (Pass / Fail) | Artifact Reference |
| :--- | :--- | :--- | :--- | :--- |
| **U1** | Anti-Slop & Authenticity | QA Lead | `[ ] PASS / [ ] FAIL` | Static scan report |
| **U2** | Design System Tokens | Design Lead | `[ ] PASS / [ ] FAIL` | Storybook token audit |
| **U3** | RTL & Persian Typography | I18n Lead | `[ ] PASS / [ ] FAIL` | RTL visual inspection |
| **U4** | Responsive Viewports | Frontend Lead | `[ ] PASS / [ ] FAIL` | Mobile/Desktop baselines |
| **U5** | Interaction Physics | Interaction Lead | `[ ] PASS / [ ] FAIL` | 60fps canvas trace |
| **U6** | Iranian Form Rules | Compliance Lead | `[ ] PASS / [ ] FAIL` | Modulo-11 test suite |
| **U7** | WCAG 2.2 AA Accessibility| A11y Lead | `[ ] PASS / [ ] FAIL` | Axe Core test output |
| **U8** | Build & Core Web Vitals | Release Engineer | `[ ] PASS / [ ] FAIL` | Build log (Exit 0) |

**Final Recommendation**: `[ ] GO FOR DEPLOYMENT` | `[ ] NO-GO (HALT RELEASE)`
