# راهنمای استقرار پروداکشن Commerce OS

این سند راهنمای اجرای پروداکشن کل پلتفرم با Docker Compose است. همه تصاویر از ریشه مخزن (کانتکست ریشهٔ مونوریپو pnpm) ساخته می‌شوند و هیچ Secretی داخل فایل‌های compose یا Dockerfile هاردکد نشده است؛ همه مقادیر از فایل `.env` ریشه خوانده می‌شوند.

معماری سرویس‌ها در `docker-compose.prod.yml`:

| سرویس | تصویر / بیلد | پورت میزبان | توضیح |
|---|---|---|---|
| `postgres` | `postgres:17-alpine` | بدون پورت بیرونی | پایگاه داده، همراه Volume و healthcheck |
| `redis` | `redis:7-alpine` | بدون پورت بیرونی | کش و صف، همراه Volume و healthcheck |
| `api` | بیلد از `apps/api/Dockerfile` | `4000` | NestJS با پیشوند `/v1` و اندپوینت سلامت `GET /v1/health` |
| `worker` | بیلد از `apps/worker/Dockerfile` | بدون پورت | پردازش Outbox/نوتیفیکیشن/Webhook (فقط پروسه، بدون HTTP) |
| `storefront` | بیلد از `apps/storefront/Dockerfile` | `3000` | Next.js 16 با خروجی standalone |
| `admin` | بیلد از `apps/admin/Dockerfile` | `3001` | Next.js 16 با خروجی standalone |

پورت‌های `5432` (Postgres) و `6379` (Redis) عمداً منتشر نشده‌اند و فقط از داخل شبکهٔ داخلی Compose قابل دسترس‌اند.

---

## ۱. پیش‌نیازها

- **Docker Engine 24+** و پلاگین **Docker Compose v2** (`docker compose version` برای بررسی).
- حدود **۴ گیگابایت رم آزاد** برای بیلد (بیلد Next.js و NestJS حافظه‌بر است) و **۱۰ گیگابایت فضای دیسک**.
- دسترسی به اینترنت برای دریافت ایمیج‌های پایه (`node:22-alpine`, `postgres:17-alpine`, `redis:7-alpine`) و پکیج‌های pnpm در زمان بیلد.
- Node.js نسخهٔ **۲۲ به بالا** و pnpm نسخهٔ **۱۲.۱۶.۱** فقط اگر بخواهید بیرون از Docker هم بیلد/تست کنید؛ داخل کانتینر همه‌چیز خودکار است (corepack نسخهٔ pnpm را از `packageManager` ریشه می‌خواند).
- یک سرور لینوکسی (Ubuntu/Debian مناسب است) با فایروال فعال؛ فقط پورت‌های `80`، `443` (و در صورت نیاز SSH) به بیرون باز باشند.

> نکتهٔ ویندوز: Dockerfileها برای **لینوکس/CI** نوشته شده‌اند (لینکر پیش‌فرض pnpm روی لینوکس درست کار می‌کند). اگر مجبور شدید روی ویندوز بیلد بگیرید و خطای پیدا نشدن ماژول‌های workspace گرفتید، به `pnpm install` داخل Dockerfile فلگ `--config.node-linker=hoisted` را اضافه کنید.

---

## ۲. تنظیم متغیرهای محیطی (`.env`)

از ریشهٔ پروژه شروع کنید:

```bash
cp .env.example .env
```

فایل `.env` را با مقادیر پروداکشن ویرایش کنید. **فایل `.env` هرگز نباید کامیت شود.** جدول کامل:

| متغیر | مثال مقدار پروداکشن | توضیح |
|---|---|---|
| `DATABASE_URL` | `postgresql://shop_user:STRONG_PASS@postgres:5432/commerce_os?schema=public` | اتصال به Postgres. **دقت کنید هاست باید نام سرویس یعنی `postgres` باشد، نه `localhost`.** باید با `POSTGRES_USER/PASSWORD/DB` سرویس postgres هم‌خوان باشد. |
| `REDIS_URL` | `redis://redis:6379` | اتصال به Redis؛ هاست باید `redis` باشد نه `localhost`. |
| `AUTH_SECRET` | ۶۴ کاراکتر hex — `openssl rand -hex 32` | کلید امضای توکن‌ها. **قبل از پروداکشن حتماً عوض شود.** |
| `ENCRYPTION_KEY` | ۶۴ کاراکتر hex (۳۲ بایت) — `openssl rand -hex 32` | کلید رمزنگاری داده‌های حساس. **قبل از پروداکشن حتماً عوض شود؛ بعد از شروع عملیات دیگر تغییر ندهید** (داده‌های رمزشده با کلید قبلی باز نمی‌شوند). |
| `JWT_EXPIRATION` | `7d` | مدت اعتبار توکن. |
| `PORT` | `4000` | پورت داخلی API (در compose به `4000:4000` مپ شده). |
| `ZARINPAL_MERCHANT_ID` | مرچنت‌آی‌دی واقعی زرین‌پال | درگاه پرداخت. |
| `ZARINPAL_SANDBOX` | `false` | **در پروداکشن حتماً `false`** (در `.env.example` برای توسعه `true` است). |
| `ZIBAL_MERCHANT_ID` / `ZIBAL_SANDBOX` | درگاه زیبال / `false` | درگاه پرداخت جایگزین. |
| `MERCHANT_CARD_NUMBER` / `MERCHANT_CARD_HOLDER` / `MERCHANT_BANK_NAME` / `MERCHANT_SHEBA` | اطلاعات واقعی کارت فروشنده | برای انتقال کارت‌به‌کارت سفارش‌های C2C. |
| `WEBHOOK_SECRET` | `openssl rand -hex 32` | امضای HMAC وب‌هوک‌های خروجی؛ هم API و هم worker این را می‌خوانند (اگر خالی باشد به `AUTH_SECRET` برمی‌گردد — در پروداکشن صریح ست کنید). |
| `WEBHOOK_TARGET_URL` | `https://target-system.example.com/hooks/commerce` | مقصد وب‌هوک‌های خروجی worker؛ باید از داخل شبکهٔ کانتینرها قابل دسترس باشد. |
| `NEXT_PUBLIC_API_URL` | `https://api.your-domain.ir` | آدرس عمومی API. **زمان بیلد در باندل کلاینت لحاظ می‌شود؛ قبل از `build` تنظیم کنید** (build arg). |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.ir` (استورفرانت) / `https://admin.your-domain.ir` (ادمین) | آدرس عمومی سایت/پنل برای SEO و لینک‌ها. **زمان بیلد لحاظ می‌شود؛ قبل از `build` تنظیم کنید** (build arg). |
| `CORS_ORIGINS` | `https://your-domain.ir,https://admin.your-domain.ir` | دامنه‌های مجاز CORS. ⚠️ در کد فعلی `main.ts` فعلاً CORS را باز (`origin: true`) فعال می‌کند؛ تا زمانی که این متغیر در کد اعمال شود، محدودسازی دامنه را **روی reverse proxy** انجام دهید (بخش ۸). |
| `STOREFRONT_API_URL` | `http://api:4000` | آدرس API برای fetch سمت سرور در استورفرانت (به‌صورت runtime خوانده می‌شود؛ داخل شبکه می‌توانید از `http://api:4000` استفاده کنید). |
| `STORE_SLUG` | شناسهٔ فروشگاه، مثلاً `demo` | فروشگاه فعال استورفرانت. |
| `POSTGRES_USER` | `shop_user` | فقط برای سرویس postgres (باید در `.env` اضافه شود؛ پیش‌فرض `postgres`). |
| `POSTGRES_PASSWORD` | `openssl rand -hex 16` | **اجباری** — اگر ست نباشد دستور `up` با خطا متوقف می‌شود. |
| `POSTGRES_DB` | `commerce_os` | نام پایگاه داده (پیش‌فرض `commerce_os`). |

نمونهٔ حداقلی بخش‌های حساس برای پروداکشن:

```dotenv
DATABASE_URL="postgresql://shop_user:<POSTGRES_PASSWORD>@postgres:5432/commerce_os?schema=public"
REDIS_URL="redis://redis:6379"
AUTH_SECRET="<openssl rand -hex 32>"
ENCRYPTION_KEY="<openssl rand -hex 32>"
WEBHOOK_SECRET="<openssl rand -hex 32>"
ZARINPAL_SANDBOX=false
NEXT_PUBLIC_API_URL="https://api.your-domain.ir"
NEXT_PUBLIC_SITE_URL="https://your-domain.ir"
POSTGRES_USER=shop_user
POSTGRES_PASSWORD="<openssl rand -hex 16>"
POSTGRES_DB=commerce_os
NODE_ENV=production
```

---

## ۳. ساخت تصاویر

از ریشهٔ مخزن:

```bash
docker compose -f docker-compose.prod.yml build
```

- بیلد multi-stage است: مرحلهٔ builder همهٔ پکیج‌های workspace وابسته را به‌ترتیب توپولوژیک کامپایل می‌کند (برای API: `domain → security → localization → finance → gateways → api` که خودش شامل `prisma generate` است).
- متغیرهای `NEXT_PUBLIC_*` در لحظهٔ بیلد داخل باندل جا می‌گیرند؛ **اگر این مقادیر را عوض کردید باید دوباره `build` بگیرید.**
- برای بیلد مجدد فقط یک سرویس:

```bash
docker compose -f docker-compose.prod.yml build api
docker compose -f docker-compose.prod.yml build storefront
```

---

## ۴. اجرا

```bash
docker compose -f docker-compose.prod.yml up -d
```

بررسی وضعیت (ستون `STATUS` باید `healthy` نشان دهد):

```bash
docker compose -f docker-compose.prod.yml ps
```

ترتیب راه‌اندازی خودکار است: postgres و redis تا healthy شدن صبر می‌کنند، بعد api و worker بالا می‌آیند (استورفرانت/ادمین مستقل‌اند).

---

## ۵. مایگریشن و Seed (بار اول)

**بار اول** (یا بعد از تغییر schema) اسکیمای Prisma را اعمال کنید. این دستور داخل کانتینر api اجرا می‌شود که pnpm، پرisma CLI و اسکیما را در اختیار دارد:

```bash
docker compose -f docker-compose.prod.yml exec api pnpm exec prisma db push
```

> پس از پایدار شدن، به‌جای `db push` برای اعمال مایگریشن‌های رسمی از `pnpm exec prisma migrate deploy` استفاده کنید (مایگریشن‌ها از پوشهٔ `apps/api/prisma/migrations` خوانده می‌شوند).

سپس دادهٔ اولیه (seed) را در صورت نیاز بارگذاری کنید. توجه: کد seed به‌صورت عمدی در محیط production متوقف می‌شود (`NODE_ENV=production` در کانتینر api ست شده)، بنابراین فقط اگر واقعاً می‌خواهید دادهٔ دموی اولیه را بارگذاری کنید، برای همان یک دستور `NODE_ENV` را بازنویسی کنید:

```bash
docker compose -f docker-compose.prod.yml exec -e NODE_ENV=development api pnpm exec tsx prisma/seed.ts
```

> ⚠️ Seed شامل دادهٔ نمونهٔ فروشگاه است؛ برای یک فروشگاه واقعی پروداکشن آن را اجرا نکنید و داده‌های واقعی را از پنل ادمین وارد کنید.

پس از آن، سلامت API را چک کنید:

```bash
curl -f http://127.0.0.1:4000/v1/health
# {"status":"ok","service":"commerce-os-api"}
```

اندپوینت آمادگی (چک اتصال واقعی به Postgres): `curl http://127.0.0.1:4000/v1/ready`

---

## ۶. لاگ‌ها و هلت‌چک

```bash
# لاگ زندهٔ همهٔ سرویس‌ها
docker compose -f docker-compose.prod.yml logs -f

# لاگ یک سرویس خاص (آخرین ۲۰۰ خط)
docker compose -f docker-compose.prod.yml logs -f --tail 200 api
docker compose -f docker-compose.prod.yml logs -f worker

# وضعیت healthcheck ها
docker compose -f docker-compose.prod.yml ps
docker inspect --format='{{json .State.Health}}' $(docker compose -f docker-compose.prod.yml ps -q api) | head
```

هلت‌چک‌های تعریف‌شده:

| سرویس | معیار سلامت |
|---|---|
| `postgres` | `pg_isready` |
| `redis` | `redis-cli ping` |
| `api` | `wget --spider http://127.0.0.1:4000/v1/health` هر ۳۰ ثانیه |
| `worker` | وجود پروسهٔ `node dist/worker-entrypoint.js` (`pgrep`) — worker سرور HTTP ندارد |
| `storefront` | `wget --spider http://127.0.0.1:3000/` |
| `admin` | `wget --spider http://127.0.0.1:3001/` |

راه‌اندازی مجدد یک سرویس پس از تغییر `.env`:

```bash
docker compose -f docker-compose.prod.yml up -d --force-recreate api
```

---

## ۷. بکاپ روزانه (pg_dump)

بکاپ فشردهٔ سفارشی‌شده از داخل کانتینر postgres (پورت لازم نیست باز باشد؛ `POSTGRES_USER`/`POSTGRES_DB` داخل کانتینر از env خوانده می‌شوند):

```bash
mkdir -p /var/backups/commerce_os
docker compose -f docker-compose.prod.yml exec -T postgres \
  sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' \
  > /var/backups/commerce_os/commerce_os_$(date +%F_%H%M).dump
```

بکاپ روزانه با cron (مثال ساعت ۲:۳۰ بامداد):

```bash
sudo crontab -e
```

```cron
30 2 * * * cd /path/to/shop && docker compose -f docker-compose.prod.yml exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > /var/backups/commerce_os/commerce_os_$(date +\%F).dump
```

بازگردانی (restore):

```bash
docker compose -f docker-compose.prod.yml exec -T postgres \
  sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists' \
  < /var/backups/commerce_os/commerce_os_2026-01-01.dump
```

نکات:

- فایل‌های بکاپ را روی سرور دیگری هم کپی کنید (قانون ۳-۲-۱) و رمزنگاری شوند.
- Volume دادهٔ Postgres در `postgres_data` و Volume Redis (با `appendonly yes`) در `redis_data` نگه داشته می‌شوند؛ Volumeها را با `docker compose down -v` حذف نکنید.
- فایل‌های `.dump` شامل دادهٔ مشتریان‌اند؛ دسترسی سرور بکاپ را هم محدود کنید.

---

## ۸. نکات امنیتی

1. **همهٔ Secretها را قبل از اولین پروداکشن عوض کنید** — مقادیر داخل `.env.example` فقط برای توسعهٔ لوکال‌اند: `AUTH_SECRET`، `ENCRYPTION_KEY`، `WEBHOOK_SECRET`، `POSTGRES_PASSWORD` و مرچنت‌آی‌دی‌های درگاه. با `openssl rand -hex 32` تولیدشان کنید.
2. **HTTPS و ترمینیشن TLS روی reverse proxy**: خود کانتینرها HTTP ساده سرو می‌کنند و پشت پروکسی می‌مانند. با Nginx یا Caddy جلوی سرویس‌ها را بگیرید (نمونهٔ Caddy که خودش گواهی Let's Encrypt می‌گیرد):

   ```
   your-domain.ir {
     reverse_proxy localhost:3000
   }
   admin.your-domain.ir {
     reverse_proxy localhost:3001
   }
   api.your-domain.ir {
     reverse_proxy localhost:4000
   }
   ```

   اگر Nginx ترجیح می‌دهید: سرورهای جدا برای هر دامنه + `proxy_pass` به همان پورت‌ها + هدرهای `X-Forwarded-For` / `X-Forwarded-Proto`، و گواهی با `certbot`. پورت‌های `80/443` را فقط از طریق پروکسی باز نگه دارید و پورت‌های مستقیم کانتینرها را از اینترنت فایروال کنید.
3. **`CORS_ORIGINS` را به دامنه‌های واقعی محدود کنید** و تا زمان اعمال آن در کد، روی reverse proxy هدر `Origin` را برای `/v1/*` فیلتر کنید. وضعیت فعلی کد (CORS باز با `origin: true`) برای پروداکشن مناسب نیست.
4. **پورت‌های ۵۴۳۲ و ۶۳۷۹ منتشر نمی‌شوند** — این وضعیت را حفظ کنید (`docker-compose.prod.yml` عمداً برایشان `ports` ندارد).
5. **`.env` را هرگز کامیت/اشتراک نکنید**؛ چرخش دوره‌ای Secretها را برنامه‌ریزی کنید. تغییر `AUTH_SECRET` باعث خروج همهٔ نشست‌ها می‌شود؛ تغییر `ENCRYPTION_KEY` دادهٔ رمزشدهٔ قبلی را غیرقابل خواندن می‌کند.
6. همهٔ کانتینرهای اپلیکیشن با کاربر غیر root (`node`) اجرا می‌شوند و تصاویر multi-stage هستند (ابزار بیلد داخل ایمیج نهایی نیست) — این وضعیت را در تغییرات آینده حفظ کنید.
7. `ZARINPAL_SANDBOX=false` و بقیهٔ درگاه‌ها هم روی حالت واقعی باشند؛ `WEBHOOK_TARGET_URL` باید از داخل سرور قابل دسترس و روی HTTPS باشد.
8. پیش از هر استقرار، ایمیج‌های پایه را به‌روز کنید: `docker compose -f docker-compose.prod.yml build --pull`.

---

## ۹. به‌روزرسانی نسخه (خلاصهٔ عملیاتی)

```bash
cd /path/to/shop
git pull                      # یا دریافت نسخهٔ جدید
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml exec api pnpm exec prisma migrate deploy   # اگر مایگریشن جدید هست
docker compose -f docker-compose.prod.yml ps   # تأیید سلامت
```
