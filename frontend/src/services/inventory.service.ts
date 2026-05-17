import { InventoryMovement, MovementType } from "@/types";
import { mockMovements } from "@/lib/mock-data";
import { IInventoryService } from "./types";
import { productService } from "./product.service";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class MockInventoryService implements IInventoryService {
  private movements: InventoryMovement[] = [...mockMovements];

  async list(): Promise<InventoryMovement[]> {
    await sleep(150);
    return [...this.movements].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async register(data: {
    productId: string;
    type: MovementType;
    quantity: number;
    note?: string;
  }): Promise<InventoryMovement> {
    await sleep(250);

    const product = await productService.getById(data.productId);
    if (!product) throw new Error("Producto no encontrado");

    if (data.type === "Salida" && data.quantity > product.stock) {
      throw new Error(`Stock insuficiente. Stock actual: ${product.stock} unidades`);
    }

    const delta = data.type === "Entrada" ? data.quantity : -data.quantity;
    const newStock = product.stock + delta;
    await productService.update(product.id, { stock: newStock });

    const movement: InventoryMovement = {
      id: `m-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      type: data.type,
      quantity: data.quantity,
      resultingStock: newStock,
      note: data.note,
      createdAt: new Date().toISOString(),
    };
    this.movements.unshift(movement);
    return movement;
  }
}

export const inventoryService: IInventoryService = new MockInventoryService();
