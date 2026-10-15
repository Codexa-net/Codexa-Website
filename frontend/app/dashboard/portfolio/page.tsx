"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit, ExternalLink, FolderGit2, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { deleteProjectAction } from "@/actions/projects";

export default function PortfolioListPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // التحقق من الصلاحيات وتفعيل أزرار التحكم
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    const savedUser = localStorage.getItem("user");
    let role = savedRole;

    if (!role && savedUser) {
      try {
        role = JSON.parse(savedUser).role;
      } catch {}
    }

    const currentRole = (role || "").toUpperCase();

    // طرد فريق المبيعات
    if (currentRole.includes("SALES")) {
      router.replace("/dashboard/clients");
      return;
    }

    // تفعيل صلاحيات الأدمن والتحكم الكامل في المشاريع
    setIsSuperAdmin(true);
  }, [router]);

  async function loadPortfolio() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/projects?isPublic=true", { cache: "no-store" });
      const json = await res.json();
      const data = Array.isArray(json) ? json : json?.data ?? [];
      setProjects(data.filter((p: any) => p.isPublic === true || p.isPublic === "true"));
    } catch (err) {
      console.error("فشل جلب سابقة الأعمال:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPortfolio();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!isSuperAdmin) {
      alert("ليس لديك صلاحية لحذف الأعمال.");
      return;
    }

    if (!confirm(`هل أنت متأكد من حذف عمل "${name}" من سابقة الأعمال؟`)) return;

    try {
      const res = await deleteProjectAction(id);
      if (res?.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(res?.error || "فشل الحذف");
      }
    } catch {
      alert("تعذر حذف العمل حالياً");
    }
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#14161f] dark:text-white">
              سابقة الأعمال (Portfolio)
            </h1>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              معرض الزوار
            </span>
          </div>
          <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
            {isSuperAdmin
              ? "إدارة وتعديل وحذف الأعمال المعروضة للزوار في صفحة أعمالنا."
              : "استعراض الأعمال المنشورة في الموقع العام للشركة."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadPortfolio}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>

          {/* زر الإضافة للسوبر أدمن فقط */}
          {isSuperAdmin && (
            <Link
              href="/dashboard/portfolio/new"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              <Plus size={16} />
              إضافة عمل جديد +
            </Link>
          )}
        </div>
      </div>

      {/* الكروت */}
      {loading ? (
        <div className="py-20 text-center text-sm font-bold text-gray-400">
          جارٍ تحميل سابقة الأعمال...
        </div>
      ) : projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 p-12 text-center dark:border-gray-800 dark:bg-[#111827]">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
            <FolderGit2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            لا توجد أعمال مضافة حالياً
          </h3>
          <p className="mt-1 max-w-sm text-xs text-gray-500 dark:text-gray-400">
            {isSuperAdmin ? "أضف أول مشروع أو عمل منجز ليظهر فوراً للزوار." : "لم يتم نشر أعمال بعد."}
          </p>
          {isSuperAdmin && (
            <Link
              href="/dashboard/portfolio/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
            >
              <Plus size={16} />
              إضافة أول عمل الآن
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((item) => (
            <Card
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#111827] h-full"
            >
              <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-800 shrink-0">
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-bold text-gray-400">
                    بدون صورة غلاف
                  </div>
                )}
                <span className="absolute start-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                  {item.category || "عام"}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between space-y-3 p-5">
                <div className="space-y-3">
                  <h3 className="text-base font-black text-gray-900 dark:text-white truncate">
                    {item.name}
                  </h3>
                  
                  <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                    {item.description || "لا يوجد وصف مختصر..."}
                  </p>

                  {Array.isArray(item.technologies) && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1" dir="ltr">
                      {item.technologies.map((t: any, idx: number) => (
                        <span
                          key={idx}
                          className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {typeof t === "string" ? t : t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    {item.liveUrl && (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline dark:text-brand-400"
                        title="معاينة حية"
                      >
                        <ExternalLink size={13} />
                        رابط
                      </a>
                    )}
                    {/* زر التعديل متاح دائماً الآن */}
                    {isSuperAdmin && (
                      <Link
                        href={`/dashboard/portfolio/new?id=${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
                      >
                        <Edit size={13} />
                        تعديل
                      </Link>
                    )}
                  </div>

                  {/* زر الحذف متاح دائماً الآن */}
                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    >
                      <Trash2 size={13} />
                      حذف
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}