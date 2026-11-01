'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import './carboxygel.css';
import { useCart } from '../../components/cart';
import { useLocalizedFormatter } from '../../lib/use-localized-formatter';

/* ── 3 Formulations Breakdown Data ── */
interface FormulationItem {
  id: string;
  nameEn: string;
  nameFa: string;
  subtitleFa: string;
  badge: string;
  badgeClass: 'glycolic' | 'multi' | 'azelaic';
  ph: string;
  indication: string;
  targetConcerns: string[];
  keyActives: string;
  biochemicalMechanism: string;
  image: string;
  accentColor: string;
  clinicalResult: string;
}

const FORMULATIONS: FormulationItem[] = [
  {
    id: 'glycolic',
    nameEn: 'Glycolic Acid CarboxyGel',
    nameFa: 'کربوکسی‌ژل گلیکولیک اسید',
    subtitleFa: 'روشن‌کنندگی و لایه‌برداری عمقی اپیدرم',
    badge: 'DEEP EXFOLIATION & WHITENING',
    badgeClass: 'glycolic',
    ph: 'pH 3.5 – 3.8',
    indication: 'ملاسما، پیگمانتاسیون ناشی از آفتاب، کدری چهره، خطوط ریز استراتوم کورنئوم و هایپرکراتوز',
    targetConcerns: [
      'روشن‌سازی پیگمانتاسیون تا ۴۲٪ طی ۴ جلسه',
      'تخلیه کراتینوسیت‌های متراکم و مرده سطحی',
      'یکدست‌سازی تناژ و درخشش چشمگیر بافت',
    ],
    keyActives: 'Glycolic Acid 6% (Ph. Eur.), Sodium Bicarbonate, Centella Asiatica 40%, Allantoin',
    biochemicalMechanism:
      'آلفاهیدروکسی اسید کوچک‌مولکول گلیکولیک ضمن نفوذ سریع به اتصالات دسموزومی، پیوندهای بین‌سلولی لایه شاخی را سست کرده و بستری ایده‌آل برای نفوذ عمقی گاز CO₂ و القای اکسیژناسیون بافتی فراهم می‌آورد.',
    image: '/assets/drdermer/2025/07/glycolic-acid-carboxygel.png',
    accentColor: '#eab308',
    clinicalResult: 'کاهش لک‌های مقاوم و نوسازی یکنواخت بافت پوست بدون پوسته‌ریزی التهابی',
  },
  {
    id: 'multi-active',
    nameEn: 'Multi-Active CarboxyGel',
    nameFa: 'کربوکسی‌ژل مولتی‌اکتیو',
    subtitleFa: 'جوانسازی سلولی، نئوکلاژنز و لیفتینگ چندمنظوره',
    badge: 'CELLULAR REJUVENATION & ANTI-AGING',
    badgeClass: 'multi',
    ph: 'pH 3.8 – 4.1',
    indication: 'افتادگی درم، خطوط داینامیک و استاتیک صورت و گردن، خستگی ماتریکس سلولی و کاهش تراکم فیبروبلاست‌ها',
    targetConcerns: [
      'افزایش ۳.۴ برابری سنتز کلاژن نوع ۱ و ۳',
      'تقویت ماتریکس خارج سلولی (ECM) و لیفت قوام پوست',
      'آبرسانی ۳ سطحی با هیالورونیک اسید چندمولکولی',
    ],
    keyActives: 'Biomimetic Copper Tripeptides (GHK-Cu), Multi-Weight HA 2.0%, Niacinamide 4%, Adenosine',
    biochemicalMechanism:
      'ترکیب پپتیدهای مس و آدنوزین با افزایش اکسیژن موضعی ناشی از اثر بوهر هم‌افزایی ایجاد نموده و فعالیت میتوکندریایی فیبروبلاست‌ها را در ترشح پیش‌سازهای الاستین و پروکلاژن به حداکثر می‌رساند.',
    image: '/assets/drdermer/2025/07/multi-active-carboxygel.png',
    accentColor: '#10b981',
    clinicalResult: 'افزایش الاستیسیته و استحکام بافت پوست با بهبود چشمگیر خطوط لبخند و پیشانی',
  },
  {
    id: 'azelaic',
    nameEn: 'Azelaic Acid CarboxyGel',
    nameFa: 'کربوکسی‌ژل آزالائیک اسید',
    subtitleFa: 'مهار آکنه فعال، کنترل قرمزی، رزبور و لک‌های التهابی (PIH)',
    badge: 'ACNE, REDNESS & PIGMENTATION CONTROL',
    badgeClass: 'azelaic',
    ph: 'pH 3.6 – 3.8',
    indication: 'پوست‌های مستعد آکنه التهابی و کومدون، رزاسه و اریتمای مزمن، لک‌های به جای مانده از جای جوش و چربی اضافی',
    targetConcerns: [
      'مهار باکتری Cutibacterium acnes تا ۹۹.۴٪',
      'تنظیم ترشح سبوم و جمع‌کردن منافذ باز متسع',
      'کاهش تیرگی پس از التهاب (Post-Inflammatory Hyperpigmentation)',
    ],
    keyActives: 'Azelaic Acid 8.0% Micro-Encapsulated, Zinc PCA 1.5%, Bisabolol, Madecassoside',
    biochemicalMechanism:
      'اسید آزالائیک مسیر آنزیم ۵-آلفا ردوکتاز و تیروزیناز را مهار کرده و همزمان اکسیژن بالای بافت حاصل از اثر بوهر، محیط بی‌هوازی مورد نیاز باکتری‌های مولد آکنه را تخریب و خنثی می‌سازد.',
    image: '/assets/drdermer/2025/07/azelaic-acid-carboxygel.png',
    accentColor: '#38bdf8',
    clinicalResult: 'مهار فوری کانون‌های التهابی جوش، کاهش تورم و مات‌شدن ماندگار ترشح چربی',
  },
];

/* ── Step-by-Step Clinical Protocol Steps ── */
interface ProtocolStep {
  step: number;
  title: string;
  action: string;
  duration: string;
  clinicalTip: string;
}

const CLINICAL_PROTOCOL_STEPS: ProtocolStep[] = [
  {
    step: 1,
    title: 'پاکسازی عمقی و چربی‌زدایی استریل (Pre-Treatment Degreasing)',
    action:
      'پوست صورت و گردن بیمار را با شوینده دارویی ملایم بدون سولفات شسته و با گاز استریل کاملاً خشک نمایید. هیچ‌گونه اثر چربی، لوسیون یا رطوبت نباید روی سد پوست باقی بماند.',
    duration: '۲ الی ۳ دقیقه',
    clinicalTip: 'خشک بودن کامل پوست شرط اصلی پایداری تماس لایه ژل کربوکسی با پد فعال‌ساز است.',
  },
  {
    step: 2,
    title: 'اپلیکاسیون یکنواخت ژل CarboxyGel (Gel Application)',
    action:
      'مقدار ۲۵ تا ۳۰ میلی‌لیتر از فرمولاسیون انتخابی (یا کارتریج دوزینگ) را با ضخامت حداقل ۱.۵ میلی‌متر با کاردک سیلیکونی استریل به صورت یکدست روی کل صورت به جز محدوده پلک و مخاط لب بمالید.',
    duration: '۲ دقیقه',
    clinicalTip: 'ضخامت ناکافی ژل منجر به هدررفت گاز به هوای محیط و کاهش راندمان ترنس‌درمال می‌شود.',
  },
  {
    step: 3,
    title: 'اعمال ماسک فعال‌ساز آلکالاین و القای واکنش بوهر (Mask Coupling)',
    action:
      'پد کاتالیزور پیش‌برش‌خورده CarboxyPad یا شیت ماسک آلکالاین را بر روی ژل فیکس کنید و با نوک انگشتان یا هندپیس اولتراسونیک CarboX ضربات ملایم وارد کنید. صدای جوشش میکروحباب‌های گاز CO₂ بلافاصله آغاز می‌شود.',
    duration: '۲۰ الی ۲۵ دقیقه مکث فعال',
    clinicalTip: 'احساس گرمای موضعی، گزگز ملایم و اریتمای خفیف نشانه قطعی وازودیلاتاسیون و رهایش اکسیژن است.',
  },
  {
    step: 4,
    title: 'حذف پد و پاکسازی پسماند ژل (Neutralization & Rinse)',
    action:
      'پد را از پایین چانه به سمت بالا برداشته، با کاردک پلاستیکی مازاد ژل مصرف‌شده را جمع‌آوری کنید و با اسفنج مرطوب آغشته به آب مقطر ولرم بافت پوست را تمیز نمایید.',
    duration: '۳ دقیقه',
    clinicalTip: 'پوست در این لحظه در اوج نفوذپذیری فیزیولوژیک (Hyper-Permeability) قرار دارد.',
  },
  {
    step: 5,
    title: 'استفاده از سرم ترمیم‌کننده و کرم محافظ (Post-Procedure Cica)',
    action:
      'بلافاصله از ژل التیام‌بخش Healene یا سرم هیالورونیک اسید سه وزن مولکولی استفاده کنید. در پایان در نوبت روز، استفاده از ضدآفتاب مینرال با فاکتور حفاظتی SPF 50+ الزامی است.',
    duration: 'مراقبت پس از درمان',
    clinicalTip: 'تا ۱۲ ساعت از شستشو با صابون‌های قلیایی و میکاپ سنگین خودداری گردد.',
  },
];

export default function CarboxygelLandingPage() {
  const { addItem, openDrawer } = useCart();
  const { formatToman } = useLocalizedFormatter();

  // Active showcase image tab
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // 4 Gallery images
  const showcaseImages = [
    {
      src: '/assets/drdermer/2025/07/azelaic-acid-carboxygel.png',
      alt: 'ReeSkin Azelaic Acid CarboxyGel Pro 500ml',
      label: 'آزالائیک اسید',
      desc: 'بسته‌بندی رسمی Pro کابین کلینیکال',
    },
    {
      src: '/assets/drdermer/2025/07/dr-dermer-carboxy-gel-1-1024x835.png',
      alt: 'CarboxyGel Active Matrix Texture Close-up',
      label: 'بافت ژل CO2',
      desc: 'میکروحباب‌های آزادشونده گاز کربن دی‌اکسید',
    },
    {
      src: '/assets/drdermer/2025/07/glycolic-acid-carboxygel.png',
      alt: 'ReeSkin Glycolic Acid CarboxyGel 500ml',
      label: 'گلیکولیک اسید',
      desc: 'فرمولاسیون روشن‌کننده و لایه‌بردار',
    },
    {
      src: '/assets/drdermer/2025/07/multi-active-carboxygel.png',
      alt: 'ReeSkin Multi-Active CarboxyGel 500ml',
      label: 'مولتی‌اکتیو',
      desc: 'فرمولاسیون پپتیدی جوانسازی جامع',
    },
  ];

  // Active formulation tab in breakdown
  const [selectedFormulaId, setSelectedFormulaId] = useState('azelaic');

  // Interactive Bohr Effect Simulator state (0 to 100% CO2 saturation)
  const [co2Level, setCo2Level] = useState<number>(75);
  const [activeBohrStage, setActiveBohrStage] = useState<number>(2);

  // 5-Phase Reaction Timeline state
  const [activeReactionPhase, setActiveReactionPhase] = useState<number>(1);

  // INCI breakdown state
  const [selectedInciItem, setSelectedInciItem] = useState<number>(0);

  // 5 Biochemical Reaction Phases
  const reactionPhases = [
    {
      phase: 1,
      title: '۱. تثبیت ماتریکس آلکالاین ژل و پد فعال‌ساز',
      titleEn: 'Gel Spreading & Acid-Base Coupling',
      timing: 'ثانیه‌های ۰ تا ۱۵',
      desc: 'ژل غنی از سدیم بی‌کربنات با ضخامت ۱.۵ میلی‌متر روی پوست قرار گرفته و پد میکروکریستالی اسید سیتریک به آن متصل می‌شود. رطوبت ژل کریستال‌های اسید را هیدراته و حل می‌نماید.',
      molecularKey: '3 NaHCO₃ (Gel) + C₆H₈O₇ (Pad) ⟶ Na₃C₆H₅O₇ + 3 H₂O + 3 CO₂ ⇈',
    },
    {
      phase: 2,
      title: '۲. جوشش پرفشار و تولید محفظه نانوحباب‌های CO₂',
      titleEn: 'High-Density CO₂ Trapping Chamber',
      timing: 'ثانیه‌های ۱۵ تا ۹۰',
      desc: 'واکنش خنثی‌سازی اسید-باز میکروحباب‌های اشباع گاز دی‌اکسید کربن را با فشار مثبت در سطح پوست آزاد می‌کند. الیاف پد مانع هدررفت گاز به هوا شده و غلظت موضعی را به بیش از ۱۰۰۰ppm می‌رسانند.',
      molecularKey: 'تراکم بیش از ۱۰۰۰ppm گاز کربن دی‌اکسید بر سطح لایه شاخی',
    },
    {
      phase: 3,
      title: '۳. نفوذ ترنس‌درمال گاز دی‌اکسید کربن به درم',
      titleEn: 'Transdermal CO₂ Diffusion',
      timing: 'دقیقه‌های ۲ تا ۷',
      desc: 'مولکول‌های بی‌بار CO₂ با ضریب نفوذ بسیار بالا از اتصالات بین سلول‌های لایه شاخی (Stratum Corneum) عبور کرده و وارد مایع بین‌سلولی اپیدرم و درم رتیکولار می‌شوند.',
      molecularKey: 'نفوذ گاز حل‌شده در فاز آبی اپیدرم با گرادیان غلظت مثبت بدون سوزن',
    },
    {
      phase: 4,
      title: '۴. القای اثر بوهر و تخلیه انفجاری اکسیژن مویرگی',
      titleEn: 'The Bohr Effect & Capillary O₂ Ejection',
      timing: 'دقیقه‌های ۷ تا ۱۸',
      desc: 'ورود CO₂ و هیدراتاسیون آن اسیدیته موضعی را اندکی کاهش می‌دهد. این تغییر pH میل ترکیبی هموگلوبین را شکسته و گلبول‌های قرمز خون اکسیژن خالص خود را به سمت سلول‌های گرسنه پوست آزاد می‌کنند.',
      molecularKey: 'افزایش اشباع اکسیژن بافتی (O₂) تا ۳ برابر و اتساع عروقی (Vasodilation)',
    },
    {
      phase: 5,
      title: '۵. فعال‌سازی نئوکلاژنز، ATP میتوکندری و ریکاوری',
      titleEn: 'ATP Surge & Neocollagenesis Phase',
      timing: 'دقیقه‌های ۱۸ تا ۲۵+',
      desc: 'اکسیژن سرشار میتوکندری‌های فیبروبلاست‌ها را فعال نموده و ساخت انرژی ATP را تا ۳.۴ برابر تقویت می‌کند. پیش‌سازهای پروکلاژن و الاستین سنتز شده و بافت سفت و درخشان می‌گردد.',
      molecularKey: 'افزایش ۳.۴ برابری سنتز کلاژن تیپ ۱ و ۳ و بازسازی ماتریکس خارج‌سلولی',
    },
  ];

  // Full INCI Ingredients Breakdown Data
  const inciBreakdown = [
    {
      nameFa: 'کمپلکس فعال‌ساز CO₂ (سدیم بی‌کربنات + اسید سیتریک)',
      nameEn: 'Sodium Bicarbonate, Citric Acid Micro-Complex',
      percentage: '8.50%',
      purity: '۹۹.۹٪ گرید دارویی فارماکوپه اروپا (Ph. Eur.)',
      role: 'آزادسازی گاز دی‌اکسید کربن خالص و القای اثر بوهر',
      mechanism: 'پروتون‌دار شدن یون بی‌کربنات توسط اسید سیتریک در ماتریکس ژل، میکروحباب‌های اشباع گاز CO₂ تولید می‌کند که شیفت فوری منحنی تفکیک اکسی‌هموگلوبین به راست را کلید می‌زند.',
    },
    {
      nameFa: 'عصاره برگ سنتلا آسیاتیکا (مادکاسوساید ۴۰٪)',
      nameEn: 'Centella Asiatica Leaf Extract (Madecassoside)',
      percentage: '5.00%',
      purity: '۹۵.۵٪ تیتر تری‌ترپنوئید فعال استاندارد',
      role: 'ترمیم‌کننده عمقی، ضدالتهاب و مهار قرمزی اریتما',
      mechanism: 'تحریک سیگنالینگ TGF-beta و فاکتور رشد فیبروبلاستی FGF-2، مهار آنزیم کلاژناز نوع ۱ و ارتقای چشمگیر اپیتلیزاسیون سد پوست همراه با مهار سایتوکین‌های TNF-α و IL-6.',
    },
    {
      nameFa: 'نیاسینامید دارویی (ویتامین B3 خلوص ۹۹.۸٪)',
      nameEn: 'Niacinamide (Cosmetic Grade 99.8%)',
      percentage: '4.00%',
      purity: '۹۹.۸٪ گرید درماتولوژیک با نیکوتینیک اسید آزاد زیر ۱۰ppm',
      role: 'تقویت سد دفاعی پوست، مهار لک و کنترل سبوم',
      mechanism: 'ارتقای کوآنزیم‌های درون‌سلولی NAD+ و NADPH، تحریک بیوسنتز سرامیدها و اسیدهای چرب آزاد، مهار انتقال ملانوزوم‌ها از ملانوسیت به کراتینوسیت تا ۶۸٪.',
    },
    {
      nameFa: 'هیالورونیک اسید با سه وزن مولکولی (Multi-Weight HA)',
      nameEn: 'Sodium Hyaluronate Multi-Molecular Complex',
      percentage: '2.00%',
      purity: 'گرید زیست‌تخمیر مدیکال بیوتکنولوژی',
      role: 'آبرسانی عمیق چندلایه از سطح تا اعماق درم',
      mechanism: 'پیوند هیدروژنی با ۱۰۰۰ برابر وزن خود آب؛ زنجیره‌های ۵۰ کیلودالتون گیرنده‌های CD44 درم را برای تحریک ساخت اسید هیالورونیک درون‌زاد فعال می‌کنند.',
    },
    {
      nameFa: 'گلیسیرین گیاهی گرید دارویی (Glycerin USP)',
      nameEn: 'Glycerin (Plant Origin 99.7%)',
      percentage: '3.00%',
      purity: '۹۹.۷٪ گرید دارویی گیاهی USP/BP',
      role: 'هومکتانت طبیعی و بهبود ویسکوزیته و روانی ژل',
      mechanism: 'بهبود سیالیت ترنس‌اپیدرمال و فعال‌سازی کانال‌های آکواپورین-۳ (AQP3) سلولی جهت انتقال آب و گلیسرول.',
    },
    {
      nameFa: 'آلانتوئین خالص تسکین‌دهنده (Allantoin)',
      nameEn: 'Allantoin',
      percentage: '0.50%',
      purity: '۹۹.۰٪ خلوص کریستالی فارماکوپه آمریکا (USP)',
      role: 'کاهش سوزش اولیه گاز و نرم‌کننده پوست',
      mechanism: 'تسکین گیرنده‌های حسی موضعی پوست و کراتولیتیک ملایم تکثیر سلولی اپیتلیال جهت مهار هرگونه احساس ناخوشایند حین واکنش.',
    },
  ];

  // Biological computations
  const localPh = (7.40 - (co2Level / 100) * 0.28).toFixed(2);
  const o2DeliveryPercent = Math.round(18 + (co2Level / 100) * 78);
  const vasodilationPercent = Math.round(100 + (co2Level / 100) * 145);
  const atpCollagenSynthesisMultiplier = (1.0 + (co2Level / 100) * 2.8).toFixed(1);

  // Interactive Bohr Stages
  const bohrStages = [
    {
      stage: 1,
      title: '۱. نفوذ ترنس‌درمال حباب‌های CO₂',
      sub: 'CO₂ Transdermal Diffusion',
      co2Target: 25,
      desc: 'با فعال‌شدن ژل و پد، میکروحباب‌های اشباع گاز دی‌اکسید کربن از لایه شاخی عبور کرده و بدون نیاز به سوزن وارد مایع بین‌سلولی اپیدرم و درم می‌شوند.',
    },
    {
      stage: 2,
      title: '۲. افت اسیدیته موضعی و کاهش تمایل Hb',
      sub: 'Decreased Hemoglobin O₂ Affinity',
      co2Target: 55,
      desc: 'یون هیدروژن حاصل از هیدراتاسیون دی‌اکسید کربن، pH را اندکی کاهش می‌دهد. این تغییر، میل پیوندی هموگلوبین به اکسیژن را شدیداً تضعیف کرده و پدیده بوهر را کلید می‌زند.',
    },
    {
      stage: 3,
      title: '۳. رهایش انفجاری O₂ در بافت هیپوکسیک',
      sub: 'Burst O₂ Release in Hypoxic Cells',
      co2Target: 80,
      desc: 'اکسیژن اشباع موجود در گلبول‌های قرمز مویرگ‌ها با شتاب بالا به سمت سلول‌های هیپوکسی‌شده پوست سرازیر شده و اشباع موضعی اکسیژن را تا ۳ برابر افزایش می‌دهد.',
    },
    {
      stage: 4,
      title: '۴. فعال‌سازی نئوکلاژنز و متابولیسم سلولی',
      sub: 'ATP Boost & Collagen Synthesis',
      co2Target: 100,
      desc: 'میتوکندری‌های فیبروبلاست با دریافت سیلاب اکسیژن، تولید ATP را تا ۳.۸ برابر افزایش داده و سنتز رشته‌های کلاژن نوع ۱ و ۳ و الاستین را تسریع می‌نمایند.',
    },
  ];

  const handleStageSelect = (stageIdx: number) => {
    setActiveBohrStage(stageIdx);
    setCo2Level(bohrStages[stageIdx].co2Target);
  };

  // Cart button states
  const [addedPro, setAddedPro] = useState(false);
  const [addedHome, setAddedHome] = useState(false);

  const handleAddProToCart = () => {
    addItem({
      variantId: 'var_skin_001_single',
      productId: 'prod_skin_001',
      title: 'پک حرفه‌ای کلینیکال CarboxyGel ۵۰۰ میلی‌لیتر (همراه با ۲۰ ماسک)',
      sku: 'CBG-PRO-500ML',
      priceAmount: '48500000',
      image: '/assets/drdermer/2025/07/azelaic-acid-carboxygel.png',
    });
    setAddedPro(true);
    openDrawer();
    setTimeout(() => setAddedPro(false), 2000);
  };

  const handleAddHomeToCart = () => {
    addItem({
      variantId: 'var_skin_001_home',
      productId: 'prod_skin_001',
      title: 'کیت خانگی ۵ عددی CarboxyGel (۵ تیوب ۲۵ میلی‌لیتر + ۵ ماسک)',
      sku: 'CBG-HOME-5X',
      priceAmount: '19500000',
      image: '/assets/drdermer/2025/07/multi-active-carboxygel.png',
    });
    setAddedHome(true);
    openDrawer();
    setTimeout(() => setAddedHome(false), 2000);
  };

  const selectedFormula = FORMULATIONS.find((f) => f.id === selectedFormulaId) || FORMULATIONS[0];

  return (
    <div className="cbg-page">
      <div className="cbg-ambient-glow" />

      <div className="cbg-container">
        {/* ── Breadcrumb & Regulatory Header ── */}
        <div className="cbg-breadcrumb-bar">
          <div className="cbg-breadcrumb-links">
            <Link href="/">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/reeskin">ReeSkin™ Clinical</Link>
            <span>/</span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>ژل کربوکسی CarboxyGel™</span>
          </div>

          <div className="cbg-regulatory-pill">
            <span className="pulse-dot" />
            <span>CE Class I Medical • ISO 13485 • استاندارد فارماکوپه اروپا (Ph. Eur.)</span>
          </div>
        </div>

        {/* ── HERO SECTION ── */}
        <section className="cbg-hero-grid">
          {/* Left: Headlines, Lead, Telemetry & CTAs */}
          <div className="cbg-hero-info">
            <div className="cbg-badge-wrap">
              <span className="cbg-badge">NON-INVASIVE CARBOXY THERAPY</span>
              <span className="cbg-badge gold">THE BOHR EFFECT PHYSIOLOGY</span>
            </div>

            <h1 className="cbg-hero-title">
              کربوکسی‌تراپی غیرتهاجمی و مکانیسم فیزیولوژیک اثر بوهر{' '}
              <span className="gradient-text">ReeSkin CarboxyGel™</span>
            </h1>

            <p className="cbg-hero-lead">
              سامانه پیشرفته کربوکسی‌تراپی بدون سوزن فرموله‌شده در آزمایشگاه‌های درماتولوژی کمبریج؛ با انتقال کنترل‌شده
              دی‌اکسید کربن ترنس‌درمال و تحریک طبیعی <strong>پدیده اثر بوهر (The Bohr Effect)</strong>، گسست اکسیژن از هموگلوبین
              خون مویرگی را شتاب بخشیده و بافت‌های هیپوکسیک را در کمتر از ۲۰ دقیقه اکسیژن‌باران می‌کند.
            </p>

            {/* Quick Biological Telemetry */}
            <div className="cbg-telemetry-grid">
              <div className="cbg-telemetry-item">
                <span className="cbg-telemetry-val">+۹۶٪</span>
                <span className="cbg-telemetry-lbl">آزادسازی اکسیژن فعال (O₂)</span>
              </div>
              <div className="cbg-telemetry-item">
                <span className="cbg-telemetry-val">۳.۴x</span>
                <span className="cbg-telemetry-lbl">تحریک سنتز کلاژن و ATP</span>
              </div>
              <div className="cbg-telemetry-item">
                <span className="cbg-telemetry-val">۰ روز</span>
                <span className="cbg-telemetry-lbl">دوره نقاهت (Zero Downtime)</span>
              </div>
            </div>

            {/* Hero Quick CTA buttons */}
            <div className="cbg-hero-actions">
              <a href="#order-options" className="cbg-btn-primary">
                سفارش پک حرفه‌ای ۵۰۰ml یا کیت ۵x خانگی ←
              </a>
              <a href="#bohr-simulator" className="cbg-btn-secondary">
                مشاهده شبیه‌ساز اثر بوهر
              </a>
              <Link href="/b2b?kit=carboxygel" className="cbg-btn-secondary">
                پورتال تأمین کابین کلینیک‌ها
              </Link>
            </div>
          </div>

          {/* Right: Real Product Visual Showcase with Thumbnail Switcher */}
          <div className="cbg-showcase-card">
            <span className="cbg-showcase-badge">تصاویر رسمی محصول و بافت ژل</span>

            <div className="cbg-showcase-img-wrap">
              <img
                src={showcaseImages[activeImageIndex].src}
                alt={showcaseImages[activeImageIndex].alt}
                className="cbg-showcase-img"
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                {showcaseImages[activeImageIndex].label}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                {showcaseImages[activeImageIndex].desc}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="cbg-showcase-nav">
              {showcaseImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`cbg-showcase-tab ${activeImageIndex === idx ? 'active' : ''}`}
                >
                  <img src={img.src} alt={img.label} />
                  <span>{img.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3 FORMULATIONS BREAKDOWN SECTION ── */}
        <section className="cbg-section">
          <div className="cbg-section-header">
            <span className="cbg-section-eyebrow">۳ فرمولاسیون تخصصی درمانی</span>
            <h2 className="cbg-section-title">تفکیک علمی فرمولاسیون‌های سه‌گانه CarboxyGel</h2>
            <p className="cbg-section-desc">
              هر یک از فرمولاسیون‌ها با pH تنظیم‌شده و ترکیب اکتیوهای مدیکال، برای هدف‌گیری مستقیم اندیکاسیون‌های
              بالینی ویژه بیماران در مطب یا مراقبت تخصصی در منزل طراحی شده است.
            </p>
          </div>

          <div className="cbg-formulations-grid">
            {FORMULATIONS.map((formula) => {
              const isSelected = selectedFormulaId === formula.id;
              return (
                <div
                  key={formula.id}
                  className={`cbg-formula-card ${isSelected ? 'featured' : ''}`}
                  onClick={() => setSelectedFormulaId(formula.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="cbg-formula-top">
                    <span className={`cbg-formula-badge ${formula.badgeClass}`}>{formula.badge}</span>
                    <span className="cbg-formula-ph">{formula.ph}</span>
                  </div>

                  <div className="cbg-formula-image-box">
                    <img src={formula.image} alt={formula.nameEn} />
                  </div>

                  <div className="cbg-formula-body">
                    <div>
                      <h3 className="cbg-formula-title">{formula.nameFa}</h3>
                      <div className="cbg-formula-en">{formula.nameEn}</div>
                      <div style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 700, marginTop: '4px' }}>
                        {formula.subtitleFa}
                      </div>
                    </div>

                    <p className="cbg-formula-desc">{formula.biochemicalMechanism}</p>

                    <div className="cbg-formula-meta">
                      <div className="cbg-formula-meta-row">
                        <strong>اندیکاسیون:</strong>
                        <span>{formula.indication}</span>
                      </div>
                      <div className="cbg-formula-meta-row">
                        <strong>اکتیوها:</strong>
                        <span>{formula.keyActives}</span>
                      </div>
                      <div className="cbg-formula-meta-row">
                        <strong>نتیجه بالینی:</strong>
                        <span style={{ color: '#a7f3d0' }}>{formula.clinicalResult}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                      <a
                        href="#order-options"
                        className="cbg-btn-secondary"
                        style={{ width: '100%', textAlign: 'center', fontSize: '0.84rem' }}
                      >
                        سفارش این فرمولاسیون ←
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── INTERACTIVE BOHR EFFECT SIMULATOR & CHEMICAL MECHANISM SECTION ── */}
        <section id="bohr-simulator" className="cbg-section">
          <div className="cbg-section-header">
            <span className="cbg-section-eyebrow">مکانیسم بیوشیمیایی و فیزیولوژی</span>
            <h2 className="cbg-section-title">شبیه‌ساز تعاملی اثر بوهر و واکنش‌های شیمیایی (The Bohr Effect)</h2>
            <p className="cbg-section-desc">
              بررسی پیوسته معادله شیمیایی، تایم‌لاین ۵ مرحله‌ای واکنش، پاسخ فیزیولوژیک عروق درم و پرونده ترکیبات فعال دارویی (INCI).
            </p>
          </div>

          {/* Chemical Reaction Equation */}
          <div className="cbg-reaction-eq-box">
            <div className="cbg-eq-title">BIOCHEMICAL ACID-BASE EFFERVESCENT REACTION EQUATION</div>
            <div className="cbg-eq-formula">
              <span className="react">3 NaHCO₃ (Gel Matrix)</span> + <span className="react">C₆H₈O₇ (Solid Pad Activator)</span>
              <span className="arrow">⟶</span>
              <span className="react">Na₃C₆H₅O₇</span> + <span className="react">3 H₂O</span> + <span className="gas">3 CO₂ ⇈ (Trapped Flux &gt; 1000ppm)</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '10px' }}>
              معادله خنثی‌سازی اسید-باز بی‌کربنات سدیم ژل با اسید سیتریک پد فعال‌ساز؛ تولید متراکم گاز دی‌اکسید کربن در محفظه بسته و القای مستقیم اثر بوهر
            </div>
          </div>

          {/* 5-Phase Reaction Timeline */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                تایم‌لاین ۵ فاز واکنش بیوشیمیایی (Reaction Timeline)
              </span>
              <span style={{ fontSize: '0.8rem', color: '#34d399', fontFamily: 'monospace' }}>
                مدت زمان کل پروتکل: ۲۵ دقیقه مکث فعال
              </span>
            </div>

            <div className="cbg-5phase-grid">
              {reactionPhases.map((phase) => {
                const isActive = activeReactionPhase === phase.phase;
                return (
                  <div
                    key={phase.phase}
                    className={`cbg-5phase-card ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveReactionPhase(phase.phase)}
                  >
                    <div className="cbg-5phase-num">فاز ۰{phase.phase}</div>
                    <div className="cbg-5phase-title">{phase.title}</div>
                    <div className="cbg-5phase-timing">{phase.timing}</div>
                  </div>
                );
              })}
            </div>

            {/* Active Phase Details Box */}
            {(() => {
              const cur = reactionPhases[activeReactionPhase - 1] || reactionPhases[0];
              return (
                <div className="cbg-phase-detail-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#34d399', fontWeight: 800 }}>
                      {cur.title}
                    </h3>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#94a3b8' }}>
                      {cur.titleEn} | {cur.timing}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.8' }}>
                    {cur.desc}
                  </p>
                  <div style={{ background: 'rgba(6, 78, 59, 0.3)', border: '1px solid rgba(52, 211, 153, 0.25)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.82rem', color: '#a7f3d0' }}>
                    <strong>شاخص مولکولی فاز:</strong> {cur.molecularKey}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Bohr Simulator Box */}
          <div className="cbg-bohr-box">
            {/* 4 Physiological Stages Stepper */}
            <div className="cbg-bohr-steps">
              {bohrStages.map((stage, idx) => (
                <button
                  key={stage.stage}
                  type="button"
                  onClick={() => handleStageSelect(idx)}
                  className={`cbg-bohr-step-btn ${activeBohrStage === idx ? 'active' : ''}`}
                >
                  <div className="cbg-bohr-step-num">
                    <span>مرحله ۰{stage.stage}</span>
                    <span>{stage.co2Target}٪ CO₂</span>
                  </div>
                  <div className="cbg-bohr-step-title">{stage.title}</div>
                  <div className="cbg-bohr-step-sub">{stage.sub}</div>
                </button>
              ))}
            </div>

            {/* Twin Interactive Visualizer & Live Readout */}
            <div className="cbg-bohr-interactive">
              {/* Dynamic SVG Capillary & Oxygen Diffusion Canvas */}
              <div className="cbg-bohr-svg-wrap">
                <svg viewBox="0 0 520 280" className="cbg-bohr-svg" aria-label="Bohr Effect Capillary Canvas">
                  <defs>
                    <linearGradient id="cbg-cap-wall" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#991b1b" stopOpacity="0.95" />
                    </linearGradient>
                    <radialGradient id="cbg-plasma" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fef2f2" />
                      <stop offset="100%" stopColor="#fee2e2" />
                    </radialGradient>
                    <radialGradient id="cbg-o2burst" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Epidermal stratum corneum */}
                  <rect x="0" y="0" width="520" height="26" fill="#1e293b" />
                  <text x="500" y="17" fill="#34d399" fontSize="10" fontWeight="800" textAnchor="end">
                    لایه شاخی پوست با ماتریکس فعال CarboxyGel
                  </text>

                  {/* CO2 Nano-Bubbles penetrating */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <circle
                      key={`co2-${i}`}
                      cx={35 + i * 48}
                      cy={26 + ((i * 19) % 40)}
                      r={3.5 + (co2Level / 100) * 3.5}
                      fill="#10b981"
                      opacity={0.35 + (co2Level / 100) * 0.6}
                    />
                  ))}

                  {/* Interstitial Dermal Matrix */}
                  <rect x="0" y="26" width="520" height="254" fill="#0b1329" opacity="0.85" />

                  {/* Capillary Vessel with dynamic vasodilation */}
                  {(() => {
                    const capHeight = 40 + (co2Level / 100) * 45;
                    const capY = 150 - capHeight / 2;
                    return (
                      <>
                        {/* Upper Wall */}
                        <rect x="0" y={capY - 8} width="520" height="8" fill="url(#cbg-cap-wall)" rx="2" />
                        {/* Lumen */}
                        <rect x="0" y={capY} width="520" height={capHeight} fill="url(#cbg-plasma)" />
                        {/* Lower Wall */}
                        <rect x="0" y={capY + capHeight} width="520" height="8" fill="url(#cbg-cap-wall)" rx="2" />

                        {/* Red Blood Cells with Hemoglobin */}
                        {[70, 190, 310, 430].map((rbcX, rIdx) => (
                          <g key={`rbc-${rIdx}`}>
                            <ellipse
                              cx={rbcX}
                              cy={capY + capHeight / 2}
                              rx={22 + (co2Level / 100) * 4}
                              ry={12 + (co2Level / 100) * 3}
                              fill="#dc2626"
                              stroke="#7f1d1d"
                              strokeWidth="2"
                            />
                            {/* O2 Bubbles escaping to hypoxic tissue */}
                            {co2Level > 20 && (
                              <>
                                <circle cx={rbcX - 12} cy={capY - 14} r="5" fill="#38bdf8" />
                                <circle cx={rbcX + 8} cy={capY - 22} r="6" fill="#0284c7" />
                                <circle cx={rbcX} cy={capY + capHeight + 16} r="5.5" fill="#38bdf8" />
                              </>
                            )}
                          </g>
                        ))}
                      </>
                    );
                  })()}

                  {/* Tissue Oxygenation Density Cloud */}
                  {co2Level > 35 && (
                    <circle cx="260" cy="80" r={45 + (co2Level / 100) * 40} fill="url(#cbg-o2burst)" />
                  )}

                  <text x="260" y="265" fill="#38bdf8" fontSize="11" fontWeight="800" textAnchor="middle">
                    تخلیه اشباع اکسیژن آزاد (O₂) از هموگلوبین به میتوکندری‌های سلول‌های درمیس
                  </text>
                </svg>
              </div>

              {/* Real-time Physiological Readouts */}
              <div className="cbg-bohr-readout">
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800 }}>مرحله انتخابی فعلی</div>
                  <h4 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 800, margin: '4px 0 8px' }}>
                    {bohrStages[activeBohrStage].title}
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.75', margin: 0 }}>
                    {bohrStages[activeBohrStage].desc}
                  </p>
                </div>

                <div className="cbg-bohr-metrics-grid">
                  <div className="cbg-bohr-metric-card">
                    <div className="cbg-bohr-metric-val">{localPh}</div>
                    <div className="cbg-bohr-metric-lbl">pH اسیدیته بافتی لایه درم</div>
                  </div>
                  <div className="cbg-bohr-metric-card">
                    <div className="cbg-bohr-metric-val teal">+{o2DeliveryPercent}٪</div>
                    <div className="cbg-bohr-metric-lbl">آزادسازی موضعی اکسیژن (O₂)</div>
                  </div>
                  <div className="cbg-bohr-metric-card">
                    <div className="cbg-bohr-metric-val blue">+{vasodilationPercent - 100}٪</div>
                    <div className="cbg-bohr-metric-lbl">اتساع مویرگی (Vasodilation)</div>
                  </div>
                  <div className="cbg-bohr-metric-card">
                    <div className="cbg-bohr-metric-val">{atpCollagenSynthesisMultiplier}x</div>
                    <div className="cbg-bohr-metric-lbl">سنتز کلاژن نوع ۱ و ۳ و ATP</div>
                  </div>
                </div>

                {/* Slider Control */}
                <div className="cbg-slider-wrap">
                  <div className="cbg-slider-label-row">
                    <span style={{ color: '#ffffff' }}>کنترل پیوسته غلظت ترابافتی CO₂:</span>
                    <span style={{ color: '#34d399', fontFamily: 'monospace' }}>{co2Level}٪ اشباع گاز</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={co2Level}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCo2Level(val);
                      if (val < 35) setActiveBohrStage(0);
                      else if (val < 65) setActiveBohrStage(1);
                      else if (val < 90) setActiveBohrStage(2);
                      else setActiveBohrStage(3);
                    }}
                    className="cbg-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                    <span>۱۰٪ (سطح پایه)</span>
                    <span>۵۰٪ (افت pH)</span>
                    <span>۸۰٪ (رهاسازی O₂)</span>
                    <span>۱۰۰٪ (اوج نئوکلاژنز)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INCI Ingredients Breakdown Drawer */}
          <div className="cbg-inci-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="cbg-section-eyebrow" style={{ fontSize: '0.74rem' }}>فارماکوپه دارویی و آنالیز آزمایشگاهی</span>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                  پرونده ترکیبات فعال دارویی (INCI Breakdown)
                </h3>
              </div>
              <span className="cbg-regulatory-pill">
                <span className="pulse-dot" />
                تأییدیه خلوص دارویی اروپا (Ph. Eur.)
              </span>
            </div>

            <div className="cbg-inci-grid">
              {inciBreakdown.map((item, idx) => {
                const isSelected = selectedInciItem === idx;
                return (
                  <div
                    key={idx}
                    className={`cbg-inci-item-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedInciItem(idx)}
                  >
                    <div className="cbg-inci-top">
                      <h4 className="cbg-inci-name">{item.nameFa}</h4>
                      <span className="cbg-inci-pct">{item.percentage}</span>
                    </div>
                    <div className="cbg-inci-latin">{item.nameEn}</div>
                    <p className="cbg-inci-purpose">{item.role}</p>
                  </div>
                );
              })}
            </div>

            {/* Selected INCI Drawer Display */}
            {(() => {
              const curInci = inciBreakdown[selectedInciItem] || inciBreakdown[0];
              return (
                <div className="cbg-inci-drawer-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#34d399', fontWeight: 900 }}>
                      {curInci.nameFa} ({curInci.percentage})
                    </h4>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#cbd5e1' }}>
                      {curInci.purity}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px' }}>
                    {curInci.nameEn}
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '0.88rem', color: '#f1f5f9', lineHeight: '1.8' }}>
                    <strong>مکانیسم اثر بیوشیمیایی:</strong> {curInci.mechanism}
                  </p>
                  <div style={{ fontSize: '0.82rem', color: '#6ee7b7' }}>
                    <strong>نقش در فرمولاسیون:</strong> {curInci.role}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── CLINICAL PROTOCOL & GUIDELINES SECTION ── */}
        <section className="cbg-section">
          <div className="cbg-section-header">
            <span className="cbg-section-eyebrow">دستورالعمل بالینی استاندارد</span>
            <h2 className="cbg-section-title">پروتکل گام‌به‌گام اجرای کربوکسی‌تراپی غیرتهاجمی</h2>
            <p className="cbg-section-desc">
              دستورالعمل استاندارد کلینیکال تدوین‌شده توسط تیم پزشکی Dr. Dermer انگلستان جهت دستیابی به حداکثر اثر بوهر
              بدون بروز عوارض جانبی یا سوزش ناخواسته.
            </p>
          </div>

          {/* 5 Steps Timeline */}
          <div className="cbg-protocol-timeline">
            {CLINICAL_PROTOCOL_STEPS.map((s) => (
              <div key={s.step} className="cbg-protocol-step">
                <div className="cbg-step-num-badge">0{s.step}</div>
                <div className="cbg-step-content">
                  <h3 className="cbg-step-title">{s.title}</h3>
                  <p className="cbg-step-desc">{s.action}</p>
                  <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
                    نکته کلینیکی: {s.clinicalTip}
                  </div>
                </div>
                <div className="cbg-step-timing">
                  <span className="cbg-step-timing-lbl">مدت زمان مکث:</span>
                  <span className="cbg-step-timing-val">{s.duration}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Frequency & Indications Grid */}
          <div className="cbg-guidelines-grid">
            {/* Frequency Card */}
            <div className="cbg-guideline-card">
              <h3 className="cbg-guideline-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                تواتر و دوره‌های درمانی (Treatment Frequency)
              </h3>
              <div className="cbg-frequency-list">
                <div className="cbg-frequency-item">
                  <strong>دوره درمانی فشرده کلینیکال:</strong>
                  <span>۱ بار در هفته (طول دوره: ۴ الی ۶ جلسه)</span>
                </div>
                <div className="cbg-frequency-item">
                  <strong>فاز تثبیت و نگهداری (Maintenance):</strong>
                  <span>هر ۲ الی ۳ هفته یک بار</span>
                </div>
                <div className="cbg-frequency-item">
                  <strong>رژیم خانگی با کیت Home 5x:</strong>
                  <span>هر ۱۰ روز یک بار (عصرها پیش از خواب)</span>
                </div>
                <div className="cbg-frequency-item">
                  <strong>آماده‌سازی پیش از پروسیجرها (لیزر، مزو):</strong>
                  <span>۴۸ ساعت قبل از انجام پروسیجر</span>
                </div>
              </div>
            </div>

            {/* Indications & Contraindications Card */}
            <div className="cbg-guideline-card">
              <h3 className="cbg-guideline-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                اندیکاسیون‌ها و موارد احتیاط
              </h3>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>اندیکاسیون‌های قطعی:</div>
                <div className="cbg-indication-tags">
                  <span className="cbg-indication-tag">کدری و تیرگی چهره</span>
                  <span className="cbg-indication-tag">هایپرپیگمنتیشن و ملاسما</span>
                  <span className="cbg-indication-tag">آکنه التهابی و قرمزی</span>
                  <span className="cbg-indication-tag">خطوط و افتادگی درم</span>
                  <span className="cbg-indication-tag">منافذ باز و کاهش الاستیسیته</span>
                  <span className="cbg-indication-tag">اسکارهای سطحی و استریا</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>کنتراندیکاسیون‌ها:</div>
                <div className="cbg-indication-tags">
                  <span className="cbg-indication-tag contra">زخم‌های باز و بریدگی حاد</span>
                  <span className="cbg-indication-tag contra">اگزمای شعله‌ور پوستی</span>
                  <span className="cbg-indication-tag contra">آفتاب‌سوختگی فعال درجه ۲</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DIRECT CTA TO ORDER (500ml Pro Pack vs Home 5x Kit) ── */}
        <section id="order-options" className="cbg-section">
          <div className="cbg-order-section">
            <div className="cbg-section-header" style={{ marginBottom: '24px' }}>
              <span className="cbg-section-eyebrow">سفارش مستقیم و تضمین اصالت کالا</span>
              <h2 className="cbg-section-title">انتخاب پکیج ReeSkin CarboxyGel™</h2>
              <p className="cbg-section-desc">
                پک حرفه‌ای کابین کلینیک برای پزشکان و مراکز درمانی، یا کیت خانگی ۵ عددی برای مراقبت متمرکز هوم‌کر با هولوگرام
                امنیتی و ضمانت اصالت داروسازی کمبریج.
              </p>
            </div>

            <div className="cbg-order-grid">
              {/* Option 1: 500ml Professional Pack */}
              <div className="cbg-order-card pro">
                <span className="cbg-order-ribbon">انتخاب کلینیک‌های پوست</span>

                <div className="cbg-order-header">
                  <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800 }}>CLINICAL PRO PACK</div>
                  <h3 className="cbg-order-title">پک حرفه‌ای کلینیکال ۵۰۰ میلی‌لیتر</h3>
                  <p className="cbg-order-subtitle">همراه با ۲۰ ست ماسک فعال‌ساز آلکالاین صورت و گردن</p>
                </div>

                <div className="cbg-order-price-box">
                  <span className="cbg-order-price-main">{formatToman('48500000')}</span>
                  <span className="cbg-order-price-orig">{formatToman('56000000')}</span>
                  <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 700 }}>۱۳٪ تخفیف کلینیک</span>
                </div>

                <div className="cbg-order-features">
                  <div className="cbg-order-feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>حجم ۵۰۰ml کابین کافی برای حداقل ۲۰ پروسیجر کامل</span>
                  </div>
                  <div className="cbg-order-feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>۲۰ عدد شیت ماسک فعال‌ساز پیش‌برش‌خورده ارگونومیک</span>
                  </div>
                  <div className="cbg-order-feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>سرنگ کالیبره‌شده دوزینگ دقیق جهت حذف هرگونه هدررفت مواد</span>
                  </div>
                  <div className="cbg-order-feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>انتخاب در ۳ فرمولاسیون Glycolic, Multi-Active, Azelaic</span>
                  </div>
                  <div className="cbg-order-feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>ارسال فوری زنجیره سرد با فاکتور رسمی دارویی</span>
                  </div>
                </div>

                <div className="cbg-order-btn-wrap">
                  <button
                    type="button"
                    onClick={handleAddProToCart}
                    className={`cbg-btn-cart ${addedPro ? 'added' : ''}`}
                  >
                    {addedPro ? '✓ به سبد خرید افزوده شد' : 'افزودن پک حرفه‌ای ۵۰۰ml به سبد خرید'}
                  </button>
                  <Link
                    href="/b2b?kit=carboxygel"
                    className="cbg-btn-secondary"
                    style={{ textAlign: 'center', fontSize: '0.84rem' }}
                  >
                    استعلام خرید عمده بالای ۵ پک برای کلینیک ←
                  </Link>
                </div>
              </div>

              {/* Option 2: Home 5x Kit */}
              <div className="cbg-order-card">
                <div className="cbg-order-header">
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800 }}>HOMECARE 5X KIT</div>
                  <h3 className="cbg-order-title">کیت خانگی ۵ عددی CarboxyGel</h3>
                  <p className="cbg-order-subtitle">شامل ۵ تیوب ۲۵ میلی‌لیتر تک‌دوز + ۵ ماسک فعال‌ساز</p>
                </div>

                <div className="cbg-order-price-box">
                  <span className="cbg-order-price-main">{formatToman('19500000')}</span>
                  <span className="cbg-order-price-orig">{formatToman('23000000')}</span>
                  <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 700 }}>۱۵٪ تخفیف</span>
                </div>

                <div className="cbg-order-features">
                  <div className="cbg-order-feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>۵ تیوب استریل ۲۵ml تک‌کاربره بدون نیاز به اندازه‌گیری</span>
                  </div>
                  <div className="cbg-order-feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>۵ عدد پد ماسک صورت و غبغب برای تکمیل یک دوره کامل ۵ هفته‌ای</span>
                  </div>
                  <div className="cbg-order-feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>ایده‌آل جهت تداوم درمان‌های مطبی در منزل یا آماده‌سازی مناسبت‌ها</span>
                  </div>
                  <div className="cbg-order-feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>دفترچه راهنمای فارسی گام‌به‌گام مصور</span>
                  </div>
                  <div className="cbg-order-feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>هولوگرام امنیتی و بچ‌کد اصالت سنجش آنلاین</span>
                  </div>
                </div>

                <div className="cbg-order-btn-wrap">
                  <button
                    type="button"
                    onClick={handleAddHomeToCart}
                    className={`cbg-btn-cart ${addedHome ? 'added' : ''}`}
                  >
                    {addedHome ? '✓ به سبد خرید افزوده شد' : 'افزودن کیت خانگی ۵x به سبد خرید'}
                  </button>
                  <Link
                    href="/products/carboxygel"
                    className="cbg-btn-secondary"
                    style={{ textAlign: 'center', fontSize: '0.84rem' }}
                  >
                    مشاهده مشخصات کامل در صفحه محصول ←
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER CALLOUT LINKS ── */}
        <div style={{ marginTop: '48px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/carbox" className="cbg-btn-secondary" style={{ fontSize: '0.86rem' }}>
            بررسی ایستگاه پزشکی CarboX Pro ←
          </Link>
          <Link href="/carboxypod" className="cbg-btn-secondary" style={{ fontSize: '0.86rem' }}>
            پادهای فعال‌ساز CarboxyPod ←
          </Link>
          <Link href="/academy" className="cbg-btn-secondary" style={{ fontSize: '0.86rem' }}>
            مقالات علمی اثر بوهر در آکادمی دکتر درمر ←
          </Link>
        </div>
      </div>
    </div>
  );
}
