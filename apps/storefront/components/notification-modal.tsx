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
    title: "کد تخفیف فصلی روپاک شاپ",
    text: "کد تخفیف ۱۵٪ به مناسبت راه‌اندازی نسخه جدید با شناسه RUPAK15 در دسترس شماست.",
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

  // Close helper
  const handleClose = useCallback(() => {
    setActiveNotif(null);
  }, []);

  // Listen to commerce_os:notify events
  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<NotificationModalData>;
      if (customEvent.detail) {
        setActiveNotif(customEvent.detail);
      }
    };

    window.addEventListener("commerce_os:notify", handleEvent);
    return () => window.removeEventListener("commerce_os:notify", handleEvent);
  }, []);

  // ESC key listener
  useEffect(() => {
    if (!activeNotif) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeNotif, handleClose]);

  // Auto-close if requested
  useEffect(() => {
    if (!activeNotif?.autoCloseMs) return;
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

  const totalTomansFormatted =
    cart?.calculations?.grandTotalTomans != null
      ? `${cart.calculations.grandTotalTomans.toLocaleString("fa-IR")} تومان`
      : "۰ تومان";

  const totalItemCount = cart?.itemCount ?? 0;

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
              {type === "cart_add" && <CheckCircle2 size={26} />}
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

          {/* Special View: Cart Item Added */}
          {type === "cart_add" && (
            <>
              {item && (
                <div className="notif-product-card">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="notif-product-thumb"
                    />
                  ) : (
                    <div className="notif-product-placeholder">
                      <ShoppingBag size={24} />
                    </div>
                  )}

                  <div className="notif-product-meta">
                    <span className="notif-product-title">{item.title}</span>
                    <div className="notif-product-price">
                      {item.priceAmount != null && (
                        <span>
                          {Number(item.priceAmount).toLocaleString("fa-IR")} تومان
                        </span>
                      )}
                      {item.qty && (
                        <span className="notif-product-qty-badge">
                          تعداد: {item.qty.toLocaleString("fa-IR")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Summary */}
              <div className="notif-cart-summary">
                <span>
                  مجموع اقلام سبد: <strong>{totalItemCount.toLocaleString("fa-IR")} قلم</strong>
                </span>
                <span>
                  مبلغ فعلی: <strong>{totalTomansFormatted}</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="notif-actions">
                <button
                  type="button"
                  className="notif-btn-primary"
                  onClick={() => {
                    handleClose();
                    if (cart?.openDrawer) {
                      cart.openDrawer();
                    } else {
                      router.push("/cart");
                    }
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>مشاهده سبد و تسویه</span>
                </button>

                <button
                  type="button"
                  className="notif-btn-secondary"
                  onClick={handleClose}
                >
                  <span>ادامه خرید در روپاک</span>
                </button>
              </div>
            </>
          )}

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
          {type !== "cart_add" && type !== "center" && (
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
