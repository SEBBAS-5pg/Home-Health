// Implementaciones HTTP de los services. Se usan cuando NEXT_PUBLIC_USE_MOCK=false.
// Cada función pega contra el backend NestJS (`@/lib/api`) y mapea la respuesta
// al modelo del frontend.
import { api } from "@/lib/api";
import type {
  IInventoryService,
  INotificationService,
  IOrderService,
  IProductService,
  IUserService,
} from "../types";
import type { MovementType, Order, OrderStatus, Product } from "@/types";
import {
  mapMovement,
  mapNotification,
  mapOrder,
  mapProduct,
  mapUser,
} from "./mappers";

// El backend envuelve toda respuesta en { data, meta }.
const unwrap = <T>(p: Promise<{ data: { data: T } }>) => p.then((r) => r.data.data);

const ORDER_STATUS_TO_API: Record<string, string> = {
  Pendiente: "PENDING",
  "En preparacion": "PREPARING",
  "En camino": "ON_THE_WAY",
  Entregado: "DELIVERED",
  Rechazado: "REJECTED",
};

export const httpProductService: IProductService = {
  async list(filter = {}) {
    const params: Record<string, string | boolean> = {};
    if (filter.query) params.q = filter.query;
    if (filter.category && filter.category !== "all") params.categoryId = filter.category;
    if (filter.onlyAvailable) params.onlyAvailable = true;
    const products = await unwrap<unknown[]>(api.get("/products", { params }));
    return (products as Parameters<typeof mapProduct>[0][]).map(mapProduct);
  },
  async getById(id) {
    try {
      const p = await unwrap<Parameters<typeof mapProduct>[0]>(api.get(`/products/${id}`));
      return mapProduct(p);
    } catch {
      return null;
    }
  },
  async create(data) {
    const payload = {
      name: data.name,
      sku: data.sku ?? `HH-${Date.now()}`,
      categoryId: data.category,
      description: data.description,
      price: data.price,
      stock: data.stock,
      expirationDate: data.expiryDate,
    };
    const p = await unwrap<Parameters<typeof mapProduct>[0]>(api.post("/products", payload));
    return mapProduct(p);
  },
  async update(id, data) {
    const payload: Record<string, unknown> = {};
    if (data.name) payload.name = data.name;
    if (data.description !== undefined) payload.description = data.description;
    if (data.price !== undefined) payload.price = data.price;
    if (data.stock !== undefined) payload.stock = data.stock;
    if (data.expiryDate) payload.expirationDate = data.expiryDate;
    if (data.category) payload.categoryId = data.category;
    const p = await unwrap<Parameters<typeof mapProduct>[0]>(api.patch(`/products/${id}`, payload));
    return mapProduct(p);
  },
  async remove(id) {
    await api.delete(`/products/${id}`);
  },
  async getLowStock(threshold = 5) {
    const products = await this.list();
    return products.filter((p: Product) => p.stock <= threshold && p.stock > 0);
  },
  async getNearExpiry() {
    const products = await unwrap<unknown[]>(api.get("/products/expiring"));
    return (products as Parameters<typeof mapProduct>[0][]).map(mapProduct);
  },
};

export const httpOrderService: IOrderService = {
  async list(filter = {}) {
    const params: Record<string, string> = {};
    if (filter.status) params.status = ORDER_STATUS_TO_API[filter.status] ?? filter.status;
    const orders = await unwrap<unknown[]>(api.get("/orders", { params }));
    return (orders as Parameters<typeof mapOrder>[0][]).map(mapOrder);
  },
  async getById(id) {
    try {
      const o = await unwrap<Parameters<typeof mapOrder>[0]>(api.get(`/orders/${id}`));
      return mapOrder(o);
    } catch {
      return null;
    }
  },
  async create(data) {
    const payload = {
      items: data.items.map((it) => ({ productId: it.productId, quantity: it.quantity })),
      deliveryAddress: data.deliveryAddress,
    };
    const o = await unwrap<Parameters<typeof mapOrder>[0]>(api.post("/orders", payload));
    return mapOrder(o);
  },
  async changeStatus(id, next: OrderStatus) {
    const o = await unwrap<Parameters<typeof mapOrder>[0]>(
      api.patch(`/orders/${id}/status`, { status: ORDER_STATUS_TO_API[next] ?? next }),
    );
    return mapOrder(o);
  },
  async reject(id) {
    const o = await unwrap<Parameters<typeof mapOrder>[0]>(
      api.patch(`/orders/${id}/status`, { status: "REJECTED" }),
    );
    return mapOrder(o);
  },
};

export const httpInventoryService: IInventoryService = {
  async list() {
    const movs = await unwrap<unknown[]>(api.get("/inventory/movements"));
    return (movs as Parameters<typeof mapMovement>[0][]).map(mapMovement);
  },
  async register(data) {
    const payload = {
      productId: data.productId,
      movementType: (data.type as MovementType) === "Entrada" ? "ENTRY" : "EXIT",
      quantity: data.quantity,
      observation: data.note,
    };
    const m = await unwrap<Parameters<typeof mapMovement>[0]>(
      api.post("/inventory/movements", payload),
    );
    return mapMovement(m);
  },
};

export const httpUserService: IUserService = {
  async list() {
    const users = await unwrap<unknown[]>(api.get("/users"));
    return (users as Parameters<typeof mapUser>[0][]).map(mapUser);
  },
  async getCurrent() {
    try {
      const u = await unwrap<Parameters<typeof mapUser>[0]>(api.get("/users/me"));
      return mapUser(u);
    } catch {
      return null;
    }
  },
  async updateProfile(id, data) {
    const path = id === "me" ? "/users/me" : `/users/${id}`;
    const u = await unwrap<Parameters<typeof mapUser>[0]>(api.patch(path, data));
    return mapUser(u);
  },
};

export const httpNotificationService: INotificationService = {
  async list() {
    const ns = await unwrap<unknown[]>(api.get("/notifications"));
    return (ns as Parameters<typeof mapNotification>[0][]).map(mapNotification);
  },
  async markAsRead(id) {
    await api.patch(`/notifications/${id}/read`);
  },
  async unreadCount() {
    const ns = await this.list();
    return ns.filter((n) => !n.read).length;
  },
};
