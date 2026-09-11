import Link from "next/link";
import { Plus } from "lucide-react";
import { ServicesTable } from "@/components/services/ServicesTable";
import { serverFetchApi } from "@/lib/server-api";

export default async function ServicesPage() {
  let servicesData: any[] = [];

  try {
    const res = await serverFetchApi("/services");
    servicesData = Array.isArray(res) ? res : res?.data ?? [];
  } catch (error) {
    console.error("تعذر جلب الخدمات من الخادم:", error);
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* الترويسة: العنوان أقصى اليمين والزر أقصى اليسار */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#14161f] dark:text-white">
            خدمات الوكالة
          </h1>
          <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
            إعداد وتعديل قائمة الخدمات التقنية التي تقدمها Codexa
          </p>
        </div>

        <Link
          href="/dashboard/services/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Plus size={16} />
          إضافة خدمة +
        </Link>
      </div>

      <ServicesTable services={servicesData} />
    </div>
  );
}