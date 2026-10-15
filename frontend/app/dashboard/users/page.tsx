"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  X,
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  track?: string | null;
  phone?: string | null;
  cvUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

// 🟢 القائمة الموحدة والدقيقة للأدوار والتخصصات (مطابقة لصفحة الفريق + السوبر أدمن)
const UNIFIED_ROLE_OPTIONS = [
  { value: "SUPER_ADMIN", label: "👑 مدير نظام (Super Admin)", role: "SUPER_ADMIN", track: null },
  { value: "DEV_UI_UX", label: "🎨 مصمم واجهات وتجربة مستخدم (UI/UX Designer)", role: "DEVELOPER", track: "UI_UX" },
  { value: "DEV_GRAPHIC", label: "🖌️ مصمم جرافيك (Graphic Designer)", role: "DEVELOPER", track: "UI_UX", isGraphic: true },
  { value: "DEV_FRONTEND", label: "💻 مطور واجهات أمامية (Frontend Developer)", role: "DEVELOPER", track: "FRONTEND" },
  { value: "DEV_BACKEND", label: "⚙️ مطور أنظمة خلفية (Backend Developer)", role: "DEVELOPER", track: "BACKEND" },
  { value: "DEV_MOBILE", label: "📱 مطور تطبيقات هاتف (Mobile Developer)", role: "DEVELOPER", track: "MOBILE_APP" },
  { value: "SALES", label: "💼 مسؤول مبيعات (Sales Specialist)", role: "SALES", track: null },
  { value: "LEAD_UI_UX", label: "👑 قائد فريق التصميم و UI/UX (Lead)", role: "UI_UX_LEAD", track: "UI_UX" },
  { value: "LEAD_FRONTEND", label: "👑 قائد فريق Frontend (Lead)", role: "FRONTEND_LEAD", track: "FRONTEND" },
  { value: "LEAD_BACKEND", label: "👑 قائد فريق Backend (Lead)", role: "BACKEND_LEAD", track: "BACKEND" },
  { value: "LEAD_MOBILE", label: "👑 قائد فريق Mobile (Lead)", role: "MOBILE_APP_LEAD", track: "MOBILE_APP" },
];

export default function UsersManagementPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Form states
  const [selectedRoleOption, setSelectedRoleOption] = useState<string>("DEV_FRONTEND");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    isActive: true,
  });

  const getAuthHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window === "undefined") return headers;

    let token = 
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("admin_token") ||
      localStorage.getItem("authToken");

    if (token) {
      headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/i, "")}`;
    }
    return headers;
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-users`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [API_BASE]);

  // استخراج المسمى الوظيفي الدقيق لكل مستخدم في الجدول
  const getUserBadgeTitle = (role: string, track?: string | null, cvUrl?: string | null) => {
    if (role === "SUPER_ADMIN") return "مدير نظام (Super Admin)";
    if (role === "SALES") return "مسؤول مبيعات (Sales)";
    if (role === "UI_UX_LEAD") return "قائد فريق التصميم و UI/UX";
    if (role === "FRONTEND_LEAD") return "قائد فريق Frontend";
    if (role === "BACKEND_LEAD") return "قائد فريق Backend";
    if (role === "MOBILE_APP_LEAD") return "قائد فريق Mobile";

    if (track === "UI_UX") {
      if (cvUrl?.includes("#graphic")) return "مصمم جرافيك (Graphic)";
      return "مصمم واجهات (UI/UX)";
    }
    if (track === "FRONTEND") return "مطور Frontend";
    if (track === "BACKEND") return "مطور Backend";
    if (track === "MOBILE_APP") return "مطور Mobile";

    return "عضو فريق";
  };

  // فتح مودال التعديل وضبط الخيار المختار في القائمة المنسدلة تلقائياً
  const openEditModal = (user: UserItem) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone || "",
      isActive: user.isActive,
    });

    // استنتاج الخيار المطابق من بين الأدوار والتخصصات
    let matchedOption = "DEV_FRONTEND";
    if (user.role === "SUPER_ADMIN") matchedOption = "SUPER_ADMIN";
    else if (user.role === "SALES") matchedOption = "SALES";
    else if (user.role === "UI_UX_LEAD") matchedOption = "LEAD_UI_UX";
    else if (user.role === "FRONTEND_LEAD") matchedOption = "LEAD_FRONTEND";
    else if (user.role === "BACKEND_LEAD") matchedOption = "LEAD_BACKEND";
    else if (user.role === "MOBILE_APP_LEAD") matchedOption = "LEAD_MOBILE";
    else if (user.role === "DEVELOPER") {
      if (user.track === "UI_UX") {
        matchedOption = user.cvUrl?.includes("#graphic") ? "DEV_GRAPHIC" : "DEV_UI_UX";
      } else if (user.track === "BACKEND") matchedOption = "DEV_BACKEND";
      else if (user.track === "MOBILE_APP") matchedOption = "DEV_MOBILE";
      else matchedOption = "DEV_FRONTEND";
    }

    setSelectedRoleOption(matchedOption);
    setIsEditModalOpen(true);
  };

  // 🟢 حفظ التعديلات وإرسال الدور والتخصص لقاعدة البيانات معاً
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSaving(true);
    const selectedConfig = UNIFIED_ROLE_OPTIONS.find((opt) => opt.value === selectedRoleOption);

    const payload: Record<string, any> = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: selectedConfig ? selectedConfig.role : "DEVELOPER",
      track: selectedConfig ? selectedConfig.track : null, // تحديث الـ track في الداتابيز
      isActive: formData.isActive,
    };

    if (formData.phone?.trim()) payload.phone = formData.phone.trim();
    if (formData.password?.trim()) payload.password = formData.password.trim();

    // الحفاظ على وسم مصمم الجرافيك
    if (selectedConfig?.isGraphic) {
      payload.cvUrl = (selectedUser.cvUrl?.replace("#graphic", "") || "") + "#graphic";
    } else if (selectedUser.cvUrl?.includes("#graphic")) {
      payload.cvUrl = selectedUser.cvUrl.replace("#graphic", "");
    }

    try {
      const res = await fetch(`${API_BASE}/admin-users/${selectedUser.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchUsers();
        alert("تم تحديث بيانات ورتبة وتخصص المستخدم بنجاح في قاعدة البيانات ✓");
      } else {
        const data = await res.json();
        alert(Array.isArray(data.message) ? data.message.join("\n") : (data.message || "فشل التحديث"));
      }
    } catch {
      alert("خطأ في الاتصال بالسيرفر");
    } finally {
      setIsSaving(false);
    }
  };

  // حذف مستخدم
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`هل أنت متأكد من حذف الحساب: "${userName}"؟`)) return;

    try {
      const res = await fetch(`${API_BASE}/admin-users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.message || "فشل حذف المستخدم");
      }
    } catch {
      alert("فشل حذف المستخدم");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-right max-w-[1600px] mx-auto" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#14161f] dark:text-white flex items-center gap-2.5">
            <Users className="text-brand-500" size={26} />
            <span>إدارة المستخدمين والأدوار الوظيفية</span>
          </h1>
          <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
            التحكم في حسابات فريق العمل، تعيين التخصصات الفنية الدقيقة، وتحديد صلاحيات النظام.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2.5 bg-[#161f30] hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl border border-gray-700 transition-colors cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* شريط البحث */}
      <div className="flex items-center justify-between gap-4 bg-[#111827] p-3 rounded-2xl border border-gray-800">
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="بحث بالاسم أو البريد الإلكتروني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161f30] border border-gray-700 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-brand-500"
          />
        </div>
        <span className="text-xs font-bold text-gray-400 font-mono pl-2">
          {filteredUsers.length} مستخدم مسجل
        </span>
      </div>

      {/* جدول المستخدمين */}
      <Card className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-gray-400">
                <th className="py-3 px-4 font-bold">اسم المستخدم</th>
                <th className="py-3 px-4 font-bold">البريد الإلكتروني</th>
                <th className="py-3 px-4 font-bold">المسمى والتخصص الفعلي</th>
                <th className="py-3 px-4 font-bold">الحالة</th>
                <th className="py-3 px-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    جاري تحميل المستخدمين...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    لا يوجد مستخدمون مطابقون لبحثك
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-mono">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                        {getUserBadgeTitle(user.role, user.track, user.cvUrl)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                          <CheckCircle2 size={13} /> نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[11px]">
                          <XCircle size={13} /> معطل
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-gray-400 hover:text-brand-400 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                          title="تعديل المستخدم والمسمى"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                          title="حذف الحساب"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 🟢 مودال تعديل بيانات المستخدم مع القائمة الموحدة والدقيقة */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#161f30] p-6 shadow-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-base font-bold text-white">تعديل بيانات ورتبة المستخدم</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-300 mb-1">اسم المستخدم</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-[#111827] px-3.5 py-2.5 text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-[#111827] px-3.5 py-2.5 text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">
                  كلمة المرور (اتركه فارغاً للحفاظ على القديمة)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-700 bg-[#111827] px-3.5 py-2.5 pl-9 text-white outline-none focus:border-brand-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* 🟢 القائمة المنسدلة الدقيقة المطابقة لصفحة الفريق */}
              <div>
                <label className="block font-bold text-gray-300 mb-1">الدور الوظيفي والتخصص</label>
                <select
                  value={selectedRoleOption}
                  onChange={(e) => setSelectedRoleOption(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-[#111827] px-3.5 py-2.5 text-white outline-none focus:border-brand-500 cursor-pointer"
                >
                  {UNIFIED_ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-700 bg-[#111827] text-brand-600 focus:ring-0 cursor-pointer h-4 w-4"
                />
                <label htmlFor="isActiveToggle" className="text-gray-300 font-bold cursor-pointer">
                  الحساب نشط ومفعّل في النظام
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-bold text-gray-400 hover:bg-gray-800 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-500 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}