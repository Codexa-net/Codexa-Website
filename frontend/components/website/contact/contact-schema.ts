import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, { message: 'الاسم يجب أن يكون حرفين على الأقل' }),
  projectName: z.string().min(2, { message: 'اسم المشروع يجب أن يكون حرفين على الأقل' }),
  projectType: z.string().min(1, { message: 'برجاء اختيار نوع المشروع' }),
  email: z
    .string()
    .min(4, { message: 'برجاء إدخال رقم الواتساب أو البريد الإلكتروني' })
    .refine(
      (val) => {
        const clean = val.trim()
        // 1. فحص هل هو إيميل صحيح
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)
        // 2. فحص هل هو رقم هاتف / واتساب صالح (من 8 إلى 16 رقماً)
        const digitsOnly = clean.replace(/\D/g, '')
        const isPhone = digitsOnly.length >= 8 && digitsOnly.length <= 16

        return isEmail || isPhone
      },
      {
        message: 'برجاء إدخال بريد إلكتروني صحيح أو رقم هاتف صالح للتواصل',
      }
    ),
})

export type ContactFormValues = z.infer<typeof contactSchema>