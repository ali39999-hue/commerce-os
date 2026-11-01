# Motion & Interaction Physics Specification

This document defines the physics-based animation curves, state transitions, hardware-accelerated canvas handling, and accessibility fallbacks for Dr Dermer UK Clinical & Commerce OS.

---

## 1. Motion Philosophy

In alignment with **Anti-Slop Rule R-19** and the clinical design motif, motion is functional telemetry, not decorative entertainment.
- **Purpose-Driven Timing**: Motion communicates physical state changes: an aperture opening, an active biochemical formulation blending, or a laser energy field calibrating.
- **Zero Perpetual Looping**: Endless bouncing badges, floating orbs, and pulsing borders are strictly prohibited. Once an element reaches its target state, motion terminates.
- **Physics Calibration**: Transitions mimic physical laboratory equipment: dampened springs, low-friction slides, and crisp optical snaps.

---

## 2. Easing Curves & Timing Tokens

All transitions utilize standardized cubic-bezier timing functions:

```css
:root {
  /* -------------------------------------------------------------------------
   * Standard Easing Curves
   * ------------------------------------------------------------------------- */
  /* Decelerate: Used for incoming elements (modals entering, drawers opening) */
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);

  /* Accelerate: Used for outgoing elements (modals closing, alerts dismissing) */
  --ease-accelerate: cubic-bezier(0.3, 0, 1, 1);

  /* Standard / Emphasized: Used for on-screen layout shifts, resizing, accordions */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);

  /* Spring Physics: Used for tactile button presses, slider thumbs, toggle switches */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);

  /* -------------------------------------------------------------------------
   * Duration Scale
   * ------------------------------------------------------------------------- */
  --duration-instant: 75ms;   /* Checkbox checks, radio button selection */
  --duration-fast: 150ms;      /* Button hover states, tooltip reveals */
  --duration-normal: 250ms;    /* Accordion expand, tab active line glide */
  --duration-deliberate: 350ms;/* Drawer slide-over, toast entry */
  --duration-modal: 400ms;     /* Diagnostic modal scale & backdrop blur */
}
```

---

## 3. Transition Matrices by Component

| Component Type | Trigger | Property | Duration | Timing Function | Keyframe / Transform |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Button Primary** | Hover | `transform`, `box-shadow` | `150ms` | `--ease-spring` | `translateY(-1.5px)` with subtle teal glow expansion |
| **Button Primary** | Active / Press | `transform`, `background-color`| `75ms` | `--ease-instant`| `translateY(0.5px)` to darkened `#0891b2` |
| **Drawer Panel** | Open | `transform` | `350ms` | `--ease-decelerate` | Slide from screen edge (`translateX(0)` from `translateX(100%)`) |
| **Drawer Panel** | Close | `transform` | `250ms` | `--ease-accelerate` | Slide toward screen edge |
| **Modal Dialog** | Open | `opacity`, `transform` | `300ms` | `--ease-spring` | `opacity: 0 -> 1`, `scale(0.97) -> scale(1)` |
| **Accordion Item**| Expand | `grid-template-rows` | `250ms` | `--ease-standard` | `0fr -> 1fr` (smooth zero-reflow expand) |
| **Interactive Hotspot**| Focus / Hover | `transform`, `border-color` | `200ms` | `--ease-spring` | `scale(1.15)` with radial ripple expansion |

---

## 4. Canvas Player & 360 Hardware Stage Physics

For interactive 360 degree medical hardware sequences (`CanvasSequencePlayer`) and before/after dermal comparison sliders:

### 4.1. Double-Buffering Protocol
To prevent frame tearing and visual flicker during high-velocity scrubbing:
1. Maintain an off-screen HTML5 canvas buffer alongside the rendered on-screen canvas.
2. Decode image assets sequentially into `ImageBitmap` primitives using `createImageBitmap()` on web worker threads.
3. Render the target frame directly onto the off-screen buffer.
4. Execute `ctx.drawImage(offscreenCanvas, 0, 0)` in a single synchronous paint cycle locked to `requestAnimationFrame()`.

### 4.2. Drag & Touch Inertia Physics
```typescript
interface InertiaState {
  velocity: number;
  friction: number; // 0.92 for smooth clinical deceleration
  currentFrame: number;
  totalFrames: number;
}

export function updateCanvasPhysics(state: InertiaState): number {
  if (Math.abs(state.velocity) < 0.01) {
    state.velocity = 0;
    return state.currentFrame;
  }
  
  state.currentFrame = (state.currentFrame + state.velocity + state.totalFrames) % state.totalFrames;
  state.velocity *= state.friction;
  return Math.floor(state.currentFrame);
}
```

---

## 5. Reduced-Motion & Accessibility Fallbacks

In compliance with **WCAG 2.2 AA (Success Criterion 2.3.3)** and **Anti-Slop Rule R-39**, users requesting reduced motion must receive instantaneous or fade-only state updates.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Accessible opacity fade replacement for structural overlays */
  .modal-dialog,
  .drawer-panel,
  .accordion-content {
    transition: opacity 150ms linear !important;
    transform: none !important;
  }
}
```
