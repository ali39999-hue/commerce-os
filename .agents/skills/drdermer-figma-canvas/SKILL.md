---
name: drdermer-figma-canvas
description: ساخت و ویرایش بومی Figma Canvas با متغیرها، Auto Layout، واریانت‌ها و نام‌گذاری معنایی در Gate 2.
---

# drdermer-figma-canvas

## هدف (Objective)

طراحی و ساخت فریم‌های بومی، کامپوننت‌ها، متغیرها (Variables) و سیستم Auto Layout در **Figma Canvas** از طریق Figma Remote MCP (`https://mcp.figma.com/mcp`) در مرحله **Gate 2 (Canvas Draft)**، با رعایت استانداردهای تیره کلینیکال، ساختار منظم لایه‌ها و نام‌گذاری معنایی پیش از ارجاع به تأیید انسانی (Gate 3).

## زمان استفاده / Triggers

- گام **Gate 2 (Canvas Draft)** پس از تصویب Brief بالینی در Gate 1.
- ایجاد یا به‌روزرسانی فریم‌های Figma برای صفحات فروشگاه، داشبوردهای B2B، شبیه‌سازها و ماژول‌های سخت‌افزاری ۳۶۰ درجه.
- ساخت و اصلاح واریانت‌های کامپوننت‌های UI در Figma Library.
- آماده‌سازی طرح‌ها برای بازبینی و مصوب‌سازی در Gate 3 توسط Product Owner.

## ورودی‌های موردنیاز (Required Inputs)

1. سند Design Brief مصوب از Gate 1 (`drdermer-design-research`).
2. توکن‌های رنگی، فاصله‌ها و تایپوگرافی از `DESIGN.md`.
3. لینک فایل رسمی Figma پروژه Dr Dermer و کلیدهای دسترسی MCP.
4. ساختار صفحات رسمی فایل Figma بر اساس بخش ۲.۱ معماری فاز ۰۹.

## ساختار رسمی صفحات در فایل Figma

- `00 — Cover, Briefs & Decisions`
- `01 — Foundations / Variables` (Colors, Spacing, Typography, Radii, Shadows)
- `02 — Components / Variants` (Buttons, Inputs, Cards, Modals, Tabs, Gauges)
- `03 — Patterns / Shells` (Header, Elevated Navigation, Footer, Drawers)
- `04 — Storefront Desktop` (1440px / 1280px)
- `05 — Storefront Mobile` (360px / 390px)
- `06 — Clinical & Academy` (Protocols, INCI Dossier, Bohr Effect Simulator)
- `07 — Professional & B2B` (Wholesale, Clinic Orders, Cabinet Sizes)
- `08 — ERP Desktop` (Catalog, Inventory, Orders, Transactions)
- `09 — ERP Mobile Workflows`
- `10 — States & Edge Cases` (Loading, Empty, Error, Offline, Validation)
- `11 — Prototype Journeys` (Interactive connections)
- `12 — Archive / Superseded`

## روش اجرای مرحله‌ای (Step-by-Step Procedure)

1. **بررسی پایه‌های موجود در Figma (Inspect Existing Variables)**:
   - پیش از ترسیم المان جدید، از طریق ابزارهای Figma MCP متغیرهای رنگی موجود (`--color-bg-base: #070b12`، `--color-teal-primary: #06b6d4` و غیره) را استخراج و استفاده کن.
2. **استفاده انحصاری از Auto Layout و Constraints**:
   - تمام لایه‌ها، کارت‌ها و سکشن‌ها باید دارای Auto Layout عمودی یا افقی، فاصله‌گذاری استاندارد (ضریب ۴ پیکسل) و تراز مناسب باشند.
   - استفاده از فریم‌های شناور و بدون Constraint برای المان‌های ساختاری ممنوع است.
3. **نام‌گذاری معنایی لایه‌ها (Semantic Layer Naming)**:
   - نام لایه‌ها باید کارکرد و نقش داشته باشند: `ProductGallery`, `PriceBlock`, `PrimaryCTA`, `BohrGauge`, `ClinicalDossierCard`؛ نام‌هایی مانند `Frame 912` یا `Rectangle 4` مطلقاً ممنوع است.
4. **تولید واریانت‌های چندحالته (Component Variants & States)**:
   - برای هر کامپوننت حداقل واریانت‌های: `Default`, `Hover`, `Active`, `Focus`, `Loading`, `Disabled` و `Error` طراحی شود.
   - برای صفحات، فریم‌های مستقل دسکتاپ (`1440px` یا `1280px`) و موبایل (`390px` و `360px`) به همراه جهت‌های RTL و LTR ترسیم شود.
5. **ثبت یادداشت‌های رفتاری (Behavioral Annotations)**:
   - رفتارهای نامرئی مانند فوکوس کیبورد، حالت چسبان (Sticky Header)، نقاط شکست ریسپانسیو و منطق‌های باز شدن Modal با ابزار Annotation در فیگما ثبت شود.
6. **آماده‌سازی برای Gate 3**:
   - قرار دادن طرح نهایی در صفحه Proposal/Draft مشخص و تنظیم لینک فریم برای بررسی و تأیید Product Owner.

## قوانین غیرقابل مذاکره (Non-Negotiable Rules)

1. **عدم ویرایش مستقیم در صفحات Published Master**: ایجنت A3 فقط حق ویرایش در صفحات Proposal یا Draft را دارد تا زمانی که تأیید انسانی در Gate 3 ثبت شود.
2. **عدم استفاده از گروه‌های تکراری (No Raw Shapes)**: تمام المان‌های پرتکرار باید کامپوننت با واریانت باشند، نه شکل‌ها و متون کپی‌شده پراکنده.
3. **انطباق سخت‌گیرانه با پالت تیره کلینیکال**: پس‌زمینه‌های مشکی آزمایشگاهی (`#070b12`) و شیشه‌ای به همراه اکسنت‌های تخصصی (Teal, Plasma Purple, Emerald) باید طبق `DESIGN.md` رعایت شوند.
4. **حفظ حریم خصوصی**: هیچ نام بیمار واقعی، عکس پرونده پزشکی حقیقی یا شماره کارت بانکی نباید در فریم‌های فیگما درج گردد؛ فقط داده‌های ساختگی تمیز و بالینی.

## تست‌ها و اعتبارسنجی (Validation)

- بررسی ساختار Auto Layout با تغییر اندازه عرض فریم در فیگما (Resizing Test).
- بررسی کنتراست رنگ متن‌ها با پلاگین‌های WCAG در فیگما (حداقل نسبت ۴.۵ به ۱).
- بررسی صحت ارجاع متغیرها به Tokens موجود.

## معیار پذیرش (Definition of Done)

- فریم‌های کامل دسکتاپ و موبایل با ساختار تمیز لایه‌ها و نام‌گذاری معنایی آماده شده باشد.
- تمامی وضعیت‌های لودینگ، ارور و خالی در صفحه `10 — States & Edge Cases` ترسیم شده باشند.
- لینک مستقیم فریم در تسک ثبت شده و آماده ورود به **Gate 3 (Human Design Approval)** باشد.

## شواهد و خروجی‌های تحویل (Deliverables)

- لینک فریم Figma Native (`https://figma.com/file/...`).
- اسکرین‌شات خروجی فریم از طریق MCP یا ایمپورت تصویر.
- مستند حاشیه‌نویسی رفتار تعاملی و تعاریف متغیرها.

## کارهایی که نباید انجام شوند (Anti-Patterns)

- کپی مستقیم تصاویر یا وکتورهای دارای کپی‌رایت از سایت‌های دیگر بدون برداری‌سازی بالینی.
- کشیدن طرح تک‌اندازه (فقط دسکتاپ) بدون توجه به نسخه موبایل و چیدمان راست‌به‌چپ (RTL).
- رها کردن فریم‌های نامرتب و بدون گروه‌بندی ساختاری در ریشه فایل Figma.

## قالب گزارش اجرای Skill

```text
Skill: drdermer-figma-canvas
Figma File: [File Key / URL]
Page: [e.g. 04 — Storefront Desktop]
Created/Updated Frames:
  - [Frame ID / Name]: [Resolution, e.g. 1440x2800]
  - [Mobile Frame ID / Name]: [Resolution, e.g. 390x2400]
Component Instances Used: [Button, Card, StationTabs, BohrGauge]
Variables Applied: [color-bg-base, color-teal-primary, space-md, ...]
Auto-Layout Compliance: [PASS | FAIL]
States Covered: [Default, Hover, Loading, Error, Empty]
Figma Share URL: https://figma.com/design/...
Status: READY_FOR_GATE_3_APPROVAL
```
