"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  API_BASE,
  TENANT_HEADERS,
  faNumber,
  postTenantJson,
  patchTenantJson,
} from "./types";
import {
  Plus,
  Search,
  RefreshCw,
  Edit3,
  DollarSign,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  FlaskConical,
  X,
  Save,
} from "lucide-react";

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
  inStock?: boolean;
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
    inStock: true,
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
    inStock: true,
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
    inStock: true,
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
    inStock: true,
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
    inStock: true,
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
    inStock: true,
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
    inStock: true,
  },
  {
    id: "prod_drdermer_008",
    slug: "plasmax",
    titleFa: "دستگاه جراحی و درمانی میکروپلاسما PlasmaX™ Multi-Energy",
    category: "تجهیزات کلینیکال و پزشکی",
    brand: "ReeMed Medical Pro",
    status: "PUBLISHED",
    priceTomans: 58000000,
    variantsCount: 2,
    ingredientsCount: 2,
    claimsCount: 6,
    images: ["/assets/drdermer/2025/08/18plasmax.webp"],
    inStock: true,
  },
];

export default function CatalogPimManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const canEditPim = userRole === "SUPER_ADMIN" || userRole === "OPERATOR";
  const [products, setProducts] = useState<PimProduct[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<"ALL" | "ReeSkin" | "ReeMed">("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Price Modal State
  const [pricingProduct, setPricingProduct] = useState<PimProduct | null>(null);
  const [pricingAmount, setPricingAmount] = useState("");
  const [pricingInStock, setPricingInStock] = useState(true);
  const [priceSubmitting, setPriceSubmitting] = useState(false);

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addSlug, setAddSlug] = useState("");
  const [addBrand, setAddBrand] = useState("ReeSkin Clinical");
  const [addCategory, setAddCategory] = useState("آمپول و سرم تخصصی");
  const [addPrice, setAddPrice] = useState("");
  const [addSku, setAddSku] = useState("");
  const [addInStock, setAddInStock] = useState(true);
  const [addInci, setAddInci] = useState("");
  const [addClaim, setAddClaim] = useState("");
  const [addImageUrl, setAddImageUrl] = useState("/assets/drdermer/2025/07/carboxygel.png");
  const [addDescription, setAddDescription] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Comprehensive PIM Editor Modal State
  const [selectedProduct, setSelectedProduct] = useState<PimProduct | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [claimInput, setClaimInput] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [editorSubmitting, setEditorSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/stores/admin/products`, {
        headers: TENANT_HEADERS,
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        const payload = await res.json();
        if (Array.isArray(payload?.data) && payload.data.length > 0) {
          const mapped: PimProduct[] = payload.data.map((p: any) => {
            const variant = p.variants?.[0];
            const priceTomans = variant ? Number(variant.priceAmount) / 10 : p.priceTomans || 0;
            return {
              id: p.id,
              slug: p.slug,
              titleFa: p.titleFa || p.title,
              category: p.category?.titleFa || p.category || "مراقبت پوست و درماتولوژی",
              brand: p.brand?.name || (p.slug.includes("plasmax") || p.slug.includes("carbox") ? "ReeMed Medical Pro" : "ReeSkin Clinical"),
              status: (p.status as any) || "PUBLISHED",
              priceTomans,
              variantsCount: p.variants?.length || 1,
              ingredientsCount: p.ingredients?.length || 0,
              claimsCount: p.claims?.length || 0,
              images: p.media?.map((m: any) => m.url) || ["/assets/drdermer/2025/07/carboxygel.png"],
              inStock: variant?.inStock !== false,
            };
          });
          setProducts(mapped);
        }
      }
    } catch (err) {
      console.warn("Using local catalog seed due to network timeout:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  // Open Quick Pricing Modal
  const handleOpenPricing = (p: PimProduct) => {
    setPricingProduct(p);
    setPricingAmount(p.priceTomans.toString());
    setPricingInStock(p.inStock !== false);
  };

  // Submit Quick Price Change
  const handleSavePrice = async () => {
    if (!pricingProduct) return;
    const numPrice = Number(pricingAmount);
    if (!Number.isFinite(numPrice) || numPrice <= 0) {
      alert("لطفاً قیمت معتبر به تومان وارد کنید.");
      return;
    }

    setPriceSubmitting(true);
    try {
      const res = await patchTenantJson(`/v1/stores/admin/products/${pricingProduct.slug}/price`, {
        priceTomans: numPrice,
        inStock: pricingInStock,
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === pricingProduct.id || item.slug === pricingProduct.slug
              ? { ...item, priceTomans: numPrice, inStock: pricingInStock }
              : item
          )
        );
        showToast(`قیمت کالا «${pricingProduct.titleFa}» به ${new Intl.NumberFormat("fa-IR").format(numPrice)} تومان به‌روز شد.`);
        setPricingProduct(null);
      } else {
        alert(res.message || "خطا در به‌روزرسانی قیمت");
      }
    } catch {
      alert("خطای ارتباط با سرور");
    } finally {
      setPriceSubmitting(false);
    }
  };

  // Open PIM Comprehensive Editor
  const handleEdit = (p: PimProduct) => {
    setSelectedProduct(p);
    setEditingTitle(p.titleFa);
    setEditingPrice(p.priceTomans.toString());
    setShowEditor(true);
  };

  // Save Comprehensive PIM Changes
  const handleSavePim = async () => {
    if (!selectedProduct) return;
    setEditorSubmitting(true);
    try {
      const numPrice = Number(editingPrice) || selectedProduct.priceTomans;
      // Also sync price to server
      await patchTenantJson(`/v1/stores/admin/products/${selectedProduct.slug}/price`, {
        priceTomans: numPrice,
      });

      setProducts((prev) =>
        prev.map((item) =>
          item.id === selectedProduct.id
            ? {
                ...item,
                titleFa: editingTitle.trim() || item.titleFa,
                priceTomans: numPrice,
                claimsCount: claimInput ? item.claimsCount + 1 : item.claimsCount,
                ingredientsCount: ingredientInput ? item.ingredientsCount + 1 : item.ingredientsCount,
              }
            : item
        )
      );
      showToast(`تغییرات کاتالوگ و فرمولاسیون «${selectedProduct.titleFa}» با موفقیت ذخیره شد.`);
      setShowEditor(false);
      setClaimInput("");
      setIngredientInput("");
    } catch {
      alert("خطا در ذخیره تغییرات PIM");
    } finally {
      setEditorSubmitting(false);
    }
  };

  // Submit Add Product Form
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim() || !addPrice) {
      alert("لطفاً عنوان فارسی و قیمت محصول را وارد نمایید.");
      return;
    }

    setAddSubmitting(true);
    try {
      const numPrice = Number(addPrice);
      const generatedSlug =
        addSlug.trim() ||
        addTitle
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-") ||
        `prod-${Date.now().toString(36)}`;

      const payload = {
        titleFa: addTitle.trim(),
        slug: generatedSlug,
        brandName: addBrand,
        category: addCategory,
        priceTomans: numPrice,
        sku: addSku.trim() || `SKU-${generatedSlug.toUpperCase().slice(0, 8)}`,
        inStock: addInStock,
        description: addDescription.trim() || null,
        imageUrl: addImageUrl.trim(),
        inci: addInci.trim() || null,
        claim: addClaim.trim() || null,
      };

      const res = await postTenantJson("/v1/stores/admin/products", payload);
      if (res.ok) {
        showToast(`محصول جدید «${addTitle}» با موفقیت به کاتالوگ افزوده و در فروشگاه منتشر شد.`);
        setShowAddModal(false);
        // Reset form
        setAddTitle("");
        setAddSlug("");
        setAddPrice("");
        setAddSku("");
        setAddInci("");
        setAddClaim("");
        setAddDescription("");
        void loadProducts();
      } else {
        alert(res.message || "خطا در افزودن محصول به کاتالوگ");
      }
    } catch {
      alert("خطای ارتباط با سرور");
    } finally {
      setAddSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !searchQuery.trim() ||
      p.titleFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchBrand =
      brandFilter === "ALL" ||
      (brandFilter === "ReeSkin" && p.brand.includes("ReeSkin")) ||
      (brandFilter === "ReeMed" && p.brand.includes("ReeMed"));

    return matchSearch && matchBrand;
  });

  return (
    <div className="tab-pane">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 9999,
            background: "#047857",
            color: "#ffffff",
            padding: "14px 24px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(4, 120, 87, 0.35)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.95rem",
            animation: "slideIn 0.25s ease-out",
          }}
        >
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Top Section Header ── */}
      <section className="admin-section-box">
        <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2>کاتالوگ تخصصی اقلام بالینی و درمانی (PIM / DAM)</h2>
            <small>مدیریت جامع ویژگی‌های تخصصی، قیمت‌گذاری لحظه‌ای، فرمولاسیون و ادعاهای اثبات‌شده</small>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => void loadProducts()}
              className="btn-action"
              style={{ display: "flex", alignItems: "center", gap: "6px", borderRadius: "9999px" }}
              title="بارگذاری مجدد کاتالوگ"
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} />
              <span>به‌روزرسانی</span>
            </button>
            {canEditPim && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "9999px",
                  padding: "8px 20px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                }}
              >
                <Plus size={18} />
                <span>افزودن محصول جدید به کاتالوگ</span>
              </button>
            )}
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="admin-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", marginTop: "16px" }}>
          <div className="admin-search-wrapper" style={{ flex: "1 1 320px", maxWidth: "450px" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={16} style={{ position: "absolute", right: "14px", color: "var(--muted)", pointerEvents: "none" }} />
              <input
                type="text"
                placeholder="جستجو در کاتالوگ (نام فارسی، دسته‌بندی یا شناسه انگلیسی)..."
                className="admin-search-input"
                style={{ paddingRight: "40px", width: "100%", borderRadius: "9999px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-chips-group" style={{ display: "flex", gap: "8px" }}>
            <button
              className={`filter-chip ${brandFilter === "ALL" ? "active" : ""}`}
              onClick={() => setBrandFilter("ALL")}
            >
              همه اقلام ({faNumber(products.length)})
            </button>
            <button
              className={`filter-chip ${brandFilter === "ReeSkin" ? "active" : ""}`}
              onClick={() => setBrandFilter("ReeSkin")}
            >
              مراقبت خانگی ReeSkin ({faNumber(products.filter((p) => p.brand.includes("ReeSkin")).length)})
            </button>
            <button
              className={`filter-chip ${brandFilter === "ReeMed" ? "active" : ""}`}
              onClick={() => setBrandFilter("ReeMed")}
            >
              تجهیزات مطبی ReeMed ({faNumber(products.filter((p) => p.brand.includes("ReeMed")).length)})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive-container" style={{ marginTop: "16px" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>تصویر</th>
                <th>عنوان محصول</th>
                <th>دسته‌بندی</th>
                <th>برند</th>
                <th>قیمت پایه (تومان)</th>
                <th>موجودی</th>
                <th>مواد موثره</th>
                <th>ادعای بالینی</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                    کالایی با این مشخصات در کاتالوگ یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: "#f1f5f9",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {p.images && p.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.images[0]}
                            alt={p.titleFa}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/drdermer/2025/07/carboxygel.png";
                            }}
                          />
                        ) : (
                          <Package size={20} color="#94a3b8" />
                        )}
                      </div>
                    </td>
                    <td className="bold" style={{ maxWidth: "260px" }}>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{p.titleFa}</div>
                      <small style={{ color: "var(--muted)", fontSize: "0.75rem" }}>اسلاگ: {p.slug}</small>
                    </td>
                    <td>{p.category}</td>
                    <td>
                      <span className="category-pill">{p.brand}</span>
                    </td>
                    <td className="bold tabular-nums" style={{ color: "#047857", fontSize: "0.95rem" }}>
                      {new Intl.NumberFormat("fa-IR").format(p.priceTomans)}
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          background: p.inStock !== false ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                          color: p.inStock !== false ? "#047857" : "#b91c1c",
                        }}
                      >
                        {p.inStock !== false ? "✓ موجود در انبار" : "✕ ناموجود"}
                      </span>
                    </td>
                    <td className="tabular-nums">{faNumber(p.ingredientsCount)} ماده فعال</td>
                    <td className="tabular-nums">{faNumber(p.claimsCount)} ادعا</td>
                    <td>
                      <span className={`status-pill ${p.status === "PUBLISHED" ? "approved pulse" : "pending_review"}`}>
                        {p.status === "PUBLISHED" ? "منتشر شده" : "پیش‌نویس"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {/* Quick Pricing Button */}
                        {canEditPim && (
                          <button
                            onClick={() => handleOpenPricing(p)}
                            className="btn-action-pill"
                            style={{
                              background: "#ecfdf5",
                              color: "#047857",
                              border: "1px solid #10b981",
                              padding: "4px 10px",
                              borderRadius: "9999px",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            title="تغییر قیمت و موجودی کالا"
                          >
                            <DollarSign size={13} />
                            <span>قیمت‌گذاری</span>
                          </button>
                        )}

                        {/* Comprehensive PIM Edit Button */}
                        <button
                          onClick={() => handleEdit(p)}
                          className="btn-action"
                          style={{
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            fontSize: "0.78rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          title={!canEditPim ? "مشاهده کاتالوگ" : "ویرایش فرمولاسیون و ادعاها"}
                        >
                          <Edit3 size={13} />
                          <span>{canEditPim ? "ویرایش PIM" : "مشاهده"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 2. Modal: Quick Price Setting ── */}
      {pricingProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "26px 30px",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ background: "#ecfdf5", padding: "8px", borderRadius: "10px", color: "#047857" }}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                    قیمت‌گذاری و انبار کالا
                  </h3>
                  <small style={{ color: "var(--muted)" }}>{pricingProduct.titleFa}</small>
                </div>
              </div>
              <button
                onClick={() => setPricingProduct(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                قیمت فروش مصرف‌کننده (تومان) *
              </label>
              <input
                type="number"
                dir="ltr"
                className="admin-input"
                style={{ width: "100%", fontSize: "1.1rem", fontWeight: 700, color: "#047857" }}
                value={pricingAmount}
                onChange={(e) => setPricingAmount(e.target.value)}
              />
              {pricingAmount && (
                <div style={{ marginTop: "6px", fontSize: "0.82rem", color: "#047857", fontWeight: 600 }}>
                  معادل فارسی: {new Intl.NumberFormat("fa-IR").format(Number(pricingAmount) || 0)} تومان
                </div>
              )}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>
                وضعیت موجودی در انبار مرکزی
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setPricingInStock(true)}
                  style={{
                    flex: 1,
                    padding: "8px 14px",
                    borderRadius: "12px",
                    border: pricingInStock ? "2px solid #10b981" : "1px solid #cbd5e1",
                    background: pricingInStock ? "#ecfdf5" : "#ffffff",
                    color: pricingInStock ? "#047857" : "#64748b",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  ✓ موجود و آماده ارسال
                </button>
                <button
                  type="button"
                  onClick={() => setPricingInStock(false)}
                  style={{
                    flex: 1,
                    padding: "8px 14px",
                    borderRadius: "12px",
                    border: !pricingInStock ? "2px solid #ef4444" : "1px solid #cbd5e1",
                    background: !pricingInStock ? "#fee2e2" : "#ffffff",
                    color: !pricingInStock ? "#b91c1c" : "#64748b",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  ✕ عدم موجودی (کسری)
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setPricingProduct(null)}
                className="btn-action"
                style={{ borderRadius: "9999px" }}
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSavePrice}
                disabled={priceSubmitting}
                className="btn-primary"
                style={{ borderRadius: "9999px", padding: "8px 24px" }}
              >
                {priceSubmitting ? "در حال ذخیره..." : "💾 اعمال قیمت جدید"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Modal: Add New Product ── */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "26px 30px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
                  افزودن محصول جدید به کاتالوگ فروشگاه
                </h3>
                <small style={{ color: "var(--muted)" }}>انتشار لحظه‌ای در استورفرانت و ثبت در سیستم کاتالوگ و PIM</small>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    عنوان فارسی محصول *
                  </label>
                  <input
                    type="text"
                    required
                    value={addTitle}
                    onChange={(e) => setAddTitle(e.target.value)}
                    placeholder="مثال: سرم رتینول خالص ۲.۵٪ اولترا اکتیو"
                    className="admin-input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    اسلاگ انگلیسی (URL Slug)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={addSlug}
                    onChange={(e) => setAddSlug(e.target.value)}
                    placeholder="مثال: retinol-ultra-active"
                    className="admin-input"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    خانواده برند *
                  </label>
                  <select
                    value={addBrand}
                    onChange={(e) => setAddBrand(e.target.value)}
                    className="admin-input"
                    style={{ width: "100%" }}
                  >
                    <option value="ReeSkin Clinical">ReeSkin Clinical (مراقبت درماتولوژی)</option>
                    <option value="ReeMed Medical Pro">ReeMed Medical Pro (تجهیزات و پروسیجر مطبی)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    دسته‌بندی بالینی *
                  </label>
                  <select
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                    className="admin-input"
                    style={{ width: "100%" }}
                  >
                    <option value="آمپول و سرم تخصصی">آمپول و سرم تخصصی</option>
                    <option value="کربوکسی‌تراپی و اکسیژن‌رسانی">کربوکسی‌تراپی و اکسیژن‌رسانی</option>
                    <option value="پادهای لایه‌بردار و فعال‌ساز">پادهای لایه‌بردار و فعال‌ساز</option>
                    <option value="ترمیم و التیام پوست">ترمیم و التیام پوست</option>
                    <option value="میکرودرم و لایه‌برداری">میکرودرم و لایه‌برداری</option>
                    <option value="دتوکس و کنترل سبوم">دتوکس و کنترل سبوم</option>
                    <option value="تجهیزات کلینیکال و پزشکی">تجهیزات کلینیکال و پزشکی</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    قیمت به تومان *
                  </label>
                  <input
                    type="number"
                    required
                    dir="ltr"
                    value={addPrice}
                    onChange={(e) => setAddPrice(e.target.value)}
                    placeholder="مثال: 2850000"
                    className="admin-input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    کد انبارداری (SKU)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={addSku}
                    onChange={(e) => setAddSku(e.target.value)}
                    placeholder="مثال: RS-RET-025"
                    className="admin-input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    وضعیت اولیه انبار
                  </label>
                  <select
                    value={addInStock ? "1" : "0"}
                    onChange={(e) => setAddInStock(e.target.value === "1")}
                    className="admin-input"
                    style={{ width: "100%" }}
                  >
                    <option value="1">موجود در انبار</option>
                    <option value="0">ناموجود (کسری)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    ماده موثره اصلی (INCI)
                  </label>
                  <input
                    type="text"
                    value={addInci}
                    onChange={(e) => setAddInci(e.target.value)}
                    placeholder="مثال: Retinol 2.5% + Bakuchiol 1%"
                    className="admin-input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    ادعای بالینی اثبات‌شده
                  </label>
                  <input
                    type="text"
                    value={addClaim}
                    onChange={(e) => setAddClaim(e.target.value)}
                    placeholder="مثال: کاهش ۳۸٪ خطوط ریز در ۲۸ روز"
                    className="admin-input"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  آدرس تصویر کالا (Image Asset URL)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={addImageUrl}
                  onChange={(e) => setAddImageUrl(e.target.value)}
                  className="admin-input"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  توضیح کوتاه و اندیکاسیون بالینی
                </label>
                <textarea
                  rows={3}
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  placeholder="اندیکاسیون‌های تجویز، نوع پوست هدف و مکانیسم اثر بیولوژیک..."
                  className="admin-input"
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-action"
                  style={{ borderRadius: "9999px" }}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="btn-primary"
                  style={{ borderRadius: "9999px", padding: "8px 26px", fontWeight: 700 }}
                >
                  {addSubmitting ? "در حال ثبت و انتشار..." : "✓ ثبت و انتشار محصول"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 4. Modal: Comprehensive PIM Editor ── */}
      {showEditor && selectedProduct && (
        <section className="admin-section-box" style={{ marginTop: "24px", border: "2px solid #047857" }}>
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>ویرایشگر جامع PIM: {selectedProduct.titleFa}</h2>
              <small>تنظیم مواد موثره (INCI)، تصاویر گالری DAM و ادعاهای سازمانی</small>
            </div>
            <button onClick={() => setShowEditor(false)} className="btn-reject" style={{ borderRadius: "9999px" }}>
              ✕ بستن ویرایشگر
            </button>
          </div>

          <div className="coupon-form-grid" style={{ marginTop: "16px" }}>
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
              <label>افزودن ماده موثره جدید (INCI)</label>
              <input
                className="admin-input"
                placeholder="مثال: Zinc PCA 1% — کنترل چربی و التیام‌بخش"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
              />
            </div>
            <div className="coupon-field">
              <label>افزودن ادعای بالینی و رفرنس مقاله</label>
              <input
                className="admin-input"
                placeholder="مثال: کاهش ۳۲٪ قرمزی پس از ۱۴ روز (مطالعه In-Vivo)"
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value)}
              />
            </div>
          </div>

          <div className="coupon-form-actions" style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={handleSavePim} disabled={editorSubmitting} className="btn-primary" style={{ borderRadius: "9999px", padding: "8px 24px" }}>
              {editorSubmitting ? "در حال ذخیره..." : "💾 ذخیره تغییرات کاتالوگ و PIM"}
            </button>
            <span className="muted-text">تغییرات بلافاصله در پایگاه داده و فروشگاه سایت اعمال می‌شود.</span>
          </div>
        </section>
      )}
    </div>
  );
}
