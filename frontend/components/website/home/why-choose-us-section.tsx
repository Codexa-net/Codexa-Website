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
    keywordsAr: ['بحث', 'تحليل', 'إنصات'],
    keywordsEn: ['Research', 'Analysis', 'Listening'],
  },
  {
    bilingualEyebrowAr: 'ARCHITECTURE — التخطيط',
    bilingualEyebrowEn: '02 — ARCHITECTURE',
    shortAr: 'المنطق',
    shortEn: 'Logic',
    keywordsAr: ['هيكلة', 'رحلة المستخدم', 'خطة واضحة'],
    keywordsEn: ['User Flow', 'Wireframes', 'Strategy'],
  },
  {
    bilingualEyebrowAr: 'CRAFT & UI/UX — التصميم',
    bilingualEyebrowEn: '03 — CRAFT & UI/UX',
    shortAr: 'الفكرة',
    shortEn: 'The Idea',
    keywordsAr: ['هوية بصرية', 'واجهات تفاعلية', 'تجربة سلسة'],
    keywordsEn: ['Visual Identity', 'Interactive UI', 'Seamless UX'],
  },
  {
    bilingualEyebrowAr: 'ENGINEERING — التطوير والبرمجة',
    bilingualEyebrowEn: '04 — ENGINEERING',
    shortAr: 'التنفيذ',
    shortEn: 'Execution',
    keywordsAr: ['كود نظيف', 'سرعة فائقة', 'أمان عالي'],
    keywordsEn: ['Clean Code', 'High Speed', 'Security'],
  },
  {
    bilingualEyebrowAr: 'LAUNCH & SCALE — الإطلاق والنمو',
    bilingualEyebrowEn: '05 — LAUNCH & SCALE',
    shortAr: 'الإطلاق',
    shortEn: 'Launch',
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
      {/* ── القسم التمهيدي الأبيض ── */}
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

          return (
            <div
              dir={isArabic ? 'rtl' : 'ltr'}
              className="relative h-full w-full overflow-hidden text-white"
            >
              {/* الخلفية المتدرجة */}
              <motion.div
                key={`bg-${activeIndex}`}
                className="absolute inset-0"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                style={{
                  background: `radial-gradient(circle at 50% 35%, #262170 0%, ${colors.from} 45%, ${colors.to} 100%)`,
                }}
              />

              {/* الرقم المفرغ الكبير (01 - 05): في العربي على اليسار، وفي الإنجليزي على اليمين */}
              <span
                aria-hidden="true"
                dir="ltr"
                className={cn(
                  'pointer-events-none absolute bottom-4 z-0 select-none sm:bottom-8',
                  isArabic ? 'left-4 sm:left-10' : 'right-4 sm:right-10',
                )}
                style={{
                  fontSize: 'clamp(4.75rem, 18vw, 13.5rem)',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.14)',
                }}
              >
                {stepNumber}
              </span>

              {/* القائمة الجانبية للخطوات الـ 5: ظاهرة على الموبايل واللابتوب (يمين في العربي، يسار في الإنجليزي) */}
              <nav
                aria-label="Process steps"
                dir={isArabic ? 'rtl' : 'ltr'}
                className={cn(
                  'absolute top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 sm:gap-3.5',
                  isArabic
                    ? 'right-2.5 items-end text-right sm:right-6 lg:right-10'
                    : 'left-2.5 items-start text-left sm:left-6 lg:left-10',
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
                        'max-w-[90px] truncate text-[10px] font-bold transition-all duration-300 sm:max-w-[140px] sm:text-xs',
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

              {/* المحتوى المركزي في المنتصف مع ترك مسافة جانبية للقائمة على الموبايل */}
              <div className="relative z-10 flex h-full items-center justify-center">
                <StickyScrollContent
                  activeIndex={activeIndex}
                  className={cn(
                    'mx-auto max-w-3xl text-center',
                    isArabic
                      ? 'pl-4 pr-16 sm:px-16'
                      : 'pl-16 pr-4 sm:px-16',
                  )}
                >
                  {/* العنوان العلوي الثنائي اللغة */}
                  <p
                    dir="ltr"
                    className="text-[10px] font-semibold tracking-widest text-white/60 uppercase sm:text-sm"
                  >
                    {isArabic ? meta.bilingualEyebrowAr : meta.bilingualEyebrowEn}
                  </p>

                  {/* العنوان الرئيسي باتجاه اللغة الصحيح */}
                  <h2
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className="mt-3 text-2xl font-black leading-[1.22] tracking-tight text-white sm:mt-6 sm:text-5xl md:text-6xl lg:text-[4rem]"
                  >
                    {item.title}
                  </h2>

                  {/* الوصف باتجاه اللغة الصحيح لمنع انقلاب النقطة في الإنجليزي */}
                  <p
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-white/70 sm:mt-7 sm:text-lg md:text-xl"
                  >
                    {item.description}
                  </p>

                  {/* الكلمات المفتاحية الثلاث */}
                  <div
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-semibold text-white/60 sm:mt-10 sm:gap-4 sm:text-sm"
                  >
                    {keywords.map((word, idx) => (
                      <span key={word} className="inline-flex items-center gap-2.5 sm:gap-4">
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
            </div>
          )
        }}
      </StickyScroll>
    </div>
  )
}