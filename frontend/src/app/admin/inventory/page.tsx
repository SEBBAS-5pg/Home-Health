"use client";

import { useState } from "react";
import { MovementType } from "@/types";
import { productService, inventoryService } from "@/services";
import { useAsync } from "@/hooks/useAsync";
import { toast } from "@/hooks/useToast";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AlertItem } from "@/components/features/dashboard/AlertItem";
import { InventoryMovement } from "@/types";

export default function AdminInventoryPage() {
  const { data: products } = useAsync(() => productService.list(), []);
  const { data: movements, refetch: refetchMovs } = useAsync(() => inventoryService.list(), []);
  const { data: lowStock, refetch: refetchLow } = useAsync(() => productService.getLowStock(), []);

  const [productId, setProductId] = useState("");
  const [type, setType] = useState<MovementType>("Entrada");
  const [quantity, setQuantity] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!productId) {
      toast.error("Selecciona un producto");
      return;
    }
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      toast.error("Ingresa una cantidad válida");
      return;
    }
    setSubmitting(true);
    try {
      await inventoryService.register({ productId, type, quantity: qty, note });
      toast.success("Movimiento registrado correctamente");
      setProductId("");
      setQuantity("");
      setNote("");
      void refetchMovs();
      void refetchLow();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<InventoryMovement>[] = [
    {
      key: "product",
      header: "Producto",
      render: (m) => (
        <div>
          <div className="font-semibold">{m.productName}</div>
          {m.note && <div className="text-xs text-text-muted">{m.note}</div>}
        </div>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (m) =>
        m.type === "Entrada" ? (
          <Badge variant="success">📥 Entrada</Badge>
        ) : (
          <Badge variant="coral">📤 Salida</Badge>
        ),
    },
    {
      key: "quantity",
      header: "Cantidad",
      render: (m) => (
        <span className={m.type === "Entrada" ? "text-emerald-600" : "text-coral-500"}>
          {m.type === "Entrada" ? "+" : "−"}
          {m.quantity}
        </span>
      ),
    },
    {
      key: "resulting",
      header: "Resultante",
      render: (m) => <span className="font-semibold">{m.resultingStock}</span>,
    },
    { key: "date", header: "Fecha", render: (m) => formatDate(m.createdAt) },
  ];

  return (
    <>
      <PageHeader
        title="Control de inventario"
        subtitle="Registra entradas y salidas de stock"
        actions={null}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">
        <Card>
          <CardHeader title="📥 Registrar movimiento" />
          <div className="space-y-4">
            <div>
              <Label htmlFor="prod" required>Producto</Label>
              <Select
                id="prod"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">Selecciona un producto</option>
                {(products ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.stock})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label required>Tipo de movimiento</Label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setType("Entrada")}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    type === "Entrada"
                      ? "bg-primary-50 border-2 border-primary-500 text-primary-700"
                      : "bg-white border border-border text-text-muted hover:bg-bg"
                  }`}
                >
                  📥 Entrada
                </button>
                <button
                  type="button"
                  onClick={() => setType("Salida")}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    type === "Salida"
                      ? "bg-coral-50 border-2 border-coral-400 text-coral-700"
                      : "bg-white border border-border text-text-muted hover:bg-bg"
                  }`}
                >
                  📤 Salida
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="qty" required>Cantidad</Label>
              <Input
                id="qty"
                type="number"
                placeholder="Ej. 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="note">Observación (opcional)</Label>
              <Input
                id="note"
                placeholder="Ej. Compra a proveedor XYZ"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <Button fullWidth onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Registrando..." : "Registrar movimiento"}
            </Button>

            <div className="bg-primary-50 border-l-2 border-primary-500 p-3 rounded-lg text-xs text-primary-700">
              💡 El stock resultante se calcula automáticamente.
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {(lowStock ?? []).length > 0 && (
            <AlertItem
              variant="stock"
              title={`${lowStock!.length} productos con stock bajo`}
              description="Revisa el listado y considera reabastecer pronto."
            />
          )}

          <Card>
            <CardHeader title="Historial de movimientos" subtitle="Últimos 30 días" />
            <DataTable columns={columns} rows={movements ?? []} rowKey={(m) => m.id} />
          </Card>
        </div>
      </div>
    </>
  );
}
