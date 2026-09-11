import { motion } from 'framer-motion'
import { PenLine, MousePointerClick } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HintBadgeProps {
  label: string
  icon: 'pen' | 'click'
}

export function HintBadge({ label, icon }: HintBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.85 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'pointer-events-none absolute left-1/2 -top-1 -translate-x-1/2',
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1',
        'bg-[#4b3fdf] text-[10px] font-bold text-white',
        'shadow-[0_4px_12px_-2px_rgba(75,63,223,0.45)]',
      )}
    >
      {icon === 'pen' ? (
        <PenLine className="h-2.5 w-2.5 shrink-0" />
      ) : (
        <MousePointerClick className="h-2.5 w-2.5 shrink-0" />
      )}
      {label}
      {/* Down-pointing caret */}
      <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 border-x-4 border-t-[5px] border-x-transparent border-t-[#4b3fdf]" />
    </motion.span>
  )
}
