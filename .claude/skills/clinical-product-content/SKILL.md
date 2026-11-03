---
name: clinical-product-content
description: طراحی ساختار محتوای تخصصی محصولات مراقبت پوست، ترکیبات، فناوری، شواهد و آموزش با کنترل ادعاهای سلامت/بالینی.
---

# clinical-product-content

## هدف

ارائه اطلاعات مفید، شفاف و قابل‌ردیابی برای تصمیم خرید؛ بدون ادعای درمانی یا تضمین نتیجه تاییدنشده.

## زمان استفاده

P01، P03، P06، P09 و هر زمان که محتوای محصول، ingredient، نتیجه یا مقاله علمی نوشته/ویرایش می‌شود.

## ورودی‌های موردنیاز

اطلاعات سازنده، label/IFU، فهرست مواد، اسناد آزمون، منبع علمی، تایید متخصص/مسئول رگولاتوری و زبان بازار.

## فایل‌ها و ماژول‌های مرتبط

Product/PIM schema، product content services، CMS/editorial، PDP، locale dictionaries و review workflow.

## روش اجرای مرحله‌ای

1. مخاطب و هدف محتوا را مشخص کن: مصرف‌کننده، متخصص، توزیع‌کننده یا مراقب سلامت.
2. فیلدهای محتوا را از متن آزاد جدا کن: ingredient، concentration (در صورت افشای مجاز)، usage، warnings، contraindications، evidence، claims.
3. هر ادعا را به منبع، تاریخ، سطح شواهد، بازار مجاز و reviewer وصل کن.
4. محتوای ساختارمند بنویس: معرفی، مسئله/کاربرد، روش کار، ترکیبات، روش مصرف، هشدار، FAQ و منابع.
5. برای محصول رسانه‌های معتبر و alt text واقعی ثبت کن.
6. ترجمه تخصصی را با واژه‌نامه کنترل‌شده و بازبینی انسانی انجام بده.
7. workflow Draft → Review → Approved → Published → Archived را اعمال کن.

## قوانین غیرقابل مذاکره

1. هیچ تشخیص، درمان، پیشگیری، تضمین اثربخشی یا ادعای پزشکی بدون مبنای قانونی/علمی و تایید مسئول منتشر نشود.
2. صفحات Dr Dermer فقط reference ساختار محتوا هستند؛ متن آن کپی نشود.
3. ترکیبات، درصدها، نتایج و دستور مصرف را حدس نزن.
4. برای هر بازار مقررات ادعا و labeling جداگانه بررسی شود.

## تست‌ها و اعتبارسنجی

Schema validation، required source check، locale completeness، publish permission، broken link/media check.

## معیار پذیرش

همه ادعاهای حساس source/reviewer/status دارند؛ صفحه محصول کامل، دقیق و با تاریخ بازبینی است.

## شواهد تحویل

Content brief، claim register، source links، reviewer approval و version history.

## کارهایی که نباید انجام شوند

Lorem ipsum، درصد ساختگی، قبل/بعد ساختگی یا واژه «تاییدشده» بدون مدرک استفاده نکن.

## قالب گزارش اجرای Skill

```text
Skill: clinical-product-content
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
