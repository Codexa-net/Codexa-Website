import type { Client } from '@/types/client'

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Demo Client 01',
    logo: '',
    description: {
      ar: 'بيانات عرض توضيحية فقط ولا تمثل عميلا حقيقيا لكودكسا.',
      en: 'Demo placeholder data only. This does not represent a real Codexa client.',
    },
    sector: {
      ar: 'قطاع تجريبي',
      en: 'Demo Sector',
    },
    order: 1,
  },
  {
    id: '2',
    name: 'Demo Client 02',
    logo: '',
    description: {
      ar: 'بيانات عرض توضيحية فقط ولا تشير إلى علاقة عمل فعلية.',
      en: 'Demo placeholder data only. It does not imply an actual working relationship.',
    },
    sector: {
      ar: 'قطاع تجريبي',
      en: 'Demo Sector',
    },
    order: 2,
  },
  {
    id: '3',
    name: 'Demo Client 03',
    logo: '',
    description: {
      ar: 'عنصر تجريبي لاستخدامه أثناء بناء الواجهة.',
      en: 'A demo item used while the interface is being built.',
    },
    sector: {
      ar: 'قطاع تجريبي',
      en: 'Demo Sector',
    },
    order: 3,
  },
]

/**
 * Returns demo clients sorted by order.
 * Replace with a verified client data source only when real approvals exist.
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
