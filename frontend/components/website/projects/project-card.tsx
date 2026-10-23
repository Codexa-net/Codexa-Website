'use client'

import { useState } from 'react'
import { ArrowUpRight, X, Layers, MessageCircle, CheckCircle2, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Project } from '@/types/project'
import { type Locale } from '@/lib/i18n/config'

interface ProjectCardProps {
  project: Project & { isShowcase?: boolean }
  locale: Locale
  viewLabel: string
  className?: string
}

export function ProjectCard({ project, locale, viewLabel, className }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const isArabic = locale === 'ar'

  const title =
    typeof project.title === 'object'
      ? project.title[locale]
      : project.name || project.title || (isArabic ? 'مشروع برمجي' : 'Software project')

  const category =
    typeof project.category === 'object'
      ? project.category[locale]
      : project.category || (isArabic ? 'أنظمة برمجية' : 'Software')

  const description =
    typeof project.description === 'object'
      ? project.description[locale]
      : project.description || project.shortDescription || ''

  const coverSrc = project.cover || (typeof project.image === 'string' ? project.image : '') || ''

  const rawTechs = project.technologies || (project as any).tech || []
  const techList: string[] = Array.isArray(rawTechs)
    ? rawTechs.map((tech: any) => (typeof tech === 'string' ? tech : tech?.name)).filter(Boolean)
    : []

  const services = (project as any).services
  const featuresList: string[] =
    typeof services === 'string'
      ? services
          .split('\n')
          .map((item: string) => item.trim().replace(/^[-*•]\s*/, ''))
          .filter(Boolean)
      : []

  const liveUrl = String((project as any).liveUrl || (project as any).link || '').trim()
  const hasLiveUrl = /^https?:\/\//i.test(liveUrl) && liveUrl !== '#'
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '201277158762'
  const whatsappText = encodeURIComponent(
    `${
      isArabic
        ? 'مرحباً كوديكسا، أود الاستفسار عن تفاصيل بناء نظام مماثل لـ'
        : 'Hello Codexa, I would like to request a system similar to'
    }: ${title}`,
  )
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappText}`

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      {/* ── الكارت الخارجي بحجم مدمج ومتناسق مع رفع التصنيف فوق الصورة ── */}
      <article
        id={String(project.id)}
        dir={isArabic ? 'rtl' : 'ltr'}
        className={cn(
          'group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-[#12112a] transition-all duration-300 hover:-translate-y-1 hover:border-[#4b3fdf]/60 hover:shadow-[0_12px_30px_-10px_rgba(75,63,223,0.3)] dark:border-white/10 dark:bg-[#12112a]/90',
          className,
        )}
        onClick={openModal}
      >
        {/* شريط التصنيف في الأعلى فوق الصورة حتى لا يغطي على الصورة نهائياً */}
        <div className="flex items-center justify-between gap-1.5 border-b border-white/10 bg-[#181636] px-2.5 py-2 sm:px-4 sm:py-2.5">
          <span className="truncate text-[9px] font-bold text-indigo-300 sm:text-[11px]">
            {category}
          </span>
          <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
        </div>

        {/* الصورة كاملة وواضحة بدون أي نصوص تغطي عليها */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-900">
          {coverSrc && !imageError ? (
            <img
              src={coverSrc}
              alt={title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full min-h-28 items-center justify-center bg-gradient-to-br from-[#1e1b4b] to-[#4338ca] p-4 text-center text-xs font-semibold text-white/80">
              {title}
            </div>
          )}
        </div>

        {/* تفاصيل الكارت بحجم متوازن وغير مبالغ فيه على الموبايل */}
        <div className="flex flex-1 flex-col justify-between space-y-2.5 p-3 sm:space-y-3.5 sm:p-4">
          <div className="space-y-1 sm:space-y-1.5">
            <h3 className="line-clamp-1 text-xs font-black text-white transition-colors group-hover:text-brand-400 sm:text-base">
              {title}
            </h3>
            {description && (
              <p className="line-clamp-2 text-[10px] leading-relaxed text-gray-400 sm:text-xs">
                {description}
              </p>
            )}
          </div>

          {techList.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5" dir="ltr">
              {techList.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[8.5px] font-bold text-gray-300 sm:px-2 sm:text-[10px]"
                >
                  {tech}
                </span>
              ))}
              {techList.length > 3 && (
                <span className="self-center text-[9px] font-bold text-gray-400">
                  +{techList.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto border-t border-white/10 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                openModal()
              }}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-white/10 px-2.5 py-1.5 text-[10px] font-bold text-white transition-all hover:bg-white hover:text-[#0d0b2c] sm:py-2 sm:text-xs"
            >
              <Layers className="size-3 shrink-0 sm:size-3.5" />
              <span className="truncate">
                {viewLabel || (isArabic ? 'عرض المشروع' : 'View Project')}
              </span>
            </button>
          </div>
        </div>
      </article>

      {/* ── نافذة المشروع من الداخل (Modal) ── */}
      {isOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md duration-200 sm:p-6"
          dir={isArabic ? 'rtl' : 'ltr'}
          onClick={closeModal}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-[24px] border border-white/15 bg-[#0a0a20]/95 p-5 text-start shadow-[0_25px_70px_rgba(0,0,0,0.8)] sm:rounded-[28px] sm:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute end-4 top-4 z-20 flex size-8 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:bg-white hover:text-black sm:size-9"
            >
              <X size={16} />
            </button>

            <div className="pe-10">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold text-white">
                {category}
              </span>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-inner">
              {coverSrc && !imageError ? (
                <img
                  src={coverSrc}
                  alt={title}
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-bold text-gray-500">
                  {title}
                </div>
              )}
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-300">
                <Sparkles size={14} />
                <span>{isArabic ? 'سابقة أعمال كودكسا' : 'Codexa Portfolio'}</span>
              </div>
              <h2 className="text-xl font-black tracking-wide text-white sm:text-3xl">{title}</h2>
            </div>

            {description && (
              <section className="space-y-1.5">
                <h3 className="text-xs font-bold text-gray-300 sm:text-sm">
                  {isArabic ? 'نبذة عن المشروع' : 'About this project'}
                </h3>
                <p className="whitespace-pre-line text-xs leading-relaxed text-gray-200 sm:text-sm">
                  {description}
                </p>
              </section>
            )}

            {featuresList.length > 0 && (
              <section className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <h3 className="text-xs font-bold text-brand-300 sm:text-sm">
                  {isArabic ? 'مميزات النظام' : 'Features'}
                </h3>
                <ul className="space-y-2 text-xs text-gray-200 sm:text-sm">
                  {featuresList.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {techList.length > 0 && (
              <section className="space-y-2 pt-1">
                <h3 className="text-xs font-bold tracking-wider text-gray-400">
                  {isArabic ? 'التقنيات المستخدمة (TECH STACK)' : 'Technologies'}
                </h3>
                <div className="flex flex-wrap gap-1.5" dir="ltr">
                  {techList.map((tech, index) => (
                    <span
                      key={index}
                      className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <div className="flex flex-col gap-2.5 pt-3 sm:flex-row">
              {hasLiveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-[#0d0b2c] shadow-lg transition-all hover:bg-gray-100"
                >
                  <span>{isArabic ? 'زيارة الموقع الحي' : 'Visit live website'}</span>
                  <ArrowUpRight className="size-4" />
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500"
              >
                <MessageCircle className="size-4" />
                <span>{isArabic ? 'طلب تنفيذ فكرة مشابهة' : 'Request a similar project'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}