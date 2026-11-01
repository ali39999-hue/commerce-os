export interface Ingredient {
  id: string;
  slug: string;
  nameFa: string;
  inciName: string;
  casNumber: string; // CAS Registry Number
  chemicalClass: string;
  clinicalConcentration: string;
  clinicalRole: string;
  biologicalMechanism: string[];
  safetyProfile: {
    cirRating: string; // Cosmetic Ingredient Review status
    comedogenicRating: number; // 0 to 5
    tolerability: "بسیار ملایم" | "ملایم" | "متوسط (نیازمند تیتراسیون)" | "تحت نظر پزشک";
    pregnancySafe: boolean | "مشروط به تجویز پزشک" | "ممنوع در بارداری";
    phRange: string;
  };
  synergisticCombinations: Array<{
    withIngredient: string;
    mechanism: string;
  }>;
  incompatibilities: string[];
  clinicalEvidence: string;
}

export const INGREDIENT_ENCYCLOPEDIA: Ingredient[] = [
  {
    id: "ing-co2",
    slug: "carbon-dioxide-transdermal",
    nameFa: "گاز دی‌اکسید کربن ترنس‌درمال (کربوکسی بدون سوزن)",
    inciName: "Carbon Dioxide (generated via Sodium Bicarbonate & Fruit Acid Complex)",
    casNumber: "124-38-9 / 144-55-8",
    chemicalClass: "محرک گازی متابولیسم سلولی / Vasodilator Gas",
    clinicalConcentration: "تولید موضعی اشباع گاز بیش از ۱۰۰۰ ppm در لایه زیرین شیت ژل",
    clinicalRole: "افزایش اکسیژن‌رسانی بافتی (Bohr Effect)، رگ‌زایی عروقی (Neoangiogenesis) و تحریک فیبروبلاست‌ها.",
    biologicalMechanism: [
      "نفوذ سریع مولکول‌های حل‌شده گاز CO₂ از لایه شاخی (Stratum Corneum) به عروق مویرگی درم.",
      "کاهش موضعی pH خون در مویرگ‌های پوست و ایجاد پدیده بوهر (Bohr Effect)؛ کاهش تمایل هموگلوبین به اکسیژن و آزادسازی انفجاری O₂ در بستر بافت.",
      "تحریک ترشح فاکتور رشد اندوتلیال عروقی (VEGF) و فاکتور رشد فیبروبلاستی (FGF) جهت بازسازی شبکه کلاژن تیپ I و III.",
      "تسریع جریان لنفاوی و تخلیه متابولیت‌های التهابی و ادم اطراف چشم.",
    ],
    safetyProfile: {
      cirRating: "Safe as Used (سازمان CIR و FDA GRAS)",
      comedogenicRating: 0,
      tolerability: "متوسط (نیازمند تیتراسیون)",
      pregnancySafe: true,
      phRange: "۵.۲ - ۶.۸ (پس از تکمیل واکنش تبادل گازی)",
    },
    synergisticCombinations: [
      {
        withIngredient: "Madecassoside & Centella Asiatica",
        mechanism: "کاهش سریع اریتمای حاصل از اتساع عروقی و تسریع بازسازی لایه اپیدرم پس از پرفیوژن گازی.",
      },
      {
        withIngredient: "Multi-Molecular Hyaluronic Acid",
        mechanism: "جذب آب بین‌بافتی بیشتر در محیط فوق‌اکسیژنه و افزایش چشمگیر تورژسنس و حجم‌دهی پوست.",
      },
    ],
    incompatibilities: [
      "استفاده همزمان روی زخم باز با خونریزی فعال یا درماتیت حاد عفونی.",
      "ترکیب با لایه‌بردارهای اسیدی بسیار قوی بدون شستشوی کامل ژل کربوکسی.",
    ],
    clinicalEvidence: "مطالعات بالینی متعدد (Aesthetic Plastic Surgery, 2018) افزایش ۲۸٪ جریان خون موضعی و بهبود ۳۴٪ الاستیسیته پوست را طی ۴ جلسه اثبات کرده‌اند.",
  },
  {
    id: "ing-retinol",
    slug: "encapsulated-retinol",
    nameFa: "رتینول انکپسوله در لیپوزوم و نانوذرات لیپیدی",
    inciName: "Retinol (and) Phospholipids (and) Caprylic/Capric Triglyceride",
    casNumber: "68-26-8",
    chemicalClass: "مشتقات ویتامین A / رتینوئید کپسوله‌شده",
    clinicalConcentration: "۰.۲٪ تا ۱.۰٪ فرم کپسوله (معادل فعالیت بیولوژیک پیوسته بدون پیک التهابی)",
    clinicalRole: "افزایش سرعت چرخش اپیدرم (Turnover)، سنتز کلاژن، مهار ترشح ماتریکس متالوپروتئینازها (MMPs) و درمان هایپرپیگمانتاسیون.",
    biologicalMechanism: [
      "نفوذ لایه‌ای و آهسته‌رهش فسفولیپیدها به عمق لایه‌های زاینده اپیدرم، مانع از شوک گیرنده‌های RAR/RXR و کاهش ۶۵٪ عوارض رتینوئیدی.",
      "تبدیل درون‌سلولی رتینول به رتینالدئید و سپس رتینوئیک اسید خالص در مجاورت کراتینوسیت‌ها.",
      "مهار انتقال ملانوزوم‌ها و کاهش لکه‌های مقاوم درمیک و اپیدرمیک ناشی از آفتاب و آکنه.",
      "تحریک رونویسی ژن‌های فیبرونکتین، الاستین و پروداکشن گلیکوزآمینوگلیکان‌ها (GAGs).",
    ],
    safetyProfile: {
      cirRating: "Safe with Concentration Limits (CIR Expert Panel)",
      comedogenicRating: 0,
      tolerability: "متوسط (نیازمند تیتراسیون)",
      pregnancySafe: "ممنوع در بارداری",
      phRange: "۵.۵ - ۶.۵",
    },
    synergisticCombinations: [
      {
        withIngredient: "Niacinamide (4%-5%)",
        mechanism: "تحکیم سد چربی پوست، مهار مکمل سنتز ملانین و خنثی‌سازی خشکی و قرمزی احتمالی رتینول.",
      },
      {
        withIngredient: "Physiological Ceramide Complex",
        mechanism: "ترمیم سریع سرامیدهای بین‌سلولی که در فاز اولیه رتینول‌تراپی بازسازی می‌شوند.",
      },
    ],
    incompatibilities: [
      "اسیدهای آلفاهیدروکسی (AHA) با دوز بالا در همان نوبت مصرف شبانه (بهتر است یک شب در میان استفاده شوند).",
      "بنزوئیل پراکسید (به دلیل اکسیداسیون ساختار ترانس رتینول).",
    ],
    clinicalEvidence: "کارآزمایی تصادفی دوسوکور در Journal of Cosmetic Dermatology نشان‌دهنده کاهش ۴۲٪ عمق چروک و ۶۰٪ تحمل‌پذیری بالاتر رتینول انکپسوله نسبت به رتینول آزاد است.",
  },
  {
    id: "ing-niacinamide",
    slug: "niacinamide-vitamin-b3",
    nameFa: "نیاسینامید فوق‌پاک (ویتامین B3 بدون ناخالصی اسید نیکوتینیک)",
    inciName: "Niacinamide (High Purity < 50 ppm Nicotinic Acid)",
    casNumber: "98-92-0",
    chemicalClass: "آمید بیولوژیک ویتامین B3 / آنتی‌اکسیدان چندمنظوره",
    clinicalConcentration: "۲.۰٪ تا ۵.۰٪ (غلظت بالای ۵٪ ممکن است در پوست حساس باعث برافروختگی شود)",
    clinicalRole: "مهار ملانوزوم، تنظیم سبوم، تقویت سنتز سرامیدها، ضدالتهاب بالینی و کاهش قرمزی واسکولار.",
    biologicalMechanism: [
      "افزایش کوآنزیم‌های NAD+ و NADPH درون‌سلولی، بازسازی ذخیره انرژی ATP در کراتینوسیت‌ها.",
      "مهار ۳۵ تا ۶۸ درصدی انتقال بسته‌های رنگدانه ملانین از ملانوسیت به سلول‌های شاخی مجاور.",
      "تحریک بیان ژن‌های آنزیم‌های سرامید سنتاز و اسفنگومیلیناز و ضخیم‌سازی لایه استراتوم کورنئوم.",
      "مهار سایتوکاین‌های پیش‌التهابی نظیر IL-8 و IL-6 در پوست‌های مستعد آکنه و روزاسه.",
    ],
    safetyProfile: {
      cirRating: "Safe as Used (بدون سمیت سلولی - CIR Approved)",
      comedogenicRating: 0,
      tolerability: "بسیار ملایم",
      pregnancySafe: true,
      phRange: "۵.۰ - ۶.۵",
    },
    synergisticCombinations: [
      {
        withIngredient: "Encapsulated Retinol",
        mechanism: "بهترین ترکیب بالینی برای درمان توامان لک، چروک و روزاسه خفیف بدون تحریک پوستی.",
      },
      {
        withIngredient: "Zinc PCA",
        mechanism: "تنظیم ترشح غدد چربی، کاهش تکثیر کاتی‌باکتریوم اکنس و بستن منافذ باز پوستی.",
      },
      {
        withIngredient: "Tranexamic Acid",
        mechanism: "رویکرد دوگانه در درمان ملاسما و لک‌های مقاوم به درمان.",
      },
    ],
    incompatibilities: [
      "محیط‌های اسیدی با pH کمتر از ۳.۵ به مدت طولانی (احتمال هیدرولیز به نیکوتینیک اسید و ایجاد فلاشینگ قرمز موقت).",
    ],
    clinicalEvidence: "مطالعه بریتیش ژورنال آو درماتولوژی حاکی از مهار بیش از ۵۰٪ ملانوزوم‌ها در غلظت ۴٪ و کاهش معنی‌دار تبخیر آب از سد دفاعی (TEWL) است.",
  },
  {
    id: "ing-copper-peptide",
    slug: "copper-tripeptide-1-ghk-cu",
    nameFa: "مس‌پپتید / تری‌پپتید مس ۱ (GHK-Cu)",
    inciName: "Copper Tripeptide-1",
    casNumber: "89030-95-5",
    chemicalClass: "پپتید ناقل عناصر کمیاب (Carrier Peptide)",
    clinicalConcentration: "۰.۱٪ تا ۱.۵٪ (دوزهای درمانی نیازمند فاکتور خلوص پپتیدی بالای ۹۸٪)",
    clinicalRole: "ترمیم پیشرفته بافت آسیب‌دیده، ریمادلینگ ماتریکس خارج سلولی، آنتی‌اکسیداسیون و آنتی‌سنس کلاژن.",
    biologicalMechanism: [
      "کیلیت‌کننده اختصاصی یون‌های مس (Cu²⁺) و انتقال آن به آنزیم‌های حیاتی مانند لایزیل اکسیداز جهت کراس‌لینک فیبرهای الاستین و کلاژن.",
      "تنظیم دوطرفه متالوپروتئینازها (MMPs)؛ تجزیه کلاژن‌های نامنظم و آسیب‌دیده اسکار و همزمان افزایش سنتز پروکلاژن جدید.",
      "کاهش ترشح رادیکال‌های آزاد آهن و سوپراکسید در محل سوختگی، میکرونیدلینگ و لیزرهای ابلیتیو.",
      "تحریک فاکتور رشد ترانسفورم‌کننده بتا (TGF-β) و سنتز درماتان سولفات و هپاران سولفات.",
    ],
    safetyProfile: {
      cirRating: "Safe in Cosmeceuticals (CIR Expert Consensus)",
      comedogenicRating: 0,
      tolerability: "بسیار ملایم",
      pregnancySafe: true,
      phRange: "۵.۸ - ۷.۰",
    },
    synergisticCombinations: [
      {
        withIngredient: "Palmitoyl Tripeptide-5",
        mechanism: "ترکیب همزمان پپتید ناقل مس با پپتید سیگنال‌دهنده برای حداکثر تحریک فیبروبلاست‌ها.",
      },
      {
        withIngredient: "Centella Asiatica / Madecassoside",
        mechanism: "مهار کامل التهاب فاز گرانولاسیون پس از پروسیجرهای کلینیکی تهاجمی.",
      },
    ],
    incompatibilities: [
      "اسیدهای لایه‌بردار قوی با pH پایین (AHA, BHA)؛ مس از کمپلکس پپتیدی آزاد شده و بی‌اثر می‌شود.",
      "فرم آزاد L-Ascorbic Acid خالص (ویتامین C خالص به دلیل پتانسیل اکسیداسیون ردوکس متقابل).",
    ],
    clinicalEvidence: "پژوهش‌های دکتر لورن پیکارت (دانشگاه سن‌فرانسیسکو) نشان می‌دهد GHK-Cu بیش از ۷۰٪ ترشح پروکلاژن را در شرایط آزمایشگاهی و بالینی افزایش می‌دهد.",
  },
  {
    id: "ing-palmitoyl-tripeptide-5",
    slug: "palmitoyl-tripeptide-5",
    nameFa: "پالمیتوئیل تری‌پپتید-۵ (پپتید سیگنال‌دهنده TGF-β)",
    inciName: "Palmitoyl Tripeptide-5",
    casNumber: "623172-56-5",
    chemicalClass: "پپتید سیگنال‌دهنده بایومیمتیک (Signal Peptide)",
    clinicalConcentration: "۱.۰٪ تا ۳.۰٪ محلول کمپلکس",
    clinicalRole: "شبیه‌سازی فعالیت ترومبوسپوندین-۱ (TSP-1)، فعال‌سازی فاکتور رشد نهفته TGF-β و جلوگیری از تخریب کلاژن.",
    biologicalMechanism: [
      "اتصال به توالی فعال‌ساز فاکتور رشد TGF-β و القای تولید کلاژن بدون نیاز به ایجاد آسیب التهابی در بافت.",
      "محافظت از ساختار الاستین و پیشگیری از تخریب آن در برابر آنزیم ماتریکس کلاژناز.",
      "بهبود انسجام اتصالات لایه درمو-اپیدرمال (Dermal-Epidermal Junction - DEJ).",
    ],
    safetyProfile: {
      cirRating: "Safe (عدم حساسیت‌زایی بالینی)",
      comedogenicRating: 0,
      tolerability: "بسیار ملایم",
      pregnancySafe: true,
      phRange: "۵.۰ - ۷.۰",
    },
    synergisticCombinations: [
      {
        withIngredient: "Copper Tripeptide-1",
        mechanism: "افزایش چندبرابری تراکم درمیس در پروتکل‌های جوان‌سازی تخصصی.",
      },
      {
        withIngredient: "Multi-Molecular Hyaluronic Acid",
        mechanism: "جلوگیری از دی‌هیدراتاسیون پوستی در حین افزایش انعطاف‌پذیری رشته‌های پروتئینی.",
      },
    ],
    incompatibilities: ["تداخل شناخته‌شده‌ای با مواد معمول پوستی ندارد."],
    clinicalEvidence: "در ارزیابی‌های درون‌تنی اولتراسوند پوستی، افزایش ۱۲ درصدی ضخامت لایه درم پس از ۲۸ روز استفاده منظم ثبت گردیده است.",
  },
  {
    id: "ing-ceramide-complex",
    slug: "physiological-ceramide-complex",
    nameFa: "کمپلکس سرامیدهای فیزیولوژیک (NP, AP, EOP + فیتواسفنگوزین)",
    inciName: "Ceramide NP (and) Ceramide AP (and) Ceramide EOP (and) Phytosphingosine (and) Cholesterol",
    casNumber: "100403-19-8 / 554-01-8",
    chemicalClass: "لیپیدهای ساختاری غشای بین‌سلولی / Lipid Barrier Complex",
    clinicalConcentration: "۲.۰٪ تا ۵.۰٪ فرمولاسیون فاز کریستال مایع",
    clinicalRole: "ترمیم فوری سد نفوذپذیری، کاهش TEWL، بازسازی سیمان بین‌سلولی کراتینوسیت‌ها و محافظت در برابر آلرژن‌ها.",
    biologicalMechanism: [
      "تشکیل ساختار لایه‌ای متراکم بیومیمتیک (Lamellar Matrix) شبیه به چربی طبیعی استراتوم کورنئوم با نسبت طلایی ۳:۱:۱.",
      "کاهش تبخیر آب ترنس‌اپیدرمال و پیشگیری از نفوذ عوامل محرک محیطی و باکتری‌ها.",
      "فیتواسفنگوزین موجود در کمپلکس به عنوان مهارکننده طبیعی تکثیر باکتری‌های نامطلوب و التیام‌بخش پوست عمل می‌کند.",
    ],
    safetyProfile: {
      cirRating: "Safe (سازگار بیولوژیک کامل با پوست - CIR Grade A)",
      comedogenicRating: 0,
      tolerability: "بسیار ملایم",
      pregnancySafe: true,
      phRange: "۵.۰ - ۶.۰",
    },
    synergisticCombinations: [
      {
        withIngredient: "Centella Asiatica / Madecassoside",
        mechanism: "پروتکل استاندارد طلایی ترمیم پوست‌های آسیب‌دیده پس از لیزر، لایه‌برداری شیمیایی و میکرونیدلینگ.",
      },
      {
        withIngredient: "Niacinamide",
        mechanism: "تحریک خودکار تولید سرامیدهای درون‌زاد در کنار تغذیه سرامیدهای اگزوژن.",
      },
    ],
    incompatibilities: ["مواد شوینده با سورفکتانت‌های قوی آنیونی که لایه چربی را از بین می‌برند."],
    clinicalEvidence: "پژوهش‌های درماتولوژی دانشگاه هامبورگ نشان می‌دهد نسبت‌های فیزیولوژیک سرامید تا ۹۰٪ زمان بهبود زخم بعد از آسیب را کاهش می‌دهند.",
  },
  {
    id: "ing-centella",
    slug: "centella-asiatica-madecassoside",
    nameFa: "عصاره تیتراسیون‌شده سنتلا آسیاتیکا و مادکاسوساید ۹۵٪",
    inciName: "Centella Asiatica Extract / Madecassoside / Asiaticoside",
    casNumber: "84696-21-9 / 34540-22-2",
    chemicalClass: "تری‌ترپنوئیدهای گیاهی استانداردشده / Phyto-Therapeutic Active",
    clinicalConcentration: "۰.۲٪ تا ۲.۰٪ ماده موثره خالص",
    clinicalRole: "مهار سیتوکین‌های التهابی، تحریک ساخت کلاژن تیپ I، بهبود جای زخم و سوختگی و پیشگیری از اسکار هایپرتروفیک.",
    biologicalMechanism: [
      "مهار مستقیم آنزیم‌های اکسیداتیو و مهار ترشح اینترلوکین ۱-آلفا (IL-1α) و فاکتور نکروز تومور (TNF-α).",
      "تحریک مهاجرت سلول‌های اندوتلیال و کراتینوسیت‌ها به محل زخم در فاز پرولیفراتیو ترمیم بافت.",
      "افزایش بیان ژن‌های پروتئین‌های اتصالی کلودین-۱ (Claudin-1) و فیلاگرین (Filaggrin).",
    ],
    safetyProfile: {
      cirRating: "Safe for Topical Use (CIR Monograph)",
      comedogenicRating: 0,
      tolerability: "بسیار ملایم",
      pregnancySafe: true,
      phRange: "۵.۰ - ۷.۰",
    },
    synergisticCombinations: [
      {
        withIngredient: "Carbon Dioxide Non-Needle CarboxyGel",
        mechanism: "کنترل کامل گرگرفتگی و حرارت موضعی و آرام‌بخشی فوری پوست تحت درمان.",
      },
      {
        withIngredient: "Copper Tripeptide-1",
        mechanism: "تسریع دوبرابری چرخه ترمیم و تشکیل ماتریکس کلاژنی منظم در زخم‌های کنترل‌شده.",
      },
    ],
    incompatibilities: ["تداخل شناخته‌شده‌ای ندارد."],
    clinicalEvidence: "تأییدشده در فارماکوپه‌های اروپایی و مقالات متعدد بین‌المللی برای درمان زخم‌ها و ترمیم پوست پس از پروسیجرهای مداخله‌ای.",
  },
  {
    id: "ing-tranexamic-acid",
    slug: "tranexamic-acid-topical",
    nameFa: "ترانگزامیک اسید ۳٪ بالینی",
    inciName: "Tranexamic Acid",
    casNumber: "1197-18-8",
    chemicalClass: "مهارکننده سیستم پلاسمین-پلاسمینوژن / مشتق مصنوعی اسید آمینه لیزین",
    clinicalConcentration: "۲.۰٪ تا ۵.۰٪ فرم موضعی کلینیکی",
    clinicalRole: "درمان ملاسما و هایپرپیگمانتاسیون‌های هورمونی و پس‌التهابی عروقی (Vascular PIH).",
    biologicalMechanism: [
      "مهار اتصال پلاسمینوژن به کراتینوسیت‌ها و جلوگیری از فعال‌سازی آنزیم پلاسمین به دنبال تابش فرابنفش (UV).",
      "کاهش تولید اسید آراشیدونیک و پروستاگلاندین‌ها که محرک مستقیم ترشح ملانین از ملانوسیت‌ها هستند.",
      "مهار اتساع مویرگی در ضایعات ملاسما و کاهش جزء عروقی لک‌های پوستی.",
    ],
    safetyProfile: {
      cirRating: "Safe in Clinical Cosmeceuticals (CIR Expert Panel)",
      comedogenicRating: 0,
      tolerability: "ملایم",
      pregnancySafe: "مشروط به تجویز پزشک",
      phRange: "۵.۵ - ۷.۰",
    },
    synergisticCombinations: [
      {
        withIngredient: "Niacinamide (5%)",
        mechanism: "هم‌افزایی بی‌نظیر در درمان لک‌های مقاوم: مهار رهاسازی رنگدانه همزمان با مهار فعال‌سازی مسیر التهابی.",
      },
      {
        withIngredient: "Encapsulated Retinol",
        mechanism: "افزایش نفوذ ترانگزامیک اسید به لایه بازال و درمان ملاسماهای کهنه.",
      },
    ],
    incompatibilities: [
      "استفاده همزمان با اکسیدکننده‌های قوی شیمیایی.",
    ],
    clinicalEvidence: "مطالعه تصادفی در Journal of Research in Medical Sciences نشان داد اثر ترانگزامیک اسید موضعی ۳٪ با هیدروکینون ۴٪ در درمان ملاسما برابری کرده اما بدون عوارض اریتم و اکرونوزیس است.",
  },
  {
    id: "ing-salicylic-acid",
    slug: "salicylic-acid-bha",
    nameFa: "اسید سالیسیلیک لیپوفیلیک ۲٪ (BHA) و زینک PCA",
    inciName: "Salicylic Acid, Zinc PCA",
    casNumber: "69-72-7 / 15454-75-8",
    chemicalClass: "بتا هیدروکسی اسید (BHA) / سبورگولاتور و کراتولیتیک",
    clinicalConcentration: "۱.۵٪ تا ۲.۰٪ اسید سالیسیلیک خالص دارویی",
    clinicalRole: "نفوذ به اعماق چربی داخل منافذ، لایه‌برداری کومدون‌های سرسیاه و مهار باکتری مولد آکنه.",
    biologicalMechanism: [
      "حلالیت بالا در چربی (Lipophilicity) و نفوذ مستقیم به مجرای پیلوسباسه.",
      "شکستن باندهای کورنئوسیت‌های متراکم در دهانه فولیکول و تسهیل خروج سبوم به دام افتاده.",
      "مهار سنتز لیپیدهای التهابی توسط یون روی (Zinc) و مهار ۵-آلفاردوکتاز.",
    ],
    safetyProfile: {
      cirRating: "Safe with Concentration Limits (CIR 2023)",
      comedogenicRating: 0,
      tolerability: "ملایم",
      pregnancySafe: "مشروط به تجویز پزشک",
      phRange: "۳.۴ - ۴.۰",
    },
    synergisticCombinations: [
      {
        withIngredient: "Hydrated Silica Spheres & Bamboo Charcoal",
        mechanism: "دتوکس کامل منافذ و جذب سطحی چربی‌های حل‌شده بدون ایجاد آسیب سایشی.",
      },
      {
        withIngredient: "Niacinamide",
        mechanism: "کاهش ترشح سبوم در کنار جمع شدن منافذ و تسکین التهاب.",
      },
    ],
    incompatibilities: ["مصرف همزمان با سایر اسیدهای قوی در افراد دارای اگزمای فعال."],
    clinicalEvidence: "مطالعات متعدد درماتولوژی نشان داده‌اند BHA غلظت ۲٪ طی ۲ هفته بیش از ۶۵٪ کومدون‌های سرسیاه را رفع می‌نماید.",
  },
  {
    id: "ing-hyaluronic-acid",
    slug: "multi-molecular-hyaluronic-acid",
    nameFa: "هیالورونیک اسید با سه وزن مولکولی (بیوتکنولوژیک)",
    inciName: "Sodium Hyaluronate Multi-Molecular Complex",
    casNumber: "9067-32-7",
    chemicalClass: "گلیکوزآمینوگلیکان آبرسان عمقی / Biomimetic Humectant",
    clinicalConcentration: "۱.۵٪ تا ۳.۰٪ غلظت ترکیبی با خلوص تخمیری",
    clinicalRole: "آبرسانی چندلایه‌ای از اپیدرم تا درمیس، افزایش تورژور و تحریک ساخت فیبروبلاست‌ها.",
    biologicalMechanism: [
      "جذب و پیوند هیدروژنی با ۱۰۰۰ برابر وزن مولکولی خود آب در ماتریکس بین‌سلولی.",
      "کسر مولکولی کوچک (<50 kDa) به گیرنده‌های CD44 متصل شده و تولید اسید هیالورونیک خودبه‌خودی بافت را تحریک می‌کند.",
      "کسر مولکولی بزرگ روی سطح استراتوم کورنئوم شبکه کشسانی هیدراته تشکیل داده و مانع TEWL می‌شود.",
    ],
    safetyProfile: {
      cirRating: "Safe as Used (CIR Monograph Grade A)",
      comedogenicRating: 0,
      tolerability: "بسیار ملایم",
      pregnancySafe: true,
      phRange: "۵.۰ - ۷.۰",
    },
    synergisticCombinations: [
      {
        withIngredient: "Carbon Dioxide Transdermal (CarboxyGel)",
        mechanism: "افزایش بهره‌وری نفوذ مولکول‌های آب در بستر پر از اکسیژن ناشی از اثر بوهر.",
      },
      {
        withIngredient: "D-Panthenol Pro-Vitamin B5",
        mechanism: "تقویت سد دفاعی رطوبتی و جلوگیری از خشکی پوست‌های دهیدراته.",
      },
    ],
    incompatibilities: ["ترکیبات کاتیونی سنگین که باعث رسوب پلیمر هیالورونات می‌شوند."],
    clinicalEvidence: "کارآزمایی بالینی دو سو کور کانفیلد ویزیا افزایش ۸۰ درصدی هیدراتاسیون پوستی را طی ۲۸ روز تایید کرده است.",
  },
  {
    id: "ing-alumina-microcrystals",
    slug: "alumina-microcrystals",
    nameFa: "میکروکریستال‌های خالص اکسید آلومینیوم (کروندوم مدیکال)",
    inciName: "Alumina Microcrystals (Pharmaceutical Grade)",
    casNumber: "1344-28-1",
    chemicalClass: "میکروابریسیو معدنی مدیکال / Corundum Polish Crystals",
    clinicalConcentration: "۱۰.۰٪ تا ۱۵.۰٪ در فرمولاسیون خمیر پولیش",
    clinicalRole: "میکرودرم ابریشمی غیرتهاجمی، حذف یکنواخت سلول‌های کدر مرده و افزایش نفوذپذیری اکتیوها.",
    biologicalMechanism: [
      "ساختار کروی بدون زاویه تیز که از خراش و آسیب مکانیکی به پیوندهای دسموزوم سالم جلوگیری می‌کند.",
      "پولیش فیزیکی میکرونی که لایه سلول‌های پیر شاخی را از سطح جدا کرده و بازسازی درم را تحریک می‌نماید.",
      "افزایش نفوذپذیری ترکیبات سرم‌های موضعی بعدی تا بیش از ۱۰۰ درصد.",
    ],
    safetyProfile: {
      cirRating: "Safe as Used (CIR Expert Panel)",
      comedogenicRating: 0,
      tolerability: "ملایم",
      pregnancySafe: true,
      phRange: "۵.۵ - ۶.۸",
    },
    synergisticCombinations: [
      {
        withIngredient: "L-Lactic Acid & Niacinamide",
        mechanism: "ترکیب پولیش فیزیکی با لایه‌برداری شیمیایی ملایم AHA جهت بالاترین شفافیت چهره.",
      },
      {
        withIngredient: "Healene Soothing Gel (Panthenol)",
        mechanism: "التیام و آبرسانی فوری بافت پس از اتمام میکرودرم سالنی.",
      },
    ],
    incompatibilities: ["استفاده روی پوست‌های ملتهب با آکنه کیستیک و روزاسه حاد."],
    clinicalEvidence: "بررسی میکروسکوپ الکترونی SEM نشان‌دهنده حذف کامل بقایای کراتین بدون میکروتراوما در مقایسه با پودر هسته زردآلو است.",
  },
  {
    id: "ing-panthenol-allantoin",
    slug: "d-panthenol-allantoin",
    nameFa: "دی-پانتنول ۵٪ (پروویتامین B5) و آلانتوئین دارویی",
    inciName: "Panthenol, Allantoin Dermal Calmer",
    casNumber: "81-13-0 / 97-59-6",
    chemicalClass: "پیش‌ساز ویتامین B5 و ماده بیولوژیک ضدالتهاب / Dermal Restorative",
    clinicalConcentration: "۳.۰٪ تا ۵.۰٪ فرمولاسیون ژل درمانی",
    clinicalRole: "تسریع تقسیم سلولی و التیام بافت پس از پروسیجرهای لیزر و کربوکسی، کاهش خارش و سوزش.",
    biologicalMechanism: [
      "تبدیل بیوشیمیایی درون‌سلولی به کوآنزیم A (Co-A) که کوفاکتور ضروری ساخت لیپیدها در سلول‌های اپیدرم است.",
      "کاهش ترشح فاکتورهای پیش‌التهابی پروستاگلاندین E2 و مهار واسکولاریزاسیون اریتما.",
      "آلانتوئین با تجزیه کراتینوسیت‌های مرده، تشکیل بافت گرانولاسیون سالم را تسریع می‌کند.",
    ],
    safetyProfile: {
      cirRating: "Safe as Used (CIR Monograph Consensus)",
      comedogenicRating: 0,
      tolerability: "بسیار ملایم",
      pregnancySafe: true,
      phRange: "۵.۰ - ۶.۵",
    },
    synergisticCombinations: [
      {
        withIngredient: "Centella Asiatica & Calendula",
        mechanism: "سینرژی قوی در رفع فوری قرمزی، سوزش و گرگرفتگی بعد از درمان‌های کلینیکی.",
      },
      {
        withIngredient: "Multi-Molecular Hyaluronic Acid",
        mechanism: "هیدراتاسیون ماندگار با تسریع فاز بازسازی سد چربی پوست.",
      },
    ],
    incompatibilities: ["تداخل شناخته‌شده‌ای با فرمولاسیون‌های مراقبتی ندارد."],
    clinicalEvidence: "مطالعات بالینی کاهش بیش از ۶۰ درصدی اریتمای ناشی از سوختگی لیزر فرکشنال را طی ۴۸ ساعت ثبت کرده‌اند.",
  },
  {
    id: "ing-silica-charcoal",
    slug: "hydrated-silica-bamboo-charcoal",
    nameFa: "کره‌های میکرونی سیلیکا و کربن فعال بامبو",
    inciName: "Hydrated Silica Spheres, Activated Bamboo Charcoal",
    casNumber: "112926-00-8 / 7440-44-0",
    chemicalClass: "جاذب‌های متخلخل طبیعی و اسکراب معدنی / Mineral Detox Scrub",
    clinicalConcentration: "۵.۰٪ تا ۸.۰٪ در پایه ژل اسکراب دتوکس",
    clinicalRole: "پاکسازی عمقی منافذ، سم‌زدایی سطحی، لایروبی چربی اکسیدشده و رفع انسداد منافذ بدون میکروپلاستیک.",
    biologicalMechanism: [
      "میکروسفرهای کاملاً کروی سیلیکا با سطح مقطع لغزنده، آلودگی‌ها را بدون خراش استراتوم کورنئوم جدا می‌کنند.",
      "کربن فعال متخلخل بامبو با بار سطحی منفی، ذرات فلزات سنگین، دوده و سبوم را جذب سطحی می‌نماید.",
      "تثبیت فلور طبیعی پوست بدون از بین بردن میکروبیوم محافظ اپیدرم.",
    ],
    safetyProfile: {
      cirRating: "Safe as Used (فاقد میکروپلاستیک - CIR Expert Panel)",
      comedogenicRating: 0,
      tolerability: "ملایم",
      pregnancySafe: true,
      phRange: "۵.۵ - ۶.۵",
    },
    synergisticCombinations: [
      {
        withIngredient: "Salicylic Acid (BHA) & Zinc PCA",
        mechanism: "هم‌افزایی پاکسازی فیزیکی و شیمیایی برای پوست‌های مستعد آکنه و چرب.",
      },
      {
        withIngredient: "Chamomilla Recutita Flower Extract",
        mechanism: "پیشگیری از کشیدگی و التهاب حین پاکسازی عمیق چربی پوست.",
      },
    ],
    incompatibilities: ["روی پوست‌های دارای آکنه عفونی با زخم باز ملتهب نشود."],
    clinicalEvidence: "آزمایشات تصفیه سطحی نشان داده کربن فعال بامبو بیش از ۸۵٪ رادیکال‌ها و ناخالصی‌های شهری را جذب می‌نماید.",
  },
];

export function getIngredient(slug: string): Ingredient | undefined {
  return INGREDIENT_ENCYCLOPEDIA.find((item) => item.slug === slug);
}
