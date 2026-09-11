import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border-subtle bg-white dark:bg-[#111827] dark:border-gray-800 dark:text-white transition-colors", className)}>
      {children}
    </div>
  );
}