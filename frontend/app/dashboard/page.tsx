import { cookies } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { serverFetchApi } from "@/lib/server-api";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();
    const rawCookieUser = cookieStore.get("codexa_user")?.value;
    if (rawCookieUser) {
      const parsed = JSON.parse(decodeURIComponent(rawCookieUser));
      if (parsed && parsed.role) {
        return parsed;
      }
    }
  } catch {}

  try {
    const res: any = await serverFetchApi("/auth/me");
    return res?.data ?? res ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardMainPage() {
  const admin = await getCurrentAdmin();
  const normalizedRole = (admin?.role || "").toUpperCase();

  // 🟢 1. تحويل مسؤولي المبيعات فوراً إلى صفحة طلبات التواصل والعملاء (وليس صفحة المهام)
  if (normalizedRole === "SALES" || normalizedRole === "SALES_LEADER") {
    redirect("/dashboard/messages");
  }

  // 🟢 2. حظر شاشة مشاريع الشركة الرئيسية عن أي ليدر أو مطور، وتحويلهم فوراً لصفحة مهامهم
  if (normalizedRole && normalizedRole !== "SUPER_ADMIN") {
    redirect("/dashboard/tasks");
  }

  let projects: any[] = [];
  let clientsCount = 0;

  try {
    const [pRes, cRes] = await Promise.allSettled([
      serverFetchApi("/projects"),
      serverFetchApi("/clients"),
    ]);

    if (pRes.status === "fulfilled") {
      const pData: any = pRes.value;
      projects = Array.isArray(pData)
        ? pData
        : Array.isArray(pData?.data)
          ? pData.data
          : [];
    }

    if (cRes.status === "fulfilled") {
      const cData: any = cRes.value;
      const clientsList = Array.isArray(cData)
        ? cData
        : Array.isArray(cData?.data)
          ? cData.data
          : [];
      clientsCount = clientsList.length;
    }
  } catch (err) {
    console.error("تعذر جلب البيانات:", err);
  }

  const companyProjects = projects.filter(
    (p: any) => p.isPublic !== true && p.isPublic !== "true",
  );

  return (
    <DashboardClient
      initialProjects={companyProjects}
      totalClients={clientsCount}
      currentUser={admin}
    />
  );
}