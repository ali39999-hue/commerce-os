export interface Ingredient {
  id: string;
  slug: string;
  nameFa: string;
  inciName: string;
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
      cirRating: "Safe with Concentration Limits",
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
      cirRating: "Safe (بدون سمیت سلولی)",
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
      cirRating: "Safe in Cosmeceuticals",
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
    chemicalClass: "لیپیدهای ساختاری غشای بین‌سلولی / Lipid Barrier Complex",
    clinicalConcentration: "۲.۰٪ تا ۵.۰٪ فرمولاسیون فاز کریستال مایع",
    clinicalRole: "ترمیم فوری سد نفوذپذیری، کاهش TEWL، بازسازی سیمان بین‌سلولی کراتینوسیت‌ها و محافظت در برابر آلرژن‌ها.",
    biologicalMechanism: [
      "تشکیل ساختار لایه‌ای متراکم بیومیمتیک (Lamellar Matrix) شبیه به چربی طبیعی استراتوم کورنئوم با نسبت طلایی ۳:۱:۱.",
      "کاهش تبخیر آب ترنس‌اپیدرمال و پیشگیری از نفوذ عوامل محرک محیطی و باکتری‌ها.",
      "فیتواسفنگوزین موجود در کمپلکس به عنوان مهارکننده طبیعی تکثیر باکتری‌های نامطلوب و التیام‌بخش پوست عمل می‌کند.",
    ],
    safetyProfile: {
      cirRating: "Safe (سازگار بیولوژیک کامل با پوست)",
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
    chemicalClass: "تری‌ترپنوئیدهای گیاهی استانداردشده / Phyto-Therapeutic Active",
    clinicalConcentration: "۰.۲٪ تا ۲.۰٪ ماده موثره خالص",
    clinicalRole: "مهار سیتوکین‌های التهابی، تحریک ساخت کلاژن تیپ I، بهبود جای زخم و سوختگی و پیشگیری از اسکار هایپرتروفیک.",
    biologicalMechanism: [
      "مهار مستقیم آنزیم‌های اکسیداتیو و مهار ترشح اینترلوکین ۱-آلفا (IL-1α) و فاکتور نکروز تومور (TNF-α).",
      "تحریک مهاجرت سلول‌های اندوتلیال و کراتینوسیت‌ها به محل زخم در فاز پرولیفراتیو ترمیم بافت.",
      "افزایش بیان ژن‌های پروتئین‌های اتصالی کلودین-۱ (Claudin-1) و فیلاگرین (Filaggrin).",
    ],
    safetyProfile: {
      cirRating: "Safe for Topical Use",
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
    chemicalClass: "مهارکننده سیستم پلاسمین-پلاسمینوژن / مشتق مصنوعی اسید آمینه لیزین",
    clinicalConcentration: "۲.۰٪ تا ۵.۰٪ فرم موضعی کلینیکی",
    clinicalRole: "درمان ملاسما و هایپرپیگمانتاسیون‌های هورمونی و پس‌التهابی عروقی (Vascular PIH).",
    biologicalMechanism: [
      "مهار اتصال پلاسمینوژن به کراتینوسیت‌ها و جلوگیری از فعال‌سازی آنزیم پلاسمین به دنبال تابش فرابنفش (UV).",
      "کاهش تولید اسید آراشیدونیک و پروستاگلاندین‌ها که محرک مستقیم ترشح ملانین از ملانوسیت‌ها هستند.",
      "مهار اتساع مویرگی در ضایعات ملاسما و کاهش جزء عروقی لک‌های پوستی.",
    ],
    safetyProfile: {
      cirRating: "Safe in Clinical Cosmeceuticals",
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
];

export function getIngredient(slug: string): Ingredient | undefined {
  return INGREDIENT_ENCYCLOPEDIA.find((item) => item.slug === slug);
}
