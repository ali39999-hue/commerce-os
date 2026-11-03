import { Metadata } from 'next';
import Link from 'next/link';
import { DirectProductOrder } from '../../components/interactive/direct-product-order';
import { ClinicalPhotoShowcase } from '../../components/interactive/clinical-photo-showcase';
import { SilicaleneInteractiveSection } from './silicalene-interactive-section';

export const metadata: Metadata = {
  title: 'اسکراب دتوکس سیلیکالین Silicalene Mild Silica Scrub | دکتر درمر انگلستان',
  description:
    'اسکراب دتوکس و پاکسازی عمیق منافذ با میکروسفرهای گرد سیلیکا (Smooth Silica Spheres)، کربن فعال، اسید گلیکولیک (AHA)، سالیسیلیک اسید (BHA)، زینک PCA، بتائین، آلوئه‌ورا، شیرین‌بیان و بابونه.',
  keywords: [
    'سیلیکالین',
    'Silicalene Mild Silica Scrub',
    'اسکراب سیلیکا',
    'Smooth Silica Spheres',
    'کربن فعال',
    'سالیسیلیک اسید BHA',
    'اسید گلیکولیک AHA',
    'دتوکس منافذ',
    'کنترل چربی پوست',
    'ReeSkin Clinical',
  ],
  alternates: {
    canonical: '/silicalene',
  },
  openGraph: {
    title: 'Silicalene Mild Silica Scrub 200ml | اسکراب دتوکس سیلیکالین',
    description:
      'لایروبی عمیق منافذ، رفع جوش‌های سرسیاه و کنترل سبوم با کره‌های سیلیکای صیقلی، کربن فعال و هیدروکسی‌اسیدهای درماتولوژیک.',
    url: 'https://drdermer.ir/silicalene',
    siteName: 'دکتر درمر انگلستان',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: '/assets/drdermer/2025/08/14silicalene-1200x1109.webp',
        width: 1200,
        height: 1109,
        alt: 'اسکراب دتوکس سیلیکالین Silicalene Mild Silica Scrub دکتر درمر',
      },
    ],
  },
};

export default function SilicalenePage() {
  const photoViews = [
    {
      id: 'primary',
      label: 'نمای اصلی تیوب ۲۰۰ میلی‌لیتر',
      url: '/assets/drdermer/2025/08/14silicalene-1200x1109.webp',
      alt: 'تیوب ۲۰۰ میلی‌لیتر اسکراب دتوکس سیلیکالین دکتر درمر',
      caption: 'تیوب ۲۰۰ میلی‌لیتر کلینیکال با درپوش آب‌بندی ضد نفوذ هوا',
    },
    {
      id: 'secondary',
      label: 'نمای پروداکت شات انگل با پس‌زمینه شفاف',
      url: '/assets/drdermer/2025/08/14silicalene2-1200x1109.webp',
      alt: 'طراحی بسته‌بندی اسکراب سیلیکالین',
      caption: 'پکیجینگ ضد اشعه فرابنفش برای پایداری کربن فعال و اکتیوها',
    },
    {
      id: 'scrub-texture',
      label: 'بافت ژلی اسکراب حاوی میکروسفرهای سیلیکا و کربن',
      url: '/assets/drdermer/2025/08/silicalene-scrub-768x670.webp',
      alt: 'بافت ژل اسکراب دتوکس سیلیکالین',
      caption: 'ژل معلق‌کننده میکروسفرهای ژئودینامیک سیلیکا با ذرات زغال فعال',
    },
    {
      id: 'header-banner',
      label: 'پوستر بالینی لایروبی منافذ سیلیکالین',
      url: '/assets/drdermer/2025/08/silicalene-header-1200x501.webp',
      alt: 'پوستر بالینی اسکراب سیلیکالین دکتر درمر',
      caption: 'تاییدیه درماتولوژی کنترل سبوم و پاکسازی کومدون در کمبریج انگلستان',
    },
  ];

  return (
    <div className="cp-landing-root">
      <div className="cp-ambient-glow teal" />

      <div className="cp-container">
        {/* Navigation Breadcrumbs */}
        <div className="cp-breadcrumbs">
          <nav className="cp-breadcrumb-nav" aria-label="مسیر راهنما">
            <Link href="/">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/reeskin">لاین مراقبت ReeSkin™</Link>
            <span>/</span>
            <span className="cp-breadcrumb-current">اسکراب دتوکس Silicalene™</span>
          </nav>

          <span className="cp-badge-pill teal">
            <span className="pulse-dot" />
            فرمولاسیون دتوکس بیومکانیکی کمبریج
          </span>
        </div>

        {/* Hero Section */}
        <section className="cp-hero-grid">
          {/* Info & Direct CTA */}
          <div className="cp-hero-info">
            <div className="station-badge-wrapper">
              <span className="cp-badge-pill teal">SMOOTH SILICA DETOX SCRUB</span>
              <span className="cp-badge-pill">Charcoal &amp; AHA/BHA Matrix</span>
            </div>

            <h1 className="cp-hero-title">
              اسکراب دتوکس سیلیکالین{' '}
              <span className="gradient-text-teal">Silicalene Mild Silica Scrub</span>
            </h1>

            <div className="cp-hero-subtitle">
              پاکسازی عمقی منافذ، رفع کومدون‌های سرسیاه و کنترل سبوم با کره‌های صیقلی سیلیکا، کربن فعال و اسیدهای سالیسیلیک و گلیکولیک
            </div>

            <p className="cp-hero-desc">
              اسکراب سیلیکالین شاهکار داروسازی دکتر درمر در زمینه سم‌زدایی و لایروبی مجاری فولیکولی پوست است. استفاده از میکروسفرهای
              سیلیکای کاملاً گرد و ژئودینامیک مانع از خراشیدگی پوست شده و در تماس با منافذ، چربی‌های اکسیدشده را حل می‌کند. پودر کربن فعال
              پزشکی به عنوان یک مگنت طبیعی سموم شهری، ذرات PM2.5 و باقیمانده آرایش را جذب نموده و هم‌افزایی اسیدهای سالیسیلیک (BHA) و
              گلیکولیک (AHA) همراه با زینک PCA، بتائین، آلوئه‌ورا، شیرین‌بیان و بابونه چهره‌ای مات، شفاف و ابریشمی به جا می‌گذارد.
            </p>

            {/* Scientific Performance Telemetry */}
            <div className="cp-metrics-row">
              <div className="cp-metric-box">
                <div className="cp-metric-val teal">100%</div>
                <div className="cp-metric-label">کره‌های کاملاً مدور بیواینرت</div>
              </div>
              <div className="cp-metric-box">
                <div className="cp-metric-val teal">-54%</div>
                <div className="cp-metric-label">کاهش کومدون‌های سرسیاه بینی</div>
              </div>
              <div className="cp-metric-box">
                <div className="cp-metric-val teal">8h</div>
                <div className="cp-metric-label">مات‌کنندگی بافت و مهار ترشح سبوم</div>
              </div>
            </div>

            {/* Direct Order Component */}
            <DirectProductOrder
              productId="prod_drdermer_006"
              variantId="var_sil_200ml"
              sku="DD-SIL-200ML"
              title="اسکراب دتوکس سیلیکالین Silicalene Mild Silica Scrub"
              volume="۲۰۰ میلی‌لیتر (تیوب)"
              priceAmount="15500000"
              originalPriceAmount="18000000"
              discountPercent={14}
              inStock={true}
              theme="teal"
              badgeText="تضمین اصالت داروسازی دکتر درمر"
              image="/assets/drdermer/2025/08/14silicalene-1200x1109.webp"
            />
          </div>

          {/* Photo Showcase */}
          <ClinicalPhotoShowcase
            primaryPhoto="/assets/drdermer/2025/08/14silicalene-1200x1109.webp"
            productName="اسکراب دتوکس سیلیکالین Silicalene Mild Silica Scrub"
            volumeBadge="200ml Tube"
            theme="teal"
            views={photoViews}
          />
        </section>

        {/* Interactive Deep-Dive: Pore Cleansing Dynamics, 8 Active Inci, Sebum Balance */}
        <SilicaleneInteractiveSection />

        {/* Bottom Clinical Banner */}
        <div className="cp-bottom-cta-banner teal">
          <span className="cp-section-eyebrow teal">PURIFYING REGIMEN</span>
          <h2>پروتکل هم‌افزا: پاکسازی منافذ با سیلیکالین + ترمیم با هیلین</h2>
          <p>
            برای پوست‌های مختلط، چرب و دارای منافذ باز، شستشو با اسکراب سیلیکالین ۲ تا ۳ بار در هفته همراه با ژل تسکین‌بخش هیلین (Healene)
            به عنوان مرطوب‌کننده بدون چربی پس از شستشو، سد رطوبتی سالم و بافت پوستی مات و عاری از جوش را تضمین می‌نماید.
          </p>
          <div className="cp-bottom-actions">
            <Link
              href="/products/silicalene"
              className="station-btn-primary"
              style={{ background: 'linear-gradient(135deg, #C69C70 0%, #B08A5E 100%)' }}
            >
              مشاهده برگه فنی کامل در کاتالوگ ←
            </Link>
            <Link
              href="/healene"
              className="station-btn-secondary"
            >
              مکمل پس از اسکراب: ژل التیام‌بخش هیلین (Healene)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
