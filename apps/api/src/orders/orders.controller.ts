import { Controller, Get, Post, Param, Query, Body, Res, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { OrderTransitionDto } from "../common/dto/resource-writes.dto";
import { OrdersService } from "./orders.service";
import { OrderStatus } from "@commerce-os/domain";
import type { Response } from "express";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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

  @Get("stores/:storeId")
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
