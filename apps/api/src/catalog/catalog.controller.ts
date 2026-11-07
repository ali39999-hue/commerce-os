import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../common/guards/admin.guard';
import { BulkUpdateProductsDto, CreateProductDto, UpdateProductDto } from '../common/dto/resource-writes.dto';
import { CatalogService } from './catalog.service';

@Controller('stores')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  // ── Admin Endpoints (Tenant-Isolated) ──
  // هشدار ترتیب مسیرها: این بلاک باید «قبل از» مسیرهای وایلدکارت عمومی
  // (:storeSlug/products …) تعریف شود — در غیر این صورت Nextجِی‌اس (Nest)
  // «admin» را به‌عنوان :storeSlug تفسیر می‌کند و مسیرهای ادمین هرگز به
  // هندلر خودشان نمی‌رسند (پاسخ: fallback داده نمونه به‌صورت بی‌صدا).
  @Get('admin/products')
  async adminListProducts(
    @Headers('x-tenant-id') tenantId?: string,
    @Query('store') storeSlug?: string,
    @Query('limit') limitStr?: string,
  ) {
    const tenant = this.requireTenant(tenantId);
    const limit = limitStr ? parseInt(limitStr, 10) : 50;
    const items = await this.catalog.adminListProducts(tenant, storeSlug, limit);
    return { data: items, meta: { count: items.length } };
  }

  @Post('admin/products/bulk-update')
  @UseGuards(AdminGuard)
  async adminBulkUpdateProducts(
    @Body() body: BulkUpdateProductsDto,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    const tenant = this.requireTenant(tenantId);
    const result = await this.catalog.adminBulkUpdateProducts(tenant, body as BulkUpdateProductsDto);
    return { data: result };
  }

  @Post('admin/products')
  @UseGuards(AdminGuard)
  async adminCreateProduct(
    @Body() body: CreateProductDto,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    const tenant = this.requireTenant(tenantId);
    const item = await this.catalog.adminCreateProduct(tenant, body as CreateProductDto);
    return { data: item };
  }

  @Get('admin/products/:id')
  async adminGetProduct(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    const tenant = this.requireTenant(tenantId);
    const item = await this.catalog.adminGetProduct(tenant, id);
    return { data: item };
  }

  @Patch('admin/products/:id')
  @UseGuards(AdminGuard)
  async adminUpdateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    const tenant = this.requireTenant(tenantId);
    const item = await this.catalog.adminUpdateProduct(tenant, id, body as UpdateProductDto);
    return { data: item };
  }

  @Get('admin/brands')
  async adminListBrands(
    @Headers('x-tenant-id') tenantId?: string,
    @Query('store') storeSlug?: string,
  ) {
    const tenant = this.requireTenant(tenantId);
    const items = await this.catalog.adminListBrands(tenant, storeSlug);
    return { data: items };
  }

  @Get('admin/concerns')
  async adminListSkinConcerns(
    @Headers('x-tenant-id') tenantId?: string,
    @Query('store') storeSlug?: string,
  ) {
    const tenant = this.requireTenant(tenantId);
    const items = await this.catalog.adminListSkinConcerns(tenant, storeSlug);
    return { data: items };
  }

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

  private requireTenant(tenantId?: string): string {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new UnauthorizedException('شناسه مستأجر (x-tenant-id) الزامی است');
    }
    return tenantId.trim();
  }
}
