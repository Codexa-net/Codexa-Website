import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
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
  
  // جلب العملاء الحقيقيين من قاعدة البيانات وتفريغ الوهمي
  let realClients: any[] = []
  try {
    const res = await fetch('http://localhost:3001/clients', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      // تهيئة البيانات عشان تتوافق مع تصميم الفهرس
      realClients = data.map((c: any) => ({
        id: c.id || Math.random().toString(),
        name: c.name,
        sector: c.industry || c.sector || "أعمال وتجارة",
        status: c.status === "نشط" || c.status === "قيد التنفيذ" ? "active" : "completed"
      }))
    }
  } catch (error) {
    console.error("تعذر جلب بيانات العملاء:", error)
  }

  return (
    <>
      <ClientsHero locale={locale} dict={dict} />
      <ClientsRanking clients={realClients} locale={locale} dict={dict} />
    </>
  )
}