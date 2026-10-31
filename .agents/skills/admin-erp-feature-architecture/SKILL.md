---
name: admin-erp-feature-architecture
description: طراحی Admin/ERP با workflowهای عملیاتی واقعی، تفکیک feature، permission-aware UI، audit و مدیریت خطا.
---

# admin-erp-feature-architecture

## هدف

تبدیل پنل از demo/dashboard بزرگ به محیط کار روزانه قابل‌اعتماد، قابل‌ممیزی و قابل‌گسترش.

## زمان استفاده

P11 و برای هر ماژول admin مانند catalog، orders، inventory، finance، customers، promotions و vendors.

## ورودی‌های موردنیاز

نقش‌ها و مجوزها، SOP عملیاتی، API contract، data volume، audit policy و component system.

## فایل‌ها و ماژول‌های مرتبط

apps/admin/app، features، server actions/API client، packages/ui، authorization و audit module.

## روش اجرای مرحله‌ای

1. Actor، permission، workflow، approval، exception و audit requirement را برای هر feature تعریف کن.
2. صفحه بزرگ را بر اساس business capability به route/layout/component/hook/service تفکیک کن.
3. demo state و fixture را از runtime production جدا و به تست منتقل کن.
4. table/filter/search/bulk action/export را با pagination server-side بساز.
5. هر mutation را با optimistic/conservative update مناسب، confirmation و error recovery طراحی کن.
6. empty/loading/error/permission-denied state را تکمیل کن.
7. audit trail و actor attribution را به عملیات حساس متصل کن.
8. برای کارهای طولانی background job و status/progress قابل مشاهده فراهم کن.

## قوانین غیرقابل مذاکره

1. UI permission جای authorization سرور نیست.
2. داده admin نیز باید tenant scoped باشد.
3. عمليات حساس بدون audit log و actor انجام نشود.
4. bulk action باید preview، محدودیت و نتیجه جزئی داشته باشد.

## تست‌ها و اعتبارسنجی

Role matrix، tenant leakage، denied action، pagination/filter، audit attribution و workflow E2E.

## معیار پذیرش

هر تب Admin به API/DB واقعی وصل، permission-checked و دارای خطا/بارگذاری/audit است.

## شواهد تحویل

Permission matrix، workflow diagram، screenshots، audit events و tests.

## کارهایی که نباید انجام شوند

همه قابلیت‌ها را در یک صفحه/فایل عظیم انباشته نکن؛ صفر پیش‌فرض یا mock را داده واقعی نشان نده.

## قالب گزارش اجرای Skill

```text
Skill: admin-erp-feature-architecture
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
