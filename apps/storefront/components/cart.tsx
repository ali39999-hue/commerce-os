"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  CartItem,
  CartCalculation,
  calculateCartTotals,
  verifyCartWithServer,
  validateCoupon,
  MAX_QTY_PER_ITEM,
} from "../lib/cart";
import { trackAddToCart, trackRemoveFromCart } from "../lib/analytics";

export type { CartItem, CartCalculation };

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalAmountRials: bigint;
  isReady: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  calculations: CartCalculation;
  isSyncing: boolean;
  syncWarnings: string[];
  clearSyncWarnings: () => void;
}

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "commerce_os.cart.v1";
const COUPON_STORAGE_KEY = "commerce_os.cart.coupon.v1";
const SHIPPING_STORAGE_KEY = "commerce_os.cart.shipping.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState("POST_PISHTAZ");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncWarnings, setSyncWarnings] = useState<string[]>([]);

  // Load from local storage
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        setAppliedCoupon(savedCoupon);
        setCouponCode(savedCoupon);
      }
      const savedShipping = localStorage.getItem(SHIPPING_STORAGE_KEY);
      if (savedShipping) {
        setShippingMethod(savedShipping);
      }
    } catch {
      // ignore storage error
    }
    setIsReady(true);
  }, []);

  // Save items
  useEffect(() => {
    if (isReady) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore
      }
    }
  }, [items, isReady]);

  // Save coupon
  useEffect(() => {
    if (isReady) {
      try {
        if (appliedCoupon) {
          localStorage.setItem(COUPON_STORAGE_KEY, appliedCoupon);
        } else {
          localStorage.removeItem(COUPON_STORAGE_KEY);
        }
      } catch {
        // ignore
      }
    }
  }, [appliedCoupon, isReady]);

  // Save shipping
  useEffect(() => {
    if (isReady) {
      try {
        localStorage.setItem(SHIPPING_STORAGE_KEY, shippingMethod);
      } catch {
        // ignore
      }
    }
  }, [shippingMethod, isReady]);

  // Periodic and on-mount server inventory check — also heals stale variant ids
  // (e.g. after a database re-seed) by SKU or removes them with a notice, so a
  // poisoned localStorage cart can never break checkout.
  useEffect(() => {
    if (!isReady || items.length === 0) return;

    let active = true;
    setIsSyncing(true);

    verifyCartWithServer(items)
      .then(({ verifiedItems, priceChanges, stockIssues, removedNotices, changed }) => {
        if (!active) return;
        const allNotes = [...priceChanges, ...stockIssues, ...removedNotices];
        if (allNotes.length > 0) {
          setSyncWarnings(allNotes);
        }
        // Apply server reconciliation: price updates, healed ids, removals
        if (changed) {
          setItems(verifiedItems);
        }
      })
      .finally(() => {
        if (active) setIsSyncing(false);
      });

    return () => {
      active = false;
    };
  }, [isReady]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, qty: Math.min(MAX_QTY_PER_ITEM, i.qty + qty) }
            : i
        );
      }
      return [...prev, { ...item, qty: Math.min(MAX_QTY_PER_ITEM, qty) }];
    });
    trackAddToCart({
      item_id: item.productId,
      item_name: item.title,
      item_variant: item.variantId,
      sku: item.sku,
      price: Number(item.priceAmount) || 0,
      quantity: qty,
      currency: "IRR",
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("commerce_os:cart_bump", {
          detail: { variantId: item.variantId, qty },
        })
      );
    }
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.variantId === variantId);
      if (target) {
        trackRemoveFromCart({
          item_id: target.productId,
          item_name: target.title,
          item_variant: target.variantId,
          sku: target.sku,
          price: Number(target.priceAmount) || 0,
          quantity: target.qty,
          currency: "IRR",
        });
      }
      return prev.filter((i) => i.variantId !== variantId);
    });
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.variantId !== variantId);
      return prev.map((i) =>
        i.variantId === variantId
          ? { ...i, qty: Math.min(MAX_QTY_PER_ITEM, qty) }
          : i
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCode("");
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  const applyCoupon = useCallback(
    (code: string) => {
      const subtotalRials = items.reduce(
        (sum, i) => sum + BigInt(i.priceAmount) * BigInt(i.qty),
        0n
      );
      const res = validateCoupon(code, subtotalRials);
      if (res.valid) {
        const clean = code.trim().toUpperCase();
        setAppliedCoupon(clean);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message };
    },
    [items]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode("");
  }, []);

  const clearSyncWarnings = useCallback(() => {
    setSyncWarnings([]);
  }, []);

  const calculations = useMemo(() => {
    return calculateCartTotals(items, appliedCoupon, shippingMethod);
  }, [items, appliedCoupon, shippingMethod]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQty,
      clearCart,
      itemCount: calculations.itemCount,
      totalAmountRials: calculations.subtotalRials,
      isReady,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      couponCode,
      setCouponCode,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      shippingMethod,
      setShippingMethod,
      calculations,
      isSyncing,
      syncWarnings,
      clearSyncWarnings,
    }),
    [
      items,
      addItem,
      removeItem,
      setQty,
      clearCart,
      calculations,
      isReady,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      couponCode,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      shippingMethod,
      isSyncing,
      syncWarnings,
      clearSyncWarnings,
    ]
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
