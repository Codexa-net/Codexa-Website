import { notFound } from "next/navigation";
import { serverFetchApi } from "@/lib/server-api";
import { ClientForm } from "@/components/clients/ClientForm";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let client = null;
  try {
    client = await serverFetchApi(`/clients/${id}`);
  } catch {
    notFound();
  }

  if (!client) {
    notFound();
  }

  return <ClientForm client={client} />;
}