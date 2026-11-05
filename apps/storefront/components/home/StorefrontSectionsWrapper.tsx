'use client';

import React, { useEffect, useState } from 'react';
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

const STORAGE_KEY = 'commerce_os_homepage_sections_v1';

interface SectionConfig {
  id: string;
  enabled: boolean;
  order: number;
}

export function StorefrontSectionsWrapper({
  products,
  totalCount,
}: {
  products: Product[];
  totalCount?: number;
}) {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({
    hero: true,
    pathSelector: true,
    featuredShowcase: true,
    brandFamilies: true,
    concernsNav: true,
    skinFinder: true,
    productRail: true,
    scienceSpotlight: true,
    bohrSimulator: true,
    visiaSlider: true,
    academyGuides: true,
    clinicalResults: true,
    trustBar: true,
    newsletter: true,
  });

  useEffect(() => {
    const syncSections = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as SectionConfig[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            const nextMap: Record<string, boolean> = {};
            for (const item of parsed) {
              nextMap[item.id] = item.enabled;
            }
            setEnabledMap((prev) => ({ ...prev, ...nextMap }));
          }
        }
      } catch {
        // ignore JSON parse error in SSR or strict browser privacy
      }
    };

    syncSections();
    window.addEventListener('storage', syncSections);
    window.addEventListener('commerce_os_sections_changed', syncSections);
    return () => {
      window.removeEventListener('storage', syncSections);
      window.removeEventListener('commerce_os_sections_changed', syncSections);
    };
  }, []);

  return (
    <div className="homepage-content-stream">
      {/* 1. Hero Banner */}
      {enabledMap.hero !== false && <HeroBanner />}

      {/* 2. Path Selector */}
      {enabledMap.pathSelector !== false && <PathSelector />}

      {/* 3. Featured Product Showcase */}
      {enabledMap.featuredShowcase !== false && (
        <FeaturedProductShowcase products={products} totalCount={totalCount} />
      )}

      {/* 4. Brand Families */}
      {enabledMap.brandFamilies !== false && <BrandFamilyRail />}

      {/* 5. Category & Concern Quick-Nav */}
      {enabledMap.concernsNav !== false && <CategoryConcernNav />}

      {/* 5.1 Interactive Skin Consultation & Diagnostic Regimen Finder */}
      {enabledMap.skinFinder !== false && <SkinRegimenFinderWidget />}

      {/* 5.2 Dynamic Popular Clinical Recommendations */}
      {enabledMap.productRail !== false && (
        <section className="dynamic-rail-container">
          <ProductRail
            endpoint="/v1/recommendations/popular?limit=6"
            titleFa="پروتکل‌های محبوب و پرطرفدار بالینی"
          />
        </section>
      )}

      {/* 6. Science Behind Innovation */}
      {enabledMap.scienceSpotlight !== false && <ScienceMechanismSpotlight />}

      {/* 6.1 Interactive Bohr Effect Oxygenation Simulator */}
      {enabledMap.bohrSimulator !== false && <BohrOxygenationSimulator />}

      {/* 6.2 Interactive Before & After Visia Trial Comparison Slider */}
      {enabledMap.visiaSlider !== false && <VisiaTrialComparisonSlider />}

      {/* 7. Clinical Protocols & Usage Guides */}
      {enabledMap.academyGuides !== false && <AcademyGuides />}

      {/* 8. Trust, Credibility & Clinical Testimonials */}
      {enabledMap.clinicalResults !== false && <ClinicalResultsTestimonials />}
      {enabledMap.trustBar !== false && <TrustCredibilityBar />}

      {/* 9. Newsletter & VIP Membership */}
      {enabledMap.newsletter !== false && <NewsletterVip />}
    </div>
  );
}
