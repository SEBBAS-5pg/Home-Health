import { Product } from "@/types";
import { mockProducts } from "@/lib/mock-data";
import { daysUntil } from "@/lib/utils";
import { IProductService } from "./types";

const LOW_STOCK_THRESHOLD = 5;
const EXPIRY_WINDOW_DAYS = 30;
const SIMULATED_LATENCY_MS = 250;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Implementación mock del servicio de productos.
 * Mantenemos los datos en memoria para simular un backend.
 */
class MockProductService implements IProductService {
  private products: Product[] = [...mockProducts];

  async list(filter: { category?: string; query?: string; onlyAvailable?: boolean } = {}) {
    await sleep(SIMULATED_LATENCY_MS);
    return this.products.filter((p) => {
      if (filter.onlyAvailable && p.stock <= 0) return false;
      if (filter.category && filter.category !== "all" && p.category !== filter.category)
        return false;
      if (filter.query) {
        const q = filter.query.toLowerCase();
        if (!p.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  async getById(id: string) {
    await sleep(100);
    return this.products.find((p) => p.id === id) ?? null;
  }

  async create(data: Omit<Product, "id">): Promise<Product> {
    await sleep(SIMULATED_LATENCY_MS);
    const product: Product = { ...data, id: `p-${Date.now()}` };
    this.products.unshift(product);
    return product;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    await sleep(SIMULATED_LATENCY_MS);
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error("Producto no encontrado");
    this.products[idx] = { ...this.products[idx], ...data };
    return this.products[idx];
  }

  async remove(id: string): Promise<void> {
    await sleep(SIMULATED_LATENCY_MS);
    this.products = this.products.filter((p) => p.id !== id);
  }

  async getLowStock(threshold = LOW_STOCK_THRESHOLD): Promise<Product[]> {
    await sleep(100);
    return this.products.filter((p) => p.stock <= threshold && p.stock > 0);
  }

  async getNearExpiry(days = EXPIRY_WINDOW_DAYS): Promise<Product[]> {
    await sleep(100);
    return this.products.filter((p) => {
      if (!p.expiryDate) return false;
      const d = daysUntil(p.expiryDate);
      return d <= days;
    });
  }
}

export const productService: IProductService = new MockProductService();

// Constantes exportadas para usar en componentes
export const PRODUCT_CONSTANTS = { LOW_STOCK_THRESHOLD, EXPIRY_WINDOW_DAYS };
