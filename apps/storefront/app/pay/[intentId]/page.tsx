"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const intentId = (params?.intentId as string) || "mock_intent";
  const orderNum = searchParams?.get("orderNum") || `ORD-${Date.now().toString().slice(-6)}`;
  const method = searchParams?.get("method") || "ZARINPAL";
  const total = searchParams?.get("total") || "1,200,000";

  const [refNumber, setRefNumber] = useState("");
  const [payerCard, setPayerCard] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(false);

  const isCardToCard = method === "CARD_TO_CARD";

  const handleSimulatePayment = (success: boolean) => {
    if (success) {
      router.push(`/order/${orderNum}?status=PAID&ref=ZRP-${Date.now().toString().slice(-8)}`);
    } else {
      alert("پرداخت لغو شد. می‌توانید مجدداً از سبد خرید اقدام فرمایید.");
      router.push("/cart");
    }
  };

  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedReceipt(true);
      setTimeout(() => {
        router.push(`/order/${orderNum}?status=PENDING_REVIEW&ref=C2C-${refNumber || Date.now()}`);
      }, 1500);
    }, 800);
  };

  return (
    <section className="payment-page-container">
      <div className="payment-card">
        <div className="payment-header">
          <div className="eyebrow">درگاه پرداخت و تسویه‌حساب بانکی</div>
          <h1>{isCardToCard ? "انتقال وجه کارت‌به‌کارت" : "درگاه الکترونیکی پرداخت شاپرک"}</h1>
          <p className="payment-order-info">
            شماره سفارش: <strong>{orderNum}</strong> | مبلغ قابل پرداخت:{" "}
            <strong>{new Intl.NumberFormat("fa-IR").format(Number(total) || 1200000)} تومان</strong>
          </p>
        </div>

        {isCardToCard ? (
          <div className="c2c-wrapper">
            <div className="bank-account-card">
              <div className="bank-badge">بانک سامان</div>
              <div className="card-number-display" dir="ltr">
                ۶۲۱۹ - ۸۶۱۰ - ۱۲۳۴ - ۵۶۷۸
              </div>
              <div className="card-holder-row">
                <span>صاحب حساب:</span>
                <strong>فروشگاه مرکزی کامرس او اس</strong>
              </div>
              <div className="sheba-row" dir="ltr">
                IR00 0560 0000 0000 1234 5678 90
              </div>
            </div>

            <form onSubmit={handleSubmitReceipt} className="c2c-form">
              <h3>ثبت مشخصات فیش واریزی</h3>
              <label className="form-field">
                <span>شماره پیگیری / شماره ارجاع فیش بانکی *</span>
                <input
                  type="text"
                  required
                  placeholder="مثال: ۹۸۷۶۵۴۳۲۱"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="input-text"
                />
              </label>

              <label className="form-field">
                <span>۴ رقم آخر کارت واریزکننده (اختیاری)</span>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="مثال: ۵۶۷۸"
                  value={payerCard}
                  onChange={(e) => setPayerCard(e.target.value)}
                  dir="ltr"
                  className="input-text"
                />
              </label>

              {submittedReceipt ? (
                <div className="success-banner">✓ فیش بانکی شما ثبت شد. در حال هدایت به سفارش…</div>
              ) : (
                <button type="submit" disabled={isSubmitting} className="btn-submit-order">
                  {isSubmitting ? "در حال ثبت فیش…" : "ثبت فیش و تایید نهایی سفارش"}
                </button>
              )}
            </form>
          </div>
        ) : (
          <div className="gateway-simulation-box">
            <div className="shaparak-logo-mark">💳 شاپرک</div>
            <p className="lead">
              این پنجره شبیه‌ساز امن درگاه پرداخت بانکی (زرین‌پال / شاپرک) در محیط توسعه است.
            </p>

            <div className="gateway-actions-row">
              <button onClick={() => handleSimulatePayment(true)} className="btn-pay-success">
                ✓ پرداخت موفق (شبیه‌سازی بازگشت شاپرک)
              </button>
              <button onClick={() => handleSimulatePayment(false)} className="btn-pay-cancel">
                ✕ انصراف از پرداخت
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
