"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "../../components/cart";
import { useLocalizedFormatter } from "../../lib/use-localized-formatter";
import { trackViewCart, trackBeginCheckout } from "../../lib/analytics";
import { CLINICAL_CROSS_SELLS, CrossSellProtocol } from "../../lib/cart";

export default function CartPage() {
  const {
    items,
    addItem,
    setQty,
    removeItem,
    clearCart,
    isReady,
    couponCode,
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

  const [addedCrossSells, setAddedCrossSells] = useState<Record<string, boolean>>({});

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

  // Find recommended clinical cross-sell protocol
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
      <section className="state-panel empty-cart-box" style={{ maxWidth: '640px', margin: '60px auto', textAlign: 'center', padding: '48px 24px' }}>
        <div className="empty-cart-graphic" aria-hidden="true" style={{ width: "64px", height: "64px", margin: "0 auto 16px", color: "var(--brand)" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px', color: 'var(--ink)' }}>سبد خرید و نسخه شما خالی است</h2>
        <p style={{ color: 'var(--muted)', lineHeight: '1.8', marginBottom: '28px' }}>
          هنوز هیچ محصول مراقبت بالینی، کربوکسی‌تراپی یا ملزومات کلینیکال به سبد نسخه خود اضافه نکرده‌اید. برای شروع درمان، از کاتالوگ محصولات دیدن فرمایید.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/#featured-products" className="primary-link" style={{ background: 'var(--brand)', color: '#ffffff', padding: '12px 24px', borderRadius: 'var(--radius-pill)', textDecoration: 'none', fontWeight: 700 }}>
            مشاهده محصولات منتخب درمانی
          </Link>
          <Link href="/reeskin" className="primary-link" style={{ background: 'var(--surface-tint)', color: 'var(--brand-deep)', border: '1px solid var(--line)', padding: '12px 24px', borderRadius: 'var(--radius-pill)', textDecoration: 'none', fontWeight: 700 }}>
            خانواده محصولات خانگی ReeSkin™
          </Link>
          <Link href="/carboxygel" className="primary-link" style={{ background: 'var(--surface-tint)', color: 'var(--brand-deep)', border: '1px solid var(--line)', padding: '12px 24px', borderRadius: 'var(--radius-pill)', textDecoration: 'none', fontWeight: 700 }}>
            ژل کربوکسی‌تراپی CarboxyGel
          </Link>
        </div>
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
      setCouponInput("");
    } else {
      setCouponFeedback({ type: "error", message: res.message });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput("");
    setCouponFeedback(null);
  };

  // 2-tier milestone calculations
  // Tier 1: 1,500,000 Tomans (Free Cold-Chain Delivery) -> 50%
  // Tier 2: 3,000,000 Tomans (VIP Dermatologist Consultation) -> 100%
  const subtotalTomans = calculations.subtotalTomans;
  const tier1Threshold = 1_500_000n;
  const tier2Threshold = 3_000_000n;
  const tier1Achieved = subtotalTomans >= tier1Threshold;
  const tier2Achieved = subtotalTomans >= tier2Threshold;

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
    <section className="cart-page-layout" dir="rtl">
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

        {/* Dynamic 2-Tier Milestone Progress Bar (1.5M Free Cold-Chain Delivery + 3M VIP Consultation) */}
        <div className="tiered-threshold-container" style={{ borderRadius: "var(--radius-sm)", marginBottom: "20px" }}>
          <div className="tiered-header-status">
            <div className="tiered-status-headline">
              {tier2Achieved ? (
                <span className="tier-msg-vip">
                  <strong>تأییدیه بالینی:</strong> ارسال رایگان کلدچین و <strong>مشاوره تخصصی با پزشک متخصص پوست</strong> فعال شد
                </span>
              ) : tier1Achieved ? (
                <span className="tier-msg-shipping">
                  ✓ <strong>ارسال رایگان کلدچین فعال شد!</strong> فقط{" "}
                  {new Intl.NumberFormat("fa-IR").format(tier2Threshold - subtotalTomans)} تومان تا{" "}
                  <strong>مشاوره رایگان متخصص پوست</strong>
                </span>
              ) : (
                <span className="tier-msg-initial">
                  فقط{" "}
                  <strong>
                    {new Intl.NumberFormat("fa-IR").format(tier1Threshold - subtotalTomans)} تومان
                  </strong>{" "}
                  تا <strong>ارسال رایگان کلدچین سراسری</strong>
                </span>
              )}
            </div>
          </div>

          <div
            className="tiered-progress-track"
            role="progressbar"
            aria-valuenow={meterPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`tiered-progress-fill ${
                tier2Achieved ? "vip-complete" : tier1Achieved ? "free-complete" : ""
              }`}
              style={{ width: `${meterPercentage}%` }}
            />
            {/* Milestone Pins */}
            <div className={`milestone-pin pin-half ${tier1Achieved ? "reached" : ""}`}>
              <div className="pin-dot">{tier1Achieved ? "✓" : "۱"}</div>
              <span className="pin-label">ارسال رایگان کلدچین (۱.۵ م)</span>
            </div>
            <div className={`milestone-pin pin-full ${tier2Achieved ? "reached" : ""}`}>
              <div className="pin-dot">{tier2Achieved ? "★" : "۲"}</div>
              <span className="pin-label">مشاوره VIP پوست (۳ م)</span>
            </div>
          </div>
        </div>

        {/* Cold-Chain Assurance Banner */}
        <div className="cart-cold-chain-banner" style={{ borderRadius: "var(--radius-sm)", marginBottom: "20px" }}>
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

        {/* Intelligent Clinical Cross-Sell Section */}
        {recommendedCrossSell && (
          <div className="cart-cross-sell-section" style={{ marginTop: "24px" }}>
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
      </div>

      <aside className="cart-summary-column">
        <div className="summary-card">
          <h2>خلاصه پیش‌فاکتور</h2>

          {/* Coupon Code Section */}
          <form onSubmit={handleApplyCoupon} className="coupon-box">
            <input
              type="text"
              placeholder="کد تخفیف (مثال: DERMER20 یا WELCOME10)"
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
              <span>هزینه ارسال کلدچین:</span>
              <span>
                {calculations.isFreeShipping
                  ? "رایگان (خرید بالای ۱.۵ م)"
                  : formatMoney(calculations.shippingRials, "IRR")}
              </span>
            </div>

            {tier2Achieved && (
              <div className="summary-row vip-benefit" style={{ color: "#047857", fontWeight: 700 }}>
                <span>مشاوره VIP متخصص پوست:</span>
                <span className="badge-vip-benefit">رایگان (هدیه خرید بالای ۳ م)</span>
              </div>
            )}

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
