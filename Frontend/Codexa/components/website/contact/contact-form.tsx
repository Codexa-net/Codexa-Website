'use client'

import { useState } from 'react'
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

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: { name: '', projectName: '', projectType: '', email: '' },
  })

  /** A field is considered "valid" only once it has been touched AND passes Zod */
  const isFieldValid = (field: FieldPath<ContactFormValues>) =>
    !!dirtyFields[field] && !errors[field]

  const hints = {
    name: isArabic ? 'اكتب هنا' : 'Type here',
    projectName: isArabic ? 'اكتب هنا' : 'Type here',
    projectType: isArabic ? 'غير الاختيار' : 'Pick one',
    email: isArabic ? 'اكتب هنا' : 'Type here',
  }

  async function onSubmit(_data: ContactFormValues) {
    await new Promise((r) => setTimeout(r, 900))
    setSubmitted(true)
  }

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative overflow-hidden bg-[#fafaff] dark:bg-[#0d0b1f]"
    >
      {/* ── Background decoration ── */}
      <BackgroundDecoration />

      <div className="relative mx-auto max-w-[1280px] px-4 py-16 sm:px-8 sm:py-32 lg:py-20">

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
          className="mt-10"
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

                {/* The sentence */}
                <div className={cn(
                  'text-[clamp(1.5rem,5vw,3.75rem)] font-black leading-[1.55] text-[#0d0b2c] dark:text-white',
                  '[&_input]:text-[clamp(1.5rem,5vw,3.75rem)] [&_button]:text-[clamp(1.5rem,5vw,3.75rem)]',
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
                  {isArabic ? '،' : ','}{' '}

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
                        options={c.projectTypes}
                        placeholder={c.placeholderProjectType}
                        isArabic={isArabic}
                        isValid={isFieldValid('projectType')}
                        hintLabel={hints.projectType}
                      />
                    )}
                  />
                  {isArabic ? '،' : ','}{' '}

                  {/* Email */}
                  <span>{c.sentenceEmail} </span>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <InlineField
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder={c.placeholderEmail}
                        type="email"
                        isArabic={isArabic}
                        isValid={isFieldValid('email')}
                        hintLabel={hints.email}
                      />
                    )}
                  />
                  {' '}
                  <span className="text-[#6b6879] dark:text-gray-500">{c.sentenceEnd}</span>
                </div>

                {/* Progress dots — active only when field passes Zod */}
                <ProgressDots
                  fields={FORM_FIELDS}
                  isFieldValid={(f) => isFieldValid(f as FieldPath<ContactFormValues>)}
                />

                {/* CTA */}
                <motion.div
                  animate={{ opacity: isValid ? 1 : 0.4 }}
                  transition={{ duration: 0.4 }}
                  className="mt-10 flex flex-wrap justify-center gap-4"
                >
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={cn(
                      'inline-flex items-center gap-3 rounded-full px-8 py-4',
                      'text-sm font-bold text-white transition-all duration-300',
                      'bg-[#4b3fdf] shadow-[0_18px_35px_-12px_rgba(75,63,223,0.5)]',
                      'hover:-translate-y-1 hover:shadow-[0_22px_40px_-12px_rgba(75,63,223,0.6)]',
                      'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0',
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
                      'inline-flex items-center gap-3 rounded-full border-2 border-[#e7e4f7] px-8 py-4',
                      'text-sm font-bold text-[#3a3759] transition-all duration-300',
                      'hover:-translate-y-1 hover:border-green-400/50 hover:bg-green-50 hover:text-green-700',
                      'dark:border-white/10 dark:text-gray-300 dark:hover:bg-green-950/30 dark:hover:border-green-500/30 dark:hover:text-green-400',
                    )}
                  >
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    {c.whatsapp}
                  </a>
                </motion.div>

              </motion.div>
            )}

          </AnimatePresence>
        </motion.form>

      </div>
    </div>
  )
}

/* ── Background decoration (extracted to keep JSX clean) ─────── */

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
