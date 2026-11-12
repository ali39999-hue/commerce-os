"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  X,
  Truck,
  Sparkles,
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Tag,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useCart, CartItem } from "./cart";
import { useKyc } from "../lib/kyc-context";
import { useLocalizedFormatter } from "../lib/use-localized-formatter";
import { trackViewCart, trackBeginCheckout } from "../lib/analytics";
import { listProducts, type Product } from "../lib/catalog";
import { buildCrossSellsFromCatalog, CrossSellProtocol } from "../lib/cart";
import { EmptyCartWithXIcon } from "./empty-cart-icon";


function toPersianDigits(n: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

function formatPriceWithDots(tomans: number): string {
  const withDots = Math.round(tomans).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return toPersianDigits(withDots);
}

export function CartDrawer() {
  const {
    items,
    addItem,
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
  const { isKycVerified, openKycModal } = useKyc();

  const [drawerCouponInput, setDrawerCouponInput] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [addedCrossSells, setAddedCrossSells] = useState<Record<string, boolean>>({});

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

  const handleApplyDrawerCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponFeedback(null);
    if (!drawerCouponInput.trim()) {
      setCouponFeedback({
        type: "error",
        message: "لطفاً کد تخفیف را وارد کنید.",
      });
      return;
    }
    setCouponApplying(true);
    try {
      const res = await applyCoupon(drawerCouponInput);
      if (res.success) {
        setCouponFeedback({ type: "success", message: res.message });
        setDrawerCouponInput("");
      } else {
        setCouponFeedback({ type: "error", message: res.message });
      }
    } finally {
      setCouponApplying(false);
    }
  };

  const handleRemoveDrawerCoupon = () => {
    removeCoupon();
    setCouponFeedback(null);
  };

  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isDrawerOpen || catalogProducts.length > 0) return;
    let cancelled = false;
    listProducts({ limit: 100 }).then((res) => {
      if (!cancelled && res?.data) setCatalogProducts(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, [isDrawerOpen, catalogProducts.length]);

  const recommendedCrossSell = useMemo(() => {
    if (items.length === 0 || catalogProducts.length === 0) return null;
    return buildCrossSellsFromCatalog(catalogProducts, items)[0] ?? null;
  }, [items, catalogProducts]);

  const handleAddCrossSell = (cross: CrossSellProtocol) => {
    addItem(
      {
        variantId: cross.variantId,
        productId: cross.productId,
        title: cross.title,
        sku: cross.sku,
        priceAmount: cross.bundlePriceRials,
      },
      1
    );
    setAddedCrossSells((prev) => ({ ...prev, [cross.id]: true }));
    setTimeout(() => {
      setAddedCrossSells((prev) => ({ ...prev, [cross.id]: false }));
    }, 2500);
  };

  if (!isDrawerOpen) return null;

  // Dynamic Tier Progress calculations
  // Tier 1: 1.5M Tomans (Free Shipping) -> 50% mark
  // Tier 2: 3.0M Tomans (VIP Dermatologist Consultation) -> 100% mark
  const subtotalTomans = calculations.subtotalTomans;
  const tier1Threshold = 1_500_000n;
  const tier2Threshold = 3_000_000n;
  const tier1Achieved = subtotalTomans >= tier1Threshold;
  const tier2Achieved = subtotalTomans >= tier2Threshold;

  // Calculate percentage of bar (0 to 100)
  let meterPercentage = 0;
  if (subtotalTomans >= tier2Threshold) {
    meterPercentage = 100;
  } else if (subtotalTomans >= tier1Threshold) {
    const span = Number(tier2Threshold - tier1Threshold);
    const progressInSpan = Number(subtotalTomans - tier1Threshold);
    meterPercentage = 50 + Math.min(50, Math.round((progressInSpan / span) * 50));
  } else {
    const span = Number(tier1Threshold);
    const progressInSpan = Number(subtotalTomans);
    meterPercentage = Math.min(50, Math.round((progressInSpan / span) * 50));
  }

  return (
    <div className="cart-drawer-overlay" onClick={closeDrawer} aria-modal="true" role="dialog">
      <div
        className={`cart-drawer-panel ${items.length === 0 ? "is-empty" : ""}`}
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
        data-lenis-prevent
      >
        {/* ── 1. Clean Header (Matching Exact Reference Images 1 & 2) ── */}
        <div className="cart-drawer-header">
          <div className="drawer-title-group">
            <h3 className="drawer-title-heading">سبد خرید</h3>
            {isSyncing && <span className="drawer-sync-pill">بررسی موجودی…</span>}
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="drawer-close-red-x"
            aria-label="بستن سبد خرید"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        {/* ── 2. Server Sync Warnings ── */}
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

        {/* ── 3. Drawer Body ── */}
        <div className={`cart-drawer-body ${items.length === 0 ? "is-empty-body" : ""}`} data-lenis-prevent>
          {items.length === 0 ? (
            /* ── Pure Clean Empty State (Matching Exactly User Reference Image 2) ── */
            <div className="drawer-empty-state-clean">
              <EmptyCartWithXIcon className="empty-cart-illustration" size={170} />
              <h4 className="drawer-empty-heading-clean">سبد خرید خالی است</h4>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="btn-drawer-empty-shop"
              >
                <span>مشاهده فروشگاه</span>
                <span className="arrow" aria-hidden="true">←</span>
              </Link>
            </div>
          ) : (
            /* ── Clean Items List (Matching Exactly User Reference Image 1) ── */
            <div className="drawer-items-list-clean">
              {items.map((item) => {
                const unitPriceTomans = Number(BigInt(item.priceAmount) / 10n);
                return (
                  <div key={item.variantId} className="drawer-item-row">
                    {/* 1. Right: Thumbnail */}
                    <div className="drawer-item-thumbnail">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="drawer-item-img" />
                      ) : (
                        <span className="drawer-item-placeholder">{item.title.charAt(0)}</span>
                      )}
                    </div>

                    {/* 2. Middle: Title & Quantity x Price */}
                    <div className="drawer-item-info">
                      <h4 className="drawer-item-name" title={item.title}>
                        {item.title}
                      </h4>
                      <div className="drawer-item-pricing">
                        <span className="drawer-item-qty-price">
                          {toPersianDigits(item.qty)} × {formatPriceWithDots(unitPriceTomans)} تومان
                        </span>
                      </div>
                    </div>

                    {/* 3. Left: Circular Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      className="drawer-item-remove-circle"
                      aria-label={`حذف ${item.title}`}
                      title="حذف از سبد"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="m15 9-6 6" />
                        <path d="m9 9 6 6" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── 4. Footer Summary & Action Buttons (Matching Exactly User Reference Image 1) ── */}
        {items.length > 0 && (
          <div className="cart-drawer-footer-clean">
            {/* KYC Security Indicator */}
            <div className="drawer-kyc-status-row">
              {isKycVerified ? (
                <div className="drawer-kyc-tag verified">
                  <ShieldCheck size={14} />
                  <span>هویت تأیید شده (مجاز به خرید)</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    openKycModal("/cart");
                  }}
                  className="drawer-kyc-tag unverified"
                >
                  <AlertCircle size={14} />
                  <span>احراز هویت الزامی پیش از خرید (کلیک کنید)</span>
                </button>
              )}
            </div>

            {/* Total Price Row */}
            <div className="drawer-total-row">
              <span className="drawer-total-label">قیمت کل:</span>
              <span className="drawer-total-value">
                {formatPriceWithDots(Number(calculations.totalTomans))} تومان
              </span>
            </div>

            {/* Button 1: View Cart (Light Green Pill) */}
            <Link
              href="/cart"
              onClick={(e) => {
                if (!isKycVerified) {
                  e.preventDefault();
                  closeDrawer();
                  openKycModal("/cart");
                  return;
                }
                closeDrawer();
              }}
              className="btn-drawer-cart-view"
            >
              مشاهده سبد خرید
            </Link>

            {/* Button 2: Checkout Action (Dark Forest Green) */}
            <Link
              href="/checkout"
              onClick={(e) => {
                if (!isKycVerified) {
                  e.preventDefault();
                  closeDrawer();
                  openKycModal("/checkout");
                  return;
                }
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
              className="btn-drawer-checkout-action"
            >
              تسویه حساب
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
