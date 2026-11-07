import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';
import { DEMO_FALLBACK_PRODUCTS } from './demo-data';
import { DEFAULT_TENANT_ID } from '../common/guards/current-tenant.decorator';
import type { BulkUpdateProductsDto, CreateProductDto, UpdateProductDto } from '../common/dto/resource-writes.dto';
import type { Prisma, ProductStatus } from '../generated/prisma/client';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async resolveStore(slug: string) {
    if (!slug || slug.trim().length === 0) {
      throw new BadRequestException('شناسه فروشگاه الزامی است');
    }

    let store: { id: string; tenantId: string; slug: string; name: string } | null = null;
    let dbAvailable = true;
    try {
      store = await this.prisma.store.findFirst({
        where: {
          slug,
          status: 'ACTIVE',
          organization: { is: { tenant: { is: { status: 'ACTIVE' } } } },
        },
        select: { id: true, tenantId: true, slug: true, name: true },
      });
    } catch {
      // Resilient mode (DB-down): fall back to demo store
      dbAvailable = false;
    }

    if (!store) {
      if (!dbAvailable) {
        return {
          id: 'demo-store',
          tenantId: 'demo-tenant',
          slug,
          name: 'فروشگاه نمونه (حالت تاب‌آور)',
          dbAvailable: false,
        };
      }
      throw new NotFoundException('فروشگاهی با این شناسه فعال یافت نشد');
    }

    return store;
  }

  private async resolveActiveStore(storeSlug: string) {
    try {
      const store = await this.prisma.store.findFirst({
        where: { slug: storeSlug, status: 'ACTIVE', organization: { is: { tenant: { is: { status: 'ACTIVE' } } } } },
        select: { id: true, tenantId: true, defaultCurrency: true },
      });
      return store;
    } catch {
      return null;
    }
  }

  async listPublished(storeSlug: string, limit: number) {
    try {
      const store = await this.resolveActiveStore(storeSlug);
      if (!store) {
        return DEMO_FALLBACK_PRODUCTS.slice(0, limit).map((p) => this.toPublicProduct(p));
      }

      const products = await this.prisma.product.findMany({
        where: {
          tenantId: store.tenantId,
          storeId: store.id,
          status: 'PUBLISHED',
          publishedAt: { not: null },
        },
        orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
        take: limit,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              logoUrl: true,
              websiteUrl: true,
              originCountry: true,
            },
          },
          media: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            select: {
              id: true,
              role: true,
              sortOrder: true,
              altText: true,
              url: true,
              width: true,
              height: true,
              mimeType: true,
              isPrimary: true,
              variantId: true,
            },
          },
          ingredients: {
            orderBy: [{ isKeyIngredient: 'desc' }, { sortOrder: 'asc' }],
            select: {
              id: true,
              name: true,
              inciName: true,
              concentrationPercent: true,
              purpose: true,
              isKeyIngredient: true,
              description: true,
              sortOrder: true,
            },
          },
          claims: {
            where: { status: 'APPROVED' },
            select: {
              id: true,
              claimText: true,
              evidenceSummary: true,
              studyReference: true,
              approvedBy: true,
              status: true,
            },
          },
          usageSteps: {
            orderBy: { stepNumber: 'asc' },
            select: {
              id: true,
              stepNumber: true,
              title: true,
              instruction: true,
              iconOrImageUrl: true,
            },
          },
          skinConcerns: {
            select: {
              concern: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  description: true,
                  iconUrl: true,
                },
              },
            },
          },
          variants: {
            where: { tenantId: store.tenantId, storeId: store.id, status: 'ACTIVE' },
            orderBy: { sku: 'asc' },
            include: { inventoryLevels: { where: { tenantId: store.tenantId, storeId: store.id } } },
          },
        },
      });

      if (products.length === 0) {
        return DEMO_FALLBACK_PRODUCTS.slice(0, limit).map((p) => this.toPublicProduct(p));
      }

      return products.map((product) => this.toPublicProduct(product));
    } catch {
      return DEMO_FALLBACK_PRODUCTS.slice(0, limit).map((p) => this.toPublicProduct(p));
    }
  }

  async getPublished(storeSlug: string, productSlug: string) {
    try {
      const store = await this.resolveActiveStore(storeSlug);
      if (!store) {
        const fallback = DEMO_FALLBACK_PRODUCTS.find(
          (p) => p.slug === productSlug || (productSlug === 'carboxygel-professional-therapy' && p.slug === 'carboxygel'),
        );
        if (fallback) return this.toPublicProduct(fallback);
        throw new NotFoundException('کالای مورد نظر یافت نشد.');
      }

      const product = await this.prisma.product.findFirst({
        where: {
          tenantId: store.tenantId,
          storeId: store.id,
          OR: [
            { slug: productSlug },
            ...(productSlug === 'carboxygel-professional-therapy' ? [{ slug: 'carboxygel' }] : []),
          ],
          status: 'PUBLISHED',
          publishedAt: { not: null },
        },
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              logoUrl: true,
              websiteUrl: true,
              originCountry: true,
            },
          },
          media: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            select: {
              id: true,
              role: true,
              sortOrder: true,
              altText: true,
              url: true,
              width: true,
              height: true,
              mimeType: true,
              isPrimary: true,
              variantId: true,
            },
          },
          ingredients: {
            orderBy: [{ isKeyIngredient: 'desc' }, { sortOrder: 'asc' }],
            select: {
              id: true,
              name: true,
              inciName: true,
              concentrationPercent: true,
              purpose: true,
              isKeyIngredient: true,
              description: true,
              sortOrder: true,
            },
          },
          claims: {
            where: { status: 'APPROVED' },
            select: {
              id: true,
              claimText: true,
              evidenceSummary: true,
              studyReference: true,
              approvedBy: true,
              status: true,
            },
          },
          usageSteps: {
            orderBy: { stepNumber: 'asc' },
            select: {
              id: true,
              stepNumber: true,
              title: true,
              instruction: true,
              iconOrImageUrl: true,
            },
          },
          skinConcerns: {
            select: {
              concern: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  description: true,
                  iconUrl: true,
                },
              },
            },
          },
          variants: {
            where: { tenantId: store.tenantId, storeId: store.id, status: 'ACTIVE' },
            orderBy: { sku: 'asc' },
            include: { inventoryLevels: { where: { tenantId: store.tenantId, storeId: store.id } } },
          },
        },
      });

      if (!product) {
        const fallback = DEMO_FALLBACK_PRODUCTS.find(
          (p) => p.slug === productSlug || (productSlug === 'carboxygel-professional-therapy' && p.slug === 'carboxygel'),
        );
        if (fallback) return this.toPublicProduct(fallback);
        throw new NotFoundException('کالای مورد نظر یافت نشد.');
      }

      return this.toPublicProduct(product);
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      const fallback = DEMO_FALLBACK_PRODUCTS.find(
        (p) => p.slug === productSlug || (productSlug === 'carboxygel-professional-therapy' && p.slug === 'carboxygel'),
      );
      if (fallback) return this.toPublicProduct(fallback);
      throw new NotFoundException('کالای مورد نظر یافت نشد.');
    }
  }

  async getMedia(storeSlug: string, productSlug: string) {
    const product = await this.getPublished(storeSlug, productSlug);
    return product.media ?? [];
  }

  async getIngredients(storeSlug: string, productSlug: string) {
    const product = await this.getPublished(storeSlug, productSlug);
    return product.ingredients ?? [];
  }

  async getClaims(storeSlug: string, productSlug: string) {
    const product = await this.getPublished(storeSlug, productSlug);
    return product.claims ?? [];
  }

  async getUsageSteps(storeSlug: string, productSlug: string) {
    const product = await this.getPublished(storeSlug, productSlug);
    return product.usageSteps ?? [];
  }

  async listBrands(storeSlug: string) {
    try {
      const store = await this.resolveActiveStore(storeSlug);
      if (store) {
        const brands = await this.prisma.brand.findMany({
          where: { tenantId: store.tenantId, storeId: store.id, isPublished: true },
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logoUrl: true,
            websiteUrl: true,
            originCountry: true,
          },
        });
        if (brands.length > 0) return brands;
      }
    } catch {
      // DB-down fallback
    }

    // Extract brands from fallback
    const brandsMap = new Map<string, any>();
    for (const p of DEMO_FALLBACK_PRODUCTS as any[]) {
      if (p.brand && !brandsMap.has(p.brand.slug)) {
        brandsMap.set(p.brand.slug, p.brand);
      }
    }
    return Array.from(brandsMap.values());
  }

  async listSkinConcerns(storeSlug: string) {
    try {
      const store = await this.resolveActiveStore(storeSlug);
      if (store) {
        const concerns = await this.prisma.skinConcern.findMany({
          where: { tenantId: store.tenantId, storeId: store.id },
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            iconUrl: true,
          },
        });
        if (concerns.length > 0) return concerns;
      }
    } catch {
      // DB-down fallback
    }

    const concernMap = new Map<string, any>();
    for (const p of DEMO_FALLBACK_PRODUCTS as any[]) {
      if (Array.isArray(p.skinConcerns)) {
        for (const c of p.skinConcerns) {
          if (!concernMap.has(c.slug)) {
            concernMap.set(c.slug, c);
          }
        }
      }
    }
    return Array.from(concernMap.values());
  }

  // ── Admin Endpoints (Tenant-Isolated) ──

  async adminListProducts(tenantId: string, storeSlug?: string, limit = 50) {
    try {
      // اسلاگ فروشگاه سراسری یکتاست: مستأجر مؤثر از خود فروشگاه مشتق می‌شود؛
      // هدر پیش‌فرض تک‌مستأجری (nil) هرگز محدوده‌سازی نمی‌کند — وگرنه این
      // مسیر به‌جای دیتابیس، داده نمونه بازگشتی را نشان می‌داد.
      let storeId: string | undefined;
      if (storeSlug) {
        const store = await this.prisma.store.findFirst({
          where: { slug: storeSlug, ...(tenantId !== DEFAULT_TENANT_ID ? { tenantId } : {}) },
          select: { id: true, tenantId: true },
        });
        if (store) {
          storeId = store.id;
          tenantId = store.tenantId;
        }
      }

      const products = await this.prisma.product.findMany({
        where: {
          ...(tenantId !== DEFAULT_TENANT_ID ? { tenantId } : {}),
          ...(storeId ? { storeId } : {}),
        },
        orderBy: { updatedAt: 'desc' },
        take: Math.min(Math.max(limit, 1), 100),
        include: {
          brand: true,
          category: true,
          media: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { sku: 'asc' }, include: { inventoryLevels: true } },
          claims: true,
          ingredients: true,
          usageSteps: true,
          skinConcerns: { include: { concern: true } },
        },
      });

      console.error(`[adminListProducts] db rows: ${products.length}; mapping to public shape`);
      return products.map((p) => this.toPublicProduct(p));
    } catch (err: any) {
      // Resilient fallback for admin — but never silently: a swallowed error here
      // would mask real DB failures as a healthy-looking demo catalog.
      console.error(`[adminListProducts] fell back to demo data: ${err?.message ?? err}`);
      this.logger.warn(`adminListProducts fell back to demo data: ${err?.message ?? err}`);
      return DEMO_FALLBACK_PRODUCTS.slice(0, limit).map((p) => this.toPublicProduct(p));
    }
  }

  async adminGetProduct(tenantId: string, productId: string) {
    try {
      // مستأجر مؤثر از رکورد محصول مشتق می‌شود (هم‌سو با adminUpdateProduct)
      const product = await this.prisma.product.findFirst({
        where: {
          id: productId,
          ...(tenantId !== DEFAULT_TENANT_ID ? { tenantId } : {}),
        },
        include: {
          brand: true,
          category: true,
          media: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { sku: 'asc' }, include: { inventoryLevels: true } },
          claims: true, // Includes DRAFT, REVIEW_REQUIRED, APPROVED
          ingredients: { orderBy: { sortOrder: 'asc' } },
          usageSteps: { orderBy: { stepNumber: 'asc' } },
          skinConcerns: { include: { concern: true } },
        },
      });

      if (!product) {
        throw new NotFoundException('محصول یافت نشد یا دسترسی مجاز نیست.');
      }

      return this.toPublicProduct(product);
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      const fallback = DEMO_FALLBACK_PRODUCTS.find((p) => p.id === productId);
      if (fallback) return this.toPublicProduct(fallback);
      throw new NotFoundException('محصول یافت نشد یا دسترسی مجاز نیست.');
    }
  }

  // ── Admin Product Authoring (ERP) ──
  // پول قانونی ریال (عدد صحیح) است؛ قیمت/موجودی روی واریانت پیش‌فرض +
  // InventoryLevel می‌نشیند (همان شکلی که seed.ts می‌سازد). DB-down → ۵۰۳
  // صادقانه: قیمت و موجودی تعهد تجاری‌اند و هرگز ساختگی ثبت نمی‌شوند.

  async adminCreateProduct(tenantId: string, input: CreateProductDto) {
    try {
      // اسلاگ فروشگاه سراسری یکتاست؛ مستأجر مؤثر همیشه از خود فروشگاه مشتق
      // می‌شود (هدر x-tenant-id فقط برای هم‌خوانی در استقرار چندمستأجری
      // بررسی می‌شود — مقدار پیش‌فرض تک‌مستأجری نادیده گرفته می‌شود).
      const store = await this.prisma.store.findFirst({
        where: { slug: input.storeSlug },
        select: { id: true, tenantId: true },
      });
      if (!store || (tenantId !== DEFAULT_TENANT_ID && tenantId !== store.tenantId)) {
        throw new NotFoundException('فروشگاهی با این شناسه یافت نشد');
      }
      tenantId = store.tenantId;

      // اسلاگ صریح: تکراری → ۴۰۹ | خودکار: از عنوان (لاتین/فارسی) با تضمین یکتایی
      let slug: string;
      if (input.slug !== undefined && input.slug.trim().length > 0) {
        slug = slugify(input.slug) || input.slug.trim().toLowerCase();
        const existing = await this.prisma.product.findUnique({
          where: { storeId_slug: { storeId: store.id, slug } },
          select: { id: true },
        });
        if (existing) {
          throw new ConflictException('محصولی با این اسلاگ از قبل در این فروشگاه موجود است');
        }
      } else {
        slug = await this.generateUniqueSlug(store.id, input.titleEn ?? input.titleFa);
      }

      let categoryId: string | null = null;
      if (input.categoryFa !== undefined && input.categoryFa.trim().length > 0) {
        const category = await this.prisma.category.findFirst({
          where: {
            tenantId,
            storeId: store.id,
            titleFa: { equals: input.categoryFa.trim(), mode: 'insensitive' },
          },
          select: { id: true },
        });
        categoryId = category?.id ?? null;
      }

      let brandId: string | null = null;
      if (input.brandId) {
        const brand = await this.prisma.brand.findFirst({
          where: { tenantId, storeId: store.id, id: input.brandId },
          select: { id: true },
        });
        if (!brand) {
          throw new BadRequestException('برند مورد نظر در این فروشگاه یافت نشد');
        }
        brandId = input.brandId;
      }

      const status = input.status ?? 'DRAFT';
      const productId = randomUUID();
      const variantId = randomUUID();
      const now = new Date();

      await this.prisma.$transaction([
        this.prisma.product.create({
          data: {
            id: productId,
            tenantId,
            storeId: store.id,
            categoryId,
            brandId,
            kind: input.kind ?? 'PHYSICAL',
            slug,
            titleFa: input.titleFa,
            ...(input.description !== undefined ? { description: input.description } : {}),
            status,
            isFeatured: input.isFeatured ?? false,
            ...(status === 'PUBLISHED' ? { publishedAt: now } : {}),
          },
        }),
        this.prisma.productVariant.create({
          data: {
            id: variantId,
            tenantId,
            storeId: store.id,
            productId,
            sku: `${slug}-STD`,
            titleFa: input.titleFa,
            priceAmount: String(input.priceRials),
            currency: 'IRR',
            status: 'ACTIVE',
          },
        }),
        this.prisma.inventoryLevel.create({
          data: {
            tenantId,
            storeId: store.id,
            variantId,
            warehouseCode: 'MAIN',
            onHandQty: input.stock,
            reservedQty: 0,
          },
        }),
        ...(input.imageUrl
          ? [
              this.prisma.productMedia.create({
                data: {
                  tenantId,
                  storeId: store.id,
                  productId,
                  role: 'HERO',
                  sortOrder: 1,
                  url: input.imageUrl,
                  isPrimary: true,
                },
              }),
            ]
          : []),
      ]);

      const created = await this.prisma.product.findFirst({
        where: { id: productId, tenantId },
        include: this.adminProductInclude(),
      });
      if (!created) {
        throw new NotFoundException('محصول یافت نشد یا دسترسی مجاز نیست.');
      }
      return this.toPublicProduct(created);
    } catch (err: any) {
      if (
        err instanceof NotFoundException ||
        err instanceof ConflictException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      if (err?.code === 'P2002') {
        throw new ConflictException('محصولی با این اسلاگ یا اسکیو از قبل موجود است');
      }
      throw new ServiceUnavailableException(
        'ثبت محصول موقتاً در دسترس نیست — لطفاً بعداً تلاش کنید',
      );
    }
  }

  async adminUpdateProduct(tenantId: string, productId: string, input: UpdateProductDto) {
    try {
      // مستأجر مؤثر از رکورد محصول مشتق می‌شود (محدوده چندمستأجری واقعی)؛
      // هدر فقط در استقرار واقعاً چندمستأجری با آن مقایسه می‌شود.
      const product = await this.prisma.product.findFirst({
        where: { id: productId },
        include: { variants: { orderBy: { sku: 'asc' }, include: { inventoryLevels: true } } },
      });
      if (!product || (tenantId !== DEFAULT_TENANT_ID && product.tenantId !== tenantId)) {
        throw new NotFoundException('محصول یافت نشد یا دسترسی مجاز نیست.');
      }
      tenantId = product.tenantId;

      const data: Record<string, unknown> = {};

      if (input.slug !== undefined && input.slug.trim().length > 0) {
        const slug = slugify(input.slug) || input.slug.trim().toLowerCase();
        if (slug !== product.slug) {
          const existing = await this.prisma.product.findUnique({
            where: { storeId_slug: { storeId: product.storeId, slug } },
            select: { id: true },
          });
          if (existing) {
            throw new ConflictException('محصولی با این اسلاگ از قبل در این فروشگاه موجود است');
          }
          data.slug = slug;
        }
      }

      if (input.titleFa !== undefined) data.titleFa = input.titleFa;
      if (input.description !== undefined) data.description = input.description;
      if (input.kind !== undefined) data.kind = input.kind;
      if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured;

      if (input.categoryFa !== undefined) {
        if (input.categoryFa.trim().length > 0) {
          const category = await this.prisma.category.findFirst({
            where: {
              tenantId,
              storeId: product.storeId,
              titleFa: { equals: input.categoryFa.trim(), mode: 'insensitive' },
            },
            select: { id: true },
          });
          data.categoryId = category?.id ?? null;
        } else {
          data.categoryId = null;
        }
      }

      if (input.brandId !== undefined && input.brandId.length > 0) {
        const brand = await this.prisma.brand.findFirst({
          where: { tenantId, storeId: product.storeId, id: input.brandId },
          select: { id: true },
        });
        if (!brand) {
          throw new BadRequestException('برند مورد نظر در این فروشگاه یافت نشد');
        }
        data.brandId = input.brandId;
      }

      if (input.status !== undefined) {
        data.status = input.status;
        // publishedAt فقط بار اول انتشار نوشته می‌شود و هرگز بازنویسی نمی‌شود
        if (input.status === 'PUBLISHED' && !product.publishedAt) {
          data.publishedAt = new Date();
        }
      }

      const ops: Prisma.PrismaPromise<unknown>[] = [];
      if (Object.keys(data).length > 0) {
        ops.push(this.prisma.product.update({ where: { id: productId }, data }));
      }

      const defaultVariant = product.variants[0];
      if (defaultVariant) {
        if (input.priceRials !== undefined) {
          ops.push(
            this.prisma.productVariant.update({
              where: { id: defaultVariant.id },
              data: { priceAmount: String(input.priceRials) },
            }),
          );
        }
        if (input.stock !== undefined) {
          const level = Array.isArray(defaultVariant.inventoryLevels)
            ? defaultVariant.inventoryLevels[0]
            : null;
          if (level) {
            ops.push(
              this.prisma.inventoryLevel.update({
                where: { id: level.id },
                data: { onHandQty: input.stock },
              }),
            );
          } else {
            ops.push(
              this.prisma.inventoryLevel.create({
                data: {
                  tenantId,
                  storeId: product.storeId,
                  variantId: defaultVariant.id,
                  warehouseCode: 'MAIN',
                  onHandQty: input.stock,
                  reservedQty: 0,
                },
              }),
            );
          }
        }
      }

      if (ops.length > 0) {
        await this.prisma.$transaction(ops);
      }

      const updated = await this.prisma.product.findFirst({
        where: { id: productId, tenantId },
        include: this.adminProductInclude(),
      });
      if (!updated) {
        throw new NotFoundException('محصول یافت نشد یا دسترسی مجاز نیست.');
      }
      return this.toPublicProduct(updated);
    } catch (err: any) {
      if (
        err instanceof NotFoundException ||
        err instanceof ConflictException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      if (err?.code === 'P2002') {
        throw new ConflictException('محصولی با این اسلاگ یا اسکیو از قبل موجود است');
      }
      throw new ServiceUnavailableException(
        'ویرایش محصول موقتاً در دسترس نیست — لطفاً بعداً تلاش کنید',
      );
    }
  }

  async adminBulkUpdateProducts(tenantId: string, input: BulkUpdateProductsDto) {
    try {
      const data: { status?: ProductStatus; isFeatured?: boolean } = {};
      if (input.status !== undefined) data.status = input.status;
      if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured;

      const result = await this.prisma.product.updateMany({
        where: {
          id: { in: input.ids },
          // هدر پیش‌فرض تک‌مستأجری محدوده‌سازی نمی‌شود؛ در غیر این صورت
          // مستأجر صریح سرور-به-سرور محترم شمرده می‌شود.
          ...(tenantId !== DEFAULT_TENANT_ID ? { tenantId } : {}),
        },
        data,
      });
      return { updated: result.count };
    } catch {
      throw new ServiceUnavailableException(
        'به‌روزرسانی گروهی محصولات موقتاً در دسترس نیست — لطفاً بعداً تلاش کنید',
      );
    }
  }

  private adminProductInclude() {
    return {
      brand: true,
      category: true,
      media: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { sku: 'asc' }, include: { inventoryLevels: true } },
      claims: true,
      ingredients: { orderBy: { sortOrder: 'asc' } },
      usageSteps: { orderBy: { stepNumber: 'asc' } },
      skinConcerns: { include: { concern: true } },
    } as const;
  }

  // اسلاگ یکتا در فروشگاه: پایه از عنوان (لاتین) یا «product-» + پسوند تصادفی،
  // و در برخورد، پسوند -2، -3 و …
  private async generateUniqueSlug(storeId: string, seed: string): Promise<string> {
    const base = slugify(seed) || `product-${randomUUID().slice(0, 8)}`;
    let candidate = base;
    let suffix = 2;
    for (;;) {
      const existing = await this.prisma.product.findUnique({
        where: { storeId_slug: { storeId, slug: candidate } },
        select: { id: true },
      });
      if (!existing) return candidate;
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
  }

  async adminListBrands(tenantId: string, storeSlug?: string) {
    try {
      // هم‌سو با adminListProducts: مستأجر مؤثر از خود فروشگاه مشتق می‌شود
      let storeId: string | undefined;
      if (storeSlug) {
        const store = await this.prisma.store.findFirst({
          where: { slug: storeSlug, ...(tenantId !== DEFAULT_TENANT_ID ? { tenantId } : {}) },
          select: { id: true, tenantId: true },
        });
        if (store) {
          storeId = store.id;
          tenantId = store.tenantId;
        }
      }

      return await this.prisma.brand.findMany({
        where: {
          ...(tenantId !== DEFAULT_TENANT_ID ? { tenantId } : {}),
          ...(storeId ? { storeId } : {}),
        },
        orderBy: { name: 'asc' },
      });
    } catch {
      return this.listBrands(storeSlug ?? 'demo');
    }
  }

  async adminListSkinConcerns(tenantId: string, storeSlug?: string) {
    try {
      // هم‌سو با adminListProducts: مستأجر مؤثر از خود فروشگاه مشتق می‌شود
      let storeId: string | undefined;
      if (storeSlug) {
        const store = await this.prisma.store.findFirst({
          where: { slug: storeSlug, ...(tenantId !== DEFAULT_TENANT_ID ? { tenantId } : {}) },
          select: { id: true, tenantId: true },
        });
        if (store) {
          storeId = store.id;
          tenantId = store.tenantId;
        }
      }

      return await this.prisma.skinConcern.findMany({
        where: {
          ...(tenantId !== DEFAULT_TENANT_ID ? { tenantId } : {}),
          ...(storeId ? { storeId } : {}),
        },
        orderBy: { name: 'asc' },
      });
    } catch {
      return this.listSkinConcerns(storeSlug ?? 'demo');
    }
  }

  private toPublicProduct(product: any) {
    const brand = product.brand
      ? {
          id: product.brand.id,
          name: product.brand.name,
          slug: product.brand.slug,
          description: product.brand.description ?? null,
          logoUrl: product.brand.logoUrl ?? null,
          websiteUrl: product.brand.websiteUrl ?? null,
          originCountry: product.brand.originCountry ?? null,
        }
      : null;

    const media = Array.isArray(product.media)
      ? product.media.map((m: any) => ({
          id: m.id,
          role: m.role,
          sortOrder: m.sortOrder,
          altText: m.altText ?? null,
          url: m.url,
          width: m.width ?? null,
          height: m.height ?? null,
          mimeType: m.mimeType ?? null,
          isPrimary: Boolean(m.isPrimary),
          variantId: m.variantId ?? null,
        }))
      : [];

    const ingredients = Array.isArray(product.ingredients)
      ? product.ingredients.map((ing: any) => ({
          id: ing.id,
          name: ing.name,
          inciName: ing.inciName ?? null,
          concentrationPercent: ing.concentrationPercent
            ? typeof ing.concentrationPercent === 'string'
              ? ing.concentrationPercent
              : ing.concentrationPercent.toFixed?.(2) ?? String(ing.concentrationPercent)
            : null,
          purpose: ing.purpose ?? null,
          isKeyIngredient: Boolean(ing.isKeyIngredient),
          description: ing.description ?? null,
          sortOrder: ing.sortOrder ?? 0,
        }))
      : [];

    const claims = Array.isArray(product.claims)
      ? product.claims.map((c: any) => ({
          id: c.id,
          claimText: c.claimText,
          evidenceSummary: c.evidenceSummary ?? null,
          studyReference: c.studyReference ?? null,
          approvedBy: c.approvedBy ?? null,
          status: c.status,
        }))
      : [];

    const usageSteps = Array.isArray(product.usageSteps)
      ? product.usageSteps.map((s: any) => ({
          id: s.id,
          stepNumber: s.stepNumber,
          title: s.title,
          instruction: s.instruction,
          iconOrImageUrl: s.iconOrImageUrl ?? null,
        }))
      : [];

    const skinConcerns = Array.isArray(product.skinConcerns)
      ? product.skinConcerns.map((sc: any) => {
          const concern = sc.concern ?? sc;
          return {
            id: concern.id,
            name: concern.name,
            slug: concern.slug,
            description: concern.description ?? null,
            iconUrl: concern.iconUrl ?? null,
          };
        })
      : [];

    const variants = Array.isArray(product.variants)
      ? product.variants.map((variant: any) => {
          const availableQty = Array.isArray(variant.inventoryLevels)
            ? variant.inventoryLevels.reduce(
                (sum: number, level: any) => sum + Math.max(0, level.onHandQty - level.reservedQty),
                0,
              )
            : 20;

          const priceStr =
            typeof variant.priceAmount === 'string'
              ? variant.priceAmount
              : variant.priceAmount?.toFixed?.(0) ?? String(variant.priceAmount ?? '0');

          return {
            id: variant.id,
            sku: variant.sku,
            title: variant.titleFa ?? variant.title,
            titleFa: variant.titleFa ?? variant.title,
            priceAmount: priceStr,
            currency: variant.currency ?? 'IRR',
            inStock: availableQty > 0 || variant.inStock === true,
            digitalFileUrl: variant.digitalFileUrl ?? null,
          };
        })
      : [];

    return {
      id: product.id,
      slug: product.slug,
      title: product.titleFa ?? product.title,
      titleFa: product.titleFa ?? product.title,
      description: product.description ?? null,
      kind: product.kind ?? 'PHYSICAL',
      // ردیف‌های واقعی DB همیشه status دارند؛ فقط ردیف‌های دموی تاب‌آور ندارند و
      // آن‌ها همان کاتالوگ زنده ویترین‌اند → منتشرشده نمایش داده می‌شوند
      status: product.status ?? 'PUBLISHED',
      isFeatured: Boolean(product.isFeatured),
      publishedAt: product.publishedAt ? new Date(product.publishedAt).toISOString() : null,
      brand,
      media,
      ingredients,
      claims,
      usageSteps,
      skinConcerns,
      variants,
      defaultVariant: variants.length > 0 ? this.toDefaultVariant(product.variants[0]) : null,
    };
  }

  // اولین واریانت (بر اساس مرتب‌سازی اسکیو) به‌عنوان واریانت پیش‌فرض ادمین
  private toDefaultVariant(variant: any) {
    const level = Array.isArray(variant.inventoryLevels) && variant.inventoryLevels.length > 0
      ? variant.inventoryLevels[0]
      : null;
    const onHand = Number(level?.onHandQty ?? 0);
    const reserved = Number(level?.reservedQty ?? 0);

    const priceStr =
      typeof variant.priceAmount === 'string'
        ? variant.priceAmount
        : variant.priceAmount?.toFixed?.(0) ?? String(variant.priceAmount ?? '0');

    return {
      id: variant.id,
      sku: variant.sku,
      priceRials: Number.parseInt(priceStr, 10) || 0,
      stock: onHand,
      reserved,
      // موجودی واقعاً قابل فروش = onHand − رزرو شده (قراردادهای فعال)
      available: Math.max(0, onHand - reserved),
    };
  }
}

// اسلاگ‌سازی: حروف/ارقام لاتین و خط تیره؛ عنوان فارسی → رشتهٔ خالی (تماس‌گیرنده
// پسوند تصادفی می‌سازد)
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
