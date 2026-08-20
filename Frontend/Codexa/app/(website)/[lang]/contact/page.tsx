import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { ContactForm } from '@/components/website/contact/contact-form'

export async function generateMetadata(
  props: PageProps<'/[lang]/contact'>,
): Promise<Metadata> {
  const { lang } = await props.params

  if (!isValidLocale(lang)) return {}

  const dict = await getDictionary(lang)

  return {
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
  }
}

export default async function ContactPage(props: PageProps<'/[lang]/contact'>) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return <ContactForm locale={locale} dict={dict} />
}
