/**
 * Bi-Directional (BiDi) Text & Script Utilities.
 * Handles mixed alphanumeric identifiers (SKUs, phone numbers, postal codes, cards)
 * and bidirectional isolation markers (LRM, RLM, FSI, PDI) to prevent visual scrambling.
 */

import { TextDirection } from "./locale-context.js";

// Unicode BiDi control characters
export const UNICODE_BIDI = {
  LRM: "\u200E", // Left-to-Right Mark
  RLM: "\u200F", // Right-to-Left Mark
  LRE: "\u202A", // Left-to-Right Embedding
  RLE: "\u202B", // Right-to-Left Embedding
  PDF: "\u202C", // Pop Directional Formatting
  LRO: "\u202D", // Left-to-Right Override
  RLO: "\u202E", // Right-to-Left Override
  LRI: "\u2066", // Left-to-Right Isolate
  RLI: "\u2067", // Right-to-Left Isolate
  FSI: "\u2068", // First Strong Isolate
  PDI: "\u2069", // Pop Directional Isolate
} as const;

/**
 * Normalizes Eastern Arabic (٠-٩) and Persian (۰-۹) digits to ASCII standard (0-9).
 */
export function toAsciiDigits(input: string | number | bigint): string {
  if (input === null || input === undefined) return "";
  const str = String(input);
  return str
    .replace(/[۰-۹]/g, (char) => String(char.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (char) => String(char.charCodeAt(0) - 1632));
}

/**
 * Converts standard ASCII digits to Persian digits (۰-۹).
 * Unicode offset: '0' (48) + 1728 = 1776 ('۰')
 */
export function toPersianDigits(input: string | number | bigint): string {
  if (input === null || input === undefined) return "";
  const ascii = toAsciiDigits(input);
  return ascii.replace(/[0-9]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 1728));
}

/**
 * Converts standard ASCII digits to Arabic-Indic digits (٠-٩).
 * Unicode offset: '0' (48) + 1584 = 1632 ('٠')
 */
export function toArabicDigits(input: string | number | bigint): string {
  if (input === null || input === undefined) return "";
  const ascii = toAsciiDigits(input);
  return ascii.replace(/[0-9]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 1584));
}

export type DigitsScript = "ascii" | "latin" | "persian" | "arabic";

/**
 * Normalizes any number or string with digits into the requested script.
 */
export function normalizeDigits(input: string | number | bigint, script: DigitsScript = "ascii"): string {
  if (script === "persian") {
    return toPersianDigits(input);
  }
  if (script === "arabic") {
    return toArabicDigits(input);
  }
  return toAsciiDigits(input);
}

/**
 * Detects whether a string is predominantly Right-to-Left (Persian, Arabic, Hebrew).
 */
export function isRTL(text: string): boolean {
  if (!text) return false;
  // Arabic & Persian unicode blocks: 0600-06FF, 0750-077F, 08A0-08FF, FB50-FDFF, FE70-FEFF
  const rtlChars = text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g);
  const ltrChars = text.match(/[A-Za-z]/g);
  const rtlCount = rtlChars ? rtlChars.length : 0;
  const ltrCount = ltrChars ? ltrChars.length : 0;
  return rtlCount >= ltrCount && rtlCount > 0;
}

/**
 * Returns text direction ('rtl' or 'ltr') for a given text snippet.
 */
export function detectTextDirection(text: string): TextDirection {
  return isRTL(text) ? "rtl" : "ltr";
}

/**
 * Wraps text with directional isolate marks (LRI/RLI + PDI) to safeguard
 * against text spill or visual corruption in mixed bidi paragraphs.
 */
export function wrapBidiIsolate(text: string, direction: TextDirection = "ltr"): string {
  if (!text) return "";
  const start = direction === "ltr" ? UNICODE_BIDI.LRI : UNICODE_BIDI.RLI;
  return `${start}${text}${UNICODE_BIDI.PDI}`;
}

/**
 * Formats mixed alphanumeric strings (e.g. SKUs like "CBG-PRO-500ML", phone "+98 912 000 0000",
 * IBANs, batch codes) so that punctuation and hyphens do not flip in RTL contexts.
 */
export function formatMixedAlphanumeric(text: string, forceLtr = true): string {
  if (!text) return "";
  const cleaned = text.trim();
  if (forceLtr) {
    // Wrap in Left-to-Right Isolate or LRM to anchor punctuation
    return `${UNICODE_BIDI.LRI}${cleaned}${UNICODE_BIDI.PDI}`;
  }
  return cleaned;
}

/**
 * Returns CSS logical text alignment properties given a direction.
 */
export function getLogicalAlignment(direction: TextDirection) {
  return {
    textAlign: direction === "rtl" ? "right" : "left",
    direction,
    isRtl: direction === "rtl",
  };
}
