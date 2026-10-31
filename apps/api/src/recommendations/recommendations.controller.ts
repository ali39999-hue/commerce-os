import { Controller, Get, Param, Query } from "@nestjs/common";
import { RecommendationsService } from "./recommendations.service";

// ADR-006: heuristic recommendations — ranking happens server-side only
@Controller("recommendations")
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get("products/:productId")
  async related(@Param("productId") productId: string, @Query("limit") limit?: string) {
    return this.recommendationsService.related(
      productId,
      limit !== undefined ? Number.parseInt(limit, 10) : undefined
    );
  }

  @Get("popular")
  async popular(@Query("limit") limit?: string) {
    return this.recommendationsService.popular(
      limit !== undefined ? Number.parseInt(limit, 10) : undefined
    );
  }

  @Get("for-you")
  async forYou(@Query("sessionId") sessionId?: string, @Query("limit") limit?: string) {
    return this.recommendationsService.forYou(
      sessionId,
      limit !== undefined ? Number.parseInt(limit, 10) : undefined
    );
  }
}
