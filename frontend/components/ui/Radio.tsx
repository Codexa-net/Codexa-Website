"use client";

import { cn } from "@/lib/utils";

export function Radio({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2"
      aria-checked={checked}
      role="radio"
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border-2",
          checked ? "border-brand-500" : "border-gray-300"
        )}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />}
      </span>
      {label && <span className="text-sm text-[#14161f]">{label}</span>}
    </button>
  );
}
