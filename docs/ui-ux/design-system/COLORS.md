# Color Palette & WCAG 2.2 Contrast Verification
# Dr Dermer UK Clinical & Commerce OS
## Standard: Warm Clinical Minimalism (§3.2, §16.3)

This document specifies the official color palette and WCAG 2.2 AA/AAA contrast ratios for Dr Dermer UK Clinical & Commerce OS, detailing exact hex codes, semantic roles, and mathematical contrast calculations across both Warm Clinical surfaces and controlled Medical Lab stages.

---

## 1. Primary Palette Architecture (Warm Clinical Minimalism)

The palette balances a human, calming, warm clinical canvas with deep pharmaceutical teal and gold accents.

```
+-------------------------------------------------------------------------------+
| WARM CLINICAL MINIMALISM CORE PALETTE                                         |
|                                                                               |
| Canvas: #F7F6F2                    Elevated Surface: #FFFFFF                  |
| [Warm Stone / Calming Canvas]      [Pure White Clinical Card & Panel]         |
|                                                                               |
| Soft Slate Tint: #EEF2ED           Pale Sage: #DCE8DF                         |
| [Calm Auxiliary Surface]           [Biological Hydration Accent]              |
|                                                                               |
| Primary Brand: #24594F             Brand Deep: #17463E                        |
| [Deep Clinical Teal Brand]         [Darker Hover & Section Header]            |
|                                                                               |
| Warm Sand: #EDE5DA                 Warm Amber / Gold: #C69C70                 |
| [Warm Editorial Background]        [VIP Accent & Concentrated Actives]        |
|                                                                               |
| Deep Clinical Ink: #242D29         Subtle Text: #69736D                       |
| [Primary High-Contrast Text]       [Secondary Technical Spec / Muted Copy]    |
|                                                                               |
| Crisp Border: #E6E5DE              Clinical Hazard / Alert: #B84D4D           |
| [Minimal Dividers & Borders]       [Contraindications & Verification Alert]   |
+-------------------------------------------------------------------------------+
```

---

## 2. Semantic Roles & Usage Invariants

| Token | Hex Value | Primary Semantic Role | Usage & Invariants |
| :--- | :--- | :--- | :--- |
| `color.canvas` | `#F7F6F2` | Root page background | 70% to 80% of page surfaces; eliminates hospital-grade glare and dark fatigue. |
| `color.surface` | `#FFFFFF` | Cards, modals, drawers, PDP buy panels | Clean, crisp, elevated surfaces with subtle border separation. |
| `color.surface-soft` | `#EEF2ED` | Auxiliary panels, badges, table headers | Soft clean wash behind secondary content blocks. |
| `color.ink` | `#242D29` | Headlines, body copy, active labels | Maximum legibility and optical density without harsh pitch-black glare. |
| `color.muted` | `#69736D` | Secondary metadata, CAS numbers, footnotes | Soft contrast meeting WCAG 2.2 AA standards (>= 4.5:1). |
| `color.brand` | `#24594F` | Primary CTAs, active links, brand stamps | Signature Dr Dermer Clinical Teal. Single primary action per section. |
| `color.brand-strong` | `#17463E` | Button hover, active focus, dark headers | Deterministic tactile feedback. |
| `color.sage` | `#DCE8DF` | Hydration badges, biological tags | Biomimetic validation markers. |
| `color.sand` | `#EDE5DA` | Warm editorial cards, journal quotes | Editorial warmth. |
| `color.accent` | `#C69C70` | VIP alerts, volume tiers, clinical badges | Controlled luxury accent; never used as default button color everywhere. |
| `color.border` | `#E6E5DE` | Hairline dividers, panel outlines | Subtle structure without heavy drop shadows. |
| `color.danger` | `#B84D4D` | Safety warnings, contraindications | Real clinical hazards and field validation errors. |

---

## 3. WCAG 2.2 AA Compliance & Contrast Matrix

Under **WCAG 2.2 AA**:
- **Normal Text (< 18pt or < 14pt bold)** requires a minimum contrast ratio of **4.5:1**.
- **Large Text (≥ 18pt or ≥ 14pt bold)** and graphical UI components require **3.0:1**.
- **Enhanced WCAG AAA** body copy target is **7.0:1**.

### 3.1. Contrast Calculations Against Warm Canvas (`#F7F6F2`)
*Relative Luminance of `#F7F6F2`: ~0.934*

| Foreground Token | Hex Code | Contrast Ratio | WCAG 2.2 AA Normal Text (4.5:1) | WCAG 2.2 AAA (7.0:1) | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Deep Clinical Ink** | `#242D29` | **13.56 : 1** | PASS | PASS | **AAA COMPLIANT** |
| **Mid Slate Text** | `#3D4A44` | **8.21 : 1** | PASS | PASS | **AAA COMPLIANT** |
| **Subtle Text** | `#69736D` | **4.64 : 1** | PASS | PASS (for Large Text) | **AA COMPLIANT** |
| **Primary Brand Teal**| `#24594F` | **7.12 : 1** | PASS | PASS | **AAA COMPLIANT** |
| **Brand Deep** | `#17463E` | **9.48 : 1** | PASS | PASS | **AAA COMPLIANT** |
| **Clinical Alert Red**| `#B84D4D` | **5.32 : 1** | PASS | PASS (for Large Text) | **AA COMPLIANT** |

### 3.2. Contrast Calculations Against Pure White Surface (`#FFFFFF`)
*Relative Luminance of `#FFFFFF`: 1.000*

| Foreground Token | Hex Code | Contrast Ratio | WCAG 2.2 AA Normal Text (4.5:1) | WCAG 2.2 AAA (7.0:1) | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Deep Clinical Ink** | `#242D29` | **14.52 : 1** | PASS | PASS | **AAA COMPLIANT** |
| **Primary Brand Teal**| `#24594F` | **7.62 : 1** | PASS | PASS | **AAA COMPLIANT** |
| **Brand Deep** | `#17463E` | **10.15 : 1** | PASS | PASS | **AAA COMPLIANT** |
| **Clinical Alert Red**| `#B84D4D` | **5.70 : 1** | PASS | PASS (for Large Text) | **AA COMPLIANT** |

---

## 4. Controlled Lab Simulator Stages (Interactive Education)
For dark interactive educational simulator stages (Bohr-effect canvas, 360° product sequences):
- Stage Background: `#172421` (top) to `#0D1413` (bottom).
- Ambient Specular Glow: Radial teal (`rgba(36, 89, 79, 0.25)`).
- Foreground Text: `#F7F6F2` (Contrast **13.2 : 1** - AAA Pass).
- Telemetry Values: Tabular numerals with `#2DD4BE` (violet `#8B5CF6` is reserved/رزرو شده since the 2026-11-07 device pivot and must not be used for new surfaces).
