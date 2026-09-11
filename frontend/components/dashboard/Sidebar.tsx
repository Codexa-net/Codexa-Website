"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
import logoImg from "../../public/logo.jpg";

interface NavConfig {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  permission?: string;
  superAdminOnly?: boolean;
}

const mainNav: NavConfig[] = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutGrid },
  { href: "/dashboard/projects", label: "المشاريع", icon: Briefcase, permission: "إدارة المشاريع" },
  { href: "/dashboard/clients", label: "العملاء", icon: Users, permission: "إدارة العملاء" },
  { href: "/dashboard/services", label: "الخدمات", icon: Wrench, permission: "إدارة المشاريع" },
  { href: "/dashboard/messages", label: "طلبات التواصل", icon: Mail, permission: "إدارة العملاء" },
];

const systemNav: NavConfig[] = [
  { href: "/dashboard/settings", label: "إعدادات الموقع", icon: Settings, superAdminOnly: true },
  { href: "/dashboard/users", label: "المستخدمون", icon: UserCog, permission: "إدارة المستخدمين" },
  { href: "/dashboard/profile", label: "الملف الشخصي", icon: UserRound },
];

export default function Sidebar({ initialRole }: { initialRole?: string }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>(initialRole || "SUPER_ADMIN");
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    const savedPermissions = localStorage.getItem("dashboardRolePermissions");
    if (savedPermissions) {
      try {
        setPermissions(JSON.parse(savedPermissions));
      } catch {}
    }

    if (initialRole) {
      setUserRole(initialRole.toUpperCase());
    } else {
      const savedUser = localStorage.getItem("user");
      const savedRole = localStorage.getItem("userRole");
      if (savedRole) {
        setUserRole(savedRole.toUpperCase());
      } else if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.role) setUserRole(parsed.role.toUpperCase());
        } catch {}
      }
    }
  }, [initialRole]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const hasAccess = (item: NavConfig) => {
    if (isSuperAdmin) return true; 
    if (item.superAdminOnly) return false; 
    if (!item.permission) return true; 

    const rolePerms = permissions[userRole] || {};
    return !!rolePerms[item.permission];
  };

  const visibleMainNav = mainNav.filter(hasAccess);
  const visibleSystemNav = systemNav.filter(hasAccess);

  return (
    <aside
      className="flex h-screen w-72 shrink-0 flex-col border-s border-gray-100 bg-white px-4 py-6 transition-colors dark:border-gray-800 dark:bg-[#111827]"
      dir="rtl"
    >
      <div className="mb-8 flex items-center justify-start px-2">
        <Link href="/dashboard" className="flex items-center gap-3" dir="ltr">
          <Image
            src={logoImg}
            alt="Codexa"
            width={34}
            height={34}
            className="h-8.5 w-8.5 object-contain"
            priority
          />
          <span className="text-2xl font-black tracking-tight text-[#14161f] dark:text-white font-sans">
            Codexa
          </span>
        </Link>
      </div>

      <nav className="flex flex-col gap-1.5">
        {visibleMainNav.map((item) => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </nav>

      {visibleSystemNav.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 px-4 text-[11px] font-bold text-gray-400">النظام</p>
          <nav className="flex flex-col gap-1.5">
            {visibleSystemNav.map((item) => (
              <NavItem key={item.href} {...item} active={isActive(item.href)} />
            ))}
          </nav>
        </div>
      )}

      <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-800">
        <button
          type="button"
          onClick={() => logoutAction()}
          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-bold text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 cursor-pointer"
        >
          <span>تسجيل خروج</span>
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition-all",
        active
          ? "bg-brand-600 text-white shadow-xs"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      )}
    >
      <span>{label}</span>
      <Icon size={18} strokeWidth={2} />
    </Link>
  );
}