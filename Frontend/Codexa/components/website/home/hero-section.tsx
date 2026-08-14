import Link from 'next/link'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { FadeIn } from '@/components/shared/motion/fade-in'
import { buttonVariants } from '@/components/ui/button'

interface HeroSectionProps {
  locale: Locale
  dict: Dictionary
}

function DeviceMockup({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden rounded-[var(--figma-radius-xl)]',
        'border border-[var(--figma-border)] bg-white',
        'shadow-[var(--figma-shadow-photo)]',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-6 border-b border-[var(--figma-border)] bg-[var(--figma-surface-lavender)]" />
      <div className="flex h-full flex-col gap-3 p-5 pt-10">
        <div className="h-3 w-2/3 rounded-full bg-[var(--figma-border)]" />
        <div className="h-3 w-1/2 rounded-full bg-[var(--figma-border)]/70" />
        <div className="mt-auto aspect-[4/3] rounded-xl bg-gradient-to-br from-brand-500/20 to-[var(--figma-accent-purple)]/10" />
      </div>
    </div>
  )
}

/**
 * Home hero — light editorial layout matching the Figma home mockup.
 */
export function HeroSection({ locale, dict }: HeroSectionProps) {
  const { hero } = dict.home

  return (
    <Section
      id="hero"
      noContainer
      className={cn(
        'relative overflow-hidden py-0',
        'bg-[var(--figma-surface-bright)] text-[var(--figma-title-dark)]',
        'min-h-[calc(100svh-4.5rem)]',
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -start-32 top-20 size-[420px] rounded-full bg-[var(--figma-accent-sky)]/15 blur-[100px]" />
        <div className="absolute -end-24 bottom-10 size-[380px] rounded-full bg-[var(--figma-accent-purple)]/12 blur-[90px]" />
      </div>

      <Container className="relative flex min-h-[calc(100svh-4rem)] items-center py-20 md:py-28">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_1.4fr_1fr] lg:gap-6">
          <FadeIn direction="right" className="hidden lg:block">
            <DeviceMockup className="ms-auto h-[280px] w-[200px] -rotate-6" />
          </FadeIn>

          <div className="mx-auto max-w-2xl text-center lg:max-w-none">
            <FadeIn direction="up" delay={0.05}>
              <h1
                className={cn(
                  'text-balance font-bold leading-[1.12] tracking-tight',
                  'text-[clamp(2.25rem,6vw,4.75rem)]',
                )}
              >
                {hero.title}
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.15}>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                {hero.description}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.25}>
              <Link
                href={`/${locale}#contact`}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'mt-10 h-12 rounded-full px-10 text-base',
                )}
              >
                {hero.cta}
              </Link>
            </FadeIn>
          </div>

          <FadeIn direction="left" className="hidden lg:block">
            <DeviceMockup className="h-[300px] w-[220px] rotate-6" />
          </FadeIn>
        </div>
      </Container>
    </Section>
  )
}
