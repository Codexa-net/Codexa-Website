import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { type Client } from '@/types/client'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'

interface ClientDetailHeroProps {
  client: Client
  locale: Locale
  dict: Dictionary
}

export function ClientDetailHero({
  client,
  locale,
  dict,
}: ClientDetailHeroProps) {
  const { detail, ranking } = dict.clients
  const isArabic = locale === 'ar'
  const BackArrow = isArabic ? ArrowRight : ArrowLeft

  const isActive = client.status === 'active'
  const statusLabel = isActive
    ? ranking.statuses.active
    : ranking.statuses.completed

  const facts = [
    { label: detail.sectorLabel, value: client.sector?.[locale] },
    { label: detail.yearLabel, value: client.year },
    { label: detail.statusLabel, value: statusLabel },
  ].filter((fact) => Boolean(fact.value))

  return (
    <Section
      noContainer
      className="relative overflow-hidden bg-[#07070a] pt-28 pb-16 text-white sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24"
    >
      {/* Ambient glow behind the client name, echoing the index page accent. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 start-1/4 size-[36rem] rounded-full bg-[#4b3fdf]/20 blur-[120px]"
      />

      <Container wide className="relative">
        <Link
          href={`/${locale}/clients`}
          className={cn(
            'inline-flex items-center gap-2 text-xs font-medium text-neutral-400',
            'transition-colors duration-200 hover:text-white',
          )}
        >
          <BackArrow className="size-3.5" />
          {detail.backToClients}
        </Link>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold tracking-wider text-neutral-500">
              {String(client.order).padStart(2, '0')}
            </span>

            <h1 className="mt-3 font-arabic text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {client.name}
            </h1>

            {client.sector?.[locale] ? (
              <p className="mt-4 text-base text-neutral-400 sm:text-lg">
                {client.sector[locale]}
              </p>
            ) : null}

            {client.website ? (
              <a
                href={client.website}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(
                  'mt-8 inline-flex items-center gap-2 rounded-full bg-[#4b3fdf] px-5 py-2.5',
                  'text-sm font-semibold text-white shadow-md shadow-[#4b3fdf]/30',
                  'transition-all duration-200 hover:bg-[#5b50e6] hover:shadow-lg',
                )}
              >
                {detail.visitWebsite}
                <ArrowUpRight className="size-4" />
              </a>
            ) : null}
          </div>

          {facts.length > 0 ? (
            <dl className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3 lg:gap-x-14">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1.5">
                  <dt className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    {fact.label}
                  </dt>
                  <dd className="text-sm font-medium text-white sm:text-base">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}
