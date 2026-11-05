import { listProducts } from '../lib/catalog';
import { StorefrontSectionsWrapper } from '../components/home/StorefrontSectionsWrapper';
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
          'پلتفرم رسمی فرمولاسیون‌های تخصصی مراقبت پوست دکتر درمر انگلستان؛ سیستم کربوکسی‌تراپی پیشرفته (CarboxyGel)، فرمولاسیون درموسوتیکال و پروتکل‌های بالینی پوست.',
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
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      {/* Dynamic Client-Managed Sections Stream */}
      <StorefrontSectionsWrapper products={products} totalCount={catalog?.meta?.count} />
    </>
  );
}
