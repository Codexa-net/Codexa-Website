'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
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
  const { ranking } = dict.clients
  const isArabic = locale === 'ar'

  const categories: { key: ClientCategory; label: string }[] = [
    { key: 'all', label: ranking.categories.all },
    { key: 'tech', label: ranking.categories.tech },
    { key: 'fitness', label: ranking.categories.fitness },
    { key: 'retail', label: ranking.categories.retail },
    { key: 'branding', label: ranking.categories.branding },
  ]

  const filteredClients = useMemo(() => {
    if (selectedCategory === 'all') return clients
    return clients.filter((c) => c.category === selectedCategory)
  }, [clients, selectedCategory])

  return (
    <Section
      id="clients-directory"
      noContainer
      className="relative overflow-hidden bg-[#07070a] py-16 text-white sm:py-20 md:py-28 lg:py-32"
    >
      <Container wide className="relative">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="order-2">
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                {ranking.clientCountLabel}
              </span>
              <span className="font-mono text-4xl font-extrabold tracking-tight text-white sm:text-5xl mt-1">
                {String(filteredClients.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-col">
              <h2 className="font-arabic text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                <span className="block">{ranking.titleLine1}</span>
                <span className="block text-white">{ranking.titleLine2}</span>
              </h2>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.key
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={cn(
                        'cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200',
                        isActive
                          ? 'bg-[#4b3fdf] text-white shadow-md shadow-[#4b3fdf]/30 font-semibold'
                          : 'border border-white/10 bg-white/[0.04] text-neutral-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white',
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

        <div className="mt-14 sm:mt-16 lg:mt-20">
          <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.08]">
            <AnimatePresence mode="popLayout">
              {filteredClients.map((client) => {
                const isActive = client.status === 'active'
                const statusLabel = isActive
                  ? ranking.statuses.active
                  : ranking.statuses.completed
                const formattedNumber = String(client.order).padStart(2, '0')

                return (
                  <motion.div
                    key={client.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      'group relative flex flex-col gap-4 py-4 px-3 sm:px-4 transition-all duration-200 sm:py-5 lg:flex-row lg:items-center lg:justify-between lg:py-6',
                      'hover:bg-white/[0.03]',
                    )}
                  >
                    {/* Covers the row so the whole thing opens the client, while
                        the website button above it keeps its own link. */}
                    <Link
                      href={`/${locale}/clients/${client.slug}`}
                      aria-label={`${ranking.viewClient} ${client.name}`}
                      className="absolute inset-0 z-0 rounded-sm focus-visible:ring-2 focus-visible:ring-[#4b3fdf] focus-visible:outline-none"
                    />

                    <div className="relative z-10 flex items-center gap-4 sm:gap-8 lg:min-w-[280px] pointer-events-none">
                      <span className="font-mono text-xs font-semibold text-neutral-400 sm:text-sm">
                        {formattedNumber}
                      </span>
                      <span className="text-base font-bold text-white tracking-wide transition-colors group-hover:text-white sm:text-lg md:text-xl">
                        {client.name}
                      </span>
                    </div>

                    <div className="flex items-center text-xs font-medium text-neutral-400 sm:text-sm lg:min-w-[160px] lg:justify-center">
                      {client.sector?.[locale]}
                    </div>

                    <div className="font-mono text-xs font-medium text-neutral-400 sm:text-sm lg:min-w-[80px] lg:text-center">
                      {client.year}
                    </div>

                    <div className="relative z-10 flex items-center justify-between gap-4 lg:min-w-[200px] lg:justify-end pointer-events-none">
                      <span
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap',
                          isActive
                            ? 'border border-[#4b3fdf]/40 bg-[#4b3fdf]/20 text-[#a59dfa]'
                            : 'border border-white/10 bg-white/[0.05] text-neutral-400',
                        )}
                      >
                        {statusLabel}
                      </span>

                      {client.website ? (
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={cn(
                            'pointer-events-auto',
                            'flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-400 transition-all duration-300 sm:size-9',
                            'group-hover:border-[#4b3fdf] group-hover:bg-[#4b3fdf] group-hover:text-white group-hover:scale-105',
                          )}
                        >
                          <ArrowUpRight className={cn('size-3.5 sm:size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5')} />
                        </a>
                      ) : (
                        <div
                          className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-400 transition-all duration-300 sm:size-9',
                            'group-hover:border-[#4b3fdf] group-hover:bg-[#4b3fdf] group-hover:text-white group-hover:scale-105',
                          )}
                        >
                          <ArrowUpRight className={cn('size-3.5 sm:size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5', !isArabic && 'rotate-0')} />
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
