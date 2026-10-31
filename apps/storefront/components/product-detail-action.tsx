"use client";

import React, { useState } from "react";
import { useCart } from "./cart";
import { formatToman } from "../lib/catalog";
import Link from "next/link";

export function ProductDetailAction(props: {
  variantId: string;
  productId: string;
  title: string;
  sku: string;
  priceAmount: string;
  inStock: boolean;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(
      {
        variantId: props.variantId,
        productId: props.productId,
        title: props.title,
        sku: props.sku,
        priceAmount: props.priceAmount,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!props.inStock) {
    return (
      <div className="out-of-stock-box">
        <span className="muted-tag">این کالا در حال حاضر در انبار ناموجود است.</span>
      </div>
    );
  }

  const lineTotalRials = BigInt(props.priceAmount) * BigInt(qty);

  return (
    <div className="product-purchase-box">
      <div className="purchase-price-row">
        <span>قیمت برای {qty} عدد:</span>
        <strong className="purchase-price-val">{formatToman(lineTotalRials)}</strong>
      </div>

      <div className="purchase-controls-row">
        <div className="qty-picker">
          <button
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="qty-btn"
            aria-label="افزایش"
          >
            +
          </button>
          <span className="qty-num">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="qty-btn"
            aria-label="کاهش"
          >
            -
          </button>
        </div>

        <button
          onClick={handleAdd}
          className={`btn-purchase-action ${added ? "added" : ""}`}
        >
          {added ? "✓ به سبد خرید اضافه شد" : "+ افزودن به سبد خرید"}
        </button>
      </div>

      {added && (
        <div className="cart-feedback-row">
          <span>کالا در سبد شما قرار گرفت.</span>
          <Link href="/cart" className="cart-link-highlight">
            مشاهده سبد خرید و تکمیل سفارش ←
          </Link>
        </div>
      )}
    </div>
  );
}
