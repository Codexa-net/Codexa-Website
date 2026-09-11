import { cn } from '@/lib/utils'
import { Container } from './container'

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  /** HTML element to render as */
  as?: React.ElementType
  /** Skip the inner Container wrapper */
  noContainer?: boolean
  /** Use narrow container */
  narrow?: boolean
  /** Use wide container */
  wide?: boolean
  /** Custom id for anchor linking */
  id?: string
}

/**
 * Shared section primitive — handles consistent vertical spacing and optional
 * container wrapping. Every website page section should use this as its wrapper.
 *
 * Usage:
 * ```tsx
 * <Section id="hero">
 *   <h2>...</h2>
 * </Section>
 *
 * <Section noContainer className="bg-muted">
 *   <Container>...</Container>
 * </Section>
 * ```
 */
export function Section({
  children,
  className,
  containerClassName,
  as: Tag = 'section',
  noContainer = false,
  narrow = false,
  wide = false,
  id,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'py-8 md:py-10 lg:py-14',
        className,
      )}
    >
      {noContainer ? (
        children
      ) : (
        <Container narrow={narrow} wide={wide} className={containerClassName}>
          {children}
        </Container>
      )}
    </Tag>
  )
}
