import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AmmarProjectPage } from '@/components/website/projects/ammar-project-page'
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

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

  return <AmmarProjectPage locale={locale} />
}
