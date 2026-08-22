import type { LocalizedText } from './project'

export type ClientStatus = 'active' | 'completed'
export type ClientCategory = 'all' | 'tech' | 'fitness' | 'retail' | 'branding'

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
  /** Display order / ranking number */
  order: number
  /** Year of partnership/project */
  year?: string
  /** Partnership status */
  status?: ClientStatus
  /** Filter category */
  category?: ClientCategory
}

