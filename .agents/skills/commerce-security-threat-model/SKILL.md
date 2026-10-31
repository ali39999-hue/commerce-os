---
name: commerce-security-threat-model
description: Threat modeling و ممیزی امنیت Commerce OS با تمرکز بر tenant isolation، auth, payment, uploads, webhooks و secrets.
---

# commerce-security-threat-model

## هدف

کاهش سطح حمله و جلوگیری از دسترسی بین tenantها، تقلب پرداخت، SSRF، تزریق و افشای داده.

## زمان استفاده

P00، P14، P16 و قبل از اضافه کردن integration، upload یا عملیات حساس.

## ورودی‌های موردنیاز

Architecture/data-flow، role matrix، threat actors، auth/session config، payment/webhook flow و deployment topology.

## فایل‌ها و ماژول‌های مرتبط

API guards, auth, tenant context, Prisma query layer, upload, webhooks, env config, CI, infra manifests.

## روش اجرای مرحله‌ای

1. دارایی‌ها، مرزهای اعتماد، actorها و data flow را ترسیم کن.
2. STRIDE یا روش مشابه را برای هر flow اعمال و threatها را اولویت‌بندی کن.
3. tenant isolation را از HTTP context تا query/worker/cache/file بررسی کن.
4. AuthN/AuthZ، session/cookie، CSRF، CORS، rate limit و brute force را ارزیابی کن.
5. SSRF، file upload, path traversal، XSS، SQL injection و secret leakage را بررسی کن.
6. webhook signature/replay/idempotency و payment callback trust را تست کن.
7. dependency/container/secret scanning و backup access را بررسی کن.
8. برای هر finding راه‌حل، test، owner، due date و residual risk ثبت کن.

## قوانین غیرقابل مذاکره

1. پاسخ سرور باید fail-closed باشد.
2. CORS origin wildcard/true برای production ممنوع مگر با سیاست صریح و محدود.
3. هیچ secret یا PII خام در log/fixture/commit نماند.
4. admin UI permission به‌تنهایی کنترل امنیتی نیست.

## تست‌ها و اعتبارسنجی

Cross-tenant negative tests، authz matrix، webhook forgery/replay، SSRF/upload abuse، dependency scan و secret scan.

## معیار پذیرش

هیچ finding Critical/High حل‌نشده بدون risk acceptance رسمی باقی نماند؛ تست‌های tenant isolation پاس شوند.

## شواهد تحویل

Threat model، security report، sanitized test evidence، remediation PR و risk acceptance.

## کارهایی که نباید انجام شوند

اسکنر را به production مخرب متصل نکن؛ داده واقعی یا secret را به سرویس ثالث ارسال نکن.

## قالب گزارش اجرای Skill

```text
Skill: commerce-security-threat-model
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
