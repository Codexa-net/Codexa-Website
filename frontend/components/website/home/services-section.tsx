'use client'

import { useState } from 'react'
import {
  BarChart3,
  Camera,
  ChevronDown,
  Globe,
  Smartphone,
  Star,
  Video,
  ArrowUpRight,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { Reveal } from '@/components/shared/motion/reveal'

interface ServicesSectionProps {
  dict: Dictionary
}

const serviceIcons = [Globe, Smartphone, Star, BarChart3, Video, Camera] as const

export function ServicesSection({ dict }: ServicesSectionProps) {
  const { services } = dict.home
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggleItem(index: number) {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <Section id="services" noContainer className="bg-white py-20 md:py-28 dark:bg-[#0d0b1f]">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-[#4b3fdf] dark:text-indigo-400">{services.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-[2.75rem]">
              {services.title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
              {services.description}
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {services.items.map((item, index) => {
            const Icon = serviceIcons[index % serviceIcons.length]
            const isOpen = openIndex === index
            const number = String(index + 1).padStart(2, '0')

            return (
              <Reveal key={item.title} delay={index * 0.05}>
                <article
                  className={cn(
                    'overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10',
                    'bg-white dark:bg-white/5 shadow-sm transition-shadow',
                    isOpen && 'shadow-md dark:bg-white/10',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 p-5 text-start sm:p-6"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                        isOpen
                          ? 'bg-[#4b3fdf] text-white'
                          : 'bg-[#edeaff] dark:bg-[#4b3fdf]/20 text-[#4b3fdf] dark:text-indigo-400',
                      )}
                    >
                      <Icon className="size-5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl font-bold text-[#4b3fdf]/40 dark:text-indigo-400/30 sm:text-3xl">
                          {number}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                            {item.title}
                          </h3>
                          {!isOpen && (
                            <p className="mt-1 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
                              {item.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-full transition-all',
                        isOpen
                          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                          : 'text-gray-400 dark:text-gray-500',
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          'size-4 transition-transform duration-300',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 dark:border-white/10 px-5 pb-6 pt-2 sm:px-6">
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                        {item.description}
                      </p>

                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4b3fdf] dark:text-indigo-400 transition-colors hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        {services.learnMore}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}