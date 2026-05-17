import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "primary"
  | "coral"
  | "warning"
  | "success"
  | "danger"
  | "muted";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary-100 text-primary-700",
  coral:   "bg-coral-200 text-coral-700",
  warning: "bg-amber-100 text-amber-800",
  success: "bg-emerald-100 text-emerald-800",
  danger:  "bg-red-100 text-red-800",
  muted:   "bg-slate-200 text-slate-600",
};

export function Badge({
  variant = "primary",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
