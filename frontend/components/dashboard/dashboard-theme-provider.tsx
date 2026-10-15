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

  // 1. قراءة ثيم لوحة التحكم المنفصل
  useEffect(() => {
    const storedTheme = localStorage.getItem('dashboard-theme') as Theme
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme)
    }
    setMounted(true)
  }, [])

  // 2. تطبيق ثيم لوحة التحكم وإعادة ثيم الموقع الأصلي فور مغادرة الداشبورد
  useEffect(() => {
    if (!mounted) return

    const html = document.documentElement

    // فرض ثيم الداشبورد الحالي
    if (theme === 'dark') {
      html.classList.add('dark')
      html.style.colorScheme = 'dark'
    } else {
      html.classList.remove('dark')
      html.style.colorScheme = 'light'
    }

    // 🟢 عند مغادرة لوحة التحكم والعودة للموقع الخارجي:
    // الموقع الخارجي أساسه وفخامته داكنة (Dark)، لا نسمح بقلبه فاتح إلا إذا اختار الزائر بنفسه light في الموقع
    return () => {
      const siteTheme = localStorage.getItem('theme')
      if (siteTheme === 'light') {
        html.classList.remove('dark')
        html.style.colorScheme = 'light'
      } else {
        html.classList.add('dark')
        html.style.colorScheme = 'dark'
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
    return <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f17]" /> 
  }

  return (
    <DashboardThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen w-full bg-[#f8fafc] text-gray-900 transition-colors duration-200 dark:bg-[#0b0f17] dark:text-white">
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