"use client";

import { useState } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/types";
import { orderService } from "@/services";
import { useAsync } from "@/hooks/useAsync";
import { formatCOP, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderStatusBadge } from "@/components/features/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/features/orders/OrderTimeline";

const STATUS_FILTERS: ("all" | OrderStatus)[] = [
  "all",
  "Pendiente",
  "En preparacion",
  "En camino",
  "Entregado",
  "Rechazado",
];

export default function MyOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const { data: orders, loading } = useAsync(
    () =>
      orderService.list({
        customerId: "u-001",
        ...(statusFilter !== "all" && { status: statusFilter }),
      }),
    [statusFilter]
  );

  const renderOrder = (order: Order) => (
    <Card key={order.id} className="p-5">
      <div className="flex justify-between items-start gap-3 flex-wrap mb-3">
        <div>
          <div className="text-xs text-text-muted font-mono">#{order.number}</div>
          <div className="font-bold text-base">Pedido del {formatDate(order.createdAt)}</div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {order.items.map((item) => (
          <span
            key={item.productId}
            className="text-xs bg-bg px-3 py-1 rounded-full text-text-muted"
          >
            {item.productName} ×{item.quantity}
          </span>
        ))}
      </div>

      {order.status !== "Rechazado" && order.status !== "Entregado" && (
        <OrderTimeline history={order.history} currentStatus={order.status} />
      )}

      <div className="flex justify-between items-center pt-3 mt-3 border-t border-border-light text-sm text-text-muted">
        <span>📍 {order.deliveryAddress}</span>
        <span className="font-bold text-text">Total: {formatCOP(order.total)}</span>
      </div>
    </Card>
  );

  return (
    <>
      <PageHeader
        title="Mis pedidos"
        subtitle="Sigue el estado de tus solicitudes en tiempo real"
        actions={
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-auto"
          >
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En preparacion">En preparación</option>
            <option value="En camino">En camino</option>
            <option value="Entregado">Entregado</option>
            <option value="Rechazado">Rechazado</option>
          </Select>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-border h-32 animate-pulse" />
          ))}
        </div>
      ) : (orders ?? []).length === 0 ? (
        <EmptyState
          icon="📦"
          title="Aún no tienes pedidos registrados"
          description="Cuando hagas tu primera compra, aparecerá aquí."
          action={
            <Link href="/catalog">
              <Button>Explorar catálogo</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">{(orders ?? []).map(renderOrder)}</div>
      )}
    </>
  );
}
