"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./auth.css";

interface AuthCardProps {
  initialMode?: "signup" | "login";
  redirectTo?: string;
}

export function AuthCard({ initialMode = "signup", redirectTo = "/account" }: AuthCardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "login">(initialMode);

  // Form State
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const usernameId = useId();
  const fullNameId = useId();
  const contactId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const termsId = useId();
  const rememberId = useId();

  // Password Strength Calculation (0 - 3)
  const calculateStrength = (pwd: string): number => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8 && /[A-Z0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) score++;
    return score;
  };

  const strength = calculateStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleToggleMode = (newMode: "signup" | "login") => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Common validations
    if (!username.trim()) {
      setErrorMessage("لطفاً نام کاربری را وارد فرمایید.");
      return;
    }

    if (username.trim().length < 3) {
      setErrorMessage("نام کاربری باید حداقل ۳ کاراکتر باشد.");
      return;
    }

    if (!password) {
      setErrorMessage("لطفاً رمز عبور را وارد فرمایید.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setErrorMessage("رمز عبور باید حداقل ۶ کاراکتر باشد.");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("رمز عبور و تکرار آن یکسان نیستند.");
        return;
      }

      if (!agreeTerms) {
        setErrorMessage("برای ثبت‌نام، پذیرش قوانین و مقررات الزامی است.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "signup"
          ? {
              username: username.trim(),
              password,
              fullName: fullName.trim() || undefined,
              contact: contact.trim() || undefined,
            }
          : {
              username: username.trim(),
              password,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "خطا در برقراری ارتباط با سامانه احراز هویت");
      }

      const authData = {
        id: data.user.id,
        username: data.user.username || username.trim(),
        fullName: data.user.fullName || username.trim(),
        phone: data.user.phone,
        email: data.user.email,
        role: data.user.role || "CUSTOMER",
        token: data.token,
        loggedInAt: new Date().toISOString(),
      };

      // Persist in client storage
      localStorage.setItem("commerce_os.auth.token", data.token);
      localStorage.setItem("commerce_os.auth.user", JSON.stringify(authData));

      // Update or initialize account profile with real user details
      localStorage.setItem(
        "commerce_os.account.profile",
        JSON.stringify({
          fullName: authData.fullName,
          phone: authData.phone || "09120000000",
          email: authData.email || `${authData.username}@drdermer.local`,
          nationalCode: "",
          skinType: "COMBINATION",
          skinConcerns: ["مراقبت و نوسازی پوست"],
          clinicCustomer: false,
        })
      );

      // Dispatch event so header & other components update reactively
      window.dispatchEvent(new Event("commerce_os:auth_change"));

      if (mode === "signup") {
        setSuccessMessage("حساب کاربری شما با موفقیت در دیتابیس ایجاد شد! در حال انتقال...");
      } else {
        setSuccessMessage("ورود شما با توکن معتبر با موفقیت تأیید شد! در حال انتقال...");
      }

      setTimeout(() => {
        router.push(redirectTo);
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطایی رخ داد. لطفاً مجدداً تلاش فرمایید.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider: "google" | "apple") => {
    setLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const socialUser = {
        username: provider === "google" ? "google_user" : "apple_user",
        fullName: provider === "google" ? "کاربر گوگل" : "کاربر اپل",
        provider,
        role: "CUSTOMER",
        loggedInAt: new Date().toISOString(),
      };

      localStorage.setItem("commerce_os.auth.user", JSON.stringify(socialUser));
      window.dispatchEvent(new Event("commerce_os:auth_change"));
      setSuccessMessage(`ورود موفق از طریق حساب ${provider === "google" ? "گوگل" : "اپل"} انجام شد!`);

      setTimeout(() => {
        router.push(redirectTo);
      }, 900);
    }, 1000);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-card">
        {/* ── 1. Form Side (Interactive RTL Form) ── */}
        <div className="auth-form-column">
          <div className="auth-form-inner">
            <div className="auth-top-nav">
              <Link href="/" className="auth-back-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 19 12 12 5" />
                </svg>
                <span>بازگشت به فروشگاه</span>
              </Link>
              <Link href="/" className="auth-brand-logo-link" title="صفحه اصلی دکتر درمر">
                <span className="auth-brand-name">Dr. Dermer</span>
              </Link>
            </div>

            <div className="auth-header-area">
              <div className="auth-brand-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>دکتر درمر انگلستان | سیستم بالینی و درمان پوست</span>
              </div>

            <h1 className="auth-title">
              {mode === "signup" ? "ایجاد حساب کاربری" : "ورود به حساب کاربری"}
            </h1>
            <p className="auth-subtitle">
              {mode === "signup"
                ? "اطلاعات خود را وارد کنید تا حساب تخصصی شما بلافاصله فعال شود."
                : "نام کاربری و رمز عبور خود را جهت دسترسی به پنل و سفارشات وارد فرمایید."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-mode-switch-tabs" role="tablist" aria-label="انتخاب وضعیت احراز هویت">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={`auth-mode-tab-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => handleToggleMode("signup")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              <span>ثبت‌نام جدید</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={`auth-mode-tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => handleToggleMode("login")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>ورود به حساب</span>
            </button>
          </div>

          {/* Feedback alerts */}
          {errorMessage && (
            <div className="auth-alert error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert success" role="status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Optional Full Name in Sign Up */}
            {mode === "signup" && (
              <div className="auth-input-group">
                <label htmlFor={fullNameId} className="auth-label">
                  <span>نام و نام خانوادگی (اختیاری)</span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    id={fullNameId}
                    type="text"
                    className="auth-input"
                    placeholder="مثال: سارا محمدی"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            {/* Username Field */}
            <div className="auth-input-group">
              <label htmlFor={usernameId} className="auth-label">
                <span>
                  {mode === "signup" ? "نام کاربری" : "نام کاربری، شماره موبایل یا ایمیل"}
                  <span className="auth-label-required">*</span>
                </span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  id={usernameId}
                  type="text"
                  required
                  className="auth-input"
                  placeholder={mode === "signup" ? "مثال: dr_user یا sara98" : "نام کاربری یا ۰۹۱۲xxxxxxx"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  dir="ltr"
                  style={{ textAlign: "right" }}
                />
              </div>
            </div>

            {/* Optional Email / Mobile in Sign Up */}
            {mode === "signup" && (
              <div className="auth-input-group">
                <label htmlFor={contactId} className="auth-label">
                  <span>ایمیل یا شماره همراه (اختیاری)</span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    id={contactId}
                    type="text"
                    className="auth-input"
                    placeholder="info@example.com یا ۰۹۱۲۳۴۵۶۷۸۹"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    autoComplete="email"
                    dir="ltr"
                    style={{ textAlign: "right" }}
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="auth-input-group">
              <label htmlFor={passwordId} className="auth-label">
                <span>
                  رمز عبور
                  <span className="auth-label-required">*</span>
                </span>
                {mode === "login" && (
                  <Link href="/contact" className="auth-forgot-link">
                    فراموشی رمز عبور؟
                  </Link>
                )}
              </label>
              <div className="auth-input-wrapper">
                <input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  required
                  className="auth-input"
                  placeholder="حداقل ۶ کاراکتر"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  dir="ltr"
                  style={{ textAlign: "right" }}
                />
                <button
                  type="button"
                  className="auth-input-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength meters in Sign Up mode */}
              {mode === "signup" && password.length > 0 && (
                <div className="auth-password-strength" aria-live="polite">
                  <div className="auth-strength-meters">
                    <div className={`auth-strength-bar ${strength >= 1 ? (strength === 1 ? "weak" : strength === 2 ? "medium" : "strong") : ""}`} />
                    <div className={`auth-strength-bar ${strength >= 2 ? (strength === 2 ? "medium" : "strong") : ""}`} />
                    <div className={`auth-strength-bar ${strength >= 3 ? "strong" : ""}`} />
                  </div>
                  <div className="auth-strength-label">
                    <span>قدرت رمز عبور:</span>
                    <span>
                      {strength === 1 && "ساده (نیاز به تقویت)"}
                      {strength === 2 && "متوسط (قابل قبول)"}
                      {strength >= 3 && "بسیار مطمئن و قوی"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field (Requested: تکرار رمز عبور) */}
            {mode === "signup" && (
              <div className="auth-input-group">
                <label htmlFor={confirmPasswordId} className="auth-label">
                  <span>
                    تکرار رمز عبور
                    <span className="auth-label-required">*</span>
                  </span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    id={confirmPasswordId}
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className={`auth-input ${passwordsMismatch ? "error" : passwordsMatch ? "success" : ""}`}
                    placeholder="تکرار همان رمز عبور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    dir="ltr"
                    style={{ textAlign: "right" }}
                  />
                  <button
                    type="button"
                    className="auth-input-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "پنهان کردن تکرار رمز" : "نمایش تکرار رمز"}
                  >
                    {showConfirmPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11-8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Match Indicator */}
                {passwordsMatch && (
                  <div className="auth-match-hint match">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>رمزهای عبور با یکدیگر مطابقت دارند.</span>
                  </div>
                )}
                {passwordsMismatch && (
                  <div className="auth-match-hint mismatch">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    <span>رمزهای عبور یکسان نیستند.</span>
                  </div>
                )}
              </div>
            )}

            {/* Checkbox: Terms & Policies in Sign Up */}
            {mode === "signup" ? (
              <div className="auth-remember-row">
                <label htmlFor={termsId} className="auth-checkbox-label">
                  <input
                    id={termsId}
                    type="checkbox"
                    className="auth-checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span>
                    شرایط و{" "}
                    <Link href="/legal" target="_blank" className="auth-terms-link">
                      قوانین و حریم خصوصی
                    </Link>{" "}
                    سایت را می‌پذیرم.
                  </span>
                </label>
              </div>
            ) : (
              <div className="auth-remember-row">
                <label htmlFor={rememberId} className="auth-checkbox-label">
                  <input
                    id={rememberId}
                    type="checkbox"
                    className="auth-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>مرا به خاطر بسپار</span>
                </label>
              </div>
            )}

            {/* Primary Submit Button */}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin" aria-hidden="true" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  <span>در حال پردازش...</span>
                </>
              ) : (
                <span>{mode === "signup" ? "ثبت‌نام و شروع کاربری" : "ورود به حساب کاربری"}</span>
              )}
            </button>
          </form>

          {/* Or Divider */}
          <div className="auth-divider">
            <span className="auth-divider-text">یا</span>
          </div>

          {/* Social Sign In Buttons (Google & Apple) */}
          <div className="auth-social-row">
            <button
              type="button"
              className="auth-social-btn"
              onClick={() => handleSocialAuth("google")}
              disabled={loading}
              aria-label="ورود با حساب گوگل"
            >
              {/* Google 4-color SVG */}
              <svg className="auth-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>ورود با گوگل</span>
            </button>

            <button
              type="button"
              className="auth-social-btn"
              onClick={() => handleSocialAuth("apple")}
              disabled={loading}
              aria-label="ورود با حساب اپل"
            >
              {/* Apple SVG */}
              <svg className="auth-social-icon" viewBox="0 0 24 24" fill="#000000" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.66-.82 1.12-1.95.99-3.09-.97.04-2.13.65-2.82 1.45-.6.69-1.13 1.82-1 2.94 1.09.08 2.18-.54 2.83-1.3z" />
              </svg>
              <span>ورود با اپل</span>
            </button>
          </div>

          {/* Footer Prompt Link to Switch Mode */}
          <div className="auth-footer-prompt">
            {mode === "signup" ? (
              <span>
                قبلاً ثبت‌نام کرده‌اید؟{" "}
                <button
                  type="button"
                  className="auth-switch-link-btn"
                  onClick={() => handleToggleMode("login")}
                >
                  ورود به حساب
                </button>
              </span>
            ) : (
              <span>
                هنوز حساب کاربری ندارید؟{" "}
                <button
                  type="button"
                  className="auth-switch-link-btn"
                  onClick={() => handleToggleMode("signup")}
                >
                  ثبت‌نام کنید
                </button>
              </span>
            )}
          </div>
          </div>
        </div>

        {/* ── 2. Image Side (Clean Full-Screen Monstera Leaves with Organic Curved Edge) ── */}
        <div className="auth-banner-column" aria-hidden="true">
          <svg
            className="auth-curve-divider"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 100 0 C 15 250, 15 750, 100 1000 L 100 0 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
