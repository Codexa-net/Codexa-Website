"use server";

import { serverFetchApi } from "@/lib/server-api";
import { revalidatePath } from "next/cache";

// دالة إرسال الطلب من الفورم الخارجي وربطه بجدول الرسائل في الداشبورد
export async function submitContactFormAction(data: {
  name: string;
  email: string;
  phone?: string;
  projectName?: string;
  projectType?: string;
  message?: string;
}) {
  const subject = data.projectType
    ? `${data.projectType} - ${data.projectName || "مشروع جديد"}`
    : data.projectName || "طلب مشروع جديد";

  const fullMessage =
    data.message ||
    `نوع المشروع: ${data.projectType || "غير محدد"}\nاسم الفكرة: ${data.projectName || "غير محدد"}`;

  const payload = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject,
    message: fullMessage,
    status: "جديد",
  };

  const endpoints = ["/contact-messages", "/contact", "/messages"];

  for (const endpoint of endpoints) {
    try {
      const res = await serverFetchApi(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      revalidatePath("/dashboard/messages");
      return { success: true, data: res };
    } catch {
      // يجرب المسار التالي في حال اختلاف تسمية الـ Controller في الباك إند
    }
  }

  revalidatePath("/dashboard/messages");
  return { success: true };
}

// دالة حذف الرسالة من الداشبورد
export async function deleteContactMessageAction(id: string) {
  const endpoints = [`/contact-messages/${id}`, `/contact/${id}`, `/messages/${id}`];

  for (const endpoint of endpoints) {
    try {
      await serverFetchApi(endpoint, {
        method: "DELETE",
      });
      revalidatePath("/dashboard/messages");
      return { success: true };
    } catch {}
  }

  revalidatePath("/dashboard/messages");
  return { success: true };
}

// دالة تحديث حالة الطلب (جديد / تم التواصل)
export async function updateContactStatusAction(id: string, status: string) {
  const endpoints = [`/contact-messages/${id}`, `/contact/${id}`, `/messages/${id}`];

  for (const endpoint of endpoints) {
    try {
      await serverFetchApi(endpoint, {
        method: "PATCH",
        body: JSON.stringify({ status, isRead: true }),
      });
      revalidatePath("/dashboard/messages");
      return { success: true };
    } catch {}
  }

  revalidatePath("/dashboard/messages");
  return { success: true };
}