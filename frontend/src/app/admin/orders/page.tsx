"use client";

import { useState } from "react";
import { Order, OrderStatus } from "@/types";
import { orderService } from "@/services";
import { useAsync } from "@/hooks/useAsync";
import { toast } from "@/hooks/useToast";
import { formatCOP, formatDate } from "@/lib/utils";
import { getNextStates, isTerminalState, ORDER_FLOW } from "@/lib/order-status-machine";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { DataTable, Column } from "@/components/ui/DataTable";
import { OrderStatusBadge } from "@/components/features/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/features/orders/OrderTimeline";

const STATUS_OPTIONS: ("all" | OrderStatus)[] = [
  "all",
  "Pendiente",
  "En preparacion",
  "En camino",
  "Entregado",
  "Rechazado",
];

const STATUS_LABELS: Record<string, string> = {
  all: "Todos",
  Pendiente: "Pendientes",
  "En preparacion": "En preparación",
  "En camino": "En camino",
  Entregado: "Entregados",
  Rechazado: "Rechazados",
};

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmReject, setConfirmReject] = useState(false);

  const { data: orders, refetch } = useAsync(
    () => orderService.list(filter === "all" ? {} : { status: filter }),
    [filter]
  );

  const selected = (orders ?? []).find((o) => o.id === selectedId)
    ?? (orders ?? [])[0]
    ?? null;

  const handleChangeStatus = async (next: OrderStatus) => {
    if (!selected) return;
    try {
      await orderService.changeStatus(selected.id, next);
      toast.success(`Estado actualizado a "${next}"`);
      void refetch();
    } catch (e: any) {
      const msg =
        e?.response?.data?.error?.message ??
        (e as Error)?.message ??
        "No se pudo cambiar el estado";
      toast.error(msg);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    try {
      await orderService.reject(selected.id);
      toast.success("Pedido rechazado");
      setConfirmReject(false);
      void refetch();
    } catch (e: any) {
      const msg =
        e?.response?.data?.error?.message ??
        (e as Error)?.message ??
        "No se pudo rechazar el pedido";
      toast.error(msg);
    }
  };

  const counts: Record<string, number> = {
    all: (orders ?? []).length,
    ...Object.fromEntries(
      ORDER_FLOW.concat("Rechazado").map((s) => [
        s,
        (orders ?? []).filter((o) => o.status === s).length,
      ])
    ),
  };

  const columns: Column<Order>[] = [
    {
      key: "number",
      header: "Pedido",
      render: (o) => <span className="font-bold">#{o.number}</span>,
    },
    { key: "customer", header: "Cliente", render: (o) => o.customerName },
    {
      key: "total",
      header: "Total",
      render: (o) => <span className="font-bold">{formatCOP(o.total)}</span>,
    },
    {
      key: "status",
      header: "Estado",
      render: (o) => <OrderStatusBadge status={o.status} />,
    },
    { key: "date", header: "Fecha", render: (o) => formatDate(o.createdAt) },
  ];

  return (
    <>
      <PageHeader
        title="Gestión de pedidos"
        subtitle="Administra el ciclo de vida de cada solicitud"
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_OPTIONS.map((s) => (
          <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {STATUS_LABELS[s]} ({counts[s] ?? 0})
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-5">
        <Card className="p-0 overflow-hidden">
          <DataTable
            columns={columns}
            rows={orders ?? []}
            rowKey={(o) => o.id}
            onRowClick={(o) => setSelectedId(o.id)}
          />
        </Card>

        {selected && (
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-text-muted">Pedido seleccionado</div>
                <h3 className="text-lg font-bold">#{selected.number}</h3>
              </div>
              <OrderStatusBadge status={selected.status} />
            </div>

            <div className="text-sm text-text-muted leading-relaxed mb-4 space-y-1">
              <div>
                <b className="text-text">Cliente:</b> {selected.customerName}
              </div>
              {selected.customerPhone && (
                <div>
                  <b className="text-text">Tel:</b> {selected.customerPhone}
                </div>
              )}
              <div>
                <b className="text-text">📍 Dirección:</b> {selected.deliveryAddress}
              </div>
              <div>
                <b className="text-text">Fecha:</b> {formatDate(selected.createdAt)}
              </div>
            </div>

            <div className="text-xs uppercase font-semibold text-text-muted mb-2">Productos</div>
            <div className="bg-bg rounded-xl p-3 text-sm space-y-1.5 mb-4">
              {selected.items.map((it) => (
                <div key={it.productId} className="flex justify-between">
                  <span>
                    {it.productName} ×{it.quantity}
                  </span>
                  <span className="font-semibold">{formatCOP(it.unitPrice * it.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-border font-bold">
                <span>Total</span>
                <span>{formatCOP(selected.total)}</span>
              </div>
            </div>

            <div className="text-xs uppercase font-semibold text-text-muted mb-2">Historial</div>
            <OrderTimeline history={selected.history} currentStatus={selected.status} />

            {!isTerminalState(selected.status) && (
              <div className="mt-5 space-y-2">
                <div className="text-xs uppercase font-semibold text-text-muted">
                  Cambiar estado
                </div>
                {getNextStates(selected.status)
                  .filter((s) => s !== "Rechazado")
                  .map((s) => (
                    <Button
                      key={s}
                      fullWidth
                      onClick={() => handleChangeStatus(s)}
                    >
                      Avanzar a: {s}
                    </Button>
                  ))}
                {selected.status === "Pendiente" && (
                  <Button
                    fullWidth
                    variant="danger"
                    onClick={() => setConfirmReject(true)}
                  >
                    ✗ Rechazar pedido
                  </Button>
                )}
              </div>
            )}
          </Card>
        )}
      </div>

      <ConfirmModal
        open={confirmReject}
        onClose={() => setConfirmReject(false)}
        onConfirm={handleReject}
        title="Rechazar pedido"
        description={`¿Confirmas rechazar el pedido #${selected?.number}? Esta acción no se puede revertir.`}
        confirmLabel="Sí, rechazar"
      />
    </>
  );
}
