import React, { forwardRef } from "react";
import { designTokens } from "./tokens.js";

export type BadgeVariant = "clinical" | "success" | "warning" | "danger" | "neutral" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: {
    padding: "2px 6px",
    fontSize: "0.6875rem", // 11px
    borderRadius: designTokens.radius.xs,
    gap: "3px",
  },
  md: {
    padding: "3px 8px",
    fontSize: designTokens.typography.fontSize.xs, // 12px
    borderRadius: designTokens.radius.sm,
    gap: "4px",
  },
  lg: {
    padding: "4px 10px",
    fontSize: designTokens.typography.fontSize.sm, // 14px
    borderRadius: designTokens.radius.md,
    gap: "6px",
  },
};

const getVariantStyles = (variant: BadgeVariant): React.CSSProperties => {
  switch (variant) {
    case "clinical":
      return {
        backgroundColor: designTokens.colors.clinicalTeal.tint,
        color: designTokens.colors.clinicalTeal[700],
        borderColor: designTokens.colors.clinicalTeal[300],
      };

    case "success":
      return {
        backgroundColor: designTokens.colors.bioGreen.tint,
        color: designTokens.colors.bioGreen[700],
        borderColor: designTokens.colors.bioGreen[300],
      };

    case "warning":
      return {
        backgroundColor: designTokens.colors.amberAccent.tint,
        color: designTokens.colors.amberAccent[800],
        borderColor: designTokens.colors.amberAccent[300],
      };

    case "danger":
      return {
        backgroundColor: designTokens.colors.status.dangerBg,
        color: "#B91C1C",
        borderColor: designTokens.colors.status.dangerBorder,
      };

    case "neutral":
      return {
        backgroundColor: designTokens.colors.deepSlate[100],
        color: designTokens.colors.deepSlate[700],
        borderColor: designTokens.colors.deepSlate[200],
      };

    case "outline":
      return {
        backgroundColor: "transparent",
        color: designTokens.colors.text.secondary,
        borderColor: designTokens.colors.warmMarble.border,
      };
  }
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, variant = "neutral", size = "md", icon, style, ...rest },
  ref
) {
  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: designTokens.typography.fontFamily.sans.join(", "),
    fontWeight: designTokens.typography.fontWeight.semibold,
    lineHeight: 1.2,
    borderWidth: "1px",
    borderStyle: "solid",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    ...sizeStyles[size],
    ...getVariantStyles(variant),
    ...style,
  };

  return (
    <span ref={ref} style={badgeStyle} {...rest}>
      {icon && (
        <span style={{ display: "inline-flex", flexShrink: 0 }} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
});
