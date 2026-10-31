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
import { SubscriptionsService } from "./subscriptions.service";

// ADR-009: اشتراک‌های دوره‌ای — فهرست پلن‌ها، ثبت عضویت، مدیریت کاربر، لیست ادمین
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // GET /v1/subscriptions/plans?storeSlug=demo
  @Get("plans")
  listPlans(@Query("storeSlug") storeSlug?: string) {
    return this.subscriptionsService.listPlans(storeSlug ?? "");
  }

  // POST /v1/subscriptions — ثبت عضویت (عمومی؛ کاربر ناشناس profileBindingId می‌گیرد)
  @Post()
  create(
    @Body()
    body?: {
      planId?: string;
      userId?: string;
      phone?: string;
      quantity?: number;
    }
  ) {
    return this.subscriptionsService.create({
      planId: body?.planId,
      userId: body?.userId,
      phone: body?.phone,
      quantity: body?.quantity,
    });
  }

  // GET /v1/subscriptions/users/:userId — اشتراک‌های من
  @Get("users/:userId")
  async listForUser(
    @Param("userId") userId: string,
    @Headers("x-tenant-id") tenantId?: string
  ) {
    const tenant = this.requireTenant(tenantId);
    return this.subscriptionsService.listForUser(userId, tenant);
  }

  // POST /v1/subscriptions/:id/pause — ACTIVE → PAUSED
  @Post(":id/pause")
  pause(
    @Param("id") id: string,
    @Headers("x-tenant-id") tenantId?: string,
    @Body() body?: { reason?: string }
  ) {
    const tenant = this.requireTenant(tenantId);
    return this.subscriptionsService.pause(id, tenant, body?.reason);
  }

  // POST /v1/subscriptions/:id/resume — PAUSED → ACTIVE
  @Post(":id/resume")
  resume(@Param("id") id: string, @Headers("x-tenant-id") tenantId?: string) {
    const tenant = this.requireTenant(tenantId);
    return this.subscriptionsService.resume(id, tenant);
  }

  // POST /v1/subscriptions/:id/cancel — ACTIVE|PAUSED → CANCELLED
  @Post(":id/cancel")
  cancel(
    @Param("id") id: string,
    @Headers("x-tenant-id") tenantId?: string,
    @Body() body?: { reason?: string }
  ) {
    const tenant = this.requireTenant(tenantId);
    return this.subscriptionsService.cancel(id, tenant, body?.reason);
  }

  // GET /v1/subscriptions/admin?status=ACTIVE — لیست ادمین
  @Get("admin")
  adminList(@Query("status") status?: string, @Headers("x-tenant-id") tenantId?: string) {
    const tenant = this.requireTenant(tenantId);
    return this.subscriptionsService.adminList(tenant, status);
  }

  // Same guard style as loyalty: x-tenant-id header is required
  private requireTenant(tenantId?: string): string {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new UnauthorizedException("شناسه مستأجر (x-tenant-id) الزامی است");
    }
    return tenantId.trim();
  }
}
