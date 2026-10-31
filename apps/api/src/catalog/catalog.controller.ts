import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('stores')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('resolve')
  async resolve(@Query('slug') slug?: string) {
    return this.catalog.resolveStore(slug ?? '');
  }

  @Get(':storeSlug/products')
  async list(
    @Param('storeSlug') storeSlug: string,
    @Query('limit') rawLimit?: string,
  ) {
    let limit = 24;
    if (rawLimit !== undefined) {
      const parsed = Number.parseInt(rawLimit, 10);
      if (!Number.isSafeInteger(parsed) || String(parsed) !== rawLimit || parsed < 1 || parsed > 50) {
        throw new BadRequestException('limit must be an integer between 1 and 50.');
      }
      limit = parsed;
    }
    const items = await this.catalog.listPublished(storeSlug, limit);
    return { data: items, meta: { count: items.length, limit } };
  }

  @Get(':storeSlug/products/:productSlug')
  async detail(
    @Param('storeSlug') storeSlug: string,
    @Param('productSlug') productSlug: string,
  ) {
    const item = await this.catalog.getPublished(storeSlug, productSlug);
    if (!item) throw new NotFoundException('Product not found.');
    return { data: item };
  }
}
