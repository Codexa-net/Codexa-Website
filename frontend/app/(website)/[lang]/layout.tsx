import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import '../../globals.css'
import { isValidLocale, localeDir, locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Navbar } from '@/components/website/layout/navbar'
import { Footer } from '@/components/website/layout/footer'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { ClassicChatbot } from '@/components/shared/ClassicChatbot'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: LayoutProps<'/[lang]'>,
): Promise<Metadata> {
  const { lang } = await props.params

  if (!isValidLocale(lang)) return {}

  const dict = await getDictionary(lang)

  return {
    title: {
      default: dict.seo.defaultTitle,
      template: `%s — Codexa`,
    },
    description: dict.seo.defaultDescription,
    alternates: {
      canonical: `https://codexa.sa/${lang}`,
      languages: {
        ar: 'https://codexa.sa/ar',
        en: 'https://codexa.sa/en',
      },
    },
    openGraph: {
      siteName: 'Codexa',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      alternateLocale: lang === 'ar' ? 'en_US' : 'ar_SA',
    },
  }
}

export default async function LocaleLayout(props: LayoutProps<'/[lang]'>) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dir = localeDir[locale]
  const dict = await getDictionary(locale)

  return (
    <html lang={locale} dir={dir} className="dark" suppressHydrationWarning>
      <body className="overflow-x-clip bg-[#030712] text-white">
        <ThemeProvider>
          <SmoothScrollProvider>
            <div className="flex min-h-svh flex-col">
              <Navbar locale={locale} dict={dict} />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                {props.children}
              </main>
              <Footer locale={locale} dict={dict} />
            </div>

            <ClassicChatbot lang={locale} />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}