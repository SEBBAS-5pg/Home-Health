import { OrderStatus } from "@/types";

/**
 * Máquina de estados para pedidos (HU12).
 *
 * Flujo válido:
 *   Pendiente → En preparación → En camino → Entregado
 *   Pendiente → Rechazado
 *
 * No se permite retroceder ni saltar etapas.
 */
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pendiente: ["En preparacion", "Rechazado"],
  "En preparacion": ["En camino"],
  "En camino": ["Entregado"],
  Entregado: [],
  Rechazado: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function getNextStates(from: OrderStatus): OrderStatus[] {
  return TRANSITIONS[from] ?? [];
}

export function isTerminalState(status: OrderStatus): boolean {
  return TRANSITIONS[status].length === 0;
}

/** Lista lineal del flujo principal (sin Rechazado) */
export const ORDER_FLOW: OrderStatus[] = [
  "Pendiente",
  "En preparacion",
  "En camino",
  "Entregado",
];

/** Mapa visual: estado → label legible y variante de Badge */
export const STATUS_META: Record<
  OrderStatus,
  { label: string; variant: "warning" | "primary" | "success" | "coral" | "danger" }
> = {
  Pendiente: { label: "Pendiente", variant: "coral" },
  "En preparacion": { label: "En preparación", variant: "warning" },
  "En camino": { label: "En camino", variant: "primary" },
  Entregado: { label: "Entregado", variant: "success" },
  Rechazado: { label: "Rechazado", variant: "danger" },
};
