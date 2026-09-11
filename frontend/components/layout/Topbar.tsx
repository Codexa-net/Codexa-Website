"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, MessageSquare, Moon, Sun, User, LogOut, CheckCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { logoutAction } from "@/actions/auth";

interface TopbarProps {
  user?: {
    name: string;
    role: string;
  };
}

export function Topbar({ user }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [activeMenu, setActiveMenu] = useState<"notifications" | "messages" | "user" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = user?.name || "المستخدم";
  const rawRole = (user?.role || "SALES").toUpperCase();
  
  const roleMapping: Record<string, string> = {
    SUPER_ADMIN: "مدير نظام",
    SALES: "موظف مبيعات",
  };
  
  const displayRole = roleMapping[rawRole] || rawRole;
  const firstLetter = userName.trim().charAt(0) || "U";

  const toggleMenu = (menu: "notifications" | "messages" | "user") => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  async function handleLogout() {
    setActiveMenu(null);
    if (logoutAction) {
      await logoutAction();
    }
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-8 transition-colors dark:border-gray-800 dark:bg-[#0d111a]" dir="rtl">
      <div className="relative w-full max-w-sm">
        <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="بحث..." className="w-full rounded-full border border-gray-200 bg-[#f7f8fb] py-2 pe-4 ps-11 text-right text-xs outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white" />
      </div>

      <div ref={containerRef} className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 border-e border-gray-200 pe-3 dark:border-gray-800">
          {mounted && (
            <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <div className="relative">
            <button type="button" onClick={() => toggleMenu("notifications")} className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${activeMenu === "notifications" ? "bg-gray-100 text-brand-600 dark:bg-gray-800 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"}`}>
              <Bell size={18} />
              <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900" />
            </button>
            {activeMenu === "notifications" && (
              <div className="absolute end-0 top-11 z-50 w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-[#111827]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <span className="text-xs font-bold text-[#14161f] dark:text-white">الإشعارات</span>
                  <span className="flex items-center gap-1 text-[11px] text-brand-600 hover:underline cursor-pointer dark:text-brand-400">
                    <CheckCheck size={13} /> تمييز الكل كمقروء
                  </span>
                </div>
                <div className="py-6 text-center text-xs text-gray-400">لا توجد إشعارات جديدة حالياً.</div>
              </div>
            )}
          </div>

          <div className="relative">
            <button type="button" onClick={() => toggleMenu("messages")} className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${activeMenu === "messages" ? "bg-gray-100 text-brand-600 dark:bg-gray-800 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"}`}>
              <MessageSquare size={18} />
            </button>
            {activeMenu === "messages" && (
              <div className="absolute end-0 top-11 z-50 w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-[#111827]">
                <div className="border-b border-gray-100 pb-3 text-xs font-bold text-[#14161f] dark:text-white">رسائل التواصل</div>
                <div className="py-6 text-center text-xs text-gray-400">لا توجد رسائل واردة غير مقروءة.</div>
                <Link href="/dashboard/messages" onClick={() => setActiveMenu(null)} className="block rounded-xl bg-gray-50 py-2 text-center text-xs font-bold text-brand-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-brand-400 dark:hover:bg-gray-700">
                  عرض كافة طلبات التواصل
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button type="button" onClick={() => toggleMenu("user")} className="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-xs">
              {firstLetter}
            </div>
            <div className="hidden text-right sm:block">
              <div className="text-xs font-bold text-[#14161f] dark:text-white">{userName}</div>
              <div className="text-[10px] text-gray-400">{displayRole}</div>
            </div>
          </button>

          {activeMenu === "user" && (
            <div className="absolute end-0 top-12 z-50 w-48 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl dark:border-gray-800 dark:bg-[#111827]">
              <Link href="/dashboard/profile" onClick={() => setActiveMenu(null)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
                <User size={15} /> الملف الشخصي
              </Link>
              <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer">
                <LogOut size={15} /> تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;