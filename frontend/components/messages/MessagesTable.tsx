"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, X, Mail, Calendar, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { deleteContactMessageAction, updateContactStatusAction } from "@/actions/contact";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message?: string;
  status?: string;
  createdAt?: string;
}

export function MessagesTable({ initialMessages = [] }: { initialMessages: ContactMessage[] }) {
  const router = useRouter();
  const [targetDelete, setTargetDelete] = useState<ContactMessage | null>(null);
  const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);

  // الترقيم والتنقل
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalCount = initialMessages.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMessages = initialMessages.slice(startIndex, startIndex + itemsPerPage);

  const formatEnglishDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

  async function handleDelete() {
    if (!targetDelete) return;
    const res = await deleteContactMessageAction(targetDelete.id);
    if (res.success) {
      setTargetDelete(null);
      if (currentMessages.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
      router.refresh();
    } else {
      alert(res.error || "تعذر حذف الرسالة");
    }
  }

  async function handleStatusChange(msg: ContactMessage, newStatus: string) {
    await updateContactStatusAction(msg.id, newStatus);
    router.refresh();
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* الترويسة العلوية */}
      <div>
        <h1 className="text-2xl font-black text-[#14161f] dark:text-white">إدارة الطلبات الواردة</h1>
        <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
          متابعة الاستفسارات وطلبات المشاريع المرسلة عبر الموقع الإلكتروني
        </p>
      </div>

      {/* الجدول */}
      <Card className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
        {totalCount === 0 ? (
          <div className="py-20 text-center text-sm font-semibold text-gray-400">
            لا توجد طلبات تواصل واردة حتى الآن.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-gray-100 font-semibold text-[#8b8f9c] dark:border-gray-800">
                  <th className="py-4 px-4">التاريخ</th>
                  <th className="py-4 px-4">الاسم</th>
                  <th className="py-4 px-4">البريد الإلكتروني</th>
                  <th className="py-4 px-4">الموضوع</th>
                  <th className="py-4 px-4 text-center">الحالة</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {currentMessages.map((m) => {
                  const isPending = !m.status || m.status === "جديد";
                  return (
                    <tr key={m.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                      <td className="py-4 px-4 font-semibold text-gray-500 dark:text-gray-400">
                        {formatEnglishDate(m.createdAt)}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#14161f] dark:text-white">{m.name}</td>
                      <td className="py-4 px-4 text-gray-500 dark:text-gray-400 font-mono text-[11px]">{m.email}</td>
                      <td className="py-4 px-4 font-medium text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {m.subject || "طلب مشروع"}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(m, isPending ? "تم التواصل" : "جديد")}
                          className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                            isPending
                              ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                          }`}
                        >
                          {m.status || "جديد"}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => setViewMessage(m)}
                            className="rounded-lg bg-brand-50 px-3 py-1.5 text-[11px] font-bold text-brand-600 transition-colors hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-400"
                          >
                            عرض التفاصيل
                          </button>
                          <button
                            type="button"
                            onClick={() => setTargetDelete(m)}
                            className="text-gray-400 transition-colors hover:text-rose-600"
                            title="حذف"
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
        )}

        {/* شريط الترقيم الحقيقي بدون أي 48 أو قيم ثابتة */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5 text-xs font-semibold text-gray-400 dark:border-gray-800">
          <span>عرض {totalCount === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalCount)} من {totalCount} إجمالي</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              السابق
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCurrentPage(n)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                  currentPage === n
                    ? "bg-brand-600 text-white shadow-sm"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalCount === 0}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              التالي
            </button>
          </div>
        </div>
      </Card>

      {/* نافذة عرض كامل تفاصيل الطلب */}
      {viewMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#111827] text-right">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h3 className="text-base font-bold text-[#14161f] dark:text-white">تفاصيل طلب المشروع</h3>
              <button onClick={() => setViewMessage(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <User size={15} className="text-brand-600" />
                <span>الاسم: <strong className="text-[#14161f] dark:text-white">{viewMessage.name}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Mail size={15} className="text-brand-600" />
                <span>البريد الإلكتروني: <strong className="text-[#14161f] dark:text-white">{viewMessage.email}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar size={15} className="text-brand-600" />
                <span>تاريخ الإرسال: <strong className="text-[#14161f] dark:text-white">{formatEnglishDate(viewMessage.createdAt)}</strong></span>
              </div>

              <div className="rounded-xl bg-[#f7f8fb] p-4 dark:bg-gray-800/60">
                <span className="block font-bold text-gray-700 dark:text-gray-200 mb-2">نص الفكرة والرسالة:</span>
                <p className="whitespace-pre-line leading-relaxed text-gray-600 dark:text-gray-300">
                  {viewMessage.message || "لا توجد تفاصيل إضافية."}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setViewMessage(null)}
                  className="rounded-xl bg-brand-600 px-6 py-2 text-xs font-bold text-white hover:bg-brand-700"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف */}
      <DeleteDialog
        open={!!targetDelete}
        itemLabel={`طلب التواصل من "${targetDelete?.name || ""}"`}
        onClose={() => setTargetDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}