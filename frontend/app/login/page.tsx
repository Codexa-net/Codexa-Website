"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] dark:bg-[#030712] p-4 transition-colors">
      <div className="w-full max-w-md rounded-2xl border border-border-subtle dark:border-gray-800 bg-white dark:bg-[#111827] p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-brand-500">Codexa</h1>
          <p className="mt-2 text-sm text-[#8b8f9c] dark:text-gray-400">سجل الدخول للمتابعة إلى لوحة التحكم</p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          <FormField
            label="البريد الإلكتروني"
            name="email"
            type="email"
            placeholder=""
            required
            dir="ltr"
          />
          <FormField
            label="كلمة المرور"
            name="password"
            type="password"
            placeholder=""
            required
            dir="ltr"
          />

          {error && (
            <div className="rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3 text-right text-sm font-bold text-rose-500 dark:text-rose-400">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full mt-2 flex justify-center py-3" disabled={isPending}>
            {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}