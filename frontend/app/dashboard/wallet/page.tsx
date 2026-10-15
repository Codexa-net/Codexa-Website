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

  // مودال الإجراء المالي (للسوبر أدمن فقط)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"BONUS" | "DEDUCTION" | "TASK_REWARD" | "WITHDRAWAL">("TASK_REWARD");
  const [actionAmount, setActionAmount] = useState<number | "">("");
  const [actionReason, setActionReason] = useState("");
  const [actionReceiptNo, setActionReceiptNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAuthHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window === "undefined") return headers;

    let token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("adminToken");

    if (token) {
      headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/i, "")}`;
    }
    return headers;
  };

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  // 1. جلب بيانات المستخدم الحالي
  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: getAuthHeaders(),
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const userObj = data?.data ?? data;
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

  // 2. جلب جميع الأعضاء إذا كان الحساب سوبر أدمن
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
          const list = Array.isArray(data) ? data : [];
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

  // 3. جلب الحركات المالية الحقيقية
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
        setTransactions(Array.isArray(data) ? data : []);
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

  const openActionModal = (type: "BONUS" | "DEDUCTION" | "TASK_REWARD" | "WITHDRAWAL") => {
    setActionType(type);
    setActionAmount("");
    setActionReason("");
    setActionReceiptNo("");
    setIsActionModalOpen(true);
  };

  // حفظ المعاملة بواسطة السوبر أدمن
  const handleApplyAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionAmount || Number(actionAmount) <= 0 || !actionReason.trim() || !activeMember?.id) {
      return alert("يرجى إدخال المبلغ وسبب الإجراء بشكل صحيح");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin-users/${activeMember.id}/transactions`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          type: actionType,
          amount: Number(actionAmount),
          description: actionReason.trim(),
          receiptNo: actionReceiptNo.trim() || undefined,
        }),
      });

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

  // تصدير إكسيل
  const handleExportExcel = () => {
    if (!transactions.length) return alert("لا توجد حركات مالية متاحة للتصدير");

    const dataToExport = transactions.map((t) => ({
      التاريخ: new Date(t.createdAt).toLocaleDateString("ar-EG"),
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
          .join(",")
      )
      .join("\n");

    const csvContent = "\uFEFF" + headers + "\n" + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `تقرير_محفظة_${activeMember?.name || "حساب"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRewards = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDeductions = Math.abs(
    transactions
      .filter((t) => t.type === "DEDUCTION")
      .reduce((acc, t) => acc + t.amount, 0)
  );

  return (
    <div className="space-y-6 text-right max-w-[1600px] mx-auto pb-10" dir="rtl">
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
            <Wallet className="text-brand-500" size={26} />
            <span>{isSuperAdmin ? "إدارة المحافظ والرواتب والمستحقات" : "محفظتي والأرباح والمستحقات"}</span>
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isSuperAdmin
              ? "تحكم كامل في أرصدة أعضاء الفريق، تسجيل المكافآت والخصومات، وتوثيق أرقام تحويل المستحقات."
              : `أهلاً ${currentUser?.name || ""}، هنا يمكنك متابعة أرباحك المعتمدة، المكافآت، وأرقام إيصالات التحويل.`}
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer w-fit"
        >
          <FileSpreadsheet size={16} />
          <span>تصدير كشف حساب (.csv)</span>
        </button>
      </div>

      {/* شريط تحكم السوبر أدمن */}
      {isSuperAdmin && (
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 md:p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-400 shrink-0 flex items-center gap-1.5">
                <User size={15} className="text-brand-500" />
                تحديد عضو الفريق:
              </span>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="flex-1 max-w-md rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#161f30] px-4 py-2.5 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-brand-500 cursor-pointer shadow-xs"
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
                className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 dark:text-emerald-400 dark:border-emerald-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Banknote size={14} />
                <span>إيداع راتب (+)</span>
              </button>

              <button
                onClick={() => openActionModal("BONUS")}
                className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 dark:bg-blue-600/20 dark:hover:bg-blue-600/30 dark:text-blue-400 dark:border-blue-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <PlusCircle size={14} />
                <span>مكافأة / بونص (+)</span>
              </button>

              <button
                onClick={() => openActionModal("DEDUCTION")}
                className="flex items-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-600/20 dark:hover:bg-rose-600/30 dark:text-rose-400 dark:border-rose-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <MinusCircle size={14} />
                <span>خصم / جزاء (-)</span>
              </button>

              <button
                onClick={() => openActionModal("WITHDRAWAL")}
                className="flex items-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 dark:bg-purple-600/20 dark:hover:bg-purple-600/30 dark:text-purple-400 dark:border-purple-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <CheckCircle2 size={14} />
                <span>تسجيل سحب أرباح (-)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الكروت المالية الأربعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>الرصيد المتاح للسحب</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Coins size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {activeMember?.walletBalance || 0}
            </span>
            <span className="text-xs font-bold text-gray-500">ج.م</span>
          </div>
          <p className="text-[10px] text-gray-400">مستحقات معتمدة جاهزة للتحويل</p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>إجمالي الأرباح والمكافآت</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ArrowDownLeft size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
              +{totalRewards}
            </span>
            <span className="text-xs font-bold text-gray-500">ج.م</span>
          </div>
          <p className="text-[10px] text-gray-400">مجموع المكافآت المعتمدة</p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>إجمالي الخصومات</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              -{totalDeductions}
            </span>
            <span className="text-xs font-bold text-gray-500">ج.م</span>
          </div>
          <p className="text-[10px] text-gray-400">إجمالي الجزاءات المسجلة</p>
        </Card>

        <Card className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>المسحوبات السابقة</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-gray-900 dark:text-white">
              {activeMember?.totalWithdrawn || 0}
            </span>
            <span className="text-xs font-bold text-gray-500">ج.م</span>
          </div>
          <p className="text-[10px] text-gray-400">مبالغ استلمتها كاش أو إنستاباي</p>
        </Card>
      </div>

      {/* سجل الحركات وبيانات التحويل */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock size={17} className="text-brand-500" />
              <span>سجل الحركات المالية {isSuperAdmin ? `: ${activeMember?.name}` : ""}</span>
            </h2>
            <button
              onClick={() => fetchTransactions(activeMember?.id || "")}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <RefreshCw size={14} className={isTxLoading ? "animate-spin" : ""} />
            </button>
          </div>

          {isTxLoading ? (
            <div className="py-12 text-center text-gray-400 text-xs">جاري تحميل السجل المالي...</div>
          ) : transactions.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <Inbox size={32} className="mx-auto text-gray-400 opacity-60" />
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400">لا توجد حركات مالية مسجلة حتى الآن</p>
              <p className="text-[11px] text-gray-400">عند اعتماد مهامك أو نزول مكافأة ستظهر تفاصيلها وقيمتها هنا فوراً.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <th className="py-2.5 font-bold">نوع المعاملة</th>
                    <th className="py-2.5 font-bold">البيان / السبب</th>
                    <th className="py-2.5 font-bold">رقم الإيصال / المرجع</th>
                    <th className="py-2.5 font-bold">التاريخ</th>
                    <th className="py-2.5 font-bold">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-3">
                        {tx.type === "TASK_REWARD" && (
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            أرباح مهمة
                          </span>
                        )}
                        {tx.type === "BONUS" && (
                          <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            مكافأة / بونص
                          </span>
                        )}
                        {tx.type === "DEDUCTION" && (
                          <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            خصم وجزاء
                          </span>
                        )}
                        {tx.type === "WITHDRAWAL" && (
                          <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            سحب مستحقات
                          </span>
                        )}
                      </td>
                      <td className="py-3 max-w-[240px]">
                        <p className="text-gray-900 dark:text-gray-200 font-bold truncate">{tx.description}</p>
                      </td>
                      <td className="py-3 font-mono text-[11px]">
                        {tx.receiptNo ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700/60 font-bold" dir="ltr">
                            <Hash size={11} className="text-brand-500" />
                            {tx.receiptNo}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 font-mono text-gray-500 dark:text-gray-400 text-[11px]" dir="ltr">
                        {new Date(tx.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="py-3 font-mono font-bold text-sm">
                        <span className={tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount} ج.م
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* بيانات التحويل */}
        <Card className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <CreditCard size={18} className="text-brand-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              {isSuperAdmin ? `بيانات التحويل لـ ${activeMember?.name}` : "بيانات التحويل الخاصة بك"}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1.5">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block">عنوان إنستاباي (InstaPay):</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-200">
                  {activeMember?.instaPay || "غير مسجل"}
                </span>
                {activeMember?.instaPay && (
                  <button
                    onClick={() => handleCopy(activeMember.instaPay!, "insta")}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                  >
                    {copiedText === "insta" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1.5">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block">المحفظة الإلكترونية (فودافون كاش):</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-200">
                  {activeMember?.walletNumber || "غير مسجل"}
                </span>
                {activeMember?.walletNumber && (
                  <button
                    onClick={() => handleCopy(activeMember.walletNumber!, "wallet")}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                  >
                    {copiedText === "wallet" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 bg-brand-50 dark:bg-brand-500/10 rounded-xl border border-brand-200 dark:border-brand-500/20 text-[11px] text-brand-700 dark:text-brand-400 leading-relaxed">
              {isSuperAdmin
                ? "💡 بعد تحويل المبلغ عبر إنستاباي أو كاش، سجل العملية واكتب رقم المرجع ليظهر في كشف حساب العضو."
                : "💡 يتم تحويل أرباحك ومستحقاتك بناءً على هذه الأرقام المسجلة، ويمكنك مراجعة رقم العملية في كشف الحساب."}
            </div>
          </div>
        </Card>
      </div>

      {/* مودال العمليات المالية (للسوبر أدمن فقط) */}
      {isActionModalOpen && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#111827] border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                تسجيل حركة لـ: <span className="text-brand-600 dark:text-brand-400">{activeMember?.name}</span>
              </h3>
              <button onClick={() => setIsActionModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplyAction} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType("TASK_REWARD")}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    actionType === "TASK_REWARD"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <Banknote size={14} />
                  <span>إيداع راتب (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionType("BONUS")}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    actionType === "BONUS"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <PlusCircle size={14} />
                  <span>مكافأة / بونص (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionType("DEDUCTION")}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    actionType === "DEDUCTION"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <MinusCircle size={14} />
                  <span>خصم / جزاء (-)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionType("WITHDRAWAL")}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    actionType === "WITHDRAWAL"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>تسجيل سحب (-)</span>
                </button>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">المبلغ (ج.م)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="مثال: 2500"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2.5 outline-none focus:border-brand-500 font-mono text-sm"
                />
              </div>

              {/* 🟢 حقل رقم الإيصال / المرجع الجديد */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  رقم العملية / المرجع (اختياري - InstaPay Ref / رقم الكاش)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={actionReceiptNo}
                  onChange={(e) => setActionReceiptNo(e.target.value)}
                  placeholder="مثال: 9482019485"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2 outline-none focus:border-brand-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">البيان / سبب العملية</label>
                <textarea
                  rows={2}
                  required
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="مثال: تحويل إنستاباي لمستحقات مهمة الواجهات..."
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2 outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand-600 px-5 py-2.5 font-bold text-white hover:bg-brand-500 cursor-pointer disabled:opacity-50 shadow-xs"
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