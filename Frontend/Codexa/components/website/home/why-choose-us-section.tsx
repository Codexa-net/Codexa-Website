'use client'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { Reveal } from '@/components/shared/motion/reveal'
import {
  StickyScroll,
  StickyScrollContent,
} from '@/components/shared/motion/sticky-scroll'

interface WhyChooseUsSectionProps {
  dict: Dictionary
}

const STEP_COLORS = [
  { from: '#1a1b4b', to: '#0d0d2b' },
  { from: '#1e1b4b', to: '#161633' },
  { from: '#3b1b4b', to: '#1a0d2b' },
  { from: '#4b1b3b', to: '#2b0d1a' },
  { from: '#1b4b3b', to: '#0d2b1a' },
] as const

export function WhyChooseUsSection({ dict }: WhyChooseUsSectionProps) {
  const { whyChooseUs } = dict.home
  const items = whyChooseUs.items

  if (items.length === 0) return null

  return (
    <div id="why-choose-us">
      {/* Intro quote box — scroll reveal */}
      <Section noContainer className="bg-[var(--figma-surface)] py-16 md:py-20 dark:bg-[#0d0b1f]">
        <Container narrow>
          <Reveal>
            <div
              className={cn(
                'mx-auto max-w-2xl rounded-[var(--figma-radius-xl)] border-2 border-dashed',
                'border-brand-500/40 bg-white dark:bg-card px-8 py-10 text-center sm:px-12 sm:py-12',
              )}
            >
              <p className="text-lg font-bold leading-relaxed text-[var(--figma-title-dark)] dark:text-white sm:text-xl">
                {whyChooseUs.intro.line1}
              </p>
              <p className="mt-3 text-lg font-bold leading-relaxed text-[var(--figma-title-dark)] dark:text-white sm:text-xl">
                {whyChooseUs.intro.line2}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Sticky process steps */}
      <StickyScroll itemCount={items.length} ariaLabel={whyChooseUs.title}>
        {(activeIndex) => {
          const item = items[activeIndex]
          const stepNumber = String(activeIndex + 1).padStart(2, '0')
          const colors = STEP_COLORS[activeIndex % STEP_COLORS.length]

          return (
            /*
             * Background: motion.div with animated gradient via background-image.
             * We can't animate CSS gradients directly, so we animate opacity of
             * overlapping divs — the new one fades in over the old one.
             */
            <div className="relative h-full w-full overflow-hidden text-white">
              {/* Animated background for this step */}
              <motion.div
                key={`bg-${activeIndex}`}
                className="absolute inset-0"
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{
                  background: `linear-gradient(to bottom, ${colors.from}, ${colors.to})`,
                }}
              />

              {/* Outline step number watermark — always on the end side (left in RTL, right in LTR) */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-6 end-6 z-0 select-none sm:bottom-10 sm:end-10"
                style={{
                  fontSize: 'clamp(6rem, 22vw, 14rem)',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(255,255,255,0.14)',
                }}
              >
                {stepNumber}
              </span>

              {/* Side step nav — always on the start side (right in RTL, left in LTR) */}
              <nav
                aria-label="Process steps"
                className="absolute start-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 sm:start-10 lg:flex"
              >
                {items.map((step, index) => (
                  <span
                    key={step.title}
                    className={cn(
                      'max-w-[120px] truncate text-start text-xs transition-colors duration-400',
                      index === activeIndex ? 'text-white' : 'text-white/35',
                    )}
                  >
                    {step.shortLabel ?? step.title}
                  </span>
                ))}
              </nav>

              {/* Center content — animates on each step change */}
              <div className="relative z-10 flex h-full items-center justify-center">
                <StickyScrollContent
                  activeIndex={activeIndex}
                  className="mx-auto max-w-3xl px-6 text-center sm:px-10"
                >
                  {item.eyebrow && (
                    <p className="text-sm font-medium text-white/50">{item.eyebrow}</p>
                  )}
                  <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
                    {item.title}
                  </h2>
                  <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
                    {item.description}
                  </p>
                </StickyScrollContent>
              </div>
            </div>
          )
        }}
      </StickyScroll>
    </div>
  )
}
