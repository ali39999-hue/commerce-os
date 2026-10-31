import React, { forwardRef, useState } from "react";
import { designTokens } from "./tokens.js";

export type CardVariant = "standard" | "elevated" | "interactive" | "glass";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: keyof typeof designTokens.spacing;
  radius?: keyof typeof designTokens.radius;
}

const getVariantStyles = (variant: CardVariant, isHovered: boolean): React.CSSProperties => {
  switch (variant) {
    case "standard":
      return {
        backgroundColor: designTokens.colors.surface.card,
        border: `1px solid ${designTokens.colors.warmMarble.border}`,
        boxShadow: designTokens.shadows.card,
      };

    case "elevated":
      return {
        backgroundColor: designTokens.colors.surface.elevated,
        border: `1px solid ${designTokens.colors.warmMarble.subtle}`,
        boxShadow: designTokens.shadows.elevated,
      };

    case "interactive":
      return {
        backgroundColor: isHovered ? designTokens.colors.surface.card : designTokens.colors.surface.card,
        border: `1px solid ${isHovered ? designTokens.colors.clinicalTeal.DEFAULT : designTokens.colors.warmMarble.border}`,
        boxShadow: isHovered ? designTokens.shadows.elevated : designTokens.shadows.card,
        transform: isHovered ? "translateY(-2px)" : "none",
        cursor: "pointer",
      };

    case "glass":
      return {
        backgroundColor: designTokens.colors.surface.glass,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 8px 32px 0 rgba(11, 110, 102, 0.08)",
      };
  }
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    children,
    variant = "standard",
    padding,
    radius = "card",
    style,
    onMouseEnter,
    onMouseLeave,
    ...rest
  },
  ref
) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    fontFamily: designTokens.typography.fontFamily.sans.join(", "),
    borderRadius: designTokens.radius[radius],
    padding: padding !== undefined ? designTokens.spacing[padding] : undefined,
    transition: `transform ${designTokens.transitions.fast}, box-shadow ${designTokens.transitions.fast}, border-color ${designTokens.transitions.fast}`,
    overflow: "hidden",
    ...getVariantStyles(variant, isHovered),
    ...style,
  };

  return (
    <div
      ref={ref}
      style={cardStyle}
      onMouseEnter={(e) => {
        setIsHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        onMouseLeave?.(e);
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { children, bordered = false, style, ...rest },
  ref
) {
  const headerStyle: React.CSSProperties = {
    padding: `${designTokens.spacing[4]} ${designTokens.spacing[5]}`,
    borderBottom: bordered ? `1px solid ${designTokens.colors.warmMarble.border}` : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    ...style,
  };

  return (
    <div ref={ref} style={headerStyle} {...rest}>
      {children}
    </div>
  );
});

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
  { children, noPadding = false, style, ...rest },
  ref
) {
  const bodyStyle: React.CSSProperties = {
    padding: noPadding ? 0 : designTokens.spacing[5],
    flex: "1 1 auto",
    boxSizing: "border-box",
    ...style,
  };

  return (
    <div ref={ref} style={bodyStyle} {...rest}>
      {children}
    </div>
  );
});

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { children, bordered = false, style, ...rest },
  ref
) {
  const footerStyle: React.CSSProperties = {
    padding: `${designTokens.spacing[4]} ${designTokens.spacing[5]}`,
    borderTop: bordered ? `1px solid ${designTokens.colors.warmMarble.border}` : "none",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    backgroundColor: designTokens.colors.warmMarble[50],
    ...style,
  };

  return (
    <div ref={ref} style={footerStyle} {...rest}>
      {children}
    </div>
  );
});
