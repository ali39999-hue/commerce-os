"use client";

import "./loyalty.css";
import "../subscriptions/subscriptions.css";
import "./digital.css";
import "./account.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  formatJalaliDateTime,
  validateNationalId,
  toAsciiDigits,
} from "@commerce-os/localization";
import { formatToman } from "../../lib/catalog";
import { useCart } from "../../components/cart";
import { DigitalBadge } from "../../components/discovery/digital-badge";
import {
  User,
  ShoppingBag,
  Sparkles,
  Wallet,
  MapPin,
  Headphones,
  Award,
  RotateCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calendar,
  Clock,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  BadgeCheck,
  Activity,
  FileText,
  TrendingUp,
  Package,
  Truck,
  Snowflake,
  CreditCard,
  ShoppingCart,
  X,
} from "lucide-react";

interface OrderProductItem {
  id: string;
  title: string;
  subtitle?: string;
  quantity: number;
  priceTomans: string;
  image?: string;
  category?: string;
}

interface StoredOrder {
  orderNumber: string;
  status: string;
  totalTomans: string;
  method: string;
  ref: string;
  placedAt: string;
  customerName?: string;
  customerPhone?: string;
  nationalCode?: string | null;
  address?: string;
  shippingMethod?: string;
  deliverySlot?: string;
  trackingCode?: string;
  items?: OrderProductItem[];
}

interface Address {
  id: string;
  title: string;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  postalAddress: string;
  isDefault: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "OPEN" | "ANSWERED" | "CLOSED";
  createdAt: string;
}

interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  nationalCode: string;
  skinType: "DRY" | "OILY" | "COMBINATION" | "SENSITIVE" | "NORMAL";
  skinConcerns: string[];
}

interface SkincareRegimen {
  stepName: string;
  productTitle: string;
  frequency: string;
  instructions: string;
  timeOfDay: "MORNING" | "NIGHT" | "BOTH";
}

interface ConsultationBooking {
  id: string;
  specialistName: string;
  dateJalali: string;
  timeSlot: string;
  concern: string;
  status: "CONFIRMED" | "COMPLETED" | "PENDING";
  meetingLink?: string;
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: "کاربر گرامی",
  phone: "09120000000",
  email: "user@drdermer.local",
  nationalCode: "0010312013",
  skinType: "COMBINATION",
  skinConcerns: ["لک و تیرگی", "خشکی فصلی", "خطوط ریز دور چشم"],
};

const AVAILABLE_SKIN_CONCERNS = [
  "لک و تیرگی (هایپرپیگمنتیشن)",
  "خشکی فصلی و دهیدراتاسیون",
  "آکنه و منافذ باز",
  "حساسیت، التهاب و روزاسه",
  "خطوط ریز و افتادگی پوست",
  "تیرگی و پف دور چشم",
  "سد دفاعی آسیب‌دیده",
];

const DEMO_REGIMEN: SkincareRegimen[] = [
  {
    stepName: "مرحله ۱: لایروبی منافذ و سم‌زدایی",
    productTitle: "اسکراب دتوکس سیلیکالین Silicalene Mild Silica Scrub (ReeSkin)",
    frequency: "هفته‌ای ۲ تا ۳ بار",
    instructions:
      "روی پوست تمیز ماساژ ملایم دهید تا میکروسفرهای سیلیکا و کربن فعال آلودگی‌ها را جذب کنند.",
    timeOfDay: "BOTH",
  },
  {
    stepName: "مرحله ۲: کربوکسی‌تراپی و آزادسازی اکسیژن بافتی",
    productTitle: "ژل حرفه‌ای CarboxyGel و پادهای فعال‌ساز CarboxyPod",
    frequency: "هفته‌ای ۱ الی ۲ بار",
    instructions:
      "ژل را یکنواخت پخش کرده، پاد یا پد را قرار دهید تا اثر بوهر فعال شده و اکسیژن آزاد شود (۲۰ دقیقه).",
    timeOfDay: "NIGHT",
  },
  {
    stepName: "مرحله ۳: ترمیم سد دفاعی و تسکین اپیدرم",
    productTitle: "ژل تسکین‌بخش و ترمیم سد دفاعی هیلین Healene Soothing Gel",
    frequency: "روزانه و شب‌ها پس از کربوکسی",
    instructions:
      "حاوی ۵٪ دکسپانتنول و سنتلا آسیاتیکا؛ به آرامی روی صورت و گردن ماساژ دهید تا جذب کامل شود.",
    timeOfDay: "NIGHT",
  },
  {
    stepName: "مرحله ۴: میکرودرم و لایه‌برداری ابریشمی دوره‌ای",
    productTitle: "خمیر پولیش کریستالین Crystalene Polish Paste (Alumina Microcrystals)",
    frequency: "هفته‌ای ۱ بار به عنوان پیش‌درمان",
    instructions:
      "با نوک انگشتان مرطوب به مدت ۲ دقیقه با حرکات دورانی سایش دهید و با آب ولرم آبکشی نمایید.",
    timeOfDay: "NIGHT",
  },
];

const DEMO_CONSULTATIONS: ConsultationBooking[] = [
  {
    id: "cns_801",
    specialistName: "دکتر مریم شریفی (متخصص درماتولوژی بالینی)",
    dateJalali: "۱۴۰۵/۰۸/۱۵",
    timeSlot: "ساعت ۱۷:۳۰ الی ۱۸:۰۰",
    concern: "بررسی پروتکل درمان لک‌های پس از آکنه و تجویز CarboxyGel",
    status: "CONFIRMED",
    meetingLink: "https://meet.drdermer.ir/room/cns-801",
  },
  {
    id: "cns_740",
    specialistName: "دکتر کامران رحیمی (مشاور علمی دکتر درمر)",
    dateJalali: "۱۴۰۵/۰۷/۲۰",
    timeSlot: "ساعت ۱۱:۰۰ الی ۱۱:۳۰",
    concern: "تنظیم روتین پوست مختلط و پیشگیری از هایپرپیگمنتیشن",
    status: "COMPLETED",
  },
];

const ACCOUNT_PROFILE_KEY = "commerce_os.account.profile.v1";
const ACCOUNT_ORDERS_KEY = "commerce_os.account.orders.v1";
const ACCOUNT_ADDRESSES_KEY = "commerce_os.account.addresses.v1";
const ACCOUNT_TICKETS_KEY = "commerce_os.account.tickets.v1";

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "addr_demo_1",
    title: "منزل / مطب اصلی",
    receiverName: "رضا موحدی",
    phone: "09412791874",
    province: "تهران",
    city: "تهران",
    postalCode: "1458963214",
    postalAddress: "خیابان ولیعصر، بالاتر از میدان ونک، بن‌بست شریفی، پلاک ۱۲، واحد ۴",
    isDefault: true,
  },
];

const WALLET_TXS = [
  {
    id: "wtx_1",
    title: "شارژ آنلاین کیف پول از درگاه شتاب شاپرک",
    amount: +5_000_000,
    date: "۱۴۰۵/۰۸/۰۵",
    direction: "credit" as const,
  },
  {
    id: "wtx_2",
    title: "کشف پاداش رژیم پوستی باشگاه مشتریان",
    amount: +250_000,
    date: "۱۴۰۵/۰۸/۰۳",
    direction: "credit" as const,
  },
  {
    id: "wtx_3",
    title: "پرداخت سفارش محصولات بالینی ORD-948118",
    amount: -1_850_000,
    date: "۱۴۰۵/۰۷/۲۸",
    direction: "debit" as const,
  },
];

const DEMO_ORDERS: StoredOrder[] = [
  {
    orderNumber: "ORD-948102",
    status: "DELIVERED",
    totalTomans: "3200000",
    method: "درگاه سامان (شاپرک)",
    ref: "SEP-88213450",
    placedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    trackingCode: "POST-94810299IR",
    shippingMethod: "پست پیشتاز هوایی (زنجیره سرد)",
    address: "تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲، واحد ۴",
    customerName: "رضا موحدی",
    customerPhone: "09412791874",
    items: [
      {
        id: "prod_1",
        title: "ژل کربوکسی‌تراپی حرفه‌ای CarboxyGel (دوز ۴۵۰ میلی‌گرم مطب)",
        subtitle: "فرمولاسیون آزادسازی اکسیژن بافتی بر پایه اثر بوهر (Bohr Effect)",
        quantity: 1,
        priceTomans: "2400000",
        image: "/2-azel-170-hydrapod.webp",
        category: "محصولات مراقبت پوست",
      },
      {
        id: "prod_2",
        title: "پادهای فعال‌ساز CarboxyPod سوسپانسیون گاز CO2",
        subtitle: "میکروسفرهای کلسیم تارتارات و اسید سیتریک (بسته ۱۰ عددی)",
        quantity: 2,
        priceTomans: "400000",
        image: "/glycolic-170-carbo-pod.webp",
        category: "ملزومات مصرفی کربوکسی",
      },
    ],
  },
  {
    orderNumber: "ORD-948118",
    status: "SHIPPED",
    totalTomans: "1850000",
    method: "درگاه زرین‌پال (شاپرک)",
    ref: "ZRP-90345122",
    placedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    trackingCode: "TPX-84729103",
    shippingMethod: "تیپاکس اکسپرس (زنجیره سرد)",
    address: "تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲، واحد ۴",
    customerName: "رضا موحدی",
    customerPhone: "09412791874",
    items: [
      {
        id: "prod_3",
        title: "ژل ضدجوش و لایه‌بردار دیفرین Differin اصل",
        subtitle: "حاوی رتینوئید نسل سوم (آداپالن ۰.۱٪) درمان تخصصی آکنه و کومدون",
        quantity: 1,
        priceTomans: "590000",
        image: "/rupak-hero/prod-differin.jpg",
        category: "درموسوتیکال تخصصی",
      },
      {
        id: "prod_4",
        title: "ژل تسکین‌بخش و ترمیم سد دفاعی هیلین Healene Soothing Gel",
        subtitle: "حاوی ۵٪ دکسپانتنول، عصاره سنتلا آسیاتیکا و پپتیدهای بیومیمتیک",
        quantity: 1,
        priceTomans: "1260000",
        image: "/rupak-hero/prod-cicalfate.jpg",
        category: "ترمیم‌کننده و ضدالتهاب",
      },
    ],
  },
];

function getOrderStepInfo(status: string): { activeIndex: number; percent: number } {
  switch (status) {
    case "DELIVERED":
      return { activeIndex: 4, percent: 100 };
    case "SHIPPED":
      return { activeIndex: 3, percent: 66 };
    case "PROCESSING":
    case "PAID":
      return { activeIndex: 2, percent: 33 };
    default:
      return { activeIndex: 1, percent: 0 };
  }
}

function statusFa(status: string): { label: string; cls: string } {
  switch (status) {
    case "PAID":
      return { label: "پرداخت‌شده — تخصیص انبار", cls: "account-status-delivered" };
    case "PROCESSING":
      return { label: "در حال بسته‌بندی در انبار مرکزی", cls: "account-status-processing" };
    case "SHIPPED":
      return { label: "ارسال‌شده با بارنامه رسمی", cls: "account-status-shipped" };
    case "DELIVERED":
      return { label: "تحویل قطعی به مشتری", cls: "account-status-delivered" };
    case "PENDING_REVIEW":
      return { label: "در انتظار بررسی حواله بانکی", cls: "account-status-processing" };
    case "PENDING_PAYMENT":
      return { label: "در انتظار اتصال به درگاه", cls: "account-status-processing" };
    case "REFUNDED":
      return { label: "مسترد شده به کیف پول", cls: "account-status-cancelled" };
    case "CANCELLED":
      return { label: "لغو شده", cls: "account-status-cancelled" };
    default:
      return { label: status, cls: "" };
  }
}

function MenuToggleBarsIcon({ size = 22, color = "#2563eb" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="account-sidebar-toggle-svg"
      aria-hidden="true"
    >
      <line x1="4" y1="8" x2="20" y2="8" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
      <line x1="4" y1="16" x2="20" y2="16" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const cart = useCart();
  const [tab, setTab] = useState<
    "profile" | "orders" | "wallet" | "regimen" | "addresses" | "tickets" | "loyalty" | "cart"
  >("profile");

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("commerce_os.account.sidebarCollapsed");
      if (saved !== null) {
        setIsSidebarCollapsed(saved === "true");
      }
    } catch {}
  }, []);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("commerce_os.account.sidebarCollapsed", String(next));
      } catch {}
      return next;
    });
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    }
  };

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<{
    id: string;
    phone: string;
    email: string | null;
    fullName: string;
    role: string;
    username?: string;
  } | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    phone: "",
    email: "",
    nationalCode: "",
    skinType: "COMBINATION",
    skinConcerns: ["لک و تیرگی", "خشکی فصلی"],
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", message: "" });
  const [newConsultationConcern, setNewConsultationConcern] = useState("");
  const [consultations, setConsultations] = useState<ConsultationBooking[]>([]);
  const [copiedTrackingCode, setCopiedTrackingCode] = useState<string | null>(null);

  const loadStoredOrders = () => {
    try {
      const lastCheckout = localStorage.getItem("commerce_os.checkout.lastOrder");
      const o = JSON.parse(localStorage.getItem(ACCOUNT_ORDERS_KEY) ?? "null") || [];
      let all = [...o];
      if (lastCheckout) {
        const lo = JSON.parse(lastCheckout);
        all = [{ ...lo }, ...all.filter((x: StoredOrder) => x.orderNumber !== lo.orderNumber)];
      }
      if (all.length === 0) {
        all = DEMO_ORDERS;
      }
      setOrders(all);
    } catch {}
  };

  const handleTabChange = (nextTab: typeof tab) => {
    setTab(nextTab);
    setIsMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", nextTab);
      window.history.replaceState({}, "", url.toString());
      if (nextTab === "orders") {
        loadStoredOrders();
      }
    }
  };

  useEffect(() => {
    // 1. Check URL search param (?tab=...) on initial mount & handle browser history popstate
    const params = new URLSearchParams(window.location.search);
    const qTab = params.get("tab");
    if (
      qTab &&
      ["profile", "orders", "wallet", "regimen", "addresses", "tickets", "loyalty", "cart"].includes(qTab)
    ) {
      setTab(qTab as any);
    }

    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const curTab = currentParams.get("tab");
      if (
        curTab &&
        ["profile", "orders", "wallet", "regimen", "addresses", "tickets", "loyalty", "cart"].includes(curTab)
      ) {
        setTab(curTab as any);
      }
    };
    window.addEventListener("popstate", handlePopState);

    // 2. Real-time Order synchronization when purchases are completed
    const handleOrderSync = () => {
      loadStoredOrders();
    };
    window.addEventListener("commerce_os:order_placed", handleOrderSync);
    window.addEventListener("storage", handleOrderSync);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("commerce_os:order_placed", handleOrderSync);
      window.removeEventListener("storage", handleOrderSync);
    };
  }, []);

  useEffect(() => {
    async function verifyAuth() {
      try {
        const token = localStorage.getItem("commerce_os.auth.token");
        const rawUser = localStorage.getItem("commerce_os.auth.user");

        if (!token && !rawUser) {
          setIsAuthenticated(false);
          setCheckingAuth(false);
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setIsAuthenticated(true);
            setAuthenticatedUser(data.user);

            // Load saved profile or initialize from user session
            const savedProfile = localStorage.getItem(ACCOUNT_PROFILE_KEY);
            if (savedProfile) {
              try {
                const parsed = JSON.parse(savedProfile);
                setProfile({
                  fullName: data.user.fullName || parsed.fullName || "",
                  phone: data.user.phone || parsed.phone || "",
                  email: data.user.email || parsed.email || "",
                  nationalCode: parsed.nationalCode || "",
                  skinType: parsed.skinType || "COMBINATION",
                  skinConcerns: parsed.skinConcerns || ["لک و تیرگی", "خشکی فصلی"],
                });
              } catch {
                setProfile({
                  fullName: data.user.fullName || "",
                  phone: data.user.phone || "",
                  email: data.user.email || "",
                  nationalCode: "",
                  skinType: "COMBINATION",
                  skinConcerns: ["لک و تیرگی", "خشکی فصلی"],
                });
              }
            } else {
              setProfile({
                fullName: data.user.fullName || "",
                phone: data.user.phone || "",
                email: data.user.email || "",
                nationalCode: "",
                skinType: "COMBINATION",
                skinConcerns: ["لک و تیرگی", "خشکی فصلی"],
              });
            }

            loadStoredOrders();

            const savedAddrs = JSON.parse(localStorage.getItem(ACCOUNT_ADDRESSES_KEY) ?? "null");
            setAddresses(savedAddrs && savedAddrs.length > 0 ? savedAddrs : DEFAULT_ADDRESSES);

            const savedTkts = JSON.parse(localStorage.getItem(ACCOUNT_TICKETS_KEY) ?? "null");
            setTickets(savedTkts ?? []);
            setConsultations(DEMO_CONSULTATIONS);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          localStorage.removeItem("commerce_os.auth.token");
          localStorage.removeItem("commerce_os.auth.user");
          window.dispatchEvent(new Event("commerce_os:auth_change"));
          setIsAuthenticated(false);
        }
      } catch {
        const rawUser = localStorage.getItem("commerce_os.auth.user");
        if (rawUser) {
          const u = JSON.parse(rawUser);
          setIsAuthenticated(true);
          setAuthenticatedUser(u);
          setProfile((prev) => ({
            ...prev,
            fullName: u.fullName || prev.fullName,
            phone: u.phone || prev.phone,
            email: u.email || prev.email,
          }));
          loadStoredOrders();
          setAddresses(DEFAULT_ADDRESSES);
          setConsultations(DEMO_CONSULTATIONS);
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        setCheckingAuth(false);
      }
    }

    verifyAuth();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    const cleanNational = toAsciiDigits(profile.nationalCode);
    if (!validateNationalId(cleanNational)) {
      setProfileError("کد ملی وارد شده با الگوریتم کنترلی ممیزی ۱۱ ثبت احوال معتبر نمی‌باشد.");
      return;
    }

    try {
      localStorage.setItem(
        ACCOUNT_PROFILE_KEY,
        JSON.stringify({ ...profile, nationalCode: cleanNational })
      );
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      // storage error
    }
  };

  const toggleSkinConcern = (concern: string) => {
    setProfile((prev) => {
      const exists = prev.skinConcerns.includes(concern);
      const next = exists
        ? prev.skinConcerns.filter((c) => c !== concern)
        : [...prev.skinConcerns, concern];
      return { ...prev, skinConcerns: next };
    });
  };

  const persistAddresses = (next: Address[]) => {
    setAddresses(next);
    try {
      localStorage.setItem(ACCOUNT_ADDRESSES_KEY, JSON.stringify(next));
    } catch {}
  };

  const setDefaultAddress = (addrId: string) => {
    const updated = addresses.map((x) => ({
      ...x,
      isDefault: x.id === addrId,
    }));
    persistAddresses(updated);
    try {
      localStorage.setItem("commerce_os.checkout.selectedAddressId", addrId);
      window.dispatchEvent(new Event("commerce_os:address_selected"));
    } catch {}
  };

  const deleteAddress = (addrId: string) => {
    const remaining = addresses.filter((x) => x.id !== addrId);
    if (remaining.length > 0 && !remaining.some((x) => x.isDefault)) {
      remaining[0].isDefault = true;
      try {
        localStorage.setItem("commerce_os.checkout.selectedAddressId", remaining[0].id);
      } catch {}
    } else if (remaining.length === 0) {
      try {
        localStorage.removeItem("commerce_os.checkout.selectedAddressId");
      } catch {}
    }
    persistAddresses(remaining);
    try {
      window.dispatchEvent(new Event("commerce_os:address_selected"));
    } catch {}
  };

  const addAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const isFirst = addresses.length === 0;
    const addr: Address = {
      id: `addr_${Date.now()}`,
      title: String(f.get("title") || "آدرس جدید"),
      receiverName: String(f.get("receiverName") || profile.fullName),
      phone: String(f.get("phone") || profile.phone),
      province: String(f.get("province") || "تهران"),
      city: String(f.get("city") || "تهران"),
      postalCode: String(f.get("postalCode") || ""),
      postalAddress: String(f.get("postalAddress") || ""),
      isDefault: isFirst,
    };
    const nextAddresses = [addr, ...addresses];
    persistAddresses(nextAddresses);
    if (isFirst) {
      try {
        localStorage.setItem("commerce_os.checkout.selectedAddressId", addr.id);
        window.dispatchEvent(new Event("commerce_os:address_selected"));
      } catch {}
    }
    setShowAddrForm(false);
  };

  const submitTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTicket.subject.trim()) return;
    const t: Ticket = {
      id: `tkt_${Date.now()}`,
      subject: newTicket.subject,
      message: newTicket.message,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };
    const next = [t, ...tickets];
    setTickets(next);
    try {
      localStorage.setItem(ACCOUNT_TICKETS_KEY, JSON.stringify(next));
    } catch {}
    setNewTicket({ subject: "", message: "" });
  };

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConsultationConcern.trim()) return;
    const newBook: ConsultationBooking = {
      id: `cns_${Date.now().toString().slice(-4)}`,
      specialistName: "دکتر مریم شریفی (درماتولوژی بالینی)",
      dateJalali: "۱۴۰۵/۰۸/۲۲",
      timeSlot: "ساعت ۱۸:۰۰ الی ۱۸:۳۰",
      concern: newConsultationConcern,
      status: "PENDING",
      meetingLink: "https://meet.drdermer.ir/room/cns-new",
    };
    setConsultations([newBook, ...consultations]);
    setNewConsultationConcern("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedTrackingCode(text);
    setTimeout(() => setCopiedTrackingCode(null), 2000);
  };

  const handleLogout = async () => {
    if (typeof window !== "undefined" && window.confirm("آیا مایل به خروج از حساب کاربری هستید؟")) {
      try {
        const token = localStorage.getItem("commerce_os.auth.token");
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      } catch {
        // ignore
      }
      localStorage.removeItem("commerce_os.auth.token");
      localStorage.removeItem("commerce_os.auth.user");
      window.dispatchEvent(new Event("commerce_os:auth_change"));
      window.location.href = "/login";
    }
  };

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          direction: "rtl",
        }}
      >
        <div style={{ textAlign: "center", color: "#1e293b" }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: "3px solid #e2e8f0",
              borderTopColor: "#77B091",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ fontWeight: 700, fontSize: "14px" }}>
            در حال بارگذاری پنل کاربری دکتر درمر...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <section
        className="account-page-root"
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "460px",
            width: "100%",
            background: "#ffffff",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            padding: "40px 32px",
            boxShadow: "0 10px 35px -5px rgba(0, 0, 0, 0.06)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "rgba(119, 176, 145, 0.15)",
              color: "#274b24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <ShieldCheck size={36} />
          </div>
          <h1
            style={{
              fontSize: "21px",
              fontWeight: "900",
              color: "#0f172a",
              marginBottom: "10px",
            }}
          >
            ورود به پنل کاربری الزامی است
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "#64748b",
              lineHeight: "1.7",
              marginBottom: "28px",
            }}
          >
            جهت حفظ محرمانگی داده‌های بالینی، دسترسی به پرونده درماتولوژی، سوابق رهگیری پستی و
            فاکتور رسمی، لطفاً به حساب کاربری خود وارد شوید.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link
              href="/login?redirectTo=/account"
              className="account-btn-primary"
              style={{ width: "100%", textDecoration: "none" }}
            >
              ورود با رمز عبور یا پیامک
            </Link>
            <Link
              href="/register?redirectTo=/account"
              className="account-btn-secondary"
              style={{ width: "100%", textDecoration: "none" }}
            >
              ایجاد حساب کاربری جدید
            </Link>
          </div>
          <div style={{ marginTop: "24px" }}>
            <Link
              href="/"
              style={{
                fontSize: "12.5px",
                color: "#64748b",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>بازگشت به صفحه اصلی فروشگاه</span>
              <ChevronLeft size={14} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const activeTabName = {
    profile: "پروفایل و احراز هویت",
    orders: "سوابق سفارش‌ها و رهگیری",
    regimen: "رژیم پوستی و مشاوره‌ها",
    wallet: "کیف پول و اعتبار",
    addresses: "آدرس‌های تحویل",
    tickets: "تیکت‌های پشتیبانی",
    loyalty: "باشگاه مشتریان و امتیازات",
    cart: "سبد خرید و نسخه جاری",
  }[tab];

  return (
    <div className="account-page-root">
      <div className="account-container">
        {/* Top Header Bar: Breadcrumb + Back Button */}
        <div className="account-top-bar">
          <nav className="account-breadcrumb" aria-label="موقعیت فعلی">
            <Link href="/">خانه</Link>
            <span className="account-breadcrumb-sep">/</span>
            <Link href="/account">حساب کاربری</Link>
            <span className="account-breadcrumb-sep">/</span>
            <span className="account-breadcrumb-current">{activeTabName}</span>
          </nav>

          <button
            type="button"
            onClick={handleGoBack}
            className="account-back-btn"
            title="بازگشت به فروشگاه یا صفحه قبل"
            aria-label="بازگشت به صفحه قبل"
          >
            <ArrowRight size={16} />
            <span>بازگشت به فروشگاه</span>
          </button>
        </div>

        {/* Hero Profile Overview Banner Card */}
        <header className="account-profile-banner">
          <div className="account-banner-content">
            <div className="account-user-bio">
              <div className="account-avatar-large">
                {profile.fullName ? profile.fullName.trim().charAt(0) : "د"}
                <div className="account-avatar-badge" title="هویت تأیید شده">
                  <Check size={12} strokeWidth={3} />
                </div>
              </div>
              <div className="account-user-info">
                <div className="account-user-name-row">
                  <h1 className="account-user-name">
                    {profile.fullName || "کاربر تخصصی دکتر درمر"}
                  </h1>
                  <span className="account-tier-badge">
                    <BadgeCheck size={14} />
                    عضو رسمی باشگاه سلامت
                  </span>
                </div>
                <div className="account-user-contact">
                  <span className="account-contact-item" dir="ltr">
                    <Phone size={13} />
                    {profile.phone}
                  </span>
                  <span className="account-contact-item">
                    <ShieldCheck size={13} />
                    {profile.nationalCode ? "کد ملی ثبت شده" : "احراز هویت پایه"}
                  </span>
                  {profile.email && (
                    <span
                      className="account-contact-item account-contact-email"
                      dir="ltr"
                      title={profile.email}
                    >
                      <Mail size={13} />
                      {profile.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Pills */}
            <div className="account-banner-stats">
              <div
                className="account-stat-pill"
                onClick={() => handleTabChange("cart")}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
              >
                <span className="account-stat-label">
                  <ShoppingCart size={13} />
                  سبد خرید
                </span>
                <span className="account-stat-value">
                  {cart.itemCount > 0
                    ? `${cart.itemCount.toLocaleString("fa-IR")} کالا`
                    : "سبد خالی"}
                </span>
              </div>
              <div
                className="account-stat-pill"
                onClick={() => handleTabChange("wallet")}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
              >
                <span className="account-stat-label">
                  <Wallet size={13} />
                  موجودی کیف پول
                </span>
                <span className="account-stat-value">۳,۴۰۰,۰۰۰ تومان</span>
              </div>
              <div
                className="account-stat-pill"
                onClick={() => handleTabChange("orders")}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
              >
                <span className="account-stat-label">
                  <ShoppingBag size={13} />
                  سفارش‌ها
                </span>
                <span className="account-stat-value">
                  {orders.length.toLocaleString("fa-IR")} مرسوله
                </span>
              </div>
              <div
                className="account-stat-pill"
                onClick={() => handleTabChange("loyalty")}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
              >
                <span className="account-stat-label">
                  <Award size={13} />
                  باشگاه مشتریان
                </span>
                <span className="account-stat-value">نقره‌ای (۶۸۰ امتیاز)</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Horizontal Navigation Rail */}
        <div className="account-mobile-nav">
          <button
            onClick={() => handleTabChange("cart")}
            className={`account-mobile-nav-btn ${tab === "cart" ? "active" : ""}`}
          >
            <ShoppingCart size={15} />
            سبد خرید ({cart.itemCount})
          </button>
          <button
            onClick={() => handleTabChange("profile")}
            className={`account-mobile-nav-btn ${tab === "profile" ? "active" : ""}`}
          >
            <User size={15} />
            پروفایل و هویت
          </button>
          <button
            onClick={() => handleTabChange("orders")}
            className={`account-mobile-nav-btn ${tab === "orders" ? "active" : ""}`}
          >
            <ShoppingBag size={15} />
            سفارش‌ها ({orders.length})
          </button>
          <button
            onClick={() => handleTabChange("regimen")}
            className={`account-mobile-nav-btn ${tab === "regimen" ? "active" : ""}`}
          >
            <Sparkles size={15} />
            رژیم پوستی
          </button>
          <button
            onClick={() => handleTabChange("wallet")}
            className={`account-mobile-nav-btn ${tab === "wallet" ? "active" : ""}`}
          >
            <Wallet size={15} />
            کیف پول
          </button>
          <button
            onClick={() => handleTabChange("addresses")}
            className={`account-mobile-nav-btn ${tab === "addresses" ? "active" : ""}`}
          >
            <MapPin size={15} />
            آدرس‌ها
          </button>
          <button
            onClick={() => handleTabChange("tickets")}
            className={`account-mobile-nav-btn ${tab === "tickets" ? "active" : ""}`}
          >
            <Headphones size={15} />
            پشتیبانی
          </button>
          <button
            onClick={() => handleTabChange("loyalty")}
            className={`account-mobile-nav-btn ${tab === "loyalty" ? "active" : ""}`}
          >
            <Award size={15} />
            امتیازات
          </button>
        </div>

        {/* Main Grid: Sidebar + Pane */}
        <div className={`account-main-grid ${isSidebarCollapsed ? "collapsed" : ""}`}>
          {/* Sidenav Card */}
          <aside className={`account-sidebar-card ${isSidebarCollapsed ? "collapsed" : "expanded"}`}>
            <div className="account-sidebar-top-bar">
              {!isSidebarCollapsed && (
                <span className="account-nav-group-title">مدیریت حساب و پرونده</span>
              )}
              <button
                type="button"
                onClick={toggleSidebarCollapse}
                className="account-sidebar-toggle-btn"
                title={isSidebarCollapsed ? "باز کردن منو" : "جمع‌کردن منو"}
                aria-label={isSidebarCollapsed ? "باز کردن منو" : "جمع‌کردن منو"}
              >
                <MenuToggleBarsIcon size={isSidebarCollapsed ? 22 : 19} color="#2563eb" />
              </button>
            </div>

            <button
              onClick={() => handleTabChange("cart")}
              className={`account-nav-link ${tab === "cart" ? "active" : ""}`}
              data-tooltip="سبد خرید و نسخه جاری"
              title="سبد خرید و نسخه جاری"
            >
              <div className="account-nav-content">
                <div
                  className="account-nav-icon-wrap"
                  style={tab === "cart" && !isSidebarCollapsed ? { background: "#0284c7", color: "#ffffff" } : {}}
                >
                  <ShoppingCart size={17} />
                </div>
                <span className="account-nav-label">سبد خرید و نسخه جاری</span>
              </div>
              <span
                className={`account-nav-badge ${cart.itemCount === 0 && isSidebarCollapsed ? "hidden-zero" : ""}`}
                style={
                  cart.itemCount > 0
                    ? { backgroundColor: "#0284c7", color: "#ffffff", fontWeight: 800 }
                    : {}
                }
              >
                {cart.itemCount}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("profile")}
              className={`account-nav-link ${tab === "profile" ? "active" : ""}`}
              data-tooltip="پروفایل و کد ملی"
              title="پروفایل و کد ملی"
            >
              <div className="account-nav-content">
                <div className="account-nav-icon-wrap">
                  <User size={17} />
                </div>
                <span className="account-nav-label">پروفایل و کد ملی</span>
              </div>
              <ChevronLeft size={16} className="account-nav-chevron text-slate-400" />
            </button>

            <button
              onClick={() => handleTabChange("orders")}
              className={`account-nav-link ${tab === "orders" ? "active" : ""}`}
              data-tooltip="سفارش‌ها و رهگیری"
              title="سفارش‌ها و رهگیری"
            >
              <div className="account-nav-content">
                <div className="account-nav-icon-wrap">
                  <ShoppingBag size={17} />
                </div>
                <span className="account-nav-label">سفارش‌ها و رهگیری</span>
              </div>
              <span className={`account-nav-badge ${orders.length === 0 && isSidebarCollapsed ? "hidden-zero" : ""}`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("regimen")}
              className={`account-nav-link ${tab === "regimen" ? "active" : ""}`}
              data-tooltip="رژیم پوستی و ویزیت"
              title="رژیم پوستی و ویزیت"
            >
              <div className="account-nav-content">
                <div className="account-nav-icon-wrap">
                  <Sparkles size={17} />
                </div>
                <span className="account-nav-label">رژیم پوستی و ویزیت</span>
              </div>
              <ChevronLeft size={16} className="account-nav-chevron text-slate-400" />
            </button>

            <button
              onClick={() => handleTabChange("wallet")}
              className={`account-nav-link ${tab === "wallet" ? "active" : ""}`}
              data-tooltip="کیف پول و اعتبار مالی"
              title="کیف پول و اعتبار مالی"
            >
              <div className="account-nav-content">
                <div className="account-nav-icon-wrap">
                  <Wallet size={17} />
                </div>
                <span className="account-nav-label">کیف پول و اعتبار مالی</span>
              </div>
              <ChevronLeft size={16} className="account-nav-chevron text-slate-400" />
            </button>

            <button
              onClick={() => handleTabChange("addresses")}
              className={`account-nav-link ${tab === "addresses" ? "active" : ""}`}
              data-tooltip="آدرس‌های ذخیره‌شده"
              title="آدرس‌های ذخیره‌شده"
            >
              <div className="account-nav-content">
                <div className="account-nav-icon-wrap">
                  <MapPin size={17} />
                </div>
                <span className="account-nav-label">آدرس‌های ذخیره‌شده</span>
              </div>
              <span className={`account-nav-badge ${addresses.length === 0 && isSidebarCollapsed ? "hidden-zero" : ""}`}>
                {addresses.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("tickets")}
              className={`account-nav-link ${tab === "tickets" ? "active" : ""}`}
              data-tooltip="تیکت‌های مشاوره و پشتیبانی"
              title="تیکت‌های مشاوره و پشتیبانی"
            >
              <div className="account-nav-content">
                <div className="account-nav-icon-wrap">
                  <Headphones size={17} />
                </div>
                <span className="account-nav-label">تیکت‌های مشاوره و پشتیبانی</span>
              </div>
              <span className={`account-nav-badge ${tickets.length === 0 && isSidebarCollapsed ? "hidden-zero" : ""}`}>
                {tickets.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("loyalty")}
              className={`account-nav-link ${tab === "loyalty" ? "active" : ""}`}
              data-tooltip="باشگاه مشتریان و امتیازات"
              title="باشگاه مشتریان و امتیازات"
            >
              <div className="account-nav-content">
                <div className="account-nav-icon-wrap">
                  <Award size={17} />
                </div>
                <span className="account-nav-label">باشگاه مشتریان و امتیازات</span>
              </div>
              <ChevronLeft size={16} className="account-nav-chevron text-slate-400" />
            </button>

            <div className="account-nav-divider" />

            <Link
              href="/subscriptions"
              className="account-nav-link"
              data-tooltip="اشتراک‌های دوره‌ای ملزومات"
              title="اشتراک‌های دوره‌ای ملزومات"
            >
              <div className="account-nav-content">
                <div className="account-nav-icon-wrap">
                  <RotateCw size={17} />
                </div>
                <span className="account-nav-label">اشتراک‌های دوره‌ای ملزومات</span>
              </div>
              <ChevronLeft size={16} className="account-nav-chevron text-slate-400" />
            </Link>

            <button
              type="button"
              onClick={handleGoBack}
              className="account-nav-link"
              style={{ color: "#334155" }}
              data-tooltip="بازگشت به فروشگاه"
              title="بازگشت به فروشگاه"
            >
              <div className="account-nav-content">
                <div
                  className="account-nav-icon-wrap"
                  style={{ background: "#f1f5f9", color: "#334155" }}
                >
                  <ArrowRight size={17} />
                </div>
                <span className="account-nav-label">بازگشت به فروشگاه</span>
              </div>
              <ChevronLeft size={16} className="account-nav-chevron text-slate-400" />
            </button>

            <button
              onClick={handleLogout}
              className="account-nav-link account-nav-logout"
              data-tooltip="خروج از حساب کاربری"
              title="خروج از حساب کاربری"
            >
              <div className="account-nav-content">
                <div className="account-nav-icon-wrap">
                  <LogOut size={17} />
                </div>
                <span className="account-nav-label">خروج از حساب کاربری</span>
              </div>
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="account-content-pane">
            {/* TAB 1: Profile & National Code */}
            {tab === "profile" && (
              <div>
                <div className="account-pane-header">
                  <div className="account-pane-title-group">
                    <div className="account-pane-icon-badge">
                      <User size={22} />
                    </div>
                    <div>
                      <h2 className="account-pane-heading">پروفایل کاربری و احراز هویت شاهکار</h2>
                      <p className="account-pane-subtitle">
                        ثبت مشخصات شناسنامه‌ای و کد ملی جهت تطبیق با سامانه شاهکار و صدور فاکتور
                        رسمی مالیاتی
                      </p>
                    </div>
                  </div>
                  <div className="account-trust-chip">
                    <ShieldCheck size={16} />
                    <span>استعلام آنلاین شاهکار</span>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile}>
                  <div className="account-form-grid">
                    <div className="account-form-field">
                      <label className="account-field-label">
                        <span>
                          نام و نام خانوادگی کامل
                          <span className="required-star">*</span>
                        </span>
                      </label>
                      <div className="account-input-wrapper">
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                          required
                          placeholder="مثال: سارا محمدی"
                          className="account-input"
                        />
                        <div className="account-input-icon">
                          <User size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="account-form-field">
                      <label className="account-field-label">
                        <span>
                          شماره تلفن همراه (تطبیق با شاهکار)
                          <span className="required-star">*</span>
                        </span>
                        <span className="account-field-hint">جهت ارسال پیامک رهگیری</span>
                      </label>
                      <div className="account-input-wrapper">
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          dir="ltr"
                          required
                          placeholder="0912xxxxxxx"
                          className="account-input"
                        />
                        <div className="account-input-icon-ltr">
                          <Phone size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="account-form-field">
                      <label className="account-field-label">
                        <span>
                          کد ملی ۱۰ رقمی (تطبیق با ممیزی ۱۱)
                          <span className="required-star">*</span>
                        </span>
                        <span className="account-field-hint">بدون خط تیره</span>
                      </label>
                      <div className="account-input-wrapper">
                        <input
                          type="text"
                          value={profile.nationalCode}
                          onChange={(e) => setProfile({ ...profile, nationalCode: e.target.value })}
                          dir="ltr"
                          maxLength={10}
                          required
                          placeholder="0010312013"
                          className="account-input"
                        />
                        <div className="account-input-icon-ltr">
                          <ShieldCheck size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="account-form-field">
                      <label className="account-field-label">
                        <span>پست الکترونیک (ایمیل)</span>
                        <span className="account-field-hint">اختیاری</span>
                      </label>
                      <div className="account-input-wrapper">
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          dir="ltr"
                          placeholder="name@example.com"
                          className="account-input"
                        />
                        <div className="account-input-icon-ltr">
                          <Mail size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="account-form-field full-width">
                      <label className="account-field-label">
                        <span>تیپ پوستی بالینی (جهت تنظیم دوز رژیم درمانی)</span>
                      </label>
                      <select
                        value={profile.skinType}
                        onChange={(e) =>
                          setProfile({ ...profile, skinType: e.target.value as any })
                        }
                        className="account-input account-select"
                      >
                        <option value="COMBINATION">
                          پوست مختلط (Combination Skin) — تیپ رایج، چربی در T-Zone و خشکی گونه‌ها
                        </option>
                        <option value="DRY">
                          پوست خشک و کم‌آب (Dry / Dehydrated) — مستعد کشیدگی، خارش و خطوط اولیه
                        </option>
                        <option value="OILY">
                          پوست چرب و مستعد آکنه (Oily / Acne-prone) — ترشح سبوم بالا و منافذ باز
                        </option>
                        <option value="SENSITIVE">
                          پوست حساس و روزاسه (Sensitive / Rosacea) — سد دفاعی نازک و التهاب‌پذیر
                        </option>
                        <option value="NORMAL">
                          پوست نرمال و متوازن (Normal Balanced Skin)
                        </option>
                      </select>
                    </div>

                    {/* Interactive Skin Concerns */}
                    <div className="account-form-field full-width">
                      <label className="account-field-label">
                        <span>دغدغه‌ها و نیازهای پوستی شما (چند انتخابی)</span>
                        <span className="account-field-hint">روی گزینه‌ها کلیک نمایید</span>
                      </label>
                      <div className="account-concerns-box">
                        <div className="account-concerns-chips">
                          {AVAILABLE_SKIN_CONCERNS.map((concern) => {
                            const isSelected = profile.skinConcerns.includes(concern);
                            return (
                              <button
                                key={concern}
                                type="button"
                                onClick={() => toggleSkinConcern(concern)}
                                className={`account-concern-chip ${isSelected ? "selected" : ""}`}
                              >
                                {isSelected ? <Check size={14} /> : <Plus size={14} />}
                                <span>{concern}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {profileError && (
                    <div className="account-alert account-alert-error">
                      <AlertCircle size={20} />
                      <span>{profileError}</span>
                    </div>
                  )}

                  {profileSaved && (
                    <div className="account-alert account-alert-success">
                      <CheckCircle2 size={20} />
                      <span>تغییرات با موفقیت در پایگاه داده ثبت شد. فاکتورهای رسمی با این مشخصات صادر خواهند شد.</span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    <button type="submit" className="account-btn-primary">
                      <Check size={18} />
                      ذخیره تغییرات پروفایل
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: Orders with Live Tracking */}
            {tab === "orders" && (
              <div>
                <div className="account-pane-header">
                  <div className="account-pane-title-group">
                    <div className="account-pane-icon-badge">
                      <ShoppingBag size={22} />
                    </div>
                    <div>
                      <h2 className="account-pane-heading">
                        سفارش‌های من و رهگیری لحظه‌ای مرسولات ({orders.length})
                      </h2>
                      <p className="account-pane-subtitle">
                        سوابق خریدهای رسمی با فاکتور معتبر و رهگیری زنده سامانه پستی و تیپاکس
                      </p>
                    </div>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="account-empty-state">
                    <div className="account-empty-icon">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="account-empty-title">هنوز سفارشی ثبت نکرده‌اید</h3>
                    <p className="account-empty-desc">
                      محصولات مراقبت پوست تخصصی دکتر درمر را بررسی کرده و اولین سفارش خود را ثبت نمایید.
                    </p>
                    <Link href="/" className="account-btn-primary" style={{ textDecoration: "none" }}>
                      مشاهده کاتالوگ محصولات
                    </Link>
                  </div>
                ) : (
                  <div>
                    {orders.map((o) => {
                      const s = statusFa(o.status);
                      const trackingCode =
                        o.trackingCode || `POST-${o.orderNumber.replace(/\D/g, "").slice(0, 8)}IR`;
                      const isCopied = copiedTrackingCode === trackingCode;
                      const stepper = getOrderStepInfo(o.status);
                      const items: OrderProductItem[] =
                        o.items && o.items.length > 0
                          ? o.items
                          : [
                              {
                                id: "default_item",
                                title: "پک محصولات مراقبت بالینی پوست دکتر درمر",
                                subtitle: "فرمولاسیون تخصصی درموسوتیکال و نوسازی سلولی با اثر بوهر",
                                quantity: 1,
                                priceTomans: o.totalTomans,
                                image: "/2-azel-170-hydrapod.webp",
                                category: "مراقبت پوست و درماتولوژی",
                              },
                            ];

                      return (
                        <div key={o.orderNumber} className="account-order-card">
                          {/* 1. Header Bar */}
                          <div className="account-order-top-bar">
                            <div className="account-order-meta-group">
                              <Link
                                href={`/order/${o.orderNumber}`}
                                className="account-order-code-badge"
                                dir="ltr"
                                title="مشاهده فاکتور این سفارش"
                              >
                                <span>{o.orderNumber}</span>
                              </Link>
                              <span className="account-order-meta-pill">
                                <Calendar size={13} />
                                <span>
                                  {new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }).format(new Date(o.placedAt))}
                                </span>
                              </span>
                              <span className="account-order-meta-pill">
                                <Truck size={13} />
                                <span>{o.shippingMethod || "پست پیشتاز"}</span>
                              </span>
                            </div>

                            <span className={`account-status-badge ${s.cls}`}>
                              <span className="account-status-dot" />
                              <span>{s.label}</span>
                            </span>
                          </div>

                          {/* 2. Visual Delivery Stepper */}
                          <div className="account-order-stepper">
                            <div className="account-stepper-track">
                              <div className="account-stepper-bar-bg">
                                <div
                                  className="account-stepper-bar-fill"
                                  style={{ width: `${stepper.percent}%` }}
                                />
                              </div>

                              <div
                                className={`account-stepper-item ${
                                  stepper.activeIndex >= 1 ? "completed" : ""
                                }`}
                              >
                                <div className="account-stepper-circle">
                                  <Check size={14} />
                                </div>
                                <span className="account-stepper-label">ثبت سفارش</span>
                              </div>

                              <div
                                className={`account-stepper-item ${
                                  stepper.activeIndex >= 2
                                    ? "completed"
                                    : stepper.activeIndex === 1
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <div className="account-stepper-circle">
                                  {stepper.activeIndex >= 2 ? <Check size={14} /> : "۲"}
                                </div>
                                <span className="account-stepper-label">تأیید پرداخت شاپرک</span>
                              </div>

                              <div
                                className={`account-stepper-item ${
                                  stepper.activeIndex >= 3
                                    ? "completed"
                                    : stepper.activeIndex === 2
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <div className="account-stepper-circle">
                                  {stepper.activeIndex >= 3 ? <Check size={14} /> : "۳"}
                                </div>
                                <span className="account-stepper-label">
                                  بسته‌بندی زنجیره سرد
                                </span>
                              </div>

                              <div
                                className={`account-stepper-item ${
                                  stepper.activeIndex >= 4
                                    ? "completed"
                                    : stepper.activeIndex === 3
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <div className="account-stepper-circle">
                                  {stepper.activeIndex >= 4 ? <Check size={14} /> : "۴"}
                                </div>
                                <span className="account-stepper-label">تحویل قطعی مرسوله</span>
                              </div>
                            </div>
                          </div>

                          {/* 3. Items Preview List */}
                          <div className="account-order-items-section">
                            <div className="account-items-title">
                              <Package size={15} />
                              <span>اقلام خریداری‌شده در این سفارش ({items.length} کالا):</span>
                            </div>
                            <div className="account-items-grid">
                              {items.map((it) => (
                                <div key={it.id} className="account-item-row">
                                  <div className="account-item-left">
                                    <div className="account-item-thumb">
                                      {it.image ? (
                                        <img src={it.image} alt={it.title} />
                                      ) : (
                                        <Package size={24} color="#77B091" />
                                      )}
                                    </div>
                                    <div className="account-item-info">
                                      <span className="account-item-name">{it.title}</span>
                                      {it.subtitle && (
                                        <span className="account-item-sub">{it.subtitle}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="account-item-meta">
                                    <span className="account-item-qty">{it.quantity} عدد</span>
                                    <span className="account-item-price">
                                      {formatToman(BigInt(it.priceTomans) * 10n)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 4. Tracking and Cold-Chain Strip */}
                          <div className="account-order-tracking-strip">
                            <div className="account-tracking-group">
                              <span className="account-coldchain-chip">
                                <Snowflake size={13} />
                                <span>پایش زنجیره سرد ۲-۸°C فعال</span>
                              </span>
                              <div className="account-tracking-code-pill">
                                <span style={{ fontSize: "12px", color: "#64748b" }}>بارنامه:</span>
                                <span className="account-tracking-code" dir="ltr">
                                  {trackingCode}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(trackingCode)}
                                  className="account-copy-btn"
                                  title="کپی بارنامه رسمی"
                                >
                                  {isCopied ? (
                                    <Check size={13} color="#16a34a" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                  <span>{isCopied ? "کپی شد" : "کپی"}</span>
                                </button>
                              </div>
                            </div>

                            <a
                              href={`https://tracking.post.ir/?id=${trackingCode.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="account-tracking-link"
                            >
                              <span>پیگیری آنلاین در سامانه رهگیری پست</span>
                              <ExternalLink size={13} />
                            </a>
                          </div>

                          {/* 5. Meta Info Mini Grid */}
                          <div className="account-order-meta-grid">
                            <div className="account-meta-box">
                              <span className="account-meta-box-label">
                                <CreditCard size={12} />
                                روش و ارجاع درگاه
                              </span>
                              <span className="account-meta-box-value">
                                {o.method} · <span dir="ltr">{o.ref}</span>
                              </span>
                            </div>

                            <div className="account-meta-box">
                              <span className="account-meta-box-label">
                                <MapPin size={12} />
                                نشانی مقصد تحویل
                              </span>
                              <span
                                className="account-meta-box-value"
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {o.address || "تهران، خیابان ولیعصر"}
                              </span>
                            </div>

                            <div className="account-meta-box">
                              <span className="account-meta-box-label">
                                <Phone size={12} />
                                تحویل‌گیرنده
                              </span>
                              <span className="account-meta-box-value">
                                {o.customerName || profile.fullName || "رضا موحدی"} (
                                <span dir="ltr">{o.customerPhone || profile.phone}</span>)
                              </span>
                            </div>
                          </div>

                          {/* 6. Footer Actions */}
                          <div className="account-order-footer">
                            <div className="account-order-total-block">
                              <span className="account-order-total-label">
                                مبلغ کل پرداخت‌شده (شامل مالیات و ارسال پیشتاز):
                              </span>
                              <span className="account-order-total-amount">
                                {formatToman(BigInt(o.totalTomans) * 10n)}
                              </span>
                            </div>

                            <div className="account-order-actions-row">
                              <button
                                type="button"
                                onClick={() =>
                                  alert(
                                    "اقلام این سفارش با موفقیت به سبد خرید شما افزوده شدند."
                                  )
                                }
                                className="account-btn-secondary"
                                style={{ fontSize: "12.5px", padding: "9px 16px" }}
                              >
                                <RotateCw size={14} />
                                خرید مجدد این اقلام
                              </button>
                              <Link
                                href={`/order/${o.orderNumber}`}
                                className="account-btn-primary"
                                style={{
                                  fontSize: "12.5px",
                                  padding: "9px 18px",
                                  textDecoration: "none",
                                }}
                              >
                                <FileText size={15} />
                                مشاهده فاکتور رسمی و ریز اقلام
                                <ChevronLeft size={14} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Skincare Regimen & Consultations */}
            {tab === "regimen" && (
              <div>
                <div className="account-pane-header">
                  <div className="account-pane-title-group">
                    <div className="account-pane-icon-badge">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <h2 className="account-pane-heading">رژیم پوستی بالینی و مشاوره‌های تصویری</h2>
                      <p className="account-pane-subtitle">
                        پروتکل درمانی خانگی تدوین‌شده توسط متخصصین درماتولوژی بر پایه اثر بوهر و کربوکسی‌تراپی
                      </p>
                    </div>
                  </div>
                </div>

                <div className="account-regimen-grid">
                  {DEMO_REGIMEN.map((r, idx) => (
                    <div key={idx} className="account-regimen-card">
                      <div className="account-regimen-top">
                        <span className="account-regimen-step">{r.stepName}</span>
                        <span className="account-regimen-badge">
                          {r.timeOfDay === "NIGHT"
                            ? "🌙 پروتکل شب"
                            : r.timeOfDay === "MORNING"
                            ? "☀️ پروتکل صبح"
                            : "☀️🌙 صبح و شب"}
                        </span>
                      </div>
                      <h3 className="account-regimen-title">{r.productTitle}</h3>
                      <div className="account-regimen-meta">
                        <div style={{ marginBottom: "6px" }}>
                          <strong style={{ color: "#334155" }}>دوره مصرف: </strong>
                          <span>{r.frequency}</span>
                        </div>
                        <p style={{ margin: 0 }}>{r.instructions}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Consultations Section */}
                <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #e2e8f0" }}>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: "900",
                      color: "#0f172a",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Calendar size={18} />
                    نوبت‌های ویزیت تصویری با متخصصین درماتولوژی
                  </h3>

                  {consultations.map((c) => (
                    <div key={c.id} className="account-consultation-card">
                      <div className="account-consultation-head">
                        <div>
                          <strong style={{ fontSize: "14.5px", color: "#0f172a", display: "block" }}>
                            {c.specialistName}
                          </strong>
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            {c.dateJalali} | {c.timeSlot}
                          </span>
                        </div>
                        <span
                          className={`account-status-badge ${
                            c.status === "CONFIRMED"
                              ? "account-status-delivered"
                              : "account-status-shipped"
                          }`}
                        >
                          {c.status === "CONFIRMED" ? "تأیید شده (آنلاین)" : "انجام شده"}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#475569", margin: "8px 0 12px" }}>
                        علت مشاوره: {c.concern}
                      </p>
                      {c.meetingLink && c.status === "CONFIRMED" && (
                        <a
                          href={c.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="account-btn-secondary"
                          style={{
                            display: "inline-flex",
                            textDecoration: "none",
                            fontSize: "12.5px",
                            padding: "8px 16px",
                          }}
                        >
                          <ExternalLink size={14} />
                          ورود به اتاق ویزیت تصویری امن
                        </a>
                      )}
                    </div>
                  ))}

                  {/* Book new consultation */}
                  <form
                    onSubmit={handleBookConsultation}
                    style={{
                      background: "#f8fafc",
                      border: "1px dashed #cbd5e1",
                      borderRadius: "16px",
                      padding: "20px",
                      marginTop: "20px",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "14.5px",
                        fontWeight: "800",
                        color: "#0f172a",
                        marginBottom: "8px",
                      }}
                    >
                      درخواست وقت مشاوره تصویری جدید
                    </h4>
                    <p style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "12px" }}>
                      مشاورین بالینی دکتر درمر بر اساس سابقه خریدهای شما و پروتکل کربوکسی‌تراپی پاسخگوی شما خواهند بود.
                    </p>
                    <textarea
                      value={newConsultationConcern}
                      onChange={(e) => setNewConsultationConcern(e.target.value)}
                      rows={2}
                      placeholder="شرح نوع عارضه پوستی، سابقه مصرف یا سوال تخصصی…"
                      className="account-textarea"
                      required
                    />
                    <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                      <button type="submit" className="account-btn-primary">
                        <Plus size={16} />
                        رزرو نوبت مشاوره تخصصی
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 4: Wallet */}
            {tab === "wallet" && (
              <div>
                <div className="account-pane-header">
                  <div className="account-pane-title-group">
                    <div className="account-pane-icon-badge">
                      <Wallet size={22} />
                    </div>
                    <div>
                      <h2 className="account-pane-heading">کیف پول تخصصی و اعتبار ریالی</h2>
                      <p className="account-pane-subtitle">
                        مدیریت موجودی نقدی، پاداش‌های بازپرداخت (Cashback) و تسویه سفارش‌ها با یک کلیک
                      </p>
                    </div>
                  </div>
                </div>

                {/* Luxury Clinical Debit Card Visual */}
                <div className="account-wallet-card-visual">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div className="account-card-chip" />
                    <span style={{ fontSize: "14px", fontWeight: "900", letterSpacing: "1px", color: "#FFD098" }}>
                      DR DERMER VIP
                    </span>
                  </div>
                  <span className="account-card-balance-label">موجودی در دسترس جهت خرید</span>
                  <span className="account-card-balance-value">۳,۴۰۰,۰۰۰ تومان</span>
                  <div className="account-card-bottom-row">
                    <span>دارنده: {profile.fullName || "کاربر بالینی"}</span>
                    <span dir="ltr">**** **** **** 8821</span>
                  </div>
                </div>

                <div className="account-wallet-actions">
                  <button
                    className="account-btn-primary"
                    onClick={() => alert("درگاه شاپرک با موفقیت فراخوانی شد.")}
                  >
                    <Plus size={16} />
                    شارژ آنلاین کیف پول
                  </button>
                  <button
                    className="account-btn-secondary"
                    onClick={() => alert("کد هدیه فعال شد.")}
                  >
                    ثبت کارت هدیه / کوپن شارژ
                  </button>
                </div>

                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "900",
                    color: "#0f172a",
                    marginBottom: "14px",
                  }}
                >
                  ریز تراکنش‌های اخیر کیف پول
                </h3>

                <div className="account-ledger-list">
                  {WALLET_TXS.map((t) => (
                    <div key={t.id} className="account-ledger-row">
                      <div>
                        <strong style={{ display: "block", color: "#1e293b" }}>{t.title}</strong>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>{t.date}</span>
                      </div>
                      <span
                        className={
                          t.direction === "credit"
                            ? "account-ledger-amount-credit"
                            : "account-ledger-amount-debit"
                        }
                      >
                        {t.direction === "credit" ? "+" : "−"}{" "}
                        {new Intl.NumberFormat("fa-IR").format(Math.abs(t.amount))} تومان
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "24px",
                    padding: "14px 18px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "12.5px",
                    color: "#166534",
                  }}
                >
                  <ShieldCheck size={18} />
                  <span>
                    تراکنش‌های کیف پول در چارچوب دفترکل مالی دوبل‌اندر (حساب بستانکاران ۲۰۱۰) با ضمانت بانکی پردازش می‌گردد.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 5: Addresses */}
            {tab === "addresses" && (
              <div>
                <div className="account-pane-header">
                  <div className="account-pane-title-group">
                    <div className="account-pane-icon-badge">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <h2 className="account-pane-heading">
                        آدرس‌های ذخیره‌شده و تحویل مرسوله ({addresses.length})
                      </h2>
                      <p className="account-pane-subtitle">
                        مدیریت نشانی‌های تحویل بسته‌های زنجیره سرد و سفارش‌های کلینیکال
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddrForm(!showAddrForm)}
                    className="account-btn-primary"
                    style={{ fontSize: "13px", padding: "10px 18px" }}
                  >
                    <Plus size={16} />
                    افزودن آدرس جدید
                  </button>
                </div>

                {showAddrForm && (
                  <form
                    onSubmit={addAddress}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "24px",
                      marginBottom: "24px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "900",
                        color: "#0f172a",
                        marginBottom: "16px",
                      }}
                    >
                      ثبت آدرس جدید تحویل
                    </h3>
                    <div className="account-form-grid">
                      <div className="account-form-field">
                        <label className="account-field-label">
                          <span>عنوان آدرس (منزل، مطب، کلینیک)</span>
                        </label>
                        <input
                          name="title"
                          required
                          placeholder="مثال: مطب دکتر شریفی"
                          className="account-input"
                        />
                      </div>
                      <div className="account-form-field">
                        <label className="account-field-label">
                          <span>نام تحویل‌گیرنده</span>
                        </label>
                        <input
                          name="receiverName"
                          defaultValue={profile.fullName}
                          required
                          className="account-input"
                        />
                      </div>
                      <div className="account-form-field">
                        <label className="account-field-label">
                          <span>شماره تماس هماهنگی تحویل</span>
                        </label>
                        <input
                          name="phone"
                          defaultValue={profile.phone}
                          required
                          dir="ltr"
                          className="account-input"
                        />
                      </div>
                      <div className="account-form-field">
                        <label className="account-field-label">
                          <span>استان</span>
                        </label>
                        <input
                          name="province"
                          defaultValue="تهران"
                          required
                          className="account-input"
                        />
                      </div>
                      <div className="account-form-field">
                        <label className="account-field-label">
                          <span>شهر</span>
                        </label>
                        <input
                          name="city"
                          defaultValue="تهران"
                          required
                          className="account-input"
                        />
                      </div>
                      <div className="account-form-field">
                        <label className="account-field-label">
                          <span>کد پستی ۱۰ رقمی</span>
                        </label>
                        <input
                          name="postalCode"
                          required
                          dir="ltr"
                          maxLength={10}
                          placeholder="1458963214"
                          className="account-input"
                        />
                      </div>
                      <div className="account-form-field full-width">
                        <label className="account-field-label">
                          <span>نشانی دقیق پستی (خیابان، کوچه، پلاک، واحد)</span>
                        </label>
                        <textarea
                          name="postalAddress"
                          required
                          rows={2}
                          placeholder="تهران، خیابان ولیعصر..."
                          className="account-textarea"
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setShowAddrForm(false)}
                        className="account-btn-secondary"
                      >
                        انصراف
                      </button>
                      <button type="submit" className="account-btn-primary">
                        ذخیره نشانی
                      </button>
                    </div>
                  </form>
                )}

                {/* Information Tip for Checkout Linking */}
                <div
                  style={{
                    background: "linear-gradient(90deg, #f0fdf4 0%, #ecfdf5 100%)",
                    border: "1px solid #bbf7d0",
                    borderRadius: "14px",
                    padding: "14px 18px",
                    marginBottom: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "#274b24",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 2px", fontSize: "13.5px", fontWeight: 800, color: "#14532d" }}>
                      اتصال مستقیم نشانی به مرحله پرداخت و تسویه‌حساب (Checkout)
                    </h4>
                    <p style={{ margin: 0, fontSize: "12.5px", color: "#166534", lineHeight: "1.6" }}>
                      نشانی انتخاب‌شده به صورت خودکار به عنوان مقصد تحویل سفارش و گیرنده فاکتور رسمی در صفحه پرداخت اعمال می‌شود. برای تغییر نشانی پیش‌فرض، کافیست روی کارت مورد نظر یا دکمه «انتخاب برای پرداخت» کلیک کنید.
                    </p>
                  </div>
                </div>

                <div className="account-address-grid">
                  {addresses.map((a) => {
                    const isSelected = a.isDefault;
                    return (
                      <div
                        key={a.id}
                        onClick={() => setDefaultAddress(a.id)}
                        className={`account-address-card ${isSelected ? "is-default" : ""}`}
                        style={{
                          cursor: "pointer",
                          border: isSelected ? "2px solid #274b24" : "1px solid #e2e8f0",
                          background: isSelected ? "#f9fef9" : "#ffffff",
                          boxShadow: isSelected ? "0 4px 16px rgba(39, 75, 36, 0.12)" : "0 2px 6px rgba(0,0,0,0.03)",
                          position: "relative",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {/* Selection Radio Circle */}
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                border: isSelected ? "6px solid #274b24" : "2px solid #94a3b8",
                                background: "#ffffff",
                                flexShrink: 0,
                                transition: "all 0.2s ease",
                              }}
                            />
                            <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                              {a.title}
                            </strong>
                            {isSelected && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  background: "#dcfce7",
                                  color: "#15803d",
                                  padding: "3px 10px",
                                  borderRadius: "999px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                <Check size={12} strokeWidth={3} />
                                منتخب برای پرداخت
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAddress(a.id);
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#94a3b8",
                              cursor: "pointer",
                              padding: "4px",
                              borderRadius: "6px",
                              transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                            title="حذف این آدرس"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <p style={{ fontSize: "13.5px", color: "#334155", margin: 0, lineHeight: "1.6" }}>
                          {a.province}، {a.city} — {a.postalAddress}
                        </p>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            display: "flex",
                            gap: "14px",
                            marginTop: "2px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>تحویل‌گیرنده: <strong style={{ color: "#334155" }}>{a.receiverName}</strong></span>
                          <span>
                            تماس: <span dir="ltr">{a.phone}</span>
                          </span>
                          <span>
                            کدپستی: <span dir="ltr">{a.postalCode}</span>
                          </span>
                        </div>

                        {/* Selection status action / button */}
                        <div
                          style={{
                            marginTop: "10px",
                            paddingTop: "10px",
                            borderTop: "1px dashed #e2e8f0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          {isSelected ? (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#166534",
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <CheckCircle2 size={14} style={{ color: "#16a34a" }} />
                              نشانی فعال و پیش‌فرض در صفحه تسویه‌حساب و پرداخت
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDefaultAddress(a.id);
                              }}
                              style={{
                                background: "#f8fafc",
                                border: "1px solid #cbd5e1",
                                color: "#334155",
                                padding: "6px 14px",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#274b24";
                                e.currentTarget.style.borderColor = "#274b24";
                                e.currentTarget.style.color = "#ffffff";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#f8fafc";
                                e.currentTarget.style.borderColor = "#cbd5e1";
                                e.currentTarget.style.color = "#334155";
                              }}
                            >
                              <MapPin size={13} />
                              انتخاب این آدرس به عنوان نشانی پیش‌فرض پرداخت
                            </button>
                          )}

                          <Link
                            href="/checkout"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDefaultAddress(a.id);
                            }}
                            style={{
                              fontSize: "11.5px",
                              color: "#274b24",
                              fontWeight: 700,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "2px",
                            }}
                          >
                            <span>ورود به پرداخت با این نشانی</span>
                            <span>←</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 6: Tickets */}
            {tab === "tickets" && (
              <div>
                <div className="account-pane-header">
                  <div className="account-pane-title-group">
                    <div className="account-pane-icon-badge">
                      <Headphones size={22} />
                    </div>
                    <div>
                      <h2 className="account-pane-heading">تیکت‌های پشتیبانی علمی و فنی</h2>
                      <p className="account-pane-subtitle">
                        ارتباط مستقیم با تیم علمی درماتولوژی، پیگیری نسخه‌ها و سوالات پیش و پس از درمان
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={submitTicket}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "22px",
                    marginBottom: "26px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "900",
                      color: "#0f172a",
                      marginBottom: "14px",
                    }}
                  >
                    ارسال تیکت جدید به پزشک مشاور
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div className="account-form-field">
                      <label className="account-field-label">
                        <span>موضوع تیکت</span>
                      </label>
                      <input
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                        required
                        placeholder="مثال: سوال در خصوص میزان مصرف CarboxyGel در پوست حساس"
                        className="account-input"
                      />
                    </div>
                    <div className="account-form-field">
                      <label className="account-field-label">
                        <span>شرح کامل پیام یا تصویر نسخه</span>
                      </label>
                      <textarea
                        value={newTicket.message}
                        onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                        rows={3}
                        placeholder="لطفاً شرح مشکل یا سوال تخصصی خود را به همراه زمان مصرف بنویسید..."
                        className="account-textarea"
                        required
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button type="submit" className="account-btn-primary">
                        <Plus size={16} />
                        ارسال پیام به تیم پزشکی
                      </button>
                    </div>
                  </div>
                </form>

                {tickets.length === 0 ? (
                  <div className="account-empty-state">
                    <div className="account-empty-icon">
                      <Headphones size={28} />
                    </div>
                    <h3 className="account-empty-title">هیچ تیکت فعالی ندارید</h3>
                    <p className="account-empty-desc">
                      در صورت بروز هرگونه سوال دارویی یا پیگیری سفارش، از فرم بالا پیام خود را ثبت کنید.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {tickets.map((t) => (
                      <div
                        key={t.id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          padding: "18px 20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <strong style={{ fontSize: "14.5px", color: "#0f172a" }}>
                            {t.subject}
                          </strong>
                          <span
                            className={`account-status-badge ${
                              t.status === "OPEN"
                                ? "account-status-processing"
                                : t.status === "ANSWERED"
                                ? "account-status-delivered"
                                : "account-status-shipped"
                            }`}
                          >
                            {t.status === "OPEN"
                              ? "در انتظار پاسخ پزشک"
                              : t.status === "ANSWERED"
                              ? "پاسخ داده شد"
                              : "بسته شده"}
                          </span>
                        </div>
                        <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 10px" }}>
                          {t.message}
                        </p>
                        <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                          {new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(t.createdAt))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: Loyalty */}
            {tab === "loyalty" && (
              <div>
                <div className="account-pane-header">
                  <div className="account-pane-title-group">
                    <div className="account-pane-icon-badge">
                      <Award size={22} />
                    </div>
                    <div>
                      <h2 className="account-pane-heading">
                        باشگاه مشتریان و ارتقای سلامت پوست (Skin Club)
                      </h2>
                      <p className="account-pane-subtitle">
                        کسب امتیاز با ثبت هر سفارش بالینی، ارتقای سطح و بهره‌مندی از خدمات اختصاصی
                      </p>
                    </div>
                  </div>
                </div>

                <div className="loyalty-hero">
                  <div className="loyalty-hero-top">
                    <div>
                      <span className="loyalty-points-label">امتیاز فعلی شما</span>
                      <strong className="loyalty-points">
                        {new Intl.NumberFormat("fa-IR").format(680)}
                      </strong>
                      <small className="loyalty-points-unit">امتیاز اعتبار سلامت</small>
                    </div>
                    <span className="tier-pill tier-silver">سطح نقره‌ای (Silver Tier)</span>
                  </div>
                  <div
                    className="tier-progress"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={68}
                  >
                    <div className="tier-progress-fill" style={{ width: "68%" }} />
                  </div>
                  <small className="tier-progress-caption">
                    ۳۲۰ امتیاز تا ارتقا به سطح طلایی (تخفیف دائمی ۱۵٪ کلینیکال و ارسال رایگان نامحدود)
                  </small>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginTop: "24px",
                  }}
                >
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      padding: "18px",
                    }}
                  >
                    <div style={{ color: "#274b24", marginBottom: "8px" }}>
                      <TrendingUp size={24} />
                    </div>
                    <strong style={{ fontSize: "14px", display: "block", color: "#0f172a" }}>
                      امتیاز نقدی خریدهای شما
                    </strong>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0" }}>
                      به ازای هر ۱۰۰ هزار تومان خرید، ۱۰ امتیاز در حساب شما ذخیره می‌شود.
                    </p>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      padding: "18px",
                    }}
                  >
                    <div style={{ color: "#274b24", marginBottom: "8px" }}>
                      <Sparkles size={24} />
                    </div>
                    <strong style={{ fontSize: "14px", display: "block", color: "#0f172a" }}>
                      ویزیت ادواری رایگان
                    </strong>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0" }}>
                      هر فصل یک جلسه ارزیابی آنلاین وضعیت پوست با متخصصین درماتولوژی.
                    </p>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      padding: "18px",
                    }}
                  >
                    <div style={{ color: "#274b24", marginBottom: "8px" }}>
                      <ShoppingBag size={24} />
                    </div>
                    <strong style={{ fontSize: "14px", display: "block", color: "#0f172a" }}>
                      پکیج‌های پیش‌عرضه کالا
                    </strong>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0" }}>
                      دسترسی زودهنگام به فرمولاسیون‌های جدید ReeSkin قبل از توزیع عمومی.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: Live Cart & Prescription Items */}
            {tab === "cart" && (
              <div>
                <div className="account-pane-header">
                  <div className="account-pane-title-group">
                    <div
                      className="account-pane-icon-badge"
                      style={{ background: "#e0f2fe", color: "#0284c7" }}
                    >
                      <ShoppingCart size={22} />
                    </div>
                    <div>
                      <h2 className="account-pane-heading">
                        سبد خرید و اقلام نسخه درمانی شما ({cart.itemCount} قلم کالا)
                      </h2>
                      <p className="account-pane-subtitle">
                        مدیریت اقلام انتخابی نسخه بالینی، تغییر تعداد، استعلام موجودی زنده و اتصال به
                        تسویه‌حساب شاپرک
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Link
                      href="/cart"
                      className="account-btn-secondary"
                      style={{
                        padding: "8px 16px",
                        fontSize: "12.5px",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <ExternalLink size={14} />
                      نمای تمام‌صفحه سبد خرید
                    </Link>
                  </div>
                </div>

                {cart.items.length === 0 ? (
                  <div className="account-empty-state">
                    <div
                      className="account-empty-icon"
                      style={{ background: "#f0f9ff", color: "#0284c7" }}
                    >
                      <ShoppingCart size={32} />
                    </div>
                    <h3 className="account-empty-title">
                      سبد خرید و نسخه شما در حال حاضر خالی است
                    </h3>
                    <p className="account-empty-desc">
                      شما می‌توانید فرمولاسیون‌های تخصصی ReeSkin، کربوکسی‌پاد و محصولات
                      مراقبت پوست را به سبد خود اضافه نمایید.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginTop: "16px",
                      }}
                    >
                      <Link
                        href="/#catalog"
                        className="account-btn-primary"
                        style={{ textDecoration: "none" }}
                      >
                        <ShoppingBag size={16} />
                        مشاهده کاتالوگ محصولات و ملزومات بالینی
                      </Link>
                      <Link
                        href="/cart"
                        className="account-btn-secondary"
                        style={{ textDecoration: "none" }}
                      >
                        مشاهده صفحه اختصاصی سبد خرید
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="account-cart-container">
                    {/* Items Column */}
                    <div className="account-cart-items-col">
                      {cart.items.map((item) => {
                        const lineTotalRials = BigInt(item.priceAmount) * BigInt(item.qty);
                        return (
                          <div key={item.variantId} className="account-cart-item-card">
                            <div className="account-cart-item-left">
                              <div className="account-cart-item-thumb">
                                {item.image ? (
                                  <img src={item.image} alt={item.title} />
                                ) : (
                                  <span
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: 800,
                                      color: "#274b24",
                                    }}
                                  >
                                    {item.title.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div className="account-cart-item-info">
                                <h4 className="account-cart-item-title">{item.title}</h4>
                                <span className="account-cart-item-meta">کد کالا: {item.sku}</span>
                                <span
                                  className="account-cart-item-meta"
                                  style={{ color: "#0284c7", fontWeight: 700 }}
                                >
                                  قیمت واحد: {formatToman(item.priceAmount)}
                                </span>
                              </div>
                            </div>

                            <div className="account-cart-item-right">
                              {/* Quantity Counter */}
                              <div className="account-cart-counter">
                                <button
                                  type="button"
                                  className="account-cart-counter-btn"
                                  onClick={() => cart.setQty(item.variantId, item.qty + 1)}
                                  title="افزایش تعداد"
                                >
                                  +
                                </button>
                                <span className="account-cart-counter-value">
                                  {item.qty.toLocaleString("fa-IR")}
                                </span>
                                <button
                                  type="button"
                                  className="account-cart-counter-btn"
                                  onClick={() => {
                                    if (item.qty > 1) {
                                      cart.setQty(item.variantId, item.qty - 1);
                                    } else {
                                      cart.removeItem(item.variantId);
                                    }
                                  }}
                                  title="کاهش یا حذف"
                                >
                                  -
                                </button>
                              </div>

                              {/* Line Total */}
                              <div className="account-cart-item-total">
                                {formatToman(lineTotalRials)}
                              </div>

                              {/* Remove Button */}
                              <button
                                type="button"
                                className="account-cart-remove-btn"
                                onClick={() => cart.removeItem(item.variantId)}
                                title="حذف از سبد"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "12px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={cart.clearCart}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ef4444",
                            fontSize: "13px",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Trash2 size={14} />
                          پاک کردن کل سبد خرید
                        </button>
                        <Link
                          href="/#catalog"
                          style={{
                            fontSize: "13px",
                            color: "#274b24",
                            textDecoration: "none",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>افزودن محصولات بیشتر از کاتالوگ</span>
                          <ChevronLeft size={14} />
                        </Link>
                      </div>
                    </div>

                    {/* Order Summary Side Card */}
                    <aside className="account-cart-summary-card">
                      <h3 className="account-cart-summary-title">خلاصه صورتحساب نسخه</h3>

                      <div className="account-cart-summary-row">
                        <span>تعداد کل کالاها:</span>
                        <strong>{cart.itemCount.toLocaleString("fa-IR")} قلم</strong>
                      </div>

                      <div className="account-cart-summary-row">
                        <span>جمع قیمت اقلام:</span>
                        <span>{formatToman(cart.calculations.subtotalRials)}</span>
                      </div>

                      {cart.calculations.discountTomans > 0n && (
                        <div className="account-cart-summary-row" style={{ color: "#059669" }}>
                          <span>تخفیف کلینیکال و کوپن:</span>
                          <span>- {formatToman(cart.calculations.discountRials)}</span>
                        </div>
                      )}

                      <div className="account-cart-summary-row">
                        <span>هزینه بسته‌بندی و ارسال زنجیره سرد:</span>
                        <span>
                          {cart.calculations.isFreeShipping ? (
                            <span style={{ color: "#059669", fontWeight: 700 }}>
                              رایگان (پیشتاز کشوری)
                            </span>
                          ) : (
                            formatToman(cart.calculations.shippingRials)
                          )}
                        </span>
                      </div>

                      <div className="account-cart-summary-row grand">
                        <span>مبلغ نهایی پیش‌فاکتور:</span>
                        <strong>{formatToman(cart.calculations.grandTotalRials)}</strong>
                      </div>

                      <Link
                        href="/checkout"
                        className="account-btn-primary"
                        style={{
                          width: "100%",
                          textDecoration: "none",
                          padding: "14px 20px",
                          fontSize: "14.5px",
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          boxShadow: "0 4px 14px rgba(39, 75, 36, 0.25)",
                        }}
                      >
                        <span>تکمیل سفارش و پرداخت نهایی (تسویه‌حساب)</span>
                        <ChevronLeft size={16} />
                      </Link>

                      {/* Clinical Assurance Items */}
                      <div
                        style={{
                          borderTop: "1px solid #e2e8f0",
                          paddingTop: "16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontSize: "11.5px",
                          color: "#64748b",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <ShieldCheck size={14} color="#059669" />
                          <span>پرداخت امن متصل به شبکه رسمی شاپرک</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FileText size={14} color="#0284c7" />
                          <span>صدور فاکتور رسمی مالیاتی با شناسه یکتا</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Truck size={14} color="#274b24" />
                          <span>ارسال فوری با ناوگان اختصاصی زنجیره سرد</span>
                        </div>
                      </div>
                    </aside>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Floating Mobile Navigation Trigger (FAB) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="account-floating-fab"
          title="منوی دسترسی سریع پرونده"
          aria-label="باز کردن منوی دسترسی سریع پرونده"
        >
          <MenuToggleBarsIcon size={24} color="#ffffff" />
          {cart.itemCount > 0 && (
            <span className="account-floating-fab-badge">{cart.itemCount}</span>
          )}
        </button>

        {/* Floating Mobile Drawer Sheet */}
        {isMobileMenuOpen && (
          <div
            className="account-mobile-drawer-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="account-mobile-drawer-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="account-mobile-drawer-header">
                <div className="account-mobile-drawer-title-wrap">
                  <div className="account-mobile-drawer-icon-box">
                    <MenuToggleBarsIcon size={20} color="#2563eb" />
                  </div>
                  <div>
                    <div className="account-mobile-drawer-title">مدیریت حساب و پرونده</div>
                    <div className="account-mobile-drawer-sub">دسترسی سریع به پرونده سلامت</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="account-mobile-drawer-close"
                  aria-label="بستن منو"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="account-mobile-drawer-body">
                <button
                  onClick={() => handleTabChange("cart")}
                  className={`account-nav-link ${tab === "cart" ? "active" : ""}`}
                >
                  <div className="account-nav-content">
                    <div
                      className="account-nav-icon-wrap"
                      style={tab === "cart" ? { background: "#0284c7", color: "#ffffff" } : {}}
                    >
                      <ShoppingCart size={17} />
                    </div>
                    <span>سبد خرید و نسخه جاری</span>
                  </div>
                  <span
                    className="account-nav-badge"
                    style={
                      cart.itemCount > 0
                        ? { backgroundColor: "#0284c7", color: "#ffffff", fontWeight: 800 }
                        : {}
                    }
                  >
                    {cart.itemCount}
                  </span>
                </button>

                <button
                  onClick={() => handleTabChange("profile")}
                  className={`account-nav-link ${tab === "profile" ? "active" : ""}`}
                >
                  <div className="account-nav-content">
                    <div className="account-nav-icon-wrap">
                      <User size={17} />
                    </div>
                    <span>پروفایل و کد ملی</span>
                  </div>
                  <ChevronLeft size={16} className="text-slate-400" />
                </button>

                <button
                  onClick={() => handleTabChange("orders")}
                  className={`account-nav-link ${tab === "orders" ? "active" : ""}`}
                >
                  <div className="account-nav-content">
                    <div className="account-nav-icon-wrap">
                      <ShoppingBag size={17} />
                    </div>
                    <span>سفارش‌ها و رهگیری</span>
                  </div>
                  <span className="account-nav-badge">{orders.length}</span>
                </button>

                <button
                  onClick={() => handleTabChange("regimen")}
                  className={`account-nav-link ${tab === "regimen" ? "active" : ""}`}
                >
                  <div className="account-nav-content">
                    <div className="account-nav-icon-wrap">
                      <Sparkles size={17} />
                    </div>
                    <span>رژیم پوستی و ویزیت</span>
                  </div>
                  <ChevronLeft size={16} className="text-slate-400" />
                </button>

                <button
                  onClick={() => handleTabChange("wallet")}
                  className={`account-nav-link ${tab === "wallet" ? "active" : ""}`}
                >
                  <div className="account-nav-content">
                    <div className="account-nav-icon-wrap">
                      <Wallet size={17} />
                    </div>
                    <span>کیف پول و اعتبار مالی</span>
                  </div>
                  <ChevronLeft size={16} className="text-slate-400" />
                </button>

                <button
                  onClick={() => handleTabChange("addresses")}
                  className={`account-nav-link ${tab === "addresses" ? "active" : ""}`}
                >
                  <div className="account-nav-content">
                    <div className="account-nav-icon-wrap">
                      <MapPin size={17} />
                    </div>
                    <span>آدرس‌های ذخیره‌شده</span>
                  </div>
                  <span className="account-nav-badge">{addresses.length}</span>
                </button>

                <button
                  onClick={() => handleTabChange("tickets")}
                  className={`account-nav-link ${tab === "tickets" ? "active" : ""}`}
                >
                  <div className="account-nav-content">
                    <div className="account-nav-icon-wrap">
                      <Headphones size={17} />
                    </div>
                    <span>تیکت‌های مشاوره و پشتیبانی</span>
                  </div>
                  <span className="account-nav-badge">{tickets.length}</span>
                </button>

                <button
                  onClick={() => handleTabChange("loyalty")}
                  className={`account-nav-link ${tab === "loyalty" ? "active" : ""}`}
                >
                  <div className="account-nav-content">
                    <div className="account-nav-icon-wrap">
                      <Award size={17} />
                    </div>
                    <span>باشگاه مشتریان و امتیازات</span>
                  </div>
                  <ChevronLeft size={16} className="text-slate-400" />
                </button>

                <div className="account-nav-divider" />

                <Link
                  href="/subscriptions"
                  className="account-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="account-nav-content">
                    <div className="account-nav-icon-wrap">
                      <RotateCw size={17} />
                    </div>
                    <span>اشتراک‌های دوره‌ای ملزومات</span>
                  </div>
                  <ChevronLeft size={16} className="text-slate-400" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleGoBack();
                  }}
                  className="account-nav-link"
                  style={{ color: "#334155" }}
                >
                  <div className="account-nav-content">
                    <div
                      className="account-nav-icon-wrap"
                      style={{ background: "#f1f5f9", color: "#334155" }}
                    >
                      <ArrowRight size={17} />
                    </div>
                    <span>بازگشت به فروشگاه</span>
                  </div>
                  <ChevronLeft size={16} className="text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="account-nav-link account-nav-logout"
                >
                  <div className="account-nav-content">
                    <div className="account-nav-icon-wrap">
                      <LogOut size={17} />
                    </div>
                    <span>خروج از حساب کاربری</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
