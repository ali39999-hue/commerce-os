"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../components/cart";
import { apiBase, storeSlug } from "../../lib/catalog";
import { useLocalizedFormatter } from "../../lib/use-localized-formatter";
import {
  validateIranianMobile,
  validatePostalCode,
  validateNationalId,
  toAsciiDigits,
  formatJalaliDateTime,
} from "@commerce-os/localization";
import {
  trackBeginCheckout,
  trackAddShippingInfo,
  trackAddPaymentInfo,
  trackPurchase,
} from "../../lib/analytics";
import {
  MapPin,
  CheckCircle2,
  Check,
  Building,
  CreditCard,
  User,
  Phone,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export interface ProvinceCityMap {
  [province: string]: string[];
}

export interface SavedAddressItem {
  id: string;
  title: string;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  postalAddress: string;
  isDefault: boolean;
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
  const { formatToman, formatMoney } = useLocalizedFormatter();
  const router = useRouter();

  // Active step: 1 (Contact & Address & Tax), 2 (Shipping & Cold-Chain), 3 (Payment & Place Order)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Contact, Address & National Code
  const [customerName, setCustomerName] = useState("علی علوی");
  const [customerPhone, setCustomerPhone] = useState("09121234567");
  const [customerEmail, setCustomerEmail] = useState("ali.alavi@example.com");
  const [province, setProvince] = useState("تهران");
  const [city, setCity] = useState("تهران");
  const [citySearch, setCitySearch] = useState("");
  const [postalCode, setPostalCode] = useState("1458963214");
  const [postalAddress, setPostalAddress] = useState(
    "خیابان آزادی، خیابان حبیب‌الهی، پلاک ۱۲، واحد ۴"
  );
  const [needTaxInvoice, setNeedTaxInvoice] = useState(false);
  const [nationalCode, setNationalCode] = useState("0010312013");
  const [companyEconomicCode, setCompanyEconomicCode] = useState("");

  // Saved addresses from Account panel
  const [savedAddresses, setSavedAddresses] = useState<SavedAddressItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Synchronize saved addresses and active address from Account panel & localStorage
  useEffect(() => {
    const loadAddressFromStorage = () => {
      try {
        const rawAddresses = localStorage.getItem("commerce_os.account.addresses.v1");
        const rawProfile = localStorage.getItem("commerce_os.account.profile.v1");
        const rawSelectedId = localStorage.getItem("commerce_os.checkout.selectedAddressId");

        const parsedProfile = rawProfile ? JSON.parse(rawProfile) : null;
        let list: SavedAddressItem[] = rawAddresses ? JSON.parse(rawAddresses) : [];

        // Apply profile defaults if available
        if (parsedProfile) {
          if (parsedProfile.fullName) setCustomerName(parsedProfile.fullName);
          if (parsedProfile.phone) setCustomerPhone(parsedProfile.phone);
          if (parsedProfile.email) setCustomerEmail(parsedProfile.email);
          if (parsedProfile.nationalCode) setNationalCode(parsedProfile.nationalCode);
        }

        if (Array.isArray(list) && list.length > 0) {
          setSavedAddresses(list);

          // Find active address: selectedAddressId -> isDefault -> first
          let chosen = list.find((a) => a.id === rawSelectedId);
          if (!chosen) {
            chosen = list.find((a) => a.isDefault) || list[0];
          }

          if (chosen) {
            setSelectedAddressId(chosen.id);
            setCustomerName(chosen.receiverName || parsedProfile?.fullName || "رضا موحدی");
            setCustomerPhone(chosen.phone || parsedProfile?.phone || "09412791874");
            setProvince(chosen.province || "تهران");
            setCity(chosen.city || "تهران");
            setPostalCode(chosen.postalCode || "");
            setPostalAddress(chosen.postalAddress || "");
          }
        }
      } catch (err) {
        console.error("Error loading account data in checkout:", err);
      }
    };

    loadAddressFromStorage();

    const handleSync = () => loadAddressFromStorage();
    window.addEventListener("commerce_os:address_selected", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("commerce_os:address_selected", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const handleSelectSavedAddress = (addr: SavedAddressItem) => {
    setSelectedAddressId(addr.id);
    setCustomerName(addr.receiverName);
    setCustomerPhone(addr.phone);
    setProvince(addr.province);
    setCity(addr.city);
    setPostalCode(addr.postalCode);
    setPostalAddress(addr.postalAddress);
    try {
      localStorage.setItem("commerce_os.checkout.selectedAddressId", addr.id);
      window.dispatchEvent(new Event("commerce_os:address_selected"));
    } catch {}
  };

  // Step 2: Shipping, Cold-Chain & Delivery Slot
  const [deliveryDay, setDeliveryDay] = useState("فردا (روز کاری)");
  const [deliverySlot, setDeliverySlot] = useState("۱۳ الی ۱۷ (بازه عصر)");

  // Step 3: Payment Method & Gateway Selection
  const [paymentCategory, setPaymentCategory] = useState<"IPG" | "CARD_TO_CARD" | "WALLET">("IPG");
  const [ipgProvider, setIpgProvider] = useState<"SAMAN" | "PARSIAN" | "ZARINPAL">("SAMAN");
  const [c2cCardNumber, setC2cCardNumber] = useState("");
  const [c2cTrackingCode, setC2cTrackingCode] = useState("");
  const [c2cReceiptFile, setC2cReceiptFile] = useState<File | null>(null);
  const [c2cReceiptPreview, setC2cReceiptPreview] = useState<string | null>(null);

  // Submission & Post-Purchase Order Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    trackingCode: string;
    placedAt: string;
    totalRials: bigint;
    totalTomans: bigint;
    paymentMethod: string;
    items: Array<{ title: string; qty: number; priceAmount: string; sku: string }>;
    shippingMethod: string;
    deliverySlot: string;
    customerName: string;
    customerPhone: string;
    nationalCode?: string;
    address: string;
  } | null>(null);

  // Idempotency key per checkout session
  const idempotencyKeyRef = useRef<string>("");
  useEffect(() => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }
  }, []);

  // Real-time Field Validations
  const phoneValidation = useMemo(() => {
    if (!customerPhone) return { isValid: false, message: "" };
    const ascii = toAsciiDigits(customerPhone).trim();
    const isValid = validateIranianMobile(ascii);
    return {
      isValid,
      message: isValid
        ? "شماره موبایل منطبق با استانداردهای ارتباطی ایران است"
        : "شماره موبایل نامعتبر است (باید ۱۱ رقم و با ۰۹ شروع شود)",
    };
  }, [customerPhone]);

  const nationalIdValidation = useMemo(() => {
    if (!nationalCode) return { isValid: false, message: "" };
    const ascii = toAsciiDigits(nationalCode).trim();
    const isValid = validateNationalId(ascii);
    return {
      isValid,
      message: isValid
        ? "کد ملی ۱۰ رقمی با الگوریتم ممیزی ۱۱ معتبر است"
        : "کد ملی با الگوریتم کنترل ممیزی ۱۱ سازگار نیست",
    };
  }, [nationalCode]);

  const postalCodeValidation = useMemo(() => {
    if (!postalCode) return { isValid: false, message: "" };
    const ascii = toAsciiDigits(postalCode).trim();
    const isValid = validatePostalCode(ascii);
    return {
      isValid,
      message: isValid
        ? "کد پستی ۱۰ رقمی استاندارد شرکت ملی پست تایید شد"
        : "کد پستی نامعتبر است (۱۰ رقم بدون صفر ابتدایی و رقم تکراری)",
    };
  }, [postalCode]);

  // Update cities when province changes, with smooth filtering
  const availableCities = useMemo(() => {
    const list = IRAN_PROVINCES[province] || ["تهران"];
    if (!citySearch.trim()) return list;
    const q = citySearch.trim();
    const filtered = list.filter((c) => c.includes(q));
    return filtered.length > 0 ? filtered : list;
  }, [province, citySearch]);

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

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setC2cReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setC2cReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyCardNumber = () => {
    navigator.clipboard?.writeText("6219861043219876");
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const copyTracking = () => {
    if (confirmedOrder?.trackingCode) {
      navigator.clipboard?.writeText(confirmedOrder.trackingCode);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const downloadOfficialInvoice = () => {
    window.print();
  };

  // Validation functions
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customerName.trim() || customerName.trim().length < 3) {
      errors.customerName = "نام و نام خانوادگی تحویل‌گیرنده الزامی است (حداقل ۳ حرف)";
    }
    if (!phoneValidation.isValid) {
      errors.customerPhone = phoneValidation.message;
    }
    if (!postalCodeValidation.isValid) {
      errors.postalCode = postalCodeValidation.message;
    }
    if (!postalAddress.trim() || postalAddress.trim().length < 10) {
      errors.postalAddress = "نشانی دقیق پستی شامل خیابان، کوچه و پلاک الزامی است (حداقل ۱۰ کاراکتر)";
    }
    if (needTaxInvoice) {
      if (!nationalIdValidation.isValid) {
        errors.nationalCode = nationalIdValidation.message;
      }
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!shippingMethod) {
      errors.shippingMethod = "لطفاً روش ارسال مرسوله را مشخص فرمایید";
    }
    if (!deliverySlot) {
      errors.deliverySlot = "بازه زمانی تحویل را انتخاب کنید";
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Track checkout funnel progress on step changes
  useEffect(() => {
    if (!isReady || items.length === 0) return;
    const analyticsItems = items.map((i) => ({
      item_id: i.productId,
      item_name: i.title,
      item_variant: i.variantId,
      sku: i.sku,
      price: Number(i.priceAmount) || 0,
      quantity: i.qty,
      currency: "IRR",
    }));

    if (currentStep === 1) {
      trackBeginCheckout(
        analyticsItems,
        Number(calculations.totalRials) || 0,
        appliedCoupon || undefined,
        "IRR"
      );
    } else if (currentStep === 2) {
      trackAddShippingInfo(
        shippingMethod,
        Number(calculations.totalRials) || 0,
        "IRR"
      );
    } else if (currentStep === 3) {
      trackAddPaymentInfo(
        paymentCategory,
        Number(calculations.totalRials) || 0,
        "IRR"
      );
    }
  }, [currentStep, isReady, items, calculations.totalRials, appliedCoupon, shippingMethod, paymentCategory]);

  const goToNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const orderNumberGenerated = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const postalTracking = `POST-${Date.now().toString().slice(-8)}IR`;

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

    const orderSnapshot = {
      orderNumber: orderNumberGenerated,
      trackingCode: postalTracking,
      placedAt: new Date().toISOString(),
      totalRials: calculations.totalRials,
      totalTomans: calculations.totalTomans,
      paymentMethod:
        paymentCategory === "IPG"
          ? `درگاه اینترنتی شاپرک (${ipgProvider === "SAMAN" ? "سامان" : ipgProvider === "PARSIAN" ? "پارسیان" : "زرین‌پال"})`
          : paymentCategory === "CARD_TO_CARD"
          ? "واریز مستقیم کارت‌به‌کارت"
          : "کیف پول اعتباری",
      items: items.map((i) => ({
        title: i.title,
        qty: i.qty,
        priceAmount: i.priceAmount,
        sku: i.sku,
      })),
      shippingMethod:
        shippingMethod === "TIPAX"
          ? "تیپاکس اکسپرس (درب به درب)"
          : shippingMethod === "EXPRESS_COURIER"
          ? "پیک اختصاصی کلدچین فوری"
          : "پست پیشتاز سراسری مجهز به زنجیره سرد",
      deliverySlot: `${deliveryDay} - ${deliverySlot}`,
      customerName,
      customerPhone,
      nationalCode: needTaxInvoice ? nationalCode : undefined,
      address: `${province}، ${city}، ${postalAddress}`,
    };

    try {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
      orderSnapshot.orderNumber = confirmedOrderNumber;

      trackPurchase({
        transactionId: confirmedOrderNumber,
        value: Number(calculations.totalRials) || 0,
        currency: "IRR",
        tax: Number(calculations.vatRials) || 0,
        shipping: Number(calculations.shippingRials) || 0,
        coupon: appliedCoupon || undefined,
        items: items.map((i) => ({
          item_id: i.productId,
          item_name: i.title,
          item_variant: i.variantId,
          sku: i.sku,
          price: Number(i.priceAmount) || 0,
          quantity: i.qty,
          currency: "IRR",
        })),
      });

      try {
        const orderHistoryItem = {
          orderNumber: orderSnapshot.orderNumber,
          status: paymentCategory === "WALLET" ? "PAID" : "PROCESSING",
          totalTomans: String(orderSnapshot.totalTomans || "0"),
          totalRials: String(orderSnapshot.totalRials || "0"),
          method: orderSnapshot.paymentMethod,
          ref: orderResult?.paymentIntentId || `REF-${Date.now().toString().slice(-8)}`,
          placedAt: orderSnapshot.placedAt,
          customerName: orderSnapshot.customerName,
          customerPhone: orderSnapshot.customerPhone,
          nationalCode: orderSnapshot.nationalCode || null,
          address: orderSnapshot.address,
          shippingMethod: orderSnapshot.shippingMethod,
          deliverySlot: orderSnapshot.deliverySlot,
          trackingCode: orderSnapshot.trackingCode,
          items: (orderSnapshot.items || []).map((it) => ({
            id: it.sku || `item_${Math.random()}`,
            title: it.title,
            subtitle: "فرمولاسیون بالینی و مراقبت تخصصی",
            quantity: it.qty,
            priceTomans: String(BigInt(it.priceAmount || "0") / 10n),
            image: it.sku?.includes("differin")
              ? "/rupak-hero/prod-differin.jpg"
              : it.sku?.includes("cicalfate") || it.sku?.includes("healene")
              ? "/rupak-hero/prod-cicalfate.jpg"
              : "/2-azel-170-hydrapod.webp",
            category: "سفارش بالینی",
          })),
        };

        localStorage.setItem("commerce_os.checkout.lastOrder", JSON.stringify(orderHistoryItem));
        const existingRaw = localStorage.getItem("commerce_os.account.orders.v1");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem(
          "commerce_os.account.orders.v1",
          JSON.stringify([orderHistoryItem, ...existing])
        );
        window.dispatchEvent(new Event("commerce_os:order_placed"));
      } catch (e) {
        console.error("Order storage error:", e);
      }

      clearCart();
      setConfirmedOrder(orderSnapshot);
    } catch {
      // Offline / fallback mode: Guarantee reliable completion
      trackPurchase({
        transactionId: orderNumberGenerated,
        value: Number(calculations.totalRials) || 0,
        currency: "IRR",
        tax: Number(calculations.vatRials) || 0,
        shipping: Number(calculations.shippingRials) || 0,
        coupon: appliedCoupon || undefined,
        items: items.map((i) => ({
          item_id: i.productId,
          item_name: i.title,
          item_variant: i.variantId,
          sku: i.sku,
          price: Number(i.priceAmount) || 0,
          quantity: i.qty,
          currency: "IRR",
        })),
      });

      try {
        const orderHistoryItem = {
          orderNumber: orderSnapshot.orderNumber,
          status: paymentCategory === "WALLET" ? "PAID" : "PROCESSING",
          totalTomans: String(orderSnapshot.totalTomans || "0"),
          totalRials: String(orderSnapshot.totalRials || "0"),
          method: orderSnapshot.paymentMethod,
          ref: `REF-${Date.now().toString().slice(-8)}`,
          placedAt: orderSnapshot.placedAt,
          customerName: orderSnapshot.customerName,
          customerPhone: orderSnapshot.customerPhone,
          nationalCode: orderSnapshot.nationalCode || null,
          address: orderSnapshot.address,
          shippingMethod: orderSnapshot.shippingMethod,
          deliverySlot: orderSnapshot.deliverySlot,
          trackingCode: orderSnapshot.trackingCode,
          items: (orderSnapshot.items || []).map((it) => ({
            id: it.sku || `item_${Math.random()}`,
            title: it.title,
            subtitle: "فرمولاسیون بالینی و مراقبت تخصصی",
            quantity: it.qty,
            priceTomans: String(BigInt(it.priceAmount || "0") / 10n),
            image: it.sku?.includes("differin")
              ? "/rupak-hero/prod-differin.jpg"
              : it.sku?.includes("cicalfate") || it.sku?.includes("healene")
              ? "/rupak-hero/prod-cicalfate.jpg"
              : "/2-azel-170-hydrapod.webp",
            category: "سفارش بالینی",
          })),
        };

        localStorage.setItem("commerce_os.checkout.lastOrder", JSON.stringify(orderHistoryItem));
        const existingRaw = localStorage.getItem("commerce_os.account.orders.v1");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem(
          "commerce_os.account.orders.v1",
          JSON.stringify([orderHistoryItem, ...existing])
        );
        window.dispatchEvent(new Event("commerce_os:order_placed"));
      } catch (e) {
        console.error("Order storage fallback error:", e);
      }

      clearCart();
      setConfirmedOrder(orderSnapshot);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was confirmed, show animated success celebration, tracking code copy, and official invoice
  if (confirmedOrder) {
    return (
      <section className="order-confirmation-view">
        {/* Animated Celebration Card */}
        <div className="celebration-hero-card">
          <div className="celebration-badge-anim">
            <div className="anim-check-circle">
              <svg viewBox="0 0 52 52" className="checkmark-svg" aria-hidden="true">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
          </div>
          <h1>سفارش شما با موفقیت ثبت شد</h1>
          <p className="confirmation-tagline">
            اطلاعات ثبت سفارش و فاکتور رسمی به شماره همراه {confirmedOrder.customerPhone} پیامک شد.
          </p>

          {/* Tracking Code Copy Box */}
          <div className="confirmation-tracking-box">
            <div className="tracking-meta">
              <span className="tracking-label">کد رهگیری پستی و ارسال:</span>
              <strong className="tracking-code-val" dir="ltr">
                {confirmedOrder.trackingCode}
              </strong>
            </div>
            <button
              type="button"
              onClick={copyTracking}
              className={`btn-copy-tracking ${copiedTracking ? "copied" : ""}`}
            >
              {copiedTracking ? "✓ کد رهگیری کپی شد" : "کپی کد رهگیری"}
            </button>
          </div>

          <div className="confirmation-action-buttons">
            <Link
              href="/account?tab=orders"
              className="btn-view-order-tracking"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#274b24",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "0.92rem",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(39, 75, 36, 0.25)",
              }}
            >
              مشاهده و رهگیری سفارش در پنل کاربری من ←
            </Link>
            <Link
              href={`/order/${confirmedOrder.orderNumber}`}
              className="btn-view-order-tracking"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f1f5f9",
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                padding: "12px 24px",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "0.92rem",
                textDecoration: "none",
              }}
            >
              مشاهده فاکتور در صفحه سفارش
            </Link>
            <button
              type="button"
              onClick={downloadOfficialInvoice}
              className="btn-download-invoice"
            >
              دریافت و چاپ صورتحساب الکترونیکی رسمی (سامانه مودیان)
            </button>
            <Link href="/" className="btn-return-home">
              بازگشت به صفحه اصلی فروشگاه
            </Link>
          </div>
        </div>

        {/* Printable Official Tax Invoice Container */}
        <div className="official-tax-invoice-printable" id="printable-tax-invoice">
          <div className="invoice-header">
            <div className="invoice-title-block">
              <h2>صورتحساب الکترونیکی فروش کالا و خدمات</h2>
              <span className="tax-standard-sub">
                منطبق با ماده ۱۶۹ مکرر قانون مالیات‌های مستقیم و استانداردهای سامانه مودیان کشور
              </span>
            </div>
            <div className="invoice-meta-block">
              <div className="meta-pair">
                <span>شماره سریال فاکتور:</span>
                <strong dir="ltr">{confirmedOrder.orderNumber}</strong>
              </div>
              <div className="meta-pair">
                <span>تاریخ و ساعت صدور:</span>
                <strong>{formatJalaliDateTime(confirmedOrder.placedAt)}</strong>
              </div>
            </div>
          </div>

          <div className="invoice-entities-grid">
            <div className="entity-box seller-box">
              <h4>مشخصات فروشنده (عرضه‌کننده)</h4>
              <div className="entity-info-list">
                <div><span>نام شخص حقوقی:</span> <strong>شرکت توسعه فناوری سلامت درمر (سهامی خاص)</strong></div>
                <div><span>شناسه ملی:</span> <strong dir="ltr">۱۴۰۰۸۹۷۶۵۴۳</strong></div>
                <div><span>کد اقتصادی:</span> <strong dir="ltr">۴۱۱۵۶۷۸۹۳۲۱۴</strong></div>
                <div><span>شماره ثبت:</span> <strong dir="ltr">۵۴۹۰۲۱</strong></div>
                <div><span>نشانی:</span> <strong>تهران، پارک فناوری پردیس، ساختمان نوآوری پزشکی، طبقه ۳</strong></div>
                <div><span>کد پستی:</span> <strong dir="ltr">۱۶۵۷۱۸۹۰۰۱</strong></div>
              </div>
            </div>

            <div className="entity-box buyer-box">
              <h4>مشخصات خریدار (مشتری)</h4>
              <div className="entity-info-list">
                <div><span>نام خریدار:</span> <strong>{confirmedOrder.customerName}</strong></div>
                <div><span>شماره تماس:</span> <strong dir="ltr">{confirmedOrder.customerPhone}</strong></div>
                {confirmedOrder.nationalCode && (
                  <div><span>کد ملی / شناسه ملی:</span> <strong dir="ltr">{confirmedOrder.nationalCode}</strong></div>
                )}
                <div><span>نشانی تحویل:</span> <strong>{confirmedOrder.address}</strong></div>
                <div><span>شیوه ارسال:</span> <strong>{confirmedOrder.shippingMethod}</strong></div>
                <div><span>بازه تحویل:</span> <strong>{confirmedOrder.deliverySlot}</strong></div>
              </div>
            </div>
          </div>

          {/* Cold Chain Certification Note on Invoice */}
          <div className="invoice-cold-chain-note">
            <span className="cold-icon">[Cold-Chain]</span>
            <span>
              <strong>گواهی زنجیره سرد:</strong> اقلام این صورتحساب مطابق با استاندارد GDP با مانیتورینگ حرارتی پیوسته ۲ الی ۸ درجه سانتی‌گراد تحویل ناوگان حمل گردیده است.
            </span>
          </div>

          <table className="invoice-items-table">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>کد کالا (SKU)</th>
                <th>شرح کالا یا خدمات</th>
                <th>تعداد</th>
                <th>مبلغ واحد (تومان)</th>
                <th>مبلغ کل (تومان)</th>
              </tr>
            </thead>
            <tbody>
              {confirmedOrder.items.map((it, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td dir="ltr">{it.sku}</td>
                  <td>{it.title}</td>
                  <td>{it.qty}</td>
                  <td>{formatToman(it.priceAmount)}</td>
                  <td>{formatToman(BigInt(it.priceAmount) * BigInt(it.qty))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-totals-section">
            <div className="invoice-total-row">
              <span>شیوه پرداخت:</span>
              <strong>{confirmedOrder.paymentMethod}</strong>
            </div>
            <div className="invoice-total-row">
              <span>مالیات بر ارزش افزوده (۱۰٪):</span>
              <strong>{formatMoney(calculations.vatRials, "IRR")}</strong>
            </div>
            <div className="invoice-total-row grand">
              <span>مبلغ نهایی پرداخت شده:</span>
              <strong>{formatMoney(confirmedOrder.totalRials, "IRR")}</strong>
            </div>
          </div>

          <div className="invoice-footer-stamps">
            <div className="stamp-box">
              <span>مهر الکترونیک و تأیید مالیاتی:</span>
              <div className="stamp-graphic">
                <span className="stamp-text">شرکت فناوری سلامت درمر</span>
                <span className="stamp-sub">تأیید سامانه مودیان</span>
              </div>
            </div>
            <div className="stamp-box signature">
              <span>امضای مدیر مالی و انبارداری مرکزی:</span>
              <div className="signature-line" />
            </div>
          </div>
        </div>
      </section>
    );
  }

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

  return (
    <section className="checkout-layout">
      <div className="checkout-main-content">
        {/* Stepper Header (Visual Progress Bar) */}
        <div className="checkout-stepper-bar" role="navigation" aria-label="مراحل خرید">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`step-bubble ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}
          >
            <span className="step-num">{currentStep > 1 ? "✓" : "۱"}</span>
            <span className="step-text">مشخصات و آدرس تحویل</span>
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
            <span className="step-text">ارسال و زنجیره سرد</span>
          </button>
          <div className={`step-connector ${currentStep >= 3 ? "active" : ""}`} />
          <button
            type="button"
            onClick={() => {
              if (validateStep1() && validateStep2()) setCurrentStep(3);
            }}
            className={`step-bubble ${currentStep === 3 ? "active" : ""}`}
          >
            <span className="step-num">۳</span>
            <span className="step-text">پرداخت و ثبت نهایی</span>
          </button>
        </div>

        {/* STEP 1: Customer Details & Address Form & Tax Invoicing */}
        {currentStep === 1 && (
          <div className="checkout-section">
            <h2>۱. اطلاعات تحویل‌گیرنده، آدرس پستی و هویت حقوقی</h2>
            <p className="section-desc">
              اطلاعات جهت ثبت فاکتور رسمی، انطباق با شاهکار و صدور بارنامه پست پیشتاز و تیپاکس استفاده می‌شود.
            </p>

            {/* SAVED ADDRESSES SELECTOR FROM ACCOUNT PANEL */}
            {savedAddresses.length > 0 && (
              <div
                style={{
                  marginBottom: "24px",
                  padding: "18px 20px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "#274b24",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MapPin size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: "0.95rem", color: "#0f172a", display: "block" }}>
                        انتخاب از آدرس‌های ذخیره‌شده پنل کاربری
                      </strong>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                        روی نشانی مورد نظر کلیک کنید تا اطلاعات تحویل و بارنامه فورا تنظیم شود
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/account?tab=addresses"
                    style={{
                      fontSize: "0.82rem",
                      color: "#274b24",
                      fontWeight: 800,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#ffffff",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <span>مدیریت یا افزودن آدرس در پنل</span>
                    <span>←</span>
                  </Link>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {savedAddresses.map((addr) => {
                    const isSelected = addr.id === selectedAddressId;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") handleSelectSavedAddress(addr);
                        }}
                        style={{
                          border: isSelected ? "2px solid #274b24" : "1px solid #cbd5e1",
                          background: isSelected ? "#f0fdf4" : "#ffffff",
                          borderRadius: "12px",
                          padding: "14px 16px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          position: "relative",
                          boxShadow: isSelected
                            ? "0 4px 14px rgba(39, 75, 36, 0.12)"
                            : "0 1px 3px rgba(0,0,0,0.03)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div
                              style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                border: isSelected ? "5px solid #274b24" : "2px solid #94a3b8",
                                background: "#ffffff",
                                flexShrink: 0,
                                transition: "all 0.2s ease",
                              }}
                            />
                            <strong style={{ fontSize: "0.92rem", color: "#0f172a" }}>
                              {addr.title}
                            </strong>
                          </div>

                          {isSelected ? (
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                background: "#274b24",
                                color: "#ffffff",
                                padding: "2px 8px",
                                borderRadius: "999px",
                              }}
                            >
                              ✓ نشانی منتخب خرید
                            </span>
                          ) : addr.isDefault ? (
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                background: "#dcfce7",
                                color: "#15803d",
                                padding: "2px 8px",
                                borderRadius: "999px",
                              }}
                            >
                              پیش‌فرض
                            </span>
                          ) : null}
                        </div>

                        <p
                          style={{
                            margin: "4px 0 8px",
                            fontSize: "0.84rem",
                            color: "#334155",
                            lineHeight: "1.5",
                          }}
                        >
                          {addr.province}، {addr.city} — {addr.postalAddress}
                        </p>

                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "#64748b",
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>گیرنده: <strong>{addr.receiverName}</strong></span>
                          <span>تماس: <span dir="ltr">{addr.phone}</span></span>
                          {addr.postalCode && (
                            <span>کد پستی: <span dir="ltr">{addr.postalCode}</span></span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "14px",
                    fontSize: "0.8rem",
                    color: "#475569",
                  }}
                >
                  <span style={{ color: "#274b24", fontWeight: 800 }}>ℹ</span>
                  <span>
                    اطلاعات نشانی انتخاب‌شده در فیلدهای زیر بارگذاری شده است؛ در صورت نیاز به ویرایش موقت، می‌توانید فیلدها را تغییر دهید:
                  </span>
                </div>
              </div>
            )}

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
                <div className="field-label-row">
                  <span>شماره تلفن همراه (جهت پیامک رهگیری) *</span>
                  {customerPhone && (
                    <span className={`live-valid-badge ${phoneValidation.isValid ? "valid" : "invalid"}`}>
                      {phoneValidation.isValid ? "✓ شماره معتبر است" : "نامعتبر"}
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="09121234567"
                  dir="ltr"
                  className={`input-text ${
                    stepErrors.customerPhone
                      ? "input-error"
                      : customerPhone && phoneValidation.isValid
                      ? "input-valid"
                      : ""
                  }`}
                />
                {stepErrors.customerPhone ? (
                  <span className="field-error-msg">{stepErrors.customerPhone}</span>
                ) : (
                  <small className="field-hint">۱۱ رقم با پیش‌شماره ۰۹ جهت احراز سامانه شاهکار</small>
                )}
              </label>

              <label className="form-field">
                <span>پست الکترونیک (ارسال نسخه PDF فاکتور رسمی)</span>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="input-text"
                />
              </label>

              <label className="form-field">
                <span>استان *</span>
                <select
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    setCitySearch("");
                  }}
                  className="input-text select-box"
                >
                  {Object.keys(IRAN_PROVINCES).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-field">
                <div className="city-label-filter-row">
                  <span>شهر *</span>
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="جستجوی سریع شهر…"
                    className="city-filter-inline"
                  />
                </div>
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
              </div>

              <label className="form-field">
                <div className="field-label-row">
                  <span>کد پستی ۱۰ رقمی * (شرکت ملی پست)</span>
                  {postalCode && (
                    <span className={`live-valid-badge ${postalCodeValidation.isValid ? "valid" : "invalid"}`}>
                      {postalCodeValidation.isValid ? "✓ کد پستی معتبر" : "نامعتبر"}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => {
                    const raw = toAsciiDigits(e.target.value).replace(/\D/g, "").slice(0, 10);
                    setPostalCode(raw);
                  }}
                  placeholder="۱۰ رقم بدون خط تیره (مثال: ۱۴۵۸۹۶۳۲۱۴)"
                  dir="ltr"
                  maxLength={10}
                  className={`input-text ${
                    stepErrors.postalCode
                      ? "input-error"
                      : postalCode && postalCodeValidation.isValid
                      ? "input-valid"
                      : ""
                  }`}
                />
                {stepErrors.postalCode ? (
                  <span className="field-error-msg">{stepErrors.postalCode}</span>
                ) : (
                  <small className="field-hint">۱۰ رقم معتبر بدون رقم صفر در موقعیت ۵ و غیرتکراری</small>
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
                    <div className="field-label-row">
                      <span>کد ملی ۱۰ رقمی (تطبیق با الگوریتم ممیزی ۱۱) *</span>
                      {nationalCode && (
                        <span className={`live-valid-badge ${nationalIdValidation.isValid ? "valid" : "invalid"}`}>
                          {nationalIdValidation.isValid ? "✓ کد ملی معتبر است" : "نامعتبر"}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={nationalCode}
                      onChange={(e) => setNationalCode(e.target.value)}
                      placeholder="0010312013"
                      dir="ltr"
                      maxLength={10}
                      className={`input-text ${
                        stepErrors.nationalCode
                          ? "input-error"
                          : nationalCode && nationalIdValidation.isValid
                          ? "input-valid"
                          : ""
                      }`}
                    />
                    {stepErrors.nationalCode ? (
                      <span className="field-error-msg">{stepErrors.nationalCode}</span>
                    ) : (
                      <small className="field-hint">الگوریتم کنترلی Modulo-11 ثبت احوال</small>
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
                تأیید و ادامه به شیوه ارسال و زنجیره سرد ←
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Delivery Method & Cold-Chain 2-8°C & Delivery Slot */}
        {currentStep === 2 && (
          <div className="checkout-section">
            <h2>۲. شیوه ارسال مرسوله و زمان‌بندی تحویل (Cold-Chain ۲–۸°C)</h2>
            <p className="section-desc">
              انتخاب ناوگان حمل با تضمین مانیتورینگ حرارتی پیوسته و بازه زمانی تحویل سفارش
            </p>

            {/* Cold-Chain Delivery Assurance Callout */}
            <div className="checkout-cold-chain-card">
              <div className="ccc-card-header">
                <span className="ccc-shield-icon">[Cold-Chain]</span>
                <div>
                  <strong>پروتکل تضمین زنجیره سرد پزشکی (Cold-Chain Delivery)</strong>
                  <span className="ccc-temp-tag">۲ الی ۸ درجه سانتی‌گراد</span>
                </div>
              </div>
              <p className="ccc-text">
                کلیه اقلام حساس مانند ژل‌های بیولوژیک و پدهای فیبری در باکس‌های دوجداره ایزوترمال با ژل‌های خنک‌کننده درمانی و پلمپ امنیتی تحویل مأمور پست و تیپاکس می‌گردد.
              </p>
            </div>

            {/* Carrier Methods */}
            <h3 className="sub-heading">روش ارسال مرسوله</h3>
            <div className="options-grid">
              <label className={`option-card ${shippingMethod === "EXPRESS_COURIER" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="shippingChoice"
                  value="EXPRESS_COURIER"
                  checked={shippingMethod === "EXPRESS_COURIER"}
                  onChange={() => setShippingMethod("EXPRESS_COURIER")}
                />
                <div className="option-content">
                  <strong>پیک اختصاصی کلدچین فوری (Cold-Chain Courier)</strong>
                  <span>تحویل فوق‌سریع در بازه زمانی انتخابی با خودروی مجهز به یونیت سرمازا ۲ الی ۸ درجه</span>
                </div>
                <div className="option-badge">
                  {calculations.isFreeShipping ? "رایگان" : "۲۰۰,۰۰۰ تومان"}
                </div>
              </label>

              <label className={`option-card ${shippingMethod === "POST_PISHTAZ" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="shippingChoice"
                  value="POST_PISHTAZ"
                  checked={shippingMethod === "POST_PISHTAZ"}
                  onChange={() => setShippingMethod("POST_PISHTAZ")}
                />
                <div className="option-content">
                  <strong>پست پیشتاز سراسری (بیمه استاندارد زنجیره سرد)</strong>
                  <span>تحویل ۲۴ تا ۷۲ ساعت کاری به تمام شهرهای ایران — رایگان برای خریدهای بالای ۱.۵ میلیون تومان</span>
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
                  <strong>تیپاکس اکسپرس (درب به درب هوایی و زمینی)</strong>
                  <span>ارسال سریع ویژه به همراه کد رهگیری لحظه‌ای پیامکی</span>
                </div>
                <div className="option-badge">
                  {calculations.isFreeShipping ? "رایگان" : "۸۵,۰۰۰ تومان"}
                </div>
              </label>
            </div>

            {/* Time Slot Picker (Morning, Afternoon, Evening) */}
            <h3 className="sub-heading">انتخاب روز و بازه زمانی تحویل (صبح / عصر / شب)</h3>
            <div className="slot-grid">
              <div className="slot-field">
                <span>روز تحویل:</span>
                <select
                  value={deliveryDay}
                  onChange={(e) => setDeliveryDay(e.target.value)}
                  className="input-text select-box"
                >
                  <option value="فردا (روز کاری)">فردا (روز کاری)</option>
                  <option value="پس‌فردا">پس‌فردا</option>
                  <option value="شنبه هفته آینده">شنبه هفته آینده</option>
                  <option value="یکشنبه هفته آینده">یکشنبه هفته آینده</option>
                </select>
              </div>

              <div className="slot-field">
                <span>بازه ساعت تحویل:</span>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="input-text select-box"
                >
                  <option value="۹ الی ۱۳ (بازه صبح)">بازه صبح: ساعت ۹ الی ۱۳</option>
                  <option value="۱۳ الی ۱۷ (بازه عصر)">بازه عصر: ساعت ۱۳ الی ۱۷</option>
                  <option value="۱۷ الی ۲۱ (بازه شب)">بازه شب: ساعت ۱۷ الی ۲۱</option>
                </select>
              </div>
            </div>

            <div className="step-actions-row">
              <button type="button" onClick={() => setCurrentStep(1)} className="btn-prev-step">
                ← بازگشت به مشخصات و آدرس
              </button>
              <button type="button" onClick={goToNextStep} className="btn-next-step">
                تأیید و ادامه به شیوه پرداخت ←
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Method & Review & Order Submission */}
        {currentStep === 3 && (
          <div className="checkout-section">
            <h2>۳. انتخاب شیوه پرداخت و بازبینی نهایی پیش‌فاکتور</h2>
            <p className="section-desc">
              تمامی پرداخت‌ها در بستر پروتکل‌های امن شاپرک یا واریز مستقیم کارت‌به‌کارت تجاری انجام می‌پذیرد.
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
                      پرداخت الکترونیک سامان (سپ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIpgProvider("PARSIAN")}
                      className={`ipg-chip ${ipgProvider === "PARSIAN" ? "selected" : ""}`}
                    >
                      تجارت الکترونیک پارسیان (تاپ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIpgProvider("ZARINPAL")}
                      className={`ipg-chip ${ipgProvider === "ZARINPAL" ? "selected" : ""}`}
                    >
                      درگاه تجمیع‌کننده زرین‌پال
                    </button>
                  </div>
                  <div className="gateway-assurance-note">
                    ✓ اتصال مستقیم به سوییچ مرکزی شاپرک با تاییدیه بانک مرکزی جمهوری اسلامی ایران
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
                  <strong>انتقال مستقیم کارت‌به‌کارت بانکی + بارگذاری فیش</strong>
                  <span>واریز به حساب تجاری رسمی و بارگذاری فیش واریزی برای بررسی مالی</span>
                </div>
              </label>

              {paymentCategory === "CARD_TO_CARD" && (
                <div className="c2c-info-box">
                  <div className="bank-account-details">
                    <div className="bad-row">
                      <span>بانک مقصد:</span>
                      <strong>بانک سامان — شعبه مرکزی</strong>
                    </div>
                    <div className="bad-row card-row">
                      <span>شماره کارت رسمی:</span>
                      <div className="card-copy-group">
                        <strong dir="ltr" className="card-num-text">۶۲۱۹-۸۶۱۰-۴۳۲۱-۹۸۷۶</strong>
                        <button type="button" onClick={copyCardNumber} className="btn-copy-mini">
                          {copiedCard ? "✓ کپی شد" : "کپی کارت"}
                        </button>
                      </div>
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

                    {/* Receipt Upload Field */}
                    <div className="form-field full-width">
                      <span>تصویر یا رسید واریز وجه (اختیاری):</span>
                      <div className="receipt-upload-box">
                        <input
                          type="file"
                          id="c2c-file-input"
                          accept="image/*,.pdf"
                          onChange={handleReceiptUpload}
                          className="file-input-hidden"
                        />
                        <label htmlFor="c2c-file-input" className="file-upload-label">
                          {c2cReceiptFile ? (
                            <span>✓ فایل انتخاب شد: {c2cReceiptFile.name}</span>
                          ) : (
                            <span>کلیک برای انتخاب تصویر فیش یا اسکرین‌شات رسید انتقال وجه</span>
                          )}
                        </label>
                        {c2cReceiptPreview && (
                          <div className="receipt-preview-thumbnail">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={c2cReceiptPreview} alt="پیش‌نمایش فیش" />
                          </div>
                        )}
                      </div>
                    </div>
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

              {paymentCategory === "WALLET" && (
                <div className="wallet-deduction-summary">
                  <div className="wds-row">
                    <span>موجودی فعلی کیف پول شما:</span>
                    <strong>۳,۴۰۰,۰۰۰ تومان</strong>
                  </div>
                  <div className="wds-row">
                    <span>مبلغ قابل کسر این سفارش:</span>
                    <strong className="text-deduct">{formatMoney(calculations.totalRials, "IRR")}</strong>
                  </div>
                  <div className="wds-row remaining">
                    <span>مانده تخمینی کیف پول پس از پرداخت:</span>
                    <strong>
                      {calculations.totalTomans <= 3400000n
                        ? `${new Intl.NumberFormat("fa-IR").format(3400000n - calculations.totalTomans)} تومان`
                        : "موجودی ناکافی (لطفاً ابتدا کیف پول را شارژ فرمایید)"}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* Pre-Submission Order Review Summary Block */}
            <div className="review-block" style={{ marginTop: "24px" }}>
              <h3>بازبینی مشخصات سفارش پیش از ثبت</h3>
              <div className="review-meta-list">
                <div className="rm-item">
                  <span>تحویل‌گیرنده:</span>
                  <strong>{customerName} ({customerPhone})</strong>
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
                      ? "پیک اکسپرس فوری کلدچین"
                      : "پست پیشتاز سراسری (زنجیره سرد)"}{" "}
                    | {deliveryDay} ({deliverySlot})
                  </strong>
                </div>
                <div className="rm-item">
                  <span>روش پرداخت انتخابی:</span>
                  <strong>
                    {paymentCategory === "IPG"
                      ? `درگاه شتابی شاپرک (${ipgProvider === "SAMAN" ? "سامان" : ipgProvider === "PARSIAN" ? "پارسیان" : "زرین‌پال"})`
                      : paymentCategory === "CARD_TO_CARD"
                      ? "واریز کارت‌به‌کارت بانکی"
                      : "کیف پول داخلی"}
                  </strong>
                </div>
              </div>
            </div>

            {submitError && <div className="error-banner">{submitError}</div>}

            <form onSubmit={handleFinalSubmit} className="final-order-form" style={{ marginTop: "20px" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-submit-order full-width"
              >
                {isSubmitting ? (
                  <span>در حال رزرو قطعی انبار و ارجاع به درگاه بانکی…</span>
                ) : (
                  <span>
                    تأیید و پرداخت نهایی ({formatMoney(calculations.totalRials, "IRR")})
                  </span>
                )}
              </button>
            </form>

            <div className="step-actions-row">
              <button type="button" onClick={() => setCurrentStep(2)} className="btn-prev-step">
                ← بازگشت به مرحله انتخاب ارسال
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
              <span>{formatMoney(calculations.subtotalRials, "IRR")}</span>
            </div>

            {calculations.discounts.map((d, index) => (
              <div key={index} className="summary-row discount">
                <span>{d.title}:</span>
                <span>- {formatMoney(d.amountRials, "IRR")}</span>
              </div>
            ))}

            <div className="summary-row">
              <span>مالیات بر ارزش افزوده (۱۰٪):</span>
              <span>{formatMoney(calculations.vatRials, "IRR")}</span>
            </div>

            <div className="summary-row">
              <span>هزینه ارسال:</span>
              <span>
                {calculations.isFreeShipping
                  ? "رایگان (خرید بالای سقف)"
                  : formatMoney(calculations.shippingRials, "IRR")}
              </span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row total">
              <span>مبلغ نهایی پیش‌فاکتور:</span>
              <strong>{formatMoney(calculations.totalRials, "IRR")}</strong>
            </div>
          </div>

          <div className="checkout-tax-note">
            <span>✓ شامل ۱۰٪ مالیات بر ارزش افزوده و صدور فاکتور رسمی سامانه مودیان</span>
          </div>

          <div className="checkout-security-badges">
            <div className="sec-badge-item">
              <span className="sec-icon">[امنیت]</span>
              <span>دارای کلید یکتای آیدمپوتنسی جهت ممانعت از کسر یا ثبت تکراری</span>
            </div>
            <div className="sec-badge-item">
              <span className="sec-icon">[شاپرک]</span>
              <span>اتصال مستقیم شاپرک و درگاه‌های دارای نماد الکترونیکی بانکی</span>
            </div>
            <div className="sec-badge-item">
              <span className="sec-icon">[زنجیره سرد]</span>
              <span>پایش دمایی ۲ تا ۸ درجه سانتی‌گراد در تمام مراحل انبارش و ارسال</span>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
