---
name: commerce-os-repo-audit
description: ممیزی شواهد‌محور مخزن Commerce OS پیش از هر تغییر؛ بررسی ساختار، تست، دیتابیس، مسیرهای دمو، قراردادها، امنیت و ثبت شکاف‌ها.
---

# commerce-os-repo-audit

## هدف

تبدیل وضعیت واقعی مخزن به یک خط مبنای قابل‌تکرار؛ بدون فرض گرفتن ادعاهای README یا شمارش فایل‌ها به‌عنوان قابلیت عملیاتی.

## زمان استفاده

در P00، ابتدای هر فاز، پیش از تغییر ماژول ناشناخته و هنگام بازبینی PR.

## ورودی‌های موردنیاز

Roadmap اصلی، Git status/branch، package manifests، Prisma schema/migrations، کد API و UI، env example، تست‌ها و گزارش CI.

## فایل‌ها و ماژول‌های مرتبط

apps/*، packages/*، docs/، scripts/، prisma/schema.prisma، migrations، workflows و package.jsonهای ریشه/اپلیکیشن.

## روش اجرای مرحله‌ای

1. نقشه monorepo، نسخه runtime، package manager، اپ‌ها و packageهای workspace را استخراج کن.
2. برای هر قابلیت، مسیر UI → API/Server Action → Domain → persistence → external provider را دنبال کن.
3. تمام TODO، mock، demo، seeded data، local state، hard-coded response، fallback و SKIP را جست‌وجو و با محیط اجرا تطبیق بده.
4. تست‌های unit/integration/e2e را اجرا کن؛ تستی که به دلیل نبود DB یا secret اجرا نشده باید BLOCKED باشد، نه PASS.
5. Prisma model، migration، index، relation، tenant scope و transaction boundary را با رفتار runtime مقایسه کن.
6. ریسک‌های امنیتی، دسترس‌پذیری، SEO و performance را با شواهد ثبت کن.
7. گزارش AUD-xxx بساز: شدت، شواهد، اثر کسب‌وکار، مسیر فایل، اقدام، وابستگی و معیار پذیرش.

## قوانین غیرقابل مذاکره

1. هر یافته باید path + symbol/line + روش بازتولید داشته باشد.
2. README و comment فقط سرنخ‌اند، نه اثبات.
3. داده محرمانه، token یا مقدار واقعی env را در گزارش چاپ نکن.
4. بدون اجازه مالک محصول push، deploy یا migration مخرب انجام نده.

## تست‌ها و اعتبارسنجی

اجرای موجود lint/typecheck/unit/integration و golden purchase؛ ثبت دقیق command، exit code، مدت و موارد اجرا نشده.

## معیار پذیرش

خط مبنای ساختار، قابلیت‌های عملیاتی، شکاف‌ها، ریسک‌ها و تست‌ها قابل تکرار و اولویت‌بندی شده باشد.

## شواهد تحویل

docs/audits/YYYY-MM-DD-baseline.md، جدول issueهای AUD، خروجی CI بدون secret و نمودار مسیر داده.

## کارهایی که نباید انجام شوند

فقط با شمارش مدل‌ها یا صفحات، قابلیت را کامل اعلام نکن؛ fallback را به‌عنوان موفقیت گزارش نده.

## قالب گزارش اجرای Skill

```text
Skill: commerce-os-repo-audit
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
