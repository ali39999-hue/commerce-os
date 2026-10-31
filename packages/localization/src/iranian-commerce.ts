/**
 * Iranian Commerce, Banking & Identity Validation Suite.
 * Synthesized from aroux30/site and itrip-platform.
 */

import { toAsciiDigits, toPersianDigits } from "./bidi.js";

export interface ShetabBank {
  bin: string;
  nameFa: string;
  nameEn: string;
  slug: string;
  color: string;
  bgColor: string;
}

export const SHETAB_BANKS: Record<string, Omit<ShetabBank, "bin">> = {
  "603799": { nameFa: "بانک ملی ایران", nameEn: "Bank Melli Iran", slug: "melli", color: "#004B87", bgColor: "#E6F0FA" },
  "610433": { nameFa: "بانک ملت", nameEn: "Bank Mellat", slug: "mellat", color: "#C8102E", bgColor: "#FDE8EB" },
  "621986": { nameFa: "بانک سامان", nameEn: "Saman Bank", slug: "saman", color: "#005696", bgColor: "#E5F1FA" },
  "502229": { nameFa: "بانک پاسارگاد", nameEn: "Pasargad Bank", slug: "pasargad", color: "#D4AF37", bgColor: "#FAF7EE" },
  "627353": { nameFa: "بانک تجارت", nameEn: "Tejarat Bank", slug: "tejarat", color: "#003A70", bgColor: "#E6EFF7" },
  "589210": { nameFa: "بانک سپه", nameEn: "Bank Sepah", slug: "sepah", color: "#D29B00", bgColor: "#FAF5E6" },
  "627412": { nameFa: "بانک اقتصاد نوین", nameEn: "EN Bank", slug: "en", color: "#5F259F", bgColor: "#F0EAF7" },
  "502908": { nameFa: "بانک توسعه تعاون", nameEn: "Tose'e Ta'avon Bank", slug: "tt", color: "#00833E", bgColor: "#E6F5EC" },
  "627760": { nameFa: "پست بانک ایران", nameEn: "Post Bank", slug: "post", color: "#007A3D", bgColor: "#E6F2EB" },
  "589463": { nameFa: "بانک رفاه کارگران", nameEn: "Refah Bank", slug: "refah", color: "#1F4E79", bgColor: "#E8EEF4" },
  "628023": { nameFa: "بانک مسکن", nameEn: "Maskan Bank", slug: "maskan", color: "#FF6600", bgColor: "#FFF0E6" },
  "603770": { nameFa: "بانک کشاورزی", nameEn: "Keshavarzi Bank", slug: "agri", color: "#2E7D32", bgColor: "#E8F5E9" },
  "504706": { nameFa: "بانک شهر", nameEn: "Shahr Bank", slug: "shahr", color: "#D32F2F", bgColor: "#FFEBEE" },
  "639346": { nameFa: "بانک سینا", nameEn: "Sina Bank", slug: "sina", color: "#0288D1", bgColor: "#E1F5FE" },
  "639607": { nameFa: "بانک سرمایه", nameEn: "Sarmayeh Bank", slug: "sarmayeh", color: "#00796B", bgColor: "#E0F2F1" },
  "636214": { nameFa: "بانک آینده", nameEn: "Ayandeh Bank", slug: "ayandeh", color: "#6A1B9A", bgColor: "#F3E5F5" },
  "502938": { nameFa: "بانک دی", nameEn: "Day Bank", slug: "day", color: "#00897B", bgColor: "#E0F2F1" },
  "639599": { nameFa: "بانک قوامین", nameEn: "Ghavamin Bank", slug: "ghavamin", color: "#37474F", bgColor: "#ECEFF1" },
  "606373": { nameFa: "بانک مهر ایران", nameEn: "Mehr Iran Bank", slug: "mehr", color: "#2E7D32", bgColor: "#E8F5E9" },
  "505801": { nameFa: "بانک کوثر", nameEn: "Kosar Bank", slug: "kosar", color: "#1565C0", bgColor: "#E3F2FD" },
};

/**
 * Normalizes Persian text and digits.
 */
export function normalizePersianText(text: string): string {
  if (!text) return "";
  return toAsciiDigits(text)
    .replace(/\u064A/g, "\u06CC") // ي -> ی
    .replace(/\u0643/g, "\u06A9") // ك -> ک
    .replace(/\u0649/g, "\u06CC") // ى -> ی
    .replace(/\u0629/g, "\u0647") // ة -> ه
    .replace(/[\u064B-\u0652\u0670]/g, "") // Diacritics
    .replace(/\u0640/g, "") // remove tatweel / kashida
    .trim();
}

/**
 * Validates Iranian National ID (کد ملی) with Modulo-11 algorithm.
 */
export function validateNationalId(code: string): boolean {
  if (!code) return false;
  const clean = toAsciiDigits(code).replace(/\D/g, "");
  if (clean.length !== 10) return false;

  // Reject all repeated numbers: 0000000000, 1111111111, ..., 9999999999
  if (/^(\d)\1{9}$/.test(clean)) return false;

  const check = parseInt(clean[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean[i], 10) * (10 - i);
  }

  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
}

/**
 * Validates 16-digit Shetab Bank Card using Luhn algorithm.
 */
export function validateShetabCard(cardNumber: string): boolean {
  if (!cardNumber) return false;
  const digits = toAsciiDigits(cardNumber).replace(/\D/g, "");
  if (digits.length !== 16) return false;

  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let d = parseInt(digits[i], 10);
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/**
 * Detects issuing bank by 6-digit BIN.
 */
export function getShetabBank(cardNumber: string): ShetabBank | null {
  if (!cardNumber) return null;
  const clean = toAsciiDigits(cardNumber).replace(/\D/g, "");
  if (clean.length < 6) return null;
  const bin = clean.slice(0, 6);
  const bank = SHETAB_BANKS[bin];
  if (!bank) return null;
  return { ...bank, bin };
}

/**
 * Formats a 16-digit card number in 4-4-4-4 blocks: 6219-8610-1234-5678
 */
export function formatCardNumber(card: string): string {
  if (!card) return "";
  const digits = toAsciiDigits(card).replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1-");
}

/**
 * Validates Iranian Sheba (IBAN): IR + 24 digits with ISO 7064 Modulo 97-10.
 */
export function validateSheba(sheba: string): boolean {
  if (!sheba) return false;
  let clean = toAsciiDigits(sheba).replace(/\s+/g, "").toUpperCase();
  if (!clean.startsWith("IR")) {
    clean = "IR" + clean;
  }
  if (clean.length !== 26) return false;

  // Rearrange: move IR (1827) and two check digits to the end
  const rearranged = clean.slice(4) + "1827" + clean.slice(2, 4);

  // BigInt mod 97 check
  try {
    const num = BigInt(rearranged);
    return num % 97n === 1n;
  } catch {
    return false;
  }
}

/**
 * Validates Iranian 11-digit mobile phone starting with 09.
 */
export function validateIranianMobile(phone: string): boolean {
  if (!phone) return false;
  const clean = toAsciiDigits(phone).replace(/\D/g, "");
  return /^09\d{9}$/.test(clean);
}

/**
 * Validates 10-digit Iranian postal code (no repetitive, no zeros at invalid places).
 */
export function validatePostalCode(postalCode: string): boolean {
  if (!postalCode) return false;
  const clean = toAsciiDigits(postalCode).replace(/\D/g, "");
  if (clean.length !== 10) return false;
  return /^[13-9]{4}[1-9][1-9]{5}$/.test(clean);
}
