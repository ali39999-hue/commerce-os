/**
 * Zero-Float Multi-Currency Formatter and Converter for Commerce OS.
 * Formats Toman (IRT), Rial (IRR), GBP, USD, EUR, and AED strictly from integer minor units.
 */

import {
  CurrencyScale,
  CURRENCY_SCALES,
  getCurrencyScale,
  SupportedCurrencyCode,
} from "@commerce-os/domain";
export { getCurrencyScale, CURRENCY_SCALES, type CurrencyScale, type SupportedCurrencyCode };
import { SupportedLocale, resolveLocale } from "./locale-context.js";
import { toPersianDigits, toArabicDigits, toAsciiDigits } from "./bidi.js";

export interface CurrencyFormatOptions {
  locale?: string;
  currency?: string;
  showSymbol?: boolean;
  useGrouping?: boolean;
  digitScript?: "persian" | "arabic" | "latin" | "auto";
  /**
   * When true for IRT/IRR, displays "تومان" or "ریال" textually.
   */
  formalUnitName?: boolean;
}

/**
 * Standard integer exchange rates between supported currencies.
 * Uses rational numbers (numerator / denominator) on major units.
 * Rates can be overridden by runtime market configuration.
 */
export interface StandardExchangeRateRule {
  readonly fromCurrency: string;
  readonly toCurrency: string;
  readonly rateNumerator: bigint;
  readonly rateDenominator: bigint;
  readonly source: string;
}

export const BASELINE_EXCHANGE_RATES: readonly StandardExchangeRateRule[] = [
  // 1 IRT = 10 IRR
  { fromCurrency: "IRT", toCurrency: "IRR", rateNumerator: 10n, rateDenominator: 1n, source: "national_peg" },
  // 10 IRR = 1 IRT
  { fromCurrency: "IRR", toCurrency: "IRT", rateNumerator: 1n, rateDenominator: 10n, source: "national_peg" },
  // Dr Dermer UK standard baseline rates (indicative reference for storefront)
  // 1 GBP = 110,000 IRT = 1,100,000 IRR
  { fromCurrency: "GBP", toCurrency: "IRT", rateNumerator: 110_000n, rateDenominator: 1n, source: "uk_hq_indicative" },
  { fromCurrency: "IRT", toCurrency: "GBP", rateNumerator: 1n, rateDenominator: 110_000n, source: "uk_hq_indicative" },
  // 1 USD = 88,000 IRT
  { fromCurrency: "USD", toCurrency: "IRT", rateNumerator: 88_000n, rateDenominator: 1n, source: "market_indicative" },
  { fromCurrency: "IRT", toCurrency: "USD", rateNumerator: 1n, rateDenominator: 88_000n, source: "market_indicative" },
  // 1 EUR = 95,000 IRT
  { fromCurrency: "EUR", toCurrency: "IRT", rateNumerator: 95_000n, rateDenominator: 1n, source: "market_indicative" },
  { fromCurrency: "IRT", toCurrency: "EUR", rateNumerator: 1n, rateDenominator: 95_000n, source: "market_indicative" },
  // 1 AED = 24,000 IRT
  { fromCurrency: "AED", toCurrency: "IRT", rateNumerator: 24_000n, rateDenominator: 1n, source: "market_indicative" },
  { fromCurrency: "IRT", toCurrency: "AED", rateNumerator: 1n, rateDenominator: 24_000n, source: "market_indicative" },
  // Cross rates: 1 GBP = 1.25 USD
  { fromCurrency: "GBP", toCurrency: "USD", rateNumerator: 125n, rateDenominator: 100n, source: "forex_indicative" },
  { fromCurrency: "USD", toCurrency: "GBP", rateNumerator: 100n, rateDenominator: 125n, source: "forex_indicative" },
  // 1 GBP = 4.58 AED
  { fromCurrency: "GBP", toCurrency: "AED", rateNumerator: 458n, rateDenominator: 100n, source: "forex_indicative" },
  // 1 USD = 3.67 AED
  { fromCurrency: "USD", toCurrency: "AED", rateNumerator: 367n, rateDenominator: 100n, source: "uae_peg" },
  { fromCurrency: "AED", toCurrency: "USD", rateNumerator: 100n, rateDenominator: 367n, source: "uae_peg" },
];

/**
 * Finds an exchange rate rule between two currencies.
 */
export function findExchangeRateRule(
  fromCurrency: string,
  toCurrency: string,
  customRates?: readonly StandardExchangeRateRule[]
): StandardExchangeRateRule | null {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();
  if (from === to) {
    return { fromCurrency: from, toCurrency: to, rateNumerator: 1n, rateDenominator: 1n, source: "identity" };
  }
  const pool = customRates ?? BASELINE_EXCHANGE_RATES;
  const direct = pool.find((r) => r.fromCurrency.toUpperCase() === from && r.toCurrency.toUpperCase() === to);
  if (direct) return direct;

  // Try via IRT as pivot currency if neither is IRT
  if (from !== "IRT" && to !== "IRT") {
    const toIrt = pool.find((r) => r.fromCurrency.toUpperCase() === from && r.toCurrency.toUpperCase() === "IRT");
    const fromIrt = pool.find((r) => r.fromCurrency.toUpperCase() === "IRT" && r.toCurrency.toUpperCase() === to);
    if (toIrt && fromIrt) {
      return {
        fromCurrency: from,
        toCurrency: to,
        rateNumerator: toIrt.rateNumerator * fromIrt.rateNumerator,
        rateDenominator: toIrt.rateDenominator * fromIrt.rateDenominator,
        source: `pivot_irt(${toIrt.source}+${fromIrt.source})`,
      };
    }
  }

  return null;
}

/**
 * Converts minor units from one currency to another using integer-safe rational numbers.
 * Zero floating-point arithmetic.
 */
export function convertMinorUnits(
  minorUnits: bigint | number | string,
  fromCurrency: string,
  toCurrency: string,
  rates?: readonly StandardExchangeRateRule[]
): { amount: bigint; rateApplied: StandardExchangeRateRule } {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();
  const rawInput = typeof minorUnits === "bigint" ? minorUnits : BigInt(toAsciiDigits(String(minorUnits)).replace(/\..*$/, "") || "0");

  if (from === to) {
    const rule: StandardExchangeRateRule = {
      fromCurrency: from,
      toCurrency: to,
      rateNumerator: 1n,
      rateDenominator: 1n,
      source: "identity",
    };
    return { amount: rawInput, rateApplied: rule };
  }

  const rule = findExchangeRateRule(from, to, rates);
  if (!rule) {
    throw new Error(`No exchange rate found to convert ${from} to ${to}`);
  }

  const fromScale = getCurrencyScale(from);
  const toScale = getCurrencyScale(to);

  const isNeg = rawInput < 0n;
  const absInput = isNeg ? -rawInput : rawInput;

  // Major-units conversion with minor factors:
  // targetMinor = (absInput * rateNumerator * toScale.minorUnitFactor + halfDenom) / (rateDenominator * fromScale.minorUnitFactor)
  const numerator = absInput * rule.rateNumerator * toScale.minorUnitFactor;
  const denominator = rule.rateDenominator * fromScale.minorUnitFactor;
  const halfDenom = denominator / 2n;

  const convertedAbs = (numerator + halfDenom) / denominator;
  const finalAmount = isNeg ? -convertedAbs : convertedAbs;

  return {
    amount: finalAmount,
    rateApplied: rule,
  };
}

/**
 * Formats an integer minor-units monetary amount for display according to locale and currency.
 * Never uses float representation.
 */
export function formatCurrencyAmount(
  minorUnits: bigint | number | string,
  currencyCode = "IRT",
  options: CurrencyFormatOptions = {}
): string {
  const currency = currencyCode.toUpperCase();
  const scale = getCurrencyScale(currency);
  const localeConf = resolveLocale(options.locale);
  const showSymbol = options.showSymbol ?? true;
  const useGrouping = options.useGrouping ?? true;

  const raw = typeof minorUnits === "bigint" ? minorUnits : BigInt(toAsciiDigits(String(minorUnits)).replace(/\..*$/, "") || "0");
  const isNeg = raw < 0n;
  const absAmount = isNeg ? -raw : raw;

  // Determine major and minor integer parts
  const whole = absAmount / scale.minorUnitFactor;
  const frac = absAmount % scale.minorUnitFactor;

  // Format whole part with thousands separators
  const wholeStr = whole.toString();
  const groupedWhole = useGrouping
    ? wholeStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : wholeStr;

  let numberStr: string;
  if (scale.decimals > 0) {
    const fracStr = frac.toString().padStart(scale.decimals, "0");
    numberStr = `${groupedWhole}.${fracStr}`;
  } else {
    numberStr = groupedWhole;
  }

  // Script selection
  const script = options.digitScript === "auto" || !options.digitScript
    ? localeConf.numberFormatScript
    : options.digitScript;

  if (script === "persian") {
    numberStr = toPersianDigits(numberStr.replace(/,/g, "٬").replace(/\./g, "٫"));
  } else if (script === "arabic") {
    numberStr = toArabicDigits(numberStr.replace(/,/g, "٬").replace(/\./g, "٫"));
  }

  const sign = isNeg ? "-" : "";

  if (!showSymbol) {
    return `${sign}${numberStr}`;
  }

  // Currency presentation by convention:
  // Toman (IRT)
  if (currency === "IRT") {
    if (localeConf.language === "en") {
      return `${sign}${numberStr} Toman`;
    }
    if (localeConf.language === "ar") {
      return `${sign}${numberStr} تومان`;
    }
    return `${sign}${numberStr} تومان`;
  }

  // Rial (IRR)
  if (currency === "IRR") {
    if (localeConf.language === "en") {
      return `${sign}${numberStr} IRR`;
    }
    return `${sign}${numberStr} ریال`;
  }

  // GBP (Dr Dermer standard)
  if (currency === "GBP") {
    if (localeConf.language === "fa") {
      return `${sign}£ ${numberStr} پوند`;
    }
    if (localeConf.language === "ar") {
      return `${sign}£ ${numberStr}`;
    }
    return `${sign}£${numberStr}`;
  }

  // USD
  if (currency === "USD") {
    if (localeConf.language === "fa") {
      return `${sign}$ ${numberStr} دلار`;
    }
    if (localeConf.language === "ar") {
      return `${sign}$ ${numberStr}`;
    }
    return `${sign}$${numberStr}`;
  }

  // EUR
  if (currency === "EUR") {
    if (localeConf.language === "fa") {
      return `${sign}€ ${numberStr} یورو`;
    }
    return `${sign}€${numberStr}`;
  }

  // AED
  if (currency === "AED") {
    if (localeConf.language === "fa") {
      return `${sign}${numberStr} درهم امارات`;
    }
    if (localeConf.language === "ar") {
      return `${sign}${numberStr} د.إ`;
    }
    return `${sign}${numberStr} AED`;
  }

  return `${sign}${numberStr} ${scale.symbol}`;
}

/**
 * Convenient helper to format Iranian Rials to Tomans with standard Persian typography.
 */
export function formatRialsAsTomans(
  rials: bigint | number | string,
  locale = "fa-IR"
): string {
  const r = typeof rials === "bigint" ? rials : BigInt(toAsciiDigits(String(rials)).replace(/\..*$/, "") || "0");
  const tomans = r / 10n;
  return formatCurrencyAmount(tomans, "IRT", { locale });
}
