import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getClientBySlug, getClientSlugs, getMockClients } from '@/data/clients'
import { ClientDetailHero } from '@/components/website/clients/client-detail-hero'
import { ClientDetailBody } from '@/components/website/clients/client-detail-body'

/**
 * Both locales for every client, so each details page is rendered at build
 * time rather than on the first request.
 */
export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getClientSlugs().map((slug) => ({ lang, slug })),
  )
}

export async function generateMetadata(
  props: PageProps<'/[lang]/clients/[slug]'>,
): Promise<Metadata> {
  const { lang, slug } = await props.params

  if (!isValidLocale(lang)) return {}

  const client = getClientBySlug(slug)
  const dict = await getDictionary(lang)

  if (!client) return { title: dict.seo.clients.title }

  const locale = lang as Locale

  return {
    title: `${client.name} — ${dict.seo.clientDetail.titleSuffix}`,
    description:
      client.description?.[locale] ??
      client.sector?.[locale] ??
      dict.seo.clientDetail.descriptionFallback,
  }
}

export default async function ClientDetailPage(
  props: PageProps<'/[lang]/clients/[slug]'>,
) {
  const { lang, slug } = await props.params

  if (!isValidLocale(lang)) notFound()

  const client = getClientBySlug(slug)

  if (!client) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)

  // Wraps back to the first client, so the last page is not a dead end.
  const all = getMockClients()
  const index = all.findIndex((c) => c.slug === client.slug)
  const nextClient = all[(index + 1) % all.length]

  return (
    <>
      <ClientDetailHero client={client} locale={locale} dict={dict} />
      <ClientDetailBody
        client={client}
        nextClient={nextClient.slug === client.slug ? undefined : nextClient}
        locale={locale}
        dict={dict}
      />
    </>
  )
}
