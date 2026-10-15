"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// المسارات الحصرية بالسوبر أدمن فقط
const SUPER_ADMIN_ONLY_PREFIXES = [
  "/dashboard/projects",
  "/dashboard/services",
  "/dashboard/settings",
  "/dashboard/users",
  "/dashboard/portfolio",
];

// مسارات المبيعات
const SALES_ONLY_PREFIXES = [
  "/dashboard/clients",
  "/dashboard/messages",
];

// مسارات المهام والفرق التقنية
const TECH_ONLY_PREFIXES = [
  "/dashboard/tasks",
  "/dashboard/team",
];

// قادة الفرق المسموح لهم بصفحة الفريق
const ALLOWED_TEAM_ROLES = [
  "SUPER_ADMIN",
  "BACKEND_LEAD",
  "FRONTEND_LEAD",
  "UI_UX_LEAD",
  "MOBILE_APP_LEAD",
];

export default function DashboardRouteGuard({
  children,
  initialRole,
}: {
  children: React.ReactNode;
  initialRole?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // قراءة الرتبة الحالية من localStorage أو من الـ Props
    let role = initialRole;
    if (!role) {
      const savedRole = localStorage.getItem("userRole");
      const savedUser = localStorage.getItem("user");
      if (savedRole) {
        role = savedRole;
      } else if (savedUser) {
        try {
          role = JSON.parse(savedUser).role;
        } catch {}
      }
    }

    const currentRole = (role || "").toUpperCase();
    const isSuperAdmin = currentRole === "SUPER_ADMIN";
    const isSales = currentRole === "SALES" || currentRole === "SALES_LEADER";

    // إذا لم يكن هناك دور مسجل بعد، ننتظر لحظة للتحميل
    if (!currentRole) {
      setIsAuthorized(true);
      return;
    }

    // 1. لوحة الإحصائيات الرئيسية (/dashboard): تفتح حصراً للسوبر أدمن
    if (pathname === "/dashboard") {
      if (!isSuperAdmin) {
        router.replace(isSales ? "/dashboard/clients" : "/dashboard/tasks");
        return;
      }
    }

    // 2. فحص مسارات السوبر أدمن الحصرية
    const isSuperAdminRoute = SUPER_ADMIN_ONLY_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (isSuperAdminRoute && !isSuperAdmin) {
      router.replace(isSales ? "/dashboard/clients" : "/dashboard/tasks");
      return;
    }

    // 3. منع المطورين والتقنيين من دخول مسارات المبيعات
    const isSalesRoute = SALES_ONLY_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (isSalesRoute && !isSales && !isSuperAdmin) {
      router.replace("/dashboard/tasks");
      return;
    }

    // 4. منع فريق المبيعات من دخول مسارات المهام التقنية
    const isTechRoute = TECH_ONLY_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (isTechRoute && isSales && !isSuperAdmin) {
      router.replace("/dashboard/clients");
      return;
    }

    // 5. حماية صفحة الفريق: قادة الفرق والسوبر أدمن فقط
    if (pathname.startsWith("/dashboard/team") && !ALLOWED_TEAM_ROLES.includes(currentRole)) {
      router.replace("/dashboard/tasks");
      return;
    }

    // إذا اجتاز كل الفحوصات، يتم السماح بعرض محتوى الصفحة
    setIsAuthorized(true);
  }, [pathname, initialRole, router]);

  // لا نعرض الصفحة للمستخدم إذا كان غير مخول وجاري تحويله
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}