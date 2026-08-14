'use client'

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion'

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  /** Delay in seconds */
  delay?: number
  /** Duration in seconds */
  duration?: number
  /** Direction to fade in from */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Distance to travel (in px) */
  distance?: number
}

const directionOffset = (
  direction: FadeInProps['direction'],
  distance: number,
): { x?: number; y?: number } => {
  switch (direction) {
    case 'up':
      return { y: distance }
    case 'down':
      return { y: -distance }
    case 'left':
      return { x: distance }
    case 'right':
      return { x: -distance }
    default:
      return {}
  }
}

/**
 * FadeIn — animate children into view with opacity + optional directional offset.
 * Respects prefers-reduced-motion automatically via Framer Motion.
 *
 * Usage:
 * ```tsx
 * <FadeIn direction="up" delay={0.2}>
 *   <h1>Hello</h1>
 * </FadeIn>
 * ```
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 24,
  className,
  ...props
}: FadeInProps) {
  const offset = directionOffset(direction, distance)

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
