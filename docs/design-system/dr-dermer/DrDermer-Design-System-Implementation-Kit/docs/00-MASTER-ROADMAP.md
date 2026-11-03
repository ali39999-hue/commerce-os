# نقشه راه جامع پیاده‌سازی

## جهت طراحی
گرم، علمی، قابل اعتماد، مینیمال و لوکس؛ فروشگاه editorial، محتوای علمی دقیق، ERP با تراکم اطلاعات کنترل‌شده.

## Phase 0 — Governance
- تعیین Product Owner، Design Owner، Tech Lead.
- ثبت branch، baseline commit، CI و rollback.
خروجی: baseline report و decision log.

## Phase 1 — Repository Discovery
- استخراج stack، routeها، layoutها، shared components.
- فهرست APIها، Server Actions، فرم‌ها، auth و roleها.
- ثبت loading/empty/error/success هر صفحه.
- اجرای lint/typecheck/test/build و ثبت نتیجه واقعی.
خروجی: ROUTE_INVENTORY، FEATURE_REALITY_MATRIX، API_CONTRACT_MAP.

## Phase 2 — Design Foundations
- تأیید لوگو، فونت، رنگ، spacing، grid، radius، shadow و motion.
- semantic tokens و قواعد RTL/LTR.
- تفکیک density mode برای Storefront، Content و ERP.
خروجی: Figma Foundations + tokens JSON/CSS.

## Phase 3 — Component System
- Buttons, Inputs, Selects, Dialogs, Drawers, Tabs, Accordion.
- Header, Footer, Breadcrumb, Search.
- ProductCard, Gallery, Price, VariantSelector, CartLineItem.
- ArticleCard, EvidenceReference, CourseCard, VerificationStatus.
- AdminShell, DataTable, FilterBar, KPI, ApprovalQueue, AuditEvent.
برای هر جزء states، keyboard behavior، responsive و tests تعریف شود.

## Phase 4 — Pilot
Header + Homepage Hero + Product Card در Desktop/Mobile.
طراحی Figma → تأیید → پیاده‌سازی در معماری فعلی → Playwright → screenshot diff → PR.
گیت: حفظ API و رفتار، تست سبز، تأیید انسانی.

## Phase 5 — Commerce
Homepage → Navigation/Search → Category → Product Detail → Cart → Checkout → Account/Orders.
قیمت، موجودی، مالیات، ارسال و وضعیت پرداخت فقط از backend معتبر بیایند.

## Phase 6 — Clinical / Academy / B2B
Clinical Hub، مقالات، Ingredient Atlas، Evidence، Academy Catalog، Course/Lesson، Progress، Certificate، Professional Registration، Verification، B2B Catalog و Quote.
ادعاهای علمی و دسترسی آموزشی باید workflow و مجوز سمت سرور داشته باشند.

## Phase 7 — ERP
Operations Dashboard، My Work، Approval/Exception Center، CRM، Orders، Inventory، Procurement، PIM، Pricing، Finance Operations، Content/Academy Admin، Professional Verification، B2B Quotes، Reports، Audit و Integrations.
عملیات حساس: permission + confirmation + audit + idempotency در backend.

## Phase 8 — Quality
Responsive، RTL/LTR، keyboard، screen reader، visual regression، performance، SEO، security و role tests.

## Phase 9 — Release
Feature flags، staged rollout، monitoring، rollback drill، feedback و backlog.

## اولویت
P0: خرید/پرداخت، نشت داده، مجوز، قیمت/موجودی، عملیات مالی.
P1: مسیر اصلی خراب، فرم/جست‌وجو/فیلتر، responsive بحرانی.
P2: ناهماهنگی بصری محسوس.
P3: polish و micro-interactions.

## Definition of Done
طرح تأییدشده، API حفظ‌شده، همه states، responsive و RTL/LTR، تست‌ها، شواهد تصویری، accessibility، performance، docs و تأیید Reviewer انسانی.
