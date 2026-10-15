"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Mail,
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

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include",
          headers: getAuthHeaders(),
        });

        if (res.ok) {
          const data = await res.json();
          const u = data?.data ?? data;
          if (u) {
            setProfile(u);
            setAvatar(u.avatar || "");
            setTechnologies(Array.isArray(u.technologies) ? u.technologies : []);
            setPhone(u.phone || "");
            setInstaPay(u.instaPay || "");
            setWalletNumber(u.walletNumber || "");
            setCvUrl(u.cvUrl || "");
          }
        }
      } catch (err) {
        console.error("فشل جلب بيانات الملف الشخصي:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [API_BASE]);

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
      const res = await fetch(`${API_BASE}/admin-users/${profile.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ avatar: null }),
      });

      if (res.ok) {
        setAvatar("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        try {
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
      }
    } catch {} finally {
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

    const payload = {
      avatar: avatar.trim() ? avatar.trim() : null,
      phone: phone.trim() || null,
      instaPay: instaPay.trim() || null,
      walletNumber: walletNumber.trim() || null,
      cvUrl: cvUrl.trim() || null,
      technologies: isSalesUser ? [] : technologies,
    };

    try {
      const res = await fetch(`${API_BASE}/admin-users/${profile.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMessage(true);
        try {
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            parsed.avatar = avatar.trim() || null;
            localStorage.setItem("user", JSON.stringify(parsed));
          }
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new Event("userUpdated"));
        } catch {}
        setTimeout(() => setSuccessMessage(false), 3000);
      } else {
        const errData = await res.json();
        alert(errData.message || "تعذر حفظ التعديلات");
      }
    } catch {
      alert("حدث خطأ أثناء الاتصال بالسيرفر");
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
      <div className="text-center py-20 text-gray-400 text-sm">
        تعذر تحميل بيانات المستخدم. تأكد من تسجيل الدخول.
      </div>
    );
  }

  const firstLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "ع";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-right" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
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
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold animate-fade-in">
            <CheckCircle2 size={16} />
            <span>تم حفظ التعديلات بنجاح ✓</span>
          </div>
        )}
      </div>

      {/* كارت الرصيد والمستحقات المالية في البروفايل */}
      <div className="p-5 rounded-2xl bg-gradient-to-l from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Coins size={24} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block">
              رصيدك المتاح والمعتمد للصرف
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {profile.walletBalance || 0}
              </span>
              <span className="text-xs font-bold text-gray-500">ج.م</span>
            </div>
            <p className="text-[10px] text-gray-400">
              سيتم التحويل مباشرة على حساب: {profile.instaPay ? `(InstaPay: ${profile.instaPay})` : profile.walletNumber ? `(كاش: ${profile.walletNumber})` : "يرجى تسجيل بيانات الدفع بالأسفل"}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/wallet"
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Wallet size={15} />
          <span>كشف الحساب وسجل الأرباح</span>
          <ArrowUpRight size={13} className="rotate-180" />
        </Link>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* كارت المعلومات الأساسية والصورة الشخصية */}
        <Card className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <Briefcase size={17} className="text-brand-500" />
            <span>المعلومات الوظيفية والصورة</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-gray-50/70 dark:bg-[#161a23]/60 border border-gray-100 dark:border-gray-800/80">
            <div className="relative group">
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-brand-600 text-white font-black text-3xl flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                {avatar ? (
                  <img src={avatar} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{firstLetter}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 end-0 h-8 w-8 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#111827] transition-all cursor-pointer"
                title="اختر صورة جديدة"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="space-y-2 text-center sm:text-right flex-1">
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">الصورة الشخصية</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  ستظهر صورتك في الهيدر، المهام المسندة إليك، وبطاقة فريق العمل.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
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
                  className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Camera size={13} />
                  <span>رفع صورة جديدة</span>
                </button>

                {avatar && (
                  <button
                    type="button"
                    disabled={isRemovingAvatar}
                    onClick={handleRemoveAvatar}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  >
                    {isRemovingAvatar ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    <span>{isRemovingAvatar ? "جاري الحذف..." : "إزالة الصورة"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-gray-400 block mb-1 font-bold">الاسم بالكامل</label>
              <input
                disabled
                value={profile.name}
                className="w-full bg-gray-50 dark:bg-[#161a23] border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1 font-bold">البريد الإلكتروني</label>
              <input
                disabled
                value={profile.email}
                className="w-full bg-gray-50 dark:bg-[#161a23] border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2 text-gray-500 dark:text-gray-400 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1 font-bold">المسمى الوظيفي</label>
              <input
                disabled
                value={ROLE_LABELS[profile.role] || profile.role}
                className="w-full bg-gray-50 dark:bg-[#161a23] border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2 text-brand-600 dark:text-brand-400 font-bold cursor-not-allowed"
              />
            </div>
          </div>
        </Card>

        {/* كارت المهارات والتقنيات (مخفي تماماً عن مسؤولي ومشرفي المبيعات) */}
        {!isSalesUser && (
          <Card className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Code2 size={18} className="text-brand-500" />
                <span>التقنيات والمهارات التي تعمل بها (Tech Stack)</span>
              </h2>
              <span className="text-[11px] font-mono text-brand-500 font-bold">
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
                  className="flex-1 bg-gray-50 dark:bg-[#161a23] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-brand-500 transition-all"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => handleAddTechnology(techInput)}
                  className="flex items-center gap-1 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  <Plus size={14} />
                  <span>إضافة</span>
                </button>
              </div>

              <div className="min-h-[50px] p-3 rounded-xl bg-gray-50 dark:bg-[#161a23]/60 border border-gray-100 dark:border-gray-800/80 flex flex-wrap items-center gap-2">
                {technologies.length === 0 ? (
                  <span className="text-xs text-gray-400 italic">
                    لم تقم بتحديد أي مهارات بعد. اكتب مهاراتك بالأعلى أو اختر من الاقتراحات بالأسفل.
                  </span>
                ) : (
                  technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 bg-brand-500/15 text-brand-500 dark:text-brand-400 border border-brand-500/30 px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all"
                      dir="ltr"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1 mb-2">
                  <Sparkles size={12} className="text-amber-500" />
                  <span>اقتراحات سريعة (اضغط للإضافة مباشرة):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SUGGESTIONS.filter((s) => !technologies.includes(s)).map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleAddTechnology(sug)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800/70 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 border border-gray-200 dark:border-gray-700/60 text-[11px] font-mono transition-all cursor-pointer"
                      dir="ltr"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* كارت بيانات التواصل والمستحقات */}
        <Card className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <CreditCard size={17} className="text-brand-500" />
            <span>بيانات التواصل والتحويل المالي (المعتمدة لاستلام أرباحك)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-600 dark:text-gray-300 block mb-1 font-bold">رقم الهاتف (واتساب)</label>
              <input
                type="text"
                placeholder="010XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#161a23] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-300 block mb-1 font-bold">رابط السيرة الذاتية (CV)</label>
              <input
                type="url"
                placeholder="https://..."
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#161a23] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500 font-mono text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-300 block mb-1 font-bold">عنوان إنستاباي (InstaPay)</label>
              <input
                type="text"
                placeholder="username@instapay"
                value={instaPay}
                onChange={(e) => setInstaPay(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#161a23] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-300 block mb-1 font-bold">رقم المحفظة الإلكترونية (كاش)</label>
              <input
                type="text"
                placeholder="010XXXXXXXX"
                value={walletNumber}
                onChange={(e) => setWalletNumber(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#161a23] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2 text-gray-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{isSaving ? "جاري حفظ التعديلات..." : "حفظ الصورة والبيانات"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}