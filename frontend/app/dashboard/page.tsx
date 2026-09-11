import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { serverFetchApi } from "@/lib/server-api";

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
  let projects: any[] = [];
  let clientsCount = 0;
  const admin = await getCurrentAdmin();

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

  return (
    <DashboardClient
      initialProjects={projects}
      totalClients={clientsCount}
      currentUser={admin}
    />
  );
}