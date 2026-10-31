---
name: playwright-commerce-e2e
description: ساخت تست‌های پایدار end-to-end با Playwright برای journeyهای واقعی فروشگاه و پنل عملیاتی.
---

# playwright-commerce-e2e

## هدف

اثبات عملکرد خرید از ابتدا تا انتها در محیط کنترل‌شده و جلوگیری از regression در release.

## زمان استفاده

P00، P07، P15، P16 و برای featureهای پرریسک بعدی.

## ورودی‌های موردنیاز

Test environment، seeded fixtures، DB isolation، provider sandbox/mock contract، user roles و acceptance criteria.

## فایل‌ها و ماژول‌های مرتبط

apps/*/e2e، playwright.config، test fixtures، seed/test utilities و CI workflows.

## روش اجرای مرحله‌ای

1. Test pyramid را رعایت کن؛ E2E را برای journeyهای حیاتی نگه دار.
2. محیط تست مستقل و داده قابل reset بساز؛ هیچگاه به production data دست نزن.
3. Golden Purchase از product discovery تا order confirmation و account tracking تعریف کن.
4. سناریوهای guest/user، out-of-stock، invalid coupon، payment decline/timeout و duplicate submit اضافه کن.
5. Admin flows برای product publish، inventory update، refund و role denial را پوشش بده.
6. selectorها را با role/label/testid پایدار بساز؛ از sleep ثابت و CSS brittle دوری کن.
7. trace، screenshot، video و network console را در failure جمع کن؛ secret را redact کن.
8. تست‌ها را در CI با shard/retry کنترل‌شده اجرا و flakiness را ثبت کن.

## قوانین غیرقابل مذاکره

1. تست سبز با mock-only نباید readiness پرداخت زنده را اثبات کند.
2. SKIP/BLOCKED علت‌دار و قابل مشاهده باشد؛ در release gate حیاتی ممنوع است.
3. تست مستقل و idempotent باشد و ترتیب اجرا را نیاز نداشته باشد.

## تست‌ها و اعتبارسنجی

Playwright smoke, golden purchase, admin workflows, mobile viewport, accessibility snapshot and API integration.

## معیار پذیرش

Journeyهای P0 در CI قابل تکرار و بدون flaky test بحرانی پاس شوند؛ artifact failure ذخیره شود.

## شواهد تحویل

Test report، trace zip، screenshots، CI URL و فهرست SKIP/BLOCKED.

## کارهایی که نباید انجام شوند

تست را با sleep یا catch خالی سبز نکن؛ credential واقعی را hardcode نکن.

## قالب گزارش اجرای Skill

```text
Skill: playwright-commerce-e2e
Task IDs:
Files inspected/changed:
Decisions / ADRs:
Tests executed + exact result:
Blocked / skipped items + reason:
Security / tenant / accessibility impact:
Evidence links or artifact paths:
Remaining risks:
Status: TODO | IN_PROGRESS | BLOCKED | IN_REVIEW | DONE | DEFERRED
```
