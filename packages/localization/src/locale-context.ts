/**
 * Market, Locale, and Internationalization Context Definitions.
 * Aligned with Commerce OS Global Store Roadmap Phase 12.
 */

export type SupportedLocale = "fa-IR" | "en-GB" | "ar-AE";
export type SupportedLanguage = "fa" | "en" | "ar";
export type TextDirection = "rtl" | "ltr";
export type SupportedCurrency = "IRT" | "IRR" | "GBP" | "USD" | "EUR" | "AED";
export type SupportedMarket = "IR" | "GB" | "AE" | "GLOBAL";

export interface LocaleConfig {
  readonly code: SupportedLocale;
  readonly language: SupportedLanguage;
  readonly region: string;
  readonly direction: TextDirection;
  readonly displayName: string;
  readonly nativeName: string;
  readonly defaultCurrency: SupportedCurrency;
  readonly defaultMarket: SupportedMarket;
  readonly calendar: "persian" | "gregorian";
  readonly numberFormatScript: "persian" | "latin" | "arabic";
}

export interface MarketConfig {
  readonly code: SupportedMarket;
  readonly nameEn: string;
  readonly nameFa: string;
  readonly defaultLocale: SupportedLocale;
  readonly supportedLocales: readonly SupportedLocale[];
  readonly baseCurrency: SupportedCurrency;
  readonly supportedCurrencies: readonly SupportedCurrency[];
  readonly taxIncludedInPrice: boolean;
  readonly defaultVatBps: number;
  readonly phoneCountryCode: string;
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  "fa-IR": {
    code: "fa-IR",
    language: "fa",
    region: "IR",
    direction: "rtl",
    displayName: "Persian (Iran)",
    nativeName: "فارسی",
    defaultCurrency: "IRT",
    defaultMarket: "IR",
    calendar: "persian",
    numberFormatScript: "persian",
  },
  "en-GB": {
    code: "en-GB",
    language: "en",
    region: "GB",
    direction: "ltr",
    displayName: "English (United Kingdom)",
    nativeName: "English (UK)",
    defaultCurrency: "GBP",
    defaultMarket: "GB",
    calendar: "gregorian",
    numberFormatScript: "latin",
  },
  "ar-AE": {
    code: "ar-AE",
    language: "ar",
    region: "AE",
    direction: "rtl",
    displayName: "Arabic (United Arab Emirates)",
    nativeName: "العربية",
    defaultCurrency: "AED",
    defaultMarket: "AE",
    calendar: "gregorian",
    numberFormatScript: "arabic",
  },
};

export const SUPPORTED_MARKETS: Record<SupportedMarket, MarketConfig> = {
  IR: {
    code: "IR",
    nameEn: "Iran",
    nameFa: "ایران",
    defaultLocale: "fa-IR",
    supportedLocales: ["fa-IR", "en-GB"],
    baseCurrency: "IRT",
    supportedCurrencies: ["IRT", "IRR", "USD", "EUR", "AED"],
    taxIncludedInPrice: true,
    defaultVatBps: 1000, // 10%
    phoneCountryCode: "+98",
  },
  GB: {
    code: "GB",
    nameEn: "United Kingdom",
    nameFa: "بریتانیا",
    defaultLocale: "en-GB",
    supportedLocales: ["en-GB"],
    baseCurrency: "GBP",
    supportedCurrencies: ["GBP", "EUR", "USD"],
    taxIncludedInPrice: true,
    defaultVatBps: 2000, // 20% UK VAT
    phoneCountryCode: "+44",
  },
  AE: {
    code: "AE",
    nameEn: "United Arab Emirates",
    nameFa: "امارات متحده عربی",
    defaultLocale: "ar-AE",
    supportedLocales: ["ar-AE", "en-GB"],
    baseCurrency: "AED",
    supportedCurrencies: ["AED", "USD", "GBP", "EUR"],
    taxIncludedInPrice: true,
    defaultVatBps: 500, // 5% UAE VAT
    phoneCountryCode: "+971",
  },
  GLOBAL: {
    code: "GLOBAL",
    nameEn: "International",
    nameFa: "بین‌المللی",
    defaultLocale: "en-GB",
    supportedLocales: ["en-GB", "fa-IR", "ar-AE"],
    baseCurrency: "USD",
    supportedCurrencies: ["USD", "EUR", "GBP", "AED", "IRT"],
    taxIncludedInPrice: false,
    defaultVatBps: 0,
    phoneCountryCode: "+1",
  },
};

export const DEFAULT_LOCALE: SupportedLocale = "fa-IR";
export const DEFAULT_MARKET: SupportedMarket = "IR";
export const DEFAULT_CURRENCY: SupportedCurrency = "IRT";

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return Object.prototype.hasOwnProperty.call(SUPPORTED_LOCALES, locale);
}

export function isSupportedMarket(market: string): market is SupportedMarket {
  return Object.prototype.hasOwnProperty.call(SUPPORTED_MARKETS, market.toUpperCase());
}

export function resolveLocale(rawLocale?: string | null): LocaleConfig {
  if (!rawLocale) return SUPPORTED_LOCALES[DEFAULT_LOCALE];
  const normalized = rawLocale.replace("_", "-").trim();
  if (isSupportedLocale(normalized)) {
    return SUPPORTED_LOCALES[normalized];
  }
  const lang = normalized.split("-")[0].toLowerCase();
  if (lang === "fa") return SUPPORTED_LOCALES["fa-IR"];
  if (lang === "ar") return SUPPORTED_LOCALES["ar-AE"];
  if (lang === "en") return SUPPORTED_LOCALES["en-GB"];
  return SUPPORTED_LOCALES[DEFAULT_LOCALE];
}

export function resolveMarket(rawMarket?: string | null): MarketConfig {
  if (!rawMarket) return SUPPORTED_MARKETS[DEFAULT_MARKET];
  const upper = rawMarket.trim().toUpperCase();
  if (isSupportedMarket(upper)) {
    return SUPPORTED_MARKETS[upper];
  }
  return SUPPORTED_MARKETS[DEFAULT_MARKET];
}

export function getLocaleDirection(locale: string): TextDirection {
  return resolveLocale(locale).direction;
}

export function isRtlLocale(locale: string): boolean {
  return getLocaleDirection(locale) === "rtl";
}
