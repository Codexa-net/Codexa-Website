'use client'

import { motion, type Variants } from 'framer-motion'

interface StaggerProps {
  children: React.ReactNode
  className?: string
  /** Delay between each child (in seconds) */
  staggerDelay?: number
  /** Initial delay before the first child animates */
  delayChildren?: number
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

/**
 * Stagger — container that animates its StaggerItem children sequentially.
 * Ideal for grids, lists, and card collections.
 *
 * Usage:
 * ```tsx
 * <Stagger>
 *   {projects.map((p) => (
 *     <Stagger.Item key={p.id}>
 *       <ProjectCard project={p} />
 *     </Stagger.Item>
 *   ))}
 * </Stagger>
 * ```
 */
export function Stagger({ children, className, staggerDelay = 0.1, delayChildren = 0 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      custom={staggerDelay}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger.Item — individual animated child inside a Stagger container.
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

Stagger.Item = StaggerItem
