import type { Client } from '@/types/client'

/**
 * Extra copy that only the client details page needs.
 *
 * Kept apart from the listing data on purpose: the index renders twelve rows
 * and has no use for a paragraph and a quote per client. Keyed by slug so a
 * client can be added to the index long before anyone has written its story.
 *
 * When the API is wired up this file goes away — GET /clients/:slug already
 * returns these exact fields.
 */
type ClientDetail = Pick<
  Client,
  'description' | 'testimonial' | 'testimonialAuthor' | 'testimonialRole'
>

const clientDetails: Record<string, ClientDetail> = {
  ta7wila: {
    description: {
      en: 'A payments platform built for the Egyptian market, where transfers had to clear reliably on networks that are anything but reliable. We designed the ledger, the reconciliation flow, and the dashboard the operations team lives in every day.',
      ar: 'منصة مدفوعات مبنية للسوق المصري، والتحويلات فيها لازم تعدي بثبات على شبكات غير ثابتة. صممنا سجل الحسابات، وتدفق التسويات، ولوحة التحكم اللي فريق العمليات شغال عليها كل يوم.',
    },
    testimonial: {
      en: 'They shipped faster than anyone we had worked with, and asked the questions our own team had not thought to ask yet.',
      ar: 'سلّموا أسرع من أي حد اشتغلنا معاه، وسألوا أسئلة فريقنا نفسه ماكانش فكر فيها.',
    },
    testimonialAuthor: 'Ahmed Mohamed',
    testimonialRole: 'Chief Technology Officer',
  },
  draya: {
    description: {
      en: 'A learning platform for instructors who were running their courses out of spreadsheets and group chats. The work was less about video playback and more about giving one teacher a clear view of thirty students at once.',
      ar: 'منصة تعليمية لمدرسين كانوا بيديروا كورساتهم على شيتات وجروبات. الشغل ماكانش عن تشغيل الفيديو قد ما كان عن إن المدرس يشوف تلاتين طالب قدامه بوضوح.',
    },
    testimonial: {
      en: 'The first version already did the thing we had been describing for two years.',
      ar: 'أول نسخة عملت الحاجة اللي كنا بنوصفها من سنتين.',
    },
    testimonialAuthor: 'Nour Hassan',
    testimonialRole: 'Founder',
  },
  'tyres-pro': {
    description: {
      en: 'A retail catalogue where the hard part was fitment: a tyre either fits your car or it does not, and getting that wrong costs a return. We rebuilt the search around the vehicle rather than around the product.',
      ar: 'كتالوج بيع بالتجزئة، والصعب فيه كان التوافق: الإطار يا إما يركب على عربيتك يا إما لأ، والغلط هنا معناه مرتجع. أعدنا بناء البحث حوالين العربية نفسها مش حوالين المنتج.',
    },
  },
  'burnout-gym': {
    description: {
      en: 'A booking system for a gym whose classes filled in minutes and whose front desk was fielding the overflow by phone. Memberships, class capacity, and the waitlist all had to agree with each other in real time.',
      ar: 'نظام حجز لجيم كلاساته بتتملي في دقايق، والريسبشن كان بيستقبل الباقي على التليفون. الاشتراكات وسعة الكلاس وقائمة الانتظار كان لازم يتفقوا مع بعض لحظة بلحظة.',
    },
    testimonial: {
      en: 'Our front desk went from taking sixty calls a day to taking six.',
      ar: 'الريسبشن كان بيرد على ستين مكالمة في اليوم، بقى ستة.',
    },
    testimonialAuthor: 'Karim Adel',
    testimonialRole: 'Operations Manager',
  },
}

/** Returns the extra details for a client, or an empty object if none exist. */
export function getClientDetail(slug: string): ClientDetail {
  return clientDetails[slug] ?? {}
}
