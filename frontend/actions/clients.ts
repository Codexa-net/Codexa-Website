"use server";

import { revalidatePath } from "next/cache";
import { serverFetchApi } from "@/lib/server-api";

function formatUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const clean = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return clean.replace(/\/+$/, "");
}

export async function createClientAction(data: any) {
  try {
    const payload: any = {
      name: data.name?.trim(),
      industry: data.industry?.trim() || null,
      contact: data.contact?.trim() || null,
      logo: formatUrl(data.logo),
      website: data.website?.trim() || null,
      totalRevenue: Number(data.totalRevenue) || 0,
      status: data.status || "نشط",
    };

    const res: any = await serverFetchApi("/clients", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res?.statusCode && res.statusCode >= 400) {
      const msg = Array.isArray(res.message) ? res.message.join(" - ") : res.message;
      return { success: false, error: msg || "فشل إنشاء العميل" };
    }

    revalidatePath("/dashboard/clients");
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function updateClientAction(id: string, data: any) {
  try {
    const payload: any = {
      name: data.name?.trim(),
      industry: data.industry?.trim() || null,
      contact: data.contact?.trim() || null,
      logo: formatUrl(data.logo),
      website: data.website?.trim() || null,
      totalRevenue: Number(data.totalRevenue) || 0,
      status: data.status || "نشط",
    };

    const res: any = await serverFetchApi(`/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    if (res?.statusCode && res.statusCode >= 400) {
      const msg = Array.isArray(res.message) ? res.message.join(" - ") : res.message;
      return { success: false, error: msg || "فشل تحديث العميل" };
    }

    revalidatePath("/dashboard/clients");
    revalidatePath(`/dashboard/clients/${id}/edit`);
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteClientAction(id: string) {
  try {
    await serverFetchApi(`/clients/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/clients");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}