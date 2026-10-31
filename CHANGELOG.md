# Changelog

تمام تغییرات قابل‌توجه Commerce OS در این فایل ثبت می‌شود.

قالب بر پایه [Keep a Changelog](https://keepachangelog.com/) و نسخه‌بندی بر پایه [Semantic Versioning](https://semver.org/) است؛ متن فارسی و سرفصل‌ها مطابق قرارداد لاتین.

---

## [1.0.0] — 2026-10-31

نخستین انتشار پایدار. سنتز سه ریپازیتوری مرجع (`itrip-platform`، `aroux30/site`، `commerce-os-starter-v1`) در یک هسته یکپارچه با معماری مونولیت ماژولار در مونوریپو ([ADR-001](docs/architecture/adr/ADR-001-modular-monolith-monorepo.md)).

### Added

**پایه (Foundation)**
- مونوریپو `pnpm` + Turborepo با چهار اپلیکیشن: `apps/api` (NestJS 11 + Prisma 7)، `apps/storefront` و `apps/admin` (Next.js، App Router + React 19، RTL First) و `apps/worker` (کارگر پس‌زمینه مستقل) ([ADR-001](docs/architecture/adr/ADR-001-modular-monolith-monorepo.md)).
- شش پکیج مشترک: `domain` (Money با BigInt، موتور Quote، ماشین‌های حالت)، `finance` (دوبل‌اندر، COA، سپیدار، فاکتور مالیاتی)، `security` (AES-256-GCM، timing-safe)، `gateways` (درگاه‌ها و لجستیک)، `localization` (جلالی و اعتبارسنج‌های ایرانی)، `ui` (دیزاین سیستم فیروزه).
- اسکیمای PostgreSQL 17 با ۴۶ مدل تجاری/مالی + سید دمو (مستأجر، فروشگاه، کاتالوگ، کاربران، حساب‌های دفترکل، کوپن، روش‌های ارسال).
- `docker-compose.yml` توسعه (PostgreSQL 17 + Redis 7)، `docker-compose.prod.yml` شش‌سرویسه و Dockerfile برای هر چهار اپ؛ اسکریپت `start-dev.bat` برای ویندوز.

**هسته تجاری (کاتالوگ تا پرداخت و دفترکل)**
- احراز هویت OTP با نشست‌ها (`/auth/otp/request`, `/auth/otp/verify`, `/auth/me`).
- کاتالوگ چندمستأجری با resolve فروشگاه عمومی و جست‌وجوی فارسی با مترادف‌یابی و فیلترها.
- قیمت‌گذاری سرورساید تغییرناپذیر با فینگرپرینت کوت و توزیع تخفیف/مالیات با الگوریتم `allocate` بدون نشتی ([ADR-002](docs/architecture/adr/ADR-002-zero-float-money-and-ledger.md)).
- رزرو اتمیک انبار با قفل ردیفی، ترتیب ثابت شناسه و TTL ۱۵ دقیقه؛ الگوی Outbox با `SELECT ... FOR UPDATE SKIP LOCKED`، پس‌زدن نمایی و Dead Letter ([ADR-004](docs/architecture/adr/ADR-004-inventory-reservation-outbox.md)).
- چک‌اوت دوفازی (session → place-order) با آیدمپوتنسی `x-idempotency-key` (scope `ORDER_PLACE`)، بازپخش عین پاسخ اول و `409` برای کلید تکراری با بدنه متفاوت.
- پرداخت‌ها: زرین‌پال با verify سمت سرور (منبع حقیقت تأیید)، کارت‌به‌کارت با ثبت فیش و تایید ادمین، کیف پول داخلی ([ADR-005](docs/architecture/adr/ADR-005-iranian-gateways-and-logistics.md)).
- سفارش با ماشین حالت دامنه، فاکتور رسمی HTML با مالیات ارزش افزوده ۱۰٪ و تاریخچه وضعیت.
- دفترکل دوبل‌اندر متوازن، تراز آزمایشی و اکسپورت سپیدار CSV با BOM ([ADR-002](docs/architecture/adr/ADR-002-zero-float-money-and-ledger.md)).
- استعلام نرخ و رهگیری ارسال (پست پیشتاز، تیپاکس، پیک) ([ADR-005](docs/architecture/adr/ADR-005-iranian-gateways-and-logistics.md)).
- کیف پول تراکنش‌نگار با ردپای منبع؛ نظرات با صف تعدیل ادمین؛ نوتیفیکیشن‌های قالب‌دار مصرف‌کننده Outbox؛ وب‌هک‌های خروجی با امضای HMAC-SHA256؛ آنالیتیکس با کاتالوگ بسته ۵ رویداد بدون PII و قیف چهار مرحله‌ای؛ مرکز استثناهای عملیات (`/v1/ops/exceptions`) با پنج بلوک مستقل.

**رشد — موج W17**
- توصیه‌گر اکتشافی سه‌کاناله سمت سرور (مرتبط‌ها، پرفروش‌ها، «برای شما») با ریل UI در خانه و صفحه محصول ([ADR-006](docs/architecture/adr/ADR-006-heuristic-recommendations.md)).
- علاقه‌مندی و مقایسه سمت کلاینت (localStorage نسخه‌دار، سقف مقایسه ۴ کالا، هم‌گام‌سازی CustomEvent) + صفحه `/search` هم‌وضعیت با URL ([ADR-007](docs/architecture/adr/ADR-007-wishlist-compare-search.md)).
- باشگاه مشتریان امتیازی (۱ امتیاز / ۱۰٬۰۰۰ ریال، سطوح BRONZE/SILVER/GOLD، اجرا در Worker روی `ORDER_PAID`) ([ADR-008](docs/architecture/adr/ADR-008-loyalty-points.md)).
- اشتراک‌های دوره‌ای: پلن و عضویت، اسکن سررسید در Worker و رویداد `SUBSCRIPTION_RENEWAL_DUE` ([ADR-009](docs/architecture/adr/ADR-009-subscriptions.md)).
- درخواست استعلام قیمت عمده B2B با چرخه NEW → IN_REVIEW → QUOTED → CLOSED و سیاست صیانت از سرنخ ([ADR-010](docs/architecture/adr/ADR-010-b2b-quote-requests.md)).
- پنل کاربر `/account` با هفت تب (سفارش‌ها، کیف پول، باشگاه، اشتراک‌ها، دیجیتال، آدرس‌ها، تیکت‌ها).

**موج W18**
- بنیان مارکت‌پلیس فاز ۰: مدل `Vendor` با `commissionBps` برای آینده تسویه، صفحه `/vendors` و `/vendors/[slug]`، نشان فروشنده در کارت و صفحه کالا، مدیریت ادمین ([ADR-011](docs/architecture/adr/ADR-011-vendor-foundation.md)).
- کالای دیجیتال: `kind = PHYSICAL | DIGITAL`، گرنت آیدمپوتنت پس از کپچر (توکن یکتا، سقف دانلود ۵، انقضای ۳۰ روز)، دانلود توکن‌دار با increment شرطی، تب «محصولات دیجیتال من» و دکمه دانلود در رسید ([ADR-012](docs/architecture/adr/ADR-012-digital-goods-grants.md)).

**سخت‌سازی و عملیات**
- محدودسازی نرخ پنجره ثابت per-IP: ۳۰۰ درخواست/دقیقه عمومی و ۱۰ درخواست/دقیقه روی `auth` با پاسخ `429` و هدر `Retry-After` (متغیرهای `RATE_LIMIT_GLOBAL_PER_MIN` / `RATE_LIMIT_AUTH_PER_MIN`).
- شناسه پیگیری `correlationId` سراسری با اینترسپتور و فیلتر خطای استاندارد (بدنه خطای یکدست با `code` و `timestamp`، بدون نشت استک در 500).
- ران‌بوک‌های عملیاتی RB-01 تا RB-06 (پرداخت نامشخص، backlog اوتباکس، رزرو گیرکرده، انتشار و rollback، لو رفتن secret، پشتیبان‌گیری و بازیابی) به‌همراه سند استقرار `docs/deployment/DEPLOYMENT_FA.md`.
- چک‌لیست انتشار گیت‌های A تا L (`docs/architecture/RELEASE_CHECKLIST_FA.md`) و سند مادر معماری `COMMERCE_OS_UNIFIED_SYNTHESIS.md`.

**کیفیت**
- اسکریپت مسیر طلایی `scripts/e2e-golden-path.mjs` با ۱۹ گام (سلامت تا گرنت‌های دیجیتال)؛ SKIP شفاف برای گام‌های وابسته به PostgreSQL.
- ۱۸ تست واحد jest در پنج فایل spec سرویس API (سلامت، سفارش‌ها، اشتراک‌ها، B2B، دیجیتال) + ۳۳ مورد تست vitest در پکیج‌های domain/finance/gateways/localization/security.
- بارسنجی سبک‌وزن بدون وابستگی خارجی `scripts/load-check.mjs` (PASS: موفقیت مؤثر ≥ ۹۰٪ و p95 < ۸۰۰ میلی‌ثانیه، گزارش جداگانه 429).

### Changed

- رفتار نبود دیتابیس از خطای خام به حالت رزیلنت صادقانه: کاتالوگ، جست‌وجو، قیمت‌گذاری، توصیه‌گر، پلن‌های اشتراک، فروشندگان و نوتیفیکیشن‌ها داده دمو با `source: FALLBACK` برمی‌گردانند؛ ماژول‌های دیگر با `dbAvailable: false` پاسخ می‌دهند؛ سرنخ B2B با `{accepted: true, persisted: false}` پذیرفته می‌شود و ثبت عضویت اشتراک با `503` رد می‌شود ([ADR-009](docs/architecture/adr/ADR-009-subscriptions.md)، [ADR-010](docs/architecture/adr/ADR-010-b2b-quote-requests.md)).
- ویترین هرگز داده ساختگی را جایگزین کاتالوگ واقعی نمی‌کند (پیام «کاتالوگ در حال اتصال است» در نبود API).
- شماره نسخه پکیج روت مونوریپو روی `1.0.0` (همین انتشار) تثبیت شد.

### Security

- ممنوعیت مطلق ممیز شناور در محاسبات مالی؛ همه وجوه ریالی با `BigInt`/`Decimal(20,0)` ([ADR-002](docs/architecture/adr/ADR-002-zero-float-money-and-ledger.md)).
- ایزولاسیون مستأجر با اکستنشن پریزما، قیدهای یکتایی ترکیبی `[tenantId, ...]` و الزام هدر `x-tenant-id` روی اندپوینت‌های مالی/ادمین (دفاع BOLA/IDOR) ([ADR-003](docs/architecture/adr/ADR-003-multi-tenancy-isolation.md)).
- رمزنگاری اطلاعات حساس با AES-256-GCM و مقایسه ثابت‌زمان در برابر حملات زمانی.
- فایروال PII در آنالیتیکس (حذف `phone`/`email`/`nationalId`/`cardPan`/`address` در هر عمق) و ممنوعیت نوشتن بدنه درخواست/پاسخ در لاگ‌ها.
- وب‌هک‌های خروجی با امضای HMAC-SHA256 روی بدنه خام و اعتبارسنجی مقصد در برابر SSRF (مسدودسازی شبکه داخلی؛ loopback فقط در توسعه).
- هدرهای امنیتی با helmet و مدیریت نشت خطا (خطای 500 فقط با `correlationId`).
- چرخش secrets و گیت‌های امنیتی انتشار در چک‌لیست A–L (گیت‌های D، E و F).

### Docs

- بازنویسی کامل `README_FA.md` (ویترین صفحات، تب‌های ادمین، ۲۴ ماژول API، وضعیت DB-gated، درخت مونوریپو و جدول ADRها).
- مرجع قراردادهای API (`docs/api/API_CONTRACTS_FA.md`) شامل هدرهای عمومی، قالب خطای استاندارد، Rate Limit و قرارداد متد/مسیر/بدنه/پاسخ همه ماژول‌ها.
- دوازده تصمیم معماری ثبت‌شده: ADR-001 تا ADR-012.
- سند مادر معماری، چک‌لیست انتشار (۱۲ گیت)، شش ران‌بوک RB-01 تا RB-06 و سند استقرار.
- ایجاد این `CHANGELOG.md`.
