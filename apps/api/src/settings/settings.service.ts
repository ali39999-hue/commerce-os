import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export type SettingsSource = 'DB' | 'DEFAULT';

export interface StorefrontOverridesResponse {
  overrides: Record<string, boolean>;
  source: SettingsSource;
}

export interface SaveHomeSectionsResult {
  saved: true;
  overrides: Record<string, boolean>;
}

// تنظیمات ویترین single-row است: هر کلید یک سطر؛ این کلید همیشه همین یکی است
export const HOME_SECTIONS_KEY = 'home_sections';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── خواندن عمومی: همیشه ۲۰۰؛ DB-down → پیش‌فرض (تاب‌آوری، هرگز ۵۰۰ نمی‌دهد) ──
  async getStorefrontOverrides(): Promise<StorefrontOverridesResponse> {
    try {
      const row = await this.prisma.storefrontSetting.findUnique({
        where: { key: HOME_SECTIONS_KEY },
      });
      const overrides = extractOverrides(row?.payload);
      if (overrides) {
        return { overrides, source: 'DB' };
      }
    } catch {
      // DB-down → پاسخ پیش‌فرض تا رندر ویترین هرگز نشکند
    }
    return { overrides: {}, source: 'DEFAULT' };
  }

  // ── ذخیره: upsert با ادغام روی سطر موجود (کلیدهای جدید بر قبلی اولویت دارند) ──
  // DB-down → ۵۰۳ صادقانه: وضعیت دید سکشن‌ها «قبول ساختگی» نمی‌شود.
  async saveHomeSections(
    overrides: Record<string, boolean>,
    updatedBy?: string,
  ): Promise<SaveHomeSectionsResult> {
    try {
      const existing = await this.prisma.storefrontSetting.findUnique({
        where: { key: HOME_SECTIONS_KEY },
      });
      const merged = { ...extractOverrides(existing?.payload), ...overrides };
      const payload = { overrides: merged };

      await this.prisma.storefrontSetting.upsert({
        where: { key: HOME_SECTIONS_KEY },
        update: { payload, updatedBy: updatedBy ?? null },
        create: { key: HOME_SECTIONS_KEY, payload, updatedBy: updatedBy ?? null },
      });

      return { saved: true, overrides: merged };
    } catch {
      throw new ServiceUnavailableException(
        'ذخیره تنظیمات ویترین موقتاً در دسترس نیست — لطفاً بعداً تلاش کنید',
      );
    }
  }

  // ── بازنشانی: حذف سطر → ویترین به پیش‌فرض برمی‌گردد (idempotent) ──
  async resetHomeSections(): Promise<SaveHomeSectionsResult> {
    try {
      await this.prisma.storefrontSetting.deleteMany({ where: { key: HOME_SECTIONS_KEY } });
      return { saved: true, overrides: {} };
    } catch {
      throw new ServiceUnavailableException(
        'بازنشانی تنظیمات ویترین موقتاً در دسترس نیست — لطفاً بعداً تلاش کنید',
      );
    }
  }
}

// payload همیشه { overrides: Record<string, boolean> } است؛ خروجی نامعتبر → null (پیش‌فرض)
function extractOverrides(payload: unknown): Record<string, boolean> | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }
  const overrides = (payload as { overrides?: unknown }).overrides;
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
    return null;
  }
  const entries = Object.entries(overrides as Record<string, unknown>);
  if (!entries.every(([, flag]) => typeof flag === 'boolean')) {
    return null;
  }
  return overrides as Record<string, boolean>;
}
