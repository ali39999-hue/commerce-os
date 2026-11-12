import type { Metadata } from 'next';
import { BLOG_POSTS, BlogPost } from '../../lib/blog';
import { ClinicalArticlesExplorer } from '../../components/rupak-articles/clinical-articles-explorer';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drdermer.ir').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'کتابخانه علمی و تازه‌ترین مقالات بالینی | Dr. Dermer UK Clinical Laboratories',
  description: 'مقالات تخصصی بالینی درماتولوژی، پروتکل‌های درمانی، مقایسه ترکیبات پپتیدی، اثر بوهر و ترمیم سد دفاعی پوست بر پایه شواهد پزشکی.',
  alternates: {
    canonical: '/blog',
  },
};

// Priority list to match the user's reference layout
const FEATURED_SLUG_ORDER = [
  'clinical-skincare-selection-guide',
  'signal-peptides-vs-copper-peptides',
  'skin-barrier-restoration-post-procedure',
  'protocol-hyperpigmentation-retinol-niacinamide',
  'bohr-effect-carboxy-therapy-needle-free',
  'hormonal-acne-management-maintenance',
  'superficial-chemical-peels-dark-skin',
  'photodermatosis-next-gen-uv-filters',
];

export default function BlogIndexPage() {
  // Sort posts with the 8 featured articles in exact reference order, followed by other posts
  const orderedPosts: BlogPost[] = [
    ...FEATURED_SLUG_ORDER.map((slug) => BLOG_POSTS.find((p) => p.slug === slug)).filter(
      (p): p is BlogPost => Boolean(p)
    ),
    ...BLOG_POSTS.filter((p) => !FEATURED_SLUG_ORDER.includes(p.slug)),
  ];

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/blog#blog`,
        name: 'کتابخانه علمی و پایگاه مقالات بالینی دکتر درمر',
        description: 'مقالات تخصصی و بالینی درماتولوژی، راهنماهای خرید آگاهانه، بررسی ترکیبات و پروتکل‌های ترمیم پوست.',
        url: `${SITE_URL}/blog`,
        publisher: {
          '@type': 'MedicalBusiness',
          name: 'دکتر درمر | Dr. Dermer UK Clinical Laboratories',
          url: SITE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/blog#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'صفحه اصلی', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'کتابخانه علمی و مقالات بالینی', item: `${SITE_URL}/blog` },
        ],
      },
    ],
  };

  return (
    <>
      {/* ── JSON-LD Structured Data (Blog, BreadcrumbList) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <ClinicalArticlesExplorer initialPosts={orderedPosts} />
    </>
  );
}
