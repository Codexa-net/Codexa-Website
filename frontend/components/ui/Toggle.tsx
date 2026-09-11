"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function Toggle({
  defaultChecked = false,
  onChange,
}: {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => {
        const next = !checked;
        setChecked(next);
        onChange?.(next);
      }}
      className={cn(
        "relative h-7 w-12 rounded-full transition-colors",
        checked ? "bg-brand-500" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-0.5" : "translate-x-5"
        )}
      />
    </button>
  );
}
