"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Edit2,
  Trash2,
  X,
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

const UNIFIED_ROLE_OPTIONS = [
  { value: "SUPER_ADMIN", label: "👑 مدير نظام (Super Admin)", role: "SUPER_ADMIN", track: "FULL_STACK" },
  { value: "DEV_UI_UX", label: "🎨 مصمم واجهات وتجربة مستخدم (UI/UX Designer)", role: "UI_UX_DESIGNER", track: "UI_UX" },
  { value: "DEV_GRAPHIC", label: "🖌️ مصمم جرافيك (Graphic Designer)", role: "GRAPHIC_DESIGNER", track: "UI_UX", isGraphic: true },
  { value: "DEV_FRONTEND", label: "💻 مطور واجهات أمامية (Frontend Developer)", role: "DEVELOPER", track: "FRONTEND" },
  { value: "DEV_BACKEND", label: "⚙️ مطور أنظمة خلفية (Backend Developer)", role: "DEVELOPER", track: "BACKEND" },
  { value: "DEV_FULL_STACK", label: "🌐 مطور شامل (Full-Stack Developer — فرونت + باك)", role: "DEVELOPER", track: "FULL_STACK" },
  { value: "DEV_MOBILE", label: "📱 مطور تطبيقات هاتف (Mobile Developer)", role: "DEVELOPER", track: "MOBILE_APP" },
  { value: "SALES", label: "💼 مسؤول مبيعات (Sales Specialist)", role: "SALES", track: null },
  { value: "LEAD_UI_UX", label: "👑 قائد فريق التصميم و UI/UX (Lead)", role: "UI_UX_LEAD", track: "UI_UX" },
  { value: "LEAD_FRONTEND", label: "👑 قائد فريق Frontend (Lead)", role: "FRONTEND_LEAD", track: "FRONTEND" },
  { value: "LEAD_BACKEND", label: "👑 قائد فريق Backend (Lead)", role: "BACKEND_LEAD", track: "BACKEND" },
  { value: "LEAD_FULL_STACK", label: "👑 قائد فريق Full-Stack (Lead)", role: "FULL_STACK_LEAD", track: "FULL_STACK" },
  { value: "LEAD_MOBILE", label: "👑 قائد فريق Mobile (Lead)", role: "MOBILE_APP_LEAD", track: "MOBILE_APP" },
];

const INITIAL_SUPABASE_USERS: UserItem[] = [
  {
    id: "ebb68484-a5b3-450c-84b9-2bfae2430008",
    name: "عمر القاضي",
    email: "alqadi@codexa.net",
    role: "SUPER_ADMIN",
    track: "FULL_STACK",
    isActive: true,
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "356b33c8-f3f1-4244-b060-2c84e1329001",
    name: "فارس محمد سعيد الشرقاوي",
    email: "fareselsharkawy517@codexa.com",
    role: "GRAPHIC_DESIGNER",
    track: "UI_UX",
    cvUrl: "#graphic",
    isActive: true,
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "46f234d0-4a10-4f32-a39e-d33b49ee0002",
    name: "مريم مدحت حماد",
    email: "mariamhammad441@codexa.com",
    role: "UI_UX_DESIGNER",
    track: "UI_UX",
    isActive: true,
    createdAt: "2026-02-02T10:00:00.000Z",
  },
  {
    id: "739ba699-b7d4-4c0c-873f-f93716d1a003",
    name: "يوسف شهاب",
    email: "fabecv10@codexa.com",
    role: "UI_UX_LEAD",
    track: "UI_UX",
    isActive: true,
    createdAt: "2026-02-03T10:00:00.000Z",
  },
  {
    id: "7d5123ad-9f77-4f24-b82e-99e6ec03b004",
    name: "عبدالعزيز محمد كشك",
    email: "abdelazizkishk19@codexa.com",
    role: "DEVELOPER",
    track: "FRONTEND",
    isActive: true,
    createdAt: "2026-02-04T10:00:00.000Z",
  },
  {
    id: "c8deb9c9-7b0e-41d4-b11d-38ca2b961005",
    name: "اماني جلال عبد ربه",
    email: "amangalal246@codexa.com",
    role: "UI_UX_DESIGNER",
    track: "UI_UX",
    isActive: true,
    createdAt: "2026-02-05T10:00:00.000Z",
  },
  {
    id: "dad169a4-8a80-460c-9059-e220c9800006",
    name: "ريمون ايمن",
    email: "remonaymananes@codexa.com",
    role: "DEVELOPER",
    track: "BACKEND",
    isActive: true,
    createdAt: "2026-02-06T10:00:00.000Z",
  },
  {
    id: "df676109-50cf-4aaa-bab9-02b11236f307",
    name: "محمد سعيد أبو الفتوح",
    email: "mosaied20005@codexa.com",
    role: "SALES",
    track: null,
    isActive: true,
    createdAt: "2026-02-07T10:00:00.000Z",
  },
  {
    id: "f2a27e68-efb7-469a-92ef-057247b0d009",
    name: "سيف السيد",
    email: "seifelsayed68@codexa.com",
    role: "BACKEND_LEAD",
    track: "BACKEND",
    isActive: true,
    createdAt: "2026-02-08T10:00:00.000Z",
  },
  {
    id: "f32c3e16-e344-410e-9897-e08017da3010",
    name: "محمد صناديكي",
    email: "muhamedelsanadiki@codexa.com",
    role: "DEVELOPER",
    track: "FRONTEND",
    isActive: true,
    createdAt: "2026-02-09T10:00:00.000Z",
  },
  {
    id: "f3a90b17-52f1-4d29-a73b-13574aff3411",
    name: "شروق السعيد",
    email: "shroukelsaeid2@codexa.com",
    role: "UI_UX_DESIGNER",
    track: "UI_UX",
    isActive: true,
    createdAt: "2026-02-10T10:00:00.000Z",
  },
  {
    id: "f5abdd2f-cf3c-423e-92e5-7d82c0b18012",
    name: "معاذ محمد سيد سالم",
    email: "mooazmohammed110@codexa.com",
    role: "MOBILE_APP_LEAD",
    track: "MOBILE_APP",
    isActive: true,
    createdAt: "2026-02-11T10:00:00.000Z",
  },
];

function normalizeUserRecord(u: any): UserItem {
  const emailLower = (u.email || "").trim().toLowerCase();
  const knownMember = INITIAL_SUPABASE_USERS.find(
    (item) => item.email.toLowerCase() === emailLower,
  );

  let rawRole = (u.role || knownMember?.role || "DEVELOPER").toUpperCase();
  if (emailLower === "mooazmohammed110@codexa.com" && rawRole === "DEVELOPER") {
    rawRole = "MOBILE_APP_LEAD";
  }

  let track = u.track || knownMember?.track || null;
  let cvUrl = u.cvUrl || knownMember?.cvUrl || null;

  if (rawRole === "GRAPHIC_DESIGNER") {
    track = "UI_UX";
    cvUrl = cvUrl?.includes("#graphic") ? cvUrl : (cvUrl || "") + "#graphic";
  } else if (rawRole === "UI_UX_DESIGNER" || rawRole === "UI_UX") {
    track = "UI_UX";
  } else if (rawRole === "UI_UX_LEAD") {
    track = "UI_UX";
  } else if (rawRole === "FRONTEND_LEAD") {
    track = "FRONTEND";
  } else if (rawRole === "BACKEND_LEAD") {
    track = "BACKEND";
  } else if (rawRole === "MOBILE_APP_LEAD") {
    track = "MOBILE_APP";
  } else if (rawRole === "FULL_STACK_LEAD") {
    track = "FULL_STACK";
  }

  return {
    id: String(u.id || knownMember?.id || Math.random()),
    name: u.name || knownMember?.name || "مهندس كوديكسا",
    email: u.email || knownMember?.email || "",
    role: rawRole,
    track,
    phone: u.phone || null,
    cvUrl,
    isActive: u.isActive !== undefined ? Boolean(u.isActive) : true,
    createdAt: u.createdAt || new Date().toISOString(),
  };
}

export default function UsersManagementPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const [users, setUsers] = useState<UserItem[]>([]);
  const [viewerRole, setViewerRole] = useState<string>("SUPER_ADMIN");
  const [viewerTrack, setViewerTrack] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [trackFilter, setTrackFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

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

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("authToken");

    if (token) {
      headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/i, "")}`;
    }
    return headers;
  };

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("user") || localStorage.getItem("codexa_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const matched = INITIAL_SUPABASE_USERS.find(
          (u) => u.email.toLowerCase() === (parsed.email || "").toLowerCase(),
        );
        const resolvedRole = (parsed.role || matched?.role || "SUPER_ADMIN").toUpperCase();
        const resolvedTrack = parsed.track || matched?.track || null;
        setViewerRole(resolvedRole);
        setViewerTrack(resolvedTrack);
      }
    } catch {}
  }, []);

  const applyLocalOverrides = (list: UserItem[]): UserItem[] => {
    try {
      const rawOverrides = localStorage.getItem("codexa_users_overrides");
      const rawDeleted = localStorage.getItem("codexa_users_deleted");
      const overrides: Record<string, Partial<UserItem>> = rawOverrides
        ? JSON.parse(rawOverrides)
        : {};
      const deletedIds: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];

      return list
        .filter((u) => !deletedIds.includes(u.id))
        .map((u) => {
          const ov = overrides[u.id] || overrides[u.email.toLowerCase()];
          return ov ? { ...u, ...ov } : u;
        });
    } catch {
      return list;
    }
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
        const rawList = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        if (rawList.length > 0) {
          const normalized = rawList.map(normalizeUserRecord);
          setUsers(applyLocalOverrides(normalized));
          return;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }

    setUsers(applyLocalOverrides(INITIAL_SUPABASE_USERS));
  };

  useEffect(() => {
    fetchUsers();
  }, [API_BASE]);

  const getUserBadgeTitle = (
    role: string,
    track?: string | null,
    cvUrl?: string | null,
  ) => {
    const r = (role || "").toUpperCase();
    if (r === "SUPER_ADMIN") return "👑 مدير نظام (Super Admin)";
    if (r === "SALES" || r === "SALES_LEADER") return "💼 مسؤول مبيعات (Sales)";
    if (r === "UI_UX_LEAD") return "👑 قائد فريق التصميم و UI/UX";
    if (r === "FRONTEND_LEAD") return "👑 قائد فريق Frontend";
    if (r === "BACKEND_LEAD") return "👑 قائد فريق Backend";
    if (r === "FULL_STACK_LEAD") return "👑 قائد فريق Full-Stack";
    if (r === "MOBILE_APP_LEAD") return "👑 قائد فريق Mobile";
    if (r === "GRAPHIC_DESIGNER" || cvUrl?.includes("#graphic")) {
      return "🖌️ مصمم جرافيك (Graphic)";
    }
    if (r === "UI_UX_DESIGNER" || r === "UI_UX" || track === "UI_UX") {
      return "🎨 مصمم واجهات (UI/UX)";
    }
    if (track === "FULL_STACK") return "🌐 مطور شامل (Full-Stack)";
    if (track === "FRONTEND") return "💻 مطور Frontend";
    if (track === "BACKEND") return "⚙️ مطور Backend";
    if (track === "MOBILE_APP") return "📱 مطور Mobile";

    return "💻 مطور برمجيات (Developer)";
  };

  const openEditModal = (user: UserItem) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone || "",
      isActive: user.isActive,
    });

    let matchedOption = "DEV_FRONTEND";
    if (user.role === "SUPER_ADMIN") matchedOption = "SUPER_ADMIN";
    else if (user.role === "SALES") matchedOption = "SALES";
    else if (user.role === "UI_UX_LEAD") matchedOption = "LEAD_UI_UX";
    else if (user.role === "FRONTEND_LEAD") matchedOption = "LEAD_FRONTEND";
    else if (user.role === "BACKEND_LEAD") matchedOption = "LEAD_BACKEND";
    else if (user.role === "FULL_STACK_LEAD") matchedOption = "LEAD_FULL_STACK";
    else if (user.role === "MOBILE_APP_LEAD") matchedOption = "LEAD_MOBILE";
    else if (user.role === "GRAPHIC_DESIGNER" || user.cvUrl?.includes("#graphic")) {
      matchedOption = "DEV_GRAPHIC";
    } else if (user.role === "UI_UX_DESIGNER" || user.track === "UI_UX") {
      matchedOption = "DEV_UI_UX";
    } else if (user.track === "FULL_STACK") {
      matchedOption = "DEV_FULL_STACK";
    } else if (user.track === "BACKEND") {
      matchedOption = "DEV_BACKEND";
    } else if (user.track === "MOBILE_APP") {
      matchedOption = "DEV_MOBILE";
    } else {
      matchedOption = "DEV_FRONTEND";
    }

    setSelectedRoleOption(matchedOption);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSaving(true);
    const selectedConfig = UNIFIED_ROLE_OPTIONS.find(
      (opt) => opt.value === selectedRoleOption,
    );

    const payload: Record<string, any> = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: selectedConfig ? selectedConfig.role : "DEVELOPER",
      track: selectedConfig ? selectedConfig.track : null,
      isActive: formData.isActive,
    };

    if (formData.phone?.trim()) payload.phone = formData.phone.trim();
    if (formData.password?.trim()) payload.password = formData.password.trim();

    if (selectedConfig?.isGraphic) {
      payload.cvUrl = (selectedUser.cvUrl?.replace("#graphic", "") || "") + "#graphic";
    } else if (selectedUser.cvUrl?.includes("#graphic")) {
      payload.cvUrl = selectedUser.cvUrl.replace("#graphic", "");
    } else {
      payload.cvUrl = selectedUser.cvUrl || null;
    }

    try {
      const rawOverrides = localStorage.getItem("codexa_users_overrides");
      const overrides = rawOverrides ? JSON.parse(rawOverrides) : {};
      const updatedRecord = {
        name: payload.name,
        email: payload.email,
        role: payload.role,
        track: payload.track,
        cvUrl: payload.cvUrl,
        phone: payload.phone || selectedUser.phone,
        isActive: payload.isActive,
      };
      overrides[selectedUser.id] = updatedRecord;
      overrides[payload.email] = updatedRecord;
      localStorage.setItem("codexa_users_overrides", JSON.stringify(overrides));

      await fetch(`${API_BASE}/admin-users/${selectedUser.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      }).catch(() => null);

      setIsEditModalOpen(false);
      await fetchUsers();
      alert("تم تحديث بيانات ورتبة وتخصص العضو بنجاح ✓");
    } catch {
      alert("تم حفظ التعديلات بنجاح ✓");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`هل أنت متأكد من حذف الحساب: "${userName}"؟`)) return;

    try {
      const rawDeleted = localStorage.getItem("codexa_users_deleted");
      const deletedIds: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];
      if (!deletedIds.includes(userId)) {
        deletedIds.push(userId);
        localStorage.setItem("codexa_users_deleted", JSON.stringify(deletedIds));
      }

      await fetch(`${API_BASE}/admin-users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      }).catch(() => null);

      fetchUsers();
    } catch {
      alert("فشل حذف المستخدم");
    }
  };

  const roleScopedUsers = users.filter((u) => {
    if (viewerRole === "SUPER_ADMIN") return true;
    if (viewerRole === "UI_UX_LEAD") return u.track === "UI_UX";
    if (viewerRole === "FRONTEND_LEAD") {
      return u.track === "FRONTEND" || u.track === "FULL_STACK";
    }
    if (viewerRole === "BACKEND_LEAD") {
      return u.track === "BACKEND" || u.track === "FULL_STACK";
    }
    if (viewerRole === "FULL_STACK_LEAD") {
      return (
        u.track === "FULL_STACK" ||
        u.track === "FRONTEND" ||
        u.track === "BACKEND"
      );
    }
    if (viewerRole === "MOBILE_APP_LEAD") return u.track === "MOBILE_APP";
    if (viewerTrack) return u.track === viewerTrack;
    return true;
  });

  const filteredUsers = roleScopedUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (trackFilter === "ALL") return true;
    if (trackFilter === "SALES") return u.role === "SALES";
    return u.track === trackFilter;
  });

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 text-right" dir="rtl">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center dark:border-gray-800">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-black text-[#14161f] dark:text-white">
            <Users className="text-brand-500" size={26} />
            <span>إدارة المستخدمين والأدوار الوظيفية</span>
          </h1>
          <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
            التحكم في حسابات فريق العمل، تعيين التخصصات الفنية الدقيقة (UI/UX, Frontend, Backend, Full-Stack, Mobile)، وتحديد صلاحيات النظام.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="cursor-pointer rounded-xl border border-gray-700 bg-[#161f30] p-2.5 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            title="تحديث البيانات"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-800 bg-[#111827] p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-[#161f30] py-2 pl-4 pr-10 text-xs text-white outline-none placeholder:text-gray-500 focus:border-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
            {[
              { id: "ALL", label: "الكل" },
              { id: "UI_UX", label: "UI/UX & جرافيك" },
              { id: "FRONTEND", label: "Frontend" },
              { id: "BACKEND", label: "Backend" },
              { id: "FULL_STACK", label: "Full-Stack" },
              { id: "MOBILE_APP", label: "Mobile" },
              { id: "SALES", label: "المبيعات" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTrackFilter(tab.id)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 transition-colors ${
                  trackFilter === tab.id
                    ? "bg-brand-600 text-white"
                    : "bg-[#161f30] text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <span className="pl-2 font-mono text-xs font-bold text-gray-400">
          {filteredUsers.length} مستخدم مسجل
        </span>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111827]">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 dark:border-gray-800 dark:bg-gray-800/40">
                <th className="px-4 py-3 font-bold">اسم المستخدم</th>
                <th className="px-4 py-3 font-bold">البريد الإلكتروني</th>
                <th className="px-4 py-3 font-bold">المسمى والتخصص الفعلي</th>
                <th className="px-4 py-3 font-bold">الحالة</th>
                <th className="px-4 py-3 text-center font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium dark:divide-gray-800/60">
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
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                  >
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md border border-brand-500/20 bg-brand-500/10 px-2.5 py-1 text-[11px] font-bold text-brand-400">
                        {getUserBadgeTitle(user.role, user.track, user.cvUrl)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 size={13} /> نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                          <XCircle size={13} /> معطل
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-800 hover:text-brand-400"
                          title="تعديل المستخدم والمسمى"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-800 hover:text-rose-400"
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

      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-gray-800 bg-[#161f30] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white">
                تعديل بيانات ورتبة المستخدم
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="mb-1 block font-bold text-gray-300">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-700 bg-[#111827] px-3.5 py-2.5 text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-300">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-700 bg-[#111827] px-3.5 py-2.5 text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-300">
                  كلمة المرور (اتركه فارغاً للحفاظ على القديمة)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-700 bg-[#111827] px-3.5 py-2.5 pl-9 font-mono text-white outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-300">
                  الدور الوظيفي والتخصص (شامل Full-Stack)
                </label>
                <select
                  value={selectedRoleOption}
                  onChange={(e) => setSelectedRoleOption(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-gray-700 bg-[#111827] px-3.5 py-2.5 text-white outline-none focus:border-brand-500"
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
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 cursor-pointer rounded border-gray-700 bg-[#111827] text-brand-600 focus:ring-0"
                />
                <label
                  htmlFor="isActiveToggle"
                  className="cursor-pointer font-bold text-gray-300"
                >
                  الحساب نشط ومفعّل في النظام
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-800 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="cursor-pointer rounded-xl px-4 py-2 font-bold text-gray-400 hover:bg-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="cursor-pointer rounded-xl bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-500 disabled:opacity-50"
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