---
name: commerce-domain-modeling
description: طراحی و تکامل مدل دامنه، aggregateها، invariantها، state machineها، قراردادهای API و ADRهای Commerce OS.
---

# commerce-domain-modeling

## هدف

حفظ یکپارچگی مدل تجارت و مرزهای Modular Monolith و جلوگیری از منطق تکراری یا ناسازگار در اپ‌ها.

## زمان استفاده

P01، P03، P07، P10 و هر تغییر در محصول، سفارش، پرداخت، انبار، تخفیف، مشتری یا چندمستأجری.

## ورودی‌های موردنیاز

Use case، مدل فعلی Prisma، سرویس‌ها، eventها، ADRهای موجود، API contracts و نیاز tenant/market.

## فایل‌ها و ماژول‌های مرتبط

apps/api/src/modules/*، packages/domain، packages/finance، Prisma schema، migrations، docs/adr و OpenAPI/DTO.

## روش اجرای مرحله‌ای

1. Use case و actor، tenant، permission، ورودی/خروجی و حالت خطا را دقیق بنویس.
2. مالکیت داده و aggregate root را مشخص کن؛ invariantهای پول، stock، order و payment را ثبت کن.
3. مدل فعلی را قبل از افزودن entity بررسی کن؛ از ساخت مدل موازی برای مفهومی که وجود دارد بپرهیز.
4. State transitionها و command/query/eventها را تعریف و transition نامعتبر را رد کن.
5. transaction boundary، locking، idempotency، unique constraint و outbox را طراحی کن.
6. سازگاری migration و rollout/rollback را مشخص کن؛ تغییر چندمرحله‌ای را بر migration مخرب ترجیح بده.
7. ADR و قرارداد API را با مثال موفق و خطا به‌روزرسانی کن.

## قوانین غیرقابل مذاکره

1. Money هرگز Float/Double نباشد؛ precision، currency و rounding policy صریح باشد.
2. tenantId از context معتبر سرور استخراج شود و از ورودی قابل اعتماد کاربر پذیرفته نشود.
3. رویدادها و درخواست‌های مالی باید idempotent باشند.
4. Ledger append-only و inventory mutation transactional بماند.
5. هر ماژول فقط از قرارداد عمومی ماژول دیگر استفاده کند، نه جدول داخلی آن.

## تست‌ها و اعتبارسنجی

Unit برای invariantها، integration برای transaction/constraint، concurrency برای stock و payment، contract test برای API/event.

## معیار پذیرش

مدل بدون شکستن invariant، tenant isolation یا backward compatibility پیاده شده و ADR/مهاجرت/تست دارد.

## شواهد تحویل

ADR، دیاگرام sequence/state، migration diff، تست‌های concurrency و contract.

## کارهایی که نباید انجام شوند

برای هر endpoint یک جدول جدید نساز؛ بدون نیاز اندازه‌گیری‌شده Microservice اضافه نکن.

## قالب گزارش اجرای Skill

```text
Skill: commerce-domain-modeling
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
