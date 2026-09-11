"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload, X, Link2, Loader2, Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createClientAction, updateClientAction } from "@/actions/clients";

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

export function ClientForm({ client }: { client?: any }) {
  const router = useRouter();

  const currentClient = client?.data || client;
  const isEdit = Boolean(currentClient?.id);

  const [logoUrl, setLogoUrl] = useState<string>(cleanUrl(currentClient?.logo));
  const [previewUrl, setPreviewUrl] = useState<string>(cleanUrl(currentClient?.logo));
  const [uploadTab, setUploadTab] = useState<"file" | "url">("file");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localBlob = URL.createObjectURL(file);
    setPreviewUrl(localBlob);

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        const sanitized = cleanUrl(data.url);
        setLogoUrl(sanitized);
      } else {
        alert(data.error || "تعذر رفع الشعار");
        setPreviewUrl("");
        setLogoUrl("");
      }
    } catch {
      alert("حدث خطأ أثناء رفع الشعار إلى السيرفر");
      setPreviewUrl("");
      setLogoUrl("");
    } finally {
      setIsUploading(false);
    }
  }

  function handleUrlChange(val: string) {
    const sanitized = cleanUrl(val);
    setPreviewUrl(sanitized);
    setLogoUrl(sanitized);
  }

  function removeLogo() {
    setPreviewUrl("");
    setLogoUrl("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name") as string,
      contact: formData.get("contact") as string,
      industry: formData.get("industry") as string,
      website: formData.get("website") as string,
      totalRevenue: Number(formData.get("totalRevenue")) || 0,
      status: formData.get("status") as string,
      logo: logoUrl.trim() ? cleanUrl(logoUrl) : null,
    };

    try {
      const res = isEdit
        ? await updateClientAction(currentClient.id, payload)
        : await createClientAction(payload);

      if (res.success) {
        router.push("/dashboard/clients");
        router.refresh();
      } else {
        alert(res.error || "حدث خطأ أثناء حفظ بيانات العميل");
        setIsSubmitting(false);
      }
    } catch {
      alert("تعذر الاتصال بالخادم، تأكد من تشغيل الباك إند");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 rounded-2xl bg-gradient-to-l from-brand-50 to-white dark:from-gray-900 dark:to-[#111827] p-6 text-right transition-colors">
        <h1 className="text-2xl font-bold text-[#14161f] dark:text-white">
          {isEdit ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
        </h1>
        <p className="mt-1 text-sm text-[#8b8f9c] dark:text-gray-400">
          إدارة سجلات الشركات وجهات التواصل والتعاقدات المالية
        </p>
      </div>

      <Card className="mb-6 p-6">
        <h2 className="mb-5 text-right text-lg font-bold text-[#14161f] dark:text-white">معلومات العميل والشركة</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="اسم العميل / الشركة"
            name="name"
            defaultValue={currentClient?.name}
            placeholder="مثال: شركة النور القابضة"
            required
          />
          <FormField
            label="مسؤول التواصل / الهاتف"
            name="contact"
            defaultValue={currentClient?.contact || currentClient?.contactPerson}
            placeholder="مثال: م. أحمد عبد العزيز - 0100000000"
          />
          <FormField
            label="مجال العمل / الصناعة"
            name="industry"
            defaultValue={currentClient?.industry}
            placeholder="مثال: تقنية المعلومات / تجارة إلكترونية"
          />
          <FormField
            label="الموقع الإلكتروني"
            name="website"
            type="url"
            defaultValue={currentClient?.website}
            placeholder="https://company.com"
          />
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <h2 className="mb-5 text-right text-lg font-bold text-[#14161f] dark:text-white">شعار العميل (Logo)</h2>
        <div className="text-right">
          {previewUrl ? (
            <div className="relative overflow-hidden rounded-xl border border-border-subtle dark:border-gray-800 bg-[#f7f8fb] dark:bg-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl border border-gray-200 dark:border-gray-700 bg-white p-1 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="شعار العميل"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#14161f] dark:text-white">تم تجهيز الشعار بنجاح</p>
                  <span className="text-xs text-gray-400 dir-ltr truncate max-w-xs">{logoUrl || "معاينة محلية"}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={removeLogo}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <X size={14} /> إزالة
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-border-subtle dark:border-gray-800 bg-[#f7f8fb] dark:bg-gray-800/40 p-4">
              <div className="mb-4 flex gap-2 border-b border-border-subtle dark:border-gray-700 pb-3">
                <button
                  type="button"
                  onClick={() => setUploadTab("file")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    uploadTab === "file"
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <Upload size={14} /> رفع من الجهاز
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTab("url")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    uploadTab === "url"
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <Link2 size={14} /> استخدام رابط مباشر
                </button>
              </div>

              {uploadTab === "file" ? (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle dark:border-gray-700 bg-white dark:bg-gray-850 px-4 py-6 text-sm text-[#8b8f9c] dark:text-gray-400 hover:border-brand-500 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                    {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Building2 size={20} />}
                  </div>
                  <span className="font-semibold text-[#14161f] dark:text-white">
                    {isUploading ? "جارٍ رفع الشعار..." : "اضغط لاختيار شعار العميل"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <Link2 size={16} className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    placeholder="الصق رابط شعار العميل هنا (مثال: https://...)"
                    value={logoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-white dark:bg-gray-850 dark:border-gray-700 dark:text-white py-3 pe-11 ps-4 text-right text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <h2 className="mb-5 text-right text-lg font-bold text-[#14161f] dark:text-white">الماليات والحالة</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="إجمالي الإيرادات ($)"
            name="totalRevenue"
            type="number"
            defaultValue={currentClient?.totalRevenue ?? 0}
            placeholder="0"
          />
          <label className="block text-right">
            <span className="mb-2 block text-sm font-bold text-[#14161f] dark:text-white">حالة العميل</span>
            <select
              name="status"
              defaultValue={currentClient?.status ?? "نشط"}
              className="w-full rounded-xl border border-border-subtle bg-[#f7f8fb] dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-3 text-right text-sm text-[#14161f] outline-none transition-colors"
            >
              <option value="نشط">نشط</option>
              <option value="معلق">معلق</option>
              <option value="سابق">سابق</option>
            </select>
          </label>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.push("/dashboard/clients")}
        >
          تراجع
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة العميل"}
        </Button>
      </div>
    </form>
  );
}