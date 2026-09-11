"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import type { Service } from "@/lib/data";

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const isEdit = !!service;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/dashboard/services");
      }}
      className="mx-auto max-w-xl"
    >
      <h1 className="mb-6 text-center text-2xl font-extrabold text-[#14161f]">
        {isEdit ? "تعديل الخدمة" : "إضافة خدمة"}
      </h1>

      <Card className="space-y-5 p-6">
        <FormField label="اسم الخدمة" defaultValue={service?.name} placeholder="اسم الخدمة" required />
        <FormField label="التصنيف" defaultValue={service?.category} placeholder="التصنيف" />
        <FormField
          label="السعر المبدئي"
          type="number"
          defaultValue={service?.basePrice}
          placeholder="السعر المبدئي"
        />
      </Card>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" type="button" className="flex-1" onClick={() => router.push("/dashboard/services")}>
          تراجع
        </Button>
        <Button type="submit" className="flex-1">
          {isEdit ? "تعديل" : "إضافة الخدمة"}
        </Button>
      </div>
    </form>
  );
}
