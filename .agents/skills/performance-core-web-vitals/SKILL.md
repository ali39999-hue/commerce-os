---
name: performance-core-web-vitals
description: اندازه‌گیری و بهینه‌سازی عملکرد Storefront/Admin با Core Web Vitals، بودجه bundle، caching و media strategy.
---

# performance-core-web-vitals

## هدف

بهبود تجربه واقعی موبایل و desktop بدون sacrifying correctness یا freshness قیمت/موجودی.

## زمان استفاده

P00، P04، P13، P15 و در تغییرات تصاویر، fonts، routing یا data fetching.

## ورودی‌های موردنیاز

baseline Lighthouse/CrUX، routes، device/network profiles، API latency، asset sizes و cache policy.

## فایل‌ها و ماژول‌های مرتبط

Next config، image components/CDN، fonts، data loaders، caching/revalidation، bundles و k6 scripts.

## روش اجرای مرحله‌ای

1. Baseline واقعی روی صفحات Home، PLP، Search، PDP، Cart و Checkout ثبت کن.
2. LCP element، CLS sources، INP interaction و hydration/bundle bottlenecks را شناسایی کن.
3. تصاویر responsive با width/height، modern formats، sizes و lazy/eager مناسب پیاده کن.
4. font subset/preload و script loading را اندازه‌محور بهینه کن.
5. server rendering، cache tags، revalidation و query costs را بر اساس freshness نیاز طراحی کن.
6. bundle analyzer و route-level code splitting را بررسی کن.
7. API latency، DB query, N+1 و worker queues را از سمت backend اندازه بگیر.
8. پس از هر تغییر همان دستگاه/شبکه را تکرار کن و correctness cache را تست کن.

## قوانین غیرقابل مذاکره

1. قیمت، stock، cart و payment را با cache ناامن stale نکن.
2. بهینه‌سازی بدون before/after اندازه‌گیری پذیرفته نیست.
3. CLS را با رزرو فضای media و UI async کنترل کن.
4. هدف performance باید device/network و percentile مشخص داشته باشد.

## تست‌ها و اعتبارسنجی

Lighthouse CI، Web Vitals RUM، bundle-size budget، k6 smoke/load و cache correctness.

## معیار پذیرش

اهداف قابل اندازه‌گیری مصوب برای Core Web Vitals و API اجرا شده و regressions در CI/RUM دیده می‌شود.

## شواهد تحویل

Baseline/after report، bundle diff، RUM dashboard و load-test output.

## کارهایی که نباید انجام شوند

صرفاً نمره Lighthouse یک اجرای لوکال را معیار سلامت production قرار نده.

## قالب گزارش اجرای Skill

```text
Skill: performance-core-web-vitals
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
