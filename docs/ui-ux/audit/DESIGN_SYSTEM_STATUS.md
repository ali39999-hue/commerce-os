# DESIGN SYSTEM STATUS & TOKEN MAPPING
# Dr Dermer UK Clinical & Commerce OS — Phase 09 Architectural Verification
# Canonical Status: Figma Tokens, Design System Mapping & Storybook Integration

> **Design Tokens Source**: `packages/ui/src/styles/tokens.css`, `apps/storefront/app/globals.css`  
> **Figma Remote MCP**: `https://mcp.figma.com/mcp`  
> **Date**: 2026-11-03

---

## 1. Design Token Mapping (Figma Variables <-> CSS Custom Properties)

| Token Category | Figma Variable Name | CSS Custom Property | Value / Color Hex | Clinical Semantics |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `color/bg-base` | `--color-bg-base` | `#070b12` | Dark obsidian sterile clinical background |
| **Surface Raised** | `color/bg-surface` | `--color-bg-surface` | `#0c131f` | Medical console panel / card container |
| **Glassmorphic Surface** | `color/bg-glass` | `--color-bg-glass` | `rgba(15, 23, 42, 0.72)` | Frosted glass backdrop (`blur(16px)`) |
| **Cyan Accent** | `color/teal-primary` | `--color-teal-primary` | `#06b6d4` | ReeSkin Clinical formulations & Bohr Effect |
| **Plasma Violet** | `color/plasma-purple` | `--color-plasma-purple` | `#8b5cf6` | PlasmaX surgical microplasma hardware |
| **Emerald Bio** | `color/emerald-green`| `--color-emerald-green` | `#10b981` | Crystalene microderm & biological inertness |
| **Amber Gold** | `color/amber-gold` | `--color-amber-gold` | `#f59e0b` | Cold-chain storage warning, active retinoids |
| **Text Primary** | `color/text-primary` | `--color-text-primary` | `#f8fafc` | Maximum contrast clinical typography |
| **Text Secondary** | `color/text-secondary`| `--color-text-secondary`| `#94a3b8` | Supporting scientific annotations & dosage |

---

## 2. Typography & Responsive Geometry

- **Font Family**: Vazirmatn Persian typography with fallback to Inter/SF Pro.
- **Tabular Numerals**: Enforced via `font-variant-numeric: tabular-nums` for all price, dosage, and telemetry readouts.
- **Grid Baseline**: 4px micro-grid (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Responsive Viewports**:
  - Mobile Small: `360px`
  - Mobile Modern: `390px`
  - Tablet Portrait: `768px`
  - Desktop Standard: `1280px`
  - Ultra-Wide Laboratory: `1440px+`

---

## 3. Component Code Connect & Storybook Coverage

All 14 atomic primitives under `packages/ui/src/` (`Button`, `Input`, `Card`, `Badge`, `Modal`, `Drawer`, `Tabs`, `Accordion`, `BeforeAfterSlider`, `InteractiveHotspot`, `ProtocolStepper`, `PriceTag`, `Skeleton`, `ClinicalProductGallery`) have 100% WCAG 2.2 AA coverage and matching Figma component instances.
