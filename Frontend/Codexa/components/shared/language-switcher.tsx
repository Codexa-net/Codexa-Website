'use client'

import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { localeNames, locales, type Locale } from '@/lib/i18n/config'

interface LanguageSwitcherProps {
  currentLocale: Locale
  className?: string
}

/**
 * Builds the equivalent path in the target locale by swapping the locale
 * segment. e.g. /ar/about → /en/about
 */
function buildLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split('/')
  // segments[0] is empty string (before leading slash)
  // segments[1] should be the current locale
  if (segments.length >= 2 && locales.includes(segments[1] as Locale)) {
    segments[1] = targetLocale
    return segments.join('/')
  }
  return `/${targetLocale}${pathname}`
}

/**
 * Language switcher — Arabic ↔ English.
 * Preserves the current route when switching locales.
 * Works on desktop and mobile, keyboard accessible, RTL-safe.
 */
export function LanguageSwitcher({ currentLocale, className }: LanguageSwitcherProps) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Language switcher"
      className={cn('flex items-center gap-1 text-sm font-medium', className)}
    >
      {locales.map((locale, index) => {
        const isActive = locale === currentLocale
        const targetPath = buildLocalePath(pathname, locale)

        return (
          <span key={locale} className="flex items-center">
            {index > 0 && (
              <span
                aria-hidden="true"
                className="mx-1.5 select-none text-muted-foreground"
              >
                |
              </span>
            )}
            {isActive ? (
              <span
                aria-current="true"
                className="cursor-default text-foreground"
              >
                {localeNames[locale]}
              </span>
            ) : (
              <a
                href={targetPath}
                hrefLang={locale}
                className={cn(
                  'text-muted-foreground transition-colors duration-150',
                  'hover:text-foreground focus-visible:text-foreground',
                  'rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                )}
              >
                {localeNames[locale]}
              </a>
            )}
          </span>
        )
      })}
    </nav>
  )
}
