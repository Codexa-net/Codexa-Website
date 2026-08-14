export interface LocalizedText {
  ar: string
  en: string
}

export interface Project {
  id: string
  slug: string
  title: LocalizedText
  description: LocalizedText
  shortDescription: LocalizedText
  category: LocalizedText
  /** Tags for filtering */
  tags: string[]
  /** Path to the project cover image */
  image: string
  /** Optional: URL to live project */
  liveUrl?: string
  /** Optional: URL to case study or detail page */
  caseStudyUrl?: string
  /** Whether to feature on the Home page */
  featured: boolean
  /** Display order */
  order: number
  /** Large watermark label behind the home slide */
  watermark?: string
  /** Tailwind gradient classes for the project visual card */
  themeClass?: string
  /** Year of project completion */
  year?: string
  /** Localized services list string */
  services?: LocalizedText
  /** Localized pill badges array (e.g. screens, design system, timeline) */
  pills?: LocalizedText[]
  /** CSS color for the bottom watermark radial glow (e.g. '#7c3aed') */
  glowColor?: string
}
