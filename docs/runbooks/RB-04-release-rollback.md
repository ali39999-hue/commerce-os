# RB-04 — Rollback نسخه (بازگشت انتشار معیوب)

| فیلد | مقدار |
|---|---|
| شناسه | RB-04 |
| شدت | بحرانی (Critical) — فقط در زمان خرابی پروداکشن اجرا می‌شود |
| دامنه | ایمیج‌های Docker (`api` · `worker` · `storefront` · `admin`) · مایگریشن‌های Prisma · `.env` |
| سرویس‌ها | تمام سرویس‌های `docker-compose.prod.yml` |
| SLO اجرا | حداکثر ۳۰ دقیقه تا بازگشت کامل ترافیک سالم |

## ۰. اصل طلایی

**Rollback کد را ساده نگه دارید، Rollback داده را ممنوع کنید.** بازگشت نسخه فقط یعنی اجرای دوباره ایمیج‌های tag قبلی. هیچ مایگریشن برگشتی (down migration یا دستکاری schema) به‌صورت مستقیم روی دیتای پروداکشن اجرا نشود — دیتا پابرجا (expand/contract) مدیریت می‌شود تا کد قدیمی با schema جدید هم کار کند.

## ۱. علائم (Symptoms)

- نرخ خطای `GET /v1/health` یا `GET /v1/ready` بالاست یا `postgres: unavailable` برمی‌گرداند.
- مسیر طلایی خرید (`scripts/e2e-golden-path.mjs`) پس از انتشار شکست می‌خورد.
- خطاهای 500 با `code: "INTERNAL_ERROR"` بالا رفته، یا خطای ناسازگاری schema در لاگ api دیده می‌شود (`column ... does not exist` و مشابه).
- صف Outbox انباشته و worker مکرر کرش می‌کند (پس از رد RB-02 که علت زیرساختی نباشد).

## ۲. تشخیص (Diagnosis)

1. **محدودسازی زمان:** با لاگ‌ها مقایسه کنید که خرابی دقیقاً بعد از کدام deploy شروع شده است:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail 200 api
docker compose -f docker-compose.prod.yml logs --tail 200 worker
```

2. **ردیابی تغییرات schema:** اگر خطا نشانه ناسازگاری دیتابیس است، چک کنید آخرین deploy مایگریشن جدید داشته یا نه؛ `docker compose -f docker-compose.prod.yml exec api pnpm exec prisma migrate status`.
3. **تأیید سلامت پایه:** اگر `ready` سالم است و خرابی فقط در یک مسیر خاص است، شاید rollback کامل لازم نباشد؛ فراخوانی RB مربوط به همان زیرسیستم (RB-01/02/03) را اول ارزیابی کنید. در شک/خرابی گسترده، rollback کنید — تصمیم سریع بهتر از عیب‌یابی روی پروداکشن است.
4. نسخه قبلی سالم را از پیش‌تعریف (`tag` آخرین ایمیج سبز قبل از انتشار فعلی، مثلاً از سابقه CI یا خروجی `docker images`) مشخص کنید و آن را قبل از شروع، در تیکت ثبت کنید.

## ۳. اقدام (Action)

### گام ۱ — توقف ترافیک پرداخت‌ساز (اختیاری ولی توصیه‌شده)

برای جلوگیری از ثبت سفارش نیمه‌سالم، در reverse proxy مسیرهای نوشتاری (`/v1/checkout/*`, `/v1/payments/*`) را موقتاً به صفحه نگهداری هدایت کنید؛ مسیرهای خواندنی کاتالوگ می‌توانند بمانند.

### گام ۲ — بازگشت ایمیج‌ها به tag قبلی

اگر انتشار با tag نسخه‌دار انجام شده (توصیه سند استقرار)، کافی است reference ایمیج قبلی را اجرا کنید:

```bash
cd /path/to/shop
# 1) کد مخزن را به tag نسخه قبلی برگردانید (برای context بیلد در صورت نیاز)
git fetch --tags && git checkout <PREVIOUS_RELEASE_TAG>

# 2) ایمیج‌های قبلی را بازسازی/بازیابی کنید
docker compose -f docker-compose.prod.yml build api worker storefront admin
docker compose -f docker-compose.prod.yml up -d
```

اگر ایمیج قبلی در registry لوکال موجود است و نمی‌خواهید build بگیرید، به‌جای build مستقیم ایمیج قبلی را با `docker tag` روی نام سرویس سوار کنید و سپس `up -d --no-build`. سریع‌ترین مسیر برای api و worker (تنها سرویس‌های وابسته به schema):

```bash
docker compose -f docker-compose.prod.yml stop worker api
docker compose -f docker-compose.prod.yml up -d --no-build api worker
```

(پیش‌فرض: ایمیج قبلی tag شده و در دسترس است — به همین دلیل هر release باید tag پایدار داشته باشد؛ نکات پیشگیری در بخش ۵.)

### گام ۳ — وضعیت مایگریشن‌ها را بسنجید و از قواعد expand/contract خارج شوید

قبل از هر اقدامی روی دیتابیس، این قاعده را روی مایگریشن‌های منتشرشده اعمال کنید:

| نوع مایگریشن منتشرشده | اثر بر rollback | اقدام |
|---|---|---|
| **Expand** (افزودن ستون/جدول/ایندکس — سازگار با کد قدیمی) | هیچ | هیچ کاری نکنید؛ schema جدید را نگه دارید. کد قدیمی ستون‌های تازه را نمی‌بیند و کار می‌کند. |
| **Contract** (حذف/تغییر نام ستون مورد استفاده کد قبلی) | مسدودکننده | مستقیم rollback نکنید؛ اگر کد قبلی به ستون حذف‌شده نیاز دارد، ستون را **دوباره اضافه** کنید (`ALTER TABLE ... ADD COLUMN ...` با مقدار پیش‌فرض) و در نسخه بعدی contract را تکرار نکنید تا پنجره سازگاری کامل شود. |
| **Data migration** (تغییر داده) | بحرانی | هرگز معکوس‌سازی روی دیتا انجام ندهید؛ با snapshot بکاپ (RB-06) بازیابی هدفمند فقط برای جداول آسیب‌دیده، با تأیید مالک محصول. |

بررسی اعمال‌شده بودن مایگریشن نسخه جدید:

```bash
docker compose -f docker-compose.prod.yml exec api pnpm exec prisma migrate status
```

اگر مایگریشن جدید اعمال نشده بود (`pending`)، چیزی برنگردانید — rollback کد بدون دست زدن به دیتابیس تمام می‌شود.

### گام ۴ — تأیید بازگشت

```bash
docker compose -f docker-compose.prod.yml ps                    # همه healthy
curl -f http://127.0.0.1:4000/v1/health                          # {"status":"ok",...}
curl -f http://127.0.0.1:4000/v1/ready                           # {"status":"ready",...}
node scripts/e2e-golden-path.mjs                                 # مسیر طلایی سبز
docker compose -f docker-compose.prod.yml logs --tail 50 worker  # چرخه عادی worker
```

سپس ترافیک پرداخت‌ساز را از نگهداری خارج کنید و `GET /v1/ops/exceptions` را برای اطمینان از تخلیه صف‌ها بررسی کنید. سفارش‌هایی که حین خرابی در `PENDING_PAYMENT` ماندند را با RB-01 تسویه کنید.

## ۴. بازگشت (Rollback از Rollback)

- اگر rollback اشتباهی بود (نسخه جدید سالم بود)، همین ران‌بوک را با tag نسخه جدید اجرا کنید؛ چون دیتا دست نخورده، بازگشت امن است.
- قبل از تلاش مجدد انتشار، علت خرابی نسخه را در CI محاصره و تست کنید؛ انتشار دوباره بدون ریشه‌یابی ممنوع است.
- همه اقدامات زمان‌دار (ساعت شروع/پایان هر گام) را در تیکت incident ثبت کنید.

## ۵. پیگیری و پیشگیری

- **هر release باید tag ایمیج پایدار داشته باشد** (`git tag vX.Y.Z` + ایمیج هم‌نام)؛ rollback بدون tag قبلی یعنی دیباگ روی پروداکشن.
- نگهدارنده مایگریشن باید قانون expand/contract را در review اعمال کند: مایگریشن‌های ترکیبی (expand + contract در یک فایل) را رد کنید.
- پس از هر incident، یک سناریو تست rollback در CI اضافه کنید تا مسیر بازگشت همیشه گرم بماند.
