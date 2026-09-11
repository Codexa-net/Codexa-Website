export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      {action}
      <div className="flex-1 text-right">
        <h1 className="text-2xl font-bold text-[#14161f]">{title}</h1>
        {description && <p className="mt-1 text-sm text-[#8b8f9c]">{description}</p>}
      </div>
    </div>
  );
}
