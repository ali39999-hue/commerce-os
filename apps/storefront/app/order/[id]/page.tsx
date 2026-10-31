"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatJalaliDateTime } from "@commerce-os/localization";

export default function OrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const orderId = (params?.id as string) || "ORD-000000";
  const statusParam = searchParams?.get("status") || "PAID";
  const refParam = searchParams?.get("ref") || `REF-${Date.now().toString().slice(-8)}`;

  const isC2CReview = statusParam === "PENDING_REVIEW";

  return (
    <section className="order-receipt-layout">
      <div className="receipt-card">
        <div className="receipt-header">
          <div className="status-badge-container">
            {isC2CReview ? (
              <span className="badge-warning">در انتظار بررسی فیش توسط اپراتور</span>
            ) : (
              <span className="badge-success">✓ پرداخت موفق و سفارش ثبت شد</span>
            )}
          </div>
          <h1>سفارش {orderId}</h1>
          <p className="order-timestamp">تاریخ ثبت: {formatJalaliDateTime(new Date())}</p>
        </div>

        <div className="receipt-meta-grid">
          <div className="meta-box">
            <span className="label">کد رهگیری تراکنش / ارجاع:</span>
            <strong className="value" dir="ltr">
              {refParam}
            </strong>
          </div>
          <div className="meta-box">
            <span className="label">روش پرداخت:</span>
            <strong className="value">
              {isC2CReview ? "کارت‌به‌کارت بانکی" : "درگاه الکترونیکی شتاب (شاپرک)"}
            </strong>
          </div>
          <div className="meta-box">
            <span className="label">سند حسابداری دفترکل:</span>
            <strong className="value" dir="ltr">
              JRN-SALE-{orderId}
            </strong>
          </div>
          <div className="meta-box">
            <span className="label">وضعیت ارسال:</span>
            <strong className="value">در نوبت بسته‌بندی و تحویل به پست/تیپاکس</strong>
          </div>
        </div>

        <div className="receipt-timeline">
          <h3>مراحل پیگیری سفارش</h3>
          <div className="timeline-steps">
            <div className="step active">
              <div className="step-circle">۱</div>
              <span>ثبت سفارش</span>
            </div>
            <div className={`step ${isC2CReview ? "pending" : "active"}`}>
              <div className="step-circle">۲</div>
              <span>{isC2CReview ? "بررسی فیش" : "پرداخت موفق"}</span>
            </div>
            <div className="step">
              <div className="step-circle">۳</div>
              <span>تخصیص انبار</span>
            </div>
            <div className="step">
              <div className="step-circle">۴</div>
              <span>تحویل به پست</span>
            </div>
            <div className="step">
              <div className="step-circle">۵</div>
              <span>تحویل به خریدار</span>
            </div>
          </div>
        </div>

        <div className="receipt-actions">
          <button onClick={() => window.print()} className="btn-print">
            🖨️ چاپ فاکتور رسمی
          </button>
          <Link href="/" className="primary-link">
            بازگشت به صفحه اصلی فروشگاه
          </Link>
        </div>
      </div>
    </section>
  );
}
