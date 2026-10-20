'use client'

import { useState, useMemo, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { type Client, type ClientCategory } from '@/types/client'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'

interface ClientsRankingProps {
  clients: Client[]
  locale: Locale
  dict: Dictionary
}

export function ClientsRanking({ clients, locale, dict }: ClientsRankingProps) {
  const [selectedCategory, setSelectedCategory] = useState<ClientCategory>('all')
  const [animatedCount, setAnimatedCount] = useState(0)

  const { ranking } = dict.clients
  const isArabic = locale === 'ar'

  // تصفية أي تصنيف فارغ في ملف الترجمة لمنع ظهور الزر الفارغ الزائد بجانب "تجارة وتجزئة"
  const categories: { key: ClientCategory; label: string }[] = useMemo(() => {
    const rawCategories: { key: ClientCategory; label: string }[] = [
      { key: 'all', label: ranking.categories.all },
      { key: 'tech', label: ranking.categories.tech },
      { key: 'fitness', label: ranking.categories.fitness },
      { key: 'retail', label: ranking.categories.retail },
      { key: 'branding', label: ranking.categories.branding },
    ]
    return rawCategories.filter((cat) => Boolean(cat.label && cat.label.trim().length > 0))
  }, [ranking.categories])

  const filteredClients = useMemo(() => {
    if (selectedCategory === 'all') return clients
    return clients.filter((c) => c.category === selectedCategory)
  }, [clients, selectedCategory])

  useEffect(() => {
    const target = filteredClients.length
    if (target === 0) {
      setAnimatedCount(0)
      return
    }

    let current = 0
    const stepTime = Math.max(15, Math.abs(Math.floor(600 / target)))

    const timer = setInterval(() => {
      current += 1
      setAnimatedCount(current)
      if (current >= target) {
        clearInterval(timer)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [filteredClients.length])

  return (
    <Section
      id="clients-directory"
      noContainer
      className="relative overflow-hidden bg-background py-12 text-foreground transition-colors duration-300 dark:bg-[#07070a] dark:text-white sm:py-20 md:py-28 lg:py-32"
    >
      <Container wide className="relative">
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          className="flex flex-col gap-6 sm:gap-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="order-2 lg:order-2">
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:text-neutral-400">
                {ranking.clientCountLabel}
              </span>
              <span className="mt-1 font-mono text-3xl font-extrabold tracking-tight text-foreground dark:text-white sm:text-5xl">
                {String(animatedCount).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="order-1 lg:order-1">
            <div className="flex flex-col">
              <h2 className="font-arabic text-2xl font-extrabold leading-tight tracking-tight text-foreground dark:text-white sm:text-4xl lg:text-5xl">
                <span className="block">{ranking.titleLine1}</span>
                <span className="block text-foreground dark:text-white">{ranking.titleLine2}</span>
              </h2>

              <div className="mt-6 flex flex-wrap items-center gap-2 sm:mt-8">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.key
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className={cn(
                        'cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4',
                        isActive
                          ? 'bg-[#4b3fdf] font-semibold text-white shadow-md shadow-[#4b3fdf]/30'
                          : 'border border-border bg-muted/50 text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:text-white',
                      )}
                    >
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 lg:mt-20" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="divide-y divide-border/70 border-t border-b border-border dark:divide-white/[0.06] dark:border-white/[0.08]">
            <AnimatePresence mode="popLayout">
              {filteredClients.map((client, index) => {
                const isActive = client.status === 'active'
                const statusLabel = isActive
                  ? ranking.statuses.active
                  : ranking.statuses.completed
                const itemOrder = client.order || index + 1
                const formattedNumber = String(itemOrder).padStart(2, '0')

                return (
                  <motion.div
                    key={client.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      'group relative flex flex-col gap-3 px-2 py-4 transition-all duration-200 sm:gap-4 sm:px-4 sm:py-5 lg:flex-row lg:items-center lg:justify-between lg:py-6',
                      'hover:bg-muted/40 dark:hover:bg-white/[0.03]',
                    )}
                  >
                    <div className="flex items-center justify-between gap-4 lg:min-w-[280px] lg:justify-start sm:gap-8">
                      <div className="flex items-center gap-3 sm:gap-6">
                        <span className="font-mono text-xs font-semibold text-muted-foreground dark:text-neutral-400 sm:text-sm">
                          {formattedNumber}
                        </span>
                        <span className="text-base font-bold tracking-wide text-foreground transition-colors group-hover:text-[#4b3fdf] dark:text-white dark:group-hover:text-white sm:text-lg md:text-xl">
                          {client.name}
                        </span>
                      </div>

                      {/* يظهر تاريخ السنة بجانب الاسم على شاشات الهاتف بشكل أنيق */}
                      <span className="font-mono text-xs font-medium text-muted-foreground lg:hidden dark:text-neutral-400">
                        {client.year || '2024'}
                      </span>
                    </div>

                    <div className="flex items-center text-xs font-medium text-muted-foreground dark:text-neutral-400 sm:text-sm lg:min-w-[160px] lg:justify-center">
                      {client.sector?.[locale] || client.sector}
                    </div>

                    <div className="hidden font-mono text-xs font-medium text-muted-foreground lg:block lg:min-w-[80px] lg:text-center dark:text-neutral-400 sm:text-sm">
                      {client.year || '2024'}
                    </div>

                    <div className="flex items-center justify-between gap-4 lg:min-w-[200px] lg:justify-end">
                      <span
                        className={cn(
                          'whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors',
                          isActive
                            ? 'border border-[#d8d3ff] bg-[#edeaff] text-[#4b3fdf] dark:border-[#4b3fdf]/40 dark:bg-[#4b3fdf]/20 dark:text-[#a59dfa]'
                            : 'border border-border/80 bg-muted/60 text-muted-foreground dark:border-white/10 dark:bg-white/[0.05] dark:text-neutral-400',
                        )}
                      >
                        {statusLabel}
                      </span>

                      {client.website ? (
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition-all duration-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 sm:size-9',
                            'group-hover:scale-105 group-hover:border-[#4b3fdf] group-hover:bg-[#4b3fdf] group-hover:text-white dark:group-hover:border-[#4b3fdf] dark:group-hover:bg-[#4b3fdf] dark:group-hover:text-white',
                          )}
                        >
                          <ArrowUpRight
                            className={cn(
                              'size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-4',
                            )}
                          />
                        </a>
                      ) : (
                        <div
                          className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition-all duration-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 sm:size-9',
                            'group-hover:scale-105 group-hover:border-[#4b3fdf] group-hover:bg-[#4b3fdf] group-hover:text-white dark:group-hover:border-[#4b3fdf] dark:group-hover:bg-[#4b3fdf] dark:group-hover:text-white',
                          )}
                        >
                          <ArrowUpRight
                            className={cn(
                              'size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-4',
                              !isArabic && 'rotate-0',
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  )
}