"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  authedFetch,
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
  FlaskConical,
  Trash2,
} from "lucide-react";

export interface PimIngredientRow {
  id?: string;
  name: string;
  inciName?: string | null;
  concentrationPercent?: string | null;
  purpose?: string | null;
  isKeyIngredient?: boolean;
}

export interface PimClaimRow {
  id?: string;
  claimText: string;
  studyReference?: string | null;
  status?: "APPROVED" | "DRAFT" | "REVIEW_REQUIRED";
}

export interface PimProduct {
  id: string;
  slug: string;
  titleFa: string;
  description?: string | null;
  category: string;
  categorySlug?: string | null;
  brand: string;
  brandSlug?: string | null;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  priceTomans: number;
  variantsCount: number;
  ingredientsCount: number;
  claimsCount: number;
  ingredients: PimIngredientRow[];
  claims: PimClaimRow[];
  images: string[];
  inStock: boolean;
  inventoryQty: number;
}

interface CatalogRefOption {
  id: string;
  slug: string;
  titleFa?: string;
  name?: string;
}

function mapApiProductToPim(p: any): PimProduct {
  const variant = p.variants?.[0];
  const priceTomans = variant ? Math.round(Number(variant.priceAmount) / 10) : p.priceTomans || 0;
  const totalQty = Array.isArray(p.variants)
    ? p.variants.reduce((sum: number, v: any) => sum + Number(v.inventoryQty ?? 0), 0)
    : 0;
  const anyInStock = Array.isArray(p.variants)
    ? p.variants.some((v: any) => v.inStock === true)
    : false;

  return {
    id: p.id,
    slug: p.slug,
    titleFa: p.titleFa || p.title,
    description: p.description ?? null,
    category: p.category?.titleFa || p.category || "مراقبت پوست و درماتولوژی",
    categorySlug: p.category?.slug ?? null,
    brand: p.brand?.name || "ReeSkin Clinical",
    brandSlug: p.brand?.slug ?? null,
    status: (p.status as PimProduct["status"]) || "PUBLISHED",
    priceTomans,
    variantsCount: p.variants?.length || 1,
    ingredientsCount: p.ingredients?.length || 0,
    claimsCount: p.claims?.length || 0,
    ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
    claims: Array.isArray(p.claims) ? p.claims : [],
    images:
      Array.isArray(p.media) && p.media.length > 0
        ? p.media.map((m: any) => m.url)
        : [],
    inStock: anyInStock,
    inventoryQty: totalQty,
  };
}

export default function CatalogPimManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const canEditPim = userRole === "SUPER_ADMIN" || userRole === "OPERATOR";
  const [products, setProducts] = useState<PimProduct[]>([]);
  const [categories, setCategories] = useState<CatalogRefOption[]>([]);
  const [brands, setBrands] = useState<CatalogRefOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<"ALL" | "ReeSkin" | "ReeMed" | "OTHER">("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Price Modal State
  const [pricingProduct, setPricingProduct] = useState<PimProduct | null>(null);
  const [pricingAmount, setPricingAmount] = useState("");
  const [pricingInStock, setPricingInStock] = useState(true);
  const [pricingQty, setPricingQty] = useState("25");
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
  const [addStockQty, setAddStockQty] = useState("50");
  const [addInci, setAddInci] = useState("");
  const [addClaim, setAddClaim] = useState("");
  const [addImageUrl, setAddImageUrl] = useState("/assets/drdermer/2025/07/carboxygel.png");
  const [addDescription, setAddDescription] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Comprehensive PIM Editor Modal State
  const [selectedProduct, setSelectedProduct] = useState<PimProduct | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorLoading, setEditorLoading] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [editingInStock, setEditingInStock] = useState(true);
  const [editingStockQty, setEditingStockQty] = useState("25");
  const [editingStatus, setEditingStatus] = useState<PimProduct["status"]>("PUBLISHED");
  const [editingImageUrl, setEditingImageUrl] = useState("");
  const [editingIngredients, setEditingIngredients] = useState<PimIngredientRow[]>([]);
  const [editingClaims, setEditingClaims] = useState<PimClaimRow[]>([]);
  const [claimInput, setClaimInput] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [editorSubmitting, setEditorSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        authedFetch("/v1/stores/admin/products?limit=100", { cache: "no-store" }),
        authedFetch("/v1/stores/admin/categories", { cache: "no-store" }),
        authedFetch("/v1/stores/admin/brands", { cache: "no-store" }),
      ]);

      if (!prodRes.ok) {
        const errPayload = await prodRes.json().catch(() => null);
        throw new Error(errPayload?.message || `HTTP ${prodRes.status}`);
      }

      const payload = await prodRes.json();
      if (Array.isArray(payload?.data)) {
        setProducts(payload.data.map(mapApiProductToPim));
      }

      if (catRes.ok) {
        const catPayload = await catRes.json().catch(() => null);
        if (Array.isArray(catPayload?.data)) {
          setCategories(catPayload.data);
        }
      }
      if (brandRes.ok) {
        const brandPayload = await brandRes.json().catch(() => null);
        if (Array.isArray(brandPayload?.data)) {
          setBrands(brandPayload.data);
        }
      }
    } catch (err: any) {
      setLoadError(err?.message || "خطا در دریافت کاتالوگ از سرور");
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
    setPricingInStock(p.inStock);
    setPricingQty((p.inventoryQty > 0 ? p.inventoryQty : 25).toString());
  };

  // Submit Quick Price Change
  const handleSavePrice = async () => {
    if (!pricingProduct) return;
    const numPrice = Number(pricingAmount);
    if (!Number.isFinite(numPrice) || numPrice <= 0) {
      alert("لطفاً قیمت معتبر به تومان وارد کنید.");
      return;
    }
    const numQty = pricingInStock ? Math.max(1, Number(pricingQty) || 25) : 0;

    setPriceSubmitting(true);
    try {
      const res = await patchTenantJson(
        `/v1/stores/admin/products/${encodeURIComponent(pricingProduct.id)}/price`,
        {
          priceTomans: numPrice,
          inStock: pricingInStock,
          stockQty: numQty,
        },
      );

      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === pricingProduct.id
              ? {
                  ...item,
                  priceTomans: numPrice,
                  inStock: pricingInStock,
                  inventoryQty: numQty,
                }
              : item,
          ),
        );
        showToast(
          `قیمت کالا «${pricingProduct.titleFa}» به ${new Intl.NumberFormat("fa-IR").format(numPrice)} تومان در دیتابیس به‌روز شد.`,
        );
        setPricingProduct(null);
        void loadProducts();
      } else {
        alert(res.message || "خطا در به‌روزرسانی قیمت در سرور");
      }
    } catch {
      alert("خطای ارتباط با سرور");
    } finally {
      setPriceSubmitting(false);
    }
  };

  // Open PIM Comprehensive Editor (loads full DB record)
  const handleEdit = async (p: PimProduct) => {
    setSelectedProduct(p);
    setEditingTitle(p.titleFa);
    setEditingDescription(p.description || "");
    setEditingPrice(p.priceTomans.toString());
    setEditingInStock(p.inStock);
    setEditingStockQty((p.inventoryQty || 25).toString());
    setEditingStatus(p.status);
    setEditingImageUrl(p.images[0] || "");
    setEditingIngredients(p.ingredients || []);
    setEditingClaims(p.claims || []);
    setClaimInput("");
    setIngredientInput("");
    setShowEditor(true);

    setEditorLoading(true);
    try {
      const res = await authedFetch(`/v1/stores/admin/products/${encodeURIComponent(p.id)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          const full = mapApiProductToPim(json.data);
          setSelectedProduct(full);
          setEditingTitle(full.titleFa);
          setEditingDescription(full.description || "");
          setEditingPrice(full.priceTomans.toString());
          setEditingInStock(full.inStock);
          setEditingStockQty((full.inventoryQty || 25).toString());
          setEditingStatus(full.status);
          setEditingImageUrl(full.images[0] || "");
          setEditingIngredients(full.ingredients);
          setEditingClaims(full.claims);
        }
      }
    } catch {
      // Keep list data if detail refresh times out
    } finally {
      setEditorLoading(false);
    }
  };

  const handleAddIngredientDraft = () => {
    if (!ingredientInput.trim()) return;
    const raw = ingredientInput.trim();
    const [rawLeft, rawPurpose] = raw.split(/\s*[—–:]\s*/, 2);
    const left = (rawLeft || raw).trim();
    const pctMatch = left.match(/(\d+(?:\.\d+)?)\s*%/);
    const cleanName = left.replace(/\d+(?:\.\d+)?\s*%/g, "").replace(/\s+/g, " ").trim() || left;
    setEditingIngredients((prev) => [
      ...prev,
      {
        name: cleanName,
        inciName: left,
        concentrationPercent: pctMatch ? Number(pctMatch[1]).toFixed(2) : null,
        purpose: rawPurpose?.trim() || "ترکیب فعال بالینی",
        isKeyIngredient: true,
      },
    ]);
    setIngredientInput("");
  };

  const handleAddClaimDraft = () => {
    if (!claimInput.trim()) return;
    setEditingClaims((prev) => [
      ...prev,
      {
        claimText: claimInput.trim(),
        status: "APPROVED",
      },
    ]);
    setClaimInput("");
  };

  // Save Comprehensive PIM Changes atomically to backend DB
  const handleSavePim = async () => {
    if (!selectedProduct) return;
    const numPrice = Number(editingPrice);
    if (!Number.isFinite(numPrice) || numPrice <= 0) {
      alert("لطفاً قیمت معتبر به تومان وارد نمایید.");
      return;
    }

    // Include unsaved draft inputs automatically on save
    let finalIngredients = [...editingIngredients];
    if (ingredientInput.trim()) {
      const raw = ingredientInput.trim();
      const [rawLeft, rawPurpose] = raw.split(/\s*[—–:]\s*/, 2);
      const left = (rawLeft || raw).trim();
      const pctMatch = left.match(/(\d+(?:\.\d+)?)\s*%/);
      const cleanName = left.replace(/\d+(?:\.\d+)?\s*%/g, "").replace(/\s+/g, " ").trim() || left;
      finalIngredients.push({
        name: cleanName,
        inciName: left,
        concentrationPercent: pctMatch ? Number(pctMatch[1]).toFixed(2) : null,
        purpose: rawPurpose?.trim() || "ترکیب فعال بالینی",
        isKeyIngredient: true,
      });
    }

    let finalClaims = [...editingClaims];
    if (claimInput.trim()) {
      finalClaims.push({
        claimText: claimInput.trim(),
        status: "APPROVED",
      });
    }

    setEditorSubmitting(true);
    try {
      const payload = {
        titleFa: editingTitle.trim() || selectedProduct.titleFa,
        description: editingDescription.trim() || null,
        priceTomans: numPrice,
        inStock: editingInStock,
        stockQty: editingInStock ? Math.max(1, Number(editingStockQty) || 25) : 0,
        status: editingStatus,
        ...(editingImageUrl.trim() ? { imageUrl: editingImageUrl.trim() } : {}),
        ingredients: finalIngredients.map((ing, idx) => ({
          name: ing.name,
          inciName: ing.inciName ?? ing.name,
          concentrationPercent: ing.concentrationPercent ?? undefined,
          purpose: ing.purpose ?? undefined,
          isKeyIngredient: ing.isKeyIngredient ?? true,
          sortOrder: idx + 1,
        })),
        claims: finalClaims.map((cl) => ({
          claimText: cl.claimText,
          studyReference: cl.studyReference ?? undefined,
          status: cl.status ?? "APPROVED",
        })),
      };

      const res = await patchTenantJson(
        `/v1/stores/admin/products/${encodeURIComponent(selectedProduct.id)}`,
        payload,
      );

      if (!res.ok) {
        alert(res.message || "خطا در ذخیره تغییرات PIM در سرور");
        return;
      }

      const updatedData = (res.data as any)?.data;
      if (updatedData) {
        const mapped = mapApiProductToPim(updatedData);
        setProducts((prev) => prev.map((item) => (item.id === mapped.id ? mapped : item)));
      } else {
        void loadProducts();
      }

      showToast(`تغییرات کاتالوگ، ترکیبات INCI و ادعاهای «${editingTitle.trim() || selectedProduct.titleFa}» در دیتابیس ذخیره شد.`);
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
    const numPrice = Number(addPrice);
    if (!addTitle.trim() || !Number.isFinite(numPrice) || numPrice <= 0) {
      alert("لطفاً عنوان فارسی و قیمت معتبر محصول را وارد نمایید.");
      return;
    }

    setAddSubmitting(true);
    try {
      const generatedSlug =
        addSlug.trim() ||
        addTitle
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-") ||
        `prod-${Date.now().toString(36)}`;

      const matchedCat = categories.find(
        (c) => c.titleFa === addCategory || c.slug === addCategory,
      );
      const matchedBrand = brands.find(
        (b) => b.name === addBrand || b.slug === addBrand,
      );

      const payload = {
        titleFa: addTitle.trim(),
        slug: generatedSlug,
        ...(matchedBrand ? { brandId: matchedBrand.id } : {}),
        brandName: addBrand,
        ...(matchedCat ? { categoryId: matchedCat.id, categorySlug: matchedCat.slug } : {}),
        category: addCategory,
        priceTomans: numPrice,
        sku: addSku.trim() || `SKU-${generatedSlug.toUpperCase().slice(0, 12)}`,
        inStock: addInStock,
        stockQty: addInStock ? Math.max(1, Number(addStockQty) || 50) : 0,
        description: addDescription.trim() || null,
        imageUrl: addImageUrl.trim() || null,
        inci: addInci.trim() || null,
        claim: addClaim.trim() || null,
      };

      const res = await postTenantJson("/v1/stores/admin/products", payload);
      if (res.ok) {
        showToast(`محصول جدید «${addTitle}» با ترکیبات INCI و موجودی انبار در دیتابیس ثبت و منتشر شد.`);
        setShowAddModal(false);
        setAddTitle("");
        setAddSlug("");
        setAddPrice("");
        setAddSku("");
        setAddStockQty("50");
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
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      p.titleFa.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q);

    const matchBrand =
      brandFilter === "ALL" ||
      (brandFilter === "ReeSkin" && p.brand.includes("ReeSkin")) ||
      (brandFilter === "ReeMed" && p.brand.includes("ReeMed")) ||
      (brandFilter === "OTHER" && !p.brand.includes("ReeSkin") && !p.brand.includes("ReeMed"));

    return matchSearch && matchBrand;
  });

  const brandOptions =
    brands.length > 0
      ? brands.map((b) => b.name || b.slug)
      : ["ReeSkin Clinical", "ReeMed Medical Pro"];
  const categoryOptions =
    categories.length > 0
      ? categories.map((c) => c.titleFa || c.slug)
      : [
          "آمپول و سرم تخصصی",
          "کربوکسی‌تراپی و اکسیژن‌رسانی",
          "پادهای لایه‌بردار و فعال‌ساز",
          "ترمیم و التیام پوست",
          "میکرودرم و لایه‌برداری",
          "دتوکس و کنترل سبوم",
          "تجهیزات کلینیکال و پزشکی",
        ];

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
            <small>مدیریت جامع ویژگی‌های تخصصی، قیمت‌گذاری لحظه‌ای، فرمولاسیون و ادعاهای اثبات‌شده متصل به دیتابیس</small>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => void loadProducts()}
              className="btn-action"
              style={{ display: "flex", alignItems: "center", gap: "6px", borderRadius: "9999px" }}
              title="بارگذاری مجدد کاتالوگ از سرور"
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
                placeholder="جستجو در کاتالوگ (نام فارسی، دسته‌بندی، برند یا اسلاگ)..."
                className="admin-search-input"
                style={{ paddingRight: "40px", width: "100%", borderRadius: "9999px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-chips-group" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
              ReeSkin ({faNumber(products.filter((p) => p.brand.includes("ReeSkin")).length)})
            </button>
            <button
              className={`filter-chip ${brandFilter === "ReeMed" ? "active" : ""}`}
              onClick={() => setBrandFilter("ReeMed")}
            >
              ReeMed ({faNumber(products.filter((p) => p.brand.includes("ReeMed")).length)})
            </button>
            <button
              className={`filter-chip ${brandFilter === "OTHER" ? "active" : ""}`}
              onClick={() => setBrandFilter("OTHER")}
            >
              سایر برندهای کلینیکال ({faNumber(products.filter((p) => !p.brand.includes("ReeSkin") && !p.brand.includes("ReeMed")).length)})
            </button>
          </div>
        </div>

        {loadError && (
          <div style={{ marginTop: "14px", padding: "12px 16px", borderRadius: "12px", background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "0.88rem" }}>
            خطا در دریافت کاتالوگ از API: {loadError}
          </div>
        )}

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
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                    در حال بارگذاری کاتالوگ از پایگاه داده...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
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
                        {p.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.images[0]}
                            alt={p.titleFa}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                          background: p.inStock ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                          color: p.inStock ? "#047857" : "#b91c1c",
                        }}
                      >
                        {p.inStock ? `✓ موجود (${faNumber(p.inventoryQty)})` : "✕ ناموجود"}
                      </span>
                    </td>
                    <td className="tabular-nums">{faNumber(p.ingredientsCount)} ماده فعال</td>
                    <td className="tabular-nums">{faNumber(p.claimsCount)} ادعا</td>
                    <td>
                      <span className={`status-pill ${p.status === "PUBLISHED" ? "approved pulse" : "pending_review"}`}>
                        {p.status === "PUBLISHED" ? "منتشر شده" : p.status === "ARCHIVED" ? "بایگانی شده" : "پیش‌نویس"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
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

                        <button
                          onClick={() => void handleEdit(p)}
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

            <div style={{ marginBottom: "16px" }}>
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

            {pricingInStock && (
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  تعداد موجودی انبار مرکزی
                </label>
                <input
                  type="number"
                  dir="ltr"
                  min={1}
                  className="admin-input"
                  style={{ width: "100%" }}
                  value={pricingQty}
                  onChange={(e) => setPricingQty(e.target.value)}
                />
              </div>
            )}

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
                onClick={() => void handleSavePrice()}
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
              maxWidth: "700px",
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
                <small style={{ color: "var(--muted)" }}>ثبت تراکنشی محصول، واریانت، موجودی انبار، ترکیبات INCI و ادعاهای بالینی در PostgreSQL</small>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => void handleCreateProduct(e)}>
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
                    {brandOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
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
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "14px" }}>
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
                    placeholder="2850000"
                    className="admin-input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    کد SKU
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={addSku}
                    onChange={(e) => setAddSku(e.target.value)}
                    placeholder="RS-RET-025"
                    className="admin-input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    وضعیت انبار
                  </label>
                  <select
                    value={addInStock ? "1" : "0"}
                    onChange={(e) => setAddInStock(e.target.value === "1")}
                    className="admin-input"
                    style={{ width: "100%" }}
                  >
                    <option value="1">موجود</option>
                    <option value="0">ناموجود</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    موجودی اولیه
                  </label>
                  <input
                    type="number"
                    dir="ltr"
                    min={0}
                    disabled={!addInStock}
                    value={addInStock ? addStockQty : "0"}
                    onChange={(e) => setAddStockQty(e.target.value)}
                    className="admin-input"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    مواد موثره اصلی INCI (جداشده با + یا خط جدید)
                  </label>
                  <textarea
                    rows={3}
                    value={addInci}
                    onChange={(e) => setAddInci(e.target.value)}
                    placeholder={"Retinol 2.5% — نوسازی سلولی\nBakuchiol 1% — ضدالتهاب گیاهی"}
                    className="admin-input"
                    style={{ width: "100%", resize: "vertical" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    ادعاهای بالینی اثبات‌شده (هر خط یک ادعا)
                  </label>
                  <textarea
                    rows={3}
                    value={addClaim}
                    onChange={(e) => setAddClaim(e.target.value)}
                    placeholder={"کاهش ۳۸٪ خطوط ریز در ۲۸ روز (In-Vivo)\nافزایش سنتز کلاژن نوع ۱"}
                    className="admin-input"
                    style={{ width: "100%", resize: "vertical" }}
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

      {/* ── 4. Panel: Comprehensive PIM Editor ── */}
      {showEditor && selectedProduct && (
        <section className="admin-section-box" style={{ marginTop: "24px", border: "2px solid #047857" }}>
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>ویرایشگر جامع PIM: {selectedProduct.titleFa}</h2>
              <small>
                تنظیم مواد موثره (INCI)، تصویر کالا و ادعاهای سازمانی {editorLoading ? "(در حال بارگذاری جزئیات کامل...)" : ""}
              </small>
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
              <label>وضعیت انتشار</label>
              <select
                className="admin-input"
                value={editingStatus}
                onChange={(e) => setEditingStatus(e.target.value as PimProduct["status"])}
              >
                <option value="PUBLISHED">منتشر شده (PUBLISHED)</option>
                <option value="DRAFT">پیش‌نویس (DRAFT)</option>
                <option value="ARCHIVED">بایگانی (ARCHIVED)</option>
              </select>
            </div>
            <div className="coupon-field">
              <label>موجودی انبار ({editingInStock ? "موجود" : "ناموجود"})</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  className="admin-input"
                  value={editingInStock ? "1" : "0"}
                  onChange={(e) => setEditingInStock(e.target.value === "1")}
                >
                  <option value="1">موجود</option>
                  <option value="0">ناموجود</option>
                </select>
                <input
                  className="admin-input"
                  dir="ltr"
                  type="number"
                  min={0}
                  disabled={!editingInStock}
                  value={editingInStock ? editingStockQty : "0"}
                  onChange={(e) => setEditingStockQty(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="coupon-form-grid" style={{ marginTop: "12px" }}>
            <div className="coupon-field">
              <label>آدرس تصویر اصلی (DAM Image URL)</label>
              <input
                className="admin-input"
                dir="ltr"
                value={editingImageUrl}
                onChange={(e) => setEditingImageUrl(e.target.value)}
              />
            </div>
            <div className="coupon-field">
              <label>شرح بالینی محصول</label>
              <input
                className="admin-input"
                value={editingDescription}
                onChange={(e) => setEditingDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Real INCI Ingredients Registry */}
          <div style={{ marginTop: "18px", padding: "14px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontWeight: 700, color: "#0f172a" }}>
              <FlaskConical size={16} color="#047857" />
              <span>ترکیبات موثره INCI ثبت‌شده در دیتابیس ({faNumber(editingIngredients.length)} مورد)</span>
            </div>
            {editingIngredients.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                {editingIngredients.map((ing, idx) => (
                  <span
                    key={`${ing.name}-${idx}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      background: "#ecfdf5",
                      border: "1px solid #a7f3d0",
                      color: "#065f46",
                      fontSize: "0.8rem",
                    }}
                  >
                    <strong>{ing.inciName || ing.name}</strong>
                    {ing.purpose ? `(${ing.purpose})` : ""}
                    {canEditPim && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingIngredients((prev) => prev.filter((_, i) => i !== idx))
                        }
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: 0 }}
                        aria-label="حذف ترکیب"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                className="admin-input"
                style={{ flex: 1 }}
                placeholder="افزودن ترکیب INCI جدید (مثال: Zinc PCA 1% — کنترل چربی و التیام‌بخش)"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddIngredientDraft}
                className="btn-action"
                style={{ borderRadius: "9999px" }}
              >
                + افزودن به لیست INCI
              </button>
            </div>
          </div>

          {/* Real Clinical Claims Registry */}
          <div style={{ marginTop: "14px", padding: "14px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "10px" }}>
              ادعاهای بالینی تاییدشده ({faNumber(editingClaims.length)} مورد)
            </div>
            {editingClaims.length > 0 && (
              <ul style={{ margin: "0 0 10px 0", paddingInlineStart: "18px", fontSize: "0.85rem", color: "#334155" }}>
                {editingClaims.map((cl, idx) => (
                  <li key={`${cl.claimText}-${idx}`} style={{ marginBottom: "4px" }}>
                    {cl.claimText}{" "}
                    {canEditPim && (
                      <button
                        type="button"
                        onClick={() => setEditingClaims((prev) => prev.filter((_, i) => i !== idx))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", marginRight: "6px" }}
                        aria-label="حذف ادعا"
                      >
                        ✕
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                className="admin-input"
                style={{ flex: 1 }}
                placeholder="افزودن ادعای بالینی جدید (مثال: کاهش ۳۲٪ قرمزی پس از ۱۴ روز (مطالعه In-Vivo))"
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddClaimDraft}
                className="btn-action"
                style={{ borderRadius: "9999px" }}
              >
                + افزودن ادعا
              </button>
            </div>
          </div>

          <div className="coupon-form-actions" style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            {canEditPim && (
              <button
                onClick={() => void handleSavePim()}
                disabled={editorSubmitting}
                className="btn-primary"
                style={{ borderRadius: "9999px", padding: "8px 24px" }}
              >
                {editorSubmitting ? "در حال ذخیره در دیتابیس..." : "💾 ذخیره تراکنشی کاتالوگ و PIM"}
              </button>
            )}
            <span className="muted-text">تمام تغییرات در یک تراکنش دیتابیس ثبت و بلافاصله در فروشگاه نمایش داده می‌شود.</span>
          </div>
        </section>
      )}
    </div>
  );
}
