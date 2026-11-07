# مرجع قراردادهای API — Commerce OS

مرجع رسمی قراردادهای HTTP سرویس API (NestJS). این سند با کد منبع (`apps/api/src/**`) هم‌خوان است؛ هر تغییر مسیر یا بدنه باید پیش از merge همین‌جا به‌روز شود.

---

## ۱. اصول عمومی

### ۱.۱ Base URL

```
http://localhost:4000/v1
```

در پروداکشن، آدرس عمومی API با `NEXT_PUBLIC_API_URL` / reverse proxy تعیین می‌شود (مثلاً `https://api.your-domain.ir/v1`). همه مسیرهای این سند نسبت به این پیشوند هستند.

### ۱.۲ هدرهای عمومی

| هدر | الزام | شرح |
|---|---|---|
| `Content-Type: application/json` | همه درخواست‌های دارای بدنه | بدنه‌ها JSON با کدگذاری UTF-8 (فیلدهای فارسی آزادند). |
| `x-idempotency-key` | **الزامی** روی دستورات مالی (مهم‌تر از همه `POST /checkout/place-order`) | کلید یکتای هر عملیات از سمت کلاینت (UUID پیشنهاد می‌شود). ارسال تکراری با همان کلید و همان پی‌لود، **عیناً پاسخ اول** را برمی‌گرداند؛ همان کلید با پی‌لود متفاوت خطای `409 Conflict` می‌دهد. کلید در جدول `idempotency_records` با ترکیب `[tenantId, scope, key]` نگه داشته می‌شود. |
| `x-tenant-id` | **الزامی** روی endpointهای مالی/ادمین (کیف پول، دفترکل، وب‌هک dispatch، رویداد تحلیلی) | شناسه مستأجر برای ایزولاسیون داده‌ها. غیبت آن روی این مسیرها خطای `401 Unauthorized` با پیام «شناسه مستأجر (x-tenant-id) الزامی است» می‌دهد. |
| `x-correlation-id` | اختیاری | شناسه پیگیری سمت کلاینت (UUID). سرور آن را در پاسخ و در بدنه خطا بازتاب می‌دهد؛ اگر ارسال نشود، سرور خودش UUID تولید می‌کند. |
| `Authorization: Bearer <token>` | مسیرهای احراز هویت‌شده (مثل `GET /auth/me`) | توکن نشست حاصل از `POST /auth/otp/verify`. |
| `x-admin-api-key` | مسیرهای مدیریتی پشت **AdminGuard** (AUTH-003): تنظیمات ویترین (PUT/DELETE)، نویسندگی محصول ERP (POST/PATCH/bulk)، تأیید فیش، کوپن و تنظیم باشگاه مشتریان | کلید سرور-به-سرور برابر `ADMIN_API_KEY` (مقایسه ثابت‌زمان). جایگزین مجازِ Bearer برای نشست نقش ادمین (`SUPER_ADMIN`/`OPERATOR`/`ACCOUNTANT`)؛ نبود هر دو روی این مسیرها: `401`. |

### ۱.۳ قالب خطای استاندارد

همه خطاها (اعم از 4xx و 5xx) با فیلتر سراسری در این قالب برگردانده می‌شوند:

```json
{
  "statusCode": 404,
  "message": "تراکنش پرداخت یافت نشد",
  "error": "Not Found",
  "code": "HTTP_404",
  "correlationId": "b1a2c3d4-...",
  "timestamp": "2026-10-31T09:15:42.183Z"
}
```

- `message` فارسی و مناسب نمایش است؛ برای خطاهای اعتبارسنجی چندگانه، پیام‌ها با `·` به هم می‌پیوندند.
- `code` برای خطاهای HTTP عمومی `HTTP_<status>` است و برای خطای داخلی نامشخص `INTERNAL_ERROR`.
- خطای 500 هیچ اطلاعاتی از استک/دلیل واقعی نشت نمی‌دهد؛ فقط `correlationId` می‌دهد که در لاگ سرور با همان شناسه قابل ردیابی است.
- هدر پاسخ `x-correlation-id` همیشه شناسه پیگیری همان درخواست را بازمی‌گرداند.

### ۱.۴ محدودیت نرخ (Rate Limit)

محدودسازی پنجره ثابت ۶۰ ثانیه‌ای به‌ازای هر IP، با دو scope:

| Scope | سقف (پیش‌فرض) | متغیر محیطی | دامنه |
|---|---|---|---|
| عمومی | **۳۰۰ درخواست در دقیقه** | `RATE_LIMIT_GLOBAL_PER_MIN` | همه مسیرهای `/v1` |
| احراز هویت | **۱۰ درخواست در دقیقه** | `RATE_LIMIT_AUTH_PER_MIN` | مسیرهای `/v1/auth` (محافظت از OTP در برابر brute-force) |

- عبور از سقف → پاسخ `429` با بدنه استاندارد خطا (شامل `retryAfterSeconds`) و هدر **`Retry-After`** (ثانیه تا پایان پنجره).
- شمارنده per-process است و با ری‌استارت صفر می‌شود؛ در مقیاس افقی باید با فروشگاه Redis (همان قرارداد `check(ip, scope)`) جایگزین شود.
- سرویس‌گیرنده بهتر است هدرهای `Retry-After` را محترم بشمارد و تلاش مجدد را با backoff انجام دهد.

### ۱.۵ قواعد پول

همه مبالغ به **ریال** و به‌صورت رشته/عدد صحیح (بدون اعشار) جابه‌جا می‌شوند (`Decimal(20,0)` در دیتابیس، `BigInt` در سرویس). هیچ محاسبه پولی با float انجام نمی‌شود؛ فاکتور رسمی شامل مالیات ارزش افزوده ۱۰٪ است.

---

## ۲. قرارداد ماژول‌ها

در همه جدول‌ها ستون‌ها: **متد · مسیر · هدر الزامی · بدنه درخواست · پاسخ موفق**.

### ۲.۱ Health — سلامت و آمادگی

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/health` | — | — | `200` → `{"status":"ok","service":"commerce-os-api"}` (liveness؛ بدون وابستگی) |
| GET | `/ready` | — | — | `200` → `{"status":"ready","dependencies":{"postgres":"ok"}}` — با شکست اتصال DB: `503` → `{"status":"not_ready","dependencies":{"postgres":"unavailable"}}` |

### ۲.۲ Auth — احراز هویت با OTP

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| POST | `/auth/otp/request` | — | `{"phone": "09121234567"}` | `201` → رکورد چالش OTP (کد به‌صورت hash ذخیره و از پاسخ حذف است). مشمول سقف ۱۰ درخواست/دقیقه. |
| POST | `/auth/otp/verify` | — | `{"phone": "09121234567", "code": "12345"}` | `201` → `{"token": "<sessionToken>", "user": {"id","phone","fullName","role"}}` — کاربر تازه در اولین ورود ساخته می‌شود و نشست در `user_sessions` ثبت می‌گردد. |
| GET | `/auth/me` | `Authorization: Bearer <token>` | — | `200` → `{"id","phone","fullName","role"}` — توکن نامعتبر/منقضی: `401`. |

### ۲.۳ Catalog — کاتالوگ عمومی فروشگاه

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/stores/resolve?slug=<slug>` | — | — | `200` → فروشگاه فعال مطابق slug (برای بوت‌استرپ استورفرانت). slug نامعتبر: خطای اعتبارسنجی. |
| GET | `/stores/:storeSlug/products?limit=<1..50>` | — | — | `200` → `{"data":[{...,"variants":[...]}],"meta":{"count":<n>,"limit":<n>}}` — فقط محصولات منتشرشده؛ `limit` عدد صحیح ۱ تا ۵۰ (پیش‌فرض ۲۴)، خارج از بازه: `400`. |
| GET | `/stores/:storeSlug/products/:productSlug` | — | — | `200` → `{"data":{...}}` جزئیات محصول با واریانت‌ها؛ یافت نشد: `404`. |

### ۲.۴ Search — جست‌وجوی فارسی

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/search?q=&category=&minPrice=&maxPrice=&inStock=&sort=&limit=&offset=` | — | — | `200` → `{"items":[...], ...}` — همه پارامترها اختیاری؛ `q` متن فارسی (با مترادف‌یابی، مثلاً «قهوه»)، `category` slug دسته، `minPrice`/`maxPrice` ریال، `inStock=true|1`، `sort` یکی از `newest | price_asc | price_desc`، `limit` (پیش‌فرض ۲۰) و `offset` برای صفحه‌بندی. پارامتر `storeSlug` هم پذیرفته می‌شود (پیش‌فرض `demo`). |

### ۲.۵ Checkout — چک‌اوت و ثبت سفارش

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| POST | `/checkout/session` | — | `{"storeId?" \| "storeSlug?", "items":[{"variantId","qty"}], "customerPhone", "customerName", "address":{...}, "couponCode?"}` | `201` → `{"sessionId", "quote"}` — `quote` کوت تغییرناپذیر سمت سرور (فینگر‌پرینت قیمت) شامل خطوط، تخفیف، مالیات ۱۰٪، ارسال و `total` به ریال. رزرو موجودی اتمیک با TTL ۱۵ دقیقه در همین گام ایجاد می‌شود. |
| POST | `/checkout/place-order` | **`x-idempotency-key`** | `{"sessionId", "paymentMethod": "ZARINPAL" \| "CARD_TO_CARD" \| "WALLET"}` | `201` → `{"orderId", "orderNumber", "paymentIntentId", "amount": {"amount","currency"}, "paymentMethod", "reservationId"}` — سفارش با وضعیت `PENDING_PAYMENT`، `PaymentIntent` با وضعیت `CREATED` و رکورد آیدمپوتنسی (scope `ORDER_PLACE`) اتمیک ثبت می‌شوند. غیبت هدر: `400`. همان کلید تکراری: بازگشت عین پاسخ اول. |

### ۲.۶ Payments — درگاه زرین‌پال و کارت‌به‌کارت

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| POST | `/payments/:intentId/initiate` | — | `{"callbackBaseUrl?"}` (اختیاری؛ پیش‌فرض `API_PUBLIC_URL` یا `http://localhost:4000`) | `201` → برای `ZARINPAL`: `{"redirectUrl","gatewayTrackingId","method":"ZARINPAL"}` — `gatewayTrackingId` همان `Authority` زرین‌پال است و در `payment_intents` ذخیره می‌شود؛ وضعیت intent به `PENDING_PROVIDER` می‌رود. برای `CARD_TO_CARD`: `{"merchant","amountRials","amountTomans","method":"CARD_TO_CARD"}` (اطلاعات کارت فروشنده). روش دیگر: `400`. |
| GET | `/payments/callback/zarinpal?intentId=&Status=&Authority=` | — | — | `200` → `{"success":true,"orderId","orderNumber","refId"}` — سرور با متد verify سمت خودش وضعیت را از درگاه می‌پرسد و در صورت تأیید، در یک تراکنش: intent → `CAPTURED`، سفارش → `PAID`، ثبت `order_status_history` (actor `ZARINPAL_GATEWAY`)، درج رویداد `ORDER_PAID` در Outbox و سپس ثبت سند دوبل‌اندر. عدم تأیید: `{"success":false,"errorMessage"}` و intent → `FAILED`. intent قبلاً capture: `{"alreadyCaptured":true}`. |
| POST | `/payments/:intentId/receipt` | — | `{"referenceNumber", "payerCardNumber?", "receiptImageUrl?"}` | `201` → رکورد فیش با وضعیت `PENDING_REVIEW` در `card_to_card_receipts` (برای روش کارت‌به‌کارت؛ تا تأیید ادمین سفارش پرداخت‌نشده می‌ماند). |
| POST | `/payments/receipts/:receiptId/approve` | — | `{"reviewer?"}` (پیش‌فرض `admin`) | `201` → `{"success":true,"orderId","refId":"C2C-<referenceNumber>"}` — در یک تراکنش: فیش → `APPROVED`، intent → `CAPTURED`، سفارش → `PAID`، ثبت `order_status_history` (actor همان `reviewer`) و سند دفترکل فروش با `paymentMethod=CARD_TO_CARD`. فیش در وضعیت بررسی نباشد: `400`. |

> **قاعده امنیتی:** پارامتر `Status` در URL بازگشت مرورگر فقط نمایشی است؛ منبع حقیقت تأیید پرداخت، متد verify سمت سرور درگاه است (ران‌بوک RB-01).

### ۲.۷ Orders — سفارش‌ها

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/orders/:id` | — | — | `200` → سفارش کامل: وضعیت، خطوط، `priceSnapshot`، `paymentIntents` و `history` (تاریخچه وضعیت نزولی). یافت نشد: `404`. |
| GET | `/orders/:id/invoice` | — | — | `200` با `Content-Type: text/html; charset=utf-8` → فاکتور رسمی (HTML چاپی) شامل ردیف‌ها، تخفیف، مالیات ۱۰٪ (`vatRateBps=1000`) و جمع نهایی به ریال. |
| GET | `/orders/stores/:storeId?status=&limit=&offset=` | — | — | `200` → `{"items":[...], "total", "limit", "offset"}` — فهرست سفارش‌های فروشگاه؛ `status` یکی از `OrderStatus` (پیش‌فرض همه)، `limit` پیش‌فرض ۲۰، `offset` پیش‌فرض ۰. |
| POST | `/orders/:id/transition` | — | `{"toStatus", "actor?", "reason?"}` (پیش‌فرض actor: `OPERATOR`) | `201` → سفارش به‌روزشده + رکورد `order_status_history`. گذار با ماشین حالت دامنه اعتبارسنجی می‌شود: مجاز از `DRAFT`: `PENDING_PAYMENT`/`CANCELLED`؛ از `PENDING_PAYMENT`: `PAID`/`CANCELLED`؛ از `PAID`/`PROCESSING`: جلورو یا `REFUNDED`/`CANCELLED`؛ از `SHIPPED`: `DELIVERED`/`REFUNDED`؛ از `DELIVERED`: `COMPLETED`/`REFUNDED`؛ از `COMPLETED`: `REFUNDED`؛ `CANCELLED`/`REFUNDED` پایانی‌اند. گذار غیرمجاز: خطای دامنه (`InvalidStateTransitionError`). |

### ۲.۸ Ledger — دفترکل دوبل‌اندر

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/ledger/trial-balance` | **`x-tenant-id`** | — | `200` → تراز آزمایشی هر حساب: `code`، `nameFa`، `category` و جمع بدهکار/بستانکار؛ شرط سامان‌بودن `SUM(DEBIT) = SUM(CREDIT)`. غیبت هدر: `401`. |
| GET | `/ledger/export/sepidar` | **`x-tenant-id`** | — | `200` با `Content-Type: text/csv; charset=utf-8` و `Content-Disposition: attachment; filename="sepidar-journal-export-<timestamp>.csv"` → اکسپورت اسناد در قالب نرم‌افزار سپیدار/هلو با **BOM** (نمایش صحیح فارسی در Excel). غیبت هدر: `401`. |

### ۲.۹ Shipping — استعلام ارسال و رهگیری

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| POST | `/shipping/quote` | — | `{"originCity", "destinationProvince", "destinationCity", "totalWeightGrams", "packageValueRials", "isFragile?"}` | `201` → فهرست گزینه‌های ارسال (پست/تیپاکس/پیک بسته به مسیر) با قیمت ریالی، مدت تحویل و شناسه روش برای انتخاب در چک‌اوت. |
| GET | `/shipping/track?carrier=&trackingCode=` | — | — | `200` → وضعیت مرسوله و فهرست `ShipmentTrackingEvent`ها (پیش‌فرض `ShipmentStatus`ها: `PENDING` تا `DELIVERED`/`RETURNED`). |

### ۲.۱۰ Wallet — کیف پول کاربران

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/wallet/:userId` | **`x-tenant-id`** | — | `200` → `{"balance", "currency":"IRR", ...}` (موجودی به ریال، رشته صحیح). غیبت هدر: `401`. |
| POST | `/wallet/:userId/credit` | **`x-tenant-id`** | `{"amountRials", "refType", "refId", "description"}` | `201` → تراکنش `CREDIT` ثبت و موجودی افزایش می‌یابد؛ `refType`/`refId` ردپای منبع (مثلاً `ORDER_REFUND`/`orderId`). بستانکاری کیف پول مشتری، بدهی امانی حساب `2010` است. |
| POST | `/wallet/:userId/debit` | **`x-tenant-id`** | `{"amountRials", "refType", "refId", "description"}` | `201` → تراکنش `DEBIT`؛ برداشت بیش از موجودی رد می‌شود (بدون ممیز شناور، عملیات ریالی صحیح). |

### ۲.۱۱ Notifications — اعلان‌های خروجی (Outbox consumer)

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/notifications?limit=&status=` | — | — | `200` → `{"items":[...], "dbAvailable":true}` — رکوردهای `notification_deliveries` با `channel` (`SMS`/`EMAIL`)، `templateKey`، `title`، `body`، `status` (`QUEUED`/`SENT`)؛ `limit` پیش‌فرض ۵۰. در نبود DB، پاسخ رزیلنت با `dbAvailable:false`. |
| GET | `/notifications/templates` | — | — | `200` → فهرست قالب‌های رسمی با `key`، `titleFa` و `requiredPayloadFields`: `ORDER_PAID` (`orderId, totalAmount`)، `ORDER_SHIPPED` (`orderId, trackingCode`)، `C2C_RECEIPT_APPROVED` (`orderId`)، `WALLET_DEPOSIT` (`amount`). |

### ۲.۱۲ Webhooks — ارسال و پایش وب‌هک‌های خروجی

امضای HMAC-SHA256: روی بدنه JSON خام با `WEBHOOK_SECRET` محاسبه (`HMAC(secret, payloadJson)` به‌صورت hex) و در هدر **`x-commerce-signature`** ارسال می‌شود؛ نوع رویداد در هدر `x-commerce-event`. گیرنده باید با مقایسه ثابت‌زمان (`timingSafeEqual`) صحت‌سنجی کند.

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| POST | `/webhooks/dispatch` | `x-tenant-id` (توصیه‌شده) | `{"eventType", "payload", "targetUrl"}` (پیش‌فرض eventType: `ORDER_PAID`) | `201` → رکورد تحویل در `webhook_deliveries` با امضای محاسبه‌شده و وضعیت (`PENDING`/`DELIVERED`/`FAILED` بر اساس پاسخ مقصد). |
| POST | `/webhooks/test` | — | `{"url", "eventType?"}` | `201` → ارسال آزمایشی یک رویداد به URL مقصد با همان امضا — برای صحت‌سنجی سمت گیرنده. |
| GET | `/webhooks?limit=` | — | — | `200` → آخرین تحویل‌ها با `eventType`، `targetUrl`، `status`، `attempts`، `lastError`؛ `limit` پیش‌فرض ۵۰. |

### ۲.۱۳ Analytics — رویدادهای تحلیلی بدون PII

فقط این پنج رویداد پذیرفته می‌شوند (کاتالوگ بسته): `product_viewed`، `search_submitted`، `add_to_cart`، `checkout_started`، `order_confirmed`. فایروال PII کلیدهای `phone`, `email`, `nationalId`, `cardPan`, `address` را در هر عمق از `props` حذف می‌کند؛ نام دیگر: `400` با پیام «رویداد تحلیلی مجاز نیست».

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| POST | `/analytics/events` | `x-tenant-id` / `x-user-id` (اختیاری برای انتساب) | `{"name": <از ۵ رویداد مجاز>, "sessionId?", "props?"}` | `201` → `{"accepted":true,"dbAvailable":true}` — در نبود DB پاسخ `{"accepted":false,"dbAvailable":false}` برمی‌گردد تا استورفرانت نشکند (حالت رزیلنت عمدی). |
| GET | `/analytics/summary?days=7` | — | — | `200` → `{"dbAvailable", "days", "totalEvents", "byName": {...۵ رویداد}, "byDay":[{"day","count"}], "funnel":[{"stage","count","conversionToNextPct"}]}` — `days` بین ۱ تا ۹۰ (پیش‌فرض ۷)؛ قیف چهار مرحله‌ای: `product_viewed → add_to_cart → checkout_started → order_confirmed`. |

### ۲.۱۴ Ops — مرکز استثناهای عملیات

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/ops/exceptions` | — | — | `200` → `{"dbAvailable":true, "blocks":[...]}` — هر بلوک `{key, titleFa, count, items[≤10]}` با این کلیدها: `outbox_dead_letter` (رویدادهای مرده/شکست‌خورده Outbox)، `payment_unknown` (intentهای `UNKNOWN/FAILED`)، `stuck_reservations` (رزروهای `ACTIVE` با `expires_at` گذشته)، `c2c_pending` (فیش‌های کارت‌به‌کارت در انتظار بررسی)، `webhook_failures` (وب‌هک‌های شکست‌خورده/در انتظار). بلوک‌ها مستقل بارگذاری می‌شوند؛ خطای یک جدول بقیه را نمی‌شکند (`dbAvailable` ترکیبی). ران‌بوک‌های RB-01 تا RB-03 مصرف‌کننده مستقیم این endpoint هستند. |

### ۲.۱۵ Reviews — نظرات و تعدیل

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/reviews/products/:productId` | — | — | `200` → نظرات منتشرشده (`APPROVED`) همان محصول. |
| POST | `/reviews/products/:productId` | `x-tenant-id` (اختیاری؛ پیش‌فرض `demo-tenant-id`)، `x-user-id` (اختیاری) | `{"authorName", "rating": 1..5, "title", "body"}` | `201` → نظر ثبت‌شده با وضعیت `PENDING` (منتظر تعدیل؛ بدون پیمایش عمومی تا تأیید). |
| GET | `/reviews/admin/pending?limit=` | — | — | `200` → صف تعدیل: نظرات `PENDING`؛ `limit` پیش‌فرض ۵۰. |
| POST | `/reviews/admin/:id/moderate` | — | `{"decision": "APPROVED" \| "REJECTED", "moderator?"}` (پیش‌فرض moderator: `admin`) | `201` → وضعیت نظر به `APPROVED` (قابل نمایش در کاتالوگ) یا `REJECTED` تغییر می‌کند و نام تعدیل‌کننده ثبت می‌شود. |

### ۲.۱۶ Recommendations — توصیه‌گر اکتشافی (ADR-006)

رتبه‌بندی همیشه سمت سرور انجام می‌شود (هرگز کلاینت) و هر پاسخ `source` (`DB` | `FALLBACK`) دارد تا منبع داده قابل ممیزی بماند. هیچ داده PII استفاده نمی‌شود — تنها سیگنال، `sessionId` ناشناس است. `limit` همیشه به بازه ۱ تا ۱۲ محدود می‌شود؛ مقدار نامعتبر به پیش‌فرض همان اندپوینت برمی‌گردد.

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/recommendations/products/:productId?limit=` | — | — | `200` → `{"source":"DB","items":[…]}` مرتبط‌ترین‌ها: محصولات هم‌دسته کالای جاری، مرتب‌شده بر اساس مجموع فروش واقعی (`order_lines`)؛ پیش‌فرض ۶. محصول ناموجود، فاقد دسته، دسته خالی یا DB-down → `{"source":"FALLBACK","items":[…]}` از دیتاست دموی هم‌دسته. |
| GET | `/recommendations/popular?limit=` | — | — | `200` → `{"source","items"}` پرفروش‌ترین‌های سراسری بر اساس مجموع فروش (تساوی → جدیدترین انتشار)؛ پیش‌فرض ۸. DB-down: ترتیب دموی منسجم با `source:"FALLBACK"`. |
| GET | `/recommendations/for-you?sessionId=&limit=` | — | — | `200` → `{"source","items"}` «برای شما»: ۲۰ رویداد آخر `product_viewed`/`add_to_cart` همان `sessionId` (تنها کلید خوانده‌شده از props، `slug` است) → دسته‌های موردعلاقه → برترین کالاهای همان دسته‌ها با حذف کالاهای دیده‌شده؛ پیش‌فرض ۶. نبود سیگنال کاربردی → تثبیت به خروجی popular (همان `source`). |

آیتم توصیه در همه سه کانال: `{"id","slug","title","description","category":{"slug","titleFa"} \| null,"priceRials","priceTomans","inStock"}` — قیمت به ریال و تومان (رشته صحیح).

### ۲.۱۷ Loyalty — باشگاه مشتریان (ADR-008)

قاعده کسب: ۱ امتیاز به‌ازای هر ۱۰٬۰۰۰ ریال مبلغ قطعی سفارش؛ اجرای خودکار در Worker با مصرف رویداد `ORDER_PAID` (بدون تماس همگام در مسیر پرداخت). دفتر امتیاز append-only با `balanceAfter` در هر ردیف است و سطح از موجودی فعلی مشتق می‌شود: `BRONZE` (پیش‌فرض) / `SILVER` (۱٬۰۰۰+) / `GOLD` (۵٬۰۰۰+).

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/loyalty/users/:userId?limit=` | **`x-tenant-id`** | — | `200` → `{"userId","tenantId","points","tier","transactions":[{"id","direction","points","refType","refId","description","balanceAfter","createdAt"}],"dbAvailable":true}` — موجودی + سطح + تاریخچه (جدیدترین اول). حساب در اولین فراخوانی با موجودی صفر ساخته می‌شود. `limit` پیش‌فرض ۲۰ (بازه ۱ تا ۱۰۰). غیبت هدر: `401`. DB-down: صفر-حالت `{"points":0,"tier":"BRONZE","transactions":[],"dbAvailable":false}`. |
| POST | `/loyalty/admin/users/:userId/adjust` | **`x-tenant-id`** | `{"pointsDelta", "reason?", "actor?"}` | `201` → `{"points","tier","dbAvailable":true}` — تنظیم دستی ادمین با ردیف حسابرسی (`refType: MANUAL_ADJUST`؛ علامت delta جهت تراکنش را تعیین می‌کند: مثبت `EARN`، منفی `REDEEM`). `pointsDelta` صفر/نامعتبر: `400`؛ ردم بیش از موجودی: `400` با پیام «موجودی امتیاز کافی نیست». DB-down: پاسخ `{"points":0,"tier":"BRONZE","dbAvailable":false}` تا کنسول ادمین نشکند. |

### ۲.۱۸ Subscriptions — اشتراک‌های دوره‌ای (ADR-009)

اصول تاب‌آوری: فهرست پلن‌ها روی DB-down با پلن‌های نمونه پاسخ می‌دهد (`source: FALLBACK`)، اما «ثبت عضویت» و تغییر وضعیت، تعهد/تغییر واقعی است و هرگز ساختگی انجام نمی‌شود — روی DB-down خطای `503` صادقانه برمی‌گردد. کسر خودکار دوره‌ای فعلاً وجود ندارد (نیازمند درگاه توکن‌پذیر)؛ Worker سررسید اعضای `ACTIVE` را با رویداد `SUBSCRIPTION_RENEWAL_DUE` جلو می‌برد.

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/subscriptions/plans?storeSlug=` | — | — | `200` → `{"source":"DB" \| "FALLBACK","items":[{"id","slug","titleFa","description","intervalDays","priceRials","priceTomans","currency"}]}` — فقط پلن‌های فعال فروشگاهِ فعال. غیبت storeSlug: `400`؛ فروشگاه ناموجود: `404`. DB-down: سه پلن نمونه با `source:"FALLBACK"`. |
| POST | `/subscriptions` | — | `{"planId", "userId?", "phone", "quantity?"}` | `201` → `{"id","profileBindingId","status":"ACTIVE","quantity","phone","nextRunAt","cyclesRun","plan":{"id","slug","titleFa","intervalDays"}}` — کاربر ناشناس `profileBindingId` (UUID تصادفی) می‌گیرد تا بعداً حساب واقعی خود را به آن متصل کند. اعتبارسنجی: موبایل ایرانی (`09…`، ۱۱ رقم) → `400`، `quantity` عدد صحیح ۱ تا ۱۲ (پیش‌فرض ۱) → `400`، پلن ناموجود/غیرفعال → `404`. DB-down: `503` با پیام «ثبت اشتراک موقتاً در دسترس نیست — تعهد دوره‌ای ساختگی ثبت نمی‌شود». |
| GET | `/subscriptions/users/:userId` | **`x-tenant-id`** | — | `200` → `{"items":[SubscriptionView],"dbAvailable":true}` — «اشتراک‌های من»، جدیدترین اول. DB-down: `{"items":[],"dbAvailable":false}`. |
| POST | `/subscriptions/:id/pause` | **`x-tenant-id`** | `{"reason?"}` | `201` → SubscriptionView با وضعیت `PAUSED` — ماشین وضعیت فقط `ACTIVE → PAUSED`؛ وضعیت نامناسب: `400` («فقط اشتراک فعال قابل توقف است»)، ناموجود: `404`، DB-down: `503`. |
| POST | `/subscriptions/:id/resume` | **`x-tenant-id`** | — | `201` → SubscriptionView با وضعیت `ACTIVE` — فقط `PAUSED → ACTIVE`؛ غیر از آن: `400`. |
| POST | `/subscriptions/:id/cancel` | **`x-tenant-id`** | `{"reason?"}` | `201` → SubscriptionView با وضعیت `CANCELLED` و ثبت `cancelReason` — از `ACTIVE` یا `PAUSED`؛ لغو مجدد وضعیت پایانی: `400`. |
| GET | `/subscriptions/admin?status=` | **`x-tenant-id`** | — | `200` → `{"items":[SubscriptionView],"dbAvailable":true}` — همه اشتراک‌های مستأجر (جدیدترین اول)؛ `status` اختیاری یکی از `ACTIVE` \| `PAUSED` \| `CANCELLED` \| `EXPIRED` (خارج از این: `400`). DB-down: `{"items":[],"dbAvailable":false}`. |

ساختار `SubscriptionView`: `{"id","status","quantity","phone","nextRunAt","lastRunAt","cyclesRun","cancelReason","createdAt","plan":{"id","slug","titleFa","intervalDays"}}`.

### ۲.۱۹ Digital — لایسنس‌های کالای دیجیتال (ADR-012 — موج W18)

`DigitalGrant` پس از کپچر پرداخت، توسط Worker روی رویداد `ORDER_PAID` برای هر خط سفارش دیجیتال ساخته می‌شود و آیدمپوتنت است (یکتایی `orderLineId` — اجرای تکراری یا رقابت دو Worker چیزی نمی‌سازد). سقف دانلود پیش‌فرض ۵ و انقضای ۳۰ روز. خطوط دیجیتال از رزرو انبار و ارسال معاف‌اند.

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/digital/grants?phone=` | — | — | `200` → `{"items":[DigitalGrantView],"dbAvailable":true}` — «محصولات دیجیتال من»: لایسنس‌های یک شماره موبایل، حداکثر ۵۰ مورد، جدیدترین اول. موبایل نامعتبر: `400` («شماره موبایل ایرانی معتبر وارد کنید»). DB-down: `{"items":[],"dbAvailable":false}`. |
| GET | `/digital/download/:token` | — | — | `200` → `{"ok":true,"downloadUrl","remainingDownloads","expiresAt"}` — اعتبارسنجی و claim اتمیک: افزایش شرطی `downloadCount` فقط وقتی `downloadCount < maxDownloads`، بدون ابطال و پیش از انقضا انجام می‌شود (همزمانی و سقف در خود شرط UPDATE حل می‌شود؛ هرگز از سقف عبور نمی‌کند). `downloadUrl` همان `digitalFileUrl` واریانت است (در توسعه، فایل دمو). توکن ناموجود: `404`؛ لایسنس ابطال‌شده/منقضی یا سقف تمام‌شده: `410 Gone`. DB-down: `503`. |
| POST | `/digital/grants/:id/revoke` | **`x-tenant-id`** | — | `201` → `{"id","revokedAt"}` — ابطال لایسنس در محدوده مستأجر؛ آیدمپوتنت (ابطال تکراری عیناً همان نتیجه را برمی‌گرداند). ناموجود در مستأجر: `404`؛ DB-down: `503`. |

ساختار `DigitalGrantView`: `{"id","orderId","token","productTitle","downloadCount","maxDownloads","remainingDownloads","revokedAt","expiresAt","createdAt"}` — توکن ۶۴ کاراکتر hex است و در پاسخ دانلود هرگز فایل مستقیماً از سرور جاری سرو نمی‌شود (انتقال به URL فایل واریانت).

### ۲.۲۰ Settings — کنترل سکشن‌های صفحه اصلی فروشگاه (ADR-013)

دید سکشن‌های ویترین (نمایش/پنهان‌سازی هر بخش صفحه اصلی) به‌صورت **سرورساید** در جدول `StorefrontSetting` نگه‌داری می‌شود — سطر یکتای `home_sections` با payload حاوی map بولی `sectionId → boolean` — و جانشین طراحی قدیمیِ همگام‌سازی cross-origin `localStorage` بین ادمین (پورت ۳۰۰۱) و استورفرانت (پورت ۳۰۰۰) است که به‌دلیل محدودیت مرورگرها در خواندن حافظه دامنه دیگر، عملاً شکسته بود. مقادیر پیش‌فرض در کد هستند؛ ردیف DB فقط override است و «بازنشانی» یعنی حذف سطر.

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/settings/storefront` | — | — | `200` → `{"overrides":{"<sectionId>":true\|false},"source":"DB" \| "DEFAULT"}` — عمومی؛ استورفرانت هنگام رندر صفحه اصلی می‌خواند. DB-down: همیشه `200` با `{"overrides":{},"source":"DEFAULT"}` (هرگز ۵۰۰ نمی‌دهد تا رندر ویترین نشکند). |
| PUT | `/settings/storefront/home-sections` | **AdminGuard** | `{"overrides":{"<sectionId>": boolean}}` (بین ۱ تا ۵۰ کلید متنی با مقدار بولی) | `200` → `{"saved":true,"overrides":<ادغام‌شده>}` — upsert سطر یکتا؛ کلیدهای جدید بر مقادیر قبلی اولویت دارند و `updatedBy` (شناسه ادمین نشست) ثبت می‌شود. نقض اعتبارسنجی (۰ یا بیش از ۵۰ کلید، مقدار غیربولی): `400` با پیام «تنظیمات بخش‌های صفحه اصلی نامعتبر است: بین ۱ تا ۵۰ کلید متنی با مقدار بولی الزامی است». DB-down: `503` با پیام «ذخیره تنظیمات ویترین موقتاً در دسترس نیست — لطفاً بعداً تلاش کنید» (وضعیت دید سکشن‌ها هرگز ساختگی قبول نمی‌شود). |
| DELETE | `/settings/storefront/home-sections` | **AdminGuard** | — | `200` → `{"saved":true,"overrides":{}}` — حذف سطر override؛ ویترین به پیش‌فرضِ کد برمی‌گردد (idempotent). DB-down: `503` با پیام «بازنشانی تنظیمات ویترین موقتاً در دسترس نیست — لطفاً بعداً تلاش کنید». |

### ۲.۲۱ Stores Admin — نویسندگی محصول در کاتالوگ (ERP — ADR-013)

همان کنترلر `stores` میزبان مسیرهای مدیریتی نویسندگی محصول است (پیشوند `/stores/admin/...`، نه `/catalog/admin/...`). پول و موجودی روی **واریانت پیش‌فرض** (`sku: <slug>-STD`) و `InventoryLevel` انبار `MAIN` ذخیره می‌شوند، نه روی خود Product. همه مسیرها ایزولاسیون مستأجر با `x-tenant-id` دارند (غیبت: `401` با پیام «شناسه مستأجر (x-tenant-id) الزامی است»)؛ مسیرهای نوشتن (POST/PATCH/bulk) به‌علاوه پشت AdminGuard (AUTH-003) هستند.

| متد | مسیر | هدر الزامی | بدنه درخواست | پاسخ موفق |
|---|---|---|---|---|
| GET | `/stores/admin/products?store=<slug>&limit=` | **`x-tenant-id`** | — | `200` → `{"data":[Product],"meta":{"count":<n>}}` — فهرست کامل محصولات فروشگاه در همه وضعیت‌ها (`DRAFT`/`PUBLISHED`/`ARCHIVED`)، مرتب بر `updatedAt` نزولی؛ `limit` پیش‌فرض ۵۰ (بازه ۱..۱۰۰). هر آیتم شامل برند، دسته، مدیا، مواد مؤثره، کلیم‌ها و `defaultVariant` (sku/قیمت ریالی/موجودی). `store` غایب → همه محصولات مستأجر. DB-down: فهرست نمونه دمو (حالت رزیلنت مطابق کاتالوگ عمومی). |
| POST | `/stores/admin/products` | **`x-tenant-id`** + **AdminGuard** | `{"storeSlug", "titleFa", "slug?", "titleEn?", "description?", "categoryFa?", "brandId?", "priceRials", "compareAtPriceRials?", "stock", "status?": "DRAFT" \| "PUBLISHED", "isFeatured?", "coldChain?", "imageUrl?", "kind?": "PHYSICAL" \| "DIGITAL"}` | `201` → `{"data":Product}` — در یک تراکنش: محصول + واریانت پیش‌فرض با `sku: ${slug}-STD` + سطح موجودی انبار `MAIN` (+ مدیای HERO در صورت ارسال `imageUrl`). `slug` غایب از `titleEn`/`titleFa` تولید می‌شود (پایه لاتین؛ در برخورد پسوند `-2`، `-3` و…)؛ `priceRials` عدد صحیح مثبت (الزامی)، `stock` ≥ ۰ (الزامی)، `status` پیش‌فرض `DRAFT` و در حالت `PUBLISHED` زمان `publishedAt` همان لحظه ثبت می‌شود. فروشگاه ناموجود: `404`؛ slug تکراری: `409 Conflict` («محصولی با این اسلاگ از قبل در این فروشگاه موجود است»)؛ برند ناموجود در فروشگاه: `400`؛ DB-down: `503` با پیام «ثبت محصول موقتاً در دسترس نیست — لطفاً بعداً تلاش کنید» (محصول ساختگی ثبت نمی‌شود). |
| PATCH | `/stores/admin/products/:id` | **`x-tenant-id`** + **AdminGuard** | همان فیلدهای ساخت، همه اختیاری (ویرایش جزئی) | `200` → `{"data":Product}` — گذار `PUBLISHED` فقط بار اول `publishedAt` را می‌نویسد و هرگز بازنویسی نمی‌شود. ناموجود در مستأجر: `404` («محصول یافت نشد یا دسترسی مجاز نیست»)؛ slug تکراری: `409`؛ DB-down: `503`. |
| POST | `/stores/admin/products/bulk-update` | **`x-tenant-id`** + **AdminGuard** | `{"ids": [UUID × ۱..۱۰۰], "status?": "DRAFT" \| "PUBLISHED" \| "ARCHIVED", "isFeatured?"}` | `201` → `{"data":{"updated":<n>}}` — ویرایش گروهی **فقط پرچمی** (وضعیت/ویترین): قیمت و موجودی عمداً در whitelist نیستند و پایپ `forbidNonWhitelisted` قبل از سرویس رد می‌کند (`400`). DB-down: `503` با پیام «به‌روزرسانی گروهی محصولات موقتاً در دسترس نیست — لطفاً بعداً تلاش کنید». |

---

## ۳. قراردادهای عرضی (Cross-cutting)

- **وضعیت‌های مرجع:** `OrderStatus` (`DRAFT`, `PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`, `COMPLETED`)، `PaymentIntentStatus` (`CREATED`, `PENDING_PROVIDER`, `AUTHORIZED`, `CAPTURED`, `FAILED`, `CANCELLED`, `EXPIRED`, `UNKNOWN`, `REFUNDED`, `PARTIALLY_REFUNDED`)، `ReservationStatus` (`ACTIVE`, `COMMITTED`, `EXPIRED`, `CANCELLED`)، `OutboxStatus` (`PENDING`, `PROCESSING`, `PROCESSED`, `FAILED`, `DEAD_LETTER`)، `SubscriptionStatus` (`ACTIVE`, `PAUSED`, `CANCELLED`, `EXPIRED`)، `ProductStatus` (`DRAFT`, `PUBLISHED`, `ARCHIVED`).
- **آیدمپوتنسی:** فقط دستورات مالی الزام هدر دارند؛ هر scope (مثل `ORDER_PLACE`) کلید مستقل نگه می‌دارد و رکوردهای منقضی‌شده پاک‌سازی می‌شوند.
- **ایزولاسیون مستأجر:** endpointهای با `x-tenant-id` در لایه Prisma هم scope می‌شوند؛ مقدار هدر فقط انتخاب‌گر است، نه مجوز دور زدن (دفاع BOLA/IDOR).
- **قاعده PII:** هیچ body درخواست/پاسخ در لاگ‌ها نوشته نمی‌شود (§۷.۱ سند معماری)؛ کد پیگیری مشکل فقط `correlationId` است.
- **مصرف‌کننده مرجع:** اسکریپت `scripts/e2e-golden-path.mjs` مسیر طلایی (سلامت → کاتالوگ → جست‌وجو → قیمت‌گذاری → ارسال → چک‌اوت → کنترل سکشن‌های صفحه اصلی → نویسندگی محصول ERP) را با همین قراردادها اجرا می‌کند و معیار سبز انتشار است.
