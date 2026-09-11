"use server";

import { revalidatePath } from "next/cache";
import { serverFetchApi } from "@/lib/server-api";

export async function markMessageReadAction(id: string) {
  try {
    await serverFetchApi(`/admin/messages/${id}/read`, { method: "PATCH" });
    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteMessageAction(id: string) {
  try {
    await serverFetchApi(`/admin/messages/${id}`, { method: "DELETE" });
    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}