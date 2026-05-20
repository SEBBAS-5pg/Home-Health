"use client";

import { useEffect, useState } from "react";
import { Product, ProductCategory } from "@/types";
import { api } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface ProductFormModalProps {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onSave: (data: Omit<Product, "id">, id?: string) => void | Promise<void>;
}

interface ApiCategory {
  id: string;
  name: string;
}

const EMPTY: Omit<Product, "id"> = {
  name: "",
  category: "Analgesicos",
  description: "",
  price: 0,
  stock: 0,
  expiryDate: "",
  imageEmoji: "💊",
  sku: "",
};

export function ProductFormModal({ open, product, onClose, onSave }: ProductFormModalProps) {
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  // Carga categorías reales con UUID desde el backend.
  useEffect(() => {
    if (!open) return;
    api
      .get<{ data: ApiCategory[] }>("/categories")
      .then((r) => {
        const cats = r.data.data ?? [];
        setCategories(cats);
        if (!product && cats[0]) {
          setForm((f) => ({ ...f, category: cats[0].id as any }));
        }
      })
      .catch(() => setCategories([]));
  }, [open, product]);

  useEffect(() => {
    if (product) {
      const { id, ...rest } = product;
      // Si el producto tiene categoryId real (viene del backend), úsalo.
      // Si no, fallback al nombre (compat con modo mock).
      setForm({ ...rest, category: (product.categoryId ?? rest.category) as any });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [product, open]);

  const handleChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (form.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
    if (form.price < 0) newErrors.price = "El precio no puede ser negativo";
    if (form.stock < 0) newErrors.stock = "El stock no puede ser negativo";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    await onSave(form, product?.id);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? "Editar producto" : "Nuevo producto"}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>{product ? "Guardar cambios" : "Crear producto"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" required>Nombre</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
            />
          </div>
          <div>
            <Label htmlFor="category" required>Categoría</Label>
            <Select
              id="category"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value as ProductCategory)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description" required>Descripción</Label>
          <Input
            id="description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            error={errors.description}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price" required>Precio (COP)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="any"
              placeholder="Ej. 12500"
              value={form.price === 0 ? "" : form.price}
              onChange={(e) => {
                const v = Math.max(0, Number(e.target.value));
                handleChange("price", Number.isFinite(v) ? v : 0);
              }}
              error={errors.price}
            />
          </div>
          <div>
            <Label htmlFor="stock" required>Stock inicial</Label>
            <Input
              id="stock"
              type="number"
              min={0}
              placeholder="Ej. 100"
              value={form.stock === 0 ? "" : form.stock}
              onChange={(e) => {
                const v = Math.max(0, Number(e.target.value));
                handleChange("stock", Number.isFinite(v) ? v : 0);
              }}
              error={errors.stock}
            />
          </div>
          <div>
            <Label htmlFor="expiry">Fecha vencimiento</Label>
            <Input
              id="expiry"
              type="date"
              value={form.expiryDate ?? ""}
              onChange={(e) => handleChange("expiryDate", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={form.sku ?? ""}
              onChange={(e) => handleChange("sku", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="emoji">Emoji visual</Label>
            <Input
              id="emoji"
              value={form.imageEmoji ?? ""}
              onChange={(e) => handleChange("imageEmoji", e.target.value)}
              placeholder="💊"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
