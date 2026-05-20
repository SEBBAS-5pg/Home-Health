import { OrderStatus } from '@prisma/client';

// Define las transiciones válidas del pedido.
// Una sola fuente de verdad para HU11 (admin cambia estado) y HU16 (cliente cancela).
// La política del proyecto (RN01): nunca retroceder.

const transitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.PREPARING, OrderStatus.REJECTED, OrderStatus.CANCELLED],
  PREPARING: [OrderStatus.ON_THE_WAY],
  ON_THE_WAY: [OrderStatus.DELIVERED],
  DELIVERED: [],
  REJECTED: [],
  CANCELLED: [],
};

export const OrderStateMachine = {
  canTransition(from: OrderStatus, to: OrderStatus): boolean {
    return transitions[from]?.includes(to) ?? false;
  },

  isTerminal(status: OrderStatus): boolean {
    return transitions[status].length === 0;
  },

  next(from: OrderStatus): OrderStatus[] {
    return transitions[from];
  },
};
