'use client'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { Reveal } from '@/components/shared/motion/reveal'
import {
  StickyScroll,
  StickyScrollContent,
} from '@/components/shared/motion/sticky-scroll'

interface WhyChooseUsSectionProps {
  dict: Dictionary
}

const STEP_COLORS = [
  { from: '#191654', to: '#0d0b2b' },
  { from: '#1e1b4b', to: '#12102e' },
  { from: '#2a1752', to: '#140b29' },
  { from: '#31174b', to: '#190b28' },
  { from: '#172b52', to: '#0b1529' },
] as const

const FIGMA_STEP_META = [
  {
    bilingualEyebrowAr: 'UNDERSTANDING — الفهم',
    bilingualEyebrowEn: '01 — UNDERSTANDING',
    shortAr: 'الفهم',
    shortEn: 'Understanding',
    overrideTitleAr: null,
    keywordsAr: ['بحث', 'تحليل', 'إنصات'],
    keywordsEn: ['Research', 'Analysis', 'Listening'],
  },
  {
    bilingualEyebrowAr: 'ARCHITECTURE — التخطيط',
    bilingualEyebrowEn: '02 — ARCHITECTURE',
    shortAr: 'المنطق',
    shortEn: 'Logic',
    overrideTitleAr: null,
    keywordsAr: ['هيكلة', 'رحلة المستخدم', 'خطة واضحة'],
    keywordsEn: ['User Flow', 'Wireframes', 'Strategy'],
  },
  {
    bilingualEyebrowAr: 'CRAFT & UI/UX — التصميم',
    bilingualEyebrowEn: '03 — CRAFT & UI/UX',
    shortAr: 'الفكرة',
    shortEn: 'The Idea',
    overrideTitleAr: null,
    keywordsAr: ['هوية بصرية', 'واجهات تفاعلية', 'تجربة سلسة'],
    keywordsEn: ['Visual Identity', 'Interactive UI', 'Seamless UX'],
  },
  {
    bilingualEyebrowAr: 'ENGINEERING — التطوير والبرمجة',
    bilingualEyebrowEn: '04 — ENGINEERING',
    shortAr: 'التنفيذ',
    shortEn: 'Execution',
    overrideTitleAr: 'من تصميم ثابت، لمنتج حقيقي يعيش.',
    keywordsAr: ['كود نظيف', 'سرعة فائقة', 'أمان عالي'],
    keywordsEn: ['Clean Code', 'High Speed', 'Security'],
  },
  {
    bilingualEyebrowAr: 'LAUNCH & SCALE — الإطلاق والنمو',
    bilingualEyebrowEn: '05 — LAUNCH & SCALE',
    shortAr: 'الإطلاق',
    shortEn: 'Launch',
    overrideTitleAr: null,
    keywordsAr: ['اختبار شامل', 'إطلاق', 'دعم مستمر'],
    keywordsEn: ['QA Testing', 'Deployment', 'Ongoing Support'],
  },
] as const

export function WhyChooseUsSection({ dict }: WhyChooseUsSectionProps) {
  const { whyChooseUs } = dict.home
  const items = whyChooseUs.items

  if (items.length === 0) return null

  const isArabic = /[\u0600-\u06FF]/.test(whyChooseUs.intro.line1)

  return (
    <div id="why-choose-us" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* ── القسم التمهيدي ── */}
      <Section noContainer className="bg-white py-16 sm:py-28 lg:py-36 dark:bg-[#0d0b1f]">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold tracking-wide text-[#687082] sm:text-sm dark:text-gray-400">
                {isArabic ? 'ليه تختارنا؟' : whyChooseUs.title || 'Why Choose Us?'}
              </p>

              <p className="mt-4 text-xl font-medium leading-[1.4] tracking-tight text-[#11102f] sm:mt-6 sm:text-4xl lg:text-[2.75rem] dark:text-white/90">
                {whyChooseUs.intro.line1}
              </p>

              <p className="mt-2 text-xl font-black leading-[1.35] tracking-tight text-[#11102f] sm:mt-3 sm:text-4xl lg:text-[2.85rem] dark:text-white">
                {whyChooseUs.intro.line2}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── خطوات العمل الـ 5 التفاعلية ── */}
      <StickyScroll itemCount={items.length} ariaLabel={whyChooseUs.title}>
        {(activeIndex) => {
          const item = items[activeIndex]
          const stepNumber = String(activeIndex + 1).padStart(2, '0')
          const colors = STEP_COLORS[activeIndex % STEP_COLORS.length]
          const meta = FIGMA_STEP_META[activeIndex % FIGMA_STEP_META.length]
          const keywords = isArabic ? meta.keywordsAr : meta.keywordsEn
          const displayHeadline =
            isArabic && meta.overrideTitleAr ? meta.overrideTitleAr : item.title

          return (
            <div
              dir={isArabic ? 'rtl' : 'ltr'}
              className="relative flex h-full w-full flex-col justify-between overflow-hidden px-5 py-6 text-white sm:px-10 sm:py-8 lg:block lg:p-0"
            >
              {/* الخلفية المتدرجة */}
              <motion.div
                key={`bg-${activeIndex}`}
                className="absolute inset-0"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{
                  background: `radial-gradient(circle at 50% 35%, #262170 0%, ${colors.from} 45%, ${colors.to} 100%)`,
                }}
              />

              {/*
                1. قائمة الـ 5 خطوات:
                - في الموبايل: صف علوي مستقل في البداية (يمين بالعربي، شمال بالإنجليزي) بعيد تماماً عن العنوان.
                - في اللابتوب: ثابتة في منتصف الجانب (يمين بالعربي، شمال بالإنجليزي).
              */}
              <nav
                aria-label="Process steps"
                dir={isArabic ? 'rtl' : 'ltr'}
                className={cn(
                  'relative z-20 flex shrink-0 flex-col gap-1 self-start sm:gap-1.5 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:gap-3.5',
                  isArabic
                    ? 'items-start text-right lg:right-12'
                    : 'items-start text-left lg:left-12',
                )}
              >
                {items.map((step, index) => {
                  const fallbackLabel = isArabic
                    ? FIGMA_STEP_META[index]?.shortAr
                    : FIGMA_STEP_META[index]?.shortEn
                  const label = step.shortLabel || fallbackLabel || step.title
                  const isCurrent = index === activeIndex

                  return (
                    <span
                      key={step.title}
                      className={cn(
                        'whitespace-nowrap text-[11px] font-bold leading-snug transition-all duration-300 sm:text-xs',
                        isCurrent
                          ? 'scale-105 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                          : 'text-white/30',
                      )}
                    >
                      {label}
                    </span>
                  )
                })}
              </nav>

              {/* 2. المحتوى المركزي واخد صف مستقل بعرض الشاشة بالكامل على الموبايل بدون أي تصادم */}
              <div className="relative z-10 my-auto flex w-full items-center justify-center py-2 lg:my-0 lg:h-full lg:px-48">
                <StickyScrollContent
                  activeIndex={activeIndex}
                  className="mx-auto w-full max-w-3xl px-2 text-center"
                >
                  <p
                    dir="ltr"
                    className="text-[11px] font-semibold tracking-widest text-white/60 uppercase sm:text-sm"
                  >
                    {isArabic ? meta.bilingualEyebrowAr : meta.bilingualEyebrowEn}
                  </p>

                  <h2
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className="mt-2.5 text-2xl font-black leading-[1.22] tracking-tight text-white sm:mt-5 sm:text-5xl md:text-6xl lg:text-[3.85rem]"
                  >
                    {displayHeadline}
                  </h2>

                  <p
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-white/70 sm:mt-6 sm:text-lg md:text-xl"
                  >
                    {item.description}
                  </p>

                  <div
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-white/60 sm:mt-9 sm:gap-4 sm:text-sm"
                  >
                    {keywords.map((word, idx) => (
                      <span key={word} className="inline-flex items-center gap-3 sm:gap-4">
                        <span>{word}</span>
                        {idx < keywords.length - 1 && (
                          <span aria-hidden="true" className="text-white/30">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </StickyScrollContent>
              </div>

              {/* 3. الرقم المفرغ الكبير (01 - 05): صف سفلي مستقل في الجهة المقابلة (شمال بالعربي، يمين بالإنجليزي) */}
              <div
                aria-hidden="true"
                dir="ltr"
                className={cn(
                  'pointer-events-none relative z-0 shrink-0 self-end select-none lg:absolute lg:bottom-8',
                  isArabic ? 'lg:left-12' : 'lg:right-12',
                )}
              >
                <span
                  style={{
                    fontSize: 'clamp(3.75rem, 15vw, 12.5rem)',
                    fontWeight: 800,
                    lineHeight: 0.9,
                    color: 'transparent',
                    WebkitTextStroke: '1.5px rgba(255,255,255,0.14)',
                  }}
                >
                  {stepNumber}
                </span>
              </div>
            </div>
          )
        }}
      </StickyScroll>
    </div>
  )
}