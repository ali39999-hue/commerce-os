"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../components/cart";
import { formatToman } from "../../lib/catalog";

export default function CartPage() {
  const { items, setQty, removeItem, clearCart, itemCount, totalAmountRials, isReady } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  if (!isReady) {
    return <div className="state-panel">در حال بارگذاری سبد خرید…</div>;
  }

  if (items.length === 0) {
    return (
      <section className="state-panel empty-cart-box">
        <h2>سبد خرید شما خالی است</h2>
        <p>هنوز کالایی به سبد خرید خود اضافه نکرده‌اید.</p>
        <Link href="/#catalog" className="primary-link">
          بازگشت به فروشگاه و مشاهده کالاها
        </Link>
      </section>
    );
  }

  // Estimated calculation
  const subtotalTomans = totalAmountRials / 10n;
  const discountTomans = appliedCoupon === "OFF10" ? (subtotalTomans * 10n) / 100n : 0n;
  const taxableTomans = subtotalTomans - discountTomans;
  const vatTomans = (taxableTomans * 10n) / 100n; // 10%
  const shippingTomans = subtotalTomans >= 3_000_000n ? 0n : 150_000n;
  const totalTomans = taxableTomans + vatTomans + shippingTomans;

  return (
    <section className="cart-page-layout">
      <div className="cart-items-column">
        <div className="cart-header-row">
          <h1>سبد خرید ({itemCount} کالا)</h1>
          <button onClick={clearCart} className="btn-text-danger">
            پاک کردن کل سبد
          </button>
        </div>

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
                  <div className="price-unit">قیمت واحد: {formatToman(item.priceAmount)}</div>
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

          <div className="coupon-box">
            <input
              type="text"
              placeholder="کد تخفیف (مثال: OFF10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="input-text"
            />
            <button
              onClick={() => {
                if (couponCode.trim().toUpperCase() === "OFF10") {
                  setAppliedCoupon("OFF10");
                } else if (couponCode.trim()) {
                  alert("کد تخفیف آزمایشی: OFF10");
                }
              }}
              className="btn-coupon"
            >
              اعمال
            </button>
          </div>

          <div className="summary-rows">
            <div className="summary-row">
              <span>جمع قیمت کالاها:</span>
              <span>{new Intl.NumberFormat("fa-IR").format(subtotalTomans)} تومان</span>
            </div>

            {discountTomans > 0n && (
              <div className="summary-row discount">
                <span>تخفیف اعمال‌شده:</span>
                <span>- {new Intl.NumberFormat("fa-IR").format(discountTomans)} تومان</span>
              </div>
            )}

            <div className="summary-row">
              <span>مالیات بر ارزش افزوده (۱۰٪):</span>
              <span>{new Intl.NumberFormat("fa-IR").format(vatTomans)} تومان</span>
            </div>

            <div className="summary-row">
              <span>هزینه ارسال:</span>
              <span>
                {shippingTomans === 0n
                  ? "رایگان (خرید بالای ۳ میلیون)"
                  : `${new Intl.NumberFormat("fa-IR").format(shippingTomans)} تومان`}
              </span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row total">
              <span>مبلغ نهایی قابل پرداخت:</span>
              <strong>{new Intl.NumberFormat("fa-IR").format(totalTomans)} تومان</strong>
            </div>
          </div>

          <Link href="/checkout" className="btn-checkout">
            ادامه فرآیند خرید و پرداخت ←
          </Link>

          <p className="summary-note">
            🛡️ تمام پرداخت‌ها از طریق شبکه شاپرک و درگاه‌های امن بانکی انجام می‌پذیرد.
          </p>
        </div>
      </aside>
    </section>
  );
}
