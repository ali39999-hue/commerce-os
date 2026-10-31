import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
dotenv.config({ path: '.env', override: false });
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { CHART_OF_ACCOUNTS } from '@commerce-os/finance';

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Demo seed is disabled in production.');
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required.');
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('🌱 Starting comprehensive Commerce OS database seeding...');

    // 1. Tenant, Organization, Store
    const tenant = await prisma.tenant.upsert({
      where: { slug: 'demo-tenant' },
      update: { name: 'مستأجر آزمایشی کامرس او اس' },
      create: { slug: 'demo-tenant', name: 'مستأجر آزمایشی کامرس او اس' },
    });

    const organization = await prisma.organization.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: 'demo-org' } },
      update: { name: 'سازمان مرکزی تجارت' },
      create: { tenantId: tenant.id, slug: 'demo-org', name: 'سازمان مرکزی تجارت' },
    });

    const store = await prisma.store.upsert({
      where: { slug: 'demo' },
      update: {
        tenantId: tenant.id,
        organizationId: organization.id,
        name: 'فروشگاه مدرن بازارک',
        defaultCurrency: 'IRR',
      },
      create: {
        tenantId: tenant.id,
        organizationId: organization.id,
        slug: 'demo',
        name: 'فروشگاه مدرن بازارک',
        defaultCurrency: 'IRR',
      },
    });

    // 2. Users & RBAC
    const adminUser = await prisma.user.upsert({
      where: { phone: '09121111111' },
      update: { role: 'SUPER_ADMIN', fullName: 'مدیر ارشد سیستم' },
      create: {
        tenantId: tenant.id,
        phone: '09121111111',
        email: 'admin@commerce-os.local',
        fullName: 'مدیر ارشد سیستم',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    const operatorUser = await prisma.user.upsert({
      where: { phone: '09122222222' },
      update: { role: 'OPERATOR', fullName: 'اپراتور انبار و ارسال' },
      create: {
        tenantId: tenant.id,
        phone: '09122222222',
        email: 'operator@commerce-os.local',
        fullName: 'اپراتور انبار و ارسال',
        role: 'OPERATOR',
        isActive: true,
      },
    });

    const demoCustomer = await prisma.user.upsert({
      where: { phone: '09123333333' },
      update: { role: 'CUSTOMER', fullName: 'علی علوی' },
      create: {
        tenantId: tenant.id,
        phone: '09123333333',
        fullName: 'علی علوی',
        role: 'CUSTOMER',
        nationalId: '0010312013',
        isActive: true,
      },
    });

    // 3. User Wallet
    await prisma.wallet.upsert({
      where: { tenantId_userId_currency: { tenantId: tenant.id, userId: demoCustomer.id, currency: 'IRR' } },
      update: { balance: '50000000' }, // 5,000,000 Tomans
      create: {
        tenantId: tenant.id,
        userId: demoCustomer.id,
        balance: '50000000',
        currency: 'IRR',
      },
    });

    // 4. Categories
    const categoriesData = [
      { slug: 'bags', titleFa: 'کیف و کوله‌پشتی' },
      { slug: 'digital', titleFa: 'کالای دیجیتال و صوتی' },
      { slug: 'home', titleFa: 'روشنایی و دکوراسیون' },
      { slug: 'coffee', titleFa: 'قهوه و تجهیزات تخصصی' },
    ];

    const categoryMap = new Map<string, string>();
    for (const c of categoriesData) {
      const cat = await prisma.category.upsert({
        where: { storeId_slug: { storeId: store.id, slug: c.slug } },
        update: { titleFa: c.titleFa },
        create: {
          tenantId: tenant.id,
          storeId: store.id,
          slug: c.slug,
          titleFa: c.titleFa,
        },
      });
      categoryMap.set(c.slug, cat.id);
    }

    // 5. Vendors (ADR-011 — marketplace foundation)
    const vendorsData = [
      { slug: 'roast-coffee', titleFa: 'روست قهوه', description: 'برشته‌کاری تخصصی قهوه تک‌خاستگاه با رست روز سفارش.', logoColor: '#6F4E37', commissionBps: 800 },
      { slug: 'brew-studio', titleFa: 'استودیو دم‌آوری', description: 'آموزش و محتوای دیجیتال تخصصی قهوه و بارِیستا.', logoColor: '#0B6E66', commissionBps: 1500 },
    ];
    const vendorMap = new Map<string, string>();
    for (const v of vendorsData) {
      const vendor = await prisma.vendor.upsert({
        where: { tenantId_slug: { tenantId: tenant.id, slug: v.slug } },
        update: { titleFa: v.titleFa, description: v.description, logoColor: v.logoColor, commissionBps: v.commissionBps },
        create: {
          tenantId: tenant.id,
          slug: v.slug,
          titleFa: v.titleFa,
          description: v.description,
          logoColor: v.logoColor,
          commissionBps: v.commissionBps,
          isActive: true,
        },
      });
      vendorMap.set(v.slug, vendor.id);
    }

    // 6. Products & Variants
    const products = [
      {
        slug: 'everyday-backpack',
        titleFa: 'کوله‌پشتی روزمره ضدآب',
        description: 'طراحی ارگونومیک، ضدآب با جای لپ‌تاپ تا ۱۵.۶ اینچ و زیپ‌های مخفی ضدسرقت.',
        categorySlug: 'bags',
        vendorSlug: null,
        kind: 'PHYSICAL' as const,
        digitalFileUrl: null,
        sku: 'BAG-URB-001',
        variantTitle: 'مشکی کربنی',
        price: '18500000', // 1,850,000 Tomans
        stock: 35,
      },
      {
        slug: 'wireless-headphones',
        titleFa: 'هدفون بی‌سیم نویزکنسلینگ',
        description: 'صدای شفاف Hi-Res با حذف نویز فعال (ANC)، باتری ۴۰ ساعته و شارژ سریع تایپ C.',
        categorySlug: 'digital',
        vendorSlug: null,
        kind: 'PHYSICAL' as const,
        digitalFileUrl: null,
        sku: 'AUD-ANC-002',
        variantTitle: 'خاکستری مات',
        price: '34500000', // 3,450,000 Tomans
        stock: 18,
      },
      {
        slug: 'desk-lamp',
        titleFa: 'چراغ مطالعه هوشمند رومیزی',
        description: 'تنظیم هوشمند دمای رنگ و شدت نور، پنل لمسی، استاندارد محافظت از چشم و بدنه مینیمال آلومینیومی.',
        categorySlug: 'home',
        vendorSlug: null,
        kind: 'PHYSICAL' as const,
        digitalFileUrl: null,
        sku: 'LMP-DSK-003',
        variantTitle: 'سفید صدفی',
        price: '9400000', // 940,000 Tomans
        stock: 22,
      },
      {
        slug: 'ethiopian-specialty-coffee',
        titleFa: 'قهوه تخصصی اتیوپی یرگاچف ۲۵۰ گرمی',
        description: 'دانه قهوه ۱۰۰٪ عربیکا تخصصی، برشته‌کاری تازه با طعم‌یادهای گلی، مرکباتی و اسیدیته ملایم میوه‌ای.',
        categorySlug: 'coffee',
        vendorSlug: 'roast-coffee',
        kind: 'PHYSICAL' as const,
        digitalFileUrl: null,
        sku: 'COF-ETH-250',
        variantTitle: 'دانه کامل ۲۵۰ گرم',
        price: '4500000', // 450,000 Tomans
        stock: 50,
      },
      {
        slug: 'ceramic-dripper-v60',
        titleFa: 'دریپر قهوه سرامیکی V60 سایز ۰۲',
        description: 'سرامیک حرارتی دست‌ساز ژاپنی، جریان یکنواخت استخراج عصاره قهوه همراه با شیارهای مارپیچ استاندارد.',
        categorySlug: 'coffee',
        vendorSlug: 'roast-coffee',
        kind: 'PHYSICAL' as const,
        digitalFileUrl: null,
        sku: 'DRP-V60-002',
        variantTitle: 'سفید کلاسیک',
        price: '3200000', // 320,000 Tomans
        stock: 14,
      },
      {
        slug: 'artisan-mug',
        titleFa: 'ماگ سرامیکی دست‌ساز لعاب‌دار',
        description: 'ماگ سفالی دست‌ساز با لعاب دورنگ نسکافه‌ای-فیروزه‌ای، مناسب برای انواع نوشیدنی‌های گرم.',
        categorySlug: 'home',
        vendorSlug: null,
        kind: 'PHYSICAL' as const,
        digitalFileUrl: null,
        sku: 'MUG-ART-006',
        variantTitle: 'فیروزه‌ای عسلی',
        price: '1900000', // 190,000 Tomans
        stock: 40,
      },
      {
        slug: 'digital-brew-guide',
        titleFa: 'کتاب الکترونیکی راهنمای جامع دم‌آوری قهوه',
        description: 'PDF ۱۲۰ صفحه‌ای؛ از انتخاب دانه تا پروفایل دم‌آوری اسپرسو، فیلتر و فرنچ‌پرس با چک‌لیست‌های عملی.',
        categorySlug: 'coffee',
        vendorSlug: 'brew-studio',
        kind: 'DIGITAL' as const,
        digitalFileUrl: 'https://cdn.commerce-os.local/digital/brew-guide.pdf',
        sku: 'EBOOK-BREW-01',
        variantTitle: 'نسخه PDF فارسی',
        price: '980000', // 98,000 Tomans
        stock: 0,
      },
      {
        slug: 'latte-art-course',
        titleFa: 'دوره ویدیویی لاته‌آرت از صفر',
        description: '۱۲ درس ویدیویی (۴ ساعت) از کشیدن پایه تا تاج رز؛ شامل فایل تمرین و گواهی پایان دوره.',
        categorySlug: 'coffee',
        vendorSlug: 'brew-studio',
        kind: 'DIGITAL' as const,
        digitalFileUrl: 'https://cdn.commerce-os.local/digital/latte-art.zip',
        sku: 'COURSE-LATTE-01',
        variantTitle: 'دسترسی یک‌ساله',
        price: '24500000', // 2,450,000 Tomans
        stock: 0,
      },
    ];

    for (const item of products) {
      const vendorId = item.vendorSlug ? vendorMap.get(item.vendorSlug) ?? null : null;
      const product = await prisma.product.upsert({
        where: { storeId_slug: { storeId: store.id, slug: item.slug } },
        update: {
          tenantId: tenant.id,
          titleFa: item.titleFa,
          description: item.description,
          categoryId: categoryMap.get(item.categorySlug),
          vendorId,
          kind: item.kind,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
        create: {
          tenantId: tenant.id,
          storeId: store.id,
          categoryId: categoryMap.get(item.categorySlug),
          vendorId,
          kind: item.kind,
          slug: item.slug,
          titleFa: item.titleFa,
          description: item.description,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });

      const variant = await prisma.productVariant.upsert({
        where: { sku: item.sku },
        update: {
          tenantId: tenant.id,
          storeId: store.id,
          productId: product.id,
          titleFa: item.variantTitle,
          priceAmount: item.price,
          currency: 'IRR',
          status: 'ACTIVE',
          digitalFileUrl: item.digitalFileUrl,
        },
        create: {
          tenantId: tenant.id,
          storeId: store.id,
          productId: product.id,
          sku: item.sku,
          titleFa: item.variantTitle,
          priceAmount: item.price,
          currency: 'IRR',
          status: 'ACTIVE',
          digitalFileUrl: item.digitalFileUrl,
        },
      });

      await prisma.inventoryLevel.upsert({
        where: {
          tenantId_storeId_variantId_warehouseCode: {
            tenantId: tenant.id,
            storeId: store.id,
            variantId: variant.id,
            warehouseCode: 'MAIN',
          },
        },
        update: { onHandQty: item.stock, reservedQty: 0 },
        create: {
          tenantId: tenant.id,
          storeId: store.id,
          variantId: variant.id,
          warehouseCode: 'MAIN',
          onHandQty: item.stock,
          reservedQty: 0,
        },
      });
    }

    // 6b. Subscription Plans (ADR-009)
    const plansData = [
      { slug: 'coffee-monthly-ethiopia', titleFa: 'اشتراک ماهانه قهوه اتیوپی', description: 'هر ماه یک کیسه ۲۵۰ گرمی قهوه تازه‌برشت درِ خانه شما.', intervalDays: 30, price: '4500000', variantSku: 'COF-ETH-250' },
      { slug: 'coffee-biweekly-blend', titleFa: 'اشتراک دوهفته‌ای قهوه ترکیبی', description: 'هر دو هفته یک کیسه قهوه ترکیبی دست‌ساز برای دم‌آوری روزانه.', intervalDays: 14, price: '2500000', variantSku: 'COF-ETH-250' },
      { slug: 'seasonal-mixed-box', titleFa: 'اشتراک فصلی باکس ترکیبی', description: 'هر فصل یک باکس ۳ کیسه‌ای شامل کالاهای منتخب فروشگاه.', intervalDays: 90, price: '12000000', variantSku: 'COF-ETH-250' },
    ];
    for (const p of plansData) {
      const planVariant = await prisma.productVariant.findUnique({ where: { sku: p.variantSku } });
      await prisma.subscriptionPlan.upsert({
        where: { tenantId_slug: { tenantId: tenant.id, slug: p.slug } },
        update: { titleFa: p.titleFa, description: p.description, intervalDays: p.intervalDays, priceRials: p.price, isActive: true },
        create: {
          tenantId: tenant.id,
          storeId: store.id,
          slug: p.slug,
          titleFa: p.titleFa,
          description: p.description,
          variantId: planVariant?.id ?? null,
          intervalDays: p.intervalDays,
          priceRials: p.price,
          currency: 'IRR',
          isActive: true,
        },
      });
    }

    // 6. Chart of Accounts (COA)
    for (const [code, def] of Object.entries(CHART_OF_ACCOUNTS)) {
      await prisma.ledgerAccount.upsert({
        where: {
          tenantId_code_currency: {
            tenantId: tenant.id,
            code,
            currency: 'IRR',
          },
        },
        update: { nameFa: def.nameFa },
        create: {
          tenantId: tenant.id,
          code,
          nameFa: def.nameFa,
          category: def.category as any,
          currency: 'IRR',
        },
      });
    }

    // 7. Active Coupons
    await prisma.coupon.upsert({
      where: {
        tenantId_storeId_code: {
          tenantId: tenant.id,
          storeId: store.id,
          code: 'WELCOME10',
        },
      },
      update: { discountBps: 1000 },
      create: {
        tenantId: tenant.id,
        storeId: store.id,
        code: 'WELCOME10',
        discountBps: 1000, // 10%
        maxDiscount: '5000000', // 500,000 Tomans
        usageLimit: 500,
        expiresAt: new Date(Date.now() + 90 * 24 * 3600 * 1000),
      },
    });

    await prisma.coupon.upsert({
      where: {
        tenantId_storeId_code: {
          tenantId: tenant.id,
          storeId: store.id,
          code: 'OFF50',
        },
      },
      update: { fixedDiscount: '500000' },
      create: {
        tenantId: tenant.id,
        storeId: store.id,
        code: 'OFF50',
        fixedDiscount: '500000', // 50,000 Tomans fixed
        minSubtotal: '20000000', // 2,000,000 Tomans
        usageLimit: 200,
        expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      },
    });

    // 8. Shipping Methods
    const shippingMethods = [
      { code: 'POST_PISHTAZ', carrier: 'IRAN_POST', titleFa: 'پست پیشتاز سراسری', baseFee: '500000' },
      { code: 'TIPAX_EXPRESS', carrier: 'TIPAX', titleFa: 'تیپاکس اکسپرس (درب به درب)', baseFee: '850000' },
      { code: 'ALOPEYK_ON_DEMAND', carrier: 'ALOPEYK', titleFa: 'پیک موتوری فوری درون‌شهری', baseFee: '750000' },
    ];

    for (const sm of shippingMethods) {
      await prisma.shippingMethod.upsert({
        where: { tenantId_code: { tenantId: tenant.id, code: sm.code } },
        update: { titleFa: sm.titleFa, baseFee: sm.baseFee },
        create: {
          tenantId: tenant.id,
          code: sm.code,
          carrier: sm.carrier,
          titleFa: sm.titleFa,
          baseFee: sm.baseFee,
          isActive: true,
        },
      });
    }

    console.log('✅ Database successfully seeded with full catalog, users, accounts, and methods.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Seed execution error:', error);
  process.exitCode = 1;
});
