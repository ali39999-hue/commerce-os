# VISUAL_BASELINES.md — Visual Regression Guidelines & Capture Specifications
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Visual Regression Baselines, Screenshot Matrix & Viewport Standards

> **Core Standard**: To protect the clinical glassmorphic aesthetic from silent CSS regressions, layout breaks, or font misalignment, automated visual baselines must be captured and compared across three canonical viewports.
> **Anti-Slop Invariant**: Visual tests must be reproducible, deterministic, and immune to dynamic timestamp jitter, cursor blinking, or video frame differences.

---

## 1. Canonical Viewport Specifications

| Device Archetype | CSS Viewport (`width x height`) | Device Pixel Ratio (DPR) | User Agent Emulation | Primary Testing Targets |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile Standard** | `375px x 812px` | `2.0` | iPhone 13 / 14 Pro Mobile Safari | Sticky cart bar, drawer touch gestures, single-column reflow, thumb reachability |
| **Tablet Portrait** | `768px x 1024px` | `2.0` | iPad Gen 9 / 10 | 2-column product grid, collapsible sidebars, Bohr slider touch accuracy |
| **Desktop High-Res**| `1440px x 900px` | `1.0` | Modern Chrome / Edge Desktop | 360 Canvas sequence, side-by-side sticky hardware specs, mega-menu dropdowns |

---

## 2. Deterministic Capture Environment Invariants

To achieve pixel-for-pixel determinism without false positives:

1. **Clock & Date Mocking**: Freeze system clock to `2026-11-01T12:00:00Z` in all browser contexts to avoid countdown or copyright date drift:
   ```typescript
   await page.clock.setFixedTime(new Date('2026-11-01T12:00:00Z'));
   ```
2. **Animation & Transition Freezing**: Force all CSS transitions and animations to complete instantly before taking screenshots:
   ```css
   *, *::before, *::after {
     transition-duration: 0s !important;
     animation-duration: 0s !important;
     caret-color: transparent !important;
   }
   ```
3. **Web Font Ready Gate**: Wait for all Vazirmatn and Inter font faces to finish loading:
   ```typescript
   await page.evaluate(async () => {
     await document.fonts.ready;
   });
   ```
4. **Network Idle & Asset Hydration**: Wait for `networkidle` state and confirm that hero images/canvas players report `complete`:
   ```typescript
   await page.waitForLoadState('networkidle');
   await page.waitForSelector('[data-hydrated="true"]');
   ```

---

## 3. High-Priority Visual Regression Capture Matrix

| Route Key | Path | Viewports Tested | Mandatory Element Baselines |
| :--- | :--- | :--- | :--- |
| **Home Canvas** | `/` | Mobile, Tablet, Desktop | Hero stage, clinical category pills, Bohr teaser, brand family ribbons |
| **PDP ReeSkin Kit** | `/products/reeskin-kit` | Mobile, Desktop | 360 player, INCI accordion, quantity adjuster, sticky cart bar |
| **B2B Hardware Stage**| `/b2b` | Desktop | Carbox 360 stage, volume pricing table, specification matrix |
| **Cart Drawer** | `/#cart-drawer` | Mobile, Desktop | Line item cards, BigInt Rial subtotal, shipping progress bar, checkout CTA |
| **Checkout Flow** | `/checkout` | Mobile, Desktop | Iranian National ID field, postal code lookup, gateway selector radio group |
| **Academy Masterclass**| `/academy/microplasma`| Desktop | Video stage, accreditation credentials badge, curriculum timeline |
| **404 Not Found** | `/non-existent-route` | Mobile, Desktop | Clinical 404 glass card, search input, quick return buttons |

---

## 4. Screenshot Capture & Comparison Script (Playwright)

```typescript
import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

for (const vp of VIEWPORTS) {
  test(`Visual baseline: Homepage [${vp.name}]`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/', { waitUntil: 'networkidle' });

    // Freeze animations & wait for fonts
    await page.addStyleTag({
      content: `*, *::before, *::after { animation: none !important; transition: none !important; }`
    });
    await page.evaluate(() => document.fonts.ready);

    // Full page screenshot with 0.1% max visual difference tolerance
    await expect(page).toHaveScreenshot(`homepage-${vp.name}.png`, {
      maxDiffPixelRatio: 0.001,
      fullPage: true
    });
  });
}
```

---

## 5. Visual Diff Thresholds & Approval Protocol

- **Strict Component Tolerance (`maxDiffPixelRatio: 0.0005` / 0.05%)**:
  - Buttons, form inputs, typography headings, and modal containers. Any unintended shift in margin, padding, or font weight fails immediately.
- **Canvas / Simulator Tolerance (`maxDiffPixelRatio: 0.01` / 1.0%)**:
  - Permitted for HTML5 canvas anti-aliasing variations across different GPU rendering backends (ANGLE/Vulkan).
- **Baseline Update Protocol**:
  - Baseline images are checked into Git LFS under `tests/visual/baselines/`.
  - Updating a baseline requires explicit architectural review to ensure that a visual change is an intentional improvement, not an unnoticed regression.
