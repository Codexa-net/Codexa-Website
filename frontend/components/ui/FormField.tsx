import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function FormField({
  label,
  className,
  value,
  onChange,
  ...props
}: { label: string; className?: string; value?: string | number; onChange?: (e: any) => void } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-right">
      <span className="mb-2 block text-sm font-bold text-[#14161f] dark:text-white">{label}</span>
      <input
        value={value}
        onChange={onChange}
        className={cn(
          "w-full rounded-xl border border-border-subtle dark:border-gray-800 bg-[#f7f8fb] dark:bg-gray-900 px-4 py-3 text-right text-sm text-[#14161f] dark:text-white placeholder:text-[#9aa0ad] focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 transition-colors",
          className
        )}
        {...props}
      />
    </label>
  );
}

export function FormTextarea({
  label,
  className,
  value,
  onChange,
  ...props
}: { label: string; className?: string; value?: string; onChange?: (e: any) => void } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block text-right">
      <span className="mb-2 block text-sm font-bold text-[#14161f] dark:text-white">{label}</span>
      <textarea
        rows={3}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full resize-none rounded-xl border border-border-subtle dark:border-gray-800 bg-[#f7f8fb] dark:bg-gray-900 px-4 py-3 text-right text-sm text-[#14161f] dark:text-white placeholder:text-[#9aa0ad] focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 transition-colors",
          className
        )}
        {...props}
      />
    </label>
  );
}