---
name: multilingual-rtl-i18n
description: مهندسی چندزبانه‌سازی و localization شامل locale routing، ترجمه، RTL/LTR، ارز، تاریخ، عدد و محتوای محصول.
---

# multilingual-rtl-i18n

## هدف

تجربه یکسان و طبیعی در زبان‌ها/بازارهای پشتیبانی‌شده، بدون hardcode و با حفظ صحت داده تجاری.

## زمان استفاده

P02، P12، P13 و هر صفحه یا محتوای جدید با متن، ارز، تاریخ یا مسیر locale.

## ورودی‌های موردنیاز

زبان‌ها و بازارهای هدف، routing policy، glossary، content schema، currency/date policy و test locales.

## فایل‌ها و ماژول‌های مرتبط

packages/localization، middleware/locale routing، dictionaries، storefront/admin layouts و formatters.

## روش اجرای مرحله‌ای

1. زبان، locale و market را از هم تفکیک و policy هرکدام را ثبت کن.
2. ترجمه UI را در dictionary و محتوای catalog را در مدل locale-aware نگه دار.
3. fallback locale، missing translation و URL canonical را تعریف کن.
4. جهت صفحه را از locale بگیر؛ layout و icon/text alignment را RTL/LTR تست کن.
5. Intl formatter برای currency/date/number و timezone-aware date handling استفاده کن.
6. برای Jalali یا تقویم خاص، لایه format جدا از ذخیره‌سازی استاندارد داشته باش.
7. واژه‌نامه تخصصی، placeholder interpolation و pluralization را مدیریت کن.
8. QA بومی/انسانی برای متن، بریدگی، اعداد و checkout انجام بده.

## قوانین غیرقابل مذاکره

1. مبلغ در storage به currency-aware decimal/minor units مطابق مدل مالی ذخیره شود، نه متن localized.
2. ترجمه ماشینی بدون بازبینی برای شروط، هشدار و محتوای تخصصی منتشر نشود.
3. LTR/RTL را با CSS logical properties و نه offsetهای hard-coded بساز.
4. timezone فروشگاه/مشتری/تراکنش صریح باشد.

## تست‌ها و اعتبارسنجی

Locale routing، missing keys، RTL/LTR screenshots، format correctness، canonical/hreflang و checkout translations.

## معیار پذیرش

زبان‌ها در Home→Checkout→Account و Admin مسیرهای ضروری را بدون اختلاط direction/currency/date پوشش دهند.

## شواهد تحویل

Locale matrix، glossary، screenshot suite و missing translation report.

## کارهایی که نباید انجام شوند

زبان را با کشور یا currency یکی ندان؛ متن فارسی را صرفاً با dir=rtl تمام‌شده فرض نکن.

## قالب گزارش اجرای Skill

```text
Skill: multilingual-rtl-i18n
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
