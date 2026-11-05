import crypto from "node:crypto";
import pg from "pg";

const { Pool } = pg;

// Connection string configuration with fallback
let currentDbUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:5432/commerce_os?schema=public";

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  "f4d5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5";

// Shared connection pool on globalThis to prevent multiple instances during HMR
const globalForAuth = globalThis as unknown as {
  authPgPool: pg.Pool | undefined;
  activeDbUrl: string | undefined;
};

function getFallbackUrl(url: string): string {
  if (url.includes(":5432")) return url.replace(":5432", ":5433");
  if (url.includes(":5433")) return url.replace(":5433", ":5432");
  return url;
}

function getPool(): pg.Pool {
  const targetUrl = globalForAuth.activeDbUrl || currentDbUrl;
  if (!globalForAuth.authPgPool || globalForAuth.activeDbUrl !== targetUrl) {
    globalForAuth.activeDbUrl = targetUrl;
    globalForAuth.authPgPool = new Pool({
      connectionString: targetUrl,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 4000,
    });

    globalForAuth.authPgPool.on("error", (err) => {
      console.error("[PostgreSQL Pool Error]:", err.message);
    });
  }
  return globalForAuth.authPgPool;
}

async function switchPoolFallback(): Promise<void> {
  if (globalForAuth.authPgPool) {
    try {
      await globalForAuth.authPgPool.end();
    } catch {}
    globalForAuth.authPgPool = undefined;
  }
  const nextUrl = getFallbackUrl(globalForAuth.activeDbUrl || currentDbUrl);
  globalForAuth.activeDbUrl = nextUrl;
  currentDbUrl = nextUrl;
  console.log(`[auth-service] Switched database connection to: ${nextUrl}`);
}

async function dbQuery<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> {
  let pool = getPool();
  try {
    return await pool.query<T>(text, params);
  } catch (err: any) {
    if (
      err &&
      (err.code === "ECONNREFUSED" ||
        err.message?.includes("ECONNREFUSED") ||
        err.message?.includes("connect"))
    ) {
      console.warn(
        `[auth-service] Connection refused on ${globalForAuth.activeDbUrl}. Attempting fallback port...`
      );
      await switchPoolFallback();
      pool = getPool();
      return await pool.query<T>(text, params);
    }
    throw err;
  }
}

/* ==========================================================================
   PASSWORD HASHING & VERIFICATION (PBKDF2)
   Format: pbkdf2$<salt_hex>$<hash_hex>
   ========================================================================== */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 32, "sha256")
    .toString("hex");
  return `pbkdf2$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string | null): boolean {
  if (!storedHash || !storedHash.startsWith("pbkdf2$")) {
    return false;
  }
  const parts = storedHash.split("$");
  if (parts.length !== 3) return false;
  const [, salt, expectedHashHex] = parts;
  try {
    const calculatedHash = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
    const expectedBuffer = Buffer.from(expectedHashHex, "hex");
    if (calculatedHash.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(calculatedHash, expectedBuffer);
  } catch {
    return false;
  }
}

/* ==========================================================================
   STANDARDS-COMPLIANT HS256 JWT GENERATION & VERIFICATION
   ========================================================================== */
function base64UrlEncode(input: string | Buffer): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return buf.toString("base64url");
}

export interface JwtPayload {
  sub: string; // User ID
  role: string;
  phone?: string;
  email?: string;
  username?: string;
  fullName?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export function signJwt(
  payload: JwtPayload,
  expiresInSeconds = 7 * 24 * 3600
): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomBytes(4).toString("hex");
  const fullPayload: JwtPayload = {
    ...payload,
    jti: nonce,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(dataToSign)
    .digest("base64url");

  return `${dataToSign}.${signature}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const expectedSignature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(dataToSign)
    .digest("base64url");

  try {
    const isSigValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    if (!isSigValid) return null;

    const payloadJson = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson) as JwtPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/* ==========================================================================
   DATABASE USER MANAGEMENT & AUTH TRANSACTIONS
   ========================================================================== */
export interface AuthUser {
  id: string;
  phone: string;
  email: string | null;
  fullName: string;
  role: string;
  username?: string;
}

export async function registerUserInDb(params: {
  username: string;
  password: string;
  fullName?: string;
  contact?: string;
  userAgent?: string;
  ipAddress?: string;
}): Promise<{ user: AuthUser; token: string }> {
  const cleanUsername = params.username.trim().toLowerCase();
  const cleanFullName = (params.fullName?.trim() || params.username.trim()).slice(0, 150);
  const contact = params.contact?.trim() || "";

  // Determine phone and email identifiers
  let phone = "";
  let email: string | null = null;

  if (contact.startsWith("09") && contact.length === 11 && /^\d+$/.test(contact)) {
    phone = contact;
    email = `${cleanUsername}@drdermer.local`;
  } else if (contact.includes("@")) {
    email = contact.toLowerCase();
    phone = `09${cleanUsername.replace(/\D/g, "").padEnd(9, "0").slice(0, 9)}`;
  } else {
    // Generate deterministic valid phone for username uniqueness
    const numPart = cleanUsername
      .split("")
      .map((c) => c.charCodeAt(0) % 10)
      .join("")
      .padEnd(9, "7")
      .slice(0, 9);
    phone = `09${numPart}`;
    email = `${cleanUsername}@drdermer.local`;
  }

  // Check if username / email already exists
  const existingUserRes = await dbQuery(
    `SELECT id FROM users WHERE "phone" = $1 OR "email" = $2 OR "email" = $3 LIMIT 1`,
    [phone, email, `${cleanUsername}@drdermer.local`]
  );

  if (existingUserRes.rows.length > 0) {
    throw new Error("این نام کاربری یا شماره همراه قبلاً در سیستم ثبت شده است.");
  }

  // Hash password
  const passwordHash = hashPassword(params.password);
  const userId = crypto.randomUUID();

  // Create User Record
  await dbQuery(
    `INSERT INTO users ("id", "phone", "email", "fullName", "passwordHash", "role", "isActive", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, 'CUSTOMER', true, NOW(), NOW())`,
    [userId, phone, email || `${cleanUsername}@drdermer.local`, cleanFullName, passwordHash]
  );

  // Sign compact JWT (fits within VarChar(255) limit of sessionToken)
  const token = signJwt({
    sub: userId,
    role: "CUSTOMER",
  });

  // Persist Session Token in Database (user_sessions)
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 days
  await dbQuery(
    `INSERT INTO user_sessions ("id", "userId", "sessionToken", "ipAddress", "userAgent", "expiresAt", "createdAt")
     VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
    [
      sessionId,
      userId,
      token,
      params.ipAddress || "127.0.0.1",
      (params.userAgent || "Storefront Web").slice(0, 255),
      expiresAt,
    ]
  );

  return {
    user: {
      id: userId,
      phone,
      email: email || `${cleanUsername}@drdermer.local`,
      fullName: cleanFullName,
      role: "CUSTOMER",
      username: cleanUsername,
    },
    token,
  };
}

export async function loginUserInDb(params: {
  username: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}): Promise<{ user: AuthUser; token: string }> {
  const rawIdentifier = params.username.trim().toLowerCase();

  // Query user by phone OR email OR username@drdermer.local
  const userRes = await dbQuery(
    `SELECT id, phone, email, "fullName", "passwordHash", role, "isActive"
     FROM users
     WHERE "phone" = $1 OR "email" = $1 OR "email" = $2
     LIMIT 1`,
    [rawIdentifier, `${rawIdentifier}@drdermer.local`]
  );

  if (userRes.rows.length === 0) {
    throw new Error("نام کاربری یا رمز عبور اشتباه است.");
  }

  const dbUser = userRes.rows[0];

  if (!dbUser.isActive) {
    throw new Error("حساب کاربری شما غیرفعال شده است. لطفاً با پشتیبانی تماس بگیرید.");
  }

  if (!dbUser.passwordHash) {
    throw new Error("برای این حساب کاربری رمز عبور ثبت نشده است. لطفاً از بازیابی یا کد یکبار مصرف استفاده نمایید.");
  }

  // Verify password
  const isMatch = verifyPassword(params.password, dbUser.passwordHash);
  if (!isMatch) {
    throw new Error("نام کاربری یا رمز عبور اشتباه است.");
  }

  // Generate compact JWT token (fits within VarChar(255) sessionToken)
  const token = signJwt({
    sub: dbUser.id,
    role: dbUser.role || "CUSTOMER",
  });

  // Store new JWT session into PostgreSQL database (user_sessions)
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 days
  await dbQuery(
    `INSERT INTO user_sessions ("id", "userId", "sessionToken", "ipAddress", "userAgent", "expiresAt", "createdAt")
     VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
    [
      sessionId,
      dbUser.id,
      token,
      params.ipAddress || "127.0.0.1",
      (params.userAgent || "Storefront Web").slice(0, 255),
      expiresAt,
    ]
  );

  return {
    user: {
      id: dbUser.id,
      phone: dbUser.phone,
      email: dbUser.email,
      fullName: dbUser.fullName || rawIdentifier,
      role: dbUser.role || "CUSTOMER",
      username: rawIdentifier,
    },
    token,
  };
}

export async function validateSessionInDb(token: string): Promise<AuthUser | null> {
  if (!token) return null;

  // 1. Verify cryptographic JWT signature
  const decoded = verifyJwt(token);
  if (!decoded) return null;

  // 2. Verify session persistence and active status in DB
  try {
    const res = await dbQuery(
      `SELECT s.id as "sessionId", s."expiresAt", u.id, u.phone, u.email, u."fullName", u.role, u."isActive"
       FROM user_sessions s
       JOIN users u ON s."userId" = u.id
       WHERE s."sessionToken" = $1 AND s."expiresAt" > NOW() AND u."isActive" = true
       LIMIT 1`,
      [token]
    );

    if (res.rows.length === 0) {
      return null;
    }

    const row = res.rows[0];
    return {
      id: row.id,
      phone: row.phone,
      email: row.email,
      fullName: row.fullName || "کاربر گرامی",
      role: row.role || "CUSTOMER",
      username: decoded.username || row.phone,
    };
  } catch (err) {
    console.error("[Session Validation Error]:", err);
    return null;
  }
}

export async function logoutSessionInDb(token: string): Promise<boolean> {
  if (!token) return true;
  try {
    await dbQuery(`DELETE FROM user_sessions WHERE "sessionToken" = $1`, [token]);
    return true;
  } catch (err) {
    console.error("[Logout DB Error]:", err);
    return false;
  }
}
