import { Body, Controller, Delete, Get, Put, Request, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../common/guards/admin.guard';
import { SettingsService } from './settings.service';
import { SaveHomeSectionsDto } from './storefront-settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  // GET /v1/settings/storefront — عمومی (بدون گارد): همگام‌سازی دید سکشن‌های ویترین؛
  // DB-down همیشه ۲۰۰ با source: "DEFAULT" برمی‌گرداند، هرگز ۵۰۰.
  @Get('storefront')
  getStorefront() {
    return this.settings.getStorefrontOverrides();
  }

  // PUT /v1/settings/storefront/home-sections — ذخیره از پنل ادمین (AUTH-003)
  // همگام‌سازی cross-origin: قبلاً این همگام‌سازی بین ادمین و ویترین شکسته بود.
  @Put('storefront/home-sections')
  @UseGuards(AdminGuard)
  saveHomeSections(@Body() body: SaveHomeSectionsDto, @Request() request: { adminUser?: { id: string } }) {
    return this.settings.saveHomeSections(body.overrides, request?.adminUser?.id);
  }

  // DELETE /v1/settings/storefront/home-sections — بازنشانی به پیش‌فرض (حذف سطر)
  @Delete('storefront/home-sections')
  @UseGuards(AdminGuard)
  resetHomeSections() {
    return this.settings.resetHomeSections();
  }
}
