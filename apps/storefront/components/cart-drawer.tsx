"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { useCart, CartItem } from "./cart";
import { useLocalizedFormatter } from "../lib/use-localized-formatter";
import { trackViewCart, trackBeginCheckout } from "../lib/analytics";

interface CrossSellProtocol {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  subtitle: string;
  sku: string;
  originalPriceRials: string;
  bundlePriceRials: string;
  discountBadge: string;
  clinicalRationale: string;
  targetTriggerMatch: (items: CartItem[]) => boolean;
}

const CLINICAL_CROSS_SELLS: CrossSellProtocol[] = [
  {
    id: "cross_carboxypod",
    variantId: "var_cpd_box5",
    productId: "prod_clinical_carboxypod",
    title: "پدهای فیبری فعال‌ساز CarboxyPod (بسته ۵ عددی)",
    subtitle: "مکمل رسمی ژل کربوکسی ری‌اسکین با اسید سیتریک کپسوله",
    sku: "RMD-CPD-005",
    originalPriceRials: "12500000", // 1,250,000 Tomans
    bundlePriceRials: "10625000", // 1,062,500 Tomans (15% Bundle Discount)
    discountBadge: "۱۵٪ تخفیف پروتکل ترکیبی",
    clinicalRationale:
      "هم‌افزایی بالینی اثر بوهر (Bohr Effect): فعال‌سازی پایدار CO2 و اکسیژن‌رسانی عمقی بدون اتلاف گاز",
    targetTriggerMatch: (items) => {
      // Suggest CarboxyPod if user has CarboxyGel and doesn't already have CarboxyPod
      const hasGel = items.some(
        (i) =>
          i.title.toLowerCase().includes("carboxy") ||
          i.title.includes("کربوکسی") ||
          i.sku.includes("CBG")
      );
      const hasPod = items.some(
        (i) =>
          i.title.toLowerCase().includes("pod") ||
          i.title.includes("پاد") ||
          i.sku.includes("CPD")
      );
      return hasGel && !hasPod;
    },
  },
  {
    id: "cross_healene",
    variantId: "var_hea_250ml",
    productId: "prod_drdermer_005",
    title: "ژل تسکین‌بخش و التیام‌دهنده هیلین Healene Soothing",
    subtitle: "تسکین فوری التهاب و ترمیم سد دفاعی اپیدرم",
    sku: "DD-HEA-250ML",
    originalPriceRials: "16000000", // 1,600,000 Tomans
    bundlePriceRials: "13600000", // 1,360,000 Tomans (15% Protocol Discount)
    discountBadge: "۱۵٪ تخفیف مراقبت پس از درمان",
    clinicalRationale:
      "پروتکل پست-تریتمنت: مهار ترشح اینترلوکین‌های التهابی و کاهش ۶۱٪ قرمزی اریتما در ۳۰ دقیقه اول",
    targetTriggerMatch: (items) => {
      // Suggest Healene if cart has any clinical item and doesn't have Healene
      const hasHealene = items.some(
        (i) =>
          i.title.toLowerCase().includes("healene") ||
          i.title.includes("هیلین") ||
          i.sku.includes("HEA")
      );
      return !hasHealene;
    },
  },
  {
    id: "cross_crystalene",
    variantId: "var_cry_200ml",
    productId: "prod_drdermer_004",
    title: "خمیر پولیش و لایه‌بردار کریستالین Crystalene",
    subtitle: "میکرودرم ابریشمی با کریستال‌های آلومینای خالص",
    sku: "DD-CRY-200ML",
    originalPriceRials: "14500000", // 1,450,000 Tomans
    bundlePriceRials: "12325000", // 1,232,500 Tomans (15% Bundle Discount)
    discountBadge: "۱۵٪ تخفیف آماده‌سازی بافت",
    clinicalRationale:
      "پاکسازی شاخی لایه استراتوم کورنئوم جهت افزایش ۴ برابری نفوذ ترکیبات مزوتراپی و کربوکسی",
    targetTriggerMatch: (items) => {
      const hasCrystalene = items.some(
        (i) =>
          i.title.toLowerCase().includes("crystalene") ||
          i.title.includes("کریستالین") ||
          i.sku.includes("CRY")
      );
      return !hasCrystalene;
    },
  },
];

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

  const [drawerCouponInput, setDrawerCouponInput] = useState("");
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

  // Find the most relevant clinical cross-sell recommendation
  const recommendedCrossSell = useMemo(() => {
    if (items.length === 0) return null;
    for (const cross of CLINICAL_CROSS_SELLS) {
      if (cross.targetTriggerMatch(items)) {
        return cross;
      }
    }
    return null;
  }, [items]);

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
        className="cart-drawer-panel"
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="drawer-title-group">
            <h3>سبد خرید</h3>
            <span className="drawer-items-count">({calculations.itemCount} قلم کالا)</span>
            {isSyncing && <span className="drawer-sync-pill">بررسی موجودی انبار…</span>}
          </div>
          <button
            onClick={closeDrawer}
            className="drawer-close-btn"
            aria-label="بستن سبد خرید"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Tiered Threshold Meter (1.5M Free Shipping + 3M VIP Consultation) */}
        <div className="tiered-threshold-container">
          <div className="tiered-header-status">
            <div className="tiered-status-headline">
              {tier2Achieved ? (
                <span className="tier-msg-vip">
                  <strong>تبریک ویژه!</strong> ارسال رایگان و مشاوره تخصصی رایگان با پزشک متخصص پوست فعال شد
                </span>
              ) : tier1Achieved ? (
                <span className="tier-msg-shipping">
                  ✓ <strong>ارسال رایگان پیشتاز فعال شد!</strong> فقط{" "}
                  {new Intl.NumberFormat("fa-IR").format(tier2Threshold - subtotalTomans)} تومان تا{" "}
                  <strong>مشاوره رایگان متخصص پوست</strong>
                </span>
              ) : (
                <span className="tier-msg-initial">
                  فقط{" "}
                  <strong>
                    {new Intl.NumberFormat("fa-IR").format(tier1Threshold - subtotalTomans)} تومان
                  </strong>{" "}
                  تا <strong>ارسال رایگان پیشتاز سراسری</strong>
                </span>
              )}
            </div>
          </div>

          <div className="tiered-progress-track" role="progressbar" aria-valuenow={meterPercentage} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={`tiered-progress-fill ${tier2Achieved ? "vip-complete" : tier1Achieved ? "free-complete" : ""}`}
              style={{ width: `${meterPercentage}%` }}
            />
            {/* Milestone Pins */}
            <div className={`milestone-pin pin-half ${tier1Achieved ? "reached" : ""}`}>
              <div className="pin-dot">{tier1Achieved ? "✓" : "۱"}</div>
              <span className="pin-label">ارسال رایگان (۱.۵ م)</span>
            </div>
            <div className={`milestone-pin pin-full ${tier2Achieved ? "reached" : ""}`}>
              <div className="pin-dot">{tier2Achieved ? "★" : "۲"}</div>
              <span className="pin-label">مشاوره VIP پوست (۳ م)</span>
            </div>
          </div>
        </div>

        {/* Cold-Chain Assurance Badge */}
        <div className="cart-cold-chain-banner">
          <div className="ccc-visual-icon">
            <span className="ccc-temp-badge">۲–۸°C</span>
          </div>
          <div className="ccc-content">
            <div className="ccc-title-row">
              <strong>تضمین پایش هوشمند زنجیره سرد (Cold-Chain)</strong>
              <span className="ccc-status-tag">کنترل کیفی فعال</span>
            </div>
            <p className="ccc-desc">
              ارسال در بسته‌بندی عایق ایزوترمال با ژل یخ دارویی و سنسور پایش حرارتی؛ تضمین ۱۰۰٪ پایداری پپتیدها و ماتریکس فعال بیولوژیک.
            </p>
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
              <div className="empty-cart-icon">[سبد خرید]</div>
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
            <>
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

              {/* Intelligent Clinical Cross-Sell Section */}
              {recommendedCrossSell && (
                <div className="cart-cross-sell-section">
                  <div className="cross-sell-header">
                    <span className="cross-sell-badge">{recommendedCrossSell.discountBadge}</span>
                    <strong className="cross-sell-title">هم‌افزایی بالینی پروتکل درمانی</strong>
                  </div>
                  <div className="cross-sell-card">
                    <div className="cross-sell-details">
                      <h5>{recommendedCrossSell.title}</h5>
                      <p className="cross-sell-subtitle">{recommendedCrossSell.subtitle}</p>
                      <p className="cross-sell-rationale">
                        <span className="rationale-tag">تحلیل بالینی:</span> {recommendedCrossSell.clinicalRationale}
                      </p>
                      <div className="cross-sell-pricing">
                        <div className="price-stack">
                          <span className="original-strike">{formatToman(recommendedCrossSell.originalPriceRials)}</span>
                          <strong className="bundle-price">{formatToman(recommendedCrossSell.bundlePriceRials)}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddCrossSell(recommendedCrossSell)}
                          className={`btn-add-cross-sell ${addedCrossSells[recommendedCrossSell.id] ? "added" : ""}`}
                          disabled={addedCrossSells[recommendedCrossSell.id]}
                        >
                          {addedCrossSells[recommendedCrossSell.id] ? "✓ اضافه شد" : "+ افزودن با تخفیف باندل"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
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
                  placeholder="کد تخفیف (مثال: WELCOME10 یا DERMER20)"
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
                  <span>تخفیف کل (پلکانی / کوپن):</span>
                  <span>- {formatMoney(calculations.discountRials, "IRR")}</span>
                </div>
              )}
              <div className="drawer-sum-row">
                <span>هزینه ارسال:</span>
                <span>
                  {calculations.isFreeShipping
                    ? "رایگان (پیشتاز سراسری)"
                    : formatMoney(calculations.shippingRials, "IRR")}
                </span>
              </div>
              {tier2Achieved && (
                <div className="drawer-sum-row vip-benefit">
                  <span>مشاوره VIP متخصص پوست:</span>
                  <span className="badge-vip-benefit">رایگان (هدیه خرید بالای ۳ م)</span>
                </div>
              )}
              <div className="drawer-sum-row total">
                <span>مبلغ قابل پرداخت:</span>
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
                تأیید سبد و ادامه به تسویه‌حساب ←
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="btn-drawer-view-cart"
              >
                مشاهده صفحه کامل سبد خرید
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
