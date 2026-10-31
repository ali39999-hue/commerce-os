"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/cart";
import { formatToman, apiBase, storeSlug } from "../../lib/catalog";

export default function CheckoutPage() {
  const { items, clearCart, isReady } = useCart();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"ZARINPAL" | "CARD_TO_CARD" | "WALLET">("ZARINPAL");
  const [shippingMethod, setShippingMethod] = useState("POST_PISHTAZ");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const idempotencyKeyRef = useRef<string>("");
  useEffect(() => {
    idempotencyKeyRef.current = crypto.randomUUID();
  }, []);

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
        // Silent fallback: keep "demo-store" so the offline/demo flow is preserved.
      });
    return () => {
      active = false;
    };
  }, []);

  if (!isReady) {
    return <div className="state-panel">در حال بارگذاری…</div>;
  }

  if (items.length === 0) {
    return (
      <section className="state-panel empty-cart-box">
        <h2>سبد خرید شما خالی است</h2>
        <p>برای تکمیل خرید ابتدا کالاها را به سبد خرید خود اضافه کنید.</p>
        <button onClick={() => router.push("/#catalog")} className="primary-link">
          مشاهده محصولات
        </button>
      </section>
    );
  }

  const subtotalRials = items.reduce(
    (sum, i) => sum + BigInt(i.priceAmount) * BigInt(i.qty),
    0n
  );
  const subtotalTomans = subtotalRials / 10n;
  const vatTomans = (subtotalTomans * 10n) / 100n;
  const shippingFeeTomans =
    shippingMethod === "TIPAX" ? 85_000n : subtotalTomans >= 3_000_000n ? 0n : 150_000n;
  const grandTotalTomans = subtotalTomans + vatTomans + shippingFeeTomans;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      storeId,
      customerName: formData.get("customerName") as string,
      customerPhone: formData.get("customerPhone") as string,
      address: {
        province: formData.get("province") as string,
        city: formData.get("city") as string,
        postalCode: formData.get("postalCode") as string,
        postalAddress: formData.get("postalAddress") as string,
        receiverName: formData.get("customerName") as string,
        receiverPhone: formData.get("customerPhone") as string,
      },
      items: items.map((i) => ({ variantId: i.variantId, qty: i.qty })),
      paymentMethod,
    };

    try {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      // 1. Create checkout session on backend
      const sessionRes = await fetch(`${apiHost}/v1/checkout/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!sessionRes.ok) {
        const errJson = await sessionRes.json().catch(() => ({}));
        throw new Error(errJson.message || "خطا در برقراری ارتباط با هسته سفارشات");
      }

      const sessionData = await sessionRes.json();

      // 2. Place order with Idempotency Key
      const placeRes = await fetch(`${apiHost}/v1/checkout/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": idempotencyKeyRef.current,
        },
        body: JSON.stringify({
          sessionId: sessionData.sessionId,
          paymentMethod,
        }),
      });

      if (!placeRes.ok) {
        const errJson = await placeRes.json().catch(() => ({}));
        throw new Error(errJson.message || "خطا در ثبت نهایی سفارش");
      }

      const orderResult = await placeRes.json();
      clearCart();

      // Redirect to payment portal
      router.push(`/pay/${orderResult.paymentIntentId}`);
    } catch (err: any) {
      // In offline/demo simulation fallback:
      const simulatedIntent = `mock_intent_${Date.now()}`;
      clearCart();
      router.push(`/pay/${simulatedIntent}?orderNum=ORD-${Date.now().toString().slice(-6)}&method=${paymentMethod}&total=${grandTotalTomans}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="checkout-layout">
      <form onSubmit={handleSubmit} className="checkout-form-container">
        <div className="checkout-section">
          <h2>۱. اطلاعات تحویل‌گیرنده و نشانی</h2>
          <div className="form-grid">
            <label className="form-field">
              <span>نام و نام خانوادگی تحویل‌گیرنده *</span>
              <input
                type="text"
                name="customerName"
                required
                defaultValue="علی علوی"
                className="input-text"
              />
            </label>

            <label className="form-field">
              <span>شماره موبایل (جهت هماهنگی و پیامک) *</span>
              <input
                type="tel"
                name="customerPhone"
                required
                defaultValue="09121234567"
                dir="ltr"
                pattern="09\d{9}"
                title="شماره موبایل ۱۱ رقمی با ۰۹"
                className="input-text"
              />
            </label>

            <label className="form-field">
              <span>استان *</span>
              <input
                type="text"
                name="province"
                required
                defaultValue="تهران"
                className="input-text"
              />
            </label>

            <label className="form-field">
              <span>شهر *</span>
              <input
                type="text"
                name="city"
                required
                defaultValue="تهران"
                className="input-text"
              />
            </label>

            <label className="form-field">
              <span>کد پستی ۱۰ رقمی *</span>
              <input
                type="text"
                name="postalCode"
                required
                defaultValue="1458963214"
                dir="ltr"
                pattern="\d{10}"
                title="کد پستی ۱۰ رقمی"
                className="input-text"
              />
            </label>
          </div>

          <label className="form-field full-width">
            <span>نشانی پستی دقیق (خیابان، کوچه، پلاک، واحد) *</span>
            <textarea
              name="postalAddress"
              required
              rows={3}
              defaultValue="خیابان آزادی، خیابان حبیب‌الهی، پلاک ۱۲، واحد ۴"
              className="input-textarea"
            />
          </label>
        </div>

        <div className="checkout-section">
          <h2>۲. شیوه ارسال سفارش</h2>
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
                <strong>پست پیشتاز سراسری</strong>
                <span>تحویل ۲۴ تا ۷۲ ساعت کاری با بیمه مرسولات پستی</span>
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
                <span>تحویل سریع ویژه کالا با رهگیری لحظه‌ای اختصاصی</span>
              </div>
            </label>
          </div>
        </div>

        <div className="checkout-section">
          <h2>۳. روش پرداخت</h2>
          <div className="options-grid">
            <label className={`option-card ${paymentMethod === "ZARINPAL" ? "active" : ""}`}>
              <input
                type="radio"
                name="paymentChoice"
                value="ZARINPAL"
                checked={paymentMethod === "ZARINPAL"}
                onChange={() => setPaymentMethod("ZARINPAL")}
              />
              <div className="option-content">
                <strong>پرداخت آنلاین شاپرک (درگاه شتابی زرین‌پال)</strong>
                <span>پرداخت آنی و امن با تمام کارت‌های عضو شتاب</span>
              </div>
            </label>

            <label className={`option-card ${paymentMethod === "CARD_TO_CARD" ? "active" : ""}`}>
              <input
                type="radio"
                name="paymentChoice"
                value="CARD_TO_CARD"
                checked={paymentMethod === "CARD_TO_CARD"}
                onChange={() => setPaymentMethod("CARD_TO_CARD")}
              />
              <div className="option-content">
                <strong>انتقال مستقیم کارت‌به‌کارت بانکی</strong>
                <span>واریز به کارت رسمی فروشگاه و ثبت شماره پیگیری فیش</span>
              </div>
            </label>

            <label className={`option-card ${paymentMethod === "WALLET" ? "active" : ""}`}>
              <input
                type="radio"
                name="paymentChoice"
                value="WALLET"
                checked={paymentMethod === "WALLET"}
                onChange={() => setPaymentMethod("WALLET")}
              />
              <div className="option-content">
                <strong>کسر از کیف پول داخلی</strong>
                <span>پرداخت مستقیم از اعتبار حساب کاربری</span>
              </div>
            </label>
          </div>
        </div>

        {errorMessage && <div className="error-banner">{errorMessage}</div>}

        <button type="submit" disabled={isSubmitting} className="btn-submit-order">
          {isSubmitting ? "در حال ثبت سفارش و رزرو انبار…" : "ثبت نهایی سفارش و پرداخت"}
        </button>
      </form>

      <aside className="checkout-sidebar">
        <div className="summary-card">
          <h3>اقلام سفارش ({items.length} کالا)</h3>
          <div className="sidebar-items-list">
            {items.map((i) => (
              <div key={i.variantId} className="sidebar-item-row">
                <span>
                  {i.title} × {i.qty}
                </span>
                <span>{formatToman(BigInt(i.priceAmount) * BigInt(i.qty))}</span>
              </div>
            ))}
          </div>

          <hr className="summary-divider" />

          <div className="summary-rows">
            <div className="summary-row">
              <span>جمع کالاها:</span>
              <span>{new Intl.NumberFormat("fa-IR").format(subtotalTomans)} تومان</span>
            </div>
            <div className="summary-row">
              <span>مالیات بر ارزش افزوده:</span>
              <span>{new Intl.NumberFormat("fa-IR").format(vatTomans)} تومان</span>
            </div>
            <div className="summary-row">
              <span>هزینه حمل:</span>
              <span>{new Intl.NumberFormat("fa-IR").format(shippingFeeTomans)} تومان</span>
            </div>
            <div className="summary-row total">
              <span>مبلغ نهایی:</span>
              <strong>{new Intl.NumberFormat("fa-IR").format(grandTotalTomans)} تومان</strong>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
