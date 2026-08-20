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

/**
 * OurWorkHero — matching the Figma "Our Work" hero:
 * Clean white bg with centered title ("اكتشف ما أنجزناه") and fanned-out floating project cards.
 */
export function OurWorkHero({ title, subtitle, scrollHint, projects }: OurWorkHeroProps) {
  const displayProjects = projects.slice(0, 5)

  // Fan spread layout for the cards
  const cardStyles = [
    { rotate: -12, translateX: -120, translateY: 20, scale: 0.85, zIndex: 1 },
    { rotate: -6, translateX: -50, translateY: 8, scale: 0.92, zIndex: 2 },
    { rotate: 0, translateX: 0, translateY: 0, scale: 1, zIndex: 3 },
    { rotate: 6, translateX: 50, translateY: 8, scale: 0.92, zIndex: 2 },
    { rotate: 12, translateX: 120, translateY: 20, scale: 0.85, zIndex: 1 },
  ]

  const isAnjaznah = title.includes('أنجزناه')

  return (
    <section className="relative overflow-hidden bg-white pb-8 pt-12 md:pb-12 md:pt-20 dark:bg-[#0d0b1f]">
      <Container className="flex flex-col items-center text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl font-extrabold tracking-tight text-[#0f172a] dark:text-white sm:text-5xl md:text-6xl"
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
            className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Fanned floating project cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12 flex h-48 w-full max-w-xl items-center justify-center sm:h-56 md:mt-16 md:h-64"
        >
          {displayProjects.map((project, index) => {
            const style = cardStyles[index] ?? cardStyles[2]
            const themeClass = project.themeClass ?? 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]'

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
                  delay: 0.2 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  'absolute h-40 w-28 overflow-hidden rounded-2xl shadow-xl sm:h-48 sm:w-32 md:h-52 md:w-36',
                  'bg-gradient-to-b',
                  themeClass,
                )}
                style={{
                  zIndex: style.zIndex,
                  transform: `translateX(${style.translateX}px) translateY(${style.translateY}px) scale(${style.scale}) rotate(${style.rotate}deg)`,
                }}
              >
                {/* Mini device mockup inside card */}
                <div className="flex h-full flex-col p-3">
                  <p className="text-xs font-bold text-white/90">
                    {project.watermark ?? project.title.en}
                  </p>
                  <p className="mt-0.5 text-[9px] text-white/50">
                    {project.category.en}
                  </p>
                  <div className="mt-auto overflow-hidden rounded-lg border border-white/15 bg-black/30">
                    <div className="flex h-3 items-center gap-0.5 border-b border-white/10 bg-white/5 px-1.5">
                      <span className="size-1 rounded-full bg-red-400/70" />
                      <span className="size-1 rounded-full bg-yellow-400/70" />
                      <span className="size-1 rounded-full bg-green-400/70" />
                    </div>
                    <div className="space-y-1 p-2">
                      <div className="h-1 w-3/4 rounded-full bg-white/20" />
                      <div className="h-1 w-1/2 rounded-full bg-white/10" />
                      <div className="grid grid-cols-3 gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="aspect-square rounded-sm bg-white/10" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
        {/* Scroll hint */}
        {scrollHint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex flex-col items-center gap-2 text-muted-foreground dark:text-gray-500"
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
                aria-hidden="true"
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
