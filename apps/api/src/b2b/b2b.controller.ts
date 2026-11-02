import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { CurrentTenant } from "../common/guards/current-tenant.decorator";
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
  // Pipeline progression is an admin decision (AUTH-003); lead capture stays
  // public and tenant resolves from the guard, not the client header (AUTH-002).
  @Post("quote-requests/:id/status")
  @UseGuards(AdminGuard)
  updateStatus(
    @Param("id") id: string,
    @Body() body?: { status?: string; adminNote?: string },
    @CurrentTenant() tenantId?: string
  ) {
    return this.b2bService.updateStatus(id, tenantId ?? "", body?.status ?? "", body?.adminNote);
  }

  // Same guard style as loyalty/subscriptions: x-tenant-id header is required
  private requireTenant(tenantId?: string): string {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new UnauthorizedException("شناسه مستأجر (x-tenant-id) الزامی است");
    }
    return tenantId.trim();
  }
}
