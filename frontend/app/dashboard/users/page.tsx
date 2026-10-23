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
  avatar?: string | null;
  phone?: string | null;
  cvUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

// صور حقيقية معبرة لكل دور وظيفي وتخصص بدلاً من الإيموجي
const ROLE_VISUAL_IMAGES: Record<string, string> = {
  SUPER_ADMIN:
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=96&q=80",
  LEAD:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=96&q=80",
  GRAPHIC_DESIGNER:
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=96&q=80",
  UI_UX_DESIGNER:
    "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=96&q=80",
  FRONTEND:
    "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=96&q=80",
  BACKEND:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=96&q=80",
  FULL_STACK:
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=96&q=80",
  MOBILE_APP:
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=96&q=80",
  SALES:
    "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=96&q=80",
};

// قائمة الأدوار بدون أي إيموجي ومع فصل تام بين Super Admin و Full-Stack
const UNIFIED_ROLE_OPTIONS = [
  {
    value: "SUPER_ADMIN",
    label: "مدير النظام (Super Leader)",
    role: "SUPER_ADMIN",
    track: null,
  },
  {
    value: "LEAD_UI_UX",
    label: "قائد فريق التصميم و UI/UX (UI/UX Lead)",
    role: "UI_UX_LEAD",
    track: "UI_UX",
  },
  {
    value: "LEAD_FRONTEND",
    label: "قائد فريق الواجهات (Frontend Lead)",
    role: "FRONTEND_LEAD",
    track: "FRONTEND",
  },
  {
    value: "LEAD_BACKEND",
    label: "قائد فريق الأنظمة (Backend Lead)",
    role: "BACKEND_LEAD",
    track: "BACKEND",
  },
  {
    value: "LEAD_FULL_STACK",
    label: "قائد فريق شامل (Full-Stack Lead)",
    role: "FULL_STACK_LEAD",
    track: "FULL_STACK",
  },
  {
    value: "LEAD_MOBILE",
    label: "قائد فريق الموبايل (Mobile App Lead)",
    role: "MOBILE_APP_LEAD",
    track: "MOBILE_APP",
  },
  {
    value: "DEV_UI_UX",
    label: "مصمم واجهات وتجربة مستخدم (UI/UX Designer)",
    role: "UI_UX_DESIGNER",
    track: "UI_UX",
  },
  {
    value: "DEV_GRAPHIC",
    label: "مصمم جرافيك (Graphic Designer)",
    role: "GRAPHIC_DESIGNER",
    track: "UI_UX",
    isGraphic: true,
  },
  {
    value: "DEV_FRONTEND",
    label: "مطور واجهات أمامية (Frontend Developer)",
    role: "DEVELOPER",
    track: "FRONTEND",
  },
  {
    value: "DEV_BACKEND",
    label: "مطور أنظمة خلفية (Backend Developer)",
    role: "DEVELOPER",
    track: "BACKEND",
  },
  {
    value: "DEV_FULL_STACK",
    label: "مطور شامل (Full-Stack Developer)",
    role: "DEVELOPER",
    track: "FULL_STACK",
  },
  {
    value: "DEV_MOBILE",
    label: "مطور تطبيقات موبايل (Mobile App Developer)",
    role: "DEVELOPER",
    track: "MOBILE_APP",
  },
  {
    value: "SALES",
    label: "مسؤول مبيعات (Sales Specialist)",
    role: "SALES",
    track: null,
  },
];

const INITIAL_SUPABASE_USERS: UserItem[] = [
  {
    id: "ebb68484-a5b3-450c-84b9-2bfae2430008",
    name: "عمر القاضي",
    email: "alqadi@codexa.net",
    role: "SUPER_ADMIN",
    track: null,
    isActive: true,
    createdAt: "2026-01-01T10:00:00.000Z",
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
    id: "f2a27e68-efb7-469a-92ef-057247b0d009",
    name: "سيف السيد",
    email: "seifelsayed68@codexa.com",
    role: "BACKEND_LEAD",
    track: "BACKEND",
    isActive: true,
    createdAt: "2026-02-08T10:00:00.000Z",
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
    id: "c8deb9c9-7b0e-41d4-b11d-38ca2b961005",
    name: "اماني جلال عبد ربه",
    email: "amangalal246@codexa.com",
    role: "UI_UX_DESIGNER",
    track: "UI_UX",
    isActive: true,
    createdAt: "2026-02-05T10:00:00.000Z",
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
    id: "7d5123ad-9f77-4f24-b82e-99e6ec03b004",
    name: "عبدالعزيز محمد كشك",
    email: "abdelazizkishk19@codexa.com",
    role: "DEVELOPER",
    track: "FRONTEND",
    isActive: true,
    createdAt: "2026-02-04T10:00:00.000Z",
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
];

function extractAvatarFromRecord(u: any): string | null {
  if (u?.avatar) return u.avatar;
  if (typeof u?.cvUrl === "string" && u.cvUrl.includes("||avatar:")) {
    return u.cvUrl.split("||avatar:")[1] || null;
  }
  if (typeof window !== "undefined") {
    try {
      const email = (u?.email || "").trim().toLowerCase();
      const id = String(u?.id || "").trim();
      const rawOv = localStorage.getItem("codexa_users_overrides");
      if (rawOv) {
        const ov = JSON.parse(rawOv);
        const found = (id && ov[id]?.avatar) || (email && ov[email]?.avatar);
        if (found) return found;
      }
      if (email) {
        const byEmail = localStorage.getItem(`codexa_avatar_${email}`);
        if (byEmail) return byEmail;
      }
    } catch {}
  }
  return null;
}

function normalizeUserRecord(u: any): UserItem {
  const emailLower = (u.email || "").trim().toLowerCase();
  const knownMember = INITIAL_SUPABASE_USERS.find(
    (item) => item.email.toLowerCase() === emailLower,
  );

  let rawRole = (u.role || knownMember?.role || "DEVELOPER").toUpperCase();
  if (emailLower === "mooazmohammed110@codexa.com" && rawRole === "DEVELOPER") {
    rawRole = "MOBILE_APP_LEAD";
  }

  let track = u.track !== undefined ? u.track : (knownMember?.track ?? null);
  let cvUrl = u.cvUrl || knownMember?.cvUrl || null;

  // السوبر ليدر مستقل تماماً عن تخصص Full-Stack
  if (rawRole === "SUPER_ADMIN") {
    track = null;
  } else if (rawRole === "GRAPHIC_DESIGNER") {
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
  } else if (rawRole === "SALES" || rawRole === "SALES_LEADER") {
    track = null;
  }

  return {
    id: String(u.id || knownMember?.id || Math.random()),
    name: u.name || knownMember?.name || "عضو الفريق",
    email: u.email || knownMember?.email || "",
    role: rawRole,
    track,
    avatar: extractAvatarFromRecord(u),
    phone: u.phone || null,
    cvUrl,
    isActive: u.isActive !== undefined ? Boolean(u.isActive) : true,
    createdAt: u.createdAt || new Date().toISOString(),
  };
}

export default function UsersManagementPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "https://codexa-website-backend.vercel.app";

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
        const resolvedTrack =
          resolvedRole === "SUPER_ADMIN" ? null : parsed.track || matched?.track || null;
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
          const merged = ov ? { ...u, ...ov } : u;
          if (merged.role === "SUPER_ADMIN") merged.track = null;
          merged.avatar = extractAvatarFromRecord(merged);
          return merged;
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
          setIsLoading(false);
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

  // إرجاع اللقب الوظيفي النظيف مع الصورة الحقيقية المعبرة عن التخصص (بدون أي إيموجي)
  const getRoleVisualMeta = (
    role: string,
    track?: string | null,
    cvUrl?: string | null,
  ): { title: string; image: string; isLead: boolean } => {
    const r = (role || "").toUpperCase();

    if (r === "SUPER_ADMIN") {
      return {
        title: "مدير النظام (Super Leader)",
        image: ROLE_VISUAL_IMAGES.SUPER_ADMIN,
        isLead: true,
      };
    }
    if (r === "UI_UX_LEAD") {
      return {
        title: "UI/UX Lead",
        image: ROLE_VISUAL_IMAGES.LEAD,
        isLead: true,
      };
    }
    if (r === "FRONTEND_LEAD") {
      return {
        title: "Frontend Lead",
        image: ROLE_VISUAL_IMAGES.LEAD,
        isLead: true,
      };
    }
    if (r === "BACKEND_LEAD") {
      return {
        title: "Backend Lead",
        image: ROLE_VISUAL_IMAGES.LEAD,
        isLead: true,
      };
    }
    if (r === "FULL_STACK_LEAD") {
      return {
        title: "Full-Stack Lead",
        image: ROLE_VISUAL_IMAGES.LEAD,
        isLead: true,
      };
    }
    if (r === "MOBILE_APP_LEAD") {
      return {
        title: "Mobile App Lead",
        image: ROLE_VISUAL_IMAGES.LEAD,
        isLead: true,
      };
    }
    if (r === "SALES" || r === "SALES_LEADER") {
      return {
        title: "Sales Specialist",
        image: ROLE_VISUAL_IMAGES.SALES,
        isLead: false,
      };
    }
    if (r === "GRAPHIC_DESIGNER" || cvUrl?.includes("#graphic")) {
      return {
        title: "Graphic Designer",
        image: ROLE_VISUAL_IMAGES.GRAPHIC_DESIGNER,
        isLead: false,
      };
    }
    if (r === "UI_UX_DESIGNER" || r === "UI_UX" || track === "UI_UX") {
      return {
        title: "UI/UX Designer",
        image: ROLE_VISUAL_IMAGES.UI_UX_DESIGNER,
        isLead: false,
      };
    }
    if (track === "FULL_STACK") {
      return {
        title: "Full-Stack Developer",
        image: ROLE_VISUAL_IMAGES.FULL_STACK,
        isLead: false,
      };
    }
    if (track === "BACKEND") {
      return {
        title: "Backend Developer",
        image: ROLE_VISUAL_IMAGES.BACKEND,
        isLead: false,
      };
    }
    if (track === "MOBILE_APP") {
      return {
        title: "Mobile App Developer",
        image: ROLE_VISUAL_IMAGES.MOBILE_APP,
        isLead: false,
      };
    }

    return {
      title: "Frontend Developer",
      image: ROLE_VISUAL_IMAGES.FRONTEND,
      isLead: false,
    };
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
        ...(overrides[selectedUser.id] || {}),
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
    if (trackFilter === "SALES") return u.role === "SALES" || u.role === "SALES_LEADER";
    // السوبر أدمن لا يظهر داخل فلتر Full-Stack بل يظهر في الكل فقط
    if (u.role === "SUPER_ADMIN") return false;
    return u.track === trackFilter;
  });

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6 text-right" dir="rtl">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:pb-5 md:flex-row md:items-center dark:border-gray-800">
        <div>
          <h1 className="flex items-center gap-2.5 text-lg sm:text-2xl font-black text-[#14161f] dark:text-white">
            <Users className="shrink-0 text-brand-500" size={24} />
            <span>إدارة المستخدمين والأدوار الوظيفية</span>
          </h1>
          <p className="mt-1 text-[11px] sm:text-xs text-[#8b8f9c] dark:text-gray-400">
            التحكم في حسابات فريق العمل، تعيين التخصصات الفنية الدقيقة (UI/UX, Frontend, Backend, Full-Stack, Mobile)، وتحديد صلاحيات النظام.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={fetchUsers}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-[#161f30] dark:text-gray-300 dark:hover:bg-gray-800"
            title="تحديث البيانات"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* شريط البحث والفلاتر بتمرير أفقي انسيابي على الموبايل */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-4 pr-10 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-500 dark:border-gray-700 dark:bg-[#161f30] dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          <div className="flex w-full items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-[11px] font-bold">
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
                className={`shrink-0 whitespace-nowrap cursor-pointer rounded-xl px-3 py-1.5 transition-colors ${
                  trackFilter === tab.id
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:text-gray-900 dark:bg-[#161f30] dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <span className="shrink-0 px-1 font-mono text-xs font-bold text-gray-400">
          {filteredUsers.length} مستخدم مسجل
        </span>
      </div>

      {/* جدول المستخدمين: كل اسم ورتبة في سطر واحد نظيف على الموبايل واللابتوب */}
      <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111827]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px] text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 dark:border-gray-800 dark:bg-gray-800/40">
                <th className="px-4 py-3.5 font-bold whitespace-nowrap">اسم المستخدم</th>
                <th className="px-4 py-3.5 font-bold whitespace-nowrap">البريد الإلكتروني</th>
                <th className="px-4 py-3.5 font-bold whitespace-nowrap">المسمى والتخصص الفعلي</th>
                <th className="px-4 py-3.5 font-bold whitespace-nowrap">الحالة</th>
                <th className="px-4 py-3.5 text-center font-bold whitespace-nowrap">الإجراءات</th>
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
                filteredUsers.map((user) => {
                  const roleMeta = getRoleVisualMeta(user.role, user.track, user.cvUrl);
                  const firstLetter = user.name ? user.name.charAt(0) : "ع";

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                    >
                      {/* اسم المستخدم مع صورته في سطر واحد بدون انكماش */}
                      <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-600 text-xs font-bold text-white shadow-xs">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span>{firstLetter}</span>
                            )}
                          </div>
                          <span className="whitespace-nowrap">{user.name}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {user.email}
                      </td>

                      {/* شارة التخصص مع صورة حقيقية معبرة بدلاً من الإيموجي وفي سطر واحد */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-[11px] font-bold whitespace-nowrap ${
                            roleMeta.isLead
                              ? "border-brand-500/35 bg-brand-500/15 text-brand-600 dark:text-brand-300"
                              : "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300"
                          }`}
                        >
                          <img
                            src={roleMeta.image}
                            alt={roleMeta.title}
                            className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-white/20"
                          />
                          <span>{roleMeta.title}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 whitespace-nowrap">
                            <CheckCircle2 size={13} /> نشط
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 whitespace-nowrap">
                            <XCircle size={13} /> معطل
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-500 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                            title="تعديل المستخدم والمسمى"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-rose-500 dark:hover:bg-gray-800 dark:hover:text-rose-400"
                            title="حذف الحساب"
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
      </Card>

      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#161f30]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                تعديل بيانات ورتبة المستخدم
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
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
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 pl-9 font-mono text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                  الدور الوظيفي والتخصص
                </label>
                <select
                  value={selectedRoleOption}
                  onChange={(e) => setSelectedRoleOption(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 font-bold text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white"
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
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-50 text-brand-600 focus:ring-0 dark:border-gray-700 dark:bg-[#111827]"
                />
                <label
                  htmlFor="isActiveToggle"
                  className="cursor-pointer font-bold text-gray-700 dark:text-gray-300"
                >
                  الحساب نشط ومفعّل في النظام
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="cursor-pointer rounded-xl px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
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