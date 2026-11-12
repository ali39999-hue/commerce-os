'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, X, AlertCircle, CheckCircle2, User, Phone, CreditCard, Sparkles } from 'lucide-react';
import { validateNationalId, validateIranianMobile, toAsciiDigits } from '@commerce-os/localization';
import { useKyc } from '../lib/kyc-context';
import './kyc-modal.css';

export function KycModal() {
  const { isKycModalOpen, closeKycModal, verifyKyc, pendingRedirectUrl } = useKyc();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalCode, setNationalCode] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form errors when opened
  useEffect(() => {
    if (isKycModalOpen) {
      setHasSubmitted(false);
      setErrorMessage(null);
    }
  }, [isKycModalOpen]);

  // Real-time validations
  const isPhoneValid = useMemo(() => {
    const clean = toAsciiDigits(phone).replace(/\D/g, '');
    return validateIranianMobile(clean);
  }, [phone]);

  const isNationalValid = useMemo(() => {
    const clean = toAsciiDigits(nationalCode).replace(/\D/g, '');
    return validateNationalId(clean);
  }, [nationalCode]);

  const isNameValid = useMemo(() => {
    return fullName.trim().length >= 3;
  }, [fullName]);

  if (!isKycModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setErrorMessage(null);

    const res = verifyKyc({ fullName, phone, nationalCode });
    if (!res.success) {
      setErrorMessage(res.message || 'اطلاعات وارد شده نامعتبر است.');
    }
  };

  const handleFillDemo = () => {
    setFullName('علی محمدی');
    setPhone('۰۹۱۲۳۴۵۶۷۸۹');
    setNationalCode('۰۰۱۰۳۱۲۰۱۳');
    setErrorMessage(null);
  };

  return (
    <div className="kyc-modal-overlay" onClick={closeKycModal} role="dialog" aria-modal="true" dir="rtl">
      <div className="kyc-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header with Close */}
        <div className="kyc-modal-header">
          <div className="kyc-header-title-wrap">
            <div className="kyc-badge-icon-box">
              <ShieldCheck className="kyc-badge-icon" size={24} />
            </div>
            <div>
              <h3 className="kyc-modal-title">احراز هویت هوشمند کاربر</h3>
              <span className="kyc-modal-subtitle">تأیید اطلاعات هویتی پیش از ورود به سبد خرید</span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeKycModal}
            className="kyc-modal-close-btn"
            aria-label="بستن پنجره احراز هویت"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notice Info Banner */}
        <div className="kyc-modal-notice">
          <AlertCircle size={16} className="kyc-notice-icon" />
          <p>
            جهت صیانت از سفارش‌ها و رعایت ضوابط تجارت الکترونیک، ثبت و تطبیق اطلاعات هویتی
            خریدار پیش از مشاهده سبد خرید الزامی است.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="kyc-modal-form">
          {errorMessage && (
            <div className="kyc-form-error-alert" role="alert">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Full Name */}
          <div className="kyc-input-group">
            <label htmlFor="kyc-name" className="kyc-label">
              نام و نام خانوادگی کامل:
            </label>
            <div className={`kyc-input-wrap ${hasSubmitted && !isNameValid ? 'has-error' : ''}`}>
              <User size={18} className="kyc-input-icon" />
              <input
                id="kyc-name"
                type="text"
                placeholder="مثال: علیرضا حسینی"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="kyc-input-field"
                required
              />
              {fullName.trim().length >= 3 && (
                <CheckCircle2 size={16} className="kyc-field-valid-icon" />
              )}
            </div>
            {hasSubmitted && !isNameValid && (
              <span className="kyc-field-hint error">لطفاً نام و نام خانوادگی خود را کامل وارد کنید.</span>
            )}
          </div>

          {/* 2. Mobile Phone */}
          <div className="kyc-input-group">
            <label htmlFor="kyc-phone" className="kyc-label">
              شماره تلفن همراه (مالک خط):
            </label>
            <div className={`kyc-input-wrap ${hasSubmitted && !isPhoneValid ? 'has-error' : ''}`}>
              <Phone size={18} className="kyc-input-icon" />
              <input
                id="kyc-phone"
                type="tel"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="kyc-input-field"
                dir="ltr"
                required
              />
              {isPhoneValid && (
                <CheckCircle2 size={16} className="kyc-field-valid-icon" />
              )}
            </div>
            {hasSubmitted && !isPhoneValid && (
              <span className="kyc-field-hint error">شماره همراه معتبر ۱۱ رقمی وارد نمایید.</span>
            )}
          </div>

          {/* 3. National ID (کد ملی) */}
          <div className="kyc-input-group">
            <div className="kyc-label-with-demo">
              <label htmlFor="kyc-national" className="kyc-label">
                کد ملی ۱۰ رقمی:
              </label>
              <button
                type="button"
                onClick={handleFillDemo}
                className="btn-kyc-fill-demo"
                title="تکمیل خودکار اطلاعات تستی معتبر"
              >
                <Sparkles size={12} />
                <span>نمونه تستی</span>
              </button>
            </div>
            <div className={`kyc-input-wrap ${hasSubmitted && !isNationalValid ? 'has-error' : ''}`}>
              <CreditCard size={18} className="kyc-input-icon" />
              <input
                id="kyc-national"
                type="text"
                maxLength={10}
                placeholder="۰۰۱۰۳۱۲۰۱۳"
                value={nationalCode}
                onChange={(e) => setNationalCode(e.target.value)}
                className="kyc-input-field"
                dir="ltr"
                required
              />
              {isNationalValid && (
                <CheckCircle2 size={16} className="kyc-field-valid-icon" />
              )}
            </div>
            {hasSubmitted && !isNationalValid ? (
              <span className="kyc-field-hint error">کد ملی نامعتبر است (رقم کنترل نامنطبق).</span>
            ) : isNationalValid ? (
              <span className="kyc-field-hint success">الگوریتم کد ملی منطبق با ثبت‌احوال تأیید شد.</span>
            ) : null}
          </div>

          {/* Submit Actions */}
          <div className="kyc-modal-actions">
            <button type="submit" className="btn-kyc-submit">
              <span>تأیید اطلاعات و ورود به سبد خرید</span>
              <span className="arrow" aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={closeKycModal}
              className="btn-kyc-cancel"
            >
              انصراف
            </button>
          </div>
        </form>

        {/* Security Footer Note */}
        <div className="kyc-modal-footer-note">
          <span>🔒 اطلاعات هویتی شما صرفاً جهت ثبت صورت‌حساب رسمی و قوانین بانکی پردازش می‌شود.</span>
        </div>
      </div>
    </div>
  );
}
