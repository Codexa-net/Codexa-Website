'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Project } from '@/types/project'

interface ProjectShowcaseProps {
  projects: Project[]
  locale: Locale
}

/**
 * PortraitCard — small gradient card with device mockup, used inside each showcase row.
 */
function PortraitCard({
  watermark,
  tagline,
  themeClass,
}: {
  watermark: string
  tagline: string
  themeClass: string
}) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden rounded-[24px] bg-gradient-to-b shadow-xl',
        themeClass,
      )}
    >
      <div className="px-5 pt-6 text-white" style={{ direction: 'rtl' }}>
        <p className="text-2xl font-extrabold leading-tight">{watermark}</p>
        <p className="mt-0.5 text-[11px] font-medium text-white/70">{tagline}</p>
      </div>

      <div className="relative mt-auto flex items-end justify-center">
        <div className="mx-4 mb-0 w-full overflow-hidden rounded-t-xl border border-white/20 bg-slate-900 shadow-2xl">
          <div className="flex h-5 items-center gap-1 border-b border-white/10 bg-white/5 px-2">
            <span className="size-1.5 rounded-full bg-red-400/80" />
            <span className="size-1.5 rounded-full bg-yellow-400/80" />
            <span className="size-1.5 rounded-full bg-green-400/80" />
            <div className="mx-auto h-1 w-16 rounded-full bg-white/10" />
          </div>
          <div className="space-y-2 p-2.5">
            <div className="h-2 w-2/3 rounded-full bg-indigo-400/40" />
            <div className="rounded-lg bg-white/10 p-2">
              <div className="h-1.5 w-1/2 rounded bg-indigo-400/30" />
              <div className="mt-1 h-1 w-4/5 rounded bg-white/15" />
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-square rounded-md bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * ProjectShowcase — renders each project as a full-width dashed-border card
 * matching the Figma "Our Work" individual project showcase rows.
 */
export function ProjectShowcase({ projects, locale }: ProjectShowcaseProps) {
  const isAr = locale === 'ar'

  return (
    <div className="space-y-10">
      {projects.map((project, index) => {
        const brandTitle = project.watermark ?? project.title.en
        const description = project.description[locale]
        const themeClass = project.themeClass ?? 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]'
        const year = project.year ?? '2024'
        const services = project.services?.[locale] ?? 'UX Research · UI Design · Development'
        const pills = project.pills ?? []
        const glowColor = project.glowColor ?? '#4f46e5'
        const hasImage = Boolean(project.image)
        const title = project.title[locale]
        const currentFormatted = String(index + 1).padStart(2, '0')
        const totalFormatted = String(projects.length).padStart(2, '0')

        return (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col rounded-3xl border border-dashed border-border/60"
          >
            {/* Top bar: counter LEFT, "أعمالنا" link RIGHT (forced LTR) */}
            <div
              className="flex items-center justify-between px-6 pb-4 pt-5"
              style={{ direction: 'ltr' }}
            >
              <div className="flex items-center gap-1 text-xs font-semibold">
                <span className="text-foreground">{currentFormatted}</span>
                <span className="text-muted-foreground/40">/ {totalFormatted}</span>
              </div>
              <div
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground"
                style={{ direction: isAr ? 'rtl' : 'ltr' }}
              >
                <span className="size-1.5 shrink-0 rounded-full bg-brand-500" />
                {isAr ? 'أعمالنا' : 'Our Work'}
              </div>
            </div>

            {/* Dashed separator */}
            <div className="mx-6 border-t border-dashed border-border/60" />

            {/* Main content */}
            <div className="flex flex-col gap-8 px-6 pt-8 sm:px-10 lg:flex-row lg:items-center lg:gap-12 lg:px-16">
              {/* Project details */}
              <div
                className="flex flex-1 flex-col justify-center"
                style={{ direction: isAr ? 'rtl' : 'ltr' }}
              >
                <h3 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {brandTitle}
                </h3>

                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {description}
                </p>

                {/* Meta: Year + Services */}
                <div className="mt-8 flex items-start gap-8 text-sm">
                  <div>
                    <span className="block text-[11px] font-semibold text-muted-foreground/60">
                      {isAr ? 'السنة' : 'Year'}
                    </span>
                    <span className="mt-1 block font-bold text-foreground">{year}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-muted-foreground/60">
                      {isAr ? 'الخدمات' : 'Services'}
                    </span>
                    <span className="mt-1 block font-semibold text-foreground">{services}</span>
                  </div>
                </div>

                {/* Pills */}
                {pills.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {pills.map((pill, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground"
                      >
                        {pill[locale]}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Portrait card */}
              <div
                className="w-full shrink-0 lg:w-[240px] xl:w-[270px]"
                style={{ aspectRatio: '3/4' }}
              >
                {hasImage ? (
                  <div className="relative h-full w-full overflow-hidden rounded-[24px] shadow-xl">
                    <Image
                      src={project.image}
                      alt={title}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <PortraitCard
                    watermark={brandTitle}
                    tagline={isAr ? 'منصتك الذكية' : 'Smart Platform'}
                    themeClass={themeClass}
                  />
                )}
              </div>
            </div>

            {/* Bottom watermark + radial glow */}
            <div className="relative mt-6 flex items-end justify-center overflow-hidden pb-1 pt-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
                style={{
                  background: `radial-gradient(ellipse 60% 100% at 50% 100%, ${glowColor}60 0%, ${glowColor}30 45%, transparent 75%)`,
                }}
              />
              <p
                aria-hidden="true"
                className="relative select-none font-extrabold leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(3.5rem, 12vw, 8rem)',
                  color: `${glowColor}22`,
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
