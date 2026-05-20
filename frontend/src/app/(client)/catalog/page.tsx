"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/types";
import { productService } from "@/services";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { useCartStore } from "@/store/cart.store";
import { toast } from "@/hooks/useToast";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/features/products/ProductCard";

interface Category {
  id: string;
  name: string;
}

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  // category guarda el UUID real (o "all"). El backend filtra por categoryId.
  const [category, setCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  // Carga las categorías reales con sus UUID al montar.
  useEffect(() => {
    api
      .get<{ data: Category[] }>("/categories")
      .then((r) => setCategories(r.data.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  const { data: products = [], loading } = useAsync(
    () => productService.list({ category, query: debouncedQuery, onlyAvailable: true }),
    [category, debouncedQuery]
  );

  const addToCart = useCartStore((s) => s.add);

  const handleAdd = (product: Product) => {
    addToCart(product, 1);
    toast.success(`${product.name} agregado al carrito`);
  };

  const filteredProducts = useMemo(() => products ?? [], [products]);

  return (
    <>
      <PageHeader
        title="Catálogo de productos"
        subtitle="Encuentra los medicamentos que necesitas"
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar medicamentos por nombre..."
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Chip active={category === "all"} onClick={() => setCategory("all")}>
          Todos
        </Chip>
        {categories.map((c) => (
          <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
            {c.name}
          </Chip>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border h-72 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon="🔎"
          title="No se encontraron productos"
          description="Intenta con otro nombre o cambia la categoría seleccionada."
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </>
  );
}
