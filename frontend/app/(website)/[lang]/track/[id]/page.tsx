import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  CheckCircle2, 
  Clock, 
  CircleDot, 
  MessageSquare, 
  Calendar, 
  Layers, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";

import { serverFetchApi } from "@/lib/server-api";
import { isValidLocale } from "@/lib/i18n/config";

type PageProps = {
  params: Promise<{
    lang: string;
    id: string;
  }>;
};

/* =========================================================
   DICTIONARY (AR / EN)
========================================================= */
const I18N = {
  ar: {
    metaTitle: "متابعة المشروع | Codexa Tracker",
    metaDesc: "لوحة المتابعة الحية لمشاريع وكالة Codexa",
    tag: "Project Tracker",
    trackingCode: "كود التتبع:",
    notFoundTitle: "المشروع غير مسجل أو قيد الإعداد",
    notFoundDesc: (id: string) => `لم نتمكن من العثور على بيانات مرتبطة بكود التتبع (${id}). تأكد من صحة الرابط أو تواصل مع الإدارة.`,
    contactManager: "التواصل مع مدير المشاريع",
    chatManager: "محادثة مدير المشروع",
    greeting: (client: string) => <>مرحباً <span className="font-bold text-white">{client}</span>، هذه هي لوحة المتابعة المباشرة لمشروعك مع فريق العمل.</>,
    overallProgress: "نسبة الإنجاز الكلية",
    projectType: "نوع المشروع",
    startDate: "تاريخ البدء",
    expectedDelivery: "التسليم المتوقع",
    qaStatus: "حالة الجودة",
    qaValue: "فحص أمني دائم",
    roadmapTitle: "خارطة مراحل التنفيذ",
    liveLogTitle: "سجل التحديثات الحية",
    noUpdates: "لا توجد تحديثات جديدة مسجلة حتى الآن.",
    supportCardTitle: "هل لديك أي استفسار أو إضافة؟",
    supportCardDesc: "تواصل مباشرة مع مدير مشروعك دون الحاجة لإعادة ملء أي استمارات.",
    stageCompleted: "تم الانتهاء والاعتماد بنجاح.",
    stageCurrent: "المرحلة الحالية، الفريق يعمل على التنفيذ الآن.",
    stageUpcoming: "المرحلة المجدولة التالية.",
    defaultStages: [
      { title: "تحديد المتطلبات وهيكلة النظام", date: "المرحلة 1" },
      { title: "تصميم واجهات وتجربة المستخدم (UI/UX)", date: "المرحلة 2" },
      { title: "البرمجة والتطوير التقني وبناء النظام", date: "المرحلة 3" },
      { title: "فحص الجودة واختبارات الأمان (QA)", date: "المرحلة 4" },
      { title: "الإطلاق الرسمي وتسليم المشروع", date: "المرحلة 5" },
    ],
    waMsg: (client: string, project: string, id: string) =>
      encodeURIComponent(`مرحباً فريق كودكسا، أنا ${client}، بخصوص مشروعي (${project}) [كود: ${id}]، لدي استفسار بخصوص سير العمل.`),
    waErr: (id: string) =>
      encodeURIComponent(`مرحباً فريق كودكسا، لدي استفسار بخصوص رابط تتبع المشروع كود: ${id}`)
  },
  en: {
    metaTitle: "Project Tracker | Codexa Tracker",
    metaDesc: "Live project tracking board for Codexa agency clients",
    tag: "Project Tracker",
    trackingCode: "Tracking ID:",
    notFoundTitle: "Project Not Found or Pending Setup",
    notFoundDesc: (id: string) => `We couldn't find active records associated with tracking code (${id}). Please verify your link or contact management.`,
    contactManager: "Contact Project Manager",
    chatManager: "Chat with Project Manager",
    greeting: (client: string) => <>Welcome <span className="font-bold text-white">{client}</span>, this is your live project tracking dashboard with our development team.</>,
    overallProgress: "Overall Progress",
    projectType: "Project Type",
    startDate: "Start Date",
    expectedDelivery: "Estimated Delivery",
    qaStatus: "QA Status",
    qaValue: "Continuous Security Audit",
    roadmapTitle: "Execution Roadmap",
    liveLogTitle: "Live Activity Log",
    noUpdates: "No updates posted yet.",
    supportCardTitle: "Have any questions or requests?",
    supportCardDesc: "Reach out directly to your assigned project manager without re-filling forms.",
    stageCompleted: "Completed and approved successfully.",
    stageCurrent: "Current phase, team is actively developing.",
    stageUpcoming: "Upcoming scheduled milestone.",
    defaultStages: [
      { title: "Requirements & System Architecture", date: "Stage 1" },
      { title: "UI/UX & Interactive Prototyping", date: "Stage 2" },
      { title: "Core Engineering & Database Development", date: "Stage 3" },
      { title: "Quality Assurance & Security Audits (QA)", date: "Stage 4" },
      { title: "Official Launch & Project Handoff", date: "Stage 5" },
    ],
    waMsg: (client: string, project: string, id: string) =>
      encodeURIComponent(`Hello Codexa team, this is ${client}. Regarding my project (${project}) [ID: ${id}], I have an inquiry about the project progress.`),
    waErr: (id: string) =>
      encodeURIComponent(`Hello Codexa team, I have an inquiry regarding project tracking link ID: ${id}`)
  }
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang } = await props.params;
  const isArabic = lang === "ar";
  const t = isArabic ? I18N.ar : I18N.en;
  return {
    title: t.metaTitle,
    description: t.metaDesc,
  };
}

export default async function ProjectTrackingPage(props: PageProps) {
  const { lang, id } = await props.params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const isArabic = lang === "ar";
  const t = isArabic ? I18N.ar : I18N.en;

  // جلب المشروع الفعلي من قاعدة البيانات
  let project: any = null;

  try {
    const res = await serverFetchApi(`/projects/${id}`);
    project = res?.data ?? res;
    if (!project || project.success === false || project.statusCode === 404) {
      project = null;
    }
  } catch (error) {
    project = null;
  }

  if (!project) {
    try {
      const allRes = await serverFetchApi("/projects");
      const list = Array.isArray(allRes) ? allRes : allRes?.data ?? [];
      project = list.find(
        (p: any) =>
          String(p.id) === String(id) ||
          String(p._id) === String(id) ||
          String(p.trackingCode) === String(id)
      );
    } catch (e) {
      project = null;
    }
  }

  // 1. حالة عدم وجود المشروع في قاعدة البيانات
  if (!project) {
    return (
      <div 
        dir={isArabic ? "rtl" : "ltr"}
        className="flex min-h-screen flex-col items-center justify-center bg-[#0b0a17] px-4 text-center text-white"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-black sm:text-3xl">{t.notFoundTitle}</h1>
        <p className="mt-2 max-w-md text-sm text-gray-400">
          {t.notFoundDesc(id)}
        </p>
        <a
          href={`https://wa.me/201277158762?text=${t.waErr(id)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-700 shadow-md"
        >
          <MessageSquare size={16} />
          {t.contactManager}
        </a>
      </div>
    );
  }

  // 2. استخراج البيانات الفعلية للمشروع
  const projectName = project.name || project.title || (isArabic ? "مشروع بدون عنوان" : "Untitled Project");
  const clientName = project.clientName || project.client || (isArabic ? "عميلنا العزيز" : "Valued Client");
  const projectType = project.type || project.category || (isArabic ? "برمجيات" : "Software");
  const projectStatus = project.status || (isArabic ? "قيد التنفيذ" : "In Progress");
  const progressValue = typeof project.progress === "number" ? project.progress : 0;
  const startDate = project.startDate || project.createdAt 
    ? new Date(project.startDate || project.createdAt).toLocaleDateString(isArabic ? "ar-EG" : "en-US") 
    : (isArabic ? "مؤخراً" : "Recently");
  const deliveryDate = project.expectedDelivery || project.deadline || (isArabic ? "يحدد لاحقاً" : "TBD");

  const supportMessage = t.waMsg(clientName, projectName, id);

  return (
    <div 
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0b0a17] text-white selection:bg-brand-500 selection:text-white"
    >
      {/* Glow Effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[#5243e8]/15 blur-[120px]" />
        <div className="absolute top-1/2 left-10 h-[400px] w-[400px] rounded-full bg-[#8257e5]/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* الترويسة */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight text-white">
              Codexa<span className="text-[#6452ff]">.</span>
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-gray-300">
              {t.tag}
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{t.trackingCode}</span>
            <code className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-[11px] text-brand-300 border border-white/10">
              {id}
            </code>
          </div>
        </header>

        {/* كارت ملخص المشروع الفعلي */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#141226]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 border border-amber-500/20">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                {projectStatus}
              </span>

              <h1 className="mt-4 text-2xl font-black sm:text-3xl text-white">
                {projectName}
              </h1>
              
              <p className="mt-2 text-sm text-gray-300">
                {t.greeting(clientName)}
              </p>
            </div>

            {/* زر محادثة مدير المشروع */}
            <a
              href={`https://wa.me/201277158762?text=${supportMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-lg shadow-emerald-900/30"
            >
              <MessageSquare size={16} />
              {t.chatManager}
            </a>
          </div>

          {/* شريط نسبة الإنجاز الفعلي */}
          <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="mb-2.5 flex items-center justify-between text-xs font-bold">
              <span className="text-gray-300">{t.overallProgress}</span>
              <span className="text-brand-300 text-sm font-black">{progressValue}%</span>
            </div>
            
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                style={{ width: `${progressValue}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-400 sm:grid-cols-4">
              <div>
                <p className="text-[11px] text-gray-500">{t.projectType}</p>
                <p className="mt-0.5 font-bold text-gray-200">{projectType}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500">{t.startDate}</p>
                <p className="mt-0.5 font-bold text-gray-200">{startDate}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500">{t.expectedDelivery}</p>
                <p className="mt-0.5 font-bold text-gray-200">{deliveryDate}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500">{t.qaStatus}</p>
                <p className="mt-0.5 font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={14} /> {t.qaValue}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* مراحل التنفيذ الفعلية */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#141226]/80 p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <Layers size={20} className="text-[#6452ff]" />
              {t.roadmapTitle}
            </h2>

            <div className="space-y-6">
              {(project.stages || [
                { title: t.defaultStages[0].title, status: progressValue >= 20 ? "completed" : "current", date: t.defaultStages[0].date },
                { title: t.defaultStages[1].title, status: progressValue >= 40 ? "completed" : progressValue >= 20 ? "current" : "upcoming", date: t.defaultStages[1].date },
                { title: t.defaultStages[2].title, status: progressValue >= 75 ? "completed" : progressValue >= 40 ? "current" : "upcoming", date: t.defaultStages[2].date },
                { title: t.defaultStages[3].title, status: progressValue >= 90 ? "completed" : progressValue >= 75 ? "current" : "upcoming", date: t.defaultStages[3].date },
                { title: t.defaultStages[4].title, status: progressValue === 100 ? "completed" : "upcoming", date: t.defaultStages[4].date },
              ]).map((stage: any, idx: number) => {
                const isCompleted = stage.status === "completed";
                const isCurrent = stage.status === "current";

                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                      {isCompleted ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 size={18} />
                        </div>
                      ) : isCurrent ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 animate-pulse">
                          <CircleDot size={18} />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-500 border border-white/10">
                          <Clock size={16} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`text-sm font-bold ${isCurrent ? "text-brand-300" : isCompleted ? "text-white" : "text-gray-400"}`}>
                          {stage.title}
                        </h3>
                        <span className="text-[11px] text-gray-500 font-mono">{stage.date}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {isCompleted && t.stageCompleted}
                        {isCurrent && t.stageCurrent}
                        {!isCompleted && !isCurrent && t.stageUpcoming}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* التحديثات السريعة والدعم المباشر */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#141226]/80 p-6 backdrop-blur-xl">
              <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-[#6452ff]" />
                {t.liveLogTitle}
              </h2>

              <div className="space-y-4">
                {Array.isArray(project.updates) && project.updates.length > 0 ? (
                  project.updates.map((up: any, i: number) => (
                    <div 
                      key={i} 
                      className={`border-brand-500 ${isArabic ? "border-r-2 pr-3" : "border-l-2 pl-3"}`}
                    >
                      <span className="text-[10px] text-gray-500 font-mono block">{up.date}</span>
                      <h4 className="mt-0.5 text-xs font-bold text-white">{up.title}</h4>
                      <p className="mt-1 text-[11px] leading-relaxed text-gray-400">{up.desc || up.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">{t.noUpdates}</p>
                )}
              </div>
            </div>

            {/* كارت الدعم الفني المباشر */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#191538] to-[#120f26] p-6 text-center">
              <h3 className="text-sm font-bold text-white">{t.supportCardTitle}</h3>
              <p className="mt-1 text-xs text-gray-400">{t.supportCardDesc}</p>
              
              <a
                href={`https://wa.me/201277158762?text=${supportMessage}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-700 transition-colors w-full shadow-md"
              >
                <MessageSquare size={15} />
                {t.chatManager}
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}