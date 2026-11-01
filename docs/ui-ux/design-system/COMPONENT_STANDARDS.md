# Component Standards & Primitives Specification

This document provides the formal engineering specification for the primary UI primitives within Dr Dermer UK Clinical & Commerce OS: **Button, Input, Card, Modal, Drawer, Tabs, Stepper, Slider, CanvasPlayer, and Badge**.

---

## 1. Button Primitive

### 1.1. Purpose & States
Buttons trigger discrete actions or mutations. Every button must provide five distinct states: Default, Hover, Focus-Visible, Active (Pressed), and Disabled/Loading.

### 1.2. Variants
- **`primary`**: Deep Clinical Cyan gradient with subtle spring lift. Reserved for primary conversion goals (e.g. "افزودن به سبد خرید", "آغاز ارزیابی بالینی").
- **`secondary`**: Dark obsidian surface with cyan hairline border (`--glass-bg-primary`).
- **`plasma`**: Surgical Plasma Violet gradient for high-energy hardware activation or diagnostics.
- **`ghost`**: Transparent background with subtle hover background wash. Used for secondary navigation and auxiliary toolbars.
- **`danger`**: Surgical Alert Red for irrevocable destructive operations (order cancellation, data purge).

### 1.3. Specification Matrix
```typescript
interface ButtonSpecification {
  height: { sm: "32px"; md: "40px"; lg: "48px" };
  minTouchTarget: "44px"; // Expanded via bounding container on mobile
  borderRadius: "var(--radius-md)"; // 10px (Never full pill unless icon node)
  fontFamily: "var(--font-persian)";
  fontWeight: 700;
  focusRing: "var(--focus-ring-glow)";
  transition: "all var(--duration-fast) var(--ease-spring)";
  spinner: {
    stroke: "2px solid currentColor";
    animation: "spin 0.75s linear infinite";
  };
}
```

---

## 2. Input Primitive

### 2.1. Purpose & States
Text fields, numeric inputs, and search fields. Supports States: Default, Active (Typing), Focus-Visible, Disabled, and Error (Invalid).

### 2.2. Architectural Rules
- Always rendered with an associated `<label>` (either explicit visible `<label for="...">` or accessible `aria-labelledby`).
- Dark laboratory background (`rgba(15, 23, 42, 0.6)`) preventing stark white boxes on dark obsidian canvases.
- Error states must display an inline message and use `aria-invalid="true"`, pointing to the error container via `aria-describedby`.
- Suffix/Prefix units (e.g. `ml`, `mg`, `PPM`, `تومان`) must be rendered with tabular monospace numbers.

---

## 3. Card Primitive

### 3.1. Structure
Cards group related clinical data, product formulations, or telemetry metrics.
- Ground: Elevated surface (`#0c131f` or `rgba(15, 23, 42, 0.75)`).
- Border: 1px hairline border (`rgba(255, 255, 255, 0.08)`).
- Shadow: Flat ground plane (`--shadow-card`). Elevates slightly (`--shadow-elevated`) only when the card is interactive.
- Radius: `var(--radius-lg)` (16px) or `var(--radius-xl)` (20px).

---

## 4. Modal Primitive (`DiagnosticQuizModal`, `QuickViewModal`)

### 4.1. Overlay & Mechanics
- **Backdrop Scrim**: `rgba(7, 11, 18, 0.85)` with `backdrop-filter: blur(16px)`.
- **Keyboard Handling**:
  - `Escape` key immediately closes the dialog.
  - Tab navigation is locked strictly inside the modal via focus trapping.
  - On mount, focus is directed to the first actionable control or modal title (`tabindex="-1"`).
  - Background scrolling is frozen on `document.body` via `overflow: hidden` and scrollbar gutter compensation.
- **Motion**: Scale and opacity transition (`opacity: 0 -> 1`, `scale: 0.97 -> 1` over `300ms`).

---

## 5. Drawer Primitive (`CartDrawer`, `InciExplorerDrawer`)

### 5.1. Mechanics
- **Slide Orientation**: Slides in from the inline-end (`right` in LTR, `left` in Persian RTL).
- **Surface**: High-elevation glassmorphic panel (`--glass-bg-overlay`) with specular border.
- **Header**: Fixed title bar with close button (`min-height: 48px`).
- **Footer**: Sticky action area containing summary metrics (e.g., subtotal, shipping) and primary CTA.

---

## 6. Tabs Primitive

### 6.1. Accessibility & ARIA Contract
- Container: `role="tablist"` with `aria-orientation="horizontal"`.
- Tab Trigger: `role="tab"`, `aria-selected="true|false"`, `aria-controls="panel-id"`.
- Panel: `role="tabpanel"`, `tabindex="0"`, `aria-labelledby="tab-id"`.
- Keyboard Navigation: Left/Right arrow keys change active tab selection without mouse interaction.

---

## 7. Stepper Primitive (`ProtocolStepper`)

### 7.1. Purpose
Visualizes multi-phase clinical treatment protocols (e.g., Step 1: Pre-treatment Cleansing, Step 2: Bohr CO2 Gel Infusion, Step 3: Lipid Barrier Lock).
- **Active Step**: Highlighted in Clinical Cyan with active step indicator.
- **Completed Step**: Bio-inert Emerald checkmark badge.
- **Pending Step**: Muted text (`#64748b`) with translucent index node.
- **Connecting Line**: 2px border connecting steps, filling with cyan progress as steps complete.

---

## 8. Slider Primitive (`BeforeAfterSlider`, Range Telemetry)

### 8.1. Mechanics
- **Before/After Split**: Dual-layer image or canvas with interactive vertical separator line.
- **Interaction**: Draggable thumb handle (`width: 44px`, `height: 44px`) with left/right arrow icons.
- **Keyboard Support**: Left/Right arrow keys shift divider position in 1% increments (10% with `Shift`).
- **Telemetry Tag**: Displays current frame position or temporal metric (e.g., "روز ۰ / پیش از درمان" vs "روز ۱۴ / ترمیم کامل").

---

## 9. CanvasPlayer Primitive (`CanvasSequencePlayer`)

### 9.1. Specifications
- **Double Buffering**: Prevents white flashes during rapid multi-frame scrubbing.
- **Pointer Capture**: Uses `setPointerCapture()` on pointer-down to maintain scrubbing continuity across screen edges.
- **Hotspot Overlay**: Interactive circular hotspots pinned to specific frame coordinates with clinical data popovers.
- **Fallback**: Static fallback poster image with accessible text description when WebGL/Canvas is disabled or fails to initialize.

---

## 10. Badge Primitive

### 10.1. Variants & Semantics
- **`clinical`**: Teal background tint (`rgba(6, 182, 212, 0.15)`), cyan text. Used for proven formulation mechanisms.
- **`bio`**: Emerald background tint (`rgba(16, 185, 129, 0.15)`), green text. Biocompatibility verification.
- **`potency`**: Amber background tint (`rgba(245, 158, 11, 0.15)`), amber text. Active vitamin concentrations.
- **`plasma`**: Violet background tint (`rgba(139, 92, 246, 0.15)`), violet text. High-energy hardware specs.
- **`hazard`**: Alert red tint (`rgba(239, 68, 68, 0.15)`), red text. Contraindications and allergy alerts.

### 10.2. Anti-Slop Constraint (R-09)
Badges must display actual verified information (e.g. `pH 5.5`, `10% Niacinamide`, `تاییدیه درماتولوژی`). Decorative badges such as "AI Powered", "Special", or "Best Value" without underlying verified metrics are strictly prohibited.
