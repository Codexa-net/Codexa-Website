import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getMockProjects } from '@/data/projects'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { OurWorkHero } from '@/components/website/projects/our-work-hero'
import { ProjectsFilter } from '@/components/website/projects/projects-filter'
import { ProjectShowcase } from '@/components/website/projects/project-showcase'

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
      {/* ─── 1. Hero: Title "اكتشف ما أنجزناه" + fanned floating cards ─── */}
      <OurWorkHero
        title={dict.ourWork.heroTitle ?? 'اكتشف ما أنجزناه'}
        subtitle={dict.ourWork.heroSubtitle}
        projects={projects}
      />

      {/* ─── 2. Individual project showcases (full-width WorkSlide cards: Draya, Tyres Pro, ta7wila, Burnout) ─── */}
      <Section noContainer className="bg-white py-16 md:py-24">
        <Container>
          <ProjectShowcase projects={projects} locale={locale} />
        </Container>
      </Section>

      {/* ─── 3. Filter section: "كل المشاريع" + category pills + 3x3 grid ─── */}
      <Section noContainer className="bg-[var(--figma-surface-lavender)] py-16 md:py-24">
        <Container>
          <ProjectsFilter
            projects={projects}
            locale={locale}
            dict={dict.ourWork}
          />
        </Container>
      </Section>
    </>
  )
}
