# Specification: Home Page (`/`)
# Dr Dermer UK Clinical & Commerce OS

> **Route**: `/`  
> **Component Architecture**: Server Component (`apps/storefront/app/page.tsx`) with modular interactive client islands.  
> **Primary Purpose**: Establish authoritative British clinical dermatological credibility, showcase core proprietary biotechnologies (ReeSkin & ReeMed), present interactive physiological mechanisms (Bohr Effect simulator, VISIA clinical trials), guide patients through diagnostic regimen finding, and funnel retail consumers into high-conversion purchase workflows for clinical skincare consumables.

---

## 1. Page Overview & Architectural Hierarchy

The home page is engineered as a zero-slop clinical portal. Rather than a generic cosmetic landing page with empty slogans, it functions as an interactive scientific dossier. Every section is anchored in verified dermatological chemistry, active ingredient percentages, real-time physiological simulations, or double-blind trial evidence. Sections are composed through the server component `<StorefrontSectionsWrapper />`, which reads section-visibility overrides from the server-backed settings CMS (ADR-013) — each numbered section below can be shown/hidden by the admin without a redeploy.

```
+---------------------------------------------------------------------------------------+
| Header: Navigation, Search, Currency/Locale Selector, Cart Drawer Trigger            |
+---------------------------------------------------------------------------------------+
| 1. Hero Editorial: CarboxyGel Non-Invasive Bohr Effect & Primary Clinical CTA         |
+---------------------------------------------------------------------------------------+
| 2. Trust Credibility Bar: ISO 13485, GMP UK, Cold-Chain IoT, 0-Float Ledger Guarantee |
+---------------------------------------------------------------------------------------+
| 3. Category & Concern Quick-Nav: 6 Clinical Filter Nodes (Acne, Barrier, Pigment, etc)|
+---------------------------------------------------------------------------------------+
| 4. Brand Family Architecture: ReeSkin (مصرفی خانگی) vs ReeMed (محلول‌های کلینیکی)      |
+---------------------------------------------------------------------------------------+
| 5. Featured Product Showcase: Server-Hydrated Clinical Product Family Rails           |
+---------------------------------------------------------------------------------------+
| 6. Bohr Effect Oxygenation Simulator: Dynamic Interactive Canvas & pH Dissociation    |
+---------------------------------------------------------------------------------------+
| 7. VISIA Clinical Trial Comparison Slider: Before/After Multi-Spectral Imaging         |
+---------------------------------------------------------------------------------------+
| 8. Skin Regimen Diagnostic Finder: 3-Step Interactive Patient Protocol Generator      |
+---------------------------------------------------------------------------------------+
| 9. Clinical Results & Peer Review Dossier: Histology, TEWL & Erythema Telemetry       |
+---------------------------------------------------------------------------------------+
| 10. Knowledge & Research Guides: Clinical Protocols & Ingredient Dossiers (Blog)      |
+---------------------------------------------------------------------------------------+
| 11. VIP Newsletter & Protocol Dispatch: Early Clinical Cohort Access                  |
+---------------------------------------------------------------------------------------+
| Footer: Regulatory Certifications, Legal Disclaimers, Ministry License Badges          |
+---------------------------------------------------------------------------------------+
```

---

## 2. Section-by-Section Functional Specifications

### 2.1 Hero Editorial (`<HeroBanner />`)
- **Visual Design**: High-contrast obsidian lab environment (`#070b12` background) with a clinical cyan backlight (`rgba(6, 182, 212, 0.12)`). High-definition product render of the CarboxyGel dual-phase activator syringe and CarboxyPod matrix.
- **Copy Hierarchy**:
  - *Badge*: `UK CLINICAL DERMATOLOGY LABS · BOHR EFFECT DYNAMICS`
  - *Primary Headline*: «انقلاب در اکسیژن‌رسانی بافتی بدون سوزن: CarboxyGel™»
  - *Sub-headline*: سیستم دوفازی فعال‌ساز دی‌اکسید کربن پزشکی. افت موضعی pH، اشباع بافت از O₂ از طریق اثر بور و تسریع بازسازی سلولی فیبروبلاست‌ها تا ۴۵٪.
- **Action Buttons**:
  - Primary CTA: «مشاهده پروتکل بالینی و خرید» (`/products/carboxygel` or `/carboxygel`) — styled with `station-btn-primary` with hover lift.
  - Secondary CTA: «مشاهده شبیه‌ساز فیزیولوژیک اثر بور» (smooth-scroll anchor `#bohr-simulator`).
- **Telemetry Indicators**:
  - Live clinical counters: `+۴۵% اشباع اکسیژن موضعی (tcpO₂)`, `۷۲ ساعت پایداری سد دفاعی`, `۰٪ ماده نگهدارنده پارابن`.

### 2.2 Trust Credibility Bar (`<TrustCredibilityBar />`)
- **Layout**: Single-row horizontal rail on desktop (`max-w-7xl`), horizontal snap-scroll on mobile (`overflow-x-auto`).
- **Clinical Pillars (4 Interactive Nodes)**:
  1. **ISO 13485:2016 Certified**: گواهینامه بین‌المللی تجهیزات پزشکی و تولید فرمولاسیون در کلین‌روم کلاس B انگلستان.
  2. **Active Cold-Chain Logistics**: سیستم ارسال سرد اختصاصی با پایش پیوسته دیتالاگر دما (بازه مجاز ۲ تا ۸ درجه سانتی‌گراد).
  3. **Zero-Float Financial Ledger**: تسویه حساب کاملاً شفاف و استاندارد بانکی شتاب/شاپرک با کد رهگیری دفتری غیرقابل دستکاری.
  4. **Direct Dermatologist Support**: مشاوره تخصصی تحت نظر درماتولوژیست‌های عضو کالج سلطنتی درماتولوژی بریتانیا.

### 2.3 Category & Concern Quick-Nav (`<CategoryConcernNav />`)
- **Functionality**: Multi-dimensional matrix allowing users to filter the catalog either by Product Type or Dermatological Concern.
- **Clinical Concern Pills**:
  - *آکنه و انسداد منافذ (Acne & Comedones)*: سالیسیلیک اسید ۲٪ و زینک PCA.
  - *لک و هیپرپیگمانتاسیون (Hyperpigmentation)*: ترانگزامیک اسید ۳٪ و نیاسینامید ۵٪.
  - *ترمیم سد دفاعی (Barrier Restoration)*: سرامید کمپلکس EOP/NP/AP و اسید هیالورونیک چندوزنی.
  - *پیری نوری و کلاژن‌سازی (Photo-Aging)*: رتینول انکپسوله ۰.۵٪ و ماتریکسیل ۳۰۰۰.
  - *اکسیژن‌رسانی و احیا (Bohr Oxygenation)*: کربوکسی‌تراپی ترنس‌درمال و فعال‌ساز اسیدی.
- **State Transition**: Clicking any pill triggers client-side route push to `/search?concern={slug}` with analytics event `select_concern_pill`.

### 2.4 Brand Family Architecture (`<BrandFamilyRail />`)
- **Architecture**: Clear visual dichotomy between the two official divisions of Dr Dermer UK:
  1. **ReeSkin™ Home-Care Consumables (مصرفی خانگی)**:
     - *Focus*: فرآورده‌های مصرفی مراقبت خانگی: ژل کربوکسی‌تراپی، کپسول‌های فعال‌ساز، پدها و ماسک‌ها، سرم‌ها و ژل‌های ترمیمی.
     - *Key Token*: Deep Medical Cyan (`#06b6d4`), Glass Frosted card, direct link to `/reeskin`.
  2. **ReeMed™ Clinical Solutions (محلول‌های کلینیکی)**:
     - *Focus*: محلول‌ها و پک‌های تخصصی درموسوتیکال برای روتین‌های پیشرفته مراقبت پوست.
     - *Key Token*: Glass Frosted card, direct link to `/reemed`.

### 2.5 Featured Product Showcase (`<FeaturedProductShowcase />`)
- **Hydration**: Populated from server-side `catalog.listProducts()`. If API is unreachable, falls back seamlessly to `RECOMMENDED_CLINICAL_PRODUCTS`.
- **Card Specifications**:
  - Real product photography (`aspect-square`, high-res WebP).
  - Cold-chain badge (`۲°-۸°C`) when product requires refrigeration.
  - INCI highlights: Key actives listed with exact concentration (e.g. `8.5% Active CO2 Base`).
  - Live pricing in Tomans with Persian digits (`Intl.NumberFormat('fa-IR')`).
  - Action buttons: Quick-Add to Cart (triggers CartDrawer with optimistic UI) and Quick View.

### 2.6 Bohr Oxygenation Simulator (`<BohrSimulator />`)
- **Physiological Purpose**: Educates the patient on the Christian Bohr physiological effect: when CO₂ penetrates the skin, extracellular pH drops from 7.4 to 6.8, causing oxyhemoglobin (HbO₂) to dissociate and release pure O₂ to starved tissues.
- **Interactive Controls**:
  - *CO₂ Concentration Slider*: 0 to 1,500 PPM.
  - *Contact Duration Slider*: 1 to 20 minutes.
- **Telemetry Visualizer**:
  - Real-time HTML5 Canvas or SVG curve rendering the Hemoglobin-Oxygen Dissociation curve.
  - Live calculation metrics:
    - Extracellular Tissue pH: `7.40` down to `6.82`.
    - Local Tissue Oxygenation (`tcpO₂`): `+0%` up to `+48.4%`.
    - Microvascular Capillary Dilation: `Normal` to `Vasodilation Max`.

### 2.7 VISIA Multi-Spectral Clinical Comparison Slider (`<VisiaComparisonSlider />`)
- **Specification**: Interactive split-screen before/after slider simulating Canfield VISIA multi-spectral dermatological imaging.
- **Modes**:
  - *Standard White Light (Cross-Polarized)*: Surface texture, erythema, active acne lesions.
  - *UV Fluorescence Imaging*: Porphyrin bacteria colonies, deep subsurface sun damage, melasma deposits.
- **Physics**: Pointer-drag and touch-drag slider with dampened motion; handles keyboard arrow keys (`ArrowLeft`, `ArrowRight`, `Home`, `End`) with `aria-valuenow` from 0 to 100.
- **Clinical Data**: Cites 14-day cohort trial (n=42 patients) with measured `-34% porphyrin density` and `+28% stratum corneum hydration`.

### 2.8 Skin Regimen Diagnostic Finder (`<SkinRegimenFinderWidget />`)
- **Patient Flow**:
  - *Step 1: Skin Phenotype*: Dry, Oily, Combination, Reactive/Sensitive.
  - *Step 2: Primary Dermatological Pathology*: Active acne, Melasma/Dyschromia, Impaired Barrier, Fine Lines/Elastosis.
  - *Step 3: Clinical Tolerance*: Experienced with AHAs/Retinoids vs Naive/Ultra-Sensitized.
- **Output**: Generates a tailored 3-step prescription (Cleansing/Polish -> Core Treatment -> Barrier Seal) with 1-click «افزودن تمام رژیم به سبد خرید با ۱۰٪ تخفیف کلینیکال».

### 2.9 Knowledge & Research Guides (`<AcademyGuides />`)
- **Content Rail** (links into the Blog / دانش و پژوهش archive):
  - *Guide 01*: «راهنمای پروتکل بازسازی پوست در ۷ روز با CarboxyGel» — step-by-step home protocol, Bohr-effect emphasis.
  - *Guide 02*: «ترکیب هوشمندانه رتینول انکپسوله و هیالورونیک اسید» — active-ingredient layering dossier.
  - *Guide 03*: «مدیریت ریکاوری و التیام پوست پس از لایه‌برداری و پیلینگ» — barrier-recovery protocol.
- **Positioning**: Educational knowledge base for retail consumers (دانش کاربردی مصرف) — not a training/academy product; legacy CME/academy tiers were retired with the B2B pivot.

### 2.10 VIP Newsletter & Protocol Dispatch (`<NewsletterVip />`)
- **Functional Requirements**:
  - Email / SMS input with Iranian phone number validation (`09xxxxxxxxx`).
  - Consent checkbox for clinical study releases.
  - Response payload: Immediate issuance of a VIP welcome gift coupon (`CLINIC-WELCOME`) granting 500,000 Rials credit.

---

## 3. Performance, SEO & Structured Data

### 3.1 Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: ≤ 1.2s (Hero banner image preloaded via `<link rel="preload">` in Next.js metadata).
- **Cumulative Layout Shift (CLS)**: 0.000 (Explicit aspect-ratios on all canvas containers, product cards, and VISIA sliders).
- **Interaction to Next Paint (INP)**: ≤ 75ms (Non-blocking slider state updates using React 19 `useTransition` where necessary).

### 3.2 Schema.org JSON-LD Entities
- `Organization`: Dr Dermer UK Clinical Laboratories.
- `MedicalBusiness`: Specialty `Dermatology`, local address in Tehran, global registry in London.
- `WebSite`: Sitelinks searchbox action pointing to `/search?q={search_term_string}`.
- `BreadcrumbList`: Standard root node.

### 3.3 Analytics & Telemetry Events
| Trigger Event | Payload |
| :--- | :--- |
| Page Load | `trackViewHome()` |
| Bohr Slider Scrub | `trackEvent('bohr_simulator_interact', { ppm, duration, calculated_o2 })` |
| VISIA Mode Toggle | `trackEvent('visia_mode_change', { mode: 'uv' \| 'cross_polarized' })` |
| Regimen Generated | `trackEvent('regimen_generated', { skinType, pathology, bundleId })` |
