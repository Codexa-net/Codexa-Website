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

type CategoryKey = 'all' | 'web' | 'mobile' | 'ui'

function getCount(projects: Project[], key: CategoryKey): number {
  if (key === 'all') return projects.length
  return projects.filter((p) => Array.isArray(p.tags) && p.tags.includes(key)).length
}

function formatCount(n: number): string {
  return String(n).padStart(2, '0')
}

export function ProjectsFilter({ projects, locale, dict }: ProjectsFilterProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')
  const isArabic = locale === 'ar'

  const categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: dict.categories?.all ?? 'الكل' },
    { key: 'web', label: dict.categories?.web ?? 'مواقع' },
    { key: 'mobile', label: dict.categories?.mobile ?? 'تطبيقات' },
    { key: 'ui', label: dict.categories?.ui ?? 'تصميم' },
  ]

  const filteredProjects = projects.filter((p) =>
    activeCategory === 'all' ? true : Array.isArray(p.tags) && p.tags.includes(activeCategory),
  )

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="space-y-6 sm:space-y-8">
      {/* ── Section header ── */}
      <div className="flex flex-col gap-2 sm:gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4b3fdf] dark:text-brand-400">
          {dict.filterEyebrow ?? (isArabic ? 'تصفح حسب النوع' : 'Browse by type')}
        </p>
        <h2 className="text-3xl font-black leading-tight text-[#0f172a] dark:text-white sm:text-5xl">
          {dict.gridTitle ?? (isArabic ? 'كل المشاريع' : 'All Projects')}
        </h2>
        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-gray-400">
            {dict.filterSubtitle ??
              (isArabic
                ? 'اختر التصنيف الذي يهمك، أو تصفح الكل.'
                : 'Pick the category that matters to you, or browse all.')}
          </p>
          <p className="text-xs sm:text-sm text-[#94a3b8] dark:text-gray-500">
            {dict.filterHint ??
              (isArabic
                ? 'كل بطاقة بتفتح على تفاصيل المشروع وخطوات الشغل عليه.'
                : 'Each card opens the project details and the steps we took to build it.')}
          </p>
        </div>
      </div>

      <div className="border-t border-dashed border-[#cbd5e1] dark:border-white/10" />

      {/* ── Category filter pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1 sm:flex-wrap sm:gap-3">
        {categories.map((category) => {
          const isActive = activeCategory === category.key
          const count = getCount(projects, category.key)

          return (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              className={cn(
                'relative shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3.5 py-2 sm:px-4 text-xs sm:text-sm font-semibold cursor-pointer',
                'transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#4b3fdf]',
                isActive
                  ? 'text-white'
                  : 'border border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#4b3fdf]/30 hover:text-[#4b3fdf] dark:bg-card dark:border-white/10 dark:text-gray-400 dark:hover:border-brand-500/30 dark:hover:text-brand-400',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-[#4b3fdf]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{category.label}</span>
              <span
                className={cn(
                  'relative z-10 min-w-[1.375rem] rounded-full px-1.5 py-0.5 text-center text-[10px] sm:text-[11px] font-bold leading-none tabular-nums',
                  isActive ? 'bg-white/20 text-white' : 'bg-[#f1f5f9] text-[#64748b] dark:bg-white/10 dark:text-gray-300',
                )}
              >
                {formatCount(count)}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Filtered grid ── */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id || project.name}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectCard
                project={project}
                locale={locale}
                viewLabel={dict.viewProject ?? 'عرض المشروع'}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── Empty state ── */}
      {filteredProjects.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-[#94a3b8]">
            {isArabic ? 'لا توجد مشاريع في هذه الفئة حالياً' : 'No projects in this category yet'}
          </p>
        </div>
      )}
    </div>
  )
}