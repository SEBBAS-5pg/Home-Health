import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={cn(
            "w-full px-3.5 py-2.5 rounded-lg border bg-white text-sm text-text",
            "focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500",
            "transition-colors cursor-pointer",
            error ? "border-coral-300" : "border-border",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-xs text-coral-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
