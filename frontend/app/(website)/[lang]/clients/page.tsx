import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { ClientsHero } from '@/components/website/clients/clients-hero'
import { ClientsRanking } from '@/components/website/clients/clients-ranking'

// قائمة العملاء الأساسية لضمان ظهور الفهرس والعداد بشكل ممتلئ واحترافي دائما
const SHOWCASE_CLIENTS = [
  {
    id: 'client-alnour',
    nameAr: 'مستشفى النور التخصصي',
    nameEn: 'Al-Nour Specialized Hospital',
    category: 'fitness',
    sector: { ar: 'رعاية صحية ومستشفيات', en: 'Healthcare & Hospitals' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-ostaz',
    nameAr: 'منصة الأستاذ التعليمية',
    nameEn: 'Al-Ostaz Educational Platform',
    category: 'tech',
    sector: { ar: 'تكنولوجيا التعليم', en: 'EdTech & E-Learning' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-electrolite',
    nameAr: 'متجر إلكترولايت للأجهزة',
    nameEn: 'Electrolite Appliances',
    category: 'retail',
    sector: { ar: 'تجارة إلكترونية وتجزئة', en: 'E-Commerce & Retail' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-pulsegym',
    nameAr: 'أندية بالس جيم الرياضية',
    nameEn: 'Pulse Gym Fitness Clubs',
    category: 'fitness',
    sector: { ar: 'أندية رياضية ولياقة', en: 'Fitness & Gyms' },
    status: 'completed',
    year: '2025',
  },
  {
    id: 'client-aqartech',
    nameAr: 'شركة عقار تك للاستثمار',
    nameEn: 'AqarTech Real Estate',
    category: 'tech',
    sector: { ar: 'تكنولوجيا واستثمار عقاري', en: 'PropTech & Real Estate' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-foodmaster',
    nameAr: 'مجموعة مطاعم فود ماستر',
    nameEn: 'FoodMaster Restaurants Group',
    category: 'retail',
    sector: { ar: 'مطاعم وأنظمة نقاط بيع', en: 'Restaurants & Cloud POS' },
    status: 'completed',
    year: '2025',
  },
  {
    id: 'client-enjaz',
    nameAr: 'مؤسسة إنجاز لحلول الأعمال',
    nameEn: 'Enjaz Enterprise Solutions',
    category: 'tech',
    sector: { ar: 'أنظمة تخطيط موارد المؤسسات', en: 'Enterprise ERP Systems' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-khebra',
    nameAr: 'منصة خبرة للموارد البشرية',
    nameEn: 'Khebra HR Solutions',
    category: 'tech',
    sector: { ar: 'توظيف وإدارة موارد بشرية', en: 'HR & Recruitment Tech' },
    status: 'completed',
    year: '2025',
  },
  {
    id: 'client-amwal',
    nameAr: 'شركة أموال للحلول المالية',
    nameEn: 'Amwal Financial Corp',
    category: 'tech',
    sector: { ar: 'أنظمة مالية ومحاسبية', en: 'FinTech & Accounting' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-masar',
    nameAr: 'مدارس مسار الدولية',
    nameEn: 'Masar International Schools',
    category: 'tech',
    sector: { ar: 'إدارة مؤسسات تعليمية', en: 'School Management Systems' },
    status: 'completed',
    year: '2025',
  },
  {
    id: 'client-stylestore',
    nameAr: 'مجموعة ستايل فاشون للأزياء',
    nameEn: 'Style Fashion Retail',
    category: 'retail',
    sector: { ar: 'أزياء وتجارة إلكترونية', en: 'Fashion & E-Commerce' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-fleet',
    nameAr: 'شركة أسطول لتأجير السيارات',
    nameEn: 'Ostool Fleet Rentals',
    category: 'branding',
    sector: { ar: 'نقل وإدارة أساطيل', en: 'Transport & Fleet Management' },
    status: 'completed',
    year: '2025',
  },
  {
    id: 'client-eyadati',
    nameAr: 'مجمع عيادتي الطبي',
    nameEn: 'Eyadati Medical Complex',
    category: 'fitness',
    sector: { ar: 'مراكز وعيادات طبية', en: 'Medical Clinics' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-smartinv',
    nameAr: 'سمارت لوجستيك والمخازن',
    nameEn: 'Smart Logistics & Inventory',
    category: 'retail',
    sector: { ar: 'إدارة سلاسل الإمداد والمخازن', en: 'Supply Chain & Inventory' },
    status: 'completed',
    year: '2025',
  },
  {
    id: 'client-mostashar',
    nameAr: 'مؤسسة مستشار القانونية',
    nameEn: 'Mostashar Legal Group',
    category: 'branding',
    sector: { ar: 'مكاتب محاماة واستشارات', en: 'Legal & Consultancy' },
    status: 'completed',
    year: '2025',
  },
  {
    id: 'client-captainfit',
    nameAr: 'أكاديمية كابتن فيت',
    nameEn: 'CaptainFit Academy',
    category: 'fitness',
    sector: { ar: 'تدريب رياضي وتطبيقات لياقة', en: 'Fitness & Personal Training' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-madar',
    nameAr: 'شركة مدار للشحن السريع',
    nameEn: 'Madar Express Logistics',
    category: 'retail',
    sector: { ar: 'خدمات شحن وتوصيل', en: 'Shipping & Delivery' },
    status: 'active',
    year: '2025',
  },
  {
    id: 'client-sanaa',
    nameAr: 'منصة صنعة للخدمات',
    nameEn: 'Sanaa Home Services',
    category: 'branding',
    sector: { ar: 'خدمات وصيانة منزلية', en: 'Home Maintenance Services' },
    status: 'completed',
    year: '2025',
  },
  {
    id: 'client-nabdh',
    nameAr: 'نبض كير للرعاية الصحية',
    nameEn: 'Nabdh Telehealth Care',
    category: 'fitness',
    sector: { ar: 'رعاية صحية واستشارات عن بعد', en: 'Telehealth & Medical Care' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-maqadi',
    nameAr: 'أسواق مقاضي المركزية',
    nameEn: 'Maqadi Central Markets',
    category: 'retail',
    sector: { ar: 'تجارة وتوصيل سلع غذائية', en: 'Grocery & Retail Delivery' },
    status: 'completed',
    year: '2025',
  },
  {
    id: 'client-meshwari',
    nameAr: 'شركة مشواري للنقل الذكي',
    nameEn: 'Meshwari Smart Mobility',
    category: 'tech',
    sector: { ar: 'تطبيقات النقل التشاركي', en: 'Ride-Sharing & Mobility' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-aqarapp',
    nameAr: 'مجموعة عقاري للتطوير',
    nameEn: 'Aqari Development Group',
    category: 'branding',
    sector: { ar: 'تطوير وتسويق عقاري', en: 'Real Estate Development' },
    status: 'completed',
    year: '2024',
  },
  {
    id: 'client-anaqa',
    nameAr: 'مراكز أناقة للتجميل',
    nameEn: 'Anaqa Beauty Centers',
    category: 'branding',
    sector: { ar: 'مراكز عناية وحجوزات', en: 'Beauty & Wellness' },
    status: 'completed',
    year: '2025',
  },
  {
    id: 'client-fooddrop',
    nameAr: 'فود دروب لتوصيل المطاعم',
    nameEn: 'FoodDrop Delivery',
    category: 'retail',
    sector: { ar: 'توصيل طلبات المطاعم', en: 'Food Delivery Tech' },
    status: 'active',
    year: '2026',
  },
  {
    id: 'client-mywallet',
    nameAr: 'محفظتي للتكنولوجيا المالية',
    nameEn: 'MyWallet FinTech',
    category: 'tech',
    sector: { ar: 'مدفوعات رقمية ومحافظ مالية', en: 'Digital Wallet & FinTech' },
    status: 'active',
    year: '2026',
  },
]

function resolveCategory(sectorText: string): 'tech' | 'fitness' | 'retail' | 'branding' {
  const s = sectorText.toLowerCase()
  if (s.includes('طب') || s.includes('صح') || s.includes('مستشف') || s.includes('رياض') || s.includes('لياق') || s.includes('health') || s.includes('fit')) {
    return 'fitness'
  }
  if (s.includes('متجر') || s.includes('تجار') || s.includes('تجزئ') || s.includes('مطعم') || s.includes('سوق') || s.includes('شحن') || s.includes('retail') || s.includes('store')) {
    return 'retail'
  }
  if (s.includes('هوي') || s.includes('تجميل') || s.includes('قانون') || s.includes('تأجير') || s.includes('خدم') || s.includes('brand')) {
    return 'branding'
  }
  return 'tech'
}

export async function generateMetadata(
  props: PageProps<'/[lang]/clients'>,
): Promise<Metadata> {
  const { lang } = await props.params

  if (!isValidLocale(lang)) return {}

  const dict = await getDictionary(lang)

  return {
    title: dict.seo.clients.title,
    description: dict.seo.clients.description,
  }
}

export default async function ClientsPage(props: PageProps<'/[lang]/clients'>) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const isEn = locale === 'en'

  const apiBase = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')

  // 1. جلب العملاء المسجلين في قاعدة البيانات من لوحة التحكم
  let dbClients: any[] = []
  try {
    const res = await fetch(`${apiBase}/clients`, { cache: 'no-store' })
    if (res.ok) {
      const payload = await res.json()
      const records = Array.isArray(payload) ? payload : payload?.data
      if (Array.isArray(records)) {
        dbClients = records.map((c: any) => {
          const rawSector = typeof c.sector === 'string' ? c.sector : (c.industry || 'أعمال وتقنية')
          return {
            id: String(c.id || Math.random()),
            name: c.name || 'عميل كودكسا',
            category: c.category || resolveCategory(rawSector),
            sector: typeof c.sector === 'object' && c.sector !== null
              ? c.sector
              : { ar: rawSector, en: rawSector },
            status: c.status === 'نشط' || c.status === 'قيد التنفيذ' || c.status === 'active' ? 'active' : 'completed',
            year: String(c.year || (c.createdAt ? new Date(c.createdAt).getFullYear() : '2026')),
            website: c.website || c.url || undefined,
          }
        })
      }
    }
  } catch (error) {
    console.error('تعذر جلب بيانات العملاء:', error)
  }

  // 2. تجهيز قائمة العملاء الأساسية
  const formattedShowcase = SHOWCASE_CLIENTS.map((sc) => ({
    id: sc.id,
    name: isEn ? sc.nameEn : sc.nameAr,
    nameAr: sc.nameAr,
    nameEn: sc.nameEn,
    category: sc.category,
    sector: sc.sector,
    status: sc.status,
    year: sc.year,
    website: undefined,
  }))

  // 3. دمج عملاء قاعدة البيانات مع القائمة الأساسية مع منع التكرار في حال تعديل عميل موجود
  const dbNames = new Set(dbClients.map((c) => c.name.trim().toLowerCase()))
  const filteredShowcase = formattedShowcase.filter(
    (sc) =>
      !dbNames.has(sc.name.trim().toLowerCase()) &&
      !dbNames.has(sc.nameAr.trim().toLowerCase()) &&
      !dbNames.has(sc.nameEn.trim().toLowerCase())
  )

  const combinedClients = [...dbClients, ...filteredShowcase].map((client, index) => ({
    ...client,
    order: index + 1,
  }))

  return (
    <>
      <ClientsHero locale={locale} dict={dict} />
      <ClientsRanking clients={combinedClients as any} locale={locale} dict={dict} />
    </>
  )
}