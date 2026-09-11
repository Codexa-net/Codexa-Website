'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  MessageSquare,
  Moon,
  Sun,
  User,
  LogOut,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { logoutAction } from '@/actions/auth';

const ROLE_TRANSLATIONS: Record<string, string> = {
  SUPER_ADMIN: 'مدير نظام (Super Admin)',
  SALES_LEADER: 'مشرف مبيعات (Sales Leader)',
  SALES: 'موظف مبيعات (Sales)',
  PROJECT_MANAGER: 'مدير مشاريع',
  DEVELOPER: 'مطور برمجيات',
};

interface TopNavUser {
  name?: string | null;
  role?: string | null;
  avatar?: string | null;
}

interface ProfileUpdatedEventDetail {
  name?: string;
  avatar?: string | null;
}

export default function TopNav({
  user,
}: {
  user?: TopNavUser;
}) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [activeMenu, setActiveMenu] = useState<
    'notifications' | 'user' | null
  >(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [currentUser, setCurrentUser] = useState({
    name: user?.name || 'مستخدم كوديكسا',
    role: user?.role || 'SALES',
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    setMounted(true);

    // مصدر البيانات الأساسي هو المستخدم القادم من قاعدة البيانات
    setCurrentUser({
      name: user?.name || 'مستخدم كوديكسا',
      role: user?.role || 'SALES',
      avatar: user?.avatar || '',
    });

    const handleProfileUpdate = (
      event: Event,
    ) => {
      const customEvent =
        event as CustomEvent<ProfileUpdatedEventDetail>;

      const detail = customEvent.detail;

      if (!detail) {
        return;
      }

      setCurrentUser((previousUser) => ({
        ...previousUser,
        name: detail.name || previousUser.name,
        avatar:
          detail.avatar !== undefined
            ? detail.avatar || ''
            : previousUser.avatar,
      }));
    };

    window.addEventListener(
      'profileUpdated',
      handleProfileUpdate,
    );

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveMenu(null);
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    );

    return () => {
      window.removeEventListener(
        'profileUpdated',
        handleProfileUpdate,
      );

      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, [user]);

  const toggleMenu = (
    menu: 'notifications' | 'user',
  ) => {
    setActiveMenu((previousMenu) =>
      previousMenu === menu ? null : menu,
    );
  };

  async function handleLogout() {
    localStorage.clear();

    await logoutAction();

    router.push('/login');
    router.refresh();
  }

  const rawRole = currentUser.role
    ? currentUser.role.toUpperCase()
    : 'SALES';

  const displayRole =
    ROLE_TRANSLATIONS[rawRole] ||
    currentUser.role ||
    'مستخدم';

  const firstLetter = currentUser.name
    ? currentUser.name.charAt(0).toUpperCase()
    : 'C';

  return (
    <header
      className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-8 transition-colors dark:border-gray-800 dark:bg-[#0d111a]"
      dir="rtl"
    >
      <div className="relative w-full max-w-sm">
        <Search
          size={16}
          className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="بحث..."
          className="w-full rounded-full border border-gray-200 bg-[#f7f8fb] py-2 pe-4 ps-11 text-right text-xs outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white"
        />
      </div>

      <div
        ref={containerRef}
        className="flex items-center gap-4"
      >
        <div className="flex items-center gap-2 border-e border-gray-200 pe-4 dark:border-gray-700">
          {mounted && (
            <button
              type="button"
              onClick={() =>
                setTheme(
                  theme === 'dark' ? 'light' : 'dark',
                )
              }
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="تغيير المظهر"
            >
              {theme === 'dark' ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                toggleMenu('notifications')
              }
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="الإشعارات"
            >
              <Bell size={17} />

              <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900" />
            </button>

            {activeMenu === 'notifications' && (
              <div className="absolute end-0 top-11 z-50 w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-[#111827]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <span className="text-xs font-bold dark:text-white">
                    الإشعارات
                  </span>
                </div>

                <div className="py-6 text-center text-xs text-gray-400">
                  لا توجد إشعارات جديدة حالياً.
                </div>
              </div>
            )}
          </div>

          <Link
            href="/dashboard/messages"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="الرسائل"
          >
            <MessageSquare size={17} />
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu('user')}
            className="flex cursor-pointer items-center gap-3 rounded-full p-1 hover:bg-gray-50 dark:hover:bg-gray-800/60"
          >
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-600 text-sm font-bold text-white shadow-sm">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={`صورة ${currentUser.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{firstLetter}</span>
              )}
            </div>

            <div className="hidden text-right sm:block">
              <div className="text-xs font-bold dark:text-white">
                {currentUser.name}
              </div>

              <div className="text-[10px] text-gray-400">
                {displayRole}
              </div>
            </div>
          </button>

          {activeMenu === 'user' && (
            <div className="absolute end-0 top-12 z-50 w-48 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl dark:border-gray-800 dark:bg-[#111827]">
              <Link
                href="/dashboard/profile"
                onClick={() => setActiveMenu(null)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <User size={15} />
                الملف الشخصي
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut size={15} />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}