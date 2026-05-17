/**
 * Barrel: punto único de importación de servicios.
 * Uso: `import { productService, orderService } from "@/services";`
 */
export { productService, PRODUCT_CONSTANTS } from "./product.service";
export { orderService } from "./order.service";
export { inventoryService } from "./inventory.service";
export { userService } from "./user.service";
export { notificationService } from "./notification.service";
export type {
  IProductService,
  IOrderService,
  IInventoryService,
  IUserService,
  INotificationService,
} from "./types";
