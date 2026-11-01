import React, { useState, useEffect, useRef } from "react";
import { designTokens } from "./tokens.js";
import { Badge } from "./Badge.js";
import { Button } from "./Button.js";

export interface ProtocolStep {
  id: string;
  title: string;
  phase: string; // e.g. "Cleansing", "CO2 Infusion", "Activation", "Rinse", "Recovery"
  durationSeconds?: number;
  description: string;
  instructions?: string[];
  contraindications?: string[];
  clinicalNotes?: string;
  requiredProduct?: {
    name: string;
    sku?: string;
  };
}

export interface ProtocolStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ProtocolStep[];
  activeStepIndex?: number;
  onStepChange?: (index: number) => void;
  onProtocolComplete?: () => void;
  allowSimulatedTimer?: boolean;
}

export function ProtocolStepper({
  steps,
  activeStepIndex: controlledIndex,
  onStepChange,
  onProtocolComplete,
  allowSimulatedTimer = true,
  style,
  className,
  ...rest
}: ProtocolStepperProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const currentStep = steps[activeIndex];
  const [timeLeft, setTimeLeft] = useState<number>(currentStep?.durationSeconds || 0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync timer when step changes
  useEffect(() => {
    if (currentStep?.durationSeconds) {
      setTimeLeft(currentStep.durationSeconds);
    } else {
      setTimeLeft(0);
    }
    setTimerActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [activeIndex, currentStep]);

  // Countdown execution
  useEffect(() => {
    if (!timerActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const selectStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      if (controlledIndex === undefined) {
        setInternalIndex(index);
      }
      onStepChange?.(index);
    }
  };

  const nextStep = () => {
    if (activeIndex < steps.length - 1) {
      selectStep(activeIndex + 1);
    } else {
      onProtocolComplete?.();
    }
  };

  const prevStep = () => {
    if (activeIndex > 0) {
      selectStep(activeIndex - 1);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: designTokens.spacing[6],
        width: "100%",
        fontFamily: designTokens.typography.fontFamily.sans.join(", "),
        boxSizing: "border-box",
        ...style,
      }}
      className={className}
      {...rest}
    >
      {/* Step Navigation Pill Track */}
      <div
        role="tablist"
        aria-label="مراحل پروتکل بالینی"
        style={{
          display: "flex",
          alignItems: "center",
          gap: designTokens.spacing[2],
          overflowX: "auto",
          paddingBottom: designTokens.spacing[2],
          boxSizing: "border-box",
          scrollbarWidth: "none",
        }}
      >
        {steps.map((step, idx) => {
          const isCurrent = idx === activeIndex;
          const isDone = idx < activeIndex;

          let badgeColor: string = designTokens.colors.warmMarble.subtle;
          let textColor: string = designTokens.colors.text.secondary;
          let borderColor: string = designTokens.colors.warmMarble.border;

          if (isCurrent) {
            badgeColor = designTokens.colors.clinicalTeal.DEFAULT;
            textColor = "#FFFFFF";
            borderColor = designTokens.colors.clinicalTeal.DEFAULT;
          } else if (isDone) {
            badgeColor = designTokens.colors.clinicalTeal[50];
            textColor = designTokens.colors.clinicalTeal[700];
            borderColor = designTokens.colors.clinicalTeal[200];
          }

          return (
            <button
              key={step.id || idx}
              role="tab"
              aria-selected={isCurrent}
              aria-controls={`step-panel-${idx}`}
              id={`step-tab-${idx}`}
              onClick={() => selectStep(idx)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: designTokens.spacing[2],
                padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
                borderRadius: designTokens.radius.pill,
                border: `1px solid ${borderColor}`,
                backgroundColor: badgeColor,
                color: textColor,
                fontSize: designTokens.typography.fontSize.xs,
                fontWeight: isCurrent
                  ? designTokens.typography.fontWeight.bold
                  : designTokens.typography.fontWeight.medium,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: `all ${designTokens.transitions.fast}`,
                outline: "none",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isCurrent ? "rgba(255,255,255,0.25)" : "transparent",
                  fontSize: "11px",
                }}
              >
                {isDone ? "✓" : idx + 1}
              </span>
              <span>{step.phase || step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Phase Card */}
      {currentStep && (
        <div
          id={`step-panel-${activeIndex}`}
          role="tabpanel"
          aria-labelledby={`step-tab-${activeIndex}`}
          style={{
            backgroundColor: designTokens.colors.surface.card,
            borderRadius: designTokens.radius.card,
            border: `1px solid ${designTokens.colors.warmMarble.border}`,
            boxShadow: designTokens.shadows.card,
            padding: designTokens.spacing[6],
            display: "flex",
            flexDirection: "column",
            gap: designTokens.spacing[5],
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: designTokens.spacing[3],
              borderBottom: `1px solid ${designTokens.colors.warmMarble.subtle}`,
              paddingBottom: designTokens.spacing[4],
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: designTokens.spacing[2], marginBottom: "4px" }}>
                <Badge variant="clinical" size="sm">
                  مرحله {activeIndex + 1} از {steps.length}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {currentStep.phase}
                </Badge>
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.xl,
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.text.primary,
                }}
              >
                {currentStep.title}
              </h3>
            </div>

            {/* Simulated Phase Timer */}
            {allowSimulatedTimer && (currentStep.durationSeconds ?? 0) > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: designTokens.spacing[3],
                  backgroundColor: designTokens.colors.warmMarble[100],
                  padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
                  borderRadius: designTokens.radius.md,
                  border: `1px solid ${designTokens.colors.warmMarble.border}`,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ fontSize: "0.6875rem", color: designTokens.colors.text.muted }}>
                    زمان‌سنج مرحله بالینی
                  </span>
                  <span
                    style={{
                      fontFamily: designTokens.typography.fontFamily.mono.join(", "),
                      fontSize: designTokens.typography.fontSize.lg,
                      fontWeight: designTokens.typography.fontWeight.bold,
                      color: timeLeft === 0 ? designTokens.colors.bioGreen.DEFAULT : designTokens.colors.clinicalTeal[700],
                    }}
                  >
                    {formatTimer(timeLeft)}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant={timerActive ? "outline" : "primary"}
                  onClick={() => setTimerActive(!timerActive)}
                  aria-label={timerActive ? "توقف تایمر" : "شروع تایمر"}
                >
                  {timerActive ? "مکث" : timeLeft === 0 ? "تکرار" : "شروع"}
                </Button>
              </div>
            )}
          </div>

          {/* Description */}
          <p
            style={{
              margin: 0,
              fontSize: designTokens.typography.fontSize.base,
              color: designTokens.colors.text.secondary,
              lineHeight: designTokens.typography.lineHeight.relaxed,
            }}
          >
            {currentStep.description}
          </p>

          {/* Detailed Instructions */}
          {currentStep.instructions && currentStep.instructions.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: designTokens.spacing[2] }}>
              <span
                style={{
                  fontSize: designTokens.typography.fontSize.sm,
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  color: designTokens.colors.text.primary,
                }}
              >
                دستورالعمل‌های بالینی مرحله:
              </span>
              <ul
                style={{
                  margin: 0,
                  paddingInlineStart: designTokens.spacing[5],
                  display: "flex",
                  flexDirection: "column",
                  gap: designTokens.spacing[1],
                  fontSize: designTokens.typography.fontSize.sm,
                  color: designTokens.colors.text.secondary,
                }}
              >
                {currentStep.instructions.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Contraindication Alert Flags */}
          {currentStep.contraindications && currentStep.contraindications.length > 0 && (
            <div
              style={{
                backgroundColor: designTokens.colors.status.dangerBg,
                border: `1px solid ${designTokens.colors.status.dangerBorder}`,
                borderRadius: designTokens.radius.md,
                padding: designTokens.spacing[3],
                display: "flex",
                flexDirection: "column",
                gap: designTokens.spacing[1],
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: designTokens.spacing[2] }}>
                <span style={{ color: designTokens.colors.status.danger, fontWeight: "bold" }}>⚠</span>
                <span
                  style={{
                    fontSize: designTokens.typography.fontSize.xs,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: "#991B1B",
                  }}
                >
                  موارد منع مصرف و هشدارهای بالینی (Contraindications):
                </span>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingInlineStart: designTokens.spacing[4],
                  fontSize: designTokens.typography.fontSize.xs,
                  color: "#B91C1C",
                }}
              >
                {currentStep.contraindications.map((ci, idx) => (
                  <li key={idx}>{ci}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: designTokens.spacing[2],
            }}
          >
            <Button
              variant="ghost"
              size="md"
              onClick={prevStep}
              disabled={activeIndex === 0}
              aria-label="مرحله قبلی"
            >
              ← مرحله قبل
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={nextStep}
              aria-label={activeIndex === steps.length - 1 ? "پایان پروتکل" : "مرحله بعدی"}
            >
              {activeIndex === steps.length - 1 ? "تکمیل پروتکل بالینی" : "مرحله بعدی →"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
