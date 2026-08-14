import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

export async function generateMetadata(
  props: PageProps<'/[lang]/about'>,
): Promise<Metadata> {
  const { lang } = await props.params

  if (!isValidLocale(lang)) return {}

  const dict = await getDictionary(lang)

  return {
    title: dict.seo.about.title,
    description: dict.seo.about.description,
  }
}

/**
 * About page placeholder.
 * Developer 2 will implement this page.
 */
export default async function AboutPage(props: PageProps<'/[lang]/about'>) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-foreground">
        {dict.about.hero.title}
      </h1>
      <p className="mt-4 max-w-lg text-muted-foreground">
        {dict.about.hero.description}
      </p>
      <p className="mt-8 rounded-md bg-muted px-4 py-2 text-sm text-muted-foreground">
        🚧 Developer 2 — About page
      </p>
    </div>
  )
}
