# Trazabilidad.md (Matriz de Trazabilidad de Requisitos)

## Control de Versiones

| Versión | Fecha      | Descripción                                      | Responsables    |
| :------ | :--------- | :----------------------------------------------- | :-------------- |
| 1.0     | 11/04/2026 | Vinculación de SRS, HU, UC y Patrones de Diseño. | [Sebastian Gol] |

---

## 1. Introducción

Este documento establece la relación bidireccional entre los requisitos definidos en el **SRS**, las **Historias de Usuario (HU)**, los **Casos de Uso (UC)** y los componentes arquitectónicos. Su objetivo es garantizar que el 100% de los requisitos sean cubiertos por el diseño y la implementación.

---

## 2. Matriz de Trazabilidad Integral

| ID Requisito (SRS) | Descripción del Requisito | Historia de Usuario (HU) | Caso de Uso (UC) | Patrón / Componente Arquitectónico |
| :----------------- | :------------------------ | :----------------------- | :--------------- | :--------------------------------- |
| **RF01**           | Compra como Invitado      | **HU01**                 | **UC01**         | Stateless Auth / Stripe Adapter    |
| **RF02**           | Gestión de Suscripciones  | **HU03, HU04**           | **UC02**         | Factory Method / Cron Job Service  |
| **RF03**           | Sustitución Automática    | **HU05**                 | **UC03**         | **Chain of Responsibility**        |
| **RF04**           | Notificaciones de Stock   | **HU02**                 | Lógica Sistema   | **Observer Pattern** / AWS SES     |
| **RF05**           | Dashboard Comercial       | **HU06**                 | **UC04**         | Strategy Pattern / Websockets      |
| **RF06**           | Gestión de Roles (RBAC)   | **HU04**                 | **UC04**         | Custom Claims (JWT) / Scopes       |
| **RNF01**          | Escalabilidad             | Todas                    | N/A              | **AWS Fargate** (Containers)       |
| **RNF02**          | Persistencia Políglota    | Todas                    | N/A              | Prisma (PostgreSQL + MongoDB)      |
| **RNF05**          | Mantenibilidad            | Todas                    | N/A              | **Clean Code** / Scout Rule        |

---

## 3. Mapa de Cobertura de Patrones

Para tu defensa del proyecto, esta tabla resume cómo los patrones GoF resuelven los retos del SRS:

- **State Pattern:** Resuelve la trazabilidad de los estados de envío en **RF04**.
- **Strategy Pattern:** Resuelve la variabilidad de precios (Invitado vs Miembro) en **RF01/RF05**.
- **Observer Pattern:** Resuelve el desacoplamiento entre el inventario y el sistema de alertas en **RF04**.
- **Chain of Responsibility:** Resuelve la lógica de búsqueda de alternativas en **RF03**.

---

> [!Observaciones] Finales
> La matriz confirma que **home-health** es un sistema coherente. Nota que los **Requisitos No Funcionales (RNF)** no tienen un Caso de Uso específico porque son transversales a todo el sistema (ej. el uso de AWS Fargate afecta a todas las funcionalidades).
>
> Presentar esta matriz le da un "plus" de madurez a tu documentación, ya que es una herramienta típica de proyectos CMMI o estándares de alta calidad.

---
