import { apiBase } from './catalog';

/**
 * Canonical homepage section ids in their fixed render order. The ERP
 * (apps/admin StorefrontSectionsManager) toggles these same ids; the render
 * order itself is owned by the homepage stream component, not by settings.
 */
export const HOMEPAGE_SECTIONS = [
  { id: 'hero', order: 1 },
  { id: 'pathSelector', order: 2 },
  { id: 'featuredShowcase', order: 3 },
  { id: 'brandFamilies', order: 4 },
  { id: 'concernsNav', order: 5 },
  { id: 'skinFinder', order: 6 },
  { id: 'productRail', order: 7 },
  { id: 'scienceSpotlight', order: 8 },
  { id: 'bohrSimulator', order: 9 },
  { id: 'visiaSlider', order: 10 },
  { id: 'clinicalGuides', order: 11 },
  { id: 'clinicalResults', order: 12 },
  { id: 'trustBar', order: 13 },
  { id: 'newsletter', order: 14 },
] as const;

export type HomepageSectionId = (typeof HOMEPAGE_SECTIONS)[number]['id'];

export type HomepageSectionOverrides = Record<string, boolean>;

type StorefrontSettingsResponse = {
  overrides?: unknown;
  source?: 'DB' | 'DEFAULT';
};

/**
 * Settings are an allow/deny layer over the homepage: every section is enabled
 * by default, and an override is meaningful only when it is exactly `false`.
 */
export function sanitizeHomepageSectionOverrides(value: unknown): HomepageSectionOverrides {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {};
  const overrides: HomepageSectionOverrides = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === 'boolean') overrides[key] = entry;
  }
  return overrides;
}

/**
 * Reads the ERP-published homepage section overrides. Mirrors the resilient
 * fetch style of catalog.ts: hard timeout, single attempt, and a silent
 * fallback to `{}` (all sections enabled) whenever the API is unreachable,
 * slow, or returns an unexpected payload — the homepage must never fail
 * because settings do.
 */
export async function fetchHomepageSectionOverrides(): Promise<HomepageSectionOverrides> {
  try {
    const response = await fetch(`${apiBase}/v1/settings/storefront`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) return {};
    const payload = (await response.json()) as StorefrontSettingsResponse;
    return sanitizeHomepageSectionOverrides(payload?.overrides);
  } catch {
    return {};
  }
}
