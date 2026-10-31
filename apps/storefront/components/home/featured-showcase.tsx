import Link from 'next/link';
import { formatToman, type Product } from '../../lib/catalog';
import { ProductCardAction } from '../product-card-action';

interface FeaturedShowcaseProps {
  products: Product[];
  totalCount?: number;
}

// Fallback curated products with clinical imagery/specifications if database is empty
const CURATED_CLINICAL_PRODUCTS: Product[] = [
  {
    id: 'prod_carboxy_gel_home',
    slug: 'carboxygel-co2-therapy-home-kit',
    title: 'کیت کربوکسی‌تراپی خانگی CarboxyGel با اثر بوهر (ReeSkin)',
    description: 'شامل ۵ سرنگ ژل غلیظ فعال‌ساز دی‌اکسید کربن و ۵ پد صورت و گردن؛ شفاف‌کننده و اکسیژن‌رسان عمقی پوست.',
    variants: [
      {
        id: 'var_carboxy_home_1',
        sku: 'RS-CBX-5X',
        title: 'پک ۵ عددی استاندارد',
        priceAmount: '۲۴۵۰۰۰۰۰', // 2,450,000 Tomans in Rials
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
  {
    id: 'prod_carboxypod_pro_pack',
    slug: 'carboxypod-transdermal-infusion-pod',
    title: 'پاد ترابافتی CarboxyPod Pro بسته ۱۰ عددی (ReeMed)',
    description: 'کپسول‌های فعال کلسیم کربنات و سیتریک اسید فشرده ویژه استفاده با هندپیس اولتراسونیک کلینیکال.',
    variants: [
      {
        id: 'var_carboxypod_pro_1',
        sku: 'RM-POD-10X',
        title: 'بسته ۱۰ کپسولی کلینیک',
        priceAmount: '۴۸۰۰۰۰۰۰', // 4,800,000 Tomans in Rials
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
  {
    id: 'prod_peptide_barrier_serum',
    slug: 'reeskin-ceramide-peptide-recovery-serum',
    title: 'سرم بازسازی سد دفاعی پوست با پپتید مس و سرامید NP',
    description: 'فرمول التیام‌بخش لایه چربی محافظ، کاهش التهاب اریتما و آبرسانی عمقی پس از درمان‌های کلینیکی.',
    variants: [
      {
        id: 'var_peptide_serum_1',
        sku: 'RS-SRM-50ML',
        title: 'حجم ۵۰ میلی‌لیتر',
        priceAmount: '۱۸۵۰۰۰۰۰', // 1,850,000 Tomans in Rials
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
  {
    id: 'prod_retinol_encapsulated_05',
    slug: 'reeskin-cellular-retinol-encapsulated-05',
    title: 'امولسیون رتینول ۰.۵٪ میکروانکپسوله با هیالورونیک اسید',
    description: 'لایه‌برداری یکنواخت و تحریک فیبروبلاست‌ها بدون قرمزی و سوزش؛ مناسب خطوط پنجه‌کلاغی و یکدستی بافت.',
    variants: [
      {
        id: 'var_retinol_05_1',
        sku: 'RS-RTN-30ML',
        title: 'بطری شیشه‌ای ۳۰ میلی‌لیتر',
        priceAmount: '۱۹۰۰۰۰۰۰', // 1,900,000 Tomans in Rials
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
  {
    id: 'prod_reemed_clinic_gel_500ml',
    slug: 'reemed-co2-prime-gel-large-500ml',
    title: 'ژل پایه اکتیواتور کربوکسی ۵۰۰ میلی‌لیتری کلینیک (ReeMed)',
    description: 'بسته‌بندی حجیم ویژه مراکز درمانی و زیبایی با خلوص بالای ترکیبات دارویی و پمپ بدون هوا (Airless).',
    variants: [
      {
        id: 'var_prime_gel_500_1',
        sku: 'RM-GEL-500',
        title: 'مخزن ۵۰۰ میل سالنی',
        priceAmount: '۶۹۰۰۰۰۰۰', // 6,900,000 Tomans in Rials
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
  {
    id: 'prod_egf_cellular_mask_pack',
    slug: 'reeskin-biomimetic-egf-sheet-mask',
    title: 'ماسک بایوسلولز فاکتور رشد EGF و پپتید الاستین (پک ۶ عددی)',
    description: 'ماسک ورقه‌ای تخمیرشده از آب نارگیل خالص جهت لیفتینگ سریع و آرامش‌بخشی پس از میکرودرم و پیلینگ.',
    variants: [
      {
        id: 'var_egf_mask_1',
        sku: 'RS-MSK-6X',
        title: 'بسته ۶ شیت ماسک استریل',
        priceAmount: '۱۶۰۰۰۰۰۰', // 1,600,000 Tomans in Rials
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
];

export function FeaturedProductShowcase({ products, totalCount }: FeaturedShowcaseProps) {
  const displayItems = products && products.length > 0 ? products : CURATED_CLINICAL_PRODUCTS;

  return (
    <section id="featured-products" className="clinical-featured-section" aria-labelledby="featured-title">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">فرمولاسیون‌های دارای گرید درمانی</div>
          <h2 id="featured-title" className="section-title">
            محصولات شاخص و کیت‌های فعال بالینی
          </h2>
        </div>
        <div className="section-count-badge">
          {totalCount ? `${totalCount} فرمولاسیون فعال` : 'انتخاب برتر درماتولوژیست‌ها'}
        </div>
      </div>

      <div className="clinical-product-grid">
        {displayItems.map((product) => {
          const variant = product.variants[0];
          const isReeMed = product.title.includes('ReeMed') || product.slug.includes('reemed') || product.slug.includes('pod');

          return (
            <article className="clinical-card" key={product.id}>
              <div className="card-top-badges">
                <span className={`brand-family-pill ${isReeMed ? 'medical' : 'clinical'}`}>
                  {isReeMed ? 'ReeMed Pro' : 'ReeSkin'}
                </span>
                <span className="stock-pill">
                  {variant?.inStock ? 'موجود در زنجیره رسمی' : 'در انتظار ترخیص'}
                </span>
              </div>

              <Link
                href={`/products/${encodeURIComponent(product.slug)}`}
                className="card-media-box"
                aria-label={`مشاهده مشخصات ${product.title}`}
              >
                <div className="media-artistic-visual">
                  {/* Clean, high-performance SVG iconogram reflecting high-end clinical formula */}
                  <div className="bottle-art" aria-hidden="true">
                    <svg viewBox="0 0 100 120" className="bottle-svg">
                      <rect x="35" y="10" width="30" height="15" rx="3" fill="#0F766E" />
                      <rect x="42" y="5" width="16" height="5" rx="2" fill="#14B8A6" />
                      <path
                        d="M25 30 Q25 25 35 25 L65 25 Q75 25 75 30 L80 100 Q80 110 70 110 L30 110 Q20 110 20 100 Z"
                        fill="rgba(15, 118, 110, 0.08)"
                        stroke="#0F766E"
                        strokeWidth="2"
                      />
                      <rect x="30" y="45" width="40" height="50" rx="4" fill="#FFFFFF" opacity="0.9" />
                      <line x1="36" y1="55" x2="64" y2="55" stroke="#0F766E" strokeWidth="2" />
                      <line x1="36" y1="62" x2="58" y2="62" stroke="#94A3B8" strokeWidth="1.5" />
                      <line x1="36" y1="69" x2="52" y2="69" stroke="#94A3B8" strokeWidth="1.5" />
                      <circle cx="50" cy="84" r="5" fill="#F59E0B" />
                    </svg>
                  </div>
                </div>
                <span className="visual-formula-tag">فرمول استاندارد UK</span>
              </Link>

              <div className="card-content">
                <div className="card-sku-code">SKU: {variant?.sku ?? 'DD-FORMULA'}</div>
                <h3 className="card-title">
                  <Link href={`/products/${encodeURIComponent(product.slug)}`}>
                    {product.title}
                  </Link>
                </h3>
                <p className="card-desc">
                  {product.description ?? 'توضیحات و مشخصات تکمیلی مواد مؤثره در صفحه محصول.'}
                </p>

                <div className="card-pricing-footer">
                  <div className="price-stack">
                    <span className="price-label">قیمت مصرف‌کننده:</span>
                    <strong className="price-amount">
                      {variant ? formatToman(variant.priceAmount) : 'استعلام قیمت'}
                    </strong>
                  </div>

                  {variant && variant.inStock ? (
                    <ProductCardAction
                      variantId={variant.id}
                      productId={product.id}
                      title={product.title}
                      sku={variant.sku}
                      priceAmount={variant.priceAmount}
                    />
                  ) : (
                    <span className="out-of-stock-tag">عدم موجودی</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
