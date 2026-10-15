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
      direction="left"
      distance={60}
      duration={0.8}
      className="relative mx-auto w-full max-w-[560px] select-none py-6"
    >
      {/* توهج خلفي ناعم متناسق مع الوضع الفاتح والليلي */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-72 w-72 rounded-full bg-[#5745e7]/15 blur-[90px] dark:bg-[#5745e7]/25" />
      </div>

      <div className="relative mx-auto h-[410px] w-full max-w-[480px] sm:h-[460px]">
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
          "px-8 py-10",
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
          <h3 className="text-center text-3xl font-black text-[#11102f] dark:text-white">
            {title}
          </h3>

          <div className="mx-auto mt-4 h-[3px] w-24 rounded-full bg-[#5745e7]" />

          <p className="mx-auto mt-8 max-w-[520px] text-center text-[18px] leading-[2] text-[#687082] dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </FadeIn>
  )
}

/* =========================================================
   SERVICE TIMELINE
========================================================= */

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
      className="relative mx-auto mt-20 max-w-[1200px]"
    >
      {/* Central line */}
      <div
        className="
          absolute left-1/2 top-0 hidden h-full w-[3px]
          -translate-x-1/2
          bg-gradient-to-b
          from-[#5c49ed]
          via-[#b5c6ff]
          to-[#e7d7ff]
          dark:from-[#6d5cff]
          dark:via-[#4b4778]
          dark:to-[#29254b]
          md:block
        "
      />

      <div className="space-y-14 md:space-y-24">
        {items.map((item, index) => {
          const Icon =
            iconMap[item.icon as IconName] ?? Globe

          const isLeft = index % 2 === 0

          return (
            <StaggerItem key={item.number}>
              <div className="relative grid items-center md:grid-cols-2">

                {/* Card */}
                <div
                  className={[
                    isLeft
                      ? "md:pr-20"
                      : "md:col-start-2 md:pl-20",
                    "relative",
                  ].join(" ")}
                >
                  <div
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-[22px]
                      bg-white
                      p-7
                      shadow-[0_20px_60px_rgba(80,70,180,0.08)]
                      ring-1
                      ring-[#eeeef5]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-[0_30px_70px_rgba(80,70,180,0.13)]
                      dark:bg-[#19172f]
                      dark:ring-white/10
                      dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)]
                      dark:hover:shadow-[0_30px_70px_rgba(0,0,0,0.4)]
                    "
                  >
                    {/* Decorative shape */}
                    <div
                      className={[
                        "absolute top-1/2 h-48 w-48",
                        "-translate-y-1/2 rounded-full opacity-70",
                        isLeft
                          ? "-left-28 bg-[#eadfff] dark:bg-[#29244d]"
                          : "-right-28 bg-[#e1e5ff] dark:bg-[#25284c]",
                      ].join(" ")}
                    />

                    <div
                      className={[
                        "relative flex items-center gap-6",
                        isArabic
                          ? "flex-row-reverse"
                          : "",
                      ].join(" ")}
                    >
                      {/* Icon */}
                      <div
                        className="
                          relative
                          flex
                          h-24
                          w-24
                          shrink-0
                          items-center
                          justify-center
                          rounded-[22px]
                          bg-white
                          shadow-[0_12px_30px_rgba(60,50,140,0.08)]
                          transition-transform
                          duration-500
                          group-hover:scale-105
                          dark:bg-[#242142]
                          dark:shadow-[0_12px_30px_rgba(0,0,0,0.3)]
                        "
                      >
                        <Icon
                          className="
                            h-11
                            w-11
                            text-[#6755ec]
                            transition-transform
                            duration-500
                            group-hover:rotate-6
                          "
                        />
                      </div>

                      {/* Content */}
                      <div
                        className={[
                          "flex-1",
                          isArabic
                            ? "text-right"
                            : "text-left",
                        ].join(" ")}
                      >
                        <h3 className="text-[22px] font-black text-[#17163b] dark:text-white">
                          {item.title}
                        </h3>

                        <div
                          className="
                            mt-2
                            h-[3px]
                            w-10
                            rounded-full
                            bg-[#6755ec]
                            transition-all
                            duration-500
                            group-hover:w-16
                          "
                        />

                        <p className="mt-4 text-[16px] leading-8 text-[#697284] dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop number */}
                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    z-20
                    hidden
                    h-[82px]
                    w-[82px]
                    -translate-x-1/2
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border-[3px]
                    border-[#d5d9ff]
                    bg-white
                    text-2xl
                    font-black
                    text-[#5745e7]
                    shadow-[0_10px_30px_rgba(75,65,180,0.12)]
                    transition-transform
                    duration-500
                    hover:scale-110
                    dark:border-[#494377]
                    dark:bg-[#242142]
                    dark:text-[#8b7cff]
                    dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                    md:flex
                  "
                >
                  {item.number}
                </div>

                {/* Mobile number */}
                <div className="mt-5 flex items-center gap-3 md:hidden">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f0edff]
                      text-sm
                      font-black
                      text-[#5745e7]
                      dark:bg-[#242142]
                      dark:text-[#8b7cff]
                    "
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
    <section className="bg-[#171451] py-24 text-white sm:py-28 lg:py-32 dark:bg-[#100e35]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Title */}
        <Reveal>
          <h2 className="text-center text-4xl font-black leading-tight sm:text-5xl lg:text-[54px]">
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

  // جلب صورة مستشفى النور الحقيقية من قاعدة البيانات إن وجدت
  let hospitalImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  try {
    const apiBase = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "")
    const res = await fetch(`${apiBase}/projects?isPublic=true`, { cache: "no-store" })
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
      }
    }
  } catch (err) {
    console.error("تعذر جلب صورة المشروع لصفحة من نحن:", err)
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
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  }

  const thirdProject: ShowcaseItem = {
    title: isArabic ? "متجر إلكترولايت" : "Electrolite Store",
    subtitle: isArabic ? "تجارة إلكترونية وحلول دفع" : "E-Commerce & FinTech",
    badge: isArabic ? "متاجر إلكترونية" : "E-Commerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
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
          HERO
      ===================================================== */}
      <section
        className="
          relative
          overflow-hidden
          bg-white
          py-20
          sm:py-24
          lg:py-28
          dark:bg-[#0d0b1f]
        "
      >
        <div className="mx-auto max-w-[1450px] px-5 sm:px-8">
          <div
            className={[
              "grid items-center gap-12 lg:grid-cols-2 lg:gap-20",
              isArabic
                ? "lg:[direction:rtl]"
                : "",
            ].join(" ")}
          >
            {/* Visual */}
            <div
              className={[
                "order-2 lg:order-1",
                isArabic
                  ? "lg:order-1"
                  : "",
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

            {/* Text */}
            <div
              className={[
                "order-1",
                isArabic
                  ? "text-center lg:order-2 lg:text-right"
                  : "text-center lg:order-2 lg:text-left",
              ].join(" ")}
            >
              <Reveal>
                <p className="text-base font-bold text-[#5745e7] dark:text-[#8b7cff]">
                  {data.hero.eyebrow}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <h1
                  className="
                    mt-5
                    text-5xl
                    font-black
                    leading-[1.22]
                    tracking-[-0.04em]
                    text-[#0d0b2c]
                    sm:text-6xl
                    lg:text-[72px]
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
                    mt-8
                    max-w-[650px]
                    text-lg
                    leading-9
                    text-[#707887]
                    sm:text-xl
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
                    mt-9
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    bg-[#5142df]
                    px-9
                    py-4
                    text-sm
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
          py-24
          sm:py-28
          lg:py-32
          dark:bg-[#121026]
        "
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <Reveal>
            <div className="text-center">
              <h2 className="text-4xl font-black text-[#11102f] sm:text-5xl dark:text-white">
                {data.goal.title}
              </h2>

              <p className="mx-auto mt-5 max-w-[850px] text-lg leading-8 text-[#656d7d] dark:text-gray-400">
                {data.goal.description}
              </p>
            </div>
          </Reveal>

          <div
            className={[
              "mt-20 grid gap-10 lg:grid-cols-2 lg:gap-14",
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
          py-24
          sm:py-28
          lg:py-32
          dark:bg-[#0d0b1f]
        "
      >
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Reveal>
            <div className="text-center">
              <h2 className="text-4xl font-black text-[#11102f] sm:text-5xl dark:text-white">
                {data.services.titleFirst}{" "}
                <span className="text-[#5745e7] dark:text-[#8173ff]">
                  {data.services.titleAccent}
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-[850px] text-lg leading-8 text-[#656d7d] dark:text-gray-400">
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
          px-5
          py-24
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
              <p className="text-lg font-black leading-9 sm:text-2xl sm:leading-[1.9] lg:text-[29px]">
                {data.testimonial.text}
              </p>
            </Reveal>

            <FadeIn
              direction="up"
              delay={0.15}
            >
              <div className="mt-10 flex items-center justify-center gap-4">
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