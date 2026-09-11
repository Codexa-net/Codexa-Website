"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Pencil, Trash2, LayoutGrid, Table as TableIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { deleteProjectAction } from "@/actions/projects";

const STATUS_BADGE: Record<string, string> = {
  "قيد التنفيذ": "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  "قيد المراجعة": "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  "مكتمل": "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  "متأخر": "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
};

const DEFAULT_CATEGORIES = ["تطبيقات موبايل", "هوية بصرية", "تصميم واجهات", "تطوير مواقع"];
const COVER_COLORS = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-rose-500", "bg-teal-500"];

export function ProjectsListClient({ projects = [] }: { projects: any[] }) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [categoryFilter, setCategoryFilter] = useState("الكل");
  const [techFilter, setTechFilter] = useState("كل التقنيات");
  const [targetDelete, setTargetDelete] = useState<any | null>(null);
  
  // داتا التقنيات اللي هتيجي من الباك إند
  const [dbTechnologies, setDbTechnologies] = useState<any[]>([]);

  // جلب التقنيات من الباك إند
  useEffect(() => {
    fetch("http://localhost:3001/technologies") // غير البورت لو الباك إند شغال على رقم تاني
      .then(res => res.json())
      .then(data => setDbTechnologies(data))
      .catch(err => console.error("Error fetching techs:", err));
  }, []);

  const categories = useMemo(() => {
    const list = projects.map((p) => p.category).filter(Boolean);
    return ["الكل", ...Array.from(new Set([...DEFAULT_CATEGORIES, ...list]))];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const searchLower = search.toLowerCase();
      const matchSearch =
        searchLower === "" ||
        p.name?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.client?.name?.toLowerCase().includes(searchLower);

      const matchStatus = statusFilter === "الكل" || p.status === statusFilter;
      const matchCategory = categoryFilter === "الكل" || p.category === categoryFilter;
      
      const projectTechs = Array.isArray(p.technologies) ? p.technologies.map(t => typeof t === 'string' ? t : t.name) : [];
      const matchTech = techFilter === "كل التقنيات" || projectTechs.includes(techFilter);

      return matchSearch && matchStatus && matchCategory && matchTech;
    });
  }, [projects, search, statusFilter, categoryFilter, techFilter]);

  async function handleDelete() {
    if (!targetDelete?.id) return;
    const res = await deleteProjectAction(targetDelete.id);
    if (res.success) {
      setTargetDelete(null);
      router.refresh();
    } else {
      alert(res.error || "تعذر حذف المشروع");
    }
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-56">
            <Search size={15} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في المشاريع..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pe-10 ps-3 text-xs text-[#14161f] outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-2 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-300">
            <SlidersHorizontal size={13} />
            <span>الفلاتر</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#14161f] outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === "الكل" ? "كل التصنيفات" : c}</option>
            ))}
          </select>

          {/* قائمة التقنيات الديناميكية من الداتا بيز */}
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#14161f] outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white cursor-pointer"
            dir="ltr"
          >
            <option value="كل التقنيات">كل التقنيات</option>
            {dbTechnologies.map((t) => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#14161f] outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white cursor-pointer"
          >
            <option value="الكل">كل الحالات</option>
            <option value="قيد التنفيذ">قيد التنفيذ</option>
            <option value="قيد المراجعة">قيد المراجعة</option>
            <option value="مكتمل">مكتمل</option>
            <option value="متأخر">متأخر</option>
          </select>
        </div>

        <div className="flex rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-[#111827]">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              viewMode === "grid" ? "bg-brand-600 text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            }`}
          >
            <LayoutGrid size={14} /> بطاقات
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              viewMode === "table" ? "bg-brand-600 text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            }`}
          >
            <TableIcon size={14} /> جدول
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border border-gray-200 bg-white p-12 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-[#111827] dark:text-gray-400">
          لا توجد مشاريع مطابقة للبحث أو الفلتر المحدد.
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
          {filtered.map((item, idx) => {
            const techs = Array.isArray(item.technologies) ? item.technologies.map((t: any) => typeof t === 'string' ? t : t.name) : [];
            const badgeClass = STATUS_BADGE[item.status] || "bg-gray-100 text-gray-700";
            const dateStr = item.updatedAt ? new Date(item.updatedAt).toISOString().split("T")[0] : "2026-08-10";
            const randomCover = COVER_COLORS[idx % COVER_COLORS.length];

            return (
              <Card key={item.id} className="flex flex-col justify-between overflow-hidden border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111827]">
                
                <div className={`relative h-28 w-full overflow-hidden ${randomCover} flex items-center justify-center p-4`}>
                  {item.cover ? (
                    <img src={item.cover} alt={item.name} className="h-full w-full object-cover opacity-90 mix-blend-overlay" />
                  ) : null}
                  <h3 className="relative z-10 text-xl font-black text-white text-center shadow-sm drop-shadow-md">
                    {item.name}
                  </h3>
                </div>

                <div className="flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#14161f] dark:text-white">{item.name}</h4>
                      <p className="line-clamp-2 mt-1 text-xs font-medium text-[#8b8f9c] dark:text-gray-400">
                        {item.description || "منصة متكاملة لإدارة المهام ومتابعة سير العمل يومياً."}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-md px-2.5 py-1 text-[10px] font-black ${badgeClass}`}>
                      {item.status || "قيد التنفيذ"}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                    <span>{item.category || "عام"}</span>
                    {techs.length > 0 && <span className="text-brand-400">✦</span>}
                    {techs.map((t: string, i: number) => (
                      <span key={t} className="flex items-center gap-1.5">
                        <span dir="ltr">{t}</span>
                        {i < techs.length - 1 && <span className="text-brand-400">✦</span>}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-[#8b8f9c] dark:border-gray-800 dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <Link href={`/dashboard/projects/${item.id}/edit`} className="flex items-center gap-1.5 transition-colors hover:text-brand-600 cursor-pointer">
                        <Pencil size={13} /> تعديل
                      </Link>
                      <button type="button" onClick={() => setTargetDelete(item)} className="flex items-center gap-1.5 transition-colors hover:text-rose-500 cursor-pointer">
                        <Trash2 size={13} /> حذف
                      </button>
                    </div>
                    <span dir="ltr">{dateStr}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111827]">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-[#8b8f9c] dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                <th className="px-6 py-3.5">اسم المشروع</th>
                <th className="px-6 py-3.5">العميل</th>
                <th className="px-6 py-3.5">التصنيف</th>
                <th className="px-6 py-3.5">الحالة</th>
                <th className="px-6 py-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-bold text-[#14161f] dark:text-white">{item.name}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">{item.client?.name || "—"}</td>
                  <td className="px-6 py-4 text-xs text-brand-600 dark:text-brand-400">{item.category || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_BADGE[item.status] || "bg-gray-100 text-gray-700"}`}>
                      {item.status || "قيد التنفيذ"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/dashboard/projects/${item.id}/edit`} className="text-gray-500 hover:text-brand-600 dark:text-gray-400 cursor-pointer">
                        <Pencil size={15} />
                      </Link>
                      <button type="button" onClick={() => setTargetDelete(item)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <DeleteDialog open={!!targetDelete} itemLabel="المشروع" onClose={() => setTargetDelete(null)} onConfirm={handleDelete} />
    </div>
  );
}