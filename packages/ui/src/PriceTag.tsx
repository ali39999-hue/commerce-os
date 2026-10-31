import React from "react";
import { designTokens } from "./tokens.js";
import { Badge } from "./Badge.js";

export type CurrencyCode = "IRR" | "IRT" | "USD" | "EUR";

export interface PriceTagProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
  originalAmount?: number;
  currency?: CurrencyCode | string;
  size?: "sm" | "md" | "lg";
  installmentInfo?: string;
  showCurrency?: boolean;
}

const sizeConfig = {
  sm: {
    mainPrice: designTokens.typography.fontSize.base,
    originalPrice: designTokens.typography.fontSize.xs,
    currencySize: "0.6875rem",
    gap: designTokens.spacing[1],
  },
  md: {
    mainPrice: designTokens.typography.fontSize.xl,
    originalPrice: designTokens.typography.fontSize.sm,
    currencySize: designTokens.typography.fontSize.xs,
    gap: designTokens.spacing[2],
  },
  lg: {
    mainPrice: designTokens.typography.fontSize["3xl"],
    originalPrice: designTokens.typography.fontSize.base,
    currencySize: designTokens.typography.fontSize.sm,
    gap: designTokens.spacing[3],
  },
};

const currencyLabels: Record<string, string> = {
  IRT: "تومان",
  IRR: "ریال",
  USD: "$",
  EUR: "€",
};

export function PriceTag({
  amount,
  originalAmount,
  currency = "IRT",
  size = "md",
  installmentInfo,
  showCurrency = true,
  style,
  ...rest
}: PriceTagProps) {
  const config = sizeConfig[size];

  // Calculate discount percentage if original price is provided
  const discountPercent =
    originalAmount && originalAmount > amount
      ? Math.round(((originalAmount - amount) / originalAmount) * 100)
      : null;

  const formattedAmount = new Intl.NumberFormat("fa-IR").format(amount);
  const formattedOriginal = originalAmount ? new Intl.NumberFormat("fa-IR").format(originalAmount) : null;
  const currencyDisplay = currencyLabels[currency] || currency;

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        fontFamily: designTokens.typography.fontFamily.sans.join(", "),
        boxSizing: "border-box",
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: config.gap, flexWrap: "wrap" }}>
        {/* Main Price */}
        <div style={{ display: "inline-flex", alignItems: "baseline", gap: designTokens.spacing[1] }}>
          <span
            style={{
              fontSize: config.mainPrice,
              fontWeight: designTokens.typography.fontWeight.bold,
              color: designTokens.colors.text.primary,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {formattedAmount}
          </span>
          {showCurrency && (
            <span
              style={{
                fontSize: config.currencySize,
                color: designTokens.colors.text.muted,
                fontWeight: designTokens.typography.fontWeight.medium,
              }}
            >
              {currencyDisplay}
            </span>
          )}
        </div>

        {/* Strikethrough Original Price & Discount Badge */}
        {formattedOriginal && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: designTokens.spacing[1] }}>
            <span
              style={{
                fontSize: config.originalPrice,
                color: designTokens.colors.text.hint,
                textDecoration: "line-through",
                lineHeight: 1,
              }}
            >
              {formattedOriginal}
            </span>
            {discountPercent !== null && discountPercent > 0 && (
              <Badge variant="warning" size="sm">
                %{new Intl.NumberFormat("fa-IR").format(discountPercent)}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Installment Badge */}
      {installmentInfo && (
        <div style={{ marginTop: designTokens.spacing[1] }}>
          <Badge variant="clinical" size="sm">
            {installmentInfo}
          </Badge>
        </div>
      )}
    </div>
  );
}
