import { listProducts } from '../lib/catalog';
import { HeroBanner } from '../components/home/hero-banner';
import { TrustCredibilityBar } from '../components/home/trust-bar';
import { CategoryConcernNav } from '../components/home/category-concern-nav';
import { BrandFamilyRail } from '../components/home/brand-family-rail';
import { FeaturedProductShowcase } from '../components/home/featured-showcase';
import { ScienceMechanismSpotlight } from '../components/home/science-spotlight';
import { ClinicalResultsTestimonials } from '../components/home/clinical-results';
import { AcademyGuides } from '../components/home/academy-guides';
import { ClinicB2BStrip } from '../components/home/clinic-b2b-strip';
import { NewsletterVip } from '../components/home/newsletter-vip';
import { ProductRail } from '../components/discovery/product-rail';
import '../components/discovery/digital-badge.css';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const catalog = await listProducts();
  const products = catalog?.data ?? [];

  return (
    <div className="homepage-content-stream">
      {/* 3. Hero Banner (Editorial & Clinical, showcasing Hero Innovation CarboxyGel) */}
      <HeroBanner />

      {/* 4. Trust & Clinical Credibility Bar */}
      <TrustCredibilityBar />

      {/* 5. Category & Concern Quick-Nav */}
      <CategoryConcernNav />

      {/* 6. Brand Families Architecture (ReeSkin & ReeMed) */}
      <BrandFamilyRail />

      {/* 6. Featured Product Showcase / Product Family Rails */}
      <FeaturedProductShowcase products={products} totalCount={catalog?.meta?.count} />

      {/* Discovery Dynamic Product Rail */}
      <section className="dynamic-rail-container">
        <ProductRail endpoint="/recommendations/popular?limit=6" titleFa="پروتکل‌های محبوب و پرطرفدار بالینی" />
      </section>

      {/* 7. Science & Mechanism of Action Spotlight (Bohr Effect & Transdermal CO2) */}
      <ScienceMechanismSpotlight />

      {/* 8. Verified Clinical Results / Doctor Testimonials */}
      <ClinicalResultsTestimonials />

      {/* 9. Academy & Protocol Guides */}
      <AcademyGuides />

      {/* 10. Professional B2B Clinic / Wholesale CTA strip */}
      <ClinicB2BStrip />

      {/* 11. Newsletter & VIP Membership */}
      <NewsletterVip />
    </div>
  );
}
