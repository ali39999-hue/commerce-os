import React, { createContext, useContext, useState, useId } from "react";
import { designTokens } from "./tokens.js";

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  expanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Accordion({
  allowMultiple = false,
  defaultExpanded = [],
  expanded,
  onExpandedChange,
  children,
  style,
}: AccordionProps) {
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(new Set(defaultExpanded));

  const currentExpanded = expanded !== undefined ? new Set(expanded) : internalExpanded;

  const toggleItem = (id: string) => {
    const next = new Set(currentExpanded);
    if (next.has(id)) {
      next.delete(id);
    } else {
      if (!allowMultiple) {
        next.clear();
      }
      next.add(id);
    }

    if (expanded === undefined) {
      setInternalExpanded(next);
    }
    onExpandedChange?.(Array.from(next));
  };

  return (
    <AccordionContext.Provider value={{ expandedItems: currentExpanded, toggleItem }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          fontFamily: designTokens.typography.fontFamily.sans.join(", "),
          border: `1px solid ${designTokens.colors.warmMarble.border}`,
          borderRadius: designTokens.radius.card,
          backgroundColor: designTokens.colors.surface.card,
          overflow: "hidden",
          boxSizing: "border-box",
          ...style,
        }}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

export function AccordionItem({
  id,
  title,
  subtitle,
  icon,
  children,
  disabled = false,
}: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("AccordionItem must be used within Accordion");

  const { expandedItems, toggleItem } = context;
  const isExpanded = expandedItems.has(id);

  const headerId = useId();
  const contentId = useId();

  return (
    <div
      style={{
        borderBottom: `1px solid ${designTokens.colors.warmMarble.border}`,
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        id={headerId}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        disabled={disabled}
        onClick={() => toggleItem(id)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${designTokens.spacing[4]} ${designTokens.spacing[5]}`,
          background: isExpanded ? designTokens.colors.warmMarble[50] : "transparent",
          border: "none",
          textAlign: "inherit",
          fontFamily: "inherit",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: `background-color ${designTokens.transitions.fast}`,
          outline: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: designTokens.spacing[3] }}>
          {icon && (
            <span
              style={{
                display: "inline-flex",
                color: isExpanded ? designTokens.colors.clinicalTeal.DEFAULT : designTokens.colors.text.muted,
              }}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: designTokens.typography.fontSize.base,
                fontWeight: isExpanded ? designTokens.typography.fontWeight.semibold : designTokens.typography.fontWeight.medium,
                color: designTokens.colors.text.primary,
              }}
            >
              {title}
            </span>
            {subtitle && (
              <span
                style={{
                  fontSize: designTokens.typography.fontSize.xs,
                  color: designTokens.colors.text.muted,
                  marginTop: "2px",
                }}
              >
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Chevron Icon with rotation */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: isExpanded ? designTokens.colors.clinicalTeal.DEFAULT : designTokens.colors.text.muted,
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: `transform ${designTokens.transitions.normal}`,
            fontSize: "14px",
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          &#x25BC;
        </span>
      </button>

      {/* Collapsible Content */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        hidden={!isExpanded}
        style={{
          display: isExpanded ? "block" : "none",
          padding: `${designTokens.spacing[4]} ${designTokens.spacing[5]}`,
          backgroundColor: designTokens.colors.surface.card,
          borderTop: `1px solid ${designTokens.colors.warmMarble.subtle}`,
          fontSize: designTokens.typography.fontSize.sm,
          color: designTokens.colors.text.secondary,
          lineHeight: designTokens.typography.lineHeight.relaxed,
          animation: isExpanded ? "cos-accordion-expand 200ms ease-out" : undefined,
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes cos-accordion-expand {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
