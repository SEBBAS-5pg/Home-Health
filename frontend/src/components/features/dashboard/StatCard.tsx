import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  delta?: { value: string; positive?: boolean };
  variant?: "primary" | "coral" | "warning" | "success";
}

const variantStyles = {
  primary: "bg-primary-50 text-primary-700",
  coral:   "bg-coral-50 text-coral-700",
  warning: "bg-amber-100 text-amber-800",
  success: "bg-emerald-100 text-emerald-700",
};

export function StatCard({
  label,
  value,
  icon = "📊",
  delta,
  variant = "primary",
}: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 relative overflow-hidden">
      <div className="text-xs text-text-muted font-medium mb-1.5">{label}</div>
      <div className="text-[26px] font-extrabold text-text">{value}</div>
      {delta && (
        <div
          className={cn(
            "text-xs font-semibold mt-1",
            delta.positive ? "text-emerald-600" : "text-coral-500"
          )}
        >
          {delta.positive ? "↑" : "↓"} {delta.value}
        </div>
      )}
      <div
        className={cn(
          "absolute top-3.5 right-3.5 w-10 h-10 rounded-xl grid place-items-center text-lg",
          variantStyles[variant]
        )}
      >
        {icon}
      </div>
    </div>
  );
}
