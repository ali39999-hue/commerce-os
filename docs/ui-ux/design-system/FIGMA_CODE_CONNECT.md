# FIGMA CODE CONNECT MAPPING SPECIFICATION
# Dr Dermer UK Clinical & Commerce OS — Phase 09 Design System Integration
# Component Mapping between Figma Remote Canvas and Next.js Storefront

> **Canvas URL**: `https://mcp.figma.com/mcp`  
> **Official File**: Dr Dermer UK Clinical Design System (`DrDermerOfficialDesign/Dr-Dermer-UK`)  
> **Status**: Verified Specification (Ready for CLI Code Connect linking)  
> **Date**: 2026-11-03

---

## 1. Core Component Mapping Table

| UI Subsystem | Figma Component Frame / Node | Repository Component File Path | Exported Symbol | Key Props & Connectors |
| :--- | :--- | :--- | :--- | :--- |
| **Global Header** | `04 — Storefront Desktop / Header-Elevated`<br>`node-id=102:401` | `apps/storefront/components/header.tsx` | `SiteHeader` | `compact: boolean`<br>`transparent: boolean` |
| **Clinical Hero** | `04 — Storefront Desktop / HeroBanner-Flagship`<br>`node-id=104:812` | `apps/storefront/components/home/hero-banner.tsx` | `HeroBanner` | `showTrustChips: boolean`<br>`ctaVariant: 'glow' \| 'solid'` |
| **Path Selector** | `04 — Storefront Desktop / PathSelector-3Way`<br>`node-id=106:1204` | `apps/storefront/components/home/path-selector.tsx` | `PathSelector` | `activeTab: 'home' \| 'clinic' \| 'hardware'` |
| **Bohr Simulator**| `06 — Clinical / BohrSimulator-Interactive`<br>`node-id=108:1540` | `apps/storefront/components/home/bohr-simulator.tsx` | `BohrSimulator` | `initialPH: number (5.2 - 5.8)` |
| **360 Console** | `07 — Hardware / Carbox-360-Station`<br>`node-id=110:2100` | `apps/storefront/components/interactive/canvas-sequence-player.tsx` | `CanvasSequencePlayer` | `frameCount: 72`<br>`inertia: 0.92` |
| **INCI Dossier** | `02 — Components / InciExplorer-Drawer`<br>`node-id=112:2650` | `apps/storefront/components/pdp/inci-explorer.tsx` | `InciExplorer` | `ingredients: InciItem[]`<br>`casNumbers: boolean` |

---

## 2. Figma Code Connect Template (`figma.connect.json`)

```json
{
  "$schema": "https://figma.com/code-connect/schema.json",
  "documentUrl": "https://www.figma.com/design/DrDermerOfficialDesign/Dr-Dermer-UK",
  "components": [
    {
      "figmaNode": "102:401",
      "componentPath": "apps/storefront/components/header.tsx",
      "exportName": "SiteHeader"
    },
    {
      "figmaNode": "104:812",
      "componentPath": "apps/storefront/components/home/hero-banner.tsx",
      "exportName": "HeroBanner"
    },
    {
      "figmaNode": "106:1204",
      "componentPath": "apps/storefront/components/home/path-selector.tsx",
      "exportName": "PathSelector"
    }
  ]
}
```
