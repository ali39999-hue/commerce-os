import { Controller, Get, Post, Param, Query, Body, Res, UseGuards, UnauthorizedException } from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { CurrentCustomer } from "../common/guards/current-tenant.decorator";
import { SessionUserGuard, SessionCustomer } from "../common/guards/session-user.guard";
import { OrderTransitionDto } from "../common/dto/resource-writes.dto";
import { OrdersService } from "./orders.service";
import { OrderStatus } from "@commerce-os/domain";
import type { Response } from "express";

@Controller("orders")
@UseGuards(SessionUserGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // GET /v1/orders/my — session-bound (AUTH-002 step 6): the customer phone
  // comes from the OTP session, never a client parameter. Declared BEFORE the
  // :id catch-all so "my" is never swallowed as an order id.
  @Get("my")
  async listMyOrders(
    @CurrentCustomer() customer?: SessionCustomer,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string
  ) {
    if (!customer) {
      throw new UnauthorizedException("برای مشاهده سفارش‌های خود ابتدا وارد شوید");
    }
    return this.ordersService.listMyOrders({
      phone: customer.phone,
      limit: limit ? parseInt(limit, 10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }

  @Get(":id")
  async getOrder(@Param("id") id: string) {
    return this.ordersService.getOrder(id);
  }

  @Get(":id/invoice")
  async getTaxInvoice(@Param("id") id: string, @Res() res: Response) {
    const html = await this.ordersService.generateInvoiceHtml(id);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  }

  // Legacy admin-style listing — exposes every customer's name/phone/orders,
  // locked behind the AdminGuard (AUTH-002 final).
  @Get("stores/:storeId")
  @UseGuards(AdminGuard)
  async listStoreOrders(
    @Param("storeId") storeId: string,
    @Query("status") status?: OrderStatus,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string
  ) {
    return this.ordersService.listStoreOrders({
      storeId,
      status,
      limit: limit ? parseInt(limit, 10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }

  // Order lifecycle transitions are operator decisions (AUTH-003).
  @Post(":id/transition")
  @UseGuards(AdminGuard)
  async transitionStatus(
    @Param("id") id: string,
    @Body() body: OrderTransitionDto
  ) {
    return this.ordersService.transitionStatus(
      id,
      body.toStatus as OrderStatus,
      body.actor || "OPERATOR",
      body.reason
    );
  }
}
