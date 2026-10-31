"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "./cart";
import { useLocalizedFormatter } from "../lib/use-localized-formatter";
import { trackViewCart, trackBeginCheckout } from "../lib/analytics";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    setQty,
    removeItem,
    calculations,
    isSyncing,
    syncWarnings,
    clearSyncWarnings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { formatToman, formatMoney } = useLocalizedFormatter();

  const [drawerCouponInput, setDrawerCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll and track view_cart when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      if (items.length > 0) {
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
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, items, calculations.totalRials]);

  const handleApplyDrawerCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponFeedback(null);
    if (!drawerCouponInput.trim()) {
      setCouponFeedback({
        type: "error",
        message: "لطفاً کد تخفیف را وارد کنید.",
      });
      return;
    }
    const res = applyCoupon(drawerCouponInput);
    if (res.success) {
      setCouponFeedback({ type: "success", message: res.message });
      setDrawerCouponInput("");
    } else {
      setCouponFeedback({ type: "error", message: res.message });
    }
  };

  const handleRemoveDrawerCoupon = () => {
    removeCoupon();
    setCouponFeedback(null);
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={closeDrawer} aria-modal="true" role="dialog">
      <div
        className="cart-drawer-panel"
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="cart-drawer-header">
          <div className="drawer-title-group">
            <h3>سبد خرید</h3>
            <span className="drawer-items-count">({calculations.itemCount} قلم کالا)</span>
            {isSyncing && <span className="drawer-sync-pill">بررسی موجودی…</span>}
          </div>
          <button
            onClick={closeDrawer}
            className="drawer-close-btn"
            aria-label="بستن سبد خرید"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress with Celebratory Badge */}
        <div className="free-shipping-bar-container">
          <div className="free-shipping-text">
            <span>
              {calculations.isFreeShipping ? (
                <strong className="shipping-unlocked-text">
                  🎉 تبریک! ارسال این سفارش رایگان شد
                </strong>
              ) : (
                calculations.freeShippingMessage
              )}
            </span>
            {calculations.isFreeShipping ? (
              <span className="badge-free celebratory">ارسال رایگان فعال شد</span>
            ) : (
              <span className="badge-free">پیشتاز سراسری</span>
            )}
          </div>
          <div
            className="free-shipping-track"
            role="progressbar"
            aria-valuenow={calculations.freeShippingProgressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`free-shipping-fill ${calculations.isFreeShipping ? "complete" : ""}`}
              style={{ width: `${calculations.freeShippingProgressPct}%` }}
            />
          </div>
        </div>

        {/* Server Sync Warnings */}
        {syncWarnings.length > 0 && (
          <div className="cart-drawer-warnings">
            <div className="warning-head">
              <span>اطلاعیه انبار و قیمت:</span>
              <button onClick={clearSyncWarnings} className="btn-dismiss-warning">
                متوجه شدم
              </button>
            </div>
            <ul>
              {syncWarnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Drawer Content */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-cart-icon">🛒</div>
              <h4>سبد خرید شما در حال حاضر خالی است</h4>
              <p>کالاهای تخصصی درمانی و مراقبت بالینی پوست را به سبد خود اضافه کنید.</p>
              <button
                onClick={closeDrawer}
                className="btn-back-to-shop"
              >
                مشاهده محصولات فروشگاه
              </button>
            </div>
          ) : (
            <div className="drawer-items-list">
              {items.map((item) => {
                const lineTotalRials = BigInt(item.priceAmount) * BigInt(item.qty);
                return (
                  <div key={item.variantId} className="drawer-item-card">
                    <div className="drawer-item-thumb">
                      <span>{item.title.charAt(0)}</span>
                    </div>
                    <div className="drawer-item-details">
                      <h4>{item.title}</h4>
                      <div className="drawer-item-meta">
                        <span className="drawer-item-sku">کد کالا: {item.sku}</span>
                      </div>
                      <div className="drawer-item-price">
                        قیمت واحد: {formatToman(item.priceAmount)}
                      </div>
                      <div className="drawer-item-actions">
                        <div className="drawer-qty-control" aria-label="تنظیم تعداد کالا">
                          <button
                            type="button"
                            onClick={() => setQty(item.variantId, item.qty + 1)}
                            className="qty-btn"
                            aria-label="افزایش تعداد"
                          >
                            +
                          </button>
                          <span className="qty-value" aria-live="polite">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.variantId, item.qty - 1)}
                            className="qty-btn"
                            aria-label="کاهش تعداد"
                          >
                            -
                          </button>
                        </div>
                        <strong className="drawer-line-total">
                          {formatToman(lineTotalRials)}
                        </strong>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="drawer-item-remove"
                          title="حذف از سبد"
                          aria-label={`حذف ${item.title}`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Summary & Coupon Section */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Drawer Coupon Input */}
            <div className="drawer-coupon-box">
              <form onSubmit={handleApplyDrawerCoupon} className="drawer-coupon-form">
                <input
                  type="text"
                  placeholder="کد تخفیف (مثال: WELCOME10)"
                  value={drawerCouponInput}
                  onChange={(e) => setDrawerCouponInput(e.target.value)}
                  className="input-text drawer-coupon-input"
                  disabled={Boolean(appliedCoupon)}
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveDrawerCoupon}
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
                  className={`drawer-coupon-feedback ${
                    couponFeedback.type === "success" ? "success" : "error"
                  }`}
                >
                  {couponFeedback.message}
                </div>
              )}

              {appliedCoupon && (
                <div className="active-coupon-tag drawer-active-coupon">
                  <span>کوپن فعال: {appliedCoupon}</span>
                </div>
              )}
            </div>

            <div className="drawer-summary-rows">
              <div className="drawer-sum-row">
                <span>جمع قیمت کالاها:</span>
                <span>{formatMoney(calculations.subtotalRials, "IRR")}</span>
              </div>
              {calculations.discountTomans > 0n && (
                <div className="drawer-sum-row discount">
                  <span>تخفیف کل:</span>
                  <span>- {formatMoney(calculations.discountRials, "IRR")}</span>
                </div>
              )}
              <div className="drawer-sum-row">
                <span>هزینه ارسال:</span>
                <span>
                  {calculations.isFreeShipping
                    ? "رایگان (پیشتاز)"
                    : formatMoney(calculations.shippingRials, "IRR")}
                </span>
              </div>
              <div className="drawer-sum-row total">
                <span>مبلغ نهایی:</span>
                <strong>{formatMoney(calculations.totalRials, "IRR")}</strong>
              </div>
            </div>

            <div className="drawer-action-buttons">
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
                  closeDrawer();
                }}
                className="btn-drawer-checkout"
              >
                ادامه و ثبت سفارش
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="btn-drawer-view-cart"
              >
                مشاهده کامل سبد خرید
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
