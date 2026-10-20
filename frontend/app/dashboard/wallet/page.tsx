"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  FileSpreadsheet,
  CheckCircle2,
  CreditCard,
  Copy,
  Check,
  PlusCircle,
  MinusCircle,
  X,
  Clock,
  Banknote,
  User,
  Inbox,
  RefreshCw,
  Hash,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Transaction {
  id: string;
  type: "BONUS" | "DEDUCTION" | "TASK_REWARD" | "WITHDRAWAL";
  amount: number;
  description: string;
  receiptNo?: string | null;
  createdAt: string;
}

interface MemberWallet {
  id: string;
  name: string;
  email: string;
  role: string;
  track?: string;
  phone?: string;
  instaPay?: string;
  walletNumber?: string;
  walletBalance: number;
  totalWithdrawn: number;
}

export default function WalletPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const [currentUser, setCurrentUser] = useState<MemberWallet | null>(null);
  const [members, setMembers] = useState<MemberWallet[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTxLoading, setIsTxLoading] = useState(false);

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "BONUS" | "DEDUCTION" | "TASK_REWARD" | "WITHDRAWAL"
  >("TASK_REWARD");
  const [actionAmount, setActionAmount] = useState<number | "">("");
  const [actionReason, setActionReason] = useState("");
  const [actionReceiptNo, setActionReceiptNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAuthHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window === "undefined") return headers;

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("adminToken");

    if (token) {
      headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/i, "")}`;
    }
    return headers;
  };

  const normalizeWalletMember = (m: any): MemberWallet => {
    const emailLower = (m?.email || "").trim().toLowerCase();
    let role = (m?.role || "DEVELOPER").toUpperCase();
    if (emailLower === "mooazmohammed110@codexa.com" && role === "DEVELOPER") {
      role = "MOBILE_APP_LEAD";
    }
    return {
      ...m,
      role,
      walletBalance: Number(m?.walletBalance) || 0,
      totalWithdrawn: Number(m?.totalWithdrawn) || 0,
    };
  };

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: getAuthHeaders(),
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const rawObj = data?.data ?? data;
          const userObj = normalizeWalletMember(rawObj);
          setCurrentUser(userObj);
          setSelectedMemberId(userObj?.id || "");
        }
      } catch (err) {
        console.error("فشل تحميل بيانات المستخدم:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserData();
  }, [API_BASE]);

  useEffect(() => {
    if (!isSuperAdmin) return;

    async function fetchAllMembers() {
      try {
        const res = await fetch(`${API_BASE}/admin-users`, {
          headers: getAuthHeaders(),
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const rawList = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data
              : [];
          const list = rawList.map(normalizeWalletMember);
          setMembers(list);
          if (list.length > 0 && !selectedMemberId) {
            setSelectedMemberId(list[0].id);
          }
        }
      } catch (err) {
        console.error("فشل جلب قائمة الفريق:", err);
      }
    }
    fetchAllMembers();
  }, [isSuperAdmin, API_BASE]);

  const fetchTransactions = async (userId: string) => {
    if (!userId) return;
    setIsTxLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-users/${userId}/transactions`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const rawList = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.transactions)
              ? data.transactions
              : [];
        const validList = rawList.filter(
          (tx: any) => tx && typeof tx.amount === "number" && !isNaN(tx.amount),
        );
        setTransactions(validList);
      } else {
        setTransactions([]);
      }
    } catch {
      setTransactions([]);
    } finally {
      setIsTxLoading(false);
    }
  };

  useEffect(() => {
    const targetId = isSuperAdmin ? selectedMemberId : currentUser?.id;
    if (targetId) {
      fetchTransactions(targetId);
    }
  }, [selectedMemberId, currentUser, isSuperAdmin]);

  const activeMember = isSuperAdmin
    ? members.find((m) => m.id === selectedMemberId) || currentUser
    : currentUser;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const openActionModal = (
    type: "BONUS" | "DEDUCTION" | "TASK_REWARD" | "WITHDRAWAL",
  ) => {
    setActionType(type);
    setActionAmount("");
    setActionReason("");
    setActionReceiptNo("");
    setIsActionModalOpen(true);
  };

  const handleApplyAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !actionAmount ||
      Number(actionAmount) <= 0 ||
      !actionReason.trim() ||
      !activeMember?.id
    ) {
      return alert("يرجى إدخال المبلغ وسبب الإجراء بشكل صحيح");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${API_BASE}/admin-users/${activeMember.id}/transactions`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({
            type: actionType,
            amount: Number(actionAmount),
            description: actionReason.trim(),
            receiptNo: actionReceiptNo.trim() || undefined,
          }),
        },
      );

      if (res.ok) {
        setIsActionModalOpen(false);
        setActionAmount("");
        setActionReason("");
        setActionReceiptNo("");
        const targetId = activeMember.id;
        await fetchTransactions(targetId);
        alert("تم تسجيل المعاملة في الداتابيز وتحديث الرصيد بنجاح ✓");
      } else {
        const errData = await res.json();
        alert(errData.message || "فشل تسجيل الإجراء المالي");
      }
    } catch {
      alert("تعذر الاتصال بالسيرفر");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTxDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("ar-EG");
  };

  const handleExportExcel = () => {
    if (!transactions.length) return alert("لا توجد حركات مالية متاحة للتصدير");

    const dataToExport = transactions.map((t) => ({
      التاريخ: formatTxDate(t.createdAt),
      النوع:
        t.type === "BONUS"
          ? "مكافأة إضافية"
          : t.type === "DEDUCTION"
            ? "خصم وجزاء"
            : t.type === "WITHDRAWAL"
              ? "سحب مستحقات"
              : "إيداع راتب / مهمة",
      "المبلغ (ج.م)": t.amount,
      البيان: t.description,
      "رقم الإيصال / المرجع": t.receiptNo || "—",
    }));

    const headers = Object.keys(dataToExport[0]).join(",");
    const rows = dataToExport
      .map((row) =>
        Object.values(row)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const csvContent = "\uFEFF" + headers + "\n" + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `تقرير_محفظة_${activeMember?.name || "حساب"}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRewards = transactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalDeductions = Math.abs(
    transactions
      .filter((t) => t.type === "DEDUCTION")
      .reduce((acc, t) => acc + Number(t.amount), 0),
  );

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-10 text-right" dir="rtl">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-center dark:border-gray-800">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-black text-gray-900 dark:text-white">
            <Wallet className="text-brand-500" size={26} />
            <span>
              {isSuperAdmin
                ? "إدارة المحافظ والرواتب والمستحقات"
                : "محفظتي والأرباح والمستحقات"}
            </span>
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isSuperAdmin
              ? "تحكم كامل في أرصدة أعضاء الفريق، تسجيل المكافآت والخصومات، وتوثيق أرقام تحويل المستحقات."
              : `أهلاً ${currentUser?.name || ""}، هنا يمكنك متابعة أرباحك المعتمدة، المكافآت، وأرقام إيصالات التحويل.`}
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-500"
        >
          <FileSpreadsheet size={16} />
          <span>تصدير كشف حساب (.csv)</span>
        </button>
      </div>

      {isSuperAdmin && (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs md:p-5 dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-3">
              <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-400">
                <User size={15} className="text-brand-500" />
                تحديد عضو الفريق:
              </span>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="max-w-md flex-1 cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-900 shadow-xs outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-[#161f30] dark:text-white"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.track ? `${m.role} (${m.track})` : m.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => openActionModal("TASK_REWARD")}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 shadow-xs transition-all hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-600/20 dark:text-emerald-400 dark:hover:bg-emerald-600/30"
              >
                <Banknote size={14} />
                <span>إيداع راتب (+)</span>
              </button>

              <button
                onClick={() => openActionModal("BONUS")}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 shadow-xs transition-all hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-600/20 dark:text-blue-400 dark:hover:bg-blue-600/30"
              >
                <PlusCircle size={14} />
                <span>مكافأة / بونص (+)</span>
              </button>

              <button
                onClick={() => openActionModal("DEDUCTION")}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 shadow-xs transition-all hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-600/20 dark:text-rose-400 dark:hover:bg-rose-600/30"
              >
                <MinusCircle size={14} />
                <span>خصم / جزاء (-)</span>
              </button>

              <button
                onClick={() => openActionModal("WITHDRAWAL")}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-700 shadow-xs transition-all hover:bg-purple-100 dark:border-purple-500/30 dark:bg-purple-600/20 dark:text-purple-400 dark:hover:bg-purple-600/30"
              >
                <CheckCircle2 size={14} />
                <span>تسجيل سحب أرباح (-)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="space-y-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>الرصيد المتاح للسحب</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <Coins size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {activeMember?.walletBalance || 0}
            </span>
            <span className="text-xs font-bold text-gray-500">ج.م</span>
          </div>
          <p className="text-[10px] text-gray-400">مستحقات معتمدة جاهزة للتحويل</p>
        </Card>

        <Card className="space-y-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>إجمالي الأرباح والمكافآت</span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
              <ArrowDownLeft size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-blue-600 dark:text-blue-400">
              +{totalRewards}
            </span>
            <span className="text-xs font-bold text-gray-500">ج.م</span>
          </div>
          <p className="text-[10px] text-gray-400">مجموع المكافآت المعتمدة</p>
        </Card>

        <Card className="space-y-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>إجمالي الخصومات</span>
            <div className="rounded-xl bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-rose-600 dark:text-rose-400">
              -{totalDeductions}
            </span>
            <span className="text-xs font-bold text-gray-500">ج.م</span>
          </div>
          <p className="text-[10px] text-gray-400">إجمالي الجزاءات المسجلة</p>
        </Card>

        <Card className="space-y-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>المسحوبات السابقة</span>
            <div className="rounded-xl bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-gray-900 dark:text-white">
              {activeMember?.totalWithdrawn || 0}
            </span>
            <span className="text-xs font-bold text-gray-500">ج.م</span>
          </div>
          <p className="text-[10px] text-gray-400">مبالغ استلمتها كاش أو إنستاباي</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <Card className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs lg:col-span-2 dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
              <Clock size={17} className="text-brand-500" />
              <span>
                سجل الحركات المالية {isSuperAdmin ? `: ${activeMember?.name}` : ""}
              </span>
            </h2>
            <button
              onClick={() => fetchTransactions(activeMember?.id || "")}
              className="cursor-pointer rounded-lg p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <RefreshCw size={14} className={isTxLoading ? "animate-spin" : ""} />
            </button>
          </div>

          {isTxLoading ? (
            <div className="py-12 text-center text-xs text-gray-400">
              جاري تحميل السجل المالي...
            </div>
          ) : transactions.length === 0 ? (
            <div className="space-y-2 py-14 text-center">
              <Inbox size={32} className="mx-auto text-gray-400 opacity-60" />
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                لا توجد حركات مالية مسجلة حتى الآن
              </p>
              <p className="text-[11px] text-gray-400">
                عند اعتماد مهامك أو نزول مكافأة ستظهر تفاصيلها وقيمتها هنا فوراً.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-gray-100 pb-2 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <th className="py-2.5 font-bold">نوع المعاملة</th>
                    <th className="py-2.5 font-bold">البيان / السبب</th>
                    <th className="py-2.5 font-bold">رقم الإيصال / المرجع</th>
                    <th className="py-2.5 font-bold">التاريخ</th>
                    <th className="py-2.5 font-bold">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium dark:divide-gray-800/60">
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    >
                      <td className="py-3">
                        {tx.type === "TASK_REWARD" && (
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            أرباح مهمة
                          </span>
                        )}
                        {tx.type === "BONUS" && (
                          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                            مكافأة / بونص
                          </span>
                        )}
                        {tx.type === "DEDUCTION" && (
                          <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                            خصم وجزاء
                          </span>
                        )}
                        {tx.type === "WITHDRAWAL" && (
                          <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                            سحب مستحقات
                          </span>
                        )}
                      </td>
                      <td className="max-w-[240px] py-3">
                        <p className="truncate font-bold text-gray-900 dark:text-gray-200">
                          {tx.description || "معاملة مالية"}
                        </p>
                      </td>
                      <td className="py-3 font-mono text-[11px]">
                        {tx.receiptNo ? (
                          <span
                            className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 font-bold text-gray-700 dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-300"
                            dir="ltr"
                          >
                            <Hash size={11} className="text-brand-500" />
                            {tx.receiptNo}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td
                        className="py-3 font-mono text-[11px] text-gray-500 dark:text-gray-400"
                        dir="ltr"
                      >
                        {formatTxDate(tx.createdAt)}
                      </td>
                      <td className="py-3 font-mono text-sm font-bold">
                        <span
                          className={
                            Number(tx.amount) > 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }
                        >
                          {Number(tx.amount) > 0
                            ? `+${Number(tx.amount)}`
                            : Number(tx.amount) || 0}{" "}
                          ج.م
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
            <CreditCard size={18} className="text-brand-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              {isSuperAdmin
                ? `بيانات التحويل لـ ${activeMember?.name}`
                : "بيانات التحويل الخاصة بك"}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5 rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-800/40">
              <span className="block text-[11px] font-bold text-gray-500 dark:text-gray-400">
                عنوان إنستاباي (InstaPay):
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-200">
                  {activeMember?.instaPay || "غير مسجل"}
                </span>
                {activeMember?.instaPay && (
                  <button
                    onClick={() => handleCopy(activeMember.instaPay!, "insta")}
                    className="cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:text-gray-700 dark:hover:text-white"
                  >
                    {copiedText === "insta" ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1.5 rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-800/40">
              <span className="block text-[11px] font-bold text-gray-500 dark:text-gray-400">
                المحفظة الإلكترونية (فودافون كاش):
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-200">
                  {activeMember?.walletNumber || "غير مسجل"}
                </span>
                {activeMember?.walletNumber && (
                  <button
                    onClick={() =>
                      handleCopy(activeMember.walletNumber!, "wallet")
                    }
                    className="cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:text-gray-700 dark:hover:text-white"
                  >
                    {copiedText === "wallet" ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-[11px] leading-relaxed text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-400">
              {isSuperAdmin
                ? "💡 بعد تحويل المبلغ عبر إنستاباي أو كاش، سجل العملية واكتب رقم المرجع ليظهر في كشف حساب العضو."
                : "💡 يتم تحويل أرباحك ومستحقاتك بناءً على هذه الأرقام المسجلة، ويمكنك مراجعة رقم العملية في كشف الحساب."}
            </div>
          </div>
        </Card>
      </div>

      {isActionModalOpen && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#111827]">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                تسجيل حركة لـ:{" "}
                <span className="text-brand-600 dark:text-brand-400">
                  {activeMember?.name}
                </span>
              </h3>
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplyAction} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType("TASK_REWARD")}
                  className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2 font-bold transition-all ${
                    actionType === "TASK_REWARD"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  <Banknote size={14} />
                  <span>إيداع راتب (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionType("BONUS")}
                  className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2 font-bold transition-all ${
                    actionType === "BONUS"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  <PlusCircle size={14} />
                  <span>مكافأة / بونص (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionType("DEDUCTION")}
                  className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2 font-bold transition-all ${
                    actionType === "DEDUCTION"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  <MinusCircle size={14} />
                  <span>خصم / جزاء (-)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionType("WITHDRAWAL")}
                  className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2 font-bold transition-all ${
                    actionType === "WITHDRAWAL"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>تسجيل سحب (-)</span>
                </button>
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                  المبلغ (ج.م)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={actionAmount}
                  onChange={(e) =>
                    setActionAmount(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  placeholder="مثال: 2500"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 font-mono text-sm text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                  رقم العملية / المرجع (اختياري - InstaPay Ref / رقم الكاش)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={actionReceiptNo}
                  onChange={(e) => setActionReceiptNo(e.target.value)}
                  placeholder="مثال: 9482019485"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 font-mono text-xs text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                  البيان / سبب العملية
                </label>
                <textarea
                  rows={2}
                  required
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="مثال: تحويل إنستاباي لمستحقات مهمة الواجهات..."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="cursor-pointer rounded-xl px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-xl bg-brand-600 px-5 py-2.5 font-bold text-white shadow-xs hover:bg-brand-500 disabled:opacity-50"
                >
                  {isSubmitting ? "جاري التسجيل..." : "تأكيد وتسجيل في الداتابيز"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}