import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2),
  projectName: z.string().min(2),
  projectType: z.string().min(1),
  email: z.string().email(),
})

export type ContactFormValues = z.infer<typeof contactSchema>
