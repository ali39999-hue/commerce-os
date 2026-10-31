---
name: checkout-payment-integrity
description: پیاده‌سازی و ممیزی مطمئن cart، checkout، order، payment، refund، ledger و stock reservation.
---

# checkout-payment-integrity

## هدف

جلوگیری از سفارش/پرداخت تکراری، oversell، اختلاف مبلغ و وضعیت‌های غیرقابل‌تطبیق.

## زمان استفاده

P07، P14، P15 و هر تغییر در قیمت، تخفیف، مالیات، انبار، provider یا refund.

## ورودی‌های موردنیاز

Payment provider docs، order state machine، finance/ledger API، inventory service، currency/tax rules و webhook contracts.

## فایل‌ها و ماژول‌های مرتبط

API cart/checkout/orders/payments/inventory/finance، worker/outbox، packages/finance و storefront checkout.

## روش اجرای مرحله‌ای

1. مسیر quote → cart validation → stock reservation → order creation → payment intent → webhook → capture/confirmation را ترسیم کن.
2. محاسبه نهایی قیمت، تخفیف، مالیات، ارسال و currency را server-side انجام بده.
3. کلید idempotency برای create/confirm/capture/refund و webhook deduplication اضافه/تایید کن.
4. stock reservation دارای TTL، release و concurrency guard تعریف کن.
5. transitionهای order و payment را مستقل اما سازگار نگه دار.
6. هر حرکت مالی را از مسیر ledger و reconciliation ثبت کن.
7. حالات timeout، duplicate webhook، provider pending، decline، partial refund و retry را تست کن.
8. UI باید status واقعی را نشان دهد؛ redirect موفق به‌تنهایی اثبات پرداخت نیست.

## قوانین غیرقابل مذاکره

1. اطلاعات کارت خام را ذخیره یا log نکن؛ از hosted/tokenized provider flow استفاده کن.
2. هرگز مبلغ client را منبع حقیقت ندان.
3. تراکنش‌های مالی append-only و قابل reconciliation باشند.
4. webhook signature، timestamp، replay protection و tenant/provider mapping کنترل شود.

## تست‌ها و اعتبارسنجی

Duplicate request/webhook، race condition، stock oversell، rounding/currency، partial refund، provider timeout و ledger reconciliation.

## معیار پذیرش

Golden Purchase و همه failure pathها بدون duplicate charge/order یا ناهماهنگی inventory/ledger پاس شوند.

## شواهد تحویل

Sequence diagram، idempotency tests، reconciliation report، sanitized webhook trace و E2E.

## کارهایی که نباید انجام شوند

با mock موفقیت را در production شبیه‌سازی نکن؛ provider sandbox را با live اشتباه نگیر.

## قالب گزارش اجرای Skill

```text
Skill: checkout-payment-integrity
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
