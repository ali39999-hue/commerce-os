# رودمپ جامع تبدیل Commerce OS به فروشگاه جهانی و تجربه برند در سطح Dr Dermer

> **نسخه سند:** 1.0.0  
> **تاریخ تدوین:** 31 اکتبر 2026  
> **مخزن هدف:** https://github.com/ali39999-hue/commerce-os  
> **مرجع تجربه برند و محصول:** https://www.drdermer.co.uk/  
> **نوع سند:** Product Strategy + Technical Roadmap + UI/UX Specification + Repository/Skills Catalog + Agent Execution Contract  
> **وضعیت:** برنامه اجرایی؛ هیچ تسکی با صرف وجود یک فایل یا endpoint، تکمیل‌شده محسوب نمی‌شود.

---

## 0. دستورالعمل استفاده از این سند

این سند باید به‌عنوان مرجع اصلی اجرای پروژه در اختیار Agent یا تیم توسعه قرار گیرد. اجرای کار باید به ترتیب فازها و شناسه تسک‌ها انجام شود.

### قوانین اجرای غیرقابل مذاکره

1. قبل از تغییر کد، وضعیت واقعی همان ماژول، تست‌ها، قرارداد API، مدل Prisma و UI موجود را بررسی کن.
2. هرگز صرفاً بر اساس README نتیجه نگیر که یک قابلیت عملیاتی است. منبع نهایی، کد اجرایی، دیتابیس واقعی، تست و شواهد staging است.
3. هسته فعلی Commerce OS را بی‌دلیل جایگزین نکن. Medusa، Saleor، Vendure و سایر پروژه‌ها در این سند منابع مطالعه و الگو هستند، نه مجوز افزودن یک Commerce Backend موازی.
4. معماری Modular Monolith و مرز چهار اپلیکیشن فعلی (`api`, `storefront`, `admin`, `worker`) حفظ شود؛ استخراج سرویس مستقل فقط با ADR و دلیل اندازه‌گیری‌شده مجاز است.
5. هیچ عملیات مالی، موجودی، سفارش، رزرو یا پرداخت نباید به localStorage یا وضعیت نمایشی مرورگر به‌عنوان منبع حقیقت وابسته باشد.
6. پاسخ Demo/Fallback نباید در محیط Production به‌جای داده واقعی نمایش داده شود. در نبود DB یا Provider، وضعیت باید صادقانه و قابل مشاهده باشد.
7. تمام عملیات مالی و موجودی باید server-authoritative، transactional و idempotent باشند.
8. از Float/Double برای محاسبات پولی استفاده نکن. قواعد Money موجود و ADR-002 حفظ شود و مدل پول چندارزی به‌صورت کنترل‌شده توسعه یابد.
9. هر تسک باید تست متناسب، مستندات، شواهد و معیار پذیرش داشته باشد.
10. قبل از حذف، بازنویسی یا تغییر مهاجرت دیتابیس، وضعیت داده‌های موجود و سازگاری نسخه قبلی بررسی شود.
11. از کپی مستقیم کد یا طراحی دارای مجوز نامشخص خودداری کن. مجوز هر وابستگی و Repository پیش از استفاده بررسی شود.
12. هیچ ادعای پزشکی، بالینی، درمانی یا تضمین نتیجه محصول را بدون منبع معتبر و تأیید مسئول محتوا/رگولاتوری منتشر نکن.
13. تا زمانی که مالک محصول دستور نداده، تغییری را به مخزن اصلی Push یا Release نکن. خروجی را در Branch/PR قابل بازبینی ارائه کن.
14. هر گام با `TASK-ID`, فایل‌های تغییرکرده، نتیجه تست، شواهد و وضعیت نهایی ثبت شود.
15. تسک ناقص را `DONE` نزن. وضعیت‌های مجاز: `TODO`, `IN_PROGRESS`, `BLOCKED`, `IN_REVIEW`, `DONE`, `DEFERRED`.

### تعریف Done برای هر تسک

یک تسک فقط وقتی `DONE` است که تمام موارد مربوط به آن برقرار باشند:

- [ ] نیازمندی محصول و رفتار مورد انتظار روشن است.
- [ ] پیاده‌سازی در لایه صحیح انجام شده است.
- [ ] مسیر موفق و مسیر خطا پوشش داده شده‌اند.
- [ ] تست واحد/یکپارچه/E2E متناسب اضافه و اجرا شده است.
- [ ] حالت Loading، Empty، Error، Disabled و Success در UI بررسی شده است.
- [ ] مجوزها و ایزولاسیون Tenant تست شده‌اند، هرجا که موضوعیت دارد.
- [ ] موبایل، دسکتاپ، RTL/LTR و دسترس‌پذیری بررسی شده‌اند.
- [ ] مستندات API/ADR/Runbook در صورت نیاز به‌روزرسانی شده‌اند.
- [ ] هیچ داده ساختگی، خطای پنهان، `SKIP` ناخواسته یا هشدار بحرانی باقی نمانده است.
- [ ] شواهد قابل بازتولید در PR یا گزارش تسک درج شده‌اند.

---

# بخش اول — شناخت محصول و ممیزی وضعیت موجود

## 1. چشم‌انداز محصول

Commerce OS باید از یک هسته مدیریت تجارت الکترونیک به یک بستر کامل فروش و عملیات تبدیل شود؛ بستری که بتواند فروشگاه مستقیم به مصرف‌کننده (D2C/B2C)، فروش حرفه‌ای/عمده (B2B)، چند برند، چند فروشگاه و چند زبان/بازار را با یک هسته عملیاتی پشتیبانی کند.

### دو لایه محصول

**الف) Commerce Core**

- Multi-Tenant / Multi-Organization / Multi-Store
- Catalog, Product, Variant, SKU, Pricing
- Inventory, Reservations, Warehouses, Fulfillment
- Cart, Checkout, Orders, Payments, Refunds
- Shipping, Tax, Promotions, Coupons
- Ledger, Wallet, Reconciliation
- Customer, Loyalty, Subscription
- Vendor foundations, B2B quote requests, Digital grants
- Admin, Ops Center, Audit, Analytics, Notifications

**ب) Storefront Experience**

- فروشگاه عمومی با تجربه بصری ممتاز
- صفحه اصلی مبتنی بر برند و کمپین
- دسته‌بندی، جست‌وجو، فیلتر و کشف محصول
- صفحه محصول با تصاویر واقعی و جزئیات کامل
- سبد خرید و Checkout کوتاه و قابل اعتماد
- حساب مشتری، سفارش‌ها، مرجوعی و پشتیبانی
- مجله/آموزش/دانشنامه مواد مؤثره
- راهنمای انتخاب محصول و مجموعه‌های پیشنهادی
- صفحه فروش حرفه‌ای و استعلام عمده
- چندزبانگی و چندارزی در صورت فعال‌بودن بازارهای بین‌المللی

### فرض دامنه

با توجه به سایت مرجع Dr Dermer، تجربه نخست فروشگاهی این رودمپ بر محصولات مراقبت پوست، محصولات حرفه‌ای و تجهیزات/راهکارهای زیبایی بنا شده است؛ اما مدل داده و هسته باید عمداً Generic باقی بماند تا برای سایر دسته‌های کالایی هم قابل استفاده باشد. مفاهیم اختصاصی مانند Ingredient، Skin Concern، Treatment Protocol و Clinical Evidence باید در افزونه/بخش محتوای تخصصی محصول تعریف شوند، نه اینکه تمام Product Model را به صنعت زیبایی محدود کنند.

## 2. ممیزی قابل اتکا از مخزن فعلی

این ممیزی از صفحه عمومی GitHub، README فارسی، فایل‌های Raw قابل مشاهده و چند فایل اصلی کد انجام شده است. اجرای محلی، اتصال به دیتابیس، مشاهده محیط Production، تست مرورگر، بررسی تمام فایل‌های مخزن و تأیید تمام ادعاهای README در این مرحله انجام نشده است. بنابراین این بخش «ممیزی منبع عمومی و کد قابل مشاهده» است، نه گزارش تأیید Production.

### 2.1 معماری و تکنولوژی ثبت‌شده

README و فایل‌های Package نشان می‌دهند که ساختار فعلی بر پایه موارد زیر است:

- Monorepo با `pnpm` و `Turborepo`
- Storefront: Next.js 16 / React 19
- API: NestJS 11
- ORM: Prisma 7
- Database: PostgreSQL 17
- Cache/Queue infrastructure: Redis 7 (طبق مستندات پروژه)
- چهار اپلیکیشن: `api`, `storefront`, `admin`, `worker`
- پکیج‌های مشترک: `domain`, `finance`, `security`, `gateways`, `localization`, `ui`
- API شامل ماژول‌های دامنه متنوع مانند Identity, Catalog, Search, Pricing, Inventory, Checkout, Payments, Orders, Ledger, Shipping, Wallet, Outbox, Notifications, Webhooks, Analytics, Ops, Reviews, Recommendations, Loyalty, Subscriptions, B2B, Vendors و Digital
- Prisma Schema در README به‌عنوان دارای ۴۶ مدل معرفی شده است.

این پایه برای توسعه بسیار مناسب‌تر از شروع یک فروشگاه از صفر است؛ اما بزرگ بودن فهرست ماژول‌ها به‌تنهایی نشان‌دهنده بلوغ محصول نیست.

### 2.2 نقاط قوتی که باید حفظ شوند

- مرزهای Modular Monolith و استفاده از Worker مستقل
- Money بدون Float و نگهداری مبلغ در نوع دقیق
- Double-Entry Ledger و اصل ثبت Append-Only
- رزرو موجودی اتمیک با قفل دیتابیس و TTL
- Idempotency در عملیات حساس و Callbackهای پرداخت
- Outbox و Dead Letter برای رویدادها
- جداسازی Tenant و جلوگیری از دسترسی بین مستأجرها
- Adapter Pattern برای Providerهای پرداخت و لجستیک
- API Contracts و ADRهای معماری
- تست Golden Path و Check List انتشار
- پشتیبانی RTL/فارسی، تقویم و اعتبارسنجی‌های محلی

### 2.3 فاصله‌های واقعی مشاهده‌شده

| شناسه | مورد مشاهده‌شده | ریسک/اثر | اقدام لازم |
|---|---|---|---|
| AUD-01 | Home Page هنوز با متن «ویترین نمونه» معرفی می‌شود. | حس Demo و کاهش اعتماد برند | جایگزینی با معماری محتوایی و کمپین واقعی |
| AUD-02 | کارت محصول در صفحه اصلی از حرف اول عنوان و پس‌زمینه رنگی به‌جای تصویر استفاده می‌کند. | ظاهر غیرحرفه‌ای و افت Conversion | مدل رسانه، آپلود، گالری و Image Pipeline |
| AUD-03 | در `layout.tsx` مقدار `robots` روی `index: false` و `follow: false` است. | جلوگیری از ایندکس عمومی | بازبینی متادیتا و فعال‌سازی ایندکس در محیط Production |
| AUD-04 | در صفحه محصول، انتخاب واریانت از `product.variants[0]` انجام می‌شود. | پشتیبانی ناقص از انتخاب واقعی Size/Pack/Volume | پیاده‌سازی Variant Selector و قیمت/موجودی وابسته به واریانت |
| AUD-05 | در Prisma Schema بررسی‌شده، مدل دقیق `ProductImage` پیدا نشد. | احتمال نبود مدل مشخص برای تصاویر محصول | ابتدا هر مدل Asset/Media موجود را بررسی؛ سپس در صورت نبود، ProductMedia اضافه شود |
| AUD-06 | `apps/admin/app/page.tsx` حدود ۲۴۸۳ خط و چند تب و منطق مختلف را در یک صفحه متمرکز کرده است. | نگهداری سخت، تست دشوار و UX ناهمگون | استخراج Feature Module، Route و Component مستقل |
| AUD-07 | بخش Coupon در Admin صراحتاً local demo state دارد. | ایجاد تغییرات نمایشی بدون Persist واقعی | API و دیتابیس واقعی برای Promotion/Coupon و حذف دمو از Production |
| AUD-08 | چند بخش Admin در خطا/عدم دسترسی API از Demo Fallback استفاده می‌کنند. | اشتباه گرفتن داده نمونه با وضعیت عملیاتی | تفکیک واضح `LIVE`, `DEMO`, `UNAVAILABLE`; Production فقط LIVE یا Error شفاف |
| AUD-09 | Vendor fetch دارای `storeSlug=demo` است. | وابستگی به Tenant نمونه | انتخاب Store از Session/Context معتبر و حذف مقدار hard-coded |
| AUD-10 | Package مربوط به Storefront اسکریپت اختصاصی `test` یا `lint` ندارد. | نبود گیت مستقل برای کیفیت اپ فروشگاه | اضافه‌کردن Typecheck/Lint/Unit/Component/E2E به Pipeline |
| AUD-11 | Package مربوط به Storefront در manifest بررسی‌شده، Tailwind و UI Workspace Package را Dependency نکرده است. | احتمال تکرار UI و CSS بدون Design System مشترک | ارزیابی `packages/ui` فعلی و اتصال تدریجی آن؛ انتخاب نهایی ابزار با ADR |
| AUD-12 | `globals.css` در Storefront بسیار بزرگ و حدود ۱۷۳۶ خط است. | دشواری کنترل تغییرات و خطر UI Drift | تقسیم به Tokens, Base, Layout, Components, Features و حذف CSS مرده |
| AUD-13 | صفحه اصلی `dynamic = 'force-dynamic'` است. | عدم استفاده از Cache Strategy دقیق و احتمال هزینه/زمان بیشتر | Cache/Revalidation بر اساس نوع داده و رویداد تغییر محصول |
| AUD-14 | README، سند معماری و Footer نسخه‌های متفاوتی (۱.۰.۰/۲.۰) نشان می‌دهند. | ابهام در نسخه واقعی و انتشار | Semantic Versioning، Release Notes و منبع واحد Version |
| AUD-15 | README مسیر Golden Path را در PGlite موفق اعلام می‌کند، اما نبود DB واقعی را با Fallback/SKIP توضیح می‌دهد. | سبز بودن تست محلی به‌اشتباه معادل Production تلقی شود | Release Gate روی PostgreSQL/Redis واقعی در محیط Staging؛ صفر SKIP |
| AUD-16 | چک‌لیست انتشار خود پروژه ناسازگاری `CORS origin: true` با Production را یادآور شده است. | ریسک امنیتی Cross-Origin | Origin Allowlist و تست منفی CORS قبل از انتشار |

### 2.4 اولویت فوری ممیزی

**P0 — قبل از توسعه قابلیت‌های جدید:**

1. بررسی `robots` و metadata محیط Production.
2. قطع مسیرهای Demo/Fallback از Production و برچسب‌گذاری صحیح وضعیت‌ها.
3. بررسی `CORS_ORIGINS`، TLS، secrets و پورت‌های DB/Redis.
4. راستی‌آزمایی سفارش، پرداخت، Ledger و موجودی با PostgreSQL/Redis واقعی.
5. بررسی Store/Tenant Context و حذف `demo` hard-coded.
6. گرفتن Baseline از Lighthouse، Accessibility و Playwright برای مسیرهای موجود.

**P1 — بیشترین اثر روی تجربه فروش:**

1. تصویر و Asset واقعی محصول.
2. صفحه اصلی برندمحور و فروش‌محور.
3. صفحه دسته‌بندی و Search/Filter.
4. Product Detail کامل و انتخاب Variant.
5. Cart/Checkout یکپارچه و قابل اعتماد.
6. تفکیک و بازطراحی Admin و مدیریت محتوا.

---

## 3. بررسی سایت مرجع Dr Dermer

### 3.1 الگوهایی که باید از آن الهام گرفته شوند

- **برندمحوری:** سایت فقط یک Grid از کالا نیست؛ ابتدا فناوری، برند و محصول شاخص را معرفی می‌کند.
- **خانواده برندها/محصولات:** خطوطی مانند ReeSkin و ReeMed و بخش Academy به تفکیک مخاطب و کاربرد کمک می‌کنند.
- **روایت علمی محصول:** CarboxyGel دارای محتوای توضیحی، اصل علمی، مکانیزم اثر و محتوای مرتبط است.
- **محتوای محصول:** CarboxyPod انواع محصول را با تفاوت کاربرد، ترکیبات اصلی و نتیجه مورد انتظار تفکیک می‌کند.
- **ترکیب فروش و آموزش:** پیوند محصول، مقاله، روش استفاده و CTA باعث می‌شود مخاطب قبل از خرید اطلاعات بیشتری بگیرد.
- **حساب مشتری:** مسیرهای Dashboard، Orders، Addresses، Account Details و Wishlist در سایت دیده می‌شوند.
- **راه‌های ارتباط:** Contact Us، تلفن، ایمیل و آدرس فیزیکی به ساخت اعتماد کمک می‌کنند.
- **محصولات مکمل و پروتکل:** CarboxyGel و CarboxyPod/Pad را می‌توان به‌عنوان اجزای مکمل یک تجربه یا پروتکل معرفی کرد.

### 3.2 ضعف‌هایی که نباید کپی شوند

در صفحات بررسی‌شده چند محتوای Placeholder، متن نامرتبط و بخش Lorem Ipsum دیده می‌شود؛ همچنین صفحه تماس ایمیل تکراری دارد. این‌ها نباید در طراحی نهایی بازتولید شوند.

- هیچ عنوان آزمایشی مانند `Layer 2`, `Slide 1 Heading` یا متن Dummy نباید در Production ظاهر شود.
- هیچ بخش صفحه‌ای نباید صرفاً برای پر کردن فضای بصری ایجاد شود.
- ادعاهای درمانی، بالینی یا «نتیجه قابل مشاهده از جلسه اول» باید مستند، بررسی و تأیید شوند؛ متن مرجع را بدون بررسی علمی/قانونی منتقل نکن.
- موقعیت، کشور، اطلاعات تماس، سیاست ارسال و شرایط فروش باید با شرکت و بازار واقعی هماهنگ باشند.
- صفحه محصول باید به خرید واقعی برسد؛ CTA نمایشی یا دکمه بدون عملیات واقعی قابل قبول نیست.

### 3.3 تبدیل الگوی مرجع به ساختار بهتر

| مفهوم مرجع | پیاده‌سازی پیشنهادی در Commerce OS |
|---|---|
| Brand / Product family | Brand، Collection، Product Line و Navigation مستقل |
| معرفی فناوری | Campaign/Editorial Landing با Media، Evidence و CTA |
| اصل علمی / Mechanism | محتوای ساختاریافته، منبع/ارجاع، نویسنده و تاریخ بازبینی |
| Key Ingredients | Ingredient Index و رابطه ProductIngredient |
| پروتکل یا مجموعه مکمل | Regimen/Kit/Bundle با سازگاری و قوانین فروش |
| محصولات مصرف‌کننده | B2C Storefront |
| محصولات کلینیکی/حرفه‌ای | Professional Portal و B2B Inquiry |
| مقالات و آموزش | Editorial CMS، Blog و Knowledge Center |
| حساب و Wishlist | Account Center متصل به Backend |
| Contact | Contact/Support/Distributor/Store Locator |

---

# بخش دوم — تجربه هدف، طراحی و ساختار صفحات

## 4. اصول UX و Visual Direction

### 4.1 شخصیت بصری پیشنهادی

جهت هنری پیشنهادی برای فروشگاه مراقبت پوست/محصولات تخصصی:

- Clinical Premium: دقیق، علمی، آرام و باکیفیت؛ نه سرد و شبیه داشبورد بیمارستانی.
- Product-led: عکس محصول و اطلاعات مهم باید اولویت بصری داشته باشند.
- Editorial: فضاهای سفید، تایپوگرافی واضح و محتوای عمیق برای توضیح محصولات.
- Trust-first: اصالت، مجوز، ترکیبات، دستور مصرف، ارسال، بازگشت و پشتیبانی در دسترس.
- Accessible: کنتراست مناسب، اندازه متن قابل خواندن، Keyboard Navigation و Focus State.
- Responsive-first: طراحی موبایل از ابتدا، نه تبدیل یک Desktop Page به Mobile.

### 4.2 پیشنهاد Design Tokens

این مقادیر صرفاً نقطه شروع طراحی‌اند و باید با Brand Workshop و تست کنتراست تثبیت شوند:

| توکن | پیشنهاد اولیه | استفاده |
|---|---|---|
| `color.canvas` | `#F7F6F2` | پس‌زمینه عمومی |
| `color.surface` | `#FFFFFF` | کارت و پنل |
| `color.ink` | `#202A28` | متن اصلی |
| `color.muted` | `#66736F` | متن ثانویه |
| `color.brand` | سبز/تیل عمیق و قابل تنظیم | CTA و نشانه برند |
| `color.accent` | برنز/طلایی محدود | Highlight و Accent |
| `color.border` | خاکستری گرم روشن | جداکننده‌ها |
| `radius.card` | 16–24px | کارت |
| `radius.control` | 10–14px | کنترل‌ها |
| `space.*` | مقیاس 4/8/12/16/24/32/48/64 | فاصله‌گذاری |

قواعد:

- برای هر وضعیت (success/error/warning/info) رنگ معنایی مجزا داشته باش.
- رنگ Accent را برای همه دکمه‌ها استفاده نکن؛ CTA اصلی باید واضح و محدود باشد.
- فونت فارسی و لاتین را جداگانه تست کن؛ Vazirmatn یا فونت دارای مجوز مناسب برای فارسی و یک Sans مدرن برای لاتین.
- فایل‌های فونت را در صورت self-hosting فقط با مجوز معتبر وارد کن.
- RTL و LTR باید از همان Design Tokens و Component API پشتیبانی شوند.

### 4.3 قواعد Component Design

- همه Buttonها اندازه، نوع، حالت و رفتار مشخص داشته باشند.
- Input دارای Label، Hint، Error و Disabled State باشد.
- Card نباید برای هر بخش یک Style جدید و بی‌قاعده داشته باشد.
- Dialog، Drawer، Popover و Menu باید با Keyboard و Screen Reader کار کنند.
- Toast جای پیام دائمی خطا یا نتیجه مالی را نمی‌گیرد.
- Skeleton فقط در زمان بارگذاری استفاده شود؛ داده قدیمی نباید به‌اشتباه Loading نشان داده شود.
- Empty State باید اقدام بعدی واضح ارائه کند.
- Product Card و Product Detail در همه صفحات از یک Component Contract استفاده کنند.
- تمام صفحات باید Header، Navigation، Breadcrumb، Footer و Responsive Behavior هماهنگ داشته باشند.

### 4.4 Navigation Architecture

**Header Desktop**

- Promo strip قابل مدیریت از Admin/CMS
- Brand Logo
- دسته‌ها / برندها / محصولات تخصصی / مجله / درباره ما
- Search Predictive
- Account / Wishlist / Cart
- انتخاب زبان و کشور/ارز در بازارهای چندگانه

**Header Mobile**

- لوگو
- Search trigger
- Cart count
- Menu drawer
- Sticky CTA در صورت نیاز (بدون پوشاندن محتوای اصلی)

### 4.5 ساختار پیشنهادی Homepage

1. Announcement Bar: پیشنهاد ارسال، کمپین یا خبر معتبر.
2. Hero Campaign: یک پیام مشخص، تصویر اصلی باکیفیت، CTA اصلی و CTA ثانویه.
3. Trust Indicators: ارسال، اصالت/کیفیت، پشتیبانی، پرداخت امن؛ فقط موارد واقعی.
4. Shop by Concern/Need: مسیر کشف محصول بر اساس نیاز کاربر.
5. Featured Product/Technology: محصول یا فناوری شاخص همراه توضیح کوتاه.
6. Best Sellers / New Arrivals: کالاهای قابل خرید واقعی.
7. Product Families: سری‌ها و مجموعه‌های مکمل.
8. Science/Ingredient Spotlight: لینک به محتوای معتبر و قابل بررسی.
9. How to Use / Routine: راهنمای انتخاب و استفاده.
10. Professional/Wholesale CTA: اگر فروش حرفه‌ای فعال است.
11. Editorial/Blog: مقاله‌های مفید و مرتبط.
12. Reviews/Testimonials: فقط بازخورد واقعی با سیاست اعتبارسنجی.
13. Newsletter/CRM Consent: رضایت صریح و مدیریت لغو عضویت.
14. Footer کامل: تماس، ارسال، مرجوعی، حریم خصوصی، شرایط، شبکه اجتماعی.

### 4.6 صفحه Category / Collection

- عنوان، توضیح و تصویر دسته
- Filter Facets: برند، نوع محصول، قیمت، موجودی، Concern، Ingredient، نوع مصرف
- Sort: مرتبط‌ترین، پرفروش، جدید، قیمت کم/زیاد، امتیاز
- شمارش نتایج و فیلترهای فعال
- حذف فیلترها و حفظ وضعیت در URL
- Pagination یا Load More قابل دسترس و قابل Crawl
- Product Card با تصویر واقعی، قیمت، تخفیف معتبر، Review Count، Stock Status، Quick Add
- Editorial intro یا FAQ در صورت ارزش SEO
- Canonical و Metadata منحصر به صفحه

### 4.7 صفحه محصول (PDP) — اولویت بسیار بالا

**بخش بالای صفحه**

- Breadcrumb
- Product Gallery با چند تصویر، Zoom و ویدئو در صورت وجود
- Product Title و Brand
- Rating و Review Count واقعی
- Summary با 3 تا 5 نکته مشخص و قابل اثبات
- Variant/Size/Pack Selector
- قیمت جاری، قیمت قبل و وضعیت تخفیف
- موجودی و زمان ارسال تخمینی واقعی
- Quantity Selector
- Add to Cart / Buy Now
- Wishlist
- SKU/Barcode فقط در صورت ارزش برای کاربر

**بخش توضیحات عمیق**

- معرفی و کاربرد
- برای چه کسانی/چه نیازهایی مناسب است؟ (با تأیید علمی/محتوایی)
- ترکیبات و Ingredient Breakdown
- دستور مصرف و دفعات استفاده
- هشدارها، محدودیت‌ها، موارد احتیاط
- حجم/وزن/ابعاد/کشور سازنده
- گواهی‌ها و مدارک معتبر
- روش نگهداری و تاریخ/Batch در صورت نیاز
- روش/پروتکل پیشنهادی و محصولات مکمل
- FAQ محصول
- Reviews با Verified Purchase
- مقالات مرتبط
- محصولات مشابه و مکمل

**قواعد مهم**

- انتخاب Variant باید قیمت، SKU، موجودی، تصویر و شناسه خرید را با هم تغییر دهد.
- محصول ناموجود CTA مناسب (Notify Me/Back in Stock) داشته باشد.
- تخفیف، قیمت مرجع و ادعای موجودی از Server API گرفته شوند.
- برای محصولات پزشکی/تخصصی متن و هشدار تأییدنشده منتشر نشود.
- JSON-LD محصول فقط از داده واقعی و سازگار با صفحه ساخته شود.

### 4.8 Cart و Checkout

**Cart**

- بازبینی کالا، واریانت، تعداد، قیمت، تخفیف
- محاسبه قیمت سرورساید
- هزینه ارسال/مالیات با توضیح
- Coupon و Loyalty Wallet در صورت مجاز بودن
- Cross-sell منطقی و محدود
- حفظ سبد برای کاربر واردشده
- بازیابی سبد مهمان با Merge امن پس از ورود

**Checkout**

- Guest Checkout در صورت سیاست کسب‌وکار
- Address Form با اعتبارسنجی کشور/منطقه
- Shipping Options و زمان تحویل
- Invoice/Tax details در صورت نیاز
- Payment Method و نمایش شفاف مبلغ نهایی
- خلاصه سفارش در تمام مراحل
- حفظ شناسه Idempotency در درخواست Place Order
- نتیجه پرداخت با وضعیت Pending/Success/Failure/Unknown شفاف
- راهکار Recover برای پرداخت نامشخص، بدون ثبت سفارش تکراری
- رسید نهایی، ایمیل/پیامک و صفحه Order Tracking

### 4.9 Account Center

- Overview
- Orders / Order Details / Invoice
- Shipment Tracking
- Return / Refund Requests
- Addresses
- Profile / Security / Sessions
- Wishlist / Recently Viewed
- Loyalty / Wallet
- Subscriptions
- Digital Products (در صورت فعال بودن)
- Support Tickets
- Consent & Privacy Settings

### 4.10 محتوای تخصصی و Editorial

- Brand Story
- Technology/Science Landing Pages
- Ingredient Dictionary
- Concern/Need Guides
- Product Routine/Regimen
- How-to Articles
- FAQs
- Professional Education / Academy
- Downloads: Instructions, IFU, Safety Data, Certificates در صورت مناسب بودن
- Author, Reviewer, Sources, Last Reviewed Date

هر مقاله تخصصی باید Content Owner، نویسنده/بازبین، تاریخ بازبینی، منابع و وضعیت Publish داشته باشد.

---

# بخش سوم — معماری و توسعه دامنه

## 5. راهبرد معماری

### 5.1 تصمیم اصلی

**معماری هدف: Modular Monolith در Monorepo فعلی؛ نه مهاجرت فوری به Microservices.**

دلایل:

- هسته مالی و عملیات در حال حاضر نیازمند تراکنش‌های هماهنگ است.
- Outbox و Worker برای مرزهای غیرهمزمان کافی‌اند.
- استخراج Microservice هزینه عملیاتی، تراکنش توزیع‌شده، Observability و Deployment را بالا می‌برد.
- ابتدا باید UX و Domain Contracts تثبیت شوند.

استخراج سرویس فقط زمانی مجاز است که حداقل یکی از این موارد با داده اثبات شود: مقیاس مستقل، نیاز SLA متفاوت، مالکیت تیمی مستقل، محدودیت تکنولوژی واقعی یا bottleneck عملیاتی.

### 5.2 ساختار هدف پیشنهادی مخزن

این ساختار یک هدف طراحی است؛ قبل از جابه‌جایی فایل‌ها ساختار واقعی را مقایسه کن و از تکرار Package موجود جلوگیری کن.

```text
commerce-os/
├── apps/
│   ├── api/
│   │   ├── src/modules/
│   │   │   ├── identity/
│   │   │   ├── tenants/
│   │   │   ├── catalog/
│   │   │   ├── product-content/
│   │   │   ├── media/
│   │   │   ├── search/
│   │   │   ├── pricing/
│   │   │   ├── promotions/
│   │   │   ├── inventory/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── shipping/
│   │   │   ├── tax/
│   │   │   ├── returns/
│   │   │   ├── customers/
│   │   │   ├── reviews/
│   │   │   ├── content/
│   │   │   ├── b2b/
│   │   │   ├── loyalty/
│   │   │   ├── subscriptions/
│   │   │   ├── analytics/
│   │   │   ├── notifications/
│   │   │   ├── outbox/
│   │   │   └── ops/
│   │   ├── common/
│   │   └── prisma/
│   ├── storefront/
│   │   ├── app/[locale]/
│   │   │   ├── (marketing)/
│   │   │   ├── (catalog)/
│   │   │   ├── products/[slug]/
│   │   │   ├── collections/[slug]/
│   │   │   ├── search/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── account/
│   │   │   ├── orders/[id]/
│   │   │   ├── journal/
│   │   │   ├── ingredients/[slug]/
│   │   │   ├── professionals/
│   │   │   └── legal/
│   │   ├── features/
│   │   │   ├── catalog/
│   │   │   ├── product-detail/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── account/
│   │   │   └── search/
│   │   ├── components/
│   │   ├── lib/
│   │   └── messages/
│   ├── admin/
│   │   ├── app/
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   ├── catalog/
│   │   │   ├── media-library/
│   │   │   ├── orders/
│   │   │   ├── inventory/
│   │   │   ├── promotions/
│   │   │   ├── customers/
│   │   │   ├── content/
│   │   │   ├── payments/
│   │   │   ├── shipping/
│   │   │   ├── returns/
│   │   │   ├── analytics/
│   │   │   └── operations/
│   │   └── components/
│   └── worker/
├── packages/
│   ├── domain/
│   ├── finance/
│   ├── security/
│   ├── gateways/
│   ├── localization/
│   ├── ui/
│   ├── contracts/       # اگر قرارداد مشترک فعلی وجود ندارد
│   ├── config/          # eslint/tsconfig/design tokens در صورت نیاز
│   └── testing/         # test fixtures/helpers در صورت نیاز
├── docs/
│   ├── architecture/
│   ├── product/
│   ├── design/
│   ├── api/
│   ├── runbooks/
│   ├── adr/
│   └── roadmaps/
├── .agents/skills/
├── scripts/
└── tests/
    ├── e2e/
    ├── contracts/
    └── performance/
```

### 5.3 قانون مالکیت لایه‌ها

- `apps/storefront`: نمایش، تعامل کاربر، Navigation و Data Fetching؛ منطق قیمت و موجودی مرجع در Backend باقی بماند.
- `apps/admin`: رابط ادمین؛ منطق تجاری در API و Shared Domain.
- `apps/api`: اعتبارسنجی درخواست، مجوز، orchestration و API Contract.
- `apps/worker`: Outbox، Jobها، Expiration، Reconciliation و عملیات زمان‌بر.
- `packages/domain`: Money، Value Object، State Machine، Policyهای مستقل از Framework.
- `packages/finance`: Ledger و محاسبات/گزارش مالی.
- `packages/gateways`: قرارداد Providerها و Adapterهای پرداخت/حمل.
- `packages/security`: Crypto و ابزارهای امنیتی بدون وابستگی UI.
- `packages/localization`: Locale/Calendar/Format/Validation.
- `packages/ui`: Primitive و Componentهای مشترک، بدون Domain Logic.

---

## 6. توسعه مدل داده (PIM + DAM + Product Knowledge)

### 6.1 Product Information Management (PIM)

مدل فعلی Product/Variant/SKU حفظ شود و با داده‌های موردنیاز فروش حرفه‌ای تکمیل گردد.

**موجودیت‌های پیشنهادی**

- `Brand`
- `Collection`
- `Product`
- `ProductVariant`
- `SKU`
- `ProductCategory` / `CategoryTree`
- `ProductAttributeDefinition`
- `ProductAttributeValue`
- `ProductMedia`
- `ProductDocument`
- `ProductTranslation`
- `ProductRelation` (related/complementary/alternative)
- `ProductBundle` / `BundleItem`
- `ProductAvailability`
- `ProductPublication`
- `ProductSEO`

**Product Media**

در صورت نبود Media Model قابل استفاده، مدل پیشنهادی:

- `id`, `tenantId`, `storeId`, `productId`, `variantId?`
- `assetId` یا object key امن
- `role`: HERO, GALLERY, LIFESTYLE, DETAIL, HOW_TO, CERTIFICATE
- `sortOrder`
- `altText` برای هر Locale
- `width`, `height`, `mimeType`, `fileSize`, `checksum`
- `isPrimary`, `publishedAt`, `createdBy`

Assetها در Object Storage نگهداری شوند؛ فایل باینری در دیتابیس ذخیره نشود.

### 6.2 مدل محتوای تخصصی مراقبت پوست

این بخش باید Extension Domain باشد، نه اجبار برای تمام کالاها.

- `Ingredient`
- `ProductIngredient` (INCI Name، درصد در صورت افشای مجاز، نقش، ترتیب)
- `SkinConcern`
- `ProductConcern`
- `SkinType`
- `ProductSkinType`
- `UsageInstruction`
- `UsageStep`
- `ProductWarning`
- `ProductClaim`
- `ClaimEvidence`
- `ClinicalStudyReference` (در صورت وجود و تأیید)
- `Certification`
- `ProductCertification`
- `TreatmentProtocol`
- `ProtocolProduct`
- `ProfessionalDocument`

**قواعد انتشار محتوا**

- هر Claim وضعیت `DRAFT`, `REVIEW_REQUIRED`, `APPROVED`, `REJECTED`, `EXPIRED` داشته باشد.
- هر منبع/مدرک Owner و تاریخ بررسی داشته باشد.
- ادعای درمانی بدون Evidence و تأیید مسئول مجاز، قابل Publish نباشد.
- Ingredients باید با استاندارد نام‌گذاری مناسب صنعت نگهداری شوند و Localization متن نمایشی را از نام استاندارد جدا کند.

### 6.3 DAM — مدیریت رسانه

- Upload مستقیم با Signed URL
- بررسی MIME واقعی و Signature فایل
- محدودیت اندازه، رزولوشن و نوع فایل
- Virus/Malware Scan در صورت فعال بودن آپلود عمومی
- تولید Thumbnail و Responsive Variants
- CDN و Cache-Control
- حذف منطقی و Retention برای Assetهای مورد استفاده
- Alt Text اجباری برای تصویر معنادار
- WebP/AVIF در صورت پشتیبانی Pipeline
- منع URL خارجی کنترل‌نشده برای تصاویر محصول

### 6.4 چندزبانگی و چندارزی

- داده‌های ترجمه‌شده با مدل Locale مستقل از متن اصلی.
- Locale در URL یا Route Segment مشخص باشد.
- `fa`, `en` و بازارهای بعدی مانند `ar` صرفاً پس از آماده‌سازی محتوا فعال شوند.
- واحد پایه پول فعلی و ADR-002 حفظ شود؛ برای چندارزی مدل Money باید Currency Code و Scale/Minor Unit هر ارز را درست مدیریت کند.
- نرخ تبدیل دارای Source، Timestamp، Validity و Audit باشد.
- Currency نمایش با Currency قابل پرداخت یکی فرض نشود.
- تبدیل تومان/ریال و ارزهای خارجی نباید با Float انجام شود.
- زبان، کشور، ارز، منطقه مالیات و روش ارسال به‌صورت Context بازار تعریف شوند.

---

## 7. قراردادهای API موردنیاز

نام نهایی Routeها باید با `API_CONTRACTS_FA.md` موجود هماهنگ شود؛ موارد زیر نقشه دامنه‌اند و الزاماً نام قطعی endpoint نیستند.

### Storefront/Public

- `GET /v1/storefront/home`
- `GET /v1/catalog/products`
- `GET /v1/catalog/products/:slug`
- `GET /v1/catalog/collections/:slug`
- `GET /v1/search/suggest`
- `GET /v1/search`
- `GET /v1/ingredients/:slug`
- `GET /v1/content/pages/:slug`
- `GET /v1/content/articles/:slug`
- `GET /v1/shipping/estimate`

### Cart/Checkout

- `POST /v1/carts`
- `GET /v1/carts/:id`
- `POST /v1/carts/:id/items`
- `PATCH /v1/carts/:id/items/:itemId`
- `DELETE /v1/carts/:id/items/:itemId`
- `POST /v1/carts/:id/discounts`
- `POST /v1/checkout/sessions`
- `POST /v1/checkout/sessions/:id/validate`
- `POST /v1/checkout/place-order` (idempotency required)

### Account/Customer

- `GET /v1/customers/me`
- `PATCH /v1/customers/me`
- `GET /v1/customers/me/orders`
- `GET /v1/customers/me/addresses`
- `POST /v1/customers/me/addresses`
- `GET /v1/customers/me/wishlist`
- `POST /v1/customers/me/returns`
- `GET /v1/customers/me/returns`
- `GET /v1/customers/me/tickets`

### Product Admin/PIM/DAM

- CRUD Products, Variants, SKUs, Brands, Collections, Attributes
- CRUD Media Assets and ProductMedia links
- Draft/Preview/Publish/Archive transitions
- Bulk Import/Export with dry-run and error report
- Media processing status
- Content Review and Approval

### Operations

- Promotions/Coupons CRUD with server validation
- Inventory adjustments and transfer workflow
- Shipment labels and tracking webhooks
- Payment reconciliation
- Return/refund workflow
- Audit logs and operations exceptions

### قرارداد عمومی API

- Pagination استاندارد و محدودیت حداکثر Page Size
- Query Validation و Allowlist برای Sort/Filter
- Error Envelope یکپارچه با `correlationId`
- `x-idempotency-key` برای عملیات مالی/غیرقابل تکرار
- Tenant Context از Session/Authorization، نه اعتماد به Header خام
- OpenAPI/Contract test برای تمام Routeهای عمومی
- Rate Limit بر اساس مسیر و هویت
- Cache-Control صحیح برای داده عمومی و شخصی

---

# بخش چهارم — رودمپ فازبندی‌شده و تسک‌های اجرایی

## 8. فاز 00 — Baseline، Audit و برنامه اجرایی

**هدف:** تعیین وضعیت واقعی، حذف ریسک انتشار و ایجاد معیار اندازه‌گیری.

**وابستگی:** ندارد.  
**خروجی:** Audit Report، Baseline Metrics، Dependency Map، Risk Register.

### Tasks

- [ ] `P00-001` دریافت Branch/Commit دقیق مبنا و ثبت SHA.
- [ ] `P00-002` نصب وابستگی‌ها با Lockfile فعلی؛ عدم ارتقای خودکار Major Version.
- [ ] `P00-003` اجرای Build همه Workspaceها و ثبت خطاها.
- [ ] `P00-004` اجرای Lint و Typecheck موجود و مستندسازی شکاف‌ها.
- [ ] `P00-005` اجرای تست‌های API و Packages.
- [ ] `P00-006` اجرای Golden Path روی PGlite و جداگانه روی PostgreSQL/Redis واقعی.
- [ ] `P00-007` بررسی Migration Strategy؛ تشخیص `db push` در برابر migrate deploy و تثبیت روش Production.
- [ ] `P00-008` بررسی CORS، CSP، TLS، Cookie، CSRF، Rate Limit و Secret Management.
- [ ] `P00-009` بررسی تمام `FALLBACK`, `DEMO`, `SKIP`, `storeSlug=demo` و hard-coded API origins.
- [ ] `P00-010` بررسی Metadata/robots/canonical/sitemap/robots.txt.
- [ ] `P00-011` فهرست Routes واقعی از روی کد و مقایسه با README.
- [ ] `P00-012` فهرست Endpoints واقعی از روی کد و مقایسه با API Contracts.
- [ ] `P00-013` مدل‌های Prisma موجود را با PIM/DAM موردنیاز مقایسه کن.
- [ ] `P00-014` ثبت شاخص Lighthouse موبایل برای Home، Category، PDP، Cart و Checkout.
- [ ] `P00-015` ثبت وضعیت Accessibility با axe/Lighthouse و تست Keyboard.
- [ ] `P00-016` ثبت خروجی Network، JS Errors و API Errors در مسیر خرید.
- [ ] `P00-017` ثبت ۱۰ ریسک اصلی فنی و تجاری با Owner و Priority.
- [ ] `P00-018` ساخت GitHub Project Board شامل Phase، Task ID، Status، Owner، Evidence و Blocker.

**Acceptance Gate**

- Build، Typecheck، تست‌های موجود و خطاهای شناخته‌شده مستند باشند.
- Production-like Golden Path بدون SKIP اجرا شود یا دقیقاً مشخص باشد کدام Dependency/Flow هنوز مانع است.
- همه موارد Demo/Fallback و Noindex شناسایی و به Task تبدیل شده باشند.
- Baseline قابل مقایسه برای قبل/بعد وجود داشته باشد.

## 9. فاز 01 — Product Discovery، برند و Information Architecture

**هدف:** روشن‌کردن فروشگاه واقعی و ساختار دسته‌بندی‌ها، بدون قفل‌کردن هسته برای یک صنعت.

### Tasks

- [ ] `P01-001` تعریف Personaهای B2C، Professional، Distributor و Admin.
- [ ] `P01-002` تعریف JTBD و سناریوهای خرید اصلی.
- [ ] `P01-003` تعریف دسته‌ها، Brandها، Product Lineها و Collectionها.
- [ ] `P01-004` طبقه‌بندی Product Type: Physical, Digital, Bundle, Service/Appointment (در صورت نیاز).
- [ ] `P01-005` تعریف Concern/Need taxonomy برای Vertical مراقبت پوست.
- [ ] `P01-006` تعریف Attributeهای مشترک و تخصصی و Variant dimensionها.
- [ ] `P01-007` تفکیک اطلاعات اجباری محصول، اطلاعات اختیاری و اطلاعات محرمانه/داخلی.
- [ ] `P01-008` تعریف Content Lifecycle: Draft → Review → Approved → Scheduled → Published → Archived.
- [ ] `P01-009` تعریف صفحه‌های اصلی و Navigation Tree.
- [ ] `P01-010` تهیه User Flow برای Search-to-Purchase، Campaign-to-Purchase، Routine-to-Bundle و B2B Inquiry.
- [ ] `P01-011` تحلیل رقبا و الگوهای بازار بدون تقلید بصری مستقیم.
- [ ] `P01-012` تعریف لحن برند، واژگان ممنوع، قواعد ادعای علمی و راهنمای محتوای محصول.
- [ ] `P01-013` تعریف KPI تجاری و Event Dictionary.
- [ ] `P01-014` تأیید Scope نسخه اول فروشگاه و فهرست Deferred.

**Acceptance Gate:** Sitemap، Taxonomy، Persona، User Flow و Content Model توسط مالک محصول تأیید شوند.

## 10. فاز 02 — Design System و معماری UI

**هدف:** ساخت زبان طراحی واحد برای Storefront و Admin.

### Tasks

- [ ] `P02-001` ممیزی `packages/ui` فعلی و تعیین آنچه قابل استفاده/بازنویسی است.
- [ ] `P02-002` تدوین Design Tokens برای Color, Type, Space, Radius, Shadow, Motion, Z-index.
- [ ] `P02-003` طراحی Typography فارسی/لاتین و تست عدد/متن ترکیبی.
- [ ] `P02-004` تعریف Breakpoints و Container Widthها.
- [ ] `P02-005` پیاده‌سازی Button, Link, IconButton, Input, Select, Checkbox, Radio, Textarea.
- [ ] `P02-006` پیاده‌سازی Dialog, Drawer, Popover, Tooltip, Tabs, Accordion, Toast.
- [ ] `P02-007` پیاده‌سازی Badge, Skeleton, EmptyState, ErrorState, LoadingState.
- [ ] `P02-008` پیاده‌سازی ProductCard, Price, Rating, StockBadge, QuantitySelector.
- [ ] `P02-009` پیاده‌سازی Header, Navigation, Breadcrumb, Footer.
- [ ] `P02-010` تعریف Component Variants و عدم استفاده از Style پراکنده.
- [ ] `P02-011` اضافه‌کردن Storybook یا مستند Component Gallery.
- [ ] `P02-012` تست RTL/LTR و Dark/Light فقط در صورت نیاز برند.
- [ ] `P02-013` تست WCAG 2.2 AA و Keyboard Navigation.
- [ ] `P02-014` تهیه Screenshot Baseline برای Desktop/Tablet/Mobile.

**Acceptance Gate:** همه Primitiveها در Storybook/Showcase قابل استفاده، قابل دسترس و Responsive باشند.

## 11. فاز 03 — PIM/DAM و مدیریت داده محصول

**هدف:** محصول از «عنوان + قیمت» به محتوای کامل و قابل فروش تبدیل شود.

### Tasks

- [ ] `P03-001` بررسی Asset/Media Model موجود و جلوگیری از مدل موازی.
- [ ] `P03-002` طراحی Migration افزایشی برای ProductMedia و Asset، در صورت نیاز.
- [ ] `P03-003` پیاده‌سازی Object Storage Adapter و Signed Upload.
- [ ] `P03-004` پیاده‌سازی File Validation، Image Metadata و Safe MIME Detection.
- [ ] `P03-005` تولید Thumbnail و Responsive Variants.
- [ ] `P03-006` تعریف Roleهای تصویر: Hero, Gallery, Lifestyle, Detail, How-to.
- [ ] `P03-007` ثبت Alt Text به ازای Locale.
- [ ] `P03-008` توسعه Product Attribute System و Filterable Facets.
- [ ] `P03-009` توسعه Brand و Collection با ترجمه و SEO.
- [ ] `P03-010` افزودن Product Translation و SEO metadata.
- [ ] `P03-011` افزودن Ingredient/Concern/Usage/Warning در صورت فعال بودن Vertical.
- [ ] `P03-012` افزودن Claims و Evidence Review Workflow.
- [ ] `P03-013` افزودن Product Relation و Bundle/Regimen.
- [ ] `P03-014` پیاده‌سازی Variant Selector Backend Contract.
- [ ] `P03-015` Import/Export CSV/XLSX با Dry-run، خطای ردیفی و Rollback کنترل‌شده.
- [ ] `P03-016` تعریف Preview محصول قبل از Publish.
- [ ] `P03-017` تعریف Version/History برای تغییر محتوای محصول.
- [ ] `P03-018` تست Tenant Isolation برای تمام رکوردهای PIM/DAM.

**Acceptance Gate:** مدیر بتواند یک محصول کامل با چند تصویر، چند Variant، محتوا، فایل و ترجمه بسازد و آن را بدون دست‌کاری دیتابیس منتشر کند.

## 12. فاز 04 — Storefront Shell و Homepage

**هدف:** تبدیل ویترین نمونه به Homepage برندمحور و واقعی.

### Tasks

- [ ] `P04-001` جایگزینی عنوان/متن Demo در Hero و Footer.
- [ ] `P04-002` اصلاح Metadata و robots بر اساس محیط؛ Index در Production عمومی فعال باشد.
- [ ] `P04-003` ساخت Promo Bar قابل مدیریت از Admin.
- [ ] `P04-004` بازطراحی Header Desktop/Mobile و Navigation.
- [ ] `P04-005` ساخت Search Trigger/Overlay/Autocomplete.
- [ ] `P04-006` ساخت Hero CMS-driven با Image, CTA, Focal Point و Responsive Asset.
- [ ] `P04-007` ساخت Trust Bar فقط با ادعاهای واقعی.
- [ ] `P04-008` ساخت Category/Concern Discovery.
- [ ] `P04-009` ساخت Featured Product و Product Family Sections.
- [ ] `P04-010` اتصال Best Sellers/New Arrivals به API واقعی.
- [ ] `P04-011` ساخت Editorial/Science Highlight.
- [ ] `P04-012` ساخت Reviews/Testimonials فقط با داده معتبر.
- [ ] `P04-013` ساخت Newsletter با Consent و Unsubscribe.
- [ ] `P04-014` بازطراحی Footer و لینک‌های حقوقی/پشتیبانی.
- [ ] `P04-015` تعریف Cache/ISR و Revalidation برای Homepage Sections.
- [ ] `P04-016` تست Image Optimization و LCP.
- [ ] `P04-017` تست Responsive در عرض‌های 360، 390، 768، 1024، 1440 و 1920.

**Acceptance Gate:** Homepage بدون Demo Text، با داده واقعی و تصاویر بهینه، قابل ویرایش از پنل، سریع و Responsive باشد.

## 13. فاز 05 — Catalog، Category، Search و Discovery

### Tasks

- [ ] `P05-001` ساخت Category Landing Page.
- [ ] `P05-002` ساخت Product Listing Page.
- [ ] `P05-003` اتصال Facetها به Attribute/Concern/Brand.
- [ ] `P05-004` Sync فیلترها و Sort با URL.
- [ ] `P05-005` پیاده‌سازی Search Suggestion، Typo Tolerance و Synonyms.
- [ ] `P05-006` تعریف Search Ranking Rules و Merchandising.
- [ ] `P05-007` پشتیبانی از نرمال‌سازی فارسی، عربی، نیم‌فاصله و اعداد.
- [ ] `P05-008` Highlight نتیجه و نمایش No Result/Spell Suggestion.
- [ ] `P05-009` ثبت Search Analytics بدون PII.
- [ ] `P05-010` Wishlist و Compare با Sync امن در زمان Login.
- [ ] `P05-011` Recently Viewed با محدودیت و حریم خصوصی.
- [ ] `P05-012` حفظ SEO برای Collection و Pagination.
- [ ] `P05-013` تست بار Search و تعداد نتایج زیاد.

**Acceptance Gate:** کاربر بتواند با کلمه دقیق، بخشی از نام، مترادف و فیلتر به محصول واقعی برسد و URL قابل اشتراک باشد.

## 14. فاز 06 — Product Detail Page و Content Commerce

### Tasks

- [ ] `P06-001` ساخت Product Gallery واقعی با Next/Image.
- [ ] `P06-002` نمایش تمام تصاویر و ترتیب Media.
- [ ] `P06-003` انتخاب Variant و همگام‌سازی قیمت/SKU/موجودی/تصویر.
- [ ] `P06-004` نمایش قیمت، تخفیف، Tax/Shipping note و Availability.
- [ ] `P06-005` Add to Cart واقعی با Pending/Success/Error.
- [ ] `P06-006` Product Description با Rich Content کنترل‌شده.
- [ ] `P06-007` نمایش ویژگی‌ها و جدول Specs.
- [ ] `P06-008` Ingredient List با Link به Ingredient Page.
- [ ] `P06-009` Usage Guide، Warnings و FAQ.
- [ ] `P06-010` نمایش Certification/Documentation معتبر.
- [ ] `P06-011` Related/Complementary Products.
- [ ] `P06-012` Bundle/Routine Builder و بررسی سازگاری محصولات.
- [ ] `P06-013` Reviews و Verified Purchase.
- [ ] `P06-014` Back-in-stock notification.
- [ ] `P06-015` JSON-LD Product/Offer/Breadcrumb/Review از داده معتبر.
- [ ] `P06-016` Canonical و Metadata یکتا.
- [ ] `P06-017` تست Deep Link و Variant URL قابل اشتراک.
- [ ] `P06-018` تست Accessibility Gallery، Variant Selector و CTA.

**Acceptance Gate:** تمام اطلاعات قابل فروش و انتخاب Variant از سرور واقعی بیاید؛ Product Page باید برای جست‌وجو و خرید آماده باشد.

## 15. فاز 07 — Cart، Checkout و Order Journey

### Tasks

- [ ] `P07-001` تعیین Cart Authority: Backend مرجع نهایی و Client فقط نمایش/Optimistic State.
- [ ] `P07-002` Cart Guest با Cart ID امن و TTL مشخص.
- [ ] `P07-003` Merge Cart پس از ورود بدون Duplicate.
- [ ] `P07-004` Revalidate Price/Stock/Coupon در هر mutation حساس.
- [ ] `P07-005` Shipping Estimate در Cart/Checkout.
- [ ] `P07-006` Address UX برای بازارهای پشتیبانی‌شده.
- [ ] `P07-007` Guest Checkout و Auth Gate بر اساس Policy.
- [ ] `P07-008` ایجاد Checkout Session سرورساید با Snapshot قیمت.
- [ ] `P07-009` ثبت `x-idempotency-key` و کنترل Body Fingerprint.
- [ ] `P07-010` تست Double Click و Network Retry.
- [ ] `P07-011` Payment Redirect/Return/Callback امن.
- [ ] `P07-012` مدیریت Payment UNKNOWN و Reconciliation.
- [ ] `P07-013` Order Confirmation و Invoice.
- [ ] `P07-014` Shipment Tracking Timeline.
- [ ] `P07-015` ایمیل/پیامک وضعیت سفارش از Outbox.
- [ ] `P07-016` تست همزمانی آخرین موجودی و Zero Oversell.
- [ ] `P07-017` تست Cancel/Partial Refund/Full Refund.
- [ ] `P07-018` تست Checkout موبایل با اتصال ضعیف و بازگشت از درگاه.

**Acceptance Gate:** خرید کامل از Home یا Product تا Paid/Order/Inventory/Ledger/Notification با PostgreSQL/Redis واقعی، بدون سفارش تکراری و بدون Oversell انجام شود.

## 16. فاز 08 — Customer Account، Service و Retention

### Tasks

- [ ] `P08-001` بازطراحی Account Dashboard.
- [ ] `P08-002` اتصال واقعی Orders/Invoices.
- [ ] `P08-003` اتصال Shipment Tracking.
- [ ] `P08-004` Address CRUD با Default Address و Validation.
- [ ] `P08-005` Wishlist Sync.
- [ ] `P08-006` Recently Viewed.
- [ ] `P08-007` Return Request و وضعیت بررسی.
- [ ] `P08-008` Refund History.
- [ ] `P08-009` Support Ticket و Attachment امن.
- [ ] `P08-010` Consent Preferences.
- [ ] `P08-011` Session Management و خروج از نشست‌های دیگر.
- [ ] `P08-012` Loyalty Dashboard با تاریخچه تراکنش امتیاز.
- [ ] `P08-013` Subscription UI فقط در صورت Provider و Recurring Flow واقعی.
- [ ] `P08-014` Notification Preferences.

**Acceptance Gate:** کاربر پس از خرید، وضعیت سفارش، ارسال، بازگشت، پشتیبانی و تنظیمات شخصی خود را بدون تماس دستی مدیریت کند.

## 17. فاز 09 — CMS، Editorial و Brand Experience

### Tasks

- [ ] `P09-001` انتخاب مدل Content: CMS داخلی در NestJS یا Payload/Directus؛ تصمیم با ADR و تحلیل تیم محتوا.
- [ ] `P09-002` ساخت Page Builder با Blockهای محدود و امن.
- [ ] `P09-003` ساخت Blog/Article Lifecycle.
- [ ] `P09-004` Brand Story Page.
- [ ] `P09-005` Technology/Science Landing.
- [ ] `P09-006` Ingredient Dictionary.
- [ ] `P09-007` Concern Guide.
- [ ] `P09-008` Product Routine/Regimen Content.
- [ ] `P09-009` Author/Reviewer/Source/Reviewed Date.
- [ ] `P09-010` Internal Linking بین مقاله، ماده مؤثره و محصول.
- [ ] `P09-011` Preview، Scheduling، Revision و Rollback محتوا.
- [ ] `P09-012` SEO metadata و Social Preview.
- [ ] `P09-013` Rich Media و Video Poster.
- [ ] `P09-014` محتوای چندزبانه با Workflow ترجمه.

**Acceptance Gate:** تیم محتوا بتواند صفحه، مقاله و محتوای علمی را مدیریت کند بدون آنکه برای تغییر متن روزمره به Developer نیاز داشته باشد.

## 18. فاز 10 — B2B، Professional و Distributor Portal

### Tasks

- [ ] `P10-001` تعریف Roleهای Professional/Clinic/Distributor.
- [ ] `P10-002` ثبت درخواست همکاری با تأیید دستی.
- [ ] `P10-003` نمایش Price List مخصوص مشتری B2B.
- [ ] `P10-004` MOQ، Pack Size و Quantity Break Pricing.
- [ ] `P10-005` Quote Request و Quote Version.
- [ ] `P10-006` Approval و Expiry پیش‌فاکتور.
- [ ] `P10-007` Order from Quote.
- [ ] `P10-008` Customer-specific Terms/Credit Policy فقط با کنترل مالی.
- [ ] `P10-009` Sales Representative Assignment.
- [ ] `P10-010` Distributor/Clinic Resource Library.
- [ ] `P10-011` B2B Order History و Reorder.
- [ ] `P10-012` تست Tenant/Role/Price Isolation.

**Acceptance Gate:** مشتری حرفه‌ای فقط قیمت/کاتالوگ و اسناد مجاز خود را ببیند و Quote به Order قابل تبدیل باشد.

## 19. فاز 11 — Admin/ERP Operations و بازآرایی UI

### Tasks

- [ ] `P11-001` تفکیک Admin Monolithic Page به Layout، Feature Page و Component.
- [ ] `P11-002` تعریف Navigation و Permission-aware Menu.
- [ ] `P11-003` داشبورد با KPI و Source Label.
- [ ] `P11-004` Catalog/Product Management.
- [ ] `P11-005` Media Library.
- [ ] `P11-006` Orders Workspace.
- [ ] `P11-007` Payment Review/Reconciliation.
- [ ] `P11-008` Inventory/Transfer/Adjustment.
- [ ] `P11-009` Promotion/Coupon CRUD متصل به API.
- [ ] `P11-010` Customer 360 با Permission و PII Masking.
- [ ] `P11-011` Content CMS.
- [ ] `P11-012` Return/Refund Management.
- [ ] `P11-013` Vendor/Professional Account Management.
- [ ] `P11-014` Audit Log با Search/Filter/Export.
- [ ] `P11-015` Operations Exception Center.
- [ ] `P11-016` Bulk Actions با Confirm و Preview.
- [ ] `P11-017` حذف `alert()`/`confirm()`های نامناسب و جایگزینی با Dialog/Toast استاندارد.
- [ ] `P11-018` Loading/Error/Empty و Permission State برای همه تب‌ها.
- [ ] `P11-019` تست Admin در ابعاد Desktop، Tablet و Mobile.

**Acceptance Gate:** هیچ بخش عملیاتی وابسته به Demo state نباشد؛ هر عملیات دارای Permission، Audit، Feedback و API واقعی باشد.

## 20. فاز 12 — Localization، Internationalization و Market Expansion

### Tasks

- [ ] `P12-001` معماری Locale-aware Routing.
- [ ] `P12-002` Localeهای فعال اولیه را با مالک محصول مشخص کن.
- [ ] `P12-003` ترجمه Navigation، Product, Category و Editorial.
- [ ] `P12-004` پشتیبانی کامل RTL/LTR.
- [ ] `P12-005` فرمت تاریخ/عدد/ارز با Intl و تست منطقه‌ای.
- [ ] `P12-006` Currency Context و Scale-aware Money.
- [ ] `P12-007` Market/Region Context.
- [ ] `P12-008` Shipping Zone و Delivery Rules.
- [ ] `P12-009` Tax Configuration با تنظیمات حوزه قضایی و بازبینی متخصص.
- [ ] `P12-010` آدرس بین‌المللی و Phone Validation.
- [ ] `P12-011` Language/Currency Selector.
- [ ] `P12-012` Currency/Price Snapshot در Order.
- [ ] `P12-013` Exchange Rate Source/History در صورت تبدیل.
- [ ] `P12-014` hreflang، Localized Sitemap و Canonical.

**Acceptance Gate:** کاربر کشور/زبان پشتیبانی‌شده را انتخاب کند و قیمت، مالیات، ارسال، متن و Checkout با همان Market سازگار باشد.

## 21. فاز 13 — SEO، Analytics، CRO و Growth

### Tasks

- [ ] `P13-001` رفع Noindex ناخواسته در Production.
- [ ] `P13-002` Metadata و Canonical برای تمام Routeهای Indexable.
- [ ] `P13-003` Product/Offer/Breadcrumb/Article/Organization JSON-LD.
- [ ] `P13-004` Sitemap Segment برای Products/Collections/Articles.
- [ ] `P13-005` Robots Policy برای Search, Account, Cart, Checkout و Query Spam.
- [ ] `P13-006` Image SEO و Alt Text.
- [ ] `P13-007` Internal Links و Breadcrumb.
- [ ] `P13-008` Search Console و Analytics Verification.
- [ ] `P13-009` Consent-aware Analytics و حذف PII.
- [ ] `P13-010` Event Funnel: view_item → search → add_to_cart → begin_checkout → purchase.
- [ ] `P13-011` Attribution و Campaign Tracking با سیاست حفظ حریم خصوصی.
- [ ] `P13-012` Experiment Framework برای CTA/Content/Checkout.
- [ ] `P13-013` Core Web Vitals Dashboard.
- [ ] `P13-014` Monitor 404/Redirect/Canonical Errors.

**Acceptance Gate:** صفحات قابل فروش ایندکس شوند؛ Funnel رویدادها با سفارش واقعی تطبیق داشته باشد و Analytics داده حساس ذخیره نکند.

## 22. فاز 14 — Security، Privacy و Compliance

### Tasks

- [ ] `P14-001` Threat Model برای Storefront/API/Admin/Worker.
- [ ] `P14-002` بررسی OWASP ASVS و OWASP Top 10.
- [ ] `P14-003` تست BOLA/IDOR روی تمام Tenant-scoped Endpoints.
- [ ] `P14-004` تست CSRF/CORS/CSP/Cookie/SameSite.
- [ ] `P14-005` Rate Limit روی Auth/Search/Checkout/Review/Upload.
- [ ] `P14-006` SSRF Protection برای Webhook/URL import/External Images.
- [ ] `P14-007` Secret Scan و Dependency Scan در CI.
- [ ] `P14-008` Encryption Key Rotation Runbook.
- [ ] `P14-009` PII minimization و retention schedule.
- [ ] `P14-010` Cookie/Consent/Privacy Workflow برای بازارهای فعال.
- [ ] `P14-011` Payment data: عدم ذخیره PAN/CVV و استفاده از Hosted/Tokenized Provider Flow.
- [ ] `P14-012` Admin MFA و Session Revocation برای عملیات حساس.
- [ ] `P14-013` Audit Trail برای تغییر قیمت، سفارش، موجودی، بازپرداخت و Permission.
- [ ] `P14-014` Upload Malware Scan و Access Control.
- [ ] `P14-015` Abuse/Spam/Review Moderation controls.
- [ ] `P14-016` تأیید Claims/Device/Skincare Regulations برای بازار هدف با متخصص مربوطه.

**Acceptance Gate:** تمام موارد بحرانی امنیتی رفع شوند؛ نتیجه اسکن و تست منفی در Release Evidence ثبت شود.

## 23. فاز 15 — Testing، Accessibility و Performance

### Test Pyramid

- Unit: Domain/Policy/Money/Discount/Variant/Tax/Shipping.
- Integration: API + PostgreSQL + Redis + Worker.
- Contract: API DTO/OpenAPI/Provider Adapter.
- Component: Cart/PDP/Checkout/Search/Account.
- E2E: خرید واقعی در Staging، پرداخت Sandbox و Refund.
- Visual Regression: Home/PDP/PLP/Cart/Checkout/Admin.
- Load: Search/Read-heavy/Checkout/Inventory concurrency.
- Security: Tenant isolation, auth, SSRF, XSS, CSRF, Rate Limit.

### Tasks

- [ ] `P15-001` ایجاد Playwright projects برای Chromium و WebKit؛ Firefox در CI یا Nightly.
- [ ] `P15-002` ایجاد fixtureهای پایدار Tenant/Store/Product/Variant.
- [ ] `P15-003` ایجاد Test Data مستقل و قابل پاک‌سازی.
- [ ] `P15-004` تست Golden Purchase.
- [ ] `P15-005` تست Coupon/Discount/Shipping/Tax.
- [ ] `P15-006` تست out-of-stock و concurrency.
- [ ] `P15-007` تست payment callback duplicate و unknown state.
- [ ] `P15-008` تست refund/return.
- [ ] `P15-009` تست Responsive.
- [ ] `P15-010` تست axe Accessibility روی صفحات مهم.
- [ ] `P15-011` Lighthouse CI برای Routeهای حساس.
- [ ] `P15-012` Visual Snapshot در viewportهای استاندارد.
- [ ] `P15-013` k6 Load Test برای Search و Checkout.
- [ ] `P15-014` DB migration test از نسخه قبلی به نسخه جدید.
- [ ] `P15-015` حذف flaky test و تعریف Retry محدود.
- [ ] `P15-016` تست No Demo/Fallback در Production Build.

### اهداف عملکرد اولیه

این اعداد هدف محصول‌اند و باید با Baseline و بودجه زیرساخت نهایی شوند:

- LCP: حداکثر 2.5s در صدک 75 کاربران واقعی.
- INP: حداکثر 200ms در صدک 75.
- CLS: حداکثر 0.1 در صدک 75.
- API Read endpoints: هدف p95 زیر 500ms در بار توافق‌شده.
- Search Suggestion: هدف p95 زیر 300ms در بار توافق‌شده.
- Checkout: بدون Double Submit و با نتیجه قابل بازیابی در خطاهای شبکه.
- Bundle Regression: افزایش بیش از 10% نیازمند تحلیل و تأیید.

**Acceptance Gate:** تمام مسیرهای حیاتی E2E روی DB/Redis واقعی سبز باشند؛ هیچ SKIP ناخواسته وجود نداشته باشد؛ Core Web Vitals و Accessibility دارای گزارش باشند.

## 24. فاز 16 — Deployment، Observability و Release

### Tasks

- [ ] `P16-001` جداکردن Environmentهای Local/CI/Staging/Production.
- [ ] `P16-002` Health/Liveness/Readiness برای هر اپ.
- [ ] `P16-003` Structured Logging با Correlation ID.
- [ ] `P16-004` OpenTelemetry Traces برای Checkout/Payment/Worker.
- [ ] `P16-005` Metrics برای Queue lag، DLQ، payment unknown، reservation expiry، order conversion.
- [ ] `P16-006` Error Monitoring در Storefront/Admin/API.
- [ ] `P16-007` Alert برای Outbox backlog و Payment/Order anomalies.
- [ ] `P16-008` Backup/Restore تست‌شده برای PostgreSQL.
- [ ] `P16-009` Redis persistence/eviction policy بر اساس نوع داده.
- [ ] `P16-010` Deployment Rollback و DB Migration Safety.
- [ ] `P16-011` CDN/Cache Invalidation برای Media و Product Content.
- [ ] `P16-012` Smoke Test پس از Deploy.
- [ ] `P16-013` Release Checklist و Sign-off Owner.
- [ ] `P16-014` Runbook برای Payment Unknown، Stock mismatch، Queue backlog، DB outage و Media outage.

**Acceptance Gate:** Deploy قابل ردیابی و برگشت‌پذیر باشد؛ Alertها تست شده باشند؛ Backup قابل Restore باشد.

## 25. فاز 17 — Launch، Optimization و توسعه 30/60/90 روزه

### Launch Checklist

- [ ] Catalog واقعی و تصاویر تاییدشده بارگذاری شده‌اند.
- [ ] قیمت، تخفیف، مالیات، ارسال و موجودی از Backend می‌آیند.
- [ ] روش پرداخت واقعی یا Sandbox اعلام‌شده و کامل تست شده است.
- [ ] Shipping Provider و Tracking تایید شده‌اند.
- [ ] سیاست مرجوعی، حریم خصوصی و شرایط فروش واقعی و بازبینی‌شده‌اند.
- [ ] تمام صفحات مهم Metadata و Sitemap معتبر دارند.
- [ ] Noindex فقط روی Routeهای خصوصی/ممنوع اعمال شده است.
- [ ] Mobile checkout واقعی با چند نوع دستگاه تست شده است.
- [ ] پشتیبانی و Operations آماده پاسخ‌گویی هستند.
- [ ] مانیتورینگ و Alert روی Production فعال و تست شده است.
- [ ] Feature Flag و Rollback plan آماده است.
- [ ] محتوای دمو/Placeholder/Lorem Ipsum در کل سایت صفر است.

### 30 روز اول

- بررسی Search Queries بدون نتیجه
- بررسی Drop-off در Cart/Checkout
- بررسی عملکرد تصویر و CDN
- بررسی شکایت/مرجوعی/نارضایتی
- رفع مشکلات P0/P1 بر اساس داده واقعی

### 60 روز اول

- بهبود Ranking Search
- توسعه Bundle/Routine و Cross-sell
- بهبود صفحات Category و Ingredient/Concern
- تست A/B محدود و قابل بازگشت
- بهینه‌سازی Loyalty/CRM در صورت نیاز

### 90 روز اول

- ارزیابی بازار/کشور جدید
- بررسی B2B Portal و Distributor Flow
- ارزیابی Search Engine جداگانه بر اساس حجم و Latency
- بهینه‌سازی عملیات و Automation
- تصمیم‌گیری برای استخراج Service مستقل فقط با شواهد

---

# بخش پنجم — KPI و معیارهای محصول

## 26. KPIهای فروشگاه

| KPI | تعریف | منبع |
|---|---|---|
| Conversion Rate | سفارش موفق / Session واجدشرایط | Analytics + Orders |
| Add-to-Cart Rate | Add to Cart / Product Views | Event Funnel |
| Checkout Completion | Orders Paid / Checkout Started | Checkout + Payment |
| Search Success | Search session منتهی به Product View/Add to Cart | Search Analytics |
| Zero Result Rate | جست‌وجوی بدون نتیجه / کل جست‌وجو | Search |
| Product Data Completeness | محصولات Publish شده با فیلدهای لازم / کل محصولات Publish | PIM |
| Image Coverage | محصولات دارای تصویر اصلی معتبر / محصولات Publish | DAM |
| Return Rate | سفارش مرجوعی / سفارش تحویل‌شده | OMS |
| Payment Failure Rate | Payment Failed / Payment Attempts | Payments |
| Inventory Accuracy | انطباق projection با ledger | Inventory Reconciliation |
| Support First Response | زمان اولین پاسخ | Tickets |
| Core Web Vitals | LCP/INP/CLS | RUM/CrUX |

## 27. Event Dictionary پیشنهادی

تمام Eventها باید Versioned و بدون PII باشند:

- `view_home`
- `view_collection`
- `view_item_list`
- `select_item`
- `view_item`
- `view_ingredient`
- `search_submitted`
- `search_suggestion_selected`
- `filter_applied`
- `add_to_wishlist`
- `add_to_compare`
- `add_to_cart`
- `remove_from_cart`
- `begin_checkout`
- `add_shipping_info`
- `add_payment_info`
- `purchase`
- `refund`
- `generate_lead`

شناسه‌های مشتری، شماره تماس، ایمیل، آدرس، کارت و اطلاعات پزشکی/حساس نباید وارد Event Payload شوند.

---

# بخش ششم — Repository Reference Catalog

این فهرست برای **مطالعه الگو و استفاده هدفمند** است. الزام به نصب همه آن‌ها وجود ندارد. قبل از هر استفاده، آخرین Commit، License، Security Policy، Maintenance Status و سازگاری نسخه بررسی شود.

## 28. Commerce Engines و Storefront References

| # | Repository | کاربرد مشخص در Commerce OS | محل/فاز مطالعه |
|---:|---|---|---|
| 1 | [medusajs/medusa](https://github.com/medusajs/medusa) | مدل ماژولار تجارت، Cart/Order/Payment/Workflow و Provider Boundary | فاز 05 تا 11؛ فقط الگو |
| 2 | [medusajs/dtc-starter](https://github.com/medusajs/dtc-starter) | D2C storefront و جریان فروش مستقیم | فاز 04 تا 08 |
| 3 | [medusajs/b2b-starter](https://github.com/medusajs/b2b-starter) | قیمت‌گذاری و UX عمده‌فروشی | فاز 10 |
| 4 | [medusajs/medusa-agent-skills](https://github.com/medusajs/medusa-agent-skills) | Skillهای عامل برای الگوهای Medusa؛ مطالعه، نه افزودن Medusa | فاز 00 و Agent Skills |
| 5 | [saleor/saleor](https://github.com/saleor/saleor) | Commerce API، Channel، Pricing و Order Domain | فاز 05، 07، 10 |
| 6 | [saleor/storefront](https://github.com/saleor/storefront) | Next.js App Router storefront reference | فاز 04 تا 08 |
| 7 | [saleor/saleor-dashboard](https://github.com/saleor/saleor-dashboard) | الگوی عملیات و مدیریت کاتالوگ | فاز 11 |
| 8 | [vendurehq/vendure](https://github.com/vendurehq/vendure) | NestJS-based commerce، plugin boundaries، B2B/stock/order | فاز 03، 07، 10 |
| 9 | [vendurehq/nextjs-starter-vendure](https://github.com/vendurehq/nextjs-starter-vendure) | ترکیب Next.js و Backend commerce | فاز 04 تا 08 |
| 10 | [vercel/commerce](https://github.com/vercel/commerce) | Next.js commerce patterns، provider abstraction و streaming | فاز 04 تا 08 |
| 11 | [Shopify/hydrogen](https://github.com/Shopify/hydrogen) | Product/Collection/Search/Cart/Markets و Agent Skillهای commerce | فاز 04 تا 08؛ مطالعه UX/Flow |
| 12 | [ever-co/ever-shop](https://github.com/ever-co/ever-shop) | پلتفرم فروشگاهی TypeScript و مدل‌های commerce | فاز 03 تا 11 |
| 13 | [spree/spree](https://github.com/spree/spree) | Product/Variant/Promotion/Order/Storefront domain | فاز 03، 07، 11 |
| 14 | [Sylius/Sylius](https://github.com/Sylius/Sylius) | Commerce Domain، Channel و extensibility | فاز 03، 10 |
| 15 | [woocommerce/woocommerce](https://github.com/woocommerce/woocommerce) | الگوهای فروشگاهی، کوپن، سفارش و تنظیمات Merchant | فاز 07، 11 |
| 16 | [PrestaShop/PrestaShop](https://github.com/PrestaShop/PrestaShop) | مدیریت محصول/موجودی/تخفیف و عملیات فروشگاه | فاز 03، 11 |
| 17 | [magento/magento2](https://github.com/magento/magento2) | مقایسه Domainهای Enterprise و Multi-Store | فاز 03، 10، 11 |
| 18 | [shopware/shopware](https://github.com/shopware/shopware) | تجربه Catalog/Promotion/Content Commerce | فاز 05، 09، 11 |

**قانون انتخاب:** از این دسته فقط Pattern و UX استخراج شود. هسته Commerce OS فعلاً با هیچ‌یک جایگزین نشود.

## 29. Frontend، Design System و Interaction

| # | Repository | کاربرد مشخص | محل استفاده |
|---:|---|---|---|
| 19 | [vercel/next.js](https://github.com/vercel/next.js) | App Router، Server Components، Metadata، Cache/Rendering | کل Storefront |
| 20 | [vercel/turborepo](https://github.com/vercel/turborepo) | Task Pipeline و Cache در Monorepo | ریشه پروژه |
| 21 | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | Component recipes قابل مالکیت و شخصی‌سازی | `packages/ui` |
| 22 | [radix-ui/primitives](https://github.com/radix-ui/primitives) | Accessible primitives برای Dialog/Popover/Tabs | `packages/ui` |
| 23 | [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | Utility styling در صورت انتخاب تیم | تدریجی در UI؛ نه بازنویسی یک‌باره |
| 24 | [storybookjs/storybook](https://github.com/storybookjs/storybook) | مستندسازی و تست بصری Component | `packages/ui` |
| 25 | [lucide-icons/lucide](https://github.com/lucide-icons/lucide) | Icon language یکپارچه | UI |
| 26 | [motiondivision/motion](https://github.com/motiondivision/motion) | Micro-interaction و Motion با رعایت Reduced Motion | Homepage/Product transitions |
| 27 | [adobe/react-spectrum](https://github.com/adobe/react-spectrum) | الگوهای Accessibility و Interaction | فاز 02، 15 |
| 28 | [ariakit/ariakit](https://github.com/ariakit/ariakit) | Accessible Composite Widgets | فاز 02 |
| 29 | [floating-ui/floating-ui](https://github.com/floating-ui/floating-ui) | Positioning Tooltip/Popover/Menu | UI |
| 30 | [TanStack/table](https://github.com/TanStack/table) | Data Grid/Table برای Admin | فاز 11 |
| 31 | [dnd-kit/docs](https://github.com/clauderic/dnd-kit) | Drag-and-drop برای ترتیب Media/Content | فاز 03، 09، 11 |
| 32 | [heroui-inc/heroui](https://github.com/heroui-inc/heroui) | مطالعه Component API و Design System | مقایسه پیش از تصمیم UI |

## 30. State، Forms، Validation، Routing و i18n

| # | Repository | کاربرد مشخص | محل استفاده |
|---:|---|---|---|
| 33 | [TanStack/query](https://github.com/TanStack/query) | Server State و Cache در Client Components لازم | Storefront/Admin |
| 34 | [pmndrs/zustand](https://github.com/pmndrs/zustand) | Client UI State محدود؛ نه مرجع قیمت/سفارش | Cart UI/Wishlist Draft State |
| 35 | [amannn/next-intl](https://github.com/amannn/next-intl) | Locale Routing و ترجمه Next.js | Storefront |
| 36 | [47ng/nuqs](https://github.com/47ng/nuqs) | URL state برای Filter/Sort/Search | Category/Search |
| 37 | [react-hook-form/react-hook-form](https://github.com/react-hook-form/react-hook-form) | فرم‌های پیچیده و مدیریت Validation State | Checkout/Admin |
| 38 | [colinhacks/zod](https://github.com/colinhacks/zod) | Schema Validation و Parse | مرز API/Form |
| 39 | [openapi-ts/openapi-typescript](https://github.com/openapi-ts/openapi-typescript) | تولید Type از قرارداد API | API Client |
| 40 | [orval-labs/orval](https://github.com/orval-labs/orval) | تولید Client/Hook از OpenAPI در صورت نیاز | API Client |
| 41 | [mswjs/msw](https://github.com/mswjs/msw) | Mock فقط در Unit/Component Test | `tests` |
| 42 | [faker-js/faker](https://github.com/faker-js/faker) | Test Fixture غیرواقعی و مشخص | تست‌ها |
| 43 | [date-fns/date-fns](https://github.com/date-fns/date-fns) | Date Utilities در صورت نیاز غیرپوشش‌داده‌شده | Localization |
| 44 | [formatjs/formatjs](https://github.com/formatjs/formatjs) | مطالعه فرمت منطقه‌ای پیام/عدد | Localization |

## 31. CMS، Search، Media و Content Operations

| # | Repository | کاربرد مشخص | محل استفاده |
|---:|---|---|---|
| 45 | [payloadcms/payload](https://github.com/payloadcms/payload) | مقایسه CMS TypeScript/Next.js و Editorial Workflow | فاز 09؛ تصمیم معماری |
| 46 | [strapi/strapi](https://github.com/strapi/strapi) | Headless CMS و Content Modeling | فاز 09؛ مقایسه |
| 47 | [directus/directus](https://github.com/directus/directus) | Data Studio/CMS روی SQL | فاز 09؛ مقایسه |
| 48 | [sanity-io/sanity](https://github.com/sanity-io/sanity) | Structured Content و Editorial Experience | فاز 09؛ مقایسه |
| 49 | [meilisearch/meilisearch](https://github.com/meilisearch/meilisearch) | Search/Typo Tolerance/Facet | فاز 05؛ گزینه منتخب احتمالی |
| 50 | [typesense/typesense](https://github.com/typesense/typesense) | Search/Facet/Synonym/Merchandising | فاز 05؛ مقایسه با Meilisearch |
| 51 | [opensearch-project/OpenSearch](https://github.com/opensearch-project/OpenSearch) | Search/Analytics در نیاز مقیاس بزرگ‌تر | فقط در صورت نیاز واقعی |
| 52 | [lovell/sharp](https://github.com/lovell/sharp) | Image Processing/Resize | Media Worker |
| 53 | [imgproxy/imgproxy](https://github.com/imgproxy/imgproxy) | Image Transformation Service | Media/CDN |
| 54 | [minio/minio](https://github.com/minio/minio) | S3-compatible Storage در صورت انتخاب Self-host | DAM |
| 55 | [uploadthing/uploadthing](https://github.com/pingdotgg/uploadthing) | مطالعه Upload UX/Typed File Upload | فاز 03؛ لزوماً Dependency نهایی نیست |
| 56 | [tus/tus-js-client](https://github.com/tus/tus-js-client) | Resumable Upload فایل‌های بزرگ | فاز 03 در صورت نیاز |
| 57 | [aws/aws-sdk-js-v3](https://github.com/aws/aws-sdk-js-v3) | S3-compatible Object Storage Client | Gateway/Media |

## 32. Testing، Accessibility و Performance

| # | Repository | کاربرد مشخص | محل استفاده |
|---:|---|---|---|
| 58 | [microsoft/playwright](https://github.com/microsoft/playwright) | Browser E2E، Screenshot و Cross-browser | `tests/e2e` |
| 59 | [vitest-dev/vitest](https://github.com/vitest-dev/vitest) | Unit/Component Test | Packages/UI/Storefront |
| 60 | [testing-library/react-testing-library](https://github.com/testing-library/react-testing-library) | تست رفتار Component | UI |
| 61 | [testing-library/jest-dom](https://github.com/testing-library/jest-dom) | DOM Assertions | Component Tests |
| 62 | [axe-core/axe-core](https://github.com/dequelabs/axe-core) | Automated Accessibility Checks | CI/E2E |
| 63 | [pa11y/pa11y](https://github.com/pa11y/pa11y) | Accessibility smoke checks | CI |
| 64 | [PactFoundation/pact-js](https://github.com/pact-foundation/pact-js) | Consumer/Provider Contract Testing | API/Provider Adapter |
| 65 | [grafana/k6](https://github.com/grafana/k6) | Load/Stress/Soak Test | `tests/performance` |
| 66 | [GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse) | Performance/SEO/Accessibility baseline | CI/Release |
| 67 | [cypress-io/cypress](https://github.com/cypress-io/cypress) | جایگزین/مقایسه Browser Testing؛ هم‌زمان Playwright را تکرار نکن | ارزیابی ابزار |
| 68 | [allure-framework/allure-js](https://github.com/allure-framework/allure-js) | گزارش تست در تیم‌های بزرگ | CI در صورت نیاز |

## 33. Security، Identity و Authorization

| # | Repository | کاربرد مشخص | محل استفاده |
|---:|---|---|---|
| 69 | [OWASP/ASVS](https://github.com/OWASP/ASVS) | Security Verification Requirements | فاز 14 |
| 70 | [OWASP/CheatSheetSeries](https://github.com/OWASP/CheatSheetSeries) | Secure Coding Practices | فاز 14 |
| 71 | [semgrep/semgrep](https://github.com/semgrep/semgrep) | Static Analysis و Custom Rules | CI |
| 72 | [gitleaks/gitleaks](https://github.com/gitleaks/gitleaks) | Secret Scanning | CI |
| 73 | [aquasecurity/trivy](https://github.com/aquasecurity/trivy) | Container/Dependency/IaC Scanning | CI/Release |
| 74 | [zaproxy/zaproxy](https://github.com/zaproxy/zaproxy) | DAST Security Test | Staging |
| 75 | [better-auth/better-auth](https://github.com/better-auth/better-auth) | مطالعه Auth Patterns؛ جایگزینی Auth فعلی فقط با ADR | فاز 14 |
| 76 | [authjs/auth.js](https://github.com/nextauthjs/next-auth) | Session/Auth Integration Reference | فاز 14 |
| 77 | [casl/ability](https://github.com/stalniy/casl) | Fine-grained Permission/Ability | Admin/API |
| 78 | [keycloak/keycloak](https://github.com/keycloak/keycloak) | Enterprise Identity/SSO در صورت نیاز | آینده/Enterprise |

## 34. Observability، Analytics و Jobs

| # | Repository | کاربرد مشخص | محل استفاده |
|---:|---|---|---|
| 79 | [opentelemetry/opentelemetry-js](https://github.com/open-telemetry/opentelemetry-js) | Traces/Metrics/Context | API/Worker |
| 80 | [prometheus/prometheus](https://github.com/prometheus/prometheus) | Metrics Scraping/Alert Rules | Operations |
| 81 | [grafana/loki](https://github.com/grafana/loki) | Log Aggregation | Operations |
| 82 | [grafana/tempo](https://github.com/grafana/tempo) | Distributed Tracing Backend | Operations |
| 83 | [getsentry/sentry-javascript](https://github.com/getsentry/sentry-javascript) | Error Monitoring در Front/Back | All Apps |
| 84 | [posthog/posthog](https://github.com/PostHog/posthog) | Product Analytics/Feature Flags در صورت انتخاب | Growth |
| 85 | [plausible/analytics](https://github.com/plausible/analytics) | Privacy-friendly Web Analytics | Marketing |
| 86 | [pinojs/pino](https://github.com/pinojs/pino) | Structured Logging | API/Worker |
| 87 | [taskforcesh/bullmq](https://github.com/taskforcesh/bullmq) | Queue/Job Processing؛ با Outbox فعلی مقایسه شود | Worker، در صورت تصمیم |
| 88 | [felixmosh/bull-board](https://github.com/felixmosh/bull-board) | Queue UI؛ فقط اگر BullMQ استفاده شد | Admin/Ops |

## 35. Email و Notification UX

| # | Repository | کاربرد مشخص | محل استفاده |
|---:|---|---|---|
| 89 | [resend/react-email](https://github.com/resend/react-email) | ساخت Template ایمیل قابل پیش‌نمایش | Notification Templates |
| 90 | [nodemailer/nodemailer](https://github.com/nodemailer/nodemailer) | SMTP Adapter/Email Transport | Notification Provider |
| 91 | [novuhq/novu](https://github.com/novuhq/novu) | مقایسه Notification Workflow/Preference Center | در صورت نیاز به سامانه مجزا |

**نکته:** تعداد منابع به معنی استفاده از تمام آن‌ها نیست. در هر دسته یک ابزار اصلی انتخاب شود؛ دو Search Engine، دو CMS، دو Queue Framework یا دو UI System بدون دلیل اضافه نکن.

---

# بخش هفتم — Agent Skills و گردش کار هوش مصنوعی

## 36. Skillهای مرجع بیرونی

این Skillها برای افزایش کیفیت Agent مفید هستند. Skillهای اختصاصی Shopify/Medusa نباید به معنی مهاجرت به آن پلتفرم‌ها تفسیر شوند.

### Vercel Agent Skills

مخزن: https://github.com/vercel-labs/agent-skills  
راهنمای رسمی: https://vercel.com/docs/agent-resources/skills

پیشنهاد نصب:

```bash
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add vercel-labs/agent-skills --skill next-best-practices
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
npx skills add vercel-labs/agent-skills --skill building-components
npx skills add vercel-labs/agent-skills --skill turborepo
```

### Agent Skills عمومی

```bash
npx skills add anthropics/skills --skill frontend-design
npx skills find "playwright e2e testing"
npx skills find "accessibility audit"
npx skills find "seo schema markup"
npx skills find "postgresql prisma migration"
```

### Commerce Skills برای مطالعه

- [Shopify/hydrogen](https://github.com/Shopify/hydrogen): نمونه Skillهای Product/Cart/Markets/Search؛ ابزارهای نسخه Hydrogen را بی‌دلیل به Storefront فعلی اضافه نکن.
- [Shopify/agent-skills](https://github.com/Shopify/agent-skills): API Skills ویژه Shopify؛ برای زمانی که Integration Shopify واقعاً وجود دارد.
- [medusajs/medusa-agent-skills](https://github.com/medusajs/medusa-agent-skills): الگوهای Medusa؛ برای مطالعه مرز ماژول‌ها و Workflows.
- [anthropics/skills](https://github.com/anthropics/skills): نمونه ساختار `SKILL.md` و Skillهای تخصصی.

## 37. Skillهای اختصاصی که باید داخل همین مخزن ساخته شوند

مسیر پیشنهادی: `.agents/skills/<skill-name>/SKILL.md`

| # | Skill | مسئولیت دقیق | هنگام اجرای چه فازهایی استفاده شود |
|---:|---|---|---|
| 1 | `commerce-os-repo-audit` | بررسی ساختار، تست، API، Prisma، Demo paths و ارائه شواهد | P00، قبل از هر فاز |
| 2 | `commerce-domain-modeling` | طراحی Domain، Invariants، State Machine و ADR | P01، P03، P07، P10 |
| 3 | `global-storefront-ux` | طراحی User Journey و تجربه خرید جهانی، نه صرفاً زیباسازی | P01، P04 تا P08 |
| 4 | `clinical-product-content` | ساخت Product Content، Ingredients، Evidence و منع ادعای تاییدنشده | P01، P03، P06، P09 |
| 5 | `commerce-design-system` | ساخت/بازبینی Tokens، Components، RTL/LTR و Responsive | P02، P04، P11 |
| 6 | `catalog-pim-dam` | مدل داده، Asset Upload، Media Processing و Product Publishing | P03، P04، P06 |
| 7 | `checkout-payment-integrity` | Idempotency، Payment State، Ledger، Stock Reservation و Refund | P07، P14، P15 |
| 8 | `multilingual-rtl-i18n` | Locale Routing، Translation، Currency/Date Formatting و RTL/LTR | P02، P12، P13 |
| 9 | `seo-commerce-technical` | Metadata، Canonical، Sitemap، JSON-LD و Indexation | P04 تا P06، P13 |
| 10 | `admin-erp-feature-architecture` | تفکیک Admin، Permission-aware UX و Operations Workflow | P11 |
| 11 | `playwright-commerce-e2e` | ساخت E2E پایدار و Golden Purchase | P00، P07، P15، P16 |
| 12 | `accessibility-wcag-audit` | بررسی Keyboard، Screen Reader، Contrast و Automated A11y | P02، P04 تا P15 |
| 13 | `performance-core-web-vitals` | اندازه‌گیری، تحلیل Image/Cache/Bundle و بودجه عملکرد | P00، P04، P13، P15 |
| 14 | `commerce-security-threat-model` | Threat Modeling، OWASP، Tenant Isolation، CSRF/CORS/SSRF | P00، P14، P16 |
| 15 | `production-observability-runbooks` | Logging، Trace، Metrics، Alerts، Backup و Recovery | P16 |
| 16 | `release-evidence-manager` | جمع‌آوری شواهد، چک‌لیست Go/No-Go و Release Notes | همه فازها، به‌ویژه P15/P16 |

### قالب مورد انتظار برای هر Skill

هر `SKILL.md` باید این ساختار را داشته باشد:

```markdown
---
name: skill-name
description: چه کاری، در چه زمان و با چه محدودیت‌هایی انجام می‌دهد.
---

# هدف

# زمان استفاده

# ورودی‌های موردنیاز

# فایل‌ها و ماژول‌های مرتبط

# روش اجرای مرحله‌ای

# قوانین غیرقابل مذاکره

# تست‌های اجباری

# معیار پذیرش

# شواهدی که باید گزارش شوند

# مواردی که نباید انجام شوند
```

### Agent Team پیشنهادی

| Agent | مأموریت | خروجی |
|---|---|---|
| Product/UX Agent | تحلیل Persona، Sitemap و User Flow | UX Spec و Acceptance Criteria |
| Design System Agent | Tokens و Component System | UI Kit و Storybook |
| Storefront Agent | Home/PLP/PDP/Cart/Account | صفحات واقعی و Responsive |
| Backend Domain Agent | PIM/Media/Content/Cart/Checkout | Domain/API/Schema |
| Admin/ERP Agent | تفکیک Admin و عملیات | Admin Features |
| QA Agent | Unit/Integration/Playwright/A11y | Test Evidence |
| Security Agent | Threat Model و تست‌های امنیتی | Security Report |
| Platform Agent | CI/CD/Observability/Backup | Runbooks و Release Gate |

**قانون هماهنگی:** هر Feature دارای یک Owner اصلی باشد. تغییر Schema/API قبل از Merge باید با مصرف‌کنندگان Frontend/Admin/Worker هماهنگ شود. چند Agent نباید هم‌زمان یک فایل یا یک Domain را بدون توافق تغییر دهند.

---

# بخش هشتم — کیفیت، ریسک و حاکمیت انتشار

## 38. ریسک‌های اصلی

| ریسک | احتمال/اثر | کنترل |
|---|---|---|
| تبدیل شدن پروژه به یک Dashboard بزرگ با Storefront ضعیف | زیاد/زیاد | اولویت مستقل برای تجربه خریدار و KPIهای Conversion |
| Fallback نمایشی در محیط واقعی | متوسط/بحرانی | Production guard و E2E روی DB واقعی |
| اختلاف قیمت/واحد ارز | متوسط/بحرانی | Money Value Object، Currency Scale و Quote Snapshot |
| Oversell در خرید هم‌زمان | متوسط/بحرانی | Row Lock، Inventory Invariant و Concurrency Test |
| پرداخت تکراری/نامشخص | متوسط/بحرانی | Idempotency، Callback Signature و Reconciliation |
| Tenant Data Leak | متوسط/بحرانی | Tenant Context، Composite Key، BOLA Tests |
| انتشار ادعای درمانی بدون پشتوانه | متوسط/زیاد | Claim Workflow و مسئول بازبینی |
| تصویر نامناسب/کند | زیاد/متوسط | DAM، Responsive Variants، CDN و Performance Budget |
| پیچیدگی غیرضروری CMS/Search/Queue | متوسط/زیاد | ADR و انتخاب یک ابزار در هر دسته |
| افت دسترس‌پذیری پس از Redesign | متوسط/زیاد | WCAG Gate و axe/Keyboard E2E |
| افزایش حجم JS و کندی موبایل | متوسط/زیاد | RSC، Lazy Loading و Lighthouse CI |
| Migration ناسازگار با دیتای قبلی | متوسط/بحرانی | Expand/Contract Migration و Backup/Restore Test |

## 39. Release Gates

انتشار به Production فقط در صورت سبز بودن همه Gateهای مربوط مجاز است:

- **G-A Commercial Integrity:** Ledger متوازن، سفارش و پرداخت صحیح.
- **G-B Idempotency:** عدم ایجاد سفارش/پرداخت تکراری.
- **G-C Inventory:** صفر Oversell و Reconciliation موفق.
- **G-D Tenant Isolation:** عدم مشاهده اطلاعات Tenant دیگر.
- **G-E Security:** Secrets، CORS، TLS، Rate Limit و Vulnerability Scan.
- **G-F Data Integrity:** Migration و Backup/Restore.
- **G-G Golden E2E:** مسیر خرید واقعی، بدون SKIP.
- **G-H UX:** Home/PDP/PLP/Cart/Checkout در موبایل و دسکتاپ.
- **G-I A11y:** دسترس‌پذیری صفحات حیاتی.
- **G-J SEO:** Indexability، Canonical، JSON-LD، Sitemap.
- **G-K Performance:** CWV و Bundle Budget.
- **G-L Operations:** Monitoring، Alert و Runbook.
- **G-M Content:** Placeholder/Lorem Ipsum/Claims بدون تأیید صفر.
- **G-N Legal/Market:** شرایط فروش، مالیات، ارسال، Privacy و اسناد بازار هدف بازبینی شده باشند.

یک Gate قرمز در امنیت/پول/موجودی/ایزولاسیون Tenant به معنی `NO-GO` است.

## 40. Definition of Global-Ready

Commerce OS زمانی برای ادعای «فروشگاه جهانی» آماده است که:

1. تجربه واقعی خرید از محصول تا تحویل و پشتیبانی کامل باشد.
2. محصول تصویر، مشخصات، Variant، ترجمه و محتوای کافی داشته باشد.
3. بازارهای فعال با Currency، Tax، Shipping و Locale معتبر کار کنند.
4. Checkout در موبایل سریع، کوتاه و قابل بازیابی باشد.
5. پرداخت و موجودی در برابر Retry/Concurrency مقاوم باشند.
6. Admin و Content Operations بدون تغییر مستقیم DB کار کنند.
7. SEO و Accessibility در صفحات حیاتی کیفیت قابل اندازه‌گیری داشته باشند.
8. Security، Privacy و اطلاعات محصول با بازارهای هدف سازگار باشند.
9. عملیات، Monitoring، Alert، Backup و Recovery آزمایش شده باشند.
10. هیچ صفحه/دکمه/کارت مهمی نمایشی یا بدون Backend واقعی باقی نمانده باشد.

---

# بخش نهم — دستور اجرایی مستقیم برای Coding Agent

## 41. Master Prompt

متن زیر را به Agent اصلی کدنویسی بده:

> تو مسئول ارتقای مخزن `ali39999-hue/commerce-os` به یک Commerce Platform و فروشگاه آنلاین سطح جهانی هستی. این پروژه از قبل معماری Modular Monolith با Next.js، NestJS، Prisma، PostgreSQL، Redis، Worker، Finance، Inventory و API Contracts دارد. معماری فعلی را بی‌دلیل جایگزین نکن.
>
> سند `docs/roadmaps/COMMERCE_OS_GLOBAL_STORE_ROADMAP_FA.md` را مرجع الزامی اجرا بدان. قبل از تغییر، مخزن را در Commit فعلی بررسی کن. README را حقیقت قطعی فرض نکن؛ کد واقعی و تست را بررسی کن.
>
> مرجع تجربه برند `https://www.drdermer.co.uk/` است. از الگوی Brand Story، معرفی علمی محصول، خانواده محصول، Ingredient/Usage Content، Professional/Consumer Journey و Editorial Commerce الهام بگیر؛ اما Placeholderها، Lorem Ipsum، ادعاهای پزشکی بدون Evidence یا طراحی ضعیف آن را کپی نکن.
>
> هدف اول تو بازطراحی واقعی Storefront است: Home، Category، Search، PDP، Cart، Checkout، Account و Content. کارت محصول باید Media واقعی داشته باشد؛ Variant باید سرورساید قیمت/موجودی/SKU را تعیین کند؛ SEO عمومی باید قابل Index باشد؛ Admin باید از Demo state خارج شود.
>
> کار را Phase به Phase و Task به Task انجام بده. هر تسک را با شناسه همین سند ثبت کن. برای هر تسک فایل‌های تغییرکرده، Migration، API Contract، تست‌ها، نتایج اجرا، Screenshot و معیار پذیرش را گزارش کن.
>
> هرجا Backend موجود است آن را تکمیل و متصل کن؛ API موازی یا دیتابیس دوم نساز. هرجا Backend وجود ندارد، Domain، Schema، Migration، Service، Controller، Permission، API Contract، UI و Test را به‌صورت end-to-end بساز.
>
> هرگز قیمت/موجودی/مالیات/تخفیف/سفارش/پرداخت را از Frontend معتبر فرض نکن. Money بدون Float، Ledger Append-only، Reservation Atomic، Idempotency و Tenant Isolation باید حفظ شوند.
>
> Demo/Fallback در تست می‌تواند وجود داشته باشد، اما در Production باید خاموش یا به‌وضوح `UNAVAILABLE` نشان داده شود. مسیر Golden Purchase روی PostgreSQL و Redis واقعی باید بدون SKIP پاس شود.
>
> هیچ تغییر Major در Dependency، تغییر معماری، استخراج Microservice، حذف Migration یا تغییر رفتار مالی بدون ADR و تست انجام نده. هیچ Secret یا Credential را وارد Git نکن.
>
> تا قبل از تأیید مالک محصول، Push/Release انجام نده. خروجی را در Branch و PR کوچک و قابل بازبینی ارائه کن.
>
> از فاز 00 شروع کن. پس از تکمیل هر فاز، گزارش شواهد و فهرست Blockerها را ارائه بده و سپس به فاز بعد برو.

## 42. قالب گزارش پایان هر تسک

```markdown
## TASK: Pxx-xxx — عنوان

- Status: DONE | IN_REVIEW | BLOCKED
- Branch / Commit:
- Owner:
- Scope:

### تغییرات
- ...

### فایل‌ها
- `path/to/file`

### Database/API
- Migration:
- Endpoint/Contract:
- Permission/Tenant scope:

### Tests
- Unit:
- Integration:
- E2E:
- Accessibility:
- Performance:

### Evidence
- Screenshot:
- Test output:
- API trace/log:

### Acceptance Criteria
- [x] ...

### Risks / Follow-ups
- ...
```

## 43. قالب ADR

```markdown
# ADR-XXX: Title

- Status: Proposed | Accepted | Superseded
- Date:
- Owners:

## Context
## Decision Drivers
## Considered Options
## Decision
## Consequences
## Security/Privacy Impact
## Migration/Operational Impact
## Rollback Plan
## References
```

---

# بخش دهم — نقشه تحویل و اولویت‌بندی

## 44. ترتیب اجرای پیشنهادی

ترتیب زیر باید رعایت شود تا UI جدید روی Backend ناقص ساخته نشود:

1. P00 Baseline و حذف ریسک‌های انتشار
2. P01 Product/Brand Discovery
3. P02 Design System
4. P03 PIM/DAM
5. P04 Homepage
6. P05 Category/Search
7. P06 PDP
8. P07 Cart/Checkout
9. P08 Account/Service
10. P09 CMS/Editorial
11. P10 B2B/Professional
12. P11 Admin/ERP Refactor (بخش‌هایی از آن می‌تواند هم‌پوشان با P03/P09 باشد)
13. P12 Internationalization/Markets
14. P13 SEO/Growth
15. P14 Security/Privacy/Compliance
16. P15 Test/Accessibility/Performance
17. P16 Deployment/Observability
18. P17 Launch/Optimization

## 45. اولویت بر اساس ارزش تجاری

| اولویت | قابلیت | دلیل |
|---|---|---|
| P0 | DB/Payment/Inventory/Tenant/Production Security | جلوگیری از خسارت مالی و داده‌ای |
| P0 | Noindex و Demo/Fallback guards | جلوگیری از عرضه نامرئی یا غیرواقعی |
| P1 | Product Images + PIM | بدون داده و تصویر، فروشگاه قابل فروش نیست |
| P1 | Homepage + PDP + Category | بیشترین اثر بر اعتماد و Conversion |
| P1 | Cart + Checkout | تبدیل بازدید به درآمد |
| P1 | Admin/Coupon واقعی | عملیات روزانه فروشگاه |
| P2 | Search/Filter/Recommendations | کشف سریع‌تر محصول |
| P2 | Account/Returns/Support | تجربه پس از خرید و Retention |
| P2 | Editorial/Ingredient/Knowledge | تمایز برند و SEO |
| P3 | B2B/Distributor | توسعه کانال‌های فروش |
| P3 | Multi-market/Global Tax/Shipping | توسعه بازار بین‌المللی با آمادگی عملیاتی |
| P3 | Advanced Personalization/AI | پس از جمع‌آوری داده معتبر و رضایت کاربر |

## 46. Deliverables نهایی

- [ ] Product Strategy و IA تأییدشده
- [ ] Design System و Component Library
- [ ] Product PIM و Media/DAM
- [ ] Homepage و Storefront responsive
- [ ] Category/Search/Discovery
- [ ] PDP کامل با Variant/Media/Content
- [ ] Cart/Checkout/Order Journey
- [ ] Account/Returns/Support
- [ ] Editorial/Brand/Ingredient Content
- [ ] B2B/Professional Portal در صورت فعال بودن Scope
- [ ] Admin Feature Architecture
- [ ] Internationalization/Market Support
- [ ] SEO/Analytics/Growth
- [ ] Security/Privacy Evidence
- [ ] Playwright E2E + Load + Accessibility Evidence
- [ ] Observability/Runbooks/Backup Restore
- [ ] Production Go/No-Go Report

---

# منابع و شواهد مبنا

## A. مخزن و فایل‌های Commerce OS

- [Repository Overview](https://github.com/ali39999-hue/commerce-os)
- [README فارسی](https://github.com/ali39999-hue/commerce-os/blob/main/README_FA.md)
- [Unified Architecture Synthesis](https://github.com/ali39999-hue/commerce-os/blob/main/docs/architecture/COMMERCE_OS_UNIFIED_SYNTHESIS.md)
- [Release Checklist](https://github.com/ali39999-hue/commerce-os/blob/main/docs/architecture/RELEASE_CHECKLIST_FA.md)
- [Root package.json](https://raw.githubusercontent.com/ali39999-hue/commerce-os/main/package.json)
- [Storefront package.json](https://raw.githubusercontent.com/ali39999-hue/commerce-os/main/apps/storefront/package.json)
- [Storefront Home Page](https://raw.githubusercontent.com/ali39999-hue/commerce-os/main/apps/storefront/app/page.tsx)
- [Storefront Layout](https://raw.githubusercontent.com/ali39999-hue/commerce-os/main/apps/storefront/app/layout.tsx)
- [Storefront Product Page](https://raw.githubusercontent.com/ali39999-hue/commerce-os/main/apps/storefront/app/products/%5Bslug%5D/page.tsx)
- [Storefront Global CSS](https://raw.githubusercontent.com/ali39999-hue/commerce-os/main/apps/storefront/app/globals.css)
- [Admin Page](https://raw.githubusercontent.com/ali39999-hue/commerce-os/main/apps/admin/app/page.tsx)
- [Prisma Schema](https://raw.githubusercontent.com/ali39999-hue/commerce-os/main/apps/api/prisma/schema.prisma)

## B. Dr Dermer Reference

- [Dr Dermer Homepage](https://www.drdermer.co.uk/)
- [CarboxyGel Product Story](https://www.drdermer.co.uk/carboxygel/)
- [CarboxyPod Product Story](https://www.drdermer.co.uk/carboxypod/)
- [Contact Us](https://www.drdermer.co.uk/contact-us/)

## C. Technical and Product References

- [Vercel Agent Skills](https://vercel.com/docs/agent-resources/skills)
- [skills.sh](https://www.skills.sh/)
- [OWASP ASVS](https://github.com/OWASP/ASVS)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [Schema.org Product](https://schema.org/Product)
- [Google Product Structured Data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js Metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Playwright](https://playwright.dev/)
- [Prisma](https://www.prisma.io/docs)
- [NestJS](https://docs.nestjs.com/)

---

## پیوست — چک‌لیست سریع روزانه Agent

- [ ] قبل از شروع، Task ID و فایل‌های مورد تغییر را مشخص کردم.
- [ ] کد فعلی را خواندم و قابلیت موجود را دوباره‌کاری نکردم.
- [ ] مرز UI/API/Domain/DB را رعایت کردم.
- [ ] هیچ داده مالی یا موجودی را از Client معتبر فرض نکردم.
- [ ] هیچ Demo/Fallback در مسیر Production اضافه نکردم.
- [ ] برای تغییر Schema Migration افزایشی و تست نوشتم.
- [ ] تست مناسب اضافه و واقعاً اجرا کردم.
- [ ] RTL/LTR، موبایل، Keyboard و Error State را بررسی کردم.
- [ ] مستندات و API Contract را به‌روز کردم.
- [ ] Evidence و ریسک باقیمانده را گزارش کردم.
- [ ] بدون تأیید، Push/Release نکردم.

**پایان سند — شروع اجرا از `P00-001`**
