import { Controller, Get, Post, Param, Query, Body, Headers } from "@nestjs/common";
import { ReviewsService, CreateReviewInput, ReviewModerationDecision } from "./reviews.service";

const DEFAULT_TENANT_ID = "demo-tenant-id";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get("products/:productId")
  async listForProduct(@Param("productId") productId: string) {
    return this.reviewsService.listForProduct(productId);
  }

  @Post("products/:productId")
  async create(
    @Param("productId") productId: string,
    @Body() body: CreateReviewInput,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("x-user-id") userId?: string
  ) {
    return this.reviewsService.create(
      productId,
      {
        authorName: body?.authorName,
        rating: body?.rating,
        title: body?.title,
        body: body?.body,
      },
      tenantId || DEFAULT_TENANT_ID,
      userId
    );
  }

  @Get("admin/pending")
  async listPending(@Query("limit") limit?: string) {
    return this.reviewsService.listPending(limit ? parseInt(limit, 10) : 50);
  }

  @Post("admin/:id/moderate")
  async moderate(
    @Param("id") id: string,
    @Body() body: { decision: ReviewModerationDecision; moderator?: string }
  ) {
    return this.reviewsService.moderate(id, body?.decision, body?.moderator || "admin");
  }
}
