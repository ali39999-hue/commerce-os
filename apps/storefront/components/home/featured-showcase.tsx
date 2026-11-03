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
    title: 'ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel Professional (ReeSkin)',
    description: 'ژل ۲ فاز ماتریکسی با تحریک فیزیولوژیک اثر بوهر (Bohr Effect) جهت اکسیژن‌رسانی عمیق سلولی، بهبود اسکار و سنتز کلاژن بدون سوزن.',
    inciActives: ['8.5% Sodium Bicarbonate', '5% Centella Asiatica', '2% Multi-HA'],
    category: 'carboxy',
    brandFamily: 'ReeSkin',
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
    title: 'پادهای فعال‌ساز کربوکسی‌پاد CarboxyPod (ReeSkin)',
    description: 'کپسول‌های فعال‌ساز گاز CO₂ و لایه‌برداری همزمان ترابافتی در سه مدل درمانی کربن فعال (Carbon)، روشن‌کننده (Vita) و آبرسان (Hydra).',
    inciActives: ['Citric Acid Micro-Spheres', 'Activated Bamboo Charcoal', 'Magnesium Ascorbyl'],
    category: 'carboxy',
    brandFamily: 'ReeSkin',
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
    title: 'پدهای فعال‌ساز آلکالاین صورت و گردن CarboxyPad (ReeSkin)',
    description: 'شیت‌های فیبری میکروپرمنبران پیش‌برش‌خورده با برش آناتومیک صورت و گردن جهت ایجاد حداکثر واکنش تبادل گازی بر سطح ژل.',
    inciActives: ['Micro-perforated Fiber', 'Alkaline Dry Activator', 'Cellulose Matrix'],
    category: 'carboxy',
    brandFamily: 'ReeSkin',
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
    title: 'خمیر پولیش و لایه‌بردار کریستالین Crystalene Polish Paste (ReeSkin)',
    description: 'میکرودرم ابریشمی ملایم با میکروکریستال‌های خالص آلومینای گرید پزشکی، نیاسینامید، اسید لاکتیک و روغن آرگان.',
    inciActives: ['Medical Grade Alumina', '4% Niacinamide', 'Lactic Acid AHA', 'Pure Argan'],
    category: 'homecare',
    brandFamily: 'ReeSkin',
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
    title: 'ژل تسکین‌بخش و التیام‌دهنده هیلین Healene Soothing Gel (ReeSkin)',
    description: 'ژل سبک آبرسان و ترمیم‌کننده با نیاسینامید، پانتنول B5، هیالورونیک اسید، آلانتوئین و عصاره‌های گیاهی میموزا و سنتلا آسیاتیکا.',
    inciActives: ['5% D-Panthenol B5', 'Madecassoside', 'Mimosa Tenuiflora', 'Centella Extract'],
    category: 'homecare',
    brandFamily: 'ReeSkin',
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
    title: 'اسکراب دتوکس سیلیکالین Silicalene Mild Silica Scrub (ReeSkin)',
    description: 'پاکسازی عمقی منافذ، کنترل چربی اضافه و رفع جوش‌های سرسیاه با میکروسفرهای کاملاً کروی سیلیکا، زغال فعال و BHA.',
    inciActives: ['Spherical Hydrated Silica', '2% Salicylic Acid BHA', 'Activated Carbon'],
    category: 'homecare',
    brandFamily: 'ReeSkin',
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
  {
    id: 'prod_drdermer_007',
    slug: 'carbox',
    title: 'دستگاه پزشکی کربوکسی‌تراپی و تزریق گاز CarboX (ReeMed)',
    description: 'ایستگاه کاری دوگانه تزریق زیرجلدی فوق‌دقیق گاز CO₂ پزشکی به همراه هندپیس ارگونومیک فعال‌سازی CarboxyPod ویژه مطب‌ها و کلینیک‌ها.',
    inciActives: ['Digital Gas Flow: 1cc/min', 'Heating Modality: 42°C', 'MDR Class IIb Certified'],
    category: 'hardware',
    brandFamily: 'ReeMed Pro',
    coldChain: false,
    variants: [
      {
        id: 'var_cbx_station',
        sku: 'RM-DEV-CARBOX-PRO',
        title: 'کنسول پرتابل مدیکال با گارانتی رسمی',
        priceAmount: '450000000', // 45,000,000 Tomans
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
  {
    id: 'prod_drdermer_008',
    slug: 'plasmax',
    title: 'دستگاه پیشرفته انرژی پلاسما و جت سرد PlasmaX (ReeMed)',
    description: 'سیستم ۴ کاره انرژی پلاسما با تکنولوژی تخلیه پیوسته، پلاسمای سرد آرگون و هلیوم و DBD پلاسما جهت بلفاروپلاستی غیرتهاجمی و درمان اسکار.',
    inciActives: ['Cold Atmospheric Plasma (CAP)', 'DBD Direct Jet Mode', 'Argon Micro-Arc Generator'],
    category: 'hardware',
    brandFamily: 'ReeMed Pro',
    coldChain: false,
    variants: [
      {
        id: 'var_plx_station',
        sku: 'RM-DEV-PLASMAX-PRO',
        title: 'کنسول ایستاده کلینیکال با پروب‌های کامل',
        priceAmount: '580000000', // 58,000,000 Tomans
        currency: 'IRR',
        inStock: true,
      },
    ],
  },
];

function getProductPhoto(slug: string): { src: string; alt: string; standardTag: string } {
  const s = slug.toLowerCase();
  if (s.includes('plasmax')) {
    return {
      src: '/assets/drdermer/2025/08/18plasmax.webp',
      alt: 'دستگاه پیشرفته انرژی پلاسما PlasmaX دکتر درمر انگلستان',
      standardTag: 'استاندارد مدیکال CE 0123',
    };
  }
  if (s.includes('carbox') && !s.includes('carboxypod') && !s.includes('carboxypad') && !s.includes('carboxygel')) {
    return {
      src: '/assets/drdermer/2025/08/19carbox.webp',
      alt: 'دستگاه کربوکسی‌تراپی و تزریق گاز CarboX دکتر درمر انگلستان',
      standardTag: 'استاندارد مدیکال CE 0123',
    };
  }
  if (s.includes('carboxypad')) {
    return {
      src: '/assets/drdermer/2025/08/carboxypad.webp',
      alt: 'پدهای فعال‌ساز آلکالاین صورت و گردن CarboxyPad دکتر درمر',
      standardTag: 'فرمول استاندارد UK',
    };
  }
  if (s.includes('carboxypod')) {
    return {
      src: '/assets/drdermer/2025/07/carbon-carboxypod-1.png',
      alt: 'پادهای فعال‌ساز کربوکسی‌پاد CarboxyPod دکتر درمر',
      standardTag: 'فرمول استاندارد UK',
    };
  }
  if (s.includes('crystalene')) {
    return {
      src: '/assets/drdermer/2025/08/15crystalene.webp',
      alt: 'خمیر پولیش و لایه‌بردار کریستالین Crystalene دکتر درمر',
      standardTag: 'فرمول استاندارد UK',
    };
  }
  if (s.includes('healene')) {
    return {
      src: '/assets/drdermer/2025/08/16healene.webp',
      alt: 'ژل تسکین‌بخش و التیام‌دهنده هیلین Healene دکتر درمر',
      standardTag: 'فرمول استاندارد UK',
    };
  }
  if (s.includes('silicalene')) {
    return {
      src: '/assets/drdermer/2025/08/14silicalene.webp',
      alt: 'اسکراب دتوکس سیلیکالین Silicalene دکتر درمر',
      standardTag: 'فرمول استاندارد UK',
    };
  }
  // Default to authentic CarboxyGel
  return {
    src: '/assets/drdermer/2025/07/azelaic-acid-carboxygel.png',
    alt: 'ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel دکتر درمر انگلستان',
    standardTag: 'فرمول استاندارد UK',
  };
}

export function FeaturedProductShowcase({ products, totalCount }: FeaturedShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'carboxy' | 'homecare' | 'hardware'>('all');

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
              <span>PHARMACEUTICAL FORMULATIONS & MEDICAL CONSOLES</span>
            </div>
            <h2 id="featured-title" className="bch-headline">
              کاتالوگ رسمی محصولات و تجهیزات دکتر درمر انگلستان
            </h2>
            <p className="bch-subtext">
              فرمولاسیون‌های درموسوتیکال ترابافتی ReeSkin و ایستگاه‌های جراحی و کربوکسی‌تراپی ReeMed دارای گواهینامه‌های رسمی CE و ISO 13485
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
              همه اقلام ({enrichedItems.length})
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
              مراقبت خانگی ReeSkin™
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'hardware'}
              className={`cat-tab-btn ${activeTab === 'hardware' ? 'active' : ''}`}
              onClick={() => setActiveTab('hardware')}
            >
              دستگاه‌های پزشکی ReeMed™
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
                  aria-label={`مشاهده پرونده تخصصی ${product.title}`}
                >
                  <div className="bpc-glow-halo" aria-hidden="true" />
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="bpc-real-img"
                    loading="lazy"
                  />
                  <span className="bpc-formula-chip">{photo.standardTag}</span>
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
