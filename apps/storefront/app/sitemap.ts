import type { MetadataRoute } from 'next';
import { DEMO_PRODUCT_SLUGS } from '../lib/catalog';
import { BLOG_POSTS } from '../lib/blog';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/legal`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const productEntries: MetadataRoute.Sitemap = DEMO_PRODUCT_SLUGS.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries];
}
