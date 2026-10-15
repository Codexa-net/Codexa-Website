'use client'

import { useState, useMemo } from 'react'
import { useForm, Controller, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, MessageCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

import { contactSchema, type ContactFormValues } from './contact-schema'
import { InlineField } from './inline-field'
import { ProjectTypeSelector } from './project-type-selector'
import { ProgressDots } from './progress-dots'

/* ── Types ───────────────────────────────────────────────────── */

interface ContactFormProps {
  locale: Locale
  dict: Dictionary
}

/* ── Constants ───────────────────────────────────────────────── */

const FORM_FIELDS = ['name', 'projectName', 'projectType', 'email'] as const

/* ── Component ───────────────────────────────────────────────── */

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

  // قائمة أنواع المشاريع المحدثة والشاملة لجميع خدمات الشركة
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

  /** A field is considered "valid" only once it has been touched AND passes Zod */
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const isPhone = !data.email.includes('@') && /^[0-9+ \s-]+$/.test(data.email)

      const payload = {
        name: data.name,
        email: data.email.trim(),
        phone: isPhone ? data.email.trim() : undefined,
        subject: data.projectType || data.projectName || (isArabic ? 'طلب مشروع جديد' : 'New Project Request'),
        message: `${isArabic ? 'اسم المشروع' : 'Project name'}: ${data.projectName}\n${
          isArabic ? 'نوع المشروع' : 'Project type'
        }: ${data.projectType}\n${
          isPhone
            ? (isArabic ? 'رقم الواتساب' : 'WhatsApp')
            : (isArabic ? 'البريد الإلكتروني' : 'Email')
        }: ${data.email}`,
      }

      let res = await fetch(`${apiUrl}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 404) {
        res = await fetch(`${apiUrl}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        const errorMsg = errorData?.message 
          ? (Array.isArray(errorData.message) ? errorData.message.join('، ') : errorData.message)
          : 'Request failed'
        throw new Error(errorMsg)
      }

      setSubmitted(true)
    } catch (err: any) {
      console.error('Contact submission error:', err)
      setSubmitError(
        err?.message && err.message !== 'Request failed'
          ? err.message
          : (isArabic
              ? 'تعذر إرسال الطلب، برجاء المحاولة مرة أخرى أو التواصل عبر واتساب.'
              : 'Could not send your request. Please try again or reach us on WhatsApp.')
      )
    }
  }

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative overflow-hidden bg-[#fafaff] dark:bg-[#0d0b1f] min-h-[calc(100svh-4.5rem)] flex items-center"
    >
      {/* ── Background decoration ── */}
      <BackgroundDecoration />

      <div className="relative mx-auto w-full max-w-[1220px] px-4 py-12 sm:px-8 lg:py-16">

        {/* Eyebrow label */}
        {!submitted && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center text-sm font-bold uppercase tracking-widest text-[#4b3fdf] dark:text-brand-400"
          >
            {c.eyebrow}
          </motion.p>
        )}

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 sm:mt-10"
        >
          <AnimatePresence mode="wait">

            {/* ── Success state ── */}
            {submitted && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-6 py-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-[#4b3fdf]/10 dark:bg-[#4b3fdf]/20"
                >
                  <CheckCircle2 className="h-10 w-10 text-[#4b3fdf] dark:text-brand-400" strokeWidth={1.5} />
                </motion.div>
                <h2 className="text-4xl font-black text-[#0d0b2c] dark:text-white sm:text-5xl">{c.successTitle}</h2>
                <p className="text-lg text-[#6b6879] dark:text-gray-400">{c.successMessage}</p>
              </motion.div>
            )}

            {/* ── Mad-libs sentence ── */}
            {!submitted && (
              <motion.div key="form">

                {/* تم زيادة المسافة الرأسية leading-[1.9] لمنع تداخل الشارات العائمة مع السطور */}
                <div className={cn(
                  'text-[clamp(1.4rem,4.2vw,3.35rem)] font-black leading-[1.9] sm:leading-[1.95] text-[#0d0b2c] dark:text-white',
                  '[&_input]:text-[clamp(1.4rem,4.2vw,3.35rem)] [&_button]:text-[clamp(1.4rem,4.2vw,3.35rem)]',
                )}>

                  {/* Name */}
                  <span>{c.sentenceName} </span>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <InlineField
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
                  <span>{isArabic ? '، ' : ', '}</span>

                  {/* Project name */}
                  <span>{c.sentenceProject} </span>
                  <Controller
                    name="projectName"
                    control={control}
                    render={({ field }) => (
                      <InlineField
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder={c.placeholderProject}
                        isArabic={isArabic}
                        isValid={isFieldValid('projectName')}
                        hintLabel={hints.projectName}
                      />
                    )}
                  />
                  {' '}

                  {/* Project type */}
                  <Controller
                    name="projectType"
                    control={control}
                    render={({ field }) => (
                      <ProjectTypeSelector
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
                  <span>{isArabic ? '، ' : ', '}</span>

                  {/* Email / WhatsApp Field */}
                  <span>{c.sentenceEmail} </span>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <InlineField
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder={isArabic ? 'رقم الواتساب أو البريد' : 'WhatsApp number or email'}
                        type="text"
                        isArabic={isArabic}
                        isValid={isFieldValid('email')}
                        hintLabel={hints.email}
                      />
                    )}
                  />
                  {' '}
                  <span className="text-[#6b6879] dark:text-gray-500">{c.sentenceEnd}</span>
                </div>

                {/* Progress dots */}
                <ProgressDots
                  fields={FORM_FIELDS}
                  isFieldValid={(f) => isFieldValid(f as FieldPath<ContactFormValues>)}
                />

                {/* CTA Buttons — زر الواتساب واضح دائماً بنسبة 100% */}
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={cn(
                      'inline-flex items-center gap-3 rounded-full px-8 py-4',
                      'text-sm font-bold text-white transition-all duration-300',
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
                    href={dict.footer.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-3 rounded-full border-2 border-[#d8d4f2] bg-white px-8 py-4 shadow-sm',
                      'text-sm font-bold text-[#2d2a4a] transition-all duration-300',
                      'hover:-translate-y-1 hover:border-green-500/50 hover:bg-green-50 hover:text-green-700',
                      'dark:border-white/15 dark:bg-white/[0.04] dark:text-gray-200 dark:hover:bg-green-950/30 dark:hover:border-green-500/30 dark:hover:text-green-400',
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
                    className="mt-4 text-center text-sm font-semibold text-rose-500"
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

/* ── Background decoration ─────── */

function BackgroundDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#4b3fdf]/[0.04] blur-[80px]" />
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#b5c6ff]/[0.08] blur-[60px]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
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