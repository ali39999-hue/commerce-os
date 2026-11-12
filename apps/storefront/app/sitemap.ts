import type { MetadataRoute } from 'next';
import { listProducts } from '../lib/catalog';
import { BLOG_POSTS } from '../lib/blog';
import { INGREDIENT_ENCYCLOPEDIA } from '../lib/ingredients';

export const dynamic = 'force-dynamic';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drdermer.ir').replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const institutionalEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/legal`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/search`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/vendors`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/reeskin`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/reemed`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/carbox`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/plasmax`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/carboxygel`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/carboxypod`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/carboxypad`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/crystalene`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/healene`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/silicalene`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
  ];

  const b2bEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/b2b`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/b2b/protocols`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/b2b/workshops`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
  ];

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

  const ingredientBaseEntry: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ingredients`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
  ];

  const ingredientEntries: MetadataRoute.Sitemap = INGREDIENT_ENCYCLOPEDIA.map((ing) => ({
    url: `${BASE_URL}/ingredients#${ing.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const catalog = await listProducts({ limit: 100 });
  const productEntries: MetadataRoute.Sitemap = (catalog?.data ?? []).map((p) => ({
    url: `${BASE_URL}/products/${encodeURIComponent(p.slug)}`,
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
