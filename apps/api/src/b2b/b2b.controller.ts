import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { B2bService } from "./b2b.service";

// ADR-010: درخواست استعلام قیمت عمده — ثبت عمومی + لیست/تغییر وضعیت ادمین
@Controller("b2b")
export class B2bController {
  constructor(private readonly b2bService: B2bService) {}

  // POST /v1/b2b/quote-requests — ثبت سرنخ (عمومی؛ DB-down → lead-capture)
  @Post("quote-requests")
  create(
    @Body()
    body?: {
      companyName?: string;
      contactName?: string;
      phone?: string;
      email?: string;
      itemsSummary?: string;
      desiredQty?: number;
    },
    @Headers("x-tenant-id") tenantId?: string
  ) {
    return this.b2bService.createQuoteRequest(
      {
        companyName: body?.companyName,
        contactName: body?.contactName,
        phone: body?.phone,
        email: body?.email,
        itemsSummary: body?.itemsSummary,
        desiredQty: body?.desiredQty,
      },
      tenantId
    );
  }

  // GET /v1/b2b/quote-requests?status=NEW — لیست ادمین
  @Get("quote-requests")
  adminList(
    @Query("status") status?: string,
    @Headers("x-tenant-id") tenantId?: string
  ) {
    const tenant = this.requireTenant(tenantId);
    return this.b2bService.adminList(tenant, status);
  }

  // POST /v1/b2b/quote-requests/:id/status — NEW → IN_REVIEW → QUOTED → CLOSED
  @Post("quote-requests/:id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body?: { status?: string; adminNote?: string },
    @Headers("x-tenant-id") tenantId?: string
  ) {
    const tenant = this.requireTenant(tenantId);
    return this.b2bService.updateStatus(id, tenant, body?.status ?? "", body?.adminNote);
  }

  // Same guard style as loyalty/subscriptions: x-tenant-id header is required
  private requireTenant(tenantId?: string): string {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new UnauthorizedException("شناسه مستأجر (x-tenant-id) الزامی است");
    }
    return tenantId.trim();
  }
}
