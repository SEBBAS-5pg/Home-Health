# 🏛️ Arquitectura de Software - Modelo C4

Este documento detalla la arquitectura del sistema **Home-Health** utilizando el modelo C4 (Contexto, Contenedores, Componentes). Esta metodología permite visualizar la estructura del software en diferentes niveles de abstracción, facilitando la comunicación técnica y la planificación de la infraestructura.

## Control de Versiones

| Versión | Fecha      | Descripción                                               | Responsables  |
| :------ | :--------- | :-------------------------------------------------------- | :------------ |
| 1.0     | 09/04/2026 | Definición inicial de los niveles 1, 2 y 3 del modelo C4. | Sebastian Gol |

---

## 🌎 Nivel 1: Diagrama de Contexto

El diagrama de contexto muestra el panorama general del sistema **Home-Health** y cómo interactúa con los usuarios y servicios externos de terceros.

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#1168bd',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#08427b',
    'lineColor': '#444444',
    'secondaryColor': '#999999',
    'tertiaryColor': '#ffffff',
    'edgeLabelColor': '#8b0000'
  }
}}%%
C4Context
    title Diagrama de Contexto: Sistema Home-Health

    Enterprise_Boundary(b0, "Ecosistema Home-Health") {
        Boundary(b1, "Actores del Sistema", "Usuarios finales") {
            Person(customer, "Cliente", "Busca productos médicos, realiza compras y gestiona sus suscripciones.")
            Person(admin, "Administrador", "Gestiona el inventario, catálogo y supervisa los pedidos realizados.")
        }

        System(home_health, "Sistema Home-Health", "Plataforma central de farmacia y servicios de suscripción médica.")

        Boundary(b2, "Proveedores Externos", "Servicios de Terceros") {
            System_Ext(stripe, "Stripe", "Pasarela de pagos y facturación periódica.")
            System_Ext(aws_notif, "AWS SES/SNS", "Servicio de notificaciones transaccionales (Email/SMS).")
        }
    }

    Rel(customer, home_health, "Realiza pedidos y suscripciones", "HTTPS")
    Rel(admin, home_health, "Gestiona tienda e inventario", "HTTPS")

    Rel_R(home_health, stripe, "Procesa cobros y pagos", "API")
    Rel_L(home_health, aws_notif, "Envía alertas y correos", "SDK")

    UpdateLayoutConfig($c4ShapeInRow="1", $c4BoundaryInRow="1")
```

---

## 📦 Nivel 2: Diagrama de Contenedores

Este nivel hace "zoom" dentro del sistema para identificar las aplicaciones, servicios y bases de datos que lo componen, fundamentales para el despliegue en **AWS Fargate**.

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#1168bd',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#08427b',
    'lineColor': '#444444',
    'secondaryColor': '#999999',
    'tertiaryColor': '#ffffff',
    'edgeLabelColor': '#8b0000'
  }
}}%%
C4Container
    title Diagrama de Contenedores: Sistema Home-Health

    Person(user, "Usuario", "Cliente final o administrador del sistema.")

    System_Boundary(b1, "Plataforma Home-Health") {
        Container(frontend, "Web App (Frontend)", "Next.js, Tailwind", "Proporciona la interfaz de usuario, gestión de estado y renderizado SSR.")
        Container(api, "Backend API", "NestJS", "Maneja la lógica de negocio, autenticación y orquestación de servicios.")

        Boundary(b_data, "Capa de Datos", "Almacenamiento persistente") {
            ContainerDb(db_sql, "Base de Datos Relacional", "PostgreSQL (RDS)", "Almacena datos transaccionales, usuarios, roles y pedidos.")
            ContainerDb(db_nosql, "Base de Datos NoSQL", "MongoDB (Atlas)", "Almacena catálogo de productos, reglas de sustitución y metadatos.")
        }
    }

    System_Ext(stripe, "Stripe API", "Pasarela de pagos externa.")

    Rel(user, frontend, "Interactúa con", "HTTPS / Browser")
    Rel(frontend, api, "Consume servicios API", "JSON / HTTPS")

    Rel(api, db_sql, "Persiste pedidos y stock", "Prisma / SQL")
    Rel(api, db_nosql, "Consulta catálogo dinámico", "BSON / NoSQL")

    Rel_R(api, stripe, "Procesa transacciones financieras", "HTTPS / REST")

    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```

---

## 🧱 Nivel 3: Diagrama de Componentes (Backend API)

Detalle interno del contenedor **Backend API**, resaltando la implementación de patrones de diseño tácticos.

```mermaid
C4Component
    title Diagrama de Componentes - API Application (Backend Core)

    %% Elementos Externos al Contenedor
    Container(web_app, "Web App (Frontend)", "Next.js", "Proporciona la interfaz de usuario para clientes y administradores.")
    System_Ext(stripe, "Stripe API", "Pasarela de pagos externa para procesamiento de transacciones.")

    %% Frontera de la Aplicación API
    Container_Boundary(api_app, "API Application (NestJS)") {

        %% Módulo de Identidad
        Component(auth_comp, "Auth Service", "NestJS JWT", "Gestiona autenticación RBAC, login y tokens temporales.")

        %% Dominio de Productos
        Boundary(product_logic, "Product Logic") {
            Component(product_comp, "Product Controller", "NestJS", "Orquesta catálogo y disponibilidad.")
            Component(sub_engine, "Substitution Engine", "Chain of Responsibility", "Lógica de reemplazo basada en categorías/tags.")
        }

        %% Dominio de Operaciones
        Boundary(order_logic, "Order & Payment Logic") {
            Component(order_comp, "Order Service", "State Pattern", "Gestiona el ciclo de vida del pedido (Máquina de estados).")
            Component(subscription_comp, "Subscription Service", "Cron Jobs", "Automatiza órdenes recurrentes y congelamiento.")
            Component(payment_comp, "Payment Gateway Wrapper", "Stripe SDK", "Encapsula la lógica de comunicación financiera.")
        }

        %% Soporte y Notificaciones
        Boundary(support_logic, "Support & Inventory") {
            Component(inventory_comp, "Inventory Service", "Observer Pattern", "Monitorea stock y emite eventos de disponibilidad.")
            Component(notif_comp, "Notification Service", "AWS SDK (SES/SNS)", "Envía correos y SMS según preferencias.")
        }
    }

    %% Capa de Persistencia
    ContainerDb(rel_db, "Transaccional DB", "PostgreSQL (RDS)", "Almacena pedidos, stock y datos estructurados.")
    ContainerDb(nosql_db, "Catalog DB", "MongoDB (Atlas)", "Almacena catálogo y reglas flexibles de sustitución.")

    %% Relaciones de Interfaz (Inbound)
    Rel(web_app, auth_comp, "Solicita acceso", "JSON/HTTPS")
    Rel(web_app, product_comp, "Consulta productos", "JSON/HTTPS")
    Rel(web_app, order_comp, "Crea/Sigue pedidos", "JSON/HTTPS")

    %% Relaciones Internas (Lógica de Negocio)
    Rel_D(product_comp, sub_engine, "Consulta sustitutos si stock=0", "Internal")
    Rel_D(order_comp, payment_comp, "Inicia transacción", "Internal")
    Rel_D(order_comp, inventory_comp, "Reserva/Libera stock", "Internal")
    Rel_R(inventory_comp, notif_comp, "Dispara alerta de reposición", "Events")
    Rel_U(subscription_comp, order_comp, "Genera pedido recurrente", "Internal")

    %% Relaciones de Infraestructura (Outbound)
    Rel(payment_comp, stripe, "Procesa pago", "HTTPS/TLS")
    Rel(product_comp, nosql_db, "Consulta catálogo", "Mongoose")
    Rel(order_comp, rel_db, "Persiste pedidos", "Prisma")
    Rel(inventory_comp, rel_db, "Actualiza stock", "Prisma")
    Rel(sub_engine, nosql_db, "Lee reglas", "Mongoose")
```

---

## 🧠 Justificación Arquitectónica y Patrones

> [!IMPORTANT]
>
> ### Decisiones de Diseño Clave:
>
> 1.  **Desacoplamiento de Datos:** El Backend API actúa como un mediador para la persistencia políglota, aislando al Frontend de la complejidad de manejar dos motores de base de datos.
> 2.  **Seguridad y Cumplimiento:** Los datos sensibles de pago se delegan a **Stripe**, asegurando que la infraestructura de Home-Health no almacene información financiera crítica.
> 3.  **Patrones de Diseño Implementados:**
>     - **Chain of Responsibility (Substitution Engine):** Permite una búsqueda jerárquica de productos alternativos de forma extensible.
>     - **State Pattern (Order Service):** Garantiza transiciones de estado legales y un ciclo de vida de pedidos auditable.
>     - **Observer Pattern (Inventory Service):** Automatiza la comunicación de eventos de stock (como reposiciones) hacia el sistema de notificaciones.
> 4.  **Preparación Cloud:** La división en contenedores claros facilita la orquestación en **AWS Fargate**, permitiendo un escalado independiente de la interfaz y la lógica de negocio.
