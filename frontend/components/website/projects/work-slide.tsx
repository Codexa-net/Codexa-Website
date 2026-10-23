'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Project } from '@/types/project'

interface WorkSlideProps {
  project: Project
  locale: Locale
  viewLabel: string
  currentIndex?: number
  totalCount?: number
  className?: string
}

function PortraitProjectCard({
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
        'group relative flex h-full w-full transform-gpu flex-col justify-between overflow-hidden rounded-[20px] bg-gradient-to-b p-3.5 text-white shadow-xl sm:rounded-[24px] sm:p-5',
        themeClass,
      )}
    >
      <div className="relative z-10 pt-1 text-center sm:pt-2" dir={isAr ? 'rtl' : 'ltr'}>
        <p className="line-clamp-1 text-sm font-black tracking-tight text-white sm:text-2xl">
          {title}
        </p>
        <p className="mt-0.5 line-clamp-1 text-[10px] font-medium text-white/80 sm:mt-1 sm:text-[11px]">
          {tagline}
        </p>
      </div>

      <div className="relative z-10 mt-auto pt-2 sm:pt-4">
        <div className="relative mx-auto w-full overflow-hidden rounded-t-xl border-[2px] border-b-0 border-neutral-950 bg-slate-900 shadow-lg sm:border-[3px]">
          <div className="flex h-3 items-center gap-1 border-b border-white/10 bg-neutral-950 px-2 sm:h-4">
            <span className="size-1.5 rounded-full bg-red-400/80" />
            <span className="size-1.5 rounded-full bg-amber-400/80" />
            <span className="size-1.5 rounded-full bg-green-400/80" />
            <div className="mx-auto h-1 w-8 rounded-full bg-white/15 sm:w-12" />
          </div>

          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={title}
                loading="lazy"
                decoding="async"
                onError={onImageError}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="space-y-2 p-2.5">
                <div className="h-2 w-2/3 rounded-full bg-indigo-400/40" />
                <div className="rounded-lg bg-white/10 p-2">
                  <div className="h-1.5 w-1/2 rounded bg-indigo-400/30" />
                  <div className="mt-1 h-1 w-4/5 rounded bg-white/15" />
                </div>
              </div>
            )}

            <span className="absolute bottom-1.5 right-1.5 flex size-6.5 items-center justify-center rounded-full bg-[#5745e7] text-white shadow-md ring-2 ring-white/25 sm:bottom-2 sm:right-2 sm:size-8">
              {isAr ? (
                <ArrowUpLeft className="size-3.5 sm:size-4" />
              ) : (
                <ArrowUpRight className="size-3.5 sm:size-4" />
              )}
            </span>
          </div>
        </div>

        <div className="mx-auto h-1.5 w-[104%] -translate-x-[2%] rounded-b-lg bg-neutral-800 sm:h-2" />
      </div>
    </div>
  )
}

export function WorkSlide({
  project,
  locale,
  viewLabel: _viewLabel,
  currentIndex = 0,
  totalCount = 7,
  className,
}: WorkSlideProps) {
  const isAr = locale === 'ar'
  const [imgFailed, setImgFailed] = useState(false)

  const displayTitle = project.title[locale] || project.watermark || project.title.en
  const watermarkText = project.title[locale] || project.watermark || project.title.en
  const description = project.description[locale]
  const themeClass = project.themeClass ?? 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]'

  const rawImage = typeof project.image === 'string' ? project.image.trim() : ''
  const validImageSrc =
    !imgFailed &&
    rawImage.length > 0 &&
    !rawImage.includes('projects light') &&
    !rawImage.includes('projects dark')
      ? rawImage
      : undefined

  const currentFormatted = String(currentIndex + 1).padStart(2, '0')
  const totalFormatted = String(totalCount).padStart(2, '0')
  const year = project.year ?? '2026'
  const services = project.services?.[locale] ?? 'UX Research · UI Design · Development'
  const pills = project.pills ?? [
    { ar: '18 شاشة', en: '18 Screens' },
    { ar: 'نظام متكامل', en: 'Full System' },
    { ar: '6 أسابيع', en: '6 Weeks' },
  ]
  const glowColor = project.glowColor ?? '#4f46e5'

  return (
    <article
      className={cn(
        'relative flex transform-gpu flex-col overflow-hidden rounded-2xl border border-dashed border-border/70 bg-background shadow-sm sm:rounded-3xl',
        className,
      )}
    >
      <div
        className="flex items-center justify-between px-4 pb-2.5 pt-3 sm:px-6 sm:pb-4 sm:pt-5"
        style={{ direction: 'ltr' }}
      >
        <div className="flex items-center gap-1 font-mono text-xs font-extrabold sm:text-sm">
          <span className="text-[#4b3fdf] dark:text-[#8173ff]">{currentFormatted}</span>
          <span className="text-muted-foreground/60">/ {totalFormatted}</span>
        </div>

        <Link
          href={`/${locale}/our-work`}
          className="inline-flex items-center gap-1.5 rounded-sm text-xs font-bold text-foreground outline-none transition-colors hover:text-[#4b3fdf]"
          style={{ direction: isAr ? 'rtl' : 'ltr' }}
        >
          <span className="size-1.5 shrink-0 rounded-full bg-[#4b3fdf]" />
          {isAr ? 'أعمالنا' : 'Our Work'}
        </Link>
      </div>

      <div className="mx-4 border-t border-dashed border-border/60 sm:mx-6" />

      <div
        dir="ltr"
        className="flex flex-col-reverse items-center gap-4 px-4 pt-3.5 pb-2 sm:gap-8 sm:px-10 sm:pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:px-20"
      >
        <Link
          href={`/${locale}/our-work`}
          className="mx-auto block w-full max-w-[175px] shrink-0 transition-transform duration-300 hover:-translate-y-1 sm:max-w-[245px] lg:mx-0 lg:w-[255px]"
          style={{ aspectRatio: '3/3.5' }}
        >
          <PortraitProjectCard
            title={displayTitle}
            tagline={
              project.category?.[locale] || (isAr ? 'حلول رقمية متكاملة' : 'Digital Solutions')
            }
            themeClass={themeClass}
            imageSrc={validImageSrc}
            isAr={isAr}
            onImageError={() => setImgFailed(true)}
          />
        </Link>

        <div
          className="flex w-full flex-1 flex-col justify-center"
          style={{ direction: isAr ? 'rtl' : 'ltr' }}
        >
          <h3 className="text-lg font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {displayTitle}
          </h3>

          <p className="mt-1.5 line-clamp-3 max-w-lg text-[11px] leading-relaxed text-muted-foreground sm:mt-4 sm:line-clamp-none sm:text-base">
            {description}
          </p>

          <div className="mt-3 flex flex-wrap items-start gap-4 text-[11px] sm:mt-7 sm:gap-8 sm:text-sm">
            <div>
              <span className="block text-[10px] font-semibold text-muted-foreground/60 sm:text-[11px]">
                {isAr ? 'السنة' : 'Year'}
              </span>
              <span className="mt-0.5 block font-bold text-foreground">{year}</span>
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-muted-foreground/60 sm:text-[11px]">
                {isAr ? 'الخدمات والتقنيات' : 'Services & Stack'}
              </span>
              <span
                className="mt-0.5 block font-semibold text-foreground"
                dir="ltr"
                style={{ textAlign: isAr ? 'right' : 'left' }}
              >
                {services}
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
            {pills.map((pill, idx) => (
              <span
                key={idx}
                className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[10px] font-medium text-foreground sm:px-4 sm:py-1.5 sm:text-xs"
              >
                {pill[locale]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-2 flex items-end justify-center overflow-hidden pb-1 pt-2 sm:mt-5 sm:pt-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 sm:h-28"
          style={{
            background: `radial-gradient(ellipse 60% 100% at 50% 100%, ${glowColor}40 0%, transparent 75%)`,
          }}
        />

        <p
          aria-hidden="true"
          className="relative max-w-full truncate px-4 font-black leading-none tracking-tight select-none"
          style={{
            fontSize: 'clamp(1.6rem, 6.5vw, 6rem)',
            color: `${glowColor}20`,
          }}
        >
          {watermarkText}
        </p>
      </div>
    </article>
  )
}