import type { Client } from '@/types/client'

const mockClients: Client[] = [
  {
    id: '1',
    name: 'ta7wila',
    logo: '',
    sector: {
      ar: 'فينتك',
      en: 'Fintech',
    },
    year: '2025',
    status: 'active',
    category: 'tech',
    order: 1,
  },
  {
    id: '2',
    name: 'Draya',
    logo: '',
    sector: {
      ar: 'تعليم',
      en: 'Education',
    },
    year: '2025',
    status: 'active',
    category: 'tech',
    order: 2,
  },
  {
    id: '3',
    name: 'Tyres Pro',
    logo: '',
    sector: {
      ar: 'قطع غيار وإطارات',
      en: 'Auto Parts & Tyres',
    },
    year: '2024',
    status: 'completed',
    category: 'retail',
    order: 3,
  },
  {
    id: '4',
    name: 'Burnout Gym',
    logo: '',
    sector: {
      ar: 'لياقة بدنية',
      en: 'Fitness',
    },
    year: '2024',
    status: 'active',
    category: 'fitness',
    order: 4,
  },
  {
    id: '5',
    name: 'Meat Craft',
    logo: '',
    sector: {
      ar: 'مطاعم',
      en: 'Restaurants',
    },
    year: '2024',
    status: 'completed',
    category: 'retail',
    order: 5,
  },
  {
    id: '6',
    name: 'Leya Jewellery',
    logo: '',
    sector: {
      ar: 'مجوهرات',
      en: 'Jewellery',
    },
    year: '2023',
    status: 'completed',
    category: 'branding',
    order: 6,
  },
  {
    id: '7',
    name: 'Voodoo',
    logo: '',
    sector: {
      ar: 'علامة تجارية',
      en: 'Brand Identity',
    },
    year: '2023',
    status: 'completed',
    category: 'branding',
    order: 7,
  },
  {
    id: '8',
    name: 'Wave',
    logo: '',
    sector: {
      ar: 'خدمات رقمية',
      en: 'Digital Services',
    },
    year: '2023',
    status: 'active',
    category: 'tech',
    order: 8,
  },
  {
    id: '9',
    name: 'CarPark',
    logo: '',
    sector: {
      ar: 'مواقف ومواصلات',
      en: 'Parking & Mobility',
    },
    year: '2022',
    status: 'completed',
    category: 'tech',
    order: 9,
  },
  {
    id: '10',
    name: 'NOOR',
    logo: '',
    sector: {
      ar: 'عناية بالبشرة',
      en: 'Skincare',
    },
    year: '2026',
    status: 'active',
    category: 'fitness',
    order: 10,
  },
  {
    id: '11',
    name: 'ZERO',
    logo: '',
    sector: {
      ar: 'تطبيقات موبايل',
      en: 'Mobile Applications',
    },
    year: '2025',
    status: 'completed',
    category: 'tech',
    order: 11,
  },
  {
    id: '12',
    name: 'STRATUM',
    logo: '',
    sector: {
      ar: 'تجارة إلكترونية',
      en: 'E-Commerce',
    },
    year: '2025',
    status: 'completed',
    category: 'retail',
    order: 12,
  },
]

/**
 * Returns demo clients sorted by order.
 */
export function getMockClients(): Client[] {
  return [...mockClients].sort((a, b) => a.order - b.order)
}

/**
 * Returns a demo client by id.
 */
export function getClientById(id: string): Client | undefined {
  return mockClients.find((c) => c.id === id)
}

