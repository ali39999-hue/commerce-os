# Security Baseline — Dr Dermer UK Clinical & Commerce OS

> آخرین به‌روزرسانی: ۱۴۰۵/۰۸/۱۱ (۲۰۲۶-۱۱-۰۲) — **فاز ۹ کامل**: AUTH-001، AUTH-002 (گام ۱+۲)، AUTH-003 و AUTH-004
>
> این سند وضعیت **تأییدشده در زمان اجرا** (runtime-verified) کنترل‌های امنیتی را ثبت می‌کند و نقشه بستن یافته‌های ابزار تحلیل ایستا (Mimosa scan-2026-11-02T17-22-12, seal `sha256:4d7a8510…`) را نگه می‌دارد.
> ⚠️ هیچ‌گاه این سند را به‌عنوان «تأییدیه امنیت» نقل نکنید — فهرست کنترل است، نه گواهی.

## ۱. کنترل‌های فعال (Runtime-Verified)

| لایه | کنترل | وضعیت |
|---|---|---|
| شبکه | CORS سفیدفهرستی سخت (بدون wildcard در production) | ✅ `apps/api/src/main.ts` |
| هدرها | Helmet (HSTS preload، nosniff، sameorigin، referrer-policy) | ✅ `apps/api/src/main.ts` |
| ورودی | ValidationPipe با `whitelist + forbidNonWhitelisted` | ✅ سراسری |
| نرخ | RateLimitGuard سراسری (پروفایل‌های auth/checkout/search/reviews) | ✅ `common/rate-limit` |
| لاگ | LoggingInterceptor عاری از PII + AllExceptionsFilter ساختاریافته | ✅ `common/` |
| **احراز هویت مشتری** | OTP پیامکی: هش SHA-256 با salt، مقایسه `timingSafeEqualStrings`، سقف ۵ تلاش، انقضای ۵ دقیقه، نشست ۳۰ روزه | ✅ `identity/` |
| **احراز هویت ادمین (AUTH-001)** | `AdminGuard`: نشست OTP با نقش سازمانی **یا** کلید سرویس‌به‌سرویس `x-admin-api-key` (مقایسه timing-safe) | ✅ `common/guards/admin.guard.ts` |
| مجوزدهی | نقش‌های `SUPER_ADMIN / OPERATOR / ACCOUNTANT` در ADMIN_ROLES؛ نقش فقط با به‌روزرسانی DB واگذار می‌شود (self-service ممنوع) | ✅ |
| یکپارچگی پرداخت | کلید idempotency (`x-idempotency-key`)، دفتر دوطرفه با تراز ۱۰۰٪ | ✅ تست‌های finance |

## ۲. Endpointهای محافظت‌شده با AdminGuard (تأیید ۴۰۱/۲۰۰ در زمان اجرا)

**خواندنی‌های مدیریتی:**
- `GET /v1/ops/metrics`، `GET /v1/ops/exceptions`
- `GET /v1/ledger/trial-balance`، `GET /v1/ledger/export/sepidar`
- `GET /v1/subscriptions/admin`

**تغییردهنده‌های مدیریتی (AUTH-003):**
- `POST /v1/orders/:id/transition` — انتقال وضعیت چرخه سفارش
- `POST /v1/pricing/coupons`، `PATCH /v1/pricing/coupons/:id/toggle`
- `POST /v1/payments/receipts/:receiptId/approve` — نقطه تصمیم SoD فیش کارت‌به‌کارت
- `POST /v1/digital/grants/:id/revoke`
- `POST /v1/loyalty/admin/users/:userId/adjust`
- `POST /v1/reviews/admin/:id/moderate`
- `POST /v1/wallet/:userId/credit` و `POST /v1/wallet/:userId/debit`
- `POST /v1/subscriptions/:id/pause|resume|cancel`
- `POST /v1/b2b/quote-requests/:id/status`

**عمداً عمومی مانده‌اند (جریان فروشگاه):** checkout session/place-order، پرداخت initiate/ثبت فیش مشتری، callback زرین‌پال، ثبت نظر مشتری، ثبت استعلام B2B، ثبت عضویت اشتراک، quote ارسال، analytics events، جست‌وجو/کاتالوگ/پلن‌ها.

**ماتریس زمان‌اجرا (۱۲ مسیر گاردشده):** بدون اعتبارنامه → همه `401`؛ با کلید سرویس → عبور به هندلر (خطای ۴۰۰/۵۰۰ فقط به‌خاطر ID قلابی تست)؛ مسیرهای عمومی → `200`.

## ۳-ب. گام اول AUTH-002 — Tenant سرور-محور (Runtime-Verified)

- دکوراتور `@CurrentTenant()` (`common/guards/current-tenant.decorator.ts`) هندلرها را از tenant **ت Resolve شده توسط گارد** تغذیه می‌کند، نه هدر خام کلاینت.
- `AdminGuard` پس از احراز موفق `request.tenantId` را تعیین می‌کند:
  - **نشست OTP ادمین (مرورگر):** همیشه `DEFAULT_TENANT_ID` سرور — هدر `x-tenant-id` مهاجم نادیده گرفته می‌شود (تأیید: درخواست با هدر `attacker-tenant` → همان داده پیش‌فرض).
  - **کلید سرویس‌به‌سرویس:** هدر مجاز است (کلاینت معتمد)؛ بدون هدر → پیش‌فرض سرور (تأیید `200`).
- هر ۱۲ هندلر گاردشده از `@CurrentTenant()` استفاده می‌کنند؛ گیت‌های `requireTenant` در این مسیرها حذف شدند.

## ۳-ج. گام دوم AUTH-002 — نشست مشتری و «اشتراک‌های من» (Runtime-Verified)

- `SessionUserGuard` (`common/guards/session-user.guard.ts`): گارد اختیاری — توکن Bearer نشست OTP را اعتبارسنجی و `request.customerUser` را اتصال می‌دهد؛ مهمان عبور می‌کند تا هندلر تصمیم بگیرد.
- **`GET /v1/subscriptions/me`**: userId همیشه از نشست می‌آید، هرگز از URL — مهمان `401` با پیام فارسی، مشتری `200` با لیست هویت‌متصل (تأیید curl + مرورگر).
- **Storefront**: `CustomerSessionProvider` (`lib/customer-session.tsx`) با ورود OTP دومرحله‌ای، ماندگاری در localStorage و `authedFetch`؛ صفحه اشتراک‌ها برای مشتری واردشده لیست واقعی را می‌خواند و برای مهمان بنر شفاف «نمونه» + کارت ورود نمایش می‌دهد (تأیید مرورگری: بنر سبز نشست + حالت خالی صحیح).
- مسیر legacy `users/:userId` برای اسکریپت‌ها باقی است و در سند به‌عنوان deprecated علامت خورد.

## ۳-ه. گام سوم AUTH-002 — لایسنس‌های دیجیتال و صفحه حساب (Runtime-Verified)

- **بستن یافته IDOR:** `GET /v1/digital/grants?phone=` به هر کسی اجازه می‌داد با شماره دلخواه لایسنس‌های دیگران را فهرست کند. جایگزین هویت‌متصل: **`GET /v1/digital/my-grants`** — شماره همیشه از نشست OTP می‌آید (مهمان `401` با پیام فارسی، نشست `200`)؛ مسیر legacy فقط برای اسکریپت e2e باقی است و deprecated علامت خورد.
- **صفحه حساب استورفرانت:** سلام کاربر به هویت نشست متصل شد؛ بنر شفاف «نشست احرازشده» با دکمه خروج برای مشتری واردشده و کارت ورود OTP برای مهمان؛ تعداد لایسنس‌های فعال از `my-grants` در چیپ نشست نمایش داده می‌شود.
- **باقی‌مانده (فاز بعدی):** اتصال سفارش‌های واقعی checkout به نشست مشتری (خرید مهمان در تجارت الکترونیک موجه است اما سفارش‌های کاربر واردشده باید به هویت متصل شوند) و migrate کامل مسیرهای legacy به واریانت‌های /me.

## ۳-و. گام چهارم AUTH-002 — اتصال سفارش‌های checkout به هویت نشست (Runtime-Verified)

- `CheckoutController` با `SessionUserGuard` اختیاری؛ خرید مهمان کامل دست‌نخورده باقی است.
- در `placeOrder` هویت مشتری از نشست به سرویس منتقل می‌شود و **`order.customerPhone/customerName` همیشه از هویت احرازشده** پر می‌شود — نه از بدنه درخواست و نه از `receiverPhone` آدرس (که جزئیات ارسال‌اند). بدین ترتیب امتیازهای نزولی (لایسنس‌های دیجیتال، تاریخچه سفارش) روی شماره خود مشتری می‌افتند حتی اگر بدنه درخواست شماره دیگری حمل کند.
- **تأیید زمان‌اجرا:** درخواست با `customerPhone: 09999999999` در بدنه و `receiverPhone: 09888888888` در آدرس → سفارش ثبت‌شده با `customerPhone: 09123456789` (هویت نشست). مسیر مهمان (بدون Bearer) → همان رفتار قبلی؛ چرخه بالینی ۱۰/۱۰ و مسیر طلایی ۱۹/۱۹.
- **اصلاح جانبی:** `QuoteLineDto.variantId` از `@IsUUID()` به `@IsString()+MinLength(3)` اصلاح شد — شناسه‌های واریانت در این سیستم slug هستند (مثل `var_cbg_pro`) و اعتبارسنجی UUID قبلی اشتباه بود.

## ۳-ح. مهاجرت نهایی legacy — قفل مسیرهای شمارش‌پذیر (Runtime-Verified)

- **`GET /v1/subscriptions/users/:userId`** و **`GET /v1/digital/grants?phone=`** هر دو پشت `AdminGuard` قفل شدند: بدون کلید سرویس `401`، با کلید `200`. دیگر هیچ مرورگری نمی‌تواند اشتراک‌ها یا لایسنس‌های کاربر دیگری را با URL شماره‌شماره کند.
- استورفرانت دیگر در نمای مهمان، API را با هویت `user_demo_1` صدا نمی‌زند — مهمان مستقیم داده نمونه محلی را می‌بیند و ورود واقعی از طریق بنر شفاف پیشنهاد می‌شود.
- مصرف‌کننده باقی‌مانده مسیرهای legacy فقط `e2e-golden-path.mjs` است که به‌عنوان کلاینت سرویس‌به‌سرویس با `x-admin-api-key` کار می‌کند.
- زنجیره هویت AUTH-002 اکنون در هر چهار سطح (ادمین، مشتری، لایسنس‌ها، checkout) **کامل و بسته** است.

## ۳-ط. گام پنجم AUTH-002 — خواندنی‌های مالی هویت‌متصل (Runtime-Verified)

- **`GET /v1/wallet/my-balance`** و **`GET /v1/loyalty/my-balance`**: موجودی کیف پول و امتیاز باشگاه مشتریان همیشه از هویت نشست resolve می‌شود (مهمان `401`، نشست `200` با داده واقعی).
- مسیرهای legacy **`GET /wallet/:userId`** و **`GET /loyalty/users/:userId`** پشت AdminGuard قفل شدند — موجودی مالی دیگر با هر userId دلخواه در URL قابل خواندن نیست (بدون کلید `401`، با کلید سرویس `200`).
- تب‌های «کیف پول من» و «باشگاه مشتریان» صفحه حساب اکنون داده واقعی هویت‌متصل نشان می‌دهند (تأیید مرورگری: موجودی واقعی ۰ تومان به‌جای دموی هاردکد ۳٬۴۰۰٬۰۰۰)؛ مهمان همان نمای نمونه را می‌بیند.
- مسیر طلایی ۱۹/۱۹ (loyalty با کلید سرویس)، چرخه بالینی ۱۰/۱۰، بیلد ۱۰/۱۰، تست ۱۴/۱۴.

## ۳-ی. گام ششم AUTH-002 — سفارش‌های من و قفل فهرست فروشگاه (Runtime-Verified)

- **`GET /v1/orders/my`**: تاریخچه سفارش واقعی بر اساس شماره نشست (مهمان `401`، نشست `200` با سفارش‌های همان شماره — تأیید با دو سفارش ثبت‌شده واقعی).
- **`GET /v1/orders/stores/:storeId`** (فهرست همه سفارش‌ها با نام/شماره مشتریان) پشت AdminGuard قفل شد — بدون کلید `401`.
- تب «سفارش‌های من» صفحه حساب برای مشتری واردشده لیست واقعی را می‌خواند؛ مهمان رفتار قبلی (localStorage + نمونه) را دارد.
- نکته فنی: `@Get("my")` باید قبل از `@Get(":id")` اعلان شود وگرنه NestJS «my» را به‌عنوان شناسه سفارش می‌بلعد (۵۰۰ برای مهمان در تست اول — رفع شد).

## ۳-ک. گام هفتم AUTH-002 — مقداردهی خودکار (Prefill) و بازخورد هویت در Checkout (Runtime-Verified)

- **پیش‌بارگذاری مشخصات کاربر واردشده در تسویه‌حساب:** در صورت وجود نشست لاگین شده فعال (`customerSession`)، فیلدهای نام و شماره موبایل در مرحله اول تسویه‌حساب به طور خودکار از هویت نشسته پر می‌شوند تا کاربر ناچار به بازنویسی مجدد اطلاعات تاییدشده خود نباشد.
- **بنر شفافیت هویت و ماسک PII:** نمایش بنر سبز وضعیت با استفاده از تابع `maskIranianMobile` (مانند `0912***6789`) جهت یادآوری اینکه سفارش با شماره هویت احرازشده صادر خواهد شد اما اطلاعات گیرنده مرسوله و آدرس پستی می‌تواند آزادانه به نام فرد دیگری تنظیم شود.
- **تأیید زمان‌اجرا در مرورگر:** لود صفحه checkout همراه با نشست → نمایش فوری بنر و مقداردهی خودکار فیلدها بدون تداخل در جریان خرید مهمان (Guest Checkout).

## ۳-د. AUTH-004 — DTO اختصاصی روی همه نوشتارهای منبع (Runtime-Verified)

- قبل: بدنه‌ها با TS interface اعلان می‌شدند → ValidationPipe برای آن‌ها متادیتای ران‌تایم نداشت و `whitelist/forbidNonWhitelisted` عملاً بی‌اثر بود؛ کل شیء درخواست به سرویس می‌رفت.
- بعد: کلاس‌های DTO با class-validator در `checkout/dto/checkout.dto.ts` و `common/dto/resource-writes.dto.ts`:
  - `CheckoutSessionDto` (nested `QuoteLineDto` + `AddressSnapshotDto`، `ArrayMinSize`)، `PlaceOrderDto` (`IsIn` برای درگاه پرداخت)
  - `CreateCouponDto`، `WalletOperationDto`، `LoyaltyAdjustDto`، `OrderTransitionDto`، `PaymentInitiateDto`، `ReceiptSubmitDto`، `ReceiptApproveDto`، `SubscriptionCreateDto`، `ReviewCreateDto`، `B2bQuoteRequestDto`، `B2bQuoteStatusDto`
- **تأیید زمان‌اجرا:** کلید ناشناخته روی checkout → `400`؛ `paymentMethod:"HACKED"` → `400`؛ `rating:99` → `400`؛ payload سالم → عبور به هندلر (خطای بعدی، کسب‌وکار)؛ چرخه بالینی ۱۰/۱۰ و مسیر طلایی ۱۹/۱۹ با payloadهای واقعی → سازگاری کامل کلاینت‌ها.

**تست‌ها:** `apps/api/src/common/guards/admin.guard.spec.ts` — ۱۰/۱۰ سبز؛ `verify-clinical-store.mjs` ۱۰/۱۰ و `e2e-golden-path.mjs` ۱۹/۱۹ به‌عنوان کلاینت سرویس‌به‌سرویس با کلید از `.env`.

## ۳. فرضیه‌های باز Mimosa و نقشه بستن (AUTH-002+)

| فرضیه ایستا | وضعیت فعلی | اقدام نقشه راه |
|---|---|---|
| «شناسه منبع از درخواست، بدون اتصال مالکیت/مستأجر» (IDOR) |endpointهای عمومی فروشگاه تعمداً به شناسه اعتماد می‌کنند | AUTH-002: اتصال `x-user-id` به نشست در endpointهای سبد/سفارش/علاقه‌مندی؛ پذیرش `x-tenant-id` فقط از توکن، نه هدر |
| «محدوده مستأجر از درخواست» | `x-tenant-id` هدر آزاد است | AUTH-002 (همان بالا) — هدر فقط برای کلید سرویس‌به‌سرویس معتبر باشد |
| «عملیات حساس بدون بررسی نقش» | برای ops/ledger بسته شد؛ سایر ماژول‌ها (catalog write، subscriptions، digital licenses) بدون گارد | AUTH-003: گسترش AdminGuard به تمام متدهای تغییردهنده ماژول‌های مدیریتی؛ نگه‌داشتن مسیرهای عمومی خرید |
| «کل شیء درخواست در نوشتن منبع» | ValidationPipe whitelist است ولی DTOها بعضاً کل بدنه را پاس می‌دهند | AUTH-004: DTO اختصاصی per-endpoint (بخشی در جریان است) |

## ۴. الزامات عملیاتی

- **واگذاری نقش پرسنلی**: `UPDATE "User" SET role='…' WHERE phone='…'` — ثبت در تیکت داخلی. تلفن دمو محلی: `09120000000` (فقط dev).
- **چرخش کلید سرویس**: `ADMIN_API_KEY` در `.env` (gitignored)؛ برای هر محیط واقعی چرخش و نگهداری در secret manager الزامی است. کلید هرگز وارد bundle مرورگر نمی‌شود — ادمین مرورگری از نشست OTP استفاده می‌کند.
- **هدر `x-admin-api-key` عمداً در CORS allowlist نیست**: مرورگرها اجازه ارسال cross-origin آن را ندارند (پیش‌ناپشی شیت CORS) و مسیر کلید فقط به مشتریان سرور-به-سرور محدود می‌ماند. ادمین مرورگری فقط `Authorization: Bearer` می‌فرستد که مجاز است.
- **کد OTP در dev**: مقدار ثابت `12345` فقط وقتی `NODE_ENV !== "production"`؛ در production `crypto.randomInt`.

## ۵. مرز مسئولیت

این baseline فقط API و ادمین این مونوریپو را پوشش می‌دهد. IPG (زرین‌پال/شاپرک)، پیامک OTP واقعی، WAF/CDN لبه و مانیتورینگ زیرساخت خارج از این مخزن‌اند و کنترل جداگانه می‌خواهند.
