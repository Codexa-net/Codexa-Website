'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Project } from '@/types/project'

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
        'group relative flex h-full w-full transform-gpu flex-col justify-between overflow-hidden rounded-[22px] bg-gradient-to-b px-5 pt-5 pb-4 text-white shadow-[0_24px_60px_-15px_rgba(75,63,223,0.4)] sm:rounded-[24px] sm:px-6 sm:pt-6 sm:pb-5',
        themeClass,
      )}
    >
      <div className="pointer-events-none absolute -top-10 left-1/2 size-40 -translate-x-1/2 rounded-full bg-white/15 blur-2xl" />

      <div className="relative z-10 pt-1 text-center" dir={isAr ? 'rtl' : 'ltr'}>
        <p className="line-clamp-1 text-lg font-black tracking-tight text-white sm:text-2xl">
          {title}
        </p>
        <p className="mt-1 line-clamp-1 text-[10px] font-medium text-white/80 sm:text-[11px]">
          {tagline}
        </p>
      </div>

      <div className="relative z-10 mt-auto pt-3 sm:pt-4">
        <div className="relative mx-auto w-[92%] overflow-hidden rounded-t-xl border-[2.5px] border-b-0 border-neutral-950 bg-neutral-900 shadow-2xl sm:border-[3px]">
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

            <span className="absolute bottom-2 right-2 flex size-6.5 items-center justify-center rounded-full bg-[#5745e7] text-white shadow-lg ring-2 ring-white/25 transition-transform duration-300 group-hover:scale-110 sm:size-7.5">
              {isAr ? <ArrowUpLeft className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
            </span>
          </div>
        </div>
        <div className="mx-auto h-1.5 w-[96%] rounded-b-lg bg-neutral-800 shadow-md sm:h-2" />
      </div>
    </div>
  )
}

export function ProjectShowcase({ projects, locale }: ProjectShowcaseProps) {
  const isAr = locale === 'ar'
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const sectionRef = useRef<HTMLDivElement>(null)

  const total = projects.length

  useEffect(() => {
    projects.forEach((p) => {
      if (typeof p.image === 'string' && p.image.trim()) {
        const img = new window.Image()
        img.src = p.image.trim()
      }
    })
  }, [projects])

  useEffect(() => {
    if (total <= 1) return
    let rafId: number | null = null

    const updateOnScroll = () => {
      rafId = null
      const el = sectionRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const scrollableDistance = rect.height - viewportHeight

      if (scrollableDistance <= 0) return

      const rawProgress = -rect.top / scrollableDistance
      const clamped = Math.max(0, Math.min(0.9999, rawProgress))
      const nextIdx = Math.floor(clamped * total)

      setActiveIndex((prev) => (prev !== nextIdx ? nextIdx : prev))
    }

    const onScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateOnScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateOnScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId !== null) window.cancelAnimationFrame(rafId)
    }
  }, [total])

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

  return (
    <div
      ref={sectionRef}
      className="relative mt-8 w-full bg-background sm:mt-12 lg:mt-14"
      style={{ height: `calc(100svh + ${(total - 1) * 65}svh)` }}
    >
      {/* إطار الشاشة بنفس أبعاد وتباعد فيجما (Top/Bottom 48px, Left/Right 77px) */}
      <div className="sticky top-[64px] flex h-[calc(100svh-64px)] w-full flex-col justify-between overflow-hidden bg-background px-5 pt-5 pb-3 sm:top-[72px] sm:h-[calc(100svh-72px)] sm:px-10 sm:pt-9 sm:pb-6 lg:px-[77px] lg:pt-11 lg:pb-8">
        {/* 1. الشريط العلوي بدون خط فاصل تحته تماماً مثل فيجما */}
        <div
          className="mx-auto flex w-full max-w-[1440px] shrink-0 items-center justify-between"
          style={{ direction: 'ltr' }}
        >
          <div className="flex items-center gap-1 font-mono text-xs font-extrabold">
            <span className="text-[#4b3fdf] dark:text-[#8173ff]">{currentFormatted}</span>
            <span className="text-muted-foreground/50">/ {totalFormatted}</span>
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

        {/* 2. المحتوى الأوسط متمركز للداخل بتباعد متوازن بين البوستر والنص مثل فيجما */}
        <div className="mx-auto my-auto w-full max-w-[960px] xl:max-w-[1020px]">
          <motion.div
            key={project.id}
            initial={{ opacity: 0.25, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            dir="ltr"
            className="flex w-full transform-gpu flex-col-reverse items-center gap-4 sm:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-20 xl:gap-28"
          >
            {/* البوستر على اليسار */}
            <Link
              href={`/${locale}/our-work`}
              className="mx-auto block w-full max-w-[170px] shrink-0 transition-transform duration-300 hover:-translate-y-1 sm:max-w-[235px] lg:mx-0 lg:w-[275px] xl:w-[295px]"
              style={{ aspectRatio: '3/3.75' }}
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

            {/* تفاصيل المشروع على اليمين بحجم متناسق وغير مترامي الأطراف */}
            <div
              className="flex w-full max-w-[420px] flex-col justify-center"
              style={{ direction: isAr ? 'rtl' : 'ltr' }}
            >
              <h3 className="text-xl font-black leading-snug tracking-tight text-foreground sm:text-3xl lg:text-[2.15rem]">
                {displayTitle}
              </h3>

              <p className="mt-2 line-clamp-3 text-[11px] leading-[1.8] text-muted-foreground sm:mt-3 sm:line-clamp-none sm:text-[13.5px]">
                {description}
              </p>

              {/* الخدمات والسنة بنفس ترتيب وتباعد فيجما */}
              <div className="mt-4 flex flex-wrap items-start justify-between gap-6 text-[11px] sm:mt-6 sm:justify-start sm:gap-12 sm:text-xs">
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-muted-foreground/60 sm:text-[11px]">
                    {isAr ? 'الخدمات والتقنيات' : 'Services & Stack'}
                  </span>
                  <span
                    className="mt-1 block font-semibold leading-relaxed text-foreground"
                    dir="ltr"
                    style={{ textAlign: isAr ? 'right' : 'left' }}
                  >
                    {services}
                  </span>
                </div>

                <div className="shrink-0">
                  <span className="block text-[10px] font-semibold text-muted-foreground/60 sm:text-[11px]">
                    {isAr ? 'السنة' : 'Year'}
                  </span>
                  <span className="mt-1 block font-bold text-foreground">{year}</span>
                </div>
              </div>

              {pills.length > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                  {pills.map((pill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-border/80 bg-background px-3 py-1 text-[10px] font-medium text-foreground sm:px-3.5 sm:text-[11px]"
                    >
                      {pill[locale]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 3. العلامة المائية والتوهج السفلي ظاهران بالكامل في أسفل المنتصف مثل فيجما */}
        <div className="relative flex w-full shrink-0 items-end justify-center pt-2">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-6 mx-auto h-24 w-full max-w-xl sm:h-32"
            style={{
              background: `radial-gradient(ellipse 55% 90% at 50% 85%, ${glowColor}2e 0%, transparent 75%)`,
            }}
          />
          <p
            aria-hidden="true"
            className="relative max-w-full truncate px-4 text-center font-black leading-none tracking-tight select-none"
            style={{
              fontSize: 'clamp(1.85rem, 5.5vw, 4.75rem)',
              color: `${glowColor}1a`,
            }}
          >
            {displayTitle}
          </p>
        </div>
      </div>
    </div>
  )
}