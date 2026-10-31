"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "./cart";
import { formatToman } from "../lib/catalog";

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
  } = useCart();

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

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

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

        {/* Free Shipping Progress */}
        <div className="free-shipping-bar-container">
          <div className="free-shipping-text">
            <span>{calculations.freeShippingMessage}</span>
            {calculations.isFreeShipping && <span className="badge-free">رایگان</span>}
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
                      <span className="drawer-item-sku">کد: {item.sku}</span>
                      <div className="drawer-item-price">
                        {formatToman(item.priceAmount)}
                      </div>
                      <div className="drawer-item-actions">
                        <div className="drawer-qty-control">
                          <button
                            type="button"
                            onClick={() => setQty(item.variantId, item.qty + 1)}
                            className="qty-btn"
                            aria-label="افزایش تعداد"
                          >
                            +
                          </button>
                          <span className="qty-value">{item.qty}</span>
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

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="drawer-summary-rows">
              <div className="drawer-sum-row">
                <span>جمع قیمت کالاها:</span>
                <span>{new Intl.NumberFormat("fa-IR").format(calculations.subtotalTomans)} تومان</span>
              </div>
              {calculations.discountTomans > 0n && (
                <div className="drawer-sum-row discount">
                  <span>تخفیف کل:</span>
                  <span>- {new Intl.NumberFormat("fa-IR").format(calculations.discountTomans)} تومان</span>
                </div>
              )}
              <div className="drawer-sum-row">
                <span>هزینه ارسال:</span>
                <span>
                  {calculations.isFreeShipping
                    ? "رایگان"
                    : `${new Intl.NumberFormat("fa-IR").format(calculations.shippingTomans)} تومان`}
                </span>
              </div>
              <div className="drawer-sum-row total">
                <span>مبلغ نهایی:</span>
                <strong>{new Intl.NumberFormat("fa-IR").format(calculations.grandTotalTomans)} تومان</strong>
              </div>
            </div>

            <div className="drawer-action-buttons">
              <Link
                href="/checkout"
                onClick={closeDrawer}
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
