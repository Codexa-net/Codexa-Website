import { notFound } from "next/navigation";
import { serverFetchApi } from "@/lib/server-api";
import { ProjectForm } from "@/components/projects/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let project = null;
  try {
    project = await serverFetchApi(`/projects/${id}`);
  } catch (error) {
    notFound();
  }

  if (!project) {
    notFound();
  }

  return <ProjectForm project={project} />;
}