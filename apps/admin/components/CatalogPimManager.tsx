"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatJalaliDateTime } from "@commerce-os/localization";
import {
  authedFetch,
  faNumber,
  formatRialAsTomans,
  postTenantJson,
  TENANT_HEADERS,
  type PostResult,
} from "./types";

// ── Domain model ─────────────────────────────────────────────────────────────
// Row shape mirrors GET /v1/stores/admin/products. Money is canonical RIALS on
// the server; the admin UI speaks TOMANS (×10 on write, ÷10 on read).

export type CatalogProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type CatalogProductKind = "PHYSICAL" | "DIGITAL";

export interface CatalogProductVariant {
  id: string;
  sku: string;
  priceRials: number;
  stock: number;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  titleFa: string;
  titleEn?: string | null;
  description?: string | null;
  kind: CatalogProductKind;
  status: CatalogProductStatus;
  publishedAt?: string | null;
  isFeatured: boolean;
  /** Tolerated extra: the current server mapper omits it; offline drafts carry it. */
  categoryFa?: string | null;
  brand?: { name?: string | null } | null;
  defaultVariant?: CatalogProductVariant | null;
  media?: { url: string; isPrimary?: boolean }[] | null;
  createdAt?: string | null;
}

interface ImportReportRow {
  ok: boolean;
  label: string;
  message: string;
}

const STORAGE_KEY = "commerce_os_catalog_pim_products_v2";
const PRODUCTS_LIMIT = 50;
/** Seeded storefront slug (apps/api/prisma/seed.ts). */
const DEFAULT_STORE_SLUG = "demo";

// ── Tolerant helpers ─────────────────────────────────────────────────────────

const asString = (value: unknown): string => (typeof value === "string" ? value : "");

const asNumber = (value: unknown): number => {
  const n = typeof value === "number" ? value : Number(String(value ?? "").replace(/[^\d-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

/**
 * Normalizes an API row or a legacy local-draft row into the uniform
 * CatalogProduct shape. Legacy drafts (pre-API) carried priceTomans /
 * stockQty / images[] / category / brand strings — those are converted here
 * so old browser state keeps working in offline mode. Rows missing id or
 * titleFa are dropped rather than guessed at.
 */
const normalizeProduct = (raw: unknown): CatalogProduct | null => {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const id = asString(r.id);
  const titleFa = asString(r.titleFa).trim();
  if (!id || !titleFa) return null;

  let variant: CatalogProductVariant | null = null;
  if (typeof r.defaultVariant === "object" && r.defaultVariant !== null) {
    const v = r.defaultVariant as Record<string, unknown>;
    variant = {
      id: asString(v.id) || `${id}-variant`,
      sku: asString(v.sku) || "—",
      priceRials: Math.max(0, Math.trunc(asNumber(v.priceRials))),
      stock: Math.max(0, Math.trunc(asNumber(v.stock))),
    };
  } else if (r.priceTomans !== undefined) {
    // Legacy local draft: tomans × 10 → canonical rials
    variant = {
      id: `${id}-variant`,
      sku: "LOCAL",
      priceRials: Math.max(0, Math.trunc(asNumber(r.priceTomans))) * 10,
      stock: Math.max(0, Math.trunc(asNumber(r.stockQty))),
    };
  }

  let media: { url: string; isPrimary?: boolean }[] | null = null;
  if (Array.isArray(r.media)) {
    const urls = r.media
      .map((m) => (typeof (m as Record<string, unknown>)?.url === "string" ? String((m as Record<string, unknown>).url) : ""))
      .filter((url) => url.length > 0);
    if (urls.length > 0) {
      media = urls.map((url, i) => ({ url, isPrimary: i === 0 }));
    }
  } else if (Array.isArray(r.images) && typeof r.images[0] === "string") {
    media = [{ url: r.images[0] as string, isPrimary: true }]; // legacy draft shape
  }

  const rawCategory = r.categoryFa ?? r.category;
  const categoryFa =
    typeof rawCategory === "string" && rawCategory.trim().length > 0 ? rawCategory.trim() : null;

  const rawBrand = r.brand;
  const brand =
    typeof rawBrand === "string"
      ? { name: rawBrand } // legacy draft: brand was a plain string
      : typeof rawBrand === "object" && rawBrand !== null
      ? { name: asString((rawBrand as Record<string, unknown>).name) || null }
      : null;

  const statusRaw = asString(r.status);
  const status: CatalogProductStatus =
    statusRaw === "PUBLISHED" || statusRaw === "ARCHIVED" ? statusRaw : statusRaw === "DRAFT" ? "DRAFT" : "DRAFT";

  return {
    id,
    slug: asString(r.slug) || id,
    titleFa,
    titleEn: asString(r.titleEn) || null,
    description: asString(r.description) || null,
    kind: asString(r.kind) === "DIGITAL" ? "DIGITAL" : "PHYSICAL",
    status,
    publishedAt: asString(r.publishedAt) || null,
    isFeatured: Boolean(r.isFeatured),
    categoryFa,
    brand,
    defaultVariant: variant,
    media,
    createdAt: asString(r.createdAt) || null,
  };
};

const priceTomansOf = (p: CatalogProduct): number => Math.round((p.defaultVariant?.priceRials ?? 0) / 10);
const stockOf = (p: CatalogProduct): number => p.defaultVariant?.stock ?? 0;
const imageUrlOf = (p: CatalogProduct): string | null => {
  const media = p.media ?? [];
  const primary = media.find((m) => m.isPrimary) ?? media[0];
  return primary?.url ?? null;
};
const categoryLabelOf = (p: CatalogProduct): string => p.categoryFa ?? "—";

// ── Offline seed: the authentic skincare catalog (local draft only) ─────────

export const INITIAL_SKINCARE_PRODUCTS: CatalogProduct[] = [
  {
    id: "prod_drdermer_001",
    slug: "carboxygel",
    titleFa: "ژل حرفه‌ای کربوکسی‌تراپی CarboxyGel™ Professional Therapy",
    description: "ژل ۲ فاز ماتریکسی بی‌کربنات سدیم با القای فیزیولوژیک اثر بوهر جهت اکسیژن‌رسانی عمقی بدون سوزن.",
    kind: "PHYSICAL",
    status: "PUBLISHED",
    isFeatured: false,
    categoryFa: "کربوکسی‌تراپی و اکسیژن‌رسانی",
    brand: { name: "ReeSkin Clinical" },
    defaultVariant: { id: "var_drdermer_001", sku: "carboxygel-STD", priceRials: 32000000, stock: 85 },
    media: [{ url: "/assets/drdermer/2025/07/azelaic-acid-carboxygel-600x600.png", isPrimary: true }],
  },
  {
    id: "prod_drdermer_002",
    slug: "carboxypod",
    titleFa: "کپسول‌های فعال‌ساز ترابافتی CarboxyPod™ Activation Pods",
    description: "کپسول‌های فعال‌ساز گاز CO₂ در سه مدل درمانی کربن فعال، هیدرا و ویتامین C.",
    kind: "PHYSICAL",
    status: "PUBLISHED",
    isFeatured: false,
    categoryFa: "پادهای لایه‌بردار و فعال‌ساز",
    brand: { name: "ReeSkin Clinical" },
    defaultVariant: { id: "var_drdermer_002", sku: "carboxypod-STD", priceRials: 12000000, stock: 140 },
    media: [{ url: "/assets/drdermer/2025/07/carbon-carboxypod-app-1-551x600.png", isPrimary: true }],
  },
  {
    id: "prod_drdermer_003",
    slug: "carboxypad",
    titleFa: "شیت ماسک‌های فعال‌ساز صورت و گردن CarboxyPad™",
    description: "شیت‌های فیبری میکروپرمنبران با برش آناتومیک صورت و گردن جهت تبادل گازی پربازده.",
    kind: "PHYSICAL",
    status: "PUBLISHED",
    isFeatured: false,
    categoryFa: "ماسک‌های ترنس‌درمال",
    brand: { name: "ReeSkin Clinical" },
    defaultVariant: { id: "var_drdermer_003", sku: "carboxypad-STD", priceRials: 14000000, stock: 110 },
    media: [{ url: "/assets/drdermer/2025/07/carboxygel-activator-mask-and-pads-1-600x600.png", isPrimary: true }],
  },
  {
    id: "prod_drdermer_004",
    slug: "crystalene",
    titleFa: "خمیر پولیش و لایه‌بردار ابریشمی Crystalene Polish Paste",
    description: "میکرودرم خانگی با کریستال‌های خالص آلومینای گرید دارویی، نیاسینامید و اسید لاکتیک.",
    kind: "PHYSICAL",
    status: "PUBLISHED",
    isFeatured: false,
    categoryFa: "میکرودرم و لایه‌برداری",
    brand: { name: "ReeSkin Clinical" },
    defaultVariant: { id: "var_drdermer_004", sku: "crystalene-STD", priceRials: 17500000, stock: 95 },
    media: [{ url: "/assets/drdermer/2025/08/crystalene-scrub.webp", isPrimary: true }],
  },
  {
    id: "prod_drdermer_005",
    slug: "healene",
    titleFa: "ژل تسکین‌بخش و ترمیم سد دفاعی هیلین Healene Soothing Gel",
    description: "ژل سبک آبرسان و التیام‌بخش با پپتیدهای مس، پانتنول B5، اسید هیالورونیک و سنتلا.",
    kind: "PHYSICAL",
    status: "PUBLISHED",
    isFeatured: false,
    categoryFa: "ترمیم و التیام پوست",
    brand: { name: "ReeSkin Clinical" },
    defaultVariant: { id: "var_drdermer_005", sku: "healene-STD", priceRials: 16500000, stock: 70 },
    media: [{ url: "/assets/drdermer/2025/08/healene-gel.webp", isPrimary: true }],
  },
  {
    id: "prod_drdermer_006",
    slug: "silicalene",
    titleFa: "اسکراب دتوکس سیلیکالین Silicalene Mild Silica Scrub",
    description: "پاکسازی عمقی منافذ، کنترل چربی مازاد و رفع جوش‌های سرسیاه با میکروسفرهای کروی سیلیکا.",
    kind: "PHYSICAL",
    status: "PUBLISHED",
    isFeatured: false,
    categoryFa: "دتوکس و کنترل سبوم",
    brand: { name: "ReeSkin Clinical" },
    defaultVariant: { id: "var_drdermer_006", sku: "silicalene-STD", priceRials: 15500000, stock: 60 },
    media: [{ url: "/assets/drdermer/2025/08/silicalene-scrub.webp", isPrimary: true }],
  },
  {
    id: "prod_drdermer_007",
    slug: "glycolic-carboxygel",
    titleFa: "کربوکسی‌ژل اسید گلیکولیک ۱۰٪ جوانساز و ضدچروک",
    description: "فرمولاسیون ویژه خطوط پنجه‌کلاغی، افت قوام و خطوط عمیق پیشانی با گلیکولیک ۱۰٪ و ماتریکسیل ۳۰۰۰.",
    kind: "PHYSICAL",
    status: "PUBLISHED",
    isFeatured: false,
    categoryFa: "کربوکسی‌تراپی و اکسیژن‌رسانی",
    brand: { name: "ReeSkin Clinical" },
    defaultVariant: { id: "var_drdermer_007", sku: "glycolic-carboxygel-STD", priceRials: 26800000, stock: 45 },
    media: [{ url: "/assets/drdermer/2025/07/glycolic-acid-carboxygel-600x600.png", isPrimary: true }],
  },
  {
    id: "prod_drdermer_008",
    slug: "multi-active-carboxygel",
    titleFa: "کربوکسی‌ژل مولتی‌اکتیو و ترمیم‌کننده پوست‌های حساس",
    description: "ترمیم سد دفاعی آسیب‌دیده، مهار قرمزی روزاسه و اریتم عروقی با فاکتور رشد بیومیمتیک EGF و سرامید NP.",
    kind: "PHYSICAL",
    status: "PUBLISHED",
    isFeatured: false,
    categoryFa: "ترمیم و التیام پوست",
    brand: { name: "ReeSkin Clinical" },
    defaultVariant: { id: "var_drdermer_008", sku: "multi-active-carboxygel-STD", priceRials: 25500000, stock: 50 },
    media: [{ url: "/assets/drdermer/2025/07/multi-active-carboxygel-600x600.png", isPrimary: true }],
  },
];

const STATUS_PILL: Record<CatalogProductStatus, { cls: string; fa: string }> = {
  PUBLISHED: { cls: "approved", fa: "منتشرشده" },
  DRAFT: { cls: "draft", fa: "پیش‌نویس" },
  ARCHIVED: { cls: "archived", fa: "بایگانی" },
};

interface QuickAddForm {
  titleFa: string;
  titleEn: string;
  description: string;
  categoryFa: string;
  priceTomans: string;
  stock: string;
  status: "DRAFT" | "PUBLISHED";
  isFeatured: boolean;
  imageUrl: string;
  kind: CatalogProductKind;
}

const EMPTY_QUICK_ADD: QuickAddForm = {
  titleFa: "",
  titleEn: "",
  description: "",
  categoryFa: "",
  priceTomans: "",
  stock: "0",
  status: "DRAFT",
  isFeatured: false,
  imageUrl: "",
  kind: "PHYSICAL",
};

export default function CatalogPimManager({ userRole = "SUPER_ADMIN" }: { userRole?: string }) {
  const canEditPim = userRole === "SUPER_ADMIN" || userRole === "OPERATOR";

  const [mode, setMode] = useState<"loading" | "live" | "offline">("loading");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | CatalogProductStatus>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkBusy, setBulkBusy] = useState(false);

  // Quick add
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<QuickAddForm>(EMPTY_QUICK_ADD);
  const [submitting, setSubmitting] = useState(false);

  // JSON import
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importRunning, setImportRunning] = useState(false);
  const [importReport, setImportReport] = useState<ImportReportRow[]>([]);

  // Inline price/stock edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [rowBusyId, setRowBusyId] = useState<string | null>(null);

  // ── Data loading ───────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      // The admin catalog GET is tenant-scoped: x-tenant-id is mandatory
      // (requireTenant), while the session token authorizes AdminGuard routes.
      const res = await authedFetch(
        `/v1/stores/admin/products?store=${encodeURIComponent(DEFAULT_STORE_SLUG)}&limit=${PRODUCTS_LIMIT}`,
        { headers: TENANT_HEADERS, cache: "no-store" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json().catch(() => null)) as { data?: unknown[] } | null;
      const rows = Array.isArray(body?.data) ? body.data : [];
      setProducts(rows.map(normalizeProduct).filter((p): p is CatalogProduct => p !== null));
      setMode("live");
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const persistDrafts = useCallback((rows: CatalogProduct[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch {
      // Storage blocked or full — the in-memory draft still works this session.
    }
  }, []);

  const enterOffline = useCallback(() => {
    let drafts: CatalogProduct[] = [];
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as unknown;
        if (Array.isArray(parsed)) {
          drafts = parsed.map(normalizeProduct).filter((p): p is CatalogProduct => p !== null);
        }
      }
    } catch {
      drafts = [];
    }
    if (drafts.length === 0) {
      drafts = INITIAL_SKINCARE_PRODUCTS;
    }
    persistDrafts(drafts);
    setProducts(drafts);
    setMode("offline");
  }, [persistDrafts]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const ok = await fetchProducts();
      if (!cancelled && !ok) enterOffline();
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchProducts, enterOffline]);

  const handleRetryConnection = async () => {
    const ok = await fetchProducts();
    if (ok) {
      setErrorMsg("");
      setSuccessMsg("اتصال به سرور کاتالوگ برقرار شد؛ فهرست محصولات از API بارگذاری گردید.");
    } else {
      setErrorMsg("اتصال به سرور کاتالوگ برقرار نشد؛ همچنان در حالت آفلاین هستید.");
    }
  };

  const handleResetLocalDraft = () => {
    if (!window.confirm("پیش‌نویس محلی مرورگر به فهرست ۸ محصول رسمی بازنشانی شود؟ تغییرات محلی قبلی از دست می‌رود.")) {
      return;
    }
    setProducts(INITIAL_SKINCARE_PRODUCTS);
    persistDrafts(INITIAL_SKINCARE_PRODUCTS);
    setSuccessMsg("پیش‌نویس محلی به فهرست رسمی اولیه بازنشانی شد.");
  };

  // ── Filtering (client-side) ────────────────────────────────────────────────

  const applyFilters = useCallback(
    (rows: CatalogProduct[]) => {
      const q = searchQuery.trim().toLowerCase();
      return rows.filter((p) => {
        const categoryLabel = categoryLabelOf(p);
        const matchSearch =
          q.length === 0 ||
          p.titleFa.toLowerCase().includes(q) ||
          (p.titleEn ?? "").toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          categoryLabel.toLowerCase().includes(q);
        const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
        const matchCategory = categoryFilter === "ALL" || categoryLabel === categoryFilter;
        return matchSearch && matchStatus && matchCategory;
      });
    },
    [searchQuery, statusFilter, categoryFilter]
  );

  const filteredProducts = useMemo(() => applyFilters(products), [applyFilters, products]);

  // Prune the selection whenever the visible set changes, so bulk actions can
  // never target rows that are hidden by the current search/filter state.
  useEffect(() => {
    const visible = new Set(filteredProducts.map((p) => p.id));
    setSelectedIds((prev) => {
      const pruned = prev.filter((id) => visible.has(id));
      return pruned.length === prev.length ? prev : pruned;
    });
  }, [filteredProducts]);

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const label = categoryLabelOf(p);
      if (label !== "—") set.add(label);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fa"));
  }, [products]);

  // ── Metrics (recomputed from loaded data) ──────────────────────────────────

  const publishedCount = products.filter((p) => p.status === "PUBLISHED").length;
  const draftCount = products.filter((p) => p.status === "DRAFT").length;
  const archivedCount = products.filter((p) => p.status === "ARCHIVED").length;
  const totalStockValueRials = products.reduce(
    (acc, p) => acc + (p.defaultVariant?.priceRials ?? 0) * stockOf(p),
    0
  );

  // ── Mutations ──────────────────────────────────────────────────────────────

  const describeFailure = (result: PostResult, fallback: string): string => {
    if (result.status === 503) {
      // The server answers DB-down with a Persian message — surface it verbatim.
      return result.message || "سرویس کاتالوگ موقتاً در دسترس نیست — لطفاً بعداً تلاش کنید.";
    }
    return result.message || `${fallback} (HTTP ${result.status > 0 ? result.status : "شبکه"})`;
  };

  const applyLocalUpdate = (id: string, patch: Partial<CatalogProduct>) => {
    const next = products.map((p) => (p.id === id ? { ...p, ...patch } : p));
    setProducts(next);
    persistDrafts(next);
  };

  const applyLocalBulk = (ids: string[], patch: Partial<CatalogProduct>) => {
    const idSet = new Set(ids);
    const next = products.map((p) => (idSet.has(p.id) ? { ...p, ...patch } : p));
    setProducts(next);
    persistDrafts(next);
  };

  const replaceProduct = (updated: CatalogProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const patchProduct = async (id: string, body: Record<string, unknown>): Promise<boolean> => {
    setRowBusyId(id);
    setErrorMsg("");
    setSuccessMsg("");
    const result = await postTenantJson(
      `/v1/stores/admin/products/${encodeURIComponent(id)}`,
      body,
      "PATCH"
    );
    setRowBusyId(null);
    if (!result.ok) {
      setErrorMsg(describeFailure(result, "به‌روزرسانی محصول ناموفق بود"));
      return false;
    }
    const updated = normalizeProduct((result.data as { data?: unknown } | null)?.data);
    if (updated) {
      replaceProduct(updated);
    } else {
      await fetchProducts(); // unexpected response shape — resync from the server
    }
    return true;
  };

  const localVariant = (p: CatalogProduct, priceRials: number, stock: number): CatalogProductVariant => ({
    id: p.defaultVariant?.id ?? `${p.id}-variant`,
    sku: p.defaultVariant?.sku ?? "LOCAL",
    priceRials,
    stock,
  });

  const handleTogglePublish = async (p: CatalogProduct) => {
    if (!canEditPim || rowBusyId !== null) return;
    const nextStatus: CatalogProductStatus = p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const faNext = nextStatus === "PUBLISHED" ? "«منتشرشده»" : "«پیش‌نویس»";
    if (mode === "offline") {
      applyLocalUpdate(p.id, { status: nextStatus });
      setSuccessMsg(`وضعیت انتشار «${p.titleFa}» در پیش‌نویس محلی به ${faNext} تغییر یافت (فقط مرورگر).`);
      return;
    }
    if (await patchProduct(p.id, { status: nextStatus })) {
      setSuccessMsg(`وضعیت انتشار «${p.titleFa}» به ${faNext} تغییر یافت.`);
    }
  };

  const handleToggleFeatured = async (p: CatalogProduct) => {
    if (!canEditPim || rowBusyId !== null) return;
    const next = !p.isFeatured;
    if (mode === "offline") {
      applyLocalUpdate(p.id, { isFeatured: next });
      setSuccessMsg(`نشان ویژه «${p.titleFa}» ${next ? "فعال" : "برداشته"} شد (ذخیره محلی مرورگر).`);
      return;
    }
    if (await patchProduct(p.id, { isFeatured: next })) {
      setSuccessMsg(`نشان ویژه «${p.titleFa}» ${next ? "فعال" : "برداشته"} شد.`);
    }
  };

  const handleArchive = async (p: CatalogProduct) => {
    if (!canEditPim || rowBusyId !== null) return;
    if (!window.confirm(`محصول «${p.titleFa}» بایگانی شود؟ (حذف نرم — ردیف از ویترین پنهان می‌شود)`)) return;
    if (mode === "offline") {
      applyLocalUpdate(p.id, { status: "ARCHIVED" });
      setSuccessMsg(`محصول «${p.titleFa}» در پیش‌نویس محلی بایگانی شد.`);
      return;
    }
    if (await patchProduct(p.id, { status: "ARCHIVED" })) {
      setSuccessMsg(`محصول «${p.titleFa}» بایگانی شد (حذف نرم).`);
    }
  };

  const handleRestoreDraft = async (p: CatalogProduct) => {
    if (!canEditPim || rowBusyId !== null) return;
    if (mode === "offline") {
      applyLocalUpdate(p.id, { status: "DRAFT" });
      setSuccessMsg(`محصول «${p.titleFa}» به پیش‌نویس بازگردانده شد (محلی).`);
      return;
    }
    if (await patchProduct(p.id, { status: "DRAFT" })) {
      setSuccessMsg(`محصول «${p.titleFa}» از بایگانی به پیش‌نویس بازگشت.`);
    }
  };

  const startInlineEdit = (p: CatalogProduct) => {
    setEditingId(p.id);
    setEditPrice(String(priceTomansOf(p)));
    setEditStock(String(stockOf(p)));
    setSuccessMsg("");
    setErrorMsg("");
  };

  const cancelInlineEdit = () => setEditingId(null);

  const handleSaveInlineEdit = async (p: CatalogProduct) => {
    const tomans = Number(editPrice);
    const stock = Number(editStock);
    if (!Number.isInteger(tomans) || tomans <= 0) {
      setErrorMsg("قیمت باید عددی صحیح و مثبت (تومان) باشد.");
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setErrorMsg("موجودی باید عددی صحیح و بزرگ‌تر یا مساوی صفر باشد.");
      return;
    }
    const priceRials = tomans * 10;
    if (mode === "offline") {
      applyLocalUpdate(p.id, { defaultVariant: localVariant(p, priceRials, stock) });
      setEditingId(null);
      setSuccessMsg("قیمت و موجودی در پیش‌نویس محلی مرورگر ذخیره شد.");
      return;
    }
    if (await patchProduct(p.id, { priceRials, stock })) {
      setEditingId(null);
      setSuccessMsg(`قیمت و موجودی «${p.titleFa}» روی سرور به‌روزرسانی شد.`);
    }
  };

  // ── Bulk actions ───────────────────────────────────────────────────────────

  const runBulk = async (
    patch: { status?: CatalogProductStatus; isFeatured?: boolean },
    actionLabel: string
  ) => {
    if (!canEditPim || selectedIds.length === 0 || bulkBusy) return;
    if (patch.status === "ARCHIVED" && !window.confirm(`${faNumber(selectedIds.length)} محصول انتخابی بایگانی شود؟`)) {
      return;
    }
    setBulkBusy(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      if (mode === "offline") {
        applyLocalBulk(selectedIds, patch);
        setSuccessMsg(`${faNumber(selectedIds.length)} ردیف در پیش‌نویس محلی ${actionLabel} شد (فقط مرورگر).`);
        return;
      }
      const result = await postTenantJson("/v1/stores/admin/products/bulk-update", {
        ids: selectedIds,
        ...patch,
      });
      if (!result.ok) {
        setErrorMsg(describeFailure(result, "به‌روزرسانی گروهی ناموفق بود"));
        return;
      }
      const payload = result.data as { data?: { updated?: number } } | null;
      const updated = Math.max(0, Math.trunc(Number(payload?.data?.updated ?? 0)));
      await fetchProducts();
      if (updated < selectedIds.length) {
        setErrorMsg(`${faNumber(updated)} موفق، ${faNumber(selectedIds.length - updated)} ناموفق — فهرست بازخوانی شد.`);
      } else {
        setSuccessMsg(`${faNumber(updated)} محصول با موفقیت ${actionLabel} شد.`);
      }
    } finally {
      setBulkBusy(false);
    }
  };

  const toggleRowSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const allVisibleSelected =
    filteredProducts.length > 0 && filteredProducts.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    setSelectedIds(allVisibleSelected ? [] : filteredProducts.map((p) => p.id));
  };

  // ── Quick add ──────────────────────────────────────────────────────────────

  const resetCreateForm = () => setForm(EMPTY_QUICK_ADD);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const titleFa = form.titleFa.trim();
    const tomans = Number(form.priceTomans);
    const stock = Number(form.stock);
    if (titleFa.length === 0) {
      setErrorMsg("عنوان فارسی محصول الزامی است.");
      return;
    }
    if (!Number.isInteger(tomans) || tomans <= 0) {
      setErrorMsg("قیمت باید عددی صحیح و مثبت (تومان) باشد.");
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setErrorMsg("موجودی باید عددی صحیح و بزرگ‌تر یا مساوی صفر باشد.");
      return;
    }

    const priceRials = tomans * 10;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (mode === "offline") {
      const now = Date.now();
      const localSlug =
        form.titleEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
        `local-${now}`;
      const local: CatalogProduct = {
        id: `local_${now}`,
        slug: localSlug,
        titleFa,
        titleEn: form.titleEn.trim() || null,
        description: form.description.trim() || null,
        kind: form.kind,
        status: form.status,
        isFeatured: form.isFeatured,
        categoryFa: form.categoryFa.trim() || null,
        defaultVariant: { id: `local_${now}_v`, sku: "LOCAL", priceRials, stock },
        media: form.imageUrl.trim() ? [{ url: form.imageUrl.trim(), isPrimary: true }] : null,
        createdAt: null,
      };
      const next = [local, ...products];
      setProducts(next);
      persistDrafts(next);
      setShowCreateModal(false);
      resetCreateForm();
      setSubmitting(false);
      setSuccessMsg(`«${titleFa}» به پیش‌نویس محلی مرورگر افزوده شد (حالت آفلاین).`);
      return;
    }

    // slug is intentionally omitted — the server generates it from titleEn/titleFa
    const payload: Record<string, unknown> = {
      storeSlug: DEFAULT_STORE_SLUG,
      titleFa,
      priceRials,
      stock,
      status: form.status,
      isFeatured: form.isFeatured,
      kind: form.kind,
    };
    if (form.titleEn.trim()) payload.titleEn = form.titleEn.trim();
    if (form.description.trim()) payload.description = form.description.trim();
    if (form.categoryFa.trim()) payload.categoryFa = form.categoryFa.trim();
    if (form.imageUrl.trim()) payload.imageUrl = form.imageUrl.trim();

    const result = await postTenantJson("/v1/stores/admin/products", payload);
    setSubmitting(false);
    if (!result.ok) {
      if (result.status === 409) {
        setErrorMsg("اسلاگ تکراری است — نام لاتین دیگری انتخاب کنید یا عنوان را تغییر دهید.");
      } else {
        setErrorMsg(describeFailure(result, "ثبت محصول در کاتالوگ ناموفق بود"));
      }
      return;
    }
    setShowCreateModal(false);
    resetCreateForm();
    await fetchProducts();
    setSuccessMsg(`محصول «${titleFa}» در سرور ثبت شد؛ اسلاگ آن به‌صورت خودکار تولید گردید.`);
  };

  // ── JSON export / import ───────────────────────────────────────────────────

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `drdermer_catalog_pim_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSuccessMsg("خروجی JSON کاتالوگ از داده‌های بارگذاری‌شده دانلود شد.");
  };

  const parseImportRows = (): Record<string, unknown>[] | null => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(importText);
    } catch {
      setErrorMsg("خطا در پردازش JSON؛ ساختار داده‌ها را بررسی کنید.");
      return null;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      setErrorMsg("ورودی باید آرایه‌ای غیرخالی از محصولات باشد.");
      return null;
    }
    if (parsed.length > 100) {
      setErrorMsg("هر بار حداکثر ۱۰۰ محصول وارد کنید.");
      return null;
    }
    return parsed as Record<string, unknown>[];
  };

  const handleBatchImport = async (e: React.FormEvent) => {
    e.preventDefault();
    const rows = parseImportRows();
    if (rows === null) return;

    setImportRunning(true);
    setImportReport([]);
    setErrorMsg("");
    setSuccessMsg("");
    const report: ImportReportRow[] = [];

    // Sequential POST per row — every row reports its own outcome, so partial
    // success is never presented as a full success.
    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i];
      const titleFa = asString(raw.titleFa).trim();
      const label = titleFa || `ردیف ${faNumber(i + 1)}`;

      let priceRials: number | null = null;
      if (raw.priceRials !== undefined) {
        const n = Number(raw.priceRials);
        priceRials = Number.isInteger(n) && n > 0 ? n : null;
      } else if (raw.priceTomans !== undefined) {
        const n = Number(raw.priceTomans);
        priceRials = Number.isInteger(n) && n > 0 ? n * 10 : null;
      }
      const stockRaw = raw.stock !== undefined ? Number(raw.stock) : Number(raw.stockQty ?? 0);

      if (titleFa.length === 0) {
        report.push({ ok: false, label, message: "عنوان فارسی (titleFa) نامعتبر است" });
        continue;
      }
      if (priceRials === null) {
        report.push({ ok: false, label, message: "قیمت نامعتبر است (priceRials یا priceTomans صحیح و مثبت لازم است)" });
        continue;
      }
      if (!Number.isInteger(stockRaw) || stockRaw < 0) {
        report.push({ ok: false, label, message: "موجودی نامعتبر است (عدد صحیح بزرگ‌تر یا مساوی صفر)" });
        continue;
      }

      const payload: Record<string, unknown> = {
        storeSlug: DEFAULT_STORE_SLUG,
        titleFa,
        priceRials,
        stock: stockRaw,
        status: raw.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        isFeatured: Boolean(raw.isFeatured),
        kind: raw.kind === "DIGITAL" ? "DIGITAL" : "PHYSICAL",
      };
      const titleEn = asString(raw.titleEn).trim();
      const slug = asString(raw.slug).trim();
      const description = asString(raw.description).trim();
      const categoryRaw = raw.categoryFa ?? raw.category;
      const imageUrl = asString(raw.imageUrl).trim() || (Array.isArray(raw.images) ? asString(raw.images[0]).trim() : "");
      if (titleEn) payload.titleEn = titleEn;
      if (slug) payload.slug = slug;
      if (description) payload.description = description;
      if (typeof categoryRaw === "string" && categoryRaw.trim()) payload.categoryFa = categoryRaw.trim();
      if (imageUrl) payload.imageUrl = imageUrl;

      if (mode === "offline") {
        const now = Date.now() + i;
        const local: CatalogProduct = {
          id: `local_${now}`,
          slug: slug || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `local-${now}`,
          titleFa,
          titleEn: titleEn || null,
          description: description || null,
          kind: (payload.kind as CatalogProductKind) ?? "PHYSICAL",
          status: (payload.status as CatalogProductStatus) ?? "DRAFT",
          isFeatured: Boolean(raw.isFeatured),
          categoryFa: typeof payload.categoryFa === "string" ? payload.categoryFa : null,
          defaultVariant: { id: `local_${now}_v`, sku: "LOCAL", priceRials, stock: stockRaw },
          media: imageUrl ? [{ url: imageUrl, isPrimary: true }] : null,
          createdAt: null,
        };
        report.push({ ok: true, label, message: "به پیش‌نویس محلی افزوده شد" });
        // Accumulate locally per row so a mid-batch failure still keeps successes.
        setProducts((prev) => {
          const next = [local, ...prev];
          persistDrafts(next);
          return next;
        });
        continue;
      }

      const result = await postTenantJson("/v1/stores/admin/products", payload);
      if (result.ok) {
        report.push({ ok: true, label, message: "در سرور ثبت شد" });
      } else if (result.status === 409) {
        report.push({ ok: false, label, message: "اسلاگ تکراری است" });
      } else {
        report.push({
          ok: false,
          label,
          message: result.status === 503 ? result.message || "سرویس موقتاً در دسترس نیست" : result.message || `HTTP ${result.status || "شبکه"}`,
        });
      }
    }

    setImportReport(report);
    setImportRunning(false);
    if (mode === "live") {
      await fetchProducts();
    }
    const okCount = report.filter((r) => r.ok).length;
    const failCount = report.length - okCount;
    if (failCount === 0) {
      setSuccessMsg(`${faNumber(okCount)} محصول با موفقیت وارد کاتالوگ شد.`);
    } else {
      setErrorMsg(`${faNumber(okCount)} موفق، ${faNumber(failCount)} ناموفق — جزئیات هر ردیف در گزارش زیر.`);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="tab-pane">
      <section className="admin-section-box">
        {/* Header strip */}
        <div
          className="box-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}
        >
          <div>
            <h2>کاتالوگ محصولات مراقبت پوست (Dr Dermer PIM)</h2>
            <small>
              ایجاد محصول با ثبت مستقیم در API کاتالوگ، کنترل انتشار و ویژه، ویرایش سریع قیمت و موجودی، بایگانی نرم و ورود/خروج دسته‌ای
            </small>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {canEditPim && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setShowCreateModal(true);
                  }}
                  className="btn-action"
                  style={{ background: "var(--brand, #1E3A2F)", color: "#FFFFFF", fontWeight: 800, padding: "8px 18px", borderRadius: "8px" }}
                >
                  + افزودن محصول جدید
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setImportReport([]);
                    setShowImportModal(true);
                  }}
                  className="btn-action"
                  style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)", fontWeight: 700 }}
                >
                  ورود دسته‌ای (Import)
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleExportJson}
              className="btn-action"
              style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)", fontWeight: 700 }}
            >
              خروجی JSON
            </button>
            {mode === "live" && <span className="badge-live">CATALOG ADMIN API (LIVE)</span>}
          </div>
        </div>

        {/* Connection state */}
        {mode === "loading" && (
          <p className="muted-text" style={{ margin: "12px 0" }}>
            در حال دریافت محصولات از سرور کاتالوگ…
          </p>
        )}
        {mode === "offline" && (
          <div className="banner-offline-warning" style={{ margin: "12px 0" }}>
            <div>
              <strong>حالت آفلاین — تغییرات فقط در مرورگر ذخیره می‌شود.</strong> سرور کاتالوگ در دسترس نیست؛
              داده‌های نمایش‌داده‌شده پیش‌نویس محلی (localStorage) هستند و هیچ تغییری به سرور ارسال نمی‌شود.
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {canEditPim && (
                <button onClick={handleResetLocalDraft} className="btn-action">
                  بازنشانی پیش‌نویس محلی
                </button>
              )}
              <button onClick={() => void handleRetryConnection()} disabled={loading} className="btn-retry">
                {loading ? "در حال تلاش…" : "تلاش مجدد اتصال"}
              </button>
            </div>
          </div>
        )}

        {/* Metrics (recomputed from loaded data) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", margin: "16px 0 20px" }}>
          <div style={{ background: "var(--surface-soft, #f8fafc)", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border, #e2e8f0)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block" }}>تعداد کل اقلام کاتالوگ</span>
            <strong style={{ fontSize: "1.4rem", color: "var(--ink)", fontWeight: 900 }}>{faNumber(products.length)} کالا</strong>
          </div>
          <div style={{ background: "var(--surface-soft, #f8fafc)", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border, #e2e8f0)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block" }}>منتشرشده</span>
            <strong style={{ fontSize: "1.4rem", color: "#059669", fontWeight: 900 }}>{faNumber(publishedCount)} کالا</strong>
          </div>
          <div style={{ background: "var(--surface-soft, #f8fafc)", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border, #e2e8f0)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block" }}>پیش‌نویس</span>
            <strong style={{ fontSize: "1.4rem", color: "#D97706", fontWeight: 900 }}>{faNumber(draftCount)} کالا</strong>
          </div>
          <div style={{ background: "var(--surface-soft, #f8fafc)", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border, #e2e8f0)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block" }}>بایگانی‌شده</span>
            <strong style={{ fontSize: "1.4rem", color: "var(--muted)", fontWeight: 900 }}>{faNumber(archivedCount)} کالا</strong>
          </div>
          <div style={{ background: "var(--surface-soft, #f8fafc)", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border, #e2e8f0)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block" }}>ارزش موجودی کل انبار (قیمت × موجودی)</span>
            <strong style={{ fontSize: "1.2rem", color: "var(--brand, #1E3A2F)", fontWeight: 900 }} className="tabular-nums">
              {formatRialAsTomans(totalStockValueRials)}
            </strong>
          </div>
        </div>

        {successMsg && (
          <div className="form-feedback-success" style={{ marginBottom: "14px" }}>{successMsg}</div>
        )}
        {errorMsg && (
          <div className="form-feedback-error" role="alert" style={{ marginBottom: "14px" }}>{errorMsg}</div>
        )}

        {/* Toolbar */}
        <div className="admin-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <div className="admin-search-wrapper" style={{ flex: 1, minWidth: "240px" }}>
            <input
              type="text"
              placeholder="جستجو بر اساس عنوان، نام لاتین، اسلاگ یا دسته‌بندی…"
              className="admin-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <select
              className="admin-input"
              style={{ width: "auto", minWidth: "170px", padding: "6px 12px" }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="فیلتر دسته‌بندی"
            >
              <option value="ALL">همه دسته‌بندی‌ها</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({faNumber(products.filter((p) => categoryLabelOf(p) === cat).length)})
                </option>
              ))}
            </select>
            <div className="filter-chips-group">
              {([
                { value: "ALL", label: "همه", count: products.length },
                { value: "PUBLISHED", label: "منتشرشده", count: publishedCount },
                { value: "DRAFT", label: "پیش‌نویس", count: draftCount },
                { value: "ARCHIVED", label: "بایگانی", count: archivedCount },
              ] as { value: "ALL" | CatalogProductStatus; label: string; count: number }[]).map((chip) => (
                <button
                  key={chip.value}
                  className={`filter-chip ${statusFilter === chip.value ? "active" : ""}`}
                  onClick={() => setStatusFilter(chip.value)}
                >
                  {chip.label} ({faNumber(chip.count)})
                </button>
              ))}
            </div>
            {mode === "live" && (
              <button
                type="button"
                onClick={() => void fetchProducts()}
                disabled={loading}
                className="btn-action"
                style={{ fontSize: "0.8rem" }}
              >
                {loading ? "در حال دریافت…" : "بازخوانی از سرور"}
              </button>
            )}
          </div>
        </div>

        {/* Bulk action bar */}
        {canEditPim && selectedIds.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              margin: "14px 0",
              padding: "10px 14px",
              background: "var(--brand-tint, #eef5f2)",
              border: "1px solid var(--brand, #1E3A2F)",
              borderRadius: "10px",
              fontSize: "0.86rem",
            }}
          >
            <strong>{faNumber(selectedIds.length)} ردیف انتخاب شده</strong>
            <span style={{ color: mode === "offline" ? "#92400e" : "var(--muted)", fontSize: "0.78rem" }}>
              {mode === "offline" ? "(اجرای گروهی فقط روی پیش‌نویس محلی)" : "(اجرای گروهی روی سرور)"}
            </span>
            <button className="btn-action" disabled={bulkBusy} onClick={() => void runBulk({ status: "PUBLISHED" }, "منتشر کرد")}>
              انتشار گروهی
            </button>
            <button className="btn-action" disabled={bulkBusy} onClick={() => void runBulk({ status: "DRAFT" }, "به پیش‌نویس برد")}>
              پیش‌نویس گروهی
            </button>
            <button className="btn-action" disabled={bulkBusy} onClick={() => void runBulk({ isFeatured: true }, "ویژه کرد")}>
              ویژه گروهی
            </button>
            <button className="btn-action" disabled={bulkBusy} onClick={() => void runBulk({ status: "ARCHIVED" }, "بایگانی کرد")}>
              بایگانی گروهی
            </button>
            <button className="btn-reject" onClick={() => setSelectedIds([])} disabled={bulkBusy}>
              لغو انتخاب
            </button>
          </div>
        )}

        {/* Products table */}
        <div className="table-responsive-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "36px" }}>
                  <input
                    type="checkbox"
                    aria-label="انتخاب همه ردیف‌های نمایان"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    disabled={!canEditPim || filteredProducts.length === 0}
                  />
                </th>
                <th style={{ width: "60px" }}>تصویر</th>
                <th>عنوان محصول</th>
                <th>دسته‌بندی</th>
                <th style={{ width: "170px" }}>قیمت (تومان)</th>
                <th style={{ width: "120px" }}>موجودی</th>
                <th style={{ width: "150px" }}>وضعیت انتشار</th>
                <th style={{ width: "80px" }}>ویژه</th>
                <th style={{ width: "170px" }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {mode === "loading" ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "28px" }} className="muted-text">
                    در حال دریافت فهرست محصولات…
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "28px" }} className="muted-text">
                    {products.length === 0
                      ? "کاتالوگ خالی است — اولین محصول را با «افزودن محصول جدید» ثبت کنید."
                      : "هیچ محصولی با معیارهای جستجو یا فیلتر یافت نشد."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const busy = rowBusyId === p.id || bulkBusy;
                  const editing = editingId === p.id;
                  const pill = STATUS_PILL[p.status];
                  const img = imageUrlOf(p);
                  return (
                    <tr key={p.id} style={{ opacity: p.status === "ARCHIVED" ? 0.55 : 1 }}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`انتخاب ${p.titleFa}`}
                          checked={selectedIds.includes(p.id)}
                          onChange={() => toggleRowSelection(p.id)}
                          disabled={!canEditPim}
                        />
                      </td>
                      <td>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "8px",
                            background: "#f8fafc",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          {img ? (
                            <img src={img} alt={p.titleFa} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                          ) : (
                            <span className="muted-text" style={{ fontSize: "0.7rem" }}>بدون تصویر</span>
                          )}
                        </div>
                      </td>
                      <td className="bold">
                        <div style={{ fontSize: "0.92rem" }}>{p.titleFa}</div>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px", flexWrap: "wrap" }}>
                          <span className="muted-text" style={{ direction: "ltr", fontSize: "0.78rem" }}>/{p.slug}</span>
                          {p.kind === "DIGITAL" && (
                            <span style={{ fontSize: "0.7rem", background: "rgba(3, 105, 161, 0.12)", color: "#0369A1", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>
                              دیجیتال
                            </span>
                          )}
                          {p.brand?.name && (
                            <span className="muted-text" style={{ fontSize: "0.75rem" }}>{p.brand.name}</span>
                          )}
                          {p.createdAt && (
                            <span className="muted-text tabular-nums" style={{ fontSize: "0.72rem" }}>
                              ثبت: {formatJalaliDateTime(p.createdAt)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="category-pill" style={{ fontSize: "0.8rem" }}>{categoryLabelOf(p)}</span>
                      </td>
                      <td className="tabular-nums" style={{ fontSize: "0.95rem" }}>
                        {editing ? (
                          <input
                            className="admin-input"
                            dir="ltr"
                            type="number"
                            aria-label={`قیمت جدید (تومان) برای ${p.titleFa}`}
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            style={{ width: "120px", padding: "4px 8px" }}
                          />
                        ) : (
                          <span className="bold">{faNumber(priceTomansOf(p))}</span>
                        )}
                      </td>
                      <td className="tabular-nums">
                        {editing ? (
                          <input
                            className="admin-input"
                            dir="ltr"
                            type="number"
                            aria-label={`موجودی جدید برای ${p.titleFa}`}
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            style={{ width: "76px", padding: "4px 8px" }}
                          />
                        ) : (
                          <span style={{ fontWeight: 800, color: stockOf(p) > 20 ? "#059669" : stockOf(p) > 0 ? "#D97706" : "#DC2626" }}>
                            {faNumber(stockOf(p))} عدد
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span className={`status-pill ${pill.cls}`}>{pill.fa}</span>
                          {p.status !== "ARCHIVED" && (
                            <label
                              className="toggle-switch-wrapper"
                              title={p.status === "PUBLISHED" ? "غیرفعال‌سازی (پیش‌نویس)" : "انتشار در ویترین"}
                            >
                              <input
                                type="checkbox"
                                className="toggle-switch-input"
                                checked={p.status === "PUBLISHED"}
                                disabled={!canEditPim || busy}
                                onChange={() => void handleTogglePublish(p)}
                              />
                              <span className="toggle-switch-track">
                                <span className="toggle-switch-thumb" />
                              </span>
                            </label>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <label className="toggle-switch-wrapper" title="نمایش به‌عنوان محصول ویژه">
                          <input
                            type="checkbox"
                            className="toggle-switch-input"
                            checked={p.isFeatured}
                            disabled={!canEditPim || busy}
                            onChange={() => void handleToggleFeatured(p)}
                          />
                          <span className="toggle-switch-track">
                            <span className="toggle-switch-thumb" />
                          </span>
                        </label>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {editing ? (
                            <>
                              <button
                                onClick={() => void handleSaveInlineEdit(p)}
                                disabled={busy}
                                className="btn-approve"
                                style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                              >
                                {busy ? "…" : "ثبت"}
                              </button>
                              <button
                                onClick={cancelInlineEdit}
                                disabled={busy}
                                className="btn-reject"
                                style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                              >
                                انصراف
                              </button>
                            </>
                          ) : (
                            <>
                              {canEditPim && p.status !== "ARCHIVED" && (
                                <button
                                  onClick={() => startInlineEdit(p)}
                                  className="btn-action"
                                  style={{ padding: "4px 10px", fontSize: "0.78rem", fontWeight: 700 }}
                                  title="ویرایش سریع قیمت و موجودی"
                                >
                                  ویرایش
                                </button>
                              )}
                              {canEditPim && p.status === "ARCHIVED" && (
                                <button
                                  onClick={() => void handleRestoreDraft(p)}
                                  disabled={busy}
                                  className="btn-action"
                                  style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                                  title="بازگردانی از بایگانی به پیش‌نویس"
                                >
                                  بازگردانی
                                </button>
                              )}
                              {canEditPim && p.status !== "ARCHIVED" && (
                                <button
                                  onClick={() => void handleArchive(p)}
                                  disabled={busy}
                                  className="btn-action"
                                  style={{ padding: "4px 10px", fontSize: "0.78rem", color: "#DC2626", borderColor: "rgba(220, 38, 38, 0.3)" }}
                                  title="بایگانی نرم (حذف از ویترین)"
                                >
                                  بایگانی
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Modal: Quick Add ── */}
      {showCreateModal && (
        <div className="admin-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="admin-modal-card" style={{ background: "#FFFFFF", borderRadius: "16px", maxWidth: "640px", width: "100%", padding: "28px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900 }}>ثبت محصول جدید در کاتالوگ</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }} aria-label="بستن پنجره">✕</button>
            </div>
            <p className="muted-text" style={{ fontSize: "0.8rem", margin: "0 0 14px" }}>
              {mode === "offline"
                ? "حالت آفلاین: این محصول فقط در پیش‌نویس محلی مرورگر ذخیره می‌شود."
                : "اسلاگ به‌صورت خودکار از نام لاتین (و در نبود آن، عنوان فارسی) روی سرور تولید می‌شود."}
            </p>

            <form onSubmit={(e) => void handleCreateProduct(e)}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label htmlFor="pim-new-title" style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>
                    عنوان فارسی محصول (الزامی):
                  </label>
                  <input
                    id="pim-new-title"
                    required
                    className="admin-input"
                    placeholder="مثال: سرم هیالورونیک اسید چندوزنی و ویتامین B5"
                    value={form.titleFa}
                    onChange={(e) => setForm((prev) => ({ ...prev, titleFa: e.target.value }))}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label htmlFor="pim-new-titleen" style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>
                      نام لاتین (مبنای تولید اسلاگ):
                    </label>
                    <input
                      id="pim-new-titleen"
                      className="admin-input"
                      dir="ltr"
                      placeholder="Hyaluronic B5 Serum"
                      value={form.titleEn}
                      onChange={(e) => setForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="pim-new-price" style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>
                      قیمت (تومان — الزامی):
                    </label>
                    <input
                      id="pim-new-price"
                      required
                      type="number"
                      min={1}
                      step={1}
                      className="admin-input"
                      dir="ltr"
                      value={form.priceTomans}
                      onChange={(e) => setForm((prev) => ({ ...prev, priceTomans: e.target.value }))}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label htmlFor="pim-new-stock" style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>
                      موجودی اولیه:
                    </label>
                    <input
                      id="pim-new-stock"
                      required
                      type="number"
                      min={0}
                      step={1}
                      className="admin-input"
                      dir="ltr"
                      value={form.stock}
                      onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="pim-new-category" style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>
                      دسته‌بندی (متن آزاد):
                    </label>
                    <input
                      id="pim-new-category"
                      className="admin-input"
                      placeholder="مثال: ترمیم و التیام پوست"
                      value={form.categoryFa}
                      onChange={(e) => setForm((prev) => ({ ...prev, categoryFa: e.target.value }))}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label htmlFor="pim-new-status" style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>
                      وضعیت انتشار:
                    </label>
                    <select
                      id="pim-new-status"
                      className="admin-input"
                      value={form.status}
                      onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value === "PUBLISHED" ? "PUBLISHED" : "DRAFT" }))}
                    >
                      <option value="DRAFT">پیش‌نویس (غیرقابل مشاهده در ویترین)</option>
                      <option value="PUBLISHED">منتشرشده (نمایش در ویترین)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pim-new-kind" style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>
                      نوع محصول:
                    </label>
                    <select
                      id="pim-new-kind"
                      className="admin-input"
                      value={form.kind}
                      onChange={(e) => setForm((prev) => ({ ...prev, kind: e.target.value === "DIGITAL" ? "DIGITAL" : "PHYSICAL" }))}
                    >
                      <option value="PHYSICAL">فیزیکی (ارسال مرسولات)</option>
                      <option value="DIGITAL">دیجیتال (فایل و لایسنس)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="pim-new-image" style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>
                    تصویر شاخص (URL):
                  </label>
                  <input
                    id="pim-new-image"
                    className="admin-input"
                    dir="ltr"
                    placeholder="/assets/drdermer/2025/08/… یا https://…"
                    value={form.imageUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="pim-new-desc" style={{ fontSize: "0.82rem", fontWeight: 800, display: "block", marginBottom: "4px" }}>
                    توضیحات کوتاه بالینی:
                  </label>
                  <textarea
                    id="pim-new-desc"
                    rows={3}
                    className="admin-input"
                    placeholder="شرح کوتاه مکانیسم اثر و مزایای فرمولاسیون…"
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    id="pim-new-featured"
                    checked={form.isFeatured}
                    onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                    style={{ width: "18px", height: "18px" }}
                  />
                  <label htmlFor="pim-new-featured" style={{ fontSize: "0.85rem", fontWeight: 800, cursor: "pointer" }}>
                    نمایش به‌عنوان محصول ویژه ویترین
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn-reject">انصراف</button>
                  <button type="submit" className="btn-approve" style={{ padding: "10px 24px" }} disabled={submitting}>
                    {submitting ? "در حال ثبت…" : "ثبت محصول"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Batch JSON Import ── */}
      {showImportModal && (
        <div className="admin-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="admin-modal-card" style={{ background: "#FFFFFF", borderRadius: "16px", maxWidth: "640px", width: "100%", padding: "28px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900 }}>ورود دسته‌ای محصولات (JSON Import)</h3>
              <button type="button" onClick={() => setShowImportModal(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }} aria-label="بستن پنجره">✕</button>
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--muted)", margin: "0 0 14px", lineHeight: 1.7 }}>
              آرایه‌ای از محصولات را جای‌گذاری کنید. هر ردیف جداگانه به سرور ارسال می‌شود و نتیجه تک‌تک ردیف‌ها در
              گزارش پایین نمایش داده می‌شود؛ موفقیت جزئی هرگز به‌عنوان موفقیت کامل اعلام نمی‌شود. قیمت بر حسب تومان
              است (priceTomans) یا ریال (priceRials).
            </p>
            <form onSubmit={(e) => void handleBatchImport(e)}>
              <textarea
                required
                rows={8}
                className="admin-input"
                dir="ltr"
                style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
                placeholder={'[\n  {\n    "titleFa": "سرم ویتامین C پایدار ۲۰٪",\n    "titleEn": "Vitamin C 20% Serum",\n    "categoryFa": "ترمیم و التیام پوست",\n    "priceTomans": 1950000,\n    "stock": 60,\n    "status": "PUBLISHED"\n  }\n]'}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowImportModal(false)} className="btn-reject" disabled={importRunning}>انصراف</button>
                <button type="submit" className="btn-approve" style={{ padding: "10px 24px" }} disabled={importRunning}>
                  {importRunning ? "در حال واردسازی…" : "تأیید و واردسازی"}
                </button>
              </div>
            </form>

            {importReport.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: "0.9rem" }}>گزارش ردیف‌به‌ردیف واردسازی:</h4>
                <ul className="feedback-list" style={{ margin: 0, paddingLeft: "18px" }}>
                  {importReport.map((row, idx) => (
                    <li
                      key={`${row.label}-${idx}`}
                      style={{ color: row.ok ? "#047857" : "#B91C1C", fontSize: "0.82rem", lineHeight: 1.7 }}
                    >
                      {row.ok ? "✓" : "✕"} <strong>{row.label}</strong> — {row.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
