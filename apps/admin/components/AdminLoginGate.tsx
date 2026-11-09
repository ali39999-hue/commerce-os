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
 * Modern Clinical Glassmorphic OTP Login Gate for Dr Dermer UK Clinical ERP.
 */
export default function AdminLoginGate({ onSession }: AdminLoginGateProps) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("09121111111");
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
        background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
      dir="rtl"
    >
      {/* Background ambient medical grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "440px",
          maxWidth: "100%",
          background: "#ffffff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 16px 40px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.03)",
          padding: "40px 36px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #274b24 0%, #356231 100%)",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 14px rgba(39, 75, 36, 0.25)",
            }}
          >
            COS
          </div>
          <h1 style={{ margin: 0, fontSize: "1.35rem", color: "#0f172a", fontWeight: 800 }}>
            ورود امن به پنل سازمانی ERP
          </h1>
          <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.7 }}>
            سامانه یکپارچه مدیریت کلینیکال و تجارت الکترونیک Dr Dermer UK
          </p>
        </div>

        {step === "phone" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "0.84rem", color: "#334155", fontWeight: 600, display: "block", marginBottom: "6px" }} htmlFor="admin-phone">
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
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  color: "#0f172a",
                  fontSize: "1rem",
                  letterSpacing: "0.04em",
                  textAlign: "left",
                  outline: "none",
                  transition: "all .15s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#06b6d4")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.14)")}
              />
            </div>

            <div style={{ background: "#e8f3ee", border: "1px solid #77B091", borderRadius: "10px", padding: "10px 14px", fontSize: "0.78rem", color: "#274b24" }}>
              💡 حساب‌های پیش‌فرض دمو: <strong>09121111111</strong> (مدیر ارشد) | <strong>09122222222</strong> (اپراتور)
            </div>

            <button
              onClick={requestOtp}
              disabled={busy || phone.trim().length < 10}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: busy || phone.trim().length < 10 ? "#cbd5e1" : "linear-gradient(135deg, #274b24 0%, #356231 100%)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: busy || phone.trim().length < 10 ? "not-allowed" : "pointer",
                boxShadow: busy || phone.trim().length < 10 ? "none" : "0 4px 14px rgba(39, 75, 36, 0.25)",
                transition: "all .15s ease",
              }}
            >
              {busy ? "در حال ارسال پیامک…" : "دریافت کد تایید یکبار مصرف"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#e8f3ee", border: "1px solid #77B091", borderRadius: "10px", padding: "12px 14px" }}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#e2e8f0" }}>
                کد ۵ رقمی ارسال‌شده به <strong dir="ltr" style={{ color: "#38bdf8" }}>{phone}</strong> را وارد کنید:
              </p>
              {devCodeHint && (
                <div style={{ marginTop: "6px", color: "#34d399", fontWeight: 700, fontSize: "0.82rem" }}>
                  کد ورود سریع محیط آزمایش: <span dir="ltr" style={{ fontFamily: "monospace", fontSize: "1rem" }}>{devCodeHint}</span>
                </div>
              )}
            </div>

            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="- - - - -"
              inputMode="numeric"
              dir="ltr"
              maxLength={5}
              autoFocus
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "rgba(10, 17, 26, 0.8)",
                border: "1px solid rgba(6, 182, 212, 0.4)",
                color: "#38bdf8",
                fontSize: "1.4rem",
                letterSpacing: "0.45em",
                textAlign: "center",
                fontVariantNumeric: "tabular-nums",
                outline: "none",
                fontWeight: 800,
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && code.trim().length === 5) verifyOtp();
              }}
            />

            <button
              onClick={verifyOtp}
              disabled={busy || code.trim().length < 5}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: busy || code.trim().length < 5 ? "rgba(6, 182, 212, 0.3)" : "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: busy || code.trim().length < 5 ? "not-allowed" : "pointer",
                boxShadow: busy || code.trim().length < 5 ? "none" : "0 6px 20px rgba(6, 182, 212, 0.35)",
              }}
            >
              {busy ? "در حال اعتبارسنجی…" : "ورود به میز کار ERP"}
            </button>

            <button
              onClick={() => { setStep("phone"); setCode(""); setDevCodeHint(null); }}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: "0.82rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              ویرایش شماره موبایل
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            style={{
              margin: "18px 0 0",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              fontSize: "0.84rem",
              lineHeight: 1.6,
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
