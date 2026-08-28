import Link from 'next/link'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { type Client } from '@/types/client'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'

interface ClientDetailBodyProps {
  client: Client
  nextClient?: Client
  locale: Locale
  dict: Dictionary
}

export function ClientDetailBody({
  client,
  nextClient,
  locale,
  dict,
}: ClientDetailBodyProps) {
  const { detail } = dict.clients
  const isArabic = locale === 'ar'
  const NextArrow = isArabic ? ArrowLeft : ArrowRight

  const about = client.description?.[locale]
  const quote = client.testimonial?.[locale]

  return (
    <Section
      noContainer
      className="border-t border-white/[0.08] bg-[#07070a] py-16 text-white sm:py-20 lg:py-28"
    >
      <Container wide>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          <div>
            <h2 className="font-arabic text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {detail.aboutTitle}
            </h2>

            <p
              className={cn(
                'mt-6 max-w-[65ch] text-base leading-relaxed sm:text-lg',
                about ? 'text-neutral-300' : 'text-neutral-500 italic',
              )}
            >
              {about ?? detail.aboutFallback}
            </p>
          </div>

          {quote ? (
            <figure
              className={cn(
                'relative self-start rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8',
              )}
            >
              <Quote
                aria-hidden
                className="size-6 text-[#4b3fdf]"
              />

              <blockquote className="mt-4 text-base leading-relaxed text-neutral-200">
                {quote}
              </blockquote>

              {client.testimonialAuthor ? (
                <figcaption className="mt-6 border-t border-white/[0.08] pt-4">
                  <span className="block text-sm font-semibold text-white">
                    {client.testimonialAuthor}
                  </span>
                  {client.testimonialRole ? (
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      {client.testimonialRole}
                    </span>
                  ) : null}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>

        {nextClient ? (
          <div className="mt-16 border-t border-white/[0.08] pt-8 sm:mt-20 lg:mt-24">
            <Link
              href={`/${locale}/clients/${nextClient.slug}`}
              className="group flex items-center justify-between gap-6"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                  {detail.nextClient}
                </span>
                <span className="text-xl font-bold text-white transition-colors group-hover:text-[#a59dfa] sm:text-2xl">
                  {nextClient.name}
                </span>
              </div>

              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-full',
                  'border border-white/10 bg-white/[0.04] text-neutral-400',
                  'transition-all duration-300',
                  'group-hover:border-[#4b3fdf] group-hover:bg-[#4b3fdf] group-hover:text-white',
                )}
              >
                <NextArrow className="size-4" />
              </span>
            </Link>
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
