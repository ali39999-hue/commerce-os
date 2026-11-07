import { HeroBanner } from './hero-banner';
import { PathSelector } from './path-selector';
import { TrustCredibilityBar } from './trust-bar';
import { CategoryConcernNav } from './category-concern-nav';
import { BrandFamilyRail } from './brand-family-rail';
import { FeaturedProductShowcase } from './featured-showcase';
import { ScienceMechanismSpotlight } from './science-spotlight';
import { BohrOxygenationSimulator } from './bohr-simulator';
import { VisiaTrialComparisonSlider } from './visia-comparison-slider';
import { SkinRegimenFinderWidget } from './skin-regimen-finder';
import { ClinicalResultsTestimonials } from './clinical-results';
import { AcademyGuides } from './academy-guides';
import { NewsletterVip } from './newsletter-vip';
import { ProductRail } from '../discovery/product-rail';
import type { Product } from '../../lib/catalog';
import {
  fetchHomepageSectionOverrides,
  type HomepageSectionOverrides,
} from '../../lib/storefront-sections';

export async function StorefrontSectionsWrapper({
  products,
  totalCount,
}: {
  products: Product[];
  totalCount?: number;
}) {
  const overrides: HomepageSectionOverrides = await fetchHomepageSectionOverrides();
  const on = (id: string) => overrides[id] !== false;

  return (
    <div className="homepage-content-stream">
      {/* 1. Hero Banner */}
      {on('hero') && <HeroBanner />}

      {/* 2. Path Selector */}
      {on('pathSelector') && <PathSelector />}

      {/* 3. Featured Product Showcase */}
      {on('featuredShowcase') && (
        <FeaturedProductShowcase products={products} totalCount={totalCount} />
      )}

      {/* 4. Brand Families */}
      {on('brandFamilies') && <BrandFamilyRail />}

      {/* 5. Category & Concern Quick-Nav */}
      {on('concernsNav') && <CategoryConcernNav />}

      {/* 5.1 Interactive Skin Consultation & Diagnostic Regimen Finder */}
      {on('skinFinder') && <SkinRegimenFinderWidget />}

      {/* 5.2 Dynamic Popular Clinical Recommendations */}
      {on('productRail') && (
        <section className="dynamic-rail-container">
          <ProductRail
            endpoint="/v1/recommendations/popular?limit=6"
            titleFa="پروتکل‌های محبوب و پرطرفدار بالینی"
          />
        </section>
      )}

      {/* 6. Science Behind Innovation */}
      {on('scienceSpotlight') && <ScienceMechanismSpotlight />}

      {/* 6.1 Interactive Bohr Effect Oxygenation Simulator */}
      {on('bohrSimulator') && <BohrOxygenationSimulator />}

      {/* 6.2 Interactive Before & After Visia Trial Comparison Slider */}
      {on('visiaSlider') && <VisiaTrialComparisonSlider />}

      {/* 7. Clinical Protocols & Usage Guides */}
      {on('clinicalGuides') && <AcademyGuides />}

      {/* 8. Trust, Credibility & Clinical Testimonials */}
      {on('clinicalResults') && <ClinicalResultsTestimonials />}
      {on('trustBar') && <TrustCredibilityBar />}

      {/* 9. Newsletter & VIP Membership */}
      {on('newsletter') && <NewsletterVip />}
    </div>
  );
}
