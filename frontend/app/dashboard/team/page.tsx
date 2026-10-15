"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit2, 
  PlusCircle, 
  X, 
  FileText, 
  Upload, 
  MessageCircle, 
  Eye, 
  Layers, 
  RefreshCw, 
  Loader2, 
  CreditCard, 
  Copy, 
  Check,
  UserMinus
} from "lucide-react";

interface AssignedStage {
  id: string;
  title: string;
  progress: number;
  isUnderReview: boolean;
  isApproved: boolean;
  reward: number;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  track?: string | null;
  technologies: string[];
  phone?: string | null;
  cvUrl?: string | null;
  instaPay?: string | null;
  walletNumber?: string | null;
  walletBalance?: number;
  assignedStages?: AssignedStage[];
}

const ALL_TRACK_CONFIG = [
  { key: "ALL", label: "جميع الفرق", leadRole: "" },
  { key: "UI_UX", label: "فريق التصميم و UI/UX", leadRole: "UI_UX_LEAD" },
  { key: "BACKEND", label: "فريق Backend", leadRole: "BACKEND_LEAD" },
  { key: "FRONTEND", label: "فريق Frontend", leadRole: "FRONTEND_LEAD" },
  { key: "MOBILE_APP", label: "فريق Mobile App", leadRole: "MOBILE_APP_LEAD" },
  { key: "SALES", label: "فريق المبيعات (Sales)", leadRole: "SALES_LEADER" },
];

const ROLE_OPTIONS = [
  { value: "DEV_UI_UX", label: "🎨 مصمم واجهات وتجربة مستخدم (UI/UX Designer)", role: "UI_UX_DESIGNER", track: "UI_UX", isGraphic: false },
  { value: "DEV_GRAPHIC", label: "🖌️ مصمم جرافيك (Graphic Designer)", role: "GRAPHIC_DESIGNER", track: "UI_UX", isGraphic: true },
  { value: "DEV_FRONTEND", label: "💻 مطور واجهات أمامية (Frontend Developer)", role: "DEVELOPER", track: "FRONTEND", isGraphic: false },
  { value: "DEV_BACKEND", label: "⚙️ مطور أنظمة خلفية (Backend Developer)", role: "DEVELOPER", track: "BACKEND", isGraphic: false },
  { value: "DEV_MOBILE", label: "📱 مطور تطبيقات هاتف (Mobile Developer)", role: "DEVELOPER", track: "MOBILE_APP", isGraphic: false },
  { value: "SALES_MEMBER", label: "💼 مسؤول مبيعات (Sales Specialist)", role: "SALES", track: null, isGraphic: false },
  { value: "LEAD_UI_UX", label: "👑 قائد فريق التصميم و UI/UX (Lead)", role: "UI_UX_LEAD", track: "UI_UX", isGraphic: false },
  { value: "LEAD_BACKEND", label: "👑 قائد فريق Backend (Lead)", role: "BACKEND_LEAD", track: "BACKEND", isGraphic: false },
  { value: "LEAD_FRONTEND", label: "👑 قائد فريق Frontend (Lead)", role: "FRONTEND_LEAD", track: "FRONTEND", isGraphic: false },
  { value: "LEAD_MOBILE", label: "👑 قائد فريق Mobile (Lead)", role: "MOBILE_APP_LEAD", track: "MOBILE_APP", isGraphic: false },
];

export default function TeamPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const [currentUser, setCurrentUser] = useState<{ id: string; role: string; email: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [unassigningId, setUnassigningId] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const [selectedRoleOption, setSelectedRoleOption] = useState<string>("DEV_UI_UX");

  // State for Technologies Tag Input
  const [techInput, setTechInput] = useState("");
  const [addTechnologies, setAddTechnologies] = useState<string[]>([]);
  const [editTechnologies, setEditTechnologies] = useState<string[]>([]);

  // Forms state
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "Password123@",
    role: "UI_UX_DESIGNER",
    track: "UI_UX",
    phone: "",
    cvUrl: "",
    walletNumber: "",
    instaPay: ""
  });

  const [editForm, setEditForm] = useState({
    phone: "",
    cvUrl: "",
    instaPay: "",
    walletNumber: ""
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    reward: 0,
    deadline: "",
    projectId: ""
  });

  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  const getAuthHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window === "undefined") return headers;

    const token = 
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

  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include",
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          const u = data?.data ?? data;
          if (u) {
            const role = (u.role || "").toUpperCase();
            setCurrentUser({ id: u.id, role, email: u.email });

            if (role === "UI_UX_LEAD") setActiveTab("UI_UX");
            else if (role === "BACKEND_LEAD") setActiveTab("BACKEND");
            else if (role === "FRONTEND_LEAD") setActiveTab("FRONTEND");
            else if (role === "MOBILE_APP_LEAD") setActiveTab("MOBILE_APP");
            else if (role === "SALES" || role === "SALES_LEADER") setActiveTab("SALES");
            else setActiveTab("ALL");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsAuthLoading(false);
      }
    }
    verifyAuth();
  }, [API_BASE]);

  const userRole = (currentUser?.role || "").toUpperCase();
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const getLeaderDepartment = (role: string): string | null => {
    if (role.endsWith("_LEAD")) return role.replace(/_LEAD$/, "");
    if (role === "SALES_LEADER") return "SALES";
    return null;
  };

  const currentLeaderTrack = getLeaderDepartment(userRole);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-users`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setMembers(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setProjects(list);
        if (list.length > 0) setNewTask(prev => ({ ...prev, projectId: list[0].id }));
      }
    } catch {}
  };

  useEffect(() => {
    if (!isAuthLoading) {
      fetchTeam();
      fetchProjects();
    }
  }, [isAuthLoading]);

  const getWorkload = (member: TeamMember) => {
    const activeTasks = (member.assignedStages || []).filter(
      (s) => !s.isApproved && !s.isUnderReview
    ).length;

    if (activeTasks === 0) {
      return { count: 0, text: "متاح للعمل", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" };
    }
    if (activeTasks <= 2) {
      return { count: activeTasks, text: `${activeTasks} مهام نشطة`, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", dot: "bg-amber-500" };
    }
    return { count: activeTasks, text: `مضغوط (${activeTasks} مهام)`, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", dot: "bg-rose-500" };
  };

  const getWhatsAppUrl = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("01")) clean = "2" + clean;
    return `https://wa.me/${clean}`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditForm(prev => ({ ...prev, cvUrl: reader.result as string }));
        } else {
          setNewMember(prev => ({ ...prev, cvUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getMemberDepartment = (member: TeamMember): string => {
    const r = member.role.toUpperCase();
    if (r === "UI_UX_LEAD" || r === "UI_UX_DESIGNER" || r === "GRAPHIC_DESIGNER" || member.track === "UI_UX") return "UI_UX";
    if (r === "BACKEND_LEAD" || member.track === "BACKEND") return "BACKEND";
    if (r === "FRONTEND_LEAD" || member.track === "FRONTEND") return "FRONTEND";
    if (r === "MOBILE_APP_LEAD" || member.track === "MOBILE_APP") return "MOBILE_APP";
    if (r === "SALES" || r === "SALES_LEADER") return "SALES";
    return "OTHER";
  };

  const getJobTitle = (role: string, track?: string | null, cvUrl?: string | null) => {
    if (role === "SUPER_ADMIN") return "مدير النظام (Super Admin)";
    if (role === "SALES") return "مسؤول مبيعات (Sales)";
    if (role === "SALES_LEADER") return "مشرف مبيعات (Sales Leader)";

    if (role === "UI_UX_LEAD") return "قائد فريق التصميم و UI/UX";
    if (role === "BACKEND_LEAD") return "قائد فريق Backend";
    if (role === "FRONTEND_LEAD") return "قائد فريق Frontend";
    if (role === "MOBILE_APP_LEAD") return "قائد فريق Mobile";
    
    if (role === "UI_UX_DESIGNER" || track === "UI_UX") {
      if (role === "GRAPHIC_DESIGNER" || cvUrl?.includes("#graphic")) return "مصمم جرافيك (Graphic Designer)";
      return "مصمم واجهات (UI/UX)";
    }
    if (track === "BACKEND") return "مطور Backend";
    if (track === "FRONTEND") return "مطور Frontend";
    if (track === "MOBILE_APP") return "مطور Mobile";

    return "عضو فريق";
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const config = ROLE_OPTIONS.find(o => o.value === selectedRoleOption);
    const finalCv = (newMember.cvUrl?.trim() || "") + (config?.isGraphic ? "#graphic" : "");

    const payload: Record<string, any> = {
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      password: newMember.password,
      role: config ? config.role : "DEVELOPER",
      track: config?.track ? config.track : null,
      technologies: addTechnologies,
    };

    if (newMember.phone?.trim()) payload.phone = newMember.phone.trim();
    if (finalCv) payload.cvUrl = finalCv;
    if (newMember.instaPay?.trim()) payload.instaPay = newMember.instaPay.trim();
    if (newMember.walletNumber?.trim()) payload.walletNumber = newMember.walletNumber.trim();

    try {
      const res = await fetch(`${API_BASE}/admin-users`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setIsAddModalOpen(false);
        fetchTeam();
        setAddTechnologies([]);
        setNewMember({ 
          name: "", 
          email: "", 
          password: "Password123@", 
          role: "UI_UX_DESIGNER", 
          track: "UI_UX", 
          phone: "", 
          cvUrl: "", 
          walletNumber: "", 
          instaPay: "" 
        });
      } else {
        alert(Array.isArray(data.message) ? data.message.join("\n") : (data.message || "فشل حفظ العضو"));
      }
    } catch (err: any) {
      alert("خطأ في الاتصال بالخادم: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (member: TeamMember) => {
    setSelectedMember(member);
    setEditTechnologies(member.technologies || []);
    setEditForm({
      phone: member.phone || "",
      cvUrl: member.cvUrl?.replace("#graphic", "") || "",
      instaPay: member.instaPay || "",
      walletNumber: member.walletNumber || ""
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    const isGraphic = selectedMember.cvUrl?.includes("#graphic") || selectedMember.role === "GRAPHIC_DESIGNER";
    const updatedCv = editForm.cvUrl.trim() 
      ? (editForm.cvUrl.trim() + (isGraphic ? "#graphic" : "")) 
      : (isGraphic ? "#graphic" : "");

    try {
      const res = await fetch(`${API_BASE}/admin-users/${selectedMember.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          phone: editForm.phone?.trim() || null,
          cvUrl: updatedCv || null,
          instaPay: editForm.instaPay?.trim() || null,
          walletNumber: editForm.walletNumber?.trim() || null,
          technologies: editTechnologies,
        }),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchTeam();
      } else {
        const data = await res.json();
        alert(Array.isArray(data.message) ? data.message.join("\n") : (data.message || "فشل تحديث البيانات"));
      }
    } catch {
      alert("فشل تحديث البيانات");
    }
  };

  const openTaskModal = (member: TeamMember) => {
    setSelectedMember(member);
    setIsTaskModalOpen(true);
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !newTask.projectId) return;

    try {
      const res = await fetch(`${API_BASE}/project-stages`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          ...newTask,
          reward: isSuperAdmin ? Number(newTask.reward) || 0 : 0,
          assignedUserId: selectedMember.id,
          assignedTo: selectedMember.name,
          track: selectedMember.track || (
                 selectedMember.role.includes("UI_UX") || selectedMember.role === "GRAPHIC_DESIGNER" ? "UI_UX" :
                 selectedMember.role.includes("BACKEND") ? "BACKEND" :
                 selectedMember.role.includes("MOBILE") ? "MOBILE_APP" : "FRONTEND"),
        }),
      });

      if (res.ok) {
        setIsTaskModalOpen(false);
        fetchTeam();
        setNewTask({ title: "", description: "", reward: 0, deadline: "", projectId: projects[0]?.id || "" });
      } else {
        const data = await res.json();
        alert(Array.isArray(data.message) ? data.message.join("\n") : (data.message || "فشل إسناد المهمة"));
      }
    } catch {
      alert("فشل إسناد المهمة");
    }
  };

  // إلغاء إسناد المهمة
  const handleUnassignTask = async (stageId: string, stageTitle: string) => {
    if (!confirm(`هل أنت متأكد من إلغاء إسناد مهمة "${stageTitle}"؟`)) return;

    setUnassigningId(stageId);
    try {
      const res = await fetch(`${API_BASE}/project-stages/${stageId}/unassign`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (res.ok) {
        if (selectedMember) {
          const updatedStages = (selectedMember.assignedStages || []).filter(s => s.id !== stageId);
          setSelectedMember({
            ...selectedMember,
            assignedStages: updatedStages,
          });
        }
        fetchTeam();
      } else {
        const data = await res.json();
        alert(data?.message || "فشل إلغاء إسناد المهمة");
      }
    } catch (err: any) {
      alert("خطأ أثناء الاتصال بالخادم: " + err.message);
    } finally {
      setUnassigningId(null);
    }
  };

  const visibleTrackConfig = ALL_TRACK_CONFIG.filter((t) => {
    if (isSuperAdmin) return true;
    if (currentLeaderTrack) return t.key === currentLeaderTrack;
    return false;
  });

  const filteredMembers = members.filter((m) => {
    if (currentUser && (m.id === currentUser.id || m.email === currentUser.email)) return false;
    if (m.role === "SUPER_ADMIN") return false;

    if (!isSuperAdmin) {
      if (m.role.includes("_LEAD") || m.role === "SALES_LEADER") return false;
      if (currentLeaderTrack && getMemberDepartment(m) !== currentLeaderTrack) return false;
    }

    const matchesSearch = 
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.phone && m.phone.includes(searchTerm)) ||
      (m.technologies || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (isSuperAdmin && m.email.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === "ALL") return isSuperAdmin;
    return getMemberDepartment(m) === activeTab;
  });

  const canManageSelectedMember = isSuperAdmin || (
    currentLeaderTrack && selectedMember && getMemberDepartment(selectedMember) === currentLeaderTrack
  );

  if (isAuthLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="text-brand-500" size={28} />
            <span>{isSuperAdmin ? "إدارة فرق العمل والمطورين" : "فريق العمل والتوزيع الفني"}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">
            {isSuperAdmin
              ? "متابعة المهارات التقنية، ومؤشرات ضغط العمل، وتوزيع المهام المباشرة"
              : "استعراض مهارات أعضاء فريقك ومؤشر تفرغهم لتوزيع المهام بكفاءة"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTeam}
            className="p-2.5 bg-white dark:bg-[#1e2330] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer shadow-xs"
            title="تحديث البيانات"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => {
                setAddTechnologies([]);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xs cursor-pointer shrink-0"
            >
              <UserPlus size={16} />
              <span>إضافة عضو جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* التابات والبحث */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#11141c] p-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleTrackConfig.map((t) => {
            const count = members.filter((m) => {
              if (currentUser && (m.id === currentUser.id || m.email === currentUser.email)) return false;
              if (m.role === "SUPER_ADMIN") return false;

              if (!isSuperAdmin) {
                if (m.role.includes("_LEAD") || m.role === "SALES_LEADER") return false;
              }
              if (t.key === "ALL") return isSuperAdmin;
              return getMemberDepartment(m) === t.key;
            }).length;

            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === t.key
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60"
                }`}
              >
                <span>{t.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === t.key ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="بحث بالاسم أو المهارة (React, Figma)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#161a23] border border-gray-200 dark:border-gray-700/80 rounded-xl pr-11 pl-8 py-2 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white p-0.5 rounded-full"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* كروت الأعضاء */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">جاري تحميل بيانات الفريق والتقنيات...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white dark:bg-[#161a23] border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <Layers className="mx-auto text-gray-400 dark:text-gray-600" size={40} />
          <h3 className="text-gray-800 dark:text-white font-bold text-base">لا يوجد أعضاء في هذا القسم حالياً</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => {
            const jobTitle = getJobTitle(member.role, member.track, member.cvUrl);
            const cleanCv = member.cvUrl?.replace("#graphic", "");
            const workload = getWorkload(member);

            return (
              <div
                key={member.id}
                className="bg-white dark:bg-[#161a23] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-2xl p-5 space-y-4 transition-all relative flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>{member.name}</span>
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{jobTitle}</p>
                    </div>

                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${workload.color}`}>
                      <span className={`w-2 h-2 rounded-full ${workload.dot}`} />
                      <span>{workload.text}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {member.technologies && member.technologies.length > 0 ? (
                      member.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold"
                          dir="ltr"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 italic">لم تُحدد تقنيات بعد</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/60 text-xs">
                    {member.phone ? (
                      <a
                        href={getWhatsAppUrl(member.phone)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-600 dark:text-emerald-400 px-2.5 py-1.5 rounded-lg font-bold transition-colors"
                      >
                        <MessageCircle size={14} className="text-[#25D366]" />
                        <span>واتساب</span>
                      </a>
                    ) : (
                      <span className="text-gray-400">لا يوجد هاتف</span>
                    )}

                    {cleanCv && (
                      <a
                        href={cleanCv}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1.5 rounded-lg mr-auto"
                      >
                        <FileText size={13} />
                        <span>السيرة الذاتية</span>
                      </a>
                    )}
                  </div>

                  {isSuperAdmin && (
                    <div className="bg-gray-50 dark:bg-[#11141c] p-2.5 rounded-xl border border-gray-200 dark:border-gray-800/80 flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <CreditCard size={13} className="text-brand-500" />
                        الرصيد:
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{member.walletBalance || 0} ج.م</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setIsViewModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>الملف</span>
                  </button>

                  <button
                    onClick={() => openTaskModal(member)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-brand-50 dark:bg-brand-600/20 hover:bg-brand-100 dark:hover:bg-brand-600/30 text-brand-600 dark:text-brand-400 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <PlusCircle size={13} />
                    <span>إسناد مهمة</span>
                  </button>

                  {isSuperAdmin && (
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
                      title="تعديل المهارات والبيانات"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: إسناد مهمة جديدة */}
      {isTaskModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161a23] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">إسناد مهمة لـ: {selectedMember.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">الحالة:</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getWorkload(selectedMember).color}`}>
                    {getWorkload(selectedMember).text}
                  </span>
                </div>
              </div>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleAssignTask} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">المشروع</label>
                <select value={newTask.projectId} onChange={e => setNewTask({...newTask, projectId: e.target.value})} className="w-full bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-white cursor-pointer outline-none focus:border-brand-500">
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">عنوان المهمة</label>
                <input required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500" placeholder="مثال: تنفيذ الـ Responsive لمودال الدفع" />
              </div>

              <div className={isSuperAdmin ? "grid grid-cols-2 gap-2" : "space-y-1"}>
                {isSuperAdmin && (
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">المكافأة (ج.م)</label>
                    <input type="number" value={newTask.reward} onChange={e => setNewTask({...newTask, reward: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500 font-mono" />
                  </div>
                )}
                <div>
                  <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">الموعد النهائي</label>
                  <input type="date" required value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} className="w-full bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-white cursor-pointer outline-none focus:border-brand-500" />
                </div>
              </div>

              <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 rounded-xl mt-4 cursor-pointer shadow-xs">إسناد المهمة فوراً</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: تعديل بيانات ومهارات العضو */}
      {isEditModalOpen && isSuperAdmin && selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161a23] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">تعديل بيانات ومهارات: {selectedMember.name}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdateMember} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">التقنيات والمهارات (Tech Stack)</label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl mb-2">
                  {editTechnologies.map((t) => (
                    <span key={t} className="bg-brand-500/15 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1">
                      {t}
                      <button type="button" onClick={() => setEditTechnologies(editTechnologies.filter(x => x !== t))} className="hover:text-rose-500">✕</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="اكتب تقنية ثم Enter..."
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const v = techInput.trim();
                        if (v && !editTechnologies.includes(v)) {
                          setEditTechnologies([...editTechnologies, v]);
                          setTechInput("");
                        }
                      }
                    }}
                    className="flex-1 bg-transparent text-gray-900 dark:text-white outline-none min-w-[120px] text-xs"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">رقم الهاتف</label>
                <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500" />
              </div>

              <div>
                <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">عنوان إنستاباي</label>
                <input value={editForm.instaPay} onChange={e => setEditForm({...editForm, instaPay: e.target.value})} className="w-full bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">المحفظة الإلكترونية</label>
                <input value={editForm.walletNumber} onChange={e => setEditForm({...editForm, walletNumber: e.target.value})} className="w-full bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500" />
              </div>

              <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 rounded-xl mt-4 cursor-pointer shadow-xs">حفظ التغييرات</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: إضافة عضو جديد */}
      {isAddModalOpen && isSuperAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161a23] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">إضافة عضو جديد للفريق</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">الاسم بالكامل</label>
                  <input required value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500" placeholder="مثال: أحمد محمد" />
                </div>
                <div>
                  <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">البريد الإلكتروني</label>
                  <input type="email" required value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="w-full bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500" placeholder="user@codexa.com" />
                </div>
              </div>

              <div>
                <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">المسمى والتخصص</label>
                <select 
                  value={selectedRoleOption} 
                  onChange={e => setSelectedRoleOption(e.target.value)} 
                  className="w-full bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-gray-900 dark:text-white cursor-pointer outline-none focus:border-brand-500 font-bold"
                >
                  {ROLE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">التقنيات والمهارات (Tech Stack)</label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl mb-1">
                  {addTechnologies.map((t) => (
                    <span key={t} className="bg-brand-500/15 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1">
                      {t}
                      <button type="button" onClick={() => setAddTechnologies(addTechnologies.filter(x => x !== t))} className="hover:text-rose-500">✕</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="اكتب مهارة واضغط Enter..."
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const v = techInput.trim();
                        if (v && !addTechnologies.includes(v)) {
                          setAddTechnologies([...addTechnologies, v]);
                          setTechInput("");
                        }
                      }
                    }}
                    className="flex-1 bg-transparent text-gray-900 dark:text-white outline-none min-w-[140px] text-xs"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 dark:text-gray-300 font-bold block mb-1">رقم الهاتف (واتساب)</label>
                <input value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-[#11141c] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500" placeholder="010XXXXXXXX" />
              </div>

              <div className="bg-gray-50 dark:bg-[#11141c] p-3 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
                <label className="text-gray-800 dark:text-gray-300 font-bold block text-xs">السيرة الذاتية (CV)</label>
                <div className="flex flex-col gap-2">
                  <input 
                    value={newMember.cvUrl.startsWith("data:") ? "" : newMember.cvUrl} 
                    onChange={e => setNewMember({...newMember, cvUrl: e.target.value})} 
                    className="w-full bg-white dark:bg-[#161a23] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500" 
                    placeholder="رابط السيرة الذاتية..." 
                  />
                  <label className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 w-fit">
                    <Upload size={12} />
                    <span>{newMember.cvUrl.startsWith("data:") ? "تم اختيار ملف PDF ✓" : "أو ارفع ملف PDF"}</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handlePdfUpload(e)} />
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-[#11141c] p-3 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
                <label className="text-gray-800 dark:text-gray-300 font-bold block text-xs">بيانات تحويل المستحقات والأرباح</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-500 block text-[11px] mb-1">عنوان إنستاباي</label>
                    <input value={newMember.instaPay} onChange={e => setNewMember({...newMember, instaPay: e.target.value})} className="w-full bg-white dark:bg-[#161a23] border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500" placeholder="name@instapay" />
                  </div>
                  <div>
                    <label className="text-gray-500 block text-[11px] mb-1">المحفظة الإلكترونية</label>
                    <input value={newMember.walletNumber} onChange={e => setNewMember({...newMember, walletNumber: e.target.value})} className="w-full bg-white dark:bg-[#161a23] border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500" placeholder="010XXXXXXXX" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 rounded-xl mt-4 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
              >
                {isSaving ? "جاري الحفظ..." : "حفظ العضو في الفريق"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: عرض الملف الكامل */}
      {isViewModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161a23] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedMember.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getJobTitle(selectedMember.role, selectedMember.track, selectedMember.cvUrl)}</p>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 dark:bg-[#11141c] p-3 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
                {isSuperAdmin && (
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500">البريد الإلكتروني:</span>
                    <span className="font-mono">{selectedMember.email}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                  <span className="text-gray-500">رقم الهاتف (واتساب):</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{selectedMember.phone || "غير محدد"}</span>
                    {selectedMember.phone && (
                      <a
                        href={getWhatsAppUrl(selectedMember.phone)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-[11px]"
                      >
                        <MessageCircle size={13} />
                        محادثة
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {isSuperAdmin && (
                <div className="bg-gray-50 dark:bg-[#11141c] p-3 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">الرصيد المتاح للسحب:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedMember.walletBalance || 0} ج.م</span>
                  </div>
                  {selectedMember.instaPay && (
                    <div className="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-gray-800/60">
                      <span className="text-gray-500">إنستاباي:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-gray-700 dark:text-gray-300">{selectedMember.instaPay}</span>
                        <button onClick={() => handleCopy(selectedMember.instaPay!, "view-insta")} className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer">
                          {copiedId === "view-insta" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  )}
                  {selectedMember.walletNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">رقم المحفظة (كاش):</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-gray-700 dark:text-gray-300">{selectedMember.walletNumber}</span>
                        <button onClick={() => handleCopy(selectedMember.walletNumber!, "view-wallet")} className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer">
                          {copiedId === "view-wallet" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-gray-50 dark:bg-[#11141c] p-3 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1.5">
                <span className="text-gray-700 dark:text-gray-300 block font-bold">التقنيات والمهارات:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMember.technologies && selectedMember.technologies.length > 0 ? (
                    selectedMember.technologies.map((t) => (
                      <span key={t} className="bg-brand-500/15 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">لا توجد مهارات مسجلة</span>
                  )}
                </div>
              </div>

              {/* قسم المهام المسندة مع زر إلغاء الإسناد */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 block">المهام المسندة ({selectedMember.assignedStages?.length || 0}):</span>
                {selectedMember.assignedStages && selectedMember.assignedStages.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedMember.assignedStages.map(t => (
                      <div key={t.id} className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-[#11141c] p-2.5 rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 dark:text-gray-200 font-bold truncate">{t.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                            <span>الإنجاز: <strong className="font-mono text-brand-600 dark:text-brand-400">{t.progress}%</strong></span>
                            {t.isApproved && <span className="text-emerald-500 font-bold">• معتمدة</span>}
                          </div>
                        </div>

                        {canManageSelectedMember && !t.isApproved && (
                          <button
                            type="button"
                            disabled={unassigningId === t.id}
                            onClick={() => handleUnassignTask(t.id, t.title)}
                            className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50 shrink-0"
                            title="إلغاء إسناد المهمة"
                          >
                            {unassigningId === t.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <UserMinus size={12} />
                            )}
                            <span>إلغاء الإسناد</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">لا توجد مهام مسندة حالياً</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}