---
name: global-storefront-ux
description: طراحی تجربه فروشگاه جهانی از کشف محصول تا خرید، با تمرکز بر اعتماد، وضوح، mobile-first، نرخ تبدیل و محتوای برند.
---

# global-storefront-ux

## هدف

تبدیل Storefront به تجربه منسجم، سریع و قابل‌فهم؛ الهام از الگوهای محتوایی Dr Dermer بدون کپی طراحی یا ادعا.

## زمان استفاده

P01، P04 تا P08 و بازطراحی هر Journey یا صفحه فروشگاهی.

## ورودی‌های موردنیاز

پرسونا و بازار، analytics/funnel، کاتالوگ واقعی، محتوای تاییدشده، design tokens، محدودیت API و رفرنس‌ها.

## فایل‌ها و ماژول‌های مرتبط

apps/storefront/app، components، styles، packages/ui، localization و analytics/event definitions.

## روش اجرای مرحله‌ای

1. Journeyهای guest و signed-in را برای کشف، مقایسه، تصمیم، سبد، پرداخت، پیگیری و پشتیبانی ترسیم کن.
2. Information architecture را بر اساس نیاز خریدار و taxonomy واقعی تعریف کن.
3. برای Home، PLP، Search، PDP، Cart، Checkout، Account و Editorial wireframe و responsive behavior بساز.
4. هر صفحه را با Loading، Empty، Error، Disabled، Out-of-stock و Success طراحی کن.
5. در PDP رسانه واقعی، gallery، variants، price/availability، ingredients/specs، evidence و FAQ را اولویت بده.
6. CTAها را به action واقعی متصل کن؛ قیمت، موجودی و تخفیف را از server بگیر.
7. نسخه موبایل، RTL/LTR، صفحه‌کلید، focus، contrast و reduced motion را تست کن.
8. با analytics eventها funnel را اندازه بگیر و با آزمایش کنترل‌شده بهینه کن.

## قوانین غیرقابل مذاکره

1. Mobile-first و content-first؛ انیمیشن فقط وقتی به فهم کمک می‌کند.
2. هر UI state باید تعریف شود؛ skeleton جای خطای API را نمی‌گیرد.
3. هیچ testimonial، امتیاز، شمارنده فروش یا ادعای ساختگی تولید نکن.
4. از ساختار یا assetهای Dr Dermer بدون اجازه کپی نکن؛ فقط الگوهای UX را تحلیل کن.

## تست‌ها و اعتبارسنجی

Playwright journey روی موبایل/دسکتاپ، visual regression، usability task و event verification.

## معیار پذیرش

خریدار بتواند محصول را بیابد، مقایسه کند، انتخاب کند، پرداخت کند و سفارش را پیگیری کند؛ بدون CTA مرده یا داده نمایشی.

## شواهد تحویل

Journey map، wireframe، screenshot، نتایج usability، funnel events و E2E.

## کارهایی که نباید انجام شوند

صفحه زیبا اما بی‌عملیات نساز؛ کل سایت را بدون داده analytics و آزمون کاربر بر اساس سلیقه بازطراحی نکن.

## قالب گزارش اجرای Skill

```text
Skill: global-storefront-ux
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
