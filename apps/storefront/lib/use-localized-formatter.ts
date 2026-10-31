"use client";

import { useLocalization } from "./localization-context";
import { SupportedCurrency, getCurrencyScale } from "@commerce-os/localization";

export interface LocalizedFormatter {
  locale: string;
  currency: SupportedCurrency;
  currencySymbol: string;
  direction: "rtl" | "ltr";
  isRtl: boolean;
  /**
   * Formats a monetary amount originally in Rials (or custom source currency)
   * into the customer's selected display currency and locale.
   */
  formatMoney: (amount: bigint | number | string, sourceCurrency?: string) => string;
  /**
   * Formats Iranian Rials to the active currency.
   * If currency is IRT (Toman), formats as Tomans.
   * If foreign currency (GBP, USD, etc.), converts and displays symbol.
   */
  formatToman: (amountRials: bigint | number | string) => string;
  /**
   * Formats an amount with an explicit currency.
   */
  formatExplicit: (amount: bigint | number | string, currency: string) => string;
  formatNumber: (value: number | bigint | string) => string;
  formatDate: (date: Date | string | number, options?: { withTime?: boolean }) => string;
}

export function useLocalizedFormatter(): LocalizedFormatter {
  const {
    locale,
    currency,
    direction,
    formatMoney: rawFormatMoney,
    formatNumber,
    formatDate,
  } = useLocalization();

  const scale = getCurrencyScale(currency);

  const formatMoney = (amount: bigint | number | string, sourceCurrency = "IRR") => {
    return rawFormatMoney(amount, sourceCurrency);
  };

  const formatToman = (amountRials: bigint | number | string) => {
    // If user has selected another currency (e.g. GBP or USD), convert from IRR to that currency!
    if (currency !== "IRT" && currency !== "IRR") {
      return rawFormatMoney(amountRials, "IRR");
    }
    // If user is in IRT or IRR mode
    return rawFormatMoney(amountRials, "IRR");
  };

  const formatExplicit = (amount: bigint | number | string, curr: string) => {
    return rawFormatMoney(amount, curr);
  };

  return {
    locale,
    currency,
    currencySymbol: scale.symbol,
    direction,
    isRtl: direction === "rtl",
    formatMoney,
    formatToman,
    formatExplicit,
    formatNumber,
    formatDate,
  };
}
