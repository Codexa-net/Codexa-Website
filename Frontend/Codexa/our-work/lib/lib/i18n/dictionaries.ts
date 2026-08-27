import type { Locale } from './config'

const dictionaries = {
  ar: {
    seo: {
      ourWork: {
        title: 'أعمالنا - عمار | Codexa',
        description: 'مشروع عمار - هوية بصرية وتطبيقات وتصميمات رقمية متكاملة'
      }
    }
  },
  en: {
    seo: {
      ourWork: {
        title: 'Our Work - Ammar | Codexa',
        description: 'Ammar Project - Complete visual identity and digital applications'
      }
    }
  }
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries.ar
}
