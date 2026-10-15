"use client";

import { useState, useEffect, useRef } from "react";
import { Link as LinkIcon, Upload, Loader2, CheckCircle2, ImageIcon, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormField, FormTextarea } from "@/components/ui/FormField";

export default function SettingsPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // استرجاع الإعدادات من التخزين المحلي أولاً حتى تفتح الصفحة فوراً وبدون أي شاشات خطأ
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("siteSettings");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      siteName: "Codexa",
      contactEmail: "codexa.egy@gmail.com",
      logo: "",
      logoUrl: "",
      metaTitle: "Codexa | شركة تطوير برمجيات رائدة",
      metaDescription: "نقدم حلولاً تقنية متكاملة لتطوير الويب وتطبيقات الهواتف.",
      keywords: "تطوير ويب, برمجة, تطبيقات, كوديكسا",
      linkedinUrl: "",
      facebookUrl: "",
      instagramUrl: "",
    };
  });

  const getAuthHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window === "undefined") return headers;

    let token =
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

  // جلب البيانات من السيرفر بهدوء في الخلفية دون تعطيل الصفحة
  useEffect(() => {
    let isMounted = true;

    async function loadServerSettings() {
      try {
        const res = await fetch(`${API_BASE}/settings`, {
          headers: getAuthHeaders(),
          credentials: "include",
        });

        if (res.ok && isMounted) {
          const data = await res.json();
          const s = data?.data ?? data;
          if (s && typeof s === "object") {
            setFormData((prev: any) => ({
              ...prev,
              siteName: s.siteName || prev.siteName,
              contactEmail: s.contactEmail || prev.contactEmail,
              metaTitle: s.metaTitle || prev.metaTitle,
              metaDescription: s.metaDescription || prev.metaDescription,
              keywords: s.keywords || prev.keywords,
              linkedinUrl: s.linkedinUrl ?? prev.linkedinUrl,
              facebookUrl: s.facebookUrl ?? prev.facebookUrl,
              instagramUrl: s.instagramUrl ?? prev.instagramUrl,
            }));
          }
        }
      } catch {
        // تجاهل انقطاع الاتصال حتى لا تظهر أي شاشة حمراء
      }
    }

    loadServerSettings();
    return () => {
      isMounted = false;
    };
  }, [API_BASE]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("حجم الملف يتجاوز 2 ميجابايت، يرجى اختيار صورة أصغر.");
      return;
    }

    try {
      setUploadingLogo(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("فشل الرفع");

      const result = await res.json();
      const uploadedUrl =
        result.url || result.path || result.secure_url || result.data?.url || result.data?.path;

      if (uploadedUrl) {
        setFormData((prev: any) => ({
          ...prev,
          logo: uploadedUrl,
          logoUrl: uploadedUrl,
        }));
      }
    } catch {
      alert("تعذر رفع الملف، يرجى المحاولة مرة أخرى.");
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // حفظ الإعدادات في قاعدة البيانات والتخزين المحلي معاً
  const handleSave = async () => {
    try {
      setLoading(true);
      setSuccessMessage(false);

      // حفظ محلي فوري
      localStorage.setItem("siteSettings", JSON.stringify(formData));

      // إرسال البيانات للسيرفر
      await fetch(`${API_BASE}/settings`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(formData),
      });

      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    } catch {
      // لو السيرفر غير متصل، البيانات محفوظة محلياً
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  const currentDisplayLogo = formData.logoUrl || formData.logo;

  return (
    <div className="space-y-6 text-right max-w-[1600px] mx-auto pb-10" dir="rtl">
      <PageHeader
        title="إعدادات الموقع"
        description="إدارة الهوية البصرية، إعدادات SEO، وروابط التواصل الاجتماعي."
        action={
          <div className="flex items-center gap-3">
            {successMessage && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-500 animate-fadeIn">
                <CheckCircle2 size={16} />
                تم الحفظ بنجاح
              </span>
            )}
            <Button onClick={handleSave} disabled={loading || uploadingLogo} className="cursor-pointer">
              {loading && <Loader2 className="animate-spin ms-2" size={16} />}
              حفظ التغييرات
            </Button>
          </div>
        }
      />

      {/* الإعدادات العامة */}
      <Card className="p-6">
        <h2 className="mb-5 text-lg font-bold text-[#14161f] dark:text-white">الإعدادات العامة</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="اسم الموقع"
            value={formData.siteName}
            onChange={(e: any) => handleChange("siteName", e.target.value)}
          />
          <FormField
            label="البريد الإلكتروني للاتصال"
            value={formData.contactEmail}
            onChange={(e: any) => handleChange("contactEmail", e.target.value)}
            dir="ltr"
          />
        </div>

        {/* قسم رفع الشعار */}
        <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
          <span className="mb-3 block text-sm font-bold text-[#14161f] dark:text-white">
            شعار الموقع (Logo)
          </span>
          <div className="flex flex-row-reverse items-center justify-end gap-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-[#f7f8fb] dark:border-gray-700 dark:bg-gray-800">
              {uploadingLogo ? (
                <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
              ) : currentDisplayLogo ? (
                <img
                  src={currentDisplayLogo}
                  alt="شعار الموقع"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon size={22} />
                  <span className="mt-1 text-[10px] font-semibold">شعار</span>
                </div>
              )}
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-[#14161f] shadow-xs transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 cursor-pointer"
                >
                  <Upload size={14} />
                  {uploadingLogo ? "جاري الرفع..." : "اختر ملف"}
                </button>
                {currentDisplayLogo && (
                  <button
                    type="button"
                    onClick={() => {
                      handleChange("logo", "");
                      handleChange("logoUrl", "");
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    title="حذف الشعار"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p className="mt-2 text-[11px] text-[#8b8f9c] dark:text-gray-400">
                PNG, SVG, JPG (بحد أقصى 2 ميجابايت)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* إعدادات SEO */}
      <Card className="p-6">
        <h2 className="mb-5 text-lg font-bold text-[#14161f] dark:text-white">
          إعدادات محركات البحث (SEO)
        </h2>
        <div className="space-y-5">
          <FormField
            label="عنوان الصفحة (Meta Title)"
            value={formData.metaTitle}
            onChange={(e: any) => handleChange("metaTitle", e.target.value)}
          />
          <FormTextarea
            label="وصف الصفحة (Meta Description)"
            value={formData.metaDescription}
            onChange={(e: any) => handleChange("metaDescription", e.target.value)}
          />
          <FormField
            label="الكلمات المفتاحية (Keywords)"
            value={formData.keywords}
            onChange={(e: any) => handleChange("keywords", e.target.value)}
          />
        </div>
      </Card>

      {/* روابط التواصل الاجتماعي */}
      <Card className="p-6">
        <h2 className="mb-5 text-lg font-bold text-[#14161f] dark:text-white">
          روابط التواصل الاجتماعي
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[
            { key: "linkedinUrl", label: "LinkedIn URL" },
            { key: "facebookUrl", label: "Facebook URL" },
            { key: "instagramUrl", label: "Instagram URL" },
          ].map(({ key, label }) => (
            <label key={key} className="block text-right">
              <span className="mb-2 block text-sm font-bold text-[#14161f] dark:text-white">
                {label}
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-[#f7f8fb] px-4 py-3 transition-colors dark:border-gray-700 dark:bg-gray-800/60">
                <LinkIcon size={16} className="text-gray-400" />
                <input
                  dir="ltr"
                  value={formData[key as keyof typeof formData] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full bg-transparent text-left text-sm text-[#14161f] placeholder:text-gray-400 outline-none dark:text-white"
                  placeholder={label}
                />
              </div>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}