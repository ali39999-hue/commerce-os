---
name: drdermer-design-system
description: مدیریت توکن‌ها، کامپوننت‌های اتمیک، پالت تیره کلینیکال، Storybook و نگاشت Figma Code Connect در Gate 4.
---

# drdermer-design-system

## هدف (Objective)

توسعه، نگهداری و گسترش کتابخانه کامپوننت‌های اتمیک و مولکولی سیستم طراحی Dr Dermer UK Clinical & Commerce OS بر اساس توکن‌های مستند `DESIGN.md`، هدایت پالت مشکی و تیره کلینیکال آزمایشگاهی، ثبت و نمایش در Storybook و ایجاد نگاشت قطعی میان فریم‌های Figma و کدهای موجود با استفاده از Figma Code Connect در **Gate 4**.

## زمان استفاده / Triggers

- گام **Gate 4 (Contract & Component Mapping)** پس از تأیید فریم‌های طراحی توسط انسان در Gate 3.
- اضافه شدن کامپوننت، ویجت یا پریمیتیو جدید به کتابخانه `@commerce-os/ui` یا کامپوننت‌های اشتراکی.
- نگاشت المان‌های گرافیکی فیگما به کدهای React / Next.js جهت جلوگیری از پیاده‌سازی‌های چندباره و سلیقه‌ای.
- تنظیم، به‌روزرسانی یا ریفکتور توکن‌های متغیر CSS (`tokens.css`, `globals.css`).

## ورودی‌های موردنیاز (Required Inputs)

1. فریم‌های مصوب Figma از Gate 3 (`drdermer-figma-canvas`).
2. توکن‌های استاندارد و جدول رنگ‌های `DESIGN.md`.
3. پکیج‌های کامپوننت موجود در مخزن (`packages/ui`، `apps/storefront/components/`).
4. قوانین سخت‌گیرانه `antislop.md` و `.agents/skills/antislop-ui/SKILL.md`.

## فایل‌ها و ماژول‌های مرتبط (Relevant Paths)

- `DESIGN.md` (سند مرجع توکن‌ها و تعاملات)
- `apps/storefront/app/globals.css` و `clinical-station.css`
- `apps/storefront/components/ui/` (دکمه‌ها، ورودی‌ها، کارت‌ها و مودال‌ها)
- `apps/storefront/components/interactive/` (سکانس‌پلیر ۳۶۰ درجه، گیج‌های بالینی)
- تنظیمات Storybook در `.storybook/` و فایل‌های `*.stories.tsx`
- فایل‌های نگاشت Figma Code Connect (`*.figma.tsx`)

## روش اجرای مرحله‌ای (Step-by-Step Procedure)

1. **انطباق و غنی‌سازی توکن‌ها (Design Token Alignment)**:
   - اطمینان از تعریف دقیق متغیرهای CSS در ریشه استایل‌ها:
     - پس‌زمینه پایه: `--color-bg-base: #070b12`
     - سطوح برجسته: `--color-bg-surface: #0c131f`
     - پنل‌های شیشه‌ای: `--color-bg-glass: rgba(15, 23, 42, 0.72)` به همراه `backdrop-filter: blur(16px)`
     - رنگ‌های اکسنت کلینیکال: Teal (`#06b6d4`), Plasma Purple (`#8b5cf6`), Emerald Green (`#10b981`), Amber (`#f59e0b`)
     - شبکه‌بندی فواصل: مضارب ۴ پیکسل (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
2. **بررسی موجودی کامپوننت‌ها پیش از خلق مجدد (Inventory Check)**:
   - جستجوی کامپوننت‌های موجود در رپو برای تطبیق با طرح فیگما.
   - اعمال قانون: «هیچ کامپوننت جدیدی بدون جستجوی دقیق در کدهای قبلی ساخته نمی‌شود».
3. **توسعه کامپوننت‌های اتمیک پایدار (Atomic Component Development)**:
   - توسعه پریمیتیوها: دکمه‌های کلینیکال (`station-btn-primary`)، ورودی‌ها با فوکوس‌رینگ اختصاصی، کارت‌های شیشه‌ای آزمایشگاهی با مرز `rgba(255, 255, 255, 0.08)`.
   - تضمین رعایت `font-variant-numeric: tabular-nums` در المان‌های دارای اعداد و قیمت‌ها برای جلوگیری از لرزش اعداد (Jittering).
4. **ثبت Storybook Stories**:
   - ایجاد فایل استوری برای تمام کامپوننت‌های اشتراکی با پوشش تمامی واریانت‌ها (`Default`, `Hover`, `Loading`, `Disabled`, `Error`, `RTL`).
5. **نگاشت Figma Code Connect**:
   - تعریف فایل‌های نگاشت `*.figma.tsx` برای اتصال کامپوننت فیگما به ایمپورت واقعی کامپوننت در کد تا ایجنت‌های توسعه فرانت‌ند دقیقاً کامپوننت رسمی را فراخوانی کنند.

## قوانین غیرقابل مذاکره (Non-Negotiable Rules)

1. **ممنوعیت هاردکد کردن مقادیر رنگی و ابعاد**: نوشتن مستقیم کدهای رنگی مانند `#000` یا فواصل نامتعارف مانند `margin: 17px` در کامپوننت‌ها ممنوع است؛ باید از متغیرهای سیستم توکن استفاده شود.
2. **رعایت Anti-Slop در استایل‌ها**:
   - ممنوعیت شیشه‌ای کردن تمام سطوح هم‌زمان (Excessive Glassmorphism - R-10).
   - محدودیت درخشش (Glow) به حداکثر ۱ یا ۲ کانون توجه بالینی (R-13).
   - پرهیز از گرادیان‌های کلیشه‌ای آبی-بنفش پیش‌فرض مدل‌ها (R-01).
3. **پشتیبانی بومی از RTL و LTR**: استفاده از ویژگی‌های منطقی CSS (مانند `margin-inline-start`, `padding-inline`) به جای جهت‌های مطلق (`left`, `right`).

## تست‌ها و اعتبارسنجی (Validation)

- اجرای تست تایپ و استوری‌بوک (`pnpm run storybook` یا بیلد استوری‌ها).
- بررسی کنتراست رنگ تمام توکن‌های متن روی پس‌زمینه‌های تیره با ابزارهای WCAG (حداقل ۴.۵:۱).
- تست عملکردی تمام واریانت‌ها در برابر رندر بدون باگ.

## معیار پذیرش (Definition of Done)

- کامپوننت‌های مشترک با تایپ‌های صریح و کامپایل موفق در سیستم طراحی قرار دارند.
- استوری‌های Storybook برای واریانت‌های کلیدی ثبت شده‌اند.
- نگاشت Code Connect یا ماتریس تطابق کامپوننت برای ایجنت فرانت‌ند (A5) در دسترس است.

## شواهد و خروجی‌های تحویل (Deliverables)

- کد سورس کامپوننت‌های مشترک در پکیج UI.
- فایل‌های استوری Storybook و گزارش ویژوال اسنپ‌شات.
- جدول تطابق `COMPONENT_CODE_MAPPING.md` شامل معادل فیگما به کامپوننت React.

## کارهایی که نباید انجام شوند (Anti-Patterns)

- نصب کتابخانه‌های UI ناشناخته و متناقض با تم دارک کلینیکال بدون توافق معماری.
- تغییر خودسرانه توکن‌های سراسری که منجر به به‌هم‌ریختگی سایر ۴۳ روت گردد.
- تعریف استایل‌های بدون بازخورد حالت فوکوس و کیبورد.

## قالب گزارش اجرای Skill

```text
Skill: drdermer-design-system
Action: [Add Component | Update Tokens | Storybook Spec | Code Connect Mapping]
Components Affected:
  - [ComponentName]: [Path in repo]
Design Tokens Applied:
  - Background: var(--color-bg-base)
  - Accent: var(--color-teal-primary)
  - Typography: Vazirmatn Tabular Numerals
Storybook Stories Path: [e.g. apps/storefront/components/ui/button.stories.tsx]
Code Connect Mapping Status: [MAPPED | NOT_APPLICABLE]
WCAG 2.2 AA Contrast Verified: [PASS | FAIL]
Status: DONE_FOR_GATE_4
```
