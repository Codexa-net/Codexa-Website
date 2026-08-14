import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

export async function generateMetadata(
  props: PageProps<'/[lang]/clients'>,
): Promise<Metadata> {
  const { lang } = await props.params

  if (!isValidLocale(lang)) return {}

  const dict = await getDictionary(lang)

  return {
    title: dict.seo.clients.title,
    description: dict.seo.clients.description,
  }
}

/**
 * Clients page placeholder.
 * Developer 4 will implement this page using:
 * - getMockClients() from data/clients.ts
 * - ClientsGrid component
 * - Section + Container from shared components
 */
export default async function ClientsPage(props: PageProps<'/[lang]/clients'>) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-foreground">
        {dict.clients.title}
      </h1>
      <p className="mt-4 max-w-lg text-muted-foreground">
        {dict.clients.description}
      </p>
      <p className="mt-8 rounded-md bg-muted px-4 py-2 text-sm text-muted-foreground">
        🚧 Developer 4 — Clients page
      </p>
    </div>
  )
}
