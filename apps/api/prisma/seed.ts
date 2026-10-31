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
      { slug: 'skincare', titleFa: 'مراقبت تخصصی پوست و کلینیکال' },
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

    // ── 5b. Brands (PIM) ──
    const brandsData = [
      {
        slug: 'reeskin-clinical',
        name: 'ReeSkin Clinical',
        description: 'برند پیشرو در درماتولوژی، فرمولاسیون‌های بالینی و اکتیوهای اثبات‌شده پوستی.',
        logoUrl: 'https://cdn.commerce-os.local/brands/reeskin.svg',
        websiteUrl: 'https://reeskin.local',
        originCountry: 'South Korea',
      },
      {
        slug: 'reemed-laboratories',
        name: 'ReeMed Laboratories',
        description: 'لابراتوار درماتولوژی تخصصی سوئیس با تمرکز بر آنتی‌ایجینگ سلولی و پپتیددرمانی.',
        logoUrl: 'https://cdn.commerce-os.local/brands/reemed.svg',
        websiteUrl: 'https://reemed.local',
        originCountry: 'Switzerland',
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
        description: 'پوست‌های کدر و فاقد اکسیژن به دلیل استرس محیطی و آلودگی هوا',
        iconUrl: 'https://cdn.commerce-os.local/concerns/dullness.svg',
      },
      {
        slug: 'anti-aging',
        name: 'کاهش الاستیسیته و پیری زودرس',
        description: 'خطوط ریز، کاهش سفتی پوست و افت سنتز کلاژن',
        iconUrl: 'https://cdn.commerce-os.local/concerns/anti-aging.svg',
      },
      {
        slug: 'sensitivity-redness',
        name: 'خشکی، حساسیت و قرمزی',
        description: 'سد دفاعی آسیب‌دیده، رزاسه و التهاب بعد از لیزر و پیلینگ',
        iconUrl: 'https://cdn.commerce-os.local/concerns/sensitivity.svg',
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

    // ── 6c. Clinical Skincare Products (PIM/DAM/Clinical Knowledge) ──
    const clinicalProducts = [
      {
        slug: 'carboxygel-professional-therapy',
        titleFa: 'ژل کربوکسی تراپی تخصصی کلینیکال CarboxyGel Professional Therapy',
        description: 'سیستم کربوکسی تراپی غیرتهاجمی با تولید دی‌اکسید کربن فعال (Bohr Effect) جهت اکسیژن‌رسانی عمیق بافتی، تحریک فیبروبلاست‌ها و کلاژن‌سازی تخصصی در کلینیک.',
        categorySlug: 'skincare',
        brandSlug: 'reeskin-clinical',
        vendorSlug: null,
        variants: [
          {
            sku: 'CBG-PRO-500ML',
            titleFa: 'پک حرفه‌ای کلینیکال ۵۰۰ میلی‌لیتر (همراه با ۲۰ ماسک صورت)',
            price: '48500000',
            stock: 25,
          },
          {
            sku: 'CBG-HOME-5X',
            titleFa: 'کیت خانگی ۵ عددی (۵ تیوب ۲۵ میلی‌لیتر + ۵ ماسک)',
            price: '19500000',
            stock: 40,
          },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'ژل کربوکسی تراپی تخصصی ۵۰۰ میلی‌لیتر کلینیکال',
            url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
            width: 800,
            height: 800,
            mimeType: 'image/jpeg',
            isPrimary: true,
          },
          {
            role: 'GALLERY' as const,
            sortOrder: 2,
            altText: 'بسته‌بندی حرفه‌ای پک کامل کربوکسی ژل و پد فعال‌ساز',
            url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
            width: 800,
            height: 800,
            mimeType: 'image/jpeg',
            isPrimary: false,
          },
          {
            role: 'HOW_TO' as const,
            sortOrder: 3,
            altText: 'نحوه استفاده از کربوکسی ژل روی پوست صورت',
            url: 'https://images.unsplash.com/photo-1512290900672-1f41d9961be4?auto=format&fit=crop&w=800&q=80',
            width: 800,
            height: 800,
            mimeType: 'image/jpeg',
            isPrimary: false,
          },
        ],
        ingredients: [
          {
            name: 'سدیم بی‌کربنات',
            inciName: 'Sodium Bicarbonate',
            concentrationPercent: '8.50',
            purpose: 'واکنش گاز CO2 و اکسیژن‌رسانی',
            isKeyIngredient: true,
            description: 'ماده پایه ایجاد گاز دی‌اکسید کربن در سطح پوست و تحریک جریان خون میکروسکوپی.',
            sortOrder: 1,
          },
          {
            name: 'عصاره سنتلا آسیاتیکا',
            inciName: 'Centella Asiatica Extract',
            concentrationPercent: '5.00',
            purpose: 'ترمیم‌کننده و ضدالتهاب',
            isKeyIngredient: true,
            description: 'تسکین‌دهنده قوی التهاب و تسریع روند بازسازی اپیدرم.',
            sortOrder: 2,
          },
          {
            name: 'هیالورونیک اسید با وزن مولکولی چندگانه',
            inciName: 'Sodium Hyaluronate',
            concentrationPercent: '2.00',
            purpose: 'آبرسانی عمقی',
            isKeyIngredient: true,
            description: 'جذب رطوبت لایه‌های اپیدرم و هیدراتاسیون پایدار.',
            sortOrder: 3,
          },
        ],
        claims: [
          {
            claimText: 'افزایش ۴۵ درصدی میزان اکسیژن‌رسانی ریزگردشی پوستی طی ۲۰ دقیقه پس از مصرف',
            evidenceSummary: 'سنجش ترنس‌کیوتانیوس اکسیژن با پالس اکسی‌متری بافتی در کارآزمایی بالینی تصادفی دو سو کور.',
            studyReference: 'Journal of Clinical Dermatology, Vol 42, 2024, pp 112-119',
            approvedBy: 'دکتر مریم رادمنش (مسئول فنی درماتولوژی)',
            status: 'APPROVED' as const,
          },
          {
            claimText: 'روشن‌کنندگی و بهبود بافت خسته و کدری پوست از جلسه نخست',
            evidenceSummary: 'ثبت اسپکتروفتومتری ملانین و زبری پوست روی ۵۰ داوطلب کلینیکی.',
            studyReference: 'ReeSkin Clinical Evaluation Trial RS-2024-CBG',
            approvedBy: 'دکتر نوید کمالی (پاتولوژیست و رگولاتوری)',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          {
            stepNumber: 1,
            title: 'پاکسازی اولیه',
            instruction: 'پوست را با شوینده ملایم غیرصابونی شسته و کاملاً خشک نمایید.',
          },
          {
            stepNumber: 2,
            title: 'اپلیکیشن ژل',
            instruction: 'مقدار مناسبی از ژل را با کاردک استریل به ضخامت ۲ میلی‌متر روی کل پوست صورت بمالید.',
          },
          {
            stepNumber: 3,
            title: 'قرار دادن ماسک فعال‌ساز و جذب',
            instruction: 'ماسک فعال‌کننده خشک را روی صورت قرار دهید و به آرامی فشار دهید تا واکنش حباب‌های CO2 آغاز شود. پس از ۲۰ دقیقه بردارید و با آب ولرم آبکشی نمایید.',
          },
        ],
        concernSlugs: ['dullness', 'anti-aging'],
      },
      {
        slug: 'reeskin-gentle-hydrating-cleanser',
        titleFa: 'شوینده ملایم و آبرسان پوست حساس ReeSkin Gentle Hydrating Cleanser',
        description: 'فرمولاسیون سیندت ژل بدون صابون با سرامیدهای بیومیمتیک، آمینواسیدهای خالص و پنتنول برای محافظت از سد دفاعی پوست.',
        categorySlug: 'skincare',
        brandSlug: 'reeskin-clinical',
        vendorSlug: null,
        variants: [
          {
            sku: 'RS-CLN-200ML',
            titleFa: 'حجم ۲۰۰ میلی‌لیتر پمپی',
            price: '8900000',
            stock: 60,
          },
          {
            sku: 'RS-CLN-500ML',
            titleFa: 'حجم سالنی و کلینیکی ۵۰۰ میلی‌لیتر',
            price: '17200000',
            stock: 30,
          },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'شوینده آبرسان ملایم ری‌اسکین ۲۰۰ میلی‌لیتر',
            url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
            width: 800,
            height: 800,
            mimeType: 'image/jpeg',
            isPrimary: true,
          },
        ],
        ingredients: [
          {
            name: 'کمپلکس سرامید NP, AP, EOP',
            inciName: 'Ceramide NP, Ceramide AP, Ceramide EOP',
            concentrationPercent: '1.50',
            purpose: 'ترمیم سد دفاعی',
            isKeyIngredient: true,
            description: 'لیپیدهای ساختاری مشابه پوست جهت جلوگیری از خشکی و احساس کشیدگی.',
            sortOrder: 1,
          },
          {
            name: 'پنتنول (پروویتامین B5)',
            inciName: 'Panthenol',
            concentrationPercent: '3.00',
            purpose: 'تسکین‌دهنده و آبرسان',
            isKeyIngredient: true,
            description: 'افزایش فاکتورهای مرطوب‌کننده طبیعی پوست (NMF).',
            sortOrder: 2,
          },
        ],
        claims: [
          {
            claimText: 'عدم تضعیف سد لیپیدی پوست و حفظ pH فیزیولوژیک ۵.۵ پس از شستشو',
            evidenceSummary: 'ارزیابی TEWL و ترانسیدرمال واتر لوس در آزمون کلینیکی ۶ ساعته.',
            studyReference: 'Dermatological Safety Profile RS-CL-101',
            approvedBy: 'دکتر مریم رادمنش',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          {
            stepNumber: 1,
            title: 'ماساژ روی پوست مرطوب',
            instruction: 'مقدار یک تا دو پمپ را روی صورت مرطوب به مدت ۶۰ ثانیه به آرامی با حرکات دورانی ماساژ دهید.',
          },
          {
            stepNumber: 2,
            title: 'آبکشی',
            instruction: 'با آب ولرم شسته و با حوله تمیز با ضربات ملایم خشک نمایید.',
          },
        ],
        concernSlugs: ['sensitivity-redness'],
      },
      {
        slug: 'reemed-cellular-renewal-serum',
        titleFa: 'سرم بازسازی سلولی پیشرفته ReeMed Cellular Renewal Serum',
        description: 'فرمولاسیون بیوتکنولوژی متشکل از فاکتورهای رشد پپتیدی (EGF/FGF)، باکوچیول خالص ۱.۵٪ و نیاسینامید ۴٪ برای تجدید لایه درمیس و رفع خطوط پیری.',
        categorySlug: 'skincare',
        brandSlug: 'reemed-laboratories',
        vendorSlug: null,
        variants: [
          {
            sku: 'RM-SER-30ML',
            titleFa: 'شیشه قطره‌چکانی ۳۰ میلی‌لیتر',
            price: '28500000',
            stock: 35,
          },
          {
            sku: 'RM-SER-100ML',
            titleFa: 'پک کلینیکی و کابین ۱۰۰ میلی‌لیتر',
            price: '64000000',
            stock: 15,
          },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'سرم سلولی بازسازی پوست ری‌مد ۳۰ میلی‌لیتر',
            url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
            width: 800,
            height: 800,
            mimeType: 'image/jpeg',
            isPrimary: true,
          },
        ],
        ingredients: [
          {
            name: 'کمپلکس فاکتورهای رشد بیومیمتیک (sh-Oligopeptide-1)',
            inciName: 'sh-Oligopeptide-1 (EGF)',
            concentrationPercent: '0.20',
            purpose: 'تحریک تکثیر سلولی و فیبروبلاست‌ها',
            isKeyIngredient: true,
            description: 'افزایش ساخت کلاژن نوع یک و الاستین در عمق درم.',
            sortOrder: 1,
          },
          {
            name: 'باکوچیول خالص',
            inciName: 'Bakuchiol',
            concentrationPercent: '1.50',
            purpose: 'جایگزین ملایم رتینول بدون تحریک پوستی',
            isKeyIngredient: true,
            description: 'تسریع گردش سلولی و بهبود بافت پوست بدون ایجاد حساسیت نوری.',
            sortOrder: 2,
          },
          {
            name: 'نیاسینامید دارویی',
            inciName: 'Niacinamide',
            concentrationPercent: '4.00',
            purpose: 'تقویت بریر و یکدست‌کننده رنگ پوست',
            isKeyIngredient: true,
            description: 'مهار انتقال ملانوزوم‌ها و تقویت سنتز سرامید طبیعی پوست.',
            sortOrder: 3,
          },
        ],
        claims: [
          {
            claimText: 'کاهش ۳۱ درصدی عمق چروک‌های پنجه کلاغی پس از ۲۸ روز مصرف منظم',
            evidenceSummary: 'تحلیل پرفیلوگرام سه‌بعدی پوستی در مطالعه بالینی ۵۰ نفره.',
            studyReference: 'European Journal of Aesthetic Medicine, Vol 18, 2024',
            approvedBy: 'دکتر مارکوس وبر (لابراتوار سوئیس)',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          {
            stepNumber: 1,
            title: 'مصرف شبانه',
            instruction: 'شب‌ها ۴ تا ۵ قطره از سرم را روی پوست تمیز صورت و گردن پخش نمایید.',
          },
          {
            stepNumber: 2,
            title: 'جذب و استفاده از مرطوب‌کننده',
            instruction: '۲ دقیقه صبر کنید تا سرم به طور کامل نفوذ کند، سپس از کرم ترمیم‌کننده بریر استفاده نمایید.',
          },
        ],
        concernSlugs: ['anti-aging'],
      },
      {
        slug: 'barrier-recovery-cream',
        titleFa: 'کرم ترمیم‌کننده و آرام‌بخش بریر Barrier Recovery Cream',
        description: 'فرمولاسیون درماتولوژیک با لیپیدهای لاملار، فیتواسترول‌ها، مادکاسوساید و سنتلا جهت بازسازی سریع آسیب‌های لایزر، پیلینگ، خشکی شدید و درماتیت آتوپیک.',
        categorySlug: 'skincare',
        brandSlug: 'reeskin-clinical',
        vendorSlug: null,
        variants: [
          {
            sku: 'RS-BRC-50ML',
            titleFa: 'تیوب ایرلس ۵۰ میلی‌لیتر',
            price: '14800000',
            stock: 45,
          },
          {
            sku: 'RS-BRC-100ML',
            titleFa: 'حجم حرفه‌ای ۱۰۰ میلی‌لیتر',
            price: '24800000',
            stock: 25,
          },
        ],
        media: [
          {
            role: 'HERO' as const,
            sortOrder: 1,
            altText: 'کرم بازسازی سد دفاعی پوست ۵۰ میلی‌لیتر',
            url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
            width: 800,
            height: 800,
            mimeType: 'image/jpeg',
            isPrimary: true,
          },
          {
            role: 'DETAIL' as const,
            sortOrder: 2,
            altText: 'بافت کرمی بدون چربی و جذب سریع',
            url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
            width: 800,
            height: 800,
            mimeType: 'image/jpeg',
            isPrimary: false,
          },
        ],
        ingredients: [
          {
            name: 'مادکاسوساید خالص ۹۵٪',
            inciName: 'Madecassoside',
            concentrationPercent: '0.50',
            purpose: 'ترمیم و التیام بافت پوست',
            isKeyIngredient: true,
            description: 'فعال‌ترین مولکول مشتق‌شده از سنتلا برای مهار سریع سایتوکین‌های التهابی.',
            sortOrder: 1,
          },
          {
            name: 'فیتواسترول‌ها و کلسترول گیاهی',
            inciName: 'Phytosterols',
            concentrationPercent: '2.00',
            purpose: 'بازسازی ماتریس بین‌سلولی',
            isKeyIngredient: true,
            description: 'تطابق کامل با نسبت فیزیولوژیک لیپیدهای اپیدرم (سرامید ۳ : کلسترول ۱ : اسید چرب ۱).',
            sortOrder: 2,
          },
        ],
        claims: [
          {
            claimText: 'ترمیم ۷۸ درصدی سد دفاعی آسیب‌دیده پوست ظرف مدت ۴۸ ساعت',
            evidenceSummary: 'سنجش ترنس‌اپیدرمال واتر لوس پس از تخریب عمدی استراتوم کورنئوم با SLS.',
            studyReference: 'Clinical Skin Research RS-BRC-2024',
            approvedBy: 'دکتر مریم رادمنش',
            status: 'APPROVED' as const,
          },
        ],
        usageSteps: [
          {
            stepNumber: 1,
            title: 'استفاده روزانه',
            instruction: 'صبح و شب پس از سرم یا روی پوست تمیز به عنوان مرحله محافظت نهایی استفاده کنید.',
          },
        ],
        concernSlugs: ['sensitivity-redness'],
      },
    ];

    for (const item of clinicalProducts) {
      const brandId = item.brandSlug ? brandMap.get(item.brandSlug) ?? null : null;
      const product = await prisma.product.upsert({
        where: { storeId_slug: { storeId: store.id, slug: item.slug } },
        update: {
          tenantId: tenant.id,
          titleFa: item.titleFa,
          description: item.description,
          categoryId: categoryMap.get(item.categorySlug),
          brandId,
          kind: 'PHYSICAL',
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
        create: {
          tenantId: tenant.id,
          storeId: store.id,
          categoryId: categoryMap.get(item.categorySlug),
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
        await prisma.productMedia.create({
          data: {
            tenantId: tenant.id,
            storeId: store.id,
            productId: product.id,
            role: m.role,
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
