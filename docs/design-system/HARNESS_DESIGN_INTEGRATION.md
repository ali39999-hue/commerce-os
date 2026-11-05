# Dr. Dermer UK · Harness Multi-Tool Design System Integration

این سند راهنمای جامع اتصال ابزارهای هارنس طراحی ZCode شامل **Excalidraw, VectorCraft, DesignCraft, PhotoCraft, و Gen UI** برای ارتقای هماهنگ رابط کاربری پلتفرم **Dr Dermer UK Clinical & Commerce OS** است.

---

## ۱. نقشه راه و هم‌افزایی ابزارها

```
[Excalidraw: وایرفریم، تریاژ بالینی و جریان سفارش]
  └─► [VectorCraft: نشانگرهای بالینی، آیکون‌های پوست و نفوذ مولکولی]
        └─► [PhotoCraft: کامپوزیت استیج محصولات و شوتینگ دوگانه سخت‌افزار]
              └─► [DesignCraft: صفحه‌آرایی مونوگراف، پروتکل‌ها و نسخه درمانی]
                    └─► [Gen UI: استودیو و سوئیت بالینی زنده درون گفت‌وگو]
```

---

## ۲. مستندات و دارایی‌های تولید شده

### الف) معماری اطلاعات و فلوچارت (Excalidraw)
- **دیاگرام ۱ (ساختار جامع سایت و تریاژ ۳ مسیره)**: `docs/design-system/diagrams/ui-architecture-flow.excalidraw`
- **دیاگرام ۲ (جریان سفارش، تسویه‌حساب دوگانه و دفتر کل)**: `docs/design-system/diagrams/commerce-checkout-ledger-flow.excalidraw`
- **دیاگرام ۳ (درخت تصمیم‌گیری بالینی و عیب‌یابی پوست)**: `docs/design-system/diagrams/skin-diagnostic-decision-tree.excalidraw`

### ب) نشانگرها و آیکون‌های وکتور (VectorCraft)
- **نشانگرهای رگولاتوری**:
  - `docs/design-system/vectors/bohr-badge.svg` & `.png`: نشانگر واکنش فیزیولوژیک اثر بور و پمپاژ O₂
  - `docs/design-system/vectors/cold-chain-badge.svg` & `.png`: بج کنترل زنجیره سرد ایزوترمال ۲-۸ درجه سانتی‌گراد
  - `docs/design-system/vectors/ce-mdr-badge.svg` & `.png`: بج گواهی رسمی تجهیزات پزشکی اتحادیه اروپا CE 0123 Class IIb
- **ست ۵ عددی وکتورهای نگرانی‌های پوستی (جایگزین ایموجی‌ها)**:
  - `concern-acne.svg`: آکنه و انسداد منافذ
  - `concern-pigmentation.svg`: هایپرپیگمانتاسیون و لک
  - `concern-barrier.svg` & `.png`: ترمیم سد دفاعی و پایش TEWL
  - `concern-aging.svg`: الاستیسیته و کاهش کلاژن
  - `concern-erythema.svg`: اریتما، قرمزی و التهاب مویرگی
- **وکتورهای بیوشیمیایی و سلولی**:
  - `vector-molecular-dispersion.svg` & `.png`: شماتیک نفوذ عمقی مولکول‌های CO₂ و آزادسازی O₂ در بافت درم
  - `vector-atp-cellular-respiration.svg`: ساختار حلقه تنفس سلولی و سنتز ATP میتوکندریایی

### ج) صفحه‌آرایی و مستندات مونوگراف (DesignCraft)
- `docs/design-system/layouts/drdermer-monograph.designcraft`: سند مادری چیدمان مونوگراف و نسخه‌ها
- `docs/design-system/layouts/drdermer-cover-layout.png`: خروجی صفحه جلد مونوگراف فیزیولوژی بالینی
- `docs/design-system/layouts/drdermer-tokens-page.png`: خروجی صفحه مشخصات توکن‌های رنگی و نسبت کنتراست
- `docs/design-system/layouts/drdermer-protocols-page.png`: خروجی صفحه استانداردها و پروتکل‌های درمانی ۳ گانه
- `docs/design-system/layouts/drdermer-prescription-sheet.png`: خروجی برگه نسخه بالینی و کارت درمانی بیمار

### د) کامپوزیت و استیج بصری محصولات (PhotoCraft)
- `docs/design-system/mockups/clinical-stage-mockup.png`: پس‌زمینه ارگانیک Warm Alabaster برای عکاسی صنعتی
- `docs/design-system/mockups/carboxygel-staged-presentation.png`: کامپوزیت ژل ۵۰۰ میلی‌لیتری به همراه نشانگرهای رگولاتوری
- `docs/design-system/mockups/reemed-hardware-stage.png`: استیج استیشن سخت‌افزاری CarboX همراه با بج استاندارد CE
- `docs/design-system/mockups/dual-hardware-medical-showcase.png`: کامپوزیت مقایسه‌ای استیشن‌های CarboX و PlasmaX در پس‌زمینه بالینی دارک

### هـ) سوئیت و استودیوهای تعاملی زنده درون گفت‌وگو (Gen UI)
1. **استودیو تست سریع کامپوننت‌ها**:
   - `drdermer-component-studio.html`
   - امکان سوئیچ تم و اسلایدر هیپوکسی ترمیمی
2. **سوئیت پیشرفته بالینی (Clinical Suite v3)**:
   - `drdermer-clinical-suite.html`
   - شبیه‌ساز اثر بور با محاسبه دینامیک pH از ۷.۴۰ به ۶.۷۲
   - دانشنامه مولکولی INCI به همراه رتبه‌بندی ایمنی CIR
   - تایمر هوشمند پروتکل ۱۵ دقیقه‌ای درمان با ۴ فاز عملیاتی
   - سوئیچ زنده پالت‌های رنگی Warm Editorial (14.0:1) و Obsidian Dark (14.8:1) با ارزیابی کنتراست

---

## ۳. تضمین عدم تداخل با سشن همکار

- کلیه فایل‌های سورس اجرایی Next.js، پکیج‌های دامنه، و تست‌های Playwright در شاخه `feat/DRD-phase-09-agentic-design-code-integration` دست‌نخورده باقی مانده‌اند.
- دارایی‌های دیزاین در پوشه ایزوله `docs/design-system/` متمرکز شده و هیچ فایل قفلی در دایرکتوری‌های پروژه ایجاد نگردیده است.
