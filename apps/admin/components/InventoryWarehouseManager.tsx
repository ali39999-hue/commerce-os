"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { authedFetch, faNumber } from "./types";

export interface InventoryItem {
  variantId: string;
  productId: string;
  sku: string;
  title: string;
  slug: string;
  warehouseCode: string;
  warehouseLocation: string;
  isColdChain?: boolean;
  onHand: number;
  reserved: number;
  available: number;
  threshold: number;
  updatedAt?: string;
}

export interface InventoryWarehouseManagerProps {
  userRole?: string;
  onLowStockCountChange?: (count: number) => void;
}

export default function InventoryWarehouseManager({
  userRole = "SUPER_ADMIN",
  onLowStockCountChange,
}: InventoryWarehouseManagerProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingSku, setSavingSku] = useState<string | null>(null);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState<string>("10");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "LOW_STOCK" | "COLD_CHAIN">("ALL");

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await authedFetch("/v1/inventory/admin", { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `خطا در دریافت موجودی انبار (HTTP ${res.status})`);
      }
      const data = await res.json();
      const loaded: InventoryItem[] = Array.isArray(data?.items) ? data.items : [];
      setItems(loaded);
      const lowCount =
        typeof data?.summary?.lowStockCount === "number"
          ? data.summary.lowStockCount
          : loaded.filter((i) => i.available <= i.threshold).length;
      onLowStockCountChange?.(lowCount);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرویس انبارداری",
      );
    } finally {
      setLoading(false);
    }
  }, [onLowStockCountChange]);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const handleRestock = async (item: InventoryItem) => {
    const qty = parseInt(restockAmount, 10);
    if (isNaN(qty) || qty <= 0) {
      setErrorMessage("تعداد افزایش موجودی باید عدد صحیح بزرگ‌تر از صفر باشد.");
      return;
    }

    setSavingSku(item.sku);
    setErrorMessage(null);
    setMessage(null);
    try {
      const res = await authedFetch("/v1/inventory/admin/restock", {
        method: "POST",
        body: JSON.stringify({
          variantId: item.variantId,
          sku: item.sku,
          warehouseCode: item.warehouseCode || "MAIN",
          quantityDelta: qty,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.item) {
        throw new Error(data?.message || `خطا در ثبت افزایش موجودی (HTTP ${res.status})`);
      }

      const updatedItem: InventoryItem = data.item;
      setItems((prev) => {
        const next = prev.map((row) =>
          row.variantId === updatedItem.variantId || row.sku === updatedItem.sku
            ? updatedItem
            : row,
        );
        onLowStockCountChange?.(next.filter((r) => r.available <= r.threshold).length);
        return next;
      });
      setMessage(
        `موجودی کالا با شناسه ${item.sku} در پایگاه‌داده ${faNumber(qty)} واحد افزایش یافت (موجودی فعلی: ${faNumber(updatedItem.onHand)} عدد).`,
      );
      setSelectedSku(null);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "خطا در ثبت افزایش موجودی در سرور",
      );
    } finally {
      setSavingSku(null);
    }
  };

  const canRestock = userRole === "SUPER_ADMIN" || userRole === "OPERATOR";
  const lowStockItems = items.filter((i) => i.available <= i.threshold);
  const coldChainItems = items.filter((i) => i.isColdChain);
  const totalColdChainAvailable = coldChainItems.reduce((sum, i) => sum + i.available, 0);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.sku.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.warehouseLocation.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (filterType === "LOW_STOCK") {
        return item.available <= item.threshold;
      }
      if (filterType === "COLD_CHAIN") {
        return !!item.isColdChain;
      }
      return true;
    });
  }, [items, searchQuery, filterType]);

  return (
    <div className="tab-pane">
      {userRole === "ACCOUNTANT" && (
        <div className="role-notice-banner info">
          <span>
            <strong>نقش فعال: حسابدار (ACCOUNTANT) — دسترسی ناظر بر ارزش انبار:</strong> مشاهده مقادیر فیزیکی، رزروها و زنجیره سرد جهت ارزیابی بهای تمام‌شده کالای فروش‌رفته (COGS). شارژ فیزیکی و جابجایی کالا مختص اپراتور انبار است.
          </span>
          <span className="domain-access-badge access-view_only">ارزش‌گذاری مالی</span>
        </div>
      )}

      {lowStockItems.length > 0 && (
        <div
          className="banner-offline-warning"
          style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}
        >
          <div>
            <strong>⚠️ هشدار آستانه حداقل موجودی (Inventory Alert):</strong> تعداد{" "}
            {faNumber(lowStockItems.length)} قلم کالا به کمتر یا مساوی آستانه بحرانی رسیده‌اند و نیازمند سفارش خرید هستند.
          </div>
        </div>
      )}

      {errorMessage && <div className="form-feedback-error">{errorMessage}</div>}
      {message && <div className="form-feedback-success">{message}</div>}

      <div className="kpi-grid kpi-grid-5">
        <div className="kpi-card">
          <span className="kpi-title">کل اقلام در گردش</span>
          <strong className="kpi-value tabular-nums">{faNumber(items.length)} SKU</strong>
          <span className="kpi-sub">انبار مرکزی و سردخانه دارویی (متصل به DB)</span>
        </div>
        <div className="kpi-card highlight">
          <span className="kpi-title">موجودی فیزیکی کل</span>
          <strong className="kpi-value tabular-nums">
            {faNumber(items.reduce((sum, i) => sum + i.onHand, 0))} عدد
          </strong>
          <span className="kpi-sub">شمارش لحظه‌ای قفسه‌ها</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">رزروهای فعال در سبدها</span>
          <strong className="kpi-value status-ok tabular-nums">
            {faNumber(items.reduce((sum, i) => sum + i.reserved, 0))} رزرو
          </strong>
          <span className="kpi-sub">قفل ردیفی با اجاره‌نامه ۱۵ دقیقه‌ای</span>
        </div>
        <div className="kpi-card highlight">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="kpi-title">زنجیره سرد (۲-۸°C)</span>
            <span className="cold-chain-tag">۲-۸°C</span>
          </div>
          <strong className="kpi-value status-ok tabular-nums">
            {faNumber(totalColdChainAvailable)} قابل فروش
          </strong>
          <span className="kpi-sub">
            {faNumber(coldChainItems.length)} فرمولاسیون حساس (سنسور پایدار)
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">کالاهای زیر آستانه هشدار</span>
          <strong
            className={`kpi-value tabular-nums ${lowStockItems.length > 0 ? "accent-text" : "status-ok"}`}
          >
            {faNumber(lowStockItems.length)} قلم
          </strong>
          <span className="kpi-sub">نیاز به ثبت سفارش تامین مجدد</span>
        </div>
      </div>

      <section className="admin-section-box">
        <div
          className="box-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}
        >
          <div>
            <h2>موجودی انبارها، رزروهای سیستمی و مدیریت آستانه</h2>
            <small>رزروهای موقت سبد خرید دارای اجاره‌نامه زمانی (TTL Lease) ۱۵ دقیقه‌ای هستند و هر شارژ موجودی در AuditLog ثبت می‌شود.</small>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              type="button"
              className="btn-action"
              onClick={() => void loadInventory()}
              disabled={loading}
            >
              {loading ? "در حال همگام‌سازی..." : "بروزرسانی از دیتابیس"}
            </button>
            <span className="badge-live">ISOLATION LEVEL SERIALIZABLE</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search-wrapper">
            <input
              type="text"
              placeholder="🔍 جستجو بر اساس SKU، عنوان کالا یا موقعیت انبار..."
              className="admin-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-chips-group">
            <button
              className={`filter-chip ${filterType === "ALL" ? "active" : ""}`}
              onClick={() => setFilterType("ALL")}
            >
              همه اقلام ({faNumber(items.length)})
            </button>
            <button
              className={`filter-chip ${filterType === "LOW_STOCK" ? "active" : ""}`}
              onClick={() => setFilterType("LOW_STOCK")}
            >
              کسری و زیر آستانه ({faNumber(lowStockItems.length)})
            </button>
            <button
              className={`filter-chip ${filterType === "COLD_CHAIN" ? "active" : ""}`}
              onClick={() => setFilterType("COLD_CHAIN")}
            >
              زنجیره سرد ({faNumber(coldChainItems.length)})
            </button>
          </div>
        </div>

        <div className="table-responsive-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>کد کالا (SKU)</th>
                <th>عنوان محصول</th>
                <th>مکان در انبار</th>
                <th>زنجیره دما</th>
                <th>موجودی کل</th>
                <th>رزرو جاری</th>
                <th>قابل فروش</th>
                <th>آستانه حداقل</th>
                <th>عملیات انبارداری</th>
              </tr>
            </thead>
            <tbody>
              {loading && items.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "24px" }} className="muted-text">
                    در حال دریافت موجودی واقعی انبار از سرور...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "24px" }} className="muted-text">
                    کالایی با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.available <= item.threshold;
                  const isSaving = savingSku === item.sku;
                  return (
                    <tr key={item.variantId}>
                      <td className="bold" dir="ltr">
                        {item.sku}
                      </td>
                      <td>{item.title}</td>
                      <td className="muted-text">{item.warehouseLocation}</td>
                      <td>
                        {item.isColdChain ? (
                          <span className="cold-chain-tag">۲-۸°C زنجیره سرد</span>
                        ) : (
                          <span className="muted-text">دمای اتاق (۱۵-۲۵°C)</span>
                        )}
                      </td>
                      <td className="tabular-nums">{faNumber(item.onHand)} عدد</td>
                      <td className="accent-text tabular-nums">{faNumber(item.reserved)} عدد</td>
                      <td>
                        <span className={`stock-tag ${isLow ? "low" : "ok"}`}>
                          {faNumber(item.available)} عدد
                        </span>
                      </td>
                      <td className="tabular-nums">{faNumber(item.threshold)} عدد</td>
                      <td>
                        {selectedSku === item.sku ? (
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <input
                              type="number"
                              min="1"
                              className="admin-input"
                              style={{ width: "70px", padding: "4px" }}
                              value={restockAmount}
                              onChange={(e) => setRestockAmount(e.target.value)}
                              disabled={isSaving}
                            />
                            <button
                              type="button"
                              onClick={() => void handleRestock(item)}
                              className="btn-approve"
                              disabled={isSaving}
                            >
                              {isSaving ? "..." : "تایید"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedSku(null)}
                              className="btn-reject"
                              disabled={isSaving}
                            >
                              انصراف
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (!canRestock) return;
                              setSelectedSku(item.sku);
                              setRestockAmount("10");
                            }}
                            className="btn-action"
                            disabled={!canRestock}
                            title={!canRestock ? "مختص اپراتور انبار (حسابدار: ارزش‌گذاری)" : "+ شارژ موجودی انبار"}
                            style={!canRestock ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                          >
                            {canRestock ? "+ شارژ موجودی" : "ارزش‌گذاری مالی"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
