"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./reeskin.css";
import { useCart } from "../../components/cart";
import { useLocalizedFormatter } from "../../lib/use-localized-formatter";

/* ── Types for Product Matrix ── */
interface MatrixVariant {
  id: string;
  sku: string;
  title: string;
  size: string;
  priceAmount: string; // in IRR (Rials)
  originalPriceAmount?: string;
  badge?: string;
}

interface MatrixProduct {
  id: string;
  slug: string;
  category: "carboxygel" | "carboxypod" | "carboxypad" | "crystalene" | "healene" | "silicalene";
  categoryTitleFa: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge?: string;
  keyActives: string[];
  sublineTypes?: string[];
  variants: MatrixVariant[];
}

const REESKIN_PRODUCTS: MatrixProduct[] = [
  /* 1. CarboxyGel */
  {
    id: "prod_reeskin_carboxygel",
    slug: "carboxygel",
    category: "carboxygel",
    categoryTitleFa: "کربوکسی‌ژل ماتریکسی ۲ فاز",
    title: "CarboxyGel (Glycolic, Azelaic, Multi-Active)",
    subtitle: "ژل پیشرفته کربوکسی‌تراپی غیرتهاجمی با تحریک اثر بوهر (Bohr Effect)",
    description:
      "فرمولاسیون ۲ فاز اختصاصی بر پایه بی‌کربنات سدیم دارویی، عصاره سنتلا و هیالورونیک اسید چندوزنی. آزادسازی کنترل‌شده گاز دی‌اکسید کربن نفوذی جهت اکسیژن‌رسانی شدید بافتی، تحریک فیبروبلاست‌ها و بسته‌شدن منافذ بدون آسیب یا سوزن در ۳ تیپ فرمولاسیون تخصصی.",
    image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png",
    badge: "پرفروش‌ترین فرمولاسیون ۲۰۲۶",
    keyActives: [
      "میکروکمپلکس سدیم بی‌کربنات ۹۹.۹٪ دارویی",
      "عصاره سنتلا آسیاتیکا (مادکاسوساید ۴۰٪)",
      "نیاسینامید خالص ۴٪ با اسید آزاد زیر ۱۰ppm",
      "هیالورونیک اسید ۳ وزن مولکولی (۵۰ تا ۱۸۰۰ کیلودالتون)",
    ],
    sublineTypes: [
      "Glycolic 10%: لایه‌برداری و یکدست‌کننده بافت خشن",
      "Azelaic 15%: درمان ملاسما، لک التهابی و آکنه",
      "Multi-Active: نوسازی کلاژنی و ضد پیری همه‌جانبه",
    ],
    variants: [
      {
        id: "var_cbg_pro_500",
        sku: "RS-CBG-500ML",
        title: "مخزن کلینیکال ۵۰۰ میلی‌لیتر (همراه با ۲۰ ماسک صورت و گردن)",
        size: "500ml کلینیکال",
        priceAmount: "48500000",
        originalPriceAmount: "56000000",
        badge: "ویژه مطب و کلینیک",
      },
      {
        id: "var_cbg_home_5x",
        sku: "RS-CBG-HOME-5X",
        title: "کیت هوم‌کر ۵ عددی (۵ تیوب ۲۵ میلی‌لیتر + ۵ پد فعال‌ساز)",
        size: "باکس خانگی ۵ عددی",
        priceAmount: "19500000",
        originalPriceAmount: "23000000",
        badge: "محبوب‌ترین روتین",
      },
      {
        id: "var_cbg_single_50ml",
        sku: "RS-CBG-TUBE-50ML",
        title: "تیوب تک‌نفره ۵۰ میلی‌لیتر (۲ جلسه درمان خانگی)",
        size: "50ml",
        priceAmount: "8900000",
        originalPriceAmount: "10500000",
      },
    ],
  },

  /* 2. CarboxyPod */
  {
    id: "prod_reeskin_carboxypod",
    slug: "carboxypod",
    category: "carboxypod",
    categoryTitleFa: "پادهای کربوکسی‌پاد ترابافتی",
    title: "CarboxyPod (Vitamin, Carbon, Hydra)",
    subtitle: "کپسول‌های جامد فعال‌ساز گاز CO₂ و پاکسازی اولتراسونیک لایه‌به‌لایه‌ای",
    description:
      "پادهای جامد ارگونومیک با ساختار فشرده بیواکتیو در ۳ فرمولاسیون اختصاصی Vitamin، Carbon و Hydra که در تماس با ژل فعال، واکنش پرجوشش گازی CO₂ را به حداکثر رسانده و لایه‌برداری همزمان با رهایش مواد مغذی فراهم می‌کنند.",
    image: "/assets/drdermer/2025/07/carbon-carboxypod-1-1.png",
    badge: "تکنولوژی فعال‌سازی نانو",
    keyActives: [
      "کربن فعال دارویی متخلخل با جذب سطحی فوق‌العاده",
      "فرم پایدار اتیل آسکوربیک اسید (Vitamin C کمپلکس)",
      "پلی‌گلوتامیک اسید و کمپلکس رطوبت‌رسان Hydra-Matrix",
    ],
    sublineTypes: [
      "Vitamin Pod: شفاف‌کننده، آنتی‌اکسیدان قوی و رفع خستگی چهره",
      "Carbon Pod: سم‌زدایی عمقی، کنترل ترشح سبوم و تخلیه سرسیاه‌ها",
      "Hydra Pod: آبرسانی عمقی لایه‌های دهیدراته و رفع خطوط کم‌آبی",
    ],
    variants: [
      {
        id: "var_pod_carbon_10",
        sku: "RS-POD-CRB-10X",
        title: "پک ۱۰ عددی CarboxyPod مدل Carbon (دتوکس و کنترل چربی)",
        size: "باکس ۱۰ عددی",
        priceAmount: "18000000",
        originalPriceAmount: "21000000",
      },
      {
        id: "var_pod_vita_10",
        sku: "RS-POD-VIT-10X",
        title: "پک ۱۰ عددی CarboxyPod مدل Vitamin (روشن‌کننده و ضدلک)",
        size: "باکس ۱۰ عددی",
        priceAmount: "18500000",
        originalPriceAmount: "21500000",
      },
      {
        id: "var_pod_hydra_10",
        sku: "RS-POD-HYD-10X",
        title: "پک ۱۰ عددی CarboxyPod مدل Hydra (آبرسان عمقی و پپتید)",
        size: "باکس ۱۰ عددی",
        priceAmount: "18000000",
        originalPriceAmount: "21000000",
      },
    ],
  },

  /* 3. CarboxyPad */
  {
    id: "prod_reeskin_carboxypad",
    slug: "carboxypad",
    category: "carboxypad",
    categoryTitleFa: "شیت و پدهای فعال‌ساز آلکالاین",
    title: "CarboxyPad (Alkaline Activator Mask & Neck Pads)",
    subtitle: "پدهای سلولزی غنی‌شده با سیتریک اسید خشک و نمک‌های فعال‌ساز گاز",
    description:
      "شیت‌های برش‌خورده آناتومیک صورت و ناحیه گردن با الیاف میکروپرمنبران که در اثر قرارگیری روی CarboxyGel واکنش انتشار گاز دی‌اکسید کربن را در محفظه بسته پوستی به دام انداخته و نفوذ را به حداکثر می‌رسانند.",
    image: "/assets/drdermer/2025/07/carboxypad-1024x198.png",
    badge: "برش اختصاصی صورت و گردن",
    keyActives: [
      "الیاف سلولزی با گرید دارویی عاری از پرز و حساسیت",
      "پوشش متراکم کریستال‌های سیتریک اسید میکرونیزه",
      "طراحی آناتومیک ۳بعدی جهت تماس کامل با خطوط فک و گردن",
    ],
    sublineTypes: [
      "Face Mask Pads: پوشش کامل گونه، پیشانی، چانه و پل بینی",
      "Neck Pads: طراحی اختصاصی جوانسازی ناحیه غبغب و خطوط افقی گردن",
    ],
    variants: [
      {
        id: "var_pad_20x",
        sku: "RS-PAD-20X",
        title: "بسته ۲۰ عددی شیت‌های دوگانه صورت و گردن CarboxyPad",
        size: "بسته ۲۰ ستی",
        priceAmount: "14000000",
        originalPriceAmount: "16500000",
        badge: "پک مصرفی استاندارد",
      },
      {
        id: "var_pad_50x_clinic",
        sku: "RS-PAD-50X-PRO",
        title: "بسته اقتصادی ۵۰ عددی ویژه کلینیک‌ها و کابین تخصصی",
        size: "بسته ۵۰ ستی",
        priceAmount: "31000000",
        originalPriceAmount: "37000000",
        badge: "تخفیف کلینیکال",
      },
    ],
  },

  /* 4. Crystalene */
  {
    id: "prod_reeskin_crystalene",
    slug: "crystalene",
    category: "crystalene",
    categoryTitleFa: "خمیر پولیش ابریشمی میکروکریستال",
    title: "Crystalene (Microcrystal Polish Paste)",
    subtitle: "میکرودرم ابریشمی با کریستال‌های کروی اکسید آلومینای گرید پزشکی",
    description:
      "پولیش خمیری غیرتحریک‌کننده با ریزبلورهای آلومینای صیقل‌خورده، اسید لاکتیک خالص و روغن آرگان مراکشی. با لایه‌برداری ملایم لایه شاخی مرده، پوست را برای نفوذ ژل‌های درمانی آماده ساخته و شفافیت مخملین پدید می‌آورد.",
    image: "/assets/drdermer/2025/08/15crystalene-1200x1109.webp",
    badge: "جایگزین ایمن میکرودرم ابریژن",
    keyActives: [
      "میکروکریستال‌های اکسید آلومینای دارویی (Medical Alumina)",
      "اسید لاکتیک ۴٪ با تنظیم‌کننده pH هماهنگ با لایه اسیدی پوست",
      "روغن آرگان ارگانیک، کره کاریته و ویتامین E طبیعی",
    ],
    sublineTypes: [
      "Micro Polish: بازسازی بافت زبر و بستن منافذ باز",
      "Lactic Smoothing: درخشش فوری و رفع پوسته و خشکی موضعی",
    ],
    variants: [
      {
        id: "var_cry_200ml",
        sku: "RS-CRY-200ML",
        title: "تیوب ۲۰۰ میلی‌لیتر کریستالین (استفاده خانگی و مطبی)",
        size: "200ml تیوب",
        priceAmount: "17500000",
        originalPriceAmount: "20500000",
      },
      {
        id: "var_cry_500ml_pro",
        sku: "RS-CRY-500ML-CAB",
        title: "ظرف کابین ۵۰۰ میلی‌لیتر پولیش کریستالین",
        size: "500ml کابین کلینیک",
        priceAmount: "36000000",
        originalPriceAmount: "42000000",
      },
    ],
  },

  /* 5. Healene */
  {
    id: "prod_reeskin_healene",
    slug: "healene",
    category: "healene",
    categoryTitleFa: "ژل تسکین‌بخش و التیام‌دهنده درمال",
    title: "Healene (Post-Treatment Dermal Soothing Gel)",
    subtitle: "ترمیم فوری سد دفاعی و تسکین قرمزی پس از پروسیجرهای پوستی",
    description:
      "ژل سبک کریستالی غنی از نیاسینامید، پروویتامین B5 (پانتنول)، هیالورونیک اسید، آلانتوئین و عصاره‌های گیاهی میموزا و سنتلا. کاهش فوری سوزش، التهاب و گرمای ناشی از پیلینگ، لیزر و کربوکسی‌تراپی.",
    image: "/assets/drdermer/2025/08/16healene-1200x1109.webp",
    badge: "ضروری پس از پروسیجر",
    keyActives: [
      "پانتنول خالص (ویتامین B5) با غلظت ۵٪",
      "نیاسینامید و آلانتوئین با خلوص دارویی",
      "کمپلکس عصاره میموزا، کالاندولا و سنتلا آسیاتیکا",
      "سدیم PCA و اسید هیالورونیک بیوتکنولوژیک",
    ],
    sublineTypes: [
      "Cica Shield: ریکاوری لایه شاخی در ۳۰ دقیقه اول",
      "Hydra Sooth: حس خنکی عمیق بدون مسدودسازی منافذ (Non-Comedogenic)",
    ],
    variants: [
      {
        id: "var_hea_250ml",
        sku: "RS-HEA-250ML",
        title: "بطری پمپی ۲۵۰ میلی‌لیتر ژل تسکین‌بخش هیلین",
        size: "250ml پمپی",
        priceAmount: "16000000",
        originalPriceAmount: "18500000",
      },
      {
        id: "var_hea_500ml_pro",
        sku: "RS-HEA-500ML-DISP",
        title: "مخزن ۵۰۰ میلی‌لیتر کلینیکال همراه با پمپ فشاری بزرگ",
        size: "500ml کلینیکال",
        priceAmount: "28500000",
        originalPriceAmount: "33000000",
      },
    ],
  },

  /* 6. Silicalene */
  {
    id: "prod_reeskin_silicalene",
    slug: "silicalene",
    category: "silicalene",
    categoryTitleFa: "اسکراب دتوکس سیلیکا و زغال فعال",
    title: "Silicalene (Mild Silica Detox Scrub)",
    subtitle: "لایروبی بیومکانیکی منافذ و پاکسازی عمیق ناخالصی‌ها بدون سایش",
    description:
      "ترکیب پیشرفته کره‌های گرد و بدون لبه سیلیکای هیدراته، پودر زغال فعال بیولوژیک، سالیسیلیک اسید (BHA) و زینک PCA. حذف سبوم اکسیدشده و آلودگی‌های شهری و ایجاد تنفس سلولی کامل.",
    image: "/assets/drdermer/2025/08/14silicalene-1200x1109.webp",
    badge: "دتوکس پوست‌های چرب و مختلط",
    keyActives: [
      "میکروسفرهای کروی سیلیکای آبدار (بدون میکروپلاستیک)",
      "زغال فعال گیاهی برای جذب توکسین‌ها و ذرات معلق PM2.5",
      "اسید سالیسیلیک ۲٪ و زینک PCA جهت کنترل ترشح چربی",
    ],
    sublineTypes: [
      "Black Detox: پاکسازی عمیق جوش‌های سرسیاه و سرسفید",
      "Sebum Control: مات‌کنندگی طبیعی بافت چهره تا ۸ ساعت",
    ],
    variants: [
      {
        id: "var_sil_200ml",
        sku: "RS-SIL-200ML",
        title: "تیوب ۲۰۰ میلی‌لیتر اسکراب دتوکس سیلیکالین",
        size: "200ml تیوب",
        priceAmount: "15500000",
        originalPriceAmount: "18000000",
      },
      {
        id: "var_sil_500ml_pro",
        sku: "RS-SIL-500ML-PRO",
        title: "بسته ۵۰۰ میلی‌لیتر مصرف کلینیکی اسکراب سیلیکالین",
        size: "500ml کابین",
        priceAmount: "32000000",
        originalPriceAmount: "38000000",
      },
    ],
  },
];

/* ── Regimen Routines Data ── */
interface RegimenStep {
  stepNum: number;
  phaseTitle: string;
  instruction: string;
  productsUsed: string;
}

interface RegimenProtocol {
  id: string;
  title: string;
  duration: string;
  targetAudience: string;
  summary: string;
  steps: RegimenStep[];
  bundle: {
    bundleId: string;
    title: string;
    sku: string;
    priceAmount: string;
    originalPriceAmount: string;
    discountPercent: number;
    description: string;
  };
}

const REGIMEN_PROTOCOLS: RegimenProtocol[] = [
  {
    id: "7-day-renewal",
    title: "پروتکل ۷ روزه نوسازی سلولی (7-Day Cellular Renewal Protocol)",
    duration: "دوره فشرده ۱ هفته‌ای (تکرار هر ۲ ماه یک‌بار)",
    targetAudience: "پوست‌های کدر، دهیدراته، خسته و دارای چروک‌های ریز سطحی",
    summary:
      "این پروتکل درمانی با فعال‌سازی متوالی اثر بوهر (Bohr Effect) و اکسیژن‌رسانی عمیق سلولی، لایه‌های کراتینوسیت کهنه را پاکسازی نموده و گردش خون موضعی را تا ۳ برابر ارتقا می‌دهد.",
    steps: [
      {
        stepNum: 1,
        phaseTitle: "روز اول: دتوکس و بازگشایی کانال‌های تنفسی",
        instruction: "شستشو با اسکراب سیلیکالین به مدت ۶۰ ثانیه، سپس اعمال CarboxyGel Multi-Active و ماسک CarboxyPad به مدت ۲۰ دقیقه.",
        productsUsed: "Silicalene + CarboxyGel Multi-Active + CarboxyPad",
      },
      {
        stepNum: 2,
        phaseTitle: "روزهای ۲ و ۳: تثبیت هیدراتاسیون و تقویت لایه لاملار",
        instruction: "استفاده از ژل التیام‌بخش هیلین ۲ بار در روز برای آبرسانی عمیق بافت تازه اکسیژن‌گرفته و تحریک سنتز کلاژن.",
        productsUsed: "Healene Soothing Gel",
      },
      {
        stepNum: 3,
        phaseTitle: "روز چهارم: پولیش ابریشمی با کریستالین",
        instruction: "ماساژ ملایم خمیر میکروکریستال کریستالین برای زدودن سلول‌های لایه‌برداری‌شده بدون کوچک‌ترین خراشیدگی.",
        productsUsed: "Crystalene Polish Paste",
      },
      {
        stepNum: 4,
        phaseTitle: "روزهای ۵ تا ۷: شوک درخشندگی با CarboxyPod Vitamin",
        instruction: "اجرای پاد ویتامین C و اعمال لایه نهایی ژل هیلین جهت درخشش شیشه‌ای (Glass Skin) و تثبیت اثر بوهر.",
        productsUsed: "CarboxyPod Vitamin + Healene Soothing Gel",
      },
    ],
    bundle: {
      bundleId: "bundle_rs_7day",
      title: "کیت کامل پروتکل ۷ روزه نوسازی سلولی ReeSkin",
      sku: "RS-BND-7DAY-GOLD",
      priceAmount: "64000000",
      originalPriceAmount: "78000000",
      discountPercent: 18,
      description: "شامل CarboxyGel (5x25ml) + CarboxyPad 20x + Crystalene + Healene 250ml",
    },
  },
  {
    id: "post-procedure-cica",
    title: "پروتکل ترمیم سد دفاعی پوست (Post-Procedure Cica Barrier Protocol)",
    duration: "۱۰ روز متوالی بلافاصله پس از پروسیجر",
    targetAudience: "پوست‌های تحت درمان لیزر فرکشنال، میکرونیدلینگ، هایفو و پیلینگ‌های شیمیایی",
    summary:
      "مهار فوری اریتما (قرمزی)، سوزش و گرگرفتگی، ممانعت از ایجاد لک‌های التهابی پس از درمان (PIH) و تسریع ۳ برابری ترمیم زخم‌های میکروسکوپی اپیدرم.",
    steps: [
      {
        stepNum: 1,
        phaseTitle: "ساعت ۰ تا ۲۴: خنک‌سازی و مهار سایتوکین‌های التهابی",
        instruction: "اعمال لایه سخاوتمندانه ژل هیلین خنک‌شده در یخچال هر ۴ ساعت یک‌بار روی پوست ملتهب جهت رفع احساس حرارت.",
        productsUsed: "Healene Soothing Gel (گرید کلینیکال)",
      },
      {
        stepNum: 2,
        phaseTitle: "روزهای ۲ تا ۵: اکسیژن‌رسانی ملایم و پیشگیری از لک",
        instruction: "اعمال لایه نازک CarboxyGel فرمولاسیون Azelaic جهت تنظیم مسیر ملانوژنز و مهار تیرگی‌های متعاقب التهاب.",
        productsUsed: "CarboxyGel Azelaic 15% + Healene",
      },
      {
        stepNum: 3,
        phaseTitle: "روزهای ۶ تا ۱۰: نوسازی کامل ماتریکس درم و سد دفاعی",
        instruction: "ترکیب ژل هیلین با ضدآفتاب فیزیکی وسیع‌الطیف و پرهیز کامل از هرگونه لایه‌بردار مکانیکی تا پایان دوره.",
        productsUsed: "Healene Soothing Gel + Cica Complex",
      },
    ],
    bundle: {
      bundleId: "bundle_rs_cica",
      title: "پک ریکاوری و ترمیم سد دفاعی Post-Procedure ReeSkin",
      sku: "RS-BND-CICA-PRO",
      priceAmount: "38500000",
      originalPriceAmount: "45000000",
      discountPercent: 14,
      description: "شامل ۲ عدد ژل هیلین ۲۵۰ml + یک CarboxyGel Azelaic خانگی با فرمولاسیون التیام‌بخش",
    },
  },
  {
    id: "acne-melasma-clarifying",
    title: "پروتکل درمان آکنه و لک ملاسما (Acne & Melasma Clarifying Protocol)",
    duration: "۴ تا ۶ هفته (هفته‌ای ۲ بار روتین شبانه)",
    targetAudience: "پوست‌های مستعد آکنه التهابی، منافذ مسدود، ترشح چربی بالا و لک‌های مقاوم ملاسما",
    summary:
      "ترکیب اثر سینرژیک اسید آزالائیک ۱۵٪ با پادهای کربن فعال و اسید سالیسیلیک؛ انحلال سبوم درون‌منافذی، مهار باکتری C. acnes و یکدست‌سازی رنگ چهره.",
    steps: [
      {
        stepNum: 1,
        phaseTitle: "مرحله ۱: لایروبی و تخلیه سبوم اکسیدشده",
        instruction: "ماساژ ۲ دقیقه‌ای اسکراب سیلیکالین بر نواحی T-Zone (پیشانی، بینی و چانه) و آبکشی با آب ولرم.",
        productsUsed: "Silicalene Silica Detox Scrub",
      },
      {
        stepNum: 2,
        phaseTitle: "مرحله ۲: کربوکسی‌تراپی هدفمند با CarboxyPod Carbon",
        instruction: "استفاده از پاد کربن فعال روی ژل CarboxyGel Azelaic به مدت ۱۵ دقیقه؛ تحریک تخلیه گاز و جذب توکسین‌ها.",
        productsUsed: "CarboxyGel Azelaic 15% + CarboxyPod Carbon",
      },
      {
        stepNum: 3,
        phaseTitle: "مرحله ۳: تعادل هیدرولیپیدی بدون چربی",
        instruction: "ماساژ ژل بدون چربی هیلین برای جلوگیری از ترشح چربی جبرانی و بستن منافذ باز پاکسازی‌شده.",
        productsUsed: "Healene Soothing Gel (فاقد چربی)",
      },
    ],
    bundle: {
      bundleId: "bundle_rs_acne_clarifying",
      title: "کیت جامع شفاف‌کننده و ضد ملاسما ReeSkin Clarifying",
      sku: "RS-BND-CLARIFYING",
      priceAmount: "51000000",
      originalPriceAmount: "62000000",
      discountPercent: 18,
      description: "شامل CarboxyGel Azelaic + CarboxyPod Carbon (10x) + Silicalene + Healene",
    },
  },
];

export default function ReeSkinBrandPage() {
  const { addItem, openDrawer } = useCart();
  const { formatToman } = useLocalizedFormatter();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    prod_reeskin_carboxygel: "var_cbg_pro_500",
    prod_reeskin_carboxypod: "var_pod_carbon_10",
    prod_reeskin_carboxypad: "var_pad_20x",
    prod_reeskin_crystalene: "var_cry_200ml",
    prod_reeskin_healene: "var_hea_250ml",
    prod_reeskin_silicalene: "var_sil_200ml",
  });
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});
  const [activeProtocolId, setActiveProtocolId] = useState<string>("7-day-renewal");

  const filteredProducts =
    activeCategory === "all"
      ? REESKIN_PRODUCTS
      : REESKIN_PRODUCTS.filter((p) => p.category === activeCategory);

  const handleSelectVariant = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  const handleAddToCart = (product: MatrixProduct) => {
    const variantId = selectedVariants[product.id] || product.variants[0].id;
    const selectedVariant = product.variants.find((v) => v.id === variantId) || product.variants[0];

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      title: `${product.title} - ${selectedVariant.title}`,
      sku: selectedVariant.sku,
      priceAmount: selectedVariant.priceAmount,
      image: product.image,
    });

    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleAddBundleToCart = (protocol: RegimenProtocol) => {
    addItem({
      variantId: protocol.bundle.bundleId,
      productId: protocol.bundle.bundleId,
      title: protocol.bundle.title,
      sku: protocol.bundle.sku,
      priceAmount: protocol.bundle.priceAmount,
      image: "/assets/drdermer/2025/07/azelaic-acid-carboxygel.png",
    });

    setAddedItemMap((prev) => ({ ...prev, [protocol.bundle.bundleId]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [protocol.bundle.bundleId]: false }));
      openDrawer();
    }, 1200);
  };

  const activeProtocol =
    REGIMEN_PROTOCOLS.find((p) => p.id === activeProtocolId) || REGIMEN_PROTOCOLS[0];

  return (
    <main className="reeskin-page page-container">
      {/* ── Brand Hero Showcase ── */}
      <section className="reeskin-hero" aria-labelledby="reeskin-hero-title">
        <div className="reeskin-hero-top">
          <div className="reeskin-hero-badges">
            <span className="reeskin-pill-badge">CLINICAL TRANS-DERMAL FORMULA</span>
            <span className="reeskin-pill-badge gold">استاندارد آزمایشگاهی بریتانیا</span>
            <span className="reeskin-pill-badge">BOHR EFFECT CO₂ RELEASE</span>
          </div>
          <img
            src="/assets/drdermer/2025/07/reeskin.png"
            alt="لوگوی رسمی برند ReeSkin انگلستان"
            className="reeskin-hero-logo"
          />
        </div>

        <h1 id="reeskin-hero-title">ReeSkin™ Clinical</h1>
        <div className="hero-philosophy">
          <span>فلسفه علمی برند:</span>
          <span>Advanced Transdermal Skincare & Non-Invasive Bohr Effect Formulation</span>
        </div>
        <p className="hero-desc">
          خانواده محصولات تخصصی <strong>ReeSkin™ Clinical</strong> ثمره سال‌ها پژوهش درماتولوژی در لابراتوارهای بریتانیا با تمرکز بر
          فناوری اکسیژن‌رسانی غیرتهاجمی ترنس‌درمال است. با فعال‌سازی پدیده فیزیولوژیک اثر بوهر (Bohr Effect)، گاز دی‌اکسید کربن فعال
          بدون نیاز به سوزن در عمق لایه‌های بافت نفوذ کرده و آزادسازی فوری اکسیژن مویرگی، بازسازی ماتریکس کلاژنی و ترمیم سد دفاعی را
          محقق می‌سازد.
        </p>

        {/* Hero Stats */}
        <div className="reeskin-hero-stats">
          <div className="stat-item">
            <span className="stat-num">+۳۰۰٪</span>
            <span className="stat-label">افزایش اکسیژن‌رسانی موضعی با تحریک اثر بوهر</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">۶ فرمولاسیون</span>
            <span className="stat-label">لاین یکپارچه ترابافتی برای تمامی نیازهای مراقبت کلینیکال</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">۱۰۰٪ بدون سوزن</span>
            <span className="stat-label">انتقال ترابافتی بدون درد، تروما یا دوره نقاهت</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">CE Class I</span>
            <span className="stat-label">دارای تاییدیه رسمی انطباق با فارماکوپه پزشکی اروپا</span>
          </div>
        </div>
      </section>

      {/* ── Decision Guide: How to choose ReeSkin ── */}
      <section className="reeskin-section" id="decision-guide" aria-labelledby="guide-title">
        <div className="reeskin-section-header">
          <span className="section-tag">راهنمای انتخاب بالینی</span>
          <h2 id="guide-title">چطور محصول مناسب خود را انتخاب کنم؟</h2>
          <p>
            انتخاب هدفمند پروتکل درمانی بر پایه وضعیت فعلی پوست، دغدغه بافتی و سطح مراقبت مورد نیاز شما در ۳ گام ساده:
          </p>
        </div>

        <div className="reeskin-guide-grid">
          <div className="guide-card">
            <div className="guide-step-num">گام ۱</div>
            <h3>تعیین دغدغه و هدف درمانی</h3>
            <p>
              اگر با ملاسما و لک‌های مقاوم مواجهید <strong>CarboxyGel آزالائیک</strong>؛ برای افتادگی و چروک‌ها <strong>مولتی‌اکتیو پپتیدی</strong>؛ و برای بافت خشن و کدر <strong>گلیکولیک اسید</strong> را برگزینید.
            </p>
            <span className="guide-tag">هدف‌گذاری بیوشیمیایی</span>
          </div>

          <div className="guide-card">
            <div className="guide-step-num">گام ۲</div>
            <h3>انتخاب پکیج متناسب با مصرف</h3>
            <p>
              برای مراقبت فردی دوره‌ای در منزل <strong>کیت خانگی ۵ عددی (Homecare 5x)</strong>، و برای پزشکان و کابین کلینیک‌ها <strong>مخزن ۵۰۰ میلی‌لیتری پرو (همراه با ۲۰ ماسک)</strong> را انتخاب نمایید.
            </p>
            <span className="guide-tag">حجم و فرمات بهینه</span>
          </div>

          <div className="guide-card">
            <div className="guide-step-num">گام ۳</div>
            <h3>تکمیل با مراحل پیش‌درمان و تسکین</h3>
            <p>
              پیش از کربوکسی، پوست را با <strong>اسکراب دتوکس Silicalene یا خمیر پولیش Crystalene</strong> آماده ساخته و پس از درمان با <strong>ژل التیام‌بخش Healene</strong> سد دفاعی را بازسازی کنید.
            </p>
            <span className="guide-tag">هم‌افزایی رژیم ۶گانه</span>
          </div>
        </div>
      </section>

      {/* ── Interactive Product Line Matrix ── */}
      <section className="reeskin-section" id="matrix" aria-labelledby="matrix-title">
        <div className="reeskin-section-header">
          <span className="section-tag">ماتریس تعاملی محصولات</span>
          <h2 id="matrix-title">ماتریس محصولات تخصصی لاین ReeSkin™ Clinical</h2>
          <p>
            انتخاب مستقیم از میان ۶ ستون مراقبت بالینی پوست؛ مشخصات فرمولاسیون، انتخاب سایز کلینیکال یا خانگی، دسترسی مستقیم به صفحه
            اطلاعات فنی و افزودن فوری به سبد خرید.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="matrix-tabs" role="tablist">
          <button
            type="button"
            className={`matrix-tab-btn ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            همه محصولات (۶ لاین اصلی)
          </button>
          <button
            type="button"
            className={`matrix-tab-btn ${activeCategory === "carboxygel" ? "active" : ""}`}
            onClick={() => setActiveCategory("carboxygel")}
          >
            ۱. CarboxyGel (ژل اکسیژن‌ساز)
          </button>
          <button
            type="button"
            className={`matrix-tab-btn ${activeCategory === "carboxypod" ? "active" : ""}`}
            onClick={() => setActiveCategory("carboxypod")}
          >
            ۲. CarboxyPod (پادهای فعال‌ساز)
          </button>
          <button
            type="button"
            className={`matrix-tab-btn ${activeCategory === "carboxypad" ? "active" : ""}`}
            onClick={() => setActiveCategory("carboxypad")}
          >
            ۳. CarboxyPad (پدهای صورت و گردن)
          </button>
          <button
            type="button"
            className={`matrix-tab-btn ${activeCategory === "crystalene" ? "active" : ""}`}
            onClick={() => setActiveCategory("crystalene")}
          >
            ۴. Crystalene (پولیش کریستال)
          </button>
          <button
            type="button"
            className={`matrix-tab-btn ${activeCategory === "healene" ? "active" : ""}`}
            onClick={() => setActiveCategory("healene")}
          >
            ۵. Healene (ژل تسکین‌بخش)
          </button>
          <button
            type="button"
            className={`matrix-tab-btn ${activeCategory === "silicalene" ? "active" : ""}`}
            onClick={() => setActiveCategory("silicalene")}
          >
            ۶. Silicalene (اسکراب دتوکس)
          </button>
        </div>

        {/* Products Matrix Cards Grid */}
        <div className="matrix-grid">
          {filteredProducts.map((product) => {
            const currentVariantId = selectedVariants[product.id] || product.variants[0].id;
            const currentVariant =
              product.variants.find((v) => v.id === currentVariantId) || product.variants[0];
            const isAdded = !!addedItemMap[product.id];

            return (
              <article key={product.id} className="matrix-card">
                {product.badge && <span className="matrix-card-badge">{product.badge}</span>}

                <div className="matrix-card-thumb-wrap">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="matrix-card-img"
                    loading="lazy"
                  />
                </div>

                <div className="matrix-card-header">
                  <span className="matrix-cat-tag">{product.categoryTitleFa}</span>
                  <h3 className="matrix-card-title">{product.title}</h3>
                  <p className="matrix-card-subtitle">{product.subtitle}</p>
                </div>

                <p className="matrix-card-desc">{product.description}</p>

                {/* Sub-line variants if applicable (e.g. Glycolic, Azelaic, Multi-Active) */}
                {product.sublineTypes && product.sublineTypes.length > 0 && (
                  <div className="matrix-key-actives" style={{ marginBottom: "14px" }}>
                    <span className="matrix-actives-label">تنوع فرمولاسیون‌های زیرشاخه:</span>
                    <ul style={{ margin: "4px 0 0", paddingRight: "18px", fontSize: "0.82rem", color: "var(--ink-secondary)" }}>
                      {product.sublineTypes.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Actives */}
                <div className="matrix-key-actives">
                  <span className="matrix-actives-label">مواد مؤثره کلیدی (Active Ingredients):</span>
                  <span className="matrix-actives-list">{product.keyActives.join(" • ")}</span>
                </div>

                {/* Variant Radio Picker */}
                <div className="matrix-variant-select-box">
                  <span className="variant-label-title">انتخاب حجم و مدل بسته‌بندی:</span>
                  <div className="variant-options-group" role="radiogroup">
                    {product.variants.map((v) => {
                      const isSelected = v.id === currentVariantId;
                      return (
                        <div
                          key={v.id}
                          className={`variant-radio-item ${isSelected ? "selected" : ""}`}
                          onClick={() => handleSelectVariant(product.id, v.id)}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                        >
                          <div className="variant-opt-info">
                            <span style={{ color: isSelected ? "var(--brand)" : "var(--muted)" }}>
                              {isSelected ? "●" : "○"}
                            </span>
                            <span>{v.title}</span>
                          </div>
                          <span className="variant-opt-price">{formatToman(BigInt(v.priceAmount))}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="matrix-card-footer">
                  <div className="card-price-row">
                    <div>
                      <span className="price-main-val">
                        {formatToman(BigInt(currentVariant.priceAmount))}
                      </span>
                      {currentVariant.originalPriceAmount && (
                        <span className="price-original-val">
                          {formatToman(BigInt(currentVariant.originalPriceAmount))}
                        </span>
                      )}
                    </div>
                    {currentVariant.badge && (
                      <span style={{ fontSize: "0.75rem", color: "var(--brand)", fontWeight: 700 }}>
                        {currentVariant.badge}
                      </span>
                    )}
                  </div>

                  <div className="card-buttons-row">
                    <Link href={`/products/${product.slug}`} className="btn-card-pdp">
                      مشاهده جزئیات
                    </Link>
                    <button
                      type="button"
                      className={`btn-card-add ${isAdded ? "added" : ""}`}
                      onClick={() => handleAddToCart(product)}
                      aria-label={`افزودن ${product.title} به سبد`}
                    >
                      {isAdded ? "✓ افزوده شد" : "+ افزودن به سبد"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Regimen Routines Protocols Section ── */}
      <section className="reeskin-section" id="regimens" aria-labelledby="regimens-title">
        <div className="regimen-section">
          <div className="reeskin-section-header">
            <span className="section-tag">پروتکل‌های بالینی رسمی</span>
            <h2 id="regimens-title">پروتکل‌ها و رژیم‌های درمانی هدفمند ReeSkin™</h2>
            <p>
              دستورالعمل‌های مرحله‌به‌مرحله تدوین‌شده توسط متخصصین درماتولوژی کمبریج جهت اخذ حداکثر نتیجه از تلفیق محصولات ۶گانه
            </p>
          </div>

          {/* Protocol Tabs */}
          <div className="regimen-selector" role="tablist">
            {REGIMEN_PROTOCOLS.map((proto) => (
              <button
                key={proto.id}
                type="button"
                className={`regimen-tab ${activeProtocolId === proto.id ? "active" : ""}`}
                onClick={() => setActiveProtocolId(proto.id)}
              >
                {proto.title.split("(")[0].trim()}
              </button>
            ))}
          </div>

          {/* Active Protocol Detail Box */}
          <div className="regimen-detail-box">
            <div className="regimen-header-row">
              <div className="regimen-name-group">
                <h3>{activeProtocol.title}</h3>
                <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>
                  مناسب برای: {activeProtocol.targetAudience}
                </p>
              </div>
              <span className="regimen-duration-tag">{activeProtocol.duration}</span>
            </div>

            <p style={{ lineHeight: 1.85, fontSize: "0.95rem", color: "var(--ink-secondary)", marginBottom: "24px" }}>
              {activeProtocol.summary}
            </p>

            {/* Timeline Steps */}
            <div className="regimen-steps-timeline">
              {activeProtocol.steps.map((st) => (
                <div key={st.stepNum} className="step-card">
                  <span className="step-badge">گام شماره {st.stepNum}</span>
                  <h4>{st.phaseTitle}</h4>
                  <p>{st.instruction}</p>
                  <div className="step-products-hint">اقلام مصرفی: {st.productsUsed}</div>
                </div>
              ))}
            </div>

            {/* Bundle Purchase Callout */}
            <div className="regimen-bundle-box">
              <div className="bundle-info">
                <h4>{activeProtocol.bundle.title}</h4>
                <p>{activeProtocol.bundle.description}</p>
                <span style={{ fontSize: "0.8rem", color: "var(--brand-dark)", fontWeight: 700, display: "block", marginTop: "4px" }}>
                  کد رژیم: {activeProtocol.bundle.sku} • {activeProtocol.bundle.discountPercent}٪ تخفیف تجمیعی کیت
                </span>
              </div>

              <div className="bundle-cta-group">
                <span className="bundle-price-val">
                  {formatToman(BigInt(activeProtocol.bundle.priceAmount))}
                </span>
                <button
                  type="button"
                  className="btn-bundle-add"
                  onClick={() => handleAddBundleToCart(activeProtocol)}
                >
                  {addedItemMap[activeProtocol.bundle.bundleId]
                    ? "✓ به سبد اضافه شد"
                    : "خرید فوری کیت کامل رژیم"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Scientific Spotlight: The Bohr Effect ── */}
      <section className="bohr-science-card">
        <div className="science-content">
          <span className="section-tag">مکانیسم بیوشیمیایی</span>
          <h3>اثر بوهر (Bohr Effect) چیست و چگونه کار می‌کند؟</h3>
          <p>
            پدیده فیزیولوژیک اثر بوهر که نخستین بار توسط فیزیولوژیست دانمارکی کریستین بوهر کشف گردید، بیانگر این اصل علمی است که با
            افزایش غلظت موضعی دی‌اکسید کربن (CO₂) و یون هیدروژن در بافت زنده، میل پیوندی هموگلوبین به گاز اکسیژن کاهش می‌یابد.
          </p>
          <div className="science-points">
            <div className="point-row">
              <span className="point-check">✓</span>
              <span>تولید حباب‌های ماتریکسی CO₂ در سطح پوست توسط واکنش CarboxyGel و CarboxyPad</span>
            </div>
            <div className="point-row">
              <span className="point-check">✓</span>
              <span>نفوذ ترابافتی بدون سوزن و ایجاد اسید کربنیک خفیف و موقت در مویرگ‌های درم</span>
            </div>
            <div className="point-row">
              <span className="point-check">✓</span>
              <span>تخلیه سیل‌آسای اکسیژن خالص از گلبول‌های قرمز خون به میتوکندری‌های سلول‌های پوست</span>
            </div>
            <div className="point-row">
              <span className="point-check">✓</span>
              <span>شروع فوری سنتز کلاژن و الاستین و تسریع دفع متابولیت‌ها و سموم بین‌سلولی</span>
            </div>
          </div>
          <Link href="/blog" className="btn-card-pdp" style={{ display: "inline-block" }}>
            مطالعه مقالات علمی اثر بوهر در ژورنال تخصصی ←
          </Link>
        </div>

        <div className="science-visual">
          <div className="science-graphic-box">
            <span className="graphic-formula">Hb(O₂)₄ + 4 CO₂ ⇌ Hb(CO₂)₄ + 4 O₂ ↑</span>
            <p className="graphic-desc">
              نمودار شیفت تفکیک اکسی‌هموگلوبین به راست؛ اکسیژن طبیعی از درون مویرگ‌ها به بافت پوستی آزاد می‌شود نه از طریق هوای محیط.
            </p>
            <div style={{ marginTop: "16px", padding: "12px", background: "var(--brand-tint)", borderRadius: "10px", fontSize: "0.82rem", color: "var(--brand-deep)" }}>
              <strong>نتیجه درماتولوژیک:</strong> نوسازی پوست با اکسیژن خالص بیولوژیک خود بدن بدون هیچ‌گونه عوارض ناشی از هایپراکسی
              خارجی.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
