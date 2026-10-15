export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import { serverFetchApi } from '@/lib/server-api';
import { DashboardThemeProvider } from '@/components/dashboard/dashboard-theme-provider';

interface CurrentAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  phone?: string | null;
}

type AuthResponse =
  | CurrentAdmin
  | {
      data?: CurrentAdmin | null;
    };

function unwrapAdmin(response: AuthResponse): CurrentAdmin | null {
  if (
    response &&
    typeof response === 'object' &&
    'data' in response
  ) {
    return response.data ?? null;
  }

  return response as CurrentAdmin;
}

async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  try {
    const response = await serverFetchApi<AuthResponse>('/auth/me');
    return unwrapAdmin(response);
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  return (
    <DashboardThemeProvider>
      <div
        className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-[#0b0f17] text-gray-900 dark:text-gray-100 overflow-x-hidden"
        dir="rtl"
      >
        {/* الشريط الجانبي */}
        <Sidebar initialRole={admin?.role} />

        {/* حاوية العمل الرئيسية */}
        <div className="flex min-h-screen flex-1 flex-col transition-all duration-300 min-w-0">
          <TopNav
            user={
              admin
                ? {
                    name: admin.name,
                    role: admin.role,
                    avatar: admin.avatar ?? '',
                  }
                : undefined
            }
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardThemeProvider>
  );
}