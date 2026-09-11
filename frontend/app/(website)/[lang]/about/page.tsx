import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import lightProjectImage from "@/public/images/projects light.png"
import darkProjectImage from "@/public/images/projects dark.jpg"


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
   HERO PROJECT VISUAL
========================================================= */

function ProjectVisual() {
  return (
    <FadeIn
      direction="left"
      distance={60}
      duration={0.8}
      className="relative mx-auto w-full max-w-[620px]"
    >
      {/* Light Mode Image */}
      <Image
        src={lightProjectImage}
        alt="Codexa projects"
        width={1000}
        height={800}
        priority
        className="
          block
          h-auto
          w-full
          object-contain
          dark:hidden
        "
      />

      {/* Dark Mode Image */}
      <Image
        src={darkProjectImage}
        alt="Codexa projects"
        width={1000}
        height={800}
        priority
        className="
          hidden
          h-auto
          w-full
          object-contain
          dark:block
        "
      />
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

  /*
   * Get all translated content from the dictionary.
   * No page-level Arabic/English content is hardcoded.
   */

  const dict = await getDictionary(locale)

  const data = dict.about

  const isArabic = locale === "ar"

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
              <ProjectVisual />
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
                    leading-[1.15]
                    tracking-[-0.04em]
                    text-[#0d0b2c]
                    sm:text-6xl
                    lg:text-[76px]
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
          TESTIMONIAL
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

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-sm font-black text-[#16152b]">
                  أم
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