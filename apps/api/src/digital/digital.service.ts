import {
  BadRequestException,
  GoneException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { validateIranianMobile } from "@commerce-os/localization";
import { PrismaService } from "../database/prisma.service";
import * as crypto from "node:crypto";

// ── ADR-012: کالای دیجیتال و تحویل لایسنس‌دار (Digital Goods & Grants) ──
// Grant یکتا روی orderLineId (آیدمپوتنت)، سقف دانلود پیش‌فرض ۵، انقضای ۳۰ روزه.
// دانلود با increment شرطی اتمیک انجام می‌شود — هرگز از سقف عبور نمی‌کند.

const GRANT_MAX_DOWNLOADS = 5;
const GRANT_TTL_DAYS = 30;
const GRANTS_LIST_LIMIT = 50;
const DEMO_DOWNLOAD_URL = "https://cdn.commerce-os.local/demo/preview.pdf";

export interface CreateGrantsForPaidOrderPayload {
  orderId: string;
  tenantId: string;
  phone: string;
  userId?: string | null;
}

export interface CreateGrantsResult {
  created: number;
  skipped: number;
  dbAvailable: boolean;
}

export interface DigitalGrantView {
  id: string;
  orderId: string;
  token: string;
  productTitle: string;
  downloadCount: number;
  maxDownloads: number;
  remainingDownloads: number;
  revokedAt: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface GrantsByPhoneResult {
  items: DigitalGrantView[];
  dbAvailable: boolean;
}

export interface DownloadGrantResult {
  ok: boolean;
  downloadUrl: string;
  remainingDownloads: number;
  expiresAt: string;
}

export interface RevokeGrantResult {
  id: string;
  revokedAt: string | null;
}

function toGrantView(grant: {
  id: string;
  orderId: string;
  token: string;
  productTitle: string;
  downloadCount: number;
  maxDownloads: number;
  revokedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
}): DigitalGrantView {
  return {
    id: grant.id,
    orderId: grant.orderId,
    token: grant.token,
    productTitle: grant.productTitle,
    downloadCount: grant.downloadCount,
    maxDownloads: grant.maxDownloads,
    remainingDownloads: Math.max(0, grant.maxDownloads - grant.downloadCount),
    revokedAt: grant.revokedAt ? grant.revokedAt.toISOString() : null,
    expiresAt: grant.expiresAt.toISOString(),
    createdAt: grant.createdAt.toISOString(),
  };
}

@Injectable()
export class DigitalService {
  constructor(private readonly prisma: PrismaService) {}

  // ── اعطای لایسنس پس از پرداخت (ORDER_PAID) ──
  // برای هر خط سفارش دیجیتال (variant.digitalFileUrl تنظیم شده) یک Grant:
  // آیدمپوتنت از راه یکتایی orderLineId — اجرای تکراری چیزی نمی‌سازد.
  // هرگز throw نمی‌کند — حالت DB-down با { created: 0, dbAvailable: false } پاسخ می‌دهد.
  async createGrantsForPaidOrder(payload: CreateGrantsForPaidOrderPayload): Promise<CreateGrantsResult> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: payload.orderId },
        select: {
          id: true,
          tenantId: true,
          userId: true,
          customerPhone: true,
          lines: {
            select: {
              id: true,
              variantId: true,
              titleFa: true,
              variant: { select: { digitalFileUrl: true } },
            },
          },
        },
      });

      if (!order) {
        return { created: 0, skipped: 0, dbAvailable: true };
      }

      const phone =
        typeof payload.phone === "string" && payload.phone.trim().length > 0
          ? payload.phone.trim()
          : order.customerPhone;
      const userId = payload.userId ?? order.userId ?? null;
      const expiresAt = new Date(Date.now() + GRANT_TTL_DAYS * 24 * 60 * 60 * 1000);

      let created = 0;
      let skipped = 0;

      for (const line of order.lines) {
        // فقط خطوط دیجیتال (فایل روی واریانت) لایسنس می‌گیرند
        if (!line.variant?.digitalFileUrl) {
          continue;
        }

        try {
          // آیدمپوتنسی (ADR-012): یک لایسنس به‌ازای هر خط سفارش — موجود برنده است
          const existing = await this.prisma.digitalGrant.findUnique({
            where: { orderLineId: line.id },
            select: { id: true },
          });
          if (existing) {
            skipped += 1;
            continue;
          }

          await this.prisma.digitalGrant.create({
            data: {
              tenantId: order.tenantId,
              orderId: order.id,
              orderLineId: line.id,
              variantId: line.variantId,
              userId,
              phone,
              token: crypto.randomBytes(32).toString("hex"),
              productTitle: line.titleFa,
              maxDownloads: GRANT_MAX_DOWNLOADS,
              expiresAt,
            },
          });

          created += 1;
        } catch (err: any) {
          // مسابقه همزمانی با worker دیگر: یکتایی orderLineId آن را حل می‌کند
          if (err?.code === "P2002") {
            skipped += 1;
            continue;
          }
          throw err;
        }
      }

      return { created, skipped, dbAvailable: true };
    } catch {
      // Resilient mode: grant creation must never break the outbox loop
      return { created: 0, skipped: 0, dbAvailable: false };
    }
  }

  // ── «محصولات دیجیتال من»: لایسنس‌های یک شماره موبایل، جدیدترین اول ──
  async listGrantsByPhone(phone: string): Promise<GrantsByPhoneResult> {
    if (!validateIranianMobile(phone ?? "")) {
      throw new BadRequestException("شماره موبایل ایرانی معتبر وارد کنید (۰۹xxxxxxxxx)");
    }

    try {
      const grants = await this.prisma.digitalGrant.findMany({
        where: { phone },
        orderBy: { createdAt: "desc" },
        take: GRANTS_LIST_LIMIT,
      });

      return { items: grants.map(toGrantView), dbAvailable: true };
    } catch {
      // DB-down: zero-state so the storefront never breaks
      return { items: [], dbAvailable: false };
    }
  }

  // ── دانلود لایسنس‌دار: اعتبارسنجی + claim اتمیک سقف دانلود ──
  async downloadByToken(token: string): Promise<DownloadGrantResult> {
    try {
      const grant = await this.prisma.digitalGrant.findUnique({ where: { token } });

      if (!grant) {
        throw new NotFoundException("لایسنس دیجیتال مورد نظر یافت نشد");
      }

      const now = new Date();
      if (grant.revokedAt || grant.expiresAt.getTime() <= now.getTime()) {
        throw new GoneException("این لایسنس باطل شده یا منقضی شده است");
      }

      // Claim اتمیک (ADR-012): افزایش شرطی — همزمانی و سقف در خود شرط UPDATE حل می‌شود
      const claimed = await this.prisma.digitalGrant.updateMany({
        where: {
          id: grant.id,
          downloadCount: { lt: grant.maxDownloads },
          revokedAt: null,
          expiresAt: { gt: now },
        },
        data: { downloadCount: { increment: 1 } },
      });

      if (claimed.count === 0) {
        throw new GoneException("سقف دانلود این لایسنس به پایان رسیده است");
      }

      const variant = await this.prisma.productVariant.findUnique({
        where: { id: grant.variantId },
        select: { digitalFileUrl: true },
      });

      return {
        ok: true,
        downloadUrl: variant?.digitalFileUrl ?? DEMO_DOWNLOAD_URL,
        remainingDownloads: Math.max(0, grant.maxDownloads - (grant.downloadCount + 1)),
        expiresAt: grant.expiresAt.toISOString(),
      };
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof GoneException) {
        throw err;
      }
      // DB-down: 503 فارسی
      throw new ServiceUnavailableException("سرویس پایگاه داده در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید");
    }
  }

  // ── ابطال لایسنس توسط مستأجر (idempotent) ──
  async revokeGrant(grantId: string, tenantId: string): Promise<RevokeGrantResult> {
    try {
      const grant = await this.prisma.digitalGrant.findFirst({
        where: { id: grantId, tenantId },
      });

      if (!grant) {
        throw new NotFoundException("لایسنس دیجیتال مورد نظر یافت نشد");
      }

      if (grant.revokedAt) {
        // از قبل باطل شده — همان نتیجه برمی‌گردد (idempotent)
        return { id: grant.id, revokedAt: grant.revokedAt.toISOString() };
      }

      const now = new Date();
      await this.prisma.digitalGrant.update({
        where: { id: grant.id },
        data: { revokedAt: now },
      });

      return { id: grant.id, revokedAt: now.toISOString() };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      // DB-down: 503 فارسی
      throw new ServiceUnavailableException("سرویس پایگاه داده در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید");
    }
  }
}
