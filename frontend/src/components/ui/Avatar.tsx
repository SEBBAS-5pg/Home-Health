import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  variant?: "primary" | "coral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-[13px]",
  lg: "w-11 h-11 text-sm",
};

const variants = {
  primary: "bg-primary-100 text-primary-700",
  coral:   "bg-coral-200 text-coral-700",
};

export function Avatar({
  initials,
  variant = "primary",
  size = "md",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full grid place-items-center font-bold flex-shrink-0",
        sizes[size],
        variants[variant],
        className
      )}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
