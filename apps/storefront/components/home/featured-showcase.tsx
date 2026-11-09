import Link from 'next/link';
import { formatToman, type Product } from '../../lib/catalog';
import { ProductCardAction } from '../product-card-action';
import './featured-showcase.css';

interface FeaturedShowcaseProps {
  products: Product[];
  totalCount?: number;
}

// 8 Authentic Dr Dermer products with exact mirrored specs, pricing, and photography
const CURATED_CLINICAL_PRODUCTS: Product[] = [
  {
    id: 'prod_drdermer_001',
    slug: 'carboxygel',
    title: 'ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel Professional (ReeSkin)',
    description: 'ژل ۲ فاز ماتریکسی با تحریک فیزیولوژیک اثر بوهر (Bohr Effect) جهت اکسیژن‌رسانی عمیق سلولی، بهبود اسکار و سنتز کلاژن بدون سوزن.',
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

interface ProductCardMeta {
  mainTitle: string;
  subtitle: string;
  theme: string;
  pillTheme: 'light' | 'dark';
}

function getProductCardMeta(slug: string): ProductCardMeta {
  const s = slug.toLowerCase();
  if (s.includes('plasmax')) {
    return {
      mainTitle: 'ایستگاه ۴ کاره PlasmaX',
      subtitle: 'بلفاروپلاستی غیرتهاجمی و پلاسمای سرد آرگون',
      theme: 'theme-violet',
      pillTheme: 'dark',
    };
  }
  if (s.includes('carbox') && !s.includes('carboxypod') && !s.includes('carboxypad') && !s.includes('carboxygel')) {
    return {
      mainTitle: 'دستگاه مدیکال CarboX',
      subtitle: 'تزریق دقیق زیرجلدی CO₂ و فعال‌ساز پاد',
      theme: 'theme-cyan',
      pillTheme: 'dark',
    };
  }
  if (s.includes('carboxypad')) {
    return {
      mainTitle: 'پدهای آلکالاین CarboxyPad',
      subtitle: 'شیت‌های میکروپرمنبران برش آناتومیک صورت و گردن',
      theme: 'theme-mint',
      pillTheme: 'light',
    };
  }
  if (s.includes('carboxypod')) {
    return {
      mainTitle: 'پادهای فعال‌ساز CarboxyPod',
      subtitle: 'کربن فعال و لایه‌برداری همزمان ترابافتی CO₂',
      theme: 'theme-amber',
      pillTheme: 'dark',
    };
  }
  if (s.includes('crystalene')) {
    return {
      mainTitle: 'خمیر پولیش Crystalene',
      subtitle: 'میکرودرم ابریشمی با آلومینای خالص و نیاسینامید',
      theme: 'theme-peach',
      pillTheme: 'light',
    };
  }
  if (s.includes('healene')) {
    return {
      mainTitle: 'ژل التیام‌بخش Healene',
      subtitle: 'ترمیم سد دفاعی با نیاسینامید، میموزا و پانتنول B5',
      theme: 'theme-periwinkle',
      pillTheme: 'light',
    };
  }
  if (s.includes('silicalene')) {
    return {
      mainTitle: 'اسکراب دتوکس Silicalene',
      subtitle: 'پاکسازی عمیق منافذ با میکروسفرهای کروی سیلیکا',
      theme: 'theme-slate',
      pillTheme: 'dark',
    };
  }
  // Default CarboxyGel
  return {
    mainTitle: 'ژل کربوکسی‌تراپی CarboxyGel',
    subtitle: 'اکسیژن‌رسانی سلولی اثر بوهر و کلاژن‌سازی عمیق',
    theme: 'theme-teal',
    pillTheme: 'light',
  };
}

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
  // Always render the 8 authentic Dr Dermer products, enriched with live variants if available
  const displayItems = CURATED_CLINICAL_PRODUCTS.map((curated) => {
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

  return (
    <section id="featured-products" className="clinical-featured-section" aria-labelledby="featured-title">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">فرمولاسیون‌ها و تجهیزات دارای گرید پزشکی</div>
          <h2 id="featured-title" className="section-title">
            ۸ محصول شاخص و اصیل دکتر درمر انگلستان
          </h2>
        </div>
        <div className="section-count-badge">
          {totalCount ? `${totalCount} فرمولاسیون و دستگاه فعال` : '۸ محصول و دستگاه شاخص بالینی'}
        </div>
      </div>

      <div className="clinical-product-grid">
        {displayItems.map((product) => {
          const variant = product.variants[0];
          const isReeMed = product.title.includes('ReeMed') || product.slug === 'carbox' || product.slug === 'plasmax';
          const photo = getProductPhoto(product.slug);
          const meta = getProductCardMeta(product.slug);

          return (
            <article className={`clinical-card modern-pill-card ${meta.theme}`} key={product.id}>
              {/* Top Bar with Brand Family & Stock Indicators */}
              <div className="card-top-bar">
                <span className="card-family-capsule">
                  {isReeMed ? 'ReeMed Pro' : 'ReeSkin Clinical'}
                </span>
                {variant?.inStock ? (
                  <span className="card-stock-dot">
                    <span className="dot-pulse" />
                    موجود
                  </span>
                ) : (
                  <span className="card-stock-dot">
                    عدم موجودی
                  </span>
                )}
              </div>

              {/* Seamless Media Stage with Masked Image Fade */}
              <Link
                href={`/products/${encodeURIComponent(product.slug)}`}
                className="card-media-stage"
                aria-label={`مشاهده مشخصات ${product.title}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="card-product-image"
                  loading="lazy"
                />
              </Link>

              {/* Details & Typography */}
              <div className="card-details-area">
                <div className="card-price-row">
                  <strong className="card-main-price">
                    {variant ? formatToman(variant.priceAmount) : 'استعلام قیمت'}
                  </strong>
                </div>

                <h3 className="card-headline">
                  <Link href={`/products/${encodeURIComponent(product.slug)}`} title={product.title}>
                    {meta.mainTitle}
                  </Link>
                </h3>

                <p className="card-sub-indication" title={meta.subtitle}>
                  {meta.subtitle}
                </p>

                {/* Floating Pill Action Button */}
                <div className="card-action-wrap">
                  {variant && variant.inStock ? (
                    <ProductCardAction
                      variantId={variant.id}
                      productId={product.id}
                      title={product.title}
                      sku={variant.sku}
                      priceAmount={variant.priceAmount}
                      pillTheme={meta.pillTheme}
                      label="خرید سریع"
                      image={photo.src}
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
    </section>
  );
}
