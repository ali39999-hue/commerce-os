---
name: drdermer-visual-qa
description: تضمین کیفیت بصری خودکار و دستی، بازرسی با Playwright MCP، ثبت اسکرین‌شات و مقایسه تفاضلی با بیس‌لاین در Gate 6.
---

# drdermer-visual-qa

## هدف (Objective)

اجرای آزمون‌های جامع، خودکار و دستی تضمین کیفیت بصری (Visual Quality Assurance) در لایه مرورگر واقعی از طریق ابزارهای **Playwright MCP** در مرحله **Gate 6 (QA & Verification)**، ثبت اسکرین‌شات‌های استاندارد در ویوپورت‌ها و شرایط نوری تعریف‌شده، مقایسه تفاضلی (Visual Diffing) با فریم‌های مصوب Figma و استخراج شواهد غیرقابل انکار پیش از ارسال PR به Gate 7.

## زمان استفاده / Triggers

- مرحله **Gate 6 (QA & Verification)** پس از اتمام پیاده‌سازی فرانت‌اند (Gate 5).
- پیش از ثبت هرگونه Pull Request برای تغییرات رابط کاربری یا صفحات جدید.
- شناسایی خطاهای بصری مانند پرش چیدمان (Layout Shifts)، شکستگی متون، بریده شدن تصاویر یا تداخل المان‌های شیشه‌ای.
- اعتبارسنجی انطباق دقیق کدهای رندرشده با طراحی‌های مصوب Figma در Gate 3.

## ورودی‌های موردنیاز (Required Inputs)

1. فریم‌های مصوب Figma از Gate 3 به همراه لینک مستقیم تصویر یا اکسپورت آن.
2. سرور محلی یا محیط استیج در حال اجرا (`http://localhost:3000`).
3. پیکربندی ابزار Playwright MCP یا اسکریپت‌های تست در `apps/storefront/e2e/`.
4. لیست ویوپورت‌های استاندارد (۳۶۰، ۳۹۰، ۷۶۸، ۱۲۸۰، ۱۴۴۰ پیکسل).

## فایل‌ها و ماژول‌های مرتبط (Relevant Paths)

- `apps/storefront/e2e/` (فایل‌های تست Playwright)
- `apps/storefront/playwright.config.ts` (پیکربندی ویوپورت‌ها و مرورگرها)
- پوشه ذخیره‌سازی شواهد تصویری `docs/evidence/screenshots/`
- ابزارهای مرورگر در Claude Code (`mcp_Claude_Browser_*` یا Playwright MCP)

## روش اجرای مرحله‌ای (Step-by-Step Procedure)

1. **ناوبری و بازرسی صفحه در مرورگر (Browser Navigation & Inspection)**:
   - باز کردن روت هدف در مرورگر در محیط ایزوله و لوکال.
   - انتظار برای بارگذاری کامل فونت‌ها، تصاویر و انیمیشن‌های اولیه (`networkidle`).
2. **عکاسی در ابعاد استاندارد (Deterministic Multi-Viewport Capture)**:
   - تنظیم ابعاد دقیق ویوپورت:
     - موبایل کامپکت: `360x800`
     - موبایل استاندارد: `390x844`
     - تبلت: `768x1024`
     - دسکتاپ استاندارد: `1280x800`
     - اولترا واید: `1440x900`
   - ثبت اسکرین‌شات کامل از کل صفحه (Full Page Screenshot) و اسکرین‌شات از سکشن‌های بحرانی (Hero، Station، Cart Drawer).
3. **مقایسه تفاضلی بصری با فریم فیگما (Figma-to-Code Diffing)**:
   - تطبیق ساختار چیدمان، ابعاد کارت‌ها، تایپوگرافی، فواصل بیرونی/درونی و شعاع‌های گردی با فریم Figma.
   - تشخیص انحراف‌های بصری مهم (Visual Bugs): رنگ‌های ناهمخوان، عدم وجود افکت شیشه‌ای یا بلور، حاشیه‌های ضخیم و ناهماهنگ.
4. **تست تعاملی و حالت‌های گذار (Interactive & Hover QA)**:
   - اجرای سناریوهای کلیک، هاور، باز شدن دراور و پر کردن فرم از طریق متدهای Playwright.
   - عکس‌برداری از حالت‌های بازخورد: فوکوس فیلدها، حالت اسپینر لودینگ در دکمه‌ها و پاپ‌آپ‌های خطا.
5. **بررسی عدم وجود خطاهای زمان اجرا در کنسول (Console Error Scan)**:
   - استخراج تمام لاگ‌های کنسول مرورگر و اطمینان از صفر بودن خطاهای قرمز (`console.error`, `Uncaught TypeError`, `Hydration Warning`).

## قوانین غیرقابل مذاکره (Non-Negotiable Rules)

1. **ممنوعیت استفاده از داده‌های زنده و واقعی مشتریان**: آزمون بصری فقط در محیط Local/Staging و با حساب‌های تستی و داده‌های ساختگی (Synthetic) انجام شود.
2. **پایداری شرایط عکس‌برداری**: اسکرین‌شات‌ها باید در شرایط پایدار (بدون انیمیشن‌های در حال چرخش نامحدود یا ساعت‌های در حال تیک‌تاک) گرفته شوند تا تست‌های تفاضلی خطا ندهند.
3. **تغییر ندادن مستقیم کدهای رپو توسط ایجنت A7**: ایجنت بازبینی بصری فقط گزارش نقص (Bug Report) تولید می‌کند و اصلاح کد باید به ایجنت مربوطه ارجاع شود مگر اینکه تسک مستقل فیکس داشته باشد.

## تست‌ها و اعتبارسنجی (Validation)

- اجرای اسکریپت‌های E2E با فرمان `pnpm --filter @commerce-os/storefront run test:e2e`.
- بررسی عدم تغییر ناگهانی پیکسل‌ها (Pixel Difference Threshold < 1%).
- بررسی پایداری رندر در مرورگرهای Chromium و WebKit.

## معیار پذیرش (Definition of Done)

- ثبت بسته کامل اسکرین‌شات‌ها برای تمامی ۵ ویوپورت در فرمت PNG با کیفیت بالا.
- تطابق بیش از ۹۵ درصدی ساختار بصری با فریم Figma مصوب.
- عدم وجود هرگونه خطای کنسول جاوااسکریپت در طول تست.

## شواهد و خروجی‌های تحویل (Deliverables)

- پرونده اسکرین‌شات‌های رندرشده در مسیر `docs/evidence/screenshots/DRD-XXX/`.
- گزارش مقایسه‌ای `VISUAL_QA_REPORT.md` شامل شرح مغایرت‌ها و وضعیت تطابق.
- تاییدیه ورود به **Gate 7 (PR Review)**.

## کارهایی که نباید انجام شوند (Anti-Patterns)

- تأیید کیفیت یک صفحه تنها با نگاه کردن به یک رزولوشن تکی (مثلاً فقط مانیتور بزرگ طراح).
- نادیده گرفتن خطاهای کوچک شکستگی خط یا چسبیدن کلمات در متون فارسی.
- ارسال اسکرین‌شات‌های تار، با مقیاس نامناسب یا همراه با منوهای DevTools مرورگر.

## قالب گزارش اجرای Skill

```text
Skill: drdermer-visual-qa
Route Evaluated: [e.g. /cart, /clinical-station]
Local Server URL: http://localhost:3000/...
Figma Baseline Frame: [Figma Frame URL]
Console Errors Count: 0 (Zero Errors Verified)
Screenshots Captured:
  - 360px: docs/evidence/screenshots/DRD-XXX/360-compact.png
  - 390px: docs/evidence/screenshots/DRD-XXX/390-mobile.png
  - 768px: docs/evidence/screenshots/DRD-XXX/768-tablet.png
  - 1280px: docs/evidence/screenshots/DRD-XXX/1280-desktop.png
  - 1440px: docs/evidence/screenshots/DRD-XXX/1440-ultrawide.png
Visual Discrepancies Found:
  - [None | Itemized List with severity]
Figma-to-Code Alignment: [98% Match - APPROVED]
Status: READY_FOR_GATE_7_PR
```
