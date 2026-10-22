import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { OurWorkHero } from '@/components/website/projects/our-work-hero'
import { ProjectsFilter } from '@/components/website/projects/projects-filter'

const SHOWCASE_PROJECTS = [
  // ─── مشروع مستشفى النور في الصدارة دائماً ───
  {
    id: 'web-alnour-hospital',
    name: 'مستشفى النور',
    title: 'المنظومة الرقمية المتكاملة لإدارة مستشفى النور',
    category: 'أنظمة طبية وإدارة مستشفيات',
    filterTag: ['web', 'ui'],
    description:
      'منصة طبية شاملة لإدارة المستشفيات والعيادات التخصصية؛ توفر نظام حجز إلكتروني سريع لتقليل فترات انتظار المرضى، إدارة مركزية للسجلات الصحية الإلكترونية بنظام صلاحيات متعدد (Role-Based Auth)، تنظيم جداول الأطباء والعمليات، وإصدار الفواتير والتقارير الطبية.',
    technologies: ['PHP', 'MySQL', 'JavaScript', 'HTML/CSS', 'RBAC'],
    cover:
      'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#311042',
    themeTo: '#4f46e5',
  },
  // ─── أنظمة ويب ومواقع (Web Apps & SaaS) ───
  {
    id: 'web-ostaz-lms',
    name: 'منصة الأستاذ',
    title: 'منصة الأستاذ التعليمية',
    category: 'منصات ويب وتعليم إلكتروني',
    filterTag: ['web'],
    description:
      'نظام إدارة تعلم (LMS) متكامل للسناتر والمدرسين؛ يقوم بحماية الفيديوهات من التحميل وتسجيل الشاشة (DRM)، ويوفر محركاً لإنشاء اختبارات تفاعلية بتصحيح آلي، بالإضافة إلى لوحة تتبع لمراقبة حضور الطلاب وتسليم الواجبات.',
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'AWS S3'],
    cover:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#0f172a',
    themeTo: '#2563eb',
  },
  {
    id: 'web-electrolite',
    name: 'متجر إلكترولايت',
    title: 'متجر إلكترولايت للأجهزة',
    category: 'متاجر إلكترونية وحلول دفع',
    filterTag: ['web'],
    description:
      'منصة تجارة إلكترونية ضخمة للأجهزة المنزلية؛ تتميز بمحرك بحث وفلاتر متقدمة تعتمد على المواصفات التقنية (الفولت، السعة، الماركة)، مع حاسبة ذكية لخطط التقسيط البنكية، وربط مباشر مع واجهات برمجة (APIs) لشركات الشحن لتتبع الطلبات.',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'Redis'],
    cover:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#1e1b4b',
    themeTo: '#4f46e5',
  },
  {
    id: 'web-pulse-gym',
    name: 'سيستم بالس جيم',
    title: 'سيستم بالس لإدارة الأندية',
    category: 'أنظمة إدارة الصالات الرياضية',
    filterTag: ['web'],
    description:
      'برنامج لإدارة العمليات اليومية في الصالات الرياضية؛ ينظم اشتراكات الأعضاء ويصدر تنبيهات قرب الانتهاء، يدير جداول الكباتن وحجز الحصص (Classes)، ويتكامل مع أجهزة البصمة والباركود للتحكم في بوابات الدخول، مع إصدار تقارير أرباح الوردية.',
    technologies: ['React', 'Express', 'Prisma', 'MySQL'],
    cover:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#111827',
    themeTo: '#059669',
  },
  {
    id: 'web-aqartech',
    name: 'منصة عقار تك',
    title: 'عقار تك للاستثمار',
    category: 'منصات ويب واستثمار عقاري',
    filterTag: ['web'],
    description:
      'نظام (PropTech) مخصص للمطورين العقاريين؛ يتيح استعراض الوحدات السكنية عبر خرائط تفاعلية، ويحتوي على نظام مالي يحسب جداول الأقساط والدفعات المستحقة، مع أرشفة سحابية آمنة للعقود القانونية ومتابعة تحصيلات العملاء.',
    technologies: ['Vue.js', 'Laravel', 'PostgreSQL', 'TailwindCSS'],
    cover:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#0c1b33',
    themeTo: '#0284c7',
  },
  {
    id: 'web-foodmaster',
    name: 'سحابة فود ماستر',
    title: 'فود ماستر (نظام مطاعم)',
    category: 'أنظمة إدارة المطاعم (POS)',
    filterTag: ['web', 'ui'],
    description:
      'نظام كاشير (Cloud POS) متكامل لإدارة المطاعم؛ يستقبل الطلبات من صالة الطعام عبر مسح QR Code، ويقوم بتوجيه الطلب فوراً لشاشات المطبخ (KDS)، مع ربط كل وجبة بمكوناتها لخصمها آلياً من المخزن وتنبيه الإدارة عند نقص المواد الخام.',
    technologies: ['React', 'NestJS', 'Socket.io', 'MongoDB'],
    cover:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#1c1917',
    themeTo: '#ea580c',
  },
  {
    id: 'web-enjaz-erp',
    name: 'نظام إنجاز للشركات',
    title: 'إنجاز (ERP System)',
    category: 'أنظمة تخطيط الموارد (ERP)',
    filterTag: ['web', 'ui'],
    description:
      'نظام لتخطيط موارد المؤسسات (ERP) يربط إدارات الشركة؛ يضم دورة مشتريات تبدأ من طلب التسعير وحتى فاتورة المورد، ونظام مبيعات متصل بالمخازن، بالإضافة لمركز تقارير يجمع البيانات في رسوم بيانية تفاعلية لقياس الأداء العام.',
    technologies: ['Angular', 'Spring Boot', 'PostgreSQL', 'Docker'],
    cover:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#0f172a',
    themeTo: '#0369a1',
  },
  {
    id: 'web-khebra-hr',
    name: 'منصة خبرة للتوظيف',
    title: 'خبرة لشؤون العاملين (HR)',
    category: 'أنظمة شؤون العاملين والتوظيف',
    filterTag: ['web'],
    description:
      'بوابة إلكترونية لإدارة الموارد البشرية؛ تقوم بفلترة السير الذاتية آلياً للمتقدمين، إدارة ملفات الموظفين وسجلات الحضور والغياب، الأتمتة الكاملة لطلبات الإجازات، وحساب الرواتب والمكافآت والخصومات شهرياً.',
    technologies: ['Next.js', 'Python', 'Django', 'MySQL'],
    cover:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#172554',
    themeTo: '#3b82f6',
  },
  {
    id: 'web-amwal',
    name: 'نظام أموال المحاسبي',
    title: 'أموال للمحاسبة المالية',
    category: 'أنظمة مالية ومحاسبية',
    filterTag: ['web'],
    description:
      'برنامج محاسبة سحابي معتمد للشركات؛ يقدم شجرة حسابات مرنة، إنشاء وتتبع قيود اليومية، إدارة مراكز التكلفة للمشاريع، وإصدار فواتير ضريبية إلكترونية متوافقة مع متطلبات هيئة الزكاة والضرائب مع توليد كود QR.',
    technologies: ['React', 'Node.js', 'Express', 'Redis'],
    cover:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#064e3b',
    themeTo: '#10b981',
  },
  {
    id: 'web-masar-edu',
    name: 'منصة مسار المدرسية',
    title: 'مسار لإدارة المدارس',
    category: 'أنظمة الإدارة المدرسية',
    filterTag: ['web'],
    description:
      'سيستم إداري متكامل للمدارس الأهلية والدولية؛ يمتلك بوابات منفصلة للإدارة، المعلم، الطالب، وولي الأمر. يتيح توليد الجداول الدراسية، رصد الغياب، إدارة رسوم الحافلات المدرسية، وتصدير شهادات الدرجات الرقمية.',
    technologies: ['Vue.js', 'PHP', 'Laravel', 'MySQL'],
    cover:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#4a044e',
    themeTo: '#d946ef',
  },
  {
    id: 'web-style-store',
    name: 'متجر ستايل للأزياء',
    title: 'متجر ستايل فاشون',
    category: 'متاجر أزياء إلكترونية',
    filterTag: ['web'],
    description:
      'متجر متخصص في بيع الأزياء؛ يتميز بنظام إدارة متغيرات المنتج (الألوان والمقاسات)، محرك كوبونات خصم وعروض فلاش (Flash Sales)، ونظام تتبع السلات المتروكة (Abandoned Cart) لإعادة استهداف العملاء.',
    technologies: ['Next.js', 'Shopify API', 'TailwindCSS'],
    cover:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#3f2a14',
    themeTo: '#d97706',
  },
  {
    id: 'web-fleet-rentals',
    name: 'نظام أسطول',
    title: 'أسطول لتأجير السيارات',
    category: 'أنظمة إدارة السيارات والتأجير',
    filterTag: ['web'],
    description:
      'لوحة تحكم مصممة لشركات تأجير السيارات؛ تراقب حالة الأسطول (متاح، مؤجر، صيانة)، تقوم بتوليد عقود الإيجار إلكترونياً، وتُرسل تنبيهات آلية بمواعيد الفحص الدوري وتجديد التأمين لكل مركبة.',
    technologies: ['React', 'NestJS', 'PostgreSQL'],
    cover:
      'https://images.unsplash.com/photo-1562426509-5044a121aa49?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#0f172a',
    themeTo: '#ef4444',
  },
  {
    id: 'web-eyadati',
    name: 'منصة عيادتي',
    title: 'عيادتي لإدارة العيادات',
    category: 'أنظمة إدارة العيادات الطبية',
    filterTag: ['web'],
    description:
      'سيستم سحابي صُمم خصيصاً للعيادات الفردية والمجمعات الطبية؛ ينظم حجوزات المرضى عبر الإنترنت، يتيح للطبيب كتابة الروشتات وطباعتها، ويحفظ التاريخ المرضي (Medical History) بشكل آمن وسهل الاسترجاع.',
    technologies: ['Next.js', 'Node.js', 'MongoDB'],
    cover:
      'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#083344',
    themeTo: '#06b6d4',
  },
  {
    id: 'web-smart-inventory',
    name: 'نظام مخازن ذكي',
    title: 'نظام الجرد والمخازن',
    category: 'أنظمة إدارة المخازن والجرد',
    filterTag: ['web'],
    description:
      'نظام دقيق للتحكم في المخزون المتعدد الفروع؛ يدعم قراءة الباركود و QR Code للجرد السريع، تتبع حركة الصنف بين المخازن، وإصدار أوامر شراء آلية (Automated POs) عند وصول المنتج لحد النواقص.',
    technologies: ['React', 'Spring Boot', 'PostgreSQL'],
    cover:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#1e3a8a',
    themeTo: '#3b82f6',
  },
  {
    id: 'web-mostashar',
    name: 'منصة مستشار',
    title: 'مستشار للمكاتب القانونية',
    category: 'أنظمة إدارة المكاتب القانونية',
    filterTag: ['web'],
    description:
      'لوحة تحكم إدارية للمحامين والمستشارين؛ تنظم ملفات القضايا، تؤرشف مستندات الموكلين في خوادم آمنة، تربط مواعيد الجلسات بالتقويم مع إرسال إشعارات SMS، وتتولى فوترة أتعاب المحاماة وخطط الدفع.',
    technologies: ['Vue.js', 'Django', 'MySQL', 'Redis'],
    cover:
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#312e81',
    themeTo: '#6366f1',
  },

  // ════════ تطبيقات الموبايل (Mobile Apps) ════════

  {
    id: 'mob-captainfit',
    name: 'تطبيق كابتن فيت',
    title: 'كابتن فيت للتدريب',
    category: 'تطبيقات الجوال واللياقة',
    filterTag: ['mobile'],
    description:
      'تطبيق موبايل تفاعلي لمتابعة التمارين؛ يعرض خطط التدريب بفيديوهات عالية الجودة، يوفر عداداً لفترات الراحة بين الجولات، ويتيح تسجيل الأوزان والتكرارات لإنشاء رسوم بيانية توضح تطور الأداء البدني.',
    technologies: ['Flutter', 'Firebase', 'Node.js'],
    cover:
      'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#18181b',
    themeTo: '#dc2626',
  },
  {
    id: 'mob-madar',
    name: 'تطبيق مدار للوجستيات',
    title: 'مدار للشحن والتوصيل',
    category: 'تطبيقات الشحن والتوصيل',
    filterTag: ['mobile'],
    description:
      'تطبيق مخصص لشركات التوصيل؛ يعرض للعميل مسار المندوب لحظياً على خريطة (Live GPS)، يحسب الوقت التقريبي للوصول (ETA)، ويؤمن تسليم الشحنة عبر طلب إدخال رمز تحقق مؤقت (OTP) من المستلم.',
    technologies: ['React Native', 'Google Maps API', 'Socket.io'],
    cover:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#09090b',
    themeTo: '#0284c7',
  },
  {
    id: 'mob-sanaa',
    name: 'تطبيق صنعة',
    title: 'صنعة للصيانة المنزلية',
    category: 'تطبيقات الخدمات والصيانة',
    filterTag: ['mobile'],
    description:
      'تطبيق لطلب فنيي الصيانة (سباكة، كهرباء، تكييف)؛ يطابق طلب العميل مع أقرب فني متاح جغرافياً، يعرض قائمة أسعار الخدمات مسبقاً لمنع التلاعب، ويسمح بالدفع الإلكتروني وتقييم الفني بعد انتهاء العمل.',
    technologies: ['Flutter', 'Dart', 'Supabase', 'NestJS'],
    cover:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#1c1917',
    themeTo: '#d97706',
  },
  {
    id: 'mob-nabdh',
    name: 'تطبيق نبض كير',
    title: 'نبض كير للرعاية الطبية',
    category: 'تطبيقات الرعاية الصحية',
    filterTag: ['mobile'],
    description:
      'تطبيق يقدم خدمات التطبيب عن بعد (Telehealth)؛ يتيح إجراء استشارات فيديو آمنة مع الأطباء، يحتوي على منبه ذكي لمواعيد تناول الأدوية، ويوفر مساحة مشفرة لحفظ والاطلاع على نتائج التحاليل والأشعة.',
    technologies: ['React Native', 'WebRTC', 'Firebase'],
    cover:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#0f172a',
    themeTo: '#06b6d4',
  },
  {
    id: 'mob-maqadi',
    name: 'تطبيق مقاضي',
    title: 'مقاضي للسوبرماركت',
    category: 'تطبيقات توصيل الطلبات',
    filterTag: ['mobile'],
    description:
      'تطبيق لتسوق البقالة والاحتياجات اليومية؛ تصميم يسهل تصفح آلاف المنتجات، نظام ولاء ونقاط استرجاع نقدي (Cashback)، وخوارزمية ذكية تقترح منتجات بديلة في حال نفاذ الكمية المطلوبة.',
    technologies: ['Flutter', 'Node.js', 'PostgreSQL'],
    cover:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#14532d',
    themeTo: '#22c55e',
  },
  {
    id: 'mob-meshwari',
    name: 'تطبيق مشواري',
    title: 'مشواري (Ride-sharing)',
    category: 'تطبيقات حجز السيارات',
    filterTag: ['mobile', 'ui'],
    description:
      'تطبيق على غرار أوبر لطلب السيارات الخاصة؛ يمتلك خوارزمية تسعير ديناميكي تتأثر بالزحام والمسافة، شات داخلي بين السائق والراكب، زر طوارئ (SOS)، ومحفظة مالية لسداد الأجرة.',
    technologies: ['React Native', 'Google Maps API', 'Redis'],
    cover:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#1e3a8a',
    themeTo: '#3b82f6',
  },
  {
    id: 'mob-aqarapp',
    name: 'تطبيق عقاري',
    title: 'تطبيق عقاري للاستثمار',
    category: 'تطبيقات الاستثمار العقاري',
    filterTag: ['mobile'],
    description:
      'تطبيق بحث عقاري يعتمد على الخرائط؛ يمكن المستخدم من رسم دائرة على الخريطة لعرض العقارات المتاحة داخلها، مع جولات افتراضية للوحدات السكنية، وتواصل مباشر (WhatsApp/Call) مع الوسيط.',
    technologies: ['Flutter', 'Dart', 'Firebase'],
    cover:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#3f2a14',
    themeTo: '#d97706',
  },
  {
    id: 'mob-salon',
    name: 'تطبيق حجز صالونات',
    title: 'أناقة لحجز الصالونات',
    category: 'تطبيقات الحجوزات',
    filterTag: ['mobile'],
    description:
      'تطبيق حجز المواعيد في صالونات ومراكز التجميل؛ يعرض قائمة الخدمات وأسعارها، يربط الحجز بالجدول الزمني المتاح لكل موظف، ويتطلب دفع عربون إلكتروني لتقليل حالات التخلف عن الموعد.',
    technologies: ['React Native', 'Node.js', 'MongoDB'],
    cover:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#4c1d95',
    themeTo: '#a855f7',
  },
  {
    id: 'mob-fooddrop',
    name: 'تطبيق فود دروب',
    title: 'فود دروب لتوصيل الطعام',
    category: 'تطبيقات توصيل المطاعم',
    filterTag: ['mobile'],
    description:
      'تطبيق لطلب الوجبات السريعة؛ قوائم طعام جذابة وواضحة، تتبع مسار الدليفري على الخريطة، إمكانية وضع تقييم مفصل للوجبة، وميزة التوصيل بدون تلامس.',
    technologies: ['Flutter', 'NestJS', 'PostgreSQL'],
    cover:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#7f1d1d',
    themeTo: '#ef4444',
  },
  {
    id: 'mob-mywallet',
    name: 'تطبيق محفظتي',
    title: 'محفظتي (Digital Wallet)',
    category: 'تطبيقات التكنولوجيا المالية',
    filterTag: ['mobile', 'ui'],
    description:
      'تطبيق محفظة مالية رقمية (Fintech)؛ يدعم تحويل الأموال للأصدقاء، دفع الفواتير عبر مسح الباركود، إصدار بطاقات خصم افتراضية للاستخدام أونلاين، ومصادقة الدخول ببصمة الوجه لأقصى درجات الأمان.',
    technologies: ['React Native', 'TypeScript', 'Node.js', 'AWS'],
    cover:
      'https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?auto=format&fit=crop&fm=webp&w=480&q=70',
    themeFrom: '#172554',
    themeTo: '#2563eb',
  },
]

async function fetchRealProjects(locale: Locale) {
  const isEn = locale === 'en'
  const formattedShowcaseProjects = SHOWCASE_PROJECTS.map((sp: any) => {
    return {
      ...sp,
      image: sp.cover,
      title: isEn ? sp.nameEn || sp.title || sp.name : sp.name,
      description: isEn ? sp.descriptionEn || sp.description : sp.description,
      tags: [...sp.filterTag, ...sp.technologies],
      isShowcase: true,
    }
  })

  return formattedShowcaseProjects
}

export async function generateMetadata(props: PageProps<'/[lang]/our-work'>): Promise<Metadata> {
  const { lang } = await props.params
  if (!isValidLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return { title: dict.seo.ourWork.title, description: dict.seo.ourWork.description }
}

export default async function OurWorkPage(props: PageProps<'/[lang]/our-work'>) {
  const { lang } = await props.params
  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const projects = await fetchRealProjects(locale)

  return (
    <>
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      {projects.slice(0, 4).map((p) => (
        <link
          key={p.id}
          rel="preload"
          as="image"
          href={p.cover}
          fetchPriority="high"
        />
      ))}

      {/* تحسين عرض صفحة أعمالنا على الهاتف: كارت واحد عريض وواضح في كل صف بدلاً من انضغاط كارتين في شاشة ضيقة */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 639px) {
              .codexa-our-work-section .grid {
                grid-template-columns: minmax(0, 1fr) !important;
                gap: 1.25rem !important;
              }
              .codexa-our-work-section button {
                padding-left: 0.75rem !important;
                padding-right: 0.75rem !important;
                font-size: 0.75rem !important;
              }
            }
          `,
        }}
      />

      <OurWorkHero
        title={dict.ourWork.heroTitle ?? 'اكتشف ما أنجزناه'}
        subtitle={dict.ourWork.heroSubtitle}
        scrollHint={dict.ourWork.heroScrollHint}
        projects={projects}
      />
      <Section
        noContainer
        className="codexa-our-work-section bg-[var(--figma-surface-lavender)] py-10 sm:py-16 md:py-24 dark:bg-[#0d0b1f]"
      >
        <Container>
          <ProjectsFilter projects={projects} locale={locale} dict={dict.ourWork} />
        </Container>
      </Section>
    </>
  )
}