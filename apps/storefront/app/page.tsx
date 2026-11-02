import { listProducts } from '../lib/catalog';
import { HeroBanner } from '../components/home/hero-banner';
import { PathSelector } from '../components/home/path-selector';
import { TrustCredibilityBar } from '../components/home/trust-bar';
import { CategoryConcernNav } from '../components/home/category-concern-nav';
import { BrandFamilyRail } from '../components/home/brand-family-rail';
import { FeaturedProductShowcase } from '../components/home/featured-showcase';
import { ScienceMechanismSpotlight } from '../components/home/science-spotlight';
import { BohrOxygenationSimulator } from '../components/home/bohr-simulator';
import { VisiaTrialComparisonSlider } from '../components/home/visia-comparison-slider';
import { SkinRegimenFinderWidget } from '../components/home/skin-regimen-finder';
import { MedicalDevicesShowcase } from '../components/home/medical-devices-showcase';
import { ClinicalResultsTestimonials } from '../components/home/clinical-results';
import { AcademyGuides } from '../components/home/academy-guides';
import { ClinicB2BStrip } from '../components/home/clinic-b2b-strip';
import { NewsletterVip } from '../components/home/newsletter-vip';
import { ProductRail } from '../components/discovery/product-rail';
import '../components/discovery/digital-badge.css';

export const dynamic = 'force-dynamic';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drdermer.ir').replace(/\/$/, '');

export default async function HomePage() {
  const catalog = await listProducts();
  const products = catalog?.data ?? [];

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'MedicalBusiness'],
        '@id': `${SITE_URL}/#organization`,
        name: 'دکتر درمر | Dr Dermer Clinical Skin & Health',
        alternateName: 'Dr Dermer Clinical Research Laboratories',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description:
          'فروشگاه رسمی و آکادمی تخصصی برندهای درمانی ReeSkin و ReeMed انگلستان؛ سیستم کربوکسی‌تراپی پیشرفته (CarboxyGel)، فرمولاسیون درموسوتیکال و پروتکل‌های بالینی پوست.',
        medicalSpecialty: 'Dermatology',
        telephone: '+98-21-88880000',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IR',
          addressLocality: 'Tehran',
        },
        sameAs: ['https://www.drdermer.co.uk'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'دکتر درمر',
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'صفحه اصلی',
            item: `${SITE_URL}/`,
          },
        ],
      },
    ],
  };

  return (
    <div className="homepage-content-stream">
      {/* Schema.org Structured Data (Organization, MedicalBusiness, WebSite, Breadcrumbs) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      {/* 1. Hero Banner (Clear Primary & Secondary CTAs) */}
      <HeroBanner />

      {/* 2. Path Selector (Home Care vs Clinical Pro vs Medical Equipment) */}
      <PathSelector />

      {/* 3. Featured Product Showcase (Curated 4-6 Hero Products) */}
      <FeaturedProductShowcase products={products} totalCount={catalog?.meta?.count} />

      {/* 4. Two Brand Families Architecture (ReeSkin & ReeMed) */}
      <BrandFamilyRail />

      {/* 5. Category & Concern Quick-Nav */}
      <CategoryConcernNav />

      {/* 5.1 Interactive Skin Consultation & Diagnostic Regimen Finder */}
      <SkinRegimenFinderWidget />

      {/* 5.2 Dynamic Popular Clinical Recommendations */}
      <section className="dynamic-rail-container">
        <ProductRail endpoint="/recommendations/popular?limit=6" titleFa="پروتکل‌های محبوب و پرطرفدار بالینی" />
      </section>

      {/* 6. Science Behind Innovation (Bohr Effect & Transdermal CO2) */}
      <ScienceMechanismSpotlight />

      {/* 6.1 Interactive Bohr Effect Oxygenation Simulator */}
      <BohrOxygenationSimulator />

      {/* 6.2 Interactive Before & After Visia Trial Comparison Slider */}
      <VisiaTrialComparisonSlider />

      {/* 7. Professional Solutions (Medical Devices CarboX & PlasmaX) */}
      <MedicalDevicesShowcase />

      {/* 7.1 Clinic B2B Wholesale & Partner Strip */}
      <ClinicB2BStrip />

      {/* 8. Academy & Protocol Guides (Editorial & Education) */}
      <AcademyGuides />

      {/* 9. Trust, Credibility & Doctor Testimonials */}
      <ClinicalResultsTestimonials />
      <TrustCredibilityBar />

      {/* 10. Newsletter & VIP Membership */}
      <NewsletterVip />
    </div>
  );
}
