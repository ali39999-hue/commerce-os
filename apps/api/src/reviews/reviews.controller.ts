import { Controller, Get, Post, Param, Query, Body, Headers, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { SessionUserGuard, SessionCustomer } from "../common/guards/session-user.guard";
import { CurrentCustomer } from "../common/guards/current-tenant.decorator";
import { ReviewCreateDto } from "../common/dto/resource-writes.dto";
import { ReviewsService, ReviewModerationDecision } from "./reviews.service";

const DEFAULT_TENANT_ID = "demo-tenant-id";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get("products/:productId")
  async listForProduct(@Param("productId") productId: string) {
    return this.reviewsService.listForProduct(productId);
  }

  // Customer review submission: session-aware. If signed in, the userId is
  // bound to the authenticated session customer (AUTH-002), preventing client-
  // side user impersonation. Guest submissions pass through with userId: null.
  @Post("products/:productId")
  @UseGuards(SessionUserGuard)
  async create(
    @Param("productId") productId: string,
    @Body() body: ReviewCreateDto,
    @CurrentCustomer() customer?: SessionCustomer,
    @Headers("x-tenant-id") tenantId?: string
  ) {
    // If signed in, prioritize authenticated identity over arbitrary authorName
    const resolvedAuthor = customer?.fullName?.trim() || body?.authorName;
    const resolvedUserId = customer?.id;

    return this.reviewsService.create(
      productId,
      {
        authorName: resolvedAuthor,
        rating: body?.rating,
        title: body?.title,
        body: body?.body,
      },
      tenantId || DEFAULT_TENANT_ID,
      resolvedUserId
    );
  }

  @Get("admin/pending")
  async listPending(@Query("limit") limit?: string) {
    return this.reviewsService.listPending(limit ? parseInt(limit, 10) : 50);
  }

  // Review moderation is an admin decision (AUTH-003); customer review
  // submission stays open pending the identity binding in AUTH-002.
  @Post("admin/:id/moderate")
  @UseGuards(AdminGuard)
  async moderate(
    @Param("id") id: string,
    @Body() body: { decision: ReviewModerationDecision; moderator?: string }
  ) {
    return this.reviewsService.moderate(id, body?.decision, body?.moderator || "admin");
  }
}
