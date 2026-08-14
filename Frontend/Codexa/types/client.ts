import type { LocalizedText } from './project'

export interface Client {
  id: string
  name: string
  /** Path to the client logo image */
  logo: string
  /** Optional localized description or testimonial */
  description?: LocalizedText
  /** Industry/sector */
  sector?: LocalizedText
  /** Client website URL */
  website?: string
  /** Display order */
  order: number
}
