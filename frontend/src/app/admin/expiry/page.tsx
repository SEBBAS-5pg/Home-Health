"use client";

// HU13 — vencimientos.
// La función `clasificarVencimiento` decide la categoría (vencido/urgente/próximo/ok)
// en un solo lugar; tanto el filtro como el badge la consumen.
import { useMemo, useState } from "react";
import { Product } from "@/types";
import { productService } from "@/services";
import { useAsync } from "@/hooks/useAsync";
import { daysUntil, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/features/dashboard/StatCard";
import { toast } from "@/hooks/useToast";

// Genera un CSV simple a partir de un array de objetos.
// Vive aquí porque solo la usa esta página; si se reusa, mover a lib/utils.
function downloadCsv<T extends Record<string, unknown>>(filename: string, rows: T[]) {
  if (rows.length === 0) {
    toast.error("No hay registros para exportar");
    return;
  }
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

type ExpiryStatus = "vencido" | "urgente" | "proximo" | "ok";

interface ExpiryClassification {
  status: ExpiryStatus;
  label: string;
  variant: "danger" | "coral" | "warning" | "success" | "muted";
}

/**
 * Función pura: dada una fecha (o ausencia), devuelve la categoría.
 * Es la única fuente de verdad para clasificar vencimientos.
 */
function classifyExpiry(expiryDate?: string): ExpiryClassification {
  if (!expiryDate) {
    return { status: "ok", label: "Sin fecha", variant: "muted" };
  }
  const days = daysUntil(expiryDate);
  if (days < 0) return { status: "vencido", label: "Vencido", variant: "danger" };
  if (days <= 30) return { status: "urgente", label: `${days} días`, variant: "coral" };
  if (days <= 60) return { status: "proximo", label: `${days} días`, variant: "warning" };
  return { status: "ok", label: `${days} días`, variant: "success" };
}

const FILTER_OPTIONS: { value: ExpiryStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "vencido", label: "Vencidos" },
  { value: "urgente", label: "Urgentes (≤30d)" },
  { value: "proximo", label: "Próximos (≤60d)" },
];

export default function AdminExpiryPage() {
  const { data: products } = useAsync(() => productService.list(), []);
  const [filter, setFilter] = useState<ExpiryStatus | "all">("all");

  // Memoizamos clasificación para evitar recálculos en cada render.
  const classified = useMemo(
    () =>
      (products ?? []).map((p) => ({
        product: p,
        classification: classifyExpiry(p.expiryDate),
      })),
    [products]
  );

  const counts = useMemo(
    () => ({
      vencido: classified.filter((x) => x.classification.status === "vencido").length,
      urgente: classified.filter((x) => x.classification.status === "urgente").length,
      proximo: classified.filter((x) => x.classification.status === "proximo").length,
      ok: classified.filter((x) => x.classification.status === "ok").length,
    }),
    [classified]
  );

  const filtered = classified.filter((x) => {
    if (filter === "all") return x.classification.status !== "ok";
    return x.classification.status === filter;
  });

  const columns: Column<(typeof classified)[number]>[] = [
    {
      key: "product",
      header: "Producto",
      render: ({ product }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-50 grid place-items-center text-base">
            {product.imageEmoji ?? "💊"}
          </div>
          <div>
            <div className="font-semibold">{product.name}</div>
            {product.sku && <div className="text-xs text-text-muted">SKU: {product.sku}</div>}
          </div>
        </div>
      ),
    },
    { key: "category", header: "Categoría", render: ({ product }) => product.category },
    {
      key: "expiry",
      header: "Vencimiento",
      render: ({ product }) => (product.expiryDate ? formatDate(product.expiryDate) : "—"),
    },
    {
      key: "stock",
      header: "Stock",
      render: ({ product }) => <span className="font-semibold">{product.stock}</span>,
    },
    {
      key: "status",
      header: "Estado",
      render: ({ classification }) => (
        <Badge variant={classification.variant}>{classification.label}</Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Control de vencimientos"
        subtitle="Productos próximos a vencer y vencidos"
        actions={
          <Button
            variant="secondary"
            onClick={() =>
              downloadCsv(
                `vencimientos_${new Date().toISOString().slice(0, 10)}.csv`,
                filtered.map(({ product, classification }) => ({
                  Producto: product.name,
                  SKU: product.sku ?? "",
                  Vencimiento: product.expiryDate ?? "",
                  Estado: classification.label,
                  Stock: product.stock,
                })),
              )
            }
          >
            📋 Exportar lista
          </Button>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Vencidos"
          value={counts.vencido}
          icon="🛑"
          variant="coral"
          delta={{ value: "Retirar de catálogo", positive: false }}
        />
        <StatCard
          label="Urgentes (≤30d)"
          value={counts.urgente}
          icon="⏰"
          variant="warning"
        />
        <StatCard label="Próximos (≤60d)" value={counts.proximo} icon="📅" />
        <StatCard label="En buen estado" value={counts.ok} icon="✅" variant="success" />
      </section>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTER_OPTIONS.map((opt) => (
          <Chip key={opt.value} active={filter === opt.value} onClick={() => setFilter(opt.value)}>
            {opt.label}
          </Chip>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon="✅"
            title="Sin productos en esta categoría"
            description="No hay productos que coincidan con el filtro seleccionado."
          />
        ) : (
          <DataTable
            columns={columns}
            rows={filtered}
            rowKey={({ product }: { product: Product }) => product.id}
          />
        )}
      </Card>
    </>
  );
}
