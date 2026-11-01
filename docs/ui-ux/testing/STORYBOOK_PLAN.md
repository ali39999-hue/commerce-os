# STORYBOOK_PLAN.md — Component Isolation Roadmap & Story Architecture
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Storybook 8 Design System Catalog & Isolation Testing

> **Core Standard**: Every UI primitive, composite card, and interactive simulator must be developed, tested, and documented in total isolation within Storybook before integration into full-page routes.
> **Anti-Slop Invariant**: No unstyled stories, no mock props that do not match production TypeScript interfaces, and no missing state variants (Hover, Active, Focus, Disabled, Loading).

---

## 1. Storybook Architecture & Technology Stack

- **Framework**: Storybook 8 with `@storybook/nextjs` (App Router support).
- **Styling**: Tailwind CSS + CSS Modules + Vanilla CSS Variables (`DESIGN.md`).
- **Typography & Font**: Vazirmatn Persian typography with tabular numerals and Inter Latin fallback.
- **Bi-Directionality Addon**: Storybook RTL addon enabling 1-click toggling between `dir="rtl"` (primary) and `dir="ltr"`.
- **Accessibility Addon**: `@storybook/addon-a11y` running Axe Core on every story render in real time.

---

## 2. Component Isolation Taxonomy & Hierarchy

```
Storybook Hierarchy
├── 01-Tokens/
│   ├── Colors & Clinical Gradients
│   ├── Typography & Vazirmatn Scales
│   ├── Elevation & Glassmorphism Panels
│   └── Spacing & 4px Baseline Grids
├── 02-Atoms/
│   ├── Button (Primary, Secondary, Ghost, Destructive)
│   ├── Input (Text, National ID, Mobile 09xx, Postal Code)
│   ├── Badge & Clinical Tag (Indications, Pre-order, Cold-Chain)
│   ├── Checkbox & RadioGroup
│   └── Slider (Range, Bohr Effect Gauge)
├── 03-Molecules/
│   ├── FormField (Label, Input, HelperText, ErrorMessage)
│   ├── InciAccordion (CAS number, Biological concentration)
│   ├── QuantityAdjuster (BigInt clamp, Touch buttons)
│   ├── TelemetryGauge (Tissue pH, Oxygen saturation)
│   └── ProductPriceRow (List price, Discount badge, Rial BigInt)
├── 04-Organisms/
│   ├── ProductCard (ReeSkin, CarboxyGel, PlasmaX variants)
│   ├── CanvasSequencePlayer (360-degree turntable scrubber)
│   ├── BohrSimulator (Interactive tissue oxygenation canvas)
│   ├── CartDrawer (Item list, Subtotal, Free shipping bar)
│   └── B2BVolumeMatrix (Tiered pricing table, Sepidar VAT)
└── 05-Templates/
    ├── PDP Split Stage (Left 360 viewer, right clinical specs)
    ├── Checkout Form Grid (Two-column layout, sticky order summary)
    └── B2B Proforma View (Official invoice layout, tax seal)
```

---

## 3. High-Priority Component Story Specifications

### 3.1 Button Primitive (`packages/ui/src/components/Button.stories.tsx`)
- **Stories**:
  - `PrimaryDefault`: Cyan gradient with dark obsidian text.
  - `PrimaryHover`: Elevated state with enhanced shadow.
  - `PrimaryLoading`: Injected 16px SVG spinner with hidden text label.
  - `PrimaryDisabled`: Muted gray state with `aria-disabled="true"`.
  - `SecondaryGlass`: Translucent glassmorphic panel with cyan border glow on hover.
  - `TouchTargetMobile`: Rendered on 375px mobile viewport verifying 48px height.

### 3.2 Iranian Phone Input (`packages/ui/src/components/MobileInput.stories.tsx`)
- **Stories**:
  - `EmptyPristine`: Default placeholder "۰۹۱۲ ۳۴۵ ۶۷۸۹" with Persian instructions.
  - `ActiveTyping`: In-progress entry with formatted mask `0912 345 6789`.
  - `ValidMCI`: Success state with green border and operator badge ("همراه اول").
  - `InvalidLength`: Inline error state: "شماره موبایل باید دقیقاً ۱۱ رقم باشد".
  - `InvalidPrefix`: Inline error state: "فرمت شماره موبایل صحیح نیست".

### 3.3 360 Canvas Sequence Player (`components/interactive/CanvasSequencePlayer.stories.tsx`)
- **Stories**:
  - `CarboxHardwareTurntable`: 72-frame medical hardware rotation sequence.
  - `BufferLoading`: Progressive buffer loader showing radial percentage gauge.
  - `InertiaSpin`: Simulates high-velocity touch swipe with kinetic deceleration.
  - `HotspotsActive`: Hotspot pins rendered at 45°, 180°, and 270° viewing angles.

### 3.4 Bohr Effect Simulator (`components/interactive/BohrSimulator.stories.tsx`)
- **Stories**:
  - `PhysiologicalBaseline`: pH 7.4 / Resting dermal tissue state.
  - `CarboxyAcidification`: pH drops to 5.4 / Active O2 hemoglobin release curve.
  - `InteractiveDoseScrubber`: Draggable range slider updating canvas graph in real-time.

---

## 4. Component Isolation Roadmap & Execution Phases

| Phase | Component Target | Isolation Stories Required | Target Completion |
| :--- | :--- | :--- | :--- |
| **Phase A** | Design Tokens & Atoms | Colors, Typography, Button, Input, Badge, Slider | Week 1 |
| **Phase B** | Form Primitives & Validation | National ID Input, Sheba Input, Postal Code, RadioGroup | Week 2 |
| **Phase C** | Interactive Clinical Primitives | BohrSlider, InciAccordion, QuantityAdjuster, Tabs | Week 3 |
| **Phase D** | Complex Organisms | CanvasSequencePlayer, ProductCard, CartDrawer, PriceMatrix | Week 4 |
| **Phase E** | Full Template Mockups | PDP Stage, Checkout Grid, B2B Proforma Preview | Week 5 |

---

## 5. Automated Storybook Testing Gates

1. **A11y Automated Checks**: Every story must pass `@storybook/addon-a11y` with zero WCAG 2.2 AA violations.
2. **Visual Snapshot Integration**: All stories executed in headless mode with automated screenshot diffing via Playwright.
3. **Type Safety**: Story props strictly inferred from component TypeScript interfaces using `Meta<typeof Component>` and `StoryObj<typeof Component>`.
