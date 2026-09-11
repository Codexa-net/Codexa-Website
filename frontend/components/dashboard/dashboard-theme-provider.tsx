'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface DashboardThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const DashboardThemeContext = createContext<DashboardThemeContextType | undefined>(undefined)

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark') 
  const [mounted, setMounted] = useState(false)

  // قراءة ثيم لوحة التحكم المنفصل
  useEffect(() => {
    const storedTheme = localStorage.getItem('dashboard-theme') as Theme
    if (storedTheme) setTheme(storedTheme)
    setMounted(true)
  }, [])

  // السيطرة الكاملة على الـ html وعزل تأثير الموقع الخارجي
  useEffect(() => {
    if (!mounted) return

    const html = document.documentElement
    // حفظ حالة الموقع الأساسي لإرجاعها عند الخروج
    const websiteTheme = localStorage.getItem('theme')

    // فرض ثيم لوحة التحكم على أعلى مستوى في الصفحة
    if (theme === 'dark') {
      html.classList.add('dark')
      html.style.colorScheme = 'dark'
    } else {
      html.classList.remove('dark')
      html.style.colorScheme = 'light'
    }

    // إرجاع ثيم الموقع الأساسي عند إغلاق أو الخروج من لوحة التحكم
    return () => {
      if (websiteTheme === 'dark') {
        html.classList.add('dark')
        html.style.colorScheme = 'dark'
      } else {
        html.classList.remove('dark')
        html.style.colorScheme = 'light'
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('dashboard-theme', newTheme)
      return newTheme
    })
  }

  if (!mounted) {
    return <div className="min-h-screen bg-[#f7f8fb] dark:bg-[#030712]" /> 
  }

  return (
    <DashboardThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen w-full bg-[#f7f8fb] text-[#14161f] transition-colors duration-300 dark:bg-[#030712] dark:text-white">
        {children}
      </div>
    </DashboardThemeContext.Provider>
  )
}

export function useDashboardTheme() {
  const context = useContext(DashboardThemeContext)
  if (context === undefined) {
    throw new Error('useDashboardTheme must be used within a DashboardThemeProvider')
  }
  return context
}