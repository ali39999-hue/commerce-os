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
    id: "prod_drdermer_001",
    slug: "carboxygel",
    titleFa: "ژل حرفه‌ای کربوکسی‌تراپی CarboxyGel™ Professional Therapy",
    category: "کربوکسی‌تراپی و اکسیژن‌رسانی",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 3200000,
    variantsCount: 2,
    ingredientsCount: 7,
    claimsCount: 4,
    images: ["/assets/drdermer/2025/07/carboxygel.png"],
  },
  {
    id: "prod_drdermer_002",
    slug: "carboxypod",
    titleFa: "کپسول‌های فعال‌ساز کربوکسی‌پاد CarboxyPod™ Activation Pods",
    category: "پادهای لایه‌بردار و فعال‌ساز",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 1200000,
    variantsCount: 3,
    ingredientsCount: 6,
    claimsCount: 3,
    images: ["/assets/drdermer/2025/07/carbon-carboxypod-1.png"],
  },
  {
    id: "prod_drdermer_003",
    slug: "carboxypad",
    titleFa: "شیت ماسک‌های فعال‌ساز صورت و گردن CarboxyPad™",
    category: "ماسک‌های ترنس‌درمال",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 1400000,
    variantsCount: 2,
    ingredientsCount: 4,
    claimsCount: 3,
    images: ["/assets/drdermer/2025/07/carboxypad-1024x198.png"],
  },
  {
    id: "prod_drdermer_004",
    slug: "crystalene",
    titleFa: "خمیر پولیش و لایه‌بردار کریستالین Crystalene Polish Paste",
    category: "میکرودرم و لایه‌برداری",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 1750000,
    variantsCount: 1,
    ingredientsCount: 9,
    claimsCount: 4,
    images: ["/assets/drdermer/2025/08/15crystalene-1200x1109.webp"],
  },
  {
    id: "prod_drdermer_005",
    slug: "healene",
    titleFa: "ژل تسکین‌بخش و ترمیم سد دفاعی هیلین Healene Soothing Gel",
    category: "ترمیم و التیام پوست",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 1650000,
    variantsCount: 1,
    ingredientsCount: 8,
    claimsCount: 4,
    images: ["/assets/drdermer/2025/08/13healene-1200x1109.webp"],
  },
  {
    id: "prod_drdermer_006",
    slug: "silicalene",
    titleFa: "اسکراب دتوکس سیلیکالین Silicalene Mild Silica Scrub",
    category: "دتوکس و کنترل سبوم",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 1550000,
    variantsCount: 1,
    ingredientsCount: 9,
    claimsCount: 3,
    images: ["/assets/drdermer/2025/08/14silicalene-1200x1109.webp"],
  },
  {
    id: "prod_drdermer_007",
    slug: "carbox",
    titleFa: "ایستگاه بالینی کربوکسی‌تراپی CarboX™ Medical Station",
    category: "تجهیزات کلینیکال و پزشکی",
    brand: "ReeMed Medical Pro",
    status: "PUBLISHED",
    priceTomans: 45000000,
    variantsCount: 1,
    ingredientsCount: 0,
    claimsCount: 6,
    images: ["/assets/drdermer/2025/08/19carbox.webp"],
  },
  {
    id: "prod_drdermer_008",
    slug: "plasmax",
    titleFa: "دستگاه جراحی و درمانی میکروپلاسما PlasmaX™ Multi-Energy",
    category: "تجهیزات کلینیکال و پزشکی",
    brand: "ReeMed Medical Pro",
    status: "PUBLISHED",
    priceTomans: 62000000,
    variantsCount: 1,
    ingredientsCount: 0,
    claimsCount: 6,
    images: ["/assets/drdermer/2025/07/1-plasma22-600x600.png"],
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
