import Link from 'next/link'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'

interface FooterProps {
  locale: Locale
  dict: Dictionary
}

/* ── Static data ─────────────────────────────────────────────── */

const socialLinks = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/201277158762',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.852L0 24l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.214-3.733.979.996-3.638-.234-.374A9.818 9.818 0 1112 21.818z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/codexa.egy?igsi=MTZ2Z2pkZ2M1amFvOA==',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/codexa.egy/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
      </svg>
    ), 
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/codexa-egy/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

function buildNavLinks(locale: Locale, dict: Dictionary) {
  return [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.services, href: `/${locale}#services` },
    { label: dict.nav.ourWork, href: `/${locale}/our-work` },
    { label: dict.nav.clients, href: `/${locale}/clients` },
    { label: dict.nav.about, href: `/${locale}/about` },
    { label: dict.nav.contactUs, href: `/${locale}/contact` }, // تم تعديلها لتوجه لصفحة التواصل
  ]
}

/* ── Component ───────────────────────────────────────────────── */

export function Footer({ locale, dict }: FooterProps) {
  const { footer, home } = dict
  const { contactCta } = home
  const navLinks = buildNavLinks(locale, dict)
  const isArabic = locale === 'ar'

  return (
    <footer
      role="contentinfo"
      dir={isArabic ? 'rtl' : 'ltr'}
      className="bg-[#05060f] text-white"
    >

      {/* ── CTA block ── */}
      <div id="contact" className="border-b border-white/[0.08] py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">

            {/* Eyebrow */}
            <p className="text-sm font-medium text-white/40">{contactCta.eyebrow}</p>

            {/* Headline */}
            <h2 className={cn(
              'mt-5 font-black leading-[1.15] tracking-tight text-white',
              'text-[clamp(2rem,5vw,3.5rem)]',
            )}>
              {contactCta.title}
            </h2>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {/* Primary CTA — يوجه الآن مباشرة لصفحة الفورم التفاعلي */}
              <Link
                href={`/${locale}/contact`}
                className={cn(
                  'inline-flex items-center gap-2.5 rounded-full bg-[#4b3fdf] px-7 py-3.5',
                  'text-sm font-bold text-white shadow-[0_12px_32px_-8px_rgba(75,63,223,0.6)]',
                  'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-8px_rgba(75,63,223,0.7)]',
                  'outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                )}
              >
                <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                {contactCta.cta}
              </Link>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/201277158762"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2.5 rounded-full border border-white/20 px-7 py-3.5',
                  'text-sm font-bold text-white/80',
                  'transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:text-white',
                  'outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                )}
              >
                <MessageCircle className="size-4 shrink-0 text-green-400" aria-hidden="true" />
                {contactCta.whatsapp}
              </a>
            </div>

          </div>
        </Container>
      </div>

      {/* ── Middle row: contact info + socials ←→ nav ── */}
      <Container className="py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul role="list" className="flex flex-wrap gap-x-6 gap-y-2.5">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/40 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact info + social icons */}
          <div className="flex flex-col items-end gap-4">
            <address className="not-italic">
              <ul role="list" className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-white/40">
                <li>
                  <a href="mailto:codexa.egy@gmail.com" className="transition-colors hover:text-white/70">
                    codexa.egy@gmail.com
                  </a>
                </li>
                <li className="text-white/20" aria-hidden="true">|</li>
                <li>
                  <a href="tel:01277158762" className="transition-colors hover:text-white/70">
                    01277158762
                  </a>
                </li>
                <li className="text-white/20" aria-hidden="true">|</li>
                <li className="text-white/40">{footer.contact.location}</li>
              </ul>
            </address>

            {/* Social icons */}
            <ul role="list" className="flex gap-2.5">
              {socialLinks.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={cn(
                      'flex size-9 items-center justify-center rounded-lg',
                      'border bg-black/10 border-white/12 text-white/40',
                      'transition-colors duration-200 hover:border-white/30 hover:text-white',
                    )}
                  >
                    {icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </Container>

      {/* ── Large wordmark ── */}
      <div className="overflow-hidden select-none" aria-hidden="true">
        <p className={cn(
          'text-center font-black leading-none tracking-tight h-83',
          'text-[clamp(20rem,5vw,15rem)]',
          'bg-gradient-to-b from-white/[0.92] to-white/[0.33] bg-clip-text text-transparent',
        )}>
          Codexa
        </p>
      </div>

      {/* ── Bottom bar ── */}
      <Container>
        <div className={cn(
          'flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] py-5',
          'sm:flex-row',
        )}>
          <p className="text-xs text-white/30">{footer.copyright}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-white/30">
            <Link href={`/${locale}/privacy`} className="transition-colors hover:text-white/60">
              {footer.legal.privacy}
            </Link>
            <span aria-hidden="true" className="text-white/15">|</span>
            <Link href={`/${locale}/terms`} className="transition-colors hover:text-white/60">
              {footer.legal.terms}
            </Link>
            <span aria-hidden="true" className="text-white/15">|</span>
            <span>{footer.legal.madeIn}</span>
          </div>
        </div>
      </Container>

    </footer>
  )
}