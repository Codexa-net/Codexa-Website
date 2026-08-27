'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

import type { Locale } from '@/lib/i18n/config'

import heroImage from '@/public/images/projects/ammar/hero.jpg'
import logoSafeZone from '@/public/images/projects/ammar/logo-safe-zone.jpg'
import ammarLogo from '@/public/images/projects/ammar/logo.png'
import socialMedia from '@/public/images/projects/ammar/social-media.jpg'
import stickers from '@/public/images/projects/ammar/stickers.jpg'
import van from '@/public/images/projects/ammar/van.jpg'
import uniformMain from '@/public/images/projects/ammar/uniform-main.jpg'
import uniformGallery from '@/public/images/projects/ammar/uniform-gallery.jpg'

type Props = {
  locale: Locale
}

const ease = [0.22, 1, 0.36, 1] as const

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.82, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const cursorX = useSpring(-100, { stiffness: 400, damping: 28 })
  const cursorY = useSpring(-100, { stiffness: 400, damping: 28 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('article') ||
        target.closest('[role="button"]') ||
        target.closest('.interactive-hover')
      ) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [cursorX, cursorY])

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-50 rounded-full mix-blend-difference hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: isHovered ? 48 : 18,
        height: isHovered ? 48 : 18,
        backgroundColor: isHovered ? '#32BE8F' : '#5145e8',
        opacity: 0.85,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    />
  )
}

export function AmmarProjectPage({ locale }: Props) {
  const isArabic = locale === 'ar'

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="overflow-x-clip bg-white text-[#17132f] dark:bg-[#090815] dark:text-white relative"
    >
      <CustomCursor />
      <HeroSection isArabic={isArabic} />
      <OverviewSection isArabic={isArabic} />
      <IdentitySection isArabic={isArabic} />
      <ColorsSection isArabic={isArabic} />
      <TypographySection isArabic={isArabic} />
      <DesignsSection isArabic={isArabic} />
      <RelatedProjectsSection isArabic={isArabic} />
    </div>
  )
}

function HeroSection({ isArabic }: { isArabic: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const visualY = useTransform(scrollYProgress, [0, 1], [0, 110])
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.48])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100svh-72px)] border-b border-[#f0eef7] dark:border-white/10"
    >
      <div
        className="mx-auto grid min-h-[calc(100svh-72px)] max-w-[1440px] items-center gap-10 px-5 py-14 sm:px-8 md:px-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16 lg:px-16 lg:py-16 xl:px-20"
        style={{ direction: 'ltr' }}
      >
        <motion.div
          style={{ y: visualY, scale: visualScale, opacity }}
          initial={{ opacity: 0, x: -85, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.05, ease }}
          className="order-2 lg:order-1"
        >
          <div className="mx-auto w-full max-w-[665px] overflow-hidden rounded-[24px] shadow-[0_26px_60px_-28px_rgba(22,19,47,0.23)]">
            <Image
              src={heroImage}
              alt="عمار - Ammar project visual identity"
              priority
              placeholder="blur"
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 92vw, 47vw"
            />
          </div>
        </motion.div>

        <motion.div
          style={{ y: copyY }}
          initial={{ opacity: 0, y: 55 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.15, ease }}
          dir={isArabic ? 'rtl' : 'ltr'}
          className={`order-1 flex flex-col justify-center lg:order-2 ${isArabic ? 'text-right' : 'text-left'}`}
        >
          <h1 className="font-display text-[88px] font-black leading-[0.92] tracking-[-0.07em] text-[#5145e8] sm:text-[118px] lg:text-[132px] xl:text-[152px]">
            {isArabic ? 'عمار' : 'Ammar'}
          </h1>

          <p className={`mt-7 max-w-[610px] text-[15px] leading-[2.05] text-[#6a6d7b] dark:text-white/65 sm:text-[16px] lg:text-[17px] ${isArabic ? 'ml-auto' : 'mr-auto'}`}>
            {isArabic
              ? 'ابتكرنا لعمار هوية بصرية ومواقع وتطبيقات وتسويق وفيديو وتصوير، وحققنا في التفاصيل تجربة متكاملة تساعد العلامة على الظهور بشكل واضح ومميز.'
              : 'For Ammar, we built a complete visual and digital experience spanning identity, applications, marketing, video and photography, with every detail designed to make the brand clear and memorable.'}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <p className="whitespace-nowrap text-[10px] text-[#737684] dark:text-white/50">
          {isArabic ? 'اسحب للأسفل لاكتشاف المشروع' : 'Scroll down to discover the project'}
        </p>
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-1 inline-block text-sm text-[#5145e8]"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  )
}

function OverviewSection({ isArabic }: { isArabic: boolean }) {
  const cards = isArabic
    ? [
        {
          number: '01',
          title: 'التحدي',
          text: 'تجربة الغسيل والعناية الصحية كانت مرتبطة في ذهن العميل بالبحث عن خدمة موثوقة وسريعة وسهلة، وكان التحدي أن تبدو العلامة احترافية وقريبة في الوقت نفسه.',
        },
        {
          number: '02',
          title: 'رؤيتنا',
          text: 'ركزنا على بناء تجربة بسيطة ومرنة، من سهولة اكتشاف الخدمة المناسبة وحتى استخدام الهوية عبر التطبيق والمنصات والمواد المختلفة.',
        },
        {
          number: '03',
          title: 'النتيجة',
          text: 'أطلقنا منصة وهوية متكاملة تجمع بين البساطة والوضوح، وتمنح عمار حضورًا مميزًا يمكن تطويره عبر كل نقاط التواصل.',
        },
      ]
    : [
        {
          number: '01',
          title: 'Challenge',
          text: 'Laundry and garment care needed to feel trustworthy, fast and effortless. The challenge was to create a brand that looked professional while staying friendly and approachable.',
        },
        {
          number: '02',
          title: 'Our vision',
          text: 'We focused on a simple, flexible experience, from discovering the right service to applying the identity consistently across the app, digital channels and physical materials.',
        },
        {
          number: '03',
          title: 'Result',
          text: 'A cohesive platform and identity built around clarity and simplicity, giving Ammar a distinctive system that can grow across every touchpoint.',
        },
      ]

  return (
    <section className="px-5 py-28 sm:px-8 md:px-12 lg:py-36 xl:py-40">
      <div className="mx-auto max-w-[1280px]">
        <Reveal className="mx-auto max-w-[780px] text-center">
          <h2 className="font-display text-4xl font-black sm:text-5xl lg:text-[56px]">
            {isArabic ? 'عمار' : 'Ammar'}
          </h2>
          <p className="mt-5 text-[14px] leading-[2.05] text-[#6e7180] dark:text-white/60 sm:text-[15px]">
            {isArabic
              ? 'عمار منصة للعناية بالملابس تجمع راحة العميل في مكان واحد؛ من اكتشاف الخدمة والحجز والمتابعة وحتى استلام الطلب. صممنا التجربة لتكون بسيطة وقابلة للتوسع.'
              : 'Ammar is a garment-care platform that brings discovery, booking, tracking and delivery into one clear experience. We designed it to feel simple today and scalable tomorrow.'}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-3 lg:mt-20">
          {cards.map((card, index) => (
            <motion.article
              key={card.number}
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.72, delay: index * 0.1, ease }}
              whileHover={{ y: -7 }}
              className="min-h-[175px] rounded-[16px] border border-[#e8e5f3] bg-white p-6 dark:border-white/10 dark:bg-white/[0.025]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[17px] font-bold sm:text-[18px]">{card.title}</h3>
                <span className="pt-1 text-[10px] text-[#5145e8]">{card.number}</span>
              </div>
              <p className="mt-5 text-[12px] leading-[2] text-[#6e7180] dark:text-white/58 sm:text-[13px]">
                {card.text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function IdentitySection({ isArabic }: { isArabic: boolean }) {
  return (
    <section className="px-5 pb-28 sm:px-8 md:px-12 lg:pb-40">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <h2 className="text-center font-display text-4xl font-black sm:text-5xl lg:text-[54px]">
            {isArabic ? (
              <>
                هوية <span className="text-[#5145e8]">عمار</span> وشعارها
              </>
            ) : (
              <>
                <span className="text-[#5145e8]">Ammar</span> identity & logo
              </>
            )}
          </h2>
        </Reveal>

        <div
          className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16"
          style={{ direction: 'ltr' }}
        >
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease }}
          >
            <Image
              src={logoSafeZone}
              alt="Ammar logo safe zone"
              placeholder="blur"
              className="h-auto w-full"
              sizes="(max-width: 1024px) 92vw, 45vw"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, delay: 0.08, ease }}
            className="flex justify-center"
          >
            <Image
              src={ammarLogo}
              alt="Ammar logo"
              className="h-auto w-full max-w-[690px]"
              sizes="(max-width: 1024px) 92vw, 48vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ColorsSection({ isArabic }: { isArabic: boolean }) {
  const colors = [
    { name: 'Cloud White', hex: '#F6F3FF', value: '#F6F3FF', darkText: true },
    { name: 'Mint Calm', hex: '#32BE8F', value: '#32BE8F', darkText: true },
    { name: 'Soft Lavender', hex: '#B6A7F7', value: '#B6A7F7', darkText: true },
    { name: 'Violet Trust', hex: '#6C27DE', value: '#6C27DE', darkText: false },
  ]

  return (
    <section className="px-5 py-24 sm:px-8 md:px-12 lg:py-32">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <h2 className="text-center font-display text-4xl font-black sm:text-5xl lg:text-[54px]">
            {isArabic ? 'اختياراتنا اللونية' : 'Our color choices'}
          </h2>
        </Reveal>

        <div
          className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-4"
          style={{ direction: 'ltr' }}
        >
          {colors.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.68, delay: index * 0.08, ease }}
              whileHover={{ y: -8, scale: 1.012 }}
              className="relative aspect-[0.74] overflow-hidden rounded-[13px] border border-black/[0.025]"
              style={{ backgroundColor: color.value }}
            >
              <div
                className={`absolute bottom-4 start-4 text-[10px] sm:bottom-5 sm:start-5 sm:text-xs ${
                  color.darkText ? 'text-[#17132f]' : 'text-white'
                }`}
              >
                <div className="font-semibold">{color.name}</div>
                <div className="mt-0.5 opacity-70">{color.hex}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TypographySection({ isArabic }: { isArabic: boolean }) {
  const rows = [
    { label: 'Bold — 900', weight: 900 },
    { label: 'Medium — 700', weight: 700 },
    { label: 'Regular — 400', weight: 400 },
  ]

  return (
    <section className="px-5 pb-24 pt-10 sm:px-8 md:px-12 lg:pb-32">
      <div className="mx-auto max-w-[1280px]">
        <Reveal
          className={`max-w-[660px] ${isArabic ? 'ml-auto text-right' : 'mr-auto text-left'}`}
        >
          <p className="text-[11px] text-[#6f7280] dark:text-white/50">
            {isArabic ? 'التايبوغرافي' : 'Typography'}
          </p>
          <h2 className="mt-4 text-[38px] font-medium leading-none tracking-[-0.035em] sm:text-[52px] lg:text-[64px]">
            Omnes Arabic Hairline
          </h2>
          <p className="mt-4 text-[12px] leading-[2] text-[#6f7280] dark:text-white/58 sm:text-[13px]">
            {isArabic
              ? 'خط Omnes Arabic Hairline هو خط واضح ومريح يدعم شخصية عمار البسيطة والودودة. استخدمنا أوزانًا مختلفة لصناعة تسلسل بصري واضح بين العناوين والنصوص.'
              : 'Omnes Arabic Hairline supports Ammar’s clean, friendly personality. Multiple weights create a clear hierarchy across headings, labels and body copy.'}
          </p>
        </Reveal>

        <div
          className="mt-10 border-t border-[#ecebf0] dark:border-white/10"
          style={{ direction: 'ltr' }}
        >
          {rows.map((row, index) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.72, delay: index * 0.07, ease }}
              className="grid min-h-[180px] grid-cols-[1fr_auto] items-center border-b border-[#ecebf0] dark:border-white/10 sm:min-h-[210px] lg:min-h-[230px]"
            >
              <div className="flex justify-end pe-8 sm:pe-12 lg:pe-16">
                <span className="text-[10px] text-[#72747f] dark:text-white/48 sm:text-[11px]">
                  {row.label}
                </span>
              </div>
              <span
                className="min-w-[160px] text-right text-[88px] leading-none tracking-[-0.07em] sm:min-w-[210px] sm:text-[118px] lg:min-w-[245px] lg:text-[138px]"
                style={{ fontWeight: row.weight }}
              >
                Aa
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DesignsSection({ isArabic }: { isArabic: boolean }) {
  const galleryRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  })
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    isArabic ? ['-3%', '10%'] : ['3%', '-10%'],
  )

  const designs = [
    { src: uniformGallery, alt: 'Ammar uniform branding' },
    { src: van, alt: 'Ammar vehicle branding' },
    { src: stickers, alt: 'Ammar illustration system' },
    { src: socialMedia, alt: 'Ammar social media designs' },
  ]

  return (
    <section ref={galleryRef} className="py-24 lg:py-32">
      <div className="px-5 text-center sm:px-8 md:px-12">
        <Reveal>
          <h2 className="font-display text-4xl font-black sm:text-5xl lg:text-[54px]">
            {isArabic ? (
              <>
                تصميمات <span className="text-[#5145e8]">عمار</span>
              </>
            ) : (
              <>
                <span className="text-[#5145e8]">Ammar</span> designs
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[12px] leading-[2] text-[#70727f] dark:text-white/55 sm:text-[13px]">
            {isArabic
              ? 'محتوى بصري وهوية عملية تم تطويرهما ليتحركا بين التطبيق، المركبات، الزي، والمحتوى الاجتماعي بصورة واحدة متماسكة.'
              : 'A flexible visual system carried across the app, vehicles, uniforms and social content as one consistent brand experience.'}
          </p>
        </Reveal>
      </div>

      <div className="mt-12 overflow-hidden lg:mt-16 cursor-grab active:cursor-grabbing">
        <motion.div
          style={{ x, direction: 'ltr' }}
          drag="x"
          dragConstraints={{ left: -600, right: 100 }}
          whileTap={{ cursor: 'grabbing' }}
          className="flex w-max gap-4 px-5 sm:px-8 md:px-12 lg:gap-5 lg:px-[4vw] touch-pan-y"
        >
          {designs.map((design, index) => (
            <motion.div
              key={design.alt}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, delay: index * 0.08, ease }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative h-[330px] w-[270px] shrink-0 overflow-hidden rounded-[18px] sm:h-[410px] sm:w-[340px] lg:h-[500px] lg:w-[420px] shadow-lg hover:shadow-2xl transition-shadow"
            >
              <Image
                src={design.src}
                alt={design.alt}
                fill
                placeholder="blur"
                className="object-cover pointer-events-none select-none"
                sizes="(max-width: 640px) 270px, (max-width: 1024px) 340px, 420px"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function RelatedProjectsSection({ isArabic }: { isArabic: boolean }) {
  const projects = isArabic
    ? [
        { name: 'مشروع أول', meta: 'هوية بصرية · 2025' },
        { name: 'مشروع ثاني', meta: 'تطبيق موبايل · 2025' },
        { name: 'مشروع ثالث', meta: 'هوية بصرية · 2024' },
      ]
    : [
        { name: 'Project One', meta: 'Brand identity · 2025' },
        { name: 'Project Two', meta: 'Mobile app · 2025' },
        { name: 'Project Three', meta: 'Brand identity · 2024' },
      ]

  return (
    <section className="px-5 pb-20 pt-16 sm:px-8 md:px-12 lg:pb-28 lg:pt-24">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <p className="text-[11px] text-[#5145e8]">
            {isArabic ? 'مشاريع ذات صلة' : 'Related projects'}
          </p>
          <h2 className="mt-3 max-w-[660px] font-display text-4xl font-black leading-[1.2] sm:text-5xl lg:text-[54px]">
            {isArabic ? 'المزيد من الأعمال في المجال نفسه' : 'More work in the same field'}
          </h2>
        </Reveal>

        <div className="mt-10 border-t border-[#ecebf0] dark:border-white/10">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.07, ease }}
              whileHover={{ x: isArabic ? -8 : 8 }}
              className="grid min-h-[105px] grid-cols-[1fr_auto] items-center border-b border-[#ecebf0] dark:border-white/10 md:grid-cols-[1fr_auto_auto]"
            >
              <h3 className="text-[21px] font-black sm:text-[24px]">{project.name}</h3>
              <span className="hidden text-[11px] text-[#72747f] dark:text-white/45 md:block">{project.meta}</span>
              <span className="ms-5 flex size-14 items-center justify-center rounded-full border border-[#5145e8]/20 bg-[#5145e8]/10 text-[11px] text-[#5145e8]">
                {isArabic ? 'عرض' : 'View'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
