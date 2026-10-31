import { Controller, Get, Post, Query, Body, Headers } from "@nestjs/common";
import { WebhooksService } from "./webhooks.service";

@Controller("webhooks")
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post("dispatch")
  async dispatch(
    @Headers("x-tenant-id") tenantId?: string,
    @Body() body: { eventType?: string; payload?: Record<string, any>; targetUrl?: string } = {}
  ) {
    return this.webhooksService.dispatch(
      body.eventType || "ORDER_PAID",
      body.payload || {},
      body.targetUrl || "",
      tenantId || "demo-tenant-header"
    );
  }

  @Post("test")
  async testWebhook(@Body() body: { url?: string; eventType?: string } = {}) {
    return this.webhooksService.testWebhook(body.url || "", body.eventType || "ORDER_PAID");
  }

  @Get()
  async list(@Query("limit") limit?: string) {
    return this.webhooksService.list(limit ? parseInt(limit, 10) : 50);
  }
}
