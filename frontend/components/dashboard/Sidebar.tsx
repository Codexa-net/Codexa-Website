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
  X,
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

const ALL_TECH_LEADS = [
  "BACKEND_LEAD",
  "FRONTEND_LEAD",
  "UI_UX_LEAD",
  "MOBILE_APP_LEAD",
];

const ALL_EXECUTION_MEMBERS = [
  "DEVELOPER",
  "UI_UX_DESIGNER",
  "GRAPHIC_DESIGNER",
];

const ALL_SALES_ROLES = ["SALES", "SALES_LEADER"];

function CodexaLogo({ className = "h-8 w-8" }: { className?: string }) {
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
  const [isOpenMobile, setIsOpenMobile] = useState(false);

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

  useEffect(() => {
    const handleToggle = () => setIsOpenMobile((prev) => !prev);
    const handleClose = () => setIsOpenMobile(false);

    window.addEventListener("toggleSidebar", handleToggle);
    window.addEventListener("closeSidebar", handleClose);

    return () => {
      window.removeEventListener("toggleSidebar", handleToggle);
      window.removeEventListener("closeSidebar", handleClose);
    };
  }, []);

  useEffect(() => {
    setIsOpenMobile(false);
  }, [pathname]);

  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isSales = ALL_SALES_ROLES.includes(userRole);

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
      superAdminOnly: true,
    },
    {
      href: "/dashboard/services",
      label: "الخدمات",
      icon: Wrench,
      superAdminOnly: true,
    },
  ];

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
    <>
      {/* خلفية معتمة خفيفة عند فتح القائمة في الهاتف */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-screen w-[260px] shrink-0 flex-col border-s border-gray-100 bg-white px-4 py-5 select-none transition-transform duration-300 dark:border-gray-800/60 dark:bg-[#0b0f17]",
          "md:sticky md:top-0 md:z-30 md:translate-x-0 md:shadow-none",
          isOpenMobile ? "translate-x-0 shadow-2xl" : "translate-x-full md:translate-x-0"
        )}
        dir="rtl"
      >
        {/* الهيدر: الشعار في اليمين والكلمة في اليسار، وزر الإغلاق في أقصى اليسار (موبايل فقط) */}
        <div className="mb-6 flex items-center justify-between gap-2 px-2">
          <Link
            href={defaultHomeLink}
            className="flex min-w-0 flex-row-reverse items-center gap-3"
            dir="ltr"
          >
            <CodexaLogo className="h-8 w-8 shrink-0" />
            <span className="truncate text-xl font-black tracking-tight text-[#14161f] dark:text-white font-sans">
              Codexa
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpenMobile(false)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white md:hidden cursor-pointer"
            aria-label="إغلاق القائمة"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar pb-4">
          {visibleWorkspace.length > 0 && (
            <div>
              <p className="mb-2 px-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
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
              <p className="mb-2 px-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
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
              <p className="mb-2 px-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
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

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800/60">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 cursor-pointer"
          >
            <span>تسجيل خروج</span>
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
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
        "flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-bold transition-all",
        active
          ? "bg-brand-600 text-white shadow-xs"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      )}
    >
      <Icon size={17} strokeWidth={2} className="shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}