import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { DEMO_FALLBACK_PRODUCTS } from "../catalog/demo-data";

// ── ADR-011: بنیان Marketplace — نمایش فروشنده (Vendor Foundation) ──
// فاز ۰: فقط نمایش عمومی + ساخت حداقلی. سبد و چک‌اوت تکفروشنده باقی می‌ماند.
// الگوی تاب‌آوری (مطابق کاتالوگ/توصیه‌ها): DB-down → پاسخ دمو با source: "FALLBACK".

export type VendorSource = "DB" | "FALLBACK";

export interface VendorSummary {
  id: string;
  slug: string;
  titleFa: string;
  description: string | null;
  logoColor: string;
  productCount: number;
}

export interface VendorsListResult {
  source: VendorSource;
  items: VendorSummary[];
}

export interface VendorProductSummary {
  id: string;
  slug: string;
  title: string;
  priceRials: number;
  priceTomans: number;
  kind: string;
}

export interface VendorDetailResult {
  source: VendorSource;
  vendor: VendorSummary;
  products: VendorProductSummary[];
}

export interface VendorCreated {
  id: string;
  slug: string;
  titleFa: string;
  description: string | null;
  logoColor: string;
  commissionBps: number;
  isActive: boolean;
}

export interface CreateVendorInput {
  tenantId: string;
  slug?: string;
  titleFa?: string;
  description?: string;
  logoColor?: string;
  commissionBps?: number;
}

// slug: حروف لاتین کوچک، رقم و خط تیره — بین ۳ تا ۶۰ کاراکتر
const SLUG_PATTERN = /^[a-z0-9-]{3,60}$/;
const LOGO_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

const TITLE_MIN = 2;
const TITLE_MAX = 200;
const COMMISSION_BPS_MIN = 0;
const COMMISSION_BPS_MAX = 5000;

// ── فروشندگان نمونه حالت تاب‌آور (DB-down)؛ شمارش محصولات از دیتاست دموی کاتالوگ ──
const DEMO_VENDORS = [
  {
    id: "demo-vendor-roast-coffee",
    slug: "roast-coffee",
    titleFa: "روست قهوه",
    description: "برشته‌کاری تخصصی قهوه تک‌خاستگاه؛ دانه‌های تازه‌برشت با پروفایل‌های روشن تا متوسط.",
    logoColor: "#6F4E37",
  },
  {
    id: "demo-vendor-brew-studio",
    slug: "brew-studio",
    titleFa: "استودیو دم‌آوری",
    description: "آموزش تخصصی دم‌آوری قهوه؛ دوره‌های ویدیویی و منابع دیجیتال برای بارستاها و علاقه‌مندان.",
    logoColor: "#0B6E66",
  },
] as const;

type DemoProduct = (typeof DEMO_FALLBACK_PRODUCTS)[number];

/** قیمت نمایشی محصول: ریال و تومان (تقسیم صحیح BigInt بر ۱۰) */
function toVendorProductSummary(
  product: { id: string; slug: string; title: string; kind: string; priceAmountRials: string }
): VendorProductSummary {
  const priceRials = BigInt(product.priceAmountRials || "0");
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    priceRials: Number(priceRials),
    priceTomans: Number(priceRials / 10n),
    kind: product.kind,
  };
}

function demoVendorSummaries(): VendorSummary[] {
  return DEMO_VENDORS.map((vendor) => ({
    id: vendor.id,
    slug: vendor.slug,
    titleFa: vendor.titleFa,
    description: vendor.description,
    logoColor: vendor.logoColor,
    productCount: (DEMO_FALLBACK_PRODUCTS as any[]).filter((p) => (p.vendor as any)?.slug === vendor.slug).length,
  }));
}

function demoVendorDetail(slug: string): VendorDetailResult {
  const vendor = DEMO_VENDORS.find((v) => v.slug === slug);
  if (!vendor) {
    throw new NotFoundException("فروشنده‌ای با این شناسه یافت نشد");
  }
  const products = (DEMO_FALLBACK_PRODUCTS as any[]).filter((p) => (p.vendor as any)?.slug === vendor.slug).map(
    (p: any): VendorProductSummary =>
      toVendorProductSummary({
        id: p.id,
        slug: p.slug,
        title: p.title,
        kind: p.kind,
        priceAmountRials: p.variants[0]?.priceAmount ?? "0",
      })
  );
  return {
    source: "FALLBACK",
    vendor: {
      id: vendor.id,
      slug: vendor.slug,
      titleFa: vendor.titleFa,
      description: vendor.description,
      logoColor: vendor.logoColor,
      productCount: products.length,
    },
    products,
  };
}

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── فهرست فروشندگان فعال یک فروشگاه با شمارش محصولات هر فروشنده ──
  async listVendors(storeSlug: string): Promise<VendorsListResult> {
    if (!storeSlug || storeSlug.trim().length === 0) {
      throw new BadRequestException("شناسه فروشگاه الزامی است");
    }

    try {
      const store = await this.prisma.store.findFirst({
        where: {
          slug: storeSlug,
          status: "ACTIVE",
          organization: { is: { tenant: { is: { status: "ACTIVE" } } } },
        },
        select: { id: true, tenantId: true },
      });

      if (!store) {
        throw new NotFoundException("فروشگاهی با این شناسه فعال یافت نشد");
      }

      const vendors = await this.prisma.vendor.findMany({
        where: { tenantId: store.tenantId, isActive: true },
        orderBy: { createdAt: "asc" },
      });

      const items = await Promise.all(
        vendors.map(async (vendor) => ({
          id: vendor.id,
          slug: vendor.slug,
          titleFa: vendor.titleFa,
          description: vendor.description,
          logoColor: vendor.logoColor,
          productCount: await this.prisma.product.count({ where: { vendorId: vendor.id } }),
        }))
      );

      return { source: "DB", items };
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof BadRequestException) {
        throw err;
      }
      // DB-down: حالت تاب‌آور — فهرست دمو با نشانگر منبع
      return { source: "FALLBACK", items: demoVendorSummaries() };
    }
  }

  // ── یک فروشنده + محصولات منتشرشده آن ──
  async getVendor(slug: string, storeSlug?: string): Promise<VendorDetailResult> {
    if (!slug || slug.trim().length === 0) {
      throw new BadRequestException("شناسه فروشنده الزامی است");
    }

    try {
      let tenantId: string | null = null;
      if (storeSlug && storeSlug.trim().length > 0) {
        const store = await this.prisma.store.findFirst({
          where: {
            slug: storeSlug,
            status: "ACTIVE",
            organization: { is: { tenant: { is: { status: "ACTIVE" } } } },
          },
          select: { id: true, tenantId: true },
        });
        if (!store) {
          throw new NotFoundException("فروشگاهی با این شناسه فعال یافت نشد");
        }
        tenantId = store.tenantId;
      }

      const vendor = await this.prisma.vendor.findFirst({
        where: { slug, isActive: true, ...(tenantId ? { tenantId } : {}) },
      });

      if (!vendor) {
        throw new NotFoundException("فروشنده‌ای با این شناسه یافت نشد");
      }

      const products = await this.prisma.product.findMany({
        where: { vendorId: vendor.id, status: "PUBLISHED", publishedAt: { not: null } },
        orderBy: { publishedAt: "desc" },
        include: {
          variants: { where: { status: "ACTIVE" }, orderBy: { sku: "asc" } },
        },
      });

      return {
        source: "DB",
        vendor: {
          id: vendor.id,
          slug: vendor.slug,
          titleFa: vendor.titleFa,
          description: vendor.description,
          logoColor: vendor.logoColor,
          productCount: products.length,
        },
        products: products.map((product) => {
          const priceAmountRials = product.variants[0]
            ? product.variants[0].priceAmount.toFixed(0)
            : "0";
          return toVendorProductSummary({
            id: product.id,
            slug: product.slug,
            title: product.titleFa,
            kind: product.kind,
            priceAmountRials,
          });
        }),
      };
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof BadRequestException) {
        throw err;
      }
      // DB-down: حالت تاب‌آور — فروشنده دمو + محصولات دموی همسان
      return demoVendorDetail(slug);
    }
  }

  // ── ساخت فروشنده (حداقلی، فاز ۰ — ADR-011) ──
  async createVendor(input: CreateVendorInput): Promise<VendorCreated> {
    const slug = (input.slug ?? "").trim();
    const titleFa = (input.titleFa ?? "").trim();

    if (!SLUG_PATTERN.test(slug)) {
      throw new BadRequestException("شناسه فروشنده باید ۳ تا ۶۰ کاراکتر از حروف لاتین کوچک، رقم یا خط تیره باشد");
    }
    if (titleFa.length < TITLE_MIN || titleFa.length > TITLE_MAX) {
      throw new BadRequestException("عنوان فروشنده باید بین ۲ تا ۲۰۰ کاراکتر باشد");
    }

    const description = input.description?.trim();
    if (description !== undefined && description.length === 0) {
      throw new BadRequestException("توضیح فروشنده نمی‌تواند خالی باشد");
    }

    let logoColor: string | undefined;
    if (input.logoColor !== undefined) {
      const normalized = input.logoColor.trim();
      if (!LOGO_COLOR_PATTERN.test(normalized)) {
        throw new BadRequestException("رنگ لوگو باید با قالب #rrggbb باشد");
      }
      logoColor = normalized;
    }

    let commissionBps: number | undefined;
    if (input.commissionBps !== undefined) {
      const bps = Number(input.commissionBps);
      if (!Number.isSafeInteger(bps) || bps < COMMISSION_BPS_MIN || bps > COMMISSION_BPS_MAX) {
        throw new BadRequestException("درصد کمیسیون (basis points) باید عددی صحیح بین ۰ تا ۵۰۰۰ باشد");
      }
      commissionBps = bps;
    }

    try {
      const vendor = await this.prisma.vendor.create({
        data: {
          tenantId: input.tenantId,
          slug,
          titleFa,
          description: description ?? null,
          ...(logoColor !== undefined ? { logoColor } : {}),
          ...(commissionBps !== undefined ? { commissionBps } : {}),
        },
      });

      return {
        id: vendor.id,
        slug: vendor.slug,
        titleFa: vendor.titleFa,
        description: vendor.description,
        logoColor: vendor.logoColor,
        commissionBps: vendor.commissionBps,
        isActive: vendor.isActive,
      };
    } catch (err: any) {
      if (err?.code === "P2002") {
        throw new ConflictException("فروشنده‌ای با این شناسه از قبل در این فروشگاه ثبت شده است");
      }
      // DB-down: 503 فارسی — ساخت فروشنده جعلی نمی‌شود
      throw new ServiceUnavailableException("سرویس پایگاه داده در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید");
    }
  }
}
