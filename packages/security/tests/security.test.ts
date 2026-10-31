import { describe, it, expect } from "vitest";
import { CryptoVault, timingSafeEqualStrings, verifyHmacSha256, isPrivateIp, assertSafeExternalUrl } from "../src/index.js";

describe("CryptoVault & Timing-Safe Security", () => {
  const vault = new CryptoVault("test_master_secret_key_32_bytes_ok");

  it("encrypts and decrypts sensitive PII string using AES-256-GCM", () => {
    const raw = "0012345678"; // Iranian National ID
    const encrypted = vault.encrypt(raw);
    expect(encrypted.startsWith("enc:v1:")).toBe(true);
    expect(encrypted).not.toBe(raw);

    const decrypted = vault.decrypt(encrypted);
    expect(decrypted).toBe(raw);
  });

  it("masks PII correctly", () => {
    expect(vault.maskNationalId("0012345678")).toBe("001****678");
    expect(vault.maskCardNumber("6219861012345678")).toBe("6219-****-****-5678");
    expect(vault.maskPhone("09123456789")).toBe("0912***6789");
  });

  it("verifies HMAC-SHA256 signatures in constant time", () => {
    const data = "amount=1000000&orderId=ord_123";
    const secret = "webhook_secret_key";
    const sig = "a1b2c3"; // invalid
    expect(verifyHmacSha256(data, sig, secret)).toBe(false);

    // Timing-safe strings check
    expect(timingSafeEqualStrings("secret_token_123", "secret_token_123")).toBe(true);
    expect(timingSafeEqualStrings("secret_token_123", "wrong_token_456")).toBe(false);
  });

  it("identifies private, loopback and cloud-metadata IP addresses correctly", () => {
    expect(isPrivateIp("127.0.0.1")).toBe(true);
    expect(isPrivateIp("10.0.0.1")).toBe(true);
    expect(isPrivateIp("192.168.1.1")).toBe(true);
    expect(isPrivateIp("169.254.169.254")).toBe(true);
    expect(isPrivateIp("172.16.0.1")).toBe(true);
    expect(isPrivateIp("172.31.255.255")).toBe(true);
    expect(isPrivateIp("0.0.0.0")).toBe(true);
    expect(isPrivateIp("::1")).toBe(true);
    expect(isPrivateIp("8.8.8.8")).toBe(false);
    expect(isPrivateIp("1.1.1.1")).toBe(false);
  });

  it("rejects SSRF attempts to private networks and AWS metadata", async () => {
    await expect(assertSafeExternalUrl("http://127.0.0.1/admin", { allowLocalhostInDev: false })).rejects.toThrow("SSRF blocked");
    await expect(assertSafeExternalUrl("http://10.0.0.5:8080/data", { allowLocalhostInDev: false })).rejects.toThrow("SSRF blocked");
    await expect(assertSafeExternalUrl("http://192.168.1.50/keys", { allowLocalhostInDev: false })).rejects.toThrow("SSRF blocked");
    await expect(assertSafeExternalUrl("http://169.254.169.254/latest/meta-data/", { allowLocalhostInDev: false })).rejects.toThrow("SSRF blocked");
    await expect(assertSafeExternalUrl("ftp://example.com/file")).rejects.toThrow("only HTTP and HTTPS");
    await expect(assertSafeExternalUrl("http://user:pass@example.com")).rejects.toThrow("embedded credentials");
  });
});
