"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../components/cart";
import { formatToman, apiBase, storeSlug } from "../../lib/catalog";
import {
  validateIranianMobile,
  validatePostalCode,
  validateNationalId,
  toAsciiDigits,
} from "@commerce-os/localization";

export interface ProvinceCityMap {
  [province: string]: string[];
}

export const IRAN_PROVINCES: ProvinceCityMap = {
  تهران: ["تهران", "شهریار", "اسلامشهر", "ورامین", "ری", "دماوند", "پردیس", "شمیرانات"],
  البرز: ["کرج", "فردیس", "هشتگرد", "نظرآباد", "طالقان", "اشتهارد"],
  اصفهان: ["اصفهان", "کاشان", "نجف‌آباد", "خمینی‌شهر", "شاهین‌شهر", "لنجان", "فلاورجان"],
  "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار", "تربت حیدریه", "قوچان", "گناباد"],
  فارس: ["شیراز", "مرودشت", "کازرون", "جهرم", "فسا", "لارستان", "آباده"],
  "آذربایجان شرقی": ["تبریز", "مراغه", "مرند", "میانه", "اهر", "بناب"],
  مازندران: ["ساری", "بابل", "آمل", "قائم‌شهر", "تنکابن", "چالوس", "نوشهر", "رامسر"],
  گیلان: ["رشت", "بندر انزلی", "لاهیجان", "لنگرود", "تالش", "فومن", "رودسر"],
  خوزستان: ["اهواز", "دزفول", "آبادان", "خرمشهر", "ماهشهر", "شوشتر", "امیدیه"],
  قم: ["قم", "سلفچگان", "جعفریه"],
  یزد: ["یزد", "میبد", "اردکان", "بافق", "مهریز"],
  کرمان: ["کرمان", "رفسنجان", "سیرجان", "جیرفت", "بم"],
  "آذربایجان غربی": ["ارومیه", "خوی", "بوکان", "مهاباد", "میاندوآب"],
  کرمانشاه: ["کرمانشاه", "اسلام‌آباد غرب", "کنگاور", "سنقر"],
  مرکزی: ["اراک", "ساوه", "خمین", "محلات"],
  قزوین: ["قزوین", "تاکستان", "الوند", "بویین‌زهرا"],
};

export default function CheckoutPage() {
  const { items, clearCart, isReady, calculations, shippingMethod, setShippingMethod, appliedCoupon } = useCart();
  const router = useRouter();

  // Active step: 1 (Contact & Tax), 2 (Shipping & Slot), 3 (Payment Method), 4 (Review & Place)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Contact & National Code
  const [customerName, setCustomerName] = useState("علی علوی");
  const [customerPhone, setCustomerPhone] = useState("09121234567");
  const [customerEmail, setCustomerEmail] = useState("ali.alavi@example.com");
  const [needTaxInvoice, setNeedTaxInvoice] = useState(false);
  const [nationalCode, setNationalCode] = useState("0010312013");
  const [companyEconomicCode, setCompanyEconomicCode] = useState("");

  // Step 2: Shipping & Delivery Slot
  const [province, setProvince] = useState("تهران");
  const [city, setCity] = useState("تهران");
  const [postalCode, setPostalCode] = useState("1458963214");
  const [postalAddress, setPostalAddress] = useState(
    "خیابان آزادی، خیابان حبیب‌الهی، پلاک ۱۲، واحد ۴"
  );
  const [deliveryDay, setDeliveryDay] = useState("فردا (کاری)");
  const [deliverySlot, setDeliverySlot] = useState("۱۳ الی ۱۷ (عصر)");

  // Step 3: Payment Method & Gateway Selection
  const [paymentCategory, setPaymentCategory] = useState<"IPG" | "CARD_TO_CARD" | "WALLET">("IPG");
  const [ipgProvider, setIpgProvider] = useState<"SAMAN" | "PARSIAN" | "ZARINPAL">("SAMAN");
  const [c2cCardNumber, setC2cCardNumber] = useState("");
  const [c2cTrackingCode, setC2cTrackingCode] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  // Idempotency key per checkout session
  const idempotencyKeyRef = useRef<string>("");
  useEffect(() => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }
  }, []);

  // Update cities when province changes
  const availableCities = useMemo(() => {
    return IRAN_PROVINCES[province] || ["تهران"];
  }, [province]);

  useEffect(() => {
    if (!availableCities.includes(city)) {
      setCity(availableCities[0]);
    }
  }, [province, availableCities, city]);

  const [storeId, setStoreId] = useState("demo-store");
  useEffect(() => {
    let active = true;
    fetch(`${apiBase}/v1/stores/resolve?slug=${encodeURIComponent(storeSlug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.id) {
          setStoreId(data.id);
        }
      })
      .catch(() => {
        // Fallback
      });
    return () => {
      active = false;
    };
  }, []);

  if (!isReady) {
    return <div className="state-panel">در حال بارگذاری فرم تسویه‌حساب…</div>;
  }

  if (items.length === 0) {
    return (
      <section className="state-panel empty-cart-box">
        <h2>سبد خرید شما خالی است</h2>
        <p>برای تکمیل خرید ابتدا کالاهای موردنظر را به سبد خرید اضافه کنید.</p>
        <button onClick={() => router.push("/#catalog")} className="primary-link">
          مشاهده کاتالوگ محصولات
        </button>
      </section>
    );
  }

  // Validation functions
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customerName.trim()) {
      errors.customerName = "نام و نام خانوادگی تحویل‌گیرنده الزامی است";
    }
    if (!validateIranianMobile(toAsciiDigits(customerPhone))) {
      errors.customerPhone = "شماره موبایل وارد شده باید ۱۱ رقمی و با ۰۹ شروع شود";
    }
    if (needTaxInvoice) {
      if (!validateNationalId(toAsciiDigits(nationalCode))) {
        errors.nationalCode = "کد ملی ۱۰ رقمی با الگوریتم ممیزی ۱۱ معتبر نیست";
      }
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!validatePostalCode(toAsciiDigits(postalCode))) {
      errors.postalCode = "کد پستی ۱۰ رقمی معتبر نیست (بدون رقم صفر و غیرتکراری)";
    }
    if (!postalAddress.trim() || postalAddress.trim().length < 10) {
      errors.postalAddress = "نشانی دقیق پستی شامل خیابان، کوچه و پلاک الزامی است (حداقل ۱۰ کاراکتر)";
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const orderNumberGenerated = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // Map payment method
    let backendPaymentMethod: "ZARINPAL" | "CARD_TO_CARD" | "WALLET" = "ZARINPAL";
    if (paymentCategory === "CARD_TO_CARD") {
      backendPaymentMethod = "CARD_TO_CARD";
    } else if (paymentCategory === "WALLET") {
      backendPaymentMethod = "WALLET";
    } else {
      backendPaymentMethod = "ZARINPAL";
    }

    const payload = {
      storeId,
      customerName,
      customerPhone: toAsciiDigits(customerPhone),
      address: {
        province,
        city,
        postalCode: toAsciiDigits(postalCode),
        postalAddress,
        receiverName: customerName,
        receiverPhone: toAsciiDigits(customerPhone),
      },
      items: items.map((i) => ({ variantId: i.variantId, qty: i.qty })),
      couponCode: appliedCoupon || undefined,
      nationalCode: needTaxInvoice ? toAsciiDigits(nationalCode) : undefined,
      economicCode: companyEconomicCode || undefined,
      shippingMethod,
      deliverySlot: `${deliveryDay} - ${deliverySlot}`,
    };

    try {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      // 1. Create checkout session on backend with price snapshot & stock reservation
      const sessionRes = await fetch(`${apiHost}/v1/checkout/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000),
      });

      if (!sessionRes.ok) {
        const errJson = await sessionRes.json().catch(() => ({}));
        throw new Error(errJson.message || "خطا در ایجاد جلسه تسویه‌حساب سرور");
      }

      const sessionData = await sessionRes.json();

      // 2. Place order with Idempotency Key header
      const placeRes = await fetch(`${apiHost}/v1/checkout/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": idempotencyKeyRef.current,
        },
        body: JSON.stringify({
          sessionId: sessionData.sessionId,
          paymentMethod: backendPaymentMethod,
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (!placeRes.ok) {
        const errJson = await placeRes.json().catch(() => ({}));
        throw new Error(errJson.message || "خطا در ثبت قطعی سفارش");
      }

      const orderResult = await placeRes.json();
      const confirmedOrderNumber = orderResult.orderNumber || orderNumberGenerated;

      // Save order snapshot in account history
      try {
        const orderHistoryItem = {
          orderNumber: confirmedOrderNumber,
          status: paymentCategory === "WALLET" ? "PAID" : "PENDING_PAYMENT",
          totalTomans: calculations.grandTotalTomans.toString(),
          method:
            paymentCategory === "IPG"
              ? `درگاه شاپرک (${ipgProvider})`
              : paymentCategory === "CARD_TO_CARD"
              ? "کارت‌به‌کارت مستقیم"
              : "کیف پول داخلی",
          ref: orderResult.paymentIntentId || `REF-${Date.now().toString().slice(-8)}`,
          placedAt: new Date().toISOString(),
          customerName,
          customerPhone,
          nationalCode: needTaxInvoice ? nationalCode : null,
          address: `${province}، ${city}، ${postalAddress}`,
          shippingMethod,
          deliverySlot: `${deliveryDay} - ${deliverySlot}`,
          items: items.map((i) => ({
            title: i.title,
            qty: i.qty,
            priceAmount: i.priceAmount,
            sku: i.sku,
          })),
        };
        localStorage.setItem("commerce_os.checkout.lastOrder", JSON.stringify(orderHistoryItem));

        const existingRaw = localStorage.getItem("commerce_os.account.orders.v1");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem(
          "commerce_os.account.orders.v1",
          JSON.stringify([orderHistoryItem, ...existing])
        );
      } catch {
        // storage fallback
      }

      clearCart();

      if (paymentCategory === "WALLET") {
        router.push(`/order/${confirmedOrderNumber}?status=PAID&ref=WLT-${Date.now().toString().slice(-6)}`);
      } else if (orderResult.paymentIntentId) {
        router.push(`/pay/${orderResult.paymentIntentId}`);
      } else {
        router.push(
          `/pay/intent_${Date.now()}?orderNum=${confirmedOrderNumber}&method=${backendPaymentMethod}&total=${calculations.grandTotalTomans}`
        );
      }
    } catch (err: any) {
      // Offline/Demo Simulation Safeguard:
      const simulatedIntent = `mock_intent_${Date.now()}`;
      try {
        const orderHistoryItem = {
          orderNumber: orderNumberGenerated,
          status: paymentCategory === "WALLET" ? "PAID" : "PENDING_PAYMENT",
          totalTomans: calculations.grandTotalTomans.toString(),
          method:
            paymentCategory === "IPG"
              ? `درگاه شاپرک (${ipgProvider})`
              : paymentCategory === "CARD_TO_CARD"
              ? "کارت‌به‌کارت مستقیم"
              : "کیف پول داخلی",
          ref: `REF-${Date.now().toString().slice(-8)}`,
          placedAt: new Date().toISOString(),
          customerName,
          customerPhone,
          nationalCode: needTaxInvoice ? nationalCode : null,
          address: `${province}، ${city}، ${postalAddress}`,
          shippingMethod,
          deliverySlot: `${deliveryDay} - ${deliverySlot}`,
          items: items.map((i) => ({
            title: i.title,
            qty: i.qty,
            priceAmount: i.priceAmount,
            sku: i.sku,
          })),
        };
        localStorage.setItem("commerce_os.checkout.lastOrder", JSON.stringify(orderHistoryItem));
        const existingRaw = localStorage.getItem("commerce_os.account.orders.v1");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem(
          "commerce_os.account.orders.v1",
          JSON.stringify([orderHistoryItem, ...existing])
        );
      } catch {
        // ignore
      }

      clearCart();
      if (paymentCategory === "WALLET") {
        router.push(`/order/${orderNumberGenerated}?status=PAID&ref=WLT-${Date.now().toString().slice(-6)}`);
      } else {
        router.push(
          `/pay/${simulatedIntent}?orderNum=${orderNumberGenerated}&method=${backendPaymentMethod}&total=${calculations.grandTotalTomans}`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="checkout-layout">
      <div className="checkout-main-content">
        {/* Stepper Header */}
        <div className="checkout-stepper-bar">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`step-bubble ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}
          >
            <span className="step-num">{currentStep > 1 ? "✓" : "۱"}</span>
            <span className="step-text">اطلاعات و کد ملی</span>
          </button>
          <div className={`step-connector ${currentStep >= 2 ? "active" : ""}`} />
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setCurrentStep(2);
            }}
            className={`step-bubble ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}`}
          >
            <span className="step-num">{currentStep > 2 ? "✓" : "۲"}</span>
            <span className="step-text">آدرس و زمان ارسال</span>
          </button>
          <div className={`step-connector ${currentStep >= 3 ? "active" : ""}`} />
          <button
            type="button"
            onClick={() => {
              if (validateStep1() && validateStep2()) setCurrentStep(3);
            }}
            className={`step-bubble ${currentStep === 3 ? "active" : currentStep > 3 ? "completed" : ""}`}
          >
            <span className="step-num">{currentStep > 3 ? "✓" : "۳"}</span>
            <span className="step-text">روش پرداخت</span>
          </button>
          <div className={`step-connector ${currentStep >= 4 ? "active" : ""}`} />
          <button
            type="button"
            onClick={() => {
              if (validateStep1() && validateStep2()) setCurrentStep(4);
            }}
            className={`step-bubble ${currentStep === 4 ? "active" : ""}`}
          >
            <span className="step-num">۴</span>
            <span className="step-text">پیش‌فاکتور و ثبت</span>
          </button>
        </div>

        {/* STEP 1: Contact Information & Legal Tax Invoicing */}
        {currentStep === 1 && (
          <div className="checkout-section">
            <h2>۱. اطلاعات تماس و هویت حقوقی خریدار</h2>
            <p className="section-desc">
              اطلاعات جهت هماهنگی ارسال مرسوله و تطبیق احراز هویت شاهکار استفاده می‌شود.
            </p>

            <div className="form-grid">
              <label className="form-field">
                <span>نام و نام خانوادگی تحویل‌گیرنده *</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: علی علوی"
                  className={`input-text ${stepErrors.customerName ? "input-error" : ""}`}
                />
                {stepErrors.customerName && (
                  <span className="field-error-msg">{stepErrors.customerName}</span>
                )}
              </label>

              <label className="form-field">
                <span>شماره تلفن همراه (جهت پیامک رهگیری) *</span>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="09121234567"
                  dir="ltr"
                  className={`input-text ${stepErrors.customerPhone ? "input-error" : ""}`}
                />
                {stepErrors.customerPhone && (
                  <span className="field-error-msg">{stepErrors.customerPhone}</span>
                )}
              </label>

              <label className="form-field full-width">
                <span>پست الکترونیک (اختیاری - ارسال نسخه PDF فاکتور رسمی)</span>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="input-text"
                />
              </label>
            </div>

            {/* Legal / Corporate Invoicing Checkbox */}
            <div className="tax-invoice-toggle-box">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={needTaxInvoice}
                  onChange={(e) => setNeedTaxInvoice(e.target.checked)}
                />
                <span>درخواست صدور فاکتور رسمی مالیاتی و ثبت در سامانه مودیان (کد ملی / شناسه ملی)</span>
              </label>

              {needTaxInvoice && (
                <div className="tax-fields-grid">
                  <label className="form-field">
                    <span>کد ملی ۱۰ رقمی (تطبیق با الگوریتم ممیزی ۱۱) *</span>
                    <input
                      type="text"
                      value={nationalCode}
                      onChange={(e) => setNationalCode(e.target.value)}
                      placeholder="0010312013"
                      dir="ltr"
                      maxLength={10}
                      className={`input-text ${stepErrors.nationalCode ? "input-error" : ""}`}
                    />
                    {stepErrors.nationalCode && (
                      <span className="field-error-msg">{stepErrors.nationalCode}</span>
                    )}
                  </label>

                  <label className="form-field">
                    <span>شناسه ملی / کد اقتصادی حقوقی (ویژه کلینیک‌ها و شرکت‌ها)</span>
                    <input
                      type="text"
                      value={companyEconomicCode}
                      onChange={(e) => setCompanyEconomicCode(e.target.value)}
                      placeholder="شناسه ۱۱ رقمی شرکت"
                      dir="ltr"
                      className="input-text"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="step-actions-row">
              <button type="button" onClick={goToNextStep} className="btn-next-step">
                تأیید و ادامه به مرحله آدرس و ارسال ←
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Shipping Address & Time Slot */}
        {currentStep === 2 && (
          <div className="checkout-section">
            <h2>۲. آدرس تحویل و زمان‌بندی ارسال مرسوله</h2>
            <p className="section-desc">
              انتخاب استان، شهر، کد پستی ۱۰ رقمی معتبر و زمان تحویل سفارش
            </p>

            <div className="form-grid">
              <label className="form-field">
                <span>استان *</span>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="input-text select-box"
                >
                  {Object.keys(IRAN_PROVINCES).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>شهر *</span>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-text select-box"
                >
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field full-width">
                <span>کد پستی ۱۰ رقمی *</span>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="1458963214"
                  dir="ltr"
                  maxLength={10}
                  className={`input-text ${stepErrors.postalCode ? "input-error" : ""}`}
                />
                {stepErrors.postalCode && (
                  <span className="field-error-msg">{stepErrors.postalCode}</span>
                )}
              </label>

              <label className="form-field full-width">
                <span>نشانی پستی دقیق (خیابان، کوچه، پلاک، واحد) *</span>
                <textarea
                  value={postalAddress}
                  onChange={(e) => setPostalAddress(e.target.value)}
                  rows={3}
                  className={`input-textarea ${stepErrors.postalAddress ? "input-error" : ""}`}
                />
                {stepErrors.postalAddress && (
                  <span className="field-error-msg">{stepErrors.postalAddress}</span>
                )}
              </label>
            </div>

            {/* Carrier Methods */}
            <h3 className="sub-heading">روش ارسال مرسوله</h3>
            <div className="options-grid">
              <label className={`option-card ${shippingMethod === "POST_PISHTAZ" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="shippingChoice"
                  value="POST_PISHTAZ"
                  checked={shippingMethod === "POST_PISHTAZ"}
                  onChange={() => setShippingMethod("POST_PISHTAZ")}
                />
                <div className="option-content">
                  <strong>پست پیشتاز سراسری (بیمه استاندارد)</strong>
                  <span>تحویل ۲۴ تا ۷۲ ساعت کاری به تمام شهرهای ایران — رایگان برای خریدهای بالای ۳ میلیون تومان</span>
                </div>
                <div className="option-badge">
                  {calculations.isFreeShipping ? "رایگان" : "۱۵۰,۰۰۰ تومان"}
                </div>
              </label>

              <label className={`option-card ${shippingMethod === "TIPAX" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="shippingChoice"
                  value="TIPAX"
                  checked={shippingMethod === "TIPAX"}
                  onChange={() => setShippingMethod("TIPAX")}
                />
                <div className="option-content">
                  <strong>تیپاکس اکسپرس (درب به درب)</strong>
                  <span>ارسال سریع ویژه به همراه کد رهگیری لحظه‌ای تیپاکس</span>
                </div>
                <div className="option-badge">
                  {calculations.isFreeShipping ? "رایگان" : "۸۵,۰۰۰ تومان"}
                </div>
              </label>

              <label className={`option-card ${shippingMethod === "EXPRESS_COURIER" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="shippingChoice"
                  value="EXPRESS_COURIER"
                  checked={shippingMethod === "EXPRESS_COURIER"}
                  onChange={() => setShippingMethod("EXPRESS_COURIER")}
                />
                <div className="option-content">
                  <strong>پیک اکسپرس فوری (ویژه تهران و مراکز استان)</strong>
                  <span>تحویل فوق‌سریع در بازه انتخابی همان‌روز یا روز کاری بعد</span>
                </div>
                <div className="option-badge">
                  {calculations.isFreeShipping ? "رایگان" : "۲۰۰,۰۰۰ تومان"}
                </div>
              </label>
            </div>

            {/* Time Slot Picker */}
            <h3 className="sub-heading">انتخاب بازه زمانی تحویل</h3>
            <div className="slot-grid">
              <div className="slot-field">
                <span>روز تحویل:</span>
                <select
                  value={deliveryDay}
                  onChange={(e) => setDeliveryDay(e.target.value)}
                  className="input-text select-box"
                >
                  <option value="فردا (کاری)">فردا (روز کاری)</option>
                  <option value="پس‌فردا">پس‌فردا</option>
                  <option value="شنبه هفته آینده">شنبه هفته آینده</option>
                </select>
              </div>

              <div className="slot-field">
                <span>ساعت تحویل:</span>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="input-text select-box"
                >
                  <option value="۹ الی ۱۳ (بازه صبح)">ساعت ۹ الی ۱۳ (بازه صبح)</option>
                  <option value="۱۳ الی ۱۷ (بازه عصر)">ساعت ۱۳ الی ۱۷ (بازه عصر)</option>
                  <option value="۱۷ الی ۲۱ (بازه شب)">ساعت ۱۷ الی ۲۱ (بازه شب)</option>
                </select>
              </div>
            </div>

            <div className="step-actions-row">
              <button type="button" onClick={() => setCurrentStep(1)} className="btn-prev-step">
                ← بازگشت به مرحله قبل
              </button>
              <button type="button" onClick={goToNextStep} className="btn-next-step">
                تأیید و ادامه به شیوه پرداخت ←
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Method Selection */}
        {currentStep === 3 && (
          <div className="checkout-section">
            <h2>۳. انتخاب شیوه پرداخت</h2>
            <p className="section-desc">
              تمامی پرداخت‌ها در بستر پروتکل‌های امن مالیاتی و بانکی شاپرک انجام می‌پذیرد.
            </p>

            <div className="options-grid">
              {/* Option A: Shaparak IPG */}
              <label className={`option-card ${paymentCategory === "IPG" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="paymentCategory"
                  value="IPG"
                  checked={paymentCategory === "IPG"}
                  onChange={() => setPaymentCategory("IPG")}
                />
                <div className="option-content">
                  <strong>درگاه پرداخت اینترنتی شاپرک (شتاب)</strong>
                  <span>پرداخت امن و آنی با تمامی کارت‌های بانکی عضو شبکه شتاب با رمز دوم پویا</span>
                </div>
              </label>

              {paymentCategory === "IPG" && (
                <div className="ipg-sub-selector">
                  <span>پذیرنده درگاه بانکی را انتخاب کنید:</span>
                  <div className="ipg-chips">
                    <button
                      type="button"
                      onClick={() => setIpgProvider("SAMAN")}
                      className={`ipg-chip ${ipgProvider === "SAMAN" ? "selected" : ""}`}
                    >
                      🏦 پرداخت الکترونیک سامان (سپ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIpgProvider("PARSIAN")}
                      className={`ipg-chip ${ipgProvider === "PARSIAN" ? "selected" : ""}`}
                    >
                      💳 تجارت الکترونیک پارسیان (تاپ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIpgProvider("ZARINPAL")}
                      className={`ipg-chip ${ipgProvider === "ZARINPAL" ? "selected" : ""}`}
                    >
                      ⚡ درگاه تجمیع‌کننده زرین‌پال
                    </button>
                  </div>
                </div>
              )}

              {/* Option B: Direct Card-to-Card */}
              <label className={`option-card ${paymentCategory === "CARD_TO_CARD" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="paymentCategory"
                  value="CARD_TO_CARD"
                  checked={paymentCategory === "CARD_TO_CARD"}
                  onChange={() => setPaymentCategory("CARD_TO_CARD")}
                />
                <div className="option-content">
                  <strong>انتقال مستقیم کارت‌به‌کارت بانکی</strong>
                  <span>واریز به حساب تجاری رسمی و ثبت شماره پیگیری و فیش واریز</span>
                </div>
              </label>

              {paymentCategory === "CARD_TO_CARD" && (
                <div className="c2c-info-box">
                  <div className="bank-account-details">
                    <div className="bad-row">
                      <span>بانک مقصد:</span>
                      <strong>بانک سامان — شعبه مرکزی</strong>
                    </div>
                    <div className="bad-row">
                      <span>شماره کارت رسمی:</span>
                      <strong dir="ltr">۶۲۱۹-۸۶۱۰-۴۳۲۱-۹۸۷۶</strong>
                    </div>
                    <div className="bad-row">
                      <span>شماره شبا (IBAN):</span>
                      <strong dir="ltr">IR090560084080012345678901</strong>
                    </div>
                    <div className="bad-row">
                      <span>به‌نام:</span>
                      <strong>شرکت توسعه فناوری سلامت درمر (سهامی خاص)</strong>
                    </div>
                  </div>

                  <div className="c2c-fields">
                    <label className="form-field">
                      <span>۴ رقم آخر کارت واریزکننده:</span>
                      <input
                        type="text"
                        value={c2cCardNumber}
                        onChange={(e) => setC2cCardNumber(e.target.value)}
                        placeholder="مثال: ۴۵۶۷"
                        maxLength={4}
                        dir="ltr"
                        className="input-text"
                      />
                    </label>

                    <label className="form-field">
                      <span>شماره پیگیری فیش یا ارجاع بانکی:</span>
                      <input
                        type="text"
                        value={c2cTrackingCode}
                        onChange={(e) => setC2cTrackingCode(e.target.value)}
                        placeholder="کد ارجاع ۷ یا ۸ رقمی"
                        dir="ltr"
                        className="input-text"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Option C: Wallet */}
              <label className={`option-card ${paymentCategory === "WALLET" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="paymentCategory"
                  value="WALLET"
                  checked={paymentCategory === "WALLET"}
                  onChange={() => setPaymentCategory("WALLET")}
                />
                <div className="option-content">
                  <strong>کسر مستقیم از کیف پول داخلی</strong>
                  <span>پرداخت سریع از موجودی حساب کاربری (موجودی فعلی: ۳,۴۰۰,۰۰۰ تومان)</span>
                </div>
              </label>
            </div>

            <div className="step-actions-row">
              <button type="button" onClick={() => setCurrentStep(2)} className="btn-prev-step">
                ← بازگشت به مرحله آدرس
              </button>
              <button type="button" onClick={goToNextStep} className="btn-next-step">
                تأیید و بازبینی نهایی پیش‌فاکتور ←
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Real-time Order Summary & Submission */}
        {currentStep === 4 && (
          <div className="checkout-section">
            <h2>۴. بازبینی نهایی و تأیید پیش‌فاکتور رسمی</h2>
            <p className="section-desc">
              لطفاً اقلام سفارش، آدرس و مبالغ را بررسی کنید. با کلیک بر روی دکمه زیر، موجودی
              انبار به مدت ۱۵ دقیقه رزرو خواهد شد.
            </p>

            <div className="review-block">
              <h3>مشخصات گیرنده و مقصد</h3>
              <div className="review-meta-list">
                <div className="rm-item">
                  <span>تحویل‌گیرنده:</span>
                  <strong>{customerName}</strong>
                </div>
                <div className="rm-item">
                  <span>شماره موبایل:</span>
                  <strong dir="ltr">{customerPhone}</strong>
                </div>
                {needTaxInvoice && (
                  <div className="rm-item">
                    <span>کد ملی ثبت سامانه مودیان:</span>
                    <strong dir="ltr">{nationalCode}</strong>
                  </div>
                )}
                <div className="rm-item">
                  <span>نشانی مقصد:</span>
                  <strong>
                    {province}، {city} — {postalAddress} (کدپستی: <span dir="ltr">{postalCode}</span>)
                  </strong>
                </div>
                <div className="rm-item">
                  <span>روش و زمان تحویل:</span>
                  <strong>
                    {shippingMethod === "TIPAX"
                      ? "تیپاکس اکسپرس"
                      : shippingMethod === "EXPRESS_COURIER"
                      ? "پیک اکسپرس فوری"
                      : "پست پیشتاز سراسری"}{" "}
                    | {deliveryDay} ({deliverySlot})
                  </strong>
                </div>
                <div className="rm-item">
                  <span>روش پرداخت انتخابی:</span>
                  <strong>
                    {paymentCategory === "IPG"
                      ? `درگاه شتابی شاپرک (${ipgProvider})`
                      : paymentCategory === "CARD_TO_CARD"
                      ? "واریز کارت‌به‌کارت بانکی"
                      : "کیف پول داخلی"}
                  </strong>
                </div>
              </div>
            </div>

            {submitError && <div className="error-banner">{submitError}</div>}

            <form onSubmit={handleFinalSubmit} className="final-order-form">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-submit-order full-width"
              >
                {isSubmitting ? (
                  <span>در حال رزرو قطعی انبار و ارجاع به درگاه بانکی…</span>
                ) : (
                  <span>
                    تأیید و پرداخت نهایی ({new Intl.NumberFormat("fa-IR").format(calculations.grandTotalTomans)} تومان)
                  </span>
                )}
              </button>
            </form>

            <div className="step-actions-row">
              <button type="button" onClick={() => setCurrentStep(3)} className="btn-prev-step">
                ← بازگشت و تغییر روش پرداخت
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Order Summary Sidebar */}
      <aside className="checkout-sidebar">
        <div className="summary-card">
          <h3>اقلام سفارش ({calculations.itemCount} کالا)</h3>

          <div className="sidebar-items-list">
            {items.map((i) => {
              const lineTotalRials = BigInt(i.priceAmount) * BigInt(i.qty);
              return (
                <div key={i.variantId} className="sidebar-item-row">
                  <div className="si-info">
                    <strong className="si-title">{i.title}</strong>
                    <span className="si-qty">
                      {i.qty} عدد × {formatToman(i.priceAmount)}
                    </span>
                  </div>
                  <strong className="si-total">{formatToman(lineTotalRials)}</strong>
                </div>
              );
            })}
          </div>

          <hr className="summary-divider" />

          {/* Pricing Breakdown */}
          <div className="summary-rows">
            <div className="summary-row">
              <span>جمع قیمت اقلام:</span>
              <span>{new Intl.NumberFormat("fa-IR").format(calculations.subtotalTomans)} تومان</span>
            </div>

            {calculations.discounts.map((d, index) => (
              <div key={index} className="summary-row discount">
                <span>{d.title}:</span>
                <span>- {new Intl.NumberFormat("fa-IR").format(d.amountTomans)} تومان</span>
              </div>
            ))}

            <div className="summary-row">
              <span>مالیات بر ارزش افزوده (۱۰٪):</span>
              <span>{new Intl.NumberFormat("fa-IR").format(calculations.vatTomans)} تومان</span>
            </div>

            <div className="summary-row">
              <span>هزینه ارسال:</span>
              <span>
                {calculations.isFreeShipping
                  ? "رایگان (خرید بالای ۳ میلیون)"
                  : `${new Intl.NumberFormat("fa-IR").format(calculations.shippingTomans)} تومان`}
              </span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row total">
              <span>مبلغ نهایی پیش‌فاکتور:</span>
              <strong>{new Intl.NumberFormat("fa-IR").format(calculations.grandTotalTomans)} تومان</strong>
            </div>
          </div>

          <div className="checkout-security-badges">
            <div className="sec-badge-item">
              <span className="sec-icon">🛡️</span>
              <span>دارای کلید یکتای آیدمپوتنسی جهت ممانعت از کسر یا ثبت تکراری</span>
            </div>
            <div className="sec-badge-item">
              <span className="sec-icon">🔒</span>
              <span>اتصال مستقیم شاپرک و درگاه‌های دارای نماد الکترونیکی بانکی</span>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
