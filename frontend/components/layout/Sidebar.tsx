"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Briefcase,
  Users,
  Wrench,
  Mail,
  Settings,
  UserCog,
  UserRound,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";

const mainNav = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutGrid, access: [] },
  { href: "/dashboard/projects", label: "المشاريع", icon: Briefcase, access: ["SUPER_ADMIN"] },
  { href: "/dashboard/clients", label: "العملاء", icon: Users, access: ["SUPER_ADMIN", "SALES"] },
  { href: "/dashboard/services", label: "الخدمات", icon: Wrench, access: ["SUPER_ADMIN"] },
  { href: "/dashboard/messages", label: "طلبات التواصل", icon: Mail, access: ["SUPER_ADMIN", "SALES"] },
];

const systemNav = [
  { href: "/dashboard/settings", label: "إعدادات الموقع", icon: Settings, access: ["SUPER_ADMIN"] },
  { href: "/dashboard/users", label: "المستخدمون", icon: UserCog, access: ["SUPER_ADMIN"] },
  { href: "/dashboard/profile", label: "الملف الشخصي", icon: UserRound, access: [] },
];

function NavItem({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof LayoutGrid; active: boolean; }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
        active 
          ? "bg-brand-500 text-white" 
          : "text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
      )}
    >
      <span>{label}</span>
      <Icon size={18} strokeWidth={2} />
    </Link>
  );
}

export function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const normalizedRole = role?.toUpperCase() ?? "";

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  async function handleLogout() {
    await logoutAction();
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-s border-border-subtle bg-white dark:bg-[#111827] dark:border-gray-800 px-4 py-6 transition-colors">
      <div className="mb-8 flex items-center justify-end gap-2 px-2">
        <span className="text-xl font-extrabold text-[#14161f] dark:text-white">Codexa</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-black text-white">
          C
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {mainNav
          .filter((item) => item.access.length === 0 || item.access.includes(normalizedRole))
          .map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} active={isActive(item.href)} />
          ))}
      </nav>

      <div className="mt-8">
        <p className="mb-2 px-4 text-xs font-semibold text-[#8b8f9c] dark:text-gray-400">النظام</p>
        <nav className="flex flex-col gap-1">
          {systemNav
            .filter((item) => item.access.length === 0 || item.access.includes(normalizedRole))
            .map((item) => (
              <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} active={isActive(item.href)} />
            ))}
        </nav>
      </div>

      <div className="mt-auto flex items-center justify-end gap-2 px-4 pt-6 text-sm font-semibold text-gray-400 hover:text-rose-500 dark:hover:text-rose-400">
        <button type="button" className="flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
          <span>تسجيل خروج</span>
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}