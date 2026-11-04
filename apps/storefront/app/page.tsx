import { listProducts } from '../lib/catalog';
import { RupakHero } from '../components/rupak-hero/rupak-hero';
import { RupakCategoryWave } from '../components/rupak-hero/rupak-category-wave';
import { RupakSpecialOffers } from '../components/rupak-hero/rupak-special-offers';
import { RupakNewestProducts } from '../components/rupak-hero/rupak-newest-products';
import { RupakAboutSection } from '../components/rupak-hero/rupak-about-section';
import { TrustCredibilityBar } from '../components/home/trust-bar';
import { CategoryConcernNav } from '../components/home/category-concern-nav';
import { BrandFamilyRail } from '../components/home/brand-family-rail';
import { FeaturedProductShowcase } from '../components/home/featured-showcase';
import { ScienceMechanismSpotlight } from '../components/home/science-spotlight';
import { BohrOxygenationSimulator } from '../components/home/bohr-simulator';
import { VisiaTrialComparisonSlider } from '../components/home/visia-comparison-slider';
import { RupakServicesSection } from '../components/rupak-services/rupak-services-section';
import { MedicalDevicesShowcase } from '../components/home/medical-devices-showcase';
import { ClinicalResultsTestimonials } from '../components/home/clinical-results';
import { AcademyGuides } from '../components/home/academy-guides';


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

      {/* 3. Hero Banner (Editorial & Clinical, showcasing Hero Innovation CarboxyGel) */}
      <RupakHero showImage={false} />

      {/* 3.1 Rupak Wave Category Section */}
      <RupakCategoryWave />


      {/* 4. Trust & Clinical Credibility Bar */}
      {/* 4. Rupak Special Offers & Dual Banners */}
      <div id="rupak-catalog">
        <RupakSpecialOffers />
      </div>

      {/* 6. Brand Families Architecture (ReeSkin & ReeMed) */}
      {/* 5. Rupak Newest Products Carousel (جدیدترین محصولات) */}
      <RupakNewestProducts />

      {/* 6. سکشن بنرهای دوقلو، درباره روپاک شاپ و مشاوره رایگان (جایگزین سکشن محصولات) */}
      <RupakAboutSection />

      {/* 6.1 راهنمای سفارش و خدمات تخصصی روپاک شاپ */}
      <RupakServicesSection />


      {/* 7. Science & Mechanism of Action Spotlight (Bohr Effect & Transdermal CO2) */}
      <ScienceMechanismSpotlight />

      {/* 7.1 Interactive Bohr Effect Oxygenation Simulator / Visualizer */}
      <BohrOxygenationSimulator />

      {/* 8. Interactive Before & After Visia Trial Comparison Slider */}
      <VisiaTrialComparisonSlider />

      {/* 8.1 Verified Clinical Results / Doctor Testimonials */}
      <ClinicalResultsTestimonials />

      {/* 8.2 Interactive Medical Devices 360-Degree Hotspot Showcase (CarboX & PlasmaX) */}
      <MedicalDevicesShowcase />

      {/* 9. Academy & Protocol Guides */}
      <AcademyGuides />


    </div>
  );
}
