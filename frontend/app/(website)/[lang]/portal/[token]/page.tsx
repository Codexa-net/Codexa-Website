"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Layers,
  CheckCircle2,
  Clock,
  Palette,
  Server,
  Code2,
  Smartphone,
  Loader2,
  AlertCircle,
  Globe,
  Sun,
  Moon,
  ExternalLink,
  MessageCircle,
  RefreshCw,
} from "lucide-react";

interface Stage {
  id: string;
  title: string;
  track: "UI_UX" | "BACKEND" | "FRONTEND" | "MOBILE_APP";
  progress: number;
  isCompleted: boolean;
  isLeadApproved?: boolean;
}

interface ProjectData {
  id: string;
  name: string;
  status: string;
  progress: number;
  currentStage: string;
  deadline?: string;
  stagingUrl?: string;
  updatedAt?: string;
  stages: Stage[];
}

const DICTIONARY = {
  ar: {
    clientPortal: "بوابة متابعة العميل",
    currentProject: "المشروع الحالي:",
    statusLabel: "الحالة:",
    deadlineLabel: "موعد التسليم:",
    overallProgress: "إجمالي نسبة الإنجاز والجاهزية:",
    lastUpdatedLabel: "آخر تحديث للنظام:",
    liveStagingBtn: "معاينة النسخة الحية للمشروع",
    contactHeading: "هل لديك استفسار أو طلب تعديل؟",
    contactDesc: "فريق إدارة المشروع متاح للرد المباشر ومتابعة كافة ملاحظاتك.",
    whatsappBtn: "محادثة مباشرة مع مدير المشروع",
    whatsappMsg:
      "مرحباً إدارة كوديكسا، أتابع مشروعي ({projectName}) على بوابة العملاء ولدَي استفسار بخصوص سير العمل.",
    pipelineTitle: "مراحل تسليم المشروع (Project Pipeline):",
    emptyStages:
      "المشروع قيد الإعداد الأولي، سيتم إدراج مراحل العمل ومتابعتها هنا قريباً.",
    completed: "مكتمل",
    loading: "جاري تحميل بيانات وتحديثات مشروعك...",
    linkInvalid: "الرابط غير متاح",
    linkInvalidDesc: "تعذر الوصول لبيانات المشروع أو انتهت صلاحية الرابط.",
    securityNotice: "Codexa Platform Security",
    copyright:
      "جميع الحقوق محفوظة © 2026 وكالة Codexa للبرمجيات وتطوير الحلول الرقمية.",
    statusMap: {
      "قيد التنفيذ": "قيد التنفيذ",
      IN_PROGRESS: "قيد التنفيذ",
      مكتمل: "مكتمل",
      COMPLETED: "مكتمل",
      "قيد المراجعة": "قيد المراجعة",
      UNDER_REVIEW: "قيد المراجعة",
      متأخر: "متأخر",
      DELAYED: "متأخر",
    } as Record<string, string>,
    tracks: {
      UI_UX: "تصميم الواجهات (UI/UX)",
      BACKEND: "الأنظمة وقواعد البيانات (Backend)",
      FRONTEND: "تطوير واجهات الويب (Frontend)",
      MOBILE_APP: "تطبيقات الهاتف (Mobile App)",
    } as Record<string, string>,
  },
  en: {
    clientPortal: "Client Portal",
    currentProject: "Current Project:",
    statusLabel: "Status:",
    deadlineLabel: "Deadline:",
    overallProgress: "Overall Project Progress & Readiness:",
    lastUpdatedLabel: "Last updated:",
    liveStagingBtn: "Live Staging Preview",
    contactHeading: "Have questions or change requests?",
    contactDesc:
      "The project management team is available for instant support and reviews.",
    whatsappBtn: "Chat with Project Manager",
    whatsappMsg:
      "Hello Codexa Team, I am following my project ({projectName}) on the Client Portal and have an inquiry.",
    pipelineTitle: "Project Pipeline Stages:",
    emptyStages:
      "The project is in initial setup. Milestones will appear here soon.",
    completed: "Completed",
    loading: "Loading project updates...",
    linkInvalid: "Link Unavailable",
    linkInvalidDesc: "Unable to access project data or the link has expired.",
    securityNotice: "Codexa Platform Security",
    copyright:
      "All rights reserved © 2026 Codexa Software & Digital Solutions Agency.",
    statusMap: {
      "قيد التنفيذ": "In Progress",
      IN_PROGRESS: "In Progress",
      مكتمل: "Completed",
      COMPLETED: "Completed",
      "قيد المراجعة": "Under Review",
      UNDER_REVIEW: "Under Review",
      متأخر: "Delayed",
      DELAYED: "Delayed",
    } as Record<string, string>,
    tracks: {
      UI_UX: "UI/UX Design",
      BACKEND: "Backend Architecture",
      FRONTEND: "Frontend Web Development",
      MOBILE_APP: "Mobile App Development",
    } as Record<string, string>,
  },
};

const TRACK_ICONS = {
  UI_UX: { icon: Palette, color: "text-pink-500 bg-pink-500/10" },
  BACKEND: { icon: Server, color: "text-emerald-500 bg-emerald-500/10" },
  FRONTEND: { icon: Code2, color: "text-sky-500 bg-sky-500/10" },
  MOBILE_APP: { icon: Smartphone, color: "text-amber-500 bg-amber-500/10" },
};

export default function ClientPortalPage() {
  const params = useParams();
  const token = params?.token as string;
  const initialLang = (params?.lang as string) === "en" ? "en" : "ar";

  const [lang, setLang] = useState<"ar" | "en">(initialLang);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "https://codexa-website-backend.vercel.app";
  const WHATSAPP_PHONE =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "201277158762";
  const t = DICTIONARY[lang];

  useEffect(() => {
    async function loadProject() {
      if (!token) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/client-portal/${token}`);
        if (!res.ok) throw new Error(t.linkInvalidDesc);
        const data = await res.json();
        setProject(data?.data ?? data);
      } catch (err: any) {
        setError(err.message || t.linkInvalidDesc);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [token, API_BASE, t.linkInvalidDesc]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US").format(num);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d);
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(d);
    } catch {
      return dateString;
    }
  };

  const translatedStatus = useMemo(() => {
    if (!project?.status) return "—";
    return t.statusMap[project.status] || project.status;
  }, [project?.status, t.statusMap]);

  const visibleTracks = useMemo(() => {
    if (!project?.stages) return [];
    const keys: Array<"UI_UX" | "BACKEND" | "FRONTEND" | "MOBILE_APP"> = [
      "UI_UX",
      "BACKEND",
      "FRONTEND",
      "MOBILE_APP",
    ];
    return keys.filter((key) => project.stages.some((s) => s.track === key));
  }, [project?.stages]);

  if (loading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 px-4 text-center ${
          isDarkMode ? "bg-[#07090e] text-white" : "bg-[#f8fafc] text-gray-900"
        }`}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <Loader2 className="animate-spin text-brand-500" size={32} />
        <span className="font-mono text-xs text-gray-400">{t.loading}</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center ${
          isDarkMode ? "bg-[#07090e] text-white" : "bg-[#f8fafc] text-gray-900"
        }`}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
          <AlertCircle size={32} />
        </div>
        <h1 className="mb-2 text-lg sm:text-xl font-bold">{t.linkInvalid}</h1>
        <p className="mb-6 max-w-sm text-xs text-gray-400">
          {error || t.linkInvalidDesc}
        </p>
        <span className="font-mono text-[11px] text-gray-500">
          {t.securityNotice}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto overflow-x-hidden font-sans transition-colors duration-200 ${
        isDarkMode ? "bg-[#07090e] text-white" : "bg-[#f8fafc] text-gray-900"
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* الناف بار المتجاوب مع الهاتف */}
      <header
        className={`sticky top-0 z-50 h-14 sm:h-16 w-full border-b backdrop-blur-md transition-colors ${
          isDarkMode
            ? "border-gray-800/80 bg-[#07090e]/90"
            : "border-gray-100 bg-white/90"
        }`}
        dir="ltr"
      >
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-3.5 sm:px-6 lg:px-8">
          {/* أقصى اليسار: أزرار اللغة والمظهر */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs sm:text-sm font-bold transition-colors ${
                isDarkMode
                  ? "text-gray-200 hover:bg-gray-800 hover:text-brand-400"
                  : "text-gray-800 hover:bg-gray-100 hover:text-brand-600"
              }`}
            >
              <span>{lang === "ar" ? "EN" : "AR"}</span>
              <Globe size={16} strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
                isDarkMode
                  ? "text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                  : "text-gray-800 hover:bg-gray-100 hover:text-brand-600"
              }`}
            >
              {isDarkMode ? (
                <Sun size={18} strokeWidth={2} />
              ) : (
                <Moon size={18} strokeWidth={2} />
              )}
            </button>
          </div>

          {/* أقصى اليمين: شعار واسم Codexa وشارة البوابة */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={`inline-block rounded-full border px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold ${
                isDarkMode
                  ? "border-brand-500/20 bg-brand-500/10 text-brand-400"
                  : "border-brand-200 bg-brand-50 text-brand-600"
              }`}
            >
              {t.clientPortal}
            </span>

            <span
              className={`text-base sm:text-xl font-black tracking-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Codexa
            </span>

            <svg
              viewBox="0 0 100 100"
              fill="none"
              className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 text-[#5046e5]"
            >
              <path
                d="M 66 28 A 30 30 0 1 0 66 72"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 67 46 L 81 60 M 81 46 L 67 60"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 sm:space-y-8 px-3.5 py-5 sm:px-6 sm:py-10">
        {/* ملخص المشروع */}
        <div
          className={`space-y-4 sm:space-y-6 rounded-2xl sm:rounded-3xl border p-4 sm:p-6 md:p-8 shadow-xl ${
            isDarkMode
              ? "border-gray-800/80 bg-gradient-to-b from-[#111625] to-[#0c101c]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1 flex-1 min-w-0">
              <span className="block font-mono text-[11px] sm:text-xs font-bold text-brand-500">
                {t.currentProject}
              </span>
              <h1
                className={`text-xl sm:text-2xl md:text-3xl font-black leading-snug break-words ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {project.name}
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0">
              {project.stagingUrl && (
                <a
                  href={project.stagingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md hover:shadow-brand-500/25 cursor-pointer"
                >
                  <span>{t.liveStagingBtn}</span>
                  <ExternalLink size={14} className="shrink-0" />
                </a>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl border px-3 py-2 text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-xs ${
                    isDarkMode
                      ? "border-gray-700/80 bg-gray-800/80 text-gray-200"
                      : "border-gray-200 bg-gray-50 text-gray-800"
                  }`}
                >
                  <span className="text-gray-400 font-normal">
                    {t.statusLabel}
                  </span>
                  <strong className="text-brand-500 font-bold">
                    {translatedStatus}
                  </strong>
                </div>

                {project.deadline && (
                  <div
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl border px-3 py-2 text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-xs ${
                      isDarkMode
                        ? "border-gray-700/80 bg-gray-800/80 text-gray-200"
                        : "border-gray-200 bg-gray-50 text-gray-800"
                    }`}
                  >
                    <Clock size={13} className="text-brand-500 shrink-0" />
                    <span>{formatDate(project.deadline)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1 sm:pt-2">
            <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs font-bold">
              <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                {t.overallProgress}
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-emerald-500 shrink-0">
                {formatNumber(project.progress || 0)}
                {lang === "ar" ? "٪" : "%"}
              </span>
            </div>

            <div
              className={`h-2.5 sm:h-3 w-full overflow-hidden rounded-full p-0.5 border ${
                isDarkMode
                  ? "border-gray-800 bg-gray-900"
                  : "border-gray-200 bg-gray-100"
              }`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-500 transition-all duration-1000"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>

            {project.updatedAt && (
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-400 pt-1 font-medium">
                <RefreshCw
                  size={11}
                  className="text-emerald-500 animate-pulse shrink-0"
                />
                <span>
                  {t.lastUpdatedLabel} {formatDateTime(project.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* مراحل التسليم */}
        <div className="space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <Layers size={17} className="text-brand-500 shrink-0" />
            <span className={isDarkMode ? "text-gray-300" : "text-gray-800"}>
              {t.pipelineTitle}
            </span>
          </div>

          {visibleTracks.length === 0 ? (
            <div
              className={`rounded-2xl border p-6 sm:p-8 text-center text-xs text-gray-400 ${
                isDarkMode
                  ? "border-gray-800/80 bg-[#0f1422]"
                  : "border-gray-200 bg-white"
              }`}
            >
              {t.emptyStages}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
              {visibleTracks.map((trackKey) => {
                const trackMeta = TRACK_ICONS[trackKey];
                const Icon = trackMeta.icon;
                const trackStages = (project.stages || []).filter(
                  (s) => s.track === trackKey,
                );
                const completedCount = trackStages.filter(
                  (s) => s.isCompleted || s.isLeadApproved,
                ).length;
                const trackProgress =
                  trackStages.length > 0
                    ? Math.round((completedCount / trackStages.length) * 100)
                    : 0;

                return (
                  <div
                    key={trackKey}
                    className={`space-y-3.5 sm:space-y-4 rounded-2xl border p-4 sm:p-5 ${
                      isDarkMode
                        ? "border-gray-800/80 bg-[#0f1422]"
                        : "border-gray-200 bg-white shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className={`shrink-0 rounded-xl p-2 ${trackMeta.color}`}>
                          <Icon size={17} />
                        </div>
                        <h3
                          className={`truncate text-xs font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {t.tracks[trackKey]}
                        </h3>
                      </div>
                      <span
                        className={`shrink-0 rounded-lg px-2.5 py-1 font-mono text-xs font-bold ${
                          isDarkMode
                            ? "bg-gray-800/80 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formatNumber(trackProgress)}
                        {lang === "ar" ? "٪" : "%"}
                      </span>
                    </div>

                    <div className="space-y-2 pt-0.5">
                      {trackStages.map((stage) => (
                        <div
                          key={stage.id}
                          className={`flex items-center justify-between gap-2.5 rounded-xl border p-2.5 text-xs ${
                            isDarkMode
                              ? "border-gray-800/50 bg-[#141a2c]/60"
                              : "border-gray-100 bg-gray-50"
                          }`}
                        >
                          <span
                            className={`leading-relaxed font-medium ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {stage.title}
                          </span>
                          {stage.isCompleted || stage.isLeadApproved ? (
                            <span className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-500">
                              <CheckCircle2 size={12} />
                              <span>{t.completed}</span>
                            </span>
                          ) : (
                            <span className="shrink-0 font-mono text-[11px] text-gray-400">
                              {formatNumber(stage.progress || 0)}
                              {lang === "ar" ? "٪" : "%"}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* واتساب إدارة المشروع */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-lg ${
            isDarkMode
              ? "border-gray-800/80 bg-gradient-to-r from-[#111625] to-[#0c101c]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="space-y-1">
            <h3
              className={`text-xs sm:text-sm font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t.contactHeading}
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
              {t.contactDesc}
            </p>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
              t.whatsappMsg.replace("{projectName}", project.name),
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 text-xs font-bold transition-all shadow-lg shadow-[#25D366]/20 shrink-0 cursor-pointer"
          >
            <MessageCircle size={16} className="shrink-0" />
            <span>{t.whatsappBtn}</span>
          </a>
        </div>

        {/* الفوتر */}
        <footer
          className={`border-t pt-6 pb-4 text-center text-[11px] sm:text-xs ${
            isDarkMode
              ? "border-gray-800/60 text-gray-500"
              : "border-gray-200 text-gray-400"
          }`}
        >
          <p>{t.copyright}</p>
        </footer>
      </main>
    </div>
  );
}