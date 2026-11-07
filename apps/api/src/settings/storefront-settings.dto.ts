import {
  IsObject,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const MIN_OVERRIDE_KEYS = 1;
const MAX_OVERRIDE_KEYS = 50;

@ValidatorConstraint({ name: 'homeSectionOverrides', async: false })
export class HomeSectionOverridesConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, _args: ValidationArguments): boolean {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length < MIN_OVERRIDE_KEYS || entries.length > MAX_OVERRIDE_KEYS) {
      return false;
    }
    return entries.every(([key, flag]) => key.trim().length > 0 && typeof flag === 'boolean');
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'تنظیمات بخش‌های صفحه اصلی نامعتبر است: بین ۱ تا ۵۰ کلید متنی با مقدار بولی الزامی است';
  }
}

/**
 * DTO for the storefront home-section visibility sync. The overrides map is a
 * bounded allowlist of section keys → boolean visibility flags (1..50 keys),
 * validated at runtime because the global whitelist pipe cannot inspect the
 * inside of a plain object.
 */
export class SaveHomeSectionsDto {
  @IsObject()
  @Validate(HomeSectionOverridesConstraint)
  overrides!: Record<string, boolean>;
}
