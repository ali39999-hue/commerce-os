# PLAYWRIGHT_PLAN.md — End-to-End Browser Testing Architecture
# Dr Dermer UK Clinical & Commerce OS
# Architecture Standard: E2E Playwright Test Suite, Viewports & Critical Path Automation

> **Core Standard**: End-to-end browser tests must validate authentic user journeys across all 43 routes, testing state transitions, financial transactions, Persian form validations, and responsive physics.
> **Anti-Slop Invariant**: Tests must not rely on fragile CSS selectors, arbitrary timeouts (`page.waitForTimeout()`), or bypassed business logic. All assertions target user-facing roles and text.

---

## 1. Test Suite Taxonomy & Coverage Matrix

```
+----------------------------------------------------------------------------------------------------+
|                                    PLAYWRIGHT E2E SUITE STRUCTURE                                  |
+----------------------------------------------------------------------------------------------------+
  1. e2e/critical-path/    --> Patient Checkout, B2B Proforma Quote, Doctor CME Certification
  2. e2e/interactions/     --> 360 Canvas Scrubber, Bohr Effect Simulator, Filter Accordions
  3. e2e/forms/            --> Iranian 09xx Phone, National ID Modulo-11, Postal Code Lookup
  4. e2e/a11y/             --> Automated Axe Core WCAG 2.2 AA Audits across all 43 routes
  5. e2e/resilience/       --> Offline Network Disconnect, Gateway Timeout Rollback, 404 Recovery
```

---

## 2. Playwright Configuration Architecture

File: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 45000,
  expect: { timeout: 8000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/test-results.json' }],
    ['list']
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'fa-IR',
    timezoneId: 'Asia/Tehran',
  },
  projects: [
    {
      name: 'Mobile Chrome (Pixel 5)',
      use: { ...devices['Pixel 5'], viewport: { width: 375, height: 812 } },
    },
    {
      name: 'Mobile Safari (iPhone 14)',
      use: { ...devices['iPhone 14'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'Tablet (iPad Gen 9)',
      use: { ...devices['iPad (gen 9)'], viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'Desktop Chrome High-Res',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
});
```

---

## 3. High-Priority E2E Test Specifications

### 3.1 Patient Home Care: PDP to Checkout & Shaparak Handoff
- **Test File**: `e2e/critical-path/patient-checkout.spec.ts`
- **Actions**:
  1. Navigate to `/products/reeskin-kit`.
  2. Verify 360 canvas renders frame 1 and enables pointer drag.
  3. Drag `BohrSlider` from pH 5.2 to pH 5.6; assert tissue oxygenation metric increases from 42% to 88%.
  4. Tap "افزودن به سبد خرید" (`role="button"`, name="افزودن به سبد خرید").
  5. Assert cart drawer slides into view; verify Subtotal in Rials matches BigInt math.
  6. Tap "تکمیل خرید و پرداخت"; navigate to `/checkout`.
  7. Fill National ID with invalid checksum (`0012345679`); assert error message "رقم کنترلی کد ملی همخوانی ندارد".
  8. Enter valid National ID (`0012345678`) and Mobile (`09121234567`).
  9. Select "درگاه بانکی سامان / ملت" and submit.
  10. Intercept POST `/api/payments/intent`; assert Idempotency Key header exists and returns valid gateway redirect URL.

### 3.2 B2B Clinic Hardware: Proforma Quote Generation
- **Test File**: `e2e/critical-path/b2b-quote.spec.ts`
- **Actions**:
  1. Navigate to `/b2b`.
  2. Select Carbox Medical System with 10 consumable packs.
  3. Assert tiered discount rule automatically applies 12% discount to consumables line item.
  4. Submit Iranian Legal Entity Form with National Company ID (`شناسه ملی حقوقی`).
  5. Assert PDF proforma generator produces valid legal document with 10% official VAT breakdown.

### 3.3 Doctor CME Certification: Credential Check & LMS Grant
- **Test File**: `e2e/critical-path/cme-certification.spec.ts`
- **Actions**:
  1. Navigate to `/academy/microplasma`.
  2. Submit Medical Council License Number (`148920`).
  3. Verify verified doctor badge unlocks digital curriculum video player.
  4. Complete 5-question clinical assessment; submit answers.
  5. Assert score >= 85% issues verifiable cryptographic certificate with URL QR code.

---

## 4. Accessibility Testing Suite (Axe Core)

File: `e2e/a11y/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES_TO_AUDIT = [
  '/',
  '/c/reeskin',
  '/products/reeskin-kit',
  '/b2b',
  '/academy',
  '/checkout',
  '/about',
  '/not-found'
];

for (const route of ROUTES_TO_AUDIT) {
  test(`WCAG 2.2 AA Accessibility Audit on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .disableRules(['color-contrast-enhanced']) // targeting standard 4.5:1 AA
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}
```

---

## 5. Execution & CI Integration Gates

1. **Pre-Commit / Local Test Command**:
   ```bash
   pnpm exec playwright test --project="Desktop Chrome High-Res"
   ```
2. **Full CI Matrix Command**:
   ```bash
   pnpm exec playwright test
   ```
3. **Artifact Retention**: On any test failure, Playwright automatically saves full-page screenshots, execution trace (`trace.zip`), and failure video to `playwright-report/`.
