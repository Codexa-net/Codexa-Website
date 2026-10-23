'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HintBadge } from './hint-badge'

interface ProjectTypeSelectorProps {
  value: string
  options?: string[]
  placeholder: string
  onChange: (v: string) => void
  onBlur: () => void
  isArabic: boolean
  isValid: boolean
  hintLabel: string
}

const FULL_PROJECT_TYPES_AR = [
  'موقع إلكتروني',
  'تطبيق موبايل',
  'متجر إلكتروني',
  'نظام إداري / Dashboard',
  'هوية بصرية',
  'فكرة أخرى',
]

const FULL_PROJECT_TYPES_EN = [
  'Website',
  'Mobile App',
  'E-commerce Store',
  'Management System / CRM',
  'Brand Identity',
  'Custom Idea / Other',
]

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
      initial={{ opacity: 0, y: isArabic ? -3 : 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.02, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        role="option"
        tabIndex={0}
        aria-selected={isSelected}
        onMouseDown={(e) => {
          e.preventDefault()
          onSelect()
        }}
        className={cn(
          'group relative flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5',
          '!text-xs sm:!text-sm !font-semibold !leading-normal',
          'cursor-pointer select-none transition-all duration-150',
          isArabic ? 'text-right flex-row-reverse' : 'text-left',
          isSelected
            ? 'bg-[#4b3fdf]/10 text-[#4b3fdf] dark:bg-[#4b3fdf]/25 dark:text-brand-300'
            : 'text-gray-700 hover:bg-gray-100/80 hover:text-[#4b3fdf] dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white',
        )}
      >
        <span className="truncate">{option}</span>

        <span
          className={cn(
            'flex size-4 shrink-0 items-center justify-center transition-all duration-200',
            isSelected ? 'opacity-100 scale-100 text-[#4b3fdf] dark:text-brand-400' : 'opacity-0 scale-75',
          )}
        >
          <Check className="size-3.5" strokeWidth={2.5} />
        </span>
      </div>
    </motion.li>
  )
}

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
  const containerRef = useRef<HTMLSpanElement>(null)

  const availableOptions =
    options && options.length > 3
      ? options
      : isArabic
        ? FULL_PROJECT_TYPES_AR
        : FULL_PROJECT_TYPES_EN

  const hasValue = value.trim().length > 0
  const showHint = !hasValue && !open

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <span ref={containerRef} className="relative mx-1 my-1 inline-flex align-baseline pt-4 sm:pt-2">
      <AnimatePresence>
        {showHint && (
          <span className="pointer-events-none absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap sm:-top-3">
            <HintBadge label={hintLabel} icon="click" />
          </span>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onBlur={onBlur}
        className={cn(
          'inline-flex items-center gap-1.5 pb-0.5 font-black cursor-pointer align-baseline',
          'border-b-2 border-dashed transition-all duration-300',
          'hover:border-[#4b3fdf] focus:outline-none',
          isValid
            ? 'border-[#4b3fdf] text-[#4b3fdf]'
            : open
              ? 'border-[#4b3fdf] text-[#4b3fdf]'
              : hasValue
                ? 'border-amber-400/80 text-[#0d0b2c] dark:text-white'
                : 'border-[#4b3fdf]/40 text-[#4b3fdf]',
        )}
      >
        <span>{hasValue ? value : placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
        </motion.span>
      </button>

      {/* في الموبايل تتوسط القائمة الشاشة بالكامل حتى لا ينقص منها حرف واحد، وفي اللابتوب تفتح أسفل الزر */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] sm:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                '!text-sm !font-normal !leading-tight',
                'fixed inset-x-4 top-1/2 z-50 mx-auto max-w-[300px] -translate-y-1/2 overflow-hidden',
                'sm:absolute sm:inset-x-auto sm:top-full sm:left-1/2 sm:min-w-[260px] sm:max-w-[310px] sm:-translate-x-1/2 sm:translate-y-0',
                'rounded-2xl p-1.5 shadow-2xl',
                'border border-gray-100/80 bg-white/95 backdrop-blur-xl dark:bg-[#141226]/95 dark:border-white/10',
                'shadow-[0_16px_35px_-8px_rgba(0,0,0,0.3)]',
              )}
            >
              <ul role="listbox" className="space-y-0.5 max-h-64 overflow-y-auto">
                {availableOptions.map((option, index) => (
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
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </span>
  )
}