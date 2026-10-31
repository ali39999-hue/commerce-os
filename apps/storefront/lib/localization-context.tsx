"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  SupportedLocale,
  SupportedMarket,
  SupportedCurrency,
  TextDirection,
  SUPPORTED_LOCALES,
  SUPPORTED_MARKETS,
  DEFAULT_LOCALE,
  DEFAULT_MARKET,
  DEFAULT_CURRENCY,
  resolveLocale,
  resolveMarket,
  getLocaleDirection,
  formatCurrencyAmount,
  convertMinorUnits,
  toPersianDigits,
  toArabicDigits,
  toAsciiDigits,
  formatJalaliDate,
  formatJalaliDateTime,
} from "@commerce-os/localization";

export interface LocalizationContextValue {
  locale: SupportedLocale;
  market: SupportedMarket;
  currency: SupportedCurrency;
  direction: TextDirection;
  setLocale: (locale: SupportedLocale) => void;
  setMarket: (market: SupportedMarket) => void;
  setCurrency: (currency: SupportedCurrency) => void;
  /**
   * Formats a monetary amount (in Rials, Tomans, or base currency minor units)
   * into the currently active selected currency and locale.
   */
  formatMoney: (
    amount: bigint | number | string,
    sourceCurrency?: SupportedCurrency | string
  ) => string;
  formatNumber: (value: number | bigint | string) => string;
  formatDate: (date: Date | string | number, options?: { withTime?: boolean }) => string;
}

const STORAGE_KEY_LOCALE = "commerce_os_locale";
const STORAGE_KEY_MARKET = "commerce_os_market";
const STORAGE_KEY_CURRENCY = "commerce_os_currency";

export const LOCALIZATION_CHANGED_EVENT = "commerce_os_localization_changed";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [market, setMarketState] = useState<SupportedMarket>(DEFAULT_MARKET);
  const [currency, setCurrencyState] = useState<SupportedCurrency>(DEFAULT_CURRENCY);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read persisted state from localStorage or cookies
    try {
      const savedLocale = (localStorage.getItem(STORAGE_KEY_LOCALE) || getCookie("NEXT_LOCALE")) as SupportedLocale | null;
      const savedMarket = (localStorage.getItem(STORAGE_KEY_MARKET) || getCookie("commerce_os_market")) as SupportedMarket | null;
      const savedCurrency = (localStorage.getItem(STORAGE_KEY_CURRENCY) || getCookie("commerce_os_currency")) as SupportedCurrency | null;

      if (savedLocale && SUPPORTED_LOCALES[savedLocale]) {
        setLocaleState(savedLocale);
      }
      if (savedMarket && SUPPORTED_MARKETS[savedMarket]) {
        setMarketState(savedMarket);
      }
      if (savedCurrency) {
        setCurrencyState(savedCurrency);
      }
    } catch {
      // Storage access blocked or restricted
    }
    setMounted(true);
  }, []);

  // Sync HTML tag attributes lang & dir when locale changes
  useEffect(() => {
    if (typeof document === "undefined") return;
    const dir = getLocaleDirection(locale);
    const lang = resolveLocale(locale).language;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY_LOCALE, newLocale);
      setCookie("NEXT_LOCALE", newLocale);
      window.dispatchEvent(new CustomEvent(LOCALIZATION_CHANGED_EVENT, { detail: { locale: newLocale } }));
    } catch {}
  };

  const setMarket = (newMarket: SupportedMarket) => {
    setMarketState(newMarket);
    const mConf = resolveMarket(newMarket);
    // If the new market doesn't support the current currency, switch to market default
    if (!mConf.supportedCurrencies.includes(currency)) {
      setCurrency(mConf.baseCurrency);
    }
    try {
      localStorage.setItem(STORAGE_KEY_MARKET, newMarket);
      setCookie("commerce_os_market", newMarket);
      window.dispatchEvent(new CustomEvent(LOCALIZATION_CHANGED_EVENT, { detail: { market: newMarket } }));
    } catch {}
  };

  const setCurrency = (newCurrency: SupportedCurrency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, newCurrency);
      setCookie("commerce_os_currency", newCurrency);
      window.dispatchEvent(new CustomEvent(LOCALIZATION_CHANGED_EVENT, { detail: { currency: newCurrency } }));
    } catch {}
  };

  const direction = useMemo(() => getLocaleDirection(locale), [locale]);

  const formatMoney = useMemo(() => {
    return (
      amount: bigint | number | string,
      sourceCurrency: SupportedCurrency | string = "IRR"
    ): string => {
      try {
        const src = sourceCurrency.toUpperCase();
        const tgt = currency.toUpperCase();

        let sourceMinor: bigint;
        if (typeof amount === "bigint") {
          sourceMinor = amount;
        } else {
          const clean = toAsciiDigits(String(amount)).replace(/\..*$/, "") || "0";
          sourceMinor = BigInt(clean);
        }

        // Convert minor units to target currency minor units
        const { amount: targetMinor } = convertMinorUnits(sourceMinor, src, tgt);

        // Format according to target currency and locale
        return formatCurrencyAmount(targetMinor, tgt, { locale });
      } catch {
        return `${amount} ${currency}`;
      }
    };
  }, [locale, currency]);

  const formatNumber = useMemo(() => {
    return (value: number | bigint | string): string => {
      const ascii = toAsciiDigits(String(value));
      const parts = ascii.split(".");
      const whole = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const full = parts[1] ? `${whole}.${parts[1]}` : whole;

      const loc = resolveLocale(locale);
      if (loc.numberFormatScript === "persian") {
        return toPersianDigits(full.replace(/,/g, "٬").replace(/\./g, "٫"));
      }
      if (loc.numberFormatScript === "arabic") {
        return toArabicDigits(full.replace(/,/g, "٬").replace(/\./g, "٫"));
      }
      return full;
    };
  }, [locale]);

  const formatDate = useMemo(() => {
    return (date: Date | string | number, options: { withTime?: boolean } = {}): string => {
      const d = typeof date === "object" ? date : new Date(date);
      if (isNaN(d.getTime())) return "";

      const loc = resolveLocale(locale);
      if (loc.calendar === "persian") {
        return options.withTime ? formatJalaliDateTime(d) : formatJalaliDate(d);
      }

      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(options.withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      }).format(d);
    };
  }, [locale]);

  const contextValue: LocalizationContextValue = {
    locale,
    market,
    currency,
    direction,
    setLocale,
    setMarket,
    setCurrency,
    formatMoney,
    formatNumber,
    formatDate,
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization(): LocalizationContextValue {
  const ctx = useContext(LocalizationContext);
  if (!ctx) {
    // Fallback safe defaults if used outside provider
    return {
      locale: DEFAULT_LOCALE,
      market: DEFAULT_MARKET,
      currency: DEFAULT_CURRENCY,
      direction: "rtl",
      setLocale: () => {},
      setMarket: () => {},
      setCurrency: () => {},
      formatMoney: (amt: bigint | number | string) => {
        try {
          const r = BigInt(amt);
          const tomans = r / 10n;
          return `${new Intl.NumberFormat("fa-IR").format(tomans)} تومان`;
        } catch {
          return `${amt} تومان`;
        }
      },
      formatNumber: (n: number | bigint | string) => String(n),
      formatDate: (d: Date | string | number) => formatJalaliDate(d),
    };
  }
  return ctx;
}
