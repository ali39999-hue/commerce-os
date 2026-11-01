# Specification: Customer & Clinical Account Dashboard (`/account`, `/subscriptions`, `/order/[id]`, `/pay/[intentId]`)
# Dr Dermer UK Clinical & Commerce OS

> **Routes**:
> - `/account`: Primary Clinical Account Overview, Profile & Saved Delivery Protocols
> - `/subscriptions`: Recurring Clinical Consumables & Practice Restocking Management
> - `/order/[id]`: 5-Stage Live Order Telemetry, Cold-Chain Temperature Log & Article 169-bis Tax Invoice
> - `/pay/[intentId]`: Dedicated Payment Settlement Portal for Invoices, Bank Failover & B2B Balances
>
> **Component Architecture**: Modular Server-Hydrated Architecture (`apps/storefront/app/account/`, `subscriptions/`, `order/[id]/`, `pay/[intentId]/`) utilizing real-time IoT polling, WebSockets for temperature telemetry, and zero-float ledger sync.  
> **Primary Purpose**: Empower clinical practitioners and discerning home-care patients to audit every phase of their relationship with Dr Dermer UK. Track cold-chain transit logs in real-time, modify automated recurring clinic shipments, inspect certified batch records, download Moadian-compliant tax invoices, and complete pending high-value settlements.

---

## 1. Unified Dashboard Architecture & Navigation

```
+--------------------------------------------------------------------------------------------------+
| Account Header: Patient/Clinic Profile, Medical Council ID Badge, Security Level, Notification Bell|
+--------------------------------------------------------------------------------------------------+
| Dashboard Sub-Navigation Tabs:                                                                   |
| [ ۱. خلاصه حساب ]    [ ۲. تاریخچه سفارش‌ها ]    [ ۳. اشتراک‌های مصرفی ]    [ ۴. مدارک و صورتحساب‌ها ] |
| (/account)          (/account/orders)        (/subscriptions)           (/account/invoices)      |
+--------------------------------------------------------------------------------------------------+
| Dashboard Layout Split (25% Sidebar / 75% Dynamic Content Stage):                                |
| +------------------------------------+-----------------------------------------------------------+
| | Left Sidebar: Account Quick Tools  | Right Content Area: Multi-Route Workspaces                |
| |                                    |                                                           |
| | - Profile Avatar & Medical Tier    | [ROUTE /account]                                          |
| |   (کلینیک همکار VIP / پزشک متخصص)   | - Recent Orders Snapshot & Cold-Chain Active Alert        |
| | - Credit Balance (کیف پول اعتباری) | - Saved Clinical Delivery Addresses                       |
| | - Active Subscriptions Indicator   | - Medical Practitioner Verification Status (نظام پزشکی)   |
| | - Download Pharmacovigilance Logs  |                                                           |
| | - Sign Out (خروج امن از حساب کاربری)| [ROUTE /subscriptions]                                    |
| |                                    | - Automated Monthly Consumables (CarboxyGel/Pods)         |
| |                                    | - Controls: Pause (توقف موقت), Resume (فعال‌سازی), Cancel |
| |                                    | - Delivery Frequency Selector (۳۰ روزه / ۶۰ روزه)          |
| |                                    | - Next Dispatch Date & Preferred Shipping Method          |
| |                                    |                                                           |
| |                                    | [ROUTE /order/[id]]                                       |
| |                                    | - 5-Stage Visual Tracking Stepper                         |
| |                                    | - Live Cold-Chain Temperature Sensor Telemetry (2°C-8°C)  |
| |                                    | - Interactive Article 169-bis Official Printable Invoice  |
| |                                    |                                                           |
| |                                    | [ROUTE /pay/[intentId]]                                   |
| |                                    | - Settling Outstanding Invoice / Card-to-Card Upload      |
| |                                    | - Direct Shaparak Retry Token Gateway                     |
| +------------------------------------+-----------------------------------------------------------+
```

---

## 2. Detailed Route Specification: `/account` (Overview & Credentials)

### 2.1 Medical Practitioner Verification Module
For B2B dermatologists, aesthetic physicians, and licensed clinics:
- **Status Indicator**:
  - `تایید شده (Verified)`: Green badge `#10b981`, showing registered Medical Council ID (شماره نظام پزشکی). Unlocks wholesale volume tiers and bulk 1500ml dispensers.
  - `در انتظار بررسی (Pending Review)`: Amber badge `#f59e0b`. Upload documents queued for medical compliance officer audit.
  - `کاربر عادی / خانگی (Retail Consumer)`: Slate badge `#64748b`. Standard pricing and home regimens.
- **Credential Upload Zone**: Allows doctors to upload their medical board license or clinic permit (PDF/JPG up to 10MB).

### 2.2 Clinical Wallet & Credit Facilities
- **Balance Card**: Shows live ledger credits in Tomans and Rials.
- **Top-Up Action**: Instant top-up via Shaparak payment gateway.
- **Credit Limit (B2B)**: Approved clinics receive up to 50,000,000 Tomans rolling 30-day settlement credit for uninterrupted clinical consumable supplies.

---

## 3. Detailed Route Specification: `/subscriptions` (Recurring Consumables Management)

### 3.1 Use Case: Uninterrupted Clinical Practice Supplies
Aesthetic practices running CarboX™ consoles or weekly patient Bohr-effect facial protocols cannot afford sudden stock depletion. The `/subscriptions` portal provides deterministic control over recurring delivery cadences.

### 3.2 Recurring Subscription Data Model
```typescript
export interface ClinicalSubscription {
  id: string; // e.g. "sub_carb_9824"
  status: 'active' | 'paused' | 'cancelled';
  productTitleFa: string; // e.g. "پکیج ماهانه ژل کربوکسی‌تراپی ۵۰۰ میلی‌لیتر + کارتریج پاد"
  sku: string;
  quantity: number;
  frequencyDays: 30 | 45 | 60;
  nextBillingDateShamsi: string; // e.g. "۱۴۰۴/۰۳/۱۵"
  nextBillingDateIso: string;
  preferredDeliveryMethod: 'cold_chain_courier' | 'post_pishtaz' | 'tipax_express';
  deliveryAddressSummary: string;
  unitPriceTomans: number;
  discountPercentage: number; // e.g. 15% recurring subscriber benefit
  totalPerCycleTomans: number;
  paymentMethod: 'clinical_wallet_auto_debit' | 'stored_token' | 'manual_settlement';
  pauseHistory: Array<{ pausedAt: string; resumedAt?: string; reason?: string }>;
}
```

### 3.3 Interactive Controls & State Machine

```
      +───────────────────────────────────────────────────────────+
      │                    ACTIVE SUBSCRIPTION                    │
      │  Next dispatch: ۱۴۰۴/۰۳/۱۵ (CarboxyGel Pro 500ml x 2)     │
      +─────────────────────────────┬─────────────────────────────+
                                    │
            ┌───────────────────────┴───────────────────────┐
            │ [ دکمه توقف موقت: Pause ]                     │ [ دکمه لغو اشتراک: Cancel ]
            ▼                                               ▼
+─────────────────────────────────────────+     +─────────────────────────────────────────+
| Modal: توقف موقت اشتراک (Pause Modal)    |     | Modal: لغو دائمی اشتراک (Cancel Modal)   |
| - Select pause duration:                |     | - Retention alert: فقدان تخفیف ۱۵٪ دوره |
|   • ۱ دوره (۳۰ روز تمدید)               |     | - Optional feedback reason:             |
|   • ۲ دوره (۶۰ روز تمدید)               |     |   • تعطیلی موقت کلینیک                  |
|   • تاریخ مشخص شمسی                     |     |   • مازاد موجودی انبار                  |
| - Action: "تایید توقف موقت"             |     |   • تغییر لاین درمانی                   |
+────────────────────┬────────────────────+     | - Action: "تایید نهایی لغو"             |
                     │                          +────────────────────┬────────────────────+
                     ▼                                               │
+─────────────────────────────────────────+                          ▼
| State: PAUSED (معلق)                    |     +─────────────────────────────────────────+
| - Banner: "اشتراک شما تا ۱۴۰۴/۰۴/۱۵     |     | State: CANCELLED (لغو شده)              |
|   متوقف گردید."                         |     | - Option: "فعال‌سازی مجدد اشتراک"       |
| - Action: "فعال‌سازی مجدد اکنون (Resume)"|     +─────────────────────────────────────────+
+─────────────────────────────────────────+
```

- **Instant Quantity & Cadence Adjustment**: Users can switch frequency between 30, 45, or 60 days via an interactive radio group without cancelling the underlying agreement.
- **Automatic Cold-Chain Allocation**: The system automatically reserves inventory in the central refrigerated cold-room 72 hours prior to dispatch.

---

## 4. Detailed Route Specification: `/order/[id]` (Telemetry & Tax Invoice)

### 4.1 5-Stage Live Order Tracking Timeline
Orders progress through 5 audited clinical checkpoints:

```
[۱. ثبت و پرداخت] ───► [۲. تخصیص کلین‌روم] ───► [۳. بسته‌بندی ایزوترمال] ───► [۴. تحویل به لجستیک سرد] ───► [۵. تحویل و ثبت دما]
Payment Confirmed     Cleanroom Batch Pick     Cold-Chain Packaging          Reefer Courier Transit       Delivered & Temperature Signed
```

1. **Stage 1: ثبت و پرداخت قطعی (Order & Payment Settled)**:
   - Zero-float ledger reconciliation, bank transaction RRN logged, TTAC serialization requested.
2. **Stage 2: تخصیص انبار و کلین‌روم (Cleanroom Allocation & Verification)**:
   - Batch numbers, expiry dates (> 18 months remaining), and pharmaceutical quality control stamps verified.
3. **Stage 3: آماده‌سازی محفظه ایزوترمال (Isothermal Cold Packaging)**:
   - Packed in insulated thermal styrofoam box with dry-ice packs and an active USB/NFC datalogger.
4. **Stage 4: تحویل به ناوگان یخچال‌دار (Dispatched via Temperature-Controlled Courier)**:
   - Live courier tracking initiated; active refrigerated vehicle assigned.
5. **Stage 5: تحویل به مشتری و تایید دما (Delivered & Thermal Integrity Signed)**:
   - Final datalogger check upon delivery. Recipient signs acknowledgment of thermal compliance (2°C to 8°C).

### 4.2 Real-Time Temperature Monitoring Banner (`<ColdChainTrackerBanner />`)
If the order contains temperature-sensitive items, an interactive telemetry card renders:

```
+--------------------------------------------------------------------------------------------------+
| پایش پیوسته زنجیره سرد (COLD-CHAIN IOT TELEMETRY)                                                 |
|                                                                                                  |
| [ STATUS: OPTIMAL STABILITY ]         دمای فعلی محفظه: +۴.۲°C (بازه مجاز: ۲ الی ۸ درجه سانتی‌گراد) |
| سنسور: SenseData IoT BLE-092          آخرین به‌روزرسانی: ۳ دقیقه پیش                                 |
|                                                                                                  |
|   +------------------------------------------------------------------------------------------+   |
| 8°C | - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  |   |
|     |                         _.~"~._                                                        |   |
| 4°C |~~~~~~~~~~~~~~~~~~~~~~~~~       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|   |
| 2°C | - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  |   |
|     +----------------------------------------------------------------------------------------+   |
|       10:00 (Dispatch)        12:00 (In Transit)       14:00 (Checkpoint)      15:30 (Current)   |
|                                                                                                  |
| یادداشت کیفی فارماکوپه: هیچ‌گونه شوک حرارتی یا انحراف از پروتکل دمایی ثبت نگردیده است.              |
+--------------------------------------------------------------------------------------------------+
```

### 4.3 Official Printable Tax Invoice (Article 169-bis / ماده ۱۶۹ مکرر قانون مالیات‌های مستقیم)
Clicking «چاپ صورتحساب الکترونیکی رسمی» renders a standardized Iranian tax invoice format optimized for `@media print` with crisp typography, official borders, and Moadian QR code:

```
+--------------------------------------------------------------------------------------------------+
| صورتحساب فروش کالا و خدمات (ماده ۱۶۹ مکرر قانون مالیات‌های مستقیم) - سامانه مودیان                |
| شماره سریال مالیاتی: 14040315-09824-A1      تاریخ صدور: ۱۴۰۴/۰۳/۱۵       شماره پیگیری: 89234189  |
+--------------------------------------------------------------------------------------------------+
| مشخصات فروشنده:                                                                                  |
| نام شخص حقیقی/حقوقی: شرکت درمان‌گستر درمر پارس (نماینده رسمی Dr Dermer UK)                        |
| شماره اقتصادی: 411589321458          شناسه ملی: 14009823145          شماره ثبت: 582319          |
| نشانی: تهران، جردن، بلوار نلسون ماندلا، پلاک ۴۲، ساختمان درمر   کد پستی: 1968631245  تلفن: ۰۲۱-۸۸۸۸xxxx |
+--------------------------------------------------------------------------------------------------+
| مشخصات خریدار:                                                                                   |
| نام خریدار / کلینیک: [نام مشتری / کلینیک زیبایی]                                                  |
| شماره اقتصادی / کد ملی: [کد ملی یا کد اقتصادی ۱۲ رقمی]       شناسه ملی: [در صورت حقوقی]          |
| نشانی: [استان، شهر، آدرس پستی دقیق ثبت‌شده]                کد پستی: [کد پستی ۱۰ رقمی خریدار]    |
+--------------------------------------------------------------------------------------------------+
| ردیف | شرح کالا یا خدمات        | بارکد TTAC  | تعداد | مبلغ واحد (ریال) | تخفیف | مبلغ کل مشمول | مالیات ۱۰٪ |
|  ۱   | ژل کربوکسی ۵۰۰ میل       | 06260...    |   ۲   |    32,000,000    |  10%  |   57,600,000  | 5,760,000  |
|  ۲   | پاد فعال‌ساز ویتامین      | 06260...    |   ۲   |    12,000,000    |   0%  |   24,000,000  | 2,400,000  |
+--------------------------------------------------------------------------------------------------+
| مجموع صورتحساب: 81,600,000 ریال | مالیات بر ارزش افزوده (۱۰٪): 8,160,000 ریال | قابل پرداخت: 89,760,000 ریال |
| مبلغ به حروف: هشتاد و نه میلیون و هفتصد و شصت هزار ریال                                           |
+--------------------------------------------------------------------------------------------------+
| مهر و امضای فروشنده: [مهر برجسته دیجیتال شرکت]     امضا و تایید دریافت خریدار: [امضای گیرنده]      |
+--------------------------------------------------------------------------------------------------+
```

- **Print Styling Attributes**:
  - Automatically hides dashboard headers, footers, and sidebars (`@media print { .no-print { display: none; } }`).
  - Sets paper size to standard A4 portrait (`@page { size: A4; margin: 10mm; }`).
  - Ensures clean black-and-white vector rendering with high contrast.

---

## 5. Detailed Route Specification: `/pay/[intentId]` (Settlement & Failover Portal)

### 5.1 Use Cases & Entry Points
1. **Unsettled Card-to-Card Orders**: User needs to upload or replace a rejected payment receipt.
2. **Expired Payment Sessions**: User's bank gateway timed out; provides an instant 1-click retry token without recreating the entire order.
3. **B2B Periodic Statements**: Clinic receives an invoice link to settle accumulated 30-day consumable accounts.

### 5.2 Interface Structure
- **Payment Intent Header**:
  - Displays Invoice Reference Number and Settlement Deadline (e.g. `مهلت پرداخت: ۲۳ ساعت و ۴۵ دقیقه باقی‌مانده`).
  - Itemized recap of products, VAT, and balance due in Tomans and Rials.
- **Failover Payment Controls**:
  - **Option 1: پرداخت فوری با درگاه شاپرک (Instant Shaparak Webpay)**: Generates a refreshed PSP session token.
  - **Option 2: پرداخت کارت به کارت یا انتقال ساتنا/پایا (Card-to-Card / SATNA Transfer)**:
    - Provides official account IBAN (شبا) with 1-click clipboard copy.
    - Drag-and-drop receipt uploader with image preview.
    - Input for transaction reference number (شماره پیگیری).
  - **Option 3: کسر از کیف پول اعتباری (Deduct from Clinical Wallet)**: If wallet balance covers the amount.

---

## 6. Accessibility & Security Controls
- **Audit Logging**: Every action on `/subscriptions` (pause, frequency change, cancellation) generates an immutable timestamped audit log in PostgreSQL.
- **Role-Based Protection**: B2B views and Article 169-bis invoices require authenticated sessions matching the order owner's National ID or Authorized Clinic Tax ID.
- **RTL Screen Reader Landmarks**: Navigation menus utilize `<nav aria-label="منوی حساب کاربری">`, and tracking timelines use ordered lists `<ol>` with `aria-current="step"`.
