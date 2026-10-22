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
        className="relative flex min-h-screen w-full bg-[#f8fafc] text-gray-900 overflow-x-hidden dark:bg-[#0b0f17] dark:text-gray-100"
        dir="rtl"
      >
        {/* الشريط الجانبي: درج منزلق أنيق في الهاتف، وثابت على الشاشات الكبيرة */}
        <Sidebar initialRole={admin?.role} />

        {/* مساحة العمل الرئيسية */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col w-full">
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

          <main className="flex-1 w-full px-3 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </DashboardThemeProvider>
  );
}