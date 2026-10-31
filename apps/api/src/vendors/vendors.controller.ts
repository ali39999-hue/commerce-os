import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { VendorsService } from "./vendors.service";

// ── ADR-011: بنیان Marketplace — API عمومی فروشندگان (W18) ──
@Controller("vendors")
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  async list(@Query("storeSlug") storeSlug?: string) {
    return this.vendorsService.listVendors(storeSlug ?? "");
  }

  @Get(":slug")
  async detail(@Param("slug") slug: string, @Query("storeSlug") storeSlug?: string) {
    return this.vendorsService.getVendor(slug, storeSlug);
  }

  @Post()
  async create(
    @Headers("x-tenant-id") tenantId?: string,
    @Body() body?: {
      slug?: string;
      titleFa?: string;
      description?: string;
      logoColor?: string;
      commissionBps?: number;
    }
  ) {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new UnauthorizedException("شناسه مستأجر (x-tenant-id) الزامی است");
    }

    return this.vendorsService.createVendor({
      tenantId: tenantId.trim(),
      slug: body?.slug,
      titleFa: body?.titleFa,
      description: body?.description,
      logoColor: body?.logoColor,
      commissionBps: body?.commissionBps,
    });
  }
}
