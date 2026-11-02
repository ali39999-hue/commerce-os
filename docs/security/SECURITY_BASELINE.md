# Security Baseline — Dr Dermer UK Clinical & Commerce OS

> آخرین به‌روزرسانی: ۱۴۰۵/۰۸/۱۱ (۲۰۲۶-۱۱-۰۲) — پس از اجرای AUTH-001 و AUTH-003
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
