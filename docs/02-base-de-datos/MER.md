# 🏛️ Modelo Entidad-Relación (MER) — Home-Health

Este documento describe la estructura de datos del sistema **Home-Health**, diseñada a partir de las historias de usuario, criterios de aceptación y funcionalidades definidas para el MVP del proyecto.

El modelo está orientado a una arquitectura REST utilizando:

- PostgreSQL como sistema gestor de base de datos relacional
- Prisma ORM para la gestión de entidades y relaciones
- NestJS para la implementación del backend

El objetivo del MER es garantizar:

- Integridad de datos
- Escalabilidad
- Coherencia entre módulos
- Trazabilidad de pedidos e inventario

---

# 📌 Control de Versiones

| Versión | Fecha | Descripción | Responsables |
| :-- | :-- | :-- | :-- |
| 1.0 | 01/05/2026 | Definición inicial de entidades y relaciones del sistema. | Sebastian Puentes, Karina Cantillo, Danay Pereira |
| 2.0 | 09/05/2026 | Refinamiento del MER alineado con historias de usuario, servicios REST y MVP del proyecto. | Sebastian Puentes, Karina Cantillo, Danay Pereira |
| 2.1 | 10/05/2026 | Incorporación de la entidad `Category`, ajustes de relaciones, definición de consideraciones técnicas y alineación arquitectónica con el modelo de dominio. | Sebastian Puentes, Karina Cantillo, Danay Pereira |

---

# 🚀 Arquitectura de Persistencia

El sistema utiliza una arquitectura relacional basada completamente en PostgreSQL debido a que el dominio del proyecto requiere:

- Integridad transaccional
- Relaciones estructuradas
- Consistencia en pedidos e inventario
- Validación de estados y trazabilidad

La arquitectura de persistencia se encuentra alineada con los servicios REST definidos en el sistema:

| Servicio | Entidades Relacionadas |
| :-- | :-- |
| Autenticación | User |
| Usuarios | User |
| Productos | Product, Category |
| Inventario | InventoryMovement |
| Pedidos | Order, OrderItem |
| Vencimientos | Product |
| Reportes | Consultas sobre múltiples entidades |
| Notificaciones | Notification |

---

# 🧩 Entidades del Sistema

## 1. User

Representa los usuarios autenticados del sistema.

| Campo | Tipo |
| :-- | :-- |
| id | UUID |
| full_name | VARCHAR |
| email | VARCHAR |
| phone | VARCHAR |
| password | VARCHAR |
| role | ENUM (CLIENT, ADMIN) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## 2. Category

Representa las categorías utilizadas para clasificar los medicamentos del catálogo.

| Campo | Tipo |
| :-- | :-- |
| id | UUID |
| name | VARCHAR |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## 3. Product

Representa los medicamentos disponibles en el catálogo.

| Campo | Tipo |
| :-- | :-- |
| id | UUID |
| name | VARCHAR |
| category_id | UUID (FK) |
| description | TEXT |
| price | DECIMAL |
| stock | INTEGER |
| expiration_date | DATE |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## 4. InventoryMovement

Registra entradas y salidas de inventario.

| Campo | Tipo |
| :-- | :-- |
| id | UUID |
| product_id | UUID (FK) |
| movement_type | ENUM (ENTRY, EXIT) |
| quantity | INTEGER |
| observation | TEXT |
| resulting_stock | INTEGER |
| created_at | TIMESTAMP |

---

## 5. Order

Representa los pedidos realizados por los clientes.

| Campo | Tipo |
| :-- | :-- |
| id | UUID |
| user_id | UUID (FK) |
| delivery_address | VARCHAR |
| status | ENUM (PENDING, PREPARING, ON_THE_WAY, DELIVERED, REJECTED) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## 6. OrderItem

Representa los productos contenidos dentro de un pedido.

| Campo | Tipo |
| :-- | :-- |
| id | UUID |
| order_id | UUID (FK) |
| product_id | UUID (FK) |
| quantity | INTEGER |
| unit_price | DECIMAL |

---

## 7. Notification

Representa las notificaciones internas del sistema.

| Campo | Tipo |
| :-- | :-- |
| id | UUID |
| user_id | UUID (FK) |
| type | ENUM (LOW_STOCK, EXPIRATION, NEW_ORDER) |
| title | VARCHAR |
| message | TEXT |
| is_read | BOOLEAN |
| created_at | TIMESTAMP |

---

# 🔗 Relaciones del Sistema

| Relación | Cardinalidad |
| :-- | :-- |
| User → Order | 1:N |
| User → Notification | 1:N |
| Order → OrderItem | 1:N |
| Product → OrderItem | 1:N |
| Product → InventoryMovement | 1:N |
| Category → Product | 1:N |

---

# 📊 Diagrama MER (Mermaid)

```mermaid
erDiagram

    USER ||--o{ ORDER : places
    USER ||--o{ NOTIFICATION : receives

    ORDER ||--o{ ORDER_ITEM : contains

    CATEGORY ||--o{ PRODUCT : classifies

    PRODUCT ||--o{ ORDER_ITEM : included_in
    PRODUCT ||--o{ INVENTORY_MOVEMENT : registers

    USER {
        uuid id PK
        string full_name
        string email
        string phone
        string password
        enum role
        timestamp created_at
        timestamp updated_at
    }

    CATEGORY {
        uuid id PK
        string name
        timestamp created_at
        timestamp updated_at
    }

    PRODUCT {
        uuid id PK
        uuid category_id FK
        string name
        text description
        decimal price
        int stock
        date expiration_date
        timestamp created_at
        timestamp updated_at
}

    INVENTORY_MOVEMENT {
        uuid id PK
        uuid product_id FK
        enum movement_type
        int quantity
        text observation
        int resulting_stock
        timestamp created_at
    }

    ORDER {
        uuid id PK
        uuid user_id FK
        string delivery_address
        enum status
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal unit_price
    }

    NOTIFICATION {
        uuid id PK
        uuid user_id FK
        enum type
        string title
        text message
        boolean is_read
        timestamp created_at
    }
````

---

# 📌 Consideraciones Técnicas

## Control de Inventario

El stock de productos se administra directamente desde la entidad `Product`, mientras que la trazabilidad histórica se conserva mediante `InventoryMovement`.

---

## Gestión de Vencimientos

El módulo de vencimientos no utiliza una entidad independiente, ya que la lógica se basa directamente en el atributo:

```text
Product.expiration_date
```

Las alertas y consultas se generan dinámicamente a partir de esta fecha.

---

## Gestión de Pedidos

La relación entre `Order` y `OrderItem` permite:

* múltiples productos por pedido,
* control individual de cantidades,
* preservación del precio unitario histórico.

---

## Notificaciones Internas

Las notificaciones permiten centralizar eventos importantes del sistema como:

* stock bajo,
* productos vencidos,
* nuevos pedidos.

Durante el alcance MVP del proyecto, las notificaciones serán generadas únicamente para usuarios con rol administrador, permitiendo centralizar eventos importantes relacionados con inventario, vencimientos y gestión de pedidos.

---

## Reportes

El módulo de reportes no utiliza entidades propias dentro del modelo relacional, ya que su funcionalidad se basa en consultas agregadas y filtradas sobre múltiples entidades del sistema como `Product`, `Order`, `OrderItem` e `InventoryMovement`.

Esta decisión permite evitar redundancia de información y mantener consistencia entre los datos operacionales y los reportes generados dinámicamente.

---

## Consistencia Transaccional

Las operaciones relacionadas con actualización de stock y procesamiento de pedidos deberán ejecutarse de manera transaccional para garantizar la integridad de los datos y evitar inconsistencias como stock negativo o pedidos procesados con inventario insuficiente.