import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatToman, formatPrice, getProduct } from '../../../lib/catalog';
import { ProductDetailAction } from '../../../components/product-detail-action';
import { ProductReviews } from '../../../components/product-reviews';
import { ProductRail } from '../../../components/discovery/product-rail';
import { DigitalBadge } from '../../../components/discovery/digital-badge';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

/* Additive W18 fields on catalog products (kind / vendor) — not yet in the shared Product type. */
type ProductExtras = { kind?: string; vendor?: { slug?: string; titleFa?: string } | null };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const variant = product.variants[0];
  const extras = product as typeof product & ProductExtras;
  const isDigital = extras.kind === 'DIGITAL';
  const vendorTitleFa = typeof extras.vendor?.titleFa === 'string' ? extras.vendor.titleFa : '';
  const vendorSlug = typeof extras.vendor?.slug === 'string' ? extras.vendor.slug : '';

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ?? 'توضیحات تکمیلی برای این محصول به زودی اضافه خواهد شد.',
    sku: variant?.sku,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: variant?.priceAmount,
      availability: variant?.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'خانه', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'محصولات', item: '/products' },
      { '@type': 'ListItem', position: 3, name: product.title },
    ],
  };

  return (
    <div className="product-detail-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav className="breadcrumbs-nav">
        <Link href="/">صفحه اصلی</Link>
        <span>/</span>
        <Link href="/#catalog">محصولات</Link>
        <span>/</span>
        <span>{product.title}</span>
      </nav>

      <section className="detail-layout">
        <div className="detail-art-box">
          <div className="detail-art-visual" aria-hidden="true">
            {product.title.slice(0, 1)}
          </div>
          <div className="art-stock-status">
            {variant?.inStock ? '✓ آماده ارسال از انبار مرکزی' : 'ناموجود'}
          </div>
          {isDigital && <DigitalBadge />}
        </div>

        <div className="detail-copy-box">
          <div className="eyebrow">مشخصات و سفارش کالا</div>
          {vendorTitleFa && (
            <p className="product-vendor-fa">
              فروشنده:{' '}
              {vendorSlug ? (
                <Link href={`/vendors/${encodeURIComponent(vendorSlug)}`}>{vendorTitleFa}</Link>
              ) : (
                vendorTitleFa
              )}
            </p>
          )}
          <h1>{product.title}</h1>
          <p className="product-main-desc">
            {product.description ?? 'توضیحات تکمیلی برای این محصول به زودی اضافه خواهد شد.'}
          </p>

          <div className="product-highlights-grid">
            <div className="highlight-item">
              <span>🛡️ ضمانت اصالت</span>
              <small>۱۰۰٪ کالای اصل با تضمین کیفیت</small>
            </div>
            <div className="highlight-item">
              <span>🚀 ارسال سریع</span>
              <small>پست پیشتاز و تیپاکس سراسری</small>
            </div>
            <div className="highlight-item">
              <span>💳 پرداخت امن</span>
              <small>شاپرک، کارت‌به‌کارت و کیف پول</small>
            </div>
          </div>

          {variant ? (
            <div className="variant-action-card">
              <div className="variant-header-info">
                <div>
                  <strong>{variant.title}</strong>
                  <div className="sku-code">کد کالا (SKU): {variant.sku}</div>
                </div>
                <div className="price-tag-big">
                  <span className="toman-price">{formatToman(variant.priceAmount)}</span>
                  <small className="rial-price">({formatPrice(variant.priceAmount)})</small>
                </div>
              </div>

              <ProductDetailAction
                variantId={variant.id}
                productId={product.id}
                title={product.title}
                sku={variant.sku}
                priceAmount={variant.priceAmount}
                inStock={variant.inStock}
              />
            </div>
          ) : (
            <div className="state-panel">واریانت فعالی برای این کالا تعریف نشده است.</div>
          )}
        </div>
      </section>

      <ProductReviews slug={product.slug} productTitle={product.title} />

      <ProductRail
        endpoint={`/recommendations/products/${product.id}?limit=6`}
        titleFa="محصولات مرتبط"
      />
    </div>
  );
}
