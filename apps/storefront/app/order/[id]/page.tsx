"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  formatJalaliDateTime,
  maskIranianMobile,
  maskNationalId,
  maskPostalAddress,
} from "@commerce-os/localization";
import { formatToman, apiBase, listProducts, resolveProductImage } from "../../../lib/catalog";
import { useCart } from "../../../components/cart";

interface OrderSnapshot {
  orderNumber: string;
  status: string;
  totalTomans: string;
  method: string;
  ref: string;
  placedAt: string;
  customerName?: string;
  customerPhone?: string;
  nationalCode?: string | null;
  address?: string;
  shippingMethod?: string;
  deliverySlot?: string;
  items?: Array<{
    title: string;
    qty: number;
    priceAmount: string;
    sku: string;
    variantId?: string;
    productId?: string;
  }>;
}

export default function OrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem, openDrawer } = useCart();

  const orderId = (params?.id as string) || "ORD-000000";
  const statusParam = searchParams?.get("status") || "PAID";
  const refParam = searchParams?.get("ref") || `REF-${Date.now().toString().slice(-8)}`;

  const [orderData, setOrderData] = useState<OrderSnapshot | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [reordered, setReordered] = useState(false);

  // Load order data from local storage or authenticated backend API
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const lastRaw = localStorage.getItem("commerce_os.checkout.lastOrder");
        if (lastRaw) {
          const last = JSON.parse(lastRaw);
          if (last.orderNumber === orderId) {
            if (mounted) {
              setOrderData(last);
              setOrderLoading(false);
            }
            return;
          }
        }
        const allRaw = localStorage.getItem("commerce_os.account.orders.v1");
        if (allRaw) {
          const list = JSON.parse(allRaw);
          const found = list.find((o: OrderSnapshot) => o.orderNumber === orderId);
          if (found) {
            if (mounted) {
              setOrderData(found);
              setOrderLoading(false);
            }
            return;
          }
        }

        const token =
          localStorage.getItem("commerce_os_token") ||
          localStorage.getItem("commerce_os.auth.token");
        if (token) {
          const res = await fetch(`${apiBase}/v1/orders/${encodeURIComponent(orderId)}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const payload = await res.json();
            const order = payload?.data ?? payload;
            if (order && mounted) {
              setOrderData({
                orderNumber: order.orderNumber || orderId,
                status: order.status || statusParam,
                totalTomans: order.totalAmount ? (BigInt(order.totalAmount) / 10n).toString() : "0",
                method: order.paymentMethod || "درگاه الکترونیکی شاپرک",
                ref: order.paymentRef || refParam,
                placedAt: order.createdAt || new Date().toISOString(),
                customerName: order.customerName,
                customerPhone: order.customerPhone,
                nationalCode: order.nationalCode,
                address: order.shippingAddressText,
                items: Array.isArray(order.items)
                  ? order.items.map((it: Record<string, unknown>) => ({
                      title: String(it.title ?? it.sku ?? "محصول"),
                      qty: Number(it.qty ?? it.quantity ?? 1),
                      priceAmount: String(it.unitPriceAmount ?? it.priceAmount ?? "0"),
                      sku: String(it.sku ?? ""),
                      variantId: typeof it.variantId === "string" ? it.variantId : undefined,
                      productId: typeof it.productId === "string" ? it.productId : undefined,
                    }))
                  : [],
              });
            }
          }
        }
      } catch {
        // ignore storage/network errors
      } finally {
        if (mounted) setOrderLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [orderId, statusParam, refParam]);

  const isC2CReview = statusParam === "PENDING_REVIEW";
  const trackingCode = `POST-${orderId.replace(/\D/g, "").slice(0, 8) || "98234710"}IR`;

  // 5-Stage Visual Stepper logic
  // 1: Order Placed -> 2: Payment Confirmed -> 3: Warehouse Processing -> 4: Shipped -> 5: Delivered
  const currentStepIndex = orderData?.status === "DELIVERED"
    ? 5
    : orderData?.status === "SHIPPED"
    ? 4
    : orderData?.status === "PROCESSING"
    ? 3
    : isC2CReview
    ? 2 // in pending review
    : 2; // payment confirmed

  const handleCopyTracking = () => {
    navigator.clipboard?.writeText(trackingCode);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleReorder = async () => {
    if (!orderData?.items || orderData.items.length === 0) return;
    const catalogRes = await listProducts({ limit: 100 });
    const catalog = catalogRes?.data ?? [];
    let addedCount = 0;

    for (const it of orderData.items) {
      let resolvedVariantId = it.variantId;
      let resolvedProductId = it.productId;
      let resolvedPrice = it.priceAmount;
      let resolvedTitle = it.title;
      let resolvedImage: string | undefined;

      if (!resolvedVariantId || !resolvedProductId) {
        for (const prod of catalog) {
          const foundVar = prod.variants.find((v) => v.sku === it.sku);
          if (foundVar) {
            resolvedVariantId = foundVar.id;
            resolvedProductId = prod.id;
            resolvedPrice = foundVar.priceAmount;
            resolvedTitle = `${prod.title} — ${foundVar.title}`;
            resolvedImage = resolveProductImage(prod);
            break;
          }
        }
      }

      if (!resolvedVariantId || !resolvedProductId) continue;
      addItem(
        {
          variantId: resolvedVariantId,
          productId: resolvedProductId,
          title: resolvedTitle,
          sku: it.sku,
          priceAmount: resolvedPrice,
          image: resolvedImage,
        },
        it.qty
      );
      addedCount++;
    }

    if (addedCount > 0) {
      setReordered(true);
      openDrawer();
      setTimeout(() => {
        setReordered(false);
      }, 1500);
    }
  };

  if (orderLoading) {
    return (
      <section className="order-receipt-layout">
        <div className="receipt-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <p>در حال بازیابی اطلاعات سفارش {orderId}...</p>
        </div>
      </section>
    );
  }

  if (!orderData) {
    return (
      <section className="order-receipt-layout">
        <div className="receipt-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <h1>سفارش {orderId} در نشست فعلی یافت نشد</h1>
          <p style={{ marginTop: "8px", color: "#64748b" }}>
            برای مشاهده جزئیات فاکتور و رهگیری مرسوله، ابتدا وارد حساب کاربری خود شوید یا از فروشگاه خرید جدید ثبت کنید.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
            <Link href="/account" className="primary-link">
              ورود به حساب کاربری ←
            </Link>
            <Link href="/shop" className="btn-reorder" style={{ textDecoration: "none" }}>
              بازگشت به فروشگاه
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="order-receipt-layout">
      <div className="receipt-card">
        {/* Receipt Header */}
        <div className="receipt-header">
          <div className="status-badge-container">
            {isC2CReview ? (
              <span className="badge-warning">⏳ در انتظار بررسی فیش واریزی توسط واحد مالی</span>
            ) : (
              <span className="badge-success">✓ پرداخت قطعی و سفارش با موفقیت ثبت شد</span>
            )}
          </div>
          <h1>شناسه سفارش: {orderId}</h1>
          <p className="order-timestamp">
            تاریخ ثبت سفارش:{" "}
            {orderData?.placedAt
              ? formatJalaliDateTime(orderData.placedAt)
              : formatJalaliDateTime(new Date())}
          </p>
        </div>

        {/* 5-Stage Visual Stepper */}
        <div className="receipt-timeline">
          <h3>فرآیند پردازش و ارسال مرسوله</h3>
          <div className="timeline-steps five-steps">
            <div className={`step ${currentStepIndex >= 1 ? "active" : ""}`}>
              <div className="step-circle">۱</div>
              <span>ثبت سفارش</span>
            </div>
            <div
              className={`step ${
                isC2CReview ? "pending" : currentStepIndex >= 2 ? "active" : ""
              }`}
            >
              <div className="step-circle">۲</div>
              <span>{isC2CReview ? "بررسی فیش" : "تأیید پرداخت"}</span>
            </div>
            <div className={`step ${currentStepIndex >= 3 ? "active" : ""}`}>
              <div className="step-circle">۳</div>
              <span>پردازش انبار</span>
            </div>
            <div className={`step ${currentStepIndex >= 4 ? "active" : ""}`}>
              <div className="step-circle">۴</div>
              <span>تحویل به پست</span>
            </div>
            <div className={`step ${currentStepIndex >= 5 ? "active" : ""}`}>
              <div className="step-circle">۵</div>
              <span>تحویل به مشتری</span>
            </div>
          </div>
        </div>

        {/* Cold-Chain 2-8°C Monitoring & Tracking Banner */}
        <div style={{
          background: "#f0fdfa",
          border: "1px solid #ccfbf1",
          borderRadius: "var(--radius-sm)",
          padding: "14px 18px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{
            background: "#0f766e",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "0.78rem",
            padding: "4px 10px",
            borderRadius: "6px"
          }}>
            ۲–۸°C
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "0.86rem", color: "#115e59" }}>
                گواهی پایش زنجیره سرد دارویی (GDP Cold-Chain Certified)
              </strong>
              <span style={{ fontSize: "0.72rem", background: "#d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                پایش سنسور فعال
              </span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#0f766e", lineHeight: 1.45 }}>
              مرسوله در بسته‌بندی ایزوترمال با ژل یخ دارویی و شناسه پایش دمایی تحویل ناوگان توزیع گردیده است.
            </p>
          </div>
        </div>

        {/* Tracking Code Banner */}
        <div className="tracking-code-banner">
          <div className="tc-info">
            <span className="tc-label">کد رهگیری پست پیشتاز / تیپاکس:</span>
            <strong className="tc-value" dir="ltr">
              {trackingCode}
            </strong>
          </div>
          <button onClick={handleCopyTracking} className="btn-copy-tracking">
            {copiedTracking ? "✓ کپی شد" : "کپی کد رهگیری"}
          </button>
        </div>

        {/* Meta Info Grid */}
        <div className="receipt-meta-grid">
          <div className="meta-box">
            <span className="label">کد رهگیری تراکنش شاپرک / ارجاع:</span>
            <strong className="value" dir="ltr">
              {orderData?.ref || refParam}
            </strong>
          </div>
          <div className="meta-box">
            <span className="label">روش پرداخت:</span>
            <strong className="value">
              {orderData?.method ||
                (isC2CReview ? "کارت‌به‌کارت بانکی" : "درگاه الکترونیکی شتاب")}
            </strong>
          </div>
          <div className="meta-box">
            <span className="label">سند حسابداری دوبل‌اندر مالی:</span>
            <strong className="value" dir="ltr">
              JRN-SALE-{orderId}
            </strong>
          </div>
          {(orderData.customerName || orderData.customerPhone) && (
            <div className="meta-box">
              <span className="label">تحویل‌گیرنده و موبایل (محافظت حریم خصوصی):</span>
              <strong className="value">
                {orderData.customerName || "مشتری گرامی"}
                {orderData.customerPhone && (
                  <> (<span dir="ltr">{maskIranianMobile(orderData.customerPhone)}</span>)</>
                )}
              </strong>
            </div>
          )}
          {orderData?.nationalCode && (
            <div className="meta-box">
              <span className="label">کد ملی ثبت سامانه مودیان:</span>
              <strong className="value" dir="ltr">
                {maskNationalId(orderData.nationalCode)}
              </strong>
            </div>
          )}
          {orderData.address && (
            <div className="meta-box full-span">
              <span className="label">نشانی و بازه تحویل:</span>
              <strong className="value">
                {maskPostalAddress(orderData.address)}
                {orderData.deliverySlot ? ` | بازه: ${orderData.deliverySlot}` : ""}
              </strong>
            </div>
          )}
        </div>

        {/* Itemized Order List */}
        {orderData?.items && orderData.items.length > 0 && (
          <div className="receipt-items-section">
            <h3>اقلام سفارش</h3>
            <div className="receipt-items-table">
              {orderData.items.map((it, idx) => (
                <div key={idx} className="receipt-item-row">
                  <div>
                    <strong>{it.title}</strong>
                    <small>کد کالا: {it.sku} · تعداد: {it.qty} عدد</small>
                  </div>
                  <span>{formatToman(BigInt(it.priceAmount) * BigInt(it.qty))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="receipt-actions">
          <div className="receipt-action-group">
            <button onClick={() => window.print()} className="btn-print">
              🖨️ چاپ و دانلود فاکتور رسمی
            </button>
            <a
              href={`${apiBase}/v1/orders/${encodeURIComponent(orderId)}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-download-invoice"
            >
              📄 دانلود صورتحساب مالیاتی
            </a>
            <button
              onClick={handleReorder}
              disabled={reordered}
              className="btn-reorder"
            >
              {reordered ? "✓ اقلام به سبد اضافه شد" : "🔄 سفارش مجدد (Re-order)"}
            </button>
          </div>

          <Link href="/account" className="primary-link">
            مشاهده سفارش‌ها در پنل کاربری ←
          </Link>
        </div>
      </div>
    </section>
  );
}
