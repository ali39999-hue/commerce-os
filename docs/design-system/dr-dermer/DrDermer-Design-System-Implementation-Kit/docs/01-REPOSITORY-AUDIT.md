# Repository Audit
پیش از تغییر کد:
1. package manifests و framework versions را بخوان.
2. route tree، layouts، components و styles را استخراج کن.
3. API endpoints، server actions و data hooks را فهرست کن.
4. auth، roles، permissions و middleware را بررسی کن.
5. مدل‌های product, price, stock, order, customer, professional, course, content را ردیابی کن.
6. baseline lint/typecheck/unit/e2e/build ثبت کن.
7. screenshots ثابت از صفحات کلیدی تهیه کن.
8. duplicate components، hardcoded styles و responsive defects را ثبت کن.

قواعد: هیچ فایل/endpoint ناشناخته‌ای حذف نشود؛ API و business rules بدون مجوز تغییر نکنند؛ یافته‌ها با Verified / Inferred / Unknown علامت بخورند.

خروجی‌ها: ROUTE_INVENTORY.md، FEATURE_REALITY_MATRIX.md، API_CONTRACT_MAP.md، ROLE_PERMISSION_MATRIX.md، BASELINE_TEST_REPORT.md.
