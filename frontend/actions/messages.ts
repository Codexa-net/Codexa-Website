"use server";

import { revalidatePath } from "next/cache";
import { serverFetchApi } from "@/lib/server-api";

export interface DashboardNotification {
  id: string;
  name: string;
  subject?: string | null;
  createdAt: string;
  isRead?: boolean;
}

export async function markMessageReadAction(id: string) {
  try {
    await serverFetchApi(`/admin/messages/${id}/read`, { method: "PATCH" });
    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteMessageAction(id: string) {
  try {
    await serverFetchApi(`/admin/messages/${id}`, { method: "DELETE" });
    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * جلب أحدث الطلبات والإشعارات للنافبار العلوي
 */
export async function getNotificationsAction(): Promise<DashboardNotification[]> {
  const endpoints = ["/admin/messages?limit=5", "/messages", "/contact"];

  for (const ep of endpoints) {
    try {
      const res = await serverFetchApi(ep);
      const list = Array.isArray(res) ? res : res?.data;
      if (Array.isArray(list)) {
        return list.slice(0, 5).map((m: any) => ({
          id: String(m.id),
          name: m.name || "عميل جديد",
          subject: m.subject || "طلب مشروع جديد",
          createdAt: m.createdAt || new Date().toISOString(),
          isRead: Boolean(m.isRead),
        }));
      }
    } catch {
      // تجربة المسار التالي إن فشل الأول
    }
  }

  return [];
}