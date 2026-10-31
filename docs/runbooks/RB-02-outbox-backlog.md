# RB-02 — انباشت صف Outbox (توقف تحویل رویدادها و اعلان‌ها)

| فیلد | مقدار |
|---|---|
| شناسه | RB-02 |
| شدت | بالا (High) — اعلان مشتری و وب‌هک‌های تجاری متوقف می‌ماند |
| دامنه | `outbox_events` · `worker_leases` · `notification_deliveries` · `webhook_deliveries` |
| سرویس‌ها | `worker` · `postgres` · `api` |
| SLO حل | حداکثر ۱۵ دقیقه از لحظه شناسایی |

## ۱. علائم (Symptoms)

- شمارش `outbox_events` با `status = 'PENDING'` و `available_at` گذشته، بیش از آستانه طبیعی (در سالم بودن سیستم نزدیک صفر است) بالا رفته است.
- کاربران پیامک/ایمیل سفارش (پرداخت شد، ارسال شد، تأیید فیش، شارژ کیف پول) دریافت نمی‌کنند، در حالی که سفارش‌ها در وضعیت درست‌اند.
- بلوک «رویدادهای مرده Outbox» (`outbox_dead_letter`) در `GET /v1/ops/exceptions` شمارش غیرصفر دارد.
- لاگ worker (`docker compose -f docker-compose.prod.yml logs -f worker`) چند دقیقه خط جدید چاپ نمی‌کند، یا به‌طور تکراری خطای اتصال دیتابیس می‌دهد.
- جدول `webhook_deliveries` پر از رکورد `PENDING/FAILED` شده است.

## ۲. تشخیص (Diagnosis)

### ۲.۱ اندازه صف و سنی رویدادها

```sql
-- تفکیک وضعیت صف
SELECT status, count(*) AS cnt, min(created_at) AS oldest, max(created_at) AS newest
FROM outbox_events
GROUP BY status
ORDER BY cnt DESC;

-- آستانه هشدار: PENDING قدیمی‌تر از ۵ دقیقه
SELECT count(*) AS stale_pending
FROM outbox_events
WHERE status = 'PENDING' AND available_at <= NOW() - INTERVAL '5 minutes';

-- رویدادهای گیرکرده در PROCESSING (احتمال مرگ worker وسط کار)
SELECT id, event_type, worker_id, locked_at, retry_count
FROM outbox_events
WHERE status = 'PROCESSING'
ORDER BY locked_at ASC;
```

### ۲.۲ سلامت worker و لایسنس‌ها

```bash
# آیا پروسه worker زنده است؟ (healthcheck فقط وجود پروسه را چک می‌کند)
docker compose -f docker-compose.prod.yml ps worker
docker compose -f docker-compose.prod.yml logs --tail 200 worker
```

```sql
-- لایسنس‌های فعال worker؛ انقضای گذشته یعنی lease یتیم
SELECT resource_name, holder_id, acquired_at, expires_at, heartbeat_at
FROM worker_leases
WHERE expires_at > NOW() OR heartbeat_at > NOW() - INTERVAL '2 minutes';
```

### ۲.۳ رده‌بندی علت

| علت | نشانه متمایز |
|---|---|
| worker مرده / ری‌استارت‌شده | `ps worker` ناسالم، لاگ پایان‌یافته، رکوردهای `PROCESSING` با `locked_at` قدیمی |
| قطع یا کندی اتصال DB | خطاهای اتصال در لاگ worker، `GET /v1/ready` ناموفق (`postgres: unavailable`) |
| خطای منطق پردازش یک رویداد | `retry_count` بالا روی چند رویداد خاص، پیام خطا در لاگ (مثلاً قالب payload ناقص) |
| خروجی خارجی کند/مرد | `webhook_deliveries` با `last_error` تایم‌اوت — رویدادها پردازش می‌شوند اما سمت وب‌هک می‌مانند |

## ۳. اقدام (Action)

### گام ۱ — رفع زیرساخت پایه

1. اتصال دیتابیس را بررس کنید: `curl http://127.0.0.1:4000/v1/ready` باید `{"status":"ready"}` بدهد. اگر ناموفق است، اول مشکلات Postgres (فضای دیسک، حداکثر اتصال‌ها، memory) را حل کنید.
2. اگر `ready` سالم است ولی worker بی‌حرکت است، ری‌استارت کنید:

```bash
docker compose -f docker-compose.prod.yml restart worker
docker compose -f docker-compose.prod.yml logs -f --tail 50 worker
```

worker سالم در چرخه عادی هر رویداد را با `FOR UPDATE SKIP LOCKED` دریافت می‌کند، به `PROCESSED` می‌برد و سپس اعلان/وب‌هک را می‌بندد.

### گام ۲ — آزادسازی PROCESSINGهای یتیم

worker هنگام خطا خودش رویداد را به `PENDING` برمی‌گرداند؛ اما اگر پروسه وسط کار مرده باشد، رکورد در `PROCESSING` قفل می‌ماند. هر `PROCESSING` قدیمی‌تر از ۲ دقیقه (بیش از حد یک بار پردازش + تایم‌اوت وب‌هک ۵ ثانیه) را به `PENDING` برگردانید:

```sql
UPDATE outbox_events
SET status = 'PENDING', locked_at = NULL, worker_id = NULL
WHERE status = 'PROCESSING'
  AND locked_at <= NOW() - INTERVAL '2 minutes';
```

پس از ری‌استارت worker، این رویدادها در اولین batch پردازش می‌شوند.

### گام ۳ — بررسی DEAD_LETTER و requeue کنترل‌شده

```sql
SELECT id, event_type, retry_count, payload_json, created_at
FROM outbox_events
WHERE status IN ('FAILED','DEAD_LETTER')
ORDER BY created_at ASC
LIMIT 50;
```

- **قبل از requeue علت را اصلاح کنید** (مثلاً template ناقص payload را ببینید؛ کلیدهای لازم هر قالب: `ORDER_PAID` → `orderId, totalAmount`، `ORDER_SHIPPED` → `orderId, trackingCode`، `C2C_RECEIPT_APPROVED` → `orderId`، `WALLET_DEPOSIT` → `amount`).
- requeue را کنترل‌شده و دسته‌ای انجام دهید تا worker را زیر سیل نبرد:

```sql
-- حداکثر ۵۰ رویداد مرده در هر بار، با ریست شمارنده تلاش
UPDATE outbox_events
SET status = 'PENDING', available_at = NOW(), retry_count = 0, locked_at = NULL, worker_id = NULL
WHERE id IN (
  SELECT id FROM outbox_events
  WHERE status IN ('FAILED','DEAD_LETTER')
  ORDER BY created_at ASC
  LIMIT 50
);
```

- رویدادی که چند بار هم بعد از اصلاح شکست خورد، به `DEAD_LETTER` برمی‌گردد؛ آن را به‌عنوان داده معیوب دستی پردازش/بایگانی کنید، نه requeue بی‌پایان.

### گام ۴ — تخلیه صف

worker وقتی صف خالی نیست، فاصله چرخه را از ۲ ثانیه به ۲۰۰ میلی‌ثانیه می‌کاهد؛ اگر صف چند هزار رویدادی شد و worker ظرفیت نمی‌کند، به‌صورت موقت یک نمونه worker دوم روی همان سرور بالا بیاورید (الگوی SKIP LOCKED رقابت را ایمن می‌کند) و پس از تخلیه خاموشش کنید. پیشرفت را با کوئری بخش ۲.۱ رصد کنید.

### گام ۵ — تأیید خروج

- کوئری stale_pending از بخش ۲.۱ صفر شود.
- `GET /v1/notifications?limit=20&status=SENT` تازه‌ترین اعلان‌ها را نشان دهد.
- `GET /v1/ops/exceptions` برای بلوک `outbox_dead_letter` شمارش صفر یا فقط موارد عمداً بایگانی‌شده داشته باشد.
- یک سفارش آزمایشی ببندید و از رسیدن پیامک مطمئن شوید.

## ۴. بازگشت (Rollback)

- این ران‌بوک فقط وضعیت‌های صف را بین مقادیر مجاز `OutboxStatus` جابه‌جا می‌کند و سمت‌های مصرف‌کننده (اعلان/وب‌هک) را غیرمخرب (`idempotent-by-consumer`) فرض می‌کند؛ بازگشت ساختاری ندارد. اگر requeue اشتباهی انجام شد و نمی‌خواهید دسته‌ای پردازش شود، همان رویدادها را قبل از برداشت worker متوقف کنید:

```sql
UPDATE outbox_events
SET status = 'DEAD_LETTER'
WHERE status = 'PENDING' AND id IN (...);
```

- اگر گمان می‌برید خود payloadها مشکل‌سازند (مثلاً وب‌هک مقصد را با ارسال انبوه می‌شکند)، متغیر `WEBHOOK_TARGET_URL` را در `.env` خالی و با `up -d --force-recreate worker` اعلان‌ها را از وب‌هک جدا کنید تا صف اعلان‌ها تخلیه شود.
- در هیچ شرایطی رویداد `PROCESSED` را به `PENDING` برنگردانید — باعث ارسال دوباره اعلان به مشتری می‌شود.

## ۵. پیگیری و پیشگیری

- مانیتورینگ روی متریک «تعداد `PENDING` با `available_at` > ۵ دقیقه» و «قدیمی‌ترین رکورد `PROCESSING`» ببندید و آلارم ۵ دقیقه‌ای بگذارید.
- ری‌استارت‌های مکرر worker را ردیابی کنید؛ الگوی تکرار معمولاً نشانه OOM یا قطعی intermitent شبکه به DB است.
- پس از هر incident، سناریوی خرابی (بدون DB، بدون وب‌هک، payload بد) را در تست worker بازتولید کنید.
