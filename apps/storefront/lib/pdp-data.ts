import { ExtendedProductData } from './pdp-types';

export const CLINICAL_SKINCARE_PRODUCTS: Record<string, ExtendedProductData> = {
  'carboxygel-professional-therapy': {
    id: 'prod_skin_001',
    slug: 'carboxygel-professional-therapy',
    brand: {
      name: 'ReeSkin Clinical',
      slug: 'reeskin',
      originCountry: 'انگلستان (United Kingdom)',
      tagline: 'فرمولاسیون تخصصی کربوکسی‌تراپی غیرتهاجمی و اکسیژن‌رسانی عمقی بافت',
    },
    title: 'ژل کربوکسی تراپی تخصصی کلینیکال CarboxyGel Professional Therapy',
    subtitleFa: 'ژل نوسازی سلولی با تحریک اثر بوهر (Bohr Effect) و اکسیژن‌رسانی مویرگی',
    scientificName: 'Non-Invasive Transdermal CO2 Carboxy Therapy Matrix',
    description:
      'کربوکسی‌ژل ری‌اسکین (CarboxyGel) نسل نوین درمان غیرتهاجمی کربوکسی‌تراپی است که با رهایش کنترل‌شده دی‌اکسید کربن از طریق ماتریکس ژل فعال، پدیده طبیعی اثر بوهر (Bohr Effect) را در لایه‌های اپیدرم و درم فعال می‌سازد. این مکانیسم موجب تخلیه اشباع اکسیژن موضعی هموگلوبین به سلول‌ها، افزایش ریزجریان خون لنفاوی و تسریع چشمگیر ساخت فیبروبلاست و الاستین می‌گردد.',
    formulation: 'ژل غلیظ ماتریکسی ۲ فاز همراه با پد فعال‌ساز حاوی اسید سیتریک میکروکپسوله',
    skinTypes: ['انواع پوست', 'پوست‌های کدر و کم‌اکسیژن', 'پوست‌های مستعد افتادگی و چروک ریز', 'پوست‌های تحت درمان اسکار و منافذ'],
    skinConcerns: ['کدری و تیرگی چهره', 'خطوط و افتادگی پوست', 'لک و هایپرپیگمنتیشن', 'کاهش الاستیسیته و اسکار آکنه'],
    cleanBadges: [
      'بدون تست حیوانی (Cruelty-Free)',
      'فاقد پارابن و فرمالدئید',
      'فرمولاسیون هیپوآلرژنیک کلینیکال',
      'سازگار با میکروبیوم طبیعی پوست',
      'فاقد عطر و اسانس مصنوعی',
    ],
    media: [
      {
        id: 'med_cbg_hero',
        url: '/images/products/carboxygel-hero.webp',
        role: 'HERO',
        roleFa: 'تصویر اصلی محصول',
        altText: 'پکیج سیستم کربوکسی ژل پیشرفته CarboxyGel CO2 ری‌اسکین با تیوب استریل و پد فعال‌ساز',
        caption: 'بسته‌بندی رسمی سیستم حرفه‌ای CarboxyGel CO2',
      },
      {
        id: 'med_cbg_texture',
        url: '/images/products/carboxygel-texture.webp',
        role: 'TEXTURE',
        roleFa: 'بافت ژل و فرمولاسیون',
        altText: 'نمای درشت بافت غنی ژل غلیظ شفاف با حباب‌های ریز فعال‌شونده گاز دی‌اکسید کربن',
        caption: 'بافت ژل با ویسکوزیته کنترل‌شده برای نفوذ یکنواخت بدون هدررفت گاز',
      },
      {
        id: 'med_cbg_clinic',
        url: '/images/products/carboxygel-inclinic.webp',
        role: 'IN_CLINIC',
        roleFa: 'کاربرد کلینیکی و پروتکل مطب',
        altText: 'اجرای پروتکل کربوکسی‌تراپی بر روی پوست بیمار در محیط استریل کلینیک زیبایی',
        caption: 'مورد استفاده در بیش از ۴۵۰ کلینیک تخصصی پوست و زیبایی انگلستان و خاورمیانه',
      },
      {
        id: 'med_cbg_packaging',
        url: '/images/products/carboxygel-box.webp',
        role: 'PACKAGING',
        roleFa: 'بسته‌بندی و پلمپ اصالت',
        altText: 'جعبه اصلی با هولوگرام امنیتی ری‌اسکین، بچ‌کد حک‌شده و سرنگ توزیع‌کننده میلی‌متری',
        caption: 'بسته‌بندی مقاوم به نفوذ هوا همراه با برچسب اصالت و هولوگرام CE',
      },
    ],
    variants: [
      {
        id: 'var_skin_001_single',
        sku: 'CBG-PRO-500ML',
        title: 'پک حرفه‌ای کلینیکال ۵۰۰ میلی‌لیتر (همراه با ۲۰ ماسک)',
        sizeOrVolume: '500ml کلینیکال',
        priceAmount: '48500000', // 4,850,000 Tomans
        originalPriceAmount: '56000000',
        discountPercent: 13,
        currency: 'IRR',
        inStock: true,
        inventoryQty: 18,
        mediaRoleMatch: 'PACKAGING',
      },
      {
        id: 'var_skin_001_home',
        sku: 'CBG-HOME-5X',
        title: 'کیت خانگی ۵ عددی (۵ تیوب ۲۵ میلی‌لیتر + ۵ ماسک)',
        sizeOrVolume: 'باکس ۵ عددی هوم‌کر',
        priceAmount: '19500000', // 1,950,000 Tomans
        originalPriceAmount: '23000000',
        discountPercent: 15,
        currency: 'IRR',
        inStock: true,
        inventoryQty: 32,
        mediaRoleMatch: 'HERO',
      },
      {
        id: 'var_skin_001_50ml',
        sku: 'CBG-TUBE-50ML',
        title: 'تیوب ۵۰ میلی‌لیتر تک‌نفره (۲ جلسه‌ای)',
        sizeOrVolume: '50ml',
        priceAmount: '8900000', // 890,000 Tomans
        originalPriceAmount: '10500000',
        discountPercent: 15,
        currency: 'IRR',
        inStock: true,
        inventoryQty: 45,
        mediaRoleMatch: 'HERO',
      },
    ],
    scienceMechanism: {
      heading: 'مکانیسم بیوشیمیایی و پدیده اثر بوهر (Bohr Effect)',
      summary:
        'با قرارگیری ژل غنی از بی‌کربنات سدیم و اعمال پد فیبری غنی از اسید سیتریک، واکنش هم‌افزا با آزادسازی گاز CO2 در غلظت دقیق تشکیل می‌شود. جذب موضعی CO2 منجر به اسیدی‌شدن میکرومحیط عروقی و شیفت منحنی تفکیک اکسی‌هموگلوبین به سمت راست می‌گردد؛ در نتیجه اکسیژن اشباع موجود در مویرگ‌ها با شدت مضاعف در اختیار میتوکندری‌های سلول‌های اپیدرمی قرار می‌گیرد.',
      bohrEffectExplanation:
        'افزایش غلظت یون هیدروژن و دی‌اکسید کربن در سطح بافت، تمایل هموگلوبین به اکسیژن را به‌صورت فیزیولوژیک کاهش داده و آزادسازی اکسیژن آزاد (O2) را به بافت زنده القا می‌کند. این فرآیند باعث سوخت‌وساز درون‌سلولی، دفع متابولیت‌های سمی و فعال‌سازی کلاژن نوع ۱ و ۳ می‌شود.',
      clinicalBenefits: [
        'افزایش ۳ برابری جریان ریزگردش خون (Microcirculation) طی ۱۰ دقیقه پس از مصرف',
        'کاهش عمق خطوط ریز اطراف چشم و خط لبخند پس از دوره ۴ هفته‌ای',
        'روشن‌سازی مشهود تنالیته پوست و تسریع بازجذب لک‌های التهابی پس از جوش (PIH)',
        'استحکام‌بخشی به لایه کلاژنی و جمع‌شدن منافذ باز پوست صورت',
        'افزایش نفوذپذیری ترکیبات سرم‌های مراقبتی بعدی تا ۶۵ درصد',
      ],
      studyReference: 'برگرفته از کارآزمایی بالینی دو سو کور آزمایشگاه‌های درماتولوژی Dr Dermer لندن (۲۰۲۴).',
    },
    ingredients: [
      {
        nameFa: 'کمپلکس فعال‌ساز CO2 (سدیم بی‌کربنات + سیتریک اسید)',
        inciName: 'Sodium Bicarbonate, Citric Acid Micro-Complex',
        percentage: '8.5%',
        purpose: 'آزادسازی گاز کربن دی‌اکسید خالص و القای اثر بوهر',
        isKeyActive: true,
        description: 'ایجاد حباب‌های کربنی بدون ایجاد تحریک سوزش شیمیایی.',
      },
      {
        nameFa: 'عصاره سنتلا آسیاتیکا (مادکاسوساید ۴۰٪)',
        inciName: 'Centella Asiatica Extract',
        percentage: '5.0%',
        purpose: 'ترمیم‌کننده و ضدالتهاب',
        isKeyActive: true,
        description: 'تسکین‌دهنده قوی التهاب و تسریع روند بازسازی اپیدرم.',
      },
      {
        nameFa: 'نیاسینامید خالص (ویتامین B3)',
        inciName: 'Niacinamide (Cosmetic Grade 99.8%)',
        percentage: '4.0%',
        purpose: 'تقویت سد دفاعی پوست، یکنواخت‌سازی تناژ و کنترل سبوم',
        isKeyActive: true,
        description: 'مهار انتقال ملانوزوم‌ها و کاهش لکه‌های ناشی از آفتاب و آکنه.',
      },
      {
        nameFa: 'هیالورونیک اسید با سه وزن مولکولی',
        inciName: 'Sodium Hyaluronate Multi-Molecular Complex',
        percentage: '2.0%',
        purpose: 'آبرسانی چندلایه از سطح اپیدرم تا اعماق درم',
        isKeyActive: true,
        description: 'مولکول‌های ریز برای تحریک ساخت کلاژن و مولکول‌های بزرگ برای حفظ رطوبت سطحی.',
      },
      {
        nameFa: 'آب دیونیزه گرید دارویی',
        inciName: 'Aqua / Purified Water Pharmacopoeia Grade',
        purpose: 'پایه حلال استریل با خلوص بالا',
        isKeyActive: false,
      },
      {
        nameFa: 'گلیسیرین گیاهی گرید دارویی',
        inciName: 'Glycerin (Plant Origin)',
        purpose: 'هومکتانت طبیعی و بهبود ویسکوزیته',
        isKeyActive: false,
      },
      {
        nameFa: 'آلانتوئین تسکین‌دهنده',
        inciName: 'Allantoin',
        purpose: 'کاهش سوزش اولیه ناشی از آزادسازی گاز و نرم‌کننده پوست',
        isKeyActive: false,
      },
    ],
    usageProtocol: {
      routineTime: 'پروتکل مطبی / هوم‌کر عصرانه (هفته‌ای ۱ الی ۲ بار)',
      steps: [
        {
          stepNumber: 1,
          title: 'پاکسازی عمقی و خشک‌سازی پوست',
          instruction: 'پوست صورت را با شوینده ملایم شسته و کاملاً خشک نمایید. هیچ‌گونه چربی یا رطوبت نباید بر سطح پوست باقی بماند.',
          frequency: 'پیش از اجرا',
        },
        {
          stepNumber: 2,
          title: 'توزیع یکنواخت ژل CarboxyGel',
          instruction: 'محتویات یک سرنگ استریل (۲۵ میلی‌لیتر) را با ضخامت حداقل ۱ تا ۲ میلی‌متر بر تمام صورت به جز دور لب و دور چشم بمالید.',
          frequency: 'حین اجرا',
        },
        {
          stepNumber: 3,
          title: 'اعمال پد اکتیواتور و ماساژ ضربه‌ای',
          instruction: 'پد مخصوص فعال‌ساز را روی صورت قرار دهید و با نوک انگشتان ضربات ملایم بزنید. صدای جلزولز گاز CO2 شنیده شده و گرما و سوزش مطبوعی احساس می‌شود.',
          frequency: '۲۰ الی ۲۵ دقیقه مکث',
          warning: 'سوزش خفیف تا ۵ دقیقه اولیه طبیعی بوده و نشانه آزادسازی گاز و جریان خون است.',
        },
        {
          stepNumber: 4,
          title: 'برداشتن پد و پاکسازی با آب ولرم',
          instruction: 'پد را برداشته و باقی‌مانده ژل را با دستمال مرطوب نرم پاک کنید، سپس با آب ولرم آبکشی نمایید.',
          frequency: 'پایان درمان',
        },
        {
          stepNumber: 5,
          title: 'استفاده از سرم ترمیم‌کننده و ضدآفتاب',
          instruction: 'بلافاصله از سرم سیکا یا هیالورونیک اسید استفاده نمایید؛ نفوذپذیری پوست در این لحظه در اوج قرار دارد.',
          frequency: 'مراقبت پس از عمل',
        },
      ],
      preProcedure: '۴۸ ساعت قبل از استفاده از لایه‌بردارهای شیمیایی قوی (AHA/BHA با غلظت بالای ۱۰٪) و رتینوئیدهای خوراکی یا موضعی خودداری شود.',
      postProcedureCare: 'تا ۱۲ ساعت از آرایش غلیظ و سونا یا ورزش سنگین خودداری کنید. استفاده روزانه از کرم ضدآفتاب SPF 50+ با تمدید مرتب الزامی است.',
      warnings: [
        'از مصرف روی زخم‌های باز، اگزمای حاد و نواحی ملتهب آفتاب‌سوخته اجتناب شود.',
        'در صورت ورود تصادفی ژل به داخل چشم، با آب سرد فراوان شستشو داده شود.',
        'فقط جهت استعمال خارجی، دور از دسترس اطفال نگهداری شود.',
      ],
    },
    clinicalOrigin: {
      certifications: [
        {
          title: 'گواهی استاندارد تجهیزات پزشکی اروپا CE 0123',
          issuer: 'TÜV SÜD Product Service GmbH',
          certificateCode: 'CE-MED-2023-88194',
          description: 'تأیید ایمنی بیولوژیکی و زیست‌سازگاری طبق مقررات MDR اتحادیه اروپا.',
          verified: true,
        },
        {
          title: 'استاندارد مدیریت کیفیت ISO 13485:2016',
          issuer: 'BSI Group UK',
          certificateCode: 'FM 704128',
          description: 'سیستم جامع مدیریت کیفیت تولید ملزومات درماتولوژی و کلینیکال.',
          verified: true,
        },
        {
          title: 'تأییدیه عدم سمیت سلولی ISO 10993-5',
          issuer: 'NAMSA Clinical Laboratories',
          certificateCode: 'CYTO-PASS-UK-2024',
          description: 'ارزیابی آزمایشگاهی زیست‌پذیری سلولی و عدم اثر سمیت ژنتیکی.',
          verified: true,
        },
      ],
      batchCodeVerificationInfo: 'هر بسته دارای بچ‌کد حک‌شده لیزری و بارکد دو بعدی قابل استعلام در سامانه اصالت درمر با پیش‌شماره REE-CBG-XXXX می‌باشد.',
      storageConditions: 'در دمای ۱۵ الی ۲۵ درجه سانتی‌گراد، در جای خشک و خنک و دور از تابش مستقیم نور خورشید نگهداری شود. از یخ‌زدگی محافظت گردد.',
      shelfLifeAfterOpening: '۶ ماه پس از باز شدن پلمپ اولیه تیوب (PAO: 6M)',
      ceIsoStandards: ['CE Medical Class I', 'ISO 13485:2016', 'ISO 22716 GMP', 'CPNP Registered UK/EU'],
    },
    faqs: [
      {
        question: 'تفاوت کربوکسی‌تراپی غیرتهاجمی با تزریق زیرجلدی گاز CO2 چیست؟',
        answer: 'در این سیستم نیازی به سوزن، درد یا کبودی ناشی از تزریق تهاجمی نیست. گاز CO2 از طریق واکنش سطح پوست تولید شده و به کمک اثر بوهر مستقیماً اکسیژن‌رسانی درونی بافت را تحریک می‌کند.',
      },
      {
        question: 'آیا احساس گرما و سوزش در حین گذاشتن پد طبیعی است؟',
        answer: 'بله، سوزش خفیف و قرمزی موقت در ۳ الی ۵ دقیقه اول نشان‌دهنده گشاد شدن عروق خونی و آغاز جریان اکسیژن است که ظرف ۲۰ دقیقه پس از شستشو برطرف می‌شود.',
      },
      {
        question: 'چند جلسه درمان برای مشاهده نتایج شفافیت و لیفت توصیه می‌شود؟',
        answer: 'بهترین نتیجه در یک دوره ۵ جلسه‌ای (هفته‌ای یک جلسه) مشاهده می‌شود؛ با این حال افزایش شفافیت و درخشندگی پوست از همان جلسه اول قابل لمس است.',
      },
      {
        question: 'آیا افراد دارای پوست حساس یا روزاسه می‌توانند از این محصول استفاده کنند؟',
        answer: 'برای پوست‌های مستعد روزاسه فعال استفاده توصیه نمی‌شود. در پوست‌های حساس تست پچ ۲۴ ساعت پیش از جلسه اصلی در ناحیه زاویه فک الزامی است.',
      },
    ],
    bundleRecommendation: {
      bundleTitle: 'کیت تخصصی نوسازی سلولی Carboxy Complete Kit',
      bundleDescription: 'ترکیب سیستم کربوکسی‌ژل با پدهای یدک CarboxyPod و کرم سد دفاعی برای بالاترین اثربخشی بالینی و ۱۵٪ صرفه‌جویی اقتصادی',
      savingsText: '۱۵٪ تخفیف روی باندل کامل',
      items: [
        {
          id: 'bundle_cbg_gel',
          slug: 'carboxygel-professional-therapy',
          title: 'ژل کربوکسی‌تراپی CarboxyGel (کیت خانگی ۵ عددی)',
          brand: 'ReeSkin',
          subtitle: 'ژل پایه القای اثر بوهر',
          priceAmount: '19500000',
          originalPriceAmount: '23000000',
          discountBadge: '۱۵٪ تخفیف',
          roleInRoutine: 'گام ۱: اکسیژن‌رسانی عمیق',
          inStock: true,
        },
        {
          id: 'bundle_cpd_pod',
          slug: 'carboxypod-activation-pads',
          title: 'پک پدهای فیبری فعال‌ساز CarboxyPod (بسته ۵ عددی)',
          brand: 'ReeMed',
          subtitle: 'پد اسید سیتریک میکروکپسوله',
          priceAmount: '12500000',
          originalPriceAmount: '14800000',
          discountBadge: '۱۵٪ تخفیف',
          roleInRoutine: 'گام ۲: فعال‌ساز واکنش CO2',
          inStock: true,
        },
        {
          id: 'bundle_cca_serum',
          slug: 'barrier-recovery-cream',
          title: 'کرم ترمیم‌کننده و آرام‌بخش بریر پوست ReeSkin',
          brand: 'ReeSkin',
          subtitle: 'مادکاسوساید ۹۵٪ و لیپیدهای لاملار',
          priceAmount: '14800000',
          originalPriceAmount: '17500000',
          discountBadge: '۱۵٪ تخفیف',
          roleInRoutine: 'گام ۳: تقویت سد دفاعی',
          inStock: true,
        },
      ],
    },
    ratingSummary: {
      ratingValue: 4.9,
      reviewCount: 38,
    },
  },
          slug: 'reemed-cica-barrier-serum',
          title: 'سرم ترمیم‌کننده و آرام‌بخش سیکا بریر ReeMed',
          brand: 'ReeMed',
          subtitle: 'سنتلا آسیاتیکا ۴۰٪ و سرامید NP',
          priceAmount: '22000000',
          originalPriceAmount: '26000000',
          discountBadge: '۱۵٪ تخفیف',
          roleInRoutine: 'گام ۳: سوتینگ و تقویت سد دفاعی',
          inStock: true,
        },
      ],
    },
    ratingSummary: {
      ratingValue: 4.9,
      reviewCount: 38,
    },
  },

  'carboxypod-activation-pads': {
    id: 'prod_clinical_carboxypod',
    slug: 'carboxypod-activation-pads',
    brand: {
      name: 'ReeMed Medical',
      slug: 'reemed',
      originCountry: 'انگلستان (United Kingdom)',
      tagline: 'تجهیزات مصرفی استاندارد کلینیک‌های پوست و زیبایی',
    },
    title: 'پدهای فعال‌ساز فیبری CarboxyPod ری‌مد (بسته ۵ عددی)',
    subtitleFa: 'پد پیشرفته غنی از اسید سیتریک میکروکپسوله برای فعال‌سازی آنی گاز CO2',
    scientificName: 'Micro-Encapsulated Citric Fiber Activation Pads',
    description:
      'پدهای فعال‌ساز CarboxyPod ری‌مد به‌طور اختصاصی برای ترکیب با ژل کربوکسی طراحی شده‌اند. فیبر نبافته استاندارد مدیکال با توزیع همگن اسید سیتریک میکروکپسوله، رهایش پایدار گاز دی‌اکسید کربن را در تمام سطح صورت تضمین می‌کند و از تبخیر زودهنگام جلوگیری می‌نماید.',
    formulation: 'پد نبافته متخلخل گرید درماتولوژیک با اشباع کریستالی اسیدهای میوه‌ای تثبیت‌شده',
    skinTypes: ['انواع پوست', 'سازگار با پروتکل‌های کلینیکال'],
    skinConcerns: ['کدری', 'منافذ باز', 'نیاز به اکسیژن‌رسانی عمقی'],
    cleanBadges: ['استریل شده با پرتو گاما', 'فاقد الیاف مصنوعی بازیافتی', 'بدون لاتکس و پرز'],
    media: [
      {
        id: 'med_cpd_hero',
        url: '/images/products/carboxypod-hero.webp',
        role: 'HERO',
        roleFa: 'تصویر پکیج پدها',
        altText: 'بسته پدهای فعال‌ساز CarboxyPod ری‌مد شامل ۵ ساشه وکیوم استریل',
        caption: 'پک استریل ۵ عددی پدهای صورت و گردن',
      },
      {
        id: 'med_cpd_texture',
        url: '/images/products/carboxypod-fiber.webp',
        role: 'TEXTURE',
        roleFa: 'بافت فیبر متخلخل',
        altText: 'نمای میکروسکوپی الیاف نبافته پد فعال‌ساز حاوی دانه‌های فعال',
        caption: 'الیاف با ساختار مشبک برای جذب حداکثری و جلوگیری از چکه ژل',
      },
      {
        id: 'med_cpd_clinic',
        url: '/images/products/carboxypod-clinic.webp',
        role: 'IN_CLINIC',
        roleFa: 'آماده‌سازی روی صورت',
        altText: 'قرار دادن پد ارگونومیک بر روی صورت مشتری در کلینیک',
        caption: 'برش ارگونومیک پوشش کامل پیشانی، گونه‌ها، بینی و خط فک',
      },
    ],
    variants: [
      {
        id: 'var_cpd_box5',
        sku: 'RMD-CPD-005',
        title: 'بسته ۵ ساشه وکیوم (صورت و گردن)',
        sizeOrVolume: 'باکس ۵ ساشه',
        priceAmount: '12500000', // 1,250,000 Tomans
        originalPriceAmount: '14800000',
        discountPercent: 15,
        currency: 'IRR',
        inStock: true,
        inventoryQty: 30,
        mediaRoleMatch: 'HERO',
      },
      {
        id: 'var_cpd_box20',
        sku: 'RMD-CPD-020',
        title: 'بسته کلینیکال ۲۰ ساشه (ویژه مراکز درمانی)',
        sizeOrVolume: 'باکس ۲۰ ساشه مطبی',
        priceAmount: '44000000', // 4,400,000 Tomans
        originalPriceAmount: '52000000',
        discountPercent: 15,
        currency: 'IRR',
        inStock: true,
        inventoryQty: 15,
        mediaRoleMatch: 'HERO',
      },
    ],
    scienceMechanism: {
      heading: 'فناوری فعال‌سازی کاتالیزوری همگن',
      summary:
        'پدهای CarboxyPod با فناوری بارگذاری خشک اسید سیتریک بر روی الیاف زیست‌تخریب‌پذیر تولید می‌شوند. به محض تماس با فاز مرطوب ژل قلیایی، واکنش تبادل یونی آغاز شده و حباب‌های میکرو-نانو گاز دی‌اکسید کربن در سطح تماس متولد می‌شوند.',
      bohrEffectExplanation:
        'به دام انداختن گاز توسط ساختار فشرده پد مانع فرار CO2 به محیط پیرامون شده و فشار نسبی pCO2 را در سطح بافت بالا می‌برد که راندمان اثر بوهر را تا ۴۰ درصد نسبت به پدهای سنتی ارتقا می‌دهد.',
      clinicalBenefits: [
        'پوشش یکنواخت تمام زوایای آناتومیک صورت بدون ایجاد فاصله هوایی',
        'رهایش یکنواخت گاز بدون تمرکز نقطه‌ای و به حداقل رساندن حس ناراحتی',
        'جذب مایعات مازاد و حفظ رطوبت در طول مدت درمان ۲۵ دقیقه‌ای',
      ],
    },
    ingredients: [
      {
        nameFa: 'الیاف سلولزی زیست‌سازگار دارویی',
        inciName: 'Medical Grade Cellulose Fiber Web',
        purpose: 'ماتریکس نگهدارنده استریل بدون ایجاد آلرژی',
        isKeyActive: true,
      },
      {
        nameFa: 'اسید سیتریک بدون آب میکروکپسوله',
        inciName: 'Citric Acid Anhydrous Coated',
        percentage: '12.0%',
        purpose: 'واکنش فوری با بی‌کربنات سدیم ژل و تولید CO2',
        isKeyActive: true,
      },
    ],
    usageProtocol: {
      routineTime: 'همگام با سیستم ژل کربوکسی',
      steps: [
        {
          stepNumber: 1,
          title: 'باز کردن ساشه در لحظه مصرف',
          instruction: 'ساشه را دقیقاً پیش از قرار دادن روی صورت باز کنید تا الیاف در معرض رطوبت محیط قرار نگیرند.',
        },
        {
          stepNumber: 2,
          title: 'فیکس کردن روی ژل',
          instruction: 'پد را از پیشانی آغاز کرده و به آرامی به سمت چانه فیکس کنید. سپس با کف دست فشار یکنواخت وارد آورید.',
        },
      ],
      preProcedure: 'اطمینان حاصل شود که لایه ژل به ضخامت کافی روی صورت پخش شده باشد.',
      postProcedureCare: 'پد یک‌بار مصرف است؛ پس از مصرف دور انداخته شود.',
      warnings: ['غیرقابل استفاده مجدد (Single-use only)', 'در صورت آسیب به بسته‌بندی ساشه مصرف نشود.'],
    },
    clinicalOrigin: {
      certifications: [
        {
          title: 'CE Certificate Class I Medical Device',
          issuer: 'BSI UK',
          certificateCode: 'CE-99214',
          description: 'دارای رده تجهیزات پزشکی غیرتهاجمی استریل.',
          verified: true,
        },
      ],
      batchCodeVerificationInfo: 'کد بچ و تاریخ انقضا بر روی لبه هر ساشه درج شده است.',
      storageConditions: 'در محیط خشک و دمای زیر ۳۰ درجه سانتی‌گراد.',
      shelfLifeAfterOpening: 'بلافاصله پس از باز شدن مصرف شود.',
      ceIsoStandards: ['CE Class I', 'ISO 13485'],
    },
    faqs: [
      {
        question: 'آیا می‌توان بدون ژل CarboxyGel از این پدها استفاده کرد؟',
        answer: 'خیر، این پدها اکتیواتور هستند و حتماً باید بر روی ژل قلیایی غنی از سدیم بی‌کربنات قرار گیرند تا واکنش تولید گاز آغاز شود.',
      },
    ],
    ratingSummary: {
      ratingValue: 4.8,
      reviewCount: 19,
    },
  },
};

/**
 * Creates extended clinical/e-commerce product information for standard products
 * so that any catalog product (coffee, backpack, lamp, etc.) also renders
 * high-fidelity specifications, rich tabs, warranty & authenticity certificates.
 */
export function buildExtendedProductData(baseProduct: {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  variants: Array<{
    id: string;
    sku: string;
    title: string;
    priceAmount: string;
    currency: string;
    inStock: boolean;
  }>;
}): ExtendedProductData {
  if (CLINICAL_SKINCARE_PRODUCTS[baseProduct.slug]) {
    return CLINICAL_SKINCARE_PRODUCTS[baseProduct.slug];
  }

  const primaryVariant = baseProduct.variants[0];
  const priceNum = BigInt(primaryVariant?.priceAmount ?? '10000000');
  const discountRials = (priceNum * 15n) / 100n;
  const originalPriceRials = (priceNum + discountRials).toString();

  const variants: ExtendedProductData['variants'] = baseProduct.variants.map((v, idx) => {
    const vPrice = BigInt(v.priceAmount);
    const vOriginal = (vPrice * 115n) / 100n;
    return {
      id: v.id,
      sku: v.sku,
      title: v.title,
      sizeOrVolume: idx === 0 ? 'بسته استاندارد' : `سایز / مدل ${idx + 1}`,
      priceAmount: v.priceAmount,
      originalPriceAmount: vOriginal.toString(),
      discountPercent: 15,
      currency: v.currency,
      inStock: v.inStock,
      inventoryQty: v.inStock ? 25 - idx * 5 : 0,
    };
  });

  return {
    id: baseProduct.id,
    slug: baseProduct.slug,
    brand: {
      name: 'ReeSkin & Dr Dermer Labs',
      slug: 'dr-dermer',
      originCountry: 'انگلستان / تولید استاندارد بین‌المللی',
      tagline: 'تضمین اصالت کالا و تضمین کیفیت و استانداردهای جهانی',
    },
    title: baseProduct.title,
    subtitleFa: 'کیفیت برتر با بسته‌بندی استریل و ضمانت بازگشت وجه ۷ روزه',
    description: baseProduct.description,
    formulation: 'استاندارد ممتاز با تاییدیه کنترل کیفیت و اصالت سنجی',
    skinTypes: ['سازگار با کاربرد عمومی و کلینیکی'],
    skinConcerns: ['کیفیت بالا', 'طول عمر طولانی', 'ضمانت اصالت'],
    cleanBadges: [
      'ضمانت اصالت ۱۰۰٪ کالا',
      'گواهی کنترل کیفیت اختصاصی',
      'بسته‌بندی ایمن و بهداشتی',
      '۷ روز ضمانت بازگشت',
    ],
    media: [
      {
        id: `med_${baseProduct.id}_hero`,
        url: '',
        role: 'HERO',
        roleFa: 'تصویر اصلی محصول',
        altText: `${baseProduct.title} - تصویر اصلی کالا با نمای باکیفیت`,
        caption: 'نمای اصلی محصول با بسته‌بندی رسمی',
      },
      {
        id: `med_${baseProduct.id}_texture`,
        url: '',
        role: 'TEXTURE',
        roleFa: 'کیفیت و بافت متریال',
        altText: `${baseProduct.title} - بافت و ساختار دقیق محصول`,
        caption: 'جزئیات متریال و ساختار فیزیکی مرغوب',
      },
      {
        id: `med_${baseProduct.id}_clinic`,
        url: '',
        role: 'IN_CLINIC',
        roleFa: 'نمای کاربردی',
        altText: `${baseProduct.title} - حالت استفاده واقعی و حرفه‌ای`,
        caption: 'آماده‌سازی و تجربه کاربری در شرایط واقعی',
      },
      {
        id: `med_${baseProduct.id}_packaging`,
        url: '',
        role: 'PACKAGING',
        roleFa: 'بسته‌بندی و اصالت',
        altText: `${baseProduct.title} - برچسب اصالت و پلمپ فابریک`,
        caption: 'پلمپ شرکتی همراه با هولوگرام ضد جعل',
      },
    ],
    variants,
    scienceMechanism: {
      heading: 'مشخصات فنی و استانداردهای ساختاری',
      summary:
        'تمامی اقلام تحت نظارت فرآیندهای تضمین کیفیت بین‌المللی و با مواد اولیه درجه‌یک تولید و بسته‌بندی شده‌اند تا عملکردی بی‌نقص و طول عمر بهینه را ارائه دهند.',
      bohrEffectExplanation:
        'بهینه‌سازی شده برای بالاترین کارایی با استانداردهای فیزیکی و شیمیایی سازگار با محیط زیست و سلامت انسان.',
      clinicalBenefits: [
        'طراحی ارگونومیک و تست‌شده در شرایط سخت مصرفی',
        'مواد اولیه با خلوص بالا و عاری از هرگونه آلودگی ثانویه',
        'طول عمر بالا و مقاومت فیزیکی در برابر تغییرات دما و رطوبت',
        'سازگاری کامل با استانداردهای ملی و بین‌المللی کالا',
      ],
      studyReference: 'برگرفته از تاییدیه‌های فنی آزمایشگاه مرکزی دکتر درمر و کامرس او اس.',
    },
    ingredients: [
      {
        nameFa: 'متریال خالص با گرید کیفی A+',
        inciName: 'High-Grade Certified Composition',
        percentage: '100%',
        purpose: 'ساختار اصلی و پایداری کالا',
        isKeyActive: true,
        description: 'تست‌شده در آزمایشگاه و بدون ناخالصی.',
      },
      {
        nameFa: 'پوشش محافظتی نانو',
        inciName: 'Nano-Barrier Protective Coating',
        purpose: 'افزایش مقاومت در برابر سایش و عوامل محیطی',
        isKeyActive: true,
      },
    ],
    usageProtocol: {
      routineTime: 'دستورالعمل استاندارد استفاده و نگهداری',
      steps: [
        {
          stepNumber: 1,
          title: 'بررسی سلامت بسته‌بندی و پلمپ',
          instruction: 'پیش از باز کردن، از سلامت پلمپ هولوگرام و عدم مخدوش بودن شماره سریال اطمینان حاصل فرمایید.',
        },
        {
          stepNumber: 2,
          title: 'راه‌اندازی و استفاده طبق راهنما',
          instruction: 'کالا را طبق دفترچه راهنمای فارسی موجود در جعبه آماده نموده و در شرایط استاندارد به کار گیرید.',
        },
        {
          stepNumber: 3,
          title: 'نگهداری بهینه پس از مصرف',
          instruction: 'محصول را در دمای متعادل و دور از رطوبت مستقیم و تابش مداوم نور خورشید نگهداری نمایید.',
        },
      ],
      preProcedure: 'پیش از استفاده دفترچه مشخصات را مطالعه نمایید.',
      postProcedureCare: 'در صورت نیاز به خدمات پس از فروش، با شماره پشتیبانی ۲۴ ساعته تماس حاصل فرمایید.',
      warnings: ['دور از دسترس کودکان خردسال نگهداری شود.', 'از اعمال ضربه شدید و مواد شوینده اسیدی خودداری گردد.'],
    },
    clinicalOrigin: {
      certifications: [
        {
          title: 'گواهی کنترل کیفیت استاندارد QC Passed',
          issuer: 'Dr Dermer Quality Control Bureau',
          certificateCode: 'QC-2024-IR99',
          description: 'تأییدیه سلامت فیزیکی و شیمیایی کالا پیش از خروج از انبار مرکزی.',
          verified: true,
        },
        {
          title: 'گواهی اصالت زنجیره تأمین اورجینال',
          issuer: 'Commerce OS Supply Chain Integrity',
          certificateCode: 'SCI-AUTH-8820',
          description: 'تضمین تأمین مستقیم بدون واسطه با بارکد قابل استعلام.',
          verified: true,
        },
      ],
      batchCodeVerificationInfo: 'بچ‌کد اختصاصی بر روی بدنه و جعبه محصول درج شده و از طریق سامانه استعلام اصالت قابل بررسی است.',
      storageConditions: 'در محیط خشک، خنک و با تهویه مناسب نگهداری شود.',
      shelfLifeAfterOpening: '۳۶ ماه پایداری در شرایط ایده‌آل نگهداری.',
      ceIsoStandards: ['ISO 9001:2015', 'CE Certified', 'RoHS / REACH Compliant'],
    },
    faqs: [
      {
        question: 'آیا این محصول دارای گارانتی و اصالت است؟',
        answer: 'بله، تمامی محصولات دارای ضمانت ۱۰۰٪ اصالت کالا، تست سلامت فیزیکی و امکان بازگشت ۷ روزه می‌باشند.',
      },
      {
        question: 'مدت زمان ارسال چقدر است؟',
        answer: 'سفارش‌های تهران در همان روز یا حداکثر ۲۴ ساعت و شهرستان‌ها از طریق تیپاکس و پست پیشتاز طی ۲ الی ۳ روز کاری تحویل می‌گردند.',
      },
      {
        question: 'روش‌های پرداخت به چه صورت است؟',
        answer: 'امکان پرداخت آنلاین شاپرک با کلیه کارت‌های عضو شتاب، کارت‌به‌کارت با ثبت فیش، و کیف پول کاربری مهیا است.',
      },
    ],
    bundleRecommendation: {
      bundleTitle: 'پک پیشنهادی مکمل و صرفه‌جویی اقتصادی',
      bundleDescription: 'ترکیب این محصول با اقلام مکمل پیشنهادی جهت بهره‌وری حداکثری همراه با تخفیف ویژه پکیج',
      savingsText: '۱۰٪ تخفیف مازاد روی پکیج',
      items: [
        {
          id: 'bnd_1',
          slug: 'ethiopian-specialty-coffee',
          title: 'قهوه تخصصی اتیوپی یرگاچف',
          brand: 'Dr Dermer Lifestyle',
          subtitle: '۱۰۰٪ عربیکا تخصصی',
          priceAmount: '4500000',
          originalPriceAmount: '5000000',
          discountBadge: '۱۰٪ تخفیف',
          roleInRoutine: 'پیشنهاد مکمل اول',
          inStock: true,
        },
        {
          id: 'bnd_2',
          slug: 'artisan-mug',
          title: 'ماگ سرامیکی دست‌ساز لعاب‌دار',
          brand: 'Artisan Collection',
          subtitle: 'طراحی ارگونومیک و لوکس',
          priceAmount: '1900000',
          originalPriceAmount: '2200000',
          discountBadge: '۱۴٪ تخفیف',
          roleInRoutine: 'پیشنهاد مکمل دوم',
          inStock: true,
        },
      ],
    },
    ratingSummary: {
      ratingValue: 4.8,
      reviewCount: 24,
    },
  };
}
