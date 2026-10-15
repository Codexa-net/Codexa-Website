"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, FormTextarea } from "@/components/ui/FormField";
import { createProjectAction, updateProjectAction } from "@/actions/projects";

const categories = ["متاجر إلكترونية", "تطبيقات ويب", "تطبيقات الجوال", "أنظمة إدارية", "هوية بصرية"];

function cleanUrl(url?: string | null): string {
  if (!url) return "";
  let res = url.trim();
  if (res.startsWith("http://") || res.startsWith("https://") || res.startsWith("blob:")) {
    return res;
  }
  if (!res.startsWith("/")) {
    res = `/${res}`;
  }
  return res.replace(/\/+$/, "");
}

export function ProjectForm({ project }: { project?: any }) {
  const router = useRouter();

  const currentProject = project?.data || project;
  const isEdit = Boolean(currentProject?.id);

  const initialTechs = Array.isArray(currentProject?.technologies) 
    ? currentProject.technologies.map((t: any) => typeof t === "string" ? t : t.name) 
    : [];

  const [technologies, setTechnologies] = useState<string[]>(initialTechs);
  const [dbTechnologies, setDbTechnologies] = useState<any[]>([]);
  
  const [techInput, setTechInput] = useState("");
  const [progress, setProgress] = useState<number>(currentProject?.progress ?? 0);
  
  const [coverUrl, setCoverUrl] = useState<string>(cleanUrl(currentProject?.cover));
  const [previewUrl, setPreviewUrl] = useState<string>(cleanUrl(currentProject?.cover));
  
  const [uploadTab, setUploadTab] = useState<"file" | "url">("file");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حالة زر العرض العام
  const [isPublic, setIsPublic] = useState<boolean>(Boolean(currentProject?.isPublic));

  // مزامنة حالة المشروع عند فتح شاشة التعديل
  useEffect(() => {
    if (currentProject?.isPublic !== undefined) {
      setIsPublic(Boolean(currentProject.isPublic));
    }
    if (currentProject?.cover) {
      const sanitized = cleanUrl(currentProject.cover);
      setCoverUrl(sanitized);
      setPreviewUrl(sanitized);
    }
  }, [currentProject?.isPublic, currentProject?.cover]);

  // جلب التقنيات من الباك إند
  useEffect(() => {
    fetch("http://localhost:3001/technologies")
      .then((res) => res.json())
      .then((data) => setDbTechnologies(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching techs:", err));
  }, []);

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
        setCoverUrl(cleanUrl(data.url));
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

  function handleUrlChange(val: string) {
    const sanitized = cleanUrl(val);
    setPreviewUrl(sanitized);
    setCoverUrl(sanitized);
  }

  function removeImage() {
    setPreviewUrl("");
    setCoverUrl("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const finalTechnologies = [...technologies];
    if (techInput.trim() && !finalTechnologies.includes(techInput.trim())) {
      finalTechnologies.push(techInput.trim());
      
      fetch("http://localhost:3001/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: techInput.trim(), category: "General" }),
      }).catch((err) => console.log("Failed to auto-save tech", err));
    }

    if (finalTechnologies.length === 0) {
      alert("يرجى اختيار أو كتابة تقنية واحدة على الأقل");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      cover: coverUrl.trim() ? cleanUrl(coverUrl) : null,
      category: formData.get("category") as string,
      managerName: formData.get("managerName") as string,
      designerName: formData.get("designerName") as string,
      deadline: formData.get("deadline") as string,
      priority: formData.get("priority") as string,
      status: formData.get("status") as string,
      technologies: finalTechnologies.map((techName) => ({ name: techName })), 
      progress: Number(progress),
      isPublic: Boolean(isPublic),
      clientEmail: (formData.get("clientEmail") as string)?.trim() || null,
    };

    try {
      const res = isEdit
        ? await updateProjectAction(currentProject.id, payload)
        : await createProjectAction(payload);

      if (res.success) {
        router.push("/dashboard/projects");
        router.refresh();
      } else {
        alert(res.error || "حدث خطأ أثناء حفظ المشروع");
        setIsSubmitting(false);
      }
    } catch {
      alert("تعذر الاتصال بالخادم");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} dir="rtl">
      <div className="mb-6 rounded-2xl bg-gradient-to-l from-brand-50 to-white dark:from-gray-900 dark:to-[#111827] p-6 text-right transition-colors">
        <h1 className="text-2xl font-bold text-[#14161f] dark:text-white">
          {isEdit ? "تعديل المشروع" : "إنشاء مشروع جديد"}
        </h1>
        <p className="mt-1 text-sm text-[#8b8f9c] dark:text-gray-400">إدارة ومتابعة جميع مشاريعك من مكان واحد</p>
      </div>

      <Card className="mb-6 p-6">
        <h2 className="mb-5 text-right text-lg font-bold text-[#14161f] dark:text-white">معلومات أساسية</h2>
        <div className="space-y-5">
          <FormField label="اسم المشروع" name="name" defaultValue={currentProject?.name} required />
          <FormTextarea label="وصف المشروع" name="description" defaultValue={currentProject?.description} />

          <div className="text-right">
            <span className="mb-2 block text-sm font-bold text-[#14161f] dark:text-white">صورة غلاف المشروع</span>
            {previewUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-border-subtle dark:border-gray-800 bg-[#f7f8fb] dark:bg-gray-800 p-2">
                <div className="relative h-52 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <img src={previewUrl} alt="غلاف المشروع" className="h-full w-full object-cover" />
                </div>
                <div className="mt-2.5 flex items-center justify-between px-1">
                  <button type="button" onClick={removeImage} className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer">
                    <X size={14} /> إزالة أو تغيير الصورة
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border-subtle dark:border-gray-800 bg-[#f7f8fb] dark:bg-gray-800/40 p-4">
                <div className="mb-4 flex gap-2 border-b border-border-subtle dark:border-gray-700 pb-3">
                  <button type="button" onClick={() => setUploadTab("file")} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${uploadTab === "file" ? "bg-brand-600 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"}`}>رفع من الجهاز</button>
                  <button type="button" onClick={() => setUploadTab("url")} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${uploadTab === "url" ? "bg-brand-600 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"}`}>استخدام رابط مباشر</button>
                </div>

                {uploadTab === "file" ? (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle dark:border-gray-700 bg-white dark:bg-gray-850 px-4 py-8 text-sm text-[#8b8f9c] dark:text-gray-400 hover:border-brand-500 transition-colors">
                    <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="hidden" />
                    <span>اضغط لاختيار صورة من جهازك</span>
                  </label>
                ) : (
                  <input type="url" placeholder="الصق رابط الصورة هنا..." value={coverUrl} onChange={(e) => handleUrlChange(e.target.value)} className="w-full rounded-xl border border-border-subtle bg-white dark:bg-gray-850 dark:border-gray-700 dark:text-white py-3 px-4 text-right text-sm outline-none" />
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <h2 className="mb-5 text-right text-lg font-bold text-[#14161f] dark:text-white">إعدادات العميل والعرض</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <FormField 
              label="إيميل العميل (لربط المشروع ببوابة العملاء)" 
              name="clientEmail" 
              type="email"
              dir="ltr"
              placeholder="client@company.com"
              defaultValue={currentProject?.clientEmail} 
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
              سيظهر المشروع تلقائياً لهذا العميل عند تسجيل الدخول بهذا الإيميل.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <span className="mb-3 block text-sm font-bold text-[#14161f] dark:text-white text-right">
              ظهور المشروع للعامة
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={isPublic}
                onClick={() => setIsPublic((prev) => !prev)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPublic ? "bg-brand-600" : "bg-gray-300 dark:bg-gray-700"
                }`}
                dir="ltr"
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isPublic ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span 
                onClick={() => setIsPublic((prev) => !prev)}
                className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
              >
                عرض في معرض أعمالنا (Portfolio)
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <h2 className="mb-5 text-right text-lg font-bold text-[#14161f] dark:text-white">التصنيف والتقنيات</h2>
        <div className="space-y-5">
          <label className="block text-right">
            <span className="mb-2 block text-sm font-bold text-[#14161f] dark:text-white">تصنيف المشروع</span>
            <select name="category" defaultValue={currentProject?.category ?? categories[0]} className="w-full rounded-xl border border-border-subtle bg-[#f7f8fb] dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-3 text-right text-sm outline-none">
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </label>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-[#14161f] dark:text-white text-right">التقنيات المستخدمة</label>
            <div className="flex min-h-[50px] flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-[#f7f8fb] p-2 dark:border-gray-800 dark:bg-gray-900/50">
              {technologies.map((tech: string) => (
                <span key={tech} className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-600 dark:bg-brand-950/40 dark:text-brand-400" dir="ltr">
                  <button type="button" onClick={() => setTechnologies(technologies.filter((t) => t !== tech))} className="text-brand-400 hover:text-brand-700 cursor-pointer">✕</button>
                  {tech}
                </span>
              ))}
              <input 
                type="text" 
                value={techInput} 
                onChange={(e) => setTechInput(e.target.value)} 
                placeholder={technologies.length === 0 ? "اكتب تقنية واضغط Enter..." : ""} 
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && !technologies.includes(val)) setTechnologies([...technologies, val]);
                    setTechInput("");
                  }
                }} 
                className="flex-1 bg-transparent px-2 py-1 text-sm outline-none" 
                dir="ltr" 
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 justify-end" dir="ltr">
              {dbTechnologies.map((t) => t.name).filter((t: string) => !technologies.includes(t)).map((tech: string) => (
                <button key={tech} type="button" onClick={() => setTechnologies([...technologies, tech])} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:border-gray-700 dark:bg-[#111827] dark:text-gray-300 cursor-pointer">
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <h2 className="mb-5 text-right text-lg font-bold text-[#14161f] dark:text-white">الفريق والجدولة ونسبة الإنجاز</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="مدير المشروع" name="managerName" defaultValue={currentProject?.managerName} />
          <FormField label="مصمم UI/UX" name="designerName" defaultValue={currentProject?.designerName} />
          <FormField label="موعد التسليم" name="deadline" type="date" defaultValue={currentProject?.deadline} />
          <label className="block text-right">
            <span className="mb-2 block text-sm font-bold text-[#14161f] dark:text-white">الأولوية</span>
            <select name="priority" defaultValue={currentProject?.priority ?? "متوسطة"} className="w-full rounded-xl border border-border-subtle bg-[#f7f8fb] dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-3 text-right text-sm outline-none">
              <option value="عالية">عالية</option>
              <option value="متوسطة">متوسطة</option>
              <option value="منخفضة">منخفضة</option>
            </select>
          </label>
          <label className="block text-right sm:col-span-2">
            <span className="mb-2 block text-sm font-bold text-[#14161f] dark:text-white">الحالة</span>
            <select name="status" defaultValue={currentProject?.status ?? "قيد التنفيذ"} className="w-full rounded-xl border border-border-subtle bg-[#f7f8fb] dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-3 text-right text-sm outline-none">
              <option value="قيد التنفيذ">قيد التنفيذ</option>
              <option value="قيد المراجعة">قيد المراجعة</option>
              <option value="مكتمل">مكتمل</option>
              <option value="متأخر">متأخر</option>
            </select>
          </label>

          <div className="text-right sm:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-brand-600">{progress}%</span>
              <span className="text-sm font-bold text-[#14161f] dark:text-white">نسبة الإنجاز</span>
            </div>
            <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer accent-brand-600" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={() => router.push("/dashboard/projects")}>تراجع</Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إنشاء المشروع"}
        </Button>
      </div>
    </form>
  );
}