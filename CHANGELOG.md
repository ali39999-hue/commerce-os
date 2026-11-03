# Changelog

تمام تغییرات قابل‌توجه Commerce OS در این فایل ثبت می‌شود.

قالب بر پایه [Keep a Changelog](https://keepachangelog.com/) و نسخه‌بندی بر پایه [Semantic Versioning](https://semver.org/) است؛ متن فارسی و سرفصل‌ها مطابق قرارداد لاتین.

---

## [1.2.0] — 2026-11-02

### Added
- **فاز ۹ امنیت و کنترل دسترسی (AUTH-001 تا AUTH-004) — [SECURITY_BASELINE.md](docs/security/SECURITY_BASELINE.md):**
  - **AdminGuard و ورود OTP پنل مدیریت:** احراز هویت دومرحله‌ای پیامکی برای اپراتورها با نقش‌های `SUPER_ADMIN / OPERATOR / ACCOUNTANT`، مسیر سرویس‌به‌سرویس با کلید `x-admin-api-key` (مقایسه timing-safe و خارج از CORS مرورگری) و گیت ورود Warm Clinical در ادمین.
  - **گارد همه نوشتارهای مدیریتی (AUTH-003):** ۱۲ مسیر تغییردهنده (انتقال سفارش، کوپن، تأیید فیش کارت‌به‌کارت به‌عنوان نقطه SoD، ابطال لایسنس، تعدیل امتیاز، تعدیل کیف پول، چرخه اشتراک و وضعیت استعلام B2B) — جریان‌های عمومی خرید دست‌نخورده.
  - **Tenant سرور-محور (AUTH-002 گام ۱):** دکوراتور `@CurrentTenant()`؛ نشست ادمین همیشه tenant پیش‌فرض سرور را می‌گیرد و هدر `x-tenant-id` کلاینت روی مسیرهای گاردشده نادیده گرفته می‌شود.
  - **نشست مشتری و «اشتراک‌های من» (AUTH-002 گام ۲):** `CustomerSessionProvider` با ورود OTP در استورفرانت و `GET /v1/subscriptions/me` که userId را از نشست می‌گیرد، هرگز از URL.
  - **قفل هویت در تسویه‌حساب و پیش‌بارگذاری فرم (AUTH-002 گام ۴ و ۷):** اتصال خودکار اطلاعات نشست به فیلدهای تسویه‌حساب با بنر آگاهی‌رسانی ماسک‌شده PII (`maskIranianMobile`) و ثبت قطعی شماره سفارش بر مبنای هویت تاییدشده نشست.
  - **DTOهای class-validator (AUTH-004):** ۱۳ کلاس DTO روی همه نوشتارهای منبع (checkout، کوپن، کیف پول، سفارش، پرداخت، اشتراک، نظر، B2B) — `whitelist/forbidNonWhitelisted` اکنون واقعاً اجرا می‌شود.
  - **مستندسازی شواهد زمان‌اجرا:** ماتریس ۴۰۱/۲۰۰ و نقشه AUTH بعدی در [SECURITY_BASELINE.md](docs/security/SECURITY_BASELINE.md)؛ فاز ۹ به نقشه راه ([TASKS.md](docs/ui-ux/roadmap/TASKS.md)) افزوده شد.

### Fixed
- **حذف خطای Hydration Mismatch ادمین:** مهرهای زمانی نمونه‌ای که با `Date.now()` در سطح ماژول ارزیابی می‌شدند بین SSR و کلاینت اختلاف ثانیه تولید می‌کردند (`DashboardOverview`، `OpsSystemHealth`، `ClinicalContentManager`، `page.tsx`) — با مهرهای قطعی ISO جایگزین شد.
- **رفع خطای DI گارد ادمین:** `IdentityModule` به `@Global()` تبدیل شد تا `AdminGuard` در همه ماژول‌های ویژگی قابل‌تزریق باشد (هم‌الگوی `DatabaseModule`).

### Verified
- **بازبینی بصری زنده مرورگر:** صفحه اصلی (دسکتاپ + موبایل ۳۶۰px بدون سرریز افقی)، PDP کاربوکسی‌ژل با تست تعاملی گالری Embla (1/4 → 2/4)، سبد و پرداخت با بج‌های اعتبارسنجی، دایرکتوری کلینیک‌ها و داشبورد ERP با بج‌های RBAC.
- **صحت‌سنجی چندلایه پس از هر انتشار:** بیلد ۱۰/۱۰، تست‌های واحد ۱۴/۱۴، چرخه بالینی ۱۰/۱۰، مسیر طلایی ۱۹/۱۹.

---

## [1.1.0] — 2026-11-02

### Added
- **بازطراحی جامع هویت بصری Warm Clinical Minimalism (§3.2, §16):** استقرار پالت گرم آزمایشگاهی کمبریج (`#f7f6f2`، `#ffffff`، `#24594f`، `#dce8df`، `#ede5da`) و حذف صفحات تیره ناهماهنگ در استورفرانت.
- **معماری کتابخانه‌ها و حاکمیت وابستگی‌ها (LIB-001 تا LIB-015):** ثبت سند [DEPENDENCY_ARCHITECTURE.md](docs/ui-ux/design-system/DEPENDENCY_ARCHITECTURE.md) و استقرار `lucide-react`، `embla-carousel-react`، `zod` و `react-hook-form` با پشتیبانی کامل از React 19 و Next.js 16.
- **کامپوننت‌های تعاملی جدید در `@commerce-os/ui`:** ایجاد کامپوننت `ClinicalProductGallery` برای گالری تصاویر محصولات بالینی با پشتیبانی کامل از تاچ RTL و ناوبری کیبورد.
- **انتخاب‌گر مسیر بالینی در صفحه اصلی (`PathSelector`):** هدایت سریع مخاطبان به سه شاخه مراقبت خانگی (ReeSkin)، مصرفی کابین کلینیکال و تجهیزات تخصصی (ReeMed).
- **پنل سفارش سریع در بالای صفحه محصول (Above-The-Fold PDP):** انتخاب بین بسته‌های خانگی (۵ عددی) و حرفه‌ای (۵۰۰ میلی‌لیتر) با فاش‌سازی تدریجی (Progressive Disclosure) هشدارهای بالینی و منع مصرف.
- **ویزارد ۵ مرحله‌ای استعلام B2B کلینیک‌ها (`/b2b`):** جایگزینی فرم طولانی و متراکم قبلی با فرآیند گام‌به‌گام و حفظ کد پیگیری.
- **شبکه مراکز درمانی و کلینیک‌های مجاز (`/vendors`):** ارتقای بخش فروشندگان به دایرکتوری تخصصی کلینیک‌های دارای پروانه با فیلتر شهری، نشانی و تلفن پذیرش.
- **روتینگ کانونیکال محصولات شاخص (`getCanonicalProductHref`):** یکپارچه‌سازی لینک‌های کاتالوگ، مقایسه و علاقه‌مندی‌ها به لندینگ‌های غنی هر محصول.
- **بسته راهنمای ایجنت‌ها ([AGENT_CONTEXT_PACK.md](docs/ui-ux/AGENT_CONTEXT_PACK.md)):** مرجع یکتای قوانین، توکن‌ها و قراردادهای توسعه ایجنتی.

### Changed
- به‌روزرسانی [DESIGN_TOKENS.md](docs/ui-ux/design-system/DESIGN_TOKENS.md) و [COLORS.md](docs/ui-ux/design-system/COLORS.md) با جداول ریاضی کنتراست رنگی WCAG 2.2 AA و AAA.
- ارتقای هدر استورفرانت به ۶ شاخه شفاف و بهینه‌سازی منوی کشویی در موبایل.
- اصلاح جداول و تله‌متری پنل مدیریت ERP با تراز زنده دفتر کل دوبل و پایش صف Outbox.

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
