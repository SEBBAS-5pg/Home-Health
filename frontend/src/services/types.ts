// Contratos de los servicios.
// Las páginas importan estas interfaces, no las clases concretas,
// así podemos cambiar de mocks a HTTP real sin tocar la UI.
import {
  Product,
  Order,
  OrderStatus,
  InventoryMovement,
  MovementType,
  User,
  Notification,
} from "@/types";

export interface IProductService {
  list(filter?: { category?: string; query?: string; onlyAvailable?: boolean }): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(data: Omit<Product, "id">): Promise<Product>;
  update(id: string, data: Partial<Product>): Promise<Product>;
  remove(id: string): Promise<void>;
  getLowStock(threshold?: number): Promise<Product[]>;
  getNearExpiry(days?: number): Promise<Product[]>;
}

export interface IOrderService {
  list(filter?: { status?: OrderStatus; customerId?: string }): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  create(data: Omit<Order, "id" | "number" | "status" | "createdAt" | "history">): Promise<Order>;
  changeStatus(id: string, next: OrderStatus): Promise<Order>;
  reject(id: string): Promise<Order>;
}

export interface IInventoryService {
  list(): Promise<InventoryMovement[]>;
  register(data: {
    productId: string;
    type: MovementType;
    quantity: number;
    note?: string;
  }): Promise<InventoryMovement>;
}

export interface IUserService {
  list(): Promise<User[]>;
  getCurrent(): Promise<User | null>;
  updateProfile(id: string, data: Partial<Pick<User, "fullName" | "phone">>): Promise<User>;
}

export interface INotificationService {
  list(): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  unreadCount(): Promise<number>;
}
