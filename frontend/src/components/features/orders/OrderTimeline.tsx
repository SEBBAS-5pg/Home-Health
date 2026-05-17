import { OrderStatus, OrderStatusChange } from "@/types";
import { ORDER_FLOW, STATUS_META } from "@/lib/order-status-machine";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  history: OrderStatusChange[];
  currentStatus: OrderStatus;
}

export function OrderTimeline({ history, currentStatus }: OrderTimelineProps) {
  // Si fue rechazado mostramos solo eso al final
  const flow = currentStatus === "Rechazado" ? ["Pendiente", "Rechazado"] : ORDER_FLOW;
  const reachedIndex = flow.indexOf(currentStatus);

  return (
    <div className="relative pl-6 mt-3">
      <div className="absolute left-2 top-1 bottom-0 w-0.5 bg-border" />
      {flow.map((status, idx) => {
        const change = history.find((h) => h.status === status);
        const isCurrent = status === currentStatus;
        const isDone = idx < reachedIndex;
        const isPending = idx > reachedIndex;

        const dotClass = isCurrent
          ? "bg-coral-400"
          : isDone
          ? "bg-emerald-500"
          : "bg-border";

        return (
          <div
            key={status}
            className={cn("relative pb-3.5", isPending && "opacity-40")}
          >
            <div
              className={cn(
                "absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full border-[3px] border-white shadow-sm",
                dotClass
              )}
            />
            <div className="text-[13px] font-semibold text-text">
              {STATUS_META[status as OrderStatus].label}
            </div>
            <div className="text-xs text-text-muted">
              {change ? formatDate(change.changedAt) : "Pendiente"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
