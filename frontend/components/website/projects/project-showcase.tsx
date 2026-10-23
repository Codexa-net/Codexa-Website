'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Project } from '@/types/project'

interface ProjectShowcaseProps {
  projects: Project[]
  locale: Locale
}

function PortraitCard({
  projects,
  activeIndex,
  locale,
  isAr,
  failedImages,
  onImageError,
}: {
  projects: Project[]
  activeIndex: number
  locale: Locale
  isAr: boolean
  failedImages: Record<string, boolean>
  onImageError: (id: string) => void
}) {
  const activeProject = projects[activeIndex] || projects[0]
  const title =
    activeProject.title[locale] || activeProject.watermark || activeProject.title.en
  const tagline =
    activeProject.category?.[locale] ||
    (isAr ? 'حلول رقمية متكاملة' : 'Digital Solutions')
  const themeClass =
    activeProject.themeClass ?? 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]'

  return (
    <div
      className={cn(
        'group relative flex h-full w-full transform-gpu flex-col justify-between overflow-hidden rounded-[22px] bg-gradient-to-b px-5 pt-5 pb-4 text-white shadow-[0_24px_60px_-15px_rgba(75,63,223,0.4)] transition-all duration-300 sm:rounded-[24px] sm:px-6 sm:pt-6 sm:pb-5',
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

          {/* الصور الـ 7 محمّلة مسبقاً وتتبادل بالـ opacity فقط بدون إعادة بناء الكارت لضمان سكرول خفيف جداً */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
            {projects.map((p, idx) => {
              const src = typeof p.image === 'string' ? p.image.trim() : ''
              const isValid =
                src.length > 0 &&
                !src.startsWith('/images/') &&
                !failedImages[String(p.id)]
              const isCurrent = idx === activeIndex

              if (!isValid) return null

              return (
                <img
                  key={p.id}
                  src={src}
                  alt={p.title[locale] || p.title.en}
                  loading="eager"
                  decoding="async"
                  onError={() => onImageError(String(p.id))}
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 group-hover:scale-105',
                    isCurrent ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none',
                  )}
                />
              )
            })}

            <span className="absolute bottom-2 right-2 z-20 flex size-6.5 items-center justify-center rounded-full bg-[#5745e7] text-white shadow-lg ring-2 ring-white/25 transition-transform duration-300 group-hover:scale-110 sm:size-7.5">
              {isAr ? (
                <ArrowUpLeft className="size-3.5" />
              ) : (
                <ArrowUpRight className="size-3.5" />
              )}
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
  const year = project.year ?? '2026'
  const services = project.services?.[locale] ?? 'UX Research · UI Design · Development'
  const pills = project.pills ?? []
  const glowColor = project.glowColor ?? '#4f46e5'

  const currentFormatted = String(activeIndex + 1).padStart(2, '0')
  const totalFormatted = String(total).padStart(2, '0')

  return (
    <section
      ref={sectionRef}
      // مسافة سكرول متزنة ومريحة: 40svh للمشروع الواحد على الموبايل و52svh على اللابتوب + خلفية شفافة تماماً بدون أي صندوق أو لون مختلف
      className="relative mt-6 h-[340svh] w-full bg-transparent sm:mt-10 lg:mt-12 lg:h-[412svh]"
    >
      <div className="sticky top-[64px] flex h-[calc(100svh-64px)] w-full flex-col justify-between overflow-hidden bg-transparent px-5 pt-4 pb-3 sm:top-[72px] sm:h-[calc(100svh-72px)] sm:px-10 sm:pt-8 sm:pb-6 lg:px-[77px] lg:pt-10 lg:pb-8">
        {/* 1. الشريط العلوي بدون أي إطار أو خط فاصل، مندمج بالكامل مع لون الصفحة */}
        <div
          className="mx-auto flex w-full max-w-[1440px] shrink-0 items-center justify-between"
          style={{ direction: 'ltr' }}
        >
          <div className="flex items-center gap-1 font-mono text-xs font-extrabold sm:text-sm">
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

        {/* 2. المحتوى الأوسط بنفس تباعد فيجما وبانتقال خفيف وسلس */}
        <div className="mx-auto my-auto w-full max-w-[960px] xl:max-w-[1020px]">
          <div
            dir="ltr"
            className="flex w-full transform-gpu flex-col-reverse items-center gap-4 sm:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-20 xl:gap-28"
          >
            {/* البوستر على اليسار */}
            <Link
              href={`/${locale}/our-work`}
              className="mx-auto block w-full max-w-[172px] shrink-0 transition-transform duration-300 hover:-translate-y-1 sm:max-w-[235px] lg:mx-0 lg:w-[275px] xl:w-[295px]"
              style={{ aspectRatio: '3/3.7' }}
            >
              <PortraitCard
                projects={projects}
                activeIndex={activeIndex}
                locale={locale}
                isAr={isAr}
                failedImages={failedImages}
                onImageError={(id) =>
                  setFailedImages((prev) => ({ ...prev, [id]: true }))
                }
              />
            </Link>

            {/* تفاصيل المشروع على اليمين */}
            <div
              key={project.id}
              className="animate-in fade-in duration-200 flex w-full max-w-[430px] flex-col justify-center"
              style={{ direction: isAr ? 'rtl' : 'ltr' }}
            >
              <h3 className="text-xl font-black leading-snug tracking-tight text-foreground sm:text-3xl lg:text-[2.2rem]">
                {displayTitle}
              </h3>

              <p className="mt-2 line-clamp-3 text-[11.5px] leading-[1.75] text-muted-foreground sm:mt-3 sm:line-clamp-none sm:text-[13.5px]">
                {description}
              </p>

              <div className="mt-3.5 flex flex-wrap items-start justify-between gap-6 text-[11px] sm:mt-6 sm:justify-start sm:gap-12 sm:text-xs">
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
                <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                  {pills.map((pill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-border/75 bg-transparent px-3 py-1 text-[10px] font-medium text-foreground sm:px-3.5 sm:text-[11px]"
                    >
                      {pill[locale]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. العلامة المائية والتوهج السفلي مندمجان مع نفس لون الشاشة */}
        <div className="relative flex w-full shrink-0 items-end justify-center pt-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-6 mx-auto h-20 w-full max-w-xl transition-all duration-300 sm:h-32"
            style={{
              background: `radial-gradient(ellipse 55% 90% at 50% 85%, ${glowColor}2c 0%, transparent 75%)`,
            }}
          />
          <p
            aria-hidden="true"
            className="relative max-w-full truncate px-4 text-center font-black leading-none tracking-tight select-none transition-colors duration-300"
            style={{
              fontSize: 'clamp(1.75rem, 5.5vw, 4.75rem)',
              color: `${glowColor}1a`,
            }}
          >
            {displayTitle}
          </p>
        </div>
      </div>
    </section>
  )
}