# Home-Health

![Version](https://img.shields.io/badge/version-1.1-blue.svg)
![Architecture](https://img.shields.io/badge/architecture-Microservices-orange)
![Deploy](https://img.shields.io/badge/deploy-AWS_Fargate-yellow)

**Home-Health** es una plataforma digital avanzada diseñada para transformar la gestión de servicios farmacéuticos y de salud en el hogar. A través de un ecosistema altamente escalable, conecta el inventario farmacéutico con el cliente final, optimizando la recurrencia mediante automatización de suscripciones y un procesamiento de pagos sin fricción.

## 🚀 Características Principales

- **Motor de Suscripciones (SaaS):** Automatización del ciclo de vida de compras recurrentes (activación, congelamiento, cancelación) mediante flujos programados y gestión inteligente de pedidos.
- **Sustitución Inteligente de Stock:** Implementación del patrón *Chain of Responsibility* para sugerir automáticamente equivalentes funcionales si un producto se encuentra agotado (basado en categorías y etiquetas en MongoDB).
- **Logística con Estados Deterministas:** Trazabilidad precisa de pedidos (Pendiente -> Preparando -> En Camino -> Entregado) garantizada a través del patrón *State*.
- **Pagos Omnicanales Seguros:** Integración directa con **Stripe** para procesamiento de transacciones *stateless*, permitiendo tanto compras para usuarios invitados (Guest) como recurrentes.
- **Autorización Granular (RBAC):** Sistema de control de acceso modular basado en *Custom Claims JWT*, separando operaciones comerciales y financieras de la gestión de inventario y logística.

## 🛠️ Stack Tecnológico

El proyecto apuesta por el rendimiento, la escalabilidad y los estándares corporativos.

- **Frontend:** Next.js 15 (Server-First), Tailwind CSS, Tremor.
- **Backend:** NestJS, Prisma ORM, Stripe API (Sandbox).
- **Persistencia Políglota:**
  - **PostgreSQL:** Integridad transaccional y financiera, manejo de usuarios y suscripciones.
  - **MongoDB:** Flexibilidad y agilidad para el manejo del catálogo de productos y atributos dinámicos.
- **Infraestructura:** Despliegue de contenedores Serverless ejecutados de manera orquestada sobre **AWS Fargate**.

## 🏗️ Arquitectura y Diseño

El proyecto cuenta con un fuerte enfoque en el diseño de software corporativo:
- **Diseño Arquitectónico:** Modelado estandarizado utilizando el marco de trabajo **C4** (Niveles 1, 2 y 3).
- **Calidad de Código:** Adherencia a los principios **SOLID** y estricto cumplimiento de **Clean Code** ("Regla del Scout").
- **Orquestación Modular (AGENTS):** El repositorio está gobernado por guías de desarrollo autónomo (`AGENTS.md`) que dictan las normas transversales, reglas de cumplimiento y arquitectura (Guardrails & SDD Workflow).

## 📚 Documentación

La documentación técnica exhaustiva reside en la ruta `/doc` y anexos de orquestación.

- [Especificación de Requisitos de Software (SRS)](doc/others/SRS_IEEE830.md)
- Modelos Arquitectónicos y ADRs: `doc/architecture/`
- Matriz de Trazabilidad y Procesos: `doc/manual/trazabilidad.md`
- Core Orchestrator: `AGENTS.md` (y archivos localizados en la carpeta `skills/`)

## 📋 Estructura Organizativa (Monorepo)

```text
/
├── api/             # Capa Backend con NestJS y componentes API REST
├── ui/              # Capa Frontend con panel administrativo Next.js
├── doc/             # Repositorio central de conocimientos documentados de Ingeniería
└── skills/          # Directorio de guardrails e instrucciones específicas de SDD
```
