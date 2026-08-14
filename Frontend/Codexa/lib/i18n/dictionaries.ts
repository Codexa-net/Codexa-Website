import 'server-only'

import { type Locale, isValidLocale } from './config'

export type Dictionary = typeof import('@/messages/ar.json')

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ar: () => import('@/messages/ar.json').then((m) => m.default),
  en: () => import('@/messages/en.json').then((m) => m.default),
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  if (!isValidLocale(locale)) {
    // Fall back to default locale if invalid
    return dictionaries.ar()
  }
  return dictionaries[locale]()
}
