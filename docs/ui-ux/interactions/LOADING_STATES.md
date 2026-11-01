# LOADING_STATES.md — Skeletons, Radial Gauges & Canvas Buffer Standards
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Progressive Loading, Skeleton Screens & Telemetry Buffers

> **Core Standard**: Interfaces must never flash un-styled content (FOUC) or introduce Cumulative Layout Shift (CLS) during asynchronous data fetching, image decoding, or 360-degree canvas frame buffering.
> **Anti-Slop Invariant**: No generic full-page blocking white spinners. Every loading state matches the exact physical footprint of the upcoming component, communicating progress with clinical clarity.

---

## 1. Hierarchy of Loading States

1. **Inline Button Spinners**: For micro-actions and form submissions (< 2s).
2. **Skeleton Screens**: For data-driven cards, product grids, and tables (< 3s).
3. **Radial Telemetry Progress**: For multi-step checkouts, file uploads, and diagnostic assessments (3s - 10s).
4. **Double-Buffered Canvas Loaders**: For 360-degree hardware turntables and high-resolution histology image sequences.
5. **Full-Page Progressive Hydration**: Next.js App Router Suspense boundaries preserving layout stability.

---

## 2. Skeleton Screen Standards & Geometry

All skeletons adopt the dark clinical obsidian palette with a high-precision shimmering wave:

```css
@keyframes clinicalShimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.clinical-skeleton {
  position: relative;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.6);
  border-radius: var(--radius-md, 8px);
}

.clinical-skeleton::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(6, 182, 212, 0.08) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: clinicalShimmer 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Component-Specific Skeleton Dimensions

| Component | Target Wireframe Footprint | Skeleton Structure & Parts |
| :--- | :--- | :--- |
| **Product Card** (`ProductCardSkeleton`) | `w-full h-[460px]` | 1. Image Box: `h-[260px] w-full rounded-t-xl`<br>2. Badge: `h-[20px] w-[80px] mt-4`<br>3. Title: `h-[24px] w-[75%] mt-2`<br>4. Rating & Vol: `h-[16px] w-[40%] mt-2`<br>5. Price Row: `h-[28px] w-[60%] mt-4`<br>6. CTA Button: `h-[44px] w-full mt-3 rounded-lg` |
| **360 Stage** (`HardwareCanvasSkeleton`) | `w-full aspect-square max-w-[580px]` | 1. Canvas Square: `aspect-square w-full rounded-2xl`<br>2. Radial Frame Gauge: Centered circular loader `w-16 h-16`<br>3. Thumb scrubber bar: `h-[8px] w-[80%] mx-auto mt-4`<br>4. Hotspot placeholders: 3 pulsing dots at known anchor points |
| **B2B Volume Table** (`PriceMatrixSkeleton`)| `w-full h-[220px]` | 1. Header Row: 4 columns `h-[36px]`<br>2. Body Rows: 3 rows x 4 cells `h-[48px]` each with subtle divider lines |
| **INCI Dossier** (`InciAccordionSkeleton`) | `w-full h-[180px]` | 1. Accordion Bar: `h-[52px] w-full rounded-lg mb-2` (repeated 3x) |

---

## 3. Radial Progress & Telemetry Loaders

For diagnostic calculations (Bohr effect saturation, skin Fitzpatrick calculation) and payment handoffs:

```tsx
interface RadialProgressProps {
  progress: number; // 0 to 100
  size?: number; // default: 64
  strokeWidth?: number; // default: 4
  label?: string; // e.g. "محاسبه نفوذ پوستی..."
}
```

- **Visual Elements**:
  - Track: Circle with stroke `#1e293b`.
  - Indicator: Smoothly animating stroke with gradient `#06b6d4` to `#38bdf8`.
  - Center Text: Tabular numeric percentage `45%` in Vazirmatn font.
  - Sub-label: Clean clinical telemetry caption (`role="status"`).

---

## 4. 360-Degree Canvas Double-Buffer Loading Sequence

When loading 72 high-resolution hardware turntable frames:

```
+-----------------------------------------------------------------------------------------+
|                                CANVAS SEQUENCE PRELOAD FLOW                             |
+-----------------------------------------------------------------------------------------+
Step 1: Low-Res Thumbnail (Frame 001) is displayed immediately (WebP, < 15KB).
Step 2: Keyframe Anchors (Frames 0, 18, 36, 54) fetched concurrently in Priority Queue 1.
Step 3: Intermediary frames preloaded in background web worker via `fetch()` and `createImageBitmap()`.
Step 4: Real-time progress bar renders: "آماده‌سازی چرخش سخت‌افزاری: ۷۲٪ (۵۲/۷۲)".
Step 5: When 100% buffered, canvas blurs out loader and enables interaction physics without hitching.
```

- **Buffer Fallback Rule**: If scrubbing occurs before all frames are decoded, the player snaps to the nearest available keyframe while displaying a subtle non-blocking telemetry indicator.

---

## 5. Inline Action & Button Spinners

- **Button Transition Rule**:
  - The button must maintain its exact width and height when transitioning to the loading state. It must **never** shrink or expand.
  - The existing text label is hidden via `opacity: 0` (retaining layout dimensions), and an absolute-centered SVG spinner is smoothly rendered.
  - `pointer-events: none` is applied immediately to prevent double-click mutations.
  - `aria-busy="true"` and `aria-live="polite"` announce submission status to screen readers.

```tsx
<button
  className="station-btn-primary relative min-w-[140px] h-[48px] px-6"
  disabled={isLoading}
  aria-busy={isLoading}
>
  <span className={isLoading ? "opacity-0" : "opacity-100 transition-opacity"}>
    {children}
  </span>
  {isLoading && (
    <span className="absolute inset-0 flex items-center justify-center">
      <svg className="w-5 h-5 animate-spin text-slate-900" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </span>
  )}
</button>
```

---

## 6. Accessibility & Cognitive Load Invariants

1. **Aria-Live Updates**: Use `aria-live="polite"` for background loading and progress updates. Never use `aria-live="assertive"` for normal page loading, which interrupts screen reader reading.
2. **Minimum Display Duration**: If an asynchronous task completes in under 200ms, do not flash a loading skeleton to avoid cognitive flickering. Use a 200ms debounce before rendering skeletons.
3. **Skeleton Labeling**: All skeletons have `aria-hidden="true"` so assistive technologies do not read repetitive empty container states. A single parent wrapper has `aria-busy="true"` with an accessible status: "در حال بارگذاری اطلاعات محصول...".
