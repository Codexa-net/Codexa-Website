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

/**
 * PortraitProjectCard — بوستر المشروع بتصميم فيجما مع عرض صورة المشروع الحقيقية داخل اللابتوب
 */
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
        'group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-b p-5 text-white shadow-[0_24px_60px_-15px_rgba(75,63,223,0.45)]',
        themeClass,
      )}
    >
      {/* إضاءة خلفية ناعمة أعلى البوستر */}
      <div className="pointer-events-none absolute -top-10 left-1/2 size-40 -translate-x-1/2 rounded-full bg-white/15 blur-2xl" />

      {/* اسم المشروع الحقيقي والوصف المختصر في أعلى المنتصف تماماً مثل فيجما */}
      <div className="relative z-10 pt-2 text-center" dir={isAr ? 'rtl' : 'ltr'}>
        <p className="line-clamp-1 text-xl font-black tracking-tight text-white drop-shadow-xs sm:text-2xl">
          {title}
        </p>
        <p className="mt-1 text-[11px] font-medium text-white/80">{tagline}</p>
      </div>

      {/* مجسم اللابتوب في الأسفل مع قاعدة الصخرة الداكنة وزر السهم البنفسجي */}
      <div className="relative z-10 mt-auto pt-4">
        <div className="relative mx-auto w-full overflow-hidden rounded-t-xl border-[3px] border-b-0 border-neutral-950 bg-slate-900 shadow-2xl">
          {/* شريط نافذة اللابتوب */}
          <div className="flex h-4 items-center gap-1 border-b border-white/10 bg-neutral-950 px-2">
            <span className="size-1.5 rounded-full bg-red-400/80" />
            <span className="size-1.5 rounded-full bg-amber-400/80" />
            <span className="size-1.5 rounded-full bg-green-400/80" />
            <div className="mx-auto h-1 w-12 rounded-full bg-white/15" />
          </div>

          {/* شاشة اللابتوب تعرض صورة المشروع الحقيقية */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={title}
                loading="lazy"
                onError={onImageError}
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
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

            {/* زر السهم البنفسجي الدائري فوق شاشة اللابتوب كما في فيجما */}
            <span className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full bg-[#5745e7] text-white shadow-lg ring-2 ring-white/25 transition-transform duration-300 group-hover:scale-110">
              {isAr ? <ArrowUpLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
            </span>
          </div>
        </div>

        {/* قاعدة اللابتوب والظل السفلي */}
        <div className="mx-auto h-2 w-[104%] -translate-x-[2%] rounded-b-lg bg-neutral-800 shadow-md" />
        <div className="pointer-events-none mx-auto mt-1 h-2.5 w-4/5 rounded-full bg-black/50 blur-md" />
      </div>
    </div>
  )
}

/**
 * WorkSlide — يعرض المشاريع الـ 7 الحقيقية (01 / 07) بنفس تصميم فيجما
 */
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

  // عرض اسم المشروع الحقيقي حسب لغة الموقع (مثلاً: مستشفى النور / منصة الأستاذ / متجر إلكترولايت)
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
        'relative flex flex-col overflow-hidden rounded-2xl border border-dashed border-border/60 bg-background/60 sm:rounded-3xl',
        className,
      )}
    >
      {/* ── الشريط العلوي: العداد 01 / 07 على اليسار بالألوان المطابقة لفيجما + أعمالنا على اليمين ── */}
      <div
        className="flex items-center justify-between px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5"
        style={{ direction: 'ltr' }}
      >
        {/* Counter — 01 باللون البنفسجي و / 07 بالرمادي كما في فيجما */}
        <div className="flex items-center gap-1 font-mono text-xs font-extrabold sm:text-sm">
          <span className="text-[#4b3fdf] dark:text-[#8173ff]">{currentFormatted}</span>
          <span className="text-muted-foreground/60">/ {totalFormatted}</span>
        </div>

        {/* أعمالنا link — physical RIGHT */}
        <Link
          href={`/${locale}/our-work`}
          className="inline-flex items-center gap-1.5 rounded-sm text-xs font-bold text-foreground outline-none transition-colors hover:text-[#4b3fdf] focus-visible:ring-2 focus-visible:ring-ring"
          style={{ direction: isAr ? 'rtl' : 'ltr' }}
        >
          <span className="size-1.5 shrink-0 rounded-full bg-[#4b3fdf]" />
          {isAr ? 'أعمالنا' : 'Our Work'}
        </Link>
      </div>

      {/* Dashed separator */}
      <div className="mx-4 border-t border-dashed border-border/60 sm:mx-6" />

      {/* ── المحتوى الرئيسي: البوستر على اليسار والتفاصيل على اليمين ── */}
      <div
        dir="ltr"
        className="flex flex-col-reverse items-center gap-6 px-4 pt-6 sm:gap-8 sm:px-10 sm:pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:px-20"
      >
        {/* LEFT — Portrait poster card */}
        <Link
          href={`/${locale}/our-work`}
          className="mx-auto block w-full max-w-[220px] shrink-0 transition-transform duration-300 hover:-translate-y-1 sm:max-w-[255px] lg:mx-0 lg:w-[255px] xl:w-[275px]"
          style={{ aspectRatio: '3/3.8' }}
        >
          <PortraitProjectCard
            title={displayTitle}
            tagline={project.category?.[locale] || (isAr ? 'حلول رقمية متكاملة' : 'Digital Solutions')}
            themeClass={themeClass}
            imageSrc={validImageSrc}
            isAr={isAr}
            onImageError={() => setImgFailed(true)}
          />
        </Link>

        {/* RIGHT — project details */}
        <div
          className="flex w-full flex-1 flex-col justify-center"
          style={{ direction: isAr ? 'rtl' : 'ltr' }}
        >
          <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {displayTitle}
          </h3>

          <p className="mt-3 max-w-lg text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
            {description}
          </p>

          {/* Meta: Year + Services */}
          <div className="mt-5 flex flex-wrap items-start gap-6 text-xs sm:mt-8 sm:gap-8 sm:text-sm">
            <div>
              <span className="block text-[11px] font-semibold text-muted-foreground/60">
                {isAr ? 'السنة' : 'Year'}
              </span>
              <span className="mt-1 block font-bold text-foreground">{year}</span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-muted-foreground/60">
                {isAr ? 'الخدمات والتقنيات' : 'Services & Stack'}
              </span>
              <span
                className="mt-1 block font-semibold text-foreground"
                dir="ltr"
                style={{ textAlign: isAr ? 'right' : 'left' }}
              >
                {services}
              </span>
            </div>
          </div>

          {/* Pills */}
          <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
            {pills.map((pill, idx) => (
              <span
                key={idx}
                className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-foreground sm:px-4 sm:py-1.5 sm:text-xs"
              >
                {pill[locale]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom: large watermark + radial color glow ── */}
      <div className="relative mt-4 flex items-end justify-center overflow-hidden pb-1 pt-4 sm:mt-6 sm:pt-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-32"
          style={{
            background: `radial-gradient(ellipse 60% 100% at 50% 100%, ${glowColor}50 0%, ${glowColor}25 45%, transparent 75%)`,
          }}
        />

        <p
          aria-hidden="true"
          className="relative max-w-full truncate px-4 font-black leading-none tracking-tight select-none"
          style={{
            fontSize: 'clamp(2.2rem, 8vw, 6.5rem)',
            color: `${glowColor}22`,
          }}
        >
          {watermarkText}
        </p>
      </div>
    </article>
  )
}