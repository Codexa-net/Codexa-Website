import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/services/ServiceForm";
import { services } from "@/lib/data";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = services.find((s) => s.id === id);
  if (!service) notFound();

  return <ServiceForm service={service} />;
}

export function generateStaticParams() {
  return services.map((s) => ({ id: s.id }));
}
