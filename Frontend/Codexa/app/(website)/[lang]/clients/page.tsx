import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getMockClients } from '@/data/clients'
import { ClientsHero } from '@/components/website/clients/clients-hero'
import { ClientsRanking } from '@/components/website/clients/clients-ranking'

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

export default async function ClientsPage(props: PageProps<'/[lang]/clients'>) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const clients = getMockClients()

  return (
    <>
      <ClientsHero locale={locale} dict={dict} />
      <ClientsRanking clients={clients} locale={locale} dict={dict} />
    </>
  )
}

