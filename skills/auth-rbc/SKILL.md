# SKILL: Auth & RBAC (Role-Based Access Control)

## CONTEXTO

Implementación de autenticación stateless mediante JWT en NestJS. Gestión de sesiones para usuarios "Guest" y permisos modulares para "Admins".

## LÓGICA DE GUEST CHECKOUT

1. Al iniciar checkout sin login: Generar un `temp_token` (JWT corto de 1h).
2. El token debe contener el `order_id` asociado para evitar manipulaciones.
3. Al finalizar el pago en Stripe, invalidar el token inmediatamente.

## LÓGICA DE ADMIN SCOPES

1. Los administradores no tienen "roles" rígidos, sino "scopes" (Custom Claims en JWT).
2. Scopes válidos: `commercial:read`, `inventory:write`, `logistics:update`.
3. Implementar un `PermissionsGuard` que valide la intersección de claims.

## ESTÁNDARES TÉCNICOS

- Hash de contraseñas: Argon2.
- Manejo de Errores: Lanzar `UnauthorizedException` o `ForbiddenException` nativos de NestJS.
- No persistir datos de tarjetas de crédito; usar solo `stripe_customer_id`.
