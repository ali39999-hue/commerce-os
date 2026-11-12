"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ShoppingBag,
  Package,
  X,
  Bell,
  AlertCircle,
  AlertTriangle,
  Info,
  ArrowLeft,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { useCart } from "./cart";
import "./notification-modal.css";

export type NotificationType =
  | "cart_add"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "order_status"
  | "center";

export interface NotificationItemPayload {
  title: string;
  priceAmount?: string | number;
  image?: string;
  qty?: number;
  sku?: string;
}

export interface NotificationModalData {
  id?: string;
  type: NotificationType;
  title: string;
  message?: string;
  item?: NotificationItemPayload;
  orderNumber?: string;
  trackingCode?: string;
  statusText?: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  autoCloseMs?: number;
}

// Global dispatcher function
export function showNotificationModal(data: NotificationModalData) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("commerce_os:notify", {
        detail: data,
      })
    );
  }
}

// Sample clinical & store notifications for Notification Center
const DEMO_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "تأیید سلامت زنجیره سرد مرسوله",
    text: "سرم‌های پپتیدی سفارش DR-9842 در محدوده دمایی ۲ تا ۸ درجه سانتی‌گراد بسته‌بندی شدند.",
    time: "۱۰ دقیقه پیش",
    unread: true,
  },
  {
    id: "notif-2",
    title: "کد تخفیف فصلی dermavia",
    text: "کد تخفیف ۱۵٪ به مناسبت راه‌اندازی نسخه جدید با شناسه DERMAVIA15 در دسترس شماست.",
    time: "دیروز",
    unread: true,
  },
  {
    id: "notif-3",
    title: "ثبت پرونده کلینیکال پوست",
    text: "رژیم مشاوره‌ای روزانه شما در بخش پروفایل کاربری به‌روزرسانی شد.",
    time: "۳ روز پیش",
    unread: false,
  },
];

export function NotificationModal() {
  const router = useRouter();
  const cart = useCart();
  const [activeNotif, setActiveNotif] = useState<NotificationModalData | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Close helper with exit animation
  const handleAnimatedClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setActiveNotif(null);
      setIsClosing(false);
    }, 280);
  }, []);

  const handleClose = useCallback(() => {
    setActiveNotif(null);
    setIsClosing(false);
  }, []);

  // Listen to commerce_os:notify events
  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<NotificationModalData>;
      if (customEvent.detail) {
        setIsClosing(false);
        setActiveNotif(customEvent.detail);
      }
    };

    window.addEventListener("commerce_os:notify", handleEvent);
    return () => window.removeEventListener("commerce_os:notify", handleEvent);
  }, []);

  // Auto-close for cart_add toast (4.5s)
  useEffect(() => {
    if (!activeNotif || activeNotif.type !== "cart_add" || isHovered) return;
    const timer = setTimeout(() => {
      handleAnimatedClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [activeNotif, isHovered, handleAnimatedClose]);

  // ESC key listener
  useEffect(() => {
    if (!activeNotif) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleAnimatedClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeNotif, handleAnimatedClose]);

  // Auto-close if requested by generic modal
  useEffect(() => {
    if (!activeNotif?.autoCloseMs || activeNotif.type === "cart_add") return;
    const timer = setTimeout(() => {
      handleClose();
    }, activeNotif.autoCloseMs);
    return () => clearTimeout(timer);
  }, [activeNotif, handleClose]);

  if (!activeNotif) return null;

  const {
    type,
    title,
    message,
    item,
    orderNumber,
    trackingCode,
    statusText,
    primaryAction,
    secondaryAction,
  } = activeNotif;

  // ── SPECIAL FLOATING TOAST FOR CART_ADD (User Screenshot Match) ──
  if (type === "cart_add") {
    return (
      <aside
        className={`cart-add-toast-container ${isClosing ? "toast-exit" : "toast-enter"}`}
        role="status"
        aria-live="polite"
        dir="rtl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="cart-add-toast-card"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest(".cart-add-toast-close")) return;
            handleClose();
            router.push("/cart");
          }}
          title="مشاهده سبد خرید"
        >
          {/* Right Side in RTL: Close X + Checkmark Icon + "کالا اضافه شد!" */}
          <div className="cart-add-toast-right">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAnimatedClose();
              }}
              className="cart-add-toast-close"
              aria-label="بستن اعلان"
            >
              <X size={17} />
            </button>

            <div className="cart-add-toast-check-wrap" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="10" fill="#16a34a" />
                <path
                  d="M6 10.2L8.7 13L14.2 7.5"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span className="cart-add-toast-msg">کالا اضافه شد!</span>
          </div>

          {/* Left Side in RTL: "برو به سبد خرید <" Capsule Action Button */}
          <Link
            href="/cart"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="cart-add-toast-action"
          >
            <span>برو به سبد خرید</span>
            <ChevronLeft size={16} />
          </Link>
        </div>
      </aside>
    );
  }

  const totalItemCount = cart?.itemCount ?? 0;

  const totalTomansFormatted =
    totalItemCount > 0 && cart?.calculations?.grandTotalTomans != null && cart.calculations.grandTotalTomans > 0n
      ? `${cart.calculations.grandTotalTomans.toLocaleString("fa-IR")} تومان`
      : "۰ تومان";

  return (
    <div
      className="notif-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-modal-title"
      onClick={handleClose}
    >
      <div
        className="notif-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="notif-close-btn"
          aria-label="بستن اعلان"
        >
          <X size={17} />
        </button>

        <div className="notif-body">
          {/* Header & Icon */}
          <div className="notif-header">
            <div className={`notif-icon-circle ${type}`}>
              {type === "success" && <CheckCircle2 size={26} />}
              {type === "order_status" && <Package size={25} />}
              {type === "center" && <Bell size={24} />}
              {type === "info" && <Info size={25} />}
              {type === "warning" && <AlertTriangle size={25} />}
              {type === "error" && <AlertCircle size={25} />}
            </div>

            <div className="notif-title-area">
              <h3 id="notif-modal-title" className="notif-title">
                {title}
              </h3>
              {message && <p className="notif-subtitle">{message}</p>}
            </div>
          </div>

          {/* Special View: Notification Center */}
          {type === "center" && (
            <>
              <div className="notif-center-list">
                {DEMO_NOTIFICATIONS.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notif-center-item ${notif.unread ? "unread" : ""}`}
                  >
                    <div className="notif-center-item-content">
                      <div className="notif-center-item-title">
                        <span>{notif.title}</span>
                        <span className="notif-center-item-time">{notif.time}</span>
                      </div>
                      <p className="notif-center-item-text">{notif.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="notif-actions" style={{ gridTemplateColumns: "1fr" }}>
                <button
                  type="button"
                  className="notif-btn-secondary"
                  onClick={handleClose}
                >
                  <span>بستن اعلان‌ها</span>
                </button>
              </div>
            </>
          )}

          {/* Standard View: Success / Info / Warning / Error / Order Status */}
          {type !== "center" && (
            <>
              {orderNumber && (
                <div className="notif-cart-summary">
                  <span>شماره پیگیری: <strong>{orderNumber}</strong></span>
                  {statusText && <span>وضعیت: <strong>{statusText}</strong></span>}
                </div>
              )}

              <div className="notif-actions">
                {primaryAction ? (
                  primaryAction.href ? (
                    <Link
                      href={primaryAction.href}
                      className="notif-btn-primary"
                      onClick={() => {
                        primaryAction.onClick?.();
                        handleClose();
                      }}
                    >
                      <span>{primaryAction.label}</span>
                      <ChevronLeft size={16} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="notif-btn-primary"
                      onClick={() => {
                        primaryAction.onClick?.();
                        handleClose();
                      }}
                    >
                      <span>{primaryAction.label}</span>
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    className="notif-btn-primary"
                    onClick={handleClose}
                  >
                    <span>متوجه شدم</span>
                  </button>
                )}

                {secondaryAction && (
                  secondaryAction.href ? (
                    <Link
                      href={secondaryAction.href}
                      className="notif-btn-secondary"
                      onClick={() => {
                        secondaryAction.onClick?.();
                        handleClose();
                      }}
                    >
                      <span>{secondaryAction.label}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="notif-btn-secondary"
                      onClick={() => {
                        secondaryAction.onClick?.();
                        handleClose();
                      }}
                    >
                      <span>{secondaryAction.label}</span>
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
