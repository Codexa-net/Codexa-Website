import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { OurWorkHero } from '@/components/website/projects/our-work-hero'
import { ProjectsFilter } from '@/components/website/projects/projects-filter'

// دالة لجلب المشاريع الحقيقية من الباك إند
async function fetchRealProjects() {
  try {
    // استخدمنا no-store عشان يعرض أحدث شغل بتضيفه من الداشبورد فوراً
    const res = await fetch('http://localhost:3001/projects', { cache: 'no-store' })
    if (!res.ok) return []
    
    const data = await res.json()
    
    // تكييف بيانات قاعدة البيانات عشان تناسب الفرونت إند
    return data.map((p: any) => {
      // ربط تصنيف الداشبورد بالفلتر
      let mappedTags = ['ui']
      if (p.category === 'مواقع' || p.category === 'Web') mappedTags = ['web', 'ui']
      if (p.category === 'تطبيقات' || p.category === 'Mobile') mappedTags = ['mobile', 'ui']

      return {
        ...p,
        tags: mappedTags,
        cover: p.cover || '/projects/ecommerce.jpg', // صورة افتراضية لو نسيت ترفع صورة
        themeFrom: p.themeFrom || '#1e3a8a',
        themeTo: p.themeTo || '#2563eb',
        // بيانات افتراضية للمدير والمصمم عشان الكروت متضربش لو مش موجودة
        manager: p.manager || { name: 'عمر أحمد', initials: 'عأ', color: '#60A5FA' },
        designer: p.designer || { name: 'فريق كودكسا', initials: 'كك', color: '#34D399' },
      }
    })
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return []
  }
}

export async function generateMetadata(
  props: PageProps<'/[lang]/our-work'>,
): Promise<Metadata> {
  const { lang } = await props.params

  if (!isValidLocale(lang)) return {}

  const dict = await getDictionary(lang)

  return {
    title: dict.seo.ourWork.title,
    description: dict.seo.ourWork.description,
  }
}

export default async function OurWorkPage(props: PageProps<'/[lang]/our-work'>) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)
  
  // سحب المشاريع الحقيقية بدل الوهمية
  const projects = await fetchRealProjects()

  return (
    <>
      {/* ─── 1. Hero: Title "اكتشف ما أنجزناه" + fanned floating cards ─── */}
      <OurWorkHero
        title={dict.ourWork.heroTitle ?? 'اكتشف ما أنجزناه'}
        subtitle={dict.ourWork.heroSubtitle}
        scrollHint={dict.ourWork.heroScrollHint}
        projects={projects}
      />

      {/* ─── 2. Filter section: "كل المشاريع" + category pills + 3x3 grid ─── */}
      <Section noContainer className="bg-[var(--figma-surface-lavender)] py-16 md:py-24 dark:bg-[#0d0b1f]">
        <Container>
          <ProjectsFilter
            projects={projects}
            locale={locale}
            dict={dict.ourWork}
          />
        </Container>
      </Section>
    </>
  )
}