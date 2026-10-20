'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { FadeIn } from '@/components/shared/motion/fade-in'

interface ClientsHeroProps {
  locale: Locale
  dict: Dictionary
}

export function ClientsHero({ locale, dict }: ClientsHeroProps) {
  const { hero } = dict.clients
  const isArabic = locale === 'ar'

  const defaultLiveActivities = isArabic
    ? [
        { name: 'منصة الأستاذ', sector: 'تحديث النظام', status: 'active' },
        { name: 'مستشفى النور', sector: 'ترقية الخوادم', status: 'active' },
        { name: 'متجر إلكترولايت', sector: 'عقد تطوير جديد', status: 'active' },
        { name: 'أندية بالس جيم', sector: 'ربط بوابات الدخول', status: 'active' },
      ]
    : [
        { name: 'Al-Ostaz', sector: 'System Update', status: 'active' },
        { name: 'Al-Nour Hospital', sector: 'Server Upgrade', status: 'active' },
        { name: 'Electrolite', sector: 'New Contract', status: 'active' },
        { name: 'Pulse Gym', sector: 'Gate Access Integration', status: 'active' },
      ]

  const [liveClients, setLiveClients] = useState<any[]>(defaultLiveActivities)

  useEffect(() => {
    let isMounted = true

    async function fetchRecentClients() {
      try {
        const rawApi =
          process.env.NEXT_PUBLIC_API_URL ||
          'https://codexa-website-backend.vercel.app'
        const apiUrl = rawApi.includes('localhost')
          ? 'https://codexa-website-backend.vercel.app'
          : rawApi.replace(/\/$/, '')

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 1500)

        const res = await fetch(`${apiUrl}/clients`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        }).catch(() => null)

        clearTimeout(timeoutId)

        if (res && res.ok) {
          const text = await res.text().catch(() => '')
          if (text && text.trim().length > 0) {
            const data = JSON.parse(text)
            const list = Array.isArray(data) ? data : data?.data
            if (isMounted && Array.isArray(list) && list.length > 0) {
              const formatted = list.slice(0, 4).map((c: any) => ({
                name: c.name || 'Client',
                sector: c.industry || c.sector || 'Business',
                status:
                  c.status === 'نشط' || c.status === 'قيد التنفيذ'
                    ? 'active'
                    : 'completed',
              }))
              setLiveClients(formatted)
            }
          }
        }
      } catch {
        // يتم استخدام البيانات الاحتياطية تلقائياً دون إطلاق console.error لمنع ظهور الشاشة الحمراء
      }
    }

    fetchRecentClients()

    return () => {
      isMounted = false
    }
  }, [])

  const scrollToDirectory = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById('clients-directory')

    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Section
      id="clients-hero"
      noContainer
      className="relative overflow-hidden bg-background py-10 sm:py-16 md:py-20 lg:py-28"
    >
      <Container wide className="relative">
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14"
        >
          <div className="lg:col-span-7">
            <FadeIn direction="up" delay={0.05}>
              <div className="flex flex-col text-start">
                <h1
                  className={cn(
                    'text-2xl font-extrabold leading-[1.18] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.5rem]',
                    isArabic && 'font-arabic',
                  )}
                >
                  <span className="block">{hero.titleLine1}</span>
                  <span className="block">{hero.titleLine2}</span>

                  <span className="block text-[#4b3fdf] dark:text-indigo-400">
                    {hero.titleHighlight1}
                  </span>

                  <span className="block text-[#4b3fdf] dark:text-indigo-400">
                    {hero.titleHighlight2}
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base md:text-xl">
                  {hero.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-8">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground sm:text-sm">
                    <span className="text-base font-bold text-[#4b3fdf]">+25</span>
                    <span>{isArabic ? 'علامة تجارية تثق بنا' : 'Brands trust us'}</span>
                  </div>

                  <a
                    href="#clients-directory"
                    onClick={scrollToDirectory}
                    className={cn(
                      'group inline-flex items-center gap-2 rounded-full bg-[#4b3fdf] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#4b3fdf]/25 transition-all duration-300 sm:gap-2.5 sm:px-7 sm:py-3.5 sm:text-sm',
                      'hover:scale-[1.02] hover:bg-[#4338ca] hover:shadow-xl hover:shadow-[#4b3fdf]/35 active:scale-[0.98]',
                    )}
                  >
                    <span>{hero.cta}</span>

                    <ArrowUpRight
                      className={cn(
                        'size-4 transition-transform duration-300 group-hover:-translate-y-0.5 ltr:group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5',
                      )}
                    />
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-5">
            <FadeIn direction="up" delay={0.15}>
              <div className="relative mx-auto w-full max-w-lg rounded-2xl border border-border/80 bg-card p-0 shadow-[0_4px_24px_-4px_rgba(75,63,223,0.06),0_1px_3px_rgba(0,0,0,0.03)] backdrop-blur-xs dark:border-white/10 dark:bg-zinc-950/80">
                <div className="grid grid-cols-[1fr_auto] items-center border-b border-border/70 px-4 py-3.5 sm:px-6 sm:py-4 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#4b3fdf] sm:text-xs dark:text-indigo-400">
                      {hero.liveLogActive}
                    </span>

                    <span className="relative flex">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#4b3fdf] opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-[#4b3fdf]" />
                    </span>
                  </div>

                  <div className="text-end">
                    <span className="font-mono text-[10px] font-semibold tracking-widest text-muted-foreground uppercase sm:text-xs">
                      {hero.liveLogTitle}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-border/50 dark:divide-white/5">
                  {liveClients.map((row, index) => {
                    const isActive = row.status === 'active'
                    const statusText = isActive
                      ? dict.clients.ranking.statuses.active
                      : dict.clients.ranking.statuses.completed

                    return (
                      <div
                        key={`${row.name}-${index}`}
                        className="grid grid-cols-[1fr_auto] items-center gap-2 px-4 py-3 transition-colors hover:bg-muted/40 sm:gap-4 sm:px-6 sm:py-4"
                      >
                        <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
                          <div className="shrink-0 text-start">
                            <span
                              className={cn(
                                'inline-block rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap transition-colors sm:px-2.5 sm:text-[11px]',
                                isActive
                                  ? 'border border-[#d8d3ff] bg-[#edeaff] text-[#4b3fdf] dark:border-indigo-500/30 dark:bg-indigo-950/60 dark:text-indigo-300'
                                  : 'border border-border/80 bg-muted/60 text-muted-foreground dark:border-white/10 dark:bg-zinc-900',
                              )}
                            >
                              {statusText}
                            </span>
                          </div>
                          <div className="truncate text-[11px] font-medium text-muted-foreground sm:text-xs">
                            {row.sector}
                          </div>
                        </div>

                        <div
                          className="shrink-0 text-end text-xs font-bold text-foreground sm:min-w-[100px] sm:text-sm"
                          dir="ltr"
                        >
                          {row.name}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        <FadeIn direction="up" delay={0.25} className="mt-10 sm:mt-16 lg:mt-28">
          <div className="flex justify-center">
            <a
              href="#clients-directory"
              onClick={scrollToDirectory}
              className="group flex flex-col items-center gap-2 text-center text-xs font-medium text-muted-foreground/80 transition-colors hover:text-foreground"
            >
              <span>{hero.scrollPrompt}</span>

              <ArrowDown className="size-4 animate-bounce text-[#4b3fdf] dark:text-indigo-400" />
            </a>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
} 