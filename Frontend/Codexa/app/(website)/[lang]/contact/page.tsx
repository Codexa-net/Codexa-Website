import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Section } from '@/components/shared/section'
import { Container } from '@/components/shared/container'
import { FadeIn } from '@/components/shared/motion/fade-in'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export async function generateMetadata(
  props: PageProps<'/[lang]'>,
): Promise<Metadata> {
  const { lang } = await props.params

  if (!isValidLocale(lang)) return {}

  const dict = await getDictionary(lang)

  return {
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
  }
}

export default async function ContactPage(props: PageProps<'/[lang]'>) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <FadeIn className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
            {dict.nav.contactUs}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {dict.home.contactCta.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {dict.home.contactCta.eyebrow}
          </p>
        </FadeIn>

        <Section className="mt-8">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Contact Info */}
            <FadeIn direction="right" className="lg:col-span-5">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-foreground">
                  {dict.footer.contact.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {dict.footer.description}
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </p>
                      <a
                        href={`mailto:${dict.footer.contact.email}`}
                        className="text-base font-semibold text-foreground hover:text-brand-500"
                      >
                        {dict.footer.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {locale === 'ar' ? 'الهاتف / واتساب' : 'Phone / WhatsApp'}
                      </p>
                      <a
                        href={`tel:${dict.footer.contact.phone}`}
                        className="text-base font-semibold text-foreground hover:text-brand-500"
                      >
                        {dict.footer.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {locale === 'ar' ? 'الموقع' : 'Location'}
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {dict.footer.contact.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn direction="left" className="lg:col-span-7">
              <form
                action="#"
                className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      {locale === 'ar' ? 'الاسم الأول' : 'First Name'}
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      {locale === 'ar' ? 'اسم العائلة' : 'Last Name'}
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">
                    {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">
                    {locale === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  <Send className="size-4" />
                  {dict.home.contactCta.cta}
                </button>
              </form>
            </FadeIn>
          </div>
        </Section>
      </Container>
    </div>
  )
}
