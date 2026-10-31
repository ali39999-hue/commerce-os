import { BadRequestException, Injectable, Logger, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { validateIranianMobile } from "@commerce-os/localization";
import { PrismaService } from "../database/prisma.service";
import type { QuoteRequestStatus } from "../generated/prisma/client";

// ── ADR-010: درخواست استعلام قیمت عمده (B2B Quote Requests) ──
// سرنخ فروش رکورد درجه یک است: روی DB-down «پذیرفته و در حافظه لاگ» می‌شود
// ({accepted: true, persisted: false}) — سرنخ هرگز از دست نمی‌رود و هرگز
// ساختگی به‌عنوان ذخیره‌شده جعل نمی‌شود (برخلاف تعهدات مالی ADR-009).

export interface CreateQuoteRequestInput {
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  itemsSummary?: string;
  desiredQty?: number;
}

export interface QuoteRequestView {
  id: string;
  status: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string | null;
  itemsSummary: string;
  desiredQty: number;
  adminNote: string | null;
  quotedAt: string | null;
  createdAt: string;
}

export interface CreateQuoteRequestResult {
  accepted: boolean;
  persisted: boolean;
  id?: string;
  dbAvailable?: boolean;
  message?: string;
}

export interface AdminQuoteRequestsResult {
  items: QuoteRequestView[];
  dbAvailable: boolean;
}

const COMPANY_MIN = 2;
const COMPANY_MAX = 200;
const CONTACT_MIN = 2;
const CONTACT_MAX = 150;
const SUMMARY_MIN = 5;
const SUMMARY_MAX = 2000;
const QTY_MIN = 1;
const QTY_MAX = 100000;

// Forward-only machine: NEW → IN_REVIEW → QUOTED → CLOSED
const STATUS_RANK: Record<QuoteRequestStatus, number> = {
  NEW: 0,
  IN_REVIEW: 1,
  QUOTED: 2,
  CLOSED: 3,
};

const VALID_STATUSES: readonly QuoteRequestStatus[] = ["NEW", "IN_REVIEW", "QUOTED", "CLOSED"];

// Placeholder for lead rows when the demo store cannot be resolved (same
// pattern as the worker's NIL_TENANT_UUID for tenant-less webhook rows).
const NIL_TENANT_UUID = "00000000-0000-0000-0000-000000000000";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── PII masking for out-of-band lead logs (inline partial mask, ADR-010) ──
function maskPhone(phone: string): string {
  if (!validateIranianMobile(phone)) return "***";
  return `${phone.slice(0, 4)}****${phone.slice(-2)}`;
}

function maskEmail(email: string | null): string {
  if (!email) return "";
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  return `${email.slice(0, 1)}***${email.slice(at)}`;
}

function toQuoteRequestView(row: {
  id: string;
  status: QuoteRequestStatus;
  companyName: string;
  contactName: string;
  phone: string;
  email: string | null;
  itemsSummary: string;
  desiredQty: number;
  adminNote: string | null;
  quotedAt: Date | null;
  createdAt: Date;
}): QuoteRequestView {
  return {
    id: row.id,
    status: row.status,
    companyName: row.companyName,
    contactName: row.contactName,
    phone: row.phone,
    email: row.email,
    itemsSummary: row.itemsSummary,
    desiredQty: row.desiredQty,
    adminNote: row.adminNote,
    quotedAt: row.quotedAt ? row.quotedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}

@Injectable()
export class B2bService {
  private readonly logger = new Logger(B2bService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ── ثبت سرنخ (عمومی): DB-up → persist با وضعیت NEW؛ DB-down → capture در لاگ ──
  async createQuoteRequest(
    input: CreateQuoteRequestInput,
    headerTenantId?: string
  ): Promise<CreateQuoteRequestResult> {
    const companyName = (input.companyName ?? "").trim();
    if (companyName.length < COMPANY_MIN || companyName.length > COMPANY_MAX) {
      throw new BadRequestException(
        `نام شرکت باید بین ${COMPANY_MIN} تا ${COMPANY_MAX} کاراکتر باشد`
      );
    }

    const contactName = (input.contactName ?? "").trim();
    if (contactName.length < CONTACT_MIN || contactName.length > CONTACT_MAX) {
      throw new BadRequestException(
        `نام رابط باید بین ${CONTACT_MIN} تا ${CONTACT_MAX} کاراکتر باشد`
      );
    }

    const phone = (input.phone ?? "").trim();
    if (!validateIranianMobile(phone)) {
      throw new BadRequestException("شماره موبایل نامعتبر است (باید ۱۱ رقم و با ۰۹ شروع شود)");
    }

    const email = (input.email ?? "").trim();
    if (email.length > 0 && !EMAIL_PATTERN.test(email)) {
      throw new BadRequestException("نشانی ایمیل نامعتبر است");
    }

    const itemsSummary = (input.itemsSummary ?? "").trim();
    if (itemsSummary.length < SUMMARY_MIN || itemsSummary.length > SUMMARY_MAX) {
      throw new BadRequestException(
        `خلاصه اقلام باید بین ${SUMMARY_MIN} تا ${SUMMARY_MAX} کاراکتر باشد`
      );
    }

    const desiredQty = Math.trunc(Number(input.desiredQty ?? 1));
    if (!Number.isInteger(desiredQty) || desiredQty < QTY_MIN || desiredQty > QTY_MAX) {
      throw new BadRequestException(`تعداد درخواستی باید عددی بین ${QTY_MIN} تا ${QTY_MAX} باشد`);
    }

    try {
      const tenantId = await this.resolveTenantId(headerTenantId);

      const row = await this.prisma.quoteRequest.create({
        data: {
          tenantId,
          companyName,
          contactName,
          phone,
          email: email.length > 0 ? email : null,
          itemsSummary,
          desiredQty,
          status: "NEW",
        },
      });

      return { accepted: true, persisted: true, id: row.id, dbAvailable: true };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }

      // ── Lead-capture policy (ADR-010): DB-down می‌تواند سرنخ را نابود کند،
      // نه ما. کل payload در سطح warn لاگ می‌شود (با PII ماسک‌شده) تا بعداً
      // بازپخش شود؛ اما پاسخ هرگز «persisted» جعل نمی‌شود. ──
      this.logger.warn(
        `B2B quote request captured out-of-band (DB unavailable): ${JSON.stringify({
          companyName,
          contactName,
          phone: maskPhone(phone),
          email: maskEmail(email),
          itemsSummary,
          desiredQty,
          capturedAt: new Date().toISOString(),
        })}`
      );

      return {
        accepted: true,
        persisted: false,
        dbAvailable: false,
        message: "درخواست شما ثبت شد؛ به‌محض اتصال سیستم ذخیره دائمی می‌شود",
      };
    }
  }

  // ── لیست ادمین: استعلام‌های عمده (جدیدترین اول) ──
  async adminList(tenantId: string, status?: string): Promise<AdminQuoteRequestsResult> {
    let statusFilter: QuoteRequestStatus | undefined;
    if (status !== undefined && status.trim().length > 0) {
      const candidate = status.trim();
      if (!VALID_STATUSES.includes(candidate as QuoteRequestStatus)) {
        throw new BadRequestException("وضعیت درخواست‌شده نامعتبر است");
      }
      statusFilter = candidate as QuoteRequestStatus;
    }

    try {
      const rows = await this.prisma.quoteRequest.findMany({
        where: { tenantId, ...(statusFilter ? { status: statusFilter } : {}) },
        orderBy: { createdAt: "desc" },
      });

      return { items: rows.map(toQuoteRequestView), dbAvailable: true };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      return { items: [], dbAvailable: false };
    }
  }

  // ── ماشین وضعیت forward-only: NEW → IN_REVIEW → QUOTED → CLOSED ──
  async updateStatus(
    id: string,
    tenantId: string,
    status: string,
    adminNote?: string
  ): Promise<QuoteRequestView> {
    if (!VALID_STATUSES.includes(status as QuoteRequestStatus)) {
      throw new BadRequestException("وضعیت درخواست‌شده نامعتبر است");
    }
    const target = status as QuoteRequestStatus;

    try {
      const row = await this.prisma.quoteRequest.findFirst({ where: { id, tenantId } });

      if (!row) {
        throw new NotFoundException("درخواست استعلام یافت نشد");
      }

      // فقط انتقال به مرحله بعدی مجاز است؛ پس‌رفت یا پرش یا تکرار وضعیت رد می‌شود
      if (STATUS_RANK[target] !== STATUS_RANK[row.status] + 1) {
        throw new BadRequestException("انتقال وضعیت معتبر نیست");
      }

      const updated = await this.prisma.quoteRequest.update({
        where: { id: row.id },
        data: {
          status: target,
          ...(adminNote !== undefined && adminNote.trim().length > 0
            ? { adminNote: adminNote.trim() }
            : {}),
          ...(target === "QUOTED" ? { quotedAt: new Date() } : {}),
        },
      });

      return toQuoteRequestView(updated);
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof NotFoundException) {
        throw err;
      }
      // DB-down: honest refusal — a real pipeline state change is never faked
      throw new ServiceUnavailableException(
        "تغییر وضعیت استعلام موقتاً در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید"
      );
    }
  }

  // ── مستأجر: هدر ادمین، وگرنه مستأجر فروشگاه نمونه (slug: demo)، وگرنه NIL ──
  private async resolveTenantId(headerTenantId?: string): Promise<string> {
    if (headerTenantId && headerTenantId.trim().length > 0) {
      return headerTenantId.trim();
    }

    // The storefront demo store (seed slug 'demo') pins the demo tenant
    const store = await this.prisma.store.findFirst({
      where: { slug: "demo", status: "ACTIVE" },
      select: { tenantId: true },
    });

    return store?.tenantId ?? NIL_TENANT_UUID;
  }
}
