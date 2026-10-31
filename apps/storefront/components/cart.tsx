"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  sku: string;
  priceAmount: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalAmountRials: bigint;
  isReady: boolean;
}

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "commerce_os.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore storage error
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore storage error
      }
    }
  }, [items, isReady]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId ? { ...i, qty: Math.min(50, i.qty + qty) } : i
        );
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.variantId !== variantId);
      return prev.map((i) => (i.variantId === variantId ? { ...i, qty: Math.min(50, qty) } : i));
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const totalAmountRials = useMemo(
    () => items.reduce((sum, i) => sum + BigInt(i.priceAmount) * BigInt(i.qty), 0n),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQty,
      clearCart,
      itemCount,
      totalAmountRials,
      isReady,
    }),
    [items, addItem, removeItem, setQty, clearCart, itemCount, totalAmountRials, isReady]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
