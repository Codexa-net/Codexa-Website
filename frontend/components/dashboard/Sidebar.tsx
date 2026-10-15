"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Briefcase,
  FolderGit2,
  Users,
  Users2,
  Wrench,
  Mail,
  Settings,
  UserCog,
  UserRound,
  LogOut,
  CheckSquare,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";

interface NavConfig {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  superAdminOnly?: boolean;
  allowedRoles?: string[];
  excludeRoles?: string[];
}

// قادة الفرق التقنية
const ALL_TECH_LEADS = [
  "BACKEND_LEAD",
  "FRONTEND_LEAD",
  "UI_UX_LEAD",
  "MOBILE_APP_LEAD",
];

// أعضاء الفريق التنفيذي
const ALL_EXECUTION_MEMBERS = [
  "DEVELOPER",
  "UI_UX_DESIGNER",
  "GRAPHIC_DESIGNER",
];

// فريق المبيعات
const ALL_SALES_ROLES = ["SALES", "SALES_LEADER"];

function CodexaLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M 73.5 30 A 34 34 0 1 0 73.5 70" stroke="#5D5FEF" strokeWidth="11" strokeLinecap="round" />
      <line x1="65" y1="41.5" x2="82" y2="58.5" stroke="#5D5FEF" strokeWidth="8.5" strokeLinecap="round" />
      <line x1="65" y1="58.5" x2="82" y2="41.5" stroke="#5D5FEF" strokeWidth="8.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Sidebar({ initialRole }: { initialRole?: string }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>(initialRole || "SUPER_ADMIN");

  useEffect(() => {
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

  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isSales = ALL_SALES_ROLES.includes(userRole);

  // مساحة العمل
  const workspaceNav: NavConfig[] = [
    {
      href: "/dashboard",
      label: "لوحة التحكم",
      icon: LayoutGrid,
      superAdminOnly: true,
    },
    {
      href: "/dashboard/tasks",
      label: "المهام",
      icon: CheckSquare,
      allowedRoles: ["SUPER_ADMIN", ...ALL_TECH_LEADS, ...ALL_EXECUTION_MEMBERS],
    },
    {
      href: "/dashboard/team",
      label: "فريق العمل",
      icon: Users2,
      allowedRoles: ["SUPER_ADMIN", ...ALL_TECH_LEADS],
    },
    {
      href: "/dashboard/projects",
      label: "المشاريع الداخلية",
      icon: Briefcase,
      superAdminOnly: true,
    },
    {
      href: "/dashboard/wallet",
      label: "محفظتي والأرباح",
      icon: Wallet,
      allowedRoles: ["SUPER_ADMIN", ...ALL_TECH_LEADS, ...ALL_EXECUTION_MEMBERS, ...ALL_SALES_ROLES],
    },
  ];

  // المنصة والعملاء
  const platformNav: NavConfig[] = [
    {
      href: "/dashboard/clients",
      label: "العملاء",
      icon: Users,
      allowedRoles: ["SUPER_ADMIN", ...ALL_SALES_ROLES],
    },
    {
      href: "/dashboard/messages",
      label: "طلبات التواصل",
      icon: Mail,
      allowedRoles: ["SUPER_ADMIN", ...ALL_SALES_ROLES],
    },
    {
      href: "/dashboard/portfolio",
      label: "سابقة الأعمال",
      icon: FolderGit2,
      superAdminOnly: true, // محصورة فقط بالسوبر أدمن (ممنوعة عن السيلز)
    },
    {
      href: "/dashboard/services",
      label: "الخدمات",
      icon: Wrench,
      superAdminOnly: true,
    },
  ];

  // النظام
  const systemNav: NavConfig[] = [
    { href: "/dashboard/settings", label: "إعدادات الموقع", icon: Settings, superAdminOnly: true },
    { href: "/dashboard/users", label: "المستخدمون", icon: UserCog, superAdminOnly: true },
    { href: "/dashboard/profile", label: "الملف الشخصي", icon: UserRound },
  ];

  const hasAccess = (item: NavConfig) => {
    if (item.superAdminOnly && !isSuperAdmin) return false;
    if (item.excludeRoles && item.excludeRoles.includes(userRole)) return false;
    if (item.allowedRoles && !item.allowedRoles.includes(userRole)) return false;
    return true;
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const visibleWorkspace = workspaceNav.filter(hasAccess);
  const visiblePlatform = platformNav.filter(hasAccess);
  const visibleSystem = systemNav.filter(hasAccess);

  const defaultHomeLink = isSuperAdmin
    ? "/dashboard"
    : isSales
    ? "/dashboard/clients"
    : "/dashboard/tasks";

  const handleLogout = async () => {
    localStorage.clear();
    await logoutAction();
    window.location.href = "/login";
  };

  return (
    <aside
      className="flex h-screen w-[280px] shrink-0 flex-col border-s border-gray-100 bg-white px-5 py-7 transition-colors dark:border-gray-800/60 dark:bg-[#0b0f17] select-none z-30"
      dir="rtl"
    >
      <div className="mb-8 flex items-center justify-start px-2">
        <Link href={defaultHomeLink} className="flex items-center gap-3.5" dir="ltr">
          <CodexaLogo className="h-9 w-9 shrink-0" />
          <span className="text-2xl font-black tracking-tight text-[#14161f] dark:text-white font-sans">
            Codexa
          </span>
        </Link>
      </div>

      <div className="flex-1 space-y-7 overflow-y-auto overflow-x-hidden no-scrollbar pb-6">
        {visibleWorkspace.length > 0 && (
          <div>
            <p className="mb-3 px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500">
              مساحة العمل
            </p>
            <nav className="flex flex-col gap-1">
              {visibleWorkspace.map((item) => (
                <NavItem key={item.href} {...item} active={isActive(item.href)} />
              ))}
            </nav>
          </div>
        )}

        {visiblePlatform.length > 0 && (
          <div>
            <p className="mb-3 px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500">
              المنصة والعملاء
            </p>
            <nav className="flex flex-col gap-1">
              {visiblePlatform.map((item) => (
                <NavItem key={item.href} {...item} active={isActive(item.href)} />
              ))}
            </nav>
          </div>
        )}

        {visibleSystem.length > 0 && (
          <div>
            <p className="mb-3 px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500">
              النظام
            </p>
            <nav className="flex flex-col gap-1">
              {visibleSystem.map((item) => (
                <NavItem key={item.href} {...item} active={isActive(item.href)} />
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/60">
        <button
          type="button"
          onClick={handleLogout}
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
}: NavConfig & { active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition-all",
        active
          ? "bg-brand-600 text-white shadow-xs"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      )}
    >
      <Icon size={18} strokeWidth={2} className="shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}