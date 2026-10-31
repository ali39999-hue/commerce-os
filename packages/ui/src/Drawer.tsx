import React, { useEffect, useRef, useId } from "react";
import { createPortal } from "react-dom";
import { designTokens } from "./tokens.js";

export type DrawerPlacement = "left" | "right";
export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  closeOnEsc?: boolean;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
}

const sizeWidths: Record<DrawerSize, string> = {
  sm: "320px",
  md: "420px",
  lg: "560px",
  xl: "720px",
  full: "100vw",
};

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  placement = "right",
  size = "md",
  closeOnEsc = true,
  closeOnBackdropClick = true,
  showCloseButton = true,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const drawerElement = drawerRef.current;
    if (!drawerElement) return;

    const focusableElements = drawerElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus();
    } else {
      drawerElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusable = Array.from(
          drawerElement.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const isLeft = placement === "left";

  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: designTokens.colors.surface.backdrop,
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    zIndex: designTokens.zIndices.drawer,
    display: "flex",
    justifyContent: isLeft ? "flex-start" : "flex-end",
    animation: "cos-fade-in 200ms ease-out",
  };

  const panelStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    maxWidth: sizeWidths[size],
    height: "100%",
    backgroundColor: designTokens.colors.surface.card,
    boxShadow: designTokens.shadows.drawer,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box",
    animation: isLeft ? "cos-slide-left 250ms cubic-bezier(0.16, 1, 0.3, 1)" : "cos-slide-right 250ms cubic-bezier(0.16, 1, 0.3, 1)",
    outline: "none",
  };

  const closeBtnStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: designTokens.radius.full,
    border: "none",
    background: designTokens.colors.warmMarble.subtle,
    color: designTokens.colors.text.secondary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
    lineHeight: 1,
    transition: `all ${designTokens.transitions.fast}`,
  };

  return createPortal(
    <div
      style={backdropStyle}
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        style={panelStyle}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${designTokens.spacing[4]} ${designTokens.spacing[6]}`,
            borderBottom: `1px solid ${designTokens.colors.warmMarble.border}`,
          }}
        >
          {title ? (
            <h2
              id={titleId}
              style={{
                margin: 0,
                fontSize: designTokens.typography.fontSize.lg,
                fontWeight: designTokens.typography.fontWeight.semibold,
                color: designTokens.colors.text.primary,
              }}
            >
              {title}
            </h2>
          ) : <div />}

          {showCloseButton && (
            <button
              type="button"
              aria-label="بستن پنل"
              style={closeBtnStyle}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = designTokens.colors.warmMarble.border;
                e.currentTarget.style.color = designTokens.colors.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = designTokens.colors.warmMarble.subtle;
                e.currentTarget.style.color = designTokens.colors.text.secondary;
              }}
            >
              &#x2715;
            </button>
          )}
        </div>

        <div
          style={{
            padding: designTokens.spacing[6],
            overflowY: "auto",
            flex: "1 1 auto",
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes cos-slide-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes cos-slide-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
