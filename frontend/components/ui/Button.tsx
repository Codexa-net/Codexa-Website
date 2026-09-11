import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger" | "danger-outline";
type Size = "default" | "sm" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  outline: "border border-brand-500 text-brand-500 hover:bg-brand-50 bg-white",
  ghost: "text-gray-500 hover:bg-gray-100",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  "danger-outline": "border border-rose-300 text-rose-600 hover:bg-rose-50 bg-white",
};

const sizes: Record<Size, string> = {
  default: "px-5 py-2.5 text-sm",
  sm: "px-4 py-2 text-xs",
  lg: "px-8 py-3 text-base",
  icon: "h-10 w-10 p-0",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
}

export function Button({
  variant = "primary",
  size = "default",
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function buttonVariants({
  variant = "primary",
  size = "default",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className
  );
}