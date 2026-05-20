// Barrel con factory: decide entre mock y HTTP según NEXT_PUBLIC_USE_MOCK.
// Las páginas importan desde aquí sin saber qué implementación están usando.
import { USE_MOCK } from "@/lib/api";

import { inventoryService as mockInventory } from "./inventory.service";
import { notificationService as mockNotification } from "./notification.service";
import { orderService as mockOrder } from "./order.service";
import { productService as mockProduct, PRODUCT_CONSTANTS } from "./product.service";
import { userService as mockUser } from "./user.service";

import {
  httpInventoryService,
  httpNotificationService,
  httpOrderService,
  httpProductService,
  httpUserService,
} from "./http";

export const productService = USE_MOCK ? mockProduct : httpProductService;
export const orderService = USE_MOCK ? mockOrder : httpOrderService;
export const inventoryService = USE_MOCK ? mockInventory : httpInventoryService;
export const userService = USE_MOCK ? mockUser : httpUserService;
export const notificationService = USE_MOCK ? mockNotification : httpNotificationService;

export { PRODUCT_CONSTANTS };
export type {
  IInventoryService,
  INotificationService,
  IOrderService,
  IProductService,
  IUserService,
} from "./types";
