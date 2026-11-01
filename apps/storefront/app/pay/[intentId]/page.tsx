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
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [copiedCard, setCopiedCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(false);

  const isCardToCard = method === "CARD_TO_CARD";

  const handleCopyCard = () => {
    navigator.clipboard?.writeText("6219861012345678");
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const syncOrderStatus = (newStatus: "PAID" | "PENDING_REVIEW", refCode: string) => {
    try {
      const lastRaw = localStorage.getItem("commerce_os.checkout.lastOrder");
      if (lastRaw) {
        const last = JSON.parse(lastRaw);
        if (last.orderNumber === orderNum || !last.orderNumber) {
          last.status = newStatus;
          last.ref = refCode;
          localStorage.setItem("commerce_os.checkout.lastOrder", JSON.stringify(last));
        }
      }
      const allRaw = localStorage.getItem("commerce_os.account.orders.v1");
      if (allRaw) {
        const list = JSON.parse(allRaw);
        const idx = list.findIndex((o: any) => o.orderNumber === orderNum);
        if (idx !== -1) {
          list[idx].status = newStatus;
          list[idx].ref = refCode;
        } else {
          list.unshift({
            orderNumber: orderNum,
            status: newStatus,
            ref: refCode,
            totalTomans: String(total).replace(/\D/g, "") || "1200000",
            method: isCardToCard ? "کارت‌به‌کارت بانکی" : "درگاه الکترونیکی شاپرک",
            placedAt: new Date().toISOString(),
          });
        }
        localStorage.setItem("commerce_os.account.orders.v1", JSON.stringify(list));
      }
    } catch {
      // storage fallback
    }
  };

  const handleSimulatePayment = (success: boolean) => {
    if (success) {
      const refCode = `ZRP-${Date.now().toString().slice(-8)}`;
      syncOrderStatus("PAID", refCode);
      router.push(`/order/${orderNum}?status=PAID&ref=${refCode}`);
    } else {
      alert("پرداخت لغو شد. می‌توانید مجدداً از سبد خرید اقدام فرمایید.");
      router.push("/cart");
    }
  };

  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const refCode = `C2C-${refNumber || Date.now().toString().slice(-8)}`;
    setTimeout(() => {
      syncOrderStatus("PENDING_REVIEW", refCode);
      setIsSubmitting(false);
      setSubmittedReceipt(true);
      setTimeout(() => {
        router.push(`/order/${orderNum}?status=PENDING_REVIEW&ref=${refCode}`);
      }, 1500);
    }, 800);
  };

  return (
    <section className="payment-page-container" dir="rtl">
      <div className="payment-card">
        <div className="payment-header">
          <div className="eyebrow" style={{ fontSize: "0.85rem", color: "var(--brand)", fontWeight: 700, marginBottom: "6px" }}>
            درگاه پرداخت و تسویه‌حساب بانکی شاپرک
          </div>
          <h1>{isCardToCard ? "انتقال وجه کارت‌به‌کارت بانکی" : "درگاه الکترونیکی پرداخت شاپرک"}</h1>
          <p className="payment-order-info">
            شماره سفارش: <strong dir="ltr">{orderNum}</strong> | مبلغ قابل پرداخت:{" "}
            <strong>{new Intl.NumberFormat("fa-IR").format(Number(String(total).replace(/\D/g, "")) || 1200000)} تومان</strong>
          </p>
          <div style={{ marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "6px", background: "#f0fdfa", border: "1px solid #ccfbf1", padding: "4px 12px", borderRadius: "999px", fontSize: "0.76rem", color: "#0f766e" }}>
            <span style={{ fontWeight: 800 }}>۲–۸°C</span>
            <span>اقلام در انتظار تأیید پرداخت جهت خروج از سردخانه با پایش زنجیره سرد هستند</span>
          </div>
        </div>

        {isCardToCard ? (
          <div className="c2c-wrapper">
            <div className="bank-account-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="bank-badge">بانک سامان — شعبه مرکزی</div>
                <button
                  type="button"
                  onClick={handleCopyCard}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    color: "#ffffff",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  {copiedCard ? "✓ کپی شد" : "کپی کارت"}
                </button>
              </div>
              <div className="card-number-display" dir="ltr">
                ۶۲۱۹ - ۸۶۱۰ - ۱۲۳۴ - ۵۶۷۸
              </div>
              <div className="card-holder-row" style={{ marginBottom: "6px" }}>
                <span>صاحب حساب:</span> <strong>شرکت توسعه فناوری سلامت درمر (سهامی خاص)</strong>
              </div>
              <div className="sheba-row" dir="ltr">
                IR00 0560 0000 0000 1234 5678 90
              </div>
            </div>

            <form onSubmit={handleSubmitReceipt} className="c2c-form">
              <h3 style={{ fontSize: "1rem", color: "var(--brand-deep)", marginBottom: "16px" }}>
                ثبت مشخصات فیش واریزی
              </h3>
              <label className="form-field">
                <span>شماره پیگیری / شماره ارجاع فیش بانکی *</span>
                <input
                  type="text"
                  required
                  placeholder="مثال: ۹۸۷۶۵۴۳۲۱"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="input-text"
                  dir="ltr"
                />
              </label>

              <label className="form-field" style={{ marginTop: "12px" }}>
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

              {/* Receipt File Upload with Preview */}
              <div className="form-field" style={{ marginTop: "14px" }}>
                <span>تصویر فیش یا رسید انتقال وجه (اسکرین‌شات):</span>
                <div style={{ marginTop: "6px" }}>
                  <input
                    type="file"
                    id="pay-receipt-upload"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="pay-receipt-upload"
                    style={{
                      display: "block",
                      border: "1.5px dashed var(--line)",
                      padding: "14px",
                      borderRadius: "var(--radius-sm)",
                      textAlign: "center",
                      cursor: "pointer",
                      background: "var(--paper)",
                      fontSize: "0.84rem",
                      color: "var(--brand-deep)",
                    }}
                  >
                    {receiptFile ? `✓ فایل انتخاب شد: ${receiptFile.name}` : "📁 کلیک برای بارگذاری تصویر یا رسید بانکی"}
                  </label>
                  {receiptPreview && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={receiptPreview}
                        alt="پیش‌نمایش فیش"
                        style={{ maxHeight: "140px", borderRadius: "8px", border: "1px solid var(--line)" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {submittedReceipt ? (
                <div
                  className="success-banner"
                  style={{
                    background: "#ecfdf5",
                    color: "#047857",
                    padding: "12px",
                    borderRadius: "8px",
                    marginTop: "16px",
                    textAlign: "center",
                    fontWeight: 700,
                  }}
                >
                  ✓ فیش بانکی شما ثبت شد. در حال هدایت به صفحه رهگیری سفارش…
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-submit-order full-width"
                  style={{ marginTop: "18px" }}
                >
                  {isSubmitting ? "در حال ثبت فیش…" : "ثبت فیش و تایید نهایی سفارش"}
                </button>
              )}
            </form>
          </div>
        ) : (
          <div className="gateway-simulation-box">
            <div className="shaparak-logo-mark">💳 شاپرک</div>
            <p className="lead" style={{ fontSize: "0.92rem", color: "var(--ink)", lineHeight: 1.6 }}>
              این پنجره شبیه‌ساز امن درگاه پرداخت بانکی (سامان / پارسیان / زرین‌پال در شبکه شاپرک) است.
            </p>

            <div className="gateway-actions-row">
              <button onClick={() => handleSimulatePayment(true)} className="btn-pay-success">
                ✓ پرداخت موفق (شبیه‌سازی بازگشت شاپرک)
              </button>
              <button onClick={() => handleSimulatePayment(false)} className="btn-pay-cancel">
                ✕ انصراف از پرداخت و بازگشت به سبد
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
