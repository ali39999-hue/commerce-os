'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CanvasSequencePlayer, HotspotPin } from '../../components/interactive/canvas-sequence-player';
import { useCart } from '../../components/cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';

// ── Multi-Stage Breakdown Specifications ──
interface PodStage {
  id: 'casing' | 'core' | 'handpiece';
  titleFa: string;
  titleEn: string;
  tag: string;
  desc: string;
  features: string[];
  specs: { label: string; value: string }[];
  sequenceFolder: string;
  totalFrames: number;
  framePrefix: string;
  padDigits: number;
  fileExt: string;
  aspectRatio: number;
  hotspots: HotspotPin[];
}

const POD_STAGES: PodStage[] = [
  {
    id: 'casing',
    titleFa: 'پوسته متخلخل بیرونی و سطح اسکراب مکانیکی',
    titleEn: 'Outer Porous Scrub Surface & Fibrous Casing',
    tag: 'MECHANICAL RESURFACING & SCRUB',
    desc: 'لایه سطحی متشکل از الیاف متراکم نبافته بیوپلیمری با دانه‌بندی دقیق میکرونی که در حین لغزش روی ژل، لایه‌برداری فیزیکی یکنواخت و ملایمی بدون ایجاد میکروتروما بر سطح اپیدرم انجام می‌دهد.',
    features: [
      'الیاف فشرده متخلخل با زبری کنترل‌شده (Calibrated Medical Mesh)',
      'تسهیل حذف کراتینوسیت‌های مرده و لایه‌برداری بدون آسیب به سد دفاعی',
      'منافذ میکرو برای انتشار یکدست گاز دی‌اکسید کربن تولیدی بر سطح بافت',
      'ایزولاسیون استریل با پرتودهی گاما و فاقد مواد حساسیت‌زا و پرز',
    ],
    specs: [
      { label: 'بافت و ساختار مش', value: 'Micro-Porous Bio-Polymer Mesh' },
      { label: 'ضخامت پوسته اسکراب', value: '1.2 mm Calibrated Density' },
      { label: 'فشار اصطکاکی بهینه', value: '15–20 g/cm² Non-Abrasive' },
      { label: 'روش استریلیزاسیون', value: 'Gamma Irradiation ISO 11137' },
    ],
    sequenceFolder: '/assets/drdermer/2025/slidepod',
    totalFrames: 46,
    framePrefix: '',
    padDigits: 2,
    fileExt: '.webp',
    aspectRatio: 1.15,
    hotspots: [
      {
        id: 'hs_scrub_mesh',
        title: 'سطح مقعر الیاف اسکراب میکرونی',
        desc: 'شبکه متخلخل برای به دام انداختن سلول‌های مرده و انتشار هدایت‌شده گاز CO₂.',
        badge: 'MICRO-MESH',
        frame: 10,
        frameRange: [1, 22],
        xPercent: 52,
        yPercent: 35,
      },
      {
        id: 'hs_outer_seal',
        title: 'لبه آب‌بند و کانال هدایت ژل',
        desc: 'طراحی ارگونومیک جهت ممانعت از پرتاب یا چکه ژل حین ارتعاش سریع هندپیس.',
        badge: 'SEALING RING',
        frame: 28,
        frameRange: [20, 40],
        xPercent: 48,
        yPercent: 58,
      },
    ],
  },
  {
    id: 'core',
    titleFa: 'هسته فعال بیوشیمیایی و ماتریس کاتالیزور واکنش',
    titleEn: 'Inner Active Ingredients Core & Catalytic Matrix',
    tag: 'CO2 REACTION CORE & BIO-ACTIVES',
    desc: 'مغزی فشرده و غنی از بی‌کربنات سدیم فوق خالص دارویی و اسید سیتریک میکروکپسوله که به محض جذب رطوبت فاز اسیدی یا قلیایی ژل، واکنش گرمازای ملایم و جوشش آنی گاز CO₂ را آغاز می‌کند.',
    features: [
      'گرانول‌های میکروکپسوله با رهایش پایدار در طول کل فرآیند درمان (۱۰ دقیقه)',
      'تولید غلظت بالای گاز دی‌اکسید کربن (> ۱٬۲۰۰ پی‌پی‌ام) در سطح موضع',
      'حاوی ترکیبات اختصاصی آنتی‌اکسیدان، ضدلک و آبرسان متناسب با نوع پاد',
      'تثبیت پی‌هاش نهایی پوست در بازه فیزیولوژیک ۵.۵ پس از تکمیل واکنش',
    ],
    specs: [
      { label: 'خلوص بی‌کربنات سدیم', value: 'USP/EP Pharmaceutical 99.8%' },
      { label: 'نرخ رهایش گاز دی‌اکسید کربن', value: '> 1,200 ppm Persistent' },
      { label: 'تثبیت ترکیبات ویتامینه', value: 'Dry Micro-Encapsulation' },
      { label: 'زمان پایداری جوشش فعال', value: '8 to 12 Minutes Continuous' },
    ],
    sequenceFolder: '/assets/drdermer/2025/slidepodint',
    totalFrames: 45,
    framePrefix: 'a (',
    padDigits: 2,
    fileExt: ').webp',
    aspectRatio: 1.33,
    hotspots: [
      {
        id: 'hs_chem_core',
        title: 'هسته فشرده بی‌کربنات و کاتالیزور اسیدی',
        desc: 'تراکم بالای یون‌های هیدروژن‌کربنات جهت آزادسازی پرقدرت گاز CO₂ در برخورد با ژل.',
        badge: 'CO₂ BOOSTER',
        frame: 18,
        frameRange: [8, 32],
        xPercent: 50,
        yPercent: 45,
      },
      {
        id: 'hs_active_depot',
        title: 'مخزن رهایش نانومولکول‌های ویتامینی',
        desc: 'ترکیب نیاسینامید، آسکوربیل گلوکوزاید و هیالورونات حل‌شونده در ترشحات ژل.',
        badge: 'ACTIVE DEPOT',
        frame: 36,
        frameRange: [25, 45],
        xPercent: 55,
        yPercent: 62,
      },
    ],
  },
  {
    id: 'handpiece',
    titleFa: 'کوپلینگ ارگونومیک با هندپیس اولتراسونیک CarboX',
    titleEn: 'Ultrasound Coupling & Handpiece Interface',
    tag: '120Hz ULTRASONIC MODALITY',
    desc: 'محل اتصال کلیکی ارگونومیک پاد با هندپیس دستگاه CarboX که ارتعاش نوسانی ۱۲۰ هرتز را مستقیماً به بافت منتقل نموده و جذب ترابافتی را تا ۴ برابر افزایش می‌دهد.',
    features: [
      'اتصال سریع چرخشی-قفل‌شونده (Quick Snap-Fit) ایمن و بدون لقی',
      'انتقال یکدست ارتعاش سینوسی ۱۲۰ هرتز بدون لرزش ناخوشایند در دست اپراتور',
      'توزیع فرکانسی یکنواخت برای تحریک خونرسانی مویرگی و تخلیه لنفاوی',
      'بدنه مقاوم در برابر مواد بیوشیمیایی و ژل با گرید درماتولوژی',
    ],
    specs: [
      { label: 'فرکانس نوسان مکانیکی', value: '120 Hz Sinusoidal Ultrasound' },
      { label: 'مکانیزم اتصال پاد', value: 'Precision Snap-Lock Bayonet' },
      { label: 'ولتاژ تغذیه هندپیس', value: 'Isolated 24V DC Medical Spec' },
      { label: 'سطح نویز صوتی حین کار', value: '< 38 dB Ultra Silent' },
    ],
    sequenceFolder: '/assets/drdermer/2025/hppod',
    totalFrames: 36,
    framePrefix: '',
    padDigits: 2,
    fileExt: '.webp',
    aspectRatio: 1.05,
    hotspots: [
      {
        id: 'hs_hp_head',
        title: 'سوکت اولتراسونیک هندپیس CarboX',
        desc: 'ارتعاش متناوب جهت تسریع حل‌شدن پاد و نفوذ ترکیبات به لایه‌های زایای پوست.',
        badge: '120Hz DRIVE',
        frame: 15,
        frameRange: [1, 25],
        xPercent: 48,
        yPercent: 30,
      },
      {
        id: 'hs_hp_contact',
        title: 'سطح تماس پاد با پوست بیمار',
        desc: 'آزادسازی موضعی گاز و لایه‌برداری فیزیکی همگام در امتداد خطوط فیزیولوژیک صورت.',
        badge: 'TISSUE INTERFACE',
        frame: 26,
        frameRange: [16, 36],
        xPercent: 52,
        yPercent: 70,
      },
    ],
  },
];

// ── 3 Pod Variants Detailed Database ──
interface VariantData {
  id: string;
  variantKey: string;
  nameEn: string;
  nameFa: string;
  themeClass: 'vitamin' | 'carbon' | 'hydra';
  badge: string;
  subtitle: string;
  heroImg: string;
  activesTitle: string;
  activesList: string[];
  mechanism: string;
  indications: string;
  sku10: string;
  sku20: string;
  price10Rials: string;
  price20Rials: string;
  price10Tomans: string;
  price20Tomans: string;
}

const POD_VARIANTS: VariantData[] = [
  {
    id: 'vitamin-pod',
    variantKey: 'vitamin',
    nameEn: 'Vitamin CarboxyPod™',
    nameFa: 'پاد ویتامینه مغذی، روشن‌کننده و ضدپیری',
    themeClass: 'vitamin',
    badge: 'NOURISHING & ANTI-AGING',
    subtitle: 'فرموله شده با کمپلکس مولتی‌ویتامین پایدار جهت افزایش فیبروبلاست‌ها و درخشش فوری پوست',
    heroImg: '/assets/drdermer/2025/07/1-vitapod-1-1-2.png',
    activesTitle: 'ترکیبات فعال کلیدی (Key Active Ingredients):',
    activesList: [
      'Niacinamide (Vitamin B3) 5% — مهار انتقال ملانین و تقویت سد سرامیدی',
      'Ascorbyl Glucoside (Stable Vitamin C) — آنتی‌اکسیدان قوی و تحریک سنتز کلاژن تیپ I و III',
      'Calcium Pantothenate (Pro-Vitamin B5) — تسریع تقسیم سلولی و التیام بافت تحت استرس',
      'Retinyl Acetate (Vitamin A Ester) — تجدید چرخه سلولی و بازسازی اپیدرم بدون تحریک پوست',
      'Sodium Bicarbonate Medical Grade — بستر فعال‌ساز متراکم گاز دی‌اکسید کربن',
    ],
    mechanism:
      'همزمان با سایش ملایم الیاف پاد و آزادسازی متراکم CO₂، ترکیبات ویتامینه در pH فعال حل شده و به دلیل اتساع عروقی ناشی از اثر بوهر، با بالاترین نرخ دسترسی زیستی جذب لایه‌های عمقی پوست می‌گردند.',
    indications: 'پوست‌های کدر، دارای لک‌های ناشی از آفتاب، خطوط ریز صورت و گردن، و پوست‌های نیازمند ریوتالایزاسیون.',
    sku10: 'RMD-CPD-VIT-10',
    sku20: 'RMD-CPD-VIT-20',
    price10Rials: '24500000', // 2,450,000 Tomans
    price20Rials: '45000000', // 4,500,000 Tomans
    price10Tomans: '۲٬۴۵۰٬۰۰۰',
    price20Tomans: '۴٬۵۰۰٬۰۰۰',
  },
  {
    id: 'carbon-pod',
    variantKey: 'carbon',
    nameEn: 'Carbon CarboxyPod™',
    nameFa: 'پاد کربن فعال دتوکس و متعادل‌کننده سبوم',
    themeClass: 'carbon',
    badge: 'BALANCING & DETOXIFYING',
    subtitle: 'پاکسازی عمیق منافذ با میکروذرات کربن اکتیو متخلخل و مهار باکتری‌های مولد آکنه',
    heroImg: '/assets/drdermer/2025/07/carbon-carboxypod-1.png',
    activesTitle: 'ترکیبات فعال کلیدی (Key Active Ingredients):',
    activesList: [
      'Activated Carbon Powder (High Porosity) — جذب الکترواستاتیک سموم، چربی اکسیدشده و آلاینده‌ها',
      'Niacinamide (Vitamin B3) — تعدیل ترشح غدد سباسه و تسکین التهابات چرکی',
      'Zinc PCA (Zinc Pyrrolidone Carboxylate) — مهار آنزیم ۵-آلفا ردوکتاز و مهار رشد C. acnes',
      'Sodium Bicarbonate Matrix — واکنش کاتالیزوری پرقدرت آزادسازی آنی حباب‌های گاز',
    ],
    mechanism:
      'نانوخلل و فرج کربن فعال مانند مغناطیسی قدرتمند باکتری‌ها و رسوبات مسدودکننده منافذ را جذب کرده و زینک پی‌سی‌ای تعادل بیولوژیک سبوم را تنظیم می‌نماید. حباب‌های گازی گاز به لایروبی منافذ کمک شایانی می‌کنند.',
    indications: 'پوست‌های چرب، مختلط، دارای جوش‌های سرسیاه و کومدون، منافذ باز بینی و گونه، و مقیمین کلان‌شهرهای آلوده.',
    sku10: 'RMD-CPD-CRB-10',
    sku20: 'RMD-CPD-CRB-20',
    price10Rials: '24500000',
    price20Rials: '45000000',
    price10Tomans: '۲٬۴۵۰٬۰۰۰',
    price20Tomans: '۴٬۵۰۰٬۰۰۰',
  },
  {
    id: 'hydra-pod',
    variantKey: 'hydra',
    nameEn: 'Hydra CarboxyPod™',
    nameFa: 'پاد هیدرا آبرسان عمقی و انقباض منافذ',
    themeClass: 'hydra',
    badge: 'DEEP HYDRATION & PORE REFINING',
    subtitle: 'آبرسانی مولتی‌سطحی ترنس‌درمال با هیالورونیک اسید، عصاره آلوئه‌ورا و آلانتوئین التیام‌بخش',
    heroImg: '/assets/drdermer/2025/07/hydra-carboxypod-1.png',
    activesTitle: 'ترکیبات فعال کلیدی (Key Active Ingredients):',
    activesList: [
      'Multi-Molecular Hyaluronic Acid — نفوذ هیالورونات با وزن‌های مولکولی کم و بالا جهت هیدراتاسیون ۲۴ ساعته',
      'Aloe Barbadensis Leaf Extract — کاهش التهاب سطحی، خنک‌کننده و تأمین مواد قندی طبیعی',
      'Allantoin — تسریع تکثیر بافت اپی‌تلیال، نرم‌کننده لایه شاخی و رفع زبری پوست',
      'Betaine Osmolyte — متعادل‌کننده فشار اسمزی سلول‌ها و محافظت در برابر استرس محیطی',
    ],
    mechanism:
      'جوشش CO₂ جریان خون موضعی را تا ۳ برابر افزایش داده و زمینه را برای جذب عمیق هیالورونیک اسید ریزمولکولی آماده می‌سازد؛ آلانتوئین بلافاصله قرمزی ناشی از تحریک اکسیژنی را فرو می‌نشاند.',
    indications: 'پوست‌های دهیدراته و کدر، پوست‌های حساس و نازک‌شده، بازیابی طراوت پس از پروسیجرهای لیزر و لایه‌برداری شیمیایی.',
    sku10: 'RMD-CPD-HYD-10',
    sku20: 'RMD-CPD-HYD-20',
    price10Rials: '24500000',
    price20Rials: '45000000',
    price10Tomans: '۲٬۴۵۰٬۰۰۰',
    price20Tomans: '۴٬۵۰۰٬۰۰۰',
  },
];

// ── Interactive Step-by-Step Usage Guide ──
interface UsageStep {
  step: number;
  label: string;
  badge: string;
  title: string;
  desc: string;
  proTips: string[];
  formula?: string;
  img: string;
  gaugeLabel: string;
  gaugeValue: string;
}

const USAGE_STEPS: UsageStep[] = [
  {
    step: 1,
    label: 'آماده‌سازی پوست',
    badge: 'STEP 01: PREPARATION',
    title: 'پاکسازی اپیدرم و اپلیکیشن ژل فعال‌ساز CarboxyGel',
    desc: 'پوست بیمار را با شوینده فاقد صابون پاکسازی و خشک کنید. لایه‌ای یکنواخت به ضخامت ۲ الی ۳ میلی‌متر از ژل CarboxyGel دکتر درمر (فرمولاسیون آزالائیک، گلیکولیک یا مولتی‌اکتیو) را روی تمام صورت و گردن پخش نمایید.',
    proTips: [
      'از مالیدن ژل به لبه مخاطی چشم و لب خودداری شود.',
      'ضخامت لایه ژل برای تداوم واکنش در کل مدت درمان حیاتی است.',
    ],
    img: '/assets/drdermer/2025/07/pod-gel-lr.png',
    gaugeLabel: 'pH لایه ژل پایه',
    gaugeValue: 'pH 7.8 (Alkaline Base)',
  },
  {
    step: 2,
    label: 'نصب پاد بر هندپیس',
    badge: 'STEP 02: COUPLING',
    title: 'اتصال مکانیکی پاد CarboxyPod به هندپیس اولتراسونیک',
    desc: 'ساشه استریل پاد را باز کرده، کپسول CarboxyPod انتخابی (Vitamin، Carbon یا Hydra) را بر روی سوکت چرخشی هندپیس ترنس‌درمال CarboX قرار دهید و با چرخش آرام ۹۰ درجه در جای خود قفل نمایید.',
    proTips: [
      'اطمینان حاصل کنید دستگیره قفل‌کننده کاملاً چفت شده باشد.',
      'در صورت استفاده دستی (بدون دستگاه)، پاد با دستکش لاتکس مستقیماً روی ژل ماساژ داده می‌شود.',
    ],
    img: '/assets/drdermer/2025/hppod/01.webp',
    gaugeLabel: 'فرکانس تشدید هندپیس',
    gaugeValue: '120 Hz Continuous',
  },
  {
    step: 3,
    label: 'آغاز واکنش و اثر بوهر',
    badge: 'STEP 03: BOHR ACTIVATION',
    title: 'ماساژ دورانی و آزادسازی انفجاری گاز CO₂',
    desc: 'هندپیس را با سرعت دورانی ملایم بر روی ژل به حرکت درآورید. به محض برخورد الیاف اسکراب پاد با ژل، جوشش متراکم گاز دی‌اکسید کربن پدیدار شده و حرارت ملایم و دلپذیری احساس می‌گردد.',
    formula: 'NaHCO₃ + R-COOH → R-COONa + H₂O + CO₂ (gas) ↑',
    proTips: [
      'فشار دست ملایم و پیوسته باشد؛ بگذارید ارتعاش هندپیس کار اصلی را انجام دهد.',
      'مدت زمان ماساژ در هر ناحیه صورت بین ۲ الی ۳ دقیقه و مجموعاً ۸ تا ۱۰ دقیقه است.',
    ],
    img: '/assets/drdermer/2025/07/carbon-carboxypod-1.png',
    gaugeLabel: 'غلظت گاز CO₂ در موضع',
    gaugeValue: '> 1,200 ppm Transdermal',
  },
  {
    step: 4,
    label: 'پایان درمان و تثبیت',
    badge: 'STEP 04: SOOTHING & FINISH',
    title: 'پاکسازی ضایعات و استفاده از ژل التیام‌بخش Healene',
    desc: 'پس از اتمام جوشش، باقیمانده ژل و بافت لایه‌برداری شده را با اسفنج مرطوب یا پد پنبه‌ای آغشته به آب مقطر به آرامی پاک کنید. سپس مقداری از ژل تسکین‌بخش Healene Soothing Gel را روی پوست بمالید.',
    proTips: [
      'احساس گرمای مختصر و اریتم خفیف (قرمزی گلگون) ناشی از اثر بوهر تا ۲۰ دقیقه طبیعی است.',
      'توصیه به استفاده از ضدآفتاب فیزیکی با SPF بالای ۵۰ پس از پروسیجر ضروری است.',
    ],
    img: '/assets/drdermer/2025/07/1-vitapod-1-1-2.png',
    gaugeLabel: 'افزایش اکسیژناسیون بافتی (SpO₂)',
    gaugeValue: '+48% Oxygen Release',
  },
];

export function CarboxypodInteractiveLanding() {
  const { addItem, openDrawer } = useCart();
  const { formatToman } = useLocalizedFormatter();

  // Active stage for the 3D breakdown
  const [activeStageId, setActiveStageId] = useState<'casing' | 'core' | 'handpiece'>('casing');
  const currentStage = POD_STAGES.find((s) => s.id === activeStageId) || POD_STAGES[0];

  // Active usage step
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const currentUsageStep = USAGE_STEPS[activeStepIndex];

  // Order configurator state
  const [selectedVariantKey, setSelectedVariantKey] = useState<string>('vitamin');
  const [selectedPackSize, setSelectedPackSize] = useState<'pack10' | 'pack20'>('pack10');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

  const selectedVariantData = POD_VARIANTS.find((v) => v.variantKey === selectedVariantKey) || POD_VARIANTS[0];

  const currentPriceRials =
    selectedPackSize === 'pack10'
      ? selectedVariantData.price10Rials
      : selectedVariantData.price20Rials;

  const currentPriceTomans =
    selectedPackSize === 'pack10'
      ? selectedVariantData.price10Tomans
      : selectedVariantData.price20Tomans;

  const currentSku =
    selectedPackSize === 'pack10'
      ? selectedVariantData.sku10
      : selectedVariantData.sku20;

  const handleAddToCart = () => {
    const packTitle =
      selectedPackSize === 'pack10'
        ? `باکس ۱۰ عددی کلینیکال`
        : `پک سالنی و اقتصادی ۲۰ عددی`;

    addItem(
      {
        variantId: `${selectedVariantData.id}-${selectedPackSize}`,
        productId: 'prod_clinical_carboxypod',
        title: `${selectedVariantData.nameFa} (${packTitle})`,
        sku: currentSku,
        priceAmount: currentPriceRials,
        image: selectedVariantData.heroImg,
      },
      quantity
    );

    setIsAddedToCart(true);
    openDrawer();
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <div className="carboxypod-page">
      <div className="cpod-ambient-glow" />

      <div className="cpod-container">
        {/* ── TOP BREADCRUMB BAR ── */}
        <div className="cpod-top-bar">
          <div className="cpod-breadcrumbs">
            <Link href="/">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/reeskin">لاین درموسوتیکال ReeSkin™</Link>
            <span>/</span>
            <span style={{ color: '#f8fafc', fontWeight: 800 }}>پادهای فعال‌ساز CarboxyPod™</span>
          </div>

          <div className="cpod-reg-badge">
            <span className="dot" />
            <span>فناوری ثبت‌شده اثر بوهر (Bohr Effect)</span>
            <span>•</span>
            <span style={{ fontFamily: 'monospace' }}>Dr Dermer UK Laboratories</span>
          </div>
        </div>

        {/* ── HERO SECTION ── */}
        <section className="cpod-hero-grid">
          <div className="cpod-hero-content">
            <div className="cpod-hero-badges">
              <span className="cpod-badge-primary">فناوری انحصاری نسل جدید کربوکسی</span>
              <span className="cpod-badge-secondary">DUAL CHEMICAL & MECHANICAL RESURFACING</span>
            </div>

            <div style={{ marginBottom: '-6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.04em' }}>
                Imagine an Innovative and Effective Method — Discover the Future of Skincare
              </span>
            </div>

            <h1 className="cpod-main-headline">
              پادهای فعال‌ساز کربوکسی‌پاد:{' '}
              <span className="gradient-text">لایه‌برداری و آزادسازی آنی گاز CO₂</span>
            </h1>

            <p className="cpod-lead-description">
              کپسول‌های درمانی فشرده <strong>ReeSkin CarboxyPod™</strong> با ساختار متخلخل فیبریک، نسل نوین
              لایه‌برداری دوگانه شیمیایی و مکانیکی را محقق می‌سازند. با قرارگیری بر روی ژل قلیایی CarboxyGel،
              آزادسازی متراکم بیش از ۱۲۰۰ پی‌پی‌ام گاز CO₂ آغاز شده و از طریق اتساع مویرگی اثر بوهر، جذب
              ترکیبات موثره ویتامینه و آبرسان را به حداکثر می‌رساند.
            </p>

            {/* Quick Hero Telemetry */}
            <div className="cpod-quick-stats">
              <div className="cpod-stat-item">
                <span className="cpod-stat-num">&gt; 1200 ppm</span>
                <span className="cpod-stat-label">غلظت ترنس‌درمال گاز دی‌اکسید کربن</span>
              </div>
              <div className="cpod-stat-item">
                <span className="cpod-stat-num">120 Hz</span>
                <span className="cpod-stat-label">سازگاری با هندپیس اولتراسونیک CarboX</span>
              </div>
              <div className="cpod-stat-item">
                <span className="cpod-stat-num">3 Variants</span>
                <span className="cpod-stat-label">فرمولاسیون اختصاصی (Vitamin, Carbon, Hydra)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="cpod-action-buttons">
              <a href="#order-configurator" className="cpod-btn-cta">
                <span>ثبت سفارش باکس ۱۰ و ۲۰ عددی</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </a>

              <a href="#stage-breakdown" className="cpod-btn-sub">
                <span>آناتومی ۳ لایه CarboxyPod</span>
              </a>

              <Link href="/carbox" className="cpod-btn-sub" style={{ borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
                <span>بررسی هندپیس در دستگاه CarboX ←</span>
              </Link>
            </div>
          </div>

          {/* Real Product Showcase */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-3 py-1 rounded-full">
                  OFFICIAL PRODUCT SHOWCASE
                </span>
                <span className="text-xs text-slate-400 font-mono">100% Medical Grade</span>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="bg-slate-950/70 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="h-44 flex items-center justify-center mb-2">
                    <img
                      src="/assets/drdermer/2025/07/carbon-carboxypod-1.png"
                      alt="Carbon CarboxyPod Showcase"
                      className="max-h-full max-w-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-200">Carbon CarboxyPod™</span>
                  <span className="text-[11px] text-slate-400">دتوکس و تصفیه سبوم</span>
                </div>

                <div className="bg-slate-950/70 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="h-44 flex items-center justify-center mb-2">
                    <img
                      src="/assets/drdermer/2025/07/1-vitapod-1-1-2.png"
                      alt="Vitamin CarboxyPod Showcase"
                      className="max-h-full max-w-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-200">Vitamin CarboxyPod™</span>
                  <span className="text-[11px] text-slate-400">تغذیه و ضدچروک</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>تکنولوژی بسته‌بندی تک‌نفره وکیوم با گاز خنثی نیتروژن</span>
                <span className="text-emerald-400 font-bold">بدون افت فعالیت آنزیمی</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── MULTI-CANVAS / MULTI-STAGE BREAKDOWN OF CARBOXYPOD ── */}
        <section id="stage-breakdown" className="cpod-stage-section">
          <div className="cpod-section-header">
            <span className="cpod-section-eyebrow">Interactive 360 Engineering Breakdown</span>
            <h2 className="cpod-section-title">کالبدشکافی مهندسی و عملکرد ۳ لایه‌ای CarboxyPod</h2>
            <p className="cpod-section-subtitle">
              بررسی تعاملی زاویه به زاویه سطح مقعر اسکراب، مغزی شیمیایی واکنش‌دهنده و سازوکار اتصال به هندپیس
            </p>
          </div>

          {/* Stage Tabs Navigation */}
          <div className="cpod-stage-tabs-nav">
            {POD_STAGES.map((stage, idx) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageId(stage.id)}
                className={`cpod-stage-tab-btn ${activeStageId === stage.id ? 'active' : ''}`}
              >
                <span className="tab-number">{idx + 1}</span>
                <span>{stage.titleFa}</span>
              </button>
            ))}
          </div>

          {/* Interactive Viewer Card */}
          <div className="cpod-stage-viewer-grid">
            {/* 360 HTML5 Canvas Player Column */}
            <div className="cpod-stage-player-col">
              <CanvasSequencePlayer
                key={currentStage.id}
                frameFolder={currentStage.sequenceFolder}
                totalFrames={currentStage.totalFrames}
                framePrefix={currentStage.framePrefix}
                padDigits={currentStage.padDigits}
                fileExtension={currentStage.fileExt}
                autoRotate={true}
                autoRotateSpeedMs={65}
                aspectRatio={currentStage.aspectRatio}
                overlayHotspots={currentStage.hotspots}
                label={`نمای تعاملی ۳۶۰ درجه: ${currentStage.titleFa}`}
              />
            </div>

            {/* Stage Clinical Details Column */}
            <div className="cpod-stage-info-col">
              <div className="cpod-stage-info-header">
                <span className="cpod-stage-tag">{currentStage.tag}</span>
                <h3 className="cpod-stage-title">{currentStage.titleFa}</h3>
                <span style={{ fontSize: '0.76rem', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '8px' }}>
                  {currentStage.titleEn}
                </span>
                <p className="cpod-stage-desc">{currentStage.desc}</p>
              </div>

              <ul className="cpod-stage-features-list">
                {currentStage.features.map((feat, fIdx) => (
                  <li key={fIdx} className="cpod-stage-feature-item">
                    <span className="icon">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800">
                {currentStage.specs.map((sp, sIdx) => (
                  <div key={sIdx} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5">{sp.label}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── THE 3 SCRUB POD VARIANTS IN CLINICAL DETAIL ── */}
        <section className="cpod-variants-section">
          <div className="cpod-section-header">
            <span className="cpod-section-eyebrow">Dermatological Formulations</span>
            <h2 className="cpod-section-title">۳ واریانت اسکراب‌پاد متناسب با تایپ‌های پوستی</h2>
            <p className="cpod-section-subtitle">
              هر کپسول به صورت هدفمند با کمپلکس‌های نانومولکولی فعال و اسیدهای پایدار متراکم شده است
            </p>
          </div>

          <div className="cpod-variant-cards-grid">
            {POD_VARIANTS.map((variant) => (
              <div key={variant.id} className={`cpod-variant-card ${variant.themeClass}`}>
                <div>
                  <div className="cpod-variant-badge-row">
                    <span className="cpod-variant-badge">{variant.badge}</span>
                    <span className="text-[11px] font-mono text-slate-400">باکس ۱۰ یا ۲۰ ساشه</span>
                  </div>

                  <div className="cpod-variant-img-box">
                    <img src={variant.heroImg} alt={variant.nameFa} />
                  </div>

                  <h3 className="cpod-variant-title-fa">{variant.nameFa}</h3>
                  <div className="cpod-variant-title-en">{variant.nameEn}</div>
                  <p className="cpod-variant-summary">{variant.subtitle}</p>

                  <div className="cpod-variant-actives-box">
                    <span className="cpod-variant-actives-label">{variant.activesTitle}</span>
                    <ul className="space-y-1 text-right text-[11px] text-slate-300">
                      {variant.activesList.map((act, aIdx) => (
                        <li key={aIdx} className="leading-relaxed">
                          • {act}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-300 block mb-1">مکانیسم بیوشیمیایی اثر:</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{variant.mechanism}</p>
                  </div>
                </div>

                <div className="cpod-variant-footer">
                  <div className="cpod-variant-indications">
                    <strong className="text-slate-300">اندیکاسیون بالینی:</strong> {variant.indications}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">شروع قیمت از:</span>
                      <strong className="text-sm font-bold text-emerald-400">{variant.price10Tomans} تومان</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVariantKey(variant.variantKey);
                        const el = document.getElementById('order-configurator');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition"
                    >
                      انتخاب این مدل ←
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── INTERACTIVE USAGE GUIDE (STEP SIMULATOR) ── */}
        <section className="cpod-usage-section">
          <div className="cpod-section-header">
            <span className="cpod-section-eyebrow">Clinical Protocol & Synergistic Usage</span>
            <h2 className="cpod-section-title">راهنمای گام‌به‌گام تعاملی: هندپیس اولتراسونیک و ژل CarboxyGel</h2>
            <p className="cpod-section-subtitle">
              پروتکل رسمی کلینیک‌های زیبایی برای فعال‌سازی حداکثری گاز دی‌اکسید کربن و اثر بوهر بدون سوزن
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="cpod-protocol-tabs">
            {USAGE_STEPS.map((st, idx) => (
              <button
                key={st.step}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`cpod-protocol-step-btn ${activeStepIndex === idx ? 'active' : ''}`}
              >
                <span className="step-badge">{st.badge}</span>
                <span className="step-label">{st.label}</span>
              </button>
            ))}
          </div>

          {/* Step Detail Panel */}
          <div className="cpod-protocol-panel">
            <div className="cpod-protocol-text">
              <span className="text-xs font-mono font-bold text-emerald-400 block mb-2">
                {currentUsageStep.badge}
              </span>
              <h3>{currentUsageStep.title}</h3>
              <p>{currentUsageStep.desc}</p>

              {currentUsageStep.formula && (
                <div className="mb-4">
                  <span className="text-xs text-slate-400 block mb-1">واکنش شیمیایی سنتز گاز:</span>
                  <div className="cpod-chemical-formula">{currentUsageStep.formula}</div>
                </div>
              )}

              <div className="cpod-protocol-tips">
                <span className="font-bold text-slate-200">نکات کلیدی برای اپراتور و پزشک:</span>
                {currentUsageStep.proTips.map((tip, tIdx) => (
                  <span key={tIdx}>• {tip}</span>
                ))}
              </div>
            </div>

            <div className="cpod-protocol-visual">
              <img src={currentUsageStep.img} alt={currentUsageStep.title} />

              <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">{currentUsageStep.gaugeLabel}</span>
                <span className="text-sm font-mono font-black text-emerald-400">
                  {currentUsageStep.gaugeValue}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── DIRECT CTA TO ORDER 10-PACKS OR SALON PACKS ── */}
        <section id="order-configurator" className="cpod-order-section">
          <div className="cpod-order-card">
            {/* Info Column */}
            <div className="cpod-order-info">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
                <span>تضمین اصالت کالا و تحویل اکسپرس</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono">Direct Clinic Dispatch</span>
              </div>

              <h2>سفارش مستقیم پادهای اورجینال ReeSkin CarboxyPod™</h2>
              <p>
                امکان تهیه در بسته‌های ۱۰ عددی مصرف دوره‌ای و پکیج‌های سالنی و کلینیکال ۲۰ عددی با تخفیف
                ویژه مراکز درمانی. کلیه سفارش‌ها همراه با هولوگرام اصالت، تاریخ انقضای معتبر و بروشور پروتکل بالینی ارسال می‌گردند.
              </p>

              <div className="cpod-order-perks">
                <div className="cpod-perk-item">
                  <span className="check">✓</span>
                  <span>ارسال فوری با بسته‌بندی ایمن کالیبره‌شده</span>
                </div>
                <div className="cpod-perk-item">
                  <span className="check">✓</span>
                  <span>تخفیف همکاری پلکانی ویژه سفارش‌های سالنی</span>
                </div>
                <div className="cpod-perk-item">
                  <span className="check">✓</span>
                  <span>مشاوره تخصصی با کارشناس بالینی برند</span>
                </div>
                <div className="cpod-perk-item">
                  <span className="check">✓</span>
                  <span>امکان پرداخت آنلاین شتابی یا فاکتور رسمی B2B</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800 pt-4">
                <span>نیاز به خرید عمده یا قرارداد سالیانه دارید؟</span>
                <Link href="/b2b?kit=carboxypod" className="text-emerald-400 hover:text-emerald-300 font-bold underline">
                  ورود به پنل تأمین کلینیک B2B ←
                </Link>
              </div>
            </div>

            {/* Configurator Column */}
            <div className="cpod-config-box">
              {/* Variant Selector */}
              <div className="cpod-config-group">
                <label>۱. انتخاب فرمولاسیون اسکراب‌پاد:</label>
                <div className="grid grid-cols-3 gap-2">
                  {POD_VARIANTS.map((v) => (
                    <button
                      key={v.variantKey}
                      type="button"
                      onClick={() => setSelectedVariantKey(v.variantKey)}
                      className={`cpod-pill-btn ${selectedVariantKey === v.variantKey ? 'selected' : ''}`}
                    >
                      {v.variantKey === 'vitamin' && 'ویتامینه'}
                      {v.variantKey === 'carbon' && 'کربن اکتیو'}
                      {v.variantKey === 'hydra' && 'هیدرا آبرسان'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pack Size Selector */}
              <div className="cpod-config-group">
                <label>۲. سایز بسته‌بندی:</label>
                <div className="cpod-pill-options">
                  <button
                    type="button"
                    onClick={() => setSelectedPackSize('pack10')}
                    className={`cpod-pill-btn ${selectedPackSize === 'pack10' ? 'selected' : ''}`}
                  >
                    <span>باکس ۱۰ عددی کلینیکال</span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8' }}>
                      مناسب ۱۰ جلسه درمان
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPackSize('pack20')}
                    className={`cpod-pill-btn ${selectedPackSize === 'pack20' ? 'selected' : ''}`}
                  >
                    <span>پک سالنی ۲۰ عددی</span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#34d399' }}>
                      اقتصادی و تخفیف ویژه
                    </span>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="cpod-qty-row">
                <span className="text-xs font-bold text-slate-300">تعداد بسته‌ها:</span>
                <div className="cpod-qty-controls">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="cpod-qty-btn"
                  >
                    -
                  </button>
                  <span className="cpod-qty-num">{quantity}</span>
                  <button
                    type="button"
                    disabled={quantity >= 20}
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="cpod-qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Live Price Calculation */}
              <div className="cpod-price-summary">
                <div>
                  <span className="text-xs text-slate-400 block">مبلغ نهایی سفارش:</span>
                  <span className="text-[11px] text-slate-400 font-mono">SKU: {currentSku}</span>
                </div>
                <div>
                  <span className="cpod-price-val">
                    {formatToman(BigInt(currentPriceRials) * BigInt(quantity))}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`cpod-order-btn ${isAddedToCart ? 'added' : ''}`}
              >
                {isAddedToCart ? (
                  <>
                    <span>✓ به سبد خرید اضافه شد</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span>افزودن به سبد خرید و تسویه</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ── TECHNICAL & INGREDIENT MATRIX TABLE ── */}
        <section className="py-12 border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-white mb-2">جدول مقایسه فنی و بیوشیمیایی واریانت‌ها</h3>
            <p className="text-xs text-slate-400">انطباق با استانداردهای داروسازی فارماکوپه انگلستان (BP / USP)</p>
          </div>

          <div className="overflow-x-auto bg-slate-900/60 rounded-2xl border border-slate-800 p-2">
            <table className="cpod-specs-table">
              <thead>
                <tr>
                  <th>پارامتر بالینی</th>
                  <th>Vitamin CarboxyPod™</th>
                  <th>Carbon CarboxyPod™</th>
                  <th>Hydra CarboxyPod™</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold text-white">ترکیبات شاخص</td>
                  <td>Niacinamide, Vitamin C, B5, Retinyl</td>
                  <td>Activated Carbon, Niacinamide, Zinc PCA</td>
                  <td>Hyaluronic Acid, Aloe Vera, Allantoin</td>
                </tr>
                <tr>
                  <td className="font-bold text-white">هدف درمانی اصلی</td>
                  <td>روشن‌کنندگی و تحریک کلاژن‌سازی</td>
                  <td>تنظیم سبوم و پاکسازی کومدون‌ها</td>
                  <td>آبرسانی عمیق و انقباض منافذ</td>
                </tr>
                <tr>
                  <td className="font-bold text-white">سازگاری با هندپیس اولتراسونیک</td>
                  <td>۱۲۰ هرتز سینوسی CarboX</td>
                  <td>۱۲۰ هرتز سینوسی CarboX</td>
                  <td>۱۲۰ هرتز سینوسی CarboX</td>
                </tr>
                <tr>
                  <td className="font-bold text-white">غلظت CO₂ تولیدی</td>
                  <td>&gt; ۱٬۲۵۰ پی‌پی‌ام</td>
                  <td>&gt; ۱٬۲۰۰ پی‌پی‌ام</td>
                  <td>&gt; ۱٬۲۰۰ پی‌پی‌ام</td>
                </tr>
                <tr>
                  <td className="font-bold text-white">بسته‌بندی استریل</td>
                  <td>ساشه فویل آلومینیوم گاما</td>
                  <td>ساشه فویل آلومینیوم گاما</td>
                  <td>ساشه فویل آلومینیوم گاما</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
