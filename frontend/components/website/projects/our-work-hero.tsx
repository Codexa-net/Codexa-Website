'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type Project } from '@/types/project'
import { Container } from '@/components/shared/container'

interface OurWorkHeroProps {
  title: string
  subtitle?: string
  scrollHint?: string
  projects: Project[]
}

export function OurWorkHero({ title, subtitle, scrollHint, projects }: OurWorkHeroProps) {
  const displayProjects = projects.slice(0, 5)

  // توزيع الكروت بتباعد واضح وأبعاد تمنع التداخل
  const cardStyles = [
    { rotate: -10, translateX: -150, translateY: 15, scale: 0.88, zIndex: 1 },
    { rotate: -5, translateX: -75, translateY: 6, scale: 0.94, zIndex: 2 },
    { rotate: 0, translateX: 0, translateY: 0, scale: 1, zIndex: 5 },
    { rotate: 5, translateX: 75, translateY: 6, scale: 0.94, zIndex: 2 },
    { rotate: 10, translateX: 150, translateY: 15, scale: 0.88, zIndex: 1 },
  ]

  const isAnjaznah = title.includes('أنجزناه')

  return (
    <section className="relative overflow-hidden bg-white pb-6 pt-10 md:pb-14 md:pt-20 dark:bg-[#0d0b1f]">
      <Container className="flex flex-col items-center text-center">
        {/* العنوان متجاوب مع شاشة الهاتف */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl font-extrabold leading-tight tracking-tight text-[#0f172a] dark:text-white sm:text-4xl md:text-6xl"
        >
          {isAnjaznah ? (
            <>
              اكتشف ما{' '}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">
                أنجزناه
              </span>
            </>
          ) : (
            title
          )}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 max-w-2xl px-2 text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:text-sm md:text-base"
          >
            {subtitle}
          </motion.p>
        )}

        {/* الكروت العائمة ثلاثية الأبعاد - تتصغر نسبياً على الهاتف مع الحفاظ على نفس الأنيميشن */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 flex h-48 w-full max-w-xl origin-center scale-[0.75] items-center justify-center sm:mt-12 sm:h-64 sm:scale-90 md:mt-16 md:h-72 md:scale-100"
        >
          {displayProjects.map((project, index) => {
            const style = cardStyles[index] ?? cardStyles[2]
            const fromColor = project.themeFrom || '#1e1b4b'
            const toColor = project.themeTo || '#090818'

            const projectImage =
              (project as any).cover ||
              (project as any).image ||
              (project as any).coverImage ||
              (project as any).thumbnail ||
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: style.rotate,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  'absolute h-52 w-36 sm:h-56 sm:w-36 md:h-60 md:w-44 overflow-hidden rounded-2xl border border-white/20',
                  'shadow-[0_20px_45px_-12px_rgba(75,63,223,0.3),0_8px_20px_rgba(0,0,0,0.15)]',
                )}
                style={{
                  zIndex: style.zIndex,
                  transform: `translateX(${style.translateX}px) translateY(${style.translateY}px) scale(${style.scale}) rotate(${style.rotate}deg)`,
                  background: `linear-gradient(160deg, ${fromColor} 0%, ${toColor} 100%)`,
                }}
              >
                <div className="flex h-full flex-col p-2.5 text-right sm:p-3" dir="rtl">
                  {/* رأس الكارت: التصنيف وحالة المشروع */}
                  <div className="flex items-center justify-between pb-1">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span className="max-w-[85px] truncate text-[9px] font-bold text-white/70">
                      {project.category}
                    </span>
                  </div>

                  {/* اسم المشروع */}
                  <p className="mt-0.5 line-clamp-1 text-xs font-bold text-white">
                    {project.name}
                  </p>

                  {/* نافذة العرض الحقيقية لصورة واجهة المشروع */}
                  <div className="mt-auto relative flex h-[62%] w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-black/50 shadow-inner">
                    <div className="flex h-3.5 shrink-0 items-center gap-1 border-b border-white/10 bg-black/40 px-2">
                      <span className="size-1 rounded-full bg-red-400/80" />
                      <span className="size-1 rounded-full bg-yellow-400/80" />
                      <span className="size-1 rounded-full bg-green-400/80" />
                    </div>

                    <div className="relative size-full overflow-hidden bg-neutral-900">
                      <img
                        src={projectImage}
                        alt={project.name}
                        className="size-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* مؤشر النزول للأسفل */}
        {scrollHint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-col items-center gap-2 text-muted-foreground dark:text-gray-500 sm:mt-12"
          >
            <p className="text-xs font-medium tracking-wide">{scrollHint}</p>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </Container>
    </section>
  )
}