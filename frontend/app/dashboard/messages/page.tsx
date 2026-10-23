"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { MessagesClient } from "@/components/messages/MessagesClient";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead?: boolean;
  status?: string;
  createdAt: string;
}

// تنظيف بيانات التواصل لعرض رقم الهاتف صافي (مثل 01157204301) أو الإيميل الحقيقي فقط
function normalizeContactRecord(m: any): ContactMessage {
  const rawEmail = String(m?.email || m?.contact || "").trim();
  const isWrappedPhone =
    rawEmail.toLowerCase().startsWith("whatsapp-") &&
    rawEmail.toLowerCase().includes("@codexa.");

  const extractedPhone = isWrappedPhone
    ? rawEmail.replace(/^whatsapp-/i, "").replace(/@codexa\.[a-z]+$/i, "")
    : m?.phone
      ? String(m.phone).trim()
      : "";

  const cleanDisplayContact = isWrappedPhone
    ? extractedPhone
    : extractedPhone && !rawEmail.includes("@")
      ? extractedPhone
      : rawEmail;

  const cleanMessageBody = String(m?.message || "").replace(
    /whatsapp-(\d+)@codexa\.[a-z]+/gi,
    "$1",
  );

  return {
    ...m,
    id: String(m?.id || `msg_${Date.now()}`),
    name: m?.name || "عميل",
    email: cleanDisplayContact,
    phone: extractedPhone || m?.phone || null,
    subject: m?.subject || "طلب مشروع جديد",
    message: cleanMessageBody,
    isRead: Boolean(m?.isRead),
    status: m?.status || "جديد",
    createdAt: m?.createdAt || new Date().toISOString(),
  };
}

export default function MessagesPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "https://codexa-website-backend.vercel.app";

  const [messagesData, setMessagesData] = useState<ContactMessage[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasLoadedOnceRef = useRef(false);

  const loadAllMessages = useCallback(
    async (silent = false) => {
      if (!hasLoadedOnceRef.current && !silent) {
        setInitialLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      let localMsgs: ContactMessage[] = [];
      let deletedIds: string[] = [];

      if (typeof window !== "undefined") {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("adminToken");
        if (token) {
          headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/i, "")}`;
        }

        try {
          const rawDeleted = localStorage.getItem("codexa_deleted_messages");
          if (rawDeleted) deletedIds = JSON.parse(rawDeleted);
        } catch {}

        try {
          const rawLocal = localStorage.getItem("codexa_contact_messages");
          if (rawLocal) {
            const parsed = JSON.parse(rawLocal);
            if (Array.isArray(parsed)) {
              localMsgs = parsed
                .map(normalizeContactRecord)
                .filter((m) => !deletedIds.includes(String(m.id)));
            }
          }
        } catch {}
      }

      const endpoints = [
        `${API_BASE}/contact-messages`,
        `${API_BASE}/admin/messages?limit=50`,
        `${API_BASE}/messages`,
        `${API_BASE}/contact`,
      ];

      let serverMsgs: ContactMessage[] = [];

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, {
            headers,
            credentials: "include",
          });
          if (res.ok) {
            const json = await res.json();
            const list = Array.isArray(json)
              ? json
              : Array.isArray(json?.data)
                ? json.data
                : Array.isArray(json?.items)
                  ? json.items
                  : [];
            if (list.length > 0) {
              serverMsgs = list
                .map(normalizeContactRecord)
                .filter((m: ContactMessage) => !deletedIds.includes(String(m.id)));
              break;
            }
          }
        } catch {}
      }

      const combined = [...localMsgs, ...serverMsgs];
      const seen = new Set<string>();
      const unique = combined.filter((m) => {
        if (!m) return false;
        const key = String(m.id || `${m.name}_${m.email}_${m.subject}`);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      hasLoadedOnceRef.current = true;
      setMessagesData(unique);
      setInitialLoading(false);
      setIsRefreshing(false);
    },
    [API_BASE],
  );

  useEffect(() => {
    loadAllMessages(false);

    // عند فتح تفاصيل الرسالة أو تحديث حالتها نحدث البيانات بصمت في الخلفية دون إغلاق نافذة التفاصيل
    const handleSilentSync = () => {
      loadAllMessages(true);
    };

    window.addEventListener("messagesUpdated", handleSilentSync);
    return () => window.removeEventListener("messagesUpdated", handleSilentSync);
  }, [loadAllMessages]);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14161f] dark:text-white">
            إدارة الطلبات الواردة
          </h1>
          <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
            متابعة الاستفسارات وطلبات المشاريع المرسلة عبر الموقع الإلكتروني.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadAllMessages(true)}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111827] dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          <span>تحديث الطلبات</span>
        </button>
      </div>

      {initialLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
        </div>
      ) : (
        <MessagesClient requests={messagesData} />
      )}
    </div>
  );
}