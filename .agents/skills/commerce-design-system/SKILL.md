---
name: commerce-design-system
description: ساخت و نگهداری Design System قابل‌استفاده مجدد برای Storefront و Admin با tokens، الگوهای تعاملی و پوشش RTL/LTR.
---

# commerce-design-system

## هدف

هماهنگی بصری و رفتاری صفحات و کاهش هزینه توسعه بدون تحمیل abstraction اضافی.

## زمان استفاده

P02، P04، P11 و هنگام افزودن هر component یا تغییر الگوی پایه UI.

## ورودی‌های موردنیاز

برند و بازار، audit UI، wireframe، stack فعلی، نیاز contrast/accessibility و responsive breakpoints.

## فایل‌ها و ماژول‌های مرتبط

packages/ui یا محل واقعی componentها، styles/tokens، apps/storefront، apps/admin و Storybook در صورت وجود.

## روش اجرای مرحله‌ای

1. componentهای تکراری/متفاوت را inventory کن و reuse واقعی را مشخص کن.
2. Design tokens برای color، type، spacing، radius، shadow، motion، breakpoints و z-index تعریف کن.
3. primitiveها و patternهای Form، Button، Input، Select، Dialog، Toast، Tabs، Card، Table و Navigation را بساز.
4. variant و stateها را محدود، مستند و type-safe نگه دار.
5. RTL/LTR، density، touch target، focus ring و high contrast را پشتیبانی کن.
6. نمونه مستند و visual tests برای حالت‌های کلیدی ثبت کن.
7. مصرف‌کننده‌ها را تدریجی migrate کن و regression را پایش کن.

## قوانین غیرقابل مذاکره

1. از چند design system موازی بدون ADR پرهیز کن.
2. رنگ و اندازه‌های hard-coded را در صفحات جدید وارد نکن.
3. component عمومی فقط با دو use case واقعی یا نیاز واضح استخراج شود.
4. semantic HTML و keyboard behavior الزامی است.

## تست‌ها و اعتبارسنجی

Component tests، visual snapshots، keyboard tests، RTL/LTR screenshots و contrast audit.

## معیار پذیرش

توکن‌ها و کامپوننت‌ها مستندند، stateهای استاندارد دارند و در صفحات اصلی یکپارچه مصرف می‌شوند.

## شواهد تحویل

Token reference، component catalog، story/screenshot و regression report.

## کارهایی که نباید انجام شوند

صرفاً برای یک صفحه abstraction پیچیده نساز یا به‌خاطر یکپارچگی، نیاز خاص صفحه را نادیده نگیر.

## قالب گزارش اجرای Skill

```text
Skill: commerce-design-system
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
