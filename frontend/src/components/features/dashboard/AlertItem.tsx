import { cn } from "@/lib/utils";

interface AlertItemProps {
  variant: "stock" | "expiry";
  title: string;
  description: string;
}

const styles = {
  stock:  "bg-coral-50 border-coral-200 text-coral-700",
  expiry: "bg-amber-50 border-amber-200 text-amber-800",
};

const icons = {
  stock: "⚠️",
  expiry: "⏰",
};

export function AlertItem({ variant, title, description }: AlertItemProps) {
  return (
    <div
      className={cn(
        "flex gap-3 items-start p-3 rounded-lg border text-[13px]",
        styles[variant]
      )}
    >
      <span className="text-lg leading-none">{icons[variant]}</span>
      <div>
        <b className="font-bold">{title}:</b> {description}
      </div>
    </div>
  );
}
