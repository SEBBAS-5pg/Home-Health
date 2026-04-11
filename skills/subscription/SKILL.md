# SKILL: Subscription & Recurrence Motor

## CONTEXTO

Gestión de la tabla `Subscription` en PostgreSQL y la lógica de generación de órdenes recurrentes vía Cron Jobs.

## CICLO DE VIDA (PATRÓN STATE)

- **ACTIVE:** El motor de tareas procesa el cobro en la `nextExecution`.
- **FROZEN:** El registro se mantiene pero se ignora en el bucle de procesamiento.
- **CANCELLED:** Soft-delete (parámetro `deletedAt`).

## LÓGICA DEL MOTOR (CRON JOB)

1. Ejecución diaria a las 00:00 UTC.
2. Consulta: `SELECT * FROM Subscription WHERE status = 'ACTIVE' AND nextExecution <= NOW()`.
3. Por cada registro:
   - Invocar `PaymentService` para iniciar cobro vía Stripe (Off-session con Token).
   - **Nota de Proceso:** El sistema debe marcar transitoriamente la suscripción o la orden como `WAITING_PAYMENT_CONFIRMATION` si la respuesta inicial de Stripe es asíncrona.
   - SI el pago es exitoso (Confirmación inmediata o Webhook): Crear `Order` y actualizar `nextExecution` según `frequency_days`.
   - SI el pago falla: Cambiar estado a `PENDING_PAYMENT` y notificar al usuario.

## MANEJO DE WEBHOOKS (PAGOS ASÍNCRONOS)

> [!IMPORTANT]
> Stripe opera de forma asíncrona para muchos métodos de pago y flujos de suscripción.

- **Confirmación Real:** No se debe actualizar la `nextExecution` basándose únicamente en la respuesta del `cron job`. El sistema debe escuchar el evento `invoice.payment_succeeded` o `payment_intent.succeeded` de Stripe.
- **Seguridad:** El endpoint de Webhooks debe validar la firma de Stripe (`Stripe-Signature`) para evitar ataques de suplantación.
- **Idempotencia:** Se debe usar el `paymentIntentId` o similar para asegurar que un mismo pago no genere dos órdenes si el webhook se dispara múltiples veces.

## SEGURIDAD

- El motor debe estar envuelto en una transacción ACID para evitar duplicidad de cobros.
- Almacenamiento seguro de llaves de API vía AWS Secrets Manager.
