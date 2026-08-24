"use client"

import { ArrowDown, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { type Locale } from "@/lib/i18n/config"
import { type Dictionary } from "@/lib/i18n/dictionaries"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { FadeIn } from "@/components/shared/motion/fade-in"

interface ClientsHeroProps {
  locale: Locale
  dict: Dictionary
}

export function ClientsHero({ locale, dict }: ClientsHeroProps) {
  const { hero } = dict.clients
  const isArabic = locale === "ar"

  const scrollToDirectory = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById("clients-directory")

    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Section
      id="clients-hero"
      noContainer
      className="relative overflow-hidden bg-background py-12 sm:py-16 md:py-20 lg:py-28"
    >
      <Container wide className="relative">
        <div
           dir={isArabic ? "ltr" : "rtl"} 
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14"
        >
          <div className="lg:col-span-5">
            <FadeIn direction="up" delay={0.15}>
              <div className="relative mx-auto w-full max-w-lg rounded-2xl border border-border/80 bg-card p-0 shadow-[0_4px_24px_-4px_rgba(75,63,223,0.06),0_1px_3px_rgba(0,0,0,0.03)] backdrop-blur-sm dark:border-white/10 dark:bg-zinc-950/80">
                <div className="grid grid-cols-[1fr_auto] items-center border-b border-border/70 px-6 py-4 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#4b3fdf] dark:text-indigo-400">
                      {hero.liveLogActive}
                    </span>

                    <span className="relative flex">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#4b3fdf] opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-[#4b3fdf]" />
                    </span>
                  </div>

                  <div className="min-w-[100px] text-end">
                    <span className="font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                      {hero.liveLogTitle}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-border/50 dark:divide-white/5">
                  {hero.liveLogRows.map((row, index) => {
                    const isActive = row.status === "active"

                    const statusText = isActive
                      ? dict.clients.ranking.statuses.active
                      : dict.clients.ranking.statuses.completed

                    return (
                      <div
                        key={`${row.name}-${index}`}
                        className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-3.5 transition-colors hover:bg-muted/40 sm:py-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="min-w-[70px] text-end">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap transition-colors",
                                isActive
                                  ? "border border-[#d8d3ff] bg-[#edeaff] text-[#4b3fdf] dark:border-indigo-500/30 dark:bg-indigo-950/60 dark:text-indigo-300"
                                  : "border border-border/80 bg-muted/60 text-muted-foreground dark:border-white/10 dark:bg-zinc-900"
                              )}
                            >
                              {statusText}
                            </span>
                          </div>
                          <div className="text-xs font-medium text-muted-foreground">
                            {row.sector}
                          </div>

                        </div>

                        <div className="min-w-[100px] text-end text-sm font-bold text-foreground">
                          {row.name}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-7">
            <FadeIn direction="up" delay={0.05}>
              <div className="flex flex-col">
                <h1 className="font-arabic text-4xl leading-[1.12] font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.5rem]">
                  <span className="block">{hero.titleLine1}</span>
                  <span className="block">{hero.titleLine2}</span>

                  <span className="block text-[#4b3fdf] dark:text-indigo-400">
                    {hero.titleHighlight1}
                  </span>

                  <span className="block text-[#4b3fdf] dark:text-indigo-400">
                    {hero.titleHighlight2}
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                  {hero.description}
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-6 sm:gap-8">
                 

                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground sm:text-sm">
                    <span>{hero.returningRateValue}</span>
                    <span>{hero.returningRateLabel}</span>
                  </div>

                   <a
                    href="#clients-directory"
                    onClick={scrollToDirectory}
                    className={cn(
                      "group inline-flex items-center gap-2.5 rounded-full bg-[#4b3fdf] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4b3fdf]/25 transition-all duration-300",
                      "hover:scale-[1.02] hover:bg-[#4338ca] hover:shadow-xl hover:shadow-[#4b3fdf]/35 active:scale-[0.98]"
                    )}
                  >
                    <span>{hero.cta}</span>

                    <ArrowUpRight
                      className={cn(
                        "size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                      )}
                    />
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        <FadeIn direction="up" delay={0.25} className="mt-16 sm:mt-20 lg:mt-28">
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
