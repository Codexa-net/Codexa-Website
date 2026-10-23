'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ArrowUpLeft, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Project } from '@/types/project'
import { Container } from '@/components/shared/container'

interface ProjectShowcaseProps {
  projects: Project[]
  locale: Locale
}

function PortraitCard({
  title,
  tagline,
  themeClass,
  imageSrc,
  isAr,
  onImageError,
}: {
  title: string
  tagline: string
  themeClass: string
  imageSrc?: string
  isAr: boolean
  onImageError?: () => void
}) {
  return (
    <div
      className={cn(
        'group relative flex h-full w-full transform-gpu flex-col justify-between overflow-hidden rounded-[22px] bg-gradient-to-b p-4 text-white shadow-xl sm:rounded-[24px] sm:p-5',
        themeClass,
      )}
    >
      <div className="relative z-10 pt-1 text-center sm:pt-2" dir={isAr ? 'rtl' : 'ltr'}>
        <p className="line-clamp-1 text-base font-black tracking-tight text-white sm:text-2xl">
          {title}
        </p>
        <p className="mt-0.5 line-clamp-1 text-[10px] font-medium text-white/80 sm:mt-1 sm:text-[11px]">
          {tagline}
        </p>
      </div>

      <div className="relative z-10 mt-auto pt-2.5 sm:pt-4">
        <div className="relative mx-auto w-full overflow-hidden rounded-t-xl border-[2.5px] border-b-0 border-neutral-950 bg-neutral-900 shadow-xl sm:border-[3px]">
          <div className="flex h-3.5 items-center gap-1 border-b border-white/10 bg-neutral-950 px-2 sm:h-4">
            <span className="size-1.5 rounded-full bg-rose-400/80" />
            <span className="size-1.5 rounded-full bg-amber-400/80" />
            <span className="size-1.5 rounded-full bg-emerald-400/80" />
            <div className="mx-auto h-1 w-10 rounded-full bg-white/15" />
          </div>

          <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={title}
                loading="eager"
                decoding="async"
                onError={onImageError}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="space-y-2 p-3">
                <div className="h-2 w-2/3 rounded-full bg-indigo-400/40" />
                <div className="rounded-lg bg-white/10 p-2">
                  <div className="h-1.5 w-1/2 rounded bg-indigo-400/30" />
                  <div className="mt-1 h-1 w-4/5 rounded bg-white/15" />
                </div>
              </div>
            )}

            <span className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-[#5745e7] text-white shadow-md ring-2 ring-white/25 sm:size-8">
              {isAr ? <ArrowUpLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
            </span>
          </div>
        </div>
        <div className="mx-auto h-1.5 w-[104%] -translate-x-[2%] rounded-b-lg bg-neutral-800 sm:h-2" />
      </div>
    </div>
  )
}

export function ProjectShowcase({ projects, locale }: ProjectShowcaseProps) {
  const isAr = locale === 'ar'
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const touchStartX = useRef<number | null>(null)

  const total = projects.length

  const nextSlide = useCallback(() => {
    if (total <= 1) return
    setActiveIndex((prev) => (prev + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    if (total <= 1) return
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // تقليب تلقائي كل 3.8 ثانية يتوقف مؤقتاً عند لمس الكارت أو الوقوف عليه بالماوس
  useEffect(() => {
    if (isPaused || total <= 1) return
    const timer = setInterval(nextSlide, 3800)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide, total])

  if (total === 0) return null

  const project = projects[activeIndex] || projects[0]
  const displayTitle = project.title[locale] || project.watermark || project.title.en
  const description = project.description[locale]
  const themeClass = project.themeClass ?? 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]'
  const year = project.year ?? '2026'
  const services = project.services?.[locale] ?? 'UX Research · UI Design · Development'
  const pills = project.pills ?? []
  const glowColor = project.glowColor ?? '#4f46e5'
  const imageSrc = typeof project.image === 'string' ? project.image.trim() : ''
  const hasValidImage =
    imageSrc.length > 0 &&
    !imageSrc.startsWith('/images/') &&
    !failedImages[String(project.id)]

  const currentFormatted = String(activeIndex + 1).padStart(2, '0')
  const totalFormatted = String(total).padStart(2, '0')

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide()
        else prevSlide()
      }
    }
    touchStartX.current = null
    setTimeout(() => setIsPaused(false), 2000)
  }

  return (
    <section className="py-8 sm:py-14">
      <Container>
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative flex flex-col overflow-hidden rounded-2xl border border-dashed border-border/80 bg-white shadow-sm sm:rounded-3xl dark:bg-[#0d0b1f]"
        >
          {/* الشريط العلوي: العداد 01 / 07 وأزرار التنقل السريع + رابط أعمالنا */}
          <div
            className="flex items-center justify-between px-4 pb-3 pt-3.5 sm:px-8 sm:pb-4 sm:pt-5"
            style={{ direction: 'ltr' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-mono text-xs font-extrabold sm:text-sm">
                <span className="text-[#4b3fdf] dark:text-[#8173ff]">{currentFormatted}</span>
                <span className="text-muted-foreground/60">/ {totalFormatted}</span>
              </div>

              {/* أزرار تقليب سريعة */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous project"
                  className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background text-foreground transition-colors hover:border-[#4b3fdf] hover:text-[#4b3fdf]"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next project"
                  className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background text-foreground transition-colors hover:border-[#4b3fdf] hover:text-[#4b3fdf]"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>

            {/* نقاط تقدم المشاريع الـ 7 */}
            <div className="hidden items-center gap-1.5 sm:flex">
              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Project ${idx + 1}`}
                  className={cn(
                    'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                    idx === activeIndex
                      ? 'w-6 bg-[#4b3fdf] dark:bg-[#8173ff]'
                      : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50',
                  )}
                />
              ))}
            </div>

            <Link
              href={`/${locale}/our-work`}
              className="inline-flex items-center gap-1.5 rounded-sm text-xs font-bold text-foreground transition-colors hover:text-[#4b3fdf]"
              style={{ direction: isAr ? 'rtl' : 'ltr' }}
            >
              <span className="size-1.5 shrink-0 rounded-full bg-[#4b3fdf]" />
              {isAr ? 'أعمالنا' : 'Our Work'}
            </Link>
          </div>

          <div className="mx-4 border-t border-dashed border-border/60 sm:mx-8" />

          {/* محتوى المشروع المتغير بنعومة فائقة وبدون أي تداخل نصوص */}
          <AnimatePresence mode="wait">
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: isAr ? -18 : 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isAr ? 18 : -18 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              dir="ltr"
              className="flex w-full flex-col-reverse items-center gap-5 px-4 pt-4 pb-2 sm:gap-10 sm:px-10 sm:pt-8 lg:flex-row lg:justify-between lg:gap-16 lg:px-20"
            >
              {/* البوستر العمودي */}
              <Link
                href={`/${locale}/our-work`}
                className="mx-auto block w-full max-w-[180px] shrink-0 transition-transform duration-300 hover:-translate-y-1 sm:max-w-[250px] lg:mx-0 lg:w-[265px]"
                style={{ aspectRatio: '3/3.55' }}
              >
                <PortraitCard
                  title={displayTitle}
                  tagline={
                    project.category?.[locale] ||
                    (isAr ? 'حلول رقمية متكاملة' : 'Digital Solutions')
                  }
                  themeClass={themeClass}
                  imageSrc={hasValidImage ? imageSrc : undefined}
                  isAr={isAr}
                  onImageError={() =>
                    setFailedImages((prev) => ({ ...prev, [String(project.id)]: true }))
                  }
                />
              </Link>

              {/* تفاصيل المشروع */}
              <div
                className="flex w-full flex-1 flex-col justify-center"
                style={{ direction: isAr ? 'rtl' : 'ltr' }}
              >
                <h3 className="text-xl font-black leading-snug tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {displayTitle}
                </h3>

                <p className="mt-2 line-clamp-3 max-w-lg text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:line-clamp-none sm:text-base">
                  {description}
                </p>

                <div className="mt-3.5 flex flex-wrap items-start gap-5 text-xs sm:mt-7 sm:gap-10 sm:text-sm">
                  <div className="shrink-0">
                    <span className="block text-[10px] font-semibold text-muted-foreground/60 sm:text-[11px]">
                      {isAr ? 'السنة' : 'Year'}
                    </span>
                    <span className="mt-0.5 block font-bold text-foreground">{year}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold text-muted-foreground/60 sm:text-[11px]">
                      {isAr ? 'الخدمات والتقنيات' : 'Services & Stack'}
                    </span>
                    <span
                      className="mt-0.5 block font-semibold leading-relaxed text-foreground"
                      dir="ltr"
                      style={{ textAlign: isAr ? 'right' : 'left' }}
                    >
                      {services}
                    </span>
                  </div>
                </div>

                {pills.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
                    {pills.map((pill, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-border bg-background px-3 py-0.5 text-[10px] font-medium text-foreground sm:px-4 sm:py-1.5 sm:text-xs"
                      >
                        {pill[locale]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* نقاط التنقل على الموبايل */}
          <div className="mt-3 flex items-center justify-center gap-1.5 sm:hidden" dir="ltr">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Project ${idx + 1}`}
                className={cn(
                  'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                  idx === activeIndex
                    ? 'w-5 bg-[#4b3fdf] dark:bg-[#8173ff]'
                    : 'w-1.5 bg-muted-foreground/30',
                )}
              />
            ))}
          </div>

          {/* العلامة المائية السفلية مع التوهج */}
          <div className="relative mt-2 flex items-end justify-center overflow-hidden px-2 pb-1 pt-3 sm:mt-6 sm:pt-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-14 sm:h-28"
              style={{
                background: `radial-gradient(ellipse 60% 100% at 50% 100%, ${glowColor}38 0%, transparent 75%)`,
              }}
            />
            <p
              aria-hidden="true"
              className="relative max-w-full truncate text-center font-black leading-none tracking-tight select-none"
              style={{
                fontSize: 'clamp(1.65rem, 6.5vw, 6rem)',
                color: `${glowColor}20`,
              }}
            >
              {displayTitle}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}