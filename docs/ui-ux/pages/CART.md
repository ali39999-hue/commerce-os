# Specification: Cart Page (`/cart`) & Clinical Cart Drawer (`<CartDrawer />`)
# Dr Dermer UK Clinical & Commerce OS

> **Route**: `/cart` (Full Page View) & Global Slide-Over Sheet (`<CartDrawer />`)  
> **Component Architecture**: Hybrid React Server Component (`apps/storefront/app/cart/page.tsx`) with high-concurrency client state hydration (`CartContext.tsx`, `CartDrawer.tsx`, `MilestoneProgressBar.tsx`, `CartItemRow.tsx`, `CrossSellCarousel.tsx`, `CouponInputSection.tsx`, `CartFinancialSummary.tsx`).  
> **Primary Purpose**: Provide a friction-free, mathematically deterministic staging ground for clinical orders. Bridge transdermal consumable reorders and B2B clinic restocking with real-time cold-chain tracking incentives, volume-tier pricing breakdowns, dynamic protocol cross-sells, coupon validation, and strict 10% Iranian VAT accounting.

---

## 1. Page & Drawer Architectural Layout & Hierarchy

```
+--------------------------------------------------------------------------------------------------+
| Cart Header: Navigation, Return to Clinical Catalog, Cart Count Badge                            |
+--------------------------------------------------------------------------------------------------+
| 2-Tier Clinical Milestone Progress Bar:                                                          |
| [===================>                       |                                                 ]  |
| 0 Toman           1,500,000 Tomans (Free Cold-Chain)          3,000,000 Tomans (VIP Tele-Derm)   |
| Status: "تنها ۴۵۰,۰۰۰ تومان تا ارسال رایگان زنجیره سرد با حفظ دمای ۲ الی ۸ درجه"                   |
+--------------------------------------------------------------------------------------------------+
| Desktop 2-Column Clinical Layout (65% Cart Items & Cross-Sell / 35% Order Financial Summary):   |
| +--------------------------------------------------+---------------------------------------------+
| | Left Column: Cart Inventory & Regimen Completers | Right Column: Financial Order Dossier       |
| |                                                  |                                             |
| | 1. Active Line Items Table / List:               | 1. Order Financial Breakdown:               |
| |    - Product Image (Aspect 1:1, Cleanroom WebP)  |    - Subtotal (مجموع فرآورده‌ها)            |
| |    - Brand Tag (ReeSkin / ReeMed)                |    - Volume Discount (تخفیف تیراژ کلینیکال) |
| |    - Clinical Name (FA) & INCI Actives (EN)      |    - Coupon Discount (کد تخفیف معتبر)       |
| |    - Cold-Chain Storage Indicator (2-8°C)        |    - Taxable Amount (مبلغ مشمول مالیات)     |
| |    - Unit Price & Volume Tier Applied Badge      |    - 10% Iranian VAT (مالیات بر ارزش افزوده)|
| |    - Quantity Controller (- / QTY / +)           |    - Cold-Chain Shipping (هزینه ارسال سرد)   |
| |    - Total Line Price (Tomans)                   |    - Net Payable (مبلغ قابل پرداخت)         |
| |    - Quick Remove / Archive Action               |                                             |
| |                                                  | 2. Clinical Promo & Coupon Input:           |
| | 2. Dynamic Protocol Cross-Sell Rail:             |    - [ DERMER20 ] [ OFF10 ] Quick Pills     |
| |    - "فرمولاسیون‌های مکمل پروتکل کربوکسی‌تراپی"   |    - Input Field + Apply Trigger            |
| |    - Recommended: CarboxyPod, Healene, Crystalene|    - Validation feedback (Success/Error)    |
| |    - 1-Click "افزودن به پروتکل درمانی"           |                                             |
| |                                                  | 3. Primary Checkout Trigger:                |
| | 3. Cold-Chain Safety & Medical Compliance Note   |    - "ادامه فرایند خرید و ثبت نشانی"         |
| |    - Insulated Packaging & DataLogger Guarantee  |    - Security Trust Badges (ISO 13485 / SSL)|
| +--------------------------------------------------+---------------------------------------------+
+--------------------------------------------------------------------------------------------------+
| Mobile Sticky Summary Footer: Net Payable + "تکمیل سفارش" Button                                 |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. 2-Tier Milestone Progress Bar (`<MilestoneProgressBar />`)

### 2.1 Milestone Thresholds and Value Propositions
The progress bar motivates cart value optimization by unlocking tangible medical and delivery benefits:

1. **Tier 1 (1,500,000 Tomans / 15,000,000 Rials)**:
   - **Benefit**: ارسال رایگان زنجیره سرد (Free Refrigerated Cold-Chain Courier).
   - **Clinical Value**: Specialized insulated styrofoam transport box with dry-ice packs and an active digital temperature datalogger ensuring 2°C to 8°C thermal stability from central laboratory to doorstep. Normal delivery fee: 95,000 Tomans.
2. **Tier 2 (3,000,000 Tomans / 30,000,000 Rials)**:
   - **Benefit**: ویزیت آنلاین تخصصی درماتولوژیست VIP (Complimentary VIP Clinical Tele-Dermatology Consultation).
   - **Clinical Value**: Direct 20-minute digital diagnostic consultation with a licensed British-trained dermatologist for protocol personalization and skin tolerance monitoring. Value: 450,000 Tomans.

### 2.2 Mathematical Progression Logic
```typescript
interface MilestoneState {
  currentSubtotalTomans: number;
  tier1ThresholdTomans: 1_500_000;
  tier2ThresholdTomans: 3_000_000;
  progressPercentage: number;
  unlockedTier1: boolean;
  unlockedTier2: boolean;
  deltaToNextTierTomans: number;
  nextRewardMessageFa: string;
}

export function calculateMilestones(subtotalTomans: number): MilestoneState {
  const TIER1 = 1_500_000;
  const TIER2 = 3_000_000;
  
  const unlockedTier1 = subtotalTomans >= TIER1;
  const unlockedTier2 = subtotalTomans >= TIER2;

  // Linear scaling across a 0-100% bar split evenly at 50% for Tier 1
  let progressPercentage = 0;
  if (subtotalTomans <= TIER1) {
    progressPercentage = (subtotalTomans / TIER1) * 50;
  } else if (subtotalTomans <= TIER2) {
    progressPercentage = 50 + ((subtotalTomans - TIER1) / (TIER2 - TIER1)) * 50;
  } else {
    progressPercentage = 100;
  }

  let deltaToNextTierTomans = 0;
  let nextRewardMessageFa = '';

  if (!unlockedTier1) {
    deltaToNextTierTomans = TIER1 - subtotalTomans;
    nextRewardMessageFa = `تنها ${formatToman(deltaToNextTierTomans)} تومان تا ارسال رایگان زنجیره سرد (۲ الی ۸ درجه)`;
  } else if (!unlockedTier2) {
    deltaToNextTierTomans = TIER2 - subtotalTomans;
    nextRewardMessageFa = `تنها ${formatToman(deltaToNextTierTomans)} تومان تا دریافت هدیه ویزیت آنلاین درماتولوژیست VIP`;
  } else {
    deltaToNextTierTomans = 0;
    nextRewardMessageFa = 'تبریک! هر دو امتیاز ویژه ارسال رایگان سرد و مشاوره VIP درماتولوژیست فعال شدند.';
  }

  return {
    currentSubtotalTomans: subtotalTomans,
    tier1ThresholdTomans: TIER1,
    tier2ThresholdTomans: TIER2,
    progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
    unlockedTier1,
    unlockedTier2,
    deltaToNextTierTomans,
    nextRewardMessageFa
  };
}
```

### 2.3 Visual States & Micro-Interactions
- **Base Track**: 8px height, rounded full, background `#1e293b`.
- **Fill Gradient**: Transitions from `#06b6d4` (Medical Cyan) to `#8b5cf6` (Plasma Violet) to `#10b981` (Bio-inert Emerald) upon achieving Tier 2.
- **Node Pin 1 (50% position)**:
  - Inactive: Frosted circle with cyan border.
  - Active: Filled cyan badge with miniature thermometer icon and pulse ring animation.
- **Node Pin 2 (100% position)**:
  - Inactive: Frosted circle with violet border.
  - Active: Filled emerald badge with medical cross shield and shimmering celebration shine.

---

## 3. Cart Line Items & Volume Discount Tiers (`<CartItemRow />`)

### 3.1 Line Item Presentation
Every item in the cart displays full clinical context to eliminate ambiguity:
- **Product Thumbnail**: 80x80px rounded-lg container with high-contrast laboratory render.
- **Brand Identity Badge**: `ReeSkin™` (Transdermal) in Cyan or `ReeMed™` (Hardware/Accessories) in Violet.
- **Bilingual Nomenclature**: e.g., «ژل کربوکسی‌تراپی حرفه‌ای ۵۰۰ میلی‌لیتر» / *CarboxyGel™ Pro Clinic Dispenser*.
- **Cold-Chain Pill**: Displayed if `requiresColdChain: true` (`۲°-۸°C یخ درای-آیس`).
- **Volume Discount Alert Pill**: Notifies user of currently applied tier or units needed for the next pricing tier.

### 3.2 Volume Discount Matrix (Clinic Restocking & Bulk Packs)
Applicable to consumables (e.g. CarboxyGel 500ml/1500ml, CarboxyPad, Crystalene):

| Tier Level | Quantity Range | Discount Percentage | Applied Badge (FA) | Intended Audience |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1 (Base)** | 1 – 4 Units | 0% | قیمت تک‌کاربره | B2C Home Regimen |
| **Tier 2 (Pro Regimen)** | 5 – 9 Units | 10% | ۱۰٪ تخفیف دوره کامل | Clinic Estheticians |
| **Tier 3 (Clinic Bulk)** | 10 – 19 Units | 18% | ۱۸٪ تخفیف کلینیکال عمده | Aesthetic Clinics |
| **Tier 4 (Institution)** | 20+ Units | 25% | ۲۵٪ تخفیف توزیع سازمانی | Medical Centers & Hospitals |

### 3.3 Dynamic Line Quantity Updates & Optimistic UI
```typescript
interface CartItem {
  id: string;
  sku: string;
  productId: string;
  titleFa: string;
  titleEn: string;
  variantTitleFa: string;
  thumbnailUrl: string;
  basePriceTomans: number;
  quantity: number;
  requiresColdChain: boolean;
  maxOrderLimit: number;
  availableStock: number;
  volumeTiers: Array<{ minQty: number; discountPercent: number }>;
}

export function calculateEffectiveItemPrice(item: CartItem): {
  unitPriceTomans: number;
  discountPercent: number;
  lineTotalTomans: number;
  savingsTomans: number;
} {
  let discountPercent = 0;
  // Match highest eligible tier
  for (const tier of item.volumeTiers.sort((a, b) => b.minQty - a.minQty)) {
    if (item.quantity >= tier.minQty) {
      discountPercent = tier.discountPercent;
      break;
    }
  }

  const unitPriceTomans = Math.round(item.basePriceTomans * (1 - discountPercent / 100));
  const lineTotalTomans = unitPriceTomans * item.quantity;
  const savingsTomans = (item.basePriceTomans * item.quantity) - lineTotalTomans;

  return { unitPriceTomans, discountPercent, lineTotalTomans, savingsTomans };
}
```

- **Stock Guard**: If user taps `+` beyond `availableStock` or `maxOrderLimit`, an inline toast warns: «حداکثر سقف مجاز سفارش زنجیره سرد این فرآورده رعایت شده است».
- **Optimistic State Rollback**: If network fails during quantity patch, cart reverts to previous state with toast: «خطا در همگام‌سازی موجودی انبار. مجدداً تلاش فرمایید».

---

## 4. Dynamic Regimen Cross-Sell Engine (`<CrossSellCarousel />`)

### 4.1 Recommendation Heuristics & Protocol Complementarity
Rather than showing unrelated items, recommendations are driven by clinical procedural synergy:

```
[In Cart: CarboxyGel™ Pro]
           │
           ├─► Recommends: CarboxyPod™ Activator Scrub (Vitamin / Carbon / Hydra)
           │   Reason: Essential acid-base effervescent catalyst for Bohr Effect release (>1,100 ppm CO2).
           │
           ├─► Recommends: Healene™ Soothing Barrier Gel (5% Dexpanthenol + 3% Centella)
           │   Reason: Mandated post-carboxy epidermal recovery; quells acute vasodilation erythema.
           │
           └─► Recommends: Crystalene™ Microderm Polish Paste (12% Rounded Alumina)
               Reason: Pre-treatment stratum corneum exfoliation for 3.4x deeper transdermal CO2 penetration.
```

### 4.2 Cross-Sell Card Schema
```typescript
interface ProtocolCrossSell {
  id: string;
  slug: string;
  titleFa: string;
  titleEn: string;
  clinicalRoleFa: string; // e.g. "مرحله پیش‌درمان: لایه‌برداری کریستالی بدون ایجاد ریزخراش"
  activeActivesEn: string; // e.g. "12% Al2O3 Microcrystals + 2% Niacinamide"
  priceTomans: number;
  discountedPriceTomans?: number;
  thumbnailUrl: string;
  requiresColdChain: boolean;
  synergyReasonFa: string; // e.g. "افزایش نفوذپذیری گاز CO2 تا ۳.۴ برابر"
}
```

### 4.3 1-Click Addition Interaction
- Action button displays: `+ افزودن به پروتکل درمانی`.
- Tapping triggers an instantaneous optimistic cart update, shifts the Milestone Progress Bar upwards with particle effect, and toggles the button to `✓ در سبد پروتکل`.

---

## 5. Coupon Codes & Iranian Financial Ledger Calculations

### 5.1 Official Coupon Definitions
1. **`DERMER20`**:
   - **Discount**: 20% off all ReeSkin transdermal formulations.
   - **Eligibility**: Cart must contain at least one ReeSkin consumable. Maximum discount cap: 600,000 Tomans.
   - **Usage Limit**: Once per verified mobile customer account.
2. **`OFF10`**:
   - **Discount**: 10% sitewide introductory discount on first order.
   - **Eligibility**: Minimum order subtotal 1,000,000 Tomans. Applies across both ReeSkin and ReeMed items.
   - **Stacking Rule**: Non-stackable with other promotional coupon codes; overrides or is overridden by `DERMER20`.

### 5.2 10% Iranian VAT (مالیات بر ارزش افزوده) & Financial Ledger
Iran Value Added Tax is calculated strictly at **10%** of the net taxable base in accordance with the 1403/1404 Tax Laws (قانون مالیات بر ارزش افزوده مصوب مجلس شورای اسلامی).

#### Mathematical Formula:
$$\text{Gross Subtotal} = \sum (\text{Item Base Price} \times \text{Quantity})$$
$$\text{Volume Discount} = \sum (\text{Base Price} - \text{Tier Price}) \times \text{Quantity}$$
$$\text{Coupon Discount} = \text{CalculateCoupon}(\text{Gross Subtotal} - \text{Volume Discount}, \text{CouponCode})$$
$$\text{Net Taxable Base} = \text{Gross Subtotal} - \text{Volume Discount} - \text{Coupon Discount}$$
$$\text{Iranian VAT (10\%)} = \text{Round}(\text{Net Taxable Base} \times 0.10)$$
$$\text{Shipping Fee} = (\text{Net Taxable Base} \ge 1,500,000 \text{ Tomans}) \mathbin{?} 0 : 95,000 \text{ Tomans}$$
$$\text{Total Payable} = \text{Net Taxable Base} + \text{Iranian VAT} + \text{Shipping Fee}$$

### 5.3 Zero-Float TypeScript Ledger Implementation
```typescript
export interface CartFinancialSummary {
  grossSubtotalRials: bigint;
  volumeDiscountRials: bigint;
  couponDiscountRials: bigint;
  netTaxableBaseRials: bigint;
  vatRials: bigint;              // Exactly 10% of netTaxableBaseRials
  shippingFeeRials: bigint;      // 0 if >= 15,000,000 Rials, else 950,000 Rials
  totalPayableRials: bigint;
  
  // Converted display values in Tomans (1 Toman = 10 Rials)
  grossSubtotalTomans: number;
  volumeDiscountTomans: number;
  couponDiscountTomans: number;
  netTaxableBaseTomans: number;
  vatTomans: number;
  shippingFeeTomans: number;
  totalPayableTomans: number;
  
  appliedCouponCode: string | null;
  couponValidationMessageFa?: string;
}

export function computeCartLedger(
  items: CartItem[],
  appliedCoupon: string | null
): CartFinancialSummary {
  let grossRials = 0n;
  let volumeDiscountRials = 0n;

  for (const item of items) {
    const itemBaseRials = BigInt(item.basePriceTomans) * 10n;
    const qty = BigInt(item.quantity);
    grossRials += itemBaseRials * qty;

    const { savingsTomans } = calculateEffectiveItemPrice(item);
    volumeDiscountRials += BigInt(savingsTomans) * 10n;
  }

  const discountedBaseRials = grossRials - volumeDiscountRials;
  let couponDiscountRials = 0n;
  let couponValidationMessageFa = '';

  if (appliedCoupon === 'DERMER20') {
    // 20% on ReeSkin items up to 6,000,000 Rials (600,000 Tomans)
    const rawDiscount = (discountedBaseRials * 20n) / 100n;
    const capRials = 6_000_000n;
    couponDiscountRials = rawDiscount > capRials ? capRials : rawDiscount;
    couponValidationMessageFa = 'کد تخفیف ۲۰٪ فرمولاسیون‌های ری‌اسکین با موفقیت اعمال گردید.';
  } else if (appliedCoupon === 'OFF10') {
    if (discountedBaseRials >= 10_000_000n) {
      couponDiscountRials = (discountedBaseRials * 10n) / 100n;
      couponValidationMessageFa = 'کد تخفیف ۱۰٪ سفارش اول با موفقیت اعمال گردید.';
    } else {
      couponValidationMessageFa = 'حداقل مبلغ سفارش برای اعمال کد OFF10، ۱,۰۰۰,۰۰۰ تومان می‌باشد.';
    }
  }

  const netTaxableBaseRials = discountedBaseRials - couponDiscountRials;
  // 10% Iranian VAT
  const vatRials = (netTaxableBaseRials * 10n) / 100n;

  // Cold-Chain Shipping Fee: 0 if >= 15,000,000 Rials (1,500,000 Tomans)
  const isFreeShipping = netTaxableBaseRials >= 15_000_000n;
  const shippingFeeRials = isFreeShipping ? 0n : 950_000n; // 95,000 Tomans

  const totalPayableRials = netTaxableBaseRials + vatRials + shippingFeeRials;

  return {
    grossSubtotalRials,
    volumeDiscountRials,
    couponDiscountRials,
    netTaxableBaseRials,
    vatRials,
    shippingFeeRials,
    totalPayableRials,

    grossSubtotalTomans: Number(grossRials / 10n),
    volumeDiscountTomans: Number(volumeDiscountRials / 10n),
    couponDiscountTomans: Number(couponDiscountRials / 10n),
    netTaxableBaseTomans: Number(netTaxableBaseRials / 10n),
    vatTomans: Number(vatRials / 10n),
    shippingFeeTomans: Number(shippingFeeRials / 10n),
    totalPayableTomans: Number(totalPayableRials / 10n),

    appliedCouponCode: couponDiscountRials > 0n ? appliedCoupon : null,
    couponValidationMessageFa
  };
}
```

---

## 6. Slide-Over Cart Drawer (`<CartDrawer />`)

### 6.1 Modal Behavior and Interaction Physics
- **Trigger**: Header Cart Icon or any inline `Add to Cart` event.
- **Backdrop**: `#070b12` with 80% opacity and `backdrop-blur-md`.
- **Panel**: Width 480px on desktop (`w-full sm:max-w-md`), 100% width on mobile viewports.
- **Direction**: Slides from physical right in RTL mode (`transform: translateX(0)` with spring motion easing `[0.16, 1, 0.3, 1]`).
- **Focus Trap**: Traps keyboard tab focus inside the drawer; pressing `Escape` dismisses the drawer smoothly.
- **Body Scroll Lock**: Attaches `overflow: hidden` to `document.body` while mounted.

### 6.2 Layout Sections Inside Drawer
1. **Drawer Header**:
   - Title: «سبد درمان و فرآورده‌های بالینی» with item counter badge.
   - Close button (`aria-label="بستن سبد خرید"`).
2. **Compact Milestone Bar**: Scaled-down version of the 2-tier milestone progress bar.
3. **Scrollable Items Container**: High-density line item list with compact +/- controllers and delete actions.
4. **Mini Cross-Sell Ribbon**: Quick-add pills for CarboxyPod and Healene.
5. **Fixed Sticky Footer**:
   - Financial totals: Net Subtotal, 10% VAT, Shipping fee indicator.
   - Net Payable in Tomans with Persian numerals.
   - Primary Action CTA: «تکمیل سفارش و پرداخت نهایی» routing directly to `/checkout`.
   - Secondary Link: «مشاهده و ویرایش سبد کامل» routing to `/cart`.

---

## 7. State Transitions & Edge Cases

| Scenario | State / UI Feedback | User Recovery Action |
| :--- | :--- | :--- |
| **Empty Cart** | Laboratory glassware icon with illustration; copy: «سبد درمان شما در حال حاضر خالی است.» | Primary button: «مشاهده کاتالوگ فرآورده‌های درموسوتیکال» (`/catalog`). |
| **Out-of-Stock Item in Cart** | Item row tinted red (`#ef4444`); badge: «اتمام موجودی در انبار سردخانه مرکزی». Checkout CTA disabled. | Button: «حذف فرآورده‌های ناموجود» updates cart state instantly. |
| **Cold-Chain Alert Warning** | Cart contains biologics requiring 2-8°C storage: Amber banner indicates required refrigerated courier dispatch. | Clarifies delivery requirements; courier options preset in checkout. |
| **Invalid or Expired Coupon** | Input border flashes red (`#ef4444`); error message: «کد تخفیف وارد شده منقضی شده یا با اقلام سبد همخوانی ندارد.» | User can re-enter code or tap default suggestion pills. |
| **Max Limit Exceeded** | Counter `+` button disables; tooltip indicates hospital/clinic procurement protocol limits. | User can submit B2B wholesale inquiry at `/b2b` for commercial volumes. |

---

## 8. WCAG 2.2 AA Accessibility Specifications
- **Tabular Numerals**: All price numbers use `font-feature-settings: "tnum"` to guarantee visual vertical alignment without jitter.
- **RTL Screen Reader Support**: All dynamic messages include `aria-live="polite"` so screen readers announce milestone updates when items are added.
- **Touch Targets**: All quantity buttons (`+`, `-`, delete) meet the minimum 44x44px clickable target box.
- **Contrast**: Muted tax annotations exceed 4.5:1 against elevated card surface `#0c131f`.
