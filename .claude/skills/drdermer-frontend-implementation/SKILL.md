---
name: drdermer-frontend-implementation
description: پیاده‌سازی اسلایس عمودی صفحات، مدیریت حالت‌های لودینگ/خالی/خطا و ریسپانسیو بی‌نقص در Gate 5.
---

# drdermer-frontend-implementation

## هدف (Objective)

پیاده‌سازی اسلایس عمودی کامل و بدون نقص (Vertical Slice Implementation) در فرانت‌اند Dr Dermer UK Clinical & Commerce OS طی مرحله **Gate 5 (Vertical Slice Implementation)**؛ شامل ادغام کامپوننت‌های رندری، اتصال به جریان داده، مدیریت دقیق وضعیت‌های گذار (Loading, Skeleton, Empty, Error, Success) و تضمین رفتار روان در تمام ویوپورت‌ها بدون رها کردن باگ‌های هیدریشن یا گلوگاه‌های پرفورمنس.

## زمان استفاده / Triggers

- مرحله اجرایی **Gate 5 (Vertical Slice Implementation)** پس از آماده‌سازی کامپوننت‌ها در Gate 4.
- پیاده‌سازی صفحات جدید در روت‌های ۴۳ گانه پلتفرم (مانند Hero Banner، Clinical Station، Cart، B2B Protocols).
- بازسازی و بهینه‌سازی روت‌های دارای عملکرد ضعیف، پرش چیدمان (Layout Shift) یا خطاهای تعاملی.
- پیاده‌سازی المان‌های تعاملی سخت‌افزاری ۳۶۰ درجه و شبیه‌سازهای اثر بور.

## ورودی‌های موردنیاز (Required Inputs)

1. کامپوننت‌های تولیدشده از `drdermer-design-to-code`.
2. قراردادهای API و کلاینت‌های داده از `drdermer-api-integration`.
3. نیازمندی‌های حالت‌های مرزی (Edge Cases) از Brief بالینی (Gate 1).
4. استانداردهای تعامل و فیزیک حرکتی از `DESIGN.md`.

## فایل‌ها و ماژول‌های مرتبط (Relevant Paths)

- `apps/storefront/app/` (فایل‌های `page.tsx` و `layout.tsx`)
- `apps/storefront/components/` (کامپوننت‌های تعاملی و ماژول‌ها)
- `apps/storefront/app/globals.css` و استایل‌های بالینی
- تست‌های دود ای۲ای در `apps/storefront/e2e/`

## روش اجرای مرحله‌ای (Step-by-Step Procedure)

1. **مونتاژ اسلایس عمودی (Vertical Slice Assembly)**:
   - اتصال درخت کامپوننت‌ها به ساختار روت در Next.js App Router.
   - بهره‌گیری از قابلیت‌های Streaming و Suspense در سرور کامپوننت‌ها برای ارائه اولین بایت در کمترین زمان ممکن (TTFB).
2. **مدیریت وضعیت‌های پنج‌گانه چرخه حیات (The 5 Lifecycle States)**:
   - **Loading State**: اسکلت لودینگ دقیق با ابعاد فریم نهایی جهت جلوگیری کامل از CLS.
   - **Empty State**: پیام آموزنده، راهنمای بالینی و دکمه CTA شفاف برای هدایت کاربر.
   - **Interactive / In-Flight State**: نمایش اسپینر ظریف درون دکمه‌ها (`isSubmitting`) با غیرفعال شدن موقت جهت جلوگیری از دابل‌کلیک.
   - **Success State**: بازخورد بالینی ملموس (مثلاً تأیید ثبت سفارش یا تغییر پروتکل) همراه با اعلان صوتی/بصری آرام.
   - **Error State**: مرز خطا (Error Boundary) محلی با دکمه تلاش مجدد (`retry`) و پیام شفاف به زبان فارسی بدون افشای استک‌ترس‌های سرور.
3. **پیاده‌سازی تعاملات و فیزیک لمسی (Touch Physics & Canvas Scrubbing)**:
   - برای سکانس‌های ۳۶۰ درجه: استفاده از بافرینگ دوگانه HTML5 Canvas جهت حذف فلیکر، به همراه کنترل پوینتر و اینرسی حرکتی.
   - برای اسلایدرهای اثر بور: بازخورد بلافاصله ریاضی روی منحنی تفکیک اکسیژن و نمایشگرهای عددی بدون لکنت رندر.
4. **تضمین سلامت هیدریشن و عملکرد (Hydration & Performance Lock)**:
   - بررسی عدم استفاده از مقادیر پویا در رندر اولیه سرور (مانند `Date.now()` یا `Math.random()`).
   - بهینه‌سازی لود تصاویر با تگ‌های `next/image`، ویژگی `priority` برای تصاویر LCP و ابعاد معین `width/height`.
5. **بررسی نهایی ضد اسلاپ فرانت‌اند**:
   - حذف انیمیشن‌های غیرضروری و گیج‌کننده؛ حفظ وقار آزمایشگاهی و سادگی کاربری.

## قوانین غیرقابل مذاکره (Non-Negotiable Rules)

1. **عدم اختلال در منطق تجاری موجود**: تغییرات UI نباید محاسبات سبد خرید، کدهای تخفیف، تبدیل‌های ارزی یا سشن کاربر را مخدوش کند.
2. **ممنوعیت استفاده از ماک‌های داخلی در کدهای پایانی**: کدهای پیاده‌سازی‌شده باید مستقیماً با سرویس‌های واقعی صحبت کنند یا از قراردادهای تعریف‌شده داده استفاده نمایند.
3. **بدون سرریز افقی (No Horizontal Scroll)**: در تمامی ویوپورت‌های موبایل از ۳۶۰ پیکسل به بالا باید اسکرول افقی غیرمجاز کاملاً صفر باشد.

## تست‌ها و اعتبارسنجی (Validation)

- تست ساخت پروداکشن بدون خطا (`pnpm --filter @commerce-os/storefront run build`).
- بررسی عدم وجود هشدارهای کنسول در مرورگر.
- اجرای تست‌های دود (Smoke Tests) با Playwright برای اطمینان از بالا آمدن روت.

## معیار پذیرش (Definition of Done)

- پیاده‌سازی کامل اسلایس عمودی با تمامی ۵ حالت چرخه حیات.
- رندر کامل و ریسپانسیو در ۳۶۰، ۳۹۰، ۷۶۸ و ۱۲۸۰ پیکسل.
- پاس شدن صددرصدی بیلد بدون هیچ‌گونه هشدار تایپ‌اسکریپت یا هیدریشن.

## شواهد و خروجی‌های تحویل (Deliverables)

- کدهای کامپوننت و روت در شاخه اختصاصی تسک.
- گزارش ساخت بیلد موفق Next.js.
- شواهد ویدیویی یا اسکرین‌شات از چرخه وضعیت‌های لودینگ، داده و ارور.

## کارهایی که نباید انجام شوند (Anti-Patterns)

- تعبیه منطق‌های سنگین تجاری (مانند محاسبه مالیات یا تخفیف ردیفی) در کلاینت؛ این کار وظیفه بک‌اند است.
- قرار دادن پیام‌های خطای خام انگلیسی سرور در دید کاربر ایرانی.
- استفاده از پکیج‌های حجیم اضافی برای کارهای ساده با CSS و جاوااسکریپت بومی.

## قالب گزارش اجرای Skill

```text
Skill: drdermer-frontend-implementation
Route Implemented: [e.g. /cart, /b2b/protocols]
Files Modified/Created:
  - apps/storefront/app/...
  - apps/storefront/components/...
Lifecycle States Implemented:
  - Loading / Skeleton: [VERIFIED]
  - Empty State: [VERIFIED]
  - Error Boundary: [VERIFIED]
  - Success Feedback: [VERIFIED]
Build Verification: [pnpm build -> 0 ERRORS]
Hydration Clean: [YES]
Horizontal Overflow (<640px): [NONE]
Status: READY_FOR_GATE_6_QA
```
