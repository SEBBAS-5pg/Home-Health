# UC.md (Casos de Uso)

## Control de Versiones

| Versión | Fecha      | Descripción                                                                | Responsables    |
| :------ | :--------- | :------------------------------------------------------------------------- | :-------------- |
| 1.0     | 11/04/2026 | Definición de flujos principales: Compra Guest, Suscripción y Sustitución. | [Sebastian Gol] |

---

## 1. Resumen de Casos de Uso

| ID       | Caso de Uso            | Actores                               | Descripción                                        |
| :------- | :--------------------- | :------------------------------------ | :------------------------------------------------- |
| **UC01** | Compra como Invitado   | Cliente Invitado, Stripe, Notificador | Realizar checkout capturando email/celular.        |
| **UC02** | Gestión de Suscripción | Cliente Registrado                    | Activar o congelar pedidos recurrentes.            |
| **UC03** | Resolución de Stock    | Sistema, Admin Inventario             | Aplicar lógica de sustitución ante falta de stock. |
| **UC04** | Gestión de Privilegios | Super Admin                           | Asignar scopes comerciales/inventario a un Admin.  |

---

## 2. Descripción Detallada de Casos de Uso

### UC01: Compra como Invitado (Guest Checkout)

**Actores:** Cliente Invitado, Pasarela Stripe.  
**Precondiciones:** El carrito debe contener al menos un producto con stock.

- **Flujo Básico:**
  1.  El Cliente selecciona "Finalizar Compra" desde el carrito.
  2.  El Sistema solicita Correo Electrónico y Número Celular.
  3.  El Cliente ingresa los datos y procede al pago.
  4.  El Sistema se conecta con el **Payment Wrapper (Stripe)**.
  5.  Stripe confirma la transacción exitosa.
  6.  El Sistema crea la orden en **PostgreSQL** con el flag `is_guest: true`.
  7.  El Sistema reserva el stock en la tabla `Inventory`.
  8.  El Sistema dispara el **Notification Service** (Email/SMS).
- **Flujos Alternos:**
  - **Pago Rechazado:** El Sistema notifica al usuario y permite reintentar o cambiar de método.
- **Postcondiciones:** Se genera un comprobante digital y el token de sesión expira.

---

### UC02: Congelamiento de Suscripción

**Actores:** Cliente Registrado.  
**Precondiciones:** El usuario debe tener una suscripción con estado `ACTIVE`.

- **Flujo Básico:**
  1.  El Cliente accede a su "Panel de Suscripciones".
  2.  El Cliente selecciona una suscripción activa y pulsa "Congelar".
  3.  El Sistema solicita confirmación del periodo de pausa (opcional).
  4.  El Sistema actualiza el campo `status` a `FROZEN` en la tabla `Subscription`.
  5.  El Sistema registra la fecha en `frozenAt` para auditoría administrativa.
- **Postcondiciones:** El motor de tareas programadas (Cron Job) omitirá esta suscripción en la próxima ejecución de cobro.

---

### UC03: Aplicación de Sustitución Genérica

**Actores:** Sistema (Proceso automático).  
**Precondiciones:** El stock en PostgreSQL para el producto seleccionado es 0.

- **Flujo Básico:**
  1.  El Cliente intenta añadir el "Producto A" al carrito.
  2.  El Sistema detecta `Inventory.stock = 0`.
  3.  El Sistema invoca al **Substitution Engine (Chain of Responsibility)**.
  4.  El eslabón 1 consulta en **MongoDB** productos de la misma `category_id` con stock > 0.
  5.  El eslabón 2 busca productos con `tags` similares.
  6.  El Sistema presenta al Cliente la opción: "Producto A no disponible. ¿Deseas llevar el Producto B (Sustituto)?".
  7.  El Cliente acepta y el "Producto B" se añade al carrito.
- **Postcondiciones:** Se registra el intento de compra fallido en los logs de inventario para que el Admin tome acciones de reabastecimiento.

---

## 3. Diagramas de Casos de Uso (UML)

```mermaid
usecaseDiagram
    actor "Cliente Invitado" as guest
    actor "Cliente Registrado" as user
    actor "Admin" as admin
    actor "Stripe" as stripe <<System>>

    package "home-health System" {
        usecase "Comprar sin Login" as UC01
        usecase "Gestionar Suscripción" as UC02
        usecase "Resolver Stock (Sustitución)" as UC03
        usecase "Ver Analítica" as UC04
    }

    guest --> UC01
    guest --> UC03
    UC01 ..> stripe : <<include>>

    user --> UC01
    user --> UC02

    admin --> UC04
    admin --> UC03
```

---

> [!Observaciones] Finales
> He vinculado la lógica de los **Patrones de Diseño** directamente en los flujos. Por ejemplo, en el **UC03** queda claro cómo el **Chain of Responsibility** actúa en tiempo real.
>
> Como experto, te sugiero que en tu exposición resaltes que el **UC04** (Analítica) depende de si el Admin tiene el _scope_ correcto en el token JWT, lo cual es un punto muy fuerte en temas de **Seguridad de la Arquitectura**.

---
