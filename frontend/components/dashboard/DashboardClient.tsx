"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Pencil,
  Trash2,
  Calendar,
  Plus,
  Rocket,
  CheckCircle2,
  FolderKanban,
  Filter,
  UserPlus,
  FileSpreadsheet,
  MessageSquare,
  Users,
  Link2,
  Check,
  Layers,
  ClipboardCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { deleteProjectAction } from "@/actions/projects";

import { ProgressChart } from "@/components/charts/ProgressChart";
import { StatusDonut } from "@/components/charts/StatusDonut";

interface DashboardClientProps {
  initialProjects?: any[];
  totalClients?: number;
  currentUser?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    track?: string | null;
  } | null;
}

// دالة توحيد الحالات البرمجية لدعم العربي والإنجليزي معاً
function normalizeStatus(status?: string): "مكتمل" | "قيد التنفيذ" | "قيد المراجعة" | "متأخر" {
  if (!status) return "قيد التنفيذ";
  const s = String(status).trim().toUpperCase();
  if (s === "مكتمل" || s === "COMPLETED") return "مكتمل";
  if (s === "متأخر" || s === "DELAYED") return "متأخر";
  if (
    s === "قيد المراجعة" ||
    s === "تحت المراجعة" ||
    s === "UNDER_REVIEW" ||
    s === "IN_REVIEW"
  ) {
    return "قيد المراجعة";
  }
  return "قيد التنفيذ";
}

// رسائل الترحيب المخصصة لكل دور وظيفي
function getRoleWelcomeConfig(role: string, name: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return {
        greeting: `مرحباً بعودتك، ${name} 👋`,
        subtitle: "نظرة عامة على مشاريعك وأداء الفريق، والأنشطة التي تهم اليوم.",
      };
    case "UI_UX_LEAD":
      return {
        greeting: `مرحباً بعودتك، ${name} 🎨`,
        subtitle: "متابعة مهام فريق التصميم و UI/UX، مراجعة الشاشات المسلمة، وتوزيع المهام الفنية.",
      };
    case "BACKEND_LEAD":
      return {
        greeting: `مرحباً بعودتك، ${name} ⚙️`,
        subtitle: "متابعة مهام تطوير الأنظمة الخلفية وقواعد البيانات، ومراجعة تسليمات مطوري الباك إند.",
      };
    case "FRONTEND_LEAD":
      return {
        greeting: `مرحباً بعودتك، ${name} 💻`,
        subtitle: "متابعة مهام تطوير الواجهات الأمامية، ومراجعة تسليمات مطوري الفرونت إند.",
      };
    case "FULL_STACK_LEAD":
      return {
        greeting: `مرحباً بعودتك، ${name} 🌐`,
        subtitle: "متابعة مهام الربط الشامل بين الفرونت إند والباك إند ومراجعة التسليمات.",
      };
    case "MOBILE_APP_LEAD":
      return {
        greeting: `مرحباً بعودتك، ${name} 📱`,
        subtitle: "متابعة مهام تطوير تطبيقات الموبايل ومراجعة تسليمات الفريق.",
      };
    case "SALES":
    case "SALES_LEADER":
      return {
        greeting: `مرحباً بعودتك، ${name} 💼`,
        subtitle: "متابعة طلبات التواصل من العملاء، تسجيل العملاء الجدد، ومتابعة حالة العقود.",
      };
    default:
      return {
        greeting: `مرحباً بعودتك، ${name} 👋`,
        subtitle: "متابعة المهام المسندة إليك ومراحل التنفيذ اليومية.",
      };
  }
}

export function DashboardClient({
  initialProjects = [],
  totalClients = 0,
  currentUser,
}: DashboardClientProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [targetDelete, setTargetDelete] = useState<any | null>(null);
  const [headerSubtitle, setHeaderSubtitle] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [activeUser, setActiveUser] = useState(() => ({
    id: currentUser?.id || "",
    name: currentUser?.name || "عمر القاضي",
    role: (currentUser?.role || "SUPER_ADMIN").toUpperCase(),
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("user") || localStorage.getItem("codexa_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name && parsed.name !== "المستخدم") {
          setActiveUser({
            id: parsed.id || currentUser?.id || "",
            name: parsed.name,
            role: (parsed.role || currentUser?.role || "SUPER_ADMIN").toUpperCase(),
          });
        }
      } else if (currentUser?.name && currentUser.name !== "المستخدم") {
        setActiveUser({
          id: currentUser.id || "",
          name: currentUser.name,
          role: (currentUser.role || "SUPER_ADMIN").toUpperCase(),
        });
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedDate = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(today);

    if (!initialProjects || initialProjects.length === 0) {
      setHeaderSubtitle(`${formattedDate} • لا توجد مشاريع مسجلة حالياً`);
      return;
    }

    let dueToday = 0;
    initialProjects.forEach((p) => {
      const norm = normalizeStatus(p.status);
      if (!p.deadline || norm === "مكتمل") return;
      const d = new Date(p.deadline);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() === today.getTime()) dueToday++;
    });

    if (dueToday > 0) {
      setHeaderSubtitle(`${formattedDate} • ${dueToday} مشاريع مستحقة اليوم ⚠️`);
    } else {
      setHeaderSubtitle(`${formattedDate} • متابعة أداء المشاريع والمهام`);
    }
  }, [initialProjects]);

  const displayName = activeUser.name || "عمر القاضي";
  const rawRole = (activeUser.role || "SUPER_ADMIN").toUpperCase();
  const isSuperAdmin = rawRole === "SUPER_ADMIN";
  const isSales = rawRole === "SALES" || rawRole === "SALES_LEADER";
  const isLead = rawRole.endsWith("_LEAD");

  const welcomeConfig = getRoleWelcomeConfig(rawRole, displayName);

  // حساب الإحصائيات الحقيقية من المشاريع المسجلة فعلياً
  const totalProjects = initialProjects.length;
  const activeProjects = initialProjects.filter(
    (p) => normalizeStatus(p.status) === "قيد التنفيذ",
  ).length;
  const completedProjects = initialProjects.filter(
    (p) => normalizeStatus(p.status) === "مكتمل",
  ).length;
  const reviewProjects = initialProjects.filter(
    (p) => normalizeStatus(p.status) === "قيد المراجعة",
  ).length;
  const delayedProjects = initialProjects.filter(
    (p) => normalizeStatus(p.status) === "متأخر",
  ).length;

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      const pTitle = p.title || p.name || "";
      const matchSearch =
        pTitle.toLowerCase().includes(search.toLowerCase()) ||
        p.client?.name?.toLowerCase().includes(search.toLowerCase());
      const normStatus = normalizeStatus(p.status);
      const matchStatus = statusFilter === "الكل" || normStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [initialProjects, search, statusFilter]);

  const totalCount = filteredProjects.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  async function handleDelete() {
    if (!targetDelete?.id) return;
    const res = await deleteProjectAction(targetDelete.id);
    if (res.success) {
      setTargetDelete(null);
      router.refresh();
    } else {
      alert(res.error || "تعذر حذف المشروع");
    }
  }

  function handleCopyPortalLink(project: any) {
    const token = project.portalToken || project.id;
    const url = `${window.location.origin}/ar/portal/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(project.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  }

  const formatEnglishDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  function handleExportProjects() {
    if (!initialProjects || initialProjects.length === 0) {
      alert("لا توجد مشاريع مسجلة حالياً لتصديرها.");
      return;
    }
    const headers = [
      "اسم المشروع",
      "العميل",
      "المصمم",
      "المطور",
      "الموعد النهائي",
      "نسبة الإنجاز",
      "الحالة",
    ];
    const rows = initialProjects.map((p) => [
      `"${p.title || p.name || ""}"`,
      `"${p.client?.name || ""}"`,
      `"${p.designer?.name || p.designer || "—"}"`,
      `"${p.developer?.name || p.developer || "—"}"`,
      `"${p.deadline ? formatEnglishDate(p.deadline) : "—"}"`,
      `"${p.progress || 0}%"`,
      `"${normalizeStatus(p.status)}"`,
    ]);
    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `تقرير_مشاريع_كوديكسا_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6 sm:space-y-8 text-right font-sans" dir="rtl">
      {/* الترويسة العلوية النظيفة بدون تكرار شارة المسمى الوظيفي الموجودة في الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14161f] dark:text-white">
            {welcomeConfig.greeting}
          </h1>
          <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
            {welcomeConfig.subtitle}
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
            <Calendar size={13} /> {headerSubtitle || "تحميل التاريخ..."}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isSuperAdmin && (
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              <Plus size={16} /> إضافة مشروع جديد +
            </Link>
          )}
          {isSales && (
            <Link
              href="/dashboard/messages"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              <MessageSquare size={16} /> طلبات التواصل الواردة
            </Link>
          )}
          {isLead && (
            <Link
              href="/dashboard/tasks"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              <ClipboardCheck size={16} /> إدارة مهام فريقي
            </Link>
          )}
        </div>
      </div>

      {/* الكروت الإحصائية الأربعة: تعرض 2 بجانب بعض في الهاتف مثل شاشة المكتب و4 في اللابتوب */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
        <Card className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-[#8b8f9c] dark:text-gray-400">
              عدد المشاريع
            </span>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
              <FolderKanban size={19} />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-[#14161f] dark:text-white">
              {totalProjects}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-brand-600">إجمالي</span>
          </div>
        </Card>

        <Card className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-[#8b8f9c] dark:text-gray-400">
              المشاريع النشطة
            </span>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <Rocket size={19} />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-[#14161f] dark:text-white">
              {activeProjects}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-purple-600">قيد التنفيذ</span>
          </div>
        </Card>

        <Card className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-[#8b8f9c] dark:text-gray-400">
              المشاريع المكتملة
            </span>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 size={19} />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-[#14161f] dark:text-white">
              {completedProjects}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-emerald-600">تم التسليم</span>
          </div>
        </Card>

        <Card className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-[#8b8f9c] dark:text-gray-400">
              عدد العملاء
            </span>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Users size={19} />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-[#14161f] dark:text-white">
              {totalClients}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-blue-600">مسجلين</span>
          </div>
        </Card>
      </div>

      {/* شريط الفرق السريع للسوبر أدمن: كل كارت يوجه مباشرة للفريق المختار فقط */}
      {isSuperAdmin && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              label: "فريق UI/UX والجرافيك",
              count: "5 أعضاء",
              lead: "ليدر: يوسف شهاب",
              trackUrl: "/dashboard/team?track=UI_UX",
              color: "text-pink-400 border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10",
            },
            {
              label: "فريق Frontend",
              count: "2 مطورين",
              lead: "عبدالعزيز • محمد صناديكي",
              trackUrl: "/dashboard/team?track=FRONTEND",
              color: "text-sky-400 border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10",
            },
            {
              label: "فريق Backend",
              count: "2 مطورين",
              lead: "ليدر: سيف السيد",
              trackUrl: "/dashboard/team?track=BACKEND",
              color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10",
            },
            {
              label: "تخصص Full-Stack",
              count: "مفعّل",
              lead: "ربط الفرونت والباك",
              trackUrl: "/dashboard/team?track=FULL_STACK",
              color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10",
            },
            {
              label: "فريق Mobile App",
              count: "مطور موبايل",
              lead: "معاذ محمد سالم",
              trackUrl: "/dashboard/team?track=MOBILE_APP",
              color: "text-amber-400 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10",
            },
            {
              label: "فريق المبيعات Sales",
              count: "تطوير أعمال",
              lead: "محمد سعيد أبو الفتوح",
              trackUrl: "/dashboard/team?track=SALES",
              color: "text-purple-400 border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10",
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.trackUrl}
              className={`rounded-2xl border p-3.5 transition-all hover:-translate-y-0.5 ${item.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold">{item.label}</span>
                <Layers size={13} />
              </div>
              <p className="mt-1.5 text-sm font-black text-gray-900 dark:text-white">
                {item.count}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-gray-500 dark:text-gray-400">
                {item.lead}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
          <div>
            <h2 className="text-base font-bold text-[#14161f] dark:text-white">
              حالة المشاريع
            </h2>
            <p className="text-[11px] text-[#8b8f9c] dark:text-gray-400">
              التوزيع عبر جميع الارتباطات المسجلة
            </p>
          </div>
          <div className="my-6 flex items-center justify-center">
            {mounted && <StatusDonut projects={initialProjects} />}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-y-3 text-xs font-semibold">
            <div className="flex items-center justify-between pe-3">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> مكتملة
              </span>
              <strong className="font-mono text-[#14161f] dark:text-white">
                {completedProjects}
              </strong>
            </div>
            <div className="flex items-center justify-between ps-3">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> قيد التنفيذ
              </span>
              <strong className="font-mono text-[#14161f] dark:text-white">
                {activeProjects}
              </strong>
            </div>
            <div className="flex items-center justify-between pe-3">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> مراجعة
              </span>
              <strong className="font-mono text-[#14161f] dark:text-white">
                {reviewProjects}
              </strong>
            </div>
            <div className="flex items-center justify-between ps-3">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> متأخرة
              </span>
              <strong className="font-mono text-[#14161f] dark:text-white">
                {delayedProjects}
              </strong>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-xs lg:col-span-2 dark:border-gray-800 dark:bg-[#111827]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#14161f] dark:text-white">
                تقدم المشاريع
              </h2>
              <p className="text-[11px] text-[#8b8f9c] dark:text-gray-400">
                المحطات المسلمة مقارنة بالمخطط لها لعام 2026
              </p>
            </div>
          </div>
          <div className="flex h-[260px] sm:h-[280px] w-full items-center justify-center">
            {totalProjects === 0 ? (
              <div className="flex h-full w-full flex-col justify-center rounded-xl border border-dashed border-gray-200 text-center dark:border-gray-800">
                <FolderKanban className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-xs font-semibold text-gray-400">
                  لا توجد مشاريع مسجلة حالياً لبناء المخطط البياني.
                </p>
              </div>
            ) : (
              mounted && <ProgressChart projects={initialProjects} />
            )}
          </div>
        </Card>
      </div>

      {/* جدول أحدث المشاريع بكامل الأعمدة والفلاتر والترقيم */}
      <Card className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5 dark:border-gray-800">
          <div>
            <h2 className="text-base font-bold text-[#14161f] dark:text-white">
              أحدث المشاريع
            </h2>
            <p className="text-[11px] text-[#8b8f9c] dark:text-gray-400">
              متابعة حالة المشاريع الجارية ونسب الإنجاز.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-60">
              <Search
                size={14}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="بحث في المشاريع..."
                className="w-full rounded-full border border-gray-200 bg-[#f7f8fb] py-2 pe-10 ps-4 text-right text-xs outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar rounded-xl bg-gray-50 p-1 text-xs font-semibold text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
              {["الكل", "قيد التنفيذ", "مكتمل", "متأخر", "قيد المراجعة"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatusFilter(st);
                    setCurrentPage(1);
                  }}
                  className={`cursor-pointer whitespace-nowrap rounded-lg px-3 py-1.5 transition-all ${
                    statusFilter === st
                      ? "bg-white text-gray-900 shadow-xs dark:bg-gray-700 dark:text-white"
                      : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {st === "الكل" ? (
                    <span className="flex items-center gap-1">
                      <Filter size={13} /> كل المشاريع
                    </span>
                  ) : (
                    st
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {totalCount === 0 ? (
          <div className="py-16 text-center text-sm font-semibold text-gray-400">
            لا توجد مشاريع مسجلة حالياً تطابق البحث.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-right text-xs">
              <thead>
                <tr className="border-b border-gray-100 font-semibold text-[#8b8f9c] dark:border-gray-800">
                  <th className="py-4 pe-4">اسم المشروع</th>
                  <th className="px-3 py-4">العميل</th>
                  <th className="px-3 py-4">المصمم</th>
                  <th className="px-3 py-4">المطور</th>
                  <th className="px-3 py-4">الموعد النهائي</th>
                  <th className="px-3 py-4">نسبة الإنجاز</th>
                  <th className="px-3 py-4">الحالة</th>
                  {isSuperAdmin && <th className="py-4 ps-4 text-center">الإجراءات</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedProjects.map((p) => {
                  const progress = Number(p.progress) || 0;
                  const deadline = p.deadline ? formatEnglishDate(p.deadline) : "—";
                  const pTitle = p.title || p.name || "بدون اسم";
                  const normStatus = normalizeStatus(p.status);

                  const statusColor =
                    normStatus === "مكتمل"
                      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : normStatus === "متأخر"
                        ? "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400"
                        : normStatus === "قيد المراجعة"
                          ? "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400"
                          : "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400";

                  const barColor =
                    normStatus === "مكتمل"
                      ? "bg-emerald-500"
                      : normStatus === "متأخر"
                        ? "bg-rose-500"
                        : normStatus === "قيد المراجعة"
                          ? "bg-amber-500"
                          : "bg-blue-600";

                  return (
                    <tr
                      key={p.id}
                      className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/40"
                    >
                      <td className="py-3.5 pe-4 font-bold text-[#14161f] dark:text-white">
                        {pTitle}
                      </td>
                      <td className="px-3 py-3.5 font-semibold text-gray-500 dark:text-gray-400">
                        {p.client?.name || "—"}
                      </td>
                      <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">
                        {p.designer?.name || p.designer || "—"}
                      </td>
                      <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">
                        {p.developer?.name || p.developer || "—"}
                      </td>
                      <td
                        className="px-3 py-3.5 font-mono text-gray-500 dark:text-gray-400"
                        dir="ltr"
                      >
                        {deadline}
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 font-mono font-bold text-[#14161f] dark:text-white">
                            {progress}%
                          </span>
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusColor}`}
                        >
                          {normStatus}
                        </span>
                      </td>
                      {isSuperAdmin && (
                        <td className="py-3.5 ps-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleCopyPortalLink(p)}
                              className="cursor-pointer text-gray-400 transition-colors hover:text-brand-600"
                              title="نسخ رابط متابعة العميل"
                            >
                              {copiedId === p.id ? (
                                <Check size={15} className="text-emerald-500" />
                              ) : (
                                <Link2 size={15} />
                              )}
                            </button>

                            <Link
                              href={`/dashboard/projects/${p.id}/edit`}
                              className="text-gray-400 hover:text-brand-600"
                              title="تعديل المشروع"
                            >
                              <Pencil size={15} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setTargetDelete(p)}
                              className="cursor-pointer text-gray-400 hover:text-rose-600"
                              title="حذف المشروع"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* الترقيم (Pagination) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5 text-xs font-semibold text-gray-400 dark:border-gray-800">
          <span>
            عرض <span className="font-mono">{totalCount === 0 ? 0 : startIndex + 1}</span> -{" "}
            <span className="font-mono">
              {Math.min(startIndex + itemsPerPage, totalCount)}
            </span>{" "}
            من <span className="font-mono">{totalCount}</span> مشروعاً
          </span>
          <div className="flex items-center gap-1.5" dir="ltr">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              السابق
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCurrentPage(n)}
                className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg font-mono text-xs font-bold ${
                  currentPage === n
                    ? "bg-brand-600 text-white shadow-xs"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalCount === 0}
              className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              التالي
            </button>
          </div>
        </div>
      </Card>

      {/* الإجراءات السريعة */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-xs lg:col-span-3 dark:border-gray-800 dark:bg-[#111827]">
          <h3 className="mb-4 text-sm font-bold text-[#14161f] dark:text-white">
            الإجراءات السريعة
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3 lg:grid-cols-5">
            {isSuperAdmin && (
              <>
                <Link
                  href="/dashboard/projects/new"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#f7f8fb] p-4 text-center font-bold text-[#14161f] transition-colors hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800/50 dark:text-white dark:hover:bg-gray-800"
                >
                  <FolderKanban size={20} className="text-brand-600" />
                  <span>إضافة مشروع</span>
                </Link>
                <Link
                  href="/dashboard/users"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#f7f8fb] p-4 text-center font-bold text-[#14161f] transition-colors hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800/50 dark:text-white dark:hover:bg-gray-800"
                >
                  <UserPlus size={20} className="text-brand-600" />
                  <span>إضافة مستخدم</span>
                </Link>
                <Link
                  href="/dashboard/services"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#f7f8fb] p-4 text-center font-bold text-[#14161f] transition-colors hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800/50 dark:text-white dark:hover:bg-gray-800"
                >
                  <FolderKanban size={20} className="text-brand-600" />
                  <span>إدارة الخدمات</span>
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={handleExportProjects}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-[#f7f8fb] p-4 text-center font-bold text-[#14161f] transition-colors hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800/50 dark:text-white dark:hover:bg-gray-800"
            >
              <FileSpreadsheet size={20} className="text-brand-600" />
              <span>تصدير تقرير</span>
            </button>
            <Link
              href="/dashboard/messages"
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#f7f8fb] p-4 text-center font-bold text-[#14161f] transition-colors hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800/50 dark:text-white dark:hover:bg-gray-800"
            >
              <MessageSquare size={20} className="text-brand-600" />
              <span>الرسائل الواردة</span>
            </Link>
          </div>
        </Card>
      </div>

      <DeleteDialog
        open={!!targetDelete}
        itemLabel={`المشروع "${targetDelete?.title || targetDelete?.name || ""}"`}
        onClose={() => setTargetDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}