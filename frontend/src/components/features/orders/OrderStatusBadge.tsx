import { OrderStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { STATUS_META } from "@/lib/order-status-machine";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
