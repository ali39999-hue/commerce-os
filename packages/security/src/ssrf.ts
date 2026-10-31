import * as dns from "node:dns/promises";
import * as net from "node:net";

/**
 * Checks if an IP address string falls into private, loopback, link-local,
 * multicast, or cloud-metadata address ranges.
 */
export function isPrivateIp(ip: string): boolean {
  let cleanIp = ip.trim().toLowerCase();
  // Strip IPv6-mapped IPv4 prefix (e.g. ::ffff:127.0.0.1)
  if (cleanIp.startsWith("::ffff:")) {
    cleanIp = cleanIp.slice(7);
  }

  // IPv4 validation & range check
  const v4Parts = cleanIp.split(".").map(Number);
  if (v4Parts.length === 4 && v4Parts.every((p) => !Number.isNaN(p) && p >= 0 && p <= 255)) {
    const [b0, b1] = v4Parts;
    if (b0 === 0) return true; // 0.0.0.0/8 current network
    if (b0 === 10) return true; // 10.0.0.0/8 private network
    if (b0 === 127) return true; // 127.0.0.0/8 loopback
    if (b0 === 169 && b1 === 254) return true; // 169.254.0.0/16 link-local (cloud metadata)
    if (b0 === 172 && b1 >= 16 && b1 <= 31) return true; // 172.16.0.0/12 private network
    if (b0 === 192 && b1 === 168) return true; // 192.168.0.0/16 private network
    if (b0 >= 224) return true; // 224.0.0.0/4 multicast & 240.0.0.0/4 reserved
    return false;
  }

  // IPv6 validation & range check
  if (
    cleanIp === "::1" ||
    cleanIp === "::" ||
    cleanIp === "0:0:0:0:0:0:0:1" ||
    cleanIp === "0:0:0:0:0:0:0:0"
  ) {
    return true; // loopback & unspecified
  }
  // Unique local addresses (fc00::/7 -> fc.. and fd..)
  if (cleanIp.startsWith("fc") || cleanIp.startsWith("fd")) {
    return true;
  }
  // Link-local addresses (fe80::/10)
  if (
    cleanIp.startsWith("fe8") ||
    cleanIp.startsWith("fe9") ||
    cleanIp.startsWith("fea") ||
    cleanIp.startsWith("feb")
  ) {
    return true;
  }

  return false;
}

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "instance-data",
  "metadata.google.internal",
]);

export interface AssertSafeUrlOptions {
  allowLocalhostInDev?: boolean;
}

/**
 * Validates a target URL against SSRF vulnerabilities:
 * 1. Must be a valid URL.
 * 2. Protocol must be http: or https:.
 * 3. Prohibits credentials (username:password) in URL.
 * 4. In production (or when allowLocalhostInDev is false), resolves the hostname via DNS
 *    and verifies that none of the resolved IPs are private/loopback/link-local/cloud-metadata.
 */
export async function assertSafeExternalUrl(
  targetUrl: string,
  options: AssertSafeUrlOptions = {}
): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    throw new Error("Invalid external target URL: failed to parse.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Invalid external target URL: only HTTP and HTTPS protocols are allowed.");
  }

  if (parsed.username || parsed.password) {
    throw new Error("Invalid external target URL: embedded credentials are not permitted.");
  }

  const rawHostname = parsed.hostname.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();

  const isProduction = process.env.NODE_ENV === "production";
  const shouldBlockInternal = isProduction || !options.allowLocalhostInDev;

  // Immediate blocklist check
  if (BLOCKED_HOSTNAMES.has(rawHostname)) {
    if (shouldBlockInternal) {
      throw new Error(`SSRF blocked: target host "${rawHostname}" is restricted.`);
    }
  }

  // Direct IP literal check
  if (net.isIP(rawHostname)) {
    if (isPrivateIp(rawHostname)) {
      if (shouldBlockInternal) {
        throw new Error(`SSRF blocked: target IP "${rawHostname}" is in a private/restricted network range.`);
      }
    }
    return parsed;
  }

  // If in production or when local is disallowed, resolve DNS to prevent DNS rebinding
  if (shouldBlockInternal) {
    try {
      const addresses = await dns.lookup(rawHostname, { all: true });
      for (const addr of addresses) {
        if (isPrivateIp(addr.address)) {
          throw new Error(
            `SSRF blocked: target host "${rawHostname}" resolved to private IP "${addr.address}".`
          );
        }
      }
    } catch (err: any) {
      if (err?.message?.includes("SSRF blocked")) {
        throw err;
      }
      throw new Error(`SSRF validation failed: could not resolve hostname "${rawHostname}".`);
    }
  }

  return parsed;
}
