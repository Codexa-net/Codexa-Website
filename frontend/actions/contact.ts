"use server";

import { serverFetchApi } from "@/lib/server-api";
import { revalidatePath } from "next/cache";

// دالة إرسال الطلب من الفورم الخارجي
export async function submitContactFormAction(data: {
  name: string;
  email: string;
  projectName?: string;
  projectType?: string;
  message?: string;
}) {
  try {
    const subject = data.projectType 
      ? `${data.projectType} - ${data.projectName || "مشروع جديد"}` 
      : data.projectName || "طلب مشروع جديد";

    const fullMessage = data.message || `نوع المشروع: ${data.projectType || "غير محدد"}\nاسم الفكرة: ${data.projectName || "غير محدد"}`;

    const res = await serverFetchApi("/contact", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject,
        message: fullMessage,
        status: "جديد",
      }),
    });

    revalidatePath("/dashboard/messages");
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err?.message || "تعذر إرسال الطلب، يرجى المحاولة لاحقاً" };
  }
}

// دالة حذف الرسالة من الداشبورد
export async function deleteContactMessageAction(id: string) {
  try {
    await serverFetchApi(`/contact/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "تعذر حذف الرسالة" };
  }
}

// دالة تحديث حالة الطلب (جديد / تم التواصل)
export async function updateContactStatusAction(id: string, status: string) {
  try {
    await serverFetchApi(`/contact/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "تعذر تحديث الحالة" };
  }
}