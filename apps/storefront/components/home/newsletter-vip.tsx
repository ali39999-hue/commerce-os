'use client';

import { useState } from 'react';

export function NewsletterVip() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError('لطفاً ایمیل یا شماره موبایل معتبر وارد فرمایید.');
      return;
    }
    setError(null);
    setLoading(true);

    // Simulated graceful subscription registration
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section className="newsletter-vip-section" aria-labelledby="vip-club-title">
      <div className="vip-inner-card">
        <div className="vip-glow-effect" aria-hidden="true"></div>
        <div className="vip-content">
          <span className="vip-eyebrow">باشگاه پزشکان و مراجعین ویژه دکتر درمر</span>
          <h2 id="vip-club-title" className="vip-title">
            دریافت تازه‌ترین پروتکل‌های پوستی و دسترسی پیش‌ازموعد به کیت‌ها
          </h2>
          <p className="vip-desc">
            با عضویت در حلقه VIP، چکیده کارآزمایی‌های بالینی فصلی، کدهای تخفیف دوره‌ای و دعوت‌نامه سمینارهای وبیناری آکادمی
            را مستقیماً دریافت کنید.
          </p>

          {submitted ? (
            <div className="vip-success-banner" role="status">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>اطلاعات شما با موفقیت ثبت شد. به جمع همراهان بالینی دکتر درمر خوش آمدید.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="vip-form">
              <div className="vip-input-wrap">
                <input
                  type="text"
                  placeholder="ایمیل یا شماره تلفن همراه (جهت دریافت خبرنامه)"
                  value={emailOrPhone}
                  onChange={(e) => {
                    setEmailOrPhone(e.target.value);
                    if (error) setError(null);
                  }}
                  className="vip-input"
                  aria-label="آدرس ایمیل یا شماره موبایل برای عضویت در خبرنامه"
                />
                <button type="submit" className="vip-submit-btn" disabled={loading}>
                  {loading ? 'در حال ثبت...' : 'عضویت در حلقه VIP'}
                </button>
              </div>
              {error && <p className="vip-error-msg">{error}</p>}
              <p className="vip-privacy-note">
                حفظ حریم خصوصی شما تعهد اخلاقی ماست؛ هیچ‌گونه پیام تبلیغاتی آزاردهنده یا اسپم ارسال نخواهد شد.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
