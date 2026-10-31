import React, { forwardRef } from "react";
import { designTokens } from "./tokens.js";

export type SkeletonVariant = "text" | "rectangular" | "circular" | "card" | "avatar";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  {
    variant = "rectangular",
    width,
    height,
    count = 1,
    style,
    ...rest
  },
  ref
) {
  const getDefaultDimensions = (): { width?: string | number; height?: string | number; borderRadius: string } => {
    switch (variant) {
      case "text":
        return {
          width: width ?? "100%",
          height: height ?? "16px",
          borderRadius: designTokens.radius.xs,
        };
      case "circular":
      case "avatar":
        const dim = width ?? height ?? "40px";
        return {
          width: dim,
          height: dim,
          borderRadius: designTokens.radius.full,
        };
      case "card":
        return {
          width: width ?? "100%",
          height: height ?? "220px",
          borderRadius: designTokens.radius.card,
        };
      case "rectangular":
      default:
        return {
          width: width ?? "100%",
          height: height ?? "80px",
          borderRadius: designTokens.radius.md,
        };
    }
  };

  const dims = getDefaultDimensions();

  const baseStyle: React.CSSProperties = {
    display: "block",
    backgroundColor: designTokens.colors.warmMarble.subtle,
    backgroundImage: `linear-gradient(
      90deg,
      ${designTokens.colors.warmMarble.subtle} 0%,
      ${designTokens.colors.warmMarble[50]} 50%,
      ${designTokens.colors.warmMarble.subtle} 100%
    )`,
    backgroundSize: "200% 100%",
    animation: "cos-skeleton-pulse 1.6s ease-in-out infinite",
    width: dims.width,
    height: dims.height,
    borderRadius: dims.borderRadius,
    boxSizing: "border-box",
  };

  if (count > 1) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[2], width: "100%" }}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? ref : undefined}
            style={{
              ...baseStyle,
              width: i === count - 1 && variant === "text" ? "70%" : dims.width,
              ...style,
            }}
            aria-hidden="true"
            {...rest}
          />
        ))}
        <style>{`
          @keyframes cos-skeleton-pulse {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div
        ref={ref}
        style={{
          ...baseStyle,
          ...style,
        }}
        aria-hidden="true"
        {...rest}
      />
      <style>{`
        @keyframes cos-skeleton-pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
});
