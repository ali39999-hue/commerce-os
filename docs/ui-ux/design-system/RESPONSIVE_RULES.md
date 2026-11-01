# Responsive Rules & Viewport Adaptability

This specification defines the responsive layout rules, viewport breakpoints, grid collapsing mechanisms, mobile sticky action zones, and touch interaction standards for Dr Dermer UK Clinical & Commerce OS.

---

## 1. Viewport Breakpoint Hierarchy

Breakpoints are defined based on ergonomic viewport boundaries, accounting for mobile phone one-handed usage, tablet clinical charting, and wide laboratory displays.

| Token | Breakpoint | Media Query Target | Primary Device Ergonomics |
| :--- | :--- | :--- | :--- |
| **`xs`** | `< 480px` | `@media (max-width: 479px)` | Compact mobile smartphones (iPhone SE, small Android). Single-column flow. |
| **`sm`** | `480px – 639px` | `@media (min-width: 480px)` | Standard mobile smartphones in portrait mode. |
| **`md`** | `640px – 767px` | `@media (min-width: 640px)` | Large mobile landscape or small tablets. Initial 2-column card breakdown. |
| **`lg`** | `768px – 1023px`| `@media (min-width: 768px)` | Standard tablets (iPad portrait, clinical tablets). Collapsible drawers. |
| **`xl`** | `1024px – 1279px`| `@media (min-width: 1024px)`| Laptops and desktop screens. Persistent navigation HUD, multi-column grids. |
| **`2xl`**| `1280px – 1535px`| `@media (min-width: 1280px)`| High-resolution desktop monitors. Full clinical telemetry split views. |
| **`wide`**| `≥ 1536px` | `@media (min-width: 1536px)`| Ultra-wide monitors. Max-width containers bounded to preserve line lengths. |

---

## 2. Grid Collapsing & Multi-Column Reflow

In adherence to **Anti-Slop Rule R-03 (Mobile Responsiveness)**, layouts reflow without horizontal scrolling, overlapping text, or clipping.

### 2.1. Product & Diagnostic Card Matrix
- **Mobile (`< 640px`)**: Single column (`grid-template-columns: 1fr`). Cards expand full width minus container gutters (`var(--space-4)`).
- **Tablet (`640px – 1023px`)**: Two columns (`repeat(2, 1fr)`). Technical telemetry sits directly beneath product imagery.
- **Desktop (`1024px – 1439px`)**: Three columns (`repeat(3, 1fr)`).
- **Wide (`≥ 1440px`)**: Four columns (`repeat(4, 1fr)`).

### 2.2. Product Detail Page (PDP) & Hardware Station Staging
- **Desktop (`≥ 1024px`)**: Split 50/50 stage.
  - Left Stage (RTL: Right Stage): Sticky 360 degree canvas player, clinical before/after comparison slider, active telemetry.
  - Right Stage (RTL: Left Stage): Independent scrolling product narrative, INCI breakdown, dosage instructions, purchase selector.
- **Mobile (`< 1024px`)**: Stacked vertical flow.
  - Top: Fixed aspect-ratio canvas / image slider (`aspect-ratio: 1 / 1`).
  - Middle: Pricing, clinical trial badges, product description.
  - Bottom: Sticky Action Bar locked above browser navigation chrome.

---

## 3. Mobile Sticky Bottom Action Zone

Mobile purchasing workflows must be accessible within the ergonomic thumb zone.

```css
/* Persistent Mobile Action Bar */
.mobile-sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-index-sticky-bar);
  background-color: var(--glass-bg-primary);
  backdrop-filter: blur(var(--glass-backdrop-blur-md));
  -webkit-backdrop-filter: blur(var(--glass-backdrop-blur-md));
  border-top: var(--border-width-hairline) solid var(--border-color-subtle);
  padding: var(--space-3) var(--space-4);
  padding-bottom: max(var(--space-3), env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

@media (min-width: 1024px) {
  .mobile-sticky-bar {
    display: none; /* Hidden on desktop viewports */
  }
}
```

---

## 4. Touch Interaction Zones & Ergonomic Targets

1. **Minimum Touch Target**: In compliance with WCAG 2.2 Success Criterion 2.5.8 (Target Size - Minimum), all interactive elements on touch viewports (`@media (pointer: coarse)`) must occupy a minimum bounding area of **44px × 44px** (recommended **48px × 48px** for primary CTAs).
2. **Visual Margin / Gap**: Elements with smaller visual footprints (e.g., 20px close icons) must expand their invisible clickable hit area via pseudo-elements:
```css
.touch-target-expansion {
  position: relative;
}
.touch-target-expansion::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 44px;
  min-height: 44px;
  width: 100%;
  height: 100%;
}
```
3. **Safe Area Inset Handling**: All fixed bars, modal drawers, and mobile headers must integrate `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` to accommodate physical notches, home indicator bars, and dynamic browser URL bars.

---

## 5. Viewport Meta Configuration

The root HTML document must specify a non-restrictive viewport tag. Disabling user zoom (`user-scalable=no` or `maximum-scale=1`) is strictly forbidden under **Anti-Slop Rule R-39**.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```
