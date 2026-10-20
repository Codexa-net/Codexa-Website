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
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] p-4 transition-colors dark:bg-[#030712]">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#4b3fdf]">Codexa</h1>
          <p className="mt-2 text-sm text-[#8b8f9c] dark:text-gray-400">
            سجل الدخول للمتابعة إلى لوحة التحكم
          </p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          <FormField
            label="البريد الإلكتروني"
            name="email"
            type="email"
            placeholder="admin@codexa.com"
            required
            dir="ltr"
          />
          <FormField
            label="كلمة المرور"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            dir="ltr"
          />

          {error && (
            <div className="rounded-lg bg-rose-50 p-3 text-right text-xs font-bold text-rose-500 dark:bg-rose-500/10 dark:text-rose-400 sm:text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="mt-2 flex w-full justify-center rounded-xl bg-[#4b3fdf] py-3 font-bold text-white transition-all hover:bg-[#3f34c7] disabled:opacity-70"
            disabled={isPending}
          >
            {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}