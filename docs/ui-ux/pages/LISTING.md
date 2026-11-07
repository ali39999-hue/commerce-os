# Specification: Catalog Discovery & Faceted Search
# Dr Dermer UK Clinical & Commerce OS

> **Routes**: `/search` (Faceted Catalog Search & Discovery)  
> **Component Architecture**: Client-side reactive interface with URL query synchronization, bidirectional search indexing, responsive slide-out filter drawers, and zero-float price formatting.  
> **Primary Purpose**: Enable precise navigation through advanced clinical skincare formulations, cosmeceuticals, and home-care consumable protocols across Persian and English clinical terminology.

---

## 1. Page Architectural Hierarchy

```
+--------------------------------------------------------------------------------------------------+
| Header: Global Bar with Live Search Input, Cart Counter, Currency Selector                      |
+--------------------------------------------------------------------------------------------------+
| 1. Search Query Bar & Live Telemetry: Query Input, Debounced Autocomplete, Active Filter Badges  |
+--------------------------------------------------------------------------------------------------+
| 2. Mobile Filter Drawer Trigger & Desktop Layout Switcher: Grid View vs Clinical List View       |
+--------------------------------------------------------------------------------------------------+
| 3. Split Discovery Workspace:                                                                    |
|    +-------------------------------------------+-------------------------------------------------+
|    | Desktop Facet Sidebar (Sticky)            | Results Header: Total Count, Active Sort Dropdown|
|    | - Brand Families (ReeSkin, ReeMed)        |-------------------------------------------------|
|    | - Dermatological Concerns (Acne, Barrier) | Product Cards Grid (2 to 4 columns responsive)   |
|    | - Product Type (Physical, Digital, Bundle)| - Product Image, Cold-Chain Badge               |
|    | - Formulation Base (Gel, Serum, Polish)   | - Active INCI Percentages, Skin Type Indicators |
|    | - Price Range (Slider + Tomans Input)     | - Tabular Price in Tomans, Wishlist / Compare   |
|    | - In-Stock Toggle                         | - Quick Add-to-Cart with Optimistic Feedback    |
|    +-------------------------------------------+-------------------------------------------------+
+--------------------------------------------------------------------------------------------------+
| 4. Empty Search State (Zero Results): Heuristic Suggestions & Dermatology Consultation Trigger   |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Faceted Search System (`/search`)

### 2.1 Bidirectional Persian / English Search Indexing
- **Search Engine Logic**:
  - Persian queries (e.g. `کربوکسی ژل`, `سالیسیلیک`, `نیاسینامید`) must match both Persian display titles and English chemical/clinical metadata.
  - English queries (e.g. `CarboxyGel`, `Retinol`, `Crystalene`, `CO2`) must normalize against Persian aliases.
  - Normalization pipeline:
    - Digits normalized from Persian (`۱۲۳۴۵۶۷۸۹۰`) and Arabic (`١٢٣٤٥٦٧٨٩٠`) to ASCII digits.
    - Characters normalized: Yeh (`ي` -> `ی`), Kaf (`ك` -> `ک`), Zero-width non-joiner (ZWNJ / `\u200C`) handled gracefully in multi-word compounds (e.g. `کربوکسی‌ژل` matches `کربوکسی ژل` and `کربوکسیژل`).
- **Debounced Instant Search**:
  - Keypress triggers local filtering within 150ms.
  - Full server API fetch triggered with 300ms debounce to prevent socket flooding.
  - URL parameter `?q=...` synchronized via `window.history.replaceState` or Next.js router without full-page reloads.

### 2.2 Facet Dimensions & Filters
The search system supports 6 primary clinical facet groups:

| Facet Dimension | Filter Key | Available Options | UI Control Type |
| :--- | :--- | :--- | :--- |
| **برند بالینی (Brand)** | `brand` | `reeskin` (ReeSkin مصرفی خانگی), `reemed` (ReeMed محلول‌های کلینیکی) | Checkbox with count badge |
| **دسته درمانی (Category)** | `category` | `skincare` (مراقبت تخصصی پوست و کلینیکال), `reeskin` (لاین بالینی ReeSkin), `reemed` (لاین تخصصی درموسوتیکال ReeMed) | Multi-select list |
| **اندیکاسیون پوستی (Concern)** | `concern` | `acne`, `pigmentation`, `aging`, `barrier`, `dryness`, `rosacea-erythema` | Clinical pill buttons |
| **نوع محصول (Type)** | `type` | `physical` (کالای فیزیکی), `digital` (کالای دیجیتال دانلودی), `bundle` (پکیج درمانی) | Radio group |
| **پایه فرمولاسیون (Formulation)** | `formulation` | `dual-phase-gel`, `biomimetic-serum`, `micro-polish`, `hydrogel-mask`, `sterile-vial` | Multi-select chips |
| **موجودیت و زنجیره سرد (Stock)** | `stock` | فقط کالاهای موجود در انبار زنجیره سرد | Binary toggle switch |
| **محدوده قیمت (Price)** | `min`, `max` | ۰ الی ۵۰,۰۰۰,۰۰۰ تومان | Dual range slider + numeric inputs |

### 2.3 Sort Mechanics
Sort menu provides 4 clinical and commercial ordering options:
1. `popular` (محبوب‌ترین): Weighted by review score (40%), clinical protocol citations (30%), and 30-day velocity (30%).
2. `newest` (جدیدترین): Descending order of formulation batch release / lab certification date.
3. `price_asc` (ارزان‌ترین): Ascending order of current unit price in Tomans.
4. `price_desc` (گران‌ترین): Descending order of current unit price in Tomans.

### 2.4 Mobile Filter Drawer (`FilterDrawer`)
- **Physics**: Off-canvas drawer sliding from right-to-left (standard RTL direction) with 60fps hardware-accelerated CSS transform (`translateX(0)` to `translateX(100%)`).
- **Accessibility**:
  - Focus trapped within drawer when open.
  - Esc key dismisses drawer.
  - Background overlay (`backdrop-filter: blur(8px)`) blocks interaction with catalog.
  - Sticky bottom action bar containing «مشاهده نتایج (N مورد)» and «پاک‌سازی تمام فیلترها».

### 2.5 Empty Search State (Zero Results)
When no products match the combined criteria:
- **Clinical Fallback UI**:
  - High-visibility banner: «هیچ فرآورده یا پروتکلی منطبق با جستجوی شما یافت نشد».
  - *Auto-Recovery Suggestions*:
    - Automatic spelling suggestion (e.g. «آیا منظور شما **کربوکسی‌ژل** بود؟»).
    - Removal buttons for the most restrictive active filters.
  - *Recommended Protocols Rail*: Fallback carousel displaying top 4 universal clinical formulations (`RECOMMENDED_CLINICAL_PRODUCTS`).
  - *Dermatology Support CTA*: Direct button to open the `<SkinDiagnosticDrawer />` for personalized assistance.

---

## 3. Telemetry, Analytics & Performance

### 3.1 Search Analytics Pipeline
Every search interaction publishes structured telemetry:
```typescript
// 1. Search Query Submitted
trackSearch({
  search_term: query,
  filters_applied: { brand, category, concern, stock },
  results_count: totalResults,
});

// 2. Results List Viewed
trackViewItemList({
  item_list_id: 'search_results',
  item_list_name: `نتایج جستجو: ${query}`,
  items: items.map((item, idx) => ({
    item_id: item.id,
    item_name: item.title,
    item_brand: item.brand?.name,
    item_category: item.category?.titleFa,
    price: Number(item.priceRials),
    index: idx + 1,
  })),
});
```

### 3.2 Performance Budgets
- Filter toggle latency: ≤ 50ms to re-filter and render items in memory.
- Search API response cache: Client-side SWR / memory cache for identical query tuples for 5 minutes.
- Image lazy loading: `loading="lazy"` with blur placeholder hashes for all catalog card thumbnails.
