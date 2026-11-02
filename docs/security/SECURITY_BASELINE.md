# Security Baseline — Dr Dermer UK Clinical & Commerce OS

> آخرین به‌روزرسانی: ۱۴۰۵/۰۸/۱۱ (۲۰۲۶-۱۱-۰۲) — پس از اجرای AUTH-001
>
> این سند وضعیت **تأییدشده در زمان اجرا** (runtime-verified) کنترل‌های امنیتی را ثبت می‌کند و نقشه بستن یافته‌های ابزار تحلیل ایستا (Mimosa scan-2026-11-02T16-55-33, seal `sha256:55ae3cd0…`) را نگه می‌دارد.
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

- `GET /v1/ops/metrics` — بدون اعتبارنامه `401`، کلید اشتباه `401`، کلید معتبر `200`، Bearer ادمین `200`، Bearer مشتری `401`
- `GET /v1/ops/exceptions` — همان گارد
- `GET /v1/ledger/trial-balance` و `GET /v1/ledger/export/sepidar` — AdminGuard + گیت `x-tenant-id`

**تست‌ها:** `apps/api/src/common/guards/admin.guard.spec.ts` — ۱۰/۱۰ سبز (رد بی‌اعتبارنامه، رد CUSTOMER، پذیرش سه نقش ادمین، اتصال identity به request، کلید سرویس معتبر/نامعتبر، رفتار بدون env).

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
