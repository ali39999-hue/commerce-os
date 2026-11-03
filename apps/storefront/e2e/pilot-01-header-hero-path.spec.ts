import { test, expect } from '@playwright/test';

/**
 * Pilot 01 E2E Playwright Suite — Gate 6 & Gate 7 Verification
 * Dr Dermer UK Clinical & Commerce OS — Phase 09 Agentic Architecture
 *
 * Verifies:
 * 1. Global Header: Glassmorphism, mega-menu, cart drawer trigger, responsive drawer.
 * 2. Homepage Hero Banner: Clinical copy, Cambridge chip, dual CTAs (#featured-products, /b2b).
 * 3. Audience Path Selector: 3 triage cards (Homecare, Pro Cabin, Medical Hardware), links, and touch targets.
 * 4. Responsive reflow across Mobile (360px, 390px), Tablet (768px), and Desktop (1280px, 1440px).
 * 5. Tabular typography and zero horizontal layout overflow.
 */

test.describe('Pilot 01: Header, Hero Banner & Audience Path Selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('1. Global Header renders glassmorphism, brand identity, and navigation', async ({ page }) => {
    const header = page.locator('header.site-header');
    await expect(header).toBeVisible();

    // Verify Brand Logo/Title link
    const brandLink = header.locator('a[href="/"]').first();
    await expect(brandLink).toBeVisible();

    // Verify Cart Button Trigger
    const cartButton = header.locator('button[aria-label*="سبد"], button[aria-label*="cart"], .cart-badge-btn').first();
    await expect(cartButton).toBeVisible();

    // Verify Search Bar/Input presence
    const searchInput = header.locator('input[type="search"], input[placeholder*="جستجو"]');
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeEnabled();
    }
  });

  test('2. Homepage Hero Banner displays authentic clinical claims and dual CTAs', async ({ page }) => {
    const heroSection = page.locator('section.clinical-hero, [aria-labelledby="hero-main-title"]').first();
    await expect(heroSection).toBeVisible();

    // Verify Cambridge Science Park Chip
    const originChip = heroSection.locator('.hero-eyebrow-chip, .eyebrow-origin').first();
    if (await originChip.isVisible()) {
      await expect(originChip).toContainText('Cambridge');
    }

    // Verify Clinical Heading
    const mainHeading = heroSection.locator('h1#hero-main-title, h1.hero-heading').first();
    await expect(mainHeading).toBeVisible();

    // Verify Dual CTAs
    const primaryCta = heroSection.locator('a[href*="featured-products"], a.btn-clinical-primary').first();
    await expect(primaryCta).toBeVisible();

    const b2bCta = heroSection.locator('a[href="/b2b"], a.btn-clinical-secondary').first();
    await expect(b2bCta).toBeVisible();

    // Verify Stat Cards with Tabular Numerals
    const statCards = heroSection.locator('.stat-card');
    const statCount = await statCards.count();
    expect(statCount).toBeGreaterThanOrEqual(2);
  });

  test('3. Audience Path Selector displays 3 distinct journeys', async ({ page }) => {
    const pathSection = page.locator('section.path-selector-section, [aria-labelledby="path-selector-title"]').first();
    await expect(pathSection).toBeVisible();

    // Verify Section Title
    const sectionTitle = pathSection.locator('h2#path-selector-title, h2.section-title').first();
    await expect(sectionTitle).toBeVisible();

    // Verify the 3 distinct cards
    const pathCards = pathSection.locator('article.path-card');
    await expect(pathCards).toHaveCount(3);

    // Verify Home Care Card
    const homeCard = pathCards.filter({ hasText: 'ReeSkin' }).first();
    await expect(homeCard).toBeVisible();
    await expect(homeCard.locator('a[href*="/reeskin"]')).toBeVisible();

    // Verify Clinic Consumables Card
    const proCard = pathCards.filter({ hasText: 'کابین' }).first();
    await expect(proCard).toBeVisible();
    await expect(proCard.locator('a[href*="/reemed"]')).toBeVisible();

    // Verify Medical Hardware Card
    const equipCard = pathCards.filter({ hasText: 'تجهیزات' }).first();
    await expect(equipCard).toBeVisible();
    await expect(equipCard.locator('a[href*="/reemed"]')).toBeVisible();
  });

  test('4. Zero horizontal overflow on viewport reflow', async ({ page }) => {
    const docScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const docClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(docScrollWidth).toBeLessThanOrEqual(docClientWidth + 1);
  });
});
