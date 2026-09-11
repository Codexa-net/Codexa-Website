"use client";

import { useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormField } from "@/components/ui/FormField";

const ROLE_NAMES: Record<string, string> = {
  SUPER_ADMIN: "مدير نظام",
  SALES: "موظف مبيعات",
};

export default function ProfileClient({ initialUser, updateAction }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    id: "", name: "", role: "", email: "", phone: "", avatar: "", currentPassword: "", newPassword: "", confirmPassword: "", twoFactorEnabled: false
  });

  useEffect(() => {
    if (initialUser) {
      setFormData({
        id: initialUser.id || "",
        name: initialUser.name || "",
        role: ROLE_NAMES[initialUser.role?.toUpperCase()] || initialUser.role || "",
        email: initialUser.email || "",
        phone: initialUser.phone || "",
        avatar: initialUser.avatar || "",
        currentPassword: "", newPassword: "", confirmPassword: "",
        twoFactorEnabled: initialUser.twoFactorEnabled || false
      });

      if (initialUser.avatar) {
        window.dispatchEvent(new CustomEvent("profileUpdated", { 
          detail: { avatar: initialUser.avatar, name: initialUser.name } 
        }));
      }
    }
  }, [initialUser]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setStatusMessage({ text: "", type: "" });

    try {
      const payload: any = { 
        name: formData.name, 
        phone: formData.phone, 
        avatar: formData.avatar,
        twoFactorEnabled: formData.twoFactorEnabled 
      };

      if (formData.newPassword && formData.newPassword.trim() !== "") {
        if (formData.newPassword !== formData.confirmPassword) {
          setStatusMessage({ text: "كلمة المرور الجديدة غير متطابقة", type: "error" });
          setLoading(false);
          return;
        }
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const result = await updateAction(formData.id, payload);

      if (result && result.success === false) {
        setStatusMessage({ text: result.message || "فشل التحديث", type: "error" });
      } else {
        setStatusMessage({ text: "تم الحفظ بنجاح! ✨", type: "success" });
        
        if (payload.avatar) {
          localStorage.setItem("codexa_avatar", payload.avatar);
        }
        window.dispatchEvent(new CustomEvent("profileUpdated", { 
          detail: { avatar: payload.avatar, name: payload.name } 
        }));

        setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      }
    } catch (err) {
      setStatusMessage({ text: "تعذر الاتصال بالخادم", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const firstLetter = formData.name ? formData.name.trim().charAt(0) : "U";

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader title="إعدادات الملف الشخصي" description="تحديث معلوماتك الشخصية." />
      
      {statusMessage.text && (
        <div className={`p-4 rounded-xl text-sm text-right font-bold transition-all ${statusMessage.type === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}>
          {statusMessage.text}
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 border-b border-border-subtle pb-4">
          <Button onClick={handleSave} disabled={loading} className="px-6 cursor-pointer bg-brand-600 hover:bg-brand-700 text-white font-medium">
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
          <h2 className="text-right text-lg font-bold text-gray-900 dark:text-white">المعلومات الشخصية</h2>
        </div>

        <div className="mb-6 flex items-center justify-end gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{formData.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formData.role}</p>
          </div>
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-indigo-400 cursor-pointer shadow-md" onClick={handleImageClick}>
            {formData.avatar ? <img src={formData.avatar} alt="Profile" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">{firstLetter}</div>}
            <div className="absolute bottom-0 start-0 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white"><Camera size={12} /></div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-right">
          <FormField label="الاسم الكامل" value={formData.name} onChange={(e: any) => handleInputChange("name", e.target.value)} />
          <FormField label="المسمى الوظيفي" value={formData.role} disabled onChange={(e: any) => handleInputChange("role", e.target.value)} />
          <FormField label="البريد الإلكتروني" value={formData.email} disabled onChange={(e: any) => handleInputChange("email", e.target.value)} dir="ltr" />
          <FormField label="رقم الهاتف" value={formData.phone} onChange={(e: any) => handleInputChange("phone", e.target.value)} dir="ltr" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h2 className="text-right text-lg font-bold text-gray-900 dark:text-white">الأمان وكلمة المرور</h2>
        </div>
        
        <div className="space-y-6 text-right">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#14161f] dark:text-white">كلمة المرور الحالية</label>
              <input
                type="password"
                placeholder="********"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white"
              />
            </div>
            <div className="hidden sm:block"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#14161f] dark:text-white">كلمة المرور الجديدة</label>
              <input
                type="password"
                placeholder="********"
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#14161f] dark:text-white">تأكيد كلمة المرور</label>
              <input
                type="password"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-[#111827] dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end sm:justify-end pb-2">
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="rounded-full border border-brand-600 bg-transparent px-8 py-2 text-sm font-bold text-brand-600 transition-colors hover:bg-brand-50 dark:hover:bg-brand-900/30"
            >
              {loading ? "جاري..." : "تغيير كلمة المرور"}
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6 dark:border-gray-800">
            <div className="text-right">
              <h4 className="font-bold text-[#14161f] text-sm dark:text-white">المصادقة الثنائية (2FA)</h4>
              <p className="text-[11px] text-[#8b8f9c] mt-1 dark:text-gray-400">تأمين إضافي لحسابك باستخدام تطبيق المصادقة.</p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange("twoFactorEnabled", !formData.twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none ${formData.twoFactorEnabled ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              dir="ltr"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

        </div>
      </Card>
    </div>
  );
}