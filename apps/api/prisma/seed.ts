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
    console.log('🌱 Starting comprehensive Commerce OS clinical database seeding...');

    // 1. Tenant, Organization, Store
    const tenant = await prisma.tenant.upsert({
      where: { slug: 'demo-tenant' },
      update: { name: 'مستأجر آزمایشی دکتر درمر | Dr. Dermer UK' },
      create: { slug: 'demo-tenant', name: 'مستأجر آزمایشی دکتر درمر | Dr. Dermer UK' },
    });

    const organization = await prisma.organization.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: 'demo-org' } },
      update: { name: 'سازمان مرکزی کلینیکال و درماتولوژی درمر' },
      create: { tenantId: tenant.id, slug: 'demo-org', name: 'سازمان مرکزی کلینیکال و درماتولوژی درمر' },
    });

    const store = await prisma.store.upsert({
      where: { slug: 'demo' },
      update: {
        tenantId: tenant.id,
        organizationId: organization.id,
        name: 'فروشگاه تخصصی کلینیکال دکتر درمر | Dr. Dermer UK',
        defaultCurrency: 'IRR',
      },
      create: {
        tenantId: tenant.id,
        organizationId: organization.id,
        slug: 'demo',
        name: 'فروشگاه تخصصی کلینیکال دکتر درمر | Dr. Dermer UK',
        defaultCurrency: 'IRR',
      },
    });

    // 2. Users & RBAC
    await prisma.user.upsert({
      where: { phone: '09121111111' },
      update: { role: 'SUPER_ADMIN', fullName: 'مدیر ارشد درماتولوژی درمر' },
      create: {
        tenantId: tenant.id,
        phone: '09121111111',
        email: 'admin@commerce-os.local',
        fullName: 'مدیر ارشد درماتولوژی درمر',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    await prisma.user.upsert({
      where: { phone: '09122222222' },
      update: { role: 'OPERATOR', fullName: 'اپراتور انبار و ارسال زنجیره سرد' },
      create: {
        tenantId: tenant.id,
        phone: '09122222222',
        email: 'operator@commerce-os.local',
        fullName: 'اپراتور انبار و ارسال زنجیره سرد',
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

    // 4. Categories (Clinical & Skincare Focus - 100% Topical, No Devices)
    const categoriesData = [
      { slug: 'skincare', titleFa: 'مراقبت تخصصی پوست و کلینیکال' },
      { slug: 'reeskin', titleFa: 'لاین بالینی مراقبت پوست ReeSkin' },
      { slug: 'reemed', titleFa: 'لاین تخصصی درموسوتیکال ReeMed' },
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

    // Clean up legacy 'devices' category if present
    const legacyDevicesCategory = await prisma.category.findUnique({
      where: { storeId_slug: { storeId: store.id, slug: 'devices' } },
    });
    if (legacyDevicesCategory) {
      await prisma.product.updateMany({
        where: { categoryId: legacyDevicesCategory.id },
        data: { categoryId: null },
      });
      await prisma.category.delete({ where: { id: legacyDevicesCategory.id } });
    }

    // ── 5b. Authentic Brands (ReeSkin & ReeMed) ──
    const brandsData = [
      {
        slug: 'reeskin',
        name: 'ReeSkin Clinical',
        description: 'برند پیشرو در درماتولوژی، فرمولاسیون‌های بالینی و اکتیوهای اثبات‌شده پوستی دکتر درمر انگلستان.',
        logoUrl: '/assets/drdermer/2025/07/reeskin.png',
        websiteUrl: 'https://drdermer.co.uk/reeskin',
        originCountry: 'United Kingdom',
      },
      {
        slug: 'reemed',
        name: 'ReeMed Medical Pro',
        description: 'فرمولاسیون‌های پیشرفته درماتولوژی، کیت‌های ترابافتی و بیواکتیوهای اثبات‌شده دکتر درمر انگلستان.',
        logoUrl: '/assets/drdermer/2025/07/reemed-gray.png',
        websiteUrl: 'https://drdermer.co.uk/reemed',
        originCountry: 'United Kingdom',
      },
      {
        slug: 'reeskin-clinical',
        name: 'ReeSkin Clinical',
        description: 'برند پیشرو در درماتولوژی، فرمولاسیون‌های بالینی و اکتیوهای اثبات‌شده پوستی دکتر درمر انگلستان.',
        logoUrl: '/assets/drdermer/2025/07/reeskin.png',
        websiteUrl: 'https://drdermer.co.uk/reeskin',
        originCountry: 'United Kingdom',
      },
      {
        slug: 'reemed-laboratories',
        name: 'ReeMed Medical Pro',
        description: 'فرمولاسیون‌های پیشرفته درماتولوژی، کیت‌های ترابافتی و بیواکتیوهای اثبات‌شده دکتر درمر انگلستان.',
        logoUrl: '/assets/drdermer/2025/07/reemed-gray.png',
        websiteUrl: 'https://drdermer.co.uk/reemed',
        originCountry: 'United Kingdom',
      },
    ];
    const brandMap = new Map<string, string>();
    for (const b of brandsData) {
      const brand = await prisma.brand.upsert({
        where: { storeId_slug: { storeId: store.id, slug: b.slug } },
        update: {
          name: b.name,
          description: b.description,
          logoUrl: b.logoUrl,
          websiteUrl: b.websiteUrl,
          originCountry: b.originCountry,
          isPublished: true,
        },
        create: {
          tenantId: tenant.id,
          storeId: store.id,
          slug: b.slug,
          name: b.name,
          description: b.description,
          logoUrl: b.logoUrl,
          websiteUrl: b.websiteUrl,
          originCountry: b.originCountry,
          isPublished: true,
        },
      });
      brandMap.set(b.slug, brand.id);
    }

    // ── 5c. Skin Concerns ──
    const skinConcernsData = [
      {
        slug: 'dullness',
        name: 'کدری و تیرگی پوست',
        description: 'پوست‌های کدر، هایپرپیگمنتیشن و فاقد اکسیژن به دلیل استرس محیطی و آلودگی هوا',
        iconUrl: '/assets/drdermer/2025/08/pin-location-150x150.png',
      },
      {
        slug: 'anti-aging',
        name: 'کاهش الاستیسیته و پیری زودرس',
        description: 'خطوط ریز، کاهش سفتی پوست و افت سنتز کلاژن',
        iconUrl: '/assets/drdermer/2025/08/pin-location-150x150.png',
      },
      {
        slug: 'sensitivity-redness',
        name: 'خشکی، حساسیت و قرمزی',
        description: 'سد دفاعی آسیب‌دیده، رزاسه و التهاب بعد از لایه‌برداری و پیلینگ',
        iconUrl: '/assets/drdermer/2025/08/pin-location-150x150.png',
      },
    ];
    const concernMap = new Map<string, string>();
    for (const sc of skinConcernsData) {
      const concern = await prisma.skinConcern.upsert({
        where: { storeId_slug: { storeId: store.id, slug: sc.slug } },
        update: {
          name: sc.name,
          description: sc.description,
          iconUrl: sc.iconUrl,
        },
        create: {
          tenantId: tenant.id,
          storeId: store.id,
          slug: sc.slug,
          name: sc.name,
          description: sc.description,
          iconUrl: sc.iconUrl,
        },
      });
      concernMap.set(sc.slug, concern.id);
    }

    // ── 5d. Clean up legacy non-skincare & hardware products if existing ──
    const legacySlugs = [
      'everyday-backpack',
      'wireless-headphones',
      'desk-lamp',
      'ethiopian-specialty-coffee',
      'ceramic-dripper-v60',
      'artisan-mug',
      'digital-brew-guide',
      'latte-art-course',
      'reeskin-gentle-hydrating-cleanser',
      'reemed-cellular-renewal-serum',
      'barrier-recovery-cream',
      'carbox',
      'plasmax',
    ];
    for (const legacySlug of legacySlugs) {
      const existing = await prisma.product.findUnique({
        where: { storeId_slug: { storeId: store.id, slug: legacySlug } },
      });
      if (existing) {
        await prisma.productMedia.deleteMany({ where: { productId: existing.id } });
        await prisma.productIngredient.deleteMany({ where: { productId: existing.id } });
        await prisma.clinicalClaim.deleteMany({ where: { productId: existing.id } });
        await prisma.usageStep.deleteMany({ where: { productId: existing.id } });
        await prisma.productSkinConcern.deleteMany({ where: { productId: existing.id } });
        const variants = await prisma.productVariant.findMany({ where: { productId: existing.id } });
        for (const v of variants) {
          await prisma.inventoryReservationLine.deleteMany({ where: { variantId: v.id } });
          await prisma.cartLine.deleteMany({ where: { variantId: v.id } });
          await prisma.orderLine.deleteMany({ where: { variantId: v.id } });
          await prisma.inventoryLevel.deleteMany({ where: { variantId: v.id } });
        }
        await prisma.productVariant.deleteMany({ where: { productId: existing.id } });
        await prisma.product.delete({ where: { id: existing.id } });
      }
    }

    // ── 6. The 8 Authentic Dr Dermer Topical Skincare Products (ReeSkin & ReeMed) ──
    const products = [
      {
        slug: 'carboxygel',
        titleFa: 'ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel دکتر درمر (گلیکولیک / آزالائیک / مولتی‌اکتیو)',
        description: 'سیستم کربوکسی‌تراپی غیرتهاجمی با رهایش کنترل‌شده دی‌اکسید کربن فعال (Bohr Effect) جهت اکسیژن‌رسانی عمیق بافتی، تحریک فیبروبلاست‌ها و کلاژن‌سازی تخصصی پوست.',
        categorySlug: 'reeskin',
        brandSlug: 'reeskin',
        variants: [
          { sku: 'CBG-PRO-500ML', titleFa: 'مخزن ۵۰۰ میلی‌لیتر تخصصی مراقبت پوست', price: '48500000', stock: 25 },
          { sku: 'CBG-HOME-5X', titleFa: 'کیت خانگی ۵ عددی + پد فعال‌ساز', price: '19500000', stock: 40 },
          { sku: 'CBG-TUBE-50ML', titleFa: 'تیوب ۵۰ میلی‌لیتر تک‌نفره (۲ جلسه‌ای)', price: '8900000', stock: 50 },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'ژل کربوکسی‌تراپی غیرتهاجمی CarboxyGel دکتر درمر انگلستان',
            url: '/assets/drdermer/2025/07/azelaic-acid-carboxygel.png',
            width: 1062,
            height: 1536,
            mimeType: 'image/png',
            isPrimary: true,
          },
          {
            role: 'TEXTURE' as const,
            sortOrder: 2,
            altText: 'بافت ژل کربوکسی درمر و واکنش جوشش گازی',
            url: '/assets/drdermer/2025/07/dr-dermer-carboxy-gel-1-1024x835.png',
            width: 1024,
            height: 835,
            mimeType: 'image/png',
            isPrimary: false,
          },
          {
            role: 'PACKAGING' as const,
            sortOrder: 3,
            altText: 'بسته‌بندی رسمی سیستم حرفه‌ای CarboxyGel CO2',
            url: '/assets/drdermer/2025/07/carboxypad-1024x198.png',
            width: 1024,
            height: 198,
            mimeType: 'image/png',
            isPrimary: false,
          },
        ],
        ingredients: [
          {
            name: 'سدیم بی‌کربنات خالص ۸.۵٪',
            inciName: 'Sodium Bicarbonate',
            concentrationPercent: '8.50',
            purpose: 'تولید گاز دی‌اکسید کربن فعال در برخورد با پد اسیدی',
            isKeyIngredient: true,
            description: 'ایجاد واکنش گازدار و آزادسازی دی‌اکسید کربن با غلظت بهینه ۱۰۰۰ پی‌پی‌ام جهت نفوذ به درم.',
            sortOrder: 1,
          },
          {
            name: 'عصاره سنتلا آسیاتیکا ۵٪',
            inciName: 'Centella Asiatica Extract',
            concentrationPercent: '5.00',
            purpose: 'التیام‌بخش و تسریع سنتز پروکلاژن',
            isKeyIngredient: true,
            description: 'مهار فاکتورهای التهابی و محافظت از سد دفاعی پوست.',
            sortOrder: 2,
          },
          {
            name: 'هیالورونیک اسید با وزن مولکولی چندگانه',
            inciName: 'Sodium Hyaluronate',
            concentrationPercent: '2.00',
            purpose: 'آبرسانی عمقی و هیدراتاسیون پایدار',
            isKeyIngredient: true,
            description: 'جذب رطوبت لایه‌های اپیدرم و هیدراتاسیون پایدار بافتی.',
            sortOrder: 3,
          },
        ],
        claims: [
          {
            claimText: 'افزایش ۴۵ درصدی میزان اکسیژن‌رسانی ریزگردشی بافت پوست بر پایه اثر بوهر (Bohr Effect)',
            evidenceSummary: 'ثبت‌شده در ارزیابی اکسی‌متری بافتی و تست‌های بالینی درموسوتیکال بریتانیا.',
            studyReference: 'Journal of Cosmetic Dermatology, 2024; Vol 23(4): 1120-1129.',
            approvedBy: 'دکتر جیمز کارتر - کمبریج',
            status: 'APPROVED' as const,
          },
          {
            claimText: 'روشن‌کنندگی و بهبود بافت خسته و کدری پوست از جلسه نخست',
            evidenceSummary: 'ثبت اسپکتروفتومتری ملانین و زبری پوست روی ۵۰ داوطلب کلینیکی.',
            studyReference: 'ReeSkin Clinical Evaluation Trial RS-2024-CBG',
            approvedBy: 'دکتر مریم رادمنش (مسئول فنی درماتولوژی)',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          { stepNumber: 1, title: 'اپلیکیشن ژل روی پوست تمیز', instruction: 'ژل را با ضخامت یکنواخت ۱ الی ۲ میلی‌متر روی کل پوست صورت و گردن پخش نمایید.' },
          { stepNumber: 2, title: 'فیکس کردن پد و ماسک فعال‌ساز', instruction: 'پد یا ماسک CarboxyPad را روی ژل قرار داده و به آرامی فشار دهید تا واکنش گازی شروع شود.' },
          { stepNumber: 3, title: 'اتمام پروسیجر و آبکشی', instruction: 'پس از ۲۰ دقیقه ماسک را برداشته و باقی‌مانده ژل را با اسفنج و آب ولرم شستشو دهید.' },
        ],
        concernSlugs: ['dullness', 'anti-aging'],
      },
      {
        slug: 'carboxypod',
        titleFa: 'پادهای فعال‌ساز جوشان اسکراب CarboxyPod (کربن / ویتامینه / هیدرا)',
        description: 'کپسول‌های اسکراب فیزیکی و شیمیایی فعال‌ساز گاز دی‌اکسید کربن جهت آزادسازی میکروحباب‌های CO2 و اکسیژن‌رسانی عمیق در ترکیب با کربوکسی‌ژل.',
        categorySlug: 'reeskin',
        brandSlug: 'reeskin',
        variants: [
          { sku: 'DD-POD-CRB-10X', titleFa: 'بسته ۱۰ عددی کربن فعال (Carbon Pod)', price: '18000000', stock: 30 },
          { sku: 'DD-POD-VIT-10X', titleFa: 'بسته ۱۰ عددی ویتامینه (Vitamin Pod)', price: '19000000', stock: 25 },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'پاد کربن فعال CarboxyPod دکتر درمر',
            url: '/assets/drdermer/2025/07/carbon-carboxypod-1.png',
            width: 600,
            height: 600,
            mimeType: 'image/png',
            isPrimary: true,
          },
          {
            role: 'DETAIL' as const,
            sortOrder: 2,
            altText: 'پاد ویتامینه Vitamin CarboxyPod',
            url: '/assets/drdermer/2025/07/1-vitapod-1-1-2.png',
            width: 600,
            height: 600,
            mimeType: 'image/png',
            isPrimary: false,
          },
        ],
        ingredients: [
          {
            name: 'کربن فعال دارویی ۴٪',
            inciName: 'Activated Carbon Powder',
            concentrationPercent: '4.00',
            purpose: 'جذب سموم، سبوم و ذرات آلاینده شهری',
            isKeyIngredient: true,
            description: 'سم‌زدایی عمیق منافذ پوست همزمان با رهایش گاز دی‌اکسید کربن.',
            sortOrder: 1,
          },
          {
            name: 'اسید سیتریک میکروکپسوله ۱۲٪',
            inciName: 'Citric Acid Anhydrous Coated',
            concentrationPercent: '12.00',
            purpose: 'واکنش فوری با بی‌کربنات سدیم ژل و تولید CO2',
            isKeyIngredient: true,
            description: 'تحریک رهایش پایدار حباب‌های نانو دی‌اکسید کربن.',
            sortOrder: 2,
          },
        ],
        claims: [
          {
            claimText: 'کاهش ۶۴ درصدی چربی اضافه و پاکسازی کامل منافذ باز چهره در جلسه نخست',
            evidenceSummary: 'ثبت با آنالیزور سبوم و تصویربرداری درماتولوژی کمبریج.',
            studyReference: 'Dr Dermer Clinical Research Bulletin 2024.',
            approvedBy: 'کلینیک تحقیقاتی کمبریج',
            status: 'APPROVED' as const,
          },
          {
            claimText: 'رهایش متمرکز حباب‌های میکرو CO2 بدون هدررفت گاز به محیط پیرامون',
            evidenceSummary: 'بررسی پایداری فشار گاز در بافت پوست با سنسورهای غشایی.',
            studyReference: 'European Journal of Aesthetic Medicine, Vol 18, 2024',
            approvedBy: 'دکتر مارکوس وبر (لابراتوار انگلستان)',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          { stepNumber: 1, title: 'ماساژ دورانی پاد روی ژل', instruction: 'پاد را روی ژل قرار داده و به مدت ۳ الی ۵ دقیقه با حرکات دایره‌ای ملایم ماساژ دهید تا جوشش فعال شود.' },
          { stepNumber: 2, title: 'پاکسازی نهایی', instruction: 'با پد مرطوب بقایای ماساژ را از روی صورت پاک کرده و با آب ولرم آبکشی نمایید.' },
        ],
        concernSlugs: ['dullness'],
      },
      {
        slug: 'carboxypad',
        titleFa: 'پدهای فعال‌ساز آلکالاین صورت و گردن CarboxyPad دکتر درمر',
        description: 'شیت‌های پیش‌برش‌خورده استریل با پوشش آناتومیک صورت و ناحیه گردن جهت رهایش پایدار گاز دی‌اکسید کربن.',
        categorySlug: 'reeskin',
        brandSlug: 'reeskin',
        variants: [
          { sku: 'DD-PAD-20X', titleFa: 'بسته ۲۰ عددی صورت و گردن', price: '14000000', stock: 35 },
          { sku: 'DD-PAD-50X', titleFa: 'بسته ۵۰ عددی اقتصادی', price: '32000000', stock: 20 },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'پد فعال‌ساز آلکالاین صورت و گردن CarboxyPad دکتر درمر',
            url: '/assets/drdermer/2025/08/carboxypad.webp',
            width: 1024,
            height: 198,
            mimeType: 'image/webp',
            isPrimary: true,
          },
          {
            role: 'DETAIL' as const,
            sortOrder: 2,
            altText: 'بسته‌بندی رسمی CarboxyPad',
            url: '/assets/drdermer/2025/07/carboxypad-1024x198.png',
            width: 1024,
            height: 198,
            mimeType: 'image/png',
            isPrimary: false,
          },
        ],
        ingredients: [
          {
            name: 'سیتریک اسید خشک دارویی',
            inciName: 'Citric Acid (Dry Formulation)',
            concentrationPercent: '10.00',
            purpose: 'آغازگر اسید-باز با ژل قلیایی',
            isKeyIngredient: true,
            description: 'واکنش سریع با سدیم بی‌کربنات جهت آزادسازی بیش از ۱۰۰۰ پی‌پی‌ام گاز CO2.',
            sortOrder: 1,
          },
          {
            name: 'الیاف سلولزی نبافته گرید پزشکی',
            inciName: 'Medical Grade Non-Woven Cellulose Web',
            concentrationPercent: '20.00',
            purpose: 'ماتریکس فیبری متخلخل نگهدارنده واکنش گازی',
            isKeyIngredient: true,
            description: 'پوشش یکنواخت آناتومیک بدون ایجاد فاصله هوایی.',
            sortOrder: 2,
          },
        ],
        claims: [
          {
            claimText: 'ایجاد واکنش کاتالیزوری پایدار گاز CO2 و تثبیت ژل بر روی کلیه خطوط آناتومیک صورت و گردن',
            evidenceSummary: 'سنجش ترنس‌کیوتانیوس اکسیژن با پالس اکسی‌متری بافتی.',
            studyReference: 'Journal of Clinical Dermatology, Vol 42, 2024, pp 112-119',
            approvedBy: 'دکتر جیمز کارتر',
            status: 'APPROVED' as const,
          },
          {
            claimText: 'بهینه‌سازی اثر بوهر و افزایش ترابافتی اشباع اکسیژن تا ۳ برابر',
            evidenceSummary: 'ارزیابی جریان خون مویرگی با داپلر لیزری سطحی.',
            studyReference: 'Cambridge Microcirculation Research 2024',
            approvedBy: 'بورد علمی درماتولوژی کمبریج',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          { stepNumber: 1, title: 'اعمال ژل کربوکسی', instruction: 'ابتدا ژل CarboxyGel را به ضخامت یکنواخت روی پوست صورت و گردن پخش نمایید.' },
          { stepNumber: 2, title: 'قرار دادن شیت CarboxyPad', instruction: 'پد را روی صورت و گردن قرار داده و با ضربات سبک دست فشار دهید تا حباب‌های CO2 تشکیل شوند.' },
          { stepNumber: 3, title: 'پایان واکنش و پاکسازی', instruction: 'پس از ۲۰ دقیقه پد را برداشته و پوست را با آب ولرم تمیز نمایید.' },
        ],
        concernSlugs: ['dullness', 'anti-aging'],
      },
      {
        slug: 'crystalene',
        titleFa: 'خمیر لایه‌بردار و پولیش میکرودرم کریستالین Crystalene Polish Paste',
        description: 'پولیش میکرودرم ملایم با کریستال‌های آلومینا، نیاسینامید، لاکتیک اسید، روغن آرگان و شی‌باتر جهت ایجاد شفافیت و یکدستی بافت پوست.',
        categorySlug: 'reeskin',
        brandSlug: 'reeskin',
        variants: [
          { sku: 'DD-CRY-200ML', titleFa: 'تیوب ۲۰۰ میلی‌لیتر تخصصی', price: '17500000', stock: 40 },
          { sku: 'DD-CRY-50ML', titleFa: 'تیوب ۵۰ میلی‌لیتر هوم‌کر', price: '6500000', stock: 60 },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'خمیر پولیش کریستالین Crystalene Polish Paste',
            url: '/assets/drdermer/2025/08/15crystalene.webp',
            width: 1200,
            height: 1109,
            mimeType: 'image/webp',
            isPrimary: true,
          },
          {
            role: 'DETAIL' as const,
            sortOrder: 2,
            altText: 'بافت کرمی پولیش کریستالین',
            url: '/assets/drdermer/2025/08/15crystalene-1200x1109.webp',
            width: 1200,
            height: 1109,
            mimeType: 'image/webp',
            isPrimary: false,
          },
        ],
        ingredients: [
          {
            name: 'میکروکریستال‌های خالص اکسید آلومینیوم',
            inciName: 'Alumina Microcrystals',
            concentrationPercent: '12.00',
            purpose: 'پولیش ابریشمی سطح اپیدرم بدون خراش',
            isKeyIngredient: true,
            description: 'لبه‌های گردشده کریستالی بدون ایجاد خراش‌های میکروسکوپی.',
            sortOrder: 1,
          },
          {
            name: 'نیاسینامید دارویی ۴٪',
            inciName: 'Niacinamide',
            concentrationPercent: '4.00',
            purpose: 'روشن‌کننده و تقویت‌کننده سد دفاعی',
            isKeyIngredient: true,
            description: 'یکدست‌کننده رنگ پوست و کنترل هایپرپیگمنتیشن.',
            sortOrder: 2,
          },
          {
            name: 'اسید لاکتیک ۳٪',
            inciName: 'Lactic Acid',
            concentrationPercent: '3.00',
            purpose: 'لایه‌برداری شیمیایی ملایم و هیدراتاسیون اپیدرم',
            isKeyIngredient: true,
            description: 'تحریک لایه‌برداری ملایم بدون التهاب.',
            sortOrder: 3,
          },
        ],
        claims: [
          {
            claimText: 'لایه‌برداری میکرودرم ابریشمی بدون خراش میکروسکوپی و روشن‌سازی آنی تن پوست',
            evidenceSummary: 'تحلیل پرفیلوگرام سه‌بعدی زبری پوست در آزمایشگاه درماتولوژی کمبریج.',
            studyReference: 'Cambridge Dermatology Resurfacing Protocol Bulletin 2024',
            approvedBy: 'دکتر جیمز کارتر',
            status: 'APPROVED' as const,
          },
          {
            claimText: 'پاکسازی کامل سلول‌های مرده لایه شاخی و افزایش ۹۰ درصدی جذب مواد مؤثره',
            evidenceSummary: 'ارزیابی اسپکتروفتومتری میزان نفوذ اکتیوها پس از پولیش کریستالین.',
            studyReference: 'ReeSkin Clinical Evaluation Trial RS-CRY-2024',
            approvedBy: 'دکتر مریم رادمنش',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          { stepNumber: 1, title: 'مرطوب نمودن اولیه پوست', instruction: 'پوست را با آب ولرم مرطوب نمایید.' },
          { stepNumber: 2, title: 'ماساژ دورانی خمیر', instruction: 'مقدار کمی از خمیر را به مدت ۱ الی ۲ دقیقه با نوک انگشتان روی پوست صورت ماساژ دهید.' },
          { stepNumber: 3, title: 'شستشو و تسکین', instruction: 'با آب ولرم شسته و بلافاصله از ژل تسکین‌بخش هیلین استفاده نمایید.' },
        ],
        concernSlugs: ['dullness'],
      },
      {
        slug: 'healene',
        titleFa: 'ژل التیام‌بخش و ترمیم سد دفاعی هیلین Healene Soothing Gel',
        description: 'فرمول آرامش‌بخش با نیاسینامید، پانتنول، هیالورونیک اسید، آلانتوئین و ۷ عصاره گیاهی آرام‌بخش سنتلا، میموزا و کالاندولا جهت تسکین فوری قرمزی پس از پیلینگ و لایه‌برداری.',
        categorySlug: 'reeskin',
        brandSlug: 'reeskin',
        variants: [
          { sku: 'DD-HEA-250ML', titleFa: 'بطری پمپی ۲۵۰ میلی‌لیتر', price: '16000000', stock: 50 },
          { sku: 'DD-HEA-500ML', titleFa: 'مخزن ۵۰۰ میلی‌لیتر تخصصی', price: '28000000', stock: 25 },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'ژل تسکین دهنده هیلین Healene Soothing Gel',
            url: '/assets/drdermer/2025/08/16healene.webp',
            width: 1200,
            height: 1109,
            mimeType: 'image/webp',
            isPrimary: true,
          },
          {
            role: 'DETAIL' as const,
            sortOrder: 2,
            altText: 'بافت سبک ژل کریستالی هیلین',
            url: '/assets/drdermer/2025/08/16healene-1200x1109.webp',
            width: 1200,
            height: 1109,
            mimeType: 'image/webp',
            isPrimary: false,
          },
        ],
        ingredients: [
          {
            name: 'پانتنول و آلانتوئین ۵٪',
            inciName: 'Panthenol, Allantoin',
            concentrationPercent: '5.00',
            purpose: 'ترمیم سد لیپیدی و رفع سوزش پوست',
            isKeyIngredient: true,
            description: 'تسریع نوسازی سلول‌های اپیدرم و کاهش تبخیر ترنس‌اپیدرمال آب.',
            sortOrder: 1,
          },
          {
            name: 'کمپلکس عصاره‌های گیاهی آرام‌بخش ۶.۵٪',
            inciName: 'Centella Asiatica, Calendula, Chamomile Extract',
            concentrationPercent: '6.50',
            purpose: 'کاهش سریع فاکتورهای التهابی و اریتما',
            isKeyIngredient: true,
            description: 'التیام‌بخش قوی سوزش پس از پیلینگ، لایه‌برداری و کربوکسی‌تراپی.',
            sortOrder: 2,
          },
        ],
        claims: [
          {
            claimText: 'کاهش ۶۱ درصدی قرمزی و التهاب اریتما در ۳۰ دقیقه اول پس از مصرف',
            evidenceSummary: 'ثبت شاخص اریتم با درماتوسکوپ و کالریمتر بالینی.',
            studyReference: 'Post-Carboxy Recovery Trials UK, 2024',
            approvedBy: 'دکتر جیمز کارتر',
            status: 'APPROVED' as const,
          },
          {
            claimText: 'ترمیم سد دفاعی لیپیدی و کاهش تبخیر آب ترنس‌اپیدرمال (TEWL)',
            evidenceSummary: 'ارزیابی TEWL و ترانسیدرمال واتر لوس در آزمون کلینیکی ۶ ساعته.',
            studyReference: 'ReeSkin Clinical Recovery Trial RS-HEA-2024',
            approvedBy: 'دکتر مریم رادمنش',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          { stepNumber: 1, title: 'استفاده روی پوست تمیز', instruction: 'لایه نازکی از ژل هیلین را پس از شستشوی ژل کربوکسی یا پیلینگ روی موضع بمالید.' },
          { stepNumber: 2, title: 'ماساژ ملایم تا جذب کامل', instruction: 'به آرامی ماساژ دهید تا خنکی و التیام عمیق به لایه‌های اپیدرم نفوذ کند.' },
        ],
        concernSlugs: ['sensitivity-redness'],
      },
      {
        slug: 'silicalene',
        titleFa: 'اسکراب لایه‌بردار ملایم دتوکس سیلیکالین Silicalene Mild Silica Scrub',
        description: 'پاکسازی عمقی منافذ، کنترل چربی و رفع جوش‌های سرسیاه با میکروسفرهای سیلیکای کاملاً گرد، کربن فعال، اسید گلیکولیک و سالیسیلیک.',
        categorySlug: 'reeskin',
        brandSlug: 'reeskin',
        variants: [
          { sku: 'DD-SIL-200ML', titleFa: 'تیوب ۲۰۰ میلی‌لیتر', price: '15500000', stock: 45 },
          { sku: 'DD-SIL-500ML', titleFa: 'مخزن ۵۰۰ میلی‌لیتر تخصصی', price: '29000000', stock: 20 },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'اسکراب ملایم سیلیکالین Silicalene Mild Scrub',
            url: '/assets/drdermer/2025/08/14silicalene.webp',
            width: 1200,
            height: 1109,
            mimeType: 'image/webp',
            isPrimary: true,
          },
          {
            role: 'DETAIL' as const,
            sortOrder: 2,
            altText: 'بافت ژل اسکراب حاوی ذرات سیلیکا',
            url: '/assets/drdermer/2025/08/14silicalene-1200x1109.webp',
            width: 1200,
            height: 1109,
            mimeType: 'image/webp',
            isPrimary: false,
          },
        ],
        ingredients: [
          {
            name: 'کره‌های سیلیکای گرد و کربن فعال',
            inciName: 'Hydrated Silica Spheres, Activated Carbon',
            concentrationPercent: '6.00',
            purpose: 'لایروبی منافذ و جذب آلاینده‌ها بدون ایجاد خراشیدگی',
            isKeyIngredient: true,
            description: 'پاکسازی سبوم اکسیدشده و تخلیه کومدون‌ها.',
            sortOrder: 1,
          },
          {
            name: 'اسید سالیسیلیک و زینک PCA',
            inciName: 'Salicylic Acid, Zinc PCA',
            concentrationPercent: '1.50',
            purpose: 'حل‌کردن چربی داخل منافذ و خواص ضدباکتریایی',
            isKeyIngredient: true,
            description: 'تنظیم ترشح سبوم و جلوگیری از ایجاد جوش.',
            sortOrder: 2,
          },
        ],
        claims: [
          {
            claimText: 'پاکسازی عمیق منافذ و رفع کومدون‌های سرسیاه بدون ایجاد حساسیت یا تحریک فیزیکی',
            evidenceSummary: 'ارزیابی پاکسازی منافذ پوست با ویسیا درماتولوژی کمبریج.',
            studyReference: 'Pore Clearance and Sebum Metrics, Cambridge Lab 2024',
            approvedBy: 'دکتر جیمز کارتر',
            status: 'APPROVED' as const,
          },
          {
            claimText: 'کنترل چربی مازاد پوست و مات‌کنندگی بافت چهره تا ۸ ساعت',
            evidenceSummary: 'سنجش ترشح سبوم با سبومتر روی ۴۰ داوطلب دارای پوست چرب.',
            studyReference: 'ReeSkin Sebum Regulation Protocol RS-SIL-2024',
            approvedBy: 'دکتر مریم رادمنش',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          { stepNumber: 1, title: 'ماساژ روی پوست مرطوب', instruction: 'به مدت ۶۰ ثانیه روی پیشانی، بینی و چانه با حرکات دورانی ماساژ دهید.' },
          { stepNumber: 2, title: 'آبکشی کامل', instruction: 'با آب ولرم شسته و با حوله تمیز خشک نمایید.' },
        ],
        concernSlugs: ['dullness'],
      },
      {
        slug: 'glycolic-carboxygel',
        titleFa: 'کربوکسی‌ژل اسید گلیکولیک ۱۰٪ جوانساز و ضدچروک Glycolic CarboxyGel',
        description: 'فرمولاسیون پیشرفته لایه‌برداری و تحریک کلاژن‌سازی با اسید گلیکولیک خالص ۱۰٪، ماتریکسیل ۳۰۰۰ و سیستم رهایش کنترل‌شده CO2 جهت بهبود خطوط چهره، یکدستی بافت و جوانسازی عمیق اپیدرم.',
        categorySlug: 'reeskin',
        brandSlug: 'reeskin',
        variants: [
          { sku: 'DD-GLY-500ML', titleFa: 'مخزن ۵۰۰ میلی‌لیتر تخصصی', price: '52000000', stock: 25 },
          { sku: 'DD-GLY-50ML', titleFa: 'تیوب ۵۰ میلی‌لیتر هوم‌کر', price: '9800000', stock: 40 },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'کربوکسی‌ژل اسید گلیکولیک ۱۰٪ دکتر درمر انگلستان',
            url: '/assets/drdermer/2025/07/glycolic-acid-carboxygel.png',
            width: 1062,
            height: 1536,
            mimeType: 'image/png',
            isPrimary: true,
          },
          {
            role: 'DETAIL' as const,
            sortOrder: 2,
            altText: 'بسته‌بندی رسمی کربوکسی‌ژل اسید گلیکولیک ۱۰٪',
            url: '/assets/drdermer/2025/07/glycolic-acid-carboxygel-600x600.png',
            width: 600,
            height: 600,
            mimeType: 'image/png',
            isPrimary: false,
          },
        ],
        ingredients: [
          {
            name: 'اسید گلیکولیک فوق خالص ۱۰٪',
            inciName: 'Glycolic Acid',
            concentrationPercent: '10.00',
            purpose: 'لایه‌برداری عمقی، نوسازی سلولی و تسریع بازسازی لایه شاخی',
            isKeyIngredient: true,
            description: 'کوچک‌ترین مولکول AHA با نفوذ سریع به اپیدرم جهت تحریک سنتز گلیکوزآمینوگلیکان‌ها.',
            sortOrder: 1,
          },
          {
            name: 'سدیم بی‌کربنات دارویی ۸.۵٪',
            inciName: 'Sodium Bicarbonate',
            concentrationPercent: '8.50',
            purpose: 'تولید موضعی میکروحباب‌های گاز دی‌اکسید کربن فعال',
            isKeyIngredient: true,
            description: 'واکنش گازی جهت القای اثر بوهر و افزایش ترشح اکسیژن به بافت پوست.',
            sortOrder: 2,
          },
          {
            name: 'پپتید ماتریکسیل ۳۰۰۰',
            inciName: 'Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7',
            concentrationPercent: '3.00',
            purpose: 'تحریک بیوسنتز ماتریکس خارج سلولی و الاستین',
            isKeyIngredient: true,
            description: 'ترمیم ماتریکس بین‌سلولی و کاهش عمق چروک‌های پوستی.',
            sortOrder: 3,
          },
        ],
        claims: [
          {
            claimText: 'کاهش ۳۸ درصدی عمق خطوط و چروک‌های پوستی پس از دوره ۴ هفته‌ای',
            evidenceSummary: 'سنجش سه‌بعدی پروفایلومتری اپیدرم در کارآزمایی بالینی کمبریج.',
            studyReference: 'British Journal of Clinical Skincare, 2024; Vol 19(2): 88-96',
            approvedBy: 'دکتر جیمز کارتر',
            status: 'APPROVED' as const,
          },
          {
            claimText: 'تسریع گردش سلولی لایه شاخی و درخشندگی محسوس چهره از هفته اول',
            evidenceSummary: 'ارزیابی کروماتوگرافی ملانین و زبری بافت روی ۴۰ داوطلب.',
            studyReference: 'ReeSkin Glycolic Formulation Trial RS-GLY-2024',
            approvedBy: 'دکتر مریم رادمنش',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          { stepNumber: 1, title: 'آماده‌سازی پوست', instruction: 'پوست را کاملاً تمیز و خشک نمایید.' },
          { stepNumber: 2, title: 'اپلیکیشن کربوکسی‌ژل گلیکولیک', instruction: 'ژل را با ضخامت یکنواخت روی پوست صورت پخش کرده و پد فعال‌ساز را روی آن فیکس نمایید.' },
          { stepNumber: 3, title: 'آبکشی و مرطوب‌سازی', instruction: 'پس از ۱۵ الی ۲۰ دقیقه ژل را با آب ولرم شسته و از مرطوب‌کننده یا ژل هیلین استفاده نمایید.' },
        ],
        concernSlugs: ['anti-aging', 'dullness'],
      },
      {
        slug: 'multi-active-carboxygel',
        titleFa: 'کربوکسی‌ژل مولتی‌اکتیو و ترمیم‌کننده پوست‌های حساس Multi-Active CarboxyGel',
        description: 'فرمولاسیون بازسازی‌کننده و ضدالتهاب حاوی سرامید NP، فاکتورهای رشد بیومیمتیک، نیاسینامید و کمپلکس سیکا جهت تسکین سریع قرمزی، ترمیم سد دفاعی و اکسیژن‌رسانی به پوست‌های حساس و تحریک‌پذیر.',
        categorySlug: 'reemed',
        brandSlug: 'reemed',
        variants: [
          { sku: 'DD-MAC-500ML', titleFa: 'مخزن ۵۰۰ میلی‌لیتر تخصصی', price: '49500000', stock: 30 },
          { sku: 'DD-MAC-50ML', titleFa: 'تیوب ۵۰ میلی‌لیتر هوم‌کر', price: '9200000', stock: 45 },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'کربوکسی‌ژل مولتی‌اکتیو دکتر درمر انگلستان',
            url: '/assets/drdermer/2025/07/multi-active-carboxygel.png',
            width: 1062,
            height: 1536,
            mimeType: 'image/png',
            isPrimary: true,
          },
          {
            role: 'DETAIL' as const,
            sortOrder: 2,
            altText: 'بسته‌بندی رسمی کربوکسی‌ژل مولتی‌اکتیو',
            url: '/assets/drdermer/2025/07/multi-active-carboxygel-600x600.png',
            width: 600,
            height: 600,
            mimeType: 'image/png',
            isPrimary: false,
          },
        ],
        ingredients: [
          {
            name: 'کمپلکس سرامید NP و اسفنگولیپیدها',
            inciName: 'Ceramide NP, Sphingolipids',
            concentrationPercent: '2.50',
            purpose: 'بازسازی لایه لیپیدی دوجداره و کاهش نفوذپذیری محرک‌ها',
            isKeyIngredient: true,
            description: 'تقویت پیوند بین‌سلولی اپیدرم و مهار تبخیر سطحی رطوبت.',
            sortOrder: 1,
          },
          {
            name: 'سدیم بی‌کربنات ملایم ۸.۰٪',
            inciName: 'Sodium Bicarbonate',
            concentrationPercent: '8.00',
            purpose: 'تولید گاز CO2 فیزیولوژیک جهت افزایش ریزگردش خون',
            isKeyIngredient: true,
            description: 'رهایش ملایم گاز کربنیک بدون ایجاد سوزش یا قرمزی پوستی.',
            sortOrder: 2,
          },
          {
            name: 'عصاره تخمیری سنتلا و مادکاسوساید',
            inciName: 'Madecassoside, Fermented Centella Asiatica',
            concentrationPercent: '4.00',
            purpose: 'مهار مسیرهای پیش‌التهابی IL-6 و کاهش اریتم',
            isKeyIngredient: true,
            description: 'التیام آنی سوزش و تقویت سد بیولوژیک پوست‌های حساس.',
            sortOrder: 3,
          },
        ],
        claims: [
          {
            claimText: 'کاهش ۵۵ درصدی تبخیر سطحی آب (TEWL) و بازسازی سد دفاعی طی ۲ هفته',
            evidenceSummary: 'سنجش با تیوامتر در ارزیابی بالینی بیماران پوست حساس.',
            studyReference: 'European Journal of Dermatological Science 2024',
            approvedBy: 'دکتر مارکوس وبر',
            status: 'APPROVED' as const,
          },
          {
            claimText: 'مهار فوری احساس سوزش و کاهش ۷۲ درصدی قرمزی و التهاب واکنشی',
            evidenceSummary: 'آزمون کالریمتری سطح پوست پس از اعمال موضعی روی ۵۰ داوطلب.',
            studyReference: 'ReeSkin Multi-Active Tolerance Study RS-MAC-2024',
            approvedBy: 'دکتر مریم رادمنش',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          { stepNumber: 1, title: 'پاکسازی اولیه پوست', instruction: 'پوست را با پاک‌کننده ملایم و فاقد الکل شسته و با ملایمت خشک کنید.' },
          { stepNumber: 2, title: 'اعمال ژل مولتی‌اکتیو', instruction: 'لایه یکنواخت از ژل را روی نواحی حساس یا قرمز پخش کرده و پد CarboxyPad را به آرامی روی آن بگذارید.' },
          { stepNumber: 3, title: 'پایان پروسیجر و مراقبت', instruction: 'پس از ۱۵ دقیقه با آب ولرم آبکشی نموده و در صورت نیاز از ژل هیلین استفاده نمایید.' },
        ],
        concernSlugs: ['sensitivity-redness', 'anti-aging'],
      },
    ];

    for (const item of products) {
      const brandId = item.brandSlug ? brandMap.get(item.brandSlug) ?? null : null;
      const categoryId = categoryMap.get(item.categorySlug) ?? null;

      const product = await prisma.product.upsert({
        where: { storeId_slug: { storeId: store.id, slug: item.slug } },
        update: {
          tenantId: tenant.id,
          titleFa: item.titleFa,
          description: item.description,
          categoryId,
          brandId,
          kind: 'PHYSICAL',
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
        create: {
          tenantId: tenant.id,
          storeId: store.id,
          categoryId,
          brandId,
          kind: 'PHYSICAL',
          slug: item.slug,
          titleFa: item.titleFa,
          description: item.description,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });

      // Clear & Seed Media
      await prisma.productMedia.deleteMany({ where: { productId: product.id } });
      for (const m of item.media) {
        const allowedRoles = ['HERO', 'GALLERY', 'LIFESTYLE', 'DETAIL', 'HOW_TO', 'CERTIFICATE'] as const;
        const validRole = allowedRoles.includes(m.role as any) ? (m.role as any) : 'DETAIL';
        await prisma.productMedia.create({
          data: {
            tenantId: tenant.id,
            storeId: store.id,
            productId: product.id,
            role: validRole,
            sortOrder: m.sortOrder,
            altText: m.altText,
            url: m.url,
            width: m.width,
            height: m.height,
            mimeType: m.mimeType,
            isPrimary: m.isPrimary,
          },
        });
      }

      // Clear & Seed Ingredients
      await prisma.productIngredient.deleteMany({ where: { productId: product.id } });
      for (const ing of item.ingredients) {
        await prisma.productIngredient.create({
          data: {
            tenantId: tenant.id,
            storeId: store.id,
            productId: product.id,
            name: ing.name,
            inciName: ing.inciName,
            concentrationPercent: ing.concentrationPercent,
            purpose: ing.purpose,
            isKeyIngredient: ing.isKeyIngredient,
            description: ing.description,
            sortOrder: ing.sortOrder,
          },
        });
      }

      // Clear & Seed Claims
      await prisma.clinicalClaim.deleteMany({ where: { productId: product.id } });
      for (const c of item.claims) {
        await prisma.clinicalClaim.create({
          data: {
            tenantId: tenant.id,
            storeId: store.id,
            productId: product.id,
            claimText: c.claimText,
            evidenceSummary: c.evidenceSummary,
            studyReference: c.studyReference,
            approvedBy: c.approvedBy,
            status: c.status,
          },
        });
      }

      // Clear & Seed Usage Steps
      await prisma.usageStep.deleteMany({ where: { productId: product.id } });
      for (const step of item.usageSteps) {
        await prisma.usageStep.create({
          data: {
            tenantId: tenant.id,
            storeId: store.id,
            productId: product.id,
            stepNumber: step.stepNumber,
            title: step.title,
            instruction: step.instruction,
          },
        });
      }

      // Clear & Seed Skin Concerns
      await prisma.productSkinConcern.deleteMany({ where: { productId: product.id } });
      for (const slug of item.concernSlugs) {
        const concernId = concernMap.get(slug);
        if (concernId) {
          await prisma.productSkinConcern.create({
            data: {
              tenantId: tenant.id,
              storeId: store.id,
              productId: product.id,
              concernId,
            },
          });
        }
      }

      // Seed Variants & Inventory
      for (const v of item.variants) {
        const variant = await prisma.productVariant.upsert({
          where: { sku: v.sku },
          update: {
            tenantId: tenant.id,
            storeId: store.id,
            productId: product.id,
            titleFa: v.titleFa,
            priceAmount: v.price,
            currency: 'IRR',
            status: 'ACTIVE',
          },
          create: {
            tenantId: tenant.id,
            storeId: store.id,
            productId: product.id,
            sku: v.sku,
            titleFa: v.titleFa,
            priceAmount: v.price,
            currency: 'IRR',
            status: 'ACTIVE',
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
          update: { onHandQty: v.stock, reservedQty: 0 },
          create: {
            tenantId: tenant.id,
            storeId: store.id,
            variantId: variant.id,
            warehouseCode: 'MAIN',
            onHandQty: v.stock,
            reservedQty: 0,
          },
        });
      }
    }

    // ── 6b. Subscription Plans (ADR-009) ──
    const plansData = [
      {
        slug: 'carboxy-monthly-supply',
        titleFa: 'اشتراک ماهانه کیت کربوکسی‌تراپی',
        description: 'ارسال ماهانه کیت خانگی CarboxyGel و پدهای فعال‌ساز درب منزل.',
        intervalDays: 30,
        price: '19500000',
        variantSku: 'CBG-HOME-5X',
      },
      {
        slug: 'healene-bimonthly-care',
        titleFa: 'اشتراک دوماهه ژل ترمیم‌کننده هیلین',
        description: 'تأمین دوره‌ای ژل تسکین‌بخش و ترمیم سد دفاعی پوست.',
        intervalDays: 60,
        price: '16000000',
        variantSku: 'DD-HEA-250ML',
      },
      {
        slug: 'clinic-carboxy-quarterly',
        titleFa: 'اشتراک فصلی شارژ تخصصی CarboxyGel',
        description: 'پک فصلی مخزن ۵۰۰ میلی‌لیتری CarboxyGel و پدهای فعال‌ساز.',
        intervalDays: 90,
        price: '48500000',
        variantSku: 'CBG-PRO-500ML',
      },
      {
        slug: 'coffee-monthly-ethiopia',
        titleFa: 'اشتراک ماهانه درموسوتیکال دکتر درمر',
        description: 'ارسال ماهانه پک فرآورده‌های درماتولوژی بالینی.',
        intervalDays: 30,
        price: '19500000',
        variantSku: 'CBG-HOME-5X',
      },
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

    // ── 7. Chart of Accounts (COA) ──
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

    // ── 8. Active Coupons ──
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

    await prisma.coupon.upsert({
      where: {
        tenantId_storeId_code: {
          tenantId: tenant.id,
          storeId: store.id,
          code: 'DERMER20',
        },
      },
      update: { discountBps: 2000, maxDiscount: '10000000' },
      create: {
        tenantId: tenant.id,
        storeId: store.id,
        code: 'DERMER20',
        discountBps: 2000, // 20%
        maxDiscount: '10000000', // 1,000,000 Tomans
        usageLimit: 1000,
        expiresAt: new Date(Date.now() + 180 * 24 * 3600 * 1000),
      },
    });

    // ── 9. Shipping Methods ──
    const shippingMethods = [
      { code: 'POST_PISHTAZ', carrier: 'IRAN_POST', titleFa: 'پست پیشتاز سراسری (زنجیره دماپای)', baseFee: '500000' },
      { code: 'TIPAX_EXPRESS', carrier: 'TIPAX', titleFa: 'تیپاکس اکسپرس ویژه کیت‌های بالینی و درموسوتیکال', baseFee: '850000' },
      { code: 'ALOPEYK_ON_DEMAND', carrier: 'ALOPEYK', titleFa: 'پیک فوری درون‌شهری (حمل تخصصی درموسوتیکال)', baseFee: '750000' },
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

    console.log('✅ Database successfully seeded with 8 authentic Dr Dermer products, users, accounts, and methods.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Seed execution error:', error);
  process.exitCode = 1;
});
