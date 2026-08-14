'use client'

import { Globe, Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

import { cn } from '@/lib/utils'
import { locales, type Locale } from '@/lib/i18n/config'

const emptySubscribe = () => () => {}
function useIsHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

function buildLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split('/')
  if (segments.length >= 2 && locales.includes(segments[1] as Locale)) {
    segments[1] = targetLocale
    return segments.join('/')
  }
  return `/${targetLocale}${pathname}`
}

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const isHydrated = useIsHydrated()

  if (!isHydrated) {
    return (
      <span
        className={cn('inline-flex size-9 items-center justify-center', className)}
        aria-hidden="true"
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full',
        'text-muted-foreground transition-colors hover:text-foreground',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      {isDark ? (
        <Sun className="size-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="size-[18px]" aria-hidden="true" />
      )}
    </button>
  )
}

interface CompactLanguageSwitcherProps {
  currentLocale: 'ar' | 'en'
  className?: string
}

export function CompactLanguageSwitcher({
  currentLocale,
  className,
}: CompactLanguageSwitcherProps) {
  const pathname = usePathname()
  const targetLocale = currentLocale === 'ar' ? 'en' : 'ar'
  const label = targetLocale.toUpperCase()
  const targetPath = buildLocalePath(pathname, targetLocale)

  return (
    <a
      href={targetPath}
      hrefLang={targetLocale}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground',
        'transition-colors hover:text-foreground',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
        className,
      )}
    >
      <Globe className="size-4" aria-hidden="true" />
      {label}
    </a>
  )
}
