"use client";

import React, { useState } from "react";
import { useCart } from "./cart";
import { showNotificationModal } from "./notification-modal";

export interface ProductCardActionProps {
  variantId: string;
  productId: string;
  title: string;
  sku: string;
  priceAmount: string;
  pillTheme?: "light" | "dark" | "glass";
  label?: string;
  image?: string;
  className?: string;
}

export function ProductCardAction(props: ProductCardActionProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      variantId: props.variantId,
      productId: props.productId,
      title: props.title,
      sku: props.sku,
      priceAmount: props.priceAmount,
    });

    setAdded(true);

    showNotificationModal({
      type: "cart_add",
      title: "به سبد خرید اضافه شد",
      message: `${props.title} با موفقیت به سبد خرید بالینی شما پیوست.`,
      item: {
        title: props.title,
        priceAmount: props.priceAmount,
        sku: props.sku,
        image: props.image,
        qty: 1,
      },
    });

    setTimeout(() => setAdded(false), 2000);
  };

  const isPill = Boolean(props.pillTheme);
  const pillClass = props.pillTheme === "dark" ? "pill-dark" : "pill-light";

  if (isPill) {
    return (
      <button
        onClick={handleClick}
        className={`btn-pill-cta ${pillClass} ${added ? "added" : ""} ${props.className || ""}`}
        aria-label={added ? `افزوده شد: ${props.title}` : `${props.label || "خرید سریع"}: ${props.title}`}
      >
        {added ? "✓ در سبد خرید" : (props.label || "خرید سریع")}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`btn-add-cart ${added ? "added" : ""} ${props.className || ""}`}
      aria-label={added ? `افزوده شد: ${props.title}` : `افزودن به سبد: ${props.title}`}
    >
      {added ? "✓ افزوده شد" : "+ افزودن به سبد"}
    </button>
  );
}
