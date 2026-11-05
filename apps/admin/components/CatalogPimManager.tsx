"use client";

import { useState, useEffect } from "react";
import { faNumber } from "./types";

export interface PimProduct {
  id: string;
  slug: string;
  titleFa: string;
  category: string;
  brand: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  priceTomans: number;
  stockQty: number;
  variantsCount: number;
  ingredientsCount: number;
  claimsCount: number;
  images: string[];
  description?: string;
  coldChain?: boolean;
}

const STORAGE_KEY = "commerce_os_catalog_pim_products_v2";

export const INITIAL_SKINCARE_PRODUCTS: PimProduct[] = [
  {
    id: "prod_drdermer_001",
    slug: "carboxygel",
    titleFa: "ژل حرفه‌ای کربوکسی‌تراپی CarboxyGel™ Professional Therapy",
    category: "کربوکسی‌تراپی و اکسیژن‌رسانی",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 3200000,
    stockQty: 85,
    variantsCount: 3,
    ingredientsCount: 7,
    claimsCount: 4,
    images: ["/assets/drdermer/2025/07/azelaic-acid-carboxygel-600x600.png"],
    description: "ژل ۲ فاز ماتریکسی بی‌کربنات سدیم با القای فیزیولوژیک اثر بوهر جهت اکسیژن‌رسانی عمقی بدون سوزن.",
    coldChain: true,
  },
  {
    id: "prod_drdermer_002",
    slug: "carboxypod",
    titleFa: "کپسول‌های فعال‌ساز ترابافتی CarboxyPod™ Activation Pods",
    category: "پادهای لایه‌بردار و فعال‌ساز",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 1200000,
    stockQty: 140,
    variantsCount: 3,
    ingredientsCount: 6,
    claimsCount: 3,
    images: ["/assets/drdermer/2025/07/carbon-carboxypod-app-1-551x600.png"],
    description: "کپسول‌های فعال‌ساز گاز CO₂ در سه مدل درمانی کربن فعال، هیدرا و ویتامین C.",
    coldChain: false,
  },
  {
    id: "prod_drdermer_003",
    slug: "carboxypad",
    titleFa: "شیت ماسک‌های فعال‌ساز صورت و گردن CarboxyPad™",
    category: "ماسک‌های ترنس‌درمال",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 1400000,
    stockQty: 110,
    variantsCount: 2,
    ingredientsCount: 4,
    claimsCount: 3,
    images: ["/assets/drdermer/2025/07/carboxygel-activator-mask-and-pads-1-600x600.png"],
    description: "شیت‌های فیبری میکروپرمنبران با برش آناتومیک صورت و گردن جهت تبادل گازی پربازده.",
    coldChain: false,
  },
  {
    id: "prod_drdermer_004",
    slug: "crystalene",
    titleFa: "خمیر پولیش و لایه‌بردار ابریشمی Crystalene Polish Paste",
    category: "میکرودرم و لایه‌برداری",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 1750000,
    stockQty: 95,
    variantsCount: 1,
    ingredientsCount: 9,
    claimsCount: 4,
    images: ["/assets/drdermer/2025/08/crystalene-scrub.webp"],
    description: "میکرودرم خانگی با کریستال‌های خالص آلومینای گرید دارویی، نیاسینامید و اسید لاکتیک.",
    coldChain: false,
  },
  {
    id: "prod_drdermer_005",
    slug: "healene",
    titleFa: "ژل تسکین‌بخش و ترمیم سد دفاعی هیلین Healene Soothing Gel",
    category: "ترمیم و التیام پوست",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 1650000,
    stockQty: 70,
    variantsCount: 1,
    ingredientsCount: 8,
    claimsCount: 4,
    images: ["/assets/drdermer/2025/08/healene-gel.webp"],
    description: "ژل سبک آبرسان و التیام‌بخش با پپتیدهای مس، پانتنول B5، اسید هیالورونیک و سنتلا.",
    coldChain: true,
  },
  {
    id: "prod_drdermer_006",
    slug: "silicalene",
    titleFa: "اسکراب دتوکس سیلیکالین Silicalene Mild Silica Scrub",
    category: "دتوکس و کنترل سبوم",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 1550000,
    stockQty: 60,
    variantsCount: 1,
    ingredientsCount: 9,
    claimsCount: 3,
    images: ["/assets/drdermer/2025/08/silicalene-scrub.webp"],
    description: "پاکسازی عمقی منافذ، کنترل چربی مازاد و رفع جوش‌های سرسیاه با میکروسفرهای کروی سیلیکا.",
    coldChain: false,
  },
  {
    id: "prod_drdermer_007",
    slug: "glycolic-carboxygel",
    titleFa: "کربوکسی‌ژل اسید گلیکولیک ۱۰٪ جوانساز و ضدچروک",
    category: "کربوکسی‌تراپی و اکسیژن‌رسانی",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 2680000,
    stockQty: 45,
    variantsCount: 2,
    ingredientsCount: 10,
    claimsCount: 5,
    images: ["/assets/drdermer/2025/07/glycolic-acid-carboxygel-600x600.png"],
    description: "فرمولاسیون ویژه خطوط پنجه‌کلاغی، افت قوام و خطوط عمیق پیشانی با گلیکولیک ۱۰٪ و ماتریکسیل ۳۰۰۰.",
    coldChain: true,
  },
  {
    id: "prod_drdermer_008",
    slug: "multi-active-carboxygel",
    titleFa: "کربوکسی‌ژل مولتی‌اکتیو و ترمیم‌کننده پوست‌های حساس",
    category: "ترمیم و التیام پوست",
    brand: "ReeSkin Clinical",
    status: "PUBLISHED",
    priceTomans: 2550000,
    stockQty: 50,
    variantsCount: 2,
    ingredientsCount: 11,
    claimsCount: 4,
    images: ["/assets/drdermer/2025/07/multi-active-carboxygel-600x600.png"],
    description: "ترمیم سد دفاعی آسیب‌دیده، مهار قرمزی روزاسه و اریتم عروقی با فاکتور رشد بیومیمتیک EGF و سرامید NP.",
    coldChain: true,
  },
];

export default function CatalogPimManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const canEditPim = userRole === "SUPER_ADMIN" || userRole === "OPERATOR";
  const [products, setProducts] = useState<PimProduct[]>(INITIAL_SKINCARE_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<PimProduct | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Edit fields
  const [editingTitle, setEditingTitle] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [editingStock, setEditingStock] = useState("");
  const [editingDesc, setEditingDesc] = useState("");
  const [claimInput, setClaimInput] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Create fields
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newCategory, setNewCategory] = useState("کربوکسی‌تراپی و اکسیژن‌رسانی");
  const [newBrand, setNewBrand] = useState("ReeSkin Clinical");
  const [newPrice, setNewPrice] = useState("1800000");
  const [newStock, setNewStock] = useState("50");
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState("/assets/drdermer/2025/07/site-combo-carboxy-1-600x600.png");
  const [newColdChain, setNewColdChain] = useState(false);

  // Batch import text
  const [importText, setImportText] = useState("");

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as PimProduct[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage helper
  const persistProducts = (updated: PimProduct[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleEdit = (p: PimProduct) => {
    setSelectedProduct(p);
    setEditingTitle(p.titleFa);
    setEditingPrice(p.priceTomans.toString());
    setEditingStock((p.stockQty || 0).toString());
    setEditingDesc(p.description || "");
    setShowEditor(true);
    setSuccessMsg("");
  };

  const handleSavePim = () => {
    if (!selectedProduct) return;
    const updated = products.map((item) =>
      item.id === selectedProduct.id
        ? {
            ...item,
            titleFa: editingTitle.trim() || item.titleFa,
            priceTomans: Number(editingPrice) || item.priceTomans,
            stockQty: Number(editingStock) || item.stockQty,
            description: editingDesc.trim() || item.description,
            claimsCount: claimInput ? item.claimsCount + 1 : item.claimsCount,
            ingredientsCount: ingredientInput ? item.ingredientsCount + 1 : item.ingredientsCount,
          }
        : item
    );
    persistProducts(updated);
    setSuccessMsg(`تغییرات محصول «${selectedProduct.titleFa}» با موفقیت در کاتالوگ ثبت گردید.`);
    setClaimInput("");
    setIngredientInput("");
  };

  const handleToggleStatus = (id: string) => {
    if (!canEditPim) return;
    const updated = products.map((item) => {
      if (item.id === id) {
        const nextStatus: "PUBLISHED" | "DRAFT" = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
        setSuccessMsg(
          `وضعیت انتشار محصول «${item.titleFa}» به ${
            nextStatus === "PUBLISHED" ? "«فعال در سایت»" : "«غیرفعال (پیش‌نویس)»"
          } تغییر یافت.`
        );
        return { ...item, status: nextStatus };
      }
      return item;
    });
    persistProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    if (!canEditPim) return;
    const target = products.find((p) => p.id === id);
    if (!target) return;
    if (confirm(`آیا از حذف محصول «${target.titleFa}» از کاتالوگ اطمینان دارید؟`)) {
      const updated = products.filter((p) => p.id !== id);
      persistProducts(updated);
      if (selectedProduct?.id === id) {
        setShowEditor(false);
      }
      setSuccessMsg(`محصول «${target.titleFa}» با موفقیت حذف گردید.`);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const generatedSlug = newSlug.trim() || newTitle.trim().toLowerCase().replace(/\s+/g, "-");
    const newProd: PimProduct = {
      id: `prod_custom_${Date.now()}`,
      slug: generatedSlug,
      titleFa: newTitle.trim(),
      category: newCategory,
      brand: newBrand,
      status: "PUBLISHED",
      priceTomans: Number(newPrice) || 1000000,
      stockQty: Number(newStock) || 50,
      variantsCount: 1,
      ingredientsCount: 5,
      claimsCount: 3,
      images: [newImage],
      description: newDesc.trim() || "فرمولاسیون تخصصی مراقبت پوست دکتر درمر انگلستان.",
      coldChain: newColdChain,
    };

    const updated = [newProd, ...products];
    persistProducts(updated);
    setShowCreateModal(false);
    setSuccessMsg(`محصول جدید «${newProd.titleFa}» با موفقیت ایجاد و منتشر شد.`);

    // Reset create fields
    setNewTitle("");
    setNewSlug("");
    setNewDesc("");
    setNewPrice("1800000");
    setNewStock("50");
  };

  const handleBatchImport = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const importedItems: PimProduct[] = parsed.map((item, idx) => ({
          id: item.id || `prod_imp_${Date.now()}_${idx}`,
          slug: item.slug || (item.titleFa ? item.titleFa.toLowerCase().replace(/\s+/g, "-") : `product-${Date.now()}`),
          titleFa: item.titleFa || "محصول واردشده",
          category: item.category || "کربوکسی‌تراپی و اکسیژن‌رسانی",
          brand: item.brand || "ReeSkin Clinical",
          status: item.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
          priceTomans: Number(item.priceTomans) || 1500000,
          stockQty: Number(item.stockQty) || 30,
          variantsCount: item.variantsCount || 1,
          ingredientsCount: item.ingredientsCount || 4,
          claimsCount: item.claimsCount || 3,
          images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ["/assets/drdermer/2025/07/azelaic-acid-carboxygel-600x600.png"],
          description: item.description || "فرمولاسیون پوستی واردشده به کاتالوگ.",
          coldChain: item.coldChain ?? false,
        }));

        const combined = [...importedItems, ...products];
        persistProducts(combined);
        setShowImportModal(false);
        setImportText("");
        setSuccessMsg(`${faNumber(importedItems.length)} محصول با موفقیت از فایل وارد کاتالوگ شد.`);
      } else {
        alert("فرمت جی‌سان ورودی معتبر نیست؛ لطفاً آرایه‌ای از محصولات را وارد نمایید.");
      }
    } catch {
      alert("خطا در پردازش JSON. لطفاً ساختار داده‌ها را بررسی فرمایید.");
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `drdermer_catalog_pim_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSuccessMsg("خروجی JSON کاتالوگ با موفقیت دانلود شد.");
  };

  const handleResetCatalog = () => {
    if (!canEditPim) return;
    if (confirm("آیا مایل به بازنشانی کاتالوگ به محصولات پیش‌فرض رسمی هستید؟")) {
      persistProducts(INITIAL_SKINCARE_PRODUCTS);
      setSuccessMsg("کاتالوگ به فهرست رسمی اولیه بازنشانی شد.");
    }
  };

  // Unique categories list
  const categoriesList = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !searchQuery.trim() ||
      p.titleFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && p.status === "PUBLISHED") ||
      (statusFilter === "DRAFT" && p.status === "DRAFT");

    const matchCategory = categoryFilter === "ALL" || p.category === categoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

  const publishedCount = products.filter((p) => p.status === "PUBLISHED").length;
  const draftCount = products.filter((p) => p.status === "DRAFT").length;
  const totalCatalogValue = products.reduce((acc, curr) => acc + curr.priceTomans * (curr.stockQty || 1), 0);

  return (
    <div className="tab-pane">
      <section className="admin-section-box">
        {/* Header Strip */}
        <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <div>
            <h2>مدیریت جامع کاتالوگ و PIM محصولات پوستی (Dr Dermer PIM/ERP)</h2>
            <small>افزودن آسان، ورود و خروج دسته‌ای، ویرایش فوری، کنترل قیمت و سوییچ وضعیت انتشار</small>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {canEditPim && (
              <>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="btn-action"
                  style={{ background: "var(--brand, #1E3A2F)", color: "#FFFFFF", fontWeight: 800, padding: "8px 18px", borderRadius: "8px" }}
                >
                  + افزودن محصول جدید
                </button>
                <button
                  type="button"
                  onClick={() => setShowImportModal(true)}
                  className="btn-action"
                  style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)", fontWeight: 700 }}
                >
                  📥 ورود دسته‌ای (Import)
                </button>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="btn-action"
                  style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)", fontWeight: 700 }}
                >
                  📤 خروجی JSON
                </button>
              </>
            )}
            <span className="badge-live">PIM / ERP ACTIVE</span>
          </div>
        </div>

        {/* Operational Metrics Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", margin: "16px 0 20px" }}>
          <div style={{ background: "var(--surface-soft, #f8fafc)", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border, #e2e8f0)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block" }}>تعداد کل اقلام در کاتالوگ</span>
            <strong style={{ fontSize: "1.4rem", color: "var(--ink)", fontWeight: 900 }}>{faNumber(products.length)} کالا</strong>
          </div>
          <div style={{ background: "var(--surface-soft, #f8fafc)", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border, #e2e8f0)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block" }}>فعال و در دسترس مشتریان</span>
            <strong style={{ fontSize: "1.4rem", color: "#059669", fontWeight: 900 }}>{faNumber(publishedCount)} کالا</strong>
          </div>
          <div style={{ background: "var(--surface-soft, #f8fafc)", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border, #e2e8f0)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block" }}>غیرفعال (پیش‌نویس / مخفی)</span>
            <strong style={{ fontSize: "1.4rem", color: "#DC2626", fontWeight: 900 }}>{faNumber(draftCount)} کالا</strong>
          </div>
          <div style={{ background: "var(--surface-soft, #f8fafc)", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border, #e2e8f0)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block" }}>ارزش موجودی کل انبار</span>
            <strong style={{ fontSize: "1.2rem", color: "var(--brand, #1E3A2F)", fontWeight: 900 }} className="tabular-nums">
              {new Intl.NumberFormat("fa-IR").format(totalCatalogValue)} تومان
            </strong>
          </div>
        </div>

        {successMsg && (
          <div className="alert-box success-alert" style={{ marginBottom: "16px" }}>
            <span>✓ {successMsg}</span>
          </div>
        )}

        {/* Toolbar with Search, Category Filter, and Status Filter */}
        <div className="admin-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <div className="admin-search-wrapper" style={{ flex: 1, minWidth: "260px" }}>
            <input
              type="text"
              placeholder="🔍 جستجو بر اساس عنوان محصول، دسته یا شناسه..."
              className="admin-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <select
              className="admin-input"
              style={{ width: "auto", minWidth: "180px", padding: "6px 12px" }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">همه دسته‌بندی‌ها ({faNumber(products.length)})</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({faNumber(products.filter((p) => p.category === cat).length)})
                </option>
              ))}
            </select>

            <div className="filter-chips-group">
              <button
                className={`filter-chip ${statusFilter === "ALL" ? "active" : ""}`}
                onClick={() => setStatusFilter("ALL")}
              >
                همه ({faNumber(products.length)})
              </button>
              <button
                className={`filter-chip ${statusFilter === "PUBLISHED" ? "active" : ""}`}
                onClick={() => setStatusFilter("PUBLISHED")}
              >
                فعال ({faNumber(publishedCount)})
              </button>
              <button
                className={`filter-chip ${statusFilter === "DRAFT" ? "active" : ""}`}
                onClick={() => setStatusFilter("DRAFT")}
              >
                غیرفعال ({faNumber(draftCount)})
              </button>
            </div>

            {canEditPim && (
              <button
                type="button"
                onClick={handleResetCatalog}
                className="btn-action"
                style={{ color: "var(--muted)", fontSize: "0.8rem" }}
                title="بازنشانی به داده‌های پیش‌فرض کارخانه"
              >
                بازنشانی
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="table-responsive-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>تصویر</th>
                <th>عنوان محصول</th>
                <th>دسته‌بندی</th>
                <th>لاین برند</th>
                <th>قیمت پایه (تومان)</th>
                <th>موجودی</th>
                <th>مواد فعال</th>
                <th style={{ width: "140px" }}>سوییچ وضعیت</th>
                <th style={{ width: "160px" }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "32px" }} className="muted-text">
                    هیچ محصولی با معیارهای جستجو یا فیلتر مشخص‌شده یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} style={{ opacity: p.status === "PUBLISHED" ? 1 : 0.65 }}>
                    <td>
                      <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "#f8fafc", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0" }}>
                        <img src={p.images[0]} alt={p.titleFa} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      </div>
                    </td>
                    <td className="bold">
                      <div style={{ fontSize: "0.92rem" }}>{p.titleFa}</div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px" }}>
                        <span className="muted-text" style={{ direction: "ltr", fontSize: "0.78rem" }}>/{p.slug}</span>
                        {p.coldChain && (
                          <span style={{ fontSize: "0.7rem", background: "rgba(3, 105, 161, 0.12)", color: "#0369A1", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>
                            ❄️ زنجیره سرد
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="category-pill" style={{ fontSize: "0.8rem" }}>{p.category}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "var(--brand, #1E3A2F)" }}>{p.brand}</span>
                    </td>
                    <td className="bold tabular-nums" style={{ fontSize: "0.95rem" }}>
                      {new Intl.NumberFormat("fa-IR").format(p.priceTomans)}
                    </td>
                    <td className="tabular-nums">
                      <span style={{ fontWeight: 800, color: p.stockQty > 20 ? "#059669" : p.stockQty > 0 ? "#D97706" : "#DC2626" }}>
                        {faNumber(p.stockQty)} عدد
                      </span>
                    </td>
                    <td className="tabular-nums">
                      <span style={{ fontSize: "0.82rem" }}>{faNumber(p.ingredientsCount)} ترکیب دارویی</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        disabled={!canEditPim}
                        onClick={() => handleToggleStatus(p.id)}
                        className={`status-pill ${p.status === "PUBLISHED" ? "approved pulse" : "pending_review"}`}
                        style={{
                          cursor: canEditPim ? "pointer" : "default",
                          border: "none",
                          width: "100%",
                          textAlign: "center",
                          padding: "6px 10px",
                          fontWeight: 800,
                        }}
                        title="کلیک برای فعال یا غیرفعال کردن نمایش این کالا در فروشگاه"
                      >
                        {p.status === "PUBLISHED" ? "✓ فعال در سایت" : "✕ غیرفعال"}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => handleEdit(p)}
                          className="btn-action"
                          style={{ fontWeight: 700 }}
                          title="ویرایش قیمت، موجودی و مشخصات کالا"
                        >
                          ویرایش
                        </button>
                        {canEditPim && (
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="btn-action"
                            style={{ color: "#DC2626", borderColor: "rgba(220, 38, 38, 0.3)" }}
                            title="حذف از کاتالوگ"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Modal 1: Create New Skincare Product ── */}
      {showCreateModal && (
        <div className="admin-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="admin-modal-card" style={{ background: "#FFFFFF", borderRadius: "16px", maxWidth: "640px", width: "100%", padding: "28px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900 }}>ثبت و ایجاد محصول پوستی جدید در کاتالوگ</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>عنوان کامل محصول:</label>
                  <input
                    required
                    className="admin-input"
                    placeholder="مثال: سرم هیالورونیک اسید چندوزنی و ویتامین B5"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>شناسه انگلیسی (slug):</label>
                    <input
                      className="admin-input"
                      dir="ltr"
                      placeholder="hyaluronic-b5-serum"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>قیمت پایه (تومان):</label>
                    <input
                      required
                      type="number"
                      className="admin-input"
                      dir="ltr"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>دسته‌بندی درمانی:</label>
                    <select
                      className="admin-input"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option value="کربوکسی‌تراپی و اکسیژن‌رسانی">کربوکسی‌تراپی و اکسیژن‌رسانی</option>
                      <option value="ترمیم و التیام پوست">ترمیم و التیام پوست</option>
                      <option value="میکرودرم و لایه‌برداری">میکرودرم و لایه‌برداری</option>
                      <option value="دتوکس و کنترل سبوم">دتوکس و کنترل سبوم</option>
                      <option value="ماسک‌های ترنس‌درمال">ماسک‌های ترنس‌درمال</option>
                      <option value="پپتیدها و جوانسازی">پپتیدها و جوانسازی</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>تعداد موجودی اولیه انبار:</label>
                    <input
                      required
                      type="number"
                      className="admin-input"
                      dir="ltr"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>لاین برند:</label>
                    <select
                      className="admin-input"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                    >
                      <option value="ReeSkin Clinical">ReeSkin Clinical</option>
                      <option value="ReeMed Clinical Solutions">ReeMed Clinical Solutions</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "26px" }}>
                    <input
                      type="checkbox"
                      id="coldchain-chk"
                      checked={newColdChain}
                      onChange={(e) => setNewColdChain(e.target.checked)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <label htmlFor="coldchain-chk" style={{ fontSize: "0.85rem", fontWeight: 800, cursor: "pointer" }}>
                      نیازمند حمل در زنجیره سرمایی (Cold-Chain)
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>مسیر فایل تصویر شاخص:</label>
                  <input
                    className="admin-input"
                    dir="ltr"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>توضیحات کوتاه بالینی:</label>
                  <textarea
                    rows={3}
                    className="admin-input"
                    placeholder="شرح کوتاه مکانیسم اثر و مزایای فرمولاسیون..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn-reject">انصراف</button>
                  <button type="submit" className="btn-approve" style={{ padding: "10px 24px" }}>ذخیره و انتشار در ویترین</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal 2: Batch Import JSON ── */}
      {showImportModal && (
        <div className="admin-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="admin-modal-card" style={{ background: "#FFFFFF", borderRadius: "16px", maxWidth: "600px", width: "100%", padding: "28px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900 }}>ورود دسته‌ای محصولات (Batch JSON Import)</h3>
              <button type="button" onClick={() => setShowImportModal(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--muted)", margin: "0 0 14px", lineHeight: 1.6 }}>
              آرایه‌ای از محصولات را در قالب استاندارد JSON در کادر زیر جای‌گذاری نمایید تا مستقیماً به PIM افزوده شوند:
            </p>
            <form onSubmit={handleBatchImport}>
              <textarea
                required
                rows={8}
                className="admin-input"
                dir="ltr"
                style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
                placeholder='[
  {
    "slug": "vitamin-c-serum",
    "titleFa": "سرم ویتامین C پایدار ۲۰٪",
    "category": "ترمیم و التیام پوست",
    "brand": "ReeSkin Clinical",
    "priceTomans": 1950000,
    "stockQty": 60,
    "status": "PUBLISHED"
  }
]'
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowImportModal(false)} className="btn-reject">انصراف</button>
                <button type="submit" className="btn-approve" style={{ padding: "10px 24px" }}>تأیید و واردسازی به کاتالوگ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Drawer / Box ── */}
      {showEditor && selectedProduct && (
        <section className="admin-section-box" style={{ marginTop: "24px", border: "2px solid var(--brand, #1E3A2F)" }}>
          <div className="box-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>ویرایشگر محصول: {selectedProduct.titleFa}</h2>
              <small>تنظیم عنوان، قیمت، موجودی انبار، مواد موثره و ادعاهای بالینی</small>
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
              <label>تعداد موجودی انبار</label>
              <input
                className="admin-input"
                dir="ltr"
                type="number"
                value={editingStock}
                onChange={(e) => setEditingStock(e.target.value)}
              />
            </div>
            <div className="coupon-field">
              <label>توضیحات علمی محصول</label>
              <input
                className="admin-input"
                value={editingDesc}
                onChange={(e) => setEditingDesc(e.target.value)}
              />
            </div>
            <div className="coupon-field">
              <label>افزودن ماده موثره جدید (INCI)</label>
              <input
                className="admin-input"
                placeholder="مثال: Niacinamide 4% — مهار ملانوزوم"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
              />
            </div>
            <div className="coupon-field">
              <label>افزودن ادعای بالینی اثبات‌شده</label>
              <input
                className="admin-input"
                placeholder="مثال: ۴۸٪ کاهش ملانین در آزمون Visia"
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
            <button onClick={handleSavePim} className="btn-approve">
              ذخیره تغییرات در کاتالوگ
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
