import { cn } from '@/lib/utils'
import { type Client } from '@/types/client'
import { type Locale } from '@/lib/i18n/config'
import { ClientCard } from './client-card'
import { Stagger, StaggerItem } from '@/components/shared/motion/stagger'

interface ClientsGridProps {
  clients: Client[]
  locale: Locale
  className?: string
  /** Number of columns at largest breakpoint (default: 4) */
  columns?: 3 | 4 | 5
}

/**
 * ClientsGrid — responsive staggered grid of ClientCards.
 * Used on both the Home clients section and the Clients page.
 *
 * Usage:
 * ```tsx
 * <ClientsGrid clients={getMockClients()} locale={locale} />
 * ```
 */
export function ClientsGrid({
  clients,
  locale,
  className,
  columns = 4,
}: ClientsGridProps) {
  if (clients.length === 0) return null

  return (
    <Stagger
      className={cn(
        'grid gap-4',
        columns === 3 && 'grid-cols-2 sm:grid-cols-3',
        columns === 4 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        columns === 5 && 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
        className,
      )}
    >
      {clients.map((client) => (
        <StaggerItem key={client.id}>
          <ClientCard client={client} locale={locale} />
        </StaggerItem>
      ))}
    </Stagger>
  )
}
