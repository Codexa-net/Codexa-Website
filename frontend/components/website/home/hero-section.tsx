import Link from 'next/link'

import { cn } from '@/lib/utils'
import { type Locale } from '@/lib/i18n/config'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { FadeIn } from '@/components/shared/motion/fade-in'
import { buttonVariants } from '@/components/ui/Button'

interface HeroSectionProps {
  locale: Locale
  dict: Dictionary
}

interface ProjectPreviewCardProps {
  title: string
  category: string
  image: string
  badge: string
  href: string
  className?: string
}

function ProjectPreviewCard({
  title,
  category,
  image,
  badge,
  href,
  className,
}: ProjectPreviewCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative block overflow-hidden rounded-[var(--figma-radius-xl)] text-start',
        'border border-neutral-200/90 bg-white dark:border-white/10 dark:bg-zinc-900',
        'shadow-[0_20px_50px_-12px_rgba(75,63,223,0.18),0_4px_16px_-4px_rgba(0,0,0,0.06)]',
        'transition-all duration-300 hover:scale-[1.03] hover:border-[#4b3fdf]/40 hover:shadow-2xl',
        className,
      )}
    >
      <div className="flex h-7 items-center justify-between border-b border-neutral-200/80 bg-[#f6f5ff] px-3.5 dark:border-white/10 dark:bg-zinc-800/80">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#4b3fdf]/40 dark:bg-white/30" />
          <span className="size-2 rounded-full bg-neutral-300 dark:bg-white/15" />
          <span className="size-2 rounded-full bg-neutral-300 dark:bg-white/15" />
        </div>
        <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
          {badge}
        </span>
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-zinc-800">
        <img
          src={image}
          alt={title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
      </div>

      <div className="p-3.5">
        <span className="inline-block rounded-full bg-[#edeaff] px-2.5 py-0.5 text-[10px] font-bold text-[#4b3fdf] dark:bg-indigo-950/70 dark:text-indigo-300">
          {category}
        </span>
        <h3 className="mt-1.5 text-xs font-bold text-neutral-900 transition-colors group-hover:text-[#4b3fdf] dark:text-white line-clamp-1 sm:text-sm">
          {title}
        </h3>
      </div>
    </Link>
  )
}

export async function HeroSection({ locale, dict }: HeroSectionProps) {
  const { hero } = dict.home
  const isArabic = locale === 'ar'

  // جلب الصورة الحقيقية لمستشفى النور مباشرة من قاعدة البيانات
  let realHospitalCover = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
  try {
    const apiBase = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')
    const res = await fetch(`${apiBase}/projects?isPublic=true`, { cache: 'no-store' })
    if (res.ok) {
      const payload = await res.json()
      const list = Array.isArray(payload) ? payload : payload?.data
      if (Array.isArray(list)) {
        const hospitalProject = list.find((p: any) => 
          (p.name && (p.name.includes('نور') || p.name.toLowerCase().includes('nour'))) ||
          (p.title && (p.title.includes('نور') || p.title.toLowerCase().includes('nour')))
        )
        if (hospitalProject && (hospitalProject.cover || hospitalProject.image)) {
          realHospitalCover = hospitalProject.cover || hospitalProject.image
        }
      }
    }
  } catch (err) {
    console.error('تعذر جلب صورة مستشفى النور الحقيقية للهيرو:', err)
  }

  return (
    <Section
      id="hero"
      noContainer
      className={cn(
        'relative overflow-hidden py-0',
        'bg-background text-[var(--figma-title-dark)] dark:text-white',
        'min-h-[calc(100svh-4.5rem)]',
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -start-32 top-20 size-[420px] rounded-full bg-[var(--figma-accent-sky)]/20 blur-[100px] dark:bg-[var(--figma-accent-sky)]/15" />
        <div className="absolute -end-24 bottom-10 size-[380px] rounded-full bg-[var(--figma-accent-purple)]/15 blur-[90px] dark:bg-[var(--figma-accent-purple)]/12" />
      </div>

      <Container className="relative flex min-h-[calc(100svh-4rem)] items-center py-20">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_1.4fr_1fr] lg:gap-6">
          
          <FadeIn direction="right" className="hidden lg:block">
            <ProjectPreviewCard
              title={isArabic ? 'مستشفى النور التخصصي' : 'Al-Nour Hospital'}
              category={isArabic ? 'منظومة طبية ورعاية صحية' : 'Healthcare & Medical'}
              badge="Web App"
              image={realHospitalCover}
              href={`/${locale}/our-work`}
              className="ms-auto w-[230px] -rotate-6 transition-transform duration-500 hover:-rotate-2"
            />
          </FadeIn>

          <div className="mx-auto max-w-2xl text-center lg:max-w-none">
            <FadeIn direction="up" delay={0.05}>
              <h1
                className={cn(
                  'text-balance font-bold tracking-tight',
                  isArabic ? 'leading-[1.28]' : 'leading-[1.12]',
                  'text-[clamp(2.25rem,6vw,4.75rem)]',
                )}
              >
                {hero.title}
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.15}>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                {hero.description}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.25}>
              <Link
                href={`/${locale}#services`}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'mt-10 h-12 rounded-full px-10 text-base shadow-lg shadow-[#4b3fdf]/20',
                )}
              >
                {hero.cta}
              </Link>
            </FadeIn>
          </div>

          <FadeIn direction="left" className="hidden lg:block">
            <ProjectPreviewCard
              title={isArabic ? 'منصة الأستاذ التعليمية' : 'Al-Ostaz LMS'}
              category={isArabic ? 'منصات ويب وتعليم إلكتروني' : 'EdTech & E-Learning'}
              badge="Platform"
              image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
              href={`/${locale}/our-work`}
              className="w-[230px] rotate-6 transition-transform duration-500 hover:rotate-2"
            />
          </FadeIn>

        </div>
      </Container>
    </Section>
  )
}