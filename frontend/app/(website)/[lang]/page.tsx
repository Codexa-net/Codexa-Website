import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { type Project } from '@/types/project'
import { HeroSection } from '@/components/website/home/hero-section'
import { MarqueeBanner } from '@/components/website/home/marquee-banner'
import { ProjectShowcase } from '@/components/website/projects/project-showcase'
import { ServicesSection } from '@/components/website/home/services-section'
import { WhyChooseUsSection } from '@/components/website/home/why-choose-us-section'

const REAL_HOME_PROJECTS: Project[] = [
  {
    id: 'web-alnour-hospital',
    slug: 'alnour-hospital',
    watermark: 'Al-Nour Hospital',
    title: { ar: 'مستشفى النور', en: 'Al-Nour Hospital' },
    category: { ar: 'أنظمة طبية وإدارة مستشفيات', en: 'Healthcare ERP System' },
    description: {
      ar: 'منصة طبية شاملة لإدارة المستشفيات والعيادات التخصصية؛ توفر نظام حجز إلكتروني سريع لتقليل فترات انتظار المرضى، إدارة مركزية للسجلات الصحية الإلكترونية بنظام صلاحيات متعدد، وتنظيم جداول الأطباء والعمليات.',
      en: 'A comprehensive medical platform for managing hospitals and specialized clinics; featuring fast online booking, centralized electronic health records with role-based access, and doctor scheduling.',
    },
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&fm=webp&w=480&q=70',
    year: '2026',
    services: { ar: 'PHP · MySQL · JavaScript · Role-Based Auth', en: 'PHP · MySQL · JavaScript · Role-Based Auth' },
    pills: [
      { ar: '24 شاشة', en: '24 Screens' },
      { ar: 'نظام صلاحيات', en: 'RBAC System' },
      { ar: '6 أسابيع', en: '6 Weeks' },
    ],
    themeClass: 'from-[#311042] via-[#4b27c7] to-[#4f46e5]',
    glowColor: '#5745e7',
    featured: true,
  },
  {
    id: 'web-ostaz-lms',
    slug: 'ostaz-lms',
    watermark: 'Al-Ostaz LMS',
    title: { ar: 'منصة الأستاذ', en: 'Al-Ostaz LMS' },
    category: { ar: 'منصات ويب وتعليم إلكتروني', en: 'EdTech & LMS Platform' },
    description: {
      ar: 'نظام إدارة تعلم (LMS) متكامل للسناتر والمدرسين؛ يقوم بحماية الفيديوهات من التحميل وتسجيل الشاشة (DRM)، ويوفر محركاً لإنشاء اختبارات تفاعلية بتصحيح آلي، بالإضافة إلى لوحة تتبع لمراقبة حضور الطلاب وتسليم الواجبات.',
      en: 'An integrated Learning Management System (LMS) featuring DRM video protection, automated interactive quizzes, and real-time student attendance and assignment tracking.',
    },
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&fm=webp&w=480&q=70',
    year: '2026',
    services: { ar: 'Next.js · NestJS · PostgreSQL · AWS S3', en: 'Next.js · NestJS · PostgreSQL · AWS S3' },
    pills: [
      { ar: '18 شاشة', en: '18 Screens' },
      { ar: 'حماية DRM', en: 'DRM Protection' },
      { ar: '6 أسابيع', en: '6 Weeks' },
    ],
    themeClass: 'from-[#0f172a] via-[#1e3a8a] to-[#2563eb]',
    glowColor: '#2563eb',
    featured: true,
  },
  {
    id: 'web-electrolite',
    slug: 'electrolite-store',
    watermark: 'Electrolite',
    title: { ar: 'متجر إلكترولايت', en: 'Electrolite Store' },
    category: { ar: 'متاجر إلكترونية وحلول دفع', en: 'E-Commerce & FinTech' },
    description: {
      ar: 'منصة تجارة إلكترونية ضخمة للأجهزة المنزلية؛ تتميز بمحرك بحث وفلاتر متقدمة تعتمد على المواصفات التقنية (الفولت، السعة، الماركة)، مع حاسبة ذكية لخطط التقسيط البنكية، وربط مباشر مع شركات الشحن لتتبع الطلبات.',
      en: 'A large-scale home appliances e-commerce platform with advanced technical filters, smart bank installment calculators, and direct shipping API integrations.',
    },
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&fm=webp&w=480&q=70',
    year: '2026',
    services: { ar: 'Next.js · TypeScript · Node.js · Redis', en: 'Next.js · TypeScript · Node.js · Redis' },
    pills: [
      { ar: '22 شاشة', en: '22 Screens' },
      { ar: 'بوابات دفع', en: 'Payment Gateways' },
      { ar: '5 أسابيع', en: '5 Weeks' },
    ],
    themeClass: 'from-[#1e1b4b] via-[#3730a3] to-[#4f46e5]',
    glowColor: '#4f46e5',
    featured: true,
  },
  {
    id: 'web-pulse-gym',
    slug: 'pulse-gym',
    watermark: 'Pulse Gym',
    title: { ar: 'سيستم بالس جيم', en: 'Pulse Gym System' },
    category: { ar: 'أنظمة إدارة الصالات الرياضية', en: 'Gym Management ERP' },
    description: {
      ar: 'برنامج لإدارة العمليات اليومية في الصالات الرياضية؛ ينظم اشتراكات الأعضاء ويصدر تنبيهات قرب الانتهاء، يدير جداول الكباتن وحجز الحصص (Classes)، ويتكامل مع أجهزة البصمة والباركود للتحكم في بوابات الدخول.',
      en: 'A complete gym operations system managing member subscriptions, trainer schedules, class bookings, and biometric/barcode gate access control.',
    },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&fm=webp&w=480&q=70',
    year: '2026',
    services: { ar: 'React · Express · Prisma · MySQL', en: 'React · Express · Prisma · MySQL' },
    pills: [
      { ar: '16 شاشة', en: '16 Screens' },
      { ar: 'ربط البصمة', en: 'Biometric Sync' },
      { ar: '4 أسابيع', en: '4 Weeks' },
    ],
    themeClass: 'from-[#064e3b] via-[#047857] to-[#10b981]',
    glowColor: '#059669',
    featured: true,
  },
  {
    id: 'web-aqartech',
    slug: 'aqartech',
    watermark: 'AqarTech',
    title: { ar: 'منصة عقار تك', en: 'AqarTech Platform' },
    category: { ar: 'منصات ويب واستثمار عقاري', en: 'PropTech & Real Estate' },
    description: {
      ar: 'نظام (PropTech) مخصص للمطورين العقاريين؛ يتيح استعراض الوحدات السكنية عبر خرائط تفاعلية، ويحتوي على نظام مالي يحسب جداول الأقساط والدفعات المستحقة، مع أرشفة سحابية آمنة للعقود القانونية ومتابعة التحصيلات.',
      en: 'A PropTech platform for real estate developers featuring interactive unit maps, automated installment calculators, and cloud contract archiving.',
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&fm=webp&w=480&q=70',
    year: '2026',
    services: { ar: 'Vue.js · Laravel · PostgreSQL · TailwindCSS', en: 'Vue.js · Laravel · PostgreSQL · TailwindCSS' },
    pills: [
      { ar: '20 شاشة', en: '20 Screens' },
      { ar: 'خرائط تفاعلية', en: 'Interactive Maps' },
      { ar: '6 أسابيع', en: '6 Weeks' },
    ],
    themeClass: 'from-[#0c1b33] via-[#0369a1] to-[#0284c7]',
    glowColor: '#0284c7',
    featured: true,
  },
  {
    id: 'web-foodmaster',
    slug: 'foodmaster-pos',
    watermark: 'FoodMaster',
    title: { ar: 'سحابة فود ماستر', en: 'FoodMaster Cloud POS' },
    category: { ar: 'أنظمة إدارة المطاعم (POS)', en: 'Cloud Restaurant POS' },
    description: {
      ar: 'نظام كاشير (Cloud POS) متكامل لإدارة المطاعم؛ يستقبل الطلبات من صالة الطعام عبر مسح QR Code، ويقوم بتوجيه الطلب فوراً لشاشات المطبخ (KDS)، مع ربط كل وجبة بمكوناتها لخصمها آلياً من المخزن.',
      en: 'An all-in-one Cloud POS for restaurants with QR table ordering, instant Kitchen Display System (KDS) routing, and automated recipe inventory deduction.',
    },
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&fm=webp&w=480&q=70',
    year: '2026',
    services: { ar: 'React · NestJS · Socket.io · MongoDB', en: 'React · NestJS · Socket.io · MongoDB' },
    pills: [
      { ar: '15 شاشة', en: '15 Screens' },
      { ar: 'شاشات مطبخ KDS', en: 'KDS Screens' },
      { ar: '5 أسابيع', en: '5 Weeks' },
    ],
    themeClass: 'from-[#1c1917] via-[#9a3412] to-[#ea580c]',
    glowColor: '#ea580c',
    featured: true,
  },
  {
    id: 'mob-captainfit',
    slug: 'captainfit-app',
    watermark: 'CaptainFit',
    title: { ar: 'تطبيق كابتن فيت', en: 'CaptainFit Mobile App' },
    category: { ar: 'تطبيقات الجوال واللياقة', en: 'Mobile Fitness App' },
    description: {
      ar: 'تطبيق موبايل تفاعلي لمتابعة التمارين؛ يعرض خطط التدريب بفيديوهات عالية الجودة، يوفر عداداً لفترات الراحة بين الجولات، ويتيح تسجيل الأوزان والتكرارات لإنشاء رسوم بيانية توضح تطور الأداء البدني.',
      en: 'An interactive fitness mobile app offering HD workout plans, rest timers, weight/rep logging, and visual performance progress charts.',
    },
    image: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&fm=webp&w=480&q=70',
    year: '2026',
    services: { ar: 'Flutter · Firebase · Node.js · UI/UX', en: 'Flutter · Firebase · Node.js · UI/UX' },
    pills: [
      { ar: '14 شاشة', en: '14 Screens' },
      { ar: 'تطبيق iOS & Android', en: 'iOS & Android' },
      { ar: '4 أسابيع', en: '4 Weeks' },
    ],
    themeClass: 'from-[#18181b] via-[#991b1b] to-[#dc2626]',
    glowColor: '#dc2626',
    featured: true,
  },
]

async function getHomeShowcaseProjects(): Promise<Project[]> {
  return REAL_HOME_PROJECTS.slice(0, 7)
}

export async function generateMetadata(
  props: PageProps<'/[lang]'>,
): Promise<Metadata> {
  const { lang } = await props.params
  if (!isValidLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return {
    title: dict.seo.home.title,
    description: dict.seo.home.description,
  }
}

export default async function HomePage(props: PageProps<'/[lang]'>) {
  const { lang } = await props.params
  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const projects = await getHomeShowcaseProjects()

  return (
    <>
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      {projects.slice(0, 4).map((p) => (
        <link key={p.id} rel="preload" as="image" href={p.image} fetchPriority="high" />
      ))}

      <HeroSection locale={locale} dict={dict} />

      <div className="relative z-20">
        <MarqueeBanner locale={locale} />
      </div>

      <div className="codexa-home-showcase relative z-10">
        <ProjectShowcase projects={projects} locale={locale} />
      </div>

      <ServicesSection dict={dict} />
      <WhyChooseUsSection dict={dict} />
    </>
  )
}