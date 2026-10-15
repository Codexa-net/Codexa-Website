import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { serverFetchApi } from "@/lib/server-api";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCurrentAdmin() {
  try {
    const res = await serverFetchApi("/auth/me");
    return res?.data ?? res ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardMainPage() {
  const admin = await getCurrentAdmin();

  // 🟢 تحويل أعضاء الفريق التنفيذي فوراً إلى صفحة مهامهم المباشرة
  const EXECUTION_ROLES = ["DEVELOPER", "UI_UX_DESIGNER", "GRAPHIC_DESIGNER"];
  if (admin?.role && EXECUTION_ROLES.includes(admin.role)) {
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
      const pData = pRes.value;
      projects = Array.isArray(pData)
        ? pData
        : Array.isArray(pData?.data)
        ? pData.data
        : [];
    }

    if (cRes.status === "fulfilled") {
      const cData = cRes.value;
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
    (p: any) => p.isPublic !== true && p.isPublic !== "true"
  );

  return (
    <DashboardClient
      initialProjects={companyProjects}
      totalClients={clientsCount}
      currentUser={admin}
    />
  );
}