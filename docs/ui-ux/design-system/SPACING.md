# Spacing & Layout Architecture: Dr Dermer UK Clinical & Commerce OS

This document codifies the 4px baseline spatial rhythm, layout containers, internal component padding scales, and layout alignment rules governing all clinical interfaces.

---

## 1. 4px Baseline Spatial Grid

All spatial dimensions (including padding, margin, element heights, gaps, and icon containers) must be integer multiples of `4px`. Arbitrary pixel values (e.g. `13px`, `27px`) are strictly prohibited.

```css
:root {
  --space-0: 0px;
  --space-1: 4px;    /* 0.25rem - Micro gap, icon-to-text spacing */
  --space-2: 8px;    /* 0.5rem  - Compact button gap, chip padding */
  --space-3: 12px;   /* 0.75rem - Form field compact padding, badge spacing */
  --space-4: 16px;   /* 1.0rem  - Standard internal component padding */
  --space-5: 20px;   /* 1.25rem - Medium card gap */
  --space-6: 24px;   /* 1.5rem  - Elevated module padding, grid gutter */
  --space-8: 32px;   /* 2.0rem  - Section internal padding, modal spacing */
  --space-10: 40px;  /* 2.5rem  - Diagnostic step separator */
  --space-12: 48px;  /* 3.0rem  - Major block separator */
  --space-16: 64px;  /* 4.0rem  - Hero stage vertical padding */
  --space-20: 80px;  /* 5.0rem  - Desktop section divider */
  --space-24: 96px;  /* 6.0rem  - High-impact editorial stage break */
}
```

---

## 2. Container Maximum Width Scale

Layouts must maintain bounded horizontal widths to prevent excessive line length in Persian Vazirmatn reading flows and maintain optical focus on laboratory telemetry.

| Container Token | Max Width | Primary Use Case |
| :--- | :--- | :--- |
| `--container-reading` | `720px` | Scientific monographs, INCI full disclosures, clinical trial publications |
| `--container-form` | `860px` | Checkout payment flow, multi-step diagnostic skin assessment |
| `--container-standard` | `1200px` | Catalog product grids, customer account dashboard, ERP tables |
| `--container-wide` | `1360px` | Standard page wrapper, multi-column clinical workstation |
| `--container-stage` | `1440px` | Interactive educational simulator stage (Bohr-effect canvas, high-res 360° sequence scrubbing) |
| `--container-full` | `100%` | Ambient laboratory backgrounds, global navigation bar HUD |

### CSS Container Implementation
```css
.container-clinical {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

@media (min-width: 640px) {
  .container-clinical {
    padding-left: var(--space-6);
    padding-right: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container-clinical {
    padding-left: var(--space-8);
    padding-right: var(--space-8);
  }
}

.container-clinical-standard { max-width: var(--container-standard); }
.container-clinical-stage    { max-width: var(--container-stage); }
.container-clinical-reading  { max-width: var(--container-reading); }
.container-clinical-form     { max-width: var(--container-form); }
```

---

## 3. Component Internal Padding Standards

Every component class follows standard internal padding formulas:

### 3.1. Buttons & Interactive Triggers
- **Small (`sm`)**: Height `32px` | Padding: `0 var(--space-3)` (12px) | Gap: `var(--space-1)` (4px)
- **Medium (`md`)**: Height `40px` | Padding: `0 var(--space-4)` (16px) | Gap: `var(--space-2)` (8px)
- **Large (`lg`)**: Height `48px` | Padding: `0 var(--space-6)` (24px) | Gap: `var(--space-3)` (12px)
- **Mobile Action Primary**: Height `48px` to `52px` | Padding: `0 var(--space-6)` | Tap target guaranteed.

### 3.2. Form Inputs & Select Fields
- **Compact**: Height `36px` | Padding: `0 var(--space-3)` | Label spacing: `var(--space-1)`
- **Standard**: Height `44px` | Padding: `0 var(--space-4)` | Label spacing: `var(--space-2)`
- **Multiline (Textarea)**: Minimum height `104px` | Padding: `var(--space-3) var(--space-4)`

### 3.3. Cards & Elevated Containers
- **Compact Technical Card**: Padding `var(--space-4)` (16px) | Gap `var(--space-3)`
- **Standard Product Card**: Padding `var(--space-6)` (24px) | Gap `var(--space-4)`
- **Featured Lab Station Card**: Padding `var(--space-8)` (32px) on desktop, `var(--space-5)` on mobile.

### 3.4. Overlays & Modals
- **Drawer Panels**: Internal body padding `var(--space-6)` (24px), footer padding `var(--space-4) var(--space-6)`
- **Diagnostic Quiz Modal**: Header `var(--space-6)`, Body `var(--space-6) var(--space-8)`, Footer `var(--space-6)`

---

## 4. Grid System & Section Margins

### 4.1. Layout Grid Breakpoints
```css
/* Catalog 12-Column Grid Matrix */
.grid-clinical-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .grid-clinical-12 {
    gap: var(--space-6);
  }
}

@media (min-width: 1280px) {
  .grid-clinical-12 {
    gap: var(--space-8);
  }
}
```

### 4.2. Vertical Section Spacing
To ensure visual rhythm without template repetition:
- **Major Page Transition**: `var(--space-20)` (80px) on desktop, `var(--space-12)` (48px) on mobile.
- **Related Sub-modules**: `var(--space-10)` (40px) on desktop, `var(--space-6)` (24px) on mobile.
- **Component Stack Gap**: `var(--space-4)` (16px) or `var(--space-6)` (24px).

---

## 5. Optical Alignment & RTL Insets

1. **Logical Properties Only**: All CSS layouts must utilize logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`) instead of physical left/right rules to natively support Persian RTL and Latin LTR.
2. **Icon & Text Balancing**: Icons paired with Persian typography must align to the optical baseline. Because Vazirmatn characters possess lower descender gravity than Latin capital letters, inline icons require `align-self: center` and optical vertical offset (`transform: translateY(-0.5px)`).
