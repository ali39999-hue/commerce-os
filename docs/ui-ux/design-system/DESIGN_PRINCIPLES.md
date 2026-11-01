# Design Principles: Dr Dermer UK Clinical & Commerce OS

This document establishes the foundational design philosophy, anti-slop rules, and architectural tenets governing all user interfaces across Dr Dermer UK (Storefront, Admin ERP, Diagnostic Tools, and Hardware Interaction Surfaces).

---

## 1. Executive Vision

Dr Dermer UK operates at the intersection of British dermatological clinical research and high-performance regional commerce. The interface must balance two distinct emotional registers:
1. The unyielding authority, precision, and sterile clarity of an advanced pharmaceutical laboratory.
2. The tactile luxury, accessibility, and frictionless purchasing mechanics of premium dermal healthcare.

Every visual element, layout choice, component state, and interaction pattern must pass the test of purpose, clinical truth, and visual honesty.

---

## 2. The Five Core Pillars

### 2.1. Clinical Authority
The interface reflects the rigor of clinical dermatology and pharmaceutical chemistry.
- **Evidence Over Aesthetics**: Clinical claims must cite real trials, biological mechanisms (e.g., Bohr effect, stratum corneum lipid matrix restoration, transcutaneous oxygenation), and measured data.
- **Sterile & Controlled Ambience**: Visual presentation borrows from dark clinical laboratories: deep obsidian backgrounds (`#070b12`), surgical stainless-steel contrasts, high-clarity telemetry, and medical-grade data visualizations.
- **Dermatologist Grade Terminology**: Component naming, descriptions, and metadata maintain professional pharmaceutical taxonomy rather than marketing hyperbole.

### 2.2. Zero AI Slop
The design system enforces strict anti-slop protocols to eliminate generic machine-generated design artifacts.
- **Technique Follows Purpose**: No styling technique (gradients, glows, glassmorphism, rounded corners) may be applied merely as decoration. Every styling token must map to an articulable functional purpose.
- **Dose Caps**: Controlled exposure limits are enforced across all visual accents (maximum 1 to 2 glassmorphic layers per viewport, maximum 1 glow accent per screen).
- **No Fictional Evidence**: No synthetic user reviews, no fabricated clinical statistics, no dummy avatar clusters, and no decorative counter animations displaying unverified numbers.

### 2.3. Molecular Transparency
Dermatological efficacy requires absolute honesty in ingredients and formulation science.
- **Uncompromised INCI Disclosure**: Full International Nomenclature of Cosmetic Ingredients (INCI) listings must be accessible, searchable, and hierarchically structured with active concentrations and CAS Registry numbers.
- **Delivery Vector Clarity**: Explain how biochemical compounds cross the dermal barrier (liposomal delivery, acid mantle pH gradient, nano-encapsulation) using diagrams and verified specifications.
- **Truth in Staging**: Product visualizations must represent real formulations, actual viscosity, real package volumes, and realistic skin before-and-after timelines.

### 2.4. Biomechanical Precision
Digital interactions must feel predictable, deterministic, and physically sound.
- **Predictable Spatial Model**: All dimensions, gaps, paddings, and alignment grids derive strictly from an immutable 4px baseline rhythm.
- **Deterministic Latency**: Interactions provide sub-16ms hardware-accelerated visual feedback. Canvas players (e.g., 360 degree product view) utilize double-buffering and pointer-capture inertia.
- **No Visual Shift**: Media wrappers, interactive simulators, and lazy assets must have declared aspect ratios or explicit reserved bounding boxes to prevent Cumulative Layout Shift (CLS = 0).

### 2.5. Effortless Commerce
High clinical authority must translate into seamless, confident purchasing workflows.
- **Numeric Stability**: All prices, discount calculations, volumetric units, and currency symbols use tabular numbers (`tabular-nums`) to prevent horizontal and vertical jitter.
- **Localized Dual-Market Architecture**: Native right-to-left (RTL) Persian typography (Vazirmatn) paired with left-to-right (LTR) scientific notation and Latin chemical structures. Smooth handling of Iranian Toman/Rial payment gateways (Shetab, Shaparak) alongside international GBP/EUR multi-currency processing.
- **Persistent Transaction State**: Action bars on mobile surfaces remain locked within thumb reach; carts provide instant drawer feedback with transparent tax, shipping, and cold-chain clinical packaging breakdowns.

---

## 3. Anti-Slop Enforcement & Visual Honesty Protocol

To guarantee that the product maintains its distinct identity and never collapses into generic templates, the following architectural rules are mandatory across all development teams.

### 3.1. Forbidden Visual Artifacts (Hard Bans)
1. **Generic Purple-Blue Gradients**: The default AI landing page aesthetic (indigo to purple to cyan) is forbidden as a background or button treatment.
2. **Pill-Shaped Everything**: Universal capsule radii erase component hierarchy. Buttons, inputs, modals, and cards must maintain differentiated, purposeful border radii.
3. **Stacked Decorative Trends**: Combining glassmorphism + mesh gradient + floating glow + neon borders + pill badges simultaneously on a single surface is strictly prohibited.
4. **Endless Decorative Pulsing**: Animated pulsing rings or looping glows that do not indicate live hardware connection or critical clinical warnings are rejected.
5. **Monospace Typography as Costume**: Large monospace headings used purely to mimic a hacker terminal or technical dashboard are prohibited. Monospace is reserved exclusively for raw data: CAS numbers, serial keys, and telemetry streams.
6. **Em Dash Character Ban**: The em dash character is barred from user-facing copy in accordance with Anti-Slop Rule R-02. Use commas, colons, hyphens, or parentheses for human-crafted prose.

### 3.2. Controlled Techniques (Purpose-Gated)
The following techniques are permitted only when their clinical or commercial function is documented:
- **Glassmorphism**: Limited to floating navigational HUDs or modal backdrops (`rgba(15, 23, 42, 0.72)` with `backdrop-filter: blur(16px)`). It represents a sterile microscope lens or clean-room divider.
- **Radial Glow**: Permitted solely as an active telemetry focus (e.g., laser/plasma energy active status) or focused primary CTA accent.
- **Borders & Dividers**: Must use low-opacity dark obsidian dividers (`rgba(255, 255, 255, 0.08)`) representing precision lab glassware seams.
- **Color Coding**: Every hue represents a defined biological or functional state:
  - Cyan (`#06b6d4`): Transcutaneous hydration, Bohr effect, oxygen delivery.
  - Plasma Violet (`#8b5cf6`): High-energy clinical hardware, PlasmaX station.
  - Emerald Green (`#10b981`): Bio-inert barrier verification, clinical success.
  - Amber Gold (`#f59e0b`): High-potency active vitamins, caution/alerts.
  - Alert Red (`#ef4444`): Contraindication, clinical hazard, error state.

### 3.3. Mandatory Verification Checklist
Before any interface component or page specification is approved, it must verify:
- [x] Does every interactive control have a deterministic hover, focus, active, and disabled state?
- [x] Is the color contrast ratio at or above 4.5:1 for body copy and 3.0:1 for large display text against `#070b12` and `#0c131f`?
- [x] Is all body copy free of unsupported superlative marketing claims?
- [x] Can the interface be operated completely via keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`)?
- [x] Does the mobile layout maintain a minimum 44px (recommended 48px) touch target area without horizontal scrollbar defects?
