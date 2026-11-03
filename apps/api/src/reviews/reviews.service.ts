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

  async listForProduct(productId: string) {
    try {
      const [items, approved] = await Promise.all([
        this.prisma.review.findMany({
          where: { productId, status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        this.prisma.review.findMany({
          where: { productId, status: "APPROVED" },
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
      // Database unavailable — storefront falls back to its local seeds
      return {
        items: [],
        total: 0,
        average: 0,
        distribution: this.emptyDistribution(),
        dbAvailable: false,
      };
    }
  }

  async create(productId: string, dto: CreateReviewInput, tenantId: string, userId?: string) {
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
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, tenantId: true },
      });

      if (!product) {
        throw new NotFoundException("محصول یافت نشد");
      }

      // Check if user has a completed order containing this product to grant verified badge
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
}
