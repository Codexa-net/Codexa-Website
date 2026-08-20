'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Project } from '@/types/project'
import { type Locale } from '@/lib/i18n/config'

interface ProjectCardProps {
  project: Project
  locale: Locale
  viewLabel: string
  className?: string
}

/**
 * ProjectCard — image-first card.
 *
 * Desktop: hovering reveals a dark overlay with the CTA button.
 * Mobile: the overlay + button are always visible so touch users
 *         can immediately see and tap the action.
 */
export function ProjectCard({ project, locale, viewLabel, className }: ProjectCardProps) {
  const title = project.title[locale]
  const category = project.category[locale]
  const href = project.liveUrl ?? project.caseStudyUrl ?? '#'
  const isExternal = href.startsWith('http')

  return (
    <article
      id={project.slug}
      className={cn('group relative aspect-square overflow-hidden rounded-2xl bg-muted', className)}
    >
      {/* ── Cover image ── */}
      {project.image ? (
        <Image
          src={project.image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        /* Fallback gradient when no image is provided */
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br',
            project.themeClass ?? 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]',
          )}
        >
          <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white/10 select-none">
            {project.watermark ?? title}
          </span>
        </div>
      )}

      {/* ── Category badge — always visible ── */}
      <span className="absolute start-3 top-3 z-20 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        {category}
      </span>

      {/* ── Hover overlay (mobile: always on, desktop: hover only) ── */}
      <div
        className={cn(
          'absolute inset-0 z-10 flex items-end justify-center pb-6',
          'bg-gradient-to-t from-black/70 via-black/30 to-transparent',
          'transition-opacity duration-300',
          // Mobile: always visible | sm+: hidden until hover
          'opacity-100 sm:opacity-0 sm:group-hover:opacity-100',
        )}
      >
        <Link
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          aria-label={`${viewLabel}: ${title}`}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-5 py-2.5',
            'bg-white text-sm font-bold text-[#0d0b2c]',
            'shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)]',
            'transition-transform duration-200',
            'hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
            // Slide up slightly on desktop hover
            'translate-y-2 sm:group-hover:translate-y-0',
          )}
        >
          {viewLabel}
          <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
