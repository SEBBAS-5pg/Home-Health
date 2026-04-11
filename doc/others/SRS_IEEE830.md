# Especificación de Requisitos de Software (SRS) - Proyecto Home-Health

## Control de Versiones

| Versión | Fecha      | Descripción                                                                                                  | Responsables    |
| :------ | :--------- | :----------------------------------------------------------------------------------------------------------- | :-------------- |
| 1.0     | 09/04/2026 | Definición inicial de requerimientos, alcance y arquitectura base.                                             | Sebastian Gol   |
| 1.1     | 10/04/2026 | Refinamiento de Roles (RBAC), Lógica de Sustitución, Congelamiento de Suscripciones e integración de Pagos. | Sebastian Gol   |

---

## 1. Introducción

Este documento detalla las especificaciones de requisitos para el sistema **Home-Health**, una plataforma digital diseñada para transformar la gestión de servicios farmacéuticos y de salud en el hogar. La versión 1.1 formaliza la integración de servicios financieros críticos y optimiza la lógica de negocio para garantizar la continuidad del servicio.

### 1.1 Propósito
El propósito de este documento es proporcionar una guía detallada y técnica para el desarrollo del sistema Home-Health, asegurando que todas las funcionalidades, desde la compra por invitados hasta la gestión avanzada de suscripciones, cumplan con los estándares de calidad y las necesidades del negocio. Servirá como contrato técnico entre los desarrolladores y los stakeholders.

### 1.2 Alcance del Sistema
El sistema **Home-Health** permitirá a los usuarios (registrados e invitados) adquirir productos farmacéuticos de manera ágil. La innovación principal radica en un motor de **Suscripciones Automáticas** que gestiona la distribución periódica de suministros médicos. 
El alcance incluye:
- **Motor de Pagos:** Integración con Stripe (Sandbox) para procesamiento seguro y "stateless".
- **Venta Guest:** Flujo de compra simplificado sin necesidad de registro previo.
- **Gestión de Suscripciones:** Automatización de pedidos recurrentes con opciones de pausa/congelamiento.
- **Logística Inteligente:** Sistema de sustitución de productos basado en categorías y estados de envío automatizados.

### 1.3 Definiciones y Acrónimos
- **SRS:** Software Requirements Specification.
- **RBAC:** Role-Based Access Control (Control de Acceso Basado en Roles).
- **Stripe Sandbox:** Entorno de pruebas para validación de pasarelas de pago.
- **Sustitución Genérica:** Lógica para reemplazar un producto agotado por un equivalente funcional (Chain of Responsibility).
- **Persistencia Políglota:** Uso de múltiples tecnologías de bases de datos (PostgreSQL + MongoDB).

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
Home-Health actúa como un ecosistema centralizado que conecta el inventario de farmacia con el cliente final. Se diferencia por su capacidad de manejar suscripciones recurrentes y el procesamiento de pagos para usuarios invitados, optimizando la recurrencia mediante automatización.

### 2.2 Funciones del Producto (Refinado)
1.  **Venta Omnicanal con Stripe:** Procesamiento de pagos robusto para invitados y clientes registrados, eliminando la fricción en el checkout.
2.  **Motor de Suscripciones SaaS:** Manejo proactivo del ciclo de vida de suscripciones (Activa, Congelada, Cancelada) mediante tareas programadas (Cron Jobs).
3.  **Algoritmo de Sustitución Inteligente:** Uso de patrones de diseño como *Chain of Responsibility* para encontrar sustitutos por categoría o etiquetas en MongoDB.
4.  **Gestión de Estados Logísticos:** Seguimiento preciso de pedidos mediante el patrón **State**, garantizando trazabilidad total.
5.  **Panel Administrativo de Alta Fidelidad:** Visualización de métricas financieras y gestión de inventario con segregación de privilegios.

### 2.3 Características de los Usuarios
- **Cliente (Invitado/Registrado):** Persona que consulta el catálogo y realiza compras. Los usuarios registrados poseen un panel de gestión para sus suscripciones.
- **Administrador (Perfil Modular):** Usuario con acceso a la gestión operativa. Sus capacidades están definidas por privilegios específicos:
  - **Económico (Comercial):** Acceso a reportes de ventas, KPIs financieros y motor de pagos.
  - **Logístico (Inventario):** Control de stock, reglas de sustitución y monitoreo de despachos.
  - **Full Admin:** Posee ambos privilegios para una gestión integral.
- **Repartidor/Logística:** Encargado de actualizar el estado de los domicilios en tiempo real.

### 2.4 Restricciones del Sistema
- **Infraestructura:** Uso obligatorio de **AWS Fargate** para el despliegue de contenedores (Serverless).
- **Arquitectura:** Los diagramas deben seguir el modelo **C4** (Niveles 1, 2 y 3).
- **Calidad de Código:** Adherencia estricta a principios **Clean Code** y la **Regla del Scout**.
- **Base de Datos:** PostgreSQL para transacciones financieras y MongoDB para el catálogo/imágenes.

---

## 3. Requisitos Específicos

### 3.1 Requisitos Funcionales (RF)

| ID       | Requisito                             | Prioridad | Criterio de Aceptación                                                                                                                                      |
| :------- | :------------------------------------ | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RF01** | **Integración de Pagos (Stripe)**     | Crítica   | El sistema debe procesar transacciones mediante Stripe API sin almacenar datos sensibles de tarjetas en la base de datos local.                              |
| **RF02** | **Gestión de Suscripciones**          | Alta      | El usuario debe poder crear, pausar ("congelar") y cancelar suscripciones. El sistema generará pedidos automáticos según el periodo definido.               |
| **RF03** | **Sustitución Automática de Stock**   | Alta      | Si un producto de suscripción llega a stock cero, el sistema debe buscar y seleccionar automáticamente un sustituto basado en tags y categoría en MongoDB. |
| **RF04** | **Flujo Logístico Determinista**      | Media     | Cada pedido debe transitar por los estados: `PENDIENTE` -> `PREPARANDO` -> `EN_CAMINO` -> `ENTREGADO` sin saltos inválidos (Patrón State).                 |
| **RF05** | **Gestión Granular de Privilegios**   | Alta      | El sistema permite asignar de forma independiente privilegios de "Inventario" y "Finanzas" a cuentas administrativas (Custom Claims JWT).                    |

### 3.2 Requisitos No Funcionales (RNF)

| ID        | Categoría               | Descripción                                                                                                                             |
| :-------- | :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **RNF01** | **Seguridad y Claims**  | Los privilegios administrativos se validan mediante *Custom Claims* en tokens JWT (`is_commercial`, `is_inventory`).                      |
| **RNF02** | **Arquitectura Decoupled** | El servicio de sustitución está desacoplado de la lógica de ventas para permitir evolucionar el algoritmo sin afectar el checkout.       |
| **RNF03** | **Escalabilidad**       | La API debe manejar ráfagas de tráfico mediante el auto-escalado de AWS Fargate.                                                         |
| **RNF04** | **Rendimiento**         | El tiempo de respuesta para consultas al catálogo en MongoDB no debe superar los 200ms.                                                  |
| **RNF05** | **Mantenibilidad**      | El código debe pasar auditorías de linter y mantener una cobertura de pruebas unitarias superior al 70%.                                 |

---

## 4. Trazabilidad y Modelos

### 4.1 Referencias Arquitectónicas
- **Modelo C4:** Ver documentación en `/doc/architecture`.
- **Patrones Implementados:** State (Logística), Chain of Responsibility (Sustituciones), Factory (Suscripciones).
- **Stack Tecnológico:** NestJS, Next.js, Prisma ORM, MongoDB, PostgreSQL.

### 4.2 Próximas Incorporaciones
- Esquema de Datos de Stripe.
- Diagramas de Secuencia para el Motor de Cron Jobs.
