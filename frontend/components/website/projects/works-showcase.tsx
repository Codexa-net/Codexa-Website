'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Project } from '@/types/project'
import { Container } from '@/components/shared/container'
import { StickyScroll } from '@/components/shared/motion/sticky-scroll'
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
  // 🟢 تحميل مسبق فوري لجميع صور المشاريع في ذاكرة المتصفح لمنع أي تأخير أثناء التمرير على Vercel
  useEffect(() => {
    if (typeof window === 'undefined' || !projects?.length) return
    projects.forEach((proj) => {
      if (proj.image) {
        const img = new window.Image()
        img.decoding = 'async'
        img.src = proj.image
      }
    })
  }, [projects])

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
      className={cn('relative bg-background', className)}
      aria-label="Works"
    >
      {/* تحميل مسبق مخفي في الـ DOM لضمان جاهزية كل الصور قبل التمرير إليها */}
      <div
        className="pointer-events-none fixed -z-50 h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        {projects.map((p) =>
          p.image ? (
            <img
              key={p.id}
              src={p.image}
              alt=""
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          ) : null,
        )}
      </div>

      {/* ضبط أبعاد الشريحة في شاشات الهاتف لمنع قصّ عنوان المشروع تحت الهيدر أو الشريط العلوي */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 767px) {
              #works .sticky.top-0.h-screen {
                padding-top: 4.25rem !important;
                padding-bottom: 1.25rem !important;
                display: flex !important;
                align-items: center !important;
              }
              #works h2, #works h3 {
                line-height: 1.3 !important;
              }
            }
          `,
        }}
      />

      <StickyScroll
        itemCount={projects.length}
        panelClassName="bg-background"
      >
        {(activeIndex) => {
          const project = projects[activeIndex] || projects[0]

          return (
            <Container
              wide
              className="flex h-full items-center justify-center overflow-y-auto no-scrollbar pt-14 pb-6 sm:py-8 md:overflow-visible md:py-10"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeIndex}
                  className="w-full my-auto"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <WorkSlide
                    project={project}
                    locale={locale}
                    viewLabel={labels.viewProject}
                    currentIndex={activeIndex}
                    totalCount={projects.length}
                    className="w-full"
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