import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../common/guards/admin.guard';
import { CurrentTenant } from '../common/guards/current-tenant.decorator';
import {
  CreateAdminProductDto,
  UpdateAdminProductDto,
  UpdateAdminProductPriceDto,
} from '../common/dto/resource-writes.dto';
import { CatalogService } from './catalog.service';

@Controller('stores')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  // ── Admin Endpoints (Tenant-Isolated, Guarded by AdminGuard) ──
  // هشدار ترتیب مسیرها: این بلاک باید قبل از مسیرهای وایلدکارت (:storeSlug/...)
  // تعریف شود تا Nest کلمه 'admin' را به عنوان storeSlug مپ نکند.
  @Get('admin/products')
  @UseGuards(AdminGuard)
  async adminListProducts(
    @CurrentTenant() tenantId: string,
    @Query('store') storeSlug?: string,
    @Query('limit') limitStr?: string,
  ) {
    const limit = limitStr ? parseInt(limitStr, 10) : 100;
    const items = await this.catalog.adminListProducts(tenantId, storeSlug, limit);
    return { data: items, meta: { count: items.length } };
  }

  @Post('admin/products')
  @UseGuards(AdminGuard)
  async adminCreateProduct(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateAdminProductDto,
    @Query('store') storeSlug?: string,
  ) {
    const item = await this.catalog.adminCreateProduct(tenantId, storeSlug, dto);
    return { data: item };
  }

  @Get('admin/products/:id')
  @UseGuards(AdminGuard)
  async adminGetProduct(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
  ) {
    const item = await this.catalog.adminGetProduct(tenantId, id);
    return { data: item };
  }

  @Patch('admin/products/:id/price')
  @UseGuards(AdminGuard)
  async adminUpdatePrice(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @Body() dto: UpdateAdminProductPriceDto,
  ) {
    return this.catalog.adminUpdatePrice(tenantId, id, dto);
  }

  @Patch('admin/products/:id')
  @UseGuards(AdminGuard)
  async adminUpdateProduct(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @Body() dto: UpdateAdminProductDto,
  ) {
    const item = await this.catalog.adminUpdateProduct(tenantId, id, dto);
    return { data: item };
  }

  @Delete('admin/products/:id')
  @UseGuards(AdminGuard)
  async adminArchiveProduct(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
  ) {
    return this.catalog.adminArchiveProduct(tenantId, id);
  }

  @Get('admin/categories')
  @UseGuards(AdminGuard)
  async adminListCategories(
    @CurrentTenant() tenantId: string,
    @Query('store') storeSlug?: string,
  ) {
    const items = await this.catalog.adminListCategories(tenantId, storeSlug);
    return { data: items };
  }

  @Get('admin/brands')
  @UseGuards(AdminGuard)
  async adminListBrands(
    @CurrentTenant() tenantId: string,
    @Query('store') storeSlug?: string,
  ) {
    const items = await this.catalog.adminListBrands(tenantId, storeSlug);
    return { data: items };
  }

  @Get('admin/concerns')
  @UseGuards(AdminGuard)
  async adminListSkinConcerns(
    @CurrentTenant() tenantId: string,
    @Query('store') storeSlug?: string,
  ) {
    const items = await this.catalog.adminListSkinConcerns(tenantId, storeSlug);
    return { data: items };
  }

  // ── Public Storefront Catalog Endpoints ──

  @Get('resolve')
  async resolve(@Query('slug') slug?: string) {
    return this.catalog.resolveStore(slug ?? '');
  }

  @Get(':storeSlug/categories')
  async listCategories(@Param('storeSlug') storeSlug: string) {
    const categories = await this.catalog.listCategories(storeSlug);
    return { data: categories };
  }

  @Get(':storeSlug/products')
  async list(
    @Param('storeSlug') storeSlug: string,
    @Query('limit') rawLimit?: string,
    @Query('category') categorySlug?: string,
    @Query('cat') catSlug?: string,
    @Query('brand') brandSlug?: string,
    @Query('collection') collection?: string,
  ) {
    let limit = 100;
    if (rawLimit !== undefined) {
      const parsed = Number.parseInt(rawLimit, 10);
      if (!Number.isSafeInteger(parsed) || String(parsed) !== rawLimit || parsed < 1 || parsed > 100) {
        throw new BadRequestException('limit must be an integer between 1 and 100.');
      }
      limit = parsed;
    }
    const targetCategory = categorySlug || catSlug;
    const items = await this.catalog.listPublished(storeSlug, limit, {
      categorySlug: targetCategory,
      brandSlug,
      collection,
    });
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

  @Get(':storeSlug/products/:productSlug/media')
  async getMedia(
    @Param('storeSlug') storeSlug: string,
    @Param('productSlug') productSlug: string,
  ) {
    const media = await this.catalog.getMedia(storeSlug, productSlug);
    return { data: media };
  }

  @Get(':storeSlug/products/:productSlug/ingredients')
  async getIngredients(
    @Param('storeSlug') storeSlug: string,
    @Param('productSlug') productSlug: string,
  ) {
    const ingredients = await this.catalog.getIngredients(storeSlug, productSlug);
    return { data: ingredients };
  }

  @Get(':storeSlug/products/:productSlug/claims')
  async getClaims(
    @Param('storeSlug') storeSlug: string,
    @Param('productSlug') productSlug: string,
  ) {
    const claims = await this.catalog.getClaims(storeSlug, productSlug);
    return { data: claims };
  }

  @Get(':storeSlug/products/:productSlug/usage')
  async getUsageSteps(
    @Param('storeSlug') storeSlug: string,
    @Param('productSlug') productSlug: string,
  ) {
    const steps = await this.catalog.getUsageSteps(storeSlug, productSlug);
    return { data: steps };
  }

  @Get(':storeSlug/brands')
  async listBrands(@Param('storeSlug') storeSlug: string) {
    const brands = await this.catalog.listBrands(storeSlug);
    return { data: brands };
  }

  @Get(':storeSlug/concerns')
  async listSkinConcerns(@Param('storeSlug') storeSlug: string) {
    const concerns = await this.catalog.listSkinConcerns(storeSlug);
    return { data: concerns };
  }
}
