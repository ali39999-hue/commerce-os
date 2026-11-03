---
name: drdermer-design-to-code
description: تبدیل فریم‌های مصوب Figma به کدهای تمیز، ماژولار و بهینه‌سازی‌شده React و Next.js بدون ابداع سلیقه‌ای در Gate 4 تا 5.
---

# drdermer-design-to-code

## هدف (Objective)

ترجمه سیستماتیک، دقیق و بدون خطا از فریم‌ها، ساختارهای Auto Layout و المان‌های تعاملی تأییدشده در Figma Canvas به کامپوننت‌های مدرن و تمیز React و Next.js (App Router)، با استفاده انحصاری از توکن‌های سیستم طراحی Dr Dermer و تطابق قطعی با قراردادهای Code Connect بدون هیچ‌گونه انحراف بصری یا سلیقه‌پردازی ایجنت.

## زمان استفاده / Triggers

- مرحله انتقال از **Gate 4 (Contract & Component Mapping)** به **Gate 5 (Vertical Slice Implementation)**.
- پس از دریافت مجوز رسمی تأیید انسانی از Gate 3 روی فریم‌های Figma.
- تبدیل پروتوتایپ‌های طراحی به اسکلت کدهای تولیدی (Production-Ready).
- به‌روزرسانی ساختار بصری صفحات بر اساس تغییرات نسخه جدید فریم‌های طراحی در Figma.

## ورودی‌های موردنیاز (Required Inputs)

1. لینک و شناسه فریم مصوب Figma (با تأییدیه انسان در Gate 3).
2. ماتریس تطابق کامپوننت‌ها از `drdermer-design-system`.
3. ساختار فایل‌های مقصد در `apps/storefront/` یا ماژول‌های مربوطه.
4. قوانین سخت‌گیرانه `AGENTS.md` و استانداردهای طراحی `DESIGN.md`.

## فایل‌ها و ماژول‌های مرتبط (Relevant Paths)

- `apps/storefront/components/` (کامپوننت‌های رندری و تعاملی)
- `apps/storefront/app/` (مسیرهای روت برای چیدمان و لایوت‌ها)
- `apps/storefront/components/interactive/` (سکانس‌های تعاملی و ماژول‌های سخت‌افزاری)
- کدهای نگاشت Figma Code Connect

## روش اجرای مرحله‌ای (Step-by-Step Procedure)

1. **تحلیل درخت بصری فریم (Figma Frame Inspection via MCP)**:
   - دریافت ساختار لایه‌ها، چینش Auto Layout، مقادیر Padding/Gap و جهات افقی/عمودی از ابزارهای Figma MCP.
   - استخراج متغیرهای رنگی، شعاع‌ها و تایپوگرافی متناظر در سیستم توکن‌های کد.
2. **بررسی تطابق Code Connect (Code Connect Resolution)**:
   - بازبینی اینکه آیا لایه فیگما به یک کامپوننت ثبت‌شده در مخزن (`@commerce-os/ui` یا کامپوننت‌های موجود) نگاشت شده است یا خیر.
   - در صورت وجود کامپوننت، استفاده مستقیم از آن به جای کدنویسی تکراری `<div>`های دستی.
3. **تولید کدهای React با ساختار منطقی (Semantic React Code Generation)**:
   - استفاده از تگ‌های معنایی HTML5 (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<aside>`).
   - تبدیل Auto Layout به کدهای استاندارد Flexbox و CSS Grid همراه با منطق RTL (`gap`, `flex-row`, `grid-cols-12`).
   - اعمال فونت وزیرمتن برای متون فارسی و Inter برای مقادیر فنی/لاتین، به همراه `tabular-nums` برای مقادیر عددی.
4. **تأمین تعاملات و وضعیت‌های پویا (Dynamic State Scaffold)**:
   - تزریق Props مناسب برای مدیریت حالت‌ها: `isLoading`, `isError`, `isEmpty`, `isActive`, `isDisabled`.
   - آماده‌سازی اسکلت لودینگ (Skeleton) مطابق با هندسه دقیق فریم فیگما جهت جلوگیری از جهش چیدمان (CLS - Cumulative Layout Shift).
5. **ارزیابی در برابر قوانین ضد اسلاپ (Anti-Slop Audit)**:
   - کنترل حذف هرگونه آیکون بی‌معنی، انیمیشن‌های لرزان غیربالینی، یا باکس‌های متنی بدون کارکرد.

## قوانین غیرقابل مذاکره (Non-Negotiable Rules)

1. **ممنوعیت بازطراحی سلیقه‌ای**: ایجنت مجاز نیست بر اساس سلیقه شخصی جای دکمه‌ها، فواصل یا رنگ‌های مصوب در فریم Figma را تغییر دهد.
2. **پایبندی به معماری Next.js Server Components**: بخش‌های استاتیک و رندری باید به‌صورت Server Component (RSC) باقی بمانند؛ `'use client'` فقط در لایه‌های ضروری تعاملی اعمال شود.
3. **کدهای بدون باگ هیدریشن (Hydration-Safe)**: اطمینان از عدم دسترسی مستقیم به اشیاء `window` یا `localStorage` در مرحله رندر اولیه سرور برای جلوگیری از Hydration Mismatch.

## تست‌ها و اعتبارسنجی (Validation)

- کامپایل بدون خطای کامپوننت‌های تولیدشده از طریق TypeScript (`tsc --noEmit`).
- بررسی انطباق ساختار کامپوننت با متغیرهای CSS سیستم طراحی.
- تست رندر کامپوننت در حالت‌های مختلف Props در محیط تست یا Storybook.

## معیار پذیرش (Definition of Done)

- تولید کامپوننت‌های خوانا، ماژولار و تیپ‌بندی‌شده دقیقاً مطابق با فریم Figma.
- عدم استفاده از کدهای استایل هاردکد شده و استفاده کامل از متغیرهای سیستم توکن.
- آمادگی کد برای اتصال به منطق تجاری و داده‌های واقعی در مرحله Gate 5.

## شواهد و خروجی‌های تحویل (Deliverables)

- کامپوننت‌های تولیدشده React (`*.tsx`) در مسیر مشخص‌شده.
- فایل استایل یا ماژول‌های CSS متناظر با کامپوننت.
- جدول تطابق لایه‌های فیگما با ساختار کامپوننت نهایی.

## کارهایی که نباید انجام شوند (Anti-Patterns)

- کپی کردن کد خروجی بی‌کیفیت ابزارهای خودکار تبدیل (مانند تبدیل‌های دارای مقادیر مطلق پیکسلی `position: absolute`).
- استفاده از تصاویر استاتیک به جای کامپوننت‌های ساختاری و متنی فریم.
- نادیده گرفتن متون RTL فارسی در ساختار واریانت‌های تولیدشده.

## قالب گزارش اجرای Skill

```text
Skill: drdermer-design-to-code
Figma Frame Source: [URL / Frame Name]
Generated React Components:
  - [Component Path]: [RSC | Client Component]
Components Reused from Design System: [StationButton, GlassCard, etc.]
Token Variables Referenced:
  - Colors: [...]
  - Spacing / Layout: [...]
Hydration Safety Check: [PASS]
Anti-Slop Visual Check: [PASS]
Status: HANDED_TO_A5_FRONTEND
```
