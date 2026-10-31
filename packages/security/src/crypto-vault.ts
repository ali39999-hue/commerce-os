import * as crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM
const PREFIX = "enc:v1:";

export class CryptoVault {
  private readonly key: Buffer;

  constructor(masterKeyHex?: string) {
    const rawKey = masterKeyHex || process.env.ENCRYPTION_KEY || process.env.AUTH_SECRET || "default_test_secret_key_32_bytes_len!";
    this.key = crypto.createHash("sha256").update(rawKey).digest();
  }

  encrypt(plaintext: string): string {
    if (!plaintext) return "";
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return `${PREFIX}${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
  }

  decrypt(ciphertext: string): string {
    if (!ciphertext) return "";
    if (!ciphertext.startsWith(PREFIX)) {
      // Not encrypted
      return ciphertext;
    }

    const payload = ciphertext.slice(PREFIX.length);
    const parts = payload.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted format");
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
  }

  maskNationalId(nationalId: string): string {
    const clean = nationalId.trim().replace(/\D/g, "");
    if (clean.length !== 10) return "**********";
    return `${clean.slice(0, 3)}****${clean.slice(7)}`;
  }

  maskCardNumber(cardNumber: string): string {
    const clean = cardNumber.trim().replace(/\D/g, "");
    if (clean.length < 16) return "****-****-****-****";
    return `${clean.slice(0, 4)}-****-****-${clean.slice(12)}`;
  }

  maskPhone(phone: string): string {
    const clean = phone.trim().replace(/\D/g, "");
    if (clean.length < 11) return "****-***-****";
    return `${clean.slice(0, 4)}***${clean.slice(7)}`;
  }
}

export const defaultVault = new CryptoVault();
