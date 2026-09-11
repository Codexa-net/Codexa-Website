'use client'

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion'

interface RevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  /** Delay in seconds */
  delay?: number
  /** Duration in seconds */
  duration?: number
}

/**
 * Reveal — mask-based clip reveal animation for text and images.
 * Creates a "curtain pull" effect that works in both LTR and RTL layouts.
 *
 * Usage:
 * ```tsx
 * <Reveal delay={0.1}>
 *   <h2 className="text-4xl font-bold">Section Title</h2>
 * </Reveal>
 * ```
 */
export function Reveal({ children, delay = 0, duration = 0.6, className, ...props }: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-5%' }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
