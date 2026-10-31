/**
 * PII Sanitization for Observability & Log Streams (§۷.۱, Threat Model T-09 / T-14).
 *
 * Automatically masks:
 *  - Bank Card Numbers (16 digits): keeps first 4 and last 4, e.g. "6219-****-****-5678"
 *  - Iranian Phone Numbers (09xx, +989xx, 00989xx): keeps prefix and last 4, e.g. "0912***6789"
 *  - Iranian National IDs (10 digits): keeps first 3 and last 3, e.g. "001****678"
 */

const SENSITIVE_KEY_PATTERN =
  /^(password|secret|token|auth|authorization|cookie|session|apikey|apiKey|pan|cvv|cvv2|cardnumber|card_number|nationalid|national_id|nationalcode|national_code)$/i;

/**
 * Mask PII patterns in any arbitrary string (URLs, query parameters, error messages, stack traces).
 */
export function maskPii(input: string): string {
  if (typeof input !== "string" || input.length === 0) return input;

  let str = input;

  // 1. Bank Card Numbers: 16 digits, with optional spaces or hyphens
  str = str.replace(
    /\b(\d{4})[- ]?(\d{4})[- ]?(\d{4})[- ]?(\d{4})\b/g,
    "$1-****-****-$4",
  );

  // 2. Mobile Phone Numbers: 09xx xxx xxxx, +989xx xxx xxxx, 00989xx xxx xxxx
  str = str.replace(
    /(?:(\+98|0098)|0)(9\d{2})[- ]?(\d{3})[- ]?(\d{4})\b/g,
    (_match, intl, p1, _p2, p3) => {
      const prefix = intl ? intl : "0";
      return `${prefix}${p1}***${p3}`;
    },
  );

  // 3. National IDs: 10 digits standing as a standalone token (not part of dates or UUIDs)
  str = str.replace(
    /(?<![\w\-\.])\b(\d{3})(\d{4})(\d{3})\b(?![\w\-\.])/g,
    "$1****$3",
  );

  return str;
}

/**
 * Deep-traverse an object or array and sanitize all strings and sensitive key names.
 */
export function sanitizeLogObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    return maskPii(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeLogObject(item)) as unknown as T;
  }

  if (typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        sanitized[key] = "[REDACTED]";
      } else {
        sanitized[key] = sanitizeLogObject(val);
      }
    }
    return sanitized as T;
  }

  return obj;
}
