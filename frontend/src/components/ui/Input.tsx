import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full px-3.5 py-2.5 rounded-lg border bg-white text-sm",
            "placeholder:text-text-soft text-text",
            "focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500",
            "transition-colors",
            error
              ? "border-coral-300 focus:ring-coral-100 focus:border-coral-400"
              : "border-border",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-coral-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export function Label({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[13px] font-medium text-text mb-1.5"
    >
      {children}
      {required && <span className="text-coral-500 ml-0.5">*</span>}
    </label>
  );
}
