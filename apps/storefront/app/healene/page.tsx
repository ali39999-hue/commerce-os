import { Metadata } from 'next';
import Link from 'next/link';
import { DirectProductOrder } from '../../components/interactive/direct-product-order';
import { ClinicalPhotoShowcase } from '../../components/interactive/clinical-photo-showcase';
import { HealeneInteractiveSection } from './healene-interactive-section';
import { getProduct, resolveProductImage, resolveVariant } from '../../lib/catalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ژل تسکین‌بخش و التیام‌دهنده هیلین Healene Soothing Gel | دکتر درمر انگلستان',
  description:
    'ژل خنک‌کننده و تسکین‌دهنده فوری پوست با نیاسینامید، پانتنول (B5)، هیالورونیک اسید، آلانتوئین، سدیم PCA، آلوئه‌ورا، سنتلا آسیاتیکا، کالاندولا، میموزا، آسای، بابونه و شیرین‌بیان.',
  keywords: [
    'هیلین',
    'Healene Soothing Gel',
    'ژل التیام بخش',
    'پانتنول B5',
    'سنتلا آسیاتیکا',
    'میموزا',
    'کالاندولا',
    'هیالورونیک اسید',
    'پست پروسیجر',
    'ترمیم سد دفاعی',
    'ReeSkin Clinical',
  ],
  alternates: {
    canonical: '/healene',
  },
  openGraph: {
    title: 'Healene Soothing Gel 250ml | ژل التیام‌بخش و خنک‌کننده هیلین',
    description:
      'آبرسان سبک و التیام‌بخش فوری حاوی ۱۲ اکتیو ترمیم‌کننده برای تسکین سریع قرمزی و بازسازی سد دفاعی پوست پس از مداخلات بالینی.',
    url: 'https://drdermer.ir/healene',
    siteName: 'دکتر درمر انگلستان',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: '/assets/drdermer/2025/08/16healene-1200x1109.webp',
        width: 1200,
        height: 1109,
        alt: 'ژل التیام‌بخش هیلین Healene Soothing Gel دکتر درمر',
      },
    ],
  },
};

export default async function HealenePage() {
  const product = await getProduct('healene');
  const primaryVariant = resolveVariant(product, ['DD-HEA-250ML']);
  const primaryImage = resolveProductImage(
    product,
    '/assets/drdermer/2025/08/16healene-1200x1109.webp'
  );
  const photoViews = [
    {
      id: 'primary',
      label: 'نمای اصلی بطری پمپی ۲۵۰ میلی‌لیتر',
      url: '/assets/drdermer/2025/08/16healene-1200x1109.webp',
      alt: 'بطری پمپی ۲۵۰ میلی‌لیتر ژل تسکین‌بخش هیلین دکتر درمر',
      caption: 'بطری پمپی ۲۵۰ میلی‌لیتر ایزوله با پمپ استریل کلینیکال',
    },
    {
      id: 'secondary',
      label: 'نمای پروداکت شات انگل با پس‌زمینه شفاف',
      url: '/assets/drdermer/2025/08/16healene2-1200x1109.webp',
      alt: 'پکیجینگ رسمی Healene Soothing Gel',
      caption: 'طراحی ارگونومیک بطری پمپی با حفاظت از اکسیداسیون محتوا',
    },
    {
      id: 'gel-texture',
      label: 'بافت آکوآ ژل کریستالی و شفاف',
      url: '/assets/drdermer/2025/08/healene-gel-768x670.webp',
      alt: 'بافت کریستالی آکوآ ژل هیلین',
      caption: 'فرمولاسیون فاقد چربی (Oil-Free) با جذب فوق‌العاده سریع و خنک‌کننده',
    },
    {
      id: 'header-banner',
      label: 'پوستر بالینی ژل التیام‌بخش هیلین',
      url: '/assets/drdermer/2025/08/healene-header-1200x653.webp',
      alt: 'پوستر کلینیکال ترمیم سد دفاعی پوست با هیلین دکتر درمر',
      caption: 'سرتیفیکیت ریکاوری پس از لیزر، پیلینگ و کربوکسی‌تراپی',
    },
  ];

  return (
    <div className="cp-landing-root">
      <div className="cp-ambient-glow cyan" />

      <div className="cp-container">
        {/* Navigation Breadcrumbs */}
        <div className="cp-breadcrumbs">
          <nav className="cp-breadcrumb-nav" aria-label="مسیر راهنما">
            <Link href="/">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/reeskin">لاین مراقبت ReeSkin™</Link>
            <span>/</span>
            <span className="cp-breadcrumb-current">ژل تسکین‌بخش Healene™</span>
          </nav>

          <span className="cp-badge-pill cyan">
            <span className="pulse-dot" />
            فرمولاسیون پست‌پروسیجر بالینی کمبریج
          </span>
        </div>

        {/* Hero Section */}
        <section className="cp-hero-grid">
          {/* Info & Direct CTA */}
          <div className="cp-hero-info">
            <div className="station-badge-wrapper">
              <span className="cp-badge-pill cyan">POST-TREATMENT DERMAL RELIEF</span>
              <span className="cp-badge-pill">5% Dexpanthenol + Centella Matrix</span>
              <span className="cp-badge-pill cyan">TEWL -74% Clinically Proven</span>
            </div>

            <h1 className="cp-hero-title">
              ژل تسکین‌بخش و التیام‌دهنده هیلین{' '}
              <span className="gradient-text-cyan">Healene Soothing Gel</span>
            </h1>

            <div className="cp-hero-subtitle">
              آبرسان سبک، خنک‌کننده و ترمیم‌کننده فوری سد دفاعی پوست با ۵٪ دکسپانتنول، عصاره سنتلا، اسید هیالورونیک و کمپلکس ۷ عصاره التیام‌بخش
            </div>

            <p className="cp-hero-desc">
              ژل التیام‌بخش هیلین برای مهار فوری التهاب، سوزش، قرمزی اریتما و افت سد دفاعی ناشی از درمان‌های کلینیکی (لیزر، پیلینگ،
              میکرونیدلینگ، کربوکسی‌تراپی و سایش میکرودرم) فرموله شده است. ساختار ژلی سبک و فاقد چربی (Oil-Free) با ترکیب طلایی
              <strong> ۵٪ دکسپانتنول دارویی (D-Panthenol) و عصاره غلیظ سنتلا آسیاتیکا (Cica)</strong>، اتلاف آب ترنس‌اپیدرمال (TEWL) را تا ۷۴٪
              کاهش داده، سنتز سرامیدها را احیا کرده و دمای موضعی پوست ملتهب را ظرف چند ثانیه تا ۳.۲ درجه سانتی‌گراد خنک می‌سازد.
            </p>

            {/* Scientific Performance Telemetry */}
            <div className="cp-metrics-row">
              <div className="cp-metric-box">
                <div className="cp-metric-val cyan">-3.2°C</div>
                <div className="cp-metric-label">خنک‌کنندگی فوری دمای سطح پوست</div>
              </div>
              <div className="cp-metric-box">
                <div className="cp-metric-val cyan">-74%</div>
                <div className="cp-metric-label">کاهش تبخیر سطحی آب (TEWL)</div>
              </div>
              <div className="cp-metric-box">
                <div className="cp-metric-val cyan">61%</div>
                <div className="cp-metric-label">کاهش قرمزی اریتما ظرف ۳۰ دقیقه</div>
              </div>
              <div className="cp-metric-box">
                <div className="cp-metric-val cyan">5.0%</div>
                <div className="cp-metric-label">غلظت خالص دکسپانتنول فارماکوپه</div>
              </div>
            </div>

            {/* Direct Order Component */}
            <DirectProductOrder
              productId={product?.id ?? ''}
              variantId={primaryVariant?.id ?? ''}
              productSlug="healene"
              sku={primaryVariant?.sku ?? 'DD-HEA-250ML'}
              title={product?.title ?? 'ژل تسکین‌بخش و التیام‌دهنده هیلین Healene Soothing Gel'}
              volume={primaryVariant?.sizeOrVolume ?? '۲۵۰ میلی‌لیتر (بطری پمپی)'}
              priceAmount={primaryVariant?.priceAmount ?? '0'}
              originalPriceAmount={primaryVariant?.originalPriceAmount ?? undefined}
              discountPercent={primaryVariant?.discountPercent ?? undefined}
              inStock={primaryVariant?.inStock ?? true}
              theme="cyan"
              badgeText="تضمین اصالت داروسازی دکتر درمر"
              image={primaryImage}
            />
          </div>

          {/* Photo Showcase */}
          <ClinicalPhotoShowcase
            primaryPhoto="/assets/drdermer/2025/08/16healene-1200x1109.webp"
            productName="ژل تسکین‌بخش هیلین Healene Soothing Gel"
            volumeBadge="250ml Pump"
            theme="cyan"
            views={photoViews}
          />
        </section>

        {/* Interactive Deep-Dive: Cooling Kinetics, 12 Active Inci, Recovery Protocols */}
        <HealeneInteractiveSection />

        {/* Bottom Clinical Banner */}
        <div className="cp-bottom-cta-banner cyan">
          <span className="cp-section-eyebrow cyan">POST-PROCEDURE ESSENTIAL</span>
          <h2>مکمل تثبیت‌کننده پس از کربوکسی‌تراپی و لایه‌برداری ابریشمی</h2>
          <p>
            استفاده از ژل هیلین پس از پروتکل‌های کربوکسی‌تراپی و خمیر کریستالین، رطوبت به دام افتاده در لایه‌های درم را قفل نموده
            و سد دفاعی پوست را در برابر استرس‌های اکسیداتیو و خشکی محیطی محافظت می‌نماید.
          </p>
          <div className="cp-bottom-actions">
            <Link
              href="/products/healene"
              className="station-btn-primary cyan"
            >
              مشاهده برگه فنی در کاتالوگ فروشگاه ←
            </Link>
            <Link
              href="/crystalene"
              className="station-btn-secondary"
            >
              مرحله قبل: خمیر پولیش ابریشمی کریستالین (Crystalene)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
