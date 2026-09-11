import type { Client } from '@/types/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// ⚠️ الباك إند الحالي لا يوفر بعد موديول /clients — بيانات احتياطية محلية
// تتفعل تلقائيًا فقط عند فشل الطلب أو رجوع نتيجة فاضية. راجع نفس الملاحظة
// في data/projects.ts.
const FALLBACK_CLIENTS: Client[] = [
  { id: 'fallback-1', name: 'مستشفى الشفاء', logo: '/images/projects light.png', order: 1, category: 'tech' },
  { id: 'fallback-2', name: 'مجموعة الأمل التجارية', logo: '/images/projects light.png', order: 2, category: 'retail' },
  { id: 'fallback-3', name: 'أكاديمية المستقبل', logo: '/images/projects light.png', order: 3, category: 'tech' },
]

export async function getMockClients(): Promise<Client[]> {
  try {
    const res = await fetch(`${API_URL}/clients`, { cache: 'no-store' })
    if (!res.ok) return FALLBACK_CLIENTS
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return FALLBACK_CLIENTS
    return data.sort((a: Client, b: Client) => a.order - b.order)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return FALLBACK_CLIENTS
  }
}

export async function getClientById(idOrSlug: string): Promise<Client | undefined> {
  try {
    const res = await fetch(`${API_URL}/clients/${idOrSlug}`, { cache: 'no-store' })
    if (res.ok) return await res.json()
    return FALLBACK_CLIENTS.find((c) => c.id === idOrSlug)
  } catch (error) {
    console.error(`Error fetching client ${idOrSlug}:`, error)
    return FALLBACK_CLIENTS.find((c) => c.id === idOrSlug)
  }
}