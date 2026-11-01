import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('WCAG 2.2 Level AA Accessibility Audits', () => {
  const routesToAudit = [
    { path: '/', name: 'Homepage' },
    { path: '/carboxygel', name: 'CarboxyGel' },
    { path: '/carbox', name: 'CarboX 360 Station' },
    { path: '/plasmax', name: 'PlasmaX 360 Device' },
    { path: '/cart', name: 'Cart' },
    { path: '/checkout', name: 'Checkout' },
    { path: '/search', name: 'Search' },
    { path: '/ingredients', name: 'Ingredients INCI' },
    { path: '/b2b', name: 'B2B Portal' },
    { path: '/about', name: 'About Laboratories' },
    { path: '/faq', name: 'Clinical FAQ' },
  ];

  for (const r of routesToAudit) {
    test(`audit ${r.name} (${r.path}) for serious/critical accessibility violations`, async ({ page }) => {
      await page.goto(r.path);
      // Wait for dynamic hydration
      await page.waitForTimeout(500);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Filter critical and serious violations
      const severeViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      expect(severeViolations).toEqual([]);
    });
  }
});
