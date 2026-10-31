import type { MetadataRoute } from 'next';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drdermer.ir').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/blog',
          '/blog/*',
          '/academy',
          '/academy/*',
          '/ingredients',
          '/b2b',
          '/b2b/*',
          '/about',
          '/contact',
          '/faq',
          '/legal',
          '/vendors',
          '/vendors/*',
          '/search',
        ],
        disallow: [
          '/cart',
          '/checkout',
          '/account',
          '/account/*',
          '/order',
          '/order/*',
          '/pay',
          '/pay/*',
          '/api/*',
          '/*?*preview=*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/cart',
          '/checkout',
          '/account',
          '/account/*',
          '/order',
          '/order/*',
          '/pay',
          '/pay/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}

