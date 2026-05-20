import { OrderStatus } from '@prisma/client';
import { OrderStateMachine } from './order-state-machine';

describe('OrderStateMachine', () => {
  it('permite la cadena feliz Pending → Preparing → On the way → Delivered', () => {
    expect(OrderStateMachine.canTransition(OrderStatus.PENDING, OrderStatus.PREPARING)).toBe(true);
    expect(OrderStateMachine.canTransition(OrderStatus.PREPARING, OrderStatus.ON_THE_WAY)).toBe(true);
    expect(OrderStateMachine.canTransition(OrderStatus.ON_THE_WAY, OrderStatus.DELIVERED)).toBe(true);
  });

  it('permite rechazar y cancelar desde Pending', () => {
    expect(OrderStateMachine.canTransition(OrderStatus.PENDING, OrderStatus.REJECTED)).toBe(true);
    expect(OrderStateMachine.canTransition(OrderStatus.PENDING, OrderStatus.CANCELLED)).toBe(true);
  });

  it('no permite retroceder estados', () => {
    expect(OrderStateMachine.canTransition(OrderStatus.PREPARING, OrderStatus.PENDING)).toBe(false);
    expect(OrderStateMachine.canTransition(OrderStatus.ON_THE_WAY, OrderStatus.PREPARING)).toBe(false);
    expect(OrderStateMachine.canTransition(OrderStatus.DELIVERED, OrderStatus.ON_THE_WAY)).toBe(false);
  });

  it('no permite saltar etapas', () => {
    expect(OrderStateMachine.canTransition(OrderStatus.PENDING, OrderStatus.DELIVERED)).toBe(false);
    expect(OrderStateMachine.canTransition(OrderStatus.PREPARING, OrderStatus.DELIVERED)).toBe(false);
  });

  it('no se puede cancelar un pedido ya en preparación', () => {
    expect(OrderStateMachine.canTransition(OrderStatus.PREPARING, OrderStatus.CANCELLED)).toBe(false);
  });

  it('los estados finales no admiten más transiciones', () => {
    expect(OrderStateMachine.isTerminal(OrderStatus.DELIVERED)).toBe(true);
    expect(OrderStateMachine.isTerminal(OrderStatus.REJECTED)).toBe(true);
    expect(OrderStateMachine.isTerminal(OrderStatus.CANCELLED)).toBe(true);
    expect(OrderStateMachine.isTerminal(OrderStatus.PENDING)).toBe(false);
  });

  it('expone las transiciones permitidas para construir UI', () => {
    expect(OrderStateMachine.next(OrderStatus.PENDING)).toEqual(
      expect.arrayContaining([OrderStatus.PREPARING, OrderStatus.REJECTED, OrderStatus.CANCELLED]),
    );
    expect(OrderStateMachine.next(OrderStatus.DELIVERED)).toEqual([]);
  });
});
