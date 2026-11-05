import { test, expect } from '@playwright/test';

test('Verify complete desktop menu open/close and click interactions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.locator('.subnav-dropdown-trigger').first().waitFor({ state: 'visible' });

  const triggers = page.locator('.subnav-dropdown-trigger');
  expect(await triggers.count()).toBe(4);

  // Test Tier 1: Products
  const productsBtn = triggers.nth(0).locator('button.subnav-link');
  await productsBtn.click();
  await page.waitForTimeout(200);
  const megaMenu1 = triggers.nth(0).locator('.subnav-mega-menu');
  await expect(megaMenu1).toBeVisible();

  // Clicking another trigger (Tier 2: Concerns) should switch menu
  const concernsBtn = triggers.nth(1).locator('button.subnav-link');
  await concernsBtn.click();
  await page.waitForTimeout(200);
  await expect(megaMenu1).not.toBeVisible();
  const concernsMenu = triggers.nth(1).locator('.subnav-dropdown-menu');
  await expect(concernsMenu).toBeVisible();

  // Clicking outside should close it
  await page.click('body', { position: { x: 50, y: 500 } });
  await page.waitForTimeout(200);
  await expect(concernsMenu).not.toBeVisible();

  // Test Tier 3: Science
  const scienceBtn = triggers.nth(2).locator('button.subnav-link');
  await scienceBtn.click();
  await page.waitForTimeout(200);
  const scienceMenu = triggers.nth(2).locator('.subnav-mega-menu');
  await expect(scienceMenu).toBeVisible();
  const sciBox = await scienceMenu.boundingBox();
  expect(sciBox!.x).toBeGreaterThanOrEqual(0);
  expect(sciBox!.x + sciBox!.width).toBeLessThanOrEqual(1440);

  // Press ESC to close
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await expect(scienceMenu).not.toBeVisible();
});

test('Verify mobile drawer open, accordion toggle, and close', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.locator('button.mobile-menu-toggle').waitFor({ state: 'visible' });

  // Open drawer
  const toggleBtn = page.locator('button.mobile-menu-toggle');
  await expect(toggleBtn).toBeVisible();
  await toggleBtn.click();
  await page.waitForTimeout(300);

  const drawer = page.locator('.mobile-drawer-container');
  await expect(drawer).toBeVisible();

  // Verify section 1 is open by default
  const section1Body = page.locator('.drawer-section-body').first();
  await expect(section1Body).toBeVisible();

  // Toggle section 2 (Concerns)
  const section2Btn = page.locator('button.drawer-section-btn').nth(1);
  await section2Btn.click();
  await page.waitForTimeout(200);
  const linkInSec2 = page.locator('.drawer-section-body a[href*="کربوکسی"]').first();
  await expect(linkInSec2).toBeVisible();

  // Close drawer via close button
  const closeBtn = page.locator('button.drawer-close-btn');
  await closeBtn.click();
  await page.waitForTimeout(300);
  await expect(drawer).not.toBeVisible();
});
