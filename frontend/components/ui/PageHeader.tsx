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
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex-1 text-right">
        <h1 className="text-xl sm:text-2xl font-bold text-[#14161f] dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-xs sm:text-sm text-[#8b8f9c] dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}