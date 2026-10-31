import { Controller, Get, Query } from "@nestjs/common";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query("storeSlug") storeSlug = "demo",
    @Query("q") q?: string,
    @Query("category") category?: string,
    @Query("minPrice") minPrice?: string,
    @Query("maxPrice") maxPrice?: string,
    @Query("inStock") inStock?: string,
    @Query("sort") sort?: "newest" | "price_asc" | "price_desc",
    @Query("limit") limit?: string,
    @Query("offset") offset?: string
  ) {
    return this.searchService.search({
      storeSlug,
      query: q,
      categorySlug: category,
      minPriceRials: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPriceRials: maxPrice ? parseInt(maxPrice, 10) : undefined,
      inStockOnly: inStock === "true" || inStock === "1",
      sort,
      limit: limit ? parseInt(limit, 10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }
}
