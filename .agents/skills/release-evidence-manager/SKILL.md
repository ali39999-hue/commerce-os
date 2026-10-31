---
name: release-evidence-manager
description: مدیریت شواهد، acceptance gates، Go/No-Go، release notes و traceability تسک‌ها تا انتشار.
---

# release-evidence-manager

## هدف

هر release قابل ممیزی و برگشت باشد و هیچ قابلیت نیمه‌کاره به‌عنوان تکمیل‌شده معرفی نشود.

## زمان استفاده

تمام فازها؛ با تمرکز ویژه بر P15، P16 و P17.

## ورودی‌های موردنیاز

Task IDs، PRs، CI runs، migrations، deployment diff، security/a11y/performance reports و owner approvals.

## فایل‌ها و ماژول‌های مرتبط

docs/releases، docs/qa، docs/adr، CI artifacts، changelog و release checklist.

## روش اجرای مرحله‌ای

1. برای هر تسک acceptance criteria و evidence required را قبل از کار ثبت کن.
2. PR را به Task ID، ADR، migration و test report متصل کن.
3. CI را بررسی کن و SKIP/BLOCKED/flaky را جداگانه فهرست کن.
4. migration، env changes، feature flags و rollback plan را preflight کن.
5. security, a11y, SEO, performance و Golden Purchase gateها را ارزیابی کن.
6. release note شامل user impact، breaking change، migration و known issue بنویس.
7. Go/No-Go را با نام owner و شواهد ثبت کن؛ تأیید مالک محصول را جداگانه بگیر.
8. پس از deploy smoke، metrics، error rate و order/payment reconciliation را verify کن.

## قوانین غیرقابل مذاکره

1. Agent حق ندارد از طرف مالک محصول مجوز release جعل کند.
2. منفی‌بودن تست یا نبود شواهد را با متن مثبت پنهان نکن.
3. release بدون rollback و observability plan برای تغییر پرریسک ممنوع است.
4. artifactها باید secret-free و قابل بازتولید باشند.

## تست‌ها و اعتبارسنجی

Checklist validation، CI status verification، migration rehearsal، smoke tests و post-deploy verification.

## معیار پذیرش

برای هر gate تصمیم Pass/Fail/Blocked مستند و تصمیم انتشار توسط فرد مجاز ثبت شده باشد.

## شواهد تحویل

Release dossier، PR links، CI artifacts، migration plan، smoke report و approval record.

## کارهایی که نباید انجام شوند

از green شدن build نتیجه نهایی بودن release نگیر؛ بدون اجازه push/deploy/release نکن.

## قالب گزارش اجرای Skill

```text
Skill: release-evidence-manager
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
