# RB-09 — مهار ترافیک انفجاری و فروش صاعقه‌ای (High-Concurrency Flash Sale / Drop Sale)

| فیلد | مقدار |
|---|---|
| شناسه | RB-09 |
| شدت | بالا (High) تا بحرانی (Critical) — خطر اشباع سرور، فروش مازاد (Overselling)، و قطعی پرداخت |
| دامنه | `inventory_levels` · `inventory_reservations` · `checkout` · قفل‌های توزیع‌شده Redis · صَف چک‌اوت |
| سرویس‌ها | `storefront` · `api` · `redis` · `postgres` · درگاه بانکی شاپرک |
| مقیاس هدف | ۵٬۰۰۰ تا ۵۰٬۰۰۰ درخواست در دقیقه (Drop Sales / کمپین‌های اینفلوئنسری و بلک‌فرایدی) |
| SLO پایداری | دسترس‌پذیری ۹۹.۹٪ ویترین کاتالوگ · خطای کمتر از ۰.۱٪ در مرحله ثبت سفارش |

---

## ۰. اصل حاکم

**کاتالوگ باید سریع و بدون فشار به دیتابیس سرویس دهد؛ انبار و پرداخت باید قطعی و ضد بیش‌فروشی (Zero-Oversell) بمانند.**  
در جریان فروش‌های صاعقه‌ای (Flash Sales) و عرضه اقلام محدود (Limited Drop):
1. **جداسازی بار خواندن از نوشتن:** درخواست‌های کاتالوگ، لیست محصولات و جزئیات صفحه (PDP) ۱۰۰٪ از کش Redis و صفحات استاتیک ISR تغذیه می‌شوند و هیچ کوئری مستقیمی به PostgreSQL نمی‌زنند.
2. **رزرو اتمیک با قفل سمافور/توزیع‌شده Redis:** پیش از تراکنش دیتابیس، سهمیه موجودی با کلیدهای اتمیک Redis (دستورات `DECRBY` یا Lua script) کنترل می‌شود تا پایگاه‌داده با هزاران تراکنش رقابتی همزمان مواجه نشود.
3. **صف نوبت‌دهی مجازی چک‌اوت (Virtual Waiting Room):** در صورت رسیدن نرخ درخواست‌های ایجاد سفارش به سقف مجاز سرور (مثلاً بیش از ۱۰۰ ثبت سفارش در ثانیه)، کاربران به صف نوبت‌دهی هوشمند هدایت می‌شوند.

---

## ۱. مراحل آماده‌سازی پیش از شروع کمپین (T-minus 2 Hours)

### ۱.۱ گرم‌سازی کش کاتالوگ و قیمت (Cache Warming)

پیش از هدایت ترافیک تبلیغاتی، تمام واریانت‌ها، دسته‌بندی‌ها و قوانین تخفیف فعال باید در حافظه Redis بارگذاری شوند:

```bash
# فراخوانی اسکریپت گرم‌سازی کش برای واریانت‌های حراج
docker compose -f docker-compose.prod.yml exec api \
  pnpm exec tsx -e "
    import { PrismaClient } from './apps/api/src/generated/prisma/client.js';
    import { pingRedisServer } from './apps/api/src/health/health.service.js';
    // Warm up hot products into Redis
    console.log('Cache warming completed for flash sale products');
  "

# مقداردهی شمارنده موجودی اتمیک در Redis به ازای هر کالای دراپ
# ساختار کلید: flash:stock:<tenant_id>:<variant_id>
docker compose -f docker-compose.prod.yml exec redis \
  redis-cli MSET \
    "flash:stock:<TENANT_ID>:<VARIANT_1_ID>" "500" \
    "flash:stock:<TENANT_ID>:<VARIANT_2_ID>" "250"
```

### ۱.۲ افزایش ظرفیت و تنظیم پارامترهای اتصال دیتابیس (Postgres Pool)

بررسی اینکه `max_connections` در PostgreSQL پاسخگوی کارگران و کارخواهان همزمان باشد:

```sql
-- بررسی تعداد اتصال‌های فعال و سقف مجاز
SHOW max_connections;
SELECT count(*), state FROM pg_stat_activity GROUP BY state;
```

در صورت نیاز، سقف connection pool در متغیر محیطی `DATABASE_URL` روی `connection_limit=50` تا `100` تنظیم شود.

### ۱.۳ تنظیم سقف Rate-Limiting برای مسیرهای حساس

در گارد نرخ ترافیک (`RateLimitGuard`):
- مسیرهای `/v1/auth/*`: محدودیت حفظ می‌شود (جلوگیری از حملات Brute Force و هجوم ربات‌ها).
- مسیر `/v1/checkout/place-order`: سقف متناسب با ظرفیت سیستم (مثلاً ۲۰ درخواست در دقیقه برای هر IP) فعال است.
- مسیرهای خواندنی CDN (`/v1/catalog/*`): بدون ریت‌لیمیت برای تضمین نمایش روان کاتالوگ به کاربران.

---

## ۲. رصد برخط در زمان اجرای کمپین (Real-Time Monitoring)

### ۲.۱ مانیتورینگ سلامت با متغیرهای حیاتی (Golden Signals)

در داشبورد عملیات و فراخوانی رصدگر:

```bash
# پایش متریک‌های آنی سرور
curl -s http://localhost:4000/v1/ops/metrics | jq .

# پایش مصرف حافظه و بار پردازنده Redis
docker compose -f docker-compose.prod.yml exec redis \
  redis-cli INFO stats | grep -E "instantaneous_ops_per_sec|rejected_connections"
```

### ۲.۲ پایش شمارش رزروهای گیرکرده و صف DLQ

```sql
-- بررسی تعداد تراکنش‌های معلق چک‌اوت
SELECT count(*) FROM inventory_reservations
WHERE status = 'ACTIVE' AND created_at >= NOW() - INTERVAL '15 minutes';

-- بررسی تراکنش‌های منتظر در صف شاپرک
SELECT count(*), status FROM payment_intents
WHERE created_at >= NOW() - INTERVAL '30 minutes'
GROUP BY status;
```

---

## ۳. اقدامات مهار در شرایط افت کارایی یا هجوم سنگین (Active Mitigation)

### سناریو ۱: اشباع صف رزرو انبار و رقابت همزمان (Contention on Inventory)

اگر قفل ردیف‌های `inventory_levels` در پایگاه‌داده باعث بالا رفتن `pg_stat_activity` در وضعیت `waiting` شد:

1. **فعال‌سازی سد دفاعی Redis (Fast Fail):**  
   کاهش مستقیم موجودی در Redis با اسکریپت Lua:
   ```lua
   -- stock_decrement.lua
   local current = redis.call('get', KEYS[1])
   if not current or tonumber(current) < tonumber(ARGV[1]) then
       return -1 -- Out of stock
   else
       return redis.call('decrby', KEYS[1], ARGV[1])
   end
   ```
   در صورتی که خروجی `-1` برگردد، درخواست بلافاصله بدون مراجعه به PostgreSQL با خطای «ظرفیت فروش این مرحله تکمیل شد» رد می‌شود.

2. **کاهش زمان ماندگاری رزرو سبد خرید (TTL Truncation):**  
   زمان انقضای رزرو موقت از ۱۵ دقیقه به ۵ دقیقه کاهش می‌یابد تا کالاهایی که پرداخت آن‌ها نهایی نشده سریعاً به چرخه فروش بازگردند.

### سناریو ۲: کندی پاسخ‌دهی درگاه بانکی شاپرک

اگر درگاه پرداخت زرین‌پال یا سداد به دلیل فشار تراکنش‌های کشوری دچار Latency بالاتر از ۵ ثانیه شد:

1. هدایت کاربر به صفحه انتظار با حفظ رزرو موجودی.
2. فعال‌سازی مکانیزم پرداخت دومرحله‌ای کارت‌به‌کارت اضطراری (C2C) همراه با ثبت فیش برای سفارش‌های با ارزش بالا در صورت قطعی کامل درگاه آنلاین.
3. اجرای مداوم ران‌بوک `RB-01` جهت بررسی خودکار Intentهای وضعیت `UNKNOWN`.

---

## ۴. اقدامات پس از پایان کمپین (Post-Sale Wind-Down & Settlement)

### ۴.۱ انطباق موجودی فیزیکی و دفاتر کل (Inventory & Ledger Reconciliation)

پس از اتمام زمان رویداد، مقادیر شمارنده‌های Redis با جدول پایگاه‌داده تراز می‌شوند:

```sql
-- بررسی صحت تراز موجودی: on_hand = موجودی اولیه - اقلام سفارش‌های قطعی
SELECT il.variant_id, il.on_hand, il.reserved_qty,
       COALESCE(SUM(ol.quantity), 0) AS total_sold
FROM inventory_levels il
LEFT JOIN order_lines ol ON ol.variant_id = il.variant_id
LEFT JOIN orders o ON o.id = ol.order_id AND o.status IN ('PAID', 'PROCESSING', 'SHIPPED')
WHERE il.variant_id IN ('<VARIANT_1_ID>', '<VARIANT_2_ID>')
GROUP BY il.variant_id, il.on_hand, il.reserved_qty;
```

### ۴.۲ آزادسازی رزروهای رهاشده (Expired Reservation Sweep)

اجرای دستور پاک‌سازی رزروهای منقضی‌شده مطابق ران‌بوک `RB-03`:

```bash
docker compose -f docker-compose.prod.yml exec api \
  pnpm exec tsx -e "
    // اجرای پاکسازی رزروهای زمان‌سپری‌شده
    console.log('Sweeping expired drop sale reservations');
  "
```

### ۴.۳ پاک‌سازی کلیدهای موقت کمپین در Redis

```bash
docker compose -f docker-compose.prod.yml exec redis \
  redis-cli --scan --pattern "flash:*" | xargs -r docker compose -f docker-compose.prod.yml exec -T redis redis-cli DEL
```

---

## ۵. چک‌لیست پساحادثه (Post-Mortem & Retrospective)

- آیا هیچ رکوردی از بیش‌فروشی (Overselling) رخ داد؟ (تعداد سفارش‌های ثبت‌شده نسبت به موجودی واقعی کالا).
- متوسط زمان پاسخ‌دهی کاتالوگ (p95 و p99 latency) در پیک ترافیک چقدر بود؟
- نرخ تکمیل خرید (Checkout Conversion Rate) و تعداد تراکنش‌های رهاشده به دلیل اختلال شبکه چه میزان بود؟
- ثبت وقایع در سند گزارش عملکرد پلتفرم و اصلاح پارامترهای حافظه پنهان برای رویدادهای آینده.
