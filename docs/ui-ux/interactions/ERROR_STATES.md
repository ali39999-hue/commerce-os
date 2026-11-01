# ERROR_STATES.md — Resilient Error Boundaries & Failure Recovery
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: Fault-Tolerant Error States, Network Fallbacks & Financial Rollback UI

> **Core Standard**: In an enterprise clinical and commerce platform, errors are not mere dead-ends; they are structured, stateful recovery pathways designed to prevent data loss, alleviate clinical anxiety, and maintain financial atomicity.
> **Anti-Slop Invariant**: No generic unhelpful messages like "Something went wrong" or unstyled browser stack traces. Every error presents clear clinical/operational context in Persian, distinct error codes, and a 1-click recovery action.

---

## 1. Error Taxonomy & Severity Matrix

| Error Class | Code Range | Trigger Scenario | Visual Presentation | User Action & Recovery |
| :--- | :--- | :--- | :--- | :--- |
| **Not Found (404)** | `ERR_ROUTE_404` | Non-existent route, expired product URL, discontinued formula | Full-page clinical glass panel with search bar, catalog category links | Search input with pre-filled suggestion, "بازگشت به کاتالوگ محصولات" CTA |
| **API Fallback (500/503)** | `ERR_API_UNAVAILABLE` | Backend microservice downtime, database connection pool exhausted | Embedded card boundary preserving surrounding layout; retry countdown | "تلاش مجدد خودکار (۵ ثانیه)" + Manual "بارگذاری مجدد اطلاعات" |
| **Offline / Network Drop** | `ERR_NETWORK_DISCONNECTED`| Client device loses Wi-Fi / cellular data during interaction | Non-blocking sticky banner at top of viewport with amber alert icon | "اتصال شما به شبکه قطع شده است. در حال تلاش برای اتصال مجدد..." |
| **Tax Invoice Failure** | `ERR_TAX_MOADIAN_REJECT` | Moadian national tax portal timeout or Sepidar ERP VAT rejection | Formal B2B modal dialog detailing exact tax code mismatch | "ویرایش اطلاعات حقوقی" + "دانلود پیش‌فاکتور غیررسمی موقت" |
| **Payment / Rollback** | `ERR_PAYMENT_REVERTED` | Shaparak card timeout, double-entry ledger imbalance, insufficient funds | High-contrast security alert with transaction tracing ID | "تراکنش لغو و مبلغ مسدود شده بازگردانده شد. پرداخت با کارت به کارت یا درگاه دیگر" |

---

## 2. Page & Component Error Boundaries

### 2.1 404 Route Not Found (`/not-found.tsx`)
- **Visual Design**:
  - Deep obsidian canvas (`#070b12`) with subtle cyan medical wireframe in the background.
  - Large tabular numeral `۴۰۴` with glowing frosted treatment.
  - Title: "صفحه یا فرمولاسیون درخواستی یافت نشد".
  - Subtitle: "ممکن است آدرس تغییر کرده باشد یا این محصول بالینی در حال بازنگری در فارماکوپه باشد."
  - Action Block:
    - Interactive Search Field with auto-suggestions for ReeSkin, CarboxyGel, PlasmaX.
    - Quick Action Buttons: "مشاهده محصولات مراقبت خانگی", "سامانه سخت‌افزاری B2B", "صفحه اصلی".

### 2.2 Offline Notice & Sync Queue
When `window.navigator.onLine === false`:
- A floating glass banner slides down from the top edge:
  - Background: `rgba(245, 158, 11, 0.15)` with `border-bottom: 1px solid #f59e0b`.
  - Icon: Pulsing amber Wi-Fi disconnected icon.
  - Text: "ارتباط با سرور قطع شده است. تغییرات شما در حافظه محلی ذخیره می‌شود."
  - Any mutating actions (e.g. Add to Cart) are buffered into `IndexedDB` Outbox.
  - Upon reconnection (`window.addEventListener('online')`):
    - Banner turns emerald green (`#10b981`): "اتصال برقرار شد. در حال همگام‌سازی..."
    - Buffered actions flush automatically; banner dismisses after 3 seconds.

### 2.3 API Service Unavailable (Component Level)
Wrap dynamic sections (e.g., Live Inventory, Clinical Reviews, B2B Tier Pricing) in Next.js `ErrorBoundary`:
- Surrounding layout (Header, Breadcrumbs, Product Specs) remains fully functional.
- The failing container displays a frosted card:
  - Icon: Shield with diagnostic pulse.
  - Message: "دریافت اطلاعات لحظه‌ای این بخش با اختلال مواجه شده است."
  - Action: Debounced `retry()` button with exponential backoff (1s, 2s, 4s, 8s).

---

## 3. Financial & Regulatory Failure Pathways

### 3.1 Payment Gateway Failure & Rollback UI (`/pay/failed/[intentId]`)
When Shaparak or the bank issuer declines a transaction:
1. **Financial Safeguard State**:
   - Double-entry ledger registers status `PAYMENT_ABORTED`.
   - Inventory reservation outbox worker releases the 15-minute product lock.
2. **User Interface Response**:
   - Header: High-contrast red/rose shield icon (`#f43f5e`).
   - Headline: "پرداخت ناموفق بود یا توسط کاربر لغو گردید."
   - Detailed Receipt Table:
     - شماره پیگیری شاپرک (Shaparak Tracking ID): `۷۴۸۳۹۲۱۰۴` (or "ثبت نشده")
     - شناسه یکتای سفارش (Order UUID): `ord_89f3a12...`
     - مبلغ قابل پرداخت: `۳۴,۵۰۰,۰۰۰ ریال`
     - وضعیت حساب بانکی: "چنانچه وجه از حساب شما کسر شده است، ظرف حداکثر ۷۲ ساعت توسط بانک مرکزی عودت داده خواهد شد."
   - Recovery Options:
     - Button 1: "تلاش مجدد با درگاه بانکی سامان / ملت"
     - Button 2: "پرداخت کارت به کارت با ثبت فیش و شناسه پیگیری"
     - Button 3: "بازگشت به سبد خرید"

### 3.2 B2B Tax Invoice & Moadian Portal Rejection (`/b2b/quote/error`)
When generating an official tax invoice with National Economic Code (`کد اقتصادی`):
1. **Rejection Analysis**:
   - Error code `MOADIAN_ERR_04`: "کد اقتصادی خریدار با شناسه ملی همخوانی ندارد."
   - Error code `MOADIAN_ERR_11`: "شناسه یکتای حافظه مالیاتی فروشنده پاسخگو نیست."
2. **UI Resolution**:
   - A step-by-step resolution card displays the exact fields rejected by the Iranian Tax Administration (سازمان امور مالیاتی).
   - "ویرایش مشخصات حقوقی شرکت": Opens modal with highlighted input fields.
   - "تولید پیش‌فاکتور غیررسمی موقت": Allows purchasing to proceed via internal ledger while tax sync runs asynchronously.

---

## 4. Cold-Chain & Biological Delivery Warning States

For temperature-sensitive formulations (e.g. CarboxyGel Lyophilized Peptides, Live Enzymes):
- If the customer's selected destination postal code exceeds standard cold-chain logistics SLA (> 48 hours transit time):
  - **Inline Warning**: Amber alert card with snowflake icon.
  - **Message**: "این محصول نیازمند حمل زنجیره سرد (یخ‌پوش و دمای ۲ تا ۸ درجه سانتی‌گراد) است. ارسال به این شهرستان ممکن است نیازمند هماهنگی ویژه باربری هوایی باشد."
  - **Action**: Checkbox acknowledgment: "مسئولیت شرایط نگهداری و هماهنگی تحویل حضوری را می‌پذیرم."

---

## 5. Accessibility & Error Announcement Rules

1. **Focus Management**: On transition to any error state, focus is immediately routed to the main error heading (`H1` or `H2`) with `tabIndex={-1}` to ensure immediate screen reader recognition.
2. **Alert Roles**: All critical alerts must specify `role="alert"` and `aria-live="assertive"`. Non-blocking network warnings use `role="status"` and `aria-live="polite"`.
3. **Persian Pronunciation & Numbers**: All numeric tracking codes and phone numbers are rendered with `dir="ltr"` and `font-variant-numeric: tabular-nums` to avoid reversed numeral order in Persian screen readers.
