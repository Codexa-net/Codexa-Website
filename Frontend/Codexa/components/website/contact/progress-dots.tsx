import { motion } from 'framer-motion'

interface ProgressDotsProps {
  fields: readonly string[]
  isFieldValid: (field: string) => boolean
}

export function ProgressDots({ fields, isFieldValid }: ProgressDotsProps) {
  return (
    <div className="mt-10 flex justify-center gap-2">
      {fields.map((field) => (
        <motion.div
          key={field}
          animate={{
            width: isFieldValid(field) ? 24 : 8,
            backgroundColor: isFieldValid(field) ? '#4b3fdf' : 'oklch(0.55 0 0)',
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  )
}
