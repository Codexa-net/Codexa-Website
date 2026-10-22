import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { FadeIn } from '@/components/shared/motion/fade-in'

interface HeroSectionProps {
  locale: Locale
  dict: Dictionary
}

/* =========================================================
   كولاج الجانب الأيمن (4 كروت متداخلة بنفس شكل فيجما من مشاريعنا الحقيقية)
   1. سحابة فود ماستر (خلفية يسار)
   2. مستشفى النور (الشاشة البيضاء الطويلة في الأعلى)
   3. متجر إلكترولايت (الكارت الأسود السفلي يسار)
   4. منصة الأستاذ (الكارت الأخضر السفلي يمين)
========================================================= */
function RightRealProjectsCollage({
  locale,
  isArabic,
  hospitalImage,
}: {
  locale: Locale
  isArabic: boolean
  hospitalImage: string
}) {
  const ostazImg =
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&fm=webp&w=360&q=70'
  const electroImg =
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&fm=webp&w=360&q=70'
  const foodImg =
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&fm=webp&w=360&q=70'

  return (
    <Link
      href={`/${locale}/our-work`}
      aria-label={isArabic ? 'استكشف أعمالنا' : 'Explore Our Work'}
      className="group relative mx-auto block h-[300px] w-[280px] select-none sm:h-[350px] sm:w-[330px]"
    >
      {/* توهج خلفي */}
      <div className="pointer-events-none absolute inset-6 rounded-full bg-[#4b3fdf]/15 blur-3xl" />

      {/* 1. الكارت الخلفي الأيسر المائل (سحابة فود ماستر) */}
      <div className="absolute left-2 top-6 h-[180px] w-[142px] sm:h-[190px] sm:w-[150px] -rotate-[14deg] overflow-hidden rounded-[22px] border border-neutral-200/90 bg-[#f1f1f6] p-2.5 shadow-lg transition-transform duration-500 group-hover:-translate-x-1.5 group-hover:-rotate-[16deg] dark:border-white/10 dark:bg-zinc-800">
        <div className="flex items-center justify-between px-1">
          <span className="size-1.5 rounded-full bg-orange-500" />
          <span className="text-[8px] font-bold text-neutral-600 dark:text-neutral-300">
            {isArabic ? 'فود ماستر POS' : 'FoodMaster POS'}
          </span>
        </div>
        <div className="mt-2 h-[130px] sm:h-[140px] w-full overflow-hidden rounded-xl border border-black/5">
          <img
            src={foodImg}
            alt="FoodMaster POS"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* 2. الشاشة الرئيسية الطويلة في الأعلى (مستشفى النور) */}
      <div className="absolute right-4 sm:right-5 top-1 z-10 flex h-[225px] w-[148px] sm:h-[238px] sm:w-[155px] rotate-[10deg] flex-col overflow-hidden rounded-[26px] border-[3px] border-neutral-900 bg-white p-2.5 shadow-[0_22px_50px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-[7deg] dark:border-white/20 dark:bg-zinc-900">
        {/* Dynamic Island */}
        <div className="mx-auto h-2 w-10 shrink-0 rounded-full bg-neutral-900 dark:bg-white/20" />
        <div className="mt-2 flex items-center justify-between px-0.5">
          <span className="text-[9px] font-black text-neutral-900 dark:text-white">
            {isArabic ? 'مستشفى النور' : 'Al-Nour ERP'}
          </span>
          <span className="rounded-full bg-[#4b3fdf]/15 px-1.5 py-0.5 text-[7px] font-bold text-[#4b3fdf]">
            HIS
          </span>
        </div>
        <div className="mt-1.5 flex gap-1">
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[6px] font-semibold text-white">
            {isArabic ? 'العيادات' : 'Clinics'}
          </span>
          <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[6px] text-neutral-500 dark:bg-zinc-800">
            {isArabic ? 'الحجوزات' : 'Booking'}
          </span>
        </div>
        <div className="relative mt-2 flex-1 overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-white/10">
          <img
            src={hospitalImage}
            alt="مستشفى النور"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </div>

      {/* 3. الكارت الأسود السفلي الأيسر (متجر إلكترولايت) */}
      <div className="absolute bottom-4 sm:bottom-5 left-1 z-20 flex h-[142px] w-[135px] sm:h-[150px] sm:w-[142px] -rotate-[6deg] flex-col justify-between overflow-hidden rounded-[22px] border border-white/15 bg-[#0c0d14] p-2.5 sm:p-3 text-white shadow-[0_20px_45px_rgba(0,0,0,0.38)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:-rotate-[3deg]">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#a3e635]/20 px-1.5 py-0.5 text-[6.5px] sm:text-[7px] font-bold text-[#a3e635]">
            E-Commerce
          </span>
          <span className="text-[10px] sm:text-[11px] font-black tracking-tight text-white">
            {isArabic ? 'متجر إلكترولايت' : 'Electrolite'}
          </span>
        </div>
        <div className="relative mt-1.5 flex-1 overflow-hidden rounded-xl border border-white/15">
          <img
            src={electroImg}
            alt="متجر إلكترولايت"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute bottom-1.5 right-2 text-[8px] font-bold text-[#a3e635]">
            {isArabic ? 'تقسيط ودفع ذكي' : 'Smart FinTech'}
          </span>
        </div>
      </div>

      {/* 4. الكارت الأخضر السفلي الأيمن (منصة الأستاذ التعليمية) */}
      <div className="absolute bottom-2.5 sm:bottom-3 right-1 z-30 flex h-[138px] w-[135px] sm:h-[145px] sm:w-[142px] rotate-[8deg] flex-col justify-between overflow-hidden rounded-[22px] border border-emerald-300/80 bg-gradient-to-br from-[#e6f9ed] to-[#c6f1d6] p-2.5 sm:p-3 text-emerald-950 shadow-[0_20px_45px_rgba(16,185,129,0.22)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[4deg]">
        <div className="flex items-center justify-between">
          <span className="size-2 rounded-full bg-emerald-600" />
          <span className="text-[10px] sm:text-[11px] font-black tracking-tight text-emerald-950">
            {isArabic ? 'منصة الأستاذ' : 'Al-Ostaz LMS'}
          </span>
        </div>
        <div className="relative mt-1.5 flex-1 overflow-hidden rounded-xl border border-emerald-700/15 bg-white shadow-sm">
          <img
            src={ostazImg}
            alt="منصة الأستاذ"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 bg-emerald-950/75 px-2 py-1 text-center text-[7px] sm:text-[7.5px] font-bold text-emerald-100 backdrop-blur-xs">
            {isArabic ? 'منصة تعليمية وحماية DRM' : 'EdTech & DRM System'}
          </div>
        </div>
      </div>
    </Link>
  )
}

/* =========================================================
   كولاج الجانب الأيسر (3 مشاريع حقيقية متداخلة بنفس شكل فيجما)
   1. منصة عقار تك (الكارت العلوي السماوي)
   2. سيستم بالس جيم (الشاشة اليسرى داخل الكارت المائي)
   3. تطبيق كابتن فيت (الشاشة اليمنى داخل الكارت المائي)
========================================================= */
function LeftRealProjectsCollage({
  locale,
  isArabic,
}: {
  locale: Locale
  isArabic: boolean
}) {
  const aqarImg =
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&fm=webp&w=360&q=70'
  const pulseGymImg =
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&fm=webp&w=360&q=70'
  const captainFitImg =
    'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&fm=webp&w=360&q=70'

  return (
    <Link
      href={`/${locale}/our-work`}
      aria-label={isArabic ? 'مشاريع الموبايل والأنظمة' : 'Mobile & Web Systems'}
      className="group relative mx-auto block h-[320px] w-[300px] select-none sm:h-[350px] sm:w-[330px]"
    >
      {/* توهج خلفي */}
      <div className="pointer-events-none absolute inset-6 rounded-full bg-teal-400/15 blur-3xl" />

      {/* 1. البطاقة العلوية الخلفية السماوية (منصة عقار تك) */}
      <div className="absolute left-12 top-1 h-[148px] w-[155px] -rotate-[8deg] overflow-hidden rounded-[24px] border border-sky-200/90 bg-gradient-to-br from-[#bce3ff] to-[#dff3ff] p-2.5 shadow-md transition-transform duration-500 group-hover:-translate-y-1.5">
        <div className="text-center text-[9px] font-black text-sky-950">
          {isArabic ? 'منصة عقار تك' : 'AqarTech PropTech'}
        </div>
        <div className="mx-auto mt-1.5 h-[105px] w-[115px] overflow-hidden rounded-[16px] border-2 border-neutral-800 bg-white shadow-sm">
          <img
            src={aqarImg}
            alt="منصة عقار تك"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </div>

      {/* 2. البطاقة الرئيسية المربعة باللون الأخضر المائي الفاتح وتضم شاشات (بالس جيم + كابتن فيت) */}
      <div className="absolute bottom-3 left-3 z-10 h-[222px] w-[238px] -rotate-[9deg] overflow-hidden rounded-[28px] border border-teal-200/80 bg-gradient-to-br from-[#bfe6df] via-[#d8f3ee] to-[#f0faf8] p-3.5 shadow-[0_25px_55px_rgba(20,184,166,0.18)] transition-transform duration-500 group-hover:-rotate-[6deg] dark:border-teal-500/20 dark:from-teal-950/85 dark:via-teal-900/65 dark:to-zinc-900">
        <div className="flex items-center justify-between px-1">
          <span className="text-xl font-black tracking-tight text-teal-800/35 dark:text-teal-300/30">
            Codexa Apps
          </span>
          <span className="rounded-full bg-teal-700/15 px-2 py-0.5 text-[8px] font-bold text-teal-900 dark:text-teal-200">
            {isArabic ? 'أنظمة وتطبيقات' : 'Web & Mobile'}
          </span>
        </div>

        <div className="mt-2 flex items-end justify-center gap-3">
          {/* شاشة يسار: سيستم بالس جيم */}
          <div className="flex h-[152px] w-[92px] -rotate-[7deg] flex-col overflow-hidden rounded-[16px] border-2 border-neutral-900 bg-neutral-950 p-1 shadow-lg transition-transform duration-500 group-hover:-translate-y-1.5">
            <div className="mx-auto my-0.5 h-1 w-6 rounded-full bg-white/30" />
            <div className="relative flex-1 overflow-hidden rounded-[10px]">
              <img
                src={pulseGymImg}
                alt="سيستم بالس جيم"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/75 py-1 text-center text-[7px] font-bold text-emerald-300">
                {isArabic ? 'سيستم بالس جيم' : 'Pulse Gym ERP'}
              </div>
            </div>
          </div>

          {/* شاشة يمين: تطبيق كابتن فيت */}
          <div className="flex h-[160px] w-[95px] rotate-[6deg] flex-col overflow-hidden rounded-[16px] border-2 border-neutral-900 bg-neutral-950 p-1 shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
            <div className="mx-auto my-0.5 h-1 w-6 rounded-full bg-white/30" />
            <div className="relative flex-1 overflow-hidden rounded-[10px]">
              <img
                src={captainFitImg}
                alt="تطبيق كابتن فيت"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/75 py-1 text-center text-[7px] font-bold text-white">
                {isArabic ? 'تطبيق كابتن فيت' : 'CaptainFit App'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export async function HeroSection({ locale, dict }: HeroSectionProps) {
  const { hero } = dict.home
  const isArabic = locale === 'ar'

  // استخدام الصورة المضغوطة بصيغة WebP مباشرة بدون انتظار استجابة الباك إند لضمان سرعة فورية على Vercel
  const hospitalImage =
    'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&fm=webp&w=360&q=70'

  return (
    <Section
      id="hero"
      noContainer
      className={cn(
        'relative overflow-hidden py-0',
        'bg-background text-[var(--figma-title-dark)] dark:text-white',
        'min-h-[calc(100svh-4.5rem)]',
      )}
    >
      {/* إضاءة خلفية ناعمة */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -start-32 top-20 size-[420px] rounded-full bg-[var(--figma-accent-sky)]/20 blur-[100px] dark:bg-[var(--figma-accent-sky)]/15" />
        <div className="absolute -end-24 bottom-10 size-[380px] rounded-full bg-[var(--figma-accent-purple)]/15 blur-[90px] dark:bg-[var(--figma-accent-purple)]/12" />
      </div>

      <Container wide className="relative flex min-h-[calc(100svh-4.5rem)] items-center py-8 sm:py-14 lg:py-20">
        {/* dir="ltr" للحفاظ على موقع الكولاج الأيسر والأيمن تماماً مثل تصميم فيجما */}
        <div
          dir="ltr"
          className="grid w-full items-center gap-6 lg:grid-cols-[1fr_1.45fr_1fr] lg:gap-4 xl:gap-8"
        >
          {/* الكولاج الأيسر (3 صور من مشاريعنا الحقيقية) */}
          <FadeIn direction="right" className="hidden lg:block">
            <LeftRealProjectsCollage locale={locale} isArabic={isArabic} />
          </FadeIn>

          {/* النص والأزرار في المنتصف */}
          <div
            dir={isArabic ? 'rtl' : 'ltr'}
            className="mx-auto max-w-2xl text-center lg:max-w-none"
          >
            <FadeIn direction="up" delay={0.05}>
              {isArabic ? (
                <h1 className="font-arabic text-[clamp(2.1rem,5.6vw,4.6rem)] font-black leading-[1.22] tracking-tight text-[#0d0b2c] dark:text-white">
                  <span className="block">بنبني علامات</span>
                  <span className="block">
                    <span className="text-[#4b3fdf] dark:text-[#8173ff]">يفتكرها</span> الناس
                  </span>
                </h1>
              ) : (
                <h1 className="text-balance text-[clamp(2rem,5.5vw,4.5rem)] font-black leading-[1.12] tracking-tight text-[#0d0b2c] dark:text-white">
                  {hero.title}
                </h1>
              )}
            </FadeIn>

            <FadeIn direction="up" delay={0.12}>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-xs leading-relaxed text-muted-foreground sm:mt-6 sm:text-base md:text-lg px-2 sm:px-0">
                {isArabic
                  ? 'من أول الفكرة لغاية الإطلاق وده يشمل هوية بصرية، مواقع إلكترونية، تطبيقات موبايل، وتسويق يخدم هدف واحد: نمو حقيقي لعلامتك التجارية.'
                  : hero.description}
              </p>
            </FadeIn>

            {/* أزرار الهيرو مطابقة لفيجما: زر "تواصل معنا" + زر "ليه Codexa؟" */}
            <FadeIn direction="up" delay={0.18}>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5 sm:mt-10 sm:gap-5">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex h-10 sm:h-12 items-center justify-center rounded-full bg-[#4b3fdf] px-7 sm:px-9 text-xs sm:text-sm font-bold text-white shadow-[0_14px_30px_-8px_rgba(75,63,223,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4135c9]"
                >
                  {isArabic ? 'تواصل معنا' : hero.cta}
                </Link>

                <a
                  href="#why-choose-us"
                  className="group inline-flex items-center gap-2 text-xs font-bold text-[#0d0b2c] transition-colors hover:text-[#4b3fdf] sm:text-sm dark:text-white dark:hover:text-indigo-400"
                >
                  <span className="flex size-8.5 sm:size-9 items-center justify-center rounded-full border border-[#4b3fdf]/30 bg-white text-[#4b3fdf] shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-[#4b3fdf] dark:border-white/20 dark:bg-white/5 dark:text-indigo-400">
                    {isArabic ? (
                      <ChevronLeft className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                  </span>
                  <span>{isArabic ? 'ليه Codexa؟' : 'Why Codexa?'}</span>
                </a>
              </div>
            </FadeIn>

            {/* عرض الكولاج على شاشات الهاتف بشكل متجاوب */}
            <FadeIn direction="up" delay={0.22} className="mt-6 lg:hidden">
              <div className="mx-auto flex justify-center">
                <RightRealProjectsCollage
                  locale={locale}
                  isArabic={isArabic}
                  hospitalImage={hospitalImage}
                />
              </div>
            </FadeIn>
          </div>

          {/* الكولاج الأيمن (4 صور من مشاريعنا الحقيقية) */}
          <FadeIn direction="left" className="hidden lg:block">
            <RightRealProjectsCollage
              locale={locale}
              isArabic={isArabic}
              hospitalImage={hospitalImage}
            />
          </FadeIn>
        </div>
      </Container>
    </Section>
  )
}