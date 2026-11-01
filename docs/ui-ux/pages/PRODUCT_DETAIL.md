# Specification: Product Detail Page (`/products/[slug]`)
# Dr Dermer UK Clinical & Commerce OS

> **Route**: `/products/[slug]`  
> **Component Architecture**: Hybrid Server Component (`apps/storefront/app/products/[slug]/page.tsx`) with high-fidelity client hydration (`PdpInteractiveSection.tsx`, `ProductGallery.tsx`, `VariantSelector.tsx`, `ClinicalTabs.tsx`, `InciExplorer.tsx`, `ProtocolTimerSimulation.tsx`, `StickyCartBar.tsx`).  
> **Primary Purpose**: Deliver an uncompromising, clinical-grade dossier for each formulation. Transform e-commerce purchasing into an authoritative dermatological consultation combining pharmaceutical transparency, cold-chain assurance, INCI chemistry, step-by-step procedural timers, and double-blind VISIA trial telemetry.

---

## 1. Page Architectural Layout & Hierarchy

```
+--------------------------------------------------------------------------------------------------+
| Header: Navigation, Breadcrumb Trail (`خانه / محصولات / [نام دسته] / [عنوان فرآورده]`)           |
+--------------------------------------------------------------------------------------------------+
| Top Grid Stage (Desktop 2-Column Split: 55% Gallery / 45% Buy Box):                              |
| +-------------------------------------------------+----------------------------------------------+
| | Left: Multi-Angle Clinical Media Gallery        | Right: Clinical Buy Box                      |
| | - Active High-Res Viewport with Zoom Magnifier  | - Brand Accent Badge (ReeSkin / ReeMed)      |
| | - Aspect-Ratio 1:1 Laboratory Renderings        | - Clinical Title (FA) & Subtitle (EN)        |
| | - Thumbnail Carousel with Active Indicator      | - Review Rating & Verified Clinical Trial tag|
| | - Cold-Chain Assurance Floating Badge           | - Server-Authoritative Price in Tomans       |
| | - Video / 360 Texture Inspection Trigger        | - Clinical Variant Selector (Radio/Pills)    |
| |                                                 | - Real-Time Inventory & Max Order Limits     |
| |                                                 | - Quantity Incrementer (+/-/Del)             |
| |                                                 | - Primary Add-to-Cart with Optimistic UI     |
| |                                                 | - Wishlist / Compare Discovery Actions       |
| +-------------------------------------------------+----------------------------------------------+
+--------------------------------------------------------------------------------------------------+
| Sticky Mobile Buy Bar: Visible when main buy box scrolls out of view                             |
+--------------------------------------------------------------------------------------------------+
| Mid-Page Deep-Dive Clinical Modules (Tabs & Interactive Drawers):                                 |
| 1. Science & Biological Mechanism: Bohr effect, cellular pathway, pH graphs                      |
| 2. INCI Ingredients Explorer Drawer: Full disclosure, CAS numbers, CIR safety ratings            |
| 3. 5-Step Clinical Protocol Stepper & Interactive Procedure Timer                                |
| 4. VISIA Clinical Trial Comparison Slider: Multi-spectral Before/After imaging                   |
| 5. Regulatory & Cold-Chain Compliance: Storage specs (2-8°C), ISO 13485, GMP batch codes         |
| 6. Bundle & Complementary Regimen Recommendations: Dynamic multi-step protocol discounts        |
| 7. Verified Patient Reviews & Histology Case Studies                                             |
| 8. Clinical FAQ Accordion: Pre/Post procedure, contraindications, pregnancy safety               |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Interactive Buy Box & Gallery Specifications

### 2.1 Hero Gallery (`<ProductGallery />`)
- **Container**: Aspect-ratio 1:1 bounding box with frosted dark background (`#0c131f`).
- **Magnification Lens**:
  - Hovering on desktop activates a 2.5x digital loupe lens revealing microscopic texture, suspension stability, and syringe graduation markings.
  - Smooth pan physics bound to pointer coordinates (`(e.clientX - rect.left) / rect.width`).
- **Cold-Chain Assurance Badge (`<ColdChainBadge />`)**:
  - Displays prominently over gallery: `۲°C - ۸°C COLD-CHAIN MONITORED`.
  - Tooltip explanation: «این محصول حاوی ترکیبات بیولوژیک ناپایدار در برابر حرارت است و منحصراً در بسته‌بندی عایق آلومینیومی همراه با ژل یخ درای-آیس و دیتالاگر ارسال می‌گردد.»
- **Thumbnail Strip**:
  - Thumbnails for laboratory packaging, clinical application in practice, and multi-spectral VISIA textures.
  - Keyboard accessible: Arrow navigation (`ArrowLeft`, `ArrowRight`) and Enter/Space selection.

### 2.2 Clinical Variant Selector (`<VariantSelector />`)
- **Variant Modalities**:
  - *Volume / Format*: e.g. `کیت تک‌کاربره (۱۵ میلی‌لیتر)` vs `پکیج کلینیکال ۱۰ کاربره (۱۵۰ میلی‌لیتر)`.
  - *Formulation Strength*: e.g. `Mild / Level 1 (5% CO2 Base)` vs `Intense / Pro (8.5% CO2 Base)`.
- **Server-Authoritative Pricing**:
  - Each variant carries its independent `sku`, `priceAmount` (in Rials, converted to Tomans for display), and `inStock` boolean.
  - Zero float rounding guarantees: Prices formatted with Persian tabular numerals via `formatToman(priceAmount)`.
  - Stock threshold alerts: If inventory is below 5 units, displays an amber caution: `تنها ۳ عدد در انبار زنجیره سرد باقی مانده است`.

### 2.3 Cart Action & Optimistic State
- Clicking «افزودن به سبد درمان»:
  - Dispatches `addItem(selectedVariant, qty)` to `CartContext`.
  - Optimistic feedback: Button transitions to checkmark state («افزوده شد») for 1,800ms while triggering the slide-out `CartDrawer`.
  - Telemetry: Fires `trackAddToCart()` analytics event with SKU, price, variant, and quantity.

---

## 3. Deep Clinical Sections

### 3.1 INCI Ingredients Explorer (`<InciExplorer />`)
- **Scientific Philosophy**: Zero hidden ingredients or vague "proprietary herbal blends". Complete pharmaceutical disclosure.
- **Drawer / Modal Trigger**: Interactive drawer sliding from the side when clicking on any ingredient pill or the «کاوشگر کامل ترکیبات (INCI)» button.
- **Ingredient Card Data Model**:
  ```typescript
  interface IngredientItem {
    id: string;
    inciNameEn: string;        // e.g. "Sodium Bicarbonate", "Tartaric Acid", "Centella Asiatica Extract"
    commonNameFa: string;      // e.g. "سدیم بی‌کربنات دارویی", "تارتاریک اسید طبیعی"
    percentage: string;        // e.g. "8.5%", "5.0%", "Q.S."
    functionRole: string;      // e.g. "CO2 Reagent", "pH Buffering", "Fibroblast Stimulation"
    cosingRating: 'Safe' | 'Low Risk' | 'Active Drug';
    cirSafetyReview: string;   // Cosmetic Ingredient Review safety panel summary
    biochemicalMechanism: string; // Detailed biological pathway
    isKeyActive: boolean;
  }
  ```
- **Filter Controls**: Filter by `همه ترکیبات`, `اکتیوهای کلیدی (Key Actives)`, or `پایه‌های بیومیمتیک (Biomimetic Base)`.

### 3.2 5-Step Clinical Protocol Stepper (`<ProtocolTimerSimulation />`)
Designed for aesthetic doctors, clinical aestheticians, and patients performing in-home medical skin protocols:

```
[ مرحله ۱: آماده‌سازی و پاک‌سازی ] ---> [ مرحله ۲: لایه‌برداری کریستالین ] ---> [ مرحله ۳: اعمال ژل فعال‌ساز CO2 ]
               |                                                                             |
               v                                                                             v
[ مرحله ۵: پپتید و سد دفاعی ] <------------------------------------------------- [ مرحله ۴: خنثی‌سازی و شستشو ]
```

- **Interactive Procedure Timer**:
  - *Step 3 Active Treatment*: Default countdown of 15 minutes (900 seconds).
  - *Audio-Visual Feedback*: Audible gentle clinical chime at 5-minute intervals and completion.
  - *Effervescence Simulator*: Visual animated micro-bubbles on skin illustration demonstrating continuous CO₂ generation.
  - Controls: Pause / Resume / Reset protocol timer.

### 3.3 VISIA Before / After Comparison Slider (`<VisiaComparisonSlider />`)
- Multi-spectral cross-polarized analysis for this specific formulation.
- Cites peer-reviewed cohort studies:
  - Subject count: n=38 patients over 4 weeks.
  - Verified results: `کاهش ۴۲٪ در عمق خطوط ریز`, `کاهش ۵۸٪ در اریتم و التهاب پوستی`, `افزایش ۳.۲ برابری سنتز کلاژن تیپ ۱`.
- Dual view toggle: Standard clinical photo vs Melasma/UV porphyrin fluorescence mask.

### 3.4 Regulatory, Cold-Chain & Batch Dossier
- Storage instructions: `۲°C - ۸°C در یخچال دارویی؛ دور از تابش مستقیم نور`.
- Shelf-life: `۲۴ ماه پس از تاریخ تولید؛ ۶ ماه پس از باز شدن ویال (PAO 6M)`.
- Certifications: UK MHRA Notification, CE Medical Device Class I, Iran Food and Drug Administration (سازمان غذا و دارو) Registration IRC.

---

## 4. Complementary Regimen Builder & Cross-Sells

- **Clinical Synergy**: Recommends products that chemically harmonize with this formulation. For example, pairing acidic CarboxyGel with alkaline neutralizer or lipid-restoring ceramide cream (`Healene`).
- **Bundle Discount**: If all 3 recommended regimen steps are selected, automatically applies a 10% clinical regimen bundle discount (`REGIMEN-10`) in the cart.

---

## 5. Mobile Optimization & Sticky Action Bar

- **Sticky Bottom Action Bar (`<StickyCartBar />`)**:
  - Appears via IntersectionObserver when the main buy box scrolls above the viewport.
  - Displays: Mini thumbnail, product title, current variant price in Tomans, and a prominent «افزودن به سبد» CTA.
  - Safe-area inset aware (`padding-bottom: env(safe-area-inset-bottom, 16px)`).
  - Minimum tap height: 52px for high-precision thumb interaction.
