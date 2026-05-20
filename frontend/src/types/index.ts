/**
 * Tipos del dominio Home-Health
 * Basados en las HU del documento de levantamiento de requisitos.
 */

export type Role = "cliente" | "administrador";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string; // ISO date
}

export type ProductCategory =
  | "Analgesicos"
  | "Antibioticos"
  | "Vitaminas"
  | "Cuidado personal"
  | "Primeros auxilios"
  | "Equipos";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;     // nombre legible (UI)
  categoryId?: string;            // UUID real (backend)
  description: string;
  price: number;       // COP
  stock: number;
  expiryDate?: string; // ISO date
  imageEmoji?: string; // placeholder visual
  sku?: string;
}

export type OrderStatus =
  | "Pendiente"
  | "En preparacion"
  | "En camino"
  | "Entregado"
  | "Rechazado";

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderStatusChange {
  status: OrderStatus;
  changedAt: string;
}

export interface Order {
  id: string;
  number: string;          // PED-00128
  customerId: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  deliveryAddress: string;
  status: OrderStatus;
  createdAt: string;
  history: OrderStatusChange[];
}

export type MovementType = "Entrada" | "Salida";

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  resultingStock: number;
  note?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  kind: "stock_bajo" | "vencimiento" | "nuevo_pedido";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
