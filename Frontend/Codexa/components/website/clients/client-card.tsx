import Image from 'next/image'

import { cn } from '@/lib/utils'
import { type Client } from '@/types/client'
import { type Locale } from '@/lib/i18n/config'

interface ClientCardProps {
  client: Client
  locale: Locale
  className?: string
}

/**
 * ClientCard — displays a client logo with optional sector label.
 * Used in ClientsGrid on the Home and Clients pages.
 * Minimal design: clean logo display on a neutral background.
 */
export function ClientCard({ client, locale, className }: ClientCardProps) {
  const sector = client.sector?.[locale]
  const hasLogo = Boolean(client.logo)

  const content = (
    <div
      className={cn(
        'group flex flex-col items-center justify-center gap-3 rounded-xl border border-border',
        'bg-card p-6 transition-all duration-300',
        'hover:border-border/60 hover:shadow-md hover:shadow-black/5',
        client.website && 'cursor-pointer',
        className,
      )}
    >
      {/* Logo */}
      <div className="relative h-12 w-full">
        {hasLogo ? (
          <Image
            src={client.logo}
            alt={`${client.name} logo`}
            fill
            sizes="(max-width: 640px) 120px, 180px"
            className="object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-md bg-muted px-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Demo
          </div>
        )}
      </div>

      {/* Client name */}
      <p className="text-center text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        {client.name}
      </p>

      {/* Sector (optional) */}
      {sector && (
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
          {sector}
        </span>
      )}
    </div>
  )

  if (client.website) {
    return (
      <a
        href={client.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${client.name}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        {content}
      </a>
    )
  }

  return content
}
