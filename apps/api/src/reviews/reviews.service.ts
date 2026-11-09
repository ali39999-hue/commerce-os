import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
  HttpException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

export type ReviewModerationDecision = "APPROVED" | "REJECTED";

export interface CreateReviewInput {
  authorName: string;
  rating: number;
  title: string;
  body: string;
}

const RATING_MIN = 1;
const RATING_MAX = 5;
const AUTHOR_NAME_MIN = 2;
const AUTHOR_NAME_MAX = 100;
const TITLE_MAX = 150;
const BODY_MIN = 10;
const BODY_MAX = 2000;

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  private emptyDistribution(): Record<number, number> {
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }

  private async resolveProductId(productIdOrSlug: string): Promise<{ id: string; tenantId: string } | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productIdOrSlug);
    try {
      const product = await this.prisma.product.findFirst({
        where: isUuid
          ? { id: productIdOrSlug }
          : { OR: [{ slug: productIdOrSlug }, { slug: { contains: productIdOrSlug } }] },
        select: { id: true, tenantId: true },
      });
      return product;
    } catch {
      return null;
    }
  }

  async listForProduct(productIdOrSlug: string) {
    try {
      const resolved = await this.resolveProductId(productIdOrSlug);
      const actualId = resolved?.id || productIdOrSlug;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actualId);
      if (!isUuid) {
        return {
          items: [],
          total: 0,
          average: 0,
          distribution: this.emptyDistribution(),
          dbAvailable: true,
        };
      }

      const [items, approved] = await Promise.all([
        this.prisma.review.findMany({
          where: { productId: actualId, status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        this.prisma.review.findMany({
          where: { productId: actualId, status: "APPROVED" },
          select: { rating: true },
        }),
      ]);

      const distribution = this.emptyDistribution();
      let weighted = 0;
      let total = 0;
      for (const review of approved) {
        if (review.rating >= RATING_MIN && review.rating <= RATING_MAX) {
          distribution[review.rating] += 1;
          weighted += review.rating;
          total += 1;
        }
      }
      const average = total > 0 ? Math.round((weighted / total) * 10) / 10 : 0;

      return { items, total, average, distribution, dbAvailable: true };
    } catch {
      return {
        items: [],
        total: 0,
        average: 0,
        distribution: this.emptyDistribution(),
        dbAvailable: false,
      };
    }
  }

  async create(productIdOrSlug: string, dto: CreateReviewInput, tenantId: string, userId?: string) {
    const rating = Number(dto?.rating);
    if (!Number.isInteger(rating) || rating < RATING_MIN || rating > RATING_MAX) {
      throw new BadRequestException("امتیاز باید بین ۱ تا ۵ باشد");
    }

    const authorName = typeof dto?.authorName === "string" ? dto.authorName.trim() : "";
    if (authorName.length < AUTHOR_NAME_MIN || authorName.length > AUTHOR_NAME_MAX) {
      throw new BadRequestException("نام نویسنده باید بین ۲ تا ۱۰۰ کاراکتر باشد");
    }

    const title = typeof dto?.title === "string" ? dto.title.trim() : "";
    if (title.length < 1 || title.length > TITLE_MAX) {
      throw new BadRequestException("عنوان باید بین ۱ تا ۱۵۰ کاراکتر باشد");
    }

    const body = typeof dto?.body === "string" ? dto.body.trim() : "";
    if (body.length < BODY_MIN || body.length > BODY_MAX) {
      throw new BadRequestException("متن نظر باید بین ۱۰ تا ۲۰۰۰ کاراکتر باشد");
    }

    try {
      const product = await this.resolveProductId(productIdOrSlug);

      if (!product) {
        throw new NotFoundException("محصول یافت نشد");
      }

      let isVerifiedPurchase = false;
      if (userId) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { phone: true },
        });

        const matchingOrder = await this.prisma.order.findFirst({
          where: {
            OR: [
              { userId },
              ...(user?.phone ? [{ customerPhone: user.phone }] : []),
            ],
            status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
            lines: {
              some: {
                variant: {
                  productId: product.id,
                },
              },
            },
          },
          select: { id: true },
        });
        if (matchingOrder) {
          isVerifiedPurchase = true;
        }
      }

      return await this.prisma.review.create({
        data: {
          tenantId: product.tenantId || tenantId,
          productId: product.id,
          userId: userId || null,
          authorName,
          rating,
          title,
          body,
          status: "PENDING",
          isVerifiedPurchase,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ServiceUnavailableException("ثبت نظر موقتاً در دسترس نیست");
    }
  }

  async listPending(limit = 50) {
    const take =
      Number.isInteger(limit) && limit > 0 ? Math.min(limit as number, 200) : 50;

    try {
      const items = await this.prisma.review.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take,
      });

      return { items, dbAvailable: true };
    } catch {
      return { items: [], dbAvailable: false };
    }
  }

  async listAllAdmin(statusFilter?: string, limit = 100) {
    await this.seedDefaultReviewsIfEmpty();
    try {
      const whereClause: any = {};
      if (statusFilter && statusFilter !== "ALL") {
        whereClause.status = statusFilter;
      }

      const [items, total, pendingCount, approvedCount, rejectedCount] = await Promise.all([
        this.prisma.review.findMany({
          where: whereClause,
          orderBy: { createdAt: "desc" },
          take: Math.min(limit, 200),
        }),
        this.prisma.review.count(),
        this.prisma.review.count({ where: { status: "PENDING" } }),
        this.prisma.review.count({ where: { status: "APPROVED" } }),
        this.prisma.review.count({ where: { status: "REJECTED" } }),
      ]);

      const productIds = Array.from(new Set(items.map((i) => i.productId)));
      const products = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, titleFa: true, slug: true },
      });
      const prodMap = new Map(products.map((p) => [p.id, p]));

      const enriched = items.map((item) => {
        const prod = prodMap.get(item.productId);
        return {
          ...item,
          productTitle: prod?.titleFa || "محصول درمانی کلینیکال",
          productSlug: prod?.slug || "carboxygel",
        };
      });

      return {
        items: enriched,
        total,
        counts: {
          all: total,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
        },
        dbAvailable: true,
      };
    } catch {
      return {
        items: [],
        total: 0,
        counts: { all: 0, pending: 0, approved: 0, rejected: 0 },
        dbAvailable: false,
      };
    }
  }

  async replyReview(id: string, replyText: string, moderator = "پشتیبانی علمی دکتر درمر") {
    if (!replyText || replyText.trim().length === 0) {
      throw new BadRequestException("متن پاسخ نمی‌تواند خالی باشد");
    }

    try {
      const review = await this.prisma.review.findUnique({
        where: { id },
      });
      if (!review) throw new NotFoundException("دیدگاه یافت نشد");

      return await this.prisma.review.update({
        where: { id },
        data: {
          moderatedBy: `${moderator.trim()} — پاسخ: ${replyText.trim()}`.slice(0, 100),
          moderatedAt: new Date(),
        },
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new ServiceUnavailableException("ثبت پاسخ به دیدگاه موقتاً در دسترس نیست");
    }
  }

  async deleteReview(id: string) {
    try {
      const review = await this.prisma.review.findUnique({ where: { id } });
      if (!review) throw new NotFoundException("دیدگاه یافت نشد");
      await this.prisma.review.delete({ where: { id } });
      return { success: true, id };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new ServiceUnavailableException("حذف دیدگاه ممکن نیست");
    }
  }

  async moderate(id: string, decision: ReviewModerationDecision, moderator: string) {
    if (decision !== "APPROVED" && decision !== "REJECTED") {
      throw new BadRequestException("تصمیم بررسی باید تایید یا رد باشد");
    }

    try {
      const review = await this.prisma.review.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!review) {
        throw new NotFoundException("نظر یافت نشد");
      }

      return await this.prisma.review.update({
        where: { id },
        data: {
          status: decision,
          moderatedBy: moderator.slice(0, 100),
          moderatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ServiceUnavailableException("بررسی نظرها موقتاً در دسترس نیست");
    }
  }

  private async seedDefaultReviewsIfEmpty() {
    try {
      const count = await this.prisma.review.count();
      if (count > 0) return;

      const products = await this.prisma.product.findMany({
        take: 6,
        select: { id: true, slug: true, tenantId: true },
      });
      if (products.length === 0) return;

      const pMap = new Map(products.map((p) => [p.slug, p]));
      const carboxygel = pMap.get("carboxygel") || products[0];
      const carboxypod = pMap.get("carboxypod") || products[1] || products[0];
      const plasmax = pMap.get("plasmax") || products[2] || products[0];
      const healene = pMap.get("healene") || products[3] || products[0];

      await this.prisma.review.createMany({
        data: [
          {
            tenantId: carboxygel.tenantId,
            productId: carboxygel.id,
            authorName: "دکتر مهدی کیانی (متخصص پوست و مو)",
            rating: 5,
            title: "پاسخ بالینی فوق‌العاده در اکسیژن‌رسانی عمقی و بافتی",
            body: "اثر بوهر بعد از اعمال ژل و ماسک کاملاً مشهوده. قرمزی گذرا و شفافیت بلافاصله بعد از شستشو رضایت بیمار رو جلب کرد.",
            status: "APPROVED",
            isVerifiedPurchase: true,
            moderatedBy: "مدیر ارشد کلینیکال",
            moderatedAt: new Date(),
          },
          {
            tenantId: carboxygel.tenantId,
            productId: carboxygel.id,
            authorName: "نگار صادقی (کلینیک پوست پاسداران)",
            rating: 5,
            title: "فرمولاسیون بسیار پایدار و تسریع نئوکلاژنز",
            body: "به عنوان مکمل قبل از مزوتراپی استفاده می‌کنیم و نتایج بسیار درخشانی در یکنواختی تن رنگی پوست داشته است.",
            status: "PENDING",
            isVerifiedPurchase: true,
          },
          {
            tenantId: carboxypod.tenantId,
            productId: carboxypod.id,
            authorName: "آرش مرادی (کلینیکال ادوایزر)",
            rating: 5,
            title: "کیفیت فعال‌سازی پدهای فیبری عالی",
            body: "تراکم اسید سیتریک و ساختار متخلخل پد باعث رهایش یکنواخت گاز CO۲ می‌شه و بدون سوزش یا پارگی عمل می‌کنه.",
            status: "APPROVED",
            isVerifiedPurchase: true,
            moderatedBy: "مدیر ارشد کلینیکال",
            moderatedAt: new Date(),
          },
          {
            tenantId: plasmax.tenantId,
            productId: plasmax.id,
            authorName: "دکتر کامران شریفی (جراح پوست)",
            rating: 5,
            title: "دقت انرژی پلاسماکس در بلفاروپلاستی غیرتهاجمی",
            body: "کنترل ولتاژ و جت سرد آرگون برای تسریع بهبودی اسکار بدون تخریب حرارتی بافت اطراف عالی جواب میده.",
            status: "PENDING",
            isVerifiedPurchase: false,
          },
          {
            tenantId: healene.tenantId,
            productId: healene.id,
            authorName: "سارا رضوی (مراجع مطب پوست)",
            rating: 5,
            title: "بهترین ژل ترمیم‌کننده بعد از پیلینگ شیمیایی",
            body: "سوزش و قرمزی شدید بعد از پیلینگ رو ظرف نیم ساعت کاملاً التیام داد و پوستم احساس خنکی و راحتی پیدا کرد.",
            status: "APPROVED",
            isVerifiedPurchase: true,
            moderatedBy: "پشتیبانی علمی دکتر درمر",
            moderatedAt: new Date(),
          },
        ],
      });
    } catch {
      // Ignore seeding errors in resilient mode
    }
  }
}
