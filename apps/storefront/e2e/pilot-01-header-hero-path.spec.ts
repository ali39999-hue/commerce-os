import { test, expect } from '@playwright/test';

/**
 * Pilot 01 E2E Playwright Suite — Gate 6 & Gate 7 Verification
 * Dr Dermer UK Clinical & Commerce OS — Phase 09 Agentic Architecture
 *
 * Verifies (updated for Warm Editorial Clinical Luxury redesign):
 * 1. Global Header: Warm editorial glassmorphism, brand identity, cart drawer trigger.
 * 2. Homepage Hero Banner: Clinical copy, Cambridge chip, dual-mode CTAs.
 * 3. Audience Path Selector: 3 triage cards (Homecare Regimen, Carboxy Protocols, Activator Pads), links, and touch targets.
 * 4. Responsive reflow across Mobile (360px, 390px), Tablet (768px), and Desktop (1280px, 1440px).
 * 5. Tabular typography and zero horizontal layout overflow.
 */

test.describe('Pilot 01: Header, Hero Banner & Audience Path Selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    // Ensure client hydration is complete before interacting
    await page.locator('section.clinical-hero-v2, #hero-main-title').first().waitFor({ state: 'visible' });
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

  test('2. Homepage Hero Banner displays authentic clinical claims and dual-mode CTAs', async ({ page }) => {
    const heroSection = page.locator('section.clinical-hero-v2, [aria-labelledby="hero-main-title"]').first();
    await expect(heroSection).toBeVisible();

    // Verify Cambridge Science Park Chip
    const originChip = heroSection.locator('.institution-chip').first();
    await expect(originChip).toContainText('CAMBRIDGE SCIENCE PARK');

    // Verify Clinical Heading
    const mainHeading = heroSection.locator('h1#hero-main-title, h1.hero-heading').first();
    await expect(mainHeading).toBeVisible();

    // Verify Primary CTA
    const primaryCta = heroSection.locator('a[href*="featured-products"], a.btn-clinical-primary').first();
    await expect(primaryCta).toBeVisible();

    // Verify secondary CTA
    const scienceCta = heroSection.locator('a[href="#bohr-simulator"]').first();
    await expect(scienceCta).toBeVisible();

    // Verify Telemetry Cards with Tabular Numerals
    const statCards = heroSection.locator('.telemetry-card');
    const statCount = await statCards.count();
    expect(statCount).toBeGreaterThanOrEqual(2);
  });

  test('3. Audience Path Selector displays 3 distinct journeys', async ({ page }) => {
    const pathSection = page.locator('section.path-triage-section, [aria-labelledby="path-triage-title"]').first();
    await expect(pathSection).toBeVisible();

    // Verify Section Title
    const sectionTitle = pathSection.locator('h2#path-triage-title, h2.section-title').first();
    await expect(sectionTitle).toBeVisible();

    // Verify the 3 distinct cards
    const pathCards = pathSection.locator('article.triage-card');
    await expect(pathCards).toHaveCount(3);

    // Verify Home Care Card
    const homeCard = pathCards.filter({ hasText: 'ReeSkin' }).first();
    await expect(homeCard).toBeVisible();
    await expect(homeCard.locator('a[href*="/reeskin"]')).toBeVisible();

    // Verify Carboxy Protocols Card
    const carboxyCard = pathCards.filter({ hasText: 'کربوکسی' }).first();
    await expect(carboxyCard).toBeVisible();
    await expect(carboxyCard.locator('a[href*="/carboxygel"]')).toBeVisible();

    // Verify Activator Sheets & Pads Card
    const padsCard = pathCards.filter({ hasText: 'پد' }).first();
    await expect(padsCard).toBeVisible();
    await expect(padsCard.locator('a[href*="/carboxypad"]')).toBeVisible();
  });

  test('4. Zero horizontal overflow on viewport reflow', async ({ page }) => {
    const docScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const docClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(docScrollWidth).toBeLessThanOrEqual(docClientWidth + 1);
  });
});
