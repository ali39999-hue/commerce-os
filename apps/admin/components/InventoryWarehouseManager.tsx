"use client";

import { useState } from "react";
import { faNumber } from "./types";

export interface InventoryItem {
  sku: string;
  title: string;
  onHand: number;
  reserved: number;
  available: number;
  threshold: number;
  warehouseLocation: string;
}

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    sku: "SKN-CRM-01",
    title: "سرم سد دفاعی سرامید و نیاسینامید ۵٪ (۳۰ میلی‌لیتر)",
    onHand: 45,
    reserved: 3,
    available: 42,
    threshold: 10,
    warehouseLocation: "قفسه B-04-12 (انبار مرکزی)",
  },
  {
    sku: "SKN-CLN-02",
    title: "شوینده ژلی ملایم هیالورونیک اسید و پانتنول (۲۰۰ میلی‌لیتر)",
    onHand: 18,
    reserved: 4,
    available: 14,
    threshold: 15,
    warehouseLocation: "قفسه B-02-08 (انبار مرکزی)",
  },
  {
    sku: "SKN-PEP-03",
    title: "کرم ضدچروک و لیفتینگ چندپپتیدی (۵۰ میلی‌لیتر)",
    onHand: 6,
    reserved: 3,
    available: 3,
    threshold: 10,
    warehouseLocation: "قفسه A-01-03 (سردخانه کلینیکال)",
  },
  {
    sku: "SKN-SUN-04",
    title: "ضدآفتاب مینرال بی‌رنگ SPF50+ بدون عطر (۵۰ میلی‌لیتر)",
    onHand: 85,
    reserved: 0,
    available: 85,
    threshold: 20,
    warehouseLocation: "قفسه C-05-18 (انبار مرکزی)",
  },
];

export default function InventoryWarehouseManager({
  userRole = "SUPER_ADMIN",
}: {
  userRole?: string;
}) {
  const [items, setItems] = useState<InventoryItem[]>(DEFAULT_INVENTORY);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState<string>("10");
  const [message, setMessage] = useState<string | null>(null);

  const handleRestock = (sku: string) => {
    const qty = parseInt(restockAmount, 10);
    if (isNaN(qty) || qty <= 0) return;

    setItems((prev) =>
      prev.map((item) =>
        item.sku === sku
          ? {
              ...item,
              onHand: item.onHand + qty,
              available: item.available + qty,
            }
          : item
      )
    );
    setMessage(`موجودی کالا با شناسه ${sku} با موفقیت ${faNumber(qty)} واحد شارژ شد.`);
    setSelectedSku(null);
  };

  const lowStockItems = items.filter((i) => i.available <= i.threshold);

  return (
    <div className="tab-pane">
      {lowStockItems.length > 0 && (
        <div className="banner-offline-warning" style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}>
          <div>
            <strong>⚠️ هشدار آستانه حداقل موجودی (Inventory Alert):</strong> تعداد {faNumber(lowStockItems.length)} قلم کالا به کمتر یا مساوی آستانه بحرانی رسیده‌اند و نیازمند سفارش خرید هستند.
          </div>
        </div>
      )}

      {message && <div className="form-feedback-success">{message}</div>}

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-title">کل اقلام در گردش</span>
          <strong className="kpi-value">{faNumber(items.length)} SKU</strong>
          <span className="kpi-sub">انبار مرکزی و سردخانه دارویی</span>
        </div>
        <div className="kpi-card highlight">
          <span className="kpi-title">موجودی فیزیکی کل</span>
          <strong className="kpi-value">
            {faNumber(items.reduce((sum, i) => sum + i.onHand, 0))} عدد
          </strong>
          <span className="kpi-sub">شمارش لحظه‌ای قفسه‌ها</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">رزروهای فعال در سبدها</span>
          <strong className="kpi-value status-ok">
            {faNumber(items.reduce((sum, i) => sum + i.reserved, 0))} رزرو
          </strong>
          <span className="kpi-sub">قفل ردیفی SELECT ... FOR UPDATE</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">کالاهای زیر آستانه هشدار</span>
          <strong className={`kpi-value ${lowStockItems.length > 0 ? "accent-text" : "status-ok"}`}>
            {faNumber(lowStockItems.length)} قلم
          </strong>
          <span className="kpi-sub">نیاز به ثبت سفارش تامین مجدد</span>
        </div>
      </div>

      <section className="admin-section-box">
        <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>موجودی انبارها، رزروهای سیستمی و مدیریت آستانه</h2>
            <small>رزروهای موقت سبد خرید دارای اجاره‌نامه زمانی (TTL Lease) ۱۵ دقیقه‌ای هستند تا انبار قفل نماند.</small>
          </div>
          <span className="badge-live">ISOLATION LEVEL SERIALIZABLE</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>کد کالا (SKU)</th>
              <th>عنوان محصول</th>
              <th>مکان در انبار</th>
              <th>موجودی کل</th>
              <th>رزرو جاری</th>
              <th>قابل فروش</th>
              <th>آستانه حداقل</th>
              <th>عملیات انبارداری</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isLow = item.available <= item.threshold;
              return (
                <tr key={item.sku}>
                  <td className="bold" dir="ltr">
                    {item.sku}
                  </td>
                  <td>{item.title}</td>
                  <td className="muted-text">{item.warehouseLocation}</td>
                  <td>{faNumber(item.onHand)} عدد</td>
                  <td className="accent-text">{faNumber(item.reserved)} عدد</td>
                  <td>
                    <span className={`stock-tag ${isLow ? "low" : "ok"}`}>
                      {faNumber(item.available)} عدد
                    </span>
                  </td>
                  <td>{faNumber(item.threshold)} عدد</td>
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
                        />
                        <button
                          onClick={() => handleRestock(item.sku)}
                          className="btn-approve"
                        >
                          تایید
                        </button>
                        <button
                          onClick={() => setSelectedSku(null)}
                          className="btn-reject"
                        >
                          انصراف
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedSku(item.sku);
                          setRestockAmount("10");
                        }}
                        className="btn-action"
                      >
                        + شارژ موجودی
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
