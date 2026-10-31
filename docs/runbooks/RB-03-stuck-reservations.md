# RB-03 — رزروهای گیرکرده انبار (Stuck Reservations)

| فیلد | مقدار |
|---|---|
| شناسه | RB-03 |
| شدت | متوسط تا بالا — موجودی قابل فروش کاذب (نمایش ناکافی) و تجربه خراب خرید بعدی |
| دامنه | `inventory_reservations` · `inventory_reservation_lines` · `inventory_levels` |
| سرویس‌ها | `worker` · `postgres` |
| SLO حل | حداکثر ۱۵ دقیقه از لحظه شناسایی |

## ۱. علائم (Symptoms)

- `reservedQty` در `inventory_levels` بالا و پابرجاست، اما سفارش معتبری برای آن‌ها ثبت نشده است (سفارش‌های مرتبط `CANCELLED` یا بدون سفارش‌اند).
- بلوک «رزروهای گیرکرده انبار» (`stuck_reservations`) در گام استثناهای مرکز عملیات `GET /v1/ops/exceptions` شمارش غیرصفر دارد. تعریف استعلام این بلوک: `status = 'ACTIVE'` و `expires_at < NOW()` — یعنی رزروی که باید آزاد شده باشد ولی نگردیده است.
- مشتری موقع خرید پیام «موجودی کافی نیست» می‌گیرد در حالی که فیزیکی انبار کالا موجود است (TTL رزرو ۱۵ دقیقه‌ای آزاد نشده).
- لاگ worker مدت‌هاست هیچ خط `[Worker …] Expiring inventory reservation:` چاپ نمی‌کند.

## ۲. تشخیص (Diagnosis)

### ۲.۱ رزروهای منقضی‌شده اما هنوز ACTIVE

```sql
SELECT r.id, r.tenant_id, r.store_id, r.status, r.expires_at, r.created_at,
       (SELECT count(*) FROM inventory_reservation_lines l WHERE l.reservation_id = r.id) AS lines
FROM inventory_reservations r
WHERE r.status = 'ACTIVE' AND r.expires_at <= NOW()
ORDER BY r.expires_at ASC;
```

این خروجی باید با `items` بلوک `stuck_reservations` در `GET /v1/ops/exceptions` هم‌خوان باشد (هر دو، قدیمی‌ترین‌ها را با `expires_at` صعودی می‌دهند).

### ۲.۲ کالای اشتباه قفل‌شده

```sql
-- واریانت‌هایی که reservedQty قابل توجه اما فروش فعال کم دارند
SELECT il.variant_id, il.on_hand, il.reserved_qty,
       (SELECT count(*) FROM inventory_reservations r
         JOIN inventory_reservation_lines l ON l.reservation_id = r.id
        WHERE l.variant_id = il.variant_id AND r.status = 'ACTIVE') AS active_reservations
FROM inventory_levels il
WHERE il.reserved_qty > 0
ORDER BY il.reserved_qty DESC
LIMIT 25;
```

### ۲.۳ سلامت worker (علت ریشه‌ای رایج)

sweep انقضای رزروها (`sweepExpiredReservations`) بخشی از حلقه worker است؛ اگر worker مرده یا بی‌حرکت باشد، رزروها منقضی می‌شوند ولی آزاد نمی‌شوند:

```bash
docker compose -f docker-compose.prod.yml ps worker
docker compose -f docker-compose.prod.yml logs --tail 200 worker
```

اگر لاگ worker پر از خطا یا بی‌حرکت است، اول ران‌بوک RB-02 را اجرا کنید (worker سالم به‌طور خودکار هر دو صف را می‌گرداند).

## ۳. اقدام (Action)

### گام ۱ — ترجیحی: اجرای sweep به‌صورت دستی

اگر worker زنده است ولی عقب افتاده، اجرای دستی همان تابع را انتخاب کنید (مسیر منطق: `apps/worker/src/worker-entrypoint.ts` — کسر `reservedQty` با `GREATEST(0, ...)` در یک تراکنش، سپس `status = 'EXPIRED'`). معادل عملیاتی از داخل کانتینر:

```bash
# اجرای یک‌باره sweep با اسکریپت یک‌خطی (بدون ری‌استارت worker)
docker compose -f docker-compose.prod.yml exec -e NODE_ENV=development api \
  pnpm exec tsx -e "import('./apps/worker/src/worker-entrypoint.ts')"
```

اگر دسترسی به اسکریپت ممکن نیست یا ترجیح می‌دهید کنترل کامل داشته باشید، همان گذار را با تراکنش SQL انجام دهید — دقیقاً با همان قواعد worker:

### گام ۲ — جایگزین: آزادسازی SQL تراکنشی

> فقط رزروهایی که `expires_at <= NOW()` و `status = 'ACTIVE'` دارند. رزروهای فعال در جریان چک‌اوت را هرگز دست نزنید.

```sql
BEGIN;

-- 1) کسر رزرو از سطح انبار (ایمن به سناریوی کسر دوباره)
UPDATE inventory_levels il
SET reserved_qty = GREATEST(0, il.reserved_qty - l.reserved_qty)
FROM inventory_reservation_lines l
JOIN inventory_reservations r ON r.id = l.reservation_id
WHERE r.status = 'ACTIVE' AND r.expires_at <= NOW()
  AND l.variant_id = il.variant_id
  AND il.tenant_id = r.tenant_id AND il.store_id = r.store_id;

-- 2) نهایی‌کردن خود رزروها
UPDATE inventory_reservations
SET status = 'EXPIRED', updated_at = NOW()
WHERE status = 'ACTIVE' AND expires_at <= NOW();

COMMIT;
```

پس از اجرا، `SELECT count(*)` بخش ۲.۱ باید صفر شود و `GET /v1/ops/exceptions` بلوک `stuck_reservations` را خالی نشان دهد.

### گام ۳ — بازگرداندن worker به چرخه

- اگر worker مرده بود: `docker compose -f docker-compose.prod.yml restart worker` و پایش لاگ برای دیدن خطوط `Expiring inventory reservation`.
- اگر worker زنده بود و رزروهای تازه دوباره گیر کرد، رقابت قفل‌ها را بررسی کنید: خطاهای `lock timeout` یا اتصال‌های پرشده Postgres (`.env` → `DATABASE_URL`، تنظیم `max_connections`) را بازبینی کنید.

### گام ۴ — تأیید ذهنی مسیر فروش

یک واریانت تأثیرگرفته را در سبد آزمایشی بگذارید؛ پیام «موجودی کافی نیست» باید برطرف شده باشد.

## ۴. بازگشت (Rollback)

- آزادسازی رزرو، «کم‌کردن» اطلاعات نیست — فقط قفل مجازی TTLگذشته را برمی‌گرداند؛ روندهای پیش‌رو (سفارش‌های جدید) از آن سود می‌برند و بازگشت عملیاتی لازم ندارد.
- اگر اشتباهاً رزرو **فعال** (در جریان چک‌اوت) را آزاد کردید: آن سفارش در پرداخت با پیام خطای موجودی یا در تایید نهایی شکست می‌خورد. با `order_status_history` سفارش درگیر را پیدا کنید، به مشتری راهنمایی تلاش مجدد بدهید و اگر پرداخت او `CAPTURED` شده بود، طبق RB-01 تسویه/بازگشت را تکمیل کنید.
- هیچ‌گاه رکورد `inventory_reservations` را حذف نکنید؛ فقط گذار وضعیت (`ACTIVE → EXPIRED`) مجاز است — جدول باید ردپای کامل چرخه رزرو را نگه دارد.

## ۵. پیگیری و پیشگیری

- متریک «تعداد رزروهای `ACTIVE` با `expires_at` گذشته» را با آستانه ۵ دقیقه آلارم کنید.
- هر تغییر آینده در `worker` باید تست بلوک‌شده بودن (worker خاموش → رزرو انقضایی → روشن‌شدن → آزادسازی) را داشته باشد.
- نشانه تکرار مشکل در ساعات خرید، معمولاً نشانه توقف مکرر worker است؛ آن را با RB-02 ریشه‌یابی کنید.
