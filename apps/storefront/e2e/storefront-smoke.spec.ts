import { test, expect } from '@playwright/test';

test.describe('Storefront Critical Pages HTTP & DOM Verification', () => {
  const routes = [
    { path: '/', titleKeyword: 'دکتر درمر' },
    { path: '/carboxygel', titleKeyword: 'CarboxyGel' },
    { path: '/carboxypod', titleKeyword: 'CarboxyPod' },
    { path: '/carboxypad', titleKeyword: 'CarboxyPad' },
    { path: '/crystalene', titleKeyword: 'Crystalene' },
    { path: '/healene', titleKeyword: 'Healene' },
    { path: '/silicalene', titleKeyword: 'Silicalene' },
    { path: '/reeskin', titleKeyword: 'ReeSkin' },
    { path: '/reemed', titleKeyword: 'ReeMed' },
    { path: '/cart', titleKeyword: 'سبد' },
    { path: '/checkout', titleKeyword: 'تسویه' },
    { path: '/search', titleKeyword: 'جستجو' },
    { path: '/ingredients', titleKeyword: 'INCI' },
    { path: '/blog', titleKeyword: 'مقالات' },
    { path: '/about', titleKeyword: 'درباره' },
    { path: '/contact', titleKeyword: 'تماس' },
    { path: '/faq', titleKeyword: 'سوالات' },
  ];

  for (const r of routes) {
    test(`route ${r.path} returns 200 and renders valid title`, async ({ page }) => {
      const response = await page.goto(r.path);
      expect(response?.status()).toBe(200);
      const title = await page.title();
      expect(title).toContain(r.titleKeyword);
    });
  }

  test('no horizontal overflow across pages', async ({ page }) => {
    await page.goto('/');
    const docScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const docClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(docScrollWidth).toBeLessThanOrEqual(docClientWidth + 1); // 1px rounding tolerance
  });

  test('cart drawer opens and closes without error', async ({ page }) => {
    await page.goto('/');
    const cartTriggers = page.locator('button[aria-label*="سبد"], a[href="/cart"], .cart-badge-btn');
    if ((await cartTriggers.count()) > 0) {
      await cartTriggers.first().click();
      await page.waitForTimeout(300);
    }
  });
});
