# Specification: Checkout Page (`/checkout`)
# Dr Dermer UK Clinical & Commerce OS

> **Route**: `/checkout`  
> **Component Architecture**: Client-Side Hydrated Stepper Form (`apps/storefront/app/checkout/page.tsx`) orchestrated via `CheckoutContext.tsx` with dedicated subcomponents (`CheckoutStepper.tsx`, `StepCustomerDetails.tsx`, `StepDeliveryMethods.tsx`, `StepPaymentMethods.tsx`, `OrderSummarySidebar.tsx`, `NationalIdValidator.tsx`, `MoadianTaxInvoiceFields.tsx`, `ColdChainNoticeCard.tsx`).  
> **Primary Purpose**: Facilitate a secure, medically compliant, 3-step checkout experience for retail dermatological clients and B2B clinical practices. Enforce strict Iranian National ID (کد ملی) Modulo-11 validation, support official Iranian Moadian System (سامانه مودیان / ماده ۱۶۹ مکرر) corporate tax invoices, configure temperature-controlled delivery options, and submit idempotent orders across Shaparak, Card-to-Card, and Clinic Credit Wallets.

---

## 1. Page Architectural Layout & Hierarchy

```
+--------------------------------------------------------------------------------------------------+
| Minimalist Checkout Header: Dr Dermer UK Monogram, 256-Bit SSL Encrypted Badge, Back to Cart    |
+--------------------------------------------------------------------------------------------------+
| 3-Step Clinical Checkout Stepper:                                                                |
| (1) مشخصات و فاکتور مالیاتی  ────►  (2) شیوه ارسال زنجیره سرد  ────►  (3) درگاه پرداخت شاپرک     |
| [ Active / Completed ]              [ Pending / Active ]             [ Pending ]                 |
+--------------------------------------------------------------------------------------------------+
| Desktop 2-Column Checkout Layout (65% Interactive Form Stepper / 35% Sticky Order Dossier):     |
| +--------------------------------------------------+---------------------------------------------+
| | Left Column: Active Step Form Stage              | Right Column: Order Ledger & Cold-Chain Box |
| |                                                  |                                             |
| | === STEP 1: CUSTOMER & TAX DETAILS ===           | 1. Itemized SKU Roster:                     |
| | - Mobile Number (09xxxxxxxxx with SMS OTP check) |    - Thumbnails, QTY, Cold-Chain Tags       |
| | - Full Name / Medical Title (دکتر / کارشناس)     |    - Applied Volume Discount Tags           |
| | - Iranian National ID (کد ملی ۱۰ رقمی با صحت سنجی)|                                             |
| | - Province & City Cascading Selectors            | 2. Thermal Packaging Guarantee:             |
| | - Physical Address & Postal Code (۱۰ رقمی)       |    - "بسته‌بندی ایزوترمال با سنسور دیتالاگر"|
| | - Toggle: "درخواست صدور فاکتور رسمی سامانه مودیان"|    - تضمین دمای ۲ الی ۸ درجه سانتی‌گراد     |
| |   [+] National Legal ID (شناسه ملی حقوقی)        |                                             |
| |   [+] Economic Code (کد اقتصادی جدید ۱۲ رقمی)    | 3. Complete Financial Summary:              |
| |   [+] Postal Code of Registered Office           |    - Subtotal (مجموع اقلام)                 |
| |                                                  |    - Volume Discount (تخفیف تیراژ)          |
| | === STEP 2: COLD-CHAIN & SHIPPING ===            |    - Coupon Discount (کد تخفیف)             |
| | - Option A: پیک اختصاصی زنجیره سرد یخچال‌دار      |    - 10% Iranian VAT (مالیات ارزش افزوده)   |
| |   (Active 2-8°C refrigerated van with Datalogger)|    - Shipping Cost (هزینه ارسال)            |
| | - Option B: پست پیشتاز سفارشی (عایق آلومینیومی)  |    - Net Payable (مبلغ نهایی قابل پرداخت)   |
| | - Option C: تیپاکس اکسپرس (ارسال فوری بین‌شهری)  |                                             |
| | - Delivery Notes & Medical Clinic Access Window  | 4. Customer Support Guarantee:              |
| |                                                  |    - "پشتیبانی امور دارویی و کلینیکال"      |
| | === STEP 3: PAYMENT & SHAPARAK GATEWAY ===       |    - تماس ۲۴ ساعته: ۰۲۱-۸۸۸۸xxxx            |
| | - Method 1: درگاه پرداخت اینترنتی شاپرک (سداد/سامان)|                                          |
| | - Method 2: کارت به کارت با آپلود تصویر فیش بانکی |                                             |
| | - Method 3: کیف پول اعتباری کلینیکال (VIP Credit) |                                             |
| |                                                  |                                             |
| | Navigation Actions:                              |                                             |
| | [ بازگشت به مرحله قبل ]    [ ادامه و ثبت نهایی ] |                                             |
| +--------------------------------------------------+---------------------------------------------+
+--------------------------------------------------------------------------------------------------+
| Security Footer: تاییدیه شاپرک، نماد اعتماد الکترونیکی (اینماد)، نشان ملی ثبت رسانه‌های دیجیتال  |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Step 1: Customer Details, Iranian National ID & Moadian Tax Invoice

### 2.1 Customer & Physical Address Form Controls
- **Full Legal Name**: Text input, Persian characters enforced.
- **Mobile Number**: `09xxxxxxxxx` format (validated with regex `^09\d{9}$`).
- **Province & City Cascading Selector**: Standard Iranian province list (استان تهران، اصفهان، فارس، خراسان رضوی، ...) populating dependent cities.
- **Detailed Postal Address**: Street, building number, unit, floor.
- **Iranian Postal Code (کد پستی)**: Exact 10-digit numeric validation without hyphens (`^\d{10}$`).

### 2.2 Iranian National ID (کد ملی) Modulo-11 Validation Algorithm
Iranian National IDs are composed of exactly 10 digits. The 10th digit is a checksum calculated using a weighted sum modulo 11. Identical repeated strings (e.g., `0000000000`, `1111111111`) are mathematically invalid.

```typescript
/**
 * Strict Modulo-11 Validator for Iranian 10-digit National ID (کد ملی)
 * Compliant with Iranian Civil Registration Organization (سازمان ثبت احوال کشور)
 */
export function validateIranianNationalId(nationalId: string): {
  isValid: boolean;
  normalizedId: string;
  errorMessageFa?: string;
} {
  // Normalize Persian/Arabic digits to Latin ASCII
  const normalized = nationalId
    .trim()
    .replace(/[۰-۹]/g, (d) => (d.charCodeAt(0) - 1776).toString())
    .replace(/[٠-٩]/g, (d) => (d.charCodeAt(0) - 1632).toString());

  // Check format: exactly 10 digits
  if (!/^\d{10}$/.test(normalized)) {
    return {
      isValid: false,
      normalizedId: normalized,
      errorMessageFa: 'کد ملی باید دقیقاً ۱۰ رقم عددی باشد.'
    };
  }

  // Reject blacklisted identical repeated digits (e.g. 0000000000, 1111111111)
  const allSameDigits = [
    '0000000000', '1111111111', '2222222222', '3333333333', '4444444444',
    '5555555555', '6666666666', '7777777777', '8888888888', '9999999999'
  ];
  if (allSameDigits.includes(normalized)) {
    return {
      isValid: false,
      normalizedId: normalized,
      errorMessageFa: 'کد ملی وارد شده نامعتبر است.'
    };
  }

  // Calculate Modulo-11 Checksum
  const checkDigit = parseInt(normalized.charAt(9), 10);
  let weightedSum = 0;

  for (let i = 0; i < 9; i++) {
    const digit = parseInt(normalized.charAt(i), 10);
    const weight = 10 - i;
    weightedSum += digit * weight;
  }

  const remainder = weightedSum % 11;
  const computedChecksum = remainder < 2 ? remainder : 11 - remainder;

  if (computedChecksum !== checkDigit) {
    return {
      isValid: false,
      normalizedId: normalized,
      errorMessageFa: 'رقم کنترلی کد ملی نادرست است. لطفاً دقت فرمایید.'
    };
  }

  return {
    isValid: true,
    normalizedId: normalized
  };
}
```

### 2.3 Official Moadian Tax Invoice Integration (سامانه مودیان / ماده ۱۶۹ مکرر)
Designed for registered dermatological clinics, medical device leasing entities, and VAT-registered commercial practices:
- **Checkbox Toggle**: «درخواست صدور صورتحساب الکترونیکی رسمی (ماده ۱۶۹ مکرر ق.م.م و سامانه مودیان)»
- **Conditional Form Panel**: Expands with smooth height transition containing:
  - **Company / Clinic Legal Title**: e.g. «کلینیک پوست و لیزر رازی - شرکت درمان‌گستر پارس»
  - **National Legal ID (شناسه ملی ۱۱ رقمی اشخاص حقوقی)**: Validated via 11-digit regex and legal entity checksum.
  - **New Economic Code (کد اقتصادی جدید ۱۲ رقمی سازمان امور مالیاتی)**.
  - **Registration Number (شماره ثبت شرکت)**.
  - **Corporate Phone & Official Registered Address**.
  - **Medical Council Registration Number (شماره نظام پزشکی)**: Optional field unlocking B2B clinical VAT exemptions or verified practitioner pricing.

---

## 3. Step 2: Cold-Chain & Shipping Logistics

### 3.1 Delivery Methods Matrix
Formulations such as CarboxyGel™ Pro, Healene™, and peptide suspensions demand cold-chain stability. Three verified methods are presented:

```
+--------------------------------------------------------------------------------------------------+
| شیوه ارسال اول: پیک اختصاصی یخچال‌دار زنجیره سرد (Cold-Chain Reefer Courier) - ویژه تهران و کرج |
| [ 2°C - 8°C Monitored ] [ مجهز به محفظه ایزوترمال و دیتالاگر دیجیتال USB ]                      |
| تحویل: همان روز یا روز کاری بعد در بازه زمانی انتخابی (۹ الی ۱۳ یا ۱۴ الی ۱۸)                     |
| هزینه: ۹۵,۰۰۰ تومان (برای سفارش‌های بالای ۱.۵ میلیون تومان رایگان)                                 |
+--------------------------------------------------------------------------------------------------+
| شیوه ارسال دوم: پست پیشتاز سفارشی با بسته‌بندی عایق آلومینیومی (Pishtaz Insulated Box)          |
| تحویل: ۲ الی ۳ روز کاری در سراسر کشور                                                            |
| بسته‌بندی: جعبه فوم عایق، کیسه ژل خنک‌کننده درای-آیس و پوشش حبابدار نفوذناپذیر                   |
| هزینه: ۶۵,۰۰۰ تومان                                                                              |
+--------------------------------------------------------------------------------------------------+
| شیوه ارسال سوم: تیپاکس اکسپرس بین‌شهری (Tipax Express Cold-Priority)                             |
| تحویل: ۲۴ الی ۴۸ ساعته تا درب کلینیک در مراکز استان‌ها                                           |
| بسته‌بندی: عایق حرارتی تقویت‌شده با برچسب اخطار «فرآورده حساس به دما»                            |
| هزینه: ۱۲۰,۰۰۰ تومان                                                                             |
+--------------------------------------------------------------------------------------------------+
```

### 3.2 Cold-Chain Notice Banner (`<ColdChainNoticeCard />`)
If any item in the order has `requiresColdChain: true`:
- The Cold-Chain Reefer or Insulated packaging mode is mandatory.
- A prominent cyan-bordered card renders:
  > **تضمین سلامت حرارتی فرآورده‌های بیولوژیک**:  
  > این محموله حاوی فرآورده‌های حساس به حرارت (۲ الی ۸ درجه سانتی‌گراد) است. بسته‌بندی دارای دیتالاگر رنگی تغییر فاز می‌باشد. در صورت تغییر رنگ شناساگر یا هرگونه افزایش دما هنگام تحویل، مرسوله بدون قید و شرط تعویض خواهد شد.

---

## 4. Step 3: Payment Gateways & Idempotency Engine

### 4.1 Payment Method Options
1. **Shaparak Online Payment Gateway (درگاه پرداخت شاپرک)**:
   - Providers: PSP Saman Kish (سپ), Sadad Melli (سداد), or Mellat Behpardakht (به‌پرداخت).
   - Instant automated settlement with zero-float ledger tracking.
   - Redirects to Shaparak payment gateway with signed token.
2. **Card-to-Card Transfer with Receipt Verification (کارت‌به‌کارت بانکی با آپلود فیش)**:
   - Primary fallback for large B2B clinic wholesale payments exceeding standard daily debit card limits (۱۰۰ میلیون تومان سقف روزانه کارت بانکی).
   - Displays designated laboratory corporate account details:
     - Bank: بانک سامان (شعبه میرداماد)
     - Shaba (IBAN): `IR92 0560 0820 0000 xxxx xxxx xx`
     - Account Holder: شرکت درماتولوژی درمر بریتانیا (سهامی خاص)
   - Interactive file upload drag-and-drop zone for transaction receipt (PNG/JPG/PDF max 5MB).
   - Requires input of Tracking Reference (شماره پیگیری / شماره ارجاع) and 4-digit source card number.
3. **Clinical Credit Wallet (کیف پول اعتباری درماتولوژی)**:
   - Available to verified B2B clinics and VIP aesthetic centers with pre-approved credit terms.
   - Shows live wallet balance: e.g. `موجودی اعتباری: ۱۲,۵۰۰,۰۰۰ تومان`.
   - 1-click debit without external gateway redirection.

### 4.2 Idempotency Key Engine (`x-idempotency-key`)
To eliminate duplicate order creation and redundant bank gateway fee charges during network dropouts or impatient double-clicks, every submission is bound to a cryptographic idempotency key:

```typescript
import { v4 as uuidv4 } from 'uuid';

export interface OrderSubmissionPayload {
  idempotencyKey: string; // Transmitted in HTTP Header: "x-idempotency-key"
  cartId: string;
  customerDetails: {
    fullName: string;
    mobileNumber: string;
    nationalId: string;
    postalCode: string;
    address: string;
    provinceId: string;
    cityId: string;
    isMoadianInvoiceRequested: boolean;
    moadianData?: {
      companyName: string;
      economicCode: string;
      nationalLegalId: string;
      medicalLicenseNumber?: string;
    };
  };
  deliveryMethodId: 'cold_chain_courier' | 'post_pishtaz' | 'tipax_express';
  paymentMethod: 'shaparak_gateway' | 'card_to_card' | 'clinical_wallet';
  cardToCardReceipt?: {
    fileUrl: string;
    trackingReference: string;
    sourceCardLast4: string;
  };
  financialSummary: {
    subtotalTomans: number;
    vatTomans: number;
    shippingFeeTomans: number;
    netPayableTomans: number;
  };
}

/**
 * Generates or recovers a persistent client-side idempotency key for this checkout attempt
 */
export function getOrCreateCheckoutIdempotencyKey(cartId: string): string {
  const STORAGE_KEY = `checkout_idempotency_${cartId}`;
  let key = sessionStorage.getItem(STORAGE_KEY);
  if (!key) {
    key = `dermer_idem_${uuidv4()}_${Date.now()}`;
    sessionStorage.setItem(STORAGE_KEY, key);
  }
  return key;
}

/**
 * Client submission handler enforcing idempotency
 */
export async function submitOrder(payload: OrderSubmissionPayload) {
  const response = await fetch('/api/orders/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-idempotency-key': payload.idempotencyKey
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'خطا در ثبت نهایی سفارش');
  }

  const result = await response.json();
  // Clear idempotency key on definitive settlement or gateway redirect
  sessionStorage.removeItem(`checkout_idempotency_${payload.cartId}`);
  return result; // Returns { orderId, redirectGatewayUrl, paymentIntentId }
}
```

---

## 5. Stepper Navigation & Form State Machine

```
      +─────────────────────────────────────────────────────────+
      │ Step 1: Customer Details & National ID / Moadian Tax    │
      +───────────────────────────┬─────────────────────────────+
                                  │
                                  ▼ (Validates National ID, Postal Code, Mobile)
      +─────────────────────────────────────────────────────────+
      │ Step 2: Cold-Chain Logistics & Delivery Address Confirm │
      +───────────────────────────┬─────────────────────────────+
                                  │
                                  ▼ (Selects Courier & Delivery Window)
      +─────────────────────────────────────────────────────────+
      │ Step 3: Payment Method Selection & Idempotent Submission│
      +───────────────────────────┬─────────────────────────────+
                                  │
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
   [Shaparak Gateway]     [Card-to-Card Receipt]   [Clinical Wallet]
          │                       │                       │
          ▼                       ▼                       ▼
 Redirect to PSP Token      Upload & Admin Audit    Instant Ledger Debit
          │                       │                       │
          └───────────────────────┴───────────────────────┘
                                  │
                                  ▼
      +─────────────────────────────────────────────────────────+
      │ Order Success Dossier (`/order/[id]`)                   │
      +─────────────────────────────────────────────────────────+
```

---

## 6. Error Handling & Form Field Validation States

| Field | Validation Rule | Invalid State Feedback (FA) |
| :--- | :--- | :--- |
| **National ID (کد ملی)** | 10 digits, Modulo-11 Checksum | «کد ملی وارد شده با الگوریتم سازمان ثبت احوال مطابقت ندارد.» |
| **Mobile Number** | Pattern `^09\d{9}$` | «شماره همراه معتبر ۱۱ رقمی با پیش‌شماره ۰۹ وارد نمایید.» |
| **Postal Code (کد پستی)** | Pattern `^\d{10}$` | «کد پستی ده رقمی بدون خط تیره الزامی است.» |
| **Economic Code (کد اقتصادی)** | 12 alphanumeric characters | «کد اقتصادی ۱۲ رقمی سامانه امور مالیاتی نامعتبر است.» |
| **Receipt Upload** | Max 5MB, format JPG/PNG/PDF | «تصویر فیش واریزی باید کمتر از ۵ مگابایت و دارای فرمت تصویر باشد.» |
| **Idempotency Conflict (409)** | Same request in-flight | «سفارش شما در حال پردازش در شبکه بانکی است. لطفاً پنجره را نبندید.» |

---

## 7. Responsive & RTL Accessibility Specifications
- **Keyboard Navigation**: Stepper steps are labeled with `role="tablist"` and `aria-selected` attributes. Users can press `Enter` to advance when valid.
- **Form Auto-Focus**: Transitioning to the next step programmatically shifts focus to the first interactive field of that step.
- **RTL Number Alignment**: Numerical inputs (National ID, Postal Code, Phone) use `dir="ltr"` and `text-right` with font `IRANSansXFaNum` to preserve Persian numerical aesthetics while preventing character jumping.
- **Zero-Layout Shift**: Skeleton loaders reserve exact heights for conditional Moadian tax invoice fields and receipt upload containers.
