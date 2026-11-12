"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  CartItem,
  CartCalculation,
  CartFunnelStage,
  ValidatedCouponRule,
  calculateCartTotals,
  verifyCartWithServer,
  validateCouponRemote,
  syncCartToServer,
  syncCartStageToServer,
  getOrCreateCartSessionId,
  rotateCartSessionId,
  readStoredCustomerAuth,
  MAX_QTY_PER_ITEM,
} from "../lib/cart";
import { trackAddToCart, trackRemoveFromCart } from "../lib/analytics";

export type { CartItem, CartCalculation, ValidatedCouponRule, CartFunnelStage };

export interface CouponApplyOverrides {
  customerPhone?: string;
  customerType?: "B2C" | "B2B_CLINIC";
  medicalLicenseNumber?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clearCart: (rotateSession?: unknown) => void;
  itemCount: number;
  totalAmountRials: bigint;
  isReady: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  cartSessionId: string;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: string | null;
  appliedCouponRule: ValidatedCouponRule | null;
  applyCoupon: (
    code: string,
    overrides?: CouponApplyOverrides
  ) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  customerType: "B2C" | "B2B_CLINIC";
  setCustomerType: (t: "B2C" | "B2B_CLINIC") => void;
  buyerPhone: string;
  setBuyerPhone: (p: string) => void;
  clinicName: string;
  setClinicName: (name: string) => void;
  medicalLicenseNumber: string;
  setMedicalLicenseNumber: (lic: string) => void;
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  calculations: CartCalculation;
  isSyncing: boolean;
  syncWarnings: string[];
  clearSyncWarnings: () => void;
  syncStage: (
    stage: CartFunnelStage,
    extra?: { customerName?: string; customerPhone?: string; customerType?: "B2C" | "B2B_CLINIC" }
  ) => void;
}

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "commerce_os.cart.v1";
const COUPON_STORAGE_KEY = "commerce_os.cart.coupon.v1";
const COUPON_RULE_STORAGE_KEY = "commerce_os.cart.coupon_rule.v1";
const SHIPPING_STORAGE_KEY = "commerce_os.cart.shipping.v1";
const CUSTOMER_TYPE_STORAGE_KEY = "commerce_os.cart.customer_type.v1";
const BUYER_PHONE_STORAGE_KEY = "commerce_os.cart.buyer_phone.v1";
const CLINIC_NAME_STORAGE_KEY = "commerce_os.cart.clinic_name.v1";
const MEDICAL_LICENSE_STORAGE_KEY = "commerce_os.cart.medical_license.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cartSessionId, setCartSessionId] = useState("ssr-session");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [appliedCouponRule, setAppliedCouponRule] = useState<ValidatedCouponRule | null>(null);
  const [customerType, setCustomerType] = useState<"B2C" | "B2B_CLINIC">("B2C");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");
  const [shippingMethod, setShippingMethod] = useState("POST_PISHTAZ");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncWarnings, setSyncWarnings] = useState<string[]>([]);

  const hasSyncedCartRef = useRef(false);
  const skipNextEmptySyncRef = useRef(false);

  // Load from local storage
  useEffect(() => {
    try {
      setCartSessionId(getOrCreateCartSessionId());
      const savedItems = localStorage.getItem(STORAGE_KEY);
      if (savedItems) {
        const parsed = JSON.parse(savedItems);
        setItems(parsed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          hasSyncedCartRef.current = true;
        }
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        setAppliedCoupon(savedCoupon);
        setCouponCode(savedCoupon);
      }
      const savedRule = localStorage.getItem(COUPON_RULE_STORAGE_KEY);
      if (savedRule) {
        setAppliedCouponRule(JSON.parse(savedRule));
      }
      const savedShipping = localStorage.getItem(SHIPPING_STORAGE_KEY);
      if (savedShipping) {
        setShippingMethod(savedShipping);
      }
      const savedCustomerType = localStorage.getItem(CUSTOMER_TYPE_STORAGE_KEY);
      if (savedCustomerType === "B2B_CLINIC" || savedCustomerType === "B2C") {
        setCustomerType(savedCustomerType);
      }
      const savedPhone = localStorage.getItem(BUYER_PHONE_STORAGE_KEY);
      const auth = readStoredCustomerAuth();
      if (savedPhone) {
        setBuyerPhone(savedPhone);
      } else if (auth.phone) {
        setBuyerPhone(auth.phone);
      }
      const savedClinic = localStorage.getItem(CLINIC_NAME_STORAGE_KEY);
      if (savedClinic) setClinicName(savedClinic);
      const savedLicense = localStorage.getItem(MEDICAL_LICENSE_STORAGE_KEY);
      if (savedLicense) setMedicalLicenseNumber(savedLicense);
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

  // Save coupon & rule
  useEffect(() => {
    if (isReady) {
      try {
        if (appliedCoupon) {
          localStorage.setItem(COUPON_STORAGE_KEY, appliedCoupon);
        } else {
          localStorage.removeItem(COUPON_STORAGE_KEY);
        }
        if (appliedCouponRule) {
          localStorage.setItem(COUPON_RULE_STORAGE_KEY, JSON.stringify(appliedCouponRule));
        } else {
          localStorage.removeItem(COUPON_RULE_STORAGE_KEY);
        }
      } catch {
        // ignore
      }
    }
  }, [appliedCoupon, appliedCouponRule, isReady]);

  // Save buyer context
  useEffect(() => {
    if (!isReady) return;
    try {
      localStorage.setItem(SHIPPING_STORAGE_KEY, shippingMethod);
      localStorage.setItem(CUSTOMER_TYPE_STORAGE_KEY, customerType);
      if (buyerPhone) localStorage.setItem(BUYER_PHONE_STORAGE_KEY, buyerPhone);
      else localStorage.removeItem(BUYER_PHONE_STORAGE_KEY);
      if (clinicName) localStorage.setItem(CLINIC_NAME_STORAGE_KEY, clinicName);
      else localStorage.removeItem(CLINIC_NAME_STORAGE_KEY);
      if (medicalLicenseNumber) localStorage.setItem(MEDICAL_LICENSE_STORAGE_KEY, medicalLicenseNumber);
      else localStorage.removeItem(MEDICAL_LICENSE_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [shippingMethod, customerType, buyerPhone, clinicName, medicalLicenseNumber, isReady]);

  // Periodic and on-mount server inventory check
  useEffect(() => {
    if (!isReady || items.length === 0) return;

    let active = true;
    setIsSyncing(true);

    verifyCartWithServer(items)
      .then(({ verifiedItems, priceChanges, stockIssues, hasRepairs }) => {
        if (!active) return;
        const allNotes = [...priceChanges, ...stockIssues];
        if (allNotes.length > 0) {
          setSyncWarnings(allNotes);
        }
        if (priceChanges.length > 0 || hasRepairs) {
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

  const calculations = useMemo(() => {
    return calculateCartTotals(items, appliedCoupon, shippingMethod, appliedCouponRule);
  }, [items, appliedCoupon, shippingMethod, appliedCouponRule]);

  // Debounced live push of Cart contents & buyer state to PostgreSQL + Admin ERP
  useEffect(() => {
    if (!isReady || !cartSessionId || cartSessionId === "ssr-session") return;
    if (items.length === 0) {
      if (skipNextEmptySyncRef.current) {
        skipNextEmptySyncRef.current = false;
        return;
      }
      if (!hasSyncedCartRef.current) return;
    } else {
      hasSyncedCartRef.current = true;
    }

    const timer = setTimeout(() => {
      void syncCartToServer({
        sessionId: cartSessionId,
        items,
        customerName: clinicName.trim() || undefined,
        customerPhone: buyerPhone.trim() || undefined,
        customerType,
        stage: items.length === 0 ? "ABANDONED" : "BROWSING",
        couponCode: appliedCoupon,
        shippingMethod,
        subtotalTomans: Number(calculations.subtotalTomans),
        discountTomans: Number(calculations.discountTomans),
        totalTomans: Number(calculations.totalTomans),
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [
    isReady,
    cartSessionId,
    items,
    appliedCoupon,
    shippingMethod,
    customerType,
    buyerPhone,
    clinicName,
    calculations.subtotalTomans,
    calculations.discountTomans,
    calculations.totalTomans,
  ]);

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
      window.dispatchEvent(
        new CustomEvent("commerce_os:notify", {
          detail: {
            type: "cart_add",
            title: "کالا به سبد خرید اضافه شد",
            item: {
              title: item.title,
              priceAmount: item.priceAmount,
              image: item.image,
              qty: qty,
              sku: item.sku,
            },
          },
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

  const clearCart = useCallback((rotateSession?: unknown) => {
    if (rotateSession === true) {
      skipNextEmptySyncRef.current = true;
      hasSyncedCartRef.current = false;
      setCartSessionId(rotateCartSessionId());
    }
    setItems([]);
    setAppliedCoupon(null);
    setAppliedCouponRule(null);
    setCouponCode("");
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  const applyCoupon = useCallback(
    async (
      code: string,
      overrides?: CouponApplyOverrides
    ): Promise<{ success: boolean; message: string }> => {
      const subtotalRials = items.reduce(
        (sum, i) => sum + BigInt(i.priceAmount) * BigInt(i.qty),
        0n
      );
      const effectiveType = overrides?.customerType ?? customerType;
      const effectivePhone = overrides?.customerPhone ?? (buyerPhone || undefined);
      const effectiveLicense = overrides?.medicalLicenseNumber ?? (medicalLicenseNumber || undefined);

      const res = await validateCouponRemote({
        code,
        subtotalRials,
        customerPhone: effectivePhone,
        customerType: effectiveType,
        medicalLicenseNumber: effectiveLicense,
      });

      if (res.valid && res.rule) {
        setAppliedCoupon(res.rule.code);
        setAppliedCouponRule(res.rule);
        setCouponCode(res.rule.code);
        return { success: true, message: res.message };
      }

      return { success: false, message: res.message };
    },
    [items, customerType, buyerPhone, medicalLicenseNumber]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setAppliedCouponRule(null);
    setCouponCode("");
  }, []);

  const clearSyncWarnings = useCallback(() => {
    setSyncWarnings([]);
  }, []);

  const syncStage = useCallback(
    (
      stage: CartFunnelStage,
      extra?: { customerName?: string; customerPhone?: string; customerType?: "B2C" | "B2B_CLINIC" }
    ) => {
      if (!cartSessionId || cartSessionId === "ssr-session") return;
      void syncCartStageToServer({
        sessionId: cartSessionId,
        stage,
        customerName: extra?.customerName ?? (clinicName.trim() || undefined),
        customerPhone: extra?.customerPhone ?? (buyerPhone.trim() || undefined),
        customerType: extra?.customerType ?? customerType,
        couponCode: appliedCoupon,
        shippingMethod,
        subtotalTomans: Number(calculations.subtotalTomans),
        discountTomans: Number(calculations.discountTomans),
        totalTomans: Number(calculations.totalTomans),
      });
    },
    [
      cartSessionId,
      clinicName,
      buyerPhone,
      customerType,
      appliedCoupon,
      shippingMethod,
      calculations.subtotalTomans,
      calculations.discountTomans,
      calculations.totalTomans,
    ]
  );

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
      cartSessionId,
      couponCode,
      setCouponCode,
      appliedCoupon,
      appliedCouponRule,
      applyCoupon,
      removeCoupon,
      customerType,
      setCustomerType,
      buyerPhone,
      setBuyerPhone,
      clinicName,
      setClinicName,
      medicalLicenseNumber,
      setMedicalLicenseNumber,
      shippingMethod,
      setShippingMethod,
      calculations,
      isSyncing,
      syncWarnings,
      clearSyncWarnings,
      syncStage,
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
      cartSessionId,
      couponCode,
      appliedCoupon,
      appliedCouponRule,
      applyCoupon,
      removeCoupon,
      customerType,
      buyerPhone,
      clinicName,
      medicalLicenseNumber,
      shippingMethod,
      isSyncing,
      syncWarnings,
      clearSyncWarnings,
      syncStage,
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
