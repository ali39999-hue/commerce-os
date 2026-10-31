# RB-06 — پشتیبان‌گیری و بازیابی (Backup / Restore)

| فیلد | مقدار |
|---|---|
| شناسه | RB-06 |
| شدت | بحرانی در اجرا (Restore) / متوسط در نگهداری (Backup) |
| دامنه | `postgres_data` (تمام جداول تجاری: سفارش‌ها، دفترکل، رزروها، کاربران) · `redis_data` (کش و صف‌های قابل بازسازی) |
| سرویس‌ها | `postgres` · `docker compose` · host نگهدارنده بکاپ |
| اهداف بازیابی | **RPO ≤ ۱ ساعت** (حداکثر داده از‌دست‌رفته) · **RTO ≤ ۴ ساعت** (حداکثر زمان بازگشت سرویس) |

## ۱. علائم (Symptoms) — کی این ران‌بوک را اجرا کنیم؟

- خرابی دیسک/سرور، حذف تصادفی Volume (`postgres_data`)، خرابی schema پس از تغییر خطرناک، یا داده خراب (مثلاً دفترکل ناپایدار) که فقط با بازیابی نقطه‌ای قابل جبران است.
- برای حالت نگهداری: انقضای آخرین بکاپ موفق، شکست cron بکاپ، یا نوبت تمرین فصلی restore.
- نشانه هشدار: فایل `commerce_os_<date>.dump` امروز ساخته نشده یا حجم آن ناهنجار (خیلی کوچک) است.

## ۲. تشخیص (Diagnosis) — سالم بودن زنجیره بکاپ

### ۲.۱ روزانه

```bash
ls -lh /var/backups/commerce_os/ | tail -5
# فایل امروز باید موجود و در حد معمول باشد
sha256sum /var/backups/commerce_os/commerce_os_$(date +%F).dump
```

- checksum را همان لحظه کنار فایل بنویسید (فایل‌های `*.sha256`) و در off-host هم کپی کنید — الگوی ذخیره‌سازی ۳-۲-۱: سه نسخه، دو رسانه، یک نسخه خارج از سرور اصلی.

### ۲.۲ هفتگی

- کپی off-host (سرور دوم / object storage رمزنگاری‌شده) را تأیید کنید: حجم + checksum برابر نسخه اصلی.
- `pg_restore --list` روی جدیدترین فایل (فقط خواندن، بدون restore) تا سلامت ساختاری فایل dump ثابت شود:

```bash
pg_restore --list /var/backups/commerce_os/commerce_os_$(date +%F).dump | head -20
```

### ۲.۳ فصلی (الزام تمرین Restore)

- تمرین کامل بازیابی در **staging** (نه پروداکشن) با فایل بکاپ واقعی، طبق گام‌های بخش ۳، و ثبت نتیجه (زمان کل، خطاها) در گزارش تمرین. RTO واقعی اندازه‌گیری‌شده در تمرین باید ≤ ۴ ساعت بماند.

## ۳. اقدام (Action) — بکاپ‌گیری و بازیابی گام‌به‌گام

### بخش A — بکاپ روزانه (نرمال)

```bash
mkdir -p /var/backups/commerce_os

# بکاپ فشرده سفارشی‌شده از داخل کانتینر (پورت Postgres لازم نیست باز باشد)
docker compose -f docker-compose.prod.yml exec -T postgres \
  sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' \
  > /var/backups/commerce_os/commerce_os_$(date +%F_%H%M).dump

# checksum و ثبت کنار فایل
sha256sum /var/backups/commerce_os/commerce_os_$(date +%F_%H%M).dump \
  > /var/backups/commerce_os/commerce_os_$(date +%F_%H%M).dump.sha256
```

cron روزانه (ساعت کم‌ترافیک، مثلاً ۲:۳۰ بامداد) + انتقال off-host در همان cron:

```cron
30 2 * * * cd /path/to/shop && docker compose -f docker-compose.prod.yml exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > /var/backups/commerce_os/commerce_os_$(date +\%F).dump && sha256sum /var/backups/commerce_os/commerce_os_$(date +\%F).dump > /var/backups/commerce_os/commerce_os_$(date +\%F).dump.sha256
0  3 * * * rsync -a --checksum /var/backups/commerce_os/ backup-host:/srv/commerce_os_backups/
```

> برای رسیدن به RPO ≤ ۱ ساعت در صورت الزام تجاری، فرکانس cron را به ساعتی ببرید (فایل‌های dump فشرده‌اند و از جدول‌های بزرگ سریع خارج می‌شوند) و نگهداری ۷ روز محلی + ۳۰ روز off-host را حفظ کنید.

### بخش B — بازیابی گام‌به‌گام (Restore)

> پیش‌فرض: همان سرور پروداکشن یا سرور جایگزین با `docker-compose.prod.yml` و `.env` سالم. زمان هدف هر گام در پرانتز.

**گام ۱ — مهار و ارزیابی (۱۰ دقیقه).** سرویس‌های نوشتار را متوقف کنید تا هیچ سفارش/پرداخت جدیدی به دیتای معیوب اضافه نشود:

```bash
docker compose -f docker-compose.prod.yml stop worker api
docker compose -f docker-compose.prod.yml ps   # فقط postgres و redis و فرانت‌ها باید بمانند
```

فایل بکاپ هدف را انتخاب کنید (آخرین بکاپ سالم قبل از رخداد) و checksum آن را صحت‌سنجی کنید:

```bash
sha256sum -c /var/backups/commerce_os/commerce_os_<DATE>.dump.sha256
```

**گام ۲ — آماده‌سازی دیتابیس (۱۰ دقیقه).** Volume فعلی را در صورت خرابی کامل پاک یا فقط دیتا را بازنویسی کنید. برای بازنویسی روی همان پایگاه:

```bash
# قطع اتصال‌های فعال و اطمینان از پاک‌سازی schema توسط pg_restore --clean
docker compose -f docker-compose.prod.yml exec postgres \
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid();"
```

**گام ۳ — بازگردانی کامل (۳۰ تا ۹۰ دقیقه بسته به حجم).**

```bash
docker compose -f docker-compose.prod.yml exec -T postgres \
  sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists' \
  < /var/backups/commerce_os/commerce_os_<DATE>.dump
```

پرچم‌ها: `--clean` اشیای موجود را قبل از ساخت می‌اندازد، `--if-exists` خطای نبود شیء را بی‌اثر می‌کند. خطایهای غیربازدارنده (`warnings`) را یادداشت کنید؛ خطاهای بحرانی (`FATAL`) بازیابی را متوقف می‌کنند.

**گام ۴ — صحت‌سنجی داده (۲۰ دقیقه).** از داخل کانتینر postgres:

```bash
docker compose -f docker-compose.prod.yml exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<'SQL'
-- شمارش جداول تجاری غیرصفر و منطقی
SELECT (SELECT count(*) FROM orders)      AS orders,
       (SELECT count(*) FROM order_lines) AS order_lines,
       (SELECT count(*) FROM payment_intents) AS payment_intents,
       (SELECT count(*) FROM ledger_entries)  AS ledger_entries,
       (SELECT count(*) FROM users)           AS users;
-- توازن دفترکل (الزام سند معماری): باید صفر باشد
SELECT COALESCE(SUM(CASE direction WHEN 'DEBIT' THEN amount ELSE -amount END), 0) AS balance_check
FROM ledger_entries;
-- سفارش‌های بی‌قاعده پس از بازیابی
SELECT count(*) FROM orders WHERE status = 'PENDING_PAYMENT';
SQL
```

**گام ۵ — بازگشت سرویس‌ها (۱۰ دقیقه).**

```bash
docker compose -f docker-compose.prod.yml start api worker
curl -f http://127.0.0.1:4000/v1/ready        # {"status":"ready",...}
node scripts/e2e-golden-path.mjs              # مسیر طلایی سبز
docker compose -f docker-compose.prod.yml logs --tail 50 worker   # چرخه عادی Outbox/رزرو
```

**گام ۶ — تسویه پس از بازیابی.**

- فاصله زمانی بین بکاپ هدف و لحظه حادثه = داده از‌دست‌رفته؛ سفارش‌های آن پنجره را از لاگ درگاه/پیامک‌ها فهرست و با RB-01 بازسازی یا به مشتری اطلاع دهید.
- `outbox_events` و `webhook_deliveries` و `inventory_reservations` داده‌های ناهم‌زمان دارند؛ `GET /v1/ops/exceptions` را چک کنید و صف‌ها را طبق RB-02/RB-03 تخلیه کنید.
- نشست‌های کاربران با بکاپ قدیمی ممکن است معتبر بمانند؛ در حادثه امنیتی `TRUNCATE user_sessions` را طبق RB-05 اعمال کنید.

### بخش C — بازیابی در سرور جدید (کاملاً جایگزین)

1. سرور تازه: Docker + Compose، `git clone` مخزن، `cp .env.example .env` و مقادیر پروداکشن (Secretها از مدیر رمز، نه از نسخه افشاشده).
2. فقط زیرساخت را بالا بیاورید: `docker compose -f docker-compose.prod.yml up -d postgres redis`.
3. گام ۳ همان بخش B (pg_restore روی پایگاه تازه — بدون نیاز به `--clean`).
4. سپس `build` و `up -d` بقیه سرویس‌ها و گام‌های ۴ تا ۶.
5. DNS/reverse proxy را به سرور تازه سوییچ کنید.

## ۴. بازگشت (Rollback)

- بازیابی یک‌طرفه است (دیتای فعلی با `--clean` بازنویسی می‌شود)؛ لذا **قبل از هر restore روی پروداکشن، از وضعیت فعلی هم یک dump اضطراری بگیرید** تا اگر بازیابی ناموفق/نادرست بود، بتوانید به وضعیت حادثه برگردید:

```bash
docker compose -f docker-compose.prod.yml exec -T postgres \
  sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' \
  > /var/backups/commerce_os/pre_restore_$(date +%F_%H%M).dump
```

- اگر پس از بازیابی، سرویس‌ها سالم بالا نیامدند: لاگ api/worker را برای خطای schema/اتصال بررسی کنید؛ رایج‌ترین علت، `.env` ناسازگار (هاست `postgres` به‌جای `localhost`) است.
- اگر بازیابی ناقص ماند (خطاهای restore): فایل dump قبلی‌تر را امتحان کنید و جدول‌های آسیب‌دیده را هدفمند از `pg_restore --list` بازیابی کنید (`pg_restore -t table_name ...`).

## ۵. پیگیری و پیشگیری

- داشبورد بکاپ: عمر آخرین فایل موفق + آخرین checksum تأییدشده + آخرین تمرین restore موفق.
- هرگز `docker compose down -v` روی پروداکشن اجرا نکنید (حذف `postgres_data` و `redis_data`).
- فایل‌های `.dump` شامل داده مشتری‌اند؛ رسانه off-host باید رمزنگاری‌شده و دسترسی‌اش محدود باشد.
- گزارش تمرین فصلی (تاریخ، نسخه بکاپ، مدت هر گام، انحراف از RTO) را آرشیو کنید؛ هر تمرین باید حداقل یک بهبود (ساده‌سازی اسکریپت، cron، آلارم) تولید کند.
