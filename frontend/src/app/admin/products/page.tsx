"use client";

import { useState } from "react";
import { Product } from "@/types";
import { productService, PRODUCT_CONSTANTS } from "@/services";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/hooks/useToast";
import { formatCOP, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { DataTable, Column } from "@/components/ui/DataTable";
import { ConfirmModal } from "@/components/ui/Modal";
import { ProductFormModal } from "@/components/features/products/ProductFormModal";

type StockFilter = "all" | "available" | "low" | "out";

export default function AdminProductsPage() {
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [removing, setRemoving] = useState<Product | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  const { data: products, refetch } = useAsync(
    () => productService.list({ query: debouncedQuery }),
    [debouncedQuery]
  );

  const filtered = (products ?? []).filter((p) => {
    if (stockFilter === "available") return p.stock > PRODUCT_CONSTANTS.LOW_STOCK_THRESHOLD;
    if (stockFilter === "low")
      return p.stock > 0 && p.stock <= PRODUCT_CONSTANTS.LOW_STOCK_THRESHOLD;
    if (stockFilter === "out") return p.stock === 0;
    return true;
  });

  const handleSave = async (data: Omit<Product, "id">, id?: string) => {
    try {
      if (id) {
        await productService.update(id, data);
        toast.success("Producto actualizado");
      } else {
        await productService.create(data);
        toast.success("Producto creado correctamente");
      }
      setEditing(null);
      setCreating(false);
      void refetch();
    } catch (e: any) {
      const msg =
        e?.response?.data?.error?.message ??
        e?.message ??
        "No se pudo guardar el producto";
      toast.error(msg);
    }
  };

  const handleRemove = async () => {
    if (!removing) return;
    try {
      await productService.remove(removing.id);
      toast.success("Producto eliminado");
      setRemoving(null);
      void refetch();
    } catch (e: any) {
      const msg = e?.response?.data?.error?.message ?? "No se pudo eliminar";
      toast.error(msg);
    }
  };

  const renderStockCell = (p: Product) => {
    if (p.stock === 0) return <Badge variant="muted">Sin stock</Badge>;
    if (p.stock <= PRODUCT_CONSTANTS.LOW_STOCK_THRESHOLD)
      return (
        <span className="font-semibold text-coral-500" aria-label="Stock bajo">
          {p.stock}
        </span>
      );
    return <span>{p.stock}</span>;
  };

  const renderStatusBadge = (p: Product) => {
    if (p.stock === 0) return <Badge variant="muted">Sin stock</Badge>;
    if (p.stock <= PRODUCT_CONSTANTS.LOW_STOCK_THRESHOLD)
      return <Badge variant="coral">Stock bajo</Badge>;
    return <Badge variant="success">Disponible</Badge>;
  };

  const columns: Column<Product>[] = [
    {
      key: "product",
      header: "Producto",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-50 grid place-items-center text-base">
            {p.imageEmoji ?? "💊"}
          </div>
          <div>
            <div className="font-semibold">{p.name}</div>
            {p.sku && <div className="text-xs text-text-muted">SKU: {p.sku}</div>}
          </div>
        </div>
      ),
    },
    { key: "category", header: "Categoría", render: (p) => p.category },
    {
      key: "price",
      header: "Precio",
      render: (p) => <span className="font-semibold">{formatCOP(p.price)}</span>,
    },
    { key: "stock", header: "Stock", render: renderStockCell },
    {
      key: "expiry",
      header: "Vencimiento",
      render: (p) => (p.expiryDate ? formatDate(p.expiryDate) : "—"),
    },
    { key: "status", header: "Estado", render: renderStatusBadge },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <div className="flex gap-1 justify-end">
          <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>
            ✏️ Editar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setRemoving(p)}>
            🗑 Eliminar
          </Button>
        </div>
      ),
      align: "right",
    },
  ];

  return (
    <>
      <PageHeader
        title="Catálogo de productos"
        subtitle="Gestiona el listado de medicamentos disponibles"
        actions={
          <>
            <Button variant="secondary" size="sm">⬇ Exportar</Button>
            <Button size="sm" onClick={() => setCreating(true)}>+ Nuevo producto</Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar por nombre o categoría..."
        />
        <Select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as StockFilter)}
          className="w-auto"
        >
          <option value="all">Todos los estados</option>
          <option value="available">Disponibles</option>
          <option value="low">Stock bajo</option>
          <option value="out">Sin stock</option>
        </Select>
      </div>

      <DataTable columns={columns} rows={filtered} rowKey={(p) => p.id} />

      <ProductFormModal
        open={creating || !!editing}
        product={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />

      <ConfirmModal
        open={!!removing}
        onClose={() => setRemoving(null)}
        onConfirm={handleRemove}
        title="Eliminar producto"
        description={`¿Estás seguro de eliminar "${removing?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
      />
    </>
  );
}
