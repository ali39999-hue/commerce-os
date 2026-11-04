import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Import chromium from storefront's playwright
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('../apps/storefront/node_modules/@playwright/test');

const SCREENSHOT_DIR = path.resolve(ROOT_DIR, 'screenshots');

const STOREFRONT_PAGES = [
  { name: '01-home', path: '/' },
  { name: '02-about', path: '/about' },
  { name: '03-academy', path: '/academy' },
  { name: '04-account', path: '/account' },
  { name: '05-b2b', path: '/b2b' },
  { name: '06-b2b-protocols', path: '/b2b/protocols' },
  { name: '07-b2b-workshops', path: '/b2b/workshops' },
  { name: '08-blog-index', path: '/blog' },
  { name: '09-blog-bohr-effect', path: '/blog/bohr-effect-carboxy-therapy-needle-free' },
  { name: '10-blog-hyperpigmentation', path: '/blog/protocol-hyperpigmentation-retinol-niacinamide' },
  { name: '11-blog-skin-barrier', path: '/blog/skin-barrier-restoration-post-procedure' },
  { name: '12-blog-signal-peptides', path: '/blog/signal-peptides-vs-copper-peptides' },
  { name: '13-blog-skincare-selection', path: '/blog/clinical-skincare-selection-guide' },
  { name: '14-blog-shipping-guide', path: '/blog/sharayet-tahvil-pishtaz-tipax' },
  { name: '15-blog-payment-security', path: '/blog/paydar-pardakht-shaparak-amniat' },
  { name: '16-blog-cellular-renewal', path: '/blog/protocol-7-days-cellular-renewal' },
  { name: '17-blog-retinol-layering', path: '/blog/retinol-and-hyaluronic-acid-layering' },
  { name: '18-blog-post-laser', path: '/blog/post-laser-recovery-reemed-clinical' },
  { name: '19-blog-microdermabrasion', path: '/blog/microdermabrasion-alumina-vs-standard-scrub' },
  { name: '20-blog-cold-plasma', path: '/blog/cold-atmospheric-plasma-in-acne-wound-healing' },
  { name: '21-blog-transdermal-delivery', path: '/blog/transdermal-cosmeceutical-delivery-systems' },
  { name: '22-hardware-carbox', path: '/carbox' },
  { name: '23-hardware-plasmax', path: '/plasmax' },
  { name: '24-product-carboxygel', path: '/carboxygel' },
  { name: '25-product-carboxypod', path: '/carboxypod' },
  { name: '26-product-carboxypad', path: '/carboxypad' },
  { name: '27-product-crystalene', path: '/crystalene' },
  { name: '28-product-healene', path: '/healene' },
  { name: '29-product-silicalene', path: '/silicalene' },
  { name: '30-line-reeskin', path: '/reeskin' },
  { name: '31-line-reemed', path: '/reemed' },
  { name: '32-cart', path: '/cart' },
  { name: '33-checkout', path: '/checkout' },
  { name: '34-compare', path: '/compare' },
  { name: '35-contact', path: '/contact' },
  { name: '36-faq', path: '/faq' },
  { name: '37-ingredients-inci', path: '/ingredients' },
  { name: '38-legal', path: '/legal' },
  { name: '39-search', path: '/search' },
  { name: '40-subscriptions', path: '/subscriptions' },
  { name: '41-wishlist', path: '/wishlist' },
  { name: '42-vendors-index', path: '/vendors' },
  { name: '43-vendor-drdermer-clinic', path: '/vendors/drdermer-clinic' },
  { name: '44-vendor-derm-lab', path: '/vendors/derm-lab-partner' },
  { name: '45-order-detail', path: '/order/ORD-948210' },
  { name: '46-payment-intent', path: '/pay/intent_mock_123?orderNum=ORD-948210&method=CARD_TO_CARD&total=950,000' },
  { name: '47-pdp-carboxygel', path: '/products/carboxygel-professional-therapy' },
  { name: '48-pdp-carboxypod', path: '/products/carboxypod-activation-pads' },
  { name: '49-pdp-crystalene', path: '/products/crystalene' },
  { name: '50-pdp-healene', path: '/products/healene' },
  { name: '51-pdp-silicalene', path: '/products/silicalene' },
  { name: '52-pdp-carbox', path: '/products/carbox' },
  { name: '53-pdp-plasmax', path: '/products/plasmax' },
];

const ADMIN_TABS = [
  { tab: 'overview', name: '01-admin-overview' },
  { tab: 'orders', name: '02-admin-orders-receipts' },
  { tab: 'inventory', name: '03-admin-inventory-warehouse' },
  { tab: 'catalog', name: '04-admin-catalog-pim' },
  { tab: 'clinical', name: '05-admin-clinical-content' },
  { tab: 'coupons', name: '06-admin-coupons-promotions' },
  { tab: 'b2b', name: '07-admin-b2b-quotes' },
  { tab: 'subscriptions', name: '08-admin-subscriptions' },
  { tab: 'vendors', name: '09-admin-vendors' },
  { tab: 'digital', name: '10-admin-digital-licenses' },
  { tab: 'finance', name: '11-admin-finance-sepidar' },
  { tab: 'ops', name: '12-admin-ops-system-health' },
];

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}`, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(null));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function waitForServer(port, name, timeoutSec = 25) {
  console.log(`Waiting for ${name} on port ${port}...`);
  for (let i = 0; i < timeoutSec; i++) {
    const status = await checkPort(port);
    if (status) {
      console.log(`✓ ${name} is UP (HTTP ${status})`);
      return true;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Timeout waiting for ${name} on port ${port}`);
}

async function main() {
  fs.mkdirSync(path.join(SCREENSHOT_DIR, 'storefront', 'desktop'), { recursive: true });
  fs.mkdirSync(path.join(SCREENSHOT_DIR, 'storefront', 'mobile'), { recursive: true });
  fs.mkdirSync(path.join(SCREENSHOT_DIR, 'admin', 'desktop'), { recursive: true });

  console.log('--- 1. Launching Storefront Server (Port 3000) ---');
  const sfServer = spawn('pnpm', ['--filter', '@commerce-os/storefront', 'run', 'start', '-p', '3000'], {
    shell: true,
    stdio: 'ignore',
  });

  console.log('--- 2. Launching Admin ERP Server (Port 3001) ---');
  const adminServer = spawn('pnpm', ['--filter', '@commerce-os/admin', 'run', 'start', '-p', '3001'], {
    shell: true,
    stdio: 'ignore',
  });

  try {
    await waitForServer(3000, 'Storefront');
    await waitForServer(3001, 'Admin ERP');

    console.log('--- 3. Launching Chromium Browser ---');
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // ── STOREFRONT DESKTOP ──
    console.log('\n📸 Capturing Storefront Desktop (1440x900 full page)...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const desktopPage = await desktopContext.newPage();

    let sfDesktopCount = 0;
    for (const p of STOREFRONT_PAGES) {
      const url = `http://127.0.0.1:3000${p.path}`;
      const dest = path.join(SCREENSHOT_DIR, 'storefront', 'desktop', `${p.name}.png`);
      try {
        await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        await desktopPage.waitForTimeout(600);
        await desktopPage.screenshot({ path: dest, fullPage: true });
        sfDesktopCount++;
        process.stdout.write(`  [${sfDesktopCount}/${STOREFRONT_PAGES.length}] Desktop: ${p.name}\n`);
      } catch (err) {
        try {
          await desktopPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });
          await desktopPage.waitForTimeout(1000);
          await desktopPage.screenshot({ path: dest, fullPage: true });
          sfDesktopCount++;
          process.stdout.write(`  [${sfDesktopCount}/${STOREFRONT_PAGES.length}] (retry) Desktop: ${p.name}\n`);
        } catch (e) {
          console.error(`  ❌ Failed Desktop ${p.name}:`, e.message);
        }
      }
    }
    await desktopContext.close();

    // ── STOREFRONT MOBILE ──
    console.log('\n📱 Capturing Storefront Mobile (390x844 full page)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      deviceScaleFactor: 2,
    });
    const mobilePage = await mobileContext.newPage();

    let sfMobileCount = 0;
    for (const p of STOREFRONT_PAGES) {
      const url = `http://127.0.0.1:3000${p.path}`;
      const dest = path.join(SCREENSHOT_DIR, 'storefront', 'mobile', `${p.name}.png`);
      try {
        await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        await mobilePage.waitForTimeout(600);
        await mobilePage.screenshot({ path: dest, fullPage: true });
        sfMobileCount++;
        process.stdout.write(`  [${sfMobileCount}/${STOREFRONT_PAGES.length}] Mobile: ${p.name}\n`);
      } catch (err) {
        try {
          await mobilePage.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });
          await mobilePage.waitForTimeout(1000);
          await mobilePage.screenshot({ path: dest, fullPage: true });
          sfMobileCount++;
          process.stdout.write(`  [${sfMobileCount}/${STOREFRONT_PAGES.length}] (retry) Mobile: ${p.name}\n`);
        } catch (e) {
          console.error(`  ❌ Failed Mobile ${p.name}:`, e.message);
        }
      }
    }
    await mobileContext.close();

    // ── ADMIN ERP DESKTOP ──
    console.log('\n🖥️ Capturing Admin ERP Tabs (1440x900 full page)...');
    const adminContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const adminPage = await adminContext.newPage();
    await adminPage.goto('http://127.0.0.1:3001', { waitUntil: 'networkidle', timeout: 15000 });
    await adminPage.waitForTimeout(1000);

    let adminCount = 0;
    for (const item of ADMIN_TABS) {
      const dest = path.join(SCREENSHOT_DIR, 'admin', 'desktop', `${item.name}.png`);
      try {
        const buttons = adminPage.locator('aside.admin-sidebar nav button');
        const count = await buttons.count();
        for (let i = 0; i < count; i++) {
          const btn = buttons.nth(i);
          const btnText = await btn.innerText();
          if (
            (item.tab === 'overview' && btnText.includes('داشبورد')) ||
            (item.tab === 'orders' && btnText.includes('سفارشات')) ||
            (item.tab === 'inventory' && btnText.includes('انبار')) ||
            (item.tab === 'catalog' && btnText.includes('کاتالوگ')) ||
            (item.tab === 'clinical' && btnText.includes('بالینی')) ||
            (item.tab === 'coupons' && btnText.includes('کوپن')) ||
            (item.tab === 'b2b' && btnText.includes('B2B')) ||
            (item.tab === 'subscriptions' && btnText.includes('اشتراک')) ||
            (item.tab === 'vendors' && btnText.includes('فروشندگان')) ||
            (item.tab === 'digital' && btnText.includes('لایسنس')) ||
            (item.tab === 'finance' && btnText.includes('سپیدار')) ||
            (item.tab === 'ops' && btnText.includes('سلامت'))
          ) {
            await btn.click();
            break;
          }
        }
        await adminPage.waitForTimeout(600);
        await adminPage.screenshot({ path: dest, fullPage: true });
        adminCount++;
        process.stdout.write(`  [${adminCount}/${ADMIN_TABS.length}] Admin: ${item.name}\n`);
      } catch (err) {
        console.error(`  ❌ Failed Admin ${item.name}:`, err.message);
      }
    }
    await adminContext.close();
    await browser.close();

    console.log('\n🎉 All screenshots successfully captured!');
  } finally {
    console.log('--- Cleaning up background server processes ---');
    try {
      sfServer.kill();
      adminServer.kill();
    } catch {}
  }
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
