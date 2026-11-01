import React, { useState, useRef, useCallback, useEffect } from "react";
import { designTokens } from "./tokens.js";

export interface ClinicalMetric {
  id?: string;
  label: string;
  value: string;
  subtext?: string;
  tone?: "positive" | "neutral" | "clinical";
}

export interface BeforeAfterSliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialSplit?: number; // 0 to 100, default 50
  clinicalMetrics?: ClinicalMetric[];
  aspectRatio?: string; // e.g. "4/3", "16/9", "1/1"
  step?: number; // Keyboard arrow step, default 2
  onChange?: (splitPercentage: number) => void;
  showMetricOverlay?: boolean;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Baseline condition before treatment",
  afterAlt = "Clinical outcome after regimen",
  beforeLabel = "قبل (Baseline)",
  afterLabel = "بعد (Clinical Result)",
  initialSplit = 50,
  clinicalMetrics = [],
  aspectRatio = "4/3",
  step = 2,
  onChange,
  showMetricOverlay = true,
  style,
  className,
  ...rest
}: BeforeAfterSliderProps) {
  const [split, setSplit] = useState<number>(Math.min(100, Math.max(0, initialSplit)));
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSplitFromClientX = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100));
      const rounded = Math.round(percentage * 10) / 10;
      setSplit(rounded);
      onChange?.(rounded);
    },
    [onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateSplitFromClientX(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      updateSplitFromClientX(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateSplitFromClientX(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateSplitFromClientX(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isDragging, updateSplitFromClientX]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let nextSplit = split;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      nextSplit = Math.max(0, split - step);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      nextSplit = Math.min(100, split + step);
    } else if (e.key === "Home") {
      e.preventDefault();
      nextSplit = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextSplit = 100;
    }

    if (nextSplit !== split) {
      setSplit(nextSplit);
      onChange?.(nextSplit);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: designTokens.spacing[3],
        width: "100%",
        fontFamily: designTokens.typography.fontFamily.sans.join(", "),
        boxSizing: "border-box",
        ...style,
      }}
      className={className}
      {...rest}
    >
      {/* Slider Viewport Container */}
      <div
        ref={containerRef}
        role="slider"
        aria-label="مقایسه تصویر قبل و بعد درمان"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(split)}
        aria-valuetext={`${Math.round(split)} درصد بعد`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio,
          overflow: "hidden",
          borderRadius: designTokens.radius.card,
          boxShadow: designTokens.shadows.card,
          border: `1px solid ${isFocused ? designTokens.colors.clinicalTeal.DEFAULT : designTokens.colors.warmMarble.border}`,
          cursor: isDragging ? "grabbing" : "ew-resize",
          userSelect: "none",
          touchAction: "pan-y",
          outline: "none",
        }}
      >
        {/* After Image (Background layer - represents final treatment outcome) */}
        <img
          src={afterImage}
          alt={afterAlt}
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* Before Image (Clipped layer - represents baseline) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${split}%`,
            height: "100%",
            overflow: "hidden",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <img
            src={beforeImage}
            alt={beforeAlt}
            draggable={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
              height: "100%",
              maxWidth: "none",
              objectFit: "cover",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>

        {/* Boundary Badges */}
        <div
          style={{
            position: "absolute",
            top: designTokens.spacing[3],
            left: designTokens.spacing[3],
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            color: "#FFFFFF",
            backdropFilter: "blur(4px)",
            padding: "4px 8px",
            borderRadius: designTokens.radius.sm,
            fontSize: designTokens.typography.fontSize.xs,
            fontWeight: designTokens.typography.fontWeight.semibold,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {beforeLabel}
        </div>

        <div
          style={{
            position: "absolute",
            top: designTokens.spacing[3],
            right: designTokens.spacing[3],
            backgroundColor: "rgba(11, 110, 102, 0.85)",
            color: "#FFFFFF",
            backdropFilter: "blur(4px)",
            padding: "4px 8px",
            borderRadius: designTokens.radius.sm,
            fontSize: designTokens.typography.fontSize.xs,
            fontWeight: designTokens.typography.fontWeight.semibold,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {afterLabel}
        </div>

        {/* Divider Bar & Handle */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${split}%`,
            width: "2px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 0 10px rgba(0,0,0,0.4)",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          {/* Circular Grabber */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "36px",
              height: "36px",
              borderRadius: designTokens.radius.full,
              backgroundColor: "#FFFFFF",
              color: designTokens.colors.clinicalTeal[700],
              boxShadow: designTokens.shadows.elevated,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: designTokens.typography.fontWeight.bold,
              cursor: isDragging ? "grabbing" : "ew-resize",
              border: `2px solid ${designTokens.colors.clinicalTeal.DEFAULT}`,
              transition: `transform ${designTokens.transitions.fast}`,
              scale: isDragging ? "1.1" : "1.0",
            }}
          >
            &#x21D4;
          </div>
        </div>
      </div>

      {/* Clinical Metric Overlay Cards */}
      {showMetricOverlay && clinicalMetrics.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(130px, 1fr))`,
            gap: designTokens.spacing[2],
            width: "100%",
          }}
        >
          {clinicalMetrics.map((metric, idx) => {
            const isBio = metric.tone === "positive" || metric.tone === "clinical";
            const accentColor = isBio
              ? designTokens.colors.clinicalTeal[600]
              : designTokens.colors.amberAccent[700];
            const bgColor = isBio
              ? designTokens.colors.clinicalTeal[50]
              : designTokens.colors.amberAccent[50];
            const borderColor = isBio
              ? designTokens.colors.clinicalTeal[200]
              : designTokens.colors.amberAccent[200];

            return (
              <div
                key={metric.id || idx}
                style={{
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: designTokens.radius.md,
                  padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    fontSize: designTokens.typography.fontSize.xs,
                    color: designTokens.colors.text.muted,
                    lineHeight: 1.2,
                  }}
                >
                  {metric.label}
                </span>
                <span
                  style={{
                    fontSize: designTokens.typography.fontSize.lg,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: accentColor,
                    marginTop: "2px",
                    lineHeight: 1.1,
                  }}
                >
                  {metric.value}
                </span>
                {metric.subtext && (
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: designTokens.colors.text.hint,
                      marginTop: "2px",
                    }}
                  >
                    {metric.subtext}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
