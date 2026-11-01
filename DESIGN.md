# DESIGN.md — Single Source of Truth
# Dr Dermer UK Clinical & Commerce OS Design System

> **Philosophy**: A unified, clinical-grade digital aesthetic combining scientific dermatological rigor with luxurious modern British cosmetics craft.
> Strict compliance with **Anti-Slop** rules (R-01 to R-40): No generic AI filler, no decorative nonsense, no unverified claims. Every element serves an authentic clinical, physiological, or commercial purpose.

---

## 1. Visual Identity & Atmosphere

- **Primary Motif**: Clinical Glassmorphism, Clean Laboratory Obsidian, Deep Molecular Teal, High-Tech Medical Plasma.
- **Background Atmosphere**:
  - Base Background: Deep Dark Obsidian (`#070b12` to `#0a111a`).
  - Card & Section Backgrounds: Frosted Glass (`rgba(15, 23, 42, 0.75)` with `backdrop-filter: blur(16px)`).
  - Ambient Glows: Subtle radial gradients simulating clean room laboratory illumination.

---

## 2. Color Palette & Semantics

| Token | Hex Value | Semantic Usage |
| :--- | :--- | :--- |
| `--color-bg-base` | `#070b12` | Primary page canvas background |
| `--color-bg-surface` | `#0c131f` | Elevated card & module surface |
| `--color-bg-glass` | `rgba(15, 23, 42, 0.72)` | Translucent glassmorphic panels |
| `--color-border-subtle` | `rgba(255, 255, 255, 0.08)` | Standard panel dividers & outlines |
| `--color-border-glow` | `rgba(6, 182, 212, 0.3)` | Focused / active state borders |
| `--color-teal-primary` | `#06b6d4` | ReeSkin Clinical accent, Bohr effect |
| `--color-teal-dark` | `#0891b2` | Teal button gradients & active states |
| `--color-plasma-purple` | `#8b5cf6` | PlasmaX station & surgical energy |
| `--color-emerald-green` | `#10b981` | Crystalene polish & bio-inert markers |
| `--color-amber-gold` | `#f59e0b` | Dermal nutrients, warning alerts, VIP |
| `--color-text-primary` | `#f8fafc` | Main headings & primary body text |
| `--color-text-secondary` | `#94a3b8` | Technical specs, labels & secondary text |
| `--color-text-muted` | `#64748b` | Footnotes, breadcrumb dividers |

---

## 3. Typography & Numerals

- **Persian Font**: Vazirmatn (`font-family: var(--font-vazirmatn), system-ui, sans-serif`) with full support for Persian ligature shaping and character legibility.
- **Latin & Scientific Font**: Inter, SF Pro, or system monospace for CAS numbers, chemical equations, and PPM telemetry.
- **Tabular Figures**: All prices, quantities, countdown timers, and sensor gauges must employ `font-variant-numeric: tabular-nums` to eliminate jitter during value updates.
- **Hierarchy Scale**:
  - `Hero Display`: `clamp(2.2rem, 5vw, 3.8rem)` | Weight: 900 | Line-height: 1.2
  - `Section Title (H2)`: `clamp(1.6rem, 3.5vw, 2.4rem)` | Weight: 800 | Line-height: 1.3
  - `Card Header (H3)`: `1.25rem` to `1.5rem` | Weight: 700 | Line-height: 1.4
  - `Body Regular`: `0.95rem` to `1.05rem` | Weight: 400 | Line-height: 1.85 (RTL optimal readability)
  - `Caption / Technical Tag`: `0.75rem` to `0.85rem` | Weight: 600 | Letter-spacing: 0.02em

---

## 4. Spacing, Layout & Grid Standards

- **Spacing Scale**: 4px base increments:
  - `xs`: 4px | `sm`: 8px | `md`: 12px | `base`: 16px | `lg`: 24px | `xl`: 32px | `2xl`: 48px | `3xl`: 64px
- **Container Max-Width**:
  - Default Container: `1280px` (`max-w-7xl` centered with `padding: 0 1.5rem`)
  - Narrow Article / Legal: `860px`
  - Full-Bleed 360 Hardware Stage: `1440px`
- **Breakpoints**:
  - Mobile: `< 640px` (single column, sticky bottom cart bars, touch-friendly 48px tap targets)
  - Tablet: `640px – 1024px` (2-column grids, collapsible drawers)
  - Desktop: `1024px – 1440px` (3-column grids, persistent split stages, interactive sliders)
  - Ultra-Wide: `> 1440px` (bounded layout preventing excessive line lengths)

---

## 5. Component Standards & Interaction Physics

1. **Buttons (`station-btn-primary`, `station-btn-secondary`)**:
   - Minimum tap target: 44px height (48px on mobile).
   - Solid gradient fill with subtle hover lift (`transform: translateY(-2px)`).
   - Clear loading spinner when asynchronous mutation is in flight.
2. **Interactive 360 Sequences (`CanvasSequencePlayer`)**:
   - Double-buffered HTML5 canvas preventing flickering during frame scrubbing.
   - Pointer capture physics with dampening inertia on release.
   - Frame-bound hotspot popovers that smoothly align to viewing angles.
3. **Clinical Simulators & Sliders**:
   - Native HTML range sliders styled with clinical glowing tracks and thumb grips.
   - Immediate mathematical feedback showing physiological curves (O2 burst, Bohr effect, TEWL reduction).
4. **Modal & Drawers (`CartDrawer`, `InciExplorer`, `SkinDiagnosticDrawer`)**:
   - Backdrop blur with smooth fade-in (`0.25s ease-out`).
   - Esc key closes dialog, focus lock inside modal, body scroll locking when active.
5. **Form Controls & Inputs**:
   - Dark background (`rgba(15, 23, 42, 0.6)`), clear 1px border.
   - Focus ring (`box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.25)`).
   - Error messages in distinct Persian red (`#ef4444`) with immediate inline feedback.

---

## 6. Anti-Slop Writing & Copy Rules

- **Zero Generic AI Buzzwords**: No "Next-gen revolutionizing cutting-edge ultimate synergy". Speak like a Cambridge clinical research director and pharmaceutical chemist.
- **Precise Formulations**: Always state exact active ingredient names (INCI), biological percentages, and mechanisms (e.g. "8.5% Sodium Bicarbonate", "5% Centella Asiatica", "Bohr Effect pH gradient").
- **Honest Telemetry**: Clinical claims must cite real trials (e.g. "45% increase in transcutaneous oxygenation", "78% reduction in TEWL over 48h").
- **Tone**: Professional, authoritative, empathetic, precise, and respectful.
