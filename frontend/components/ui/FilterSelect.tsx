import { ChevronDown } from "lucide-react";

export function FilterSelect({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-full border border-border-subtle dark:border-gray-800 bg-white dark:bg-[#111827] px-4 py-2 text-sm text-[#14161f] dark:text-white transition-colors">
      <ChevronDown size={14} className="text-gray-400" />
      {label}
    </button>
  );
}