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

// بيانات فيجما الإضافية لكل خطوة (العنوان الثنائي العلوي + الكلمات المفتاحية الثلاث بالأسفل)
const FIGMA_STEP_META = [
  {
    bilingualEyebrowAr: 'UNDERSTANDING — الفهم',
    bilingualEyebrowEn: '01 — UNDERSTANDING',
    keywordsAr: ['بحث', 'تحليل', 'إنصات'],
    keywordsEn: ['Research', 'Analysis', 'Listening'],
  },
  {
    bilingualEyebrowAr: 'ARCHITECTURE — التخطيط',
    bilingualEyebrowEn: '02 — ARCHITECTURE',
    keywordsAr: ['هيكلة', 'رحلة المستخدم', 'خطة واضحة'],
    keywordsEn: ['User Flow', 'Wireframes', 'Strategy'],
  },
  {
    bilingualEyebrowAr: 'CRAFT & UI/UX — التصميم',
    bilingualEyebrowEn: '03 — CRAFT & UI/UX',
    keywordsAr: ['هوية بصرية', 'واجهات تفاعلية', 'تجربة سلسة'],
    keywordsEn: ['Visual Identity', 'Interactive UI', 'Seamless UX'],
  },
  {
    bilingualEyebrowAr: 'ENGINEERING — التطوير والبرمجة',
    bilingualEyebrowEn: '04 — ENGINEERING',
    keywordsAr: ['كود نظيف', 'سرعة فائقة', 'أمان عالي'],
    keywordsEn: ['Clean Code', 'High Speed', 'Security'],
  },
  {
    bilingualEyebrowAr: 'LAUNCH & SCALE — الإطلاق والنمو',
    bilingualEyebrowEn: '05 — LAUNCH & SCALE',
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
    <div id="why-choose-us">
      {/* ── القسم التمهيدي الأبيض (مطابق لفيجما بدون إطار منقط) ── */}
      <Section noContainer className="bg-white py-20 sm:py-28 lg:py-36 dark:bg-[#0d0b1f]">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold tracking-wide text-[#687082] sm:text-sm dark:text-gray-400">
                {isArabic ? 'ليه تختارنا؟' : whyChooseUs.title || 'Why Choose Us?'}
              </p>

              <p className="mt-5 text-2xl font-medium leading-[1.4] tracking-tight text-[#11102f] sm:mt-6 sm:text-4xl lg:text-[2.75rem] dark:text-white/90">
                {whyChooseUs.intro.line1}
              </p>

              <p className="mt-2 text-2xl font-black leading-[1.35] tracking-tight text-[#11102f] sm:mt-3 sm:text-4xl lg:text-[2.85rem] dark:text-white">
                {whyChooseUs.intro.line2}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── خطوات العمل التفاعلية بالخلفية الكحلية (مطابقة لفيجما 100%) ── */}
      <StickyScroll itemCount={items.length} ariaLabel={whyChooseUs.title}>
        {(activeIndex) => {
          const item = items[activeIndex]
          const stepNumber = String(activeIndex + 1).padStart(2, '0')
          const colors = STEP_COLORS[activeIndex % STEP_COLORS.length]
          const meta = FIGMA_STEP_META[activeIndex % FIGMA_STEP_META.length]
          const keywords = isArabic ? meta.keywordsAr : meta.keywordsEn

          return (
            <div className="relative h-full w-full overflow-hidden text-white">
              {/* الخلفية المتدرجة */}
              <motion.div
                key={`bg-${activeIndex}`}
                className="absolute inset-0"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{
                  background: `radial-gradient(circle at 50% 35%, #262170 0%, ${colors.from} 45%, ${colors.to} 100%)`,
                }}
              />

              {/* الرقم المفرغ الكبير في الأسفل */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 end-5 z-0 select-none sm:bottom-8 sm:end-10"
                style={{
                  fontSize: 'clamp(5.5rem, 20vw, 14rem)',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.12)',
                }}
              >
                {stepNumber}
              </span>

              {/* القائمة الجانبية للخطوات على الشاشات الكبيرة */}
              <nav
                aria-label="Process steps"
                className="absolute start-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3.5 sm:start-10 lg:flex"
              >
                {items.map((step, index) => (
                  <span
                    key={step.title}
                    className={cn(
                      'max-w-[130px] truncate text-start text-xs font-semibold transition-all duration-400',
                      index === activeIndex
                        ? 'scale-105 text-white'
                        : 'text-white/30',
                    )}
                  >
                    {step.shortLabel ?? step.title}
                  </span>
                ))}
              </nav>

              {/* المحتوى المركزي في المنتصف مطابق لفيجما */}
              <div className="relative z-10 flex h-full items-center justify-center">
                <StickyScrollContent
                  activeIndex={activeIndex}
                  className="mx-auto max-w-4xl px-5 text-center sm:px-10"
                >
                  {/* العنوان العلوي الثنائي اللغة: UNDERSTANDING — الفهم */}
                  <p
                    dir="ltr"
                    className="text-xs font-semibold tracking-widest text-white/60 uppercase sm:text-sm"
                  >
                    {isArabic ? meta.bilingualEyebrowAr : meta.bilingualEyebrowEn}
                  </p>

                  {/* العنوان الرئيسي الضخم */}
                  <h2 className="mt-4 text-3xl font-black leading-[1.2] tracking-tight text-white sm:mt-6 sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                    {item.title}
                  </h2>

                  {/* الوصف */}
                  <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/65 sm:mt-7 sm:text-lg md:text-xl">
                    {item.description}
                  </p>

                  {/* الكلمات المفتاحية الثلاث في الأسفل: بحث · تحليل · إنصات */}
                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-white/55 sm:mt-10 sm:gap-4 sm:text-sm">
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
            </div>
          )
        }}
      </StickyScroll>
    </div>
  )
}