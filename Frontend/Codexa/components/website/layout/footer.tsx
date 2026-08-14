import Link from 'next/link'
import {
  ArrowUpRight,
  Briefcase,
  Camera,
  MessageCircle,
  Share2,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'

interface FooterProps {
  locale: Locale
  dict: Dictionary
}

const socialLinks = [
  { icon: Camera, label: 'Instagram', href: 'https://instagram.com/codexa' },
  { icon: Share2, label: 'TikTok', href: 'https://tiktok.com/@codexa' },
  { icon: Briefcase, label: 'LinkedIn', href: 'https://linkedin.com/company/codexa' },
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/966000000000' },
]

function buildNavLinks(locale: Locale, dict: Dictionary) {
  return [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.services, href: `/${locale}#services` },
    { label: dict.nav.ourWork, href: `/${locale}/our-work` },
    { label: dict.nav.clients, href: `/${locale}/clients` },
    { label: dict.nav.about, href: `/${locale}/about` },
    { label: dict.nav.contactUs, href: `/${locale}#contact` },
  ]
}

export function Footer({ locale, dict }: FooterProps) {
  const { footer, home } = dict
  const { contactCta } = home
  const navLinks = buildNavLinks(locale, dict)

  return (
    <footer role="contentinfo" className="bg-[#05060f] text-white">
      {/* CTA block */}
      <div id="contact" className="border-b border-white/10 py-20 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-white/50">{contactCta.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {contactCta.title}
            </h2>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${footer.contact.email}`}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5',
                  'text-sm font-semibold text-white transition-opacity hover:opacity-90',
                  'outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                )}
              >
                {contactCta.cta}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href={footer.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5',
                  'text-sm font-semibold text-white transition-colors hover:bg-white/5',
                  'outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                )}
              >
                {contactCta.whatsapp}
                <MessageCircle className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Nav + contact row */}
      <Container className="py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <nav aria-label="Footer navigation">
            <ul role="list" className="flex flex-wrap gap-x-6 gap-y-3">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4 sm:items-end">
            <address className="not-italic">
              <ul role="list" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50 sm:justify-end">
                <li>
                  <a href={`mailto:${footer.contact.email}`} className="hover:text-white">
                    {footer.contact.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${footer.contact.phone.replace(/\s/g, '')}`} className="hover:text-white">
                    {footer.contact.phone}
                  </a>
                </li>
                <li>{footer.contact.location}</li>
              </ul>
            </address>

            <ul role="list" className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors hover:border-white/30 hover:text-white"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Large wordmark */}
      <div className="overflow-hidden px-5 pb-6 pt-4 sm:px-8">
        <p
          aria-hidden="true"
          className={cn(
            'select-none text-center text-[clamp(4rem,18vw,11rem)] font-bold leading-none tracking-tight',
            'bg-gradient-to-b from-white/20 to-white/[0.04] bg-clip-text text-transparent',
          )}
        >
          Codexa
        </p>
      </div>

      {/* Bottom bar */}
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-white/40">{footer.copyright}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
            <Link href={`/${locale}/privacy`} className="hover:text-white/70">
              {footer.legal.privacy}
            </Link>
            <span aria-hidden="true">|</span>
            <Link href={`/${locale}/terms`} className="hover:text-white/70">
              {footer.legal.terms}
            </Link>
            <span aria-hidden="true">|</span>
            <span>{footer.legal.madeIn}</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
