# 📋 Backlog Maestro: Proyecto home-health

| Fase               | Hito / Nivel                 | Tarea Técnica (Task)                                                  | Prioridad | Skill Asociada        |
| :----------------- | :--------------------------- | :-------------------------------------------------------------------- | :-------- | :-------------------- |
| **1. Cimientos**   | **Infraestructura de Datos** | 1.1 Configurar el entorno Base (NestJS + Next.js).                    | **Alta**  | `AGENT.md`            |
|                    |                              | 1.2 Generar `schema.prisma` híbrido (Postgres + MongoDB).             | **Alta**  | `MER-Model.md`        |
|                    |                              | 1.3 Implementar Auth Service con **Scopes** de Admin e Invitado.      | **Alta**  | `auth_rbac.md`        |
| **2. Core**        | **Motor de Inventario**      | 2.1 Crear el servicio de CRUD de productos en MongoDB.                | **Alta**  | `inventory_engine.md` |
|                    |                              | 2.2 Implementar el control de stock transaccional en PostgreSQL.      | **Alta**  | `inventory_engine.md` |
|                    |                              | 2.3 Desarrollar el **Chain of Responsibility** para sustitutos.       | **Media** | `inventory_engine.md` |
| **3. Negocio**     | **Ventas y Pagos**           | 3.1 Integrar el Wrapper de **Stripe** (Payment Intent).               | **Alta**  | `SRS_IEEE830.md`      |
|                    |                              | 3.2 Desarrollar el flujo de **Guest Checkout** con tokens temporales. | **Alta**  | `auth_rbac.md`        |
|                    |                              | 3.3 Implementar el **Patrón State** para el flujo de la Orden.        | **Media** | `HU.md`               |
| **4. Recurrencia** | **Suscripciones**            | 4.1 Crear el motor de Cron Jobs para pedidos automáticos.             | **Alta**  | `subscription.md`     |
|                    |                              | 4.2 Implementar lógica de **Congelamiento** (Frozen State).           | **Media** | `subscription.md`     |
| **5. Gestión**     | **Dashboard Admin**          | 5.1 Crear el Dashboard con gráficos de analítica (Tremor).            | **Baja**  | `HU.md`               |
|                    |                              | 5.2 Validar acceso granular de Admin por Scopes (RBAC).               | **Alta**  | `auth_rbac.md`        |
| **6. Cloud**       | **DevOps & AWS**             | 6.1 Crear los Dockerfiles y el pipeline de CI/CD.                     | **Alta**  | `aws_deploy.md`       |
|                    |                              | 6.2 Desplegar el clúster en **AWS Fargate** (ECS).                    | **Alta**  | `aws_deploy.md`       |

---

### 🧠 Explicación del "Por qué y para qué"

1.  **¿Por qué empezar por Prisma (Tarea 1.2)?**: En una arquitectura dirigida por modelos, la base de datos es el contrato. Una vez que el `schema.prisma` esté definido, la IA podrá generar tipos de datos automáticos, lo que reducirá errores de código en todas las fases siguientes.
2.  **¿Para qué la prioridad en Auth (Tarea 1.3)?**: El login de invitado es tu requerimiento más innovador. Al resolverlo temprano, aseguras que todo el flujo de carrito de compras funcione correctamente desde la primera semana.
3.  **¿Por qué el Motor de Suscripciones es Prioridad Alta (Tarea 4.1)?**: Es el núcleo del valor agregado de **home-health**. Probar la automatización de cobros toma tiempo, por lo que debe entrar en desarrollo apenas el sistema de pagos básico esté estable.

---

### 🛡️ Instrucciones para la Ejecución con IA

Para ejecutar este Backlog, debes seguir la **Lógica de Router** que definimos. Por ejemplo, cuando decidas empezar la **Tarea 2.3**, tu prompt al agente debe ser:

> _"Actúa como Senior Architect. Vamos a implementar la **Tarea 2.3** del Backlog. Carga el contexto de `doc/architecture/Design-Patterns.md` y `skills/inventory_engine.md`. Diseña la cadena de responsabilidad para buscar sustitutos en MongoDB cuando el stock en Postgres sea cero."_

---
