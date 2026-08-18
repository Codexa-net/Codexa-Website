import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getMockProjects } from '@/data/projects'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { Reveal } from '@/components/shared/motion/reveal'
import { OurWorkHero } from '@/components/website/projects/our-work-hero'
import { ProjectsFilter } from '@/components/website/projects/projects-filter'
import { ProjectShowcase } from '@/components/website/projects/project-showcase'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export async function generateMetadata(
  props: PageProps<'/[lang]/our-work'>,
): Promise<Metadata> {
  const { lang } = await props.params

  if (!isValidLocale(lang)) return {}

  const dict = await getDictionary(lang)

  return {
    title: dict.seo.ourWork.title,
    description: dict.seo.ourWork.description,
  }
}

export default async function OurWorkPage(props: PageProps<'/[lang]/our-work'>) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const projects = getMockProjects()

  return (
    <>
      {/* ─── 1. Hero: Title + fanned floating cards ─── */}
      <OurWorkHero title={dict.ourWork.title} projects={projects} />

      {/* ─── 2. Filter section: eyebrow + category pills + grid ─── */}
      <Section noContainer className="bg-[var(--figma-surface-lavender)] py-16 md:py-24">
        <Container>
          <ProjectsFilter
            projects={projects}
            locale={locale}
            dict={dict.ourWork}
          />
        </Container>
      </Section>

      {/* ─── 3. Individual project showcases (full-width WorkSlide cards) ─── */}
      <Section noContainer className="bg-white py-16 md:py-24">
        <Container>
          <ProjectShowcase projects={projects} locale={locale} />
        </Container>
      </Section>

      {/* ─── 4. Bottom CTA ─── */}
      <Section
        noContainer
        className="relative overflow-hidden bg-[#05060f] py-20 text-white md:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/2 -z-0 size-[500px] -translate-x-1/2 rounded-full bg-brand-500/15 blur-[160px]"
        />

        <Container className="relative z-10 flex flex-col items-center text-center">
          <Reveal>
            <p className="text-sm font-medium text-white/50">
              {dict.home.contactCta.eyebrow}
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {dict.home.contactCta.title}
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/${locale}/contact`}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-12 rounded-full px-8 text-base font-semibold',
                )}
              >
                {dict.home.contactCta.cta}
              </Link>
              <Link
                href={dict.footer.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                {dict.home.contactCta.whatsapp}
              </Link>
            </div>
          </Reveal>
        </Container>

        {/* Large "Codexa" wordmark */}
        <div className="mt-16 overflow-hidden px-5 sm:px-8">
          <p
            aria-hidden="true"
            className={cn(
              'select-none text-center text-[clamp(4rem,18vw,11rem)] font-bold leading-none tracking-tight',
              'bg-gradient-to-b from-white/20 to-white/[0.04] bg-clip-text text-transparent',
            )}
          >
            Codexa
          </p>
        </div>
      </Section>
    </>
  )
}
