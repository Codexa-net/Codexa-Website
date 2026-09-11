"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { deleteServiceAction, updateServiceAction } from "@/actions/services";

interface ServiceItem {
  id: string;
  name?: string;
  title?: string;
  category?: string;
  status?: string;
  description?: string;
}

export function ServicesTable({ services = [] }: { services: ServiceItem[] }) {
  const router = useRouter();
  
  // حالة الحذف
  const [targetDelete, setTargetDelete] = useState<ServiceItem | null>(null);
  
  // حالة نافذة التعديل
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editForm, setEditForm] = useState({ name: "", category: "", status: "نشطة", description: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  // حالة التصفح والترقيم
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalCount = services.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = services.slice(startIndex, startIndex + itemsPerPage);

  // فتح نافذة التعديل مع تعبئة البيانات السابقة
  function handleOpenEdit(s: ServiceItem) {
    setEditingService(s);
    setEditForm({
      name: s.name || s.title || "",
      category: s.category || "",
      status: s.status || "نشطة",
      description: s.description || "",
    });
  }

  // حفظ التعديل
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingService || !editForm.name.trim()) return;

    setIsUpdating(true);
    const res = await updateServiceAction(editingService.id, editForm);
    setIsUpdating(false);

    if (res.success) {
      setEditingService(null);
      router.refresh();
    } else {
      alert(res.error || "تعذر حفظ التعديلات");
    }
  }

  // تأكيد الحذف
  async function handleDelete() {
    if (!targetDelete) return;
    const res = await deleteServiceAction(targetDelete.id);

    if (res.success) {
      setTargetDelete(null);
      // الرجوع خطوة للخلف إذا حُذف آخر عنصر في الصفحة
      if (currentServices.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
      router.refresh();
    } else {
      alert(res.error || "تعذر حذف الخدمة");
    }
  }

  if (totalCount === 0) {
    return (
      <Card className="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-xs dark:border-gray-800 dark:bg-[#111827]">
        <p className="text-sm font-semibold text-gray-400">
          لا توجد خدمات مضافة حتى الآن. اضغط على "إضافة خدمة +" للبدء.
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-gray-100 font-semibold text-[#8b8f9c] dark:border-gray-800">
              <th className="py-4 px-4">اسم الخدمة</th>
              <th className="py-4 px-4">التصنيف</th>
              <th className="py-4 px-4">الحالة</th>
              <th className="py-4 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentServices.map((s) => {
              const serviceName = s.name || s.title || "خدمة بدون اسم";
              const isActive = s.status === "نشطة";

              return (
                <tr key={s.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                  <td className="py-4 px-4 font-bold text-[#14161f] dark:text-white">
                    {serviceName}
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                    {s.category || "—"}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {s.status || "نشطة"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(s)}
                        className="text-gray-400 transition-colors hover:text-brand-600"
                        title="تعديل الخدمة"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetDelete(s)}
                        className="text-gray-400 transition-colors hover:text-rose-600"
                        title="حذف الخدمة"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* قسم الترقيم والتنقل الفعلي */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5 text-xs font-semibold text-gray-400 dark:border-gray-800">
        <span>
          عرض {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalCount)} من {totalCount} إجمالي
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            السابق
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setCurrentPage(num)}
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                currentPage === num
                  ? "bg-brand-600 text-white shadow-sm"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            التالي
          </button>
        </div>
      </div>

      {/* نافذة التعديل المنبثقة */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-right shadow-2xl dark:bg-[#111827]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h3 className="text-base font-bold text-[#14161f] dark:text-white">تعديل الخدمة</h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                  اسم الخدمة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#f7f8fb] p-2.5 text-right outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">التصنيف</label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#f7f8fb] p-2.5 text-right outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">الحالة</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#f7f8fb] p-2.5 text-right outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="نشطة">نشطة</option>
                  <option value="معطلة">معطلة</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">الوصف</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#f7f8fb] p-2.5 text-right outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-700 disabled:opacity-50"
                >
                  {isUpdating && <Loader2 size={14} className="animate-spin" />}
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف */}
      <DeleteDialog
        open={!!targetDelete}
        itemLabel={`الخدمة "${targetDelete?.name || targetDelete?.title || ""}"`}
        onClose={() => setTargetDelete(null)}
        onConfirm={handleDelete}
      />
    </Card>
  );
}