import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"

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
  MessageCircle,
} from "lucide-react"

import {
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa"

import {
  FadeIn,
} from "@/components/shared/motion/fade-in"

import {
  Reveal,
} from "@/components/shared/motion/reveal"

import {
  Stagger,
  StaggerItem,
} from "@/components/shared/motion/stagger"

import {
  isValidLocale,
  type Locale,
} from "@/lib/i18n/config"


/* =========================================================
   TYPES
========================================================= */

type PageProps = {
  params: Promise<{
    lang: string
  }>
}


/* =========================================================
   CONTENT
========================================================= */

const content = {
  ar: {
    hero: {
      eyebrow: "الحلول الرقمية",
      titleFirst: "تبدأ",
      titleAccent: "رحلتك الرقمية",
      titleLast: "معنا",
      description:
        "شركة متخصصة في تطوير الحلول البرمجية والتطبيقات المبتكرة. نجمع بين الإبداع التقني والتصميم الاستثنائي لتقديم منتجات عالمية المستوى.",
      button: "تواصل معنا",
    },

    goal: {
      title: "هدفنا بسيط و واضح",
      description:
        "مش هدفنا ننجز مشروع وبس، لكن نبني معاك حاجة تكبر وتنجح على المدى الطويل.",
      missionTitle: "رسالتنا",
      mission:
        "تقديم حلول برمجية مبتكرة وموثوقة تساعد الشركات على النمو والتطور في العصر الرقمي. نلتزم بالجودة العالية والخدمة الممتازة في كل مشروع نقوم به.",
      visionTitle: "رؤيتنا",
      vision:
        "أن نكون الشركة الأولى المفضلة للحلول البرمجية والرقمية في الشرق الأوسط، معروفة بالابتكار والإبداع والالتزام بتحقيق نتائج استثنائية.",
    },

    services: {
      titleFirst: "خدماتنا",
      titleAccent: "المتميزة",
      description:
        "نقدم مجموعة شاملة من الخدمات المتخصصة التي تغطي جميع احتياجات المشاريع الرقمية الحديثة. من التطوير إلى الدعم الدائم، نحن هنا لتحقيق رؤيتك.",

      items: [
        {
          number: "01",
          title: "تطوير المواقع",
          description:
            "مواقع احترافية وسريعة وآمنة مع أحدث التقنيات والمعايير العالمية، مصممة للتحويل والأداء العالي.",
          icon: Globe,
        },
        {
          number: "02",
          title: "تطوير التطبيقات",
          description:
            "تطبيقات أندرويد و IOS احترافية بأعلى معايير الأداء والتصميم، مع تجربة مستخدم استثنائية.",
          icon: Smartphone,
        },
        {
          number: "03",
          title: "تصميم UX/UI",
          description:
            "تصاميم جميلة وعملية تجمع بين الجمالية والوظيفية، مع التركيز على تجربة المستخدم الممتازة.",
          icon: Palette,
        },
        {
          number: "04",
          title: "حلول SaaS",
          description:
            "منصات قابلة للتوسع وآمنة تخدم آلاف المستخدمين، مع دعم فني متواصل وتحديثات منتظمة.",
          icon: Boxes,
        },
        {
          number: "05",
          title: "تكامل الذكاء الاصطناعي",
          description:
            "حلول ذكاء اصطناعي متقدمة تحسن من أداء التطبيقات وتوفر قيمة مضافة حقيقية للمستخدمين.",
          icon: BrainCircuit,
        },
      ],
    },

    values: {
      title: "معنا حيث تتحول الأفكار اللي قيمة",
      items: [
        {
          number: "01",
          title: "فريق واحد من الفكرة إلى الإطلاق",
          description:
            "استراتيجية، تصميم، هندسة، واختبار داخل سقف واحد. لا وسطاء ولا تسليمات ضائعة بين الجهات — ما يعني قرارات أسرع وجودة أعلى واتساقًا كاملًا في التجربة النهائية.",
          small: "فريق متكامل",
          icon: Users,
        },
        {
          number: "02",
          title: "هندسة تبني لتصمد",
          description:
            "نستخدم أحدث التقنيات والممارسات البرمجية لبناء منتجات مستقرة وقابلة للتوسع والنمو.",
          small: "جودة تقنية",
          icon: Code2,
        },
        {
          number: "03",
          title: "تصميم يحمل هويتك",
          description:
            "نصمم تجارب رقمية تعبر عن علامتك التجارية وتجمع بين الهوية البصرية والأداء.",
          small: "هوية بصرية",
          icon: Palette,
        },
        {
          number: "04",
          title: "ذكاء اصطناعي بلا ضجيج",
          description:
            "ندمج الذكاء الاصطناعي حيث يضيف قيمة حقيقية، بدون تعقيد أو استخدام غير ضروري.",
          small: "تكامل AI",
          icon: BrainCircuit,
        },
        {
          number: "05",
          title: "ما بعد الإطلاق أهم",
          description:
            "نستمر معك بعد إطلاق المنتج من خلال الدعم والصيانة والتطوير المستمر.",
          small: "دعم مستمر",
          icon: ShieldCheck,
        },
      ],
    },

    testimonial: {
      text:
        "بدأنا WEB ستوديو لأننا عملنا في أماكن كثيرة كان التصميم فيها جيدًا والاستراتيجية جيدة، لكنها لم تلتقِ أبدًا. هنا يتشارك أفراد المكتب نفسه. هذه هي الفكرة كلها.",
      name: "أحمد مصطفى",
      role: "المؤسس والمدير الإبداعي",
    },

    cta: {
      eyebrow: "يلا نشتغل مع بعض",
      title:
        "عندك فكرة مشروع؟ خليها تبقى تجربة رقمية استثنائية.",
      button: "ابدأ مشروعك الآن",
      whatsapp: "واتساب",
    },

    footer: {
      nav: [
        "الرئيسية",
        "خدماتنا",
        "أعمالنا",
        "عملائنا",
        "من نحن",
        "تواصل معنا",
      ],
      email: "hello@codexa.com",
      phone: "+20 100 000 0000",
      location: "القاهرة، مصر",
      copyright: "© 2026 Codexa جميع الحقوق محفوظة",
    },
  },

  en: {
    hero: {
      eyebrow: "DIGITAL SOLUTIONS",
      titleFirst: "Start",
      titleAccent: "your digital",
      titleLast: "journey with us",
      description:
        "A specialized company in developing innovative software solutions and applications. We combine technical creativity with exceptional design to deliver world-class digital products.",
      button: "Contact us",
    },

    goal: {
      title: "Our goal is simple and clear",
      description:
        "Our goal isn't just to finish a project. We build something with you that can grow and succeed for the long term.",
      missionTitle: "Our Mission",
      mission:
        "Deliver innovative and reliable software solutions that help businesses grow and evolve in the digital age. We are committed to quality and exceptional service in every project.",
      visionTitle: "Our Vision",
      vision:
        "To become the preferred software and digital solutions company in the Middle East, known for innovation, creativity and exceptional results.",
    },

    services: {
      titleFirst: "Our",
      titleAccent: "Services",
      description:
        "We provide a comprehensive range of specialized services covering all modern digital project needs. From development to continuous support, we are here to bring your vision to life.",

      items: [
        {
          number: "01",
          title: "Web Development",
          description:
            "Professional, fast and secure websites using the latest technologies and global standards, designed for high conversion and performance.",
          icon: Globe,
        },
        {
          number: "02",
          title: "App Development",
          description:
            "Professional Android and iOS applications built with high performance standards and an exceptional user experience.",
          icon: Smartphone,
        },
        {
          number: "03",
          title: "UX/UI Design",
          description:
            "Beautiful and practical designs combining aesthetics and functionality with a strong focus on user experience.",
          icon: Palette,
        },
        {
          number: "04",
          title: "SaaS Solutions",
          description:
            "Scalable and secure platforms serving thousands of users with continuous technical support and regular updates.",
          icon: Boxes,
        },
        {
          number: "05",
          title: "AI Integration",
          description:
            "Advanced AI solutions that improve application performance and deliver real value to users.",
          icon: BrainCircuit,
        },
      ],
    },

    values: {
      title: "Where ideas turn into value",
      items: [
        {
          number: "01",
          title: "One team from idea to launch",
          description:
            "Strategy, design, engineering and testing under one roof. No middlemen and no lost handoffs.",
          small: "Integrated team",
          icon: Users,
        },
        {
          number: "02",
          title: "Engineering built to last",
          description:
            "We use modern technologies and engineering practices to build stable, scalable products.",
          small: "Technical quality",
          icon: Code2,
        },
        {
          number: "03",
          title: "Design that carries your identity",
          description:
            "Digital experiences that reflect your brand identity while balancing beauty and performance.",
          small: "Visual identity",
          icon: Palette,
        },
        {
          number: "04",
          title: "AI without the noise",
          description:
            "We integrate AI where it creates genuine value without unnecessary complexity.",
          small: "AI integration",
          icon: BrainCircuit,
        },
        {
          number: "05",
          title: "After launch matters most",
          description:
            "We stay with you after launch through support, maintenance and continuous development.",
          small: "Continuous support",
          icon: ShieldCheck,
        },
      ],
    },

    testimonial: {
      text:
        "We started WEB Studio because we worked in many places where the design was good and the strategy was good, but they never truly came together. Here, everyone works under the same roof. That's the whole idea.",
      name: "Ahmed Mostafa",
      role: "Founder & Creative Director",
    },

    cta: {
      eyebrow: "Let's work together",
      title:
        "Have a project idea? Turn it into an exceptional digital experience.",
      button: "Start your project",
      whatsapp: "WhatsApp",
    },

    footer: {
      nav: [
        "Home",
        "Services",
        "Portfolio",
        "Clients",
        "About us",
        "Contact us",
      ],
      email: "hello@codexa.com",
      phone: "+20 100 000 0000",
      location: "Cairo, Egypt",
      copyright: "© 2026 Codexa. All rights reserved.",
    },
  },
}


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

  const isArabic = lang === "ar"

  return {
    title: isArabic
      ? "من نحن | Codexa"
      : "About Us | Codexa",

    description: isArabic
      ? "تعرف على Codexa وخدماتنا الرقمية وحلولنا البرمجية."
      : "Learn more about Codexa, our digital services and software solutions.",
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
      <Image
        src="/images/Codexa Projets Image.png"
        alt="Codexa projects"
        width={800}
        height={800}
        priority
        className="h-auto w-full object-contain"
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
          "relative overflow-hidden rounded-[24px] border border-[#e3e4ee]",
          "bg-[#fafaff] px-8 py-10",
          "shadow-[0_25px_70px_rgba(70,65,150,0.07)]",
          "transition-all duration-300",
          "hover:-translate-y-1",
          "hover:shadow-[0_30px_80px_rgba(70,65,150,0.12)]",
        ].join(" ")}
      >
        <div
          className={[
            "absolute h-32 w-32 rounded-full bg-[#ece8ff]",
            reverse
              ? "-left-14 -bottom-14"
              : "-right-14 -top-14",
          ].join(" ")}
        />

        <div className="relative">
          <h3 className="text-center text-3xl font-black text-[#11102f]">
            {title}
          </h3>

          <div className="mx-auto mt-4 h-[3px] w-24 rounded-full bg-[#5745e7]" />

          <p className="mx-auto mt-8 max-w-[520px] text-center text-[18px] leading-[2] text-[#687082]">
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
  items: typeof content.ar.services.items
  isArabic: boolean
}) {
  return (
    <Stagger
      staggerDelay={0.12}
      delayChildren={0.05}
      className="relative mx-auto mt-20 max-w-[1200px]"
    >
      {/* Central line */}

      <div className="absolute left-1/2 top-0 hidden h-full w-[3px] -translate-x-1/2 bg-gradient-to-b from-[#5c49ed] via-[#b5c6ff] to-[#e7d7ff] md:block" />

      <div className="space-y-14 md:space-y-24">

        {items.map((item, index) => {
          const Icon = item.icon
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
                  <div className="group relative overflow-hidden rounded-[22px] bg-white p-7 shadow-[0_20px_60px_rgba(80,70,180,0.08)] ring-1 ring-[#eeeef5] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(80,70,180,0.13)]">

                    {/* Decorative shape */}

                    <div
                      className={[
                        "absolute top-1/2 h-48 w-48 -translate-y-1/2 rounded-full opacity-70",
                        isLeft
                          ? "-left-28 bg-[#eadfff]"
                          : "-right-28 bg-[#e1e5ff]",
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

                      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[22px] bg-white shadow-[0_12px_30px_rgba(60,50,140,0.08)] transition-transform duration-500 group-hover:scale-105">
                        <Icon className="h-11 w-11 text-[#6755ec] transition-transform duration-500 group-hover:rotate-6" />
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
                        <h3 className="text-[22px] font-black text-[#17163b]">
                          {item.title}
                        </h3>

                        <div className="mt-2 h-[3px] w-10 rounded-full bg-[#6755ec] transition-all duration-500 group-hover:w-16" />

                        <p className="mt-4 text-[16px] leading-8 text-[#697284]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Desktop number */}

                <div className="absolute left-1/2 top-1/2 z-20 hidden h-[82px] w-[82px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-[#d5d9ff] bg-white text-2xl font-black text-[#5745e7] shadow-[0_10px_30px_rgba(75,65,180,0.12)] transition-transform duration-500 hover:scale-110 md:flex">
                  {item.number}
                </div>


                {/* Mobile number */}

                <div className="mt-5 flex items-center gap-3 md:hidden">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f0edff] text-sm font-black text-[#5745e7]">
                    {item.number}
                  </div>

                  <div className="h-px flex-1 bg-[#dcd9f5]" />
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
  items,
  isArabic,
}: {
  items: typeof content.ar.values.items
  isArabic: boolean
}) {
  return (
    <section className="bg-[#171451] py-24 text-white sm:py-28 lg:py-32">

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">

        {/* Title */}

        <Reveal>
          <h2 className="text-center text-4xl font-black leading-tight sm:text-5xl lg:text-[54px]">
            {content[isArabic ? "ar" : "en"].values.title}
          </h2>
        </Reveal>


        {/* Cards */}

        <Stagger
          staggerDelay={0.1}
          delayChildren={0.1}
          className={[
            "mt-16 grid grid-cols-1 gap-5",
            "sm:grid-cols-2",
            "lg:grid-cols-3",
            "xl:grid-cols-5",
            "items-stretch",
            isArabic ? "md:[direction:rtl]" : "",
          ].join(" ")}
        >

          {items.map((item, index) => {
            const Icon = item.icon
            const active = index === 0

            return (
              <StaggerItem
                key={item.number}
                className="flex h-full"
              >

                <div
                  className={[
                    "group flex h-full min-h-[420px] w-full flex-col",
                    "overflow-hidden rounded-[20px]",
                    "border border-white/[0.04]",
                    "p-6 sm:p-7",
                    "transition-all duration-500",
                    active
                      ? "bg-gradient-to-b from-[#4b42a9] to-[#26205f]"
                      : "bg-[#24205c]",
                    "hover:-translate-y-2 hover:bg-[#37317c]",
                  ].join(" ")}
                >

                  {/* Number + Icon */}

                  <div className="flex shrink-0 items-start justify-between">
                    <span className="text-3xl font-bold text-white">
                      {item.number}
                    </span>

                    <Icon
                      className="
                        h-7 w-7
                        text-white/40
                        transition duration-500
                        group-hover:scale-110
                        group-hover:text-white
                      "
                    />
                  </div>


                  {/* Content */}

                  <div
                    className={[
                      "mt-14 flex flex-1 flex-col",
                      isArabic
                        ? "text-right"
                        : "text-left",
                    ].join(" ")}
                  >

                    {/* Title */}

                    <h3 className="text-xl font-black leading-[1.45] sm:text-2xl">
                      {item.title}
                    </h3>


                    {/* Description */}

                    <p className="mt-6 text-[15px] leading-7 text-white/70 sm:leading-8">
                      {item.description}
                    </p>


                    {/* Small + Arrow */}

                    <div className="mt-auto pt-8">

                      <div className="flex items-center justify-between gap-4">

                        <span className="text-sm font-bold text-white/50">
                          {item.small}
                        </span>

                        <span
                          className="
                            flex h-10 w-10 shrink-0
                            items-center justify-center
                            rounded-full
                            border border-white/70
                            text-white
                            transition-all duration-300
                            group-hover:bg-white
                            group-hover:text-[#171451]
                          "
                        >
                          {isArabic ? (
                            <ArrowUpLeft className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </StaggerItem>
            )
          })}

        </Stagger>

      </div>
    </section>
  )
}


/* =========================================================
   FOOTER
========================================================= */

function AboutFooter({
  isArabic,
}: {
  isArabic: boolean
}) {
  const data = content[isArabic ? "ar" : "en"]

  return (
    <footer className="bg-[#09090f] px-5 py-16 text-white sm:px-8">

      <div className="mx-auto max-w-[1080px]">

        <FadeIn direction="up">

          <div className="flex flex-col gap-10 border-b border-white/10 pb-12 lg:flex-row lg:items-center lg:justify-between">

            <nav
              className={[
                "flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/65",
                isArabic
                  ? "lg:order-2"
                  : "",
              ].join(" ")}
            >
              {data.footer.nav.map((item) => (
                <a
                  href="#"
                  key={item}
                  className="transition hover:text-white"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div
              className={[
                "flex flex-wrap gap-6 text-sm text-white/55",
                isArabic
                  ? "lg:order-1"
                  : "",
              ].join(" ")}
            >
              <span>{data.footer.location}</span>
              <span>{data.footer.phone}</span>
              <span>{data.footer.email}</span>
            </div>

          </div>

        </FadeIn>


        <FadeIn
          direction="up"
          delay={0.15}
        >

          <div className="flex flex-col items-center justify-between gap-8 pt-12 sm:flex-row">

            {/* Social icons */}

            <div className="flex gap-3">

              {/* WhatsApp */}

              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/70 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
              </a>


              {/* LinkedIn */}

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/70 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:text-white"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>


              {/* TikTok */}

              <a
                href="#"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/70 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:text-white"
              >
                <FaTiktok className="h-4 w-4" />
              </a>


              {/* Instagram */}

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/70 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:text-white"
              >
                <FaInstagram className="h-4 w-4" />
              </a>

            </div>


            {/* Large logo */}

            <div className="select-none text-center text-[100px] font-black leading-none tracking-[-0.08em] text-white/[0.08] sm:text-[150px]">
              Codexa
            </div>


            {/* Copyright */}

            <p className="text-xs text-white/40">
              {data.footer.copyright}
            </p>

          </div>

        </FadeIn>

      </div>
    </footer>
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

  const isArabic = locale === "ar"

  const data =
    content[isArabic ? "ar" : "en"]


  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="overflow-hidden bg-white text-[#626b7b]"
    >

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">

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

                <p className="text-base font-bold text-[#5745e7]">
                  {data.hero.eyebrow}
                </p>

              </Reveal>


              <Reveal delay={0.1}>

                <h1 className="mt-5 text-5xl font-black leading-[1.15] tracking-[-0.04em] text-[#0d0b2c] sm:text-6xl lg:text-[76px]">

                  {data.hero.titleFirst}{" "}

                  <span className="text-[#5142df]">
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

                <p className="mx-auto mt-8 max-w-[650px] text-lg leading-9 text-[#707887] sm:text-xl lg:mx-0">
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
                  className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#5142df] px-9 py-4 text-sm font-bold text-white shadow-[0_18px_35px_-15px_rgba(81,66,223,.65)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#4535d0]"
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

      <section className="relative overflow-hidden bg-[#fafaff] py-24 sm:py-28 lg:py-32">

        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">

          <Reveal>

            <div className="text-center">

              <h2 className="text-4xl font-black text-[#11102f] sm:text-5xl">
                {data.goal.title}
              </h2>

              <p className="mx-auto mt-5 max-w-[850px] text-lg leading-8 text-[#656d7d]">
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

      <section className="bg-white py-24 sm:py-28 lg:py-32">

        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">

          <Reveal>

            <div className="text-center">

              <h2 className="text-4xl font-black text-[#11102f] sm:text-5xl">

                {data.services.titleFirst}{" "}

                <span className="text-[#5745e7]">
                  {data.services.titleAccent}
                </span>

              </h2>

              <p className="mx-auto mt-5 max-w-[850px] text-lg leading-8 text-[#656d7d]">
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
        items={data.values.items}
        isArabic={isArabic}
      />


      {/* =====================================================
          TESTIMONIAL
      ===================================================== */}

      <section className="bg-[#12111b] px-5 py-24 text-white sm:px-8 sm:py-28">

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


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#08080d] px-5 py-28 text-white sm:px-8 lg:py-36">

        {/* Glow */}

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5142df]/10 blur-[100px]" />


        <div className="relative mx-auto max-w-[1000px] text-center">

          <Reveal>

            <p className="text-sm font-bold text-white/50">
              {data.cta.eyebrow}
            </p>

          </Reveal>


          <Reveal delay={0.1}>

            <h2 className="mx-auto mt-5 max-w-[900px] text-4xl font-black leading-[1.45] sm:text-5xl lg:text-[62px]">
              {data.cta.title}
            </h2>

          </Reveal>


          <FadeIn
            direction="up"
            delay={0.2}
            distance={30}
          >

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

              {/* Contact */}

              <a
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-sm font-bold transition duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/5"
              >

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5142df]">

                  {isArabic ? (
                    <ArrowUpLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}

                </span>

                {data.cta.button}

              </a>


              {/* WhatsApp */}

              <a
                href="#"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-sm font-bold transition duration-300 hover:-translate-y-1 hover:border-green-400/40 hover:bg-green-400/5"
              >

                <MessageCircle className="h-5 w-5 text-green-400" />

                {data.cta.whatsapp}

              </a>

            </div>

          </FadeIn>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <AboutFooter
        isArabic={isArabic}
      />

    </main>
  )
}