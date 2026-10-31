---
name: seo-commerce-technical
description: بهینه‌سازی فنی SEO برای فروشگاه شامل crawlability، canonical، sitemap، structured data، indexation و محتوای محصول.
---

# seo-commerce-technical

## هدف

قابل کشف بودن صفحات ارزشمند در موتورهای جست‌وجو بدون index کردن مسیرهای خصوصی، فیلترهای بی‌نهایت و محتوای تکراری.

## زمان استفاده

P04 تا P06، P13 و پیش از هر انتشار که metadata یا routing را تغییر می‌دهد.

## ورودی‌های موردنیاز

URL architecture، locale/market policy، product/category data، robots policy، Search Console و redirect map.

## فایل‌ها و ماژول‌های مرتبط

Next metadata/layout، robots.ts، sitemap.ts، product/category routes، JSON-LD، redirects و CMS.

## روش اجرای مرحله‌ای

1. تمام مسیرهای public، private، parameterized، filter و duplicate را inventory کن.
2. index/follow policy را برای هر route type تعریف و noindex ناخواسته را رفع کن.
3. title/description، canonical، OG، robots، sitemap و hreflang را server-render کن.
4. Product/Offer/Breadcrumb/Organization schema را فقط با داده واقعی و مطابق صفحه تولید کن.
5. Variant URL، pagination، faceted search و sort URL را canonicalize یا کنترل کن.
6. redirect 301، 404/410، broken link و orphan page را ممیزی کن.
7. با crawl test و Search Console داده indexation را پایش کن.

## قوانین غیرقابل مذاکره

1. موجودی، قیمت و currency در JSON-LD باید مطابق داده قابل‌مشاهده باشد.
2. Review/aggregateRating ساختگی ممنوع است.
3. صفحات account/cart/checkout/admin/payment خصوصی نباید index شوند.
4. schema markup تضمین rich result نیست.

## تست‌ها و اعتبارسنجی

Metadata tests، canonical/hreflang validation، JSON-LD parser، sitemap robots checks و crawl simulation.

## معیار پذیرش

صفحات محصول/دسته public indexable و مسیرهای خصوصی محافظت شده‌اند؛ duplicate/facet crawl کنترل شده است.

## شواهد تحویل

SEO route matrix، crawl export، structured data validation و Search Console snapshot.

## کارهایی که نباید انجام شوند

صرفاً برای رفع noindex همه مسیرها را index نکن؛ route خصوصی را با SEO fix عمومی نکن.

## قالب گزارش اجرای Skill

```text
Skill: seo-commerce-technical
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
