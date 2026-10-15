"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, CheckCircle2, X, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "مدير نظام (Super Admin)",
  BACKEND_LEAD: "قائد الباك إند (Backend Lead)",
  FRONTEND_LEAD: "قائد الفرونت إند (Frontend Lead)",
  UI_UX_LEAD: "قائد تصميم الواجهات (UI/UX Lead)",
  MOBILE_APP_LEAD: "قائد تطبيقات الموبايل (Mobile App Lead)",
  DEVELOPER: "مطور برمجيات (Developer)",
  SALES: "موظف مبيعات (Sales)",
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300";
    case "BACKEND_LEAD":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300";
    case "FRONTEND_LEAD":
      return "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300";
    case "UI_UX_LEAD":
      return "bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300";
    case "MOBILE_APP_LEAD":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300";
    case "DEVELOPER":
      return "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300";
    case "SALES":
    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";
  }
};

export default function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers || []);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    setUsers(initialUsers || []);
  }, [initialUsers]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("BACKEND_LEAD");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState("SUPER_ADMIN");
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboardRolePermissions");
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return {
      SUPER_ADMIN: { "إدارة المشاريع": true, "إدارة العملاء": true, "حذف بيانات النظام": true, "إدارة المستخدمين": true },
      BACKEND_LEAD: { "إدارة المشاريع": true, "إدارة العملاء": false, "حذف بيانات النظام": false, "إدارة المستخدمين": false },
      FRONTEND_LEAD: { "إدارة المشاريع": true, "إدارة العملاء": false, "حذف بيانات النظام": false, "إدارة المستخدمين": false },
      UI_UX_LEAD: { "إدارة المشاريع": true, "إدارة العملاء": false, "حذف بيانات النظام": false, "إدارة المستخدمين": false },
      MOBILE_APP_LEAD: { "إدارة المشاريع": true, "إدارة العملاء": false, "حذف بيانات النظام": false, "إدارة المستخدمين": false },
      DEVELOPER: { "إدارة المشاريع": false, "إدارة العملاء": false, "حذف بيانات النظام": false, "إدارة المستخدمين": false },
      SALES: { "إدارة المشاريع": false, "إدارة العملاء": true, "حذف بيانات النظام": false, "إدارة المستخدمين": false },
    };
  });

  useEffect(() => {
    localStorage.setItem("dashboardRolePermissions", JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalCount = users.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAddModal = () => {
    setEditingUserId(null);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("BACKEND_LEAD");
    setNewUserPassword("");
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUserId(user.id);
    setNewUserName(user.name);
    setNewUserEmail(user.email);
    setNewUserRole(user.role);
    setNewUserPassword("");
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    try {
      const isEditing = editingUserId !== null;
      const endpoint = isEditing ? `${API_BASE}/admin-users/${editingUserId}` : `${API_BASE}/admin-users`;
      const method = isEditing ? "PUT" : "POST";

      const bodyData: any = {
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole,
      };

      if (newUserPassword.trim()) {
        bodyData.password = newUserPassword.trim();
      }

      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(endpoint, {
        method,
        headers,
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = Array.isArray(errorData.message) 
          ? errorData.message.join(" - ") 
          : (errorData.message || "حدث خطأ أثناء حفظ البيانات");
        alert(msg);
        return;
      }

      setIsModalOpen(false);
      router.refresh();

      const updatedRes = await fetch(`${API_BASE}/admin-users`, { credentials: "include", headers });
      if (updatedRes.ok) {
        const data = await updatedRes.json();
        setUsers(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
      }
    } catch {
      alert("تعذر الاتصال بالسيرفر. تأكد من عمل سيرفر الباك إند على بورت 3001");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (users.length <= 1) {
      alert("يجب أن يبقى مستخدم واحد على الأقل في النظام.");
      return;
    }

    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/admin-users/${id}`, { 
        method: "DELETE",
        headers,
        credentials: "include"
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || "فشل حذف المستخدم");
      }
    } catch {
      alert("فشل حذف المستخدم من الخادم");
    }
  };

  const togglePermission = (permissionName: string) => {
    setRolePermissions((prev) => {
      const currentRolePerms = prev[selectedRoleForEdit] || {};
      return {
        ...prev,
        [selectedRoleForEdit]: {
          ...currentRolePerms,
          [permissionName]: !currentRolePerms[permissionName],
        },
      };
    });
  };

  const currentPermissions = rolePermissions[selectedRoleForEdit] || {};

  return (
    <div className="space-y-8 text-right relative" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#14161f] dark:text-white">المستخدمون</h1>
          <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
            إدارة أعضاء الفريق وتحديد مستويات الوصول الخاصة بهم.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700 cursor-pointer"
        >
          <Plus size={16} />
          إضافة مستخدم +
        </button>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs dark:border-gray-800 dark:bg-[#111827]">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 font-semibold text-[#8b8f9c] dark:border-gray-800">
                <th className="py-4 px-6">المستخدم</th>
                <th className="py-4 px-6">الدور</th>
                <th className="py-4 px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400">لا يوجد مستخدمون مسجلون حالياً</td>
                </tr>
              ) : (
                currentUsers.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600 font-bold dark:bg-brand-900/30 dark:text-brand-400">
                          {u.name ? u.name.charAt(0) : "U"}
                        </div>
                        <div>
                          <div className="font-bold text-[#14161f] dark:text-white">{u.name}</div>
                          <div className="text-[11px] text-gray-400 font-mono" dir="ltr">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold font-sans">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${getRoleBadgeColor(u.role)}`}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="text-gray-400 transition-colors hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer p-1"
                          title="تعديل المستخدم"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-gray-400 transition-colors hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer p-1"
                          title="حذف المستخدم"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 p-6 text-xs font-semibold text-gray-400 dark:border-gray-800">
          <span>
            عرض <span className="font-sans">{totalCount === 0 ? 0 : startIndex + 1}</span> - <span className="font-sans">{Math.min(startIndex + itemsPerPage, totalCount)}</span> من <span className="font-sans">{totalCount}</span> إجمالي
          </span>
          <div className="flex items-center gap-2" dir="ltr">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
            >
              السابق
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg font-sans text-xs font-bold cursor-pointer ${
                  currentPage === n
                    ? "bg-brand-600 text-white shadow-sm"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalCount === 0}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
            >
              التالي
            </button>
          </div>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#111827] border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {editingUserId !== null ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">اسم المستخدم</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد محمد"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-right outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  placeholder="user@codexa.net"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-right outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  كلمة المرور {editingUserId !== null && <span className="text-[10px] text-gray-400 font-normal">(اتركه فارغاً للحفاظ على القديمة)</span>}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required={editingUserId === null}
                    dir="ltr"
                    placeholder="••••••••"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 ps-10 pe-4 text-xs text-left outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">الدور الوظيفي</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-right outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white cursor-pointer"
                >
                  <option value="SUPER_ADMIN">مدير نظام (Super Admin)</option>
                  <option value="BACKEND_LEAD">قائد الباك إند (Backend Lead)</option>
                  <option value="FRONTEND_LEAD">قائد الفرونت إند (Frontend Lead)</option>
                  <option value="UI_UX_LEAD">قائد تصميم الواجهات (UI/UX Lead)</option>
                  <option value="MOBILE_APP_LEAD">قائد تطبيقات الموبايل (Mobile App Lead)</option>
                  <option value="DEVELOPER">مطور برمجيات (Developer)</option>
                  <option value="SALES">موظف مبيعات (Sales)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-6 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-700 cursor-pointer"
                >
                  {editingUserId !== null ? "حفظ التعديلات" : "حفظ وإضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* قسم الأدوار والصلاحيات */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-[#14161f] dark:text-white">الأدوار والصلاحيات</h2>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
              حفظ تلقائي مفعل ✨
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">اختر الدور للتعديل:</span>
            <select
              value={selectedRoleForEdit}
              onChange={(e) => setSelectedRoleForEdit(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white cursor-pointer"
            >
              <option value="SUPER_ADMIN">مدير نظام (Super Admin)</option>
              <option value="BACKEND_LEAD">قائد الباك إند (Backend Lead)</option>
              <option value="FRONTEND_LEAD">قائد الفرونت إند (Frontend Lead)</option>
              <option value="UI_UX_LEAD">قائد تصميم الواجهات (UI/UX Lead)</option>
              <option value="MOBILE_APP_LEAD">قائد تطبيقات الموبايل (Mobile App Lead)</option>
              <option value="DEVELOPER">مطور برمجيات (Developer)</option>
              <option value="SALES">موظف مبيعات (Sales)</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
            الصلاحيات الخاصة بدور: <span className="text-brand-600 dark:text-brand-400">{ROLE_LABELS[selectedRoleForEdit]}</span> (اضغط على الصلاحية لمنحها أو سحبها)
          </p>

          {[
            "إدارة المشاريع",
            "إدارة العملاء",
            "حذف بيانات النظام",
            "إدارة المستخدمين"
          ].map((permissionName, index) => {
            const isGranted = !!currentPermissions[permissionName];
            return (
              <div
                key={index}
                onClick={() => togglePermission(permissionName)}
                className={`flex items-center justify-between rounded-xl p-4 shadow-xs border transition-all cursor-pointer ${
                  isGranted
                    ? "bg-white border-brand-200 dark:border-brand-900/50 dark:bg-[#111827]"
                    : "bg-gray-50/50 border-gray-100 dark:bg-gray-900/20 dark:border-gray-800 opacity-60"
                }`}
              >
                <span className="text-sm font-semibold text-[#14161f] dark:text-white">{permissionName}</span>
                
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold ${isGranted ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
                    {isGranted ? "مسموح" : "ممنوع"}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isGranted ? "bg-emerald-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-transparent"
                  }`}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}