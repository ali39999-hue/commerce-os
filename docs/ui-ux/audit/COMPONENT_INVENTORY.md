# COMPONENT INVENTORY
# Dr Dermer UK Clinical & Commerce OS
# Architectural Registry of Storefront & Design System Components

> **Package Boundaries**: `apps/storefront/components/` and `packages/ui/src/`  
> **Framework**: React 19 / Next.js 16 App Router  
> **Design Language**: Clinical Glassmorphism, Dark Obsidian Laboratory Aesthetic, WCAG 2.2 AA Accessibility  
> **Status**: Comprehensive Unified Inventory & Component Registry

---

## 1. Core Design System Primitives (`packages/ui/src/`)

These reusable, headless-compatible atomic primitives provide the foundational building blocks across both `apps/storefront` and `apps/admin`.

| Component Name | File Path | Variants / Modifiers | States Supported | Dependencies | Usage Count |
| :--- | :--- | :--- | :--- | :--- | :-: |
| **`Button`** | `packages/ui/src/Button.tsx` | `primary`, `secondary`, `outline`, `ghost`, `danger`, `sizes: sm, md, lg` | default, hover, active, focus-visible, disabled, loading | React, tokens | 38+ |
| **`Input`** | `packages/ui/src/Input.tsx` | `text`, `tel`, `email`, `number`, `withIcon`, `withPrefix`, `withSuffix` | default, focus, filled, error, disabled, readonly | React | 18+ |
| **`Card`** | `packages/ui/src/Card.tsx` | `default`, `elevated`, `glassmorphic`, `interactive`, `bordered` | default, hover lift, active | React, tokens | 26+ |
| **`Badge`** | `packages/ui/src/Badge.tsx` | `teal`, `purple`, `emerald`, `amber`, `red`, `neutral`, `outline`, `solid` | default, animated pulse | React | 34+ |
| **`Modal`** | `packages/ui/src/Modal.tsx` | `center`, `fullscreenMobile`, `sizes: sm, md, lg, xl` | open, exit, backdrop blurred, focus trapped | React, ReactDOM | 8+ |
| **`Drawer`** | `packages/ui/src/Drawer.tsx` | `left`, `right`, `bottom`, `fullHeight` (RTL directional mirror) | open, sliding, closed, backdrop blur | React, ReactDOM | 6+ |
| **`Tabs`** | `packages/ui/src/Tabs.tsx` | `pills`, `underline`, `segmented`, `clinical` | active, inactive, focus-visible, disabled | React | 12+ |
| **`Accordion`** | `packages/ui/src/Accordion.tsx` | `single`, `multiple`, `bordered`, `minimal` | collapsed, expanded, focus-visible | React | 9+ |
| **`BeforeAfterSlider`**| `packages/ui/src/BeforeAfterSlider.tsx`| `horizontal`, `vertical`, `withPolarization`, `withZoom` | idle, dragging, keyboard step (left/right) | React | 7+ |
| **`InteractiveHotspot`**| `packages/ui/src/InteractiveHotspot.tsx`| `beacon`, `pin`, `pulse`, `withPopover` | idle, active, hovered, popover open | React | 5+ |
| **`ProtocolStepper`** | `packages/ui/src/ProtocolStepper.tsx` | `horizontal`, `vertical`, `withTimer`, `interactive` | upcoming, current, completed, error | React | 4+ |
| **`PriceTag`** | `packages/ui/src/PriceTag.tsx` | `rials`, `tomans`, `both`, `withDiscountBadge`, `tabular` | standard, sale, strike-through | `@commerce-os/localization` | 24+ |
| **`Skeleton`** | `packages/ui/src/Skeleton.tsx` | `text`, `card`, `avatar`, `button`, `rect` | shimmering pulse | CSS keyframes | 15+ |
| **`QuickViewModal`** | `packages/ui/src/QuickViewModal.tsx` | `pdpMinimal`, `withAddToCart` | open, loading, ready | `Modal`, `Button`, `PriceTag` | 4+ |
| **`DiagnosticQuizModal`**| `packages/ui/src/DiagnosticQuizModal.tsx`| `skinTriageWizard`, `multistep` | step navigation, calculating, recommendation | `Modal`, `Button`, `Card` | 3+ |
| **`ClinicalProductGallery`**| `packages/ui/src/ClinicalProductGallery.tsx`| `withThumbnails`, `rtlTouchScrubber`, `zoom` | idle, dragging, activeIndex, thumbnail select | `embla-carousel-react`, `lucide-react` | 6+ |

---

## 2. Interactive Clinical Physics & Simulation Components (`apps/storefront/components/`)

Engineered specifically for clinical accuracy, physiological simulations, and interactive education (Bohr-effect oxygenation, VISIA comparison).

| Component Name | File Path | Rendering Mode | Purpose & Interactive Behavior | Key Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **`CanvasSequencePlayer`** | `components/interactive/canvas-sequence-player.tsx` | Client (`'use client'`) | Double-buffered HTML5 canvas 360 sequence player with touch/mouse drag inertia (0.92 friction), frame scrubbing, preloaded WebP frames, and coordinate-pinned hotspot beacons. | HTML5 Canvas, RAF |
| **`BohrSimulator`** | `components/home/bohr-simulator.tsx` | Client (`'use client'`) | Continuous CO2 partial pressure slider, real-time mathematical Bohr Effect curve calculation, dynamic SVG capillary dilation, and tissue oxygen release telemetry. | React, CSS SVG |
| **`VisiaComparisonSlider`**| `components/home/visia-comparison-slider.tsx` | Client (`'use client'`) | Canfield VISIA dual-image before/after comparison split slider with touch-drag handle, high-resolution polarization toggling, and wrinkle/pigment depth analysis. | React, Pointer API |
| **`DirectProductOrder`** | `components/interactive/direct-product-order.tsx` | Client (`'use client'`) | Self-contained buy box with variant selector, real-time volume price calculation, instant cart drawer addition, and live thumbnail synchronization. | `useCart`, `PriceTag` |
| **`ClinicalPhotoShowcase`**| `components/interactive/clinical-photo-showcase.tsx` | Client (`'use client'`) | Multi-angle clinical product photography gallery with lightbox zoom, texture magnification, and cold-chain seal inspection. | Next Image, Dialog |
| **`ProtocolTimerSimulation`**| `components/pdp/protocol-timer-simulation.tsx` | Client (`'use client'`) | 5-step clinical procedure countdown timer with SVG radial progress indicator, audio chime prompts, and sensory guidance cues. | React, RAF |
| **`InciExplorer`** | `components/pdp/inci-explorer.tsx` | Client (`'use client'`) | Interactive drawer detailing chemical CAS registry numbers, CIR safety ratings, pharmaceutical purity grades, and biological mechanisms of action. | `Drawer`, `Badge` |
| **`DynamicRegimenBuilder`**| `components/pdp/dynamic-regimen-builder.tsx` | Client (`'use client'`) | Regimen pairing algorithm calculating bundle discounts when clinical products are assembled into routine sets. | `useCart`, `PriceTag` |
| **`SkinDiagnosticDrawer`**| `components/skin-diagnostic-drawer.tsx` | Client (`'use client'`) | Multi-step clinical skin concern triage wizard with Fitzpatrick phototype classification and personalized regimen recommendations. | `Drawer`, `Button` |

---

## 3. Global Navigation, Header & Footer (`apps/storefront/components/`)

| Component Name | File Path | Rendering Mode | Purpose & States | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **`Header`** | `components/header.tsx` | Client (`'use client'`) | Sticky glassmorphic navbar with clinical mega-menu, brand switcher (ReeSkin / ReeMed), dynamic bag item badge, and search modal trigger. | `useCart`, `next/link` |
| **`Footer`** | `components/footer.tsx` | Server / Client | Cambridge Science Park & Istanbul addresses, CE Medical Class IIb / ISO 13485 badges, TTAC serialization authenticity, legal terms, emergency clinic support. | `next/link` |
| **`CartDrawer`** | `components/cart-drawer.tsx` | Client (`'use client'`) | Slide-over cart drawer with 2-tier milestone shipping progress, tiered volume discount indicators, coupon validation (`DERMER20`), and checkout handoff. | `useCart`, `@commerce-os/domain` |
| **`CartPage`** | `components/cart.tsx` | Client (`'use client'`) | Full-page responsive cart with line item mutation, shipping estimator, and tax breakdown. | `useCart`, `PriceTag` |
| **`LocaleCurrencySelector`**| `components/localization/locale-currency-selector.tsx`| Client (`'use client'`) | Bi-directional Toman / Rial currency toggle with Jalali Persian calendar switcher. | `@commerce-os/localization` |
| **`ContactForm`** | `components/contact-form.tsx` | Client (`'use client'`) | Interactive clinic inquiry form with Persian regex validation, medical council input, and submission feedback. | React |
| **`PwaRegister`** | `components/pwa-register.tsx` | Client (`'use client'`) | Progressive Web Application service worker registrar and offline capability initializer. | Browser Service Worker |

---

## 4. Homepage Editorial & Discovery Components (`apps/storefront/components/home/`)

| Component Name | File Path | Rendering Mode | Purpose & States |
| :--- | :--- | :--- | :--- |
| **`StorefrontSectionsWrapper`**| `components/home/StorefrontSectionsWrapper.tsx` | Server (`async`) | Server-backed orchestrator: fetches homepage section overrides from `GET /v1/settings/storefront` (ADR-013) and toggles each home section's visibility server-side; defaults render when no override exists. |
| **`HeroBanner`** | `components/home/hero-banner.tsx` | Client / Server | High-impact clinical editorial hero banner with direct CTAs to CarboxyGel and the product catalog. |
| **`PathSelector`** | `components/home/path-selector.tsx` | Client / Server | Blueprint §5 item 4 customer journey path selector: Home Care (ReeSkin مصرفی خانگی) vs Clinical Solutions (ReeMed محلول‌های کلینیکی). |
| **`TrustBar`** | `components/home/trust-bar.tsx` | Server | 4 clinical trust badges: Cambridge Research, CE Medical Class IIb, 2–8°C Cold Chain, 100% TTAC. |
| **`CategoryConcernNav`** | `components/home/category-concern-nav.tsx` | Client | 5 clinical skin concern cards linking to filtered search results. |
| **`BrandFamilyRail`** | `components/home/brand-family-rail.tsx` | Client | Architectural comparison and showcase of ReeSkin (مصرفی خانگی) vs. ReeMed (محلول‌های کلینیکی). |
| **`FeaturedShowcase`** | `components/home/featured-showcase.tsx` | Client | Responsive grid of the 6 official retail products with badges, stock indicators, and direct cart actions. |
| **`ScienceSpotlight`** | `components/home/science-spotlight.tsx` | Server | Editorial breakdown of transdermal gas exchange (Bohr Effect) and biomimetic peptide formulation science. |
| **`ClinicalResults`** | `components/home/clinical-results.tsx` | Server | Statistical trial results: TEWL reduction, tissue pO2 surge, erythema clearance. |
| **`AcademyGuides`** | `components/home/academy-guides.tsx` | Server | Dermatology knowledge-base teasers: step-by-step protocols and active-ingredient guides linking to the Blog (دانش و پژوهش). |
| **`NewsletterVip`** | `components/home/newsletter-vip.tsx` | Client | Clinical newsletter registration with email/mobile validation. |
| **`SkinRegimenFinder`** | `components/home/skin-regimen-finder.tsx` | Client | Interactive quiz card triggering the diagnostic regimen triage drawer. |

---

## 4b. Admin ERP Manager Components (`apps/admin/components/`)

| Component Name | File Path | Rendering Mode | Purpose & States |
| :--- | :--- | :--- | :--- |
| **`StorefrontSectionsManager`**| `apps/admin/components/StorefrontSectionsManager.tsx` | Client | Section visibility control panel: persists per-section show/hide overrides server-side via `PUT /v1/settings/storefront/home-sections` (AdminGuard) with reset-to-defaults — replaces the retired broken localStorage cross-origin sync (ADR-013). |
| **`CatalogPimManager`** | `apps/admin/components/CatalogPimManager.tsx` | Client | API-backed product authoring: list, create, publish, feature and bulk-flag retail consumables through `/v1/stores/admin/products` (AdminGuard) with live variant price/stock display (ADR-013). |

---

## 5. Product Detail Page (PDP) Subsystem (`apps/storefront/components/pdp/`)

| Component Name | File Path | Rendering Mode | Purpose & States |
| :--- | :--- | :--- | :--- |
| **`ProductGallery`** | `components/pdp/product-gallery.tsx` | Client | High-resolution thumbnail switcher with zoom lightbox and video reel support. |
| **`VariantSelector`** | `components/pdp/variant-selector.tsx` | Client | Pack selector (500ml vs 1500ml, Home vs Pro) with live stock and pricing update. |
| **`StickyCartBar`** | `components/pdp/sticky-cart-bar.tsx` | Client | Mobile-only viewport bottom bar appearing on scroll with price, qty, and instant add. |
| **`ClinicalTabs`** | `components/pdp/clinical-tabs.tsx` | Client | Tabbed clinical dossier: Indications, Mechanism, INCI, Protocols, Safety, Studies. |
| **`ClinicalCaseStudies`**| `components/pdp/clinical-case-studies.tsx` | Server | Documented patient cases with VISIA cross-polarized photography and trial logs. |
| **`BundleRecommendations`**| `components/pdp/bundle-recommendations.tsx` | Client | Cross-sell bundle packs (e.g. CarboxyGel + CarboxyPad + Healene) with bundle savings. |
| **`PdpInteractiveSection`**| `components/pdp/pdp-interactive-section.tsx` | Client | Dynamic container coordinating interactive simulators on product detail views. |

---

## 6. Component Reusability & Dependency Integrity

- **Design Token Purity**: All components source colors, typography, borders, and shadows from `packages/ui/src/tokens.ts` or CSS variables defined in `DESIGN.md`.
- **RTL-First Styling**: All layout margins, paddings, flex directions, and chevron iconography use logical CSS properties (`margin-inline-start`, `padding-inline-end`) or bidirectional mirroring to maintain Persian reading order.
- **Strict Anti-Slop Enforcement**: Zero decorative non-functional shapes, zero arbitrary floating gradients without purpose, and 100% authentic clinical typography.