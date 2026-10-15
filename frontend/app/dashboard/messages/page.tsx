import { PageHeader } from "@/components/ui/PageHeader";
import { MessagesClient } from "@/components/messages/MessagesClient";
import { serverFetchApi } from "@/lib/server-api";
import { redirect } from "next/navigation";

// إيقاف الكاش لضمان جلب الرسائل الجديدة لحظياً
export const dynamic = "force-dynamic";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead?: boolean;
  status?: string;
  createdAt: string;
}

async function getCurrentUser() {
  try {
    const res = await serverFetchApi("/auth/me");
    return res?.data ?? res ?? null;
  } catch {
    return null;
  }
}

async function getMessages(): Promise<ContactMessage[]> {
  const endpoints = ["/admin/messages?limit=50", "/messages", "/contact"];

  for (const ep of endpoints) {
    try {
      const res = await serverFetchApi(ep);
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
    } catch (err) {
      // تجربة المسار التالي
    }
  }

  return [];
}

export default async function MessagesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // 🔒 حماية أمنية مشددة: الصفحة محجوبة تماماً عن المصممين والمطورين وتفتح للسوبر أدمن والسيلز فقط
  const role = String(user.role || "").toUpperCase();
  const ALLOWED_ROLES = ["SUPER_ADMIN", "SALES", "SALES_LEADER"];

  if (!ALLOWED_ROLES.includes(role)) {
    redirect("/dashboard/tasks");
  }

  const messagesData = await getMessages();

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-[#14161f] dark:text-white">
          إدارة الطلبات الواردة
        </h1>
        <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
          متابعة الاستفسارات وطلبات المشاريع المرسلة عبر الموقع الإلكتروني.
        </p>
      </div>

      <MessagesClient requests={messagesData} />
    </div>
  );
}