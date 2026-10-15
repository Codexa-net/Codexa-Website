"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Send,
  FolderGit2,
  Inbox,
  Loader2,
  ExternalLink,
  Palette,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  track: "UI_UX" | "FRONTEND" | "BACKEND" | "MOBILE_APP";
  progress: number;
  isCompleted: boolean;
  isUnderReview?: boolean;
  isApproved?: boolean;
  figmaUrl?: string;
  feedback?: string;
  reward?: number;
  deadline?: string;
  project?: {
    id: string;
    name: string;
    status: string;
  };
}

const TRACK_LABELS: Record<string, string> = {
  UI_UX: "تصميم واجهات (UI/UX)",
  FRONTEND: "تطوير واجهات (Frontend)",
  BACKEND: "أنظمة خلفية (Backend)",
  MOBILE_APP: "تطبيقات موبايل (Mobile App)",
};

export default function MyTasksPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");

  const fetchMyTasks = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("accessToken")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      let currentUserId = "";
      const savedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          currentUserId = parsed.id;
        } catch {}
      }

      if (!currentUserId) {
        const meRes = await fetch(`${API_BASE}/auth/me`, { credentials: "include", headers });
        if (meRes.ok) {
          const meData = await meRes.json();
          const userObj = meData?.data || meData;
          currentUserId = userObj?.id || "";
        }
      }

      if (!currentUserId) {
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/project-stages/my-tasks?userId=${currentUserId}`, {
        credentials: "include",
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        const realTasks: Task[] = Array.isArray(data) ? data : [];
        setTasks(realTasks);
      }
    } catch (err) {
      console.error("فشل في جلب المهام الحقيقية:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, [API_BASE]);

  const handleProgressChange = (id: string, newProgress: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, progress: newProgress, isCompleted: newProgress === 100 }
          : t
      )
    );
  };

  const handleSaveProgress = async (task: Task, requestReview = false) => {
    setSavingId(task.id);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("accessToken")
          : null;

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const body: Record<string, any> = {
        progress: requestReview ? 100 : task.progress,
        isCompleted: requestReview || task.progress === 100,
      };

      if (requestReview) {
        body.isUnderReview = true;
      }

      const res = await fetch(`${API_BASE}/project-stages/${task.id}/progress`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert(requestReview ? "🚀 تم تسليم المهمة بنجاح وإرسال إشعار لقائد الفريق للمراجعة!" : "تم حفظ تقدم المهمة بنجاح!");
        fetchMyTasks();
      } else {
        alert("حدث خطأ أثناء حفظ التحديث في الخادم.");
      }
    } catch {
      alert("تعذر الاتصال بالخادم.");
    } finally {
      setSavingId(null);
    }
  };

  const ongoingTasks = tasks.filter((t) => t.project?.status !== "مكتمل");
  const filteredTasks = ongoingTasks.filter((t) =>
    activeFilter === "ACTIVE" ? !t.isApproved : t.isApproved
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-right pb-10" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#14161f] dark:text-white flex items-center gap-2">
            <span>مهامي الحالية</span>
            <Sparkles className="text-amber-500" size={20} />
          </h1>
          <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
            حدد نسبة تقدمك في المهام الفعلية المسندة إليك، افتح روابط فيجما، وسلّم المطلوب للاعتماد.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#111827] p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <button
            onClick={() => setActiveFilter("ACTIVE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "ACTIVE"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            المهام الجارية ({ongoingTasks.filter((t) => !t.isApproved).length})
          </button>
          <button
            onClick={() => setActiveFilter("COMPLETED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "COMPLETED"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            المهام المعتمدة ({ongoingTasks.filter((t) => t.isApproved).length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
          <Loader2 className="animate-spin text-brand-500" size={32} />
          <p className="text-xs font-bold">جاري تحميل مهامك الفعلية من الخادم...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card className="p-12 text-center rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center mx-auto">
            <Inbox size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {activeFilter === "ACTIVE" ? "لا توجد مهام نشطة مسندة إليك حالياً" : "لا توجد مهام معتمدة بعد"}
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              عندما يقوم قائد الفريق بإسناد مهمة جديدة لك، ستظهر هنا فوراً.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`p-6 rounded-2xl border transition-all ${
                task.isApproved
                  ? "bg-gray-50/50 dark:bg-gray-900/20 border-gray-100 dark:border-gray-800 opacity-80"
                  : "bg-white dark:bg-[#111827] border-gray-100 dark:border-gray-800 shadow-xs"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 flex items-center gap-1">
                      <FolderGit2 size={12} />
                      {task.project?.name || "مشروع داخلي"}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {TRACK_LABELS[task.track] || task.track}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed">
                    {task.title}
                  </h3>

                  {task.feedback && !task.isApproved && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs space-y-1">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <AlertTriangle size={13} /> ملاحظات الليدر للتعديل:
                      </span>
                      <p className="leading-relaxed">{task.feedback}</p>
                    </div>
                  )}

                  {task.figmaUrl && (
                    <a
                      href={task.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 text-xs font-bold hover:bg-purple-500/20 transition-all border border-purple-500/20"
                    >
                      <Palette size={14} />
                      <span>فتح ملف فيجما للتصميم</span>
                      <ExternalLink size={12} />
                    </a>
                  )}

                  {task.description && (
                    <p className="text-xs text-gray-400 leading-relaxed">{task.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                    {task.deadline && (
                      <span className="flex items-center gap-1 font-mono" dir="ltr">
                        <Clock size={13} />
                        {task.deadline}
                      </span>
                    )}
                    {task.isApproved ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 size={13} /> معتمدة رسمياً ✓
                      </span>
                    ) : task.isUnderReview ? (
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <AlertCircle size={13} /> قيد مراجعة الليدر ⏳
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-brand-500 font-bold">
                        <AlertCircle size={13} /> قيد التنفيذ
                      </span>
                    )}
                  </div>
                </div>

                {/* السلايدر والتسليم */}
                <div className="w-full md:w-80 space-y-3 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-600 dark:text-gray-300">نسبة تقدمك:</span>
                    <span className="text-brand-600 dark:text-brand-400 font-mono text-sm">
                      {task.progress}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    disabled={task.isApproved}
                    value={task.progress}
                    onChange={(e) => handleProgressChange(task.id, Number(e.target.value))}
                    className="w-full accent-brand-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer disabled:opacity-40"
                  />

                  {!task.isApproved && (
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        onClick={() => handleSaveProgress(task, false)}
                        disabled={savingId === task.id}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-[11px] font-bold hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer disabled:opacity-50"
                      >
                        حفظ النسبة
                      </button>

                      <button
                        onClick={() => handleSaveProgress(task, true)}
                        disabled={savingId === task.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-bold shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                      >
                        <span>تسليم للمراجعة (100%)</span>
                        <Send size={11} className="rotate-180" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}