import type { MetadataRoute } from 'next';
import { DEMO_PRODUCT_SLUGS } from '../lib/catalog';
import { BLOG_POSTS } from '../lib/blog';
import { INGREDIENT_ENCYCLOPEDIA } from '../lib/ingredients';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drdermer.ir').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // 1. Institutional, Legal & Brand Core Pages
  const institutionalEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/legal`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/search`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/vendors`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // 2. B2B & Clinical Professional Protocols
  const b2bEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/b2b`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/b2b/protocols`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/b2b/workshops`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // 3. Educational & Editorial (Academy & Blog Articles)
  const academyEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/academy`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt || lastModified),
    changeFrequency: 'monthly',
    priority: post.isPeerReviewed ? 0.85 : 0.7,
  }));

  // 4. Active Ingredients Encyclopedia & Standards (INCI)
  const ingredientBaseEntry: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ingredients`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
  ];

  const ingredientEntries: MetadataRoute.Sitemap = INGREDIENT_ENCYCLOPEDIA.map((ing) => ({
    url: `${BASE_URL}/ingredients#${ing.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // 5. Products & Medical Equipment Catalog
  const productEntries: MetadataRoute.Sitemap = DEMO_PRODUCT_SLUGS.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    ...institutionalEntries,
    ...b2bEntries,
    ...academyEntries,
    ...blogEntries,
    ...ingredientBaseEntry,
    ...ingredientEntries,
    ...productEntries,
  ];
}

