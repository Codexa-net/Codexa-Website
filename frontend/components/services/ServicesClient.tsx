"use client";

import { useState, useTransition } from "react";
import { Mail, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { markMessageReadAction, deleteMessageAction } from "@/actions/messages";
import { cn } from "@/lib/utils";
import type { ContactMessage } from "@/app/dashboard/messages/page";

const statusStyles: Record<"جديد" | "تمت القراءة", string> = {
  "جديد": "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  "تمت القراءة": "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function MessagesClient({ requests }: { requests: ContactMessage[] }) {
  const [items, setItems] = useState(requests);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
  const [isPending, startTransition] = useTransition();

  function openDetails(msg: ContactMessage) {
    setSelected(msg);
    if (!msg.isRead) {
      startTransition(async () => {
        const result = await markMessageReadAction(msg.id);
        if (result.success) {
          setItems((list) => list.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
          setSelected((s) => (s && s.id === msg.id ? { ...s, isRead: true } : s));
        }
      });
    }
  }

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      const result = await deleteMessageAction(id);
      if (result.success) {
        setItems((list) => list.filter((m) => m.id !== id));
        if (selected?.id === id) setSelected(null);
      }
      setDelete(null);
    });
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-[#14161f] dark:text-white">إدارة الطلبات الواردة</h1>
        <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
          متابعة الاستفسارات وطلبات المشاريع المرسلة عبر الموقع الإلكتروني.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs dark:border-gray-800 dark:bg-[#111827]">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 font-semibold text-[#8b8f9c] dark:border-gray-800">
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4">الاسم</th>
                <th className="px-6 py-4">البريد الإلكتروني</th>
                <th className="px-6 py-4">الموضوع</th>
                <th className="px-6 py-4 text-center">الحالة</th>
                <th className="px-6 py-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm font-semibold text-gray-400">
                    لا توجد طلبات تواصل حتى الآن.
                  </td>
                </tr>
              ) : (
                items.map((r) => {
                  const status = r.isRead ? "تمت القراءة" : "جديد";
                  return (
                    <tr key={r.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                      <td className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#14161f] dark:text-white">{r.name}</td>
                      <td className="px-6 py-4 font-mono text-[11px] text-gray-500 dark:text-gray-400" dir="ltr">
                        {r.email}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                        {r.subject || "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge className={statusStyles[status]}>{status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openDetails(r)}
                            className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            عرض التفاصيل
                          </button>
                          <button
                            onClick={() => setToDelete(r)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="حذف"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination total={items.length} shown={items.length} />
      </Card>

      {/* Slide-in Drawer متوافق مع الوضع الليلي */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity",
          selected ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSelected(null)} />
        <div
          className={cn(
            "absolute top-0 start-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform dark:bg-[#111827]",
            selected ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {selected && (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
                <button
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                >
                  <X size={16} />
                </button>
                <h2 className="text-lg font-black text-[#14161f] dark:text-white">تفاصيل الطلب</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6 text-right">
                <p className="text-xs font-semibold text-gray-400">المرسل</p>
                <p className="mt-1 text-base font-bold text-[#14161f] dark:text-white">{selected.name}</p>
                <p className="mt-1 text-xs text-gray-400" dir="ltr">
                  {selected.email} • {formatDate(selected.createdAt)}
                </p>
                {selected.phone && (
                  <p className="mt-1 text-xs text-gray-400" dir="ltr">
                    {selected.phone}
                  </p>
                )}

                <p className="mt-6 text-xs font-semibold text-gray-400">الرسالة أو تفاصيل المشروع</p>
                <div className="mt-2 whitespace-pre-line rounded-xl bg-[#f7f8fb] p-4 text-xs leading-6 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                  {selected.message}
                </div>
              </div>

              <div className="flex gap-3 border-t border-gray-100 p-6 dark:border-gray-800">
                <button
                  onClick={() => setToDelete(selected)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-500 dark:bg-gray-800 dark:hover:bg-rose-950/30"
                  title="حذف الطلب"
                >
                  <Trash2 size={16} />
                </button>
                <Button
                  href={`mailto:${selected.email}${
                    selected.subject ? `?subject=${encodeURIComponent("رد: " + selected.subject)}` : ""
                  }`}
                  className="flex-1"
                >
                  <Mail size={15} />
                  الرد عبر البريد
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteDialog
        open={!!toDelete}
        itemLabel="الرسالة"
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />

      {isPending && (
        <div className="fixed bottom-6 start-1/2 z-[60] -translate-x-1/2 rounded-full bg-[#14161f] px-4 py-2 text-xs font-semibold text-white shadow-lg dark:bg-white dark:text-black">
          جاري الحفظ...
        </div>
      )}
    </div>
  );
}