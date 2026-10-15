"use server";

import { revalidatePath } from "next/cache";
import { serverFetchApi } from "@/lib/server-api";

export async function createProjectAction(data: any) {
  try {
    const payload: any = {
      name: data.name,
      description: data.description || null,
      shortDescription: data.shortDescription || null,
      cover: data.cover || null,
      category: data.category || null,
      status: data.status || "قيد التنفيذ",
      priority: data.priority || "متوسطة",
      progress: Number(data.progress) || 0,
      deadline: data.deadline || null,
      managerName: data.managerName || null,
      designerName: data.designerName || null,
      isPublic: Boolean(data.isPublic),
      clientEmail: data.clientEmail ? data.clientEmail.trim() : null,
      technologies: Array.isArray(data.technologies)
        ? data.technologies
        : typeof data.technologies === "string"
        ? data.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
      glowColor: data.glowColor || null,
    };

    if (data.clientId) {
      payload.clientId = data.clientId;
    }

    const newProject = await serverFetchApi("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    revalidatePath("/dashboard/projects");
    revalidatePath("/ar/our-work");
    revalidatePath("/en/our-work");
    return { success: true, data: newProject };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function updateProjectAction(id: string, data: any) {
  try {
    const payload: any = {
      name: data.name,
      description: data.description || null,
      shortDescription: data.shortDescription || null,
      cover: data.cover || null,
      category: data.category || null,
      status: data.status || "قيد التنفيذ",
      priority: data.priority || "متوسطة",
      progress: Number(data.progress) || 0,
      deadline: data.deadline || null,
      managerName: data.managerName || null,
      designerName: data.designerName || null,
      isPublic: Boolean(data.isPublic),
      clientEmail: data.clientEmail ? data.clientEmail.trim() : null,
      technologies: Array.isArray(data.technologies)
        ? data.technologies
        : typeof data.technologies === "string"
        ? data.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
      glowColor: data.glowColor || null,
    };

    if (data.clientId) {
      payload.clientId = data.clientId;
    }

    const updated = await serverFetchApi(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${id}/edit`);
    revalidatePath("/ar/our-work");
    revalidatePath("/en/our-work");
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await serverFetchApi(`/projects/${id}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/projects");
    revalidatePath("/ar/our-work");
    revalidatePath("/en/our-work");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}