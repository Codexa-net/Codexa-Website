import type { Project } from '@/types/project'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// ⚠️ الباك إند الحالي (NestJS) لا يوفر بعد موديول /projects (لا يوجد Prisma model
// ولا Controller لها) — القائمة دي بيانات احتياطية محلية عشان الموقع العام ميظهرش
// فاضي، وتتفعل تلقائيًا فقط لو الطلب لـ /projects فشل أو رجّع نتيجة فاضية.
// لما يتم بناء موديول المشاريع في الباك إند، هيبدأ يرجع بيانات حقيقية من غير أي تعديل هنا.
const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'fallback-1',
    slug: 'ecommerce-platform',
    title: { ar: 'منصة تجارة إلكترونية', en: 'E-commerce Platform' },
    description: {
      ar: 'منصة إلكترونية متكاملة لإدارة المنتجات والطلبات والعملاء.',
      en: 'A fully integrated e-commerce platform for managing products, orders, and customers.',
    },
    shortDescription: {
      ar: 'منصة تجارة إلكترونية متكاملة.',
      en: 'A fully integrated e-commerce platform.',
    },
    category: { ar: 'متاجر إلكترونية', en: 'E-commerce' },
    tags: ['Next.js', 'Node.js'],
    image: '/images/projects light.png',
    featured: true,
    order: 1,
    year: '2026',
  },
  {
    id: 'fallback-2',
    slug: 'medical-services-app',
    title: { ar: 'تطبيق الخدمات الطبية', en: 'Medical Services App' },
    description: {
      ar: 'منصة لإدارة مهام الفرق ومتابعة سير العمل يوميًا في القطاع الطبي.',
      en: 'A platform for managing healthcare team tasks and daily workflows.',
    },
    shortDescription: {
      ar: 'إدارة مهام الفرق الطبية.',
      en: 'Healthcare team task management.',
    },
    category: { ar: 'تطبيقات ويب', en: 'Web App' },
    tags: ['React', 'Laravel'],
    image: '/images/projects dark.jpg',
    featured: true,
    order: 2,
    year: '2026',
  },
  {
    id: 'fallback-3',
    slug: 'warehouse-management',
    title: { ar: 'نظام إدارة المخازن', en: 'Warehouse Management System' },
    description: {
      ar: 'نظام إلكتروني لإدارة الحجوزات والمواعيد للمراكز والعيادات.',
      en: 'An electronic system for managing bookings and appointments for centers and clinics.',
    },
    shortDescription: {
      ar: 'إدارة الحجوزات والمواعيد.',
      en: 'Bookings and appointments management.',
    },
    category: { ar: 'أنظمة إدارية', en: 'Admin Systems' },
    tags: ['Vue.js', 'Node.js'],
    image: '/images/projects light.png',
    featured: false,
    order: 3,
    year: '2026',
  },
]

export async function getMockProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/projects`, { cache: 'no-store' })
    if (!res.ok) return FALLBACK_PROJECTS
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return FALLBACK_PROJECTS
    return data.sort((a: Project, b: Project) => a.order - b.order)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return FALLBACK_PROJECTS
  }
}

export async function getFeaturedProjects(limit?: number): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/projects`, { cache: 'no-store' })
    const data: Project[] = res.ok ? await res.json() : []
    const source = Array.isArray(data) && data.length > 0 ? data : FALLBACK_PROJECTS
    const featured = source.filter((p) => p.featured).sort((a, b) => a.order - b.order)
    return limit ? featured.slice(0, limit) : featured
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    const featured = FALLBACK_PROJECTS.filter((p) => p.featured).sort((a, b) => a.order - b.order)
    return limit ? featured.slice(0, limit) : featured
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  try {
    const res = await fetch(`${API_URL}/projects/${slug}`, { cache: 'no-store' })
    if (res.ok) return await res.json()
    return FALLBACK_PROJECTS.find((p) => p.slug === slug)
  } catch (error) {
    console.error(`Error fetching project ${slug}:`, error)
    return FALLBACK_PROJECTS.find((p) => p.slug === slug)
  }
}