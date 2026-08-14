import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
  /** Use narrow container (max-w-4xl) for text-heavy content */
  narrow?: boolean
  /** Use wide container (max-w-screen-2xl) for full-bleed sections */
  wide?: boolean
}

/**
 * Shared container component — consistent max-width, responsive horizontal
 * padding, and RTL-safe via CSS logical properties (padding-inline).
 *
 * Usage:
 * ```tsx
 * <Container>...</Container>
 * <Container narrow>...</Container>  // text-heavy content
 * <Container wide>...</Container>    // full-width sections
 * ```
 */
export function Container({
  children,
  className,
  as: Tag = 'div',
  narrow = false,
  wide = false,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16',
        narrow && 'max-w-4xl',
        wide && 'max-w-screen-2xl',
        !narrow && !wide && 'max-w-7xl',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
