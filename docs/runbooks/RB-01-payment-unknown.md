# RB-01 — پرداخت Pending/Unknown (سفارش پرداخت‌شده اما سفارش در انتظار پرداخت)

| فیلد | مقدار |
|---|---|
| شناسه | RB-01 |
| شدت | بالا (High) — دارایی مشتری و تعهد ارسال در تعلیق است |
| دامنه | `payment_intents` · `orders` · `order_status_history` · `outbox_events` · دفترکل (`ledger_journals` / `ledger_entries`) |
| سرویس‌ها | `api` · `worker` · درگاه زرین‌پال |
| SLO حل | حداکثر ۳۰ دقیقه از لحظه شناسایی |

## ۱. علائم (Symptoms)

- رکورد `payment_intents` در وضعیت `UNKNOWN` یا `EXPIRED` است، در حالی که `Status` برگشتی از درگاه (یا رسید بانکی مشتری) موفق بوده است.
- مشتری از حسابش بسته شده و اسکرین‌شات واریز دارد، اما وضعیت سفارش او همچنان `PENDING_PAYMENT` است (در پنل ادمین یا `GET /v1/orders/:id`).
- بلوک «پرداخت‌های نامعلوم/ناموفق» (`payment_unknown`) در مرکز استثنایها `GET /v1/ops/exceptions` شمارش غیرصفر دارد.
- کاربر هنگام بازگشت از درگاه صفحه خطا دیده یا مرورگرش قبل از رسیدن به callback بسته شده است؛ هیچ رویداد `ORDER_PAID` در `outbox_events` برای آن سفارش ثبت نشده و پیامک «پرداخت تأیید شد» ارسال نشده است.
- مشتری تماس/تیکت ثبت کرده: «پول کم شد ولی سفارشم پرداخت‌نشده است».

## ۲. تشخیص (Diagnosis)

> **اصل حاکم:** تنها منبع حقیقت، پاسخ متد verify سمت سرور درگاه است. پارامترهای callback مرورگر (کوئری `Status=OK`) هرگز به‌تنهایی مبنای capture نیستند، چون URL بازگشت را مشتری می‌سازد و قابل جعل است.

### ۲.۱ فهرست Intentهای نامعلوم

```sql
SELECT pi.id, pi.order_id, pi.method, pi.status, pi.amount, pi.currency,
       pi.gateway_tracking_id, pi.ref_id, pi.error_message, pi.created_at,
       o.order_number, o.status AS order_status, o.customer_phone
FROM payment_intents pi
JOIN orders o ON o.id = pi.order_id
WHERE pi.status IN ('UNKNOWN', 'EXPIRED')
ORDER BY pi.created_at ASC;
```

نکته: `gateway_tracking_id` برای درگاه زرین‌پال همان `Authority` تراکنش است که هنگام initiate ذخیره شده؛ کلید استعلام دستی شما همین فیلد است.

### ۲.۲ استعلام از درگاه زرین‌پال (verify)

با `Authority` ذخیره‌شده و مبلغ `amount` (به ریال) متد verify درگاه را صدا بزنید (همان مسیری که `ZarinpalGateway.verifyCallback` در `packages/gateways/src/zarinpal.ts` طی می‌کند):

```bash
# سندباکس
curl -s -X POST https://sandbox.zarinpal.com/pg/v4/payment/verify.json \
  -H "Content-Type: application/json" \
  -d '{"merchant_id":"<ZARINPAL_MERCHANT_ID>","amount":<AMOUNT_RIALS>,"authority":"<gateway_tracking_id>"}'

# پروداکشن: همان بدنه با هاست https://www.zarinpal.com
```

تفسیر پاسخ:

| `data.code` | معنا | تصمیم |
|---|---|---|
| `100` یا `101` | تأیید شده (۱۰۱ = قبلاً verify شده — `refId` را از همان پاسخ بردارید) | Capture دستی (بخش ۳) |
| هر کد دیگر / خطا | پرداخت انجام نشده یا Authority نامعتبر | Release رزرو و بستن سفارش (بخش ۴) |

همچنین حساب شتابی/کارت‌به‌کارت: اگر `method = CARD_TO_CARD` است، مسیر صحیح capture، ثبت فیش از طریق `POST /v1/payments/:intentId/receipt` و تأیید با `POST /v1/payments/receipts/:receiptId/approve` است — نه ویرایش دستی دیتابیس؛ سرویس approve خودش وضعیت intent، سفارش، تاریخ وضعیت و سند دفترکل را اتمیک ثبت می‌کند.

### ۲.۳ تکلیف سفارش و رزرو را ببینید

```sql
-- وضعیت سفارش و رزرو فعال مرتبط
SELECT o.id, o.status, r.id AS reservation_id, r.status AS reservation_status, r.expires_at
FROM orders o
LEFT JOIN inventory_reservations r ON r.id = (SELECT id FROM inventory_reservations
    WHERE status = 'ACTIVE' ORDER BY created_at DESC LIMIT 1)
WHERE o.id = '<ORDER_ID>';
```

توجه: اگر intent به‌طور طبیعی `EXPIRED` شده و رزرو آن توسط worker آزاد شده باشد، موجودی کالا آزاد شده است؛ capture دیرهنگام نیازمند اطمینان از قابل‌ارائه بودن کالاست (بار اول سفارش‌های خیلی قدیمی را با مشتری هم‌راستا کنید).

## ۳. اقدام (Action) — Capture دستی در صورت تأیید درگاه

پیش‌نیازها: خروجی verify درگاه با `code=100/101`، مبلغ برابر با `amount` intent، ثبت ملاحظات در تیکت عملیات.

### گام ۱ — Capture intent و تسویه سفارش در یک تراکنش

برای `UNKNOWN` گذار طبق ماشین حالت پرداخت مجاز است (`UNKNOWN → CAPTURED`). برای `EXPIRED` گذار در ماشین حالت تعریف نشده است؛ فقط پس از مستندسازی دلیل (تأیید کتبی درگاه + رسید) همان تراکنش SQL را اجرا کنید و تغییر را در `audit_logs` ثبت کنید.

```sql
BEGIN;

-- 1) وضعیت تراکنش پرداخت
UPDATE payment_intents
SET status = 'CAPTURED',
    ref_id = '<REF_ID_از_پاسخ_درگاه>',
    error_message = NULL,
    updated_at = NOW()
WHERE id = '<INTENT_ID>' AND status IN ('UNKNOWN','EXPIRED');

-- 2) سفارش به PAID
UPDATE orders
SET status = 'PAID', updated_at = NOW()
WHERE id = '<ORDER_ID>' AND status = 'PENDING_PAYMENT';

-- 3) تاریخچه وضعیت (الزام آدابور: هر گذار ثبت شود)
INSERT INTO order_status_history (order_id, from_status, to_status, actor, reason)
VALUES ('<ORDER_ID>', 'PENDING_PAYMENT', 'PAID', 'OPS_MANUAL_CAPTURE',
        'Capture دستی پس از تأیید verify زرین‌پال؛ Authority=<gateway_tracking_id>، refId=<REF_ID>، تیکت=<TICKET_ID>');

-- 4) رویداد خروجی برای پیامک و fulfillment
INSERT INTO outbox_events (tenant_id, event_type, payload_json)
VALUES ('<TENANT_ID>', 'ORDER_PAID', jsonb_build_object(
  'orderId', '<ORDER_ID>',
  'orderNumber', '<ORDER_NUMBER>',
  'totalAmount', '<AMOUNT_RIALS>',
  'phone', '<CUSTOMER_PHONE>'));

COMMIT;
```

اگر گذار سفارش را ترجیح می‌دهید از API بدهید، معادل آن `POST /v1/orders/:id/transition` با بدنه `{"toStatus":"PAID","actor":"OPS_MANUAL_CAPTURE","reason":"..."}` است (مجاز از `PENDING_PAYMENT`).

### گام ۲ — ثبت سند دفترکل (دوبل‌اندر متوازن)

سند فروش را با همان قواعد `LedgerService.postSaleJournal` و طرح حساب `packages/finance/src/chart-of-accounts.ts` ثبت کنید؛ تساوی `SUM(DEBIT) = SUM(CREDIT)` در سطح تراکنش الزامی است:

| جهت | حساب | مبلغ |
|---|---|---|
| بدهکار (DEBIT) | `1010` موجودی نزد درگاه‌های پرداخت شتاب (یا `1020` برای کارت‌به‌کارت) | جمع نهایی فاکتور |
| بدهکار (DEBIT) | `4030` تخفیفات فروش | جمع تخفیف (در صورت وجود) |
| بستانکار (CREDIT) | `4010` درآمد فروش کالا | جمع خطوط |
| بستانکار (CREDIT) | `4020` درآمد ارسال | هزینه ارسال |
| بستانکار (CREDIT) | `2030` مالیات بر ارزش افزوده پرداختنی | ۱۰٪ (بر مبنای ریال، بدون ممیز شناور) |

### گام ۳ — بستن حلقه

1. تراکنش آیدمپوتنسی ناقص را ببندید: در `idempotency_records` (scope `ORDER_PLACE`) رکورد `STARTED` همان سفارش را بررسی و در صورت نیاز `COMPLETED` کنید تا تلاش مجدد مشتری پاسخ تکراری بگیرد.
2. `GET /v1/orders/<ORDER_ID>` را صدا بزنید و `status=PAID`، تاریخچه و وجود intent با `CAPTURED` را تأیید کنید.
3. دو تا سه دقیقه صبر کنید تا worker رویداد `ORDER_PAID` را از Outbox پردازش کند؛ سپس `GET /v1/notifications?limit=10` را ببینید که پیامک/ایمیل `SENT` شده باشد.
4. `GET /v1/ledger/trial-balance` را با هدر `x-tenant-id` صدا بزنید و متوازن بودن تراز را پس از سند دستی بررسی کنید.

## ۴. بازگشت (Rollback) — عدم تأیید درگاه

اگر verify پاسخ موفق نداد (پرداخت واقعاً انجام نشده)، نباید capture کنید؛ چرخه را طبیعی ببندید:

```sql
BEGIN;

-- 1) intent نهایی شود (UNKNOWN → FAILED مجاز در ماشین حالت)
UPDATE payment_intents
SET status = 'FAILED',
    error_message = 'Reconcile RB-01: درگاه پرداخت را تأیید نکرد؛ Authority=<gateway_tracking_id>',
    updated_at = NOW()
WHERE id = '<INTENT_ID>' AND status = 'UNKNOWN';

-- 2) بستن سفارش (PENDING_PAYMENT → CANCELLED مجاز در ماشین حالت سفارش)
UPDATE orders SET status = 'CANCELLED', updated_at = NOW()
WHERE id = '<ORDER_ID>' AND status = 'PENDING_PAYMENT';

INSERT INTO order_status_history (order_id, from_status, to_status, actor, reason)
VALUES ('<ORDER_ID>', 'PENDING_PAYMENT', 'CANCELLED', 'OPS_RECONCILE',
        'عدم تأیید پرداخت در استعلام RB-01؛ آزادسازی رزرو انبار');

COMMIT;
```

- **رزرو:** نیازی به آزادسازی دستی نیست اگر `expires_at` گذشته باشد — worker با `sweepExpiredReservations` آن را به `EXPIRED` می‌برد و `reservedQty` را از `inventory_levels` برمی‌گرداند. اگر رزرو هنوز `ACTIVE` است و منقضی نشده، تا انقضای TTL (۱۵ دقیقه) صبر کنید؛ برای رزروهای بسیار قدیمی از ران‌بوک RB-03 استفاده کنید.
- **آگاه‌سازی مشتری:** پیام صریح بدهید که پرداخت در بانک ثبت نشده و مبلغی از حساب او کسر نشده؛ اگر برداشت بانکی دیده می‌کند، رسیدش را برای پیگیری معکوس (reversal بانکی) بگیرید.
- intent در وضعیت `EXPIRED` که نتوانید ببندید، رها کنید و در تیکت ثبت کنید — `EXPIRED` وضعیت پایانی است و worker دیگر با آن کاری ندارد.

## ۵. پیگیری و پیشگیری

- پس از هر incident، علت ریشه‌ای را در `audit_logs` و تیکت ثبت کنید: قطعی شبکه بین API و درگاه، بسته شدن مرورگر قبل از callback، تایم‌اوت verify، یا رفت‌وبرگشت کاربر.
- worker باید طبق سند معماری، پردازشگر reconciliation وضعیت‌های نامعلوم را دوره‌ای اجرا کند (`payment-reconcile.ts`)؛ اگر نرخ `UNKNOWN` بالا رفت، لاگ `docker compose -f docker-compose.prod.yml logs worker` را بررسی کنید.
- هرگز `Status=OK` در URL بازگشت مرورگر را معادل موفقیت پرداخت فرض نکنید؛ همه captureها باید از verify سمت سرور عبور کنند.
