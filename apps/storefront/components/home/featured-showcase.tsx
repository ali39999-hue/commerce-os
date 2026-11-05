'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatToman, type Product } from '../../lib/catalog';
import { ProductCardAction } from '../product-card-action';

interface FeaturedShowcaseProps {
  products: Product[];
  totalCount?: number;
}

// 8 Authentic Dr Dermer products with exact mirrored specs, pricing, and photography
const CURATED_CLINICAL_PRODUCTS = [
  {
    id: 'prod_drdermer_001',
    slug: 'carboxygel',
    title: 'ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel',
    englishTitle: 'CarboxyGel™ Professional Transdermal Regimen',
    description: 'ژل ۲ فاز ماتریکسی با القای فیزیولوژیک اثر بوهر (Bohr Effect) جهت رهایش اکسیژن بافتی، تسریع بازسازی کلاژن و رفع خطوط پوستی بدون سوزن.',
    inciActives: ['8.5% Sodium Bicarbonate', '5% Centella Asiatica', '2% Multi-HA'],
    category: 'carboxy',
    brandFamily: 'ReeSkin™',
    coldChain: true,
    variants: [
      {
        id: 'var_cbg_pro_500',
        sku: 'DD-CBG-500ML',
        title: 'مخزن ۵۰۰ میلی‌لیتر کلینیکال (کابین)',
        priceAmount: '48500000', // 4,850,000 Tomans
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
  {
    id: 'prod_drdermer_002',
    slug: 'carboxypod',
    title: 'پادهای فعال‌ساز ترابافتی CarboxyPod',
    englishTitle: 'CarboxyPod™ Bio-Activation Capsules',
    description: 'کپسول‌های فعال‌ساز گاز CO₂ و لایه‌برداری همزمان ترابافتی در سه مدل درمانی کربن فعال (Carbon)، ویتامین C پایدار و آبرسان (Hydra).',
    inciActives: ['Citric Acid Micro-Spheres', 'Activated Bamboo Charcoal', 'Magnesium Ascorbyl'],
    category: 'carboxy',
    brandFamily: 'ReeSkin™',
    coldChain: false,
    variants: [
      {
        id: 'var_pod_carbon_10',
        sku: 'DD-POD-CRB-10X',
        title: 'پک ۱۰ عددی کربن فعال',
        priceAmount: '18000000', // 1,800,000 Tomans
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
  {
    id: 'prod_drdermer_003',
    slug: 'carboxypad',
    title: 'پدهای آلکالاین صورت و گردن CarboxyPad',
    englishTitle: 'CarboxyPad™ Alkaline Activation Sheets',
    description: 'شیت‌های فیبری میکروپرمنبران پیش‌برش‌خورده با برش آناتومیک صورت و گردن جهت ایجاد حداکثر واکنش تبادل گازی بر سطح ژل کربوکسی.',
    inciActives: ['Micro-perforated Fiber', 'Alkaline Dry Activator', 'Cellulose Matrix'],
    category: 'carboxy',
    brandFamily: 'ReeSkin™',
    coldChain: false,
    variants: [
      {
        id: 'var_pad_20x',
        sku: 'DD-PAD-20X',
        title: 'بسته ۲۰ عددی صورت و گردن',
        priceAmount: '14000000', // 1,400,000 Tomans
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
  {
    id: 'prod_drdermer_004',
    slug: 'crystalene',
    title: 'خمیر پولیش و لایه‌بردار Crystalene',
    englishTitle: 'Crystalene™ Alumina Microderm Polish',
    description: 'میکرودرم ابریشمی ملایم با میکروکریستال‌های خالص آلومینای گرید پزشکی، نیاسینامید، اسید لاکتیک و روغن آرگان جهت نوسازی اپیدرم.',
    inciActives: ['Medical Grade Alumina', '4% Niacinamide', 'Lactic Acid AHA', 'Pure Argan'],
    category: 'homecare',
    brandFamily: 'ReeSkin™',
    coldChain: false,
    variants: [
      {
        id: 'var_cry_200ml',
        sku: 'DD-CRY-200ML',
        title: 'تیوب ۲۰۰ میلی‌لیتر',
        priceAmount: '17500000', // 1,750,000 Tomans
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
  {
    id: 'prod_drdermer_005',
    slug: 'healene',
    title: 'ژل تسکین‌بخش و التیام‌دهنده Healene',
    englishTitle: 'Healene™ Post-Procedure Soothing Gel',
    description: 'ژل سبک آبرسان و ترمیم‌کننده با نیاسینامید، پانتنول B5، هیالورونیک اسید، آلانتوئین و عصاره‌های گیاهی میموزا جهت رفع فوری التهاب.',
    inciActives: ['5% D-Panthenol B5', 'Madecassoside', 'Mimosa Tenuiflora', 'Centella Extract'],
    category: 'homecare',
    brandFamily: 'ReeSkin™',
    coldChain: true,
    variants: [
      {
        id: 'var_hea_250ml',
        sku: 'DD-HEA-250ML',
        title: 'بطری پمپی ۲۵۰ میلی‌لیتر',
        priceAmount: '16000000', // 1,600,000 Tomans
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
  {
    id: 'prod_drdermer_006',
    slug: 'silicalene',
    title: 'اسکراب دتوکس منافذ Silicalene',
    englishTitle: 'Silicalene™ Mild Silica Detox Scrub',
    description: 'پاکسازی عمقی منافذ، کنترل چربی اضافه و رفع جوش‌های سرسیاه با میکروسفرهای کاملاً کروی سیلیکا، زغال فعال بامبو و سالیسیلیک اسید.',
    inciActives: ['Spherical Hydrated Silica', '2% Salicylic Acid BHA', 'Activated Carbon'],
    category: 'homecare',
    brandFamily: 'ReeSkin™',
    coldChain: false,
    variants: [
      {
        id: 'var_sil_200ml',
        sku: 'DD-SIL-200ML',
        title: 'تیوب ۲۰۰ میلی‌لیتر',
        priceAmount: '15500000', // 1,550,000 Tomans
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
];

function getProductPhoto(slug: string): { src: string; alt: string; standardTag: string } {
  const s = slug.toLowerCase();
  if (s.includes('carboxypad')) {
    return {
      src: '/assets/drdermer/2025/07/carboxygel-activator-mask-and-pads-1-600x600.png',
      alt: 'پدهای فعال‌ساز آلکالاین صورت و گردن CarboxyPad دکتر درمر',
      standardTag: 'فرمول استاندارد UK',
    };
  }
  if (s.includes('carboxypod')) {
    return {
      src: '/assets/drdermer/2025/07/carbon-carboxypod-app-1-551x600.png',
      alt: 'پادهای فعال‌ساز کربوکسی‌پاد CarboxyPod دکتر درمر',
      standardTag: 'فرمول استاندارد UK',
    };
  }
  if (s.includes('crystalene')) {
    return {
      src: '/assets/drdermer/2025/08/crystalene-scrub.webp',
      alt: 'خمیر پولیش و لایه‌بردار کریستالین Crystalene دکتر درمر',
      standardTag: 'فرمول استاندارد UK',
    };
  }
  if (s.includes('healene')) {
    return {
      src: '/assets/drdermer/2025/08/healene-gel.webp',
      alt: 'ژل تسکین‌بخش و التیام‌دهنده هیلین Healene دکتر درمر',
      standardTag: 'فرمول استاندارد UK',
    };
  }
  if (s.includes('silicalene')) {
    return {
      src: '/assets/drdermer/2025/08/silicalene-scrub.webp',
      alt: 'اسکراب دتوکس منافذ سیلیکالین Silicalene دکتر درمر',
      standardTag: 'فرمول استاندارد UK',
    };
  }
  return {
    src: '/assets/drdermer/2025/07/azelaic-acid-carboxygel-600x600.png',
    alt: 'ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel دکتر درمر',
    standardTag: 'فرمول دارویی ترنس‌درمال',
  };
}

export function FeaturedProductShowcase({ products, totalCount }: FeaturedShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'carboxy' | 'homecare'>('all');

  // Enrich curated catalog with live backend variant data
  const enrichedItems = CURATED_CLINICAL_PRODUCTS.map((curated) => {
    const liveMatch = products?.find(
      (p) =>
        p.slug === curated.slug ||
        (curated.slug === 'carboxygel' && p.slug === 'carboxygel-professional-therapy') ||
        (curated.slug === 'carboxypod' && p.slug === 'carboxypod-activation-pads'),
    );
    if (!liveMatch) return curated;
    return {
      ...curated,
      id: liveMatch.id || curated.id,
      variants: liveMatch.variants && liveMatch.variants.length > 0 ? liveMatch.variants : curated.variants,
    };
  });

  const filteredItems = enrichedItems.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  return (
    <section id="featured-products" className="bento-catalog-section" aria-labelledby="featured-title">
      <div className="bento-catalog-container">
        {/* Section Header with Category Tabs */}
        <div className="bento-catalog-header">
          <div className="bch-titles">
            <div className="bch-eyebrow">
              <span className="bch-eyebrow-dot" />
              <span>PHARMACEUTICAL FORMULATIONS & CLINICAL PROTOCOLS</span>
            </div>
            <h2 id="featured-title" className="bch-headline">
              کاتالوگ رسمی فرمولاسیون‌های بالینی و مراقبت پوست دکتر درمر
            </h2>
            <p className="bch-subtext">
              فرمولاسیون‌های درموسوتیکال ترابافتی ReeSkin و کیت‌های فعال‌ساز اثر بوهر CarboxyPod دارای استانداردهای رسمی فارماکوپه انگلستان و ISO 22716
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="catalog-tabs-bar" role="tablist" aria-label="فیلتر دسته‌بندی کاتالوگ">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'all'}
              className={`cat-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              همه فرمولاسیون‌ها ({enrichedItems.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'carboxy'}
              className={`cat-tab-btn ${activeTab === 'carboxy' ? 'active' : ''}`}
              onClick={() => setActiveTab('carboxy')}
            >
              کربوکسی‌تراپی & اثر بوهر
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'homecare'}
              className={`cat-tab-btn ${activeTab === 'homecare' ? 'active' : ''}`}
              onClick={() => setActiveTab('homecare')}
            >
              مراقبت روزمره و سد دفاعی
            </button>
          </div>
        </div>

        {/* 4-Column Bento Product Grid */}
        <div className="bento-product-grid">
          {filteredItems.map((product) => {
            const variant = product.variants[0];
            const isReeMed = product.brandFamily.includes('ReeMed');
            const photo = getProductPhoto(product.slug);

            return (
              <article className={`bento-product-card ${isReeMed ? 'theme-reemed' : 'theme-reeskin'}`} key={product.id}>
                {/* Visual Top Bar */}
                <div className="bpc-top-bar">
                  <span className={`bpc-family-pill ${isReeMed ? 'reemed' : 'reeskin'}`}>
                    {product.brandFamily}
                  </span>
                  {product.coldChain && (
                    <span className="bpc-coldchain-pill" title="نیازمند زنجیره سرمایی ۲ تا ۸ درجه سانتی‌گراد">
                      ❄️ ۲°-۸°C Cold Chain
                    </span>
                  )}
                  {!product.coldChain && (
                    <span className="bpc-stock-status">
                      {variant?.inStock ? 'موجود در زنجیره رسمی' : 'در انتظار ترخیص'}
                    </span>
                  )}
                </div>

                {/* Product Photo Showcase */}
                <Link
                  href={`/products/${encodeURIComponent(product.slug)}`}
                  className="bpc-image-stage"
                  aria-label={`مشاهده پرونده تخصصی ${product.title} - ${photo.standardTag}`}
                >
                  <div className="bpc-glow-halo" aria-hidden="true" />
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="bpc-real-img"
                    loading="lazy"
                  />
                  <span className="bpc-formula-chip" aria-hidden="true">{photo.standardTag}</span>
                </Link>

                {/* Product Body Information */}
                <div className="bpc-body">
                  <div className="bpc-sku-row">
                    <span className="bpc-sku-code">SKU: {variant?.sku ?? 'DD-FORMULA'}</span>
                  </div>

                  <h3 className="bpc-title">
                    <Link href={`/products/${encodeURIComponent(product.slug)}`}>
                      {product.title}
                    </Link>
                  </h3>
                  {product.englishTitle && (
                    <span className="bpc-english-title" dir="ltr">
                      {product.englishTitle}
                    </span>
                  )}

                  <p className="bpc-description">
                    {product.description}
                  </p>

                  {/* Active Ingredients Tags */}
                  <div className="bpc-actives-deck" aria-label="ترکیبات مؤثره دارویی">
                    {product.inciActives.map((act, idx) => (
                      <span className="bpc-active-chip" key={idx}>
                        {act}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Pricing & Action */}
                  <div className="bpc-pricing-action-footer">
                    <div className="bpc-price-stack">
                      <span className="bpc-price-label">قیمت رسمی مصرف‌کننده:</span>
                      <strong className="bpc-price-val tabular-nums">
                        {variant ? formatToman(variant.priceAmount) : 'استعلام قیمت'}
                      </strong>
                    </div>

                    <div className="bpc-action-slot">
                      {variant && variant.inStock ? (
                        <ProductCardAction
                          variantId={variant.id}
                          productId={product.id}
                          title={product.title}
                          sku={variant.sku}
                          priceAmount={variant.priceAmount}
                        />
                      ) : (
                        <span className="bpc-out-stock-pill">ناموجود</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
