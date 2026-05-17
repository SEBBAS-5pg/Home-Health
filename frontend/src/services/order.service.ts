import { Order, OrderStatus } from "@/types";
import { mockOrders } from "@/lib/mock-data";
import { canTransition } from "@/lib/order-status-machine";
import { IOrderService } from "./types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class MockOrderService implements IOrderService {
  private orders: Order[] = [...mockOrders];

  async list(filter: { status?: OrderStatus; customerId?: string } = {}) {
    await sleep(200);
    return this.orders.filter((o) => {
      if (filter.status && o.status !== filter.status) return false;
      if (filter.customerId && o.customerId !== filter.customerId) return false;
      return true;
    });
  }

  async getById(id: string) {
    await sleep(100);
    return this.orders.find((o) => o.id === id) ?? null;
  }

  async create(
    data: Omit<Order, "id" | "number" | "status" | "createdAt" | "history">
  ): Promise<Order> {
    await sleep(300);
    const id = `o-${Date.now()}`;
    const number = `PED-${String(this.orders.length + 129).padStart(5, "0")}`;
    const createdAt = new Date().toISOString();
    const order: Order = {
      ...data,
      id,
      number,
      status: "Pendiente",
      createdAt,
      history: [{ status: "Pendiente", changedAt: createdAt }],
    };
    this.orders.unshift(order);
    return order;
  }

  async changeStatus(id: string, next: OrderStatus): Promise<Order> {
    await sleep(200);
    const order = this.orders.find((o) => o.id === id);
    if (!order) throw new Error("Pedido no encontrado");
    if (!canTransition(order.status, next))
      throw new Error("No es posible cambiar a ese estado");
    order.status = next;
    order.history = [...order.history, { status: next, changedAt: new Date().toISOString() }];
    return order;
  }

  async reject(id: string): Promise<Order> {
    return this.changeStatus(id, "Rechazado");
  }
}

export const orderService: IOrderService = new MockOrderService();
