import type { Project } from '@/types/project'

const mockProjects: Project[] = [
  {
    id: '1',
    slug: 'draya',
    title: {
      ar: 'درايا',
      en: 'Draya',
    },
    description: {
      ar: 'منصة رقمية متكاملة لتجربة مستخدم سلسة وعصرية تعكس هوية العلامة.',
      en: 'An integrated digital platform with a smooth, modern user experience that reflects the brand identity.',
    },
    shortDescription: {
      ar: 'منصة رقمية متكاملة.',
      en: 'Integrated digital platform.',
    },
    category: {
      ar: 'تطوير الويب',
      en: 'Web Development',
    },
    tags: ['web', 'branding'],
    image: '',
    watermark: 'Draya',
    themeClass: 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]',
    year: '2024',
    services: {
      ar: 'UX Research · UI Design · Development',
      en: 'UX Research · UI Design · Development',
    },
    pills: [
      { ar: '18 شاشة', en: '18 Screens' },
      { ar: 'نظام تصميم', en: 'Design System' },
      { ar: '1 أسابيع', en: '1 Week' },
    ],
    glowColor: '#4f46e5',
    featured: true,
    order: 1,
  },
  {
    id: '2',
    slug: 'tyres-pro',
    title: {
      ar: 'تايرز برو',
      en: 'Tyres Pro',
    },
    description: {
      ar: 'متجر إلكتروني متخصص في قطع غيار السيارات بتصميم جريء وتجربة شراء سهلة وحجز مواعيد الفحص.',
      en: 'An e-commerce store for auto parts with bold design, seamless shopping experience, and inspection booking.',
    },
    shortDescription: {
      ar: 'متجر إلكتروني لقطع الغيار.',
      en: 'Auto parts e-commerce store.',
    },
    category: {
      ar: 'تطوير الويب',
      en: 'Web Development',
    },
    tags: ['web', 'ecommerce'],
    image: '',
    watermark: 'Tyres Pro',
    themeClass: 'from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6]',
    year: '2024',
    services: {
      ar: 'E-Commerce · UI/UX · Mobile Ready',
      en: 'E-Commerce · UI/UX · Mobile Ready',
    },
    pills: [
      { ar: '24 شاشة', en: '24 Screens' },
      { ar: 'متجر إلكتروني', en: 'E-Commerce' },
      { ar: '2 أسابيع', en: '2 Weeks' },
    ],
    glowColor: '#7c3aed',
    featured: true,
    order: 2,
  },
  {
    id: '3',
    slug: 'ta7wila',
    title: {
      ar: 'تحويلة',
      en: 'ta7wila',
    },
    description: {
      ar: 'تطبيق جوال يربط بين الخدمات والمستخدمين بتجربة بصرية مميزة وأداء عالي مع نظام تتبع مباشر.',
      en: 'A mobile app connecting services and users with a distinctive visual experience and real-time tracking.',
    },
    shortDescription: {
      ar: 'تطبيق جوال للخدمات.',
      en: 'Mobile services app.',
    },
    category: {
      ar: 'تطوير الجوال',
      en: 'Mobile Development',
    },
    tags: ['mobile', 'ui'],
    image: '',
    watermark: 'ta7wila',
    themeClass: 'from-[#0f172a] via-[#1e293b] to-[#334155]',
    year: '2024',
    services: {
      ar: 'Mobile App · System Architecture',
      en: 'Mobile App · System Architecture',
    },
    pills: [
      { ar: '32 شاشة', en: '32 Screens' },
      { ar: 'تطبيق جوال', en: 'Mobile App' },
      { ar: '3 أسابيع', en: '3 Weeks' },
    ],
    glowColor: '#0891b2',
    featured: true,
    order: 3,
  },
  {
    id: '4',
    slug: 'burnout',
    title: {
      ar: 'بيرن آوت',
      en: 'Burnout',
    },
    description: {
      ar: 'هوية بصرية وتطبيق لياقة بدنية يجمع بين الطاقة والانضباط في تجربة واحدة ومجتمع تفاعلي.',
      en: 'A visual identity and fitness app combining energy and discipline in one experience and community.',
    },
    shortDescription: {
      ar: 'هوية بصرية وتطبيق لياقة.',
      en: 'Fitness brand and app.',
    },
    category: {
      ar: 'الهوية البصرية',
      en: 'Branding',
    },
    tags: ['branding', 'mobile'],
    image: '',
    watermark: 'Burnout',
    themeClass: 'from-[#881337] via-[#be123c] to-[#e11d48]',
    year: '2023',
    services: {
      ar: 'Branding · Identity · UI Design',
      en: 'Branding · Identity · UI Design',
    },
    pills: [
      { ar: '15 شاشة', en: '15 Screens' },
      { ar: 'هوية بصرية', en: 'Branding' },
      { ar: '2 أسابيع', en: '2 Weeks' },
    ],
    glowColor: '#be123c',
    featured: true,
    order: 4,
  },
]

/**
 * Returns demo projects sorted by order.
 */
export function getMockProjects(): Project[] {
  return [...mockProjects].sort((a, b) => a.order - b.order)
}

/**
 * Returns only featured projects for the Home page.
 */
export function getFeaturedProjects(limit?: number): Project[] {
  const featured = mockProjects.filter((p) => p.featured).sort((a, b) => a.order - b.order)
  return limit ? featured.slice(0, limit) : featured
}

/**
 * Returns a project by slug.
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return mockProjects.find((p) => p.slug === slug)
}
