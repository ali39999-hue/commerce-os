---
name: catalog-pim-dam
description: تکمیل Product Information Management و Digital Asset Management برای محصول، variant، رسانه، taxonomy، انتشار و localization.
---

# catalog-pim-dam

## هدف

ایجاد منبع حقیقت برای اطلاعات و رسانه محصول که هم storefront و هم admin و کانال‌های فروش از آن استفاده کنند.

## زمان استفاده

P03، P04، P06 و هر تغییر در محصول، دسته، SKU، variant، image یا محتوای ساختاریافته.

## ورودی‌های موردنیاز

Prisma schema، catalog API، asset storage، product feed، نیاز بازار، taxonomy و workflow تایید محتوا.

## فایل‌ها و ماژول‌های مرتبط

Prisma Product/Variant/Category و مدل‌های Asset/Media موجود، catalog module، upload service، worker و admin catalog.

## روش اجرای مرحله‌ای

1. مدل‌های موجود و reuse احتمالی Media/Asset را بررسی کن؛ پیش از افزودن ProductImage، schema را کامل جست‌وجو کن.
2. نیاز entityها را تعریف کن: Product، Variant، SKU، Collection، Category، Attribute، Asset، AssetRendition، LocaleContent.
3. رابطه گالری با product/variant، ترتیب، alt، role، focal point و visibility را مدل کن.
4. upload امن با type/size validation، malware scanning (در صورت فراهم بودن)، metadata stripping و object storage بساز.
5. worker برای thumbnail، responsive renditions، WebP/AVIF و cleanup بساز.
6. workflow Draft/Review/Published و preview را به admin متصل کن.
7. API خروجی storefront را با cache invalidation و locale-aware content تکمیل کن.

## قوانین غیرقابل مذاکره

1. URL فایل را از کاربر trust نکن؛ SSRF و content-type spoofing را ببند.
2. فایل اصلی و مشتقات versioned باشند؛ delete نرم/retention و reference check داشته باش.
3. تصویر placeholder نباید به‌عنوان media واقعی منتشر شود.
4. SKU، barcode و variant uniqueness باید در scope درست enforce شوند.

## تست‌ها و اعتبارسنجی

Upload authorization، MIME spoofing، large file, rendition generation, broken asset, deletion references, tenant isolation.

## معیار پذیرش

محصول با gallery واقعی، variant media، alt text، rendition، locale و publish state از Admin مدیریت می‌شود.

## شواهد تحویل

ERD، migration، upload/worker logs، screenshots و asset delivery tests.

## کارهایی که نباید انجام شوند

مدل تکراری بساز یا تصاویر شخص ثالث را بدون حقوق استفاده وارد کاتالوگ نکن.

## قالب گزارش اجرای Skill

```text
Skill: catalog-pim-dam
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
