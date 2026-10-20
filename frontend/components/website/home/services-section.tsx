'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  Camera,
  ChevronDown,
  Globe,
  Smartphone,
  Star,
  Video,
  ArrowUpRight,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageCircle,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Dictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { Reveal } from '@/components/shared/motion/reveal'

interface ServicesSectionProps {
  dict: Dictionary
}

const serviceIcons = [Globe, Smartphone, Star, BarChart3, Video, Camera] as const

// تفاصيل إضافية شاملة تظهر للعميل عند الضغط على "اعرف أكثر عن الخدمة"
const SERVICE_EXTRA_DETAILS = [
  {
    durationAr: 'من 2 إلى 5 أسابيع حسب حجم المنصة',
    durationEn: '2 to 5 weeks depending on platform scale',
    deliverablesAr: [
      'تصميم واجهات مستخدم سريعة ومتجاوبة 100% مع جميع الهواتف والشاشات.',
      'بناء هندسي حديث باستخدام Next.js و React لأعلى سرعة تحميل وتصدر نتائج البحث (SEO).',
      'لوحة تحكم سهلة لإدارة المحتوى والصفحات والبيانات بدون تعقيد تقني.',
      'حماية وأمان عالي للبيانات مع شهادة SSL وتجربة أداء شاملة قبل الإطلاق.',
    ],
    deliverablesEn: [
      '100% responsive UI/UX across mobile, tablet, and desktop screens.',
      'Modern engineering with Next.js & React for top speed and SEO ranking.',
      'Intuitive admin dashboard to manage content and data effortlessly.',
      'Enterprise-grade security, SSL setup, and full QA testing before launch.',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'SEO'],
  },
  {
    durationAr: 'من 4 إلى 8 أسابيع (شامل الرفع على المتاجر)',
    durationEn: '4 to 8 weeks (including App Store & Play Store launch)',
    deliverablesAr: [
      'تطبيقات تعمل بكفاءة فائقة على نظامي iOS و Android من كود برمجي موحد ونظيف.',
      'ربط كامل مع الإشعارات الفورية (Push Notifications) والخرائط وبوابات الدفع.',
      'تجربة مستخدم سلسة وسريعة الاستجابة تضمن بقاء المستخدم داخل التطبيق.',
      'رفع التطبيق رسمياً على Google Play و Apple App Store مع الدعم الفني.',
    ],
    deliverablesEn: [
      'High-performance iOS & Android apps built with clean architecture.',
      'Full integration with Push Notifications, Maps, and Payment Gateways.',
      'Smooth, native-feel UX designed for high user retention.',
      'End-to-end publishing on Google Play and Apple App Store.',
    ],
    techStack: ['Flutter', 'React Native', 'iOS', 'Android', 'Firebase', 'REST APIs'],
  },
  {
    durationAr: 'من 3 إلى 6 أسابيع',
    durationEn: '3 to 6 weeks',
    deliverablesAr: [
      'متجر إلكتروني متكامل يدعم آلاف المنتجات والتصنيفات والفلاتر الذكية.',
      'ربط مباشر مع بوابات الدفع الإلكتروني (فيزا، فوري، محافظ إلكترونية، تقسيط).',
      'تكامل آلي مع شركات الشحن وإدارة المخزون والفواتير الضريبية.',
      'لوحة تقارير مبيعات وتحليلات تفصيلية لمتابعة الأرباح والطلبات لحظياً.',
    ],
    deliverablesEn: [
      'Full-featured online store supporting smart filters and product variants.',
      'Direct integration with online payment gateways and installment plans.',
      'Automated shipping APIs, inventory tracking, and invoicing.',
      'Real-time sales analytics and order management dashboard.',
    ],
    techStack: ['Next.js Commerce', 'Paymob / Stripe', 'Shipping APIs', 'Inventory ERP', 'Redis'],
  },
  {
    durationAr: 'من 4 إلى 10 أسابيع حسب الوحدات الإدارية',
    durationEn: '4 to 10 weeks depending on modules',
    deliverablesAr: [
      'نظام إداري سحابي مخصص (ERP / CRM / Dashboard) يناسب دورة عمل شركتك بالضبط.',
      'نظام صلاحيات متعدد المستويات (Role-Based Access) للمديرين والموظفين والعملاء.',
      'تقارير مالية وإحصائيات تفاعلية تساعد الإدارة على اتخاذ قرارات دقيقة.',
      'أتمتة العمليات اليومية وتقليل الأخطاء البشرية مع نسخ احتياطي آمن للبيانات.',
    ],
    deliverablesEn: [
      'Custom cloud ERP, CRM, and operational dashboards tailored to your workflow.',
      'Role-Based Access Control (RBAC) for admins, staff, and clients.',
      'Interactive financial and operational analytics reports.',
      'Workflow automation and automated secure database backups.',
    ],
    techStack: ['React', 'NestJS / Node.js', 'PostgreSQL / MySQL', 'RBAC', 'Analytics'],
  },
  {
    durationAr: 'من 1 إلى 3 أسابيع',
    durationEn: '1 to 3 weeks',
    deliverablesAr: [
      'فيديوهات ترويجية وموشن جرافيك احترافية تشرح فكرة مشروعك أو خدمتك بوضوح.',
      'مونتاج ديناميكي مخصص لمنصات التواصل الاجتماعي (Reels / TikTok / YouTube) لزيادة التفاعل.',
      'تصحيح ألوان وهندسة صوتية نقية مع مؤثرات بصرية جذابة.',
      'تسليم الفيديوهات بجميع المقاسات والجودات المناسبة للحملات الإعلانية.',
    ],
    deliverablesEn: [
      'Promo videos and motion graphics that clearly explain your product.',
      'High-retention editing optimized for Reels, TikTok, and YouTube.',
      'Professional color grading, sound design, and visual effects.',
      'Multi-format exports ready for paid ad campaigns.',
    ],
    techStack: ['After Effects', 'Premiere Pro', 'Motion Graphics', 'Color Grading', 'Sound Design'],
  },
  {
    durationAr: 'من 2 إلى 4 أسابيع',
    durationEn: '2 to 4 weeks',
    deliverablesAr: [
      'بناء هوية بصرية كاملة (شعار، ألوان، خطوط، ودليل استخدام الهوية Brand Guidelines).',
      'تصميم واجهات وتجربة مستخدم (UI/UX) تفاعلية على Figma قابلة للتجربة قبل البرمجة.',
      'بناء نظام تصميم (Design System) موحد يضمن تناسق جميع صفحات وشاشات مشروعك.',
      'تصاميم سوشيال ميديا ومطبوعات تعكس قوة واحترافية علامتك التجارية.',
    ],
    deliverablesEn: [
      'Complete visual identity (Logo, Color Palette, Typography, Brand Guidelines).',
      'Interactive UI/UX prototypes in Figma ready for user testing.',
      'Scalable Design System ensuring consistency across all screens.',
      'Social media and marketing assets that elevate your brand presence.',
    ],
    techStack: ['Figma', 'UI/UX Research', 'Design System', 'Prototyping', 'Brand Identity'],
  },
]

export function ServicesSection({ dict }: ServicesSectionProps) {
  const { services } = dict.home
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [modalIndex, setModalIndex] = useState<number | null>(null)

  // اكتشاف اللغة من النص لعمل محاذاة وترجمة دقيقة داخل النافذة المنبثقة
  const isArabic = /[\u0600-\u06FF]/.test(services.title)

  function toggleItem(index: number) {
    setOpenIndex((current) => (current === index ? null : index))
  }

  // إغلاق النافذة عند الضغط على زر Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setModalIndex(null)
    }
    if (modalIndex !== null) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalIndex])

  const activeModalItem = modalIndex !== null ? services.items[modalIndex] : null
  const activeExtra =
    modalIndex !== null
      ? SERVICE_EXTRA_DETAILS[modalIndex % SERVICE_EXTRA_DETAILS.length]
      : null
  const ActiveModalIcon =
    modalIndex !== null ? serviceIcons[modalIndex % serviceIcons.length] : Globe

  return (
    <Section id="services" noContainer className="bg-white py-16 sm:py-20 md:py-28 dark:bg-[#0d0b1f]">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-[#4b3fdf] dark:text-indigo-400">
              {services.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-black leading-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] dark:text-white">
              {services.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:mt-5 sm:text-lg dark:text-gray-300">
              {services.description}
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 max-w-3xl space-y-3 sm:mt-12">
          {services.items.map((item, index) => {
            const Icon = serviceIcons[index % serviceIcons.length]
            const isOpen = openIndex === index
            const number = String(index + 1).padStart(2, '0')

            return (
              <Reveal key={item.title} delay={index * 0.05}>
                <article
                  className={cn(
                    'overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10',
                    'bg-white shadow-sm transition-all duration-300 dark:bg-white/5',
                    isOpen && 'border-[#4b3fdf]/30 shadow-md dark:bg-white/10',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center gap-3.5 p-4 text-start sm:gap-4 sm:p-6"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                        isOpen
                          ? 'bg-[#4b3fdf] text-white'
                          : 'bg-[#edeaff] text-[#4b3fdf] dark:bg-[#4b3fdf]/20 dark:text-indigo-400',
                      )}
                    >
                      <Icon className="size-5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <span className="text-xl font-bold text-[#4b3fdf]/40 sm:text-3xl dark:text-indigo-400/30">
                          {number}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-gray-900 sm:text-lg dark:text-white">
                            {item.title}
                          </h3>
                          {!isOpen && (
                            <p className="mt-1 line-clamp-1 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                              {item.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-full transition-all',
                        isOpen
                          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                          : 'text-gray-400 dark:text-gray-500',
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          'size-4 transition-transform duration-300',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-4 pb-5 pt-3 sm:px-6 sm:pb-6 dark:border-white/10">
                      <p className="text-xs leading-relaxed text-gray-600 sm:text-base dark:text-gray-300">
                        {item.description}
                      </p>

                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* زر اعرف أكثر عن الخدمة — يفتح الآن نافذة التفاصيل الكاملة */}
                      <button
                        type="button"
                        onClick={() => setModalIndex(index)}
                        className="mt-5 inline-flex cursor-pointer items-center gap-1.5 rounded-lg py-1 text-xs font-bold text-[#4b3fdf] transition-colors hover:text-indigo-700 sm:text-sm dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <span>{services.learnMore}</span>
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>

      {/* ── نافذة تفاصيل الخدمة التفاعلية (Service Details Modal) ── */}
      {activeModalItem && activeExtra && modalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          dir={isArabic ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs sm:items-center sm:p-4"
          onClick={() => setModalIndex(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90svh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-gray-200 bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7 dark:border-white/15 dark:bg-[#131129]"
          >
            {/* رأس النافذة */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4 dark:border-white/10">
              <div className="flex items-center gap-3.5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#4b3fdf] text-white shadow-md shadow-[#4b3fdf]/30">
                  <ActiveModalIcon className="size-6" />
                </span>
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4b3fdf] dark:text-indigo-400">
                    <Sparkles className="size-3.5" />
                    {isArabic
                      ? `خدمة 0${modalIndex + 1} — تفاصيل كاملة`
                      : `Service 0${modalIndex + 1} — Full Details`}
                  </span>
                  <h3 className="mt-0.5 text-lg font-black text-gray-900 sm:text-xl dark:text-white">
                    {activeModalItem.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalIndex(null)}
                aria-label={isArabic ? 'إغلاق' : 'Close'}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* الوصف */}
            <p className="mt-4 text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-gray-300">
              {activeModalItem.description}
            </p>

            {/* المخرجات الأساسية */}
            <div className="mt-5 rounded-2xl bg-[#f7f6ff] p-4 dark:bg-white/5">
              <h4 className="text-xs font-bold text-gray-900 sm:text-sm dark:text-white">
                {isArabic ? 'ماذا تستلم في هذه الخدمة؟' : 'What is included in this service?'}
              </h4>
              <ul className="mt-3 space-y-2.5">
                {(isArabic ? activeExtra.deliverablesAr : activeExtra.deliverablesEn).map(
                  (point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-gray-700 sm:text-sm dark:text-gray-200"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#4b3fdf] dark:text-indigo-400" />
                      <span>{point}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* المدة المتوقعة + التقنيات */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <Clock className="size-4 text-[#4b3fdf] dark:text-indigo-400" />
                <span>
                  {isArabic ? 'المدة المتوقعة:' : 'Estimated Timeline:'}{' '}
                  <strong className="text-gray-900 dark:text-white">
                    {isArabic ? activeExtra.durationAr : activeExtra.durationEn}
                  </strong>
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {(activeModalItem.tags && activeModalItem.tags.length > 0
                ? activeModalItem.tags
                : activeExtra.techStack
              ).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[#4b3fdf]/20 bg-[#edeaff]/70 px-3 py-1 text-[11px] font-bold text-[#4b3fdf] dark:border-indigo-400/20 dark:bg-indigo-950/50 dark:text-indigo-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* أزرار الإجراء السريع */}
            <div className="mt-6 flex flex-col gap-2.5 border-t border-gray-100 pt-4 sm:flex-row dark:border-white/10">
              <Link
                href={isArabic ? '/ar/contact' : '/en/contact'}
                onClick={() => setModalIndex(null)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#4b3fdf] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#4b3fdf]/25 transition-all hover:bg-[#3f34c7] sm:text-sm"
              >
                <span>{isArabic ? 'اطلب هذه الخدمة الآن' : 'Request This Service'}</span>
                <ArrowUpRight className="size-4" />
              </Link>

              <a
                href={`https://wa.me/201277158762?text=${encodeURIComponent(
                  isArabic
                    ? `مرحباً فريق Codexa، أود الاستفسار عن خدمة: ${activeModalItem.title}`
                    : `Hello Codexa team, I would like to inquire about: ${activeModalItem.title}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-500/20 sm:text-sm dark:text-emerald-300"
              >
                <MessageCircle className="size-4" />
                <span>{isArabic ? 'استفسر عبر واتساب' : 'Ask on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}