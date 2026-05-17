"use client";

import { useEffect, useState } from "react";
import { Product, ProductCategory } from "@/types";
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

const CATEGORIES: ProductCategory[] = [
  "Analgesicos",
  "Antibioticos",
  "Vitaminas",
  "Cuidado personal",
  "Primeros auxilios",
  "Equipos",
];

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

  useEffect(() => {
    if (product) {
      const { id, ...rest } = product;
      setForm(rest);
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
    if (!form.description.trim()) newErrors.description = "La descripción es obligatoria";
    if (form.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
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
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
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
              value={form.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              error={errors.price}
            />
          </div>
          <div>
            <Label htmlFor="stock" required>Stock inicial</Label>
            <Input
              id="stock"
              type="number"
              value={form.stock}
              onChange={(e) => handleChange("stock", Number(e.target.value))}
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
