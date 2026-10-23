"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Trash2,
  X,
  MessageCircle,
  Phone,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { markMessageReadAction, deleteMessageAction } from "@/actions/messages";
import { sendProjectTrackingEmail } from "@/lib/emailjs";
import { cn } from "@/lib/utils";
import type { ContactMessage } from "@/app/dashboard/messages/page";

export type MessageStatus = "جديد" | "قيد المتابعة" | "تم الرد";

const DELETED_KEY = "codexa_messages_deleted";
const LOCAL_MESSAGES_KEY = "codexa_contact_messages";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://codexa-website-backend.vercel.app";

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

function cleanPhoneNumber(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, "");
  if (!digits) return null;
  if (digits.startsWith("01")) return "20" + digits.slice(1);
  return digits;
}

function getSavedStatus(id: string): MessageStatus | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(`msg_status_${id}`);
    if (saved === "تم الرد" || saved === "قيد المتابعة" || saved === "جديد") {
      return saved as MessageStatus;
    }
  } catch {}
  return null;
}

function resolveStatus(m: ContactMessage): MessageStatus {
  const local = getSavedStatus(m.id);
  if (local) return local;

  const raw = String(m.status || "").toUpperCase();
  if (raw === "تم الرد" || raw === "REPLIED") return "تم الرد";
  if (raw === "قيد المتابعة" || raw === "PENDING") return "قيد المتابعة";
  if (m.isRead) return "تم الرد";

  return "جديد";
}

// ───────── إدارة الرسائل المحذوفة محلياً ─────────
function getDeletedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function purgeLocalMessage(id: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`msg_status_${id}`);
    localStorage.removeItem(`msg_read_${id}`);
    localStorage.removeItem(`notif_read_msg_${id}`);

    // الرسائل المحفوظة محلياً (بيدمجها الـ interceptor مع رسائل السيرفر)
    const rawLocal = localStorage.getItem(LOCAL_MESSAGES_KEY);
    if (rawLocal) {
      const list = JSON.parse(rawLocal);
      if (Array.isArray(list)) {
        localStorage.setItem(
          LOCAL_MESSAGES_KEY,
          JSON.stringify(list.filter((m: any) => String(m?.id) !== String(id)))
        );
      }
    }

    // قائمة المحذوفات عشان الرسالة ما ترجعش لو السيرفر لسه بيرجّعها
    const deleted = getDeletedIds();
    if (!deleted.includes(String(id))) {
      deleted.push(String(id));
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    }
  } catch {}
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window === "undefined") return headers;
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("adminToken");
  if (token) headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/i, "")}`;
  return headers;
}

function prepareItems(requests: ContactMessage[]): ContactMessage[] {
  const deleted = getDeletedIds();
  return (requests || [])
    .filter((m) => !deleted.includes(String(m.id)))
    .map((m) => ({ ...m, status: resolveStatus(m) }));
}

export function MessagesClient({ requests = [] }: { requests: ContactMessage[] }) {
  const router = useRouter();
  const [items, setItems] = useState<ContactMessage[]>(() => prepareItems(requests));

  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!requests) return;
    setItems(prepareItems(requests));
  }, [requests]);

  function updateStatus(msgId: string, newStatus: MessageStatus) {
    try {
      localStorage.setItem(`msg_status_${msgId}`, newStatus);
      if (newStatus !== "جديد") {
        localStorage.setItem(`msg_read_${msgId}`, "true");
      } else {
        localStorage.removeItem(`msg_read_${msgId}`);
      }
      window.dispatchEvent(new Event("messagesUpdated"));
    } catch {}

    setItems((list) =>
      list.map((m) =>
        m.id === msgId
          ? { ...m, status: newStatus, isRead: newStatus !== "جديد" }
          : m
      )
    );

    if (selected?.id === msgId) {
      setSelected((prev) =>
        prev ? { ...prev, status: newStatus, isRead: newStatus !== "جديد" } : null
      );
    }

    if (newStatus !== "جديد") {
      startTransition(async () => {
        try {
          await markMessageReadAction(msgId);
        } catch {}
      });
    }
  }

  function openDetails(msg: ContactMessage) {
    const currentStatus = resolveStatus(msg);
    setSelected({ ...msg, status: currentStatus });
    setEmailFeedback(null);

    try {
      localStorage.setItem(`msg_read_${msg.id}`, "true");
      window.dispatchEvent(new Event("messagesUpdated"));
    } catch {}

    if (!msg.isRead && currentStatus === "جديد") {
      updateStatus(msg.id, "قيد المتابعة");
    }
  }

  function handleTriggerReply(msgId: string) {
    updateStatus(msgId, "تم الرد");
  }

  async function handleSendTrackingEmail() {
    if (!selected) return;

    const hasEmail = selected.email && selected.email.includes("@");
    if (!hasEmail) {
      alert("بيانات العميل لا تحتوي على بريد إلكتروني (مسجل برقم هاتف فقط).");
      return;
    }

    setIsSendingEmail(true);
    setEmailFeedback(null);

    try {
      const res = await sendProjectTrackingEmail({
        name: selected.name,
        email: selected.email.trim(),
        projectName: selected.subject || "مشروعك الجديد",
        trackingToken: selected.id,
      });

      if (res.success) {
        setEmailFeedback({
          type: "success",
          msg: "تم إرسال رابط المتابعة بنجاح إلى بريد العميل!",
        });
        updateStatus(selected.id, "تم الرد");
      } else {
        setEmailFeedback({
          type: "error",
          msg: `تعذر إرسال البريد: ${res.error}`,
        });
      }
    } catch (err: any) {
      setEmailFeedback({
        type: "error",
        msg: err?.message || "حدث خطأ غير متوقع أثناء إرسال البريد",
      });
    } finally {
      setIsSendingEmail(false);
    }
  }

  // الحذف: تحديث القائمة فوراً + تنظيف localStorage + طلب DELETE للباك إند
  function confirmDelete() {
    if (!toDelete) return;
    const id = String(toDelete.id);

    // 1) تحديث فوري للواجهة والتخزين المحلي
    purgeLocalMessage(id);
    setItems((list) => list.filter((m) => String(m.id) !== id));
    if (selected && String(selected.id) === id) setSelected(null);
    setToDelete(null);

    try {
      window.dispatchEvent(new Event("messagesUpdated"));
    } catch {}

    // 2) حذف من الباك إند (الـ Server Action أولاً، ولو فشل DELETE مباشر)
    startTransition(async () => {
      let deletedOnServer = false;

      try {
        const result = await deleteMessageAction(id);
        deletedOnServer = !!result?.success;
      } catch {}

      if (!deletedOnServer) {
        try {
          const res = await fetch(`${API_BASE}/contact-messages/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
            credentials: "include",
          });
          deletedOnServer = res.ok;
        } catch {}
      }

      try {
        router.refresh();
      } catch {}
    });
  }

  const isPhoneInEmail =
    selected?.email && !selected.email.includes("@") && /^[0-9+ ]+$/.test(selected.email);
  const clientPhone = selected?.phone || (isPhoneInEmail ? selected?.email : null);
  const whatsappNumber = cleanPhoneNumber(clientPhone);
  const hasValidEmail = selected?.email && selected.email.includes("@");

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs dark:border-gray-800 dark:bg-[#111827]">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 font-semibold text-[#8b8f9c] dark:border-gray-800">
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4">الاسم</th>
                <th className="px-6 py-4">بيانات التواصل</th>
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
                  const currentStatus: MessageStatus = resolveStatus(r);

                  return (
                    <tr key={r.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                      <td className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#14161f] dark:text-white">
                        {r.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-gray-500 dark:text-gray-400" dir="ltr">
                        {r.email}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                        {r.subject || "—"}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {currentStatus === "جديد" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400">
                            <span className="size-1.5 rounded-full bg-blue-500 animate-ping" />
                            جديد
                          </span>
                        )}
                        {currentStatus === "قيد المتابعة" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
                            <Clock size={12} />
                            قيد المتابعة
                          </span>
                        )}
                        {currentStatus === "تم الرد" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <CheckCircle2 size={12} />
                            تم الرد
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openDetails(r)}
                            className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-[#14161f] transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            عرض التفاصيل
                          </button>
                          <button
                            type="button"
                            onClick={() => setToDelete(r)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="حذف"
                            aria-label="حذف الرسالة"
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

      {/* الدرج الجانبي Slide-in Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300",
          selected ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSelected(null)} />
        <div
          className={cn(
            "absolute top-0 start-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 dark:bg-[#111827]",
            selected ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {selected && (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[#14161f] dark:text-white">تفاصيل الطلب</h2>
                  {(selected.status || "قيد المتابعة") === "تم الرد" ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      تم الرد بنجاح
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                      بانتظار تواصلك
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 text-right space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-400">العميل</p>
                  <p className="mt-1 text-base font-bold text-[#14161f] dark:text-white">{selected.name}</p>
                  <p className="mt-1 text-xs text-gray-400" dir="ltr">
                    {selected.email} • {formatDate(selected.createdAt)}
                  </p>
                  {clientPhone && (
                    <p className="mt-1 flex items-center justify-end gap-1.5 text-xs font-mono font-bold text-brand-600 dark:text-brand-400" dir="ltr">
                      <Phone size={13} />
                      {clientPhone}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">تفاصيل الفكرة المرسلة</p>
                  <div className="mt-2 whitespace-pre-line rounded-xl bg-[#f7f8fb] p-4 text-xs leading-6 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200 border border-gray-100 dark:border-gray-800">
                    {selected.message}
                  </div>
                </div>
              </div>

              {/* قسم الإجراءات بالأسفل */}
              <div className="flex flex-col gap-3 border-t border-gray-100 p-6 dark:border-gray-800">
                {hasValidEmail && (
                  <button
                    type="button"
                    disabled={isSendingEmail}
                    onClick={handleSendTrackingEmail}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4b3fdf] px-4 py-3 text-xs font-bold text-white shadow-md shadow-[#4b3fdf]/20 transition-all hover:bg-[#3b30bd] hover:shadow-lg hover:shadow-[#4b3fdf]/30 disabled:opacity-50"
                  >
                    {isSendingEmail ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>جاري إرسال الإيميل...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>إرسال رابط المتابعة بالبريد (EmailJS)</span>
                      </>
                    )}
                  </button>
                )}

                {emailFeedback && (
                  <div
                    className={cn(
                      "rounded-xl p-2.5 text-center text-xs font-semibold transition-all",
                      emailFeedback.type === "success"
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400"
                        : "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400"
                    )}
                  >
                    {emailFeedback.msg}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {whatsappNumber ? (
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `أهلاً أستاذ ${selected.name}، معك فريق Codexa بخصوص طلبك لمشروع (${selected.subject || "الجديد"}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleTriggerReply(selected.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700"
                    >
                      <MessageCircle size={15} />
                      واتساب فوري
                    </a>
                  ) : (
                    <Button
                      href={`mailto:${selected.email}${
                        selected.subject ? `?subject=${encodeURIComponent("رد Codexa: " + selected.subject)}` : ""
                      }`}
                      onClick={() => handleTriggerReply(selected.id)}
                      className="flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold"
                    >
                      <Mail size={15} />
                      الرد عبر البريد
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selected.id,
                        (selected.status || "قيد المتابعة") === "تم الرد" ? "قيد المتابعة" : "تم الرد"
                      )
                    }
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-3 text-xs font-bold transition-all shrink-0",
                      (selected.status || "قيد المتابعة") === "تم الرد"
                        ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    )}
                    title={(selected.status || "قيد المتابعة") === "تم الرد" ? "إعادة الطلب لقيد المتابعة" : "تحديد كـ تم الرد"}
                  >
                    {(selected.status || "قيد المتابعة") === "تم الرد" ? (
                      <span>إعادة للمتابعة</span>
                    ) : (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>تحديد كـ تم الرد</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setToDelete(selected)}
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:bg-gray-800 dark:hover:bg-rose-950/30"
                    title="حذف الرسالة"
                    aria-label="حذف الرسالة"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
          جاري التحديث...
        </div>
      )}
    </div>
  );
}