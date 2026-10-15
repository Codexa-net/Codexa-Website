'use client'

import { useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion'

import { cn } from '@/lib/utils'

interface StickyScrollProps {
  itemCount: number
  children: (activeIndex: number) => React.ReactNode
  className?: string
  panelClassName?: string
  ariaLabel?: string
}

export function StickyScroll({
  itemCount,
  children,
  className,
  panelClassName,
  ariaLabel,
}: StickyScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (itemCount <= 1) {
      setActiveIndex(0)
      return
    }

    const nextIndex = Math.min(
      itemCount - 1,
      Math.max(0, Math.floor(progress * itemCount)),
    )

    setActiveIndex((current) => (current === nextIndex ? current : nextIndex))
  })

  if (itemCount === 0) return null

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ height: `${itemCount * 100}vh` }}
      aria-label={ariaLabel}
    >
      {/* تم التثبيت بشكل نظيف بدون أنيميشن مدخل يتعارض مع السكرول */}
      <div className={cn('sticky top-0 h-screen overflow-hidden', panelClassName)}>
        {children(activeIndex)}
      </div>
    </div>
  )
}

interface StickyScrollIndicatorProps {
  count: number
  activeIndex: number
  onSelect?: (index: number) => void
  className?: string
  variant?: 'light' | 'dark'
}

export function StickyScrollIndicator({
  count,
  activeIndex,
  onSelect,
  className,
  variant = 'light',
}: StickyScrollIndicatorProps) {
  const isDark = variant === 'dark'

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3',
        isDark && 'before:h-full before:w-px before:bg-white/15 before:content-[""]',
        className,
      )}
      role="tablist"
      aria-orientation="vertical"
    >
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex

        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Step ${index + 1}`}
            onClick={() => onSelect?.(index)}
            className={cn(
              'rounded-full transition-all duration-300 outline-none',
              'focus-visible:ring-2 focus-visible:ring-ring',
              isActive
                ? cn('size-2.5', isDark ? 'bg-white' : 'bg-brand-500')
                : cn(
                    'size-1.5',
                    isDark
                      ? 'bg-white/30 hover:bg-white/50'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/60',
                  ),
            )}
          />
        )
      })}
    </div>
  )
}

interface StickyScrollContentProps {
  activeIndex: number
  children: React.ReactNode
  className?: string
  slideDirection?: 'up' | 'left'
}

export function StickyScrollContent({
  activeIndex,
  children,
  className,
  slideDirection = 'up',
}: StickyScrollContentProps) {
  const initial =
    slideDirection === 'left'
      ? { opacity: 0, x: 32, filter: 'blur(6px)' }
      : { opacity: 0, y: 32, filter: 'blur(6px)' }

  const animate =
    slideDirection === 'left'
      ? { opacity: 1, x: 0, filter: 'blur(0px)' }
      : { opacity: 1, y: 0, filter: 'blur(0px)' }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeIndex}
        initial={initial}
        animate={animate}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}