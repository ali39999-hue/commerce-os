# DEFINITION_OF_DONE.md — Platform-Wide Quality Invariants & Exit Criteria
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Definition of Done (DoD) & Acceptance Gates

> **Core Standard**: No feature, route, or component is considered complete until it satisfies all non-negotiable platform quality criteria.
> **Anti-Slop Invariant**: Partial implementations, visual mocks without backing logic, and unverified layouts are strictly forbidden from entering production.

---

## 1. The Non-Negotiable Quality Invariants

Every pull request, task completion, and release candidate must pass all 6 invariant gates:

```
+----------------------------------------------------------------------------------------------------+
|                                      THE 6 NON-NEGOTIABLE GATES                                    |
+----------------------------------------------------------------------------------------------------+
  [GATE 1] Zero Slop & Clinical Authenticity      --> 100% verified claims, real INCI, no AI fluff
  [GATE 2] Accessibility Compliance (WCAG 2.2 AA)  --> 4.5:1 contrast, keyboard trap, screen readers
  [GATE 3] Responsive Fluidity (375px - 1440px)   --> Mobile, tablet, desktop pixel-perfect reflow
  [GATE 4] Financial & Data Atomicity              --> BigInt Rials, zero float, outbox reservation
  [GATE 5] Clean Production Build (Exit 0)         --> Zero TS errors, zero lint warnings, build pass
  [GATE 6] Verification Evidence & Test Sign-off   --> Playwright passing, documented progress logs
```

---

## 2. Detailed Gate Criteria & Checklist

### Gate 1: Zero Slop & Clinical Authenticity
- [ ] **No Placeholders**: Zero `Lorem Ipsum`, zero stock photo watermarks, zero gray dummy boxes.
- [ ] **Authentic Ingredients**: All INCI formulations reflect real biochemical complexes (Centella Asiatica, Sodium Bicarbonate, Hyaluronic Acid, etc.).
- [ ] **Authentic Physics**: 360-degree turntable frames and Bohr effect oxygenation graphs adhere to accurate physical and biological behavior.
- [ ] **Persian Copywriting**: Written in natural, professional medical Persian without awkward literal machine translations.

### Gate 2: Accessibility (WCAG 2.2 Level AA)
- [ ] **Contrast Ratios**: Minimum 4.5:1 contrast for regular text; 3:1 for large text and interactive icons against dark obsidian canvas.
- [ ] **Full Keyboard Navigation**: Every interactive control reachable and operable via keyboard alone (`Tab`, `Enter`, `Space`, `Arrow keys`, `Escape`).
- [ ] **Visible Focus Indicators**: Clear 2px cyan/blue focus rings on `:focus-visible` with zero outline clipping.
- [ ] **Aria Attributes**: Proper roles (`role="dialog"`, `role="slider"`, `role="tab"`), states (`aria-expanded`, `aria-selected`, `aria-busy`), and live regions (`aria-live="polite"`).
- [ ] **Reduced Motion**: All animations immediately disable or collapse to simple instant switches when `prefers-reduced-motion: reduce` is detected.

### Gate 3: Responsive Viewport Fluidity (375px to 1440px)
- [ ] **Mobile (375px - 639px)**:
  - Touch targets minimum 48px x 48px.
  - Sticky bottom action bar (`StickyCartBar`) on all PDPs.
  - Drawers open smoothly from edge without horizontal page scrolling (`overflow-x: hidden`).
- [ ] **Tablet (640px - 1023px)**:
  - Responsive 2-column card reflow.
  - Collapsible clinical sidebars.
- [ ] **Desktop (1024px - 1440px+)**:
  - Sticky side-by-side hardware stages and formulation specs.
  - Mega-menu navigation with brand family hierarchies.
- [ ] **Zero Layout Shift**: Cumulative Layout Shift (CLS) <= 0.05 across all breakpoints during hydration and data loading.

### Gate 4: Financial & Transactional Integrity
- [ ] **BigInt Currency**: All Rial prices, subtotals, tax amounts, and discounts represented as `bigint` (zero floating-point math).
- [ ] **Modulo-11 Checksums**: All Iranian National IDs validated with full Modulo-11 algorithm before submitting checkout forms.
- [ ] **Regulatory Tax Breakdown**: 10% VAT accurately calculated and itemized for official B2B invoices.
- [ ] **Idempotency Keys**: All payment mutations send unique UUID idempotency keys to prevent duplicate transactions.

### Gate 5: Clean Production Build (Exit Code 0)
- [ ] **TypeScript Check**: `pnpm tsc --noEmit` runs with 0 errors and 0 warnings under `strict: true`.
- [ ] **Next.js Production Build**: `pnpm --filter @commerce-os/storefront run build` completes successfully with exit code `0`.
- [ ] **Clean Console**: Zero hydration mismatch errors (`react-hydration-error`) in browser console during test runs.
- [ ] **Bundle Budget**: Initial route JavaScript payload under 120KB gzipped.

### Gate 6: Documentation & Progress Verification
- [ ] **Page Contract Sync**: Page documentation in `docs/ui-ux/pages/` matches current component layout and behavior.
- [ ] **Interaction Matrix Updated**: Any new micro-interaction or state documented in `docs/ui-ux/interactions/`.
- [ ] **Progress Tracker Updated**: Completed items checked off in `docs/ui-ux/roadmap/PROGRESS.md` and `TASKS.md`.
- [ ] **Playwright Test Evidence**: E2E test suite passing with screenshot artifacts recorded in test output.

---

## 3. Rejection & Failure Protocol

If any gate fails:
1. **Immediate Halt**: The task cannot be marked "completed" in task trackers or reported as finished.
2. **Root Cause Diagnosis**: Identify the exact failing gate (e.g., TS type error, mobile layout shift, accessibility contrast failure).
3. **Remediation Loop**: Re-enter the 8-Step Implementation Cycle at Step 5 (Implement) to correct the defect.
4. **Re-validation**: Re-run the full validation suite until all 6 gates pass cleanly.
