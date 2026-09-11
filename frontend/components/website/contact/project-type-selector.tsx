import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HintBadge } from './hint-badge'

interface ProjectTypeSelectorProps {
  value: string
  options: string[]
  placeholder: string
  onChange: (v: string) => void
  onBlur: () => void
  isArabic: boolean
  isValid: boolean
  hintLabel: string
}

/* ── Dropdown option item ────────────────────────────────────── */

function OptionItem({
  option,
  isSelected,
  isArabic,
  onSelect,
  index,
}: {
  option: string
  isSelected: boolean
  isArabic: boolean
  onSelect: () => void
  index: number
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: isArabic ? 8 : -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        role="option"
        aria-selected={isSelected}
        onMouseDown={(e) => {
          e.preventDefault()
          onSelect()
        }}
        className={cn(
          // Reset font size — this button lives inside the large-text div
          'group relative flex w-full items-center gap-2.5 px-3 py-2',
          'text-[12px] font-medium leading-none transition-colors duration-150',
          isArabic ? 'flex-row-reverse text-right' : 'text-left',
          isSelected
            ? 'bg-[#4b3fdf]/8 text-[#4b3fdf] dark:bg-[#4b3fdf]/20 dark:text-brand-300'
            : 'text-[#3a3759] hover:bg-[#f5f4fc] hover:text-[#4b3fdf] dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-brand-300',
        )}
      >
        {/* Colored left/right accent bar */}
        <span
          className={cn(
            'absolute inset-y-0 w-[3px] rounded-full transition-opacity duration-150',
            isArabic ? 'right-0' : 'left-0',
            isSelected ? 'bg-[#4b3fdf] opacity-100' : 'opacity-0 group-hover:opacity-30 bg-[#4b3fdf]',
          )}
        />

        {/* Label */}
        <span className="flex-1">{option}</span>

        {/* Check icon */}
        <span
          className={cn(
            'flex size-4 shrink-0 items-center justify-center rounded-full transition-all duration-200',
            isSelected
              ? 'bg-[#4b3fdf] opacity-100 scale-100'
              : 'bg-transparent opacity-0 scale-75',
          )}
        >
          <Check className="size-2.5 text-white" strokeWidth={3} />
        </span>
      </button>
    </motion.li>
  )
}

/* ── Main component ─────────────────────────────────────────── */

export function ProjectTypeSelector({
  value,
  options,
  placeholder,
  onChange,
  onBlur,
  isArabic,
  isValid,
  hintLabel,
}: ProjectTypeSelectorProps) {
  const [open, setOpen] = useState(false)

  const hasValue = value.trim().length > 0
  const showHint = !hasValue && !open

  return (
    <span className="relative inline-flex">
      <AnimatePresence>
        {showHint && <HintBadge label={hintLabel} icon="click" />}
      </AnimatePresence>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onBlur={() => {
          onBlur()
          setTimeout(() => setOpen(false), 120)
        }}
        className={cn(
          'inline-flex items-center gap-1.5 pb-0.5 font-bold',
          'border-b-2 border-dashed transition-colors duration-300',
          'hover:border-[#4b3fdf] focus:outline-none',
          isValid
            ? 'border-[#4b3fdf] text-[#4b3fdf]'
            : open
              ? 'border-[#4b3fdf]/70 text-[#0d0b2c]'
              : hasValue
                ? 'border-amber-400/60 text-[#0d0b2c]'
                : 'border-[#4b3fdf]/30 text-[#0d0b2c]',
        )}
      >
        <span>{hasValue ? value : placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <ChevronDown className="h-4 w-4 shrink-0" />
        </motion.span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 2, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              // Reset inherited font size from the headline div
              'text-sm',
              'absolute top-full z-50 min-w-[160px] overflow-hidden',
              'rounded-xl py-1',
              // Glass panel
              'border border-[#e7e4f7] bg-white/95 backdrop-blur-xl dark:bg-[#19172f]/95 dark:border-white/10',
              'shadow-[0_16px_48px_-10px_rgba(75,63,223,0.20),0_4px_12px_-4px_rgba(75,63,223,0.08)]',
              isArabic ? 'right-0' : 'left-0',
            )}
            role="listbox"
          >
            {/* Subtle top gradient accent */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4b3fdf]/30 to-transparent"
            />

            {options.map((option, index) => (
              <OptionItem
                key={option}
                option={option}
                isSelected={value === option}
                isArabic={isArabic}
                index={index}
                onSelect={() => {
                  onChange(option)
                  setOpen(false)
                }}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </span>
  )
}
