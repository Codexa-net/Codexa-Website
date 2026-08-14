import { cn } from '@/lib/utils'

interface CodexaLogoProps {
  className?: string
  iconClassName?: string
  textClassName?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Codexa Brand Logo
 * Features the signature "C" arc with the integrated "x" mark in brand blue/indigo.
 */
export function CodexaLogo({
  className,
  iconClassName,
  textClassName,
  showText = true,
  size = 'md',
}: CodexaLogoProps) {
  const sizeClasses = {
    sm: 'size-7',
    md: 'size-9',
    lg: 'size-11',
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <span className={cn('inline-flex items-center gap-3 select-none', className)}>
      

      {/* Brand Name Text */}
      {showText && (
        <span
          className={cn(
            'font-bold tracking-tight text-foreground transition-colors',
            textSizeClasses[size],
            textClassName,
          )}
        >
          Codexa
        </span>
      )}

      {/* Icon Mark: C + x */}
      <span
        aria-hidden="true"
        className={cn(
          'relative flex shrink-0 items-center justify-center',
          sizeClasses[size],
          iconClassName,
        )}
      >
        <svg
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full"
        >
          {/* Outer 'C' Circle Arc */}
          <path
            d="M 24.5 9.5 A 12.5 12.5 0 1 0 24.5 28.5"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
            className="text-brand-500"
          />

          {/* 'x' mark nestled in the gap */}
          <path
            d="M 23 16 L 29 22 M 29 16 L 23 22"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
            className="text-brand-500"
          />
        </svg>
      </span>
    </span>
  )
}
