import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { serverFetchApi } from "@/lib/server-api";

export default async function ClientsPage() {
  let clients: any[] = [];

  try {
    const res = await serverFetchApi("/clients");
    clients = Array.isArray(res) ? res : res?.data ?? [];
  } catch (error) {
    console.error("تعذر جلب العملاء:", error);
  }

  const totalClients = clients.length;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* الترويسة: العنوان أقصى اليمين والزر أقصى اليسار */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#14161f] dark:text-white">العملاء</h1>
          <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
            إدارة كافة الشركات وجهات الاتصال التي تتعامل معها الوكالة.
          </p>
        </div>

        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Plus size={16} />
          إضافة عميل جديد +
        </Link>
      </div>

      {/* جدول العملاء */}
      <Card className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
        {totalClients === 0 ? (
          <div className="py-16 text-center text-sm font-semibold text-gray-400">
            لا يوجد عملاء مضافون حالياً. اضغط على "إضافة عميل جديد" للبدء.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-gray-100 font-semibold text-[#8b8f9c] dark:border-gray-800">
                  <th className="py-4 px-4">العميل</th>
                  <th className="py-4 px-4">مسؤول التواصل</th>
                  <th className="py-4 px-4">الصناعة</th>
                  <th className="py-4 px-4">إجمالي الإيرادات</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="py-4 px-4 font-bold text-[#14161f] dark:text-white">{c.name}</td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{c.contactPerson || "—"}</td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{c.industry || "—"}</td>
                    <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {c.revenue ? `$${c.revenue}` : "—"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link href={`/dashboard/clients/${c.id}/edit`} className="text-gray-400 hover:text-brand-600">
                          <Pencil size={15} />
                        </Link>
                        <button type="button" className="text-gray-400 hover:text-rose-600">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalClients > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5 text-xs font-semibold text-gray-400 dark:border-gray-800">
            <span>عرض {totalClients} من {totalClients} عميل</span>
            <div className="flex items-center gap-1.5">
              <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">السابق</button>
              <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 font-bold text-white shadow-sm">1</button>
              <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">التالي</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}