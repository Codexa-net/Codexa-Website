'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { cn } from '@/lib/utils'
import { type Project } from '@/types/project'
import { type Locale } from '@/lib/i18n/config'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { ProjectCard } from './project-card'

interface ProjectsFilterProps {
  projects: Project[]
  locale: Locale
  dict: Dictionary['ourWork']
}

type CategoryKey = 'all' | 'web' | 'mobile' | 'branding' | 'ui'

export function ProjectsFilter({ projects, locale, dict }: ProjectsFilterProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')

  const categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: dict.categories.all },
    { key: 'web', label: dict.categories.web },
    { key: 'mobile', label: dict.categories.mobile },
    { key: 'branding', label: dict.categories.branding },
    { key: 'ui', label: dict.categories.ui },
  ]

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === 'all') return true
    return project.tags.includes(activeCategory)
  })

  return (
    <div className="space-y-10">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {categories.map((category) => {
          const isActive = activeCategory === category.key
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              className={cn(
                'relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-category-pill"
                  className="absolute inset-0 rounded-full bg-brand-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category.label}</span>
            </button>
          )
        })}
      </div>

      {/* Filtered Projects Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard
                project={project}
                locale={locale}
                viewLabel={dict.viewProject}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
