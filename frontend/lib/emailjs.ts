import emailjs from '@emailjs/browser'

interface SendTrackingEmailProps {
  name: string
  email: string
  projectName: string
  trackingToken?: string // رمز أو معرّف متابعة المشروع
}

export async function sendProjectTrackingEmail({
  name,
  email,
  projectName,
  trackingToken = 'preview',
}: SendTrackingEmailProps) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('بيانات EmailJS غير مكتملة في متغيرات البيئة .env.local')
  }

  // رابط المتابعة الذي سيضغط عليه العميل داخل الإيميل
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000'
  const trackingUrl = `${origin}/track/${trackingToken}`

  // المتغيرات المطابقة تماماً لما كتبناه داخل القالب في EmailJS
  const templateParams = {
    name,
    email,
    project_name: projectName,
    tracking_url: trackingUrl,
  }

  try {
    const res = await emailjs.send(serviceId, templateId, templateParams, publicKey)
    return { success: true, status: res.status }
  } catch (error: any) {
    console.error('EmailJS Send Error:', error)
    return { success: false, error: error?.text || error?.message || 'حدث خطأ أثناء الإرسال' }
  }
}