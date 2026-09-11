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
    <span className="relative inline-flex items-end my-2 ">
      <AnimatePresence>
        {showHint && <HintBadge  label={hintLabel} icon="pen" />}
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
          'mt-1 bg-transparent outline-none pb-0.5',
          'border-b-2 border-dashed transition-colors duration-300',
          'text-inherit font-bold placeholder:font-normal placeholder:text-[#4b3fdf]/30 dark:placeholder:text-brand-400/30',
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
