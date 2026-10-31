import * as crypto from "node:crypto";

/**
 * Constant-time string comparison preventing timing attacks.
 * Pre-hashes inputs with SHA-256 to ensure identical buffer lengths and prevent length leaks.
 */
export function timingSafeEqualStrings(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Compute HMAC-SHA256 signature over data using a secret.
 */
export function computeHmacSha256(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

/**
 * Verify HMAC-SHA256 signature in constant time.
 */
export function verifyHmacSha256(data: string, signature: string, secret: string): boolean {
  const expected = computeHmacSha256(data, secret);
  return timingSafeEqualStrings(signature, expected);
}
