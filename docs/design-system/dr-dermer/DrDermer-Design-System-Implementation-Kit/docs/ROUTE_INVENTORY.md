# ممیزی جامع مخزن و گزارش مبنا (Baseline Audit & Repository Discovery)
تاریخ: ۲۰۲۶-۱۱-۰۳ | نسخه: ۱.۰.۰
پروژه: Dr Dermer UK Clinical & Commerce OS (Commerce OS)

---

## ۱. مشخصات معماری و فناوری‌های مخزن (Stack & Architecture)
- **Monorepo Manager**: Turborepo 2.11.10 با مدیریت بسته‌های pnpm 12.16.1.
- **Frontend Core**:
  - `apps/storefront`: Next.js 16.4.3 (Turbopack engine), React 19.3.1, TypeScript 5.7, Lucide Icons, Embla Carousel, Sonner Toaster.
  - `apps/admin`: Next.js 16.4.3, React 19.3.1, TailwindCSS / CSS Modules, RBAC & SoD Operations Dashboard.
- **Backend & Persistence**:
  - `apps/api`: NestJS 11, Prisma ORM 7.10.1, PostgreSQL 17 (PGlite WASM / Embedded wire-protocol on 127.0.0.1:5432).
  - `apps/worker`: Outbox processor, background notification dispatcher, reservation sweeper.
- **Core Packages**:
  - `@commerce-os/ui`: کامپوننت‌های بهینه‌شده طراحی با zero-runtime bloat و توکن‌های Warm Clinical Minimalism.
  - `@commerce-os/domain`: قوانین دامنه و محاسبات مالی با Money BigInt IRR (بدون خطای اعشاری floating-point).
  - `@commerce-os/finance`: سیستم حسابداری دوطرفه (Double-entry Ledger) و خروجی فاکتور استاندارد سپیدار با UTF-8 BOM.
  - `@commerce-os/security`: اعتبارسنجی رمزنگاری AES-256-GCM، توابع محافظت‌شده timing-safe و فیلترهای PII.
  - `@commerce-os/localization`: سیستم تقویم جلالی/شمسی، ماژول تبدیل اعداد به حروف و اعتبارسنجی کد ملی/شبا/شتاب.
  - `@commerce-os/gateways`: درگاه‌های پرداخت زرین‌پال، کارت به کارت، و متدهای حمل‌ونقل (پست، تیپاکس، الوپیک).

---

## ۲. نتیجه تست‌ها و سلامت بیلد مبنا (Baseline Test & Build Status)
- **Turbo Test Execution**: ۱۴ تسک موفق از ۱۴ تسک (`14 successful, 14 total`)
  - `@commerce-os/ui`: ۷ تست واحد با Vitest پاس شد (۱۰۰٪ سبز)
  - `@commerce-os/domain`: ۱۵ تست محاسبات ارزی و قیمت‌گذاری پاس شد (۱۰۰٪ سبز)
  - `@commerce-os/security`: ۵ تست امنیتی و رمزنگاری پاس شد (۱۰۰٪ سبز)
  - `@commerce-os/localization`: ۱۷ تست ماژول‌های بومی‌سازی پاس شد (۱۰۰٪ سبز)
  - `@commerce-os/gateways`: ۵ تست گیت‌وی‌های پرداخت پاس شد (۱۰۰٪ سبز)
  - `@commerce-os/finance`: ۸ تست دفتر کل و صدور فاکتور رسمی پاس شد (۱۰۰٪ سبز)
  - `@commerce-os/api`: ۵۵ تست در ۹ سوئیت با Jest پاس شد (Orders, AdminGuard, RateLimit, PIISanitizer, Subscriptions, Digital, B2B, Health, Catalog)
- **Next.js Production Build**:
  - ۴۶ مسیر استاتیک، SSG و دینامیک با ۰ خطا کامپایل شدند.
  - موتور استندالون کپی بسته‌های static/public را در فاز بعد از ساخت با موفقیت اجرا می‌کند.

---

## ۳. ماتریس مسیرها و خانواده‌های مسیریابی (Route Families Matrix)
تمامی ۴۶ مسیر به صورت کاملاً احراز هویت شده و فعال در سیستم حضور دارند:
1. **خانواده Storefront & Commerce**:
   - `/` (Home), `/search` (Faceted Search), `/cart` (Server-authoritative Cart & Drawer), `/checkout` (Multi-step National ID & Tax Invoicing), `/order/[id]` (5-stage Timeline), `/pay/[intentId]`, `/account`, `/wishlist`, `/compare`.
2. **خانواده پایگاه‌های بالینی اختصاصی (Clinical Dedicated Stations)**:
   - `/carboxygel` (شبیه‌ساز اثر بوهر و ترنس‌درمال), `/carboxypod` (سکانس سه‌مرحله‌ای), `/carboxypad` (شیت‌های ۵ زون آناتومیک), `/crystalene` (خمیر آلومینا), `/healene` (ژل سد دفاعی), `/silicalene` (اسکراب دتوکس).
3. **خانواده تجهیزات و سامانه‌های مطبی (Medical Hardware Stations)**:
   - `/carbox` (ایستگاه تزریق دیجیتال با ۳۶۰ درجه), `/plasmax` (سامانه پلاسمای سرد اتمسفری).
4. **خانواده آکادمی و مستندات بالینی (Academy & Clinical Hub)**:
   - `/academy`, `/blog`, `/blog/[slug]` (مقالات با متادیتای رفرنس و ارجاعات DOI/PubMed), `/ingredients` (اطلس جامع مواد مؤثره و کدهای CAS).
5. **خانواده B2B و همکاران تجاری (B2B & Partners Network)**:
   - `/b2b` (فرم ویزارد ۵ مرحله‌ای درخواست نمایندگی/تجهیزات), `/b2b/protocols`, `/b2b/workshops`, `/vendors` (شبکه کلینیک‌های معتبر), `/vendors/[slug]`.
6. **خانواده قوانین، اشتراک‌ها و محتوا (Corporate & Legal)**:
   - `/about`, `/contact`, `/faq`, `/legal`, `/subscriptions`.
