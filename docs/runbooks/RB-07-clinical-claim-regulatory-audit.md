# RB-07 — ممیزی و تعلیق ادعای بالینی و رگولاتوری (Clinical Claim Regulatory Audit)

| فیلد | مقدار |
|---|---|
| شناسه | RB-07 |
| شدت | بالا (High) تا بحرانی (Critical) — ریسک حقوقی، تعلیق اینماد/مجوز وزارت بهداشت و سلامت مصرف‌کننده |
| دامنه | `products` · `product_variants` · `categories` · `catalog_revisions` · کش کاتالوگ (Redis / ISR Next.js) |
| سرویس‌ها | `storefront` · `api` · `admin` · سامانه نظارت سازمان غذا و دارو (TTAC / IFDA) |
| SLO مهار اولیه | حداکثر ۱۵ دقیقه برای تعلیق نمایش عمومی کالا یا حذف ادعای بحرانی |
| SLO حل ریشه‌ای | حداکثر ۲۴ ساعت برای اصلاح مستندات، بازبینی محتوا و دریافت تاییدیه ناظر |

---

## ۰. اصل حاکم

**سلامت مصرف‌کننده و انطباق با قوانین دارویی-آرایشی بر حفظ فروش اولویت مطلق دارد.**  
در صورت دریافت اخطار از سازمان غذا و دارو (IFDA)، معاونت درمان یا مراجع رگولاتوری پیرامون ادعاهای اثربخشی درمان (درمان قطعی آکنه، ضدچروک با اثر درمانی، خواص شبه‌دارویی، لایه‌برداری عمیق یا غلظت غیرمجاز اسیدها):
1. کالای مورد مناقشه یا ادعای بالینی آن بلافاصله از ویترین عمومی حذف یا به وضعیت `DRAFT` / `HIDDEN` منتقل می‌شود.
2. پیشینه سفارش‌ها و اسناد دفترکل به هیچ وجه دستکاری نمی‌شوند (تغییر وضعیت کاتالوگ نباید یکپارچگی ارجاعی رکوردهای تاریخی را بشکند).
3. تمام نسخه‌های کش‌شده در Redis، CDN و Next.js ISR در لحظه پاک‌سازی (Purge) می‌شوند.

---

## ۱. علائم و محرک‌ها (Symptoms & Triggers)

- دریافت اخطاریه رسمی کتبی یا سیستمی از سازمان غذا و دارو، وزارت بهداشت یا کارگروه نظارت بر کسب‌وکارهای مجازی (اینماد).
- گزارش بازرسی فنی مبنی بر عدم تطابق مجوز بهداشتی کالا (IRC / سیب سلامت) با ادعای مندرج در صفحه جزئیات محصول (PDP).
- گزارش عوارض جانبی حاد بالینی توسط پزشکان همکار یا مصرف‌کنندگان (Pharmacovigilance Alert).
- ممیزی داخلی دوره‌ای که تناقض میان پروانه ساخت/واردات و متن برچسب فارسی/انگلیسی کالا را آشکار کند.

---

## ۲. تشخیص و ارزیابی ریسک (Diagnosis)

### ۲.۱ استخراج فوری اطلاعات کالای هدف

```sql
-- شناسایی کالا، دسته‌بندی و وضعیت فعلی انتشار
SELECT p.id, p.slug, p.title_fa, p.status, p.irc_code, p.license_number,
       p.active_ingredients, p.clinical_claims, p.usage_instructions,
       p.created_at, p.updated_at
FROM products p
WHERE p.id = '<PRODUCT_ID>'::uuid OR p.slug = '<PRODUCT_SLUG>';

-- شناسایی تمامی واریانت‌های کالا و وضعیت موجودی
SELECT pv.id, pv.sku, pv.title_fa, pv.barcode, pv.price,
       il.on_hand, il.reserved_qty
FROM product_variants pv
LEFT JOIN inventory_levels il ON il.variant_id = pv.id
WHERE pv.product_id = '<PRODUCT_ID>'::uuid;
```

### ۲.۲ رده‌بندی سطح اضطرار اخطار رگولاتوری

| سطح ریسک | نوع اخطار / تخلف | اقدام مهار اولیه |
|---|---|---|
| **P0 — بحرانی** | خطر سلامت عمومی، عدم وجود مجوز بهداشتی، دستور پلمب/توقیف | تعلیق کامل کالا (`status = 'SUSPENDED'`) و صفر کردن دسترسی صفحه |
| **P1 — بالا** | ادعای درمانی غیرمجاز (مانند «درمان قطعی لک»، «جایگزین فیلر»)، عدم درج هشدار حساسیت | حذف یا سانسور بخش ادعاهای بالینی کالا در PDP در کمتر از ۱۵ دقیقه |
| **P2 — متوسط** | مغایرت درصد ماده موثره، اصلاح فرم دستوالعمل، اصلاح برچسب رژیم مصرف | اصلاح محتوا در پنل ادمین و انتشار بازنگری جدید |

---

## ۳. اقدام و مهار (Containment & Action)

### گام ۱ — تعلیق فوری کالا در کاتالوگ (کمتر از ۵ دقیقه)

از طریق پنل ادمین یا دستور مستقیم پایگاه‌داده:

```sql
BEGIN;

-- ۱. تغییر وضعیت کالا به SUSPENDED
UPDATE products
SET status = 'SUSPENDED',
    is_published = false,
    updated_at = NOW()
WHERE id = '<PRODUCT_ID>'::uuid;

-- ۲. ثبت رویداد در لاگ ممیزی و تاریخچه بازنگری کاتالوگ
INSERT INTO audit_logs (id, actor, action, target, ip, payload_json, created_at)
VALUES (
  gen_random_uuid(),
  '<ADMIN_USER_EMAIL_OR_SRE>',
  'REGULATORY_CLAIM_SUSPEND',
  CONCAT('product:', '<PRODUCT_ID>'),
  '127.0.0.1',
  jsonb_build_object(
    'reason', 'IFDA regulatory claim inspection notice',
    'noticeNumber', '<OFFICIAL_LETTER_REF>',
    'timestamp', NOW()
  ),
  NOW()
);

COMMIT;
```

### گام ۲ — پاک‌سازی کش و بازسازی فوری صفحه (Cache Invalidation)

برای جلوگیری از نمایش نسخه کَش‌شده در مرورگر کاربران یا موتورهای جستجو:

```bash
# ۱. ابطال کلید کش کالا در Redis
docker compose -f docker-compose.prod.yml exec redis \
  redis-cli DEL "cache:product:<PRODUCT_ID>" "cache:product:slug:<PRODUCT_SLUG>" "cache:catalog:search:*"

# ۲. فراخوانی Revalidation در استورفرانت Next.js
curl -s -X POST https://shop.domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: ${REVALIDATE_SECRET}" \
  -d '{"path": "/products/<PRODUCT_SLUG>"}'
```

### گام ۳ — جداسازی و لغو سبدهای خرید باز شامل کالای تعلیق‌شده

اگر محصول دارای واریانت فعال در سبدهای خرید بدون پرداخت است:

```sql
-- بررسی رزروهای فعال کالا که هنوز به سفارش قطعی تبدیل نشده‌اند
SELECT ir.id, ir.tenant_id, ir.expires_at, irl.variant_id, irl.reserved_qty
FROM inventory_reservations ir
JOIN inventory_reservation_lines irl ON irl.reservation_id = ir.id
JOIN product_variants pv ON pv.id = irl.variant_id
WHERE pv.product_id = '<PRODUCT_ID>'::uuid
  AND ir.status = 'ACTIVE';

-- ابطال رزروهای معلق برای جلوگیری از نهایی‌سازی سفارش جدید
UPDATE inventory_reservations
SET status = 'EXPIRED', updated_at = NOW()
WHERE id IN (
  SELECT ir.id
  FROM inventory_reservations ir
  JOIN inventory_reservation_lines irl ON irl.reservation_id = ir.id
  JOIN product_variants pv ON pv.id = irl.variant_id
  WHERE pv.product_id = '<PRODUCT_ID>'::uuid AND ir.status = 'ACTIVE'
);
```

---

## ۴. بازنگری بالینی و اصلاح محتوا (Resolution & Compliance)

1. تیم علمی/پزشکی (Medical Advisory Board) ادعاهای مجاز را بر اساس برگه مشخصات رسمی (SmPC / Material Safety Data Sheet) تدوین می‌کند.
2. متن‌های ادعای بالینی («دارای تاییدیه‌های درماتولوژی»، درصد عصاره‌های فعال نظیر Niacinamide یا Retinol) با برچسب اصالت کالا همسان‌سازی می‌شوند.
3. هشدارهای منع مصرف (مانند بارداری، پوست آسیب‌دیده، تماس با چشم، نیاز به تست پَچ) در تب اختصاصی مشخصات محصول افزوده می‌شود.
4. تاییدیه کتبی ناظر فنی داروخانه / مدیر تضمین کیفیت برای انتشار مجدد اخذ می‌شود.

---

## ۵. بازیابی و انتشار مجدد (Recovery & Verification)

1. پس از رفع ایراد، وضعیت کالا از `SUSPENDED` به `PUBLISHED` تغییر می‌یابد:

```sql
UPDATE products
SET status = 'PUBLISHED',
    is_published = true,
    clinical_claims = '<AUDITED_CLAIMS_JSON>',
    updated_at = NOW()
WHERE id = '<PRODUCT_ID>'::uuid;
```

2. راستی‌آزمایی نمایش عمومی:
   - درخواست `GET https://shop.domain.com/products/<PRODUCT_SLUG>` متن اصلاح‌شده را بدون ادعای مغایر نمایش دهد.
   - وضعیت `GET /v1/catalog/products/<PRODUCT_ID>` بررسی شود.
   - هیچ خطای 500 در لاگ `api` ثبت نشود.

---

## ۶. اقدامات پیشگیرانه (Post-Incident Review)

1. افزودن فیلتر کلیدواژه‌های ممنوعه رگولاتوری (مانند «معجزه»، «درمان قطعی سرطان پوست»، «تضمینی») در اعتبارسنجی ورودی فرم کاتالوگ ادمین.
2. الزام بارگذاری تصویر پروانه بهداشتی یا درج شناسه IRC معتبر پیش از فعال‌سازی تیک «کالای دارای ادعای بالینی».
3. آرشیو دائمی مستندات اخطار و لایحه دفاعیه در بایگانی حقوقی شرکت به مدت ۵ سال.
