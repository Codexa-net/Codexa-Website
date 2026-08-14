import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { defaultLocale, isValidLocale } from '@/lib/i18n/config'

// Paths that should be excluded from locale redirect
const EXCLUDED_PATHS = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
  '/dashboard',
]

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PATHS.some((prefix) => pathname.startsWith(prefix))
}

function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/')
  const firstSegment = segments[1]
  return isValidLocale(firstSegment) ? firstSegment : null
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip excluded paths (Next.js internals, API, dashboard, static files)
  if (isExcluded(pathname)) return NextResponse.next()

  // If the path already has a valid locale prefix, allow through
  const localeInPath = getLocaleFromPathname(pathname)
  if (localeInPath) return NextResponse.next()

  // For the root path or any path without a locale, redirect to the default locale
  const locale = defaultLocale
  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
