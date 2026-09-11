import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { defaultLocale, isValidLocale } from '@/lib/i18n/config'

const EXCLUDED_PATHS = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
  '/dashboard',
  '/login',
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
  const token = request.cookies.get('accessToken')?.value

  // لو الطلب رايح للباك إند أو مسار تسجيل الدخول، عديه فوراً من غير توجيه
  if (pathname.startsWith('/api') || pathname.startsWith('/auth') || pathname === '/login') {
    return NextResponse.next()
  }

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginRoute = pathname === '/login'

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isExcluded(pathname)) return NextResponse.next()

  const localeInPath = getLocaleFromPathname(pathname)
  if (localeInPath) return NextResponse.next()

  const locale = defaultLocale
  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}