# Design Tokens Specification

This document defines the comprehensive Design Token dictionary for Dr Dermer UK Clinical & Commerce OS. It serves as the single source of truth across web applications (Next.js Storefront, Admin ERP), component libraries (`packages/ui`), and styling layers.

---

## 1. CSS Custom Properties Dictionary

The following definitions are declared at `:root` within the global design system stylesheet.

```css
:root {
  /* -------------------------------------------------------------------------
   * Base Canvas & Structural Surface Tokens
   * ------------------------------------------------------------------------- */
  --color-bg-base: #070b12;
  --color-bg-canvas-deep: #05080e;
  --color-bg-surface: #0c131f;
  --color-bg-surface-elevated: #111a2b;
  --color-bg-surface-subtle: #0f172a;
  --color-bg-hover: rgba(255, 255, 255, 0.04);
  --color-bg-active: rgba(255, 255, 255, 0.08);

  /* -------------------------------------------------------------------------
   * Glassmorphism & Translucent Backdrop Tokens
   * Dose cap strictly enforced: Max 1-2 glass surfaces per viewport
   * ------------------------------------------------------------------------- */
  --glass-bg-primary: rgba(12, 19, 31, 0.75);
  --glass-bg-secondary: rgba(15, 23, 42, 0.65);
  --glass-bg-overlay: rgba(7, 11, 18, 0.85);
  --glass-bg-subtle: rgba(255, 255, 255, 0.03);
  --glass-backdrop-blur-sm: 8px;
  --glass-backdrop-blur-md: 16px;
  --glass-backdrop-blur-lg: 24px;
  --glass-border-specular: rgba(255, 255, 255, 0.12);
  --glass-border-standard: rgba(255, 255, 255, 0.08);
  --glass-border-subtle: rgba(255, 255, 255, 0.04);

  /* -------------------------------------------------------------------------
   * High-Resolution Text & Foreground Tokens
   * ------------------------------------------------------------------------- */
  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-text-tertiary: #64748b;
  --color-text-disabled: #475569;
  --color-text-inverse: #070b12;
  --color-text-accent: #06b6d4;

  /* -------------------------------------------------------------------------
   * Clinical Brand & Domain Colors
   * ------------------------------------------------------------------------- */
  /* Primary Clinical Teal (Bohr Effect, Transcutaneous Hydration) */
  --color-teal-50: #f0fdfb;
  --color-teal-100: #ccfbf4;
  --color-teal-200: #99f6e7;
  --color-teal-300: #5eead6;
  --color-teal-400: #2dd4be;
  --color-teal-500: #06b6d4; /* Default Clinical Cyan */
  --color-teal-600: #0891b2; /* Darker interactive / active state */
  --color-teal-700: #0e7490;
  --color-teal-800: #155e75;
  --color-teal-900: #164e63;
  --color-teal-glow: rgba(6, 182, 212, 0.35);

  /* Surgical Plasma Violet (PlasmaX Hardware, Energy Field) */
  --color-plasma-50: #f5f3ff;
  --color-plasma-100: #ede9fe;
  --color-plasma-200: #ddd6fe;
  --color-plasma-300: #c4b5fd;
  --color-plasma-400: #a78bfa;
  --color-plasma-500: #8b5cf6; /* Default Plasma Violet */
  --color-plasma-600: #7c3aed;
  --color-plasma-700: #6d28d9;
  --color-plasma-800: #5b21b6;
  --color-plasma-900: #4c1d95;
  --color-plasma-glow: rgba(139, 92, 246, 0.35);

  /* Bio-inert Emerald (Natural Peptide Matrix, Clinical Verification) */
  --color-emerald-50: #f0fdf4;
  --color-emerald-100: #dcfce7;
  --color-emerald-200: #bbf7d0;
  --color-emerald-300: #86efac;
  --color-emerald-400: #4ade80;
  --color-emerald-500: #10b981; /* Default Bio-inert Emerald */
  --color-emerald-600: #059669;
  --color-emerald-700: #047857;
  --color-emerald-800: #065f46;
  --color-emerald-900: #064e3b;
  --color-emerald-glow: rgba(16, 185, 129, 0.35);

  /* Vitamin Amber (Active Nutrition, VIP, Telemetry Caution) */
  --color-amber-50: #fffbeb;
  --color-amber-100: #fef3c7;
  --color-amber-200: #fde68a;
  --color-amber-300: #fcd34d;
  --color-amber-400: #fbbf24;
  --color-amber-500: #f59e0b; /* Default Vitamin Amber */
  --color-amber-600: #d97706;
  --color-amber-700: #b45309;
  --color-amber-800: #92400e;
  --color-amber-900: #78350f;
  --color-amber-glow: rgba(245, 158, 11, 0.35);

  /* Critical Alert Red (Contraindications, Hazardous Dosage, Error States) */
  --color-alert-50: #fef2f2;
  --color-alert-100: #fee2e2;
  --color-alert-200: #fecaca;
  --color-alert-300: #fca5a5;
  --color-alert-400: #f87171;
  --color-alert-500: #ef4444; /* Default Alert Red */
  --color-alert-600: #dc2626;
  --color-alert-700: #b91c1c;
  --color-alert-800: #991b1b;
  --color-alert-900: #7f1d1d;

  /* -------------------------------------------------------------------------
   * Borders & Focus Rings
   * ------------------------------------------------------------------------- */
  --border-width-hairline: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 3px;

  --border-color-subtle: rgba(255, 255, 255, 0.08);
  --border-color-default: rgba(255, 255, 255, 0.14);
  --border-color-strong: rgba(255, 255, 255, 0.24);
  --border-color-focus: #06b6d4;

  --focus-ring-glow: 0 0 0 3px rgba(6, 182, 212, 0.35);
  --focus-ring-error: 0 0 0 3px rgba(239, 68, 68, 0.35);

  /* -------------------------------------------------------------------------
   * Gradients (Purpose-Gated Hierarchy Function)
   * ------------------------------------------------------------------------- */
  --gradient-clinical-teal: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  --gradient-plasma-surge: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  --gradient-bio-vitality: linear-gradient(135deg, #10b981 0%, #047857 100%);
  --gradient-amber-potency: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
  --gradient-surface-dark: linear-gradient(180deg, rgba(17, 26, 43, 0.8) 0%, rgba(12, 19, 31, 0.95) 100%);
  --gradient-lens-glare: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%);

  /* -------------------------------------------------------------------------
   * Shadows & Elevation (Flat Laboratory Ground Plane)
   * ------------------------------------------------------------------------- */
  --shadow-ground: none;
  --shadow-subtle: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
  --shadow-card: 0 4px 16px -2px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-elevated: 0 12px 32px -4px rgba(0, 0, 0, 0.65), 0 4px 8px -2px rgba(0, 0, 0, 0.4);
  --shadow-modal: 0 24px 64px -12px rgba(0, 0, 0, 0.85), 0 8px 16px -4px rgba(0, 0, 0, 0.5);
  --shadow-surgical-cyan: 0 0 24px -4px rgba(6, 182, 212, 0.35);
  --shadow-surgical-plasma: 0 0 24px -4px rgba(139, 92, 246, 0.35);

  /* -------------------------------------------------------------------------
   * Border Radii
   * ------------------------------------------------------------------------- */
  --radius-none: 0px;
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-full: 9999px; /* Reserved for icon nodes, circular tags */

  /* -------------------------------------------------------------------------
   * Motion & Transition Durations
   * ------------------------------------------------------------------------- */
  --duration-instant: 75ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-deliberate: 350ms;
  --duration-modal: 400ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.3, 0, 1, 1);
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);

  /* -------------------------------------------------------------------------
   * Z-Index Layer Stack
   * ------------------------------------------------------------------------- */
  --z-index-deep-canvas: -10;
  --z-index-base: 0;
  --z-index-docked-element: 10;
  --z-index-dropdown-layer: 1000;
  --z-index-sticky-bar: 1100;
  --z-index-banner-notice: 1200;
  --z-index-overlay-scrim: 1300;
  --z-index-drawer-panel: 1400;
  --z-index-modal-dialog: 1500;
  --z-index-toast-telemetry: 1600;
  --z-index-tooltip-inspect: 1700;
}
```

---

## 2. Opacity Scale

| Token Name | Opacity Value | Primary Usage |
| :--- | :--- | :--- |
| `--opacity-0` | `0.0` | Transparent base state |
| `--opacity-faint` | `0.04` | Subtle hover washes on dark surfaces |
| `--opacity-subtle` | `0.08` | Structural dividing lines, card borders |
| `--opacity-medium` | `0.16` | Disabled element backgrounds |
| `--opacity-muted` | `0.40` | Muted secondary metadata glyphs |
| `--opacity-dim` | `0.65` | Secondary text, modal backdrop wash |
| `--opacity-solid` | `1.0` | Standard high-contrast elements |

---

## 3. Glassmorphism Architectural Rules

In accordance with Anti-Slop Rule R-10, glassmorphism is restricted to high-priority floating layers.

```css
/* Glass Layer Level 1: Primary Navigation HUD & Diagnostic Cards */
.glass-panel-primary {
  background-color: var(--glass-bg-primary);
  backdrop-filter: blur(var(--glass-backdrop-blur-md));
  -webkit-backdrop-filter: blur(var(--glass-backdrop-blur-md));
  border: var(--border-width-hairline) solid var(--glass-border-standard);
  box-shadow: var(--shadow-card);
}

/* Glass Layer Level 2: Interactive Modals & Hardware Drawers */
.glass-panel-overlay {
  background-color: var(--glass-bg-overlay);
  backdrop-filter: blur(var(--glass-backdrop-blur-lg));
  -webkit-backdrop-filter: blur(var(--glass-backdrop-blur-lg));
  border: var(--border-width-hairline) solid var(--glass-border-specular);
  box-shadow: var(--shadow-modal);
}
```

---

## 4. TypeScript Token Definition Contract

For programmatic consumption in Tailwind CSS, Styled Components, or Canvas renderers:

```typescript
export const clinicalDesignTokens = {
  colors: {
    bg: {
      base: "#070b12",
      canvasDeep: "#05080e",
      surface: "#0c131f",
      surfaceElevated: "#111a2b",
      surfaceSubtle: "#0f172a",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
      tertiary: "#64748b",
      disabled: "#475569",
      inverse: "#070b12",
      accent: "#06b6d4",
    },
    brand: {
      teal: {
        default: "#06b6d4",
        hover: "#0891b2",
        dark: "#0e7490",
        tint: "#f0fdfb",
        glow: "rgba(6, 182, 212, 0.35)",
      },
      plasma: {
        default: "#8b5cf6",
        hover: "#7c3aed",
        dark: "#5b21b6",
        glow: "rgba(139, 92, 246, 0.35)",
      },
      emerald: {
        default: "#10b981",
        hover: "#059669",
        dark: "#047857",
        glow: "rgba(16, 185, 129, 0.35)",
      },
      amber: {
        default: "#f59e0b",
        hover: "#d97706",
        dark: "#b45309",
        glow: "rgba(245, 158, 11, 0.35)",
      },
      alert: {
        default: "#ef4444",
        hover: "#dc2626",
        dark: "#b91c1c",
      },
    },
  },
  spacingScale: 4, // 4px baseline increments
  radii: {
    xs: "4px",
    sm: "6px",
    md: "10px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    full: "9999px",
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    drawer: 1400,
    modal: 1500,
    toast: 1600,
    tooltip: 1700,
  },
} as const;
```
