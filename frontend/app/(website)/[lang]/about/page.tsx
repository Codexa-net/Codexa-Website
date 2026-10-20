import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import founderImage from "@/public/images/founder.jpg"

import {
  ArrowUpLeft,
  ArrowUpRight,
  Code2,
  Palette,
  Users,
  ShieldCheck,
  Smartphone,
  Globe,
  BrainCircuit,
  Boxes,
} from "lucide-react"

import { FadeIn } from "@/components/shared/motion/fade-in"
import { Reveal } from "@/components/shared/motion/reveal"
import {
  Stagger,
  StaggerItem,
} from "@/components/shared/motion/stagger"

import { ValuesGrid } from "@/components/website/about/values-grid"

import {
  isValidLocale,
  type Locale,
} from "@/lib/i18n/config"

import { getDictionary } from "@/lib/i18n/dictionaries"

type PageProps = {
  params: Promise<{
    lang: string
  }>
}

/* =========================================================
   ICONS
========================================================= */

const iconMap = {
  globe: Globe,
  smartphone: Smartphone,
  palette: Palette,
  boxes: Boxes,
  brain: BrainCircuit,
  users: Users,
  code: Code2,
  shield: ShieldCheck,
} as const

type IconName = keyof typeof iconMap

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const { lang } = await props.params

  if (!isValidLocale(lang)) {
    return {}
  }

  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return {
    title: dict.seo.about.title,
    description: dict.seo.about.description,
  }
}

/* =========================================================
   HERO PROJECT VISUAL (REAL PROJECTS COLLAGE)
========================================================= */

interface ShowcaseItem {
  title: string
  subtitle: string
  badge: string
  image: string
}

function ProjectVisual({
  locale,
  isArabic,
  mainProject,
  secondProject,
  thirdProject,
}: {
  locale: Locale
  isArabic: boolean
  mainProject: ShowcaseItem
  secondProject: ShowcaseItem
  thirdProject: ShowcaseItem
}) {
  return (
    <FadeIn
      direction={isArabic ? "right" : "left"}
      distance={60}
      duration={0.8}
      className="relative mx-auto w-full max-w-[560px] select-none py-2 sm:py-6"
    >
      {/* توهج خلفي ناعم متناسق مع الوضع الفاتح والليلي */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-64 w-64 rounded-full bg-[#5745e7]/15 blur-[80px] sm:h-72 sm:w-72 dark:bg-[#5745e7]/25" />
      </div>

      {/* متجاوب مع شاشة الهاتف عبر scale-[0.82] لعدم خروج الكروت خارج الشاشة مع بقاء تصميم اللابتوب 100% */}
      <div className="relative mx-auto h-[360px] w-full max-w-[480px] origin-center scale-[0.82] sm:h-[460px] sm:scale-100">
        {/* 1. البطاقة الخلفية الكبرى (مستشفى النور) */}
        <Link
          href={`/${locale}/our-work`}
          className="group absolute left-1/2 top-2 z-10 flex h-[310px] w-[265px] -translate-x-1/2 -rotate-[8deg] flex-col overflow-hidden rounded-[26px] border border-white/25 bg-gradient-to-br from-[#6c3ef4] via-[#4b27c7] to-[#18113c] p-5 text-white shadow-[0_28px_65px_-12px_rgba(75,39,199,0.45)] transition-all duration-500 hover:-translate-y-2 hover:-rotate-[5deg] sm:h-[345px] sm:w-[300px]"
        >
          <div className="text-center">
            <span className="inline-block rounded-full bg-white/15 px-3 py-0.5 text-[10px] font-bold tracking-wide text-white/90 backdrop-blur-sm">
              {mainProject.badge}
            </span>
            <h3 className="mt-1.5 text-xl font-black tracking-tight text-white sm:text-2xl">
              {mainProject.title}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-white/75">
              {mainProject.subtitle}
            </p>
          </div>

          {/* نافذة النظام */}
          <div className="mt-4 flex flex-1 flex-col overflow-hidden rounded-t-xl border border-b-0 border-white/20 bg-[#0d0b1f] shadow-2xl">
            <div className="flex h-5 shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/5 px-3">
              <span className="size-1.5 rounded-full bg-rose-400/80" />
              <span className="size-1.5 rounded-full bg-amber-400/80" />
              <span className="size-1.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="relative size-full overflow-hidden">
              <img
                src={mainProject.image}
                alt={mainProject.title}
                loading="eager"
                className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </Link>

        {/* 2. البطاقة اليسرى السفلية (منصة الأستاذ التعليمية) */}
        <Link
          href={`/${locale}/our-work`}
          className="group absolute bottom-2 left-2 z-20 flex h-[235px] w-[205px] -rotate-[9deg] flex-col overflow-hidden rounded-[24px] border border-white/30 bg-gradient-to-br from-[#10b981] via-[#059669] to-[#064e3b] p-4 text-white shadow-[0_22px_50px_-12px_rgba(16,185,129,0.4)] transition-all duration-500 hover:-translate-y-2 hover:-rotate-[5deg] sm:left-4 sm:h-[260px] sm:w-[225px]"
        >
          <div className="flex items-center justify-between">
            <span className="size-2 rounded-full bg-emerald-200" />
            <span className="text-[10px] font-bold text-emerald-100">
              {secondProject.badge}
            </span>
          </div>
          <h4 className="mt-1 text-base font-black text-white sm:text-lg">
            {secondProject.title}
          </h4>

          {/* شاشة التطبيق */}
          <div className="mt-3 flex flex-1 flex-col overflow-hidden rounded-2xl border-2 border-neutral-900/80 bg-neutral-900 shadow-inner">
            <div className="mx-auto my-1 h-1 w-8 rounded-full bg-white/20" />
            <div className="relative size-full overflow-hidden rounded-t-lg">
              <img
                src={secondProject.image}
                alt={secondProject.title}
                loading="eager"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </Link>

        {/* 3. البطاقة اليمنى الأمامية (متجر إلكترولايت) */}
        <Link
          href={`/${locale}/our-work`}
          className="group absolute bottom-6 right-2 z-30 flex h-[200px] w-[195px] rotate-[6deg] flex-col justify-between overflow-hidden rounded-[24px] border border-white/20 bg-neutral-950 p-4 text-white shadow-[0_25px_55px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2 hover:rotate-[2deg] sm:right-4 sm:h-[215px] sm:w-[215px]"
        >
          <img
            src={thirdProject.image}
            alt={thirdProject.title}
            loading="eager"
            className="absolute inset-0 size-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/20" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="rounded-full border border-[#8b7cff]/40 bg-[#5745e7]/80 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
              {thirdProject.badge}
            </span>
            <span className="flex size-6 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
              {isArabic ? (
                <ArrowUpLeft className="size-3.5" />
              ) : (
                <ArrowUpRight className="size-3.5" />
              )}
            </span>
          </div>

          <div className="relative z-10 text-right" dir={isArabic ? "rtl" : "ltr"}>
            <p className="text-[11px] font-semibold text-[#a59dfa]">
              {thirdProject.subtitle}
            </p>
            <h4 className="mt-0.5 text-lg font-black leading-snug text-white sm:text-xl">
              {thirdProject.title}
            </h4>
          </div>
        </Link>
      </div>
    </FadeIn>
  )
}

/* =========================================================
   GOAL CARD
========================================================= */

function GoalCard({
  title,
  description,
  reverse = false,
}: {
  title: string
  description: string
  reverse?: boolean
}) {
  return (
    <FadeIn
      direction={reverse ? "up" : "down"}
      distance={40}
      duration={0.7}
      className={reverse ? "lg:mt-28" : ""}
    >
      <div
        className={[
          "relative overflow-hidden rounded-[24px]",
          "border border-[#e3e4ee] dark:border-white/10",
          "bg-[#fafaff] dark:bg-[#19172f]",
          "px-5 py-8 sm:px-8 sm:py-10",
          "shadow-[0_25px_70px_rgba(70,65,150,0.07)]",
          "dark:shadow-[0_25px_70px_rgba(0,0,0,0.25)]",
          "transition-all duration-300",
          "hover:-translate-y-1",
          "hover:shadow-[0_30px_80px_rgba(70,65,150,0.12)]",
          "dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.35)]",
        ].join(" ")}
      >
        {/* Decorative circle */}
        <div
          className={[
            "absolute h-32 w-32 rounded-full",
            "bg-[#ece8ff] dark:bg-[#29244d]",
            reverse
              ? "-bottom-14 -left-14"
              : "-right-14 -top-14",
          ].join(" ")}
        />

        <div className="relative">
          <h3 className="text-center text-2xl font-black text-[#11102f] sm:text-3xl dark:text-white">
            {title}
          </h3>

          <div className="mx-auto mt-4 h-[3px] w-24 rounded-full bg-[#5745e7]" />

          <p className="mx-auto mt-6 max-w-[520px] text-center text-sm leading-[1.9] text-[#687082] sm:mt-8 sm:text-[18px] sm:leading-[2] dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </FadeIn>
  )
}

/* =========================================================
   3D SERVICE ILLUSTRATIONS (مدمجة مباشرة 100% مثل فيجما بدون أخطاء صور)
========================================================= */

function Service3DIllustration({ index }: { index: number }) {
  const type = index % 5

  // 01: تطوير المواقع (Web Development 3D Illustration)
  if (type === 0) {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="web-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#dcd3ff" />
            <stop offset="1" stopColor="#c5b8ff" />
          </linearGradient>
          <linearGradient id="web-top" x1="16" y1="26" x2="96" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b6eff" />
            <stop offset="1" stopColor="#5e43f3" />
          </linearGradient>
          <linearGradient id="web-badge" x1="68" y1="66" x2="106" y2="104" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7b5dfa" />
            <stop offset="1" stopColor="#4f35e8" />
          </linearGradient>
          <linearGradient id="web-mtn" x1="25" y1="50" x2="55" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8367ff" />
            <stop offset="1" stopColor="#b9a9ff" />
          </linearGradient>
          <filter id="web-shadow" x="-15%" y="-15%" width="130%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#4b3fdf" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* الخلفية المائلة */}
        <ellipse cx="60" cy="60" rx="48" ry="34" transform="rotate(-28 60 60)" fill="url(#web-bg)" opacity="0.65" />

        {/* نافذة المتصفح الثلاثية الأبعاد */}
        <g filter="url(#web-shadow)">
          <rect x="16" y="28" width="80" height="60" rx="12" fill="#ffffff" />
          <path d="M16 40C16 33.3726 21.3726 28 28 28H84C90.6274 28 96 33.3726 96 40V42H16V40Z" fill="url(#web-top)" />
          <circle cx="25" cy="35" r="2.5" fill="#ff7eb6" />
          <circle cx="33" cy="35" r="2.5" fill="#ffd166" />
          <circle cx="41" cy="35" r="2.5" fill="#5ce1e6" />

          {/* صورة مصغرة داخل المتصفح */}
          <rect x="24" y="49" width="30" height="29" rx="6" fill="#e9e4ff" />
          <circle cx="46" cy="56" r="3.5" fill="#7054f5" />
          <path d="M25 76L34 62L43 72L48 66L53 76H25Z" fill="url(#web-mtn)" />

          {/* سطور الكود */}
          <rect x="60" y="51" width="28" height="6" rx="3" fill="#6b50f7" />
          <rect x="60" y="61" width="24" height="5" rx="2.5" fill="#c7bcff" />
          <rect x="60" y="70" width="18" height="5" rx="2.5" fill="#c7bcff" />
        </g>

        {/* شارة الكود العائمة </> */}
        <g filter="url(#web-shadow)">
          <rect x="70" y="68" width="34" height="34" rx="10" fill="url(#web-badge)" />
          <path d="M82 81L77 85L82 89" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M92 81L97 85L92 89" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M89 79L85 91" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    )
  }

  // 02: تطوير التطبيقات (Mobile Apps 3D Illustration)
  if (type === 1) {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="mob-body" x1="34" y1="10" x2="86" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7b68ff" />
            <stop offset="1" stopColor="#4636e3" />
          </linearGradient>
          <linearGradient id="mob-code" x1="10" y1="52" x2="42" y2="84" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7c65ff" />
            <stop offset="1" stopColor="#4c35e0" />
          </linearGradient>
          <filter id="mob-shadow" x="-15%" y="-15%" width="130%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#3b4cca" floodOpacity="0.2" />
          </filter>
        </defs>

        <ellipse cx="60" cy="62" rx="46" ry="36" transform="rotate(-15 60 62)" fill="#dce4ff" opacity="0.7" />
        <circle cx="22" cy="34" r="5" fill="#b8c4ff" />
        <circle cx="96" cy="36" r="6" fill="#c5ceff" />

        {/* جسم الموبايل الثلاثي الأبعاد */}
        <g filter="url(#mob-shadow)" transform="rotate(6 60 60)">
          <rect x="35" y="12" width="50" height="94" rx="13" fill="url(#mob-body)" />
          <rect x="39" y="16" width="42" height="86" rx="10" fill="#f6f8ff" />
          <rect x="53" y="18" width="14" height="3" rx="1.5" fill="#7c68ff" opacity="0.5" />

          {/* شريط البحث */}
          <rect x="44" y="25" width="32" height="7" rx="3.5" fill="#ffffff" />
          <circle cx="71" cy="28.5" r="2" stroke="#5a48f5" strokeWidth="1.3" />

          {/* أيقونات التطبيقات الأربعة */}
          <rect x="44" y="36" width="14" height="14" rx="4" fill="#6c56f9" />
          <circle cx="51" cy="43" r="3" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="2 1.5" />

          <rect x="62" y="36" width="14" height="14" rx="4" fill="#d96bff" />
          <path d="M67.5 40.5L71.5 43L67.5 45.5V40.5Z" fill="#ffffff" />

          <rect x="44" y="54" width="14" height="14" rx="4" fill="#3da9fc" />
          <path d="M46 65L50 59L53 63L55 61L56 65H46Z" fill="#ffffff" />

          <rect x="62" y="54" width="14" height="14" rx="4" fill="#ffb830" />
          <circle cx="69" cy="59" r="2.2" fill="#ffffff" />
          <path d="M65.5 65C65.5 63 67 62 69 62C71 62 72.5 63 72.5 65" fill="#ffffff" />

          {/* بطاقة سفلية */}
          <rect x="44" y="72" width="32" height="16" rx="4" fill="#e9edff" />
          <rect x="48" y="76" width="18" height="3" rx="1.5" fill="#a8b4ff" />
          <rect x="48" y="81" width="24" height="3" rx="1.5" fill="#c2cbff" />
        </g>

        {/* شارة الكود اليسرى */}
        <g filter="url(#mob-shadow)">
          <rect x="10" y="52" width="30" height="30" rx="9" fill="url(#mob-code)" />
          <path d="M20 64L16 67L20 70" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29 64L33 67L29 70" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26 62L23 72" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* شارة المتاجر اليمنى (Google Play & Apple) */}
        <g filter="url(#mob-shadow)">
          <rect x="78" y="66" width="32" height="28" rx="8" fill="#ffffff" />
          <path d="M84 74L91 80L84 86V74Z" fill="#00d2ff" />
          <path d="M84 74L88.5 78L91 80L84 74Z" fill="#00f260" />
          <path d="M84 86L88.5 82L91 80L84 86Z" fill="#ff5e62" />
          <circle cx="100" cy="81" r="4.2" fill="#5c49ed" />
          <path d="M100 75.5C101 74.5 102 74.5 102 75.5C102 76.5 101 76.8 100 76.5Z" fill="#5c49ed" />
        </g>
      </svg>
    )
  }

  // 03: تصميم UI/UX (UI/UX Design 3D Illustration)
  if (type === 2) {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible" fill="none">
        <defs>
          <filter id="ux-shadow" x="-15%" y="-15%" width="130%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#14a5c9" floodOpacity="0.16" />
          </filter>
        </defs>

        <ellipse cx="60" cy="60" rx="48" ry="38" transform="rotate(-12 60 60)" fill="#d8f1ff" opacity="0.7" />

        {/* نافذة التصميم */}
        <g filter="url(#ux-shadow)">
          <rect x="16" y="20" width="80" height="64" rx="12" fill="#ffffff" />
          <path d="M16 32C16 25.3726 21.3726 20 28 20H84C90.6274 20 96 25.3726 96 32V34H16V32Z" fill="#bae3ff" />
          <circle cx="25" cy="27" r="2.5" fill="#ff7eb6" />
          <circle cx="33" cy="27" r="2.5" fill="#ffd166" />
          <circle cx="41" cy="27" r="2.5" fill="#2ec4b6" />

          {/* صورة على اليسار */}
          <rect x="23" y="40" width="28" height="30" rx="6" fill="#e3f3ff" />
          <circle cx="43" cy="47" r="3.5" fill="#72b7f9" />
          <path d="M24 68L32 55L40 64L45 59L50 68H24Z" fill="#7cc0ff" />

          {/* مربع تحديد UX */}
          <rect x="57" y="41" width="31" height="22" rx="3" stroke="#62b0ff" strokeWidth="1.6" strokeDasharray="3 2" fill="#f2f9ff" />
          <rect x="55" y="39" width="4" height="4" rx="1" fill="#ffffff" stroke="#4da3ff" strokeWidth="1.4" />
          <rect x="86" y="39" width="4" height="4" rx="1" fill="#ffffff" stroke="#4da3ff" strokeWidth="1.4" />
          <rect x="55" y="61" width="4" height="4" rx="1" fill="#ffffff" stroke="#4da3ff" strokeWidth="1.4" />
          <rect x="86" y="61" width="4" height="4" rx="1" fill="#ffffff" stroke="#4da3ff" strokeWidth="1.4" />
          <text x="72.5" y="55.5" textAnchor="middle" fill="#5da9ff" fontSize="11" fontWeight="900" fontFamily="sans-serif">UX</text>
        </g>

        {/* شارة UI/UX الأمامية */}
        <g filter="url(#ux-shadow)">
          <rect x="8" y="66" width="44" height="32" rx="9" fill="#f4faff" stroke="#ffffff" strokeWidth="2" />
          <text x="30" y="84" textAnchor="middle" fill="#4696ec" fontSize="11" fontWeight="900" fontFamily="sans-serif">UI/UX</text>
          <path d="M16 90Q30 87 44 90" stroke="#68b5ff" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* باليت الألوان + أداة القلم */}
        <g filter="url(#ux-shadow)">
          <rect x="54" y="78" width="52" height="20" rx="10" fill="#ffffff" />
          <circle cx="63" cy="88" r="4.5" fill="#63a4ff" />
          <circle cx="74" cy="88" r="4.5" fill="#ea8cff" />
          <circle cx="85" cy="88" r="4.5" fill="#ffd15c" />
          <circle cx="96" cy="88" r="4.5" fill="#5ce1c6" />

          {/* Pen Tool */}
          <path d="M102 44L112 62L104 68L96 62L102 44Z" fill="#ffffff" stroke="#6bb5ff" strokeWidth="1.8" />
          <circle cx="103" cy="56" r="2" fill="#6bb5ff" />
          <rect x="95" y="66" width="12" height="9" rx="2.5" transform="rotate(-15 95 66)" fill="#5ca4ff" />
        </g>
      </svg>
    )
  }

  // 04: حلول SaaS (SaaS Cloud & Analytics 3D Illustration)
  if (type === 3) {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="saas-cloud" x1="48" y1="54" x2="108" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffca4b" />
            <stop offset="1" stopColor="#f5820b" />
          </linearGradient>
          <linearGradient id="saas-top" x1="16" y1="22" x2="88" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffc13b" />
            <stop offset="1" stopColor="#f59316" />
          </linearGradient>
          <filter id="saas-shadow" x="-15%" y="-15%" width="130%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#ea580c" floodOpacity="0.18" />
          </filter>
        </defs>

        <ellipse cx="60" cy="60" rx="48" ry="38" transform="rotate(-18 60 60)" fill="#ffecd2" opacity="0.8" />

        {/* لوحة تحكم الإحصائيات */}
        <g filter="url(#saas-shadow)">
          <rect x="16" y="24" width="72" height="54" rx="11" fill="#ffffff" />
          <path d="M16 34C16 28.4772 20.4772 24 26 24H78C83.5228 24 88 28.4772 88 34V36H16V34Z" fill="url(#saas-top)" />
          <circle cx="24" cy="30" r="2.2" fill="#ff5e62" />
          <circle cx="31" cy="30" r="2.2" fill="#ffe066" />
          <circle cx="38" cy="30" r="2.2" fill="#38ef7d" />

          {/* الرسم البياني */}
          <rect x="22" y="42" width="32" height="24" rx="4" fill="#fff6e8" />
          <path d="M25 60L33 53L40 56L49 46" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="25" cy="60" r="2.2" fill="#f59e0b" />
          <circle cx="33" cy="53" r="2.2" fill="#f59e0b" />
          <circle cx="40" cy="56" r="2.2" fill="#f59e0b" />
          <circle cx="49" cy="46" r="2.2" fill="#f59e0b" />

          <rect x="58" y="43" width="22" height="4" rx="2" fill="#e5d5c3" />
          <rect x="58" y="50" width="18" height="4" rx="2" fill="#e5d5c3" />
        </g>

        {/* وحدات السيرفر (Server Racks) */}
        <g filter="url(#saas-shadow)">
          <rect x="10" y="68" width="36" height="12" rx="4" fill="#fff9f0" stroke="#fde2bd" />
          <circle cx="16" cy="74" r="2" fill="#f59e0b" />
          <circle cx="22" cy="74" r="2" fill="#f59e0b" />
          <rect x="28" y="72.5" width="13" height="3" rx="1.5" fill="#f59e0b" />

          <rect x="10" y="83" width="36" height="12" rx="4" fill="#fff9f0" stroke="#fde2bd" />
          <circle cx="16" cy="89" r="2" fill="#f59e0b" />
          <circle cx="22" cy="89" r="2" fill="#f59e0b" />
          <rect x="28" y="87.5" width="13" height="3" rx="1.5" fill="#f59e0b" />
        </g>

        {/* أيقونة الرفع السحابي العلوية */}
        <g filter="url(#saas-shadow)">
          <circle cx="96" cy="36" r="14" fill="url(#saas-top)" />
          <path d="M90 40H102C104.2 40 105.5 38.4 105.5 36.5C105.5 34.8 104.2 33.3 102.5 33.1C101.8 30.2 99.2 28 96 28C92.4 28 89.5 30.6 89.1 34C87.4 34.4 86.2 35.9 86.2 37.6C86.2 39 87.8 40 90 40Z" fill="#ffffff" />
          <path d="M96 42V34M96 34L93 37M96 34L99 37" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* سحابة SaaS الثلاثية الأبعاد */}
        <g filter="url(#saas-shadow)">
          <path d="M58 96H98C104.6 96 109.5 91.2 109.5 85C109.5 79.4 105.3 74.8 99.8 74.1C98.2 65.5 90.7 59 81.5 59C71.2 59 62.8 66.8 61.9 76.8C56.3 77.6 52 82.3 52 88C52 92.8 54.8 96 58 96Z" fill="url(#saas-cloud)" />
          <text x="81" y="88" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900" fontFamily="sans-serif">SaaS</text>
        </g>
      </svg>
    )
  }

  // 05: الذكاء الاصطناعي (AI Integration 3D Illustration)
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible" fill="none">
      <defs>
        <linearGradient id="ai-brain" x1="34" y1="36" x2="86" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#6d4aff" />
        </linearGradient>
        <linearGradient id="ai-bulb" x1="80" y1="16" x2="104" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#7c5dfa" />
        </linearGradient>
        <filter id="ai-shadow" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#5745e7" floodOpacity="0.2" />
        </filter>
      </defs>

      <ellipse cx="60" cy="62" rx="48" ry="38" transform="rotate(-15 60 62)" fill="#ebe5ff" opacity="0.8" />

      {/* مسارات الشبكة العصبية */}
      <g stroke="#7c5dfa" strokeWidth="2.2" strokeLinecap="round">
        <path d="M60 38V24" />
        <path d="M40 56H24" />
        <path d="M42 74L28 82" />
        <path d="M80 56H96" />
        <path d="M78 70H94" />
        <path d="M54 84V98" />
        <path d="M68 84V98" />
      </g>
      <circle cx="60" cy="22" r="4" fill="#8b6eff" />
      <circle cx="22" cy="56" r="4" fill="#8b6eff" />
      <circle cx="26" cy="83" r="4" fill="#8b6eff" />
      <circle cx="98" cy="56" r="4" fill="#8b6eff" />
      <circle cx="54" cy="100" r="4" fill="#8b6eff" />
      <circle cx="68" cy="100" r="4" fill="#8b6eff" />

      {/* العقل الرقمي + شارة AI */}
      <g filter="url(#ai-shadow)">
        <circle cx="52" cy="54" r="14" fill="url(#ai-brain)" />
        <circle cx="68" cy="54" r="14" fill="url(#ai-brain)" />
        <circle cx="48" cy="68" r="13" fill="url(#ai-brain)" />
        <circle cx="72" cy="68" r="13" fill="url(#ai-brain)" />
        <rect x="44" y="48" width="32" height="30" rx="9" fill="#f5f2ff" stroke="#dcd4ff" strokeWidth="2" />
        <text x="60" y="68" textAnchor="middle" fill="#5e43f3" fontSize="15" fontWeight="900" fontFamily="sans-serif">AI</text>
      </g>

      {/* كارت الرسم البياني العلوي */}
      <g filter="url(#ai-shadow)">
        <rect x="14" y="24" width="30" height="22" rx="6" transform="rotate(-8 14 24)" fill="#ffffff" />
        <rect x="20" y="35" width="4" height="6" rx="1" fill="#a78bfa" />
        <rect x="27" y="31" width="4" height="10" rx="1" fill="#8b6eff" />
        <rect x="34" y="27" width="4" height="14" rx="1" fill="#6d4aff" />
      </g>

      {/* مصباح الابتكار الذكي */}
      <g filter="url(#ai-shadow)">
        <circle cx="92" cy="30" r="12" fill="url(#ai-bulb)" />
        <rect x="88" y="41" width="8" height="5" rx="2" fill="#6d4aff" />
        <path d="M90 34V28M94 34V26" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="90" cy="27" r="1.5" fill="#ffffff" />
        <circle cx="94" cy="25" r="1.5" fill="#ffffff" />
      </g>

      {/* كارت البيانات السفلي */}
      <g filter="url(#ai-shadow)">
        <rect x="74" y="76" width="32" height="22" rx="6" transform="rotate(6 74 76)" fill="#ffffff" />
        <circle cx="81" cy="83" r="1.8" fill="#7c5dfa" />
        <rect x="85" y="81.5" width="15" height="3" rx="1.5" fill="#c4b5fd" />
        <circle cx="81" cy="89" r="1.8" fill="#7c5dfa" />
        <rect x="85" y="87.5" width="12" height="3" rx="1.5" fill="#c4b5fd" />
      </g>
    </svg>
  )
}

/* =========================================================
   SERVICE TIMELINE (مطابق لفيجما 100%)
========================================================= */

// ألوان كل كارت (كتبتها كاملة عشان Tailwind يشوفها)
const serviceThemes = [
  {
    blob: "bg-[#ece6ff] dark:bg-[#2b2650]",
    number: "text-[#5745e7] dark:text-[#8b7cff]",
    ring: "border-[#d5d9ff] dark:border-[#494377]",
    bar: "bg-[#5745e7]",
    dot: "bg-[#8b7cff]",
    line: "bg-[#c9c2ff] dark:bg-[#3b3668]",
  },
  {
    blob: "bg-[#e3e8ff] dark:bg-[#252a52]",
    number: "text-[#4c6fff] dark:text-[#8fa6ff]",
    ring: "border-[#cfd9ff] dark:border-[#3a4478]",
    bar: "bg-[#4c6fff]",
    dot: "bg-[#8fa6ff]",
    line: "bg-[#bfcaff] dark:bg-[#343d6e]",
  },
  {
    blob: "bg-[#def3fb] dark:bg-[#1c3441]",
    number: "text-[#14a5c9] dark:text-[#5fd0ee]",
    ring: "border-[#c6ecf7] dark:border-[#2c5668]",
    bar: "bg-[#14b8d9]",
    dot: "bg-[#5fd0ee]",
    line: "bg-[#b4e4f3] dark:bg-[#2a4d5c]",
  },
  {
    blob: "bg-[#fff0dc] dark:bg-[#40301d]",
    number: "text-[#f59e0b] dark:text-[#fbbf4d]",
    ring: "border-[#fde3bd] dark:border-[#6b5127]",
    bar: "bg-[#f59e0b]",
    dot: "bg-[#fbbf4d]",
    line: "bg-[#fbd9a3] dark:bg-[#5c4524]",
  },
  {
    blob: "bg-[#ece6ff] dark:bg-[#2b2650]",
    number: "text-[#5745e7] dark:text-[#8b7cff]",
    ring: "border-[#d5d9ff] dark:border-[#494377]",
    bar: "bg-[#5745e7]",
    dot: "bg-[#8b7cff]",
    line: "bg-[#c9c2ff] dark:bg-[#3b3668]",
  },
] as const

function ServicesTimeline({
  items,
  isArabic,
}: {
  items: Array<{
    number: string
    title: string
    description: string
    icon: string
  }>
  isArabic: boolean
}) {
  return (
    <Stagger
      staggerDelay={0.12}
      delayChildren={0.05}
      className="relative mx-auto mt-12 max-w-[1100px] sm:mt-20"
    >
      {/* الخط العمودي في النص */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#5c49ed] via-[#b5c6ff] to-[#e7d7ff] md:block dark:from-[#6d5cff] dark:via-[#4b4778] dark:to-[#29254b]"
      />

      <div className="space-y-8 sm:space-y-10 md:space-y-14">
        {items.map((item, index) => {
          const isLeft = index % 2 === 0
          const theme = serviceThemes[index % serviceThemes.length]

          const card = (
            <div
              dir={isArabic ? "rtl" : "ltr"}
              className="group relative overflow-hidden rounded-[26px] bg-white p-5 shadow-[0_18px_50px_rgba(80,70,180,0.08)] ring-1 ring-[#eeeef5] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(80,70,180,0.14)] sm:p-7 dark:bg-[#19172f] dark:ring-white/10 dark:shadow-[0_18px_50px_rgba(0,0,0,0.3)]"
            >
              {/* الشكل الملوّن خلف الأيقونة (على الطرف الخارجي تماماً مثل فيجما) */}
              <div
                aria-hidden="true"
                className={[
                  "absolute top-1/2 h-56 w-56 -translate-y-1/2 rounded-full opacity-95 transition-transform duration-500 group-hover:scale-110",
                  theme.blob,
                  isLeft ? "-left-24" : "-right-24",
                ].join(" ")}
              />

              {/* dir=ltr عشان ترتيب الأيقونة يفضل ثابت يمين/شمال في اللغتين مثل فيجما */}
              <div
                dir="ltr"
                className={[
                  "relative flex items-center gap-5 sm:gap-7",
                  isLeft ? "flex-row" : "flex-row-reverse",
                ].join(" ")}
              >
                {/* المربع الأبيض البارز وبداخله رسمة الـ 3D مثل فيجما 100% */}
                <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-[22px] bg-white p-2 shadow-[0_12px_30px_rgba(60,50,140,0.10)] ring-1 ring-black/[0.03] transition-transform duration-500 group-hover:scale-105 sm:h-[108px] sm:w-[108px] sm:rounded-[26px] dark:bg-[#242142] dark:ring-white/10">
                  <Service3DIllustration index={index} />
                </div>

                {/* النص */}
                <div
                  dir={isArabic ? "rtl" : "ltr"}
                  className={[
                    "min-w-0 flex-1",
                    isArabic ? "text-right" : "text-left",
                  ].join(" ")}
                >
                  <h3 className="text-lg font-black text-[#17163b] sm:text-[21px] dark:text-white">
                    {item.title}
                  </h3>

                  <div
                    className={[
                      "mt-2 h-[3px] w-10 rounded-full transition-all duration-500 group-hover:w-16",
                      theme.bar,
                    ].join(" ")}
                  />

                  <p className="mt-3 text-[12.5px] leading-6 text-[#697284] sm:text-[14.5px] sm:leading-7 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          )

          const numberCircle = (
            <div
              className={[
                "z-20 hidden h-[64px] w-[64px] items-center justify-center rounded-full border-[3px] bg-white text-xl font-black shadow-[0_10px_30px_rgba(75,65,180,0.12)] transition-transform duration-500 hover:scale-110 md:flex dark:bg-[#242142] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                theme.ring,
                theme.number,
              ].join(" ")}
            >
              {item.number}
            </div>
          )

          // خط صغير بنقطة في الناحية الفاضية
          const connector = (
            <div
              aria-hidden="true"
              className={[
                "hidden items-center md:flex",
                isLeft ? "justify-start" : "justify-end",
              ].join(" ")}
            >
              <div
                className={[
                  "flex items-center",
                  isLeft ? "flex-row" : "flex-row-reverse",
                ].join(" ")}
              >
                <span className={["h-[2px] w-10 rounded-full", theme.line].join(" ")} />
                <span className={["h-2 w-2 rounded-full", theme.dot].join(" ")} />
              </div>
            </div>
          )

          return (
            <StaggerItem key={item.number}>
              <div
                dir="ltr"
                className="relative grid items-center md:grid-cols-[1fr_96px_1fr]"
              >
                {/* الكارت */}
                <div
                  className={
                    isLeft
                      ? "md:col-start-1 md:row-start-1 md:pr-6"
                      : "md:col-start-3 md:row-start-1 md:pl-6"
                  }
                >
                  {card}
                </div>

                {/* الرقم في النص */}
                <div className="flex justify-center md:col-start-2 md:row-start-1">
                  {numberCircle}
                </div>

                {/* الخط الجانبي الصغير */}
                <div
                  className={
                    isLeft
                      ? "md:col-start-3 md:row-start-1"
                      : "md:col-start-1 md:row-start-1"
                  }
                >
                  {connector}
                </div>

                {/* رقم الموبايل */}
                <div className="mt-4 flex items-center gap-3 md:hidden">
                  <div
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-full bg-[#f0edff] text-xs font-black dark:bg-[#242142]",
                      theme.number,
                    ].join(" ")}
                  >
                    {item.number}
                  </div>
                  <div className="h-px flex-1 bg-[#dcd9f5] dark:bg-[#363252]" />
                </div>
              </div>
            </StaggerItem>
          )
        })}
      </div>
    </Stagger>
  )
}

/* =========================================================
   VALUES SECTION
========================================================= */

function ValuesSection({
  title,
  items,
  isArabic,
}: {
  title: string
  items: Array<{
    number: string
    title: string
    description: string
    small: string
    icon: string
  }>
  isArabic: boolean
}) {
  return (
    <section className="bg-[#171451] py-16 text-white sm:py-28 lg:py-32 dark:bg-[#100e35]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        {/* Title */}
        <Reveal>
          <h2 className="text-center text-2xl font-black leading-tight sm:text-5xl lg:text-[54px]">
            {title}
          </h2>
        </Reveal>

        {/* Interactive Values Grid */}
        <ValuesGrid
          items={items}
          isArabic={isArabic}
        />
      </div>
    </section>
  )
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default async function AboutPage(
  props: PageProps
) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) {
    notFound()
  }

  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const data = dict.about
  const isArabic = locale === "ar"

  // الصور الأصلية المطابقة 100% لصفحة أعمالنا (Our Work) مع جلب أي تحديث من قاعدة البيانات الحقيقية
  let hospitalImage = "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=640&q=75"
  let ostazImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&q=75"
  let electroliteImage = "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=640&q=75"

  try {
    const rawApi = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://codexa-website-backend.vercel.app"
    const apiBase = rawApi.includes("localhost")
      ? "https://codexa-website-backend.vercel.app"
      : rawApi.replace(/\/$/, "")

    const res = await fetch(`${apiBase}/projects?isPublic=true`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2500),
    })

    if (res.ok) {
      const payload = await res.json()
      const list = Array.isArray(payload) ? payload : payload?.data
      if (Array.isArray(list)) {
        const hospitalProj = list.find(
          (p: any) =>
            (p.name && (p.name.includes("نور") || p.name.toLowerCase().includes("nour"))) ||
            (p.title && (p.title.includes("نور") || p.title.toLowerCase().includes("nour")))
        )
        if (hospitalProj && (hospitalProj.cover || hospitalProj.image)) {
          hospitalImage = hospitalProj.cover || hospitalProj.image
        }

        const ostazProj = list.find(
          (p: any) =>
            (p.name && (p.name.includes("أستاذ") || p.name.includes("استاذ") || p.name.toLowerCase().includes("ostaz"))) ||
            (p.title && (p.title.includes("أستاذ") || p.title.toLowerCase().includes("ostaz")))
        )
        if (ostazProj && (ostazProj.cover || ostazProj.image)) {
          ostazImage = ostazProj.cover || ostazProj.image
        }

        const electroProj = list.find(
          (p: any) =>
            (p.name && (p.name.includes("إلكترولايت") || p.name.includes("الكترولايت") || p.name.toLowerCase().includes("electrolite"))) ||
            (p.title && (p.title.includes("إلكترولايت") || p.title.toLowerCase().includes("electrolite")))
        )
        if (electroProj && (electroProj.cover || electroProj.image)) {
          electroliteImage = electroProj.cover || electroProj.image
        }
      }
    }
  } catch {
    // في حال عدم استجابة الخادم الخارجي نستخدم الصور الأصلية المعتمدة فوراً
  }

  const mainProject: ShowcaseItem = {
    title: isArabic ? "مستشفى النور" : "Al-Nour Hospital",
    subtitle: isArabic ? "منظومة طبية متكاملة" : "Healthcare ERP System",
    badge: isArabic ? "أنظمة برمجية خاصة" : "Custom Software",
    image: hospitalImage,
  }

  const secondProject: ShowcaseItem = {
    title: isArabic ? "منصة الأستاذ" : "Al-Ostaz LMS",
    subtitle: isArabic ? "تكنولوجيا التعليم" : "E-Learning Platform",
    badge: isArabic ? "منصات تعليمية" : "EdTech",
    image: ostazImage,
  }

  const thirdProject: ShowcaseItem = {
    title: isArabic ? "متجر إلكترولايت" : "Electrolite Store",
    subtitle: isArabic ? "تجارة إلكترونية وحلول دفع" : "E-Commerce & FinTech",
    badge: isArabic ? "متاجر إلكترونية" : "E-Commerce",
    image: electroliteImage,
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="
        overflow-hidden
        bg-white
        text-[#626b7b]
        dark:bg-[#0d0b1f]
        dark:text-gray-300
      "
    >

      {/* =====================================================
          HERO (في العربي: الكلام يمين والصور يسار | في الإنجليزي: الكلام يسار والصور يمين)
      ===================================================== */}
      <section
        className="
          relative
          overflow-hidden
          bg-white
          py-12
          sm:py-20
          lg:py-28
          dark:bg-[#0d0b1f]
        "
      >
        <div className="mx-auto max-w-[1450px] px-4 sm:px-8">
          <div
            dir="ltr"
            className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16"
          >
            {/* Visual: يسار في العربي (col-start-1) ويمين في الإنجليزي (col-start-2) */}
            <div
              className={[
                "order-2 lg:row-start-1",
                isArabic ? "lg:col-start-1" : "lg:col-start-2",
              ].join(" ")}
            >
              <ProjectVisual
                locale={locale}
                isArabic={isArabic}
                mainProject={mainProject}
                secondProject={secondProject}
                thirdProject={thirdProject}
              />
            </div>

            {/* Text: يمين في العربي (col-start-2) ويسار في الإنجليزي (col-start-1) */}
            <div
              dir={isArabic ? "rtl" : "ltr"}
              className={[
                "order-1 lg:row-start-1",
                isArabic
                  ? "text-center lg:col-start-2 lg:text-right"
                  : "text-center lg:col-start-1 lg:text-left",
              ].join(" ")}
            >
              <Reveal>
                <p className="text-sm font-bold text-[#5745e7] sm:text-base dark:text-[#8b7cff]">
                  {data.hero.eyebrow}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <h1
                  className="
                    mt-3
                    sm:mt-5
                    text-3xl
                    font-black
                    leading-[1.22]
                    tracking-tight
                    text-[#0d0b2c]
                    sm:text-5xl
                    lg:text-[64px]
                    xl:text-[72px]
                    dark:text-white
                  "
                >
                  {data.hero.titleFirst}{" "}
                  <span className="text-[#5142df] dark:text-[#8173ff]">
                    {data.hero.titleAccent}
                  </span>
                  <br />
                  {data.hero.titleLast}
                </h1>
              </Reveal>

              <FadeIn
                direction="up"
                delay={0.2}
                distance={30}
              >
                <p
                  className="
                    mx-auto
                    mt-5
                    sm:mt-8
                    max-w-[650px]
                    text-sm
                    leading-7
                    text-[#707887]
                    sm:text-xl
                    sm:leading-9
                    lg:mx-0
                    dark:text-gray-400
                  "
                >
                  {data.hero.description}
                </p>
              </FadeIn>

              <FadeIn
                direction="up"
                delay={0.35}
                distance={25}
              >
                <a
                  href={`/${locale}/contact`}
                  className="
                    mt-7
                    sm:mt-9
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    bg-[#5142df]
                    px-7
                    py-3.5
                    sm:px-9
                    sm:py-4
                    text-xs
                    sm:text-sm
                    font-bold
                    text-white
                    shadow-[0_18px_35px_-15px_rgba(81,66,223,.65)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-[#4535d0]
                    dark:bg-[#6655f5]
                    dark:hover:bg-[#7768ff]
                  "
                >
                  {data.hero.button}

                  {isArabic ? (
                    <ArrowUpLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </a>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MISSION / VISION
      ===================================================== */}
      <section
        className="
          relative
          overflow-hidden
          bg-[#fafaff]
          py-16
          sm:py-28
          lg:py-32
          dark:bg-[#121026]
        "
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl font-black text-[#11102f] sm:text-5xl dark:text-white">
                {data.goal.title}
              </h2>

              <p className="mx-auto mt-4 max-w-[850px] text-sm leading-7 text-[#656d7d] sm:mt-5 sm:text-lg sm:leading-8 dark:text-gray-400">
                {data.goal.description}
              </p>
            </div>
          </Reveal>

          <div
            className={[
              "mt-12 grid gap-8 sm:mt-20 sm:gap-10 lg:grid-cols-2 lg:gap-14",
              isArabic
                ? "lg:[direction:rtl]"
                : "",
            ].join(" ")}
          >
            <GoalCard
              title={data.goal.missionTitle}
              description={data.goal.mission}
            />

            <GoalCard
              title={data.goal.visionTitle}
              description={data.goal.vision}
              reverse
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}
      <section
        className="
          bg-white
          py-16
          sm:py-28
          lg:py-32
          dark:bg-[#0d0b1f]
        "
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl font-black text-[#11102f] sm:text-5xl dark:text-white">
                {data.services.titleFirst}{" "}
                <span className="text-[#5745e7] dark:text-[#8173ff]">
                  {data.services.titleAccent}
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-[850px] text-sm leading-7 text-[#656d7d] sm:mt-5 sm:text-lg sm:leading-8 dark:text-gray-400">
                {data.services.description}
              </p>
            </div>
          </Reveal>

          <ServicesTimeline
            items={data.services.items}
            isArabic={isArabic}
          />
        </div>
      </section>

      {/* =====================================================
          VALUES
      ===================================================== */}
      <ValuesSection
        title={data.values.title}
        items={data.values.items}
        isArabic={isArabic}
      />

      {/* =====================================================
          TESTIMONIAL (كلمة المؤسس مع الصورة الحقيقية)
      ===================================================== */}
      <section
        className="
          bg-[#12111b]
          px-4
          py-16
          text-white
          sm:px-8
          sm:py-28
          dark:bg-[#090812]
        "
      >
        <FadeIn
          direction="up"
          distance={45}
        >
          <div className="mx-auto max-w-[1050px] text-center">
            <Reveal>
              <p className="text-base font-black leading-8 sm:text-2xl sm:leading-[1.9] lg:text-[29px]">
                {data.testimonial.text}
              </p>
            </Reveal>

            <FadeIn
              direction="up"
              delay={0.15}
            >
              <div className="mt-8 flex items-center justify-center gap-4 sm:mt-10">
                {/* صورة المؤسس الشخصية المستوردة مباشرة */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white/20 shadow-lg">
                  <Image
                    src={founderImage}
                    alt={data.testimonial.name}
                    width={56}
                    height={56}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>

                <div
                  className={
                    isArabic
                      ? "text-right"
                      : "text-left"
                  }
                >
                  <p className="font-bold">
                    {data.testimonial.name}
                  </p>

                  <p className="mt-1 text-sm text-white/45">
                    {data.testimonial.role}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </FadeIn>
      </section>

    </main>
  )
}