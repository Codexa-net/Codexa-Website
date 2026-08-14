import type { Metadata } from 'next'

import '../globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export const metadata: Metadata = {
  title: {
    default: 'Codexa',
    template: '%s - Codexa',
  },
  description: 'Codexa - Creative Technology Agency',
  metadataBase: new URL('https://codexa.sa'),
}

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
