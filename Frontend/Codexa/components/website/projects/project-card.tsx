import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Project } from '@/types/project'
import { type Locale } from '@/lib/i18n/config'

interface ProjectCardProps {
  project: Project
  locale: Locale
  /** Label for the "view project" CTA */
  viewLabel: string
  className?: string
  /** Show larger card with more detail */
  featured?: boolean
}

/**
 * ProjectCard — displays a single project with image, category, title,
 * short description, and a view link. Fully localized and RTL-safe.
 *
 * The card is designed to work in both ProjectsGrid and the Home featured section.
 */
export function ProjectCard({
  project,
  locale,
  viewLabel,
  className,
  featured = false,
}: ProjectCardProps) {
  const title = project.title[locale]
  const description = project.shortDescription[locale]
  const category = project.category[locale]
  const hasImage = Boolean(project.image)

  return (
    <article
      id={project.slug}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card',
        'transition-all duration-300 hover:border-border/80 hover:shadow-lg hover:shadow-black/5',
        className,
      )}
    >
      {/* Project image */}
      <div
        className={cn(
          'relative w-full overflow-hidden bg-muted',
          featured ? 'aspect-[16/9]' : 'aspect-[4/3]',
        )}
      >
        {hasImage ? (
          <Image
            src={project.image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted px-6 text-center text-sm font-medium text-muted-foreground">
            {title}
          </div>
        )}
        {/* Category badge */}
        <span className="absolute start-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          {category}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className={cn('font-semibold text-foreground', featured ? 'text-xl' : 'text-base')}>
          {title}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* CTA */}
        {project.liveUrl && (
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${viewLabel}: ${title}`}
            className={cn(
              'mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-500',
              'transition-colors hover:text-brand-600',
              'outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
            )}
          >
            {viewLabel}
            <ArrowUpRight
              className={cn('size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5')}
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </article>
  )
}
