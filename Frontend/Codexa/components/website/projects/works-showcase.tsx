'use client'

import { motion, AnimatePresence } from 'framer-motion'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Project } from '@/types/project'
import { Container } from '@/components/shared/container'
import {
  StickyScroll,
} from '@/components/shared/motion/sticky-scroll'
import { WorkSlide } from './work-slide'
import { ProjectsGrid } from './projects-grid'

interface WorksShowcaseLabels {
  viewProject: string
}

interface WorksShowcaseProps {
  projects: Project[]
  locale: Locale
  labels: WorksShowcaseLabels
  /** sticky = scroll-pinned showcase (Home), grid = standard grid (Our Work page) */
  variant?: 'sticky' | 'grid'
  className?: string
  columns?: 2 | 3
}

/**
 * WorksShowcase — reusable Works presentation.
 * Sticky variant: card animates in from the left, content from the right on each step change.
 */
export function WorksShowcase({
  projects,
  locale,
  labels,
  variant = 'sticky',
  className,
  columns = 3,
}: WorksShowcaseProps) {
  if (projects.length === 0) return null

  if (variant === 'grid') {
    return (
      <div className={className}>
        <ProjectsGrid
          projects={projects}
          locale={locale}
          viewLabel={labels.viewProject}
          columns={columns}
        />
      </div>
    )
  }

  return (
    <section
      id="works"
      className={cn('bg-background', className)}
      aria-label="Works"
    >
      <StickyScroll
        itemCount={projects.length}
        panelClassName="bg-background"
      >
        {(activeIndex) => {
          const project = projects[activeIndex]

          return (
            <Container wide className="flex h-full items-stretch py-10 my-10 md:py-12">
              {/*
               * The entire WorkSlide animates as a single unit via AnimatePresence.
               * Each step change: old slide exits (fade+scale down), new slides in (fade+blur clear).
               */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className="w-full"
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <WorkSlide
                    project={project}
                    locale={locale}
                    viewLabel={labels.viewProject}
                    currentIndex={activeIndex}
                    totalCount={projects.length}
                    className="h-full my-5 py-3"
                  />
                </motion.div>
              </AnimatePresence>
            </Container>
          )
        }}
      </StickyScroll>
    </section>
  )
}

