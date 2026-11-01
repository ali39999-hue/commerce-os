import React, { useState, useRef, useEffect } from "react";
import { designTokens } from "./tokens.js";
import { Badge } from "./Badge.js";

export type PopoverPlacement = "top" | "bottom" | "left" | "right" | "auto";

export interface HotspotItem {
  id: string;
  x: number; // 0 to 100 percentage from left
  y: number; // 0 to 100 percentage from top
  title: string;
  description: string;
  badge?: string; // e.g. "CO2 Diffusion", "Micro-current 300uA", "98% Purity"
  clinicalDetail?: string;
  actionLabel?: string;
  onAction?: () => void;
  placement?: PopoverPlacement;
}

export interface InteractiveHotspotProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  imageAlt: string;
  hotspots: HotspotItem[];
  activeHotspotId?: string | null;
  onHotspotChange?: (hotspot: HotspotItem | null) => void;
  pulsate?: boolean;
  aspectRatio?: string;
}

export function InteractiveHotspot({
  imageSrc,
  imageAlt,
  hotspots,
  activeHotspotId: controlledActiveId,
  onHotspotChange,
  pulsate = true,
  aspectRatio = "16/9",
  style,
  className,
  ...rest
}: InteractiveHotspotProps) {
  const [internalActiveId, setInternalActiveId] = useState<string | null>(null);
  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleHotspot = (hotspot: HotspotItem, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    const nextId = activeId === hotspot.id ? null : hotspot.id;
    if (controlledActiveId === undefined) {
      setInternalActiveId(nextId);
    }
    const targetHotspot = nextId ? hotspot : null;
    onHotspotChange?.(targetHotspot);
  };

  const closeActive = () => {
    if (controlledActiveId === undefined) {
      setInternalActiveId(null);
    }
    onHotspotChange?.(null);
  };

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeId) {
        closeActive();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeId]);

  return (
    <div
      ref={containerRef}
      onClick={closeActive}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        overflow: "hidden",
        borderRadius: designTokens.radius.card,
        boxShadow: designTokens.shadows.card,
        border: `1px solid ${designTokens.colors.warmMarble.border}`,
        backgroundColor: designTokens.colors.warmMarble[100],
        fontFamily: designTokens.typography.fontFamily.sans.join(", "),
        boxSizing: "border-box",
        userSelect: "none",
        ...style,
      }}
      className={className}
      {...rest}
    >
      {/* Background Diagram / Product Image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Hotspots */}
      {hotspots.map((spot, index) => {
        const isActive = spot.id === activeId;
        const popoverPlacement = spot.placement || (spot.y > 60 ? "top" : "bottom");

        return (
          <div
            key={spot.id}
            style={{
              position: "absolute",
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: isActive ? designTokens.zIndices.popover : designTokens.zIndices.base + 2,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pulsating Ring (Behind Pin) */}
            {pulsate && (
              <span
                style={{
                  position: "absolute",
                  inset: "-8px",
                  borderRadius: "50%",
                  backgroundColor: designTokens.colors.clinicalTeal[400],
                  opacity: 0.75,
                  animation: "cos-pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Pin Target Button */}
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={isActive}
              aria-label={`مکانیزم بالینی: ${spot.title}`}
              onClick={(e) => toggleHotspot(spot, e)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleHotspot(spot, e);
                }
              }}
              style={{
                position: "relative",
                width: "28px",
                height: "28px",
                borderRadius: designTokens.radius.full,
                backgroundColor: isActive
                  ? designTokens.colors.amberAccent[500]
                  : designTokens.colors.clinicalTeal.DEFAULT,
                color: "#FFFFFF",
                border: "2px solid #FFFFFF",
                boxShadow: designTokens.shadows.elevated,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: designTokens.typography.fontWeight.bold,
                transition: `all ${designTokens.transitions.fast}`,
                transform: isActive ? "scale(1.2)" : "scale(1)",
                outline: "none",
                padding: 0,
              }}
            >
              {index + 1}
            </button>

            {/* Accessible Popover Overlay */}
            {isActive && (
              <div
                role="dialog"
                aria-modal="false"
                aria-label={spot.title}
                style={{
                  position: "absolute",
                  width: "260px",
                  backgroundColor: designTokens.colors.surface.card,
                  borderRadius: designTokens.radius.lg,
                  boxShadow: designTokens.shadows.dropdown,
                  border: `1px solid ${designTokens.colors.clinicalTeal[200]}`,
                  padding: designTokens.spacing[4],
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: designTokens.spacing[2],
                  zIndex: designTokens.zIndices.popover,
                  animation: "cos-popover-enter 180ms ease-out",
                  ...(popoverPlacement === "top"
                    ? {
                        bottom: "calc(100% + 12px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }
                    : popoverPlacement === "left"
                    ? {
                        right: "calc(100% + 12px)",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }
                    : popoverPlacement === "right"
                    ? {
                        left: "calc(100% + 12px)",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }
                    : {
                        top: "calc(100% + 12px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }),
                }}
              >
                {/* Popover Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {spot.badge && (
                    <Badge variant="clinical" size="sm">
                      {spot.badge}
                    </Badge>
                  )}
                  <button
                    type="button"
                    aria-label="بستن"
                    onClick={closeActive}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: designTokens.colors.text.hint,
                      fontSize: "14px",
                      cursor: "pointer",
                      padding: "2px",
                      lineHeight: 1,
                      marginInlineStart: "auto",
                    }}
                  >
                    &#x2715;
                  </button>
                </div>

                <div
                  style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: designTokens.colors.text.primary,
                  }}
                >
                  {spot.title}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: designTokens.typography.fontSize.xs,
                    color: designTokens.colors.text.secondary,
                    lineHeight: designTokens.typography.lineHeight.normal,
                  }}
                >
                  {spot.description}
                </p>

                {spot.clinicalDetail && (
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      color: designTokens.colors.clinicalTeal[700],
                      backgroundColor: designTokens.colors.clinicalTeal[50],
                      padding: `${designTokens.spacing[1]} ${designTokens.spacing[2]}`,
                      borderRadius: designTokens.radius.xs,
                      borderLeft: `2px solid ${designTokens.colors.clinicalTeal.DEFAULT}`,
                    }}
                  >
                    {spot.clinicalDetail}
                  </div>
                )}

                {spot.actionLabel && spot.onAction && (
                  <button
                    type="button"
                    onClick={() => {
                      spot.onAction?.();
                      closeActive();
                    }}
                    style={{
                      marginTop: designTokens.spacing[1],
                      border: "none",
                      background: "transparent",
                      color: designTokens.colors.clinicalTeal[600],
                      fontSize: designTokens.typography.fontSize.xs,
                      fontWeight: designTokens.typography.fontWeight.semibold,
                      textAlign: "start",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                  >
                    {spot.actionLabel}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes cos-pulse-ring {
          0% {
            transform: scale(0.6);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.6);
            opacity: 0.2;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes cos-popover-enter {
          from {
            opacity: 0;
            transform: translate(-50%, 6px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}
