"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { deleteClientAction } from "@/actions/clients";

export function ClientsTable({ clients = [] }: { clients: any[] }) {
  const router = useRouter();
  const [target, setTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!target?.id) return;

    setIsDeleting(true);
    try {
      const res = await deleteClientAction(target.id);
      if (res.success) {
        setTarget(null);
        router.refresh();
      } else {
        alert(res.error || "تعذر حذف العميل");
      }
    } catch {
      alert("حدث خطأ أثناء الاتصال بالخادم لحذف العميل");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card className="overflow-hidden bg-white dark:bg-[#111827] border-border-subtle dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-border-subtle dark:border-gray-800 text-xs font-semibold text-[#8b8f9c] dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30">
              <th className="px-6 py-3.5">العميل</th>
              <th className="px-6 py-3.5">مسؤول التواصل</th>
              <th className="px-6 py-3.5">الصناعة</th>
              <th className="px-6 py-3.5">إجمالي الإيرادات</th>
              <th className="px-6 py-3.5 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle dark:divide-gray-800">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-[#8b8f9c] dark:text-gray-400">
                  لا يوجد عملاء مضافون حالياً. اضغط على "إضافة عميل جديد" للبدء.
                </td>
              </tr>
            ) : (
              clients.map((c) => {
                const revenue = Number(c.totalRevenue) || 0;
                const contact = c.contactPerson || c.contact || "—";
                const industry = c.industry || "—";

                return (
                  <tr
                    key={c.id}
                    className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {c.logo ? (
                          <img
                            src={c.logo}
                            alt={c.name}
                            className="h-9 w-9 rounded-lg object-contain border border-gray-150 dark:border-gray-700 p-0.5"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                            <Building2 size={18} />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-[#14161f] dark:text-white">
                            {c.name}
                          </div>
                          {c.company && (
                            <div className="text-xs text-[#8b8f9c] dark:text-gray-400">
                              {c.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b8f9c] dark:text-gray-400">
                      {contact}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b8f9c] dark:text-gray-400">
                      {industry}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#14161f] dark:text-white dir-ltr text-right">
                      ${revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setTarget(c)}
                          disabled={isDeleting}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={15} />
                        </button>
                        <Link
                          href={`/dashboard/clients/${c.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                          title="تعديل"
                        >
                          <Pencil size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {clients.length > 0 && (
        <Pagination total={clients.length} shown={clients.length} />
      )}

      <DeleteDialog
        open={!!target}
        itemLabel="العميل"
        onClose={() => setTarget(null)}
        onConfirm={handleDelete}
      />
    </Card>
  );
}