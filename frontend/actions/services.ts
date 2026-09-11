"use server";

import { serverFetchApi } from "@/lib/server-api";
import { revalidatePath } from "next/cache";

export async function createServiceAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim() || (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || "";
  const description = (formData.get("description") as string)?.trim() || "";
  const status = (formData.get("status") as string) || "نشطة";

  if (!name) {
    return { success: false, error: "اسم الخدمة مطلوب" };
  }

  try {
    const res = await serverFetchApi("/services", {
      method: "POST",
      body: JSON.stringify({
        name,
        category: category || "عام",
        description,
        status,
      }),
    });

    if (res?.statusCode && res.statusCode >= 400) {
      return {
        success: false,
        error: Array.isArray(res.message) ? res.message.join("، ") : res.message || "خطأ في بيانات الإدخال",
      };
    }

    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "فشل الاتصال بالخادم" };
  }
}

export async function updateServiceAction(
  id: string,
  data: { name: string; category?: string; status?: string; description?: string }
) {
  try {
    const res = await serverFetchApi(`/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: data.name.trim(),
        category: data.category?.trim() || "عام",
        status: data.status || "نشطة",
        description: data.description?.trim() || "",
      }),
    });

    if (res?.statusCode && res.statusCode >= 400) {
      return {
        success: false,
        error: Array.isArray(res.message) ? res.message.join("، ") : res.message || "خطأ في تعديل الخدمة",
      };
    }

    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "تعذر تعديل الخدمة" };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    await serverFetchApi(`/services/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "تعذر حذف الخدمة" };
  }
}