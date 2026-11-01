"use client";

import React, { useState } from "react";
import { useCart } from "./cart";

export function ProductCardAction(props: {
  variantId: string;
  productId: string;
  title: string;
  sku: string;
  priceAmount: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      variantId: props.variantId,
      productId: props.productId,
      title: props.title,
      sku: props.sku,
      priceAmount: props.priceAmount,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      className={`btn-add-cart ${added ? "added" : ""}`}
      aria-label={added ? `افزوده شد: ${props.title}` : `افزودن به سبد: ${props.title}`}
    >
      {added ? "✓ افزوده شد" : "+ افزودن به سبد"}
    </button>
  );
}
