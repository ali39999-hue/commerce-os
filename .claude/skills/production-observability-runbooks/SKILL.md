---
name: production-observability-runbooks
description: طراحی logging، metrics، tracing، alerting، SLO، backup، restore و runbook برای عملیات Production.
---

# production-observability-runbooks

## هدف

قابلیت کشف، تشخیص و بازیابی خطاهای سفارش، پرداخت، انبار، worker و تجربه کاربر.

## زمان استفاده

P16 و هنگام افزودن critical path یا integration بیرونی.

## ورودی‌های موردنیاز

Service topology، risk register، expected traffic، SLO، deployment setup، DB/Redis/provider dependencies.

## فایل‌ها و ماژول‌های مرتبط

API/worker logging، telemetry package، health checks، dashboards، alerts، infra configs و docs/runbooks.

## روش اجرای مرحله‌ای

1. Golden signals و domain metrics برای checkout, payment, inventory, queue و DB تعریف کن.
2. structured logs با correlation/request/order/payment id و redaction بساز.
3. distributed trace را از storefront/API تا DB/provider/outbox برقرار کن.
4. SLO و alert threshold را بر اساس error budget و business impact تعریف کن.
5. داشبورد برای request latency/error، payment mismatch، stale outbox، DLQ، stock conflicts و DB saturation بساز.
6. Runbook هر alert را با تشخیص، containment، recovery، escalation و verification بنویس.
7. backup policy، retention، encryption و restore drill زمان‌بندی کن.
8. incident simulation و postmortem بدون سرزنش اجرا کن.

## قوانین غیرقابل مذاکره

1. PII، card data، secret و payload حساس را log نکن.
2. Alert باید actionable باشد، نه صرفاً پر سر و صدا.
3. Backup بدون restore test قابل اتکا نیست.
4. health endpoint liveness و readiness را تفکیک کند.

## تست‌ها و اعتبارسنجی

Telemetry smoke، alert routing، log redaction، queue/DLQ simulation، backup restore و incident tabletop.

## معیار پذیرش

مسیرهای حیاتی قابل رصدند؛ alert و runbook تست شده و restore با شواهد موفق است.

## شواهد تحویل

SLO sheet، dashboards، runbooks، sanitized trace، backup/restore report و postmortem.

## کارهایی که نباید انجام شوند

داده حساس را برای observability کامل ثبت نکن؛ uptime بدون سلامت خرید را موفقیت تلقی نکن.

## قالب گزارش اجرای Skill

```text
Skill: production-observability-runbooks
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
