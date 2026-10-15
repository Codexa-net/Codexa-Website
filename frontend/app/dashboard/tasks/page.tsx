"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Palette,
  Code2,
  Server,
  Smartphone,
  Plus,
  Clock,
  CheckCircle2,
  X,
  Layers,
  Inbox,
  UserCheck,
  Coins,
  Send,
  Loader2,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  Globe,
  FileCheck2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

function GithubIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface User {
  id: string;
  name: string;
  role: string;
  track?: string;
  department?: string;
  specialty?: string;
  team?: string;
  jobTitle?: string;
}

interface Stage {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  track: "UI_UX" | "FRONTEND" | "BACKEND" | "MOBILE_APP";
  revisionType?: "INITIAL_TASK" | "FREE_REVISION" | "PAID_ADDON";
  progress: number;
  isCompleted: boolean;
  reward?: number;
  figmaUrl?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  feedback?: string;
  isUnderReview?: boolean;
  isLeadApproved?: boolean;
  isApproved?: boolean;
  isPaid?: boolean;
  assignedTo?: string;
  assignedUserId?: string;
  assignedUser?: User;
  deadline?: string;
  project?: { name: string };
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  isPublic: boolean;
  currentStage?: "UI_UX" | "BACKEND" | "FRONTEND" | "TESTING" | "COMPLETED";
}

const TRACKS_ORDER = [
  { key: "UI_UX" as const, title: "تصميم الواجهات (UI/UX)", icon: Palette, headerBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
  { key: "BACKEND" as const, title: "الأنظمة الخلفية (Backend)", icon: Server, headerBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { key: "FRONTEND" as const, title: "تطوير الواجهات (Frontend)", icon: Code2, headerBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { key: "MOBILE_APP" as const, title: "تطبيقات الموبايل (Mobile App)", icon: Smartphone, headerBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
];

export default function UnifiedTasksPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const [currentUser, setCurrentUser] = useState<{ id: string; role: string; name: string } | null>(null);
  const [internalProjects, setInternalProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [stages, setStages] = useState<Stage[]>([]);
  const [teamUsers, setTeamUsers] = useState<User[]>([]);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // مودال إضافة مهمة جديدة
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTrack, setModalTrack] = useState<"UI_UX" | "FRONTEND" | "BACKEND" | "MOBILE_APP">("FRONTEND");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [revisionType, setRevisionType] = useState<"INITIAL_TASK" | "FREE_REVISION" | "PAID_ADDON">("INITIAL_TASK");
  const [taskReward, setTaskReward] = useState<number>(0);
  const [taskFigmaUrl, setTaskFigmaUrl] = useState("");
  const [taskGithubUrl, setTaskGithubUrl] = useState("");
  const [taskLiveDemoUrl, setTaskLiveDemoUrl] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // مودال تسليم المهمة النهائي من المنفذ
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitStageId, setSubmitStageId] = useState("");
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [executorReply, setExecutorReply] = useState("");
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // مودال الملاحظات
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackStageId, setFeedbackStageId] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("accessToken") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/i, "")}`;
    return headers;
  };

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include", headers: getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          const u = data?.data ?? data;
          if (u) setCurrentUser({ id: u.id, role: (u.role || "").toUpperCase(), name: u.name });
        }
      } catch (err) {
        console.error("فشل جلب المستخدم:", err);
      } finally {
        setIsUserLoading(false);
      }
    }
    loadCurrentUser();
  }, [API_BASE]);

  const userRole = (currentUser?.role || "").toUpperCase();
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isLead = userRole.endsWith("_LEAD");
  const isExecutionMember = !isSuperAdmin && !isLead;

  const canManageTrack = (trackKey: string) => {
    if (isSuperAdmin) return true;
    if (userRole === `${trackKey}_LEAD`) return true;
    return false;
  };

  useEffect(() => {
    if (isUserLoading) return;
    async function initData() {
      try {
        const headers = getAuthHeaders();
        const [projRes, usersRes] = await Promise.all([
          fetch(`${API_BASE}/projects`, { credentials: "include", headers }),
          fetch(`${API_BASE}/admin-users`, { credentials: "include", headers }),
        ]);

        if (projRes.ok) {
          const pData = await projRes.json();
          const list: Project[] = Array.isArray(pData?.data) ? pData.data : Array.isArray(pData) ? pData : [];
          const filtered = list.filter((p) => !p.isPublic && p.status !== "مكتمل");
          setInternalProjects(filtered);
          if (filtered.length > 0) setSelectedProjectId(filtered[0].id);
        }

        if (usersRes.ok) {
          const uData = await usersRes.json();
          const uList: User[] = Array.isArray(uData?.data) ? uData.data : Array.isArray(uData) ? uData : [];
          setTeamUsers(uList);
        }
      } catch (err) {
        console.error(err);
      }
    }
    initData();
  }, [API_BASE, isUserLoading]);

  const loadStages = async () => {
    if (!selectedProjectId) {
      setStages([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/project-stages/project/${selectedProjectId}`, {
        credentials: "include",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setStages(Array.isArray(data) ? data : []);
      }
    } catch {
      setStages([]);
    }
  };

  useEffect(() => {
    if (selectedProjectId) loadStages();
  }, [selectedProjectId, API_BASE]);

  const activeProject = internalProjects.find((p) => p.id === selectedProjectId);
  const currentStage = activeProject?.currentStage || "UI_UX";

  const eligibleTeamUsers = useMemo(() => {
    if (!teamUsers || !Array.isArray(teamUsers)) return [];
    const excludedRoles = ["SUPER_ADMIN", "SALES", "SALES_LEADER", "PROJECT_MANAGER"];

    return teamUsers.filter((u) => {
      const role = (u.role || "").toUpperCase();
      if (excludedRoles.includes(role)) return false;

      const profileText = `${role} ${u.track || ""} ${u.department || ""} ${u.specialty || ""} ${u.team || ""} ${u.jobTitle || ""}`.toUpperCase();

      switch (modalTrack) {
        case "UI_UX":
          return (
            role === "UI_UX_DESIGNER" ||
            role === "GRAPHIC_DESIGNER" ||
            role === "UI_UX_LEAD" ||
            profileText.includes("UI") ||
            profileText.includes("UX") ||
            profileText.includes("DESIGN")
          );
        case "BACKEND":
          return (
            role === "BACKEND_LEAD" ||
            profileText.includes("BACKEND") ||
            profileText.includes("NODE") ||
            profileText.includes("NEST") ||
            profileText.includes("DATABASE")
          );
        case "FRONTEND":
          return (
            role === "FRONTEND_LEAD" ||
            profileText.includes("FRONTEND") ||
            profileText.includes("REACT") ||
            profileText.includes("NEXT") ||
            profileText.includes("WEB")
          );
        case "MOBILE_APP":
          return (
            role === "MOBILE_APP_LEAD" ||
            profileText.includes("MOBILE") ||
            profileText.includes("FLUTTER") ||
            profileText.includes("REACT NATIVE") ||
            profileText.includes("IOS") ||
            profileText.includes("ANDROID")
          );
        default:
          return true;
      }
    });
  }, [teamUsers, modalTrack]);

  const isTrackLocked = (trackKey: string): boolean => {
    if (trackKey === "UI_UX") return false;
    if (trackKey === "BACKEND") return currentStage === "UI_UX";
    if (trackKey === "FRONTEND" || trackKey === "MOBILE_APP") {
      return currentStage === "UI_UX" || currentStage === "BACKEND";
    }
    return false;
  };

  const handleUpdateProgress = async (stageId: string, progress: number) => {
    try {
      const res = await fetch(`${API_BASE}/project-stages/${stageId}/progress`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ progress }),
      });
      if (res.ok) loadStages();
    } catch {}
  };

  const handleConfirmSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitStageId) return;

    setIsSubmittingTask(true);
    try {
      const res = await fetch(`${API_BASE}/project-stages/${submitStageId}/progress`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          progress: 100,
          isCompleted: true,
          reply: executorReply.trim() || undefined,
          deliverableUrl: deliverableUrl.trim() || undefined,
        }),
      });

      if (res.ok) {
        alert("تم تسليم المهمة وإشعار المشرف للمراجعة والاعتماد بنجاح ✓");
        setIsSubmitModalOpen(false);
        setDeliverableUrl("");
        setExecutorReply("");
        loadStages();
      }
    } catch {
      alert("فشل تسليم المهمة");
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleLeadApprove = async (stageId: string) => {
    try {
      const res = await fetch(`${API_BASE}/project-stages/${stageId}/lead-approve`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        alert("تم الاعتماد الفني للمهمة بنجاح ✓");
        loadStages();
      } else {
        alert("تعذر الاعتماد الفني للمهمة");
      }
    } catch {
      alert("فشل الاتصال بالسيرفر");
    }
  };

  const handleAdminPayout = async (stageId: string) => {
    try {
      const res = await fetch(`${API_BASE}/project-stages/${stageId}/payout`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        alert("تم صرف المستحقات بنجاح وإيداعها في المحفظة ✓");
        loadStages();
      } else {
        alert("تعذر الصرف المالي للمهمة");
      }
    } catch {
      alert("فشل الاتصال بالسيرفر");
    }
  };

  const handleAdvanceStage = async (nextStageKey: string) => {
    if (!selectedProjectId) return;
    try {
      const res = await fetch(`${API_BASE}/project-stages/project/${selectedProjectId}/advance-stage`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ nextStage: nextStageKey }),
      });
      if (res.ok) {
        alert(`تم فتح مرحلة ${nextStageKey} رسمياً لبدء العمل عليها.`);
        setInternalProjects((prev) =>
          prev.map((p) => (p.id === selectedProjectId ? { ...p, currentStage: nextStageKey as any } : p))
        );
      }
    } catch {
      alert("فشل نقل المرحلة");
    }
  };

  const handleOpenFeedbackModal = (stageId: string) => {
    setFeedbackStageId(stageId);
    setFeedbackText("");
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || !feedbackStageId) return;

    setIsSubmittingFeedback(true);
    try {
      const res = await fetch(`${API_BASE}/project-stages/${feedbackStageId}/request-changes`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ feedback: feedbackText.trim() }),
      });
      if (res.ok) {
        alert("تم إرجاع المهمة مع الملاحظات.");
        setIsFeedbackModalOpen(false);
        loadStages();
      }
    } catch {
      alert("فشل إرسال الملاحظات");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedProjectId) return;

    setIsSaving(true);
    try {
      const selectedUserObj = teamUsers.find((u) => u.id === assignedUserId);
      const finalReward = revisionType === "FREE_REVISION" ? 0 : (isSuperAdmin ? Number(taskReward) || 0 : 0);

      const payload = {
        projectId: selectedProjectId,
        title: taskTitle.trim(),
        description: taskDesc.trim() || undefined,
        track: modalTrack,
        revisionType,
        reward: finalReward,
        figmaUrl: taskFigmaUrl.trim() || undefined,
        githubUrl: taskGithubUrl.trim() || undefined,
        liveDemoUrl: taskLiveDemoUrl.trim() || undefined,
        deadline: taskDeadline.trim() || undefined,
        assignedUserId: assignedUserId || undefined,
        assignedTo: selectedUserObj ? selectedUserObj.name : undefined,
      };

      const res = await fetch(`${API_BASE}/project-stages`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("تم إنشاء وإسناد المهمة بنجاح.");
        setIsModalOpen(false);
        loadStages();
      }
    } catch {
      alert("فشل الاتصال بالسيرفر");
    } finally {
      setIsSaving(false);
    }
  };

  const getTrackStats = (trackKey: string) => {
    const trackTasks = stages.filter((s) => s.track === trackKey);
    const total = trackTasks.length;
    if (total === 0) return { progress: 0, status: "EMPTY", approvedCount: 0, total: 0 };

    const approvedCount = trackTasks.filter((s) => s.isApproved || s.isLeadApproved).length;
    const underReviewCount = trackTasks.filter((s) => s.isUnderReview && !s.isApproved && !s.isLeadApproved).length;

    const progress = Math.round((approvedCount / total) * 100);

    let status = "IN_PROGRESS";
    if (approvedCount === total) status = "COMPLETED";
    else if (underReviewCount > 0 && approvedCount + underReviewCount === total) status = "UNDER_REVIEW";

    return { progress, status, approvedCount, total };
  };

  const myTasks = stages.filter(
    (s) => (s.assignedUserId && s.assignedUserId === currentUser?.id) || (s.assignedTo && s.assignedTo === currentUser?.name)
  );

  const uiUxStats = getTrackStats("UI_UX");
  const backendStats = getTrackStats("BACKEND");

  if (isUserLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right max-w-[1600px] mx-auto pb-10" dir="rtl">
      {/* الترويسة واختيار المشروع */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span>{isExecutionMember ? "مهامي ومستحقات التنفيذ" : "إدارة ومتابعة مراحل المشروع"}</span>
            <Layers className="text-brand-500" size={24} />
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isExecutionMember
              ? "استعرض المهام المسندة إليك، افتح مراجع التصميم والكود، وسلّم المطلوب للاعتماد."
              : "متابعة حية لتسليم المهام بين الأقسام، المراجعة الفنية، وإصدار أوامر الاعتماد والصرف."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-400 shrink-0">المشروع:</span>
          <div className="relative min-w-[260px]">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs font-bold text-gray-800 dark:text-white outline-none focus:border-brand-500 cursor-pointer shadow-xs"
            >
              {internalProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* تسلسل المشروع */}
      <Card className="p-5 bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-[#111827] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">تسلسل تسليم المشروع:</span>
            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
              {activeProject?.name}
            </span>
            <span className="text-[11px] bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 px-2.5 py-0.5 rounded-full font-mono">
              المرحلة المفتوحة: {currentStage}
            </span>
          </div>

          {isSuperAdmin && uiUxStats.status === "COMPLETED" && currentStage === "UI_UX" && (
            <button
              onClick={() => handleAdvanceStage("BACKEND")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>إعطاء أمر بدء مسار Backend</span>
              <ArrowRight size={14} className="rotate-180" />
            </button>
          )}

          {isSuperAdmin && backendStats.status === "COMPLETED" && currentStage === "BACKEND" && (
            <button
              onClick={() => handleAdvanceStage("FRONTEND")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>إعطاء أمر بدء مسار Frontend & Mobile</span>
              <ArrowRight size={14} className="rotate-180" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TRACKS_ORDER.map((tr, index) => {
            const stats = getTrackStats(tr.key);
            const isLocked = isTrackLocked(tr.key);

            return (
              <div key={tr.key} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/70 p-3.5 rounded-xl space-y-2 relative">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-gray-800 dark:text-gray-100">
                    <span>{index + 1}.</span> {tr.title.split(" ")[0]}
                  </span>
                  {isLocked ? (
                    <span className="text-[10px] bg-gray-200 dark:bg-gray-700/80 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                      <Lock size={10} /> بانتظار أمر البدء
                    </span>
                  ) : stats.total === 0 ? (
                    <span className="text-[10px] bg-gray-200/80 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600/50 px-2 py-0.5 rounded font-bold">
                      بانتظار إضافة مهام
                    </span>
                  ) : stats.status === "COMPLETED" ? (
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">
                      مكتمل 100%
                    </span>
                  ) : stats.status === "UNDER_REVIEW" ? (
                    <span className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-bold">
                      قيد المراجعة
                    </span>
                  ) : (
                    <span className="text-[10px] bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-bold">
                      قيد التنفيذ ({stats.progress}%)
                    </span>
                  )}
                </div>

                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      isLocked ? "bg-gray-400 dark:bg-gray-600" : stats.status === "COMPLETED" ? "bg-emerald-500" : "bg-brand-500"
                    }`}
                    style={{ width: `${isLocked ? 0 : stats.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 pt-1 font-mono">
                  <span>معتمد: {stats.approvedCount} من {stats.total}</span>
                  <span>{isLocked ? "مغلق" : stats.total === 0 ? "—" : `${stats.progress}%`}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* لوحة المسارات لليدرز والأدمن */}
      {!isExecutionMember ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {TRACKS_ORDER.map((track) => {
            const Icon = track.icon;
            const trackStages = stages.filter((s) => s.track === track.key);
            const isAuthorized = canManageTrack(track.key);
            const isLocked = isTrackLocked(track.key);

            return (
              <div key={track.key} className={`flex flex-col rounded-2xl bg-white dark:bg-[#111827] border ${
                isLocked ? "border-gray-200 dark:border-gray-800/80 opacity-80" : "border-gray-200 dark:border-gray-800"
              } shadow-xs overflow-hidden h-full`}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${track.headerBg}`}>
                        <Icon size={18} />
                      </div>
                      <h2 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{track.title}</span>
                        {isLocked && <Lock size={12} className="text-gray-400" />}
                      </h2>
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">
                      {trackStages.length} مهمة
                    </span>
                  </div>

                  {isAuthorized && !isLocked ? (
                    <button
                      onClick={() => {
                        setModalTrack(track.key);
                        setTaskTitle("");
                        setTaskDesc("");
                        setRevisionType("INITIAL_TASK");
                        setTaskReward(0);
                        setTaskFigmaUrl("");
                        setTaskGithubUrl("");
                        setTaskLiveDemoUrl("");
                        setTaskDeadline("");
                        setAssignedUserId("");
                        setIsModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-600 hover:text-brand-600 hover:border-brand-500 dark:text-gray-400 dark:hover:text-brand-400 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus size={15} />
                      <span>إسناد مهمة لـ {track.title.split(" ")[0]}</span>
                    </button>
                  ) : isLocked ? (
                    <div className="py-2.5 px-3 text-center text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 rounded-xl flex items-center justify-center gap-1.5">
                      <Lock size={12} />
                      <span>المسار مغلق لحين اعتماد المرحلة السابقة</span>
                    </div>
                  ) : (
                    <div className="py-2.5 px-3 text-center text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 rounded-xl">
                      مسار مخصص لفريق {track.title.split(" ")[0]}
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-3 min-h-[380px] max-h-[620px] overflow-y-auto bg-gray-50/70 dark:bg-[#0b0f17]/30">
                  {trackStages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-xs font-medium">
                      لا توجد مهام حالياً
                    </div>
                  ) : (
                    trackStages.map((task) => {
                      const isAssignedToMe = (task.assignedUserId && task.assignedUserId === currentUser?.id) || (task.assignedTo && task.assignedTo === currentUser?.name);

                      return (
                        <div key={task.id} className="p-4 rounded-xl bg-white dark:bg-[#151d2f] border border-gray-200 dark:border-gray-800 shadow-xs space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-xs font-bold text-gray-900 dark:text-white leading-relaxed">{task.title}</h3>
                              <div className="mt-1 flex items-center gap-1.5">
                                {task.revisionType === "FREE_REVISION" ? (
                                  <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                                    تعديل مجاني (ضمن العقد)
                                  </span>
                                ) : task.revisionType === "PAID_ADDON" ? (
                                  <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                    <Sparkles size={10} /> إضافة مدفوعة
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            {isSuperAdmin && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px] shrink-0">
                                {task.reward || 0} ج.م
                              </span>
                            )}
                          </div>

                          {/* روابط المراجع والتسليمات الفنية المتعددة */}
                          <div className="flex flex-col gap-1.5 pt-1">
                            {task.figmaUrl && (
                              <a
                                href={task.figmaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20 text-[11px] font-bold hover:bg-purple-100 transition-colors"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Palette size={12} />
                                  <span>ملف فيجما للتصميم</span>
                                </span>
                                <ExternalLink size={12} />
                              </a>
                            )}

                            {task.githubUrl && (
                              <a
                                href={task.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-[11px] font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
                                <span className="flex items-center gap-1.5">
                                  <GithubIcon size={12} />
                                  <span>مستودع الكود / PR</span>
                                </span>
                                <ExternalLink size={12} />
                              </a>
                            )}

                            {task.liveDemoUrl && (
                              <a
                                href={task.liveDemoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 text-[11px] font-bold hover:bg-emerald-100 transition-colors"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Globe size={12} />
                                  <span>رابط المعاينة والتسليم النهائي</span>
                                </span>
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>

                          {/* 🟢 صندوق الملاحظات وردود المنفذ في شاشة الليدر */}
                          {task.feedback && !task.isLeadApproved && (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-gray-800 dark:text-gray-200 text-xs space-y-1">
                              <span className="font-bold flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                                <AlertTriangle size={13} /> سجل الملاحظات والردود:
                              </span>
                              <p className="leading-relaxed whitespace-pre-line text-[11px]">{task.feedback}</p>
                            </div>
                          )}

                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                              <span>الإنجاز: {task.progress}%</span>
                              <span className="text-brand-600 dark:text-brand-400">المسند إليه: {task.assignedUser?.name || task.assignedTo || "غير مسند"}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${task.progress === 100 ? "bg-emerald-500" : "bg-brand-500"}`}
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
                            {task.isUnderReview && !task.isLeadApproved && (
                              isAssignedToMe && !isSuperAdmin ? (
                                <div className="w-full py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-[10px] font-bold text-center">
                                  مهمتك قيد المراجعة (بانتظار اعتماد الإدارة العليا) ⏳
                                </div>
                              ) : isAuthorized ? (
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() => handleLeadApprove(task.id)}
                                    className="w-full flex items-center justify-center gap-1 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                                  >
                                    <UserCheck size={13} />
                                    <span>{isSuperAdmin && isAssignedToMe ? "اعتماد المهمة ✓" : "اعتماد فني"}</span>
                                  </button>

                                  <button
                                    onClick={() => handleOpenFeedbackModal(task.id)}
                                    className="w-full flex items-center justify-center gap-1 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
                                  >
                                    <MessageSquare size={13} />
                                    <span>طلب تعديل</span>
                                  </button>
                                </div>
                              ) : null
                            )}

                            {isSuperAdmin && task.isLeadApproved && !task.isPaid && (
                              <button
                                onClick={() => handleAdminPayout(task.id)}
                                className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs transition-all"
                              >
                                <Coins size={14} />
                                <span>صرف المستحقات للمحفظة ({task.reward || 0} ج.م)</span>
                              </button>
                            )}

                            {task.isPaid ? (
                              <div className="w-full flex items-center justify-center gap-1 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-bold">
                                <CheckCircle2 size={12} />
                                <span>معتمدة ومصروفة رسمياً</span>
                              </div>
                            ) : task.isLeadApproved && !isSuperAdmin ? (
                              <div className="w-full flex items-center justify-center gap-1 py-1.5 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl text-[10px] font-bold">
                                <span>معتمدة فنياً (بانتظار الصرف)</span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* شاشة مهامي المخصصة للمطور أو المصمم المنفذ */
        <div className="space-y-4">
          {myTasks.length === 0 ? (
            <Card className="p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827]">
              <Inbox className="mx-auto text-gray-400 mb-3" size={38} />
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">لا توجد مهام مسندة إليك في هذا المشروع حالياً</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {myTasks.map((task) => (
                <div key={task.id} className="p-5 rounded-2xl bg-white dark:bg-[#151d2f] border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">{task.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">{task.track}</span>
                        {task.revisionType === "FREE_REVISION" && (
                          <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded font-bold">
                            تعديل مجاني
                          </span>
                        )}
                        {task.revisionType === "PAID_ADDON" && (
                          <span className="text-[9px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.2 rounded font-bold">
                            إضافة مدفوعة
                          </span>
                        )}
                      </div>
                    </div>
                    {task.isPaid ? (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">معتمدة ومحولة</span>
                    ) : task.isLeadApproved ? (
                      <span className="text-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded font-bold">معتمدة فنياً</span>
                    ) : task.isUnderReview ? (
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-bold">قيد المراجعة</span>
                    ) : (
                      <span className="text-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded font-bold">جاري العمل</span>
                    )}
                  </div>

                  {/* 🟢 صندوق الملاحظات وردود المنفذ في شاشة المطور */}
                  {task.feedback && !task.isLeadApproved && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs space-y-1">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <AlertTriangle size={13} /> ملاحظات المشرف وسجل المراجعة:
                      </span>
                      <p className="leading-relaxed whitespace-pre-line text-[11px]">{task.feedback}</p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {task.figmaUrl && (
                      <a
                        href={task.figmaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20 text-xs font-bold hover:bg-purple-100 transition-all"
                      >
                        <span className="flex items-center gap-1.5">
                          <Palette size={14} /> مرجع فيجما
                        </span>
                        <ExternalLink size={13} />
                      </a>
                    )}

                    {task.githubUrl && (
                      <a
                        href={task.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-xs font-bold hover:bg-gray-200 transition-all"
                      >
                        <span className="flex items-center gap-1.5">
                          <GithubIcon size={14} /> مستودع GitHub
                        </span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>}

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 font-mono text-[11px]" dir="ltr">
                      <Clock size={12} /> {task.deadline || "بدون موعد"}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400">
                      <span>نسبة الإنجاز:</span>
                      <span className="font-mono text-brand-600 dark:text-brand-400">{task.progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      disabled={task.isLeadApproved || task.isPaid}
                      value={task.progress}
                      onChange={(e) => handleUpdateProgress(task.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-600 disabled:opacity-40"
                    />
                  </div>

                  {!task.isLeadApproved && !task.isUnderReview && (
                    <button
                      onClick={() => {
                        setSubmitStageId(task.id);
                        setDeliverableUrl(task.liveDemoUrl || "");
                        setExecutorReply("");
                        setIsSubmitModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs mt-2"
                    >
                      <Send size={14} />
                      <span>تسليم المهمة وطلب اعتماد (100%)</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* مودال تسليم المهمة النهائي من المنفذ مع رابط التسليم ورد المنفذ */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#111827] border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="text-brand-500" size={18} />
                <span>تسليم المهمة للمراجعة والاعتماد الفني</span>
              </h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleConfirmSubmitTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  رابط التسليم النهائي (Live Demo / GitHub PR / Drive):
                </label>
                <input
                  type="url"
                  dir="ltr"
                  placeholder="https://..."
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-left font-mono outline-none focus:border-brand-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">ضع رابط المعاينة أو الـ Pull Request ليقوم المشرف بمراجعته واعتماده.</p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  توضيح التعديلات / ردك على المشرف (اختياري):
                </label>
                <textarea
                  rows={3}
                  placeholder="مثال: تم تعديل المشكلة المذكورة في الملاحظات وتحديث الكود..."
                  value={executorReply}
                  onChange={(e) => setExecutorReply(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-right outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="rounded-xl px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">إلغاء</button>
                <button type="submit" disabled={isSubmittingTask} className="rounded-xl bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-500 cursor-pointer disabled:opacity-50">
                  {isSubmittingTask ? "جاري الإرسال..." : "تأكيد التسليم (100%)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال إرسال الملاحظات وطلب تعديل */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#111827] border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={17} />
                <span>إرسال ملاحظات وطلب تعديل المهمة</span>
              </h3>
              <button onClick={() => setIsFeedbackModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">اكتب الملاحظات للمنفذ بدقة:</label>
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="حدد التعديل المطلوب بوضوح قبل الاعتماد النهائي..."
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-right outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setIsFeedbackModalOpen(false)} className="rounded-xl px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">إلغاء</button>
                <button type="submit" disabled={isSubmittingFeedback} className="rounded-xl bg-rose-600 px-5 py-2 font-bold text-white hover:bg-rose-500 cursor-pointer disabled:opacity-50">
                  {isSubmittingFeedback ? "جاري الإرسال..." : "إرجاع المهمة مع الملاحظات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال إسناد مهمة جديدة بجميع الروابط الفنية */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#111827] border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">إسناد مهمة جديدة لمسار {modalTrack}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">عنوان المهمة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: بناء واجهات برمجة المدفوعات"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2 text-right outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">نوع المهمة والتعديل</label>
                <select
                  value={revisionType}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setRevisionType(val);
                    if (val === "FREE_REVISION") setTaskReward(0);
                  }}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2 outline-none focus:border-brand-500 cursor-pointer font-bold"
                >
                  <option value="INITIAL_TASK">مهمة تعاقدية أساسية (ضمن نطاق المشروع)</option>
                  <option value="FREE_REVISION">تعديل مجاني (ضمن اتفاق المشروع - 0 ج.م)</option>
                  <option value="PAID_ADDON">ميزة إضافية مدفوعة (Paid Addon)</option>
                </select>
              </div>

              {/* حقول الروابط التقنية المتعددة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">رابط فيجما (Figma)</label>
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="https://www.figma.com/..."
                    value={taskFigmaUrl}
                    onChange={(e) => setTaskFigmaUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2 text-left font-mono outline-none focus:border-brand-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">مستودع GitHub / PR</label>
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="https://github.com/..."
                    value={taskGithubUrl}
                    onChange={(e) => setTaskGithubUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2 text-left font-mono outline-none focus:border-brand-500 text-xs"
                  />
                </div>
              </div>

              <div className={isSuperAdmin ? "grid grid-cols-2 gap-3" : "space-y-1"}>
                {isSuperAdmin && (
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                      المكافأة (ج.م) {revisionType === "FREE_REVISION" && "(مغلق: تعديل مجاني)"}
                    </label>
                    <input
                      type="number"
                      disabled={revisionType === "FREE_REVISION"}
                      value={taskReward}
                      onChange={(e) => setTaskReward(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2 outline-none focus:border-brand-500 font-mono disabled:opacity-50"
                    />
                  </div>
                )}
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">موعد التسليم النهائي</label>
                  <input
                    type="date"
                    required
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2 outline-none focus:border-brand-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">إسناد إلى عضو الفريق</label>
                <select
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2 outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="">اختر العضو المسند إليه...</option>
                  {eligibleTeamUsers.map((u) => {
                    const roleTranslations: Record<string, string> = {
                      UI_UX_DESIGNER: "مصمم واجهات UI/UX",
                      GRAPHIC_DESIGNER: "مصمم جرافيك",
                      UI_UX_LEAD: "قائد فريق UI/UX",
                      FRONTEND_LEAD: "قائد فريق Frontend",
                      BACKEND_LEAD: "قائد فريق Backend",
                      MOBILE_APP_LEAD: "قائد فريق Mobile",
                      DEVELOPER: "مطور برمجيات",
                    };
                    const displayTitle = u.jobTitle || roleTranslations[u.role] || u.role;
                    return (
                      <option key={u.id} value={u.id}>
                        {u.name} — ({displayTitle})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">إلغاء</button>
                <button type="submit" disabled={isSaving} className="rounded-xl bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-500 cursor-pointer disabled:opacity-50">
                  {isSaving ? "جاري الإسناد..." : "حفظ وإسناد المهمة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}