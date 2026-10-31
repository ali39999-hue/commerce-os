"use client";

import { useState } from "react";
import { faNumber } from "./types";

export interface PimProduct {
  id: string;
  slug: string;
  titleFa: string;
  category: string;
  brand: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  priceTomans: number;
  variantsCount: number;
  ingredientsCount: number;
  claimsCount: number;
  images: string[];
}

const INITIAL_PRODUCTS: PimProduct[] = [
  {
    id: "prod_1",
    slug: "ceramide-barrier-serum",
    titleFa: "سرم سد دفاعی سرامید و نیاسینامید ۵٪",
    category: "سرم درمانی",
    brand: "درما لَب",
    status: "PUBLISHED",
    priceTomans: 680000,
    variantsCount: 2,
    ingredientsCount: 6,
    claimsCount: 3,
    images: ["/images/products/ceramide-serum.jpg"],
  },
  {
    id: "prod_2",
    slug: "gentle-hydrating-cleanser",
    titleFa: "شوینده ژلی ملایم هیالورونیک اسید و پانتنول",
    category: "شوینده و پاک‌کننده",
    brand: "درما لَب",
    status: "PUBLISHED",
    priceTomans: 420000,
    variantsCount: 1,
    ingredientsCount: 4,
    claimsCount: 2,
    images: ["/images/products/cleanser.jpg"],
  },
  {
    id: "prod_3",
    slug: "peptide-firming-cream",
    titleFa: "کرم ضدچروک و لیفتینگ چندپپتیدی",
    category: "کرم و مرطوب‌کننده",
    brand: "اینووا کلینیک",
    status: "DRAFT",
    priceTomans: 950000,
    variantsCount: 1,
    ingredientsCount: 8,
    claimsCount: 4,
    images: ["/images/products/peptide-cream.jpg"],
  },
];

export default function CatalogPimManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const [products, setProducts] = useState<PimProduct[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<PimProduct | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [claimInput, setClaimInput] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleEdit = (p: PimProduct) => {
    setSelectedProduct(p);
    setEditingTitle(p.titleFa);
    setEditingPrice(p.priceTomans.toString());
    setShowEditor(true);
    setSuccessMsg("");
  };

  const handleSavePim = () => {
    if (!selectedProduct) return;
    setProducts((prev) =>
      prev.map((item) =>
        item.id === selectedProduct.id
          ? {
              ...item,
              titleFa: editingTitle.trim() || item.titleFa,
              priceTomans: Number(editingPrice) || item.priceTomans,
              claimsCount: claimInput ? item.claimsCount + 1 : item.claimsCount,
              ingredientsCount: ingredientInput ? item.ingredientsCount + 1 : item.ingredientsCount,
            }
          : item
      )
    );
    setSuccessMsg(`تغییرات کاتالوگ برای محصول «${selectedProduct.titleFa}» با موفقیت ذخیره شد.`);
    setClaimInput("");
    setIngredientInput("");
  };

  return (
    <div className="tab-pane">
      <section className="admin-section-box">
        <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>مدیریت کاتالوگ و PIM اقلام بالینی و درمانی</h2>
            <small>مدیریت جامع ویژگی‌های تخصصی، واریانت‌ها، ساختار فرمولاسیون و ادعاهای بالینی اثبات‌شده</small>
          </div>
          <span className="badge-live">PIM / DAM ACTIVE</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>عنوان محصول</th>
              <th>دسته‌بندی</th>
              <th>برند</th>
              <th>قیمت پایه (تومان)</th>
              <th>واریانت‌ها</th>
              <th>مواد موثره</th>
              <th>ادعای بالینی</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="bold">{p.titleFa}</td>
                <td>{p.category}</td>
                <td>{p.brand}</td>
                <td className="bold">{new Intl.NumberFormat("fa-IR").format(p.priceTomans)}</td>
                <td>{faNumber(p.variantsCount)} واریانت</td>
                <td>{faNumber(p.ingredientsCount)} ماده فعال</td>
                <td>{faNumber(p.claimsCount)} ادعای تاییدشده</td>
                <td>
                  <span className={`status-pill ${p.status === "PUBLISHED" ? "paid" : "processing"}`}>
                    {p.status === "PUBLISHED" ? "منتشر شده" : "پیش‌نویس"}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(p)} className="btn-action">
                    ✏️ ویرایش PIM
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {showEditor && selectedProduct && (
        <section className="admin-section-box" style={{ marginTop: "24px", border: "2px solid var(--brand)" }}>
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>ویرایشگر جامع PIM: {selectedProduct.titleFa}</h2>
              <small>تنظیم مواد موثره (INCI)، تصاویر گالری DAM و ادعاهای سازمانی</small>
            </div>
            <button onClick={() => setShowEditor(false)} className="btn-reject">
              ✕ بستن ویرایشگر
            </button>
          </div>

          <div className="coupon-form-grid">
            <div className="coupon-field">
              <label>عنوان فارسی محصول</label>
              <input
                className="admin-input"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
              />
            </div>
            <div className="coupon-field">
              <label>قیمت مصرف‌کننده (تومان)</label>
              <input
                className="admin-input"
                dir="ltr"
                type="number"
                value={editingPrice}
                onChange={(e) => setEditingPrice(e.target.value)}
              />
            </div>
            <div className="coupon-field">
              <label>افزودن ماده موثره جدید (INCI & الغا)</label>
              <input
                className="admin-input"
                placeholder="مثال: Zinc PCA 1% — کنترل چربی و التیام‌بخش"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
              />
            </div>
            <div className="coupon-field">
              <label>افزودن ادعای بالینی و رفرنس مقاله پژوهشی</label>
              <input
                className="admin-input"
                placeholder="مثال: کاهش ۳۲٪ قرمزی پس از ۱۴ روز (مطالعه In-Vivo)"
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value)}
              />
            </div>
          </div>

          {successMsg && <div className="form-feedback-success">{successMsg}</div>}

          <div className="coupon-form-actions" style={{ marginTop: "16px" }}>
            <button onClick={handleSavePim} className="btn-primary">
              💾 ذخیره تغییرات PIM و اعتبارسنجی بالینی
            </button>
            <span className="muted-text">تغییرات بلافاصله در کاتالوگ فروشگاه و برچسب‌های استاندارد اعمال می‌شود.</span>
          </div>
        </section>
      )}
    </div>
  );
}
