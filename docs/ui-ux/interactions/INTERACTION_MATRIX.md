# INTERACTION_MATRIX.md — Component State & Physics Specification
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: UI Interaction Matrix & Micro-Interactions

> **Core Standard**: Every interactive primitive must have explicit, predictable visual and accessible states across all life-cycle conditions: Default, Hover, Active/Pressed, Focus-Visible, Disabled, and Loading.
> **Anti-Slop Invariant**: No sudden layout jumps, no non-interactive loading locks without aria announcements, and no missing keyboard focus indicators. All transitions must respect `prefers-reduced-motion`.

---

## 1. Global Interaction Principles & Physics

- **Spatial Coordinate Space**: Standard LTR physical coordinates mapped cleanly to RTL logical equivalents (`margin-inline-start`, `inset-inline-start`, `padding-inline-end`).
- **Timing & Easing Constants**:
  - `transition-fast`: `150ms cubic-bezier(0.16, 1, 0.3, 1)` (Micro-toggles, active tap feedback)
  - `transition-standard`: `250ms cubic-bezier(0.2, 0.8, 0.2, 1)` (Dropdowns, hover lifts, state badges)
  - `transition-deliberate`: `400ms cubic-bezier(0.16, 1, 0.3, 1)` (Modals, drawers, layout reflows)
  - `transition-spring`: `500ms cubic-bezier(0.34, 1.56, 0.64, 1)` (Success checkmarks, cart badge bounce)
- **Reduced Motion Support**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 2. Interactive Primitives Matrix

| Component | State | Visual Representation (CSS / Tokens) | Cursor / Pointer | A11y & ARIA Attributes | Sound / Tactile / Event |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Button** (`station-btn-primary`) | **Default** | `background: linear-gradient(135deg, #06b6d4, #0891b2); color: #070b12; box-shadow: 0 4px 14px rgba(6,182,212,0.25)` | `pointer` | `role="button"`, `tabindex="0"` | `click` trigger |
| | **Hover** | `transform: translateY(-2px); box-shadow: 0 8px 20px rgba(6,182,212,0.4); filter: brightness(1.08)` | `pointer` | — | Subtle micro-elevation |
| | **Active / Pressed** | `transform: translateY(1px) scale(0.98); box-shadow: 0 2px 6px rgba(6,182,212,0.3)` | `pointer` | `aria-pressed="true"` (if toggle) | Touch feedback / click down |
| | **Focus-Visible** | `outline: 2px solid #38bdf8; outline-offset: 3px; box-shadow: 0 0 0 4px rgba(56,189,248,0.2)` | `pointer` | Outline shown only on keyboard nav | Browser outline ring |
| | **Disabled** | `background: #1e293b; color: #64748b; box-shadow: none; border: 1px solid rgba(255,255,255,0.05); transform: none` | `not-allowed` | `disabled`, `aria-disabled="true"` | Pointer events suppressed |
| | **Loading** | `background: #0e7490; color: transparent; cursor: wait` + centered SVG spinner (16px) | `wait` | `aria-busy="true"`, `aria-live="polite"` | Form submission lock |
| **Secondary Button** (`station-btn-secondary`) | **Default** | `background: rgba(15,23,42,0.6); color: #f8fafc; border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(12px)` | `pointer` | `role="button"` | Base action |
| | **Hover** | `background: rgba(15,23,42,0.9); border-color: rgba(6,182,212,0.4); color: #38bdf8` | `pointer` | — | Border glow |
| | **Active / Pressed** | `background: rgba(15,23,42,1); transform: scale(0.98)` | `pointer` | — | Press depression |
| | **Focus-Visible** | `outline: 2px solid #38bdf8; outline-offset: 2px` | `pointer` | — | Ring display |
| | **Disabled** | `opacity: 0.45; border-color: rgba(255,255,255,0.05)` | `not-allowed` | `aria-disabled="true"` | Non-clickable |
| | **Loading** | Label muted, 14px spinner injected at start | `wait` | `aria-busy="true"` | Action pending |
| **Range Slider** (`BohrSlider` / `DoseSlider`) | **Default** | Track: `height: 6px; background: #1e293b; border-radius: 9999px`. Thumb: `20px circular, background: #06b6d4; border: 2px solid #ffffff` | `grab` | `role="slider"`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow="45"` | Value change |
| | **Hover** | Thumb glow: `box-shadow: 0 0 12px rgba(6,182,212,0.6); transform: scale(1.1)` | `grab` | — | Value preview tooltip |
| | **Active / Drag** | Thumb: `transform: scale(1.2); box-shadow: 0 0 18px rgba(6,182,212,0.9); background: #38bdf8` | `grabbing` | `aria-valuenow` updates continuously | Real-time canvas telemetry sync |
| | **Focus-Visible** | Track ring: `outline: 2px solid #38bdf8; outline-offset: 4px` | `grab` | Step delta via Arrow Left/Right | Keyboard step adjustment |
| | **Disabled** | Track: `#0f172a`, Thumb: `#475569`, glow removed | `not-allowed` | `aria-disabled="true"` | Read-only state |
| **360 Interactive Canvas** (`CanvasSequencePlayer`) | **Default** | Hardware frame rendered at canvas center; overlay prompt: "جهت چرخش ۳۶۰ درجه بکشید" with subtle hand drag icon | `grab` | `role="region"`, `aria-label="نمایشگر سه بعدی تعاملی سخت‌افزار"` | First frame ready |
| | **Hover** | Cursor shifts to drag indicator; frame edge subtle cyan halo | `grab` | — | Ready indicator |
| | **Active / Scrub** | Cursor `grabbing`; scrubber physics active. Delta X maps to frame index modulo total frames (e.g. 72 frames) | `grabbing` | Keydown `ArrowRight`/`ArrowLeft` changes frame index by 1 (5 with Shift) | Drag position tracking |
| | **Inertial Spin** | Scrub release calculates velocity `v = (x_now - x_prev) / dt`. Decelerates with friction `0.92` until `v < 0.05` | `default` | — | Smooth kinetic dampening |
| | **Buffer Loading** | Canvas blurred (`filter: blur(8px)`) with overlay radial spinner and progress: "بارگذاری فریم ۴۵ از ۷۲" | `wait` | `aria-busy="true"`, `aria-live="polite"` | Chunked frame preload |
| **Tab Navigation** (`TabsRoot` / `TabTrigger`) | **Default (Inactive)** | `color: #94a3b8; background: transparent; border-bottom: 2px solid transparent; padding: 12px 20px` | `pointer` | `role="tab"`, `aria-selected="false"`, `tabindex="-1"` | Selection trigger |
| | **Default (Active)** | `color: #06b6d4; font-weight: 700; border-bottom: 2px solid #06b6d4; text-shadow: 0 0 12px rgba(6,182,212,0.3)` | `default` | `role="tab"`, `aria-selected="true"`, `tabindex="0"` | Panel sync |
| | **Hover (Inactive)** | `color: #f8fafc; background: rgba(255,255,255,0.03)` | `pointer` | — | Hover hint |
| | **Focus-Visible** | Highlight ring `outline: 2px solid #38bdf8; outline-offset: -2px` | `pointer` | Keyboard Left/Right switches active tab | Instant panel switch |
| | **Disabled** | `color: #475569; pointer-events: none` | `not-allowed` | `aria-disabled="true"` | Inactive section |
| **Modal Dialog** (`StationModal`) | **Entrance** | Backdrop: `opacity 0 -> 1 (background: rgba(7,11,18,0.85); backdrop-filter: blur(8px))`. Panel: `scale 0.95 -> 1.0, opacity 0 -> 1` | `default` | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"` | Focus trapped inside |
| | **Active State** | Backdrop locks page scroll (`overflow: hidden` on body). Focus trapped in first interactive child | `default` | `Escape` key closes modal | Focus trap cycle |
| | **Exit / Dismiss** | Backdrop fade-out (`200ms`), modal drop `translateY(12px) scale(0.97)` | `default` | Focus restored to trigger element | Body scroll restored |
| **Cart / Diagnostic Drawer** (`DrawerRoot`) | **Entrance (RTL)** | Drawer slides from physical left (`inset-inline-start: 0`), `translateX(-100%) -> translateX(0)` | `default` | `role="dialog"`, `aria-modal="true"` | Sheet slide-in |
| | **Swipe Gesture (Mobile)**| Finger swipe towards edge translates drawer with resistance `1:1`. Dismisses if swipe > 35% drawer width | `grab` / touch | Velocity tracking | Touch physics |
| | **Backdrop Click** | Tap on glass backdrop triggers dismissal with spring ease | `pointer` | `aria-label="بستن پنل"` | Close trigger |

---

## 3. Gestures & Touch Target Guidelines

1. **Touch Target Dimensions**:
   - Minimum physical size: `44px x 44px` on desktop, `48px x 48px` on mobile screens.
   - Spacing between adjacent touch targets: Minimum `8px` to prevent accidental clicks.
2. **Swipe & Drag Physics**:
   - Touch threshold for gesture start: `10px` movement before capturing pointer to avoid blocking native page scrolls.
   - Canvas 360 scrubber sensitivity: `1 frame per 8px horizontal translation`.
   - Edge pull-to-close on mobile drawers: Requires positive velocity > 0.5px/ms or > 120px offset.

---

## 4. Keyboard Navigation Matrix

| Component | Key Action | Expected Behavior |
| :--- | :--- | :--- |
| **Tabs** | `ArrowLeft` / `ArrowRight` | Moves focus and immediately activates the previous/next tab (RTL aware). |
| | `Home` / `End` | Jumps to the first / last tab in the set. |
| **Modal / Dialog** | `Tab` / `Shift+Tab` | Cycles forward / backward strictly within modal interactive elements. |
| | `Escape` | Dismisses modal immediately, restoring focus to originating trigger button. |
| **Sliders** | `ArrowLeft` / `ArrowRight` | Decrements / increments value by 1 step (e.g. 1 unit). |
| | `PageUp` / `PageDown` | Jumps value by 10 steps (large step). |
| | `Home` / `End` | Jumps to minimum / maximum possible values. |
| **360 Canvas** | `ArrowLeft` / `ArrowRight` | Rotates model by 1 frame clockwise / counterclockwise. |
| | `Space` / `Enter` | Toggles automatic turntable rotation loop. |
| **Accordion / Disclosure** | `Space` / `Enter` | Expands or collapses INCI details panel; updates `aria-expanded`. |
