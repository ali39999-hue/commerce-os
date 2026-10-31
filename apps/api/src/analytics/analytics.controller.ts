import { Body, Controller, Get, Headers, Post, Query } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

export interface IngestAnalyticsEventBody {
  name?: string;
  sessionId?: string;
  props?: Record<string, unknown>;
}

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post("events")
  ingest(
    @Body() body: IngestAnalyticsEventBody,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("x-user-id") userId?: string
  ) {
    return this.analyticsService.ingest({
      name: body?.name ?? "",
      sessionId: body?.sessionId,
      props: body?.props,
      tenantId,
      userId,
    });
  }

  @Get("summary")
  summary(@Query("days") days?: string) {
    return this.analyticsService.summary(days ? parseInt(days, 10) : 7);
  }
}
