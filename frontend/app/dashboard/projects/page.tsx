import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProjectsListClient } from "@/components/projects/ProjectsListClient";
import { serverFetchApi } from "@/lib/server-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage() {
  let rawProjects: any = [];

  try {
    const res = await serverFetchApi("/projects");
    rawProjects = Array.isArray(res) ? res : res?.data ?? [];
  } catch (error) {
    console.error("تعذر جلب المشاريع من الخادم:", error);
  }

  // 1. التأكد إننا سحبنا الداتا
  const allProjects = Array.isArray(rawProjects) ? rawProjects : [];

  // 2. 🔥 الفلتر الحاسم: استبعاد أي مشروع تبع "سابقة الأعمال" تماماً من الشاشة دي
  const companyProjects = allProjects.filter(
    (p) => p.isPublic !== true && p.isPublic !== "true"
  );

  // 3. بناء الإحصائيات على مشاريع الشركة الفعلية فقط
  const totalProjects = companyProjects.length;
  const activeProjects = companyProjects.filter(
    (p) => p.status === "قيد التنفيذ" || p.status === "قيد المراجعة"
  ).length;
  const completedProjects = companyProjects.filter((p) => p.status === "مكتمل").length;
  const delayedProjects = companyProjects.filter((p) => p.status === "متأخر").length;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#14161f] dark:text-white">
            المشاريع الداخلية
          </h1>
          <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
            إدارة ومتابعة مشاريع فريق العمل (لا تشمل سابقة الأعمال)
          </p>
        </div>

        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Plus size={16} />
          إضافة مشروع جديد +
        </Link>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "إجمالي المشاريع", value: totalProjects },
          { label: "المشاريع النشطة", value: activeProjects },
          { label: "المشاريع المكتملة", value: completedProjects },
          { label: "المشاريع المتأخرة", value: delayedProjects },
        ].map((s) => (
          <Card
            key={s.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-right shadow-xs dark:border-gray-800 dark:bg-[#111827]"
          >
            <p className="text-3xl font-black text-[#14161f] dark:text-white">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
              {s.label}
            </p>
          </Card>
        ))}
      </div>

      {/* الجدول هيعرض مشاريع الشركة الفعلية فقط */}
      <ProjectsListClient projects={companyProjects} />
    </div>
  );
}