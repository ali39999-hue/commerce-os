export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const TENANT_HEADERS: Record<string, string> = {
  "x-tenant-id": "00000000-0000-0000-0000-000000000000",
};

export interface PostResult {
  ok: boolean;
  status: number;
  data: unknown;
  message?: string;
}

export const postTenantJson = async (
  path: string,
  body: unknown,
  method = "POST"
): Promise<PostResult> => {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        ...TENANT_HEADERS,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      const msg =
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message: unknown }).message)
          : `HTTP ${res.status}`;
      return { ok: false, status: res.status, data, message: msg };
    }
    return { ok: true, status: res.status, data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "خطای شبکه";
    return { ok: false, status: 0, data: null, message: msg };
  }
};

export const patchTenantJson = async (path: string, body?: unknown): Promise<PostResult> => {
  return postTenantJson(path, body ?? {}, "PATCH");
};

export const truncateFa = (value: unknown, max = 60): string => {
  if (typeof value !== "string") return "—";
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
};

export const faNumber = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "۰";
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "۰";
  return new Intl.NumberFormat("fa-IR").format(num);
};

export const str = (value: unknown): string => {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (typeof value === "number") return String(value);
  return "—";
};

export const formatRialAsTomans = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  const strVal = String(value).replace(/[^\d]/g, "");
  if (!strVal) return "—";
  try {
    const rials = BigInt(strVal);
    const tomans = rials / 10n;
    return `${new Intl.NumberFormat("fa-IR").format(tomans)} تومان`;
  } catch {
    return "—";
  }
};
