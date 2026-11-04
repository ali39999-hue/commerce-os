"use client";

import { useState } from "react";
import {
  API_BASE,
  ADMIN_ROLES,
  writeAdminSession,
  type AdminSessionUser,
} from "./types";

interface AdminLoginGateProps {
  onSession: (session: { token: string; user: AdminSessionUser }) => void;
}

/**
 * OTP login gate for the admin console. Staff phones are pre-provisioned with
 * an admin role in the database (see docs/security/SECURITY_BASELINE.md); a
 * successful OTP login for a CUSTOMER phone is rejected here and by the
 * server-side AdminGuard.
 */
export default function AdminLoginGate({ onSession }: AdminLoginGateProps) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null);

  const requestOtp = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/v1/auth/otp/request`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone }),
        signal: AbortSignal.timeout(8000),
      });
      const data = (await res.json().catch(() => null)) as { message?: string; simulatedCode?: string } | null;
      if (!res.ok) {
        setError(data?.message ?? "ارسال کد تایید ناموفق بود");
        return;
      }
      if (data?.simulatedCode) setDevCodeHint(data.simulatedCode);
      setStep("code");
    } catch {
      setError("ارتباط با سرویس احراز هویت برقرار نشد (پورت 4000).");
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/v1/auth/otp/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, code }),
        signal: AbortSignal.timeout(8000),
      });
      const data = (await res.json().catch(() => null)) as {
        message?: string;
        token?: string;
        user?: AdminSessionUser;
      } | null;
      if (!res.ok || !data?.token || !data?.user) {
        setError(data?.message ?? "کد تایید نامعتبر است");
        return;
      }
      if (!(ADMIN_ROLES as readonly string[]).includes(data.user.role)) {
        setError("این شماره دسترسی مدیریتی ندارد. با پشتیبانی فنی هماهنگ کنید.");
        return;
      }
      writeAdminSession(data.token, data.user);
      onSession({ token: data.token, user: data.user });
    } catch {
      setError("ارتباط با سرویس احراز هویت برقرار نشد (پورت 4000).");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #F7F6F2 0%, #DCE8DF 100%)",
        padding: "24px",
      }}
      dir="rtl"
    >
      <div
        style={{
          width: "420px",
          maxWidth: "100%",
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E6E5DE",
          boxShadow: "0 24px 60px rgba(36, 89, 79, 0.14)",
          padding: "36px 32px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#24594F",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "1.15rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            COS
          </div>
          <h1 style={{ margin: 0, fontSize: "1.25rem", color: "#242D29", fontWeight: 700 }}>
            ورود امن پنل مدیریت
          </h1>
          <p style={{ margin: "8px 0 0", color: "#69736D", fontSize: "0.9rem", lineHeight: 1.7 }}>
            احراز هویت دومرحله‌ای پیامکی — دسترسی بر اساس نقش سازمانی (Super Admin / Operator / Accountant)
          </p>
        </div>

        {step === "phone" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ fontSize: "0.86rem", color: "#242D29", fontWeight: 600 }} htmlFor="admin-phone">
              شماره موبایل سازمانی
            </label>
            <input
              id="admin-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xxxxxxxxx"
              inputMode="tel"
              dir="ltr"
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #E6E5DE",
                fontSize: "1rem",
                letterSpacing: "0.03em",
                textAlign: "left",
              }}
            />
            <button
              onClick={requestOtp}
              disabled={busy || phone.trim().length < 10}
              style={{
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: busy || phone.trim().length < 10 ? "#9FB5AF" : "#24594F",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: busy || phone.trim().length < 10 ? "not-allowed" : "pointer",
              }}
            >
              {busy ? "در حال ارسال…" : "دریافت کد تایید"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#69736D" }}>
              کد ۵ رقمی ارسال‌شده به <strong dir="ltr">{phone}</strong> را وارد کنید.
              {devCodeHint && (
                <span style={{ display: "block", marginTop: "6px", color: "#24594F", fontWeight: 600 }}>
                  (محیط توسعه — کد نمونه: <span dir="ltr">{devCodeHint}</span>)
                </span>
              )}
            </p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="- - - - -"
              inputMode="numeric"
              dir="ltr"
              maxLength={5}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #E6E5DE",
                fontSize: "1.25rem",
                letterSpacing: "0.4em",
                textAlign: "center",
                fontVariantNumeric: "tabular-nums",
              }}
            />
            <button
              onClick={verifyOtp}
              disabled={busy || code.trim().length < 5}
              style={{
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: busy || code.trim().length < 5 ? "#9FB5AF" : "#24594F",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: busy || code.trim().length < 5 ? "not-allowed" : "pointer",
              }}
            >
              {busy ? "در حال بررسی…" : "ورود به پنل"}
            </button>
            <button
              onClick={() => { setStep("phone"); setCode(""); setDevCodeHint(null); }}
              style={{
                background: "none",
                border: "none",
                color: "#69736D",
                fontSize: "0.85rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              تغییر شماره موبایل
            </button>
          </div>
        )}

        {error && (
          <p
            role="alert"
            style={{
              margin: "16px 0 0",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "#FDF1F1",
              border: "1px solid #EBC9C9",
              color: "#B84D4D",
              fontSize: "0.86rem",
              lineHeight: 1.7,
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
