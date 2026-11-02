"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const API_HOST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Fixed endpoint constants (never user-supplied URLs) — resolved once so the
// fetch call sites below take plain string arguments.
const OTP_REQUEST_URL = `${API_HOST}/v1/auth/otp/request`;
const OTP_VERIFY_URL = `${API_HOST}/v1/auth/otp/verify`;
const API_ORIGIN = API_HOST;

const SESSION_KEY = "dermer_customer_session";

export interface CustomerUser {
  id: string;
  phone: string;
  fullName: string;
  role: string;
}

export interface CustomerSession {
  token: string;
  user: CustomerUser;
}

interface CustomerSessionContextValue {
  session: CustomerSession | null;
  ready: boolean;
  login: (session: CustomerSession) => void;
  logout: () => void;
  /** OTP step 1: request a verification code for the phone number. */
  requestOtp: (phone: string) => Promise<{ ok: boolean; simulatedCode?: string; message?: string }>;
  /** OTP step 2: verify the code and establish the session. */
  verifyOtp: (phone: string, code: string) => Promise<{ ok: boolean; message?: string }>;
  /** fetch wrapper attaching the session token when present. */
  authedFetch: (path: string, init?: RequestInit) => Promise<Response>;
}

const CustomerSessionContext = createContext<CustomerSessionContextValue | null>(null);

function readStoredSession(): CustomerSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CustomerSession;
    return parsed.token && parsed.user ? parsed : null;
  } catch {
    return null;
  }
}

export function CustomerSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [ready, flagReady] = useState(false);

  useEffect(() => {
    setSession(readStoredSession());
    flagReady(true);
  }, []);

  const login = useCallback((next: CustomerSession) => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  const requestOtp = useCallback(async (phone: string) => {
    try {
      const res = await fetch(OTP_REQUEST_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone }),
        signal: AbortSignal.timeout(8000),
      });
      const data = (await res.json().catch(() => null)) as { message?: string; simulatedCode?: string } | null;
      if (!res.ok) return { ok: false, message: data?.message ?? "ارسال کد تایید ناموفق بود" };
      return { ok: true, simulatedCode: data?.simulatedCode };
    } catch {
      return { ok: false, message: "ارتباط با سرویس احراز هویت برقرار نشد" };
    }
  }, []);

  const verifyOtp = useCallback(async (phone: string, code: string) => {
    try {
      const res = await fetch(OTP_VERIFY_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, code }),
        signal: AbortSignal.timeout(8000),
      });
      const data = (await res.json().catch(() => null)) as { token?: string; user?: CustomerUser; message?: string } | null;
      if (!res.ok || !data?.token || !data?.user) {
        return { ok: false, message: data?.message ?? "کد تایید نامعتبر است" };
      }
      login({ token: data.token, user: data.user });
      return { ok: true };
    } catch {
      return { ok: false, message: "ارتباط با سرویس احراز هویت برقرار نشد" };
    }
  }, [login]);

  const authedFetch = useCallback(
    (path: string, init: RequestInit = {}) => {
      const headers = new Headers(init.headers);
      headers.set("content-type", "application/json");
      if (session?.token) headers.set("authorization", `Bearer ${session.token}`);
      return fetch(API_ORIGIN + path, {
        ...init,
        headers,
        signal: init.signal ?? AbortSignal.timeout(8000),
      });
    },
    [session],
  );

  const value = useMemo(
    () => ({ session, ready, login, logout, requestOtp, verifyOtp, authedFetch }),
    [session, ready, login, logout, requestOtp, verifyOtp, authedFetch],
  );

  return <CustomerSessionContext.Provider value={value}>{children}</CustomerSessionContext.Provider>;
}

export function useCustomerSession(): CustomerSessionContextValue {
  const ctx = useContext(CustomerSessionContext);
  if (!ctx) throw new Error("useCustomerSession must be used within CustomerSessionProvider");
  return ctx;
}
