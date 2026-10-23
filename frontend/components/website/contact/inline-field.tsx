import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { HintBadge } from './hint-badge'

interface InlineFieldProps {
  value: string
  placeholder: string
  onChange: (v: string) => void
  onBlur: () => void
  type?: string
  isArabic: boolean
  isValid: boolean
  hintLabel: string
}

export function InlineField({
  value,
  placeholder,
  onChange,
  onBlur,
  type = 'text',
  isArabic,
  isValid,
  hintLabel,
}: InlineFieldProps) {
  const [focused, setFocused] = useState(false)

  const hasValue = value.trim().length > 0
  const displayLength = Math.max(placeholder.length, value.length || 1) + 1
  const showHint = !hasValue && !focused

  return (
    <span className="relative mx-1 my-1 inline-flex items-end align-baseline pt-4 sm:pt-2">
      <AnimatePresence>
        {showHint && (
          <span className="pointer-events-none absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap sm:-top-3">
            <HintBadge label={hintLabel} icon="pen" />
          </span>
        )}
      </AnimatePresence>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          onBlur()
        }}
        placeholder={placeholder}
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{ width: `${displayLength}ch` }}
        className={cn(
          'max-w-[80vw] bg-transparent pb-0.5 text-center outline-none',
          'border-b-2 border-dashed transition-colors duration-300',
          'text-inherit font-bold placeholder:font-normal placeholder:text-[#4b3fdf]/35 dark:placeholder:text-brand-400/35',
          isValid
            ? 'border-[#4b3fdf] text-[#4b3fdf] dark:border-brand-400 dark:text-brand-400'
            : focused
              ? 'border-[#4b3fdf]/70 text-[#0d0b2c] dark:text-white'
              : hasValue
                ? 'border-amber-400/60 text-[#0d0b2c] dark:text-white'
                : 'border-[#4b3fdf]/30 text-[#0d0b2c] dark:text-white',
        )}
      />
    </span>
  )
}