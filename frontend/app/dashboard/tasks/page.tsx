"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  Unlock,
  ArrowRight,
  Sparkles,
  Globe,
  FileCheck2,
  ShieldCheck,
  Monitor,
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
  email?: string;
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
  category?: string;
  status: string;
  progress: number;
  isPublic: boolean;
  currentStage?: "UI_UX" | "FRONTEND" | "BACKEND" | "TESTING" | "COMPLETED";
}

// خريطة التخصصات المعتمدة لضمان دقة صلاحية وتخصص كل عضو عند قراءة الجلسة
const KNOWN_USER_DIRECTORY: Record<string, { role: string; track?: string }> = {
  "alqadi@codexa.net": { role: "SUPER_ADMIN", track: "FULL_STACK" },
  "fareselsharkawy517@codexa.com": { role: "GRAPHIC_DESIGNER", track: "UI_UX" },
  "mariamhammad441@codexa.com": { role: "UI_UX_DESIGNER", track: "UI_UX" },
  "fabecv10@codexa.com": { role: "UI_UX_LEAD", track: "UI_UX" },
  "abdelazizkishk19@codexa.com": { role: "DEVELOPER", track: "FRONTEND" },
  "amangalal246@codexa.com": { role: "UI_UX_DESIGNER", track: "UI_UX" },
  "remonaymananes@codexa.com": { role: "DEVELOPER", track: "BACKEND" },
  "mosaied20005@codexa.com": { role: "SALES" },
  "seifelsayed68@codexa.com": { role: "BACKEND_LEAD", track: "BACKEND" },
  "muhamedelsanadiki@codexa.com": { role: "DEVELOPER", track: "FRONTEND" },
  "shroukelsaeid2@codexa.com": { role: "UI_UX_DESIGNER", track: "UI_UX" },
  "mooazmohammed110@codexa.com": { role: "MOBILE_APP_LEAD", track: "MOBILE_APP" },
};

// 🟢 الترتيب المعتمد الجديد: 1. UI/UX ثم 2. Frontend ثم 3. Backend ثم 4. Mobile App
const TRACKS_ORDER = [
  {
    key: "UI_UX" as const,
    title: "تصميم الواجهات (UI/UX)",
    stepLabel: "تصميم الواجهات",
    assignBtnLabel: "إسناد مهمة تصميم (UI/UX)",
    icon: Palette,
    headerBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    key: "FRONTEND" as const,
    title: "تطوير الواجهات (Frontend)",
    stepLabel: "تطوير الواجهات",
    assignBtnLabel: "إسناد مهمة تطوير (Frontend)",
    icon: Code2,
    headerBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    key: "BACKEND" as const,
    title: "تطوير الأنظمة (Backend)",
    stepLabel: "تطوير الأنظمة",
    assignBtnLabel: "إسناد مهمة تطوير (Backend)",
    icon: Server,
    headerBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "MOBILE_APP" as const,
    title: "تطبيقات الموبايل (Mobile App)",
    stepLabel: "تطبيقات الموبايل",
    assignBtnLabel: "إسناد مهمة تطبيقات (Mobile)",
    icon: Smartphone,
    headerBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

type ProjectScopeMode = "WEB_ONLY" | "MOBILE_ONLY" | "FULL_SYSTEM";

function getTasksWelcomeBanner(role: string, name: string, track?: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return {
        greeting: `مرحباً بعودتك، ${name} 👑`,
        badge: "المدير التنفيذي (Super Leader)",
        subtitle:
          "إدارة جميع مسارات المشاريع، تحديد واعتماد المكافآت المالية للمهام، وإصدار أوامر الصرف للمحافظ.",
      };
    case "UI_UX_LEAD":
      return {
        greeting: `مرحباً بعودتك، ${name} 🎨`,
        badge: "قائد فريق التصميم و UI/UX",
        subtitle:
          "إسناد مهام التصميم لفريقك أو لنفسك، مراجعة ملفات Figma المسلمة، واعتمادها فنياً.",
      };
    case "BACKEND_LEAD":
      return {
        greeting: `مرحباً بعودتك، ${name} ⚙️`,
        badge: "قائد فريق تطوير الأنظمة (Backend)",
        subtitle:
          "إسناد مهام الباك إند وقواعد البيانات لفريقك أو لنفسك، ومراجعة الـ PRs والأكواد المسلمة.",
      };
    case "FRONTEND_LEAD":
      return {
        greeting: `مرحباً بعودتك، ${name} 💻`,
        badge: "قائد فريق تطوير الواجهات (Frontend)",
        subtitle:
          "إسناد مهام الفرونت إند لفريقك أو لنفسك، ومراجعة جودة الواجهات وتجربة المستخدم.",
      };
    case "FULL_STACK_LEAD":
      return {
        greeting: `مرحباً بعودتك، ${name} 🌐`,
        badge: "قائد فريق Full-Stack",
        subtitle:
          "إدارة ومراجعة مهام الربط الشامل بين الواجهات الأمامية والأنظمة الخلفية.",
      };
    case "MOBILE_APP_LEAD":
      return {
        greeting: `مرحباً بعودتك، ${name} 📱`,
        badge: "قائد فريق تطبيقات الموبايل",
        subtitle:
          "إسناد مهام تطبيقات الهواتف لفريقك أو لنفسك، وفحص الإصدارات قبل الاعتماد.",
      };
    case "GRAPHIC_DESIGNER":
      return {
        greeting: `مرحباً بعودتك، ${name} 🖌️`,
        badge: "مصمم جرافيك (Graphic Designer)",
        subtitle:
          "استعرض مهام التصميم والهوية البصرية المسندة إليك، وارفع رابط التسليم النهائي للاعتماد.",
      };
    case "UI_UX_DESIGNER":
      return {
        greeting: `مرحباً بعودتك، ${name} 🎨`,
        badge: "مصمم واجهات وتجربة مستخدم (UI/UX)",
        subtitle:
          "استعرض شاشات ومهام الـ UI/UX المسندة إليك، وشارك روابط Figma للمراجعة والاعتماد.",
      };
    case "SALES":
    case "SALES_LEADER":
      return {
        greeting: `مرحباً بعودتك، ${name} 💼`,
        badge: "إدارة المبيعات وتطوير الأعمال (Sales)",
        subtitle:
          "متابعة طلبات التواصل الواردة من العملاء وإدارة سجل العملاء والعقود.",
      };
    default:
      if (track === "BACKEND") {
        return {
          greeting: `مرحباً بعودتك، ${name} ⚙️`,
          badge: "مطور أنظمة خلفية (Backend Developer)",
          subtitle:
            "استعرض مهام الـ APIs وقواعد البيانات المسندة إليك، وارفع رابط الـ GitHub PR للاعتماد.",
        };
      }
      if (track === "MOBILE_APP") {
        return {
          greeting: `مرحباً بعودتك، ${name} 📱`,
          badge: "مطور تطبيقات موبايل (Mobile Developer)",
          subtitle:
            "استعرض مهام تطبيقات الموبايل المسندة إليك، وحدّث نسبة الإنجاز ورابط التسليم.",
        };
      }
      if (track === "FULL_STACK") {
        return {
          greeting: `مرحباً بعودتك، ${name} 🌐`,
          badge: "مطور شامل (Full-Stack Developer)",
          subtitle:
            "استعرض مهام الفرونت إند والباك إند المسندة إليك، وسلّم الروابط للمراجعة الفنية.",
        };
      }
      return {
        greeting: `مرحباً بعودتك، ${name} 💻`,
        badge: "مطور واجهات أمامية (Frontend Developer)",
        subtitle:
          "استعرض مهام تطوير الواجهات المسندة إليك، افتح مراجع فيجما، وسلّم الكود للاعتماد.",
      };
  }
}

export default function UnifiedTasksPage() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    role: string;
    name: string;
    email?: string;
    track?: string;
  } | null>(null);
  const [internalProjects, setInternalProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [stages, setStages] = useState<Stage[]>([]);
  const [teamUsers, setTeamUsers] = useState<User[]>([]);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // 🟢 التحكم الذكي في نطاق المشروع (موقع ويب فقط / تطبيق موبايل فقط / منظومة شاملة) + فتح المسارات يدوياً
  const [projectScope, setProjectScope] = useState<ProjectScopeMode>("WEB_ONLY");
  const [manuallyUnlockedTracks, setManuallyUnlockedTracks] = useState<Record<string, boolean>>({});

  const [adminRewardEdits, setAdminRewardEdits] = useState<Record<string, number>>({});

  // مودال إضافة مهمة جديدة
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTrack, setModalTrack] = useState<
    "UI_UX" | "FRONTEND" | "BACKEND" | "MOBILE_APP"
  >("FRONTEND");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [revisionType, setRevisionType] = useState<
    "INITIAL_TASK" | "FREE_REVISION" | "PAID_ADDON"
  >("INITIAL_TASK");
  const [taskReward, setTaskReward] = useState<number>(0);
  const [taskFigmaUrl, setTaskFigmaUrl] = useState("");
  const [taskGithubUrl, setTaskGithubUrl] = useState("");
  const [taskLiveDemoUrl, setTaskLiveDemoUrl] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // مودال تسليم المهمة النهائي
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
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("accessToken")
        : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/i, "")}`;
    return headers;
  };

  useEffect(() => {
    const applyNormalizedUser = (rawU: any) => {
      if (!rawU || !rawU.name) return;
      const emailLower = (rawU.email || "").trim().toLowerCase();
      const known = KNOWN_USER_DIRECTORY[emailLower];

      let resolvedRole = (rawU.role || known?.role || "DEVELOPER").toUpperCase();
      if (emailLower === "mooazmohammed110@codexa.com" && resolvedRole === "DEVELOPER") {
        resolvedRole = "MOBILE_APP_LEAD";
      }

      const resolvedTrack = rawU.track || known?.track || undefined;

      // 🟢 إذا كان المستخدم مسؤول مبيعات، نحوله فوراً إلى صفحة طلبات التواصل والعملاء
      if (resolvedRole === "SALES" || resolvedRole === "SALES_LEADER") {
        router.replace("/dashboard/messages");
        return;
      }

      setCurrentUser({
        id: rawU.id,
        role: resolvedRole,
        name: rawU.name,
        email: rawU.email,
        track: resolvedTrack,
      });

      // ضبط النطاق الافتراضي حسب تخصص العضو أو الليدر
      if (resolvedRole === "MOBILE_APP_LEAD" || resolvedTrack === "MOBILE_APP") {
        setProjectScope((prev) => (prev === "WEB_ONLY" ? "MOBILE_ONLY" : prev));
      } else if (
        resolvedRole === "FRONTEND_LEAD" ||
        resolvedRole === "BACKEND_LEAD" ||
        resolvedRole === "FULL_STACK_LEAD" ||
        resolvedTrack === "FRONTEND" ||
        resolvedTrack === "BACKEND" ||
        resolvedTrack === "FULL_STACK"
      ) {
        setProjectScope((prev) => (prev === "MOBILE_ONLY" ? "WEB_ONLY" : prev));
      }
    };

    async function loadCurrentUser() {
      try {
        const win = window as unknown as { __codexaActiveUser?: any };
        if (win.__codexaActiveUser?.name) {
          applyNormalizedUser(win.__codexaActiveUser);
        } else {
          const localRaw =
            typeof window !== "undefined"
              ? localStorage.getItem("user") || localStorage.getItem("codexa_user")
              : null;
          if (localRaw) {
            const parsed = JSON.parse(localRaw);
            applyNormalizedUser(parsed);
          }
        }

        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include",
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          const u = data?.data ?? data;
          if (u && u.name) {
            applyNormalizedUser(u);
          }
        }
      } catch (err) {
        console.error("فشل جلب المستخدم:", err);
      } finally {
        setIsUserLoading(false);
      }
    }

    loadCurrentUser();
    window.addEventListener("codexaUserSynced", loadCurrentUser);
    return () => window.removeEventListener("codexaUserSynced", loadCurrentUser);
  }, [API_BASE, router]);

  const userRole = (currentUser?.role || "").toUpperCase();
  const userTrackUpper = (currentUser?.track || "").toUpperCase();
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isSales = userRole === "SALES" || userRole === "SALES_LEADER";
  const isLead = userRole.endsWith("_LEAD");
  const isExecutionMember = !isSuperAdmin && !isLead;

  // 🟢 تحديد صلاحيات رؤية أزرار نطاق المشروع (موقع ويب / تطبيق موبايل / منظومة شاملة)
  const isUiUxMember =
    userRole === "UI_UX_LEAD" ||
    userRole === "UI_UX_DESIGNER" ||
    userRole === "GRAPHIC_DESIGNER" ||
    userTrackUpper === "UI_UX";

  const isMobileMember =
    userRole === "MOBILE_APP_LEAD" || userTrackUpper === "MOBILE_APP";

  const isWebMember =
    !isSuperAdmin &&
    !isUiUxMember &&
    !isMobileMember &&
    (userRole === "FRONTEND_LEAD" ||
      userRole === "BACKEND_LEAD" ||
      userRole === "FULL_STACK_LEAD" ||
      userTrackUpper === "FRONTEND" ||
      userTrackUpper === "BACKEND" ||
      userTrackUpper === "FULL_STACK" ||
      userRole === "DEVELOPER");

  // السوبر ليدر و UI/UX يظهر لهم الكل | الموبايل يظهر له (موبايل + شامل) | الويب يظهر له (ويب + شامل)
  const canSeeWebScope = isSuperAdmin || isUiUxMember || !isMobileMember;
  const canSeeMobileScope = isSuperAdmin || isUiUxMember || !isWebMember;
  const canSeeFullScope = true;

  // ضمان عدم بقاء التبويب على خيار مخفي للتخصص الحالي
  useEffect(() => {
    if (!canSeeWebScope && projectScope === "WEB_ONLY") {
      setProjectScope("MOBILE_ONLY");
    } else if (!canSeeMobileScope && projectScope === "MOBILE_ONLY") {
      setProjectScope("WEB_ONLY");
    }
  }, [canSeeWebScope, canSeeMobileScope, projectScope]);

  const welcomeBanner = getTasksWelcomeBanner(
    userRole,
    currentUser?.name || "عضو الفريق",
    currentUser?.track,
  );

  const canManageTrack = (trackKey: string) => {
    if (isSales) return false;
    if (isSuperAdmin) return true;
    if (userRole === "FULL_STACK_LEAD" && (trackKey === "FRONTEND" || trackKey === "BACKEND")) {
      return true;
    }
    if (userRole === `${trackKey}_LEAD`) return true;
    return false;
  };

  useEffect(() => {
    if (isUserLoading || isSales) return;
    async function initData() {
      try {
        const headers = getAuthHeaders();
        const [projRes, usersRes] = await Promise.all([
          fetch(`${API_BASE}/projects`, { credentials: "include", headers }),
          fetch(`${API_BASE}/admin-users`, { credentials: "include", headers }),
        ]);

        if (projRes.ok) {
          const pData = await projRes.json();
          const list: Project[] = Array.isArray(pData?.data)
            ? pData.data
            : Array.isArray(pData)
              ? pData
              : [];
          const filtered = list.filter(
            (p) =>
              p.isPublic !== true &&
              (p as any).isPublic !== "true" &&
              p.status !== "مكتمل",
          );
          setInternalProjects(filtered);
          if (filtered.length > 0) setSelectedProjectId(filtered[0].id);
        }

        if (usersRes.ok) {
          const uData = await usersRes.json();
          const uList: User[] = Array.isArray(uData?.data)
            ? uData.data
            : Array.isArray(uData)
              ? uData
              : [];
          setTeamUsers(
            uList.map((u) => {
              const emailLower = (u.email || "").toLowerCase();
              const known = KNOWN_USER_DIRECTORY[emailLower];
              let r = (u.role || known?.role || "DEVELOPER").toUpperCase();
              if (emailLower === "mooazmohammed110@codexa.com" && r === "DEVELOPER") {
                r = "MOBILE_APP_LEAD";
              }
              return {
                ...u,
                role: r,
                track: u.track || known?.track,
              };
            }),
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
    initData();
  }, [API_BASE, isUserLoading, isSales]);

  const loadStages = async () => {
    if (!selectedProjectId) {
      setStages([]);
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE}/project-stages/project/${selectedProjectId}`,
        {
          credentials: "include",
          headers: getAuthHeaders(),
        },
      );
      if (res.ok) {
        const data = await res.json();
        const loadedStages: Stage[] = Array.isArray(data) ? data : [];
        setStages(loadedStages);
        if (loadedStages.some((s) => s.track === "MOBILE_APP") && canSeeMobileScope) {
          setProjectScope("FULL_SYSTEM");
        }
      }
    } catch {
      setStages([]);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadStages();
      const savedScope = localStorage.getItem(
        `codexa_scope_${selectedProjectId}`,
      ) as ProjectScopeMode;
      if (savedScope) {
        if (savedScope === "WEB_ONLY" && !canSeeWebScope) {
          setProjectScope("MOBILE_ONLY");
        } else if (savedScope === "MOBILE_ONLY" && !canSeeMobileScope) {
          setProjectScope("WEB_ONLY");
        } else {
          setProjectScope(savedScope);
        }
      }
    }
  }, [selectedProjectId, API_BASE, canSeeWebScope, canSeeMobileScope]);

  const handleScopeChange = (newScope: ProjectScopeMode) => {
    setProjectScope(newScope);
    if (selectedProjectId) {
      try {
        localStorage.setItem(`codexa_scope_${selectedProjectId}`, newScope);
      } catch {}
    }
  };

  const activeProject = internalProjects.find((p) => p.id === selectedProjectId);
  const currentStage = activeProject?.currentStage || "UI_UX";

  // 🟢 فلترة المسارات المعروضة حسب نوع المشروع وتخصص العضو
  const visibleTracks = useMemo(() => {
    if (projectScope === "WEB_ONLY") {
      return TRACKS_ORDER.filter((t) => t.key !== "MOBILE_APP");
    }
    if (projectScope === "MOBILE_ONLY") {
      return TRACKS_ORDER.filter((t) => t.key !== "FRONTEND");
    }
    return TRACKS_ORDER;
  }, [projectScope]);

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
        case "FRONTEND":
          return (
            role === "FRONTEND_LEAD" ||
            role === "FULL_STACK_LEAD" ||
            profileText.includes("FRONTEND") ||
            profileText.includes("FULL_STACK") ||
            profileText.includes("REACT") ||
            profileText.includes("NEXT")
          );
        case "BACKEND":
          return (
            role === "BACKEND_LEAD" ||
            role === "FULL_STACK_LEAD" ||
            profileText.includes("BACKEND") ||
            profileText.includes("FULL_STACK") ||
            profileText.includes("NODE") ||
            profileText.includes("NEST")
          );
        case "MOBILE_APP":
          return (
            role === "MOBILE_APP_LEAD" ||
            profileText.includes("MOBILE") ||
            profileText.includes("FLUTTER")
          );
        default:
          return true;
      }
    });
  }, [teamUsers, modalTrack]);

  // 🟢 تسلسل القفل الجديد: 1. UI_UX -> 2. FRONTEND -> 3. BACKEND -> 4. MOBILE_APP
  const isTrackLocked = (trackKey: string): boolean => {
    if (manuallyUnlockedTracks[trackKey]) return false;
    if (trackKey === "UI_UX") return false;

    if (trackKey === "FRONTEND") {
      return currentStage === "UI_UX";
    }
    if (trackKey === "BACKEND") {
      if (projectScope === "MOBILE_ONLY") {
        return currentStage === "UI_UX";
      }
      return currentStage === "UI_UX" || currentStage === "FRONTEND";
    }
    if (trackKey === "MOBILE_APP") {
      if (projectScope === "MOBILE_ONLY") {
        return currentStage === "UI_UX";
      }
      return currentStage === "UI_UX" || currentStage === "FRONTEND";
    }
    return false;
  };

  const toggleManualUnlock = (trackKey: string) => {
    setManuallyUnlockedTracks((prev) => ({
      ...prev,
      [trackKey]: !prev[trackKey],
    }));
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

  const handleSuperAdminUpdateReward = async (stageId: string, newReward: number) => {
    if (!isSuperAdmin) return;
    try {
      await fetch(`${API_BASE}/project-stages/${stageId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ reward: newReward }),
      }).catch(() => null);

      setStages((prev) =>
        prev.map((s) => (s.id === stageId ? { ...s, reward: newReward } : s)),
      );
      alert(`تم تحديد مكافأة المهمة بـ ${newReward} ج.م بنجاح ✓`);
    } catch {}
  };

  const handleConfirmSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitStageId) return;

    setIsSubmittingTask(true);
    try {
      const res = await fetch(
        `${API_BASE}/project-stages/${submitStageId}/progress`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({
            progress: 100,
            isCompleted: true,
            reply: executorReply.trim() || undefined,
            deliverableUrl: deliverableUrl.trim() || undefined,
          }),
        },
      );

      if (res.ok) {
        alert(
          isLead
            ? "تم تسليم مهمتك بنجاح وإرسالها إلى السوبر ليدر للمراجعة والاعتماد والصرف ✓"
            : "تم تسليم المهمة وإشعار المشرف للمراجعة والاعتماد بنجاح ✓",
        );
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
      if (isSuperAdmin && adminRewardEdits[stageId] !== undefined) {
        await fetch(`${API_BASE}/project-stages/${stageId}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ reward: adminRewardEdits[stageId] }),
        }).catch(() => null);
      }

      const res = await fetch(
        `${API_BASE}/project-stages/${stageId}/lead-approve`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
        },
      );
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
      if (adminRewardEdits[stageId] !== undefined) {
        await fetch(`${API_BASE}/project-stages/${stageId}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ reward: adminRewardEdits[stageId] }),
        }).catch(() => null);
      }

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
      const res = await fetch(
        `${API_BASE}/project-stages/project/${selectedProjectId}/advance-stage`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ nextStage: nextStageKey }),
        },
      );
      if (res.ok) {
        alert(`تم فتح مرحلة ${nextStageKey} رسمياً لبدء العمل عليها.`);
        setInternalProjects((prev) =>
          prev.map((p) =>
            p.id === selectedProjectId
              ? { ...p, currentStage: nextStageKey as any }
              : p,
          ),
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
      const res = await fetch(
        `${API_BASE}/project-stages/${feedbackStageId}/request-changes`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ feedback: feedbackText.trim() }),
        },
      );
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
    if (!taskTitle.trim() || !selectedProjectId || isSales) return;

    setIsSaving(true);
    try {
      const selectedUserObj = teamUsers.find((u) => u.id === assignedUserId);
      const finalReward =
        revisionType === "FREE_REVISION"
          ? 0
          : isSuperAdmin
            ? Number(taskReward) || 0
            : 0;

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
    if (total === 0) {
      return { progress: 0, status: "EMPTY", approvedCount: 0, total: 0 };
    }

    const approvedCount = trackTasks.filter(
      (s) => s.isApproved || s.isLeadApproved,
    ).length;
    const underReviewCount = trackTasks.filter(
      (s) => s.isUnderReview && !s.isApproved && !s.isLeadApproved,
    ).length;

    const progress = Math.round((approvedCount / total) * 100);

    let status = "IN_PROGRESS";
    if (approvedCount === total) status = "COMPLETED";
    else if (underReviewCount > 0 && approvedCount + underReviewCount === total) {
      status = "UNDER_REVIEW";
    }

    return { progress, status, approvedCount, total };
  };

  const myTasks = stages.filter(
    (s) =>
      (s.assignedUserId && s.assignedUserId === currentUser?.id) ||
      (s.assignedTo && s.assignedTo === currentUser?.name),
  );

  const uiUxStats = getTrackStats("UI_UX");
  const frontendStats = getTrackStats("FRONTEND");

  if (isUserLoading || isSales) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-10 text-right" dir="rtl">
      {/* الترويسة واختيار المشروع */}
      <div className="flex flex-col justify-between gap-6 border-b border-gray-200 pb-5 lg:flex-row lg:items-center dark:border-gray-800">
        <div className="flex-1">
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-0.5 text-[11px] font-bold text-brand-500">
            <ShieldCheck size={13} />
            <span>{welcomeBanner.badge}</span>
          </div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-white">
            <span>{welcomeBanner.greeting}</span>
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {welcomeBanner.subtitle}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="shrink-0 text-sm font-bold text-gray-700 dark:text-gray-400">
            المشروع الداخلي:
          </span>
          <div className="relative min-w-[260px]">
            {internalProjects.length === 0 ? (
              <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-400 dark:border-gray-700 dark:bg-gray-800/60">
                لا توجد مشاريع جارية حالياً
              </div>
            ) : (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-800 shadow-xs outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {internalProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* تسلسل المشروع + سويتش نوع المشروع حسب صلاحية وتخصص العضو */}
      <Card className="space-y-4 border border-gray-200 bg-white p-5 text-gray-900 shadow-xs dark:border-gray-800 dark:bg-gradient-to-r dark:from-gray-900 dark:to-[#111827] dark:text-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
              تسلسل تسليم المشروع:
            </span>
            <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
              {activeProject?.name || "لم يتم اختيار مشروع بعد"}
            </span>
            {activeProject && (
              <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 font-mono text-[11px] text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/20 dark:text-brand-300">
                المرحلة المفتوحة: {currentStage}
              </span>
            )}
          </div>

          {/* 🟢 أزرار نطاق المشروع مفلترة حسب التخصص:
              - السوبر ليدر و UI/UX: يظهر لهم الـ 3 أزرار
              - مطور وليدر الموبايل: يظهر له (تطبيق موبايل + منظومة شاملة) فقط
              - مطور وليدر الويب: يظهر له (موقع ويب + منظومة شاملة) فقط */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 text-[11px] font-bold dark:border-gray-800 dark:bg-gray-800/80">
              {canSeeWebScope && (
                <button
                  type="button"
                  onClick={() => handleScopeChange("WEB_ONLY")}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
                    projectScope === "WEB_ONLY"
                      ? "bg-brand-600 text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  <Monitor size={12} />
                  <span>موقع ويب (Web)</span>
                </button>
              )}

              {canSeeMobileScope && (
                <button
                  type="button"
                  onClick={() => handleScopeChange("MOBILE_ONLY")}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
                    projectScope === "MOBILE_ONLY"
                      ? "bg-brand-600 text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  <Smartphone size={12} />
                  <span>تطبيق موبايل (App)</span>
                </button>
              )}

              {canSeeFullScope && (
                <button
                  type="button"
                  onClick={() => handleScopeChange("FULL_SYSTEM")}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
                    projectScope === "FULL_SYSTEM"
                      ? "bg-brand-600 text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  <Layers size={12} />
                  <span>منظومة شاملة (Web + App)</span>
                </button>
              )}
            </div>

            {/* أزرار الترقية التلقائية للسوبر ليدر */}
            {isSuperAdmin &&
              uiUxStats.status === "COMPLETED" &&
              currentStage === "UI_UX" && (
                <button
                  onClick={() =>
                    handleAdvanceStage(
                      projectScope === "MOBILE_ONLY" ? "BACKEND" : "FRONTEND",
                    )
                  }
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-500"
                >
                  <span>
                    {projectScope === "MOBILE_ONLY"
                      ? "اعتماد UI/UX وبدء Backend"
                      : "اعتماد UI/UX وبدء Frontend"}
                  </span>
                  <ArrowRight size={14} className="rotate-180" />
                </button>
              )}

            {isSuperAdmin &&
              frontendStats.status === "COMPLETED" &&
              currentStage === "FRONTEND" && (
                <button
                  onClick={() => handleAdvanceStage("BACKEND")}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-500"
                >
                  <span>
                    {projectScope === "FULL_SYSTEM"
                      ? "اعتماد Frontend وبدء Backend & Mobile"
                      : "اعتماد Frontend وبدء Backend"}
                  </span>
                  <ArrowRight size={14} className="rotate-180" />
                </button>
              )}
          </div>
        </div>

        <div
          className={`grid grid-cols-1 gap-4 ${
            visibleTracks.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
          }`}
        >
          {visibleTracks.map((tr, index) => {
            const stats = getTrackStats(tr.key);
            const isLocked = isTrackLocked(tr.key);

            return (
              <div
                key={tr.key}
                className="relative space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-gray-700/70 dark:bg-gray-800/50"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-100">
                    <span>{index + 1}.</span> {tr.stepLabel}
                  </span>
                  {isLocked ? (
                    <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-700/80 dark:text-gray-400">
                      <Lock size={10} /> بانتظار أمر البدء
                    </span>
                  ) : stats.total === 0 ? (
                    <span className="shrink-0 whitespace-nowrap rounded border border-gray-300 bg-gray-200/80 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:border-gray-600/50 dark:bg-gray-700/60 dark:text-gray-300">
                      بانتظار إضافة مهام
                    </span>
                  ) : stats.status === "COMPLETED" ? (
                    <span className="shrink-0 whitespace-nowrap rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      مكتمل 100%
                    </span>
                  ) : stats.status === "UNDER_REVIEW" ? (
                    <span className="shrink-0 whitespace-nowrap rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      قيد المراجعة
                    </span>
                  ) : (
                    <span className="shrink-0 whitespace-nowrap rounded bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      قيد التنفيذ ({stats.progress}%)
                    </span>
                  )}
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/80">
                  <div
                    className={`h-full transition-all duration-700 ${
                      isLocked
                        ? "bg-gray-400 dark:bg-gray-600"
                        : stats.status === "COMPLETED"
                          ? "bg-emerald-500"
                          : "bg-brand-500"
                    }`}
                    style={{ width: `${isLocked ? 0 : stats.progress}%` }}
                  />
                </div>

                <div className="flex justify-between pt-1 font-mono text-[10px] text-gray-500 dark:text-gray-400">
                  <span>
                    معتمد: {stats.approvedCount} من {stats.total}
                  </span>
                  <span>
                    {isLocked ? "مغلق" : stats.total === 0 ? "—" : `${stats.progress}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* لوحة المسارات لليدرز والسوبر أدمن */}
      {!isExecutionMember ? (
        <div
          className={`grid grid-cols-1 items-start gap-6 md:grid-cols-2 ${
            visibleTracks.length === 3 ? "xl:grid-cols-3" : "xl:grid-cols-4"
          }`}
        >
          {visibleTracks.map((track) => {
            const Icon = track.icon;
            const trackStages = stages.filter((s) => s.track === track.key);
            const isAuthorized = canManageTrack(track.key);
            const isLocked = isTrackLocked(track.key);

            return (
              <div
                key={track.key}
                className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-xs dark:bg-[#111827] ${
                  isLocked
                    ? "border-gray-200 opacity-85 dark:border-gray-800/80"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <div className="space-y-3 border-b border-gray-100 p-4 dark:border-gray-800">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className={`shrink-0 rounded-xl p-2 ${track.headerBg}`}>
                        <Icon size={18} />
                      </div>
                      <h2 className="truncate text-xs font-bold text-gray-900 dark:text-white">
                        {track.title}
                      </h2>
                    </div>

                    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {trackStages.length} مهمة
                    </span>
                  </div>

                  {isAuthorized && !isLocked ? (
                    <button
                      onClick={() => {
                        if (!selectedProjectId) {
                          alert("يرجى اختيار مشروع أو إضافة مشروع داخلي أولاً.");
                          return;
                        }
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
                      className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 py-2.5 text-xs font-bold text-gray-600 transition-all hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:text-gray-400 dark:hover:text-brand-400"
                    >
                      <Plus size={15} />
                      <span>{track.assignBtnLabel}</span>
                    </button>
                  ) : isLocked ? (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-[11px] font-bold text-gray-500 dark:border-gray-700/60 dark:bg-gray-800/50 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Lock size={12} className="shrink-0" />
                        <span>المسار مغلق لحين اعتماد المرحلة السابقة</span>
                      </span>
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => toggleManualUnlock(track.key)}
                          className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg bg-brand-600/15 px-2 py-1 text-[10px] font-bold text-brand-500 transition-colors hover:bg-brand-600 hover:text-white"
                          title="فتح المسار يدوياً الآن"
                        >
                          <Unlock size={11} />
                          <span>فتح</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-center text-[11px] font-bold text-gray-500 dark:border-gray-700/60 dark:bg-gray-800/50 dark:text-gray-400">
                      مسار مخصص لفريق {track.stepLabel}
                    </div>
                  )}
                </div>

                <div className="max-h-[620px] min-h-[380px] space-y-3 overflow-y-auto bg-gray-50/70 p-3 dark:bg-[#0b0f17]/30">
                  {trackStages.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center text-xs font-medium text-gray-400 dark:text-gray-500">
                      لا توجد مهام حالياً
                    </div>
                  ) : (
                    trackStages.map((task) => {
                      const isAssignedToMe =
                        (task.assignedUserId &&
                          task.assignedUserId === currentUser?.id) ||
                        (task.assignedTo && task.assignedTo === currentUser?.name);

                      const effectiveReward =
                        adminRewardEdits[task.id] !== undefined
                          ? adminRewardEdits[task.id]
                          : task.reward || 0;

                      return (
                        <div
                          key={task.id}
                          className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-[#151d2f]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-xs font-bold leading-relaxed text-gray-900 dark:text-white">
                                {task.title}
                              </h3>
                              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                {isAssignedToMe && (
                                  <span className="rounded bg-brand-500/15 px-2 py-0.5 text-[10px] font-bold text-brand-500">
                                    مهمتك الشخصية
                                  </span>
                                )}
                                {task.revisionType === "FREE_REVISION" ? (
                                  <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                    تعديل مجاني (ضمن العقد)
                                  </span>
                                ) : task.revisionType === "PAID_ADDON" ? (
                                  <span className="flex items-center gap-1 rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                                    <Sparkles size={10} /> إضافة مدفوعة
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            {isSuperAdmin && (
                              <span className="shrink-0 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                {effectiveReward} ج.م
                              </span>
                            )}
                          </div>

                          {isSuperAdmin && !task.isPaid && task.revisionType !== "FREE_REVISION" && (
                            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900/60">
                              <span className="text-[10px] font-bold text-gray-500">
                                المكافأة (ج.م):
                              </span>
                              <input
                                type="number"
                                value={effectiveReward}
                                onChange={(e) =>
                                  setAdminRewardEdits({
                                    ...adminRewardEdits,
                                    [task.id]: Number(e.target.value),
                                  })
                                }
                                className="w-20 rounded border border-gray-300 bg-white px-2 py-1 font-mono text-xs font-bold text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleSuperAdminUpdateReward(task.id, effectiveReward)
                                }
                                className="mr-auto cursor-pointer rounded bg-brand-600/15 px-2 py-1 text-[10px] font-bold text-brand-500 hover:bg-brand-600 hover:text-white"
                              >
                                حفظ المبلغ
                              </button>
                            </div>
                          )}

                          <div className="flex flex-col gap-1.5 pt-1">
                            {task.figmaUrl && (
                              <a
                                href={task.figmaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-2 text-[11px] font-bold text-purple-700 transition-colors hover:bg-purple-100 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300"
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
                                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-100 p-2 text-[11px] font-bold text-gray-800 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
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
                                className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-[11px] font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Globe size={12} />
                                  <span>رابط المعاينة والتسليم النهائي</span>
                                </span>
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>

                          {task.feedback && !task.isLeadApproved && (
                            <div className="space-y-1 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-gray-800 dark:text-gray-200">
                              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                <AlertTriangle size={13} /> سجل الملاحظات والردود:
                              </span>
                              <p className="whitespace-pre-line text-[11px] leading-relaxed">
                                {task.feedback}
                              </p>
                            </div>
                          )}

                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between text-[10px] font-bold text-gray-500">
                              <span>الإنجاز: {task.progress}%</span>
                              <span className="text-brand-600 dark:text-brand-400">
                                المسند إليه:{" "}
                                {task.assignedUser?.name ||
                                  task.assignedTo ||
                                  "غير مسند"}
                              </span>
                            </div>

                            {isAssignedToMe && !task.isLeadApproved && !task.isPaid ? (
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={task.progress}
                                onChange={(e) =>
                                  handleUpdateProgress(task.id, Number(e.target.value))
                                }
                                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-600 dark:bg-gray-700"
                              />
                            ) : (
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                <div
                                  className={`h-full transition-all duration-500 ${
                                    task.progress === 100
                                      ? "bg-emerald-500"
                                      : "bg-brand-500"
                                  }`}
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 border-t border-gray-100 pt-2 dark:border-gray-800">
                            {isAssignedToMe &&
                              !task.isLeadApproved &&
                              !task.isUnderReview && (
                                <button
                                  onClick={() => {
                                    setSubmitStageId(task.id);
                                    setDeliverableUrl(task.liveDemoUrl || "");
                                    setExecutorReply("");
                                    setIsSubmitModalOpen(true);
                                  }}
                                  className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2 text-[11px] font-bold text-white shadow-xs transition-all hover:bg-brand-500"
                                >
                                  <Send size={13} />
                                  <span>
                                    تسليم المهمة لاعتماد السوبر ليدر (100%)
                                  </span>
                                </button>
                              )}

                            {task.isUnderReview &&
                              !task.isLeadApproved &&
                              (isAssignedToMe && !isSuperAdmin ? (
                                <div className="w-full rounded-xl border border-amber-500/20 bg-amber-500/10 py-2 text-center text-[10px] font-bold text-amber-500">
                                  مهمتك قيد المراجعة (بانتظار اعتماد السوبر ليدر) ⏳
                                </div>
                              ) : isAuthorized ? (
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() => handleLeadApprove(task.id)}
                                    className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl bg-brand-600 py-2 text-[11px] font-bold text-white shadow-xs transition-colors hover:bg-brand-500"
                                  >
                                    <UserCheck size={13} />
                                    <span>
                                      {isSuperAdmin
                                        ? "اعتماد المهمة ✓"
                                        : "اعتماد فني"}
                                    </span>
                                  </button>

                                  <button
                                    onClick={() => handleOpenFeedbackModal(task.id)}
                                    className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2 text-[11px] font-bold text-rose-600 transition-colors hover:bg-rose-500/20 dark:text-rose-400"
                                  >
                                    <MessageSquare size={13} />
                                    <span>طلب تعديل</span>
                                  </button>
                                </div>
                              ) : null)}

                            {isSuperAdmin && task.isLeadApproved && !task.isPaid && (
                              <button
                                onClick={() => handleAdminPayout(task.id)}
                                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-500"
                              >
                                <Coins size={14} />
                                <span>
                                  صرف المستحقات للمحفظة ({effectiveReward} ج.م)
                                </span>
                              </button>
                            )}

                            {task.isPaid ? (
                              <div className="flex w-full items-center justify-center gap-1 rounded-xl bg-emerald-500/10 py-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={12} />
                                <span>معتمدة ومصروفة رسمياً</span>
                              </div>
                            ) : task.isLeadApproved && !isSuperAdmin ? (
                              <div className="flex w-full items-center justify-center gap-1 rounded-xl bg-brand-500/10 py-1.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                                <span>معتمدة فنياً (بانتظار صرف السوبر ليدر)</span>
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
            <Card className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-[#111827]">
              <Inbox className="mx-auto mb-3 text-gray-400" size={38} />
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                لا توجد مهام مسندة إليك حالياً
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-[#151d2f]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400">
                          {task.track}
                        </span>
                        {task.revisionType === "FREE_REVISION" && (
                          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                            تعديل مجاني
                          </span>
                        )}
                        {task.revisionType === "PAID_ADDON" && (
                          <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-bold text-purple-600 dark:text-purple-400">
                            إضافة مدفوعة
                          </span>
                        )}
                      </div>
                    </div>
                    {task.isPaid ? (
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        معتمدة ومحولة
                      </span>
                    ) : task.isLeadApproved ? (
                      <span className="rounded bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                        معتمدة فنياً
                      </span>
                    ) : task.isUnderReview ? (
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        قيد المراجعة
                      </span>
                    ) : (
                      <span className="rounded bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                        جاري العمل
                      </span>
                    )}
                  </div>

                  {task.feedback && !task.isLeadApproved && (
                    <div className="space-y-1 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
                      <span className="flex items-center gap-1 text-[11px] font-bold">
                        <AlertTriangle size={13} /> ملاحظات المشرف وسجل المراجعة:
                      </span>
                      <p className="whitespace-pre-line text-[11px] leading-relaxed">
                        {task.feedback}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {task.figmaUrl && (
                      <a
                        href={task.figmaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 p-2 text-xs font-bold text-purple-700 transition-all hover:bg-purple-100 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300"
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
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-100 p-2 text-xs font-bold text-gray-800 transition-all hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      >
                        <span className="flex items-center gap-1.5">
                          <GithubIcon size={14} /> مستودع GitHub
                        </span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  {task.description && (
                    <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs dark:border-gray-800">
                    <span
                      className="flex items-center gap-1 font-mono text-[11px] text-gray-500 dark:text-gray-400"
                      dir="ltr"
                    >
                      <Clock size={12} /> {task.deadline || "بدون موعد"}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400">
                      <span>نسبة الإنجاز:</span>
                      <span className="font-mono text-brand-600 dark:text-brand-400">
                        {task.progress}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      disabled={task.isLeadApproved || task.isPaid}
                      value={task.progress}
                      onChange={(e) =>
                        handleUpdateProgress(task.id, Number(e.target.value))
                      }
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-600 disabled:opacity-40 dark:bg-gray-700"
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
                      className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-500"
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

      {/* مودال تسليم المهمة النهائي */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#111827]">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <FileCheck2 className="text-brand-500" size={18} />
                <span>تسليم المهمة للمراجعة والاعتماد</span>
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmitTask} className="space-y-4 text-xs">
              <div>
                <label className="mb-1.5 block font-bold text-gray-700 dark:text-gray-300">
                  رابط التسليم النهائي (Live Demo / GitHub PR / Figma):
                </label>
                <input
                  type="url"
                  dir="ltr"
                  placeholder="https://..."
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-left font-mono text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  ضع رابط المعاينة أو الـ Pull Request ليتم مراجعته واعتماده.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block font-bold text-gray-700 dark:text-gray-300">
                  توضيح التعديلات / ملاحظات التسليم (اختياري):
                </label>
                <textarea
                  rows={3}
                  placeholder="مثال: تم إتمام جميع المتطلبات وتحديث الرابط..."
                  value={executorReply}
                  onChange={(e) => setExecutorReply(e.target.value)}
                  className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-right text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="cursor-pointer rounded-xl px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTask}
                  className="cursor-pointer rounded-xl bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-500 disabled:opacity-50"
                >
                  {isSubmittingTask ? "جاري الإرسال..." : "تأكيد التسليم (100%)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال إرسال الملاحظات وطلب تعديل */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#111827]">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <AlertTriangle className="text-amber-500" size={17} />
                <span>إرسال ملاحظات وطلب تعديل المهمة</span>
              </h3>
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
              <div>
                <label className="mb-1.5 block font-bold text-gray-700 dark:text-gray-300">
                  اكتب الملاحظات للمنفذ بدقة:
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="حدد التعديل المطلوب بوضوح قبل الاعتماد النهائي..."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-right text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="cursor-pointer rounded-xl px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="cursor-pointer rounded-xl bg-rose-600 px-5 py-2 font-bold text-white hover:bg-rose-500 disabled:opacity-50"
                >
                  {isSubmittingFeedback
                    ? "جاري الإرسال..."
                    : "إرجاع المهمة مع الملاحظات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال إسناد مهمة جديدة */}
      {isModalOpen && !isSales && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#111827]">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                إسناد مهمة جديدة —{" "}
                {TRACKS_ORDER.find((t) => t.key === modalTrack)?.title}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                  عنوان المهمة
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: بناء واجهات برمجة المدفوعات"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-right text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                  نوع المهمة والتعديل
                </label>
                <select
                  value={revisionType}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setRevisionType(val);
                    if (val === "FREE_REVISION") setTaskReward(0);
                  }}
                  className="w-full cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 font-bold text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="INITIAL_TASK">
                    مهمة تعاقدية أساسية (ضمن نطاق المشروع)
                  </option>
                  <option value="FREE_REVISION">
                    تعديل مجاني (ضمن اتفاق المشروع - 0 ج.م)
                  </option>
                  <option value="PAID_ADDON">
                    ميزة إضافية مدفوعة (Paid Addon)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                    رابط فيجما (Figma)
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="https://www.figma.com/..."
                    value={taskFigmaUrl}
                    onChange={(e) => setTaskFigmaUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-left font-mono text-xs text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                    مستودع GitHub / PR
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="https://github.com/..."
                    value={taskGithubUrl}
                    onChange={(e) => setTaskGithubUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-left font-mono text-xs text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className={isSuperAdmin ? "grid grid-cols-2 gap-3" : "space-y-1"}>
                {isSuperAdmin && (
                  <div>
                    <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                      المكافأة (ج.م){" "}
                      {revisionType === "FREE_REVISION" && "(مغلق: تعديل مجاني)"}
                    </label>
                    <input
                      type="number"
                      disabled={revisionType === "FREE_REVISION"}
                      value={taskReward}
                      onChange={(e) => setTaskReward(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 font-mono text-gray-900 outline-none focus:border-brand-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                    موعد التسليم النهائي
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
                  إسناد إلى عضو الفريق (أو لنفسك كقائد فريق)
                </label>
                <select
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">اختر العضو المسند إليه...</option>
                  {eligibleTeamUsers.map((u) => {
                    const roleTranslations: Record<string, string> = {
                      UI_UX_DESIGNER: "مصمم واجهات UI/UX",
                      GRAPHIC_DESIGNER: "مصمم جرافيك",
                      UI_UX_LEAD: "قائد فريق UI/UX",
                      FRONTEND_LEAD: "قائد فريق Frontend",
                      BACKEND_LEAD: "قائد فريق Backend",
                      FULL_STACK_LEAD: "قائد فريق Full-Stack",
                      MOBILE_APP_LEAD: "قائد فريق Mobile",
                      DEVELOPER: "مطور برمجيات",
                    };
                    const isSelf = u.id === currentUser?.id;
                    const displayTitle =
                      u.jobTitle || roleTranslations[u.role] || u.role;
                    return (
                      <option key={u.id} value={u.id}>
                        {u.name} {isSelf ? "(أنت — قائد الفريق)" : ""} — ({displayTitle})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-xl px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="cursor-pointer rounded-xl bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-500 disabled:opacity-50"
                >
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