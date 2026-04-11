# 🏛️ Modelo Entidad-Relación (MER) Técnico - Home-Health

Este documento describe la arquitectura de datos híbrida para el proyecto **Home-Health**. El modelo está optimizado para su implementación con **Prisma ORM** y sigue principios de **Clean Code** en la nomenclatura de atributos, garantizando escalabilidad y mantenibilidad.

## Control de Versiones

| Versión | Fecha      | Descripción                                                                 | Responsables  |
| :------ | :--------- | :-------------------------------------------------------------------------- | :------------ |
| 1.0     | 09/04/2026 | Definición inicial de entidades y relaciones híbridas (Postgres/Mongo).      | Sebastian Gol |

---

## 🚀 Arquitectura de Persistencia Híbrida

El sistema utiliza una estrategia de **Persistencia Políglota** para aprovechar lo mejor de dos mundos:

- **PostgreSQL:** Maneja el núcleo transaccional, auditoría e integridad referencial.
- **MongoDB:** Gestiona el catálogo dinámico de productos y la inteligencia de sustitución.

---

## 1. PostgreSQL: Núcleo Transaccional y Auditoría

_Uso: Integridad referencial, control de stock, gestión financiera y trazabilidad de estados._

| Entidad            | Atributos Técnicos                                        | Auditoría (Metadata)                     | Propósito / Notas                                                                   |
| :----------------- | :-------------------------------------------------------- | :--------------------------------------- | :---------------------------------------------------------------------------------- |
| **User**           | `id` (UUID), `email`, `password`, `is_guest` (Bool)       | `createdAt`, `updatedAt`, `lastLogin`    | Identidad del sistema y soporte para compras anónimas.                              |
| **Permission**     | `id` (Int), `name` (COMMERCIAL \| INVENTORY)              | `createdAt`                              | Define los alcances para el modelo de administración RBAC.                          |
| **UserPermission** | `userId`, `permissionId`                                  | `assignedAt`, `assignedBy`               | Tabla de unión para privilegios modulares.                                          |
| **Inventory**      | `productId` (String), `stock`, `minStock`                 | `updatedAt`, `version`                   | **Control crítico de stock** con bloqueo optimista.                                 |
| **Order**          | `id`, `userId`, `total`, `status` (Enum), `paymentId`     | `createdAt`, `processedAt`, `ipAddress`  | Registro de ventas y estados del patrón **State**.                                  |
| **OrderItem**      | `id`, `orderId`, `productId`, `qty`, `priceSnapshot`      | N/A                                      | Detalle de línea de pedido; el snapshot asegura la integridad del precio histórico. |
| **Subscription**   | `id`, `userId`, `status` (ACTIVE \| FROZEN), `period`     | `createdAt`, `frozenAt`, `nextExecution` | Gestión de recurrencia y motor de cobros.                                           |
| **Payment**        | `id`, `stripeId`, `amount`, `currency`, `status`          | `createdAt`, `confirmedAt`, `auditLogs`  | Trazabilidad completa de la pasarela Stripe.                                        |
| **AuditLog**       | `id`, `action`, `entity`, `entityId`, `userId`, `payload` | `timestamp`                              | Registro inmutable de cambios administrativos globales.                             |

---

## 2. MongoDB: Catálogo e Inteligencia de Sustitución

_Uso: Alta flexibilidad, velocidad de lectura multimedia y relaciones de similitud complejas._

| Colección       | Estructura Principal (Schema-less)                              | Propósito Funcional                                           |
| :-------------- | :-------------------------------------------------------------- | :------------------------------------------------------------ |
| **Products**    | `{ _id, name, description, category_id, tags: [], images: [] }` | Datos ricos, multimedia y SEO del catálogo.                   |
| **Categories**  | `{ _id, name, description, active: bool }`                      | Clasificación jerárquica para navegación y lógica de negocio. |
| **Substitutes** | `{ product_id, substitute_ids: [], score, logic }`              | Configuración para el motor de **Chain of Responsibility**.   |

---

## 📊 Visualización del Modelo (Mermaid)

```mermaid
erDiagram
    USER ||--o{ ORDER : "realiza"
    USER ||--o{ SUBSCRIPTION : "gestiona"
    USER ||--o{ USER_PERMISSION : "posee"
    PERMISSION ||--o{ USER_PERMISSION : "define"

    ORDER ||--|| PAYMENT : "genera"
    ORDER ||--o{ ORDER_ITEM : "contiene"

    INVENTORY ||--o{ ORDER_ITEM : "abastece"

    USER {
        uuid id PK
        string email
        string password
        boolean is_guest
        datetime createdAt
    }

    PERMISSION {
        int id PK
        string name "COMMERCIAL | INVENTORY"
    }

    USER_PERMISSION {
        uuid userId FK
        int permissionId FK
        datetime assignedAt
    }

    ORDER {
        uuid id PK
        uuid userId FK
        float total
        string status "State Pattern"
        datetime createdAt
    }

    ORDER_ITEM {
        uuid id PK
        uuid orderId FK
        string productId "Ref: MongoDB"
        int qty
        float priceSnapshot
    }

    INVENTORY {
        string productId PK "Ref: MongoDB"
        int stock
        int minStock
        datetime updatedAt
    }

    SUBSCRIPTION {
        uuid id PK
        uuid userId FK
        string status "ACTIVE | FROZEN"
        int frequency_days
        datetime nextExecution
    }

    PAYMENT {
        uuid id PK
        string stripeId "Stripe UID"
        float amount
        string status
        datetime confirmedAt
    }

    MONGODB_CATALOG {
        string _id PK
        string name
        string category
        string tags
    }

    MONGODB_CATALOG .. ORDER_ITEM : "Referencia Desacoplada"
    MONGODB_CATALOG .. INVENTORY : "Sincronización de Stock"
```

---

## 🌉 Explicación del "Puente" de Datos

> [!IMPORTANT]
> Esta arquitectura utiliza un modelo de **Referencia por ID Desacoplado**. PostgreSQL nunca realiza _JOINS_ físicos con MongoDB a nivel de base de datos.

### Funcionamiento del Puente:

1.  **Referencia por ID:** PostgreSQL almacena el `productId` de MongoDB como un campo `String`. La integridad se garantiza a nivel de capa de aplicación (Services en NestJS).
2.  **Consultas Paralelas:** Al recuperar una orden, el sistema consulta Postgres para el estado/pago y Mongo en paralelo para obtener los detalles visuales (nombres, imágenes) del producto.
3.  **Inmutabilidad de Venta (`priceSnapshot`):** Para evitar que fluctuaciones de precio en el catálogo afecten pedidos pasados, el precio se captura y persiste en SQL al momento del "Checkout".
4.  **Integridad de Stock en SQL:** Aunque los metadatos viven en Mongo, el **conteo físico de existencias** reside en PostgreSQL. Esto permite utilizar **Transacciones ACID** para evitar el sobre-vender productos durante picos de tráfico.

---
