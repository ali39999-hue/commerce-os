"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../../components/cart";
import { useLocalizedFormatter } from "../../lib/use-localized-formatter";
import { trackViewCart, trackBeginCheckout } from "../../lib/analytics";

export default function CartPage() {
  const {
    items,
    setQty,
    removeItem,
    clearCart,
    isReady,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    calculations,
    isSyncing,
    syncWarnings,
    clearSyncWarnings,
  } = useCart();
  const { formatToman, formatMoney } = useLocalizedFormatter();

  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [couponFeedback, setCouponFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isReady && items.length > 0) {
      trackViewCart(
        items.map((i) => ({
          item_id: i.productId,
          item_name: i.title,
          item_variant: i.variantId,
          sku: i.sku,
          price: Number(i.priceAmount) || 0,
          quantity: i.qty,
          currency: "IRR",
        })),
        Number(calculations.totalRials) || 0,
        "IRR"
      );
    }
  }, [isReady, items, calculations.totalRials]);

  if (!isReady) {
    return (
      <div className="state-panel loading-state">
        <div className="spinner"></div>
        <p>در حال همگام‌سازی و بارگذاری سبد خرید نسخه…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="state-panel empty-cart-box">
        <div className="empty-cart-graphic" aria-hidden="true">🛒</div>
        <h2>سبد خرید و نسخه شما خالی است</h2>
        <p>
          هنوز هیچ محصول مراقبت بالینی، کربوکسی‌تراپی یا ملزومات کلینیکال به سبد خود
          اضافه نکرده‌اید.
        </p>
        <Link href="/#catalog" className="primary-link">
          مشاهده کاتالوگ درمانی و محصولات ReeSkin & ReeMed
        </Link>
      </section>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponFeedback(null);
    if (!couponInput.trim()) {
      setCouponFeedback({
        type: "error",
        message: "لطفاً کد تخفیف را وارد کنید.",
      });
      return;
    }
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ type: "success", message: res.message });
    } else {
      setCouponFeedback({ type: "error", message: res.message });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput("");
    setCouponFeedback(null);
  };

  return (
    <section className="cart-page-layout">
      <div className="cart-items-column">
        {/* Header & Clear */}
        <div className="cart-header-row">
          <div>
            <h1>سبد خرید نسخه ({calculations.itemCount} کالا)</h1>
            {isSyncing && <span className="sync-badge">در حال بررسی موجودی زنده…</span>}
          </div>
          <button onClick={clearCart} className="btn-text-danger">
            پاک کردن کل سبد
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="free-shipping-card">
          <div className="free-shipping-info">
            <span className="free-shipping-title">
              {calculations.isFreeShipping ? (
                <strong className="shipping-unlocked-text">
                  🎉 تبریک! ارسال سفارش شما کاملاً رایگان شد
                </strong>
              ) : (
                calculations.freeShippingMessage
              )}
            </span>
            {calculations.isFreeShipping ? (
              <span className="free-shipping-qualified celebratory">ارسال رایگان پیشتاز فعال شد</span>
            ) : (
              <span className="free-shipping-qualified">پست پیشتاز سراسری</span>
            )}
          </div>
          <div
            className="free-shipping-progress"
            role="progressbar"
            aria-valuenow={calculations.freeShippingProgressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`progress-fill ${calculations.isFreeShipping ? "free" : ""}`}
              style={{ width: `${calculations.freeShippingProgressPct}%` }}
            />
          </div>
          <small className="free-shipping-hint">
            سقف خرید برای ارسال رایگان پیشتاز سراسری: ۳,۰۰۰,۰۰۰ تومان
          </small>
        </div>

        {/* Server Sync / Stock Warnings */}
        {syncWarnings.length > 0 && (
          <div className="cart-sync-warnings">
            <div className="warning-header">
              <strong>توجه به آخرین تغییرات انبار و قیمت:</strong>
              <button onClick={clearSyncWarnings} className="btn-close-notice">
                بستن اعلان
              </button>
            </div>
            <ul>
              {syncWarnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Items List */}
        <div className="cart-items-list">
          {items.map((item) => {
            const lineTotalRials = BigInt(item.priceAmount) * BigInt(item.qty);
            return (
              <div key={item.variantId} className="cart-item-card">
                <div className="cart-item-art">
                  <span>{item.title.slice(0, 1)}</span>
                </div>
                <div className="cart-item-info">
                  <h3>{item.title}</h3>
                  <div className="sku-tag">کد کالا: {item.sku}</div>
                  <div className="price-unit">
                    قیمت پایه: {formatToman(item.priceAmount)}
                  </div>
                  {item.qty >= 3 && (
                    <span className="volume-discount-tag">
                      {item.qty >= 6 ? "۸٪ تخفیف پلکانی تعداد" : "۵٪ تخفیف پلکانی تعداد"}
                    </span>
                  )}
                </div>

                <div className="cart-qty-control">
                  <button
                    onClick={() => setQty(item.variantId, item.qty + 1)}
                    className="qty-btn"
                    aria-label="افزایش تعداد"
                  >
                    +
                  </button>
                  <span className="qty-value">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.variantId, item.qty - 1)}
                    className="qty-btn"
                    aria-label="کاهش تعداد"
                  >
                    -
                  </button>
                </div>

                <div className="cart-line-total">
                  <strong>{formatToman(lineTotalRials)}</strong>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="btn-remove"
                    title="حذف کالا"
                    aria-label={`حذف ${item.title}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <aside className="cart-summary-column">
        <div className="summary-card">
          <h2>خلاصه پیش‌فاکتور</h2>

          {/* Coupon Code Section */}
          <form onSubmit={handleApplyCoupon} className="coupon-box">
            <input
              type="text"
              placeholder="کد تخفیف (مثال: OFF10 یا WELCOME10)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="input-text"
              disabled={Boolean(appliedCoupon)}
            />
            {appliedCoupon ? (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="btn-coupon remove"
              >
                حذف
              </button>
            ) : (
              <button type="submit" className="btn-coupon">
                اعمال
              </button>
            )}
          </form>

          {couponFeedback && (
            <div
              className={`coupon-feedback-message ${
                couponFeedback.type === "success" ? "success" : "error"
              }`}
            >
              {couponFeedback.message}
            </div>
          )}

          {appliedCoupon && (
            <div className="active-coupon-tag">
              <span>کوپن فعال: {appliedCoupon}</span>
            </div>
          )}

          <div className="summary-rows">
            <div className="summary-row">
              <span>جمع قیمت کالاها:</span>
              <span>{formatMoney(calculations.subtotalRials, "IRR")}</span>
            </div>

            {calculations.discounts.map((d, index) => (
              <div key={index} className="summary-row discount">
                <span>{d.title}:</span>
                <span>- {formatMoney(d.amountRials, "IRR")}</span>
              </div>
            ))}

            <div className="summary-row">
              <span>مالیات بر ارزش افزوده (۱۰٪ قانونی):</span>
              <span>{formatMoney(calculations.vatRials, "IRR")}</span>
            </div>

            <div className="summary-row">
              <span>هزینه ارسال پیش‌فرض:</span>
              <span>
                {calculations.isFreeShipping
                  ? "رایگان (خرید بیش از سقف)"
                  : formatMoney(calculations.shippingRials, "IRR")}
              </span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row total">
              <span>مبلغ نهایی پیش‌فاکتور:</span>
              <strong>{formatMoney(calculations.totalRials, "IRR")}</strong>
            </div>
          </div>

          <Link
            href="/checkout"
            onClick={() => {
              trackBeginCheckout(
                items.map((i) => ({
                  item_id: i.productId,
                  item_name: i.title,
                  item_variant: i.variantId,
                  sku: i.sku,
                  price: Number(i.priceAmount) || 0,
                  quantity: i.qty,
                  currency: "IRR",
                })),
                Number(calculations.totalRials) || 0,
                appliedCoupon || undefined,
                "IRR"
              );
            }}
            className="btn-checkout"
          >
            ادامه فرآیند خرید و پرداخت ←
          </Link>

          <p className="summary-note">
            محاسبه قطعی و صدور شناسه جلسه تسویه‌حساب با رزرو موجودی ۱۵ دقیقه‌ای بر روی سرور انجام می‌شود.
          </p>
        </div>
      </aside>
    </section>
  );
}
