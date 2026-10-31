import React, { forwardRef, useState } from "react";
import { designTokens } from "./tokens.js";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    height: "32px",
    padding: `0 ${designTokens.spacing[3]}`,
    fontSize: designTokens.typography.fontSize.xs,
    gap: designTokens.spacing[1],
  },
  md: {
    height: "40px",
    padding: `0 ${designTokens.spacing[4]}`,
    fontSize: designTokens.typography.fontSize.sm,
    gap: designTokens.spacing[2],
  },
  lg: {
    height: "48px",
    padding: `0 ${designTokens.spacing[6]}`,
    fontSize: designTokens.typography.fontSize.base,
    gap: designTokens.spacing[3],
  },
};

const getVariantStyles = (variant: ButtonVariant, isHovered: boolean, isPressed: boolean, isDisabled: boolean): React.CSSProperties => {
  if (isDisabled) {
    return {
      backgroundColor: designTokens.colors.deepSlate[200],
      color: designTokens.colors.deepSlate[400],
      borderColor: "transparent",
      cursor: "not-allowed",
      boxShadow: "none",
    };
  }

  switch (variant) {
    case "primary":
      return {
        backgroundColor: isPressed
          ? designTokens.colors.clinicalTeal[700]
          : isHovered
            ? designTokens.colors.clinicalTeal.hover
            : designTokens.colors.clinicalTeal.DEFAULT,
        color: designTokens.colors.text.inverse,
        borderColor: "transparent",
        boxShadow: isHovered ? designTokens.shadows.card : designTokens.shadows.xs,
      };

    case "secondary":
      return {
        backgroundColor: isPressed
          ? designTokens.colors.amberAccent[600]
          : isHovered
            ? designTokens.colors.amberAccent.hover
            : designTokens.colors.amberAccent.DEFAULT,
        color: designTokens.colors.amberAccent.contrast,
        borderColor: "transparent",
        boxShadow: isHovered ? designTokens.shadows.card : designTokens.shadows.xs,
      };

    case "outline":
      return {
        backgroundColor: isHovered ? designTokens.colors.clinicalTeal.tint : "transparent",
        color: isHovered ? designTokens.colors.clinicalTeal.hover : designTokens.colors.clinicalTeal.DEFAULT,
        borderColor: isHovered ? designTokens.colors.clinicalTeal.DEFAULT : designTokens.colors.warmMarble.border,
      };

    case "ghost":
      return {
        backgroundColor: isHovered ? designTokens.colors.warmMarble.subtle : "transparent",
        color: designTokens.colors.text.primary,
        borderColor: "transparent",
      };

    case "danger":
      return {
        backgroundColor: isPressed
          ? "#DC2626"
          : isHovered
            ? "#DC2626"
            : designTokens.colors.status.danger,
        color: designTokens.colors.text.inverse,
        borderColor: "transparent",
        boxShadow: isHovered ? "0 4px 12px rgba(239, 68, 68, 0.25)" : "none",
      };
  }
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled = false,
    style,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    ...rest
  },
  ref
) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isDisabled = disabled || isLoading;

  const baseStyle: React.CSSProperties = {
    display: fullWidth ? "flex" : "inline-flex",
    width: fullWidth ? "100%" : "auto",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    fontFamily: designTokens.typography.fontFamily.sans.join(", "),
    fontWeight: designTokens.typography.fontWeight.medium,
    borderRadius: designTokens.radius.md,
    borderWidth: "1px",
    borderStyle: "solid",
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition: `all ${designTokens.transitions.fast}`,
    textDecoration: "none",
    userSelect: "none",
    outline: "none",
    boxSizing: "border-box",
    ...sizeStyles[size],
    ...getVariantStyles(variant, isHovered, isPressed, isDisabled),
    ...style,
  };

  const spinnerStyle: React.CSSProperties = {
    width: size === "sm" ? "14px" : size === "md" ? "18px" : "20px",
    height: size === "sm" ? "14px" : size === "md" ? "18px" : "20px",
    border: "2px solid currentColor",
    borderRightColor: "transparent",
    borderRadius: "50%",
    animation: "cos-spin 0.75s linear infinite",
    marginInlineEnd: designTokens.spacing[2],
  };

  return (
    <>
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        style={baseStyle}
        onMouseEnter={(e) => {
          if (!isDisabled) setIsHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          setIsPressed(false);
          onMouseLeave?.(e);
        }}
        onMouseDown={(e) => {
          if (!isDisabled) setIsPressed(true);
          onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          setIsPressed(false);
          onMouseUp?.(e);
        }}
        {...rest}
      >
        {isLoading && (
          <span style={spinnerStyle} aria-hidden="true" />
        )}
        {!isLoading && leftIcon && (
          <span style={{ display: "inline-flex", flexShrink: 0 }} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span style={{ display: "inline-flex", flexShrink: 0 }} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
      <style>{`
        @keyframes cos-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
});
