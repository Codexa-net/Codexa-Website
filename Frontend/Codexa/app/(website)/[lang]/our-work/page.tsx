import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getMockProjects } from '@/data/projects'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { Reveal } from '@/components/shared/motion/reveal'
import { WorksShowcase } from '@/components/website/projects/works-showcase'

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
      <Section
        noContainer
        className="border-b border-border bg-[var(--figma-surface-lavender)] py-20 md:py-28"
      >
        <Container>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-500">
              {dict.ourWork.eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-[var(--figma-title-dark)] sm:text-5xl lg:text-6xl">
              {dict.ourWork.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {dict.ourWork.description}
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section noContainer className="bg-white py-16 md:py-24">
        <Container>
          <WorksShowcase
            projects={projects}
            locale={locale}
            variant="grid"
            columns={3}
            labels={{
              viewProject: dict.ourWork.viewProject,
            }}
          />
        </Container>
      </Section>
    </>
  )
}
