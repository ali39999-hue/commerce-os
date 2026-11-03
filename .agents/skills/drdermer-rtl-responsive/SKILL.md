---
name: drdermer-rtl-responsive
description: پیاده‌سازی و آزمون چیدمان راست‌به‌چپ (RTL) فارسی، تایپوگرافی وزیرمتن و ویوپورت‌های استاندارد موبایل تا دسکتاپ در Gate 5 و 6.
---

# drdermer-rtl-responsive

## هدف (Objective)

تضمین پیاده‌سازی بی‌نقص، بومی و اصولی چیدمان راست‌به‌چپ (RTL) زبان فارسی در کنار انطباق چندجهته (Bidirectionality) با LTR لاتین، استانداردسازی تایپوگرافی فونت وزیرمتن با اعداد جدولی، و آزمون موشکافانه واکنش‌گرایی در ۵ ویوپورت استاندارد تجاری (۳۶۰، ۳۹۰، ۷۶۸، ۱۲۸۰ و ۱۴۴۰ پیکسل) برای پیشگیری از هرگونه سرریز افقی (Overflow) یا تداخل متنی در مرحله **Gate 5 و Gate 6**.

## زمان استفاده / Triggers

- مراحل پیاده‌سازی فرانت‌اند (Gate 5) و بازبینی تضمین کیفیت (Gate 6).
- پیاده‌سازی یا تغییر لایوت‌های عمومی، هدر، منوی ناوبری، دراورهای کشویی و فرم‌های ثبت اطلاعات.
- تست و اعتبارسنجی صفحات روی دستگاه‌های مختلف موبایل، تبلت و مانیتورهای عریض دسکتاپ.
- بررسی فونت‌ها، اعداد فارسی/انگلیسی، جداول قیمت و واحدهای پولی (تومان/پوند).

## ورودی‌های موردنیاز (Required Inputs)

1. استانداردهای تایپوگرافی و نقاط شکست ریسپانسیو از `DESIGN.md`.
2. راهنماهای جامع `.agents/skills/antislop-layoutmobile/SKILL.md` و `multilingual-rtl-i18n`.
3. صفحات و کامپوننت‌های رندرشده در `apps/storefront/`.
4. ابزار Playwright MCP یا شبیه‌سازهای اندازه صفحه مرورگر.

## پنج ویوپورت استاندارد الزامی (The 5 Canonical Viewports)

| نوع دستگاه | عرض (Width) | ارتفاع (Height) | الزامات کلیدی بررسی |
|---|---|---|---|
| **Mobile Compact** | `360px` | `800px` | کوچک‌ترین نمایشگر مرسوم، عدم سرریز متن‌ها، تاچ تارگت ۴۸ پیکسل |
| **Mobile Standard** | `390px` | `844px` | استاندارد آیفون، چیدمان ستونی تمیز، اکشن‌بار چسبان پایین |
| **Tablet Portrait** | `768px` | `1024px` | تبدیل منوی ناوبری، شبکه‌بندی ۲ ستونه، پاپ‌اورهای تراز |
| **Desktop Standard** | `1280px` | `800px` | حداکثر عرض کانتینر (`max-w-7xl`)، شبکه‌بندی ۳ ستونه، استیج محصولات |
| **Desktop Ultra-Wide** | `1440px` | `900px` | استیج کامل ۳۶۰ درجه سخت‌افزاری، جلوگیری از کشیدگی بی‌رویه خطوط متن |

## روش اجرای مرحله‌ای (Step-by-Step Procedure)

1. **اعمال ویژگی‌های منطقی در استایل‌ها (CSS Logical Properties)**:
   - حذف کامل خصوصیات جهت‌دار سنتی (`margin-left`, `right: 0`, `float: left`, `text-align: right`).
   - استفاده انحصاری از خصوصیات منطقی:
     - `margin-inline-start` / `margin-inline-end`
     - `padding-inline-start` / `padding-inline-end`
     - `inset-inline-start` / `inset-inline-end`
     - `text-align: start`
2. **تنظیم تایپوگرافی وزیرمتن و ارقام جدولی (Tabular Numerals)**:
   - اطمینان از تعریف صحیح تگ HTML با `dir="rtl"` و زبان `lang="fa"`.
   - اعمال `font-family: var(--font-vazirmatn), system-ui, sans-serif` با ضریب کشیدگی خط مناسب (`line-height: 1.8` برای متون فارسی).
   - اجباری بودن `font-variant-numeric: tabular-nums` در کلیه فیلدهای قیمت، گیج‌های سنجش، شمارنده‌های معکوس و موجودی‌ها جهت تثبیت پهنای ارقام.
3. **جهت‌گیری صحیح المان‌های گرافیکی و آیکون‌ها (Icon & Media Mirroring)**:
   - آیکون‌های هدایت‌کننده (پیکان‌های بعد/قبل، برگشت، مسیرها) باید در جهت RTL معکوس شوند (`scale-x-[-1]`).
   - آیکون‌های متقارن یا جهانی (علامت پخش ویدیو، جستجو، ساعت، کارت اعتباری) نباید آینه‌ای شوند.
4. **تست دقیق عدم سرریز افقی در ۳۶۰ پیکسل (Zero Horizontal Overflow Lock)**:
   - اسکریپت بازرسی اسکرول: `document.documentElement.scrollWidth > document.documentElement.clientWidth` در تمامی صفحات باید `false` باشد.
   - جلوگیری از پنهان کردن تنبل‌وار باگ با `overflow-x: hidden` روی تگ `body`؛ سرریز باید با اصلاح اندازه المان‌های داخلی برطرف شود.
5. **ارزیابی تعاملات لمسی در موبایل (Touch Targets & Sticky Bars)**:
   - حداقل ارتفاع دکمه‌های اصلی و ورودی‌ها در موبایل: ۴۸ پیکسل.
   - سبد خرید یا دکمه اقدام نهایی در موبایل به‌صورت نوار چسبان در پایین صفحه (Sticky Bottom Bar) همراه با احتساب Safe Area حاشیه پایین نمایشگر.

## قوانین غیرقابل مذاکره (Non-Negotiable Rules)

1. **ممنوعیت اختلاط جهت اعداد و علائم**: مبالغ پولی و واحدهای سنجش باید با ترتیب اصولی فارسی نمایش داده شوند (مثلاً: `۲۵۰,۰۰۰ تومان` یا `15 ppm`).
2. **پایداری فرمت لاتین برای کدهای شیمیایی**: اسامی INCI، فرمول‌ها و کدهای CAS به صورت استاندارد بین‌المللی LTR در بلوک‌های محافظت‌شده نمایش داده شوند.
3. **تست اجباری در تمام ۵ ویوپورت**: هیچ تغییر UI بدون تأیید اسکرین‌شات یا بازرسی در هر ۵ رزولوشن مجاز به خروج از Gate 6 نیست.

## تست‌ها و اعتبارسنجی (Validation)

- اجرای اسکریپت بازرسی اسکرول افقی روی صفحات در ویوپورت‌های ۳۶۰ و ۳۹۰ پیکسل.
- آزمون سویچ زنده جهت صفحه (`dir="rtl"` به `dir="ltr"`) جهت اطمینان از سلامت استایل‌ها.
- بررسی تایپوگرافی فارسی در مرورگرهای سافاری و کروم.

## معیار پذیرش (Definition of Done)

- خوانایی کامل و بدون عیب متون فارسی وزیرمتن در تمامی مقیاس‌ها.
- صفر بودن مطلق سرریز افقی در تمامی ابعاد از ۳۶۰px تا ۱۴۴۰px.
- تراز و رفتار طبیعی منوها، دراورها و کاروسل‌ها در جهت راست‌به‌چپ.

## شواهد و خروجی‌های تحویل (Deliverables)

- جدول گزارش آزمون ریسپانسیو در ۵ ویوپورت (`RESPONSIVE_QA_MATRIX.md`).
- اسکرین‌شات‌های مقایسه‌ای ۳۶۰ پیکسل و ۱۲۸۰ پیکسل.
- کدهای اصلاح‌شده با خصوصیات منطقی CSS.

## کارهایی که نباید انجام شوند (Anti-Patterns)

- استفاده از فونت‌های پیش‌فرض سیستم (مانند Arial یا Tahoma) برای زبان فارسی.
- قرار دادن آیکون ضربدر بستن مودال در سمت چپ بدون در نظر گرفتن تراز منطقی RTL.
- تکیه صرف به ابزار ریسپانسیو DevTools بدون تست دقیق عناصر دارای موقعیت مطلق (Fixed/Absolute).

## قالب گزارش اجرای Skill

```text
Skill: drdermer-rtl-responsive
Target Route: [e.g. /home, /clinical-station]
Direction Validated: RTL (Native Persian) & LTR (Scientific/INCI)
Font Applied: Vazirmatn (Tabular Numerals for Prices/PPM)
Viewport Test Results:
  - 360px Mobile Compact: [PASS - 0 Overflow, 48px tap targets]
  - 390px Mobile Standard: [PASS - Clean single-column reflow]
  - 768px Tablet Portrait: [PASS - 2-column balanced grid]
  - 1280px Desktop Standard: [PASS - Max-width 7xl centered]
  - 1440px Ultra-Wide: [PASS - Bounded hardware stage]
Horizontal Overflow Detected: [NO - ScrollWidth == ClientWidth]
Logical Properties Compliance: [100% Logical CSS]
Status: VERIFIED_FOR_GATE_6
```
