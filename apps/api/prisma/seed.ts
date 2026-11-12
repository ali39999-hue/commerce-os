import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
dotenv.config({ path: '.env', override: false });
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { CHART_OF_ACCOUNTS } from '@commerce-os/finance';
import { SEED_CATEGORIES, SEED_BRANDS, SEED_SKIN_CONCERNS, SEED_PRODUCTS } from './catalog-seed-data';

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
      update: { role: 'SUPER_ADMIN', fullName: 'مدیر ارشد کلینیک درمر' },
      create: {
        tenantId: tenant.id,
        phone: '09121111111',
        email: 'admin@commerce-os.local',
        fullName: 'مدیر ارشد کلینیک درمر',
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

    // 4. Categories (Full Clinical & Storefront Taxonomy)
    const categoryMap = new Map<string, string>();
    for (const c of SEED_CATEGORIES) {
      const cat = await prisma.category.upsert({
        where: { storeId_slug: { storeId: store.id, slug: c.slug } },
        update: {
          titleFa: c.titleFa,
          description: c.description,
          imageUrl: c.imageUrl,
          sortOrder: c.sortOrder,
        },
        create: {
          tenantId: tenant.id,
          storeId: store.id,
          slug: c.slug,
          titleFa: c.titleFa,
          description: c.description,
          imageUrl: c.imageUrl,
          sortOrder: c.sortOrder,
        },
      });
      categoryMap.set(c.slug, cat.id);
    }

    // 5. Vendors (ADR-011 foundation)
    const vendorsData = [
      { slug: 'roast-coffee', titleFa: 'روست قهوه', description: 'تأمین‌کننده تجهیزات جانبی.', logoColor: '#6F4E37', commissionBps: 800 },
      { slug: 'brew-studio', titleFa: 'استودیو دم‌آوری', description: 'آموزش و محتوای تخصصی.', logoColor: '#0B6E66', commissionBps: 1500 },
    ];
    for (const v of vendorsData) {
      await prisma.vendor.upsert({
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
    }

    // ── 5b. Authentic Brands (ReeSkin, ReeMed & Storefront Cosmeceuticals) ──
    const brandMap = new Map<string, string>();
    for (const b of SEED_BRANDS) {
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
    const concernMap = new Map<string, string>();
    for (const sc of SEED_SKIN_CONCERNS) {
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

    // ── 5d. Clean up legacy non-skincare & duplicate orphan products if existing ──
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
      'carboxygel-professional-therapy',
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

    // Clean up unused legacy non-beauty categories if zero products reference them
    for (const staleCatSlug of ['bags', 'coffee', 'digital', 'home']) {
      const staleCat = await prisma.category.findUnique({
        where: { storeId_slug: { storeId: store.id, slug: staleCatSlug } },
        include: { _count: { select: { products: true } } },
      });
      if (staleCat && staleCat._count.products === 0) {
        await prisma.category.delete({ where: { id: staleCat.id } });
      }
    }


    // ── 6. Full Lossless Product & Variant Catalog Seed ──
    const allowedMediaRoles = [
      'HERO',
      'GALLERY',
      'LIFESTYLE',
      'DETAIL',
      'TEXTURE',
      'IN_CLINIC',
      'PACKAGING',
      'HOW_TO',
      'CERTIFICATE',
    ] as const;

    for (const item of SEED_PRODUCTS) {
      const brandId = item.brandSlug ? brandMap.get(item.brandSlug) ?? null : null;
      const categoryId = categoryMap.get(item.categorySlug) ?? null;

      const product = await prisma.product.upsert({
        where: { storeId_slug: { storeId: store.id, slug: item.slug } },
        update: {
          tenantId: tenant.id,
          titleFa: item.titleFa,
          subtitleFa: item.subtitleFa,
          scientificName: item.scientificName,
          formulation: item.formulation,
          badge: item.badge,
          ratingValue: item.ratingValue,
          reviewCount: item.reviewCount,
          isFeatured: item.isFeatured,
          isSpecialOffer: item.isSpecialOffer,
          isNewest: item.isNewest,
          coldChainRequired: item.coldChainRequired,
          sortOrder: item.sortOrder,
          clinicalData: item.clinicalData,
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
          subtitleFa: item.subtitleFa,
          scientificName: item.scientificName,
          formulation: item.formulation,
          badge: item.badge,
          ratingValue: item.ratingValue,
          reviewCount: item.reviewCount,
          isFeatured: item.isFeatured,
          isSpecialOffer: item.isSpecialOffer,
          isNewest: item.isNewest,
          coldChainRequired: item.coldChainRequired,
          sortOrder: item.sortOrder,
          clinicalData: item.clinicalData,
          description: item.description,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });

      // Clear & Seed Media
      await prisma.productMedia.deleteMany({ where: { productId: product.id } });
      for (const m of item.media) {
        const validRole = allowedMediaRoles.includes(m.role as any) ? (m.role as any) : 'DETAIL';
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
            sizeOrVolume: v.sizeOrVolume,
            priceAmount: v.price,
            originalPriceAmount: v.originalPrice,
            discountPercent: v.discountPercent,
            isRecommended: v.isRecommended,
            mediaRoleMatch: v.mediaRoleMatch,
            sortOrder: v.sortOrder,
            currency: 'IRR',
            status: 'ACTIVE',
          },
          create: {
            tenantId: tenant.id,
            storeId: store.id,
            productId: product.id,
            sku: v.sku,
            titleFa: v.titleFa,
            sizeOrVolume: v.sizeOrVolume,
            priceAmount: v.price,
            originalPriceAmount: v.originalPrice,
            discountPercent: v.discountPercent,
            isRecommended: v.isRecommended,
            mediaRoleMatch: v.mediaRoleMatch,
            sortOrder: v.sortOrder,
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
        titleFa: 'اشتراک فصلی شارژ کابین کلینیکال',
        description: 'پک فصلی مخزن ۵۰۰ میلی‌لیتری CarboxyGel و پدهای فعال‌ساز مخصوص مراکز درمانی.',
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

    // ── 8. Active Coupons (Public B2C, B2B Clinic & Sales Visitor Targeting) ──
    await prisma.coupon.upsert({
      where: {
        tenantId_storeId_code: {
          tenantId: tenant.id,
          storeId: store.id,
          code: 'WELCOME10',
        },
      },
      update: {
        titleFa: 'خوش‌آمدگویی سفارش اول کلینیکال',
        discountBps: 1000,
        isActive: true,
        audienceType: 'PUBLIC',
        customerSegment: 'B2C',
        b2bOnly: false,
      },
      create: {
        tenantId: tenant.id,
        storeId: store.id,
        code: 'WELCOME10',
        titleFa: 'خوش‌آمدگویی سفارش اول کلینیکال',
        isActive: true,
        audienceType: 'PUBLIC',
        customerSegment: 'B2C',
        b2bOnly: false,
        discountBps: 1000, // 10%
        maxDiscount: '5000000', // 500,000 Tomans
        usageLimit: 500,
        perUserLimit: 1,
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
      update: {
        titleFa: 'تخفیف ۵۰ هزار تومانی سبد عمومی',
        fixedDiscount: '500000',
        isActive: true,
        audienceType: 'PUBLIC',
        customerSegment: 'ALL',
      },
      create: {
        tenantId: tenant.id,
        storeId: store.id,
        code: 'OFF50',
        titleFa: 'تخفیف ۵۰ هزار تومانی سبد عمومی',
        isActive: true,
        audienceType: 'PUBLIC',
        customerSegment: 'ALL',
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
      update: {
        titleFa: 'کمپین ویژه Dr Dermer UK (۲۰٪)',
        discountBps: 2000,
        maxDiscount: '10000000',
        isActive: true,
        audienceType: 'PUBLIC',
        customerSegment: 'ALL',
      },
      create: {
        tenantId: tenant.id,
        storeId: store.id,
        code: 'DERMER20',
        titleFa: 'کمپین ویژه Dr Dermer UK (۲۰٪)',
        isActive: true,
        audienceType: 'PUBLIC',
        customerSegment: 'ALL',
        discountBps: 2000, // 20%
        maxDiscount: '10000000', // 1,000,000 Tomans
        usageLimit: 1000,
        expiresAt: new Date(Date.now() + 180 * 24 * 3600 * 1000),
      },
    });

    await prisma.coupon.upsert({
      where: {
        tenantId_storeId_code: {
          tenantId: tenant.id,
          storeId: store.id,
          code: 'CLINIC25',
        },
      },
      update: {
        titleFa: 'سهمیه قراردادی B2B کلینیک فوق تخصصی اکسیر ونک',
        isActive: true,
        audienceType: 'B2B_CLINIC',
        customerSegment: 'B2B',
        b2bOnly: true,
        clinicName: 'کلینیک فوق تخصصی اکسیر ونک',
        clinicLicenseNumber: 'MED-992140',
        allowedPhones: ['09123333333', '09121111111'],
        discountBps: 2500,
        minSubtotal: '15000000',
        maxDiscount: '80000000',
        usageLimit: 100,
        perUserLimit: 10,
      },
      create: {
        tenantId: tenant.id,
        storeId: store.id,
        code: 'CLINIC25',
        titleFa: 'سهمیه قراردادی B2B کلینیک فوق تخصصی اکسیر ونک',
        isActive: true,
        audienceType: 'B2B_CLINIC',
        customerSegment: 'B2B',
        b2bOnly: true,
        clinicName: 'کلینیک فوق تخصصی اکسیر ونک',
        clinicLicenseNumber: 'MED-992140',
        allowedPhones: ['09123333333', '09121111111'],
        discountBps: 2500, // 25% B2B contract rate
        minSubtotal: '15000000', // 1,500,000 Tomans
        maxDiscount: '80000000', // 8,000,000 Tomans
        usageLimit: 100,
        perUserLimit: 10,
        expiresAt: new Date(Date.now() + 180 * 24 * 3600 * 1000),
      },
    });

    await prisma.coupon.upsert({
      where: {
        tenantId_storeId_code: {
          tenantId: tenant.id,
          storeId: store.id,
          code: 'VISITOR15',
        },
      },
      update: {
        titleFa: 'کد اختصاصی ویزیتور علمی (مهندس سارا دانش)',
        isActive: true,
        audienceType: 'VISITOR_EXCLUSIVE',
        customerSegment: 'ALL',
        b2bOnly: false,
        visitorName: 'مهندس سارا دانش',
        visitorCode: 'VIS-DANESH-01',
        visitorPhone: '09124444444',
        discountBps: 1500,
        minSubtotal: '10000000',
        maxDiscount: '30000000',
        usageLimit: 300,
      },
      create: {
        tenantId: tenant.id,
        storeId: store.id,
        code: 'VISITOR15',
        titleFa: 'کد اختصاصی ویزیتور علمی (مهندس سارا دانش)',
        isActive: true,
        audienceType: 'VISITOR_EXCLUSIVE',
        customerSegment: 'ALL',
        b2bOnly: false,
        visitorName: 'مهندس سارا دانش',
        visitorCode: 'VIS-DANESH-01',
        visitorPhone: '09124444444',
        discountBps: 1500, // 15%
        minSubtotal: '10000000', // 1,000,000 Tomans
        maxDiscount: '30000000', // 3,000,000 Tomans
        usageLimit: 300,
        expiresAt: new Date(Date.now() + 180 * 24 * 3600 * 1000),
      },
    });

    // ── 9. Shipping Methods ──
    const shippingMethods = [
      { code: 'POST_PISHTAZ', carrier: 'IRAN_POST', titleFa: 'پست پیشتاز سراسری (زنجیره دماپای)', baseFee: '500000' },
      { code: 'TIPAX_EXPRESS', carrier: 'TIPAX', titleFa: 'تیپاکس اکسپرس ویژه تجهیزات و کیت‌های بالینی', baseFee: '850000' },
      { code: 'ALOPEYK_ON_DEMAND', carrier: 'ALOPEYK', titleFa: 'پیک فوری درون‌شهری (حمل تخصصی مطب و کلینیک)', baseFee: '750000' },
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
