---
name: drdermer-release-gate
description: ارزیابی چک‌لیست نهایی، گردآوری باندل شواهد و گزارش‌های تست، پروتکل رول‌بک و کنترل معیار پذیرش در Gate 7 و 8.
---

# drdermer-release-gate

## هدف (Objective)

مدیریت و اعمال سخت‌گیرانه فیلترهای کنترلی پیش از ادغام و انتشار نهایی در Dr Dermer UK Clinical & Commerce OS طی مراحل **Gate 7 (PR Review & Acceptance)** و **Gate 8 (Controlled Release)**؛ شامل بررسی کامل چک‌لیست تعریف اتمام کار (Definition of Done)، گردآوری باندل غیرقابل انکار شواهد (Evidence Bundle)، راستی‌آزمایی تست‌های CI، تدوین سناریوی قطعی بازگشت به عقب (Rollback Protocol) و تضمین اینکه هیچ کدی بدون تأیید نهایی انسان به پروداکشن راه پیدا نمی‌کند.

## زمان استفاده / Triggers

- مرحله نهایی **Gate 7 (PR Review)** پس از تأیید QA، تست‌های بصری، دسترسی‌پذیری و امنیت.
- آماده‌سازی و ارسال Pull Request برای ادغام شاخه کاری به شاخه اصلی (`main`).
- بازرسی نهایی در **Gate 8 (Controlled Release)** پیش از فعال‌سازی فیچرفلگ‌ها یا دیپلوی استیج به پروداکشن.
- ممانعت از انتشار کدهای دارای شکستگی بیلد، پسرفت بصری، یا نقایص امنیتی حل‌نشده.

## ورودی‌های موردنیاز (Required Inputs)

1. خروجی تست‌های تایپ و بیلد کلاینت و سرور (`pnpm build`).
2. لینک فریم‌های مصوب Figma در Gate 3.
3. بسته اسکرین‌شات‌های چندویوپورت از `drdermer-visual-qa`.
4. تاییدیه دسترس‌پذیری از `drdermer-accessibility`.
5. تاییدیه امنیتی از `drdermer-security-review`.
6. گزارش تست‌های واحد و E2E خودکار.

## فایل‌ها و ماژول‌های مرتبط (Relevant Paths)

- پرونده شواهد انتشار در `docs/evidence/releases/`
- فایل‌های گردش کار گیت‌هاب اکشنز در `.github/workflows/`
- تاریخچه شاخه‌ها و کامیت‌های Git
- اسناد معماری `ARCHITECTURE.md` و دستورالعمل‌های `AGENTS.md`

## الزامات ۹ گانه چک‌لیست Gate 7 & 8 (Release Checklist)

1. **انطباق بیلد کامل (Clean Production Build)**: اجرای موفق و بدون خطای بیلد استورفرانت و API.
2. **پوشش تست‌های خودکار (Automated Test Pass)**: عبور موفق ۱۰۰٪ تست‌های واحد، تست‌های امنیتی و تست‌های دود E2E.
3. **تطابق با طراحی فیگما (Figma Alignment Sign-off)**: ثبت لینک مستقیم فریم مصوب در بدنه PR و تأیید عدم انحراف بصری.
4. **شواهد چندویوپورت (Multi-Viewport Evidence Bundle)**: وجود اسکرین‌شات‌های باکیفیت در ۵ ابعاد (۳۶۰، ۳۹۰، ۷۶۸، ۱۲۸۰، ۱۴۴۰ پیکسل).
5. **عدم پسرفت در دسترسی‌پذیری (Zero A11y Violations)**: پاس شدن چک‌لیست WCAG 2.2 AA و ناوبری کیبورد.
6. **عدم آسیب‌پذیری امنیتی (Security Clearance)**: تأیید سشن‌های محصور، عدم وجود IDOR و ماسک بودن PII.
7. **انطباق با Anti-Slop**: حذف تمامی عبارات نامناسب، انیمیشن‌های غیرضروری و داده‌های ماک.
8. **برنامه بازگشت به عقب شفاف (Rollback Protocol)**: ثبت دقیق گام‌های رول‌بک، بازگردانی کامیت، و غیرفعال‌سازی فیچرفلگ در صورت بروز حادثه.
9. **تأییدیه انسانی (Human Product Owner Approval)**: تصمیم نهایی ادغام و انتشار منحصراً در اختیار انسان است؛ ایجنت حق دیپلوی خودسرانه ندارد.

## روش اجرای مرحله‌ای (Step-by-Step Procedure)

1. **اجرای گیت جامع صحت کد (The Full Verification Suite)**:
   - اجرای تایپ‌چک سراسری: `pnpm run type-check`
   - اجرای تست‌های واحد: `pnpm run test`
   - اجرای بیلد نهایی فروشگاه: `pnpm --filter @commerce-os/storefront run build`
2. **گردآوری باندل شواهد (Evidence Bundling)**:
   - بسته‌بندی اسکرین‌شات‌های ویژوال QA در پوشه تسک.
   - درج خروجی دستورات، زمان اجرای تست‌ها و درصد پوشش کد.
3. **نگارش بدنه استاندارد Pull Request (PR Description Formulation)**:
   - درج اهداف تسک، پیوندهای فیگما، لیست فایل‌های تغییریافته و ریسک‌های احتمالی.
   - درج پیوستگی با قوانین Attribution و پیام‌های استاندارد کامیت.
4. **تدوین پروتکل بازگشت به عقب (Rollback Playbook Definition)**:
   - تعیین زمان تخمینی بازگشت (MTTR).
   - فرمان‌های موردنیاز برای Revert کامیت یا بازگردانی مایگریشن دیتابیس در صورت لزوم.
5. **ارائه به انسان جهت امضای نهایی (Handover for Human Sign-off)**:
   - ارائه گزارش فشرده و مستند به Product Owner یا Tech Lead جهت کلیک روی دکمه ادغام یا صدور مجوز انتشار.

## قوانین غیرقابل مذاکره (Non-Negotiable Rules)

1. **ممنوعیت ادغام مستقیم به Branch محافظت‌شده**: هیچ ایجنتی حق ندارد مستقیماً شاخه `main` را ادغام یا دستکاری کند.
2. **عدم انتشار بدون Evidence Bundle کامل**: PR بدون اسکرین‌شات و گزارش تست باید رد شود (Rejected).
3. **شفافیت گزارش (Truthful Reporting)**: هرگز نباید تستی که اجرا نشده یا اسکیپ شده است، به عنوان «پاس‌شده» گزارش شود.

## تست‌ها و اعتبارسنجی (Validation)

- بررسی لاگ گیت‌هاب اکشنز یا اجرای محلی بیلد با کد خروجی ۰ (`exit 0`).
- تطابق لینک‌های اسناد و عکس‌های پیوست‌شده در PR.
- اعتبارسنجی فرآیند رول‌بک در محیط شبیه‌سازی‌شده تستی.

## معیار پذیرش (Definition of Done)

- بسته شواهد کامل شامل تست‌ها، اسکرین‌شات‌ها و گزارش‌های امنیتی ثبت شده باشد.
- بیلد و تست‌ها با موفقیت ۱۰۰٪ سپری شده باشند.
- تأیید رسمی بازبین انسانی دریافت و شاخه آماده ادغام تمیز باشد.

## شواهد و خروجی‌های تحویل (Deliverables)

- پرونده رسمی شواهد انتشار `RELEASE_EVIDENCE_BUNDLE.md`.
- پیش‌نویس آماده PR با تمام مستندات و لینک‌ها.
- سناریوی آماده رول‌بک در صورت بروز حادثه.

## کارهایی که نباید انجام شوند (Anti-Patterns)

- باز کردن PR‌های عظیم که همزمان چندین ماژول نامرتبط را بازنویسی می‌کنند.
- ادعای موفقیت بیلد بدون اجرای عملی دستور در محیط سورس.
- پنهان کردن خطرات ناشناخته یا باگ‌های حل‌نشده در بخش توضیحات PR.

## قالب گزارش اجرای Skill

```text
Skill: drdermer-release-gate
Task ID: DRD-XXX
PR Target: main <- feat/DRD-XXX-<name>
Evidence Bundle Verification:
  - Clean Build (pnpm build): [PASS - Exit 0]
  - Type-Check: [PASS - 0 Errors]
  - Automated Unit Tests: [PASS - All Passed]
  - Visual QA Screenshots: [ATTACHED - 5 Viewports]
  - Accessibility Compliance: [PASS - WCAG 2.2 AA Verified]
  - Security Clearance: [PASS - Session-bound & Zero PII Leak]
  - Anti-Slop Audit: [PASS - 100% Compliant]
Rollback Plan:
  - Command: git revert -m 1 <commit-hash>
  - Feature Flag: DRD_FEATURE_XXX=false
Human Product Owner Sign-off: [PENDING REVIEW]
Status: READY_FOR_MERGE
```
