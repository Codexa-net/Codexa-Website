'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useForm, Controller, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight,
  CheckCircle2,
  MessageCircle,
  Pencil,
  Sparkles,
  ChevronDown,
  Check,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { submitContactFormAction } from '@/actions/contact'

import { contactSchema, type ContactFormValues } from './contact-schema'
import { ProgressDots } from './progress-dots'

interface ContactFormProps {
  locale: Locale
  dict: Dictionary
}

const FORM_FIELDS = ['name', 'projectName', 'projectType', 'email'] as const

/**
 * حقل إدخال مدمج متجاوب مع الموبايل والكمبيوتر بدون تداخل شارة "اكتب هنا" مع النص
 */
function ResponsiveInlineField({
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  isArabic,
  isValid,
  hintLabel,
}: {
  value: string
  onChange: (val: string) => void
  onBlur: () => void
  placeholder: string
  type?: string
  isArabic: boolean
  isValid: boolean
  hintLabel: string
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasValue = value && value.trim().length > 0

  return (
    <span className="relative mx-1.5 my-2 inline-flex flex-col items-center align-middle sm:mx-2.5 sm:my-1">
      {/* شارة "اكتب هنا" مرفوعة فوق الحقل بدون أن تغطي على النص */}
      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        className={cn(
          'mb-1 inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-normal transition-all duration-200 sm:text-xs',
          hasValue || isValid
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            : 'bg-[#4b3fdf] text-white shadow-[0_6px_16px_rgba(75,63,223,0.45)] hover:scale-105',
        )}
      >
        {hasValue || isValid ? (
          <>
            <Check className="size-3 shrink-0" />
            <span>{isArabic ? 'تم الإدخال' : 'Done'}</span>
          </>
        ) : (
          <>
            <Pencil className="size-2.5 shrink-0" />
            <span>{hintLabel}</span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
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
        className={cn(
          'w-auto min-w-[165px] max-w-[270px] border-b-2 border-dashed bg-transparent px-2 pb-1 text-center font-black outline-none transition-all duration-200 sm:min-w-[220px] sm:max-w-[360px]',
          focused
            ? 'border-[#4b3fdf] text-[#4b3fdf] dark:border-brand-400 dark:text-brand-400'
            : hasValue
              ? 'border-[#4b3fdf]/60 text-[#4b3fdf] dark:border-brand-400/60 dark:text-brand-400'
              : 'border-gray-400/50 text-gray-500 placeholder:text-gray-400/60 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-500/70',
        )}
      />
    </span>
  )
}

/**
 * قائمة اختيار نوع المشروع متجاوبة 100% على الموبايل (تفتح في منتصف الشاشة بدون أي قصّ للنصوص)
 */
function ResponsiveProjectTypeSelector({
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  isArabic,
  isValid,
  hintLabel,
}: {
  value: string
  onChange: (val: string) => void
  onBlur: () => void
  options: string[]
  placeholder: string
  isArabic: boolean
  isValid: boolean
  hintLabel: string
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)
  const hasValue = value && value.trim().length > 0

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <span
      ref={containerRef}
      className="relative mx-1.5 my-2 inline-flex flex-col items-center align-middle sm:mx-2.5 sm:my-1"
    >
      {/* شارة "غير الاختيار" */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'mb-1 inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-normal transition-all duration-200 sm:text-xs',
          hasValue || isValid
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            : 'bg-[#4b3fdf] text-white shadow-[0_6px_16px_rgba(75,63,223,0.45)] hover:scale-105',
        )}
      >
        <Sparkles className="size-2.5 shrink-0" />
        <span>{hintLabel}</span>
      </button>

      {/* زر عرض القيمة المختارة */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'inline-flex min-w-[165px] max-w-[280px] cursor-pointer items-center justify-center gap-1.5 border-b-2 border-dashed px-2 pb-1 text-center font-black outline-none transition-all duration-200 sm:min-w-[220px] sm:max-w-[380px]',
          open || hasValue
            ? 'border-[#4b3fdf] text-[#4b3fdf] dark:border-brand-400 dark:text-brand-400'
            : 'border-gray-400/50 text-[#4b3fdf]/80 dark:border-gray-600 dark:text-brand-400/80',
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 transition-transform duration-200 sm:size-5',
            open && 'rotate-180',
          )}
        />
      </button>

      {/* القائمة المنبثقة: متمركزة بالكامل في شاشة الموبايل لتظهر كل الحروف بوضوح تام */}
      <AnimatePresence>
        {open && (
          <>
            {/* خلفية شفافة للموبايل فقط */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              dir={isArabic ? 'rtl' : 'ltr'}
              className={cn(
                'fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[75vh] w-auto max-w-sm -translate-y-1/2 overflow-y-auto rounded-3xl border border-gray-200 bg-white p-3 shadow-2xl dark:border-gray-800 dark:bg-[#121026]',
                'sm:absolute sm:inset-x-auto sm:top-full sm:left-1/2 sm:mt-3 sm:w-80 sm:max-w-none sm:-translate-x-1/2 sm:translate-y-0',
              )}
            >
              <div className="mb-2 flex items-center justify-between border-b border-gray-100 px-2 pb-2 sm:hidden dark:border-gray-800">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {isArabic ? 'اختر نوع المشروع' : 'Select Project Type'}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {options.map((opt) => {
                  const isSelected = value === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onChange(opt)
                        onBlur()
                        setOpen(false)
                      }}
                      className={cn(
                        'flex w-full cursor-pointer items-center justify-between rounded-2xl px-3.5 py-2.5 text-start text-xs font-bold transition-all sm:text-sm',
                        isSelected
                          ? 'bg-[#4b3fdf] text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10',
                      )}
                    >
                      <span className="leading-snug">{opt}</span>
                      {isSelected && <Check className="size-4 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </span>
  )
}

export function ContactForm({ locale, dict }: ContactFormProps) {
  const isArabic = locale === 'ar'
  const c = dict.contact

  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: { name: '', projectName: '', projectType: '', email: '' },
  })

  const enrichedProjectTypes = useMemo(() => {
    const defaultAr = [
      'موقع إلكتروني وتطبيق ويب',
      'تطبيق موبايل (iOS & Android)',
      'متجر إلكتروني وحلول دفع',
      'نظام إداري خاص (ERP / Dashboard)',
      'منصة تعليمية أو منظومة طبية',
      'تصميم واجهات وتجربة مستخدم (UI/UX)',
      'هوية بصرية كاملة',
      'فكرة أخرى',
    ]
    const defaultEn = [
      'Website & Web Application',
      'Mobile App (iOS & Android)',
      'E-Commerce Store',
      'Custom ERP / Dashboard System',
      'EdTech or Healthcare Platform',
      'UI/UX Design',
      'Brand Identity',
      'Other Idea',
    ]
    return isArabic ? defaultAr : defaultEn
  }, [isArabic])

  const isFieldValid = (field: FieldPath<ContactFormValues>) =>
    !!dirtyFields[field] && !errors[field]

  const hints = {
    name: isArabic ? 'اكتب هنا' : 'Type here',
    projectName: isArabic ? 'اكتب هنا' : 'Type here',
    projectType: isArabic ? 'غير الاختيار' : 'Pick one',
    email: isArabic ? 'اكتب هنا' : 'Type here',
  }

  async function onSubmit(data: ContactFormValues) {
    setSubmitError(null)
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'https://codexa-website-backend.vercel.app'
      const rawContact = data.email.trim()
      const isPhone = !rawContact.includes('@')
      const cleanDigits = rawContact.replace(/\D/g, '') || '000000'

      const subjectText = data.projectType
        ? `${data.projectType} — ${data.projectName.trim()}`
        : data.projectName.trim() || (isArabic ? 'طلب مشروع جديد' : 'New Project Request')

      const detailedMessage = `${isArabic ? 'اسم المشروع' : 'Project name'}: ${data.projectName.trim()}\n${
        isArabic ? 'نوع المشروع' : 'Project type'
      }: ${data.projectType}\n${
        isPhone
          ? isArabic
            ? 'رقم الواتساب'
            : 'WhatsApp'
          : isArabic
            ? 'البريد الإلكتروني'
            : 'Email'
      }: ${rawContact}`

      const payload = {
        name: data.name.trim(),
        email: isPhone ? `whatsapp-${cleanDigits}@codexa.net` : rawContact,
        phone: isPhone ? rawContact : undefined,
        subject: subjectText,
        projectName: data.projectName.trim(),
        projectType: data.projectType,
        message: detailedMessage,
        status: 'جديد',
      }

      // 1. حفظ نسخة فورية متزامنة لضمان ظهورها في الداشبورد وتفعيل صوت الإشعار فوراً
      try {
        const localMsg = {
          id: `msg_${Date.now()}`,
          ...payload,
          contact: rawContact,
          isRead: false,
          createdAt: new Date().toISOString(),
        }
        const existingRaw = localStorage.getItem('codexa_contact_messages')
        const existingList = existingRaw ? JSON.parse(existingRaw) : []
        localStorage.setItem(
          'codexa_contact_messages',
          JSON.stringify([localMsg, ...existingList]),
        )
        window.dispatchEvent(new Event('messagesUpdated'))
      } catch {}

      // 2. إرسال الطلب عبر الـ Server Action وجميع مسارات الـ API المعتمدة في الباك إند
      await Promise.allSettled([
        submitContactFormAction({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          projectName: payload.projectName,
          projectType: payload.projectType,
          message: payload.message,
        }),
        fetch(`${apiUrl}/contact-messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        fetch(`${apiUrl}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        fetch(`${apiUrl}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
      ])

      setSubmitted(true)
    } catch (err: any) {
      console.error('Contact submission error:', err)
      setSubmitError(
        isArabic
          ? 'تعذر إرسال الطلب حالياً، برجاء المحاولة مرة أخرى أو التواصل عبر واتساب.'
          : 'Could not send your request. Please try again or reach us on WhatsApp.',
      )
    }
  }

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative flex min-h-[calc(100svh-4.5rem)] items-center justify-center overflow-x-hidden bg-[#fafaff] pt-16 pb-16 sm:py-20 dark:bg-[#0d0b1f]"
    >
      <BackgroundDecoration />

      <div className="relative mx-auto w-full max-w-[1050px] px-4 py-6 text-center sm:px-8 lg:py-12">
        {!submitted && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 text-center text-xs font-bold tracking-widest text-[#4b3fdf] uppercase sm:mb-6 sm:text-sm dark:text-brand-400"
          >
            {c.eyebrow}
          </motion.p>
        )}

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 sm:mt-8"
        >
          <AnimatePresence mode="wait">
            {submitted && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-5 py-12 text-center sm:gap-6 sm:py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4b3fdf]/10 sm:h-20 sm:w-20 dark:bg-[#4b3fdf]/20"
                >
                  <CheckCircle2
                    className="h-8 w-8 text-[#4b3fdf] sm:h-10 sm:w-10 dark:text-brand-400"
                    strokeWidth={1.5}
                  />
                </motion.div>
                <h2 className="text-2xl font-black text-[#0d0b2c] sm:text-4xl md:text-5xl dark:text-white">
                  {c.successTitle}
                </h2>
                <p className="max-w-md text-sm text-[#6b6879] sm:text-lg dark:text-gray-400">
                  {c.successMessage}
                </p>
              </motion.div>
            )}

            {!submitted && (
              <motion.div key="form" className="mx-auto max-w-4xl text-center">
                {/* الجملة متوسطة تماماً في الشاشة مع مسافات مريحة بين الحقول على الموبايل */}
                <div
                  className={cn(
                    'mx-auto text-center text-[clamp(1.25rem,4.5vw,2.85rem)] font-black leading-[2.3] text-[#0d0b2c] sm:leading-[2.2] dark:text-white',
                  )}
                >
                  <span className=" align-middle">{c.sentenceName} </span>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <ResponsiveInlineField
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder={c.placeholderName}
                        isArabic={isArabic}
                        isValid={isFieldValid('name')}
                        hintLabel={hints.name}
                      />
                    )}
                  />
                  <span className="align-middle">{isArabic ? '، ' : ', '}</span>

                  <span className="align-middle">{c.sentenceProject} </span>
                  <Controller
                    name="projectName"
                    control={control}
                    render={({ field }) => (
                      <ResponsiveInlineField
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder={c.placeholderProject}
                        isArabic={isArabic}
                        isValid={isFieldValid('projectName')}
                        hintLabel={hints.projectName}
                      />
                    )}
                  />{' '}

                  <Controller
                    name="projectType"
                    control={control}
                    render={({ field }) => (
                      <ResponsiveProjectTypeSelector
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={enrichedProjectTypes}
                        placeholder={c.placeholderProjectType}
                        isArabic={isArabic}
                        isValid={isFieldValid('projectType')}
                        hintLabel={hints.projectType}
                      />
                    )}
                  />
                  <span className="align-middle">{isArabic ? '، ' : ', '}</span>

                  <span className="align-middle">{c.sentenceEmail} </span>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <ResponsiveInlineField
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder={
                          isArabic ? 'رقم الواتساب أو البريد' : 'WhatsApp number or email'
                        }
                        type="text"
                        isArabic={isArabic}
                        isValid={isFieldValid('email')}
                        hintLabel={hints.email}
                      />
                    )}
                  />{' '}
                  <span className="mt-2 block text-[#6b6879] sm:mt-0 sm:inline dark:text-gray-400">
                    {c.sentenceEnd}
                  </span>
                </div>

                <ProgressDots
                  fields={FORM_FIELDS}
                  isFieldValid={(f) => isFieldValid(f as FieldPath<ContactFormValues>)}
                />

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4">
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={cn(
                      'inline-flex cursor-pointer items-center gap-2.5 rounded-full px-6 py-3.5 sm:gap-3 sm:px-8 sm:py-4',
                      'text-xs font-bold text-white transition-all duration-300 sm:text-sm',
                      'bg-[#4b3fdf] shadow-[0_18px_35px_-12px_rgba(75,63,223,0.5)]',
                      'hover:-translate-y-1 hover:shadow-[0_22px_40px_-12px_rgba(75,63,223,0.6)]',
                      'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0',
                    )}
                  >
                    {isSubmitting ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                    {c.submit}
                  </button>

                  <a
                    href={dict.footer.contact.whatsapp || 'https://wa.me/201277158762'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-2.5 rounded-full border-2 border-[#d8d4f2] bg-white px-6 py-3.5 shadow-sm sm:gap-3 sm:px-8 sm:py-4',
                      'text-xs font-bold text-[#2d2a4a] transition-all duration-300 sm:text-sm',
                      'hover:-translate-y-1 hover:border-green-500/50 hover:bg-green-50 hover:text-green-700',
                      'dark:border-white/15 dark:bg-white/[0.04] dark:text-gray-200 dark:hover:border-green-500/30 dark:hover:bg-green-950/30 dark:hover:text-green-400',
                    )}
                  >
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    {c.whatsapp}
                  </a>
                </div>

                {submitError && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center text-xs font-semibold text-rose-500 sm:text-sm"
                  >
                    {submitError}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </div>
  )
}

function BackgroundDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#4b3fdf]/[0.04] blur-[80px]" />
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#b5c6ff]/[0.08] blur-[60px]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.025]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="contact-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4b3fdf" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#contact-grid)" />
      </svg>
    </div>
  )
}