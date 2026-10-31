import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '../../../lib/catalog';
import { buildExtendedProductData } from '../../../lib/pdp-data';
import { PdpInteractiveSection } from '../../../components/pdp/pdp-interactive-section';
import { ProductReviews } from '../../../components/product-reviews';
import { ProductRail } from '../../../components/discovery/product-rail';
import { DigitalBadge } from '../../../components/discovery/digital-badge';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

type ProductExtras = { kind?: string; vendor?: { slug?: string; titleFa?: string } | null };

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drdermer.ir').replace(/\/$/, '');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return {
      title: 'محصول یافت نشد | دکتر درمر',
      description: 'کالای مورد نظر در کاتالوگ فروشگاه موجود نمی‌باشد.',
    };
  }

  const extended = buildExtendedProductData(product);
  const primaryMedia = extended.media[0];

  return {
    title: extended.title,
    description: extended.description ?? extended.subtitleFa,
    alternates: {
      canonical: `/products/${encodeURIComponent(product.slug)}`,
    },
    openGraph: {
      title: `${extended.title} | ${extended.brand.name}`,
      description: extended.description ?? extended.subtitleFa,
      url: `${SITE_URL}/products/${encodeURIComponent(product.slug)}`,
      siteName: 'دکتر درمر | Dr Dermer Clinical Skin & Health',
      locale: 'fa_IR',
      type: 'website',
      images: primaryMedia?.url
        ? [
            {
              url: primaryMedia.url,
              alt: primaryMedia.altText,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: extended.title,
      description: extended.description ?? extended.subtitleFa,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const extras = product as typeof product & ProductExtras;
  const isDigital = extras.kind === 'DIGITAL';
  const vendorTitleFa = typeof extras.vendor?.titleFa === 'string' ? extras.vendor.titleFa : '';
  const vendorSlug = typeof extras.vendor?.slug === 'string' ? extras.vendor.slug : '';

  const extendedData = buildExtendedProductData(product);
  const primaryVariant = extendedData.variants[0];

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: extendedData.title,
    description: extendedData.description ?? extendedData.subtitleFa,
    sku: primaryVariant?.sku,
    image: extendedData.media.map((m) => m.url).filter(Boolean),
    brand: {
      '@type': 'Brand',
      name: extendedData.brand.name,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: primaryVariant?.priceAmount,
      priceValidUntil: '2027-12-31',
      availability: primaryVariant?.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${SITE_URL}/products/${encodeURIComponent(product.slug)}`,
      seller: {
        '@type': 'Organization',
        name: 'دکتر درمر | Dr Dermer Clinical Skin & Health',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: extendedData.ratingSummary.ratingValue,
      reviewCount: extendedData.ratingSummary.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'صفحه اصلی', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'محصولات و کاتالوگ', item: `${SITE_URL}/search` },
      { '@type': 'ListItem', position: 3, name: extendedData.title },
    ],
  };

  return (
    <div className="product-detail-container">
      {/* Structured Data (JSON-LD Product, Offer, AggregateRating, BreadcrumbList) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Accessible Breadcrumbs Navigation */}
      <nav className="breadcrumbs-nav" aria-label="موقعیت فعلی در سایت">
        <Link href="/">صفحه اصلی</Link>
        <span aria-hidden="true">/</span>
        <Link href="/search">محصولات و تجهیزات</Link>
        <span aria-hidden="true">/</span>
        <span className="current-crumb" aria-current="page">{extendedData.title}</span>
      </nav>

      {isDigital && (
        <div className="pdp-digital-badge-banner">
          <DigitalBadge />
        </div>
      )}

      {/* Interactive PDP Section: Gallery, Variant Selector, Pricing, Add-to-Cart & Tabs */}
      <PdpInteractiveSection
        productData={extendedData}
        isDigital={isDigital}
        vendorTitleFa={vendorTitleFa}
        vendorSlug={vendorSlug}
        reviewsElement={
          <ProductReviews slug={product.slug} productTitle={extendedData.title} />
        }
      />

      {/* Recommended & Related Skincare Rail */}
      <div className="pdp-rail-container">
        <ProductRail
          endpoint={`/recommendations/products/${product.id}?limit=6`}
          titleFa="محصولات مکمل و پروتکل‌های مرتبط"
        />
      </div>
    </div>
  );
}
