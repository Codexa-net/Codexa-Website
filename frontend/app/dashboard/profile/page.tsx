"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  User,
  Briefcase,
  Code2,
  Save,
  Loader2,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Plus,
  X,
  Camera,
  Trash2,
  Coins,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  track?: string | null;
  phone?: string | null;
  cvUrl?: string | null;
  instaPay?: string | null;
  walletNumber?: string | null;
  walletBalance?: number;
  totalWithdrawn?: number;
  technologies: string[];
}

const COMMON_SUGGESTIONS = [
  "Figma", "UI/UX", "Adobe XD", "Photoshop", "Illustrator",
  "HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Vue.js",
  "Node.js", "Express", "NestJS", "Prisma", "PostgreSQL", "MySQL", "MongoDB", "PHP", "Laravel",
  "Flutter", "React Native", "Swift", "Kotlin", "Git & GitHub", "Docker"
];

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "مدير النظام (Super Admin)",
  UI_UX_LEAD: "قائد فريق التصميم و UI/UX",
  BACKEND_LEAD: "قائد فريق Backend",
  FRONTEND_LEAD: "قائد فريق Frontend",
  FULL_STACK_LEAD: "قائد فريق Full-Stack",
  MOBILE_APP_LEAD: "قائد فريق Mobile",
  DEVELOPER: "مطور برمجيات",
  UI_UX_DESIGNER: "مصمم واجهات وتجربة مستخدم",
  GRAPHIC_DESIGNER: "مصمم جرافيك",
  SALES: "مسؤول مبيعات",
  SALES_LEADER: "مشرف مبيعات",
};

export default function ProfilePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const [avatar, setAvatar] = useState<string>("");
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [instaPay, setInstaPay] = useState("");
  const [walletNumber, setWalletNumber] = useState("");
  const [cvUrl, setCvUrl] = useState("");

  const getAuthHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window === "undefined") return headers;
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("adminToken");
    if (token) headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/i, "")}`;
    return headers;
  };

  const applyUserDataToState = useCallback((u: any) => {
    if (!u || !u.name) return;

    // دمج أي تعديلات محفوظة لهذا المستخدم تحديداً
    let userOv: any = {};
    try {
      const rawOv = localStorage.getItem("codexa_users_overrides");
      if (rawOv) {
        const overrides = JSON.parse(rawOv);
        userOv = overrides[u.id] || overrides[(u.email || "").toLowerCase()] || {};
      }
    } catch {}

    const merged: UserProfile = {
      ...u,
      ...userOv,
      id: u.id,
      name: u.name,
      email: u.email,
      role: (u.role || "DEVELOPER").toUpperCase(),
      technologies: Array.isArray(userOv.technologies)
        ? userOv.technologies
        : Array.isArray(u.technologies)
          ? u.technologies
          : [],
    };

    setProfile(merged);
    setAvatar(merged.avatar || "");
    setTechnologies(merged.technologies);
    setPhone(merged.phone || "");
    setInstaPay(merged.instaPay || "");
    setWalletNumber(merged.walletNumber || "");
    setCvUrl(merged.cvUrl?.replace("#graphic", "") || "");
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      // 1. قراءة المستخدم النشط الموثق من TopNav أولاً
      const win = window as unknown as { __codexaActiveUser?: any };
      if (win.__codexaActiveUser?.name) {
        applyUserDataToState(win.__codexaActiveUser);
      } else {
        const saved = localStorage.getItem("user") || localStorage.getItem("codexa_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.name) applyUserDataToState(parsed);
        }
      }

      // 2. جلب أحدث البيانات من السيرفر إن وجد
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        const u = data?.data ?? data;
        if (u && u.name) {
          applyUserDataToState(u);
        }
      }
    } catch (err) {
      console.error("فشل جلب بيانات الملف الشخصي:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE, applyUserDataToState]);

  useEffect(() => {
    loadProfile();
    const onSynced = () => loadProfile();
    window.addEventListener("codexaUserSynced", onSynced);
    return () => window.removeEventListener("codexaUserSynced", onSynced);
  }, [loadProfile]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 3 ميجابايت");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    if (!profile) return;
    setIsRemovingAvatar(true);
    try {
      await fetch(`${API_BASE}/admin-users/${profile.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ avatar: null }),
      }).catch(() => null);

      setAvatar("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      try {
        const rawOv = localStorage.getItem("codexa_users_overrides");
        const overrides = rawOv ? JSON.parse(rawOv) : {};
        overrides[profile.id] = { ...(overrides[profile.id] || {}), avatar: null };
        localStorage.setItem("codexa_users_overrides", JSON.stringify(overrides));

        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          parsed.avatar = null;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("userUpdated"));
      } catch {}
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  const handleAddTechnology = (tech: string) => {
    const clean = tech.trim();
    if (!clean) return;
    if (!technologies.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setTechnologies([...technologies, clean]);
    }
    setTechInput("");
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setTechnologies(technologies.filter((t) => t !== techToRemove));
  };

  const isSalesUser = profile?.role === "SALES" || profile?.role === "SALES_LEADER";

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    setSuccessMessage(false);

    const isGraphic =
      profile.role === "GRAPHIC_DESIGNER" || profile.cvUrl?.includes("#graphic");
    const finalCvUrl = cvUrl.trim()
      ? cvUrl.trim() + (isGraphic ? "#graphic" : "")
      : isGraphic
        ? "#graphic"
        : null;

    const payload = {
      avatar: avatar.trim() ? avatar.trim() : null,
      phone: phone.trim() || null,
      instaPay: instaPay.trim() || null,
      walletNumber: walletNumber.trim() || null,
      cvUrl: finalCvUrl,
      technologies: isSalesUser ? [] : technologies,
    };

    try {
      // حفظ التعديلات محلياً للعضو الحالي وفي الـ API معاً
      const rawOv = localStorage.getItem("codexa_users_overrides");
      const overrides = rawOv ? JSON.parse(rawOv) : {};
      overrides[profile.id] = { ...(overrides[profile.id] || {}), ...payload };
      overrides[profile.email.toLowerCase()] = {
        ...(overrides[profile.email.toLowerCase()] || {}),
        ...payload,
      };
      localStorage.setItem("codexa_users_overrides", JSON.stringify(overrides));

      const updatedProfile = { ...profile, ...payload };
      setProfile(updatedProfile);
      localStorage.setItem("user", JSON.stringify(updatedProfile));
      localStorage.setItem("codexa_user", JSON.stringify(updatedProfile));
      const win = window as unknown as { __codexaActiveUser?: any };
      win.__codexaActiveUser = updatedProfile;

      await fetch(`${API_BASE}/admin-users/${profile.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      }).catch(() => null);

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("userUpdated"));
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch {
      alert("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        تعذر تحميل بيانات المستخدم. تأكد من تسجيل الدخول.
      </div>
    );
  }

  const firstLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "ي";

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12 text-right" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5 dark:border-gray-800">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-black text-gray-900 dark:text-white">
            <span>الملف الشخصي والمهارات</span>
            <User className="text-brand-500" size={24} />
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isSalesUser
              ? "حدد صورتك وبيانات التحويل المالي الخاصة بك لمتابعة العمولات والتواصل."
              : "حدد صورتك، مهاراتك، وبيانات التحويل المالي الخاصة بك لتسهيل التواصل وإسناد المهام."}
          </p>
        </div>

        {successMessage && (
          <div className="animate-fade-in flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 size={16} />
            <span>تم حفظ التعديلات بنجاح ✓</span>
          </div>
        )}
      </div>

      {/* كارت الرصيد والمستحقات المالية في البروفايل */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-l from-emerald-500/15 via-emerald-500/5 to-transparent p-5 shadow-xs md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Coins size={24} />
          </div>
          <div className="space-y-0.5">
            <span className="block text-[11px] font-bold text-gray-500 dark:text-gray-400">
              رصيدك المتاح والمعتمد للصرف
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {profile.walletBalance || 0}
              </span>
              <span className="text-xs font-bold text-gray-500">ج.م</span>
            </div>
            <p className="text-[10px] text-gray-400">
              سيتم التحويل مباشرة على حساب:{" "}
              {profile.instaPay
                ? `(InstaPay: ${profile.instaPay})`
                : profile.walletNumber
                  ? `(كاش: ${profile.walletNumber})`
                  : "يرجى تسجيل بيانات الدفع بالأسفل"}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/wallet"
          className="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-500"
        >
          <Wallet size={15} />
          <span>كشف الحساب وسجل الأرباح</span>
          <ArrowUpRight size={13} className="rotate-180" />
        </Link>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* كارت المعلومات الأساسية والصورة الشخصية */}
        <Card className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
          <h2 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-bold text-gray-900 dark:border-gray-800 dark:text-white">
            <Briefcase size={17} className="text-brand-500" />
            <span>المعلومات الوظيفية والصورة</span>
          </h2>

          <div className="flex flex-col items-center gap-6 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:flex-row dark:border-gray-800/80 dark:bg-[#161a23]/60">
            <div className="group relative">
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-brand-600 text-3xl font-black text-white shadow-lg dark:border-gray-800">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{firstLetter}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className=" absolute bottom-0 end-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-brand-600 text-white shadow-md transition-all hover:bg-brand-500 dark:border-[#111827]"
                title="اختر صورة جديدة"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-right">
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  الصورة الشخصية
                </h3>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  ستظهر صورتك في الهيدر، المهام المسندة إليك، وبطاقة فريق العمل.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleImageFileChange}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-500"
                >
                  <Camera size={13} />
                  <span>رفع صورة جديدة</span>
                </button>

                {avatar && (
                  <button
                    type="button"
                    disabled={isRemovingAvatar}
                    onClick={handleRemoveAvatar}
                    className="flex cursor-pointer items-center gap-1 rounded-xl border border-rose-200 bg-rose-50/50 px-3 py-1.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400"
                  >
                    {isRemovingAvatar ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                    <span>
                      {isRemovingAvatar ? "جاري الحذف..." : "إزالة الصورة"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
            <div>
              <label className="mb-1 block font-bold text-gray-400">
                الاسم بالكامل
              </label>
              <input
                disabled
                value={profile.name}
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-gray-500 dark:border-gray-800 dark:bg-[#161a23] dark:text-gray-400"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-gray-400">
                البريد الإلكتروني
              </label>
              <input
                disabled
                value={profile.email}
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 font-mono text-gray-500 dark:border-gray-800 dark:bg-[#161a23] dark:text-gray-400"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-gray-400">
                المسمى الوظيفي
              </label>
              <input
                disabled
                value={ROLE_LABELS[profile.role] || profile.role}
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 font-bold text-brand-600 dark:border-gray-800 dark:bg-[#161a23] dark:text-brand-400"
              />
            </div>
          </div>
        </Card>

        {/* كارت المهارات والتقنيات */}
        {!isSalesUser && (
          <Card className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <Code2 size={18} className="text-brand-500" />
                <span>التقنيات والمهارات التي تعمل بها (Tech Stack)</span>
              </h2>
              <span className="font-mono text-[11px] font-bold text-brand-500">
                {technologies.length} مهارات مسجلة
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب تقنية أو أداة (مثال: React, Figma, NestJS, Tailwind) واضغط Enter..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTechnology(techInput);
                    }
                  }}
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand-500 dark:border-gray-700 dark:bg-[#161a23] dark:text-white"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => handleAddTechnology(techInput)}
                  className="flex shrink-0 cursor-pointer items-center gap-1 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-brand-500"
                >
                  <Plus size={14} />
                  <span>إضافة</span>
                </button>
              </div>

              <div className="flex min-h-[50px] flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800/80 dark:bg-[#161a23]/60">
                {technologies.length === 0 ? (
                  <span className="text-xs italic text-gray-400">
                    لم تقم بتحديد أي مهارات بعد. اكتب مهاراتك بالأعلى أو اختر من الاقتراحات بالأسفل.
                  </span>
                ) : (
                  technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-brand-500/30 bg-brand-500/15 px-3 py-1 font-mono text-xs font-bold text-brand-500 transition-all dark:text-brand-400"
                      dir="ltr"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="cursor-pointer text-gray-400 transition-colors hover:text-rose-500"
                        title="حذف"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="pt-2">
                <span className="mb-2 flex items-center gap-1 text-[11px] font-bold text-gray-400">
                  <Sparkles size={12} className="text-amber-500" />
                  <span>اقتراحات سريعة (اضغط للإضافة مباشرة):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SUGGESTIONS.filter((s) => !technologies.includes(s)).map(
                    (sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => handleAddTechnology(sug)}
                        className="cursor-pointer rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-1 font-mono text-[11px] text-gray-600 transition-all hover:bg-brand-50 hover:text-brand-600 dark:border-gray-700/60 dark:bg-gray-800/70 dark:text-gray-300 dark:hover:bg-brand-950/40 dark:hover:text-brand-400"
                        dir="ltr"
                      >
                        + {sug}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* كارت بيانات التواصل والمستحقات */}
        <Card className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
          <h2 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-bold text-gray-900 dark:border-gray-800 dark:text-white">
            <CreditCard size={17} className="text-brand-500" />
            <span>بيانات التواصل والتحويل المالي (المعتمدة لاستلام أرباحك)</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
            <div>
              <label className="mb-1 block font-bold text-gray-600 dark:text-gray-300">
                رقم الهاتف (واتساب)
              </label>
              <input
                type="text"
                placeholder="010XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-[#161a23] dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-gray-600 dark:text-gray-300">
                رابط السيرة الذاتية (CV)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-left font-mono text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-[#161a23] dark:text-white"
                dir="ltr"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-gray-600 dark:text-gray-300">
                عنوان إنستاباي (InstaPay)
              </label>
              <input
                type="text"
                placeholder="username@instapay"
                value={instaPay}
                onChange={(e) => setInstaPay(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-[#161a23] dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-gray-600 dark:text-gray-300">
                رقم المحفظة الإلكترونية (كاش)
              </label>
              <input
                type="text"
                placeholder="010XXXXXXXX"
                value={walletNumber}
                onChange={(e) => setWalletNumber(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-[#161a23] dark:text-white"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-brand-500 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>
              {isSaving ? "جاري حفظ التعديلات..." : "حفظ الصورة والبيانات"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}