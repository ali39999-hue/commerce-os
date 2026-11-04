# Design Tokens Specification
# Dr Dermer UK Clinical & Commerce OS
## Standard: Warm Clinical Minimalism (§3.2, §16.3)

This document defines the comprehensive Design Token dictionary for Dr Dermer UK Clinical & Commerce OS. It serves as the single source of truth across web applications (Next.js Storefront, Admin ERP), component libraries (`packages/ui`), and styling layers.

---

## 1. CSS Custom Properties Dictionary (Warm Clinical Core)

Declared at `:root` within `apps/storefront/app/globals.css`, `packages/ui/src/tokens.ts`, and the global design system stylesheet.

```css
:root {
  /* -------------------------------------------------------------------------
   * Base Canvas & Structural Surface Tokens (Warm Clinical Minimalism)
   * 70-80% of page surfaces are light, warm, and clinical
   * ------------------------------------------------------------------------- */
  --canvas: #f7f6f2;             /* Warm canvas background */
  --paper-warm: #f7f6f2;        /* Natural warm stone tone */
  --paper: #f7f6f2;             /* Neutral substrate */
  --surface: #ffffff;           /* Pure white elevated card & panel */
  --surface-soft: #eef2ed;      /* Soft clean slate / tint surface */
  --surface-tint: #eef2ed;      /* Secondary calm container */
  --color-bg-base: #f7f6f2;
  --color-bg-surface: #ffffff;

  /* -------------------------------------------------------------------------
   * High-Resolution Text & Foreground Tokens
   * ------------------------------------------------------------------------- */
  --ink: #242d29;               /* Deep clinical ink (High contrast) */
  --ink-secondary: #3d4a44;     /* Mid slate text */
  --muted: #69736d;             /* Subtle text (WCAG 2.2 AA compliant >= 4.5:1) */
  --color-text-primary: #242d29;
  --color-text-secondary: #3d4a44;
  --color-text-muted: #69736d;

  /* -------------------------------------------------------------------------
   * Brand & Family Accent Tokens (§3.2 Blueprint)
   * ------------------------------------------------------------------------- */
  --brand: #24594f;             /* Primary Clinical Teal / Deep Brand Green */
  --brand-deep: #17463e;        /* Darker hover & focused headers */
  --brand-strong: #17463e;      /* Brand emphasis */
  --brand-dark: #0c2420;        /* Forest slate */
  --brand-light: #2dd4be;       /* Radiant Bio-Teal highlight */
  --brand-tint: #f0fdfa;        /* Ultra light wash */

  --sage: #dce8df;              /* Pale calming sage background */
  --sand: #ede5da;              /* Warm sand editorial container */
  --accent: #c69c70;            /* Warm Amber / Gold VIP accent */
  --accent-hover: #b45309;      /* Rich Gold hover */
  --accent-tint: #fffbeb;       /* Soft cream wash */

  --line: #e6e5de;              /* Crisp minimal dividers */
  --line-strong: #d1d0c7;       /* Pronounced boundary lines */
  --border: #e6e5de;

  /* -------------------------------------------------------------------------
   * Status & Medical Telemetry Tokens
   * ------------------------------------------------------------------------- */
  --danger: #b84d4d;            /* Clinical alert & active contraindication */
  --success: #10b981;           /* Clinical pass / active status */
  --warning: #f59e0b;           /* Caution notice / pending verification */
  --medical-blue: #0369a1;      /* Cold chain & hardware specs */

  /* -------------------------------------------------------------------------
   * Geometry & Elevation Tokens
   * ------------------------------------------------------------------------- */
  --radius-xl: 28px;
  --radius: 20px;
  --radius-md: 14px;
  --radius-sm: 8px;
  --radius-pill: 9999px;

  --shadow-sm: 0 1px 3px rgba(36, 45, 41, 0.05);
  --shadow-card: 0 4px 20px -2px rgba(36, 89, 79, 0.06), 0 2px 6px -1px rgba(36, 45, 41, 0.03);
  --shadow-elevated: 0 20px 40px -6px rgba(36, 89, 79, 0.1), 0 8px 16px -4px rgba(36, 45, 41, 0.04);
}
```

---

## 2. Token Usages and Invariants

1. **Light & Warm Primacy**: No general pages are rendered entirely in pitch-black (#000000 or #030712).
2. **Controlled Hardware Stages**: Distinct hardware visualization rooms (`/carbox`, `/plasmax`) utilize dark clinical lab stages with elevated radial glows (`#172421` to `#0d1413`).
3. **Tabular Numerals**: Every price, dose, PPM counter, and stock count enforces `font-variant-numeric: tabular-nums`.
