import { Product } from "@/types";
import { formatCOP } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PRODUCT_CONSTANTS } from "@/services";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= PRODUCT_CONSTANTS.LOW_STOCK_THRESHOLD;

  return (
    <article className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="h-28 bg-gradient-to-br from-primary-50 to-coral-50 grid place-items-center text-4xl">
        {product.imageEmoji ?? "💊"}
      </div>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <span className="text-[10px] uppercase tracking-wider font-bold text-primary-700">
          {product.category}
        </span>
        <h3 className="font-semibold text-sm text-text leading-snug">{product.name}</h3>
        <p className="text-xs text-text-muted leading-relaxed flex-1">{product.description}</p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-base font-bold text-text">{formatCOP(product.price)}</span>
          <span
            className={`text-[11px] ${
              isOutOfStock
                ? "text-text-soft"
                : isLowStock
                ? "text-coral-500 font-semibold"
                : "text-text-soft"
            }`}
          >
            {isOutOfStock
              ? "Sin stock"
              : isLowStock
              ? `Stock bajo: ${product.stock}`
              : `Stock: ${product.stock}`}
          </span>
        </div>

        <Button
          fullWidth
          size="sm"
          variant={isOutOfStock ? "secondary" : "primary"}
          disabled={isOutOfStock}
          onClick={() => onAdd(product)}
          className="mt-2"
        >
          {isOutOfStock ? "No disponible" : "+ Agregar al carrito"}
        </Button>
      </div>
    </article>
  );
}
