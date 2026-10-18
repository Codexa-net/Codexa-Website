import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getFeaturedProjects } from '@/data/projects'
import { HeroSection } from '@/components/website/home/hero-section'
import { MarqueeBanner } from '@/components/website/home/marquee-banner'
import { WorksShowcase } from '@/components/website/projects/works-showcase'
import { ServicesSection } from '@/components/website/home/services-section'
import { BentoShowcase } from '@/components/website/home/bento-showcase'
import { WhyChooseUsSection } from '@/components/website/home/why-choose-us-section'

export async function generateMetadata(
  props: PageProps<'/[lang]'>,
): Promise<Metadata> {
  const { lang } = await props.params

  if (!isValidLocale(lang)) return {}

  const dict = await getDictionary(lang)

  return {
    title: dict.seo.home.title,
    description: dict.seo.home.description,
  }
}

export default async function HomePage(props: PageProps<'/[lang]'>) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const projects = await getFeaturedProjects(4)

  return (
    <>
      <HeroSection locale={locale} dict={dict} />
      <MarqueeBanner locale={locale} />
      <WorksShowcase
        projects={projects}
        locale={locale}
        variant="sticky"
        labels={{ viewProject: dict.home.projects.viewProject }}
      />
      <ServicesSection dict={dict} />
      <BentoShowcase locale={locale} />
      <WhyChooseUsSection dict={dict} />
    </>
  )
}