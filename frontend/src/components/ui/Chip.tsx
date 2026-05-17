import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({ active, className, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors",
        active
          ? "bg-primary-500 text-white border-primary-500"
          : "bg-white text-text-muted border-border hover:bg-bg hover:text-text",
        className
      )}
      {...props}
    />
  );
}
