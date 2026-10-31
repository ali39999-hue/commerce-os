import Link from 'next/link';
import { formatToman, listProducts } from '../lib/catalog';
import { ProductCardAction } from '../components/product-card-action';
import { ProductRail } from '../components/discovery/product-rail';
import '../components/discovery/digital-badge.css';

export const dynamic = 'force-dynamic';

/* Additive W18 field on catalog products (vendor) — not yet in the shared Product type. */
type ProductVendorExtra = { vendor?: { slug?: string; titleFa?: string } | null };

export default async function HomePage() {
  const catalog = await listProducts();
  const products = catalog?.data ?? [];

  return (
    <>
      <section className="hero">
        <div className="eyebrow">ویترین نمونه · متصل به هسته کاتالوگ و قیمت‌گذاری</div>
        <h1>چیزهای خوب،<br />برای زندگی روزمره و باکیفیت.</h1>
        <p>
          این ویترین به API متصل است؛ تمام محاسبات مالی بر اساس ریال با دقت کامل، رزرو انبار با قفل ردیفی
          و پشتیبانی از شتاب و کارت‌به‌کارت انجام می‌پذیرد.
        </p>
        <a className="primary-link" href="#catalog">
          مشاهده کاتالوگ محصولات <span aria-hidden="true">←</span>
        </a>
        <div className="hero-mark" aria-hidden="true">ب</div>
      </section>

      <section id="catalog" className="catalog-section">
        <div className="section-head">
          <div>
            <div className="eyebrow">منتخب فروشگاه</div>
            <h2>محصولات باکیفیت</h2>
          </div>
          {catalog && <span className="count-label">{catalog.meta.count} کالا</span>}
        </div>

        {!catalog ? (
          <div className="state-panel" role="status">
            <h3>کاتالوگ در حال اتصال است</h3>
            <p>سرویس API در پس‌زمینه در حال همگام‌سازی است؛ داده‌های ساختگی جایگزین سیستم واقعی نمی‌شوند.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="state-panel" role="status">
            <h3>هنوز کالایی در این فروشگاه ثبت نشده است</h3>
            <p>پس از افزودن کالاها در پنل مدیریت، اقلام اینجا نمایش داده می‌شوند.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const variant = product.variants[0];
              const extras = product as typeof product & ProductVendorExtra;
              const vendorTitleFa = typeof extras.vendor?.titleFa === 'string' ? extras.vendor.titleFa : '';
              const vendorSlug = typeof extras.vendor?.slug === 'string' ? extras.vendor.slug : '';
              return (
                <article className="product-card" key={product.id}>
                  <Link
                    className="product-art"
                    href={`/products/${encodeURIComponent(product.slug)}`}
                    aria-label={`مشاهده ${product.title}`}
                  >
                    <span className="art-index">{product.title.slice(0, 1)}</span>
                    <span className="art-caption">{variant?.inStock ? 'موجود در انبار' : 'اتمام موجودی'}</span>
                  </Link>
                  <div className="product-copy">
                    <h3>
                      <Link href={`/products/${encodeURIComponent(product.slug)}`}>{product.title}</Link>
                    </h3>
                    {vendorTitleFa && (
                      <span className="product-vendor-fa">
                        فروشنده:{' '}
                        {vendorSlug ? (
                          <Link href={`/vendors/${encodeURIComponent(vendorSlug)}`}>{vendorTitleFa}</Link>
                        ) : (
                          vendorTitleFa
                        )}
                      </span>
                    )}
                    <p>{product.description ?? 'توضیحات و مشخصات تکمیلی کالا در صفحه محصول.'}</p>
                    <div className="product-bottom">
                      <strong>{variant ? formatToman(variant.priceAmount) : 'تماس بگیرید'}</strong>
                      {variant && variant.inStock ? (
                        <ProductCardAction
                          variantId={variant.id}
                          productId={product.id}
                          title={product.title}
                          sku={variant.sku}
                          priceAmount={variant.priceAmount}
                        />
                      ) : (
                        <span className="muted-tag">ناموجود</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <ProductRail endpoint="/recommendations/popular?limit=6" titleFa="پرفروش‌ترین‌های بازارک" />
      </section>
    </>
  );
}
