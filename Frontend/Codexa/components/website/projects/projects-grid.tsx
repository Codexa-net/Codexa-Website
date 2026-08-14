import { cn } from '@/lib/utils'
import { type Project } from '@/types/project'
import { type Locale } from '@/lib/i18n/config'
import { ProjectCard } from './project-card'
import { Stagger, StaggerItem } from '@/components/shared/motion/stagger'

interface ProjectsGridProps {
  projects: Project[]
  locale: Locale
  viewLabel: string
  className?: string
  /** Number of columns (default: 3) */
  columns?: 2 | 3
}

/**
 * ProjectsGrid — responsive staggered grid of ProjectCards.
 * Used by both the Home "selected projects" section and the Our Work page.
 *
 * Usage:
 * ```tsx
 * <ProjectsGrid
 *   projects={getFeaturedProjects(3)}
 *   locale={locale}
 *   viewLabel={dict.ourWork.viewProject}
 * />
 * ```
 */
export function ProjectsGrid({
  projects,
  locale,
  viewLabel,
  className,
  columns = 3,
}: ProjectsGridProps) {
  if (projects.length === 0) return null

  return (
    <Stagger
      className={cn(
        'grid gap-6',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {projects.map((project) => (
        <StaggerItem key={project.id}>
          <ProjectCard
            project={project}
            locale={locale}
            viewLabel={viewLabel}
          />
        </StaggerItem>
      ))}
    </Stagger>
  )
}
