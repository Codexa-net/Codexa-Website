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

  const title = project.name || project.title || (isArabic ? 'مشروع برمجي' : 'Software project')
  const category = project.category || (isArabic ? 'أنظمة برمجية' : 'Software')
  const description = project.description || project.shortDescription || ''
  const coverSrc = project.cover || project.image || ''

  const rawTechs = project.technologies || (project as any).tech || []
  const techList: string[] = Array.isArray(rawTechs)
    ? rawTechs.map((tech: any) => (typeof tech === 'string' ? tech : tech?.name)).filter(Boolean)
    : []

  const services = (project as any).services
  const featuresList: string[] = typeof services === 'string'
    ? services.split('\n').map((item: string) => item.trim().replace(/^[-*•]\s*/, '')).filter(Boolean)
    : []

  const liveUrl = String((project as any).liveUrl || (project as any).link || '').trim()
  const hasLiveUrl = /^https?:\/\//i.test(liveUrl) && liveUrl !== '#'
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '201277158762'
  const whatsappText = encodeURIComponent(
    `${isArabic ? 'مرحباً كوديكسا، أود الاستفسار عن تفاصيل بناء نظام مماثل لـ' : 'Hello Codexa, I would like to request a system similar to'}: ${title}`
  )
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappText}`

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      {/* ── الكارت الخارجي (تم إضافة h-full ليأخذ نفس طول باقي الكروت) ── */}
      <article
        id={String(project.id)}
        dir={isArabic ? 'rtl' : 'ltr'}
        className={cn(
          'group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12112a]/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#4b3fdf]/50 hover:shadow-[0_12px_30px_-10px_rgba(75,63,223,0.3)]',
          className
        )}
        onClick={openModal}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 shrink-0">
          {coverSrc && !imageError ? (
            <img
              src={coverSrc}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full min-h-40 items-center justify-center bg-gradient-to-br from-[#1e1b4b] to-[#4338ca] p-6 text-center text-sm font-semibold text-white/80">
              {title}
            </div>
          )}
          <span className="absolute start-3 top-3 rounded-full border border-white/10 bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
            {category}
          </span>
        </div>

        {/* الحاوية الداخلية تملأ المساحة المتبقية لدفع الزر للأسفل */}
        <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-white transition-colors group-hover:text-brand-400">{title}</h3>
            {description && <p className="line-clamp-2 text-xs leading-relaxed text-gray-400">{description}</p>}
          </div>

          {techList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1" dir="ltr">
              {techList.slice(0, 4).map((tech, index) => (
                <span key={index} className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-gray-300">
                  {tech}
                </span>
              ))}
              {techList.length > 4 && <span className="self-center text-[10px] font-bold text-gray-500">+{techList.length - 4}</span>}
            </div>
          )}

          <div className="border-t border-white/5 pt-2 mt-auto">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); openModal(); }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-white hover:text-[#0d0b2c]"
            >
              <Layers className="size-3.5" />
              <span>{viewLabel || (isArabic ? 'عرض تفاصيل المشروع' : 'View project details')}</span>
            </button>
          </div>
        </div>
      </article>

      {/* ── نافذة المشروع من الداخل (Modal) ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6 animate-in fade-in duration-200"
          dir={isArabic ? 'rtl' : 'ltr'}
          onClick={closeModal}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl space-y-6 overflow-y-auto rounded-[28px] border border-white/15 bg-[#0a0a20]/95 p-6 text-start shadow-[0_25px_70px_rgba(0,0,0,0.8)] sm:p-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute end-4 top-4 z-20 flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white hover:bg-white hover:text-black transition-colors"
            >
              <X size={18} />
            </button>

            <div className="pe-12">
              <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-bold text-white">{category}</span>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-inner">
              {coverSrc && !imageError ? (
                <img
                  src={coverSrc}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-bold text-gray-500">
                  {title}
                </div>
              )}
            </div>

            <div className="space-y-1 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-300">
                <Sparkles size={14} />
                <span>{isArabic ? 'سابقة أعمال كودكسا' : 'Codexa Portfolio'}</span>
              </div>
              <h2 className="text-2xl font-black tracking-wide text-white sm:text-3xl">{title}</h2>
            </div>

            {description && (
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-gray-300">{isArabic ? 'نبذة عن المشروع' : 'About this project'}</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-200">{description}</p>
              </section>
            )}

            {featuresList.length > 0 && (
              <section className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <h3 className="text-sm font-bold text-brand-300">{isArabic ? 'مميزات النظام' : 'Features'}</h3>
                <ul className="space-y-2 text-sm text-gray-200">
                  {featuresList.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {techList.length > 0 && (
              <section className="space-y-2 pt-2">
                <h3 className="text-xs font-bold tracking-wider text-gray-400">{isArabic ? 'التقنيات المستخدمة (TECH STACK)' : 'Technologies'}</h3>
                <div className="flex flex-wrap gap-2" dir="ltr">
                  {techList.map((tech, index) => (
                    <span key={index} className="rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-xs font-bold text-white">
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              {hasLiveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-xs font-bold text-[#0d0b2c] hover:bg-gray-100 transition-all shadow-lg">
                  <span>{isArabic ? 'زيارة الموقع الحي' : 'Visit live website'}</span>
                  <ArrowUpRight className="size-4" />
                </a>
              )}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all">
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