"use client";

import Link from "next/link";
import { productService, orderService } from "@/services";
import { useAsync } from "@/hooks/useAsync";
import { formatCOP, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatCard } from "@/components/features/dashboard/StatCard";
import { AlertItem } from "@/components/features/dashboard/AlertItem";
import { OrderStatusBadge } from "@/components/features/orders/OrderStatusBadge";
import { Order } from "@/types";

export default function AdminDashboardPage() {
  const { data: orders } = useAsync(() => orderService.list(), []);
  const { data: lowStock } = useAsync(() => productService.getLowStock(), []);
  const { data: nearExpiry } = useAsync(() => productService.getNearExpiry(), []);

  const todayOrders = (orders ?? []).filter((o) => {
    const d = new Date(o.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);

  const orderColumns: Column<Order>[] = [
    {
      key: "number",
      header: "Pedido",
      render: (o) => <span className="font-bold">#{o.number}</span>,
    },
    { key: "customer", header: "Cliente", render: (o) => o.customerName },
    {
      key: "products",
      header: "Productos",
      render: (o) => `${o.items.length} producto${o.items.length === 1 ? "" : "s"}`,
    },
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
    {
      key: "date",
      header: "Fecha",
      render: (o) => formatDate(o.createdAt),
    },
  ];

  return (
    <>
      <PageHeader
        title="Buenos días, Sebastián 👋"
        subtitle="Aquí tienes un resumen del estado de la farmacia hoy"
        actions={
          <Link href="/admin/products">
            <Button size="sm">+ Nuevo producto</Button>
          </Link>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Pedidos del día"
          value={todayOrders.length}
          icon="📦"
          delta={{ value: "vs ayer", positive: true }}
        />
        <StatCard
          label="Ingresos del día"
          value={formatCOP(todayRevenue)}
          icon="💰"
          variant="success"
        />
        <StatCard
          label="Productos con stock bajo"
          value={(lowStock ?? []).length}
          icon="⚠️"
          variant="coral"
          delta={{ value: "Atención requerida", positive: false }}
        />
        <StatCard
          label="Por vencer (30d)"
          value={(nearExpiry ?? []).length}
          icon="⏰"
          variant="warning"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <Card>
          <CardHeader title="⚠️ Alertas activas" />
          <div className="space-y-2.5">
            {(lowStock ?? []).slice(0, 3).map((p) => (
              <AlertItem
                key={p.id}
                variant="stock"
                title="Stock bajo"
                description={`${p.name} tiene ${p.stock} unidades`}
              />
            ))}
            {(nearExpiry ?? []).slice(0, 2).map((p) => (
              <AlertItem
                key={p.id}
                variant="expiry"
                title="Por vencer"
                description={`${p.name} vence el ${formatDate(p.expiryDate!)}`}
              />
            ))}
            {(lowStock ?? []).length === 0 && (nearExpiry ?? []).length === 0 && (
              <p className="text-sm text-text-muted py-4 text-center">
                ✓ No hay alertas activas
              </p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Acciones rápidas" />
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/orders">
              <Button fullWidth variant="secondary">📦 Ver pedidos</Button>
            </Link>
            <Link href="/admin/inventory">
              <Button fullWidth variant="secondary">📈 Inventario</Button>
            </Link>
            <Link href="/admin/products">
              <Button fullWidth variant="secondary">💊 Productos</Button>
            </Link>
            <Link href="/admin/reports">
              <Button fullWidth variant="secondary">📑 Reportes</Button>
            </Link>
          </div>
        </Card>
      </section>

      <Card>
        <CardHeader
          title="Pedidos recientes"
          action={
            <Link
              href="/admin/orders"
              className="text-sm text-primary-700 font-medium hover:underline"
            >
              Ver todos →
            </Link>
          }
        />
        <DataTable
          columns={orderColumns}
          rows={(orders ?? []).slice(0, 5)}
          rowKey={(o) => o.id}
        />
      </Card>
    </>
  );
}
