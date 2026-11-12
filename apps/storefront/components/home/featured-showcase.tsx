import Link from 'next/link';
import {
  formatToman,
  resolveProductImage,
  resolveVariant,
  type Product,
} from '../../lib/catalog';
import { ProductCardAction } from '../product-card-action';
import './featured-showcase.css';

interface FeaturedShowcaseProps {
  products: Product[];
  totalCount?: number;
}

const SLUG_THEMES: Record<string, { theme: string; pillTheme: 'light' | 'dark' }> = {
  carboxygel: { theme: 'theme-teal', pillTheme: 'light' },
  carboxypod: { theme: 'theme-amber', pillTheme: 'dark' },
  carboxypad: { theme: 'theme-mint', pillTheme: 'light' },
  crystalene: { theme: 'theme-peach', pillTheme: 'light' },
  healene: { theme: 'theme-periwinkle', pillTheme: 'light' },
  silicalene: { theme: 'theme-slate', pillTheme: 'dark' },
  carbox: { theme: 'theme-cyan', pillTheme: 'dark' },
  plasmax: { theme: 'theme-violet', pillTheme: 'dark' },
};

const THEME_CYCLE: Array<{ theme: string; pillTheme: 'light' | 'dark' }> = [
  { theme: 'theme-teal', pillTheme: 'light' },
  { theme: 'theme-amber', pillTheme: 'dark' },
  { theme: 'theme-mint', pillTheme: 'light' },
  { theme: 'theme-peach', pillTheme: 'light' },
  { theme: 'theme-periwinkle', pillTheme: 'light' },
  { theme: 'theme-slate', pillTheme: 'dark' },
  { theme: 'theme-cyan', pillTheme: 'dark' },
  { theme: 'theme-violet', pillTheme: 'dark' },
];

export function FeaturedProductShowcase({ products, totalCount }: FeaturedShowcaseProps) {
  const flagged = (products ?? []).filter((p) => p.isFeatured);
  const displayItems = (flagged.length > 0 ? flagged : products ?? []).slice(0, 8);

  return (
    <section id="featured-products" className="clinical-featured-section" aria-labelledby="featured-title">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">فرمولاسیون‌های دارای گرید پزشکی</div>
          <h2 id="featured-title" className="section-title">
            محصولات شاخص و اصیل دکتر درمر انگلستان
          </h2>
        </div>
        <div className="section-count-badge">
          {`${totalCount && totalCount > displayItems.length ? displayItems.length : displayItems.length} فرمولاسیون شاخص بالینی`}
        </div>
      </div>

      {displayItems.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          در حال بارگذاری کاتالوگ محصولات از سرور...
        </div>
      ) : (
        <div className="clinical-product-grid">
          {displayItems.map((product, index) => {
            const variant = resolveVariant(product);
            const imageSrc = resolveProductImage(product);
            const titleFa = product.titleFa || product.title;
            const subtitle =
              (typeof product.clinicalData?.cardSubtitle === 'string' && product.clinicalData.cardSubtitle) ||
              product.subtitleFa ||
              product.description ||
              product.category?.titleFa ||
              '';
            const s = product.slug.toLowerCase();
            const isReeMed =
              product.brand?.slug === 'reemed' ||
              product.category?.slug === 'reemed' ||
              s === 'carbox' ||
              s === 'plasmax';
            const styleMeta = SLUG_THEMES[s] ?? THEME_CYCLE[index % THEME_CYCLE.length];

            return (
              <article className={`clinical-card modern-pill-card ${styleMeta.theme}`} key={product.id}>
                <div className="card-top-bar">
                  <span className="card-family-capsule">
                    {product.brand?.name || (isReeMed ? 'ReeMed Pro' : 'ReeSkin Clinical')}
                  </span>
                  {variant?.inStock ? (
                    <span className="card-stock-dot">
                      <span className="dot-pulse" />
                      موجود
                    </span>
                  ) : (
                    <span className="card-stock-dot">عدم موجودی</span>
                  )}
                </div>

                <Link
                  href={`/products/${encodeURIComponent(product.slug)}`}
                  className="card-media-stage"
                  aria-label={`مشاهده مشخصات ${titleFa}`}
                >
                  <img
                    src={imageSrc}
                    alt={product.media?.[0]?.altText || titleFa}
                    className="card-product-image"
                    loading="lazy"
                  />
                </Link>

                <div className="card-details-area">
                  <div className="card-price-row">
                    <strong className="card-main-price">
                      {variant ? formatToman(variant.priceAmount) : 'استعلام قیمت'}
                    </strong>
                  </div>

                  <h3 className="card-headline">
                    <Link href={`/products/${encodeURIComponent(product.slug)}`} title={titleFa}>
                      {titleFa}
                    </Link>
                  </h3>

                  <p className="card-sub-indication" title={subtitle}>
                    {subtitle}
                  </p>

                  <div className="card-action-wrap">
                    {variant && variant.inStock ? (
                      <ProductCardAction
                        variantId={variant.id}
                        productId={product.id}
                        title={titleFa}
                        sku={variant.sku}
                        priceAmount={variant.priceAmount}
                        pillTheme={styleMeta.pillTheme}
                        label="خرید سریع"
                        image={imageSrc}
                      />
                    ) : (
                      <span className="card-out-of-stock-pill">عدم موجودی</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
