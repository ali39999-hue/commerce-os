---
name: drdermer-repo-audit
description: ممیزی منبع‌محور مخزن Dr Dermer، تطبیق واقعیت روت‌ها و APIها، شناسایی Gapها و تهیه گزارش حقیقت بدون پیش‌فرض.
---

# drdermer-repo-audit

## هدف (Objective)

بررسی دقیق و بدون سوگیری سورس‌کد پروژه Dr Dermer UK Clinical & Commerce OS برای استخراج وضعیت واقعی (Ground Truth) روت‌ها، سرویس‌های API، موجودی کامپوننت‌های Design System، مدل‌های داده و پوشش تست‌ها، فارغ از ادعاهای مستندات قدیمی یا کامنت‌های رهاشده.

## زمان استفاده / Triggers

- اجرای الزامی در **Gate 0 (Intake & Audit)** پیش از هرگونه توسعه یا بازطراحی.
- هنگام ارجاع به روت‌ها، APIها یا ماژول‌های ناشناخته جهت اعتبارسنجی عملیاتی بودن آنها.
- پیش از آغاز بازطراحی هر یک از ۴۳ روت کاتالوگ فروشگاه و پنل‌های بالینی.
- ارزیابی بدهی فنی و کشف کدهای ماک (Mock)، دمو یا داده‌های Hardcoded.

## ورودی‌های موردنیاز (Required Inputs)

1. روت یا دامنه مورد ممیزی (مثلاً روت `/cart` یا ماژول `/b2b/protocols`).
2. ساختار پکیج‌های Monorepo (`apps/storefront`، `apps/api`، `packages/*`).
3. اسناد بالینی `AGENTS.md` و معماری `ARCHITECTURE.md`.
4. وضعیت فعلی گیت و تغییرات ثبت‌نشده.

## فایل‌ها و ماژول‌های مرتبط (Relevant Paths)

- `apps/storefront/app/` (مسیر روت‌های Next.js App Router)
- `apps/api/src/` (ماژول‌های NestJS و دامنه‌های تجاری/بالینی)
- `packages/` یا کامپوننت‌های مشترک UI (`apps/storefront/components/`)
- `prisma/schema.prisma` و جداول پایگاه داده
- `docs/ui-ux/` (مستندات پیشین و قرارداد صفحات)

## روش اجرای مرحله‌ای (Step-by-Step Procedure)

1. **ممیزی روت‌های واقعی (Route Reality Audit)**:
   - جستجوی فایل‌های `page.tsx`, `layout.tsx`, `route.ts` در مسیرهای هدف.
   - تشخیص استاتیک، سروری (RSC) یا کلاینتی بودن کامپوننت (`'use client'`).
   - استخراج روت‌های ۴۳ گانه پلتفرم و ثبت وضعیت رندرهایی که با داده خالی یا خطا مواجه می‌شوند.
2. **رهگیری جریان داده از UI تا پایگاه داده (Data Flow Tracing)**:
   - دنبال کردن مسیر داده: Component → Hook / Server Action → API Service → Controller → Domain Logic → Prisma / DB.
   - بررسی اینکه آیا فراخوانی به اندپوئینت واقعی ارسال می‌شود یا یک آرایه استاتیک/ماک در کلاینت رندر می‌شود.
3. **شناسایی شکاف‌ها (Gap Analysis & Fake Detection)**:
   - جستجوی الگوهای فریبنده: `TODO`, `FIXME`, `mock`, `placeholder`, داده‌های فیک قیمت و موجودی، آمار دروغین و عبارات اسلاپ (مانند "Next-gen miracle").
   - ثبت دقیق شکاف‌های API میان نیازهای UI و اندپوئینت‌های موجود در NestJS.
4. **بررسی پایداری و تست‌ها (Verification Audit)**:
   - اجرای بررسی تایپ (`pnpm run type-check` یا `tsc --noEmit`).
   - بررسی پوشش تست‌های واحد و E2E موجود برای مسیر هدف.
5. **تدوین ماتریس حقیقت (Ground Truth Matrix)**:
   - تنظیم ماتریس شامل نام روت، مسیر فایل، منبع داده، وضعیت کامپوننت، پوشش تست و ریسک‌های موجود.

## قوانین غیرقابل مذاکره (Non-Negotiable Rules)

1. **قانون حقیقت (Truthfulness Rule)**: هرگز نباید یک ماژول یا قابلیت دارای داده ماک را به‌عنوان «آماده» یا «کامل» گزارش کرد.
2. **ممنوعیت فرض اندپوئینت**: اگر اندپوئینتی در `apps/api` وجود ندارد، نباید فرض کرد که وجود دارد یا به زودی ایجاد می‌شود؛ باید صراحتاً به عنوان Gap ثبت گردد.
3. **عدم ویرایش سورس در حین ممیزی**: ممیزی ایجنت A1 کاملاً Read-Only است و حق دستکاری در منطق سورس را ندارد.
4. **افشا نشدن داده‌های محرمانه**: هیچ کلید دسترسی، Token یا داده حساسی نباید در گزارش ممیزی درج شود.

## تست‌ها و اعتبارسنجی (Validation)

- تطبیق مسیرهای فیزیکی فایل‌ها با ابزار Glob/Find.
- تست کامپایل و بیلد بدون دستکاری کد.
- بازتولید خطاهای زمان اجرای روت‌ها از طریق تحلیل لاگ‌ها.

## معیار پذیرش (Definition of Done)

- تولید گزارش جامع و مبتنی بر شواهد شامل شماره خط و نام فایل برای تمام کاستی‌ها.
- ماتریس تطابق روت و سرویس‌های بک‌اند با برچسب‌های شفاف: `REAL`, `PARTIAL_MOCK`, `STUB`, `UNIMPLEMENTED`.
- خروجی آماده برای تحویل به Orchestrator (A0) جهت ارجاع به ایجنت‌های طراحی یا بک‌اند.

## شواهد و خروجی‌های تحویل (Deliverables)

- جدول گزارش ممیزی `ROUTE_REALITY_MATRIX.md`.
- لیست مغایرت‌های API با قرارداد فرانت‌اند (`API_GAP_REPORT.md`).
- لیست کدهای اسلاپ، المان‌های غیرعملکردی یا مقادیر هاردکد شده.

## کارهایی که نباید انجام شوند (Anti-Patterns)

- تکیه بر ادعاهای فایل‌های README به جای بازبینی خط به خط سورس.
- گزارش دادن یک روت فقط بر اساس وجود پوشه یا فایل خالی بدون ارزیابی منطق رندر آن.
- پنهان کردن خطاهای تایپ‌اسکریپت یا هشدارهای لینتر در گزارش نهایی.

## قالب گزارش اجرای Skill

```text
Skill: drdermer-repo-audit
Target Route / Module:
Route Type: [Server Component | Client Component | Hybrid]
Data Source Reality: [Real API | Local Mock | Hardcoded Static | Broken]
Backend Coverage:
  - Controller: [Path & Endpoint]
  - Service: [Status]
  - Database Entity: [Prisma Model]
Identified Gaps (Symbol, File, Line):
  - [GAP-01]: ...
Anti-Slop Findings (Hardcoded UI / AI Tropes):
Verification / Build State:
Ready for Gate 1 Brief: [YES | NO]
```
