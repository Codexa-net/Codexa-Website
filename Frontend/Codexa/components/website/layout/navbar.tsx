'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { CodexaLogo } from '@/components/shared/codexa-logo'
import { CompactLanguageSwitcher, ThemeToggle } from '@/components/shared/theme-toggle'

interface NavItem {
  labelKey: keyof Dictionary['nav']
  href: string
}

interface NavbarProps {
  locale: Locale
  dict: Dictionary
}

function buildNavItems(locale: Locale): NavItem[] {
  return [
    { labelKey: 'home', href: `/${locale}` },
    { labelKey: 'ourWork', href: `/${locale}/our-work` },
    { labelKey: 'clients', href: `/${locale}/clients` },
    { labelKey: 'about', href: `/${locale}/about` },
    { labelKey: 'contactUs', href: `/${locale}/contact` },
  ]
}

export function Navbar({ locale, dict }: NavbarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = buildNavItems(locale)

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setIsMobileOpen(false)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setIsMobileOpen(false)
  }

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}`
    if (href.includes('#')) return pathname === `/${locale}` && href.includes('#')
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--figma-border)] bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-[#05060f]/95">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 xl:px-16"
        >
          {/* Logo — start (right in RTL) */}
          <Link
            href={`/${locale}`}
            aria-label="Codexa — Home"
            className="shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CodexaLogo />
          </Link>

          {/* Center nav — desktop */}
          <ul role="list" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.labelKey}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium transition-colors',
                    'outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
                    isActive(item.href)
                      ? 'text-brand-500'
                      : 'text-[#4b515d] hover:text-foreground dark:text-gray-400 dark:hover:text-white',
                  )}
                >
                  {dict.nav[item.labelKey]}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-brand-500"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Utilities + CTA — end (left in RTL) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <CompactLanguageSwitcher
              currentLocale={locale}
              className="hidden sm:inline-flex"
            />
            <Link
              href={`/${locale}/contact`}
              className={cn(
                'hidden rounded-full border border-brand-500 px-4 py-2',
                'text-sm font-semibold text-brand-500 transition-colors',
                'hover:bg-brand-500/5',
                'outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'sm:inline-flex',
              )}
            >
              {dict.nav.startProject}
            </Link>

            <button
              type="button"
              aria-label={isMobileOpen ? dict.common.close : dict.nav.menu}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className={cn(
                'flex size-9 items-center justify-center rounded-md lg:hidden',
                'text-muted-foreground transition-colors hover:text-foreground',
                'outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              {isMobileOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              key="drawer"
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed inset-x-0 top-[72px] z-50 border-b border-border bg-white shadow-lg lg:hidden dark:bg-[#0d0b1f] dark:border-white/10"
            >
              <nav className="px-5 py-6">
                <ul role="list" className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <li key={item.labelKey}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex w-full rounded-md px-4 py-3 text-base font-medium',
                          isActive(item.href)
                            ? 'bg-[var(--figma-surface-lavender)] text-brand-500 dark:bg-[#1a1740] dark:text-brand-400'
                            : 'text-muted-foreground hover:bg-muted dark:text-gray-400 dark:hover:bg-white/5',
                        )}
                      >
                        {dict.nav[item.labelKey]}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
                  <ThemeToggle />
                  <CompactLanguageSwitcher currentLocale={locale} />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-[72px]" aria-hidden="true" />
    </>
  )
}
