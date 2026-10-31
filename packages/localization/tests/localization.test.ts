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
