'use client'

import { useState, useMemo } from 'react'
import { useForm, Controller, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, MessageCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { submitContactFormAction } from '@/actions/contact'

import { contactSchema, type ContactFormValues } from './contact-schema'
import { InlineField } from './inline-field'
import { ProjectTypeSelector } from './project-type-selector'
import { ProgressDots } from './progress-dots'

interface ContactFormProps {
  locale: Locale
  dict: Dictionary
}

const FORM_FIELDS = ['name', 'projectName', 'projectType', 'email'] as const

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
        ? `${data.projectType} - ${data.projectName.trim()}`
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
        message: detailedMessage,
        status: 'جديد',
      }

      // 1. حفظ الرسالة محلياً وإطلاق حدث تنبيه فوري للداشبورد
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

      // 2. إرسال الرسالة إلى الباك إند عبر جميع المسارات المعتمدة
      await Promise.allSettled([
        submitContactFormAction({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          projectName: data.projectName.trim(),
          projectType: data.projectType,
          message: payload.message,
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
        fetch(`${apiUrl}/contact-messages`, {
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
      className="relative flex min-h-[calc(100svh-4.5rem)] items-center justify-center overflow-x-hidden bg-[#fafaff] pt-14 pb-12 sm:py-20 dark:bg-[#0d0b1f]"
    >
      <BackgroundDecoration />

      <div className="relative mx-auto w-full max-w-[1000px] px-5 py-8 sm:px-10 lg:py-14">
        {!submitted && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-center text-xs font-bold tracking-widest text-[#4b3fdf] uppercase sm:mb-8 sm:text-sm dark:text-brand-400"
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
              <motion.div key="form">
                {/* تنسيق انسيابي متوازن في المنتصف بدون تباعد مبالغ فيه بين الكلمات */}
                <div
                  className={cn(
                    'mx-auto max-w-[920px] pt-4 text-center text-[clamp(1.2rem,3.8vw,2.75rem)] font-black leading-[2.85] text-[#0d0b2c] sm:pt-2 sm:leading-[2.25] dark:text-white',
                    '[&_button]:text-[clamp(1.15rem,3.6vw,2.65rem)] [&_input]:text-[clamp(1.15rem,3.6vw,2.65rem)]',
                  )}
                >
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
                  />{' '}

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

                  <span>{c.sentenceEmail} </span>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <InlineField
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
                  <span className="block pt-1 text-[#6b6879] sm:inline sm:pt-0 dark:text-gray-400">
                    {c.sentenceEnd}
                  </span>
                </div>

                <ProgressDots
                  fields={FORM_FIELDS}
                  isFieldValid={(f) => isFieldValid(f as FieldPath<ContactFormValues>)}
                />

                <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-4">
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