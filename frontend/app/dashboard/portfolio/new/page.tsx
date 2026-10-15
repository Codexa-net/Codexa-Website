"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, FormTextarea } from "@/components/ui/FormField";
import { createProjectAction, updateProjectAction } from "@/actions/projects";

const portfolioCategories = [
  "أنظمة برمجية خاصة",
  "مواقع وتطبيقات ويب",
  "متاجر إلكترونية",
  "تطبيقات الجوال",
  "تصميم واجهات UI/UX",
];

export default function PortfolioFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [loading, setLoading] = useState(!!editId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDataState, setFormDataState] = useState({
    name: "",
    category: portfolioCategories[0],
    liveUrl: "",
    caseStudyUrl: "",
    description: "",
    services: "",
  });
  const [coverUrl, setCoverUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [uploadTab, setUploadTab] = useState<"file" | "url">("file");
  const [isUploading, setIsUploading] = useState(false);

  // 🟢 دالة جلب التوكن الحقيقي للمستخدم (لحماية الـ fetch)
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
    // 🟢 التأكد من وجود الـ editId بشكل سليم لتجنب طلبات undefined
    if (!editId || editId === "undefined" || editId === "null") {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchProject() {
      try {
        const res = await fetch(`http://localhost:3001/projects/${editId}`, {
          headers: getAuthHeaders(),
          credentials: "include",
        });

        if (res.ok && isMounted) {
          const data = await res.json();
          const projectData = data?.data ?? data;
          
          if (projectData) {
            setFormDataState({
              name: projectData.name || "",
              category: projectData.category || portfolioCategories[0],
              liveUrl: projectData.liveUrl || "",
              caseStudyUrl: projectData.caseStudyUrl || "",
              description: projectData.description || "",
              services: projectData.services || "",
            });
            if (projectData.cover) {
              setCoverUrl(projectData.cover);
              setPreviewUrl(projectData.cover);
            }
            if (Array.isArray(projectData.technologies)) {
              setTechnologies(
                projectData.technologies.map((t: any) => (typeof t === "string" ? t : t.name))
              );
            }
          }
        }
      } catch (err) {
        // تجاهل الخطأ بهدوء لمنع ظهور الشاشة الحمراء
        console.error("خطأ في جلب بيانات العمل:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [editId]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localBlob = URL.createObjectURL(file);
    setPreviewUrl(localBlob);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setCoverUrl(data.url);
      } else {
        alert(data.error || "تعذر رفع الصورة");
        setPreviewUrl("");
        setCoverUrl("");
      }
    } catch {
      alert("حدث خطأ أثناء رفع الصورة إلى السيرفر");
      setPreviewUrl("");
      setCoverUrl("");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const fData = new FormData(form);

    const finalTechs = [...technologies];
    if (techInput.trim() && !finalTechs.includes(techInput.trim())) {
      finalTechs.push(techInput.trim());
    }

    const payload: any = {
      name: fData.get("name") as string,
      category: fData.get("category") as string,
      liveUrl: (fData.get("liveUrl") as string)?.trim() || null,
      caseStudyUrl: (fData.get("caseStudyUrl") as string)?.trim() || null,
      description: (fData.get("description") as string)?.trim() || null,
      services: (fData.get("services") as string)?.trim() || null,
      cover: coverUrl.trim() || null,
      technologies: finalTechs.map((t) => ({ name: t })),
      isPublic: true,
      status: "مكتمل",
    };

    try {
      let res;
      if (editId) {
        res = await updateProjectAction(editId, payload);
      } else {
        res = await createProjectAction({
          ...payload,
          progress: 100,
          priority: "عالية",
        });
      }

      if (res?.success) {
        router.push("/dashboard/portfolio");
        router.refresh();
      } else {
        alert(res?.error || "حدث خطأ أثناء الحفظ، تأكد من البيانات");
      }
    } catch (err: any) {
      alert(err?.message || "تعذر الاتصال بالسيرفر");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-bold text-gray-400">
        جارٍ تحميل بيانات العمل...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} dir="rtl" className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl bg-gradient-to-l from-brand-50 to-white dark:from-gray-900 dark:to-[#111827] p-6 text-right">
        <h1 className="text-2xl font-bold text-[#14161f] dark:text-white">
          {editId ? "تعديل العمل في سابقة الأعمال" : "إضافة عمل إلى سابقة الأعمال"}
        </h1>
        <p className="mt-1 text-sm text-[#8b8f9c] dark:text-gray-400">
          هذه البيانات مخصصة لصفحة العرض فقط للزوار.
        </p>
      </div>

      <Card className="p-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            label="اسم المشروع / المنصة"
            name="name"
            required
            defaultValue={formDataState.name}
            placeholder="مثال: منصة النور الطبية"
          />

          <label className="block text-right">
            <span className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300">
              التصنيف
            </span>
            <select
              name="category"
              defaultValue={formDataState.category}
              className="w-full rounded-xl border border-gray-200 bg-[#f7f8fb] dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-2.5 text-xs outline-none"
            >
              {portfolioCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            label="رابط الموقع الحي (Live Preview URL)"
            name="liveUrl"
            dir="ltr"
            defaultValue={formDataState.liveUrl}
            placeholder="https://example.com"
          />
          <FormField
            label="رابط دراسة الحالة أو التصميم (اختياري)"
            name="caseStudyUrl"
            dir="ltr"
            defaultValue={formDataState.caseStudyUrl}
            placeholder="https://behance.net/..."
          />
        </div>

        <FormTextarea
          label="نبذة سريعة عن المشروع وما تم تنفيذه"
          name="description"
          rows={3}
          defaultValue={formDataState.description}
          placeholder="اكتب نبذة مختصرة عن المشروع والهدف منه..."
        />

        {/* حقل مميزات النظام */}
        <FormTextarea
          label="أبرز مميزات وخدمات النظام (اكتب كل ميزة في سطر منفصل)"
          name="services"
          rows={4}
          defaultValue={formDataState.services}
          placeholder={"- إدارة المواعيد وحجوزات الكشف إلكترونياً\n- سجل طبي رقمي شامل لكل مريض ومتابعة الفحوصات\n- لوحة تحكم إدارية للتقارير والفواتير الطبية المعتمدة"}
        />

        {/* رفع ومعاينة الصورة */}
        <div>
          <span className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300">
            صورة الغلاف / المعاينة
          </span>
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-[#f7f8fb] dark:bg-gray-800/40 p-4">
            <div className="mb-3 flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              <button
                type="button"
                onClick={() => setUploadTab("file")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  uploadTab === "file"
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                رفع من الجهاز
              </button>
              <button
                type="button"
                onClick={() => setUploadTab("url")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  uploadTab === "url"
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                رابط مباشر
              </button>
            </div>

            {uploadTab === "file" ? (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 px-4 py-6 text-xs text-gray-500 hover:border-brand-500">
                <Upload size={20} className="text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <span>{isUploading ? "جارٍ رفع الصورة..." : "اضغط لاختيار صورة من جهازك"}</span>
              </label>
            ) : (
              <input
                type="url"
                dir="ltr"
                placeholder="https://..."
                value={coverUrl}
                onChange={(e) => {
                  setCoverUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-850 dark:border-gray-700 dark:text-white px-4 py-2.5 text-xs outline-none"
              />
            )}

            {previewUrl && (
              <div className="mt-3 relative h-48 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <img src={previewUrl} alt="معاينة" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* التقنيات */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            التقنيات المستخدمة (Tech Stack)
          </label>
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-[#f7f8fb] p-2 dark:border-gray-700 dark:bg-gray-800">
            {technologies.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600 dark:bg-brand-950/40 dark:text-brand-400"
                dir="ltr"
              >
                <button
                  type="button"
                  onClick={() => setTechnologies(technologies.filter((tech) => tech !== t))}
                  className="cursor-pointer hover:text-rose-500"
                >
                  ✕
                </button>
                {t}
              </span>
            ))}
            <input
              type="text"
              dir="ltr"
              placeholder="اكتب تقنية ثم اضغط Enter..."
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (val && !technologies.includes(val)) {
                    setTechnologies([...technologies, val]);
                    setTechInput("");
                  }
                }
              }}
              className="flex-1 bg-transparent px-2 text-xs outline-none"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={() => router.push("/dashboard/portfolio")}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? "جارٍ الحفظ..." : editId ? "حفظ التعديلات" : "نشر في سابقة الأعمال"}
        </Button>
      </div>
    </form>
  );
}