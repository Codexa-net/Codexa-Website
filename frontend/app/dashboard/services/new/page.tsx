"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { createServiceAction } from "@/actions/services";

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createServiceAction(formData);

    setLoading(false);

    if (result.success) {
      router.push("/dashboard/services");
      router.refresh();
    } else {
      setErrorMessage(result.error || "تعذر حفظ الخدمة");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#14161f] dark:text-white">إضافة خدمة جديدة</h1>
          <p className="mt-1 text-xs text-[#8b8f9c] dark:text-gray-400">
            أدخل تفاصيل الخدمة التقنية لإدراجها في لوحة التحكم والموقع
          </p>
        </div>
        <Link
          href="/dashboard/services"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ArrowRight size={14} />
          رجوع للخدمات
        </Link>
      </div>

      <Card className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-[#111827]">
        {errorMessage && (
          <div className="mb-5 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">
              اسم الخدمة <span className="text-rose-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              placeholder="مثال: تطوير متجر إلكتروني متكامل"
              required
              className="w-full rounded-xl border border-gray-200 bg-[#f7f8fb] p-3 text-right outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">التصنيف</label>
              <input
                name="category"
                type="text"
                placeholder="مثال: برمجة ويب / تطبيقات"
                className="w-full rounded-xl border border-gray-200 bg-[#f7f8fb] p-3 text-right outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">السعر المبدئي ($)</label>
              <input
                name="startingPrice"
                type="number"
                placeholder="مثال: 500"
                className="w-full rounded-xl border border-gray-200 bg-[#f7f8fb] p-3 text-right outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">الحالة</label>
            <select
              name="status"
              className="w-full rounded-xl border border-gray-200 bg-[#f7f8fb] p-3 text-right outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="نشطة">نشطة</option>
              <option value="معطلة">معطلة</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-bold text-gray-700 dark:text-gray-300">وصف الخدمة</label>
            <textarea
              name="description"
              rows={3}
              placeholder="تفاصيل موجزة عن الخدمة..."
              className="w-full rounded-xl border border-gray-200 bg-[#f7f8fb] p-3 text-right outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 font-bold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              حفظ الخدمة
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}