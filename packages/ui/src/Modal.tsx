import React, { useEffect, useRef, useId } from "react";
import { createPortal } from "react-dom";
import { designTokens } from "./tokens.js";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: ModalSize;
  closeOnEsc?: boolean;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  ariaLabel?: string;
}

const sizeWidths: Record<ModalSize, string> = {
  sm: "420px",
  md: "560px",
  lg: "720px",
  xl: "900px",
  full: "calc(100vw - 32px)",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnEsc = true,
  closeOnBackdropClick = true,
  showCloseButton = true,
  ariaLabel,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  // Focus trap and previous focus restoration
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Focus first focusable element or modal container
    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus();
    } else {
      modalElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusable = Array.from(
          modalElement.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
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

  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: designTokens.colors.surface.backdrop,
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    zIndex: designTokens.zIndices.modal,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: designTokens.spacing[4],
    boxSizing: "border-box",
    animation: "cos-fade-in 200ms ease-out",
  };

  const modalContainerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    maxWidth: sizeWidths[size],
    maxHeight: "calc(100vh - 64px)",
    backgroundColor: designTokens.colors.surface.card,
    borderRadius: designTokens.radius.card,
    boxShadow: designTokens.shadows.modal,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box",
    animation: "cos-scale-up 220ms cubic-bezier(0.16, 1, 0.3, 1)",
    outline: "none",
  };

  const closeBtnStyle: React.CSSProperties = {
    position: "absolute",
    insetInlineEnd: designTokens.spacing[4],
    top: designTokens.spacing[4],
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
    zIndex: 1,
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
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        aria-label={ariaLabel}
        tabIndex={-1}
        style={modalContainerStyle}
      >
        {showCloseButton && (
          <button
            type="button"
            aria-label="بستن پنجره"
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

        {(title || description) && (
          <div
            style={{
              padding: `${designTokens.spacing[5]} ${designTokens.spacing[6]} ${designTokens.spacing[3]}`,
              borderBottom: `1px solid ${designTokens.colors.warmMarble.border}`,
              paddingInlineEnd: showCloseButton ? "56px" : designTokens.spacing[6],
            }}
          >
            {title && (
              <h2
                id={titleId}
                style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.xl,
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  color: designTokens.colors.text.primary,
                }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id={descId}
                style={{
                  margin: `${designTokens.spacing[1]} 0 0`,
                  fontSize: designTokens.typography.fontSize.sm,
                  color: designTokens.colors.text.muted,
                }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        <div
          style={{
            padding: `${designTokens.spacing[5]} ${designTokens.spacing[6]}`,
            overflowY: "auto",
            flex: "1 1 auto",
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes cos-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cos-scale-up {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}

export const Dialog = Modal;
export type DialogProps = ModalProps;
