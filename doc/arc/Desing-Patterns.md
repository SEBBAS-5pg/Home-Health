# Design-Patterns.md (Catálogo de Patrones de Diseño)

## Control de Versiones

| Versión | Fecha      | Descripción                                                   | Responsables             |
| :------ | :--------- | :------------------------------------------------------------ | :----------------------- |
| 1.0     | 10/04/2026 | Definición de patrones aplicables a la lógica de home-health. | [Espacio para completar] |

---

## 1. Introducción

Este documento detalla los patrones de diseño del "Gang of Four" (GoF) y patrones arquitectónicos aplicados en **home-health**. El uso de estos patrones garantiza el cumplimiento de los principios **SOLID** y facilita la mantenibilidad del sistema a largo plazo.

---

## 2. Patrones Creacionales

### 2.1 Factory Method 🏭

- **Caso de Uso:** Creación de tipos de **Suscripciones** (Mensual, Trimestral) y tipos de **Notificaciones** (SMS, Email).
- **Justificación:** Permite desacoplar la creación de objetos de su uso. Si en el futuro añadimos notificaciones vía WhatsApp, solo se crea una nueva clase en la factoría sin alterar el resto del código.
- **Beneficio:** Flexibilidad y cumplimiento de _Open/Closed Principle_.

---

## 3. Patrones de Comportamiento

### 3.1 State Pattern 🔄

- **Caso de Uso:** Gestión del flujo de los **Pedidos (Orders)**.
- **Estados:** `PEDIDO_GUEST`, `PEDIDO_PENDIENTE`, `PAGADO`, `PREPARANDO`, `EN_CAMINO`, `ENTREGADO`.
- **Justificación:** Cada estado es una clase independiente que controla las transiciones válidas. Evita el uso de condicionales anidados (`if/else`) masivos dentro del servicio de órdenes.
- **Beneficio:** Código limpio y trazabilidad absoluta del ciclo de vida del producto.

### 3.2 Chain of Responsibility ⛓️

- **Caso de Uso:** Motor de **Sustitución de Productos**.
- **Eslabones:** 1. Verificar stock del producto exacto. 2. Buscar sustituto por misma categoría. 3. Buscar sustituto por tags similares. 4. Marcar como "Sin Stock" y notificar.
- **Justificación:** Permite procesar una solicitud de compra a través de una cadena de eslabones donde cada uno decide si puede resolver la falta de stock o pasarla al siguiente.
- **Beneficio:** Desacoplamiento de la lógica de búsqueda de alternativas.

### 3.3 Observer Pattern 🔔

- **Caso de Uso:** Alertas de **Disponibilidad de Inventario**.
- **Sujeto:** `InventoryService`. **Observadores:** `NotificationService`, `UserStockWatchlist`.
- **Justificación:** Cuando el stock de un medicamento pasa de 0 a un valor positivo en la base de datos de Postgres, el sistema notifica automáticamente a todos los suscriptores interesados.
- **Beneficio:** Comunicación asíncrona y reactiva entre módulos.

### 3.4 Strategy Pattern 🎯

- **Caso de Uso:** Cálculo de **Precios y Descuentos**.
- **Estrategias:** `GuestPricingStrategy`, `MemberPricingStrategy`, `SubscriptionDiscountStrategy`.
- **Justificación:** El sistema elige en tiempo de ejecución cómo calcular el total de la compra basándose en el tipo de usuario o si el producto es parte de una suscripción automática.
- **Beneficio:** Permite cambiar algoritmos de precios sin afectar la interfaz de la pasarela de pagos.

---

## 4. Patrones Estructurales / Otros

### 4.1 Adapter / Wrapper 🎁

- **Caso de Uso:** Integración con la API de **Stripe**.
- **Justificación:** Creamos un `PaymentProvider` que envuelve las funciones de Stripe. Si en el futuro el docente pide cambiar a PayPal, solo cambiamos el "Adapter" sin tocar la lógica de negocio de las órdenes.

### 4.2 Singleton 🔐

- **Caso de Uso:** Conexión a las bases de datos (gestionado por **Prisma**).
- **Justificación:** Garantiza que solo exista una instancia del cliente de base de datos (`PrismaClient`) abierta, evitando el agotamiento de conexiones en AWS Fargate.

---

## 5. Resumen de Aplicación

| Patrón             | Módulo Impactado   | Objetivo Principal                       |
| :----------------- | :----------------- | :--------------------------------------- |
| **State**          | Logistics / Orders | Seguridad en transiciones de envío.      |
| **Chain of Resp.** | Inventory Engine   | Inteligencia de ventas (Sustitutos).     |
| **Observer**       | Notifications      | Reactividad ante cambios de stock.       |
| **Strategy**       | Billing            | Personalización de beneficios por login. |

---
