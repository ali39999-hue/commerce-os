# پرامپت اجرایی Agent اصلی Commerce OS

تو مسئول ارتقای مخزن `ali39999-hue/commerce-os` به یک Commerce Platform و فروشگاه سطح جهانی هستی. سند مرجع:

`docs/roadmaps/COMMERCE_OS_GLOBAL_STORE_ROADMAP_FA.md`

## مأموریت

- تجربه Storefront را از ویترین نمونه به فروشگاه واقعی تبدیل کن.
- تجربه برند، معرفی محصول، خانواده‌های محصول، محتوای آموزشی و محتوای تخصصی را با الهام از `https://www.drdermer.co.uk/` طراحی کن.
- هسته مالی، موجودی، پرداخت، Outbox، Tenant Isolation و Modular Monolith فعلی را حفظ کن.
- Demo/Fallback را از مسیر Production حذف کن یا آن را به وضعیت خطای روشن تبدیل کن.
- Home، Category، Search، Product Detail، Cart، Checkout، Account، Editorial و Admin را به‌صورت end-to-end تکمیل کن.

## قوانین

1. README را به‌تنهایی مبنای ادعای تکمیل قرار نده؛ کد، DB واقعی، تست و Evidence ملاک هستند.
2. قبل از هر تغییر، فایل‌های موجود و API Contract را بررسی کن.
3. هیچ Backend موازی، دیتابیس دوم یا Microservice بی‌دلیل اضافه نکن.
4. قیمت، مالیات، موجودی، تخفیف، سفارش و پرداخت فقط از سرور معتبرند.
5. Money بدون Float، Idempotency، Ledger Append-only و Atomic Inventory باید حفظ شوند.
6. تمام endpointها باید Tenant/Permission Scope داشته باشند.
7. برای هر تسک تست و Evidence ارائه کن.
8. Placeholder، Lorem Ipsum، ادعای پزشکی تأییدنشده و CTA بدون عملیات واقعی ممنوع است.
9. هیچ Secret را وارد Git نکن.
10. بدون تأیید مالک محصول Push یا Release نکن.

## روند اجرا

- از `P00-001` شروع کن.
- Taskها را مطابق Roadmap با شناسه ثابت اجرا کن.
- هر فاز را با Acceptance Gate ببند.
- تسک ناقص را Done گزارش نکن.
- در پایان هر تسک مسیر فایل‌های تغییرکرده، Migration، Contract، تست اجراشده، Screenshot/Log و ریسک باقیمانده را گزارش کن.

## ترتیب اصلی

P00 → P01 → P02 → P03 → P04 → P05 → P06 → P07 → P08 → P09 → P10 → P11 → P12 → P13 → P14 → P15 → P16 → P17

## Definition of Done

- رفتار مورد انتظار پیاده‌سازی شده است.
- Loading/Empty/Error/Success/Disabled Stateها بررسی شده‌اند.
- Unit/Integration/E2E مناسب پاس شده‌اند.
- RTL/LTR و Responsive بررسی شده‌اند.
- Tenant isolation و Permission تست شده‌اند.
- API Contract/Docs/ADR به‌روز است.
- هیچ Demo/Fallback ناخواسته یا SKIP باقی نمانده است.
- Evidence قابل بازبینی وجود دارد.
