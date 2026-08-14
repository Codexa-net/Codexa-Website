import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Codexa Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * Dashboard layout.
 * Future: add sidebar, auth check, and navigation here.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Future: DashboardSidebar + DashboardHeader */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
