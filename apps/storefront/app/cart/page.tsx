"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useCart, CartItem } from "../../components/cart";
import { useLocalizedFormatter } from "../../lib/use-localized-formatter";
import { trackViewCart, trackBeginCheckout } from "../../lib/analytics";
import { listProducts, type Product } from "../../lib/catalog";
import { buildCrossSellsFromCatalog, CrossSellProtocol } from "../../lib/cart";
import { EmptyCartWithXIcon } from "../../components/empty-cart-icon";
import { useKyc } from "../../lib/kyc-context";
import { validateNationalId, validateIranianMobile, toAsciiDigits } from "@commerce-os/localization";
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  CreditCard,
  Sparkles,
} from "lucide-react";
import "../../components/kyc-modal.css";
import "./cart.css";

function CartKycGate() {
  const { verifyKyc } = useKyc();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isPhoneValid = useMemo(() => {
    const clean = toAsciiDigits(phone).replace(/\D/g, "");
    return validateIranianMobile(clean);
  }, [phone]);

  const isNationalValid = useMemo(() => {
    const clean = toAsciiDigits(nationalCode).replace(/\D/g, "");
    return validateNationalId(clean);
  }, [nationalCode]);

  const isNameValid = useMemo(() => {
    return fullName.trim().length >= 3;
  }, [fullName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setErrorMessage(null);

    const res = verifyKyc({ fullName, phone, nationalCode });
    if (!res.success) {
      setErrorMessage(res.message || "اطلاعات وارد شده نامعتبر است.");
    }
  };

  const handleFillDemo = () => {
    setFullName("علی محمدی");
    setPhone("۰۹۱۲۳۴۵۶۷۸۹");
    setNationalCode("۰۰۱۰۳۱۲۰۱۳");
    setErrorMessage(null);
  };

  return (
    <div className="cart-kyc-gate-container" dir="rtl">
      <div className="cart-kyc-gate-card">
        <div className="cart-kyc-gate-header">
          <div className="cart-kyc-shield-big">
            <ShieldCheck size={38} />
          </div>
          <h2 className="cart-kyc-gate-title">احراز هویت پیش از ورود به سبد خرید</h2>
          <p className="cart-kyc-gate-desc">
            مطابق با ضوابط تجارت الکترونیک، الزامات بانکی و صیانت از سفارش‌ها، جهت دسترسی به سبد خرید و ادامه فرآیند سفارش، احراز هویت اولیه الزامی است.
          </p>

          <div className="cart-kyc-gate-features">
            <div className="cart-kyc-feat-pill">
              <span className="dot" />
              <span>تطبیق کد ملی با ثبت‌احوال</span>
            </div>
            <div className="cart-kyc-feat-pill">
              <span className="dot" />
              <span>احراز شماره تلفن همراه</span>
            </div>
            <div className="cart-kyc-feat-pill">
              <span className="dot" />
              <span>ثبت فاکتور رسمی قانونی</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="kyc-modal-form" style={{ padding: "0" }}>
          {errorMessage && (
            <div className="kyc-form-error-alert" role="alert">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="kyc-input-group">
            <label htmlFor="gate-name" className="kyc-label">
              نام و نام خانوادگی کامل:
            </label>
            <div className={`kyc-input-wrap ${hasSubmitted && !isNameValid ? "has-error" : ""}`}>
              <User size={18} className="kyc-input-icon" />
              <input
                id="gate-name"
                type="text"
                placeholder="مثال: علیرضا حسینی"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="kyc-input-field"
                required
              />
              {fullName.trim().length >= 3 && (
                <CheckCircle2 size={16} className="kyc-field-valid-icon" />
              )}
            </div>
            {hasSubmitted && !isNameValid && (
              <span className="kyc-field-hint error">لطفاً نام و نام خانوادگی خود را کامل وارد کنید.</span>
            )}
          </div>

          <div className="kyc-input-group">
            <label htmlFor="gate-phone" className="kyc-label">
              شماره تلفن همراه (مالک خط):
            </label>
            <div className={`kyc-input-wrap ${hasSubmitted && !isPhoneValid ? "has-error" : ""}`}>
              <Phone size={18} className="kyc-input-icon" />
              <input
                id="gate-phone"
                type="tel"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="kyc-input-field"
                dir="ltr"
                required
              />
              {isPhoneValid && (
                <CheckCircle2 size={16} className="kyc-field-valid-icon" />
              )}
            </div>
            {hasSubmitted && !isPhoneValid && (
              <span className="kyc-field-hint error">شماره همراه معتبر ۱۱ رقمی وارد نمایید.</span>
            )}
          </div>

          <div className="kyc-input-group">
            <div className="kyc-label-with-demo">
              <label htmlFor="gate-national" className="kyc-label">
                کد ملی ۱۰ رقمی:
              </label>
              <button
                type="button"
                onClick={handleFillDemo}
                className="btn-kyc-fill-demo"
                title="تکمیل خودکار اطلاعات تستی معتبر"
              >
                <Sparkles size={12} />
                <span>نمونه تستی</span>
              </button>
            </div>
            <div className={`kyc-input-wrap ${hasSubmitted && !isNationalValid ? "has-error" : ""}`}>
              <CreditCard size={18} className="kyc-input-icon" />
              <input
                id="gate-national"
                type="text"
                maxLength={10}
                placeholder="۰۰۱۰۳۱۲۰۱۳"
                value={nationalCode}
                onChange={(e) => setNationalCode(e.target.value)}
                className="kyc-input-field"
                dir="ltr"
                required
              />
              {isNationalValid && (
                <CheckCircle2 size={16} className="kyc-field-valid-icon" />
              )}
            </div>
            {hasSubmitted && !isNationalValid ? (
              <span className="kyc-field-hint error">کد ملی نامعتبر است (رقم کنترل نامنطبق).</span>
            ) : isNationalValid ? (
              <span className="kyc-field-hint success">الگوریتم کد ملی منطبق با ثبت‌احوال تأیید شد.</span>
            ) : null}
          </div>

          <div className="kyc-modal-actions" style={{ marginTop: "10px" }}>
            <button type="submit" className="btn-kyc-submit">
              <span>تأیید اطلاعات و ورود به سبد خرید</span>
              <span className="arrow" aria-hidden="true">←</span>
            </button>
            <Link
              href="/shop"
              className="btn-kyc-cancel"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
            >
              بازگشت به فروشگاه
            </Link>
          </div>
        </form>

        <div className="kyc-modal-footer-note" style={{ borderRadius: "10px", marginTop: "10px" }}>
          <span>🔒 اطلاعات هویتی شما مطابق با قوانین حریم خصوصی و امنیت داده‌های تجارت الکترونیک محافظت می‌شود.</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper to resolve high-res product photo for cart items
 */
function getCartItemImage(item: CartItem): string {
  if (item.image) return item.image;
  const t = (item.title + " " + item.sku + " " + item.productId).toLowerCase();
  if (t.includes("carbox") && !t.includes("pod") && !t.includes("pad")) {
    return "/assets/drdermer/2025/08/19carbox.webp";
  }
  if (t.includes("carboxygel") || t.includes("carboxy-gel") || t.includes("کربوکسی‌ژل") || t.includes("ژل کربوکسی")) {
    return "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png";
  }
  if (t.includes("carboxypod") || t.includes("کربوکسی‌پاد") || t.includes("پاد")) {
    return "/assets/drdermer/2025/07/carbon-carboxypod-1-1.png";
  }
  if (t.includes("carboxypad") || t.includes("کربوکسی‌پد") || t.includes("پد")) {
    return "/assets/drdermer/2025/07/carboxypad-1024x198.png";
  }
  if (t.includes("healene") || t.includes("هیلین")) {
    return "/assets/drdermer/2025/08/16healene-1200x1109.webp";
  }
  if (t.includes("crystalene") || t.includes("کریستالین")) {
    return "/assets/drdermer/2025/08/15crystalene-1200x1109.webp";
  }
  if (t.includes("silicalene") || t.includes("سیلیکالین")) {
    return "/assets/drdermer/2025/08/14silicalene-1200x1109.webp";
  }
  if (t.includes("plasmax") || t.includes("پلاسما")) {
    return "/assets/drdermer/2025/08/18plasmax.webp";
  }
  if (t.includes("reeskin") || t.includes("ری‌اسکین")) {
    return "/assets/drdermer/2025/08/01Reeskin-scaled.webp";
  }
  return "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png";
}

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
    appliedCouponRule,
    applyCoupon,
    removeCoupon,
    customerType,
    setCustomerType,
    buyerPhone,
    setBuyerPhone,
    medicalLicenseNumber,
    setMedicalLicenseNumber,
    syncStage,
    calculations,
    isSyncing,
    syncWarnings,
    clearSyncWarnings,
  } = useCart();
  const { formatToman, formatMoney } = useLocalizedFormatter();
  const { isKycVerified, kycData } = useKyc();

  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [addedCrossSells, setAddedCrossSells] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isReady && items.length > 0) {
      syncStage("CART_REVIEW", {
        customerName: kycData?.fullName,
        customerPhone: buyerPhone || kycData?.phone,
        customerType,
      });
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

  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    listProducts({ limit: 100 }).then((res) => {
      if (!cancelled && res?.data) setCatalogProducts(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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

  if (!isReady) {
    return (
      <div className="state-panel loading-state">
        <div className="spinner"></div>
        <p>در حال همگام‌سازی و بارگذاری سبد خرید نسخه…</p>
      </div>
    );
  }

  // ── Mandatory KYC Check before viewing cart ──
  if (!isKycVerified) {
    return <CartKycGate />;
  }

  if (items.length === 0) {
    return (
      <section className="state-panel empty-cart-box">
        <EmptyCartWithXIcon className="empty-cart-x-icon" style={{ margin: "0 auto 22px" }} />
        <h2>سبد خرید شما خالی است.</h2>
        <p>
          هنوز هیچ محصول مراقبت بالینی، کربوکسی‌تراپی یا ملزومات کلینیکال به سبد خود
          اضافه نکرده‌اید.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}>
          <Link href="/shop" className="btn-empty-cart-notice">
            هیچ محصولی در سبد‌خرید نیست.
          </Link>
          <Link
            href="/account"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 22px",
              borderRadius: "999px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              color: "#334155",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            ورود به پنل کاربری من
          </Link>
        </div>
      </section>
    );
  }

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponFeedback(null);
    if (!couponInput.trim()) {
      setCouponFeedback({
        type: "error",
        message: "لطفاً کد تخفیف را وارد کنید.",
      });
      return;
    }
    setCouponApplying(true);
    try {
      const res = await applyCoupon(couponInput, {
        customerPhone: buyerPhone || kycData?.phone,
        customerType,
        medicalLicenseNumber: medicalLicenseNumber || undefined,
      });
      if (res.success) {
        setCouponFeedback({ type: "success", message: res.message });
        setCouponInput("");
      } else {
        setCouponFeedback({ type: "error", message: res.message });
      }
    } finally {
      setCouponApplying(false);
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
    <div className="cart-page-wrapper">
      <div className="cart-inner-container">
        {/* ── Verified KYC Trust Pill Bar ────────────────────────── */}
        <div className="cart-verified-kyc-banner">
          <div className="cart-kyc-status-info">
            <span className="cart-kyc-shield-icon" aria-hidden="true">
              <ShieldCheck size={17} />
            </span>
            <span>احراز هویت شده (دارای مجوز رسمی خرید داروخانه‌ای و کلینیکال)</span>
          </div>
          <span className="cart-kyc-meta">
            کد ملی: {kycData?.nationalCode || "۰۰۱۰۳۱۲۰۱۳"}
          </span>
        </div>

        {/* ── Main 2-Column Grid ─────────────────────────────────── */}
        <div className="cart-main-grid">
          {/* ── Left/Main Column: Items Table & Notifications ─── */}
          <main className="cart-items-section">
            {/* Headline and live sync status */}
            <div className="cart-headline-row">
              <h1 className="cart-page-title">
                سبد خرید نسخه ({calculations.itemCount} کالا)
              </h1>
              {isSyncing && (
                <span className="cart-live-sync-pill">در حال بررسی موجودی زنده…</span>
              )}
            </div>

            {/* Dynamic 2-Tier Milestone Progress Card */}
            <div className="cart-tier-progress-card">
              <div className="tier-status-text">
                {tier2Achieved ? (
                  <span className="tier-highlight-vip">
                    🎉 <strong>تبریک ویژه!</strong> ارسال رایگان کلدچین و <strong>مشاوره تخصصی رایگان با پزشک متخصص پوست</strong> فعال شد.
                  </span>
                ) : tier1Achieved ? (
                  <span className="tier-highlight-free">
                    ✓ <strong>ارسال رایگان کلدچین فعال شد!</strong> فقط{" "}
                    {new Intl.NumberFormat("fa-IR").format(tier2Threshold - subtotalTomans)} تومان تا{" "}
                    <strong>مشاوره رایگان متخصص پوست</strong>
                  </span>
                ) : (
                  <span>
                    فقط{" "}
                    <strong>
                      {new Intl.NumberFormat("fa-IR").format(tier1Threshold - subtotalTomans)} تومان
                    </strong>{" "}
                    تا <strong>ارسال رایگان کلدچین سراسری</strong>
                  </span>
                )}
              </div>

              <div
                className="tier-track-bg"
                role="progressbar"
                aria-valuenow={meterPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="tier-fill-bar"
                  style={{ width: `${meterPercentage}%` }}
                />
                {/* Milestone Pins */}
                <div className={`tier-pin-node half-node ${tier1Achieved ? "reached" : ""}`}>
                  <div className="tier-pin-circle">{tier1Achieved ? "✓" : "۱"}</div>
                  <span className="tier-pin-title">ارسال رایگان کلدچین (۱.۵ م)</span>
                </div>
                <div className={`tier-pin-node full-node ${tier2Achieved ? "reached" : ""}`}>
                  <div className="tier-pin-circle">{tier2Achieved ? "★" : "۲"}</div>
                  <span className="tier-pin-title">مشاوره VIP پوست (۳ م)</span>
                </div>
              </div>
            </div>

            {/* Cold-Chain Quality Assurance Banner */}
            <div className="cart-cold-chain-banner">
              <span className="cold-chain-badge-temp">۲–۸°C</span>
              <div className="cold-chain-info-wrap">
                <div className="cold-chain-title-line">
                  <span>تضمین پایش هوشمند زنجیره سرد (Cold-Chain)</span>
                  <span className="cold-chain-status-pill">کنترل کیفی فعال</span>
                </div>
                <p className="cold-chain-desc-text">
                  ارسال در بسته‌بندی عایق ایزوترمال با ژل یخ دارویی و سنسور پایش حرارتی؛ تضمین ۱۰۰٪ پایداری پپتیدها و ماتریکس فعال بیولوژیک.
                </p>
              </div>
            </div>

            {/* Stock / Server Sync Warnings */}
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

            {/* ── Products Table Card (Exact UX Architecture of Reference Image) ── */}
            <div className="cart-products-table-card">
              {/* Header row: Product, Price, Quantity, Total */}
              <div className="cart-table-head" role="row">
                <span className="th-product" role="columnheader">محصول</span>
                <span className="th-price" role="columnheader">قیمت واحد</span>
                <span className="th-qty" role="columnheader">تعداد</span>
                <span className="th-total" role="columnheader">جمع کل</span>
              </div>

              {/* Rows */}
              <div className="cart-table-rows-container" role="rowgroup">
                {items.map((item) => {
                  const lineTotalRials = BigInt(item.priceAmount) * BigInt(item.qty);
                  return (
                    <div key={item.variantId} className="cart-table-item-row" role="row">
                      {/* Product cell with remove button, thumbnail, and text */}
                      <div className="cart-cell-product">
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="btn-item-remove-icon"
                          title="حذف کالا از سبد"
                          aria-label={`حذف ${item.title}`}
                        >
                          ✕
                        </button>

                        <div className="cart-item-thumbnail-wrap">
                          <Image
                            src={getCartItemImage(item)}
                            alt={item.title}
                            width={68}
                            height={68}
                            className="cart-item-thumb-img"
                          />
                        </div>

                        <div className="cart-item-text-details">
                          <h3 className="cart-item-name" title={item.title}>
                            {item.title}
                          </h3>
                          <span className="cart-item-sku-line">
                            کد رسمی: {item.sku}
                          </span>
                          {item.qty >= 3 && (
                            <span className="cart-item-tier-tag">
                              {item.qty >= 6 ? "۸٪ تخفیف پلکانی تعداد" : "۵٪ تخفیف پلکانی تعداد"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Unit Price cell */}
                      <div className="cart-cell-price">
                        {formatToman(item.priceAmount)}
                      </div>

                      {/* Quantity Stepper cell */}
                      <div className="cart-cell-qty">
                        <div
                          className="cart-stepper-control"
                          role="group"
                          aria-label={`تعداد ${item.title}`}
                        >
                          <button
                            type="button"
                            onClick={() => setQty(item.variantId, item.qty + 1)}
                            className="stepper-action-btn"
                            aria-label="افزایش تعداد"
                          >
                            +
                          </button>
                          <span className="stepper-number-display">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.variantId, item.qty - 1)}
                            className="stepper-action-btn"
                            aria-label="کاهش تعداد"
                          >
                            -
                          </button>
                        </div>
                      </div>

                      {/* Line Total cell */}
                      <div className="cart-cell-total">
                        {formatToman(lineTotalRials)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table Bottom Action Buttons (Continue Shopping & Clear Cart) */}
              <div className="cart-table-footer-actions">
                <Link href="/shop" className="btn-continue-shopping">
                  <span>← ادامه خرید و مشاهده محصولات</span>
                </Link>

                <div className="cart-table-secondary-actions">
                  <Link href="/account?tab=cart" className="btn-account-portal-link">
                    <span>مدیریت در پنل کاربری</span>
                  </Link>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="btn-clear-cart-text"
                  >
                    پاک کردن کل سبد
                  </button>
                </div>
              </div>
            </div>

            {/* ── Intelligent Clinical Cross-Sell Section ── */}
            {recommendedCrossSell && (
              <div className="cart-clinical-cross-sell-box">
                <div className="cross-sell-header-line">
                  <span className="cross-sell-accent-tag">{recommendedCrossSell.discountBadge}</span>
                  <span className="cross-sell-main-heading">هم‌افزایی بالینی پروتکل درمانی پیشنهادی</span>
                </div>
                <div className="cross-sell-body-grid">
                  <div>
                    <h4 className="cross-sell-product-title">{recommendedCrossSell.title}</h4>
                    <p className="cross-sell-sub-desc">{recommendedCrossSell.subtitle}</p>
                    <p className="cross-sell-clinical-rationale">
                      <span className="rationale-bold-label">تحلیل بالینی:</span> {recommendedCrossSell.clinicalRationale}
                    </p>
                  </div>

                  <div className="cross-sell-action-side">
                    <div className="cross-sell-price-column">
                      <span className="cross-sell-old-price">{formatToman(recommendedCrossSell.originalPriceRials)}</span>
                      <strong className="cross-sell-new-price">{formatToman(recommendedCrossSell.bundlePriceRials)}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddCrossSell(recommendedCrossSell)}
                      className={`btn-add-bundle-pill ${addedCrossSells[recommendedCrossSell.id] ? "added" : ""}`}
                      disabled={addedCrossSells[recommendedCrossSell.id]}
                    >
                      {addedCrossSells[recommendedCrossSell.id] ? "✓ اضافه شد" : "+ افزودن با تخفیف باندل"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* ── Right Column: Stacked Promo Code & Cart Totals ─── */}
          <aside className="cart-sidebar-section">
            {/* Card 1: Promo Code & B2B/B2C Segment Card */}
            <div className="cart-promo-code-card">
              <h3 className="promo-card-heading">کد تخفیف، سهمیه کلینیکی یا کد ویزیتور</h3>

              {/* Buyer Channel Switcher: B2C vs B2B Clinic */}
              <div
                role="group"
                aria-label="انتخاب نوع خریدار برای تخفیف‌های B2B و B2C"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px",
                  marginBottom: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setCustomerType("B2C")}
                  style={{
                    padding: "7px 10px",
                    borderRadius: "8px",
                    border: customerType === "B2C" ? "1.5px solid #0d9488" : "1px solid #cbd5e1",
                    background: customerType === "B2C" ? "#f0fdfa" : "#ffffff",
                    color: customerType === "B2C" ? "#0f766e" : "#475569",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  مشتری شخصی (B2C)
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType("B2B_CLINIC")}
                  style={{
                    padding: "7px 10px",
                    borderRadius: "8px",
                    border:
                      customerType === "B2B_CLINIC" ? "1.5px solid #7c3aed" : "1px solid #cbd5e1",
                    background: customerType === "B2B_CLINIC" ? "#f5f3ff" : "#ffffff",
                    color: customerType === "B2B_CLINIC" ? "#6d28d9" : "#475569",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  کلینیک / مطب (B2B)
                </button>
              </div>

              {customerType === "B2B_CLINIC" && (
                <div style={{ display: "grid", gap: "6px", marginBottom: "10px" }}>
                  <input
                    type="text"
                    placeholder="شماره موبایل کلینیک (مثال: 09123333333)"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    dir="ltr"
                    className="promo-text-input"
                  />
                  <input
                    type="text"
                    placeholder="کد نظام پزشکی / مجوز کلینیک (اختیاری)"
                    value={medicalLicenseNumber}
                    onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                    dir="ltr"
                    className="promo-text-input"
                  />
                </div>
              )}

              <form onSubmit={handleApplyCoupon} className="promo-form-inline">
                <input
                  type="text"
                  placeholder="کد تخفیف (DERMER20، CLINIC25، VISITOR15)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="promo-text-input"
                  disabled={Boolean(appliedCoupon) || couponApplying}
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="promo-action-btn remove-coupon"
                  >
                    حذف
                  </button>
                ) : (
                  <button type="submit" className="promo-action-btn" disabled={couponApplying}>
                    {couponApplying ? "در حال بررسی..." : "اعمال کد"}
                  </button>
                )}
              </form>

              {couponFeedback && (
                <div className={`promo-feedback-alert ${couponFeedback.type}`}>
                  {couponFeedback.message}
                </div>
              )}

              {appliedCoupon && (
                <div className="promo-active-badge">
                  <span>✓ کوپن فعال: {appliedCoupon}</span>
                  {appliedCouponRule?.visitorName && (
                    <span style={{ display: "block", fontSize: "11px", marginTop: "3px" }}>
                      معرف ویزیتور: {appliedCouponRule.visitorName}
                    </span>
                  )}
                  {appliedCouponRule?.clinicName && (
                    <span style={{ display: "block", fontSize: "11px", marginTop: "3px" }}>
                      قرارداد کلینیک: {appliedCouponRule.clinicName}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Card 2: Cart Totals Card (Totals & Proceed to Checkout) */}
            <div className="cart-totals-summary-card">
              <h2 className="totals-card-title">خلاصه سبد خرید</h2>

              <div className="totals-breakdown-list">
                <div className="totals-line-row">
                  <span className="row-label">جمع جزء (کالاها):</span>
                  <span className="row-value">{formatMoney(calculations.subtotalRials, "IRR")}</span>
                </div>

                {calculations.discounts.map((d, index) => (
                  <div key={index} className="totals-line-row discount-row">
                    <span className="row-label">{d.title}:</span>
                    <span className="row-value">- {formatMoney(d.amountRials, "IRR")}</span>
                  </div>
                ))}

                <div className="totals-line-row">
                  <span className="row-label">هزینه ارسال کلدچین:</span>
                  <span className="row-value">
                    {calculations.isFreeShipping ? (
                      <span className="shipping-status-badge">✓ رایگان (سراسر کشور)</span>
                    ) : (
                      formatMoney(calculations.shippingRials, "IRR")
                    )}
                  </span>
                </div>

                <div className="totals-line-row">
                  <span className="row-label">مالیات بر ارزش افزوده (۱۰٪):</span>
                  <span className="row-value">{formatMoney(calculations.vatRials, "IRR")}</span>
                </div>

                {tier2Achieved && (
                  <div className="totals-line-row">
                    <span className="row-label">مشاوره VIP متخصص پوست:</span>
                    <span className="vip-consult-status-badge">★ رایگان (خرید بالای ۳ م)</span>
                  </div>
                )}

                <hr className="totals-divider-line" />

                <div className="totals-final-row">
                  <span className="final-label">مبلغ نهایی قابل پرداخت:</span>
                  <strong className="final-amount">{formatMoney(calculations.totalRials, "IRR")}</strong>
                </div>
              </div>

              {/* Proceed to Checkout CTA Button */}
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
                className="btn-proceed-checkout-cta"
              >
                <span>ادامه فرآیند خرید و پرداخت</span>
                <span aria-hidden="true">←</span>
              </Link>

              <p className="totals-security-guarantee-note">
                🔒 پرداخت امن با درگاه شاپرک · رزرو ۱۵ دقیقه‌ای سبد خرید در سرور · صدور پیش‌فاکتور رسمی قانونی
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
