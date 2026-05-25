// Conversiones entre el formato que devuelve el backend (Prisma) y los
// tipos del frontend. La idea: la UI nunca ve nombres del backend.
import type { InventoryMovement, Notification, Order, Product, User } from "@/types";

interface ApiProduct {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  price: string | number;
  stock: number;
  expirationDate?: string | null;
  category?: { id: string; name: string } | null;
  categoryId: string;
}

export const mapProduct = (p: ApiProduct): Product => ({
  id: p.id,
  name: p.name,
  category: (p.category?.name ?? "") as Product["category"],
  categoryId: p.category?.id ?? p.categoryId,
  description: p.description ?? "",
  price: Number(p.price),
  stock: p.stock,
  expiryDate: p.expirationDate ?? undefined,
  sku: p.sku,
});

interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: "ADMIN" | "CLIENT";
  createdAt: string;
}

export const mapUser = (u: ApiUser): User => ({
  id: u.id,
  fullName: u.fullName,
  email: u.email,
  phone: u.phone ?? "",
  role: u.role === "ADMIN" ? "administrador" : "cliente",
  createdAt: u.createdAt,
});

interface ApiOrderItem {
  productId: string;
  quantity: number;
  unitPrice: string | number;
  product?: { name: string };
}

interface ApiOrderStatusHistory {
  toStatus: string;
  changedAt: string;
}

interface ApiOrder {
  id: string;
  number: string;
  customerId: string;
  customer?: { fullName: string; phone?: string | null };
  deliveryAddress: string;
  status: string;
  total: string | number;
  createdAt: string;
  items: ApiOrderItem[];
  history?: ApiOrderStatusHistory[];
}

const STATUS_MAP: Record<string, Order["status"]> = {
  PENDING: "Pendiente",
  PREPARING: "En preparacion",
  ON_THE_WAY: "En camino",
  DELIVERED: "Entregado",
  REJECTED: "Rechazado",
  CANCELLED: "Rechazado",
};

export const mapOrder = (o: ApiOrder): Order => ({
  id: o.id,
  number: o.number,
  customerId: o.customerId,
  customerName: o.customer?.fullName ?? "",
  customerPhone: o.customer?.phone ?? undefined,
  items: (o.items ?? []).map((it) => ({
    productId: it.productId,
    productName: it.product?.name ?? "",
    unitPrice: Number(it.unitPrice),
    quantity: it.quantity,
  })),
  total: Number(o.total),
  deliveryAddress: o.deliveryAddress,
  status: STATUS_MAP[o.status] ?? "Pendiente",
  createdAt: o.createdAt,
  history: (o.history ?? []).map((h) => ({
    status: STATUS_MAP[h.toStatus] ?? "Pendiente",
    changedAt: h.changedAt,
  })),
});

interface ApiMovement {
  id: string;
  productId: string;
  product?: { name: string };
  movementType: "ENTRY" | "EXIT";
  quantity: number;
  resultingStock: number;
  observation?: string | null;
  createdAt: string;
}

export const mapMovement = (m: ApiMovement): InventoryMovement => ({
  id: m.id,
  productId: m.productId,
  productName: m.product?.name ?? "",
  type: m.movementType === "ENTRY" ? "Entrada" : "Salida",
  quantity: m.quantity,
  resultingStock: m.resultingStock,
  note: m.observation ?? undefined,
  createdAt: m.createdAt,
});

interface ApiNotification {
  id: string;
  type: "LOW_STOCK" | "EXPIRATION" | "NEW_ORDER" | "STATE_CHANGE";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NOTIF_KIND: Record<string, Notification["kind"]> = {
  LOW_STOCK: "stock_bajo",
  EXPIRATION: "vencimiento",
  NEW_ORDER: "nuevo_pedido",
  STATE_CHANGE: "nuevo_pedido",
};

export const mapNotification = (n: ApiNotification): Notification => ({
  id: n.id,
  kind: NOTIF_KIND[n.type] ?? "nuevo_pedido",
  title: n.title,
  message: n.message,
  read: n.isRead,
  createdAt: n.createdAt,
});
