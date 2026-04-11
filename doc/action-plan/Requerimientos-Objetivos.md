# Definición de Requerimientos y Objetivos

Esta fase es el "Norte" del proyecto. Sin objetivos claros, la arquitectura se vuelve errática.

| Requerimiento / Necesidad     | Objetivo Técnico                                                              | Impacto en el Negocio                                   |
| :---------------------------- | :---------------------------------------------------------------------------- | :------------------------------------------------------ |
| **Compra sin Login (Guest)**  | Implementación de sesiones temporales (Stateless) y persistencia en caché/DB. | Elimina la fricción de compra y aumenta la conversión.  |
| **Suscripciones Automáticas** | Creación de un motor de tareas programadas (Cron Jobs) y manejo de estados.   | Fidelización y flujo de caja recurrente (modelo SaaS).  |
| **Gestión de Sustitutos**     | Aplicación del patrón **Chain of Responsibility** para buscar alternativas.   | Evita la pérdida de ventas por falta de stock.          |
| **Roles Administrativos**     | RBAC (Role-Based Access Control) con dashboards en tiempo real.               | Control total sobre la operación económica y logística. |
| **Escalabilidad en la Nube**  | Despliegue en **AWS Fargate** (Serverless Containers).                        | Alta disponibilidad sin gestionar servidores físicos.   |

---
