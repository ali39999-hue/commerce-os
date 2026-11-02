"use client";

import { useState } from "react";
import { useCustomerSession } from "../lib/customer-session";

/**
 * Customer OTP login card (AUTH-002 step 2) — used on identity-gated
 * storefront pages. Warm Clinical styling, inline within the page flow.
 */
export function CustomerLoginCard({ onSuccess }: { onSuccess?: () => void }) {
  const { requestOtp, verifyOtp } = useCustomerSession();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devHint, setDevHint] = useState<string | null>(null);

  const submitPhone = async () => {
    setBusy(true);
    setError(null);
    const result = await requestOtp(phone.trim());
    if (!result.ok) {
      setError(result.message ?? "ارسال کد ناموفق بود");
    } else {
      if (result.simulatedCode) setDevHint(result.simulatedCode);
      setStep("code");
    }
    setBusy(false);
  };

  const submitCode = async () => {
    setBusy(true);
    setError(null);
    const result = await verifyOtp(phone.trim(), code.trim());
    if (!result.ok) {
      setError(result.message ?? "کد تایید نامعتبر است");
    } else {
      onSuccess?.();
    }
    setBusy(false);
  };

  const inputStyle = {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid var(--border, #E6E5DE)",
    fontSize: "1rem",
    background: "#FFFFFF",
  } as const;

  return (
    <div
      dir="rtl"
      style={{
        maxWidth: "420px",
        margin: "0 auto",
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid var(--border, #E6E5DE)",
        boxShadow: "0 18px 44px rgba(36, 89, 79, 0.10)",
        padding: "32px 28px",
      }}
    >
      <h2 style={{ margin: 0, color: "var(--brand, #24594F)", fontSize: "1.15rem", fontWeight: 700 }}>
        ورود با شماره موبایل
      </h2>
      <p style={{ margin: "8px 0 18px", color: "var(--muted, #69736D)", fontSize: "0.9rem", lineHeight: 1.7 }}>
        کد تایید پیامکی برای ادامه استفاده می‌شود؛ بدون رمز عبور.
      </p>

      {step === "phone" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label htmlFor="customer-phone" style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--ink, #242D29)" }}>
            شماره موبایل
          </label>
          <input
            id="customer-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09xxxxxxxxx"
            inputMode="tel"
            dir="ltr"
            style={{ ...inputStyle, textAlign: "left", letterSpacing: "0.03em" }}
          />
          <button
            onClick={submitPhone}
            disabled={busy || phone.trim().length < 10}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: busy || phone.trim().length < 10 ? "var(--muted, #69736D)" : "var(--brand, #24594F)",
              color: "#fff",
              fontWeight: 700,
              cursor: busy || phone.trim().length < 10 ? "not-allowed" : "pointer",
            }}
          >
            {busy ? "در حال ارسال…" : "دریافت کد تایید"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted, #69736D)" }}>
            کد ۵ رقمی پیامک‌شده به <strong dir="ltr">{phone}</strong> را وارد کنید.
            {devHint && (
              <span style={{ display: "block", marginTop: "6px", color: "var(--brand, #24594F)", fontWeight: 600 }}>
                (محیط توسعه — کد نمونه: <span dir="ltr">{devHint}</span>)
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
            style={{ ...inputStyle, textAlign: "center", fontSize: "1.2rem", letterSpacing: "0.4em" }}
          />
          <button
            onClick={submitCode}
            disabled={busy || code.trim().length < 5}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: busy || code.trim().length < 5 ? "var(--muted, #69736D)" : "var(--brand, #24594F)",
              color: "#fff",
              fontWeight: 700,
              cursor: busy || code.trim().length < 5 ? "not-allowed" : "pointer",
            }}
          >
            {busy ? "در حال بررسی…" : "ورود"}
          </button>
          <button
            onClick={() => { setStep("phone"); setCode(""); setDevHint(null); }}
            style={{
              background: "none",
              border: "none",
              color: "var(--muted, #69736D)",
              fontSize: "0.85rem",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            تغییر شماره
          </button>
        </div>
      )}

      {error && (
        <p
          role="alert"
          style={{
            margin: "14px 0 0",
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
  );
}
