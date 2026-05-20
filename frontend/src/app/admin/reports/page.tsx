"use client";

// HU13 — reportes (ventas, inventario, productos top).
// Cada tipo de reporte trae su `ReportStrategy` con sus columnas y query.
// Para agregar uno nuevo basta sumar una entrada al map STRATEGIES de abajo.
import { useMemo, useState } from "react";
import { Order, Product, InventoryMovement } from "@/types";
import { orderService, productService, inventoryService } from "@/services";
import { useAsync } from "@/hooks/useAsync";
import { toast } from "@/hooks/useToast";
import { formatCOP, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/features/dashboard/StatCard";

// ---- Estrategias de reporte -------------------------------------------------

type ReportType = "ventas" | "inventario" | "productos";

interface ReportContext {
  orders: Order[];
  products: Product[];
  movements: InventoryMovement[];
}

interface ReportStrategy<TRow> {
  type: ReportType;
  label: string;
  description: string;
  columns: Column<TRow>[];
  /** Genera las filas a partir del contexto y el rango. */
  generate(ctx: ReportContext, range: { from?: string; to?: string }): TRow[];
  /** Calcula KPIs resumen para mostrar arriba. */
  summary(rows: TRow[]): { label: string; value: string | number; icon?: string }[];
}

/* ---------- helpers --------------------------------------------------------- */

function inRange(iso: string, from?: string, to?: string): boolean {
  const t = new Date(iso).getTime();
  if (from && t < new Date(from).getTime()) return false;
  if (to && t > new Date(to).getTime() + 24 * 60 * 60 * 1000) return false;
  return true;
}

/* ---------- strategies ------------------------------------------------------ */

const ventasStrategy: ReportStrategy<Order> = {
  type: "ventas",
  label: "Ventas por período",
  description: "Pedidos entregados con detalle de cliente y total facturado",
  columns: [
    { key: "n", header: "Pedido", render: (o) => <span className="font-bold">#{o.number}</span> },
    { key: "c", header: "Cliente", render: (o) => o.customerName },
    { key: "i", header: "Productos", render: (o) => `${o.items.length}` },
    {
      key: "t",
      header: "Total",
      render: (o) => <span className="font-semibold">{formatCOP(o.total)}</span>,
    },
    { key: "d", header: "Fecha", render: (o) => formatDate(o.createdAt) },
  ],
  generate(ctx, range) {
    return ctx.orders
      .filter((o) => o.status === "Entregado" || o.status === "En camino")
      .filter((o) => inRange(o.createdAt, range.from, range.to))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
  summary(rows) {
    const total = rows.reduce((s, r) => s + r.total, 0);
    const items = rows.reduce((s, r) => s + r.items.length, 0);
    return [
      { label: "Pedidos", value: rows.length, icon: "📦" },
      { label: "Ingresos", value: formatCOP(total), icon: "💰" },
      { label: "Líneas", value: items, icon: "🧾" },
    ];
  },
};

const inventarioStrategy: ReportStrategy<InventoryMovement> = {
  type: "inventario",
  label: "Movimientos de inventario",
  description: "Entradas y salidas de stock en el rango seleccionado",
  columns: [
    { key: "p", header: "Producto", render: (m) => m.productName },
    {
      key: "t",
      header: "Tipo",
      render: (m) =>
        m.type === "Entrada" ? (
          <Badge variant="success">📥 Entrada</Badge>
        ) : (
          <Badge variant="coral">📤 Salida</Badge>
        ),
    },
    {
      key: "q",
      header: "Cantidad",
      render: (m) => (
        <span className={m.type === "Entrada" ? "text-emerald-600" : "text-coral-500"}>
          {m.type === "Entrada" ? "+" : "−"}
          {m.quantity}
        </span>
      ),
    },
    { key: "r", header: "Resultante", render: (m) => m.resultingStock },
    { key: "d", header: "Fecha", render: (m) => formatDate(m.createdAt) },
  ],
  generate(ctx, range) {
    return ctx.movements
      .filter((m) => inRange(m.createdAt, range.from, range.to))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
  summary(rows) {
    const entradas = rows.filter((m) => m.type === "Entrada").reduce((s, m) => s + m.quantity, 0);
    const salidas = rows.filter((m) => m.type === "Salida").reduce((s, m) => s + m.quantity, 0);
    return [
      { label: "Movimientos", value: rows.length, icon: "🔁" },
      { label: "Entradas", value: entradas, icon: "📥" },
      { label: "Salidas", value: salidas, icon: "📤" },
    ];
  },
};

const productosStrategy: ReportStrategy<Product> = {
  type: "productos",
  label: "Catálogo de productos",
  description: "Estado actual del catálogo, stock y valoración",
  columns: [
    { key: "n", header: "Producto", render: (p) => p.name },
    { key: "c", header: "Categoría", render: (p) => p.category },
    {
      key: "p",
      header: "Precio",
      render: (p) => <span className="font-semibold">{formatCOP(p.price)}</span>,
    },
    { key: "s", header: "Stock", render: (p) => p.stock },
    {
      key: "v",
      header: "Valor en stock",
      render: (p) => <span className="font-semibold">{formatCOP(p.price * p.stock)}</span>,
    },
  ],
  generate(ctx) {
    return [...ctx.products].sort((a, b) => b.stock * b.price - a.stock * a.price);
  },
  summary(rows) {
    const total = rows.reduce((s, p) => s + p.stock * p.price, 0);
    const sinStock = rows.filter((p) => p.stock === 0).length;
    return [
      { label: "Productos", value: rows.length, icon: "💊" },
      { label: "Valor total", value: formatCOP(total), icon: "💰" },
      { label: "Sin stock", value: sinStock, icon: "🛑" },
    ];
  },
};

// Para agregar un nuevo tipo de reporte: crea la estrategia arriba y súmala aquí.
const STRATEGIES: Record<ReportType, ReportStrategy<any>> = {
  ventas: ventasStrategy,
  inventario: inventarioStrategy,
  productos: productosStrategy,
};

// ---- Page --------------------------------------------------------------------

export default function AdminReportsPage() {
  const { data: orders } = useAsync(() => orderService.list(), []);
  const { data: products } = useAsync(() => productService.list(), []);
  const { data: movements } = useAsync(() => inventoryService.list(), []);

  const [type, setType] = useState<ReportType>("ventas");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [generated, setGenerated] = useState(false);

  const strategy = STRATEGIES[type];

  const rows = useMemo(() => {
    if (!generated) return [];
    return strategy.generate(
      { orders: orders ?? [], products: products ?? [], movements: movements ?? [] },
      { from, to }
    );
  }, [generated, strategy, orders, products, movements, from, to]);

  const summary = useMemo(() => strategy.summary(rows), [rows, strategy]);

  const handleGenerate = () => {
    setGenerated(true);
    toast.success(`Reporte "${strategy.label}" generado`);
  };

  const handleExport = async (format: "pdf" | "xlsx" | "csv") => {
    if (!generated || rows.length === 0) {
      toast.error("Primero genera un reporte con resultados");
      return;
    }
    try {
      const params = new URLSearchParams({ format });
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      // Llamada al backend pidiendo el archivo binario.
      const { api } = await import("@/lib/api");
      const res = await api.get(`/reports/${type}/export?${params.toString()}`, {
        responseType: "blob",
      });
      // Forzar descarga en el navegador.
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}_${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Reporte descargado en ${format.toUpperCase()}`);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message ?? "No se pudo exportar el reporte";
      toast.error(msg);
    }
  };

  return (
    <>
      <PageHeader
        title="Reportes"
        subtitle="Genera y exporta información clave del negocio"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">
        <Card>
          <CardHeader title="📑 Configuración del reporte" />
          <div className="space-y-4">
            <div>
              <Label htmlFor="type" required>Tipo de reporte</Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => {
                  setType(e.target.value as ReportType);
                  setGenerated(false);
                }}
              >
                {Object.values(STRATEGIES).map((s) => (
                  <option key={s.type} value={s.type}>
                    {s.label}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-text-muted mt-1.5">{strategy.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="from">Desde</Label>
                <Input
                  id="from"
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="to">Hasta</Label>
                <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>

            <Button fullWidth onClick={handleGenerate}>
              📊 Generar reporte
            </Button>

            <div className="border-t border-border pt-4">
              <div className="text-xs uppercase font-semibold text-text-muted mb-2">
                Exportar
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="secondary" onClick={() => handleExport("pdf")}>
                  📄 PDF
                </Button>
                <Button variant="secondary" onClick={() => handleExport("xlsx")}>
                  📈 Excel
                </Button>
                <Button variant="secondary" onClick={() => handleExport("csv")}>
                  📋 CSV
                </Button>
              </div>
            </div>

            <div className="bg-primary-50 border-l-2 border-primary-500 p-3 rounded-lg text-xs text-primary-700">
              💡 Si dejas las fechas vacías, se incluyen todos los registros.
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {generated && rows.length > 0 && (
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {summary.map((s) => (
                <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
              ))}
            </section>
          )}

          <Card>
            <CardHeader
              title={strategy.label}
              subtitle={
                generated
                  ? `${rows.length} registros encontrados`
                  : "Configura los parámetros y presiona Generar"
              }
            />
            {!generated ? (
              <EmptyState
                icon="📊"
                title="Aún no se ha generado un reporte"
                description="Selecciona un tipo y un rango de fechas, luego presiona el botón Generar."
              />
            ) : rows.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="Sin resultados"
                description="No hay registros para los criterios indicados."
              />
            ) : (
              <DataTable
                columns={strategy.columns}
                rows={rows}
                rowKey={(r: any) => r.id}
              />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
