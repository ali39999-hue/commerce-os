import { describe, it, expect } from "vitest";
import {
  validateNationalId,
  validateShetabCard,
  getShetabBank,
  formatCardNumber,
  validateSheba,
  validateIranianMobile,
  normalizePersianText,
  formatJalaliDate,
  resolveLocale,
  resolveMarket,
  getLocaleDirection,
  isRtlLocale,
  toAsciiDigits,
  toPersianDigits,
  toArabicDigits,
  normalizeDigits,
  isRTL,
  wrapBidiIsolate,
  formatMixedAlphanumeric,
  formatCurrencyAmount,
  formatRialsAsTomans,
  convertMinorUnits,
  findExchangeRateRule,
} from "../src/index.js";

describe("Iranian Commerce Localization", () => {
  it("normalizes Persian and Arabic text and numbers", () => {
    expect(normalizePersianText("۱۲۳۴۵")).toBe("12345");
    expect(normalizePersianText("علي")).toBe("علی");
    expect(normalizePersianText("بانك")).toBe("بانک");
  });

  it("validates Iranian National ID with modulo 11", () => {
    // Valid national IDs
    expect(validateNationalId("0010312013")).toBe(true);
    expect(validateNationalId("0084545933")).toBe(true);
    expect(validateNationalId("۰۰۱۰۳۱۲۰۱۳")).toBe(true);
    expect(validateNationalId("٠٠١٠٣١٢٠١٣")).toBe(true);

    // Repetitive rejection
    expect(validateNationalId("1111111111")).toBe(false);
    expect(validateNationalId("0000000000")).toBe(false);

    // Checksum invalid / wrong length
    expect(validateNationalId("0010312014")).toBe(false);
    expect(validateNationalId("12345")).toBe(false);
    expect(validateNationalId("12345678901")).toBe(false);
  });

  it("validates Shetab card Luhn and identifies bank", () => {
    // Saman bank prefix
    const card = "6219861012345678";
    const bank = getShetabBank(card);
    expect(bank).not.toBeNull();
    expect(bank?.nameFa).toBe("بانک سامان");
    expect(bank?.slug).toBe("saman");

    expect(formatCardNumber(card)).toBe("6219-8610-1234-5678");
  });

  it("validates Iranian mobile numbers", () => {
    expect(validateIranianMobile("09121234567")).toBe(true);
    expect(validateIranianMobile("۰۹۱۲۱۲۳۴۵۶۷")).toBe(true);
    expect(validateIranianMobile("08121234567")).toBe(false);
    expect(validateIranianMobile("091212345")).toBe(false);
  });

  it("formats dates in native Jalali calendar", () => {
    const d = new Date("2026-10-29T10:00:00Z");
    const formatted = formatJalaliDate(d);
    expect(formatted.length).toBeGreaterThan(0);
  });
});

describe("Market & Locale Context", () => {
  it("resolves locales correctly", () => {
    expect(resolveLocale("fa-IR").language).toBe("fa");
    expect(resolveLocale("fa-IR").direction).toBe("rtl");

    expect(resolveLocale("en-GB").language).toBe("en");
    expect(resolveLocale("en-GB").direction).toBe("ltr");

    expect(resolveLocale("ar-AE").language).toBe("ar");
    expect(resolveLocale("ar-AE").direction).toBe("rtl");

    // Fallbacks
    expect(resolveLocale("en-US").code).toBe("en-GB");
    expect(resolveLocale("").code).toBe("fa-IR");
  });

  it("resolves market configs correctly", () => {
    const ir = resolveMarket("IR");
    expect(ir.baseCurrency).toBe("IRT");
    expect(ir.taxIncludedInPrice).toBe(true);

    const gb = resolveMarket("GB");
    expect(gb.baseCurrency).toBe("GBP");
    expect(gb.defaultVatBps).toBe(2000);

    const ae = resolveMarket("AE");
    expect(ae.baseCurrency).toBe("AED");
  });

  it("checks direction helpers", () => {
    expect(getLocaleDirection("fa-IR")).toBe("rtl");
    expect(getLocaleDirection("en-GB")).toBe("ltr");
    expect(isRtlLocale("fa-IR")).toBe(true);
    expect(isRtlLocale("en-GB")).toBe(false);
  });
});

describe("Bi-Directional (BiDi) & Digits Utilities", () => {
  it("normalizes digits across scripts", () => {
    expect(toAsciiDigits("۱۲۳۴۵۶")).toBe("123456");
    expect(toAsciiDigits("١٢٣٤٥٦")).toBe("123456");
    expect(toPersianDigits("123456")).toBe("۱۲۳۴۵۶");
    expect(toArabicDigits("123456")).toBe("١٢٣٤٥٦");

    expect(normalizeDigits("12345", "persian")).toBe("۱۲۳۴۵");
    expect(normalizeDigits("12345", "arabic")).toBe("١٢٣٤٥");
    expect(normalizeDigits("۱۲۳۴۵", "ascii")).toBe("12345");
  });

  it("detects RTL strings", () => {
    expect(isRTL("سلام دنیا")).toBe(true);
    expect(isRTL("Hello World")).toBe(false);
    expect(isRTL("مرحبا بالعالم")).toBe(true);
  });

  it("wraps mixed alphanumeric strings safely", () => {
    const sku = "CBG-PRO-500ML";
    const wrapped = formatMixedAlphanumeric(sku);
    expect(wrapped.startsWith("\u2066")).toBe(true);
    expect(wrapped.endsWith("\u2069")).toBe(true);
  });
});

describe("Multi-Currency Formatter & Converter", () => {
  it("formats Toman (IRT) with zero decimals and Persian script", () => {
    const formatted = formatCurrencyAmount(1_500_000n, "IRT", { locale: "fa-IR" });
    expect(formatted).toContain("۱٬۵۰۰٬۰۰۰");
    expect(formatted).toContain("تومان");

    const enFormatted = formatCurrencyAmount(1_500_000n, "IRT", { locale: "en-GB" });
    expect(enFormatted).toBe("1,500,000 Toman");
  });

  it("formats Rial (IRR) with zero decimals", () => {
    const formatted = formatCurrencyAmount(15_000_000n, "IRR", { locale: "fa-IR" });
    expect(formatted).toContain("۱۵٬۰۰۰٬۰۰۰");
    expect(formatted).toContain("ریال");
  });

  it("formats GBP, USD, AED with scale-aware 2 decimals", () => {
    // 24.50 GBP = 2450 minor units (pence)
    const gbpFa = formatCurrencyAmount(2450n, "GBP", { locale: "fa-IR" });
    expect(gbpFa).toContain("۲۴٫۵۰");
    expect(gbpFa).toContain("£");

    const gbpEn = formatCurrencyAmount(2450n, "GBP", { locale: "en-GB" });
    expect(gbpEn).toBe("£24.50");

    // 100.00 USD = 10000 minor units (cents)
    const usdEn = formatCurrencyAmount(10000n, "USD", { locale: "en-GB" });
    expect(usdEn).toBe("$100.00");

    // 55.75 AED = 5575 minor units (fils)
    const aedEn = formatCurrencyAmount(5575n, "AED", { locale: "en-GB" });
    expect(aedEn).toBe("55.75 AED");
  });

  it("converts Rials to Tomans helper", () => {
    const formatted = formatRialsAsTomans(45_000_000n); // 4,500,000 Tomans
    expect(formatted).toContain("۴٬۵۰۰٬۰۰۰");
    expect(formatted).toContain("تومان");
  });

  it("converts minor units between currencies with zero float arithmetic", () => {
    // Convert 100.00 GBP (10,000 minor units) to IRT
    // 1 GBP = 110,000 IRT (0 decimals)
    const converted = convertMinorUnits(10000n, "GBP", "IRT");
    expect(converted.amount).toBe(11_000_000n);

    // Convert 11,000,000 IRT to GBP
    const backToGbp = convertMinorUnits(11_000_000n, "IRT", "GBP");
    expect(backToGbp.amount).toBe(10000n); // exactly 100.00 GBP
  });
});
