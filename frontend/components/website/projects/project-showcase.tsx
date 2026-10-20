'use client'

import { useState } from 'react'
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
  watermark,
  tagline,
  themeClass,
  imageSrc,
  isAr,
}: {
  watermark: string
  tagline: string
  themeClass: string
  imageSrc?: string
  isAr: boolean
}) {
  return (
    <div
      className={cn(
        'group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-b p-5 text-white shadow-[0_24px_60px_-15px_rgba(75,63,223,0.4)]',
        themeClass,
      )}
    >
      {/* إضاءة خلفية داخل الكارت */}
      <div className="pointer-events-none absolute -top-12 left-1/2 size-44 -translate-x-1/2 rounded-full bg-white/15 blur-2xl" />

      {/* العنوان العلوي في المنتصف تماماً مثل بوستر Draya و Tyres PRO في فيجما */}
      <div className="relative z-10 pt-2 text-center">
        <p className="line-clamp-1 text-2xl font-black tracking-tight text-white drop-shadow-sm sm:text-3xl">
          {watermark}
        </p>
        <p className="mt-1 text-[11px] font-medium text-white/80">{tagline}</p>
      </div>

      {/* شاشة اللابتوب التفاعلية في الأسفل مع زر السهم البنفسجي الدائري */}
      <div className="relative z-10 mt-auto pt-4">
        <div className="relative mx-auto w-full overflow-hidden rounded-t-xl border-[3px] border-b-0 border-neutral-950 bg-neutral-900 shadow-2xl">
          {/* شريط اللابتوب العلوي */}
          <div className="flex h-4 items-center gap-1 border-b border-white/10 bg-neutral-950 px-2.5">
            <span className="size-1.5 rounded-full bg-rose-400/80" />
            <span className="size-1.5 rounded-full bg-amber-400/80" />
            <span className="size-1.5 rounded-full bg-emerald-400/80" />
            <div className="mx-auto h-1 w-10 rounded-full bg-white/15" />
          </div>

          {/* محتوى شاشة اللابتوب */}
          <div className="relative aspect-[16/11] w-full overflow-hidden bg-neutral-950">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={watermark}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
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

            {/* زر السهم الدائري البنفسجي كما في تصميم فيجما */}
            <span className="absolute bottom-2.5 right-2.5 flex size-8 items-center justify-center rounded-full bg-[#5745e7] text-white shadow-lg ring-2 ring-white/25 transition-transform duration-300 group-hover:scale-110">
              {isAr ? <ArrowUpLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
            </span>
          </div>
        </div>
        {/* قاعدة اللابتوب */}
        <div className="mx-auto h-2 w-[104%] -translate-x-[2%] rounded-b-lg bg-neutral-800 shadow-md" />
      </div>
    </div>
  )
}

export function ProjectShowcase({ projects, locale }: ProjectShowcaseProps) {
  const isAr = locale === 'ar'
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  return (
    <div className="space-y-8 sm:space-y-12">
      {projects.map((project, index) => {
        const brandTitle = project.watermark ?? project.title.en
        const description = project.description[locale]
        const themeClass = project.themeClass ?? 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]'
        const year = project.year ?? '2024'
        const services = project.services?.[locale] ?? 'UX Research · UI Design · Development'
        const pills = project.pills ?? []
        const glowColor = project.glowColor ?? '#4f46e5'
        const imageSrc = typeof project.image === 'string' ? project.image.trim() : ''
        const hasValidImage =
          imageSrc.length > 0 &&
          !imageSrc.startsWith('/images/') &&
          !failedImages[String(project.id)]
        const currentFormatted = String(index + 1).padStart(2, '0')
        const totalFormatted = String(projects.length).padStart(2, '0')

        return (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-background/80 shadow-sm sm:rounded-3xl"
          >
            {/* الشريط العلوي: رقم المشروع يسار + أعمالنا يمين */}
            <div
              className="flex items-center justify-between px-4 pb-3 pt-4 sm:px-8 sm:pb-4 sm:pt-6"
              style={{ direction: 'ltr' }}
            >
              <div className="flex items-center gap-1 font-mono text-xs font-bold">
                <span className="text-foreground">{currentFormatted}</span>
                <span className="text-muted-foreground/40">/ {totalFormatted}</span>
              </div>
              <div
                className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground"
                style={{ direction: isAr ? 'rtl' : 'ltr' }}
              >
                <span className="size-1.5 shrink-0 rounded-full bg-[#4b3fdf]" />
                {isAr ? 'أعمالنا' : 'Our Work'}
              </div>
            </div>

            <div className="mx-4 border-t border-border/50 sm:mx-8" />

            {/* المحتوى الرئيسي: في فيجما البوستر على اليسار والتفاصيل على اليمين */}
            <div
              dir="ltr"
              className="flex w-full flex-col-reverse items-center gap-8 px-4 pt-6 sm:gap-10 sm:px-10 sm:pt-10 lg:flex-row lg:justify-between lg:gap-16 lg:px-20"
            >
              {/* البوستر العمودي على اليسار تماماً مثل فيجما */}
              <Link
                href={`/${locale}/our-work`}
                className="mx-auto block w-full max-w-[240px] shrink-0 transition-transform duration-300 hover:-translate-y-1 sm:max-w-[270px] lg:mx-0 lg:w-[275px]"
                style={{ aspectRatio: '3/3.8' }}
              >
                <PortraitCard
                  watermark={brandTitle}
                  tagline={project.category?.[locale] || (isAr ? 'منصتك الذكية' : 'Smart Platform')}
                  themeClass={themeClass}
                  imageSrc={hasValidImage ? imageSrc : undefined}
                  isAr={isAr}
                />
              </Link>

              {/* تفاصيل المشروع على اليمين */}
              <div
                className="flex w-full flex-1 flex-col justify-center"
                style={{ direction: isAr ? 'rtl' : 'ltr' }}
              >
                <h3 className="text-2xl font-black leading-snug tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {brandTitle}
                </h3>

                <p className="mt-3 max-w-lg text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
                  {description}
                </p>

                <div className="mt-5 flex flex-wrap items-start gap-6 text-xs sm:mt-7 sm:gap-10 sm:text-sm">
                  <div className="shrink-0">
                    <span className="block text-[11px] font-semibold text-muted-foreground/60">
                      {isAr ? 'السنة' : 'Year'}
                    </span>
                    <span className="mt-1 block font-bold text-foreground">{year}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold text-muted-foreground/60">
                      {isAr ? 'الخدمات' : 'Services'}
                    </span>
                    <span
                      className="mt-1 block font-semibold leading-relaxed text-foreground"
                      dir="ltr"
                      style={{ textAlign: isAr ? 'right' : 'left' }}
                    >
                      {services}
                    </span>
                  </div>
                </div>

                {pills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 sm:mt-6">
                    {pills.map((pill, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-border bg-background px-3.5 py-1 text-[11px] font-medium text-foreground shadow-2xs sm:px-4 sm:py-1.5 sm:text-xs"
                      >
                        {pill[locale]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* العلامة المائية السفلية مع التوهج كما في فيجما */}
            <div className="relative mt-6 flex items-end justify-center overflow-hidden px-2 pb-1 pt-6 sm:mt-8 sm:pt-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-32"
                style={{
                  background: `radial-gradient(ellipse 60% 100% at 50% 100%, ${glowColor}38 0%, transparent 75%)`,
                }}
              />
              <p
                aria-hidden="true"
                className="relative max-w-full truncate text-center font-black leading-none tracking-tight select-none"
                style={{
                  fontSize: 'clamp(2.2rem, 8vw, 7rem)',
                  color: `${glowColor}1f`,
                }}
              >
                {brandTitle}
              </p>
            </div>
          </motion.article>
        )
      })}
    </div>
  )
}