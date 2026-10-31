"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  SupportedLocale,
  SupportedCurrency,
  SupportedMarket,
  SUPPORTED_LOCALES,
  SUPPORTED_MARKETS,
} from "@commerce-os/localization";
import { useLocalization } from "../../lib/localization-context";

interface LocaleCurrencySelectorProps {
  compact?: boolean;
  className?: string;
}

export function LocaleCurrencySelector({
  compact = false,
  className = "",
}: LocaleCurrencySelectorProps) {
  const {
    locale,
    market,
    currency,
    setLocale,
    setMarket,
    setCurrency,
  } = useLocalization();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentLocaleConfig = SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES["fa-IR"];
  const currentMarketConfig = SUPPORTED_MARKETS[market] || SUPPORTED_MARKETS["IR"];

  const currencyLabels: Record<SupportedCurrency, { symbol: string; label: string }> = {
    IRT: { symbol: "تومان", label: "تومان ایران (IRT)" },
    IRR: { symbol: "ریال", label: "ریال ایران (IRR)" },
    GBP: { symbol: "£", label: "British Pound (£ GBP)" },
    USD: { symbol: "$", label: "US Dollar ($ USD)" },
    EUR: { symbol: "€", label: "Euro (€ EUR)" },
    AED: { symbol: "AED", label: "UAE Dirham (AED)" },
  };

  return (
    <div
      ref={containerRef}
      className={`locale-currency-selector-root ${compact ? "compact" : ""} ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="selector-trigger"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="انتخاب زبان و ارز فروشگاه (Language & Currency Selector)"
      >
        <span className="selector-flag" aria-hidden="true">
          {market === "IR" ? "🇮🇷" : market === "GB" ? "🇬🇧" : market === "AE" ? "🇦🇪" : "🌐"}
        </span>
        <span className="selector-text">
          <strong className="lang-label">{currentLocaleConfig.nativeName}</strong>
          <span className="sep-dot">·</span>
          <span className="curr-symbol">{currencyLabels[currency]?.symbol || currency}</span>
        </span>
        <svg
          className={`chevron-icon ${isOpen ? "open" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="selector-flyout" role="dialog" aria-label="تنظیمات منطقه و ارز">
          <div className="flyout-header">
            <h4>تنظیمات بازار و زبان بین‌المللی</h4>
            <span className="flyout-desc">انتخاب بازار، زبان رابط کاربری و واحد پولی نمایش قیمت‌ها</span>
          </div>

          <div className="flyout-section">
            <label className="section-label">منطقه و بازار هدف (Market)</label>
            <div className="options-grid">
              {(Object.keys(SUPPORTED_MARKETS) as SupportedMarket[]).map((mKey) => {
                const m = SUPPORTED_MARKETS[mKey];
                const active = market === mKey;
                return (
                  <button
                    key={mKey}
                    type="button"
                    className={`option-btn ${active ? "active" : ""}`}
                    onClick={() => {
                      setMarket(mKey);
                      // Switch default locale of that market if appropriate
                      if (mKey === "GB" && locale !== "en-GB") setLocale("en-GB");
                      if (mKey === "IR" && locale !== "fa-IR") setLocale("fa-IR");
                      if (mKey === "AE" && locale !== "ar-AE") setLocale("ar-AE");
                    }}
                  >
                    <span className="flag-icon">
                      {mKey === "IR" ? "🇮🇷" : mKey === "GB" ? "🇬🇧" : mKey === "AE" ? "🇦🇪" : "🌐"}
                    </span>
                    <span className="market-meta">
                      <strong>{m.nameFa}</strong>
                      <small>{m.nameEn}</small>
                    </span>
                    {active && <span className="check-indicator">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flyout-section">
            <label className="section-label">زبان نمایش (Language / Locale)</label>
            <div className="options-grid languages">
              {(Object.keys(SUPPORTED_LOCALES) as SupportedLocale[]).map((locKey) => {
                const loc = SUPPORTED_LOCALES[locKey];
                const active = locale === locKey;
                return (
                  <button
                    key={locKey}
                    type="button"
                    className={`option-btn ${active ? "active" : ""}`}
                    onClick={() => setLocale(locKey)}
                  >
                    <span className="lang-meta">
                      <strong>{loc.nativeName}</strong>
                      <small>{loc.displayName}</small>
                    </span>
                    {active && <span className="check-indicator">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flyout-section">
            <label className="section-label">واحد پولی (Currency)</label>
            <div className="options-grid currencies">
              {(currentMarketConfig.supportedCurrencies as SupportedCurrency[]).map((currKey) => {
                const info = currencyLabels[currKey] || { symbol: currKey, label: currKey };
                const active = currency === currKey;
                return (
                  <button
                    key={currKey}
                    type="button"
                    className={`option-btn ${active ? "active" : ""}`}
                    onClick={() => {
                      setCurrency(currKey);
                      setIsOpen(false);
                    }}
                  >
                    <span className="curr-meta">
                      <strong className="symbol">{info.symbol}</strong>
                      <span className="code">{currKey}</span>
                    </span>
                    {active && <span className="check-indicator">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flyout-footer">
            <small>
              محاسبات بر اساس سیستم نرخ تبدیل دقیق Commerce OS (بدون اعشار شناور) انجام می‌پذیرد.
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
