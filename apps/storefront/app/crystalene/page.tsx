import { Metadata } from 'next';
import Link from 'next/link';
import { DirectProductOrder } from '../../components/interactive/direct-product-order';
import { ClinicalPhotoShowcase } from '../../components/interactive/clinical-photo-showcase';
import { CrystaleneInteractiveSection } from './crystalene-interactive-section';

export const metadata: Metadata = {
  title: 'خمیر پولیش و لایه‌بردار کریستالین Crystalene Polish Paste | دکتر درمر انگلستان',
  description:
    'خمیر میکرودرم ابریشمی با کریستال‌های آلومینای فوق‌ریز (Ultra-fine Alumina Microcrystals)، نیاسینامید، لاکتیک اسید، بتائین، زینک PCA، ویتامین E، روغن آرگان، شی‌باتر و شیرین‌بیان جهت لایه‌برداری بدون خراش‌های میکروسکوپی.',
  keywords: [
    'کریستالین',
    'Crystalene Polish Paste',
    'پولیش آلومینا',
    'Alumina Microcrystals',
    'میکرودرم ابریشمی',
    'اسید لاکتیک',
    'نیاسینامید',
    'لایه‌برداری کلینیکی',
    'ReeSkin Clinical',
  ],
  alternates: {
    canonical: '/crystalene',
  },
  openGraph: {
    title: 'Crystalene Polish Paste 200ml | پولیش لایه‌بردار کریستالین',
    description:
      'میکرودرم ابریشمی با کریستال‌های آلومینای فوق‌ریز، نیاسینامید، اسید لاکتیک و ترکیبات مغذی بدون ایجاد خراش میکروسکوپی.',
    url: 'https://drdermer.ir/crystalene',
    siteName: 'دکتر درمر انگلستان',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: '/assets/drdermer/2025/08/15crystalene-1200x1109.webp',
        width: 1200,
        height: 1109,
        alt: 'خمیر پولیش کریستالین Crystalene Polish Paste دکتر درمر',
      },
    ],
  },
};

export default function CrystalenePage() {
  const photoViews = [
    {
      id: 'primary',
      label: 'نمای اصلی تیوب ۲۰۰ میلی‌لیتر',
      url: '/assets/drdermer/2025/08/15crystalene-1200x1109.webp',
      alt: 'تیوب ۲۰۰ میلی‌لیتر خمیر پولیش کریستالین دکتر درمر',
      caption: 'تیوب ۲۰۰ میلی‌لیتر سالنی با پلمب وکیوم استاندارد',
    },
    {
      id: 'secondary',
      label: 'نمای پروداکت شات با پس‌زمینه شفاف',
      url: '/assets/drdermer/2025/08/15crystalene2-1200x1109.webp',
      alt: 'پکیجینگ کامل کریستالین Crystalene Polish Paste',
      caption: 'نمای انگل‌شات با درپوش پیچی محافظ نفوذ هوا',
    },
    {
      id: 'scrub-texture',
      label: 'بافت کرمی با میکروکریستال‌های آلومینا',
      url: '/assets/drdermer/2025/08/crystalene-scrub-768x670.webp',
      alt: 'بافت کرمی پولیش کریستالین حاوی کریستال‌های آلومینا',
      caption: 'بافت کرمی اشباع‌شده با ریزبلورهای گردشده اکسید آلومینیوم',
    },
    {
      id: 'header-banner',
      label: 'پوستر بالینی کریستالین',
      url: '/assets/drdermer/2025/08/crystalene-header-1200x542.webp',
      alt: 'پوستر بالینی لاین پولیش کریستالین دکتر درمر',
      caption: 'تأییدیه درماتولوژی دانشگاه کمبریج انگلستان',
    },
  ];

  return (
    <div className="cp-landing-root">
      <div className="cp-ambient-glow emerald" />

      <div className="cp-container">
        {/* Navigation Breadcrumbs */}
        <div className="cp-breadcrumbs">
          <nav className="cp-breadcrumb-nav" aria-label="مسیر راهنما">
            <Link href="/">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/reeskin">لاین مراقبت ReeSkin™</Link>
            <span>/</span>
            <span className="cp-breadcrumb-current">خمیر پولیش Crystalene™</span>
          </nav>

          <span className="cp-badge-pill emerald">
            <span className="pulse-dot" />
            فرمولاسیون تخصصی درموسوتیکال کمبریج
          </span>
        </div>

        {/* Hero Section */}
        <section className="cp-hero-grid">
          {/* Info & Direct CTA */}
          <div className="cp-hero-info">
            <div className="station-badge-wrapper">
              <span className="cp-badge-pill emerald">MICRODERM RESURFACING</span>
              <span className="cp-badge-pill">Alumina Bio-Inert Matrix</span>
            </div>

            <h1 className="cp-hero-title">
              خمیر پولیش و لایه‌بردار کریستالین{' '}
              <span className="gradient-text-emerald">Crystalene Polish Paste</span>
            </h1>

            <div className="cp-hero-subtitle">
              پولیش میکرودرم ابریشمی با کریستال‌های آلومینای میکرونی، نیاسینامید، لاکتیک اسید و کمپلکس مغذی
            </div>

            <p className="cp-hero-desc">
              خمیر پولیش کریستالین فرآورده لایه‌بردار با درجه پزشکی است که عملکرد سایش بسیار دقیق کریستال‌های آلومینای فوق‌ریز
              را با خواص آبرسانی، ضدالتهابی و بازسازی اپیدرم ترکیب می‌کند. برخلاف اسکراب‌های زبر و سنتی هسته میوه که موجب
              خراشیدگی‌های میکروسکوپی (Micro-tears) و پارگی سد دفاعی می‌شوند، کریستال‌های آلومینای بیواینرت با لبه‌های گردشده،
              سلول‌های مرده لایه شاخی را با دقت میکرونی جدا کرده و بافتی مخملی و درخشان پدید می‌آورند.
            </p>

            {/* Scientific Performance Telemetry */}
            <div className="cp-metrics-row">
              <div className="cp-metric-box">
                <div className="cp-metric-val">12.0%</div>
                <div className="cp-metric-label">کریستال‌های خالص آلومینا</div>
              </div>
              <div className="cp-metric-box">
                <div className="cp-metric-val">0 Tear</div>
                <div className="cp-metric-label">عدم ایجاد خراش میکروسکوپی</div>
              </div>
              <div className="cp-metric-box">
                <div className="cp-metric-val">pH 4.2</div>
                <div className="cp-metric-label">اسیدیته سازگار با لایه اسیدی</div>
              </div>
            </div>

            {/* Direct Order Component */}
            <DirectProductOrder
              productId="prod_drdermer_004"
              variantId="var_cry_200ml"
              sku="DD-CRY-200ML"
              title="خمیر پولیش کریستالین Crystalene Polish Paste"
              volume="۲۰۰ میلی‌لیتر (تیوب سالنی)"
              priceAmount="17500000"
              originalPriceAmount="20500000"
              discountPercent={14}
              inStock={true}
              theme="emerald"
              badgeText="تضمین اصالت داروسازی دکتر درمر"
              image="/assets/drdermer/2025/08/15crystalene-1200x1109.webp"
            />
          </div>

          {/* Photo Showcase */}
          <ClinicalPhotoShowcase
            primaryPhoto="/assets/drdermer/2025/08/15crystalene-1200x1109.webp"
            productName="خمیر پولیش کریستالین Crystalene Polish Paste"
            volumeBadge="200ml Tube"
            theme="emerald"
            views={photoViews}
          />
        </section>

        {/* Interactive Deep-Dive: Friction vs Polish, Active Ingredients, Protocol */}
        <CrystaleneInteractiveSection />

        {/* Bottom Clinical Banner */}
        <div className="cp-bottom-cta-banner">
          <span className="cp-section-eyebrow">PROFESSIONAL PROTOCOL</span>
          <h2>آماده‌سازی پوست پیش از پروتکل‌های کربوکسی‌تراپی و جذب سرم</h2>
          <p>
            استفاده هفتگی از خمیر پولیش کریستالین به عنوان مرحله پیش‌درمان (Pre-Procedure) باعث افزایش ۴۰ درصدی راندمان
            نفوذ ژل کربوکسی، سرم‌های ضدپیری و ترکیبات فعال درموسوتیکال به لایه‌های زنده بافت پوست می‌گردد.
          </p>
          <div className="cp-bottom-actions">
            <Link
              href="/products/crystalene"
              className="station-btn-primary"
            >
              مشاهده برگه فنی کامل در کاتالوگ ←
            </Link>
            <Link
              href="/healene"
              className="station-btn-secondary"
            >
              مکمل پس از پولیش: ژل تسکین‌بخش هیلین (Healene)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
