---
name: accessibility-wcag-audit
description: ممیزی و اصلاح دسترس‌پذیری مطابق WCAG 2.2 AA در Storefront و Admin.
---

# accessibility-wcag-audit

## هدف

قابل استفاده بودن محصول با صفحه‌کلید، screen reader، zoom و تنظیمات حرکتی/بصری کاربران.

## زمان استفاده

P02، P04 تا P15 و پیش از release هر صفحه حیاتی.

## ورودی‌های موردنیاز

صفحات و stateها، design tokens، component inventory، target standard و زبان/جهت.

## فایل‌ها و ماژول‌های مرتبط

components، forms، navigation، dialogs، tables، image alt، CSS tokens و E2E/a11y tests.

## روش اجرای مرحله‌ای

1. صفحات کلیدی و حالت‌های error/success/empty را inventory کن.
2. Semantic HTML، landmark، heading hierarchy و accessible name را بررسی کن.
3. تمام flowها را فقط با keyboard اجرا؛ focus order، visible focus، trap و escape را بسنج.
4. Screen reader announcement برای validation، cart updates، modal و async status را بررسی کن.
5. contrast، non-color cues، zoom/reflow، touch target و reduced motion را تست کن.
6. alt متن‌محور و contextual بنویس؛ تصویر تزئینی را از accessibility tree حذف کن.
7. Automated scan را با manual keyboard/screenreader test تکمیل کن.
8. severity، impact، fix owner و regression test تعریف کن.

## قوانین غیرقابل مذاکره

1. Automated score به‌تنهایی اثبات انطباق نیست.
2. Focus هرگز گم یا پشت dialog پنهان نشود.
3. فرم خطا را صرفاً با رنگ قرمز نشان نده.
4. برای رسانه تخصصی alt باید کارکرد تصویر را توصیف کند.

## تست‌ها و اعتبارسنجی

axe/playwright scan، keyboard-only test، screen reader spot-check، contrast checks و zoom 200/400%.

## معیار پذیرش

هیچ blocker/critical شناخته‌شده در مسیر خرید وجود نداشته باشد و WCAG 2.2 AA با شواهد دستی/خودکار ارزیابی شود.

## شواهد تحویل

A11y audit، issue log، keyboard video/screenshots و automated report.

## کارهایی که نباید انجام شوند

نتیجه ابزار را معادل certification رسمی یا تست با کاربر دارای معلولیت معرفی نکن.

## قالب گزارش اجرای Skill

```text
Skill: accessibility-wcag-audit
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
